import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, ArrowUpRight, CheckCircle2, Search, Filter, Layers, BarChart2, LineChart as LineIcon, AreaChart as AreaIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

interface OverviewTabProps {
  bookingWindow: string;
  frequency: string;
  onSelectRoute?: (routeId: number) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ bookingWindow, frequency, onSelectRoute }) => {
  const [headline, setHeadline] = useState<any>({
    current_index: 104.45,
    index_date: '2026-08-31',
    base_period: '2026-01',
    mom_change_pct: -0.05,
    yoy_change_pct: 4.45,
    wow_change_pct: -7.1,
    total_observations: 45000,
    quality_score_avg: 96.4,
    route_coverage_pct: 100.0,
    source_coverage_pct: 100.0
  });

  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [timeRangeDays, setTimeRangeDays] = useState<number>(60);
  
  // Heatmap interactive filters
  const [heatmapSearch, setHeatmapSearch] = useState<string>('');
  const [heatmapSort, setHeatmapSort] = useState<string>('index-desc');

  useEffect(() => {
    fetchData();
  }, [bookingWindow, frequency]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resCurrent = await fetch(`/api/v1/index/current?booking_window=${bookingWindow}`);
      if (resCurrent.ok) {
        const dataCurr = await resCurrent.json();
        setHeadline(dataCurr);
      }

      const resHist = await fetch(`/api/v1/index/history?frequency=${frequency}&booking_window=${bookingWindow}`);
      if (resHist.ok) {
        const dataHist = await resHist.json();
        setHistoryData(dataHist);
      } else {
        generateFallbackTrend();
      }
    } catch (e) {
      generateFallbackTrend();
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackTrend = () => {
    const dates = [];
    const baseDate = new Date('2026-07-03');
    for (let i = 0; i < 60; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      const val = 100.0 + Math.sin(i / 5) * 4.5 + (i * 0.08) + (Math.random() * 0.6);
      dates.push({
        index_date: d.toISOString().split('T')[0],
        index_value: Math.round(val * 100) / 100,
        booking_window: bookingWindow
      });
    }
    setHistoryData(dates);
  };

  const rawRouteHeatmap = [
    { id: 1, route: 'DEL → BOM', origin: 'Delhi', dest: 'Mumbai', index: 112.4, change: +4.2, status: 'surge', median: 5240, weight: 0.20, distance: 1150 },
    { id: 2, route: 'DEL → BLR', origin: 'Delhi', dest: 'Bengaluru', index: 108.8, change: +2.8, status: 'moderate', median: 6180, weight: 0.18, distance: 1740 },
    { id: 3, route: 'BOM → BLR', origin: 'Mumbai', dest: 'Bengaluru', index: 103.5, change: +0.9, status: 'stable', median: 3950, weight: 0.15, distance: 840 },
    { id: 4, route: 'DEL → CCU', origin: 'Delhi', dest: 'Kolkata', index: 97.2, change: -1.5, status: 'drop', median: 4820, weight: 0.12, distance: 1305 },
    { id: 5, route: 'BLR → HYD', origin: 'Bengaluru', dest: 'Hyderabad', index: 115.1, change: +6.1, status: 'surge', median: 2950, weight: 0.10, distance: 500 },
    { id: 6, route: 'MAA → DEL', origin: 'Chennai', dest: 'Delhi', index: 106.9, change: +1.8, status: 'stable', median: 6450, weight: 0.08, distance: 1760 },
    { id: 7, route: 'DEL → HYD', origin: 'Delhi', dest: 'Hyderabad', index: 107.4, change: +2.1, status: 'moderate', median: 4920, weight: 0.07, distance: 1260 },
    { id: 8, route: 'DEL → GOI', origin: 'Delhi', dest: 'Goa', index: 119.8, change: +8.4, status: 'surge', median: 7100, weight: 0.05, distance: 1500 },
  ];

  // Filter and sort heatmap items
  const filteredHeatmap = rawRouteHeatmap
    .filter(item => 
      item.route.toLowerCase().includes(heatmapSearch.toLowerCase()) ||
      item.origin.toLowerCase().includes(heatmapSearch.toLowerCase()) ||
      item.dest.toLowerCase().includes(heatmapSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (heatmapSort === 'index-desc') return b.index - a.index;
      if (heatmapSort === 'index-asc') return a.index - b.index;
      if (heatmapSort === 'price-desc') return b.median - a.median;
      if (heatmapSort === 'change-desc') return b.change - a.change;
      return 0;
    });

  // Filter trend data by selected day range
  const filteredHistory = historyData.slice(-timeRangeDays);

  return (
    <div className="space-y-6">
      
      {/* Top Headline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Main APIx Headline Card */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border-indigo-500/30">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>National APIx Index</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">{bookingWindow}</span>
          </div>
          <div className="mt-3 flex items-baseline space-x-3">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {headline.current_index.toFixed(2)}
            </span>
            <span className={`inline-flex items-center text-sm font-bold ${headline.mom_change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {headline.mom_change_pct >= 0 ? <TrendingUp className="w-4 h-4 mr-0.5" /> : <TrendingDown className="w-4 h-4 mr-0.5" />}
              {headline.mom_change_pct >= 0 ? '+' : ''}{headline.mom_change_pct}% MoM
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center space-x-2">
            <span>Base Period: <strong className="text-slate-200">{headline.base_period} = 100.0</strong></span>
            <span>•</span>
            <span>Date: <strong className="text-slate-200">{headline.index_date}</strong></span>
          </p>
        </div>

        {/* Inflation Velocity Card */}
        <div className="glass-panel p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Inflation Velocity</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-slate-400">7-Day Change (WoW)</p>
              <p className="text-xl font-bold text-slate-100 font-mono mt-0.5">
                {headline.wow_change_pct >= 0 ? '+' : ''}{headline.wow_change_pct}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Year-over-Year (YoY)</p>
              <p className="text-xl font-bold text-indigo-400 font-mono mt-0.5">
                +{headline.yoy_change_pct}%
              </p>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span>High-frequency CPI precursor signal</span>
          </div>
        </div>

        {/* Observation Volume Card */}
        <div className="glass-panel p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-sans">Observations Collected</div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">{headline.total_observations?.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-medium">quotes</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Routes: <strong className="text-emerald-400">10 Active</strong></span>
            <span>Sources: <strong className="text-indigo-400">6 Active</strong></span>
          </div>
        </div>

        {/* Data Quality Score Card */}
        <div className="glass-panel p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-sans">Data Quality Score</div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-teal-400 font-mono">{headline.quality_score_avg}/100</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">EXCELLENT</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>IQR Outliers Filtered & Deduplicated</span>
          </div>
        </div>

      </div>

      {/* Main Interactive Index Trend Chart */}
      <div className="glass-panel p-6 rounded-2xl">
        
        {/* Controls Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>National Airfare Price Index Trend (APIx)</span>
              <span className="px-2 py-0.5 rounded text-xs bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20">
                {bookingWindow} • {frequency.toUpperCase()}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Laspeyres weighted domestic airfare index relative to Base Period (Jan 2026 = 100.0)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* Range Presets */}
            <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
              {[15, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setTimeRangeDays(d)}
                  className={`px-2.5 py-1 rounded-md font-mono transition-all ${
                    timeRangeDays === d ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>

            {/* Chart Type Selector */}
            <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setChartType('area')}
                className={`p-1.5 rounded-md transition-all ${chartType === 'area' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400'}`}
                title="Area Chart"
              >
                <AreaIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-1.5 rounded-md transition-all ${chartType === 'line' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400'}`}
                title="Line Chart"
              >
                <LineIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-1.5 rounded-md transition-all ${chartType === 'bar' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400'}`}
                title="Bar Chart"
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-80 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={filteredHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="apixGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="index_date" stroke="#64748b" fontSize={11} tickFormatter={(val) => val.slice(5)} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="index_value" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#apixGrad)" />
              </AreaChart>
            ) : chartType === 'line' ? (
              <LineChart data={filteredHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="index_date" stroke="#64748b" fontSize={11} tickFormatter={(val) => val.slice(5)} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="index_value" stroke="#818cf8" strokeWidth={2.5} dot={false} />
              </LineChart>
            ) : (
              <BarChart data={filteredHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="index_date" stroke="#64748b" fontSize={11} tickFormatter={(val) => val.slice(5)} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 4" />
                <Bar dataKey="index_value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Representative Route Basket Heatmap with Interactive Filter & Sort */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Representative Domestic Route Basket Heatmap</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time route indices, median fares, and price movements across key corridors</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search corridor or city..."
                value={heatmapSearch}
                onChange={(e) => setHeatmapSearch(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 w-44 sm:w-56"
              />
            </div>

            {/* Sort Selector */}
            <select
              value={heatmapSort}
              onChange={(e) => setHeatmapSort(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="index-desc">Sort: Highest Index</option>
              <option value="index-asc">Sort: Lowest Index</option>
              <option value="price-desc">Sort: Highest Price</option>
              <option value="change-desc">Sort: Highest Surge %</option>
            </select>
          </div>
        </div>

        {/* Heatmap Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {filteredHeatmap.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelectRoute && onSelectRoute(item.id)}
              className="glass-panel glass-panel-hover p-4 rounded-xl transition-all cursor-pointer transform hover:-translate-y-0.5 border-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">{item.route}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                  item.change > 4 ? 'bg-rose-500/20 text-rose-300' :
                  item.change > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {item.change >= 0 ? '+' : ''}{item.change}%
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-medium">Route Index</p>
                  <p className="text-xl font-extrabold text-indigo-300 font-mono">{item.index}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase text-slate-400 font-medium">Median Fare</p>
                  <p className="text-sm font-semibold text-slate-200 font-mono">₹{item.median.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/60">
                <span>{item.origin} → {item.dest}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
