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
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
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
  team: {
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
    count: 30,
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

  private createParticle(randomY: boolean): Particle {
    const radius = randomRange(this.config.radiusMin, this.config.radiusMax);
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -radius * 2,
      radius,
      opacity: randomRange(this.config.opacityMin, this.config.opacityMax),
      velocityY: randomRange(this.config.speedMin, this.config.speedMax),
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: randomRange(0.005, 0.02),
      swayAmplitude: randomRange(0.05, this.config.swayMax),
    };
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
    const dpr = this.dpr;

    for (const p of this.particles) {
      // Update sway
      p.swayPhase += p.swaySpeed;
      const swayX = Math.sin(p.swayPhase) * p.swayAmplitude;

      // Move
      p.y += p.velocityY;
      p.x += swayX;

      // Recycle when past bottom
      if (p.y > this.height + p.radius * 2) {
        p.y = -p.radius * 2;
        p.x = Math.random() * this.width;
        p.swayPhase = Math.random() * Math.PI * 2;
      }

      // Wrap horizontally
      if (p.x < -p.radius) p.x = this.width + p.radius;
      if (p.x > this.width + p.radius) p.x = -p.radius;

      // Draw
      this.ctx.beginPath();
      this.ctx.arc(p.x * dpr, p.y * dpr, p.radius * dpr, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${colorRgb}, ${p.opacity})`;
      this.ctx.fill();
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
