# ideas_ranked.md — Boring-Niche Ad-Validated Idea Miner (US)

## Read this first: what this ranking is and is not

**Qualified ideas by the method's definition: 0 of 50.** The method's core filter (Step 3, ad longevity) could not be executed in this environment. Every ad count, start date, platform and CTA field in `ad_audit.csv` reads `unverified (host blocked)`, and no niche can pass the "≥2 tools scoring ≥5" gate on verified evidence. Nothing here was estimated to fill that gap.

Two blockers, both environmental, both documented in `README.md`:

1. **Egress policy.** facebook.com/ads/library, adstransparency.google.com, linkedin.com/ad-library, api.census.gov, data.census.gov, capterra.com, g2.com, getapp.com, crunchbase.com, trustmrr.com and every vendor site returned a proxy 403 (organization policy). Only the WebSearch tool worked, and it returns titles, URLs and snippets, not page contents.
2. **Search budget.** The session allowed 200 WebSearch calls in total, shared across 16 parallel batch agents. Batches 1–6 (niches 1–60) got between 7 and 52 searches each before the budget ran out; batches 7–16 (niches 61–160) got zero.

So this file ranks **pre-audit candidates** by a *provisional evidence score*, not by the method's (ad score + fragmentation score). The provisional score is:

    provisional = fragmentation_score (0–5, from fragmentation.csv; 0 if unverified)
               + max headcount bonus among the niche's tools (0 or 2; the only Step 3 signal that was verifiable)
               + 1 if ≥3 search-verified tools were found
               + 1 if ≥1 search-verified tool has a public starting price with a cited URL

Ranks 1–42 are niches where at least one tool was found via search with a cited URL. Ranks 43–50 are judgment picks from the unsearched batches, included because their daily work is dominated by a compliance filing an agent could own end-to-end; they carry **no search evidence** and are labeled as such.

Every card ends with an **Audit checklist**: the exact Meta / Google / LinkedIn lookup URLs for each search-verified tool. Running those (about 3 lookups per tool) completes Step 3 for that niche. `ad_audit.csv` has the same URLs for all 550 tool rows.

Provenance labels used below: **[search-cited]** = came from a WebSearch result whose URL is listed; **[hypothesis]** = written by the research agents or the collator from general knowledge, not from a fetched source.

Confidence is **low** on every card because the weakest link is the same everywhere: ad longevity is unverified. The card names the second-weakest link too.

---

