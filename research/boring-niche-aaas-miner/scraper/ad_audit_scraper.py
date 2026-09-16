#!/usr/bin/env python3
"""
Ad-longevity scraper for the Boring-Niche Idea Miner (Step 3).

Reads ../ad_audit.csv, visits the prebuilt Meta / Google / LinkedIn lookup URLs for
each tool with a real (Playwright) Chromium, extracts ad start dates, and writes
../ad_audit_filled.csv.  Designed to run on a laptop with normal internet access.

Run on 3 tools first and inspect scraper/debug/:   python ad_audit_scraper.py --sample 3 --headed
Full run on all search-verified tools:              python ad_audit_scraper.py
Resume is automatic (rows with scrape_status=ok are skipped).
Set PW_CHROMIUM_PATH=/path/to/chrome to use an existing Chromium instead of the Playwright download.

Extraction is text-based (regex over the page's visible text) rather than CSS-selector based,
so it survives most layout changes.  Every page visit saves a screenshot + HTML to debug/ when
something looks wrong; send those files back if a platform returns zeros.
"""
import argparse, csv, datetime as dt, json, os, random, re, sys, time, urllib.parse
from pathlib import Path

HERE = Path(__file__).resolve().parent
IN_CSV = HERE.parent / "ad_audit.csv"
OUT_CSV = HERE.parent / "ad_audit_filled.csv"
DEBUG = HERE / "debug"
TODAY = dt.date.today()

MONTHS = {m: i for i, m in enumerate(
    ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], 1)}
DATE_RE = r"([A-Z][a-z]{2})[a-z]*\.? (\d{1,2}), (\d{4})"

DIRECT_RESPONSE_CTAS = {
    "sign up","start free trial","free trial","book demo","book a demo","get a demo","request demo",
    "get quote","get started","try for free","start now","schedule demo","get offer","apply now",
    "download","install now","subscribe","book now","contact us","get access","start trial","try now",
}
BRAND_CTAS = {"learn more","watch more","see more","like page","follow"}

# ---------------------------------------------------------------- pure parsers (unit-tested offline)
def parse_date(s):
    m = re.search(DATE_RE, s)
    if not m: return None
    mon = MONTHS.get(m.group(1))
    if not mon: return None
    try: return dt.date(int(m.group(3)), mon, int(m.group(2)))
    except ValueError: return None

def norm(s): return re.sub(r"[^a-z0-9]", "", s.lower())

def advertiser_of(chunk):
    """Advertiser/page name = last meaningful line before the first 'Sponsored' line in a card."""
    lines = [l.strip() for l in chunk.splitlines()]
    for i, l in enumerate(lines):
        if l == "Sponsored":
            for j in range(i - 1, -1, -1):
                cand = lines[j].replace("\u200b", "").strip()
                if cand and cand not in ("See ad details", "Open Dropdown", "Platforms", "Categories"):
                    return cand
            break
    return ""

def name_match(a, b):
    a, b = norm(a), norm(b)
    return bool(a and b) and (a == b or a in b or b in a)

def parse_meta(text, tool_name):
    """Meta Ad Library results page text -> dict. Ads are chunked on 'Library ID'."""
    out = {"result_count": None, "ads": [], "no_ads": "No ads match your search criteria" in text}
    m = re.search(r"~?\s*([\d,]+)\s+results?", text)
    if m: out["result_count"] = int(m.group(1).replace(",", ""))
    chunks = re.split(r"Library ID:?\s*\d+", text)[1:]
    for ch in chunks:
        sm = re.search(r"Started running on\s+" + DATE_RE, ch)
        start = parse_date(sm.group(0)) if sm else None
        adv = advertiser_of(ch)
        matched = name_match(adv, tool_name)
        cta = None
        low = ch.lower()
        for c in sorted(DIRECT_RESPONSE_CTAS | BRAND_CTAS, key=len, reverse=True):
            if re.search(r"(^|\n)\s*" + re.escape(c) + r"\s*(\n|$)", low):
                cta = c; break
        plats = [p for p in ("Facebook","Instagram","Messenger","Audience Network","Threads") if p in ch[:600]]
        out["ads"].append({"start": start, "matched_page": matched, "advertiser": adv, "cta": cta, "platforms": plats})
    return out

