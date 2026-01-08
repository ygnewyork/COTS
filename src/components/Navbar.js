"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, User, Edit2, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const { user, updateUser, switchProfile, availableProfiles } = useUser();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Form state for modal
    const [formName, setFormName] = useState(user.name);
    const [formScore, setFormScore] = useState(user.creditScore);

    const handleSaveProfile = () => {
        updateUser({ name: formName, creditScore: parseInt(formScore) });
        setShowProfileModal(false);
    };

    const isDashboard = pathname === "/";
    const isScenario = pathname === "/scenario";
    const isLearn = pathname === "/learn";

    return (
        <>
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
                    <div className="flex items-center gap-4 relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Bell className="w-5 h-5 text-gray-500" />
                            {/* Simple persistent notification dot for demo */}
                            <span className="absolute top-1 right-1 w-2 h-2 bg-clarity-red rounded-full" />
                        </button>
                        
                        {/* Notifications Dropdown */}
                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[60]"
                                >
                                    <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                        <h4 className="font-semibold text-sm text-gray-900">Notifications</h4>
                                        <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        <div className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="flex gap-3">
                                                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">New Score Update</p>
                                                    <p className="text-xs text-gray-500 mt-1">Your credit score updated to {user.creditScore}. Good work!</p>
                                                    <p className="text-[10px] text-gray-400 mt-2">2 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="flex gap-3">
                                                <div className="w-2 h-2 mt-2 bg-green-500 rounded-full flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">Goal Achieved! 🎯</p>
                                                    <p className="text-xs text-gray-500 mt-1">You maintained &lt;30% utilization for 3 months straight.</p>
                                                    <p className="text-[10px] text-gray-400 mt-2">1 day ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="flex gap-3">
                                                <div className="w-2 h-2 mt-2 bg-purple-500 rounded-full flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">New Learning Module</p>
                                                    <p className="text-xs text-gray-500 mt-1">"Mastering Mortgage Rates" is now available in Learn.</p>
                                                    <p className="text-[10px] text-gray-400 mt-2">3 days ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                                        <button className="text-xs font-medium text-clarity-blue hover:text-blue-700">Mark all as read</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            onClick={() => {
                                setFormName(user.name);
                                setFormScore(user.creditScore);
                                setShowProfileModal(true);
                            }}
                            className="flex items-center gap-2 p-2 pr-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-clarity-blue to-blue-400 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                {user.name}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-white rounded border border-gray-200 font-mono text-gray-500">{user.creditScore}</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.nav>

        <AnimatePresence>
            {showProfileModal && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center backdrop-blur-sm p-4"
                    onClick={() => setShowProfileModal(false)}
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }} 
                        animate={{ scale: 1, y: 0 }} 
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 bg-gradient-to-r from-clarity-blue to-blue-600 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Edit Profile</h3>
                                <p className="text-blue-100 text-sm">Personalize your Clarity experience</p>
                            </div>
                            <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Switch Persona</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {availableProfiles && Object.keys(availableProfiles).map(key => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                switchProfile(key);
                                                setShowProfileModal(false);
                                            }}
                                            className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                                user.name === availableProfiles[key].name 
                                                    ? 'bg-clarity-blue text-white border-clarity-blue' 
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-clarity-blue hover:text-clarity-blue'
                                            }`}
                                        >
                                            {availableProfiles[key].name} ({availableProfiles[key].creditScore})
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR CUSTOMIZE</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input 
                                    type="text" 
                                    value={formName} 
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clarity-blue focus:border-clarity-blue outline-none"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Credit Score (Simulation)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={formScore} 
                                        onChange={(e) => setFormScore(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 bg-blue-50 rounded-lg focus:ring-2 focus:ring-clarity-blue focus:border-clarity-blue outline-none font-mono font-bold text-clarity-blue"
                                        placeholder="680"
                                        min="300"
                                        max="850"
                                    />
                                    <div className="absolute right-3 top-2.5 text-xs text-blue-400">300-850</div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Changing this will update the timeline readiness checks instantly.</p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    onClick={() => setShowProfileModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveProfile}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-clarity-blue text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                                >
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
