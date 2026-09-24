import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Droplets, 
  HelpCircle, 
  ChevronUp, 
  Settings, 
  RotateCcw, 
  Key, 
  Check, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const FloatingAssistant = () => {
  const { user, role, showToast } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Gemini Settings stored in localStorage
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('aquaflow_gemini_api_key') || '');
  const [model, setModel] = useState(() => localStorage.getItem('aquaflow_gemini_model') || 'gemini-3.5-flash');
  const [showKey, setShowKey] = useState(false);
  const [keySavedBadge, setKeySavedBadge] = useState(false);

  const messagesEndRef = useRef(null);

  // Personalized Welcome Message based on logged-in user
  const getInitialGreeting = () => {
    const userName = user?.name || user?.fullName || (role === 'admin' ? 'Community Administrator' : 'Resident');
    const flatInfo = user?.flatNo ? `Flat ${user.flatNo}` : null;
    const community = user?.communityName || 'your society';

    if (role === 'admin') {
      return `👋 Greetings, **${userName}**!\n\nI'm **AquaBot**, your AI water infrastructure copilot for **${community}**. I have live telemetry for all managed flats, bulk tanker logistics, billing collections, and society leak alarms.\n\nHow can I assist your administration today?`;
    } else {
      return `👋 Hi **${userName}**${flatInfo ? ` (${flatInfo})` : ''}!\n\nI'm **AquaBot**, synced with your digital sub-meter in **${community}**. I can explain your live water bill breakdown, check for night trickles/leaks, or help you save water to stay in Tier 1.\n\nWhat would you like to check today?`;
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: getInitialGreeting()
    }
  ]);

  // Reset conversation and update greeting whenever the logged-in user or role switches
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: getInitialGreeting()
      }
    ]);
  }, [user?.email, user?.role, role]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Save Settings
  const handleSaveSettings = (e) => {
    e?.preventDefault();
    localStorage.setItem('aquaflow_gemini_api_key', apiKey.trim());
    localStorage.setItem('aquaflow_gemini_model', model);
    setKeySavedBadge(true);
    setTimeout(() => setKeySavedBadge(false), 2500);
    setIsSettingsOpen(false);
    showToast('Gemini AI configuration saved successfully!', 'success');
  };

  // Dynamic quick prompt chips tailored to current user role
  const quickPrompts = role === 'admin'
    ? [
        "📊 Society water summary",
        "🚨 Which flats have active leaks?",
        "💰 Dues & collection status",
        "🚚 Bulk tanker deliveries & cost",
        "⚙️ How does tiered tariff work?"
      ]
    : [
        "💡 How is my flat bill calculated?",
        "🔍 Check my meter for leaks",
        "🌱 How to stay in Tier 1 tariff?",
        "🚚 Explain my tanker cost share",
        "🚿 Top tips to reduce monthly usage"
      ];

  const handleSend = async (userText = null) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput('');
    setLoading(true);

    // Prepare history for Gemini API
    const historyPayload = messages.map(m => ({
      sender: m.sender,
      text: m.text
    }));

    // Pass live user context to backend
    const clientContext = {
      email: user?.email,
      role: role || (user?.role?.includes('ADMIN') ? 'admin' : 'resident'),
      name: user?.name || user?.fullName,
      flatNo: user?.flatNo,
      communityName: user?.communityName
    };

    try {
      const res = await api.sendChatMessage(textToSend, historyPayload, apiKey, model, clientContext);

      const botReply = res.reply || "I've analyzed your water metrics.";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
          modelUsed: res.modelUsed
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      let errorMsg = "⚠️ I encountered an issue connecting to the AI service. ";
      if (!apiKey) {
        errorMsg += "Please click the **⚙️ Settings** icon in the header and paste your **Gemini API key**.";
      } else {
        errorMsg += (err.message || "Please check your network and API key.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: errorMsg
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: getInitialGreeting()
      }
    ]);
    showToast('Chat history cleared', 'info');
  };

  // Helper to render bolding and markdown-style bullet points cleanly
  const renderMessageContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      // Bold text handling: **word**
      const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start space-x-1.5 my-0.5 pl-1">
            <span className="text-cyan-500 font-bold">•</span>
            <span>{formattedLine}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }

      return <p key={idx} className="my-0.5 leading-relaxed">{formattedLine}</p>;
    });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] sm:w-96 max-w-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[520px] max-h-[85vh]">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg shadow-inner">
                💧
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-bold text-sm leading-tight">AquaBot AI</h4>
                  <span className="px-1.5 py-0.2 rounded-md bg-cyan-400/25 border border-cyan-300/40 text-[9px] font-mono uppercase tracking-wider text-cyan-100">
                    {model.includes('3.5') ? '3.5 Flash' : model.includes('3.6') ? '3.6 Flash' : 'Flash'}
                  </span>
                </div>
                <p className="text-[10px] text-cyan-100 flex items-center space-x-1 mt-0.5 truncate max-w-[190px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate">
                    {role === 'admin' 
                      ? `${user?.name || 'Admin'} (Society Overview)` 
                      : `${user?.name || 'Resident'} (${user?.flatNo ? `Flat ${user.flatNo}` : 'Meter Sync'})`}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer text-white/90 hover:text-white"
                title="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isSettingsOpen ? 'bg-white/30 text-white' : 'hover:bg-white/20 text-white/90 hover:text-white'
                }`}
                title="Gemini AI Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer text-white/90 hover:text-white"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Drawer (When clicked ⚙️) */}
          {isSettingsOpen ? (
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50 dark:bg-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <h5 className="font-bold text-slate-800 dark:text-white">Gemini AI Configuration</h5>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                AquaBot uses your Google Gemini API key to deliver personalized answers strictly based on your live water telemetry, bills, and anomaly records.
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Google Gemini API Key <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pr-9 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono shadow-2xs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    Get a key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-cyan-400 hover:underline">Google AI Studio</a>. Key is stored locally in your browser.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    AI Model Identifier
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                  >
                    <option value="gemini-3.5-flash">gemini-3.5-flash (Recommended & Active)</option>
                    <option value="gemini-3.6-flash">gemini-3.6-flash (Latest Flash)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro (Deep Reasoning)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center space-x-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Configuration</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {keySavedBadge && (
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Saved! AquaBot is ready to assist you.</span>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <>
              {/* Messages Feed */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-slate-50/50 dark:bg-slate-900/60">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl shadow-2xs ${
                        m.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none'
                      }`}
                    >
                      {renderMessageContent(m.text)}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-3 rounded-2xl rounded-bl-none shadow-2xs flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-400 pl-1 font-medium">
                        Analyzing {user?.flatNo ? `Flat ${user.flatNo}` : 'society'} telemetry...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Chips */}
              <div className="px-3 py-2 bg-white dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-1.5 overflow-x-auto text-[11px] no-scrollbar">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp)}
                    disabled={loading}
                    className="px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 border border-slate-200/80 dark:border-slate-700 whitespace-nowrap transition shrink-0 cursor-pointer font-medium disabled:opacity-50"
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
                className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 bg-white dark:bg-slate-850"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    role === 'admin' 
                      ? "Ask about society water, leaks, or collections..." 
                      : "Ask about your bill, flat usage, or leaks..."
                  }
                  disabled={loading}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition cursor-pointer disabled:opacity-40"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating 3D Robot Mascot Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition cursor-pointer text-2xl relative group"
        title="Chat with AquaBot AI Assistant"
      >
        <span className="animate-bounce select-none">🤖</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
      </button>
    </div>
  );
};
