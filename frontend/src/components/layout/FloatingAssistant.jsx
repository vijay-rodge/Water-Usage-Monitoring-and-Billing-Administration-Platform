import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Droplets } from 'lucide-react';

export const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your WaterGuard AI Assistant. How can I help you manage your water usage or understand your bill today?'
    }
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    'How is my tiered bill calculated?',
    'Check if my flat has a leak',
    'Explain late fee rules',
    'Tips to reduce water bill'
  ];

  const handleSend = (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMsgs);
    setInput('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let botReply = "I am monitoring your apartment's smart sub-meters. Everything looks nominal and within standard consumption limits!";
      const lower = textToSend.toLowerCase();

      if (lower.includes('tier') || lower.includes('calculate') || lower.includes('bill')) {
        botReply = "Your bill uses a 2-tier progressive model: Tier 1 (up to 1,000 L) is charged at ₹5/L, and Tier 2 excess is charged at ₹8/L. Late payment surcharge is ₹50/month.";
      } else if (lower.includes('leak') || lower.includes('anomaly')) {
        botReply = "Your current 24-hour reading is stable at ~430 Liters/day with zero continuous night flows detected. No active leaks detected in your flat!";
      } else if (lower.includes('tip') || lower.includes('reduce') || lower.includes('save')) {
        botReply = "Top water saving tip: Fixing a slow flush leak can save over 600 Liters per day and keep your consumption safely inside the low Tier 1 pricing bracket.";
      }

      setMessages([...newMsgs, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chatbox Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[450px] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none">WaterBot AI</h4>
                <span className="text-[10px] text-cyan-100 flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Online • Smart Assistant</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px]">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium whitespace-nowrap transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask WaterBot anything..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Robot Mascot Button (Matching Screenshot) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-blue-400 shadow-xl hover:scale-105 transition-all p-1"
        title="Chat with WaterBot AI"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-2xl shadow-inner animate-pulse">
          🤖
        </div>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
        )}
      </button>
    </div>
  );
};

