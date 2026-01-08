'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Wallet,
  CreditCard,
  Activity,
} from 'lucide-react';

// Backend base URL (falls back to localhost if env var missing)
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

async function runStressTest(currentState) {
  const res = await fetch(`${API}/api/stress-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      state: currentState,
      runs: 600,
      maxShock: 2000,
      step: 200,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Stress test failed');
  }

  return await res.json();
}

// Scenarios (now include optional impacts for debt/limit/inquiries/etc.)
const scenarios = [
  {
    id: 1,
    title: 'The Midnight Splurge',
    description:
      "It's 2 AM. You see a limited edition sneaker drop for $250. You only have $100 in your checking account, but you have a credit card with a $500 limit.",
    choices: [
      {
        text: 'Buy it on credit! #NewKicks',
        scoreImpact: -15,
        cashImpact: 0, // paying with credit doesn’t reduce bank balance immediately
        ccBalanceImpact: +250,
        stressImpact: +1,
        feedback: 'Your card balance jumped. Utilization spiked, and your buffer didn’t improve.',
      },
      {
        text: 'Sleep on it. Save up first.',
        scoreImpact: +5,
        cashImpact: 0,
        feedback: 'Smart move. Avoiding unnecessary debt keeps utilization low.',
      },
      {
        text: "Buy via 'Buy Now Pay Later'",
        scoreImpact: -5,
        cashImpact: -62, // first installment-ish
        installmentLoanImpact: +250, // treat as installment-like obligation
        stressImpact: +1,
        feedback:
          "Better than maxing your card, but BNPL can get messy if payments stack up.",
      },
    ],
  },
  {
    id: 2,
    title: 'The Forgotten Bill',
    description:
      "You receive your utility bill for $80. It's due tomorrow, but payday isn't for another week. You have $50 cash.",
    choices: [
      {
        text: 'Ignore it until payday.',
        scoreImpact: -25,
        cashImpact: -35, // late fee
        latePaymentsImpact: +1,
        onTimeStreakReset: true,
        stressImpact: +1,
        feedback: 'Ouch. Late fee + a missed payment mark is one of the biggest score hits.',
      },
      {
        text: 'Call and ask for an extension.',
        scoreImpact: 0,
        cashImpact: 0,
        feedback: 'Proactive. Many companies will waive fees if you ask early.',
      },
      {
        text: 'Pay partial amount ($50).',
        scoreImpact: -10,
        cashImpact: -50,
        stressImpact: +1,
        feedback:
          'Better than nothing, but you may still get a fee or delinquency on the remainder.',
      },
    ],
  },
  {
    id: 3,
    title: 'Credit Limit Increase',
    description:
      "Your card issuer offers to raise your limit from $2,000 to $5,000. You didn't ask for it.",
    choices: [
      {
        text: 'Accept it!',
        scoreImpact: +20,
        cashImpact: 0,
        limitImpact: +3000,
        feedback:
          "Higher limit can lower utilization — as long as you don't increase spending.",
      },
      {
        text: 'Reject it.',
        scoreImpact: 0,
        cashImpact: 0,
        feedback: 'Neutral. You missed a chance to improve utilization.',
      },
      {
        text: 'Accept but ask for lower interest.',
        scoreImpact: +20,
        cashImpact: 0,
        limitImpact: +3000,
        feedback: 'Best of both worlds: utilization benefit + maybe lower APR.',
      },
    ],
  },
  {
    id: 4,
    title: 'Friend in Need',
    description:
      'Your best friend asks you to co-sign a $15,000 car loan because they have bad credit.',
    choices: [
      {
        text: "Sure, that's what friends are for!",
        scoreImpact: -10,
        cashImpact: 0,
        installmentLoanImpact: +15000,
        stressImpact: +2,
        feedback:
          "High risk. If they miss, you're on the hook. Your debt burden and risk go up.",
      },
      {
        text: "No, I can't do that.",
        scoreImpact: 0,
        cashImpact: 0,
        feedback:
          "The safe play. Don't co-sign unless you're willing to pay the whole thing.",
      },
      {
        text: 'Gift them $500 for down payment instead.',
        scoreImpact: 0,
        cashImpact: -500,
        feedback:
          'Generous. You help without tying your credit to their payment behavior.',
      },
    ],
  },
  {
    id: 5,
    title: 'Too Many Cards?',
    description:
      "You have 2 cards. You get an offer for a 'Super Rewards' card with a $200 sign-up bonus.",
    choices: [
      {
        text: 'Apply immediately!',
        scoreImpact: -5,
        cashImpact: +200,
        hardInquiriesImpact: +1,
        accountsImpact: +1,
        limitImpact: +1000,
        feedback:
          'Hard inquiry dips score short-term, but you gained cash and more available credit.',
      },
      {
        text: 'Shred the offer.',
        scoreImpact: 0,
        cashImpact: 0,
        feedback: 'Status quo maintained.',
      },
      {
        text: 'Apply for 3 different cards at once.',
        scoreImpact: -30,
        cashImpact: 0,
        hardInquiriesImpact: +3,
        accountsImpact: +3,
        limitImpact: +3000,
        stressImpact: +1,
        feedback:
          'Too many inquiries at once looks risky. Average age drops, lenders get spooked.',
      },
    ],
  },
];

function clampScore(n) {
  return Math.max(300, Math.min(850, n));
}
function fmtMoney(n) {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString()}`;
}

export default function CreditGame() {
  const [currentScenario, setCurrentScenario] = useState(0);

  // Core displayed stats
  const [score, setScore] = useState(650);
  const [cash, setCash] = useState(1000);

  // Credit mechanics for backend stress test
  const [limit, setLimit] = useState(500);
  const [ccBalance, setCcBalance] = useState(0);
  const [accounts, setAccounts] = useState(1);
  const [hardInquiries, setHardInquiries] = useState(0);
  const [latePayments, setLatePayments] = useState(0);
  const [onTimeStreak, setOnTimeStreak] = useState(0);
  const [installmentLoan, setInstallmentLoan] = useState(0);
  const [stress, setStress] = useState(0);
  const [noCreditHistory, setNoCreditHistory] = useState(false);

  const [feedback, setFeedback] = useState(null);
  const [gameState, setGameState] = useState('playing');

  // Stress Test UI state
  const [stressResult, setStressResult] = useState(null);
  const [stressLoading, setStressLoading] = useState(false);
  const [stressError, setStressError] = useState('');

  const utilPct = useMemo(() => {
    if (!limit || limit <= 0) return null;
    return Math.round((ccBalance / limit) * 100);
  }, [ccBalance, limit]);

  const backendState = useMemo(
    () => ({
      score,
      cash,
      limit,
      cc_balance: ccBalance,
      accounts,
      hard_inquiries: hardInquiries,
      late_payments: latePayments,
      on_time_streak: onTimeStreak,
      installment_loan: installmentLoan,
      stress,
      no_credit_history: noCreditHistory,
    }),
    [
      score,
      cash,
      limit,
      ccBalance,
      accounts,
      hardInquiries,
      latePayments,
      onTimeStreak,
      installmentLoan,
      stress,
      noCreditHistory,
    ]
  );

  const handleChoice = (choice) => {
    // score + cash
    setScore((prev) => clampScore(prev + (choice.scoreImpact || 0)));
    setCash((prev) => prev + (choice.cashImpact || 0));

    // credit mechanics (optional per choice)
    if (choice.limitImpact) setLimit((p) => Math.max(0, p + choice.limitImpact));
    if (choice.ccBalanceImpact) setCcBalance((p) => Math.max(0, p + choice.ccBalanceImpact));
    if (choice.accountsImpact) setAccounts((p) => Math.max(0, p + choice.accountsImpact));
    if (choice.hardInquiriesImpact) setHardInquiries((p) => Math.max(0, p + choice.hardInquiriesImpact));
    if (choice.latePaymentsImpact) setLatePayments((p) => Math.max(0, p + choice.latePaymentsImpact));
    if (choice.installmentLoanImpact) setInstallmentLoan((p) => Math.max(0, p + choice.installmentLoanImpact));
    if (choice.stressImpact) setStress((p) => Math.max(0, p + choice.stressImpact));

    if (choice.onTimeStreakReset) {
      setOnTimeStreak(0);
    } else {
      // small “good habit” bump if choice is non-negative
      if ((choice.scoreImpact || 0) >= 0) setOnTimeStreak((p) => p + 1);
    }

    setFeedback({
      msg: choice.feedback,
      scoreImpact: choice.scoreImpact || 0,
      cashImpact: choice.cashImpact || 0,
    });

    setGameState('feedback');
  };

  const nextRound = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario((prev) => prev + 1);
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
    setLimit(500);
    setCcBalance(0);
    setAccounts(1);
    setHardInquiries(0);
    setLatePayments(0);
    setOnTimeStreak(0);
    setInstallmentLoan(0);
    setStress(0);
    setNoCreditHistory(false);
    setFeedback(null);
    setGameState('playing');

    // reset stress test panel
    setStressResult(null);
    setStressLoading(false);
    setStressError('');
  };

  async function onStressTest() {
    try {
      setStressError('');
      setStressLoading(true);
      const data = await runStressTest(backendState);
      setStressResult(data);
    } catch (e) {
      setStressError(e?.message || 'Error');
    } finally {
      setStressLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Header / Scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Score Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Trophy className="text-clarity-blue w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Credit Score</p>
            <p
              className={`text-2xl font-bold ${
                score >= 700 ? 'text-green-600' : score >= 600 ? 'text-yellow-600' : 'text-red-600'
              }`}
            >
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
            <p className="text-2xl font-bold text-gray-900">{fmtMoney(cash)}</p>
          </div>
        </div>

        {/* Card Utilization Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <CreditCard className="text-purple-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Utilization</p>
            <p className="text-2xl font-bold text-gray-900">
              {utilPct === null ? 'N/A' : `${utilPct}%`}
            </p>
            <p className="text-xs text-gray-500">
              {fmtMoney(ccBalance)} / {fmtMoney(limit)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress + Stress Test */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Scenario</p>
            <p className="text-xl font-mono text-gray-900">
              {currentScenario + 1} <span className="text-gray-400">/</span> {scenarios.length}
            </p>
          </div>
          <div className="h-2 w-40 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-clarity-blue transition-all duration-500"
              style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onStressTest}
            disabled={stressLoading}
            className="px-4 py-2 rounded-lg bg-black text-white font-bold disabled:opacity-50 flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            {stressLoading ? 'Running Stress Test…' : 'Stress Test'}
          </button>
          <p className="text-xs text-gray-500">
            (runs on Express API)
          </p>
        </div>
      </div>

      {/* Stress Test Result Panel */}
      {(stressError || stressResult) && (
        <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Credit Stress Test</h3>
          <p className="text-sm text-gray-600 mb-4">
            Educational simulation: “If a surprise expense hits, how fragile is your profile?”
          </p>

          {stressError && <p className="text-red-500 font-medium">{stressError}</p>}

          {stressResult && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase text-gray-500 font-bold mb-1">Breakpoint</p>
                  <p className="text-gray-900">
                    Approve drops below 50% at:{' '}
                    <b>{stressResult.breakpoints.approveDropsBelow50 ?? 'N/A'}</b>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs uppercase text-gray-500 font-bold mb-1">Breakpoint</p>
                  <p className="text-gray-900">
                    Late risk &gt; 15% at:{' '}
                    <b>{stressResult.breakpoints.lateRiskAbove15 ?? 'N/A'}</b>
                  </p>
                </div>
              </div>

              {/* Quick MVP table (readable in demo) */}
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2 pr-3">Shock</th>
                      <th className="py-2 pr-3">P(Approve)</th>
                      <th className="py-2 pr-3">P(Late)</th>
                      <th className="py-2 pr-3">Avg Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stressResult.curve?.map((p) => (
                      <tr key={p.shock} className="border-t border-gray-100">
                        <td className="py-2 pr-3">{fmtMoney(p.shock)}</td>
                        <td className="py-2 pr-3">{Math.round(p.pApprove * 100)}%</td>
                        <td className="py-2 pr-3">{Math.round(p.pLate * 100)}%</td>
                        <td className="py-2 pr-3">{p.avgScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {gameState === 'playing' && (
          <motion.div
            key="scenario"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
          >
            <div className="mb-8 border-b border-gray-100 pb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-clarity-blue text-xs font-bold tracking-wider mb-3">
                DECISION POINT
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {scenarios[currentScenario].title}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                {scenarios[currentScenario].description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {scenarios[currentScenario].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  className="group relative p-6 text-left rounded-xl bg-gray-50 border-2 border-transparent hover:border-clarity-blue hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-800 group-hover:text-clarity-blue transition-colors">
                      {choice.text}
                    </span>
                    <ArrowRight className="text-gray-300 group-hover:text-clarity-blue opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'feedback' && feedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-2xl p-8 border-t-8 shadow-xl ${
              feedback.scoreImpact >= 0 ? 'border-green-500' : 'border-red-500'
            } text-center`}
          >
            <div className="mb-6 inline-flex justify-center items-center p-4 rounded-full bg-gray-50">
              {feedback.scoreImpact >= 0 ? (
                <CheckCircle className="w-12 h-12 text-green-500" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-red-500" />
              )}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {feedback.scoreImpact > 0
                ? 'Good Choice!'
                : feedback.scoreImpact < 0
                ? 'Credit Score Hit!'
                : 'Neutral Outcome'}
            </h2>

            <div className="flex justify-center gap-8 my-6">
              <div className="text-center">
                <p className="text-xs uppercase text-gray-500 font-bold">Score Impact</p>
                <p className={`text-3xl font-bold ${feedback.scoreImpact >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {feedback.scoreImpact > 0 ? '+' : ''}
                  {feedback.scoreImpact}
                </p>
              </div>

              {feedback.cashImpact !== 0 && (
                <div className="text-center">
                  <p className="text-xs uppercase text-gray-500 font-bold">Cash Impact</p>
                  <p className={`text-3xl font-bold ${feedback.cashImpact >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {feedback.cashImpact > 0 ? '+' : ''}
                    {feedback.cashImpact}
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto bg-gray-50 p-4 rounded-lg">
              {feedback.msg}
            </p>

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
                <p className="text-4xl font-bold text-green-600">{fmtMoney(cash)}</p>
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
