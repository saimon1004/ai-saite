# 「顔の見えるFAQ」LP 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 保険・共済・互助会・葬祭事業者向けに、動画FAQチャットボット「顔の見えるFAQ」を売る1ページのLPを `sai-mon.co.jp/video-faq/` に公開する。

**Architecture:** Astro 5 の静的ページ1枚（`src/pages/video-faq.astro`）＋ `public/` 配下の外部CSS（スコープ `.vfaq-lp-scope`）。既存LP `src/pages/subsc-design.astro` の構成規約をそのまま踏襲し、フォーム送信・GA4計測・BudouX適用のスクリプトも同ファイルから移植する。テストフレームワークは無いため、各タスクの検証は「ビルド成功」＋「ブラウザ実測（はみ出し0件・行充填率）」で行う。

**Tech Stack:** Astro 5 / Tailwind CSS v4（グローバル）/ 素のCSS（LPスコープ）/ budoux ^0.8.4 / Xserver + GitHub Actions デプロイ

**仕様書:** `docs/superpowers/specs/2026-07-30-kao-no-mieru-faq-lp-design.md`

---

## 前提の確認（実装前に読むこと）

- 日本語組版ルール: `~/Claude Code/.claude/references/jp-typography-rules.md`
- UI設計ルール: `~/Claude Code/.claude/references/frontend-ui-rules.md`
- **`subsc-design.astro` の `.orb`（グラデーションオーブ）は真似しない。** frontend-ui-rules が明確に禁止している既存の違反箇所。本LPには持ち込まない。
- **元LP（https://www.syou-getsu.biz/lp/video-faq/）の数値を転記しない。** 「gzip後14KB」は誤り。実測は 18,190 bytes なので「約18KB」と書く。
- 書いてはいけない主張は仕様書 §5 の表を参照。

## ファイル構成

| 種別 | パス | 責務 |
| --- | --- | --- |
| 新規 | `src/pages/video-faq.astro` | ページ本体（frontmatter の JSON-LD、全11セクションのマークアップ、末尾スクリプト） |
| 新規 | `public/video-faq/styles.css` | LP専用CSS（全セレクタ `.vfaq-lp-scope` 接頭辞） |
| 新規 | `public/video-faq/assets/hero.jpg` | ヒーロー背景（PC・横長 1536x1024） |
| 新規 | `public/video-faq/assets/hero-m.jpg` | ヒーロー背景（モバイル・縦長 1024x1536） |
| 修正 | `src/data/navigation.ts` | ナビに「顔の見えるFAQ」を追加 |

1ページ完結なのでコンポーネント分割はしない（既存LP 3本と同じ方針）。

---

## Task 1: ヒーロー背景画像を生成する

frontend-ui-rules により、ヒーローはグラデ/SVGだけでは不可。実写または生成ビットマップが必須。

**Files:**
- Create: `public/video-faq/assets/hero.jpg`
- Create: `public/video-faq/assets/hero-m.jpg`

- [ ] **Step 1: ディレクトリを作る**

```bash
mkdir -p ~/projects/saimon/ai-saite/public/video-faq/assets
```

- [ ] **Step 2: `gen-image` スキルで PC 用画像を生成する**

**Codex内蔵 `image_gen` の制約（2026-07-30 実測）:** 出力サイズは `1536x1024` / `1024x1536` / `1024x1024` の3種のみ。厳密な 16:9 や 4:5 は出せない。出力形式は PNG。

したがって **PC用は `1536x1024`（3:2）で生成し、CSS の `object-fit: cover` でトリミングする**。PNG で出たら `sips -s format jpeg` で JPEG に変換して `hero.jpg` にする。

```bash
sips -s format jpeg <生成されたPNG> --out /Users/saimoto_tatsuya/projects/saimon/ai-saite/public/video-faq/assets/hero.jpg
```

Skill ツールで `gen-image` を起動し、次のプロンプトを渡す。

```
1536x1024 horizontal photograph. A calm, dignified consultation space in Japan: a woman in her early 60s sits at a warm wood table, looking at a tablet screen held at a comfortable angle, receiving a gentle explanation. Soft natural light from a window on the left. Warm wood grain, soft neutral fabric upholstery, a single small plant out of focus in the background. The hands and the tablet are the focal point; faces are calm and unstrained. Respectful, reassuring, quietly professional mood. Muted warm neutrals with a hint of cool blue in the shadows. Shallow depth of field.
Absolutely avoid: hospital or clinical settings, funeral or mourning imagery, black clothing, flowers arranged as offerings, sadness, crying, dark or gloomy lighting, stock-photo handshake poses.
no text, no lettering, no branding, no watermark, no logos, no UI overlays
```

- [ ] **Step 3: モバイル用画像を生成する**

同じスキルで、`1536x1024 horizontal` を `1024x1536 vertical` に置き換えたプロンプトを渡す。構図は「手元とタブレットに寄る（closer crop on the hands and the tablet）」ことを明示する。生成後、同じく `sips -s format jpeg` で `hero-m.jpg` に変換する。

- [ ] **Step 4: 生成物を Read（画像）で目視確認する**

Read ツールで `public/video-faq/assets/hero.jpg` と `hero-m.jpg` を開き、次を確認する。

- 文字・ロゴ・ウォーターマークが写り込んでいない
- 喪・病院・悲嘆を思わせる要素がない
- 顔や手が破綻していない
- テキストを重ねられる余白（左側または上部）がある

いずれか満たさない場合はプロンプトを調整して再生成する。**目視せずに次へ進まない。**

- [ ] **Step 5: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add public/video-faq/assets/hero.jpg public/video-faq/assets/hero-m.jpg
git commit -m "feat(video-faq): ヒーロー背景画像を追加"
```

---

## Task 2: CSSの土台を作る（パレット＋日本語組版標準）

**Files:**
- Create: `public/video-faq/styles.css`

- [ ] **Step 1: パレットと日本語組版の標準を書く**

`public/video-faq/styles.css` を新規作成し、以下を先頭に置く。

```css
/* ============================================================
   顔の見えるFAQ LP styles
   scope: .vfaq-lp-scope（他ページへの影響を避けるため全て接頭辞付き）
   palette: navy #0d0084 / teal #31b9b5 / paper #faf9f7
   ============================================================ */

.vfaq-lp-scope {
  --navy: #0d0084;
  --navy-deep: #070046;
  --teal: #31b9b5;
  --teal-deep: #1f8d8a;
  --ink: #1b2430;
  --muted: #5d6672;
  --line: #e3e1dc;
  --paper: #faf9f7;
  --white: #ffffff;
  --ok: #1f7a4d;
  --err: #b3261e;
  color: var(--ink);
  background: var(--paper);
  font-feature-settings: "palt";
  line-height: 1.85;
  overflow-x: clip;
}

/* ---- 日本語折り返し品質（全ページ共通の標準） ---- */
/* balance は見出し専用（本文に使うと行が均等に短くなり右側が空く） */
.vfaq-lp-scope h1,
.vfaq-lp-scope h2,
.vfaq-lp-scope h3 {
  text-wrap: balance;
  word-break: auto-phrase;
  letter-spacing: -0.01em;
}
.vfaq-lp-scope .section-lead,
.vfaq-lp-scope .hero-lead {
  text-wrap: pretty;
  word-break: auto-phrase;
}
.vfaq-lp-scope p,
.vfaq-lp-scope li,
.vfaq-lp-scope figcaption,
.vfaq-lp-scope small,
.vfaq-lp-scope .note,
.vfaq-lp-scope .faq-a {
  text-wrap: pretty;
  word-break: auto-phrase;
}
.vfaq-lp-scope .fine-print {
  text-align: left;
  max-width: 640px;
  margin-inline: auto;
  line-height: 1.85;
}
/* BudouXが挿入する文節区切り（ZWSP）でのみ折り返す（Safari含む全ブラウザ対応） */
.vfaq-lp-scope .jp-budoux {
  word-break: keep-all;
}
/* 幅制限ブロックは中央寄せが既定 */
.vfaq-lp-scope form,
.vfaq-lp-scope .faq-list {
  margin-inline: auto;
}
@media (max-width: 640px) {
  /* 短い行長では文節折り返しが右側の空きを生むため、本文は通常折り返しに戻す */
  .vfaq-lp-scope p,
  .vfaq-lp-scope li,
  .vfaq-lp-scope figcaption,
  .vfaq-lp-scope small,
  .vfaq-lp-scope .note,
  .vfaq-lp-scope .faq-a {
    word-break: normal;
  }
  .vfaq-lp-scope .section-lead,
  .vfaq-lp-scope .hero-lead {
    word-break: auto-phrase;
  }
}

