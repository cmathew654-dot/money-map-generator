"""Build report.pdf (executive summary + TOC + ranked idea cards) from the research outputs.

Run from research/boring-niche-aaas-miner:  python3 scraper/build_report.py
Reads: ideas_ranked.md, niches.csv, tools.csv, ad_audit_scored.csv, dead_ends.md, README.md
Writes: report.pdf
"""
import csv
import collections
import datetime as dt
import pathlib
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table,
                                TableStyle)
from reportlab.platypus.tableofcontents import TableOfContents

D = pathlib.Path(__file__).resolve().parent.parent
OUT = D / "report.pdf"

# ---------- fonts (DejaVu has the arrows / >= glyphs the cards use) ----------
FD = pathlib.Path("/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("DV", str(FD / "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("DV-B", str(FD / "DejaVuSans-Bold.ttf")))
pdfmetrics.registerFontFamily("DV", normal="DV", bold="DV-B", italic="DV", boldItalic="DV-B")

INK = colors.HexColor("#1f2933")
MUTED = colors.HexColor("#616e7c")
ACCENT = colors.HexColor("#0b5d4b")
RULE = colors.HexColor("#cbd2d9")
BAND = colors.HexColor("#f0f4f8")
PASS = colors.HexColor("#e3f5ec")
WARN = colors.HexColor("#fff4e0")

ss = getSampleStyleSheet()
BODY = ParagraphStyle("body", parent=ss["Normal"], fontName="DV", fontSize=9.5, leading=13.5, textColor=INK,
                      spaceAfter=5)
SMALL = ParagraphStyle("small", parent=BODY, fontSize=8, leading=10.5, spaceAfter=0)
TINY = ParagraphStyle("tiny", parent=BODY, fontSize=7, leading=9, spaceAfter=0)
MUTEDP = ParagraphStyle("muted", parent=BODY, textColor=MUTED, fontSize=8.5, leading=12)
H1 = ParagraphStyle("h1", parent=BODY, fontName="DV-B", fontSize=17, leading=21, spaceBefore=6, spaceAfter=10,
                    textColor=ACCENT)
H2 = ParagraphStyle("h2", parent=BODY, fontName="DV-B", fontSize=12.5, leading=16, spaceBefore=12, spaceAfter=6,
                    textColor=INK)
H3 = ParagraphStyle("h3", parent=BODY, fontName="DV-B", fontSize=10, leading=13, spaceBefore=8, spaceAfter=3,
                    textColor=INK)
BUL = ParagraphStyle("bul", parent=BODY, leftIndent=12, bulletIndent=2, spaceAfter=3)
TITLE = ParagraphStyle("title", parent=BODY, fontName="DV-B", fontSize=26, leading=32, textColor=ACCENT,
                       spaceAfter=14)
SUB = ParagraphStyle("sub", parent=BODY, fontSize=12, leading=16, textColor=MUTED)
TOC0 = ParagraphStyle("toc0", parent=BODY, fontName="DV-B", fontSize=10, leading=14, spaceAfter=2)
TOC1 = ParagraphStyle("toc1", parent=BODY, fontSize=9, leading=12, leftIndent=16, spaceAfter=0)


def esc(s):
    return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def md_inline(s):
    """Minimal markdown -> reportlab markup: **bold**, `code`, bare URLs shortened."""
    s = esc(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"`(.+?)`", r"<font face='DV' color='#0b5d4b'>\1</font>", s)
    # allow the small set of inline tags the report text uses
    for tag in ("b", "i"):
        s = s.replace(f"&lt;{tag}&gt;", f"<{tag}>").replace(f"&lt;/{tag}&gt;", f"</{tag}>")
    s = re.sub(r"&lt;(font [^&]*?)&gt;", r"<\1>", s).replace("&lt;/font&gt;", "</font>")
    s = re.sub(r"&lt;(link [^&]*?)&gt;", r"<\1>", s).replace("&lt;/link&gt;", "</link>")
    return s


def P(s, st=BODY):
    return Paragraph(md_inline(s), st)


def B(s, st=BUL):
    return Paragraph(md_inline(s), st, bulletText="•")


def cell(s, st=SMALL):
    return Paragraph(md_inline(s), st)


# ---------- data ----------
N = {r["id"]: r for r in csv.DictReader(open(D / "niches.csv", encoding="utf-8"))}
T = list(csv.DictReader(open(D / "tools.csv", encoding="utf-8")))
A = list(csv.DictReader(open(D / "ad_audit_scored.csv", encoding="utf-8")))
RANKED = open(D / "ideas_ranked.md", encoding="utf-8").read()
DEAD = open(D / "dead_ends.md", encoding="utf-8").read()

