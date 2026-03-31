// Inicializar los modales cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando modales...');
    
    // Función para abrir un modal
    window.openModal = function(modalId) {
        console.log('Abriendo modal:', modalId);
        const modal = document.getElementById(`modal-${modalId}`);
        if (modal) {
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };

    // Función para cerrar un modal
    window.closeModal = function(modalId) {
        console.log('Cerrando modal:', modalId);
        const modal = document.getElementById(`modal-${modalId}`);
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    // Cerrar modales con Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal-overlay[aria-hidden="false"]');
            if (openModal) {
                const modalId = openModal.id.replace('modal-', '');
                closeModal(modalId);
            }
        }
    });

    // Cerrar modales al hacer click fuera
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                const modalId = modal.id.replace('modal-', '');
                closeModal(modalId);
            }
        });
    });

    // Agregar listeners a todos los botones que abren modales
    document.querySelectorAll('[onclick*="openModal"]').forEach(button => {
        console.log('Encontrado botón para modal:', button);
    });
});