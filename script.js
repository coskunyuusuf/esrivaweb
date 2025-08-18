// Matrix Rain Effect - Reusable Component
function createMatrixEffect(container, options = {}) {
    if (!container) {
        console.warn('Matrix effect: Container not found');
        return;
    }
    
    const {
        fontSize = 16,
        color = '#0F0',
        opacity = 0.7,
        speed = 50,
        letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%'.split(''),
        clipToCircle = false,
        onSpeedChange = null,
        variant = 'default',
        isFloating = false
    } = options;
    
    // Footer-specific configuration
    const footerConfig = {
        fontSize: Math.max(10, fontSize * 0.8),
        opacity: Math.max(0.1, opacity * 0.6),
        particleDensity: 0.35, // 35% of normal density
        spawnRate: 0.5, // 50% spawn rate
        maxActiveParticles: 250,
        connectionDistance: 0.7, // 70% of normal
        trailLength: 0.8, // 80% of normal
        lineWidth: 0.9, // 90% of normal
        useRequestAnimationFrame: true
    };
    
    // Apply footer config if variant is footer
    const config = variant === 'footer' ? { ...options, ...footerConfig } : options;
    
    // Clear previous content
    container.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    // Performance optimization: check if tab is visible
    let isTabVisible = !document.hidden;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        // Ensure canvas doesn't exceed container bounds
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    }
    
    resizeCanvas();
    const ctx = canvas.getContext('2d');
    
    // Performance optimization: early return if tab is hidden
    if (!isTabVisible) {
        return {
            cleanup: () => {},
            changeSpeed: () => {}
        };
    }
    
    // Apply clipping if needed
    if (clipToCircle) {
        const radius = Math.min(canvas.width, canvas.height) / 2;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.clip();
    }
    
    // Calculate particle density based on variant
    const baseColumns = canvas.width / config.fontSize;
    const actualColumns = Math.floor(baseColumns * (config.particleDensity || 1));
    const drops = Array(actualColumns).fill(1);
    
    // Footer-specific optimizations
    const spawnThreshold = config.spawnRate || 1;
    const maxParticles = config.maxActiveParticles || Infinity;

    function draw() {
        // Performance optimization: skip if tab is hidden
        if (!isTabVisible) return;
        
        // Apply clipping if needed
        if (clipToCircle) {
            const radius = Math.min(canvas.width, canvas.height) / 2;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.clip();
        }
        
        // Use a more efficient fade effect
        const fadeAlpha = config.variant === 'footer' ? 0.12 : 0.08;
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = config.color || color;
        ctx.font = `${config.fontSize}px monospace`;

        // Optimize the loop for better performance
        let activeParticles = 0;
        for (let i = 0; i < drops.length; i++) {
            // Footer optimization: limit active particles
            if (config.variant === 'footer' && activeParticles >= maxParticles) {
                break;
            }
            
            const text = letters[Math.floor(Math.random() * letters.length)];
            const x = i * (canvas.width / drops.length);
            const y = drops[i] * config.fontSize;
            
            // Strict boundary checking - only draw if within canvas bounds
            if (y >= 0 && y < canvas.height && x >= 0 && x < canvas.width && Math.random() < spawnThreshold) {
                ctx.fillText(text, x, y);
                activeParticles++;
            }

            if (drops[i] * config.fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        // Restore context if clipping was applied
        if (clipToCircle) {
            ctx.restore();
        }
    }

    let currentSpeed = config.speed || speed;
    let lastTime = 0;
    
    // Use requestAnimationFrame for footer variant, setInterval for others
    const useRAF = config.useRequestAnimationFrame || config.variant === 'footer';
    
    let interval = null;
    let animationId = null;
    
    // Function to change speed dynamically
    const changeSpeed = (newSpeed) => {
        if (newSpeed !== currentSpeed) {
            currentSpeed = newSpeed;
            if (useRAF) {
                // RAF doesn't need speed changes, but we can adjust timing
                lastTime = 0;
            } else {
                clearInterval(interval);
                interval = setInterval(draw, currentSpeed);
            }
        }
    };
    
    // Animation loop for requestAnimationFrame
    const animate = (timestamp) => {
        if (!isTabVisible) return;
        
        if (timestamp - lastTime >= currentSpeed) {
            draw();
            lastTime = timestamp;
        }
        
        animationId = requestAnimationFrame(animate);
    };

    // Start animation based on variant
    if (useRAF) {
        animationId = requestAnimationFrame(animate);
    } else {
        interval = setInterval(draw, currentSpeed);
    }
    
    // Canvas resize handling
    const resizeHandler = () => {
        resizeCanvas();
        if (clipToCircle) {
            const radius = Math.min(canvas.width, canvas.height) / 2;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.clip();
        }
    };
    
    // Use passive event listener for better performance
    window.addEventListener('resize', resizeHandler, { passive: true });
    
    // Visibility change handler
    const visibilityHandler = () => {
        isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', visibilityHandler, { passive: true });
    
    // Return cleanup function and speed change function
    return {
        cleanup: () => {
            if (interval) clearInterval(interval);
            if (animationId) cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resizeHandler);
            document.removeEventListener('visibilitychange', visibilityHandler);
        },
        changeSpeed: changeSpeed
    };
}

// Matrix Rain Effect (Legacy function for backward compatibility)
function createMatrixRain() {
    const matrixBg = document.getElementById('matrixBg');
    if (!matrixBg) return;
    
    const chars = '01アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789';
    
    // Clear previous content
    matrixBg.innerHTML = '';
    
    const containerWidth = window.innerWidth;
    const columnWidth = 20;
    const numColumns = Math.floor(containerWidth / columnWidth);
    
    for (let i = 0; i < numColumns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = i * columnWidth + 'px';
        column.style.animationDuration = (Math.random() * 3 + 2) + 's';
        column.style.animationDelay = Math.random() * 2 + 's';
        
        let columnText = '';
        const columnHeight = Math.floor(Math.random() * 30) + 10;
        
        for (let j = 0; j < columnHeight; j++) {
            columnText += chars.charAt(Math.floor(Math.random() * chars.length)) + '<br>';
        }
        
        column.innerHTML = columnText;
        matrixBg.appendChild(column);
    }
}

// Legacy function for backward compatibility
function startMatrixAnimation(container) {
    if (!container) return;
    createMatrixEffect(container);
}

// Initialize all matrix effects
function initializeMatrixEffects() {
    console.log('Initializing matrix effects...');
    
    // Store matrix effect instances for later use
    window.matrixEffects = {
        hero: null,
        footer: null,
        rocket: null
    };
    
    // Hero animasyonu
    const heroMatrix = document.getElementById('matrixBg');
    if (heroMatrix) {
        console.log('Creating hero matrix effect');
        window.matrixEffects.hero = createMatrixEffect(heroMatrix, {
            fontSize: 16,
            color: '#0F0',
            speed: 50
        });
    } else {
        console.warn('Hero matrix container not found');
    }

    // Footer animasyonu - optimized for performance
    const footerMatrix = document.getElementById('matrixBgFooter');
    if (footerMatrix) {
        console.log('Creating footer matrix effect');
        window.matrixEffects.footer = createMatrixEffect(footerMatrix, {
            variant: 'footer',
            fontSize: 14,
            color: '#00ff88',
            speed: 60, // Same speed as hero for smooth motion
            opacity: 0.4,
            letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'.split('')
        });
    } else {
        console.warn('Footer matrix container not found');
    }



    // Project cards matrix effects (always visible)
    const projectMatrices = [
        document.getElementById('matrixBgProject1'),
        document.getElementById('matrixBgProject2'),
        document.getElementById('matrixBgProject3')
    ];
    
    projectMatrices.forEach((matrix, index) => {
        if (matrix) {
            console.log(`Creating project ${index + 1} matrix effect`);
            window.matrixEffects[`project${index + 1}`] = createMatrixEffect(matrix, {
                variant: 'footer', // Use footer-optimized settings
                fontSize: 10,
                color: '#ffffff',
                speed: 60, // Consistent speed
                opacity: 0.3,
                letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'.split('')
            });
        } else {
            console.warn(`Project ${index + 1} matrix container not found`);
        }
    });

    // Rocket element animasyonu (tech-circle)
    const techCircle = document.querySelector('.tech-circle');
    if (techCircle) {
        console.log('Creating rocket matrix effect');
        // Create matrix container inside tech-circle
        const matrixContainer = document.createElement('div');
        matrixContainer.style.position = 'absolute';
        matrixContainer.style.top = '0';
        matrixContainer.style.left = '0';
        matrixContainer.style.width = '100%';
        matrixContainer.style.height = '100%';
        matrixContainer.style.borderRadius = '50%';
        matrixContainer.style.overflow = 'hidden';
        matrixContainer.style.zIndex = '1';
        
        techCircle.style.position = 'relative';
        techCircle.appendChild(matrixContainer);
        
        // Move the rocket icon to front
        const rocketIcon = techCircle.querySelector('i');
        if (rocketIcon) {
            rocketIcon.style.position = 'relative';
            rocketIcon.style.zIndex = '2';
        }
        
        // Create rocket matrix effect
        window.matrixEffects.rocket = createMatrixEffect(matrixContainer, {
            fontSize: 10,
            color: '#fff',
            speed: 40,
            opacity: 0.3,
            clipToCircle: true
        });
        
        // Add hover effect to tech-circle
        techCircle.addEventListener('mouseenter', () => {
            if (window.matrixEffects.rocket && window.matrixEffects.rocket.changeSpeed) {
                window.matrixEffects.rocket.changeSpeed(15); // Much faster on hover
            }
        });
        
        techCircle.addEventListener('mouseleave', () => {
            if (window.matrixEffects.rocket && window.matrixEffects.rocket.changeSpeed) {
                window.matrixEffects.rocket.changeSpeed(40); // Back to normal speed
            }
        });
    } else {
        console.warn('Tech circle not found');
    }
    
    console.log('Matrix effects initialization complete');
}



// Cleanup function for matrix effects
function cleanupMatrixEffects() {
    if (window.matrixEffects) {
        Object.values(window.matrixEffects).forEach(effect => {
            if (effect && effect.cleanup) {
                effect.cleanup();
            }
        });
        window.matrixEffects = null;
    }
    

}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

// Smooth Scrolling for Navigation Links
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        const offsetTop = target.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Navbar Background Change on Scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(18, 18, 18, 0.98)';
        } else {
            navbar.style.background = 'rgba(18, 18, 18, 0.95)';
        }
    }
}

