'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Target, Award } from 'lucide-react';
import { userProfile, scoreHistory } from '@/data/dummyData';

export default function ScoreOverview({ clarityMode }) {
  const scorePercentage = ((userProfile.creditScore - 300) / 550) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="text-center mb-6">
        <p className="text-gray-500 text-sm mb-2">Your Credit Score</p>
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
            <motion.circle
              cx="96" cy="96" r="88"
              stroke="url(#scoreGradient)" strokeWidth="8" fill="transparent" strokeLinecap="round"
              strokeDasharray={553}
              initial={{ strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 - (553 * scorePercentage) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="score-ring"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="text-5xl font-bold text-yellow-400">
              {userProfile.creditScore}
            </motion.span>
            <span className="text-gray-500 text-sm mt-1">Fair</span>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-center gap-2 mt-4">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+{userProfile.scoreChange} this month</span>
          </div>
        </motion.div>
      </div>

      {clarityMode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700">
            <span className="text-clarity-blue font-medium">What is 682?</span> Think of it like a grade out of 850. 
            You're at a solid B! Most landlords and car dealers will work with you.
          </p>
        </motion.div>
      )}

      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2"><span>300</span><span>850</span></div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full flex">
            <div className="w-[16%] bg-red-500/50" /><div className="w-[17%] bg-orange-500/50" /><div className="w-[17%] bg-yellow-500/50" /><div className="w-[17%] bg-green-400/50" /><div className="w-[33%] bg-green-500/50" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-600">Credit Score Trend (6 Months)</h4>
          <span className="text-xs text-gray-400"></span>
        </div>
        <div className="relative h-32">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="flex items-center">
              <span className="text-xs text-gray-400 w-8">700</span>
              <div className="flex-1 border-t border-dashed border-gray-200"></div>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-400 w-8">650</span>
              <div className="flex-1 border-t border-dashed border-gray-200"></div>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-400 w-8">600</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          </div>
          {/* Bars */}
          <div className="absolute left-8 right-0 bottom-0 top-0 flex items-end justify-between gap-3 pb-[1px]">
            {scoreHistory.map((item, index) => {
              const heightPercent = ((item.score - 600) / 100) * 100;
              // Color based on score: red (600) -> yellow (650) -> green (700+)
              const getBarColor = (score) => {
                if (score < 650) {
                  // Red to yellow gradient for 600-649
                  const percent = (score - 600) / 50;
                  return `rgb(${220}, ${Math.round(50 + percent * 150)}, ${Math.round(30 + percent * 20)})`;
                } else {
                  // Yellow to green gradient for 650-700+
                  const percent = Math.min((score - 650) / 50, 1);
                  return `rgb(${Math.round(220 - percent * 180)}, ${Math.round(200 - percent * 20)}, ${Math.round(50 + percent * 90)})`;
                }
              };
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="text-xs font-bold mb-1"
                    style={{ color: getBarColor(item.score) }}
                  >
                    {item.score}
                  </motion.span>
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: `${Math.max(heightPercent, 10)}px` }} 
                    transition={{ delay: index * 0.1, duration: 0.5 }} 
                    className="w-full rounded-t-md" 
                    style={{ 
                      height: `${heightPercent}%`,
                      minHeight: '8px',
                      backgroundColor: getBarColor(item.score)
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between mt-2 ml-8 border-t border-gray-200 pt-2">
          {scoreHistory.map((item) => (<span key={item.month} className="text-xs text-gray-500 flex-1 text-center font-medium">{item.month}</span>))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="flex items-center gap-2 mb-1"><Target className="w-4 h-4 text-clarity-red" /><span className="text-xs text-gray-500">Next Goal</span></div>
          <p className="text-sm font-medium text-gray-900">700 Score</p>
          <p className="text-xs text-gray-500">18 pts away</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="flex items-center gap-2 mb-1"><Award className="w-4 h-4 text-clarity-blue" /><span className="text-xs text-gray-500">Rank</span></div>
          <p className="text-sm font-medium text-gray-900">Top 45%</p>
          <p className="text-xs text-gray-500">of users your age</p>
        </div>
      </div>
    </motion.div>
  );
}