/* ---- セクション余白の基準（PC 60px / モバイル 44px） ---- */
.vfaq-lp-scope .section-block {
  padding: 60px 20px;
}
.vfaq-lp-scope .section-inner {
  max-width: 1040px;
  margin-inline: auto;
}
.vfaq-lp-scope .section-heading {
  margin-bottom: 32px;
}
.vfaq-lp-scope .section-kicker {
  font-family: "Inter", system-ui, sans-serif;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--teal-deep);
  margin-bottom: 8px;
}
@media (max-width: 640px) {
  .vfaq-lp-scope .section-block {
    padding: 44px 18px;
  }
}

/* ---- Safari対策の文節塊 ---- */
.vfaq-lp-scope .no-break {
  white-space: nowrap;
}
```

- [ ] **Step 2: 禁止事項をCSSレベルで守る**

以下を **書かない**（frontend-ui-rules）。

- グラデーションオーブ / ボケ玉（`filter: blur()` の装飾円、`.orb` 等）
- カードの中のカード
- セクション全体を浮いたカードにする `box-shadow` + `border-radius` の組み合わせ
- `font-size: Nvw` による本文サイズのスケール
- カードの `border-radius` は 8px 以下に収める

- [ ] **Step 3: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add public/video-faq/styles.css
git commit -m "feat(video-faq): LP用CSSの土台（パレット・日本語組版標準）を追加"
```

---

## Task 3: ページ骨格とヒーローを作る

**Files:**
- Create: `src/pages/video-faq.astro`
- Modify: `public/video-faq/styles.css`（ヒーローのスタイルを追記）

- [ ] **Step 1: frontmatter を書く**

`src/pages/video-faq.astro` を新規作成し、frontmatter を次の通り書く。`faqEntity` の中身は Task 11 で FAQ 本文と一致させるため、この時点では空配列にせず Task 11 で全問を入れる。ここでは Organization / Service / BreadcrumbList を先に置く。

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/common/Header.astro";
import Footer from "../components/common/Footer.astro";

const base = import.meta.env.BASE_URL;
// CSSはXserverで1年間キャッシュされるため、内容変更時はバージョンを上げてキャッシュバストする
const cssVersion = "20260730-v1";
const cssHref = `${base}video-faq/styles.css?v=${cssVersion}`;

const heroImg = `${base}video-faq/assets/hero.jpg`;
const heroImgM = `${base}video-faq/assets/hero-m.jpg`;

const pageUrl = "https://sai-mon.co.jp/video-faq/";
// 実演デモ（ほんりゅう提供の動作確認用サンプルサイト。別業種・架空企業である旨をページ本文に明記する）
const demoUrl = "https://sunrise-travel-recruit.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://sai-mon.co.jp/#organization",
      name: "株式会社SAIMON",
      url: "https://sai-mon.co.jp/",
      logo: "https://sai-mon.co.jp/logo.png",
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "顔の見えるFAQ",
      serviceType: "動画FAQチャットボットの導入・運用支援",
      description:
        "保険・共済・互助会・葬祭事業者向けの動画FAQチャットボット。解約返戻金や保障範囲など文章では伝わりにくい質問に、担当者が動画で答えます。Webサイトにタグを貼るだけで導入でき、質問設計から動画制作までSAIMONが対応します。",
      url: pageUrl,
      provider: { "@id": "https://sai-mon.co.jp/#organization" },
      areaServed: "JP",
      audience: {
        "@type": "Audience",
        audienceType: "保険会社・少額短期保険・共済・冠婚葬祭互助会・葬祭事業者",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://sai-mon.co.jp/" },
        { "@type": "ListItem", position: 2, name: "顔の見えるFAQ", item: pageUrl },
      ],
    },
  ],
};
---
```

- [ ] **Step 2: BaseLayout の呼び出しと head を書く**

Meta Pixel は入れない（仕様書 §6-4：広告出稿の予定が未定のため）。自作チャットボットは非表示にする。

```astro
<BaseLayout
  title="顔の見えるFAQ｜保険・互助会・葬祭のための動画FAQ"
  description="保険・共済・互助会・葬祭のための動画FAQ「顔の見えるFAQ」。解約返戻金や保障の範囲など、文章では伝わりにくい質問に担当者が動画で答えます。Webサイトにタグを貼るだけで導入でき、字幕・視聴データの計測に対応。質問の洗い出しから動画制作までSAIMONがお引き受けします。"
  jsonLd={jsonLd}
>
  <Fragment slot="head">
    <!-- 研修LP向けのFAQ動画チャットボット（BaseLayout共通）は、本LPで売る商品とは別実装のため誤認を避けて非表示にする -->
    <style is:global>#faq-chatbot-root { display: none !important; }</style>
  </Fragment>
  <link rel="preload" as="image" href={heroImg} slot="head" />
  <link rel="stylesheet" href={cssHref} slot="head" />

  <Header />

  <main class="vfaq-lp-scope">
```

- [ ] **Step 3: ヒーローのマークアップを書く**

H1 はサービス名（frontend-ui-rules: LPのH1はブランド名/商品名。説明的な文言は補助コピーへ）。ヒーロー文はカードに入れない。日本語の文はソース内で改行しない。

```astro
    <!-- 01 Hero -->
    <section class="hero" aria-labelledby="hero-title">
      <picture class="hero-media" aria-hidden="true">
        <source media="(max-width: 640px)" srcset={heroImgM} />
        <img src={heroImg} alt="" decoding="async" fetchpriority="high" />
      </picture>
      <div class="hero-inner">
        <p class="hero-kicker">保険・共済・互助会・葬祭のための動画FAQ</p>
        <h1 id="hero-title">顔の見えるFAQ</h1>
        <p class="hero-lead jp-budoux">「解約したらいくら戻るのか」「どこまで保障されるのか」。文章にすると長くなる質問に、担当者が動画で答えます。Webサイトにタグを貼るだけで導入できます。</p>
        <div class="hero-actions">
          <a class="primary-cta" href={demoUrl} target="_blank" rel="noopener" data-cta-source="hero-demo">実装デモを触る<span aria-hidden="true">→</span></a>
          <a class="secondary-cta" href="#contact-form" data-cta-source="hero-primary">無料相談する</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 4: ヒーローのCSSを追記する**

`public/video-faq/styles.css` に追記する。**次セクションの気配が見える高さ**にすること（`100vh` にしない）。

```css
/* ---- Hero ---- */
.vfaq-lp-scope .hero {
  position: relative;
  min-height: 62vh;
  display: flex;
  align-items: flex-end;
  padding: 80px 20px 48px;
  overflow: hidden;
}
.vfaq-lp-scope .hero-media {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.vfaq-lp-scope .hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 60% 50%;
}
/* テキスト可読性のためのオーバーレイ（装飾のグラデ玉ではない） */
.vfaq-lp-scope .hero::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(100deg, rgba(7, 0, 70, 0.82) 0%, rgba(7, 0, 70, 0.58) 46%, rgba(7, 0, 70, 0.12) 100%);
}
.vfaq-lp-scope .hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1040px;
  margin-inline: auto;
  width: 100%;
  color: var(--white);
}
.vfaq-lp-scope .hero-kicker {
  font-size: 14px;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
}
.vfaq-lp-scope .hero h1 {
  font-size: clamp(38px, 6vw, 68px);
  line-height: 1.18;
  font-weight: 800;
  margin-bottom: 20px;
}
.vfaq-lp-scope .hero-lead {
  max-width: 30em;
  font-size: 17px;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 28px;
}
.vfaq-lp-scope .hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.vfaq-lp-scope .primary-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 26px;
  border-radius: 8px;
  background: var(--teal);
  color: #06231f;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease;
}
.vfaq-lp-scope .primary-cta:hover {
  background: var(--teal-deep);
  color: var(--white);
}
.vfaq-lp-scope .secondary-cta {
  display: inline-flex;
  align-items: center;
  padding: 15px 26px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: var(--white);
  font-weight: 700;
  text-decoration: none;
}
.vfaq-lp-scope .secondary-cta:hover {
  background: rgba(255, 255, 255, 0.12);
}
@media (max-width: 640px) {
  .vfaq-lp-scope .hero {
    min-height: 58vh;
    padding: 64px 18px 36px;
  }
  .vfaq-lp-scope .hero h1 {
    font-size: clamp(32px, 9vw, 44px);
  }
  .vfaq-lp-scope .hero-lead {
    font-size: 16px;
  }
}
```

