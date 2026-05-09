'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Plane, Building2, Fuel, School, Hospital, MousePointer2, Settings, MessageSquare, Mic, MicOff } from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  subLabel: string;
}

function NavItem({ icon: Icon, label, subLabel }: NavItemProps) {
  return (
    <motion.button
      whileHover={{ scale: 0.98, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/2 backdrop-blur-sm transition-colors group cursor-pointer"
      id={`nav-item-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="mb-3 p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <span className="text-lg font-medium text-white/90">{label}</span>
      <span className="text-xs text-white/40 uppercase tracking-wider mt-1">{subLabel}</span>
    </motion.button>
  );
}

interface AssistantPanelProps {
  isListening: boolean;
  status: string;
  toggleListening: () => void;
  onManualSubmit: (text: string) => void;
}

export default function AssistantPanel({ 
  isListening, 
  status, 
  toggleListening,
  onManualSubmit 
}: AssistantPanelProps) {
  const [inputText, setInputText] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onManualSubmit(inputText);
      setInputText("");
    }
  };

  const navItems = [
    { icon: Plane, label: "Нисэх онгоцны буудал", subLabel: "Airport" },
    { icon: Building2, label: "Хаан Банк", subLabel: "King Bank" },
    { icon: Fuel, label: "ШТС", subLabel: "Nearly STS" },
    { icon: School, label: "МУИС", subLabel: "MUIS" },
    { icon: Hospital, label: "Эмнэлэг", subLabel: "Hospital" },
    { icon: MousePointer2, label: "Ойролцоох зогсоол", subLabel: "Nearby parking" },
  ];

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Status Bar */}
      <div className="flex flex-col space-y-4 px-4 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
            <span className="text-sm font-medium text-white/60 tracking-tight">
              {status}
            </span>
          </div>
          
          <button 
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all duration-300 ${
              isListening 
                ? 'bg-red-500/10 text-red-500 ring-2 ring-red-500/20' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
            id="toggle-mic-btn"
          >
            {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>
        </div>

        {/* Manual Input Field */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Энд бичиж болно..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-blue-400 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Grid Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow overflow-y-auto">
        {navItems.map((item, idx) => (
          <NavItem key={idx} {...item} />
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-top border-white/5 flex items-center justify-between text-[10px] text-white/30 uppercase tracking-[0.1em]">
        <div className="flex space-x-4">
          <span>Wake word: &quot;Nara&quot;</span>
          <span>Command: &quot;Stop&quot;, &quot;Go home&quot;</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>GPS: AU-MN</span>
        </div>
      </div>
    </div>
  );
}
