# ideas_ranked.md — Boring-Niche Ad-Validated Idea Miner (US)

## Status: Step 3 ad audit completed for all 134 search-verified tools (run on a local machine, 2026-09-16)

**Qualified niches by the method's definition (≥2 search-verified tools scoring ≥5): 16.** Provisional (would qualify counting tools whose membership in the niche came from prior knowledge, not search): 2. Niches 61–160 were never searched for tools (session search cap), so most of them cannot qualify yet; see README for the rerun plan.

How the numbers were obtained: Meta Ad Library (active ads, US, resolved to the vendor's Page; start dates from Meta's own data feed), Google Ads Transparency Center (creatives with first-shown and last-shown dates from Google's own feed; a creative passes the 90-day test when first shown ≥90 days ago and still shown within 14 days), LinkedIn Ad Library (presence and run dates, advertiser-verified). Scoring follows the brief: Meta +3 (≥5 active and ≥3 running ≥60 days), Google +3 (≥5 ads and ≥3 passing 90 days), LinkedIn +1, bootstrapped/<50 staff +2, direct-response CTA +1. Tool passes at ≥5.

**Ranking:** niche ad score = mean of the two best tool scores among search-verified tools (0–10); method score = ad score + fragmentation score (0–5). Qualified niches first, then everything else by method score, then by the pre-audit provisional score.

Known limits, stated plainly:
- Meta sampling: fast mode read the first 30–60 ads of each Page, newest first. Big advertisers can be undercounted on the "≥3 ads running ≥60 days" test. Tools affected are flagged `undersampled` on their card and a targeted rescrape is queued.
- Three tools with generic names resolved to the wrong Meta Page (Essential, GoPave, Contractor+). Their Meta points are zeroed; five more are flagged ambiguous.
- Fragmentation scores are still conservative: gatekeeper and concentration searches never ran, so no niche got the "no gatekeeper" point.
- Horizontal tools (Jobber, Housecall Pro, ServiceTitan, Service Fusion, FieldPulse) advertise to all home-service trades; a niche that qualifies only through them is marked `horizontal-only`, meaning the category converts but no vertical incumbent proves the niche on its own.

---

## Summary table

| rank | niche | status | tools audited | passing tools | ad score | frag | method score |
|---|---|---|---|---|---|---|---|
| 1 | Residential roofing contractors | QUALIFIED | 6 | RoofSnap, AccuLynx, Roofr, ServiceTitan | 8.5 | 5 | 13.5 |
| 2 | Small residential electrical contractors | QUALIFIED (horizontal-only) | 9 | Housecall Pro, Service Fusion, ServiceTitan | 8.0 | 5 | 13.0 |
| 3 | Irrigation & lawn sprinkler contractors | QUALIFIED | 9 | Housecall Pro, Service Fusion, ServiceTitan, HindSite Software / FieldCentral | 8.0 | 5 | 13.0 |
| 4 | Plumbing contractors | QUALIFIED (horizontal-only) | 5 | FieldPulse, ServiceTitan | 8.0 | 5 | 13.0 |
| 5 | Pressure washing & exterior cleaning | QUALIFIED (horizontal-only) | 10 | Housecall Pro, Service Fusion, Jobber | 8.0 | 5 | 13.0 |
| 6 | Garage door installers & repair | QUALIFIED (horizontal-only) | 8 | FieldPulse, ServiceTitan, Jobber | 8.0 | 4 | 12.0 |
| 7 | Lawn care & landscape maintenance | QUALIFIED | 6 | ServiceTitan, HindSite Software / FieldCentral, RealGreen by WorkWave | 7.0 | 4 | 11.0 |
| 8 | Residential painting contractors | QUALIFIED | 4 | DripJobs, PaintScout | 7.0 | 4 | 11.0 |
| 9 | HVAC contractors | QUALIFIED | 9 | Housecall Pro, ServiceTrade | 6.5 | 4 | 10.5 |
| 10 | Fire extinguisher & fire alarm inspection companies | QUALIFIED | 4 | Inspect Point, ServiceTrade | 5.5 | 5 | 10.5 |
| 11 | Deck & patio builders | QUALIFIED | 5 | Builder Prime, Houzz Pro | 6.0 | 4 | 10.0 |
| 12 | Lawn fertilization & weed control route businesses | QUALIFIED | 5 | HindSite Software / FieldCentral, RealGreen by WorkWave | 5.5 | 4 | 9.5 |
| 13 | Carpet & upholstery cleaning | QUALIFIED (horizontal-only) | 8 | Housecall Pro, Jobber | 7.5 | 2 | 9.5 |
| 14 | Foundation repair & basement waterproofing contractors | QUALIFIED | 3 | Builder Prime, Contractor Accelerator | 6.0 | 3 | 9.0 |
| 15 | Fire sprinkler contractors | QUALIFIED | 5 | Inspect Point, BuildOps, ServiceTrade | 5.5 | 3 | 8.5 |
| 16 | Glass & glazing contractors | QUALIFIED | 4 | FieldPulse, Smart Glazier Software | 7.5 | 1 | 8.5 |
| 17 | Snow removal contractors | audited, not passing | 2 | Aspire | 5.0 | 4 | 9.0 |
| 18 | Low-voltage, alarm & security camera installers | audited, not passing (horizontal-only) | 6 | ServiceTitan | 5.5 | 3 | 8.5 |
| 19 | Gutter installation & cleaning contractors | audited, not passing | 4 | RoofSnap | 6.5 | 2 | 8.5 |
| 20 | Pool service & maintenance routes | audited, not passing | 5 | Pool Brain | 4.5 | 3 | 7.5 |
| 21 | Septic system installers | audited, not passing (horizontal-only) | 7 | ServiceTitan | 5.5 | 2 | 7.5 |
| 22 | Residential cleaning & maid services | audited, not passing (horizontal-only) | 7 | Housecall Pro | 5.5 | 2 | 7.5 |
| 23 | Tree service & arborists | audited, not passing | 8 | - | 3.0 | 4 | 7.0 |
| 24 | Chimney sweeps & chimney repair | audited, not passing (horizontal-only) | 2 | ServiceTitan | 5.0 | 2 | 7.0 |
| 25 | Backflow prevention testing companies | audited, not passing | 2 | Inspect Point | 4.0 | 3 | 7.0 |
| 26 | Stump grinding & land clearing | audited, not passing | 5 | - | 2.5 | 4 | 6.5 |
| 27 | Water well drilling contractors | audited, not passing (horizontal-only) | 4 | Jobber | 4.5 | 2 | 6.5 |
| 28 | Pool builders | audited, not passing (horizontal-only) | 6 | Houzz Pro | 4.5 | 2 | 6.5 |
| 29 | Flooring & tile contractors | audited, not passing | 9 | Builder Prime | 4.0 | 2 | 6.0 |
| 30 | Asphalt paving & sealcoating contractors | audited, not passing | 8 | - | 1.5 | 4 | 5.5 |
| 31 | Concrete flatwork & driveway contractors | audited, not passing | 3 | - | 2.5 | 3 | 5.5 |
| 32 | Window cleaning | audited, not passing | 3 | - | 1.0 | 4 | 5.0 |
| 33 | Pest control operators | audited, not passing | 1 | - | 3 | 2 | 5 |
| 34 | Roll-off dumpster rental | audited, not passing | 1 | - | 4 | 1 | 5 |
| 35 | Portable toilet rental | audited, not passing | 1 | - | 4 | 1 | 5 |
| 36 | Notaries & loan signing agents | audited, not passing | 1 | - | 2 | 3 | 5 |
| 37 | CDL truck driving schools | not audited | 0 | - | 0 | 5 | 5 |
| 38 | Excavation & grading contractors | audited, not passing | 3 | - | 2.5 | 2 | 4.5 |
| 39 | Insulation & spray foam contractors | audited, not passing | 4 | - | 2.0 | 2 | 4.0 |
| 40 | Small fleet trucking companies (1-20 trucks) | not audited | 0 | - | 0 | 4 | 4 |
| 41 | Non-emergency medical transportation providers | not audited | 0 | - | 0 | 4 | 4 |
| 42 | Home health & non-medical home care agencies | not audited | 0 | - | 0 | 4 | 4 |
| 43 | Mold, asbestos & lead abatement contractors | audited, not passing | 8 | - | 2.5 | 1 | 3.5 |
| 44 | Fence contractors | audited, not passing | 3 | - | 1.0 | 2 | 3.0 |
| 45 | Christmas & holiday light installers | audited, not passing | 4 | - | 1.0 | 2 | 3.0 |
| 46 | DOT / trucking compliance consultants | not audited | 0 | - | 0 | 3 | 3 |
| 47 | Hardscape & retaining wall contractors | audited, not passing | 5 | - | 0.5 | 2 | 2.5 |
| 48 | Commercial janitorial companies | audited, not passing | 2 | - | 0.0 | 2 | 2.0 |
| 49 | Mosquito & bird control services | not audited | 0 | - | 0 | 2 | 2 |
| 50 | Window treatment (blinds & shades) installers | audited, not passing | 6 | - | 0.5 | 1 | 1.5 |

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
| JobNimbus | yes | 4 | no | 67 / 0 / 0 (2026-09-10) | JobNimbus | yes | 400 / 21 (2023-07-05) | no 0 | 0 | undersampled |
| Leap | yes | 4 | no | 39 / 0 / 0 (2026-08-13) | LEAP | yes | 200 / 21 (2025-02-05) | no 0 | 0 | ambiguous_page |

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

**Evidence URLs (33):**
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
  - https://adstransparency.google.com/advertiser/AR10881676175608905729?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=108384684000931
  - https://adstransparency.google.com/advertiser/AR05506882014663409665?region=US
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
| Business Genie | yes | 0 | no | 0 / 0 / 0 (-) | Business Genie App | no | 1 / 0 (2026-04-11) | no 0 | 0 |  |
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

**Evidence URLs (45):**
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=100847741736166
  - https://adstransparency.google.com/advertiser/AR15597160687313354753?region=US
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

**Evidence URLs (30):**
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183668204989264
  - https://adstransparency.google.com/advertiser/AR07389967871058640897?region=US
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
| ResponsiBid | yes | 0 | no | 0 / 0 / 0 (-) | ResponsiBid | no | 1 / 0 (2026-05-18) | no 0 | 0 |  |
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

**Evidence URLs (39):**
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=175247412493060
  - https://adstransparency.google.com/advertiser/AR12811532525050527745?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=506971112706787
  - https://adstransparency.google.com/advertiser/AR01281923922538790913?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=211311998732317
  - https://adstransparency.google.com/advertiser/AR10989223771608449025?region=US

**Confidence:** medium-low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 6. Garage door installers & repair  (NAICS 238290)

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

**Evidence URLs (33):**
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183668204989264
  - https://adstransparency.google.com/advertiser/AR07389967871058640897?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1012377458630124
  - https://adstransparency.google.com/advertiser/AR09598966823810760705?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=119199734449082
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=275323565950008
  - https://adstransparency.google.com/advertiser/AR18044909407396954113?region=US

**Confidence:** medium-low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 7. Lawn care & landscape maintenance  (NAICS 561730)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 11.0 = ad score 7.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** ServiceTitan, HindSite Software / FieldCentral, RealGreen by WorkWave.
- **Rescrape queued (Meta undersampled):** RealGreen by WorkWave.
- **Boring test:** 3/3 — Weekly routes, per-visit invoicing, seasonal contracts.
- **US establishments:** 692777 (2025, https://www.ibisworld.com/united-states/number-of-businesses/landscaping-services/1497/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| HindSite Software / FieldCentral | yes | 6 | yes | 4 / 4 / 0 (2026-06-22) | HindSite Software | yes | 12 / 9 (2021-10-25) | no 0 | 2 |  |
| RealGreen by WorkWave | yes | 5 | yes | 44 / 0 / 0 (2026-08-26) | RealGreen | yes | 200 / 24 (2024-01-08) | yes 12 | 0 | undersampled |
| Service Autopilot | yes | 3 | no | 0 / 0 / 0 (-) | Service Autopilot by Xplor | no | 25 / 16 (2023-07-28) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
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

**Evidence URLs (36):**
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=134906377100
  - https://adstransparency.google.com/advertiser/AR03990788228809490433?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=85289916525
  - https://adstransparency.google.com/advertiser/AR01165979373417791489?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=470730253043212
  - https://adstransparency.google.com/advertiser/AR14036505301503442945?region=US

**Confidence:** medium-low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 8. Residential painting contractors  (NAICS 238320)

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

**Evidence URLs (30):**
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=107630083990856
  - https://adstransparency.google.com/advertiser/AR05074473864172404737?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 9. HVAC contractors  (NAICS 238220)

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

**Evidence URLs (32):**
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=431381633653850
  - https://adstransparency.google.com/advertiser/AR17264116582418743297?region=US
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

## 10. Fire extinguisher & fire alarm inspection companies  (NAICS 561621)

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
| Essential | yes | 0 | no | 68 / 0 / 0 (2026-07-31) | Essential Sleep Hacks | no | 5 / 0 (2024-07-01) | no 0 | 0 | wrong_page |

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

**Evidence URLs (27):**
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=854398374581747
  - https://adstransparency.google.com/advertiser/AR17562238852368695297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=709305829119809
  - https://adstransparency.google.com/advertiser/AR07759657559018962945?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=274498879078525
  - https://adstransparency.google.com/advertiser/AR03041127185357209601?region=US

**Confidence:** medium-low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 11. Deck & patio builders  (NAICS 236118)

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
| JobNimbus | yes | 4 | no | 67 / 0 / 0 (2026-09-10) | JobNimbus | yes | 400 / 21 (2023-07-05) | no 0 | 0 | undersampled |
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

**Evidence URLs (18):**
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
  - https://adstransparency.google.com/advertiser/AR10881676175608905729?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=2146347565625894
  - https://adstransparency.google.com/advertiser/AR15154333676306694145?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** medium-low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 12. Lawn fertilization & weed control route businesses  (NAICS 561730)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 9.5 = ad score 5.5 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** HindSite Software / FieldCentral, RealGreen by WorkWave.
- **Rescrape queued (Meta undersampled):** RealGreen by WorkWave.
- **Boring test:** 3/3 — Program scheduling, pesticide application records, state applicator licenses.
- **US establishments:** 117969 (2023, https://www.lawnstarter.com/blog/statistics/lawn-care-landscaping-statistics-2026/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| HindSite Software / FieldCentral | yes | 6 | yes | 4 / 4 / 0 (2026-06-22) | HindSite Software | yes | 12 / 9 (2021-10-25) | no 0 | 2 |  |
| RealGreen by WorkWave | yes | 5 | yes | 44 / 0 / 0 (2026-08-26) | RealGreen | yes | 200 / 24 (2024-01-08) | yes 12 | 0 | undersampled |
| Service Autopilot | yes | 3 | no | 0 / 0 / 0 (-) | Service Autopilot by Xplor | no | 25 / 16 (2023-07-28) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Momentum FSM | yes | 0 | no | 0 / 0 / 0 (-) | Momentum | no | 0 / 0 (-) | no 0 | 0 | ambiguous_page |

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

**Evidence URLs (26):**
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=134906377100
  - https://adstransparency.google.com/advertiser/AR03990788228809490433?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=85289916525
  - https://adstransparency.google.com/advertiser/AR01165979373417791489?region=US

**Confidence:** medium-low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 13. Carpet & upholstery cleaning  (NAICS 561740)

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

## 14. Foundation repair & basement waterproofing contractors  (NAICS 238190)

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

## 15. Fire sprinkler contractors  (NAICS 238220)

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

## 16. Glass & glazing contractors  (NAICS 238150)

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

## 17. Snow removal contractors  (NAICS 561790)

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

**Evidence URLs (16):**
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 18. Low-voltage, alarm & security camera installers  (NAICS 238210)

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

## 19. Gutter installation & cleaning contractors  (NAICS 238170)

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

## 20. Pool service & maintenance routes  (NAICS 561790)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 7.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** Pool Brain.
- **Boring test:** 3/3 — Weekly route stops, chemical logs, repair upsells.
- **US establishments:** 78817 (2025, https://www.ibisworld.com/united-states/number-of-businesses/swimming-pool-cleaning-services/4832/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Pool Brain | yes | 5 | yes | 0 / 0 / 0 (-) | PoolBrain | no | 95 / 8 (2022-12-22) | no 0 | 2 |  |
| Skimmer | yes | 4 | no | 0 / 0 / 0 (-) | Skimmer | no | 90 / 25 (2023-07-05) | yes 12 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Pool Founder | yes | 0 | no | 0 / 0 / 0 (-) | Pool Founder | no | 1 / 0 (2026-04-02) | no 0 | 0 |  |
| PoolDial | yes | 0 | no | 0 / 0 / 0 (-) | PoolDial | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Pool service & maintenance routes
> - Core jobs: weekly route sequencing and density mapping, chemical readings and dosing logs at each stop (Skimmer digital service logs), per-pool billing, service reports with photos emailed to customers, spring open/fall close scheduling, AI phone answering (PoolDial).
> - Incumbents: Skimmer ($98/mo + $2/pool, $84M VC, 29,000 pros, 700,000 pools), Pool Brain ($55/user + $10/admin, 11-50 staff, Phoenix), PoolDial (per-pool, amount unverified), Pool Founder, PoolVerify, QuoteIQ.
> - Agent wedge: chemistry-plus-communication agent. Techs enter readings; an agent computes dosing, flags equipment issues, drafts the customer report, and schedules repairs/upsells. Skimmer doubling its per-pool fee signals pricing power that a cheaper agent can undercut for the 2-3x larger sole-proprietor tail Poolfounder describes.
> - Weakest evidence: franchisors (Poolwerx/Norwest, Pool Scouts) exist but whether they mandate software is unverified; no top-4 share; PoolDial/Pool Founder/PoolVerify have no verified pricing.

**The agent version** [hypothesis]: Weekly route generation → chemical log per stop from tech texts/photos → repair upsell quotes → monthly invoicing. Needs: SMS, route optimization, invoicing.

**Wedge** [hypothesis]: Route-and-chemical-log agent for solo pool routes.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Pool Brain: $55/user/mo technicians + $10/mo per admin seat (per https://pooldial.com/resources/articles/software-reviews/poolbrain-review) (https://www.capterra.com/p/194225/Pool-Brain/)
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - Skimmer: $98/mo base + $2/mo per additional location (per https://www.poolfounder.com/skimmer-pricing-review); PoolDial cites $29-$49/mo tiers (https://www.getskimmer.com/pricing)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 3/5. Check signer: owner-operator (route owners; franchises like Poolwerx/Pool Scouts exist). Public-price incumbents: 3. Gatekeeper: franchisors present (Poolwerx backed by Norwest; Pool Scouts) but software mandate unverified. Top-4 share: unverified.

**Evidence URLs (22):**
  - https://www.ibisworld.com/united-states/number-of-businesses/swimming-pool-cleaning-services/4832/
  - https://www.capterra.com/p/194225/Pool-Brain/
  - https://www.linkedin.com/company/poolbrain
  - https://www.poolfounder.com/pool-service-software-pricing
  - https://pooldial.com/resources/articles/software-reviews/best-pool-service-software
  - https://myquoteiq.com/best-route-optimization-software-pool-service-2026/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://www.getskimmer.com/
  - https://www.getskimmer.com/pricing
  - https://www.poolfounder.com/skimmer-pricing-review
  - https://poolwerxfranchising.com/poolwerx-and-norwest-join-forces-to-dominate-the-pool-maintenance-industry/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=407333409864667
  - https://adstransparency.google.com/advertiser/AR15570575535535816705?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=958383427357880
  - https://adstransparency.google.com/advertiser/AR01168260387599024129?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=839352082593900
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=113269167207176
  - https://adstransparency.google.com/advertiser/AR11995227690698276865?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 21. Septic system installers  (NAICS 238910)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 7.5 = ad score 5.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** ServiceTitan.
- **Boring test:** 3/3 — Digging and permitting tanks; county health-dept permits and as-built drawings.
- **US establishments:** 38,839 establishments (38,433 businesses); septic installers are a subset of NAICS 238910 Site Preparation Contractors (2020, https://naicslist.com/naics/238910); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| Bella FSM | yes | 3 | no | 0 / 0 / 0 (-) | Bella FSM | no | 8 / 3 (2025-05-02) | no 0 | 0 | horizontal |
| ServiceCore | yes | 3 | no | 3 / 0 / 0 (2026-09-09) | ServiceCore | no | 24 / 12 (2023-04-28) | yes 11 | 0 |  |
| PumpDocket | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 2 / 0 (2026-04-10) | no 0 | 0 |  |
| PumperPro | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| SepticPro | yes | 0 | no | 0 / 0 / 0 (-) | Septicpro | no | 0 / 0 (-) | no 0 | 0 |  |
| Smart Service | yes | 0 | no | 0 / 0 / 0 (-) | Smart Service | no | 0 / 0 (-) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Septic system installers (238910)
> - Core jobs: dispatch pump trucks, recurring service-interval scheduling and routing by neighborhood, trip tickets / DOT manifests / jurisdiction compliance paperwork, same-day invoicing, QuickBooks sync (ServiceCore, PumpDocket, Smart Service, Bella FSM). SepticPro adds county permit data and site plans for installers.
> - Wedge: an agent that pulls county permit requirements, drafts the site-plan/permit packet and the compliance trip ticket per jurisdiction, then schedules the pumping reminder. Installers are under-served; most tools are pumping-centric.
> - Weakest evidence: no installer-only establishment count (NAICS 238910 mixes excavation, demolition and septic); PumpDocket price attribution within the result set is uncertain; no vendor headcounts beyond ServiceCore (163, VC-backed).

**The agent version** [hypothesis]: County health-department permit application → as-built drawing package → inspection scheduling → invoice. Needs: county portals/forms, drawing template, calendar.

**Wedge** [hypothesis]: County septic permit and as-built paperwork agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - PumpDocket: $99/mo (1-3 trucks Starter); $230/mo 4-10 trucks; $454/mo 11+ trucks (https://www.pumpdocket.com/septic-software)
  - ServiceCore: $200/mo per truck (third-party listing; vendor requires demo) (https://servicecore.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (small pumping/installation firms; vendors price per truck, 1-3 truck starter tiers). Public-price incumbents: 2. Gatekeeper: not searched (session search budget exhausted). Top-4 share: unverified.

**Evidence URLs (25):**
  - https://naicslist.com/naics/238910
  - https://www.bellafsm.com/industries/septic-software/scheduling/
  - https://www.pumpdocket.com/septic-software
  - https://www.softwareadvice.com/product/538880-PumpDocket/
  - https://pumperpro.app/
  - https://septicprotools.com/pricing
  - https://servicecore.com/septic-business-software/
  - https://servicecore.com/pricing/
  - https://www.cbinsights.com/company/servicecore
  - https://www.crunchbase.com/organization/servicecore
  - https://www.capterra.com/p/158918/ServiceCore/
  - https://www.linkedin.com/company/servicecore
  - https://www.servicetitan.com/industries/septic-business-software
  - https://www.smartservice.com/industry/septic-tank-service-software
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=185269961511257
  - https://adstransparency.google.com/advertiser/AR09429960273030021121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=PumpDocket&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://adstransparency.google.com/advertiser/AR00771463958442803201?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=PumperPro&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=115991701940916
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=624372454388997
  - https://adstransparency.google.com/advertiser/AR16372434505086009345?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=119199734449082

**Confidence:** low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 22. Residential cleaning & maid services  (NAICS 561720)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 7.5 = ad score 5.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** Housecall Pro.
- **Boring test:** 3/3 — Recurring scheduling, cleaner assignment, quotes by sq ft.
- **US establishments:** 356516 (2024, https://www.ibisworld.com/united-states/number-of-businesses/residential-cleaning-services/6542/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Housecall Pro | yes | 8 | yes | 706 / 3 / 3 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | horizontal |
| ZenMaid | yes | 3 | no | 0 / 0 / 0 (-) | ZenMaid | no | 39 / 16 (2024-01-10) | no 0 | 0 |  |
| MaidCentral | yes | 1 | no | 0 / 0 / 0 (-) | MaidCentral Software | no | 0 / 0 (-) | yes 8 | 0 |  |
| CleansyAI | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| MaidEasy | yes | 0 | no | 0 / 0 / 0 (-) | Maid Easy | no | 0 / 0 (-) | no 0 | 0 |  |
| QuoteIQ | no (prior knowledge) | 0 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| The Cleaning Software | yes | 0 | no | 0 / 0 / 0 (-) | The Cleaning Software | no | 3 / 1 (2025-11-03) | no 0 | 0 |  |
| Zenbooker | yes | 0 | no | 0 / 0 / 0 (-) | Zenbooker | no | 17 / 0 (2026-04-07) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Residential cleaning & maid services
> - Core jobs users log in for (from snippets): recurring appointment scheduling, crew dispatch, online booking widgets embedded on the owner's site (Zenbooker), customer reminders, invoicing/payments, payroll (MaidEasy), kiosk/employee communication (MaidCentral).
> - Vertical tools are plentiful (ZenMaid, MaidCentral, MaidEasy, Zenbooker, The Cleaning Software, CleansyAI) plus horizontal Housecall Pro/Jobber/QuoteIQ landing pages; only QuoteIQ's $29.99/mo appeared in a result (its own listicle).
> - Agent wedge: an inbound-lead-to-booked-recurring-clean agent (quote from photos/sq ft, book, remind, reschedule, chase no-shows) for owners with 1-5 cleaners; the incumbents still require the owner to configure schedules by hand.
> - Weakest link: no pricing pages, headcounts or ad evidence captured; 356,516 IBISWorld count is an industry definition that includes solo cleaners, so serviceable market is much smaller.

**The agent version** [hypothesis]: Inbound quote by sq ft/rooms → recurring schedule → cleaner assignment texts → payment collection → rebooking on cancellations. Needs: SMS, calendar, payments.

**Wedge** [hypothesis]: Quote-book-collect agent for solo/small maid services.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~3 hrs/week.

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (small maid-service owners; ZenMaid markets to '3,000+ maid service owners'). Public-price incumbents: 1. Gatekeeper: unverified. Top-4 share: unverified.

**Evidence URLs (22):**
  - https://www.ibisworld.com/united-states/number-of-businesses/residential-cleaning-services/6542/
  - https://cleansyai.com/blog/best-maid-service-software
  - https://www.housecallpro.com/industries/maid-service-software/
  - https://maidcentral.com/
  - https://maideasysoftware.com/
  - https://thecleaningsoftware.com/
  - https://get.zenmaid.com/
  - https://zenbooker.com/residential-cleaning-online-booking.html
  - https://myquoteiq.com/top-8-softwares-for-maid-services-in-2026/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=CleansyAI&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=431381633653850
  - https://adstransparency.google.com/advertiser/AR17264116582418743297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=374531319837407
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=101986182288836
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=171037069427113
  - https://adstransparency.google.com/advertiser/AR16207372297651093505?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1046212555396157
  - https://adstransparency.google.com/advertiser/AR04437329209706151937?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1498364030464955
  - https://adstransparency.google.com/advertiser/AR15571010589953097729?region=US

**Confidence:** low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 23. Tree service & arborists  (NAICS 561730)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 7.0 = ad score 3.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** none.
- **Rescrape queued (Meta undersampled):** SingleOps.
- **Boring test:** 3/3 — Estimates, crane/crew scheduling, ISA/permit paperwork.
- **US establishments:** 175035 (2025, https://www.ibisworld.com/united-states/number-of-businesses/tree-trimming-services/6064/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ArboStar | yes | 3 | no | 3 / 2 / 0 (2026-05-29) | ArboStar | yes | 33 / 0 (2022-08-13) | yes 6 | 2 |  |
| Arborgold | yes | 3 | no | 0 / 0 / 0 (-) | Arborgold Software | no | 17 / 6 (2021-10-25) | no 0 | 0 |  |
| GorillaDesk | yes | 3 | no | 0 / 0 / 0 (-) | GorillaDesk | no | 81 / 34 (2023-05-25) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| SingleOps | yes | 2 | no | 42 / 0 / 0 (2026-07-23) | SingleOps | yes | 21 / 0 (2024-10-01) | yes 9 | 0 | undersampled |
| ArboristDesk | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Fieldified | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Treezi | yes | 0 | no | 0 / 0 / 0 (-) | Treezi | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Tree service & arborists
> - Core jobs users log in for: CRM/lead tracking, estimating (often photo-based), crew scheduling and dispatch, invoicing/online payments, GPS tree mapping and tree inventory, plant-health-care (PHC) program contracts, safety/compliance records, fleet tracking (ArboStar, Arborgold, SingleOps, Treezi snippets).
> - Incumbents: ArboStar (47 staff, bootstrapped, quote-only pricing), SingleOps (88 staff, VC, now Granum, bought LMN), Arborgold ($129/mo, founded 2004), Treezi ($49.99/user), ArboristDesk ($79/mo, 14-day trial), QuoteIQ ($29.99).
> - Agent wedge: photo-to-estimate plus tree-inventory/PHC renewal agent. Tree jobs are quoted on site from photos and sizes; an agent that turns a homeowner's photos and address into a priced proposal, then auto-runs PHC/pruning-cycle renewals, replaces the estimating + CRM seats owner-operators pay $79-$299/mo for.
> - Weakest evidence: IBISWorld business count conflicts internally (175,035 vs 19,929 operators); no ad-library signal captured; SingleOps funding figures conflict ($8.6M vs $82.6M).

**The agent version** [hypothesis]: Homeowner photos + address in → priced tree-work proposal with ISA-style scope → schedule crew/crane window → PHC and pruning-cycle renewals sent automatically each season. Needs: SMS/email, photo intake, pricing rules per operator, calendar, invoicing.

**Wedge** [hypothesis]: Photo-to-estimate agent for removals/pruning; expand into PHC renewal cycles.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Arborgold: $129/mo Starter (Professional $299, Enterprise $499, prepaid annually) per https://fieldserviceguide.com/arborgold-2/ (https://www.capterra.com/p/12741/Arborgold/pricing/)
  - ArboristDesk: $79/mo Starter ($69/mo annual); Growth $149; Pro $249; extra users $12-18/mo (https://arboristdesk.com/pricing/)
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - SingleOps: $200/mo (third-party claim, https://serviceagent.ai/blogs/tree-care-crm-software/) (https://granum.com/singleops/pricing/)
  - Treezi: $49.99/user/mo Boost-In ($503.88/user/yr annual) per https://www.guideflow.com/blog/tree-service-software (https://treeziapp.com/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (small tree companies; founders of ArboStar/Treezi/QuoteIQ are ex-contractors). Public-price incumbents: 4. Gatekeeper: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: low concentration (share unverified).

**Evidence URLs (37):**
  - https://www.ibisworld.com/united-states/number-of-businesses/tree-trimming-services/6064/
  - https://arbostar.com/arborist-software/tree-care-crm
  - https://g2.com/products/arbostar/pricing
  - https://getlatka.com/companies/arbostar
  - https://www.crunchbase.com/organization/arbostar
  - https://www.softwareadvice.com/forestry/arbostar-profile/
  - https://ca.linkedin.com/company/arbostar
  - https://www.capterra.com/p/12741/Arborgold/
  - https://www.capterra.com/p/12741/Arborgold/pricing/
  - https://fervorstudio.ca/news/arborgold-review-pricing-alternatives/
  - https://arboristdesk.com/pricing/
  - https://fieldified.com/blog/apps-for-arborists
  - https://gorilladesk.com/industries/tree-service-software/
  - https://myquoteiq.com/top-10-crms-for-tree-service-businesses-in-2026/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://granum.com/singleops/pricing/
  - https://getlatka.com/companies/singleops
  - https://tracxn.com/d/companies/singleops/__wpGjZc-FoFtwDsALEMuFrBrrabFaDIuhque36M33rDk
  - https://www.capterra.com/p/176935/SingleOps/
  - https://treeziapp.com/
  - https://aplustree.com/treezi/
  - https://www.ibisworld.com/united-states/industry/tree-trimming-services/6064/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=105872330787722
  - https://adstransparency.google.com/advertiser/AR16717311514142310401?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=334976265915
  - https://adstransparency.google.com/advertiser/AR08308089114230521857?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=ArboristDesk&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Fieldified&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=387445444655938
  - https://adstransparency.google.com/advertiser/AR10520026520397807617?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=162421207288610
  - https://adstransparency.google.com/advertiser/AR12829969393723113473?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=101495245470701

**Confidence:** low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 24. Chimney sweeps & chimney repair  (NAICS 561790)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 7.0 = ad score 5.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** ServiceTitan.
- **Boring test:** 3/3 — Level-2 inspection reports, seasonal routes, CSIA paperwork.
- **US establishments:** 6313 (2024, https://www.ibisworld.com/united-states/market-research-reports/fireplace-services-industry/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Chimney sweeps & chimney repair
> - Core jobs: Level 1/2/3 inspection pricing and documentation (CSIA tiers), photo-based inspection reports for liner/cap work, annual sweep reminders (12-month recurrence), Oct-Feb seasonal capacity planning, invoicing.
> - Incumbents: no chimney-specific vertical SaaS surfaced; ServiceTitan (dedicated landing), QuoteIQ (SEO pages, $29.99), Housecall Pro and Jobber (mentioned without dedicated landing URLs).
> - Agent wedge: inspection-report and annual-recall agent - assembles the photo-documented Level 1/2 report from tech inputs, sends it to the homeowner and (for real estate transactions) the agent/buyer, and books the following year's sweep. The report itself is a compliance artifact incumbents treat as a generic photo attachment.
> - Weakest evidence: only 2 tools with verified niche landing pages (fails the 3-tool bar); IBISWorld Fireplace Services count (6,313) is a shrinking proxy category; whether CSIA or NCSG endorse any software is unverified.

**The agent version** [hypothesis]: Seasonal sweep rebooking → Level-2 inspection report drafted from tech photos/notes → repair quote → invoice. Needs: SMS, report template, photo intake.

**Wedge** [hypothesis]: Level-2 inspection report agent for chimney sweeps.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (small sweep companies; CSIA-certified techs). Public-price incumbents: 1. Gatekeeper: CSIA certification/inspection levels referenced; software mandate unverified. Top-4 share: unverified.

**Evidence URLs (11):**
  - https://www.ibisworld.com/united-states/market-research-reports/fireplace-services-industry/
  - https://myquoteiq.com/top-8-softwares-for-chimney-sweep-businesses-in-2026/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://www.servicetitan.com/industries/chimney-sweep-software
  - https://www.cleansavannah.com/post/best-chimney-sweep-software-2026
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=179317675454866
  - https://adstransparency.google.com/advertiser/AR00871924403137413121?region=US

**Confidence:** low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 25. Backflow prevention testing companies  (NAICS 238220)

- **Status:** audited, not passing. Research: searched (follow-up batch 17, 2026-09-17).
- **Method score:** 7.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** Inspect Point.
- **Boring test:** 3/3 — Annual test scheduling, water-purveyor report submission, gauge calibration.
- **US establishments:** 111,200 (NAICS 238220 plumbing/HVAC contractors; backflow-only subset unverified) (2023, https://www.ibisworld.com/classifications/naics/238220/plumbing-heating-and-air-conditioning-contractors/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Inspect Point | yes | 6 | yes | 0 / 0 / 0 (-) | Inspect Point | no | 76 / 20 (2023-03-13) | yes 5 | 2 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Backflow prevention testing companies (NAICS 238220) — 8 searches
> - Incumbents' jobs: tester-side scheduling/annual retest reminders/invoicing (QuoteIQ, FieldPie, Truwave, EcosConnect) and utility-side tracking portals that testers are forced to file into (BSI Online $15.95/test, SwiftComply $10/passed test in Dallas, Tokay). Inspect Point covers backflow as a trade module of fire ITM.
> - Wedge: an agent that pulls each tester's assembly list, auto-files results into whichever utility portal governs the address (BackflowPath catalogs portals by city), and triggers the annual retest reminder + repair quote. The portal maze is the pain; nobody tester-side owns it.
> - Weakest evidence: no backflow-specific establishment count (only NAICS 238220 = 111,200); tester-side vendors' headcounts/pricing (Truwave, EcosConnect, Backflow Reporter) never surfaced.
> - Searches: bizbite/industry size; "backflow testing" software; best backflow software 2026; scheduling CRM pricing; NAICS 238220 count; Inspect Point crunchbase; BSI Online fees; utility portal mandates.

**The agent version** [hypothesis]: Annual test due dates per device → customer scheduling by text → test results captured → report submitted to each water purveyor in its required format. Needs: purveyor portals/forms, SMS, calendar.

**Wedge** [hypothesis]: Backflow test-report submission agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - BSI Online (Backflow Solutions Inc): $15.95 filing fee per test report (range $12.95-$19.95 by jurisdiction) (https://www.bsionlinetracking.com/default/terms-conditions)
  - QuoteIQ: $29.99/month (Essentials) (https://myquoteiq.com/crm-for-backflow-testing-companies/)
  - SwiftComply: $10 per passed test (City of Dallas program) (https://dallascityhall.com/departments/waterutilities/Pages/Backflow-Test-Reports.aspx)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 3/5. Check signer: owner-operator / small plumbing or fire-protection contractor. Public-price incumbents: 3. Gatekeeper: yes: water utilities mandate submission through contracted portals (BSI Online, SwiftComply, Tokay) with per-test filing fees; Dallas enrollment mandatory. Top-4 share: unverified.

**Evidence URLs (17):**
  - https://www.ibisworld.com/classifications/naics/238220/plumbing-heating-and-air-conditioning-contractors/
  - https://backflow.com/
  - https://www.bsionlinetracking.com/default/terms-conditions
  - https://backflowreporter.app/
  - https://www.ecosconnect.com/
  - https://www.fieldpie.com/home-service/backflow-testing-software/
  - https://www.inspectpoint.com/trades/backflow/
  - https://pitchbook.com/profiles/company/439227-91
  - https://www.crunchbase.com/organization/inspect-point
  - https://myquoteiq.com/crm-for-backflow-testing-companies/
  - https://www.swiftcomply.com/backflow-testers/
  - https://dallascityhall.com/departments/waterutilities/Pages/Backflow-Test-Reports.aspx
  - https://www.truwavesoftware.com/backflow.html
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=854398374581747
  - https://adstransparency.google.com/advertiser/AR17562238852368695297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 26. Stump grinding & land clearing  (NAICS 238910)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 6.5 = ad score 2.5 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** none.
- **Rescrape queued (Meta undersampled):** SingleOps.
- **Boring test:** 3/3 — Per-stump quotes, equipment scheduling, 811 locates.
- **US establishments:** 38839 (2020, https://www.insurancexdate.com/naics/238910); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Arborgold | yes | 3 | no | 0 / 0 / 0 (-) | Arborgold Software | no | 17 / 6 (2021-10-25) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| SingleOps | yes | 2 | no | 42 / 0 / 0 (2026-07-23) | SingleOps | yes | 21 / 0 (2024-10-01) | yes 9 | 0 | undersampled |
| OctopusPro | yes | 0 | no | 0 / 0 / 0 (-) | Octopus Pro | no | 0 / 0 (-) | no 0 | 0 |  |
| Yardbook | yes | 0 | no | 0 / 0 / 0 (-) | Yardbook | no | 37 / 0 (2026-04-02) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Stump grinding & land clearing
> - Core jobs: fast per-stump quoting from photos/diameter, scattered-property routing, invoicing/payment on completion, 2-way texting, follow-up on unconverted quotes (treeservicesoftware.com, QuoteIQ snippets). Land clearing (NAICS 238910) is more excavation/site-prep oriented and no tool for it surfaced.
> - Incumbents: no stump-only vertical with public pricing; operators use tree tools (Arborgold $129, ArboristDesk $79, Treezi $49.99, SingleOps), OctopusPro's tree landing page, QuoteIQ, or free Yardbook.
> - Agent wedge: photo-to-price stump quoting with instant text booking for single-machine operators who are underserved by $79-$299/mo arborist suites. The niche is small enough that incumbents do not build for it, which is exactly the agent-as-a-service opening.
> - Weakest evidence: establishment count is for NAICS 238910 broadly (site prep, ~38,839 establishments, 2020) and the exact result page for that figure is inferred; stump-grinder-specific counts do not exist.

**The agent version** [hypothesis]: Per-stump/acre quote from photos and site map → 811 locate ticket filed → equipment day scheduled → invoice. Needs: 811 portal, photo intake, calendar, invoicing.

**Wedge** [hypothesis]: Quote-and-811-locate agent for stump/clearing jobs.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Arborgold: $129/mo Starter (Professional $299, Enterprise $499, prepaid annually) per https://fieldserviceguide.com/arborgold-2/ (https://www.capterra.com/p/12741/Arborgold/pricing/)
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - SingleOps: $200/mo (third-party claim, https://serviceagent.ai/blogs/tree-care-crm-software/) (https://granum.com/singleops/pricing/)
  - Yardbook: $0/mo Starter (free indefinitely); paid $15-60/mo (https://fieldtics.com/blog/yardbook-review) (https://www.capterra.com/p/207272/Yardbook/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (single-machine stump grinders; small excavation crews). Public-price incumbents: 4. Gatekeeper: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: low concentration (tree trimming parent industry; share unverified).

**Evidence URLs (27):**
  - https://www.insurancexdate.com/naics/238910
  - https://www.capterra.com/p/12741/Arborgold/
  - https://www.capterra.com/p/12741/Arborgold/pricing/
  - https://fervorstudio.ca/news/arborgold-review-pricing-alternatives/
  - https://octopuspro.com/tree-service-software/
  - https://myquoteiq.com/stump-grinding-business-crm/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://granum.com/singleops/pricing/
  - https://getlatka.com/companies/singleops
  - https://tracxn.com/d/companies/singleops/__wpGjZc-FoFtwDsALEMuFrBrrabFaDIuhque36M33rDk
  - https://www.capterra.com/p/176935/SingleOps/
  - https://myquoteiq.com/top-8-softwares-for-stump-grinding-in-2026/
  - https://www.capterra.com/p/207272/Yardbook/
  - https://arboristdesk.com/pricing/
  - https://treeziapp.com/
  - https://www.ibisworld.com/united-states/industry/tree-trimming-services/6064/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=334976265915
  - https://adstransparency.google.com/advertiser/AR08308089114230521857?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=200971729759285
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=162421207288610
  - https://adstransparency.google.com/advertiser/AR12829969393723113473?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=470730253043212
  - https://adstransparency.google.com/advertiser/AR14036505301503442945?region=US

**Confidence:** low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 27. Water well drilling contractors  (NAICS 237110)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 6.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** Jobber.
- **Boring test:** 3/3 — State well logs, driller licensing, pump service call-backs.
- **US establishments:** 7,414 companies (entire NAICS 237110 Water and Sewer Line and Related Structures Construction; well drilling is a subset) (unverified, https://siccode.com/naics-code/237110/water-sewer-line-structures-construction); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Jobber | yes | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| DrillerDB | yes | 2 | no | 0 / 0 / 0 (-) | Driller DB | no | 5 / 0 (2024-11-07) | no 0 | 2 |  |
| IKOL | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| WellMagic | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Water well drilling contractors (237110)
> - Core jobs: quotes, field well logs (offline), state well-record e-filing, well map, pump service tracking, inventory, billing/AR (DrillerDB, WellMagic).
> - Wedge: state well-log completion and e-filing from a voice/photo capture at the rig, plus the customer-facing quote. DrillerDB (founded 2024, tiny team, $99-$799/mo) proves the buyer exists; WellMagic is a legacy incumbent with no public price.
> - Weakest evidence: establishment count is the whole NAICS 237110 (7,414), not well drillers; only 4 tools found and two (IKOL, WellMagic) have no pricing or company data.

**The agent version** [hypothesis]: Well-permit application to the state → drill log / well completion report filed → pump service reminders → invoice. Needs: state well portals, form templates, SMS.

**Wedge** [hypothesis]: State well-log and permit filing agent for drillers.

**Price ceiling:** incumbent public prices found [search-cited]:
  - DrillerDB: $99/mo (range $99-$799/mo) (https://drillerdb.com/pricing)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (family drilling contractors; DrillerDB tiers from $99/mo). Public-price incumbents: 2. Gatekeeper: not searched (session search budget exhausted). Top-4 share: unverified.

**Evidence URLs (15):**
  - https://siccode.com/naics-code/237110/water-sewer-line-structures-construction
  - https://drillerdb.com/
  - https://drillerdb.com/pricing
  - https://growjo.com/company/DrillerDB
  - https://www.crunchbase.com/organization/drillerdb
  - https://g2.com/sellers/drillerdb
  - https://ikol.com/industry-well-drilling
  - https://www.getjobber.com/industries/well-water-services/
  - https://www.wellmagic.net/about-us
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=346753368510466
  - https://adstransparency.google.com/advertiser/AR07786644882944163841?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=IKOL&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183668204989264
  - https://adstransparency.google.com/advertiser/AR07389967871058640897?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=WellMagic&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc

**Confidence:** low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 28. Pool builders  (NAICS 238990)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 6.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** Houzz Pro.
- **Boring test:** 3/3 — Permit sets, subcontractor sequencing, change orders.
- **US establishments:** 22,731 (IBISWorld Swimming Pool Construction businesses) (2026, https://www.ibisworld.com/industry-statistics/number-of-businesses/swimming-pool-construction-united-states/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Houzz Pro | yes | 6 | yes | 82 / 14 / 0 (2026-06-11) | Houzz Pro | no | 700 / 38 (2021-10-25) | no 0 | 0 | horizontal |
| ProDBX | yes | 3 | no | 2 / 2 / 1 (2026-02-20) | Prodbx | no | 20 / 15 (2024-08-01) | no 0 | 0 |  |
| 123worx | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Poologics | yes | 0 | no | 0 / 0 / 0 (-) | Poologics | no | 3 / 0 (2025-09-25) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| Streamline CRM | yes | 0 | no | 0 / 0 / 0 (-) | Streamline CRM | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Pool builders (238990)
> - Core jobs: lead pipeline with milestone stages, estimating/proposals, phase-based construction scheduling across subs, change orders, punch lists, warranties, customer texting (Poologics, ProDBX, 123worx, Houzz Pro).
> - Wedge: sub-trade sequencing and homeowner status updates during a multi-week build; an agent that reads the schedule and keeps subs and homeowners informed would cut the coordinator role. 22,731 businesses (IBISWorld 2026) growing 4.2%/yr.
> - Weakest link: no pricing, founding or headcount data captured for any pool-specific vendor; concentration unverified.

**The agent version** [hypothesis]: Permit set assembly → subcontractor sequencing calendar → change-order documentation → draw requests. Needs: permit portals, calendar, PDF.

**Wedge** [hypothesis]: Permit-set and sub-sequencing agent for pool builders.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~5 hrs/week.

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (pool builders). Public-price incumbents: 1. Gatekeeper: unverified (search budget exhausted before this check). Top-4 share: unverified.

**Evidence URLs (18):**
  - https://www.ibisworld.com/industry-statistics/number-of-businesses/swimming-pool-construction-united-states/
  - https://123worx.com/blog/project-management-software-for-pool-builders/
  - https://pro.houzz.com/for-pros/software-pool-builder-crm
  - https://www.poologics.com/
  - https://prodbx.com/software/pool-contractor-software/
  - https://myquoteiq.com/top-8-softwares-for-pool-installation-businesses-in-2026/
  - https://streamlinecrm.com/pool-construction-software/
  - https://myquoteiq.com/top-10-best-job-management-software-for-hardscaping-contractors-in-2026/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=123worx&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=111007986968452
  - https://adstransparency.google.com/advertiser/AR16905769731288465409?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=241945385881441
  - https://adstransparency.google.com/advertiser/AR05400722414654980097?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=578143355577454
  - https://adstransparency.google.com/advertiser/AR09072498666199056385?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=579879858551764

**Confidence:** low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 29. Flooring & tile contractors  (NAICS 238330)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 6.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** Builder Prime.
- **Rescrape queued (Meta undersampled):** Floorzap.
- **Boring test:** 3/3 — Square-foot quotes, material takeoffs, install scheduling.
- **US establishments:** 13,108 companies verified active (siccode); 77,869 employees (n.d., https://siccode.com/naics-code/238330/flooring-contractors); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Builder Prime | yes | 6 | yes | 8 / 6 / 0 (2026-06-22) | Builder Prime | no | 26 / 21 (2025-02-21) | no 0 | 0 |  |
| Floorzap | yes | 2 | no | 45 / 0 / 0 (2026-07-29) | Floorzap | yes | 12 / 0 (2025-02-06) | yes 10 | 0 | undersampled |
| Projul | yes | 1 | no | 3 / 3 / 0 (2026-06-22) | Projul | yes | 3 / 1 (2023-02-14) | no 0 | 0 |  |
| FieldGroove | yes | 0 | no | 0 / 0 / 0 (-) | FieldGroove | no | 0 / 0 (-) | no 0 | 0 |  |
| FloorSoft | yes | 0 | no | 0 / 0 / 0 (-) | FloorSoft, Inc | no | 0 / 0 (-) | no 0 | 0 |  |
| Measure Square | yes | 0 | no | 0 / 0 / 0 (-) | Measure Square | no | 0 / 0 (-) | no 0 | 0 |  |
| ProjectsForce 360 | yes | 0 | no | 0 / 0 / 0 (-) | ProjectsForce | no | 25 / 0 (2026-02-16) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| WorkQuote | yes | 0 | no | 0 / 0 / 0 (-) | WorkQuote: The All-in-One App for Your Service Business | no | 1 / 0 (2026-05-05) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Flooring & tile contractors (238330)
> - Core jobs: takeoff/measurement from plans, material estimating by sq ft, bids, install scheduling around other trades, crew tracking, job costing (Measure Square, Floorzap, FloorSoft, ProjectsForce, FieldGroove).
> - Wedge: takeoff-to-bid automation for small contract flooring shops and install-day scheduling for retailer-dependent installers; Projul/QuoteIQ show sub-$30-$400/mo price points are accepted.
> - Weakest link: none of the vertical vendors' pricing, age or size was captured; RFMS/QFloors (retail ERPs) were never researched; tile (238340) was not covered.

**The agent version** [hypothesis]: Room measurements → material takeoff and quote → supplier order → install scheduling → invoice. Needs: quoting rules, supplier portals, calendar.

**Wedge** [hypothesis]: Takeoff-and-quote agent for flooring installers.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~3 hrs/week.

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (flooring contractors/installers; retailers for some tools). Public-price incumbents: 2. Gatekeeper: unverified (search budget exhausted before this check). Top-4 share: unverified.

**Evidence URLs (26):**
  - https://siccode.com/naics-code/238330/flooring-contractors
  - https://www.builderprime.com/industries/flooring
  - https://www.fieldgroove.com/flooring-software
  - https://www.floorsoft.com/
  - https://www.floorzap.com/
  - https://measuresquare.com/
  - https://www.projectsforce.com/flooring-business-software
  - https://projul.com/industries/flooring-contractor/
  - https://myquoteiq.com/top-10-best-scheduling-software-for-flooring-contractors-in-2026/
  - https://workquote.app/industries/flooring-service
  - https://projul.com/industries/deck-builders/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1829807557257902
  - https://adstransparency.google.com/advertiser/AR14135757271249977345?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1579516802119215
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=186007324799549
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=375819546395972
  - https://adstransparency.google.com/advertiser/AR00646445921541816321?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=276493002487597
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=456261247848039
  - https://adstransparency.google.com/advertiser/AR14473943863720411137?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=2146347565625894
  - https://adstransparency.google.com/advertiser/AR15154333676306694145?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=211311998732317
  - https://adstransparency.google.com/advertiser/AR10989223771608449025?region=US

**Confidence:** low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 30. Asphalt paving & sealcoating contractors  (NAICS 238990)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5.5 = ad score 1.5 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Seasonal quoting, weather scheduling, municipal bid paperwork.
- **US establishments:** 138,636 (IBISWorld Paving Contractors, businesses); 37,952 (NAICS 238990 establishments, Census 2020) (2026 / 2020, https://www.ibisworld.com/industry-statistics/number-of-businesses/paving-contractors-united-states/ ; https://naicslist.com/naics/238990); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| OneCrew | yes | 2 | no | 0 / 0 / 0 (-) | One Crew | no | 2 / 2 (2024-11-15) | no 0 | 2 |  |
| GoPave | yes | 1 | no | 1 / 1 / 0 (2026-06-24) | Go Pave Utah | yes | 0 / 0 (-) | no 0 | 0 | wrong_page |
| Projul | yes | 1 | no | 3 / 3 / 0 (2026-06-22) | Projul | yes | 3 / 1 (2023-02-14) | no 0 | 0 |  |
| Bitumio | yes | 0 | no | 0 / 0 / 0 (-) | Bitumio | no | 1 / 1 (2023-11-27) | no 0 | 0 |  |
| PavementSoft | yes | 0 | no | 0 / 0 / 0 (-) | Pavement Soft | no | 0 / 0 (-) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| SaaSphalt | yes | 0 | no | 0 / 0 / 0 (-) | SA Asphalt | no | 0 / 0 (-) | no 0 | 0 |  |
| ScopeTakeoff | yes | 0 | no | 0 / 0 / 0 (-) | ScopeTakeoff.com | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Asphalt paving & sealcoating (238990)
> - Core jobs users log in for: satellite/map measurement -> tonnage/material estimate -> proposal, crew scheduling, job costing, invoicing with QuickBooks sync (Bitumio, SaaSphalt, PavementSoft, OneCrew). GoPave is sales-only: missed-call text-back, follow-up, review requests.
> - Wedge: the quoting loop is the whole business for sealcoat/small paving shops. An agent that takes an address, measures from imagery, prices from the shop's rate card, sends the proposal and runs follow-up (GoPave's entire product) replaces the CRM seat; per-seat pricing ($70-$149/user/mo) is a clear price umbrella.
> - Weakest link: OneCrew is VC-funded ($13M) and is content-marketing aggressively, so the category is not unattended; PavementSoft's $59.99 came from review aggregators, not the vendor.

**The agent version** [hypothesis]: Measure driveway/lot from satellite → seal/pave quote with material takeoff → weather-safe schedule → municipal bid paperwork drafted for small public jobs. Needs: measurement API, weather, quoting rules, PDF bid forms.

**Wedge** [hypothesis]: Satellite-measure-to-quote agent for sealcoating/residential paving.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Bitumio: $149 per user per month (mobile-only crew free) - https://bitumio.com/pricing/ (also https://www.contractorsoftwarehub.com/bitumio-review/) (https://bitumio.com/pricing/)
  - SaaSphalt: $70 per user per month - https://www.saasphalt.com/pricing.htm (per getonecrew comparison https://www.getonecrew.com/post/asphalt-bidding-software) (https://www.saasphalt.com/pricing.htm)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (small paving/sealcoating shops; SaaSphalt/Bitumio sell per-user month-to-month). Public-price incumbents: 5. Gatekeeper: unverified (search budget exhausted before this check). Top-4 share: <5% for any single company ('highly fragmented').

**Evidence URLs (30):**
  - https://www.ibisworld.com/industry-statistics/number-of-businesses/paving-contractors-united-states/ ; https://naicslist.com/naics/238990
  - https://bitumio.com/
  - https://bitumio.com/pricing/
  - https://www.capterra.com/p/10009942/Bitumio/ (count not in snippet)
  - https://gopavecrm.com/
  - https://www.getonecrew.com/
  - https://tracxn.com/d/companies/onecrew-software/__isHokKjZ3PfDIUiYIGY9V_NBmtQgdWuXc5M0CQxSYYw ; https://www.zoominfo.com/c/onecrew/1318566236
  - https://www.crunchbase.com/organization/onecrew-software ; https://pitchbook.com/profiles/company/520775-11
  - https://www.pavementsoft.com/
  - https://www.capterra.com/p/229835/PavementSoft/ (count not in snippet)
  - https://projul.com/industries/paving-contractor/
  - https://myquoteiq.com/industries/asphalt-paving-software/
  - https://www.saasphalt.com/sealcoating-software.htm
  - https://www.saasphalt.com/pricing.htm
  - https://scopetakeoff.com/asphalt-estimating-software/
  - https://myquoteiq.com/top-10-best-job-management-software-for-hardscaping-contractors-in-2026/
  - https://projul.com/industries/deck-builders/
  - https://www.ibisworld.com/united-states/industry/paving-contractors/2020/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=108217512153347
  - https://adstransparency.google.com/advertiser/AR12803873138072879105?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=190097907518199
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=393061860869508
  - https://adstransparency.google.com/advertiser/AR10834318766691581953?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1878494522369815
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=2146347565625894
  - https://adstransparency.google.com/advertiser/AR15154333676306694145?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=740100343000139
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1073545742508145

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 31. Concrete flatwork & driveway contractors  (NAICS 238110)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5.5 = ad score 2.5 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Yardage quoting, pour scheduling around weather, permits.
- **US establishments:** 93,960 businesses (IBISWorld Concrete Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/concrete-contractors/200/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Projul | yes | 3 | no | 3 / 3 / 0 (2026-06-22) | Projul | yes | 3 / 1 (2023-02-14) | no 0 | 2 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| ScopeTakeoff | yes | 0 | no | 0 / 0 / 0 (-) | ScopeTakeoff.com | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Concrete flatwork & driveway contractors (238110)
> - Core jobs: aerial measurement of driveways/patios, takeoff for slabs/footings/rebar (ScopeTakeoff), quoting, scheduling pours and crews, job costing (Projul, QuoteIQ).
> - Wedge: a pour-day logistics agent (ready-mix ordering quantities from the takeoff, weather-based rescheduling, crew notifications) sits between estimating tools and the yard; no incumbent covers it.
> - Weakest evidence: only three tools met the landing-page rule (Jobber's concrete page was not captured); ScopeTakeoff price comes from a third-party blog; no headcount for ScopeTakeoff.

**The agent version** [hypothesis]: Yardage/sq ft quote from drawings or photos → pour scheduled around weather and ready-mix availability → permit forms drafted → invoice. Needs: quoting rules, weather API, permit portals.

**Wedge** [hypothesis]: Quote-and-pour-scheduling agent for flatwork.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Projul: $4,788/yr Core (up to 10 employees); Pro $14,388/yr unlimited users (https://projul.com/pricing/)
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 3/5. Check signer: owner-operator (residential flatwork crews under 20 employees). Public-price incumbents: 3. Gatekeeper: not searched (session search budget exhausted). Top-4 share: unverified.

**Evidence URLs (18):**
  - https://www.ibisworld.com/united-states/number-of-businesses/concrete-contractors/200/
  - https://projul.com/industries/concrete-contractor/
  - https://projul.com/pricing/
  - https://softwareconnect.com/reviews/projul/
  - https://projul.com/why-us/
  - https://www.capterra.com/p/185634/Projul/
  - https://myquoteiq.com/top-10-concrete-estimating-software-in-2026/
  - https://myquoteiq.com/pricing/
  - https://tracxn.com/d/companies/quoteiq/__baJVvCxQIOKFcjFDrIKoaTAs0SGEG9HCkMNvWwcyViU
  - https://bootstrappers.com/mike-vida-quoteiq/
  - https://contractortoolstack.com/software/quoteiq/
  - https://scopetakeoff.com/blog/concrete/best-concrete-estimating-software/
  - https://www.buildvisionai.com/best-concrete-estimating-software
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=2146347565625894
  - https://adstransparency.google.com/advertiser/AR15154333676306694145?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1073545742508145

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 32. Window cleaning  (NAICS 561720)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5.0 = ad score 1.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Pane-count quotes, recurring routes, commercial invoicing.
- **US establishments:** 35344 (2024, https://www.ibisworld.com/united-states/number-of-businesses/window-washing/6458/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Fieldified | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| ResponsiBid | yes | 0 | no | 0 / 0 / 0 (-) | ResponsiBid | no | 1 / 0 (2026-05-18) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Window cleaning
> - Core jobs: round/route management for recurring residential customers, bundle-and-upsell quoting (glass + screens + gutters), route-aware customer self-scheduling (ResponsiBid CrewCal), invoicing and card payments, customer texting.
> - Incumbents: ResponsiBid ($179/mo flat), Squeegee (UK, from GBP 15.83/mo), QuoteIQ ($29.99), Fieldified; Jobber called "best overall" by several listicles but no dedicated landing URL surfaced.
> - Agent wedge: recurring-round retention agent - reminds customers when their next clean is due, offers route-adjacent slots, and upsells adjacent services, which is the exact ResponsiBid value prop at $179/mo delivered to solo operators for a fraction of that.
> - Weakest evidence: IBISWorld shows the business count shrinking (-4.9% CAGR), which undercuts the "growing niche" thesis; ResponsiBid and Squeegee founding/headcount unverified.

**The agent version** [hypothesis]: Recurring-round retention: predict next-clean due date per customer → text a route-adjacent slot → confirm → invoice → upsell screens/gutters. Needs: SMS, calendar, invoicing.

**Wedge** [hypothesis]: Recurring-round rebooking agent for solo window cleaners.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - ResponsiBid: $179/mo Follow-up+Quoting; Ultimate $199; Powerhouse Bundle $229 (https://www.selecthub.com/p/pricing-software/responsibid/)
  - Squeegee (Nexdynamic): from GBP 15.83/mo + VAT (pricing page title); Core GBP 19/user/mo per https://softwarefinder.com/field-service/squeegee (https://squeeg.ee/pricing)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (solo glass cleaners to small crews). Public-price incumbents: 3. Gatekeeper: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: no company >5% share.

**Evidence URLs (18):**
  - https://www.ibisworld.com/united-states/number-of-businesses/window-washing/6458/
  - https://fieldified.com/blog/best-window-cleaning-software
  - https://myquoteiq.com/crm-for-window-cleaning-business/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://responsibid.com/
  - https://www.selecthub.com/p/pricing-software/responsibid/
  - https://www.capterra.com/p/175241/ResponsiBid/
  - https://squeeg.ee/professional-window-cleaner-software
  - https://squeeg.ee/pricing
  - https://sourceforge.net/software/product/Squeegee/
  - https://www.ibisworld.com/united-states/industry/window-washing/6458/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Fieldified&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=175247412493060
  - https://adstransparency.google.com/advertiser/AR12811532525050527745?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 33. Pest control operators  (NAICS 561710)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5 = ad score 3 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Recurring service routes, pesticide-use records, state reporting.
- **US establishments:** 33197 (2025, https://www.ibisworld.com/united-states/number-of-businesses/pest-control/1495/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Briostack | yes | 3 | no | 0 / 0 / 0 (-) | Briostack | no | 59 / 28 (2023-04-26) | no 0 | 0 |  |
| GorillaDesk | no (prior knowledge) | 3 | no | 0 / 0 / 0 (-) | GorillaDesk | no | 81 / 34 (2023-05-25) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Pest control operators
> - Core jobs (inferred from vertical tools' positioning; not from snippets this session): route optimization, recurring service agreements, chemical/regulatory application records, technician mobile app, autopay.
> - IBISWorld: 33,197 businesses (2025), 34,076 (2026). Sunair 10-K (FY2007) describes ~20,000 firms, highly fragmented, top five ~30% of revenue.
> - Only Briostack surfaced in a result; PestPac and FieldRoutes are from prior knowledge. Both major incumbents are owned by consolidators (WorkWave, ServiceTitan) and are contact-sales, which leaves a self-serve gap for 1-3 truck operators.
> - Agent wedge: missed-call/lead-response plus recurring-agreement renewal agent for small PCOs; compliance-record drafting from technician voice notes.
> - Weakest link: no tool details verified; concentration source is a 2008 SEC filing.

**The agent version** [hypothesis]: Recurring service routes → state pesticide-use records auto-generated from tech texts → renewals. Needs: SMS, state record templates, route calendar.

**Wedge** [hypothesis]: Pesticide-use recordkeeping agent for small PCOs.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~4 hrs/week.

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (majority of ~33k firms); corporate procurement at Rollins/Rentokil/Anticimex consolidators. Public-price incumbents: 0. Gatekeeper: unverified. Top-4 share: top 5 ~30% of revenues; top 100 ~50% (pest control, dated FY2007 SEC filing).

**Evidence URLs (7):**
  - https://www.ibisworld.com/united-states/number-of-businesses/pest-control/1495/
  - https://www.briostack.com/blog/pest-control-industry-statistics
  - https://www.sec.gov/Archives/edgar/data/0000095366/000095014408000224/g11232ke10vk.htm
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=113149019284976
  - https://adstransparency.google.com/advertiser/AR15449119615661113345?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=387445444655938
  - https://adstransparency.google.com/advertiser/AR10520026520397807617?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 34. Roll-off dumpster rental  (NAICS 562111)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5 = ad score 4 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Container tracking, drop/pickup scheduling, tonnage billing.
- **US establishments:** 351 (2025, https://www.ibisworld.com/united-states/number-of-businesses/dumpster-rental/5837/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| CurbWaste | yes | 4 | no | 0 / 0 / 0 (-) | CurbWaste | no | 65 / 30 (2024-09-25) | yes 8 | 0 |  |
| ServiceCore | no (prior knowledge) | 3 | no | 3 / 0 / 0 (2026-09-09) | ServiceCore | no | 24 / 12 (2023-04-28) | yes 11 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Roll-off dumpster rental
> - IBISWorld counts only 351 businesses (2025) in its narrow definition, which conflicts with the visible long tail of independent haulers; NAICS 562111 is dominated by WM/Republic. Bin There Dump That is a franchisor.
> - CurbWaste surfaced with a dumpster-rental profitability page; Docket, DRS, ServiceCore from prior knowledge.
> - Core jobs (inferred): online ordering, delivery/pickup dispatch, asset (can) tracking, overage/tonnage billing.
> - Agent wedge: inbound ordering + delivery/pickup scheduling agent tied to can inventory; small haulers still take orders by phone.
> - Weakest link: establishment count is contradictory; tool pricing unverified.

**The agent version** [hypothesis]: Drop/pickup scheduling → container tracking → tonnage billing reconciliation from landfill tickets. Needs: SMS, ticket OCR, invoicing.

**Wedge** [hypothesis]: Landfill-ticket reconciliation and billing agent.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~4 hrs/week.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (independent haulers) with municipal/contractor procurement for large accounts; Bin There Dump That franchise. Public-price incumbents: 0. Gatekeeper: possible (franchise). Top-4 share: unverified.

**Evidence URLs (7):**
  - https://www.ibisworld.com/united-states/number-of-businesses/dumpster-rental/5837/
  - https://www.curbwaste.com/dumpster-rental-business-profitability
  - https://bintheredumpthatfranchise.com/blog/dumpster-rental-industry-is-right-for-you/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=101757769190838
  - https://adstransparency.google.com/advertiser/AR11369419739848769537?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=624372454388997
  - https://adstransparency.google.com/advertiser/AR16372434505086009345?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 35. Portable toilet rental  (NAICS 562991)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5 = ad score 4 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Unit tracking, weekly service routes, event orders.
- **US establishments:** 3489 (2025, https://www.ibisworld.com/united-states/number-of-businesses/portable-toilet-rental/4716/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| CurbWaste | yes | 4 | no | 0 / 0 / 0 (-) | CurbWaste | no | 65 / 30 (2024-09-25) | yes 8 | 0 |  |
| ServiceCore | no (prior knowledge) | 3 | no | 3 / 0 / 0 (2026-09-09) | ServiceCore | no | 24 / 12 (2023-04-28) | yes 11 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Portable toilet rental
> - IBISWorld 3,489 businesses (2025), 3.6%/yr growth; combined with septic 5,586.
> - CurbWaste surfaced with a portable-toilet profitability page; ServiceCore/Docket from prior knowledge.
> - Core jobs (inferred): weekly service routing, unit inventory, event quoting, recurring billing.
> - Agent wedge: event/construction quote + weekly service-route confirmation agent; PSAI association influence unverified.
> - Weakest link: no tool details or pricing captured.

**The agent version** [hypothesis]: Weekly service routes → event orders → unit tracking → invoicing. Needs: route calendar, SMS, invoicing.

**Wedge** [hypothesis]: Route and event-order agent for portable toilet operators.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~3 hrs/week.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (3,489 businesses; construction/event customers). Public-price incumbents: 0. Gatekeeper: unverified. Top-4 share: unverified.

**Evidence URLs (6):**
  - https://www.ibisworld.com/united-states/number-of-businesses/portable-toilet-rental/4716/
  - https://www.curbwaste.com/how-profitable-is-a-portable-toilet-business
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=101757769190838
  - https://adstransparency.google.com/advertiser/AR11369419739848769537?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=624372454388997
  - https://adstransparency.google.com/advertiser/AR16372434505086009345?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 36. Notaries & loan signing agents  (NAICS 541120)

- **Status:** audited, not passing. Research: searched (follow-up batch 17, 2026-09-17).
- **Method score:** 5 = ad score 2 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Signing appointments, journals, invoicing signing services.
- **US establishments:** 2,896 companies (NAICS 54112); ~4.4 million commissioned notaries (NNA) (unverified, https://www.naics.com/naics-code-description/?code=541120); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Notaries & loan signing agents (NAICS 541120) — 8 searches
> - Incumbents' jobs: order intake from Snapdocs/SigningOrder emails, calendar, invoicing to title/escrow, mileage and IRS notarial-act deduction accounting (NotaryGadget $11.95, NotaryAssist $8.99, CloseWise free/$15/$40). Snapdocs ($267M raised, 384 staff, 140k notaries) is the order-flow gatekeeper.
> - Wedge: receivables chasing (signing agents invoice dozens of title companies at $75-200 each and wait 30-60 days) and review/ranking hygiene on Snapdocs; NotaryGadget proves a 1-person vendor can reach $3M revenue here.
> - Weakest evidence: NotaryAssist/SigningOrder/NotaryDash domains not confirmed by any result; no count of active signing agents (only 4.4M notaries).
> - Searches: NAICS 541120 count; signing agent business software; best notary software pricing; how orders flow via Snapdocs; NNA notary count; CloseWise pricing/company; NotaryGadget company; Snapdocs funding/network.

**The agent version** [hypothesis]: Signing order intake → appointment confirmation → journal entry → invoice to signing service. Needs: email/SMS, calendar, invoicing.

**Wedge** [hypothesis]: Signing-order intake and invoicing agent for loan signing agents.

**Price ceiling:** incumbent public prices found [search-cited]:
  - CloseWise: Free tier; Pro $15/month; Pro+ $40/month (https://www.closewise.com/pricing/)
  - NotaryAssist: $8.99/month (marketing add-on $59.99/month) (https://frontdeskreview.com/best/notary-software/)
  - NotaryGadget: ~$11.95/month (per competitor comparison page) (https://www.closewise.com/notarygadget-vs-notaryassist-vs-closewise-a-fair-notary-software-comparison/)
  - QuoteIQ: $29.99/month (Essentials) (https://myquoteiq.com/crm-for-backflow-testing-companies/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 3/5. Check signer: solo notary / signing agent (1099). Public-price incumbents: 3. Gatekeeper: yes: signing-order platforms (Snapdocs, SigningOrder) control order flow and ranking; title/escrow assign via ranked lists. Top-4 share: unverified.

**Evidence URLs (18):**
  - https://www.naics.com/naics-code-description/?code=541120
  - https://www.closewise.com/notary-signing-agents/
  - https://www.closewise.com/pricing/
  - https://www.linkedin.com/company/closewise
  - https://frontdeskreview.com/best/notary-software/
  - https://www.notarycentral.org/notary-app-comparison
  - https://www.closewise.com/best-notary-apps-for-signing-agents-2026/
  - https://www.notarygadget.com/
  - https://www.closewise.com/notarygadget-vs-notaryassist-vs-closewise-a-fair-notary-software-comparison/
  - https://tracxn.com/d/companies/notarygadget/__Etswun0IlLhU1bwbICl6utUmxW8z_tqQy_byhcMhgyc
  - https://myquoteiq.com/top-8-softwares-for-mobile-notary-businesses-in-2026/
  - https://myquoteiq.com/crm-for-backflow-testing-companies/
  - https://www.closewise.com/top-5-notary-signing-agent-platforms/
  - https://www.snapdocs.com/notaries
  - https://pitchbook.com/profiles/company/63692-65
  - https://support.snapdocs.com/how-to-get-started
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 37. CDL truck driving schools  (NAICS 611519)

- **Status:** not audited. Research: searched (follow-up batch 17, 2026-09-17).
- **Method score:** 5 = ad score 0 (mean of best two verified tools) + fragmentation 5/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — ELDT registry reporting, DOT physicals, student tracking.
- **US establishments:** 395 truck driving schools (IBISWorld); 4,462+ FMCSA TPR-registered ELDT providers (2024, https://www.ibisworld.com/united-states/number-of-businesses/truck-driving-schools/5118/); share <20 employees: schools with fewer than 10 employees estimated at over half of establishments.

**Ad audit (Step 3):** no tools audited for this niche (no search-verified tools; see dead_ends.md).

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> CDL truck driving schools (NAICS 611519) — 8 searches
> - Incumbents' jobs: enrollment/lead intake, tuition financing, range/BTW scheduling, ELDT curriculum delivery, FMCSA Training Provider Registry uploads, placement tracking (CDL PowerSuite $299/mo for 20 seats, Lumion $10.7M seed, CDL Tracks, BoltCDL from $15/mo, Truck School Software $29/user).
> - Wedge: 4,462+ TPR-registered providers vs 395 IBISWorld "schools" means most trainers are tiny carriers/community programs; agent wedge = lead-to-enrollment follow-up and funding-paperwork (WIOA/VA/tuition financing) chasing, plus TPR upload QA.
> - Weakest evidence: CDL Tracks pricing/headcount not found; CDL PowerSuite headcount unknown; the 4,462 TPR count comes from a directory site, not FMCSA.
> - Searches: TPR provider count; school management software; best school software pricing; CDL PowerSuite pricing; CDL Tracks pricing; Lumion funding; Truck School Software capterra; IBISWorld truck driving schools; BoltCDL pricing.

**The agent version** [hypothesis]: Student enrollment → ELDT Training Provider Registry certification submission → DOT physical/permit tracking → attendance hours. Needs: TPR portal, document intake, SMS.

**Wedge** [hypothesis]: ELDT registry reporting agent for CDL schools.

**Price ceiling:** incumbent public prices found [search-cited]:
  - BoltCDL: from $15/month, usage-based; free trial (https://www.capterra.com/p/255250/BOLT/pricing/)
  - CDL PowerSuite: $299/month incl. 20 student seats (plans $100-$300/month) (https://www.cdlpowersuite.com/pricing)
  - Truck School Software: $29/user/month; free trial and free version (https://www.capterra.com/p/237587/Truck-School/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 5/5. Check signer: school owner/director (many <10 employees). Public-price incumbents: 3. Gatekeeper: regulator only: FMCSA Training Provider Registry (free registry; schools must upload ELDT completions) - no vendor mandate found. Top-4 share: no company >5% share.

**Evidence URLs (13):**
  - https://www.ibisworld.com/united-states/number-of-businesses/truck-driving-schools/5118/
  - https://www.ibisworld.com/united-states/industry/truck-driving-schools/5118/
  - https://boltcdl.com/
  - https://www.capterra.com/p/255250/BOLT/pricing/
  - https://www.cdlpowersuite.com/schools
  - https://www.cdlpowersuite.com/pricing
  - https://www.cdltracks.com/
  - https://www.lumion.ai/cdl
  - https://pitchbook.com/profiles/company/495414-82
  - https://www.prnewswire.com/news-releases/lumion-closes-10-7m-to-power-the-ultimate-operating-system-for-trade-schools-tackling-the-skilled-labor-gap-302481551.html
  - https://www.truckschoolsoftware.com/
  - https://www.capterra.com/p/237587/Truck-School/
  - https://tpr.fmcsa.dot.gov/provider

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 38. Excavation & grading contractors  (NAICS 238910)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 4.5 = ad score 2.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — 811 locates, equipment hours, dirt hauling tickets.
- **US establishments:** 235,812 businesses (IBISWorld Excavation Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/excavation-contractors/206/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| HCSS HeavyBid | yes | 3 | no | 14 / 0 / 0 (2026-08-05) | HCSS | no | 200 / 27 (2023-02-02) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| EarthWorks Excavation Software (Tally Systems) | yes | 0 | no | 0 / 0 / 0 (-) | Earthworks | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Excavation & grading contractors (238910)
> - Core jobs: cut/fill volume takeoff from plans (EarthWorks, AGTEK), heavy-civil bid assembly (HCSS HeavyBid), aerial measurement and quoting for small residential jobs (QuoteIQ), job costing (Knowify).
> - Wedge: small residential/site-prep excavators are served only by generic FSM or heavy-civil takeoff tools; an agent that turns a site plan or drone/satellite image into a cut/fill estimate and haul-truck count at EarthWorks' $100/mo price point is the gap.
> - Weakest evidence: EarthWorks price is from an ITQlick comparison; HCSS, AGTEK, Knowify have no verified pricing/headcount in results; NAICS 238910 count is shared with septic.

**The agent version** [hypothesis]: Site quote from plans → 811 locate tickets → equipment-hour tracking → haul tickets reconciled → invoice. Needs: 811 portal, SMS from operators, invoicing.

**Wedge** [hypothesis]: 811-locate and haul-ticket reconciliation agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator for residential/site-prep excavators; estimator/PM for heavy-civil (HCSS buyers). Public-price incumbents: 2. Gatekeeper: not searched (session search budget exhausted). Top-4 share: unverified.

**Evidence URLs (15):**
  - https://www.ibisworld.com/united-states/number-of-businesses/excavation-contractors/206/
  - https://earthworksos.com/
  - https://www.softwareadvice.com/construction/tally-systems-earthworks-software-profile/
  - https://www.hcss.com/who-uses-hcss/earthwork-estimating-software/
  - https://myquoteiq.com/top-10-excavation-estimating-software-in-2026/
  - https://myquoteiq.com/pricing/
  - https://tracxn.com/d/companies/quoteiq/__baJVvCxQIOKFcjFDrIKoaTAs0SGEG9HCkMNvWwcyViU
  - https://bootstrappers.com/mike-vida-quoteiq/
  - https://contractortoolstack.com/software/quoteiq/
  - https://www.itqlick.com/compare/estimating-link/earthworks-excavation-software
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=98990738837
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=152901951409117
  - https://adstransparency.google.com/advertiser/AR04263920076928843777?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 39. Insulation & spray foam contractors  (NAICS 238310)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 4.0 = ad score 2.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — R-value quoting, utility rebate forms, energy-code compliance.
- **US establishments:** 19,339 businesses (NAICS 238310 Drywall and Insulation Contractors, Census) (2020, https://naicslist.com/naics/238310); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| FieldGroove | yes | 2 | no | 0 / 0 / 0 (-) | FieldGroove | no | 0 / 0 (-) | no 0 | 2 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Allpro Insulator | yes | 0 | no | 0 / 0 / 0 (-) | Allpro | no | 0 / 0 (-) | no 0 | 0 | ambiguous_page |
| FieldCamp | yes | 0 | no | 0 / 0 / 0 (-) | Field Camp | no | 3 / 0 (2025-08-13) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Insulation & spray foam contractors (238310)
> - Core jobs: board-feet / coverage / A-B chemical cost estimating, Good/Better/Best R-value proposals, on-site quoting, crew dispatch by certification, asset tracking, QuickBooks (FieldGroove, Allpro Insulator, FieldCamp, QuoteIQ).
> - Wedge: an attic-measurement-to-tiered-estimate agent (satellite footprint plus R-value tiers) with chemical usage forecasting; the two vertical incumbents are quote-gated and FieldGroove is listed at $495/user/mo, leaving room below.
> - Weakest evidence: FieldGroove price is a competitor blog quoting Capterra; Allpro has no price or headcount; NAICS 238310 mixes drywall.

**The agent version** [hypothesis]: R-value/sq ft quote → utility rebate forms completed and submitted → energy-code compliance certificate → invoice. Needs: rebate program forms, quoting rules, PDF.

**Wedge** [hypothesis]: Utility-rebate paperwork agent for insulation contractors.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (residential/light-commercial spray foam & batt installers). Public-price incumbents: 2. Gatekeeper: not searched (session search budget exhausted). Top-4 share: unverified.

**Evidence URLs (19):**
  - https://naicslist.com/naics/238310
  - https://www.allprotechnology.com/software/
  - https://www.zoominfo.com/c/allpro-insulation-software/537057220
  - https://www.linkedin.com/company/allpro-technology
  - https://fieldcamp.ai/blog/best-insulation-contractor-software/
  - https://www.fieldgroove.com/insulation-software
  - https://www.linkedin.com/company/fieldgroove
  - https://www.softwareadvice.com/construction/fieldgroove-profile/
  - https://myquoteiq.com/top-8-softwares-for-spray-foam-insulation-businesses-in-2026/
  - https://myquoteiq.com/pricing/
  - https://tracxn.com/d/companies/quoteiq/__baJVvCxQIOKFcjFDrIKoaTAs0SGEG9HCkMNvWwcyViU
  - https://bootstrappers.com/mike-vida-quoteiq/
  - https://contractortoolstack.com/software/quoteiq/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=112851041743605
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=999258960132475
  - https://adstransparency.google.com/advertiser/AR02331392549886885889?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1579516802119215
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 40. Small fleet trucking companies (1-20 trucks)  (NAICS 484121)

- **Status:** not audited. Research: searched (follow-up batch 17, 2026-09-17).
- **Method score:** 4 = ad score 0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — IFTA, ELD logs, driver files, load paperwork.
- **US establishments:** over 800,000 active motor carriers with MC numbers (2025); NAICS 484121 establishment count unverified (2025, https://www.truckingdive.com/news/fmcsa-grants-reinstatements-revocations-operating-authority-2025-data/808968/); share <20 employees: 97% of carriers operate fewer than 20 trucks (trucks, not employees).

**Ad audit (Step 3):** no tools audited for this niche (no search-verified tools; see dead_ends.md).

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

**Evidence URLs (14):**
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

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 41. Non-emergency medical transportation providers  (NAICS 485991)

- **Status:** not audited. Research: searched (follow-up batch 17, 2026-09-17).
- **Method score:** 4 = ad score 0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Trip scheduling, Medicaid broker billing, driver credentialing.
- **US establishments:** over 10,000 NEMT companies (unverified, https://elitemedfinancials.com/nemt-industry-statistics/); share <20 employees: unverified.

**Ad audit (Step 3):** no tools audited for this niche (no search-verified tools; see dead_ends.md).

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Non-emergency medical transportation providers (NAICS 485991) — 7 searches
> - Incumbents' jobs: trip import from broker portals (ModivCare WellRyde, MTM spreadsheets), scheduling/routing, driver app with EVV timestamps, claims to brokers (Bambi $69/veh, RouteGenie $50/veh, Tobi $60/veh+$0.10/trip, MediRoutes $0.50/trip, NEMT Cloud Dispatch $49.99/mo, RoutingBox, ZeitRide $49/veh, TripMaster).
> - Wedge: broker claim denials/rework and credential expirations (MTM blocks trip assignment when credentials lapse). An agent that reconciles trips vs broker remittances and keeps driver/vehicle credentials current is a clean add-on to any dispatch tool.
> - Weakest evidence: "over 10,000 NEMT companies" is a vendor blog figure with no year; Tobi/TripMaster domains unconfirmed; RouteGenie seed amount undisclosed.
> - Searches: NEMT provider count; dispatch software; best NEMT pricing; broker portal requirements; Bambi funding; RouteGenie company; IBISWorld/industry count.

**The agent version** [hypothesis]: Trip scheduling from broker portals → driver credential expirations → trip logs and Medicaid broker billing submitted. Needs: broker portals, SMS, billing templates.

**Wedge** [hypothesis]: Broker trip-intake and billing agent for NEMT providers.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Bambi: $69/vehicle/month, $0 setup, no long-term contract (https://nextbillion.ai/feeds/blog/nemt-scheduling-software-transparent-pricing)
  - MediRoutes: $0.50 per managed trip; can exceed $200/vehicle/month all-in (https://nextbillion.ai/feeds/blog/nemt-scheduling-software-transparent-pricing)
  - NEMT Cloud Dispatch: from $49.99/month (https://nemtclouddispatch.com/)
  - RouteGenie: Growth from ~$50/vehicle/month, $0 setup (https://nextbillion.ai/feeds/blog/nemt-scheduling-software-transparent-pricing)
  - Tobi Cloud: from $60/vehicle/month + $0.10/trip (https://nextbillion.ai/feeds/blog/nemt-scheduling-software-transparent-pricing)
  - TripMaster (CTS Software): custom quote; third parties cite ~$125/month start (https://nextbillion.ai/feeds/blog/nemt-scheduling-software-transparent-pricing)
  - ZeitRide: flat $49/vehicle (https://zeitride.com/blog/best-nemt-routing-software-2026)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~8 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (8 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner of small van fleet (often 1-10 vehicles). Public-price incumbents: 4. Gatekeeper: yes: Medicaid brokers (ModivCare WellRyde portal, MTM) assign trips and require credentialing; ModivCare offers WellRyde at little/no cost. Top-4 share: highly fragmented, no company >5%.

**Evidence URLs (13):**
  - https://elitemedfinancials.com/nemt-industry-statistics/
  - https://www.hibambi.com/
  - https://nextbillion.ai/feeds/blog/nemt-scheduling-software-transparent-pricing
  - https://builtin.com/company/bambi-nemt
  - https://www.crunchbase.com/organization/bambi-0659
  - https://mediroutes.com/
  - https://nemtclouddispatch.com/
  - https://routegenie.com/nemt-management-software/
  - https://pitchbook.com/profiles/company/521432-38
  - https://tracxn.com/d/companies/routegenie/__DJwezFIbuqx6ic7KzOtU7NgHWXNUxSszyAcIoo-lfSU
  - https://routingbox.com/
  - https://zeitride.com/blog/best-nemt-routing-software-2026
  - https://www.hibambi.com/blog/what-to-know-about-modivcare-nemt-broker

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 42. Home health & non-medical home care agencies  (NAICS 621610)

- **Status:** not audited. Research: searched (follow-up batch 17, 2026-09-17).
- **Method score:** 4 = ad score 0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Caregiver scheduling, EVV, timesheets, Medicaid billing.
- **US establishments:** 36,083 active companies (alt 68,232 establishments Apr 2024) (2022, https://www.naics.com/naics-code-description/?code=621610); share <20 employees: unverified.

**Ad audit (Step 3):** no tools audited for this niche (no search-verified tools; see dead_ends.md).

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Home health & non-medical home care agencies (NAICS 621610) — 8 searches
> - Incumbents' jobs: caregiver scheduling/matching, EVV capture and aggregator submission, Medicaid/private-pay billing, caregiver recruiting/retention (AxisCare $79+, CareTime $49+, ShiftCare $8-9/user, CareSmartz360, BridgeCare OS $249+$14/caregiver, AlayaCare, Alora, WellSky, HHAeXchange).
> - Wedge: EVV rejections and open-shift filling are daily fires; agent wedge = open-shift broadcast/fill and EVV exception clean-up before claims, or caregiver hiring pipeline (screening, license/CPR expiry tracking). Gatekeepers are heavy: state closed-model EVV vendors (Sandata ~25 states, HHAeXchange ~10) and franchisor platforms (Home Instead -> Honor).
> - Weakest evidence: two conflicting establishment counts (36,083 vs 68,232) with ambiguous attribution; AxisCare/CareTime prices come from itqlick, not vendor pages; BridgeCare OS funding/headcount unknown.
> - Searches: NAICS 621610 count; non-medical scheduling software; best home care software pricing; state EVV vendor mandates; AxisCare crunchbase; ShiftCare/CareSmartz pricing; BridgeCare OS; IBISWorld fragmentation + Home Instead software.

**The agent version** [hypothesis]: Caregiver shift filling by text → EVV-compliant visit verification checks → timesheet-to-Medicaid billing. Needs: SMS, state EVV aggregator APIs, billing templates.

**Wedge** [hypothesis]: Open-shift filling and EVV exception agent for small home care agencies.

**Price ceiling:** incumbent public prices found [search-cited]:
  - AxisCare: $79/month (1 user); $495/month (10 users); $2,295/month (100 users) per third-party listing (https://www.itqlick.com/compare/axiscare-software/caretime)
  - BridgeCare OS: $249-$499/month flat + $12-$14 per caregiver; no setup fees; 14-day trial (https://bridgecareos.com/pricing/)
  - CareSmartz360: quote-based; ~$10 per client/month cited by SelectHub (https://www.selecthub.com/p/home-care-software/caresmartz360/)
  - CareTime: $49/month (1 user); $399/month (10 users); $1,999/month (100 users) per third-party listing (https://www.itqlick.com/compare/axiscare-software/caretime)
  - ShiftCare: $8/user/month annual; $9/user/month monthly (https://shiftcare.com/pricing)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~8 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (8 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: agency owner (often franchisee or solo founder). Public-price incumbents: 3. Gatekeeper: yes: state Medicaid EVV mandates; closed-model states require the state vendor (Sandata ~25 states; HHAeXchange ~10); franchisors (Home Instead) supply Honor Care Platform. Top-4 share: no company >5% share.

**Evidence URLs (15):**
  - https://www.naics.com/naics-code-description/?code=621610
  - https://www.alorahealth.com/top-8-best-home-care-software-in-2026/
  - https://www.alorahealth.com/blog-what-is-the-best-non-medical-home-care-software/
  - https://axiscare.com/
  - https://www.itqlick.com/compare/axiscare-software/caretime
  - https://www.crunchbase.com/organization/axiscare
  - https://bridgecareos.com/
  - https://bridgecareos.com/pricing/
  - https://www.caresmartz360.com/features/home-care-scheduling-software/
  - https://www.selecthub.com/p/home-care-software/caresmartz360/
  - https://www.hhaexchange.com/blog/everything-homecare-agencies-need-to-know-about-evv
  - https://shiftcare.com/us/compare/caresmartz360
  - https://shiftcare.com/pricing
  - https://www.aveecare.com/resources/evv-vendors-by-state
  - https://www.ibisworld.com/united-states/industry/home-care-providers/1579/

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 43. Mold, asbestos & lead abatement contractors  (NAICS 562910)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 3.5 = ad score 2.5 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Notifications to state, air-clearance reports, disposal manifests.
- **US establishments:** 5576 (2020, https://siccode.com/naics-code/562910/remediation-services); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| DocuSketch | yes | 4 | no | 0 / 0 / 0 (-) | DocuSketch | no | 60 / 38 (2024-07-18) | yes 9 | 0 |  |
| Vev | yes | 1 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | yes 4 | 0 |  |
| Cinderblock | yes | 0 | no | 0 / 0 / 0 (-) | Cinderblock | no | 0 / 0 (-) | no 0 | 0 |  |
| Deelo | yes | 0 | no | 0 / 0 / 0 (-) | Deelo | no | 2 / 0 (2026-03-12) | no 0 | 0 |  |
| FieldFlo | yes | 0 | no | 0 / 0 / 0 (-) | Fieldflo | no | 3 / 2 (2025-01-02) | no 0 | 0 |  |
| OctopusPro | yes | 0 | no | 0 / 0 / 0 (-) | Octopus Pro | no | 0 / 0 (-) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| Xcelerate (XL Restoration Software) | yes | 0 | no | 0 / 0 / 0 (-) | Xcelerate | no | 4 / 1 (2025-04-11) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Mold, asbestos & lead abatement contractors (562910)
> - Establishments: 5,576 locations / 4,546 firms / 85,937 employees for all of NAICS 562910 (2020 Census via siccode.com); abatement-only share not found.
> - Core jobs users log in for (from vendor snippets): estimates and quoting, scheduling with SMS crew deployment and timesheets (FieldFlo), photo/GPS job documentation and containment/clearance tracking (Xcelerate, DocuSketch, QuoteIQ), invoicing, compliance and safety records, routing and payments (Vev), CRM/pipeline (Deelo).
> - Only public price seen: QuoteIQ flat tiers from $29.99/mo to $699/mo, no per-user fees (vendor co-founder blog, mikevidan.com).
> - Agent wedge: the compliance paperwork stack (abatement notifications, air-clearance documentation, waste manifests, worker cert tracking) that FieldFlo sells as its differentiator is document-assembly work an agent can do from photos and job data; second wedge is quote follow-up automation, which QuoteIQ already markets as a feature.
> - Weakest evidence: no headcount, funding, review counts, ad-library presence, gatekeeper, or concentration data retrieved for any tool; the QuoteIQ price is from an affiliated blog rather than a pricing page.

**The agent version** [hypothesis]: State notification filings before abatement → air-clearance report assembly → disposal manifest tracking → invoice. Needs: state portals/forms, lab-report intake, PDF.

**Wedge** [hypothesis]: State abatement notification and clearance-report agent.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~6 hrs/week.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (inferred from vendor copy 'built by contractors for contractors' at https://fieldflo.com/; not independently verified). Public-price incumbents: 1. Gatekeeper: unverified (not searched). Top-4 share: unverified.

**Evidence URLs (23):**
  - https://siccode.com/naics-code/562910/remediation-services
  - https://cinderblock.com/industries/mold-remediation-contractor-software/
  - https://www.deelo.ai/software/crm/asbestos-abatement
  - https://www.docusketch.com/solutions/mold-remediation-software
  - https://fieldflo.com/asbestos-abatement
  - https://octopuspro.com/field-service-management/asbestos-removal-software/
  - https://myquoteiq.com/industries/mold-remediation-software/
  - https://vev.co/field-service-software/asbestos-removal
  - https://www.xlrestorationsoftware.com/mold-remediation-software
  - https://mikevidan.com/4-best-mold-remediation-software-2026/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=420880658066336
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1223424464197303
  - https://adstransparency.google.com/advertiser/AR07129259928807538689?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1930790116972490
  - https://adstransparency.google.com/advertiser/AR16182366499837575169?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=351716288622497
  - https://adstransparency.google.com/advertiser/AR14355687015876395009?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=200971729759285
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Vev&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=100627044990654
  - https://adstransparency.google.com/advertiser/AR14484952045288685569?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 44. Fence contractors  (NAICS 238990)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 3.0 = ad score 1.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Linear-foot quoting, HOA/permit paperwork, install crews.
- **US establishments:** 315,213 businesses (IBISWorld Fence Construction in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/fence-construction/2022); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ProDBX | no (prior knowledge) | 3 | no | 2 / 2 / 1 (2026-02-20) | Prodbx | no | 20 / 15 (2024-08-01) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| FenceCloud | yes | 0 | no | 0 / 0 / 0 (-) | Fence Cloud | no | 0 / 0 (-) | no 0 | 0 |  |
| Visual Fence Pro | yes | 0 | no | 0 / 0 / 0 (-) | Visual Fence Pro | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Fence contractors (238990)
> - Core jobs: per-linear-foot estimating with material-kit takeoffs and satellite property measurement, quote portal/e-sign, scheduling, invoicing, material inventory (QuoteIQ, FenceCloud, Visual Fence Pro).
> - Wedge: an estimate-and-material-list agent from a parcel address plus a photo of the yard, priced per linear foot, feeding a supplier order. FenceCloud's distributor tie (Merchants Metals) suggests distributors could be a channel.
> - Weakest evidence: FenceCloud price is $220 in one roundup and $99 in another; ProDBX and Visual Fence Pro have no verified data; IBISWorld's 315k businesses is mostly non-employers.

**The agent version** [hypothesis]: Linear-foot quote from a property-line sketch → HOA/permit application drafted → material order list → install date → invoice. Needs: measurement, permit templates, supplier ordering, calendar.

**Wedge** [hypothesis]: HOA/permit paperwork and quote agent for fence installers.

**Price ceiling:** incumbent public prices found [search-cited]:
  - FenceCloud: $220+/mo (one roundup says from ~$99/mo) (https://fence.cloud/pricing)
  - QuoteIQ: $29.99/mo (5 tiers to $399.99/mo per Feb-2026 update; older pages cite Max tier $699/mo) (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (solo to 15-crew shops per QuoteIQ positioning). Public-price incumbents: 2. Gatekeeper: partial: fence distributor Merchants Metals co-markets FenceCloud as 'CFS e-Pricing' (channel influence, not a mandate). Top-4 share: unverified.

**Evidence URLs (17):**
  - https://www.ibisworld.com/united-states/number-of-businesses/fence-construction/2022
  - https://fence.cloud/
  - https://fence.cloud/pricing
  - https://myquoteiq.com/crm-for-fence-contractors/
  - https://myquoteiq.com/pricing/
  - https://tracxn.com/d/companies/quoteiq/__baJVvCxQIOKFcjFDrIKoaTAs0SGEG9HCkMNvWwcyViU
  - https://bootstrappers.com/mike-vida-quoteiq/
  - https://contractortoolstack.com/software/quoteiq/
  - https://visualfencepro.com/resources/fence-contractor-crm.html
  - https://www.capterra.com/p/10038635/Visual-Fence-Pro/
  - https://www.merchantsmetals.com/cfs-epricing/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=311116592944735
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=578143355577454
  - https://adstransparency.google.com/advertiser/AR09072498666199056385?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1025823777284683

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 45. Christmas & holiday light installers  (NAICS 561730)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 3.0 = ad score 1.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Seasonal quoting, install/takedown scheduling, storage.
- **US establishments:** 16041 (2024, https://homeservicebase.com/christmas-light-business); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| JingleCRM | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| Strandr | yes | 0 | no | 0 / 0 / 0 (-) | Strandr | no | 3 / 0 (2025-08-05) | no 0 | 0 |  |
| Tinsel CRM | yes | 0 | no | 0 / 0 / 0 (-) | Tinsel CRM | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Christmas & holiday light installers
> - Core jobs: photo mockups of lights on the customer's home (Strandr, Jolly Lights), roofline measurement and same-day branded estimates, install-window scheduling and crew routing, inventory of strands/clips, storage and takedown tracking, next-season re-booking (JingleCRM, Tinsel CRM).
> - Incumbents: JingleCRM, Tinsel CRM (both pricing unverified), Strandr ($197/yr design tool), Jolly Lights, QuoteIQ ($29.99), Jobber ($39/mo, no dedicated landing).
> - Agent wedge: an end-to-end seasonal agent - generates the mockup and quote from a home photo, books install and takedown, tracks each customer's inventory in storage, and auto-renews next August. Installers currently stitch 2-3 tools; one agent collapses the stack for a business that only runs 3-4 months.
> - Weakest evidence: there is no NAICS category, so the 16,041-company count comes from a single web-census site; vertical CRMs' pricing, founding, and headcount all unverified; CLIPA's software endorsements unverified.

**The agent version** [hypothesis]: Roofline measurement → install/takedown quote → season schedule → storage tracking → next-season renewal outreach in August. Needs: measurement, SMS, calendar, inventory list.

**Wedge** [hypothesis]: Season-renewal and install/takedown scheduling agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - Strandr: $197/year (https://www.grantsoutdoor.com/christmas-light-society/2026/1/30/top-5-christmas-light-software-tools-installers-actually-use)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (seasonal add-on for landscapers/pressure washers). Public-price incumbents: 2. Gatekeeper: association present (CLIPA, 8,000+ members) - endorsed software unverified. Top-4 share: unverified.

**Evidence URLs (15):**
  - https://homeservicebase.com/christmas-light-business
  - https://jinglecrm.com/
  - https://myquoteiq.com/best-crm-for-christmas-lighting/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://www.strandr.com/blog/christmas-light-installation-pricing-2025-market-analysis
  - https://www.grantsoutdoor.com/christmas-light-society/2026/1/30/top-5-christmas-light-software-tools-installers-actually-use
  - https://www.tinselcrm.com/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=JingleCRM&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=686751911194607
  - https://adstransparency.google.com/advertiser/AR17983789119376982017?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=104076738912811

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 46. DOT / trucking compliance consultants  (NAICS 541618)

- **Status:** not audited. Research: searched (follow-up batch 17, 2026-09-17).
- **Method score:** 3 = ad score 0 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Driver qualification files, drug-testing programs, audits.
- **US establishments:** 11,419 (all of NAICS 541618; DOT-consultant subset unverified) (2020, https://www.item.com/naics/541618); share <20 employees: unverified.

**Ad audit (Step 3):** no tools audited for this niche (no search-verified tools; see dead_ends.md).

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> DOT / trucking compliance consultants (NAICS 541618) — 8 searches (+2 in extra pass)
> - Incumbents' jobs: driver qualification file tracking, med-card/MVR/annual-review expirations, drug & alcohol consortium/Clearinghouse queries, audit binders, multi-client dashboards (Safety Compliance Tracker's explicit consultant page, DQM Connect, CarrierLens, FileFlo, DOTDriverFiles $5/driver, Avatar DriverHub, J.J. Keller services).
> - Wedge: consultants resell compliance labor; an agent that monitors each client carrier's DQF gaps, drafts the corrective-action packet, and chases drivers for documents lets a solo consultant serve 3x the carriers. Per-driver pricing (DOTDriverFiles) shows the unit economics.
> - Weakest evidence: no count of DOT-specific consultants; Safety Compliance Tracker and CarrierLens pricing/headcount not found; FileFlo bootstrapped status unverified.
> - Searches: NAICS 541618 count; consultant multi-client DQF software; best DQ software 2026; consultant population; SCT pricing; DQM Connect; CarrierLens pricing; FileFlo; SCT founder; DOTDriverFiles pricing.

**The agent version** [hypothesis]: Driver qualification file completeness checks → drug-testing program enrollment and random-pool tracking → audit-ready file packs. Needs: document intake, FMCSA Clearinghouse, email.

**Wedge** [hypothesis]: DQ-file compliance agent for small carriers (sold via consultants).

**Price ceiling:** incumbent public prices found [search-cited]:
  - DOTDriverFiles: Free plan (pay per MVR/PSP report); Pro $5/driver/month; Pro+ $5/driver + $2/vehicle (https://dotdriverfiles.com/pricing/)
  - DQM Connect: contact for quote (https://marketplace.geotab.com/solutions/dqmconnect/)
  - Driver File Hub: pricing page exists; figures not surfaced (https://driverfilehub.com/pricing/)
  - FileFlo: $89/month Starter; $299/month Professional flat (https://www.g2.com/products/fileflo/pricing)
  - FleetDrive 360: pricing page exists; figures not surfaced (https://www.fleetdrive360.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~6 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (6 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 3/5. Check signer: solo or small consultancy owner (often ex-safety director). Public-price incumbents: 2. Gatekeeper: none: FMCSA sets rules (DQF, Clearinghouse, drug consortium) but mandates no software vendor. Top-4 share: unverified.

**Evidence URLs (13):**
  - https://www.item.com/naics/541618
  - https://www.avatarfleet.com/dot-compliance-software
  - https://www.carrierlens.com/
  - https://dotdriverfiles.com/
  - https://dotdriverfiles.com/pricing/
  - https://dqmconnect.com/
  - https://marketplace.geotab.com/solutions/dqmconnect/
  - https://tracxn.com/d/companies/dqm-connect/__hE5Htz3GK7Ho3wwvz4jeoGo-CJjraNviLa-XYXcYKTE
  - https://driverfilehub.com/pricing/
  - https://www.getfileflo.com/blog/best-dot-compliance-software-2026
  - https://www.g2.com/products/fileflo/pricing
  - https://www.fleetdrive360.com/pricing/
  - https://safetycompliancetracker.com/dot-consultant-software/

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 47. Hardscape & retaining wall contractors  (NAICS 238140)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 2.5 = ad score 0.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Design/quote, material tonnage, weather scheduling.
- **US establishments:** unverified (search budget exhausted before this check) — unverified; share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Projul | yes | 1 | no | 3 / 3 / 0 (2026-06-22) | Projul | yes | 3 / 1 (2023-02-14) | no 0 | 0 |  |
| Eano | yes | 0 | no | 0 / 0 / 0 (-) | Eano | no | 16 / 0 (2025-02-27) | no 0 | 0 |  |
| Outdoor Estimates | yes | 0 | no | 0 / 0 / 0 (-) | Outdoor Estimates | no | 0 / 0 (-) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| ScapeCubed | yes | 0 | no | 0 / 0 / 0 (-) | Scape Cubed | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Hardscape & retaining wall contractors (238140)
> - Core jobs: line-item estimating for pavers/base/sand/edging/drainage/labor, aerial takeoff, proposals with eSign, crew scheduling, job costing (Eano, ScapeCubed spreadsheets, Outdoor Estimates, Projul, QuoteIQ; Aspire for $1M+ commercial).
> - Wedge: estimating is still done in spreadsheets (ScapeCubed sells production-rate spreadsheets), so an estimating agent with a production-rate library is a direct replacement.
> - Weakest link: establishment count and concentration not retrieved; Eano company details unknown.

**The agent version** [hypothesis]: Design/quote from photos and dimensions → material tonnage order → weather schedule → invoice. Needs: quoting rules, supplier ordering, weather API.

**Wedge** [hypothesis]: Quote-and-material-order agent for hardscapers.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~3 hrs/week.

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (hardscape/landscape contractors). Public-price incumbents: 2. Gatekeeper: unverified (search budget exhausted before this check). Top-4 share: unverified.

**Evidence URLs (14):**
  - https://www.eano.com/industry/hardscape
  - https://outdoorestimates.com/pages/landscape-estimating-software.html
  - https://projul.com/industries/hardscaper-business/
  - https://myquoteiq.com/top-10-best-job-management-software-for-hardscaping-contractors-in-2026/
  - https://www.scapecubed.com/
  - https://projul.com/industries/deck-builders/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102904155344484
  - https://adstransparency.google.com/advertiser/AR15859438594729967617?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1000188663189114
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=2146347565625894
  - https://adstransparency.google.com/advertiser/AR15154333676306694145?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=117326857937382

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 48. Commercial janitorial companies  (NAICS 561720)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 2.0 = ad score 0.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Bid walkthroughs, night-shift scheduling, inspection checklists.
- **US establishments:** 1264367 (2026, https://www.ibisworld.com/united-states/number-of-businesses/janitorial-services/1496/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Janitorial Manager | yes | 0 | no | 0 / 0 / 0 (-) | Janitorial Manager | no | 3 / 3 (2021-10-25) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | no | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Commercial janitorial companies
> - Core jobs: bidding/estimating from walk-throughs (CleanGuru, Janitorial Manager, SweepOps "ISSA-standard bidding"), mobile inspections with photo proof-of-work, GPS/location clock-ins for distributed multilingual crews (Swept), recurring contract billing, client QC reporting (CleanTelligent/Otuvy), enterprise ERP (WinTeam, Aspire).
> - Two self-published price points: QuoteIQ $29.99/mo, SweepOps $20-$99/mo. Swept "from $30/mo" appeared only in an unattributed summary.
> - Agent wedge: bid-generation agent (square footage + frequency + ISSA production rates -> costed proposal) and inspection-report agent that turns crew photos into client-ready QC reports; both are the "before and after the cleaning" jobs incumbents monetize.
> - Weakest link: IBISWorld's 1,264,367 "janitorial services" count clearly includes non-employer solo operators; the siccode 28,445 active-company figure is closer to the real buyer pool but undated. Franchisor gatekeepers (Jan-Pro, Coverall) unverified.

**The agent version** [hypothesis]: Bid walkthrough notes → proposal with sq ft and frequency pricing → night-shift schedule → inspection checklist results to client → invoice. Needs: quoting rules, SMS, checklist template.

**Wedge** [hypothesis]: Bid-to-proposal agent for small janitorial companies.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/top-8-softwares-for-janitorial-businesses-in-2026/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator for small contractors; facilities/procurement for large accounts (WinTeam/Aspire target $5M+ / 100+ employee firms). Public-price incumbents: 2. Gatekeeper: unverified. Top-4 share: unverified.

**Evidence URLs (8):**
  - https://www.ibisworld.com/united-states/number-of-businesses/janitorial-services/1496/
  - https://www.janitorialmanager.com/work-management-system/janitorial-bidding-software/
  - https://myquoteiq.com/top-8-softwares-for-janitorial-businesses-in-2026/
  - https://sweepops.app/resources/best/best-janitorial-bidding-software/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=622471274478815
  - https://adstransparency.google.com/advertiser/AR01122370165279817729?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 49. Mosquito & bird control services  (NAICS 561710)

- **Status:** not audited. Research: not searched (session search budget exhausted before batch started).
- **Method score:** 2 = ad score 0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Seasonal route programs, application logs, renewals.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Briostack | no (prior knowledge) | 3 | no | 0 / 0 / 0 (-) | Briostack | no | 59 / 28 (2023-04-26) | no 0 | 0 |  |
| GorillaDesk | no (prior knowledge) | 3 | no | 0 / 0 / 0 (-) | GorillaDesk | no | 81 / 34 (2023-05-25) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [hypothesis — batch had no search budget]

> Mosquito & bird control services
> - Franchise-heavy (Mosquito Joe named as a key player alongside Rollins, Rentokil, Anticimex, Arrow); market described as fragmented but by a non-trade report vendor.
> - No mosquito-specific tool surfaced; Briostack/FieldRoutes/GorillaDesk from prior knowledge.
> - Agent wedge: seasonal route + weather-triggered rescheduling and treatment-notification agent (rain delays are the recurring operational pain); bird-control side has proposal/site-survey work suitable for a quote agent.
> - Weakest link: franchise systems likely dictate software for a large share of units; independent-operator count unknown.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator; franchise units (Mosquito Joe named as key player) may be dictated by franchisor. Public-price incumbents: 0. Gatekeeper: possible (franchise). Top-4 share: top 5 ~30% (pest control proxy, dated FY2007).

**Evidence URLs (6):**
  - https://www.openpr.com/news/4545876/mosquito-control-service-market-size-expanding-at-8-9-cagr
  - https://www.sec.gov/Archives/edgar/data/0000095366/000095014408000224/g11232ke10vk.htm
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=113149019284976
  - https://adstransparency.google.com/advertiser/AR15449119615661113345?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=387445444655938
  - https://adstransparency.google.com/advertiser/AR10520026520397807617?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 50. Window treatment (blinds & shades) installers  (NAICS 238390)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 1.5 = ad score 0.5 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — In-home measure, vendor orders, install appointments.
- **US establishments:** unverified (search budget exhausted before this check) — unverified; share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| BlindMatrix | yes | 1 | no | 2 / 0 / 0 (2026-09-11) | BlindMatrix Software | yes | 0 / 0 (-) | yes 8 | 0 |  |
| Blinds Portal | yes | 0 | no | 0 / 0 / 0 (-) | - | no | 0 / 0 (-) | no 0 | 0 |  |
| BlindsBook | yes | 0 | no | 0 / 0 / 0 (-) | Blinds Book | no | 0 / 0 (-) | no 0 | 0 |  |
| MyBlindCo | yes | 0 | no | 0 / 0 / 0 (-) | Myblindco | no | 15 / 0 (2025-01-30) | no 0 | 0 |  |
| Repair-CRM | yes | 0 | no | 0 / 0 / 0 (-) | Repair-CRM | no | 0 / 0 (-) | no 0 | 0 |  |
| Windowware Pro | yes | 0 | no | 0 / 0 / 0 (-) | Windowware Pro | no | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Window treatment installers (238390)
> - Core jobs: measure-to-quote with product/option pricing, quote-to-order conversion with manufacturers, install scheduling, CRM (BlindsBook, BlindMatrix, Windowware Pro, Blinds Portal, MyBlindCo).
> - Wedge: order-entry to manufacturers and measurement-driven quoting are the repetitive tasks; an agent that turns a measure sheet into supplier orders and a customer quote replaces the dealer software seat for independents.
> - Weakest link: nothing verified beyond vendor existence; window-covering franchise systems are a likely gatekeeper (franchisor-mandated software) and were not checked; establishment count not retrieved.

**The agent version** [hypothesis]: In-home measure capture → vendor purchase order → install appointment → invoice. Needs: vendor order portals, calendar.

**Wedge** [hypothesis]: Vendor-order and install appointment agent.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~2 hrs/week.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (window covering dealers/installers); franchise systems likely relevant (not verified). Public-price incumbents: 0. Gatekeeper: unverified (search budget exhausted before this check). Top-4 share: unverified.

**Evidence URLs (13):**
  - https://blindmatrix.com/
  - https://www.blindsportal.com/
  - https://www.blindsbook.com/
  - https://myblindcoapp.com/
  - https://www.repair-crm.com/window-blinds-shades-business-software/
  - https://www.windowwarepro.com/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=109675165240564
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Blinds%20Portal&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1598521677127850
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1302158446474959
  - https://adstransparency.google.com/advertiser/AR07012665662803804161?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=821421364649220
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1435181053457897

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---
