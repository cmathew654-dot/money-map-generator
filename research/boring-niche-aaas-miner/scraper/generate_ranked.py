#!/usr/bin/env python3
"""Rebuild ideas_ranked.md from the audited data (ad_audit_scored.csv, niche_pass.csv, tools.csv, fragmentation.csv, niches.csv)."""
import csv, json, re, collections
from pathlib import Path
D = Path(__file__).resolve().parent.parent
def isurl(s): return isinstance(s, str) and s.strip().startswith("http")
def unv(s): return (not s) or s.strip().lower().startswith(("unverified", "not searched"))
def num(v):
    try: return int(str(v).replace(",", ""))
    except Exception: return None
HORIZONTAL = {"ServiceTitan","Jobber","Housecall Pro","Service Fusion","FieldPulse","Workiz","Houzz Pro","Method CRM","Contractor+","FieldEdge",
              "QuoteIQ","BuildOps","Smart Service","Kickserv","mHelpDesk","Zuper","Fieldd","Bella FSM","ServiceM8","Commusoft","Simpro","Connecteam"}
N = {r["id"]: r for r in csv.DictReader(open(D / "niches.csv", encoding="utf-8"))}
T = list(csv.DictReader(open(D / "tools.csv", encoding="utf-8")))
F = {r["niche_id"]: r for r in csv.DictReader(open(D / "fragmentation.csv", encoding="utf-8"))}
A = list(csv.DictReader(open(D / "ad_audit_scored.csv", encoding="utf-8")))
ANG = json.load(open(D / "aaas_angles.json", encoding="utf-8"))
NOTES = json.load(open(D / "batch_notes.json", encoding="utf-8"))
ver = {(t["niche_id"], t["tool"]): t["verification_status"].startswith("search") for t in T}
per = collections.defaultdict(list)
for a in A:
    if a.get("scrape_status"): per[a["niche_id"]].append(a)
def niche_stats(i):
    rows = per.get(i, [])
    vrows = [a for a in rows if ver.get((i, a["tool"]), False)]
    scored = sorted([(num(a["verified_score"]) or 0, a) for a in vrows], key=lambda x: -x[0])
    passing = [a for s_, a in scored if a["tool_passes"] == "yes"]
    top2 = [s_ for s_, _ in scored[:2]]
    ad_score = round(sum(top2) / 2, 1) if len(top2) == 2 else (top2[0] if top2 else 0)
    frag = N[i]["fragmentation_score"]; fragn = int(frag) if frag.isdigit() else 0
    unv_pass = [a for a in rows if a["tool_passes"] == "yes" and not ver.get((i, a["tool"]), False)]
    vertical_pass = [a for a in passing if a["tool"] not in HORIZONTAL]
    status = ("QUALIFIED" if fragn >= 3 else "passes ad test; fragmentation below 3 (Filter 4)") if len(passing) >= 2 else ("provisional (passes only with unverified-membership tools)" if len(passing) + len(unv_pass) >= 2 else ("audited, not passing" if vrows else "not audited"))
    return dict(rows=rows, vrows=vrows, passing=passing, unv_pass=unv_pass, ad_score=ad_score, frag=fragn, method=ad_score + fragn, status=status,
                horizontal_only=(bool(passing) and not vertical_pass), audited=len(vrows), undersampled=[a["tool"] for a in vrows if (num(a["meta_active_ads"]) or 0) >= 10 and (num(a["meta_ads_60d"]) or 0) < 3 and (num(a["meta_all_ads_seen"]) or 0) < (num(a["meta_active_ads"]) or 0) and not a.get("meta_page_flag")])
