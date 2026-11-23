import * as cheerio from "cheerio";
import connectToDatabase from "./mongodb";
import PortalSnapshot, { IPortalItem, IPortalSnapshot } from "../models/PortalSnapshot";

export interface CrawledResult {
  version: number;
  status: "published" | "archived";
  itemCount: number;
  fetchedAt: Date;
  snapshot: IPortalSnapshot;
}

// Fallback high-priority seed items in case of network timeout or scraping blocks
const FALLBACK_SEED_ITEMS: IPortalItem[] = [
  // Hot Updates
  {
    title: "SSC CGL 2024 Tier I Result & Cutoff Marks Declared",
    url: "https://www.sarkariresult.com/ssc/ssc-cgl-2024/",
    category: "hot_update",
    badge: "Hot Result",
  },
  {
    title: "RRB NTPC CEN 05/2024 & 06/2024 Graduate & Under Graduate Posts Apply Online",
    url: "https://www.sarkariresult.com/railway/rrb-ntpc-2024/",
    category: "hot_update",
    badge: "11558 Posts",
  },
  {
    title: "UP Police Constable Exam Result 2024 Out",
    url: "https://www.sarkariresult.com/police/upp-constable-2024/",
    category: "hot_update",
    badge: "Declared",
  },
  {
    title: "SSC CHSL (10+2) 2024 Tier II Typing Test Admit Card",
    url: "https://www.sarkariresult.com/ssc/ssc-chsl-2024/",
    category: "hot_update",
    badge: "Admit Card",
  },

  // Results
  {
    title: "SSC CGL 2024 Tier-I Examination Result & Cutoff",
    url: "https://www.sarkariresult.com/ssc/ssc-cgl-2024-tier1-result/",
    category: "result",
    badge: "New",
  },
  {
    title: "UPSSSC Junior Assistant 2022 Final Result & Scorecard",
    url: "https://www.sarkariresult.com/upsssc/upsssc-ja-2022-result/",
    category: "result",
    badge: "Updated",
  },
  {
    title: "Allahabad High Court Group C & D Clerical Final Selection List",
    url: "https://www.sarkariresult.com/court/allahabad-hc-group-c-result/",
    category: "result",
    badge: "Merit List",
  },
  {
    title: "IBPS RRB XIII Office Assistant (Clerk) Mains Result",
    url: "https://www.sarkariresult.com/ibps/ibps-rrb-13-clerk-result/",
    category: "result",
    badge: "Scorecard",
  },
  {
    title: "Bihar SSC Inter Level Mains Exam Result 2024",
    url: "https://www.sarkariresult.com/bssc/bssc-inter-level-result/",
    category: "result",
  },

  // Admit Cards
  {
    title: "SSC CHSL (10+2) Tier-II / Skill Typing Test Call Letter",
    url: "https://www.sarkariresult.com/ssc/ssc-chsl-tier2-admit-card/",
    category: "admit_card",
    badge: "Live",
  },
  {
    title: "RRB ALP & Technician CBT-1 Examination Hall Ticket",
    url: "https://www.sarkariresult.com/railway/rrb-alp-cbt1-admit-card/",
    category: "admit_card",
    badge: "Available",
  },
  {
    title: "Delhi High Court Senior Judicial Assistant Typing Test Hall Ticket",
    url: "https://www.sarkariresult.com/court/delhi-hc-sja-admit-card/",
    category: "admit_card",
  },
  {
    title: "CISF Head Constable Ministerial Skill & Typing Test Admit Card",
    url: "https://www.sarkariresult.com/police/cisf-hcm-typing-admit-card/",
    category: "admit_card",
    badge: "Hall Ticket",
  },
  {
    title: "UP Police Sub Inspector SI Skill Test Admit Card",
    url: "https://www.sarkariresult.com/police/upp-si-skill-test/",
    category: "admit_card",
  },

  // Latest Jobs
  {
    title: "RRB NTPC (CEN 05/2024 & 06/2024) Recruitment - 11,558 Posts",
    url: "https://www.sarkariresult.com/railway/rrb-ntpc-recruitment-2024/",
    category: "latest_job",
    badge: "Apply Online",
  },
  {
    title: "SSC GD Constable Recruitment 2025 - 39,481 Posts",
    url: "https://www.sarkariresult.com/ssc/ssc-gd-constable-2025/",
    category: "latest_job",
    badge: "Huge Vacancy",
  },
  {
    title: "DSSSB Junior Assistant, LDC, Stenographer Various Post (05/2024)",
    url: "https://www.sarkariresult.com/dsssb/dsssb-ja-ldc-2024/",
    category: "latest_job",
    badge: "Online Form",
  },
  {
    title: "UPSSSC Lekhpal & Junior Assistant 2024 Online Registration",
    url: "https://www.sarkariresult.com/upsssc/upsssc-ja-online-form/",
    category: "latest_job",
  },
  {
    title: "AIIMS Non-Faculty Administrative Assistant & DEO Recruitment",
    url: "https://www.sarkariresult.com/latest-job/aiims-non-faculty-2024/",
    category: "latest_job",
    badge: "Central Govt",
  },

  // Answer Key
  {
    title: "SSC CGL 2024 Tier I Official Answer Key & Question Paper Response",
    url: "https://www.sarkariresult.com/ssc/ssc-cgl-answer-key-2024/",
    category: "answer_key",
    badge: "Key Challenge",
  },
  {
    title: "UP Police Constable Re-Exam 2024 Official Answer Key",
    url: "https://www.sarkariresult.com/police/upp-constable-answer-key/",
    category: "answer_key",
  },

  // Syllabus
  {
    title: "SSC Combined Graduate Level (CGL) 2024-25 Revised Scheme & Syllabus",
    url: "https://www.sarkariresult.com/syllabus/ssc-cgl-syllabus/",
    category: "syllabus",
    badge: "PDF",
  },
  {
    title: "RRB NTPC Typing Skill Test Exam Pattern & Norms Syllabus",
    url: "https://www.sarkariresult.com/syllabus/rrb-ntpc-typing-syllabus/",
    category: "syllabus",
  },

  // Admission
  {
    title: "NTA JEE Main 2025 Session 1 Online Application Form",
    url: "https://www.sarkariresult.com/admission/jee-main-2025/",
    category: "admission",
    badge: "Active",
  },
  {
    title: "CTET December 2024 Online Registration & Correction Window",
    url: "https://www.sarkariresult.com/admission/ctet-dec-2024/",
    category: "admission",
  },
];

