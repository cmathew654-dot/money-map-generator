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
import argparse, collections, csv, datetime as dt, json, os, random, re, sys, time, urllib.parse
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
BRAND_CTAS = {"learn more","watch more","see more","like page","follow","listen now","watch now","shop now","send message","get directions","play game","open link"}

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
    """True when one name is the other, or one starts with the other at a word boundary.
    The shorter side must be substantial (>=8 letters or >=2 words) so 'Garage' cannot stand in for 'Garage Door OS'.
    'ServiceTitan Inc' ~ 'ServiceTitan'; 'Service Autopilot by Xplor' ~ 'Service Autopilot'; 'Jobberman' !~ 'Jobber'."""
    if not a or not b: return False
    a_, b_ = a.strip(), b.strip()
    if norm(a_) == norm(b_): return True
    def substantial(x): return len(norm(x)) >= 8 or len(re.findall(r"[A-Za-z0-9]+", x)) >= 2
    def starts(long, short):
        if not substantial(short): return False
        pat = r"^\W*" + r"\W*".join(re.escape(ch) for ch in re.sub(r"\W", "", short)) + r"(?=\W|$)"
        return re.match(pat, long, re.I) is not None
    return starts(a_, b_) or starts(b_, a_)

def best_match(names, tool):
    """Pick the best candidate name for a tool: exact normalized match first, then a name that starts with the tool, then the reverse."""
    exact = [n for n in names if norm(n) == norm(tool)]
    if exact: return exact[0]
    fwd = [n for n in names if name_match(n, tool) and norm(n).startswith(norm(tool))]
    if fwd: return fwd[0]
    rest = [n for n in names if name_match(n, tool)]
    return rest[0] if rest else None

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
        gm = re.search(r"(\d+) ads use this creative", ch)
        weight = int(gm.group(1)) if gm else 1
        out["ads"].append({"start": start, "matched_page": matched, "advertiser": adv, "cta": cta, "platforms": plats, "weight": weight})
    return out

