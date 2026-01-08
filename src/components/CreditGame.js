'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const scenarios = [
  {
    id: 1,
    title: "The Midnight Splurge",
    description: "It's 2 AM. You see a limited edition sneaker drop for $250. You only have $100 in your checking account, but you have a credit card with a $500 limit.",
    choices: [
      { text: "Buy it on credit! #NewKicks", impact: -15, feedback: "Your utilization spiked! Buying things you can't pay off immediately hurts your score." },
      { text: "Sleep on it. Save up first.", impact: +5, feedback: "Smart move. Avoiding unnecessary debt keeps your utilization low and wallet happy." }
    ]
  },
  {
    id: 2,
    title: "The Forgotten Bill",
    description: "You receive your utility bill for $80. It's due tomorrow, but payday isn't for another week.",
    choices: [
      { text: "Ignore it until payday.", impact: -25, feedback: "Ouch! Late fees + potential reported delinquency if it goes 30 days past due. Always communicate with providers!" },
      { text: "Call and ask for an extension.", impact: +10, feedback: "Proactive! Most companies will waive late fees or extend due dates if you ask before the deadline." }
    ]
  },
  {
    id: 3,
    title: "Credit Limit Increase",
    description: "Your credit card issuer offers to raise your limit from $2,000 to $5,000. You didn't ask for it.",
    choices: [
      { text: "Accept it!", impact: +20, feedback: "Great! Higher limit = lower utilization ratio (assuming you don't spend more). Win-win." },
      { text: "Reject it.", impact: 0, feedback: "Neutral. You missed a chance to lower your utilization, but at least you aren't tempted to spend more." }
    ]
  },
  {
    id: 4,
    title: "New Store Card",
    description: "The cashier offers you 20% off your $50 purchase if you sign up for the store credit card right now.",
    choices: [
      { text: "Sign me up!", impact: -10, feedback: "Short term drop. Hard inquiry + a new account lowers your average age of credit. Usually not worth $10." },
      { text: "No thanks.", impact: +0, feedback: "Good restraint. Don't open accounts just for small discounts." }
    ]
  }
];

export default function CreditGame() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(650);
  const [feedback, setFeedback] = useState(null);
  const [gameState, setGameState] = useState('playing'); // playing, feedback, finished

  const handleChoice = (choice) => {
    setScore(prev => prev + choice.impact);
    setFeedback({
      msg: choice.feedback,
      impact: choice.impact
    });
    setGameState('feedback');
  };

  const nextRound = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setGameState('playing');
      setFeedback(null);
    } else {
      setGameState('finished');
    }
  };

  const resetGame = () => {
    setCurrentScenario(0);
    setScore(650);
    setGameState('playing');
    setFeedback(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Game Header / Scoreboard */}
      <div className="flex justify-between items-center mb-8 bg-clarity-card p-4 rounded-xl border border-clarity-border shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-clarity-dark rounded-lg">
            <Trophy className="text-yellow-400 w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold">Current Score</p>
            <p className={`text-2xl font-bold ${score >= 700 ? 'text-green-400' : score >= 600 ? 'text-yellow-400' : 'text-red-400'}`}>
              {score}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs uppercase font-bold">Scenario</p>
          <p className="text-xl font-mono text-white">{currentScenario + 1} / {scenarios.length}</p>
        </div>
      </div>

      <AnimatePresence mode='wait'>
        {gameState === 'playing' && (
          <motion.div 
            key="scenario"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-clarity-card rounded-2xl p-8 border border-clarity-border"
          >
            <div className="mb-6">
              <span className="text-clarity-blue text-sm font-bold tracking-wider">WHAT WOULD YOU DO?</span>
              <h2 className="text-3xl font-bold text-white mt-2 mb-4">{scenarios[currentScenario].title}</h2>
              <p className="text-xl text-gray-300 leading-relaxed">{scenarios[currentScenario].description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {scenarios[currentScenario].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  className="p-6 text-left rounded-xl bg-clarity-dark border border-clarity-border hover:border-clarity-red hover:bg-[#1a1a2e] transition-all group"
                >
                  <span className="text-lg font-medium text-white group-hover:text-clarity-red transition-colors">{choice.text}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'feedback' && (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-clarity-card rounded-2xl p-8 border ${feedback.impact >= 0 ? 'border-green-500/30' : 'border-red-500/30'} text-center`}
          >
            <div className="mb-6 inline-flex justify-center items-center p-4 rounded-full bg-clarity-dark">
              {feedback.impact >= 0 ? <CheckCircle className="w-12 h-12 text-green-500" /> : <AlertTriangle className="w-12 h-12 text-red-500" />}
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              {feedback.impact > 0 ? 'Good Choice!' : 'Credit Score Hit!'}
            </h2>
            <p className={`text-4xl font-bold mb-6 ${feedback.impact >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {feedback.impact > 0 ? '+' : ''}{feedback.impact} Points
            </p>
            
            <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">{feedback.msg}</p>

            <button 
              onClick={nextRound}
              className="px-8 py-3 bg-clarity-blue text-white rounded-full font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
            >
              Next Scenario <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div 
            key="finished"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
            <p className="text-2xl text-gray-400 mb-8">Final Credit Score: <span className="text-white font-bold">{score}</span></p>
            
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-clarity-red text-white rounded-full font-bold hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
            >
              Play Again <RefreshCw className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
