/**
 * autoridades-ext.js
 * Lógica modular para mejorar la sección de Autoridades y Galería.
 */
(function() {
  'use strict';

  const CONFIG = {
    presidentData: {
      name: "Germán R. Flaherty",
      role: "Presidente · Junta Capital",
      title: "Dirigente Político - Abogado - Consultor Jurídico",
      education: [
        "Abogado — Universidad Nacional de Córdoba (UNC)",
        "Especialista en Derecho Administrativo",
        "Maestría en Políticas Públicas (cursando)"
      ],
      international: [
        "Beca de Excelencia Académica — OEA",
        "Seminario de Liderazgo Político (Washington, D.C.)",
        "Mención de Honor en Debate Internacional (México)"
      ],
      trajectory: [
        "Presidente JFC (2022 — Presente)",
        "Consultor Jurídico en Legislatura de Córdoba",
        "Coordinador de Programas de Desarrollo Juvenil",
        "Asesor en Políticas de Transparencia"
      ],
      img: "assets/img/german.jpg" // Imagen base (si no existe, fallará a placeholder)
    },
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800", title: "Innovación" },
      { url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800", title: "Equipo" },
      { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", title: "Futuro" },
      { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800", title: "Compromiso" },
      { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", title: "Liderazgo" },
      { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800", title: "Participación" }
    ]
  };

  function init() {
    console.log('[autoridades-ext] Iniciando extensiones...');
    
    // Observar el DOM para cuando se inyecte la sección de autoridades
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const authGrid = document.querySelector('.auth-grid');
          if (authGrid && !authGrid.dataset.extended) {
            extendAuthorities(authGrid);
            injectGallery();
          }
          
          const modalPres = document.getElementById('modal-presidente');
          if (modalPres && !modalPres.dataset.extended) {
            extendModalPresidente(modalPres);
          }
          
          // Aplicar glassmorphism a todos los modales
          document.querySelectorAll('[id^="modal-"]').forEach(modal => {
            if (!modal.classList.contains('modal-extended')) {
              modal.classList.add('modal-extended');
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Intento inicial si ya existe
    const authGrid = document.querySelector('.auth-grid');
    if (authGrid) extendAuthorities(authGrid);
    
    const modalPres = document.getElementById('modal-presidente');
    if (modalPres) extendModalPresidente(modalPres);
    
    injectGallery();
  }

  function extendAuthorities(grid) {
    grid.dataset.extended = "true";
    const cards = Array.from(grid.querySelectorAll('.authority-card'));
    if (cards.length < 3) return;

    // Contenedor principal para la nueva estructura
    const container = grid.parentElement;
    
    // 1. Crear el grid de destacados (Top 3)
    const featuredGrid = document.createElement('div');
    featuredGrid.className = 'grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 justify-items-center';
    
    // Tomar los primeros 3
    const top3 = cards.slice(0, 3);
    const names = [CONFIG.presidentData.name, "Nombre Apellido", "Nombre Apellido"]; // Solo tenemos el del presidente por ahora

    top3.forEach((card, index) => {
      card.classList.add('featured-authority');
      const nameP = card.querySelector('p');
      if (nameP && names[index] !== "Nombre Apellido") {
        nameP.textContent = names[index];
      }
      wrapInFlipCard(card);
      featuredGrid.appendChild(card);
    });

    // 2. Crear el carrusel para el resto
    const secretaries = cards.slice(3);
    if (secretaries.length > 0) {
      const carouselContainer = document.createElement('div');
      carouselContainer.id = 'secretaries-carousel-container';
      carouselContainer.innerHTML = `
        <div class="text-center mb-6">
          <h4 class="text-xl font-bold text-brandBlue">Secretarías y Equipo</h4>
        </div>
        <button class="carousel-nav-btn carousel-prev" aria-label="Anterior"><i class="fas fa-chevron-left"></i></button>
        <div id="secretaries-carousel"></div>
        <button class="carousel-nav-btn carousel-next" aria-label="Siguiente"><i class="fas fa-chevron-right"></i></button>
      `;
      
      const carousel = carouselContainer.querySelector('#secretaries-carousel');
      secretaries.forEach(card => {
        card.classList.add('carousel-card');
        wrapInFlipCard(card);
        carousel.appendChild(card);
      });
      
      // Reemplazar el grid original por la nueva estructura
      grid.style.display = 'none';
      container.insertBefore(featuredGrid, grid);
      container.insertBefore(carouselContainer, grid);
      
      setupCarouselLogic(carouselContainer);
    } else {
      grid.style.display = 'none';
      container.insertBefore(featuredGrid, grid);
    }
  }

  function wrapInFlipCard(card) {
    // Si ya está envuelto, ignorar
    if (card.querySelector('.authority-card-inner')) return;

    const content = card.querySelector('.authority-content');
    const button = card.querySelector('.authority-button');
    const role = card.querySelector('h4').textContent;
    const name = card.querySelector('p').textContent;
    
    // Crear estructura flip
    const inner = document.createElement('div');
    inner.className = 'authority-card-inner';
    
    const front = document.createElement('div');
    front.className = 'authority-card-front bg-white p-6 shadow-lg h-full flex flex-col items-center justify-between';
    front.innerHTML = content.outerHTML;
    
    const back = document.createElement('div');
    back.className = 'authority-card-back';
    const avatarGradient = content.querySelector('.authority-avatar').style.background;
    back.innerHTML = `
      <div class="w-24 h-24 rounded-full mb-4 flex items-center justify-center" style="background:${avatarGradient}">
        <i class="fa-solid fa-user-tie text-4xl text-white"></i>
      </div>
      <h5 class="text-lg font-bold">${name}</h5>
      <p class="text-sm opacity-80 mb-4">${role}</p>
      <div class="flex gap-4">
        <i class="fa-brands fa-facebook-f cursor-pointer hover:text-brandCyan text-xl"></i>
        <i class="fa-brands fa-instagram cursor-pointer hover:text-brandCyan text-xl"></i>
        <i class="fa-brands fa-twitter cursor-pointer hover:text-brandCyan text-xl"></i>
      </div>
    `;

    inner.appendChild(front);
    inner.appendChild(back);
    
    // Limpiar tarjeta y agregar el inner
    card.innerHTML = '';
    card.appendChild(inner);
    
    // El botón debe quedar fuera del flip y ser accesible
    if (button) {
      button.style.position = 'relative';
      button.style.zIndex = '50';
      card.appendChild(button);
    }
    
    card.classList.add('authority-card-container');
  }

  function setupCarouselLogic(container) {
    const carousel = container.querySelector('#secretaries-carousel');
    const prev = container.querySelector('.carousel-prev');
    const next = container.querySelector('.carousel-next');
    
    const scrollAmount = 300;
    
    prev.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    next.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    
    // Swipe support simple
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => isDown = false);
    carousel.addEventListener('mouseup', () => isDown = false);
    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    });
  }

  function extendModalPresidente(modal) {
    modal.dataset.extended = "true";
    const d = CONFIG.presidentData;
    
    const nameEl = modal.querySelector('h2');
    if (nameEl) nameEl.textContent = d.name;
    
    const roleEl = modal.querySelector('p span'); // Ajustar selector basado en estructura
    if (roleEl) {
      roleEl.innerHTML = `<span class="w-2 h-2 rounded-full inline-block mr-2" style="background:var(--brandCoral)"></span>${d.role}`;
    }
    
    // Reemplazar secciones de info
    const sectionsContainer = modal.querySelector('.mt-8');
    if (sectionsContainer) {
      sectionsContainer.innerHTML = `
        <div class="grid gap-8 md:grid-cols-2">
          <section>
            <h3 class="text-lg font-bold flex items-center gap-2 mb-3">
              <i class="fas fa-graduation-cap text-brandCyan"></i> Formación Académica
            </h3>
            <ul class="space-y-2 text-sm opacity-90">
              ${d.education.map(item => `<li>• ${item}</li>`).join('')}
            </ul>
          </section>
          
          <section>
            <h3 class="text-lg font-bold flex items-center gap-2 mb-3">
              <i class="fas fa-globe text-brandCyan"></i> Distinción Internacional
            </h3>
            <ul class="space-y-2 text-sm opacity-90">
              ${d.international.map(item => `<li>• ${item}</li>`).join('')}
            </ul>
          </section>
          
          <section class="md:col-span-2">
            <h3 class="text-lg font-bold flex items-center gap-2 mb-3">
              <i class="fas fa-briefcase text-brandCyan"></i> Trayectoria Profesional
            </h3>
            <div class="grid md:grid-cols-2 gap-x-8 gap-y-2">
              ${d.trajectory.map(item => `<div class="text-sm opacity-90">• ${item}</div>`).join('')}
            </div>
          </section>
        </div>
      `;
    }
  }

  function injectGallery() {
    if (document.getElementById('futurist-gallery-section')) return;
    
    const target = document.getElementById('landing-sumate'); // Antes de Sumate
    if (!target) return;
    
    const gallerySection = document.createElement('section');
    gallerySection.id = 'futurist-gallery-section';
    gallerySection.className = 'futurist-gallery';
    gallerySection.innerHTML = `
      <div class="qs-container">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-5xl font-black text-brandBlue mb-4 uppercase tracking-tighter">Impacto <span class="text-brandCyan">En Acción</span></h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Visualizando el compromiso y la actividad de nuestra juventud en toda la provincia.</p>
        </div>
        <div class="gallery-grid">
          ${CONFIG.galleryImages.map((img, i) => `
            <div class="gallery-item">
              <img src="${img.url}" alt="${img.title}" loading="lazy">
              <div class="gallery-overlay">
                <span class="gallery-title">${img.title}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    target.parentElement.insertBefore(gallerySection, target);
  }

  // Iniciar al cargar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