ST = {i: niche_stats(i) for i in N}
order = sorted(N, key=lambda i: (-(ST[i]["status"] == "QUALIFIED"), -ST[i]["method"], -int(N[i]["provisional_evidence_score"]), int(i)))
qualified = [i for i in order if ST[i]["status"] == "QUALIFIED"]
provisional = [i for i in order if ST[i]["status"].startswith("provisional")]
sel = order[:50]
L = ["# ideas_ranked.md — Boring-Niche Ad-Validated Idea Miner (US)\n"]
L.append(f"""## Status: all 160 niches researched (Step 2); Step 3 ad audit run on a local machine for every search-verified tool (last scrape {max(a['scraped_at'] for a in A if a.get('scraped_at'))[:10]})

**Qualified niches by the method's definition (≥2 search-verified tools scoring ≥5): {len(qualified)}.** Provisional (would qualify counting tools whose membership in the niche came from prior knowledge, not search): {len(provisional)}. All 160 niches were searched for tools; niches with fewer than 3 URL-cited tools are listed in dead_ends.md under Filter 2.

How the numbers were obtained: Meta Ad Library (active ads, US, resolved to the vendor's Page; start dates from Meta's own data feed), Google Ads Transparency Center (creatives with first-shown and last-shown dates from Google's own feed; a creative passes the 90-day test when first shown ≥90 days ago and still shown within 14 days), LinkedIn Ad Library (presence and run dates, advertiser-verified). Scoring follows the brief: Meta +3 (≥5 active and ≥3 running ≥60 days), Google +3 (≥5 ads and ≥3 passing 90 days), LinkedIn +1, bootstrapped/<50 staff +2, direct-response CTA +1. Tool passes at ≥5.

**Ranking:** niche ad score = mean of the two best tool scores among search-verified tools (0–10); method score = ad score + fragmentation score (0–5). Qualified niches first, then everything else by method score, then by the pre-audit provisional score.

Known limits, stated plainly:
- Meta for the 571 tools audited in the final run (2026-09-16 21:00+) is **unverified**: Meta throttled that run into empty results. Their scores rest on Google, LinkedIn and headcount only, so they can only rise. A slow Meta-only rerun is queued for the tools where +3 would change the verdict.
- Meta sampling: fast mode read the first 30–60 ads of each Page, newest first. Big advertisers can be undercounted on the "≥3 ads running ≥60 days" test. Tools affected are flagged `undersampled` on their card and a targeted rescrape is queued.
- Three tools with generic names resolved to the wrong Meta Page (Essential, GoPave, Contractor+). Their Meta points are zeroed; five more are flagged ambiguous.
- Fragmentation: gatekeeper and concentration checks ran only for the 13 originally qualified niches (franchise mandates found bind franchisees only); elsewhere the score is conservative because those checks never ran.
- Horizontal tools (Jobber, Housecall Pro, ServiceTitan, Service Fusion, FieldPulse) advertise to all home-service trades; a niche that qualifies only through them is marked `horizontal-only`, meaning the category converts but no vertical incumbent proves the niche on its own.

---
""")
def tool_table(i):
    st = ST[i]
    rows = sorted(st["rows"], key=lambda a: -(num(a["verified_score"]) or 0))
    out = ["| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |", "|---|---|---|---|---|---|---|---|---|---|---|"]
    for a in rows:
        v = "yes" if ver.get((i, a["tool"]), False) else "no (prior knowledge)"
        flags = []
        if a.get("meta_page_flag"): flags.append(a["meta_page_flag"].split(":")[0])
        if a["tool"] in st["undersampled"]: flags.append("undersampled")
        if a["tool"] in HORIZONTAL: flags.append("horizontal")
        meta_cell = "unverified (throttled run)" if str(a.get('meta_status','')).startswith('unverified') else f"{a['meta_active_ads']} / {a['meta_ads_60d']} / {a['meta_ads_120d']} ({a['meta_oldest_start'] or '-'})"
        out.append(f"| {a['tool']} | {v} | {a['verified_score']} | {a['tool_passes']} | {meta_cell} | {a['meta_page_name'] or '-'} | {a['direct_response_cta']} | {a['google_ad_count']} / {a['google_overlap_90d_pass']} ({a['google_first_shown_min'] or '-'}) | {a['linkedin_present']} {a['linkedin_ad_count'] or ''} | {a['headcount_bonus']} | {' '.join(flags)} |")
    return "\n".join(out)
