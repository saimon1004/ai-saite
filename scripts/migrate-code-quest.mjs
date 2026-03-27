#!/usr/bin/env node

/**
 * migrate-code-quest.mjs
 *
 * Converts code-quest chapter content into MDX blog posts
 * for the ai-saite Astro project.
 *
 * Source: ~/projects/tools/code-quest/content/
 * Target: ~/projects/saimon/ai-saite/src/data/
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

// ─── Paths ───────────────────────────────────────────────────────────────────

const SOURCE_ROOT = resolve(
  "/Users/saimoto_tatsuya/projects/tools/code-quest/content"
);
const TARGET_ROOT = resolve(
  "/Users/saimoto_tatsuya/projects/saimon/ai-saite/src/data"
);

const BLOG_DIR = join(TARGET_ROOT, "blog");
const QUIZ_DIR = join(TARGET_ROOT, "quizzes");
const FAQ_DIR = join(TARGET_ROOT, "faqs");

// ─── Arc name mapping ────────────────────────────────────────────────────────

const ARC_NAME_MAP = {
  founding: "創業編",
  growth: "成長編",
  crisis: "危機編",
  scale: "拡大編",
  beyond: "飛躍編",
};

// ─── SEO description generator ───────────────────────────────────────────────

function generateDescription(title, subtitle, skills) {
  const skillNames = skills.map((s) => s.name).join("・");
  return `${subtitle}。${skillNames}を実践的なストーリーで学ぶチャプター「${title}」。ShimaLinkの物語とともにスキルを身につけよう。`;
}

// ─── Strip first heading from markdown content ───────────────────────────────

/**
 * Remove the first line if it starts with "# ".
 * Returns the remaining content trimmed.
 */
function stripFirstHeading(content) {
  const lines = content.split("\n");
  if (lines.length > 0 && /^# /.test(lines[0])) {
    return lines.slice(1).join("\n").trim();
  }
  return content.trim();
}

/**
 * Convert the first "# " heading to "## " (downgrade to h2)
 * to maintain hierarchy within the blog article.
 * Leaves everything else intact.
 */
function downgradeFirstHeading(content) {
  const lines = content.split("\n");
  let replaced = false;
  for (let i = 0; i < lines.length; i++) {
    if (!replaced && /^# /.test(lines[i])) {
      lines[i] = "#" + lines[i]; // "# Foo" → "## Foo"
      replaced = true;
      break;
    }
  }
  return lines.join("\n");
}

// ─── YAML helpers ────────────────────────────────────────────────────────────

/**
 * Escape a string for safe YAML double-quoted value.
 */
