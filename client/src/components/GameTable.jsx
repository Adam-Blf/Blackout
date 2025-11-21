import React from 'react';
import QRCode from 'react-qr-code';
import { ArrowRight, ArrowLeft, Beer } from 'lucide-react';
import Card from './Card';

export default function GameTable({ gameState, onStartGame }) {
  if (!gameState) return <div>Connecting...</div>;

  const { players, currentCount, direction, currentPlayerIndex, gameStatus, discardPile, message, winner } = gameState;
  const currentPlayer = players[currentPlayerIndex];
  const topCard = discardPile[discardPile.length - 1];

  const joinUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

  return (
    <div className="flex flex-col h-screen p-4 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <img src="/Logo 99.svg" alt="Logo" className="w-16 h-16" />
          <div>
            <h1 className="text-2xl font-bold text-gold">Le 99</h1>
            <div className="text-sm opacity-70">{gameStatus === 'waiting' ? 'Waiting for players...' : 'Game in progress'}</div>
          </div>
        </div>
        {gameStatus === 'waiting' && (
          <div className="bg-white p-2 rounded">
            <QRCode value={joinUrl} size={100} />
            <div className="text-black text-xs text-center mt-1 font-bold">SCAN TO JOIN</div>
          </div>
        )}
      </div>

      {/* Main Area */}
      <div className="flex-1 flex items-center justify-center relative">
        
        {/* Center Circle */}
        <div className="relative w-96 h-96 rounded-full border-8 border-gold/30 flex items-center justify-center bg-black/20 backdrop-blur-md">
          
          {/* Count */}
          <div className="text-center z-10">
            <div className="text-8xl font-black text-white drop-shadow-lg">{currentCount}</div>
            <div className="text-gold uppercase tracking-widest mt-2">Current Count</div>
          </div>

          {/* Direction */}
          {gameStatus === 'playing' && (
            <div className={`absolute inset-0 border-4 border-dashed border-white/20 rounded-full ${direction === 1 ? 'animate-spin-slow' : 'animate-reverse-spin'}`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-black p-2 rounded-full">
                {direction === 1 ? <ArrowRight /> : <ArrowLeft />}
              </div>
            </div>
          )}

          {/* Top Card */}
          {topCard && (
            <div className="absolute -right-12 rotate-12 transform hover:scale-110 transition">
              <Card card={topCard} size="lg" />
            </div>
          )}
        </div>

        {/* Players */}
        <div className="absolute inset-0 pointer-events-none">
          {players.map((player, i) => {
            const angle = (i / players.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 350; // Adjust based on screen
            const x = 50 + 40 * Math.cos(angle); // %
            const y = 50 + 40 * Math.sin(angle); // %
            
            const isTurn = i === currentPlayerIndex && gameStatus === 'playing';

            return (
              <div 
                key={player.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 ${isTurn ? 'scale-125 z-20' : 'scale-100 opacity-80'}`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-gray-800 text-xl font-bold ${isTurn ? 'border-gold shadow-[0_0_20px_rgba(255,215,0,0.5)]' : 'border-gray-600'}`}>
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="bg-black/60 px-2 py-1 rounded mt-1 text-sm font-bold">{player.name}</div>
                <div className="flex items-center gap-1 text-xs bg-casino-red px-2 py-0.5 rounded-full mt-1">
                  <Beer size={12} /> {player.sips}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Bar */}
      <div className="bg-black/40 p-4 rounded-xl text-center text-xl font-bold animate-pulse">
        {message}
      </div>

      {/* Start Button */}
      {gameStatus === 'waiting' && players.length >= 2 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <button 
            onClick={onStartGame}
            className="bg-gold text-black px-8 py-4 rounded-full font-black text-2xl shadow-lg hover:scale-105 transition animate-bounce"
          >
            START GAME
          </button>
        </div>
      )}

      {/* Winner Overlay */}
      {gameStatus === 'gameover' && winner && (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-center">
          <h1 className="text-6xl font-black text-gold mb-4">WINNER!</h1>
          <div className="text-4xl mb-8">{winner.name} reached 99!</div>
          <div className="text-2xl text-casino-red font-bold bg-white px-8 py-4 rounded-xl animate-pulse">
            EVERYONE ELSE: CUL SEC!
          </div>
          <button 
            onClick={onStartGame}
            className="mt-12 bg-white text-black px-6 py-3 rounded hover:bg-gray-200"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}