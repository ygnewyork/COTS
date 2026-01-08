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
            "Congratulations! You just got approved for your first credit card with a $1,000 limit. Your first statement represents a balance of $200. It is due in 3 days. What do you do?",
        choices: [
            {
                text: "Pay the full $200 balance",
                scoreImpact: +15,
                debtImpact: 0,
                historyImpact: +10,
                utilizationImpact: -20,
                badge: "On-Time Payer",
                feedback:
                    "Perfect! Paying in full avoids all interest charges AND builds excellent payment history. This is the golden rule of credit.",
                explanation:
                    "Payment history makes up 35% of your FICO score. By paying the full statement balance, you avoid interest (APR) while proving to lenders you are a low-risk borrower.",
            },
            {
                text: "Pay only the minimum ($25)",
                scoreImpact: -5,
                debtImpact: +175,
                historyImpact: +5,
                utilizationImpact: +5,
                feedback:
                    "You avoided a late fee, but you fell into the interest trap. You now owe $175, and interest will start compounding daily.",
                explanation:
                    "Paying the minimum keeps your account 'current' (so no late marks), but you lose your 'grace period.' You will now be charged interest (usually 20-29%) on every single purchase you make moving forward.",
            },
            {
                text: "Miss the payment entirely",
                scoreImpact: -50,
                debtImpact: +235,
                historyImpact: -30,
                utilizationImpact: +10,
                feedback:
                    "Disaster! You were hit with a $35 late fee. If the payment remains unpaid for 30 days, it marks your credit report for 7 years.",
                explanation:
                    "A single payment missed by 30+ days can drop a good credit score by over 100 points immediately. It is the single most damaging common mistake you can make.",
            },
        ],
    },
    {
        id: 2,
        title: "The Shopping Spree",
        description:
            "Black Friday deals are amazing! You could buy $800 worth of electronics on your card (Limit: $1,000). Your current balance is $100.",
        choices: [
            {
                text: "Max it out! ($800 purchase)",
                scoreImpact: -30,
                debtImpact: +800,
                historyImpact: 0,
                utilizationImpact: +80,
                feedback:
                    "Your utilization just hit 90%! Even if you pay it off later, your score will tank temporarily when the statement closes.",
                explanation:
                    "Credit Utilization (amount used / total limit) is 30% of your score. Using >30% scares lenders. Using >90% is seen as a desperate financial risk.",
            },
            {
                text: "Buy $200 worth (Total utilization: 30%)",
                scoreImpact: +10,
                debtImpact: +200,
                historyImpact: 0,
                utilizationImpact: +10,
                badge: "Smart Spender",
                feedback:
                    "Smart! You took advantage of the sale but kept your total balance at $300 (30% of your limit).",
                explanation:
                    "The 30% rule is a good guideline. However, the 'High Achievers' (scores of 800+) typically keep utilization below 7%.",
            },
            {
                text: "Skip the sales, pay off the $100",
                scoreImpact: +5,
                debtImpact: -100,
                historyImpact: 0,
                utilizationImpact: -10,
                feedback:
                    "Disciplined! You prioritized debt payoff over consumerism. Your utilization drops to 0%.",
                explanation:
                    "0% utilization is safe, though having a tiny balance (like $5) reported on the statement date can sometimes result in a slightly higher score than $0, as it shows active usage.",
            },
        ],
    },
    {
        id: 3,
        title: "Credit Limit Increase Offer",
        description:
            "Your bank offers to raise your credit limit from $1,000 to $3,000. They confirm this will require NO hard inquiry.",
        choices: [
            {
                text: "Accept the increase!",
                scoreImpact: +25,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: -15,
                badge: "Limit Builder",
                feedback:
                    "Excellent move! Your utilization ratio just dropped by 66% without you paying a dime. This is a free score boost.",
                explanation:
                    "Utilization is calculated as (Balance / Total Limit). By increasing the denominator (Limit), your percentage drops, which boosts your score. Always accept soft-pull increases.",
            },
            {
                text: "Decline - I might overspend",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "A safe choice if you struggle with impulse control, but you missed out on optimizing your score.",
                explanation:
                    "Financial psychology is real. If a higher limit tempts you to spend more, declining is the right personal choice, even if it's the 'wrong' math choice.",
            },
        ],
    },
    {
        id: 4,
        title: "The Emergency Car Repair",
        description:
            "Your car breaks down. Repair cost: $600. You have $200 in your checking account. How do you handle this?",
        choices: [
            {
                text: "Put it all on the credit card",
                scoreImpact: -10,
                debtImpact: +600,
                historyImpact: 0,
                utilizationImpact: +40,
                feedback:
                    "You fixed the car, but you're now carrying high-interest debt. This emergency will cost you more than $600 due to interest.",
                explanation:
                    "This is why an 'Emergency Fund' is vital. Without cash reserves, emergencies become debt traps. Create a plan to pay this off within 2 months.",
            },
            {
                text: "Use cash + negotiate payment plan",
                scoreImpact: +5,
                debtImpact: +400,
                historyImpact: +5,
                utilizationImpact: 0,
                badge: "Problem Solver",
                feedback:
                    "Great negotiation! You used your cash ($200) and the mechanic agreed to a payment plan for the rest. No credit card interest!",
                explanation:
                    "Many service providers (mechanics, dentists, vets) offer interest-free payment plans if you ask. This protects your credit utilization and saves you money.",
            },
            {
                text: "Ignore it, take the bus",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "You avoided debt, but if reliable transport is needed for your job, you're risking your income.",
                explanation:
                    "Financial health isn't just about credit scores; it's about income stability. Sometimes taking on strategic debt is necessary to maintain employment.",
            },
        ],
    },
    {
        id: 5,
        title: "The Second Card Decision",
        description:
            "You've had your first card for a year. A new card offers 2% cashback and a $200 sign-up bonus. Should you apply?",
        choices: [
            {
                text: "Apply for it!",
                scoreImpact: -5,
                debtImpact: 0,
                historyImpact: -5,
                utilizationImpact: -10,
                feedback:
                    "Short-term dip, long-term gain! The hard inquiry drops you ~5 points, but more available credit helps you later. Plus, free $200!",
                explanation:
                    "Hard inquiries stay on your report for 2 years but only impact your score for 1 year. The benefits of a better rewards structure usually outweigh the temporary dip.",
            },
            {
                text: "Wait another year",
                scoreImpact: +5,
                debtImpact: 0,
                historyImpact: +5,
                utilizationImpact: 0,
                feedback:
                    "Conservative. Your 'Average Age of Accounts' continues to grow, which strengthens your profile.",
                explanation:
                    "Length of credit history is 15% of your score. Opening new accounts lowers your 'Average Age.' If you plan to buy a house soon, waiting is better.",
            },
            {
                text: "Apply for 3 cards at once!",
                scoreImpact: -40,
                debtImpact: 0,
                historyImpact: -15,
                utilizationImpact: -5,
                feedback:
                    "Denied! Lenders saw 'velocity of credit' (seeking too much credit too fast). You look risky and desperate.",
                explanation:
                    "Applying for multiple cards in a short window is a major red flag. Rule of thumb: Wait at least 6 months between credit card applications.",
            },
        ],
    },
    {
        id: 6,
        title: "The Forgotten Subscription",
        description:
            "You review your statement and realize you've been paying $15/month for a streaming service you haven't watched in 6 months.",
        choices: [
            {
                text: "Cancel immediately",
                scoreImpact: 0,
                debtImpact: -15,
                historyImpact: 0,
                utilizationImpact: 0,
                badge: "Budget Boss",
                feedback:
                    "Good catch! That's $90 wasted, but you stopped the bleeding. Always audit your statements.",
                explanation:
                    "Recurring subscriptions are the 'silent killers' of budgets. Companies bank on you forgetting to cancel. Review your credit card statement line-by-line every month.",
            },
            {
                text: "Keep it, I might watch a show later",
                scoreImpact: 0,
                debtImpact: +15,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "That's $180/year for 'might.' Wealth is built by plugging small leaks in your bucket.",
                explanation:
                    "The Opportunity Cost principle: That $15/month invested in the S&P 500 for 10 years would be worth over $2,500. Don't pay for what you don't use.",
            },
        ],
    },
    {
        id: 7,
        title: "The Credit Report Check",
        description:
            "You pull your free annual credit report and find a $500 collection account from a utility company... but you never lived in that city!",
        choices: [
            {
                text: "Dispute it with the credit bureaus",
                scoreImpact: +50,
                debtImpact: 0,
                historyImpact: +15,
                utilizationImpact: 0,
                badge: "Credit Defender",
                feedback:
                    "You filed a dispute online. The bureau investigated, found no proof it was yours, and DELETED it. Your score soars!",
                explanation:
                    "Under the Fair Credit Reporting Act, bureaus must remove unverifiable information. Never pay a debt that isn't yours—dispute it first.",
            },
            {
                text: "Just pay it to resolve it",
                scoreImpact: +5,
                debtImpact: +500,
                historyImpact: +5,
                utilizationImpact: 0,
                feedback:
                    "You wasted $500. Worse, the 'Paid Collection' stays on your report for 7 years, still hurting your score.",
                explanation:
                    "Paying a collection does NOT remove it from your report (unless you negotiate a 'Pay for Delete'). It simply updates the status to 'Paid,' which lenders still view negatively.",
            },
            {
                text: "Ignore it",
                scoreImpact: -20,
                debtImpact: 0,
                historyImpact: -10,
                utilizationImpact: 0,
                feedback:
                    "The collection sits there, dragging your score down. It might also be a sign of identity theft.",
                explanation:
                    "Ignoring errors makes them look valid. If this was identity theft, the thief could be opening other accounts in your name right now.",
            },
        ],
    },
    {
        id: 8,
        title: "The Balance Transfer Strategy",
        description:
            "You have $2,000 debt at 24% APR on Card A. Card B offers 0% APR for 18 months on transfers, with a 3% transfer fee.",
        choices: [
            {
                text: "Transfer the balance to Card B",
                scoreImpact: -5,
                debtImpact: +60,
                historyImpact: 0,
                utilizationImpact: 0,
                badge: "Debt Strategist",
                feedback:
                    "Smart move. You pay a one-time $60 fee, but you stop the $40/month interest charges immediately.",
                explanation:
                    "This is a mathematical win. However, you MUST pay off the debt within the 18 months. If you don't, you might get hit with retroactive interest.",
            },
            {
                text: "Keep paying Card A",
                scoreImpact: 0,
                debtImpact: +40,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "You are losing money. At 24% APR, barely any of your monthly payment is going toward the principal.",
                explanation:
                    "High-interest debt destroys wealth. If you can qualify for a 0% transfer or a lower-interest consolidation loan, almost always take it.",
            },
        ],
    },
    {
        id: 9,
        title: "The Co-Signer Request",
        description:
            "Your sibling with bad credit asks you to co-sign their $15,000 car loan. They promise to make all the payments.",
        choices: [
            {
                text: "Sign the papers, family first!",
                scoreImpact: -20,
                debtImpact: +15000,
                historyImpact: -10,
                utilizationImpact: 0,
                feedback:
                    "DANGER! The loan now appears on YOUR report. Your debt-to-income ratio skyrocketed, making it hard for YOU to get loans.",
                explanation:
                    "Co-signing makes you 100% legally liable. If they miss a payment, the bank sues YOU, not them. It effectively freezes your ability to get credit until the car is paid off.",
            },
            {
                text: "Refuse, but offer advice",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                badge: "Wise Helper",
                feedback:
                    "It was an awkward conversation, but you protected your financial future. You suggested they look into a 'Secured Card' instead.",
                explanation:
                    "Never co-sign unless you are willing and able to pay off the entire loan yourself immediately. It is the leading cause of family financial disputes.",
            },
        ],
    },
    {
        id: 10,
        title: "The Old Card Dilemma",
        description:
            "Your first credit card (5 years old) has no rewards and you never use it. It has $0 annual fee. What do you do?",
        choices: [
            {
                text: "Close the account",
                scoreImpact: -25,
                debtImpact: 0,
                historyImpact: -20,
                utilizationImpact: +15,
                feedback:
                    "Ouch! You just shortened your credit history and lowered your total available credit limit.",
                explanation:
                    "Don't close your oldest accounts! 'Age of Credit' helps your score. If there is no annual fee, keep it open forever.",
            },
            {
                text: "Put a small subscription on it (autopay)",
                scoreImpact: +10,
                debtImpact: 0,
                historyImpact: +10,
                utilizationImpact: 0,
                badge: "History Keeper",
                feedback:
                    "Perfect strategy. You put Netflix on it and set up autopay. The card stays 'active' and your history grows.",
                explanation:
                    "Banks will close accounts that are inactive for 6-12 months. A small recurring charge keeps the data flowing to the credit bureaus.",
            },
        ],
    },
    {
        id: 11,
        title: "The Rent Reporting Opportunity",
        description:
            "A service offers to report your on-time rent payments to credit bureaus for $5/month. You have a 'thin' credit file (not much history).",
        choices: [
            {
                text: "Sign up immediately!",
                scoreImpact: +30,
                debtImpact: +5,
                historyImpact: +20,
                utilizationImpact: 0,
                badge: "Rent Reporter",
                feedback:
                    "Great for beginners! This adds a new 'tradeline' to your report showing consistent on-time payments.",
                explanation:
                    "Rent is usually not reported. For students or young adults, paying for a reporting service can fast-track your score into the 700s.",
            },
            {
                text: "Pass - I have 5 credit cards already",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "Correct. If you already have established credit, rent reporting has diminishing returns.",
                explanation:
                    "Rent reporting is a 'credit builder' tool. Once you have a mortgage or auto loan, rent reporting becomes unnecessary noise.",
            },
        ],
    },
    {
        id: 12,
        title: "The Big Purchase Decision",
        description:
            "You're buying a $1,200 laptop. Options: Cash, Credit Card (3% rewards), or Store Financing (0% for 12 months).",
        choices: [
            {
                text: "Credit card + Pay in Full",
                scoreImpact: +5,
                debtImpact: 0,
                historyImpact: +5,
                utilizationImpact: +5,
                badge: "Rewards Maximizer",
                feedback:
                    "Optimal play! You earned $36 in cashback, got extended warranty protection, and paid $0 interest.",
                explanation:
                    "Credit cards offer purchase protections (warranty extension, theft protection) that cash and debit cards do not. As long as you pay in full, it's the best method.",
            },
            {
                text: "Store 0% financing",
                scoreImpact: -10,
                debtImpact: +1200,
                historyImpact: -5,
                utilizationImpact: 0,
                feedback:
                    "Risky. If you have $1 left on the balance after 12 months, you will owe back-interest on the WHOLE $1,200.",
                explanation:
                    "This is called 'Deferred Interest.' It is a trap. If you miss the deadline by one day, you are charged ~29% interest dating back to day one.",
            },
            {
                text: "Pay with Debit Card",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "Safe, but you missed out. No rewards, and debit cards have weaker fraud protection if the number is stolen.",
                explanation:
                    "If a hacker drains your debit card, actual cash is gone from your checking account. If they use your credit card, it's the bank's money, not yours.",
            },
        ],
    },
    {
        id: 13,
        title: "Buy Now, Pay Later (BNPL)",
        description:
            "You are buying $200 sneakers. The checkout offers '4 interest-free payments of $50' via an app like Klarna or Afterpay.",
        choices: [
            {
                text: "Use BNPL",
                scoreImpact: 0,
                debtImpact: +200,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "It feels easy, but be careful. Most BNPL loans do NOT help your credit score, but they CAN hurt it if you miss a payment.",
                explanation:
                    "BNPL is a 'phantom debt.' Lenders often don't see it, so it doesn't build credit history. However, if you default, they send it to collections, which ruins your score.",
            },
            {
                text: "Put it on Credit Card (Pay in full)",
                scoreImpact: +5,
                debtImpact: 0,
                historyImpact: +5,
                utilizationImpact: +5,
                badge: "Credit Builder",
                feedback:
                    "Better choice. You get credit card rewards and the payment history actually counts toward your score.",
                explanation:
                    "If you can afford the item, using a standard credit card builds your score. BNPL is often a psychological trick to make you spend money you don't have.",
            },
        ],
    },
    {
        id: 14,
        title: "The Suspicious Text",
        description:
            "You get a text: 'URGENT: Your bank account is frozen due to fraud. Click here to verify identity.'",
        choices: [
            {
                text: "Click the link and log in",
                scoreImpact: -100,
                debtImpact: +5000,
                historyImpact: -50,
                utilizationImpact: +100,
                feedback:
                    "You were Phished! The site was fake. Hackers now have your login and drained your account.",
                explanation:
                    "Banks never send links asking you to log in via text. This is 'Smishing' (SMS Phishing). The urgency is a manipulation tactic.",
            },
            {
                text: "Call the number on the back of your card",
                scoreImpact: 0,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                badge: "Security Expert",
                feedback:
                    "Correct. You verified with the bank directly. The text was a scam, and your account is safe.",
                explanation:
                    "Always use a trusted source (the number on your physical card) to contact your bank. Never trust inbound texts or calls.",
            },
        ],
    },
    {
        id: 15,
        title: "The Annual Fee Card",
        description:
            "You are looking at a premium travel card. It has a $95 annual fee, but offers better points on dining and travel.",
        choices: [
            {
                text: "Get the card",
                scoreImpact: -5,
                debtImpact: -95,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "It depends! Do you spend enough to offset the fee? If you earn $150 in rewards, you're ahead by $55.",
                explanation:
                    "Annual fee cards are only worth it if the 'Effective Value' (Rewards - Fee) is higher than a free card. You need to do the math on your yearly spending.",
            },
            {
                text: "Stick to no-fee cards",
                scoreImpact: -5,
                debtImpact: 0,
                historyImpact: 0,
                utilizationImpact: 0,
                feedback:
                    "Safe bet. There are plenty of great cards with $0 annual fees that earn 2% cash back.",
                explanation:
                    "For most casual spenders, no-fee cards are the best option. You don't have to worry about 'breaking even' on the card cost.",
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
