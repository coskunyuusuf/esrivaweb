// Advanced Animations Module
// This file contains sophisticated animation effects and interactions

class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupMouseEffects();
        this.setupTypingAnimations();
        this.setupParticleEffects();
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => {
            observer.observe(el);
            this.setupElementAnimation(el);
        });
    }

    setupElementAnimation(element) {
        const animationType = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-delay') || 0;
        
        element.style.opacity = '0';
        element.style.transform = this.getInitialTransform(animationType);
        element.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`;

        this.animations.set(element, {
            type: animationType,
            animated: false
        });
    }

    getInitialTransform(type) {
        const transforms = {
            'fade-up': 'translateY(50px)',
            'fade-down': 'translateY(-50px)',
            'fade-left': 'translateX(50px)',
            'fade-right': 'translateX(-50px)',
            'zoom-in': 'scale(0.8)',
            'zoom-out': 'scale(1.2)',
            'rotate-left': 'rotate(-15deg)',
            'rotate-right': 'rotate(15deg)',
            'slide-up': 'translateY(100px)',
            'slide-down': 'translateY(-100px)'
        };
        return transforms[type] || 'translateY(30px)';
    }

    animateElement(element) {
        const animation = this.animations.get(element);
        if (animation && !animation.animated) {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
            animation.animated = true;
        }
    }

    // Parallax effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-parallax') || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Mouse interaction effects
    setupMouseEffects() {
        // Tilt effect for cards
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.handleTilt(e, element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.resetTilt(element);
            });
        });

        // Magnetic effect for buttons
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.handleMagnetic(e, element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.resetMagnetic(element);
            });
        });
    }

    handleTilt(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }

    resetTilt(element) {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }

    handleMagnetic(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    }

    resetMagnetic(element) {
        element.style.transform = 'translate(0px, 0px)';
    }

    // Typing animations
    setupTypingAnimations() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            this.createTypingAnimation(element);
        });
    }

    createTypingAnimation(element) {
        const text = element.textContent;
        const speed = element.getAttribute('data-typing-speed') || 100;
        const delay = element.getAttribute('data-typing-delay') || 0;
        
        element.textContent = '';
        element.style.borderRight = '2px solid currentColor';
        
        let i = 0;
        
        setTimeout(() => {
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    element.style.borderRight = 'none';
                }
            };
            typeWriter();
        }, delay);
    }

    // Particle effects
    setupParticleEffects() {
        const particleContainers = document.querySelectorAll('[data-particles]');
        
        particleContainers.forEach(container => {
            this.createParticleEffect(container);
        });
    }

    createParticleEffect(container) {
        const particleCount = container.getAttribute('data-particles') || 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                animation: float ${3 + Math.random() * 4}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(particle);
        }
    }

    // Advanced hover effects
    setupHoverEffects() {
        const hoverElements = document.querySelectorAll('[data-hover]');
        
        hoverElements.forEach(element => {
            const hoverType = element.getAttribute('data-hover');
            
            switch (hoverType) {
                case 'glow':
                    this.setupGlowEffect(element);
                    break;
                case 'ripple':
                    this.setupRippleEffect(element);
                    break;
                case 'border':
                    this.setupBorderEffect(element);
                    break;
                case 'scale':
                    this.setupScaleEffect(element);
                    break;
            }
        });
    }

    setupGlowEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.boxShadow = '';
        });
    }

    setupRippleEffect(element) {
        element.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    setupBorderEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.borderImage = 'linear-gradient(45deg, #6366f1, #f59e0b) 1';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.borderImage = '';
        });
    }

    setupScaleEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.05)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
    }

    // Text reveal animations
    setupTextReveal() {
        const textElements = document.querySelectorAll('[data-text-reveal]');
        
        textElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s ease ${index * 0.05}s;
                `;
                element.appendChild(span);
            });
            
            // Trigger animation when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const spans = entry.target.querySelectorAll('span');
                        spans.forEach(span => {
                            span.style.opacity = '1';
                            span.style.transform = 'translateY(0)';
                        });
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    // Counter animations
    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            counter.textContent = Math.floor(current);
                        }, 16);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    // Morphing animations
    setupMorphingAnimations() {
        const morphElements = document.querySelectorAll('[data-morph]');
        
        morphElements.forEach(element => {
            const shapes = element.getAttribute('data-morph').split(',');
            let currentShape = 0;
            
            setInterval(() => {
                element.style.borderRadius = shapes[currentShape];
                currentShape = (currentShape + 1) % shapes.length;
            }, 3000);
        });
    }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0, -30px, 0);
        }
        70% {
            transform: translate3d(0, -15px, 0);
        }
        90% {
            transform: translate3d(0, -4px, 0);
        }
    }
    
    @keyframes shake {
        0%, 100% {
            transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
            transform: translateX(-10px);
        }
        20%, 40%, 60%, 80% {
            transform: translateX(10px);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate3d(0, 40px, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            transform: translate3d(-100%, 0, 0);
            visibility: visible;
        }
        to {
            transform: translate3d(0, 0, 0);
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translate3d(100%, 0, 0);
            visibility: visible;
        }
        to {
            transform: translate3d(0, 0, 0);
        }
    }
    
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale3d(.3, .3, .3);
        }
        50% {
            opacity: 1;
        }
    }
    
    @keyframes flipInX {
        from {
            transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
            animation-timing-function: ease-in;
            opacity: 0;
        }
        40% {
            transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
            animation-timing-function: ease-in;
        }
        60% {
            transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
            opacity: 1;
        }
        80% {
            transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
        }
        to {
            transform: perspective(400px);
        }
    }
    
    .animate-pulse { animation: pulse 2s infinite; }
    .animate-bounce { animation: bounce 1s infinite; }
    .animate-shake { animation: shake 0.5s ease-in-out; }
    .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
    .animate-slide-in-left { animation: slideInLeft 0.6s ease-out; }
    .animate-slide-in-right { animation: slideInRight 0.6s ease-out; }
    .animate-zoom-in { animation: zoomIn 0.6s ease-out; }
    .animate-flip-in-x { animation: flipInX 0.6s ease-out; }
`;

document.head.appendChild(style);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    
    // Make it globally available
    window.AnimationController = animationController;
    
    // Setup additional effects
    animationController.setupHoverEffects();
    animationController.setupTextReveal();
    animationController.setupCounterAnimations();
    animationController.setupMorphingAnimations();
});






