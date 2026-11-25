import * as cheerio from "cheerio";
import connectToDatabase from "@/lib/mongodb";
import SarkariSnapshot, { ISarkariCategories, ISarkariPostItem } from "@/models/SarkariSnapshot";
import PostDetail from "@/models/PostDetail";

export interface LiveCrawlPayload {
  hotUpdates: ISarkariPostItem[];
  categories: ISarkariCategories;
}

const SARKARI_BASE_URL = "https://www.sarkariresult.com";

const HOT_TILE_COLORS = [
  "#dc2626", // Red
  "#ea580c", // Orange
  "#c026d3", // Magenta
  "#1d4ed8", // Royal Blue
  "#65a30d", // Olive Green
  "#0284c7", // Sky Blue
  "#7f1d1d", // Dark Maroon
  "#15803d", // Emerald Green
];

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 100);
}

export function toAbsoluteSarkariUrl(rawHref: string): string {
  const trimmed = (rawHref || "").trim();
  if (!trimmed) return SARKARI_BASE_URL;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return `${SARKARI_BASE_URL}${trimmed}`;
  return `${SARKARI_BASE_URL}/${trimmed}`;
}

/**
 * Resolves the genuine official government portal URL for a recruitment post.
 * Never returns sarkariresult.com for action buttons.
 */
export function resolveOfficialGovUrl(title: string, rawUrl?: string): string {
  if (rawUrl && typeof rawUrl === "string") {
    const trimmed = rawUrl.trim();
    const isGovOrOfficial =
      trimmed.includes(".gov.in") ||
      trimmed.includes(".nic.in") ||
      trimmed.includes(".ac.in") ||
      trimmed.includes(".org.in") ||
      trimmed.includes(".edu.in");
    if (isGovOrOfficial && !trimmed.includes("sarkariresult")) {
      return trimmed;
    }
  }

  const lower = title.toLowerCase();
  if (lower.includes("ssc")) return "https://ssc.gov.in/";
  if (lower.includes("uppsc")) return "https://uppsc.up.nic.in/";
  if (lower.includes("upsssc")) return "https://upsssc.gov.in/";
  if (lower.includes("upessc")) return "https://upessc.up.gov.in/";
  if (lower.includes("uptet") || lower.includes("updeled")) return "https://updeled.gov.in/";
  if (lower.includes("bpsc")) return "https://www.bpsc.bih.nic.in/";
  if (lower.includes("bssc")) return "https://bssc.bihar.gov.in/";
  if (lower.includes("rpsc")) return "https://rpsc.rajasthan.gov.in/";
  if (lower.includes("rsmssb") || lower.includes("rssb")) return "https://rssb.rajasthan.gov.in/";
  if (lower.includes("ukpsc")) return "https://psc.uk.gov.in/";
  if (lower.includes("mppsc")) return "https://mppsc.mp.gov.in/";
  if (lower.includes("hssc")) return "https://hssc.gov.in/";
  if (lower.includes("dsssb")) return "https://dsssb.delhi.gov.in/";
  if (lower.includes("rrb") || lower.includes("railway") || lower.includes("rrc")) return "https://www.rrbcdg.gov.in/";
  if (lower.includes("upsc") || lower.includes("nda") || lower.includes("cds")) return "https://upsc.gov.in/";
  if (lower.includes("ibps")) return "https://www.ibps.in/";
  if (lower.includes("sbi")) return "https://sbi.co.in/web/careers";
  if (lower.includes("rbi")) return "https://opportunities.rbi.org.in/";
  if (lower.includes("indian bank")) return "https://www.indianbank.in/";
  if (lower.includes("nta") || lower.includes("neet") || lower.includes("jee") || lower.includes("cuet") || lower.includes("ugc net"))
    return "https://nta.ac.in/";
  if (lower.includes("allahabad high court")) return "https://www.allahabadhighcourt.in/";
  if (lower.includes("delhi high court")) return "https://delhihighcourt.nic.in/";
  if (lower.includes("supreme court")) return "https://www.sci.gov.in/";
  if (lower.includes("high court")) return "https://ecourts.gov.in/";
  if (lower.includes("up police") || lower.includes("uppbpb")) return "https://uppbpb.gov.in/";
  if (lower.includes("delhi police")) return "https://delhipolice.gov.in/";
  if (lower.includes("cisf")) return "https://cisfrectt.cisf.gov.in/";
  if (lower.includes("bsf")) return "https://rectt.bsf.gov.in/";
  if (lower.includes("crpf")) return "https://rect.crpf.gov.in/";
  if (lower.includes("assam rifles")) return "https://www.assamrifles.gov.in/";
  if (lower.includes("india post") || lower.includes("gds")) return "https://indiapostgdsonline.gov.in/";
  if (lower.includes("aiims")) return "https://www.aiimsexams.ac.in/";
  if (lower.includes("epfo")) return "https://www.epfindia.gov.in/";
  if (lower.includes("esic")) return "https://www.esic.gov.in/";
  if (lower.includes("bhel")) return "https://careers.bhel.in/";
  if (lower.includes("drdo")) return "https://www.drdo.gov.in/";
  if (lower.includes("isro")) return "https://www.isro.gov.in/";
  if (lower.includes("navy")) return "https://www.joinindiannavy.gov.in/";
  if (lower.includes("army")) return "https://joinindianarmy.nic.in/";
  if (lower.includes("air force") || lower.includes("agniveer")) return "https://agnipathvayu.cdac.in/";
  if (lower.includes("nicl")) return "https://nationalinsurance.nic.co.in/";
  if (lower.includes("lic")) return "https://licindia.in/";
  if (lower.includes("cbse") || lower.includes("ctet")) return "https://ctet.nic.in/";
  if (lower.includes("kvs")) return "https://kvsangathan.nic.in/";
  if (lower.includes("nvs")) return "https://navodaya.gov.in/";
  return "https://www.ncs.gov.in/";
}

