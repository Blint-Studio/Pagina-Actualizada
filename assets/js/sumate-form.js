/**
 * sumate-form.js
 * Manejo del formulario "Sumate al movimiento" y su modal de éxito.
 * Extraído de pages/sumate/index.html para mantener JS separado del HTML.
 */
(function () {
  'use strict';

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjkpeebn';

  // ── Referencias al DOM ──────────────────────────────────────────────────────
  const joinForm    = document.getElementById('joinForm');
  const joinSubmit  = document.getElementById('joinSubmit');
  const successModal = document.getElementById('successModal');
  const successClose = document.getElementById('successClose');

  // Si los elementos no existen (cargado fuera de la sección sumate), salir.
  if (!joinForm || !joinSubmit || !successModal || !successClose) return;

  // ── Helpers del modal de éxito ──────────────────────────────────────────────
  function showSuccess() {
    successModal.classList.remove('hidden');
    document.documentElement.classList.add('modal-open');
    setTimeout(() => successModal.querySelector('button')?.focus(), 0);
  }

  function hideSuccess() {
    successModal.classList.add('hidden');
    document.documentElement.classList.remove('modal-open');
  }

  successClose.addEventListener('click', hideSuccess);
  successModal.addEventListener('click', e => { if (e.target === successModal) hideSuccess(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !successModal.classList.contains('hidden')) hideSuccess();
  });

  // ── Observador de scroll para animar tarjetas ────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('animate'); });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
  });

  // ── Envío del formulario ─────────────────────────────────────────────────────
  joinSubmit.addEventListener('click', async () => {
    // Validación básica del lado cliente
    for (const el of joinForm.querySelectorAll('[required]')) {
      if (!el.value?.trim()) { el.focus(); return; }
    }

    const originalText = joinSubmit.innerHTML;
    joinSubmit.disabled = true;
    joinSubmit.innerHTML = 'Enviando…';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method:  'POST',
        body:    new FormData(joinForm),
        headers: { Accept: 'application/json' }
      });

      if (!res.ok) throw new Error('Error al enviar');

      joinSubmit.innerHTML = '✓ ¡Enviado con éxito!';
      joinSubmit.classList.replace('bg-brandCoral', 'bg-green-500');
      joinForm.reset();
      showSuccess();

      setTimeout(() => {
        joinSubmit.innerHTML = originalText;
        joinSubmit.classList.replace('bg-green-500', 'bg-brandCoral');
        joinSubmit.disabled = false;
      }, 2000);

    } catch (_) {
      joinSubmit.innerHTML = '✗ Error al enviar';
      joinSubmit.classList.replace('bg-brandCoral', 'bg-red-500');
      alert('Hubo un problema al enviar el formulario. Intentá nuevamente o escribinos por WhatsApp.');
      setTimeout(() => {
        joinSubmit.innerHTML = originalText;
        joinSubmit.classList.replace('bg-red-500', 'bg-brandCoral');
        joinSubmit.disabled = false;
      }, 2000);
    }
  });

})();