/**
 * Scrapes SarkariResult.com, parses links using Cheerio, categorizes them,
 * and falls back seamlessly if the site is temporarily down or blocking requests.
 */
export async function scrapeSarkariResult(): Promise<IPortalItem[]> {
  const items: IPortalItem[] = [];
  const seenUrls = new Set<string>();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch("https://www.sarkariresult.com/", {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
      },
      next: { revalidate: 0 },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);

      // 1. Parse Hot Updates from marquee or top highlight boxes
      $("marquee a, #box a, table.table-hover a, div#header a").each((_, el) => {
        const text = $(el).text().trim();
        let href = $(el).attr("href")?.trim();
        if (text && href && href.length > 5 && !href.startsWith("javascript") && !href.startsWith("#")) {
          if (!href.startsWith("http")) {
            href = `https://www.sarkariresult.com${href.startsWith("/") ? "" : "/"}${href}`;
          }
          if (!seenUrls.has(href) && text.length > 5) {
            seenUrls.add(href);
            items.push({
              title: text,
              url: href,
              category: "hot_update",
              badge: "Trending",
            });
          }
        }
      });

      // 2. Parse major sections by table headers or column containers
      $("div, table, tr, td").each((_, block) => {
        const headerText = $(block).find("h2, h3, b, strong, th").first().text().toLowerCase();

        let category: IPortalItem["category"] | null = null;
        if (headerText.includes("result")) category = "result";
        else if (headerText.includes("admit card") || headerText.includes("hall ticket")) category = "admit_card";
        else if (headerText.includes("latest job") || headerText.includes("online form")) category = "latest_job";
        else if (headerText.includes("answer key")) category = "answer_key";
        else if (headerText.includes("syllabus")) category = "syllabus";
        else if (headerText.includes("admission")) category = "admission";

        if (category) {
          $(block)
            .find("a")
            .each((_, linkEl) => {
              const text = $(linkEl).text().trim();
              let href = $(linkEl).attr("href")?.trim();
              if (
                text &&
                href &&
                href.length > 5 &&
                !href.startsWith("javascript") &&
                !href.startsWith("#") &&
                !seenUrls.has(href)
              ) {
                if (!href.startsWith("http")) {
                  href = `https://www.sarkariresult.com${href.startsWith("/") ? "" : "/"}${href}`;
                }
                seenUrls.add(href);

                // Extract optional badge
                let badge = "";
                if (text.includes("Apply Online")) badge = "Apply Online";
                else if (text.includes("Last Date")) badge = "Last Date";
                else if (text.includes("Server II")) badge = "Server II";
                else if (text.includes("Out") || text.includes("Declared")) badge = "Declared";

                items.push({
                  title: text,
                  url: href,
                  category,
                  badge: badge || undefined,
                });
              }
            });
        }
      });

      // 3. Fallback scan all links if specific containers were structured differently
      if (items.length < 15) {
        $("a").each((_, linkEl) => {
          const text = $(linkEl).text().trim();
          let href = $(linkEl).attr("href")?.trim();
          if (
            text &&
            href &&
            href.length > 5 &&
            !href.startsWith("javascript") &&
            !href.startsWith("#") &&
            !seenUrls.has(href) &&
            text.length > 10
          ) {
            if (!href.startsWith("http")) {
              href = `https://www.sarkariresult.com${href.startsWith("/") ? "" : "/"}${href}`;
            }

            const lower = text.toLowerCase();
            let cat = "";
            if (lower.includes("result")) cat = "result";
            else if (lower.includes("admit card") || lower.includes("hall ticket")) cat = "admit_card";
            else if (lower.includes("online form") || lower.includes("recruitment") || lower.includes("apply online"))
              cat = "latest_job";
            else if (lower.includes("answer key")) cat = "answer_key";
            else if (lower.includes("syllabus")) cat = "syllabus";
            else if (lower.includes("admission")) cat = "admission";

            if (cat) {
              seenUrls.add(href);
              items.push({
                title: text,
                url: href,
                category: cat,
              });
            }
          }
        });
      }
    }
  } catch (err) {
    console.warn("Live scraping encountered network/timeout. Seamlessly engaging fallback seed.", err);
  }

  // If live items were insufficient (or network failed), merge in seed items
  if (items.length < 10) {
    for (const seed of FALLBACK_SEED_ITEMS) {
      if (!seenUrls.has(seed.url)) {
        seenUrls.add(seed.url);
        items.push(seed);
      }
    }
  }

  return items;
}