`clamp()` の中間値に `vw` を使っているが、これは**ヒーローのH1のみ**。本文には使わない（frontend-ui-rules）。

- [ ] **Step 5: 一旦閉じてビルドを通す**

`</main>`、`<Footer />`、`</BaseLayout>` を仮で閉じてビルドする。

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了し、`dist/video-faq/index.html` が生成される。

- [ ] **Step 6: 生成物を確認する**

```bash
cd ~/projects/saimon/ai-saite && test -f dist/video-faq/index.html && grep -c "顔の見えるFAQ" dist/video-faq/index.html
```

Expected: `1` 以上の数字が出る（0 や `No such file` は失敗）。

- [ ] **Step 7: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/pages/video-faq.astro public/video-faq/styles.css
git commit -m "feat(video-faq): ページ骨格とヒーローを実装"
```

---

## Task 4: 課題セクション（S2）

**Files:**
- Modify: `src/pages/video-faq.astro`
- Modify: `public/video-faq/styles.css`

- [ ] **Step 1: マークアップとコピーを書く**

ヒーローの直後に挿入する。カードは「反復する個別アイテム」なのでカード化してよい（角丸8px以下）。**セクション自体はカードにしない。**

```astro
    <!-- 02 Problem -->
    <section class="problem section-block" aria-labelledby="problem-title">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-kicker">Problem</p>
          <h2 id="problem-title"><span class="no-break">その質問、今週も</span><wbr /><span class="no-break">電話で答えていませんか</span></h2>
          <p class="section-lead jp-budoux">保険・共済・互助会・葬祭の窓口で、繰り返し起きていることです。</p>
        </div>
        <ul class="problem-grid">
          <li class="problem-card">
            <h3>「解約したらいくら戻るの」を説明し続けている</h3>
            <p class="jp-budoux">同じ質問への説明で、担当者の時間が毎日削られていきます。書面を送っても「読んでも分からない」と、結局電話がかかってきます。</p>
          </li>
          <li class="problem-card">
            <h3>資料請求の前に、静かに離脱されている</h3>
            <p class="jp-budoux">検討している人が知りたいのは、パンフレットに書いてある一般論ではなく「自分の場合はどうなるか」です。文章だけのFAQでは、その不安は消えません。</p>
          </li>
          <li class="problem-card">
            <h3>高齢のお客様が、Webの文章を読んでくれない</h3>
            <p class="jp-budoux">文字を追うことが負担な方に、長い説明文は届きません。結局電話に頼ることになり、窓口の負荷が下がりません。</p>
          </li>
          <li class="problem-card">
            <h3>説明の質が、担当者によってばらついている</h3>
            <p class="jp-budoux">誰が答えても同じ説明になっているか、確かめる手段がありません。この業界では、それ自体がリスクになります。</p>
          </li>
        </ul>
        <p class="problem-close jp-budoux">この4つは、答える人の顔と声が見えるだけで大きく変わります。</p>
      </div>
    </section>
```

**日本語の文をソース内で改行しないこと。** 上のコピーは1行で書き切っている。エディタの自動折り返しで改行を入れると、その位置が半角スペースになって行末が空く。

- [ ] **Step 2: CSSを追記する**

```css
/* ---- Problem ---- */
.vfaq-lp-scope .problem {
  background: var(--white);
}
.vfaq-lp-scope .problem-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
}
.vfaq-lp-scope .problem-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 22px 20px;
  background: var(--paper);
}
.vfaq-lp-scope .problem-card h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 10px;
  line-height: 1.5;
}
.vfaq-lp-scope .problem-card p {
  font-size: 15px;
  color: var(--muted);
  margin: 0;
}
.vfaq-lp-scope .problem-close {
  font-size: 17px;
  font-weight: 700;
  color: var(--navy);
  text-align: center;
  max-width: 34em;
  margin-inline: auto;
}
@media (max-width: 640px) {
  .vfaq-lp-scope .problem-grid {
    grid-template-columns: 1fr;
  }
  .vfaq-lp-scope .problem-close {
    text-align: left;
  }
}
```

- [ ] **Step 3: ビルドして通す**

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了。

- [ ] **Step 4: 日本語の途中に半角スペースが入っていないか実測する**

ソース内で日本語の文を改行すると、ビルド後に半角スペースへ化けて折り返し点になる（最頻出の事故）。ビルド成果物から機械的に検出する。

```bash
cd ~/projects/saimon/ai-saite && python3 -c "
import re, html
src = open('dist/video-faq/index.html', encoding='utf-8').read()
text = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', src, flags=re.S)
text = html.unescape(re.sub(r'<[^>]+>', chr(10), text))
cjk = r'[぀-ヿ一-鿿]'
hits = re.findall(cjk + r' ' + cjk, text)
print('count=', len(hits))
for h in hits[:20]: print(repr(h))
"
```

**タグは空文字ではなく改行（`chr(10)`）に置換すること。** 空文字に置換すると隣接ブロック要素（`</h2>` と `<p>` など）のテキストが連結され、タグ間の空白を「文中の半角スペース」として拾ってしまい偽陽性が大量に出る（2026-07-30 に実測：空文字だと33件、改行だと0件）。検出したいのは**同一テキストノード内**の半角スペースだけ。

Expected: `count= 0`

0でない場合、出力されたペアを `src/pages/video-faq.astro` で検索し、その文が複数行に分かれていないか確認して1行に直す。

**このチェックは以降の各セクション実装後にも同じコマンドで再実行する。**

- [ ] **Step 5: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/pages/video-faq.astro public/video-faq/styles.css
git commit -m "feat(video-faq): 課題セクションを実装"
```

---

## Task 5: 仕組みセクション（S3）

**Files:**
- Modify: `src/pages/video-faq.astro`
- Modify: `public/video-faq/styles.css`

- [ ] **Step 1: マークアップとコピーを書く**

```astro
    <!-- 03 How it works -->
    <section class="how section-block" aria-labelledby="how-title">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-kicker">How it works</p>
          <h2 id="how-title"><span class="no-break">質問をタップすると、</span><wbr /><span class="no-break">動画が再生されるだけ</span></h2>
          <p class="section-lead jp-budoux">導入も運用も、専門知識は必要ありません。</p>
        </div>
        <ol class="step-list">
          <li class="step-item">
            <span class="step-num" aria-hidden="true">1</span>
            <div class="step-body">
              <h3>Webサイトにタグを貼る</h3>
              <p class="jp-budoux">発行されたタグを、貴社サイトに貼り付けます。ページを作り直す必要はありません。</p>
            </div>
          </li>
          <li class="step-item">
            <span class="step-num" aria-hidden="true">2</span>
            <div class="step-body">
              <h3>質問と回答動画を登録する</h3>
              <p class="jp-budoux">管理画面からカテゴリ・質問・回答動画を登録します。登録した内容はすぐサイトに反映されます。</p>
            </div>
          </li>
          <li class="step-item">
            <span class="step-num" aria-hidden="true">3</span>
            <div class="step-body">
              <h3>お客様が質問をタップする</h3>
              <p class="jp-budoux">サイト右下のボタンから質問を選ぶと、回答動画が再生されます。字幕が出るので、音を出せない場所でも読めます。</p>
            </div>
          </li>
          <li class="step-item">
            <span class="step-num" aria-hidden="true">4</span>
            <div class="step-body">
              <h3>視聴データを確認する</h3>
              <p class="jp-budoux">どの質問がよく見られているか、最後まで見られているかを管理画面で確認できます。</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
```

- [ ] **Step 2: CSSを追記する**

```css
/* ---- How it works ---- */
.vfaq-lp-scope .step-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 18px;
}
.vfaq-lp-scope .step-item {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 16px;
  align-items: start;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line);
}
.vfaq-lp-scope .step-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.vfaq-lp-scope .step-num {
  display: grid;
  place-items: center;
  width: 44px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--navy);
  color: var(--white);
  font-family: "Inter", system-ui, sans-serif;
  font-weight: 700;
  font-size: 18px;
}
.vfaq-lp-scope .step-body h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 6px;
}
.vfaq-lp-scope .step-body p {
  font-size: 15px;
  color: var(--muted);
  margin: 0;
}
```

`.step-num` は `aspect-ratio: 1` で寸法を固定する（frontend-ui-rules: 寸法固定UIがホバー・動的内容でズレないこと）。

- [ ] **Step 3: ビルドして通す**

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了。

