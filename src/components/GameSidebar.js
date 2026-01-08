"use client";

import { motion } from "framer-motion";
import { getNested } from "@/utils/gameUtils";
import {
    Trophy,
    CreditCard,
    Activity,
    AlertCircle,
    Clock,
    Calendar,
    Wallet,
    Percent,
} from "lucide-react";

const icons = {
    score: Trophy,
    "cc.balance": CreditCard,
    "cc.limit": Activity,
    utilizationPct: Percent,
    "stats.onTimeStreak": Calendar,
    "stats.latePayments": AlertCircle,
    "stats.hardInquiries12m": Activity,
    "stats.avgAccountAgeMonths": Clock,
    "installmentLoan.balance": Wallet,
    cash: Wallet,
};

const formatValue = (key, value) => {
    if (
        key.toLowerCase().includes("balance") ||
        key.toLowerCase().includes("limit") ||
        key.toLowerCase().includes("cash")
    ) {
        return `$${Math.round(value).toLocaleString()}`;
    }
    if (key.includes("Pct")) {
        return `${Math.round(value)}%`;
    }
    return value;
};

const getLabel = (key) => {
    const map = {
        score: "Credit Score",
        "cc.balance": "CC Balance",
        "cc.limit": "Credit Limit",
        utilizationPct: "Utilization",
        "stats.onTimeStreak": "On-Time Streak",
        "stats.latePayments": "Late Payments",
        "stats.hardInquiries12m": "Hard Inquiries",
        "stats.avgAccountAgeMonths": "Avg Age (Mos)",
        "installmentLoan.balance": "Loan Balance",
        cash: "Cash",
    };
    return map[key] || key;
};

export default function GameSidebar({ state, config = [] }) {
    // Always include cash at the top if not explicitly in the list?
    // The JSON example doesn't list 'cash' in ui.sidebar but it's crucial.
    // user request was strict on "using exmpale.json as instructions"
    // so we will strictly follow config but maybe add a helper "Cash" if missing,
    // or just follow the request. Let's add Cash as a sticky header metric if possible,
    // OR just append it if not present. For now, strictly follow array.

    return (
        <aside className="w-full md:w-64 bg-clarity-card border-r border-clarity-border/50 p-6 flex flex-col gap-4 overflow-y-auto h-full">
            <div className="mb-4">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    My Finances
                </h2>
                <div className="bg-clarity-dark p-4 rounded-xl border border-clarity-border">
                    <div className="flex items-center gap-3 mb-1">
                        <Wallet className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300 font-medium">Cash</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        ${state.cash.toLocaleString()}
                    </p>
                </div>
            </div>

            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Credit Profile
            </h2>
            <div className="flex flex-col gap-3">
                {config.map((key) => {
                    const value = getNested(state, key);
                    const Icon = icons[key] || Activity;
                    const label = getLabel(key);
                    const formatted = formatValue(key, value);

                    return (
                        <motion.div
                            key={key}
                            layout
                            className="p-3 rounded-xl bg-clarity-dark/50 border border-clarity-border hover:border-clarity-blue/30 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-clarity-card">
                                    <Icon className="w-4 h-4 text-clarity-blue" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">
                                        {label}
                                    </p>
                                    <p className="text-lg font-bold text-white leading-none mt-1">
                                        {formatted}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </aside>
    );
}
