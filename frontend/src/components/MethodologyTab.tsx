import React from 'react';
import { BookOpen, Calculator, Layers, FileText, CheckCircle2, Shield } from 'lucide-react';

export const MethodologyTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="glass-panel p-6 rounded-2xl border-indigo-500/20">
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Statistical Transparency & Provenance</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mt-1">APIx Index Methodology Documentation</h2>
        <p className="text-xs text-slate-400 mt-1">
          Detailed technical specification of price definitions, basket weights, cleaning algorithms, and statistical revision policies for CPI augmentation.
        </p>
      </div>

      {/* Section 1: Objective & Price Definition */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-mono font-bold">1</span>
          <span>Price Definition & Itemization</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The primary objective of APIx is to observe consumer-facing quoted airfares for Indian domestic flights without purchasing tickets.
          The platform explicitly itemizes pricing components:
        </p>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-indigo-200">
          Total Consumer Price = Base Fare + Taxes & GST + Airport User Development Fees (UDF) + Convenience Fees
        </div>

        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
          <li><strong>Base Fare</strong>: Core ticket price charged by carrier.</li>
          <li><strong>Taxes</strong>: Applicable statutory taxes and Goods & Services Tax (GST).</li>
          <li><strong>User Development Fee (UDF)</strong>: Mandatory airport infrastructure fees.</li>
        </ul>
      </div>

      {/* Section 2: Mathematical Formulas */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-mono font-bold">2</span>
          <span>Index Formula & Aggregation</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase">1. Route Price Relative</span>
            <div className="p-3 bg-slate-950 rounded font-mono text-sm text-center text-emerald-300">
              R_(i,t) = P_(i,t) / P_(i,0)
            </div>
            <p className="text-[11px] text-slate-400">
              Where P_(i,t) is the median total fare for route i at date t, and P_(i,0) is the base-period price.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase">2. National Composite APIx</span>
            <div className="p-3 bg-slate-950 rounded font-mono text-sm text-center text-indigo-300">
              APIx_t = Σ (w_i × I_(i,t))
            </div>
            <p className="text-[11px] text-slate-400">
              Laspeyres weighted sum where w_i represents passenger traffic weight (Σ w_i = 1.0).
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Route Basket Weights Table */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-mono font-bold">3</span>
          <span>Representative Route Basket & Weights</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Route Code</th>
                <th className="p-3">Origin - Destination</th>
                <th className="p-3">Region</th>
                <th className="p-3 text-right">Distance (km)</th>
                <th className="p-3 text-right">CPI Weight (w_i)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
              <tr><td className="p-3 font-bold text-white">DEL-BOM</td><td className="p-3">Delhi → Mumbai</td><td className="p-3">North-West</td><td className="p-3 text-right">1,150</td><td className="p-3 text-right text-indigo-400 font-bold">0.20 (20%)</td></tr>
              <tr><td className="p-3 font-bold text-white">DEL-BLR</td><td className="p-3">Delhi → Bengaluru</td><td className="p-3">North-South</td><td className="p-3 text-right">1,740</td><td className="p-3 text-right text-indigo-400 font-bold">0.18 (18%)</td></tr>
              <tr><td className="p-3 font-bold text-white">BOM-BLR</td><td className="p-3">Mumbai → Bengaluru</td><td className="p-3">West-South</td><td className="p-3 text-right">840</td><td className="p-3 text-right text-indigo-400 font-bold">0.15 (15%)</td></tr>
              <tr><td className="p-3 font-bold text-white">DEL-CCU</td><td className="p-3">Delhi → Kolkata</td><td className="p-3">North-East</td><td className="p-3 text-right">1,305</td><td className="p-3 text-right text-indigo-400 font-bold">0.12 (12%)</td></tr>
              <tr><td className="p-3 font-bold text-white">BLR-HYD</td><td className="p-3">Bengaluru → Hyderabad</td><td className="p-3">South-South</td><td className="p-3 text-right">500</td><td className="p-3 text-right text-indigo-400 font-bold">0.10 (10%)</td></tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