def summarize_meta(parsed, page_mode=False):
    ads = parsed["ads"]
    sel = ads if page_mode else [a for a in ads if a["matched_page"]]
    dated = [a for a in sel if a["start"]]
    d60 = sum(1 for a in dated if (TODAY - a["start"]).days >= 60)
    d120 = sum(1 for a in dated if (TODAY - a["start"]).days >= 120)
    oldest = min((a["start"] for a in dated), default=None)
    plats = sorted({p for a in sel for p in a["platforms"]})
    ctas = {}
    for a in sel:
        if a["cta"]: ctas[a["cta"]] = ctas.get(a["cta"], 0) + 1
    advs = {}
    for a in ads: advs[a["advertiser"] or "?"] = advs.get(a["advertiser"] or "?", 0) + 1
    n_active = len(sel)
    if page_mode and parsed["result_count"] is not None: n_active = max(n_active, parsed["result_count"])
    return {
        "meta_active_ads": n_active, "meta_ads_60d": d60, "meta_ads_120d": d120,
        "meta_oldest_start": oldest.isoformat() if oldest else "",
        "meta_platforms": "|".join(plats), "meta_cta": "|".join(f"{k}:{v}" for k, v in sorted(ctas.items(), key=lambda kv: -kv[1])),
        "meta_result_count": parsed["result_count"] if parsed["result_count"] is not None else "",
        "meta_matched_page_ads": len(sel),
        "meta_all_ads_seen": len(ads),
        "meta_advertisers_seen": "|".join(f"{k}:{v}" for k, v in sorted(advs.items(), key=lambda kv: -kv[1])[:8]),
    }

def parse_google_listing(text):
    """Advertiser/domain listing text -> ad count + formats."""
    out = {"ad_count": None, "formats": []}
    m = re.search(r"([\d,]+)\s+ads?\b", text)
    if m: out["ad_count"] = int(m.group(1).replace(",", ""))
    for f in ("Text", "Image", "Video"):
        if re.search(r"\b" + f + r"\b", text): out["formats"].append(f.lower())
    return out

def parse_google_creative(text):
    first = last = None
    m = re.search(r"First shown:?\s*" + DATE_RE, text)
    if m: first = parse_date(m.group(0))
    m = re.search(r"Last shown:?\s*" + DATE_RE, text)
    if m: last = parse_date(m.group(0))
    fmt = None
    for f in ("Text", "Image", "Video"):
        if re.search(r"\bFormat:?\s*" + f, text): fmt = f.lower()
    return {"first": first, "last": last, "format": fmt}

def google_pass_90d(cr):
    return bool(cr["first"] and cr["last"] and (TODAY - cr["first"]).days >= 90 and (TODAY - cr["last"]).days <= 14)

def parse_linkedin(text):
    out = {"ad_count": None, "ranges": []}
    m = re.search(r"([\d,]+)\s+(?:ads?|results?)\b", text)
    if m: out["ad_count"] = int(m.group(1).replace(",", ""))
    for m in re.finditer(r"[Rr]an (?:from|on)\s+" + DATE_RE + r"(?:\s*(?:to|-|–)\s*" + DATE_RE + r")?", text):
        a = parse_date(m.group(0))
        b = parse_date(m.group(0)[m.group(0).find(" to ") + 4:]) if " to " in m.group(0) else None
        out["ranges"].append((a, b))
    return out

def summarize_linkedin(p):
    running = any((b is None) or ((TODAY - b).days <= 30) for a, b in p["ranges"]) if p["ranges"] else None
    return {
        "linkedin_ad_count": p["ad_count"] if p["ad_count"] is not None else len(p["ranges"]),
        "linkedin_present": "yes" if (p["ad_count"] or p["ranges"]) else "no",
        "linkedin_currently_running": "" if running is None else ("yes" if running else "no"),
        "linkedin_date_ranges": "|".join(f"{a}..{b or 'present'}" for a, b in p["ranges"][:20]),
    }