def urls_for(i):
    u = []
    n = N[i]
    for k in ("estab_source_url", "share_source_url"):
        if isurl(n[k]): u.append(n[k])
    for t in T:
        if t["niche_id"] == i and t["verification_status"].startswith("search"):
            for k in ("niche_landing_url", "pricing_url", "headcount_source_url", "funding_source_url", "review_source_url", "trustmrr_url", "linkedin_url"):
                if isurl(t[k]): u.append(t[k])
    f = F.get(i)
    if f:
        for k in ("public_price_urls", "gatekeeper_evidence_url", "concentration_source_url"):
            for x in re.split(r"[;\s|]+", f[k]):
                if isurl(x): u.append(x)
    for a in per.get(i, []):
        for k in ("meta_results_url", "google_advertiser_page_url"):
            if isurl(a.get(k, "")): u.append(a[k])
    return list(dict.fromkeys(u))
def prices(i):
    return [f"{t['tool']}: {t['starting_price']} ({t['pricing_url']})" for t in T if t["niche_id"] == i and t["verification_status"].startswith("search") and not unv(t["starting_price"]) and isurl(t["pricing_url"])]
L.append("## Summary table\n\n| rank | niche | status | tools audited | passing tools | ad score | frag | method score |\n|---|---|---|---|---|---|---|---|")
for k, i in enumerate(sel, 1):
    st = ST[i]
    L.append(f"| {k} | {N[i]['niche']} | {st['status']}{' (horizontal-only)' if st['horizontal_only'] else ''} | {st['audited']} | {', '.join(a['tool'] for a in st['passing']) or '-'} | {st['ad_score']} | {st['frag']} | {st['method']} |")
L.append("\n---\n")
for k, i in enumerate(sel, 1):
    n = N[i]; st = ST[i]; f = F.get(i, {}); ang = ANG.get(i)
    L.append(f"## {k}. {n['niche']}  (NAICS {n['naics']})\n")
    L.append(f"- **Status:** {st['status']}{' — horizontal-only pass' if st['horizontal_only'] else ''}. Research: {n['research_status']}.")
    L.append(f"- **Method score:** {st['method']} = ad score {st['ad_score']} (mean of best two verified tools) + fragmentation {st['frag']}/5.")
    L.append(f"- **Passing tools:** {', '.join(a['tool'] for a in st['passing']) or 'none'}" + (f"; passing but membership unverified: {', '.join(a['tool'] for a in st['unv_pass'])}" if st["unv_pass"] else "") + ".")
    if st["undersampled"]: L.append(f"- **Rescrape queued (Meta undersampled):** {', '.join(st['undersampled'])}.")
    L.append(f"- **Boring test:** {n['boring_score']}/3 — {n['why_boring']}.")
    L.append(f"- **US establishments:** {n['us_establishments']}" + (f" ({n['estab_year']}, {n['estab_source_url']})" if isurl(n['estab_source_url']) else " — unverified") + f"; share <20 employees: {n['share_under_20_employees'] or 'unverified'}.")
    L.append("")
    if st["rows"]:
        L.append("**Ad audit (Step 3):**\n"); L.append(tool_table(i)); L.append("")
    else:
        L.append("**Ad audit (Step 3):** no tools audited for this niche (no search-verified tools; see dead_ends.md).\n")
    L.append("**What the incumbent SaaS does / incumbents / weakest evidence** " + ("[search-cited where a URL is given]" if int(n["n_tools_search_verified"]) else "[hypothesis — batch had no search budget]"))
    L.append("")
    L.append("\n".join("> " + l for l in NOTES.get(i, "(no notes)").splitlines()))
    L.append("")
    if ang:
        L.append(f"**The agent version** [hypothesis]: {ang[0]}\n"); L.append(f"**Wedge** [hypothesis]: {ang[1]}\n")
        pr = prices(i)
        if pr:
            L.append("**Price ceiling:** incumbent public prices found [search-cited]:")
            for p_ in pr: L.append(f"  - {p_}")
            L.append(f"  Plus the owner's admin labor inside the tool. Assumption, not measured: ~{ang[2]} hrs/week. Ceiling ≈ cheapest cited incumbent tier + ({ang[2]} hrs/wk × the operator's admin hourly cost).")
        else:
            L.append(f"**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~{ang[2]} hrs/week.")
        L.append("")
    else:
        L.append("**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.\n")
    if f:
        L.append(f"**Fragmentation (Step 4):** {f.get('fragmentation_score','unverified')}/5. Check signer: {f.get('check_signer','unverified')}. Public-price incumbents: {f.get('public_price_incumbents_count','unverified')}. Gatekeeper: {f.get('gatekeeper_found','unverified')}. Top-4 share: {f.get('top4_share','unverified')}.\n")
    u = urls_for(i)
    L.append(f"**Evidence URLs ({len(u)}):**")
    for x in u: L.append(f"  - {x}")
    conf = "medium" if st["status"] == "QUALIFIED" and not st["horizontal_only"] and not st["undersampled"] else ("medium-low" if st["status"] == "QUALIFIED" else "low")
    weakest = ("no vertical incumbent passes; qualification rests on horizontal tools" if st["horizontal_only"] else ("Meta undersampled for a large advertiser; rescrape pending" if st["undersampled"] else (("fragmentation below the brief's 3/5 floor" if st["status"].startswith("passes ad test") else "fewer than 2 verified tools pass the ad test") if st["status"] != "QUALIFIED" else "gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed")))
    L.append(f"\n**Confidence:** {conf}. Weakest link: {weakest}.\n\n---\n")
