'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain, Truck, Users, BarChart3, Shield, MapPin,
  Utensils, Leaf, ArrowRight, CheckCircle2, Sparkles,
  ChevronDown, Heart, Globe, Zap, Camera, Bot,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center pt-24">
        {/* Animated background */}
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }}>
          <div className="blob w-96 h-96 bg-indigo-600 top-20 left-10" />
          <div className="blob w-80 h-80 bg-purple-600 top-40 right-20" style={{ animationDelay: '-7s' }} />
          <div className="blob w-72 h-72 bg-emerald-600 bottom-20 left-1/3" style={{ animationDelay: '-14s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300">AI-Powered Food Waste Solution</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-white">Reduce Food</span>
              <br />
              <span className="gradient-text">Waste with AI</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Connect surplus food from restaurants, hotels, and events with NGOs and volunteers. 
              Our AI predicts leftovers, detects freshness, and optimizes delivery routes — 
              saving meals and the planet.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href="/register" className="btn-glow flex items-center gap-2 text-base">
                Start Donating <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-300 hover:text-white transition-colors" style={{ border: '1px solid rgba(148, 163, 184, 0.15)' }}>
                See How It Works
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-8 pt-4">
              {[
                { value: '50K+', label: 'Meals Saved' },
                { value: '200+', label: 'NGOs Connected' },
                { value: '95%', label: 'AI Accuracy' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="glass-card p-8 space-y-6">
              {/* Prediction card */}
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-indigo-400" />
                  <div>
                    <div className="text-sm font-semibold text-white">AI Prediction</div>
                    <div className="text-xs text-slate-400">Wedding Event • 300 guests</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-400">45.2 kg</div>
                  <div className="text-xs text-slate-500">predicted surplus</div>
                </div>
              </div>

              {/* Freshness card */}
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <div className="flex items-center gap-3">
                  <Camera className="w-8 h-8 text-emerald-400" />
                  <div>
                    <div className="text-sm font-semibold text-white">Freshness Check</div>
                    <div className="text-xs text-slate-400">Image analyzed</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-400">92%</div>
                  <div className="text-xs text-emerald-500">Fresh ✓</div>
                </div>
              </div>

              {/* Matching card */}
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <div className="flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-purple-400" />
                  <div>
                    <div className="text-sm font-semibold text-white">NGO Matched</div>
                    <div className="text-xs text-slate-400">Hope Foundation • 2.3 km</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-400">98%</div>
                  <div className="text-xs text-slate-500">match score</div>
                </div>
              </div>

              {/* Status tracker */}
              <div className="flex items-center gap-3 pt-2">
                {['Verified', 'Matched', 'Pickup', 'Delivered'].map((step, i) => (
                  <div key={step} className="flex-1">
                    <div className={`h-1.5 rounded-full ${i <= 2 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-700'}`} />
                    <div className="text-xs text-slate-500 mt-1.5 text-center">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-slate-600" />
        </motion.div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300">Powerful Features</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Everything You Need to{' '}
              <span className="gradient-text">Fight Food Waste</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
              Our platform combines AI, smart logistics, and community power to create
              an efficient food redistribution ecosystem.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Brain, title: 'AI Leftover Prediction', desc: 'Predict surplus food quantity from events using machine learning — guest count, weather, cuisine type, and more.', color: 'indigo' },
              { icon: Camera, title: 'Freshness Detection', desc: 'Upload food images for instant AI-powered spoilage detection. Get safety scores and freshness analysis.', color: 'emerald' },
              { icon: Users, title: 'Smart NGO Matching', desc: 'Automatically match donations to the nearest, most suitable NGO using weighted scoring — distance, capacity, preferences.', color: 'purple' },
              { icon: Truck, title: 'Route Optimization', desc: 'Optimize multi-stop pickup routes using A* and 2-opt algorithms. Minimize delivery time and fuel costs.', color: 'cyan' },
              { icon: BarChart3, title: 'Impact Analytics', desc: 'Track meals saved, CO2 reduced, and community impact with beautiful real-time dashboards and reports.', color: 'amber' },
              { icon: Bot, title: 'AI Chatbot Assistant', desc: 'Get instant help with donation guidance, NGO registration, volunteer coordination, and platform navigation.', color: 'rose' },
            ].map((feature, i) => {
              const colorMap: Record<string, string> = {
                indigo: 'rgba(99, 102, 241, 0.1)',
                emerald: 'rgba(16, 185, 129, 0.1)',
                purple: 'rgba(139, 92, 246, 0.1)',
                cyan: 'rgba(6, 182, 212, 0.1)',
                amber: 'rgba(245, 158, 11, 0.1)',
                rose: 'rgba(244, 63, 94, 0.1)',
              };
              const textColorMap: Record<string, string> = {
                indigo: 'text-indigo-400',
                emerald: 'text-emerald-400',
                purple: 'text-purple-400',
                cyan: 'text-cyan-400',
                amber: 'text-amber-400',
                rose: 'text-rose-400',
              };

              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="glass-card p-8 group cursor-pointer"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: colorMap[feature.color] }}
                  >
                    <feature.icon className={`w-7 h-7 ${textColorMap[feature.color]}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-32" style={{ background: 'rgba(17, 24, 39, 0.5)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-20">
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-white mb-6">
              How <span className="gradient-text">FoodBridge AI</span> Works
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
              From surplus food to fed communities in four simple steps.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'List Surplus', desc: 'Donors list surplus food with details, images, and pickup location.', icon: Utensils, color: 'indigo' },
              { step: '02', title: 'AI Verifies', desc: 'Our AI checks food freshness and predicts optimal redistribution.', icon: Brain, color: 'purple' },
              { step: '03', title: 'NGO Matched', desc: 'Smart algorithm matches food to the nearest, most suitable NGO.', icon: Heart, color: 'emerald' },
              { step: '04', title: 'Delivered', desc: 'Volunteer picks up and delivers via optimized route. Impact tracked!', icon: Truck, color: 'cyan' },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeUp} className="relative text-center">
                <div className="text-6xl font-black text-slate-800/50 mb-4">{item.step}</div>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
                  <item.icon className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== IMPACT ========== */}
      <section id="impact" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-20">
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Our <span className="gradient-text">Impact</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { value: '125,000+', label: 'Meals Redistributed', icon: Utensils, color: 'emerald' },
              { value: '62.5 tons', label: 'Food Saved', icon: Leaf, color: 'green' },
              { value: '156 tons', label: 'CO₂ Prevented', icon: Globe, color: 'cyan' },
              { value: '500+', label: 'Active Partners', icon: Users, color: 'purple' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="glass-card p-8 text-center">
                <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-32" style={{ background: 'rgba(17, 24, 39, 0.5)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-4xl font-bold text-white text-center mb-16">
            What Our <span className="gradient-text">Community</span> Says
          </motion.h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Sharma', role: 'Restaurant Owner', quote: 'FoodBridge AI helped us redirect over 200kg of surplus food last month. The AI prediction is remarkably accurate!', avatar: '👩‍🍳' },
              { name: 'Rajesh Kumar', role: 'NGO Director', quote: 'The matching system saves us hours of coordination. We now receive perfectly matched donations within minutes.', avatar: '👨‍💼' },
              { name: 'Anita Patel', role: 'Volunteer Driver', quote: 'Route optimization cut my delivery time by 40%. The points system keeps me motivated to help more!', avatar: '🚗' },
            ].map((testimonial) => (
              <motion.div key={testimonial.name} variants={fadeUp} className="glass-card p-8">
                <p className="text-slate-300 mb-6 leading-relaxed italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="text-sm font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="py-32">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-4xl font-bold text-white text-center mb-16">
            Frequently Asked <span className="gradient-text">Questions</span>
          </motion.h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-4">
            {[
              { q: 'How does the AI predict leftover food?', a: 'Our ML model analyzes event type, guest count, weather, cuisine type, and historical data to predict surplus food quantity with ~85% accuracy.' },
              { q: 'Is the food freshness detection accurate?', a: 'Our computer vision system analyzes food images for discoloration, mold, and texture degradation. It provides a freshness score and safety classification.' },
              { q: 'How are NGOs matched with donations?', a: 'We use a weighted scoring algorithm considering distance (40%), capacity (20%), food preferences (15%), urgency (15%), and NGO rating (10%).' },
              { q: 'How do volunteers earn points?', a: 'Volunteers earn 50 points per successful delivery. Points unlock badges and appear on the leaderboard. Top volunteers get recognition and rewards.' },
              { q: 'Is FoodBridge AI free to use?', a: 'Yes! FoodBridge AI is completely free for donors, NGOs, and volunteers. Our mission is to reduce food waste and feed communities.' },
            ].map((faq) => (
              <motion.details key={faq.q} variants={fadeUp} className="glass-card p-6 group cursor-pointer">
                <summary className="flex items-center justify-between text-white font-medium list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-sm text-slate-400 mt-4 leading-relaxed">{faq.a}</p>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="glass-card p-16 relative overflow-hidden"
          >
            <div className="blob w-64 h-64 bg-indigo-600 -top-20 -right-20 opacity-20" />
            <div className="blob w-48 h-48 bg-purple-600 -bottom-10 -left-10 opacity-20" style={{ animationDelay: '-5s' }} />

            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-white mb-4 relative z-10">
              Ready to Make a <span className="gradient-text">Difference</span>?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-400 mb-8 max-w-xl mx-auto relative z-10">
              Join thousands of donors, NGOs, and volunteers who are already reducing food waste with AI.
            </motion.p>
            <motion.div variants={fadeUp} className="flex justify-center gap-4 relative z-10">
              <Link href="/register" className="btn-glow flex items-center gap-2 text-lg px-8 py-4">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