- [ ] **Step 4: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/pages/video-faq.astro public/video-faq/styles.css
git commit -m "feat(video-faq): 仕組みセクションを実装"
```

---

## Task 6: 実演デモセクション（S4）

デモの実態（別業種・架空企業のサンプル）を隠さないことがこのタスクの要点。

**Files:**
- Modify: `src/pages/video-faq.astro`
- Modify: `public/video-faq/styles.css`

- [ ] **Step 1: マークアップとコピーを書く**

```astro
    <!-- 04 Demo -->
    <section id="demo" class="demo section-block" aria-labelledby="demo-title">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-kicker">Demo</p>
          <h2 id="demo-title"><span class="no-break">実際に触って</span><wbr /><span class="no-break">確かめてください</span></h2>
          <p class="section-lead jp-budoux">下のリンクから、ウィジェットが埋め込まれたページを開けます。右下のボタンをタップすると、質問の選び方から動画の再生、字幕の表示まで、実際の操作感をそのまま確認できます。</p>
        </div>
        <a class="primary-cta" href={demoUrl} target="_blank" rel="noopener" data-cta-source="demo-section">デモを開く<span aria-hidden="true">→</span></a>
        <p class="fine-print jp-budoux">このデモは別業種（採用サイト）での実装例で、動作確認のために用意されたサンプルサイトです。実在企業の運用サイトではありません。ウィジェットの動作と操作感は業種を問わず同じで、変わるのは質問と回答動画の中身です。</p>
      </div>
    </section>
```

- [ ] **Step 2: CSSを追記する**

`.fine-print` は Task 2 で「左揃え・中央ブロック」を定義済み。デモセクション固有の余白だけ足す。

```css
/* ---- Demo ---- */
.vfaq-lp-scope .demo {
  background: var(--white);
  text-align: center;
}
.vfaq-lp-scope .demo .section-lead {
  max-width: 40em;
  margin-inline: auto;
}
.vfaq-lp-scope .demo .fine-print {
  margin-top: 24px;
  font-size: 14px;
  color: var(--muted);
}
@media (max-width: 640px) {
  .vfaq-lp-scope .demo {
    text-align: left;
  }
  .vfaq-lp-scope .demo .section-lead {
    text-align: left;
  }
}
```

- [ ] **Step 3: ビルドして通す**

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了。

- [ ] **Step 4: デモURLが生きているか確認する**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://sunrise-travel-recruit.vercel.app
```

Expected: `200`。200以外ならデモリンクを外し、代替（LP内で操作の様子を見せる）に切り替えて齋本さんに報告する。

- [ ] **Step 5: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/pages/video-faq.astro public/video-faq/styles.css
git commit -m "feat(video-faq): 実演デモセクションを実装"
```

---

## Task 7: この業界に効く理由（S5）

**Files:**
- Modify: `src/pages/video-faq.astro`
- Modify: `public/video-faq/styles.css`

- [ ] **Step 1: マークアップとコピーを書く**

```astro
    <!-- 05 Why this industry -->
    <section class="why section-block" aria-labelledby="why-title">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-kicker">Why</p>
          <h2 id="why-title"><span class="no-break">なぜ、保険・互助会・葬祭で</span><wbr /><span class="no-break">効くのか</span></h2>
        </div>
        <ul class="why-list">
          <li>
            <h3>聞きにくい質問こそ、人が答えると伝わる</h3>
            <p class="jp-budoux">費用のこと、家族に何が起きるか。文章では冷たく読めてしまう質問が、人の声と表情で説明されると受け取り方が変わります。</p>
          </li>
          <li>
            <h3>読ませるより、見せるほうが届く</h3>
            <p class="jp-budoux">高齢のお客様に長い説明文を読ませるのは負担です。タップして見るだけなら、操作も理解も軽くなります。</p>
          </li>
          <li>
            <h3>説明を固定できるので、ばらつきがなくなる</h3>
            <p class="jp-budoux">一度撮った動画は、誰が対応しても同じ説明を届けます。台本が残るので、社内の確認も通しやすくなります。</p>
          </li>
          <li>
            <h3>同じ質問への電話が減る</h3>
            <p class="jp-budoux">よく聞かれる質問を先に動画で答えておけば、窓口にかかる電話の総量が下がります。</p>
          </li>
        </ul>
      </div>
    </section>
