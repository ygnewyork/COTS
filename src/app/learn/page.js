'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Search, BookOpen, ChevronDown, ChevronUp, GraduationCap, TrendingUp, DollarSign, Home, CreditCard, Car, Shield } from 'lucide-react';

const definitions = [
  // Basics
  { term: 'Credit Score', category: 'Basics', definition: 'A 3-digit number (300-850) that represents your creditworthiness. Higher scores mean you\'re more likely to repay borrowed money. Lenders use this to decide if they\'ll lend to you and at what interest rate.' },
  { term: 'FICO Score', category: 'Basics', definition: 'The most common credit scoring model, created by Fair Isaac Corporation. Used by 90% of top lenders. Ranges from 300-850, with 670+ considered "good."' },
  { term: 'VantageScore', category: 'Basics', definition: 'A competitor to FICO created by the three major credit bureaus (Equifax, Experian, TransUnion). Uses the same 300-850 range but weighs factors slightly differently.' },
  { term: 'Credit Report', category: 'Basics', definition: 'A detailed record of your credit history maintained by credit bureaus. Includes accounts, payment history, inquiries, and public records. You can get free reports annually at AnnualCreditReport.com.' },
  { term: 'Credit Bureau', category: 'Basics', definition: 'Companies that collect and maintain your credit information. The three major bureaus are Equifax, Experian, and TransUnion. They sell this data to lenders.' },
  { term: 'Thin File', category: 'Basics', definition: 'When you have little to no credit history, making it hard to generate a score. Common for young people or new immigrants. Building credit takes time!' },
  
  // Score Factors
  { term: 'Payment History', category: 'Score Factors', definition: 'The biggest factor (35% of FICO score). Shows whether you pay bills on time. Even one 30-day late payment can drop your score 100+ points. Set up autopay!' },
  { term: 'Credit Utilization', category: 'Score Factors', definition: 'The percentage of your available credit you\'re using. If you have a $1,000 limit and $300 balance, utilization is 30%. Keep this under 30%, ideally under 10%.' },
  { term: 'Credit Age', category: 'Score Factors', definition: 'The average age of all your credit accounts. Longer history = higher score. This is why closing old cards can hurt your score.' },
  { term: 'Credit Mix', category: 'Score Factors', definition: 'Having different types of credit (cards, auto loans, mortgage, etc.). Shows you can manage various debts. Worth about 10% of your score.' },
  { term: 'Hard Inquiry', category: 'Score Factors', definition: 'When a lender checks your credit because you applied for new credit. Drops your score 5-10 points and stays on report for 2 years. Multiple inquiries for same loan type within 14-45 days count as one.' },
  { term: 'Soft Inquiry', category: 'Score Factors', definition: 'When you or a company checks your credit for non-lending purposes (like pre-approval offers or checking your own score). Does NOT affect your score at all!' },
  
  // Credit Cards
  { term: 'APR (Annual Percentage Rate)', category: 'Credit Cards', definition: 'The yearly interest rate charged if you carry a balance. Average is around 20-24%. If you pay in full each month, you never pay interest!' },
  { term: 'Statement Balance', category: 'Credit Cards', definition: 'The amount you owe at the end of a billing cycle. Pay this in full by the due date to avoid ALL interest charges.' },
  { term: 'Minimum Payment', category: 'Credit Cards', definition: 'The smallest amount you can pay to avoid a late fee. WARNING: Paying only this keeps you in debt for years due to compounding interest. Always pay more!' },
  { term: 'Credit Limit', category: 'Credit Cards', definition: 'The maximum amount you can borrow on a card. Higher limits improve utilization ratio. Request increases after 6+ months of good history.' },
  { term: 'Secured Card', category: 'Credit Cards', definition: 'A credit card backed by a cash deposit (collateral). If you deposit $500, your limit is $500. Great for building credit from scratch or rebuilding after problems.' },
  { term: 'Balance Transfer', category: 'Credit Cards', definition: 'Moving debt from one card to another, usually to get a lower interest rate. Often comes with 0% APR promo period. Watch out for 3-5% transfer fees.' },
  { term: 'Cash Advance', category: 'Credit Cards', definition: 'Using your credit card to get cash. AVOID THIS! Usually has 25%+ APR, no grace period, and additional fees. Extremely expensive.' },
  { term: 'Grace Period', category: 'Credit Cards', definition: 'The time between your statement date and due date (usually 21-25 days) where you can pay without interest if you paid last month\'s balance in full.' },
  
  // Loans
  { term: 'Principal', category: 'Loans', definition: 'The original amount of money you borrowed, before interest. Your payments go toward both principal and interest.' },
  { term: 'Interest', category: 'Loans', definition: 'The cost of borrowing money, expressed as a percentage. On a $10,000 loan at 5% interest, you pay $500/year just for the privilege of borrowing.' },
  { term: 'Amortization', category: 'Loans', definition: 'The process of paying off a loan over time with fixed payments. Early payments are mostly interest; later payments are mostly principal.' },
  { term: 'Co-signer', category: 'Loans', definition: 'Someone who agrees to pay your debt if you don\'t. Their credit is affected too! Never co-sign unless you\'re willing to pay the entire debt.' },
  { term: 'Collateral', category: 'Loans', definition: 'An asset (car, house) that secures a loan. If you don\'t pay, the lender can take the collateral. Secured loans have lower rates than unsecured.' },
  { term: 'DTI (Debt-to-Income Ratio)', category: 'Loans', definition: 'Your monthly debt payments divided by monthly income. Lenders want this under 36%, with max 28% for housing. Example: $1,500 debt / $5,000 income = 30% DTI.' },
  
  // Negative Items
  { term: 'Late Payment', category: 'Negative Items', definition: 'A payment made 30+ days after the due date. Gets reported to bureaus and can drop your score 100+ points. Stays on report for 7 years!' },
  { term: 'Delinquency', category: 'Negative Items', definition: 'Being behind on payments. Starts at 30 days late, gets progressively worse at 60, 90, 120 days. Severely damages your score.' },
  { term: 'Collection Account', category: 'Negative Items', definition: 'When unpaid debt is sold to a collection agency. Major negative mark that stays for 7 years. Some newer scoring models ignore paid collections.' },
  { term: 'Charge-Off', category: 'Negative Items', definition: 'When a creditor gives up on collecting after 180+ days of non-payment. They write it off as a loss but you STILL owe the money. Devastating to your score.' },
  { term: 'Bankruptcy', category: 'Negative Items', definition: 'A legal process to eliminate or reorganize debts. Chapter 7 (liquidation) stays 10 years; Chapter 13 (repayment plan) stays 7 years. Last resort option.' },
  { term: 'Foreclosure', category: 'Negative Items', definition: 'When you default on a mortgage and the bank takes your home. Stays on credit report for 7 years. Makes it very hard to get another mortgage.' },
  
  // Smart Strategies
  { term: 'Authorized User', category: 'Strategies', definition: 'Being added to someone else\'s credit card. Their positive history can boost YOUR score. Great way for young people to build credit through parents.' },
  { term: 'Credit Builder Loan', category: 'Strategies', definition: 'A small loan where payments are held in savings until paid off. Builds payment history without risk. Offered by credit unions and online lenders.' },
  { term: 'Goodwill Letter', category: 'Strategies', definition: 'A letter asking a creditor to remove a late payment from your record as a courtesy. Works best if you have a long, positive history with them.' },
  { term: 'Pay for Delete', category: 'Strategies', definition: 'Negotiating with a collection agency to remove the account from your credit report in exchange for payment. Not guaranteed to work but worth trying.' },
  { term: 'Credit Freeze', category: 'Strategies', definition: 'Locking your credit reports so no one can open accounts in your name. Free to do and undo. Smart protection against identity theft.' },
];

