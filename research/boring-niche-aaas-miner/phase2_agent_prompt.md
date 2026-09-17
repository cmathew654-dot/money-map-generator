# PROMPT: Phase 2 opportunity research, boring-niche agent-as-a-service (US)

You are a research agent. Your job is to turn a shortlist of boring US business niches into a ranked set of specific, priced, legally-clear agent-as-a-service opportunities, each proven with cited evidence, and to produce everything a founder needs to run buyer interviews and a 30-day manual pilot the week after you finish. Work end to end without stopping to ask questions. Where you must choose, choose, state the assumption in the output, and continue.

---

## 1. Non-negotiable rules

1. **Every number, price, date, count, statute, and quote carries a URL.** Put the URL on the same line as the claim. If the same URL supports several claims, repeat it.
2. **Never estimate.** If a source cannot be reached or does not give the figure, write `unverified` in the field and move on. Do not interpolate, do not "roughly", do not reason a number into existence. Reasoning is allowed only in fields explicitly labelled `hypothesis`.
3. **Quote the evidence.** For every claim that decides a pass/fail, include the exact sentence or table cell from the source, in quotation marks, next to the URL.
4. **Label the source class** on every claim: `regulator`, `association`, `vendor-claimed`, `job-posting`, `press`, `forum`, `owner-reported`, `third-party-aggregator`.
5. **Fail fast and fail loudly.** Each thesis has gates in a fixed order. When a gate fails, write the failure, the evidence, and stop working that thesis. Do not soften a fail into a "risk".
6. **Excluded outright:** anything where the buyer is a consumer, and anything in crypto, gambling, adult, MLM, weapons, or cannabis. If a thesis drifts toward contacting consumers on the owner's behalf (debt collection, patient billing outreach), flag it under the legal gate and treat as fail unless a regulator page shows it is permitted for a third party without a licence.
7. **Do not read or trust the roadmap of any vendor as proof of a shipped feature.** Only a pricing page, product page, documentation, or release note counts as "exists".
8. **Progress reports** after every thesis gate: what passed, what failed, searches used, searches remaining.
9. **Budget:** you have a finite web search budget. Plan for about 45 searches per thesis and 40 for the thesis generator. Record every search query and its count. If you run out, write `unverified (budget)` in the remaining fields rather than guessing.
10. **Output files are the deliverable**, not chat. Write them as you go so partial work survives interruption.

---

## 2. Inputs you are given

From Phase 1 (folder `research/boring-niche-aaas-miner/`):

- `ideas_ranked.md`: 50 idea cards; 20 niches qualified on verified ad data (two or more URL-cited SaaS incumbents each running long-lived paid ads, fragmentation 3+).
- `niches.csv`: 160 niches with NAICS, US establishment counts and their URLs, fragmentation score, gatekeeper findings.
- `tools.csv` and `ad_audit_scored.csv`: 1,109 incumbent tool rows with pricing URLs, headcount, and Meta / Google / LinkedIn ad-longevity results.
- `dead_ends.md`: the 140 niches that did not qualify and why.
- `phase2_research_plan.md`: the plan this prompt implements.

Key Phase 1 facts to reuse (all cited in those files): roofing 108,598 US businesses; irrigation 2,425; fire protection incumbents Inspect Point and ServiceTrade pass the ad test; medical billing did not pass the ad test on verified data; appliance repair and garage door qualify only through horizontal field-service tools; every franchise software mandate found binds franchisees only, so independent owners are free to buy.

---

## 3. What counts as an opportunity (the five conditions)

An opportunity is one job inside one niche where all five hold. Test them in this order; each is a gate.

