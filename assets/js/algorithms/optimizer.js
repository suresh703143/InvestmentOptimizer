/* ============================================
   INVESTMENT OPTIMIZATION ALGORITHMS
   Improved DP: 1D knapsack with risk checking
   ============================================ */

const InvestmentOptimizer = (() => {
    // Mock asset data
    const mockAssets = [
        { id: 1, symbol: 'AAPL', name: 'Apple Inc.', price: 180.50, change: 2.5, risk: 12, expectedReturn: 15, category: 'tech' },
        { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', price: 420.75, change: 1.8, risk: 10, expectedReturn: 14, category: 'tech' },
        { id: 3, symbol: 'JPM', name: 'JPMorgan Chase', price: 150.20, change: 0.5, risk: 8, expectedReturn: 10, category: 'finance' },
        { id: 4, symbol: 'JNJ', name: 'Johnson & Johnson', price: 160.30, change: 1.2, risk: 7, expectedReturn: 9, category: 'healthcare' },
        { id: 5, symbol: 'XOM', name: 'Exxon Mobil', price: 110.15, change: -1.5, risk: 15, expectedReturn: 12, category: 'energy' },
        { id: 6, symbol: 'PG', name: 'Procter & Gamble', price: 165.40, change: 0.8, risk: 6, expectedReturn: 8, category: 'consumer' },
        { id: 7, symbol: 'NVDA', name: 'NVIDIA Corp.', price: 850.00, change: 5.2, risk: 25, expectedReturn: 35, category: 'tech' },
        { id: 8, symbol: 'TSM', name: 'Taiwan Semiconductor', price: 120.50, change: 3.5, risk: 18, expectedReturn: 22, category: 'tech' },
        { id: 9, symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 385.20, change: 1.1, risk: 5, expectedReturn: 7, category: 'finance' },
        { id: 10, symbol: 'META', name: 'Meta Platforms', price: 475.85, change: 4.2, risk: 22, expectedReturn: 28, category: 'tech' },
    ];

    // Helper to deep-copy mock assets for safety
    const getMockAssets = () => mockAssets.map(a => ({ ...a }));

    /**
     * Dynamic Programming (1D knapsack style) with risk constraint.
     * This version keeps, for each budget value, the best known solution object
     * { value: totalExpectedReturn, risk: totalRisk, items: [...] } and updates
     * from high->low to avoid reusing an item multiple times.
     */
    const optimizeDP = (assets, budget, riskThreshold) => {
        const startTime = performance.now();
        const steps = [];

        // Work in integer dollars to keep table size reasonable.
        const capacity = Math.floor(budget);

        // Initialize DP array: index = dollars spent, value = {value, risk, items}
        const dp = Array(capacity + 1).fill(null).map(() => ({ value: 0, risk: 0, items: [] }));

        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            const cost = Math.floor(asset.price);

            // iterate backwards to prevent reuse
            for (let w = capacity; w >= cost; w--) {
                const prev = dp[w - cost];
                if (!prev) continue;

                const newRisk = prev.risk + asset.risk;
                if (newRisk > riskThreshold) continue; // risk constraint

                const newValue = prev.value + asset.expectedReturn;
                if (newValue > dp[w].value) {
                    dp[w] = {
                        value: newValue,
                        risk: newRisk,
                        items: prev.items.concat(asset)
                    };
                }
            }

            steps.push({ step: i + 1, currentAsset: asset.symbol });
        }

        // Find best entry across all capacities
        let best = { value: 0, risk: 0, items: [] };
        for (let w = 0; w <= capacity; w++) {
            if (dp[w].value > best.value) best = dp[w];
        }

        const endTime = performance.now();
        const executionTime = endTime - startTime;

        const selectedAssets = best.items;

        return {
            algorithm: 'Dynamic Programming',
            selectedAssets,
            totalInvestment: selectedAssets.reduce((sum, a) => sum + a.price, 0),
            totalReturn: selectedAssets.reduce((sum, a) => sum + (a.price * a.expectedReturn / 100), 0),
            totalRisk: selectedAssets.reduce((sum, a) => sum + a.risk, 0),
            optimizationScore: calculateScore(selectedAssets, budget, riskThreshold),
            executionTime,
            steps,
            dpTable: dp
        };
    };

    /**
     * Greedy Algorithm Solution
     * Selects assets based on best return-to-risk ratio
     */
    const optimizeGreedy = (assets, budget, riskThreshold) => {
        const startTime = performance.now();
        const steps = [];

        const sortedAssets = [...assets].sort((a, b) => (b.expectedReturn / b.risk) - (a.expectedReturn / a.risk));

        const selectedAssets = [];
        let remainingBudget = budget;
        let remainingRisk = riskThreshold;

        for (const asset of sortedAssets) {
            if (asset.price <= remainingBudget && asset.risk <= remainingRisk) {
                selectedAssets.push(asset);
                remainingBudget -= asset.price;
                remainingRisk -= asset.risk;

                steps.push({
                    step: steps.length + 1,
                    selectedAsset: asset.symbol,
                    ratio: (asset.expectedReturn / asset.risk).toFixed(2),
                    remainingBudget
                });
            }
        }

        const endTime = performance.now();
        const executionTime = endTime - startTime;

        return {
            algorithm: 'Greedy',
            selectedAssets,
            totalInvestment: selectedAssets.reduce((sum, a) => sum + a.price, 0),
            totalReturn: selectedAssets.reduce((sum, a) => sum + (a.price * a.expectedReturn / 100), 0),
            totalRisk: selectedAssets.reduce((sum, a) => sum + a.risk, 0),
            optimizationScore: calculateScore(selectedAssets, budget, riskThreshold),
            executionTime,
            steps
        };
    };

    const calculateScore = (selectedAssets, budget, riskThreshold) => {
        if (!selectedAssets || selectedAssets.length === 0) return 0;

        const avgReturn = selectedAssets.reduce((s, a) => s + a.expectedReturn, 0) / selectedAssets.length;
        const riskUsed = selectedAssets.reduce((s, a) => s + a.risk, 0);
        const budgetUtilization = selectedAssets.reduce((s, a) => s + a.price, 0) / (budget || 1);

        const riskScore = Math.max(0, (riskThreshold - riskUsed) / (riskThreshold || 1) * 100);
        const returnScore = Math.min(100, avgReturn / 2 * 100);
        const utilizationScore = Math.min(100, budgetUtilization * 100);

        return Math.round((returnScore + riskScore + utilizationScore) / 3);
    };

    return {
        getMockAssets,
        optimizeDP,
        optimizeGreedy,
        compareAlgorithms: (assets, budget, riskThreshold) => {
            const dpResult = optimizeDP(assets, budget, riskThreshold);
            const greedyResult = optimizeGreedy(assets, budget, riskThreshold);

            return {
                dp: dpResult,
                greedy: greedyResult,
                comparison: {
                    dpFaster: dpResult.executionTime < greedyResult.executionTime,
                    speedDifference: Math.abs(dpResult.executionTime - greedyResult.executionTime),
                    dpBetter: dpResult.optimizationScore > greedyResult.optimizationScore,
                    scoreDifference: Math.abs(dpResult.optimizationScore - greedyResult.optimizationScore),
                    dpReturnBetter: dpResult.totalReturn > greedyResult.totalReturn,
                    returnDifference: Math.abs(dpResult.totalReturn - greedyResult.totalReturn),
                    dpRiskBetter: dpResult.totalRisk <= greedyResult.totalRisk,
                    riskDifference: Math.abs(dpResult.totalRisk - greedyResult.totalRisk)
                }
            };
        }
    };
})();

// Export for Node.js (CommonJS) so tests can require this module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InvestmentOptimizer;
}