# ---------------------------------------------------------------- browser helpers
def sleep(a=2.5, b=6.0): time.sleep(random.uniform(a, b))

def dump(page, tag):
    DEBUG.mkdir(exist_ok=True)
    safe = re.sub(r"[^A-Za-z0-9_.-]", "_", tag)[:120]
    try:
        page.screenshot(path=str(DEBUG / f"{safe}.png"), full_page=True)
        # visible text only: raw HTML can carry session tokens / account details, text cannot
        (DEBUG / f"{safe}.txt").write_text(body_text(page), encoding="utf-8")
    except Exception as e:
        print(f"    debug dump failed: {e}")

def body_text(page):
    try: return page.inner_text("body")
    except Exception: return ""

def scroll(page, times=6, pause=1.2):
    for _ in range(times):
        page.mouse.wheel(0, 4000); time.sleep(pause)

def goto(page, url, wait="networkidle", timeout=45000):
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=timeout)
        try: page.wait_for_load_state(wait, timeout=15000)
        except Exception: pass
        return True
    except Exception as e:
        print(f"    navigation failed: {e}"); return False

META_BASE = "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&media_type=all"

def dismiss_cookies(page):
    for label in ("Allow all cookies", "Accept all", "Decline optional cookies", "Only allow essential cookies"):
        try:
            b = page.get_by_role("button", name=label)
            if b.count(): b.first.click(timeout=2000); return
        except Exception: pass

def meta_pick_page(page, tool):
    """Type the tool name in the Ad Library search box and click the matching Page suggestion.
    Returns True when the results URL is a page search (view_all_page_id)."""
    try:
        box = page.get_by_placeholder(re.compile("Search by keyword or advertiser", re.I))
        if not box.count(): box = page.locator('input[type="search"], input[placeholder*="Search"]')
        box.first.click(timeout=5000); box.first.fill(tool); time.sleep(3)
        # suggestions render as a list; try role=option, then any clickable element whose text equals the name
        cands = page.get_by_role("option")
        if not cands.count():
            cands = page.locator('[role="listbox"] [role="button"], [role="listbox"] a, [role="listbox"] div')
        n = min(cands.count(), 12)
        for i in range(n):
            try:
                t = cands.nth(i).inner_text(timeout=1000).split("\n")[0]
            except Exception: continue
            if name_match(t, tool):
                cands.nth(i).click(timeout=3000); time.sleep(3)
                if "view_all_page_id" in page.url: return True
        return "view_all_page_id" in page.url
    except Exception as e:
        print(f"    meta typeahead failed: {e}"); return False

def do_meta(page, row, tool, args):
    if not goto(page, META_BASE): return {"meta_status": "nav_error"}
    sleep(1, 2); dismiss_cookies(page)
    page_mode = meta_pick_page(page, tool)
    mode = "page"
    if not page_mode:
        mode = "keyword_exact_phrase"
        url = META_BASE + "&q=" + urllib.parse.quote(tool) + "&search_type=keyword_exact_phrase"
        if not goto(page, url): return {"meta_status": "nav_error", "meta_match_mode": mode}
        sleep(1, 2)
    text = body_text(page)
    parsed = parse_meta(text, tool)
    # scroll until parsed count reaches the reported result count (cap)
    for _ in range(args.scrolls * 3):
        if parsed["result_count"] is None or len(parsed["ads"]) >= min(parsed["result_count"], args.meta_max_ads): break
        scroll(page, times=1); text = body_text(page); parsed = parse_meta(text, tool)
    s = summarize_meta(parsed, page_mode=page_mode)
    s["meta_match_mode"] = mode
    s["meta_results_url"] = page.url
    if parsed["no_ads"] or (parsed["result_count"] == 0):
        status = "ok_no_ads"
    elif parsed["ads"]:
        status = "ok" if (page_mode or s["meta_matched_page_ads"]) else "ok_no_matching_advertiser"
    else:
        status = "no_ads_parsed"
    if status in ("no_ads_parsed",) or args.debug_all: dump(page, f"{row['niche_id']}_{tool}_meta")
    s["meta_status"] = status
    return s

