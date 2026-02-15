/**
 * Counter animation script.
 * Uses IntersectionObserver to watch elements with data-counter attribute.
 * When visible, animates from 0 to the target value over 1.5 seconds with easeOut.
 */
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function animateCounter(element: HTMLElement, target: number, duration: number): void {
  const start = performance.now();
  const suffix = element.dataset.counterSuffix || "";
  const prefix = element.dataset.counterPrefix || "";

  function update(currentTime: number): void {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const currentValue = Math.round(easedProgress * target);

    element.textContent = `${prefix}${currentValue.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>("[data-counter]");

  if (counters.length === 0) return;

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.counter || "0", 10);
      const suffix = counter.dataset.counterSuffix || "";
      const prefix = counter.dataset.counterPrefix || "";
      counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const target = parseInt(element.dataset.counter || "0", 10);
          const duration = 1500; // 1.5 seconds

          animateCounter(element, target, duration);
          observer.unobserve(element);
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  counters.forEach((counter) => {
    // Set initial value to 0
    const suffix = counter.dataset.counterSuffix || "";
    const prefix = counter.dataset.counterPrefix || "";
    counter.textContent = `${prefix}0${suffix}`;
    observer.observe(counter);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCounters);
} else {
  initCounters();
}
