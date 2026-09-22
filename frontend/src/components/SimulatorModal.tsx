import React, { useState } from 'react';
import { X, Calculator, Sliders, Play, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: any[];
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({ isOpen, onClose, routes }) => {
  const [selectedRouteCode, setSelectedRouteCode] = useState<string>('DEL-BOM');
  const [advanceDays, setAdvanceDays] = useState<number>(7);
  const [carrierType, setCarrierType] = useState<string>('LCC'); // LCC or FSC
  const [travelDayOfWeek, setTravelDayOfWeek] = useState<string>('Friday');
  const [fareClass, setFareClass] = useState<string>('Economy');

  if (!isOpen) return null;

  const currentRoute = routes.find(r => `${r.origin_code}-${r.destination_code}` === selectedRouteCode) || {
    origin_code: 'DEL',
    destination_code: 'BOM',
    origin_city: 'Delhi',
    destination_city: 'Mumbai',
    distance_km: 1150,
    route_weight: 0.20
  };

  // Dynamic simulation calculations
  const distance = currentRoute.distance_km || 1150;
  const baseRate = 3.8;
  
  // Advance purchase multiplier curve
  const advanceMult = advanceDays <= 2 ? 1.75 : advanceDays <= 7 ? 1.25 : advanceDays <= 15 ? 1.00 : advanceDays <= 30 ? 0.85 : 0.72;
  
  // Day of week factor
  const dowMult = (travelDayOfWeek === 'Friday' || travelDayOfWeek === 'Sunday') ? 1.12 : (travelDayOfWeek === 'Tuesday' ? 0.94 : 1.0);
  
  // Carrier factor
  const carrierMult = carrierType === 'FSC' ? 1.18 : 1.0;

  const calculatedBaseFare = Math.round(distance * baseRate * advanceMult * dowMult * carrierMult);
  const calculatedTaxes = Math.round(calculatedBaseFare * 0.18);
  const calculatedFees = Math.round(calculatedBaseFare * 0.08);
  const calculatedTotalFare = calculatedBaseFare + calculatedTaxes + calculatedFees;

  const baselinePrice = Math.round(distance * 4.2);
  const simulatedRouteIndex = Math.round((calculatedTotalFare / baselinePrice) * 10000) / 100;
  const indexDelta = Math.round((simulatedRouteIndex - 100.0) * 10) / 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-indigo-500/30 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Interactive Airfare & Index Simulator</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">WHAT-IF ANALYSIS</span>
              </h3>
              <p className="text-xs text-slate-400">Simulate price elasticity, tax itemization, and route index impact in real-time</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Route Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Domestic Corridor:</label>
              <select
                value={selectedRouteCode}
                onChange={(e) => setSelectedRouteCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono font-semibold focus:border-indigo-500 focus:outline-none"
              >
                {routes.map(r => (
                  <option key={r.id} value={`${r.origin_code}-${r.destination_code}`}>
                    {r.origin_code} → {r.destination_code} ({r.origin_city} to {r.destination_city})
                  </option>
                ))}
              </select>
            </div>

            {/* Carrier Type */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Carrier Type:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCarrierType('LCC')}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                    carrierType === 'LCC'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  LCC (Low Cost)
                </button>
                <button
                  type="button"
                  onClick={() => setCarrierType('FSC')}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                    carrierType === 'FSC'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  FSC (Full Service)
                </button>
              </div>
            </div>

            {/* Advance Days Slider */}
            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Advance Purchase Lead Time:</span>
                <span className="font-mono font-bold text-indigo-400">{advanceDays} Days Prior to Departure (T+{advanceDays})</span>
              </div>
              <input
                type="range"
                min="1"
                max="45"
                value={advanceDays}
                onChange={(e) => setAdvanceDays(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>T+1 (Last Minute)</span>
                <span>T+7 (1 Wk)</span>
                <span>T+15 (2 Wks)</span>
                <span>T+30 (1 Mo)</span>
                <span>T+45 (Deep Discount)</span>
              </div>
            </div>

            {/* Day of Week Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Day of Travel:</label>
              <select
                value={travelDayOfWeek}
                onChange={(e) => setTravelDayOfWeek(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Fare Class */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Cabin Class:</label>
              <select
                value={fareClass}
                onChange={(e) => setFareClass(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
              </select>
            </div>

          </div>

          {/* Real-time Calculation Result Box */}
          <div className="glass-panel p-5 rounded-2xl border-indigo-500/40 bg-indigo-950/20 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold uppercase text-indigo-300 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Simulated Fare Component Breakdown</span>
              </span>
              <span className="text-2xl font-extrabold text-white font-mono">
                ₹{calculatedTotalFare.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-slate-900/90 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Base Fare</span>
                <span className="text-slate-200 font-bold text-sm">₹{calculatedBaseFare.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Taxes & GST (18%)</span>
                <span className="text-teal-400 font-bold text-sm">₹{calculatedTaxes.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">User Fees (8%)</span>
                <span className="text-amber-400 font-bold text-sm">₹{calculatedFees.toLocaleString()}</span>
              </div>
            </div>

            {/* Index Contribution Result */}
            <div className="p-3.5 bg-slate-900/90 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-300">Simulated Route Index Value</p>
                <p className="text-[10px] text-slate-400">Baseline price for corridor: ₹{baselinePrice.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-indigo-300 font-mono">{simulatedRouteIndex}</span>
                <span className={`ml-2 text-xs font-bold font-mono ${indexDelta >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ({indexDelta >= 0 ? '+' : ''}{indexDelta}%)
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            Apply Simulation Settings
          </button>
        </div>

      </div>
    </div>
  );
};