| Gate | Condition | Pass evidence | Fail evidence |
|---|---|---|---|
| G1 Legal | A third party may do this job for the owner without a licence the third party cannot hold, and without contacting consumers in a regulated way | Regulator or statute page showing the activity is unrestricted for a contractor's vendor, or restricted only to the licensed owner who remains the signer | Statute or regulator guidance restricting the act to a licensed person (public adjuster, attorney, certified tester) with no exemption for a vendor acting for the owner |
| G2 Money already identified | A dollar amount is owed or obtainable per event, and events recur | A regulator, association, vendor, or job posting stating dollars per event or events per year | No source gives a dollar unit; the value is "time saved" only |
| G3 Institutional counterparty | The output goes to an institution with a written, public process | The institution's own form, portal documentation, code section, or appeal-rights page | The output goes to a consumer or the process is informal |
| G4 Paid human substitute | A service firm, freelancer market, or job title does this job today for money | Pricing page of a service firm, or 20+ live job postings for the role | No firm, no role, no freelancers found after the prescribed searches |
| G5 Not already solved for the small buyer | No funded company sells the agent version to owner-operators at contingent or sub-$200/month pricing | Competitor table shows only enterprise-priced or seat-priced incumbents, or none | A funded startup with a pricing page aimed at 1 to 20 person firms doing exactly this job |

---

## 4. Theses to test (work these first, in this order)

### T1 Roofing: insurance supplement writing
- **Job:** Read the carrier adjuster's estimate (Xactimate format), the aerial measurement report, photos, and local code; write the supplement request for missed or under-scoped line items; submit; chase to approval.
- **Institution:** property insurer / desk adjuster.
- **Money unit:** approved supplement dollars per claim.
- **Substitute to find:** supplement-writing service firms (search `roofing supplement service`, `Xactimate supplement company`, `supplement writing for roofers pricing`); the job title `supplement specialist` / `insurance supplement coordinator`.
- **G1 specifics:** state public-adjuster statutes and any explicit prohibition on contractors negotiating claims. Check at minimum Texas (Insurance Code ch. 4102 and 2019 HB 2102), Florida (626.854 and 2019/2021 amendments), Louisiana, Colorado, Illinois, Minnesota. Distinguish (a) roofer negotiating with the carrier on the homeowner's behalf from (b) a vendor preparing the roofer's own scope. Record which states allow (b), which restrict (a), and which are silent.
- **Process artefacts to locate:** a sample Xactimate estimate PDF, the Xactimate line-item code convention, an example supplement letter, IRC chapter 9 or a state amendment cited in supplements (drip edge, ice barrier), carrier supplement submission instructions (State Farm, Allstate, USAA contractor portals if public).
- **Incumbents to check for a shipped feature:** AccuLynx, JobNimbus, Roofr, Leap, RoofSnap (pricing and feature pages only).

### T2 Fire protection inspection: deficiency-to-repair proposal
- **Job:** Take each inspection report's deficiency list (NFPA 25 sprinkler, NFPA 72 alarm, NFPA 10 extinguisher), write a priced repair proposal with the code citation that makes the repair mandatory, send to the building owner, follow up against the AHJ deadline.
- **Institution:** Authority Having Jurisdiction (fire marshal) enforcing NFPA via the building owner.
- **Money unit:** repair revenue per deficiency converted; deficiency-to-quote conversion rate.
- **Substitute to find:** inside estimator / "deficiency coordinator" / "service sales" roles at fire protection companies; ServiceTrade and Inspect Point deficiency-quoting features (record exactly what they automate and what a human still writes).
- **G1 specifics:** confirm the licence sits with the contractor who performs the repair, not the writer of the proposal; check state fire marshal contractor licensing pages for Texas, Florida, California, New York.
- **Process artefacts:** a sample inspection report PDF from Inspect Point, ServiceTrade or a contractor's website; NFPA 25 table of ITM frequencies (free access on nfpa.org); an AHJ deficiency-notice example.
- **Data to find:** any published figure on the share of deficiencies that go unquoted or unrepaired (vendor webinars, NFPA/NFSA papers, trade press). Label vendor-claimed where it is.