def summarize_meta(parsed, page_mode=False):
    ads = parsed["ads"]
    sel = ads if page_mode else [a for a in ads if a["matched_page"]]
    dated = [a for a in sel if a["start"]]
    d60 = sum(a.get("weight", 1) for a in dated if (TODAY - a["start"]).days >= 60)
    d120 = sum(a.get("weight", 1) for a in dated if (TODAY - a["start"]).days >= 120)
    oldest = min((a["start"] for a in dated), default=None)
    plats = sorted({p for a in sel for p in a["platforms"]})
    ctas = {}
    for a in sel:
        if a["cta"]: ctas[a["cta"]] = ctas.get(a["cta"], 0) + 1
    advs = {}
    for a in ads: advs[a["advertiser"] or "?"] = advs.get(a["advertiser"] or "?", 0) + 1
    n_active = sum(a.get("weight", 1) for a in sel)
    if page_mode and parsed["result_count"] is not None: n_active = max(n_active, parsed["result_count"])
    return {
        "meta_active_ads": n_active, "meta_ads_60d": d60, "meta_ads_120d": d120,
        "meta_oldest_start": oldest.isoformat() if oldest else "",
        "meta_platforms": "|".join(plats), "meta_cta": "|".join(f"{k}:{v}" for k, v in sorted(ctas.items(), key=lambda kv: -kv[1])),
        "meta_result_count": parsed["result_count"] if parsed["result_count"] is not None else "",
        "meta_matched_page_ads": sum(a.get("weight", 1) for a in sel),
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
FAST = False
def sleep(a=2.5, b=6.0):
    if FAST: a, b = min(a, 0.4), min(b, 1.0)
    time.sleep(random.uniform(a, b))

def dump(page, tag):
    DEBUG.mkdir(exist_ok=True)
    safe = re.sub(r"[^A-Za-z0-9_.-]", "_", tag)[:120]
    try:
        page.screenshot(path=str(DEBUG / f"{safe}.png"), full_page=True)
        # visible text only: raw HTML can carry session tokens / account details, text cannot
        (DEBUG / f"{safe}.txt").write_text(body_text(page), encoding="utf-8")
    except Exception as e:
        print(f"    debug dump failed: {e}")

def save_json(tag, bodies):
    DEBUG.mkdir(exist_ok=True)
    safe = re.sub(r"[^A-Za-z0-9_.-]", "_", tag)[:120]
    try:
        with open(DEBUG / f"{safe}.json.txt", "w", encoding="utf-8") as f:
            for u, b in bodies: f.write(u + "\n" + b[:200000] + "\n\n====\n\n")
    except Exception as e: print(f"    json dump failed: {e}")

def body_text(page):
    try: return page.inner_text("body")
    except Exception: return ""

def scroll(page, times=6, pause=1.2):
    if FAST: pause = min(pause, 0.6)
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

class Capture:
    """Records XHR responses whose URL matches any needle; bodies are read later in take() (never inside the handler)."""
    def __init__(self, page, needles):
        self.resps = []; self.needles = needles; self.page = page
        page.on("response", self._on)
    def _on(self, resp):
        try:
            if any(n in resp.url for n in self.needles): self.resps.append(resp)
        except Exception: pass
    def take(self):
        out = []
        for r in self.resps:
            try: out.append((r.url, r.text()))
            except Exception: pass
        self.resps = []
        return out
    def close(self):
        try: self.page.remove_listener("response", self._on)
        except Exception: pass

def fb_json(body):
    """Facebook responses: optional 'for (;;);' prefix, and GraphQL may return several JSON objects on separate lines."""
    b = body.strip()
    if b.startswith("for (;;);"): b = b[len("for (;;);"):]
    try: return json.loads(b)
    except Exception: pass
    objs = []
    for line in b.splitlines():
        line = line.strip()
        if not line: continue
        try: objs.append(json.loads(line))
        except Exception: continue
    return objs or None

def walk(obj):
    """Yield every dict inside a nested JSON structure."""
    if isinstance(obj, dict):
        yield obj
        for v in obj.values(): yield from walk(v)
    elif isinstance(obj, list):
        for v in obj: yield from walk(v)

def meta_pages_from_typeahead(bodies):
    pages = []
    for u, body in bodies:
        j = fb_json(body)
        if not j: continue
        for d in walk(j):
            pid = d.get("page_id", d.get("id"))
            nm = d.get("name", d.get("page_name"))
            if isinstance(pid, (str, int)) and isinstance(nm, str) and str(pid).isdigit() and ("category" in d or "likes" in d or "verification" in d or "image_uri" in d or "page_alias" in d or "ig_username" in d):
                pages.append({"id": str(pid), "name": nm, "category": d.get("category", ""), "likes": d.get("likes", "")})
    seen = set(); out = []
    for p_ in pages:
        if p_["id"] in seen: continue
        seen.add(p_["id"]); out.append(p_)
    return out

def meta_ads_from_json(bodies):
    """Extract ads from search_ads JSON responses: start date, page name, platforms, CTA."""
    ads = []
    for u, body in bodies:
        j = fb_json(body)
        if not j: continue
        for d in walk(j):
            sd = d.get("startDate", d.get("start_date"))
            pn = d.get("pageName", d.get("page_name"))
            if sd is None or pn is None: continue
            try: start = dt.date.fromtimestamp(int(sd))
            except Exception:
                start = parse_date(str(sd))
            snap = d.get("snapshot") or {}
            cta = (snap.get("cta_text") or snap.get("cta_type") or d.get("cta_text") or d.get("cta_type") or "")
            plats = d.get("publisherPlatform") or d.get("publisher_platform") or []
            if isinstance(plats, str): plats = [plats]
            coll = d.get("collationCount") or d.get("collation_count") or 1
            ads.append({"id": str(d.get("adArchiveID", d.get("ad_archive_id", ""))), "start": start, "advertiser": pn,
                        "cta": str(cta).replace("_", " ").lower(), "platforms": [str(x).title() for x in plats], "weight": int(coll) if str(coll).isdigit() else 1,
                        "page_id": str(d.get("pageID", d.get("page_id", "")))})
    seen = set(); out = []
    for a in ads:
        k = a["id"] or (a["advertiser"], str(a["start"]))
        if k in seen: continue
        seen.add(k); out.append(a)
    return out

META_BASE = "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&media_type=all"

def dismiss_cookies(page):
    for label in ("Allow all cookies", "Accept all", "Decline optional cookies", "Only allow essential cookies"):
        try:
            b = page.get_by_role("button", name=label)
            if b.count(): b.first.click(timeout=2000); return
        except Exception: pass

def try_click_matches(page, tool, locators, tag):
    """Click the first element among `locators` whose text matches the tool name; return True if URL became a page view."""
    deadline = time.time() + 25
    for loc in locators:
        if time.time() > deadline: break
        try: n = min(loc.count(), 8)
        except Exception: continue
        for i in range(n):
            try:
                t = loc.nth(i).inner_text(timeout=800).strip().split("\n")[0]
            except Exception: continue
            if time.time() > deadline: break
            if name_match(t, tool):
                try:
                    loc.nth(i).click(timeout=3000); time.sleep(3)
                except Exception: continue
                if "view_all_page_id" in page.url: return True
    return False

def focus_search_box(page, label_re, exclude_re):
    """Focus the main search input. Tries the visible label text first, then visible inputs not matching exclude_re."""
    try:
        lab = page.get_by_text(label_re).first
        if lab.count():
            lab.click(timeout=3000); time.sleep(0.5); return True
    except Exception: pass
    try:
        inputs = page.locator("input:visible")
        for i in range(min(inputs.count(), 10)):
            el = inputs.nth(i)
            meta = " ".join(filter(None, [el.get_attribute("placeholder") or "", el.get_attribute("aria-label") or "", el.get_attribute("type") or ""]))
            if exclude_re.search(meta): continue
            if (el.get_attribute("type") or "text") not in ("text", "search", ""): continue
            el.click(timeout=3000); time.sleep(0.5); return True
    except Exception: pass
    try:
        cb = page.get_by_role("combobox").first
        if cb.count(): cb.click(timeout=3000); time.sleep(0.5); return True
    except Exception: pass
    return False

def meta_pick_page(page, tool, row, args):
    """Type the tool name in the Ad Library search box and click the matching Page suggestion."""
    try:
        if not focus_search_box(page, re.compile("Search by keyword or advertiser", re.I), re.compile("country", re.I)):
            print("    meta: search box not found"); dump(page, f"{row['niche_id']}_{tool}_meta_nobox"); return False
        page.keyboard.type(tool, delay=70); time.sleep(3.5)
        dump(page, f"{row['niche_id']}_{tool}_meta_typeahead")  # always: shows what the suggestion list looked like
        locs = [page.get_by_role("option"), page.locator('[role="listbox"] [role="option"], [role="listbox"] li, [role="listbox"] a, [role="listbox"] div[role="button"]'),
                page.get_by_text(re.compile(r"^\s*" + re.escape(tool) + r"\s*$", re.I))]
        if try_click_matches(page, tool, locs, "typeahead"): return True
        page.keyboard.press("ArrowDown"); time.sleep(0.5); page.keyboard.press("Enter"); time.sleep(3)
        return "view_all_page_id" in page.url
    except Exception as e:
        print(f"    meta typeahead failed: {e}"); return False

def meta_click_advertiser(page, name):
    """On a keyword-results page, click the advertiser name inside a card to open that Page's ad list."""
    loc = page.get_by_text(name, exact=True)
    try: n = min(loc.count(), 2)
    except Exception: return False
    for i in range(n):
        try:
            loc.nth(i).click(timeout=3000); time.sleep(3)
            if "view_all_page_id" in page.url: return True
            page.go_back(timeout=10000); time.sleep(2)
        except Exception: continue
    return False

def meta_collect(page, cap, tool, args, parsed_text_first=True):
    """Scroll the current results view, collecting ads from JSON (primary) and DOM (fallback)."""
    json_ads = meta_ads_from_json(cap.take())
    text = body_text(page); parsed = parse_meta(text, tool)
    stale = 0
    for i in range(args.scrolls * 3):
        target = parsed["result_count"]
        have = max(len(json_ads), len(parsed["ads"]))
        if target is not None and have >= min(target, args.meta_max_ads): break
        if target is None and i >= args.scrolls: break
        scroll(page, times=1); time.sleep(0.6 if FAST else 1.2)
        json_ads += meta_ads_from_json(cap.take()); text = body_text(page); parsed = parse_meta(text, tool)
        now = max(len(json_ads), len(parsed["ads"]))
        stale = stale + 1 if now <= have else 0
        if stale >= 3: break   # nothing new after three scrolls: the page has no more ads to give
    seen = set(); ja = []
    for a in json_ads:
        k = a["id"] or (a["advertiser"], str(a["start"]))
        if k in seen: continue
        seen.add(k); ja.append(a)
    return parsed, ja

def do_meta(page, row, tool, args):
    cap = Capture(page, ["search_typeahead", "search_ads", "ads/library/async", "/api/graphql"])
    try: return _do_meta(page, row, tool, args, cap)
    finally: cap.close()

def _do_meta(page, row, tool, args, cap):
    kw_url = META_BASE + "&q=" + urllib.parse.quote(tool) + "&search_type=keyword_unordered"
    if not goto(page, kw_url): return {"meta_status": "nav_error"}
    sleep(2, 3); dismiss_cookies(page)
    # 1) keyword results: JSON carries page_id + page_name for every ad -> resolve the vendor's Page id without any typeahead
    parsed_kw, ads_kw = meta_collect(page, cap, tool, args)
    page_id = ""; page_name = ""; mode = None
    cands = collections.Counter((a.get("page_id", ""), a["advertiser"]) for a in ads_kw if a.get("page_id") and name_match(a["advertiser"], tool))
    if cands:
        bm = best_match([k[1] for k in cands], tool)
        (page_id, page_name) = next(k for k in cands if k[1] == bm); mode = "page_id_from_keyword_results_json"
    # 2) typeahead on the results page (the search box exists here, unlike the landing page)
    if not page_id:
        try:
            if focus_search_box(page, re.compile("Search by keyword or advertiser", re.I), re.compile("country", re.I)):
                page.keyboard.press("Control+A"); page.keyboard.type(tool, delay=70); time.sleep(3.5)
                bodies = cap.take(); pages = meta_pages_from_typeahead(bodies)
                if args.debug_all or not pages:
                    dump(page, f"{row['niche_id']}_{tool}_meta_typeahead"); save_json(f"{row['niche_id']}_{tool}_meta_typeahead", bodies)
                print(f"    meta typeahead: {len(bodies)} responses, {len(pages)} pages parsed: {[p_['name'] for p_ in pages][:5]}")
                bm = best_match([p_["name"] for p_ in pages], tool)
                if bm:
                    p_ = next(x for x in pages if x["name"] == bm); page_id, page_name = p_["id"], p_["name"]; mode = "page_id_from_typeahead_json"
                if not page_id and pages and args.meta_accept_first_suggestion:
                    page_id, page_name = pages[0]["id"], pages[0]["name"]; mode = "page_id_first_suggestion"
        except Exception as e:
            print(f"    meta typeahead error: {e}")
    if page_id:
        goto(page, META_BASE + f"&search_type=page&view_all_page_id={page_id}"); sleep(2, 3)
        parsed, ja = meta_collect(page, cap, tool, args)
    else:
        mode = "keyword_unordered_filtered_by_advertiser" if (ads_kw or parsed_kw["ads"]) else "keyword_unordered_no_results"
        parsed, ja = parsed_kw, ads_kw
    page_mode = bool(page_id)
    source = "dom"
    if ja:
        source = "json"
        for a in ja:
            a["matched_page"] = (page_id and a.get("page_id") == page_id) or name_match(a["advertiser"], page_name or tool) or name_match(a["advertiser"], tool)
        parsed = {"result_count": parsed["result_count"], "ads": ja, "no_ads": parsed["no_ads"]}
    s = summarize_meta(parsed, page_mode=page_mode)
    s["meta_match_mode"] = mode; s["meta_data_source"] = source; s["meta_page_id"] = page_id; s["meta_page_name"] = page_name
    s["meta_results_url"] = page.url
    if parsed["no_ads"] or parsed["result_count"] == 0: status = "ok_no_ads"
    elif parsed["ads"]: status = "ok" if (page_mode or s["meta_matched_page_ads"]) else "ok_no_matching_advertiser"
    else: status = "no_ads_parsed"
    if status == "no_ads_parsed" or args.debug_all: dump(page, f"{row['niche_id']}_{tool}_meta"); save_json(f"{row['niche_id']}_{tool}_meta_ads", cap.take())
    s["meta_status"] = status
    return s

GOOGLE_FMT = {1: "fmt1", 2: "fmt2", 3: "fmt3_video_or_html5"}  # raw format codes; 3 carries a content.js preview (video/HTML5), 1 and 2 are image-rendered

def parse_google_rpc(bodies):
    """SearchCreatives RPC -> list of creatives with first/last shown dates."""
    out = {}
    for u, body in bodies:
        if "SearchCreatives" not in u: continue
        try: j = json.loads(body)
        except Exception: continue
        for c in (j.get("1") or []) if isinstance(j, dict) else []:
            try:
                cid = c.get("2"); adv = c.get("1")
                f = int((c.get("6") or {}).get("1", 0)) or None
                l = int((c.get("7") or {}).get("1", 0)) or None
                out[cid] = {"id": cid, "adv_id": adv, "adv_name": c.get("12", ""), "domain": c.get("14", ""), "fmt_code": c.get("4"),
                            "format": GOOGLE_FMT.get(c.get("4"), str(c.get("4"))),
                            "first": dt.date.fromtimestamp(f) if f else None, "last": dt.date.fromtimestamp(l) if l else None,
                            "days_shown": c.get("13")}
            except Exception: continue
    return list(out.values())

def do_google(page, row, tool, args):
    cap = Capture(page, ["SearchCreatives"])
    try: return _do_google(page, row, tool, args, cap)
    finally: cap.close()

def _do_google(page, row, tool, args, cap):
    if not goto(page, row["google_lookup_url"]): return {"google_status": "nav_error"}
    sleep(2, 3)
    text = body_text(page)
    if "No ads found" in text or re.search(r"\b0 ads\b", text):
        return {"google_status": "ok_no_ads", "google_ad_count": 0, "google_overlap_90d_pass": 0, "google_formats": "",
                "google_creatives_checked": 0, "google_overlap_method": "rpc_domain_zero"}
    bodies = cap.take(); creatives = parse_google_rpc(bodies)
    for _ in range(args.google_pages):          # each scroll can trigger the next 40-creative page
        before = len(creatives)
        scroll(page, times=2); time.sleep(2)
        bodies += cap.take(); creatives = parse_google_rpc(bodies)
        if len(creatives) == before: break
    if args.debug_all: save_json(f"{row['niche_id']}_{tool}_google_rpc", bodies)
    listing = parse_google_listing(text)
    if not creatives:
        dump(page, f"{row['niche_id']}_{tool}_google")
        return {"google_status": "no_ads_parsed", "google_ad_count": listing["ad_count"] if listing["ad_count"] is not None else "",
                "google_overlap_method": "rpc_no_creatives"}
    dom = row["domain"].lower().replace("www.", "")
    by_adv = {}
    for c in creatives: by_adv.setdefault((c["adv_id"], c["adv_name"], c["domain"]), []).append(c)
    ranked = sorted(by_adv.items(), key=lambda kv: (-(kv[0][2].lower().replace("www.", "") == dom), -len(kv[1])))
    (adv_id, adv_name, adv_dom), mine = ranked[0]
    others = "|".join(f"{k[1]}:{len(v)}" for k, v in ranked[1:6])
    passing = [c for c in mine if c["first"] and c["last"] and (TODAY - c["first"]).days >= 90 and (TODAY - c["last"]).days <= 14]
    firsts = [c["first"] for c in mine if c["first"]]; lasts = [c["last"] for c in mine if c["last"]]
    fmts = collections.Counter(c["format"] for c in mine)
    return {
        "google_status": "ok",
        "google_advertiser_page_url": f"https://adstransparency.google.com/advertiser/{adv_id}?region=US",
        "google_advertiser_name": adv_name,
        "google_ad_count": listing["ad_count"] if listing["ad_count"] is not None else len(mine),
        "google_creatives_checked": len(mine),
        "google_overlap_90d_pass": len(passing),
        "google_overlap_method": "rpc_first_last_shown",
        "google_formats": "|".join(f"{k}:{v}" for k, v in fmts.most_common()),
        "google_first_shown_min": min(firsts).isoformat() if firsts else "",
        "google_last_shown_max": max(lasts).isoformat() if lasts else "",
        "google_ads_first_shown_180d_plus": sum(1 for c in mine if c["first"] and (TODAY - c["first"]).days >= 180),
        "google_other_advertisers_on_domain": others,
        "google_creatives_json": json.dumps([{"id": c["id"], "first": str(c["first"]), "last": str(c["last"]), "fmt": c["format"], "days": c["days_shown"]} for c in mine[:60]]),
    }

def linkedin_by_advertiser(page, tool, row):
    try:
        if not goto(page, "https://www.linkedin.com/ad-library/home"): return False
        sleep(1, 2)
        if not focus_search_box(page, re.compile("^Company or advertiser", re.I), re.compile("keyword|payer|country|date", re.I)):
            print("    linkedin: advertiser box not found"); return False
        page.keyboard.type(tool, delay=70); time.sleep(3.5)
        dump(page, f"{row['niche_id']}_{tool}_linkedin_typeahead")
        locs = [page.get_by_role("option"), page.locator('[role="listbox"] [role="option"], [role="listbox"] li'),
                page.get_by_text(re.compile(r"^\s*" + re.escape(tool) + r"\s*$", re.I))]
        picked = False
        for loc in locs:
            try: n = min(loc.count(), 10)
            except Exception: continue
            for i in range(n):
                try: t = loc.nth(i).inner_text(timeout=800).strip().split("\n")[0]
                except Exception: continue
                if name_match(t, tool):
                    try: loc.nth(i).click(timeout=3000); picked = True; break
                    except Exception: continue
            if picked: break
        time.sleep(1)
        page.get_by_role("button", name=re.compile("^Search$", re.I)).first.click(timeout=5000)
        page.wait_for_load_state("networkidle", timeout=15000); sleep(1, 2)
        print(f"    linkedin advertiser search: suggestion {'picked' if picked else 'not shown, submitted free text'}; url={page.url[:100]}")
        return "companyIds" in page.url or "advertiser" in page.url.lower() or "No results found" in body_text(page) or page.locator('a[href*="/ad-library/detail/"]').count() > 0
    except Exception as e:
        print(f"    linkedin advertiser lookup failed: {e}"); return False

def linkedin_detail_links(page, cap):
    for _ in range(4):
        n = page.locator('a[href*="/ad-library/detail/"]').count()
        if n >= cap: break
        scroll(page, times=1)
    out = []
    for a in page.locator('a[href*="/ad-library/detail/"]').all()[:cap]:
        try:
            h = a.get_attribute("href")
            if h: out.append(urllib.parse.urljoin("https://www.linkedin.com/", h))
        except Exception: pass
    return list(dict.fromkeys(out))

def parse_linkedin_detail(text):
    m = re.search(r"^Advertiser\s+(.+?)\s*$", text, re.M)
    adv = m.group(1).strip() if m else ""
    return {"advertiser": adv, "ranges": parse_linkedin(text)["ranges"]}

def do_linkedin(page, row, tool, args):
    method = "advertiser_typeahead" if linkedin_by_advertiser(page, tool, row) else "keyword"
    if method == "keyword":
        if not goto(page, row["linkedin_lookup_url"]): return {"linkedin_status": "nav_error", "linkedin_method": method}
    sleep(1, 2)
    text = body_text(page)
    if "No results found" in text:
        return {"linkedin_status": "ok_no_ads", "linkedin_method": method, "linkedin_present": "no", "linkedin_ad_count": 0,
                "linkedin_currently_running": "", "linkedin_date_ranges": ""}
    links = linkedin_detail_links(page, args.linkedin_details * 3)
    details = []
    for h in links[: args.linkedin_details * 2]:
        if not goto(page, h): continue
        sleep(0.7, 1.4); d = parse_linkedin_detail(body_text(page)); d["url"] = h; details.append(d)
        if method == "keyword" and name_match(d["advertiser"], tool):
            # jump to this advertiser's full list via the Advertiser link on the detail page
            try:
                loc = page.locator('a[href*="companyIds"], a[href*="/ad-library/search"]')
                if loc.count():
                    loc.first.click(timeout=4000); page.wait_for_load_state("networkidle", timeout=15000); sleep(1, 2)
                    if page.locator('a[href*="/ad-library/detail/"]').count():
                        method = "advertiser_via_detail_link"
                        links = linkedin_detail_links(page, args.linkedin_details * 3)
                        details = []
                        for h2 in links[: args.linkedin_details]:
                            if goto(page, h2):
                                sleep(0.7, 1.4); d2 = parse_linkedin_detail(body_text(page)); d2["url"] = h2; details.append(d2)
                        break
            except Exception as e:
                print(f"    linkedin advertiser link failed: {e}")
    mine = [d for d in details if name_match(d["advertiser"], tool)]
    if method == "keyword" or (details and len(mine) < 0.8 * len(details)):
        count = len(mine); ranges = [r for d in mine for r in d["ranges"]]
        method = method + "_filtered_by_advertiser"
    else:
        count = len(links); ranges = [r for d in details for r in d["ranges"]]
    s = summarize_linkedin({"ad_count": count, "ranges": ranges})
    s["linkedin_present"] = "yes" if count else "no"
    s["linkedin_advertisers_seen"] = "|".join(sorted({d["advertiser"] for d in details if d["advertiser"]})[:8])
    s["linkedin_status"] = "ok"; s["linkedin_method"] = method
    if args.debug_all: dump(page, f"{row['niche_id']}_{tool}_linkedin")
    return s

SELFTEST_ROWS = [
    {"niche_id": "0", "tool": "ServiceTitan", "domain": "servicetitan.com"},
    {"niche_id": "0", "tool": "Jobber", "domain": "getjobber.com"},
]

def lookup_urls(tool, domain):
    q = urllib.parse.quote(tool)
    return {"meta_lookup_url": f"https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q={q}&search_type=keyword_unordered&media_type=all",
            "google_lookup_url": f"https://adstransparency.google.com/?region=US&domain={domain}",
            "linkedin_lookup_url": f"https://www.linkedin.com/ad-library/search?keyword={q}"}

def selftest(args):
    from playwright.sync_api import sync_playwright
    args.debug_all = True
    ok_all = True
    with sync_playwright() as p:
        launch_kw = {}
        if os.environ.get("PW_CHROMIUM_PATH"): launch_kw["executable_path"] = os.environ["PW_CHROMIUM_PATH"]
        ctx = p.chromium.launch_persistent_context(args.profile, headless=not args.headed, **launch_kw,
                viewport={"width": 1366, "height": 900}, locale="en-US")
        page = ctx.new_page(); page.set_default_timeout(8000); page.set_default_navigation_timeout(45000)
        for r in SELFTEST_ROWS:
            r = dict(r, **lookup_urls(r["tool"], r["domain"]))
            print(f"SELFTEST {r['tool']}")
            res = {}
            for plat, fn in (("meta", do_meta), ("google", do_google), ("linkedin", do_linkedin)):
                try: res.update(fn(page, r, r["tool"], args))
                except Exception as e:
                    import traceback; res[f"{plat}_status"] = f"error: {e}"[:200]
                    print(f"  {plat} EXCEPTION:"); traceback.print_exc()
                sleep(1, 2)
            print("  statuses:", {k: res.get(k) for k in ("meta_status","google_status","linkedin_status")})
            checks = [
                ("meta page resolved", str(res.get("meta_match_mode", "")).startswith("page")),
                ("meta ads >= 5", num_(res.get("meta_active_ads")) >= 5),
                ("meta ads >= 60 days >= 1", num_(res.get("meta_ads_60d")) >= 1),
                ("meta data from json", res.get("meta_data_source") == "json"),
                ("google creatives from rpc", res.get("google_overlap_method") == "rpc_first_last_shown"),
                ("google ads >= 10", num_(res.get("google_ad_count")) >= 10),
                ("google creatives passing 90d >= 3", num_(res.get("google_overlap_90d_pass")) >= 3),
                ("linkedin resolved (advertiser mode or filtered)", str(res.get("linkedin_method", "")).startswith("advertiser") or res.get("linkedin_status") in ("ok", "ok_no_ads")),
            ]
            for name, ok in checks:
                print(f"  {'PASS' if ok else 'FAIL'}  {name}")
                ok_all &= ok
            print("  raw:", {k: res.get(k) for k in ("meta_match_mode","meta_data_source","meta_active_ads","meta_ads_60d","meta_ads_120d","meta_oldest_start","google_ad_count","google_creatives_checked","google_overlap_90d_pass","google_first_shown_min","google_overlap_method","linkedin_method","linkedin_ad_count")})
        ctx.close()
    print("\nSELFTEST", "PASS - run the full scrape: python ad_audit_scraper.py" if ok_all else "FAIL - commit the debug/ folder (git add -f debug) and push")
    return 0 if ok_all else 1

def num_(v):
    try: return int(str(v).replace(",", ""))
    except Exception: return 0

EXTRA_COLS = ["scrape_status","scraped_at",
              "meta_status","meta_match_mode","meta_data_source","meta_page_id","meta_page_name","meta_results_url","meta_result_count","meta_matched_page_ads","meta_all_ads_seen","meta_advertisers_seen","meta_oldest_start",
              "google_status","google_overlap_method","google_advertiser_name","google_creatives_checked","google_first_shown_min","google_last_shown_max","google_ads_first_shown_180d_plus","google_other_advertisers_on_domain","google_creatives_json",
              "linkedin_status","linkedin_method","linkedin_advertisers_seen","linkedin_ad_count","linkedin_currently_running"]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sample", type=int, default=0, help="only scrape the first N eligible rows")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--all", action="store_true", help="include candidate (unverified) tool rows too")
    ap.add_argument("--niches", default="", help="comma-separated niche ids to include")
    ap.add_argument("--tools", default="", help="semicolon-separated tool names to include (exact, case-insensitive)")
    ap.add_argument("--tools-file", default="", help="file with one tool name per line (avoids shell quoting)")
    ap.add_argument("--headed", action="store_true", help="show the browser (log in to Meta/LinkedIn once if walled)")
    ap.add_argument("--profile", default=str(HERE / "pw-profile"), help="persistent browser profile dir")
    ap.add_argument("--scrolls", type=int, default=6)
    ap.add_argument("--google-pages", type=int, default=3, help="extra 40-creative pages to load per advertiser by scrolling")
    ap.add_argument("--meta-max-ads", type=int, default=150)
    ap.add_argument("--linkedin-details", type=int, default=8)
    ap.add_argument("--skip", default="", help="comma list of platforms to skip: meta,google,linkedin")
    ap.add_argument("--debug-all", action="store_true", help="save a screenshot + visible-text dump for every page")
    ap.add_argument("--force", action="store_true", help="re-scrape rows already marked ok")
    ap.add_argument("--meta-accept-first-suggestion", action="store_true", help="if no suggestion name-matches, take the first one (use with care)")
    ap.add_argument("--selftest", action="store_true", help="run two known heavy advertisers and print PASS/FAIL instead of scraping the CSV")
    ap.add_argument("--fast", action="store_true", help="short waits, 40 Google creatives, 60 Meta ads, 4 LinkedIn details")
    ap.add_argument("--shard", default="", help="i/N: process every N-th tool starting at i (0-based); use with --out")
    ap.add_argument("--out", default="", help="output CSV path (default ../ad_audit_filled.csv; shards should use ../ad_audit_filled.part<i>.csv)")
    args = ap.parse_args()
    global FAST, OUT_CSV
    if args.fast:
        FAST = True; args.google_pages = 0; args.meta_max_ads = 60; args.linkedin_details = 4; args.scrolls = min(args.scrolls, 3)
    shard_i, shard_n = 0, 1
    if args.shard:
        shard_i, shard_n = (int(x) for x in args.shard.split("/"))
        if not args.out: args.out = str(HERE.parent / f"ad_audit_filled.part{shard_i}.csv")
        if args.profile == str(HERE / "pw-profile"): args.profile = str(HERE / f"pw-profile-{shard_i}")
    if args.out: OUT_CSV = Path(args.out)
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        sys.exit("pip install playwright && python -m playwright install chromium")
    if args.selftest: sys.exit(selftest(args))

    rows = list(csv.DictReader(open(IN_CSV, newline="", encoding="utf-8")))
    cols = list(rows[0].keys()) + [c for c in EXTRA_COLS if c not in rows[0]]
    done = {}
    # carry forward earlier results: the merged file first (so a shard never wipes another shard's fields), then this output file
    for src in [HERE.parent / "ad_audit_filled.csv", OUT_CSV]:
        if src.exists():
            for r in csv.DictReader(open(src, newline="", encoding="utf-8")):
                if r.get("scrape_status") or (r["niche_id"], r["tool"]) not in done:
                    done[(r["niche_id"], r["tool"])] = r
    want = set(x.strip() for x in args.niches.split(",") if x.strip())
    want_tools = set(norm(x) for x in args.tools.split(";") if x.strip())
    if args.tools_file:
        want_tools |= set(norm(x) for x in open(args.tools_file, encoding="utf-8").read().splitlines() if x.strip())
    if (args.tools or args.tools_file) and not want_tools: sys.exit("tool filter given but empty")
    todo = []
    for r in rows:
        if not args.all and not r.get("verification_status", "").startswith("search"): continue
        if want and r["niche_id"] not in want: continue
        if want_tools and norm(r["tool"]) not in want_tools: continue
        if not args.force and done.get((r["niche_id"], r["tool"]), {}).get("scrape_status") == "ok": continue
        todo.append(r)
    seen = set(); dedup = []
    for r in todo:  # same tool across niches: scrape once, copy later
        k = norm(r["tool"]); 
        if k in seen: continue
        seen.add(k); dedup.append(r)
    dedup = dedup[shard_i::shard_n]
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
        page = ctx.new_page(); page.set_default_timeout(8000); page.set_default_navigation_timeout(45000)
        for i, r in enumerate(dedup, 1):
            tool = re.sub(r"\s*\(.*?\)\s*", " ", r["tool"]).strip()  # search by the bare name; suffixes like "(HVAC)" are ours
            print(f"[{i}/{len(dedup)}] {r['tool']} ({r['domain']})")
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
            results[norm(r["tool"])] = res
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