```

- [ ] **Step 2: CSSを追記する**

```css
/* ---- Why ---- */
.vfaq-lp-scope .why-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px 32px;
}
.vfaq-lp-scope .why-list h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 8px;
  padding-left: 14px;
  border-left: 3px solid var(--teal);
  line-height: 1.5;
}
.vfaq-lp-scope .why-list p {
  font-size: 15px;
  color: var(--muted);
  margin: 0;
}
@media (max-width: 640px) {
  .vfaq-lp-scope .why-list {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
```

- [ ] **Step 3: ビルドして通す**

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了。

- [ ] **Step 4: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/pages/video-faq.astro public/video-faq/styles.css
git commit -m "feat(video-faq): 業界適合の理由セクションを実装"
```

---

## Task 8: 機能セクション（S6）

**Files:**
- Modify: `src/pages/video-faq.astro`
- Modify: `public/video-faq/styles.css`

- [ ] **Step 1: マークアップとコピーを書く**

軽量性は実測値（gzip 18,190 bytes → 約18KB）で書く。元LPの「14KB」は使わない。

```astro
    <!-- 06 Features -->
    <section class="features section-block" aria-labelledby="features-title">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-kicker">Features</p>
          <h2 id="features-title">機能</h2>
        </div>
        <ul class="feature-grid">
          <li class="feature-card">
            <h3>タグを貼るだけで導入できる</h3>
            <p class="jp-budoux">HTMLが書き込めるサイトならどこでも動きます。サイトを作り直す必要はありません。</p>
          </li>
          <li class="feature-card">
            <h3>ブランドカラーに合わせられる</h3>
            <p class="jp-budoux">ボタンやヘッダーの色を、貴社のブランドカラーに変更できます。</p>
          </li>
          <li class="feature-card">
            <h3>カテゴリで整理できる</h3>
            <p class="jp-budoux">質問が増えても、カテゴリで分けて選びやすい状態を保てます。</p>
          </li>
          <li class="feature-card">
            <h3>字幕に対応している</h3>
            <p class="jp-budoux">音を出せない場所でも読めます。聞き取りにくい方にも内容が届きます。</p>
          </li>
          <li class="feature-card">
            <h3>視聴データが見える</h3>
            <p class="jp-budoux">起動回数・再生数・視聴完了率・よく見られている質問・訪問者数を管理画面で確認できます。</p>
          </li>
          <li class="feature-card">
            <h3>スマホで全画面表示になる</h3>
            <p class="jp-budoux">スマホでは全画面、PCでは右下に表示されます。</p>
          </li>
        </ul>
        <p class="fine-print jp-budoux">ウィジェットはサイト本体の表示を妨げない独立したJavaScriptです（実測 gzip 約18KB）。CSSも独自のスコープで管理しているため、既存サイトのデザインには干渉しません。</p>
      </div>
    </section>
```

- [ ] **Step 2: CSSを追記する**

```css
/* ---- Features ---- */
.vfaq-lp-scope .features {
  background: var(--white);
}
.vfaq-lp-scope .feature-grid {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.vfaq-lp-scope .feature-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 20px 18px;
}
.vfaq-lp-scope .feature-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 8px;
  line-height: 1.5;
}
.vfaq-lp-scope .feature-card p {
  font-size: 14px;
  color: var(--muted);
  margin: 0;
}
@media (max-width: 900px) {
  .vfaq-lp-scope .feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .vfaq-lp-scope .feature-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: ビルドして通す**

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了。

- [ ] **Step 4: 禁止した数値が入っていないか確認する**

```bash
cd ~/projects/saimon/ai-saite && grep -n "14KB\|14kb" src/pages/video-faq.astro; echo "exit=$?"
```

Expected: 何も出力されず `exit=1`。

- [ ] **Step 5: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/pages/video-faq.astro public/video-faq/styles.css
git commit -m "feat(video-faq): 機能セクションを実装"
```

---

## Task 9: 動画の用意（S7・SAIMON独自価値）

元LPが一行で流している最大のハードルを、1セクション取って差別化する。

**Files:**
- Modify: `src/pages/video-faq.astro`
- Modify: `public/video-faq/styles.css`

- [ ] **Step 1: マークアップとコピーを書く**

```astro
    <!-- 07 Video production -->
    <section class="production section-block" aria-labelledby="production-title">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-kicker">Production</p>
          <h2 id="production-title"><span class="no-break">動画は、</span><wbr /><span class="no-break">SAIMONが用意します</span></h2>
          <p class="section-lead jp-budoux">導入で一番つまずくのは、ツールではなく動画です。質問の洗い出しから納品まで、まとめてお引き受けします。</p>
        </div>
        <ol class="production-list">
          <li>
            <h3>質問を洗い出す</h3>
            <p class="jp-budoux">これまでの問い合わせ履歴と既存のFAQページから、実際に多い質問を抜き出して優先順位を付けます。最初は10〜15本から始めるのが標準です。</p>
          </li>
          <li>
            <h3>台本を作る</h3>
            <p class="jp-budoux">話す内容を原稿にします。社内のコンプライアンス確認を通しやすい形に整えるところまで含みます。</p>
          </li>
          <li>
            <h3>撮影する、または生成する</h3>
            <p class="jp-budoux">担当者に出ていただく実写撮影と、AIアバターでの生成、どちらにも対応します。顔を出せない事情がある場合はAIアバターを選べます。</p>
          </li>
        </ol>
      </div>
    </section>
```

- [ ] **Step 2: CSSを追記する**

```css
/* ---- Production ---- */
.vfaq-lp-scope .production {
  background: var(--navy);
  color: rgba(255, 255, 255, 0.94);
}
.vfaq-lp-scope .production .section-kicker {
  color: var(--teal);
}
.vfaq-lp-scope .production h2 {
  color: var(--white);
}
.vfaq-lp-scope .production .section-lead {
  color: rgba(255, 255, 255, 0.9);
  max-width: 40em;
}
.vfaq-lp-scope .production-list {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: prod;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}
.vfaq-lp-scope .production-list li {
  counter-increment: prod;
  border-top: 2px solid var(--teal);
  padding-top: 16px;
}
.vfaq-lp-scope .production-list li::before {
  content: "0" counter(prod);
  display: block;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: var(--teal);
  margin-bottom: 8px;
}
.vfaq-lp-scope .production-list h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 8px;
}
.vfaq-lp-scope .production-list p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.82);
  margin: 0;
}
@media (max-width: 768px) {
  .vfaq-lp-scope .production-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
```

このセクションは navy 単色になるが、`--teal` のアクセントと白の階調で階層を作っているので単一色相支配にはならない。

- [ ] **Step 3: ビルドして通す**

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了。

- [ ] **Step 4: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/pages/video-faq.astro public/video-faq/styles.css
git commit -m "feat(video-faq): 動画制作セクション（独自価値）を実装"
```

---

## Task 10: 導入の流れ（S8）と料金（S9）

**Files:**
- Modify: `src/pages/video-faq.astro`
- Modify: `public/video-faq/styles.css`

- [ ] **Step 1: 導入の流れのマークアップを書く**

```astro
    <!-- 08 Flow -->
    <section class="flow section-block" aria-labelledby="flow-title">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-kicker">Flow</p>
          <h2 id="flow-title">導入の流れ</h2>
        </div>
        <ol class="step-list">
          <li class="step-item">
            <span class="step-num" aria-hidden="true">1</span>
            <div class="step-body">
              <h3>無料相談</h3>
              <p class="jp-budoux">今どんな質問が多いか、どこに時間を取られているかを伺います。</p>
            </div>
          </li>
          <li class="step-item">
            <span class="step-num" aria-hidden="true">2</span>
            <div class="step-body">
              <h3>質問の設計</h3>
              <p class="jp-budoux">動画にする質問を決め、効果が出やすい順に並べます。</p>
            </div>
          </li>
          <li class="step-item">
            <span class="step-num" aria-hidden="true">3</span>
            <div class="step-body">
              <h3>動画の準備</h3>
              <p class="jp-budoux">台本を作り、撮影または生成します。社内確認の時間もここに織り込みます。</p>
            </div>
          </li>
          <li class="step-item">
            <span class="step-num" aria-hidden="true">4</span>
            <div class="step-body">
              <h3>公開して育てる</h3>
              <p class="jp-budoux">タグを設置して公開します。視聴データを見ながら質問を足していきます。</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
```

`.step-list` / `.step-item` / `.step-num` は Task 5 で定義済みのものを再利用する（DRY）。

- [ ] **Step 2: 料金セクションのマークアップを書く**

**金額は書かない**（仕様書 §5：卸値未共有）。何で金額が決まるかだけ示す。

```astro
    <!-- 09 Price -->
    <section id="price" class="price section-block" aria-labelledby="price-title">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-kicker">Price</p>
          <h2 id="price-title">料金</h2>
          <p class="section-lead jp-budoux">初期費用と月額でご案内しています。金額は次の4点で変わるため、お話を伺ってから個別にお見積りします。</p>
        </div>
        <ul class="price-factors">
          <li>動画にする質問の本数</li>
          <li>動画制作をどこから任せるか（台本のみ／撮影込み／AIアバター）</li>
          <li>運用を代行するか、貴社側で更新するか</li>
          <li>対象サイトの数</li>
        </ul>
        <p class="fine-print jp-budoux">「まず概算だけ知りたい」というご相談でも構いません。想定している質問の数と対象サイトを教えていただければ、目安をお伝えできます。</p>
      </div>
    </section>
```

- [ ] **Step 3: CSSを追記する**

```css
/* ---- Price ---- */
.vfaq-lp-scope .price {
  background: var(--white);
}
.vfaq-lp-scope .price-factors {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  max-width: 640px;
  margin-inline: auto;
  display: grid;
  gap: 12px;
}
.vfaq-lp-scope .price-factors li {
  position: relative;
  padding-left: 28px;
  font-size: 16px;
}
.vfaq-lp-scope .price-factors li::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 0.7em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--teal);
}
```

- [ ] **Step 4: ビルドして通す**

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了。

- [ ] **Step 5: 金額が混入していないか確認する**

```bash
cd ~/projects/saimon/ai-saite && grep -nE "[0-9]{2,3},?[0-9]{3}円|万円/月|月額[0-9]" src/pages/video-faq.astro; echo "exit=$?"
```

Expected: 何も出力されず `exit=1`。金額らしき文字列が出たら削除する。

- [ ] **Step 6: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/pages/video-faq.astro public/video-faq/styles.css
git commit -m "feat(video-faq): 導入の流れと料金セクションを実装"
```

---

## Task 11: FAQセクション（S10）と FAQPage 構造化データ

**Files:**
- Modify: `src/pages/video-faq.astro`（frontmatter に `faqEntity` 追加、本文に FAQ セクション追加）
- Modify: `public/video-faq/styles.css`

FAQ本文と JSON-LD の文言は**完全に一致させる**（不一致は構造化データの品質問題になる）。

- [ ] **Step 1: frontmatter に `faqEntity` を追加する**

`jsonLd` の定義より前に置き、`@graph` の末尾に `faqEntity` を足す。

```astro
const faqEntity = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "保険商品の説明に使って、法令上の問題はありませんか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "よくある質問への補助的な説明としてご利用いただくことを前提にしています。重要事項説明や契約締結前交付書面を動画で代替するものではありません。募集行為に当たる内容を扱う場合は、貴社のコンプライアンス部門の確認を前提に、台本のレビュー工程を挟んで進めます。",
      },
    },
    {
      "@type": "Question",
      name: "高齢のお客様でも操作できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "質問をタップするだけです。字幕が出るので、音を出せない場所や聞き取りにくい方でも内容を読めます。",
      },
    },
    {
      "@type": "Question",
      name: "動画は何本くらい必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "よく聞かれる質問10〜15本から始めるのが標準です。公開後に視聴データを見ながら足していく形をおすすめしています。",
      },
    },
    {
      "@type": "Question",
      name: "動画は誰が作るのですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SAIMONが質問の洗い出しと台本作成から対応します。担当者に出ていただく実写撮影と、AIアバターでの生成のどちらにも対応できます。",
      },
    },
    {
      "@type": "Question",
      name: "既存のサイトに影響はありませんか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ウィジェットはサイト本体の表示を妨げない独立したJavaScriptです（実測 gzip 約18KB）。CSSも独自のスコープで管理しているため、既存サイトのデザインには干渉しません。",
      },
    },
    {
      "@type": "Question",
      name: "どんなサイトに入れられますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HTMLが書き込めるサイトであれば導入できます。WordPress、Studio、ペライチなどノーコードで作られたサイトでも、HTMLを挿入する機能があれば設置できます。",
      },
    },
    {
      "@type": "Question",
      name: "効果はどうやって測るのですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "起動回数、動画の再生数、視聴完了率、よく見られている質問、訪問者数を管理画面で確認できます。",
      },
    },
    {
      "@type": "Question",
      name: "料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "質問の本数、動画制作をどこから任せるか、運用代行の有無、対象サイト数で変わります。お話を伺ってから個別にお見積りします。",
      },
    },
    {
      "@type": "Question",
      name: "契約期間や解約の条件は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "個別のご契約でお取り決めします。ご相談の段階で条件をお伝えします。",
      },
    },
  ],
};
```