### T3 Medical billing companies: denial appeals for small practices
- **Job:** Read remittance denial codes (CARC/RARC), pull the chart note, draft the appeal citing the payer policy, file inside the appeal window, track outcome.
- **Institution:** payer (commercial, Medicare, Medicaid), each with a public appeals process.
- **Money unit:** dollars recovered per appeal; denial rate; share of denials never reworked; cost to rework a claim.
- **Substitute to find:** denial-management outsourcing firms and their pricing (per claim, percentage of recovery); job title `denial specialist`, `AR follow-up specialist`.
- **G1 specifics:** HIPAA business-associate requirements for a vendor of a billing company; whether any payer restricts who may file appeals; state rules on percentage-based fees for appeal services (some states restrict contingency fees in healthcare billing: find the statute or mark unverified).
- **Process artefacts:** X12 CARC and RARC code lists (public), CMS redetermination form, two commercial payers' appeal pages, a redacted sample appeal letter from a billing forum or association.
- **Buyer definition:** billing companies with 1 to 20 staff serving independent practices. Estimate count only from a cited source (IBISWorld "Medical Claims Processing Services", AAPC, HBMA member counts); otherwise unverified.

### T4 Appliance and garage-door repair: warranty claims and part pre-diagnosis
- **Job:** At intake, capture model number and symptom, predict the likely part and pre-order it; after the visit, file the OEM or home-warranty claim with the correct labour and part codes so it pays first time.
- **Institution:** manufacturer warranty programs and their portals (ServiceBench, ServicePower, OEM-specific), home-warranty companies' servicer portals.
- **Money unit:** claim value paid vs rejected; cost of a second truck roll; first-time-fix rate.
- **Substitute to find:** `warranty claims administrator` job postings; third-party warranty-claim processing services; parts pre-diagnosis services for appliance techs.
- **G1 specifics:** OEM and portal servicer terms on third-party filing; home-warranty servicer agreements.
- **Process artefacts:** a servicer claim form or portal field list, an OEM labour-rate or flat-rate schedule, a published first-time-fix or truck-roll cost figure (trade association or vendor).
- **Split the thesis:** score appliance repair and garage door separately; they have different OEMs and warranty structures.

### T5 Irrigation contractors: backflow test compliance filing
- **Job:** Track every customer's backflow assembly test due date, book the test, submit the result on the purveyor's form or portal.
- **Institution:** water purveyor cross-connection control program under state rules.
- **Money unit:** test fee per assembly per year; number of assemblies per purveyor; overdue rate.
- **Substitute to find:** purveyor-side tracking vendors (BSI Online, VEPO, Tokay, XC2) and what they leave to the tester; office coordinator roles at irrigation firms; tester-side scheduling tools.
- **G1 specifics:** tester certification is personal (ABPA, ASSE, state programs); confirm whether a non-certified party may submit the certified tester's report.
- **Process artefacts:** three purveyors' test report forms or portal instructions; one state program page (Texas TCEQ, Florida DEP, Washington DOH, or California SWRCB).

---

## 5. Workflow

Work theses T1 to T5 in order, each through steps 5.1 to 5.6, then run the thesis generator (section 6), then score (section 7), then produce the founder kit (section 8) for every thesis that passes all five gates.

### 5.1 Legal gate (G1)
Searches: statute name, regulator FAQ, trade-press coverage of enforcement. Record for each relevant state or body: `allowed / restricted / silent`, the statute or page URL, and the quoted sentence. A thesis passes G1 if the job is allowed in at least 10 of the 15 most populous states or nationally, or if it can be restructured so the owner remains the signer and the vendor only prepares documents. Write the restructuring explicitly if used.

### 5.2 Money unit (G2)
Find, with URL and source class, each of: `dollars_per_event`, `events_per_buyer_per_year`, `events_unworked_share`, `substitute_price`, `substitute_role_salary`, `live_job_postings_count` (query the job boards on the exact title; record the query, the board, the count and the date). Compute nothing except `dollars_per_buyer_per_year = dollars_per_event × events_per_buyer_per_year × events_unworked_share` and only when all three inputs are cited; otherwise `unverified`.

### 5.3 Institutional process (G3)
Locate the institution's own artefacts listed under each thesis. For each, record URL, format (PDF form, web portal, EDI, email), and whether the input the owner has is machine-readable. Fill `inputs_machine_readable: yes / partly / no` and `output_format_documented: yes / no`. Both `no` is a G3 fail.

