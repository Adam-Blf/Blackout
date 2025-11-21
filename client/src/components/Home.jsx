import React from 'react';
import { Beer, Spade } from 'lucide-react';

export default function Home({ onSelectGame }) {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          BLACKOUT
        </h1>
        <p className="text-xl text-gray-400">Choose your poison</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {/* Le 99 Card */}
        <div 
          onClick={() => onSelectGame('99')}
          className="group relative bg-neutral-800 rounded-2xl p-6 cursor-pointer hover:bg-neutral-700 transition-all duration-300 border border-neutral-700 hover:border-purple-500"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
          <div className="relative flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Spade className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Le 99</h3>
            <p className="text-gray-400 mb-4">Don't let the count exceed 99. Use special cards to survive!</p>
            <span className="px-4 py-2 bg-purple-600 rounded-full text-sm font-bold group-hover:bg-purple-500 transition-colors">
              Play Now
            </span>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-800 opacity-50 cursor-not-allowed">
          <div className="flex flex-col items-center text-center grayscale">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Beer className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Kings Cup</h3>
            <p className="text-gray-500 mb-4">The classic drinking game. Coming soon.</p>
            <span className="px-4 py-2 bg-gray-700 rounded-full text-sm font-bold text-gray-500">
              Locked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}