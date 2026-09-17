# ideas_ranked.md — Boring-Niche Ad-Validated Idea Miner (US)

## Status: Step 3 ad audit completed for all 134 search-verified tools (run on a local machine, 2026-09-16)

**Qualified niches by the method's definition (≥2 search-verified tools scoring ≥5): 13.** Provisional (would qualify counting tools whose membership in the niche came from prior knowledge, not search): 2. Niches 61–160 were never searched for tools (session search cap), so most of them cannot qualify yet; see README for the rerun plan.

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
| 1 | Small residential electrical contractors | QUALIFIED (horizontal-only) | 9 | Service Fusion, ServiceTitan, Housecall Pro | 8.0 | 4 | 12.0 |
| 2 | Residential roofing contractors | QUALIFIED | 6 | RoofSnap, AccuLynx, Roofr, ServiceTitan | 8.5 | 3 | 11.5 |
| 3 | Irrigation & lawn sprinkler contractors | QUALIFIED | 9 | Service Fusion, ServiceTitan, HindSite Software / FieldCentral, Housecall Pro | 8.0 | 3 | 11.0 |
| 4 | Plumbing contractors | QUALIFIED (horizontal-only) | 5 | FieldPulse, ServiceTitan | 8.0 | 3 | 11.0 |
| 5 | Lawn care & landscape maintenance | QUALIFIED | 5 | ServiceTitan, RealGreen by WorkWave | 6.5 | 4 | 10.5 |
| 6 | Pressure washing & exterior cleaning | QUALIFIED (horizontal-only) | 9 | Service Fusion, Jobber, Housecall Pro | 7.5 | 3 | 10.5 |
| 7 | Residential painting contractors | QUALIFIED | 4 | DripJobs, PaintScout | 7.0 | 3 | 10.0 |
| 8 | Garage door installers & repair | QUALIFIED (horizontal-only) | 7 | FieldPulse, ServiceTitan, Jobber | 8.0 | 2 | 10.0 |
| 9 | Glass & glazing contractors | QUALIFIED | 4 | FieldPulse, Smart Glazier Software | 7.5 | 1 | 8.5 |
| 10 | Foundation repair & basement waterproofing contractors | QUALIFIED | 3 | Builder Prime, Contractor Accelerator | 6.0 | 2 | 8.0 |
| 11 | Deck & patio builders | QUALIFIED | 5 | Builder Prime, Houzz Pro | 6.0 | 2 | 8.0 |
| 12 | Fire sprinkler contractors | QUALIFIED | 5 | Inspect Point, BuildOps, ServiceTrade | 5.5 | 2 | 7.5 |
| 13 | Carpet & upholstery cleaning | QUALIFIED (horizontal-only) | 8 | Jobber, Housecall Pro | 6.0 | 1 | 7.0 |
| 14 | Snow removal contractors | audited, not passing | 2 | Aspire | 5.0 | 4 | 9.0 |
| 15 | Low-voltage, alarm & security camera installers | audited, not passing (horizontal-only) | 6 | ServiceTitan | 5.5 | 3 | 8.5 |
| 16 | Gutter installation & cleaning contractors | audited, not passing | 4 | RoofSnap | 6.5 | 2 | 8.5 |
| 17 | Lawn fertilization & weed control route businesses | audited, not passing | 4 | RealGreen by WorkWave | 4.0 | 4 | 8.0 |
| 18 | HVAC contractors | audited, not passing (horizontal-only) | 7 | Housecall Pro | 4.0 | 4 | 8.0 |
| 19 | Pool service & maintenance routes | audited, not passing | 5 | Pool Brain | 4.5 | 3 | 7.5 |
| 20 | Septic system installers | audited, not passing (horizontal-only) | 7 | ServiceTitan | 5.5 | 2 | 7.5 |
| 21 | Tree service & arborists | audited, not passing | 8 | - | 3.0 | 4 | 7.0 |
| 22 | Chimney sweeps & chimney repair | audited, not passing (horizontal-only) | 2 | ServiceTitan | 5.0 | 2 | 7.0 |
| 23 | Stump grinding & land clearing | audited, not passing | 5 | - | 2.5 | 4 | 6.5 |
| 24 | Water well drilling contractors | audited, not passing (horizontal-only) | 4 | Jobber | 4.5 | 2 | 6.5 |
| 25 | Pool builders | audited, not passing (horizontal-only) | 6 | Houzz Pro | 4.5 | 2 | 6.5 |
| 26 | Flooring & tile contractors | audited, not passing | 9 | Builder Prime | 4.0 | 2 | 6.0 |
| 27 | Residential cleaning & maid services | audited, not passing (horizontal-only) | 7 | Housecall Pro | 4.0 | 2 | 6.0 |
| 28 | Asphalt paving & sealcoating contractors | audited, not passing | 8 | - | 1.5 | 4 | 5.5 |
| 29 | Concrete flatwork & driveway contractors | audited, not passing | 3 | - | 2.5 | 3 | 5.5 |
| 30 | Window cleaning | audited, not passing | 3 | - | 1.0 | 4 | 5.0 |
| 31 | Pest control operators | audited, not passing | 1 | - | 3 | 2 | 5 |
| 32 | Roll-off dumpster rental | audited, not passing | 1 | - | 4 | 1 | 5 |
| 33 | Portable toilet rental | audited, not passing | 1 | - | 4 | 1 | 5 |
| 34 | Excavation & grading contractors | audited, not passing | 3 | - | 2.5 | 2 | 4.5 |
| 35 | Insulation & spray foam contractors | audited, not passing | 4 | - | 2.0 | 2 | 4.0 |
| 36 | Mold, asbestos & lead abatement contractors | audited, not passing | 8 | - | 2.5 | 1 | 3.5 |
| 37 | Fence contractors | audited, not passing | 3 | - | 1.0 | 2 | 3.0 |
| 38 | Christmas & holiday light installers | audited, not passing | 4 | - | 1.0 | 2 | 3.0 |
| 39 | Hardscape & retaining wall contractors | audited, not passing | 5 | - | 0.5 | 2 | 2.5 |
| 40 | Commercial janitorial companies | audited, not passing | 2 | - | 0.0 | 2 | 2.0 |
| 41 | Mosquito & bird control services | not audited | 0 | - | 0 | 2 | 2 |
| 42 | Window treatment (blinds & shades) installers | audited, not passing | 6 | - | 0.5 | 1 | 1.5 |
| 43 | Handyman services | audited, not passing | 1 | - | 0 | 1 | 1 |
| 44 | Home inspectors | not audited | 0 | - | 0 | 1 | 1 |
| 45 | Wildlife removal & nuisance animal control | not audited | 0 | - | 0 | 1 | 1 |
| 46 | Junk removal | not audited | 0 | - | 0 | 1 | 1 |
| 47 | Septic pumping & grease trap services | provisional (passes only with unverified-membership tools) | 0 | - | 0 | 1 | 1 |
| 48 | Towing companies | not audited | 0 | - | 0 | 1 | 1 |
| 49 | Independent auto repair shops | not audited | 0 | - | 0 | 1 | 1 |
| 50 | Auto body & collision repair shops | not audited | 0 | - | 0 | 1 | 1 |

---

