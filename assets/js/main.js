/* Tecnoindustrias Fabriano — UI interactions (no deps) */
(() => {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

  // ========== Hero Services Dropdown ==========
  const heroServicesTrigger = qs('.hero-services-trigger');
  const heroServicesPanel  = qs('#hero-services-panel');

  if (heroServicesTrigger && heroServicesPanel) {
    const openHeroServices = () => {
      heroServicesPanel.classList.add('is-open');
      heroServicesTrigger.setAttribute('aria-expanded', 'true');
    };
    const closeHeroServices = () => {
      heroServicesPanel.classList.remove('is-open');
      heroServicesTrigger.setAttribute('aria-expanded', 'false');
    };

    heroServicesTrigger.addEventListener('click', () => {
      heroServicesPanel.classList.contains('is-open') ? closeHeroServices() : openHeroServices();
    });
    document.addEventListener('click', (e) => {
      if (!heroServicesPanel.classList.contains('is-open')) return;
      if (!e.target.closest('.hero-services-wrap')) closeHeroServices();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeHeroServices(); });
  }

  // ========== Mobile drawer ==========
  const drawer = qs('#mobile-drawer');
  const openBtn = qs('.site-header__burger');
  const closeBtn = qs('.mobile-drawer__close');

  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  };

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  };

  if (openBtn && drawer) openBtn.addEventListener('click', openDrawer);
  if (closeBtn && drawer) closeBtn.addEventListener('click', closeDrawer);

  if (drawer) {
    drawer.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }

  // ========== Mobile nav (multi-level) ==========
  qsa('[data-go-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lvl = btn.getAttribute('data-go-to');
      const current = qs('.mobile-nav__list--active');
      const next = qs(`.mobile-nav__list[data-level="${lvl}"]`);
      if (current) current.classList.remove('mobile-nav__list--active');
      if (next) next.classList.add('mobile-nav__list--active');
    });
  });

  qsa('[data-back-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lvl = btn.getAttribute('data-back-to');
      const current = qs('.mobile-nav__list--active');
      const prev = qs(`.mobile-nav__list[data-level="${lvl}"]`);
      if (current) current.classList.remove('mobile-nav__list--active');
      if (prev) prev.classList.add('mobile-nav__list--active');
    });
  });

  // ========== Tabs ==========
  qsa('[data-tabs]').forEach(tabs => {
    const buttons = qsa('[data-tab]', tabs);
    const panels = qsa('[data-panel]', tabs);
    const activate = (name) => {
      buttons.forEach(b => b.classList.toggle('is-active', b.getAttribute('data-tab') === name));
      panels.forEach(p => p.hidden = (p.getAttribute('data-panel') !== name));
    };
    buttons.forEach(b => b.addEventListener('click', () => activate(b.getAttribute('data-tab'))));
    const first = buttons.find(b => b.classList.contains('is-active')) || buttons[0];
    if (first) activate(first.getAttribute('data-tab'));
  });

  // ========== Accordions ==========
  qsa('[data-accordion]').forEach(acc => {
    const btn = qs('[data-accordion-trigger]', acc);
    const panel = qs('[data-accordion-panel]', acc);
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const isOpen = acc.classList.toggle('is-open');
      panel.hidden = !isOpen;
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  // ========== Simple count-up ==========
  const counters = qsa('[data-count]');
  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (!ent.isIntersecting) return;
        const el = ent.target;
        io.unobserve(el);
        const target = Number(el.getAttribute('data-count') || '0');
        const dur = 900;
        const t0 = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const val = Math.floor(target * p);
          el.textContent = val.toLocaleString('es-AR');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.25 });
    counters.forEach(c => io.observe(c));
  }
})();


// ========== ACTIVE NAV ON SCROLL ==========
(() => {
  const navLinks = Array.from(document.querySelectorAll('.site-nav__link[href^="#"]'));
  if (!navLinks.length) return;

  const linkById = new Map();
  navLinks.forEach((a) => {
    const id = (a.getAttribute('href') || '').slice(1);
    if (!id) return;
    linkById.set(id, a);
  });

  const setActive = (id) => {
    navLinks.forEach((a) => {
      a.classList.remove('site-nav__link--active');
      a.removeAttribute('aria-current');
    });
    const a = linkById.get(id);
    if (a) { a.classList.add('site-nav__link--active'); a.setAttribute('aria-current', 'page'); }
  };

  navLinks.forEach((a) => {
    a.addEventListener('click', () => {
      const id = (a.getAttribute('href') || '').slice(1);
      if (id) setActive(id);
    });
  });

  const sections = Array.from(linkById.keys()).map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const OFFSET = 120;
  let rafPending = false;

  const onScroll = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      // Recorre de abajo hacia arriba; la primera cuyo top <= OFFSET es la activa
      let activeId = null;
      for (let i = sections.length - 1; i >= 0; i--) {
        const top = sections[i].getBoundingClientRect().top;
        if (top <= OFFSET) {
          activeId = sections[i].id;
          break;
        }
      }
      if (activeId) setActive(activeId);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  const initial = location.hash ? location.hash.slice(1) : 'inicio';
  if (linkById.has(initial)) setActive(initial);
})();


