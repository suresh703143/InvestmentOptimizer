// Simple test harness for InvestmentOptimizer
const path = require('path');
const optimizerPath = path.join(__dirname, '..', 'assets', 'js', 'algorithms', 'optimizer.js');

// Load optimizer.js in Node environment
const InvestmentOptimizer = require(optimizerPath);

const assets = InvestmentOptimizer.getMockAssets();
const budget = 50000;
const riskThreshold = 20;

console.log('Running optimizer tests...');

const dp = InvestmentOptimizer.optimizeDP(assets, budget, riskThreshold);
const greedy = InvestmentOptimizer.optimizeGreedy(assets, budget, riskThreshold);

function assert(cond, msg) {
  if (!cond) {
    console.error('ASSERTION FAILED:', msg);
    process.exitCode = 1;
  }
}

console.log('DP selected', dp.selectedAssets.map(a=>a.symbol));
console.log('Greedy selected', greedy.selectedAssets.map(a=>a.symbol));

assert(dp.totalInvestment <= budget + 1e-6, 'DP totalInvestment should not exceed budget');
assert(greedy.totalInvestment <= budget + 1e-6, 'Greedy totalInvestment should not exceed budget');
assert(dp.totalRisk <= riskThreshold + 1e-6, 'DP totalRisk should respect threshold');
assert(greedy.totalRisk <= riskThreshold + 1e-6, 'Greedy totalRisk should respect threshold');
assert(dp.optimizationScore >= 0 && dp.optimizationScore <= 100, 'DP score in range');
assert(greedy.optimizationScore >= 0 && greedy.optimizationScore <= 100, 'Greedy score in range');

if (process.exitCode === 0 || typeof process.exitCode === 'undefined') {
  console.log('All optimizer tests passed.');
} else {
  console.error('Some tests failed.');
}

// Exit with the set exit code
process.exit(process.exitCode || 0);
