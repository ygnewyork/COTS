'use client';

import { motion } from 'framer-motion';
import { Menu, Bell, User, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* CapOne Style Logo */}
            <div className="relative">
                 <h1 className="text-2xl font-black italic tracking-tighter text-clarity-blue">Clarity Capital</h1>
                 <span className="absolute -top-1 -right-3 w-4 h-4 bg-clarity-red rounded-full shadow-sm" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-clarity-blue font-bold border-b-2 border-clarity-blue">Dashboard</a>
            <a href="#" className="text-gray-500 hover:text-clarity-blue transition-colors font-medium">Cards</a>
            <a href="#" className="text-gray-500 hover:text-clarity-blue transition-colors font-medium">Checking</a>
             <a href="#" className="text-gray-500 hover:text-clarity-blue transition-colors font-medium">Savings</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-clarity-blue hover:bg-blue-50 transition-colors">
              <User className="w-4 h-4 text-clarity-blue" />
              <span className="text-sm font-bold text-clarity-blue hidden sm:block">Sign In</span>
            </button>
             <button className="p-2">
                <Menu className="w-6 h-6 text-clarity-blue md:hidden" />
             </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
