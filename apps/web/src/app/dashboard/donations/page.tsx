'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Plus, Search, Filter, MapPin,
  Clock, ChevronRight, Upload, X, Camera,
} from 'lucide-react';
import toast from 'react-hot-toast';

const mockDonations = [
  { id: 'DON-1001', title: 'Wedding Buffet Surplus', category: 'cooked', quantity_kg: 45, status: 'delivered', donor: 'Grand Taj Hotel', city: 'Mumbai', created_at: '2025-01-15T10:30:00', ngo: 'Hope Foundation' },
  { id: 'DON-1002', title: 'Corporate Lunch', category: 'cooked', quantity_kg: 22, status: 'in_transit', donor: 'TechPark Cafe', city: 'Bangalore', created_at: '2025-01-15T09:00:00', ngo: 'Akshaya Patra' },
  { id: 'DON-1003', title: 'Fresh Vegetables', category: 'fresh_produce', quantity_kg: 15, status: 'ngo_matched', donor: 'FreshMart', city: 'Delhi', created_at: '2025-01-15T08:00:00', ngo: 'Feeding India' },
  { id: 'DON-1004', title: 'Bakery Surplus', category: 'bakery', quantity_kg: 8, status: 'ai_verified', donor: 'Sweet Delights', city: 'Pune', created_at: '2025-01-14T18:00:00', ngo: null },
  { id: 'DON-1005', title: 'Packaged Rice & Dal', category: 'packaged', quantity_kg: 50, status: 'pending', donor: 'Food Warehouse', city: 'Chennai', created_at: '2025-01-14T14:00:00', ngo: null },
  { id: 'DON-1006', title: 'Birthday Party Leftovers', category: 'cooked', quantity_kg: 12, status: 'delivered', donor: 'Private Donor', city: 'Hyderabad', created_at: '2025-01-14T12:00:00', ngo: 'Robin Hood Army' },
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

export default function DonationsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockDonations.filter((d) => {
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Donations</h1>
          <p className="text-sm text-slate-400">Manage and track all food donations</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-glow flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> New Donation
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
            placeholder="Search donations..."
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'ai_verified', 'ngo_matched', 'in_transit', 'delivered'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-800/30 border border-transparent'
              }`}
            >
              {s === 'all' ? 'All' : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Donations List */}
      <div className="space-y-3">
        {filtered.map((donation, i) => (
          <motion.div
            key={donation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5 flex items-center justify-between hover:border-indigo-500/30 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">{donation.title}</span>
                  <span className="text-xs text-slate-600">{donation.id}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>{donation.donor}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{donation.city}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(donation.created_at).toLocaleDateString()}</span>
                  <span className="font-medium text-slate-400">{donation.quantity_kg} kg</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {donation.ngo && <span className="text-xs text-purple-400">{donation.ngo}</span>}
              <span className={`status-badge ${statusColors[donation.status]}`}>
                {statusLabels[donation.status]}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Create New Donation</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); toast.success('Donation created!'); setShowCreate(false); }} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Food Title</label>
                <input className="input-field" placeholder="e.g., Wedding Buffet Surplus" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Category</label>
                  <select className="input-field">
                    <option value="cooked">Cooked Food</option>
                    <option value="fresh_produce">Fresh Produce</option>
                    <option value="packaged">Packaged</option>
                    <option value="bakery">Bakery</option>
                    <option value="dairy">Dairy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Quantity (kg)</label>
                  <input type="number" className="input-field" placeholder="25" min="1" required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Pickup Address</label>
                <input className="input-field" placeholder="Full address" required />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Description</label>
                <textarea className="input-field" rows={3} placeholder="Describe the food..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Food Image</label>
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-indigo-500/30 transition-colors cursor-pointer">
                  <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-600">JPEG, PNG, WebP (max 10MB)</p>
                </div>
              </div>
              <button type="submit" className="btn-glow w-full py-3">Create Donation</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