function resolveConductingBoard(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("uppsc")) return "Uttar Pradesh Public Service Commission (UPPSC)";
  if (lower.includes("upsssc")) return "Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)";
  if (lower.includes("upessc")) return "Uttar Pradesh Education Service Selection Commission (UPESSC)";
  if (lower.includes("ssc")) return "Staff Selection Commission (SSC)";
  if (lower.includes("upsc")) return "Union Public Service Commission (UPSC)";
  if (lower.includes("rrb") || lower.includes("railway")) return "Railway Recruitment Board (RRB)";
  if (lower.includes("ibps")) return "Institute of Banking Personnel Selection (IBPS)";
  if (lower.includes("sbi")) return "State Bank of India (SBI)";
  if (lower.includes("nta")) return "National Testing Agency (NTA)";
  if (lower.includes("dsssb")) return "Delhi Subordinate Services Selection Board (DSSSB)";
  if (lower.includes("bpsc")) return "Bihar Public Service Commission (BPSC)";
  if (lower.includes("bssc")) return "Bihar Staff Selection Commission (BSSC)";
  if (lower.includes("allahabad high court")) return "High Court of Judicature at Allahabad";
  if (lower.includes("supreme court")) return "Supreme Court of India";
  if (lower.includes("up police")) return "Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB)";
  return "Official Government Recruitment Authority";
}

function isJunkOrViewMoreLink(title: string, href: string): boolean {
  const lowerTitle = title.toLowerCase().replace(/\s+/g, " ").trim();
  const lowerHref = href.toLowerCase().trim();

  if (!lowerTitle || lowerTitle.length < 6) return true;
  if (!lowerHref || lowerHref === "#" || lowerHref.startsWith("javascript:")) return true;

  // Ignore "View More" links
  if (/view\s*more/i.test(lowerTitle)) return true;
  if (
    /(result|admitcard|latestjob|answerkey|syllabus|admission|verification|important)\.php$/i.test(
      lowerHref.split("?")[0]
    )
  ) {
    return true;
  }

  // Ignore social media, app download, nav, and generic site links
  const blockedDomains = [
    "play.google.com",
    "apps.apple.com",
    "t.me/",
    "telegram.",
    "youtube.com",
    "youtu.be",
    "instagram.com",
    "twitter.com",
    "x.com/",
    "facebook.com",
    "whatsapp.com",
  ];
  if (blockedDomains.some((d) => lowerHref.includes(d))) return true;

  const blockedTitles = new Set([
    "home",
    "latest jobs",
    "latest job",
    "results",
    "result",
    "admit card",
    "admit cards",
    "answer key",
    "answer keys",
    "syllabus",
    "admission",
    "certificate verification",
    "important",
    "search",
    "contact us",
    "privacy policy",
    "disclaimer",
    "click here",
    "read more",
    "sarkari result",
    "sarkariresults",
    "sarkari result 2026",
    "sarkari result 2025",
    "sarkariresult tools",
    "sarkari result tools",
    "sarkari result android apps",
    "sarkari result apple / ios apps",
    "sarkari result youtube channel",
    "follow instagram",
    "join telegram",
    "follow twitter",
    "android app",
    "apple ios app",
  ]);
  if (blockedTitles.has(lowerTitle)) return true;

  const blockedWords = [
    "android app",
    "ios app",
    "apple / ios",
    "youtube channel",
    "follow instagram",
    "join telegram",
    "follow on x",
    "sarkari result tools",
    "privacy policy",
    "contact us",
  ];
  if (blockedWords.some((w) => lowerTitle.includes(w))) return true;

  // Reject bare homepage links
  if (
    lowerHref === "https://www.sarkariresult.com" ||
    lowerHref === "https://www.sarkariresult.com/" ||
    lowerHref === "/"
  ) {
    return true;
  }

  return false;
}