## 1. Lawn care & landscape maintenance  (NAICS 561730)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 4/5.
- **Provisional evidence score:** 8 (fragmentation 4, headcount bonus 2, 7 search-verified tools, 6 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Weekly routes, per-visit invoicing, seasonal contracts.
- **US establishments:** 692777 (2025, https://www.ibisworld.com/united-states/number-of-businesses/landscaping-services/1497/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 4/5. Check signer: owner-operator (typical firm 2-3 employees per Lawnstarter). Public-price incumbents: 4. Gatekeeper found: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: no single firm >5% (secondary source citing IBISWorld/NALP). Notes: Score: +1 owner, +1 public price, +1 >=3, +0 gatekeeper unverified, +1 'highly fragmented, >650,000 businesses, no firm >5%' (Lawnstarter blog citing IBISWorld/NALP; primary IBISWorld snippet not captured, so flag as secondary).

**Evidence URLs (23):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - RealGreen by WorkWave (realgreen.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=RealGreen%20by%20WorkWave&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=realgreen.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=RealGreen%20by%20WorkWave
  - Service Autopilot (serviceautopilot.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Service%20Autopilot&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=serviceautopilot.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Service%20Autopilot
  - ServiceTitan (servicetitan.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceTitan&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicetitan.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceTitan
  - Yardbook (yardbook.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Yardbook&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=yardbook.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Yardbook

---

## 2. Tree service & arborists  (NAICS 561730)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 4/5.
- **Provisional evidence score:** 8 (fragmentation 4, headcount bonus 2, 8 search-verified tools, 5 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Estimates, crane/crew scheduling, ISA/permit paperwork.
- **US establishments:** 175035 (2025, https://www.ibisworld.com/united-states/number-of-businesses/tree-trimming-services/6064/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 4/5. Check signer: owner-operator (small tree companies; founders of ArboStar/Treezi/QuoteIQ are ex-contractors). Public-price incumbents: 4. Gatekeeper found: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: low concentration (share unverified). Notes: Score: +1 owner buyer, +1 public price, +1 >=3 public prices, +0 gatekeeper unverified, +1 IBISWorld 'low market share concentration; Asplundh largest'. PE roll-ups active (CT Acquisitions tracks 24 platforms) but those buy tree companies, not software gatekeeping.

**Evidence URLs (24):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - ArboStar (arbostar.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ArboStar&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=arbostar.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ArboStar
  - Arborgold (arborgold.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Arborgold&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=arborgold.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Arborgold
  - ArboristDesk (arboristdesk.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ArboristDesk&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=arboristdesk.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ArboristDesk
  - Fieldified (fieldified.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Fieldified&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldified.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Fieldified
  - GorillaDesk (gorilladesk.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=GorillaDesk&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=gorilladesk.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=GorillaDesk
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - SingleOps (singleops.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=SingleOps&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=singleops.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=SingleOps
  - Treezi (treeziapp.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Treezi&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=treeziapp.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Treezi

---

## 3. Lawn fertilization & weed control route businesses  (NAICS 561730)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 4/5.
- **Provisional evidence score:** 8 (fragmentation 4, headcount bonus 2, 5 search-verified tools, 4 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Program scheduling, pesticide application records, state applicator licenses.
- **US establishments:** 117969 (2023, https://www.lawnstarter.com/blog/statistics/lawn-care-landscaping-statistics-2026/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 4/5. Check signer: owner-operator (solo applicators to small route companies). Public-price incumbents: 3. Gatekeeper found: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: no single firm >5% (secondary source; TruGreen dominance not quantified in results). Notes: Score: +1 owner, +1 public price, +1 >=3, +0 gatekeeper unverified, +1 fragmentation (same secondary source as niche 32). Caveat: TruGreen is a large national fert operator; its share was not surfaced. State pesticide-applicator licensing is a compliance layer but not a software gatekeeper.

**Evidence URLs (17):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Momentum FSM (momentumfsm.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Momentum%20FSM&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=momentumfsm.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Momentum%20FSM
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - RealGreen by WorkWave (realgreen.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=RealGreen%20by%20WorkWave&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=realgreen.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=RealGreen%20by%20WorkWave
  - Service Autopilot (serviceautopilot.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Service%20Autopilot&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=serviceautopilot.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Service%20Autopilot

---

## 4. Stump grinding & land clearing  (NAICS 238910)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 4/5.
- **Provisional evidence score:** 8 (fragmentation 4, headcount bonus 2, 5 search-verified tools, 4 with public price + URL; 1 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Per-stump quotes, equipment scheduling, 811 locates.
- **US establishments:** 38839 (2020, https://www.insurancexdate.com/naics/238910); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 4/5. Check signer: owner-operator (single-machine stump grinders; small excavation crews). Public-price incumbents: 4. Gatekeeper found: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: low concentration (tree trimming parent industry; share unverified). Notes: Score: +1 owner, +1 public price, +1 >=3 (tree-service tools reused), +0 gatekeeper unverified, +1 IBISWorld low-concentration statement for parent Tree Trimming Services industry. No stump-only vertical tool with public pricing surfaced; land clearing (NAICS 238910) tools not surfaced at all.

**Evidence URLs (18):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Arborgold (arborgold.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Arborgold&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=arborgold.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Arborgold
  - OctopusPro (octopuspro.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=OctopusPro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=octopuspro.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=OctopusPro
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - SingleOps (singleops.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=SingleOps&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=singleops.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=SingleOps
  - Yardbook (yardbook.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Yardbook&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=yardbook.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Yardbook

---

## 5. Snow removal contractors  (NAICS 561790)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 4/5.
- **Provisional evidence score:** 8 (fragmentation 4, headcount bonus 2, 4 search-verified tools, 3 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Storm dispatch, per-push/seasonal contracts, slip-and-fall logs.
- **US establishments:** 114244 (2025, https://www.ibisworld.com/united-states/number-of-businesses/snowplowing-services/5400/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~6 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (6 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 4/5. Check signer: owner-operator (landscapers running winter divisions; commercial contracts). Public-price incumbents: 3. Gatekeeper found: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: described as highly fragmented (share unverified). Notes: Score: +1 owner, +1 public price, +1 >=3, +0 gatekeeper unverified, +1 IBISWorld snippet 'highly fragmented, local operators'. Commercial property managers may dictate proof-of-service reporting (Yeti's wedge) but no software mandate found.

**Evidence URLs (12):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Aspire (youraspire.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Aspire&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=youraspire.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Aspire
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ

---

## 6. Window cleaning  (NAICS 561720)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 4/5.
- **Provisional evidence score:** 8 (fragmentation 4, headcount bonus 2, 4 search-verified tools, 3 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Pane-count quotes, recurring routes, commercial invoicing.
- **US establishments:** 35344 (2024, https://www.ibisworld.com/united-states/number-of-businesses/window-washing/6458/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 4/5. Check signer: owner-operator (solo glass cleaners to small crews). Public-price incumbents: 3. Gatekeeper found: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: no company >5% share. Notes: Score: +1 owner, +1 public price, +1 >=3, +0 gatekeeper unverified, +1 IBISWorld 'highly fragmented with no companies holding >5%'. Note IBISWorld business count declining (-4.9% CAGR 2019-2024).

**Evidence URLs (13):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Fieldified (fieldified.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Fieldified&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldified.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Fieldified
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - ResponsiBid (responsibid.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ResponsiBid&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=responsibid.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ResponsiBid

---

## 7. Asphalt paving & sealcoating contractors  (NAICS 238990)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 4/5.
- **Provisional evidence score:** 8 (fragmentation 4, headcount bonus 2, 8 search-verified tools, 2 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Seasonal quoting, weather scheduling, municipal bid paperwork.
- **US establishments:** 138,636 (IBISWorld Paving Contractors, businesses); 37,952 (NAICS 238990 establishments, Census 2020) (2026 / 2020, https://www.ibisworld.com/industry-statistics/number-of-businesses/paving-contractors-united-states/ ; https://naicslist.com/naics/238990); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Asphalt paving & sealcoating (238990)
> - Core jobs users log in for: satellite/map measurement -> tonnage/material estimate -> proposal, crew scheduling, job costing, invoicing with QuickBooks sync (Bitumio, SaaSphalt, PavementSoft, OneCrew). GoPave is sales-only: missed-call text-back, follow-up, review requests.
> - Wedge: the quoting loop is the whole business for sealcoat/small paving shops. An agent that takes an address, measures from imagery, prices from the shop's rate card, sends the proposal and runs follow-up (GoPave's entire product) replaces the CRM seat; per-seat pricing ($70-$149/user/mo) is a clear price umbrella.
> - Weakest link: OneCrew is VC-funded ($13M) and is content-marketing aggressively, so the category is not unattended; PavementSoft's $59.99 came from review aggregators, not the vendor.

**The agent version** [hypothesis]: Measure driveway/lot from satellite → seal/pave quote with material takeoff → weather-safe schedule → municipal bid paperwork drafted for small public jobs. Needs: measurement API, weather, quoting rules, PDF bid forms.

**Wedge** [hypothesis]: Satellite-measure-to-quote agent for sealcoating/residential paving.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Bitumio: $149 per user per month (mobile-only crew free) - https://bitumio.com/pricing/ (also https://www.contractorsoftwarehub.com/bitumio-review/) (https://bitumio.com/pricing/)
  - SaaSphalt: $70 per user per month - https://www.saasphalt.com/pricing.htm (per getonecrew comparison https://www.getonecrew.com/post/asphalt-bidding-software) (https://www.saasphalt.com/pricing.htm)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 4/5. Check signer: owner-operator (small paving/sealcoating shops; SaaSphalt/Bitumio sell per-user month-to-month). Public-price incumbents: 5. Gatekeeper found: unverified (search budget exhausted before this check). Top-4 share: <5% for any single company ('highly fragmented'). Notes: Score: +1 owner-operator, +1 public price, +1 >=3 public prices, +1 fragmented; gatekeeper point withheld because franchise/association check was not run.

**Evidence URLs (18):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Bitumio (bitumio.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Bitumio&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=bitumio.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Bitumio
  - GoPave (gopavecrm.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=GoPave&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=gopavecrm.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=GoPave
  - OneCrew (getonecrew.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=OneCrew&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=getonecrew.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=OneCrew
  - PavementSoft (pavementsoft.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=PavementSoft&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=pavementsoft.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=PavementSoft
  - Projul (projul.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Projul&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=projul.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Projul
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - SaaSphalt (saasphalt.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=SaaSphalt&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=saasphalt.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=SaaSphalt
  - ScopeTakeoff (scopetakeoff.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ScopeTakeoff&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=scopetakeoff.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ScopeTakeoff

---

## 8. Small residential electrical contractors  (NAICS 238210)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 4/5.
- **Provisional evidence score:** 8 (fragmentation 4, headcount bonus 2, 9 search-verified tools, 2 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Permits/inspections, service calls, flat-rate pricing books.
- **US establishments:** 55951 (unverified, https://siccode.com/naics-code/238210/electrical-contractors-wiring-installation-contractors); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 4/5. Check signer: owner-operator ('vast majority of operators generating under $2 million in annual revenue'). Public-price incumbents: 5. Gatekeeper found: Y — Mr. Electric FDD mandates ServiceTitan + FranConnect + ProTradeNet for franchisees. Top-4 share: unverified (IBISWorld: 'low market share concentration', largest = Quanta Services). Notes: +1 owner-operator (https://northeasternadvisors.com/2026-u-s-electrical-contracting-industry-report/), +1 public price, +1 >=3 public prices, +1 'highly fragmented' (same northeasternadvisors URL; IBISWorld 'low concentration'). Gatekeeper found (franchise only, not industry-wide) so no point. Mister Sparky also on ServiceTitan via Authority Brands: https://1851franchise.com/mister-sparky-electric/authority-brands-servicetitan-integration-2731975

**Evidence URLs (26):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Business Genie (businessgenieapp.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Business%20Genie&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=businessgenieapp.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Business%20Genie
  - Flat Rate Plus Online (flatratesoftware.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Flat%20Rate%20Plus%20Online&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=flatratesoftware.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Flat%20Rate%20Plus%20Online
  - Housecall Pro (housecallpro.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Housecall%20Pro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=housecallpro.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Housecall%20Pro
  - Method CRM (method.me): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Method%20CRM&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=method.me | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Method%20CRM
  - Sera Systems (sera.tech): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Sera%20Systems&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=sera.tech | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Sera%20Systems
  - Service Fusion (servicefusion.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Service%20Fusion&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicefusion.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Service%20Fusion
  - ServiceTitan (servicetitan.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceTitan&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicetitan.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceTitan
  - The New Flat Rate (thenewflatrate.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=The%20New%20Flat%20Rate&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=thenewflatrate.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=The%20New%20Flat%20Rate
  - TurboBid (turbobid.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=TurboBid&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=turbobid.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=TurboBid

---

## 9. Irrigation & lawn sprinkler contractors  (NAICS 238220)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 3/5.
- **Provisional evidence score:** 7 (fragmentation 3, headcount bonus 2, 9 search-verified tools, 5 with public price + URL; 1 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Spring start-up/winterization routes, backflow tests, zone repairs.
- **US establishments:** 2425 (2024, https://www.ibisworld.com/united-states/number-of-businesses/lawn-sprinkler-installation-contractors/6488/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 3/5. Check signer: owner-operator (tools pitch 'solo installers'; IBISWorld counts 2,425 firms). Public-price incumbents: 5. Gatekeeper found: unverified (franchise/association search not run — budget exhausted). Top-4 share: unverified. Notes: +1 owner-operator, +1 public price, +1 >=3 public prices. Gatekeeper and top-4 share unverified so no points. Owner-operator evidence: https://myquoteiq.com/top-10-best-scheduling-software-for-irrigation-businesses-in-2026/ ('scales from solo installers').

**Evidence URLs (18):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Contractor+ (contractorplus.app): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Contractor%2B&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=contractorplus.app | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Contractor%2B
  - HindSite Software / FieldCentral (hindsitesoftware.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=HindSite%20Software%20/%20FieldCentral&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=hindsitesoftware.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=HindSite%20Software%20/%20FieldCentral
  - Housecall Pro (housecallpro.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Housecall%20Pro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=housecallpro.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Housecall%20Pro
  - IrrigationBossPro (irrigationbosspro.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=IrrigationBossPro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=irrigationbosspro.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=IrrigationBossPro
  - LayCor (laycor.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=LayCor&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=laycor.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=LayCor
  - Orderry (orderry.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Orderry&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=orderry.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Orderry
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - Service Fusion (servicefusion.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Service%20Fusion&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicefusion.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Service%20Fusion
  - ServiceTitan (servicetitan.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceTitan&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicetitan.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceTitan

---

## 10. Pressure washing & exterior cleaning  (NAICS 561790)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 3/5.
- **Provisional evidence score:** 7 (fragmentation 3, headcount bonus 2, 9 search-verified tools, 4 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Square-foot quoting, route scheduling, recurring commercial contracts.
- **US establishments:** 34186 (2025, https://www.ibisworld.com/united-states/number-of-businesses/pressure-washing-services/6538/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 3/5. Check signer: owner-operator (solo operators and small crews). Public-price incumbents: 4. Gatekeeper found: unverified (gatekeeper searches not run; session WebSearch budget exhausted). Top-4 share: unverified. Notes: Score: +1 owner, +1 public price, +1 >=3, +0 gatekeeper unverified, +0 concentration unverified (IBISWorld pressure washing page surfaced counts only). Very low entry barriers; 34,186 firms growing ~6%/yr.

**Evidence URLs (15):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - CrewNest (crewnest.app): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=CrewNest&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=crewnest.app | LinkedIn https://www.linkedin.com/ad-library/search?keyword=CrewNest
  - Housecall Pro (housecallpro.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Housecall%20Pro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=housecallpro.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Housecall%20Pro
  - Jobber (getjobber.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Jobber&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=getjobber.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Jobber
  - MakeWash (makewash.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=MakeWash&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=makewash.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=MakeWash
  - Markate (markate.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Markate&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=markate.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Markate
  - PowerWashOffice (powerwash.software): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=PowerWashOffice&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=powerwash.software | LinkedIn https://www.linkedin.com/ad-library/search?keyword=PowerWashOffice
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - ResponsiBid (responsibid.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ResponsiBid&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=responsibid.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ResponsiBid
  - Service Fusion (servicefusion.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Service%20Fusion&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicefusion.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Service%20Fusion

---

## 11. Residential painting contractors  (NAICS 238320)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 3/5.
- **Provisional evidence score:** 7 (fragmentation 3, headcount bonus 2, 4 search-verified tools, 3 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Square-foot estimating, crew scheduling, lead-paint (RRP) paperwork.
- **US establishments:** 219,542 businesses (IBISWorld Painting & Wall Covering Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/painters/187/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 3/5. Check signer: owner-operator (solo painters to $2-6M operations; founder-built tools like DripJobs). Public-price incumbents: 3. Gatekeeper found: not searched (session search budget exhausted). Top-4 share: unverified. Notes: +1 owner-operator, +1 >=1 public price, +1 >=3 public prices. Painting franchisors (CertaPro, Five Star Painting, WOW 1 DAY) commonly mandate a CRM - not searched, so no 'no gatekeeper' point. IBISWorld 219,542 businesses (https://www.ibisworld.com/united-states/number-of-businesses/painters/187/).

**Evidence URLs (15):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Clientility (clientility.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Clientility&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=clientility.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Clientility
  - DripJobs (dripjobs.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=DripJobs&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=dripjobs.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=DripJobs
  - PaintScout (paintscout.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=PaintScout&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=paintscout.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=PaintScout
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ

---

## 12. Pool service & maintenance routes  (NAICS 561790)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 3/5.
- **Provisional evidence score:** 7 (fragmentation 3, headcount bonus 2, 5 search-verified tools, 3 with public price + URL; 1 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Weekly route stops, chemical logs, repair upsells.
- **US establishments:** 78817 (2025, https://www.ibisworld.com/united-states/number-of-businesses/swimming-pool-cleaning-services/4832/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 3/5. Check signer: owner-operator (route owners; franchises like Poolwerx/Pool Scouts exist). Public-price incumbents: 3. Gatekeeper found: franchisors present (Poolwerx backed by Norwest; Pool Scouts) but software mandate unverified. Top-4 share: unverified. Notes: Score: +1 owner, +1 public price, +1 >=3, +0 gatekeeper (franchisors exist; whether they dictate software unverified), +0 concentration unverified. Skimmer ($84M VC) is the dominant vertical incumbent and just doubled per-pool price.

**Evidence URLs (13):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Pool Brain (poolbrain.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Pool%20Brain&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=poolbrain.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Pool%20Brain
  - Pool Founder (poolfounder.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Pool%20Founder&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=poolfounder.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Pool%20Founder
  - PoolDial (pooldial.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=PoolDial&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=pooldial.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=PoolDial
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - Skimmer (getskimmer.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Skimmer&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=getskimmer.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Skimmer

---

## 13. Concrete flatwork & driveway contractors  (NAICS 238110)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 3/5.
- **Provisional evidence score:** 7 (fragmentation 3, headcount bonus 2, 3 search-verified tools, 2 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Yardage quoting, pour scheduling around weather, permits.
- **US establishments:** 93,960 businesses (IBISWorld Concrete Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/concrete-contractors/200/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> . Concrete flatwork & driveway contractors (238110)
> - Core jobs: aerial measurement of driveways/patios, takeoff for slabs/footings/rebar (ScopeTakeoff), quoting, scheduling pours and crews, job costing (Projul, QuoteIQ).
> - Wedge: a pour-day logistics agent (ready-mix ordering quantities from the takeoff, weather-based rescheduling, crew notifications) sits between estimating tools and the yard; no incumbent covers it.
> - Weakest evidence: only three tools met the landing-page rule (Jobber's concrete page was not captured); ScopeTakeoff price comes from a third-party blog; no headcount for ScopeTakeoff.

**The agent version** [hypothesis]: Yardage/sq ft quote from drawings or photos → pour scheduled around weather and ready-mix availability → permit forms drafted → invoice. Needs: quoting rules, weather API, permit portals.

**Wedge** [hypothesis]: Quote-and-pour-scheduling agent for flatwork.

**Price ceiling:** incumbent public prices found [search-cited]:
  - Projul: $4,788/yr Core (up to 10 employees); Pro $14,388/yr unlimited users (https://projul.com/pricing/)
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 3/5. Check signer: owner-operator (residential flatwork crews under 20 employees). Public-price incumbents: 3. Gatekeeper found: not searched (session search budget exhausted). Top-4 share: unverified. Notes: +1 owner-operator, +1 >=1 public price, +1 >=3 public prices. Jobber also cited at $49/mo for residential flatwork (https://projul.com/blog/best-concrete-contractor-software/) but no dedicated concrete landing URL captured. IBISWorld 93,960 businesses (https://www.ibisworld.com/united-states/number-of-businesses/concrete-contractors/200/).

**Evidence URLs (13):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Projul (projul.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Projul&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=projul.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Projul
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - ScopeTakeoff (scopetakeoff.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ScopeTakeoff&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=scopetakeoff.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ScopeTakeoff

---

## 14. Plumbing contractors  (NAICS 238220)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 3/5.
- **Provisional evidence score:** 7 (fragmentation 3, headcount bonus 2, 5 search-verified tools, 2 with public price + URL; 3 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 2/3 — Dispatch, permits, flat-rate quoting, water-heater warranties.
- **US establishments:** 129000 (2026, https://www.simprogroup.com/blog/plumbing-industry-statistics-2026); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 3/5. Check signer: owner-operator (derived: siccode 1,028,117 employees / 88,738 NAICS 238220 companies ≈ 11.6 per firm — derived ratio, not reported). Public-price incumbents: 5. Gatekeeper found: unverified (Mr. Rooter / Benjamin Franklin search blocked by budget). Top-4 share: unverified. Notes: +1 owner-operator (derived, weak), +1 public price, +1 >=3 public prices. Concentration and gatekeeper unverified.

**Evidence URLs (13):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Business Genie (businessgenieapp.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Business%20Genie&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=businessgenieapp.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Business%20Genie
  - FieldPulse (fieldpulse.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=FieldPulse&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldpulse.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=FieldPulse
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - ServiceTitan (servicetitan.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceTitan&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicetitan.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceTitan
  - TurboBid (turbobid.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=TurboBid&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=turbobid.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=TurboBid

---

## 15. Residential roofing contractors  (NAICS 238160)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 3/5.
- **Provisional evidence score:** 7 (fragmentation 3, headcount bonus 2, 6 search-verified tools, 1 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Storm-chasing estimates, insurance supplements, crew scheduling.
- **US establishments:** 108,598 businesses (IBISWorld Roofing Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/roofing-contractors/198); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> . Residential roofing contractors (238160)
> - Core jobs: satellite roof measurement to proposal (Roofr, RoofSnap), sales pipeline/CRM and insurance-claim tracking (AccuLynx, JobNimbus), production scheduling and material ordering, e-sign contracts (Leap), payments/financing.
> - Wedge: hardest niche to enter (five funded/acquired incumbents, three with public pricing). A narrow agent for insurance-supplement writing or storm-lead follow-up is the only plausible gap; not recommended as a primary target.
> - Weakest evidence: AccuLynx/JobNimbus prices come from third-party guides, not vendor pages; Roofr headcount conflicts (193 vs 135); no top-4 share.

**The agent version** [hypothesis]: Storm lead → roof measured from aerial imagery → estimate → insurance supplement package assembled (photos, Xactimate-style line items) → job scheduled → invoice. Needs: aerial measurement, photo intake, PDF assembly, calendar.

**Wedge** [hypothesis]: Insurance-supplement assembly agent for residential roofers.

**Price ceiling:** incumbent public prices found [search-cited]:
  - RoofSnap: $52/user/mo annual (Enterprise, 10-user min); $105/user/mo monthly; $13 per measurement pay-as-you-go (https://roofsnap.com/pricing/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 3/5. Check signer: owner-operator / sales manager at $2-6M roofers; per-user pricing means owner signs. Public-price incumbents: 3. Gatekeeper found: not searched (session search budget exhausted). Top-4 share: unverified. Notes: +1 owner-operator, +1 >=1 public price, +1 >=3 public prices. Roofing is the most software-saturated niche in this batch (AccuLynx/JobNimbus/Roofr/Leap/RoofSnap + ServiceTitan). Manufacturer certification programs (e.g., GAF/Owens Corning contractor tiers) may steer tooling - not searched. IBISWorld counts 108,598 businesses (https://www.ibisworld.com/united-states/number-of-businesses/roofing-contractors/198) but no top-4 share snippet.

**Evidence URLs (19):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - AccuLynx (acculynx.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=AccuLynx&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=acculynx.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=AccuLynx
  - JobNimbus (jobnimbus.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=JobNimbus&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=jobnimbus.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=JobNimbus
  - Leap (leaptodigital.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Leap&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=leaptodigital.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Leap
  - RoofSnap (roofsnap.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=RoofSnap&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=roofsnap.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=RoofSnap
  - Roofr (roofr.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Roofr&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=roofr.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Roofr
  - ServiceTitan (servicetitan.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceTitan&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicetitan.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceTitan

---

## 16. Low-voltage, alarm & security camera installers  (NAICS 238210)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 3/5.
- **Provisional evidence score:** 7 (fragmentation 3, headcount bonus 2, 6 search-verified tools, 1 with public price + URL; 1 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Permits, monitoring contracts, recurring inspection paperwork.
- **US establishments:** 87,086 (IBISWorld Security System Services businesses); 55,951 (NAICS 238210 companies verified active, siccode) (2026 / n.d., https://www.ibisworld.com/united-states/number-of-businesses/security-system-services/1491/ ; https://siccode.com/naics-code/238210/electrical-contractors-wiring-installation-contractors); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Low-voltage, alarm & security camera installers (238210)
> - Core jobs: lead/quote with equipment line items, install scheduling/dispatch, eAgreements, RMR (monitoring) billing, central-station and Alarm.com integrations (SecurityTrax, WorkHorse SCS, SuretyPRO/AlarmBase/CESware per list posts).
> - Wedge: RMR billing and monitoring integrations are the moat and hard to replace; the agent wedge is the front end - quote packages, permits, install-day coordination and customer onboarding - for camera/low-voltage shops that do not sell monitoring and are over-served by dealer platforms with $250/mo floors.
> - Weakest link: SecurityTrax is owned by Alarm.com (possible channel gatekeeper); SuretyPRO/AlarmBase/CESware domains and pricing were never retrieved.

**The agent version** [hypothesis]: Install lead → permit and alarm-registration filings with the municipality → recurring inspection reminders and reports → monitoring contract renewals. Needs: municipal portals, PDF forms, SMS, calendar.

**Wedge** [hypothesis]: Alarm permit/registration filing agent for small low-voltage installers.

**Price ceiling:** incumbent public prices found [search-cited]:
  - SecurityTrax: $250 minimum monthly charge (usage-based) - https://www.securitytrax.com/pricing (https://www.securitytrax.com/pricing)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 3/5. Check signer: owner-operator (alarm dealers); RMR billing and central-station integrations drive choice. Public-price incumbents: 1. Gatekeeper found: unverified (search budget exhausted before this check). Top-4 share: low concentration; largest is ADT (share not given). Notes: Score: +1 owner-operator, +1 public price (SecurityTrax), +1 low concentration. Possible gatekeeper: Alarm.com owns SecurityTrax and dealer programs (ADT/Alarm.com) may steer software - not verified.

**Evidence URLs (12):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - FieldForce Tracker (fieldforcetracker.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=FieldForce%20Tracker&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldforcetracker.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=FieldForce%20Tracker
  - ReachOut Suite (reachoutsuite.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ReachOut%20Suite&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=reachoutsuite.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ReachOut%20Suite
  - Repair-CRM (repair-crm.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Repair-CRM&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=repair-crm.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Repair-CRM
  - SecurityTrax (securitytrax.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=SecurityTrax&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=securitytrax.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=SecurityTrax
  - ServiceTitan (servicetitan.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceTitan&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicetitan.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceTitan
  - WorkHorse SCS (workhorsescs.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=WorkHorse%20SCS&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=workhorsescs.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=WorkHorse%20SCS

---

## 17. Fence contractors  (NAICS 238990)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 6 (fragmentation 2, headcount bonus 2, 3 search-verified tools, 2 with public price + URL; 1 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Linear-foot quoting, HOA/permit paperwork, install crews.
- **US establishments:** 315,213 businesses (IBISWorld Fence Construction in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/fence-construction/2022); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> . Fence contractors (238990)
> - Core jobs: per-linear-foot estimating with material-kit takeoffs and satellite property measurement, quote portal/e-sign, scheduling, invoicing, material inventory (QuoteIQ, FenceCloud, Visual Fence Pro).
> - Wedge: an estimate-and-material-list agent from a parcel address plus a photo of the yard, priced per linear foot, feeding a supplier order. FenceCloud's distributor tie (Merchants Metals) suggests distributors could be a channel.
> - Weakest evidence: FenceCloud price is $220 in one roundup and $99 in another; ProDBX and Visual Fence Pro have no verified data; IBISWorld's 315k businesses is mostly non-employers.

**The agent version** [hypothesis]: Linear-foot quote from a property-line sketch → HOA/permit application drafted → material order list → install date → invoice. Needs: measurement, permit templates, supplier ordering, calendar.

**Wedge** [hypothesis]: HOA/permit paperwork and quote agent for fence installers.

**Price ceiling:** incumbent public prices found [search-cited]:
  - FenceCloud: $220+/mo (one roundup says from ~$99/mo) (https://fence.cloud/pricing)
  - QuoteIQ: $29.99/mo (5 tiers to $399.99/mo per Feb-2026 update; older pages cite Max tier $699/mo) (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (solo to 15-crew shops per QuoteIQ positioning). Public-price incumbents: 2. Gatekeeper found: partial: fence distributor Merchants Metals co-markets FenceCloud as 'CFS e-Pricing' (channel influence, not a mandate). Top-4 share: unverified. Notes: +1 owner-operator, +1 >=1 public price. Distributor-linked estimator (FenceCloud/Merchants Metals) is a mild gatekeeper signal so no 'no gatekeeper' point. IBISWorld 315,213 businesses (https://www.ibisworld.com/united-states/number-of-businesses/fence-construction/2022) implies extreme fragmentation but no explicit 'highly fragmented' snippet captured.

**Evidence URLs (11):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - FenceCloud (fence.cloud): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=FenceCloud&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fence.cloud | LinkedIn https://www.linkedin.com/ad-library/search?keyword=FenceCloud
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - Visual Fence Pro (visualfencepro.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Visual%20Fence%20Pro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=visualfencepro.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Visual%20Fence%20Pro

---

## 18. Gutter installation & cleaning contractors  (NAICS 238170)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 6 (fragmentation 2, headcount bonus 2, 4 search-verified tools, 2 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Seasonal route work, linear-foot quotes, ladder crews.
- **US establishments:** 4,929 businesses (IBISWorld Gutter Services in the US) (2025, https://www.ibisworld.com/industry-statistics/number-of-businesses/gutter-services-united-states/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> . Gutter installation & cleaning contractors (238170)
> - Core jobs: satellite roofline linear-foot measurement and bid generation (GutterCalc Pro, ArcSite, RoofSnap gutter reports), recurring-cleaning billing and route optimization, gutter-guard financing (QuoteIQ).
> - Wedge: measurement-to-bid is already commoditized; the gap is recurring-cleaning retention: an agent that re-quotes, reminds, reschedules and collects for seasonal cleanings.
> - Weakest evidence: GutterCalc Pro's flat rate amount never surfaced; ArcSite has no verified data; only 4 tools found and IBISWorld's 4,929 count likely undercounts (many gutter firms sit under roofing/siding).

**The agent version** [hypothesis]: Linear-foot quote from satellite roofline → seasonal cleaning route rebooking → invoice. Needs: measurement, SMS, calendar.

**Wedge** [hypothesis]: Seasonal gutter-cleaning rebooking agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  - RoofSnap: $52-$78/user/mo annual; $105/user/mo monthly; gutter reports $11-$15 each (https://roofsnap.com/pricing/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~2 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (2 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (per-linear-foot bidders; recurring cleaning routes). Public-price incumbents: 2. Gatekeeper found: not searched (session search budget exhausted). Top-4 share: unverified. Notes: +1 owner-operator, +1 >=1 public price. GutterCalc Pro advertises a flat rate but the amount was not in snippets; ArcSite pricing unverified. Gutter-guard franchisors (LeafFilter dealer model) not searched. IBISWorld 4,929 businesses (https://www.ibisworld.com/industry-statistics/number-of-businesses/gutter-services-united-states/).

**Evidence URLs (11):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - ArcSite (arcsite.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ArcSite&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=arcsite.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ArcSite
  - GutterCalc Pro (guttercalc.net): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=GutterCalc%20Pro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=guttercalc.net | LinkedIn https://www.linkedin.com/ad-library/search?keyword=GutterCalc%20Pro
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - RoofSnap (roofsnap.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=RoofSnap&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=roofsnap.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=RoofSnap

---

## 19. Christmas & holiday light installers  (NAICS 561730)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 6 (fragmentation 2, headcount bonus 2, 4 search-verified tools, 2 with public price + URL; 1 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Seasonal quoting, install/takedown scheduling, storage.
- **US establishments:** 16041 (2024, https://homeservicebase.com/christmas-light-business); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

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
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (seasonal add-on for landscapers/pressure washers). Public-price incumbents: 2. Gatekeeper found: association present (CLIPA, 8,000+ members) - endorsed software unverified. Top-4 share: unverified. Notes: Score: +1 owner, +1 public price (Strandr $197/yr; QuoteIQ), +0 (<3 public prices verified; JingleCRM/Tinsel pricing not surfaced), +0 gatekeeper unverified, +0 concentration unverified. Installers reportedly run a small stack (CRM + design mockup tool) rather than one platform.

**Evidence URLs (9):**
  - https://homeservicebase.com/christmas-light-business
  - https://jinglecrm.com/
  - https://myquoteiq.com/best-crm-for-christmas-lighting/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://www.strandr.com/blog/christmas-light-installation-pricing-2025-market-analysis
  - https://www.grantsoutdoor.com/christmas-light-society/2026/1/30/top-5-christmas-light-software-tools-installers-actually-use
  - https://www.tinselcrm.com/

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - JingleCRM (jinglecrm.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=JingleCRM&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=jinglecrm.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=JingleCRM
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - Strandr (strandr.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Strandr&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=strandr.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Strandr
  - Tinsel CRM (tinselcrm.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Tinsel%20CRM&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=tinselcrm.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Tinsel%20CRM

---

## 20. Water well drilling contractors  (NAICS 237110)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 6 (fragmentation 2, headcount bonus 2, 4 search-verified tools, 1 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — State well logs, driller licensing, pump service call-backs.
- **US establishments:** 7,414 companies (entire NAICS 237110 Water and Sewer Line and Related Structures Construction; well drilling is a subset) (unverified, https://siccode.com/naics-code/237110/water-sewer-line-structures-construction); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> . Water well drilling contractors (237110)
> - Core jobs: quotes, field well logs (offline), state well-record e-filing, well map, pump service tracking, inventory, billing/AR (DrillerDB, WellMagic).
> - Wedge: state well-log completion and e-filing from a voice/photo capture at the rig, plus the customer-facing quote. DrillerDB (founded 2024, tiny team, $99-$799/mo) proves the buyer exists; WellMagic is a legacy incumbent with no public price.
> - Weakest evidence: establishment count is the whole NAICS 237110 (7,414), not well drillers; only 4 tools found and two (IKOL, WellMagic) have no pricing or company data.

**The agent version** [hypothesis]: Well-permit application to the state → drill log / well completion report filed → pump service reminders → invoice. Needs: state well portals, form templates, SMS.

**Wedge** [hypothesis]: State well-log and permit filing agent for drillers.

**Price ceiling:** incumbent public prices found [search-cited]:
  - DrillerDB: $99/mo (range $99-$799/mo) (https://drillerdb.com/pricing)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (family drilling contractors; DrillerDB tiers from $99/mo). Public-price incumbents: 2. Gatekeeper found: not searched (session search budget exhausted). Top-4 share: unverified. Notes: +1 owner-operator, +1 >=1 public price. State well-log e-filing requirements are a de facto compliance gate that DrillerDB and WellMagic both target (https://drillerdb.com/features; https://www.wellmagic.net/about-us) - not a software mandate. NGWA endorsement not searched.

**Evidence URLs (9):**
  - https://siccode.com/naics-code/237110/water-sewer-line-structures-construction
  - https://drillerdb.com/
  - https://drillerdb.com/pricing
  - https://growjo.com/company/DrillerDB
  - https://www.crunchbase.com/organization/drillerdb
  - https://g2.com/sellers/drillerdb
  - https://ikol.com/industry-well-drilling
  - https://www.getjobber.com/industries/well-water-services/
  - https://www.wellmagic.net/about-us

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - DrillerDB (drillerdb.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=DrillerDB&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=drillerdb.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=DrillerDB
  - IKOL (ikol.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=IKOL&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=ikol.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=IKOL
  - Jobber (getjobber.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Jobber&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=getjobber.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Jobber
  - WellMagic (wellmagic.net): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=WellMagic&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=wellmagic.net | LinkedIn https://www.linkedin.com/ad-library/search?keyword=WellMagic

---

## 21. Garage door installers & repair  (NAICS 238290)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 6 (fragmentation 2, headcount bonus 2, 7 search-verified tools, 1 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Service calls, spring/opener parts, warranty paperwork.
- **US establishments:** 299 businesses (IBISWorld Garage Door Installation in the US) - IBISWorld definition appears narrow (2025, https://www.ibisworld.com/industry-statistics/number-of-businesses/garage-door-installation-united-states/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> . Garage door installers & repair (238290)
> - Core jobs: same-day emergency dispatch, technician GPS and skill-based assignment, door/opener serial history on the work order, flat-rate pricing libraries, on-site payment (ServiceBridge, Smart Service, Workiz, FieldPulse, ServiceTitan).
> - Wedge: no vertical SaaS exists; every incumbent is a horizontal FSM with a landing page. An inbound-call-to-booked-job agent that quotes spring/opener repairs from a flat-rate book and books the tech is the opening.
> - Weakest evidence: IBISWorld's 299-business count and "high concentration" claim clearly describe a narrow definition and conflict with the long tail of local shops; no vendor pricing beyond QuoteIQ/Jobber; no headcounts.

**The agent version** [hypothesis]: Service-call intake → part identified from photo (spring/opener) → quote → schedule → warranty claim to manufacturer → invoice. Needs: phone/SMS, parts catalog, OEM warranty portals.

**Wedge** [hypothesis]: Warranty-claim and quote agent for garage door service.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (dispatch-driven local shops; enterprise tier only for 20+ tech operations). Public-price incumbents: 2. Gatekeeper found: not searched (session search budget exhausted). Top-4 share: IBISWorld: 'high market share concentration'; largest business Sanwa Holdings (manufacturer/dealer network). Notes: +1 owner-operator, +1 >=1 public price. No vertical (garage-door-only) SaaS found; all incumbents are horizontal FSMs with landing pages (ServiceBridge, Workiz, Smart Service, FieldPulse, Jobber, ServiceTitan). IBISWorld's 299-business count and 'high concentration' note conflict with the visible long tail of local repair shops; manufacturer dealer programs (Clopay, Overhead Door) not searched.

**Evidence URLs (13):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - FieldPulse (fieldpulse.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=FieldPulse&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldpulse.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=FieldPulse
  - Jobber (getjobber.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Jobber&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=getjobber.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Jobber
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - ServiceBridge (servicebridge.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceBridge&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicebridge.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceBridge
  - ServiceTitan (servicetitan.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceTitan&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicetitan.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceTitan
  - Smart Service (smartservice.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Smart%20Service&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=smartservice.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Smart%20Service
  - Workiz (workiz.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Workiz&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=workiz.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Workiz

---

## 22. Insulation & spray foam contractors  (NAICS 238310)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 6 (fragmentation 2, headcount bonus 2, 4 search-verified tools, 1 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — R-value quoting, utility rebate forms, energy-code compliance.
- **US establishments:** 19,339 businesses (NAICS 238310 Drywall and Insulation Contractors, Census) (2020, https://naicslist.com/naics/238310); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> . Insulation & spray foam contractors (238310)
> - Core jobs: board-feet / coverage / A-B chemical cost estimating, Good/Better/Best R-value proposals, on-site quoting, crew dispatch by certification, asset tracking, QuickBooks (FieldGroove, Allpro Insulator, FieldCamp, QuoteIQ).
> - Wedge: an attic-measurement-to-tiered-estimate agent (satellite footprint plus R-value tiers) with chemical usage forecasting; the two vertical incumbents are quote-gated and FieldGroove is listed at $495/user/mo, leaving room below.
> - Weakest evidence: FieldGroove price is a competitor blog quoting Capterra; Allpro has no price or headcount; NAICS 238310 mixes drywall.

**The agent version** [hypothesis]: R-value/sq ft quote → utility rebate forms completed and submitted → energy-code compliance certificate → invoice. Needs: rebate program forms, quoting rules, PDF.

**Wedge** [hypothesis]: Utility-rebate paperwork agent for insulation contractors.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (residential/light-commercial spray foam & batt installers). Public-price incumbents: 2. Gatekeeper found: not searched (session search budget exhausted). Top-4 share: unverified. Notes: +1 owner-operator, +1 >=1 public price. FieldGroove ($495/user/mo per Capterra) and Allpro Insulator are quote-gated. Spray-foam chemical suppliers / SPFA certification not searched as gatekeepers. NAICS 238310 Census 2020: 19,339 businesses (https://naicslist.com/naics/238310).

**Evidence URLs (13):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Allpro Insulator (allprotechnology.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Allpro%20Insulator&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=allprotechnology.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Allpro%20Insulator
  - FieldCamp (fieldcamp.ai): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=FieldCamp&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldcamp.ai | LinkedIn https://www.linkedin.com/ad-library/search?keyword=FieldCamp
  - FieldGroove (fieldgroove.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=FieldGroove&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldgroove.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=FieldGroove
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ

---

## 23. Excavation & grading contractors  (NAICS 238910)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 6 (fragmentation 2, headcount bonus 2, 3 search-verified tools, 1 with public price + URL; 2 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — 811 locates, equipment hours, dirt hauling tickets.
- **US establishments:** 235,812 businesses (IBISWorld Excavation Contractors in the US) (2026, https://www.ibisworld.com/united-states/number-of-businesses/excavation-contractors/206/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> . Excavation & grading contractors (238910)
> - Core jobs: cut/fill volume takeoff from plans (EarthWorks, AGTEK), heavy-civil bid assembly (HCSS HeavyBid), aerial measurement and quoting for small residential jobs (QuoteIQ), job costing (Knowify).
> - Wedge: small residential/site-prep excavators are served only by generic FSM or heavy-civil takeoff tools; an agent that turns a site plan or drone/satellite image into a cut/fill estimate and haul-truck count at EarthWorks' $100/mo price point is the gap.
> - Weakest evidence: EarthWorks price is from an ITQlick comparison; HCSS, AGTEK, Knowify have no verified pricing/headcount in results; NAICS 238910 count is shared with septic.

**The agent version** [hypothesis]: Site quote from plans → 811 locate tickets → equipment-hour tracking → haul tickets reconciled → invoice. Needs: 811 portal, SMS from operators, invoicing.

**Wedge** [hypothesis]: 811-locate and haul-ticket reconciliation agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator for residential/site-prep excavators; estimator/PM for heavy-civil (HCSS buyers). Public-price incumbents: 2. Gatekeeper found: not searched (session search budget exhausted). Top-4 share: unverified. Notes: +1 owner-operator, +1 >=1 public price. HCSS HeavyBid and AGTEK are quote-gated and aimed at heavy-civil; small residential excavators are under-served. IBISWorld 235,812 businesses (https://www.ibisworld.com/united-states/number-of-businesses/excavation-contractors/206/).

**Evidence URLs (10):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - EarthWorks Excavation Software (Tally Systems) (earthworksos.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=EarthWorks%20Excavation%20Software%20%28Tally%20Systems%29&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=earthworksos.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=EarthWorks%20Excavation%20Software%20%28Tally%20Systems%29
  - HCSS HeavyBid (hcss.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=HCSS%20HeavyBid&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=hcss.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=HCSS%20HeavyBid
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ

---

## 24. Fire sprinkler contractors  (NAICS 238220)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 6 (fragmentation 2, headcount bonus 2, 5 search-verified tools, 1 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — NFPA 25 inspection reports, AHJ submittals, backflow/hydrostatic tests.
- **US establishments:** 19,845 (IBISWorld Fire Protection & Security System Installation Contractors) (2025, https://www.ibisworld.com/united-states/number-of-businesses/security-system-services/1491/ (result set) ; https://www.ibisworld.com/united-states/industry/fire-protection-and-security-system-installation-contractors/6486/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Fire sprinkler contractors (238220)
> - Core jobs: recurring NFPA 25 inspection scheduling (quarterly/annual), mobile inspection checklists tied to assets, deficiency -> quote -> work order handoff, invoicing (Inspect Point, Uptick, Essential, ServiceTrade, BuildOps).
> - Wedge: deficiency-to-quote follow-up and AHJ/customer report distribution are document-heavy and rules-based; an agent could sit on top of any inspection tool and chase deficiencies to sold repairs. Also a "compliance calendar" agent for small shops that cannot justify per-user seats.
> - Weakest link: incumbents are well-funded (Inspect Point $28M Mainsail; Uptick backed by PSG; ServiceTrade 1,300+ customers) and no self-serve price exists, so the buyer is used to sales-led purchases; the sprinkler-only establishment count is unknown (IBISWorld 19,845 covers fire+security installers).

**The agent version** [hypothesis]: NFPA 25 inspection schedule per building → inspector reports converted to AHJ-format submittals → deficiency quotes → renewal. Needs: inspection form templates, AHJ portals/email, quoting rules.

**Wedge** [hypothesis]: NFPA 25 report-to-AHJ submittal agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - ServiceTrade: $99-$149 per user (technician) per month per third-party summary; office users free - https://fieldservicesoftware.io/best-field-service-software/best-software-for-security-fire-protection-field-service-companies/ ; https://softwarefinder.com/field-service/servicetrade (https://new.servicetrade.com/pricing/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~6 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (6 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator / operations manager (IBISWorld: 90% of Uptick reviewers small companies); larger sprinkler firms buy via ops leadership. Public-price incumbents: 0. Gatekeeper found: unverified (search budget exhausted before this check). Top-4 share: <5% for any single company ('highly fragmented'). Notes: Score: +1 owner-operator, +1 fragmented. NFPA 25 compliance forms are the compliance anchor; incumbents are VC/PE-backed (Inspect Point/Mainsail, Uptick/PSG).

**Evidence URLs (17):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - BuildOps (buildops.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=BuildOps&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=buildops.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=BuildOps
  - Essential (withessential.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Essential&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=withessential.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Essential
  - Inspect Point (inspectpoint.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Inspect%20Point&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=inspectpoint.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Inspect%20Point
  - ServiceTrade (servicetrade.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceTrade&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicetrade.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceTrade
  - Uptick (uptickhq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Uptick&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=uptickhq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Uptick

---

## 25. HVAC contractors  (NAICS 238220)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 4/5.
- **Provisional evidence score:** 6 (fragmentation 4, headcount bonus 0, 7 search-verified tools, 1 with public price + URL; 1 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 2/3 — Maintenance agreements, dispatch, EPA/permit paperwork.
- **US establishments:** 120461 (2026, https://www.ibisworld.com/united-states/number-of-businesses/heating-air-conditioning-contractors/1945/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> HVAC contractors
> - Core jobs: dispatch to nearest tech, maintenance-agreement renewals, flat-rate pricing, invoicing with QuickBooks sync (FieldEdge, Successware, Aptora), inventory, and Manual J load calcs for equipment quotes (Cool Calc, AutoHVAC, Wrightsoft).
> - Market is the most fragmented in the batch by evidence: 120,461 firms, largest player <2% share, ~70% of firms under 10 employees. But PE roll-ups are active (DealSeam tracker), and the horizontals price publicly ($49-149/mo).
> - Agent wedge: maintenance-agreement renewal and seasonal tune-up booking, or a Manual J/quote agent that turns a site visit's photos and square footage into a load calc and equipment proposal (current DIY tools run $39-233/mo and are described as taking hours to learn).
> - Weakest evidence: FieldEdge/Successware/Aptora pricing, headcount, and ownership went unverified; franchise software mandates (One Hour, etc.) not checked.

**The agent version** [hypothesis]: Maintenance-agreement renewals and tune-up scheduling → permit pulls → EPA 608 refrigerant log → invoice. Needs: SMS, permit portals, calendar, log templates.

**Wedge** [hypothesis]: Maintenance-agreement renewal and permit agent for small HVAC shops.

**Price ceiling:** incumbent public prices found [search-cited]:
  - AutoHVAC: first Manual J free (per page title) (https://autohvac.ai/manual-j-cost)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 4/5. Check signer: owner-operator ('about 70% of the firms are independents with fewer than 10 employees'). Public-price incumbents: 4. Gatekeeper found: unverified (franchise search not run — budget exhausted). Top-4 share: largest single player under 2% share (IBISWorld 2026 via withorbital); IBISWorld: low concentration, largest = Emcor Group. Notes: +1 owner-operator (withorbital URL), +1 public price, +1 >=3 public prices, +1 'highly fragmented'/largest <2%. Gatekeeper unverified. PE roll-up activity noted: https://dealseam.com/hvac-pe-rollup-tracker-2026

**Evidence URLs (11):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Aptora Total Office Manager (aptora.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Aptora%20Total%20Office%20Manager&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=aptora.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Aptora%20Total%20Office%20Manager
  - AutoHVAC (autohvac.ai): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=AutoHVAC&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=autohvac.ai | LinkedIn https://www.linkedin.com/ad-library/search?keyword=AutoHVAC
  - FieldEdge (fieldedge.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=FieldEdge&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldedge.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=FieldEdge
  - Housecall Pro (housecallpro.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Housecall%20Pro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=housecallpro.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Housecall%20Pro
  - Repair-CRM (repair-crm.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Repair-CRM&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=repair-crm.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Repair-CRM
  - Successware (successware.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Successware&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=successware.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Successware
  - Workiz (workiz.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Workiz&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=workiz.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Workiz

---

## 26. Chimney sweeps & chimney repair  (NAICS 561790)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 5 (fragmentation 2, headcount bonus 2, 2 search-verified tools, 1 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Level-2 inspection reports, seasonal routes, CSIA paperwork.
- **US establishments:** 6313 (2024, https://www.ibisworld.com/united-states/market-research-reports/fireplace-services-industry/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Chimney sweeps & chimney repair
> - Core jobs: Level 1/2/3 inspection pricing and documentation (CSIA tiers), photo-based inspection reports for liner/cap work, annual sweep reminders (12-month recurrence), Oct-Feb seasonal capacity planning, invoicing.
> - Incumbents: no chimney-specific vertical SaaS surfaced; ServiceTitan (dedicated landing), QuoteIQ (SEO pages, $29.99), Housecall Pro and Jobber (mentioned without dedicated landing URLs).
> - Agent wedge: inspection-report and annual-recall agent - assembles the photo-documented Level 1/2 report from tech inputs, sends it to the homeowner and (for real estate transactions) the agent/buyer, and books the following year's sweep. The report itself is a compliance artifact incumbents treat as a generic photo attachment.
> - Weakest evidence: only 2 tools with verified niche landing pages (fails the 3-tool bar); IBISWorld Fireplace Services count (6,313) is a shrinking proxy category; whether CSIA or NCSG endorse any software is unverified.

**The agent version** [hypothesis]: Seasonal sweep rebooking → Level-2 inspection report drafted from tech photos/notes → repair quote → invoice. Needs: SMS, report template, photo intake.

**Wedge** [hypothesis]: Level-2 inspection report agent for chimney sweeps.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo Essentials (1 user); Elite $299; Max $699 per https://contractortoolstack.com/software/quoteiq/pricing/ (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~3 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (3 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (small sweep companies; CSIA-certified techs). Public-price incumbents: 1. Gatekeeper found: CSIA certification/inspection levels referenced; software mandate unverified. Top-4 share: unverified. Notes: Score: +1 owner, +1 public price (QuoteIQ only), +0 (<3), +0 gatekeeper unverified, +0 concentration unverified. No chimney-specific vertical SaaS surfaced; horizontal FSMs (ServiceTitan, Housecall Pro, Jobber) plus QuoteIQ SEO pages dominate results.

**Evidence URLs (7):**
  - https://www.ibisworld.com/united-states/market-research-reports/fireplace-services-industry/
  - https://myquoteiq.com/top-8-softwares-for-chimney-sweep-businesses-in-2026/
  - https://myquoteiq.com/pricing/
  - https://www.crunchbase.com/organization/quoteiq
  - https://myquoteiq.com/about-us/
  - https://www.servicetitan.com/industries/chimney-sweep-software
  - https://www.cleansavannah.com/post/best-chimney-sweep-software-2026

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - ServiceTitan (servicetitan.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceTitan&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicetitan.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceTitan

---

## 27. Septic system installers  (NAICS 238910)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 4 (fragmentation 2, headcount bonus 0, 7 search-verified tools, 2 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Digging and permitting tanks; county health-dept permits and as-built drawings.
- **US establishments:** 38,839 establishments (38,433 businesses); septic installers are a subset of NAICS 238910 Site Preparation Contractors (2020, https://naicslist.com/naics/238910); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> . Septic system installers (238910)
> - Core jobs: dispatch pump trucks, recurring service-interval scheduling and routing by neighborhood, trip tickets / DOT manifests / jurisdiction compliance paperwork, same-day invoicing, QuickBooks sync (ServiceCore, PumpDocket, Smart Service, Bella FSM). SepticPro adds county permit data and site plans for installers.
> - Wedge: an agent that pulls county permit requirements, drafts the site-plan/permit packet and the compliance trip ticket per jurisdiction, then schedules the pumping reminder. Installers are under-served; most tools are pumping-centric.
> - Weakest evidence: no installer-only establishment count (NAICS 238910 mixes excavation, demolition and septic); PumpDocket price attribution within the result set is uncertain; no vendor headcounts beyond ServiceCore (163, VC-backed).

**The agent version** [hypothesis]: County health-department permit application → as-built drawing package → inspection scheduling → invoice. Needs: county portals/forms, drawing template, calendar.

**Wedge** [hypothesis]: County septic permit and as-built paperwork agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - PumpDocket: $99/mo (1-3 trucks Starter); $230/mo 4-10 trucks; $454/mo 11+ trucks (https://www.pumpdocket.com/septic-software)
  - ServiceCore: $200/mo per truck (third-party listing; vendor requires demo) (https://servicecore.com/pricing/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~5 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (5 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (small pumping/installation firms; vendors price per truck, 1-3 truck starter tiers). Public-price incumbents: 2. Gatekeeper found: not searched (session search budget exhausted). Top-4 share: unverified. Notes: +1 owner-operator, +1 >=1 public price. ServiceCore price ($200/mo per truck) only via third-party listing and demo-gated. Gatekeeper (state onsite-wastewater associations / county permit portals) and concentration not searched. Max attainable here was 3.

**Evidence URLs (14):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Bella FSM (bellafsm.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Bella%20FSM&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=bellafsm.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Bella%20FSM
  - PumpDocket (pumpdocket.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=PumpDocket&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=pumpdocket.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=PumpDocket
  - PumperPro (pumperpro.app): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=PumperPro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=pumperpro.app | LinkedIn https://www.linkedin.com/ad-library/search?keyword=PumperPro
  - SepticPro (septicprotools.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=SepticPro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=septicprotools.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=SepticPro
  - ServiceCore (servicecore.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceCore&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicecore.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceCore
  - ServiceTitan (servicetitan.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceTitan&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicetitan.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceTitan
  - Smart Service (smartservice.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Smart%20Service&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=smartservice.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Smart%20Service

---

## 28. Commercial janitorial companies  (NAICS 561720)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 3 (fragmentation 2, headcount bonus 0, 2 search-verified tools, 1 with public price + URL; 5 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Bid walkthroughs, night-shift scheduling, inspection checklists.
- **US establishments:** 1264367 (2026, https://www.ibisworld.com/united-states/number-of-businesses/janitorial-services/1496/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Commercial janitorial companies
> - Core jobs: bidding/estimating from walk-throughs (CleanGuru, Janitorial Manager, SweepOps "ISSA-standard bidding"), mobile inspections with photo proof-of-work, GPS/location clock-ins for distributed multilingual crews (Swept), recurring contract billing, client QC reporting (CleanTelligent/Otuvy), enterprise ERP (WinTeam, Aspire).
> - Two self-published price points: QuoteIQ $29.99/mo, SweepOps $20-$99/mo. Swept "from $30/mo" appeared only in an unattributed summary.
> - Agent wedge: bid-generation agent (square footage + frequency + ISSA production rates -> costed proposal) and inspection-report agent that turns crew photos into client-ready QC reports; both are the "before and after the cleaning" jobs incumbents monetize.
> - Weakest link: IBISWorld's 1,264,367 "janitorial services" count clearly includes non-employer solo operators; the siccode 28,445 active-company figure is closer to the real buyer pool but undated. Franchisor gatekeepers (Jan-Pro, Coverall) unverified.

**The agent version** [hypothesis]: Bid walkthrough notes → proposal with sq ft and frequency pricing → night-shift schedule → inspection checklist results to client → invoice. Needs: quoting rules, SMS, checklist template.

**Wedge** [hypothesis]: Bid-to-proposal agent for small janitorial companies.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/mo (https://myquoteiq.com/top-8-softwares-for-janitorial-businesses-in-2026/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~4 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (4 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator for small contractors; facilities/procurement for large accounts (WinTeam/Aspire target $5M+ / 100+ employee firms). Public-price incumbents: 2. Gatekeeper found: unverified. Top-4 share: unverified. Notes: +1 owner-operator, +1 public price (QuoteIQ $29.99/mo, SweepOps $20-$99/mo, both self-published). Swept 'from $30/mo' mentioned in a result summary but page unattributed. ISSA is the trade association (referenced via SweepOps 'ISSA-standard bidding'); endorsed-software search not run. Franchisors (Jan-Pro, Coverall, Vanguard) possible gatekeepers: unverified.

**Evidence URLs (4):**
  - https://www.ibisworld.com/united-states/number-of-businesses/janitorial-services/1496/
  - https://www.janitorialmanager.com/work-management-system/janitorial-bidding-software/
  - https://myquoteiq.com/top-8-softwares-for-janitorial-businesses-in-2026/
  - https://sweepops.app/resources/best/best-janitorial-bidding-software/

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Janitorial Manager (janitorialmanager.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Janitorial%20Manager&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=janitorialmanager.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Janitorial%20Manager
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ

---

## 29. Pool builders  (NAICS 238990)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 3 (fragmentation 2, headcount bonus 0, 6 search-verified tools, 0 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Permit sets, subcontractor sequencing, change orders.
- **US establishments:** 22,731 (IBISWorld Swimming Pool Construction businesses) (2026, https://www.ibisworld.com/industry-statistics/number-of-businesses/swimming-pool-construction-united-states/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Pool builders (238990)
> - Core jobs: lead pipeline with milestone stages, estimating/proposals, phase-based construction scheduling across subs, change orders, punch lists, warranties, customer texting (Poologics, ProDBX, 123worx, Houzz Pro).
> - Wedge: sub-trade sequencing and homeowner status updates during a multi-week build; an agent that reads the schedule and keeps subs and homeowners informed would cut the coordinator role. 22,731 businesses (IBISWorld 2026) growing 4.2%/yr.
> - Weakest link: no pricing, founding or headcount data captured for any pool-specific vendor; concentration unverified.

**The agent version** [hypothesis]: Permit set assembly → subcontractor sequencing calendar → change-order documentation → draw requests. Needs: permit portals, calendar, PDF.

**Wedge** [hypothesis]: Permit-set and sub-sequencing agent for pool builders.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~5 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (pool builders). Public-price incumbents: 1. Gatekeeper found: unverified (search budget exhausted before this check). Top-4 share: unverified. Notes: Score: +1 owner-operator, +1 public price (horizontal QuoteIQ only; Poologics/ProDBX pricing not found). Franchise check (e.g. pool-builder franchisors) not run.

**Evidence URLs (8):**
  - https://www.ibisworld.com/industry-statistics/number-of-businesses/swimming-pool-construction-united-states/
  - https://123worx.com/blog/project-management-software-for-pool-builders/
  - https://pro.houzz.com/for-pros/software-pool-builder-crm
  - https://www.poologics.com/
  - https://prodbx.com/software/pool-contractor-software/
  - https://myquoteiq.com/top-8-softwares-for-pool-installation-businesses-in-2026/
  - https://streamlinecrm.com/pool-construction-software/
  - https://myquoteiq.com/top-10-best-job-management-software-for-hardscaping-contractors-in-2026/

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - 123worx (123worx.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=123worx&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=123worx.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=123worx
  - Houzz Pro (houzz.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Houzz%20Pro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=houzz.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Houzz%20Pro
  - Poologics (poologics.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Poologics&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=poologics.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Poologics
  - ProDBX (prodbx.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ProDBX&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=prodbx.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ProDBX
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - Streamline CRM (streamlinecrm.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Streamline%20CRM&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=streamlinecrm.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Streamline%20CRM

---

## 30. Foundation repair & basement waterproofing contractors  (NAICS 238190)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 3 (fragmentation 2, headcount bonus 0, 3 search-verified tools, 0 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Engineer letters, lifetime-warranty transfers, financing paperwork.
- **US establishments:** 6,106 establishments (NAICS 238190, Census 2020); 48,569 employees (2020) (2020, https://naicslist.com/naics/238190); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Foundation repair & basement waterproofing (238190)
> - Core jobs: lead intake, in-home estimating with photos, production scheduling, job costing, payments (Builder Prime, Contractor Accelerator, QuoteIQ).
> - Wedge: this is a one-call-close, in-home-sales trade; an agent that pre-qualifies leads, schedules inspections and generates the proposal package from the inspector's photos/notes is the obvious fit.
> - Weakest link: only 3 tools found (one horizontal); manufacturer dealer networks may dictate CRM and were not checked; 6,106 establishments (2020) is a broad NAICS proxy.

**The agent version** [hypothesis]: Inspection photos → repair proposal → engineer letter request → warranty transfer paperwork → financing application. Needs: photo intake, proposal template, email.

**Wedge** [hypothesis]: Proposal and warranty-transfer paperwork agent.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~4 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (foundation repair / waterproofing contractors). Public-price incumbents: 1. Gatekeeper found: unverified (search budget exhausted before this check). Top-4 share: unverified. Notes: Score: +1 owner-operator, +1 public price. Dealer networks (e.g. manufacturer-affiliated dealer programs) may dictate software - not checked. Only 3 tools found.

**Evidence URLs (5):**
  - https://naicslist.com/naics/238190
  - https://www.builderprime.com/industries/basements-waterproofing
  - https://contractoraccelerator.com/industries/foundation-repair
  - https://myquoteiq.com/industries/foundation-repair-software/
  - https://myquoteiq.com/top-10-best-job-management-software-for-hardscaping-contractors-in-2026/

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Builder Prime (builderprime.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Builder%20Prime&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=builderprime.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Builder%20Prime
  - Contractor Accelerator (contractoraccelerator.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Contractor%20Accelerator&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=contractoraccelerator.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Contractor%20Accelerator
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ

---

## 31. Flooring & tile contractors  (NAICS 238330)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 3 (fragmentation 2, headcount bonus 0, 9 search-verified tools, 0 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Square-foot quotes, material takeoffs, install scheduling.
- **US establishments:** 13,108 companies verified active (siccode); 77,869 employees (n.d., https://siccode.com/naics-code/238330/flooring-contractors); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Flooring & tile contractors (238330)
> - Core jobs: takeoff/measurement from plans, material estimating by sq ft, bids, install scheduling around other trades, crew tracking, job costing (Measure Square, Floorzap, FloorSoft, ProjectsForce, FieldGroove).
> - Wedge: takeoff-to-bid automation for small contract flooring shops and install-day scheduling for retailer-dependent installers; Projul/QuoteIQ show sub-$30-$400/mo price points are accepted.
> - Weakest link: none of the vertical vendors' pricing, age or size was captured; RFMS/QFloors (retail ERPs) were never researched; tile (238340) was not covered.

**The agent version** [hypothesis]: Room measurements → material takeoff and quote → supplier order → install scheduling → invoice. Needs: quoting rules, supplier portals, calendar.

**Wedge** [hypothesis]: Takeoff-and-quote agent for flooring installers.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~3 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (flooring contractors/installers; retailers for some tools). Public-price incumbents: 2. Gatekeeper found: unverified (search budget exhausted before this check). Top-4 share: unverified. Notes: Score: +1 owner-operator, +1 public price. Vertical incumbents (Measure Square, Floorzap, FloorSoft, ProjectsForce, RFMS/QFloors) pricing not retrieved.

**Evidence URLs (11):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Builder Prime (builderprime.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Builder%20Prime&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=builderprime.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Builder%20Prime
  - FieldGroove (fieldgroove.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=FieldGroove&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldgroove.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=FieldGroove
  - FloorSoft (floorsoft.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=FloorSoft&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=floorsoft.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=FloorSoft
  - Floorzap (floorzap.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Floorzap&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=floorzap.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Floorzap
  - Measure Square (measuresquare.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Measure%20Square&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=measuresquare.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Measure%20Square
  - ProjectsForce 360 (projectsforce.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ProjectsForce%20360&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=projectsforce.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ProjectsForce%20360
  - Projul (projul.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Projul&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=projul.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Projul
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - WorkQuote (workquote.app): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=WorkQuote&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=workquote.app | LinkedIn https://www.linkedin.com/ad-library/search?keyword=WorkQuote

---

## 32. Deck & patio builders  (NAICS 236118)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 3 (fragmentation 2, headcount bonus 0, 5 search-verified tools, 0 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Permit drawings, material takeoffs, seasonal backlog.
- **US establishments:** unverified (search budget exhausted before this check) — unverified; share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Deck & patio builders (236118)
> - Core jobs: lead tracking, board-level material estimating with tiered lumber/composite pricing, weather-aware scheduling, permits/inspections, deposit-to-final invoicing (Projul, Builder Prime, JobNimbus, Houzz Pro, QuoteIQ landing pages).
> - Wedge: no deck-only vertical SaaS surfaced - every tool is a horizontal with a landing page - which suggests the niche is served by generic CRMs and open to a purpose-built agent (estimate + permit paperwork + homeowner updates).
> - Weakest link: establishment count not retrieved; franchisors (deck-building franchises) not checked.

**The agent version** [hypothesis]: Deck design brief → permit drawing package → material list → schedule. Needs: permit portals, drawing template.

**Wedge** [hypothesis]: Deck permit-package agent.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~3 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (deck builders). Public-price incumbents: 2. Gatekeeper found: unverified (search budget exhausted before this check). Top-4 share: unverified. Notes: Score: +1 owner-operator, +1 public price. No deck-only vertical SaaS surfaced; all tools are horizontals with deck landing pages. Franchisor check (e.g. deck-building franchises) not run.

**Evidence URLs (6):**
  - https://www.builderprime.com/industries/decks-railings
  - https://pro.houzz.com/for-pros/software-deck-builder-crm
  - https://www.jobnimbus.com/industries/deck-and-patio-software
  - https://projul.com/industries/deck-builders/
  - https://myquoteiq.com/industries/deck-building-software/
  - https://myquoteiq.com/top-10-best-job-management-software-for-hardscaping-contractors-in-2026/

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Builder Prime (builderprime.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Builder%20Prime&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=builderprime.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Builder%20Prime
  - Houzz Pro (houzz.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Houzz%20Pro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=houzz.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Houzz%20Pro
  - JobNimbus (jobnimbus.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=JobNimbus&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=jobnimbus.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=JobNimbus
  - Projul (projul.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Projul&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=projul.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Projul
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ

---

## 33. Hardscape & retaining wall contractors  (NAICS 238140)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 3 (fragmentation 2, headcount bonus 0, 5 search-verified tools, 0 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Design/quote, material tonnage, weather scheduling.
- **US establishments:** unverified (search budget exhausted before this check) — unverified; share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Hardscape & retaining wall contractors (238140)
> - Core jobs: line-item estimating for pavers/base/sand/edging/drainage/labor, aerial takeoff, proposals with eSign, crew scheduling, job costing (Eano, ScapeCubed spreadsheets, Outdoor Estimates, Projul, QuoteIQ; Aspire for $1M+ commercial).
> - Wedge: estimating is still done in spreadsheets (ScapeCubed sells production-rate spreadsheets), so an estimating agent with a production-rate library is a direct replacement.
> - Weakest link: establishment count and concentration not retrieved; Eano company details unknown.

**The agent version** [hypothesis]: Design/quote from photos and dimensions → material tonnage order → weather schedule → invoice. Needs: quoting rules, supplier ordering, weather API.

**Wedge** [hypothesis]: Quote-and-material-order agent for hardscapers.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~3 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (hardscape/landscape contractors). Public-price incumbents: 2. Gatekeeper found: unverified (search budget exhausted before this check). Top-4 share: unverified. Notes: Score: +1 owner-operator, +1 public price. Eano pricing not found; ScapeCubed sells spreadsheets.

**Evidence URLs (6):**
  - https://www.eano.com/industry/hardscape
  - https://outdoorestimates.com/pages/landscape-estimating-software.html
  - https://projul.com/industries/hardscaper-business/
  - https://myquoteiq.com/top-10-best-job-management-software-for-hardscaping-contractors-in-2026/
  - https://www.scapecubed.com/
  - https://projul.com/industries/deck-builders/

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Eano (eano.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Eano&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=eano.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Eano
  - Outdoor Estimates (outdoorestimates.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Outdoor%20Estimates&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=outdoorestimates.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Outdoor%20Estimates
  - Projul (projul.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Projul&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=projul.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Projul
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - ScapeCubed (scapecubed.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ScapeCubed&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=scapecubed.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ScapeCubed

---

## 34. Residential cleaning & maid services  (NAICS 561720)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 3 (fragmentation 2, headcount bonus 0, 7 search-verified tools, 0 with public price + URL; 1 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Recurring scheduling, cleaner assignment, quotes by sq ft.
- **US establishments:** 356516 (2024, https://www.ibisworld.com/united-states/number-of-businesses/residential-cleaning-services/6542/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Residential cleaning & maid services
> - Core jobs users log in for (from snippets): recurring appointment scheduling, crew dispatch, online booking widgets embedded on the owner's site (Zenbooker), customer reminders, invoicing/payments, payroll (MaidEasy), kiosk/employee communication (MaidCentral).
> - Vertical tools are plentiful (ZenMaid, MaidCentral, MaidEasy, Zenbooker, The Cleaning Software, CleansyAI) plus horizontal Housecall Pro/Jobber/QuoteIQ landing pages; only QuoteIQ's $29.99/mo appeared in a result (its own listicle).
> - Agent wedge: an inbound-lead-to-booked-recurring-clean agent (quote from photos/sq ft, book, remind, reschedule, chase no-shows) for owners with 1-5 cleaners; the incumbents still require the owner to configure schedules by hand.
> - Weakest link: no pricing pages, headcounts or ad evidence captured; 356,516 IBISWorld count is an industry definition that includes solo cleaners, so serviceable market is much smaller.

**The agent version** [hypothesis]: Inbound quote by sq ft/rooms → recurring schedule → cleaner assignment texts → payment collection → rebooking on cancellations. Needs: SMS, calendar, payments.

**Wedge** [hypothesis]: Quote-book-collect agent for solo/small maid services.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~3 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (small maid-service owners; ZenMaid markets to '3,000+ maid service owners'). Public-price incumbents: 1. Gatekeeper found: unverified. Top-4 share: unverified. Notes: +1 owner-operator, +1 one incumbent (QuoteIQ $29.99/mo) with a public price via its own listicle. Gatekeeper and concentration searches not run (budget exhausted). Franchisors (Molly Maid, Merry Maids, The Cleaning Authority) may dictate software: unverified.

**Evidence URLs (9):**
  - https://www.ibisworld.com/united-states/number-of-businesses/residential-cleaning-services/6542/
  - https://cleansyai.com/blog/best-maid-service-software
  - https://www.housecallpro.com/industries/maid-service-software/
  - https://maidcentral.com/
  - https://maideasysoftware.com/
  - https://thecleaningsoftware.com/
  - https://get.zenmaid.com/
  - https://zenbooker.com/residential-cleaning-online-booking.html
  - https://myquoteiq.com/top-8-softwares-for-maid-services-in-2026/

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - CleansyAI (cleansyai.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=CleansyAI&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=cleansyai.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=CleansyAI
  - Housecall Pro (housecallpro.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Housecall%20Pro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=housecallpro.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Housecall%20Pro
  - MaidCentral (maidcentral.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=MaidCentral&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=maidcentral.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=MaidCentral
  - MaidEasy (maideasysoftware.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=MaidEasy&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=maideasysoftware.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=MaidEasy
  - The Cleaning Software (thecleaningsoftware.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=The%20Cleaning%20Software&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=thecleaningsoftware.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=The%20Cleaning%20Software
  - ZenMaid (zenmaid.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ZenMaid&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=zenmaid.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ZenMaid
  - Zenbooker (zenbooker.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Zenbooker&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=zenbooker.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Zenbooker

---

## 35. Handyman services  (NAICS 236118)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 1/5.
- **Provisional evidence score:** 2 (fragmentation 1, headcount bonus 0, 1 search-verified tools, 1 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Small-job quoting, scheduling, parts runs.
- **US establishments:** 528883 (2026, https://www.ibisworld.com/united-states/number-of-businesses/handyman-services/4069/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Handyman services
> - 528,883 firms (IBISWorld 2026) - by far the largest count in the batch and almost certainly one-person shops. Only QuoteIQ surfaced with a handyman mention; no dedicated handyman vertical tool found before the budget ran out. Fewer than 3 tools.
> - Agent wedge (hypothesis only): lead-to-quote-to-schedule from text/photo, since the owner is also the tech.
> - Weakest evidence: no tool research; franchise (e.g. Kaminskiy Care & Repair, Mr. Handyman) software mandates unchecked.

**The agent version** [hypothesis]: Job description + photos → small-job quote → schedule → parts list → invoice. Needs: SMS, calendar, invoicing.

**Wedge** [hypothesis]: Small-job quoting and scheduling agent.

**Price ceiling:** incumbent public prices found [search-cited]:
  - QuoteIQ: $29.99/month (https://myquoteiq.com/pricing/)
  Plus the owner's admin labor still spent inside the tool. Assumption, not measured: ~2 hrs/week. Ceiling ≈ cheapest cited incumbent tier + (2 hrs/wk × the operator's admin hourly cost). Verify hours in customer interviews before pricing.

**Fragmentation (Step 4):** score 1/5. Check signer: owner-operator (528,883 businesses; derived avg ≈ $691K revenue each from IBISWorld market size). Public-price incumbents: 0. Gatekeeper found: unverified (not searched). Top-4 share: unverified. Notes: +1 owner-operator only (https://www.ibisworld.com/united-states/number-of-businesses/handyman-services/4069/). No niche-specific tool with public price found before budget exhaustion. Franchise presence noted (Kaminskiy Care & Repair: https://franchise.careandrepair.com/home-improvement-franchise-growth-trends/) but software mandate not researched.

**Evidence URLs (3):**
  - https://www.ibisworld.com/united-states/number-of-businesses/handyman-services/4069/
  - https://myquoteiq.com/pricing/
  - https://www.capterra.com/p/10030635/QuoteIQ/

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ

---

## 36. Glass & glazing contractors  (NAICS 238150)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 1/5.
- **Provisional evidence score:** 2 (fragmentation 1, headcount bonus 0, 4 search-verified tools, 0 with public price + URL; 1 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Measure, order, install cycles; commercial storefront bids.
- **US establishments:** 1,317 companies verified active (siccode); 60,592 employees (n.d., https://siccode.com/naics-code/238150/glass-glazing-contractors); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Glass & glazing contractors (238150)
> - Core jobs: glass-specific quoting (sq-ft calcs, material imports), POS and shop management, scheduling, inventory, invoicing (GlasPacLX/GTS, GlassManager, Smart Glazier, Accentis).
> - Wedge: quote turnaround for custom flat glass (shower doors, storefront) where each quote needs measurements and material lookup; an agent building quotes from a photo/measurement sheet fits small shops on generic tools.
> - Weakest link: establishment count (siccode 1,317) is implausibly low vs its own employee figure; no vendor details captured; auto-glass insurer networks may be a gatekeeper (unverified).

**The agent version** [hypothesis]: Measure/order/install cycle tracking → supplier orders → install appointment. Needs: supplier portals, calendar.

**Wedge** [hypothesis]: Order-tracking and install-scheduling agent for glaziers.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~3 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 1/5. Check signer: owner-operator (glass shops); auto-glass side has insurer/network billing gatekeepers (not verified). Public-price incumbents: 0. Gatekeeper found: unverified (search budget exhausted before this check). Top-4 share: unverified. Notes: Score: +1 owner-operator. Glass vertical incumbents (GTS/GlasPacLX, GlassManager, Smart Glazier) pricing not retrieved.

**Evidence URLs (5):**
  - https://siccode.com/naics-code/238150/glass-glazing-contractors
  - https://www.fieldpulse.com/resources/blog/glass-business-software
  - https://www.gtsservices.com/
  - https://glassmanager.com/
  - https://smartglazier.com/en/

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - FieldPulse (fieldpulse.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=FieldPulse&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldpulse.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=FieldPulse
  - GlasPacLX (GTS Services) (gtsservices.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=GlasPacLX%20%28GTS%20Services%29&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=gtsservices.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=GlasPacLX%20%28GTS%20Services%29
  - GlassManager (glassmanager.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=GlassManager&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=glassmanager.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=GlassManager
  - Smart Glazier Software (smartglazier.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Smart%20Glazier%20Software&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=smartglazier.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Smart%20Glazier%20Software

---

## 37. Window treatment (blinds & shades) installers  (NAICS 238390)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 1/5.
- **Provisional evidence score:** 2 (fragmentation 1, headcount bonus 0, 6 search-verified tools, 0 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — In-home measure, vendor orders, install appointments.
- **US establishments:** unverified (search budget exhausted before this check) — unverified; share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Window treatment installers (238390)
> - Core jobs: measure-to-quote with product/option pricing, quote-to-order conversion with manufacturers, install scheduling, CRM (BlindsBook, BlindMatrix, Windowware Pro, Blinds Portal, MyBlindCo).
> - Wedge: order-entry to manufacturers and measurement-driven quoting are the repetitive tasks; an agent that turns a measure sheet into supplier orders and a customer quote replaces the dealer software seat for independents.
> - Weakest link: nothing verified beyond vendor existence; window-covering franchise systems are a likely gatekeeper (franchisor-mandated software) and were not checked; establishment count not retrieved.

**The agent version** [hypothesis]: In-home measure capture → vendor purchase order → install appointment → invoice. Needs: vendor order portals, calendar.

**Wedge** [hypothesis]: Vendor-order and install appointment agent.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~2 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 1/5. Check signer: owner-operator (window covering dealers/installers); franchise systems likely relevant (not verified). Public-price incumbents: 0. Gatekeeper found: unverified (search budget exhausted before this check). Top-4 share: unverified. Notes: Score: +1 owner-operator. Franchisor-dictated software (window-covering franchises) is a plausible gatekeeper but unchecked.

**Evidence URLs (6):**
  - https://blindmatrix.com/
  - https://www.blindsportal.com/
  - https://www.blindsbook.com/
  - https://myblindcoapp.com/
  - https://www.repair-crm.com/window-blinds-shades-business-software/
  - https://www.windowwarepro.com/

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - BlindMatrix (blindmatrix.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=BlindMatrix&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=blindmatrix.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=BlindMatrix
  - Blinds Portal (blindsportal.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Blinds%20Portal&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=blindsportal.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Blinds%20Portal
  - BlindsBook (blindsbook.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=BlindsBook&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=blindsbook.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=BlindsBook
  - MyBlindCo (myblindcoapp.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=MyBlindCo&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myblindcoapp.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=MyBlindCo
  - Repair-CRM (repair-crm.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Repair-CRM&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=repair-crm.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Repair-CRM
  - Windowware Pro (windowwarepro.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Windowware%20Pro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=windowwarepro.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Windowware%20Pro

---

## 38. Carpet & upholstery cleaning  (NAICS 561740)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 1/5.
- **Provisional evidence score:** 2 (fragmentation 1, headcount bonus 0, 8 search-verified tools, 0 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Room-count quoting, route scheduling, reminders.
- **US establishments:** 41611 (2026, https://www.ibisworld.com/united-states/number-of-businesses/carpet-cleaning/1498/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Carpet & upholstery cleaning
> - Core jobs: job booking, quoting, technician assignment, invoicing/payments, marketing/reminders for repeat cleanings (ServiceMonster claims >75% client retention), tips/payout tracking (Fieldd).
> - Eight tools with dedicated carpet landing pages found (ServiceMonster, ScheduleDrop, ServGrow, ManageMart, Fieldd, GorillaDesk, Housecall Pro, Jobber); ServiceMonster is the 20-year vertical incumbent.
> - Agent wedge: reactivation/repeat-booking agent (12-month re-clean cadence outreach + instant quote) for solo truck-mount operators; retention is the metric incumbents already sell on.
> - Weakest link: zero prices captured despite most of these tools publishing them; franchisor influence (Chem-Dry, Stanley Steemer) unverified.

**The agent version** [hypothesis]: Room-count quote → route slot → reminders → invoice → 6-month rebook. Needs: SMS, calendar, payments.

**Wedge** [hypothesis]: Rebooking agent for carpet cleaners.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~2 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 1/5. Check signer: owner-operator (solo/small truck-mount operators). Public-price incumbents: 0. Gatekeeper found: unverified. Top-4 share: unverified. Notes: +1 owner-operator only. Jobber/Housecall Pro/GorillaDesk have carpet landing pages but their prices did not appear in results. Franchisors (Chem-Dry, Stanley Steemer) possible gatekeepers: unverified. IICRC certification body: not searched.

**Evidence URLs (9):**
  - https://www.ibisworld.com/united-states/number-of-businesses/carpet-cleaning/1498/
  - https://fieldd.co/industries/carpet-cleaning-software
  - https://gorilladesk.com/industries/carpet-cleaning-software/
  - https://www.housecallpro.com/industries/carpet-cleaning-software/
  - https://www.getjobber.com/industries/carpet-cleaning-software/
  - https://www.managemart.com/carpet-cleaning-software
  - https://scheduledrop.com/carpet-cleaning
  - https://www.servgrow.com/carpet-cleaning-software
  - https://www.servicemonster.com/carpet-cleaning-software

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Fieldd (fieldd.co): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Fieldd&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldd.co | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Fieldd
  - GorillaDesk (gorilladesk.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=GorillaDesk&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=gorilladesk.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=GorillaDesk
  - Housecall Pro (housecallpro.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Housecall%20Pro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=housecallpro.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Housecall%20Pro
  - Jobber (getjobber.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Jobber&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=getjobber.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Jobber
  - ManageMart (managemart.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ManageMart&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=managemart.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ManageMart
  - ScheduleDrop (scheduledrop.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ScheduleDrop&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=scheduledrop.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ScheduleDrop
  - ServGrow (servgrow.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServGrow&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servgrow.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServGrow
  - ServiceMonster (servicemonster.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=ServiceMonster&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=servicemonster.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=ServiceMonster

---

## 39. Pest control operators  (NAICS 561710)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 2/5.
- **Provisional evidence score:** 2 (fragmentation 2, headcount bonus 0, 1 search-verified tools, 0 with public price + URL; 3 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Recurring service routes, pesticide-use records, state reporting.
- **US establishments:** 33197 (2025, https://www.ibisworld.com/united-states/number-of-businesses/pest-control/1495/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Pest control operators
> - Core jobs (inferred from vertical tools' positioning; not from snippets this session): route optimization, recurring service agreements, chemical/regulatory application records, technician mobile app, autopay.
> - IBISWorld: 33,197 businesses (2025), 34,076 (2026). Sunair 10-K (FY2007) describes ~20,000 firms, highly fragmented, top five ~30% of revenue.
> - Only Briostack surfaced in a result; PestPac and FieldRoutes are from prior knowledge. Both major incumbents are owned by consolidators (WorkWave, ServiceTitan) and are contact-sales, which leaves a self-serve gap for 1-3 truck operators.
> - Agent wedge: missed-call/lead-response plus recurring-agreement renewal agent for small PCOs; compliance-record drafting from technician voice notes.
> - Weakest link: no tool details verified; concentration source is a 2008 SEC filing.

**The agent version** [hypothesis]: Recurring service routes → state pesticide-use records auto-generated from tech texts → renewals. Needs: SMS, state record templates, route calendar.

**Wedge** [hypothesis]: Pesticide-use recordkeeping agent for small PCOs.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~4 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 2/5. Check signer: owner-operator (majority of ~33k firms); corporate procurement at Rollins/Rentokil/Anticimex consolidators. Public-price incumbents: 0. Gatekeeper found: unverified. Top-4 share: top 5 ~30% of revenues; top 100 ~50% (pest control, dated FY2007 SEC filing). Notes: +1 owner-operator, +1 'highly fragmented' with URL (Sunair Services 10-K, FY2007: ~20,000 firms, top five ~30% of revenues). No incumbent public price surfaced. NPMA association / franchisors: not searched.

**Evidence URLs (3):**
  - https://www.ibisworld.com/united-states/number-of-businesses/pest-control/1495/
  - https://www.briostack.com/blog/pest-control-industry-statistics
  - https://www.sec.gov/Archives/edgar/data/0000095366/000095014408000224/g11232ke10vk.htm

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Briostack (briostack.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Briostack&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=briostack.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Briostack

---

## 40. Mold, asbestos & lead abatement contractors  (NAICS 562910)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 1/5.
- **Provisional evidence score:** 2 (fragmentation 1, headcount bonus 0, 8 search-verified tools, 0 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Notifications to state, air-clearance reports, disposal manifests.
- **US establishments:** 5576 (2020, https://siccode.com/naics-code/562910/remediation-services); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Mold, asbestos & lead abatement contractors (562910)
> - Establishments: 5,576 locations / 4,546 firms / 85,937 employees for all of NAICS 562910 (2020 Census via siccode.com); abatement-only share not found.
> - Core jobs users log in for (from vendor snippets): estimates and quoting, scheduling with SMS crew deployment and timesheets (FieldFlo), photo/GPS job documentation and containment/clearance tracking (Xcelerate, DocuSketch, QuoteIQ), invoicing, compliance and safety records, routing and payments (Vev), CRM/pipeline (Deelo).
> - Only public price seen: QuoteIQ flat tiers from $29.99/mo to $699/mo, no per-user fees (vendor co-founder blog, mikevidan.com).
> - Agent wedge: the compliance paperwork stack (abatement notifications, air-clearance documentation, waste manifests, worker cert tracking) that FieldFlo sells as its differentiator is document-assembly work an agent can do from photos and job data; second wedge is quote follow-up automation, which QuoteIQ already markets as a feature.
> - Weakest evidence: no headcount, funding, review counts, ad-library presence, gatekeeper, or concentration data retrieved for any tool; the QuoteIQ price is from an affiliated blog rather than a pricing page.

**The agent version** [hypothesis]: State notification filings before abatement → air-clearance report assembly → disposal manifest tracking → invoice. Needs: state portals/forms, lab-report intake, PDF.

**Wedge** [hypothesis]: State abatement notification and clearance-report agent.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~6 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 1/5. Check signer: owner-operator (inferred from vendor copy 'built by contractors for contractors' at https://fieldflo.com/; not independently verified). Public-price incumbents: 1. Gatekeeper found: unverified (not searched). Top-4 share: unverified. Notes: Score counts only +1 for one incumbent with a public price. Owner-operator, gatekeeper, and concentration criteria could not be searched (budget exhausted); treat score as a floor.

**Evidence URLs (10):**
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

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - Cinderblock (cinderblock.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Cinderblock&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=cinderblock.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Cinderblock
  - Deelo (deelo.ai): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Deelo&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=deelo.ai | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Deelo
  - DocuSketch (docusketch.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=DocuSketch&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=docusketch.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=DocuSketch
  - FieldFlo (fieldflo.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=FieldFlo&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=fieldflo.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=FieldFlo
  - OctopusPro (octopuspro.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=OctopusPro&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=octopuspro.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=OctopusPro
  - QuoteIQ (myquoteiq.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=QuoteIQ&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=myquoteiq.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=QuoteIQ
  - Vev (vev.co): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Vev&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=vev.co | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Vev
  - Xcelerate (XL Restoration Software) (xlrestorationsoftware.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Xcelerate&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=xlrestorationsoftware.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=Xcelerate

---

## 41. Roll-off dumpster rental  (NAICS 562111)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 1/5.
- **Provisional evidence score:** 1 (fragmentation 1, headcount bonus 0, 1 search-verified tools, 0 with public price + URL; 3 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Container tracking, drop/pickup scheduling, tonnage billing.
- **US establishments:** 351 (2025, https://www.ibisworld.com/united-states/number-of-businesses/dumpster-rental/5837/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Roll-off dumpster rental
> - IBISWorld counts only 351 businesses (2025) in its narrow definition, which conflicts with the visible long tail of independent haulers; NAICS 562111 is dominated by WM/Republic. Bin There Dump That is a franchisor.
> - CurbWaste surfaced with a dumpster-rental profitability page; Docket, DRS, ServiceCore from prior knowledge.
> - Core jobs (inferred): online ordering, delivery/pickup dispatch, asset (can) tracking, overage/tonnage billing.
> - Agent wedge: inbound ordering + delivery/pickup scheduling agent tied to can inventory; small haulers still take orders by phone.
> - Weakest link: establishment count is contradictory; tool pricing unverified.

**The agent version** [hypothesis]: Drop/pickup scheduling → container tracking → tonnage billing reconciliation from landfill tickets. Needs: SMS, ticket OCR, invoicing.

**Wedge** [hypothesis]: Landfill-ticket reconciliation and billing agent.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~4 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 1/5. Check signer: owner-operator (independent haulers) with municipal/contractor procurement for large accounts; Bin There Dump That franchise. Public-price incumbents: 0. Gatekeeper found: possible (franchise). Top-4 share: unverified. Notes: +1 owner-operator. IBISWorld counts only 351 businesses in its narrow definition (WM/Republic dominate hauling but roll-off rental is served by many small independents - unverified). No public price surfaced.

**Evidence URLs (3):**
  - https://www.ibisworld.com/united-states/number-of-businesses/dumpster-rental/5837/
  - https://www.curbwaste.com/dumpster-rental-business-profitability
  - https://bintheredumpthatfranchise.com/blog/dumpster-rental-industry-is-right-for-you/

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - CurbWaste (curbwaste.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=CurbWaste&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=curbwaste.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=CurbWaste

---

## 42. Portable toilet rental  (NAICS 562991)

- **Status:** search-evidenced candidate. Research: searched (partial: search budget exhausted mid-batch).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 1/5.
- **Provisional evidence score:** 1 (fragmentation 1, headcount bonus 0, 1 search-verified tools, 0 with public price + URL; 2 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Unit tracking, weekly service routes, event orders.
- **US establishments:** 3489 (2025, https://www.ibisworld.com/united-states/number-of-businesses/portable-toilet-rental/4716/); share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [search-cited where a URL is given; agent-written summary of result snippets]

> Portable toilet rental
> - IBISWorld 3,489 businesses (2025), 3.6%/yr growth; combined with septic 5,586.
> - CurbWaste surfaced with a portable-toilet profitability page; ServiceCore/Docket from prior knowledge.
> - Core jobs (inferred): weekly service routing, unit inventory, event quoting, recurring billing.
> - Agent wedge: event/construction quote + weekly service-route confirmation agent; PSAI association influence unverified.
> - Weakest link: no tool details or pricing captured.

**The agent version** [hypothesis]: Weekly service routes → event orders → unit tracking → invoicing. Needs: route calendar, SMS, invoicing.

**Wedge** [hypothesis]: Route and event-order agent for portable toilet operators.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~3 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 1/5. Check signer: owner-operator (3,489 businesses; construction/event customers). Public-price incumbents: 0. Gatekeeper found: unverified. Top-4 share: unverified. Notes: +1 owner-operator. PSAI (Portable Sanitation Association International) is the trade association - not searched. No public price surfaced.

**Evidence URLs (2):**
  - https://www.ibisworld.com/united-states/number-of-businesses/portable-toilet-rental/4716/
  - https://www.curbwaste.com/how-profitable-is-a-portable-toilet-business

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: see 'Weakest evidence' in the notes above.

**Audit checklist (run these to complete Step 3):**
  - CurbWaste (curbwaste.com): Meta https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=CurbWaste&search_type=keyword_unordered&media_type=all | Google https://adstransparency.google.com/?region=US&domain=curbwaste.com | LinkedIn https://www.linkedin.com/ad-library/search?keyword=CurbWaste

---

## 43. Backflow prevention testing companies  (NAICS 238220)

- **Status:** judgment pick (no search evidence). Research: not searched (session search budget exhausted before batch started).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 0/5.
- **Provisional evidence score:** 0 (fragmentation 0, headcount bonus 0, 0 search-verified tools, 0 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Annual test scheduling, water-purveyor report submission, gauge calibration.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [hypothesis — batch had no search budget]

> Backflow prevention testing companies (238220)
> - No searches run. Establishment count, tools, fragmentation all unverified.

**The agent version** [hypothesis]: Annual test due dates per device → customer scheduling by text → test results captured → report submitted to each water purveyor in its required format. Needs: purveyor portals/forms, SMS, calendar.

**Wedge** [hypothesis]: Backflow test-report submission agent.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~5 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 0/5. Check signer: unverified (not searched). Public-price incumbents: 0. Gatekeeper found: unverified (not searched). Top-4 share: unverified. Notes: unverified (not searched: session WebSearch budget exhausted after 7 calls)

**Evidence URLs (0):**
  - none collected

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: no incumbent, price, count or fragmentation evidence collected at all.

**Audit checklist (run these to complete Step 3):**
  - No search-verified tools yet; re-run Step 2 for this niche first (see dead_ends.md rerun plan), then audit.

---

## 44. Fire extinguisher & fire alarm inspection companies  (NAICS 561621)

- **Status:** judgment pick (no search evidence). Research: not searched (session search budget exhausted before batch started).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 0/5.
- **Provisional evidence score:** 0 (fragmentation 0, headcount bonus 0, 0 search-verified tools, 0 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Tag/inspection cycles, AHJ reports, deficiency quotes.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [hypothesis — batch had no search budget]

> Fire extinguisher & fire alarm inspection companies (561621)
> - No searches run. Establishment count, tools, fragmentation all unverified.

**The agent version** [hypothesis]: Tag/inspection cycles per site → inspection results captured → AHJ report filed → deficiency quotes. Needs: report templates, AHJ email/portals, quoting rules.

**Wedge** [hypothesis]: Inspection-report-to-AHJ filing agent.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~5 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 0/5. Check signer: unverified (not searched). Public-price incumbents: 0. Gatekeeper found: unverified (not searched). Top-4 share: unverified. Notes: unverified (not searched: session WebSearch budget exhausted after 7 calls)

**Evidence URLs (0):**
  - none collected

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: no incumbent, price, count or fragmentation evidence collected at all.

**Audit checklist (run these to complete Step 3):**
  - No search-verified tools yet; re-run Step 2 for this niche first (see dead_ends.md rerun plan), then audit.

---

## 45. DOT / trucking compliance consultants  (NAICS 541618)

- **Status:** judgment pick (no search evidence). Research: not searched (session search budget exhausted before batch started).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 0/5.
- **Provisional evidence score:** 0 (fragmentation 0, headcount bonus 0, 0 search-verified tools, 0 with public price + URL; 4 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Driver qualification files, drug-testing programs, audits.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [hypothesis — batch had no search budget]

> DOT / trucking compliance consultants (541618)
> - Likely login jobs: driver qualification files, drug & alcohol program tracking, IFTA/IRP, audit prep, ELD/HOS review.
> - Wedge hypothesis: DQ-file audit and expiration-chasing agent for small carriers/consultants.
> - Weakest link: candidates (J. J. Keller, Foley, Tenstreet, Fleetworthy) are large, not micro-SaaS; nothing verified.

**The agent version** [hypothesis]: Driver qualification file completeness checks → drug-testing program enrollment and random-pool tracking → audit-ready file packs. Needs: document intake, FMCSA Clearinghouse, email.

**Wedge** [hypothesis]: DQ-file compliance agent for small carriers (sold via consultants).

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~6 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 0/5. Check signer: unverified. Public-price incumbents: unverified. Gatekeeper found: unverified. Top-4 share: unverified. Notes: score 0 = no evidence gathered; WebSearch budget exhausted (200/200 session cap) before any batch07 search ran; no field verified

**Evidence URLs (0):**
  - none collected

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: no incumbent, price, count or fragmentation evidence collected at all.

**Audit checklist (run these to complete Step 3):**
  - No search-verified tools yet; re-run Step 2 for this niche first (see dead_ends.md rerun plan), then audit.

---

## 46. Notaries & loan signing agents  (NAICS 541120)

- **Status:** judgment pick (no search evidence). Research: not searched (session search budget exhausted before batch started).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = 0/5.
- **Provisional evidence score:** 0 (fragmentation 0, headcount bonus 0, 0 search-verified tools, 0 with public price + URL; 3 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Signing appointments, journals, invoicing signing services.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [hypothesis — batch had no search budget]

> Notaries & loan signing agents (541120)
> - Likely login jobs: signing-order intake (Snapdocs platform), journal, mileage/expense, invoicing to signing services.
> - Wedge hypothesis: invoicing/chasing-payment agent for signing agents; Snapdocs is a marketplace gatekeeper hypothesis to test.
> - Weakest link: nothing verified; solo-operator ACV likely very low.

**The agent version** [hypothesis]: Signing order intake → appointment confirmation → journal entry → invoice to signing service. Needs: email/SMS, calendar, invoicing.

**Wedge** [hypothesis]: Signing-order intake and invoicing agent for loan signing agents.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~3 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score 0/5. Check signer: unverified. Public-price incumbents: unverified. Gatekeeper found: unverified. Top-4 share: unverified. Notes: score 0 = no evidence gathered; WebSearch budget exhausted (200/200 session cap) before any batch07 search ran; no field verified

**Evidence URLs (0):**
  - none collected

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: no incumbent, price, count or fragmentation evidence collected at all.

**Audit checklist (run these to complete Step 3):**
  - No search-verified tools yet; re-run Step 2 for this niche first (see dead_ends.md rerun plan), then audit.

---

## 47. Small fleet trucking companies (1-20 trucks)  (NAICS 484121)

- **Status:** judgment pick (no search evidence). Research: not searched (session search budget exhausted before batch started).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = unverified (no search run; 0 of 5 components could be evidenced)/5.
- **Provisional evidence score:** 0 (fragmentation unverified (no search run; 0 of 5 components could be evidenced), headcount bonus 0, 0 search-verified tools, 0 with public price + URL; 5 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — IFTA, ELD logs, driver files, load paperwork.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [hypothesis — batch had no search budget]

> Small fleet trucking (484121)
> - Core jobs users log in for (recall): dispatch/load board, IFTA fuel-tax reporting, driver settlements, invoicing/factoring, DOT compliance docs (candidates: TruckingOffice, Truckbase, TruckLogics, Axon, Rose Rocket).
> - Agent wedge hypothesis: IFTA + settlement + invoice packet assembly from rate confirmations and ELD data for 1-10 truck fleets.
> - Weakest link: nothing verified; no establishment count, no pricing, no ad signal.

**The agent version** [hypothesis]: IFTA quarterly filing from ELD/fuel data → driver file expirations → load paperwork (rate cons, BOLs) collected and invoiced. Needs: ELD API, fuel-card data, state IFTA portals, email.

**Wedge** [hypothesis]: IFTA filing and driver-file expiration agent for 1-20 truck fleets.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~6 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score unverified (no search run; 0 of 5 components could be evidenced)/5. Check signer: owner-operator (model judgment, unsearched). Public-price incumbents: unverified. Gatekeeper found: unverified. Top-4 share: unverified. Notes: Step D not executed: WebSearch budget exhausted before batch started. check_signer is a model judgment, not evidence.

**Evidence URLs (0):**
  - none collected

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: no incumbent, price, count or fragmentation evidence collected at all.

**Audit checklist (run these to complete Step 3):**
  - No search-verified tools yet; re-run Step 2 for this niche first (see dead_ends.md rerun plan), then audit.

---

## 48. Non-emergency medical transportation providers  (NAICS 485991)

- **Status:** judgment pick (no search evidence). Research: not searched (session search budget exhausted before batch started).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = unverified (no search run; 0 of 5 components could be evidenced)/5.
- **Provisional evidence score:** 0 (fragmentation unverified (no search run; 0 of 5 components could be evidenced), headcount bonus 0, 0 search-verified tools, 0 with public price + URL; 6 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Trip scheduling, Medicaid broker billing, driver credentialing.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [hypothesis — batch had no search budget]

> NEMT providers (485991)
> - Core jobs (recall): broker trip import, scheduling/dispatch, driver app, Medicaid billing/claims, credentialing (RouteGenie, Tobi, Bambi, MediRoutes, TripSpark, NEMT Cloud Dispatch).
> - Agent wedge hypothesis: broker trip reconciliation and claim denial rework.
> - Weakest link: nothing verified; state Medicaid brokers may act as gatekeepers (unsearched).

**The agent version** [hypothesis]: Trip scheduling from broker portals → driver credential expirations → trip logs and Medicaid broker billing submitted. Needs: broker portals, SMS, billing templates.

**Wedge** [hypothesis]: Broker trip-intake and billing agent for NEMT providers.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~8 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score unverified (no search run; 0 of 5 components could be evidenced)/5. Check signer: owner-operator (model judgment, unsearched). Public-price incumbents: unverified. Gatekeeper found: unverified. Top-4 share: unverified. Notes: Step D not executed: WebSearch budget exhausted before batch started. check_signer is a model judgment, not evidence.

**Evidence URLs (0):**
  - none collected

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: no incumbent, price, count or fragmentation evidence collected at all.

**Audit checklist (run these to complete Step 3):**
  - No search-verified tools yet; re-run Step 2 for this niche first (see dead_ends.md rerun plan), then audit.

---

## 49. Home health & non-medical home care agencies  (NAICS 621610)

- **Status:** judgment pick (no search evidence). Research: not searched (session search budget exhausted before batch started).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = unverified/5.
- **Provisional evidence score:** 0 (fragmentation unverified, headcount bonus 0, 0 search-verified tools, 0 with public price + URL; 8 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — Caregiver scheduling, EVV, timesheets, Medicaid billing.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [hypothesis — batch had no search budget]

> Home health & non-medical home care agencies - NAICS 621610
> - Candidate incumbents (unverified): AlayaCare, WellSky Personal Care, Axxess, AxisCare, ShiftCare, Careswitch, HHAeXchange, Homecare Homebase. Core jobs (hypothesis): caregiver scheduling, EVV clock-in/out, care plans, family billing/private pay invoicing, payroll export, Medicaid claims.
> - Wedge hypothesis: shift-fill/open-shift calling agent; caregiver recruiting screening; EVV exception cleanup.
> - Weakest evidence: likely gatekeeper - state Medicaid EVV mandates (21st Century Cures Act) route agencies to state-selected aggregators; not verified by search in this batch. Also franchise systems (Home Instead, Right at Home, etc.) may dictate software.

**The agent version** [hypothesis]: Caregiver shift filling by text → EVV-compliant visit verification checks → timesheet-to-Medicaid billing. Needs: SMS, state EVV aggregator APIs, billing templates.

**Wedge** [hypothesis]: Open-shift filling and EVV exception agent for small home care agencies.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~8 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score unverified/5. Check signer: unverified. Public-price incumbents: unverified. Gatekeeper found: unverified. Top-4 share: unverified. Notes: No searches executed (session WebSearch budget exhausted before batch 14). See notes.md for knowledge-based, uncited hypotheses to verify on re-run.

**Evidence URLs (0):**
  - none collected

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: no incumbent, price, count or fragmentation evidence collected at all.

**Audit checklist (run these to complete Step 3):**
  - No search-verified tools yet; re-run Step 2 for this niche first (see dead_ends.md rerun plan), then audit.

---

## 50. CDL truck driving schools  (NAICS 611519)

- **Status:** judgment pick (no search evidence). Research: not searched (session search budget exhausted before batch started).
- **Method score (ad + fragmentation):** pending — ad score unverified; fragmentation = unverified/5.
- **Provisional evidence score:** 0 (fragmentation unverified, headcount bonus 0, 0 search-verified tools, 0 with public price + URL; 0 additional unverified candidate tools listed in tools.csv).
- **Boring test:** 3/3 — ELDT registry reporting, DOT physicals, student tracking.
- **US establishments:** unverified — unverified; share <20 employees: unverified.

**What the incumbent SaaS actually does / incumbents found / weakest evidence** [hypothesis — batch had no search budget]

> (no notes section)

**The agent version** [hypothesis]: Student enrollment → ELDT Training Provider Registry certification submission → DOT physical/permit tracking → attendance hours. Needs: TPR portal, document intake, SMS.

**Wedge** [hypothesis]: ELDT registry reporting agent for CDL schools.

**Price ceiling:** no incumbent price with a cited URL was captured — unverified. Labor assumption, not measured: ~5 hrs/week of admin inside whatever tool the operator uses.

**Fragmentation (Step 4):** score unverified/5. Check signer: unverified. Public-price incumbents: unverified. Gatekeeper found: unverified. Top-4 share: unverified. Notes: Not researched: WebSearch budget exhausted before batch 15 started

**Evidence URLs (0):**
  - none collected

**Confidence:** low. Weakest link: ad longevity (Meta/Google/LinkedIn) unverified for every tool. Second-weakest: no incumbent, price, count or fragmentation evidence collected at all.

**Audit checklist (run these to complete Step 3):**
  - No search-verified tools yet; re-run Step 2 for this niche first (see dead_ends.md rerun plan), then audit.

---
