/**
 * Mobile menu toggle behavior.
 * Listens for clicks on [data-menu-toggle] and toggles
 * the [data-mobile-menu] panel visibility.
 */
function initMobileMenu(): void {
  const toggleBtn = document.querySelector<HTMLButtonElement>(
    "[data-menu-toggle]"
  );
  const mobileMenu = document.querySelector<HTMLElement>("[data-mobile-menu]");

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener("click", () => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenu.classList.toggle("hidden");

    // Update button icon (hamburger vs close)
    const icon = toggleBtn.querySelector("svg");
    if (icon) {
      if (!isExpanded) {
        // Switch to close icon
        icon.innerHTML =
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
      } else {
        // Switch to hamburger icon
        icon.innerHTML =
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
      }
    }
  });

  // Close menu when clicking a navigation link inside it
  const menuLinks = mobileMenu.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      toggleBtn.setAttribute("aria-expanded", "false");

      // Reset to hamburger icon
      const icon = toggleBtn.querySelector("svg");
      if (icon) {
        icon.innerHTML =
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
      }
    });
  });
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileMenu);
} else {
  initMobileMenu();
}
