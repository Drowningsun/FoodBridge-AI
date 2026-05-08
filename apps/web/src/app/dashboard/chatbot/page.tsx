'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, User, Sparkles, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const botResponses: Record<string, string> = {
  donate: '🍽️ **How to Donate Food:**\n\n1. Go to **Dashboard → Donations**\n2. Click **"New Donation"**\n3. Fill in food details, quantity, and pickup address\n4. Upload a food image for AI freshness check\n5. Our system will match you with the nearest NGO!\n\nDonations are typically picked up within 2-4 hours.',
  ngo: '🏢 **NGO Registration:**\n\nNGOs can register on FoodBridge AI to receive food donations:\n\n1. Create account with role **"NGO"**\n2. Fill in organization details and capacity\n3. Set food preferences and service area\n4. Get automatically matched with donors!\n\nOur AI matching scores consider distance, capacity, and preferences.',
  predict: '🧠 **AI Prediction:**\n\nOur ML model predicts leftover food from events:\n\n- **Input:** Event type, guest count, cuisine, weather\n- **Output:** Predicted surplus (kg), confidence score\n- **Accuracy:** ~85% within 20% error margin\n\nGo to **Dashboard → AI Predict** to try it!',
  volunteer: '🚗 **Volunteering:**\n\nVolunteers help deliver food from donors to NGOs:\n\n- Sign up as a **Volunteer**\n- Get assigned pickup deliveries\n- Follow optimized routes\n- Earn **50 points** per delivery\n- Climb the leaderboard!\n\nTop volunteers get special recognition.',
  impact: '🌍 **Our Impact:**\n\n- **125,000+** meals redistributed\n- **62.5 tons** of food saved\n- **156 tons** CO₂ emissions prevented\n- **500+** active partners\n\nEvery donation makes a difference!',
  freshness: '📸 **Freshness Detection:**\n\nUpload a food image and our AI will:\n\n- Analyze color, texture, and signs of spoilage\n- Give a **freshness score** (0-100)\n- Classify as Fresh, Stale, or Spoiled\n- Provide safety recommendations\n\nThis helps ensure only safe food is donated.',
  route: '🗺️ **Route Optimization:**\n\nOur system optimizes delivery routes:\n\n- Uses **Nearest-Neighbor + 2-opt** algorithm\n- Minimizes total distance and time\n- Supports multi-stop pickups\n- Real-time route tracking\n\nVolunteers see optimized routes on their dashboard.',
};

const defaultResponse = "I'm the FoodBridge AI assistant! 🤖 I can help you with:\n\n• **donate** - How to donate food\n• **ngo** - NGO registration\n• **predict** - AI prediction feature\n• **volunteer** - Volunteering info\n• **impact** - Our platform impact\n• **freshness** - Food freshness detection\n• **route** - Route optimization\n\nJust type a keyword or ask a question!";

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hello! I'm the FoodBridge AI assistant. 🌿 How can I help you today?\n\nYou can ask me about donating food, NGO registration, AI predictions, volunteering, or any other feature!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Find matching response
    const lower = input.toLowerCase();
    let response = defaultResponse;
    for (const [key, value] of Object.entries(botResponses)) {
      if (lower.includes(key)) {
        response = value;
        break;
      }
    }

    // Simulate typing delay
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);

    setInput('');
  };

  return (
    <div className="fade-in h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bot className="w-7 h-7 text-indigo-400" />
            AI Chat Assistant
          </h1>
          <p className="text-sm text-slate-400 mt-1">Get instant help with FoodBridge AI features</p>
        </div>
        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-all"
        >
          <Trash2 className="w-4 h-4" /> Clear
        </button>
      </div>

      <div className="glass-card flex flex-col h-[calc(100%-5rem)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'bot' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
              )}
              <div
                className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-500/20 text-indigo-100 rounded-br-md'
                    : 'bg-slate-800/50 text-slate-300 rounded-bl-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className="text-xs text-slate-600 mt-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-purple-400" />
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="input-field flex-1"
              placeholder="Ask me anything about FoodBridge AI..."
            />
            <button
              onClick={handleSend}
              className="btn-glow px-5 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            {['How to donate?', 'AI prediction', 'Volunteer info', 'Our impact'].map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 bg-slate-800/30 hover:bg-slate-800 hover:text-white transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
