/* ============================================
   MARKET DATA FUNCTIONALITY
   ============================================ */

const MarketDataManager = (() => {
    let assets = InvestmentOptimizer.getMockAssets();
    let currentViewMode = 'grid';
    let assetCharts = {};

    const init = () => {
        setupAssetGrid();
        setupFilters();
        setupViewToggle();
        setupModal();
        setupInsights();
        setupCharts();
        setupHeatmap();
    };

    const setupAssetGrid = () => {
        const assetsGrid = document.getElementById('assetsGrid');
        renderAssets(assets);

        // Render trending assets
        const trendingAssets = document.getElementById('trendingAssets');
        if (trendingAssets) {
            trendingAssets.innerHTML = assets.sort((a, b) => b.change - a.change).slice(0, 5).map(asset => `
                <div class="trending-asset" data-asset-id="${asset.id}">
                    <span class="trending-label">🔥 Trending</span>
                    <div class="trending-symbol">${asset.symbol}</div>
                    <div class="trending-price">₹${asset.price.toFixed(2)}</div>
                    <div class="trending-change ${asset.change >= 0 ? 'up' : 'down'}">
                        ${asset.change >= 0 ? '▲' : '▼'} ${Math.abs(asset.change)}%
                    </div>
                </div>
            `).join('');

            trendingAssets.querySelectorAll('.trending-asset').forEach(el => {
                el.addEventListener('click', () => openAssetModal(parseInt(el.getAttribute('data-asset-id'))));
            });
        }
    };

    const renderAssets = (assetsToRender) => {
        const assetsGrid = document.getElementById('assetsGrid');
        assetsGrid.innerHTML = assetsToRender.map(asset => `
            <div class="asset-grid-item ${currentViewMode === 'list' ? 'list-view' : ''}">
                <div class="asset-header">
                    <div class="asset-symbol">${asset.symbol}</div>
                    <span class="asset-badge">${asset.category.toUpperCase()}</span>
                </div>
                <div class="asset-name">${asset.name}</div>
                <div class="asset-price">₹${asset.price.toFixed(2)}</div>
                <div class="asset-stats">
                    <div class="asset-stat">
                        <span class="stat-label">24h</span>
                        <span class="stat-value ${asset.change >= 0 ? 'positive' : 'negative'}">
                            ${asset.change >= 0 ? '+' : ''}${asset.change}%
                        </span>
                    </div>
                    <div class="asset-stat">
                        <span class="stat-label">Risk</span>
                        <span class="stat-value">${asset.risk}%</span>
                    </div>
                    <div class="asset-stat">
                        <span class="stat-label">Return</span>
                        <span class="stat-value">${asset.expectedReturn}%</span>
                    </div>
                </div>
                <button class="btn btn-small btn-primary" onclick="MarketDataManager.openAssetModal(${asset.id})">View</button>
            </div>
        `).join('');
    };

    const setupFilters = () => {
        const searchInput = document.getElementById('searchAsset');
        const categoryFilter = document.getElementById('categoryFilter');
        const priceRangeFilter = document.getElementById('priceRangeFilter');
        const volatilityFilter = document.getElementById('volatilityFilter');

        [searchInput, categoryFilter, priceRangeFilter, volatilityFilter].forEach(el => {
            if (el) {
                el.addEventListener('change', applyFilters);
                el.addEventListener('input', applyFilters);
            }
        });
    };

    const applyFilters = () => {
        const search = document.getElementById('searchAsset')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || 'all';
        const priceRange = document.getElementById('priceRangeFilter')?.value || 'all';
        const volatility = document.getElementById('volatilityFilter')?.value || 'all';

        let filtered = assets.filter(asset => {
            const matchesSearch = asset.symbol.toLowerCase().includes(search) || 
                                 asset.name.toLowerCase().includes(search);
            const matchesCategory = category === 'all' || asset.category === category;
            
            let matchesPrice = true;
            if (priceRange === 'under50') matchesPrice = asset.price < 50;
            else if (priceRange === '50-200') matchesPrice = asset.price >= 50 && asset.price <= 200;
            else if (priceRange === '200-500') matchesPrice = asset.price > 200 && asset.price <= 500;
            else if (priceRange === 'above500') matchesPrice = asset.price > 500;

            let matchesVolatility = true;
            if (volatility === 'low') matchesVolatility = asset.risk < 10;
            else if (volatility === 'medium') matchesVolatility = asset.risk >= 10 && asset.risk <= 20;
            else if (volatility === 'high') matchesVolatility = asset.risk > 20;

            return matchesSearch && matchesCategory && matchesPrice && matchesVolatility;
        });

        renderAssets(filtered);
    };

    const setupViewToggle = () => {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentViewMode = btn.getAttribute('data-view');
                renderAssets(assets);
            });
        });
    };

    const setupModal = () => {
        const modal = document.getElementById('assetModal');
        const modalClose = document.querySelector('.modal-close');
        const modalCloseBtn = document.getElementById('modalCloseBtn');

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }
    };

    const openAssetModal = (assetId) => {
        const asset = assets.find(a => a.id === assetId);
        if (!asset) return;

        document.getElementById('modalSymbol').textContent = asset.symbol;
        document.getElementById('modalName').textContent = asset.name;
        document.getElementById('currentPrice').textContent = '₹' + asset.price.toFixed(2);
        document.getElementById('dayChange').textContent = (asset.change >= 0 ? '+' : '') + asset.change + '%';
        document.getElementById('ytdReturn').textContent = '+' + (Math.random() * 25 + 5).toFixed(1) + '%';
        document.getElementById('volatility').textContent = asset.risk + '%';
        document.getElementById('marketCap').textContent = '₹' + (Math.random() * 2000 + 500).toFixed(0) + 'B';
        document.getElementById('high52w').textContent = '₹' + (asset.price * 1.3).toFixed(2);
        document.getElementById('assetDescription').textContent = 
            `${asset.name} is a leading company in the ${asset.category} sector. With an expected return of ${asset.expectedReturn}% and risk level of ${asset.risk}%, this asset is ${asset.risk < 10 ? 'suitable for conservative' : asset.risk < 20 ? 'suitable for moderate' : 'suitable for aggressive'} investors.`;

        renderAssetChart(assetId);
        document.getElementById('assetModal').classList.add('active');

        document.getElementById('selectAssetBtn').onclick = () => {
            console.log('Selected asset:', asset.symbol);
            closeModal();
        };
    };

    const closeModal = () => {
        document.getElementById('assetModal').classList.remove('active');
    };

    const renderAssetChart = (assetId) => {
        const ctx = document.getElementById('assetChart');
        if (!ctx) return;

        if (assetCharts[assetId]) {
            assetCharts[assetId].destroy();
        }

        const labels = [];
        const data = [];
        for (let i = 0; i < 30; i++) {
            labels.push(`D${i + 1}`);
            data.push(Math.random() * 50 + 50);
        }

        assetCharts[assetId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Price Trend',
                    data,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(0, 212, 255, 0.1)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
        });
    };

    const setupInsights = () => {
        const topPerformers = assets.sort((a, b) => b.change - a.change).slice(0, 5);
        const mostVolatile = assets.sort((a, b) => b.risk - a.risk).slice(0, 5);
        const bestRisk = assets.sort((a, b) => a.risk - b.risk).slice(0, 5);

        document.getElementById('topPerformers').innerHTML = topPerformers.map(a => `
            <li><span class="insight-name">${a.symbol}</span><span class="insight-value">+${a.change}%</span></li>
        `).join('');

        document.getElementById('mostVolatile').innerHTML = mostVolatile.map(a => `
            <li><span class="insight-name">${a.symbol}</span><span class="insight-value">${a.risk}%</span></li>
        `).join('');

        document.getElementById('bestRisk').innerHTML = bestRisk.map(a => `
            <li><span class="insight-name">${a.symbol}</span><span class="insight-value">${a.risk}%</span></li>
        `).join('');

        // Sentiment gauge
        const sentiment = 50 + Math.random() * 30 - 15; // -15 to +15 from neutral
        document.getElementById('sentimentFill').style.width = (50 + sentiment) + '%';
        document.getElementById('sentimentValue').textContent = 
            sentiment > 10 ? 'Bullish' : sentiment < -10 ? 'Bearish' : 'Neutral';
    };

    const setupCharts = () => {
        renderReturnRiskChart();
        renderCorrelationChart();
    };

    const renderReturnRiskChart = () => {
        const ctx = document.getElementById('returnRiskChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Assets',
                    data: assets.map(a => ({ x: a.risk, y: a.expectedReturn })),
                    backgroundColor: '#00d4ff',
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Risk (%)', color: 'rgba(255, 255, 255, 0.7)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(0, 212, 255, 0.1)' }
                    },
                    y: {
                        title: { display: true, text: 'Expected Return (%)', color: 'rgba(255, 255, 255, 0.7)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(0, 212, 255, 0.1)' }
                    }
                }
            }
        });
    };

    const renderCorrelationChart = () => {
        const ctx = document.getElementById('correlationChart');
        if (!ctx) return;

        const symbols = assets.slice(0, 5).map(a => a.symbol);
        const correlationData = symbols.map(() => symbols.map(() => Math.random()));

        new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: assets.slice(0, 5).map((asset, idx) => ({
                    label: asset.symbol,
                    data: assets.slice(0, 5).map((a, i) => ({
                        x: idx,
                        y: i,
                        r: 8
                    })),
                    backgroundColor: ['#00d4ff', '#0066ff', '#ff6b6b', '#51cf66', '#ffa94d'][idx]
                }))
            },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } } },
                scales: {
                    x: { ticks: { color: 'rgba(255, 255, 255, 0.7)' } },
                    y: { ticks: { color: 'rgba(255, 255, 255, 0.7)' } }
                }
            }
        });
    };

    const setupHeatmap = () => {
        const container = document.getElementById('heatmapContainer');
        if (!container) return;

        container.innerHTML = assets.map(asset => {
            const changeColor = asset.change >= 3 ? 'rgba(81, 207, 102, 0.4)' :
                               asset.change >= 0 ? 'rgba(81, 207, 102, 0.2)' :
                               asset.change >= -3 ? 'rgba(255, 107, 107, 0.2)' :
                               'rgba(255, 107, 107, 0.4)';
            const textColor = asset.change >= 0 ? '#51cf66' : '#ff6b6b';
            return `
                <div class="heatmap-cell" style="background: ${changeColor};" title="${asset.name}">
                    <span class="heatmap-symbol" style="color: var(--current-text-primary);">${asset.symbol}</span>
                    <span class="heatmap-change" style="color: ${textColor};">${asset.change >= 0 ? '+' : ''}${asset.change}%</span>
                </div>
            `;
        }).join('');
    };

    return {
        init,
        openAssetModal
    };
})();

document.addEventListener('DOMContentLoaded', MarketDataManager.init);
