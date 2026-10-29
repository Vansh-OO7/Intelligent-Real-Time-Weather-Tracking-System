"""
Train forecast (+1h/+3h/+6h change in temperature, humidity, pressure) and rain
(next 1h / 3h) models on the Open-Meteo dataset, and evaluate them honestly.

Run from anywhere:
    python ml/scripts/train.py --sample-frac 0.3        # fast first run
    python ml/scripts/train.py                          # full data
    python ml/scripts/train.py --use-static             # add lat/lon/elevation features

Splits are by TIME (never random):
    train  : start .. --train-end
    valid  : (train-end, valid-end]   used for early stopping and rain calibration
    test   : after valid-end + 1 day  used only for the final report
Climatology ("normal" per hour of year) is fitted on the TRAIN period only.
"""
import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import joblib
import lightgbm as lgb
import numpy as np
import pandas as pd
from sklearn.isotonic import IsotonicRegression
from sklearn.metrics import average_precision_score, brier_score_loss, roc_curve

ML_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ML_DIR / "src"))
import features as F  # noqa: E402

DATA = ML_DIR / "data" / "openmeteo" / "all_points.csv.gz"
MODELS = ML_DIR / "models"


def split_masks(ts, train_end, valid_end):
    train_end, valid_end = pd.Timestamp(train_end), pd.Timestamp(valid_end)
    gap = pd.Timedelta(days=1)                      # targets look <=6h ahead, so 1 day is safe
    return (
        ts <= train_end,
        (ts > train_end + gap) & (ts <= valid_end),
        ts > valid_end + gap,
    )


def reg_params():
    return dict(n_estimators=2000, learning_rate=0.05, num_leaves=63, min_child_samples=100,
                subsample=0.8, subsample_freq=1, colsample_bytree=0.8, n_jobs=-1, verbose=-1)


def train_regressor(X_tr, y_tr, X_va, y_va):
    m = lgb.LGBMRegressor(**reg_params())
    m.fit(X_tr, y_tr, eval_set=[(X_va, y_va)], eval_metric="l1",
          callbacks=[lgb.early_stopping(50, verbose=False), lgb.log_evaluation(0)])
    return m


def train_classifier(X_tr, y_tr, X_va, y_va):
    m = lgb.LGBMClassifier(**reg_params())          # unweighted, so probabilities stay honest
    m.fit(X_tr, y_tr, eval_set=[(X_va, y_va)],
          callbacks=[lgb.early_stopping(50, verbose=False), lgb.log_evaluation(0)])
    iso = IsotonicRegression(out_of_bounds="clip", y_min=0, y_max=1)
    iso.fit(m.predict_proba(X_va)[:, 1], y_va)      # calibrate on validation
    return m, iso


