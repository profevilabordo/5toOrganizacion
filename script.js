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

// Observar todas las secciones y tarjetas
document.addEventListener('DOMContentLoaded', () => {
    // Elementos para animar
    const animatedElements = document.querySelectorAll('.unit-card, .resource-card, .welcome-section, .study-guide');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Efecto parallax suave en el hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground && scrolled < window.innerHeight) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Animación de números de progreso
    const progressBars = document.querySelectorAll('.progress-fill');
    const animateProgress = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    };

    const progressObserver = new IntersectionObserver(animateProgress, {
        threshold: 0.5
    });

    progressBars.forEach(bar => progressObserver.observe(bar));

    // Smooth scroll para indicador
    document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
        document.querySelector('.welcome-section')?.scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Efecto hover en tarjetas de unidad con sonido visual
    const unitCards = document.querySelectorAll('.unit-card');
    unitCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });

    // Guardado de progreso local (simulación)
    const updateProgress = () => {
        // Aquí se puede integrar con localStorage para guardar el progreso real
        const progress = localStorage.getItem('unit1-progress') || '35';
        const progressFill = document.querySelector('.unit-card[data-unit="1"] .progress-fill');
        const progressText = document.querySelector('.unit-card[data-unit="1"] .progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}% completado`;
        }
    };

    updateProgress();

    // Efecto de escritura en el título (opcional, descomentá si querés)
    /*
    const typeWriter = (element, text, speed = 50) => {
        let i = 0;
        element.textContent = '';
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        type();
    };
    */

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
                alert('🎉 ¡Código secreto activado! ¡Seguí así con tus estudios! 🚀');
            }, 2000);
        }
    });

    // Agregá la animación rainbow al CSS si querés usar el easter egg
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

// Función para actualizar el progreso de una unidad
function updateUnitProgress(unitNumber, progress) {
    localStorage.setItem(`unit${unitNumber}-progress`, progress);
    const progressFill = document.querySelector(`.unit-card[data-unit="${unitNumber}"] .progress-fill`);
    const progressText = document.querySelector(`.unit-card[data-unit="${unitNumber}"] .progress-text`);
    
    if (progressFill && progressText) {
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}% completado`;
    }
}

// Detección de preferencia de movimiento reducido
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Desactivá animaciones si el usuario prefiere movimiento reducido
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}
