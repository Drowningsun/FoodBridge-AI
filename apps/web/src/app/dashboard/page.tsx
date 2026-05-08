'use client';

import { motion } from 'framer-motion';
import {
  Package, Users, Truck, TrendingUp, ArrowUpRight,
  ArrowDownRight, Utensils, Leaf, Brain, MapPin,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stats = [
  { label: 'Total Donations', value: '1,247', change: '+12.5%', up: true, icon: Package, color: 'indigo' },
  { label: 'Meals Saved', value: '18,430', change: '+23.1%', up: true, icon: Utensils, color: 'emerald' },
  { label: 'Active NGOs', value: '48', change: '+4', up: true, icon: Users, color: 'purple' },
  { label: 'CO₂ Reduced', value: '4.2 tons', change: '+8.7%', up: true, icon: Leaf, color: 'cyan' },
];

const donationTrend = [
  { month: 'Jan', donations: 85, delivered: 78 },
  { month: 'Feb', donations: 120, delivered: 112 },
  { month: 'Mar', donations: 98, delivered: 95 },
  { month: 'Apr', donations: 150, delivered: 140 },
  { month: 'May', donations: 180, delivered: 168 },
  { month: 'Jun', donations: 210, delivered: 195 },
  { month: 'Jul', donations: 195, delivered: 190 },
];

const categoryData = [
  { name: 'Cooked', value: 35, color: '#6366f1' },
  { name: 'Packaged', value: 25, color: '#8b5cf6' },
  { name: 'Fresh Produce', value: 20, color: '#10b981' },
  { name: 'Bakery', value: 12, color: '#f59e0b' },
  { name: 'Dairy', value: 8, color: '#06b6d4' },
];

const weeklyData = [
  { day: 'Mon', kg: 42 },
  { day: 'Tue', kg: 58 },
  { day: 'Wed', kg: 35 },
  { day: 'Thu', kg: 67 },
  { day: 'Fri', kg: 89 },
  { day: 'Sat', kg: 120 },
  { day: 'Sun', kg: 95 },
];

const recentDonations = [
  { id: 'DON-1247', title: 'Wedding Buffet Surplus', donor: 'Grand Taj Hotel', status: 'delivered', kg: 45, time: '2h ago' },
  { id: 'DON-1246', title: 'Corporate Lunch Leftovers', donor: 'TechPark Cafeteria', status: 'in_transit', kg: 22, time: '3h ago' },
  { id: 'DON-1245', title: 'Fresh Vegetables', donor: 'FreshMart Store', status: 'ngo_matched', kg: 15, time: '5h ago' },
  { id: 'DON-1244', title: 'Bakery Items', donor: 'Sweet Delights', status: 'ai_verified', kg: 8, time: '6h ago' },
  { id: 'DON-1243', title: 'Packaged Rice', donor: 'Food Warehouse', status: 'pending', kg: 50, time: '8h ago' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  ai_verified: 'bg-blue-500/20 text-blue-400',
  ngo_matched: 'bg-purple-500/20 text-purple-400',
  in_transit: 'bg-cyan-500/20 text-cyan-400',
  delivered: 'bg-emerald-500/20 text-emerald-400',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  ai_verified: 'AI Verified',
  ngo_matched: 'Matched',
  in_transit: 'In Transit',
  delivered: 'Delivered',
};

export default function DashboardOverview() {
  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-slate-400">Welcome back! Here&apos;s your impact overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        {stats.map((stat) => {
          const bgMap: Record<string, string> = {
            indigo: 'rgba(99, 102, 241, 0.1)',
            emerald: 'rgba(16, 185, 129, 0.1)',
            purple: 'rgba(139, 92, 246, 0.1)',
            cyan: 'rgba(6, 182, 212, 0.1)',
          };
          const textMap: Record<string, string> = {
            indigo: 'text-indigo-400',
            emerald: 'text-emerald-400',
            purple: 'text-purple-400',
            cyan: 'text-cyan-400',
          };

          return (
            <div key={stat.label} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bgMap[stat.color] }}>
                  <stat.icon className={`w-5 h-5 ${textMap[stat.color]}`} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Donation Trend */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Donation Trends</h3>
              <p className="text-xs text-slate-500">Monthly donations vs delivered</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Donations</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Delivered</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={donationTrend}>
              <defs>
                <linearGradient id="gDonation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDelivered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: 12, color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="donations" stroke="#6366f1" fill="url(#gDonation)" strokeWidth={2} />
              <Area type="monotone" dataKey="delivered" stroke="#10b981" fill="url(#gDelivered)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-white mb-6">Food Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: 12, color: '#e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                  {cat.name}
                </span>
                <span className="text-slate-500">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Volume */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-white mb-6">Weekly Volume (kg)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: 12, color: '#e2e8f0' }}
              />
              <Bar dataKey="kg" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Donations */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-white">Recent Donations</h3>
            <a href="/dashboard/donations" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</a>
          </div>
          <div className="space-y-3">
            {recentDonations.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{d.title}</div>
                    <div className="text-xs text-slate-500">{d.donor} • {d.kg}kg</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`status-badge ${statusColors[d.status]}`}>
                    {statusLabels[d.status]}
                  </span>
                  <div className="text-xs text-slate-600 mt-1">{d.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
