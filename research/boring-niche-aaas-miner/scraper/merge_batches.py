#!/usr/bin/env python3
"""Merge research batch folders (niches/tools/ad_audit/fragmentation/notes) into the master CSVs.
Usage: python merge_batches.py <batch_dir> [<batch_dir> ...] [--with-filled]
Replaces master rows for every niche id present in a batch's niches.csv. --with-filled also adds rows to
ad_audit_filled.csv (carrying over results for tools already audited) and rebuilds rescrape_tools.txt."""
import csv, json, re, sys, urllib.parse
from pathlib import Path
D = Path(__file__).resolve().parent.parent
def rd(p): return list(csv.DictReader(open(p, encoding="utf-8"))) if Path(p).exists() else []
def wr(p, rows, cols):
    with open(p, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols); w.writeheader()
        for r in rows: w.writerow({c: r.get(c, "") for c in cols})
def isurl(s): return isinstance(s, str) and s.strip().startswith("http")
def norm(s): return re.sub(r"[^a-z0-9]", "", s.lower())
def lookup(tool, domain):
    q = urllib.parse.quote(tool)
    return {"meta_lookup_url": f"https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q={q}&search_type=keyword_unordered&media_type=all",
            "google_lookup_url": f"https://adstransparency.google.com/?region=US&domain={domain}",
            "linkedin_lookup_url": f"https://www.linkedin.com/ad-library/search?keyword={q}"}
args = [a for a in sys.argv[1:] if not a.startswith("--")]; with_filled = "--with-filled" in sys.argv
N = rd(D / "niches.csv"); ncols = list(N[0].keys())
T = rd(D / "tools.csv"); tcols = list(T[0].keys())
A = rd(D / "ad_audit.csv"); acols = list(A[0].keys())
F = rd(D / "fragmentation.csv"); fcols = list(F[0].keys())
notes = json.load(open(D / "batch_notes.json", encoding="utf-8"))
touched = set(); added_t = added_a = 0
for bd in args:
    bd = Path(bd); bn = {r["id"]: r for r in rd(bd / "niches.csv")}; ids = set(bn)
    touched |= ids
    for r in N:
        b = bn.get(r["id"])
        if b:
            for k in ("us_establishments", "estab_year", "estab_source_url", "share_under_20_employees", "share_source_url"): r[k] = b.get(k, "unverified") or "unverified"
            r["research_status"] = f"searched (follow-up {bd.name})"; r["notes"] = b.get("notes", "")
    T = [t for t in T if t["niche_id"] not in ids]; A = [a for a in A if a["niche_id"] not in ids]; F = [f for f in F if f["niche_id"] not in ids]
    for t in rd(bd / "tools.csv"):
        t["verification_status"] = "search-verified (URL-cited)" if (isurl(t.get("niche_landing_url", "")) or isurl(t.get("pricing_url", "")) or isurl(t.get("headcount_source_url", "")) or isurl(t.get("review_source_url", ""))) else "search-named (no URL captured)"
        T.append({c: t.get(c, "") for c in tcols}); added_t += 1
    ba = {(r["niche_id"], norm(r["tool"])): r for r in rd(bd / "ad_audit.csv")}
    for t in [x for x in T if x["niche_id"] in ids]:
        b = ba.get((t["niche_id"], norm(t["tool"])), {})
        a = {c: "" for c in acols}; a.update({k: b.get(k, "") for k in b if k in acols})
        a.update({"niche_id": t["niche_id"], "tool": t["tool"], "domain": t["domain"], "verification_status": t["verification_status"], "method_score": "pending (audit)"})
        dom = t["domain"] if t["domain"] and t["domain"] != "unverified" else ""
        a.update(lookup(t["tool"], dom))
        for k in ("meta_active_ads", "meta_ads_60d", "meta_ads_120d", "meta_platforms", "meta_cta", "google_ad_count", "google_formats", "google_overlap_90d_pass", "linkedin_present", "linkedin_date_ranges"): a[k] = "unverified (host blocked)"
        a["headcount_bonus"] = b.get("headcount_bonus", "0") or "0"; a["verified_score"] = a["headcount_bonus"]
        a["pending_signals"] = "Meta +3, Google +3, LinkedIn +1, CTA +1 pending audit"
        A.append(a); added_a += 1
    F += [{c: r.get(c, "") for c in fcols} for r in rd(bd / "fragmentation.csv")]
    txt = (bd / "notes.md").read_text(encoding="utf-8") if (bd / "notes.md").exists() else ""
    for p in re.split(r"^#{2,3} +", txt, flags=re.M)[1:]:
        m = re.match(r"(\d+)", p)
        if m: notes[m.group(1)] = p[m.end():].strip()
FS = {r["niche_id"]: r["fragmentation_score"] for r in F}
for r in N:
    r["fragmentation_score"] = FS.get(r["id"], r["fragmentation_score"])
    vt = [t for t in T if t["niche_id"] == r["id"] and t["verification_status"].startswith("search-verified")]
    r["n_tools_search_verified"] = str(len(vt)); r["n_tools_candidate_unverified"] = str(sum(1 for t in T if t["niche_id"] == r["id"]) - len(vt))
    r["n_tools_public_price_url"] = str(sum(1 for t in vt if t["starting_price"] and not t["starting_price"].lower().startswith("unverified") and isurl(t["pricing_url"])))
key = lambda r: (int(r["niche_id"]) if r["niche_id"].isdigit() else 999, r["tool"])
T.sort(key=key); A.sort(key=key); F.sort(key=lambda r: int(r["niche_id"]))
wr(D / "niches.csv", N, ncols); wr(D / "tools.csv", T, tcols); wr(D / "ad_audit.csv", A, acols); wr(D / "fragmentation.csv", F, fcols)
json.dump(notes, open(D / "batch_notes.json", "w", encoding="utf-8"), indent=1)
print(f"merged {len(args)} batches: niches {sorted(touched, key=int)}; tools +{added_t}, ad_audit +{added_a}")
if with_filled:
    AF = rd(D / "ad_audit_filled.csv"); afcols = list(AF[0].keys())
    have = {(a["niche_id"], norm(a["tool"])) for a in AF}
    results = {}
    for a in AF:
        if a.get("scrape_status") and norm(a["tool"]) not in results: results[norm(a["tool"])] = a
    copied = 0
    for a in A:
        k = (a["niche_id"], norm(a["tool"]))
        if k in have: continue
        af = {c: "" for c in afcols}; af.update({kk: v for kk, v in a.items() if kk in afcols})
        prev = results.get(norm(a["tool"]))
        if prev:
            for kk in afcols:
                if kk not in ("niche_id", "tool", "verification_status") and prev.get(kk): af[kk] = prev[kk]
            af["verified_score"] = ""; copied += 1
        AF.append(af); have.add(k)
    AF.sort(key=key); wr(D / "ad_audit_filled.csv", AF, afcols)
    Tv = {(t["niche_id"], norm(t["tool"])): t for t in T}
    need = sorted({a["tool"] for a in AF if not a.get("scrape_status") and a["domain"] and a["domain"] != "unverified" and Tv.get((a["niche_id"], norm(a["tool"])), {}).get("verification_status", "").startswith("search-verified")})
    (D / "scraper" / "rescrape_tools.txt").write_text("\n".join(need) + "\n", encoding="utf-8")
    print(f"filled: {len(AF)} rows, {copied} carried over, {len(need)} tools need audit")
