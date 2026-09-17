# Step 2 follow-up, slice 1 — research notes (2026-09-17)

Scope: niches 28, 61, 69, 77, 84, 92, 100, 107, 114, 121, 128, 135, 143, 151, 158. Tool discovery, establishment counts, company facts and fragmentation checks via WebSearch only (WebFetch/curl blocked; Meta, Google and LinkedIn ad libraries unreachable, so every ad count reads `unverified (host blocked)`). 130 of the 200-search cap used. Every number in the CSVs carries the URL of the search result it appeared in; `unverified` otherwise. Prices marked "third-party" came from roundups or review aggregators, not the vendor's own pricing page.

Files: `niches.csv` (15 rows), `tools.csv` (92 rows), `ad_audit.csv` (92 rows, lookup URLs prebuilt, headcount bonus only), `fragmentation.csv` (15 rows), this file.

---

## 28 · Artificial turf & sports court installers (NAICS 238990)
- **Incumbent jobs:** measure the yard (satellite/CAD/motion device), produce a per-square-foot quote with cut plan and material takeoff, send contract, collect deposit, schedule crew. Tools: TurfEstimator, QuoteIQ (turf landing), ArcSite, MeasureSquare, Moasure, SiteRecon.
- **Agent wedge:** an intake-to-quote agent that takes a homeowner's address and photos, returns a priced turf proposal with waste-optimised roll layout and follows up until signed; owners currently pay $30-$200/mo across two or three tools to do this by hand.
- **Weakest evidence:** no turf-specific establishment count (NAICS 238990 is a catch-all); US concentration statement is borrowed from Australia and from a 2016 sports-field S-1; TurfEstimator has no company facts at all.
- **Searches (9):** NAICS 238990 count; turf installer software/CRM; best turf software 2026; sports court installer software; TurfEstimator pricing; QuoteIQ pricing/founded; ArcSite pricing/crunchbase; turf industry fragmentation; turf franchise/STC gatekeeper. Plus gap-fill: MeasureSquare pricing, Moasure, TurfEstimator company.

## 61 · Security guard companies (NAICS 561612)
- **Incumbent jobs:** build shift schedules against post orders, verify guard tours (NFC/QR/GPS), log incidents, generate client reports, feed payroll. Tools: GuardsPro, Silvertrac and TrackTik (both Trackforce, K1-backed), Novagems, Safetrac, THERMS.
- **Agent wedge:** an open-shift-filling and client-reporting agent: detects call-offs, texts qualified guards, confirms coverage, and writes the nightly client report from tour data; small firms pay $5-$20/guard/mo for software that still needs a dispatcher.
- **Weakest evidence:** establishment count is an undated "verified active" figure (5,373); Allied Universal's 26.1% share means "fragmented" is only true below the top tier; gatekeeper conclusion is from absence, not a dedicated search.
- **Searches (8):** NAICS 561612 count; best guard software 2026; Silvertrac/TrackTik/Guardso pricing; industry concentration; Novagems pricing; GuardsPro company; Silvertrac company; plus gap-fill Novagems company, Trackforce ownership, Guardso pricing, Safetrac company.

## 69 · Light-industrial staffing agencies (NAICS 561320)
- **Incumbent jobs:** applicant tracking, daily assignment fill, onboarding paperwork, time capture, weekly pay-and-bill with complex rules. Tools: Avionté and TempWorks (category defaults, payroll-native), Bullhorn Light Industrial, Ceipal, Crelate.
- **Agent wedge:** a candidate-reactivation and shift-fill agent that texts the bench, confirms show-up, and pushes confirmed hours into pay-and-bill; the two incumbents charge $49-$130/user/mo plus implementation and do none of the outreach.
- **Weakest evidence:** light-industrial subset of NAICS 561320 unquantified; Avionté and Bullhorn publish no prices; concentration statement is mixed ("concentrated nationally, fragmented mid-tier").
- **Searches (7):** NAICS 561320 count; best light-industrial staffing software; Avionté/TempWorks/Bullhorn pricing; Avionté company; TempWorks company; staffing concentration; plus gap-fill small-agency ATS pricing (Zoho/Ceipal/Crelate).

