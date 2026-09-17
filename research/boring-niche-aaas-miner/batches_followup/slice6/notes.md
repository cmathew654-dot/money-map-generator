# Slice 6 follow-up notes — Step 2 tools, establishment counts, fragmentation

Run date: 2026-09-17. Research tool: WebSearch only (WebFetch/curl blocked by egress policy). 125 of the 200-call cap used. Every number in the CSVs carries the URL of the search result it came from; anything not seen in a result reads `unverified`. All ad-library counts are `unverified (host blocked)`; `ad_audit.csv` carries only the prebuilt lookup URLs and the headcount bonus.

Search pattern per niche: 1 establishment-count query, 2–4 tool-discovery queries, 2–4 pricing/headcount/funding queries, 1–2 concentration/gatekeeper queries. A final batch of 14 queries filled pricing and headcount gaps for the most promising tools.

## 59 — Environmental testing labs (asbestos, lead, water) · NAICS 541380 · 9 searches
- **Incumbent jobs:** sample login and chain of custody, holding-time tracking, PLM/PCM/TEM asbestos worksheets, NVLAP/ELAP-compliant report generation and e-signature, EDD exports (CloudLIMS, QBench, BlazeLIMS, Confience, BTSOFT).
- **Wedge:** an agent that ingests chain-of-custody forms and instrument output, drafts the accredited report, and chases clients on holding-time deadlines. Small asbestos/lead labs still run these steps manually (BTSOFT and Confience sell packages for exactly this).
- **Weakest evidence:** establishment count is whole-NAICS (all testing labs, 4,130 active companies per siccode), no environmental-only count. CloudLIMS and BlazeLIMS prices come from third-party pricing guides that cite the vendor pages. Confience headcount not found.
- **Fragmentation 5/5:** three public prices, low concentration (IBISWorld), no software gatekeeper.

## 67 — Bail bond agencies · NAICS 812990 · 9 searches
- **Incumbent jobs:** bond intake and e-sign packets, power-of-attorney inventory, defendant check-ins (GPS/SMS), court-date reminders, payment plans, forfeiture monitoring, surety reporting (Captira, BailBooks, eBail, Simply Bail, BailVision).
- **Wedge:** defendant follow-up agent (court reminders, check-in escalation, missed-payment outreach) sold per defendant; BailBooks already markets "AI phone agents", confirming demand.
- **Weakest evidence:** no headcount for any vendor; Captira/BailBooks founding dates not in results. Bail-reform regulation is shrinking the niche in some states.
- **Fragmentation 5/5:** IBISWorld 20,886 businesses, no firm >5%; four public prices ($55–99/mo).

## 75 — Real estate appraisers · NAICS 531320 · 9 searches
- **Incumbent jobs:** order tracking from AMCs/lenders, scheduling, form filling (URAR/UAD 3.6), comp import from MLS, invoicing (Appraisal Inbox, Anow, TOTAL/a la mode, ClickFORMS, ACI, AIVRE).
- **Wedge:** order-intake and status agent that answers AMC status pings, schedules inspections, and pre-populates UAD 3.6 fields; AIVRE already sells report pre-population.
- **Weakest evidence:** Appraisal Inbox pricing page exists but amounts were not in the snippet; TOTAL price is a 2022 forum post. AMCs and GSE UAD rules are a real gatekeeper, and the industry is shrinking (-4.6% CAGR).
- **Fragmentation 3/5:** gatekeeper found (AMC/GSE), only two public prices.

## 82 — Independent auto repair shops · NAICS 811111 · 7 searches
- **Incumbent jobs:** estimates/repair orders, digital vehicle inspections with photo approvals, parts ordering, two-way texting, payments, tech time tracking (Tekmetric, Shopmonkey, AutoLeap, Shop-Ware, NAPA TRACS).
- **Wedge:** phone/text agent for estimate approvals, appointment reminders and declined-service follow-up, sold as an add-on to whatever SMS the shop runs.
- **Weakest evidence:** two establishment figures for the NAICS (97,995 vs 83,027) plus IBISWorld's broader 307,058; the fragmentation is not in doubt but the buyer count is. Incumbents are large and VC-funded (Shopmonkey $110M, AutoLeap $54M).
- **Fragmentation 5/5:** four public prices, low concentration, NAPA/Bosch tie-ins do not cover most shops.

