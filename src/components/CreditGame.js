'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, AlertTriangle, CheckCircle, RefreshCw, Wallet, PiggyBank } from 'lucide-react';

// Enhanced Scenarios with 3 options and Money Impact
const scenarios = [
  {
    id: 1,
    title: "The Midnight Splurge",
    description: "It's 2 AM. You see a limited edition sneaker drop for $250. You only have $100 in your checking account, but you have a credit card with a $500 limit.",
    choices: [
      { text: "Buy it on credit! #NewKicks", scoreImpact: -15, cashImpact: -250, feedback: "Your utilization spiked! Plus now you have debt to pay off." },
      { text: "Sleep on it. Save up first.", scoreImpact: +5, cashImpact: 0, feedback: "Smart move. Avoiding unnecessary debt keeps your utilization low." },
      { text: "Buy via 'Buy Now Pay Later'", scoreImpact: -5, cashImpact: -62, feedback: "Better than pure credit, but still risky if you miss a payment. Small score dip." }
    ]
  },
  {
    id: 2,
    title: "The Forgotten Bill",
    description: "You receive your utility bill for $80. It's due tomorrow, but payday isn't for another week. You have $50 cash.",
    choices: [
      { text: "Ignore it until payday.", scoreImpact: -25, cashImpact: -35, feedback: "Ouch! Late fees ($35) + potential reported delinquency." },
      { text: "Call and ask for an extension.", scoreImpact: +0, cashImpact: 0, feedback: "Proactive! Most companies will waive fees if you ask early." },
      { text: "Pay partial amount ($50).", scoreImpact: -10, cashImpact: -50, feedback: "Better than nothing, but you might still get a late fee on the remainder." }
    ]
  },
  {
    id: 3,
    title: "Credit Limit Increase",
    description: "Your card issuer offers to raise your limit from $2,000 to $5,000. You didn't ask for it.",
    choices: [
      { text: "Accept it!", scoreImpact: +20, cashImpact: 0, feedback: "Great! Higher limit = lower utilization ratio (assuming you don't spend more)." },
      { text: "Reject it.", scoreImpact: 0, cashImpact: 0, feedback: "Neutral. You missed a chance to lower your utilization." },
      { text: "Accept but ask for lower interest.", scoreImpact: +20, cashImpact: +0, feedback: "Bold move! You get the utilization benefit, and maybe lower APR." }
    ]
  },
  {
    id: 4,
    title: "Friend in Need",
    description: "Your best friend asks you to co-sign a $15,000 car loan because they have bad credit.",
    choices: [
      { text: "Sure, that's what friends are for!", scoreImpact: -10, cashImpact: 0, feedback: "High Risk! You are 100% liable if they assume payment. Your DTI also went up." },
      { text: "No, I can't do that.", scoreImpact: 0, cashImpact: 0, feedback: "The safe play. Never co-sign unless you are willing to pay the whole debt." },
      { text: "Gift them $500 for down payment instead.", scoreImpact: 0, cashImpact: -500, feedback: "Generous! You help them without risking your credit score." }
    ]
  },
  {
    id: 5,
    title: "Too Many Cards?",
    description: "You have 2 cards. You get an offer for a 'Super Rewards' card with a $200 sign-up bonus.",
    choices: [
      { text: "Apply immediately!", scoreImpact: -5, cashImpact: +200, feedback: "Hard inquiry drops score slightly, but you gained $200 cash!." },
      { text: "Shred the offer.", scoreImpact: +0, cashImpact: 0, feedback: "Status quo maintained." },
      { text: "Apply for 3 different cards at once.", scoreImpact: -30, cashImpact: 0, feedback: "Whoa! Excessive inquiries look desperate to lenders. Score plummets." }
    ]
  }
];