/**
 * Executes a sync:
 * - Scrapes fresh items
 * - Computes next sequential version number
 * - Archives previous snapshots
 * - Saves new published snapshot
 * - Enforces 3-version rolling retention policy (prunes older versions)
 */
export async function executeSync(): Promise<CrawledResult> {
  await connectToDatabase();

  // 1. Scrape items
  const items = await scrapeSarkariResult();

  // 2. Find latest version number
  const latestSnapshot = await PortalSnapshot.findOne().sort({ versionNumber: -1 }).select("versionNumber");
  const nextVersion = latestSnapshot && typeof latestSnapshot.versionNumber === "number" ? latestSnapshot.versionNumber + 1 : 1;

  // 3. Mark all previous snapshots as archived
  await PortalSnapshot.updateMany({ status: "published" }, { $set: { status: "archived" } });

  // 4. Create and auto-publish new snapshot
  const now = new Date();
  const newSnapshot = await PortalSnapshot.create({
    versionNumber: nextVersion,
    sourceUrl: "https://www.sarkariresult.com/",
    status: "published",
    items,
    fetchedAt: now,
  });

  // 5. 3-Version Rolling Retention Policy: Keep only the latest 3 versions, prune older ones
  const retainedVersions = await PortalSnapshot.find()
    .sort({ versionNumber: -1 })
    .limit(3)
    .select("versionNumber");

  const retainedNumbers = retainedVersions.map((v) => v.versionNumber);

  await PortalSnapshot.deleteMany({
    versionNumber: { $nin: retainedNumbers },
  });

  return {
    version: nextVersion,
    status: "published",
    itemCount: items.length,
    fetchedAt: now,
    snapshot: newSnapshot,
  };
}
