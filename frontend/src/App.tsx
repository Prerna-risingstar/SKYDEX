import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewTab } from './components/OverviewTab';
import { RouteExplorerTab } from './components/RouteExplorerTab';
import { AirlineComparisonTab } from './components/AirlineComparisonTab';
import { LeadTimeTab } from './components/LeadTimeTab';
import { DataQualityTab } from './components/DataQualityTab';
import { DataExplorerTab } from './components/DataExplorerTab';
import { MethodologyTab } from './components/MethodologyTab';
import { SimulatorModal } from './components/SimulatorModal';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [bookingWindow, setBookingWindow] = useState<string>('T+7');
  const [frequency, setFrequency] = useState<string>('daily');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);

  const sampleRoutes = [
    { id: 1, origin_code: 'DEL', destination_code: 'BOM', origin_city: 'Delhi', destination_city: 'Mumbai', distance_km: 1150, route_weight: 0.20 },
    { id: 2, origin_code: 'DEL', destination_code: 'BLR', origin_city: 'Delhi', destination_city: 'Bengaluru', distance_km: 1740, route_weight: 0.18 },
    { id: 3, origin_code: 'BOM', destination_code: 'BLR', origin_city: 'Mumbai', destination_city: 'Bengaluru', distance_km: 840, route_weight: 0.15 },
    { id: 4, origin_code: 'DEL', destination_code: 'CCU', origin_city: 'Delhi', destination_city: 'Kolkata', distance_km: 1305, route_weight: 0.12 },
    { id: 5, origin_code: 'BLR', destination_code: 'HYD', origin_city: 'Bengaluru', destination_city: 'Hyderabad', distance_km: 500, route_weight: 0.10 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header Navigation */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingWindow={bookingWindow}
        setBookingWindow={setBookingWindow}
        frequency={frequency}
        setFrequency={setFrequency}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            bookingWindow={bookingWindow} 
            frequency={frequency} 
            onSelectRoute={(id) => {
              setActiveTab('routes');
            }}
          />
        )}
        {activeTab === 'routes' && (
          <RouteExplorerTab bookingWindow={bookingWindow} />
        )}
        {activeTab === 'airlines' && (
          <AirlineComparisonTab />
        )}
        {activeTab === 'leadtime' && (
          <LeadTimeTab />
        )}
        {activeTab === 'quality' && (
          <DataQualityTab />
        )}
        {activeTab === 'explorer' && (
          <DataExplorerTab />
        )}
        {activeTab === 'methodology' && (
          <MethodologyTab />
        )}
      </main>

      {/* Interactive What-If Simulator Modal */}
      <SimulatorModal 
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        routes={sampleRoutes}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white">APIx India</span>
            <span>•</span>
            <span>Real-time Airfare Price Index Platform</span>
          </div>
          <div>
            Statistical Methodology Version: <span className="font-mono font-semibold text-slate-200">v1.0 (Laspeyres Base 2026-01)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
