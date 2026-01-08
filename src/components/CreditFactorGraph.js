'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { creditFactors, userProfile } from '@/data/dummyData';
import { Info, X } from 'lucide-react';

export default function CreditFactorGraph({ clarityMode }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });
  const [hoveredFactor, setHoveredFactor] = useState(null);
  const [selectedFactor, setSelectedFactor] = useState(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.min(width - 40, 700), height: 500 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const baseRadius = 140;

  const getNodePosition = (index, total, factor) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = baseRadius + (factor.weight / 30) * 30;
    return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
  };

  const getNodeSize = (weight, isHovered) => {
    const baseSize = 30 + (weight * 1.2);
    return isHovered ? baseSize * 1.3 : baseSize;
  };

  return (
    <motion.div ref={containerRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-clarity-card rounded-2xl border border-clarity-border p-6 card-hover relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Credit Factor Web</h3>
          <p className="text-sm text-gray-400">{clarityMode ? "Hover over each bubble to see how it affects your score!" : "Interactive visualization of FICO score components"}</p>
        </div>
      </div>

      <div className="relative">
        <svg width={dimensions.width} height={dimensions.height} className="mx-auto">
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" /><stop offset="100%" stopColor="transparent" /></radialGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <circle cx={centerX} cy={centerY} r={100} fill="url(#centerGlow)" />

          {creditFactors.map((factor, index) => {
            const pos = getNodePosition(index, creditFactors.length, factor);
            const isActive = hoveredFactor === factor.id || selectedFactor === factor.id;
            return (
              <motion.line key={`line-${factor.id}`} x1={centerX} y1={centerY} x2={pos.x} y2={pos.y}
                stroke={isActive ? factor.color : 'rgba(255,255,255,0.1)'} strokeWidth={isActive ? 3 : 1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            );
          })}

          {creditFactors.map((factor, index) => {
            const pos = getNodePosition(index, creditFactors.length, factor);
            const isHovered = hoveredFactor === factor.id || selectedFactor === factor.id;
            const nodeSize = getNodeSize(factor.weight, isHovered);
            return (
              <g key={factor.id}>
                <motion.circle cx={pos.x} cy={pos.y} r={nodeSize + 10} fill={factor.color} opacity={isHovered ? 0.3 : 0.1} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} />
                <motion.circle cx={pos.x} cy={pos.y} r={nodeSize} fill={`${factor.color}22`} stroke={factor.color} strokeWidth={isHovered ? 3 : 2} filter="url(#glow)" className="cursor-pointer"
                  initial={{ scale: 0 }} animate={{ scale: isHovered ? 1.1 : 1 }}
                  onMouseEnter={() => setHoveredFactor(factor.id)} onMouseLeave={() => setHoveredFactor(null)}
                  onClick={() => setSelectedFactor(selectedFactor === factor.id ? null : factor.id)}
                />
                <motion.text x={pos.x} y={pos.y - 5} textAnchor="middle" fill="white" fontSize={isHovered ? 18 : 14} fontWeight="bold" className="pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + index * 0.1 }}>{factor.weight}%</motion.text>
                <motion.text x={pos.x} y={pos.y + 12} textAnchor="middle" fill={factor.color} fontSize={10} className="pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{factor.name.split(' ')[0]}</motion.text>
              </g>
            );
          })}

          <motion.circle cx={centerX} cy={centerY} r={60} fill="url(#centerGlow)" stroke="url(#scoreGradient)" strokeWidth={4} initial={{ scale: 0 }} animate={{ scale: 1 }} />
          <motion.text x={centerX} y={centerY - 8} textAnchor="middle" fill="white" fontSize={28} fontWeight="bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{userProfile.creditScore}</motion.text>
          <motion.text x={centerX} y={centerY + 16} textAnchor="middle" fill="#9ca3af" fontSize={12} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Credit Score</motion.text>
        </svg>

        <AnimatePresence>
          {hoveredFactor && !selectedFactor && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-clarity-dark/95 border border-clarity-border rounded-xl p-4 max-w-sm">
              {(() => {
                const factor = creditFactors.find(f => f.id === hoveredFactor);
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: factor.color }} />
                      <span className="font-semibold text-white">{factor.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{factor.impact}</span>
                    </div>
                    <p className="text-sm text-gray-400">{clarityMode ? factor.simpleExplanation : factor.technicalExplanation}</p>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedFactor && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute top-4 right-4 w-80 bg-clarity-dark/95 border border-clarity-border rounded-xl p-5 backdrop-blur-xl">
            {(() => {
              const factor = creditFactors.find(f => f.id === selectedFactor);
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: `${factor.color}22`, color: factor.color }}>{factor.weight}%</div>
                      <div><h4 className="font-semibold text-white">{factor.name}</h4><p className="text-xs text-gray-400">{factor.impact}</p></div>
                    </div>
                    <button onClick={() => setSelectedFactor(null)} className="p-1 hover:bg-clarity-card rounded-lg"><X className="w-4 h-4 text-gray-400" /></button>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">Your Score</span><span style={{ color: factor.color }}>{factor.score}/100</span></div>
                    <div className="h-2 bg-clarity-card rounded-full overflow-hidden"><motion.div className="h-full rounded-full" style={{ backgroundColor: factor.color }} initial={{ width: 0 }} animate={{ width: `${factor.score}%` }} /></div>
                  </div>
                  <div className="bg-clarity-card rounded-lg p-3 mb-4"><p className="text-xs text-gray-500 mb-1">Current Status</p><p className="text-white font-medium">{factor.value}</p></div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2"><Info className="w-4 h-4 text-purple-400" /><span className="text-sm font-medium text-purple-400">{clarityMode ? "In Plain English" : "Technical Details"}</span></div>
                    <p className="text-sm text-gray-300">{clarityMode ? factor.simpleExplanation : factor.technicalExplanation}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-3 border border-purple-500/20"><p className="text-xs text-purple-300 mb-1">💡 Pro Tip</p><p className="text-sm text-gray-300">{factor.tip}</p></div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {clarityMode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <p className="text-sm text-purple-300"><span className="font-medium">🎓 Learning Mode:</span> The bigger the bubble, the more it affects your score. Payment History (35%) is the biggest!</p>
        </motion.div>
      )}
    </motion.div>
  );
}