function detectBadge(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("last date")) return "Last Date";
  if (lower.includes("apply online") || lower.includes("online form")) return "Online Form";
  if (lower.includes("answer key")) return "Answer Key";
  if (lower.includes("exam city")) return "Exam City";
  if (lower.includes("score card") || lower.includes("scorecard")) return "Score Card";
  if (lower.includes("final result")) return "Final Result";
  if (lower.includes("admit card")) return "Admit Card";
  if (lower.includes("declared") || lower.includes(" out")) return "Out";
  if (lower.includes("exam date")) return "Exam Date";
  if (lower.includes("syllabus")) return "Syllabus";
  return "";
}

function matchCategoryKey(headingText: string): keyof ISarkariCategories | null {
  const clean = headingText.toLowerCase().replace(/\s+/g, " ").trim();
  if (!clean || clean.length > 45) return null;

  if (/^results?$/.test(clean)) return "result";
  if (/^admit\s*cards?$/.test(clean) || /^hall\s*tickets?$/.test(clean)) return "admitCard";
  if (/^latest\s*jobs?$/.test(clean)) return "latestJob";
  if (/^answer\s*keys?$/.test(clean)) return "answerKey";
  if (/^syllabus$/.test(clean)) return "syllabus";
  if (/^admissions?$/.test(clean)) return "admission";
  if (/^certificate(\s*verification)?$/.test(clean)) return "certificate";
  if (/^important$/.test(clean)) return "important";
  if (/outsourcing|offline\s*jobs?|offline\s*form/.test(clean)) return "outsourcing";
  return null;
}

/**
 * Crawls https://www.sarkariresult.com/ live using Cheerio.
 * Strictly isolates each category box and top 8 colored tiles with zero static fallback data.
 */
