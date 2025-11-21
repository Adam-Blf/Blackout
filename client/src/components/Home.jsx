import React, { useState } from 'react';
import { Beer, Spade, MessageCircle, Info } from 'lucide-react';
import RulesModal from './RulesModal';

export default function Home({ onSelectGame }) {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-black">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-700">
        <h1 className="text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          BLACKOUT
        </h1>
        <p className="text-xl text-gray-400 font-light tracking-widest uppercase">Choose your poison</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-4">
        {/* Le 99 Card */}
        <div className="group relative bg-neutral-800 rounded-3xl p-1 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative h-full bg-neutral-900 rounded-[22px] p-6 flex flex-col items-center text-center border border-white/5">
            <div className="w-20 h-20 bg-purple-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/30">
              <Spade className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-white">Le 99</h3>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">Don't let the count exceed 99. Use special cards to survive and make others drink!</p>
            
            <div className="mt-auto flex gap-3 w-full">
              <button 
                onClick={() => onSelectGame('99')}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg shadow-purple-900/50 hover:shadow-purple-500/50 transition-all active:scale-95"
              >
                PLAY NOW
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowRules(true); }}
                className="px-4 py-3 bg-neutral-800 rounded-xl text-gray-400 hover:text-white hover:bg-neutral-700 transition-colors border border-white/10"
                title="Rules"
              >
                <Info size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Truth or Dare Card (In Dev) */}
        <div className="relative bg-neutral-800/50 rounded-3xl p-1 border border-white/5 opacity-75">
          <div className="h-full bg-neutral-900/50 rounded-[22px] p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-pink-900/20 rounded-full flex items-center justify-center mb-6 border border-pink-500/20">
              <MessageCircle className="w-10 h-10 text-pink-400/50" />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-gray-500">Truth or Dare</h3>
            <p className="text-gray-600 mb-8 text-sm">Spill the tea or do the deed. The ultimate party starter.</p>
            <div className="mt-auto w-full">
              <span className="block w-full py-3 bg-pink-900/20 rounded-xl text-sm font-bold text-pink-400 border border-pink-900/50 tracking-wider uppercase">
                In Development
              </span>
            </div>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="relative bg-neutral-800/30 rounded-3xl p-1 border border-white/5 opacity-50">
          <div className="h-full bg-neutral-900/30 rounded-[22px] p-6 flex flex-col items-center text-center grayscale">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
              <Beer className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-gray-600">Kings Cup</h3>
            <p className="text-gray-700 mb-8 text-sm">The classic drinking game.</p>
            <div className="mt-auto w-full">
              <span className="block w-full py-3 bg-neutral-800 rounded-xl text-sm font-bold text-gray-600 border border-white/5 tracking-wider uppercase">
                Locked
              </span>
            </div>
          </div>
        </div>
      </div>

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}