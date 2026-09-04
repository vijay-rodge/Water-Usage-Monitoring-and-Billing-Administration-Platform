import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, Droplets, HelpCircle, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FloatingAssistant = () => {
  const { role, showToast } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi! I'm AquaBot, your smart water conservation & billing assistant. How can I help you understand your tariff, bills, or anomaly alerts today?"
    }
  ]);

  const quickPrompts = [
    "How is my bill calculated?",
    "Why was a leak alert triggered?",
    "Ways to reduce monthly usage",
    "How does tanker cost split work?"
  ];

  const handleSend = (userText = null) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const newMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, newMsg]);
    if (!userText) setInput('');

    setTimeout(() => {
      let reply = "I'm analyzing your real-time sub-meter telemetry and tiered tariff configuration.";
      const lower = textToSend.toLowerCase();

      if (lower.includes('bill') || lower.includes('calculate')) {
        reply = "Your water bill is computed using 4 progressive tiers: Tier 1 is ₹5/kL for the first 1,000L, and Tier 2 excess is ₹8/kL. Fixed connection charges (₹150) and STP sewage maintenance are added automatically.";
      } else if (lower.includes('leak') || lower.includes('alert')) {
        reply = "Our anomaly radar scans continuous water flows between 2:00 AM and 5:00 AM. When steady night trickles exceed 50 L/hr, an automated leak alert is flagged to prevent water wastage.";
      } else if (lower.includes('tanker') || lower.includes('split')) {
        reply = "Shared bulk tanker water is apportioned based on flat carpet area (Sq.Ft). Your unit accounts for its fair share of the society's total bulk water purchase.";
      } else if (lower.includes('reduce') || lower.includes('save')) {
        reply = "💡 Top 3 Tips: 1) Install low-flow aerators on taps (saves 30%), 2) Check toilet cistern flapper valves for invisible leaks, 3) Run washing machines on full loads.";
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] sm:w-96 max-w-sm bg-white border border-slate-200/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[480px] max-h-[80vh]">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg">
                💧
              </div>
              <div>
                <h4 className="font-bold text-sm">AquaBot AI Assistant</h4>
                <p className="text-[10px] text-cyan-100 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online • IoT Telemetry Sync</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 whitespace-nowrap transition shrink-0 cursor-pointer font-medium"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-100 flex items-center space-x-2 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about water usage..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating 3D Robot Mascot Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition cursor-pointer text-2xl relative group"
        title="Chat with WaterBot AI Assistant"
      >
        <span className="animate-bounce select-none">🤖</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
      </button>
    </div>
  );
};
