# ideas_ranked.md — Boring-Niche Ad-Validated Idea Miner (US)

## Status: Step 3 ad audit completed for all 134 search-verified tools (run on a local machine, 2026-09-16)

**Qualified niches by the method's definition (≥2 search-verified tools scoring ≥5): 22.** Provisional (would qualify counting tools whose membership in the niche came from prior knowledge, not search): 1. Niches 61–160 were never searched for tools (session search cap), so most of them cannot qualify yet; see README for the rerun plan.

How the numbers were obtained: Meta Ad Library (active ads, US, resolved to the vendor's Page; start dates from Meta's own data feed), Google Ads Transparency Center (creatives with first-shown and last-shown dates from Google's own feed; a creative passes the 90-day test when first shown ≥90 days ago and still shown within 14 days), LinkedIn Ad Library (presence and run dates, advertiser-verified). Scoring follows the brief: Meta +3 (≥5 active and ≥3 running ≥60 days), Google +3 (≥5 ads and ≥3 passing 90 days), LinkedIn +1, bootstrapped/<50 staff +2, direct-response CTA +1. Tool passes at ≥5.

**Ranking:** niche ad score = mean of the two best tool scores among search-verified tools (0–10); method score = ad score + fragmentation score (0–5). Qualified niches first, then everything else by method score, then by the pre-audit provisional score.

Known limits, stated plainly:
- Meta for the 571 tools audited in the final run (2026-09-16 21:00+) is **unverified**: Meta throttled that run into empty results. Their scores rest on Google, LinkedIn and headcount only, so they can only rise. A slow Meta-only rerun is queued for the tools where +3 would change the verdict.
- Meta sampling: fast mode read the first 30–60 ads of each Page, newest first. Big advertisers can be undercounted on the "≥3 ads running ≥60 days" test. Tools affected are flagged `undersampled` on their card and a targeted rescrape is queued.
- Three tools with generic names resolved to the wrong Meta Page (Essential, GoPave, Contractor+). Their Meta points are zeroed; five more are flagged ambiguous.
- Fragmentation scores are still conservative: gatekeeper and concentration searches never ran, so no niche got the "no gatekeeper" point.
- Horizontal tools (Jobber, Housecall Pro, ServiceTitan, Service Fusion, FieldPulse) advertise to all home-service trades; a niche that qualifies only through them is marked `horizontal-only`, meaning the category converts but no vertical incumbent proves the niche on its own.

---

## Summary table

| rank | niche | status | tools audited | passing tools | ad score | frag | method score |
|---|---|---|---|---|---|---|---|
| 1 | Residential roofing contractors | QUALIFIED | 6 | RoofSnap, AccuLynx, Roofr, ServiceTitan | 8.5 | 5 | 13.5 |
| 2 | Small residential electrical contractors | QUALIFIED (horizontal-only) | 11 | Housecall Pro, Service Fusion, ServiceTitan | 8.0 | 5 | 13.0 |
| 3 | Irrigation & lawn sprinkler contractors | QUALIFIED | 9 | Housecall Pro, Service Fusion, ServiceTitan, HindSite Software / FieldCentral | 8.0 | 5 | 13.0 |
| 4 | Plumbing contractors | QUALIFIED (horizontal-only) | 8 | FieldPulse, ServiceTitan | 8.0 | 5 | 13.0 |
| 5 | Pressure washing & exterior cleaning | QUALIFIED (horizontal-only) | 12 | Housecall Pro, Service Fusion, Jobber | 8.0 | 5 | 13.0 |
| 6 | Appliance repair | QUALIFIED (horizontal-only) | 7 | Housecall Pro, ServiceTitan | 8.0 | 5 | 13.0 |
| 7 | Air duct & dryer vent cleaning | QUALIFIED | 8 | Service Fusion, ServiceTitan, Vonigo | 8.0 | 5 | 13.0 |
| 8 | Garage door installers & repair | QUALIFIED (horizontal-only) | 11 | FieldPulse, ServiceTitan, Jobber | 8.0 | 4 | 12.0 |
| 9 | Locksmiths | QUALIFIED (horizontal-only) | 8 | FieldPulse, Housecall Pro, Service Fusion, ServiceTitan | 8.0 | 4 | 12.0 |
| 10 | Epoxy & garage floor coating contractors | QUALIFIED | 7 | DripJobs, Builder Prime | 6.5 | 5 | 11.5 |
| 11 | Lawn care & landscape maintenance | QUALIFIED | 7 | ServiceTitan, HindSite Software / FieldCentral | 7.0 | 4 | 11.0 |
| 12 | Residential painting contractors | QUALIFIED | 9 | DripJobs, PaintScout | 7.0 | 4 | 11.0 |
| 13 | HVAC contractors | QUALIFIED | 11 | Housecall Pro, ServiceTrade | 6.5 | 4 | 10.5 |
| 14 | Fire extinguisher & fire alarm inspection companies | QUALIFIED | 8 | Inspect Point, ServiceTrade | 5.5 | 5 | 10.5 |
| 15 | Food trucks | QUALIFIED | 8 | Roaming Hunger (vendor portal), Truckster (vendor platform) | 5.5 | 5 | 10.5 |
| 16 | Deck & patio builders | QUALIFIED | 5 | Builder Prime, Houzz Pro | 6.0 | 4 | 10.0 |
| 17 | Independent used car dealers | QUALIFIED | 7 | AutoRaptor CRM, Wayne Reaves Software | 5.0 | 5 | 10.0 |
| 18 | Small residential property managers | QUALIFIED | 9 | Innago, Rentec Direct | 5.0 | 5 | 10.0 |
| 19 | Carpet & upholstery cleaning | QUALIFIED (horizontal-only) | 8 | Housecall Pro, Jobber | 7.5 | 2 | 9.5 |
| 20 | Foundation repair & basement waterproofing contractors | QUALIFIED | 3 | Builder Prime, Contractor Accelerator | 6.0 | 3 | 9.0 |
| 21 | Fire sprinkler contractors | QUALIFIED | 5 | Inspect Point, BuildOps, ServiceTrade | 5.5 | 3 | 8.5 |
| 22 | Glass & glazing contractors | QUALIFIED | 4 | FieldPulse, Smart Glazier Software | 7.5 | 1 | 8.5 |
| 23 | Trailer dealers | audited, not passing | 7 | Blackpurl | 4.5 | 5 | 9.5 |
| 24 | Self-storage facilities | audited, not passing | 7 | Storeganise | 4.5 | 5 | 9.5 |
| 25 | Music schools & private music teachers | audited, not passing | 11 | Opus1.io | 4.5 | 5 | 9.5 |
| 26 | Driving schools | audited, not passing | 8 | DrivingSchoolSoftware.com (DrivingSchool.Software) | 4.5 | 5 | 9.5 |
| 27 | Tutoring centers | audited, not passing | 8 | Teachworks | 4.5 | 5 | 9.5 |
| 28 | Snow removal contractors | audited, not passing | 4 | Aspire | 5.0 | 4 | 9.0 |
| 29 | Independent auto repair shops | audited, not passing | 8 | - | 4.0 | 5 | 9.0 |
| 30 | Independent tire shops | audited, not passing | 10 | - | 4.0 | 5 | 9.0 |
| 31 | Boutique fitness & yoga studios | audited, not passing | 9 | - | 4.0 | 5 | 9.0 |
| 32 | Medical billing companies | audited, not passing | 6 | - | 4.0 | 5 | 9.0 |
| 33 | Courier & last-mile delivery companies | audited, not passing | 9 | Shipday | 5.0 | 4 | 9.0 |
| 34 | Boat dealers & marinas | audited, not passing | 12 | - | 4.0 | 5 | 9.0 |
| 35 | Laundromats | audited, not passing | 6 | CleanCloud | 4.0 | 5 | 9.0 |
| 36 | Pet grooming salons & mobile groomers | audited, not passing | 11 | - | 4.0 | 5 | 9.0 |
| 37 | Tattoo studios | audited, not passing | 8 | Porter | 4.0 | 5 | 9.0 |
| 38 | Martial arts schools | audited, not passing | 5 | Kicksite | 4.0 | 5 | 9.0 |
| 39 | Lawn fertilization & weed control route businesses | audited, not passing | 5 | HindSite Software / FieldCentral | 4.5 | 4 | 8.5 |
| 40 | Low-voltage, alarm & security camera installers | audited, not passing (horizontal-only) | 6 | ServiceTitan | 5.5 | 3 | 8.5 |
| 41 | Gutter installation & cleaning contractors | audited, not passing | 4 | RoofSnap | 6.5 | 2 | 8.5 |
| 42 | Campgrounds & RV parks | audited, not passing | 10 | - | 3.5 | 5 | 8.5 |
| 43 | Photographers & photo booth operators | audited, not passing | 7 | - | 3.5 | 5 | 8.5 |
| 44 | Artificial turf & sports court installers | audited, not passing | 6 | - | 3.5 | 5 | 8.5 |
| 45 | Environmental testing labs (asbestos, lead, water) | audited, not passing | 8 | - | 3.5 | 5 | 8.5 |
| 46 | Private investigators | audited, not passing | 8 | - | 3.5 | 5 | 8.5 |
| 47 | Mortgage brokers | audited, not passing | 7 | BNTouch | 3.5 | 5 | 8.5 |
| 48 | Small fleet trucking companies (1-20 trucks) | audited, not passing | 8 | TruckingOffice | 4.5 | 4 | 8.5 |
| 49 | Construction equipment rental yards | audited, not passing | 7 | Quipli | 4.5 | 4 | 8.5 |
| 50 | Party & event rental companies (tents, bounce houses) | audited, not passing | 9 | - | 3.5 | 5 | 8.5 |

---

## 1. Residential roofing contractors  (NAICS 238160)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 13.5 = ad score 8.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** RoofSnap, AccuLynx, Roofr, ServiceTitan.
- **Rescrape queued (Meta undersampled):** JobNimbus.
- **Boring test:** 3/3 — Storm-chasing estimates, insurance supplements, crew scheduling.
- **US establishments:** 108,598 businesses (IBISWorld Roofing Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/roofing-contractors/198); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| RoofSnap | yes | 9 | yes | 10 / 3 / 0 (2026-07-17) | RoofSnap | yes | 200 / 40 (2022-05-05) | no 0 | 2 |  |
| AccuLynx | yes | 8 | yes | 10 / 9 / 5 (2025-08-20) | AccuLynx | yes | 83 / 24 (2023-03-05) | yes 2 | 0 |  |
| Roofr | yes | 8 | yes | 113 / 22 / 0 (2026-05-28) | Roofr | yes | 400 / 37 (2023-06-28) | yes 10 | 0 |  |
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| JobNimbus | yes | 1 | no | 67 / 0 / 0 (2026-09-10) | JobNimbus | yes | unverified (host blocked) / unverified (host blocked) (-) | unverified (host blocked)  | 0 | undersampled |
| Leap | yes | 1 | no | 10 / 2 / 0 (2026-06-06) | LEAP Legal Software US | yes | unverified (host blocked) / unverified (host blocked) (-) | unverified (host blocked)  | 0 | ambiguous_page |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Residential roofing contractors (238160)
> - Core jobs: satellite roof measurement to proposal (Roofr, RoofSnap), sales pipeline/CRM and insurance-claim tracking (AccuLynx, JobNimbus), production scheduling and material ordering, e-sign contracts (Leap), payments/financing.
> - Wedge: hardest niche to enter (five funded/acquired incumbents, three with public pricing). A narrow agent for insurance-supplement writing or storm-lead follow-up is the only plausible gap; not recommended as a primary target.
> - Weakest evidence: AccuLynx/JobNimbus prices come from third-party guides, not vendor pages; Roofr headcount conflicts (193 vs 135); no top-4 share.

**The agent version** [hypothesis]: Storm lead → roof measured from aerial imagery → estimate → insurance supplement package assembled (photos, Xactimate-style line items) → job scheduled → invoice. Needs: aerial measurement, photo intake, PDF assembly, calendar.

**Wedge** [hypothesis]: Insurance-supplement assembly agent for residential roofers.

**Price ceiling:** incumbent public prices found [search-cited]:
  - RoofSnap: $52/user/mo annual (Enterprise, 10-user min); $105/user/mo monthly; $13 per measurement pay-as-you-go (https://roofsnap.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator / sales manager at $2-6M roofers; per-user pricing means owner signs. Public-price incumbents: 3. Gatekeeper: no (independents unconstrained: yes) — Roofing franchisors found do not mandate a CRM/FSM: SlopePro Roofing FDD mandates only QuickBooks; RoofAid USA 2025 FDD names no mandated systems (https://www.francloud.com/franchises/roofaid-usa). Distributors (Beacon PRO+, ABC Connect, SRS Roof Hub) offer ordering platforms and CRM integrations (AccuLynx, Leap) but no software mandate found (https://roofing. Top-4 share: unverified; statement: IBISWorld: Roofing Contractors has low market share concentration; Roofing & Siding Contractors highly fragmented with no company holding more than 5%. ConsumerAffairs: Tecta America largest at 1.7% s.

**Evidence URLs (31):**
  - https://www.ibisworld.com/united-states/number-of-businesses/roofing-contractors/198
  - https://www.acculynx.com/
  - https://getlatka.com/companies/acculynx
  - https://tracxn.com/d/companies/acculynx/__dw-n_nrH7OC3tTheUj6GIyajCyR-y3pwFKgSSubxNFM
  - https://www.capterra.com/p/116187/Acculynx/
  - https://www.jobnimbus.com/
  - https://www.crunchbase.com/organization/jobnimbus
  - https://contractortoolstack.com/software/jobnimbus/
  - https://leaptodigital.com/
  - https://www.crunchbase.com/organization/leap-bc9f
  - https://roofsnap.com/
  - https://roofsnap.com/pricing/
  - https://softwareconnect.com/reviews/roofsnap/
  - https://www.capterra.com/p/174071/RoofSnap/pricing/
  - https://roofr.com/
  - https://tracxn.com/d/companies/roofr/__6mi_m9GfIUPXCI-ZdXnRXBKO7UO2jT1N6_nNfFyFWhY
  - https://www.crunchbase.com/organization/roofr
  - https://www.servicetitan.com/industries/roofing-software
  - https://roofingsoftwareguide.com/guides/leap-pricing/
  - https://www.francloud.com/franchises/slopepro-roofing
  - https://www.ibisworld.com/united-states/industry/roofing-contractors/198/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=191303631128
  - https://adstransparency.google.com/advertiser/AR14653188370994298881?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=366445260038774
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=390415151727160
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=240696209348952
  - https://adstransparency.google.com/advertiser/AR03019457469031120897?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1561813597473015
  - https://adstransparency.google.com/advertiser/AR04759203301638012929?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US

**Confidence:** medium-low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 2. Small residential electrical contractors  (NAICS 238210)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 13.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Housecall Pro, Service Fusion, ServiceTitan.
- **Rescrape queued (Meta undersampled):** Sera Systems.
- **Boring test:** 3/3 — Permits/inspections, service calls, flat-rate pricing books.
- **US establishments:** 55951 (unverified, https://siccode.com/naics-code/238210/electrical-contractors-wiring-installation-contractors); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Housecall Pro | yes | 8 | yes | 706 / 3 / 3 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | horizontal |
| Service Fusion | yes | 8 | yes | 29 / 5 / 0 (2026-07-16) | Service Fusion | yes | 400 / 27 (2024-04-26) | yes 5 | 0 | horizontal |
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| Method CRM | yes | 4 | no | 4 / 2 / 2 (2023-05-30) | Method CRM | yes | 200 / 21 (2023-02-27) | no 0 | 0 | horizontal |
| Sera Systems | yes | 3 | no | 17 / 0 / 0 (2026-08-24) | Sera Systems | yes | 51 / 0 (2024-08-20) | no 0 | 2 | undersampled |
| TurboBid | yes | 2 | no | 0 / 0 / 0 (-) | TurboBid Estimating Software | no | 0 / 0 (-) | no 0 | 2 |  |
| The New Flat Rate | yes | 1 | no | 7 / 0 / 0 (2026-07-23) | The New Flat Rate | yes | 19 / 1 (2024-07-18) | no 0 | 0 |  |
| AceWatt CRM | yes | 0 | no | 0 / 0 / 0 (-) | Ace Watt | no | 0 / 0 (-) | no 0 | 0 |  |
| Business Genie | yes | 0 | no | 0 / 0 / 0 (-) | Business Genie App | no | 1 / 0 (2026-04-11) | no 0 | 0 |  |
| CRM for Electricians | yes | 0 | no | 0 / 0 / 0 (-) | CRM  | no | 0 / 0 (-) | no 0 | 0 |  |
| Flat Rate Plus Online | yes | 0 | no | 0 / 0 / 0 (-) | Flat Rate | no | 0 / 0 (-) | no 0 | 0 | ambiguous_page |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Small residential electrical contractors
> - Core jobs: flat-rate price books on the tech's phone (Flat Rate Plus, The New Flat Rate, Housecall Pro Price Book add-on), NEC-assembly estimating (TurboBid), scheduling/dispatch, invoicing, QuickBooks sync (Method), code-compliance tracking (Business Genie), after-hours call answering (Sera/QuoteIQ/ServiceAgent).
> - Pricing is public across the board: Sera $399/mo bundle, Business Genie $50-135, TurboBid $99/mo, The New Flat Rate $88/user/mo. Sera is VC/contractor-funded (31 staff, $17M raised); TurboBid is founder-run.
> - Gatekeeper exists but only inside franchises: Mr. Electric's FDD mandates ServiceTitan + FranConnect; Mister Sparky (Authority Brands) is also on ServiceTitan. Independents (the bulk of ~56K-252K firms, most under $2M revenue) are unconstrained.
> - Agent wedge: quote-to-book. Homeowner sends photos/description, agent builds a flat-rate quote from a price book, books the slot, confirms permit needs, and follows up. That is the job TurboBid/flat-rate tools plus a dispatcher do today.
> - Weakest evidence: two very different firm counts (55,951 siccode vs 251,789 Northeastern Advisors) because "residential" is not a NAICS split; headcounts for Business Genie/Flat Rate Plus unverified.
> - Vertical-tool follow-up (2026-09-17): Small residential electrical contractors Found: AceWatt CRM (acewatt.com, "AI-Powered CRM for Electrical Contractors", Starter $49/mo, founder named), CRM for Electricians (crmforelectricians.com, no pricing visible), plus multi-trade pricing/estimating tools The New Flat Rate and TurboBid (founded 2001, $350 setup). Confidence: AceWatt is high-confidence vertical (name, homepage, pricing page all electrician-specific). crmforelectricians.com is vertical by name but may be a thin/white-label site - medium. TurboBid/TNFR are trade-specific but span 2-3 trades and are not CRMs - medium-low.

**The agent version** [hypothesis]: Service-call intake → flat-rate quote from the operator's price book → permit application drafted for the jurisdiction → inspection scheduled → invoice. Needs: phone/SMS, price book, jurisdiction permit portals, calendar.

**Wedge** [hypothesis]: Permit-and-inspection paperwork agent for small residential electricians.

**Price ceiling:** incumbent public prices found [search-cited]:
  - AceWatt CRM: $49/mo (Starter) (https://acewatt.com/pricing)
  - Business Genie: $50 to $135 (3 editions, per TrustRadius); free trial and free version (https://www.trustradius.com/products/business-genie-app/pricing)
  - The New Flat Rate: $88/month per user (https://www.capterra.com/p/250719/The-New-Flat-Rate/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator ('vast majority of operators generating under $2 million in annual revenue'). Public-price incumbents: 5. Gatekeeper: franchise-only (independents unconstrained: yes) — Mr. Electric (Neighborly) FDD mandates ServiceTitan, FranConnect, ProTradeNet and proprietary Mr. Electric software; binds franchisees only. NECA lists BuildOps/Siteline/Bluebeam as sponsorship partners, not mandates (https://www.necanet.org/about-neca/partnerships/industry-alliance-network).. Top-4 share: 3.1%.

**Evidence URLs (47):**
  - https://siccode.com/naics-code/238210/electrical-contractors-wiring-installation-contractors
  - https://acewatt.com/crm-for-electricians
  - https://acewatt.com/pricing
  - https://www.businessgenieapp.com/industries/electrical
  - https://www.trustradius.com/products/business-genie-app/pricing
  - https://www.zoominfo.com/c/business-genie/557261019 (count not in snippet)
  - https://www.extruct.ai/hub/businessgenieapp-com/ (details not in snippet)
  - https://www.linkedin.com/company/businessgenieapp
  - https://crmforelectricians.com/
  - https://www.flatratesoftware.com/electrical-flat-rate-pricing/
  - https://flatratesoftware.com/software-pricing/
  - https://www.housecallpro.com/industries/electrical-contractor-software/
  - https://www.method.me/resources/best-electrical-contractor-software/
  - https://sera.tech/who-we-serve/industry/electrical
  - https://www.cbinsights.com/company/sera-systems
  - https://sera.tech/resources/sera-systems-secures-series-b-funding-driven-by-contractor-investments ; https://www.crunchbase.com/organization/sera-systems
  - https://www.capterra.com/p/246280/Sera/ ; https://www.g2.com/products/sera-systems-sera/reviews (counts not in snippet)
  - https://www.linkedin.com/company/serasystems
  - https://www.servicefusion.com/electrical-contractor-software
  - https://www.servicetitan.com/industries/electrical-software
  - https://www.capterra.com/p/250719/The-New-Flat-Rate/
  - https://www.capterra.com/p/250719/The-New-Flat-Rate/ (count not in snippet)
  - https://www.turbobid.com/pages/residential-electrical-estimating-service
  - https://www.turbobid.com/pages/when-we-complete-an-residential-electrical-estimate
  - https://www.linkedin.com/in/billruffner/ (founder profile)
  - https://www.capterra.com/p/246280/Sera/
  - https://buildops.com/resources/flat-rate-pricing-software-for-electricians/
  - https://www.francloud.com/franchises/mr-electric
  - https://recession.com/wp-content/uploads/2020/03/23821-Electricians-in-the-US-Industry-Report.pdf
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=105866671929139
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=100847741736166
  - https://adstransparency.google.com/advertiser/AR15597160687313354753?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=704007606136315
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1092158107657451
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=431381633653850
  - https://adstransparency.google.com/advertiser/AR17264116582418743297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=172540562776330
  - https://adstransparency.google.com/advertiser/AR09243979642128302081?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=103212732135669
  - https://adstransparency.google.com/advertiser/AR00355914593970683905?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=506971112706787
  - https://adstransparency.google.com/advertiser/AR01281923922538790913?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=154761484596008
  - https://adstransparency.google.com/advertiser/AR04848841090171666433?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=138468722905793

**Confidence:** medium-low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 3. Irrigation & lawn sprinkler contractors  (NAICS 238220)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 13.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Housecall Pro, Service Fusion, ServiceTitan, HindSite Software / FieldCentral; passing but membership unverified: Jobber.
- **Boring test:** 3/3 — Spring start-up/winterization routes, backflow tests, zone repairs.
- **US establishments:** 2425 (2024, https://www.ibisworld.com/united-states/number-of-businesses/lawn-sprinkler-installation-contractors/6488/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Housecall Pro | yes | 8 | yes | 706 / 3 / 3 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | horizontal |
| Service Fusion | yes | 8 | yes | 29 / 5 / 0 (2026-07-16) | Service Fusion | yes | 400 / 27 (2024-04-26) | yes 5 | 0 | horizontal |
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| Jobber | no (prior knowledge) | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| HindSite Software / FieldCentral | yes | 6 | yes | 4 / 4 / 0 (2026-06-22) | HindSite Software | yes | 12 / 9 (2021-10-25) | no 0 | 2 |  |
| Orderry | yes | 3 | no | 5 / 0 / 0 (2026-07-27) | Orderry | no | 10 / 3 (2025-04-11) | no 0 | 0 |  |
| Contractor+ | yes | 1 | no | 59 / 0 / 0 (2026-09-08) | Contractor Growth Network | no | 40 / 1 (2024-12-19) | yes 3 | 0 | wrong_page horizontal |
| IrrigationBossPro | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| LayCor | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Irrigation & lawn sprinkler contractors
> - Core jobs users log in for: seasonal batch scheduling (spring start-ups, fall winterizations), repair dispatch/routing by neighborhood, per-zone estimates with real equipment line items, backflow-test tracking, recurring-service rebooking, invoicing/Stripe payments, automated SMS reminders.
> - Vertical incumbents are tiny and cheap: IrrigationBossPro $129/mo flat, LayCor $49/mo, QuoteIQ from $29.99/mo, Contractor+ free/$14, HindSite/FieldCentral $277+ (founded 2001, ~29 staff). Horizontals (Jobber, Housecall Pro, ServiceTitan, Service Fusion, Orderry) all keep dedicated irrigation landing pages, so the niche is contested but at low price points.
> - Agent wedge: the seasonal turnover is the whole business. An agent that, twice a year, texts/calls every past customer, books the start-up/winterization into a route-optimized week, chases backflow-test deadlines and sends the invoice would replace most of what a $49-129/mo tool is bought for.
> - Weakest evidence: establishment count (2,425) is IBISWorld's narrow "lawn sprinkler installation" bucket; many irrigation firms are coded as landscapers. No gatekeeper or concentration search was run.

**The agent version** [hypothesis]: Spring start-up / fall winterization rebooking for the whole customer list → backflow test scheduled before the water purveyor's deadline → test report submitted → invoice. Needs: customer list, SMS, purveyor report templates/portals, calendar.

**Wedge** [hypothesis]: Seasonal rebooking plus backflow-deadline agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Contractor+: Free forever plan; paid from $14/month (https://contractorplus.app/pricing)
  - HindSite Software / FieldCentral: ~$277 to over $1,000/month across 6 tiers (1 to 20+ people) (https://www.hindsitesoftware.com/industries/irrigation-business-software)
  - IrrigationBossPro: $129/month (all-inclusive) (https://www.irrigationbosspro.com/)
  - LayCor: $49/month base; Professional $99/month (https://laycor.com/solutions/irrigation-software)
  - QuoteIQ: $29.99/month Essentials (1 user); Beginner $74.99/month; up to $399.99/month (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (tools pitch 'solo installers'; IBISWorld counts 2,425 firms). Public-price incumbents: 5. Gatekeeper: franchise-only (independents unconstrained: yes) — Conserva Irrigation features a proprietary CRM platform and field devices franchisees are expected to use; FDD-level mandate wording not found in results. Binds Conserva franchisees only; no distributor or association mandate found.. Top-4 share: unverified; statement: IBISWorld: Lawn Sprinkler Installation Contractors industry is highly fragmented with no companies holding a market share greater than 5%; 2,425 businesses (2024)..

**Evidence URLs (38):**
  - https://www.ibisworld.com/united-states/number-of-businesses/lawn-sprinkler-installation-contractors/6488/
  - https://contractorplus.app/industries/irrigation-business-software
  - https://contractorplus.app/pricing
  - https://www.capterra.com/p/213952/Contractor/ (count not in snippet)
  - https://www.hindsitesoftware.com/industries/irrigation-business-software
  - https://www.linkedin.com/company/hindsite-software ; https://www.datanyze.com/companies/hindsite-software/351080127
  - https://www.crunchbase.com/organization/hindsite-software (funding not in snippet)
  - https://www.g2.com/products/hindsite-software/reviews (count not in snippet)
  - https://www.linkedin.com/company/hindsite-software
  - https://www.housecallpro.com/industries/irrigation-business-software/
  - https://www.irrigationbosspro.com/
  - https://laycor.com/solutions/irrigation-software
  - https://orderry.com/irrigation-services-software/
  - https://myquoteiq.com/industries/irrigation-software/
  - https://myquoteiq.com/pricing/
  - https://www.capterra.com/p/10030635/QuoteIQ/ (count not in snippet)
  - https://www.servicefusion.com/irrigation-business-software
  - https://www.servicetitan.com/industries/irrigation-business-software
  - https://www.sidekickseethrough.com/brands/conserva-irrigation
  - https://www.ibisworld.com/united-states/industry/lawn-sprinkler-installation-contractors/6488/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=111717746945247
  - https://adstransparency.google.com/advertiser/AR07248650012362539009?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=357760284303174
  - https://adstransparency.google.com/advertiser/AR04520867354405502977?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=431381633653850
  - https://adstransparency.google.com/advertiser/AR17264116582418743297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=IrrigationBossPro&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183668204989264
  - https://adstransparency.google.com/advertiser/AR07389967871058640897?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=LayCor&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=907192299370160
  - https://adstransparency.google.com/advertiser/AR07787129681672667137?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=506971112706787
  - https://adstransparency.google.com/advertiser/AR01281923922538790913?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 4. Plumbing contractors  (NAICS 238220)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 13.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** FieldPulse, ServiceTitan; passing but membership unverified: Jobber, Service Fusion.
- **Boring test:** 2/3 — Dispatch, permits, flat-rate quoting, water-heater warranties.
- **US establishments:** 129000 (2026, https://www.simprogroup.com/blog/plumbing-industry-statistics-2026); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| FieldPulse | yes | 8 | yes | 120 / 41 / 0 (2026-06-24) | FieldPulse | yes | 200 / 18 (2023-11-16) | yes 10 | 0 | horizontal |
| Service Fusion | no (prior knowledge) | 8 | yes | 29 / 5 / 0 (2026-07-16) | Service Fusion | yes | 400 / 27 (2024-04-26) | yes 5 | 0 | horizontal |
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| Jobber | no (prior knowledge) | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| TurboBid | yes | 2 | no | 0 / 0 / 0 (-) | TurboBid Estimating Software | no | 0 / 0 (-) | no 0 | 2 |  |
| Business Genie | yes | 0 | no | 0 / 0 / 0 (-) | Business Genie App | no | 1 / 0 (2026-04-11) | no 0 | 0 |  |
| Flat Rate Software (flatratesoftware.com) | yes | 0 | no | 0 / 0 / 0 (-) | Flat Rate | no | 0 / 0 (-) | no 0 | 0 |  |
| NSPG Price Guide (flatratepricebook.com) | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Pipe-Pro (Professional Estimating Systems) | yes | 0 | no | 5 / 5 / 5 (2026-05-15) | Pipe Pro Plumbing | no | 0 / 0 (-) | no 0 | 0 | wrong_page |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Plumbing contractors
> - Core jobs: same FSM stack as HVAC (QuoteIQ, Service Fusion, Jobber, ServiceTitan, FieldPulse, Commusoft) plus plumbing estimating (TurboBid). Roundups emphasize replacing "four or five disconnected tools" with one system.
> - Public pricing: QuoteIQ $29.99, Jobber $169 (5 users), Service Fusion ~$195 starter, TurboBid $99, Business Genie $50-135.
> - Agent wedge: emergency-call intake and triage (after-hours booking, upfront flat-rate ballpark, dispatch) - the after-hours demand is explicitly called out in roundups.
> - Weakest evidence: no plumbing-specific concentration or franchise (Mr. Rooter / Benjamin Franklin) check completed; firm count is IBISWorld via a vendor blog.
> - Vertical-tool follow-up (2026-09-17): Plumbing contractors Found: no plumbing-only CRM/FSM surfaced in 4 searches; every "for plumbers" hit was a horizontal (excluded) or a flat-rate price-book product: TurboBid plumbing edition, Flat Rate Software (flatratesoftware.com, "FREE ... for Plumbers"), NSPG Price Guide (flatratepricebook.com, $1,799.95 one-time), Pipe-Pro (desktop pipe estimating, commercial-leaning). Confidence: low that any of these is a true vertical SaaS competitor; they are pricing/estimating adjuncts (2-3 trade). Plumbing appears to remain a horizontal-only niche; Pipeline CRM and Orcatec also had plumbing pages b

**The agent version** [hypothesis]: After-hours call/text intake → flat-rate quote → dispatch to on-call tech → permit application for water heater/repipe → warranty registration → invoice. Needs: phone/SMS, price book, permit portals, calendar.

**Wedge** [hypothesis]: Permit and warranty-registration paperwork agent for small plumbing shops.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Business Genie: $50 to $135 (3 editions) (https://www.trustradius.com/products/business-genie-app/pricing)
  - NSPG Price Guide (flatratepricebook.com): $1,799.95 (one-time, per result text) (https://flatratepricebook.com/)
  - QuoteIQ: $29.99/month (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (derived: siccode 1,028,117 employees / 88,738 NAICS 238220 companies ≈ 11.6 per firm — derived ratio, not reported). Public-price incumbents: 5. Gatekeeper: franchise-only (independents unconstrained: yes) — Mr. Rooter (Neighborly) 2026 FDD mandates ServiceTitan (dispatch/CRM), QuickBooks Online, Qvinci and ProTradeNet; $65/mo software fee. Binds franchisees only. PHCC lists ServiceTitan as a partner offering to members, not a mandate (https://marketplace.servicetitan.com/partner/phcc).. Top-4 share: unverified; statement: IBISWorld: Plumbers in the US has low market share concentration, largest is Comfort Systems USA; no single company holds more than 5%; three national plumbing brands together under 5% of the market; .

**Evidence URLs (33):**
  - https://www.simprogroup.com/blog/plumbing-industry-statistics-2026
  - https://www.businessgenieapp.com/
  - https://www.trustradius.com/products/business-genie-app/pricing
  - https://www.linkedin.com/company/businessgenieapp
  - https://www.fieldpulse.com/resources/blog/software-small-plumbing-business
  - https://www.flatratesoftware.com/flat-rate-pricing-for-software-plumbers/
  - https://flatratepricebook.com/
  - https://sourceforge.net/software/product/Pipe-Pro/
  - https://myquoteiq.com/crm-for-plumbing-business/
  - https://myquoteiq.com/pricing/
  - https://www.capterra.com/p/10030635/QuoteIQ/
  - https://www.servicetitan.com/industries/plumbing-software
  - https://www.turbobid.com/
  - https://www.turbobid.com/pages/when-we-complete-an-residential-electrical-estimate
  - https://softwareconnect.com/roundups/best-plumbing-software/
  - https://buildops.com/resources/flat-rate-pricing-software-for-electricians/
  - https://www.francloud.com/franchises/mr-rooter
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=100847741736166
  - https://adstransparency.google.com/advertiser/AR15597160687313354753?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1740011049620778
  - https://adstransparency.google.com/advertiser/AR12871690310899466241?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1092158107657451
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183668204989264
  - https://adstransparency.google.com/advertiser/AR07389967871058640897?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=NSPG%20Price%20Guide&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1139622825898072
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=506971112706787
  - https://adstransparency.google.com/advertiser/AR01281923922538790913?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=138468722905793

**Confidence:** medium-low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 5. Pressure washing & exterior cleaning  (NAICS 561790)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 13.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Housecall Pro, Service Fusion, Jobber.
- **Boring test:** 3/3 — Square-foot quoting, route scheduling, recurring commercial contracts.
- **US establishments:** 34186 (2025, https://www.ibisworld.com/united-states/number-of-businesses/pressure-washing-services/6538/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Housecall Pro | yes | 8 | yes | 706 / 3 / 3 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | horizontal |
| Service Fusion | yes | 8 | yes | 29 / 5 / 0 (2026-07-16) | Service Fusion | yes | 400 / 27 (2024-04-26) | yes 5 | 0 | horizontal |
| Jobber | yes | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| CrewNest | yes | 0 | no | 0 / 0 / 0 (-) | CrewNest | no | 0 / 0 (-) | no 0 | 0 |  |
| MakeWash | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Markate | yes | 0 | no | 0 / 0 / 0 (-) | Markate | no | 6 / 0 (2025-07-21) | no 0 | 0 |  |
| PowerWashOffice | yes | 0 | no | 0 / 0 / 0 (-) | PowerwashOffice | no | 0 / 0 (-) | no 0 | 0 |  |
| Pressure Washing Calculator (Hero Softwash) | yes | 0 | no | 0 / 0 / 0 (-) | Pressure Washing | no | 0 / 0 (-) | no 0 | 0 |  |
| ResponsiBid | yes | 0 | no | 0 / 0 / 0 (-) | ResponsiBid | no | 1 / 0 (2026-05-18) | no 0 | 0 |  |
| SatQuote | yes | 0 | no | 0 / 0 / 0 (-) | SatQuote | no | 1 / 1 (2025-02-17) | no 0 | 0 |  |
| WorkQuote | yes | 0 | no | 0 / 0 / 0 (-) | WorkQuote: The All-in-One App for Your Service Business | no | 1 / 0 (2026-05-05) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Pressure washing & exterior cleaning
> - Core jobs: square-footage measurement from satellite imagery (QuoteIQ MapMeasure Pro), chemical mix calculators, instant online quotes and booking tied to the website (PowerWashOffice), automated review requests, follow-up sequences (ResponsiBid), invoicing/payments.
> - Incumbents: QuoteIQ ($29.99-$699, bootstrapped, founded 2023, hiked prices 75% in 2026), PowerWashOffice (free/$30), MakeWash (free at launch, $49 planned), CrewNest, Markate, ResponsiBid ($179), plus Jobber/Housecall Pro/Service Fusion dedicated landing pages.
> - Agent wedge: address-in, priced-quote-out. Exterior cleaning is priced almost entirely by measurable surface area, so an agent that measures the property, quotes, books, and follows up by text replaces the quoting tool and the CRM at once. QuoteIQ's recent price hikes leave a cheap-tier gap.
> - Weakest evidence: none of the pressure-washing-only tools (MakeWash, PowerWashOffice, CrewNest, Markate) have headcount, founding year, or review counts captured; concentration unverified.
> - Vertical-tool follow-up (2026-09-17): Pressure washing & exterior cleaning Found: ResponsiBid (responsibid.com, instant-quote/sales automation for pressure washing, soft washing, window & gutter cleaning; founded 2008 by a window cleaner; ~$179/mo + setup per search summary), SatQuote (satellite measuring w/ pressure-washing page, from ~$12.50-$22/mo), WorkQuote (freemium estimating app w/ pressure-washing page), CrewNest (pressure-washing CRM page), Hero Softwash calculator (UK, free). Confidence: ResponsiBid is high-confidence vertical for exterior cleaning (quoting layer, not full FSM). SatQuote medium (exterior-services quotin

**The agent version** [hypothesis]: Address in → surface area measured → instant quote → booking → review request and follow-up sequence. Needs: satellite measurement, SMS/email, calendar, payments.

**Wedge** [hypothesis]: Address-in, priced-quote-out agent for house/roof/driveway washing.

**Price ceiling:** incumbent public prices found [search-cited]:
  - MakeWash: free during launch; planned $49/mo (https://makewash.com/blog/best-pressure-washing-software-2026)
  - PowerWashOffice: free Owner Operator plan; Teams $30/mo; add-ons $65/mo (CRM, WordPress/API) per https://www.guideflow.com/blog/pressure-washing-software (https://powerwash.software/)
  - Pressure Washing Calculator (Hero Softwash): Free (per page title) (https://www.herosoftwash.co.uk/pressure-washing-pricing-calculator)
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - ResponsiBid: $179/mo Follow-up+Quoting; Ultimate $199; Powerhouse Bundle $229 (https://www.selecthub.com/p/pricing-software/responsibid/)
  - SatQuote: $12.50/mo (SatMeasure) per crewkithq/cleansavannah results; Capterra summary cites $22/mo Map Basic (https://www.capterra.com/p/276207/SatQuote/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (solo operators and small crews). Public-price incumbents: 4. Gatekeeper: franchise-only (independents unconstrained: yes) — Window Genie (Neighborly) uses a corporate-mandated tech stack: Jobber at franchisee level, ServiceTitan at larger locations, QuickBooks Online; FDD discloses $340-$580/mo software spend. Binds franchisees only. PWNA vendor directory lists business software vendors but PWNA does not certify or endorse a software partner (https://www.pwna.org/vendo. Top-4 share: unverified; statement: IBISWorld: Pressure Washing Services industry is highly fragmented with no companies holding a market share greater than 5%; 34,186 enterprises (2025)..

**Evidence URLs (42):**
  - https://www.ibisworld.com/united-states/number-of-businesses/pressure-washing-services/6538/
  - https://www.crewnest.app/pressure-washing-crm
  - https://www.housecallpro.com/industries/pressure-washing-software/
  - https://www.getjobber.com/industries/pressure-washing-software/
  - https://makewash.com/blog/best-pressure-washing-software-2026
  - https://buildonauto.com/blog/best-crm-for-pressure-washing/
  - https://powerwash.software/
  - https://apps.apple.com/us/app/pressure-washing-calculator/id6449967793
  - https://www.herosoftwash.co.uk/pressure-washing-pricing-calculator
  - https://myquoteiq.com/crm-for-pressure-washing-business/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://responsibid.com/
  - https://www.selecthub.com/p/pricing-software/responsibid/
  - https://www.capterra.com/p/175241/ResponsiBid/
  - https://satquote.com/industries/pressure-washing/
  - https://www.capterra.com/p/276207/SatQuote/
  - https://www.servicefusion.com/pressure-wash-business-software
  - https://workquote.app/industries/pressure-washing-service
  - https://pulserevops.com/tech-stacks/tk0323
  - https://www.ibisworld.com/united-states/industry/pressure-washing-services/6538/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1077834518736416
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=431381633653850
  - https://adstransparency.google.com/advertiser/AR17264116582418743297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183668204989264
  - https://adstransparency.google.com/advertiser/AR07389967871058640897?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=MakeWash&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1667913463426240
  - https://adstransparency.google.com/advertiser/AR04364797743336521729?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=103567809370921
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=277058505481707
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=175247412493060
  - https://adstransparency.google.com/advertiser/AR12811532525050527745?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=104188275783524
  - https://adstransparency.google.com/advertiser/AR06448204035513122817?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=506971112706787
  - https://adstransparency.google.com/advertiser/AR01281923922538790913?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=211311998732317
  - https://adstransparency.google.com/advertiser/AR10989223771608449025?region=US

**Confidence:** medium-low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 6. Appliance repair  (NAICS 811412)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (follow-up slice0).
- **Method score:** 13.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Housecall Pro, ServiceTitan.
- **Boring test:** 3/3 — Dispatch, parts ordering, manufacturer warranty claims.
- **US establishments:** 5,380 establishments (2020 Census); 13,535 companies (siccode); 37,769 businesses (IBISWorld-derived, 2025) (2020, https://www.insurancexdate.com/naics/811412); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Housecall Pro | yes | 8 | yes | 706 / 3 / 3 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | horizontal |
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| Method:Field Services | yes | 3 | no | unverified (throttled run) | - | no | 200 / 21 (2023-02-27) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Rossware ServiceDesk | yes | 2 | no | unverified (throttled run) | Rossware | no | 1 / 1 (2025-01-31) | no 0 | 2 |  |
| Repair-CRM | yes | 0 | no | 0 / 0 / 0 (-) | Repair-CRM | no | 0 / 0 (-) | no 0 | 0 |  |
| ServiceWorks | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> — Appliance repair (NAICS 811412)
> - Incumbent jobs: dispatch intake from ServiceBench/ServicePower, diagnose-order-return scheduling, parts ordering from Marcone/Encompass, warranty claim filing, invoicing (Rossware ServiceDesk); generic scheduling/dispatch/invoicing (Repair-CRM, QuoteIQ, Housecall Pro, ServiceTitan, Method, ServiceWorks).
> - AaaS wedge: "booking-and-parts agent": answers the phone/web form, collects model + symptom, books the diagnostic, orders the likely part before the return visit, files the warranty claim. Rossware's $6,000 desktop license and 1–10 staff show a sticky but dated incumbent to displace.
> - Weakest evidence: establishment counts conflict (5,380 / 13,535 / 37,769); Rossware and Repair-CRM headcounts from ZoomInfo/Tracxn only; ServiceBench/ServicePower are a partial channel gatekeeper for warranty work.
> - Searches (9): NAICS count; best appliance repair software 2026; ServiceDesk/Rossware/ServicePower; pricing per technician; Rossware pricing; Repair-CRM company; IBISWorld concentration; Housecall Pro landing; Rossware employees.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (IBISWorld: 'overwhelming majority owner-operated with one or two trucks'). Public-price incumbents: 4. Gatekeeper: no for retail/COD work; partial for warranty work (ServiceBench and ServicePower dispatch networks route manufacturer/home-warranty jobs, but do not mandate the shop's own software). Top-4 share: highly fragmented, no company >5%; top four <40% of revenue (IBISWorld Appliance Repair in the US).

**Evidence URLs (28):**
  - https://www.insurancexdate.com/naics/811412
  - https://www.housecallpro.com/industries/appliance-repair-software/
  - https://www.housecallpro.com/pricing/
  - https://www.method.me/resources/best-appliance-repair-software/
  - https://myquoteiq.com/top-10-best-scheduling-software-for-appliance-repair-businesses-in-2026/
  - https://myquoteiq.com/about-us/
  - https://www.repair-crm.com/2026/09/02/appliance-repair-software-the-2026-guide-for-small-shops/
  - https://tracxn.com/d/companies/repaircrm/__VyDCM_W33zyJumUydkWyH2SaXZGuN8rPBORyHEGKYBs
  - https://www.rossware.com/
  - https://rossware.net/PriceList.htm
  - https://www.zoominfo.com/c/rossware-computing-inc/346939366
  - https://www.servicetitan.com/industries/appliance-repair-software
  - https://www.cleansavannah.com/post/best-appliance-repair-software-2026
  - https://service.works/Appliance-repair-software.html
  - https://www.servicepower.com/blog/appliance-repair-scheduling-software
  - https://www.ibisworld.com/united-states/industry/appliance-repair/1710/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=431381633653850
  - https://adstransparency.google.com/advertiser/AR17264116582418743297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Method%3AField%20Services&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR09243979642128302081?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=821421364649220
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=140956949284498
  - https://adstransparency.google.com/advertiser/AR10327935336444854273?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=ServiceWorks&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc

**Confidence:** medium-low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 7. Air duct & dryer vent cleaning  (NAICS 561790)

- **Status:** QUALIFIED. Research: searched (follow-up slice5).
- **Method score:** 13.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Service Fusion, ServiceTitan, Vonigo.
- **Rescrape queued (Meta undersampled):** Workiz.
- **Boring test:** 3/3 — Quotes, route scheduling, NADCA paperwork.
- **US establishments:** 16,597 establishments (2020, https://www.insurancexdate.com/naics/561790); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Service Fusion | yes | 8 | yes | 29 / 5 / 0 (2026-07-16) | Service Fusion | yes | 400 / 27 (2024-04-26) | yes 5 | 0 | horizontal |
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| Vonigo | yes | 6 | yes | 0 / 0 / 0 (-) | Vonigo | no | 77 / 5 (2024-12-22) | yes 3 | 2 |  |
| Workiz | yes | 3 | no | 110 / 0 / 0 (2026-08-09) | Workiz | no | 500 / 20 (2025-10-17) | no 0 | 0 | undersampled horizontal |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| ManageMart | yes | 0 | no | 0 / 0 / 0 (-) | Managemart | no | 0 / 0 (-) | no 0 | 0 |  |
| SetTime | yes | 0 | no | 0 / 0 / 0 (-) | Set Time | no | 0 / 0 (-) | no 0 | 0 |  |
| Upper | yes | 0 | no | 0 / 0 / 0 (-) | Upper | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Air duct & dryer vent cleaning (NAICS 561790)
> - Incumbents' jobs: scheduling/dispatch of crews, estimates with before/after photos, invoicing and card payments, recurring-service reminders, review requests (Workiz, Service Fusion, Vonigo, ServiceTitan, QuoteIQ, Upper, ManageMart, SetTime; QuoteIQ and Vonigo have air-duct pages, the rest are horizontal FSMs with dedicated landings).
> - Wedge: an agent that answers inbound calls/texts, quotes from square footage and vent count, books the slot, sends the NADCA-style photo report and chases the recurring dryer-vent reminder, replacing the $65-$300/mo FSM seat for one- and two-truck shops.
> - Weakest evidence: establishment count is the whole NAICS 561790 (16,597 in 2020), not duct cleaners; concentration relies on a market-report phrase; QuoteIQ's self-funded status is from a result summary with uncertain attribution.
> - Searches: NAICS count; "air duct cleaning" software; best air duct software 2026; dryer vent franchise/NADCA concentration; QuoteIQ pricing; Workiz pricing/funding; Vonigo pricing/employees; ManageMart/Service Fusion pricing.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (single-truck to multi-truck duct cleaners; franchisees of Dryer Vent Wizard/DUCTZ are a minority). Public-price incumbents: 4. Gatekeeper: no. Top-4 share: unverified.

**Evidence URLs (33):**
  - https://www.insurancexdate.com/naics/561790
  - https://www.managemart.com/air-duct-cleaning
  - https://www.selecthub.com/p/field-service-software/managemart/
  - https://myquoteiq.com/top-8-softwares-for-air-duct-cleaning-in-2026/
  - https://myquoteiq.com/pricing/
  - https://contractortoolstack.com/software/quoteiq/pricing/
  - https://www.servicefusion.com/air-duct-cleaning-service-software
  - https://www.servicefusion.com/pricing
  - https://www.servicetitan.com/industries/air-duct-cleaning-software
  - https://settime.io/industries/cleaning/air-duct-cleaning-scheduling-software
  - https://www.upperinc.com/businesses/air-duct-cleaning-service-routing-and-optimization-app-software/
  - https://www.vonigo.com/industry/air-duct-cleaning-software/
  - https://getlatka.com/companies/vonigo
  - https://app.dealroom.co/companies/vonigo
  - https://ca.linkedin.com/company/vonigo
  - https://www.workiz.com/industries/air-duct-cleaning/
  - https://www.workiz.com/pricing-plans/
  - https://www.crunchbase.com/funding_round/workiz-series-c--7e2538ac
  - https://nadca.com/resources
  - https://www.datainsightsmarket.com/reports/dryer-vent-cleaning-services-1415095
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=104187944871222
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=506971112706787
  - https://adstransparency.google.com/advertiser/AR01281923922538790913?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=103200268477976
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=113494264162127
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=143117979081715
  - https://adstransparency.google.com/advertiser/AR17980938755741057025?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=275323565950008
  - https://adstransparency.google.com/advertiser/AR18044909407396954113?region=US

**Confidence:** medium-low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 8. Garage door installers & repair  (NAICS 238290)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 12.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** FieldPulse, ServiceTitan, Jobber.
- **Rescrape queued (Meta undersampled):** Workiz.
- **Boring test:** 3/3 — Service calls, spring/opener parts, warranty paperwork.
- **US establishments:** 299 businesses (IBISWorld Garage Door Installation in the US) - IBISWorld definition appears narrow (2025, https://www.ibisworld.com/industry-statistics/number-of-businesses/garage-door-installation-united-states/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| FieldPulse | yes | 8 | yes | 120 / 41 / 0 (2026-06-24) | FieldPulse | yes | 200 / 18 (2023-11-16) | yes 10 | 0 | horizontal |
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| Jobber | yes | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| ServiceBridge | yes | 3 | no | 0 / 0 / 0 (-) | Service Bridge | no | 41 / 23 (2025-08-22) | no 0 | 0 |  |
| Workiz | yes | 3 | no | 110 / 0 / 0 (2026-08-09) | Workiz | no | 500 / 20 (2025-10-17) | no 0 | 0 | undersampled horizontal |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Contractor+ | yes | 1 | no | 59 / 0 / 0 (2026-09-08) | Contractor Growth Network | no | 40 / 1 (2024-12-19) | yes 3 | 0 | wrong_page horizontal |
| Garage Door OS | yes | 1 | no | 95 / 0 / 0 (2026-08-20) | Garage | yes | 0 / 0 (-) | no 0 | 0 | wrong_page |
| Insite4Doors | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Service Pro (MSI Data) - garage door | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 19 / 0 (2025-07-02) | no 0 | 0 |  |
| Smart Service | yes | 0 | no | 0 / 0 / 0 (-) | Smart Service | no | 0 / 0 (-) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Garage door installers & repair (238290)
> - Core jobs: same-day emergency dispatch, technician GPS and skill-based assignment, door/opener serial history on the work order, flat-rate pricing libraries, on-site payment (ServiceBridge, Smart Service, Workiz, FieldPulse, ServiceTitan).
> - Wedge: no vertical SaaS exists; every incumbent is a horizontal FSM with a landing page. An inbound-call-to-booked-job agent that quotes spring/opener repairs from a flat-rate book and books the tech is the opening.
> - Weakest evidence: IBISWorld's 299-business count and "high concentration" claim clearly describe a narrow definition and conflict with the long tail of local shops; no vendor pricing beyond QuoteIQ/Jobber; no headcounts.
> - Vertical-tool follow-up (2026-09-17): Garage door installers & repair Found: Garage Door OS (garagedooros.com, "Garage Door Business Management Software | Quote Builder & Scheduling", free trial, pricing not shown), Insite4Doors (insite4doors.com, "Software for The Garage Door Industry"), Service Pro/MSI Data garage-door page (enterprise), Contractor+ garage-door page (horizontal). SuccessWare21 was mentioned in a result but with no URL, so not recorded. Confidence: Garage Door OS and Insite4Doors are high-confidence vertical by name/homepage; both lack visible pricing/founding data and may be small or legacy. Service Pro and Cont

**The agent version** [hypothesis]: Service-call intake → part identified from photo (spring/opener) → quote → schedule → warranty claim to manufacturer → invoice. Needs: phone/SMS, parts catalog, OEM warranty portals.

**Wedge** [hypothesis]: Warranty-claim and quote agent for garage door service.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (dispatch-driven local shops; enterprise tier only for 20+ tech operations). Public-price incumbents: 2. Gatekeeper: franchise-only (independents unconstrained: yes) — Precision Door Service 2026 FDD mandates the PDS System and ProTradeNet; technology package includes ServiceTitan, Qvinci, FranConnect, Neighborly portal, Office 365; software purchasing controlled at corporate level for 147 franchised locations. ProLift Garage Doors FDD also lists ServiceTitan as required (https://www.francloud.com/franchises/pro. Top-4 share: unverified; statement: CONFLICTING: IBISWorld says Garage Door Installation in the US has HIGH market share concentration, largest is Sanwa Holdings (Overhead Door) with Precision Door Service second; CT Acquisitions says m.

**Evidence URLs (37):**
  - https://www.ibisworld.com/industry-statistics/number-of-businesses/garage-door-installation-united-states/
  - https://contractorplus.app/industries/garage-door-software
  - https://www.fieldpulse.com/solutions/garage-door
  - https://garagedooros.com/
  - https://insite4doors.com/garage-door-business-software/
  - https://www.getjobber.com/industries/garage-door-software/
  - https://myquoteiq.com/top-10-crms-for-garage-door-businesses-in-2026/
  - https://myquoteiq.com/pricing/
  - https://tracxn.com/d/companies/quoteiq/__baJVvCxQIOKFcjFDrIKoaTAs0SGEG9HCkMNvWwcyViU
  - https://bootstrappers.com/mike-vida-quoteiq/
  - https://contractortoolstack.com/software/quoteiq/
  - https://www.msidata.com/industries/garage-door/
  - https://servicebridge.com/garage-door-dispatch-software/
  - https://www.servicetitan.com/industries/garage-door-software
  - https://www.smartservice.com/industry/garage-door-software
  - https://www.workiz.com/industries/garage-door/
  - https://www.francloud.com/franchises/precision-door-service
  - https://www.ibisworld.com/united-states/industry/garage-door-installation/4855/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=111717746945247
  - https://adstransparency.google.com/advertiser/AR07248650012362539009?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1740011049620778
  - https://adstransparency.google.com/advertiser/AR12871690310899466241?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=60620847134
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Insite4Doors&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183668204989264
  - https://adstransparency.google.com/advertiser/AR07389967871058640897?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Service%20Pro%20-%20garage%20door&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR14238317877642919937?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1012377458630124
  - https://adstransparency.google.com/advertiser/AR09598966823810760705?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=119199734449082
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=275323565950008
  - https://adstransparency.google.com/advertiser/AR18044909407396954113?region=US

**Confidence:** medium-low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 9. Locksmiths  (NAICS 561622)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (follow-up slice2).
- **Method score:** 12.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** FieldPulse, Housecall Pro, Service Fusion, ServiceTitan.
- **Rescrape queued (Meta undersampled):** Workiz.
- **Boring test:** 3/3 — Dispatch, key/code records, invoicing.
- **US establishments:** 4,030 establishments (3,952 businesses); also 8,316 active companies per SICCODE; IBISWorld 29,620 businesses (2026) (2020, https://naicslist.com/naics/561622); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| FieldPulse | yes | 8 | yes | 120 / 41 / 0 (2026-06-24) | FieldPulse | yes | 200 / 18 (2023-11-16) | yes 10 | 0 | horizontal |
| Housecall Pro | yes | 8 | yes | 706 / 3 / 3 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | horizontal |
| Service Fusion | yes | 8 | yes | 29 / 5 / 0 (2026-07-16) | Service Fusion | yes | 400 / 27 (2024-04-26) | yes 5 | 0 | horizontal |
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| FieldEdge | yes | 3 | no | 1 / 0 / 0 (2026-08-31) | FieldEdge by Xplor | no | 44 / 9 (2021-10-25) | no 0 | 0 | horizontal |
| Workiz | yes | 3 | no | 110 / 0 / 0 (2026-08-09) | Workiz | no | 500 / 20 (2025-10-17) | no 0 | 0 | undersampled horizontal |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| TEN4 (Nexent Innovation) | yes | 1 | no | 0 / 0 / 0 (-) | TEN 4 | no | 13 / 0 (2025-06-02) | yes 2 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Locksmiths (NAICS 561622)
> - Incumbent jobs: Workiz (call tracking, dispatch, invoicing), FieldPulse/TEN4/ServiceTitan/HCP/FieldEdge/Service Fusion (scheduling, dispatch, quotes, inventory). Phone-heavy emergency work; median shop 1-3 employees.
> - Agent wedge: 24/7 call-answering + dispatch agent that quotes lockout/rekey jobs from a price book, texts ETA, and closes the invoice; Workiz's $187+/mo tiers leave room under $100/mo.
> - Weakest evidence: only Workiz and QuoteIQ show public prices; TEN4 pricing page exists but no figure surfaced; establishment counts range 4,030 (Census 2020) to 29,620 (IBISWorld, likely incl. nonemployers).
> - Searches (8): NAICS count; "locksmith" business software; best locksmith software 2026; dispatch/invoicing; Workiz pricing; TEN4 pricing; Workiz crunchbase; IBISWorld/ALOA concentration; FieldPulse pricing.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (median shop 1-3 employees). Public-price incumbents: 2. Gatekeeper: no (ALOA is a trade association; no software mandate seen). Top-4 share: no company >5%; ten largest chains <8% of revenue.

**Evidence URLs (32):**
  - https://naicslist.com/naics/561622
  - https://fieldedge.com/locksmith-software/
  - https://www.fieldpulse.com/solutions/locksmith
  - https://www.fieldpulse.com/pricing
  - https://contractortoolstack.com/software/fieldpulse/
  - https://www.housecallpro.com/industries/locksmith-software/
  - https://myquoteiq.com/top-10-locksmith-field-service-software-in-2026/
  - https://myquoteiq.com/about-us/
  - https://www.servicefusion.com/locksmith-software
  - https://www.servicetitan.com/industries/locksmith-software
  - https://ten4soft.com/industries/locksmith-software/
  - https://ten4soft.com/pricing/
  - https://www.workiz.com/industries/locksmiths/
  - https://www.workiz.com/pricing-plans/
  - https://www.crunchbase.com/organization/workiz
  - https://www.ibisworld.com/united-states/industry/locksmiths/4833/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=123302194386063
  - https://adstransparency.google.com/advertiser/AR01165979373417791489?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1740011049620778
  - https://adstransparency.google.com/advertiser/AR12871690310899466241?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=431381633653850
  - https://adstransparency.google.com/advertiser/AR17264116582418743297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=506971112706787
  - https://adstransparency.google.com/advertiser/AR01281923922538790913?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=575233089303209
  - https://adstransparency.google.com/advertiser/AR01895898791811219457?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=275323565950008
  - https://adstransparency.google.com/advertiser/AR18044909407396954113?region=US

**Confidence:** medium-low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 10. Epoxy & garage floor coating contractors  (NAICS 238330)

- **Status:** QUALIFIED. Research: searched (follow-up slice0).
- **Method score:** 11.5 = ad score 6.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** DripJobs, Builder Prime.
- **Boring test:** 3/3 — Square-foot quotes, cure-time scheduling, one-day installs.
- **US establishments:** 13,108 companies (NAICS 238330 flooring contractors, broader than epoxy) (unverified, https://siccode.com/naics-code/238330/flooring-contractors); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| DripJobs | yes | 7 | yes | 120 / 9 / 8 (2026-05-05) | DripJobs | yes | 78 / 9 (2024-02-22) | no 0 | 0 |  |
| Builder Prime | yes | 6 | yes | 8 / 6 / 0 (2026-06-22) | Builder Prime | no | 26 / 21 (2025-02-21) | no 0 | 0 |  |
| Projul | yes | 3 | no | 3 / 3 / 0 (2026-06-22) | Projul | yes | 3 / 1 (2023-02-14) | no 0 | 2 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Coating Pro Tech | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| CoatingOS | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| floorWIZ | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 5 / 2 (2025-01-10) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> — Epoxy & garage floor coating contractors (NAICS 238330)
> - Incumbent jobs: per-square-foot Good/Better/Best estimates, satellite floor measurement, AI before/after visualizers, follow-up drips, scheduling, invoicing, job costing (QuoteIQ, CoatingOS, DripJobs, Coating Pro Tech, Builder Prime).
> - AaaS wedge: "quote-and-close agent" that turns a photo + address into a tiered epoxy/polyaspartic proposal with a visualizer render, then runs the follow-up sequence until signed. Owner-operators already pay $30–$150/mo for exactly this workflow.
> - Weakest evidence: no epoxy-specific establishment count (siccode 13,108 is all flooring contractors); CoatingOS/Coating Pro Tech pricing and headcounts not public; QuoteIQ headcount unverified (self-funded claim from its own about page). Concentration statement is a proxy (all flooring installers).
> - Searches (10): NAICS count; "epoxy flooring" contractor software; best garage floor coating business software 2026; epoxy CRM estimating; CoatingOS pricing; DripJobs pricing/founded; QuoteIQ crunchbase; franchise required software; IBISWorld concentration; concrete-coating contractor count; Coating Pro Tech pricing; Builder Prime pricing.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (one- to few-crew coating contractors; vendors price $30-$150/mo with no per-user fees). Public-price incumbents: 3. Gatekeeper: no (franchisors only: GarageExperts requires ServiceMinder; Garage Force uses proprietary CRM; franchises are a minority of installers). Top-4 share: no company >5% (IBISWorld Flooring Installation Services, proxy); installer level 'fragmented' (Ken Research US concrete floor coatings).

**Evidence URLs (28):**
  - https://siccode.com/naics-code/238330/flooring-contractors
  - https://www.builderprime.com/industries/flooring
  - https://www.builderprime.com/pricing
  - https://softwarefinder.com/construction/builderprime
  - https://coatingprotech.com/
  - https://www.coatingos.com/software/epoxy-contractor-software
  - https://dripjobs.com/epoxy-business-crm
  - https://dripjobs.com/pricing
  - https://dripjobs.com/about
  - https://projul.com/industries/flooring-contractor/
  - https://myquoteiq.com/industries/epoxy-flooring-software/
  - https://myquoteiq.com/epoxy-garage-floor-coating-companies-crm/
  - https://myquoteiq.com/about-us/
  - https://floor-wiz.com/
  - https://www.prnewswire.com/news-releases/garageexperts-unveils-4-new-technology-platforms-to-elevate-franchisee-success-and-customer-experience-302436048.html
  - https://www.ibisworld.com/united-states/industry/flooring-installation-services/196/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1829807557257902
  - https://adstransparency.google.com/advertiser/AR14135757271249977345?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Coating%20Pro%20Tech&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=CoatingOS&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=2143682922612985
  - https://adstransparency.google.com/advertiser/AR12080640021686648833?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=2146347565625894
  - https://adstransparency.google.com/advertiser/AR15154333676306694145?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=floorWIZ&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR09041574626789949441?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 11. Lawn care & landscape maintenance  (NAICS 561730)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 11.0 = ad score 7.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** ServiceTitan, HindSite Software / FieldCentral.
- **Boring test:** 3/3 — Weekly routes, per-visit invoicing, seasonal contracts.
- **US establishments:** 692777 (2025, https://www.ibisworld.com/united-states/number-of-businesses/landscaping-services/1497/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| HindSite Software / FieldCentral | yes | 6 | yes | 4 / 4 / 0 (2026-06-22) | HindSite Software | yes | 12 / 9 (2021-10-25) | no 0 | 2 |  |
| Service Autopilot | yes | 3 | no | 0 / 0 / 0 (-) | Service Autopilot by Xplor | no | 25 / 16 (2023-07-28) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| LMN (Landscape Management Network) | yes | 1 | no | 7 / 0 / 0 (2026-07-23) | - | yes | 4 / 0 (2025-05-08) | no 0 | 0 |  |
| RealGreen by WorkWave | yes |  | unverified | 0 / 0 / 0 (-) | - | no | unverified (host blocked) / unverified (host blocked) (-) | unverified (host blocked)  | 0 |  |
| Yardbook | yes | 0 | no | 0 / 0 / 0 (-) | Yardbook | no | 37 / 0 (2026-04-02) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Lawn care & landscape maintenance
> - Core jobs: recurring-visit scheduling (weekly/biweekly), route optimization, quoting from property measurement, invoicing and auto-billing, job costing/budgeting for construction (LMN), automations on job/invoice events (Service Autopilot), chemical tracking (Yardbook paid tier).
> - Incumbents: Service Autopilot ($49/mo + $97 setup, Xplor-owned, 90 staff), RealGreen (WorkWave/PE, quote-based), LMN ($297/mo, now under SingleOps), Yardbook (free tier, Phoenix), FieldCentral ($49.97/user + $103.97 base), QuoteIQ, ServiceTitan lawn landing page.
> - Agent wedge: the market is enormous (692,777 firms, typical 2-3 employees) and the largest cohort is on free/cheap tools or none; an agent that handles inbound quote requests, recurring schedule/route generation, and payment chasing via text could sit below Yardbook's paid tier. Consolidation (WorkWave, Xplor, Granum) is pushing prices up on the mid-tier, which opens the low end.
> - Weakest evidence: share of firms under 20 employees not captured from Census; concentration statement comes from a Lawnstarter blog citing IBISWorld/NALP rather than a primary snippet.

**The agent version** [hypothesis]: Inbound lead → priced recurring-service proposal → schedule slot on the existing route → auto-invoice after each visit → chase late payers by text. Needs: SMS/email, property-measurement source (satellite or the incumbent's measurement API), calendar, Stripe/QuickBooks. Done = a signed recurring agreement on the calendar with card on file.

**Wedge** [hypothesis]: Quote-and-book agent for mowing/maintenance leads (address in, signed recurring proposal out).

**Price ceiling:** incumbent public prices found [search-cited]:
  - HindSite Software / FieldCentral: $49.97/user/mo + $103.97/mo base (per https://www.capterra.com/p/10020754/FieldCentral/); 6 tiers ~$277 to $1000+/mo (https://www.fieldcentral.com/pricing)
  - LMN (Landscape Management Network): $297/mo Starter (1 office + 5 crew licenses); Professional $598/mo; implementation $847 (https://golmn.com/pricing/)
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - RealGreen by WorkWave: ~$199/mo (third-party estimate, https://softwarefinder.com/fleet-management-software/realgreen-by-workwave) (https://www.realgreen.com/pricing)
  - Service Autopilot: $49/mo Startup + $97 sign-up fee; Pro $199; Pro Plus $499; Elite custom (per https://fervorstudio.ca/news/service-autopilot-review-pricing-alternatives/) (https://www.capterra.com/p/122075/Service-Autopilot/pricing/)
  - Yardbook: $0/mo Starter (free indefinitely); paid $15-60/mo (https://fieldtics.com/blog/yardbook-review) (https://www.capterra.com/p/207272/Yardbook/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (typical firm 2-3 employees per Lawnstarter). Public-price incumbents: 4. Gatekeeper: franchise-only (independents unconstrained: yes) — Lawn Doctor FDD: franchisees must license the Lawn Care Management Software Suite (Service Assistant, Routing Assistant, Customer Assistant Website, Mobile Live) and use QuickBooks Online. Weed Man: proprietary computer system developed exclusively for Weed Man (https://weedmanfranchise.com/About/Our-System); a specific FDD software fee was not fo. Top-4 share: unverified; statement: IBISWorld: Landscaping Services in the US has low market share concentration; BrightView Holdings is the largest company; share percentage not stated in results..

**Evidence URLs (37):**
  - https://www.ibisworld.com/united-states/number-of-businesses/landscaping-services/1497/
  - https://www.hindsitesoftware.com/lawn-care-hindsite-software
  - https://www.fieldcentral.com/pricing
  - https://www.fieldcentral.com/fieldcentral
  - https://www.capterra.com/p/10020754/FieldCentral/
  - https://golmn.com/pricing/
  - https://tracxn.com/d/companies/singleops/__wpGjZc-FoFtwDsALEMuFrBrrabFaDIuhque36M33rDk
  - https://www.capterra.com/p/142064/LMN/
  - https://myquoteiq.com/top-10-best-scheduling-software-for-lawn-care-businesses-in-2026/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://www.realgreen.com/blog/best-lawn-care-software-2026
  - https://www.realgreen.com/pricing
  - https://www.workwave.com/newsroom/workwave-acquires-real-green-systems
  - https://www.g2.com/products/realgreen-by-workwave/reviews
  - https://www.capterra.com/p/122075/Service-Autopilot/
  - https://www.capterra.com/p/122075/Service-Autopilot/pricing/
  - https://xplorpay.com/insights/clearent-acquires-controlling-interest-in-green-industry-field-services-management-saas-business-service-autopilot/
  - https://www.servicetitan.com/industries/lawn-care-software
  - https://www.softwareadvice.com/landscaping/yardbook-profile/
  - https://www.capterra.com/p/207272/Yardbook/
  - https://franchiseoverview.com/company/lawn-doctor
  - https://www.ibisworld.com/united-states/industry/landscaping-services/1497/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=357760284303174
  - https://adstransparency.google.com/advertiser/AR04520867354405502977?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=LMN&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR08759083443637190657?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=RealGreen%20by%20WorkWave&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=85289916525
  - https://adstransparency.google.com/advertiser/AR01165979373417791489?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=470730253043212
  - https://adstransparency.google.com/advertiser/AR14036505301503442945?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 12. Residential painting contractors  (NAICS 238320)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 11.0 = ad score 7.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** DripJobs, PaintScout.
- **Boring test:** 3/3 — Square-foot estimating, crew scheduling, lead-paint (RRP) paperwork.
- **US establishments:** 219,542 businesses (IBISWorld Painting & Wall Covering Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/painters/187/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| DripJobs | yes | 7 | yes | 120 / 9 / 8 (2026-05-05) | DripJobs | yes | 78 / 9 (2024-02-22) | no 0 | 0 |  |
| PaintScout | yes | 7 | yes | 6 / 5 / 1 (2025-10-05) | PaintScout | yes | 56 / 20 (2024-12-05) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Clientility | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Estimate Rocket | yes | 0 | no | 0 / 0 / 0 (-) | Estimate Rocket | no | 27 / 0 (2023-07-11) | no 0 | 0 |  |
| PaintForce Painting Estimator | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| PaintPricing | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Painting Contractor Estimates (iOS app) | yes | 0 | no | 0 / 0 / 0 (-) | Painting contractor | no | 0 / 0 (-) | no 0 | 0 |  |
| Werx (painting) | yes | 0 | no | 0 / 0 / 0 (-) | WERX | no | 36 / 0 (2024-07-31) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Residential painting contractors (238320)
> - Core jobs: room-by-room production-rate estimating (PaintScout), automated lead follow-up / drip sequences and proposals (DripJobs), paint-quantity calculators and Good/Better/Best options (QuoteIQ), scheduling, invoicing, job costing.
> - Wedge: PaintScout is estimating-only and DripJobs is follow-up-first, so an agent that runs the whole quote-to-booked-job loop (photo walkthrough to estimate to follow-up to schedule) at a solo-painter price point is credible; three incumbents with public prices show buyers pay $30-$150/mo.
> - Weakest evidence: PaintScout pricing conflicts across roundups ($79-$99 vs $119 + $99); PaintScout/Bolster ownership and headcount unverified; painting franchisors' mandated CRMs not searched.
> - Vertical-tool follow-up (2026-09-17): Residential painting contractors (third vertical beyond DripJobs/PaintScout) Found: Estimate Rocket (estimaterocket.com/painting, by Logical Engine, founded 2013 Newburyport MA, from $139/mo, APC/PCA painting-industry partnerships), PaintForce Painting Estimator (App Store, "built specifically for painting contractors"), PaintPricing (paintpricing.com, free painting estimate app w/ paid tiers), Painting Contractor Estimates (one-time iOS app), Werx painting page (horizontal, $49/mo). Confidence: Estimate Rocket is the best third vertical - medium-high (painting is its flagship vertical, but si

**The agent version** [hypothesis]: Room/exterior photos + sq ft → estimate with paint/labor takeoff → schedule crew → RRP lead-paint documentation for pre-1978 homes → invoice. Needs: photo intake, estimating rules, EPA RRP checklist templates, calendar.

**Wedge** [hypothesis]: Estimate-plus-RRP-paperwork agent for residential painters.

**Price ceiling:** incumbent public prices found [search-cited]:
  - DripJobs: $97/mo Pro; $147/mo Advanced; add-ons: Chat $25/mo, Production Rates $99/mo, Job Costing $49/mo (https://dripjobs.com/pricing)
  - Estimate Rocket: $139/mo (per SelectHub/SoftwareWorld results citing Capterra) (https://www.estimaterocket.com/pricing)
  - PaintPricing: Free tier (free forever calculator per result) (https://paintpricing.com/)
  - PaintScout: $79-$99/user/mo (estimating only); another roundup: ~$119/user/mo + $99/mo Operations add-on (https://www.paintscout.com/demo/)
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (solo painters to $2-6M operations; founder-built tools like DripJobs). Public-price incumbents: 3. Gatekeeper: franchise-only (independents unconstrained: yes) — CertaPro Painters FDD: franchisees must obtain the proprietary CertaOne software from CertaPro ($70/user/mo owners and office, $30/user/mo sales and production), $7,500 technology setup fee, $85/mo technology fee. Binds franchisees only.. Top-4 share: unverified; statement: IBISWorld: Painters in the US has low market share concentration; largest business is FD Thomas Inc.; 267,675 businesses (2024); market size $49.0bn (2026)..

**Evidence URLs (37):**
  - https://www.ibisworld.com/united-states/number-of-businesses/painters/187/
  - https://www.clientility.com/blog/top-4-painting-contractor-software-platforms-in-2026
  - https://dripjobs.com/
  - https://dripjobs.com/pricing
  - https://www.dripjobs.com/about-us
  - https://dripjobs.com/about
  - https://www.estimaterocket.com/painting
  - https://www.estimaterocket.com/pricing
  - https://apps.apple.com/us/app/paintforce-painting-estimator/id6738657815
  - https://paintpricing.com/
  - https://www.paintscout.com/
  - https://www.paintscout.com/demo/
  - https://www.capterra.com/p/201082/PaintScout/
  - https://apps.apple.com/us/app/painting-contractor-estimates/id897185714
  - https://myquoteiq.com/crm-for-painting-contractors/
  - https://myquoteiq.com/pricing/
  - https://tracxn.com/d/companies/quoteiq/__baJVvCxQIOKFcjFDrIKoaTAs0SGEG9HCkMNvWwcyViU
  - https://bootstrappers.com/mike-vida-quoteiq/
  - https://contractortoolstack.com/software/quoteiq/
  - https://www.werxapp.com/industries/painting/painting-contractor-software/
  - https://www.cleansavannah.com/post/best-painting-contractor-software-2026
  - https://www.franchisechatter.com/2017/06/07/considering-a-certapro-painters-franchise-dont-overlook-these-17-important-franchise-fees/
  - https://www.ibisworld.com/industry-statistics/market-size/painters-united-states/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Clientility&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=2143682922612985
  - https://adstransparency.google.com/advertiser/AR12080640021686648833?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=258594684344646
  - https://adstransparency.google.com/advertiser/AR08983509211568668673?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=PaintForce%20Painting%20Estimator&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=PaintPricing&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=107630083990856
  - https://adstransparency.google.com/advertiser/AR05074473864172404737?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=550645431657304
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=882270968493081
  - https://adstransparency.google.com/advertiser/AR18129792735853412353?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 13. HVAC contractors  (NAICS 238220)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 10.5 = ad score 6.5 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** Housecall Pro, ServiceTrade.
- **Rescrape queued (Meta undersampled):** ServiceTrade, Workiz.
- **Boring test:** 2/3 — Maintenance agreements, dispatch, EPA/permit paperwork.
- **US establishments:** 120461 (2026, https://www.ibisworld.com/united-states/number-of-businesses/heating-air-conditioning-contractors/1945/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Housecall Pro | yes | 8 | yes | 706 / 3 / 3 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | horizontal |
| ServiceTrade | yes | 5 | yes | 49 / 0 / 0 (2026-08-10) | ServiceTrade | yes | 200 / 16 (2024-01-24) | yes 8 | 0 | undersampled |
| FieldEdge | yes | 3 | no | 1 / 0 / 0 (2026-08-31) | FieldEdge by Xplor | no | 44 / 9 (2021-10-25) | no 0 | 0 | horizontal |
| Workiz | yes | 3 | no | 110 / 0 / 0 (2026-08-09) | Workiz | no | 500 / 20 (2025-10-17) | no 0 | 0 | undersampled horizontal |
| The New Flat Rate | yes | 1 | no | 7 / 0 / 0 (2026-07-23) | The New Flat Rate | yes | 19 / 1 (2024-07-18) | no 0 | 0 |  |
| Aptora Total Office Manager | yes | 0 | no | 0 / 0 / 0 (-) | Aptora | no | 4 / 0 (2025-05-10) | no 0 | 0 |  |
| AutoHVAC | yes | 0 | no | 0 / 0 / 0 (-) | Auto hvac | no | 2 / 1 (2026-04-14) | no 0 | 0 |  |
| HVAC ProposalKit | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| OnCall Air | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Repair-CRM | yes | 0 | no | 0 / 0 / 0 (-) | Repair-CRM | no | 0 / 0 (-) | no 0 | 0 |  |
| Successware | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> HVAC contractors
> - Core jobs: dispatch to nearest tech, maintenance-agreement renewals, flat-rate pricing, invoicing with QuickBooks sync (FieldEdge, Successware, Aptora), inventory, and Manual J load calcs for equipment quotes (Cool Calc, AutoHVAC, Wrightsoft).
> - Market is the most fragmented in the batch by evidence: 120,461 firms, largest player <2% share, ~70% of firms under 10 employees. But PE roll-ups are active (DealSeam tracker), and the horizontals price publicly ($49-149/mo).
> - Agent wedge: maintenance-agreement renewal and seasonal tune-up booking, or a Manual J/quote agent that turns a site visit's photos and square footage into a load calc and equipment proposal (current DIY tools run $39-233/mo and are described as taking hours to learn).
> - Weakest evidence: FieldEdge/Successware/Aptora pricing, headcount, and ownership went unverified; franchise software mandates (One Hour, etc.) not checked.
> - Vertical-tool follow-up (2026-09-17): HVAC contractors Found: OnCall Air (oncallair.com, "HVAC Sales Platform", founded 2016 Miami, $149/mo usage-based unlimited users, claims $6.3B HVAC sales), HVAC ProposalKit (hvacproposalkit.com, only a blog/comparison page surfaced), ServiceTrade HVAC CRM/estimating (commercial mechanical), The New Flat Rate (multi-trade pricing). Confidence: OnCall Air is high-confidence HVAC-vertical (in-home sales/proposal layer rather than full FSM). HVAC ProposalKit medium (vertical by name, product unverified). ServiceTrade low for residential SMBs (commercial focus).

**The agent version** [hypothesis]: Maintenance-agreement renewals and tune-up scheduling → permit pulls → EPA 608 refrigerant log → invoice. Needs: SMS, permit portals, calendar, log templates.

**Wedge** [hypothesis]: Maintenance-agreement renewal and permit agent for small HVAC shops.

**Price ceiling:** incumbent public prices found [search-cited]:
  - AutoHVAC: first Manual J free (per page title) (https://autohvac.ai/manual-j-cost)
  - OnCall Air: $149/mo (https://www.oncallair.com/pricing)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator ('about 70% of the firms are independents with fewer than 10 employees'). Public-price incumbents: 4. Gatekeeper: unverified (franchise search not run — budget exhausted). Top-4 share: largest single player under 2% share (IBISWorld 2026 via withorbital); IBISWorld: low concentration, largest = Emcor Group.

**Evidence URLs (34):**
  - https://www.ibisworld.com/united-states/number-of-businesses/heating-air-conditioning-contractors/1945/
  - https://www.aptora.com/industries/hvac-software
  - https://autohvac.ai/manual-j-cost
  - https://fieldedge.com/hvac-software/
  - https://hvacproposalkit.com/blog/compare/best-hvac-proposal-software
  - https://www.housecallpro.com/industries/hvac-software/
  - https://www.oncallair.com/tthome
  - https://www.oncallair.com/pricing
  - https://www.repair-crm.com/2026/08/30/hvac-software-for-small-business-2026-guide-comparison/
  - https://servicetrade.com/hvac-crm/
  - https://www.successware.com/industries/hvac-software/
  - https://thenewflatrate.com/
  - https://www.workiz.com/blog/hvac/best-hvac-business-software-comparison/
  - https://serviceagent.ai/blogs/best-hvac-software-for-small-business/
  - https://autohvac.ai/blog/manual-j-software-pricing-guide
  - https://www.withorbital.com/data/hvac-industry-statistics/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=107791664473
  - https://adstransparency.google.com/advertiser/AR06541920221911842817?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=101779218410103
  - https://adstransparency.google.com/advertiser/AR05588358429031792641?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=123302194386063
  - https://adstransparency.google.com/advertiser/AR01165979373417791489?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=HVAC%20ProposalKit&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=431381633653850
  - https://adstransparency.google.com/advertiser/AR17264116582418743297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=OnCall%20Air&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=821421364649220
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=709305829119809
  - https://adstransparency.google.com/advertiser/AR07759657559018962945?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Successware&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=154761484596008
  - https://adstransparency.google.com/advertiser/AR04848841090171666433?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=275323565950008
  - https://adstransparency.google.com/advertiser/AR18044909407396954113?region=US

**Confidence:** medium-low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 14. Fire extinguisher & fire alarm inspection companies  (NAICS 561621)

- **Status:** QUALIFIED. Research: searched (follow-up batch 17, 2026-09-17).
- **Method score:** 10.5 = ad score 5.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Inspect Point, ServiceTrade.
- **Rescrape queued (Meta undersampled):** ServiceTrade.
- **Boring test:** 3/3 — Tag/inspection cycles, AHJ reports, deficiency quotes.
- **US establishments:** unverified (unverified, https://www.ibisworld.com/united-states/industry/fire-protection-and-security-system-installation-contractors/6486/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Inspect Point | yes | 6 | yes | 0 / 0 / 0 (-) | Inspect Point | no | 76 / 20 (2023-03-13) | yes 5 | 2 |  |
| ServiceTrade | yes | 5 | yes | 49 / 0 / 0 (2026-08-10) | ServiceTrade | yes | 200 / 16 (2024-01-24) | yes 8 | 0 | undersampled |
| Uptick | yes | 4 | no | 9 / 0 / 0 (2026-08-31) | Uptick | no | 22 / 11 (2025-08-11) | yes 8 | 0 |  |
| Firebug EXT (General Data) | yes | 3 | no | 0 / 0 / 0 (-) | Firebug | no | 74 / 5 (2021-10-25) | no 0 | 0 |  |
| Essential | yes | 0 | no | 68 / 0 / 0 (2026-07-31) | Essential Sleep Hacks | no | 5 / 0 (2024-07-01) | no 0 | 0 | wrong_page |
| FireInspect | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| KomplyOS | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| ZenFire (ZenTrades) | yes | 0 | no | 0 / 0 / 0 (-) | Zenfire | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Fire extinguisher & fire alarm inspection companies (NAICS 561621) — 9 searches
> - Incumbents' jobs: NFPA 10/25/72 inspection forms on tablet, deficiency-to-quote workflow, recurring service agreements, AHJ report submission (Inspect Point, Uptick, ServiceTrade, BuildingReports, KomplyOS, Essential, FireInspect, ZenFire).
> - Wedge: pricing is per-user ($79 flat to $180-249+/mo); a small shop with 2 techs is over-served. Agent wedge: deficiency-report-to-quote-to-follow-up automation on top of the existing inspection app, or AHJ/insurer report chasing for 1-3 tech shops.
> - Weakest evidence: no 561621 establishment count; ZenFire and Essential pricing only third-party or quote-based; ServiceTrade price came from a competitor's article, not its site.
> - Searches: NAICS 561621 count; extinguisher software; ITM software 2026; alarm inspection pricing; IBISWorld fragmentation; Uptick pricing/funding; ZenFire pricing; ServiceTrade crunchbase; KomplyOS pricing; (Essential pricing/funding counted in the extra pass).

**The agent version** [hypothesis]: Tag/inspection cycles per site → inspection results captured → AHJ report filed → deficiency quotes. Needs: report templates, AHJ email/portals, quoting rules.

**Wedge** [hypothesis]: Inspection-report-to-AHJ filing agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Essential: quote (no setup fees, month-to-month) (https://www.withessential.com/pricing)
  - FireInspect: $79/month flat (https://fireinspectapp.com/fire-alarm-inspection-software)
  - KomplyOS: $249/month Starter (5 users, 15 buildings); $699/month Professional (15 users) (https://www.komplyos.com/pricing)
  - ServiceTrade: $180/user/month (third-party listing) (https://buildops.com/resources/fire-alarm-inspection-report-software)
  - Uptick: custom per-user monthly fee (not published) (https://www.uptickhq.com/pricing)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 5/5. Check signer: owner of small fire protection contractor. Public-price incumbents: 3. Gatekeeper: none found in searches (AHJ third-party reporting portals exist in some jurisdictions but did not surface). Top-4 share: no company >5% share.

**Evidence URLs (32):**
  - https://www.ibisworld.com/united-states/industry/fire-protection-and-security-system-installation-contractors/6486/
  - https://www.withessential.com/
  - https://www.withessential.com/pricing
  - https://fireinspectapp.com/fire-alarm-inspection-software
  - https://www.general-data.com/products/software/tracking/firebug-ext-barcode-fire-extinguisher-inspection-software
  - https://www.inspectpoint.com/trades/fire-extinguisher/
  - https://pitchbook.com/profiles/company/439227-91
  - https://www.crunchbase.com/organization/inspect-point
  - https://www.komplyos.com/industries/fire-protection
  - https://www.komplyos.com/pricing
  - https://servicetrade.com/resources/blog/best-fire-life-safety-software-2026/
  - https://buildops.com/resources/fire-alarm-inspection-report-software
  - https://pitchbook.com/profiles/company/95115-79
  - https://www.crunchbase.com/organization/servicetrade
  - https://www.uptickhq.com/us/fire-extinguisher-inspection-software
  - https://www.uptickhq.com/pricing
  - https://pitchbook.com/profiles/company/226749-70
  - https://internationalfireandsafetyjournal.com/psg-backs-uptick-to-expand-global-fire-protection-software/
  - https://zentrades.pro/zenfire
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102702685241042
  - https://adstransparency.google.com/advertiser/AR03195662616928190465?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=FireInspect&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=24419339752
  - https://adstransparency.google.com/advertiser/AR15175862938612269057?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=854398374581747
  - https://adstransparency.google.com/advertiser/AR17562238852368695297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=KomplyOS&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=709305829119809
  - https://adstransparency.google.com/advertiser/AR07759657559018962945?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=274498879078525
  - https://adstransparency.google.com/advertiser/AR03041127185357209601?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=872650859256623

**Confidence:** medium-low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 15. Food trucks  (NAICS 722330)

- **Status:** QUALIFIED. Research: searched (follow-up slice4).
- **Method score:** 10.5 = ad score 5.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Roaming Hunger (vendor portal), Truckster (vendor platform).
- **Boring test:** 3/3 — Event booking, permits/commissary paperwork, catering quotes.
- **US establishments:** 92,257 (IBISWorld Food Trucks) (2025, https://www.ibisworld.com/united-states/number-of-businesses/food-trucks/4322/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Roaming Hunger (vendor portal) | yes | 6 | yes | unverified (throttled run) | Roaming Hunger | no | 500 / 40 (2023-09-18) | yes 12 | 2 |  |
| Truckster (vendor platform) | yes | 5 | yes | unverified (throttled run) | Truckster | no | 43 / 32 (2024-04-16) | no 0 | 2 |  |
| Homebase (food truck page) | yes | 3 | no | unverified (throttled run) | Homebase | unverified (host blocked) | 40 / 34 (2024-06-07) | no 0 | 0 |  |
| Square for Restaurants (food truck page) | yes | 3 | no | unverified (throttled run) | - | no | 36 / 34 (2021-10-25) | no 0 | 0 |  |
| Catermonkey | yes | 0 | no | unverified (throttled run) | Catermonkey - app | no | 2 / 0 (2025-12-18) | no 0 | 0 |  |
| Food Truck Lineup | yes | 0 | no | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Food Truck OS | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| HubPlate | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> · Food trucks (NAICS 722330) — 8 tools, fragmentation 5/5
> - Core jobs: POS/online ordering, location and event calendar, catering quotes and deposits, permit/commissary compliance records, staff scheduling, marketplace listings for bookings.
> - Incumbents: Food Truck OS ($29/mo), HubPlate ($99/mo), Truckster vendor app ($25/mo, 10 staff, unfunded), Roaming Hunger (per-booking fees, 35 staff), Food Truck Lineup, Catermonkey ($63–$247/mo), Homebase and Square pages.
> - Agent wedge: catering-and-permits agent — reply to event inquiries with quotes/minimums, collect deposits, file the city/commissary permit renewals and health-inspection documents, and post the weekly location schedule everywhere.
> - Weakest evidence: buyers are tiny and high-churn (92,257 trucks, +16.9%/yr); Truckster price is a third-party figure; Food Truck OS and HubPlate have no headcount; ad-spend likely concentrated in Square/Toast rather than niche tools.
> - Searches (12): IBISWorld count, 3× tool discovery, Food Truck Lineup, Truckster, HubPlate, concentration, Food Truck OS, Roaming Hunger, Catermonkey, Truckster company.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (truck owner; $25-$99/mo flat tools). Public-price incumbents: 4. Gatekeeper: none found (commissaries/city permits are compliance gates, not software mandates; Square is default but optional). Top-4 share: no company >5%; top 50 ~20% of revenue; 91% independently owned.

**Evidence URLs (32):**
  - https://www.ibisworld.com/united-states/number-of-businesses/food-trucks/4322/
  - https://catermonkey.com/en/for-whom/food-trucks/
  - https://catermonkey.com/en/prices/
  - https://www.capterra.com/p/233143/Catermonkey/
  - https://www.foodtrucklineup.com/software/
  - https://foodtruckone.com/
  - https://www.joinhomebase.com/food-truck-catering-event-management
  - https://www.hubplate.app/blog/best-pos-system-for-food-trucks-in-2026
  - https://www.hubplate.app/about
  - https://vendor.roaminghunger.com/
  - https://roaminghunger.com/catering/questions-and-answers/
  - https://en.wikipedia.org/wiki/Roaming_Hunger
  - https://squareup.com/us/en/restaurants/food-truck
  - https://www.guideflow.com/blog/food-truck-pos-system
  - https://gotruckster.com/truck-owner
  - https://medium.com/@bigfatwriter/7-cool-food-truck-friendly-tools-c42b381cb1e1
  - https://tracxn.com/d/companies/truckster/__EuPirfcxsVSbfGvfQn7My08qDAnMUnqloEH5rNOsxg0
  - https://www.linkedin.com/company/gotruckster
  - https://www.prweb.com/releases/food_trucks_in_the_us_industry_market_research_report_now_available_from_ibisworld/prweb11580691.htm
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=350873142440496
  - https://adstransparency.google.com/advertiser/AR15265558623305072641?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Food%20Truck%20Lineup&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Food%20Truck%20OS&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=281815715162966
  - https://adstransparency.google.com/advertiser/AR16157099636731936769?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=HubPlate&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=90540788579
  - https://adstransparency.google.com/advertiser/AR14854120762305937409?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Square%20for%20Restaurants&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR14896030700992987137?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=173075980020927
  - https://adstransparency.google.com/advertiser/AR15563755488247021569?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 16. Deck & patio builders  (NAICS 236118)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 10.0 = ad score 6.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** Builder Prime, Houzz Pro.
- **Rescrape queued (Meta undersampled):** JobNimbus.
- **Boring test:** 3/3 — Permit drawings, material takeoffs, seasonal backlog.
- **US establishments:** unverified (search budget exhausted before this check) — unverified; share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Builder Prime | yes | 6 | yes | 8 / 6 / 0 (2026-06-22) | Builder Prime | no | 26 / 21 (2025-02-21) | no 0 | 0 |  |
| Houzz Pro | yes | 6 | yes | 82 / 14 / 0 (2026-06-11) | Houzz Pro | no | 700 / 38 (2021-10-25) | no 0 | 0 | horizontal |
| JobNimbus | yes | 1 | no | 67 / 0 / 0 (2026-09-10) | JobNimbus | yes | unverified (host blocked) / unverified (host blocked) (-) | unverified (host blocked)  | 0 | undersampled |
| Projul | yes | 1 | no | 3 / 3 / 0 (2026-06-22) | Projul | yes | 3 / 1 (2023-02-14) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Deck & patio builders (236118)
> - Core jobs: lead tracking, board-level material estimating with tiered lumber/composite pricing, weather-aware scheduling, permits/inspections, deposit-to-final invoicing (Projul, Builder Prime, JobNimbus, Houzz Pro, QuoteIQ landing pages).
> - Wedge: no deck-only vertical SaaS surfaced - every tool is a horizontal with a landing page - which suggests the niche is served by generic CRMs and open to a purpose-built agent (estimate + permit paperwork + homeowner updates).
> - Weakest link: establishment count not retrieved; franchisors (deck-building franchises) not checked.

**The agent version** [hypothesis]: Deck design brief → permit drawing package → material list → schedule. Needs: permit portals, drawing template.

**Wedge** [hypothesis]: Deck permit-package agent.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~3 hrs/week.

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (deck builders). Public-price incumbents: 2. Gatekeeper: franchise-only (independents unconstrained: yes) — Archadeck Outdoor Living FDD requires franchisees to purchase SoftPlan design software ($2,000, non-refundable); no CRM/FSM mandate named. Binds franchisees only. NADRA lists no endorsed software partner in results (https://www.nadra.org/membership).. Top-4 share: unverified; statement: IBISWorld: Deck & Patio Construction industry is highly fragmented with no companies holding a market share greater than 5%; 6,746 businesses; $1.3bn (2024)..

**Evidence URLs (17):**
  - https://www.builderprime.com/industries/decks-railings
  - https://pro.houzz.com/for-pros/software-deck-builder-crm
  - https://www.jobnimbus.com/industries/deck-and-patio-software
  - https://projul.com/industries/deck-builders/
  - https://myquoteiq.com/industries/deck-building-software/
  - https://myquoteiq.com/top-10-best-job-management-software-for-hardscaping-contractors-in-2026/
  - https://www.franchisechatter.com/2022/02/04/archadeck-outdoor-livings-initial-franchise-fee-royalty-fee-24-other-fees/
  - https://www.ibisworld.com/united-states/market-research-reports/deck-patio-construction-industry/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1829807557257902
  - https://adstransparency.google.com/advertiser/AR14135757271249977345?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=111007986968452
  - https://adstransparency.google.com/advertiser/AR16905769731288465409?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=366445260038774
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=2146347565625894
  - https://adstransparency.google.com/advertiser/AR15154333676306694145?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** medium-low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 17. Independent used car dealers  (NAICS 441120)

- **Status:** QUALIFIED. Research: searched (follow-up slice4).
- **Method score:** 10.0 = ad score 5.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** AutoRaptor CRM, Wayne Reaves Software.
- **Boring test:** 3/3 — Title/DMV paperwork, BHPH collections, inventory listings.
- **US establishments:** 38,000+ (NIADA 'represents over 38,000 used vehicle dealers') (unverified, https://en.wikipedia.org/wiki/National_Independent_Automobile_Dealers_Association); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| AutoRaptor CRM | yes | 5 | yes | unverified (throttled run) | - | no | 48 / 16 (2025-05-26) | no 0 | 2 |  |
| Wayne Reaves Software | yes | 5 | yes | unverified (throttled run) | Wayne Reaves Software & Web Sites | no | 20 / 12 (2023-07-06) | no 0 | 2 |  |
| DealerCenter (Nowcom) | yes | 4 | no | unverified (throttled run) | DealerCenter | no | 22 / 18 (2021-10-25) | yes 1 | 0 |  |
| AutoManager (DeskManager / WebManager) | yes | 2 | no | unverified (throttled run) | Auto Manager | unverified (host blocked) | 6 / 2 (2021-10-26) | no 0 | 2 |  |
| Selly Automotive | yes | 2 | no | unverified (throttled run) | Selly Automotive | no | 4 / 1 (2023-02-12) | no 0 | 2 |  |
| Frazer DMS (Frazer Computing) | yes | 0 | no | unverified (throttled run) | - | no | 2 / 2 (2024-04-09) | no 0 | 0 |  |
| MSP Buy Here Pay Here Software | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> · Independent used car dealers (NAICS 441120) — 7 tools, fragmentation 5/5
> - Core jobs: inventory and desking, deal documents/e-contracting, BHPH loan servicing and collections, CRM/text follow-up, online listings and dealer website, QuickBooks accounting.
> - Incumbents: Frazer ($129/mo, 54 staff, founded 1985), DealerCenter/Nowcom ($79/mo DMS, 700+ staff, Westlake sister), AutoManager ($88/mo, 48 staff), Wayne Reaves ($79/mo, 11–50 staff), Selly ($140/user/mo, 19 staff), AutoRaptor ($299/mo, 14 staff), MSP BHPH.
> - Agent wedge: lead-response and BHPH collections agent — answer marketplace leads in minutes, schedule test drives, run stips checklists, and work the delinquency queue with compliant texts; priced per rooftop below the DMS.
> - Weakest evidence: establishment count is NIADA's "38,000+" (association claim, no year) vs siccode's 850; Frazer pricing sources disagree ($119/$129/$199); DealerCenter effective cost depends on per-transaction fees.
> - Searches (12): NIADA/NAICS count, 2× tool discovery, Frazer pricing, DealerCenter pricing, Frazer company, concentration, AutoManager, Selly, AutoRaptor, Wayne Reaves, Nowcom.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (independent lot owner; DMS $60-$199/mo month-to-month). Public-price incumbents: 4. Gatekeeper: none found (NIADA has no software mandate; Westlake/DealerCenter lender tie is optional). Top-4 share: CarMax 15.4% of industry revenue (IBISWorld); market 'highly fragmented' (CarMax 10-K).

**Evidence URLs (38):**
  - https://en.wikipedia.org/wiki/National_Independent_Automobile_Dealers_Association
  - https://www.automanager.com/
  - https://www.automanager.com/pricing/
  - https://pitchbook.com/profiles/company/391819-69
  - https://www.autoraptor.com/
  - https://www.autoraptor.com/pricing/
  - https://rocketreach.co/autoraptor-crm-profile_b5cbbd3bf42e148d
  - https://www.dealercenter.com/
  - https://www.dealercenter.com/pricing/
  - https://www.marubeni.com/en/brand_media/scope/westlake/
  - https://tracxn.com/d/companies/nowcom/__sLLdW9HRBOONb61-IAqXA2EWSMY0qggLHXVZBoNbwQo
  - https://www.linkedin.com/company/dealercenter
  - https://www.frazer.com/
  - https://www.frazer.com/frazer-pricing
  - https://leadiq.com/c/frazer-computing/5a1d9a972300005e0089becc
  - https://www.crunchbase.com/organization/frazer-computing
  - https://www.linkedin.com/company/frazer-computing
  - https://www.capterra.com/p/87328/MSP-Buy-Here-Pay-Here-Software/
  - https://www.sellyautomotive.com/
  - https://subscribed.fyi/selly-automotive/pricing/
  - https://getlatka.com/companies/selly-automotive-crm
  - https://www.waynereaves.com/
  - https://www.softwaresuggest.com/wayne-reaves-sw
  - https://www.crunchbase.com/organization/wayne-reaves-software
  - https://www.sec.gov/Archives/edgar/data/1170010/000117001024000034/kmx-20240229.htm
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=100127035908005
  - https://adstransparency.google.com/advertiser/AR14484759510494740481?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=AutoRaptor%20CRM&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR09529052521532751873?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=983854664969507
  - https://adstransparency.google.com/advertiser/AR00938860472013160449?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Frazer%20DMS&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR13419302094293172225?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=MSP%20Buy%20Here%20Pay%20Here%20Software&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=431471896907560
  - https://adstransparency.google.com/advertiser/AR11187676154314096641?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=193863927294648
  - https://adstransparency.google.com/advertiser/AR01164240289620033537?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 18. Small residential property managers  (NAICS 531311)

- **Status:** QUALIFIED. Research: searched (follow-up slice0).
- **Method score:** 10.0 = ad score 5.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Innago, Rentec Direct.
- **Boring test:** 3/3 — Rent collection, maintenance dispatch, lease paperwork.
- **US establishments:** 55,347 establishments; 39,462 businesses (2020, https://www.naics.com/naics-code-description/?code=531311); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Innago | yes | 5 | yes | 0 / 0 / 0 (-) | Innago | no | 400 / 26 (2023-01-09) | no 0 | 2 |  |
| Rentec Direct | yes | 5 | yes | 0 / 0 / 0 (-) | Rentec Direct | no | 57 / 40 (2023-08-15) | no 0 | 2 |  |
| AppFolio | yes | 4 | no | unverified (throttled run) | AppFolio | no | 36 / 10 (2026-02-03) | yes 7 | 0 |  |
| TenantCloud | yes | 4 | no | 0 / 0 / 0 (-) | TenantCloud | no | 80 / 19 (2023-02-23) | yes 1 | 0 |  |
| TurboTenant | yes | 4 | no | unverified (throttled run) | - | no | 500 / 33 (2021-10-25) | yes 2 | 0 |  |
| Yardi Breeze | yes | 4 | no | unverified (throttled run) | Yardi Breeze | no | 73 / 15 (2023-05-02) | yes 7 | 0 |  |
| Buildium | yes | 3 | no | 0 / 0 / 0 (-) | Buildium  | no | 500 / 28 (2026-01-05) | no 0 | 0 |  |
| DoorLoop | yes | 3 | no | 0 / 0 / 0 (-) | DoorLoop | no | 300 / 20 (2022-11-15) | no 0 | 0 |  |
| Shuk Rentals | yes | 0 | no | 0 / 0 / 0 (-) | Shuk Rentals | no | 4 / 0 (2026-03-12) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> — Small residential property managers (NAICS 531311)
> - Incumbent jobs: listings + applications + screening, e-lease, rent collection/ACH, maintenance tickets, owner statements, trust accounting (TurboTenant, TenantCloud, Buildium, DoorLoop, Rentec Direct, Innago, AppFolio, Yardi Breeze, Shuk).
> - AaaS wedge: "leasing-and-maintenance agent" for sub-100-unit managers: answers prospect inquiries, schedules showings, screens, chases late rent, triages maintenance requests to vendors, and drafts owner reports. Incumbents are feature-rich but human-driven; free tiers (TurboTenant, Innago) show price pressure on software alone, so the sell is labor replacement.
> - Weakest evidence: establishment count attribution (naics.com vs insurancexdate.com); Buildium ownership/headcount not in results; DoorLoop/TurboTenant heavily funded so ad-longevity likely but crowded.
> - Searches (10): NAICS count; best small-landlord software 2026; under-100-unit software; Buildium/AppFolio/DoorLoop/TenantCloud pricing; TenantCloud crunchbase; Innago; Rentec Direct; IBISWorld concentration; RPM franchise software; DoorLoop funding; TurboTenant/Innago employees.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner of a small property-management firm or self-managing landlord (flat per-account or per-unit pricing from free to $69/mo). Public-price incumbents: 7. Gatekeeper: no for independents (Real Property Management franchisees must use AppFolio + LeadSimple; franchise is a small share of 340k businesses). Top-4 share: no company >5% (IBISWorld Residential Property Managers); low concentration, largest Prologis (Property Management).

**Evidence URLs (40):**
  - https://www.naics.com/naics-code-description/?code=531311
  - https://www.appfolio.com/blog/best-property-management-softwares-compared-2026
  - https://renpro.com/property-management-software-pricing-comparison/
  - https://www.buildium.com/blog/top-appfolio-alternatives/
  - https://www.doorloop.com/blog/small-landlord-property-management-software
  - https://www.doorloop.com/blog/appfolio-vs-buildium
  - https://www.crunchbase.com/organization/doorloop
  - https://www.calcalistech.com/ctechnews/article/b1sszfagkl
  - https://innago.com/pricing/
  - https://tracxn.com/d/companies/innago/__ZQ9Z0QpYfFQsV2aOV9_zF4fCt_5wG1mgsiuaDCBSFxQ
  - https://www.rentecdirect.com/pricing
  - https://aiforproptech.com/companies/rentec-direct/
  - https://www.shukrentals.com/learn/property-management-software-for-small-landlords
  - https://www.tenantcloud.com/review/appfolio-vs-buildium
  - https://www.crunchbase.com/organization/tenantcloud-2
  - https://pitchbook.com/profiles/company/120115-18
  - https://www.linkedin.com/company/tenantcloud
  - https://www.turbotenant.com/property-management-software/best-property-management-software-for-small-landlords/
  - https://pitchbook.com/profiles/company/123927-04
  - https://www.yardibreeze.com/blog/2026/03/best-property-management-software-50-units/
  - https://fddexchange.com/fdd/real-property-management-2025/
  - https://www.ibisworld.com/united-states/industry/residential-property-managers/6136/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=75233933923
  - https://adstransparency.google.com/advertiser/AR16913727859011354625?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=544528678737128
  - https://adstransparency.google.com/advertiser/AR03268743478334455809?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=104065147625774
  - https://adstransparency.google.com/advertiser/AR15760400789232680961?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1195415940507807
  - https://adstransparency.google.com/advertiser/AR12326793977628983297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=97287212644
  - https://adstransparency.google.com/advertiser/AR05330179243265490945?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=100447279438187
  - https://adstransparency.google.com/advertiser/AR12896813567478595585?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1478665159044924
  - https://adstransparency.google.com/advertiser/AR08453475861734096897?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=TurboTenant&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR16004943170366341121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=998147790365460
  - https://adstransparency.google.com/advertiser/AR00874605974558605313?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 19. Carpet & upholstery cleaning  (NAICS 561740)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 9.5 = ad score 7.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** Housecall Pro, Jobber.
- **Boring test:** 3/3 — Room-count quoting, route scheduling, reminders.
- **US establishments:** 41611 (2026, https://www.ibisworld.com/united-states/number-of-businesses/carpet-cleaning/1498/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Housecall Pro | yes | 8 | yes | 706 / 3 / 3 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | horizontal |
| Jobber | yes | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| GorillaDesk | yes | 3 | no | 0 / 0 / 0 (-) | GorillaDesk | no | 81 / 34 (2023-05-25) | no 0 | 0 |  |
| ServiceMonster | yes | 3 | no | 0 / 0 / 0 (-) | ServiceMonster | no | 6 / 5 (2023-05-15) | no 0 | 0 |  |
| Fieldd | yes | 0 | no | 0 / 0 / 0 (-) | Fieldd - Software for Services | no | 53 / 0 (2025-06-16) | no 0 | 0 | horizontal |
| ManageMart | yes | 0 | no | 0 / 0 / 0 (-) | Managemart | no | 0 / 0 (-) | no 0 | 0 |  |
| ScheduleDrop | yes | 0 | no | 0 / 0 / 0 (-) | ScheduleDrop | no | 0 / 0 (-) | no 0 | 0 |  |
| ServGrow | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 8 / 0 (2025-12-03) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Carpet & upholstery cleaning
> - Core jobs: job booking, quoting, technician assignment, invoicing/payments, marketing/reminders for repeat cleanings (ServiceMonster claims >75% client retention), tips/payout tracking (Fieldd).
> - Eight tools with dedicated carpet landing pages found (ServiceMonster, ScheduleDrop, ServGrow, ManageMart, Fieldd, GorillaDesk, Housecall Pro, Jobber); ServiceMonster is the 20-year vertical incumbent.
> - Agent wedge: reactivation/repeat-booking agent (12-month re-clean cadence outreach + instant quote) for solo truck-mount operators; retention is the metric incumbents already sell on.
> - Weakest link: zero prices captured despite most of these tools publishing them; franchisor influence (Chem-Dry, Stanley Steemer) unverified.
> - Vertical-tool follow-up (2026-09-17): Carpet & upholstery cleaning Found: ServiceMonster (servicemonster.com, "#1 Trusted Software for Carpet Cleaners", "originally built just for carpet cleaners", founded 2004 Spokane WA, from $59/mo, ~5,000+ customers), ScheduleDrop carpet-cleaning CRM page, GorillaDesk and fieldd carpet pages (horizontal). Confidence: ServiceMonster is high-confidence vertical (carpet-cleaning origin, now broader cleaning/restoration). ScheduleDrop medium-low (page only). GorillaDesk/fieldd low (multi-niche).

**The agent version** [hypothesis]: Room-count quote → route slot → reminders → invoice → 6-month rebook. Needs: SMS, calendar, payments.

**Wedge** [hypothesis]: Rebooking agent for carpet cleaners.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~2 hrs/week.

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (solo/small truck-mount operators). Public-price incumbents: 0. Gatekeeper: franchise-only (independents unconstrained: yes) — Chem-Dry FDD: franchisees are required to use Chem-Dry's web-based Customer Management System (CRM fee $100-$450/mo plus up to $500 data import) and OnTrack scheduling/billing suite. Stanley Steemer locations use Powermagic proprietary software (https://franzy.com/franchises/stanley-steemer). Binds franchisees only.. Top-4 share: unverified; statement: IBISWorld: Carpet Cleaning in the US has low market share concentration, largest is Stanley Steemer International; concentration is low because services are provided by many small companies and buyers.

**Evidence URLs (25):**
  - https://www.ibisworld.com/united-states/number-of-businesses/carpet-cleaning/1498/
  - https://fieldd.co/industries/carpet-cleaning-software
  - https://gorilladesk.com/industries/carpet-cleaning-software/
  - https://www.housecallpro.com/industries/carpet-cleaning-software/
  - https://www.getjobber.com/industries/carpet-cleaning-software/
  - https://www.managemart.com/carpet-cleaning-software
  - https://scheduledrop.com/carpet-cleaning
  - https://www.servgrow.com/carpet-cleaning-software
  - https://www.servicemonster.com/carpet-cleaning-software
  - https://www.franchisechatter.com/2018/02/27/considering-a-chem-dry-franchise-dont-overlook-these-25-important-franchise-fees/
  - https://www.ibisworld.com/united-states/industry/carpet-cleaning/1498/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=108336860499717
  - https://adstransparency.google.com/advertiser/AR12022871354345783297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=387445444655938
  - https://adstransparency.google.com/advertiser/AR10520026520397807617?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=431381633653850
  - https://adstransparency.google.com/advertiser/AR17264116582418743297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183668204989264
  - https://adstransparency.google.com/advertiser/AR07389967871058640897?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=104187944871222
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=596784700193438
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=ServGrow&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR03495879061392064513?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=10150114657650624
  - https://adstransparency.google.com/advertiser/AR08781699796525121537?region=US

**Confidence:** medium-low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 20. Foundation repair & basement waterproofing contractors  (NAICS 238190)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 9.0 = ad score 6.0 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** Builder Prime, Contractor Accelerator.
- **Boring test:** 3/3 — Engineer letters, lifetime-warranty transfers, financing paperwork.
- **US establishments:** 6,106 establishments (NAICS 238190, Census 2020); 48,569 employees (2020) (2020, https://naicslist.com/naics/238190); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Builder Prime | yes | 6 | yes | 8 / 6 / 0 (2026-06-22) | Builder Prime | no | 26 / 21 (2025-02-21) | no 0 | 0 |  |
| Contractor Accelerator | yes | 6 | yes | 6 / 6 / 4 (2025-10-11) | Contractor Accelerator | no | 22 / 18 (2022-01-28) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Foundation repair & basement waterproofing (238190)
> - Core jobs: lead intake, in-home estimating with photos, production scheduling, job costing, payments (Builder Prime, Contractor Accelerator, QuoteIQ).
> - Wedge: this is a one-call-close, in-home-sales trade; an agent that pre-qualifies leads, schedules inspections and generates the proposal package from the inspector's photos/notes is the obvious fit.
> - Weakest link: only 3 tools found (one horizontal); manufacturer dealer networks may dictate CRM and were not checked; 6,106 establishments (2020) is a broad NAICS proxy.

**The agent version** [hypothesis]: Inspection photos → repair proposal → engineer letter request → warranty transfer paperwork → financing application. Needs: photo intake, proposal template, email.

**Wedge** [hypothesis]: Proposal and warranty-transfer paperwork agent.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~4 hrs/week.

**Fragmentation (Step 4):** 3/5. Check signer: owner-operator (foundation repair / waterproofing contractors). Public-price incumbents: 1. Gatekeeper: unverified (independents unconstrained: yes) — No franchisor software mandate located in results. Basement Repair Specialists franchise has proprietary estimating software coupled with a CRM (https://www.franchisegator.com/franchises/basement-repair-specialists/) but mandate status unverified. Supportworks dealer network offers SolutionView sales-presentation software to dealers (https://go.suppor. Top-4 share: unverified; statement: IBISWorld: Waterproofing Contractors industry is highly fragmented with no companies holding a market share greater than 5%; $5.0bn (2024). Foundation repair services market described as highly fragme.

**Evidence URLs (12):**
  - https://naicslist.com/naics/238190
  - https://www.builderprime.com/industries/basements-waterproofing
  - https://contractoraccelerator.com/industries/foundation-repair
  - https://myquoteiq.com/industries/foundation-repair-software/
  - https://myquoteiq.com/top-10-best-job-management-software-for-hardscaping-contractors-in-2026/
  - https://www.ibisworld.com/united-states/industry/waterproofing-contractors/6069/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1829807557257902
  - https://adstransparency.google.com/advertiser/AR14135757271249977345?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1830220243904074
  - https://adstransparency.google.com/advertiser/AR01732577197182418945?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 21. Fire sprinkler contractors  (NAICS 238220)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 8.5 = ad score 5.5 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** Inspect Point, BuildOps, ServiceTrade.
- **Rescrape queued (Meta undersampled):** BuildOps, ServiceTrade.
- **Boring test:** 3/3 — NFPA 25 inspection reports, AHJ submittals, backflow/hydrostatic tests.
- **US establishments:** 19,845 (IBISWorld Fire Protection & Security System Installation Contractors) (2025, https://www.ibisworld.com/united-states/number-of-businesses/security-system-services/1491/ (result set) ; https://www.ibisworld.com/united-states/industry/fire-protection-and-security-system-installation-contractors/6486/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Inspect Point | yes | 6 | yes | 0 / 0 / 0 (-) | Inspect Point | no | 76 / 20 (2023-03-13) | yes 5 | 2 |  |
| BuildOps | yes | 5 | yes | 79 / 0 / 0 (2026-07-23) | BuildOps | yes | 60 / 13 (2025-08-01) | yes 12 | 0 | undersampled horizontal |
| ServiceTrade | yes | 5 | yes | 49 / 0 / 0 (2026-08-10) | ServiceTrade | yes | 200 / 16 (2024-01-24) | yes 8 | 0 | undersampled |
| Uptick | yes | 4 | no | 9 / 0 / 0 (2026-08-31) | Uptick | no | 22 / 11 (2025-08-11) | yes 8 | 0 |  |
| Essential | yes | 0 | no | 68 / 0 / 0 (2026-07-31) | Essential Sleep Hacks | no | 5 / 0 (2024-07-01) | no 0 | 0 | wrong_page |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Fire sprinkler contractors (238220)
> - Core jobs: recurring NFPA 25 inspection scheduling (quarterly/annual), mobile inspection checklists tied to assets, deficiency -> quote -> work order handoff, invoicing (Inspect Point, Uptick, Essential, ServiceTrade, BuildOps).
> - Wedge: deficiency-to-quote follow-up and AHJ/customer report distribution are document-heavy and rules-based; an agent could sit on top of any inspection tool and chase deficiencies to sold repairs. Also a "compliance calendar" agent for small shops that cannot justify per-user seats.
> - Weakest link: incumbents are well-funded (Inspect Point $28M Mainsail; Uptick backed by PSG; ServiceTrade 1,300+ customers) and no self-serve price exists, so the buyer is used to sales-led purchases; the sprinkler-only establishment count is unknown (IBISWorld 19,845 covers fire+security installers).

**The agent version** [hypothesis]: NFPA 25 inspection schedule per building → inspector reports converted to AHJ-format submittals → deficiency quotes → renewal. Needs: inspection form templates, AHJ portals/email, quoting rules.

**Wedge** [hypothesis]: NFPA 25 report-to-AHJ submittal agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - ServiceTrade: $99-$149 per user (technician) per month per third-party summary; office users free - https://fieldservicesoftware.io/best-field-service-software/best-software-for-security-fire-protection-field-service-companies/ ; https://softwarefinder.com/field-service/servicetrade (https://new.servicetrade.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~6 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (6 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 3/5. Check signer: owner-operator / operations manager (IBISWorld: 90% of Uptick reviewers small companies); larger sprinkler firms buy via ops leadership. Public-price incumbents: 0. Gatekeeper: no (independents unconstrained: yes) — No fire sprinkler franchise FDD surfaced. AFSA's eight endorsed Business Solutions are 401(k), background screening, drug testing, freight, health insurance, office supplies, travel and insurance (Blue River) - no software. NFSA affinity benefits are shipping and training discounts (https://nfsa.org/affinity/). Software market is open (Inspect Point, ServiceT. Top-4 share: unverified; statement: IBISWorld: Fire Protection and Security System Installation Contractors industry is highly fragmented with no companies holding a market share greater than 5%; $22.1bn (2025). CT Acquisitions: no comp.

**Evidence URLs (28):**
  - https://www.ibisworld.com/united-states/number-of-businesses/security-system-services/1491/ (result set) ; https://www.ibisworld.com/united-states/industry/fire-protection-and-security-system-installation-contractors/6486/
  - https://buildops.com/resources/fire-sprinkler-inspection-software/
  - https://www.withessential.com/services/fire-sprinkler-inspection-software
  - https://www.capterra.com/p/10033564/Essential/ (count not in snippet)
  - https://www.inspectpoint.com/trades/fire-sprinkler/
  - https://pitchbook.com/profiles/company/439227-91 ; https://leadiq.com/c/inspect-point/5a1dc4662300005400c68939 ; https://www.zoominfo.com/c/inspect-point-llc/372310314
  - https://www.crunchbase.com/organization/inspect-point ; https://mainsailpartners.com/company/inspect-point/
  - https://www.getapp.com/legal-law-software/a/inspect-point/ (count not in snippet)
  - https://www.linkedin.com/company/inspect-point
  - https://servicetrade.com/industries/fire-protection/
  - https://new.servicetrade.com/pricing/
  - https://www.capterra.com/p/132690/ServiceTrade-Commercial/ (count not in snippet)
  - https://www.uptickhq.com/
  - https://www.uptickhq.com/pricing
  - https://internationalfireandsafetyjournal.com/psg-backs-uptick-to-expand-global-fire-protection-software/
  - https://www.capterra.com/p/189344/Maintenance/ (count not in snippet; 90% of reviewers small companies)
  - https://www.sprinklerage.com/membership-benefits-business-solutions/
  - https://www.ibisworld.com/united-states/industry/fire-protection-and-security-system-installation-contractors/6486/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=2176049595967390
  - https://adstransparency.google.com/advertiser/AR08596533809250304001?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102702685241042
  - https://adstransparency.google.com/advertiser/AR03195662616928190465?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=854398374581747
  - https://adstransparency.google.com/advertiser/AR17562238852368695297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=709305829119809
  - https://adstransparency.google.com/advertiser/AR07759657559018962945?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=274498879078525
  - https://adstransparency.google.com/advertiser/AR03041127185357209601?region=US

**Confidence:** medium-low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 22. Glass & glazing contractors  (NAICS 238150)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 8.5 = ad score 7.5 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** FieldPulse, Smart Glazier Software.
- **Boring test:** 3/3 — Measure, order, install cycles; commercial storefront bids.
- **US establishments:** 1,317 companies verified active (siccode); 60,592 employees (n.d., https://siccode.com/naics-code/238150/glass-glazing-contractors); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| FieldPulse | yes | 8 | yes | 120 / 41 / 0 (2026-06-24) | FieldPulse | yes | 200 / 18 (2023-11-16) | yes 10 | 0 | horizontal |
| Smart Glazier Software | yes | 7 | yes | 8 / 3 / 0 (2026-06-22) | Smart Glazier Software | yes | 30 / 9 (2024-06-01) | no 0 | 0 |  |
| GlassManager | yes | 3 | no | 3 / 0 / 0 (2026-09-10) | GlassManager | no | 19 / 3 (2023-06-30) | no 0 | 0 |  |
| GlasPacLX (GTS Services) | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Glass & glazing contractors (238150)
> - Core jobs: glass-specific quoting (sq-ft calcs, material imports), POS and shop management, scheduling, inventory, invoicing (GlasPacLX/GTS, GlassManager, Smart Glazier, Accentis).
> - Wedge: quote turnaround for custom flat glass (shower doors, storefront) where each quote needs measurements and material lookup; an agent building quotes from a photo/measurement sheet fits small shops on generic tools.
> - Weakest link: establishment count (siccode 1,317) is implausibly low vs its own employee figure; no vendor details captured; auto-glass insurer networks may be a gatekeeper (unverified).

**The agent version** [hypothesis]: Measure/order/install cycle tracking → supplier orders → install appointment. Needs: supplier portals, calendar.

**Wedge** [hypothesis]: Order-tracking and install-scheduling agent for glaziers.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~3 hrs/week.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (glass shops); auto-glass side has insurer/network billing gatekeepers (not verified). Public-price incumbents: 0. Gatekeeper: unverified (independents unconstrained: yes) — Glass Doctor (Neighborly) marketing cites state-of-the-art software and tech tools but no result named a mandated CRM/FSM or technology fee in the Glass Doctor FDD (https://franchise.neighborly.com/glass-doctor/the-investment); sibling Neighborly brands mandate ServiceTitan but that was not confirmed for Glass Doctor. No distributor or association man. Top-4 share: unverified; statement: IBISWorld: Glass & Glazing Contractors industry has a low level of market share concentration; top four companies are Apogee Enterprises, Enclos, Walters & Wolf and W&W Glass; 28,387 businesses; $25.2.

**Evidence URLs (13):**
  - https://siccode.com/naics-code/238150/glass-glazing-contractors
  - https://www.fieldpulse.com/resources/blog/glass-business-software
  - https://www.gtsservices.com/
  - https://glassmanager.com/
  - https://smartglazier.com/en/
  - https://www.ibisworld.com/united-states/industry/glass-glazing-contractors/205/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1740011049620778
  - https://adstransparency.google.com/advertiser/AR12871690310899466241?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=GlasPacLX%20(GTS%20Services)&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=889952997834349
  - https://adstransparency.google.com/advertiser/AR06951622993432805377?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=101746263202830
  - https://adstransparency.google.com/advertiser/AR18165100940439322625?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 23. Trailer dealers  (NAICS 441229)

- **Status:** audited, not passing. Research: searched (follow-up slice4).
- **Method score:** 9.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Blackpurl.
- **Boring test:** 3/3 — Title/registration paperwork, inventory, financing.
- **US establishments:** 2,890 (IBISWorld Truck Trailer Dealers) (2025, https://www.ibisworld.com/united-states/number-of-businesses/truck-trailer-dealers/5419/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Blackpurl | yes | 5 | yes | unverified (throttled run) | Blackpurl | no | 7 / 7 (2024-12-30) | no 0 | 2 |  |
| Lightspeed DMS (trailer) | yes | 4 | no | unverified (throttled run) | Lightspeed DMS | no | 74 / 12 (2025-02-25) | yes 12 | 0 |  |
| Motility Software Solutions | yes | 4 | no | unverified (throttled run) | Motility Software Solutions | no | 11 / 4 (2023-04-07) | yes 5 | 0 |  |
| Trailer Ops DMS | yes | 2 | no | unverified (throttled run) | Trailer Ops | no | 12 / 0 (2023-06-05) | no 0 | 2 |  |
| EverLogic | yes | 0 | no | unverified (throttled run) | - | no | 1 / 1 (2024-12-19) | no 0 | 0 |  |
| SOARR | yes | 0 | no | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Softbase Evolution (Softbase Systems) | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 2 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> · Trailer dealers (NAICS 441229/441228) — 7 tools, fragmentation 5/5
> - Core jobs: unit inventory with VIN/spec fields, quoting and deal documents (titles, registrations), parts/service, website sync and marketplace listings, floor-plan and accounting.
> - Incumbents: Trailer Ops ($500/mo, 1–10 staff, 500+ dealers), Blackpurl ($408/mo, $99 NATDA rate, 24 staff), EverLogic ($129/licence, 3 min, $4k setup), Softbase (~14 staff, bootstrapped), Motility (since 1984, 800 rooftops), Lightspeed DMS ($450–$3,000+/mo), SOARR.
> - Agent wedge: listing-and-title agent — build spec sheets and photos into every marketplace, answer inbound quote requests with availability/financing, and prepare title/registration packets per state; sub-$200/mo under Trailer Ops.
> - Weakest evidence: IBISWorld count (2,890) covers truck trailer dealers, not light cargo/utility dealers; NATDA member count not found; Softbase/Motility/SOARR have no public price.
> - Searches (12): NAICS/NATDA count, 3× tool discovery, EverLogic pricing, Blackpurl company, Trailer Ops company, concentration, Softbase, SOARR, Motility, Lightspeed pricing.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (trailer dealership owner; flat monthly DMS $387-$500). Public-price incumbents: 4. Gatekeeper: none found (NATDA offers affinity pricing, not a mandate; OEMs not shown to dictate DMS). Top-4 share: no company >5% (IBISWorld Truck Trailer Dealers).

**Evidence URLs (35):**
  - https://www.ibisworld.com/united-states/number-of-businesses/truck-trailer-dealers/5419/
  - https://blackpurl.com/solutions/industry/trailer/
  - https://www.natda.org/news/why-every-trailer-dealer-needs-a-software-solution
  - https://tracxn.com/d/companies/blackpurl/__IsMxQqcsiWKdAV1rEPqP-PjmZqUBNASngjyu93OUdUc
  - https://www.crunchbase.com/organization/blackpurl
  - https://everlogic.com/trailer-dealership-management-software/
  - https://everlogic.com/price/
  - https://www.lightspeeddms.com/industries/trailer/
  - https://www.lightspeeddms.com/solutions/pricing/
  - https://www.motilitysoftware.com/industries/streamlining-trailer-management-with-dms/
  - https://www.motilitysoftware.com/our-story/
  - https://www.linkedin.com/company/motilityss
  - https://www.soarrsolutions.com/
  - https://www.soarrsolutions.com/manage
  - https://www.linkedin.com/company/soarr
  - https://softbasesystems.com/dealer-management-system-software/trailer/
  - https://getlatka.com/companies/softbasesystems.com
  - https://www.linkedin.com/company/softbase-development-inc
  - https://www.trailerops.com/
  - https://www.trailerops.com/pricing
  - https://www.linkedin.com/company/trailer-ops
  - https://www.crunchbase.com/organization/trailer-ops
  - https://www.ibisworld.com/united-states/industry/truck-trailer-dealers/5419/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=206593603063802
  - https://adstransparency.google.com/advertiser/AR04450930099822264321?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=EverLogic&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR12637102512906698753?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=106419704467456
  - https://adstransparency.google.com/advertiser/AR04571436505507037185?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=366727146847
  - https://adstransparency.google.com/advertiser/AR07963274261940928513?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=SOARR&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Softbase%20Evolution&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=160264703845547
  - https://adstransparency.google.com/advertiser/AR05747739743353831425?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 24. Self-storage facilities  (NAICS 531130)

- **Status:** audited, not passing. Research: searched (follow-up slice0).
- **Method score:** 9.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Storeganise.
- **Boring test:** 3/3 — Move-ins, auto-pay, lien/auction notices.
- **US establishments:** 32,231 companies (unverified, https://www.naics.com/naics-code-description/?code=531130); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Storeganise | yes | 6 | yes | unverified (throttled run) | Storeganise | no | 41 / 3 (2023-11-12) | yes 12 | 2 |  |
| Storable Easy (Easy Storage Solutions) | yes | 3 | no | unverified (throttled run) | Storable | unverified (host blocked) | 700 / 4 (2025-08-20) | no 0 | 0 |  |
| Storable Edge (storEDGE) | yes | 3 | no | unverified (throttled run) | Storable | no | 21 / 15 (2023-12-13) | no 0 | 0 |  |
| Stora | yes | 2 | no | unverified (throttled run) | - | no | 7 / 0 (2026-01-07) | no 0 | 2 |  |
| 6Storage | yes | 0 | no | unverified (throttled run) | 6Storage | no | 6 / 2 (2025-09-30) | no 0 | 0 |  |
| Kinnovis | yes |  | unverified | unverified (throttled run) | KINNOVIS GmbH | no | 0 / 0 (-) | no 0 | 2 |  |
| SiteLink (Storable) | yes |  | unverified | unverified (throttled run) | Sitelink | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> — Self-storage facilities (NAICS 531130)
> - Incumbent jobs: unit map and rentals, online move-in, autopay/late fees and lien process, gate access control, tenant portal, dynamic pricing (Storable Edge/SiteLink/Easy, Stora, Storeganise, 6Storage, Kinnovis).
> - AaaS wedge: "remote-manager agent" for unmanned or single-manager sites: answers inquiries, quotes and rents units, runs collections and lien notices by state rules, schedules gate codes and cleanouts. Independents own ~65% of facilities and vendors already price $75–$150/mo per facility.
> - Weakest evidence: storEDGE/SiteLink prices are third-party; Storable vendor share not found; establishment count attribution (naics.com/insurancexdate) uncertain; Stora headcount 22 vs 39.
> - Searches (11): NAICS count; independent-operator software; best software 2026 pricing; storEDGE/SiteLink/Easy/Stora pricing; Stora company; Storeganise; REIT share; Storable history; 6Storage; Storable Easy; Kinnovis.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner of a single or few-facility independent operator (~65% of US facilities are owned by operators outside the top 100). Public-price incumbents: 5. Gatekeeper: no (Self Storage Association is a trade body; REITs run in-house systems; no franchise/association software mandate found). Top-4 share: public companies/REITs own 23% of facilities, next top-100 own 13%, small operators ~65%; by square footage small operators 40%, REITs/public 38%.

**Evidence URLs (30):**
  - https://www.naics.com/naics-code-description/?code=531130
  - https://us.6storage.com/self-storage-software/pricing/
  - https://www.selecthub.com/p/self-storage-software/6storage/
  - https://kinnovis.com/
  - https://kinnovis.com/pricing/
  - https://tracxn.com/d/companies/kinnovis/__5x0B3WzEEy3A7FeS3wVnV54xA8UESrHEFlsetx3pCv0
  - https://www.storable.com/products/sitelink/
  - https://softwareconnect.com/roundups/best-self-storage-software/
  - https://stora.co/
  - https://stora.co/pricing
  - https://getlatka.com/companies/stora.co
  - https://pitchbook.com/profiles/company/465807-43
  - https://www.storageunitsoftware.com/about/
  - https://www.capterra.com/p/112769/Self-Storage-Software/pricing/
  - https://www.storable.com/products/edge/
  - https://storeganise.com/pricing
  - https://getlatka.com/companies/storeganise
  - https://hk.linkedin.com/company/storeganise
  - https://www.neighbor.com/storage-blog/self-storage-industry-statistics/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=250296611969272
  - https://adstransparency.google.com/advertiser/AR05694026143615680513?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=114502993793090
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1251029251651742
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Stora&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR03857097166879195137?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=105157375402856
  - https://adstransparency.google.com/advertiser/AR17356714548312145921?region=US
  - https://adstransparency.google.com/advertiser/AR07149972451542171649?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=425879644251286
  - https://adstransparency.google.com/advertiser/AR09656045015029252097?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 25. Music schools & private music teachers  (NAICS 611610)

- **Status:** audited, not passing. Research: searched (follow-up slice3).
- **Method score:** 9.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Opus1.io.
- **Boring test:** 3/3 — Lesson scheduling, make-ups, tuition.
- **US establishments:** 17,704 companies verified active (NAICS 611610 fine arts schools) (unverified, https://siccode.com/naics-code/611610/fine-arts-schools); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Opus1.io | yes | 5 | yes | unverified (throttled run) | - | no | 200 / 3 (2025-02-13) | no 0 | 2 |  |
| Jumbula | yes | 4 | no | unverified (throttled run) | - | no | 35 / 4 (2022-08-08) | yes 4 | 0 |  |
| Teachworks | yes | 4 | no | unverified (throttled run) | - | no | 12 / 6 (2023-08-14) | yes 3 | 0 |  |
| Jackrabbit Music | yes | 3 | no | unverified (throttled run) | - | no | 55 / 20 (2025-08-01) | no 0 | 0 |  |
| Teach 'n Go | yes | 3 | no | unverified (throttled run) | Teach 'n Go | no | 9 / 3 (2022-10-19) | no 0 | 0 |  |
| Bizzly | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Duet (Music Teacher's Helper) | yes | 0 | no | unverified (throttled run) | - | no | 2 / 1 (2025-07-18) | no 0 | 0 |  |
| Fons | yes | 0 | no | unverified (throttled run) | - | no | 0 / 0 (-) | yes 2 | 0 |  |
| My Music Staff (Port 443 Inc.) | yes | 0 | no | unverified (throttled run) | My Music Staff | no | 43 / 1 (2023-03-21) | no 0 | 0 |  |
| Noto | yes | 0 | no | unverified (throttled run) | - | no | 12 / 0 (2025-11-02) | no 0 | 0 |  |
| Nova Music | yes | 0 | no | unverified (throttled run) | Nova Music | no | 3 / 1 (2026-06-11) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Music schools & private music teachers (11 searches)
> - Incumbent jobs: lesson calendar and make-ups, automatic invoicing/autopay and cancellation policy enforcement, parent portal, lesson notes/practice logs, teacher payroll for multi-teacher schools (My Music Staff, Opus1, Fons, Teachworks, Duet).
> - AaaS wedge: make-up-lesson and attrition agent for 5-30 teacher schools (reschedule, fill gaps, chase unpaid invoices, re-engage lapsed students); Opus1's $98-$325/mo tiers show schools pay more than solo teachers ($9-$20/mo).
> - Weakest evidence: establishment count is all fine-arts schools and excludes most sole-proprietor teachers; Fons domain and My Music Staff price came from third-party pages; Port 443 headcount not found.
> - Searches: NAICS count; school management; best teacher software pricing; studio invoicing/portal; School of Rock franchise; My Music Staff/Port 443; Opus1; Fons; Teachworks; Duet; IBISWorld concentration.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (solo teachers and 1-10 teacher studios; sub-$20/mo plans). Public-price incumbents: 5. Gatekeeper: no (franchise slice only). Top-4 share: highly fragmented; no company >5% (IBISWorld Private Music Classes).

**Evidence URLs (43):**
  - https://siccode.com/naics-code/611610/fine-arts-schools
  - https://www.bizzly.net/guides/best-music-school-software
  - https://www.duetpartner.com/
  - https://www.duetpartner.com/pricing
  - https://www.capterra.com/p/171305/Fons/
  - https://tutorbase.com/compare/fons-vs-mymusicstaff
  - https://www.jackrabbitclass.com/music/
  - https://jumbula.com/markets/music-school-software/
  - https://www.mymusicstaff.com/
  - https://www.musicaltrio.com/compare/best-software-solo-music-teachers
  - https://www.zoominfo.com/c/port-443-inc/466757043
  - https://ca.linkedin.com/company/port443
  - https://www.withnoto.com/blog/best-music-lesson-scheduling-software
  - https://trynovamusic.com/blog/how-to-choose-the-best-music-studio-management-software-in-2026
  - https://opus1.io/
  - https://opus1.io/pricing/
  - https://getlatka.com/companies/opus1.io
  - https://tracxn.com/d/companies/opus1io/__3pTChxAvqc6EzmAQY02EPBEJF30eFtytsNnAE7Bzbh8
  - https://www.teachngo.com/solutions/music-school-software
  - https://www.teachworks.com/music-school-management-software
  - https://www.teachworks.com/pricing
  - https://www.bachtorock.com/franchise-news/bach-to-rock-vs-school-of-rock/
  - https://www.ibisworld.com/united-states/industry/private-music-classes/6539/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Bizzly&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Duet&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR06441350659278110721?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Fons&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Jackrabbit%20Music&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR18236816105324675073?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Jumbula&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR00386200813556465665?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=567612439963170
  - https://adstransparency.google.com/advertiser/AR14200606363976990721?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Noto&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR06838102764371836929?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=307136149364095
  - https://adstransparency.google.com/advertiser/AR13474526345698476033?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Opus1.io&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR16158267060382597121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=169806999837691
  - https://adstransparency.google.com/advertiser/AR07663009112547917825?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Teachworks&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR09882076155836628993?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 26. Driving schools  (NAICS 611692)

- **Status:** audited, not passing. Research: searched (follow-up slice4).
- **Method score:** 9.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** DrivingSchoolSoftware.com (DrivingSchool.Software).
- **Boring test:** 3/3 — State-required hours logging, DMV forms, vehicle scheduling.
- **US establishments:** 23,946 (IBISWorld Driving Schools) (2025, https://www.ibisworld.com/industry-statistics/number-of-businesses/driving-schools-united-states/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| DrivingSchoolSoftware.com (DrivingSchool.Software) | yes | 5 | yes | unverified (throttled run) | - | no | 14 / 12 (2021-10-25) | no 0 | 2 |  |
| Teachworks (driving school page) | yes | 4 | no | unverified (throttled run) | - | no | 12 / 6 (2023-08-14) | yes 3 | 0 |  |
| BookingTimes | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Drive Scout | yes | 0 | no | unverified (throttled run) | Drive Scout | no | 0 / 0 (-) | no 0 | 0 |  |
| Drivers Ed Solutions | yes | 0 | no | unverified (throttled run) | Drivers Ed Solutions | no | 0 / 0 (-) | no 0 | 0 |  |
| GoDribe | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| MyDriveSchool | yes | 0 | no | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Software for Driving School | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> · Driving schools (NAICS 611692) — 8 tools, fragmentation 5/5
> - Core jobs: lesson scheduling by instructor and vehicle, student records and progress logs, online enrolment and payments, DMV/state certificate reporting, reminders to cut no-shows.
> - Incumbents: Drive Scout ($250/mo minimum), DrivingSchoolSoftware.com (3 staff, self-funded, demo-only), Teachworks ($16.49/mo + per lesson), BookingTimes ($61/mo, Australia), GoDribe ($49/mo), MyDriveSchool, Drivers Ed Solutions ($6.25/student), Software for Driving School ($49/mo).
> - Agent wedge: enrolment-to-certificate agent — answer parent inquiries, sell packages, fill instructor gaps from waitlists, and file the state completion/electronic-certificate reports (MA ATLAS, CA TVCC, TX TDLR) that are now mandatory.
> - Weakest evidence: several prices from roundups (GoDribe, Software for Driving School) with unknown domains; Drive Scout headcount not found; state portals confirmed as compliance gates but no vendor mandate found.
> - Searches (11): IBISWorld count, 2× tool discovery, Drive Scout pricing, Drive Scout company, DrivingSchoolSoftware company, concentration, DMV gatekeeper, Teachworks, GoDribe, DriverSchedule, MyDriveSchool, BookingTimes.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (driving school owner; $16-$250/mo). Public-price incumbents: 4. Gatekeeper: none found (state DMV portals such as MA ATLAS and CA TVCC require electronic records/reporting but do not name a vendor). Top-4 share: no company >5% (IBISWorld Driving Schools).

**Evidence URLs (29):**
  - https://www.ibisworld.com/industry-statistics/number-of-businesses/driving-schools-united-states/
  - https://bookingtimes.com/Complete-Driving-School-Software
  - https://www.softwaresuggest.com/bookingtimes
  - https://drivescout.com/
  - https://drivescout.com/pricing/
  - https://www.crunchbase.com/organization/drive-scout
  - https://www.driversedsolutions.com/pricing.phtml
  - https://www.drivingschoolsoftware.com/
  - https://www.capterra.com/p/175083/Total-Driving-School-Management/
  - https://getlatka.com/companies/drivingschoolsoftware.com
  - https://www.linkedin.com/company/drivingschool-software
  - https://www.capterra.ca/software/1025251/godribe
  - https://www.softwareadvice.com/driving-school/
  - https://mydriveschool.software/driving-school-software-features/
  - https://www.guideflow.com/blog/driving-school-software
  - https://www.teachworks.com/driving-school-management-software
  - https://www.teachworks.com/pricing
  - https://www.mass.gov/info-details/professional-driving-schools
  - https://www.ibisworld.com/united-states/industry/driving-schools/4995/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=BookingTimes&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1623645227925584
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=194404354029386
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=DrivingSchoolSoftware.com&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR01502266516601569281?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=GoDribe&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=MyDriveSchool&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Software%20for%20Driving%20School&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Teachworks&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR09882076155836628993?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 27. Tutoring centers  (NAICS 611691)

- **Status:** audited, not passing. Research: searched (follow-up slice0).
- **Method score:** 9.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Teachworks.
- **Boring test:** 3/3 — Session scheduling, progress reports, billing.
- **US establishments:** 7,885 companies (138,966 employees) (unverified, https://siccode.com/naics-code/611691/exam-preparation-tutoring); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Teachworks | yes | 6 | yes | unverified (throttled run) | - | no | 12 / 6 (2023-08-14) | yes 3 | 2 |  |
| TutorCruncher | yes | 3 | no | unverified (throttled run) | - | no | 33 / 18 (2021-10-25) | no 0 | 0 |  |
| Dewey | yes | 0 | no | unverified (throttled run) | Dewey | no | 0 / 0 (-) | no 0 | 0 |  |
| Oases Online | yes | 0 | no | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Pike13 | yes | 0 | no | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| TutorBird (Port 443) | yes | 0 | no | unverified (throttled run) | TutorBird | no | 8 / 0 (2023-10-18) | no 0 | 0 |  |
| Tutorbase | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Wise | yes | 0 | no | unverified (throttled run) | - | no | 1 / 0 (2026-06-27) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> — Tutoring centers (NAICS 611691)
> - Incumbent jobs: tutor–student scheduling, lesson-based invoicing and tutor payroll, parent portal, lead tracking, session notes (TutorBird, Teachworks, TutorCruncher, Oases, Tutorbase, Wise, Pike13, Dewey).
> - AaaS wedge: "matching-and-billing agent": intakes the parent lead, proposes tutor/time matches, books, sends prep/progress notes, bills per lesson, and pays tutors. Revenue-share pricing (TutorCruncher 1%, Tutorbase 1%) shows owners accept usage-based pricing.
> - Weakest evidence: Teachworks and Oases prices are third-party; TutorBird headcount is qualitative ("small team"); Wise pricing not shown; concentration figures conflict (Kumon 8.9% vs 15%).
> - Searches (10): NAICS count; "tutoring center" software; best tutoring software 2026 pricing; TutorBird/Pike13 pricing; Teachworks company; Port 443/TutorBird; IBISWorld/Kumon concentration; Kumon/Mathnasium franchise software; Tutorbase pricing; Wise.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner of an independent tutoring center or small agency (per-tutor pricing from $16.95/mo). Public-price incumbents: 4. Gatekeeper: no for independents (Kumon supplies its own operational software and Salesforce CRM to franchisees; Kumon 8.9% + Sylvan 4.5% share; 57% of centers are single-location or small chains). Top-4 share: top 10 players ~5% of revenue (2024); IBISWorld: Kumon 8.9%, Sylvan 4.5%.

**Evidence URLs (34):**
  - https://siccode.com/naics-code/611691/exam-preparation-tutoring
  - https://www.g2.com/sellers/dewey-learning-inc
  - https://tutorbase.com/compare/oases-vs-tutorcruncher
  - https://tutorbase.com/blog/best-billing-software-for-tutoring-businesses
  - https://www.teachworks.com/tutoring-management-software
  - https://www.teachngo.com/blog/best-tutoring-business-software-us
  - https://tracxn.com/d/companies/teachworks/__vrPpN-x2DqxGrVo3QTYruiUrE3R6tvNvkUABqWk6oes
  - https://www.teachngo.com/blog/teachworks-review
  - https://www.linkedin.com/company/teachworks
  - https://www.tutorbird.com/
  - https://www.capterra.com/p/181623/TutorBird/
  - https://www.port443.io/
  - https://ca.linkedin.com/company/port443
  - https://tutorcruncher.com/blog/best-tutoring-software
  - https://www.capterra.com/p/145838/TutorCruncher/
  - https://tutorbase.com/
  - https://tutorbase.com/blog/how-much-does-tutoring-software-cost
  - https://www.wise.live/
  - https://www.wise.live/pricing/
  - https://tracxn.com/d/companies/wise/__3UqTczmh8mfcGdUWmVjECrY0QY1HlT0aLPD6xgPrM-M
  - https://1851franchise.com/kumon-franchise-costs-fees-profit-and-data-for-2025-2729462
  - https://gitnux.org/us-tutoring-industry-statistics/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=34303826286
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Oases%20Online&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Pike13&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Teachworks&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR09882076155836628993?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=772690216132054
  - https://adstransparency.google.com/advertiser/AR03418666080669794305?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=TutorCruncher&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR04420460261794643969?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Tutorbase&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Wise&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR13612737706088988673?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 28. Snow removal contractors  (NAICS 561790)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 9.0 = ad score 5.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** Aspire.
- **Boring test:** 3/3 — Storm dispatch, per-push/seasonal contracts, slip-and-fall logs.
- **US establishments:** 114244 (2025, https://www.ibisworld.com/united-states/number-of-businesses/snowplowing-services/5400/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Aspire | yes | 8 | yes | 45 / 13 / 0 (2026-06-22) | Aspire Software | yes | 200 / 34 (2022-01-27) | yes 5 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| LMN (Landscape Management Network) | yes | 1 | no | 7 / 0 / 0 (2026-07-23) | - | yes | 4 / 0 (2025-05-08) | no 0 | 0 |  |
| Yeti Software (Yeti Snow) | yes | 0 | no | 1 / 0 / 0 (2026-08-21) | Yeti Software Inc | no | 27 / 1 (2025-07-09) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Snow removal contractors
> - Core jobs: seasonal vs per-push contract pricing, storm-night crew dispatch, proof-of-service photos and timestamps for slip-and-fall liability (Yeti), salt/equipment inventory, site-based pricing, budget-based estimating for landscape+snow hybrids (LMN).
> - Incumbents: Yeti Software ($95/mo, site-count pricing, snow-only origin), LMN ($297), QuoteIQ ($29.99), Aspire (enterprise). Jobber/Housecall Pro cited as needing workarounds for snow billing.
> - Agent wedge: storm-event operations agent - watches forecasts, pre-stages crews, sends per-push service confirmations with photo proof to commercial property managers, and generates the liability log automatically. Proof-of-service documentation is the job that commercial buyers actually demand.
> - Weakest evidence: IBISWorld count (114,244) is a proxy (many are landscapers with winter divisions); Yeti founding year and headcount unverified; no concentration figure beyond "highly fragmented" phrasing.

**The agent version** [hypothesis]: Forecast watch → pre-storm crew staging texts → per-push service confirmations with timestamped photos to property managers → seasonal/per-push invoice and slip-and-fall liability log. Needs: weather API, crew SMS, photo capture, PDF log, invoicing.

**Wedge** [hypothesis]: Storm-event proof-of-service and liability log agent for commercial snow contracts.

**Price ceiling:** incumbent public prices found [search-cited]:
  - LMN (Landscape Management Network): $297/mo Starter (1 office + 5 crew licenses); Professional $598/mo; implementation $847 (https://golmn.com/pricing/)
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - Yeti Software (Yeti Snow): $95/mo High Performance (free Test Drive plan; Enterprise custom) per https://softwarefinder.com/field-service/yeti-software (https://yetisoftware.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~6 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (6 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (landscapers running winter divisions; commercial contracts). Public-price incumbents: 3. Gatekeeper: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: described as highly fragmented (share unverified).

**Evidence URLs (20):**
  - https://www.ibisworld.com/united-states/number-of-businesses/snowplowing-services/5400/
  - https://www.cleansavannah.com/post/best-snow-removal-software-2026
  - https://golmn.com/pricing/
  - https://tracxn.com/d/companies/singleops/__wpGjZc-FoFtwDsALEMuFrBrrabFaDIuhque36M33rDk
  - https://www.capterra.com/p/142064/LMN/
  - https://myquoteiq.com/best-software-for-snow-removal-businesses/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://yetisoftware.com/industry/for-snow/
  - https://yetisoftware.com/pricing/
  - https://www.crunchbase.com/organization/yeti-snow-management-system
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1877258095867146
  - https://adstransparency.google.com/advertiser/AR16502270198212984833?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=LMN&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR08759083443637190657?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=236760712858654
  - https://adstransparency.google.com/advertiser/AR07051766907627634689?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 29. Independent auto repair shops  (NAICS 811111)

- **Status:** audited, not passing. Research: searched (follow-up slice6).
- **Method score:** 9.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Estimates, parts ordering, appointment scheduling.
- **US establishments:** 307,058 businesses (2026, https://www.ibisworld.com/united-states/number-of-businesses/auto-mechanics/1689); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| AutoLeap | yes | 4 | no | unverified (throttled run) | AutoLeap | no | 200 / 33 (2023-09-20) | yes 12 | 0 |  |
| Shop-Ware | yes | 4 | no | unverified (throttled run) | Shopware | no | 32 / 16 (2022-06-01) | yes 2 | 0 |  |
| Shopmonkey | yes | 4 | no | unverified (throttled run) | Shopmonkey | no | 500 / 17 (2026-03-29) | yes 10 | 0 |  |
| Tekmetric | yes | 4 | no | unverified (throttled run) | Tekmetric | no | 37 / 8 (2026-04-29) | yes 12 | 0 |  |
| Mitchell 1 Manager SE | yes | 3 | no | unverified (throttled run) | - | no | 65 / 37 (2021-10-25) | no 0 | 0 |  |
| NAPA TRACS | yes | 3 | no | unverified (throttled run) | NAPA TRACS | no | 11 / 10 (2024-10-17) | no 0 | 0 |  |
| Garage360 | yes | 0 | no | unverified (throttled run) | - | no | 1 / 0 (2026-08-13) | no 0 | 0 |  |
| autoGMS | yes |  | unverified | unverified (throttled run) | Autogms | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> — Independent auto repair shops · NAICS 811111 · 7 searches
> - **Incumbent jobs:** estimates/repair orders, digital vehicle inspections with photo approvals, parts ordering, two-way texting, payments, tech time tracking (Tekmetric, Shopmonkey, AutoLeap, Shop-Ware, NAPA TRACS).
> - **Wedge:** phone/text agent for estimate approvals, appointment reminders and declined-service follow-up, sold as an add-on to whatever SMS the shop runs.
> - **Weakest evidence:** two establishment figures for the NAICS (97,995 vs 83,027) plus IBISWorld's broader 307,058; the fragmentation is not in doubt but the buyer count is. Incumbents are large and VC-funded (Shopmonkey $110M, AutoLeap $54M).
> - **Fragmentation 5/5:** four public prices, low concentration, NAPA/Bosch tie-ins do not cover most shops.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator shop owner (single-location independents; vendors price per shop $179-279/mo). Public-price incumbents: 4. Gatekeeper: partial only: NAPA AutoCare perks tied to NAPA TRACS and Bosch Auto Service franchise-supplied software, but neither covers most independents. Top-4 share: low concentration (largest TravelCenters of America).

**Evidence URLs (29):**
  - https://www.ibisworld.com/united-states/number-of-businesses/auto-mechanics/1689
  - https://www.cbinsights.com/company/autoleap
  - https://www.g2.com/products/autoleap/pricing
  - https://www.crunchbase.com/organization/autoleap
  - https://garage360.io/blog/best-auto-repair-shop-software
  - https://napatracs.com/
  - https://shop-ware.com/packages/
  - https://www.shopmonkey.io/
  - https://www.shopmonkey.io/pricing
  - https://getlatka.com/companies/shopmonkey
  - https://www.cbinsights.com/company/shopmonkey/financials
  - https://www.tekmetric.com/
  - https://www.tekmetric.com/pricing
  - https://myautogms.com/blog/best-auto-repair-shop-management-software-2026
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=106770701199975
  - https://adstransparency.google.com/advertiser/AR12240226300437987329?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Garage360&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR12765659010154102785?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Mitchell%201%20Manager%20SE&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR10888021096435548161?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=614028805744077
  - https://adstransparency.google.com/advertiser/AR11404447483070251009?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=120337994672097
  - https://adstransparency.google.com/advertiser/AR03146070416267673601?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1789987241232022
  - https://adstransparency.google.com/advertiser/AR01431268173167984641?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183661115325642
  - https://adstransparency.google.com/advertiser/AR16588403473821728769?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=503903039482255

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 30. Independent tire shops  (NAICS 441320)

- **Status:** audited, not passing. Research: searched (follow-up slice3).
- **Method score:** 9.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Tire lookup, appointment scheduling, TPMS/registration paperwork.
- **US establishments:** 23,069 companies verified active (NAICS 441320) (2021, https://siccode.com/naics-code/441320/tire-dealers-2); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| AutoLeap | yes | 4 | no | unverified (throttled run) | AutoLeap | no | 200 / 33 (2023-09-20) | yes 12 | 0 |  |
| Tekmetric | yes | 4 | no | unverified (throttled run) | Tekmetric | no | 37 / 8 (2026-04-29) | yes 12 | 0 |  |
| Tire Guru | yes | 3 | no | unverified (throttled run) | Tire Guru | no | 6 / 6 (2023-06-09) | no 0 | 0 |  |
| ASA Automotive Systems (GTX / TireMaster) | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Anolla | yes | 0 | no | 0 / 0 / 0 (-) | Anolla | no | 0 / 0 (-) | no 0 | 0 |  |
| EZnet Scheduler | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Tire Power (TCS Technologies) | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| TireShop (FreedomSoft) | yes |  | unverified | unverified (throttled run) | Tire shop | no | 0 / 0 (-) | no 0 | 0 |  |
| Torque360 | yes | 0 | no | unverified (throttled run) | Torque 360 | no | 2 / 0 (2026-03-27) | no 0 | 0 |  |
| Used Tire Shop | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Independent tire shops (11 searches)
> - Incumbent jobs: tire catalog/fitment and inventory, POS and work orders, bay scheduling, national-account and manufacturer program billing, distributor ordering (ASA/GTX, Tire Guru, TireShop, Torque360); online booking and seasonal tire storage (Anolla, EZnet).
> - AaaS wedge: quote-and-book agent that answers "do you have 225/45R17, when can I come in" by phone/text, checks distributor stock and fills bays; owner-operators pay $90-$135/mo today.
> - Weakest evidence: establishment count is 2021-dated; Tire Guru has a pricing page but no amounts surfaced; ASA headcount from PitchBook (now Constellation-owned).
> - Searches: NAICS count x2; tire shop software; best tire POS pricing; scheduling; IBISWorld concentration; TireShop pricing; Tire Guru; Torque360; ASA; Goodyear/Bridgestone dealer programs; Tire Guru pricing retry.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (independent tire dealers = two-thirds of revenue; many <5 employees). Public-price incumbents: 3. Gatekeeper: no (manufacturer programs offer, do not mandate). Top-4 share: low concentration; high fragmentation; ATD <10%; independents two-thirds of revenue.

**Evidence URLs (33):**
  - https://siccode.com/naics-code/441320/tire-dealers-2
  - https://www.asaauto.com/
  - https://pitchbook.com/profiles/company/62165-26
  - https://www.linkedin.com/company/asa-tire-systems
  - https://anolla.com/en/tire-shop-software
  - https://autoleap.com/tire-shop-software/
  - https://eznetscheduler.com/industry/tire-shop-scheduling-software/
  - https://www.tekmetric.com/feature/tire-suite
  - https://tireguru.net/
  - https://tireguru.net/pricing/
  - https://leadiq.com/c/tire-guru-software-websites-and-more/5eb99f00102cc03532d8b557
  - https://tcstire.com/point-of-sale
  - https://tireshopsoftware.com/about-freedomsoft/
  - https://www.softwareadvice.com/auto-repair/tireshop-profile/
  - https://www.torque360.co/tire-shop-management-software/
  - https://www.torque360.co/pricing/
  - https://www.usedtireshop.net/
  - https://www.asaauto.com/products/cornerstone
  - https://www.ibisworld.com/united-states/industry/tire-dealers/1013/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=ASA%20Automotive%20Systems&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102041562207285
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=106770701199975
  - https://adstransparency.google.com/advertiser/AR12240226300437987329?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=EZnet%20Scheduler&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183661115325642
  - https://adstransparency.google.com/advertiser/AR16588403473821728769?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=335500296521328
  - https://adstransparency.google.com/advertiser/AR15997056837316771841?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Tire%20Power&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=533964353134707
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1613701312281740
  - https://adstransparency.google.com/advertiser/AR13168561740343934977?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Used%20Tire%20Shop&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 31. Boutique fitness & yoga studios  (NAICS 713940)

- **Status:** audited, not passing. Research: searched (follow-up slice6).
- **Method score:** 9.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 2/3 — Class scheduling, memberships, waivers.
- **US establishments:** 37,317 businesses (Pilates & Yoga Studios) (unverified, https://www.ibisworld.com/united-states/industry/pilates-yoga-studios/4185/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Arketa | yes | 4 | no | unverified (throttled run) | Arketa | no | 94 / 31 (2025-03-18) | yes 4 | 0 |  |
| Vagaro (yoga) | yes | 4 | no | unverified (throttled run) | Vagaro | no | 9 / 9 (2022-03-10) | yes 8 | 0 |  |
| WellnessLiving | yes | 4 | no | unverified (throttled run) | Wellness Living | no | 200 / 13 (2025-06-13) | yes 2 | 0 |  |
| Mindbody | yes | 3 | no | unverified (throttled run) | - | no | 800 / 11 (2025-06-04) | no 0 | 0 |  |
| Momence (Clubessential Holdings) | yes | 3 | no | unverified (throttled run) | Momence | no | 300 / 29 (2025-01-07) | no 0 | 0 |  |
| Walla | yes | 3 | no | unverified (throttled run) | WALLA | no | 32 / 8 (2024-10-31) | no 0 | 0 |  |
| Zenoti | yes | 3 | no | unverified (throttled run) | Zenoti | no | 5 / 3 (2026-01-08) | no 0 | 0 |  |
| Momoyoga | yes | 0 | no | unverified (throttled run) | Momoyoga | no | unverified (host blocked) / unverified (host blocked) (-) | no 0 | 0 |  |
| StudioBookings | yes | 0 | no | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> — Boutique fitness & yoga studios · NAICS 713940 · 8 searches
> - **Incumbent jobs:** class scheduling and booking, memberships/packs and autopay, waitlists, instructor payroll, marketing automation, branded apps (Mindbody, Momence, Arketa, Walla, WellnessLiving, Zenoti).
> - **Wedge:** lead-to-intro-offer conversion and lapsed-member win-back agent; every incumbent charges extra for marketing automation, and studios are owner-run.
> - **Weakest evidence:** Mindbody and Momence do not publish plan pricing (figures from third-party guides); the establishment figure is IBISWorld's Pilates & Yoga Studios count, not boutique fitness overall.
> - **Fragmentation 5/5:** four public prices, no firm >5%, franchisors (Xponential 2,700+ studios) dictate software only inside their systems. Heavily contested incumbents (Arketa $22.6M raised 2025, Walla ~$18M).

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator studio owner (Arketa $49/mo individual tier; WellnessLiving $69/mo). Public-price incumbents: 4. Gatekeeper: none for independents; franchisors (Xponential 2,700+ NA studios, Orangetheory 1,500+, F45 3,300 global) dictate software only inside their systems. Top-4 share: highly fragmented; no company >5% (Pilates & Yoga Studios).

**Evidence URLs (33):**
  - https://www.ibisworld.com/united-states/industry/pilates-yoga-studios/4185/
  - https://www.arketa.com/pricing
  - https://pitchbook.com/profiles/company/439508-26
  - https://vibefam.com/arketa-pricing-2026/
  - https://www.mindbodyonline.com/business/education/blog/new-mindbody-pricing-united-states
  - https://momence.com/pricing
  - https://athletechnews.com/clubessential-holdings-acquires-saas-platform-momence/
  - https://www.booknetic.com/blog/yoga-studio-management-software
  - https://www.studiobookings.com/blog/best-yoga-studio-management-software
  - https://lunacal.ai/yoga-studio-booking-scheduling-software/best
  - https://www.guideflow.com/blog/barbershop-software
  - https://www.hellowalla.com/made-for/yoga
  - https://www.hellowalla.com/us/pricing
  - https://www.sdbj.com/technology/software/walla-bolsters-financial-fitness-of-fitness-studios/
  - https://app.dealroom.co/companies/walla_software
  - https://www.wellnessliving.com/pricing/
  - https://www.businesswire.com/news/home/20250107098298/en/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=101799137942259
  - https://adstransparency.google.com/advertiser/AR13598190746346717185?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Mindbody&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR17054110617427771393?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=107210108530763
  - https://adstransparency.google.com/advertiser/AR13068919675897774081?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1548631865425338
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=StudioBookings&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=994274800426846
  - https://adstransparency.google.com/advertiser/AR09419698221770342401?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=442774709072602
  - https://adstransparency.google.com/advertiser/AR03363009351827587073?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=443272975537137
  - https://adstransparency.google.com/advertiser/AR08215298278535725057?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=311504822253769
  - https://adstransparency.google.com/advertiser/AR06124471940729012225?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 32. Medical billing companies  (NAICS 541219)

- **Status:** audited, not passing. Research: searched (follow-up slice4).
- **Method score:** 9.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Claims scrubbing, denials follow-up, payer portals.
- **US establishments:** over 3,000 (medical billing services firms) (unverified, https://verticaliq.com/product/medical-billing-services/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| PracticeSuite | yes | 4 | no | unverified (throttled run) | PracticeSuite | no | 23 / 7 (2024-04-15) | yes 12 | 0 |  |
| Tebra (Kareo) | yes | 4 | no | 0 / 0 / 0 (-) | Tebra | no | 400 / 21 (2024-01-22) | yes 12 | 0 |  |
| AdvancedMD (AdvancedBiller) | yes | 3 | no | 0 / 0 / 0 (-) | AdvancedMD | no | 500 / 9 (2026-03-16) | no 0 | 0 |  |
| CollaborateMD | yes | 3 | no | 0 / 0 / 0 (-) | CollaborateMD | no | 200 / 9 (2025-01-10) | no 0 | 0 |  |
| EZClaim | yes | 3 | no | 0 / 0 / 0 (-) | - | no | 13 / 6 (2024-03-14) | no 0 | 0 |  |
| ImagineSoftware (ImagineOne) | yes | 0 | no | 0 / 0 / 0 (-) | ImagineSoftware | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> · Medical billing companies (NAICS 541219) — 6 tools, fragmentation 5/5
> - Core jobs: multi-client claim scrubbing and submission, ERA/denial work queues across practices, eligibility checks, patient statements, per-client KPI dashboards.
> - Incumbents: ImagineSoftware (2000, ~204 staff, PE-owned), PracticeSuite (billing-company program, tailored pricing), CollaborateMD ($235/mo minimum, per-claim), EZClaim ($149/mo third-party), AdvancedMD AdvancedBiller ($229–$1,070/mo tiers), Tebra partner program ($99/provider/mo starter).
> - Agent wedge: denial-appeal agent for small billing companies — read the 835/denial code, pull the chart note, draft and submit the appeal, track timely-filing deadlines per payer; charge per recovered claim.
> - Weakest evidence: establishment count is "over 3,000" (Vertical IQ) without a year; the concentration citation is IBISWorld's adjacent Medical Claims Processing report; several prices are third-party restatements; gatekeeper risk (client practices' EHR dictating the biller's PM) unverified.
> - Searches (10): NAICS count, 2× tool discovery, PracticeSuite, CollaborateMD, EZClaim, ImagineSoftware company, concentration, Tebra program, AdvancedMD program.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (billing company owner; per-provider or per-claim pricing, $235/mo minimums). Public-price incumbents: 4. Gatekeeper: none found (no payer/clearinghouse/association software mandate; client practices' EHR choice can constrain billers - unverified). Top-4 share: low market share concentration (IBISWorld Medical Claims Processing Services).

**Evidence URLs (25):**
  - https://verticaliq.com/product/medical-billing-services/
  - https://www.advancedmd.com/medical-billing/for-billing-services/
  - https://www.advancedmd.com/software-pricing/
  - https://www.collaboratemd.com/pricing/medical-billing-and-labs/
  - https://ezclaim.com/features-pricing/
  - https://www.capterra.com/p/106348/EZClaim-Medical-Billing/
  - https://imagineteam.com/specialties/billing-companies/
  - https://getlatka.com/companies/imagine-software-
  - https://www.crunchbase.com/organization/technology-partners-dba-imagine-software
  - https://www.linkedin.com/company/technology-partners-inc--dba-imagine-software-
  - https://practicesuite.com/medical-billing-company/
  - https://practicesuite.com/products/pricing/
  - https://www.tebra.com/pricing
  - https://www.ibisworld.com/united-states/industry/medical-claims-processing-services/4792/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=118490988180563
  - https://adstransparency.google.com/advertiser/AR07043581026378973185?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=70921490468
  - https://adstransparency.google.com/advertiser/AR01928475191038443521?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=EZClaim&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR17079652478699438081?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=225969900947047
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=470820643000516
  - https://adstransparency.google.com/advertiser/AR00621597560049500161?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1048055931885460
  - https://adstransparency.google.com/advertiser/AR16832224910335016961?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 33. Courier & last-mile delivery companies  (NAICS 492210)

- **Status:** audited, not passing. Research: searched (follow-up slice3).
- **Method score:** 9.0 = ad score 5.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** Shipday.
- **Boring test:** 3/3 — Dispatch, proof of delivery, driver settlements.
- **US establishments:** 5,362 establishments / 4,786 businesses (NAICS 492210, 2020 Census) (2020, https://www.naics.com/naics-code-description/?code=492210); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Shipday | yes | 6 | yes | unverified (throttled run) | - | no | 69 / 28 (2022-10-27) | yes 12 | 2 |  |
| CXT Software | yes | 4 | no | unverified (throttled run) | CXT Software | no | 11 / 5 (2021-10-25) | yes 2 | 0 |  |
| Onfleet | yes | 4 | no | unverified (throttled run) | Onfleet | no | 16 / 6 (2023-08-14) | yes 6 | 0 |  |
| OnTime 360 (Vesigo Studios) | yes | 3 | no | unverified (throttled run) | OnTime 360 | no | 44 / 14 (2023-08-18) | no 0 | 0 |  |
| Transvirtual | yes | 3 | no | unverified (throttled run) | - | no | 27 / 5 (2024-01-31) | no 0 | 0 |  |
| Routific | yes | 0 | no | unverified (throttled run) | - | no | 4 / 2 (2025-05-07) | no 0 | 0 |  |
| Simply Dispatch | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Track-POD | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Wodely | yes | 0 | no | unverified (throttled run) | - | no | 2 / 2 (2023-06-20) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Courier & last-mile delivery companies (11 searches)
> - Incumbent jobs: order intake and dispatch, route optimization, driver app with proof of delivery, customer tracking portal, recurring invoicing and QuickBooks sync (OnTime 360, CXT, Shipday, Track-POD, Onfleet).
> - AaaS wedge: dispatcher agent for 5-30 driver firms (intake by email/phone, quote, assign, exception texts) replacing a dispatcher seat rather than the $99-$249/mo software.
> - Weakest evidence: establishment count sources disagree by an order of magnitude (siccode 671 vs Census 5,362 vs IBISWorld 3m); IBISWorld concentration is "moderate" because FedEx/UPS sit in the same industry; CXT headcount conflicts (11-50 vs ~200).
> - Searches: NAICS count x2; dispatch software; best courier software pricing; billing/portal; IBISWorld concentration; OnTime/Vesigo; CXT; Shipday; Track-POD; CLDA.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (local courier firms of 1-50 drivers; per-driver/per-order pricing). Public-price incumbents: 5. Gatekeeper: no. Top-4 share: moderate concentration; largest FedEx (US); global low concentration.

**Evidence URLs (37):**
  - https://www.naics.com/naics-code-description/?code=492210
  - https://cxtsoftware.com/
  - https://cxtsoftware.com/pricing/
  - https://www.linkedin.com/company/cxtsoftware
  - https://www.ontime360.com/features
  - https://www.ontime360.com/courier-software-cost
  - https://www.crowdreviews.com/ontime-360/company-info
  - https://vesigo.com/company/about-us
  - https://www.linkedin.com/company/vesigo-studios-inc
  - https://onfleet.com/blog/courier-dispatch-software/
  - https://www.routific.com/blog/best-courier-software
  - https://www.shipday.com/pricing
  - https://getlatka.com/companies/shipday.com
  - https://www.crunchbase.com/organization/shipday
  - https://courier-software.com/
  - https://www.track-pod.com/courier-software/
  - https://www.track-pod.com/pricing-delivery-app/
  - https://www.transvirtual.com/us/courier-software/
  - https://www.wodely.com/top-10-courier-management-software-in-2026-best-tools-for-efficient-last-mile-delivery/
  - https://clda.org/
  - https://www.ibisworld.com/united-states/industry/couriers-local-delivery-services/1950/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=208045941935
  - https://adstransparency.google.com/advertiser/AR04082954825367552001?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=284594628299005
  - https://adstransparency.google.com/advertiser/AR07744654001303453697?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=225681110849279
  - https://adstransparency.google.com/advertiser/AR11855280923002011649?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Routific&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR12662217849566134273?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Shipday&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR04558017137888722945?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Simply%20Dispatch&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Track-POD&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Transvirtual&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR03142043386211467265?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Wodely&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR07060053531629191169?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 34. Boat dealers & marinas  (NAICS 441222)

- **Status:** audited, not passing. Research: searched (follow-up slice3).
- **Method score:** 9.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Slip billing, winterization scheduling, unit inventory.
- **US establishments:** 7,896 companies verified active (NAICS 441222 boat dealers) (unverified, https://siccode.com/naics-code/441222/boat-dealers); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Lightspeed DMS | yes | 4 | no | unverified (throttled run) | Lightspeed DMS | no | 74 / 12 (2025-02-25) | yes 12 | 0 |  |
| Storable Marine | yes | 4 | no | unverified (throttled run) | Storable Marine Rentals | no | 19 / 18 (2025-11-24) | yes 10 | 0 |  |
| BiT DMS | yes | 0 | no | unverified (throttled run) | - | no | 16 / 1 (2024-09-10) | no 0 | 0 |  |
| DealerRock | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| DockMaster | yes | 0 | no | unverified (throttled run) | Dockmaster | no | 6 / 0 (2025-02-06) | no 0 | 0 |  |
| Dockwa | yes |  | unverified | unverified (throttled run) | Dockwa | no | 0 / 0 (-) | no 0 | 2 |  |
| Ideal Computer Systems | yes |  | unverified | unverified (throttled run) | Ideal Computer Systems | no | 0 / 0 (-) | no 0 | 0 |  |
| MARINAGO (Scribble Software) | yes | 0 | no | unverified (throttled run) | MarinaGo | no | 3 / 0 (2025-01-21) | no 0 | 0 |  |
| MarinaOffice | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| SlipBoss | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Slipax | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Slipify | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Boat dealers & marinas (11 searches)
> - Incumbent jobs: slip reservations and seasonal contracts, utility/fuel billing, dry-stack and service work orders, ship store POS (DockMaster, MARINAGO, SlipBoss, Dockwa); dealers: unit inventory, F&I, parts and service (DealerRock, BiT, Lightspeed).
> - AaaS wedge: slip-waitlist and seasonal-renewal agent for family-run marinas (chase contracts, insurance certificates and payments; fill cancellations from the waitlist) on top of a $100-$250/mo tool; DealerRock's $390/mo month-to-month DMS shows dealers accept self-serve pricing.
> - Weakest evidence: marinas' own NAICS (713930) was not counted; Dockwa and Bonfire pricing amounts not surfaced; DockMaster now a PE rollup asset with unverified headcount.
> - Searches: NAICS count; marina management; best boat DMS pricing; marina pricing; IBISWorld concentration; SlipBoss; MARINAGO; DockMaster ownership; Dockwa funding; DealerRock; manufacturer DMS mandate; Dockwa pricing retry.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (family-run marinas and single-location boat dealers; per-slip/per-location pricing). Public-price incumbents: 3. Gatekeeper: no. Top-4 share: Boat Sales & Repair: low concentration (largest MarineMax); Marinas: highly fragmented, top 3 <5% of revenue.

**Evidence URLs (43):**
  - https://siccode.com/naics-code/441222/boat-dealers
  - https://www.bitdms.com/marine/
  - https://www.guideflow.com/blog/boat-dealer-software
  - https://www.dealerrock.com/marine-dms-software/
  - https://www.dealerrock.com/pricing/
  - https://www.crunchbase.com/organization/dealerrock
  - https://www.dockmaster.com/solutions/marina-management
  - https://www.trysignalbase.com/news/acquisitions/dockmaster-software-acquired-by-aspire-software-acquisition
  - https://www.linkedin.com/company/dockmastersoftware
  - https://marinas.dockwa.com/
  - https://marinas.dockwa.com/marina-software-pricing
  - https://getlatka.com/companies/dockwa.com
  - https://tracxn.com/d/companies/dockwa/__amygSuv0ZWamLsxD6eQUW3og9Mi-QP5ng2J0A2xXauw
  - https://www.idealcomputersystems.com/dealer-management-software-marine
  - https://www.lightspeeddms.com/industries/marine/
  - https://www.marinago.com/
  - https://www.softwareadvice.com/marine/marinago-profile/
  - https://www.marinaoffice.net/
  - https://www.capterra.com/p/98609/MarinaOffice/
  - https://slipboss.com/
  - https://www.softwareadvice.com/product/536921-SlipBoss/
  - https://slipax.com/solutions/marina-management-companies
  - https://www.slipifymarinas.com/
  - https://www.storablemarine.com/marina-slip-management-software/
  - https://tradeonlytoday.com/post-type-feature/get-with-the-program/
  - https://www.ibisworld.com/united-states/industry/marinas/1654/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=BiT%20DMS&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR10061413219655745537?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=DealerRock&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=496159837446396
  - https://adstransparency.google.com/advertiser/AR14320538085857689601?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1514293938859347
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=240343959383518
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=106419704467456
  - https://adstransparency.google.com/advertiser/AR04571436505507037185?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1159814977218472
  - https://adstransparency.google.com/advertiser/AR17405601704321220609?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=MarinaOffice&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=SlipBoss&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Slipax&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Slipify&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=750057911994973
  - https://adstransparency.google.com/advertiser/AR14575583431556595713?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 35. Laundromats  (NAICS 812310)

- **Status:** audited, not passing. Research: searched (follow-up slice1).
- **Method score:** 9.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** CleanCloud.
- **Boring test:** 3/3 — Machine uptime, wash-and-fold orders, cash/coin reconciliation.
- **US establishments:** ~29,500 coin laundries (~$5B gross revenue) (unverified, https://laundryassociation.org/for-investors/industry-overview/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| CleanCloud | yes | 5 | yes | unverified (throttled run) | - | no | 38 / 18 (2023-05-11) | no 0 | 2 |  |
| Cents | yes | 3 | no | unverified (throttled run) | CENTS | no | 200 / 15 (2022-12-16) | no 0 | 0 |  |
| Curbside Laundries | yes | 3 | no | unverified (throttled run) | Curbside Laundries | no | 42 / 5 (2025-07-28) | no 0 | 0 |  |
| LaundryMatch / LaunderPay | yes |  | unverified | unverified (throttled run) | LaundryMatch | no | 0 / 0 (-) | no 0 | 0 |  |
| The Laundry Boss | yes | 0 | no | unverified (throttled run) | The Laundry Boss | no | 1 / 0 (2025-04-25) | no 0 | 0 |  |
| Wash-Dry-Fold POS | yes | 0 | no | unverified (throttled run) | - | no | 4 / 2 (2025-02-23) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> · Laundromats (NAICS 812310)
> - **Incumbent jobs:** attended POS for wash-dry-fold by weight, machine payments, pickup-and-delivery ordering and routing, customer notifications, employee time. Tools: Cents, Curbside Laundries, CleanCloud, Wash-Dry-Fold POS, LaundryMatch, The Laundry Boss.
> - **Agent wedge:** a pickup-and-delivery growth agent that answers order texts, books routes, upsells recurring plans and reactivates lapsed households; the well-funded incumbent (Cents, $184M raised) is pushing an AI receptionist, so speed matters.
> - **Weakest evidence:** establishment counts range 4,051 (siccode) to 29,500 (CLA) to 18,375 (IBISWorld-derived); Wash-Dry-Fold headcount not found.
> - **Searches (8):** NAICS 812310 count; best laundromat software 2026; Cents/Curbside/CleanCloud pricing; laundromat fragmentation; Cents funding; CLA laundromat count; plus gap-fill Wash-Dry-Fold company, CleanCloud company, Curbside company.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (laundromat owner). Public-price incumbents: 3. Gatekeeper: no (67% of locations independent; ~80% single-location; no franchisor software mandate found). Top-4 share: top-5 = 32% of revenue (IBISWorld via VantaInsights).

**Evidence URLs (28):**
  - https://laundryassociation.org/for-investors/industry-overview/
  - https://www.trycents.com/
  - https://tracxn.com/d/companies/cents/__yxiP-gXq_ChEvBZ3hQsO6IhqoifY12AlSySLcq-6as0
  - https://www.trycents.com/news/series-c-140-million-sumeru-equity
  - https://cleancloudapp.com/laundromats
  - https://pitchbook.com/profiles/company/228558-61
  - https://tracxn.com/d/companies/cleancloud/__58xETg9ZD9h5VbVy3qdR-fdSZLb1QZBCx36Ox3gWqn8
  - https://www.curbsidelaundries.com/
  - https://www.zoominfo.com/c/curbside-laundries-llc/403187587
  - https://www.linkedin.com/in/mrsimmons/ (founder)
  - https://www.getlaundrymatch.com/post/best-laundromat-pos-software
  - https://thelaundryboss.com/laundromat-industry-data-statistics/
  - https://www.washdryfoldpos.com/
  - https://www.washdryfoldpos.com/best-laundromat-pos-systems-in-2026-compared/
  - https://www.guideflow.com/blog/laundromat-software
  - https://vantainsights.com/insights/laundromat-industry-trends
  - https://commercialobserver.com/2026/05/big-shift-in-retail-space-as-institutional-capital-moves-into-laundromats/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=317470618390051
  - https://adstransparency.google.com/advertiser/AR10361297508528816129?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=CleanCloud&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR13061698341224579073?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=238713076577782
  - https://adstransparency.google.com/advertiser/AR12690010497039204353?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=751829274677953
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=776979862459439
  - https://adstransparency.google.com/advertiser/AR10917406025724198913?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Wash-Dry-Fold%20POS&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR14540040481238155265?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 36. Pet grooming salons & mobile groomers  (NAICS 812910)

- **Status:** audited, not passing. Research: searched (follow-up slice3).
- **Method score:** 9.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Appointments, vaccination records, reminders.
- **US establishments:** 32,943 companies verified active (NAICS 812910 pet care ex-vet) (unverified, https://siccode.com/naics-code/812910/pet-care); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| MoeGo | yes | 4 | no | unverified (throttled run) | - | no | 900 / 5 (2026-06-16) | yes 3 | 0 |  |
| Vonigo | yes | 4 | no | 0 / 0 / 0 (-) | Vonigo | no | 77 / 5 (2024-12-22) | yes 3 | 0 |  |
| DaySmart Pet | yes | 3 | no | unverified (throttled run) | DaySmart Pet | no | 300 / 37 (2023-06-07) | no 0 | 0 |  |
| GrooMore | yes | 3 | no | unverified (throttled run) | - | no | 12 / 3 (2026-05-11) | no 0 | 0 |  |
| Groomsoft | yes | 3 | no | unverified (throttled run) | Groomsoft | no | 47 / 11 (2021-10-25) | no 0 | 0 |  |
| Koalendar | yes | 3 | no | unverified (throttled run) | Koalendar | no | 35 / 7 (2025-10-30) | no 0 | 0 |  |
| Vagaro | yes | 3 | no | unverified (throttled run) | Vagaro | no | 10 / 10 (2022-03-10) | no 0 | 0 |  |
| Animalo | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Anolla | yes | 0 | no | 0 / 0 / 0 (-) | Anolla | no | 0 / 0 (-) | no 0 | 0 |  |
| Groomer.io | yes | 0 | no | unverified (throttled run) | Groomer.io | no | 9 / 0 (2025-07-03) | no 0 | 0 |  |
| ShakeYourTail | yes | 0 | no | unverified (throttled run) | Shake your tail | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Pet grooming salons & mobile groomers (10 searches)
> - Incumbent jobs: online booking, per-van route optimization and service radius, pet profiles/vaccination records, two-way SMS, deposits/no-show fees, recurring appointments (MoeGo, Groomer.io, Groomsoft, GrooMore).
> - AaaS wedge: rebooking and route-filling agent for single-van groomers (fill cancellations by proximity, chase overdue pets, confirm by text); $29.95-$99/mo incumbents leave room for a per-van agent fee.
> - Weakest evidence: count is whole pet-care NAICS; GrooMore/Vagaro/DaySmart prices via third-party blogs; MoeGo is VC-backed (no headcount bonus).
> - Searches: NAICS count; salon booking; best grooming software pricing; mobile routing; IBISWorld concentration; MoeGo; Groomer.io; Groomsoft; GrooMore; franchise software.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (solo salons and single-van mobile groomers; per-van pricing). Public-price incumbents: 5. Gatekeeper: no (franchise slice only). Top-4 share: highly fragmented; no company >5% (IBISWorld Pet Grooming & Boarding).

**Evidence URLs (42):**
  - https://siccode.com/naics-code/812910/pet-care
  - https://www.animalo.com/blog/pet-grooming-software-ultimate-2026-guide-for-salons
  - https://anolla.com/en/pet-grooming-software
  - https://www.groomore.com/mobile-grooming-software.html
  - https://tryteddy.com/blog/best-mobile-pet-grooming-software-kg76y
  - https://www.crunchbase.com/organization/groomore
  - https://get.groomer.io/mobile
  - https://get.groomer.io/pricing
  - https://pitchbook.com/profiles/company/494755-03
  - https://www.crunchbase.com/organization/groomer-io
  - https://www.linkedin.com/company/groomer-io
  - https://www.groomsoft.com/features/mobile-grooming-software/
  - https://www.groomsoft.com/pricing/
  - https://koalendar.com/scheduling-software-for/pet-grooming
  - https://www.moego.pet/mobile-grooming
  - https://www.moego.pet/pricing
  - https://profiles.crustdata.com/company/moego
  - https://tracxn.com/d/companies/moego/__KHSyZaiRnmBVNsN3RhyF0tTjS-VzeHaTbKjHNlzeRWM
  - https://www.shakeyourtail.com/
  - https://www.vagaro.com/pro/pet-grooming-software
  - https://www.vonigo.com/industry/mobile-pet-grooming-software/
  - https://aussiepetmobilefranchising.com/pet-franchise-blog/pet-grooming-technology/
  - https://www.ibisworld.com/united-states/industry/pet-grooming-boarding/1735/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Animalo&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102041562207285
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=125574935615
  - https://adstransparency.google.com/advertiser/AR09896518309786943489?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=GrooMore&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR05294478418539184129?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=317812858406030
  - https://adstransparency.google.com/advertiser/AR10456143941341282305?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=116482131772034
  - https://adstransparency.google.com/advertiser/AR10127058204182446081?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=103065858415984
  - https://adstransparency.google.com/advertiser/AR17463480271285256193?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=MoeGo&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR16588403473821728769?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=219435565545145
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=994274800426846
  - https://adstransparency.google.com/advertiser/AR09419698221770342401?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=143117979081715
  - https://adstransparency.google.com/advertiser/AR17980938755741057025?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 37. Tattoo studios  (NAICS 812199)

- **Status:** audited, not passing. Research: searched (follow-up slice2).
- **Method score:** 9.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Porter.
- **Boring test:** 3/3 — Consults, consent/health forms, deposits.
- **US establishments:** 24,221 businesses (IBISWorld Tattoo Artists) (2024, https://www.ibisworld.com/united-states/number-of-businesses/tattoo-artists/4404/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Porter | yes | 5 | yes | unverified (throttled run) | Porter | no | 58 / 26 (2025-06-11) | no 0 | 2 |  |
| Apprentice | yes | 3 | no | unverified (throttled run) | - | no | 11 / 4 (2026-03-26) | no 0 | 0 |  |
| MyTattoo | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Salonist (tattoo) | yes | 0 | no | unverified (throttled run) | - | no | 4 / 0 (2025-09-15) | no 0 | 0 |  |
| Tattoo Studio Pro | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 2 |  |
| TattooPro (Punchey) | yes | 0 | no | unverified (throttled run) | - | no | 11 / 0 (2023-10-23) | no 0 | 0 |  |
| Twizzlo | yes | 0 | no | unverified (throttled run) | Twizzlo | no | 3 / 0 (2026-02-16) | no 0 | 0 |  |
| Venue Ink | yes | 0 | no | unverified (throttled run) | Venue Ink | no | 30 / 0 (2026-04-13) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Tattoo studios (NAICS 812199)
> - Incumbent jobs: Tattoo Studio Pro, Porter, TattooPro, Twizzlo, MyTattoo, Venue Ink, Apprentice, Salonist (deposit-based booking, digital consent/health forms, artist commissions, client history).
> - Agent wedge: booking and consent agent (DM/email/text intake, deposit collection, consent form completion, reminders, no-show recovery) for owner-operators with 1-2 staff; incumbents at $29/mo leave little price room, so the wedge must be per-booking or per-artist.
> - Weakest evidence: establishment count is IBISWorld industry count, not NAICS 812199; Porter has no public figure in results; TattooPro founded/headcount unknown.
> - Searches (7): IBISWorld count; "tattoo studio" software consent; best tattoo software 2026; Tattoo Studio Pro founded; Porter pricing/funding; IBISWorld concentration; TattooPro pricing.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (owner tattoos; avg 1.8 employees). Public-price incumbents: 3. Gatekeeper: no. Top-4 share: no company >5% (IBISWorld Tattoo Artists).

**Evidence URLs (31):**
  - https://www.ibisworld.com/united-states/number-of-businesses/tattoo-artists/4404/
  - https://useapprentice.com/blog/best-tattoo-shop-management-software-features-reviews-and-top-picks
  - https://mytattoo.software/tattoo-studio-software/
  - https://www.getporter.io/for-studios
  - https://www.getporter.io/pricing
  - https://pitchbook.com/profiles/company/529312-15
  - https://www.linkedin.com/company/get-porter
  - https://salonist.io/industries/tattoo-studio-software
  - https://tattoostudiopro.com/
  - https://www.guideflow.com/blog/tattoo-shop-software
  - https://getlatka.com/companies/tattoostudiopro.com/team
  - https://www.linkedin.com/company/tattoostudiopro
  - https://tattoopro.io/
  - https://tattoopro.io/pricing
  - https://twizzlo.com/articles/tattoo-shop-management-software/
  - https://www.venue.ink/blog/how-tattoo-scheduling-software-can-transform-your-tattoo-studios-day-to-day
  - https://www.ibisworld.com/united-states/industry/tattoo-artists/4404/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Apprentice&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR06676072709358616577?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=MyTattoo&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=252526671610402
  - https://adstransparency.google.com/advertiser/AR05696232296516943873?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Salonist&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR17555611477312798721?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Tattoo%20Studio%20Pro&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=TattooPro&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR15078908656110010369?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=928840380309522
  - https://adstransparency.google.com/advertiser/AR07333592207640756225?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=100397966467569
  - https://adstransparency.google.com/advertiser/AR11092445948993863681?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 38. Martial arts schools  (NAICS 611620)

- **Status:** audited, not passing. Research: searched (follow-up slice1).
- **Method score:** 9.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** Kicksite.
- **Boring test:** 3/3 — Memberships, belt testing, attendance.
- **US establishments:** 76,364 martial arts studios (IBISWorld, cited by Gymdesk) (2026, https://gymdesk.com/blog/martial-arts-industry-statistics); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Kicksite | yes | 5 | yes | unverified (throttled run) | - | no | 13 / 10 (2021-10-25) | no 0 | 2 |  |
| Gymdesk | yes | 3 | no | unverified (throttled run) | Gymdesk | no | 200 / 6 (2024-10-14) | no 0 | 0 |  |
| PushPress | yes | 3 | no | unverified (throttled run) | PushPress Gym Software | no | 300 / 13 (2021-10-25) | no 0 | 0 |  |
| Spark Membership | yes | 3 | no | unverified (throttled run) | Spark Membership Software | no | 300 / 8 (2026-04-30) | no 0 | 0 |  |
| Zen Planner (Daxko) | yes | 3 | no | unverified (throttled run) | - | no | 200 / 14 (2023-08-25) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> · Martial arts schools (NAICS 611620)
> - **Incumbent jobs:** family memberships and billing, attendance, belt/rank tracking and testing, trial-class lead follow-up, waivers for minors. Tools: Kicksite, Spark Membership, Zen Planner (Daxko), Gymdesk, PushPress.
> - **Agent wedge:** a trial-to-enrollment agent that answers web/Facebook leads, books the intro class, sends reminders and converts to membership; incumbents charge $49-$249/mo and Spark's whole pitch is lead automation, so target the schools on cheaper tools.
> - **Weakest evidence:** IBISWorld count (76,364) includes sole proprietors; Spark Membership headcount not found; ATA-affiliated schools' tooling not verified.
> - **Searches (7):** NAICS 611620 count; best martial arts software 2026; Kicksite/Spark/Zen Planner pricing; martial arts concentration/franchise; Kicksite company; Spark company (twice); plus gap-fill Zen Planner/Daxko, Gymdesk.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (school owner / head instructor). Public-price incumbents: 4. Gatekeeper: no (largest franchise network ~1.8% share; Premier Martial Arts / Tiger-Rock franchises are small minorities; no software mandate found). Top-4 share: highly fragmented; no company >5%.

**Evidence URLs (23):**
  - https://gymdesk.com/blog/martial-arts-industry-statistics
  - https://gymdesk.com/blog/best-martial-arts-management-software
  - https://gymdesk.com/originals/gymdesk-founder-story-eran-galperin
  - https://kicksite.com/
  - https://tracxn.com/d/companies/kicksite/__U4o3NqAPU8ZYut-X_QmgMTCQVmnFeqOouAaSRXHDM9Q
  - https://www.pushpress.com/blog/best-martial-arts-management-software
  - https://sparkmembership.com/martial-arts-software/
  - https://zenplanner.com/pricing/
  - https://www.prnewswire.com/news-releases/daxko-acquires-zen-planner-to-become-preeminent-software-provider-in-member-based-health--wellness-industry-300426349.html
  - https://www.wodify.com/blog/pricing-guide-martial-arts-software
  - https://www.dojostack.io/vs/spark-membership-vs-zen-planner
  - https://www.premiermartialartsfranchise.com/
  - https://www.ibisworld.com/united-states/industry/martial-arts-studios/4187/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=827406780700974
  - https://adstransparency.google.com/advertiser/AR16251560278402007041?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Kicksite&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR15593204842045112321?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=231554983551166
  - https://adstransparency.google.com/advertiser/AR01020303823723298817?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=101737692224409
  - https://adstransparency.google.com/advertiser/AR05337555213941211137?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Zen%20Planner&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR08493127197379264513?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 39. Lawn fertilization & weed control route businesses  (NAICS 561730)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 8.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** HindSite Software / FieldCentral.
- **Boring test:** 3/3 — Program scheduling, pesticide application records, state applicator licenses.
- **US establishments:** 117969 (2023, https://www.lawnstarter.com/blog/statistics/lawn-care-landscaping-statistics-2026/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| HindSite Software / FieldCentral | yes | 6 | yes | 4 / 4 / 0 (2026-06-22) | HindSite Software | yes | 12 / 9 (2021-10-25) | no 0 | 2 |  |
| Service Autopilot | yes | 3 | no | 0 / 0 / 0 (-) | Service Autopilot by Xplor | no | 25 / 16 (2023-07-28) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Momentum FSM | yes | 0 | no | 0 / 0 / 0 (-) | Momentum | no | 0 / 0 (-) | no 0 | 0 | ambiguous_page |
| RealGreen by WorkWave | yes |  | unverified | 0 / 0 / 0 (-) | - | no | unverified (host blocked) / unverified (host blocked) (-) | unverified (host blocked)  | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Lawn fertilization & weed control route businesses
> - Core jobs: round-based scheduling with mandatory day intervals between applications (FieldCentral chains rounds automatically), master recurring schedules and daily route optimization (RealGreen), chemical/application tracking, pre-pay program billing, sales forms (RealGreen Forms).
> - Incumbents: RealGreen (the legacy leader in this sub-niche), FieldCentral, Service Autopilot, Momentum FSM, QuoteIQ (fert-specific SEO page).
> - Agent wedge: an "application-round agent" that plans the season's rounds per lawn, respects re-application intervals and weather windows, texts customers before each visit, and produces state-required pesticide application records. Compliance recordkeeping is a distinct, unglamorous pain no incumbent snippet emphasized.
> - Weakest evidence: no establishment count specific to fert/weed-control routes exists; the 117,969 employer-company figure is all of NAICS 561730. TruGreen's national share was not surfaced.

**The agent version** [hypothesis]: Per-lawn season plan (rounds with legal re-application intervals and weather windows) → pre-visit texts → post-visit state pesticide application record generated and filed. Needs: weather API, state applicator-record template, SMS, route calendar.

**Wedge** [hypothesis]: Application-round scheduler plus automatic pesticide application recordkeeping.

**Price ceiling:** incumbent public prices found [search-cited]:
  - HindSite Software / FieldCentral: $49.97/user/mo + $103.97/mo base (per https://www.capterra.com/p/10020754/FieldCentral/); 6 tiers ~$277 to $1000+/mo (https://www.fieldcentral.com/pricing)
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - RealGreen by WorkWave: ~$199/mo (third-party estimate, https://softwarefinder.com/fleet-management-software/realgreen-by-workwave) (https://www.realgreen.com/pricing)
  - Service Autopilot: $49/mo Startup + $97 sign-up fee; Pro $199; Pro Plus $499; Elite custom (per https://fervorstudio.ca/news/service-autopilot-review-pricing-alternatives/) (https://www.capterra.com/p/122075/Service-Autopilot/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (solo applicators to small route companies). Public-price incumbents: 3. Gatekeeper: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: no single firm >5% (secondary source; TruGreen dominance not quantified in results).

**Evidence URLs (25):**
  - https://www.lawnstarter.com/blog/statistics/lawn-care-landscaping-statistics-2026/
  - https://www.fieldcentral.com/features/lawn-fertilization-software
  - https://www.fieldcentral.com/pricing
  - https://www.fieldcentral.com/fieldcentral
  - https://www.capterra.com/p/10020754/FieldCentral/
  - https://www.momentumfsm.com/industries/lawn-care
  - https://myquoteiq.com/top-10-crms-for-lawn-fertilization-businesses-in-2026/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://www.realgreen.com/blog/best-lawn-care-route-planners-for-lawn-care-businesses
  - https://www.realgreen.com/pricing
  - https://www.workwave.com/newsroom/workwave-acquires-real-green-systems
  - https://www.g2.com/products/realgreen-by-workwave/reviews
  - https://www.capterra.com/p/122075/Service-Autopilot/
  - https://www.capterra.com/p/122075/Service-Autopilot/pricing/
  - https://xplorpay.com/insights/clearent-acquires-controlling-interest-in-green-industry-field-services-management-saas-business-service-autopilot/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=357760284303174
  - https://adstransparency.google.com/advertiser/AR04520867354405502977?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=155710354774360
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=RealGreen%20by%20WorkWave&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=85289916525
  - https://adstransparency.google.com/advertiser/AR01165979373417791489?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 40. Low-voltage, alarm & security camera installers  (NAICS 238210)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 8.5 = ad score 5.5 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** ServiceTitan.
- **Boring test:** 3/3 — Permits, monitoring contracts, recurring inspection paperwork.
- **US establishments:** 87,086 (IBISWorld Security System Services businesses); 55,951 (NAICS 238210 companies verified active, siccode) (2026 / n.d., https://www.ibisworld.com/united-states/number-of-businesses/security-system-services/1491/ ; https://siccode.com/naics-code/238210/electrical-contractors-wiring-installation-contractors); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| FieldForce Tracker | yes | 3 | no | 0 / 0 / 0 (-) | Field Force | no | 26 / 11 (2023-10-12) | no 0 | 0 | ambiguous_page |
| ReachOut Suite | yes | 3 | no | 0 / 0 / 0 (-) | ReachOut Suite | no | 8 / 3 (2025-04-04) | no 0 | 0 |  |
| WorkHorse SCS | yes | 3 | no | 0 / 0 / 0 (-) | Workhorse | no | 6 / 6 (2024-12-17) | no 0 | 0 | ambiguous_page |
| SecurityTrax | yes | 2 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 2 |  |
| Repair-CRM | yes | 0 | no | 0 / 0 / 0 (-) | Repair-CRM | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Low-voltage, alarm & security camera installers (238210)
> - Core jobs: lead/quote with equipment line items, install scheduling/dispatch, eAgreements, RMR (monitoring) billing, central-station and Alarm.com integrations (SecurityTrax, WorkHorse SCS, SuretyPRO/AlarmBase/CESware per list posts).
> - Wedge: RMR billing and monitoring integrations are the moat and hard to replace; the agent wedge is the front end - quote packages, permits, install-day coordination and customer onboarding - for camera/low-voltage shops that do not sell monitoring and are over-served by dealer platforms with $250/mo floors.
> - Weakest link: SecurityTrax is owned by Alarm.com (possible channel gatekeeper); SuretyPRO/AlarmBase/CESware domains and pricing were never retrieved.

**The agent version** [hypothesis]: Install lead → permit and alarm-registration filings with the municipality → recurring inspection reminders and reports → monitoring contract renewals. Needs: municipal portals, PDF forms, SMS, calendar.

**Wedge** [hypothesis]: Alarm permit/registration filing agent for small low-voltage installers.

**Price ceiling:** incumbent public prices found [search-cited]:
  - SecurityTrax: $250 minimum monthly charge (usage-based) - https://www.securitytrax.com/pricing (https://www.securitytrax.com/pricing)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 3/5. Check signer: owner-operator (alarm dealers); RMR billing and central-station integrations drive choice. Public-price incumbents: 1. Gatekeeper: unverified (search budget exhausted before this check). Top-4 share: low concentration; largest is ADT (share not given).

**Evidence URLs (22):**
  - https://www.ibisworld.com/united-states/number-of-businesses/security-system-services/1491/ ; https://siccode.com/naics-code/238210/electrical-contractors-wiring-installation-contractors
  - https://www.fieldforcetracker.com/alarm-security-installer-software/
  - https://www.reachoutsuite.com/security-alarm-installation-software
  - https://www.repair-crm.com/security-system-installation-software/
  - https://www.securitytrax.com/
  - https://www.securitytrax.com/pricing
  - https://pitchbook.com/profiles/company/151141-06 ; https://leadiq.com/c/securitytrax/5a1d8ef4540000530074fc50
  - https://pitchbook.com/profiles/company/151141-06
  - https://www.linkedin.com/company/securitytrax
  - https://www.servicetitan.com/industries/alarm-business-software
  - https://workhorsescs.com/software-for-alarm-companies/
  - https://www.ibisworld.com/united-states/industry/security-system-services/1491/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=804912602705771
  - https://adstransparency.google.com/advertiser/AR11308616489134718977?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=152889301940148
  - https://adstransparency.google.com/advertiser/AR09422119346374705153?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=821421364649220
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=SecurityTrax&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1713256965555144
  - https://adstransparency.google.com/advertiser/AR10975637072064282625?region=US

**Confidence:** low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 41. Gutter installation & cleaning contractors  (NAICS 238170)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 8.5 = ad score 6.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** RoofSnap.
- **Boring test:** 3/3 — Seasonal route work, linear-foot quotes, ladder crews.
- **US establishments:** 4,929 businesses (IBISWorld Gutter Services in the US) (2025, https://www.ibisworld.com/industry-statistics/number-of-businesses/gutter-services-united-states/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| RoofSnap | yes | 9 | yes | 10 / 3 / 0 (2026-07-17) | RoofSnap | yes | 200 / 40 (2022-05-05) | no 0 | 2 |  |
| ArcSite | yes | 4 | no | 9 / 0 / 0 (2026-08-06) | ArcSite | no | 15 / 5 (2022-09-15) | yes 9 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| GutterCalc Pro | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 1 / 0 (2026-04-03) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Gutter installation & cleaning contractors (238170)
> - Core jobs: satellite roofline linear-foot measurement and bid generation (GutterCalc Pro, ArcSite, RoofSnap gutter reports), recurring-cleaning billing and route optimization, gutter-guard financing (QuoteIQ).
> - Wedge: measurement-to-bid is already commoditized; the gap is recurring-cleaning retention: an agent that re-quotes, reminds, reschedules and collects for seasonal cleanings.
> - Weakest evidence: GutterCalc Pro's flat rate amount never surfaced; ArcSite has no verified data; only 4 tools found and IBISWorld's 4,929 count likely undercounts (many gutter firms sit under roofing/siding).

**The agent version** [hypothesis]: Linear-foot quote from satellite roofline → seasonal cleaning route rebooking → invoice. Needs: measurement, SMS, calendar.

**Wedge** [hypothesis]: Seasonal gutter-cleaning rebooking agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  - RoofSnap: $52-$78/user/mo annual; $105/user/mo monthly; gutter reports $11-$15 each (https://roofsnap.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~2 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (2 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (per-linear-foot bidders; recurring cleaning routes). Public-price incumbents: 2. Gatekeeper: not searched (session search budget exhausted). Top-4 share: unverified.

**Evidence URLs (19):**
  - https://www.ibisworld.com/industry-statistics/number-of-businesses/gutter-services-united-states/
  - https://www.arcsite.com/industries/gutters
  - https://guttercalc.net/
  - https://myquoteiq.com/industries/industries-gutter-installation-software/
  - https://myquoteiq.com/pricing/
  - https://tracxn.com/d/companies/quoteiq/__baJVvCxQIOKFcjFDrIKoaTAs0SGEG9HCkMNvWwcyViU
  - https://bootstrappers.com/mike-vida-quoteiq/
  - https://contractortoolstack.com/software/quoteiq/
  - https://roofsnap.com/pricing/
  - https://softwareconnect.com/reviews/roofsnap/
  - https://www.capterra.com/p/174071/RoofSnap/pricing/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=710368322419423
  - https://adstransparency.google.com/advertiser/AR13909098755979739137?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=GutterCalc%20Pro&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR07158930799838887937?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=240696209348952
  - https://adstransparency.google.com/advertiser/AR03019457469031120897?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 42. Campgrounds & RV parks  (NAICS 721211)

- **Status:** audited, not passing. Research: searched (follow-up slice3).
- **Method score:** 8.5 = ad score 3.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Reservations, site maps, seasonal contracts.
- **US establishments:** 7,338 companies verified active (NAICS 721211) (unverified, https://siccode.com/naics-code/721211/rv-recreational-vehicle-parks-campgrounds); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Firefly Reservations | yes | 4 | no | unverified (throttled run) | Firefly Reservations | no | 40 / 9 (2023-11-06) | yes 12 | 0 |  |
| Campspot | yes | 3 | no | unverified (throttled run) | - | no | 6 / 4 (2024-06-12) | no 0 | 0 |  |
| Bonfire | yes | 2 | no | unverified (throttled run) | Bonfire | no | 4 / 0 (2026-04-01) | no 0 | 2 |  |
| CampLife | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Campground Master | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| GraceSoft | yes | 0 | no | unverified (throttled run) | Grace Soft | no | 10 / 2 (2021-10-25) | no 0 | 0 |  |
| Keepr | yes | 0 | no | unverified (throttled run) | - | no | 1 / 1 (2026-06-02) | no 0 | 0 |  |
| Premier Campground Management (PCM) | yes |  | unverified | unverified (throttled run) | Premier Campground Management | no | 0 / 0 (-) | no 0 | 0 |  |
| ReservationKey | yes | 0 | no | unverified (throttled run) | - | no | 23 / 2 (2025-04-14) | no 0 | 0 |  |
| RoverPass | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Campgrounds & RV parks (10 searches)
> - Incumbent jobs: site map and online reservations, seasonal/monthly billing, dynamic pricing, POS/store, marketplace distribution, check-in (Campspot, CampLife, Firefly, RoverPass, Bonfire).
> - AaaS wedge: phone/text reservation and cancellation-refill agent for independent parks (per-reservation incumbents at $2-$3.50 mean a per-booking agent fee is native to the category).
> - Weakest evidence: Firefly headcount result was clearly misattributed (501-1,000) and left unverified; Bonfire pricing amounts not surfaced; Campspot price via third-party comparison page.
> - Searches: NAICS count; reservation software; best campground software pricing; KOA K2; IBISWorld concentration; Firefly; Campspot; CampLife; Bonfire; RoverPass; Firefly headcount retry.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (88% of RV parks independently owned; per-reservation pricing). Public-price incumbents: 4. Gatekeeper: no (franchise slice only: KOA). Top-4 share: low concentration; largest Equity Lifestyle Properties (IBISWorld Campgrounds & RV Parks).

**Evidence URLs (41):**
  - https://siccode.com/naics-code/721211/rv-recreational-vehicle-parks-campgrounds
  - https://www.letsbonfire.com/
  - https://www.letsbonfire.com/bonfire-pricing
  - https://gust.com/companies/letsbonfire
  - https://software.camplife.com/
  - https://software.camplife.com/pricing
  - https://leadiq.com/c/camplife/5a1dcf0a2300005b00d68dec
  - https://campgroundmaster.com/
  - https://www.guideflow.com/blog/campground-management-software
  - https://keeprstay.com/compare/pricing
  - https://tracxn.com/d/companies/campspot/__xLqQUy-QmNW1hSGL9TC2UiZCYv7AfKURta3243ZEM_s
  - https://www.crunchbase.com/organization/campspot
  - https://fireflyreservations.com/
  - https://fireflyreservations.com/blog/campground-software-comparison
  - https://www.linkedin.com/company/fireflyreservations
  - https://www.gracesoft.com/campground-management-software
  - https://keeprstay.com/guides/campground-software
  - https://www.premiercampground.com/
  - https://www.reservationkey.com/reservation-software/campgrounds
  - https://software.roverpass.com/campground-reservation-software
  - https://software.roverpass.com/
  - https://tracxn.com/d/companies/roverpass/__QpiSrUS8oDllHLS_Uu05zzXRbZ4ABeudFSsQirO3XIU
  - https://www.crunchbase.com/organization/roverpass
  - https://www.koapressroom.com/press/koa-announces-all-locations-now-on-k2-reservation-system/
  - https://www.ibisworld.com/united-states/market-size/campgrounds-rv-parks/1667/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=317435674949531
  - https://adstransparency.google.com/advertiser/AR09711540854396551169?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=CampLife&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Campground%20Master&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Campspot&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR09456135143761641473?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102121741619224
  - https://adstransparency.google.com/advertiser/AR15663179273865265153?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=429603020241104
  - https://adstransparency.google.com/advertiser/AR03803989277788864513?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Keepr&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR07994516386627977217?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=508199629039063
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=ReservationKey&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR09518532583256752129?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=RoverPass&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 43. Photographers & photo booth operators  (NAICS 541921)

- **Status:** audited, not passing. Research: searched (follow-up slice2).
- **Method score:** 8.5 = ad score 3.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Booking, contracts, galleries, invoicing.
- **US establishments:** 10,622 establishments (portrait studios, NAICS 541921); 32,491 employees. IBISWorld Photography: 255k businesses (incl. nonemployers) (2020, https://naicslist.com/naics/541921); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| HoneyBook | yes | 4 | no | unverified (throttled run) | HoneyBook | no | 40 / 37 (2022-10-14) | yes 9 | 0 |  |
| Check Cherry | yes | 3 | no | unverified (throttled run) | Check Cherry | no | 82 / 3 (2021-10-25) | no 0 | 0 |  |
| Studio Ninja (Captura / ImageQuix) | yes | 3 | no | unverified (throttled run) | Studio Ninja | no | 34 / 4 (2024-10-14) | no 0 | 0 |  |
| BoothBook | yes | 0 | no | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Dubsado | yes | 0 | no | unverified (throttled run) | Dubsado | no | 0 / 0 (-) | no 0 | 0 |  |
| Sprout Studio | yes | 0 | no | unverified (throttled run) | - | no | 15 / 0 (2025-08-04) | no 0 | 0 |  |
| Tave Studio Manager (now VSCO Workspace) | yes | 0 | no | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Photographers & photo booth operators (NAICS 541921)
> - Incumbent jobs: HoneyBook, Sprout Studio, Studio Ninja, Tave/VSCO Workspace, Dubsado (leads, proposals, contracts, invoices, galleries); Check Cherry, BoothBook (photo booth quotes, backdrop/template selection, equipment checklists, event-day staffing).
> - Agent wedge: inquiry-to-booking agent (answers inquiries within minutes, sends the proposal/contract, chases signature and deposit, schedules the pre-event call) for solo operators; $22-$39/mo incumbents mean the agent must be priced per booked event.
> - Weakest evidence: HoneyBook starting price conflicts ($19 vs $36); Studio Ninja headcount unknown; establishment count covers portrait studios only (255k IBISWorld figure includes nonemployers).
> - Searches (9): NAICS count; photographer CRM pricing; photo booth software; Sprout founded; Studio Ninja acquired; Check Cherry founded; BoothBook pricing; IBISWorld concentration; HoneyBook funding; Tave pricing.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (solo photographer / booth operator). Public-price incumbents: 6. Gatekeeper: no. Top-4 share: low market share concentration; largest is Shutterfly (IBISWorld Photography).

**Evidence URLs (28):**
  - https://naicslist.com/naics/541921
  - https://boothbook.com/
  - https://boothbook.com/pricing
  - https://www.checkcherry.com/photo-booth-crm
  - https://tracxn.com/d/companies/check-cherry/__ju-1JI5C0CR3Qod9sAKiq-X886_iMB2PrusBZHhifFI
  - https://blog.bloom.io/best-crm-photographers/
  - https://pitchbook.com/profiles/company/91077-49
  - https://getsproutstudio.com/
  - https://getsproutstudio.com/sprout-studioninja/
  - https://www.crunchbase.com/organization/sprout-studio
  - https://ca.linkedin.com/company/getsproutstudio
  - https://www.studioninja.co/about-us/
  - https://www.capterra.com/p/143855/Studio-Ninja
  - https://www.studioninja.co/imagequix-acquires-studio-ninja/
  - https://www.capterra.com/p/92909/Tave-Studio-Manager/pricing/
  - https://www.slrlounge.com/inside-vscos-acquisition-of-tave-a-game-changer-for-creatives/
  - https://www.ibisworld.com/united-states/industry/photography/1443/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=BoothBook&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=561524994043941
  - https://adstransparency.google.com/advertiser/AR04703870310250708993?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=872925479412159
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=219518724837898
  - https://adstransparency.google.com/advertiser/AR04617303973089509377?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Sprout%20Studio&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR04393460911961014273?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1617599238481289
  - https://adstransparency.google.com/advertiser/AR07722638102023372801?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Tave%20Studio%20Manager&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 44. Artificial turf & sports court installers  (NAICS 238990)

- **Status:** audited, not passing. Research: searched (follow-up slice1).
- **Method score:** 8.5 = ad score 3.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Site measure, material orders, crew scheduling.
- **US establishments:** 37,952 establishments (37,500 businesses) (2020, https://siccode.com/naics-code/238990/specialty-trade-contractors); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ArcSite | yes | 4 | no | 9 / 0 / 0 (2026-08-06) | ArcSite | no | 15 / 5 (2022-09-15) | yes 9 | 0 |  |
| Moasure (Landscape Designer TURF) | yes | 3 | no | 0 / 0 / 0 (-) | Moasure | no | 87 / 37 (2024-12-20) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| SiteRecon | yes | 1 | no | 0 / 0 / 0 (-) | SiteRecon | no | 0 / 0 (-) | yes 8 | 0 |  |
| TurfEstimator | yes | 1 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | yes 4 | 0 |  |
| MeasureSquare | yes | 0 | no | 0 / 0 / 0 (-) | Measure Square | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> · Artificial turf & sports court installers (NAICS 238990)
> - **Incumbent jobs:** measure the yard (satellite/CAD/motion device), produce a per-square-foot quote with cut plan and material takeoff, send contract, collect deposit, schedule crew. Tools: TurfEstimator, QuoteIQ (turf landing), ArcSite, MeasureSquare, Moasure, SiteRecon.
> - **Agent wedge:** an intake-to-quote agent that takes a homeowner's address and photos, returns a priced turf proposal with waste-optimised roll layout and follows up until signed; owners currently pay $30-$200/mo across two or three tools to do this by hand.
> - **Weakest evidence:** no turf-specific establishment count (NAICS 238990 is a catch-all); US concentration statement is borrowed from Australia and from a 2016 sports-field S-1; TurfEstimator has no company facts at all.
> - **Searches (9):** NAICS 238990 count; turf installer software/CRM; best turf software 2026; sports court installer software; TurfEstimator pricing; QuoteIQ pricing/founded; ArcSite pricing/crunchbase; turf industry fragmentation; turf franchise/STC gatekeeper. Plus gap-fill: MeasureSquare pricing, Moasure, TurfEstimator company.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (turf installation contractor). Public-price incumbents: 3. Gatekeeper: no (STC CSTI certification is voluntary; SYNLawn dealer program covers only its dealers; no software mandate found). Top-4 share: unverified (no US top-4 figure; 'no company >5%' in AU and in US sports-field construction).

**Evidence URLs (27):**
  - https://siccode.com/naics-code/238990/specialty-trade-contractors
  - https://www.arcsite.com/industries/artificial-turf
  - https://www.arcsite.com/pricing
  - https://measuresquare.com/trade/artificial-turf/
  - https://measuresquare.com/pricing/
  - https://leadiq.com/c/measure-square-corp/5a1d9aa52300005c0089d109
  - https://www.linkedin.com/company/measure-square
  - https://www.moasure.com/pages/artificial-turf-software
  - https://www.moasure.com/pages/partners-landscape-designer-turf
  - https://www.moasure.com/
  - https://myquoteiq.com/artificial-turf-installation-companies-crm/
  - https://myquoteiq.com/pricing/
  - https://myquoteiq.com/about-us/
  - https://www.turfestimator.com/
  - https://www.syntheticturfcouncil.org/mpage/CSTI
  - https://www.synlawn.com/installation/
  - https://www.ibisworld.com/australia/industry/artificial-grass-turf-installation/5561/
  - https://www.sec.gov/Archives/edgar/data/0001539551/000121390016016481/fs12016_sportsfieldhold.htm
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=710368322419423
  - https://adstransparency.google.com/advertiser/AR13909098755979739137?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=276493002487597
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=975923222465261
  - https://adstransparency.google.com/advertiser/AR16128924668450045953?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=105657674519848
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=TurfEstimator&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 45. Environmental testing labs (asbestos, lead, water)  (NAICS 541380)

- **Status:** audited, not passing. Research: searched (follow-up slice6).
- **Method score:** 8.5 = ad score 3.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Chain-of-custody, accreditation paperwork, report turnaround.
- **US establishments:** 4,130 active companies (NAICS 541380) (unverified, https://siccode.com/naics-code/541380/testing-laboratories-services); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| QBench | yes | 4 | no | 0 / 0 / 0 (-) | - | no | 80 / 5 (2025-04-04) | yes 12 | 0 |  |
| Confience LIMS (QSI + ATL merger; formerly Accelerated Technology Laboratories) | yes | 3 | no | 0 / 0 / 0 (-) | Confience | no | 79 / 16 (2024-08-06) | no 0 | 0 |  |
| BTSOFT (ALPACA LIMS Asbestos edition / LabMaster) | yes | 0 | no | 0 / 0 / 0 (-) | BTSoft | no | 0 / 0 (-) | no 0 | 0 |  |
| BlazeLIMS (Blaze Systems) | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Clinisys Environmental Laboratory | yes | 0 | no | 0 / 0 / 0 (-) | Clinisys | no | 10 / 2 (2024-09-12) | no 0 | 0 |  |
| CloudLIMS | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| LabLynx Environmental LIMS | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Labbit | yes | 0 | no | 0 / 0 / 0 (-) | Labbit | no | 12 / 1 (2024-01-25) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> — Environmental testing labs (asbestos, lead, water) · NAICS 541380 · 9 searches
> - **Incumbent jobs:** sample login and chain of custody, holding-time tracking, PLM/PCM/TEM asbestos worksheets, NVLAP/ELAP-compliant report generation and e-signature, EDD exports (CloudLIMS, QBench, BlazeLIMS, Confience, BTSOFT).
> - **Wedge:** an agent that ingests chain-of-custody forms and instrument output, drafts the accredited report, and chases clients on holding-time deadlines. Small asbestos/lead labs still run these steps manually (BTSOFT and Confience sell packages for exactly this).
> - **Weakest evidence:** establishment count is whole-NAICS (all testing labs, 4,130 active companies per siccode), no environmental-only count. CloudLIMS and BlazeLIMS prices come from third-party pricing guides that cite the vendor pages. Confience headcount not found.
> - **Fragmentation 5/5:** three public prices, low concentration (IBISWorld), no software gatekeeper.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: lab owner / lab director (small independent labs; BlazeLIMS markets 'LIMS for small labs'). Public-price incumbents: 3. Gatekeeper: none found (NVLAP/NELAP accreditation governs methods and reports, no software vendor mandated). Top-4 share: low concentration (largest Intertek; consolidation rising).

**Evidence URLs (30):**
  - https://siccode.com/naics-code/541380/testing-laboratories-services
  - https://btsoft.com/asbestos-laboratory/
  - https://www.linkedin.com/company/btsofttech
  - https://www.blazesystems.com/lims-for-environmental-laboratories/
  - https://www.blazesystems.com/blazelims-prices/
  - https://www.clinisys.com/us/en/clinisys-laboratory-solution/clinisys-environmental-laboratory/
  - https://cloudlims.com/the-5-best-lims-for-environmental-testing-labs-in-2026/
  - https://cloudlims.com/lims-software-pricing/
  - https://www.confience.io/industries/industrial-hygiene-lims
  - https://www.crunchbase.com/organization/accelerated-technology-laboratories
  - https://www.linkedin.com/company/confience-software/
  - https://www.lablynx.com/industries/environmental-lims/
  - https://www.labbit.com/industries/environmental-testing
  - https://qbench.com/qbench-lims-for-environmental-testing-labs
  - https://qbench.com/pricing
  - https://leadiq.com/c/qbench/5ec2c000102cc03532816d81
  - https://www.crunchbase.com/organization/qbench
  - https://www.ibisworld.com/united-states/number-of-businesses/laboratory-testing-services/1408/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=180275318671005
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=BlazeLIMS&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=101684208773528
  - https://adstransparency.google.com/advertiser/AR16215164278859104257?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=CloudLIMS&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=115230449244
  - https://adstransparency.google.com/advertiser/AR13336094696435351553?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=LabLynx%20Environmental%20LIMS&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=672121836176284
  - https://adstransparency.google.com/advertiser/AR05468407096330420225?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=QBench&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR13583170317999669249?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 46. Private investigators  (NAICS 561611)

- **Status:** audited, not passing. Research: searched (follow-up slice3).
- **Method score:** 8.5 = ad score 3.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Case files, surveillance logs, billing by hour.
- **US establishments:** 5,357 companies verified active (NAICS 561611) (unverified, https://siccode.com/naics-code/561611/investigation-services); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Kaseware | yes | 4 | no | 0 / 0 / 0 (-) | Kaseware | no | 24 / 9 (2022-01-28) | yes 10 | 0 |  |
| Tracers | yes | 3 | no | 0 / 0 / 0 (-) | Tracers | no | 27 / 15 (2022-08-31) | no 0 | 0 |  |
| Trackops | yes | 3 | no | 0 / 0 / 0 (-) | Track Ops Music | no | 9 / 9 (2021-10-25) | no 0 | 0 |  |
| CROSStrax | yes | 1 | no | 0 / 0 / 0 (-) | CrossTrax Studio | no | 0 / 0 (-) | yes 6 | 0 |  |
| Case Jacket | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| CaseFlow Investigator | yes | 0 | no | 0 / 0 / 0 (-) | Caseflow | no | 0 / 0 (-) | no 0 | 0 |  |
| Deelo | yes | 0 | no | 0 / 0 / 0 (-) | Deelo | no | 2 / 0 (2026-03-12) | no 0 | 0 |  |
| THERMS | yes | 0 | no | 0 / 0 / 0 (-) | Therms | no | 2 / 0 (2026-03-31) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Private investigators (10 searches)
> - Incumbent jobs: case file/evidence storage, investigator assignment and dispatch, time/mileage/expense capture, report writing, client portal and invoicing (CROSStrax, Trackops, THERMS, Case Jacket).
> - AaaS wedge: surveillance-report drafting and billable-time reconciliation agent (turn field notes, GPS logs and photos into the client report and invoice); prices anchor at $35-$45/mo so the agent must replace admin hours, not software.
> - Weakest evidence: establishment count conflicts (5,357 siccode vs 10,290 unattributed); Trackops pricing amounts not surfaced; top-4 share comes from statistic aggregators citing IBISWorld rather than IBISWorld directly.
> - Searches: NAICS count; PI case management; best PI software pricing; PI CRM/billing; concentration; CROSStrax pricing; CROSStrax company; Trackops; THERMS; NCISS/NALI; siccode recount.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (solo PIs and 3-15 investigator agencies; CROSStrax Entry tier = 1 admin + 2 investigators). Public-price incumbents: 3. Gatekeeper: no. Top-4 share: top 4 <15% (2023, via zipdo); 85% of agencies <10 employees (IBISWorld 2022 via gitnux).

**Evidence URLs (31):**
  - https://siccode.com/naics-code/561611/investigation-services
  - https://www.crosstrax.co/
  - https://www.crosstrax.co/pricing/
  - https://www.crunchbase.com/organization/crosstrax
  - https://casejacket.com/
  - https://www.caseflowinvestigator.com/
  - https://www.deelo.ai/software/invoicing/private-investigators
  - https://www.kaseware.com/
  - https://www.therms.io/blog/what-software-do-private-investigators-use/
  - https://www.therms.io/pricing/
  - https://www.tracers.com/investigators/
  - https://www.trackops.com/
  - https://www.trackops.com/pricing.html
  - https://www.linkedin.com/company/trackops-llc
  - https://www.crunchbase.com/organization/trackops
  - https://www.guideflow.com/blog/private-investigator-software)
  - https://www.nciss.org/membership-and-benefits
  - https://zipdo.co/private-investigation-industry-statistics/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=127284774044240
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Case%20Jacket&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1185866191273600
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1223424464197303
  - https://adstransparency.google.com/advertiser/AR07129259928807538689?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=230515793953917
  - https://adstransparency.google.com/advertiser/AR13035375465919938561?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=339060543691766
  - https://adstransparency.google.com/advertiser/AR11651322564021583873?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=467279653366393
  - https://adstransparency.google.com/advertiser/AR10984593607884800001?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=559324377552199
  - https://adstransparency.google.com/advertiser/AR07177257622859415553?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 47. Mortgage brokers  (NAICS 522310)

- **Status:** audited, not passing. Research: searched (follow-up slice2).
- **Method score:** 8.5 = ad score 3.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** BNTouch.
- **Boring test:** 3/3 — Document collection, disclosures, lender submissions.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| BNTouch | yes | 5 | yes | unverified (throttled run) | Bntouch | no | 61 / 10 (2024-11-23) | no 0 | 2 |  |
| LendingPad | yes | 2 | no | 0 / 0 / 0 (-) | LendingPad | no | 8 / 0 (2022-04-01) | no 0 | 2 |  |
| ARIVE | yes | 0 | no | unverified (throttled run) | ARIVE | no | 0 / 0 (-) | no 0 | 0 |  |
| Bonzo | yes | 0 | no | unverified (throttled run) | BONZO | no | 0 / 0 (-) | no 0 | 0 |  |
| ICE Encompass | yes | 0 | no | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Jungo (Salesforce) | yes |  | unverified | unverified (throttled run) | Jungo | no | 0 / 0 (-) | no 0 | 0 |  |
| Shape | yes | 0 | no | unverified (throttled run) | SHAPE | no | 5 / 2 (2024-08-01) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Mortgage brokers (NAICS 522310)
> - Incumbent jobs: ARIVE and LendingPad (LOS: application, pricing across wholesale lenders, pipeline, disclosures); BNTouch, Shape, Bonzo, Jungo (CRM: lead follow-up, drip, referral-partner marketing).
> - Agent wedge: a loan-officer assistant that works the CRM (borrower/realtor follow-ups, document chasing, status updates) on top of ARIVE/LendingPad; per-user CRM pricing of $95-$165 is the ceiling.
> - Weakest evidence: no US establishment count found for NAICS 522310; concentration statement is for the online-broker segment only; ARIVE price is third-party.
> - Searches (9): NAICS count; best broker LOS 2026; broker CRM pricing; IBISWorld concentration; ARIVE founded/funding; LendingPad; AIME/gatekeeper; NMLS count; BNTouch founded.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator (broker-owner / branch manager). Public-price incumbents: 5. Gatekeeper: no (AIME partners with ARIVE/Lender Price as member benefits; wholesale lenders run their own portals but do not dictate the broker's LOS/CRM). Top-4 share: no company >5% (IBISWorld Online Mortgage Brokers segment).

**Evidence URLs (23):**
  - https://www.arive.com/
  - https://www.arive.com/arive-faq
  - https://pitchbook.com/profiles/company/458516-08
  - https://bntouch.com/mortgage-crm/
  - https://bntouch.com/team-mortgage-crm/
  - https://tracxn.com/d/companies/bntouch/__AEanYgLw_pmf6ZeULNqBm6_CQ1rBtRaeDhGdiYyfni0
  - https://www.linkedin.com/company/bntouch-inc
  - https://bntouch.com/mortgage-blog/mortgage-crm-pricing-comparison-2026/
  - https://www.saasworthy.com/product/lendingpad/pricing
  - https://getlatka.com/companies/lendingpad.com#funding
  - https://setshape.com/blog/best-mortgage-crm-for-loan-officers
  - https://setshape.com/blog/top-loan-origination-systems
  - https://www.ibisworld.com/united-states/market-research-reports/online-mortgage-brokers-industry/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=709153719445285
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=899295179942897
  - https://adstransparency.google.com/advertiser/AR01207898185507274753?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=790234174654163
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=ICE%20Encompass&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=72952356630
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=434737586893402
  - https://adstransparency.google.com/advertiser/AR15624933732555685889?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=17110490676
  - https://adstransparency.google.com/advertiser/AR03913159443713359873?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 48. Small fleet trucking companies (1-20 trucks)  (NAICS 484121)

- **Status:** audited, not passing. Research: searched (follow-up batch 17, 2026-09-17).
- **Method score:** 8.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** TruckingOffice.
- **Boring test:** 3/3 — IFTA, ELD logs, driver files, load paperwork.
- **US establishments:** over 800,000 active motor carriers with MC numbers (2025); NAICS 484121 establishment count unverified (2025, https://www.truckingdive.com/news/fmcsa-grants-reinstatements-revocations-operating-authority-2025-data/808968/); share <20 employees: 97% of carriers operate fewer than 20 trucks (trucks, not employees).

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| TruckingOffice | yes | 6 | yes | 0 / 0 / 0 (-) | TruckingOffice | no | 57 / 18 (2021-10-25) | yes 11 | 2 |  |
| Motive Compliance Hub | yes | 3 | no | 0 / 0 / 0 (-) | Motive | no | 500 / 24 (2023-06-07) | no 0 | 0 |  |
| Truckbase | yes | 2 | no | 0 / 0 / 0 (-) | Truckbase | no | 0 / 0 (-) | no 0 | 2 |  |
| AscendTMS | yes | 1 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | yes 11 | 0 |  |
| Axele | yes | 0 | no | 0 / 0 / 0 (-) | Axele | no | 0 / 0 (-) | no 0 | 0 |  |
| Hawk Lane | yes | 0 | no | 0 / 0 / 0 (-) | Hawk Lane Tech | no | 1 / 0 (2026-08-04) | no 0 | 0 |  |
| TruckLogics | yes | 0 | no | 0 / 0 / 0 (-) | TruckLogics | no | 0 / 0 (-) | no 0 | 0 |  |
| Truckpedia | yes | 0 | no | 0 / 0 / 0 (-) | Truckpedia | no | 7 / 0 (2024-07-23) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Small fleet trucking companies (1-20 trucks) (NAICS 484121) — 7 searches (+1 extra pass)
> - Incumbents' jobs: dispatch/load board, driver settlements, invoicing/factoring, IFTA, ELD/HOS and DQF compliance (Hawk Lane free-$199, TruckingOffice $25+, TruckLogics $39.95, Truckbase $290, Truckpedia $300, Axele, AscendTMS; Motive/Samsara anchor via ELD mandate).
> - Wedge: 97% of carriers run <20 trucks and most run <10; the owner still does back office at night. Agent wedge: invoice-to-cash (POD collection, factoring submission, broker follow-up) and quarterly IFTA prep from ELD data, sold flat per truck.
> - Weakest evidence: NAICS 484121 establishment count never surfaced (used FMCSA 800k active MC-number carriers); Truckbase's Crunchbase funding figure looks like a data error; Hawk Lane headcount unknown.
> - Searches: FMCSA small-fleet share; small-fleet TMS; best TMS pricing 2026; ELD/IFTA pricing; NAICS 484121 count; Truckbase crunchbase; TruckingOffice/Hawk Lane; FMCSA carrier count.

**The agent version** [hypothesis]: IFTA quarterly filing from ELD/fuel data → driver file expirations → load paperwork (rate cons, BOLs) collected and invoiced. Needs: ELD API, fuel-card data, state IFTA portals, email.

**Wedge** [hypothesis]: IFTA filing and driver-file expiration agent for 1-20 truck fleets.

**Price ceiling:** incumbent public prices found [search-cited]:
  - AscendTMS: $49/user/month (top plan $149/user/month) (https://gofreight.com/blog/best-tms-small-business)
  - Axele: around $149/month (https://www.torotms.com/blog/best-software-for-small-trucking-company)
  - Hawk Lane: Free up to 3 active trucks; Growth $99/month (up to 10); Pro $199/month (up to 20) (https://hawklanetech.com/fleet-tms-software.html)
  - Motive Compliance Hub: ELD subscriptions from ~$20-30/vehicle/month; Plus tier $35-40/truck (https://www.getfileflo.com/blog/best-eld-paired-compliance-software-2026)
  - TruckLogics: $39.95/month (owner-operators) (https://www.torotms.com/blog/best-tms-software-for-trucking-company)
  - Truckbase: $290/month billed annually (https://www.torotms.com/blog/best-tms-software-for-trucking-company)
  - TruckingOffice: Basic $25/month (1-2 trucks), $55 (3-7), $90 (8+); Pro $35/$75/$130 (https://www.torotms.com/blog/best-tms-software-for-trucking-company)
  - Truckpedia: $300/month for up to 10 trucks (https://truckpedia.io/resources/best-trucking-software-small-fleets)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~6 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (6 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator / small carrier owner. Public-price incumbents: 4. Gatekeeper: regulator gatekeeper: FMCSA ELD mandate forces a certified ELD subscription (Motive/Samsara $20-45/truck/mo) that bundles IFTA/compliance. Top-4 share: 97% of carriers operate fewer than 20 trucks.

**Evidence URLs (26):**
  - https://www.truckingdive.com/news/fmcsa-grants-reinstatements-revocations-operating-authority-2025-data/808968/
  - https://www.overdriveonline.com/smallest-carriers-dot-audits-increased-offsite-scrutiny/
  - https://gofreight.com/blog/best-tms-small-business
  - https://www.torotms.com/blog/best-software-for-small-trucking-company
  - https://hawklanetech.com/simple-carrier-tms.html
  - https://hawklanetech.com/fleet-tms-software.html
  - https://www.getfileflo.com/blog/best-eld-paired-compliance-software-2026
  - https://www.trucklogics.com/tms-software
  - https://www.torotms.com/blog/best-tms-software-for-trucking-company
  - https://www.truckbase.com/
  - https://bouncewatch.com/company/truckbase
  - https://www.crunchbase.com/organization/truckbase-2ce9
  - https://tracxn.com/d/companies/truckingoffice/__tQ0l3kVhGnIRCkB8u3ryogFjCkG6jnVrtjPiPUQfBu8
  - https://truckpedia.io/resources/best-trucking-software-small-fleets
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=AscendTMS&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=106724448668513
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1159595933909687
  - https://adstransparency.google.com/advertiser/AR12816163934314692609?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=556621867762426
  - https://adstransparency.google.com/advertiser/AR08204044081240735745?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=240927662730655
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=453936781127464
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=178207602206225
  - https://adstransparency.google.com/advertiser/AR01600408649618948097?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=223245244209503
  - https://adstransparency.google.com/advertiser/AR13228671310890008577?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 49. Construction equipment rental yards  (NAICS 532412)

- **Status:** audited, not passing. Research: searched (follow-up slice5).
- **Method score:** 8.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** Quipli.
- **Boring test:** 3/3 — Rental contracts, availability, maintenance, damage billing.
- **US establishments:** 937 active companies (unverified, https://siccode.com/naics-code/532412/construction-mining-forestry-machinery-equipment-rental-leasing); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Quipli | yes | 5 | yes | unverified (throttled run) | Quipli | no | 20 / 7 (2023-04-13) | no 0 | 2 |  |
| Point of Rental | yes | 4 | no | unverified (throttled run) | Point of Rental Software | no | 40 / 11 (2023-03-22) | yes 1 | 0 |  |
| EZRentOut (EZO) | yes | 0 | no | unverified (throttled run) | - | no | 92 / 1 (2023-10-04) | no 0 | 0 |  |
| RentMy | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Rentrax | yes | 0 | no | unverified (throttled run) | - | no | 1 / 1 (2026-06-12) | no 0 | 0 |  |
| Reservety | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Texada | yes | 0 | no | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Construction equipment rental yards (NAICS 532412)
> - Incumbents' jobs: rental contracts and availability calendar, online ordering, utilization and maintenance tracking, delivery scheduling, invoicing, telematics (Quipli, Point of Rental, EZRentOut, Texada, Rentrax, Reservety, RentMy).
> - Wedge: an agent that takes contractor rental requests by phone/text, checks availability, generates the contract and delivery ticket, and chases returns/overdue rentals; independents hold about 45% of the market and pay $399+/mo or $6,000/location/yr.
> - Weakest evidence: establishment count (937) looks like a verified-active subset; Quipli's fee is a third-party figure; no vendor-public price beyond EZRentOut.
> - Searches: NAICS count; best rental software 2026; Quipli company; Point of Rental company; concentration/independents share; EZRentOut/Texada pricing.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator independent rental yard (about 45% of market value held by local/independent companies). Public-price incumbents: 1. Gatekeeper: no. Top-4 share: top 5 = 22.2% (United Rentals 10.1%, Sunbelt 6.8%, Herc 2.6%, Loxam 1.8%, H&E 0.9%).

**Evidence URLs (28):**
  - https://siccode.com/naics-code/532412/construction-mining-forestry-machinery-equipment-rental-leasing
  - https://ezo.io/ezrentout/blog/best-equipment-rental-software-compared/
  - https://ezo.io/ezrentout/pricing/
  - https://www.point-of-rental.com/pricing/
  - https://www.point-of-rental.com/press-release/point-rental-software-unveils-monthly-pricing-plans/
  - https://getlatka.com/companies/Point_of_Rental_Software
  - https://pitchbook.com/profiles/company/162361-09
  - https://www.quipli.com/
  - https://softwareconnect.com/reviews/quipli-rental/
  - https://www.crunchbase.com/organization/quipli
  - https://www.prnewswire.com/news-releases/quipli-receives-3-5m-in-funding-to-power-its-next-generation-equipment-rental-management-solution-301739654.html
  - https://rentmy.co/blog/best-equipment-rental-management-software/
  - https://rentrax.com/blog/top-10-equipment-rental-software/
  - https://reservety.com/guides/construction-equipment/construction-equipment-rental-software.html
  - https://ezo.io/ezrentout/blog/ezrentout-vs-point-of-rental-vs-texada-comparison/
  - https://news.ararental.org/
  - https://www.gminsights.com/industry-analysis/construction-equipment-rental-market
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=EZRentOut&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR16180457129176465409?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=296084096504
  - https://adstransparency.google.com/advertiser/AR14655331190307815425?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=109460314543797
  - https://adstransparency.google.com/advertiser/AR05447051385063342081?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=RentMy&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Rentrax&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR02728847053932199937?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Reservety&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Texada&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 50. Party & event rental companies (tents, bounce houses)  (NAICS 532289)

- **Status:** audited, not passing. Research: searched (follow-up slice6).
- **Method score:** 8.5 = ad score 3.5 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Quotes, inventory availability, delivery routing, deposits.
- **US establishments:** 9,353 businesses (2024, https://www.ibisworld.com/industry-statistics/number-of-businesses/party-supply-rental-united-states/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Rentman (party rental) | yes | 4 | no | unverified (throttled run) | Rentman  | no | 26 / 13 (2024-03-07) | yes 11 | 0 |  |
| Booqable (party rental) | yes | 3 | no | unverified (throttled run) | Booqable Rental Software | no | 53 / 35 (2023-02-09) | no 0 | 0 |  |
| Event Rental Systems (ERS) | yes | 3 | no | unverified (throttled run) | Event Rental Systems, Inc. | no | 7 / 3 (2023-11-10) | no 0 | 0 |  |
| Goodshuffle Pro | yes | 3 | no | unverified (throttled run) | Goodshuffle | no | 45 / 5 (2023-06-24) | no 0 | 0 |  |
| Rentopian | yes | 3 | no | unverified (throttled run) | Rentopian - Event Rental Software | no | 5 / 5 (2026-02-18) | no 0 | 0 |  |
| ARM Software (party rental) | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| InTempo Software (party & event rental) | yes |  | unverified | unverified (throttled run) | InTempo Software | no | 0 / 0 (-) | no 0 | 0 |  |
| InflatableOffice | yes | 0 | no | unverified (throttled run) | - | no | 15 / 0 (2022-12-08) | no 0 | 0 |  |
| Reservety | yes |  | unverified | unverified (throttled run) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> — Party & event rental companies · NAICS 532289 · 7 searches
> - **Incumbent jobs:** inventory availability by date, quotes/proposals with e-sign, online booking and deposits, delivery routing, damage waivers (Goodshuffle Pro, InflatableOffice, Event Rental Systems, Rentopian, Booqable, Rentman).
> - **Wedge:** inbound-quote agent that checks availability, prices the package, and sends the contract; weekend-heavy demand and small crews make this the highest-leverage step.
> - **Weakest evidence:** Goodshuffle headcount is a range (25–100); ERS and Rentopian prices come from Software Advice, not vendor pages.
> - **Fragmentation 5/5:** top-4 share 9.0% (explicit IBISWorld figure), four public prices, no gatekeeper.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 5/5. Check signer: owner-operator ('mom-and-pop' per IBISWorld; InflatableOffice free tier under 10 items). Public-price incumbents: 4. Gatekeeper: none found. Top-4 share: 9.0% (top four operators); low concentration; largest Party Rental Ltd.

**Evidence URLs (31):**
  - https://www.ibisworld.com/industry-statistics/number-of-businesses/party-supply-rental-united-states/
  - https://www.armsoftware.com/party-rental-software/
  - https://booqable.com/party-rental-software/
  - https://eventrentalsystems.com/features/
  - https://www.softwareadvice.com/event-rental/
  - https://pro.goodshuffle.com/pricing
  - https://www.owler.com/company/goodshuffleinc
  - https://www.prnewswire.com/news-releases/washington-dc-startup-goodshuffle-raises-5mm-in-series-a-302087168.html
  - https://www.linkedin.com/company/goodshuffle
  - https://www.intemposoftware.com/industries/party-event-rental
  - https://inflatableoffice.com/pricing/
  - https://rentman.io/industries/party-rental
  - https://rentopian.com/event-party-rental-software/
  - https://www.softwareadvice.com/rental/rentopian-profile/
  - https://reservety.com/guides/party-event-rental/party-rental-management-software.html
  - https://www.ibisworld.com/united-states/number-of-businesses/party-supply-rental/4389/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=ARM%20Software&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1507655699470083
  - https://adstransparency.google.com/advertiser/AR17625691874566078465?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=191828113767
  - https://adstransparency.google.com/advertiser/AR04475549367759011841?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=198308396942060
  - https://adstransparency.google.com/advertiser/AR11851906521816367105?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1576125195959577
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=InflatableOffice&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR14247211569501962241?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=538488346022137
  - https://adstransparency.google.com/advertiser/AR13340353173689204737?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1435971013099871
  - https://adstransparency.google.com/advertiser/AR00389413217165639681?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Reservety&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---
