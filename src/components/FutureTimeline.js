'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trash2, AlertCircle, CheckCircle, ArrowRight, Sparkles, Target, User } from 'lucide-react';
import { creditFactors, lifeEvents } from '@/data/dummyData';
import { useUser } from '@/context/UserContext';

const getCategoryColor = (category) => {
  switch (category) {
    case 'credit': return 'text-purple-600 bg-purple-100';
    case 'loan': return 'text-orange-600 bg-orange-100';
    case 'housing': return 'text-green-600 bg-green-100';
    case 'mortgage': return 'text-blue-600 bg-blue-100';
    case 'debt': return 'text-red-600 bg-red-100';
    case 'business': return 'text-indigo-600 bg-indigo-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export default function FutureTimeline({ clarityMode }) {
  const years = [2026, 2027, 2028, 2029, 2030];
  const [plannedEvents, setPlannedEvents] = useState([
    { id: 1, eventId: 'apartment', year: 2026, month: 'Jun' },
    { id: 2, eventId: 'car-loan', year: 2027, month: 'Sep' },
    { id: 3, eventId: 'house', year: 2029, month: 'Jan' },
  ]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(false);

  // --- PERSONALIZATION ENGINE ---
  const { user } = useUser();
  const currentScore = user.creditScore;
  const utilFactor = creditFactors.find(f => f.id === 'utilization');

  const utilization = utilFactor ? parseInt(utilFactor.value) : 0; 

  const getPersonalizedChecklist = (eventId) => {
    switch(eventId) {
      case 'apartment':
        const isUtilReady = utilization < 30;
        return {
          title: "Rent Apartment",
          readiness: isUtilReady && currentScore > 620 ? "Ready" : "Almost Ready",
          readinessColor: isUtilReady && currentScore > 620 ? "text-green-600 bg-green-100" : "text-yellow-600 bg-yellow-100",
          steps: [
            { 
              text: `Keep utilization < 30%`, 
              status: isUtilReady ? "success" : "warning", 
              detail: isUtilReady ? "Great job!" : `Currently ${utilization}% - needs work` 
            },
            { 
              text: "Score > 620", 
              status: currentScore > 620 ? "success" : "error", 
              detail: `You have ${currentScore}` 
            },
            { text: "No missed payments", status: "success", detail: "Perfect history!" }
          ]
        };
      case 'car-loan':
        const isScoreReady = currentScore >= 660;
        return {
          title: "Finance a Car",
          readiness: isScoreReady ? "Ready" : "Not Ready",
          readinessColor: isScoreReady ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100",
          steps: [
            { 
              text: "Score 660+ for best rates", 
              status: isScoreReady ? "success" : "error", 
              detail: isScoreReady ? "You qualify for Tier 1" : `${660 - currentScore} pts to go` 
            },
            { text: "Save down payment (20%)", status: "todo", detail: "Connect savings account" },
            { text: "Shop rates in 14-day window", status: "info", detail: "Protects your score" }
          ]
        };
      case 'house':
        return {
          title: "Buy a House",
          readiness: "Long Term Goal",
          readinessColor: "text-blue-600 bg-blue-100",
          steps: [
            { text: "Score 740+ for best mortgage", status: currentScore >= 740 ? "success" : "warning", detail: `Currently ${currentScore}` },
            { text: "DTI Ratio < 36%", status: "todo", detail: "Needs income verification" },
            { text: "2+ years employment history", status: "success", detail: "Verified" }
          ]
        };
      case 'credit-card':
         return {
          title: "Open First Credit Card",
          readiness: "Ready",
          readinessColor: "text-green-600 bg-green-100",
          steps: [
            { text: "Compare Annual Fees", status: "todo", detail: "Look for $0 fee cards" },
            { text: "Check Pre-approval", status: "success", detail: "3 offers available" },
            { text: "Understand APR", status: "info", detail: "Review education module" }
          ]
        };
      default: return null;
    }
  };

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
    return Math.min(850, Math.max(300, currentScore + scoreChange));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🗓️ {user.name}&apos;s Future Timeline</h2>
            <p className="text-gray-500">{clarityMode ? "Drag life events onto the timeline to see exactly what you need to do!" : "Select your milestones to generate a personalized readiness checklist"}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setGeneratedRoadmap(true)}
            className="px-6 py-3 bg-clarity-blue rounded-xl text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-900/20">
            <Sparkles className="w-5 h-5" />Generate My Roadmap
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-200 p-6 overflow-x-auto shadow-sm">
        <div className="flex items-center gap-4 mb-8 min-w-[800px]">
          {years.map((year, index) => {
            const projectedScore = getProjectedScore(year);
            const yearEvents = plannedEvents.filter(e => e.year === year);
            return (
              <motion.div key={year} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flex-1">
                <div className={`text-center p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedYear === year ? 'border-clarity-blue bg-blue-50' : 'border-gray-200 hover:border-clarity-blue/50'}`}
                  onClick={() => { setSelectedYear(year); setShowEventPicker(true); }}>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{year}</div>
                  <div className="text-xs text-gray-500 mb-2">{year === 2026 ? 'Current Year' : `+${year - 2026} years`}</div>
                  
                  <div className={`text-lg font-semibold ${projectedScore >= 740 ? 'text-green-600' : projectedScore >= 700 ? 'text-blue-600' : 'text-yellow-600'}`}>{projectedScore}</div>
                  <div className="text-xs text-gray-400">projected</div>
                  
                  {yearEvents.length > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full">
                       <span className="text-xs font-semibold text-clarity-blue">{yearEvents.length} Event{yearEvents.length > 1 ? 's' : ''}</span>
                      </div>
                  )}
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
                  className={`w-4 h-4 rounded-full border-2 ${year === 2026 ? 'bg-clarity-blue border-blue-300' : 'bg-white border-gray-400'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-3 min-w-[800px]">
          <h4 className="text-sm font-medium text-gray-400 mb-4">Planned Milestones</h4>
          <AnimatePresence>
            {plannedEvents.sort((a,b) => a.year - b.year).map((pe, index) => {
              const event = getEventDetails(pe.eventId);
              if (!event) return null;
              return (
                <motion.div key={pe.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 group border border-gray-100">
                  <div className="text-3xl">{event.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{event.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-clarity-blue">{pe.year}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{event.description}</p>
                  </div>
                  <button onClick={() => removeEvent(pe.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {showEventPicker && selectedYear && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowEventPicker(false); setSelectedYear(null); }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div><h3 className="text-xl font-bold text-gray-900">Add Milestone to {selectedYear}</h3><p className="text-sm text-gray-500">Choose a financial goal to plan for</p></div>
                <button onClick={() => { setShowEventPicker(false); setSelectedYear(null); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {lifeEvents.map((event) => (
                  <motion.button key={event.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => addEvent(event.id, selectedYear)}
                    className="bg-gray-50 rounded-xl p-4 text-left hover:border-blue-500/50 border border-gray-200 transition-all hover:bg-blue-50">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{event.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-gray-900">{event.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{event.description}</p>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><User className="w-6 h-6 text-clarity-blue" /></div>
              <div><h3 className="text-xl font-bold text-gray-900">Roadmap for {user.name}</h3><p className="text-sm text-gray-500">Personalized requirements based on your credit profile</p></div>
            </div>
            
            <div className="space-y-6">
              {plannedEvents.sort((a,b) => a.year - b.year).map((pe, index) => {
                  const checklist = getPersonalizedChecklist(pe.eventId);
                  if (!checklist) return null;

                  return (
                    <motion.div key={pe.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-2">
                                <span className="text-2xl">{getEventDetails(pe.eventId)?.icon}</span>
                                <div>
                                    <h4 className="font-bold text-gray-900">{checklist.title}</h4>
                                    <span className="text-xs text-gray-500">Target: {pe.year}</span>
                                </div>
                           </div>
                           <div className={`px-3 py-1 rounded-full text-xs font-bold ${checklist.readinessColor}`}>
                               {checklist.readiness}
                           </div>
                        </div>

                        <div className="space-y-2">
                            {checklist.steps.map((step, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-3">
                                    {/* Dynamic Icon based on status */}
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                        step.status === 'success' ? 'border-green-500 bg-green-50 text-green-600' :
                                        step.status === 'warning' ? 'border-yellow-500 bg-yellow-50 text-yellow-600' :
                                        step.status === 'error' ? 'border-red-500 bg-red-50 text-red-600' :
                                        'border-gray-300 bg-gray-50 text-gray-400'
                                    }`}>
                                        {step.status === 'success' ? <CheckCircle className="w-3 h-3" /> :
                                         step.status === 'warning' || step.status === 'error' ? <AlertCircle className="w-3 h-3" /> :
                                         <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{step.text}</p>
                                        <p className={`text-xs ${
                                            step.status === 'success' ? 'text-green-600' :
                                            step.status === 'warning' ? 'text-yellow-600' :
                                            step.status === 'error' ? 'text-red-600' :
                                            'text-gray-500'
                                        }`}>{step.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </motion.div>
                  )
              })}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}