def recall_at_fpr(y, p, fpr_max=0.10):
    fpr, tpr, _ = roc_curve(y, p)
    return float(tpr[fpr <= fpr_max].max())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--train-end", default="2023-10-31")
    ap.add_argument("--valid-end", default="2024-10-31")
    ap.add_argument("--sample-frac", type=float, default=1.0, help="random fraction of TRAIN rows")
    ap.add_argument("--use-static", action="store_true", help="add lat/lon/elevation features")
    ap.add_argument("--horizons", type=int, nargs="+", default=list(F.HORIZONS))
    ap.add_argument("--no-rain", action="store_true")
    ap.add_argument("--data", default=str(DATA))
    ap.add_argument("--out", default=str(MODELS))
    args = ap.parse_args()
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    print("Loading data ...")
    raw = pd.read_csv(args.data)
    hourly = F.to_hourly(F.standardize_openmeteo(raw))
    hourly["dew_point"] = F.dew_point(hourly["temperature"], hourly["humidity"])
    print(f"  {hourly.point_id.nunique()} points, {len(hourly):,} hourly rows, "
          f"{hourly.ts.min():%Y-%m-%d} to {hourly.ts.max():%Y-%m-%d}")

    tr_m, va_m, te_m = split_masks(hourly["ts"], args.train_end, args.valid_end)
    print("Fitting climatology on TRAIN period only ...")
    clim = F.fit_climatology(hourly[tr_m])
    F.save_climatology(clim, out_dir / "climatology.csv")

    print("Building features ...")
    df = F.build_features(hourly, clim, add_targets=True)
    feats = F.feature_names(args.use_static)
    reg_targets, rain_targets = F.target_names(tuple(args.horizons))
    reg_targets = [t for t in reg_targets if int(t.split("_")[-1][:-1]) in args.horizons]
    tr_m, va_m, te_m = split_masks(df["ts"], args.train_end, args.valid_end)
    df[feats] = df[feats].astype("float32")
    _, _, month = F._ist_parts(df["ts"])
    df["season"] = F.season_of(month)
    print(f"  features: {len(feats)} | train {tr_m.sum():,} | valid {va_m.sum():,} | test {te_m.sum():,}")

    rng = np.random.default_rng(42)
    results, meta = [], {"trained_at": datetime.now(timezone.utc).isoformat(), "features": feats,
                         "train_end": args.train_end, "valid_end": args.valid_end,
                         "sample_frac": args.sample_frac, "use_static": args.use_static,
                         "points": int(df.point_id.nunique()), "targets": {}}

    def subset(mask, target, frac=1.0):
        d = df[mask].dropna(subset=feats + [target])
        if frac < 1.0:
            d = d.iloc[np.sort(rng.choice(len(d), int(len(d) * frac), replace=False))]
        return d

    # ---------------- regression ----------------
    for t in reg_targets:
        tr, va, te = subset(tr_m, t, args.sample_frac), subset(va_m, t), subset(te_m, t)
        m = train_regressor(tr[feats], tr[t], va[feats], va[t])
        pred = m.predict(te[feats])
        joblib.dump(m, out_dir / f"{t}.joblib")
        meta["targets"][t] = {"best_iteration": int(m.best_iteration_ or 0)}
        for season, idx in [("all", np.ones(len(te), bool))] + [(s, (te["season"] == s).values) for s in sorted(te["season"].unique())]:
            if idx.sum() < 50:
                continue
            mae_m = float(np.mean(np.abs(te[t].values[idx] - pred[idx])))
            mae_p = float(np.mean(np.abs(te[t].values[idx])))          # persistence = predict 0 change
            results.append(dict(target=t, season=season, n=int(idx.sum()), mae_model=mae_m,
                                mae_persistence=mae_p, skill=1 - mae_m / mae_p))
        print(f"  {t}: done")

    # ---------------- rain ----------------
    if not args.no_rain:
        for t in rain_targets:
            tr, va, te = subset(tr_m, t, args.sample_frac), subset(va_m, t), subset(te_m, t)
            m, iso = train_classifier(tr[feats], tr[t].astype(int), va[feats], va[t].astype(int))
            p = iso.predict(m.predict_proba(te[feats])[:, 1])
            joblib.dump({"model": m, "calibrator": iso}, out_dir / f"{t}.joblib")
            meta["targets"][t] = {"best_iteration": int(m.best_iteration_ or 0),
                                  "train_base_rate": float(tr[t].mean())}
            train_rate = tr.groupby("season")[t].mean()
            for season, idx in [("all", np.ones(len(te), bool))] + [(s, (te["season"] == s).values) for s in sorted(te["season"].unique())]:
                y = te[t].values[idx].astype(int)
                if idx.sum() < 200 or y.sum() < 10:
                    continue
                base = float(tr[t].mean()) if season == "all" else float(train_rate.get(season, tr[t].mean()))
                b_model = brier_score_loss(y, p[idx])
                b_clim = brier_score_loss(y, np.full(len(y), base))
                results.append(dict(target=t, season=season, n=int(idx.sum()), base_rate=float(y.mean()),
                                    pr_auc=average_precision_score(y, p[idx]),
                                    brier=b_model, brier_climatology=b_clim, brier_skill=1 - b_model / b_clim,
                                    recall_at_10pct_fpr=recall_at_fpr(y, p[idx])))
            print(f"  {t}: done")

    report = pd.DataFrame(results)
    report.to_csv(out_dir / "evaluation_report.csv", index=False)
    (out_dir / "metadata.json").write_text(json.dumps(meta, indent=2))
    pd.set_option("display.width", 200, "display.max_columns", 20, "display.float_format", "{:.3f}".format)
    print("\n=== Forecast: skill > 0 means better than persistence ===")
    print(report[report.target.str.startswith("y_") & ~report.target.str.contains("rain")]
          [["target", "season", "n", "mae_model", "mae_persistence", "skill"]].to_string(index=False))
    if not args.no_rain:
        print("\n=== Rain: brier_skill > 0 means better than climatology ===")
        print(report[report.target.str.contains("rain")]
              [["target", "season", "n", "base_rate", "pr_auc", "brier_skill", "recall_at_10pct_fpr"]].to_string(index=False))
    print(f"\nSaved models + report to {out_dir}")


if __name__ == "__main__":
    main()