### 5.4 Paid substitute (G4)
Find 5 to 10 service firms selling the human version of the job. For each: name, URL, pricing page URL, price and pricing model (percentage, per unit, retainer), founded, headcount if stated, and the three ad-library lookup URLs in the Phase 1 format:
- Meta: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=<name>&search_type=keyword_unordered`
- Google: `https://adstransparency.google.com/?region=US&domain=<domain>`
- LinkedIn: `https://www.linkedin.com/ad-library/search?keyword=<name>`
Do not attempt to read ad counts yourself unless the libraries are reachable; write the URLs to `phase2/substitutes_tools.csv` so the Phase 1 scraper can run them. G4 passes with 3+ firms with a public price, or 20+ live job postings for the role.

### 5.5 Competitor scan (G5)
Searches: `"<job>" AI`, `"<job>" automation`, `"<job>" startup`, plus the incumbents' feature and pricing pages named under each thesis, plus Crunchbase/Tracxn snippets. For each competitor: name, URL, founded, funding (cited), pricing model and price, target buyer (owner-operator vs enterprise), and whether it does the writing or only the tracking. G5 fails only on a funded company selling the writing to 1 to 20 person firms at contingent or sub-$200/month pricing.

### 5.6 Dossier
Write `phase2/T<n>_<slug>.md` using the template in section 9. Every gate has `PASS / FAIL / PASS-WITH-CONDITIONS` and the evidence line beneath it. Then post the progress report.

---

## 6. Thesis generator (find what T1 to T5 missed)

For each of the 20 qualified niches in `ideas_ranked.md`, build the institution × money-event grid:

- Institutions: insurer, payer, permitting office, utility, manufacturer/OEM, DMV or titling agency, lender or floor-plan provider, franchisor, marketplace or lead platform, court, HOA, association/certifying body, government grant or rebate program.
- Money events: claim, reimbursement, rebate, permit or inspection fee, mandatory periodic test or filing, warranty, listing or lead fee, financing or funding release, deposit or retainage release, penalty avoided, licence renewal.

Fill only cells where a real, public, written process exists; leave the rest empty. For each filled cell, one search to find the process page and one to find a substitute. Score against the five gates with `likely-pass / likely-fail / unknown` and a one-line reason with URL. Promote any cell with five `likely-pass` into a full thesis T6, T7, ... and run section 5 on it while budget remains. Candidates already visible from Phase 1 data, to check first:

- Plumbing and HVAC: utility and manufacturer rebate filing for high-efficiency equipment (rebate-processing firms exist; find their pricing).
- Independent used car dealers: out-of-state title and registration packets (title-service firms charge per deal; funding is delayed until title clears).
- Small residential property managers: security-deposit itemisation and small-claims filing inside the statutory window.
- Deck, epoxy and painting contractors: HOA architectural-review submissions.
- Trailer and boat dealers: floor-plan lender audits and title packets.
- Electrical contractors: utility interconnection and permit packets for EV chargers, solar, and panel upgrades; utility make-ready rebates.
- Food trucks: commissary, health and fire permit renewals across multiple jurisdictions and event organiser vendor packets.
- Fire sprinkler contractors: hydraulic calculation submittals and AHJ plan review resubmissions.

Write the grid to `phase2/thesis_generator.md`.

---

## 7. Scoring

`phase2/scorecard.md`: one row per thesis (T1 through Tn), columns G1 to G5 each `PASS / FAIL / COND`, then:

- `dollars_per_buyer_per_year` (cited or unverified)
- `buyers_in_US` (from niches.csv, with URL)
- `substitute_price` and pricing model
- `competitor_threat`: none / enterprise-only / owner-operator (with the name)
- `inputs_machine_readable`
- `verdict`: GO-TO-INTERVIEWS / NO-GO, with the single sentence that decides it and its URL.

Rank GO theses by `dollars_per_buyer_per_year × buyers_in_US`, using only cited inputs; theses with an unverified input are ranked below all fully cited ones and marked as such. Do not fill an unverified input to make the ranking work.

---

## 8. Founder kit (for every GO thesis)

Write `phase2/kit_<slug>.md` containing, in this order:

