# Phase 2 research plan: from qualified niches to specific, priced opportunities

Phase 1 answered "which boring niches already buy software and convert on paid ads". It did not answer "what exact job is worth paying an agent for, how much, and why now". Phase 2 answers that, with the same evidence rule as Phase 1: every number carries a URL or is marked `unverified`. Nothing is estimated.

## 0. The question Phase 2 has to answer

For a given niche, name one job where:

1. **The money already exists and is already identified.** A dollar amount is owed to the owner (a claim, a deficiency, a denied claim, a warranty reimbursement, a mandatory annual test) and only writing plus follow-up stands between it and the bank account.
2. **The counterparty is an institution with a written process.** Carrier, payer, fire marshal, water utility, manufacturer, DMV. Rules plus writing is the work a model does well and a part-time admin does badly at night.
3. **The price can be contingent.** A percentage of what is recovered, or a per-unit fee that is a small fraction of the unit's value, so the buyer needs no budget line.
4. **There is a paid human substitute today.** A service firm, a freelancer role, or a job title that does exactly this job. Its price is the ceiling; its ad spend is proof of demand.
5. **Nobody is blocked by law from doing it for the owner.** Licensing, HIPAA, FDCPA, public-adjuster statutes.

A thesis that fails any one of the five is dropped, not softened.

## 1. Theses under test

| # | Niche (Phase 1 rank) | Job | Institution | Money unit | Paid human substitute today |
|---|---|---|---|---|---|
| T1 | Residential roofing (1) | Write and chase insurance supplements | Property insurer / desk adjuster | Supplement dollars approved per claim | Supplement-writing services; "supplement specialist" role |
| T2 | Fire extinguisher, alarm and sprinkler inspection (14, 21) | Turn inspection deficiencies into priced, code-cited repair proposals and chase them | Authority Having Jurisdiction (fire marshal) via NFPA 25/72/10 | Repair revenue per deficiency converted | Inside estimator / "deficiency coordinator" role; ServiceTrade's own deficiency-quoting feature |
| T3 | Medical billing companies (32) | Work the denial queue: read 835 codes, pull chart, draft and file appeals | Payer (commercial, Medicare, Medicaid) | Dollars recovered per appeal | Denial-management outsourcers; "denial specialist" / "AR follow-up" role |
| T4 | Appliance and garage-door repair (6, 8) | File OEM and home-warranty claims correctly; pre-order the likely part before the visit | Manufacturer warranty portal (ServiceBench, ServicePower, OEM portals) | Claims paid vs rejected; second truck rolls avoided | "Warranty claims administrator" role; parts pre-diagnosis by phone |
| T5 | Irrigation contractors (3) | Track backflow assembly test due dates, book the test, file the report with the purveyor | Water purveyor cross-connection program | Test fee per assembly per year | Backflow tracking vendors serving purveyors (BSI Online, VEPO, Tokay); office coordinator |

Section 6 adds a generator for more theses so the list is not capped at five.

## 2. Evidence to collect per thesis (the dossier)

Each thesis gets one dossier file, `phase2/T<n>_<slug>.md`, with these sections filled in this order. Stop at the first hard fail.

### 2.1 Legal gate (first, because it can kill the thesis in an hour)

| Thesis | Question | Where to look |
|---|---|---|
| T1 | In which states does a contractor negotiating a claim on the policyholder's behalf constitute unlicensed public adjusting? Does writing a supplement for the contractor (not the policyholder) fall under it? | State public adjuster statutes; NAIC model act; Texas HB 2102 (2019), Florida 626.854, and the roofing trade press coverage of each |
| T2 | Any licence needed to quote fire-protection repairs? (Usually the contractor holds it; the writer does not.) | State fire marshal contractor licensing pages for TX, FL, CA, NY |
| T3 | HIPAA: agent as business associate of the billing company; BAA chain to the practice. Any state rule on who may file appeals? | HHS business-associate guidance; payer appeal-rights pages |
| T4 | OEM portal terms: can a third party file on the servicer's behalf? | ServiceBench / ServicePower servicer terms; Whirlpool, GE, Samsung servicer program pages |
| T5 | Tester certification is personal; can a non-tester file the report? | Three state cross-connection control program pages (e.g. Texas TCEQ, Florida DEP, Washington DOH) plus three large purveyors' filing instructions |

Output: `legal_gate: pass / pass-with-conditions / fail`, with URLs.

### 2.2 Money unit: how many dollars per event, how many events per buyer per year

Sources, in order of preference, all with URLs:

