#!/usr/bin/env python3
"""Score a filled ad_audit_filled.csv per the method and write ad_audit_scored.csv + niche_pass.csv."""
import csv, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
IN = HERE.parent / "ad_audit_filled.csv"
OUT = HERE.parent / "ad_audit_scored.csv"
NP = HERE.parent / "niche_pass.csv"
DR = {"sign up","start free trial","free trial","book demo","book a demo","get a demo","request demo","get quote",
      "get started","try for free","start now","schedule demo","get offer","apply now","download","install now",
      "subscribe","book now","get access","start trial","try now"}
def num(v):
    try: return int(str(v).replace(",", "").strip())
    except Exception: return None
# Data-quality overrides: Meta page resolved to the wrong entity (generic tool name matched an unrelated Page).
# Meta points are zeroed for these; the row keeps the raw numbers for transparency.
META_WRONG_PAGE = {
    "Essential": "resolved to 'Essential Sleep Hacks'",
    "GoPave": "resolved to 'Go Pave Utah' (a paving contractor, not the software)",
    "Contractor+": "resolved to 'Contractor Growth Network'",
}
META_AMBIGUOUS_PAGE = {"Leap": "LEAP (a second run resolved to LEAP Legal Software; page identity unconfirmed)", "Momentum FSM": "Momentum", "WorkHorse SCS": "Workhorse", "FieldForce Tracker": "Field Force",
                       "Flat Rate Plus Online": "Flat Rate", "Allpro Insulator": "Allpro"}
rows = list(csv.DictReader(open(IN, newline="", encoding="utf-8")))
for r in rows:
    pts = {}
    r["meta_page_flag"] = ("wrong_page: " + META_WRONG_PAGE[r["tool"]]) if r["tool"] in META_WRONG_PAGE else (
        ("ambiguous_page: " + META_AMBIGUOUS_PAGE[r["tool"]]) if r["tool"] in META_AMBIGUOUS_PAGE else "")
    ma, m60 = num(r.get("meta_active_ads")), num(r.get("meta_ads_60d"))
    pts["meta"] = 3 if (ma is not None and m60 is not None and ma >= 5 and m60 >= 3) else 0
    if r["tool"] in META_WRONG_PAGE: pts["meta"] = 0
    ga, g90 = num(r.get("google_ad_count")), num(r.get("google_overlap_90d_pass"))
    pts["google"] = 3 if (ga is not None and g90 is not None and ga >= 5 and g90 >= 3) else 0
    pts["linkedin"] = 1 if (r.get("linkedin_present") == "yes" and r.get("linkedin_currently_running") in ("yes", "")) else 0
    pts["headcount"] = num(r.get("headcount_bonus")) or 0
    ctas = [c.split(":")[0] for c in (r.get("meta_cta") or "").split("|") if c]
    pts["cta"] = 1 if any(c in DR for c in ctas) else 0
    r["direct_response_cta"] = "yes" if pts["cta"] else ("no" if ctas else r.get("direct_response_cta", "unverified"))
    r["score_breakdown"] = "|".join(f"{k}:{v}" for k, v in pts.items())
    sts = [r.get(f"{k}_status", "") or "" for k in ("meta", "google", "linkedin")]
    audited = any(st == "ok" for st in sts) or (r.get("scrape_status") == "ok" and all(st.startswith("ok") for st in sts))
    r["verified_score"] = sum(pts.values()) if audited else ""
    r["tool_passes"] = "yes" if (r["verified_score"] != "" and r["verified_score"] >= 5) else ("no" if r["verified_score"] != "" else "unverified")
cols = list(rows[0].keys()) + [c for c in ("meta_page_flag", "score_breakdown", "tool_passes") if c not in rows[0]]
with open(OUT, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=cols); w.writeheader(); w.writerows(rows)
niches = {}
for r in rows:
    d = niches.setdefault(r["niche_id"], {"audited": 0, "passing": 0, "tools_passing": []})
    if r["verified_score"] != "":
        d["audited"] += 1
        if r["tool_passes"] == "yes": d["passing"] += 1; d["tools_passing"].append(r["tool"])
with open(NP, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["niche_id", "tools_audited", "tools_passing", "niche_passes_step3", "passing_tools"])
    for k in sorted(niches, key=lambda x: int(x) if x.isdigit() else 0):
        d = niches[k]; w.writerow([k, d["audited"], d["passing"], "yes" if d["passing"] >= 2 else ("no" if d["audited"] else "unverified"), "|".join(d["tools_passing"])])
print(f"scored {len(rows)} rows; niches passing Step 3: {sum(1 for d in niches.values() if d['passing'] >= 2)}")
