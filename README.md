# Smart-Grow Investment Optimization Framework

## 🚀 Project Overview

**Smart-Grow** is a modern, professional, finance-tech themed web application that demonstrates investment portfolio optimization using Dynamic Programming and Greedy Algorithms. The application is designed as an interactive educational tool for understanding algorithm optimization and asset selection under risk constraints.

## ✨ Key Features

### 1. **Modern, Responsive Design**
- Fully responsive across all devices (desktop, tablet, mobile)
- Dark mode toggle with persistent theme storage
- Smooth animations and transitions
- Professional finance dashboard aesthetic
- Particle effects and interactive backgrounds

### 2. **Core Modules**

#### Home Page
- Hero section with animated finance visualization
- Feature showcase highlighting key capabilities
- How-it-works section with step-by-step guide
- Statistics and performance metrics
- Call-to-action buttons for quick navigation

#### Optimization Dashboard
- **Sidebar Configuration**: Investment amount, risk threshold, expected return sliders
- **Asset Selection**: Browse and select from 10 mock assets
- **Real-time DP Table Visualization**: Watch the algorithm solve in real-time
- **Results Display**: Selected assets, portfolio summary, and efficiency scores
- **Algorithm Comparison**: Side-by-side performance metrics

#### Market Data Section
- **Real-time Asset Grid**: View all available investments
- **Advanced Filters**: Search by symbol, filter by category, price range, and volatility
- **Trending Assets Carousel**: Hot picks displayed dynamically
- **Asset Details Modal**: Comprehensive information with historical charts
- **Market Insights**: Top performers, most volatile, best risk-adjusted assets
- **Return vs Risk Visualization**: Scatter plot and correlation analysis

#### Algorithm Visualization Page
- **Dynamic Programming Visualization**:
  - Step-by-step DP table construction animation
  - Backtracking visualization showing optimal path
  - Performance metrics and timing information
  - Complexity analysis: O(n × W) time, O(n × W) space

- **Greedy Algorithm Visualization**:
  - Sequential asset selection animation
  - Return-to-risk ratio calculation
  - Step-by-step process with real-time statistics
  - Complexity analysis: O(n log n) time, O(n) space

- **Algorithm Comparison**:
  - Performance metrics comparison
  - Solution quality radar chart
  - Use case recommendations
  - Complexity analysis charts

#### Results & Analytics Page
- **Executive Summary Cards**: Investment, return, risk, efficiency score
- **Portfolio Composition Charts**: Allocation and risk distribution
- **Detailed Assets Table**: Holdings with allocation percentages
- **Performance Analytics**: Return trends, distribution analysis
- **Risk Metrics**: VaR, Sharpe Ratio, Beta, Maximum Drawdown
- **Algorithm Comparison**: Efficiency and performance analysis
- **Scenario Analysis**: Bull, bear, stable, and crisis market scenarios
- **Backtesting Results**: Historical performance analysis
- **Export Options**: PDF, CSV, Email, Share functionality

## 🔧 Technical Stack

### Frontend Technologies
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with CSS variables and Grid/Flexbox
- **Vanilla JavaScript**: No external framework dependencies (except Chart.js)
- **Chart.js**: Interactive data visualizations
- **HTML2PDF**: PDF export functionality

### Algorithms Implemented

#### Dynamic Programming (Knapsack Problem)
```
Time Complexity: O(n × W)
Space Complexity: O(n × W)
Guarantees optimal solution
```

#### Greedy Algorithm
```
Time Complexity: O(n log n)
Space Complexity: O(n)
Fast approximation
```

## 📁 Project Structure

