import React from 'react';
import { X, Scroll, Beer, AlertTriangle } from 'lucide-react';

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-neutral-900 border-2 border-gold rounded-xl shadow-2xl shadow-gold/20">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-neutral-900 border-b border-white/10">
          <div className="flex items-center gap-2 text-gold">
            <Scroll className="w-6 h-6" />
            <h2 className="text-2xl font-bold font-serif tracking-wider">OFFICIAL RULES</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 text-gray-300">
          
          {/* Objective */}
          <section>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center text-sm font-black">1</span>
              The Objective
            </h3>
            <p className="pl-10">
              Keep the central count <strong>below 99</strong>. If you cannot play a card without exceeding 99, you lose the round and must finish your drink!
            </p>
          </section>

          {/* Special Cards */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center text-sm font-black">2</span>
              Special Cards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="font-bold text-gold text-xl w-8">A</div>
                <div>
                  <div className="font-bold text-white">Ace</div>
                  <div className="text-sm">+1 or +11 (Your choice)</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="font-bold text-gold text-xl w-8">9</div>
                <div>
                  <div className="font-bold text-white">Nine</div>
                  <div className="text-sm">+0 (Pass your turn)</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="font-bold text-gold text-xl w-8">10</div>
                <div>
                  <div className="font-bold text-white">Ten</div>
                  <div className="text-sm">-10 to the count</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="font-bold text-gold text-xl w-8">J</div>
                <div>
                  <div className="font-bold text-white">Jack</div>
                  <div className="text-sm">Set count to 99 instantly</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="font-bold text-gold text-xl w-8">Q</div>
                <div>
                  <div className="font-bold text-white">Queen</div>
                  <div className="text-sm">+10 & Reverse direction</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="font-bold text-gold text-xl w-8">K</div>
                <div>
                  <div className="font-bold text-white">King</div>
                  <div className="text-sm">Set count to 70</div>
                </div>
              </div>
            </div>
          </section>

          {/* Drinking Rules */}
          <section>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-casino-red text-white flex items-center justify-center text-sm font-black">3</span>
              Drinking Rules
            </h3>
            <div className="pl-10 space-y-3">
              <div className="flex items-start gap-3">
                <Beer className="w-5 h-5 text-gold shrink-0 mt-1" />
                <p><strong className="text-white">Social Drink:</strong> If the count lands on a multiple of 11 (11, 22, 33...), everyone drinks!</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-casino-red shrink-0 mt-1" />
                <p><strong className="text-white">Game Over:</strong> The player who busts 99 finishes their drink.</p>
              </div>
            </div>
          </section>

        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 p-4 bg-neutral-900 border-t border-white/10 text-center">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-gold text-black font-bold rounded-full hover:bg-yellow-400 transition-colors shadow-lg shadow-gold/20"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}