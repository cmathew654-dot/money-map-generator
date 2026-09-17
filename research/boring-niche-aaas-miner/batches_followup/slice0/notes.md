# Step 2 follow-up, slice 0 — research notes (2026-09-17)

Scope: 15 niches (ids 27, 60, 68, 76, 83, 90, 99, 106, 113, 120, 127, 134, 142, 150, 157). WebSearch only; WebFetch/curl blocked. 159 of the 200-search cap used. Every number in the CSVs carries the URL of the search result it came from; anything else reads `unverified`. All ad-library counts are `unverified (host blocked)`.

Conventions: "vendor price" = amount shown on a result from the vendor's own domain; "third-party price" = amount from a review site or roundup, indicative only. Headcount bonus (0/2) follows the mechanical rule (<50 employees or bootstrapped, with URL); caveats on acquired units are in `tools.csv` notes.

---

## 27 — Epoxy & garage floor coating contractors (NAICS 238330)
- Incumbent jobs: per-square-foot Good/Better/Best estimates, satellite floor measurement, AI before/after visualizers, follow-up drips, scheduling, invoicing, job costing (QuoteIQ, CoatingOS, DripJobs, Coating Pro Tech, Builder Prime).
- AaaS wedge: "quote-and-close agent" that turns a photo + address into a tiered epoxy/polyaspartic proposal with a visualizer render, then runs the follow-up sequence until signed. Owner-operators already pay $30–$150/mo for exactly this workflow.
- Weakest evidence: no epoxy-specific establishment count (siccode 13,108 is all flooring contractors); CoatingOS/Coating Pro Tech pricing and headcounts not public; QuoteIQ headcount unverified (self-funded claim from its own about page). Concentration statement is a proxy (all flooring installers).
- Searches (10): NAICS count; "epoxy flooring" contractor software; best garage floor coating business software 2026; epoxy CRM estimating; CoatingOS pricing; DripJobs pricing/founded; QuoteIQ crunchbase; franchise required software; IBISWorld concentration; concrete-coating contractor count; Coating Pro Tech pricing; Builder Prime pricing.

## 60 — Document shredding services (NAICS 561990)
- Incumbent jobs: recurring bin routes, route optimization, driver app with barcode scan + signature, certificates of destruction, QuickBooks billing, NAID compliance logs (EZshred, Q-Shred, Octopus SaaS, Total Recall, Smart Service).
- AaaS wedge: "route-and-COD agent" for independent operators: builds the day's route from bin fill history, texts ETAs, captures proof of service, emails the certificate of destruction, and pushes the invoice. Also inbound quoting for one-time purge jobs.
- Weakest evidence: no attributable US establishment count (the ">3,000 companies" figure could not be tied to a result URL); zero vendors publish self-serve prices; no IBISWorld concentration statement surfaced; DHS Worldwide headcount conflicts (18 vs 100–250).
- Searches (11): establishment count; route management software; best shredding software 2026; COD scheduling; EZshred; ShredMetrics pricing; Octopus SaaS pricing; IBISWorld concentration; "3,000" attribution; Smart Service pricing; DHS Worldwide; i-SIGMA members; Octopus SaaS company.

## 68 — Translation & interpreting agencies (NAICS 541930)
- Incumbent jobs: quotes by word count/language pair, vendor (freelancer) assignment, project files, invoicing and vendor payables (Protemos, Plunet, XTRF, Awtomated); interpreter credentialing, dispatch, rate plans and no-show/cancellation billing (Interpreter Intelligence/Boostlingo, Anolla).
- AaaS wedge: "project-coordinator agent" for a 2–10 person LSP: intake the client email, quote from the rate card, pick and book the freelancer, chase delivery, and issue both invoices. Interpreting dispatch (matching credentialed interpreters to appointments with rush/cancel rules) is the higher-pain variant.
- Weakest evidence: Protemos and Anolla prices are third-party listings; Plunet/XTRF/Boostlingo quote-only; Interpreter Intelligence's 15-person headcount is pre-acquisition (parent ~305 staff); no per-firm size split.
- Searches (11): NAICS count; TMS business software; interpreting scheduling 2026; Plunet/XTRF/Protemos pricing; Protemos founded; Interpreter Intelligence; Boostlingo funding; IBISWorld concentration; Boostlingo/Anolla pricing; Anolla pricing.

