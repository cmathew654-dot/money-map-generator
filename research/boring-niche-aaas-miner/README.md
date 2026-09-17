# Boring-Niche Ad-Validated Idea Miner — run of 2026-09-15 (US)

## Outcome in one paragraph

**Update:** Step 3 was completed afterwards by running `scraper/` on a local machine (all 134 search-verified tools audited on Meta, Google and LinkedIn from the platforms' own data feeds). `ideas_ranked.md` now ranks by real ad scores: 13 niches qualify on the method's definition, 2 more provisionally. Results live in `ad_audit_filled.csv`, `ad_audit_scored.csv`, `niche_pass.csv`; `scraper/generate_ranked.py` rebuilds the ranking from them.

Original run (2026-09-15): the four-filter method was run as far as the remote environment allowed. **Step 3 (ad longevity), the core filter, could not be executed there**, so at that point 0 of the 50 carded ideas were qualified. What is delivered instead is a fully structured, URL-cited pre-audit pipeline: 160 niche candidates, 550 tool rows (214 search-verified with cited URLs, 336 flagged as unverified candidates), prebuilt Meta / Google / LinkedIn lookup URLs for every tool, fragmentation scores where evidence exists, and 50 idea cards ranked by a provisional evidence score. No ad count, date, price, headcount or establishment figure was estimated; every number carries a URL or reads `unverified`.

## What blocked the method

| Blocker | Effect | Evidence |
|---|---|---|
| Organization egress policy: every external host except the WebSearch API returned proxy 403 | Meta Ad Library, Google Ads Transparency Center, LinkedIn Ad Library, Census API/data.census.gov, Capterra, G2, GetApp, Crunchbase, trustmrr.com and all vendor pricing pages were unreachable | `curl` and WebFetch probes at session start; proxy status endpoint logged `connect_rejected (organization policy)` for each host |
| Session WebSearch cap: 200 calls total, shared by the 16 batch agents | Batches 1–6 (niches 1–60) got 7–52 searches each; batches 7–16 (niches 61–160) got 0 | Each agent's report; the cap message names `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` |

## Files

| File | Rows | What it is |
|---|---|---|
| `niches.csv` | 160 | Step 1 output plus per-niche aggregates: NAICS, why boring, boring score (0–3), US establishments with source URL where found, tool counts, fragmentation score, provisional evidence score, research status |
| `tools.csv` | 550 | Step 2 output. `verification_status` = `search-verified (URL-cited)` or `candidate (prior knowledge; not search-verified)`. Treat candidate rows as a worklist, never as findings |
| `ad_audit.csv` | 550 | Step 3 scaffold. Lookup URLs prebuilt per tool; all Meta/Google/LinkedIn counts `unverified (host blocked)`; `headcount_bonus` (0/2) is the only scored signal; `verified_score` = headcount bonus only |
| `fragmentation.csv` | 160 | Step 4 output. Scores 0–5 where searched; `unverified` where not. Gatekeeper/concentration checks were unrun everywhere, so scores are capped at 4 in practice |
| `ideas_ranked.md` | 50 cards | Step 5. Ranked by method score (ad score + fragmentation) now that Step 3 has run; formula in the file header. Each card: incumbent jobs, agent version, wedge, price ceiling from cited prices, evidence URLs, confidence, and an audit checklist of exact ad-library URLs |
| `ad_audit_filled.csv`, `ad_audit_scored.csv`, `niche_pass.csv` | 550 / 550 / 160 | Step 3 results from the local scraper run: raw platform data, per-tool score breakdown, per-niche pass/fail |
| `aaas_angles.json`, `batch_notes.json` | | Inputs for `scraper/generate_ranked.py` (agent-version/wedge text per niche; per-niche research notes from the batch agents) |
| `dead_ends.md` | 110 | Every non-carded niche with the filter or blocker that stopped it and what to run next |

## How to finish the run (estimated effort)

1. **Step 3, ad audit** — for the 214 search-verified tools, open the three lookup URLs in `ad_audit.csv` (about 640 page views). Fill `meta_active_ads`, `meta_ads_60d`, `meta_ads_120d`, `google_ad_count`, `google_overlap_90d_pass`, `linkedin_present`, `direct_response_cta`; recompute the score; apply the "≥2 tools ≥5 per niche" gate. Start with ranks 1–16 in `ideas_ranked.md` (they have ≥3 verified tools and fragmentation ≥3).
2. **Step 2/4 rerun for niches 61–160** — re-dispatch batches 7–16 with the batch prompt below in a session where `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` is raised to roughly 1,600 (100 per batch) or in one session per batch. The candidate tool names in `tools.csv` are the seed worklist.
3. **Gatekeeper and concentration checks for niches 1–60** — about 3 searches per niche; this can add the +1 "no gatekeeper" point and lift several niches to 4–5/5.
4. **Census CBP <20-employee share** — unverified for all 160; needs `api.census.gov` access (CBP 2022, `EMPSZES` by NAICS).

## Batch prompt used (for reruns)

Each batch agent received 10 niches (id | niche | NAICS) and these instructions: (A) establishment count from census.gov / naicscodes.org / ibisworld.com / siccode.com snippets with URL; (B) 3–8 SaaS tools via `"<niche>" software`, `<niche> scheduling software`, `software for <niche>`, `best <niche> software 2026`, `<niche> CRM`, vertical tools preferred, horizontals only with a dedicated niche landing page; (C) per tool: pricing URL and starting price, founded, headcount, funding, review count, trustmrr listing, plus one `"<tool>" adstransparency.google.com` search; (D) fragmentation: check signer, public self-serve pricing, franchisor/association gatekeepers, top-4 share; score 0–5. Hard rule: no number without the URL of the search result it came from; otherwise `unverified`.

## Scoring notes

- Provisional evidence score = fragmentation (0–5) + max headcount bonus (0/2) + 1 if ≥3 search-verified tools + 1 if ≥1 public price with URL. Maximum 9. It is a triage order for the audit, not the method's score.
- Boring test scores are the collator's judgment on the three criteria in the brief; every seeded niche scored ≥2.
- Prices marked "third-party" in `tools.csv` notes came from review aggregators or roundups, not vendor pricing pages; treat them as indicative until the vendor page is read.
