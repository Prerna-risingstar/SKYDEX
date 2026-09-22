import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, CheckCircle2, AlertOctagon, RefreshCw, FileText, ArrowUpDown } from 'lucide-react';

export const DataExplorerTab: React.FC = () => {
  const [observations, setObservations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Interactive filters
  const [filterWindow, setFilterWindow] = useState<string>('all');
  const [filterOutlier, setFilterOutlier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  useEffect(() => {
    fetchObservations();
  }, [filterWindow, filterOutlier]);

  const fetchObservations = async () => {
    setLoading(true);
    try {
      let url = '/api/v1/observations?limit=200';
      if (filterWindow !== 'all') {
        url += `&advance_window=${filterWindow}`;
      }
      if (filterOutlier === 'true') {
        url += `&is_outlier=true`;
      } else if (filterOutlier === 'false') {
        url += `&is_outlier=false`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setObservations(data);
      } else {
        useFallbackObservations();
      }
    } catch (e) {
      useFallbackObservations();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackObservations = () => {
    const fallback = [];
    const airlines = [
      { code: '6E', name: 'IndiGo' },
      { code: 'AI', name: 'Air India' },
      { code: 'QP', name: 'Akasa Air' },
      { code: 'SG', name: 'SpiceJet' }
    ];
    const routes = ['DEL-BOM', 'DEL-BLR', 'BOM-BLR', 'DEL-CCU', 'BLR-HYD'];

    for (let i = 1; i <= 40; i++) {
      const a = airlines[i % airlines.length];
      const r = routes[i % routes.length];
      const total = 4500 + (i * 140);
      const base = Math.round(total * 0.76);
      const tax = Math.round(total * 0.16);
      const fee = total - base - tax;

      fallback.push({
        id: i,
        source_name: 'Direct Airline',
        airline_code: a.code,
        airline_name: a.name,
        route_name: r,
        flight_number: `${a.code}-${200 + i}`,
        travel_date: '2026-09-15',
        departure_time: '08:30',
        arrival_time: '10:45',
        advance_window: (i % 5 === 0) ? 1 : 7,
        fare_class: 'Economy',
        base_fare: base,
        taxes: tax,
        fees: fee,
        total_fare: total,
        currency: 'INR',
        availability_status: 'AVAILABLE',
        quality_score: 96.5,
        is_outlier: i === 12
      });
    }
    setObservations(fallback);
  };

  // Filter & sort observations client side
  const filteredObservations = observations
    .filter(item => {
      const q = searchQuery.toLowerCase();
      return (
        item.flight_number?.toLowerCase().includes(q) ||
        item.airline_name?.toLowerCase().includes(q) ||
        item.route_name?.toLowerCase().includes(q) ||
        item.source_name?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-desc') return b.total_fare - a.total_fare;
      if (sortBy === 'price-asc') return a.total_fare - b.total_fare;
      if (sortBy === 'quality-desc') return b.quality_score - a.quality_score;
      return b.id - a.id;
    });

  const handleExportCSV = () => {
    window.open('/api/v1/export/csv', '_blank');
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredObservations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "apix_observations.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export Actions */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-indigo-500/20">
        <div>
          <h2 className="text-xl font-extrabold text-white">Raw & Cleaned Observation Data Explorer</h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse individual airfare quotations with component breakdown, quality scores, and outlier flags
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Live Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search flight #, carrier, route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 w-52 sm:w-64"
            />
          </div>

          {/* Window Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Window:</span>
            <select
              value={filterWindow}
              onChange={(e) => setFilterWindow(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-2.5 py-1.5 font-mono focus:outline-none"
            >
              <option value="all">All Windows</option>
              <option value="1">T+1 (1 Day)</option>
              <option value="7">T+7 (7 Days)</option>
              <option value="15">T+15 (15 Days)</option>
              <option value="30">T+30 (30 Days)</option>
              <option value="45">T+45 (45 Days)</option>
            </select>
          </div>

          {/* Outlier Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Outliers:</span>
            <select
              value={filterOutlier}
              onChange={(e) => setFilterOutlier(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-2.5 py-1.5 font-mono focus:outline-none"
            >
              <option value="all">All Quotes</option>
              <option value="false">Non-Outliers</option>
              <option value="true">Outliers Only</option>
            </select>
          </div>

        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none font-mono"
          >
            <option value="date-desc">Sort: Latest Quotes</option>
            <option value="price-desc">Sort: Highest Price</option>
            <option value="price-asc">Sort: Lowest Price</option>
            <option value="quality-desc">Sort: Quality Score</option>
          </select>
        </div>

      </div>

      {/* Observation Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-3.5 font-mono">Flight #</th>
                <th className="p-3.5">Carrier</th>
                <th className="p-3.5">Route</th>
                <th className="p-3.5 font-mono">Travel Date</th>
                <th className="p-3.5 font-mono">Window</th>
                <th className="p-3.5 font-mono text-right">Base Fare</th>
                <th className="p-3.5 font-mono text-right">Taxes</th>
                <th className="p-3.5 font-mono text-right">Fees</th>
                <th className="p-3.5 font-mono text-right">Total Price</th>
                <th className="p-3.5 text-center">Quality Score</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredObservations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition-all">
                  <td className="p-3.5 font-bold text-white">{item.flight_number}</td>
                  <td className="p-3.5 font-sans font-medium text-slate-300">{item.airline_name} ({item.airline_code})</td>
                  <td className="p-3.5 font-bold text-indigo-300">{item.route_name}</td>
                  <td className="p-3.5 text-slate-400">{item.travel_date}</td>
                  <td className="p-3.5 text-slate-300">T+{item.advance_window}</td>
                  <td className="p-3.5 text-right text-slate-300">₹{item.base_fare?.toLocaleString() || '-'}</td>
                  <td className="p-3.5 text-right text-teal-400">₹{item.taxes?.toLocaleString() || '-'}</td>
                  <td className="p-3.5 text-right text-amber-400">₹{item.fees?.toLocaleString() || '-'}</td>
                  <td className="p-3.5 text-right font-extrabold text-white text-sm">₹{item.total_fare?.toLocaleString()}</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                      {item.quality_score}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    {item.is_outlier ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold flex items-center justify-center space-x-1">
                        <AlertOctagon className="w-3 h-3 mr-1" />
                        <span>OUTLIER</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/10 text-teal-300 font-semibold">
                        VALID
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
