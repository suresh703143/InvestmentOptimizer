/* ============================================
   ALGORITHMS PAGE FUNCTIONALITY
   ============================================ */

const AlgorithmsPageManager = (() => {
    let comparisonCharts = {};

    const init = () => {
        setupAlgorithmComparison();
        setupCaseStudy();
        setupComplexityCharts();
    };

    const setupAlgorithmComparison = () => {
        const assets = InvestmentOptimizer.getMockAssets();
        const budget = 50000;
        const riskThreshold = 20;

        const comparison = InvestmentOptimizer.compareAlgorithms(assets, budget, riskThreshold);

        renderPerformanceChart(comparison);
        renderQualityChart(comparison);
    };

    const renderPerformanceChart = (comparison) => {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        comparisonCharts.performance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Execution Time (ms)', 'Memory Usage', 'Scalability'],
                datasets: [
                    {
                        label: 'Dynamic Programming',
                        data: [comparison.dp.executionTime, 85, 70],
                        backgroundColor: '#00d4ff'
                    },
                    {
                        label: 'Greedy Algorithm',
                        data: [comparison.greedy.executionTime, 45, 95],
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

    const renderQualityChart = (comparison) => {
        const ctx = document.getElementById('qualityChart');
        if (!ctx) return;

        comparisonCharts.quality = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Optimality', 'Speed', 'Risk Adherence', 'Return Achievement', 'Scalability'],
                datasets: [
                    {
                        label: 'Dynamic Programming',
                        data: [100, comparison.dp.executionTime < comparison.greedy.executionTime ? 75 : 50, 95, 90, 70],
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Greedy Algorithm',
                        data: [75, comparison.greedy.executionTime < comparison.dp.executionTime ? 100 : 80, 80, 85, 95],
                        borderColor: '#0066ff',
                        backgroundColor: 'rgba(0, 102, 255, 0.2)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } }
                },
                scales: {
                    r: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(0, 212, 255, 0.1)' }
                    }
                }
            }
        });
    };

    const setupCaseStudy = () => {
        const assets = InvestmentOptimizer.getMockAssets();
        const budget = 100000;
        const riskThreshold = 25;

        const dpResult = InvestmentOptimizer.optimizeDP(assets, budget, riskThreshold);
        const greedyResult = InvestmentOptimizer.optimizeGreedy(assets, budget, riskThreshold);

        // Display input parameters
        const caseInput = document.getElementById('caseInput');
        caseInput.innerHTML = `
            <div class="input-item">
                <span class="input-label">Budget</span>
                <span class="input-value">$${budget.toLocaleString()}</span>
            </div>
            <div class="input-item">
                <span class="input-label">Risk Threshold</span>
                <span class="input-value">${riskThreshold}%</span>
            </div>
            <div class="input-item">
                <span class="input-label">Available Assets</span>
                <span class="input-value">${assets.length}</span>
            </div>
        `;

        // Display results
        const caseResults = document.getElementById('caseResults');
        caseResults.innerHTML = `
            <div class="result-item">
                <span class="result-label">DP - Selected Assets</span>
                <span class="result-value">${dpResult.selectedAssets.length}</span>
            </div>
            <div class="result-item">
                <span class="result-label">DP - Total Return</span>
                <span class="result-value">$${dpResult.totalReturn.toFixed(0)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Greedy - Selected Assets</span>
                <span class="result-value">${greedyResult.selectedAssets.length}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Greedy - Total Return</span>
                <span class="result-value">$${greedyResult.totalReturn.toFixed(0)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Performance Edge</span>
                <span class="result-value">${dpResult.optimizationScore > greedyResult.optimizationScore ? 'DP ✓' : 'Greedy ✓'}</span>
            </div>
        `;
    };

    const setupComplexityCharts = () => {
        renderTimeComplexityChart();
        renderSpaceComplexityChart();
    };

    const renderTimeComplexityChart = () => {
        const ctx = document.getElementById('timeComplexityChart');
        if (!ctx) return;

        const n = [5, 10, 15, 20, 25, 30];
        const dpTime = n.map(x => x * x * 0.5);
        const greedyTime = n.map(x => x * Math.log2(x) * 0.8);

        comparisonCharts.timeComplexity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: n.map(x => `${x} items`),
                datasets: [
                    {
                        label: 'DP: O(n × W)',
                        data: dpTime,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Greedy: O(n log n)',
                        data: greedyTime,
                        borderColor: '#0066ff',
                        backgroundColor: 'rgba(0, 102, 255, 0.1)',
                        tension: 0.4
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
                        title: { display: true, text: 'Time (ms)' },
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

    const renderSpaceComplexityChart = () => {
        const ctx = document.getElementById('spaceComplexityChart');
        if (!ctx) return;

        const n = [5, 10, 15, 20, 25, 30];
        const dpSpace = n.map(x => x * 100);
        const greedySpace = n.map(x => x * 4);

        comparisonCharts.spaceComplexity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: n.map(x => `${x} items`),
                datasets: [
                    {
                        label: 'DP: O(n × W)',
                        data: dpSpace,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Greedy: O(n)',
                        data: greedySpace,
                        borderColor: '#51cf66',
                        backgroundColor: 'rgba(81, 207, 102, 0.1)',
                        tension: 0.4
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
                        title: { display: true, text: 'Space (units)' },
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

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', AlgorithmsPageManager.init);