1. Trade association or regulator statistics (NRCA, NFPA, AHIP/MGMA/AMA denial studies, PSA/UASA, ABPA/AWWA).
2. Incumbent marketing claims with a number in them (ServiceTrade's deficiency-conversion claims, AccuLynx supplement case studies, Waystar/Experian denial statistics). Label as vendor-claimed.
3. Human-substitute pricing pages (supplement services' percentage fee; denial outsourcers' per-claim or percentage fee; parts pre-diagnosis services).
4. Job postings for the substitute role: title, count, salary band. Tool: ZipRecruiter search (available in this session) plus Indeed and LinkedIn via WebSearch. A role with hundreds of live postings at $45k+ is a labour line an owner will happily swap for a contingent fee.
5. Owner interviews (section 3) for the per-buyer count.

Required fields: `dollars_per_event`, `events_per_buyer_per_year`, `buyers_in_US` (from Phase 1 niches.csv), `substitute_price`, each with a URL or `unverified`.

### 2.3 Process specificity: can a model actually do the job from the inputs that exist?

For each thesis, obtain one real example of the input and one real example of the accepted output:

| Thesis | Input artefacts | Output artefact | Where to get samples |
|---|---|---|---|
| T1 | Adjuster's Xactimate estimate (PDF/ESX), measurement report (EagleView/RoofSnap), photos, local building code amendment | Supplement request in Xactimate line-item format with justification | Roofing forums, supplement-service sample pages, Xactimate documentation, IRC chapter 9 |
| T2 | Inspection report PDF (Inspect Point / ServiceTrade export), NFPA 25/72/10 deficiency codes | Repair proposal with code citation and price | Vendor sample reports; NFPA free-access standards; three inspection companies' public sample reports |
| T3 | 835 remittance (CARC/RARC codes), 837 claim, chart note, payer policy | Appeal letter to payer format, filed within the appeal window | X12 CARC/RARC lists (public), CMS appeal forms, payer appeal pages; sample redacted appeals from billing forums |
| T4 | Model number, symptom, tech notes, OEM claim form fields | Claim submission accepted first time; parts pre-order | ServiceBench/ServicePower documentation, OEM servicer manuals, appliance-tech forums |
| T5 | Customer list with assembly IDs, last test date, purveyor | Purveyor-specific test report submitted (form or portal) | Purveyor forms (public PDFs), state program pages |

Output: `inputs_machine_readable: yes / partly / no` and `output_format_documented: yes / no`. A "no" on both is a hard fail: the agent would be guessing.

### 2.4 Paid-substitute proof via ad libraries

Reuse the Phase 1 scraper on the substitute *service* firms, not just SaaS. For each thesis, list 5 to 10 firms that sell the human version of the job (supplement companies, denial-management outsourcers, backflow tracking vendors, warranty-claims processors). Run them through Meta, Google and LinkedIn with the same longevity test. A service firm that has run the same direct-response ad for 90+ days is buying customers profitably for this exact job.

Command (on the PC, once Meta unblocks): add the firms to `tools.csv` under a synthetic niche id (T1..T5), then `run_parallel.ps1 -N 2 -Extra '--niches T1,T2,T3,T4,T5'`.

### 2.5 Competitive scan: who is already building the agent version

Three searches per thesis, each with URLs:

- `"<job>" AI` and `"<job>" automation startup` (WebSearch), filter to companies founded 2023 or later.
- Incumbents' own AI feature pages (AccuLynx, JobNimbus, ServiceTrade, Inspect Point, Tebra, AdvancedMD, HindSite).
- Crunchbase and Tracxn category pages via search snippets.

Output: table of competitor, founded, funding, price, and whether they serve the fragmented buyer (owner-operators) or the enterprise. A funded competitor serving owner-operators with contingent pricing is a fail; one serving enterprise is a signal, not a fail.

### 2.6 Buyer interviews (section 3) and the pilot (section 4) complete the dossier.

## 3. Buyer interviews

Ten owners per thesis, recruited from where they already congregate. Not a survey: a 20-minute call with one killer question and four follow-ups.

**Recruitment channels (all free):**
- Facebook groups: "Roofing Insurance Restoration", "Fire Protection Contractors", "Medical Billing & Coding Business Owners", "Appliance Repair Technicians", "Irrigation Professionals". Post a plain request: "Paying $50 for 20 minutes with owners who do <job>."
- Reddit: r/Roofing, r/Firefighting (fire protection subthreads), r/medicalbilling, r/appliancerepair, r/Irrigation.
- Association member directories: NRCA, NAFED, AFAA, NFSA, AAPC local chapters, PSA/UASA, Irrigation Association.
- Clay (available in this session): pull owner names and emails for companies in the Phase 1 tools' customer segments by NAICS and headcount 1 to 20, 30 per thesis.

**The killer question, per thesis:**

| Thesis | Question | Disqualifying answer |
|---|---|---|
| T1 | "Last month, how many insurance jobs did you close where you did not supplement, and roughly what did you leave on each?" | "We supplement every job in-house and it takes an hour" (no pain) or "We never do insurance work" |
| T2 | "Of the deficiencies your techs wrote up last quarter, how many got a repair quote sent within a week?" | "All of them, the software does it" |
| T3 | "What percentage of denials from last month are still unworked, and why?" | "Under 5%, we have a dedicated denial team" |
| T4 | "How many warranty claims were rejected or short-paid last month, and how many jobs needed a second trip for a part?" | "We don't do warranty work" |
| T5 | "How many of your customers' backflow assemblies are overdue for test right now, and who tracks it?" | "The purveyor's system reminds us and we're at 100%" |

**Follow-ups (same for all):** who does the job today and what do they cost; what would you pay per recovered dollar / per unit; what would make you not trust a third party to do it; show me one real example (ask for the artefact from 2.3).

**Record per call:** date, channel, company size, answers, dollar figures quoted by the owner (labelled owner-reported), willingness to pilot (yes / no), artefact obtained (yes / no).

**Pass mark:** at least 6 of 10 owners report the pain with a dollar figure, and at least 3 agree to a pilot.

## 4. Wizard-of-Oz pilot (the only test that proves price)

For each thesis that passes sections 2 and 3, run the job manually for three owners for 30 days, with a model doing the writing and a person checking it, at the contingent price. No product, a shared inbox and a spreadsheet.

Measure, per pilot customer:
- Units processed (supplements written, deficiency quotes sent, appeals filed, claims filed, tests booked and reported).
- Dollars recovered or converted, with the institution's acceptance as proof (approved supplement, signed repair proposal, paid appeal, paid claim, filed report).
- Hours of human review per unit (the cost line).
- Invoice paid: yes / no. The only number that matters.

**Go criteria:** three paying pilots, gross margin above 70% at the contingent price after human review time, and the institution accepted the model-written artefact without rework in at least 80% of units.

## 5. Schedule, owner, tooling

| Week | Work | Who | Tools |
|---|---|---|---|
| 1 | Legal gate (2.1), money unit (2.2), process specificity (2.3) for T1 to T5; competitor scan (2.5) | Cloud session | WebSearch, ZipRecruiter search, Clay for company lists |
| 1 | Ad-library run on substitute firms (2.4) | User's PC | `scraper/` (Meta needs an unblocked IP) |
| 2 | Recruit and run interviews (3): 50 calls | User, with scripts and call notes template from the cloud session | Facebook, Reddit, Clay lists, Calendly |
| 3 | Dossiers finalised; go / no-go per thesis; pick two for pilot | Cloud session | `phase2/scorecard.md` |
| 4 to 7 | Wizard-of-Oz pilots for the two survivors | User plus model in the loop | Shared inbox, spreadsheet, the institution's own forms |
| 8 | Decision: build one | Both | |

Search budget: about 40 web searches per thesis for sections 2.1 to 2.5, 200 total, which fits one cloud session per thesis pair.

## 6. Generating more theses (so the list is not capped at five)

For each of the 20 qualified niches in `ideas_ranked.md`, fill a two-column table: institutions the owner must deal with (insurer, payer, permitting office, utility, OEM, DMV, lender, franchisor, marketplace) versus money events (claim, reimbursement, permit fee, mandatory test, warranty, listing, financing). Each cell that has a written process and a dollar amount is a candidate thesis. Score each against the five conditions in section 0 with one search each. Promote any that pass all five into section 1. Examples already visible in the Phase 1 data:

- Plumbing and HVAC (4, 13): utility and manufacturer rebate filing for high-efficiency equipment (institution: utility rebate program; money: rebate per unit; substitute: rebate-processing firms).
- Used car dealers (17): out-of-state title and registration packets (institution: DMV; money: deal funding delayed until title clears; substitute: title-service firms charging per deal).
- Small property managers (18): security deposit itemisation and small-claims filing within the statutory window (institution: court; money: deposit retained; substitute: paralegal services).
- Deck, epoxy and painting contractors (10, 12, 16): HOA architectural-review submissions (institution: HOA; money: job blocked until approved; substitute: none found yet, which is a question, not a fail).
- Trailer and boat dealers (23, 34): floor-plan lender audits and title packets.

## 7. Outputs

- `phase2/T<n>_<slug>.md` — one dossier per thesis, sections 2.1 to 2.6, 3 and 4, every number with a URL or `unverified`.
- `phase2/scorecard.md` — five conditions × theses, pass/fail with the evidence line, go / no-go.
- `phase2/interviews.csv` — one row per call.
- `phase2/pilot_<slug>.csv` — one row per unit processed in the pilot.
- `phase2/substitutes_tools.csv` — the service firms added to the ad-library run.

## 8. What Phase 1 already gives Phase 2

- Buyer counts per niche with URLs (`niches.csv`).
- Incumbent list, prices and ad behaviour per niche (`tools.csv`, `ad_audit_scored.csv`), which is the software the agent must read from and write to.
- Fragmentation and gatekeeper findings (franchise mandates bind franchisees only), which tell us the independent owner is free to buy.
- The scraper, which turns any list of company names into ad-longevity evidence.
