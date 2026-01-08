'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Eye } from 'lucide-react';

export default function ClarityModeToggle({ enabled, onToggle }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-4 bg-white rounded-2xl p-2 pr-4 border border-gray-200 shadow-sm">
      <button
        onClick={onToggle}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
          enabled ? 'bg-clarity-blue text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:text-gray-900'
        }`}
      >
        {enabled ? <Lightbulb className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        <span className="text-sm font-medium">{enabled ? 'Clarity Mode ON' : 'Clarity Mode OFF'}</span>
      </button>
      <div className="text-xs text-gray-500 max-w-xs">{enabled ? "✨ Showing simple explanations" : "Toggle for 'Explain Like I'm 5' mode"}</div>
    </motion.div>
  );
}