`@graph` の末尾に `faqEntity,` を追加する（`BreadcrumbList` の後）。

- [ ] **Step 2: FAQ本文のマークアップを書く**

`<details>` で組む。回答文は Step 1 の `text` と一字一句そろえる。

```astro
    <!-- 10 FAQ -->
    <section id="faq" class="faq section-block" aria-labelledby="faq-title">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-kicker">FAQ</p>
          <h2 id="faq-title">よくある質問</h2>
        </div>
        <div class="faq-list">
          <details>
            <summary><span class="no-break">保険商品の説明に使って、</span><wbr /><span class="no-break">法令上の問題はありませんか？</span></summary>
            <p class="faq-a jp-budoux">よくある質問への補助的な説明としてご利用いただくことを前提にしています。重要事項説明や契約締結前交付書面を動画で代替するものではありません。募集行為に当たる内容を扱う場合は、貴社のコンプライアンス部門の確認を前提に、台本のレビュー工程を挟んで進めます。</p>
          </details>
          <details>
            <summary>高齢のお客様でも操作できますか？</summary>
            <p class="faq-a jp-budoux">質問をタップするだけです。字幕が出るので、音を出せない場所や聞き取りにくい方でも内容を読めます。</p>
          </details>
          <details>
            <summary>動画は何本くらい必要ですか？</summary>
            <p class="faq-a jp-budoux">よく聞かれる質問10〜15本から始めるのが標準です。公開後に視聴データを見ながら足していく形をおすすめしています。</p>
          </details>
          <details>
            <summary>動画は誰が作るのですか？</summary>
            <p class="faq-a jp-budoux">SAIMONが質問の洗い出しと台本作成から対応します。担当者に出ていただく実写撮影と、AIアバターでの生成のどちらにも対応できます。</p>
          </details>
          <details>
            <summary>既存のサイトに影響はありませんか？</summary>
            <p class="faq-a jp-budoux">ウィジェットはサイト本体の表示を妨げない独立したJavaScriptです（実測 gzip 約18KB）。CSSも独自のスコープで管理しているため、既存サイトのデザインには干渉しません。</p>
          </details>
          <details>
            <summary>どんなサイトに入れられますか？</summary>
            <p class="faq-a jp-budoux">HTMLが書き込めるサイトであれば導入できます。WordPress、Studio、ペライチなどノーコードで作られたサイトでも、HTMLを挿入する機能があれば設置できます。</p>
          </details>
          <details>
            <summary>効果はどうやって測るのですか？</summary>
            <p class="faq-a jp-budoux">起動回数、動画の再生数、視聴完了率、よく見られている質問、訪問者数を管理画面で確認できます。</p>
          </details>
          <details>
            <summary>料金はいくらですか？</summary>
            <p class="faq-a jp-budoux">質問の本数、動画制作をどこから任せるか、運用代行の有無、対象サイト数で変わります。お話を伺ってから個別にお見積りします。</p>
          </details>
          <details>
            <summary>契約期間や解約の条件は？</summary>
            <p class="faq-a jp-budoux">個別のご契約でお取り決めします。ご相談の段階で条件をお伝えします。</p>
          </details>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: CSSを追記する**

```css
/* ---- FAQ ---- */
.vfaq-lp-scope .faq-list {
  max-width: 800px;
  margin-inline: auto;
  border-top: 1px solid var(--line);
}
.vfaq-lp-scope .faq-list details {
  border-bottom: 1px solid var(--line);
}
.vfaq-lp-scope .faq-list summary {
  cursor: pointer;
  padding: 18px 34px 18px 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--navy);
  position: relative;
  list-style: none;
  line-height: 1.6;
}
.vfaq-lp-scope .faq-list summary::-webkit-details-marker {
  display: none;
}
.vfaq-lp-scope .faq-list summary::after {
  content: "";
  position: absolute;
  right: 6px;
  top: 50%;
  width: 10px;
  height: 10px;
  border-right: 2px solid var(--teal-deep);
  border-bottom: 2px solid var(--teal-deep);
  transform: translateY(-70%) rotate(45deg);
  transition: transform 0.2s ease;
}
.vfaq-lp-scope .faq-list details[open] summary::after {
  transform: translateY(-30%) rotate(225deg);
}
.vfaq-lp-scope .faq-a {
  margin: 0 0 20px;
  font-size: 15px;
  color: var(--muted);
}
```

- [ ] **Step 4: ビルドして通す**

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了。

- [ ] **Step 5: JSON-LD が9問ぶん出力されているか確認する**

```bash
cd ~/projects/saimon/ai-saite && grep -o '"@type":"Question"' dist/video-faq/index.html | wc -l
```

Expected: `9`

- [ ] **Step 6: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/pages/video-faq.astro public/video-faq/styles.css
git commit -m "feat(video-faq): FAQセクションとFAQPage構造化データを実装"
```

---

## Task 12: CTAバンド・フォーム・スクリプト（S11）

**Files:**
- Modify: `src/pages/video-faq.astro`
- Modify: `public/video-faq/styles.css`

- [ ] **Step 1: CTAバンドとフォームのマークアップを書く**

```astro
    <!-- 11 CTA -->
    <section class="cta-band" aria-labelledby="cta-title">
      <h2 id="cta-title"><span class="no-break">まず、</span><wbr /><span class="no-break">触ってみてください</span></h2>
      <p class="jp-budoux">操作感は実物を見るのが一番早いです。デモを触ってから、貴社の質問でどう作れるかをご相談ください。</p>
      <a class="primary-cta" href="#contact-form" data-cta-source="band-primary">無料相談する<span aria-hidden="true">→</span></a>
    </section>

    <section id="contact-form" class="contact-form-section section-block" aria-labelledby="contact-form-title">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-kicker">Form</p>
          <h2 id="contact-form-title">無料相談フォーム</h2>
          <p class="contact-form-lead jp-budoux">ご記入いただいた内容をもとに、1営業日以内に担当よりご連絡いたします。「うちの業種で使えるか知りたい」だけのご相談でも構いません。しつこい営業はいたしません。</p>
        </div>

        <form id="lead-form" class="lead-form" novalidate>
          <div class="lead-form-row lead-form-row-double">
            <label class="form-field">
              <span class="form-label">会社名・団体名<em aria-hidden="true">*</em></span>
              <input type="text" name="company" required autocomplete="organization" placeholder="株式会社サンプル" />
            </label>
            <label class="form-field">
              <span class="form-label">お名前<em aria-hidden="true">*</em></span>
              <input type="text" name="name" required autocomplete="name" placeholder="山田 太郎" />
            </label>
          </div>

          <div class="lead-form-row lead-form-row-double">
            <label class="form-field">
              <span class="form-label">メールアドレス<em aria-hidden="true">*</em></span>
              <input type="email" name="email" required autocomplete="email" placeholder="taro@example.com" />
            </label>
            <label class="form-field">
              <span class="form-label">電話番号<span class="form-optional">（任意）</span></span>
              <input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="0312345678（任意）" />
            </label>
          </div>

          <div class="lead-form-row">
            <label class="form-field">
              <span class="form-label">ご相談内容（任意）</span>
              <textarea name="challenges" rows="4" placeholder="例：加入者からの問い合わせが電話に集中しており、解約返戻金の説明に時間を取られています。動画FAQで減らせるか相談したい。"></textarea>
            </label>
          </div>

          <div class="lead-form-row form-field-checkbox form-field-consent">
            <label>
              <input type="checkbox" name="consent" required value="yes" />
              <span>
                <a href="/privacy-policy/" target="_blank" rel="noopener">個人情報の取り扱い</a>に同意の上、送信します<em aria-hidden="true">*</em>
              </span>
            </label>
          </div>

          <div aria-hidden="true" class="form-honeypot">
            <label>Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
          </div>

          <div class="lead-form-actions">
            <button type="submit" class="primary-cta lead-form-submit">送信する<span aria-hidden="true">→</span></button>
            <p class="lead-form-note">送信後、1営業日以内に担当よりご連絡いたします。</p>
          </div>

          <p id="form-feedback" class="form-feedback" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>
  </main>

  <Footer />
```

