'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Package, Users, Truck, Brain } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'donation', title: 'New donation matched!', message: 'Wedding Buffet Surplus matched with Hope Foundation', time: '5 min ago', read: false },
  { id: 2, type: 'delivery', title: 'Delivery completed', message: 'DON-1245 delivered to Feeding India successfully', time: '1h ago', read: false },
  { id: 3, type: 'ai', title: 'AI Prediction ready', message: 'Corporate event prediction: 22.5kg surplus expected', time: '2h ago', read: false },
  { id: 4, type: 'matching', title: 'NGO accepted donation', message: 'Akshaya Patra accepted your donation DON-1002', time: '3h ago', read: true },
  { id: 5, type: 'delivery', title: 'Volunteer assigned', message: 'Raj Kumar assigned for pickup at TechPark', time: '5h ago', read: true },
  { id: 6, type: 'donation', title: 'Donation verified', message: 'Fresh Vegetables passed AI freshness check (92%)', time: '6h ago', read: true },
];

const iconMap: Record<string, typeof Bell> = { donation: Package, delivery: Truck, ai: Brain, matching: Users };
const colorMap: Record<string, string> = { donation: 'text-indigo-400 bg-indigo-500/10', delivery: 'text-emerald-400 bg-emerald-500/10', ai: 'text-purple-400 bg-purple-500/10', matching: 'text-cyan-400 bg-cyan-500/10' };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bell className="w-7 h-7 text-indigo-400" />Notifications
            {unreadCount > 0 && <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">{unreadCount} new</span>}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Stay updated on your donations and deliveries</p>
        </div>
        <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-all">
          <CheckCheck className="w-4 h-4" />Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => {
          const Icon = iconMap[n.type] || Bell;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`glass-card p-5 flex items-center gap-4 cursor-pointer ${!n.read ? 'border-indigo-500/20' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[n.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{n.title}</span>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
              </div>
              <span className="text-xs text-slate-600">{n.time}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
