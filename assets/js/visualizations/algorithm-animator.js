/* ============================================
   ALGORITHM ANIMATION
   ============================================ */

const AlgorithmAnimator = (() => {
    let dpCanvas, greedyCanvas;
    let dpAnimationId, greedyAnimationId;
    let dpState = { playing: false, step: 0 };
    let greedyState = { playing: false, step: 0 };

    const init = () => {
        dpCanvas = document.getElementById('dpTableVisualization');
        greedyCanvas = document.getElementById('greedyVisualization');

        setupDPControls();
        setupGreedyControls();
        setupAlgoTabs();
    };

    const setupDPControls = () => {
        document.getElementById('dpPlayBtn')?.addEventListener('click', () => animateDPTable());
        document.getElementById('dpPauseBtn')?.addEventListener('click', () => pauseDPAnimation());
        document.getElementById('dpResetBtn')?.addEventListener('click', () => resetDPAnimation());
        document.getElementById('dpSpeedSlider')?.addEventListener('input', (e) => {
            // Speed adjustment logic here
        });
    };

    const setupGreedyControls = () => {
        document.getElementById('greedyPlayBtn')?.addEventListener('click', () => animateGreedySelection());
        document.getElementById('greedyPauseBtn')?.addEventListener('click', () => pauseGreedyAnimation());
        document.getElementById('greedyResetBtn')?.addEventListener('click', () => resetGreedyAnimation());
    };

    const animateDPTable = () => {
        if (dpState.playing) return;
        dpState.playing = true;
        if (!dpCanvas) return;
        const assets = InvestmentOptimizer.getMockAssets();
        const ctx = dpCanvas.getContext('2d');
        const startTime = performance.now();
        const duration = (typeof SG_CONFIG !== 'undefined' && SG_CONFIG.DP_ANIM_MS) ? SG_CONFIG.DP_ANIM_MS : 3000;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            ctx.clearRect(0, 0, dpCanvas.width, dpCanvas.height);
            
            // Draw DP table visualization
            const cellSize = 30;
            const cols = Math.min(15, assets.length + 1);
            const rows = 10;

            for (let i = 0; i <= rows; i++) {
                for (let j = 0; j <= cols; j++) {
                    const x = j * cellSize;
                    const y = i * cellSize;
                    const fillProgress = Math.min(i * cols + j, progress * cols * rows) / (cols * rows);

                    ctx.fillStyle = `rgba(0, 212, 255, ${0.2 + fillProgress * 0.6})`;
                    ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
                    
                    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
                    ctx.strokeRect(x, y, cellSize - 1, cellSize - 1);
                }
            }

            const dpStepEl = document.getElementById('dpStep'); if (dpStepEl) dpStepEl.textContent = Math.floor(progress * cols * rows);
            const dpTimeEl = document.getElementById('dpTime'); if (dpTimeEl) dpTimeEl.textContent = elapsed.toFixed(0) + 'ms';
            const dpStatusEl = document.getElementById('dpStatus'); if (dpStatusEl) dpStatusEl.textContent = progress === 1 ? 'Complete' : 'Running';

            if (progress < 1) {
                dpAnimationId = requestAnimationFrame(animate);
            } else {
                dpState.playing = false;
            }
        };

        dpAnimationId = requestAnimationFrame(animate);
    };

    const pauseDPAnimation = () => {
        cancelAnimationFrame(dpAnimationId);
        dpState.playing = false;
    };

    const resetDPAnimation = () => {
        pauseDPAnimation();
        dpState.step = 0;
        document.getElementById('dpStep').textContent = '0';
        document.getElementById('dpTime').textContent = '0ms';
        document.getElementById('dpStatus').textContent = 'Ready';

        const ctx = dpCanvas.getContext('2d');
        ctx.clearRect(0, 0, dpCanvas.width, dpCanvas.height);
    };

    const animateGreedySelection = () => {
        if (greedyState.playing) return;
        greedyState.playing = true;
        if (!greedyCanvas) return;
        const assets = InvestmentOptimizer.getMockAssets();
        const ctx = greedyCanvas.getContext('2d');
        const startTime = performance.now();
        const duration = (typeof SG_CONFIG !== 'undefined' && SG_CONFIG.GREEDY_ANIM_MS) ? SG_CONFIG.GREEDY_ANIM_MS : 2000;
        const sortedAssets = [...assets].sort((a, b) => (b.expectedReturn / b.risk) - (a.expectedReturn / a.risk));

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentStep = Math.floor(progress * sortedAssets.length);

            ctx.clearRect(0, 0, greedyCanvas.width, greedyCanvas.height);

            const itemHeight = 40;
            const itemWidth = 200;
            const startX = 50;
            const startY = 50;

            for (let i = 0; i < sortedAssets.length; i++) {
                const asset = sortedAssets[i];
                const y = startY + i * itemHeight;
                const isSelected = i < currentStep;

                ctx.fillStyle = isSelected ? 'rgba(81, 207, 102, 0.3)' : 'rgba(0, 212, 255, 0.1)';
                ctx.fillRect(startX, y, itemWidth, itemHeight - 5);

                ctx.strokeStyle = isSelected ? '#51cf66' : 'rgba(0, 212, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.strokeRect(startX, y, itemWidth, itemHeight - 5);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.font = 'bold 14px Arial';
                ctx.fillText(asset.symbol, startX + 10, y + 25);

                if (isSelected) {
                    ctx.fillStyle = '#51cf66';
                    ctx.fillText('✓', startX + itemWidth - 20, y + 25);
                }
            }

            const greedyStepEl = document.getElementById('greedyStep'); if (greedyStepEl) greedyStepEl.textContent = currentStep;
            const greedyTimeEl = document.getElementById('greedyTime'); if (greedyTimeEl) greedyTimeEl.textContent = elapsed.toFixed(0) + 'ms';
            const greedyStatusEl = document.getElementById('greedyStatus'); if (greedyStatusEl) greedyStatusEl.textContent = progress === 1 ? 'Complete' : 'Running';

            if (progress < 1) {
                greedyAnimationId = requestAnimationFrame(animate);
            } else {
                greedyState.playing = false;
            }
        };

        greedyAnimationId = requestAnimationFrame(animate);
    };

    const pauseGreedyAnimation = () => {
        cancelAnimationFrame(greedyAnimationId);
        greedyState.playing = false;
    };

    const resetGreedyAnimation = () => {
        pauseGreedyAnimation();
        greedyState.step = 0;
        document.getElementById('greedyStep').textContent = '0';
        document.getElementById('greedyTime').textContent = '0ms';
        document.getElementById('greedyStatus').textContent = 'Ready';

        const ctx = greedyCanvas.getContext('2d');
        ctx.clearRect(0, 0, greedyCanvas.width, greedyCanvas.height);
    };

    const setupAlgoTabs = () => {
        document.querySelectorAll('.algo-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.algo-tab').forEach(t => t.classList.remove('active'));
                document.getElementById('dpSection').style.display = 'none';
                document.getElementById('greedySection').style.display = 'none';

                tab.classList.add('active');
                const algo = tab.getAttribute('data-algo');

                if (algo === 'dp') {
                    document.getElementById('dpSection').style.display = 'block';
                } else {
                    document.getElementById('greedySection').style.display = 'block';
                }
            });
        });
    };

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', AlgorithmAnimator.init);
