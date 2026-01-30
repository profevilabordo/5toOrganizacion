// Sistema de progreso local
const UNIT_KEY = 'unit1-progress';

// Cargar progreso guardado
function loadProgress() {
    const savedProgress = localStorage.getItem(UNIT_KEY);
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        updateProgressDisplay(progress);
        updateBlockStates(progress);
    } else {
        // Progreso inicial
        const initialProgress = {
            completedBlocks: [1, 2],
            currentBlock: 3,
            overallProgress: 20
        };
        saveProgress(initialProgress);
        updateProgressDisplay(initialProgress);
        updateBlockStates(initialProgress);
    }
}

// Guardar progreso
function saveProgress(progress) {
    localStorage.setItem(UNIT_KEY, JSON.stringify(progress));
    
    // También actualizar el progreso general en el index principal
    const overallProgress = Math.round((progress.completedBlocks.length / 10) * 100);
    localStorage.setItem('unit1-progress', overallProgress);
}

// Actualizar visualización del progreso
function updateProgressDisplay(progress) {
    const progressFill = document.querySelector('.mini-progress-fill');
    const progressPercent = document.querySelector('.progress-percent');
    
    if (progressFill && progressPercent) {
        progressFill.style.width = `${progress.overallProgress}%`;
        progressPercent.textContent = `${progress.overallProgress}%`;
    }
}

// Actualizar estados de los bloques
function updateBlockStates(progress) {
    const blocks = document.querySelectorAll('.block-card');
    
    blocks.forEach(block => {
        const blockNumber = parseInt(block.dataset.block);
        
        // Remover todas las clases de estado
        block.classList.remove('completed', 'in-progress', 'locked');
        
        if (progress.completedBlocks.includes(blockNumber)) {
            block.classList.add('completed');
            
            // Actualizar botón
            const button = block.querySelector('.block-button');
            if (button && !button.classList.contains('locked-button')) {
                button.querySelector('span:first-child').textContent = 'Revisar contenido';
            }
        } else if (blockNumber === progress.currentBlock) {
            block.classList.add('in-progress');
            
            // Desbloquear el bloque actual
            const button = block.querySelector('.block-button, .locked-button');
            if (button) {
                button.classList.remove('locked-button');
                button.classList.add('block-button');
                button.innerHTML = '<span>Continuar estudiando</span><span>→</span>';
                button.style.cursor = 'pointer';
                
                // Hacer el enlace funcional
                const blockLink = block.querySelector('a');
                if (blockLink) {
                    blockLink.href = `bloque0${blockNumber}.html`;
                }
            }
        } else if (blockNumber > progress.currentBlock) {
            block.classList.add('locked');
        }
    });
}

// Marcar bloque como completado
function completeBlock(blockNumber) {
    const savedProgress = localStorage.getItem(UNIT_KEY);
    const progress = savedProgress ? JSON.parse(savedProgress) : {
        completedBlocks: [],
        currentBlock: 1,
        overallProgress: 0
    };
    
    // Agregar a completados si no está ya
    if (!progress.completedBlocks.includes(blockNumber)) {
        progress.completedBlocks.push(blockNumber);
        progress.completedBlocks.sort((a, b) => a - b);
    }
    
    // Actualizar bloque actual
    if (blockNumber === progress.currentBlock && blockNumber < 12) {
        progress.currentBlock = blockNumber + 1;
    }
    
    // Calcular progreso general
    progress.overallProgress = Math.round((progress.completedBlocks.length / 10) * 100);
    
    saveProgress(progress);
    updateProgressDisplay(progress);
    updateBlockStates(progress);
}

// Animaciones al scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Persistencia de checklist de conceptos
function loadConceptsChecklist() {
    const checkboxes = document.querySelectorAll('.concept-item input[type="checkbox"]');
    const saved = localStorage.getItem('unit1-concepts-checked');
    
    if (saved) {
        const checkedConcepts = JSON.parse(saved);
        checkboxes.forEach((checkbox, index) => {
            if (checkedConcepts.includes(index)) {
                checkbox.checked = true;
            }
        });
    }
}

function saveConceptsChecklist() {
    const checkboxes = document.querySelectorAll('.concept-item input[type="checkbox"]');
    const checkedConcepts = [];
    
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            checkedConcepts.push(index);
        }
    });
    
    localStorage.setItem('unit1-concepts-checked', JSON.stringify(checkedConcepts));
    
    // Mostrar feedback
    const allChecked = checkedConcepts.length === checkboxes.length;
    if (allChecked) {
        showConceptCompletionMessage();
    }
}

function showConceptCompletionMessage() {
    const existingMessage = document.querySelector('.completion-message');
    if (existingMessage) return;
    
    const message = document.createElement('div');
    message.className = 'completion-message';
    message.innerHTML = '🎉 ¡Excelente! Dominás todos los conceptos clave';
    message.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        font-weight: 600;
        animation: slideInUp 0.5s ease-out;
        z-index: 1000;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideOutDown 0.5s ease-out';
        setTimeout(() => message.remove(), 500);
    }, 3000);
}

// Agregar animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(100px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(100px);
        }
    }
`;
document.head.appendChild(style);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar progreso
    loadProgress();
    
    // Cargar checklist de conceptos
    loadConceptsChecklist();
    
    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.block-card, .objective-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
    
    // Event listeners para checkboxes de conceptos
    const conceptCheckboxes = document.querySelectorAll('.concept-item input[type="checkbox"]');
    conceptCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveConceptsChecklist);
    });
    
    // Efecto parallax suave en el hero
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroBackground = document.querySelector('.unit-hero-bg');
                if (heroBackground && scrolled < 500) {
                    heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Smooth scroll para la navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Destacar bloque en progreso
    const inProgressBlock = document.querySelector('.block-card.in-progress');
    if (inProgressBlock) {
        setTimeout(() => {
            inProgressBlock.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 500);
    }
});

// Función exportable para cuando un bloque se completa (llamar desde las páginas de contenido)
window.markBlockAsComplete = completeBlock;

// Función para resetear el progreso (útil para testing)
window.resetUnitProgress = function() {
    localStorage.removeItem(UNIT_KEY);
    localStorage.removeItem('unit1-concepts-checked');
    location.reload();
};

// Detectar preferencia de movimiento reducido
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}