CREATIVE_ID = re.compile(r"/creative/(CR[0-9A-Za-z]+)")

def creative_ids(page, scrolls=2):
    scroll(page, times=scrolls)
    ids = []
    for a in page.locator('a[href*="/creative/"]').all():
        try:
            h = a.get_attribute("href") or ""
            m = CREATIVE_ID.search(h)
            if m: ids.append((m.group(1), urllib.parse.urljoin("https://adstransparency.google.com/", h)))
        except Exception: pass
    return dict(ids)

def with_params(url, **kw):
    u = urllib.parse.urlsplit(url); q = dict(urllib.parse.parse_qsl(u.query)); q.update(kw)
    return urllib.parse.urlunsplit((u.scheme, u.netloc, u.path, urllib.parse.urlencode(q), ""))

def do_google(page, row, tool, args):
    if not goto(page, row["google_lookup_url"]): return {"google_status": "nav_error"}
    sleep(1, 2); scroll(page, times=2)
    text = body_text(page)
    if "No ads found" in text or re.search(r"\b0 ads\b", text):
        return {"google_status": "ok_no_ads", "google_ad_count": 0, "google_overlap_90d_pass": 0, "google_formats": "",
                "google_creatives_checked": 0, "google_overlap_method": "domain_zero"}
    # domain page may list several advertiser accounts; take the first advertiser page
    if page.locator('a[href*="/creative/"]').count() == 0 and page.locator('a[href*="/advertiser/"]').count() > 0:
        try:
            page.locator('a[href*="/advertiser/"]').first.click(timeout=5000)
            page.wait_for_load_state("networkidle", timeout=15000); sleep(1, 2)
            text = body_text(page)
        except Exception: pass
    adv_url = page.url if "/advertiser/" in page.url else ""
    listing = parse_google_listing(text)
    ids_all = creative_ids(page, scrolls=3)
    base = adv_url or row["google_lookup_url"]
    old_s, old_e = (TODAY - dt.timedelta(days=180)).isoformat(), (TODAY - dt.timedelta(days=90)).isoformat()
    rec_s, rec_e = (TODAY - dt.timedelta(days=7)).isoformat(), TODAY.isoformat()
    ids_old = ids_rec = {}
    if goto(page, with_params(base, **{"start-date": old_s, "end-date": old_e})):
        sleep(1, 2); ids_old = creative_ids(page, scrolls=3); old_text = body_text(page)
    if goto(page, with_params(base, **{"start-date": rec_s, "end-date": rec_e})):
        sleep(1, 2); ids_rec = creative_ids(page, scrolls=3)
    overlap = sorted(set(ids_old) & set(ids_rec))
    method = "date_window_overlap"
    if ids_all and set(ids_old) == set(ids_all) == set(ids_rec):
        method = "filter_ignored_unverified"  # date params had no effect; cannot trust overlap
    # sample creative detail pages for last-shown / format
    creatives = []
    for cid, h in list(ids_all.items())[: args.google_creatives]:
        if not goto(page, h): continue
        sleep(0.6, 1.4); creatives.append(parse_google_creative(body_text(page)))
    lasts = [c["last"] for c in creatives if c["last"]]
    fmts = sorted({c["format"] for c in creatives if c["format"]} | set(listing["formats"]))
    status = "ok" if (listing["ad_count"] is not None or ids_all) else "no_ads_parsed"
    if status != "ok" or args.debug_all: dump(page, f"{row['niche_id']}_{tool}_google")
    return {
        "google_status": status,
        "google_advertiser_page_url": adv_url or row.get("google_advertiser_page_url", ""),
        "google_ad_count": listing["ad_count"] if listing["ad_count"] is not None else len(ids_all),
        "google_formats": "|".join(fmts),
        "google_creatives_checked": len(creatives),
        "google_overlap_90d_pass": len(overlap) if method == "date_window_overlap" else "",
        "google_overlap_method": method,
        "google_ids_all": len(ids_all), "google_ids_old_window": len(ids_old), "google_ids_recent_window": len(ids_rec),
        "google_last_shown_max": max(lasts).isoformat() if lasts else "",
        "google_creatives_json": json.dumps([{"last": str(c["last"]), "format": c["format"]} for c in creatives]),
    }