export default function LearnPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [whyScoreMattersExpanded, setWhyScoreMattersExpanded] = useState(true);

  const categories = ['All', 'Basics', 'Score Factors', 'Credit Cards', 'Loans', 'Negative Items', 'Strategies'];

  const filteredDefs = definitions.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      'Basics': 'bg-blue-100 text-blue-700 border-blue-200',
      'Score Factors': 'bg-purple-100 text-purple-700 border-purple-200',
      'Credit Cards': 'bg-green-100 text-green-700 border-green-200',
      'Loans': 'bg-orange-100 text-orange-700 border-orange-200',
      'Negative Items': 'bg-red-100 text-red-700 border-red-200',
      'Strategies': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <section className="pt-28 pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-2xl mb-6">
                <GraduationCap className="w-12 h-12 text-clarity-blue" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Credit Dictionary</h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Everything you need to know about credit, explained in plain English.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8"
            >
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search for a term (e.g., 'APR', 'Utilization', 'Hard Inquiry')..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-clarity-blue focus:border-transparent focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeCategory === cat 
                        ? 'bg-clarity-blue text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Results Count */}
            <p className="text-gray-500 mb-4 font-medium">
              {filteredDefs.length} {filteredDefs.length === 1 ? 'term' : 'terms'} found
            </p>

            {/* Why Higher Score Matters Card */}
            {activeCategory === 'All' && searchTerm === '' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-clarity-blue to-blue-700 rounded-2xl p-6 mb-8 text-white shadow-xl"
              >
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setWhyScoreMattersExpanded(!whyScoreMattersExpanded)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Why a Higher Credit Score Matters</h3>
                      <p className="text-blue-100">Your score isn't just a number — it's your financial reputation that unlocks real money savings.</p>
                    </div>
                  </div>
                  <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors ml-4 flex-shrink-0">
                    {whyScoreMattersExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
                
                {whyScoreMattersExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Home className="w-5 h-5 text-blue-200" />
                          <span className="font-bold">Lower Mortgage Rates</span>
                        </div>
                        <p className="text-sm text-blue-100">A 760+ score vs. 620 score can save you <span className="font-bold text-white">$100,000+</span> in interest over a 30-year mortgage.</p>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Car className="w-5 h-5 text-blue-200" />
                          <span className="font-bold">Better Auto Loans</span>
                        </div>
                        <p className="text-sm text-blue-100">Excellent credit can get you <span className="font-bold text-white">3-4% APR</span> vs. 15%+ for poor credit — saving thousands per car.</p>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                          <CreditCard className="w-5 h-5 text-blue-200" />
                          <span className="font-bold">Premium Card Access</span>
                        </div>
                        <p className="text-sm text-blue-100">Top travel cards with <span className="font-bold text-white">$1,000+ in perks</span> require scores of 740+. Bad credit = high-fee cards only.</p>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign className="w-5 h-5 text-blue-200" />
                          <span className="font-bold">Lower Insurance Rates</span>
                        </div>
                        <p className="text-sm text-blue-100">Many insurers use credit-based scores. Poor credit can mean <span className="font-bold text-white">40-50% higher</span> car insurance premiums.</p>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Home className="w-5 h-5 text-blue-200" />
                          <span className="font-bold">Easier Apartment Rentals</span>
                        </div>
                        <p className="text-sm text-blue-100">Landlords check credit. Low scores mean <span className="font-bold text-white">rejected applications</span> or massive security deposits.</p>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="w-5 h-5 text-blue-200" />
                          <span className="font-bold">No Utility Deposits</span>
                        </div>
                        <p className="text-sm text-blue-100">Good credit = no deposits for electricity, phone, or internet. Bad credit = <span className="font-bold text-white">$200-500 deposits</span> tied up.</p>
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-5 border-t border-white/20 flex items-center gap-3">
                      <div className="text-4xl">💡</div>
                      <p className="text-sm text-blue-100"><span className="font-bold text-white">Bottom line:</span> Over a lifetime, excellent credit vs. poor credit can mean <span className="font-bold text-white">$200,000+ in savings</span>. The effort to build your score is one of the best investments you'll ever make!</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Definitions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDefs.map((item, index) => (
                <motion.div 
                  key={item.term}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.5) }}
                  className={`bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-clarity-blue/30 transition-all ${
                    expandedIndex === index ? 'md:col-span-2 ring-2 ring-clarity-blue/20' : ''
                  }`}
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <span className={`inline-block text-xs font-bold px-2 py-1 rounded-md border mb-2 ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">{item.term}</h3>
                    </div>
                    <div className="p-1 rounded-lg bg-gray-100">
                      {expandedIndex === index ? 
                        <ChevronUp className="text-gray-500 w-5 h-5" /> : 
                        <ChevronDown className="text-gray-500 w-5 h-5" />
                      }
                    </div>
                  </div>
                  
                  {expandedIndex === index ? (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <p className="text-gray-600 leading-relaxed">{item.definition}</p>
                    </motion.div>
                  ) : (
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.definition}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredDefs.length === 0 && (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No terms found matching "{searchTerm}"</p>
                <button 
                  onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                  className="mt-4 text-clarity-blue font-semibold hover:underline"
                >
                  Clear filters
                </button>
              </div>
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
