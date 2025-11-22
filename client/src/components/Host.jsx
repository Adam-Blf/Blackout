import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { socket } from '../socket';
import { ArrowRight, ArrowLeft, Trophy, AlertCircle } from 'lucide-react';

// Socket is imported from ../socket.js


export default function Host() {
    const [game, setGame] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.connect();
        setIsConnected(true);

        socket.emit('create_game');

        socket.on('game_created', (g) => setGame(g));
        socket.on('game_updated', (g) => setGame(g));

        return () => {
            socket.off('game_created');
            socket.off('game_updated');
            socket.disconnect();
        };
    }, []);

    const startGame = () => {
        if (game) socket.emit('start_game', game.roomCode);
    };

    if (!game) return <div className="h-screen flex items-center justify-center bg-gray-900 text-white">Creating Room...</div>;

    const joinUrl = `${window.location.origin}?room=${game.roomCode}`;

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gray-800 flex justify-between items-center shadow-lg">
                <h1 className="text-2xl font-bold text-yellow-500">99 - The Game</h1>
                <div className="text-xl font-mono bg-black/50 px-4 py-1 rounded">Room: {game.roomCode}</div>
            </div>

            {/* WAITING ROOM */}
            {game.status === 'waiting' && (
                <div className="flex flex-col items-center justify-center h-[80vh] gap-8">
                    <div className="bg-white p-4 rounded-xl shadow-2xl">
                        <QRCode value={joinUrl} size={256} />
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400 mb-2">Scan to Join</p>
                        <p className="text-3xl font-mono font-bold text-yellow-400">{joinUrl}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
                        {game.players.map((p, i) => (
                            <div key={i} className="bg-gray-800 px-6 py-3 rounded-full border border-gray-700 animate-bounce">
                                {p.name}
                            </div>
                        ))}
                    </div>

                    {game.players.length > 0 && (
                        <button 
                            onClick={startGame}
                            className="bg-yellow-500 text-black px-12 py-4 rounded-full text-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-yellow-500/20"
                        >
                            START GAME
                        </button>
                    )}
                </div>
            )}

            {/* PLAYING */}
            {game.status === 'playing' && (
                <div className="relative h-[calc(100vh-80px)] flex items-center justify-center">
                    
                    {/* Center Info */}
                    <div className="z-10 text-center">
                        <div className="text-8xl font-black text-white drop-shadow-2xl mb-2">{game.currentCount}</div>
                        <div className="text-yellow-500 uppercase tracking-widest font-bold">Current Count</div>
                        
                        {/* Direction Indicator */}
                        <div className={`mt-8 flex justify-center ${game.direction === 1 ? '' : 'rotate-180'}`}>
                            <div className="bg-white/10 p-4 rounded-full">
                                <ArrowRight size={48} className="text-white" />
                            </div>
                        </div>

                        {/* Last Action Message */}
                        <div className="mt-8 bg-black/50 px-6 py-2 rounded-full text-lg border border-white/10">
                            {game.message}
                        </div>
                    </div>

                    {/* Players Orbiting */}
                    <div className="absolute inset-0 pointer-events-none">
                        {game.players.map((p, i) => {
                            const total = game.players.length;
                            const angle = (i / total) * 2 * Math.PI - Math.PI / 2; // Start top
                            const radius = 350; // Adjust based on screen
                            const x = 50 + 35 * Math.cos(angle); // %
                            const y = 50 + 35 * Math.sin(angle); // %
                            
                            const isTurn = i === game.currentPlayerIndex;

                            return (
                                <div 
                                    key={i}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500
                                        ${isTurn ? 'scale-125 z-20' : 'scale-100 opacity-70'}
                                    `}
                                    style={{ left: `${x}%`, top: `${y}%` }}
                                >
                                    <div className={`
                                        w-24 h-24 rounded-full flex flex-col items-center justify-center
                                        ${isTurn ? 'bg-yellow-500 text-black shadow-[0_0_30px_rgba(234,179,8,0.6)]' : 'bg-gray-800 text-white border-2 border-gray-600'}
                                    `}>
                                        <div className="font-bold text-xl">{p.name}</div>
                                        <div className="text-xs mt-1 flex items-center gap-1">
                                            ❤️ {p.lives}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* GAME OVER */}
            {game.status === 'gameover' && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
                    <Trophy size={120} className="text-yellow-500 mb-8 animate-bounce" />
                    <h1 className="text-6xl font-bold text-white mb-4">WINNER!</h1>
                    <div className="text-4xl text-yellow-400 font-mono">{game.winner}</div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-12 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}
