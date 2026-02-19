import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { fetchInitialPrices, simulateTick } from "../utils/StockDataService";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid
} from "recharts";

// ---------- Stock Market Game (Real-Time Hybrid) ----------
// ---------- Stock Market Game (Real-Time Hybrid) ----------
export default function StockMarketGame() {
    const { user, transact, trackDailyAction, grantTradingLicense } = useContext(UserContext);

    // Auto-mark "Review Portfolio" habit on visit
    useEffect(() => {
        trackDailyAction('reviewPortfolio');
    }, []);

    // Stocks State
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [portfolio, setPortfolio] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const COMPANY_NAMES = {
        "RELIANCE": "Reliance Industries",
        "TCS": "Tata Consultancy Services",
        "INFY": "Infosys",
        "HDFC": "HDFC Corp",
        "ICICI": "ICICI Bank",
        "KOTAK": "Kotak Mahindra Bank",
        "SBIN": "State Bank of India",
        "AXISBANK": "Axis Bank",
        "HDFCBANK": "HDFC Bank",
        "BAJFINANCE": "Bajaj Finance"
    };

    // 1. Initialize with Real Prices
    useEffect(() => {
        async function init() {
            const realPrices = await fetchInitialPrices();

            const initialized = Object.entries(realPrices).map(([symbol, price]) => {
                // Generate fake intraday history leading up to the current price
                const hist = [];
                let p = price * 0.98; // Start slightly lower to show trend
                for (let i = 0; i < 30; i++) {
                    p = simulateTick(p);
                    hist.push({ time: `10:${i < 10 ? '0' + i : i}`, price: p });
                }
                // Ensure last point matches real price
                hist.push({ time: "10:30", price: price });

                return {
                    symbol,
                    name: COMPANY_NAMES[symbol] || symbol,
                    price,
                    openPrice: price * 0.995, // Simulate a Day Open 
                    history: hist
                };
            });

            setStocks(initialized);
            setSelectedStock(initialized[0]); // Select first by default
            setLoading(false);
        }

        init();
    }, []);

    // 2. Ticker Loop (Simulation)
    useEffect(() => {
        if (loading || stocks.length === 0) return;

        const interval = setInterval(() => {
            setStocks((prev) => prev.map((s) => {
                const newPrice = simulateTick(s.price);

                // Add new data point
                const now = new Date();
                const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                const newHistory = [...s.history, { time: timeLabel, price: newPrice }].slice(-50); // Keep last 50 pts

                return { ...s, price: newPrice, history: newHistory };
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, [loading]);

    // Sync selected stock with updates
    useEffect(() => {
        if (selectedStock && stocks.length > 0) {
            const updated = stocks.find(s => s.symbol === selectedStock.symbol);
            if (updated) setSelectedStock(updated);
        }
    }, [stocks]);

    const buyStock = (stock) => {
        if (user.balance < stock.price) return alert("Insufficient funds");
        transact(-stock.price, { source: "stock", label: `Bought ${stock.symbol}` });
        setPortfolio((p) => [...p, { ...stock, buyPrice: stock.price }]);
    };

    const sellStock = (index) => {
        const stock = portfolio[index];
        const currentPrice = stocks.find(s => s.symbol === stock.symbol)?.price || stock.price;
        transact(currentPrice, { source: "stock", label: `Sold ${stock.symbol}` });
        setPortfolio((p) => p.filter((_, i) => i !== index));
    };

    const sellHolding = () => {
        if (!selectedStock) return;
        // Find first index of held stock
        const idx = portfolio.findIndex(p => p.symbol === selectedStock.symbol);
        if (idx !== -1) sellStock(idx);
    };

    // Filter Logic
    const filteredStocks = stocks.filter(s =>
        s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const heldQuantity = selectedStock ? portfolio.filter(p => p.symbol === selectedStock.symbol).length : 0;

    // Chart Helpers
    const isPositive = selectedStock ? selectedStock.price >= selectedStock.openPrice : true;
    const chartColor = isPositive ? "#10B981" : "#EF4444"; // Emerald vs Red


    if (loading) return <div className="p-10 text-center text-brand-primary animate-pulse">Connecting to Exchange...</div>;

    // Removed StockQuiz gating as per user request to handle it as a direct tool.

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col max-w-7xl mx-auto font-body">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link to="/games" className="text-xs text-slate-500 hover:text-white uppercase tracking-wider mb-2 block">← Back to Career</Link>
                    <h2 className="text-3xl font-heading font-bold text-white flex items-center gap-2">
                        Market Terminal <span className="animate-pulse text-xs bg-red-600 text-white px-2 py-0.5 rounded">LIVE</span>
                    </h2>
                </div>
                <div className="bg-brand-surface px-4 py-2 rounded-lg border border-white/10 flex items-center gap-4">
                    <div>
                        <span className="text-xs text-slate-400 block">Buying Power</span>
                        <span className="text-xl font-bold text-white">₹{user.balance.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid lg:grid-cols-3 gap-6 overflow-hidden min-h-0">

                {/* Left: Watchlist & Search */}
                <div className="card-glass flex flex-col overflow-hidden lg:col-span-1 border-t-0 text-left">
                    {/* Search Bar */}
                    <div className="p-3 border-b border-white/10 bg-[#0f1219]">
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-colors"
                        />
                    </div>
                    <div className="p-2 bg-[#0f1219] border-b border-white/5 flex justify-between items-center bg-opacity-50">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Symbol</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Price</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredStocks.map((s) => {
                            const dayChange = ((s.price - s.openPrice) / s.openPrice) * 100;
                            const isUp = dayChange >= 0;

                            return (
                                <div
                                    key={s.symbol}
                                    onClick={() => setSelectedStock(s)}
                                    className={`p-3 flex justify-between items-center cursor-pointer border-b border-white/5 hover:bg-white/5 transition-all ${selectedStock?.symbol === s.symbol ? "bg-brand-primary/10 border-l-2 border-l-brand-primary" : "border-l-2 border-l-transparent"
                                        }`}
                                >
                                    <div>
                                        <div className="font-bold text-slate-200 text-sm">{s.symbol}</div>
                                        <div className="text-[10px] text-slate-500 truncate max-w-[100px]">{s.name}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono text-sm text-slate-200">₹{s.price.toFixed(2)}</div>
                                        <div className={`text-[10px] ${isUp ? 'text-brand-success' : 'text-brand-danger'}`}>
                                            {isUp ? '▲' : '▼'} {Math.abs(dayChange).toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredStocks.length === 0 && (
                            <div className="p-4 text-center text-xs text-slate-500">No stocks found.</div>
                        )}
                    </div>
                </div>

                {/* Center: Pro Chart */}
                <div className="flex flex-col gap-6 lg:col-span-2 overflow-hidden">

                    <div className="card-glass p-1 flex-1 flex flex-col min-h-[400px] relative bg-[#0B0E14]">
                        {selectedStock ? (
                            <>
                                {/* Header Container - Flex to prevent overlap */}
                                <div className="flex flex-wrap justify-between items-start p-4 z-10 relative">
                                    {/* Left: Stock Info */}
                                    <div>
                                        <h3 className="text-3xl font-heading font-bold text-white mb-1">{selectedStock.symbol}</h3>
                                        <h4 className="text-sm text-slate-400 mb-2">{selectedStock.name}</h4>
                                        <div className="flex items-baseline gap-3">
                                            <span className={`text-2xl font-mono font-bold ${isPositive ? 'text-brand-success' : 'text-brand-danger'}`}>
                                                ₹{selectedStock.price.toFixed(2)}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                Open: ₹{selectedStock.openPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex gap-2 items-center mt-2 lg:mt-0">
                                        <div className="text-right mr-4 hidden md:block">
                                            <div className="text-xs text-slate-500 uppercase">Your Position</div>
                                            <div className="text-xl font-bold text-white">{heldQuantity} Shares</div>
                                        </div>

                                        <button
                                            onClick={sellHolding}
                                            disabled={heldQuantity === 0}
                                            className={`font-bold py-2 px-6 rounded transition ${heldQuantity > 0 ? "bg-brand-danger hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-white/5 text-slate-500 cursor-not-allowed"}`}
                                        >
                                            SELL
                                        </button>
                                        <button
                                            onClick={() => buyStock(selectedStock)}
                                            className="bg-brand-success hover:bg-green-600 text-black font-bold py-2 px-6 rounded transition shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                        >
                                            BUY
                                        </button>
                                    </div>
                                </div>

                                {/* The Graph */}
                                <div className="flex-1 w-full min-h-0 pt-2 pb-2 pr-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={selectedStock.history}>
                                            <defs>
                                                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                                            <XAxis
                                                dataKey="time"
                                                tick={{ fontSize: 10, fill: '#64748B' }}
                                                axisLine={false}
                                                tickLine={false}
                                                minTickGap={30}
                                            />
                                            <YAxis
                                                domain={['auto', 'auto']}
                                                orientation="right"
                                                tick={{ fontSize: 10, fill: '#64748B' }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(val) => `₹${val.toFixed(0)}`}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '4px' }}
                                                itemStyle={{ color: '#fff', fontSize: '12px' }}
                                                labelStyle={{ color: '#94A3B8', fontSize: '10px', marginBottom: '4px' }}
                                                formatter={(value) => [`₹${value.toFixed(2)}`, "Price"]}
                                            />
                                            <ReferenceLine y={selectedStock.openPrice} stroke="#475569" strokeDasharray="3 3" label={{ value: "OPEN", position: 'insideLeft', fill: '#475569', fontSize: 10 }} />
                                            <Area
                                                type="monotone"
                                                dataKey="price"
                                                stroke={chartColor}
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorCurrent)"
                                                isAnimationActive={false} // Crucial for smooth real-time ticks
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-600">
                                Select a stock
                            </div>
                        )}
                    </div>

                    {/* Quick Portfolio Strip */}
                    <div className="h-16 flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {portfolio.length === 0 && <span className="text-xs text-slate-500 pl-2">No positions open. Pick a stock and click BUY.</span>}
                        {portfolio.map((s, idx) => {
                            const current = stocks.find(st => st.symbol === s.symbol);
                            const currPrice = current ? current.price : s.price;
                            const gain = currPrice - s.buyPrice;
                            const gainPercent = (gain / s.buyPrice) * 100;
                            return (
                                <div key={idx} className="flex-shrink-0 bg-brand-surface border border-white/5 rounded pl-3 pr-2 py-1 flex items-center gap-3 min-w-[180px]">
                                    <span className="font-bold text-slate-200 text-sm">{s.symbol}</span>
                                    <div className="flex flex-col items-end leading-none">
                                        <span className={`text-xs font-bold ${gain >= 0 ? "text-brand-success" : "text-brand-danger"}`}>
                                            {gain >= 0 ? "+" : ""}{gain.toFixed(1)} ({gainPercent.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <button onClick={() => sellStock(idx)} className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-slate-300 ml-auto">
                                        CLOSE
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
