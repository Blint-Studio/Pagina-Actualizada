(function() {
  'use strict';

  // ─── RAÍZ DINÁMICA ───────────────────────────────────────────────────────────
  const ROOT = document.body?.dataset?.root || './';

  // ─── TEMA (DARK / LIGHT) ─────────────────────────────────────────────────────

  const docEl = document.documentElement;

  function getStoredTheme() {
    try { return localStorage.getItem('theme'); } catch (_) { return null; }
  }

  function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored === 'dark' || stored === 'light') return stored;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    if (isDark) docEl.classList.add('dark'); else docEl.classList.remove('dark');
    try { localStorage.setItem('theme', theme); } catch (_) {}

    const header = document.querySelector('header');
    if (header) {
      if (isDark) header.classList.add('header-dark', 'text-gray-100');
      else header.classList.remove('header-dark', 'text-gray-100');
    }

    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      const iconSun  = toggleBtn.querySelector('#iconSun');
      const iconMoon = toggleBtn.querySelector('#iconMoon');
      if (iconSun && iconMoon) {
        if (isDark) { iconSun.classList.remove('hidden'); iconMoon.classList.add('hidden'); }
        else        { iconSun.classList.add('hidden');   iconMoon.classList.remove('hidden'); }
      }
    }
  }

  // Aplicar tema inmediatamente (antes de que se pinte la página)
  applyTheme(getPreferredTheme());


  // ─── INYECCIÓN DE LAYOUTS ─────────────────────────────────────────────────────

  async function inject(id, file) {
    const el = document.getElementById(id);
    if (!el) return;
    const res  = await fetch(ROOT + file);
    let html   = await res.text();
    html       = html.replaceAll('{root_rel}', ROOT);
    el.innerHTML = html;
    if (file.includes('header.html')) setupHeader();
  }

  /**
   * Extrae el primer <section> de pagePath y lo inserta en el placeholder.
   * También migra estilos y scripts del <head> al documento principal.
   */
  async function injectSection(placeholderId, pagePath) {
    const el = document.getElementById(placeholderId);
    if (!el) return;

    try {
      const res = await fetch(ROOT + pagePath);
      if (!res.ok) return;

      const parser = new DOMParser();
      const doc    = parser.parseFromString(await res.text(), 'text/html');

      // Copiar estilos del <head>
      doc.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
        const exists = Array.from(document.head.querySelectorAll(node.tagName))
          .some(e => e.outerHTML === node.outerHTML);
        if (!exists) {
          const newNode = node.cloneNode(true);
          if (newNode.tagName === 'LINK' && newNode.href) {
            try {
              const base = new URL(ROOT, location.origin).href;
              newNode.href = new URL(node.getAttribute('href'), base + pagePath).href;
            } catch (e) {
              console.error('[injector] Error construyendo URL del link:', e);
            }
          }
          document.head.appendChild(newNode);
        }
      });

      // Copiar scripts del <head>
      for (const script of doc.head.querySelectorAll('script')) {
        const newScript = document.createElement('script');
        if (script.src) {
          try {
            const base = new URL(ROOT, location.origin).href;
            newScript.src = new URL(script.src, base + pagePath).href;
          } catch (e) {
            console.error('[injector] Error construyendo URL del script:', e);
            continue;
          }
        } else {
          newScript.textContent = script.textContent;
        }
        document.head.appendChild(newScript);
      }

      // Migrar modales al <body>
      Array.from(doc.querySelectorAll('[id^="modal-"]')).forEach(modalNode => {
        if (!document.getElementById(modalNode.id)) {
          const clone = modalNode.cloneNode(true);
          try { clone.setAttribute('aria-hidden', 'true'); } catch (_) {}
          clone.classList.add('modal-overlay');
          document.body.appendChild(clone);
        }
      });

      // Insertar la sección principal
      const section = doc.querySelector('section');
      if (section) {
        let sectionHtml = section.outerHTML;
        sectionHtml = sectionHtml.replaceAll('{root_rel}', ROOT);
        el.innerHTML = sectionHtml;
      }

    } catch (err) {
      console.error('[injector] Error al inyectar sección:', err);
    }
  }

  // Versión global que persiste modales después de la inyección
  window.injectSection = async (placeholderId, pagePath) => {
    await injectSection(placeholderId, pagePath);
    _persistModals();
  };


  // ─── HEADER ───────────────────────────────────────────────────────────────────

  function setupHeader() {
    const navToggle  = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    // Sincronizar clases de tema
    applyTheme(getPreferredTheme());

    // Inyectar botón de dark-mode si no existe
    if (!document.getElementById('themeToggle')) {
      const btn = document.createElement('button');
      btn.id        = 'themeToggle';
      btn.className = 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-gray-700 hover:text-brandCoral transition-colors';
      btn.setAttribute('aria-label', 'Cambiar tema');
      btn.innerHTML =
        '<svg id="iconSun"  xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.95 19.07l1.41 1.41 1.8-1.79-1.42-1.42-1.79 1.8zM13 1h-2v3h2V1zm7.66 3.46l-1.41-1.41-1.8 1.79 1.42 1.42 1.79-1.8zM20 11v2h3v-2h-3zm-8 6a5 5 0 110-10 5 5 0 010 10zm3.29 3.48l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42z"/></svg>' +
        '<svg id="iconMoon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"        viewBox="0 0 24 24" fill="currentColor"><path d="M21.64 13a9 9 0 01-11.31-11.31A9 9 0 1021.64 13z"/></svg>';

      const desktopContainer = document.querySelector('header .md\\:flex.items-center.gap-3');
      if (desktopContainer && !desktopContainer.classList.contains('hidden')) {
        let actions = desktopContainer.querySelector('.header-actions');
        if (!actions) {
          actions = document.createElement('div');
          actions.className = 'header-actions flex items-center gap-3';
          desktopContainer.appendChild(actions);
        }
        if (!actions.contains(btn)) actions.appendChild(btn);
      } else {
        const navToggleEl = document.querySelector('header #navToggle');
        if (navToggleEl && navToggleEl.parentNode) {
          let wrapper = navToggleEl.parentNode.querySelector('.header-actions');
          if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'header-actions flex items-center gap-1';
            navToggleEl.parentNode.insertBefore(wrapper, navToggleEl);
          }
          if (!wrapper.contains(btn)) wrapper.appendChild(btn);
          if (navToggleEl.parentNode !== wrapper) wrapper.appendChild(navToggleEl);
        } else {
          document.querySelector('header')?.appendChild(btn);
        }
      }
    }

    // Listener del toggle (una sola vez)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle && !themeToggle.dataset.listenerAdded) {
      themeToggle.dataset.listenerAdded = 'true';
      themeToggle.addEventListener('click', () => {
        applyTheme(docEl.classList.contains('dark') ? 'light' : 'dark');
      });
    }

    // Resaltar enlace activo
    const path      = location.pathname.replace(/\/+$/, '');
    const navKeyMap = { 'hero': 'hero', 'quienes-somos': 'quienes', 'secretarias': 'secretarias', 'sumate': 'sumate' };
    const activeKey = Object.keys(navKeyMap).find(k => path.includes('/' + k));
    if (activeKey) {
      document.querySelectorAll('[data-nav]').forEach(a => {
        if (a.getAttribute('data-nav') === navKeyMap[activeKey]) {
          a.classList.add('text-brandBlue', 'font-semibold');
        }
      });
    }

    // Ocultar/mostrar header al hacer scroll
    const header = document.querySelector('header');
    if (header && !header.dataset.scrollListenerAdded) {
      header.dataset.scrollListenerAdded = 'true';
      header.style.transition = 'transform 0.3s ease-in-out';
      header.style.transform  = 'translateY(0)';

      let lastScrollY = window.scrollY;
      let ticking     = false;

      const updateHeader = () => {
        const y = window.scrollY;
        if (y < 50 || y < lastScrollY) {
          header.style.transform = 'translateY(0)';
        } else if (y > lastScrollY && y > 100) {
          header.style.transform = 'translateY(-100%)';
        }
        lastScrollY = y;
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) { window.requestAnimationFrame(updateHeader); ticking = true; }
      }, { passive: true });
    }

    // Navegación suave desde index
    const isIndexPage = location.pathname.endsWith('index.html') || location.pathname.endsWith('/');
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!isIndexPage || !href.includes('#')) return;

        e.preventDefault();
        const hash          = href.split('#')[1];
        const targetSection = document.getElementById(hash);
        if (!targetSection) return;

        history.replaceState(null, '', location.pathname);
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      });
    });
  }


  // ─── MODALES ─────────────────────────────────────────────────────────────────

  window.openModal = function(id) {
    const modal = document.getElementById('modal-' + id);
    if (!modal) { console.warn('[modals] modal no encontrado:', id); return; }
    modal.classList.remove('hidden');
    try { modal.setAttribute('aria-hidden', 'false'); } catch (_) {}
    docEl.classList.add('overflow-hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function(id) {
    const modal = document.getElementById('modal-' + id);
    if (!modal) { console.warn('[modals] modal no encontrado:', id); return; }
    modal.classList.add('hidden');
    try { modal.setAttribute('aria-hidden', 'true'); } catch (_) {}
    docEl.classList.remove('overflow-hidden');
    document.body.style.overflow = '';
  };

  // Cerrar al clic en el overlay
  document.addEventListener('click', e => {
    const modal = e.target.closest('[id^="modal-"]');
    if (modal && e.target === modal) {
      window.closeModal(modal.id.replace('modal-', ''));
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('[id^="modal-"]').forEach(modal => {
      if (!modal.classList.contains('hidden')) {
        window.closeModal(modal.id.replace('modal-', ''));
      }
    });
  });


  // ─── NAVEGACIÓN ──────────────────────────────────────────────────────────────

  /**
   * Manejo unificado del hash al cargar la página desde cualquier ruta raíz.
   */
  function handleInitialHash() {
    const isRoot = location.pathname.endsWith('index.html') ||
                   location.pathname.endsWith('/') ||
                   location.pathname === '/';
    if (!isRoot || !location.hash) return;

    const sectionId = location.hash.substring(1);
    history.replaceState(null, '', location.pathname);

    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  handleInitialHash();

  // Listener de [data-nav] — navega al index y desplaza a la sección
  document.querySelectorAll('[data-nav]').forEach(navItem => {
    navItem.addEventListener('click', e => {
      e.preventDefault();
      const sectionId = navItem.getAttribute('data-nav');
      window.location.href = ROOT + 'index.html#' + sectionId;
    });
  });


  // ─── MANTENIMIENTO DE MODALES ────────────────────────────────────────────────

  function _persistModals() {
    document.querySelectorAll('[id^="modal-"]').forEach(modal => {
      if (!document.body.contains(modal)) document.body.appendChild(modal);
    });
  }

  document.addEventListener('DOMContentLoaded', _persistModals);


  // ─── INICIALIZACIÓN ───────────────────────────────────────────────────────────

  inject('app-header', 'layouts/header.html');
  inject('app-footer', 'layouts/footer.html');

  window.injectSection('landing-hero',        'pages/hero/index.html');
  window.injectSection('landing-quienes',     'pages/quienes-somos/index.html');
  window.injectSection('landing-secretarias', 'pages/secretarias/index.html');
  window.injectSection('landing-sumate',      'pages/sumate/index.html');

})();