// Animate Elements on Scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature, .project-card, .testimonial, .stat');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Form Submission Handler
function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Simulate form submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Gönderiliyor...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Counter Animation for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Parallax Effect for Hero Section
function handleParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// Team Carousel
function initTeamCarousel() {
    const slider = document.querySelector('.team-slider');
    const slides = document.querySelectorAll('.team-slide');
    const dotsContainer = document.querySelector('.team-dots');
    const prevBtn = document.querySelector('.team-arrow.prev-arrow');
    const nextBtn = document.querySelector('.team-arrow.next-arrow');
    
    if (!slider || !slides.length) return;
    
    // Clear existing dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
    }
    
    // Set initial state
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Calculate visible slides based on screen width
    function getVisibleSlides() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        if (window.innerWidth <= 1200) return 3;
        return 4;
    }
    
    let visibleSlides = getVisibleSlides();
    
    // Initialize slider
    function initSlider() {
        // Update visible slides count
        visibleSlides = getVisibleSlides();
        
        // Update slide widths
        const slideWidth = 100 / visibleSlides;
        slides.forEach(slide => {
            // On mobile (1 per view), use full width to avoid off-center alignment
            if (visibleSlides === 1) {
                slide.style.width = '100%';
            } else {
                slide.style.width = `calc(${slideWidth}% - 20px)`;
            }
            slide.style.flexShrink = '0';
        });
        
        // Update dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            const dotCount = Math.ceil(totalSlides / visibleSlides);
            
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('team-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i * visibleSlides));
                dotsContainer.appendChild(dot);
            }
        }
        
        // Reset position
        currentSlide = 0;
        updateSlider();
    }
    
    // Update slider position
    function updateSlider() {
        const slideWidth = 100 / visibleSlides;
        const maxSlide = Math.max(0, totalSlides - visibleSlides);
        currentSlide = Math.min(Math.max(currentSlide, 0), maxSlide);
        
        // For 1-per-view, translate exactly 100% per slide; otherwise keep percentage by count
        const step = (visibleSlides === 1) ? 100 : (100 / visibleSlides);
        const translateX = -(currentSlide * step);
        slider.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.team-dot');
            const activeDotIndex = Math.floor(currentSlide / visibleSlides);
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeDotIndex);
            });
        }
    }
    
    // Navigation functions
    function nextSlide() {
        const maxSlide = Math.max(0, totalSlides - visibleSlides);
        if (currentSlide < maxSlide) {
            currentSlide++;
            updateSlider();
        } else {
            // Loop to start
            currentSlide = 0;
            updateSlider();
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        } else {
            // Loop to end
            currentSlide = Math.max(0, totalSlides - visibleSlides);
            updateSlider();
        }
    }
    
    // Initialize the slider
    initSlider();
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initSlider();
        }, 100);
    });
}