def linkedin_by_advertiser(page, tool):
    try:
        if not goto(page, "https://www.linkedin.com/ad-library/home"): return False
        sleep(1, 2)
        box = page.get_by_placeholder(re.compile("Company or advertiser", re.I))
        if not box.count(): box = page.get_by_label(re.compile("Company or advertiser", re.I))
        if not box.count(): return False
        box.first.click(timeout=5000); box.first.fill(tool); time.sleep(3)
        opts = page.get_by_role("option")
        picked = False
        for i in range(min(opts.count(), 10)):
            try: t = opts.nth(i).inner_text(timeout=1000).split("\n")[0]
            except Exception: continue
            if name_match(t, tool): opts.nth(i).click(timeout=3000); picked = True; break
        if not picked: return False
        page.get_by_role("button", name=re.compile("^Search$", re.I)).first.click(timeout=5000)
        page.wait_for_load_state("networkidle", timeout=15000); sleep(1, 2)
        return True
    except Exception as e:
        print(f"    linkedin advertiser lookup failed: {e}"); return False

def do_linkedin(page, row, tool, args):
    method = "advertiser"
    if not linkedin_by_advertiser(page, tool):
        method = "keyword"
        if not goto(page, row["linkedin_lookup_url"]): return {"linkedin_status": "nav_error", "linkedin_method": method}
    sleep(1, 2); scroll(page, times=3)
    text = body_text(page)
    links = []
    for a in page.locator('a[href*="/ad-library/detail/"]').all()[: args.linkedin_details]:
        try:
            h = a.get_attribute("href")
            if h: links.append(urllib.parse.urljoin("https://www.linkedin.com/", h))
        except Exception: pass
    p = parse_linkedin(text)
    ranges = []
    for h in dict.fromkeys(links):
        if not goto(page, h): continue
        sleep(0.8, 1.6); ranges += parse_linkedin(body_text(page))["ranges"]
    if ranges: p["ranges"] = ranges
    s = summarize_linkedin(p)
    if "No results found" in text: status = "ok_no_ads"
    elif p["ad_count"] is not None or p["ranges"] or links: status = "ok"
    else: status = "no_ads_parsed"
    if "sign in" in text.lower()[:1500] and status == "no_ads_parsed": status = "login_wall"
    if status in ("no_ads_parsed", "login_wall") or args.debug_all: dump(page, f"{row['niche_id']}_{tool}_linkedin")
    s["linkedin_status"] = status; s["linkedin_method"] = method
    return s

