"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Trophy,
    Wallet,
    TrendingUp,
    TrendingDown,
    CreditCard,
    Calendar,
    Percent,
    Award,
    Target,
    Star,
    Shield,
    Zap,
} from "lucide-react";

const scenarios = [
    {
        id: 1,
        title: "Your First Credit Card!",
        description:
            "Congratulations! You just got approved for your first credit card with a $1,000 limit. Your first statement of $200 is due. What do you do?",
        choices: [
            {
                text: "Pay full balance on time",
                scoreImpact: +15,
                debtImpact: 0,
                historyImpact: +10,
                utilizationImpact: -20,
                badge: "On-Time Payer",
                feedback:
                    "Perfect! Paying in full avoids interest AND builds excellent payment history. This is the #1 way to build credit.",
                explanation:
                    "Payment history is 35% of your credit score. Paying on time every month is the single most important thing you can do.",
            },
            {
                text: "Pay only the minimum ($25)",
                scoreImpact: -5,
                debtImpact: +175,
                historyImpact: +5,
                utilizationImpact: +5,
                feedback:
                    "You avoided a late payment, but now you owe $175 plus interest. At 24% APR, you'll pay an extra $42 in interest over time.",
                explanation:
                    "Minimum payments keep your account in good standing but carry a balance that accrues interest daily.",
            },
            {
                text: "Miss the payment entirely",
                scoreImpact: -45,
                debtImpact: +235,
                historyImpact: -25,
                utilizationImpact: +10,
                feedback:
                    "Disaster! $35 late fee added. If 30+ days late, this goes on your credit report for 7 YEARS. Your score tanks.",
                explanation:
                    "Late payments over 30 days are reported to credit bureaus and stay on your report for 7 years, severely impacting your score.",
            },
        ],
    },
    {
        id: 2,
        title: "The Shopping Spree",
        description:
            "Black Friday deals are amazing! You could buy $800 worth of stuff on your $1,000 limit card. Your current balance is $100.",
        choices: [
            {
                text: "Max it out! YOLO!",
                scoreImpact: -25,
                debtImpact: +800,
                historyImpact: 0,
                utilizationImpact: +70,
                feedback:
                    "Your utilization just hit 90%! Lenders see this as desperate behavior. Your score drops significantly.",
                explanation:
                    "Credit utilization (how much you use vs. your limit) is 30% of your score. Experts recommend staying under 30%.",
            },
            {
                text: "Buy $200 worth, stay under 30%",
                scoreImpact: +10,
                debtImpact: +200,
                historyImpact: 0,
                utilizationImpact: +10,
                badge: "Smart Spender",
                feedback:
                    "Smart! You got some deals while keeping utilization at 30%. This shows lenders you're responsible.",
                explanation:
                    "Keeping utilization under 30% signals to lenders that you're not dependent on credit.",
            },
            {
                text: "Skip the sales, pay off the $100",
                scoreImpact: +5,
                debtImpact: -100,
                historyImpact: 0,
                utilizationImpact: -10,
                feedback:
                    "Disciplined! You prioritized debt payoff over temporary discounts. Your utilization drops to 0%.",
                explanation:
                    "0% utilization is great, though some experts suggest 1-9% is optimal to show active card usage.",
            },
        ],
    },
    {
        id: 3,
        title: "Credit Limit Increase Offer",
        description:
            "Your bank offers to raise your credit limit from $1,000 to $3,000. No hard inquiry required!",
        choices: [
            {
                text: "Accept the increase!",
                scoreImpact: +20,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: -15,
                badge: "Limit Builder",
                feedback:
                    "Excellent! Your utilization ratio just dropped by 66% without paying anything. Free score boost!",
                explanation:
                    "Higher limits with same spending = lower utilization. This is a 'hack' for improving your score.",
            },
            {
                text: "Decline - I might overspend",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "Understandable if you struggle with temptation, but you missed a free utilization improvement.",
                explanation:
                    "If you have good spending discipline, higher limits are always beneficial for your credit score.",
            },
        ],
    },
    {
        id: 4,
        title: "The Emergency Car Repair",
        description:
            "Your car breaks down. Repair cost: $600. You have $200 in savings. How do you handle this?",
        choices: [
            {
                text: "Put it all on credit card",
                scoreImpact: -10,
                debtImpact: +600,
                historyImpact: 0,
                utilizationImpact: +40,
                feedback:
                    "You solved the emergency but added $600 in high-interest debt. Make a payoff plan ASAP.",
                explanation:
                    "Credit cards for emergencies is okay, but create a plan to pay it off quickly to avoid interest spiraling.",
            },
            {
                text: "Use savings + payment plan with mechanic",
                scoreImpact: +5,
                debtImpact: +200,
                historyImpact: +5,
                utilizationImpact: +10,
                badge: "Problem Solver",
                feedback:
                    "Great negotiation! Many mechanics offer 0% payment plans. You minimized debt and kept some savings.",
                explanation:
                    "Always ask about payment plans! Many vendors offer interest-free options that don't affect your credit.",
            },
            {
                text: "Ignore it, take the bus",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "You avoided debt but might lose your job if you can't get to work. Sometimes debt is necessary.",
                explanation:
                    "Good debt enables income. Avoiding all debt isn't always the smartest financial choice.",
            },
        ],
    },
    {
        id: 5,
        title: "The Second Card Decision",
        description:
            "You've had your card for a year. A new card offers 2% cashback and $200 sign-up bonus. Should you apply?",
        choices: [
            {
                text: "Apply for it!",
                scoreImpact: -8,
                debtImpact: 0,
                historyImpact: -5,
                utilizationImpact: -10,
                feedback:
                    "Short-term score dip from hard inquiry, but more available credit helps long-term. Plus, free $200!",
                explanation:
                    "Hard inquiries drop your score 5-10 points temporarily but fall off after 2 years. Worth it for good cards.",
            },
            {
                text: "Wait another year",
                scoreImpact: +5,
                debtImpact: 0,
                historyImpact: +5,
                utilizationImpact: 0,
                feedback:
                    "Conservative approach. Your average account age keeps growing, which helps your score.",
                explanation:
                    "Average age of accounts is 15% of your score. Waiting can be strategic if you're not in a rush.",
            },
            {
                text: "Apply for 3 cards at once!",
                scoreImpact: -35,
                debtImpact: 0,
                historyImpact: -15,
                utilizationImpact: -5,
                feedback:
                    "Triple hard inquiries! Lenders see this as desperate. Your score takes a big hit.",
                explanation:
                    "Multiple applications in a short period is a red flag to lenders, suggesting financial distress.",
            },
        ],
    },
    {
        id: 6,
        title: "The Forgotten Subscription",
        description:
            "You realize you've been paying $15/month for a streaming service you never use. It's been 6 months.",
        choices: [
            {
                text: "Cancel immediately",
                scoreImpact: 0,
                debtImpact: -15,
                historyImpact: 0,
                utilizationImpact: 0,
                badge: "Budget Boss",
                feedback:
                    "Good catch! That's $90 wasted, but you stopped the bleeding. Set calendar reminders for free trials!",
                explanation:
                    "Subscription creep is real. Review your statements monthly to catch forgotten recurring charges.",
            },
            {
                text: "Keep it, I might use it",
                scoreImpact: 0,
                debtImpact: +15,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "That's $180/year for 'might use.' This is how small leaks sink financial ships.",
                explanation:
                    "The average American wastes $240/year on unused subscriptions. Audit regularly!",
            },
        ],
    },
    {
        id: 7,
        title: "The Credit Report Check",
        description:
            "You pull your free annual credit report and find an account you don't recognize - a $500 collection!",
        choices: [
            {
                text: "Dispute it with all 3 bureaus",
                scoreImpact: +40,
                debtImpact: 0,
                historyImpact: +15,
                utilizationImpact: 0,
                badge: "Credit Defender",
                feedback:
                    "You disputed the error with documentation. It was removed! Your score jumps significantly.",
                explanation:
                    "1 in 4 credit reports have errors. Disputing inaccurate items is FREE and can dramatically boost your score.",
            },
            {
                text: "Just pay it to make it go away",
                scoreImpact: +10,
                debtImpact: +500,
                historyImpact: +5,
                utilizationImpact: 0,
                feedback:
                    "You paid a debt that wasn't yours! Always verify before paying. Paid collections still hurt your score.",
                explanation:
                    "Paying a collection doesn't remove it from your report. A 'paid collection' still shows for 7 years.",
            },
            {
                text: "Ignore it",
                scoreImpact: -20,
                debtImpact: 0,
                historyImpact: -10,
                utilizationImpact: 0,
                feedback:
                    "The collection remains, dragging down your score. It could also be identity theft getting worse!",
                explanation:
                    "Ignoring collections lets them grow with fees and interest. They can also lead to lawsuits.",
            },
        ],
    },
    {
        id: 8,
        title: "The Balance Transfer Offer",
        description:
            "You have $2,000 in credit card debt at 24% APR. A new card offers 0% APR for 18 months on balance transfers (3% fee).",
        choices: [
            {
                text: "Transfer the balance!",
                scoreImpact: -5,
                debtImpact: +60,
                historyImpact: 0,
                utilizationImpact: 0,
                badge: "Debt Strategist",
                feedback:
                    "Smart! You pay $60 fee but save ~$720 in interest over 18 months. Make sure to pay it off before 0% ends!",
                explanation:
                    "Balance transfers can save hundreds in interest. The key is paying off BEFORE the promotional period ends.",
            },
            {
                text: "Keep paying current card",
                scoreImpact: 0,
                debtImpact: +40,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "You'll pay an extra $720+ in interest over time. Sometimes the math clearly favors action.",
                explanation:
                    "At 24% APR, a $2,000 balance costs ~$40/month in interest alone. Balance transfers can break this cycle.",
            },
        ],
    },
    {
        id: 9,
        title: "The Co-Signer Request",
        description:
            "Your sibling with bad credit asks you to co-sign their $10,000 car loan. They promise to make all payments.",
        choices: [
            {
                text: "Sure, family first!",
                scoreImpact: -15,
                debtImpact: +10000,
                historyImpact: -5,
                utilizationImpact: 0,
                feedback:
                    "The loan now shows on YOUR credit report. If they miss ONE payment, YOUR score suffers. You're 100% liable.",
                explanation:
                    "Co-signing means you're equally responsible for the debt. 38% of co-signers end up paying some or all of the loan.",
            },
            {
                text: "Offer to help them build credit another way",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                badge: "Wise Helper",
                feedback:
                    "Smart boundary! You suggest they get a secured card or become an authorized user on someone's card instead.",
                explanation:
                    "There are safer ways to help someone build credit without putting your own financial future at risk.",
            },
            {
                text: "Gift them $1,000 for down payment",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "Generous! A larger down payment might help them qualify alone. Your credit stays protected.",
                explanation:
                    "One-time gifts don't create ongoing liability like co-signing does.",
            },
        ],
    },
    {
        id: 10,
        title: "The Old Card Dilemma",
        description:
            "Your first credit card (now 5 years old) has no rewards. You never use it. It has no annual fee.",
        choices: [
            {
                text: "Close it - I have better cards",
                scoreImpact: -20,
                debtImpact: 0,
                historyImpact: -15,
                utilizationImpact: +15,
                feedback:
                    "Ouch! You just killed 5 years of credit history AND reduced your total available credit.",
                explanation:
                    "Length of credit history is 15% of your score. That old card was quietly helping you.",
            },
            {
                text: "Keep it, use for small purchase monthly",
                scoreImpact: +10,
                debtImpact: 0,
                historyImpact: +10,
                utilizationImpact: 0,
                badge: "History Keeper",
                feedback:
                    "Perfect! A small recurring charge (like Spotify) keeps it active. That history keeps growing.",
                explanation:
                    "Inactive cards might be closed by the issuer. A small monthly charge prevents this.",
            },
            {
                text: "Ask for a product change to a rewards card",
                scoreImpact: +15,
                debtImpact: 0,
                historyImpact: +5,
                utilizationImpact: 0,
                badge: "Card Upgrader",
                feedback:
                    "Brilliant! You keep the account age but get better rewards. No hard inquiry needed.",
                explanation:
                    "Product changes let you keep your credit history while getting a better card. Always ask!",
            },
        ],
    },
    {
        id: 11,
        title: "The Rent Reporting Opportunity",
        description:
            "A service offers to report your on-time rent payments to credit bureaus for $5/month. You've never missed rent.",
        choices: [
            {
                text: "Sign up immediately!",
                scoreImpact: +25,
                debtImpact: +5,
                historyImpact: +20,
                utilizationImpact: 0,
                badge: "Rent Reporter",
                feedback:
                    "Great for thin credit files! Your 2 years of on-time rent now counts toward payment history.",
                explanation:
                    "Rent reporting can add positive payment history, especially helpful for those new to credit.",
            },
            {
                text: "Pass - my credit is already good",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "Fair point if you already have strong credit. The benefit is smaller for established credit profiles.",
                explanation:
                    "Rent reporting helps most when you have limited credit history or are rebuilding.",
            },
        ],
    },
    {
        id: 12,
        title: "The Big Purchase Decision",
        description:
            "You're buying a $1,200 laptop. You can pay cash, use credit card (3% rewards), or use the store's 0% financing for 12 months.",
        choices: [
            {
                text: "Pay cash",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "Safe choice. No debt, no risk. But you missed out on $36 in rewards.",
                explanation:
                    "Cash is king for avoiding debt, but you lose credit card protections and rewards.",
            },
            {
                text: "Credit card + pay in full",
                scoreImpact: +5,
                debtImpact: 0,
                historyImpact: +5,
                utilizationImpact: +5,
                badge: "Rewards Maximizer",
                feedback:
                    "Optimal play! You earned $36 in rewards, got purchase protection, and paid no interest.",
                explanation:
                    "Paying in full each month lets you profit from credit cards instead of them profiting from you.",
            },
            {
                text: "Store 0% financing",
                scoreImpact: -10,
                debtImpact: +1200,
                historyImpact: -5,
                utilizationImpact: 0,
                feedback:
                    "Risky! Store cards often have deferred interest - miss ONE payment and you owe ALL back interest at 29%+ APR.",
                explanation:
                    "Deferred interest is different from 0% APR. Read the fine print carefully!",
            },
            {
                text: "Credit card + minimum payments",
                scoreImpact: -15,
                debtImpact: +1200,
                historyImpact: 0,
                utilizationImpact: +35,
                feedback:
                    "You got rewards but now have $1,200 in debt at high interest. This could cost you $300+ extra.",
                explanation:
                    "Credit card rewards never outweigh carrying a balance. The math always favors paying in full.",
            },
        ],
    },
];

