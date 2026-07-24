/**
 * ヒーロー演出
 *
 * 既定（本番）: 軽量2演出を全デバイスで実行
 *  - コピー組み上がり: キャッチコピーが粉のように散った状態から1文字ずつ集まる（読み込み時1回）
 *  - パララックス+グレイン: スクロールで動画とコピーに深度差、フィルム粒状感を常時オーバーレイ
 *
 * 検証用（URLパラメータ、three.jsを動的import・Canvas UI / MIT License https://canvasui.dev）:
 *  - ?hero=particle … SAIMONロゴを粒子で再構築（Particle Object）
 *  - ?hero=glass    … 液体ガラスのトーラス＋インク静止画背景（Glass Object）
 *
 * prefers-reduced-motion では全演出を停止（グレインのみ静的に付与）。
 */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const variant = new URLSearchParams(window.location.search).get("hero");

/** キャッチコピーが粉から組み上がる登場演出 */
function initTextAssembly(): void {
  const h1 = document.querySelector<HTMLElement>("section h1");
  if (!h1) return;

  const chars: HTMLElement[] = [];
  const wrap = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      for (const ch of node.textContent ?? "") {
        const span = document.createElement("span");
        span.textContent = ch;
        span.style.cssText = "display:inline-block;will-change:transform,opacity,filter;";
        frag.appendChild(span);
        chars.push(span);
      }
      node.parentNode?.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      [...node.childNodes].forEach(wrap);
    }
  };
  [...h1.childNodes].forEach(wrap);

  chars.forEach((span, i) => {
    const dx = (Math.random() - 0.5) * 120;
    const dy = (Math.random() - 0.5) * 90;
    const rot = (Math.random() - 0.5) * 40;
    span.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1.4)`, opacity: 0, filter: "blur(10px)" },
        { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1, filter: "blur(0px)" },
      ],
      { duration: 900, delay: 150 + i * 45, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
    );
  });
}

/** フィルム粒状感オーバーレイ（静的） */
function addGrain(section: HTMLElement): void {
  const grain = document.createElement("div");
  grain.setAttribute("aria-hidden", "true");
  grain.style.cssText =
    "position:absolute;inset:0;pointer-events:none;opacity:.5;mix-blend-mode:overlay;z-index:1;" +
    "background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\");";
  section.appendChild(grain);
}

/** スクロールパララックス（動画は遅く、コピーはわずかに速く） */
function initParallax(): void {
  const section = document.querySelector<HTMLElement>("section.relative");
  const video = section?.querySelector<HTMLElement>("video");
  const content = section?.querySelector<HTMLElement>(".saimon-shell");
  if (!section || !video || !content) return;

  addGrain(section);

  video.style.willChange = "transform";
  content.style.willChange = "transform";
  const onScroll = (): void => {
    const y = window.scrollY;
    const shift = Math.min(y * 0.12, 60);
    video.style.transform = `translateY(${shift}px) scale(1.15)`;
    content.style.transform = `translateY(${y * -0.06}px)`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/** 検証用WebGL変種（デスクトップのみ・アイドル時に起動） */
async function initWebglVariant(kind: "particle" | "glass"): Promise<void> {
  const host = document.getElementById("hero-particles");
  if (!host || window.innerWidth < 768) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:100%;display:block;";
  host.appendChild(canvas);

  if (kind === "particle") {
    const { createParticleObject } = await import("./canvasui/ParticleObjectVanilla");
    const instance = createParticleObject(
      { canvas },
      {
        src: "/solutions/hero-logo-alpha.png",
        count: 4500,
        size: 2.0,
        sizeVariance: 0.7,
        color: "#ffffff",
        radius: 130,
        strength: 1.1,
        swirl: 0.8,
        spring: 0.9,
        damping: 0.35,
        drift: 0.45,
        background: "",
        scale: 2.7,
        orbit: false,
        zoom: false,
        autoRotate: false,
        floatIntensity: 0.35,
        rotationIntensity: 0.15,
      },
    );
    if (!instance) host.remove();
    return;
  }

  host.classList.remove("right-0", "w-[46%]");
  host.classList.add("inset-x-0", "w-full");
  const { createGlassObject } = await import("./canvasui/GlassObjectVanilla");
  const instance = createGlassObject(
    { canvas },
    {
      src: "/solutions/hero-glass-ring.svg",
      ior: 1.5,
      thickness: 1.8,
      roughness: 0.06,
      dispersion: 0.5,
      clearcoat: 1,
      tint: "",
      tintDensity: 0.4,
      background: "",
      backgroundImage: "/solutions/hero-still.jpg",
      scale: 1.9,
      xOffset: 1.4,
      orbit: false,
      zoom: false,
      autoRotate: true,
      autoRotateSpeed: 0.6,
      floatIntensity: 0.5,
      rotationIntensity: 0.3,
    },
  );
  if (!instance) host.remove();
}

if (!reducedMotion) {
  if (variant === "particle" || variant === "glass") {
    // 検証用: WebGL変種のみ（既定演出は切って単体比較できるように）
    const schedule = (): void => {
      if ("requestIdleCallback" in window) {
        (window as Window).requestIdleCallback(() => void initWebglVariant(variant), { timeout: 3000 });
      } else {
        window.setTimeout(() => void initWebglVariant(variant), 800);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
  } else {
    // 既定: コピー組み上がり + パララックス
    initTextAssembly();
    initParallax();
  }
}