export default function CreditGame() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(650);
  const [cash, setCash] = useState(1000); // New Cash State
  const [feedback, setFeedback] = useState(null);
  const [gameState, setGameState] = useState('playing'); 

  const handleChoice = (choice) => {
    setScore(prev => Math.min(850, Math.max(300, prev + choice.scoreImpact)));
    setCash(prev => prev + choice.cashImpact);
    setFeedback({
      msg: choice.feedback,
      scoreImpact: choice.scoreImpact,
      cashImpact: choice.cashImpact
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
    setCash(1000);
    setGameState('playing');
    setFeedback(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Header / Scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Score Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Trophy className="text-clarity-blue w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Credit Score</p>
            <p className={`text-2xl font-bold ${score >= 700 ? 'text-green-600' : score >= 600 ? 'text-yellow-600' : 'text-red-600'}`}>
              {score}
            </p>
          </div>
        </div>

        {/* Cash Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <Wallet className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Bank Balance</p>
            <p className="text-2xl font-bold text-gray-900">${cash}</p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Scenario</p>
             <p className="text-xl font-mono text-gray-900">{currentScenario + 1} <span className="text-gray-400">/</span> {scenarios.length}</p>
           </div>
           <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-clarity-blue transition-all duration-500" style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }} />
           </div>
        </div>
      </div>

      <AnimatePresence mode='wait'>
        {gameState === 'playing' && (
          <motion.div 
            key="scenario"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
          >
            <div className="mb-8 border-b border-gray-100 pb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-clarity-blue text-xs font-bold tracking-wider mb-3">DECISION POINT</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{scenarios[currentScenario].title}</h2>
              <p className="text-xl text-gray-600 leading-relaxed">{scenarios[currentScenario].description}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {scenarios[currentScenario].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  className="group relative p-6 text-left rounded-xl bg-gray-50 border-2 border-transparent hover:border-clarity-blue hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-800 group-hover:text-clarity-blue transition-colors">{choice.text}</span>
                    <ArrowRight className="text-gray-300 group-hover:text-clarity-blue opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'feedback' && (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-2xl p-8 border-t-8 shadow-xl ${feedback.scoreImpact >= 0 ? 'border-green-500' : 'border-red-500'} text-center`}
          >
            <div className="mb-6 inline-flex justify-center items-center p-4 rounded-full bg-gray-50">
              {feedback.scoreImpact >= 0 ? <CheckCircle className="w-12 h-12 text-green-500" /> : <AlertTriangle className="w-12 h-12 text-red-500" />}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {feedback.scoreImpact > 0 ? 'Good Choice!' : feedback.scoreImpact < 0 ? 'Credit Score Hit!' : 'Neutral Outcome'}
            </h2>
            
            <div className="flex justify-center gap-8 my-6">
                <div className="text-center">
                    <p className="text-xs uppercase text-gray-500 font-bold">Score Impact</p>
                    <p className={`text-3xl font-bold ${feedback.scoreImpact >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {feedback.scoreImpact > 0 ? '+' : ''}{feedback.scoreImpact}
                    </p>
                </div>
                {feedback.cashImpact !== 0 && (
                     <div className="text-center">
                     <p className="text-xs uppercase text-gray-500 font-bold">Cash Impact</p>
                     <p className={`text-3xl font-bold ${feedback.cashImpact >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                     {feedback.cashImpact > 0 ? '+' : ''}{feedback.cashImpact}
                     </p>
                 </div>
                )}
            </div>
            
            <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto bg-gray-50 p-4 rounded-lg">{feedback.msg}</p>

            <button 
              onClick={nextRound}
              className="px-8 py-3 bg-clarity-blue text-white rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto shadow-lg shadow-blue-500/30"
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
            className="text-center py-10 bg-white rounded-2xl shadow-xl border border-gray-200"
          >
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 drop-shadow-lg" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Game Over!</h2>
            
            <div className="flex justify-center gap-12 mb-8">
                <div>
                    <p className="text-gray-500 uppercase text-sm font-bold">Final Score</p>
                    <p className="text-4xl font-bold text-clarity-blue">{score}</p>
                </div>
                <div>
                    <p className="text-gray-500 uppercase text-sm font-bold">Final Cash</p>
                    <p className="text-4xl font-bold text-green-600">${cash}</p>
                </div>
            </div>
            
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-clarity-red text-white rounded-full font-bold hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto shadow-lg shadow-red-500/30"
            >
              Play Again <RefreshCw className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