last_scrape = max(a["scraped_at"] for a in A if a.get("scraped_at"))[:10]
n_tools_verified = sum(1 for t in T if t["verification_status"].startswith("search-verified"))
n_tools_price = sum(1 for t in T if (t.get("pricing_url") or "").startswith("http"))
audited = {a["tool"].lower() for a in A if a["google_status"].startswith("ok") or a["linkedin_status"].startswith("ok")}
meta_ok = {a["tool"].lower() for a in A if a["meta_status"] in ("ok", "ok_no_ads", "ok_no_matching_page")}
meta_unv = {a["tool"].lower() for a in A if a["meta_status"].startswith("unverified")} - meta_ok
n_pass_tools = len({a["tool"].lower() for a in A if a["tool_passes"] == "yes"})
rescrape = [l.strip() for l in open(D / "scraper" / "rescrape_tools.txt", encoding="utf-8") if l.strip()]
frag = collections.Counter(int(r["fragmentation_score"]) for r in N.values() if r["fragmentation_score"].isdigit())

dead_rows = [l.split("|")[1:-1] for l in DEAD.splitlines()
             if l.startswith("| ") and not l.startswith("| id") and not l.startswith("|---")]
dead_rows = [[c.strip() for c in r] for r in dead_rows]
killed = collections.Counter(r[6] for r in dead_rows)
filter2 = [r for r in dead_rows if r[6].startswith("Filter 2")]

# summary table from ideas_ranked.md
summ = []
for l in RANKED.split("## Summary table", 1)[1].split("\n---\n", 1)[0].splitlines():
    if l.startswith("| ") and not l.startswith("| rank") :
        c = [x.strip() for x in l.strip().strip("|").split("|")]
        if c[0].isdigit():
            summ.append(dict(rank=int(c[0]), niche=c[1], status=c[2], audited=c[3], passing=c[4], ad=c[5],
                             frag=c[6], score=c[7]))

# cards
cards = []
for raw in re.split(r"\n(?=## \d+\. )", RANKED)[1:]:
    lines = raw.split("\n")
    m = re.match(r"## (\d+)\. (.+?)\s+\(NAICS ([^)]+)\)", lines[0])
    c = dict(rank=int(m.group(1)), niche=m.group(2).strip(), naics=m.group(3), prices=[], urls=[], notes=[],
             audit=[])

    def grab(key):
        for l in lines:
            if l.startswith(f"- **{key}:**") or l.startswith(f"**{key}"):
                return l.split(":**", 1)[1].strip() if ":**" in l else l.split("**", 2)[2].strip()
        return ""

    c["status"] = grab("Status")
    c["score"] = grab("Method score")
    c["passing"] = grab("Passing tools")
    c["boring"] = grab("Boring test")
    c["estab"] = grab("US establishments")
    c["rescrape"] = grab("Rescrape queued (Meta undersampled)")
    c["confidence"] = grab("Confidence")
    for l in lines:
        if l.startswith("**The agent version**"):
            c["agent"] = l.split(":", 1)[1].strip()
        elif l.startswith("**Wedge**"):
            c["wedge"] = l.split(":", 1)[1].strip()
        elif l.startswith("**Fragmentation (Step 4):**"):
            c["frag"] = l.split(":**", 1)[1].strip()
        elif l.startswith("> "):
            c["notes"].append(l[2:].strip())
        elif l.startswith("  - http"):
            c["urls"].append(l.strip()[2:])
        elif l.startswith("  - ") and "$" in l or (l.startswith("  - ") and "(http" in l and not l.strip().startswith("- http")):
            c["prices"].append(l.strip()[2:])
    # audit table rows
    in_tbl = False
    for l in lines:
        if l.startswith("| tool |"):
            in_tbl = True
            continue
        if in_tbl:
            if not l.startswith("|"):
                in_tbl = False
                continue
            cells = [x.strip() for x in l.strip().strip("|").split("|")]
            if cells[0].startswith("---"):
                continue
            c["audit"].append(cells)
    cards.append(c)
cards.sort(key=lambda c: c["rank"])
qualified = [c for c in cards if c["status"].startswith("QUALIFIED")]
near = [c for c in cards if not c["status"].startswith("QUALIFIED")]
n_horiz = sum(1 for c in qualified if "horizontal-only" in c["status"])
n_vert = len(qualified) - n_horiz
filter4 = [c for c in cards if c["status"].startswith("passes ad test")]


# ---------- document with TOC ----------
class Doc(SimpleDocTemplate):
    def afterFlowable(self, fl):
        if isinstance(fl, Paragraph) and fl.style.name in ("h1", "h2"):
            lvl = 0 if fl.style.name == "h1" else 1
            text = fl.getPlainText()
            key = "k%d" % id(fl)
            self.canv.bookmarkPage(key)
            self.notify("TOCEntry", (lvl, text, self.page, key))


