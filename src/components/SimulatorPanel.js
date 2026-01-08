'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { simulationScenarios, userProfile } from '@/data/dummyData';
import { 
  Sliders, 
  TrendingUp, 
  CreditCard, 
  DollarSign,
  Clock,
  Zap,
  Play,
  RotateCcw,
  ChevronDown,
  Info
} from 'lucide-react';

export default function SimulatorPanel({ clarityMode }) {
  const [utilization, setUtilization] = useState(42);
  const [onTimePayments, setOnTimePayments] = useState(95);
  const [newAccounts, setNewAccounts] = useState(1);
  const [creditLimit, setCreditLimit] = useState(10000);
  const [simulatedScore, setSimulatedScore] = useState(userProfile.creditScore);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    setIsSimulating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      let newScore = 682; // base score
      
      // Utilization impact (30% weight)
      if (utilization <= 10) newScore += 30;
      else if (utilization <= 20) newScore += 20;
      else if (utilization <= 30) newScore += 10;
      else if (utilization > 50) newScore -= 20;
      
      // Payment history impact
      if (onTimePayments >= 99) newScore += 25;
      else if (onTimePayments >= 95) newScore += 10;
      else if (onTimePayments < 90) newScore -= 30;
      
      // New accounts impact
      if (newAccounts === 0) newScore += 10;
      else if (newAccounts > 2) newScore -= 15;
      
      // Credit limit impact
      if (creditLimit > 15000) newScore += 15;
      else if (creditLimit > 20000) newScore += 25;
      
      setSimulatedScore(Math.min(850, Math.max(300, newScore)));
      setIsSimulating(false);
      setShowResults(true);
    }, 1500);
  };

  const resetSimulation = () => {
    setUtilization(42);
    setOnTimePayments(95);
    setNewAccounts(1);
    setCreditLimit(10000);
    setSimulatedScore(userProfile.creditScore);
    setShowResults(false);
  };

  const scoreDiff = simulatedScore - userProfile.creditScore;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Controls Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-clarity-card rounded-2xl border border-clarity-border p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">What-If Simulator</h3>
            <p className="text-sm text-gray-400">
              {clarityMode ? "Slide the bars to see what happens!" : "Adjust variables to simulate score changes"}
            </p>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          {/* Utilization Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">Credit Utilization</span>
              </div>
              <span className={`text-sm font-medium ${
                utilization <= 30 ? 'text-green-400' : utilization <= 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>{utilization}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={utilization}
              onChange={(e) => setUtilization(parseInt(e.target.value))}
              className="w-full h-2 bg-clarity-dark rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 30%, #f59e0b 30%, #f59e0b 50%, #ef4444 50%, #ef4444 100%)`
              }}
            />
            {clarityMode && (
              <p className="text-xs text-gray-500 mt-1">
                💡 This is how much of your credit limit you're using. Under 30% is ideal!
              </p>
            )}
          </div>

          {/* Payment History Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white">On-Time Payments</span>
              </div>
              <span className={`text-sm font-medium ${
                onTimePayments >= 95 ? 'text-green-400' : onTimePayments >= 90 ? 'text-yellow-400' : 'text-red-400'
              }`}>{onTimePayments}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="100"
              value={onTimePayments}
              onChange={(e) => setOnTimePayments(parseInt(e.target.value))}
              className="w-full h-2 bg-clarity-dark rounded-lg appearance-none cursor-pointer"
            />
            {clarityMode && (
              <p className="text-xs text-gray-500 mt-1">
                💡 This is your attendance record! 100% means you never paid late.
              </p>
            )}
          </div>

          {/* New Accounts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-white">New Credit Applications</span>
              </div>
              <span className="text-sm font-medium text-white">{newAccounts}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              value={newAccounts}
              onChange={(e) => setNewAccounts(parseInt(e.target.value))}
              className="w-full h-2 bg-clarity-dark rounded-lg appearance-none cursor-pointer"
            />
            {clarityMode && (
              <p className="text-xs text-gray-500 mt-1">
                💡 Each application is a "hard inquiry." Too many looks desperate!
              </p>
            )}
          </div>

          {/* Credit Limit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white">Total Credit Limit</span>
              </div>
              <span className="text-sm font-medium text-white">${creditLimit.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={creditLimit}
              onChange={(e) => setCreditLimit(parseInt(e.target.value))}
              className="w-full h-2 bg-clarity-dark rounded-lg appearance-none cursor-pointer"
            />
            {clarityMode && (
              <p className="text-xs text-gray-500 mt-1">
                💡 Higher limit = lower utilization percentage (even with same spending)
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={calculateScore}
            disabled={isSimulating}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Simulate
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetSimulation}
            className="px-4 py-3 bg-clarity-dark rounded-xl text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Results Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        {/* Score Comparison */}
        <div className="bg-clarity-card rounded-2xl border border-clarity-border p-6">
          <h4 className="text-sm font-medium text-gray-400 mb-4">Score Comparison</h4>
          
          <div className="flex items-center justify-between gap-8">
            {/* Current Score */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Current</p>
              <div className="text-4xl font-bold text-white">{userProfile.creditScore}</div>
            </div>

            {/* Arrow */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex items-center gap-2"
              >
                <div className="h-0.5 w-16 bg-gradient-to-r from-gray-600 to-purple-500" />
                <ChevronDown className="w-6 h-6 text-purple-400 rotate-[-90deg]" />
              </motion.div>
            </div>

            {/* Simulated Score */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Simulated</p>
              <motion.div
                key={simulatedScore}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`text-4xl font-bold ${
                  scoreDiff > 0 ? 'text-green-400' : scoreDiff < 0 ? 'text-red-400' : 'text-white'
                }`}
              >
                {simulatedScore}
              </motion.div>
              {showResults && scoreDiff !== 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs ${
                    scoreDiff > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  <TrendingUp className={`w-3 h-3 ${scoreDiff < 0 ? 'rotate-180' : ''}`} />
                  {scoreDiff > 0 ? '+' : ''}{scoreDiff} points
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Scenarios */}
        <div className="bg-clarity-card rounded-2xl border border-clarity-border p-6">
          <h4 className="text-sm font-medium text-gray-400 mb-4">Quick Scenarios</h4>
          <div className="space-y-3">
            {simulationScenarios.map((scenario, index) => (
              <motion.button
                key={scenario.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="w-full flex items-center justify-between p-4 bg-clarity-dark rounded-xl hover:border-purple-500/30 border border-transparent transition-all text-left"
                onClick={() => {
                  if (scenario.id === 'pay-down-debt') {
                    setUtilization(20);
                  } else if (scenario.id === 'credit-limit') {
                    setCreditLimit(20000);
                  } else if (scenario.id === 'autopay') {
                    setOnTimePayments(100);
                  }
                }}
              >
                <div>
                  <h5 className="text-white font-medium">{scenario.title}</h5>
                  <p className="text-xs text-gray-500">{scenario.timeframe} • {scenario.difficulty}</p>
                </div>
                <span className="text-green-400 font-medium">{scenario.effect}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Insight Card */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`rounded-2xl p-6 ${
                scoreDiff > 0 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : scoreDiff < 0 
                  ? 'bg-red-500/10 border border-red-500/30'
                  : 'bg-clarity-card border border-clarity-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <Info className={`w-5 h-5 mt-0.5 ${
                  scoreDiff > 0 ? 'text-green-400' : scoreDiff < 0 ? 'text-red-400' : 'text-gray-400'
                }`} />
                <div>
                  <h4 className="font-medium text-white mb-2">
                    {scoreDiff > 0 
                      ? "🎉 Great choices!" 
                      : scoreDiff < 0 
                      ? "⚠️ Heads up!"
                      : "No change"}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {clarityMode ? (
                      scoreDiff > 0 
                        ? `These changes could boost your score by ${scoreDiff} points! That's like going from a B to a B+ in credit class.`
                        : scoreDiff < 0
                        ? `Careful! These changes might drop your score by ${Math.abs(scoreDiff)} points. Let's find a better path!`
                        : "Your score would stay about the same with these settings."
                    ) : (
                      scoreDiff > 0
                        ? `Projected increase of ${scoreDiff} points based on utilization optimization and payment history improvements.`
                        : scoreDiff < 0
                        ? `Warning: These changes may negatively impact your score by ${Math.abs(scoreDiff)} points due to increased risk factors.`
                        : "Neutral impact - current settings maintain your existing score trajectory."
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Custom slider styles */}
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
