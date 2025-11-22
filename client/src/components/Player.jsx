import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import { User, Play } from 'lucide-react';

export default function Player({ roomCode }) {
    const [name, setName] = useState('');
    const [joined, setJoined] = useState(false);
    const [game, setGame] = useState(null);
    const [error, setError] = useState('');
    const [selectedCard, setSelectedCard] = useState(null); // For Ace/5 selection
    const [oracleVision, setOracleVision] = useState(null); // For Oracle (Jack)

    useEffect(() => {
        socket.connect();

        socket.on('joined_success', () => {
            setJoined(true);
            setError('');
        });

        socket.on('game_updated', (g) => {
            setGame(g);
            setOracleVision(null); // Clear vision on new turn
        });

        socket.on('oracle_vision', (cards) => {
            setOracleVision(cards);
        });

        socket.on('error', (msg) => {
            setError(msg);
            setTimeout(() => setError(''), 3000);
        });

        return () => {
            socket.off('joined_success');
            socket.off('game_updated');
            socket.off('oracle_vision');
            socket.off('error');
        };
    }, []);

    const handleJoin = (e) => {
        e.preventDefault();
        if (!name) return;
        socket.emit('join_game', { roomCode, name });
    };

    const playCard = (card, valueChoice = null) => {
        if ((card.value === 'A' || card.value === '5') && valueChoice === null) {
            setSelectedCard(card); // Open modal
            return;
        }
        socket.emit('play_card', { roomCode, card, valueChoice });
        setSelectedCard(null);
    };

    if (!joined) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-bold text-yellow-500 mb-8">Join Room {roomCode}</h1>
                <form onSubmit={handleJoin} className="w-full max-w-md space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Your Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-500 focus:outline-none text-white"
                            placeholder="Enter nickname..."
                            maxLength={12}
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <button 
                        type="submit"
                        className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                        JOIN GAME
                    </button>
                </form>
            </div>
        );
    }

    if (!game) return <div className="text-white p-4">Loading game state...</div>;

    const me = game.players.find(p => p.id === socket.id);
    const isMyTurn = game.players[game.currentPlayerIndex]?.id === socket.id;

    if (game.status === 'waiting') {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
                <User size={64} className="text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold">You're in!</h2>
                <p className="text-gray-400 mt-2">Waiting for host to start...</p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {game.players.map((p, i) => (
                        <span key={i} className="bg-gray-800 px-3 py-1 rounded-full text-sm">{p.name}</span>
                    ))}
                </div>
            </div>
        );
    }

    if (game.status === 'gameover') {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-4xl font-bold mb-4">{game.winner === me?.name ? 'YOU WON!' : 'GAME OVER'}</h1>
                <p className="text-xl text-yellow-500">Winner: {game.winner}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Header Info */}
            <div className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
                <div>
                    <div className="text-xs text-gray-400">Count</div>
                    <div className="text-2xl font-bold text-yellow-500">{game.currentCount}</div>
                </div>
                <div className={`px-4 py-1 rounded-full text-sm font-bold ${isMyTurn ? 'bg-green-500 text-black animate-pulse' : 'bg-gray-700'}`}>
                    {isMyTurn ? "YOUR TURN" : `${game.players[game.currentPlayerIndex].name}'s Turn`}
                </div>
                <div>
                    <div className="text-xs text-gray-400">Lives</div>
                    <div className="text-xl">❤️ {me?.lives}</div>
                </div>
            </div>

            {/* Hand */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                    {me?.hand.map((card, i) => (
                        <button
                            key={i}
                            disabled={!isMyTurn}
                            onClick={() => playCard(card)}
                            className={`
                                relative aspect-[2/3] rounded-xl flex flex-col items-center justify-center shadow-xl transition-transform
                                ${isMyTurn ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                                bg-white text-black
                            `}
                        >
                            <div className={`text-4xl ${['♥', '♦'].includes(card.suit) ? 'text-red-600' : 'text-black'}`}>
                                {card.suit}
                            </div>
                            <div className={`text-2xl font-bold mt-2 ${['♥', '♦'].includes(card.suit) ? 'text-red-600' : 'text-black'}`}>
                                {card.value}
                            </div>
                            
                            {/* Card Effect Hint */}
                            <div className="absolute bottom-2 text-[10px] font-bold text-gray-500 uppercase">
                                {card.value === '4' && 'Reverse'}
                                {card.value === '9' && 'Pass'}
                                {card.value === '10' && '-10'}
                                {card.value === 'K' && '99'}
                                {card.value === 'Q' && '+10'}
                                {card.value === 'J' && '+10'}
                                {card.value === 'A' && '1 or 11'}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Oracle Vision Overlay */}
            {oracleVision && (
                <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4">
                    <h3 className="text-2xl font-bold text-purple-400 mb-6">🔮 Oracle Vision 🔮</h3>
                    <div className="flex gap-4 mb-8">
                        {oracleVision.map((c, i) => (
                            <div key={i} className="bg-white text-black w-20 h-32 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg">
                                {c}
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => setOracleVision(null)}
                        className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-500"
                    >
                        Close Vision
                    </button>
                </div>
            )}

            {/* Value Selection Modal */}
            {selectedCard && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm text-center">
                        <h3 className="text-xl font-bold mb-4">
                            {selectedCard.value === 'A' ? 'Choose Ace Value' : 'Choose Aubergiste Effect'}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {selectedCard.value === 'A' ? (
                                <>
                                    <button 
                                        onClick={() => playCard(selectedCard, 1)}
                                        className="bg-white text-black py-4 rounded-lg font-bold text-xl hover:bg-gray-200"
                                    >
                                        1
                                    </button>
                                    <button 
                                        onClick={() => playCard(selectedCard, 11)}
                                        className="bg-yellow-500 text-black py-4 rounded-lg font-bold text-xl hover:bg-yellow-400"
                                    >
                                        11
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => playCard(selectedCard, -5)}
                                        className="bg-red-500 text-white py-4 rounded-lg font-bold text-xl hover:bg-red-400"
                                    >
                                        -5
                                    </button>
                                    <button 
                                        onClick={() => playCard(selectedCard, 5)}
                                        className="bg-green-500 text-white py-4 rounded-lg font-bold text-xl hover:bg-green-400"
                                    >
                                        +5
                                    </button>
                                </>
                            )}
                        </div>
                        <button 
                            onClick={() => setSelectedCard(null)}
                            className="mt-4 text-gray-400 underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