```
smart-grow-investment-optimizer/
├── index.html                          # Home page
├── dashboard.html                      # Optimization dashboard
├── market-data.html                    # Market data & analysis
├── algorithms.html                     # Algorithm visualization
├── results.html                        # Results & analytics
│
├── assets/
│   ├── css/
│   │   ├── styles.css                 # Global styles & theme
│   │   ├── home.css                   # Home page styles
│   │   ├── dashboard.css              # Dashboard styles
│   │   ├── market-data.css            # Market data styles
│   │   ├── algorithms.css             # Algorithm page styles
│   │   └── results.css                # Results page styles
│   │
│   └── js/
│       ├── theme.js                   # Dark mode & theme toggle
│       ├── home.js                    # Home page functionality
│       ├── dashboard.js               # Dashboard functionality
│       ├── market-data.js             # Market data functionality
│       ├── results.js                 # Results page functionality
│       ├── algorithms-page.js         # Algorithm page functionality
│       │
│       ├── algorithms/
│       │   └── optimizer.js           # DP & Greedy algorithms
│       │
│       └── visualizations/
│           ├── dp-table.js            # DP table visualization
│           └── algorithm-animator.js  # Algorithm animations
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Cyan (#00d4ff) - Main accent color
- **Secondary**: Deep Blue (#0066ff) - Secondary accent
- **Success**: Green (#51cf66) - Positive indicators
- **Danger**: Red (#ff6b6b) - Negative indicators
- **Warning**: Orange (#ffa94d) - Caution indicators

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana
- **Headlines**: Bold, large sizes with gradient effects
- **Body**: Clean, readable with good contrast ratios

### Animations
- Smooth transitions (150ms-500ms)
- Fade-in effects on scroll
- Hover interactions with transform effects
- Particle effects on background
- Real-time algorithm animations

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools required
- No backend server required

### Installation

1. **Extract the project files**
```bash
unzip smart-grow-investment-optimizer.zip
cd smart-grow-investment-optimizer
```

2. **Open in browser**
```bash
# Simply open index.html in your browser
# Or use a local server for better performance
python -m http.server 8000
# Then visit http://localhost:8000
```

## 📊 Mock Data

The application comes with 10 sample assets:
- **AAPL**: Apple Inc. (Tech)
- **MSFT**: Microsoft Corp. (Tech)
- **JPM**: JPMorgan Chase (Finance)
- **JNJ**: Johnson & Johnson (Healthcare)
- **XOM**: Exxon Mobil (Energy)
- **PG**: Procter & Gamble (Consumer)
- **NVDA**: NVIDIA Corp. (Tech)
- **TSM**: Taiwan Semiconductor (Tech)
- **BRK.B**: Berkshire Hathaway (Finance)
- **META**: Meta Platforms (Tech)

## 🎯 Usage Guide

### 1. **Home Page**
- Explore the project overview
- Learn about key features
- Navigate to specific sections

### 2. **Dashboard**
- Set investment parameters (budget, risk, target return)
- Select assets from the grid
- Click "Optimize Portfolio" to run algorithms
- View results and algorithm comparison

### 3. **Market Data**
- Browse available investments
- Use filters to narrow down choices
- Click "View" on any asset for detailed analysis
- Analyze market trends and sentiment

### 4. **Algorithms**
- Switch between DP and Greedy visualizations
- Play algorithm animations to see step-by-step process
- Compare performance metrics
- Study complexity analysis

### 5. **Results**
- Review portfolio composition
- Analyze risk metrics
- Compare algorithm performance
- Scenario analysis
- Export results as PDF

## 🔄 Algorithm Comparison

| Aspect | Dynamic Programming | Greedy Algorithm |
|--------|-------------------|-----------------|
| **Optimality** | ✅ Guaranteed Optimal | ⚠️ Approximation |
| **Speed** | Slower | ⚡ Faster |
| **Time Complexity** | O(n × W) | O(n log n) |
| **Space Complexity** | O(n × W) | O(n) |
| **Best Use** | Accuracy-critical | Quick recommendations |
| **Scalability** | Limited | Excellent |

## 🎓 Educational Value

This project demonstrates:
1. **Algorithm Design**: DP vs Greedy trade-offs
2. **Optimization Problems**: Constrained optimization
3. **Time-Space Complexity**: Understanding Big-O notation
4. **Web Development**: Modern responsive design
5. **Data Visualization**: Interactive charts and animations
6. **Finance Concepts**: Portfolio optimization, risk management

## 🚀 Future Enhancements

- [ ] Backend API integration for real market data
- [ ] User authentication and portfolio saving
- [ ] Advanced financial metrics (Sharpe ratio, Sortino ratio)
- [ ] Machine learning recommendations
- [ ] Multi-language support
- [ ] Real-time stock price updates
- [ ] Custom portfolio templates
- [ ] Social sharing features

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Created as a comprehensive capstone project demonstration of investment optimization using advanced algorithms.

## 📞 Support & Documentation

For implementation details, algorithm explanations, or feature requests, refer to inline code comments and comprehensive function documentation throughout the codebase.

---

## 🌟 Highlights

- **Zero Dependencies**: Pure vanilla JavaScript + Chart.js
- **Production Ready**: Clean, optimized, well-structured code
- **Fully Responsive**: Works seamlessly on all screen sizes
- **Accessible**: Semantic HTML, good color contrast
- **Performance**: Optimized animations, efficient algorithms
- **Educational**: Learn algorithms while using a real application

Enjoy exploring Smart-Grow! 🚀📈

## Run Locally (quick)

If you want to run the app locally, here are a few simple options.

- Using Python's built-in server (no install required):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

- Using Node (recommended for convenience):

```bash
npx http-server -c-1 -p 8000
# or, if you prefer npm script:
npm run start
```

Open `index.html` or visit `http://localhost:8000` in your browser after starting the server.
