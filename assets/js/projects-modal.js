/* ================================================================
   Tecnoindustrias Fabriano — projects-modal.js
   Modal de detalle de proyectos (cirugía fina: no toca estilos base)
   - Intercepta clicks en tarjetas de Proyectos destacados
   - Abre un modal con imagen + detalle técnico
   - Cierra con ESC / click fuera / botón
   ================================================================ */

(function () {
  "use strict";

  // Solo interceptamos links dentro del grid de proyectos destacados.
  function isProjectLink(el) {
    if (!el) return false;
    return (el.matches && el.matches(".project-card__link")) ||
           (el.matches && el.matches(".portfolio-item__link"));
  }

  // Crea el modal una sola vez (sin tocar el HTML original).
  function ensureModal() {
    var modal = document.getElementById("project-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "project-modal";
    modal.className = "project-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Detalle de proyecto");
    modal.setAttribute("aria-hidden", "true");
    modal.tabIndex = -1;

    modal.innerHTML = `
      <div class="project-modal__backdrop" aria-hidden="true"></div>
      <div class="project-modal__panel" role="document">
        <button class="project-modal__close" type="button" aria-label="Cerrar">
          <span aria-hidden="true">&times;</span>
        </button>

        <div class="project-modal__grid">
          <div class="project-modal__media">
            <img class="project-modal__image" src="" alt="" loading="lazy" />
          </div>

          <div class="project-modal__content">
            <p class="project-modal__tag"></p>
            <h3 class="project-modal__title"></h3>
            <p class="project-modal__meta"></p>

            <div class="project-modal__body">
              <p class="project-modal__desc">
                Trabajo realizado por Tecnoindustrias Fabriano. Detalle técnico disponible a pedido.
              </p>

              <ul class="project-modal__bullets">
                <li>Alcance: fabricación/instalación según proyecto.</li>
                <li>Normas y buenas prácticas aplicadas.</li>
                <li>Entrega y puesta en marcha con verificación.</li>
              </ul>
            </div>

            <div class="project-modal__actions">
              <a class="btn btn--primary project-modal__cta" href="#contacto">Consultar este proyecto</a>
              <a class="btn btn--ghost project-modal__more" href="gallery.html">Ver galería completa</a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  function openModalFromCard(card, linkHref) {
    var modal = ensureModal();
    var img = card.querySelector(".project-card__image") || card.querySelector(".portfolio-item__figure img");
    var titleEl = card.querySelector(".project-card__title") || card.querySelector(".portfolio-item__title");
    var tagEl = card.querySelector(".project-card__area-tag") || card.querySelector(".portfolio-item__tag");
    var metaEl = card.querySelector(".project-card__meta") || card.querySelector(".portfolio-item__meta");

    var modalImg = modal.querySelector(".project-modal__image");
    var modalTitle = modal.querySelector(".project-modal__title");
    var modalTag = modal.querySelector(".project-modal__tag");
    var modalMeta = modal.querySelector(".project-modal__meta");

    if (img && modalImg) {
      modalImg.src = img.getAttribute("src") || "";
      modalImg.alt = img.getAttribute("alt") || (titleEl ? titleEl.textContent.trim() : "Proyecto");
    }
    if (modalTitle) modalTitle.textContent = titleEl ? titleEl.textContent.trim() : "Proyecto";
    if (modalTag) modalTag.textContent = tagEl ? tagEl.textContent.trim() : "Proyecto";
    if (modalMeta) modalMeta.textContent = metaEl ? metaEl.textContent.trim() : "";

    // Guardamos el href original en "Ver más" por si a futuro agregan páginas reales
    var more = modal.querySelector(".project-modal__more");
    if (more) {
      // si el link es una ruta /proyectos/... que hoy no existe, mandamos a gallery.html
      // (se puede cambiar después cuando haya páginas reales)
      more.href = "gallery.html";
    }

    // Mostrar modal
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("is-modal-open");
    document.body.classList.add("is-modal-open");

    // Enfocar
    try { modal.focus(); } catch (e) {}

    // Cerrar handlers
    var closeBtn = modal.querySelector(".project-modal__close");
    var backdrop = modal.querySelector(".project-modal__backdrop");

    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("is-modal-open");
      document.body.classList.remove("is-modal-open");
      document.removeEventListener("keydown", onKeyDown);
      if (closeBtn) closeBtn.removeEventListener("click", close);
      if (backdrop) backdrop.removeEventListener("click", close);
      // --- NUEVO: Cerrar modal automáticamente al hacer clic en Consultar ---
    var consultBtn = modal.querySelector('a[href="#contacto"]');
    if (consultBtn) {
      consultBtn.addEventListener("click", function() {
        close(); // Llama a la función interna que limpia clases y libera el scroll
      });
    }
    }
    

    function onKeyDown(e) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("keydown", onKeyDown);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);
  }

  function onDocumentClick(e) {
    var a = e.target.closest ? e.target.closest("a") : null;
    if (!a || !isProjectLink(a)) return;

    var card = a.closest(".project-card") || a.closest(".portfolio-item");
    if (!card) return;

    var href = a.getAttribute("href") || "";
    if (href.startsWith("/proyectos/") || href.startsWith("proyectos/")) {
      e.preventDefault();
      openModalFromCard(card, href);
    }
  }

  document.addEventListener("click", onDocumentClick, { passive: false });
})();
