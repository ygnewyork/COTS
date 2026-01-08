'use client';

import { motion } from 'framer-motion';
import { creditFactors } from '@/data/dummyData';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';

export default function FactorCards({ clarityMode }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'good': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'fair': return <Minus className="w-4 h-4 text-yellow-400" />;
      case 'building': return <TrendingUp className="w-4 h-4 text-purple-400" />;
      default: return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Credit Factors</h3>
        <p className="text-sm text-gray-500">{clarityMode ? "Click any card to learn more!" : "Detailed breakdown of scoring components"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {creditFactors.map((factor, index) => (
          <motion.div key={factor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${factor.color}22`, color: factor.color }}>{factor.weight}%</div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ backgroundColor: `${factor.color}15`, color: factor.color }}>
                {getStatusIcon(factor.status)}<span>{factor.status.charAt(0).toUpperCase() + factor.status.slice(1)}</span>
              </div>
            </div>
            <h4 className="text-gray-900 font-medium mb-1 group-hover:text-clarity-blue transition-colors">{factor.name}</h4>
            <p className="text-xs text-gray-500 mb-3">{factor.impact}</p>
            <div className="mb-3">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: factor.color }} initial={{ width: 0 }} animate={{ width: `${factor.score}%` }} transition={{ delay: 0.3 + index * 0.1 }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{factor.value}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-clarity-blue transition-colors" />
            </div>
            {clarityMode && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600 line-clamp-3">{factor.simpleExplanation}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
