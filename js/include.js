document.addEventListener("DOMContentLoaded", () => {
  loadPartial("header", "partials/header.html", initHeader);
  loadPartial("footer", "partials/footer.html");
});

function loadPartial(id, file, callback) {
  fetch(file)
    .then((resp) => {
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      return resp.text();
    })
    .then((html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
      if (typeof callback === "function") callback();
    })
    .catch((err) => {
      console.error("Ошибка загрузки partial:", file, err);
    });
}

function initHeader() {
  const header = document.querySelector(".site-header");
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("menu-overlay");
  const body = document.body;
  const desktopOverlay = document.getElementById("desktop-overlay");

  // === DESKTOP: Mega menu hover ===
  document.querySelectorAll(".has-mega").forEach((item) => {
    const link = item.querySelector(".nav-link");
    const menu = item.querySelector(".mega-menu");
    if (!link || !menu) return;

    let hoverTimeout;

    item.addEventListener("mouseenter", () => {
      if (window.innerWidth <= 992) return;
      clearTimeout(hoverTimeout);

      document.querySelectorAll(".has-mega.open").forEach((h) => {
        if (h !== item) {
          h.classList.remove("open");
          const l = h.querySelector(".nav-link");
          if (l) l.setAttribute("aria-expanded", "false");
          const m = h.querySelector(".mega-menu");
          if (m) m.setAttribute("aria-hidden", "true");
        }
      });

      item.classList.add("open");
      menu.setAttribute("aria-hidden", "false");
      link.setAttribute("aria-expanded", "true");

      if (desktopOverlay) desktopOverlay.classList.add("visible");
    });

    item.addEventListener("mouseleave", () => {
      if (window.innerWidth <= 992) return;
      hoverTimeout = setTimeout(() => {
        item.classList.remove("open");
        menu.setAttribute("aria-hidden", "true");
        link.setAttribute("aria-expanded", "false");

        const anyOpen = document.querySelector(".has-mega.open");
        if (!anyOpen && desktopOverlay)
          desktopOverlay.classList.remove("visible");
      }, 180);
    });
  });

  // === DESKTOP: Submenu hover ===
  document.querySelectorAll(".mega-links .has-sub").forEach((item) => {
    const submenuId = item.getAttribute("data-submenu");
    if (!submenuId) return;

    const megaMenu = item.closest(".mega-menu");
    const submenuArea = megaMenu?.querySelector(".mega-submenu-area");
    if (!submenuArea) return;

    let showTimeout, hideTimeout;
    const hoverDelay = 200;

    function showSubmenu() {
      clearTimeout(hideTimeout);
      clearTimeout(showTimeout);

      showTimeout = setTimeout(() => {
        submenuArea
          .querySelectorAll(".submenu-content")
          .forEach((c) => c.classList.remove("active"));
        megaMenu
          .querySelectorAll(".has-sub")
          .forEach((sub) => sub.classList.remove("active"));

        const targetContent = submenuArea.querySelector(
          `[data-submenu-id="${submenuId}"]`
        );
        if (targetContent) targetContent.classList.add("active");
        item.classList.add("active");
      }, hoverDelay);
    }

    function hideSubmenu() {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);

      hideTimeout = setTimeout(() => {
        if (!item.matches(":hover") && !submenuArea.matches(":hover")) {
          item.classList.remove("active");
          submenuArea
            .querySelectorAll(".submenu-content")
            .forEach((c) => c.classList.remove("active"));
        }
      }, hoverDelay);
    }

    item.addEventListener("mouseenter", () => {
      if (window.innerWidth <= 992) return;
      showSubmenu();
    });

    item.addEventListener("mouseleave", () => {
      if (window.innerWidth <= 992) return;
      hideSubmenu();
    });

    submenuArea.addEventListener("mouseenter", () => {
      if (window.innerWidth <= 992) return;
      clearTimeout(hideTimeout);
    });

    submenuArea.addEventListener("mouseleave", () => {
      if (window.innerWidth <= 992) return;
      hideSubmenu();
    });
  });

  // === Закрытие по клику на overlay ===
  if (desktopOverlay) {
    desktopOverlay.addEventListener("click", () => {
      document.querySelectorAll(".has-mega.open").forEach((h) => {
        h.classList.remove("open");
        const l = h.querySelector(".nav-link");
        if (l) l.setAttribute("aria-expanded", "false");
        const m = h.querySelector(".mega-menu");
        if (m) m.setAttribute("aria-hidden", "true");
      });
      desktopOverlay.classList.remove("visible");
    });
  }

  if (!header || !burger || !mobileMenu || !overlay) {
    console.warn("initHeader: отсутствуют ключевые элементы header/menu/overlay");
    return;
  }

  // === Открытие и закрытие мобильного меню ===
  function openMobile() {
    mobileMenu.classList.add("open");
    overlay.classList.add("visible");
    burger.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
    body.classList.add("no-scroll");
  }

  function closeMobile() {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("visible");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
    body.classList.remove("no-scroll");
  }

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.contains("open") ? closeMobile() : openMobile();
  });

  overlay.addEventListener("click", closeMobile);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobile();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992 && mobileMenu.classList.contains("open")) {
      closeMobile();
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".site-header") &&
      !e.target.closest("#mobile-menu")
    ) {
      closeMobile();
      document.querySelectorAll(".has-mega.open").forEach((h) => {
        h.classList.remove("open");
        const l = h.querySelector(".nav-link");
        if (l) l.setAttribute("aria-expanded", "false");
        const m = h.querySelector(".mega-menu");
        if (m) m.setAttribute("aria-hidden", "true");
      });
    }
  });

  // === Тень шапки при скролле ===
  const scrollThreshold = 8;
  function checkScroll() {
    header.classList.toggle("scrolled", window.scrollY > scrollThreshold);
  }
  checkScroll();
  window.addEventListener("scroll", checkScroll);

  // === Закрытие мобильного меню при клике на ссылку ===
  const mobileLinks = mobileMenu.querySelectorAll(".nav-link");
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMobile();
    });
  });

    // === Закрытие меню при клике на "Оставить заявку" ===
  const contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      closeMobile();
    });
  }
}
