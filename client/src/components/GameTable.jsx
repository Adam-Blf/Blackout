import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { ArrowRight, ArrowLeft, Beer, Info, Copy, Check } from 'lucide-react';
import Card from './Card';
import RulesModal from './RulesModal';
import { useLanguage } from '../contexts/LanguageContext';

export default function GameTable({ gameState, roomCode, onStartGame, isConnected, onBack }) {
  const [showRules, setShowRules] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-casino-green text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold mb-4"></div>
        <div className="text-xl font-bold">{t('game.connecting')}</div>
        <div className="text-sm opacity-70 mt-2">{t('game.connectionError')}</div>
        <button onClick={onBack} className="mt-8 px-6 py-2 bg-black/30 rounded hover:bg-black/50">
          {t('lobby.back')}
        </button>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-casino-green text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold mb-4"></div>
        <div className="text-xl font-bold">{t('game.waiting')}</div>
      </div>
    );
  }

  const { players, currentCount, direction, currentPlayerIndex, gameStatus, discardPile, message, winner } = gameState;
  const currentPlayer = players[currentPlayerIndex];
  const topCard = discardPile[discardPile.length - 1];

  // Use window.location.origin to get protocol + hostname + port (if any)
  // Add ?game=99 parameter to skip the hub
  const joinUrl = `${window.location.origin}?game=99&room=${roomCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen p-4 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-casino-green via-[#064025] to-black">
      {/* Header */}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-4">
          <img src="/Logo 99.svg" alt="Logo" className="w-16 h-16 drop-shadow-lg" />
          <div>
            <h1 className="text-2xl font-bold text-gold drop-shadow-md">{t('lobby.title')}</h1>
            <div className="text-sm opacity-70">{gameStatus === 'waiting' ? t('game.waiting') : t('game.playing')}</div>
            {roomCode && <div className="text-xs font-mono bg-black/30 px-2 py-1 rounded mt-1">Room: {roomCode}</div>}
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowRules(true)}
            className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <Info />
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex items-center justify-center relative">
        
        {/* Center Circle */}
        <div className="relative w-96 h-96 rounded-full border-8 border-gold/30 flex items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {/* Waiting State: Big QR Code */}
          {gameStatus === 'waiting' ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="bg-white p-4 rounded-xl shadow-2xl mb-4">
                <QRCode value={joinUrl} size={180} />
              </div>
              <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="text-gold font-mono text-sm max-w-[200px] truncate">{joinUrl}</span>
                <button 
                  onClick={copyLink}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-white"
                  title="Copy Link"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="text-white/70 text-sm mt-2 font-bold tracking-widest uppercase animate-pulse">{t('game.scan')}</div>
            </div>
          ) : (
            /* Playing State: Count & Direction */
            <>
              <div className="text-center z-10">
                <div className="text-8xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">???</div>
                <div className="text-gold uppercase tracking-widest mt-2 font-bold text-sm">{t('game.count')}</div>
              </div>

              <div className={`absolute inset-0 border-4 border-dashed border-white/20 rounded-full ${direction === 1 ? 'animate-spin-slow' : 'animate-reverse-spin'}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-black p-2 rounded-full shadow-lg">
                  {direction === 1 ? <ArrowRight /> : <ArrowLeft />}
                </div>
              </div>
            </>
          )}

          {/* Top Card (Only when playing) */}
          {topCard && gameStatus === 'playing' && (
            <div className="absolute -right-12 rotate-12 transform hover:scale-110 transition duration-300 drop-shadow-2xl">
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
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-gray-800 text-xl font-bold shadow-lg ${isTurn ? 'border-gold shadow-[0_0_20px_rgba(255,215,0,0.5)]' : 'border-gray-600'}`}>
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="bg-black/60 px-3 py-1 rounded-full mt-2 text-sm font-bold backdrop-blur-sm border border-white/10">{player.name}</div>
                <div className="flex items-center gap-1 text-xs bg-casino-red px-2 py-0.5 rounded-full mt-1 shadow-md">
                  <Beer size={12} /> {player.sips}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Bar */}
      <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl text-center text-xl font-bold animate-pulse border border-white/5 mx-auto max-w-2xl w-full mb-4">
        {message}
      </div>

      {/* Start Button */}
      {gameStatus === 'waiting' && players.length >= 2 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <button 
            onClick={onStartGame}
            className="bg-gradient-to-r from-gold to-yellow-500 text-black px-10 py-4 rounded-full font-black text-2xl shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:scale-105 hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] transition-all animate-bounce"
          >
            {t('game.start')}
          </button>
        </div>
      )}

      {/* Winner Overlay */}
      {gameStatus === 'gameover' && winner && (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold to-yellow-700 mb-4 drop-shadow-lg">{t('game.winner')}</h1>
          <div className="text-4xl mb-8 text-white">{winner.name} {t('game.reached')}</div>
          <div className="text-3xl text-white font-bold bg-casino-red px-12 py-6 rounded-2xl animate-pulse shadow-[0_0_50px_rgba(220,38,38,0.5)] border-4 border-red-500">
            {t('game.culsec')}
          </div>
          
          {/* Penalty Summary */}
          <div className="mt-8 bg-white/10 p-6 rounded-xl backdrop-blur-md w-full max-w-md">
            <h3 className="text-2xl font-bold text-gold mb-4">Final Results</h3>
            <div className="space-y-2">
                {players.sort((a, b) => b.penalties - a.penalties).map(p => (
                    <div key={p.id} className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-xl">{p.name}</span>
                        <div className="text-right">
                            <div className="text-sm text-red-400">{p.penalties} Errors</div>
                            <div className="text-xl font-bold text-gold">{p.sips} Sips</div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          <button 
            onClick={onStartGame}
            className="mt-12 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors text-xl"
          >
            {t('game.playAgain')}
          </button>
        </div>
      )}

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}