function yamlStr(s) {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * Format skills array as YAML list with inline objects.
 */
function formatSkillsYaml(skills) {
  return skills
    .map(
      (s) =>
        `  - { category: ${yamlStr(s.category)}, name: ${yamlStr(s.name)}, level: ${yamlStr(s.level)} }`
    )
    .join("\n");
}

/**
 * Format prerequisites array as YAML inline list.
 */
function formatPrerequisites(prereqs) {
  if (!prereqs || prereqs.length === 0) return "[]";
  return `[${prereqs.map((p) => yamlStr(p)).join(", ")}]`;
}

// ─── Read helpers ────────────────────────────────────────────────────────────

function readJSON(filePath) {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function readMD(filePath) {
  return readFileSync(filePath, "utf-8");
}

function readMDSafe(filePath) {
  if (!existsSync(filePath)) return "";
  return readFileSync(filePath, "utf-8");
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log("=== Code-Quest → MDX Migration ===\n");

  // Create output directories
  for (const dir of [BLOG_DIR, QUIZ_DIR, FAQ_DIR]) {
    mkdirSync(dir, { recursive: true });
    console.log(`  Created: ${dir}`);
  }

  // Read curriculum
  const curriculum = readJSON(join(SOURCE_ROOT, "curriculum.json"));

  // Build arc lookup: arcId → arcName
  const arcNameLookup = {};
  for (const arc of curriculum.arcs) {
    arcNameLookup[arc.id] = ARC_NAME_MAP[arc.id] || arc.name;
  }

  // Collect all chapter slugs in order from curriculum
  const allChapterSlugs = curriculum.arcs.flatMap((arc) => arc.chapters);

  let processed = 0;
  let errors = [];

  for (const slug of allChapterSlugs) {
    const chapterDir = join(SOURCE_ROOT, "chapters", slug);

    // ── Read meta.json ──
    const metaPath = join(chapterDir, "meta.json");
    if (!existsSync(metaPath)) {
      errors.push(`${slug}: meta.json not found`);
      continue;
    }
    const meta = readJSON(metaPath);

    // ── Read story-intro.md ──
    const storyIntro = readMDSafe(join(chapterDir, "story-intro.md"));

    // ── Read story-conclusion.md ──
    const storyConclusion = readMDSafe(join(chapterDir, "story-conclusion.md"));

    // ── Read lesson files (sorted by filename) ──
    const lessonsDir = join(chapterDir, "lessons");
    let lessonFiles = [];
    if (existsSync(lessonsDir)) {
      lessonFiles = readdirSync(lessonsDir)
        .filter((f) => f.endsWith(".md"))
        .sort();
    }

    const lessonContents = lessonFiles.map((f) =>
      readMD(join(lessonsDir, f))
    );

    // ── Read quiz.json ──
    const quizPath = join(chapterDir, "quiz.json");
    const hasQuiz = existsSync(quizPath);

    // ── Read help.json ──
    const helpPath = join(chapterDir, "help.json");
    const hasHelp = existsSync(helpPath);

    // ── Generate MDX ──
    const chapterNumber = meta.order;
    const pubDay = String(chapterNumber).padStart(2, "0");
    const arcName = arcNameLookup[meta.storyArc] || meta.storyArc;
    const description = generateDescription(
      meta.title,
      meta.subtitle,
      meta.skills
    );

    // Build frontmatter
    const frontmatter = [
      "---",
      `title: ${yamlStr(meta.title)}`,
      `subtitle: ${yamlStr(meta.subtitle)}`,
      `description: ${yamlStr(description)}`,
      `pubDate: 2026-04-${pubDay}`,
      `chapter: ${chapterNumber}`,
      `arc: ${yamlStr(meta.storyArc)}`,
      `arcName: ${yamlStr(arcName)}`,
      "skills:",
      formatSkillsYaml(meta.skills),
      `estimatedMinutes: ${meta.estimatedMinutes}`,
      `prerequisites: ${formatPrerequisites(meta.prerequisites)}`,
      "---",
    ].join("\n");

    // Build imports
    const imports = [
      'import StoryPanel from "../../components/blog/StoryPanel.astro";',
      'import ChapterQuiz from "../../components/blog/ChapterQuiz.astro";',
      'import ChapterFaq from "../../components/blog/ChapterFaq.astro";',
      'import SeriesNav from "../../components/blog/SeriesNav.astro";',
    ].join("\n");

    // Build story intro section
    const introContent = stripFirstHeading(storyIntro);
    const storyIntroSection = [
      "<StoryPanel>",
      introContent,
      "</StoryPanel>",
    ].join("\n\n");

    // Build lessons section
    const lessonsSection = lessonContents
      .map((content) => downgradeFirstHeading(content).trim())
      .join("\n\n");

    // Build story conclusion section
    const conclusionContent = stripFirstHeading(storyConclusion);
    const storyConclusionSection = [
      '<StoryPanel variant="conclusion">',
      conclusionContent,
      "</StoryPanel>",
    ].join("\n\n");

    // Build quiz + FAQ + nav
    const quizSection = `<ChapterQuiz chapterId="${slug}" />`;
    const faqSection = `<ChapterFaq chapterId="${slug}" />`;
    const navSection = `<SeriesNav current={${chapterNumber}} />`;

    // Assemble full MDX
    const mdx = [
      frontmatter,
      "",
      imports,
      "",
      storyIntroSection,
      "",
      lessonsSection,
      "",
      storyConclusionSection,
      "",
      quizSection,
      "",
      faqSection,
      "",
      navSection,
      "",
    ].join("\n");

    // Write MDX file
    const mdxPath = join(BLOG_DIR, `${slug}.mdx`);
    writeFileSync(mdxPath, mdx, "utf-8");

    // Copy quiz.json
    if (hasQuiz) {
      copyFileSync(quizPath, join(QUIZ_DIR, `${slug}.json`));
    }

    // Copy help.json → faqs/{slug}.json
    if (hasHelp) {
      copyFileSync(helpPath, join(FAQ_DIR, `${slug}.json`));
    }

    processed++;
    console.log(
      `  [${String(processed).padStart(2, " ")}] ${slug} → blog/${slug}.mdx` +
        (hasQuiz ? " + quiz" : "") +
        (hasHelp ? " + faq" : "")
    );
  }

  console.log(`\n=== Done: ${processed} chapters migrated ===`);
  if (errors.length > 0) {
    console.log(`\n  Errors (${errors.length}):`);
    errors.forEach((e) => console.log(`    - ${e}`));
  }

  // Summary
  console.log(`\nOutput directories:`);
  console.log(`  Blog MDX: ${BLOG_DIR}`);
  console.log(`  Quizzes:  ${QUIZ_DIR}`);
  console.log(`  FAQs:     ${FAQ_DIR}`);
}

main();
