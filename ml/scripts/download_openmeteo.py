"""
Download hourly historical weather (ERA5 via Open-Meteo) for a 50-point grid
centred on Ramdeobaba College, Nagpur.

Location in repo: ml/scripts/download_openmeteo.py
Output:           ml/data/openmeteo/  (point_XX.csv, grid.csv, all_points.csv.gz)

Run from anywhere (paths are anchored to this file, not the working directory):
    python ml/scripts/download_openmeteo.py --limit 1     # quick 1-point test
    python ml/scripts/download_openmeteo.py               # download until a limit is hit
    python ml/scripts/download_openmeteo.py --wait        # sleep through hourly limits

Resumable: finished points are skipped, so re-running just continues.
"""
import argparse
import math
import time
from datetime import date, timedelta
from pathlib import Path

import pandas as pd
import requests

# ---------------- CONFIG ----------------
CENTER_LAT, CENTER_LON = 21.176, 79.058   # Ramdeobaba College (verify on Google Maps)
TOTAL_POINTS = 50                         # full grid size; do not change mid-download
SPACING_DEG = 0.25                        # ERA5 native resolution is ~0.25 deg
START_DATE = "2016-11-01"                 # ~10 years of history
END_DATE = (date.today() - timedelta(days=7)).isoformat()  # archive lags ~5 days

ML_DIR = Path(__file__).resolve().parents[1]   # .../ml
OUT_DIR = ML_DIR / "data" / "openmeteo"

URL = "https://archive-api.open-meteo.com/v1/archive"
HOURLY = [
    "temperature_2m",
    "relative_humidity_2m",
    "dew_point_2m",
    "surface_pressure",      # hPa, matches your DPS310 reading
    "precipitation",         # mm
    "wind_speed_10m",
    "wind_gusts_10m",
    "cloud_cover",
]
PAUSE_BETWEEN_POINTS = 2.0                # seconds, be polite to the free API
MAX_RETRIES = 6
# ----------------------------------------


class RateLimitStop(Exception):
    """Raised to stop the run cleanly when an API quota is exhausted."""


def build_grid():
    """The TOTAL_POINTS grid points nearest the centre, sorted nearest-first.
    Ordering is deterministic, so point_id N always means the same location."""
    km_per_deg_lat = 111.0
    km_per_deg_lon = 111.0 * math.cos(math.radians(CENTER_LAT))
    cands = []
    for i in range(-6, 7):
        for j in range(-6, 7):
            lat = round(CENTER_LAT + i * SPACING_DEG, 4)
            lon = round(CENTER_LON + j * SPACING_DEG, 4)
            dist = math.hypot(i * SPACING_DEG * km_per_deg_lat,
                              j * SPACING_DEG * km_per_deg_lon)
            cands.append((dist, lat, lon))
    cands.sort()
    rows = [
        {"point_id": k, "lat": lat, "lon": lon, "dist_from_center_km": round(d, 1)}
        for k, (d, lat, lon) in enumerate(cands[:TOTAL_POINTS])
    ]
    return pd.DataFrame(rows)


def fetch_point(lat, lon, wait_on_hourly):
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": START_DATE,
        "end_date": END_DATE,
        "hourly": ",".join(HOURLY),
        "models": "era5",        # one consistent source, no model mixing
        "timezone": "GMT",       # keep everything in UTC
    }
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            r = requests.get(URL, params=params, timeout=120)
            if r.status_code == 200:
                data = r.json()
                if "hourly" not in data:
                    raise RuntimeError(f"Unexpected response: {str(data)[:200]}")
                return data
            if r.status_code == 429:
                try:
                    reason = r.json().get("reason", "")
                except ValueError:
                    reason = ""
                if "Daily" in reason:
                    raise RateLimitStop("Daily limit hit. Re-run tomorrow.")
                if "Minutely" in reason:
                    print("  minute limit; waiting 70s")
                    time.sleep(70)
                    continue
                if not wait_on_hourly:
                    raise RateLimitStop("Hourly limit hit. Re-run after the hour resets.")
                print("  hourly limit; waiting 10 min")
                time.sleep(600)
                continue
            print(f"  HTTP {r.status_code}: {r.text[:200]}")
        except requests.RequestException as e:
            print(f"  network error: {e}")
        time.sleep(min(30 * attempt, 180))
    raise RuntimeError(f"Failed to fetch {lat},{lon} after {MAX_RETRIES} attempts")


def merge_points(total):
    files = sorted(OUT_DIR.glob("point_*.csv"))
    if files:
        all_df = pd.concat((pd.read_csv(f) for f in files), ignore_index=True)
        all_df.to_csv(OUT_DIR / "all_points.csv.gz", index=False)
        print(f"Merged {len(files)} points, {len(all_df)} rows -> {OUT_DIR / 'all_points.csv.gz'}")
    if len(files) < total:
        print(f"{len(files)}/{total} points done. Re-run later to download the rest.")


def main():
    ap = argparse.ArgumentParser(description="Download Open-Meteo ERA5 grid around Nagpur.")
    ap.add_argument("--limit", type=int, default=None,
                    help="download at most this many NEW points this run (e.g. 1 for a test)")
    ap.add_argument("--wait", action="store_true",
                    help="sleep through hourly rate limits instead of stopping")
    args = ap.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    grid = build_grid()
    grid.to_csv(OUT_DIR / "grid.csv", index=False)
    print(f"Grid: {len(grid)} points, {START_DATE} to {END_DATE}")
    print(f"Output folder: {OUT_DIR}")

    downloaded = 0
    for _, p in grid.iterrows():
        pid = int(p.point_id)
        out = OUT_DIR / f"point_{pid:02d}.csv"
        if out.exists():
            print(f"[{pid + 1}/{len(grid)}] skip (already downloaded)")
            continue
        if args.limit is not None and downloaded >= args.limit:
            print(f"Reached --limit {args.limit}; stopping.")
            break
        print(f"[{pid + 1}/{len(grid)}] lat={p.lat} lon={p.lon}")
        try:
            data = fetch_point(p.lat, p.lon, args.wait)
        except RateLimitStop as e:
            print(f"  STOPPED: {e}")
            break
        df = pd.DataFrame(data["hourly"]).rename(columns={"time": "ts"})
        df["point_id"] = pid
        df["lat"] = data["latitude"]            # actual grid cell used
        df["lon"] = data["longitude"]
        df["elevation_m"] = data["elevation"]
        df.to_csv(out, index=False)
        downloaded += 1
        print(f"  saved {len(df)} rows, elevation {data['elevation']} m")
        time.sleep(PAUSE_BETWEEN_POINTS)

    merge_points(len(grid))


if __name__ == "__main__":
    main()