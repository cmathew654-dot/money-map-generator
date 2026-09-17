# dead_ends.md — niches not carded, and which filter (or which blocker) stopped them

Legend for `killed_by`:
- **Filter 2 (thin incumbents):** searched, but fewer than 3 search-verified SaaS tools surfaced. Not a definitive kill: re-run Step 2 with 8–12 more searches before writing the niche off.
- **Filter 3 (ad longevity):** could not be run for any niche (ad libraries blocked by egress policy). No niche was killed by Filter 3 on evidence; none passed it either.
- **Filter 4 (fragmentation):** searched and scored <3/5 on cited evidence, or a gatekeeper surfaced.
- **Not researched:** the batch had no WebSearch budget (session cap of 200 calls shared by 16 agents). Zero evidence either way. Rerun plan: ~10–15 searches per niche following the batch prompt in README.md.
- **Carded anyway:** 8 unsearched niches were carded as judgment picks in ideas_ranked.md (ranks 43–50) and are not listed here.

Fragmentation scores below are conservative: batches 1–6 could not run gatekeeper or concentration searches, so the 'no gatekeeper' point was withheld everywhere.
Update 2026-09-17: niches 57, 58, 66, 70, 91, 97, 137 and 147 were researched in a follow-up batch (61 tools, all URL-cited) and removed from this list; 58 (fire extinguisher & alarm inspection) now qualifies.

Update 2026-09-17 (later): all 102 remaining niches were researched by seven cloud sessions (batches_followup/slice0-6, 773 URL-cited tool rows). Rows below are only niches that were searched and still fail a filter; nothing remains unsearched.


| id | niche | NAICS | research status | verified tools | frag score | killed_by | note / what to run next |
|---|---|---|---|---|---|---|---|

## Niches excluded by rule before research

None of the 160 seeded niches were crypto, gambling, adult, MLM or consumer-buyer, so no rule-based exclusions applied. Candidates deliberately left out of the seed list for that reason: vape/smoke shops (regulatory churn), check cashing and payday lending (consumer-financial), escape rooms and family entertainment centers (consumer-facing, low paperwork), solar installers (VC-hyped, fails boring test (a)).

## Evidence-based cautions surfaced during research (not kills, but flags)

- Security/alarm installers (13): SecurityTrax is owned by Alarm.com, a possible channel gatekeeper (batch 2 notes).
- Small residential electrical (22): franchise systems (Mr. Electric, Mister Sparky) mandate ServiceTitan via their FDDs; independents are unconstrained (batch 3, francloud.com citation in fragmentation.csv).
- Fence contractors (4): distributor Merchants Metals co-markets FenceCloud, a partial gatekeeper signal (batch 1).
- Water/fire restoration (52): Xactimate and insurance carriers likely dictate the estimating tool (batch 6).
- Mosquito control (46), junk removal (47), dumpster rental (48): franchise systems (Mosquito Joe, 1-800-GOT-JUNK, College Hunks, Bin There Dump That) may dictate software for franchisees; independents unaffected (batch 5).
- Glass & glazing (17): the siccode establishment count (1,317) looks implausibly low and is flagged in niches.csv.
- Garage door (5): IBISWorld's 299-establishment figure uses a narrow definition and is not a reliable count of the repair long tail.
- Window cleaning (36): IBISWorld shows the business count shrinking (-4.9% CAGR), which cuts against a growth thesis even though fragmentation scored 4/5.