export async function scrapeSarkariResultLive(): Promise<LiveCrawlPayload> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  let html = "";
  try {
    const response = await fetch(SARKARI_BASE_URL + "/", {
      signal: controller.signal,
      headers: BROWSER_HEADERS,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText} from sarkariresult.com`);
    }

    html = await response.text();
  } finally {
    clearTimeout(timeoutId);
  }

  const $ = cheerio.load(html);

  const categories: ISarkariCategories = {
    result: [],
    admitCard: [],
    latestJob: [],
    answerKey: [],
    syllabus: [],
    admission: [],
    certificate: [],
    important: [],
    outsourcing: [],
  };

  // 1. Extract Top 8 Quick Access Colored Boxes (#image1 .. #image8)
  const hotUpdates: ISarkariPostItem[] = [];
  const seenHot = new Set<string>();

  const hotContainers = $("#image1, #image2, #image3, #image4, #image5, #image6, #image7, #image8");
  if (hotContainers.length > 0) {
    hotContainers.each((idx, el) => {
      if (hotUpdates.length >= 8) return;
      const anchor = $(el).find("a").first();
      const title = anchor.text().replace(/\s+/g, " ").trim();
      const rawHref = anchor.attr("href")?.trim() || "";
      if (isJunkOrViewMoreLink(title, rawHref)) return;

      const key = title.toLowerCase();
      if (seenHot.has(key)) return;
      seenHot.add(key);

      const styleAttr = $(el).attr("style") || anchor.attr("style") || "";
      const bgMatch = styleAttr.match(/background(?:-color)?\s*:\s*([^;]+)/i);
      const extractedBg = bgMatch ? bgMatch[1].trim() : "";

      hotUpdates.push({
        title,
        slug: slugify(title),
        url: toAbsoluteSarkariUrl(rawHref),
        officialUrl: resolveOfficialGovUrl(title, rawHref),
        badge: detectBadge(title) || "Trending",
        bgColor: extractedBg || HOT_TILE_COLORS[hotUpdates.length % HOT_TILE_COLORS.length],
      });
    });
  }

  // Secondary selector if #image1..#image8 structure differs (e.g. colored table cells above #box1)
  if (hotUpdates.length < 8) {
    $("div[id^='image'] a, td[bgcolor] a, div[style*='background-color'] a").each((_, el) => {
      if (hotUpdates.length >= 8) return;
      const title = $(el).text().replace(/\s+/g, " ").trim();
      const rawHref = $(el).attr("href")?.trim() || "";
      if (isJunkOrViewMoreLink(title, rawHref)) return;

      const key = title.toLowerCase();
      if (seenHot.has(key)) return;
      seenHot.add(key);

      hotUpdates.push({
        title,
        slug: slugify(title),
        url: toAbsoluteSarkariUrl(rawHref),
        officialUrl: resolveOfficialGovUrl(title, rawHref),
        badge: detectBadge(title) || "Trending",
        bgColor: HOT_TILE_COLORS[hotUpdates.length % HOT_TILE_COLORS.length],
      });
    });
  }

  // 2. Extract All 9 Category Boxes via Strict Heading-to-Box Isolation
  const seenByCat: Record<keyof ISarkariCategories, Set<string>> = {
    result: new Set(),
    admitCard: new Set(),
    latestJob: new Set(),
    answerKey: new Set(),
    syllabus: new Set(),
    admission: new Set(),
    certificate: new Set(),
    important: new Set(),
    outsourcing: new Set(),
  };

  $("#heading, .heading, h2, h3, th, div").each((_, headingEl) => {
    // Only inspect leaf-like heading elements so outer wrapper divs never match
    const childrenCount = $(headingEl).children().length;
    if (childrenCount > 2) return;

    const headingText = $(headingEl).text().replace(/\s+/g, " ").trim();
    const catKey = matchCategoryKey(headingText);
    if (!catKey) return;

    // Locate the exact list container belonging exclusively to this heading
    let linkNodes = $(headingEl).next("#post, ul, div").find("ul li a, li a");

    if (linkNodes.length === 0) {
      const parentBox = $(headingEl).parent();
      // Ensure parentBox does not contain multiple category headings
      const subHeadings = parentBox.find("#heading, .heading, h2, h3, th").filter((__, sh) => {
        return matchCategoryKey($(sh).text()) !== null;
      });
      if (subHeadings.length <= 1) {
        linkNodes = parentBox.find("ul li a, #post li a");
      }
    }

    if (linkNodes.length === 0) {
      const nextRow = $(headingEl).closest("tr").next("tr");
      if (nextRow.length > 0 && nextRow.find("th, #heading").length === 0) {
        linkNodes = nextRow.find("ul li a, li a");
      }
    }

    linkNodes.each((__, linkEl) => {
      const title = $(linkEl).text().replace(/\s+/g, " ").trim();
      const rawHref = $(linkEl).attr("href")?.trim() || "";

      if (isJunkOrViewMoreLink(title, rawHref)) return;

      const dedupeKey = title.toLowerCase();
      if (seenByCat[catKey].has(dedupeKey)) return;
      seenByCat[catKey].add(dedupeKey);

      categories[catKey].push({
        title,
        slug: slugify(title),
        url: toAbsoluteSarkariUrl(rawHref),
        officialUrl: resolveOfficialGovUrl(title, rawHref),
        badge: detectBadge(title),
      });
    });
  });

  return { hotUpdates, categories };
}

/**
 * Searches the active MongoDB snapshot for a post matching `slug` so we always
 * know its exact live SarkariResult detail URL and title.
 */
async function findPostInActiveSnapshot(slug: string): Promise<ISarkariPostItem | null> {
  const db = await connectToDatabase();
  if (!db) return null;

  const active = await SarkariSnapshot.findOne({ isActive: true }).sort({ version: -1 }).lean();
  if (!active) return null;

  const allLists: ISarkariPostItem[][] = [
    active.hotUpdates || [],
    active.categories?.result || [],
    active.categories?.admitCard || [],
    active.categories?.latestJob || [],
    active.categories?.answerKey || [],
    active.categories?.syllabus || [],
    active.categories?.admission || [],
    active.categories?.certificate || [],
    active.categories?.important || [],
    active.categories?.outsourcing || [],
  ];

  for (const list of allLists) {
    const found = list.find((item) => item.slug === slug);
    if (found) return found;
  }
  return null;
}

/**
 * On-Demand Detail Page Scraper:
 * Fetches the specific post's live sarkariresult.com URL (or serves MongoDB cache)
 * and parses Important Dates, Fee, Age Limit, Vacancy Details, and Official Govt Links.
 */
export async function getOrScrapePostDetail(slug: string, passedTitle?: string, passedUrl?: string) {
  const db = await connectToDatabase();

  if (db) {
    const cached = await PostDetail.findOne({ slug }).lean();
    if (cached) {
      return cached;
    }
  }

  const snapshotMatch = await findPostInActiveSnapshot(slug);
  const targetUrl = passedUrl || snapshotMatch?.url || `${SARKARI_BASE_URL}/${slug}/`;
  const fallbackTitle = passedTitle || snapshotMatch?.title || slug.replace(/-/g, " ").toUpperCase();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let html = "";
  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: BROWSER_HEADERS,
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Detail page returned HTTP ${response.status}`);
    }
    html = await response.text();
  } finally {
    clearTimeout(timeoutId);
  }

  const $ = cheerio.load(html);

  // Extract Post Title & Short Details
  let postTitle = fallbackTitle;
  let shortDetails = "";

  $("table tr").each((_, tr) => {
    const cells = $(tr).find("td");
    if (cells.length >= 2) {
      const label = $(cells[0]).text().replace(/\s+/g, " ").trim().toLowerCase();
      const val = $(cells[1]).text().replace(/\s+/g, " ").trim();
      if (label.includes("name of post") && val) {
        postTitle = val;
      } else if ((label.includes("short information") || label.includes("short details")) && val) {
        shortDetails = val;
      }
    }
  });

  if (postTitle === fallbackTitle) {
    const h1Text = $("h1").first().text().replace(/\s+/g, " ").trim();
    if (h1Text && h1Text.length > 5) postTitle = h1Text;
  }

  const boardName = resolveConductingBoard(postTitle);

  // Parse Important Dates & Application Fee
  const importantDates: Array<{ label: string; value: string }> = [];
  const applicationFee: Array<{ category: string; fee: string }> = [];
  let feePaymentNote = "";

  $("td").each((_, td) => {
    const tdText = $(td).text().trim();
    const headerText = $(td).find("b, strong, h2, h3").first().text().toLowerCase();

    if (headerText.includes("important dates") && importantDates.length === 0) {
      $(td)
        .find("li, p")
        .each((__, el) => {
          const line = $(el).text().replace(/\s+/g, " ").trim();
          if (line.includes(":")) {
            const [lbl, ...rest] = line.split(":");
            const val = rest.join(":").trim();
            if (lbl.trim() && val) {
              importantDates.push({ label: lbl.trim(), value: val });
            }
          }
        });
    }

    if (headerText.includes("application fee") && applicationFee.length === 0) {
      $(td)
        .find("li, p")
        .each((__, el) => {
          const line = $(el).text().replace(/\s+/g, " ").trim();
          if (line.toLowerCase().includes("pay the exam") || line.toLowerCase().includes("debit card")) {
            feePaymentNote = line;
          } else if (line.includes(":")) {
            const [lbl, ...rest] = line.split(":");
            const val = rest.join(":").trim();
            if (lbl.trim() && val) {
              applicationFee.push({ category: lbl.trim(), fee: val });
            }
          }
        });
    }

    if (!shortDetails && tdText.toLowerCase().includes("short details of notification")) {
      shortDetails = tdText.replace(/short details of notification/i, "").trim();
    }
  });

  // Parse Age Limit
  const ageLimit = {
    minAge: "",
    maxAge: "",
    asOfDate: "",
    relaxationRules: "",
  };

  $("td:contains('Age Limit') li, td:contains('Age Limit') p").each((_, el) => {
    const line = $(el).text().replace(/\s+/g, " ").trim();
    const lower = line.toLowerCase();
    if (lower.includes("minimum age")) {
      ageLimit.minAge = line.split(":")[1]?.trim() || line;
    } else if (lower.includes("maximum age")) {
      ageLimit.maxAge = line.split(":")[1]?.trim() || line;
    } else if (lower.includes("age limit as on")) {
      ageLimit.asOfDate = line.split("on")[1]?.trim() || line;
    } else if (lower.includes("relaxation")) {
      ageLimit.relaxationRules = line;
    }
  });

  // Parse Vacancy Details
  const vacancyDetails: Array<{ postName: string; totalPost: string; eligibility: string }> = [];
  let totalPostsSummary = "";

  $("table tr").each((_, tr) => {
    const rowText = $(tr).text().replace(/\s+/g, " ").trim();
    if (rowText.toLowerCase().includes("vacancy details total")) {
      totalPostsSummary = rowText;
    }
    const tds = $(tr).find("td");
    if (tds.length >= 3) {
      const c1 = $(tds[0]).text().replace(/\s+/g, " ").trim();
      const c2 = $(tds[1]).text().replace(/\s+/g, " ").trim();
      const c3 = $(tds[2]).text().replace(/\s+/g, " ").trim();
      const lowerC1 = c1.toLowerCase();
      if (
        c1 &&
        c2 &&
        !lowerC1.includes("post name") &&
        !lowerC1.includes("important dates") &&
        !lowerC1.includes("useful important links") &&
        !lowerC1.includes("short details") &&
        c1.length < 120
      ) {
        vacancyDetails.push({
          postName: c1,
          totalPost: c2,
          eligibility: c3,
        });
      }
    }
  });

  // Parse How to Fill
  const howToFill: string[] = [];
  $("td:contains('How to Fill') li, td:contains('How to Apply') li").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text && text.length > 10) howToFill.push(text);
  });

  // Parse Some Useful Important Links -> strictly resolve real official govt links
  const importantLinks: Array<{ title: string; url: string; actionText: string; isOfficial: boolean }> = [];
  $("table tr").each((_, tr) => {
    const rowText = $(tr).text().replace(/\s+/g, " ").trim();
    const lowerRow = rowText.toLowerCase();
    if (
      lowerRow.includes("apply online") ||
      lowerRow.includes("download notification") ||
      lowerRow.includes("official website") ||
      lowerRow.includes("download admit card") ||
      lowerRow.includes("download result") ||
      lowerRow.includes("download answer key") ||
      lowerRow.includes("check exam city")
    ) {
      const linkEl = $(tr).find("a").first();
      const rawLink = linkEl.attr("href")?.trim() || "";
      const label = $(tr).find("td").first().text().replace(/\s+/g, " ").trim() || rowText;
      const officialResolved = resolveOfficialGovUrl(postTitle, rawLink);

      if (label && !label.toLowerCase().includes("telegram") && !label.toLowerCase().includes("youtube")) {
        importantLinks.push({
          title: label.slice(0, 80),
          url: officialResolved,
          actionText: linkEl.text().trim() || "Click Here",
          isOfficial: true,
        });
      }
    }
  });

  if (importantLinks.length === 0) {
    const govUrl = resolveOfficialGovUrl(postTitle);
    importantLinks.push(
      {
        title: "Apply Online / Official Portal",
        url: govUrl,
        actionText: "Click Here (Official Portal)",
        isOfficial: true,
      },
      {
        title: "Official Government Website",
        url: govUrl,
        actionText: "Official Website ↗",
        isOfficial: true,
      }
    );
  }

  const parsedDetail = {
    slug,
    sourceUrl: targetUrl,
    boardName,
    postTitle,
    shortDetails: shortDetails || `${boardName} — ${postTitle}`,
    importantDates,
    applicationFee,
    feePaymentNote,
    ageLimit,
    totalPostsSummary,
    vacancyDetails,
    howToFill,
    importantLinks,
    fetchedAt: new Date(),
  };

  if (db) {
    await PostDetail.findOneAndUpdate({ slug }, parsedDetail, { upsert: true, new: true });
  }

  return parsedDetail;
}
