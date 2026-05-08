'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Sparkles, Users, Cloud, Utensils, Clock,
  TrendingUp, Lightbulb, BarChart3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip,
} from 'recharts';

interface PredictionResult {
  predicted_quantity_kg: number;
  confidence_score: number;
  estimated_servings: number;
  waste_percentage: number;
  recommendations: string[];
  model_version: string;
}

export default function PredictPage() {
  const [form, setForm] = useState({
    event_type: 'wedding',
    guest_count: 200,
    menu_type: 'mixed',
    cuisine_type: 'indian',
    weather: 'clear',
    day_of_week: 6,
    hour: 19,
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8001'}/predict-leftover`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error('Prediction failed');
      const data = await res.json();
      setResult(data);
      toast.success('Prediction complete!');
    } catch {
      // Use mock data for demo
      setResult({
        predicted_quantity_kg: 32.5,
        confidence_score: 0.87,
        estimated_servings: 65,
        waste_percentage: 27.3,
        recommendations: [
          'Consider reducing portion sizes by 10-15%',
          'Use RSVP confirmation to get accurate headcount',
          'Partner with a local NGO for immediate redistribution',
          'Donate surplus through FoodBridge AI to prevent waste',
        ],
        model_version: 'v2.0-heuristic',
      });
      toast.success('Prediction complete! (demo mode)');
    } finally {
      setLoading(false);
    }
  };

  const radarData = result
    ? [
        { factor: 'Quantity', value: Math.min(result.predicted_quantity_kg * 2, 100) },
        { factor: 'Confidence', value: result.confidence_score * 100 },
        { factor: 'Servings', value: Math.min(result.estimated_servings, 100) },
        { factor: 'Waste Rate', value: result.waste_percentage },
        { factor: 'Efficiency', value: (1 - result.waste_percentage / 100) * 100 },
      ]
    : [];

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Brain className="w-7 h-7 text-indigo-400" />
          AI Leftover Prediction
        </h1>
        <p className="text-sm text-slate-400 mt-1">Predict surplus food from your events with machine learning</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="glass-card p-8">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Event Details
          </h2>

          <form onSubmit={handlePredict} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  <Utensils className="w-3.5 h-3.5 inline mr-1" />
                  Event Type
                </label>
                <select
                  value={form.event_type}
                  onChange={(e) => setForm({ ...form, event_type: e.target.value })}
                  className="input-field"
                >
                  {['wedding', 'corporate', 'birthday', 'buffet', 'casual_dining', 'festival', 'conference', 'party'].map((t) => (
                    <option key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  <Users className="w-3.5 h-3.5 inline mr-1" />
                  Guest Count
                </label>
                <input
                  type="number"
                  value={form.guest_count}
                  onChange={(e) => setForm({ ...form, guest_count: parseInt(e.target.value) })}
                  className="input-field"
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Menu Type</label>
                <select value={form.menu_type} onChange={(e) => setForm({ ...form, menu_type: e.target.value })} className="input-field">
                  <option value="veg">Vegetarian</option>
                  <option value="non_veg">Non-Vegetarian</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Cuisine</label>
                <select value={form.cuisine_type} onChange={(e) => setForm({ ...form, cuisine_type: e.target.value })} className="input-field">
                  {['indian', 'chinese', 'italian', 'mexican', 'continental', 'japanese', 'thai'].map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  <Cloud className="w-3.5 h-3.5 inline mr-1" />
                  Weather
                </label>
                <select value={form.weather} onChange={(e) => setForm({ ...form, weather: e.target.value })} className="input-field">
                  {['clear', 'rainy', 'hot', 'cold', 'humid'].map((w) => (
                    <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Day</label>
                <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: parseInt(e.target.value) })} className="input-field">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                    <option key={d} value={i}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  Hour
                </label>
                <input
                  type="number"
                  value={form.hour}
                  onChange={(e) => setForm({ ...form, hour: parseInt(e.target.value) })}
                  className="input-field"
                  min={0}
                  max={23}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Predict Leftovers
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Main Result */}
            <div className="glass-card p-8">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                Prediction Results
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-indigo-500/10 text-center">
                  <div className="text-3xl font-bold text-indigo-400">{result.predicted_quantity_kg}</div>
                  <div className="text-xs text-slate-400 mt-1">Predicted Surplus (kg)</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 text-center">
                  <div className="text-3xl font-bold text-emerald-400">{Math.round(result.confidence_score * 100)}%</div>
                  <div className="text-xs text-slate-400 mt-1">Confidence</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10 text-center">
                  <div className="text-3xl font-bold text-purple-400">{result.estimated_servings}</div>
                  <div className="text-xs text-slate-400 mt-1">Estimated Servings</div>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 text-center">
                  <div className="text-3xl font-bold text-amber-400">{result.waste_percentage}%</div>
                  <div className="text-xs text-slate-400 mt-1">Waste Rate</div>
                </div>
              </div>

              {/* Radar Chart */}
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(148, 163, 184, 0.1)" />
                  <PolarAngleAxis dataKey="factor" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Recommendations */}
            <div className="glass-card p-6">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                AI Recommendations
              </h3>
              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-xs text-indigo-400 font-bold mt-0.5">
                      {i + 1}
                    </span>
                    {rec}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/50 text-xs text-slate-600">
                Model: {result.model_version}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass-card p-8 flex items-center justify-center">
            <div className="text-center">
              <Brain className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-500 mb-2">Enter Event Details</h3>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                Fill in the event parameters on the left and our AI will predict the expected surplus food quantity.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