## 76 — Small residential property managers (NAICS 531311)
- Incumbent jobs: listings + applications + screening, e-lease, rent collection/ACH, maintenance tickets, owner statements, trust accounting (TurboTenant, TenantCloud, Buildium, DoorLoop, Rentec Direct, Innago, AppFolio, Yardi Breeze, Shuk).
- AaaS wedge: "leasing-and-maintenance agent" for sub-100-unit managers: answers prospect inquiries, schedules showings, screens, chases late rent, triages maintenance requests to vendors, and drafts owner reports. Incumbents are feature-rich but human-driven; free tiers (TurboTenant, Innago) show price pressure on software alone, so the sell is labor replacement.
- Weakest evidence: establishment count attribution (naics.com vs insurancexdate.com); Buildium ownership/headcount not in results; DoorLoop/TurboTenant heavily funded so ad-longevity likely but crowded.
- Searches (10): NAICS count; best small-landlord software 2026; under-100-unit software; Buildium/AppFolio/DoorLoop/TenantCloud pricing; TenantCloud crunchbase; Innago; Rentec Direct; IBISWorld concentration; RPM franchise software; DoorLoop funding; TurboTenant/Innago employees.

## 83 — Auto body & collision repair shops (NAICS 811121)
- Incumbent jobs: insurer-compliant estimates and supplements, DRP assignment intake, parts procurement, cycle-time tracking, customer status texts (CCC ONE, Web-Est, ROME, Bodyshop Booster, Shopmonkey).
- AaaS wedge: "supplement-and-status agent" that sits beside CCC/Web-Est: photo-based damage capture, drafts supplements, chases insurer approvals, and keeps the customer updated. Must ride the CCC rail, not replace it.
- Weakest evidence: gatekeeper is strong (State Farm mandated CCC for DRP shops; CCC >80% share), so fragmentation score capped at 3; consolidators took ~31.7% of revenue by mid-2025 and ~800 independents closed in 2024; CCC price is third-party.
- Searches (10): NAICS count; best auto body software 2026; CCC ONE pricing; Bodyshop Booster/ROME/Mitchell; Shopmonkey pricing; Bodyshop Booster company; DRP/CCC mandate; consolidation share; Web-Est pricing; ROME company; Web-Est company.

## 90 — Appliance repair (NAICS 811412)
- Incumbent jobs: dispatch intake from ServiceBench/ServicePower, diagnose-order-return scheduling, parts ordering from Marcone/Encompass, warranty claim filing, invoicing (Rossware ServiceDesk); generic scheduling/dispatch/invoicing (Repair-CRM, QuoteIQ, Housecall Pro, ServiceTitan, Method, ServiceWorks).
- AaaS wedge: "booking-and-parts agent": answers the phone/web form, collects model + symptom, books the diagnostic, orders the likely part before the return visit, files the warranty claim. Rossware's $6,000 desktop license and 1–10 staff show a sticky but dated incumbent to displace.
- Weakest evidence: establishment counts conflict (5,380 / 13,535 / 37,769); Rossware and Repair-CRM headcounts from ZoomInfo/Tracxn only; ServiceBench/ServicePower are a partial channel gatekeeper for warranty work.
- Searches (9): NAICS count; best appliance repair software 2026; ServiceDesk/Rossware/ServicePower; pricing per technician; Rossware pricing; Repair-CRM company; IBISWorld concentration; Housecall Pro landing; Rossware employees.

## 99 — Customs brokers (NAICS 488510)
- Incumbent jobs: ABI entry filing, ISF, in-bond, PGA flags, HTS classification, duty calc, reconciliation, per-entry billing (NetCHB, CustomsNow, Strix, CustomsCity, Magaya, CargoWise, GoFreight).
- AaaS wedge: "entry-prep agent": reads the commercial invoice/packing list, classifies, builds the entry, and hands a certified filer the transmission; tariff-change monitoring for clients. Validation: Cervo AI (founded 2023, $5M seed) sold to Altana in July 2026 for up to $100M+ doing exactly this.
- Weakest evidence: only Strix publishes per-entry prices; NetCHB's 7-person headcount is pre-Descartes; CBP ABI certification is a hard regulatory gate, so the agent must partner with a certified vendor; establishment count mixes forwarders and brokers.
- Searches (11): NAICS count; ABI small brokerage software; best customs brokerage software 2026; pricing per entry; NetCHB; CustomsNow; Cervo; NCBFAA concentration; Strix; licensed-broker count; IBISWorld concentration; CustomsCity.

