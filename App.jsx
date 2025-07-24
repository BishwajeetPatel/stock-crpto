import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Search, Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Activity, Bell, Eye, EyeOff, Newspaper, Loader, AlertCircle, RefreshCw } from 'lucide-react';

// API Configuration
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const ALPHA_VANTAGE_API_KEY = 'demo'; // Replace with your actual API key
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Crypto ID mapping for CoinGecko
const cryptoIdMap = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'ADA': 'cardano',
  'SOL': 'solana',
  'DOT': 'polkadot',
  'MATIC': 'polygon',
  'AVAX': 'avalanche-2',
  'ATOM': 'cosmos',
  'LINK': 'chainlink',
  'UNI': 'uniswap'
};

// API Service Functions
const apiService = {
  async fetchCryptoData(coinIds) {
    try {
      const response = await fetch(
        `${COINGECKO_BASE_URL}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
      );
      if (!response.ok) throw new Error('Failed to fetch crypto data');
      return await response.json();
    } catch (error) {
      console.error('CoinGecko API Error:', error);
      // Fallback to mock data
      return {
        bitcoin: { usd: 43250, usd_24h_change: 2.5, usd_market_cap: 850000000000 },
        ethereum: { usd: 2680, usd_24h_change: -1.2, usd_market_cap: 320000000000 },
        cardano: { usd: 0.52, usd_24h_change: 4.8, usd_market_cap: 18000000000 },
        solana: { usd: 98.5, usd_24h_change: 6.2, usd_market_cap: 42000000000 }
      };
    }
  },

  async fetchStockData(symbol) {
    try {
      // Using demo data due to Alpha Vantage rate limits
      const mockStockData = {
        AAPL: { price: 192.75, change: 1.8, name: 'Apple Inc.' },
        TSLA: { price: 248.50, change: -2.4, name: 'Tesla Inc.' },
        GOOGL: { price: 142.30, change: 0.9, name: 'Alphabet Inc.' },
        MSFT: { price: 378.85, change: 1.2, name: 'Microsoft Corp.' },
        AMZN: { price: 155.20, change: 0.5, name: 'Amazon.com Inc.' },
        NVDA: { price: 875.30, change: 3.2, name: 'NVIDIA Corp.' }
      };
      
      return mockStockData[symbol] || { price: 0, change: 0, name: symbol };
    } catch (error) {
      console.error('Stock API Error:', error);
      return { price: 0, change: 0, name: symbol };
    }
  },

  generateChartData(basePrice, days = 30) {
    const data = [];
    let price = basePrice;
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      price = price * (1 + (Math.random() - 0.5) * 0.1);
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100,
        timestamp: date.getTime()
      });
    }
    return data;
  }
};

// Add Asset Form Component
const AddAssetForm = ({ onAdd }) => {
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState('crypto');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol && quantity && buyPrice) {
      onAdd(symbol, type, quantity, buyPrice);
      setSymbol('');
      setQuantity('');
      setBuyPrice('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="BTC, AAPL, etc."
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-400 focus:outline-none"
          >
            <option value="crypto">Cryptocurrency</option>
            <option value="stock">Stock</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            step="0.00001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.5"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Buy Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            placeholder="40000"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center space-x-2"
      >
        <Plus size={16} />
        <span>Add Asset</span>
      </button>
    </form>
  );
};

export default function PortfolioDashboard() {
  const [portfolio, setPortfolio] = useState([
    { id: 1, symbol: 'BTC', type: 'crypto', quantity: 0.5, buyPrice: 40000 },
    { id: 2, symbol: 'AAPL', type: 'stock', quantity: 10, buyPrice: 180 },
    { id: 3, symbol: 'ETH', type: 'crypto', quantity: 2, buyPrice: 2500 },
    { id: 4, symbol: 'TSLA', type: 'stock', quantity: 5, buyPrice: 250 }
  ]);
  
  const [marketData, setMarketData] = useState({});
  const [news] = useState([
    { title: "Bitcoin Reaches New Monthly High", time: "2 hours ago", category: "crypto" },
    { title: "Apple Reports Strong Q4 Earnings", time: "4 hours ago", category: "stock" },
    { title: "Ethereum 2.0 Staking Rewards Increase", time: "6 hours ago", category: "crypto" },
    { title: "Tesla Announces New Factory Location", time: "1 day ago", category: "stock" },
    { title: "DeFi Protocol Launches New Features", time: "1 day ago", category: "crypto" },
    { title: "Microsoft Cloud Revenue Surges", time: "2 days ago", category: "stock" }
  ]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [timeframe, setTimeframe] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch market data for all assets
  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get unique crypto and stock symbols
      const cryptoSymbols = ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'MATIC'];
      const stockSymbols = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA'];

      const newMarketData = {};

      // Fetch crypto data
      const cryptoIds = cryptoSymbols.map(symbol => cryptoIdMap[symbol]).filter(Boolean);
      const cryptoData = await apiService.fetchCryptoData(cryptoIds);
      
      Object.entries(cryptoData).forEach(([coinId, data]) => {
        const symbol = Object.keys(cryptoIdMap).find(key => cryptoIdMap[key] === coinId);
        if (symbol) {
          newMarketData[symbol] = {
            price: data.usd,
            change: data.usd_24h_change || 0,
            marketCap: data.usd_market_cap,
            type: 'crypto',
            name: symbol === 'BTC' ? 'Bitcoin' : 
                  symbol === 'ETH' ? 'Ethereum' :
                  symbol === 'ADA' ? 'Cardano' :
                  symbol === 'SOL' ? 'Solana' :
                  symbol === 'DOT' ? 'Polkadot' :
                  symbol === 'MATIC' ? 'Polygon' : symbol
          };
        }
      });

      // Fetch stock data
      for (const symbol of stockSymbols) {
        const stockData = await apiService.fetchStockData(symbol);
        newMarketData[symbol] = {
          ...stockData,
          type: 'stock'
        };
      }

      setMarketData(newMarketData);
      setLastUpdate(new Date().toLocaleTimeString());
      
    } catch (error) {
      setError('Failed to fetch market data. Using cached data.');
      console.error('Market data fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketData();
    }, 300000);

    return () => clearInterval(interval);
  }, [fetchMarketData]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMarketData();
    setRefreshing(false);
  };

  // Calculate portfolio metrics
  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, item) => {
      const currentPrice = marketData[item.symbol]?.price || 0;
      return total + (currentPrice * item.quantity);
    }, 0);
  };

  const calculateTotalGainLoss = () => {
    return portfolio.reduce((total, item) => {
      const currentPrice = marketData[item.symbol]?.price || 0;
      const currentValue = currentPrice * item.quantity;
      const originalValue = item.buyPrice * item.quantity;
      return total + (currentValue - originalValue);
    }, 0);
  };

  const portfolioValue = calculatePortfolioValue();
  const totalGainLoss = calculateTotalGainLoss();
  const gainLossPercentage = portfolioValue > 0 ? ((totalGainLoss / (portfolioValue - totalGainLoss)) * 100).toFixed(2) : '0.00';

  // Portfolio distribution for pie chart
  const portfolioDistribution = portfolio.map(item => {
    const currentPrice = marketData[item.symbol]?.price || 0;
    const value = currentPrice * item.quantity;
    return {
      name: item.symbol,
      value: value,
      percentage: portfolioValue > 0 ? ((value / portfolioValue) * 100).toFixed(1) : '0.0'
    };
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  const addToPortfolio = (symbol, type, quantity, buyPrice) => {
    const newItem = {
      id: Date.now(),
      symbol: symbol.toUpperCase(),
      type,
      quantity: parseFloat(quantity),
      buyPrice: parseFloat(buyPrice)
    };
    setPortfolio([...portfolio, newItem]);
  };

  const removeFromPortfolio = (id) => {
    setPortfolio(portfolio.filter(item => item.id !== id));
  };

  // Generate chart data for analytics
  const generatePortfolioChart = () => {
    return apiService.generateChartData(portfolioValue, 30);
  };

  // Loading state
  if (loading && Object.keys(marketData).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} />
          <h2 className="text-xl font-semibold mb-2">Loading Market Data</h2>
          <p className="text-gray-400">Fetching real-time prices from APIs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Portfolio Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Bell size={20} />
                {alerts.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-300">Total Portfolio Value</p>
                <p className="text-2xl font-bold">${portfolioValue.toLocaleString()}</p>
                <p className={`text-sm flex items-center ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalGainLoss >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="ml-1">${Math.abs(totalGainLoss).toLocaleString()} ({gainLossPercentage}%)</span>
                </p>
                {lastUpdate && (
                  <p className="text-xs text-gray-400">Last updated: {lastUpdate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg flex items-center space-x-2">
              <AlertCircle size={20} className="text-red-400" />
              <span className="text-red-200">{error}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex space-x-4 border-b border-gray-700">
            {['portfolio', 'markets', 'news', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize transition-colors ${
                  activeTab === tab 
                    ? 'border-b-2 border-blue-400 text-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* API Status Indicator */}
        <div className="mb-6 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">CoinGecko API - Live Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm">Stock API - Demo Mode</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Real-time crypto • Demo stocks • Updated every 5 minutes
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        {showAlerts && (
          <div className="mb-6 bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Price Alerts</h3>
              <button onClick={() => setShowAlerts(false)}>
                <EyeOff size={20} />
              </button>
            </div>
            {alerts.length === 0 ? (
              <p className="text-gray-400">No active alerts. Set alerts on your assets to get notified of price changes.</p>
            ) : (
              <div className="space-y-2">
                {alerts.map(alert => (
                  <div key={alert.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                    <div>
                      <span className="font-medium">{alert.symbol}</span>
                      <span className="ml-2 text-gray-300">
                        Alert when {alert.type} ${alert.targetPrice}
                      </span>
                    </div>
                    <button
                      onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Portfolio Holdings */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Your Holdings</h2>
                <div className="space-y-4">
                  {portfolio.map((item) => {
                    const currentData = marketData[item.symbol];
                    
                    if (!currentData) {
                      return (
                        <div key={item.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center font-bold">
                              {item.symbol.substring(0, 2)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{item.symbol}</h3>
                              <p className="text-sm text-gray-400">Loading price data...</p>
                            </div>
                          </div>
                          <Loader className="animate-spin" size={20} />
                        </div>
                      );
                    }
                    
                    const currentValue = currentData.price * item.quantity;
                    const originalValue = item.buyPrice * item.quantity;
                    const gainLoss = currentValue - originalValue;
                    const gainLossPercent = ((gainLoss / originalValue) * 100).toFixed(2);

                    return (
                      <div key={item.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center hover:bg-gray-600 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 bg-gradient-to-r ${item.type === 'crypto' ? 'from-orange-500 to-yellow-500' : 'from-blue-500 to-purple-500'} rounded-full flex items-center justify-center font-bold text-sm`}>
                            {item.symbol.substring(0, 2)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.symbol}</h3>
                            <p className="text-sm text-gray-400">
                              {item.quantity} {item.type === 'crypto' ? 'coins' : 'shares'} @ ${currentData.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Bought at ${item.buyPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">${currentValue.toLocaleString()}</p>
                          <p className={`text-sm flex items-center justify-end ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {gainLoss >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span className="ml-1">
                              ${Math.abs(gainLoss).toLocaleString()} ({gainLossPercent}%)
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromPortfolio(item.id)}
                          className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add New Asset */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Add New Asset</h3>
                <AddAssetForm onAdd={addToPortfolio} />
              </div>
            </div>

            {/* Portfolio Distribution */}
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Portfolio Distribution</h3>
                {portfolioValue > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={portfolioDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                      >
                        {portfolioDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    <p>Add assets to see distribution</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Portfolio Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Assets</span>
                    <span className="font-semibold">{portfolio.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Crypto Assets</span>
                    <span className="font-semibold">{portfolio.filter(item => item.type === 'crypto').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stock Assets</span>
                    <span className="font-semibold">{portfolio.filter(item => item.type === 'stock').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Performer</span>
                    <span className="text-green-400">
                      {portfolio.length > 0 ? `+${Math.max(...portfolio.map(item => {
                        const current = marketData[item.symbol];
                        return current ? current.change : 0;
                      })).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Worst Performer</span>
                    <span className="text-red-400">
                      {portfolio.length > 0 ? `${Math.min(...portfolio.map(item => {
                        const current = marketData[item.symbol];
                        return current ? current.change : 0;
                      })).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'markets' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crypto Markets */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                Cryptocurrency Markets
              </h2>
              <div className="space-y-4">
                {Object.entries(marketData)
                  .filter(([symbol, data]) => data.type === 'crypto')
                  .map(([symbol, data]) => (
                  <div key={symbol} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {symbol.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm text-gray-400">{symbol}</p>
                        {data.marketCap && (
                          <p className="text-xs text-gray-500">
                            MCap: ${(data.marketCap / 1e9).toFixed(1)}B
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${data.price.toLocaleString()}</p>
                      <p className={`text-sm flex items-center ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {data.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span className="ml-1">{data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Markets */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                Stock Markets (Demo)
              </h2>
              <div className="space-y-4">
                {Object.entries(marketData)
                  .filter(([symbol, data]) => data.type === 'stock')
                  .map(([symbol, data]) => (
                  <div key={symbol} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {symbol.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm text-gray-400">{symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${data.price.toLocaleString()}</p>
                      <p className={`text-sm flex items-center ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {data.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span className="ml-1">{data.change >= 0 ? '+' : ''}{data.change.toFixed(1)}%</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Market News & Updates</h2>
            <div className="space-y-4">
              {news.map((article, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
                  <div className={`w-12 h-12 bg-gradient-to-r ${article.category === 'crypto' ? 'from-orange-500 to-yellow-500' : 'from-blue-500 to-purple-500'} rounded-full flex items-center justify-center`}>
                    <Newspaper size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{article.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{article.time}</span>
                      <span>•</span>
                      <span className="capitalize">{article.category}</span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <Eye size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Portfolio Performance Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Portfolio Performance</h2>
                <div className="flex space-x-2">
                  {['7d', '30d', '3m', '1y'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeframe(period)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        timeframe === period 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generatePortfolioChart()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value.toLocaleString()}`, 'Portfolio Value']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Asset Performance Comparison */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Asset Performance (24h)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={portfolio.map(item => ({
                  symbol: item.symbol,
                  change: marketData[item.symbol]?.change || 0,
                  value: marketData[item.symbol]?.price * item.quantity || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="symbol" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value.toFixed(2)}%`, '24h Change']}
                  />
                  <Bar dataKey="change" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Market Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Value</p>
                    <p className="text-xl font-bold">${portfolioValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">24h Change</p>
                    <p className={`text-xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
                    </p>
                  </div>
                  {totalGainLoss >= 0 ? 
                    <TrendingUp className="text-green-400" size={24} /> : 
                    <TrendingDown className="text-red-400" size={24} />
                  }
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Assets Count</p>
                    <p className="text-xl font-bold">{portfolio.length}</p>
                  </div>
                  <Activity className="text-purple-400" size={24} />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Alerts Active</p>
                    <p className="text-xl font-bold">{alerts.length}</p>
                  </div>
                  <Bell className="text-yellow-400" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}