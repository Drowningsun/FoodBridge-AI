'use client';

import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Utensils, Leaf, Users,
  Globe, ArrowUpRight, Package, Truck,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

const monthlyData = [
  { month: 'Jul', donations: 85, meals: 1700, co2: 850 },
  { month: 'Aug', donations: 120, meals: 2400, co2: 1200 },
  { month: 'Sep', donations: 98, meals: 1960, co2: 980 },
  { month: 'Oct', donations: 150, meals: 3000, co2: 1500 },
  { month: 'Nov', donations: 180, meals: 3600, co2: 1800 },
  { month: 'Dec', donations: 210, meals: 4200, co2: 2100 },
  { month: 'Jan', donations: 195, meals: 3900, co2: 1950 },
];

const categoryData = [
  { name: 'Cooked', value: 4200, color: '#6366f1' },
  { name: 'Packaged', value: 3100, color: '#8b5cf6' },
  { name: 'Fresh Produce', value: 2400, color: '#10b981' },
  { name: 'Bakery', value: 1500, color: '#f59e0b' },
  { name: 'Dairy', value: 900, color: '#06b6d4' },
];

const cityData = [
  { city: 'Mumbai', kg: 2400 },
  { city: 'Delhi', kg: 1800 },
  { city: 'Bangalore', kg: 1500 },
  { city: 'Chennai', kg: 1200 },
  { city: 'Pune', kg: 900 },
  { city: 'Hyderabad', kg: 800 },
];

const deliveryStats = [
  { name: 'Under 1hr', value: 35, color: '#10b981' },
  { name: '1-2 hrs', value: 40, color: '#6366f1' },
  { name: '2-4 hrs', value: 18, color: '#f59e0b' },
  { name: '4+ hrs', value: 7, color: '#ef4444' },
];

const tooltipStyle = {
  background: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(148, 163, 184, 0.1)',
  borderRadius: 12,
  color: '#e2e8f0',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-indigo-400" />
          Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">Comprehensive platform metrics and impact analysis</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Weight', value: '12.8 tons', icon: Package, color: 'indigo' },
          { label: 'Meals Served', value: '25,600', icon: Utensils, color: 'emerald' },
          { label: 'CO₂ Saved', value: '32 tons', icon: Globe, color: 'cyan' },
          { label: 'Deliveries', value: '1,150', icon: Truck, color: 'purple' },
          { label: 'Active NGOs', value: '48', icon: Users, color: 'amber' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5 text-center">
            <stat.icon className={`w-6 h-6 mx-auto mb-2 text-${stat.color}-400`} style={{ color: `var(--accent-${stat.color})` }} />
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Donations Trend */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-white mb-6">Donation Volume Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="donations" stroke="#6366f1" fill="url(#gArea)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Meals & CO2 */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-white mb-6">Meals Saved vs CO₂ Reduced</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="meals" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="co2" stroke="#06b6d4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* City Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-white mb-6">Top Cities (kg)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cityData} layout="vertical">
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis type="category" dataKey="city" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="kg" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Delivery Times */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-white mb-6">Delivery Time Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={deliveryStats} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {deliveryStats.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {deliveryStats.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-slate-400">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
