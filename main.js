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

            setTimeout(() => {
                preloader.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                preloader.style.opacity = '0';

                initStickyCTAs();

                setTimeout(() => {
                    preloader.style.display = 'none';
                    initHeroAnimations();
                    // Always init scroll animations regardless of GSAP
                    initScrollAnimations();
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
        const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = `${scrolled}%`;
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
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
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
            const sectionTop = current.offsetTop - 100;
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
            dot.classList.toggle('active', idx === currentIndex);
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

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    };
    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };
    startAutoSlide();

    let startX = 0, endX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
    track.addEventListener('touchmove',  (e) => { endX   = e.touches[0].clientX; });
    track.addEventListener('touchend',   () => {
        if (startX - endX > 50) goToSlide(currentIndex + 1);
        else if (endX - startX > 50) goToSlide(currentIndex - 1);
        startX = 0; endX = 0;
    });

    // -------------------------------------------------------------
    // 6. GALLERY LIGHTBOX
    // -------------------------------------------------------------
    const galleryItems  = document.querySelectorAll('.gallery-item');
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightboxImg.src = item.getAttribute('data-img');
            lightboxCaption.textContent = item.getAttribute('data-caption');
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    };
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightbox();
    });

    // -------------------------------------------------------------
    // 7. FAQ ACCORDION
    // -------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const panel   = item.querySelector('.faq-panel');
        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                    other.querySelector('.faq-panel').style.maxHeight = null;
                    other.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                }
            });
            item.classList.toggle('active');
            trigger.setAttribute('aria-expanded', !isActive);
            panel.style.maxHeight = item.classList.contains('active') ? panel.scrollHeight + 'px' : null;
        });
    });

    // -------------------------------------------------------------
    // 8. APPOINTMENT FORM — WHATSAPP REDIRECT
    // -------------------------------------------------------------
    const appointmentForm = document.getElementById('appointment-form');
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name    = document.getElementById('form-name').value.trim();
        const phone   = document.getElementById('form-phone').value.trim();
        const service = document.getElementById('form-service').value;
        const date    = document.getElementById('form-date').value;
        const message = document.getElementById('form-message').value.trim();

        const waMessage = `Hi Wankhade Netralaya Team,%0A%0AI would like to book an appointment.%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Service:* ${encodeURIComponent(service)}%0A*Preferred Date:* ${encodeURIComponent(date)}%0A*Message:* ${encodeURIComponent(message || 'N/A')}%0A%0AThank you!`;
        const waLink = `https://wa.me/918379862010?text=${waMessage}`;

        const submitBtn = appointmentForm.querySelector('button[type="submit"]');
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
    // 9. STICKY MOBILE CTA BAR
    // -------------------------------------------------------------
    const mobileCtas = document.getElementById('mobile-ctas');
    function initStickyCTAs() {
        window.addEventListener('scroll', () => {
            mobileCtas.classList.toggle('visible', window.scrollY > 500);
        });
    }

    // -------------------------------------------------------------
    // 10. HERO ANIMATIONS (GSAP optional enhancement)
    // -------------------------------------------------------------
    function initHeroAnimations() {
        if (typeof gsap === 'undefined') return;

        // Run stat counters
        const statNums = document.querySelectorAll('.hero-stat-num');
        statNums.forEach(num => {
            const targetVal = parseInt(num.getAttribute('data-val'), 10);
            let obj = { val: 0 };
            gsap.to(obj, {
                val: targetVal,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                    if (targetVal >= 1000) {
                        num.textContent = obj.val >= 1000
                            ? Math.floor(obj.val / 100) / 10 + 'K+'
                            : Math.floor(obj.val) + '+';
                    } else {
                        num.textContent = Math.floor(obj.val) + '+';
                    }
                }
            });
        });

        // Hero entrance — only animate elements that are visible (fromTo, not from)
        const tl = gsap.timeline();
        tl.fromTo('#hero-badge',       { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
          .fromTo('#hero-title',        { opacity: 0, y: 30  }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
          .fromTo('#hero-subtitle',     { opacity: 0, y: 20  }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
          .fromTo('.hero-ctas .btn',    { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.4')
          .fromTo('#hero-stats',        { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
          .fromTo('#hero-image-block',  { opacity: 0, scale: 0.96, x: 20 }, { opacity: 1, scale: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8');
    }

    // -------------------------------------------------------------
    // 11. SCROLL REVEAL — Uses IntersectionObserver (works everywhere)
    //     GSAP is used only for floating parallax widgets (no opacity tricks)
    // -------------------------------------------------------------
    function initScrollAnimations() {

        // --- CSS-class based reveal (100% reliable, no GSAP dependency) ---
        // Elements start visible via CSS; we add a subtle animate-in class
        const revealElements = [
            { selector: '#about-img-container',   cls: 'reveal-left'  },
            { selector: '#about-content-block',   cls: 'reveal-right' },
            { selector: '#services-header',        cls: 'reveal-up'    },
            { selector: '.service-card',           cls: 'reveal-up'    },
            { selector: '#doctors-header',         cls: 'reveal-up'    },
            { selector: '.doctor-card',            cls: 'reveal-up'    },
            { selector: '#why-header',             cls: 'reveal-up'    },
            { selector: '.why-card',               cls: 'reveal-up'    },
            { selector: '#testimonials-header',    cls: 'reveal-up'    },
            { selector: '#testimonial-slider',     cls: 'reveal-up'    },
            { selector: '#gallery-header',         cls: 'reveal-up'    },
            { selector: '.gallery-item',           cls: 'reveal-up'    },
            { selector: '#faq-header',             cls: 'reveal-up'    },
            { selector: '.faq-item',               cls: 'reveal-up'    },
            { selector: '#appointment-info-block', cls: 'reveal-left'  },
            { selector: '#appointment-form-block', cls: 'reveal-right' },
            { selector: '#contact-header',         cls: 'reveal-up'    },
            { selector: '.contact-info-panel',     cls: 'reveal-left'  },
            { selector: '#contact-map-block',      cls: 'reveal-right' },
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // animate once
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        revealElements.forEach(({ selector, cls }) => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('will-reveal', cls);
                observer.observe(el);
            });
        });

        // Stagger delay for cards
        document.querySelectorAll('.service-card, .why-card, .gallery-item, .faq-item, .doctor-card').forEach((el, i) => {
            el.style.transitionDelay = (i % 4) * 80 + 'ms';
        });

        // --- GSAP only for parallax (no opacity manipulation) ---
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            try {
                gsap.registerPlugin(ScrollTrigger);
                gsap.to('.widget-specialist', {
                    y: -50,
                    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
                });
                gsap.to('.widget-tech', {
                    y: 40,
                    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
                });
            } catch (e) {
                console.warn('GSAP parallax skipped:', e);
            }
        }
    }

});