import React from 'react';
import { Plane, Activity, Calculator, Search, RefreshCw, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookingWindow: string;
  setBookingWindow: (w: string) => void;
  frequency: string;
  setFrequency: (f: string) => void;
  onOpenSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bookingWindow,
  setBookingWindow,
  frequency,
  setFrequency,
  onOpenSimulator
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'routes', label: 'Route Explorer' },
    { id: 'airlines', label: 'Airline Comparison' },
    { id: 'leadtime', label: 'Lead-Time Curve' },
    { id: 'quality', label: 'Data Quality' },
    { id: 'explorer', label: 'Data Explorer' },
    { id: 'methodology', label: 'Methodology' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      
      {/* Live Market Ticker Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 border-b border-slate-800/80 py-1 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-slate-300 font-mono">
          <div className="flex items-center space-x-4 animate-marquee whitespace-nowrap overflow-x-auto scrollbar-none">
            <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <Zap className="w-3 h-3 animate-pulse" />
              <span>LIVE INDEX FEED:</span>
            </span>
            <span className="text-slate-300">DEL → BOM T+7: <strong className="text-rose-400">112.4 (+4.2%)</strong></span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">DEL → BLR T+7: <strong className="text-indigo-400">108.8 (+2.8%)</strong></span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">BLR → HYD T+7: <strong className="text-rose-400">115.1 (+6.1%)</strong></span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">DEL → CCU T+7: <strong className="text-emerald-400">97.2 (-1.5%)</strong></span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Coverage: <strong className="text-teal-300">10 Corridors (45,000 quotes)</strong></span>
          </div>

          <button
            onClick={onOpenSimulator}
            className="hidden lg:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold uppercase transition-all cursor-pointer whitespace-nowrap ml-4"
          >
            <Calculator className="w-3 h-3" />
            <span>Simulator Tool</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-3">
            <div 
              onClick={() => setActiveTab('overview')}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 cursor-pointer transform hover:scale-105 transition-all"
            >
              <Plane className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                  APIx
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE CORRIDORS</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide uppercase font-medium hidden sm:block">
                Indian Airfare Price Index • NSO/MoSPI Economic Analytics
              </p>
            </div>
          </div>

          {/* Quick Interactive Selectors */}
          <div className="flex items-center space-x-3">
            
            {/* Booking Window selector */}
            <div className="hidden sm:flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-xs">
              <span className="px-2 text-slate-400 font-medium">Window:</span>
              {['T+1', 'T+7', 'T+15', 'T+30', 'T+45'].map((w) => (
                <button
                  key={w}
                  onClick={() => setBookingWindow(w)}
                  className={`px-2 py-1 rounded-md transition-all font-mono font-semibold cursor-pointer ${
                    bookingWindow === w
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Frequency selector */}
            <div className="hidden md:flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-xs">
              <span className="px-2 text-slate-400 font-medium">Freq:</span>
              {['daily', 'weekly', 'monthly'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`px-2 py-1 rounded-md transition-all font-semibold capitalize cursor-pointer ${
                    frequency === f
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* What-If Simulator Trigger Button */}
            <button
              onClick={onOpenSimulator}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer border border-indigo-400/20"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calculator</span>
            </button>

          </div>

        </div>

        {/* Tab Navigation Links */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
