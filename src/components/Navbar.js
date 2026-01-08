"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, User } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const isDashboard = pathname === "/";
    const isScenario = pathname === "/scenario";
    const isLearn = pathname === "/learn";

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/mascot.png" alt="Clarity Capital Mascot" className="w-10 h-10 object-contain" />
                        <div className="flex items-center">
                            <span className="text-2xl font-black text-clarity-blue tracking-tight">Clarity</span>
                            <span className="text-2xl font-black text-clarity-red tracking-tight">Capital</span>
                        </div>
                    </Link>
                    <div className="hidden md:flex items-center gap-1">
                        <Link 
                            href="/"
                            className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                                isDashboard 
                                    ? 'bg-clarity-blue text-white' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-clarity-blue'
                            }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/scenario"
                            className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                                isScenario 
                                    ? 'bg-clarity-blue text-white' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-clarity-blue'
                            }`}
                        >
                            Scenario Game
                        </Link>
                        <Link
                            href="/learn"
                            className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                                isLearn 
                                    ? 'bg-clarity-blue text-white' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-clarity-blue'
                            }`}
                        >
                            Learn
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-clarity-red rounded-full" />
                        </button>
                        <button className="flex items-center gap-2 p-2 pr-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-clarity-blue to-blue-400 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                Jordan
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