## 1. Small residential electrical contractors  (NAICS 238210)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 12.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** Service Fusion, ServiceTitan, Housecall Pro.
- **Rescrape queued (Meta undersampled):** Housecall Pro, Sera Systems.
- **Boring test:** 3/3 — Permits/inspections, service calls, flat-rate pricing books.
- **US establishments:** 55951 (unverified, https://siccode.com/naics-code/238210/electrical-contractors-wiring-installation-contractors); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Service Fusion | yes | 8 | yes | 29 / 5 / 0 (2026-07-16) | Service Fusion | yes | 400 / 27 (2024-04-26) | yes 5 | 0 | horizontal |
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| Housecall Pro | yes | 5 | yes | 480 / 2 / 2 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | undersampled horizontal |
| Method CRM | yes | 4 | no | 4 / 2 / 2 (2023-05-30) | Method CRM | yes | 200 / 21 (2023-02-27) | no 0 | 0 | horizontal |
| Sera Systems | yes | 3 | no | 17 / 0 / 0 (2026-08-24) | Sera Systems | yes | 51 / 0 (2024-08-20) | no 0 | 2 | undersampled |
| TurboBid | yes | 2 | no | 0 / 0 / 0 (-) | TurboBid Estimating Software | unverified | 0 / 0 (-) | no 0 | 2 |  |
| The New Flat Rate | yes | 1 | no | 7 / 0 / 0 (2026-07-23) | The New Flat Rate | yes | 19 / 1 (2024-07-18) | no 0 | 0 |  |
| Business Genie | yes | 0 | no | 0 / 0 / 0 (-) | Business Genie App | unverified | 1 / 0 (2026-04-11) | no 0 | 0 |  |
| Flat Rate Plus Online | yes | 0 | no | 0 / 0 / 0 (-) | Flat Rate | unverified | 0 / 0 (-) | no 0 | 0 | ambiguous_page |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Small residential electrical contractors
> - Core jobs: flat-rate price books on the tech's phone (Flat Rate Plus, The New Flat Rate, Housecall Pro Price Book add-on), NEC-assembly estimating (TurboBid), scheduling/dispatch, invoicing, QuickBooks sync (Method), code-compliance tracking (Business Genie), after-hours call answering (Sera/QuoteIQ/ServiceAgent).
> - Pricing is public across the board: Sera $399/mo bundle, Business Genie $50-135, TurboBid $99/mo, The New Flat Rate $88/user/mo. Sera is VC/contractor-funded (31 staff, $17M raised); TurboBid is founder-run.
> - Gatekeeper exists but only inside franchises: Mr. Electric's FDD mandates ServiceTitan + FranConnect; Mister Sparky (Authority Brands) is also on ServiceTitan. Independents (the bulk of ~56K-252K firms, most under $2M revenue) are unconstrained.
> - Agent wedge: quote-to-book. Homeowner sends photos/description, agent builds a flat-rate quote from a price book, books the slot, confirms permit needs, and follows up. That is the job TurboBid/flat-rate tools plus a dispatcher do today.
> - Weakest evidence: two very different firm counts (55,951 siccode vs 251,789 Northeastern Advisors) because "residential" is not a NAICS split; headcounts for Business Genie/Flat Rate Plus unverified.

**The agent version** [hypothesis]: Service-call intake → flat-rate quote from the operator's price book → permit application drafted for the jurisdiction → inspection scheduled → invoice. Needs: phone/SMS, price book, jurisdiction permit portals, calendar.

**Wedge** [hypothesis]: Permit-and-inspection paperwork agent for small residential electricians.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Business Genie: $50 to $135 (3 editions, per TrustRadius); free trial and free version (https://www.trustradius.com/products/business-genie-app/pricing)
  - The New Flat Rate: $88/month per user (https://www.capterra.com/p/250719/The-New-Flat-Rate/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator ('vast majority of operators generating under $2 million in annual revenue'). Public-price incumbents: 5. Gatekeeper: Y — Mr. Electric FDD mandates ServiceTitan + FranConnect + ProTradeNet for franchisees. Top-4 share: unverified (IBISWorld: 'low market share concentration', largest = Quanta Services).

**Evidence URLs (42):**
  - https://siccode.com/naics-code/238210/electrical-contractors-wiring-installation-contractors
  - https://www.businessgenieapp.com/industries/electrical
  - https://www.trustradius.com/products/business-genie-app/pricing
  - https://www.zoominfo.com/c/business-genie/557261019 (count not in snippet)
  - https://www.extruct.ai/hub/businessgenieapp-com/ (details not in snippet)
  - https://www.linkedin.com/company/businessgenieapp
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
  - https://www.ibisworld.com/united-states/industry/electricians/189/
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

## 2. Residential roofing contractors  (NAICS 238160)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 11.5 = ad score 8.5 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** RoofSnap, AccuLynx, Roofr, ServiceTitan.
- **Rescrape queued (Meta undersampled):** JobNimbus, Leap.
- **Boring test:** 3/3 — Storm-chasing estimates, insurance supplements, crew scheduling.
- **US establishments:** 108,598 businesses (IBISWorld Roofing Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/roofing-contractors/198); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| RoofSnap | yes | 9 | yes | 10 / 3 / 0 (2026-07-17) | RoofSnap | yes | 200 / 40 (2022-05-05) | no 0 | 2 |  |
| AccuLynx | yes | 8 | yes | 10 / 9 / 5 (2025-08-20) | AccuLynx | yes | 83 / 24 (2023-03-05) | yes 2 | 0 |  |
| Roofr | yes | 8 | yes | 113 / 22 / 0 (2026-05-28) | Roofr | yes | 400 / 37 (2023-06-28) | yes 10 | 0 |  |
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| JobNimbus | yes | 4 | no | 63 / 0 / 0 (2026-09-10) | JobNimbus | yes | 400 / 21 (2023-07-05) | no 0 | 0 | undersampled |
| Leap | yes | 4 | no | 39 / 0 / 0 (2026-08-13) | LEAP | yes | 200 / 21 (2025-02-05) | no 0 | 0 | undersampled |

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

**Fragmentation (Step 4):** 3/5. Check signer: owner-operator / sales manager at $2-6M roofers; per-user pricing means owner signs. Public-price incumbents: 3. Gatekeeper: not searched (session search budget exhausted). Top-4 share: unverified.

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

## 3. Irrigation & lawn sprinkler contractors  (NAICS 238220)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 11.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** Service Fusion, ServiceTitan, HindSite Software / FieldCentral, Housecall Pro; passing but membership unverified: Jobber.
- **Rescrape queued (Meta undersampled):** Housecall Pro.
- **Boring test:** 3/3 — Spring start-up/winterization routes, backflow tests, zone repairs.
- **US establishments:** 2425 (2024, https://www.ibisworld.com/united-states/number-of-businesses/lawn-sprinkler-installation-contractors/6488/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Service Fusion | yes | 8 | yes | 29 / 5 / 0 (2026-07-16) | Service Fusion | yes | 400 / 27 (2024-04-26) | yes 5 | 0 | horizontal |
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| Jobber | no (prior knowledge) | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| HindSite Software / FieldCentral | yes | 6 | yes | 4 / 4 / 0 (2026-06-22) | HindSite Software | yes | 12 / 9 (2021-10-25) | no 0 | 2 |  |
| Housecall Pro | yes | 5 | yes | 480 / 2 / 2 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | undersampled horizontal |
| Orderry | yes | 3 | no | 5 / 0 / 0 (2026-07-27) | Orderry | no | 10 / 3 (2025-04-11) | no 0 | 0 |  |
| Contractor+ | yes | 1 | no | 59 / 0 / 0 (2026-09-08) | Contractor Growth Network | no | 40 / 1 (2024-12-19) | yes 3 | 0 | wrong_page horizontal |
| IrrigationBossPro | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| LayCor | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |

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

**Fragmentation (Step 4):** 3/5. Check signer: owner-operator (tools pitch 'solo installers'; IBISWorld counts 2,425 firms). Public-price incumbents: 5. Gatekeeper: unverified (franchise/association search not run — budget exhausted). Top-4 share: unverified.

**Evidence URLs (36):**
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

**Confidence:** medium-low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 4. Plumbing contractors  (NAICS 238220)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 11.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 3/5.
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
| TurboBid | yes | 2 | no | 0 / 0 / 0 (-) | TurboBid Estimating Software | unverified | 0 / 0 (-) | no 0 | 2 |  |
| Business Genie | yes | 0 | no | 0 / 0 / 0 (-) | Business Genie App | unverified | 1 / 0 (2026-04-11) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Plumbing contractors
> - Core jobs: same FSM stack as HVAC (QuoteIQ, Service Fusion, Jobber, ServiceTitan, FieldPulse, Commusoft) plus plumbing estimating (TurboBid). Roundups emphasize replacing "four or five disconnected tools" with one system.
> - Public pricing: QuoteIQ $29.99, Jobber $169 (5 users), Service Fusion ~$195 starter, TurboBid $99, Business Genie $50-135.
> - Agent wedge: emergency-call intake and triage (after-hours booking, upfront flat-rate ballpark, dispatch) - the after-hours demand is explicitly called out in roundups.
> - Weakest evidence: no plumbing-specific concentration or franchise (Mr. Rooter / Benjamin Franklin) check completed; firm count is IBISWorld via a vendor blog.

**The agent version** [hypothesis]: After-hours call/text intake → flat-rate quote → dispatch to on-call tech → permit application for water heater/repipe → warranty registration → invoice. Needs: phone/SMS, price book, permit portals, calendar.

**Wedge** [hypothesis]: Permit and warranty-registration paperwork agent for small plumbing shops.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Business Genie: $50 to $135 (3 editions) (https://www.trustradius.com/products/business-genie-app/pricing)
  - QuoteIQ: $29.99/month (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 3/5. Check signer: owner-operator (derived: siccode 1,028,117 employees / 88,738 NAICS 238220 companies ≈ 11.6 per firm — derived ratio, not reported). Public-price incumbents: 5. Gatekeeper: unverified (Mr. Rooter / Benjamin Franklin search blocked by budget). Top-4 share: unverified.

**Evidence URLs (26):**
  - https://www.simprogroup.com/blog/plumbing-industry-statistics-2026
  - https://www.businessgenieapp.com/
  - https://www.trustradius.com/products/business-genie-app/pricing
  - https://www.linkedin.com/company/businessgenieapp
  - https://www.fieldpulse.com/resources/blog/software-small-plumbing-business
  - https://myquoteiq.com/crm-for-plumbing-business/
  - https://myquoteiq.com/pricing/
  - https://www.capterra.com/p/10030635/QuoteIQ/
  - https://www.servicetitan.com/industries/plumbing-software
  - https://www.turbobid.com/
  - https://www.turbobid.com/pages/when-we-complete-an-residential-electrical-estimate
  - https://softwareconnect.com/roundups/best-plumbing-software/
  - https://buildops.com/resources/flat-rate-pricing-software-for-electricians/
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

## 5. Lawn care & landscape maintenance  (NAICS 561730)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 10.5 = ad score 6.5 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** ServiceTitan, RealGreen by WorkWave.
- **Rescrape queued (Meta undersampled):** RealGreen by WorkWave.
- **Boring test:** 3/3 — Weekly routes, per-visit invoicing, seasonal contracts.
- **US establishments:** 692777 (2025, https://www.ibisworld.com/united-states/number-of-businesses/landscaping-services/1497/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| RealGreen by WorkWave | yes | 5 | yes | 44 / 0 / 0 (2026-08-26) | RealGreen | yes | 200 / 24 (2024-01-08) | yes 12 | 0 | undersampled |
| Service Autopilot | yes | 3 | no | 0 / 0 / 0 (-) | Service Autopilot by Xplor | unverified | 25 / 16 (2023-07-28) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Yardbook | yes | 0 | no | 0 / 0 / 0 (-) | Yardbook | unverified | 37 / 0 (2026-04-02) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Lawn care & landscape maintenance
> - Core jobs: recurring-visit scheduling (weekly/biweekly), route optimization, quoting from property measurement, invoicing and auto-billing, job costing/budgeting for construction (LMN), automations on job/invoice events (Service Autopilot), chemical tracking (Yardbook paid tier).
> - Incumbents: Service Autopilot ($49/mo + $97 setup, Xplor-owned, 90 staff), RealGreen (WorkWave/PE, quote-based), LMN ($297/mo, now under SingleOps), Yardbook (free tier, Phoenix), FieldCentral ($49.97/user + $103.97 base), QuoteIQ, ServiceTitan lawn landing page.
> - Agent wedge: the market is enormous (692,777 firms, typical 2-3 employees) and the largest cohort is on free/cheap tools or none; an agent that handles inbound quote requests, recurring schedule/route generation, and payment chasing via text could sit below Yardbook's paid tier. Consolidation (WorkWave, Xplor, Granum) is pushing prices up on the mid-tier, which opens the low end.
> - Weakest evidence: share of firms under 20 employees not captured from Census; concentration statement comes from a Lawnstarter blog citing IBISWorld/NALP rather than a primary snippet.

**The agent version** [hypothesis]: Inbound lead → priced recurring-service proposal → schedule slot on the existing route → auto-invoice after each visit → chase late payers by text. Needs: SMS/email, property-measurement source (satellite or the incumbent's measurement API), calendar, Stripe/QuickBooks. Done = a signed recurring agreement on the calendar with card on file.

**Wedge** [hypothesis]: Quote-and-book agent for mowing/maintenance leads (address in, signed recurring proposal out).

**Price ceiling:** incumbent public prices found [search-cited]:
  - FieldCentral (HindSite Software): $49.97/user/mo + $103.97/mo base (per https://www.capterra.com/p/10020754/FieldCentral/); 6 tiers ~$277 to $1000+/mo (https://www.fieldcentral.com/pricing)
  - LMN (Landscape Management Network): $297/mo Starter (1 office + 5 crew licenses); Professional $598/mo; implementation $847 (https://golmn.com/pricing/)
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - RealGreen by WorkWave: ~$199/mo (third-party estimate, https://softwarefinder.com/fleet-management-software/realgreen-by-workwave) (https://www.realgreen.com/pricing)
  - Service Autopilot: $49/mo Startup + $97 sign-up fee; Pro $199; Pro Plus $499; Elite custom (per https://fervorstudio.ca/news/service-autopilot-review-pricing-alternatives/) (https://www.capterra.com/p/122075/Service-Autopilot/pricing/)
  - Yardbook: $0/mo Starter (free indefinitely); paid $15-60/mo (https://fieldtics.com/blog/yardbook-review) (https://www.capterra.com/p/207272/Yardbook/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (typical firm 2-3 employees per Lawnstarter). Public-price incumbents: 4. Gatekeeper: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: no single firm >5% (secondary source citing IBISWorld/NALP).

**Evidence URLs (33):**
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
  - https://www.lawnstarter.com/blog/statistics/lawn-care-landscaping-statistics-2026/
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

## 6. Pressure washing & exterior cleaning  (NAICS 561790)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 10.5 = ad score 7.5 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** Service Fusion, Jobber, Housecall Pro.
- **Rescrape queued (Meta undersampled):** Housecall Pro.
- **Boring test:** 3/3 — Square-foot quoting, route scheduling, recurring commercial contracts.
- **US establishments:** 34186 (2025, https://www.ibisworld.com/united-states/number-of-businesses/pressure-washing-services/6538/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Service Fusion | yes | 8 | yes | 29 / 5 / 0 (2026-07-16) | Service Fusion | yes | 400 / 27 (2024-04-26) | yes 5 | 0 | horizontal |
| Jobber | yes | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| Housecall Pro | yes | 5 | yes | 480 / 2 / 2 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | undersampled horizontal |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| CrewNest | yes | 0 | no | 0 / 0 / 0 (-) | CrewNest | unverified | 0 / 0 (-) | no 0 | 0 |  |
| MakeWash | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Markate | yes | 0 | no | 0 / 0 / 0 (-) | Markate | unverified | 6 / 0 (2025-07-21) | no 0 | 0 |  |
| PowerWashOffice | yes | 0 | no | 0 / 0 / 0 (-) | PowerwashOffice | unverified | 0 / 0 (-) | no 0 | 0 |  |
| ResponsiBid | yes | 0 | no | 0 / 0 / 0 (-) | ResponsiBid | unverified | 1 / 0 (2026-05-18) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Pressure washing & exterior cleaning
> - Core jobs: square-footage measurement from satellite imagery (QuoteIQ MapMeasure Pro), chemical mix calculators, instant online quotes and booking tied to the website (PowerWashOffice), automated review requests, follow-up sequences (ResponsiBid), invoicing/payments.
> - Incumbents: QuoteIQ ($29.99-$699, bootstrapped, founded 2023, hiked prices 75% in 2026), PowerWashOffice (free/$30), MakeWash (free at launch, $49 planned), CrewNest, Markate, ResponsiBid ($179), plus Jobber/Housecall Pro/Service Fusion dedicated landing pages.
> - Agent wedge: address-in, priced-quote-out. Exterior cleaning is priced almost entirely by measurable surface area, so an agent that measures the property, quotes, books, and follows up by text replaces the quoting tool and the CRM at once. QuoteIQ's recent price hikes leave a cheap-tier gap.
> - Weakest evidence: none of the pressure-washing-only tools (MakeWash, PowerWashOffice, CrewNest, Markate) have headcount, founding year, or review counts captured; concentration unverified.

**The agent version** [hypothesis]: Address in → surface area measured → instant quote → booking → review request and follow-up sequence. Needs: satellite measurement, SMS/email, calendar, payments.

**Wedge** [hypothesis]: Address-in, priced-quote-out agent for house/roof/driveway washing.

**Price ceiling:** incumbent public prices found [search-cited]:
  - MakeWash: free during launch; planned $49/mo (https://makewash.com/blog/best-pressure-washing-software-2026)
  - PowerWashOffice: free Owner Operator plan; Teams $30/mo; add-ons $65/mo (CRM, WordPress/API) per https://www.guideflow.com/blog/pressure-washing-software (https://powerwash.software/)
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - ResponsiBid: $179/mo Follow-up+Quoting; Ultimate $199; Powerhouse Bundle $229 (https://www.selecthub.com/p/pricing-software/responsibid/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 3/5. Check signer: owner-operator (solo operators and small crews). Public-price incumbents: 4. Gatekeeper: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: unverified.

**Evidence URLs (30):**
  - https://www.ibisworld.com/united-states/number-of-businesses/pressure-washing-services/6538/
  - https://www.crewnest.app/pressure-washing-crm
  - https://www.housecallpro.com/industries/pressure-washing-software/
  - https://www.getjobber.com/industries/pressure-washing-software/
  - https://makewash.com/blog/best-pressure-washing-software-2026
  - https://buildonauto.com/blog/best-crm-for-pressure-washing/
  - https://powerwash.software/
  - https://myquoteiq.com/crm-for-pressure-washing-business/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://responsibid.com/
  - https://www.selecthub.com/p/pricing-software/responsibid/
  - https://www.capterra.com/p/175241/ResponsiBid/
  - https://www.servicefusion.com/pressure-wash-business-software
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

**Confidence:** medium-low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 7. Residential painting contractors  (NAICS 238320)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 10.0 = ad score 7.0 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** DripJobs, PaintScout.
- **Boring test:** 3/3 — Square-foot estimating, crew scheduling, lead-paint (RRP) paperwork.
- **US establishments:** 219,542 businesses (IBISWorld Painting & Wall Covering Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/painters/187/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| DripJobs | yes | 7 | yes | 120 / 9 / 8 (2026-05-05) | DripJobs | yes | 78 / 9 (2024-02-22) | no 0 | 0 |  |
| PaintScout | yes | 7 | yes | 6 / 5 / 1 (2025-10-05) | PaintScout | yes | 56 / 20 (2024-12-05) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Clientility | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Residential painting contractors (238320)
> - Core jobs: room-by-room production-rate estimating (PaintScout), automated lead follow-up / drip sequences and proposals (DripJobs), paint-quantity calculators and Good/Better/Best options (QuoteIQ), scheduling, invoicing, job costing.
> - Wedge: PaintScout is estimating-only and DripJobs is follow-up-first, so an agent that runs the whole quote-to-booked-job loop (photo walkthrough to estimate to follow-up to schedule) at a solo-painter price point is credible; three incumbents with public prices show buyers pay $30-$150/mo.
> - Weakest evidence: PaintScout pricing conflicts across roundups ($79-$99 vs $119 + $99); PaintScout/Bolster ownership and headcount unverified; painting franchisors' mandated CRMs not searched.

**The agent version** [hypothesis]: Room/exterior photos + sq ft → estimate with paint/labor takeoff → schedule crew → RRP lead-paint documentation for pre-1978 homes → invoice. Needs: photo intake, estimating rules, EPA RRP checklist templates, calendar.

**Wedge** [hypothesis]: Estimate-plus-RRP-paperwork agent for residential painters.

**Price ceiling:** incumbent public prices found [search-cited]:
  - DripJobs: $97/mo Pro; $147/mo Advanced; add-ons: Chat $25/mo, Production Rates $99/mo, Job Costing $49/mo (https://dripjobs.com/pricing)
  - PaintScout: $79-$99/user/mo (estimating only); another roundup: ~$119/user/mo + $99/mo Operations add-on (https://www.paintscout.com/demo/)
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 3/5. Check signer: owner-operator (solo painters to $2-6M operations; founder-built tools like DripJobs). Public-price incumbents: 3. Gatekeeper: not searched (session search budget exhausted). Top-4 share: unverified.

**Evidence URLs (22):**
  - https://www.ibisworld.com/united-states/number-of-businesses/painters/187/
  - https://www.clientility.com/blog/top-4-painting-contractor-software-platforms-in-2026
  - https://dripjobs.com/
  - https://dripjobs.com/pricing
  - https://www.dripjobs.com/about-us
  - https://dripjobs.com/about
  - https://www.paintscout.com/
  - https://www.paintscout.com/demo/
  - https://www.capterra.com/p/201082/PaintScout/
  - https://myquoteiq.com/crm-for-painting-contractors/
  - https://myquoteiq.com/pricing/
  - https://tracxn.com/d/companies/quoteiq/__baJVvCxQIOKFcjFDrIKoaTAs0SGEG9HCkMNvWwcyViU
  - https://bootstrappers.com/mike-vida-quoteiq/
  - https://contractortoolstack.com/software/quoteiq/
  - https://www.cleansavannah.com/post/best-painting-contractor-software-2026
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Clientility&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=2143682922612985
  - https://adstransparency.google.com/advertiser/AR12080640021686648833?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=107630083990856
  - https://adstransparency.google.com/advertiser/AR05074473864172404737?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 8. Garage door installers & repair  (NAICS 238290)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 10.0 = ad score 8.0 (mean of best two verified tools) + fragmentation 2/5.
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
| ServiceBridge | yes | 3 | no | 0 / 0 / 0 (-) | Service Bridge | unverified | 41 / 23 (2025-08-22) | no 0 | 0 |  |
| Workiz | yes | 3 | no | 110 / 0 / 0 (2026-08-09) | Workiz | no | 500 / 20 (2025-10-17) | no 0 | 0 | undersampled horizontal |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Smart Service | yes | 0 | no | 0 / 0 / 0 (-) | Smart Service | unverified | 0 / 0 (-) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> . Garage door installers & repair (238290)
> - Core jobs: same-day emergency dispatch, technician GPS and skill-based assignment, door/opener serial history on the work order, flat-rate pricing libraries, on-site payment (ServiceBridge, Smart Service, Workiz, FieldPulse, ServiceTitan).
> - Wedge: no vertical SaaS exists; every incumbent is a horizontal FSM with a landing page. An inbound-call-to-booked-job agent that quotes spring/opener repairs from a flat-rate book and books the tech is the opening.
> - Weakest evidence: IBISWorld's 299-business count and "high concentration" claim clearly describe a narrow definition and conflict with the long tail of local shops; no vendor pricing beyond QuoteIQ/Jobber; no headcounts.

**The agent version** [hypothesis]: Service-call intake → part identified from photo (spring/opener) → quote → schedule → warranty claim to manufacturer → invoice. Needs: phone/SMS, parts catalog, OEM warranty portals.

**Wedge** [hypothesis]: Warranty-claim and quote agent for garage door service.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (dispatch-driven local shops; enterprise tier only for 20+ tech operations). Public-price incumbents: 2. Gatekeeper: not searched (session search budget exhausted). Top-4 share: IBISWorld: 'high market share concentration'; largest business Sanwa Holdings (manufacturer/dealer network).

**Evidence URLs (26):**
  - https://www.ibisworld.com/industry-statistics/number-of-businesses/garage-door-installation-united-states/
  - https://www.fieldpulse.com/solutions/garage-door
  - https://www.getjobber.com/industries/garage-door-software/
  - https://myquoteiq.com/top-10-crms-for-garage-door-businesses-in-2026/
  - https://myquoteiq.com/pricing/
  - https://tracxn.com/d/companies/quoteiq/__baJVvCxQIOKFcjFDrIKoaTAs0SGEG9HCkMNvWwcyViU
  - https://bootstrappers.com/mike-vida-quoteiq/
  - https://contractortoolstack.com/software/quoteiq/
  - https://servicebridge.com/garage-door-dispatch-software/
  - https://www.servicetitan.com/industries/garage-door-software
  - https://www.smartservice.com/industry/garage-door-software
  - https://www.workiz.com/industries/garage-door/
  - https://www.ibisworld.com/united-states/industry/garage-door-installation/4855/
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

## 9. Glass & glazing contractors  (NAICS 238150)

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
| GlassManager | yes | 3 | no | 3 / 0 / 0 (2026-09-10) | GlassManager | unverified | 19 / 3 (2023-06-30) | no 0 | 0 |  |
| GlasPacLX (GTS Services) | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Glass & glazing contractors (238150)
> - Core jobs: glass-specific quoting (sq-ft calcs, material imports), POS and shop management, scheduling, inventory, invoicing (GlasPacLX/GTS, GlassManager, Smart Glazier, Accentis).
> - Wedge: quote turnaround for custom flat glass (shower doors, storefront) where each quote needs measurements and material lookup; an agent building quotes from a photo/measurement sheet fits small shops on generic tools.
> - Weakest link: establishment count (siccode 1,317) is implausibly low vs its own employee figure; no vendor details captured; auto-glass insurer networks may be a gatekeeper (unverified).

**The agent version** [hypothesis]: Measure/order/install cycle tracking → supplier orders → install appointment. Needs: supplier portals, calendar.

**Wedge** [hypothesis]: Order-tracking and install-scheduling agent for glaziers.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~3 hrs/week.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (glass shops); auto-glass side has insurer/network billing gatekeepers (not verified). Public-price incumbents: 0. Gatekeeper: unverified (search budget exhausted before this check). Top-4 share: unverified.

**Evidence URLs (12):**
  - https://siccode.com/naics-code/238150/glass-glazing-contractors
  - https://www.fieldpulse.com/resources/blog/glass-business-software
  - https://www.gtsservices.com/
  - https://glassmanager.com/
  - https://smartglazier.com/en/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1740011049620778
  - https://adstransparency.google.com/advertiser/AR12871690310899466241?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=GlasPacLX%20(GTS%20Services)&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=889952997834349
  - https://adstransparency.google.com/advertiser/AR06951622993432805377?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=101746263202830
  - https://adstransparency.google.com/advertiser/AR18165100940439322625?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 10. Foundation repair & basement waterproofing contractors  (NAICS 238190)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 8.0 = ad score 6.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** Builder Prime, Contractor Accelerator.
- **Boring test:** 3/3 — Engineer letters, lifetime-warranty transfers, financing paperwork.
- **US establishments:** 6,106 establishments (NAICS 238190, Census 2020); 48,569 employees (2020) (2020, https://naicslist.com/naics/238190); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Builder Prime | yes | 6 | yes | 8 / 6 / 0 (2026-06-22) | Builder Prime | unverified | 26 / 21 (2025-02-21) | no 0 | 0 |  |
| Contractor Accelerator | yes | 6 | yes | 6 / 6 / 4 (2025-10-11) | Contractor Accelerator | no | 22 / 18 (2022-01-28) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Foundation repair & basement waterproofing (238190)
> - Core jobs: lead intake, in-home estimating with photos, production scheduling, job costing, payments (Builder Prime, Contractor Accelerator, QuoteIQ).
> - Wedge: this is a one-call-close, in-home-sales trade; an agent that pre-qualifies leads, schedules inspections and generates the proposal package from the inspector's photos/notes is the obvious fit.
> - Weakest link: only 3 tools found (one horizontal); manufacturer dealer networks may dictate CRM and were not checked; 6,106 establishments (2020) is a broad NAICS proxy.

**The agent version** [hypothesis]: Inspection photos → repair proposal → engineer letter request → warranty transfer paperwork → financing application. Needs: photo intake, proposal template, email.

**Wedge** [hypothesis]: Proposal and warranty-transfer paperwork agent.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~4 hrs/week.

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (foundation repair / waterproofing contractors). Public-price incumbents: 1. Gatekeeper: unverified (search budget exhausted before this check). Top-4 share: unverified.

**Evidence URLs (11):**
  - https://naicslist.com/naics/238190
  - https://www.builderprime.com/industries/basements-waterproofing
  - https://contractoraccelerator.com/industries/foundation-repair
  - https://myquoteiq.com/industries/foundation-repair-software/
  - https://myquoteiq.com/top-10-best-job-management-software-for-hardscaping-contractors-in-2026/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1829807557257902
  - https://adstransparency.google.com/advertiser/AR14135757271249977345?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=1830220243904074
  - https://adstransparency.google.com/advertiser/AR01732577197182418945?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** medium. Weakest link: gatekeeper/concentration checks never ran, so fragmentation may be understated or a franchise gatekeeper missed.

---

## 11. Deck & patio builders  (NAICS 236118)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 8.0 = ad score 6.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** Builder Prime, Houzz Pro.
- **Rescrape queued (Meta undersampled):** JobNimbus.
- **Boring test:** 3/3 — Permit drawings, material takeoffs, seasonal backlog.
- **US establishments:** unverified (search budget exhausted before this check) — unverified; share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Builder Prime | yes | 6 | yes | 8 / 6 / 0 (2026-06-22) | Builder Prime | unverified | 26 / 21 (2025-02-21) | no 0 | 0 |  |
| Houzz Pro | yes | 6 | yes | 82 / 14 / 0 (2026-06-11) | Houzz Pro | no | 700 / 38 (2021-10-25) | no 0 | 0 | horizontal |
| JobNimbus | yes | 4 | no | 63 / 0 / 0 (2026-09-10) | JobNimbus | yes | 400 / 21 (2023-07-05) | no 0 | 0 | undersampled |
| Projul | yes | 1 | no | 3 / 3 / 0 (2026-06-22) | Projul | yes | 3 / 1 (2023-02-14) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Deck & patio builders (236118)
> - Core jobs: lead tracking, board-level material estimating with tiered lumber/composite pricing, weather-aware scheduling, permits/inspections, deposit-to-final invoicing (Projul, Builder Prime, JobNimbus, Houzz Pro, QuoteIQ landing pages).
> - Wedge: no deck-only vertical SaaS surfaced - every tool is a horizontal with a landing page - which suggests the niche is served by generic CRMs and open to a purpose-built agent (estimate + permit paperwork + homeowner updates).
> - Weakest link: establishment count not retrieved; franchisors (deck-building franchises) not checked.

**The agent version** [hypothesis]: Deck design brief → permit drawing package → material list → schedule. Needs: permit portals, drawing template.

**Wedge** [hypothesis]: Deck permit-package agent.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~3 hrs/week.

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator (deck builders). Public-price incumbents: 2. Gatekeeper: unverified (search budget exhausted before this check). Top-4 share: unverified.

**Evidence URLs (16):**
  - https://www.builderprime.com/industries/decks-railings
  - https://pro.houzz.com/for-pros/software-deck-builder-crm
  - https://www.jobnimbus.com/industries/deck-and-patio-software
  - https://projul.com/industries/deck-builders/
  - https://myquoteiq.com/industries/deck-building-software/
  - https://myquoteiq.com/top-10-best-job-management-software-for-hardscaping-contractors-in-2026/
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

## 12. Fire sprinkler contractors  (NAICS 238220)

- **Status:** QUALIFIED. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 7.5 = ad score 5.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** Inspect Point, BuildOps, ServiceTrade.
- **Rescrape queued (Meta undersampled):** BuildOps, ServiceTrade.
- **Boring test:** 3/3 — NFPA 25 inspection reports, AHJ submittals, backflow/hydrostatic tests.
- **US establishments:** 19,845 (IBISWorld Fire Protection & Security System Installation Contractors) (2025, https://www.ibisworld.com/united-states/number-of-businesses/security-system-services/1491/ (result set) ; https://www.ibisworld.com/united-states/industry/fire-protection-and-security-system-installation-contractors/6486/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Inspect Point | yes | 6 | yes | 0 / 0 / 0 (-) | Inspect Point | unverified | 76 / 20 (2023-03-13) | yes 5 | 2 |  |
| BuildOps | yes | 5 | yes | 61 / 0 / 0 (2026-08-03) | BuildOps | yes | 60 / 13 (2025-08-01) | yes 12 | 0 | undersampled horizontal |
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

**Fragmentation (Step 4):** 2/5. Check signer: owner-operator / operations manager (IBISWorld: 90% of Uptick reviewers small companies); larger sprinkler firms buy via ops leadership. Public-price incumbents: 0. Gatekeeper: unverified (search budget exhausted before this check). Top-4 share: <5% for any single company ('highly fragmented').

**Evidence URLs (27):**
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

## 13. Carpet & upholstery cleaning  (NAICS 561740)

- **Status:** QUALIFIED — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 7.0 = ad score 6.0 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** Jobber, Housecall Pro.
- **Rescrape queued (Meta undersampled):** Housecall Pro.
- **Boring test:** 3/3 — Room-count quoting, route scheduling, reminders.
- **US establishments:** 41611 (2026, https://www.ibisworld.com/united-states/number-of-businesses/carpet-cleaning/1498/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Jobber | yes | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| Housecall Pro | yes | 5 | yes | 480 / 2 / 2 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | undersampled horizontal |
| GorillaDesk | yes | 3 | no | 0 / 0 / 0 (-) | GorillaDesk | unverified | 81 / 34 (2023-05-25) | no 0 | 0 |  |
| ServiceMonster | yes | 3 | no | 0 / 0 / 0 (-) | ServiceMonster | unverified | 6 / 5 (2023-05-15) | no 0 | 0 |  |
| Fieldd | yes | 0 | no | 0 / 0 / 0 (-) | Fieldd - Software for Services | unverified | 53 / 0 (2025-06-16) | no 0 | 0 | horizontal |
| ManageMart | yes | 0 | no | 0 / 0 / 0 (-) | Managemart | unverified | 0 / 0 (-) | no 0 | 0 |  |
| ScheduleDrop | yes | 0 | no | 0 / 0 / 0 (-) | ScheduleDrop | unverified | 0 / 0 (-) | no 0 | 0 |  |
| ServGrow | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 8 / 0 (2025-12-03) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Carpet & upholstery cleaning
> - Core jobs: job booking, quoting, technician assignment, invoicing/payments, marketing/reminders for repeat cleanings (ServiceMonster claims >75% client retention), tips/payout tracking (Fieldd).
> - Eight tools with dedicated carpet landing pages found (ServiceMonster, ScheduleDrop, ServGrow, ManageMart, Fieldd, GorillaDesk, Housecall Pro, Jobber); ServiceMonster is the 20-year vertical incumbent.
> - Agent wedge: reactivation/repeat-booking agent (12-month re-clean cadence outreach + instant quote) for solo truck-mount operators; retention is the metric incumbents already sell on.
> - Weakest link: zero prices captured despite most of these tools publishing them; franchisor influence (Chem-Dry, Stanley Steemer) unverified.

**The agent version** [hypothesis]: Room-count quote → route slot → reminders → invoice → 6-month rebook. Needs: SMS, calendar, payments.

**Wedge** [hypothesis]: Rebooking agent for carpet cleaners.

**Price ceiling:** no incumbent price with a cited URL captured — unverified. Labor assumption, not measured: ~2 hrs/week.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (solo/small truck-mount operators). Public-price incumbents: 0. Gatekeeper: unverified. Top-4 share: unverified.

**Evidence URLs (23):**
  - https://www.ibisworld.com/united-states/number-of-businesses/carpet-cleaning/1498/
  - https://fieldd.co/industries/carpet-cleaning-software
  - https://gorilladesk.com/industries/carpet-cleaning-software/
  - https://www.housecallpro.com/industries/carpet-cleaning-software/
  - https://www.getjobber.com/industries/carpet-cleaning-software/
  - https://www.managemart.com/carpet-cleaning-software
  - https://scheduledrop.com/carpet-cleaning
  - https://www.servgrow.com/carpet-cleaning-software
  - https://www.servicemonster.com/carpet-cleaning-software
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

## 14. Snow removal contractors  (NAICS 561790)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 9.0 = ad score 5.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** Aspire.
- **Boring test:** 3/3 — Storm dispatch, per-push/seasonal contracts, slip-and-fall logs.
- **US establishments:** 114244 (2025, https://www.ibisworld.com/united-states/number-of-businesses/snowplowing-services/5400/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Aspire | yes | 8 | yes | 45 / 13 / 0 (2026-06-22) | Aspire Software | yes | 200 / 34 (2022-01-27) | yes 5 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |

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

## 15. Low-voltage, alarm & security camera installers  (NAICS 238210)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 8.5 = ad score 5.5 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** ServiceTitan.
- **Boring test:** 3/3 — Permits, monitoring contracts, recurring inspection paperwork.
- **US establishments:** 87,086 (IBISWorld Security System Services businesses); 55,951 (NAICS 238210 companies verified active, siccode) (2026 / n.d., https://www.ibisworld.com/united-states/number-of-businesses/security-system-services/1491/ ; https://siccode.com/naics-code/238210/electrical-contractors-wiring-installation-contractors); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| FieldForce Tracker | yes | 3 | no | 0 / 0 / 0 (-) | Field Force | unverified | 26 / 11 (2023-10-12) | no 0 | 0 | ambiguous_page |
| ReachOut Suite | yes | 3 | no | 0 / 0 / 0 (-) | ReachOut Suite | unverified | 8 / 3 (2025-04-04) | no 0 | 0 |  |
| WorkHorse SCS | yes | 3 | no | 0 / 0 / 0 (-) | Workhorse | unverified | 6 / 6 (2024-12-17) | no 0 | 0 | ambiguous_page |
| SecurityTrax | yes | 2 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 2 |  |
| Repair-CRM | yes | 0 | no | 0 / 0 / 0 (-) | Repair-CRM | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 16. Gutter installation & cleaning contractors  (NAICS 238170)

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
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| GutterCalc Pro | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 1 / 0 (2026-04-03) | no 0 | 0 |  |

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

## 17. Lawn fertilization & weed control route businesses  (NAICS 561730)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 8.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** RealGreen by WorkWave.
- **Rescrape queued (Meta undersampled):** RealGreen by WorkWave.
- **Boring test:** 3/3 — Program scheduling, pesticide application records, state applicator licenses.
- **US establishments:** 117969 (2023, https://www.lawnstarter.com/blog/statistics/lawn-care-landscaping-statistics-2026/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| RealGreen by WorkWave | yes | 5 | yes | 44 / 0 / 0 (2026-08-26) | RealGreen | yes | 200 / 24 (2024-01-08) | yes 12 | 0 | undersampled |
| Service Autopilot | yes | 3 | no | 0 / 0 / 0 (-) | Service Autopilot by Xplor | unverified | 25 / 16 (2023-07-28) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Momentum FSM | yes | 0 | no | 0 / 0 / 0 (-) | Momentum | unverified | 0 / 0 (-) | no 0 | 0 | ambiguous_page |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Lawn fertilization & weed control route businesses
> - Core jobs: round-based scheduling with mandatory day intervals between applications (FieldCentral chains rounds automatically), master recurring schedules and daily route optimization (RealGreen), chemical/application tracking, pre-pay program billing, sales forms (RealGreen Forms).
> - Incumbents: RealGreen (the legacy leader in this sub-niche), FieldCentral, Service Autopilot, Momentum FSM, QuoteIQ (fert-specific SEO page).
> - Agent wedge: an "application-round agent" that plans the season's rounds per lawn, respects re-application intervals and weather windows, texts customers before each visit, and produces state-required pesticide application records. Compliance recordkeeping is a distinct, unglamorous pain no incumbent snippet emphasized.
> - Weakest evidence: no establishment count specific to fert/weed-control routes exists; the 117,969 employer-company figure is all of NAICS 561730. TruGreen's national share was not surfaced.

**The agent version** [hypothesis]: Per-lawn season plan (rounds with legal re-application intervals and weather windows) → pre-visit texts → post-visit state pesticide application record generated and filed. Needs: weather API, state applicator-record template, SMS, route calendar.

**Wedge** [hypothesis]: Application-round scheduler plus automatic pesticide application recordkeeping.

**Price ceiling:** incumbent public prices found [search-cited]:
  - FieldCentral (HindSite Software): $49.97/user/mo + $103.97/mo base (per https://www.capterra.com/p/10020754/FieldCentral/); 6 tiers ~$277 to $1000+/mo (https://www.fieldcentral.com/pricing)
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  - RealGreen by WorkWave: ~$199/mo (third-party estimate, https://softwarefinder.com/fleet-management-software/realgreen-by-workwave) (https://www.realgreen.com/pricing)
  - Service Autopilot: $49/mo Startup + $97 sign-up fee; Pro $199; Pro Plus $499; Elite custom (per https://fervorstudio.ca/news/service-autopilot-review-pricing-alternatives/) (https://www.capterra.com/p/122075/Service-Autopilot/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator (solo applicators to small route companies). Public-price incumbents: 3. Gatekeeper: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: no single firm >5% (secondary source; TruGreen dominance not quantified in results).

**Evidence URLs (24):**
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=155710354774360
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=134906377100
  - https://adstransparency.google.com/advertiser/AR03990788228809490433?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=85289916525
  - https://adstransparency.google.com/advertiser/AR01165979373417791489?region=US

**Confidence:** low. Weakest link: Meta undersampled for a large advertiser; rescrape pending.

---

## 18. HVAC contractors  (NAICS 238220)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 8.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** Housecall Pro.
- **Rescrape queued (Meta undersampled):** Housecall Pro, Workiz.
- **Boring test:** 2/3 — Maintenance agreements, dispatch, EPA/permit paperwork.
- **US establishments:** 120461 (2026, https://www.ibisworld.com/united-states/number-of-businesses/heating-air-conditioning-contractors/1945/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Housecall Pro | yes | 5 | yes | 480 / 2 / 2 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | undersampled horizontal |
| FieldEdge | yes | 3 | no | 1 / 0 / 0 (2026-08-31) | FieldEdge by Xplor | unverified | 44 / 9 (2021-10-25) | no 0 | 0 | horizontal |
| Workiz | yes | 3 | no | 110 / 0 / 0 (2026-08-09) | Workiz | no | 500 / 20 (2025-10-17) | no 0 | 0 | undersampled horizontal |
| Aptora Total Office Manager | yes | 0 | no | 0 / 0 / 0 (-) | Aptora | unverified | 4 / 0 (2025-05-10) | no 0 | 0 |  |
| AutoHVAC | yes | 0 | no | 0 / 0 / 0 (-) | Auto hvac | unverified | 2 / 1 (2026-04-14) | no 0 | 0 |  |
| Repair-CRM | yes | 0 | no | 0 / 0 / 0 (-) | Repair-CRM | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Successware | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> HVAC contractors
> - Core jobs: dispatch to nearest tech, maintenance-agreement renewals, flat-rate pricing, invoicing with QuickBooks sync (FieldEdge, Successware, Aptora), inventory, and Manual J load calcs for equipment quotes (Cool Calc, AutoHVAC, Wrightsoft).
> - Market is the most fragmented in the batch by evidence: 120,461 firms, largest player <2% share, ~70% of firms under 10 employees. But PE roll-ups are active (DealSeam tracker), and the horizontals price publicly ($49-149/mo).
> - Agent wedge: maintenance-agreement renewal and seasonal tune-up booking, or a Manual J/quote agent that turns a site visit's photos and square footage into a load calc and equipment proposal (current DIY tools run $39-233/mo and are described as taking hours to learn).
> - Weakest evidence: FieldEdge/Successware/Aptora pricing, headcount, and ownership went unverified; franchise software mandates (One Hour, etc.) not checked.

**The agent version** [hypothesis]: Maintenance-agreement renewals and tune-up scheduling → permit pulls → EPA 608 refrigerant log → invoice. Needs: SMS, permit portals, calendar, log templates.

**Wedge** [hypothesis]: Maintenance-agreement renewal and permit agent for small HVAC shops.

**Price ceiling:** incumbent public prices found [search-cited]:
  - AutoHVAC: first Manual J free (per page title) (https://autohvac.ai/manual-j-cost)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 4/5. Check signer: owner-operator ('about 70% of the firms are independents with fewer than 10 employees'). Public-price incumbents: 4. Gatekeeper: unverified (franchise search not run — budget exhausted). Top-4 share: largest single player under 2% share (IBISWorld 2026 via withorbital); IBISWorld: low concentration, largest = Emcor Group.

**Evidence URLs (23):**
  - https://www.ibisworld.com/united-states/number-of-businesses/heating-air-conditioning-contractors/1945/
  - https://www.aptora.com/industries/hvac-software
  - https://autohvac.ai/manual-j-cost
  - https://fieldedge.com/hvac-software/
  - https://www.housecallpro.com/industries/hvac-software/
  - https://www.repair-crm.com/2026/08/30/hvac-software-for-small-business-2026-guide-comparison/
  - https://www.successware.com/industries/hvac-software/
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
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Successware&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=275323565950008
  - https://adstransparency.google.com/advertiser/AR18044909407396954113?region=US

**Confidence:** low. Weakest link: no vertical incumbent passes; qualification rests on horizontal tools.

---

## 19. Pool service & maintenance routes  (NAICS 561790)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 7.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** Pool Brain.
- **Boring test:** 3/3 — Weekly route stops, chemical logs, repair upsells.
- **US establishments:** 78817 (2025, https://www.ibisworld.com/united-states/number-of-businesses/swimming-pool-cleaning-services/4832/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Pool Brain | yes | 5 | yes | 0 / 0 / 0 (-) | PoolBrain | unverified | 95 / 8 (2022-12-22) | no 0 | 2 |  |
| Skimmer | yes | 4 | no | 0 / 0 / 0 (-) | Skimmer | unverified | 90 / 25 (2023-07-05) | yes 12 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Pool Founder | yes | 0 | no | 0 / 0 / 0 (-) | Pool Founder | unverified | 1 / 0 (2026-04-02) | no 0 | 0 |  |
| PoolDial | yes | 0 | no | 0 / 0 / 0 (-) | PoolDial | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 20. Septic system installers  (NAICS 238910)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 7.5 = ad score 5.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** ServiceTitan.
- **Boring test:** 3/3 — Digging and permitting tanks; county health-dept permits and as-built drawings.
- **US establishments:** 38,839 establishments (38,433 businesses); septic installers are a subset of NAICS 238910 Site Preparation Contractors (2020, https://naicslist.com/naics/238910); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| Bella FSM | yes | 3 | no | 0 / 0 / 0 (-) | Bella FSM | unverified | 8 / 3 (2025-05-02) | no 0 | 0 | horizontal |
| ServiceCore | yes | 3 | no | 3 / 0 / 0 (2026-09-09) | ServiceCore | no | 24 / 12 (2023-04-28) | yes 11 | 0 |  |
| PumpDocket | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 2 / 0 (2026-04-10) | no 0 | 0 |  |
| PumperPro | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| SepticPro | yes | 0 | no | 0 / 0 / 0 (-) | Septicpro | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Smart Service | yes | 0 | no | 0 / 0 / 0 (-) | Smart Service | unverified | 0 / 0 (-) | no 0 | 0 | horizontal |

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

## 21. Tree service & arborists  (NAICS 561730)

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
| Arborgold | yes | 3 | no | 0 / 0 / 0 (-) | Arborgold Software | unverified | 17 / 6 (2021-10-25) | no 0 | 0 |  |
| GorillaDesk | yes | 3 | no | 0 / 0 / 0 (-) | GorillaDesk | unverified | 81 / 34 (2023-05-25) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| SingleOps | yes | 2 | no | 42 / 0 / 0 (2026-07-23) | SingleOps | yes | 21 / 0 (2024-10-01) | yes 9 | 0 | undersampled |
| ArboristDesk | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Fieldified | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Treezi | yes | 0 | no | 0 / 0 / 0 (-) | Treezi | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 22. Chimney sweeps & chimney repair  (NAICS 561790)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 7.0 = ad score 5.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** ServiceTitan.
- **Boring test:** 3/3 — Level-2 inspection reports, seasonal routes, CSIA paperwork.
- **US establishments:** 6313 (2024, https://www.ibisworld.com/united-states/market-research-reports/fireplace-services-industry/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ServiceTitan | yes | 8 | yes | 330 / 10 / 3 (2025-06-19) | ServiceTitan | yes | 38 / 38 (2023-05-11) | yes 8 | 0 | horizontal |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |

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

## 23. Stump grinding & land clearing  (NAICS 238910)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 6.5 = ad score 2.5 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** none.
- **Rescrape queued (Meta undersampled):** SingleOps.
- **Boring test:** 3/3 — Per-stump quotes, equipment scheduling, 811 locates.
- **US establishments:** 38839 (2020, https://www.insurancexdate.com/naics/238910); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Arborgold | yes | 3 | no | 0 / 0 / 0 (-) | Arborgold Software | unverified | 17 / 6 (2021-10-25) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| SingleOps | yes | 2 | no | 42 / 0 / 0 (2026-07-23) | SingleOps | yes | 21 / 0 (2024-10-01) | yes 9 | 0 | undersampled |
| OctopusPro | yes | 0 | no | 0 / 0 / 0 (-) | Octopus Pro | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Yardbook | yes | 0 | no | 0 / 0 / 0 (-) | Yardbook | unverified | 37 / 0 (2026-04-02) | no 0 | 0 |  |

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

## 24. Water well drilling contractors  (NAICS 237110)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 6.5 = ad score 4.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** Jobber.
- **Boring test:** 3/3 — State well logs, driller licensing, pump service call-backs.
- **US establishments:** 7,414 companies (entire NAICS 237110 Water and Sewer Line and Related Structures Construction; well drilling is a subset) (unverified, https://siccode.com/naics-code/237110/water-sewer-line-structures-construction); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Jobber | yes | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| DrillerDB | yes | 2 | no | 0 / 0 / 0 (-) | Driller DB | unverified | 5 / 0 (2024-11-07) | no 0 | 2 |  |
| IKOL | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| WellMagic | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 25. Pool builders  (NAICS 238990)

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
| 123worx | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Poologics | yes | 0 | no | 0 / 0 / 0 (-) | Poologics | unverified | 3 / 0 (2025-09-25) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| Streamline CRM | yes | 0 | no | 0 / 0 / 0 (-) | Streamline CRM | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 26. Flooring & tile contractors  (NAICS 238330)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 6.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** Builder Prime.
- **Rescrape queued (Meta undersampled):** Floorzap.
- **Boring test:** 3/3 — Square-foot quotes, material takeoffs, install scheduling.
- **US establishments:** 13,108 companies verified active (siccode); 77,869 employees (n.d., https://siccode.com/naics-code/238330/flooring-contractors); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Builder Prime | yes | 6 | yes | 8 / 6 / 0 (2026-06-22) | Builder Prime | unverified | 26 / 21 (2025-02-21) | no 0 | 0 |  |
| Floorzap | yes | 2 | no | 45 / 0 / 0 (2026-07-29) | Floorzap | yes | 12 / 0 (2025-02-06) | yes 10 | 0 | undersampled |
| Projul | yes | 1 | no | 3 / 3 / 0 (2026-06-22) | Projul | yes | 3 / 1 (2023-02-14) | no 0 | 0 |  |
| FieldGroove | yes | 0 | no | 0 / 0 / 0 (-) | FieldGroove | unverified | 0 / 0 (-) | no 0 | 0 |  |
| FloorSoft | yes | 0 | no | 0 / 0 / 0 (-) | FloorSoft, Inc | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Measure Square | yes | 0 | no | 0 / 0 / 0 (-) | Measure Square | unverified | 0 / 0 (-) | no 0 | 0 |  |
| ProjectsForce 360 | yes | 0 | no | 0 / 0 / 0 (-) | ProjectsForce | unverified | 25 / 0 (2026-02-16) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| WorkQuote | yes | 0 | no | 0 / 0 / 0 (-) | WorkQuote: The All-in-One App for Your Service Business | unverified | 1 / 0 (2026-05-05) | no 0 | 0 |  |

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

## 27. Residential cleaning & maid services  (NAICS 561720)

- **Status:** audited, not passing — horizontal-only pass. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 6.0 = ad score 4.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** Housecall Pro.
- **Rescrape queued (Meta undersampled):** Housecall Pro.
- **Boring test:** 3/3 — Recurring scheduling, cleaner assignment, quotes by sq ft.
- **US establishments:** 356516 (2024, https://www.ibisworld.com/united-states/number-of-businesses/residential-cleaning-services/6542/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Housecall Pro | yes | 5 | yes | 480 / 2 / 2 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | undersampled horizontal |
| ZenMaid | yes | 3 | no | 0 / 0 / 0 (-) | ZenMaid | unverified | 39 / 16 (2024-01-10) | no 0 | 0 |  |
| MaidCentral | yes | 1 | no | 0 / 0 / 0 (-) | MaidCentral Software | unverified | 0 / 0 (-) | yes 8 | 0 |  |
| CleansyAI | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| MaidEasy | yes | 0 | no | 0 / 0 / 0 (-) | Maid Easy | unverified | 0 / 0 (-) | no 0 | 0 |  |
| QuoteIQ | no (prior knowledge) | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| The Cleaning Software | yes | 0 | no | 0 / 0 / 0 (-) | The Cleaning Software | unverified | 3 / 1 (2025-11-03) | no 0 | 0 |  |
| Zenbooker | yes | 0 | no | 0 / 0 / 0 (-) | Zenbooker | unverified | 17 / 0 (2026-04-07) | no 0 | 0 |  |

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

## 28. Asphalt paving & sealcoating contractors  (NAICS 238990)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5.5 = ad score 1.5 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Seasonal quoting, weather scheduling, municipal bid paperwork.
- **US establishments:** 138,636 (IBISWorld Paving Contractors, businesses); 37,952 (NAICS 238990 establishments, Census 2020) (2026 / 2020, https://www.ibisworld.com/industry-statistics/number-of-businesses/paving-contractors-united-states/ ; https://naicslist.com/naics/238990); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| OneCrew | yes | 2 | no | 0 / 0 / 0 (-) | One Crew | unverified | 2 / 2 (2024-11-15) | no 0 | 2 |  |
| GoPave | yes | 1 | no | 1 / 1 / 0 (2026-06-24) | Go Pave Utah | yes | 0 / 0 (-) | no 0 | 0 | wrong_page |
| Projul | yes | 1 | no | 3 / 3 / 0 (2026-06-22) | Projul | yes | 3 / 1 (2023-02-14) | no 0 | 0 |  |
| Bitumio | yes | 0 | no | 0 / 0 / 0 (-) | Bitumio | unverified | 1 / 1 (2023-11-27) | no 0 | 0 |  |
| PavementSoft | yes | 0 | no | 0 / 0 / 0 (-) | Pavement Soft | unverified | 0 / 0 (-) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| SaaSphalt | yes | 0 | no | 0 / 0 / 0 (-) | SA Asphalt | unverified | 0 / 0 (-) | no 0 | 0 |  |
| ScopeTakeoff | yes | 0 | no | 0 / 0 / 0 (-) | ScopeTakeoff.com | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 29. Concrete flatwork & driveway contractors  (NAICS 238110)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5.5 = ad score 2.5 (mean of best two verified tools) + fragmentation 3/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Yardage quoting, pour scheduling around weather, permits.
- **US establishments:** 93,960 businesses (IBISWorld Concrete Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/concrete-contractors/200/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Projul | yes | 3 | no | 3 / 3 / 0 (2026-06-22) | Projul | yes | 3 / 1 (2023-02-14) | no 0 | 2 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| ScopeTakeoff | yes | 0 | no | 0 / 0 / 0 (-) | ScopeTakeoff.com | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 30. Window cleaning  (NAICS 561720)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5.0 = ad score 1.0 (mean of best two verified tools) + fragmentation 4/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Pane-count quotes, recurring routes, commercial invoicing.
- **US establishments:** 35344 (2024, https://www.ibisworld.com/united-states/number-of-businesses/window-washing/6458/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Fieldified | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| ResponsiBid | yes | 0 | no | 0 / 0 / 0 (-) | ResponsiBid | unverified | 1 / 0 (2026-05-18) | no 0 | 0 |  |

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

## 31. Pest control operators  (NAICS 561710)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5 = ad score 3 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Recurring service routes, pesticide-use records, state reporting.
- **US establishments:** 33197 (2025, https://www.ibisworld.com/united-states/number-of-businesses/pest-control/1495/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Briostack | yes | 3 | no | 0 / 0 / 0 (-) | Briostack | unverified | 59 / 28 (2023-04-26) | no 0 | 0 |  |
| GorillaDesk | no (prior knowledge) | 3 | no | 0 / 0 / 0 (-) | GorillaDesk | unverified | 81 / 34 (2023-05-25) | no 0 | 0 |  |

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

## 32. Roll-off dumpster rental  (NAICS 562111)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5 = ad score 4 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Container tracking, drop/pickup scheduling, tonnage billing.
- **US establishments:** 351 (2025, https://www.ibisworld.com/united-states/number-of-businesses/dumpster-rental/5837/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| CurbWaste | yes | 4 | no | 0 / 0 / 0 (-) | CurbWaste | unverified | 65 / 30 (2024-09-25) | yes 8 | 0 |  |
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

## 33. Portable toilet rental  (NAICS 562991)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 5 = ad score 4 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Unit tracking, weekly service routes, event orders.
- **US establishments:** 3489 (2025, https://www.ibisworld.com/united-states/number-of-businesses/portable-toilet-rental/4716/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| CurbWaste | yes | 4 | no | 0 / 0 / 0 (-) | CurbWaste | unverified | 65 / 30 (2024-09-25) | yes 8 | 0 |  |
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

## 34. Excavation & grading contractors  (NAICS 238910)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 4.5 = ad score 2.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — 811 locates, equipment hours, dirt hauling tickets.
- **US establishments:** 235,812 businesses (IBISWorld Excavation Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/excavation-contractors/206/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| HCSS HeavyBid | yes | 3 | no | 14 / 0 / 0 (2026-08-05) | HCSS | no | 200 / 27 (2023-02-02) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| EarthWorks Excavation Software (Tally Systems) | yes | 0 | no | 0 / 0 / 0 (-) | Earthworks | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 35. Insulation & spray foam contractors  (NAICS 238310)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 4.0 = ad score 2.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — R-value quoting, utility rebate forms, energy-code compliance.
- **US establishments:** 19,339 businesses (NAICS 238310 Drywall and Insulation Contractors, Census) (2020, https://naicslist.com/naics/238310); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| FieldGroove | yes | 2 | no | 0 / 0 / 0 (-) | FieldGroove | unverified | 0 / 0 (-) | no 0 | 2 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| Allpro Insulator | yes | 0 | no | 0 / 0 / 0 (-) | Allpro | unverified | 0 / 0 (-) | no 0 | 0 | ambiguous_page |
| FieldCamp | yes | 0 | no | 0 / 0 / 0 (-) | Field Camp | unverified | 3 / 0 (2025-08-13) | no 0 | 0 |  |

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

## 36. Mold, asbestos & lead abatement contractors  (NAICS 562910)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 3.5 = ad score 2.5 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Notifications to state, air-clearance reports, disposal manifests.
- **US establishments:** 5576 (2020, https://siccode.com/naics-code/562910/remediation-services); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| DocuSketch | yes | 4 | no | 0 / 0 / 0 (-) | DocuSketch | unverified | 60 / 38 (2024-07-18) | yes 9 | 0 |  |
| Vev | yes | 1 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | yes 4 | 0 |  |
| Cinderblock | yes | 0 | no | 0 / 0 / 0 (-) | Cinderblock | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Deelo | yes | 0 | no | 0 / 0 / 0 (-) | Deelo | unverified | 2 / 0 (2026-03-12) | no 0 | 0 |  |
| FieldFlo | yes | 0 | no | 0 / 0 / 0 (-) | Fieldflo | unverified | 3 / 2 (2025-01-02) | no 0 | 0 |  |
| OctopusPro | yes | 0 | no | 0 / 0 / 0 (-) | Octopus Pro | unverified | 0 / 0 (-) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| Xcelerate (XL Restoration Software) | yes | 0 | no | 0 / 0 / 0 (-) | Xcelerate | unverified | 4 / 1 (2025-04-11) | no 0 | 0 |  |

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

## 37. Fence contractors  (NAICS 238990)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 3.0 = ad score 1.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Linear-foot quoting, HOA/permit paperwork, install crews.
- **US establishments:** 315,213 businesses (IBISWorld Fence Construction in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/fence-construction/2022); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| ProDBX | no (prior knowledge) | 3 | no | 2 / 2 / 1 (2026-02-20) | Prodbx | no | 20 / 15 (2024-08-01) | no 0 | 0 |  |
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| FenceCloud | yes | 0 | no | 0 / 0 / 0 (-) | Fence Cloud | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Visual Fence Pro | yes | 0 | no | 0 / 0 / 0 (-) | Visual Fence Pro | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 38. Christmas & holiday light installers  (NAICS 561730)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 3.0 = ad score 1.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Seasonal quoting, install/takedown scheduling, storage.
- **US establishments:** 16041 (2024, https://homeservicebase.com/christmas-light-business); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| QuoteIQ | yes | 2 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 2 | horizontal |
| JingleCRM | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Strandr | yes | 0 | no | 0 / 0 / 0 (-) | Strandr | unverified | 3 / 0 (2025-08-05) | no 0 | 0 |  |
| Tinsel CRM | yes | 0 | no | 0 / 0 / 0 (-) | Tinsel CRM | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 39. Hardscape & retaining wall contractors  (NAICS 238140)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 2.5 = ad score 0.5 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Design/quote, material tonnage, weather scheduling.
- **US establishments:** unverified (search budget exhausted before this check) — unverified; share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Projul | yes | 1 | no | 3 / 3 / 0 (2026-06-22) | Projul | yes | 3 / 1 (2023-02-14) | no 0 | 0 |  |
| Eano | yes | 0 | no | 0 / 0 / 0 (-) | Eano | unverified | 16 / 0 (2025-02-27) | no 0 | 0 |  |
| Outdoor Estimates | yes | 0 | no | 0 / 0 / 0 (-) | Outdoor Estimates | unverified | 0 / 0 (-) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |
| ScapeCubed | yes | 0 | no | 0 / 0 / 0 (-) | Scape Cubed | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 40. Commercial janitorial companies  (NAICS 561720)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 2.0 = ad score 0.0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Bid walkthroughs, night-shift scheduling, inspection checklists.
- **US establishments:** 1264367 (2026, https://www.ibisworld.com/united-states/number-of-businesses/janitorial-services/1496/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Janitorial Manager | yes | 0 | no | 0 / 0 / 0 (-) | Janitorial Manager | unverified | 3 / 3 (2021-10-25) | no 0 | 0 |  |
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |

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

## 41. Mosquito & bird control services  (NAICS 561710)

- **Status:** not audited. Research: not searched (session search budget exhausted before batch started).
- **Method score:** 2 = ad score 0 (mean of best two verified tools) + fragmentation 2/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Seasonal route programs, application logs, renewals.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Briostack | no (prior knowledge) | 3 | no | 0 / 0 / 0 (-) | Briostack | unverified | 59 / 28 (2023-04-26) | no 0 | 0 |  |
| GorillaDesk | no (prior knowledge) | 3 | no | 0 / 0 / 0 (-) | GorillaDesk | unverified | 81 / 34 (2023-05-25) | no 0 | 0 |  |

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

## 42. Window treatment (blinds & shades) installers  (NAICS 238390)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 1.5 = ad score 0.5 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — In-home measure, vendor orders, install appointments.
- **US establishments:** unverified (search budget exhausted before this check) — unverified; share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| BlindMatrix | yes | 1 | no | 2 / 0 / 0 (2026-09-11) | BlindMatrix Software | yes | 0 / 0 (-) | yes 8 | 0 |  |
| Blinds Portal | yes | 0 | no | 0 / 0 / 0 (-) | - | unverified | 0 / 0 (-) | no 0 | 0 |  |
| BlindsBook | yes | 0 | no | 0 / 0 / 0 (-) | Blinds Book | unverified | 0 / 0 (-) | no 0 | 0 |  |
| MyBlindCo | yes | 0 | no | 0 / 0 / 0 (-) | Myblindco | unverified | 15 / 0 (2025-01-30) | no 0 | 0 |  |
| Repair-CRM | yes | 0 | no | 0 / 0 / 0 (-) | Repair-CRM | unverified | 0 / 0 (-) | no 0 | 0 |  |
| Windowware Pro | yes | 0 | no | 0 / 0 / 0 (-) | Windowware Pro | unverified | 0 / 0 (-) | no 0 | 0 |  |

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

## 43. Handyman services  (NAICS 236118)

- **Status:** audited, not passing. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 1 = ad score 0 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Small-job quoting, scheduling, parts runs.
- **US establishments:** 528883 (2026, https://www.ibisworld.com/united-states/number-of-businesses/handyman-services/4069/); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| QuoteIQ | yes | 0 | no | 0 / 0 / 0 (-) | Quote IQ | unverified | 26 / 0 (2025-02-14) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [search-cited where a URL is given]

> Handyman services
> - 528,883 firms (IBISWorld 2026) - by far the largest count in the batch and almost certainly one-person shops. Only QuoteIQ surfaced with a handyman mention; no dedicated handyman vertical tool found before the budget ran out. Fewer than 3 tools.
> - Agent wedge (hypothesis only): lead-to-quote-to-schedule from text/photo, since the owner is also the tech.
> - Weakest evidence: no tool research; franchise (e.g. Kaminskiy Care & Repair, Mr. Handyman) software mandates unchecked.

**The agent version** [hypothesis]: Job description + photos → small-job quote → schedule → parts list → invoice. Needs: SMS, calendar, invoicing.

**Wedge** [hypothesis]: Small-job quoting and scheduling agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/month (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor inside the tool. Assumption, not measured: ~2 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (2 hrs/wk × the operator's admin hourly cost).

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (528,883 businesses; derived avg ≈ $691K revenue each from IBISWorld market size). Public-price incumbents: 0. Gatekeeper: unverified (not searched). Top-4 share: unverified.

**Evidence URLs (5):**
  - https://www.ibisworld.com/united-states/number-of-businesses/handyman-services/4069/
  - https://myquoteiq.com/pricing/
  - https://www.capterra.com/p/10030635/QuoteIQ/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=102247669583224
  - https://adstransparency.google.com/advertiser/AR01370189142603857921?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 44. Home inspectors  (NAICS 541350)

- **Status:** not audited. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 1 = ad score 0 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Report writing to state SOP, scheduling with agents, E&O paperwork.
- **US establishments:** 30732 (2026, https://www.ibisworld.com/united-states/number-of-businesses/building-inspectors/1405); share <20 employees: unverified.

**Ad audit (Step 3):** no tools audited for this niche (no search-verified tools; see dead_ends.md).

**What the incumbent SaaS does / incumbents / weakest evidence** [hypothesis — batch had no search budget]

> Home inspectors
> - 30,732 "Building Inspectors" firms (IBISWorld 2026); vast majority solo or two-inspector shops billing 250-600 inspections/yr. Buyer is clearly the owner-operator. 0 tools researched (report-writing/scheduling incumbents unverified). Weakest link: everything past the count.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator ('vast majority operating as solo or two-inspector firms'). Public-price incumbents: 0. Gatekeeper: unverified (not searched; note state licensing + associations like InterNACHI/ASHI not researched). Top-4 share: unverified.

**Evidence URLs (1):**
  - https://www.ibisworld.com/united-states/number-of-businesses/building-inspectors/1405

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 45. Wildlife removal & nuisance animal control  (NAICS 561710)

- **Status:** not audited. Research: not searched (session search budget exhausted before batch started).
- **Method score:** 1 = ad score 0 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none; passing but membership unverified: Jobber.
- **Boring test:** 3/3 — Trap-check scheduling, state permits, exclusion quotes.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Jobber | no (prior knowledge) | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| GorillaDesk | no (prior knowledge) | 3 | no | 0 / 0 / 0 (-) | GorillaDesk | unverified | 81 / 34 (2023-05-25) | no 0 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [hypothesis — batch had no search budget]

> Wildlife removal & nuisance animal control
> - No wildlife-specific software surfaced; operators are a subset of NAICS 561710 and NWCOA (nwcoa.com) runs a public operator directory. All tool rows are prior-knowledge horizontal tools.
> - Core jobs (inferred): inspection scheduling, exclusion quotes, trap-check routing, state permit/reporting paperwork.
> - Agent wedge: inspection-to-exclusion-quote agent with state nuisance-wildlife reporting forms; no vertical incumbent found to displace.
> - Weakest link: no establishment count, no tools, no pricing. Thinnest evidence in the batch.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (NWCOA members are wildlife control operators). Public-price incumbents: 0. Gatekeeper: unverified. Top-4 share: unverified.

**Evidence URLs (5):**
  - https://www.nwcoa.com/
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=387445444655938
  - https://adstransparency.google.com/advertiser/AR10520026520397807617?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183668204989264
  - https://adstransparency.google.com/advertiser/AR07389967871058640897?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 46. Junk removal  (NAICS 562119)

- **Status:** not audited. Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 1 = ad score 0 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none; passing but membership unverified: Jobber.
- **Boring test:** 3/3 — Volume-based quoting, truck dispatch, dump tickets.
- **US establishments:** 6046 (unverified, https://siccode.com/naics-code/562119/waste-collection); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Jobber | no (prior knowledge) | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| CurbWaste | no (prior knowledge) | 4 | no | 0 / 0 / 0 (-) | CurbWaste | unverified | 65 / 30 (2024-09-25) | yes 8 | 0 |  |
| Workiz | no (prior knowledge) | 3 | no | 110 / 0 / 0 (2026-08-09) | Workiz | no | 500 / 20 (2025-10-17) | no 0 | 0 | horizontal |

**What the incumbent SaaS does / incumbents / weakest evidence** [hypothesis — batch had no search budget]

> Junk removal
> - 1-800-GOT-JUNK and College Hunks are franchise systems (Wikipedia results) that will not buy third-party tools; independents (siccode 6,046 active in 562119) are the target.
> - CurbWaste surfaced (hauler software); Workiz/Jobber from prior knowledge.
> - Core jobs (inferred): photo-based estimates, two-hour arrival windows, dispatch, on-site payment, disposal-fee tracking.
> - Agent wedge: photo-to-quote and booking agent (the whole sales cycle is "send a picture, get a price, pick a window").
> - Weakest link: no vertical tool details, no prices; establishment year unknown.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (two-truck haulers); franchise units (1-800-GOT-JUNK, College Hunks) likely franchisor-dictated. Public-price incumbents: 0. Gatekeeper: possible (franchise). Top-4 share: unverified.

**Evidence URLs (8):**
  - https://siccode.com/naics-code/562119/waste-collection
  - https://en.wikipedia.org/wiki/1-800-GOT-JUNK%3F
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=101757769190838
  - https://adstransparency.google.com/advertiser/AR11369419739848769537?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183668204989264
  - https://adstransparency.google.com/advertiser/AR07389967871058640897?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=275323565950008
  - https://adstransparency.google.com/advertiser/AR18044909407396954113?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 47. Septic pumping & grease trap services  (NAICS 562991)

- **Status:** provisional (passes only with unverified-membership tools). Research: searched (partial: search budget exhausted mid-batch).
- **Method score:** 1 = ad score 0 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none; passing but membership unverified: Housecall Pro, Jobber.
- **Boring test:** 3/3 — Pump-out scheduling, manifests, county disposal reporting.
- **US establishments:** 3274 (unverified, https://siccode.com/naics-code/562991/septic-tank-services); share <20 employees: unverified.

**Ad audit (Step 3):**

| tool | verified in niche | score | pass | Meta active / ≥60d / ≥120d (oldest) | Meta page | CTA | Google ads / pass-90d (first shown) | LinkedIn | headcount | flags |
|---|---|---|---|---|---|---|---|---|---|---|
| Jobber | no (prior knowledge) | 7 | yes | 170 / 11 / 7 (2026-05-12) | Jobber | yes | 40 / 31 (2022-08-13) | no 0 | 0 | horizontal |
| Housecall Pro | no (prior knowledge) | 5 | yes | 480 / 2 / 2 (2025-08-21) | Housecall Pro | yes | 30 / 21 (2023-05-24) | yes 3 | 0 | horizontal |
| ServiceCore | no (prior knowledge) | 3 | no | 3 / 0 / 0 (2026-09-09) | ServiceCore | no | 24 / 12 (2023-04-28) | yes 11 | 0 |  |

**What the incumbent SaaS does / incumbents / weakest evidence** [hypothesis — batch had no search budget]

> Septic pumping & grease trap services
> - siccode 3,274 active companies in 562991; IBISWorld septic/drain/sewer 7,338 (2024).
> - No septic-specific tool surfaced; ServiceCore/Jobber/Housecall Pro from prior knowledge.
> - Core jobs (inferred): pump-out reminders on 2-5 year cycles, manifest/disposal records, grease-trap compliance documentation for restaurants, route scheduling.
> - Agent wedge: compliance-manifest and reminder agent (municipal grease-trap reporting is paperwork-heavy and recurring).
> - Weakest link: nothing beyond establishment counts verified.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (pumper-truck operators). Public-price incumbents: 0. Gatekeeper: unverified. Top-4 share: unverified.

**Evidence URLs (7):**
  - https://siccode.com/naics-code/562991/septic-tank-services
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=431381633653850
  - https://adstransparency.google.com/advertiser/AR17264116582418743297?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=183668204989264
  - https://adstransparency.google.com/advertiser/AR07389967871058640897?region=US
  - https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=624372454388997
  - https://adstransparency.google.com/advertiser/AR16372434505086009345?region=US

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 48. Towing companies  (NAICS 488410)

- **Status:** not audited. Research: not searched (session search budget exhausted before batch started).
- **Method score:** 1 = ad score 0 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Dispatch, impound lot paperwork, motor-club billing.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**Ad audit (Step 3):** no tools audited for this niche (no search-verified tools; see dead_ends.md).

**What the incumbent SaaS does / incumbents / weakest evidence** [hypothesis — batch had no search budget]

> Towing companies (488410)
> - Candidate incumbents: Towbook, Beacon, Dispatch Anywhere, Omadi, Tracker. Expected core jobs: dispatch/CAD, motor-club (Agero/Allstate) digital dispatch integration, impound lot inventory, invoicing, driver app/GPS.
> - Hypothesized wedge: motor-club call acceptance + impound-lien paperwork (state-specific notices) handled by an agent.
> - Evidence gap: everything.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (judgment, unsearched). Public-price incumbents: unverified. Gatekeeper: unverified. Top-4 share: unverified.

**Evidence URLs (0):**

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 49. Independent auto repair shops  (NAICS 811111)

- **Status:** not audited. Research: not searched (session search budget exhausted before batch started).
- **Method score:** 1 = ad score 0 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Estimates, parts ordering, appointment scheduling.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**Ad audit (Step 3):** no tools audited for this niche (no search-verified tools; see dead_ends.md).

**What the incumbent SaaS does / incumbents / weakest evidence** [hypothesis — batch had no search budget]

> Independent auto repair shops (811111)
> - Candidates: Shopmonkey, Tekmetric, AutoLeap, Shop-Ware, Mitchell 1, ShopBoss. Expected jobs: digital vehicle inspection, estimates/quotes, parts ordering, invoicing, text-to-pay, CRM reminders.
> - Hypothesized wedge: phone-answering + estimate follow-up + declined-service re-engagement agent.
> - Evidence gap: everything.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (judgment, unsearched). Public-price incumbents: unverified. Gatekeeper: unverified. Top-4 share: unverified.

**Evidence URLs (0):**

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---

## 50. Auto body & collision repair shops  (NAICS 811121)

- **Status:** not audited. Research: not searched (session search budget exhausted before batch started).
- **Method score:** 1 = ad score 0 (mean of best two verified tools) + fragmentation 1/5.
- **Passing tools:** none.
- **Boring test:** 3/3 — Insurance estimates, parts, cycle-time tracking.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**Ad audit (Step 3):** no tools audited for this niche (no search-verified tools; see dead_ends.md).

**What the incumbent SaaS does / incumbents / weakest evidence** [hypothesis — batch had no search budget]

> Auto body & collision (811121)
> - Candidates: CCC ONE, Mitchell, Rome, Bodyshop Booster, AutoFocus. Expected jobs: insurer-linked estimating (DRP), photo estimating, parts procurement, cycle-time tracking.
> - Hypothesized wedge: insurer supplement documentation and customer status updates. Likely gatekeeper risk: insurer DRP programs dictate estimating platform (unverified).
> - Evidence gap: everything.

**The agent version / wedge:** not drafted for this niche (outside the original 50 cards); the audit data above stands on its own.

**Fragmentation (Step 4):** 1/5. Check signer: owner-operator (judgment, unsearched). Public-price incumbents: unverified. Gatekeeper: unverified. Top-4 share: unverified.

**Evidence URLs (0):**

**Confidence:** low. Weakest link: fewer than 2 verified tools pass the ad test.

---