def on_page(canv, doc):
    canv.saveState()
    canv.setFont("DV", 7.5)
    canv.setFillColor(MUTED)
    canv.drawString(0.8 * inch, 0.5 * inch, "Boring-Niche Ad-Validated Idea Miner (US) · research run of 2026-09-15 to 2026-09-17")
    canv.drawRightString(letter[0] - 0.8 * inch, 0.5 * inch, "page %d" % doc.page)
    canv.setStrokeColor(RULE)
    canv.line(0.8 * inch, 0.62 * inch, letter[0] - 0.8 * inch, 0.62 * inch)
    canv.restoreState()


def kv_table(rows, w=(1.55 * inch, 5.3 * inch)):
    t = Table([[cell(k, SMALL), cell(v, SMALL)] for k, v in rows], colWidths=w)
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TEXTCOLOR", (0, 0), (0, -1), MUTED),
        ("LINEBELOW", (0, 0), (-1, -2), 0.25, RULE),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5), ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 2),
    ]))
    return t


def grid(header, rows, widths, band=True, font=TINY, highlight_pass_col=None):
    data = [[cell(h, TINY) for h in header]] + [[cell(x, font) for x in r] for r in rows]
    t = Table(data, colWidths=widths, repeatRows=1)
    st = [
        ("BACKGROUND", (0, 0), (-1, 0), BAND),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEBELOW", (0, 0), (-1, 0), 0.6, ACCENT),
        ("LINEBELOW", (0, 1), (-1, -1), 0.25, RULE),
        ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("LEFTPADDING", (0, 0), (-1, -1), 3), ("RIGHTPADDING", (0, 0), (-1, -1), 3),
    ]
    if highlight_pass_col is not None:
        for i, r in enumerate(rows, start=1):
            if r[highlight_pass_col].startswith("yes") or r[highlight_pass_col].startswith("QUALIFIED"):
                st.append(("BACKGROUND", (0, i), (-1, i), PASS))
    t.setStyle(TableStyle(st))
    return t


story = []
W = letter[0] - 1.6 * inch

# ---------- cover ----------
story += [Spacer(1, 1.6 * inch),
          Paragraph("Boring-Niche Ad-Validated Idea Miner", TITLE),
          Paragraph("United States · agent-as-a-service opportunities found by the four-filter method", SUB),
          Spacer(1, 0.3 * inch),
          Paragraph(f"Report generated {dt.date.today().isoformat()} from the research outputs on branch "
                    f"<font face='DV'>claude/boring-niche-aaas-miner-4ptuvl</font>, folder "
                    f"<font face='DV'>research/boring-niche-aaas-miner/</font>.", MUTEDP),
          Spacer(1, 0.5 * inch)]
cover_tbl = kv_table([
    ("Niches screened", "160 (all researched for incumbent SaaS)"),
    ("Tools catalogued", f"{len(T):,} rows, {n_tools_verified:,} URL-cited"),
    ("Tools ad-audited", f"{len(audited):,} on Google Ads Transparency and LinkedIn; {len(meta_ok):,} on Meta before Meta throttled the run"),
    ("Qualified niches", f"{len(qualified)} pass the method (two or more incumbents with a verified ad score of 5 or more, fragmentation 3 or more)"),
    ("Top idea", f"{qualified[0]['niche']} (method score {summ[0]['score']})"),
    ("Last ad scrape", last_scrape),
], w=(1.6 * inch, 4.9 * inch))
story += [cover_tbl, PageBreak()]

