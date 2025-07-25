# 💹 Stock & Crypto Portfolio Tracker

A real-time, responsive dashboard built with React, Recharts & Tailwind CSS to help users monitor their stock and cryptocurrency investments with live price updates, alerts, and visual analytics.

---

## 🚀 Features

- **Live Market Data**  
  - 🪙 Crypto: Integrated with [CoinGecko API](https://www.coingecko.com/en/api/documentation) to fetch real-time prices, market caps, and 24h changes.  
  - 📈 Stocks: Uses [Alpha Vantage API](https://www.alphavantage.co/documentation/) (demo mode) to retrieve live price and change data.

- **Portfolio Management**  
  - Add, remove, and view holdings with total value, gain/loss, and dynamic charts.  
  - Persists data in `localStorage` (can be swapped with Firebase or your backend).  

- **Visual Analytics**  
  - Pie Chart: Portfolio asset allocation.  
  - Line Chart: Historical portfolio performance over selectable timeframes (7d, 30d, 3m, 1y).  
  - Bar Chart: Asset-level 24-hour performance.  
  - Quick Stats: Total value, 24h change, asset counts, active alerts.

- **Alerts & Notifications**  
  - Custom price alerts trigger notifications within the UI.  
  - Alerts panel with light/dark mode toggle.

- **Responsive & Stylish UI**  
  - Built using React + Tailwind CSS with Lucide icons for an intuitive and engaging UX.

- **Auto‑refresh**  
  - Data refreshes every 5 minutes; manual refresh available via toolbar button.

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Recharts, Lucide-React
- **State & API:** React hooks (`useState`, `useEffect`, `useCallback`), Axios/fetch
- **APIs:** CoinGecko, Alpha Vantage (demo mode)
- **Storage:** `localStorage` (for persisted portfolio and alerts)

---

## 📦 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/Bishwajeetpatel/Stock-Crypto-Portfolio-Tracker.git
   cd Stock-Crypto-Portfolio-Tracker
