document.addEventListener('DOMContentLoaded', () => {

    // Page entrance animation
    document.body.classList.add('loaded');


    // =========================
    // DEVICE TIER DETECTION
    // =========================

    function getDeviceTier() {

        const cores = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 2;
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

        if (!isMobile) return "HIGH";

        if (cores >= 8 && memory >= 6) return "HIGH";
        if (cores >= 6 && memory >= 4) return "MEDIUM";

        return "LOW";
    }

    const DEVICE_TIER = getDeviceTier();


    // Smooth scroll for anchor links
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


    // =========================
    // SCROLL REVEAL ANIMATION
    // =========================

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }

        });

    }, revealOptions);


    const targetElements = document.querySelectorAll(
        '.feature-card, .section-header, .banner-box, .hero-card, .hero-cards, .contact-info-card, .contact-form-container'
    );


    targetElements.forEach(el => {

        el.classList.add('reveal');
        revealObserver.observe(el);

    });


    // Stagger reveal delays
    const grids = document.querySelectorAll('.features-grid');


    grids.forEach(grid => {

        const cards = grid.querySelectorAll('.feature-card');


        cards.forEach((card, i) => {

            if (i % 3 === 1) card.classList.add('reveal-delay-1');
            if (i % 3 === 2) card.classList.add('reveal-delay-2');

        });

    });


    // =========================
    // MOBILE MENU
    // =========================

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


    // =========================
    // HERO WAVE ANIMATION
    // DEVICE-TIER OPTIMIZED
    // =========================

    const initHeroWaves = () => {

        const canvas = document.getElementById('hero-waves-canvas');

        if (!canvas) return;


        const ctx = canvas.getContext('2d');

        let width, height;


        let mouseX = 0;
        let mouseY = 0;

        let targetMouseX = 0;
        let targetMouseY = 0;


        // ===== Tier Based Config =====

        let waveCount;
        let pointGap;
        let fpsLimit;
        let particleLimit;

        if (DEVICE_TIER === "HIGH") {
            waveCount = 8;
            pointGap = 8;
            fpsLimit = 16;
            particleLimit = 4;
        }
        else if (DEVICE_TIER === "MEDIUM") {
            waveCount = 6;
            pointGap = 12;
            fpsLimit = 28;
            particleLimit = 2;
        }
        else {
            waveCount = 4;
            pointGap = 18;
            fpsLimit = 40;
            particleLimit = 1;
        }


        const resize = () => {

            width = canvas.parentElement.offsetWidth;
            height = canvas.parentElement.offsetHeight;

            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        };


        window.addEventListener('resize', resize);
        resize();


        window.addEventListener('mousemove', (e) => {

            targetMouseX = (e.clientX / window.innerWidth) - 0.5;
            targetMouseY = (e.clientY / window.innerHeight) - 0.5;

        });


        const colors = ['#ff6a00', '#ff8c00', '#ffa500'];


        const waves = Array.from({ length: waveCount }, (_, i) => ({

            y: height * (0.3 + Math.random() * 0.4),
            amplitude: 50 + Math.random() * 60,
            frequency: 0.001 + Math.random() * 0.002,
            phase: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.03,
            color: colors[i % colors.length],
            thickness: 1 + Math.random() * 2,
            opacity: 0.35 + Math.random() * 0.4,
            particles: []

        }));


        let lastTime = 0;


        const animate = (time) => {

            if (time - lastTime < fpsLimit) {
                requestAnimationFrame(animate);
                return;
            }

            lastTime = time;


            ctx.clearRect(0, 0, width, height);


            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;


            waves.forEach((wave, i) => {

                ctx.beginPath();

                ctx.lineWidth = wave.thickness;
                ctx.globalAlpha = wave.opacity;


                const gradient = ctx.createLinearGradient(0, 0, width, 0);
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.2, wave.color);
                gradient.addColorStop(0.8, wave.color);
                gradient.addColorStop(1, 'transparent');

                ctx.strokeStyle = gradient;


                for (let x = 0; x < width; x += pointGap) {

                    const parallaxY = mouseY * 50 * (i * 0.1 + 0.5);

                    const y =
                        wave.y +
                        Math.sin(x * wave.frequency + wave.phase) * wave.amplitude +
                        Math.sin(x * 0.005 + wave.phase * 0.5) * 20 +
                        parallaxY;

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);

                }


                ctx.stroke();


                if (Math.random() < 0.02 && wave.particles.length < particleLimit) {

                    wave.particles.push({
                        x: 0,
                        speed: 1.5 + Math.random() * 2
                    });

                }


                wave.particles.forEach((p, pi) => {

                    const py =
                        wave.y +
                        Math.sin(p.x * wave.frequency + wave.phase) * wave.amplitude;


                    ctx.beginPath();
                    ctx.arc(p.x, py, 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();

                    p.x += p.speed;

                    if (p.x > width) wave.particles.splice(pi, 1);

                });


                wave.phase += wave.speed;

            });


            requestAnimationFrame(animate);

        };


        requestAnimationFrame(animate);

    };


    initHeroWaves();

});
