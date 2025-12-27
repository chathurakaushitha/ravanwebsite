document.addEventListener('DOMContentLoaded', () => {
            
    // --- 1. DATA VORTEX ANIMATION (Hero) ---
    const canvas = document.getElementById('vortexCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, centerX, centerY;
        let particles = [];
        
        // Configuration
        const particleCount = 400; // Number of particles
        const speedBase = 15; // Base speed of travel
        const colorRed = '#ff2a2a';
        const colorBlue = '#2a8dff';

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            centerX = width / 2;
            centerY = height / 2;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = (Math.random() - 0.5) * width * 2;
                this.y = (Math.random() - 0.5) * height * 2;
                this.z = initial ? Math.random() * 2000 : 2000;
                this.prevZ = this.z;
                this.color = Math.random() > 0.5 ? colorRed : colorBlue;
                this.speed = speedBase + Math.random() * 5; 
            }

            update() {
                this.prevZ = this.z;
                this.z -= this.speed;

                if (this.z <= 1) {
                    this.reset();
                    this.prevZ = this.z; 
                }
            }

            draw() {
                const focalLength = 250;
                const sx = (this.x / this.z) * focalLength + centerX;
                const sy = (this.y / this.z) * focalLength + centerY;
                const px = (this.x / this.prevZ) * focalLength + centerX;
                const py = (this.y / this.prevZ) * focalLength + centerY;
                const size = (1 - (this.z / 2000)) * 3;

                if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) return;

                ctx.beginPath();
                ctx.lineWidth = size;
                ctx.strokeStyle = this.color;
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.stroke();
                
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(sx, sy, size/2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            // Motion Blur Effect with Dark Background
            ctx.fillStyle = 'rgba(2, 2, 5, 0.3)'; 
            ctx.fillRect(0, 0, width, height);

            for (let p of particles) {
                p.update();
                p.draw();
            }
            
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }

    // --- 2. NEURAL NETWORK BACKGROUND (Lower Sections) ---
    const netCanvas = document.getElementById('networkCanvas');
    if (netCanvas) {
        const ctx = netCanvas.getContext('2d');
        let w, h;
        let netParticles = [];
        const netCount = 60;
        const connectionDistance = 150;

        function resizeNet() {
            w = netCanvas.width = window.innerWidth;
            h = netCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeNet);
        resizeNet();

        class NetParticle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
            }
            draw() {
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for(let i=0; i<netCount; i++) netParticles.push(new NetParticle());

        function animateNet() {
            ctx.clearRect(0, 0, w, h);
            
            // Draw connections first
            for (let i = 0; i < netParticles.length; i++) {
                for (let j = i; j < netParticles.length; j++) {
                    const dx = netParticles[i].x - netParticles[j].x;
                    const dy = netParticles[i].y - netParticles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(50, 50, 50, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(netParticles[i].x, netParticles[i].y);
                        ctx.lineTo(netParticles[j].x, netParticles[j].y);
                        ctx.stroke();
                    }
                }
                netParticles[i].update();
                netParticles[i].draw();
            }
            requestAnimationFrame(animateNet);
        }
        animateNet();
    }

    // --- 3. SCRAMBLE TEXT DECODER EFFECT ---
    // Characters to use for scrambling
    const hackerChars = '!<>-_\\/[]{}—=+*^?#________';
    
    function scrambleText(element) {
        // Store original HTML to preserve spans like <span class="text-neon-blue">
        const originalHTML = element.innerHTML;
        const originalText = element.innerText;
        const length = originalText.length;
        let iterations = 0;
        
        // We will animate the text content for the effect, 
        // but at the end, restore the innerHTML to keep colors.
        
        const interval = setInterval(() => {
            element.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if(index < iterations) {
                        return originalText[index];
                    }
                    return hackerChars[Math.floor(Math.random() * hackerChars.length)];
                })
                .join("");
            
            if(iterations >= length) {
                clearInterval(interval);
                element.innerHTML = originalHTML; // Restore colors/spans
            }
            
            iterations += 1 / 2; // Speed of decode
        }, 30);
    }

    // Observe headers for scramble effect
    const scrambleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                // Only scramble if it hasn't been done (or do it every time if preferred)
                // Here we do it every time it scrolls into view for effect
                scrambleText(entry.target);
                scrambleObserver.unobserve(entry.target); // Do once per load
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.decode-effect').forEach(el => scrambleObserver.observe(el));


    // --- 4. HOLOGRAPHIC 3D TILT EFFECT ---
    // Applied to .tilt-card (Philosophy) and .service-col (Capabilities)
    const tiltElements = document.querySelectorAll('.tilt-card, .service-col');

    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Rotation values (reduced multiplier for subtle effect)
            const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg tilt
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset position
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });


    // --- 5. ROBOTIC AUDIO FX ---
    // Using Web Audio API - Requires user interaction first
    let audioContext = null;
    let audioEnabled = false;

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioEnabled = true;
        } else if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    // Enable audio on first click anywhere
    document.body.addEventListener('click', initAudio, { once: true });

    function playBeep() {
        if (!audioEnabled || !audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        // Quick pitch slide for robotic feel
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Low volume
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    // Attach beep to hoverable elements
    document.querySelectorAll('.audio-hover, .tilt-card, .service-col').forEach(el => {
        el.addEventListener('mouseenter', playBeep);
    });


    // --- EXISTING UI LOGIC (Kept from original) ---

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });
    }

    // Tagline Rotation
    const taglines = [
        "Where Intelligence Dominates",
        "Systems That Think",
        "Evolution Under Pressure",
        "Data > Instinct"
    ];
    let tagIndex = 0;
    const tagElement = document.getElementById('rotating-tagline');
    
    if(tagElement) {
        setInterval(() => {
            tagElement.style.opacity = '0';
            setTimeout(() => {
                tagIndex = (tagIndex + 1) % taglines.length;
                tagElement.textContent = taglines[tagIndex];
                tagElement.style.opacity = '1';
            }, 500);
        }, 4000);
        tagElement.style.transition = "opacity 0.5s ease";
    }

    // 3D SCROLL ANIMATIONS (Intersection Observer)
    const observerOptions = {
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-item').forEach(section => {
        observer.observe(section);
    });

    // Form Submission Mock
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = "Transmitting...";
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                form.reset();
                formMessage.classList.remove('hidden');
                setTimeout(() => {
                    formMessage.classList.add('hidden');
                }, 5000);
            }, 1500);
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            if(navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });
});