# ---------- executive summary ----------
story.append(Paragraph("Executive summary", H1))
story += [
    P("<b>What was asked.</b> Find 50 boring US business niches where (1) the work is repetitive paperwork or scheduling, "
      "(2) at least two SaaS tools already sell into the niche, (3) those tools have run paid ads long enough to prove the "
      "category converts, and (4) buyers are fragmented owner-operators with no gatekeeper. Every number had to come from a "
      "URL or be marked unverified. Nothing consumer, crypto, gambling, adult or MLM."),
    P(f"<b>What was delivered.</b> 160 niches were seeded with NAICS codes and screened. Web research found {n_tools_verified:,} "
      f"URL-cited incumbent tools across them, with public pricing captured for {n_tools_price:,}. A Playwright scraper run on a "
      f"local Windows machine then pulled ad data straight from the Meta Ad Library, Google Ads Transparency Center and LinkedIn "
      f"Ad Library feeds for {len(audited):,} tools. Fragmentation was scored 0 to 5 for every niche. The result is a ranked list "
      f"of 50 idea cards, each with an agent version, a wedge, a price ceiling and the evidence URLs behind it."),
    P(f"<b>Headline result.</b> {len(qualified)} niches pass all four filters on verified data. Residential roofing leads "
      f"with four passing incumbents (RoofSnap, AccuLynx, Roofr, ServiceTitan) and full fragmentation. Electrical, irrigation, "
      f"plumbing, pressure washing, appliance repair and air duct cleaning follow at 13.0. {n_vert} of the {len(qualified)} qualify through "
      f"vertical incumbents; the other {n_horiz} qualify only through horizontal field-service tools (Jobber, Housecall Pro, ServiceTitan, "
      f"Service Fusion, FieldPulse), which proves the category converts but not that a niche-specific product has been proven. "
      f"Two more niches ({', '.join(c['niche'].lower() for c in filter4)}) pass the ad test but fall below the brief's fragmentation "
      f"floor of 3, so they are excluded under Filter 4."),
    P("<b>Strongest vertical-incumbent niches</b> (a niche-specific tool, not just a horizontal, passes the ad test): "
      "roofing, irrigation (HindSite/FieldCentral), air duct cleaning (Vonigo), epoxy floors (DripJobs, Builder Prime), "
      "painting (DripJobs, PaintScout), fire inspection (Inspect Point, ServiceTrade), food trucks (Roaming Hunger, Truckster), "
      "used car dealers (AutoRaptor, Wayne Reaves), small property managers (Innago, Rentec Direct) and fire sprinkler (Inspect Point, "
      "BuildOps)."),
    P("<b>Near misses.</b> Trailer dealers, self-storage, music schools, driving schools and tutoring centers each have one "
      "passing vertical incumbent and full fragmentation. Any one of them tips into the qualified list if a second incumbent "
      "gains 3 Meta points, which is exactly the data the throttled Meta run could not capture."),
    P(f"<b>What is still unverified.</b> Meta counts for {len(meta_unv):,} tools audited on 16 September are marked unverified "
      f"because Meta rate-limited the scraping IP into empty results. Those tools are scored on Google, LinkedIn and headcount "
      f"only, so their scores can only rise. A Meta-only rerun of the {len(rescrape)} tools whose verdict could flip is queued and "
      f"needs a different IP. Census sub-20-employee shares were unreachable for every niche. Gatekeeper and concentration "
      f"checks ran for the 13 originally qualified niches only; every franchise mandate found binds franchisees, not independents."),
    P("<b>Recommendation.</b> Treat the top ten as the shortlist. Validate roofing, irrigation and air duct cleaning first: "
      "each has a vertical incumbent with long-running paid ads, public pricing under $200 per month, and an owner-operator "
      "buyer who signs the check. Roofing is the most crowded; its only plausible wedge is insurance-supplement assembly. "
      "Irrigation and air duct cleaning have thinner incumbent fields and clearer seasonal-rebooking wedges."),
]
story.append(PageBreak())

# ---------- TOC ----------
story.append(Paragraph("Table of contents", H1))
toc = TableOfContents()
toc.levelStyles = [TOC0, TOC1]
toc.dotsMinLevel = 0
story += [toc, PageBreak()]