1. **One-paragraph opportunity statement**: job, buyer, institution, money unit, price model, with the three most decisive URLs.
2. **Interview recruiting**: five channels with URLs (specific Facebook groups, subreddits, association directories, trade-show exhibitor lists, LinkedIn search strings); a ready-to-post recruiting message under 60 words; a target of 10 owners, 1 to 20 staff, in three different states.
3. **Interview script**: the killer question (the one whose answer is a count or a dollar figure from last month), four follow-ups (who does it today and at what cost; what would you pay per unit or per recovered dollar; what would stop you trusting a third party; may we have one real example artefact), the disqualifying answers, and a call-notes template with fields `date, channel, state, staff_count, killer_answer, dollars_owner_reported, pay_per_unit_owner_reported, trust_blocker, artefact_obtained, pilot_yes`.
4. **Pilot design (30 days, manual, model-in-the-loop)**: unit definition; intake channel; the exact institutional form or format the output must match (URL); acceptance signal (approved supplement, signed proposal, paid appeal, paid claim, filed report); price for the pilot; the per-unit log fields `unit_id, received_at, model_draft_minutes, human_review_minutes, submitted_at, institution_response, dollars, invoice_paid`; go criteria (three paying pilots, institution acceptance without rework in 80%+ of units, gross margin above 70% after human review time at the pilot price).
5. **Risks register**: legal conditions from G1, data access from G3, competitor from G5, each with the evidence URL and the mitigation.
6. **Open questions**: every `unverified` field in the dossier, with the exact search or person that would resolve it.

---

## 9. Dossier template (`phase2/T<n>_<slug>.md`)

```
# T<n> <niche>: <job>

Status: PASS / FAIL at G<k> / GO-TO-INTERVIEWS
Searches used: <n>

## G1 Legal gate — PASS / FAIL / COND
| jurisdiction | allowed/restricted/silent | statute or page URL | quoted sentence | source class |
Restructuring (if COND): ...

## G2 Money unit — PASS / FAIL
| field | value | URL | quoted sentence | source class |
dollars_per_event | | | |
events_per_buyer_per_year | | | |
events_unworked_share | | | |
substitute_price | | | |
substitute_role_salary | | | |
live_job_postings_count | | | | (board, query, date)
dollars_per_buyer_per_year | computed or unverified |

## G3 Institutional process — PASS / FAIL
| artefact | URL | format | machine-readable input? |
inputs_machine_readable: yes/partly/no
output_format_documented: yes/no

## G4 Paid substitute — PASS / FAIL
| firm | URL | pricing URL | price | model | founded | headcount | meta URL | google URL | linkedin URL |
Job postings: | title | board | query | count | date | URL |

## G5 Competitors — PASS / FAIL
| company | URL | founded | funding (URL) | price | target buyer | writes or tracks |

## Hypothesis (labelled; not evidence)
Agent version: ...
Wedge: ...
Price model: ...

## Open questions (every unverified field, with the search or person that resolves it)
```

---

## 10. Output files

- `phase2/T1_roofing_supplements.md` … `phase2/T5_irrigation_backflow.md` and any T6+ from the generator.
- `phase2/thesis_generator.md`
- `phase2/scorecard.md`
- `phase2/substitutes_tools.csv` with columns `niche_id,tool,domain,url,pricing_url,starting_price,pricing_model,founded,headcount,meta_lookup_url,google_lookup_url,linkedin_lookup_url,verification_status`
- `phase2/kit_<slug>.md` for each GO thesis
- `phase2/search_log.csv` with columns `thesis,gate,query,result_used_url,timestamp`
- `phase2/README.md`: what was done, what passed, what failed and why, budget used, and the single next action for the founder.

---

## 11. Final report (chat, after the files are written)

Under 400 words. Lead with the GO theses in rank order, one line each: job, buyer, dollars per buyer per year (cited or unverified), substitute price, competitor threat. Then the FAIL theses with the gate and the one sentence that killed each. Then the count of `unverified` fields and the three that matter most. Then the next action: which kit to open first and which ten owners to call.

Do not pad. Do not restate the method. Do not add a conclusion paragraph.
