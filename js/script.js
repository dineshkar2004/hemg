document.addEventListener('DOMContentLoaded', () => {
    // Add page entrance animation
    document.body.classList.add('loaded');

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for scroll reveal animations
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after reveal
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Initial setup for reveal elements
    // We target feature cards, sections headers, and banner-box
    const targetElements = document.querySelectorAll('.feature-card, .section-header, .banner-box, .hero-card, .hero-cards, .contact-info-card, .contact-form-container');
    
    targetElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Add staggered delay to feature cards in grids
    const grids = document.querySelectorAll('.features-grid');
    grids.forEach(grid => {
        const cards = grid.querySelectorAll('.feature-card');
        cards.forEach((card, i) => {
            if (i % 3 === 1) card.classList.add('reveal-delay-1');
            if (i % 3 === 2) card.classList.add('reveal-delay-2');
        });
    });

    // Handle initial hash in URL for smooth scroll across pages
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // Wait slightly for body to load and reveal elements to initialize
            setTimeout(() => {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            menuOverlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Hero Wave Animation
    const initHeroWaves = () => {
        const canvas = document.getElementById('hero-waves-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height;
        let mouseX = 0, mouseY = 0;
        let targetMouseX = 0, targetMouseY = 0;

        const resize = () => {
            width = canvas.parentElement.offsetWidth;
            height = canvas.parentElement.offsetHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX / window.innerWidth) - 0.5;
            targetMouseY = (e.clientY / window.innerHeight) - 0.5;
        });

        const colors = ['#ff6a00', '#ff8c00', '#ffa500'];
        const waves = Array.from({ length: 8 }, (_, i) => ({
            y: height * (0.3 + Math.random() * 0.4),
            amplitude: 40 + Math.random() * 60,
            frequency: 0.001 + Math.random() * 0.002,
            phase: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.03,
            color: colors[i % colors.length],
            thickness: 1 + Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.4,
            delay: i * 0.2,
            particles: []
        }));

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Smooth mouse movement for parallax
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            waves.forEach((wave, i) => {
                ctx.beginPath();
                ctx.lineWidth = wave.thickness;
                ctx.strokeStyle = wave.color;
                ctx.globalAlpha = wave.opacity;
                ctx.shadowBlur = 15;
                ctx.shadowColor = wave.color;

                const gradient = ctx.createLinearGradient(0, 0, width, 0);
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.2, wave.color);
                gradient.addColorStop(0.8, wave.color);
                gradient.addColorStop(1, 'transparent');
                ctx.strokeStyle = gradient;

                for (let x = 0; x < width; x += 10) {
                    // Parallax offset
                    const parallaxX = mouseX * 50 * (i * 0.1 + 0.5);
                    const parallaxY = mouseY * 50 * (i * 0.1 + 0.5);

                    // Sine wave logic
                    const y = wave.y + 
                              Math.sin(x * wave.frequency + wave.phase) * wave.amplitude +
                              Math.sin(x * 0.005 + wave.phase * 0.5) * 20 + // Secondary wave for complexity
                              parallaxY;

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                ctx.stroke();

                // Draw occasional particles along the lines
                if (Math.random() < 0.02 && wave.particles.length < 5) {
                    wave.particles.push({ x: 0, speed: 1.5 + Math.random() * 2 });
                }

                wave.particles.forEach((p, pi) => {
                    const py = wave.y + 
                              Math.sin(p.x * wave.frequency + wave.phase) * wave.amplitude +
                              Math.sin(p.x * 0.005 + wave.phase * 0.5) * 20 +
                              (mouseY * 50 * (i * 0.1 + 0.5));
                    
                    ctx.beginPath();
                    ctx.arc(p.x, py, 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = wave.color;
                    ctx.fill();
                    
                    p.x += p.speed;
                    if (p.x > width) wave.particles.splice(pi, 1);
                });

                wave.phase += wave.speed;
                wave.amplitude += Math.sin(Date.now() * 0.001 + i) * 0.2; // Slow vertical oscillation
            });

            requestAnimationFrame(animate);
        };

        animate();
    };

    initHeroWaves();
});

