/* ==========================================================================
   WANKHADE NETRALAYA - MAIN INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // -------------------------------------------------------------
    // 1. PRELOADER & INITIAL TRANSITION
    // -------------------------------------------------------------
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('preloader-progress');
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Fade out preloader
            setTimeout(() => {
                preloader.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                preloader.style.opacity = '0';
                
                // Show sticky CTAs after loading
                initStickyCTAs();
                
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Trigger Hero Animations
                    initHeroAnimations();
                }, 600);
            }, 300);
        }
        progressBar.style.width = `${progress}%`;
    }, 80);

    // -------------------------------------------------------------
    // 2. HEADER SCROLL & PROGRESS INDICATOR
    // -------------------------------------------------------------
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        
        // Progress bar width
        scrollProgress.style.width = `${scrolled}%`;
        
        // Header styling on scroll
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // -------------------------------------------------------------
    // 3. MOBILE MENU HAMBURGER
    // -------------------------------------------------------------
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    };
    
    menuBtn.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // -------------------------------------------------------------
    // 4. ACTIVE SECTION TRACKING (SCROLLSPY)
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    
    const scrollActive = () => {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset for fixed header
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    };
    
    window.addEventListener('scroll', scrollActive);

    // -------------------------------------------------------------
    // 5. TESTIMONIAL SLIDER / CAROUSEL (SWIPEABLE)
    // -------------------------------------------------------------
    const track = document.getElementById('testimonial-track');
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');
    
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Create dots dynamically
    slides.forEach((slide, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.children);
    
    const updateDots = () => {
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };
    
    const goToSlide = (index) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
        resetAutoSlide();
    };
    
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    
    // Auto Slide
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    };
    
    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };
    
    startAutoSlide();
    
    // Swipe Touch Support
    let startX = 0;
    let endX = 0;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', () => {
        const threshold = 50; // minimum swipe distance
        if (startX - endX > threshold) {
            // Swipe Left -> Next
            goToSlide(currentIndex + 1);
        } else if (endX - startX > threshold) {
            // Swipe Right -> Prev
            goToSlide(currentIndex - 1);
        }
        startX = 0;
        endX = 0;
    });

    // -------------------------------------------------------------
    // 6. GALLERY LIGHTBOX
    // -------------------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const fullImgUrl = item.getAttribute('data-img');
            const captionText = item.getAttribute('data-caption');
            
            lightboxImg.src = fullImgUrl;
            lightboxCaption.textContent = captionText;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // prevent scrolling behind lightbox
        });
    });
    
    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    };
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard support for Lightbox (Esc key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });

    // -------------------------------------------------------------
    // 7. FAQ ACCORDION
    // -------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const panel = item.querySelector('.faq-panel');
        
        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close other accordions
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-panel').style.maxHeight = null;
                    otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current
            item.classList.toggle('active');
            trigger.setAttribute('aria-expanded', !isActive);
            
            if (item.classList.contains('active')) {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            } else {
                panel.style.maxHeight = null;
            }
        });
    });

    // -------------------------------------------------------------
    // 8. APPOINTMENT FORM HANDLING & WHATSAPP REDIRECT
    // -------------------------------------------------------------
    const appointmentForm = document.getElementById('appointment-form');
    
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const service = document.getElementById('form-service').value;
        const date = document.getElementById('form-date').value;
        const message = document.getElementById('form-message').value.trim();
        
        // Simple validation
        if (!name || !phone || !service || !date) {
            alert('Please fill out all required fields.');
            return;
        }
        
        // Format the date nicely
        const formattedDate = new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Build WhatsApp text message
        const baseText = `*New Appointment Request - Wankhade Netralaya*\n\n` +
                         `*Name:* ${name}\n` +
                         `*Phone:* ${phone}\n` +
                         `*Service Required:* ${service}\n` +
                         `*Preferred Date:* ${formattedDate}`;
                         
        const finalMessage = message ? `${baseText}\n*Details:* ${message}` : baseText;
        const encodedText = encodeURIComponent(finalMessage);
        
        // WhatsApp link (using the provided clinic number)
        const waLink = `https://wa.me/918379862010?text=${encodedText}`;
        
        // Show success animation or trigger redirect
        const submitBtn = document.getElementById('btn-submit-appointment');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.style.background = '#25d366';
        submitBtn.innerHTML = 'Redirecting to WhatsApp... <span class="btn-icon">✓</span>';
        
        setTimeout(() => {
            window.open(waLink, '_blank');
            appointmentForm.reset();
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            submitBtn.innerHTML = originalText;
        }, 1200);
    });

    // -------------------------------------------------------------
    // 9. STICKY MOBILE CTA BAR VISIBILITY
    // -------------------------------------------------------------
    const mobileCtas = document.getElementById('mobile-ctas');
    
    function initStickyCTAs() {
        window.addEventListener('scroll', () => {
            // Show sticky CTAs when scrolling past the hero section (e.g. scroll > 500px)
            if (window.scrollY > 500) {
                mobileCtas.classList.add('visible');
            } else {
                mobileCtas.classList.remove('visible');
            }
        });
    }

    // -------------------------------------------------------------
    // 10. GSAP ANIMATIONS (PAGE & SCROLL-TRIGGERED)
    // -------------------------------------------------------------
    function initHeroAnimations() {
        // Safe check for GSAP availability
        if (typeof gsap === 'undefined') return;
        
        // Hero entrance animations
        const tl = gsap.timeline();
        
        tl.fromTo('#hero-badge', 
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        )
        .fromTo('#hero-title', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.4'
        )
        .fromTo('#hero-subtitle', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.5'
        )
        .fromTo('.hero-ctas .btn', 
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)' },
            '-=0.4'
        )
        .fromTo('#hero-stats', 
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.2'
        )
        .fromTo('#hero-image-block', 
            { opacity: 0, scale: 0.96, x: 20 },
            { opacity: 1, scale: 1, x: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.8'
        );
        
        // Run counters for hero stats
        const statNums = document.querySelectorAll('.hero-stat-num');
        statNums.forEach(num => {
            const targetVal = parseInt(num.getAttribute('data-val'), 10);
            const formatSuffix = targetVal >= 1000 ? '+' : '+';
            
            let obj = { val: 0 };
            gsap.to(obj, {
                val: targetVal,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                    if (targetVal >= 1000) {
                        // Display clean K format for large values
                        if (obj.val >= 1000) {
                            num.textContent = Math.floor(obj.val / 100) / 10 + 'K' + formatSuffix;
                        } else {
                            num.textContent = Math.floor(obj.val) + formatSuffix;
                        }
                    } else {
                        num.textContent = Math.floor(obj.val) + formatSuffix;
                    }
                }
            });
        });
        
        // Register ScrollTrigger and setup triggers
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            initScrollAnimations();
        }
    }

    function initScrollAnimations() {
        // Parallax effect on Hero floating widgets
        gsap.to('.widget-specialist', {
            y: -50,
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

        gsap.to('.widget-tech', {
            y: 40,
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

        // About Image Slide Reveal
        gsap.from('#about-img-container', {
            opacity: 0,
            x: -50,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // About Content Fade-up
        gsap.from('#about-content-block', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#about',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });

        // Services header & Staggered card animation
        gsap.from('#services-header', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: '#services',
                start: 'top 80%'
            }
        });

        gsap.from('.service-card', {
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.15,
            scrollTrigger: {
                trigger: '#services-grid-block',
                start: 'top 75%'
            }
        });

        // Doctors Header & Cards Reveal
        gsap.from('#doctors-header', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: '#doctors',
                start: 'top 80%'
            }
        });

        gsap.from('.doctor-card', {
            opacity: 0,
            y: 50,
            scale: 0.98,
            duration: 0.7,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '#doctors-grid-block',
                start: 'top 75%'
            }
        });

        // Why Choose Us Header & Cards Reveal
        gsap.from('#why-header', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: '#why-choose-us',
                start: 'top 80%'
            }
        });

        gsap.from('.why-card', {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '#why-grid-block',
                start: 'top 75%'
            }
        });

        // Testimonial Fade In
        gsap.from('#testimonials-header', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: '#testimonials',
                start: 'top 80%'
            }
        });

        gsap.from('#testimonial-slider', {
            opacity: 0,
            scale: 0.98,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#testimonial-slider',
                start: 'top 80%'
            }
        });

        // Gallery Grid items fade in
        gsap.from('#gallery-header', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: '#gallery',
                start: 'top 80%'
            }
        });

        gsap.from('.gallery-item', {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '#gallery-grid-block',
                start: 'top 75%'
            }
        });

        // FAQ section fade in
        gsap.from('#faq-header', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: '#faq',
                start: 'top 80%'
            }
        });

        gsap.from('.faq-item', {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '#faq-grid-block',
                start: 'top 75%'
            }
        });

        // Appointment form reveal
        gsap.from('#appointment-info-block', {
            opacity: 0,
            x: -30,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#appointment',
                start: 'top 75%'
            }
        });

        gsap.from('#appointment-form-block', {
            opacity: 0,
            x: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#appointment',
                start: 'top 75%'
            }
        });

        // Contact info & map reveal
        gsap.from('#contact-header', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 80%'
            }
        });

        gsap.from('.contact-info-panel', {
            opacity: 0,
            x: -30,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#contact-grid-block',
                start: 'top 75%'
            }
        });

        gsap.from('#contact-map-block', {
            opacity: 0,
            x: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#contact-grid-block',
                start: 'top 75%'
            }
        });
    }

});