export default function ScenarioGame() {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [score, setScore] = useState(650);
    const [debt, setDebt] = useState(0);
    const [paymentHistory, setPaymentHistory] = useState(50); // 0-100 scale
    const [utilization, setUtilization] = useState(30); // percentage
    const [badges, setBadges] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [gameStatus, setGameStatus] = useState("playing");

    const handleChoice = (choice) => {
        const newScore = Math.min(
            850,
            Math.max(300, score + choice.scoreImpact)
        );
        const newDebt = Math.max(0, debt + (choice.debtImpact || 0));
        const newHistory = Math.min(
            100,
            Math.max(0, paymentHistory + (choice.historyImpact || 0))
        );
        const newUtilization = Math.min(
            100,
            Math.max(0, utilization + (choice.utilizationImpact || 0))
        );

        setScore(newScore);
        setDebt(newDebt);
        setPaymentHistory(newHistory);
        setUtilization(newUtilization);

        if (choice.badge && !badges.includes(choice.badge)) {
            setBadges([...badges, choice.badge]);
        }

        setFeedback({
            message: choice.feedback,
            explanation: choice.explanation,
            scoreImpact: choice.scoreImpact,
            debtImpact: choice.debtImpact || 0,
            historyImpact: choice.historyImpact || 0,
            utilizationImpact: choice.utilizationImpact || 0,
            badge: choice.badge,
        });
        setGameStatus("feedback");
    };

    const handleNext = () => {
        if (currentScenario < scenarios.length - 1) {
            setCurrentScenario(currentScenario + 1);
            setGameStatus("playing");
            setFeedback(null);
        } else {
            setGameStatus("finished");
        }
    };

    const resetGame = () => {
        setScore(650);
        setDebt(0);
        setPaymentHistory(50);
        setUtilization(30);
        setBadges([]);
        setCurrentScenario(0);
        setGameStatus("playing");
        setFeedback(null);
    };

    const getScoreColor = (s) => {
        if (s >= 740) return "text-green-600";
        if (s >= 670) return "text-blue-600";
        if (s >= 580) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreLabel = (s) => {
        if (s >= 740) return "Excellent";
        if (s >= 670) return "Good";
        if (s >= 580) return "Fair";
        return "Poor";
    };

    const getHistoryLabel = (h) => {
        if (h >= 80) return "Excellent";
        if (h >= 60) return "Good";
        if (h >= 40) return "Fair";
        return "Poor";
    };

    const getUtilizationColor = (u) => {
        if (u <= 30) return "text-green-600";
        if (u <= 50) return "text-yellow-600";
        return "text-red-600";
    };

    // Sidebar Component
    const Sidebar = () => (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-clarity-blue" />
                Your Stats
            </h3>

            {/* Credit Score */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                        <Trophy className="w-4 h-4" /> Credit Score
                    </span>
                    <span
                        className={`text-lg font-black ${getScoreColor(score)}`}
                    >
                        {score}
                    </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                        style={{ width: `${((score - 300) / 550) * 100}%` }}
                    />
                </div>
                <p className={`text-xs font-medium ${getScoreColor(score)}`}>
                    {getScoreLabel(score)}
                </p>
            </div>

            {/* Debt Level */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                        <CreditCard className="w-4 h-4" /> Debt Level
                    </span>
                    <span
                        className={`text-lg font-black ${
                            debt > 5000
                                ? "text-red-600"
                                : debt > 1000
                                ? "text-yellow-600"
                                : "text-green-600"
                        }`}
                    >
                        ${debt.toLocaleString()}
                    </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${
                            debt > 5000
                                ? "bg-red-500"
                                : debt > 1000
                                ? "bg-yellow-500"
                                : "bg-green-500"
                        }`}
                        style={{
                            width: `${Math.min(100, (debt / 10000) * 100)}%`,
                        }}
                    />
                </div>
            </div>

            {/* Payment History */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Payment History
                    </span>
                    <span
                        className={`text-lg font-black ${
                            paymentHistory >= 60
                                ? "text-green-600"
                                : paymentHistory >= 40
                                ? "text-yellow-600"
                                : "text-red-600"
                        }`}
                    >
                        {paymentHistory}%
                    </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${
                            paymentHistory >= 60
                                ? "bg-green-500"
                                : paymentHistory >= 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${paymentHistory}%` }}
                    />
                </div>
                <p
                    className={`text-xs font-medium ${
                        paymentHistory >= 60
                            ? "text-green-600"
                            : paymentHistory >= 40
                            ? "text-yellow-600"
                            : "text-red-600"
                    }`}
                >
                    {getHistoryLabel(paymentHistory)}
                </p>
            </div>

            {/* Credit Utilization */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                        <Percent className="w-4 h-4" /> Utilization
                    </span>
                    <span
                        className={`text-lg font-black ${getUtilizationColor(
                            utilization
                        )}`}
                    >
                        {utilization}%
                    </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${
                            utilization <= 30
                                ? "bg-green-500"
                                : utilization <= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${utilization}%` }}
                    />
                </div>
                <p
                    className={`text-xs font-medium ${getUtilizationColor(
                        utilization
                    )}`}
                >
                    {utilization <= 30
                        ? "Healthy"
                        : utilization <= 50
                        ? "Moderate"
                        : "High Risk"}
                </p>
            </div>

            {/* Progress */}
            <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">
                        Progress
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                        {currentScenario + 1}/{scenarios.length}
                    </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-clarity-blue transition-all duration-500"
                        style={{
                            width: `${
                                ((currentScenario + 1) / scenarios.length) * 100
                            }%`,
                        }}
                    />
                </div>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-3">
                        <Award className="w-4 h-4" /> Badges Earned
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {badges.map((badge, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold"
                            >
                                <Star className="w-3 h-3" /> {badge}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto flex gap-8">
                {/* Sidebar - 20% from left with spacing */}
                <div className="hidden lg:block w-72 flex-shrink-0 ml-[5%]">
                    <div className="sticky top-24">
                        <Sidebar />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 max-w-3xl">
                    <AnimatePresence mode="wait">
                        {/* PLAYING STATE */}
                        {gameStatus === "playing" && (
                            <motion.div
                                key={`playing-${currentScenario}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative"
                            >
                                {/* Mascot Section - Above Questions */}
                                <div className="flex items-end gap-4 mb-4">
                                    {/* Mascot Image */}
                                    <motion.div
                                        initial={{ scale: 0, rotate: -10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            type: "spring",
                                            delay: 0.1,
                                        }}
                                        className="flex-shrink-0"
                                    >
                                        <img
                                            src="/mascot.png"
                                            alt="Credit Advisor"
                                            className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-xl"
                                        />
                                    </motion.div>

                                    {/* Speech Bubble with Question */}
                                    <motion.div
                                        initial={{
                                            scale: 0.8,
                                            opacity: 0,
                                            x: -20,
                                        }}
                                        animate={{ scale: 1, opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.3,
                                            type: "spring",
                                            stiffness: 100,
                                        }}
                                        className="relative bg-white p-5 md:p-6 rounded-2xl rounded-bl-none shadow-lg border border-blue-100 flex-1"
                                    >
                                        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider mb-2">
                                            SCENARIO {currentScenario + 1} OF{" "}
                                            {scenarios.length}
                                        </span>
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                            {scenarios[currentScenario].title}
                                        </h2>
                                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                            {
                                                scenarios[currentScenario]
                                                    .description
                                            }
                                        </p>

                                        {/* Triangle pointer to mascot */}
                                        <div className="absolute bottom-4 -left-3 w-6 h-6 bg-white border-b border-l border-blue-100 transform rotate-45" />
                                    </motion.div>
                                </div>

                                {/* Options - Below Mascot */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-lg space-y-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                        Choose Your Action
                                    </p>
                                    {scenarios[currentScenario].choices.map(
                                        (choice, idx) => (
                                            <motion.button
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: 0.5 + idx * 0.1,
                                                }}
                                                key={idx}
                                                onClick={() =>
                                                    handleChoice(choice)
                                                }
                                                className="group w-full p-4 text-left rounded-xl bg-gray-50 border-2 border-transparent hover:border-blue-500 hover:bg-white hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-white border-2 border-gray-200 text-gray-500 flex items-center justify-center font-bold group-hover:border-blue-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                                                        {String.fromCharCode(
                                                            65 + idx
                                                        )}
                                                    </span>
                                                    <span className="text-base font-medium text-gray-800 group-hover:text-blue-600 transition-colors flex-1">
                                                        {choice.text}
                                                    </span>
                                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                                                </div>
                                            </motion.button>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* FEEDBACK STATE */}
                        {gameStatus === "feedback" && feedback && (
                            <motion.div
                                key="feedback"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative"
                            >
                                {/* Mascot Section - Happy or Sad or neutral */}
                                <div className="flex items-end gap-4 mb-4">
                                    {/* Mascot Image - changes based on score */}
                                    <motion.div
                                        initial={{
                                            scale: 0,
                                            rotate:
                                                feedback.scoreImpact >= 0
                                                    ? 10
                                                    : -10,
                                        }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            type: "spring",
                                            delay: 0.1,
                                        }}
                                        className="flex-shrink-0"
                                    >
                                        <img
                                            src={
                                                feedback.scoreImpact > 0
                                                    ? "/happy_mascot.png"
                                                    : feedback.scoreImpact == 0
                                                    ? "/neutral_mascot.png"
                                                    : "/sad_mascot.png"
                                            }
                                            alt={
                                                feedback.scoreImpact >= 0
                                                    ? "Happy Advisor"
                                                    : feedback.scoreImpact == 0
                                                    ? "Neutral Advisor"
                                                    : "Sad Advisor"
                                            }
                                            className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-xl"
                                        />
                                    </motion.div>

                                    {/* Speech Bubble with Explanation */}
                                    <motion.div
                                        initial={{
                                            scale: 0.8,
                                            opacity: 0,
                                            x: -20,
                                        }}
                                        animate={{ scale: 1, opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.3,
                                            type: "spring",
                                            stiffness: 100,
                                        }}
                                        className={`relative p-5 md:p-6 rounded-2xl rounded-bl-none shadow-lg flex-1 ${
                                            feedback.scoreImpact >= 0
                                                ? "bg-green-50 border border-green-200"
                                                : "bg-red-50 border border-red-200"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            {feedback.scoreImpact >= 0 ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                            )}
                                            <span
                                                className={`text-xs font-bold uppercase tracking-wider ${
                                                    feedback.scoreImpact >= 0
                                                        ? "text-green-700"
                                                        : "text-red-700"
                                                }`}
                                            >
                                                {feedback.scoreImpact > 0
                                                    ? "Great Choice!"
                                                    : feedback.scoreImpact < 0
                                                    ? "Oops!"
                                                    : "Neutral"}
                                            </span>
                                            {feedback.badge && (
                                                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                                                    <Star className="w-3 h-3" />{" "}
                                                    {feedback.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p
                                            className={`font-medium leading-relaxed ${
                                                feedback.scoreImpact >= 0
                                                    ? "text-green-800"
                                                    : "text-red-800"
                                            }`}
                                        >
                                            {feedback.explanation}
                                        </p>

                                        {/* Triangle pointer to mascot */}
                                        <div
                                            className={`absolute bottom-4 -left-3 w-6 h-6 transform rotate-45 ${
                                                feedback.scoreImpact >= 0
                                                    ? "bg-green-50 border-b border-l border-green-200"
                                                    : "bg-red-50 border-b border-l border-red-200"
                                            }`}
                                        />
                                    </motion.div>
                                </div>

                                {/* Impact & Actions - Same spot as questions */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-lg">
                                    {/* Feedback message */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <p className="text-gray-800 font-medium">
                                            {feedback.message}
                                        </p>
                                    </div>

                                    {/* Impact Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                                            <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                                                Score
                                            </p>
                                            <div
                                                className={`flex items-center justify-center gap-1 text-xl font-bold ${
                                                    feedback.scoreImpact >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {feedback.scoreImpact > 0 ? (
                                                    <TrendingUp className="w-4 h-4" />
                                                ) : feedback.scoreImpact < 0 ? (
                                                    <TrendingDown className="w-4 h-4" />
                                                ) : null}
                                                {feedback.scoreImpact > 0
                                                    ? "+"
                                                    : ""}
                                                {feedback.scoreImpact}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                                            <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                                                Debt
                                            </p>
                                            <div
                                                className={`text-xl font-bold ${
                                                    feedback.debtImpact <= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {feedback.debtImpact > 0
                                                    ? "+"
                                                    : feedback.debtImpact < 0
                                                    ? "-"
                                                    : ""}
                                                ${Math.abs(feedback.debtImpact)}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                                            <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                                                History
                                            </p>
                                            <div
                                                className={`text-xl font-bold ${
                                                    feedback.historyImpact >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {feedback.historyImpact > 0
                                                    ? "+"
                                                    : ""}
                                                {feedback.historyImpact}%
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                                            <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                                                Utilization
                                            </p>
                                            <div
                                                className={`text-xl font-bold ${
                                                    feedback.utilizationImpact <=
                                                    0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {feedback.utilizationImpact > 0
                                                    ? "+"
                                                    : ""}
                                                {feedback.utilizationImpact}%
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        className="w-full px-6 py-4 bg-clarity-blue text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors inline-flex items-center justify-center gap-2"
                                    >
                                        {currentScenario < scenarios.length - 1
                                            ? "Next Scenario"
                                            : "See Final Results"}
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* FINISHED STATE */}
                        {gameStatus === "finished" && (
                            <motion.div
                                key="finished"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative"
                            >
                                {/* Mascot celebrating */}
                                <div className="flex items-end gap-4 mb-4">
                                    <motion.div
                                        initial={{ scale: 0, rotate: 10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            type: "spring",
                                            delay: 0.1,
                                        }}
                                        className="flex-shrink-0"
                                    >
                                        <img
                                            src={
                                                score >= 670
                                                    ? "/happy_mascot.png"
                                                    : "/sad_mascot.png"
                                            }
                                            alt="Advisor"
                                            className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-xl"
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{
                                            scale: 0.8,
                                            opacity: 0,
                                            x: -20,
                                        }}
                                        animate={{ scale: 1, opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.3,
                                            type: "spring",
                                            stiffness: 100,
                                        }}
                                        className="relative bg-white p-5 md:p-6 rounded-2xl rounded-bl-none shadow-lg border border-gray-200 flex-1"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Trophy className="w-5 h-5 text-yellow-500" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                                Simulation Complete!
                                            </span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            {score >= 740
                                                ? "Excellent work! You've mastered credit fundamentals and made smart financial decisions throughout."
                                                : score >= 670
                                                ? "Good job! You made mostly smart choices. Review the scenarios where you lost points to improve."
                                                : score >= 580
                                                ? "Not bad, but there's room for improvement. Consider replaying to see how different choices affect your score."
                                                : "Credit is tough! Don't worry - replay and learn from each scenario. Knowledge is power!"}
                                        </p>

                                        <div className="absolute bottom-4 -left-3 w-6 h-6 bg-white border-b border-l border-gray-200 transform rotate-45" />
                                    </motion.div>
                                </div>

                                {/* Results Card */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-lg">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                            <Trophy className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                            <p className="text-gray-500 uppercase text-xs font-bold mb-1">
                                                Final Score
                                            </p>
                                            <p
                                                className={`text-2xl font-black ${getScoreColor(
                                                    score
                                                )}`}
                                            >
                                                {score}
                                            </p>
                                            <p
                                                className={`text-xs font-semibold ${getScoreColor(
                                                    score
                                                )}`}
                                            >
                                                {getScoreLabel(score)}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                            <CreditCard className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                            <p className="text-gray-500 uppercase text-xs font-bold mb-1">
                                                Total Debt
                                            </p>
                                            <p
                                                className={`text-2xl font-black ${
                                                    debt > 5000
                                                        ? "text-red-600"
                                                        : debt > 1000
                                                        ? "text-yellow-600"
                                                        : "text-green-600"
                                                }`}
                                            >
                                                ${debt.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                            <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                            <p className="text-gray-500 uppercase text-xs font-bold mb-1">
                                                History
                                            </p>
                                            <p
                                                className={`text-2xl font-black ${
                                                    paymentHistory >= 60
                                                        ? "text-green-600"
                                                        : "text-yellow-600"
                                                }`}
                                            >
                                                {paymentHistory}%
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                            <Percent className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                            <p className="text-gray-500 uppercase text-xs font-bold mb-1">
                                                Utilization
                                            </p>
                                            <p
                                                className={`text-2xl font-black ${getUtilizationColor(
                                                    utilization
                                                )}`}
                                            >
                                                {utilization}%
                                            </p>
                                        </div>
                                    </div>

                                    {badges.length > 0 && (
                                        <div className="bg-yellow-50 rounded-xl p-4 mb-6">
                                            <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2 text-sm">
                                                <Award className="w-4 h-4" />{" "}
                                                Badges Earned ({badges.length})
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {badges.map((badge, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1 px-2 py-1 bg-white text-yellow-700 rounded-full text-xs font-bold shadow-sm"
                                                    >
                                                        <Star className="w-3 h-3" />{" "}
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={resetGame}
                                        className="w-full px-6 py-4 bg-clarity-red text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        Play Again
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Mobile Sidebar */}
                    <div className="lg:hidden mt-6">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
