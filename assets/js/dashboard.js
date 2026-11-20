/* ============================================
   DASHBOARD FUNCTIONALITY
   ============================================ */

const DashboardManager = (() => {
    let selectedAssets = [];
    let portfolioChart;
    let comparisonResults;

    const SG = window.SG || (window.SG = {
        get: id => document.getElementById(id),
        q: sel => document.querySelector(sel),
        safeText: (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; },
        has: id => !!document.getElementById(id)
    });

    // Apply Chart.js animation config if present
    if (typeof Chart !== 'undefined' && typeof SG_CONFIG !== 'undefined' && SG_CONFIG.CHART_ANIMATION_MS) {
        if (!Chart.defaults) Chart.defaults = {};
        if (!Chart.defaults.animation) Chart.defaults.animation = {};
        Chart.defaults.animation.duration = SG_CONFIG.CHART_ANIMATION_MS;
    }

    const init = () => {
        setupInputListeners();
        setupAssetGrid();
        setupOptimizeButton();
        updateQuickStats();
    };

    const setupInputListeners = () => {
        const investmentAmount = document.getElementById('investmentAmount');
        const riskThreshold = document.getElementById('riskThreshold');
        const expectedReturn = document.getElementById('expectedReturn');

        if (investmentAmount) {
            investmentAmount.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const el = document.querySelector('.config-section:nth-child(1) .input-value');
                if (el) el.textContent = '$' + (value / 1000).toFixed(1) + 'K';
                updateQuickStats();
            });
        }

        if (riskThreshold) {
            riskThreshold.addEventListener('input', (e) => {
                const value = e.target.value;
                const el = document.querySelector('.config-section:nth-child(2) .input-value');
                if (el) el.textContent = value + '%';
                updateQuickStats();
            });
        }

        if (expectedReturn) {
            expectedReturn.addEventListener('input', (e) => {
                const value = e.target.value;
                const el = document.querySelector('.config-section:nth-child(3) .input-value');
                if (el) el.textContent = value + '%';
                updateQuickStats();
            });
        }
    };

    const setupAssetGrid = () => {
        const assetsGrid = document.getElementById('assetsGrid');
        const assets = InvestmentOptimizer.getMockAssets();

        if (assetsGrid) {
            assetsGrid.innerHTML = assets.map(asset => `
            <div class="asset-card" data-asset-id="${asset.id}">
                <div class="asset-symbol">${asset.symbol}</div>
                <div class="asset-name">${asset.name}</div>
                <div class="asset-price">$${asset.price.toFixed(2)}</div>
                <div class="asset-change ${asset.change >= 0 ? 'positive' : 'negative'}">
                    ${asset.change >= 0 ? '+' : ''}${asset.change}%
                </div>
            </div>
        `).join('');

            // Setup click listeners for asset selection
            document.querySelectorAll('.asset-card').forEach(card => {
                card.addEventListener('click', () => selectAsset(card));
            });

            // Setup asset search and filter
            const assetSearch = document.getElementById('assetSearch');
            const assetFilter = document.getElementById('assetFilter');

            if (assetSearch) {
                assetSearch.addEventListener('input', filterAssets);
            }

            if (assetFilter) {
                assetFilter.addEventListener('change', filterAssets);
            }
        }
    };

    const selectAsset = (card) => {
        const assetId = parseInt(card.getAttribute('data-asset-id'));
        const assets = InvestmentOptimizer.getMockAssets();
        const asset = assets.find(a => a.id === assetId);

        card.classList.toggle('selected');

        if (card.classList.contains('selected')) {
            selectedAssets.push(asset);
        } else {
            selectedAssets = selectedAssets.filter(a => a.id !== assetId);
        }
    };

    const filterAssets = () => {
        const searchTerm = document.getElementById('assetSearch')?.value.toLowerCase() || '';
        const filterCategory = document.getElementById('assetFilter')?.value || 'all';
        const cards = document.querySelectorAll('.asset-card');

        cards.forEach(card => {
            const symbol = card.querySelector('.asset-symbol').textContent.toLowerCase();
            const name = card.querySelector('.asset-name').textContent.toLowerCase();
            const isVisible = (symbol.includes(searchTerm) || name.includes(searchTerm)) &&
                            (filterCategory === 'all' || card.getAttribute('data-category') === filterCategory);
            
            card.style.display = isVisible ? '' : 'none';
        });
    };

    const setupOptimizeButton = () => {
        const optimizeBtn = document.getElementById('optimizeBtn');
        if (optimizeBtn) {
            optimizeBtn.addEventListener('click', runOptimization);
        }
    };

    const runOptimization = () => {
        const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
        const riskThreshold = parseFloat(document.getElementById('riskThreshold').value);
        const algorithmSelect = document.getElementById('algorithmSelect').value;

        const optimizeBtn = document.getElementById('optimizeBtn');
        optimizeBtn.disabled = true;
        optimizeBtn.querySelector('.btn-text').style.display = 'none';
        optimizeBtn.querySelector('.btn-loader').classList.remove('hidden');

        setTimeout(() => {
            const assets = InvestmentOptimizer.getMockAssets();

            if (algorithmSelect === 'dp') {
                comparisonResults = { dp: InvestmentOptimizer.optimizeDP(assets, investmentAmount, riskThreshold) };
            } else if (algorithmSelect === 'greedy') {
                comparisonResults = { greedy: InvestmentOptimizer.optimizeGreedy(assets, investmentAmount, riskThreshold) };
            } else {
                comparisonResults = InvestmentOptimizer.compareAlgorithms(assets, investmentAmount, riskThreshold);
            }

            displayResults();

            optimizeBtn.disabled = false;
            optimizeBtn.querySelector('.btn-text').style.display = '';
            optimizeBtn.querySelector('.btn-loader').classList.add('hidden');
        }, 500);
    };

    const displayResults = () => {
        const result = comparisonResults.dp || comparisonResults.greedy || (comparisonResults.dp || { selectedAssets: [] });

        // Display selected assets
        const selectedAssetsDiv = document.getElementById('selectedAssets');
        if (selectedAssetsDiv && result && result.selectedAssets) {
            selectedAssetsDiv.innerHTML = result.selectedAssets.map(asset => `
                <div class="asset-item">
                    <span class="asset-item-symbol">${asset.symbol}</span>
                    <span class="asset-item-allocation">${(asset.price / (result.totalInvestment || 1) * 100).toFixed(1)}%</span>
                </div>
            `).join('');
        }

        // Update summary metrics
        document.getElementById('totalInvestment').textContent = '₹' + result.totalInvestment.toFixed(2);
        document.getElementById('totalReturn').textContent = '₹' + result.totalReturn.toFixed(2);
        document.getElementById('totalRisk').textContent = result.totalRisk.toFixed(1) + '%';
        document.getElementById('efficiencyScore').textContent = result.optimizationScore + '%';

        // Display portfolio chart
        displayPortfolioChart(result.selectedAssets, result.totalInvestment);

        // Display algorithm comparison if available
        if (comparisonResults.comparison) {
            displayAlgorithmComparison();
        }

        // Scroll to results
        document.querySelector('.results-section').scrollIntoView({ behavior: 'smooth' });
    };

    const displayPortfolioChart = (assets, totalInvestment) => {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx) return;

        if (portfolioChart) {
            portfolioChart.destroy();
        }

        const labels = assets.map(a => a.symbol);
        const data = assets.map(a => (a.price / totalInvestment * 100).toFixed(1));
        const colors = [
            '#00d4ff', '#0066ff', '#ff6b6b', '#51cf66', '#ffa94d',
            '#ff922b', '#748ffc', '#a78bfa', '#06b6d4', '#f59e0b'
        ];

        portfolioChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, assets.length),
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            padding: 15,
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    };

    const displayAlgorithmComparison = () => {
        const comparison = comparisonResults.comparison;
        const dpResult = comparisonResults.dp;
        const greedyResult = comparisonResults.greedy;

        document.getElementById('dpTime').textContent = dpResult.executionTime.toFixed(2) + 'ms';
        document.getElementById('greedyTime').textContent = greedyResult.executionTime.toFixed(2) + 'ms';
        document.getElementById('speedAdvantage').textContent = comparison.dpFaster ? '✓ DP' : '✓ Greedy';

        document.getElementById('dpScore').textContent = dpResult.optimizationScore + '%';
        document.getElementById('greedyScore').textContent = greedyResult.optimizationScore + '%';
        document.getElementById('scoreAdvantage').textContent = comparison.dpBetter ? '✓ DP' : '✓ Greedy';

        document.getElementById('dpReturn').textContent = '₹' + dpResult.totalReturn.toFixed(2);
        document.getElementById('greedyReturn').textContent = '₹' + greedyResult.totalReturn.toFixed(2);
        document.getElementById('returnAdvantage').textContent = comparison.dpReturnBetter ? '✓ DP' : '✓ Greedy';

        document.getElementById('dpRiskAdherence').textContent = dpResult.totalRisk.toFixed(1) + '%';
        document.getElementById('greedyRiskAdherence').textContent = greedyResult.totalRisk.toFixed(1) + '%';
        document.getElementById('riskAdvantage').textContent = comparison.dpRiskBetter ? '✓ DP' : '✓ Greedy';
    };

    const updateQuickStats = () => {
        const investment = parseFloat(document.getElementById('investmentAmount').value);
        const risk = document.getElementById('riskThreshold').value;
        const returnVal = document.getElementById('expectedReturn').value;

        document.getElementById('quickBudget').textContent = '₹' + (investment / 1000).toFixed(1) + 'K';
        document.getElementById('quickRisk').textContent = risk + '%';
        document.getElementById('quickReturn').textContent = returnVal + '%';
    };

    // Export and download functionality
    const setupExportButtons = () => {
        const exportBtn = document.getElementById('exportBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const shareBtn = document.getElementById('shareBtn');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (!comparisonResults) return;
                const data = JSON.stringify(comparisonResults, null, 2);
                downloadFile(data, 'optimization-results.json', 'application/json');
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                if (!comparisonResults) return;
                html2pdf().set({margin: 10}).from(document.querySelector('.results-section')).save('portfolio-report.pdf');
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (navigator.share && comparisonResults) {
                    navigator.share({
                        title: 'Smart-Grow Optimization Results',
                        text: `Portfolio optimization completed with ${comparisonResults.dp?.selectedAssets.length || 0} assets selected`,
                        url: window.location.href
                    });
                }
            });
        }
    };

    const downloadFile = (content, filename, type) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    return {
        init,
        setupExportButtons
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    DashboardManager.init();
    DashboardManager.setupExportButtons();
});