## 77 · Independent insurance agencies (NAICS 524210)
- **Incumbent jobs:** policy and client records (AMS), comparative rating, certificates and ID cards, renewals, commissions, carrier downloads; separate CRM for pipeline. Tools: HawkSoft, Momentum AMP (NowCerts), EZLynx (Applied), AgencyZoom (Vertafore), GloveBox, HubSpot insurance landing, Applied Epic.
- **Agent wedge:** a renewal-remarketing and service agent inside the AMS: pulls expiring policies, requotes across carriers, drafts the client email, handles certificate requests; 39,000 agencies with 30,000 under $1.25M revenue cannot staff this.
- **Weakest evidence:** prices are almost all third-party cited (only AgencyZoom is described as published); gatekeeper check (carriers, clusters, aggregators) was not run; no explicit concentration statement.
- **Searches (7):** NAICS 524210 count; best AMS 2026 pricing; independent agency CRM comparison; HawkSoft company; NowCerts/Momentum; Big I agency count; plus gap-fill EZLynx acquisition, AgencyZoom pricing.

## 84 · Mobile auto detailing (NAICS 811192)
- **Incumbent jobs:** online self-booking with package pricing, route-aware daily schedule, deposits/no-show protection, reminders, invoicing, review requests. Tools: Urable, OrbisX, ROXO Hub, Anolla, QuoteIQ (detailing landing), AutoHustl.
- **Agent wedge:** a booking-and-rebooking agent that quotes from vehicle photos, fills route gaps, and re-engages lapsed customers on a ceramic/maintenance cadence; incumbents cost $12-$100/mo and are passive booking pages.
- **Weakest evidence:** NAICS 811192 lumps detailing with car washes; the "no company >5%" statement is car wash plus detailing combined and third-party cited; ROXO Hub and Urable have no headcount.
- **Searches (7):** NAICS 811192 count; best mobile detailing software 2026; Urable/OrbisX pricing; detailing fragmentation; Urable company; OrbisX company; plus gap-fill ROXO Hub and Anolla.

## 92 · Freight brokers (NAICS 488510)
- **Incumbent jobs:** load entry, carrier sourcing and vetting, rate confirmation, tracking updates, document collection (BOL/POD), invoicing and carrier pay. Tools: Tai TMS, AscendTMS, ARK TMS, BrokerPro, Revenova, Turvo, Aljex.
- **Agent wedge:** a track-and-trace plus document-chasing agent that calls/texts carriers for check calls, collects PODs, and triggers invoicing; brokers pay $199/user or $945-$7,545/mo flat for TMSs that still need a human on the phone.
- **Weakest evidence:** NAICS 488510 includes forwarders and customs brokers; FMCSA licensed-broker count not found; gatekeeper role of load boards not assessed.
- **Searches (7):** NAICS 488510 count (twice, to pin the URL); best broker TMS 2026; Tai/Revenova/Turvo/AscendTMS pricing; brokerage concentration; AscendTMS company; Tai company; plus gap-fill BrokerPro pricing, ARK TMS company.

## 100 · Small 3PL warehouses (NAICS 493110)
- **Incumbent jobs:** multi-client inventory, receiving, pick/pack, carrier rate shopping, client portal, and above all automated 3PL billing (storage, handling, per-order fees). Tools: Extensiv 3PL Warehouse Manager, ShipHero, Logiwa, Packiyo, Packem, Deposco.
- **Agent wedge:** a client-billing and exception agent that reconciles activity into invoices, answers client "where is my order/inventory" questions, and flags SLA misses; entry pricing is $599-$1,995/mo plus per-client fees, so a $200-$400/mo agent has room.
- **Weakest evidence:** all prices third-party cited; US concentration statement absent (Canada and global used); Extensiv current headcount not found.
- **Searches (7):** NAICS 493110 count (twice); best 3PL WMS 2026; Extensiv/ShipHero/Logiwa pricing; warehousing concentration; Packiyo company; plus gap-fill Extensiv funding, Logiwa company.

