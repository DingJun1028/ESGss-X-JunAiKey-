
import React, { useState, useMemo } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { MapPin, Wind, Zap, AlertTriangle, Factory, X, MousePointer2, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';

interface Location {
  id: string;
  name: string;
  region: string;
  x: number; 
  y: number; 
  status: 'optimal' | 'warning' | 'critical';
  metrics: {
    co2: string;
    energy: string;
    output: string;
    trend: { time: string; value: number }[];
  };
}

const MOCK_TREND = [
    { time: '08:00', value: 40 }, { time: '10:00', value: 35 }, { time: '12:00', value: 55 },
    { time: '14:00', value: 48 }, { time: '16:00', value: 42 }, { time: '18:00', value: 30 }
];

const LOCATIONS: Location[] = [
  { id: 'tpe', name: 'Taipei HQ', region: 'APAC', x: 82, y: 45, status: 'optimal', metrics: { co2: '120t', energy: '450kWh', output: '100%', trend: MOCK_TREND.map(v => ({ ...v, value: v.value + 10 })) } },
  { id: 'ber', name: 'Berlin Plant', region: 'EMEA', x: 52, y: 32, status: 'optimal', metrics: { co2: '340t', energy: '890kWh', output: '98%', trend: MOCK_TREND.map(v => ({ ...v, value: v.value + 20 })) } },
  { id: 'aus', name: 'Austin R&D', region: 'NA', x: 22, y: 42, status: 'warning', metrics: { co2: '85t', energy: '320kWh', output: '85%', trend: MOCK_TREND.map(v => ({ ...v, value: v.value - 5 })) } },
  { id: 'hcm', name: 'Ho Chi Minh', region: 'APAC', x: 78, y: 55, status: 'critical', metrics: { co2: '560t', energy: '1.2MWh', output: '110%', trend: MOCK_TREND.map(v => ({ ...v, value: v.value * 1.5 })) } },
];

interface MapPinProps extends InjectedProxyProps {
    location: Location;
    isSelected: boolean;
    onClick: (loc: Location) => void;
}

const MapPinBase: React.FC<MapPinProps> = ({ location, isSelected, onClick, trackInteraction, isAgentActive }) => {
    const statusColor = location.status === 'critical' ? 'bg-red-500' : location.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500';
    
    return (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/marker z-20"
          style={{ left: `${location.x}%`, top: `${location.y}%` }}
          onClick={(e) => {
              e.stopPropagation();
              trackInteraction?.('click', location);
              onClick(location);
          }}
        >
          <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${statusColor} ${isSelected ? 'scale-150' : 'scale-100'}`} />
          <div className={`relative rounded-full border-2 shadow-2xl transition-all duration-300 ${statusColor} ${isSelected ? 'w-8 h-8 border-white scale-125 shadow-white/20' : 'w-4 h-4 border-white/50 group-hover/marker:scale-125'}`} />
          {isAgentActive && <div className="absolute -top-1 -right-1 w-2 h-2 bg-celestial-purple rounded-full border border-white animate-bounce" />}
        </div>
    );
};

const GeoSpatialAgent = withUniversalProxy(MapPinBase);

export const GlobalOperations: React.FC = () => {
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);

  return (
    <div className="w-full h-full min-h-[600px] relative rounded-[3rem] overflow-hidden bg-slate-950 border border-white/5 select-none shadow-2xl" onClick={() => setSelectedLoc(null)}>
      {/* Map Decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <svg width="100%" height="100%" className="fill-celestial-blue">
            <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" opacity="0.5" /></pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-grid)" />
         </svg>
      </div>

      {LOCATIONS.map((loc) => (
        <GeoSpatialAgent key={loc.id} id={`geo-${loc.id}`} label={loc.name} location={loc} isSelected={selectedLoc?.id === loc.id} onClick={setSelectedLoc} />
      ))}

      {/* Details Overlay */}
      {selectedLoc && (
        <div 
            className="absolute bottom-6 right-6 w-96 glass-panel p-8 rounded-[2.5rem] border border-white/20 animate-slide-up backdrop-blur-3xl bg-slate-900/90 z-50 shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col gap-6"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${selectedLoc.status === 'critical' ? 'text-rose-500' : 'text-emerald-500'}`}><Factory className="w-8 h-8" /></div>
                    <div>
                        <h4 className="zh-main text-2xl text-white">{selectedLoc.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1"><MapPin className="w-3 h-3" /> {selectedLoc.region}</div>
                    </div>
                </div>
                <button onClick={() => setSelectedLoc(null)} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {/* Recharts Historical Trend */}
            <div className="h-32 w-full bg-black/40 rounded-2xl border border-white/5 p-2 overflow-hidden">
                <div className="text-[8px] font-black text-gray-500 uppercase px-2 pt-1 flex justify-between">
                    <span>Emission_Trend</span>
                    <Activity className="w-2.5 h-2.5" />
                </div>
                {/* Fix: Added minWidth={0} to ResponsiveContainer to avoid width -1 warning */}
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={selectedLoc.metrics.trend}>
                        <defs>
                            <linearGradient id="colorLoc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={selectedLoc.status === 'critical' ? '#f43f5e' : '#10b981'} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={selectedLoc.status === 'critical' ? '#f43f5e' : '#10b981'} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke={selectedLoc.status === 'critical' ? '#f43f5e' : '#10b981'} fill="url(#colorLoc)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-3">
                <OmniEsgCell mode="list" label="Carbon Flow" value={selectedLoc.metrics.co2} icon={Wind} color={selectedLoc.status === 'critical' ? 'rose' : 'emerald'} subValue="LIVE_SYNC" />
                <OmniEsgCell mode="list" label="Energy Demand" value={selectedLoc.metrics.energy} icon={Zap} color="gold" subValue="GRID_FEED" />
            </div>

            {selectedLoc.status !== 'optimal' && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-rose-200 leading-tight italic">Anomaly surge detected. Analyzing potential leak in Sector {selectedLoc.id.toUpperCase()}.</p>
                </div>
            )}
        </div>
      )}

      <div className="absolute top-8 left-8 flex flex-col gap-4 text-[10px] text-celestial-blue font-mono opacity-50 z-10">
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> KERNEL_OPERATIONAL</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> TELEMETRY_ACTIVE: {LOCATIONS.length} NODES</div>
      </div>
    </div>
  );
};
