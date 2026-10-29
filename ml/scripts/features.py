"""
Shared feature engineering for the weather ML pipeline.

Used by BOTH training (Open-Meteo history) and live inference (MongoDB node data).
Never duplicate this logic elsewhere: a mismatch between training and serving
features silently ruins accuracy.

Inputs the model is allowed to use (all measurable by the node):
    temperature (C), humidity (%), pressure (hPa, SURFACE), timestamp (UTC)
Everything else (precipitation, wind, cloud) is used only for building labels.

Conventions
    * Frames have a naive-UTC `ts` column and a `point_id` column.
      For live data set point_id to the climatology point nearest the node (0).
    * Data must be an HOURLY series. For live data, resample the node's packets to
      hourly (mean per hour) and supply >= 24 h of gap-free history.
    * Time features use IST (UTC+5:30) so "hour 14" means 2 pm in Nagpur.
"""
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.ndimage import uniform_filter1d

IST_OFFSET = pd.Timedelta(hours=5, minutes=30)
HORIZONS = (1, 3, 6)               # forecast horizons in hours
TEND_LAGS = (1, 3, 6, 12)          # tendency windows in hours
WEATHER_VARS = ("temperature", "humidity", "pressure", "dew_point")
ROLL_VARS = ("temperature", "humidity", "pressure")
STATIC_FEATURES = ("lat", "lon", "elevation_m")
RAIN_MM = 0.1                      # mm/h counted as "rain" for labels
CLIM_SMOOTH_DAYS = 15              # circular smoothing window for climatology

OPENMETEO_RENAME = {
    "temperature_2m": "temperature",
    "relative_humidity_2m": "humidity",
    "surface_pressure": "pressure",
    "precipitation": "precip",
    "wind_gusts_10m": "gust",
    "wind_speed_10m": "wind",
    "cloud_cover": "cloud",
}


# --------------------------------------------------------------------------
# Basic physics / helpers
# --------------------------------------------------------------------------
def dew_point(temp_c, rh):
    """Magnus formula. One formula for training and live, so they always agree."""
    a, b = 17.625, 243.04
    rh = np.clip(np.asarray(rh, dtype=float), 1.0, 100.0)
    g = np.log(rh / 100.0) + a * np.asarray(temp_c, dtype=float) / (b + np.asarray(temp_c, dtype=float))
    return b * g / (a - g)


def season_of(month):
    """Nagpur seasons from an IST month number (Series or int)."""
    m = pd.Series(month)
    out = pd.Series("winter", index=m.index)          # Dec-Feb
    out[m.between(3, 5)] = "pre_monsoon"
    out[m.between(6, 9)] = "monsoon"
    out[m.isin([10, 11])] = "post_monsoon"
    return out.values if not np.isscalar(month) else out.iloc[0]


def standardize_openmeteo(df):
    """Rename Open-Meteo columns to model names and recompute dew point ourselves."""
    df = df.rename(columns=OPENMETEO_RENAME).drop(columns=["dew_point_2m"], errors="ignore")
    df["ts"] = pd.to_datetime(df["ts"])
    return df


def to_hourly(df):
    """Sort, de-duplicate and force a complete hourly grid per point, so shifts mean hours."""
    parts = []
    for pid, g in df.groupby("point_id", sort=True):
        g = g.drop_duplicates("ts").set_index("ts").sort_index().asfreq("h")
        g["point_id"] = pid
        for c in STATIC_FEATURES:                      # static columns survive the reindex
            if c in g.columns:
                g[c] = g[c].ffill().bfill()
        parts.append(g.reset_index())
    return pd.concat(parts, ignore_index=True)


def _ist_parts(ts):
    ist = ts + IST_OFFSET
    return ist.dt.hour, ist.dt.dayofyear.clip(upper=365), ist.dt.month