## 107 · Laundromats (NAICS 812310)
- **Incumbent jobs:** attended POS for wash-dry-fold by weight, machine payments, pickup-and-delivery ordering and routing, customer notifications, employee time. Tools: Cents, Curbside Laundries, CleanCloud, Wash-Dry-Fold POS, LaundryMatch, The Laundry Boss.
- **Agent wedge:** a pickup-and-delivery growth agent that answers order texts, books routes, upsells recurring plans and reactivates lapsed households; the well-funded incumbent (Cents, $184M raised) is pushing an AI receptionist, so speed matters.
- **Weakest evidence:** establishment counts range 4,051 (siccode) to 29,500 (CLA) to 18,375 (IBISWorld-derived); Wash-Dry-Fold headcount not found.
- **Searches (8):** NAICS 812310 count; best laundromat software 2026; Cents/Curbside/CleanCloud pricing; laundromat fragmentation; Cents funding; CLA laundromat count; plus gap-fill Wash-Dry-Fold company, CleanCloud company, Curbside company.

## 114 · Gun shops / FFL dealers (NAICS 451110)
- **Incumbent jobs:** electronic A&D bound book, e4473 with NICS workflow, ATF-ready records retention, POS with serialized inventory, distributor catalog feeds, range management. Tools: FastBound, Orchid eBound, Bravo, Gearfire AXIS, Coreware, Rapid Gun Systems, AIM POS, BoundPro.
- **Agent wedge:** a compliance-audit agent that reconciles bound book vs. physical inventory, flags 4473 errors before ATF inspection, and drafts correction logs; bound-book SaaS is $9-$35/mo, so the agent sells on inspection risk, not on replacing software.
- **Weakest evidence:** IBISWorld gun-store business count not visible; FastBound and Bravo headcount not found; gatekeeper (distributors, NSSF) not searched.
- **Searches (7):** FFL count (twice); best bound-book software 2026; FastBound/Orchid pricing; gun-store POS pricing; gun-store concentration; FastBound/Bravo company; plus gap-fill Orchid LLC company, Gearfire AXIS pricing.

## 121 · Funeral homes (NAICS 812210)
- **Incumbent jobs:** first-call intake, case management, arrangement conference forms, e-signatures, obituary/website publishing, payments, family collaboration portal. Tools: Passare, Osiris, CRaKN and Parting Pro (Tribute Technology, PE), Gather, Halcyon.
- **Agent wedge:** a first-call and paperwork agent that answers overnight, captures the case, pre-fills state forms and the obituary draft, and coordinates the family checklist; independents (48.6% of the market) cannot staff 24/7 intake.
- **Weakest evidence:** Passare and Parting Pro prices are single review mentions; Gather headcount is from 2020; SCI share is from a 2013 10-K.
- **Searches (8):** NAICS 812210 count; best funeral software 2026; Passare/Osiris/CRaKN pricing; SCI concentration; Passare company; Parting Pro/Gather/Halcyon pricing; plus gap-fill Osiris company, Gather company, Tribute Technology ownership.

## 128 · Nail salons (NAICS 812113)
- **Incumbent jobs:** online booking, POS with tips and card processing, staff calendars and commission, reminders, marketplace discovery. Tools: GlossGenius (nail landing), Mangomint, Vagaro, Fresha, Zenoti, Boulevard.
- **Agent wedge:** a rebooking and no-show-recovery agent (texts, waitlist backfill, deposit enforcement) layered on the salon's existing booking tool; incumbents are $24-$165/mo and well funded (GlossGenius $70M, Mangomint $48M), so the wedge must be outcome-priced.
- **Weakest evidence:** establishment count undated; concentration statement attributed to IBISWorld via search summary; the tools are beauty-vertical rather than nail-specific.
- **Searches (6):** NAICS 812113 count; best nail salon software 2026; GlossGenius/Mangomint/Vagaro pricing; nail salon concentration/franchise; GlossGenius company; Mangomint company.

