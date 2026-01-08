'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lifeEvents } from '@/data/dummyData';
import { Calendar, Trash2, AlertCircle, CheckCircle, ArrowRight, Sparkles, Target } from 'lucide-react';

export default function FutureTimeline({ clarityMode }) {
  const years = [2026, 2027, 2028, 2029, 2030];
  const [plannedEvents, setPlannedEvents] = useState([
    { id: 1, eventId: 'credit-card', year: 2026, month: 'Mar' },
    { id: 2, eventId: 'apartment', year: 2026, month: 'Jun' },
    { id: 3, eventId: 'car-loan', year: 2027, month: 'Sep' },
    { id: 4, eventId: 'house', year: 2029, month: 'Jan' },
  ]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(false);

  const getEventDetails = (eventId) => lifeEvents.find(e => e.id === eventId);

  const addEvent = (eventId, year) => {
    setPlannedEvents([...plannedEvents, { id: Date.now(), eventId, year, month: 'Jan' }]);
    setShowEventPicker(false);
    setSelectedYear(null);
  };

  const removeEvent = (id) => setPlannedEvents(plannedEvents.filter(e => e.id !== id));

  const getProjectedScore = (year) => {
    let scoreChange = 0;
    plannedEvents.filter(e => e.year <= year).forEach(pe => {
      const event = getEventDetails(pe.eventId);
      if (event) scoreChange += event.scoreEffect.longTerm;
    });
    return Math.min(850, Math.max(300, 682 + scoreChange));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-clarity-card rounded-2xl border border-clarity-border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">🗓️ Your Future Timeline</h2>
            <p className="text-gray-400">{clarityMode ? "Drag life events onto the timeline to see exactly what you need to do!" : "Plan major financial milestones and receive a reverse-engineered action roadmap"}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setGeneratedRoadmap(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium flex items-center gap-2 shadow-lg shadow-purple-500/25">
            <Sparkles className="w-5 h-5" />Generate My Roadmap
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-clarity-card rounded-2xl border border-clarity-border p-6 overflow-x-auto">
        <div className="flex items-center gap-4 mb-8 min-w-[800px]">
          {years.map((year, index) => {
            const projectedScore = getProjectedScore(year);
            const yearEvents = plannedEvents.filter(e => e.year === year);
            return (
              <motion.div key={year} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flex-1">
                <div className={`text-center p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedYear === year ? 'border-purple-500 bg-purple-500/10' : 'border-clarity-border hover:border-purple-500/50'}`}
                  onClick={() => { setSelectedYear(year); setShowEventPicker(true); }}>
                  <div className="text-2xl font-bold text-white mb-1">{year}</div>
                  <div className="text-xs text-gray-500 mb-2">{year === 2026 ? 'Current Year' : `+${year - 2026} years`}</div>
                  <div className={`text-lg font-semibold ${projectedScore >= 740 ? 'text-green-400' : projectedScore >= 700 ? 'text-blue-400' : 'text-yellow-400'}`}>{projectedScore}</div>
                  <div className="text-xs text-gray-500">projected</div>
                  {yearEvents.length > 0 && <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-full"><span className="text-xs text-purple-300">{yearEvents.length} event{yearEvents.length > 1 ? 's' : ''}</span></div>}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="relative min-w-[800px]">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-cyan-500/50 rounded-full transform -translate-y-1/2" />
          <div className="flex justify-between relative">
            {years.map((year, index) => (
              <div key={year} className="flex flex-col items-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + index * 0.1 }}
                  className={`w-4 h-4 rounded-full border-2 ${year === 2026 ? 'bg-purple-500 border-purple-300' : 'bg-clarity-card border-gray-600'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-3 min-w-[800px]">
          <h4 className="text-sm font-medium text-gray-400 mb-4">Planned Events</h4>
          <AnimatePresence>
            {plannedEvents.map((pe, index) => {
              const event = getEventDetails(pe.eventId);
              if (!event) return null;
              return (
                <motion.div key={pe.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 bg-clarity-dark rounded-xl p-4 group">
                  <div className="text-3xl">{event.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{event.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{pe.month} {pe.year}</span>
                    </div>
                    <p className="text-sm text-gray-500">{event.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm"><span className="text-red-400">{event.scoreEffect.initial}</span><ArrowRight className="w-3 h-3 inline mx-1 text-gray-600" /><span className="text-green-400">+{event.scoreEffect.longTerm}</span></div>
                    <p className="text-xs text-gray-500">score impact</p>
                  </div>
                  <button onClick={() => removeEvent(pe.id)} className="p-2 rounded-lg hover:bg-clarity-card text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {showEventPicker && selectedYear && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowEventPicker(false); setSelectedYear(null); }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-clarity-card rounded-2xl border border-clarity-border p-6 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div><h3 className="text-xl font-bold text-white">Add Event to {selectedYear}</h3><p className="text-sm text-gray-400">Choose a life event to plan for</p></div>
                <button onClick={() => { setShowEventPicker(false); setSelectedYear(null); }} className="p-2 rounded-lg hover:bg-clarity-dark text-gray-400">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {lifeEvents.map((event) => (
                  <motion.button key={event.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => addEvent(event.id, selectedYear)}
                    className="bg-clarity-dark rounded-xl p-4 text-left hover:border-purple-500/50 border border-transparent transition-all">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{event.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{event.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{event.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-red-400">{event.scoreEffect.initial} initial</span>
                          <span className="text-gray-600">→</span>
                          <span className="text-green-400">+{event.scoreEffect.longTerm} long-term</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {generatedRoadmap && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/30 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center"><Target className="w-6 h-6 text-purple-400" /></div>
              <div><h3 className="text-xl font-bold text-white">Your Personalized Roadmap</h3><p className="text-sm text-gray-400">{clarityMode ? "Here's exactly what you need to do, step by step!" : "Reverse-engineered action plan based on your timeline goals"}</p></div>
            </div>
            <div className="space-y-4">
              {[
                { time: "Now - March 2026", action: "Pay down credit card balance to under 30%", why: clarityMode ? "This is the fastest way to boost your score!" : "Reduces utilization ratio, expected +25 point impact", priority: "high" },
                { time: "March 2026", action: "Open a new secured credit card", why: clarityMode ? "This adds to your 'credit mix'" : "Increases available credit and diversifies credit mix", priority: "medium" },
                { time: "April - May 2026", action: "Set up autopay on all accounts", why: clarityMode ? "Never miss a payment again!" : "Protects 35% of score calculation", priority: "high" },
                { time: "June 2026", action: "Apply for apartment - you should hit 700!", why: clarityMode ? "With 700+, you'll get approved easier" : "700+ score significantly improves rental success rate", priority: "milestone" },
                { time: "2027 - No new credit", action: "Let your accounts age", why: clarityMode ? "Banks trust older accounts more!" : "12-month inquiry-free period before auto loan", priority: "warning" },
                { time: "September 2027", action: "Apply for auto loan with 720+ score", why: clarityMode ? "At 720+, you'll get the best rates!" : "720+ qualifies for tier-1 rates, saving $2,000-5,000", priority: "milestone" },
              ].map((step, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                  className={`flex items-start gap-4 p-4 rounded-xl ${step.priority === 'high' ? 'bg-red-500/10 border border-red-500/20' : step.priority === 'milestone' ? 'bg-green-500/10 border border-green-500/20' : step.priority === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-clarity-card border border-clarity-border'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.priority === 'high' ? 'bg-red-500/20 text-red-400' : step.priority === 'milestone' ? 'bg-green-500/20 text-green-400' : step.priority === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {step.priority === 'milestone' ? <CheckCircle className="w-4 h-4" /> : step.priority === 'warning' ? <AlertCircle className="w-4 h-4" /> : <span className="text-sm font-bold">{index + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{step.time}</span>
                    <h4 className="font-medium text-white mt-1 mb-1">{step.action}</h4>
                    <p className="text-sm text-gray-400">{step.why}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-clarity-dark rounded-xl">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-400">Following this roadmap, your projected score by 2029:</p><p className="text-3xl font-bold text-green-400">752</p></div>
                <div className="text-right"><p className="text-sm text-gray-400">Potential savings on home mortgage:</p><p className="text-2xl font-bold text-purple-400">$47,000+</p><p className="text-xs text-gray-500">over 30-year term</p></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
