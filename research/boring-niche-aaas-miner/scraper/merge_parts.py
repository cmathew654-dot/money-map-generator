#!/usr/bin/env python3
"""Merge ad_audit_filled.part*.csv shards into ad_audit_filled.csv (rows with results win over empty ones)."""
import csv, glob
from pathlib import Path
HERE = Path(__file__).resolve().parent
parts = sorted(glob.glob(str(HERE.parent / "ad_audit_filled.part*.csv")))
if not parts: raise SystemExit("no part files found")
merged = {}; cols = None
for f in parts:
    for r in csv.DictReader(open(f, newline="", encoding="utf-8")):
        cols = cols or list(r.keys())
        for k in r:
            if k not in cols: cols.append(k)
        key = (r["niche_id"], r["tool"])
        if key not in merged or (r.get("scrape_status") and not merged[key].get("scrape_status")):
            merged[key] = r
out = HERE.parent / "ad_audit_filled.csv"
with open(out, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=cols); w.writeheader()
    for r in merged.values(): w.writerow({c: r.get(c, "") for c in cols})
done = sum(1 for r in merged.values() if r.get("scrape_status"))
print(f"merged {len(parts)} parts -> {out}: {len(merged)} rows, {done} with results")
