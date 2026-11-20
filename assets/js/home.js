/* ============================================
   HOME PAGE FUNCTIONALITY
   ============================================ */

const HomeManager = (() => {
    let particleAnimationId;
    let heroChart;

    const init = () => {
        setupParticleEffect();
        setupHeroChart();
        setupScrollAnimations();
        setupLearnMoreButton();
    };

    const setupParticleEffect = () => {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 1;
                this.speedY = (Math.random() - 0.5) * 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += (Math.random() - 0.5) * 0.02;

                if (this.opacity <= 0) this.opacity = 0.2;
                if (this.opacity >= 1) this.opacity = 0.8;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Create particles (configurable)
        const count = (typeof SG_CONFIG !== 'undefined' && SG_CONFIG.PARTICLE_COUNT) ? SG_CONFIG.PARTICLE_COUNT : 50;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let particle of particles) {
                particle.update();
                particle.draw();
            }

            // Draw connecting lines
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Throttle animation if requested
            if (typeof SG_CONFIG !== 'undefined' && SG_CONFIG.REDUCE_ANIMATIONS) {
                setTimeout(() => { particleAnimationId = requestAnimationFrame(animate); }, 1000 / 30);
            } else {
                particleAnimationId = requestAnimationFrame(animate);
            }
        };

        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    };

    const setupHeroChart = () => {
        const heroChartCanvas = document.getElementById('heroChart');
        if (!heroChartCanvas) return;

        // Create animated chart
        const ctx = heroChartCanvas.getContext('2d');
        const generateData = () => {
            const labels = [];
            const dataPoints = [];
            for (let i = 0; i < 12; i++) {
                labels.push(`M${i + 1}`);
                dataPoints.push(Math.random() * 50 + 30);
            }
            return { labels, dataPoints };
        };

        const { labels, dataPoints } = generateData();

        heroChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Portfolio Growth',
                    data: dataPoints,
                    fill: true,
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderColor: '#00d4ff',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: '#00d4ff',
                    pointBorderColor: '#0066ff',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { size: 12, weight: 'bold' }
                        }
                    },
                    filler: {
                        propagate: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 212, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)',
                            callback: function(value) {
                                return '₹' + value + 'K';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    }
                }
            }
        });
    };

    const setupScrollAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-card, .step-card, .stat-item').forEach(el => {
            observer.observe(el);
        });
    };

    const setupLearnMoreButton = () => {
        const learnMoreBtn = document.getElementById('learnMore');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                document.querySelector('.features').scrollIntoView({ behavior: 'smooth' });
            });
        }
    };

    return {
        init
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', HomeManager.init);