// ========== HERO NEWS SLIDER ==========
(() => {
  const slider = document.querySelector('.hero__news-slider');
  if (!slider) return;

  const slides   = Array.from(slider.querySelectorAll('.hero__news-slide'));
  const dots     = Array.from(slider.querySelectorAll('.hero__news-dot'));
  const btnPrev  = slider.querySelector('.hero__news-arrow--prev');
  const btnNext  = slider.querySelector('.hero__news-arrow--next');
  const counter  = slider.querySelector('.hero__news-counter span');
  const progress = slider.querySelector('.hero__news-progress');

  if (!slides.length) return;

  const INTERVAL = 4500;
  let current = 0;
  let timer = null;

  const pad = (n) => String(n + 1).padStart(2, '0');

  const startProgress = () => {
    if (!progress) return;
    progress.style.transition = 'none';
    progress.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progress.style.transition = `width ${INTERVAL}ms linear`;
        progress.style.width = '100%';
      });
    });
  };

  const pauseProgress = () => {
    if (!progress) return;
    const w = getComputedStyle(progress).width;
    progress.style.transition = 'none';
    progress.style.width = w;
  };

  const goTo = (index) => {
    slides[current].classList.remove('is-active');
    if (dots[current]) dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    if (dots[current]) dots[current].classList.add('is-active');
    if (counter) counter.textContent = pad(current);
    startProgress();
  };

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  };

  // Arranque
  goTo(0);
  resetTimer();

  // Flechas
  if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  // Dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
  });

  // Hover pausa
  slider.addEventListener('mouseenter', () => { clearInterval(timer); pauseProgress(); });
  slider.addEventListener('mouseleave', () => { resetTimer(); startProgress(); });

  // Swipe móvil
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
  }, { passive: true });
})();


// ========== PORTFOLIO FILTERS ==========
(() => {
  const filterBtns = Array.from(document.querySelectorAll('.portfolio-filter'));
  const items = Array.from(document.querySelectorAll('.portfolio-item'));

  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Actualizar estado de botones
      filterBtns.forEach((b) => {
        b.classList.remove('portfolio-filter--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('portfolio-filter--active');
      btn.setAttribute('aria-pressed', 'true');

      // Mostrar/ocultar items
      items.forEach((item) => {
        const area = item.getAttribute('data-area');
        const visible = filter === 'all' || area === filter;
        item.style.display = visible ? '' : 'none';
      });
    });
  });
})();
// ================================================================
// SCROLLSPY DEFINITIVO: Control de la línea azul en el Menú
// ================================================================
(() => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  if (!sections.length || !navLinks.length) return;

  // Bandera para evitar que el scroll pise el efecto del click
  let isClickScrolling = false;

  const updateActiveLink = () => {
    // Si el usuario clickeó, no dejamos que el scrollspy interfiera hasta que llegue
    if (isClickScrolling) return;

    // Calculamos la posición sumando un tercio de la pantalla para suavizar el cambio
    const scrollPos = window.scrollY + (window.innerHeight / 3);
    let activeId = "";

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        activeId = section.getAttribute("id");
      }
    });

    // Apagamos y encendemos la clase exacta de tu diseño BEM
    navLinks.forEach((link) => {
      link.classList.remove("nav__link--active");
      
      if (activeId && link.getAttribute("href") === `#${activeId}`) {
        link.classList.add("nav__link--active");
      } else if (!activeId && link.getAttribute("href") === "#inicio") {
        // Si está arriba de todo, vuelve a iluminar Inicio obligatoriamente
        link.classList.add("nav__link--active");
      }
    });
  };

  // Escuchamos los clicks en los botones del menú
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      
      if (href && href.startsWith("#")) {
        isClickScrolling = true;

        // Movemos la línea azul de inmediato al botón que tocaste
        navLinks.forEach((l) => l.classList.remove("nav__link--active"));
        link.classList.add("nav__link--active");

        // Esperamos a que termine el efecto smooth-scroll y reactivamos el detector
        setTimeout(() => {
          isClickScrolling = false;
          updateActiveLink();
        }, 800);
      }
    });
  });

  // Eventos para detectar el movimiento de la ruedita
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("DOMContentLoaded", updateActiveLink);
  updateActiveLink();
})();
// ================================================================
// SCROLLSPY: Indicador de sección activa en el Menú (Cero conflictos)
// ================================================================
(() => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  if (!sections.length || !navLinks.length) return;

  // Bandera para desactivar el scrollspy momentáneamente mientras se hace clic
  let isScrollingByClick = false; 

  const scrollSpy = () => {
    // Si el movimiento es por un clic en el menú, no hacemos nada
    if (isScrollingByClick) return;

    const currentScroll = window.scrollY + (window.innerHeight / 3);
    let currentSectionId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove("nav__link--active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("nav__link--active");
        }
      });
    } else {
      navLinks.forEach((link) => {
        link.classList.remove("nav__link--active");
        if (link.getAttribute("href") === "#inicio") {
          link.classList.add("nav__link--active");
        }
      });
    }
  };

  // Interceptamos los clics en los enlaces del menú
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      
      // Solo si es un enlace interno de la página
      if (href.startsWith("#")) {
        isScrollingByClick = true;

        // Pintamos inmediatamente el botón que se clickeó
        navLinks.forEach((l) => l.classList.remove("nav__link--active"));
        link.classList.add("nav__link--active");

        // Esperamos 800ms (lo que tarda el scroll suave en llegar) y rehabilitamos el detector
        setTimeout(() => {
          isScrollingByClick = false;
          scrollSpy(); // Forzamos un chequeo al final por seguridad
        }, 800);
      }
    });
  });

  window.addEventListener("scroll", scrollSpy, { passive: true });
  window.addEventListener("DOMContentLoaded", scrollSpy);
  scrollSpy();
})();