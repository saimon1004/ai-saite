/**
 * Active navigation link highlighter.
 * Uses IntersectionObserver to monitor section[id] elements
 * and sets data-active="true" on the corresponding nav link.
 */
function initActiveNav(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");
  const sections = document.querySelectorAll<HTMLElement>("section[id], div[id]");

  if (navLinks.length === 0 || sections.length === 0) return;

  // Build a map of section ids to nav links
  const linkMap = new Map<string, HTMLAnchorElement[]>();
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      const id = href.slice(1);
      if (!linkMap.has(id)) {
        linkMap.set(id, []);
      }
      linkMap.get(id)!.push(link);
    }
  });

  function clearActiveStates(): void {
    navLinks.forEach((link) => {
      link.removeAttribute("data-active");
    });
  }

  function setActive(id: string): void {
    clearActiveStates();
    const links = linkMap.get(id);
    if (links) {
      links.forEach((link) => {
        link.setAttribute("data-active", "true");
      });
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-40% 0px -60% 0px",
      threshold: 0,
    }
  );

  // Only observe sections that have a corresponding nav link
  sections.forEach((section) => {
    if (linkMap.has(section.id)) {
      observer.observe(section);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initActiveNav);
} else {
  initActiveNav();
}