# --------------------------------------------------------------------------
# Climatology ("normal" for each hour of the year), fitted on TRAINING data only
# --------------------------------------------------------------------------
def fit_climatology(df):
    """df: hourly frame with ts, point_id, WEATHER_VARS. Returns long table."""
    d = df.dropna(subset=list(WEATHER_VARS)).copy()
    d["hour"], d["doy"], _ = _ist_parts(d["ts"])
    mean = d.groupby(["point_id", "hour", "doy"])[list(WEATHER_VARS)].mean()
    pts = sorted(d["point_id"].unique())
    idx = pd.MultiIndex.from_product([pts, range(24), range(1, 366)], names=["point_id", "hour", "doy"])
    mean = mean.reindex(idx)
    out = pd.DataFrame(index=idx)
    for v in WEATHER_VARS:
        arr = mean[v].unstack("doy").to_numpy()
        # fill any gaps with the row mean, then smooth circularly around the year
        row_mean = np.nanmean(arr, axis=1, keepdims=True)
        arr = np.where(np.isnan(arr), row_mean, arr)
        arr = uniform_filter1d(arr, size=CLIM_SMOOTH_DAYS, axis=1, mode="wrap")
        out[f"clim_{v}"] = pd.DataFrame(
            arr, index=mean[v].unstack("doy").index, columns=range(1, 366)
        ).stack().reindex(idx).values
    return out.reset_index()


def save_climatology(clim, path):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    clim.to_csv(path, index=False)


def load_climatology(path):
    return pd.read_csv(path)


# --------------------------------------------------------------------------
# Features and targets
# --------------------------------------------------------------------------
def feature_names(use_static=False):
    names = list(WEATHER_VARS)
    names += [f"{v}_d{h}h" for v in WEATHER_VARS for h in TEND_LAGS]
    names += [f"{v}_{s}" for v in ROLL_VARS for s in ("std6", "std24", "rng24")]
    names += ["hour_sin", "hour_cos", "doy_sin", "doy_cos"]
    names += [f"{v}_anom" for v in WEATHER_VARS]
    names += ["dew_depression"]
    if use_static:
        names += list(STATIC_FEATURES)
    return names


def target_names(horizons=HORIZONS):
    reg = [f"y_{v}_{h}h" for v in ("temperature", "humidity", "pressure") for h in horizons]
    rain = ["y_rain_1h", "y_rain_3h"]
    return reg, rain


def build_features(df, clim, add_targets=False):
    """
    df: hourly frame (see module docstring) with ts, point_id, temperature, humidity,
        pressure [+ precip if add_targets, + lat/lon/elevation_m if use_static].
    Returns a frame with ts, point_id and all feature columns (and targets if requested).
    """
    df = df.copy().sort_values(["point_id", "ts"]).reset_index(drop=True)
    df["dew_point"] = dew_point(df["temperature"], df["humidity"])
    g = df.groupby("point_id")

    new = {}
    for v in WEATHER_VARS:
        for h in TEND_LAGS:
            new[f"{v}_d{h}h"] = df[v] - g[v].shift(h)
    for v in ROLL_VARS:
        new[f"{v}_std6"] = g[v].transform(lambda s: s.rolling(6, min_periods=6).std())
        new[f"{v}_std24"] = g[v].transform(lambda s: s.rolling(24, min_periods=24).std())
        mx = g[v].transform(lambda s: s.rolling(24, min_periods=24).max())
        mn = g[v].transform(lambda s: s.rolling(24, min_periods=24).min())
        new[f"{v}_rng24"] = mx - mn
    new["dew_depression"] = df["temperature"] - df["dew_point"]

    hour, doy, _ = _ist_parts(df["ts"])
    frac_hour = hour + df["ts"].dt.minute / 60.0
    new["hour_sin"] = np.sin(2 * np.pi * frac_hour / 24)
    new["hour_cos"] = np.cos(2 * np.pi * frac_hour / 24)
    new["doy_sin"] = np.sin(2 * np.pi * doy / 365.25)
    new["doy_cos"] = np.cos(2 * np.pi * doy / 365.25)
    df = pd.concat([df, pd.DataFrame(new, index=df.index)], axis=1)

    # deviation from the seasonal normal for this hour of year
    key = pd.DataFrame({"point_id": df["point_id"], "hour": hour.values, "doy": doy.values})
    merged = key.merge(clim, on=["point_id", "hour", "doy"], how="left")
    for v in WEATHER_VARS:
        df[f"{v}_anom"] = df[v].values - merged[f"clim_{v}"].values

    if add_targets:
        g = df.groupby("point_id")
        for v in ("temperature", "humidity", "pressure"):
            for h in HORIZONS:
                df[f"y_{v}_{h}h"] = g[v].shift(-h) - df[v]          # CHANGE, not absolute
        for h in (1, 3):
            fut = pd.concat([g["precip"].shift(-k) for k in range(1, h + 1)], axis=1)
            has_nan = fut.isna().any(axis=1)
            label = (fut.max(axis=1) >= RAIN_MM).astype(float)
            label[has_nan] = np.nan
            df[f"y_rain_{h}h"] = label
    return df