## 89 — Small engine & outdoor power equipment repair · NAICS 811411 · 9 searches
- **Incumbent jobs:** work orders and repair tickets, parts lookup and price-file updates, OEM warranty-claim submission and product registration (Stihl PSP, Toro EZ-Link), unit service history, seasonal scheduling (RepairDesk, Orderry, Flyntlok, Ideal/c-Systems/Charter under Constellation, BiT, Windward).
- **Wedge:** warranty-claim and parts-order agent that fills each OEM's portal from the repair ticket; every DMS lists this integration as a selling point, and standalone repair shops without a DMS do it by hand.
- **Weakest evidence:** Census 2020 count is tiny (1,708 establishments) and the servicing-dealer pool (6,638 stores) is the real market; no concentration statement for the repair segment; Constellation trio and Flyntlok are quote-only.
- **Fragmentation 3/5:** two public prices, concentration unverified.

## 98 — Charter bus operators · NAICS 485510 · 7 searches
- **Incumbent jobs:** quoting (instant online quotes), booking and deposits, dispatch and driver/vehicle allocation, invoicing, DOT compliance (Busify, Busie, busHive, The Bus Network, Distinctive Coach Manager, BusCMMS, Hudson).
- **Wedge:** quote-follow-up agent (TBN's pitch is "automated follow-up to charter quotes" and taking business back from brokers); a quoting agent that replies within minutes to inbound charter requests is the direct-response product.
- **Weakest evidence:** only Distinctive publishes a price (and only the hosting fee); Busify, Busie, busHive and TBN are quote-only. Busie has just $646K funding and 11 employees, so incumbents are thin.
- **Fragmentation 4/5:** small companies hold >75% of share, no gatekeeper, one public price.

## 105 — Party & event rental companies · NAICS 532289 · 7 searches
- **Incumbent jobs:** inventory availability by date, quotes/proposals with e-sign, online booking and deposits, delivery routing, damage waivers (Goodshuffle Pro, InflatableOffice, Event Rental Systems, Rentopian, Booqable, Rentman).
- **Wedge:** inbound-quote agent that checks availability, prices the package, and sends the contract; weekend-heavy demand and small crews make this the highest-leverage step.
- **Weakest evidence:** Goodshuffle headcount is a range (25–100); ERS and Rentopian prices come from Software Advice, not vendor pages.
- **Fragmentation 5/5:** top-4 share 9.0% (explicit IBISWorld figure), four public prices, no gatekeeper.

## 112 — Independent jewelry stores · NAICS 448310 · 9 searches
- **Incumbent jobs:** serialized inventory, repair and custom-job tracking with customer notifications, appraisals, memo in/out, POS and clienteling (Jewel360, The Edge, WJewel, RepairDesk, Clientbook).
- **Wedge:** repair-status and clienteling agent (repair-ready texts, anniversary/occasion outreach from purchase history); Jewel360's repair notifications and Clientbook's clienteling show the jobs are valued separately.
- **Weakest evidence:** concentration statement is from a 2008 Signet filing; store count is falling 3.5%/yr; Jewel360 headcount not found (parent Quilt Software).
- **Fragmentation 5/5:** three public prices, independents >70% of specialty market, buying groups (IJO/RJO) do not mandate software.

## 119 — Retail bakeries · NAICS 722515 · 8 searches
- **Incumbent jobs:** custom-cake order intake and pricing, production scheduling, wholesale standing orders and delivery routes, recipe costing, POS (BakeSmart, Cybake, FlexiBake, CakeBoss, Bakesy, Square).
- **Wedge:** custom-order intake agent (photo/spec → quote → deposit → production ticket) for bakeries running on Square plus a phone; BakeSmart's "Cake Matrix" add-on ($149) prices the pain.
- **Weakest evidence:** NAICS 722515 mixes bakery cafes with coffee and ice-cream shops; retail-bakery-only count not found. BakeSmart price differs across two third-party sources ($99 vs $199/mo).
- **Fragmentation 5/5:** four public prices; vertical incumbents are tiny (BakeSmart: 3 employees, unfunded).

## 126 — Barber shops · NAICS 812111 · 7 searches
- **Incumbent jobs:** online booking, reminders, deposits/no-show fees, booth-rent tracking, payments, marketplace discovery (Squire, Booksy, theCut, GlossGenius, Vagaro, Mangomint).
- **Wedge:** waitlist/no-show recovery agent that fills cancelled slots by texting regulars; incumbents compete on discovery, not on rebooking automation.
- **Weakest evidence:** IBISWorld's 154,925 "businesses" includes sole-proprietor barbers; NAICS active-company count is only 20,938. Booksy funding/headcount not found.
- **Fragmentation 5/5:** four public prices ($25–30/mo solo tiers), no firm >5%, franchises control only their own units. Very crowded incumbent set.

## 133 — Chiropractic offices · NAICS 621310 · 7 searches
- **Incumbent jobs:** scheduling and online booking, SOAP notes, insurance claims and ERA posting, patient reminders/recall, care-plan billing (ChiroTouch, ChiroFusion, zHealth, Jane, Genesis).
- **Wedge:** claims follow-up and recall agent (denied-claim rework, lapsed-patient reactivation) that sits beside the EHR; ChiroFusion's "1.6M claims/month" shows the volume.
- **Weakest evidence:** zHealth headcount conflicts across sources (10+ vs 201–500), so no bonus; ChiroTouch/ChiroFusion headcounts not found. Category is mature with heavy add-on pricing.
- **Fragmentation 5/5:** four public prices, no firm >5%, The Joint franchise is ~950 of ~74k offices.

## 141 — Child care centers & in-home daycares · NAICS 624410 · 8 searches
- **Incumbent jobs:** attendance check-in/out (often state-mandated for subsidy), tuition billing and autopay, parent messaging and daily reports, enrollment/waitlist, ratio and staffing, subsidy claims (Brightwheel, Procare, Playground, Lillio, Kangarootime, MyKidReports).
- **Wedge:** enrollment and waitlist agent (tour scheduling, follow-up, paperwork collection) for single-site centers and home providers; subsidy-claim reconciliation for providers on state attendance systems.
- **Weakest evidence:** only Procare and MyKidReports show a price and both via blogs; Brightwheel, Playground, Lillio and Kangarootime are quote-only. State attendance-system mandates (WA, VA, MN) are a partial gatekeeper.
- **Fragmentation 3/5:** owner-operator buyer, one public price counted, gatekeeper partial, top-5 providers 6% of capacity.

## 149 — Flight schools · NAICS 611512 · 7 searches
- **Incumbent jobs:** aircraft/instructor scheduling and dispatch, Part 141 training records with dual e-signatures, Hobbs/tach billing, maintenance tracking, student progress (Flight Schedule Pro, Flight Circle, Aviatize, FlightLogger, Talon, Sky Schedule).
- **Wedge:** student-progress and rescheduling agent (weather cancellations, instructor swaps, stage-check readiness) on top of the scheduler; per-aircraft pricing ($10–29/aircraft/mo) leaves room for a per-student agent fee.
- **Weakest evidence:** small niche (~1,100 businesses); IBISWorld calls concentration "moderate" (CAE, ATP, FlightSafety); Flight Schedule Pro headcount is a range.
- **Fragmentation 4/5:** three public prices, FAA sets record rules but does not mandate a vendor.

## 156 — Boutique fitness & yoga studios · NAICS 713940 · 8 searches
- **Incumbent jobs:** class scheduling and booking, memberships/packs and autopay, waitlists, instructor payroll, marketing automation, branded apps (Mindbody, Momence, Arketa, Walla, WellnessLiving, Zenoti).
- **Wedge:** lead-to-intro-offer conversion and lapsed-member win-back agent; every incumbent charges extra for marketing automation, and studios are owner-run.
- **Weakest evidence:** Mindbody and Momence do not publish plan pricing (figures from third-party guides); the establishment figure is IBISWorld's Pilates & Yoga Studios count, not boutique fitness overall.
- **Fragmentation 5/5:** four public prices, no firm >5%, franchisors (Xponential 2,700+ studios) dictate software only inside their systems. Heavily contested incumbents (Arketa $22.6M raised 2025, Walla ~$18M).

## Headcount bonus awarded (verified_score = 2)
Appraisal Inbox (1–10), Anow (17), Flyntlok (19), Busify (2–10), Busie (11), theCut (11–50), Jane App (bootstrapped), BakeSmart (3, unfunded), Kangarootime (39), Flight Schedule Pro (11–50), Walla (nearly 50). Each carries the result URL in `ad_audit.csv`.