- [ ] **Step 2: フォーム関連のCSSを移植する**

`public/subsc-design/styles.css` から次のセレクタのスタイルを探し、`.subsc-lp-scope` を `.vfaq-lp-scope` に置換して `public/video-faq/styles.css` に追記する。

対象: `.cta-band`、`.contact-form-section`、`.contact-form-lead`、`.lead-form`、`.lead-form-row`、`.lead-form-row-double`、`.form-field`、`.form-label`、`.form-optional`、`.form-field-checkbox`、`.form-field-consent`、`.form-honeypot`、`.lead-form-actions`、`.lead-form-submit`、`.lead-form-note`、`.form-feedback`、`.form-feedback.is-success`、`.form-feedback.is-error`

該当箇所を探すコマンド:

```bash
cd ~/projects/saimon/ai-saite && grep -n "cta-band\|lead-form\|form-field\|form-feedback\|contact-form" public/subsc-design/styles.css | head -40
```

**移植時の注意:** `.cta-band` が subsc-design 側で明朝書体（`Shippori Mincho B1`）を指定している場合はその指定を落とす（本LPはゴシック主体）。`.form-honeypot` は `position:absolute; left:-9999px;` 相当で画面外に出す実装であることを確認する。

- [ ] **Step 3: フォーム送信スクリプトを移植する**

`src/pages/subsc-design.astro:718-861` の `<script is:inline>` から、**フォーム送信とGA4計測の部分のみ**を移植する。`src/pages/subsc-design.astro:861-933` の「コスト診断」は subsc-design 固有なので持ち込まない。

移植して**必ず変更する2箇所**:

```javascript
      // API側の獲得経路ホワイトリストに合わせる（"LP無料相談" は登録済みの値なので変更しない）
      function resolveSource() {
        return "LP無料相談";
      }

      function collectUtm() {
        try {
          const url = new URL(window.location.href);
          return {
            utmSource: url.searchParams.get("utm_source") || "",
            utmCampaign: url.searchParams.get("utm_campaign") || "video-faq-lp",
          };
        } catch (_) {
          return { utmSource: "", utmCampaign: "video-faq-lp" };
        }
      }
```

`utmCampaign` の既定値を `subsc-design-lp` から **`video-faq-lp`** に変える。これがLPの識別子になる。`source` は API 側のホワイトリスト値なので `"LP無料相談"` のまま変えない。

`FORM_ENDPOINT` は同じものを使う。

```javascript
const FORM_ENDPOINT = "https://recruit-hp-form-api.vercel.app/api/contact";
```

- [ ] **Step 4: BudouX 適用スクリプトを書く**

`</BaseLayout>` の直前に置く。`is:inline` を**付けない**（付けるとバンドルされず `import` が解決しない）。

```astro
  <script>
    // BudouX: 日本語の文節を自動判定して折り返す（Safari含む全ブラウザで語中改行を防ぐ）
    import { loadDefaultJapaneseParser } from "budoux";
    const parser = loadDefaultJapaneseParser();
    const sel = [
      ".vfaq-lp-scope .hero-lead",
      ".vfaq-lp-scope .section-lead",
      ".vfaq-lp-scope .problem-card p",
      ".vfaq-lp-scope .problem-close",
      ".vfaq-lp-scope .step-body p",
      ".vfaq-lp-scope .why-list p",
      ".vfaq-lp-scope .feature-card p",
      ".vfaq-lp-scope .production-list p",
      ".vfaq-lp-scope .price-factors li",
      ".vfaq-lp-scope .faq-a",
      ".vfaq-lp-scope .fine-print",
      ".vfaq-lp-scope .cta-band p",
      ".vfaq-lp-scope .contact-form-lead",
    ].join(",");
    document.querySelectorAll(sel).forEach((el) => {
      try {
        parser.applyToElement(el);
      } catch (e) {}
    });
  </script>
</BaseLayout>
```

- [ ] **Step 5: ビルドして通す**

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了。

- [ ] **Step 6: フォームとBudouXが出力されているか確認する**

```bash
cd ~/projects/saimon/ai-saite && grep -c 'id="lead-form"' dist/video-faq/index.html && grep -c "video-faq-lp" dist/video-faq/index.html
```

Expected: 両方 `1` 以上。

- [ ] **Step 7: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/pages/video-faq.astro public/video-faq/styles.css
git commit -m "feat(video-faq): CTAバンド・フォーム・BudouX適用を実装"
```

---

## Task 13: ナビゲーションに追加する

**Files:**
- Modify: `src/data/navigation.ts`

- [ ] **Step 1: ナビ項目を追加する**

「サブスクデザイン」の直後に挿入する（サービス系を隣接させる）。

```typescript
  { label: "サブスクデザイン", labelEn: "DESIGN", href: "/subsc-design/" },
  { label: "顔の見えるFAQ", labelEn: "VIDEO FAQ", href: "/video-faq/" },
  { label: "研修プログラム", labelEn: "PROGRAM", href: "/#modules" },
```

- [ ] **Step 2: ビルドして通す**

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了。

- [ ] **Step 3: 全ページにリンクが出ているか確認する**

```bash
cd ~/projects/saimon/ai-saite && grep -l "顔の見えるFAQ" dist/index.html dist/subsc-design/index.html
```

Expected: 両ファイルが列挙される。

- [ ] **Step 4: ナビが9項目になったことによるモバイル崩れを確認する**

これは Task 14 の実測に含める。この時点では判断を保留し、Task 14 で `scrollWidth` はみ出しを測って判定する。**崩れていた場合は自分でナビ構成を変えず、齋本さんに選択肢を出して確認する**（仕様書 §4「ナビゲーション」に代替案2つを記載済み）。

- [ ] **Step 5: コミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/data/navigation.ts
git commit -m "feat(video-faq): ナビゲーションに顔の見えるFAQを追加"
```

---

## Task 14: ブラウザ実測で検証する

「ビルドが通った」を完了と見なさない。**Safari相当を再現して測る**（Chromium だけだと `auto-phrase` が効いて崩れが見えない）。

**Files:** なし（検証のみ。不具合が出たら該当ファイルを修正）

- [ ] **Step 1: dev server を起動する**

`preview_start` ツールで `{name: "ai-saite-dev"}` を起動する。**Bash で直接起動しない**（frontend-ui-rules §3）。ポート4321が使用中なら `ai-saite-dev-alt`（autoPort）を使う。

- [ ] **Step 2: `/video-faq/` を開いてコンソールエラーを確認する**

`navigate` で `http://localhost:4321/video-faq/` を開き、`read_console_messages` でエラーを確認する。

Expected: エラー0件。BudouX の import 失敗（`Failed to resolve module`）が出たら `<script>` に `is:inline` が付いていないか確認する。

- [ ] **Step 3: Safari相当を再現する**

`javascript_tool` で次を実行し、`auto-phrase` を無効化して Safari の描画を再現する。

```javascript
(() => {
  const s = document.createElement('style');
  s.textContent = '.vfaq-lp-scope *{word-break:normal !important}';
  document.head.appendChild(s);
  return 'injected';
})()
```

- [ ] **Step 4: はみ出しを実測する（0件にする）**

`javascript_tool` で次を実行する。

```javascript
(() => {
  const out = [];
  document.querySelectorAll('.vfaq-lp-scope h1, .vfaq-lp-scope h2, .vfaq-lp-scope h3, .vfaq-lp-scope p, .vfaq-lp-scope li, .vfaq-lp-scope summary').forEach((el) => {
    if (el.scrollWidth - el.clientWidth > 0) {
      out.push({ tag: el.tagName, cls: el.className, over: el.scrollWidth - el.clientWidth, text: el.textContent.slice(0, 30) });
    }
  });
  return JSON.stringify({ count: out.length, items: out.slice(0, 20) }, null, 2);
})()
```

Expected: `{"count": 0, ...}`

`count` が0でない場合、該当要素に `.no-break` の塊化＋塊間の `<wbr />` を入れる、または `font-size` を詰めて解消する。**隣接する `.no-break` の間に `<wbr />` を必ず入れる**（Safariは隣接nowrap境界で改行しないため）。

- [ ] **Step 5: 行充填率を実測する（右側が28%以上空く行を0件にする）**

`javascript_tool` で次を実行する。

