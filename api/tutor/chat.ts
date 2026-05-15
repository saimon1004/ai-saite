import type { VercelRequest, VercelResponse } from "@vercel/node";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `あなたはSAIMON CodeQuestの教育AIチューター「Sensei」です。
ShimaLinkの物語に沿ってプログラミングを教えています。

## ルール
- やさしい日本語で説明する
- 専門用語には分かりやすい例えを添える
- ShimaLinkのストーリーに関連づけて説明する
- 回答は200文字以内を目安にする
- ページ上の要素を指し示すときは [HIGHLIGHT:CSSセレクタ:説明テキスト] タグを使う

## ハイライトの使い方
ページ上のセクションや要素を指し示したいときに使います。
例:
- [HIGHLIGHT:h2#git-basics:このセクションを見てください]
- [HIGHLIGHT:pre code:nth-of-type(3):このコードを確認しましょう]
- [HIGHLIGHT:table:nth-of-type(1):このコマンド一覧を参考にしてください]

セレクタにはh2見出し、コードブロック(pre code)、テーブル(table)などを使えます。`;

// Chapter contexts - loaded inline for edge function simplicity
const CHAPTER_CONTEXTS: Record<string, string> = {
  "01-the-spark": `# Chapter 1: ひらめきの瞬間（創業編）
学習内容: Terminal基礎(pwd,ls,cd,mkdir,touch), HTML/CSS基本構造, Git(init,add,commit), Web(HTTP/DNS)
ストーリー: 主人公が沖縄でメンターYukiと出会い、ShimaLinkプロジェクトを始める。
主要セクション: ターミナル, HTML, Git, Webの仕組み
Yukiの比喩: ターミナル=司令塔, Git=保険証券, パス=住所, HTTP=ハガキ/HTTPS=封筒`,
};

interface ChatRequest {
  chapterId: string;
  messages: { role: "user" | "assistant"; content: string }[];
  domContext?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  // Referer check
  const referer = req.headers.referer || "";
  if (
    process.env.NODE_ENV === "production" &&
    !referer.includes("sai-mon.co.jp")
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { chapterId, messages, domContext } = req.body as ChatRequest;

  if (!chapterId || !messages?.length) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Build system prompt with chapter context
  const chapterCtx =
    CHAPTER_CONTEXTS[chapterId] || "章のコンテキストがありません。";
  let systemPrompt = `${SYSTEM_PROMPT}\n\n## 現在の章の情報\n${chapterCtx}`;
  if (domContext) {
    systemPrompt += `\n\n## ユーザーの現在の状態\n${domContext}`;
  }

  // Keep only last 5 turns
  const recentMessages = messages.slice(-10);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 512,
        system: systemPrompt,
        messages: recentMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    // SSE streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = response.body?.getReader();
    if (!reader) {
      return res.status(500).json({ error: "No response body" });
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          if (
            parsed.type === "content_block_delta" &&
            parsed.delta?.type === "text_delta"
          ) {
            const text = parsed.delta.text;
            fullText += text;

            // Check for HIGHLIGHT tags in accumulated text
            const highlightMatch = fullText.match(
              /\[HIGHLIGHT:([^:]+):([^\]]+)\]/
            );
            if (highlightMatch) {
              // Extract the text before the highlight
              const idx = fullText.indexOf(highlightMatch[0]);
              const before = fullText.slice(0, idx);
              if (before) {
                res.write(
                  `data: ${JSON.stringify({ type: "text", content: before })}\n\n`
                );
              }
              // Send highlight event
              res.write(
                `data: ${JSON.stringify({
                  type: "highlight",
                  selector: highlightMatch[1],
                  label: highlightMatch[2],
                })}\n\n`
              );
              // Reset fullText to remaining after highlight
              fullText = fullText.slice(idx + highlightMatch[0].length);
            } else if (
              !fullText.includes("[HIGHLIGHT") &&
              fullText.length > 0
            ) {
              // No pending highlight tag, flush text
              res.write(
                `data: ${JSON.stringify({ type: "text", content: fullText })}\n\n`
              );
              fullText = "";
            }
          }
        } catch {
          // Skip non-JSON lines
        }
      }
    }

    // Flush remaining text
    if (fullText) {
      res.write(
        `data: ${JSON.stringify({ type: "text", content: fullText })}\n\n`
      );
    }
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (err) {
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
}
