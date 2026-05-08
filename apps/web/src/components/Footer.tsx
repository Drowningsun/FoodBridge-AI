'use client';

import Link from 'next/link';
import { Leaf, Globe, MessageCircle, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-32" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">FoodBridge AI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Reducing food waste through AI-powered redistribution. Connecting donors with NGOs to
              feed communities in need.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <div className="space-y-3">
              {['Donate Food', 'Find NGOs', 'Volunteer', 'AI Prediction', 'Track Delivery'].map((item) => (
                <a key={item} href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <div className="space-y-3">
              {['API Documentation', 'How It Works', 'Impact Report', 'Blog', 'Community'].map((item) => (
                <a key={item} href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <div className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact Us'].map((item) => (
                <a key={item} href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.06)' }}>
          <p className="text-sm text-slate-500">
            © 2025 FoodBridge AI. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for a hunger-free world
          </p>
        </div>
      </div>
    </footer>
  );
}
