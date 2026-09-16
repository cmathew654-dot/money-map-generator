# Step 3 scraper — run this on your laptop

The remote session cannot reach the ad libraries, so this folder splits the loop: you run the
browser here, commit the filled CSV, and the analysis side finishes Steps 3–5 from it.

## Setup (once)

```bash
cd research/boring-niche-aaas-miner/scraper
python3 -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m playwright install chromium
```

## Setup on Windows (PowerShell)

PowerShell has no `&&` and no `source`; run one line at a time. Clone first if you don't have the repo yet.

```powershell
cd C:\Users\Cyril\Projects
git clone https://github.com/cmathew654-dot/money-map-generator.git
cd money-map-generator
git checkout claude/boring-niche-aaas-miner-4ptuvl
cd research\boring-niche-aaas-miner\scraper
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m playwright install chromium
python ad_audit_scraper.py --sample 3 --headed
```

If `Activate.ps1` is refused ("running scripts is disabled"), run once:
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` and retry, or skip activation and prefix commands with `.\.venv\Scripts\python.exe` instead of `python`.

## Run

1. **Smoke test on 3 tools with a visible browser.** If Meta or LinkedIn shows a login wall, log in once in that window; the profile is saved in `pw-profile/` and reused.
   ```bash
   python ad_audit_scraper.py --sample 3 --headed
   ```
   Check the printed counts and look in `debug/`. If any platform reports `no_ads_parsed`, commit the `debug/*.png` and `debug/*.txt` files and the selectors get fixed from those.
2. **Full run** (214 search-verified tools, deduplicated across niches, roughly 1.5–3 hours with the built-in delays). It resumes automatically if interrupted.
   ```bash
   python ad_audit_scraper.py
   ```
   Useful flags: `--niches 32,31,33` to do a few niches first; `--skip linkedin` if LinkedIn keeps walling; `--all` to include the unverified candidate tools; `--google-creatives 40` to check more Google creatives per advertiser.
3. **Score and commit.**
   ```bash
   python score_ad_audit.py
   git add ../ad_audit_filled.csv ../ad_audit_scored.csv ../niche_pass.csv
   git commit -m "Step 3 ad audit results" && git push
   ```

## What it records per tool

| Column | Source | Meaning |
|---|---|---|
| meta_active_ads, meta_ads_60d, meta_ads_120d | Meta Ad Library (active, US) | ads whose page name matches the tool; counts with "Started running on" ≥60 / ≥120 days ago |
| meta_platforms, meta_cta, meta_oldest_start | same | platforms seen, CTA button counts, oldest start date |
| meta_match_mode, meta_advertisers_seen | same | `page` = searched by advertiser Page (all results are the vendor's); `keyword_exact_phrase` = fallback, only cards whose advertiser name matches the tool are counted. `meta_advertisers_seen` lists who actually ran the ads on the page |
| google_ad_count, google_formats | Google Ads Transparency Center, domain search → advertiser page | ad count on the advertiser page |
| google_overlap_90d_pass, google_overlap_method | advertiser page loaded with two date windows (180–90 days ago, and last 7 days) | creative IDs present in both windows, i.e. the brief's overlap test. `filter_ignored_unverified` means the date parameters had no effect and the value is left blank |
| linkedin_present, linkedin_date_ranges, linkedin_currently_running | LinkedIn Ad Library | presence and run dates |
| *_status, scrape_status | scraper | `ok`, `no_ads_parsed`, `login_wall`, `nav_error`; anything not `ok` gets a debug dump |

Scoring in `score_ad_audit.py` follows the brief exactly: Meta +3, Google +3, LinkedIn +1, headcount/bootstrapped +2 (already in the CSV), direct-response CTA +1; tool passes at ≥5; niche passes with ≥2 passing tools.

## Notes

- Extraction is regex over visible page text, so a layout tweak usually shows up as a `no_ads_parsed` status rather than a wrong number. Wrong numbers are the thing to watch for: spot-check three tools by hand against the printed counts on the first run.
- Delays are randomized (2.5–6 s between platforms). Keep them; this is a few hundred page views, not a crawl.
- The Meta keyword search returns ads that mention the name as well as ads by the page. The scraper prefers ads whose card text contains the tool name (`meta_matched_page_ads`) and falls back to all results (`meta_all_ads_seen`) when none match, so check both columns when a number looks high.
