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
    <motion.div ref={containerRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Credit Factor Web</h3>
          <p className="text-sm text-gray-500">{clarityMode ? "Hover over each bubble to see how it affects your score!" : "Interactive visualization of FICO score components"}</p>
        </div>
      </div>

      <div className="relative">
        <svg width={dimensions.width} height={dimensions.height} className="mx-auto">
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0, 73, 119, 0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
            {creditFactors.map((factor) => (
              <linearGradient key={`grad-${factor.id}`} id={`bubbleGrad-${factor.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={factor.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={factor.color} stopOpacity="0.6" />
              </linearGradient>
            ))}
            <linearGradient id="centerRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#004977" />
              <stop offset="100%" stopColor="#0066a4" />
            </linearGradient>
          </defs>

          {/* Subtle background circle */}
          <circle cx={centerX} cy={centerY} r={180} fill="url(#centerGlow)" />

          {/* Factor bubbles - no connecting lines */}
          {creditFactors.map((factor, index) => {
            const pos = getNodePosition(index, creditFactors.length, factor);
            const isHovered = hoveredFactor === factor.id || selectedFactor === factor.id;
            const nodeSize = getNodeSize(factor.weight, isHovered);
            return (
              <g key={factor.id}>
                {/* Outer glow ring on hover */}
                {isHovered && (
                  <motion.circle 
                    cx={pos.x} cy={pos.y} r={nodeSize + 8} 
                    fill="none" 
                    stroke={factor.color} 
                    strokeWidth={2}
                    strokeOpacity={0.3}
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1.1, opacity: 1 }} 
                  />
                )}
                {/* Main bubble with gradient fill */}
                <motion.circle 
                  cx={pos.x} cy={pos.y} r={nodeSize} 
                  fill={`url(#bubbleGrad-${factor.id})`}
                  stroke="white"
                  strokeWidth={3}
                  filter="url(#dropShadow)"
                  className="cursor-pointer"
                  initial={{ scale: 0, opacity: 0 }} 
                  animate={{ scale: isHovered ? 1.08 : 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.08, type: "spring", stiffness: 200 }}
                  onMouseEnter={() => setHoveredFactor(factor.id)} 
                  onMouseLeave={() => setHoveredFactor(null)}
                  onClick={() => setSelectedFactor(selectedFactor === factor.id ? null : factor.id)}
                />
                {/* Weight text */}
                <motion.text 
                  x={pos.x} y={pos.y - 4} 
                  textAnchor="middle" 
                  fill="white" 
                  fontSize={isHovered ? 17 : 15} 
                  fontWeight="bold" 
                  className="pointer-events-none"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.4 + index * 0.08 }}
                >
                  {factor.weight}%
                </motion.text>
                {/* Factor name */}
                <motion.text 
                  x={pos.x} y={pos.y + 13} 
                  textAnchor="middle" 
                  fill="white" 
                  fontSize={10} 
                  fontWeight="500"
                  className="pointer-events-none"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.08 }}
                >
                  {factor.name.split(' ')[0]}
                </motion.text>
              </g>
            );
          })}

          {/* Center score circle */}
          <motion.circle 
            cx={centerX} cy={centerY} r={65} 
            fill="white"
            stroke="url(#centerRing)" 
            strokeWidth={5} 
            filter="url(#dropShadow)"
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ duration: 0.5, type: "spring" }}
          />
          <motion.text 
            x={centerX} y={centerY - 6} 
            textAnchor="middle" 
            fill="#004977" 
            fontSize={32} 
            fontWeight="bold" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {userProfile.creditScore}
          </motion.text>
          <motion.text 
            x={centerX} y={centerY + 18} 
            textAnchor="middle" 
            fill="#6b7280" 
            fontSize={11}
            fontWeight="500"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Credit Score
          </motion.text>
        </svg>

        <AnimatePresence>
          {hoveredFactor && !selectedFactor && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-xl p-4 max-w-sm shadow-lg">
              {(() => {
                const factor = creditFactors.find(f => f.id === hoveredFactor);
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: factor.color }} />
                      <span className="font-semibold text-gray-900">{factor.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{factor.impact}</span>
                    </div>
                    <p className="text-sm text-gray-600">{clarityMode ? factor.simpleExplanation : factor.technicalExplanation}</p>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedFactor && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute top-4 right-4 w-80 bg-white border border-gray-200 rounded-xl p-5 shadow-xl">
            {(() => {
              const factor = creditFactors.find(f => f.id === selectedFactor);
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: `${factor.color}22`, color: factor.color }}>{factor.weight}%</div>
                      <div><h4 className="font-semibold text-gray-900">{factor.name}</h4><p className="text-xs text-gray-500">{factor.impact}</p></div>
                    </div>
                    <button onClick={() => setSelectedFactor(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Your Score</span><span style={{ color: factor.color }}>{factor.score}/100</span></div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><motion.div className="h-full rounded-full" style={{ backgroundColor: factor.color }} initial={{ width: 0 }} animate={{ width: `${factor.score}%` }} /></div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-4"><p className="text-xs text-gray-500 mb-1">Current Status</p><p className="text-gray-900 font-medium">{factor.value}</p></div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2"><Info className="w-4 h-4 text-clarity-blue" /><span className="text-sm font-medium text-clarity-blue">{clarityMode ? "In Plain English" : "Technical Details"}</span></div>
                    <p className="text-sm text-gray-600">{clarityMode ? factor.simpleExplanation : factor.technicalExplanation}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200"><p className="text-xs text-clarity-blue mb-1">💡 Pro Tip</p><p className="text-sm text-gray-600">{factor.tip}</p></div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {clarityMode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-clarity-blue"><span className="font-medium">🎓 Learning Mode:</span> The bigger the bubble, the more it affects your score. Payment History (35%) is the biggest!</p>
        </motion.div>
      )}
    </motion.div>
  );
}