(D / "ideas_ranked.md").write_text("\n".join(L), encoding="utf-8")
# ---- dead_ends.md: every niche not qualified, with the filter that stops it today
DL = ["# dead_ends.md — niches not (yet) qualified, and which filter stops them\n",
      "All 160 niches have been searched (Step 2). `killed_by` reflects the current evidence; a niche whose tools are still awaiting the ad audit is not dead, just pending.\n",
      "| id | niche | verified tools | audited | passing | frag | killed_by | note |", "|---|---|---|---|---|---|---|---|"]
for i in sorted(N, key=int):
    st = ST[i]
    if st["status"] == "QUALIFIED": continue
    n = N[i]; nv = int(n["n_tools_search_verified"]); fr = st["frag"]
    if nv < 3: k, note = "Filter 2 (fewer than 3 URL-cited tools)", "re-run Step 2 with more searches or accept as thin"
    elif st["audited"] == 0: k, note = "pending Step 3 (tools not yet audited)", "in scraper/rescrape_tools.txt"
    elif st["audited"] < nv and len(st["passing"]) < 2: k, note = "pending Step 3 (partially audited)", f"{nv - st['audited']} tools still to audit"
    elif len(st["passing"]) < 2: k, note = "Filter 3 (fewer than 2 tools score >=5)", f"best tools: {', '.join(a['tool'] for a in sorted(st['rows'], key=lambda a: -(num(a['verified_score']) or 0))[:3])}"
    elif fr < 3: k, note = "Filter 4 (fragmentation < 3)", F.get(i, {}).get("gatekeeper_found", "")[:120]
    else: k, note = "review", st["status"]
    DL.append(f"| {i} | {n['niche']} | {nv} | {st['audited']} | {len(st['passing'])} | {fr} | {k} | {note} |")
(D / "dead_ends.md").write_text("\n".join(DL) + "\n", encoding="utf-8")
print("dead_ends rows:", len(DL) - 4)
print(f"qualified {len(qualified)}: {[N[i]['niche'] for i in qualified]}")
print(f"provisional {len(provisional)}: {[N[i]['niche'] for i in provisional]}")
print("wrote ideas_ranked.md", (D / "ideas_ranked.md").stat().st_size, "bytes")