# ---------- 1. method ----------
story.append(Paragraph("1. Method and how it was run", H1))
story.append(Paragraph("The four filters", H2))
story += [
    B("<b>Filter 1, boring niche.</b> Repetitive paperwork or scheduling, owner-operators, no consumer buyers. Scored 0 to 3 at seeding on three criteria; every niche kept scored 2 or more."),
    B("<b>Filter 2, incumbents.</b> At least two SaaS tools already selling into the niche, found by web search with a URL for each. A niche with fewer than three URL-cited tools is parked under Filter 2 in dead_ends.md."),
    B("<b>Filter 3, ad longevity.</b> Per tool: Meta +3 if 5 or more active US ads and 3 or more running 60 days or longer; Google +3 if 5 or more creatives and 3 or more first shown 90 days or more ago and still shown within 14 days; LinkedIn +1 if present and running; bootstrapped or under 50 staff +2; direct-response call to action +1. A tool passes at 5. A niche passes only if two or more URL-cited tools pass."),
    B("<b>Filter 4, fragmentation.</b> 0 to 5: owner-operator signs the check, three or more incumbents with public pricing, no gatekeeper (franchisor, distributor or association mandating software), no top-4 concentration. Niches at 3 or more are kept."),
]
story.append(Paragraph("Ranking formula", H2))
story.append(P("Niche ad score = mean of the two best verified tool scores (0 to 10). Method score = ad score + fragmentation (0 to 15). Qualified niches rank first, then everything else by method score."))
story.append(Paragraph("Where the numbers came from", H2))
story += [
    B("<b>Incumbent discovery and pricing:</b> web search inside the cloud session and seven sibling sessions, each with its own search budget. Every tool row carries the URL it was found at and the pricing URL where one exists."),
    B("<b>Ad data:</b> a Playwright (Chromium) scraper run on a local Windows PC. It does not read rendered pages; it captures the platforms' own data responses: Meta Ad Library GraphQL (ad archive ids, start dates, page ids, call-to-action), Google Ads Transparency Center SearchCreatives (first-shown and last-shown dates per creative), LinkedIn Ad Library detail pages (advertiser name, run dates). Each tool is resolved to its own Meta Page id to avoid keyword false positives."),
    B("<b>Establishment counts:</b> IBISWorld, Census-derived NAICS pages and siccode.com snippets, each with a URL, or marked unverified."),
    B("<b>Fragmentation checks:</b> franchise disclosure documents (FDDs), association partner pages and IBISWorld concentration statements for the originally qualified niches."),
]
story.append(Paragraph("What limited the run", H2))
story += [
    B("The cloud environment's egress policy blocked every external host except the web search API, so the ad libraries had to be scraped from a local machine."),
    B("Web search was capped at 200 calls per session. Step 2 was completed by splitting the remaining niches across seven sibling sessions."),
    B("Meta rate-limited the scraping IP during the final large run (571 tools). Page ids still resolved, but ad searches returned empty. Those rows are marked unverified rather than zero."),
    B("Meta was read in fast mode (first 30 to 60 ads per page, newest first), so very large advertisers can be undercounted on the 60-day test. Affected tools are flagged undersampled."),
    B("Generic tool names (Essential, GoPave, Contractor+, Garage Door OS, Driver File Hub, Pipe-Pro, Squeegee) resolved to the wrong Meta Page; their Meta points are zeroed. Six more are flagged ambiguous."),
]
story.append(PageBreak())

# ---------- 2. results ----------
story.append(Paragraph("2. Results at a glance", H1))
story.append(grid(["Stage", "Count", "Note"], [
    ["Niches seeded (Step 1)", "160", "NAICS-coded, boring score 2 to 3, consumer/crypto/gambling/adult/MLM excluded"],
    ["Niches with tool research (Step 2)", "160", "50 in the first pass, 110 in follow-up sessions"],
    ["Tool rows", f"{len(T):,}", f"{n_tools_verified:,} search-verified with URL; the rest are candidates or search-named"],
    ["Tools with a public pricing URL", f"{n_tools_price:,}", "vendor pricing pages preferred; third-party prices are marked as such"],
    ["Tools audited on Google + LinkedIn", f"{len(audited):,}", "unique tool names; from the platforms' own data feeds"],
    ["Tools audited on Meta", f"{len(meta_ok):,}", f"{len(meta_unv):,} more are unverified because Meta throttled the run"],
    ["Tools passing the ad test (score 5+)", f"{n_pass_tools}", "unique tool names"],
    ["Niches qualified", f"{len(qualified)}", f"two or more URL-cited tools passing and fragmentation 3+; {n_vert} via a vertical incumbent, {n_horiz} horizontal-only"],
    ["Niches failing Filter 4 only", f"{len(filter4)}", "pass the ad test, fragmentation below 3"],
    ["Niches provisional", "1", "Septic pumping: would qualify if prior-knowledge tool membership counted"],
    ["Niches parked under Filter 2", f"{killed.get('Filter 2 (fewer than 3 URL-cited tools)', 0)}", "fewer than three URL-cited tools found"],
    ["Niches failing Filter 3", f"{killed.get('Filter 3 (fewer than 2 tools score >=5)', 0)}", "audited, fewer than two passing tools"],
    ["Fragmentation 5 / 4 / 3 / below 3", f"{frag[5]} / {frag[4]} / {frag[3]} / {frag[2] + frag[1] + frag[0]}", "of 160 niches"],
], [2.4 * inch, 0.8 * inch, 3.65 * inch], font=SMALL))
story.append(Spacer(1, 10))
story.append(Paragraph("How to read a card", H2))
story += [
    B("<b>Status</b> QUALIFIED means two or more URL-cited tools scored 5 or more on verified data. The suffix horizontal-only means every passing tool is a cross-trade field-service platform."),
    B("<b>Agent version and wedge</b> are hypotheses written by the analyst, not search findings. They name the narrowest job an agent could take end to end, what it needs to plug into, and what done looks like."),
    B("<b>Price ceiling</b> is the cheapest cited incumbent tier plus the owner's admin labour inside the tool. The labour hours are an assumption and are labelled as such."),
    B("<b>Confidence</b> names the weakest link in the evidence chain for that niche."),
    B("The full evidence list (typically 25 to 50 URLs per niche, including the exact ad-library lookup URLs) is in ideas_ranked.md. This report shows the key ones."),
]
story.append(PageBreak())