EXTRA_COLS = ["scrape_status","scraped_at",
              "meta_status","meta_match_mode","meta_results_url","meta_result_count","meta_matched_page_ads","meta_all_ads_seen","meta_advertisers_seen","meta_oldest_start",
              "google_status","google_overlap_method","google_ids_all","google_ids_old_window","google_ids_recent_window","google_creatives_checked","google_last_shown_max","google_creatives_json",
              "linkedin_status","linkedin_method","linkedin_ad_count","linkedin_currently_running"]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sample", type=int, default=0, help="only scrape the first N eligible rows")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--all", action="store_true", help="include candidate (unverified) tool rows too")
    ap.add_argument("--niches", default="", help="comma-separated niche ids to include")
    ap.add_argument("--headed", action="store_true", help="show the browser (log in to Meta/LinkedIn once if walled)")
    ap.add_argument("--profile", default=str(HERE / "pw-profile"), help="persistent browser profile dir")
    ap.add_argument("--scrolls", type=int, default=6)
    ap.add_argument("--google-creatives", type=int, default=8, help="creative detail pages to open per advertiser (last-shown/format)")
    ap.add_argument("--meta-max-ads", type=int, default=150)
    ap.add_argument("--linkedin-details", type=int, default=8)
    ap.add_argument("--skip", default="", help="comma list of platforms to skip: meta,google,linkedin")
    ap.add_argument("--debug-all", action="store_true", help="save a screenshot + visible-text dump for every page")
    ap.add_argument("--force", action="store_true", help="re-scrape rows already marked ok")
    args = ap.parse_args()
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        sys.exit("pip install playwright && python -m playwright install chromium")

    rows = list(csv.DictReader(open(IN_CSV, newline="", encoding="utf-8")))
    cols = list(rows[0].keys()) + [c for c in EXTRA_COLS if c not in rows[0]]
    done = {}
    if OUT_CSV.exists():
        for r in csv.DictReader(open(OUT_CSV, newline="", encoding="utf-8")):
            done[(r["niche_id"], r["tool"])] = r
    want = set(x.strip() for x in args.niches.split(",") if x.strip())
    todo = []
    for r in rows:
        if not args.all and not r.get("verification_status", "").startswith("search"): continue
        if want and r["niche_id"] not in want: continue
        if not args.force and done.get((r["niche_id"], r["tool"]), {}).get("scrape_status") == "ok": continue
        todo.append(r)
    seen = set(); dedup = []
    for r in todo:  # same tool across niches: scrape once, copy later
        k = norm(r["tool"]); 
        if k in seen: continue
        seen.add(k); dedup.append(r)
    if args.sample: dedup = dedup[: args.sample]
    if args.limit: dedup = dedup[: args.limit]
    skip = set(args.skip.split(",")) if args.skip else set()
    print(f"{len(dedup)} unique tools to scrape ({len(todo)} rows incl. duplicates across niches)")

    results = {}
    with sync_playwright() as p:
        launch_kw = {}
        if os.environ.get("PW_CHROMIUM_PATH"): launch_kw["executable_path"] = os.environ["PW_CHROMIUM_PATH"]
        ctx = p.chromium.launch_persistent_context(args.profile, headless=not args.headed, **launch_kw,
                viewport={"width": 1366, "height": 900},
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36",
                locale="en-US")
        page = ctx.new_page()
        for i, r in enumerate(dedup, 1):
            tool = r["tool"]; print(f"[{i}/{len(dedup)}] {tool} ({r['domain']})")
            res = {}
            for plat, fn in (("meta", do_meta), ("google", do_google), ("linkedin", do_linkedin)):
                if plat in skip: continue
                try: res.update(fn(page, r, tool, args))
                except Exception as e:
                    print(f"    {plat} error: {e}"); res[f"{plat}_status"] = f"error: {e}"[:200]
                    try: dump(page, f"{r['niche_id']}_{tool}_{plat}_error")
                    except Exception: pass
                sleep()
            stat = [res.get(f"{p}_status", "skipped") for p in ("meta","google","linkedin")]
            res["scrape_status"] = "ok" if all(s.startswith("ok") or s == "skipped" for s in stat) else "partial:" + ",".join(stat)
            res["scraped_at"] = dt.datetime.now().isoformat(timespec="seconds")
            results[norm(tool)] = res
            print("    " + ", ".join(f"{k}={res[k]}" for k in ("meta_active_ads","meta_ads_60d","google_ad_count","google_overlap_90d_pass","linkedin_present") if k in res))
            write_out(rows, cols, done, results)
        ctx.close()
    write_out(rows, cols, done, results)
    print(f"wrote {OUT_CSV}")

def write_out(rows, cols, done, results):
    out = []
    for r in rows:
        base = dict(r)
        prev = done.get((r["niche_id"], r["tool"]))
        if prev: base.update({k: v for k, v in prev.items() if v not in ("", None)})
        res = results.get(norm(r["tool"]))
        if res:
            for k, v in res.items(): base[k] = v
            base["verified_score"] = ""  # recomputed by score_ad_audit.py
        out.append({c: base.get(c, "") for c in cols})
    tmp = OUT_CSV.with_suffix(".tmp")
    with open(tmp, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols); w.writeheader(); w.writerows(out)
    os.replace(tmp, OUT_CSV)

if __name__ == "__main__":
    main()
