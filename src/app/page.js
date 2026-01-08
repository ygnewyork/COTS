'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ScoreOverview from '@/components/ScoreOverview';
import CreditFactorGraph from '@/components/CreditFactorGraph';
import FutureTimeline from '@/components/FutureTimeline';
import SimulatorPanel from '@/components/SimulatorPanel';
import ClarityModeToggle from '@/components/ClarityModeToggle';
import FactorCards from '@/components/FactorCards';
import LearnCenter from '@/components/LearnCenter';
import CreditGame from '@/components/CreditGame';
import { userProfile } from '@/data/dummyData';

export default function Home() {
  const [clarityMode, setClarityMode] = useState(false);
  const [activeTab, setActiveTab] = useState('sandbox');

  return (
    <main className="min-h-screen bg-clarity-dark animated-bg">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <section className="pt-24 pb-8 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome back, <span className="gradient-text">{userProfile.name}</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Your credit sandbox is ready. Let's turn confusion into confidence.
              </p>
            </motion.div>

            <div className="flex justify-center mb-8">
              <ClarityModeToggle 
                enabled={clarityMode} 
                onToggle={() => setClarityMode(!clarityMode)} 
              />
            </div>

            <div className="flex justify-center flex-wrap gap-2 mb-8">
              {['sandbox', 'timeline', 'simulator', 'learn', 'game'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-clarity-red to-clarity-blue text-white shadow-lg shadow-clarity-red/20'
                      : 'bg-clarity-card text-gray-400 hover:text-white hover:bg-clarity-border'
                  }`}
                >
                  {tab === 'sandbox' && '🎮 Sandbox'}
                  {tab === 'timeline' && '📅 Timeline'}
                  {tab === 'simulator' && '🔮 Simulator'}
                  {tab === 'learn' && '📚 Learn'}
                  {tab === 'game' && '🏆 Credit Game'}
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

            {activeTab === 'learn' && <LearnCenter />}
            {activeTab === 'game' && <CreditGame />}
          </div>
        </section>

        <footer className="border-t border-clarity-border py-8 px-6">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            <p>ClarityCapital • Teaching you the game, not just the score</p>
            <p className="mt-2 text-xs">Demo Version • Data is simulated for demonstration</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
