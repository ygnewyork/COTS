'use client';

import { motion } from 'framer-motion';
import { Menu, Bell, User, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-clarity-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Clarity<span className="text-purple-400">Capital</span></h1>
              <p className="text-xs text-gray-500">Credit Sandbox</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white font-medium">Dashboard</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Learn</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Goals</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-clarity-card transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
            </button>
            <button className="flex items-center gap-2 p-2 pr-4 rounded-xl bg-clarity-card hover:bg-clarity-border transition-colors">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white hidden sm:block">Jordan</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