```javascript
(() => {
  const bad = [];
  document.querySelectorAll('.vfaq-lp-scope p, .vfaq-lp-scope li').forEach((el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const rects = Array.from(r.getClientRects()).filter((x) => x.width > 1);
    if (rects.length < 2) return;
    const w = Math.max(...rects.map((x) => x.width));
    rects.slice(0, -1).forEach((x, i) => {
      if (x.width < w * 0.72) {
        bad.push({ cls: el.className, line: i + 1, fill: Math.round((x.width / w) * 100), text: el.textContent.slice(0, 28) });
      }
    });
  });
  return JSON.stringify({ count: bad.length, items: bad.slice(0, 20) }, null, 2);
})()
```

Expected: `{"count": 0, ...}`

0でない場合、幅の広いリード文には `text-align: justify` を当てる（狭いカードには当てない。文字間が間延びする）。

- [ ] **Step 6: 左右対称性を実測する（左に寄って見える問題の検出）**

`javascript_tool` で次を実行する。幅制限ブロックの `margin-inline: auto` 漏れを検出する。

```javascript
(() => {
  const bad = [];
  const vw = document.documentElement.clientWidth;
  document.querySelectorAll('.vfaq-lp-scope .section-inner, .vfaq-lp-scope .faq-list, .vfaq-lp-scope .lead-form, .vfaq-lp-scope .fine-print, .vfaq-lp-scope .price-factors').forEach((el) => {
    const r = el.getBoundingClientRect();
    const left = r.left;
    const right = vw - r.right;
    if (Math.abs(left - right) > 2) {
      bad.push({ cls: el.className, left: Math.round(left), right: Math.round(right) });
    }
  });
  return JSON.stringify({ count: bad.length, items: bad }, null, 2);
})()
```

Expected: `{"count": 0, ...}`

0でない場合、該当ブロックに `margin-inline: auto` を足す。`margin: 0` のショートハンドで中央寄せを打ち消していないかも確認する（リセットするなら `margin: 0 auto` と書く）。

- [ ] **Step 7: モバイル幅で Step 3〜6 を繰り返す**

`resize_window` で `{preset: "mobile"}`（375x812）にしてから、Step 3・4・5・6 を再実行する。Expected は同じく `count: 0`。

- [ ] **Step 8: PC・モバイルのフルページスクリーンショットを撮る**

`resize_window` で `{preset: "desktop"}` と `{preset: "mobile"}` を切り替え、`computer` の `screenshot` でそれぞれ撮る。

- [ ] **Step 9: スクリーンショットを Read（画像）で目視確認する**

frontend-ui-rules の完成前セルフチェックを1項目ずつ確認する。

- [ ] カードのinカードがない／セクションがカード化されていない
- [ ] グラデオーブ・ボケ玉装飾がない
- [ ] ヒーローに生成画像がある／ヒーロー文がカードに入っていない
- [ ] ヒーローで次セクションの気配が見える（PC・モバイル両方）
- [ ] 文字が親要素からはみ出していない／要素が不整合に重なっていない
- [ ] 本文フォントサイズが `vw` でスケールしていない（H1のみ `clamp` 可）
- [ ] カード内の見出しがヒーロー級に大きくなっていない
- [ ] 寸法固定UI（`.step-num`）がズレていない
- [ ] UIに機能説明文・使い方文を書いていない
- [ ] 単一色相支配になっていない
- [ ] ナビ9項目がモバイルで崩れていない

- [ ] **Step 10: 色相の偏りをCSSレベルで確認する**

```bash
cd ~/projects/saimon/ai-saite && grep -oE "#[0-9a-fA-F]{6}|rgba?\([^)]+\)" public/video-faq/styles.css | sort | uniq -c | sort -rn | head -20
```

navy 系だけが支配していないか（teal・グレー階調・白が使われているか）を確認する。

- [ ] **Step 11: 修正があればコミット**

```bash
cd ~/projects/saimon/ai-saite
git add -A public/video-faq src/pages/video-faq.astro
git commit -m "fix(video-faq): 実測に基づき折り返しとレイアウトを調整"
```

**CSSを修正した場合は `src/pages/video-faq.astro` の `cssVersion` を `20260730-v2` にバンプする**（据え置くと本番のキャッシュに新CSSが届かない）。

---

## Task 15: 文章とセキュリティのレビュー

**Files:** なし（レビューのみ。指摘に応じて修正）

- [ ] **Step 1: 日本語コピーを校正する**

Agent ツールで `jp-copy-reviewer` を起動し、`src/pages/video-faq.astro` の全文を対外公開物として校正させる。誤字・敬語・トンマナ・誇大表現を点検させる。

**サブエージェントの指摘は鵜呑みにせず、修正前に必ず実ファイルで裏取りする**（行番号や「未対応」の指摘には誤報が混ざる）。

- [ ] **Step 2: 書いてはいけない主張が入っていないか自分で確認する**

```bash
cd ~/projects/saimon/ai-saite && grep -nE "導入実績|導入企業|社が導入|運用中のサイト|14KB|重要事項説明を|%改善|％改善|%削減|％削減" src/pages/video-faq.astro; echo "exit=$?"
```

Expected: 何も出力されず `exit=1`。出た場合は仕様書 §5 の表と照らして削除する。

- [ ] **Step 3: 公開前のセキュリティレビューを受ける**

Agent ツールで `security-reviewer` を起動し、`git diff main` 相当の差分をレビューさせる。シークレット混入・公開設定・入力検証の観点で確認させる。

特に確認させる点:
- APIキー・トークンの平文混入がないこと
- フォームの `FORM_ENDPOINT` が既存と同じで、新しい認証情報を含まないこと
- honeypot フィールドが機能する形で入っていること

- [ ] **Step 4: 指摘を反映してコミット**

```bash
cd ~/projects/saimon/ai-saite
git add src/pages/video-faq.astro public/video-faq/styles.css
git commit -m "fix(video-faq): レビュー指摘を反映"
```

---

## Task 16: デプロイ

**Files:** なし

- [ ] **Step 1: 最終ビルドを確認する**

```bash
cd ~/projects/saimon/ai-saite && npm run build
```

Expected: エラーなく完了。

- [ ] **Step 2: コミット対象を確認する**

```bash
cd ~/projects/saimon/ai-saite && git status --short && git log --oneline origin/main..HEAD
```

**このリポジトリの作業ツリーには本件と無関係な未追跡ファイルが大量にある**（動画・画像・`faq-chatbot-widget/` など）。`git add -A` や `git add .` を使わず、**本件のファイルだけを明示的に add する**こと。

- [ ] **Step 3: push の許可を取る**

齋本さんに push の許可を求める。**許可なく push しない。**

- [ ] **Step 4: push する**

```bash
cd ~/projects/saimon/ai-saite && git push origin main
```

- [ ] **Step 5: デプロイの完了を待つ**

```bash
gh run list --repo saimon1004/ai-saite --limit 3
```

出てきた最新の run id で:

```bash
gh run watch <run_id> --repo saimon1004/ai-saite
```

Expected: `completed success`

- [ ] **Step 6: 本番URLで実測確認する**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://sai-mon.co.jp/video-faq/
```

Expected: `200`

そのうえで `preview_start` で `{url: "https://sai-mon.co.jp/video-faq/"}` を開き、Task 14 の Step 3〜8（Safari相当再現・はみ出し実測・行充填率・スクショ目視）を**本番URLに対して再実行する**。

- [ ] **Step 7: CSSが新しいバージョンで配信されているか確認する**

```bash
curl -s "https://sai-mon.co.jp/video-faq/" | grep -o 'styles.css?v=[0-9a-z-]*'
```

Expected: `src/pages/video-faq.astro` の `cssVersion` と一致する文字列。

- [ ] **Step 8: 作業記録を残す**

`~/Claude Code/tasks/todo.md` にレビューセクションを追記する（実施内容・実測結果・残課題）。残課題には仕様書 §6 の未確定事項5点を引き継ぐ。

---

## 完了条件

- `https://sai-mon.co.jp/video-faq/` が 200 で開く
- PC・モバイル両方で、はみ出し0件・右側28%以上空く行0件・左右余白の非対称0件を実測済み
- 日本語の途中に半角スペースが混入していないことを実測済み（`count= 0`）
- スクリーンショットを Read（画像）で目視確認済み
- 仕様書 §5「書かないこと」の全項目が入っていないことを grep で確認済み
- ナビから遷移できる
- フォーム送信が `utmCampaign=video-faq-lp` で記録される
