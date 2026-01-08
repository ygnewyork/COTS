'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ScoreOverview from '@/components/ScoreOverview';
import CreditFactorGraph from '@/components/CreditFactorGraph';
import FutureTimeline from '@/components/FutureTimeline';
import SimulatorPanel from '@/components/SimulatorPanel';
import FactorCards from '@/components/FactorCards';
import { userProfile } from '@/data/dummyData';

export default function Home() {
  // Always use clarity mode (easy to understand) - no toggle needed
  const clarityMode = true;
  const [activeTab, setActiveTab] = useState('sandbox');

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <section className="pt-28 pb-8 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-black mb-4 text-clarity-blue tracking-tight">
                Welcome back, {userProfile.name}
              </h1>
              <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">
                Banking reimagined for clarity.
              </p>
            </motion.div>

            <div className="flex justify-center flex-wrap gap-2 mb-8">
              {['sandbox', 'timeline', 'simulator'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-clarity-blue text-white shadow-lg shadow-blue-900/10'
                      : 'bg-white border border-gray-200 text-gray-500 hover:text-clarity-blue hover:border-clarity-blue'
                  }`}
                >
                  {tab === 'sandbox' && 'Overview'}
                  {tab === 'timeline' && 'Timeline'}
                  {tab === 'simulator' && 'Simulator'}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'sandbox' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <div className="lg:col-span-1">
                  <ScoreOverview clarityMode={clarityMode} />
                </div>
                <div className="lg:col-span-2">
                  <CreditFactorGraph clarityMode={clarityMode} />
                </div>
                <div className="lg:col-span-3">
                  <FactorCards clarityMode={clarityMode} />
                </div>
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <FutureTimeline clarityMode={clarityMode} />
              </motion.div>
            )}

            {activeTab === 'simulator' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <SimulatorPanel clarityMode={clarityMode} />
              </motion.div>
            )}
          </div>
        </section>

        <footer className="border-t border-gray-200 py-8 px-6 bg-white">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            <p>ClarityCapital • Teaching you the game, not just the score</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