# ---------- 3. leaderboard ----------
story.append(Paragraph("3. Ranked leaderboard (50 niches)", H1))
story.append(P("Shaded rows are qualified. Ad score is the mean of the two best verified tool scores; method score adds fragmentation."))
rows = [[str(s["rank"]), s["niche"], s["status"], s["audited"], s["passing"], s["ad"], s["frag"], s["score"]] for s in summ]
story.append(grid(["#", "Niche", "Status", "Audited", "Passing tools", "Ad", "Frag", "Score"], rows,
                  [0.3 * inch, 1.9 * inch, 1.15 * inch, 0.5 * inch, 1.9 * inch, 0.35 * inch, 0.35 * inch, 0.4 * inch],
                  highlight_pass_col=2))
story.append(PageBreak())


# ---------- 4. qualified cards ----------
def card(c, full=True):
    out = [Paragraph(f"{c['rank']}. {esc(c['niche'])}", H2)]
    s = next(x for x in summ if x["rank"] == c["rank"])
    status = c["status"].split(". Research")[0]
    kv = [("Status", status),
          ("NAICS", c["naics"]),
          ("Method score", c["score"]),
          ("Passing tools", c["passing"] or "none"),
          ("Boring test", c["boring"]),
          ("US establishments", c["estab"])]
    if c["rescrape"]:
        kv.append(("Meta rescrape queued", c["rescrape"]))
    out.append(kv_table(kv))
    out.append(Spacer(1, 6))
    # incumbents from research notes
    core = [n for n in c["notes"] if n.startswith("- Core jobs")]
    inc = [n for n in c["notes"] if n.startswith("- Incumbents")]
    weak = [n for n in c["notes"] if n.startswith("- Weakest evidence")]
    if core or inc:
        out.append(Paragraph("What the incumbent SaaS does", H3))
        for n in core + inc + weak:
            out.append(B(n[2:]))
    out.append(Paragraph("The agent version", H3))
    out.append(P(c.get("agent", "")))
    out.append(Paragraph("Wedge", H3))
    out.append(P(c.get("wedge", "")))
    if c["prices"]:
        out.append(Paragraph("Price ceiling (cited incumbent prices)", H3))
        for p in c["prices"][:5]:
            out.append(B(p, ParagraphStyle("bs", parent=BUL, fontSize=8.5, leading=11.5)))
        if len(c["prices"]) > 5:
            out.append(P(f"plus {len(c['prices']) - 5} more cited prices in ideas_ranked.md", MUTEDP))
    out.append(Paragraph("Fragmentation", H3))
    fr = c.get("frag", "")
    if len(fr) > 900:
        cut = fr[:900]
        fr = (cut[:cut.rfind(". ") + 1] if ". " in cut else cut.rsplit(" ", 1)[0]) + " (continued in ideas_ranked.md)"
    out.append(P(fr, ParagraphStyle("fr", parent=BODY, fontSize=8.5, leading=11.5)))
    if full and c["audit"]:
        out.append(Paragraph("Ad audit", H3))
        rows = []
        for r in c["audit"]:
            # tool | verified | score | pass | meta | meta page | cta | google | linkedin | headcount | flags
            meta = r[4]
            if meta.lower().startswith("unverified"):
                meta = "unverified (throttled)"
            rows.append([r[0], r[2], r[3], meta, r[7], r[8], r[9], r[10]])
        out.append(grid(["Tool", "Score", "Pass", "Meta active / 60d / 120d", "Google ads / pass-90d (first shown)",
                         "LinkedIn", "HC", "Flags"], rows,
                        [1.35 * inch, 0.45 * inch, 0.4 * inch, 1.3 * inch, 1.55 * inch, 0.6 * inch, 0.3 * inch, 0.9 * inch],
                        highlight_pass_col=2))
    out.append(Paragraph("Confidence", H3))
    out.append(P(c["confidence"]))
    key_urls = [u for u in c["urls"] if not u.startswith("https://www.facebook.com/ads/library") and not u.startswith("https://adstransparency")][:6]
    if key_urls:
        out.append(Paragraph(f"Key evidence ({len(c['urls'])} URLs on the full card)", H3))
        for u in key_urls:
            out.append(Paragraph(f"<link href='{esc(u)}' color='#0b5d4b'>{esc(u[:110])}</link>", TINY))
    return out