## 135 · Optometry practices (NAICS 621320)
- **Incumbent jobs:** EHR charting, scheduling and recall, vision-plan eligibility and claims (VSP/EyeMed), optical inventory and POS, patient messaging. Tools: RevolutionEHR, Crystal PM, Eyefinity (VSP), MaximEyes, Compulink, Uprise, Glasson.
- **Agent wedge:** a recall-and-benefits agent that verifies vision-plan eligibility before the visit, fills the schedule from the recall list, and chases unpaid claims; RevolutionEHR starts at $319/mo per doctor and none of the incumbents do outbound work.
- **Weakest evidence:** only two public prices (RevolutionEHR "starting at", Crystal PM third-party); Crystal PM headcount conflicts (15/27/50); no explicit concentration statement; Vision Source software requirements not found.
- **Searches (8):** NAICS 621320 count; best optometry PM software 2026; RevolutionEHR/Crystal/Uprise pricing; Vision Source/Eyefinity gatekeeper; PE consolidation; RevolutionEHR ownership; Crystal PM company; plus gap-fill MaximEyes/Uprise company.

## 143 · Martial arts schools (NAICS 611620)
- **Incumbent jobs:** family memberships and billing, attendance, belt/rank tracking and testing, trial-class lead follow-up, waivers for minors. Tools: Kicksite, Spark Membership, Zen Planner (Daxko), Gymdesk, PushPress.
- **Agent wedge:** a trial-to-enrollment agent that answers web/Facebook leads, books the intro class, sends reminders and converts to membership; incumbents charge $49-$249/mo and Spark's whole pitch is lead automation, so target the schools on cheaper tools.
- **Weakest evidence:** IBISWorld count (76,364) includes sole proprietors; Spark Membership headcount not found; ATA-affiliated schools' tooling not verified.
- **Searches (7):** NAICS 611620 count; best martial arts software 2026; Kicksite/Spark/Zen Planner pricing; martial arts concentration/franchise; Kicksite company; Spark company (twice); plus gap-fill Zen Planner/Daxko, Gymdesk.

## 151 · Golf courses, independent / municipal (NAICS 713910)
- **Incumbent jobs:** tee sheet with online booking and dynamic pricing, pro-shop and F&B POS, memberships and billing, marketing email, reporting. Tools: foreUP, Lightspeed Golf, Club Caddie (Jonas), Teesnap, GolfNow/EZLinks, Club Prophet.
- **Agent wedge:** a tee-time yield agent that fills unsold slots via SMS/email offers and league coordination, positioned as a way to reduce the GolfNow barter (~$94,500/yr of foregone tee-time revenue per source).
- **Weakest evidence:** GolfNow/EZLinks is a genuine gatekeeper (90%+ of third-party tee times) and municipal buyers procure formally; foreUP pricing evidence conflicts; ownership-concentration statement dates to 1998.
- **Searches (7):** NAICS 713910 count; best golf software 2026; foreUP/Club Prophet/Teesnap pricing; golf ownership concentration; GolfNow barter gatekeeper; plus gap-fill foreUP acquisition, Club Caddie, Teesnap company, Lightspeed Golf pricing.

## 158 · Wedding & event venues (NAICS 531120 proxy)
- **Incumbent jobs:** lead inbox and inquiry response, tours, proposals and contracts, BEOs and floor plans, payments and schedules, vendor coordination. Tools: Perfect Venue, Tripleseat, Planning Pod, Event Temple, Releventful.
- **Agent wedge:** an inquiry-response and tour-booking agent (The Knot/WeddingWire leads answered in minutes, availability checked, tour booked, proposal drafted); venues are 71.8% single-owner and lose leads to slow replies. Perfect Venue already markets AI follow-up, so differentiate on speed-to-lead across marketplaces.
- **Weakest evidence:** venue count is scraped directory data, not Census; marketplace dependence on The Knot was not assessed as a gatekeeper; Planning Pod entry price conflicts ($19.99 vs $199).
- **Searches (6):** venue count; best venue software 2026; Perfect Venue/Tripleseat/Planning Pod pricing; wedding services concentration; Perfect Venue/Tripleseat company; plus gap-fill Planning Pod, Event Temple, Releventful.

---

### Method caveats for the whole slice
- `share_under_20_employees` is `unverified` for all 15 niches; no result stated a Census size-class share.
- Headcount bonus (+2) was granted only where a result showed fewer than 50 employees or explicit no-funding/self-funded status; ranges such as "11-50" or "10-50" did not qualify.
- Gatekeeper points were withheld where no dedicated search was run (77, 92, 100, 114, 121, 158) even when nothing suggested a gatekeeper.
- GolfNow/EZLinks is the one confirmed gatekeeper in the slice (niche 151).
