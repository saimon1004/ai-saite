/**
 * Smooth scroll handler for anchor links.
 * Intercepts clicks on href="#xxx" links and scrolls
 * with an offset to account for the fixed header (80px).
 * Updates the URL hash via history.pushState.
 */
const HEADER_OFFSET = 80;

function initSmoothScroll(): void {
  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest<HTMLAnchorElement>('a[href^="#"]');

    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const targetId = href.slice(1);
    const targetElement = document.getElementById(targetId);

    if (!targetElement) return;

    e.preventDefault();

    const targetPosition =
      targetElement.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Update URL hash without jumping
    history.pushState(null, "", href);
  });

  // Handle initial hash on page load
  const initialHash = window.location.hash;
  if (initialHash && initialHash !== "#") {
    const targetElement = document.getElementById(initialHash.slice(1));
    if (targetElement) {
      // Small delay to ensure layout is complete
      requestAnimationFrame(() => {
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          HEADER_OFFSET;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      });
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSmoothScroll);
} else {
  initSmoothScroll();
}