story.append(Paragraph("4. Qualified niches: idea cards", H1))
story.append(P(f"{len(qualified)} niches pass all four filters on verified data, in method-score order."))
for c in qualified:
    story += card(c)
    story.append(PageBreak())

# ---------- 5. near misses ----------
story.append(Paragraph("5. Near misses and the rest of the top 50", H1))
story.append(P("These niches did not qualify. The first two pass the ad test with two incumbents each but sit below the fragmentation floor. The next five each have one passing vertical incumbent and full fragmentation; a second passing tool would qualify them, and Meta data is unverified for most of their tools. Cards for these seven are shown in full; the rest are summarised."))
for c in near[:7]:
    story += card(c)
    story.append(Spacer(1, 8))
story.append(PageBreak())
story.append(Paragraph(f"Ranks {near[7]['rank']} to 50, summarised", H2))
rows = []
for c in near[7:]:
    s = next(x for x in summ if x["rank"] == c["rank"])
    rows.append([str(c["rank"]), c["niche"], s["score"], s["passing"] if s["passing"] != "-" else "none", c.get("wedge", "")])
story.append(grid(["#", "Niche", "Score", "Passing tool", "Wedge (hypothesis)"], rows,
                  [0.3 * inch, 1.7 * inch, 0.45 * inch, 1.2 * inch, 3.2 * inch], font=SMALL))
story.append(PageBreak())

# ---------- 6. dead ends ----------
story.append(Paragraph("6. Dead ends", H1))
story.append(P(f"{len(dead_rows)} of the 160 niches are not qualified. Every one is listed in dead_ends.md with the filter that stopped it and the best tools found. Consumer-facing and excluded categories were removed at seeding and never entered the list."))
story.append(grid(["Killed by", "Niches", "Meaning"], [
    ["Filter 3 (fewer than 2 tools score 5+)", str(killed.get("Filter 3 (fewer than 2 tools score >=5)", 0)),
     "Incumbents exist and were audited, but fewer than two show long-running paid ads on verified data. Many are Meta-unverified and could move."],
    ["Filter 4 (fragmentation below 3)", str(killed.get("Filter 4 (fragmentation < 3)", 0)),
     "Two incumbents pass the ad test, but the buyer side is concentrated or franchise-dominated (carpet cleaning, glass and glazing)."],
    ["Filter 2 (fewer than 3 URL-cited tools)", str(len(filter2)),
     "Search found fewer than three incumbents with a URL. Re-run Step 2 with more searches or accept as thin."],
], [2.2 * inch, 0.6 * inch, 4.05 * inch], font=SMALL))
story.append(Spacer(1, 8))
story.append(Paragraph("Niches parked under Filter 2", H2))
story.append(grid(["id", "Niche", "URL-cited tools", "Frag"], [[r[0], r[1], r[2], r[5]] for r in filter2],
                  [0.4 * inch, 4.0 * inch, 1.2 * inch, 0.6 * inch], font=SMALL))
story.append(PageBreak())

# ---------- 7. data quality ----------
story.append(Paragraph("7. Data quality and what is unverified", H1))
story += [
    B(f"<b>Meta, {len(meta_unv):,} tools.</b> Marked unverified (throttled). Their scores rest on Google, LinkedIn and headcount only and can only rise. The {len(rescrape)} tools whose verdict could flip with a Meta pass are listed in scraper/rescrape_tools.txt."),
    B("<b>Meta sampling.</b> Fast mode read the newest 30 to 60 ads per page. Large advertisers (JobNimbus, Jobber and similar) can fail the 60-day test on a sample that passes on the full page. Flagged undersampled on the card."),
    B("<b>Wrong or ambiguous Meta pages.</b> Seven generic names resolved to an unrelated Page and were zeroed; six more are flagged ambiguous. The scorer's override lists are in scraper/score_ad_audit.py."),
    B("<b>Google.</b> Read from the SearchCreatives feed, up to 40 creatives per advertiser by default. Overlap test: first shown 90 or more days ago and last shown within 14 days. A handful of tools show unverified (host blocked) from the earlier cloud attempt and were never rescraped."),
    B("<b>LinkedIn.</b> Presence and run dates from advertiser-filtered detail pages. Absence of LinkedIn ads is common for SMB tools and only costs one point."),
    B("<b>Establishment counts.</b> Cited from IBISWorld or NAICS pages where a snippet gave a number; the sub-20-employee share needs the Census CBP API, which was unreachable, so it is unverified for all 160 niches."),
    B("<b>Fragmentation.</b> Gatekeeper and concentration checks ran for the 13 originally qualified niches. Every software mandate found is a franchisor rule (Neighborly brands, Precision Door, Conserva) that binds franchisees only. For the other niches the score is conservative."),
    B("<b>Prices.</b> Vendor pricing pages where available; third-party figures (Capterra, roundups) are labelled as such in tools.csv and on the cards."),
    B("<b>Agent version, wedge and labour hours</b> are labelled hypotheses. They were not validated with buyers."),
]
story.append(Paragraph("8. Recommended next steps", H1))
story += [
    B("<b>Close the Meta gap.</b> Run the queued Meta-only rescrape of the flip candidates from a different IP (phone hotspot), then rescore. Expected effect: several near-miss niches move up; no qualified niche can move down."),
    B("<b>Validate the top three by talking to buyers.</b> Roofing (insurance-supplement assembly), irrigation (seasonal rebooking and backflow deadlines) and air duct cleaning (quote, book, photo report, annual rebook). Ten owner conversations each will tell more than another scoring pass."),
    B("<b>Prefer vertical-incumbent niches over horizontal-only ones</b> when choosing between similar scores. A horizontal-only pass proves the trade buys software; a vertical pass proves someone already sells a niche product on paid ads."),
    B("<b>Finish Step 2 for the 14 Filter-2 niches</b> only if one is strategically interesting; most are thin because the niche is small, not because search failed."),
    B("<b>Pull Census CBP employee-size shares</b> from a machine with API access to replace the unverified sub-20-employee field."),
]
story.append(PageBreak())

