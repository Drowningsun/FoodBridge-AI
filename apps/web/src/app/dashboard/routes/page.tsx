'use client';

import { MapPin, Navigation, Clock, Truck } from 'lucide-react';

const mockRoute = {
  total_distance_km: 18.7,
  total_time_min: 42,
  stops: [
    { name: 'Grand Taj Hotel', address: 'Marine Drive, Mumbai', type: 'pickup', kg: 45 },
    { name: 'TechPark Cafeteria', address: 'Andheri East, Mumbai', type: 'pickup', kg: 22 },
    { name: 'Hope Foundation', address: 'Bandra West, Mumbai', type: 'dropoff', kg: 45 },
    { name: 'Akshaya Patra', address: 'Juhu, Mumbai', type: 'dropoff', kg: 22 },
  ],
};

export default function RoutesPage() {
  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MapPin className="w-7 h-7 text-cyan-400" />Route Optimization
        </h1>
        <p className="text-sm text-slate-400 mt-1">AI-optimized delivery routes using TSP + 2-opt</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass-card p-6 text-center">
          <Navigation className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{mockRoute.total_distance_km} km</div>
          <div className="text-xs text-slate-500">Total Distance</div>
        </div>
        <div className="glass-card p-6 text-center">
          <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{mockRoute.total_time_min} min</div>
          <div className="text-xs text-slate-500">Estimated Time</div>
        </div>
        <div className="glass-card p-6 text-center">
          <Truck className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{mockRoute.stops.length}</div>
          <div className="text-xs text-slate-500">Total Stops</div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-white mb-6">Optimized Route</h3>
        <div className="space-y-4">
          {mockRoute.stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${stop.type === 'pickup' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                  {i + 1}
                </div>
                {i < mockRoute.stops.length - 1 && <div className="w-0.5 h-8 bg-slate-700 mt-1" />}
              </div>
              <div className="flex-1 p-4 rounded-xl bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{stop.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{stop.address}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{stop.kg} kg</span>
                    <span className={`status-badge ${stop.type === 'pickup' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {stop.type === 'pickup' ? '📦 Pickup' : '🏢 Dropoff'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
