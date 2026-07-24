/**
 * Canvas-based particle system.
 * Renders irregularly placed particles that drift downward with subtle sway,
 * simulating powder/ink settling from the hero video.
 *
 * Each section with [data-particles] gets its own <canvas>.
 * Animation pauses when the section leaves the viewport.
 *
 * Respects prefers-reduced-motion (renders static scattered dots).
 */

// ==================== Types ====================

/**
 * モーションのバリエーション（セクションごとに変えて単調さを避ける。いずれも控えめ）
 * - fall: 上から粉が舞い落ちる（ヒーローのインク演出の続き・既定）
 * - rise: 気泡のようにゆっくり浮かび上がる
 * - drift: 左から右へゆるやかに流れる
 * - constellation: 点がゆっくり漂い、近い点同士を淡い線で結ぶ
 */
type ParticleMode = "fall" | "rise" | "drift" | "constellation";

interface ParticleConfig {
  count: number;
  colorRgb: string;
  opacityMin: number;
  opacityMax: number;
  radiusMin: number;
  radiusMax: number;
  speedMin: number;
  speedMax: number;
  swayMax: number;
  mode?: ParticleMode;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmplitude: number;
}

// ==================== Section Configs ====================
// Density decreases as distance from hero increases

const SECTION_CONFIGS: Record<string, ParticleConfig> = {
  about: {
    count: 100,
    colorRgb: "13, 0, 132",
    opacityMin: 0.08,
    opacityMax: 0.35,
    radiusMin: 1.5,
    radiusMax: 5,
    speedMin: 0.1,
    speedMax: 0.5,
    swayMax: 0.35,
  },
  solution: {
    count: 70,
    colorRgb: "13, 0, 132",
    opacityMin: 0.06,
    opacityMax: 0.28,
    radiusMin: 1.5,
    radiusMax: 4,
    speedMin: 0.08,
    speedMax: 0.4,
    swayMax: 0.3,
  },
  results: {
    mode: "rise",
    count: 60,
    colorRgb: "13, 0, 132",
    opacityMin: 0.05,
    opacityMax: 0.24,
    radiusMin: 1.5,
    radiusMax: 4,
    speedMin: 0.08,
    speedMax: 0.38,
    swayMax: 0.3,
  },
  modules: {
    mode: "constellation",
    count: 35,
    colorRgb: "13, 0, 132",
    opacityMin: 0.05,
    opacityMax: 0.22,
    radiusMin: 1,
    radiusMax: 3.5,
    speedMin: 0.07,
    speedMax: 0.36,
    swayMax: 0.28,
  },
  clients: {
    mode: "drift",
    count: 50,
    colorRgb: "13, 0, 132",
    opacityMin: 0.05,
    opacityMax: 0.2,
    radiusMin: 1,
    radiusMax: 3.5,
    speedMin: 0.06,
    speedMax: 0.35,
    swayMax: 0.25,
  },
  cases: {
    mode: "rise",
    count: 45,
    colorRgb: "13, 0, 132",
    opacityMin: 0.05,
    opacityMax: 0.2,
    radiusMin: 1,
    radiusMax: 3.5,
    speedMin: 0.06,
    speedMax: 0.35,
    swayMax: 0.25,
  },
  works: {
    mode: "drift",
    count: 45,
    colorRgb: "13, 0, 132",
    opacityMin: 0.05,
    opacityMax: 0.2,
    radiusMin: 1,
    radiusMax: 3.5,
    speedMin: 0.06,
    speedMax: 0.35,
    swayMax: 0.25,
  },
  team: {
    mode: "rise",
    count: 50,
    colorRgb: "13, 0, 132",
    opacityMin: 0.05,
    opacityMax: 0.22,
    radiusMin: 1,
    radiusMax: 3.5,
    speedMin: 0.06,
    speedMax: 0.35,
    swayMax: 0.25,
  },
  company: {
    mode: "drift",
    count: 35,
    colorRgb: "13, 0, 132",
    opacityMin: 0.05,
    opacityMax: 0.18,
    radiusMin: 1,
    radiusMax: 3,
    speedMin: 0.05,
    speedMax: 0.3,
    swayMax: 0.2,
  },
  contact: {
    mode: "constellation",
    count: 25,
    colorRgb: "255, 255, 255",
    opacityMin: 0.06,
    opacityMax: 0.18,
    radiusMin: 1,
    radiusMax: 3,
    speedMin: 0.05,
    speedMax: 0.3,
    swayMax: 0.2,
  },
};

