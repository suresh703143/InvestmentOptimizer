/* ============================================
   RESULTS PAGE FUNCTIONALITY
   ============================================ */

const ResultsPageManager = (() => {
    let charts = {};

    // Reduce Chart.js animation durations if configured
    if (typeof Chart !== 'undefined' && typeof SG_CONFIG !== 'undefined' && SG_CONFIG.CHART_ANIMATION_MS) {
        if (!Chart.defaults) Chart.defaults = {};
        if (!Chart.defaults.animation) Chart.defaults.animation = {};
        Chart.defaults.animation.duration = SG_CONFIG.CHART_ANIMATION_MS;
    }

    const init = () => {
        loadMockResults();
        setupScenarioAnalysis();
        setupExportButtons();
    };

    const loadMockResults = () => {
        const assets = InvestmentOptimizer.getMockAssets();
        const budget = 50000;
        const riskThreshold = 20;

        const dpResult = InvestmentOptimizer.optimizeDP(assets, budget, riskThreshold);

        displaySummary(dpResult);
        displayComposition(dpResult);
        displayAssetsTable(dpResult);
        displayPerformanceCharts(dpResult);
        displayRiskAnalytics(dpResult);
        displayAlgorithmComparison(dpResult);
        displayRecommendations();
        displayBacktestResults();
    };

    const displaySummary = (result) => {
        const inv = document.getElementById('summaryInvestment'); if (inv) inv.textContent = '₹' + (result.totalInvestment || 0).toFixed(2);
        const ret = document.getElementById('summaryReturn'); if (ret) ret.textContent = '₹' + (result.totalReturn || 0).toFixed(2);
        const risk = document.getElementById('summaryRisk'); if (risk) risk.textContent = ((result.totalRisk || 0)).toFixed(1) + '%';
        const score = document.getElementById('summaryScore'); if (score) score.textContent = (result.optimizationScore || 0) + '%';
    };

    const displayComposition = (result) => {
        const allocationCtx = document.getElementById('allocationChart');
        const riskCtx = document.getElementById('riskChart');
        // Allocation Chart
        if (allocationCtx) {
            charts.allocation = new Chart(allocationCtx, {
            type: 'doughnut',
            data: {
                labels: result.selectedAssets.map(a => a.symbol),
                datasets: [{
                    data: result.selectedAssets.map(a => (a.price / result.totalInvestment * 100).toFixed(1)),
                    backgroundColor: [
                        '#00d4ff', '#0066ff', '#ff6b6b', '#51cf66', '#ffa94d',
                        '#ff922b', '#748ffc', '#a78bfa', '#06b6d4', '#f59e0b'
                    ],
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
                        labels: { color: 'rgba(255, 255, 255, 0.7)', padding: 15 }
                    }
                }
            }
            });
        }

        // Risk Distribution Chart
        if (riskCtx) {
            charts.risk = new Chart(riskCtx, {
            type: 'polarArea',
            data: {
                labels: result.selectedAssets.map(a => a.symbol),
                datasets: [{
                    data: result.selectedAssets.map(a => a.risk),
                    backgroundColor: [
                        'rgba(0, 212, 255, 0.3)',
                        'rgba(0, 102, 255, 0.3)',
                        'rgba(255, 107, 107, 0.3)',
                        'rgba(81, 207, 102, 0.3)',
                        'rgba(255, 154, 77, 0.3)'
                    ],
                    borderColor: [
                        '#00d4ff', '#0066ff', '#ff6b6b', '#51cf66', '#ffa94d'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                },
                scales: {
                    r: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(0, 212, 255, 0.1)' }
                    }
                }
            }
            });
        }
    };

    const displayAssetsTable = (result) => {
        const tbody = document.getElementById('assetsTableBody');
        if (!tbody || !result.selectedAssets) return;

        tbody.innerHTML = result.selectedAssets.map(asset => {
            const allocation = (asset.price / result.totalInvestment * 100).toFixed(1);
            const expectedReturn = (asset.price * asset.expectedReturn / 100).toFixed(2);
            const roi = ((expectedReturn / asset.price) * 100).toFixed(1);

            return `
                <tr>
                    <td><strong>${asset.symbol}</strong></td>
                    <td>${asset.name}</td>
                    <td>${allocation}%</td>
                    <td>₹${asset.price.toFixed(2)}</td>
                    <td>₹${expectedReturn}</td>
                    <td><span class="badge" style="background: ${asset.risk < 10 ? 'rgba(81, 207, 102, 0.2); color: #51cf66' : asset.risk < 20 ? 'rgba(255, 193, 7, 0.2); color: #ffc107' : 'rgba(255, 107, 107, 0.2); color: #ff6b6b'};">${asset.risk}%</span></td>
                    <td>${roi}%</td>
                </tr>
            `;
        }).join('');
    };

    const displayPerformanceCharts = (result) => {
        // Return vs Risk Scatter
        const rrEl = document.getElementById('returnRiskScatter');
        if (rrEl) {
            charts.returnRisk = new Chart(rrEl, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Selected Assets',
                        data: result.selectedAssets.map(a => ({ x: a.risk, y: a.expectedReturn })),
                        backgroundColor: '#00d4ff',
                        pointRadius: 8,
                        pointHoverRadius: 10
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
        }

        // Historical Performance
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const performanceData = months.map(() => Math.random() * 30 - 10);

        const perfEl = document.getElementById('performanceChart');
        if (perfEl) {
            charts.performance = new Chart(perfEl, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Monthly Returns',
                        data: performanceData,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#00d4ff'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } }
                    },
                    scales: {
                        y: {
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                            grid: { color: 'rgba(0, 212, 255, 0.1)' }
                        },
                        x: {
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                        }
                    }
                }
            });
        }

        // Returns Distribution
        const distEl = document.getElementById('returnsDistribution');
        if (distEl) {
            charts.distribution = new Chart(distEl, {
                type: 'bar',
                data: {
                    labels: ['< -10%', '-10 to -5%', '-5 to 0%', '0 to 5%', '5 to 10%', '> 10%'],
                    datasets: [{
                        label: 'Frequency',
                        data: [5, 8, 12, 20, 35, 20],
                        backgroundColor: '#00d4ff',
                        borderColor: 'rgba(0, 212, 255, 0.5)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } }
                    },
                    scales: {
                        y: {
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                            grid: { color: 'rgba(0, 212, 255, 0.1)' }
                        },
                        x: {
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                        }
                    }
                }
            });
        }

        // Cumulative Growth
        let cumulative = [100];
        for (let i = 1; i < 12; i++) {
            cumulative.push(cumulative[i - 1] * (1 + (Math.random() * 0.05 - 0.01)));
        }

        const cumEl = document.getElementById('cumulativeGrowth');
        if (cumEl) {
            charts.cumulative = new Chart(cumEl, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Portfolio Value (₹)',
                        data: cumulative,
                        borderColor: '#51cf66',
                        backgroundColor: 'rgba(81, 207, 102, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } }
                    },
                    scales: {
                        y: {
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                            grid: { color: 'rgba(0, 212, 255, 0.1)' }
                        },
                        x: {
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                        }
                    }
                }
            });
        }
    };

    const displayRiskAnalytics = (result) => {
        document.getElementById('varValue').textContent = '-₹' + (result.totalInvestment * 0.05).toFixed(0);
        document.getElementById('sharpeRatio').textContent = (1.5 + Math.random()).toFixed(2);
        document.getElementById('betaValue').textContent = (0.8 + Math.random() * 0.4).toFixed(2);
        document.getElementById('maxDrawdown').textContent = '-' + (Math.random() * 15 + 5).toFixed(1) + '%';
    };

    const displayAlgorithmComparison = (result) => {
        const greedy = InvestmentOptimizer.getMockAssets();
        const budget = 50000;
        const riskThreshold = 20;
        const greedyResult = InvestmentOptimizer.optimizeGreedy(greedy, budget, riskThreshold);

        document.getElementById('dpExecTime').textContent = result.executionTime.toFixed(2) + 'ms';
        document.getElementById('greedyExecTime').textContent = greedyResult.executionTime.toFixed(2) + 'ms';
        document.getElementById('timeWinner').textContent = result.executionTime < greedyResult.executionTime ? '✓ DP' : '✓ Greedy';

        document.getElementById('dpOptScore').textContent = result.optimizationScore + '%';
        document.getElementById('greedyOptScore').textContent = greedyResult.optimizationScore + '%';
        document.getElementById('scoreWinner').textContent = result.optimizationScore > greedyResult.optimizationScore ? '🥇' : '🥈';

        document.getElementById('dpReturn').textContent = '₹' + result.totalReturn.toFixed(0);
        document.getElementById('greedyReturn').textContent = '₹' + greedyResult.totalReturn.toFixed(0);

        document.getElementById('dpRisk').textContent = result.totalRisk.toFixed(1) + '%';
        document.getElementById('greedyRisk').textContent = greedyResult.totalRisk.toFixed(1) + '%';

        // Efficiency chart
        charts.algoEfficiency = new Chart(document.getElementById('algoEfficiency'), {
            type: 'bar',
            data: {
                labels: ['Speed', 'Accuracy', 'Risk Control', 'Scalability'],
                datasets: [
                    {
                        label: 'Dynamic Programming',
                        data: [70, 100, 95, 60],
                        backgroundColor: '#00d4ff'
                    },
                    {
                        label: 'Greedy Algorithm',
                        data: [95, 80, 85, 100],
                        backgroundColor: '#0066ff'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } }
                },
                scales: {
                    y: {
                        max: 100,
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(0, 212, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
        });
    };

    const displayRecommendations = () => {
        // Recommendations are hardcoded in HTML
    };

    const setupScenarioAnalysis = () => {
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const scenario = btn.getAttribute('data-scenario');
                updateScenarioChart(scenario);
            });
        });

        // Initialize first scenario
        updateScenarioChart('bull');
    };

    const updateScenarioChart = (scenario) => {
        if (charts.scenario) {
            charts.scenario.destroy();
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const scenarios = {
            bull: [105, 110, 115, 118, 122, 125],
            bear: [95, 92, 90, 88, 85, 82],
            stable: [100, 101, 100, 102, 101, 100],
            crisis: [100, 90, 80, 75, 80, 85]
        };

        charts.scenario = new Chart(document.getElementById('scenarioChart'), {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: scenario.charAt(0).toUpperCase() + scenario.slice(1) + ' Market',
                    data: scenarios[scenario],
                    borderColor: scenario === 'bull' ? '#51cf66' : scenario === 'bear' ? '#ff6b6b' : '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } }
                },
                scales: {
                    y: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(0, 212, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
        });
    };

    const displayBacktestResults = () => {
        const months = Array.from({length: 12}, (_, i) => `M${i + 1}`);
        let value = 100;
        const backtestData = [];
        for (let i = 0; i < 12; i++) {
            value *= (1 + (Math.random() * 0.03 - 0.01));
            backtestData.push(value);
        }

        const backtestEl = document.getElementById('backtestChart');
        if (backtestEl) {
            charts.backtest = new Chart(backtestEl, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '1-Year Backtest',
                    data: backtestData,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#00d4ff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'Portfolio Value' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(0, 212, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
            });
        }
    };

    const setupExportButtons = () => {
        const pdfBtn = document.querySelector('[id="exportPdfBtn"]');
        const printBtn = document.getElementById('printBtn');
        const shareBtn = document.querySelector('[id="shareBtn"]');

        if (pdfBtn) {
            pdfBtn.addEventListener('click', () => {
                const element = document.querySelector('.main-content');
                html2pdf().set({ margin: 10, filename: 'portfolio-report.pdf' }).from(element).save();
            });
        }

        if (printBtn) {
            printBtn.addEventListener('click', () => window.print());
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: 'Portfolio Analysis Results',
                        text: 'Check out my Smart-Grow portfolio optimization results!',
                        url: window.location.href
                    });
                }
            });
        }

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.textContent;
                if (action.includes('PDF')) {
                    const element = document.querySelector('.main-content');
                    html2pdf().set({ margin: 10 }).from(element).save('portfolio-report.pdf');
                } else if (action.includes('CSV')) {
                    console.log('CSV export - implement as needed');
                } else if (action.includes('Email')) {
                    console.log('Email results - implement as needed');
                } else if (action.includes('Link')) {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                }
            });
        });
    };

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', ResultsPageManager.init);