function initTestimonialsCarousel() {
    const testimonialsSection = document.querySelector('#testimonials');
    const container = testimonialsSection ? testimonialsSection.querySelector('.testimonials-container') : null;
    const slider = testimonialsSection ? testimonialsSection.querySelector('.testimonials-slider') : null;
    const slides = testimonialsSection ? testimonialsSection.querySelectorAll('.testimonial-slide') : [];
    const dotsContainer = testimonialsSection ? testimonialsSection.querySelector('.slider-dots') : null;
    const prevBtn = container ? container.querySelector('.slider-arrow.prev-arrow') : null;
    const nextBtn = container ? container.querySelector('.slider-arrow.next-arrow') : null;
    
    if (!slider || !slides.length) return;
    
    // Slides per view (responsive)
    function getSlidesToShow() {
        return window.innerWidth > 992 ? 2 : 1;
    }
    let slidesToShow = getSlidesToShow();
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Set initial position
    slider.style.transform = 'translateX(0)';
    
    // Apply slide widths
    function applySlideWidths() {
        const slideWidth = 100 / slidesToShow;
        document.querySelectorAll('.testimonial-slide').forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}%`;
            slide.style.minWidth = `${slideWidth}%`;
        });
    }
    applySlideWidths();
    
    // Create dots (one dot per two slides)
    if (dotsContainer) {
        const dotCount = Math.ceil(slides.length / 2);
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i * 2));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update slide position
    function updateSlider() {
        const slideWidth = 100 / slidesToShow;
        const translateX = -(currentSlide * (100 / slidesToShow));
        slider.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === Math.floor(currentSlide / 2));
            });
        }
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = (slideIndex + totalSlides) % totalSlides;
        updateSlider();
    }
    
    // Next slide
    function nextSlide() {
        currentSlide++;
        const maxIndex = Math.max(0, totalSlides - slidesToShow);
        if (currentSlide > maxIndex) currentSlide = 0; // loop
        updateSlider();
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide--;
        const maxIndex = Math.max(0, totalSlides - slidesToShow);
        if (currentSlide < 0) currentSlide = maxIndex; // loop
        updateSlider();
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    const sliderContainer = document.querySelector('.testimonials-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Handle window resize
    function handleResize() {
        const newSlidesToShow = getSlidesToShow();
        if (newSlidesToShow !== slidesToShow) {
            slidesToShow = newSlidesToShow;
            applySlideWidths();
            currentSlide = 0;
            updateSlider();
        }
    }
    window.addEventListener('resize', handleResize);
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Effects
    createMatrixRain();
    setInterval(createMatrixRain, 10000);
    
    // Initialize matrix effects
    initializeMatrixEffects();

    // Carousels
    initTestimonialsCarousel();
    initTeamCarousel();

    // WhatsApp FAB
    initWhatsAppFab();

    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScrollTo(targetId);

            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }

    // Initialize animations
    const animatedElements = document.querySelectorAll('.feature, .project-card, .testimonial, .stat');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Initial animations
    setTimeout(() => {
        animateOnScroll();
    }, 500);
});

// Event listeners for scroll and resize
window.addEventListener('scroll', () => {
    handleNavbarScroll();
    animateOnScroll();
    handleParallax();
});

window.addEventListener('resize', () => {
    createMatrixRain();
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanupMatrixEffects);

// Intersection Observer for better performance
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

// Observe elements when they're added to DOM
document.addEventListener('DOMContentLoaded', () => {
    const elementsToObserve = document.querySelectorAll('.feature, .project-card, .testimonial, .stat');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate counters when they come into view
    const statsSection = document.querySelector('.partnership-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
});

// Add some CSS for loading state
const style = document.createElement('style');
style.textContent = `
    body:not(.loaded) {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .feature, .project-card, .testimonial, .stat {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature.animate, .project-card.animate, .testimonial.animate, .stat.animate {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// WhatsApp Floating Button initializer
function initWhatsAppFab() {
    const fab = document.getElementById('whatsapp-fab');
    if (!fab) return;
    const phone = (fab.getAttribute('data-phone') || '').replace(/[^\d]/g, '');
    const message = fab.getAttribute('data-message') || '';
    if (!phone) return;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    fab.setAttribute('href', url);
}

document.addEventListener('DOMContentLoaded', initWhatsAppFab);
