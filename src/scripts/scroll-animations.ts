/**
 * Scroll-triggered animation observer.
 * Watches for elements with animation classes and adds
 * the `animate-visible` class when they enter the viewport.
 *
 * Supports:
 * - .animate-fade-up
 * - .animate-fade-in
 * - .animate-scale-in
 *
 * Respects prefers-reduced-motion.
 */
const ANIMATION_SELECTORS = [
  ".animate-fade-up",
  ".animate-fade-in",
  ".animate-scale-in",
];

function initScrollAnimations(): void {
  const elements = document.querySelectorAll<HTMLElement>(
    ANIMATION_SELECTORS.join(", ")
  );

  if (elements.length === 0) return;

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add("animate-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add stagger delay if data-delay attribute is present
          const delay = (entry.target as HTMLElement).dataset.delay;
          if (delay) {
            (entry.target as HTMLElement).style.transitionDelay = `${delay}ms`;
          }
          entry.target.classList.add("animate-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollAnimations);
} else {
  initScrollAnimations();
}
