'use client';

import { motion } from 'framer-motion';
import { Users, MapPin, Star, Package, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

const mockMatches = [
  { id: 1, donation: { title: 'Wedding Buffet Surplus', quantity: 45, category: 'Cooked' }, ngo: { name: 'Hope Foundation', distance: 2.3, rating: 4.8, capacity: 100 }, score: 98, status: 'recommended' },
  { id: 2, donation: { title: 'Corporate Lunch', quantity: 22, category: 'Cooked' }, ngo: { name: 'Akshaya Patra', distance: 4.1, rating: 4.9, capacity: 500 }, score: 92, status: 'recommended' },
  { id: 3, donation: { title: 'Fresh Vegetables', quantity: 15, category: 'Produce' }, ngo: { name: 'Feeding India', distance: 1.8, rating: 4.6, capacity: 200 }, score: 95, status: 'accepted' },
  { id: 4, donation: { title: 'Bakery Items', quantity: 8, category: 'Bakery' }, ngo: { name: 'Robin Hood Army', distance: 3.5, rating: 4.7, capacity: 150 }, score: 88, status: 'recommended' },
];

export default function MatchingPage() {
  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="w-7 h-7 text-purple-400" />NGO Matching Engine
        </h1>
        <p className="text-sm text-slate-400 mt-1">AI-powered matching between donations and NGOs</p>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-white mb-4">Scoring Weights</h3>
        <div className="grid grid-cols-5 gap-4">
          {[{ label: 'Distance', weight: '40%', color: '#6366f1' }, { label: 'Capacity', weight: '20%', color: '#8b5cf6' }, { label: 'Preferences', weight: '15%', color: '#10b981' }, { label: 'Urgency', weight: '15%', color: '#f59e0b' }, { label: 'Rating', weight: '10%', color: '#06b6d4' }].map((w) => (
            <div key={w.label} className="text-center">
              <div className="text-xl font-bold" style={{ color: w.color }}>{w.weight}</div>
              <div className="text-xs text-slate-500 mt-1">{w.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {mockMatches.map((match, i) => (
          <motion.div key={match.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <span className="text-2xl font-bold text-indigo-400">{match.score}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-white">{match.donation.title}</span>
                  <span className="text-xs text-slate-500">{match.donation.quantity}kg</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">{match.ngo.name}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{match.ngo.distance}km</span>
                  <span className="text-xs text-amber-400 flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" />{match.ngo.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`status-badge ${match.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                {match.status === 'accepted' ? <CheckCircle2 className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
              </span>
              {match.status === 'recommended' && <button className="btn-glow text-xs py-2 px-4">Accept</button>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
