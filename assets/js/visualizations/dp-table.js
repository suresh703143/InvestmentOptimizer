/* ============================================
   DP TABLE VISUALIZATION
   ============================================ */

const DPTableVisualizer = (() => {
    let canvas, ctx;
    let animationId;
    let isPlaying = false;

    const init = () => {
        canvas = document.getElementById('dpTableCanvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        setupEventListeners();
    };

    const setupEventListeners = () => {
        const playBtn = document.getElementById('playDpBtn');
        const resetBtn = document.getElementById('resetDpBtn');

        if (playBtn) {
            playBtn.addEventListener('click', startAnimation);
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', resetAnimation);
        }
    };

    const startAnimation = () => {
        if (isPlaying) return;
        isPlaying = true;

        const startTime = performance.now();
        const duration = (typeof SG_CONFIG !== 'undefined' && SG_CONFIG.DP_ANIM_MS) ? SG_CONFIG.DP_ANIM_MS : 3000;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawDPTable(progress);

            document.getElementById('animationTime').textContent = elapsed.toFixed(0) + 'ms';

            if (progress < 1) {
                animationId = requestAnimationFrame(animate);
            } else {
                isPlaying = false;
            }
        };

        animationId = requestAnimationFrame(animate);
    };

    const drawDPTable = (progress) => {
        const cellSize = 50;
        const cols = 12;
        const rows = 11;

        const colors = ['#1a1a2e', '#16213e', '#0f3460', '#00d4ff', '#00a8e8'];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = j * cellSize + 20;
                const y = i * cellSize + 20;
                const fillProgress = Math.min((i * cols + j) / (cols * rows), progress);

                // Draw cell
                const colorIdx = Math.floor(fillProgress * (colors.length - 1));
                ctx.fillStyle = colors[colorIdx];
                ctx.globalAlpha = 0.7;
                ctx.fillRect(x, y, cellSize - 2, cellSize - 2);

                // Draw border
                ctx.globalAlpha = 1;
                ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, cellSize - 2, cellSize - 2);

                // Draw value
                if (fillProgress > 0.1) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const value = Math.floor(Math.random() * 1000 * fillProgress);
                    ctx.fillText(value.toString(), x + cellSize / 2, y + cellSize / 2);
                }
            }
        }

        // Draw legend
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('DP Table Construction: ' + Math.round(progress * 100) + '%', 20, canvas.height - 10);
    };

    const resetAnimation = () => {
        cancelAnimationFrame(animationId);
        isPlaying = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('animationTime').textContent = '0ms';
    };

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', DPTableVisualizer.init);
