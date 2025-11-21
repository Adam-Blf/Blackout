import React, { useState } from 'react';
import Card from './Card';
import { AlertTriangle, Info } from 'lucide-react';
import RulesModal from './RulesModal';

export default function PlayerHand({ gameState, playerId, roomCode, onPlayCard, onPenalty }) {
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [showValueModal, setShowValueModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'A', 'Joker', or 'Standard'
  const [declaredCount, setDeclaredCount] = useState('');
  const [showRules, setShowRules] = useState(false);

  if (!gameState) return <div className="p-4">Connecting...</div>;

  const { players, currentPlayerIndex, gameStatus, message } = gameState;
  const player = players.find(p => p.id === playerId);
  const isMyTurn = players[currentPlayerIndex]?.id === playerId && gameStatus === 'playing';

  if (!player) return <div className="p-4">You are not in the game.</div>;

  const handleCardClick = (index) => {
    if (!isMyTurn) return;
    const card = player.hand[index];
    
    setSelectedCardIndex(index);
    setDeclaredCount(''); // Reset input

    if (card.value === 'A') {
      setModalType('A');
    } else if (card.value === 'Joker') {
      setModalType('Joker');
    } else {
      setModalType('Standard');
    }
    setShowValueModal(true);
  };

  const handleValueSubmit = (val) => {
    if (!declaredCount) {
        alert("Please enter the new count!");
        return;
    }
    onPlayCard(selectedCardIndex, val, declaredCount);
    setShowValueModal(false);
    setSelectedCardIndex(null);
  };

  return (
    <div className="flex flex-col h-screen bg-casino-green">
      {/* Top Info */}
      <div className="p-4 bg-black/20 flex justify-between items-center">
        <div>
          <div className="text-xs opacity-70">Room: {roomCode}</div>
          <div className="text-xl font-bold text-gold">Count: ???</div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowRules(true)}
            className="p-2 bg-black/20 rounded-full text-white/70 hover:text-white"
          >
            <Info size={20} />
          </button>
          <div className="text-right">
            <div className="font-bold">{player.name}</div>
            <div className="text-xs text-casino-red font-bold">{player.sips} Sips</div>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="flex-1 flex items-center justify-center p-4 text-center">
        {gameStatus === 'waiting' && (
          <div className="text-xl opacity-70">Waiting for host to start...</div>
        )}
        {gameStatus === 'playing' && (
          <div>
            {!isMyTurn ? (
              <div className="text-2xl opacity-50">
                Waiting for {players[currentPlayerIndex].name}...
              </div>
            ) : (
              <div className="text-3xl font-bold text-gold animate-pulse">
                YOUR TURN!
              </div>
            )}
            <div className="mt-4 text-sm bg-black/30 p-2 rounded">{message}</div>
          </div>
        )}
      </div>

      {/* Hand */}
      <div className="p-4 pb-8">
        <div className="flex justify-center gap-4">
          {player.hand.map((card, i) => (
            <div 
              key={i} 
              onClick={() => handleCardClick(i)}
              className={`transition-transform ${isMyTurn ? 'cursor-pointer hover:-translate-y-4' : 'opacity-50'}`}
            >
              <Card card={card} size="md" />
            </div>
          ))}
        </div>
      </div>

      {/* Penalty Button */}
      <div className="p-4 bg-black/40">
        <div className="text-xs text-center mb-2 opacity-70">SOCIAL ACTIONS</div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {players.filter(p => p.id !== playerId).map(p => (
            <button
              key={p.id}
              onClick={() => onPenalty(p.id)}
              className="flex-shrink-0 bg-casino-red px-3 py-2 rounded text-xs font-bold flex items-center gap-1"
            >
              <AlertTriangle size={12} />
              Penalize {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Value Modal */}
      {showValueModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white text-black p-6 rounded-xl w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">
              {modalType === 'A' ? 'Choose Ace Value' : modalType === 'Joker' ? 'Choose Joker Value' : 'Confirm Play'}
            </h3>
            
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">What is the new count?</label>
                <input 
                    type="number" 
                    value={declaredCount}
                    onChange={(e) => setDeclaredCount(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded text-xl font-bold text-center"
                    placeholder="???"
                    autoFocus
                />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {modalType === 'A' ? (
                <>
                  <button onClick={() => handleValueSubmit(1)} className="p-4 bg-gray-200 rounded font-bold hover:bg-gold">1</button>
                  <button onClick={() => handleValueSubmit(11)} className="p-4 bg-gray-200 rounded font-bold hover:bg-gold">11</button>
                </>
              ) : modalType === 'Joker' ? (
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button 
                    key={num} 
                    onClick={() => handleValueSubmit(num)}
                    className="p-4 bg-gray-200 rounded font-bold hover:bg-gold"
                  >
                    {num}
                  </button>
                ))
              ) : (
                <button 
                    onClick={() => handleValueSubmit(null)}
                    className="col-span-3 p-4 bg-gold rounded font-bold hover:bg-yellow-500"
                >
                    Play Card
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setShowValueModal(false)}
              className="mt-4 w-full py-2 text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}