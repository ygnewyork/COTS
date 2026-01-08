'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Eye } from 'lucide-react';

export default function ClarityModeToggle({ enabled, onToggle }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-4 bg-clarity-card rounded-2xl p-2 pr-4 border border-clarity-border">
      <button
        onClick={onToggle}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
          enabled ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25' : 'bg-clarity-dark text-gray-400 hover:text-white'
        }`}
      >
        {enabled ? <Lightbulb className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        <span className="text-sm font-medium">{enabled ? 'Clarity Mode ON' : 'Clarity Mode OFF'}</span>
      </button>
      <div className="text-xs text-gray-500 max-w-xs">{enabled ? "✨ Showing simple explanations" : "Toggle for 'Explain Like I'm 5' mode"}</div>
    </motion.div>
  );
}
