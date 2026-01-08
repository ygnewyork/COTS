'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const definitions = [
  { term: 'APR (Annual Percentage Rate)', category: 'Basics', definition: 'The yearly interest rate you’ll be charged if you carry a balance on your credit card. Think of it as the "rent" you pay for borrowing money.' },
  { term: 'Credit Utilization Ratio', category: 'Score Factors', definition: 'The percentage of your total credit limit that you are currently using. e.g., If you have a $1000 limit and spent $300, your utilization is 30%. Lower is better!' },
  { term: 'Hard Inquiry', category: 'Score Factors', definition: 'When a lender checks your credit report because you applied for new credit. This can drop your score by a few points temporarily.' },
  { term: 'Soft Inquiry', category: 'Score Factors', definition: 'When you check your own credit, or a lender checks it for a "pre-approval". These do NOT affect your score at all.' },
  { term: 'FICO Score', category: 'Basics', definition: 'The most common credit scoring model used by lenders to determine how risky it is to lend you money. Ranges from 300 to 850.' },
  { term: 'VantageScore', category: 'Basics', definition: 'A competitor to FICO, created by the three major credit bureaus (Equifax, Experian, Comenity... wait no, TransUnion). It is becoming more popular.' },
  { term: 'Principal', category: 'Loans', definition: 'The actual amount of money you borrowed, before interest is added.' },
  { term: 'Statement Balance', category: 'Cards', definition: 'The amount you owe on your credit card at the end of your billing cycle. Paying this in full leads to $0 interest.' },
  { term: 'Minimum Payment', category: 'Cards', definition: 'The smallest amount you can pay to avoid a late fee. WARNING: Paying only this keeps you in debt for a long time due to interest.' },
  { term: 'Secured Card', category: 'Cards', definition: 'A credit card backed by a cash deposit (collateral). Great for building credit from scratch.' },
  { term: 'Charge-Off', category: 'Negative Items', definition: 'When a lender gives up on collecting your debt after months of non-payment. This is very bad for your score.' },
  { term: 'Delinquency', category: 'Negative Items', definition: 'Failure to make payments on time. Usually reported to bureaus after 30 days late.' },
  { term: 'Credit Mix', category: 'Score Factors', definition: 'Having different types of credit accounts (e.g., credit cards, car loans, student loans). Lenders like to see you can handle various debts.' },
  { term: 'Thin File', category: 'Basics', definition: 'Having little to no credit history, making it hard to generate a score.' },
  { term: 'Amortization', category: 'Loans', definition: 'The process of paying off a debt over time with regular payments. A mortgage is an amortized loan.' },
  { term: 'Co-signer', category: 'Loans', definition: 'Someone who agrees to pay your debt if you don’t. Their credit is on the line too!' },
];

export default function LearnCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(definitions.map(d => d.category))];

  const filteredDefs = definitions.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Search Header */}
      <div className="bg-clarity-card border border-clarity-border rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="text-clarity-red" />
          Knowledge Vault
        </h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search for a term (e.g., 'APR', 'Inquiry')..." 
            className="w-full bg-clarity-dark border border-clarity-border rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-clarity-red focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-clarity-red text-white' 
                  : 'bg-clarity-border text-gray-400 hover:bg-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Definitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDefs.map((item, index) => (
          <motion.div 
            key={item.term}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-clarity-card border border-clarity-border rounded-xl p-4 cursor-pointer hover:border-clarity-red/50 transition-colors ${expandedIndex === index ? 'col-span-1 md:col-span-2' : ''}`}
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase tracking-wider text-clarity-blue font-bold mb-1 block">{item.category}</span>
                <h3 className="text-lg font-semibold text-white">{item.term}</h3>
              </div>
              {expandedIndex === index ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
            </div>
            
            {expandedIndex === index && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                className="mt-3 pt-3 border-t border-clarity-border text-gray-300"
              >
                {item.definition}
              </motion.div>
            )}
            {expandedIndex !== index && (
              <p className="text-gray-400 text-sm mt-2 line-clamp-1">{item.definition}</p>
            )}
          </motion.div>
        ))}
      </div>

      {filteredDefs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No definitions found matching your search.
        </div>
      )}
    </motion.div>
  );
}