## 106 — Self-storage facilities (NAICS 531130)
- Incumbent jobs: unit map and rentals, online move-in, autopay/late fees and lien process, gate access control, tenant portal, dynamic pricing (Storable Edge/SiteLink/Easy, Stora, Storeganise, 6Storage, Kinnovis).
- AaaS wedge: "remote-manager agent" for unmanned or single-manager sites: answers inquiries, quotes and rents units, runs collections and lien notices by state rules, schedules gate codes and cleanouts. Independents own ~65% of facilities and vendors already price $75–$150/mo per facility.
- Weakest evidence: storEDGE/SiteLink prices are third-party; Storable vendor share not found; establishment count attribution (naics.com/insurancexdate) uncertain; Stora headcount 22 vs 39.
- Searches (11): NAICS count; independent-operator software; best software 2026 pricing; storEDGE/SiteLink/Easy/Stora pricing; Stora company; Storeganise; REIT share; Storable history; 6Storage; Storable Easy; Kinnovis.

## 113 — Pawn shops (NAICS 522298)
- Incumbent jobs: pawn loan tickets with state-specific interest/due dates, buys/layaway/retail POS, inventory and e-commerce listing, daily police reporting (LeadsOnline/BWI/RAPID), military-lending checks (Bravo, PawnMaster, PawnSmarts, PawnMate, PawnSnap, Pawnit, PPSS).
- AaaS wedge: "compliance-and-collections agent": files the daily police upload, sends due-date/redemption reminders, prices and lists forfeited goods online, reconciles precious-metal spot pricing. Skip consumer-facing lending; this is back-office for the shop owner.
- Weakest evidence: only PawnSmarts publishes a vendor price (Bravo/PawnMaster prices are third-party); establishment counts range 4,012 (IBISWorld 2026) to 12,000+; top-4 share not stated (FirstCash+EZCorp >30%); LeadsOnline mandates vary by city.
- Searches (10): NAICS count; POS software; Bravo/PawnMaster pricing; police-reporting pricing; PawnSmarts company; Bravo company; IBISWorld concentration; NPA/LeadsOnline mandate; IBISWorld business count; PawnMate; PawnSnap.

## 120 — Vending machine operators (NAICS 454210)
- Incumbent jobs: DEX/telemetry-driven pre-kitting, dynamic route planning, cashless payment reconciliation, commissions to locations, planogram/inventory, driver mobile app (VendSoft, Parlevel, Cantaloupe Seed, VendSys, Gimme, VendMAX).
- AaaS wedge: "route-planner-and-commissions agent" for 20–300 machine operators: ingests telemetry/sales, builds tomorrow's pick list and route, flags sold-outs and dead readers, computes and emails location commission statements. VendSoft at $1–$2/machine shows the price floor; the agent sells the labor, not the dashboard.
- Weakest evidence: IBISWorld business count is two conflicting figures (14,801 vs 2,564); concentration figure is 2016 (top-4 47.1%, so no fragmentation point); Parlevel/Cantaloupe prices third-party; Gimme funding contradictory ($0 vs $1.7M).
- Searches (10): NAICS count (x2); VMS route software; best VMS 2026 pricing; per-machine pricing; IBISWorld concentration (x2); VendSoft company; Parlevel/365; Cantaloupe pricing; VendSys; Gimme.

## 127 — Hair salons (NAICS 812112)
- Incumbent jobs: online booking + reminders, POS/tips/payroll, client notes and formulas, memberships, marketing texts, marketplace discovery (GlossGenius, Vagaro, Fresha, Boulevard, Mangomint, Phorest, Booksy, Square).
- AaaS wedge: "front-desk agent" for booth renters and 2–8 chair salons: books via text/DM, fills cancellations from a waitlist, sends rebooking nudges by service interval, manages deposits/no-show fees. Crowded, VC-funded incumbents mean the ad audit is likely to pass, but differentiation must be labor replacement, not booking.
- Weakest evidence: GlossGenius/Fresha/Boulevard prices are third-party; Fresha/Phorest domains and company data not surfaced; establishment counts 79,472 (2020) vs 125,440 (siccode).
- Searches (9): NAICS count; independent-salon booking software; best salon software 2026 pricing; Phorest/Mangomint/Meevo pricing; GlossGenius funding; Mangomint funding; IBISWorld concentration; Great Clips franchise software.

## 134 — Physical therapy clinics, independent (NAICS 621340)
- Incumbent jobs: SOAP documentation with Medicare compliance, scheduling and plan-of-care tracking, eligibility/prior auth, claims billing and denials, HEP delivery (WebPT, Prompt, SPRY, TheraPlatform, TurboPT, AdvancedMD, Net Health).
- AaaS wedge: "front-office RCM agent" for 1–5 provider clinics: verifies benefits, obtains prior auths, reminds and reschedules, scrubs and submits claims, works denials. Incumbents already sell AI scribes; the gap is the administrative back-and-forth with payers.
- Weakest evidence: WebPT/Prompt/AdvancedMD prices third-party; TurboPT and Net Health quote-only; concentration data comes from a bank deck and a Medium post rather than IBISWorld US; payers act as a soft gatekeeper.
- Searches (10): NAICS count; independent-practice EMR; best PT EMR 2026 pricing; per-provider pricing; TheraPlatform; SPRY; IBISWorld/ATI/Select concentration; TurboPT; Prompt EMR funding.

