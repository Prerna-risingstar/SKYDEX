import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Clock, TrendingUp, HelpCircle } from 'lucide-react';

export const LeadTimeTab: React.FC = () => {
  const elasticityData = [
    { window: 'T+45', label: '45 Days Out', multiplier: 0.72, avg_fare: 3750, index: 78.1, description: 'Deep Advance Purchase Discount' },
    { window: 'T+30', label: '30 Days Out', multiplier: 0.85, avg_fare: 4420, index: 92.1, description: 'Standard Advance Fare' },
    { window: 'T+15', label: '15 Days Out', multiplier: 1.00, avg_fare: 5200, index: 108.3, description: 'Baseline Benchmark Window' },
    { window: 'T+7',  label: '7 Days Out',  multiplier: 1.25, avg_fare: 6500, index: 135.4, description: 'Near-Departure Demand Surge' },
    { window: 'T+1',  label: '1 Day Out',   multiplier: 1.75, avg_fare: 9100, index: 189.6, description: 'Last-Minute Premium Spike' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border-indigo-500/20">
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Advance Purchase Price Elasticity</span>
        </div>
        <h2 className="text-xl font-extrabold text-white mt-1">Lead-Time Elasticity Curve (T+1 to T+45)</h2>
        <p className="text-xs text-slate-400 mt-1">
          Demonstrating how quoted domestic airfares escalate as the travel date approaches.
        </p>
      </div>

      {/* Elasticity Area Curve */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Average Fare Trajectory by Advance Window (INR)</h3>
          <span className="text-xs text-teal-400 font-mono">+142% Price Surge from T+45 to T+1</span>
        </div>

        <div className="h-80 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={elasticityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val: any) => [`₹${val}`, 'Average Quoted Fare']}
              />
              <Area type="monotone" dataKey="avg_fare" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#leadGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advance Purchase Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {elasticityData.map((item, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl space-y-2 border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 font-mono">{item.window}</span>
              <span className="text-[10px] text-slate-400">{item.multiplier}x Base</span>
            </div>
            <p className="text-xl font-extrabold text-white font-mono">₹{item.avg_fare.toLocaleString()}</p>
            <div className="text-[10px] text-slate-400 font-medium border-t border-slate-800 pt-2">
              {item.description}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