# ---------- appendix ----------
story.append(Paragraph("Appendix A. Files in the research folder", H1))
story.append(grid(["File", "What it holds"], [
    ["ideas_ranked.md", "50 full idea cards with audit tables, notes, agent version, wedge, price ceiling, fragmentation, all evidence URLs, confidence"],
    ["niches.csv", "160 niches: NAICS, boring score, establishments with URL, tool counts, fragmentation, ad longevity, research status"],
    ["tools.csv", f"{len(T):,} tool rows: pricing URL and price, founded, headcount, funding, review counts, verification status"],
    ["ad_audit.csv / ad_audit_filled.csv / ad_audit_scored.csv", "Lookup URLs per tool; raw scraper output per platform; per-tool score breakdown and pass flag"],
    ["niche_pass.csv, fragmentation.csv", "Per-niche Step 3 pass/fail; per-niche Step 4 scoring detail"],
    ["dead_ends.md", "Every non-qualified niche with the filter that stopped it"],
    ["aaas_angles.json, batch_notes.json", "Agent-version and wedge text per niche; research notes from the batch agents"],
    ["scraper/", "Playwright scraper, scorer, ranked-file generator, merge tools, parallel runner, this report builder"],
    ["README.md", "Run status, blockers, rerun plan and the batch prompt"],
], [2.3 * inch, 4.55 * inch], font=SMALL))
story.append(Spacer(1, 10))
story.append(Paragraph("Appendix B. Scoring rubric", H1))
story.append(grid(["Signal", "Points", "Test"], [
    ["Meta Ad Library", "+3", "5 or more active US ads and 3 or more running 60 days or longer (start dates from Meta's feed)"],
    ["Google Ads Transparency", "+3", "5 or more creatives and 3 or more first shown 90+ days ago and still shown within 14 days"],
    ["LinkedIn Ad Library", "+1", "Advertiser present with a currently running ad"],
    ["Bootstrapped or under 50 staff", "+2", "From a cited company page, Crunchbase, Tracxn or LinkedIn"],
    ["Direct-response CTA", "+1", "Ad call to action is a demo, trial, quote or sign-up"],
    ["Tool passes", "5+", "Sum of the above"],
    ["Niche passes", "2 tools", "Two or more URL-cited tools passing"],
    ["Fragmentation", "0 to 5", "Owner signs, 3+ public-price incumbents, no gatekeeper, low concentration; keep at 3+"],
], [1.8 * inch, 0.6 * inch, 4.45 * inch], font=SMALL))
story.append(Spacer(1, 10))
story.append(Paragraph("Appendix C. Horizontal tools", H1))
story.append(P("These platforms advertise to every home-service trade. A niche whose only passing tools are on this list is marked horizontal-only: Jobber, Housecall Pro, ServiceTitan, Service Fusion, FieldPulse, Workiz, and their peers as listed in scraper/generate_ranked.py."))

doc = Doc(str(OUT), pagesize=letter, leftMargin=0.8 * inch, rightMargin=0.8 * inch, topMargin=0.8 * inch,
          bottomMargin=0.85 * inch, title="Boring-Niche Ad-Validated Idea Miner (US)", author="Research run 2026-09")
doc.multiBuild(story, onFirstPage=on_page, onLaterPages=on_page)
print("wrote", OUT, OUT.stat().st_size, "bytes")