## 142 — Dance studios (NAICS 611610)
- Incumbent jobs: class registration and family accounts, tuition autopay with discounts, attendance, recital/costume ordering, parent portal and comms (Jackrabbit, DanceStudio-Pro, Studio Director, Akada, iClassPro, Class Manager, Sawyer, Dance Studio Manager).
- AaaS wedge: "enrollment-and-tuition agent": answers parent inquiries, books trial classes, chases failed autopays, manages waitlists and make-ups, and runs recital logistics comms. Flat $30–$150/mo incumbents with tiny teams (Akada 7 staff) suggest low software budgets but real admin pain.
- Weakest evidence: Jackrabbit and Sawyer prices are third-party; Class Manager/Studio Director/Dance Studio Manager company data missing; siccode count covers all fine-arts schools (IBISWorld 14,622 dance studios used).
- Searches (10): NAICS count; "dance studio" management software; best dance software 2026 pricing; iClassPro/Sawyer/Akada pricing; Jackrabbit company; DanceStudio-Pro pricing; IBISWorld concentration; Class Manager; Akada company; Studio Director pricing.

## 150 — Tutoring centers (NAICS 611691)
- Incumbent jobs: tutor–student scheduling, lesson-based invoicing and tutor payroll, parent portal, lead tracking, session notes (TutorBird, Teachworks, TutorCruncher, Oases, Tutorbase, Wise, Pike13, Dewey).
- AaaS wedge: "matching-and-billing agent": intakes the parent lead, proposes tutor/time matches, books, sends prep/progress notes, bills per lesson, and pays tutors. Revenue-share pricing (TutorCruncher 1%, Tutorbase 1%) shows owners accept usage-based pricing.
- Weakest evidence: Teachworks and Oases prices are third-party; TutorBird headcount is qualitative ("small team"); Wise pricing not shown; concentration figures conflict (Kumon 8.9% vs 15%).
- Searches (10): NAICS count; "tutoring center" software; best tutoring software 2026 pricing; TutorBird/Pike13 pricing; Teachworks company; Port 443/TutorBird; IBISWorld/Kumon concentration; Kumon/Mathnasium franchise software; Tutorbase pricing; Wise.

## 157 — Horse boarding & riding stables (NAICS 713990)
- Incumbent jobs: horse health/vet/farrier records, board and lesson billing with add-on services, lesson scheduling, owner communication and payments (Stable Secretary, Stables.co, Stables Systems, BarnManager, Stablebuzz, Equine Simplified, eSoft Planner, Paddock Pro).
- AaaS wedge: "barn-office agent": logs daily care/add-ons from staff texts, generates monthly board invoices, chases payments, schedules lessons and vet/farrier visits, and emails owners updates. Very small vendors ($6.95–$75/mo, 2–10 staff) and a new free entrant (Stables.co) point to low willingness to pay; sell to lesson barns with 20+ horses.
- Weakest evidence: establishment count is a scraped directory (10,304); IBISWorld concentration is a proxy code (livestock support services); Stable Secretary price sources conflict ($49/mo vs $6.95/user); BarnManager/Paddock Pro domains not surfaced.
- Searches (9): boarding-stable count; "horse boarding" barn software; best equine software 2026 pricing; BarnManager/Stable Secretary/Equisoft/Paddock Pro pricing; Stable Secretary company; stables.co; IBISWorld equine concentration; Stablebuzz/Equine Simplified pricing.

---

## Cross-slice observations
- Strongest fragmentation + public-price niches (5/5): 27, 76, 90, 106, 127, 142, 150, 157. Of these, 76 and 127 are crowded with VC-funded incumbents (likely to pass the ad audit but hard to differentiate); 90, 106, 142, 150, 157 have small, old, bootstrapped incumbents (easier to displace, but ad longevity is the open question).
- Gatekeepers found: 83 (insurer DRPs + CCC), 99 (CBP ABI certification). Partial: 90 (dispatch networks), 113 (LeadsOnline ordinances), 120 (telemetry hardware).
- Already-validated agentic wedge: 99 (Cervo AI → Altana, July 2026).
- Niches with fewer than 3 tool rows: none. Niche 60 has 6 rows but 0 vendor-published prices.