// ==================== Utility ====================

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// ==================== ParticleField ====================

class ParticleField {
  public sectionId: string;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private config: ParticleConfig;
  private width = 0;
  private height = 0;
  private dpr: number;
  private animationId: number | null = null;
  private isVisible = false;
  private initialized = false;

  constructor(section: HTMLElement, config: ParticleConfig) {
    this.sectionId = section.id;
    this.config = config;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Create canvas element
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("aria-hidden", "true");
    this.canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;";

    // Insert as first child (behind content)
    section.insertBefore(this.canvas, section.firstChild);

    this.ctx = this.canvas.getContext("2d")!;
  }

  /** Try to size the canvas. Returns true if section has valid dimensions. */
  public tryInit(): boolean {
    if (this.initialized) return true;

    const section = this.canvas.parentElement;
    if (!section) return false;

    const rect = section.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;

    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;

    this.initParticles();
    this.initialized = true;
    return true;
  }

  private initParticles(): void {
    // Reduce count on mobile
    const isMobile = window.innerWidth < 768;
    const count = isMobile
      ? Math.round(this.config.count * 0.6)
      : this.config.count;

    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  private createParticle(randomPos: boolean): Particle {
    const radius = randomRange(this.config.radiusMin, this.config.radiusMax);
    const mode = this.config.mode ?? "fall";
    const speed = randomRange(this.config.speedMin, this.config.speedMax);

    const p: Particle = {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius,
      opacity: randomRange(this.config.opacityMin, this.config.opacityMax),
      velocityX: 0,
      velocityY: speed,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: randomRange(0.005, 0.02),
      swayAmplitude: randomRange(0.05, this.config.swayMax),
    };

    if (mode === "rise") {
      p.velocityY = -speed;
      if (!randomPos) p.y = this.height + radius * 2;
    } else if (mode === "drift") {
      p.velocityX = speed;
      p.velocityY = 0;
      if (!randomPos) p.x = -radius * 2;
    } else if (mode === "constellation") {
      const angle = Math.random() * Math.PI * 2;
      p.velocityX = Math.cos(angle) * speed;
      p.velocityY = Math.sin(angle) * speed;
    } else {
      // fall
      if (!randomPos) p.y = -radius * 2;
    }

    return p;
  }

  // ==================== Animation ====================

  public setVisible(visible: boolean): void {
    if (!this.initialized) return;

    if (visible && !this.isVisible) {
      this.isVisible = true;
      this.animationId = requestAnimationFrame(() => this.update());
    } else if (!visible && this.isVisible) {
      this.isVisible = false;
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  }

  private update(): void {
    if (!this.isVisible) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const { colorRgb } = this.config;
    const mode = this.config.mode ?? "fall";
    const dpr = this.dpr;

    for (const p of this.particles) {
      // Update sway
      p.swayPhase += p.swaySpeed;
      const sway = Math.sin(p.swayPhase) * p.swayAmplitude;

      // Move (mode-specific)
      if (mode === "drift") {
        p.x += p.velocityX;
        p.y += sway; // 縦にゆらぐ
      } else if (mode === "constellation") {
        p.x += p.velocityX;
        p.y += p.velocityY;
      } else {
        // fall / rise
        p.y += p.velocityY;
        p.x += sway; // 横にゆらぐ
      }

      // Recycle / wrap (mode-specific)
      if (mode === "fall") {
        if (p.y > this.height + p.radius * 2) {
          p.y = -p.radius * 2;
          p.x = Math.random() * this.width;
          p.swayPhase = Math.random() * Math.PI * 2;
        }
        if (p.x < -p.radius) p.x = this.width + p.radius;
        if (p.x > this.width + p.radius) p.x = -p.radius;
      } else if (mode === "rise") {
        if (p.y < -p.radius * 2) {
          p.y = this.height + p.radius * 2;
          p.x = Math.random() * this.width;
          p.swayPhase = Math.random() * Math.PI * 2;
        }
        if (p.x < -p.radius) p.x = this.width + p.radius;
        if (p.x > this.width + p.radius) p.x = -p.radius;
      } else if (mode === "drift") {
        if (p.x > this.width + p.radius * 2) {
          p.x = -p.radius * 2;
          p.y = Math.random() * this.height;
          p.swayPhase = Math.random() * Math.PI * 2;
        }
        if (p.y < -p.radius) p.y = this.height + p.radius;
        if (p.y > this.height + p.radius) p.y = -p.radius;
      } else {
        // constellation: 全方向ラップ
        if (p.x < -p.radius) p.x = this.width + p.radius;
        if (p.x > this.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = this.height + p.radius;
        if (p.y > this.height + p.radius) p.y = -p.radius;
      }

      // Draw dot
      this.ctx.beginPath();
      this.ctx.arc(p.x * dpr, p.y * dpr, p.radius * dpr, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${colorRgb}, ${p.opacity})`;
      this.ctx.fill();
    }

    // constellation: 近い点同士を淡い線で結ぶ（うるさくならないよう線は極薄・短距離のみ）
    if (mode === "constellation") {
      const linkDist = 110;
      this.ctx.lineWidth = 1;
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            const alpha = 0.07 * (1 - dist / linkDist);
            this.ctx.beginPath();
            this.ctx.moveTo(a.x * dpr, a.y * dpr);
            this.ctx.lineTo(b.x * dpr, b.y * dpr);
            this.ctx.strokeStyle = `rgba(${colorRgb}, ${alpha})`;
            this.ctx.stroke();
          }
        }
      }
    }

    this.animationId = requestAnimationFrame(() => this.update());
  }

  // ==================== Static render (reduced motion) ====================

  public renderStatic(): void {
    if (!this.initialized) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const { colorRgb } = this.config;
    const dpr = this.dpr;

    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x * dpr, p.y * dpr, p.radius * dpr, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${colorRgb}, ${p.opacity})`;
      this.ctx.fill();
    }
  }

  // ==================== Resize ====================

  public resize(): void {
    const section = this.canvas.parentElement;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
  }
}

// ==================== Initialization ====================

function initParticles(): void {
  const sections = document.querySelectorAll<HTMLElement>("[data-particles]");
  if (sections.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const fields: ParticleField[] = [];

  // Create particle fields for each section
  sections.forEach((section) => {
    const config = SECTION_CONFIGS[section.id];
    if (!config) return;

    const field = new ParticleField(section, config);
    fields.push(field);
  });

  // IntersectionObserver for visibility-based animation
  const visibilityObserver = prefersReducedMotion
    ? null
    : new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            const field = fields.find((f) => f.sectionId === el.id);
            if (field) {
              field.setVisible(entry.isIntersecting);
            }
          }
        },
        { threshold: 0, rootMargin: "50px 0px 50px 0px" }
      );

  // Handle password gate: #site-content starts with display:none
  // Use ResizeObserver to detect when sections get real dimensions
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      const field = fields.find((f) => f.sectionId === el.id);
      if (!field) continue;

      if (field.tryInit()) {
        resizeObserver.unobserve(el);

        if (prefersReducedMotion) {
          field.renderStatic();
        } else if (visibilityObserver) {
          visibilityObserver.observe(el);
        }
      }
    }
  });

  // Start observing sections
  sections.forEach((section) => {
    const field = fields.find((f) => f.sectionId === section.id);
    if (!field) return;

    // Try immediate init (works if password already accepted via sessionStorage)
    if (field.tryInit()) {
      if (prefersReducedMotion) {
        field.renderStatic();
      } else if (visibilityObserver) {
        visibilityObserver.observe(section);
      }
    } else {
      // Section not yet visible (password gate) — wait for resize
      resizeObserver.observe(section);
    }
  });

  // Debounced window resize handler
  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      for (const field of fields) {
        field.resize();
        if (prefersReducedMotion) {
          field.renderStatic();
        }
      }
    }, 200);
  });
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initParticles);
} else {
  initParticles();
}
