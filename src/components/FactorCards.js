'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { creditFactors } from '@/data/dummyData';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useUser } from '@/context/UserContext';

export default function FactorCards({ clarityMode }) {
  const { user } = useUser();
  const [expandedCard, setExpandedCard] = useState(null);

  // Helper to map user data to factor cards
  const getDynamicFactors = () => {
    if (!user || !user.initialStats) return creditFactors;

    const stats = user.initialStats;
    
    return creditFactors.map(factor => {
      let newValue = factor.value;
      let newScore = factor.score;
      
      // Override specific fields based on user data
      switch(factor.id) {
        case 'payment-history':
          newValue = `${stats.paymentsOnTime} on-time / ${stats.paymentsTotal} total`;
          // Simple calc: ratio * 100 roughly
          newScore = Math.round((stats.paymentsOnTime / stats.paymentsTotal) * 100); 
          break;
        case 'utilization':
          newValue = `${stats.utilization}% used`;
          // Inverse score: lower is better. 100 - util roughly
          newScore = Math.max(0, 100 - stats.utilization);
          break;
        case 'credit-age':
          newValue = `${stats.creditAge} years avg`;
          break;
        case 'credit-mix':
          newValue = `${stats.accountCount} types`;
          break;
        case 'new-credit':
          newValue = `${stats.inquiries} inquiry`;
          break;
      }
      
      return { ...factor, value: newValue, score: newScore };
    });
  };

  const dynamicFactors = getDynamicFactors();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'good': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'fair': return <Minus className="w-4 h-4 text-yellow-500" />;
      case 'building': return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default: return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-700';
      case 'good': return 'bg-blue-100 text-blue-700';
      case 'fair': return 'bg-yellow-100 text-yellow-700';
      case 'building': return 'bg-purple-100 text-purple-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  const handleCardClick = (factorId) => {
    setExpandedCard(expandedCard === factorId ? null : factorId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Credit Factors</h3>
        <p className="text-sm text-gray-500">{clarityMode ? "Click any card to learn more!" : "Detailed breakdown of scoring components"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {dynamicFactors.map((factor, index) => {
          const isExpanded = expandedCard === factor.id;
          
          return (
            <motion.div 
              key={factor.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCardClick(factor.id)}
              className={`bg-white rounded-xl border-2 p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group ${
                isExpanded ? 'border-clarity-blue ring-2 ring-clarity-blue/20' : 'border-gray-200 hover:border-clarity-blue/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" 
                  style={{ backgroundColor: `${factor.color}22`, color: factor.color }}
                >
                  {factor.weight}%
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(factor.status)}`}>
                  {getStatusIcon(factor.status)}
                  <span>{factor.status.charAt(0).toUpperCase() + factor.status.slice(1)}</span>
                </div>
              </div>
              
              <h4 className="text-gray-900 font-semibold mb-1 group-hover:text-clarity-blue transition-colors">
                {factor.name}
              </h4>
              <p className="text-xs text-gray-500 mb-3">{factor.impact}</p>
              
              <div className="mb-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full" 
                    style={{ backgroundColor: factor.color }} 
                    initial={{ width: 0 }} 
                    animate={{ width: `${factor.score}%` }} 
                    transition={{ delay: 0.3 + index * 0.1 }} 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{factor.value}</span>
                <div className={`p-1 rounded-full transition-colors ${isExpanded ? 'bg-clarity-blue text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-clarity-blue/10 group-hover:text-clarity-blue'}`}>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && clarityMode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed">{factor.simpleExplanation}</p>
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-semibold text-clarity-blue mb-1">💡 Quick Tip</p>
                        <p className="text-xs text-blue-700">
                          {factor.status === 'excellent' && "Keep doing what you're doing! This factor is helping your score."}
                          {factor.status === 'good' && "You're on the right track. Small improvements can boost your score."}
                          {factor.status === 'fair' && "There's room for improvement here. Focus on this to raise your score."}
                          {factor.status === 'building' && "This takes time to build. Stay consistent and patient."}
                          {factor.status === 'poor' && "This is an opportunity! Improving this factor can significantly boost your score."}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
