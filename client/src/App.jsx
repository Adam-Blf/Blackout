import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Lobby from './components/Lobby';
import GameTable from './components/GameTable';
import PlayerHand from './components/PlayerHand';
import Home from './components/Home';

// Connect to server (assume localhost:3001 for dev, or relative for prod)
const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:3001' : '/');

function Game99({ onBack }) {
  const [view, setView] = useState('lobby'); // lobby, table, hand
  const [gameState, setGameState] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
    const onConnect = () => setPlayerId(socket.id);
    const onGameState = (state) => setGameState(state);

    socket.on('connect', onConnect);
    socket.on('game_state_update', onGameState);

    // If already connected
    if (socket.connected) {
      setPlayerId(socket.id);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('game_state_update', onGameState);
    };
  }, []);

  const handleHost = () => {
    setView('table');
  };

  const handleJoin = (name) => {
    setPlayerName(name);
    socket.emit('join_game', name);
    setView('hand');
  };

  const handleStartGame = () => {
    socket.emit('start_game');
  };

  const handlePlayCard = (cardIndex, valueChoice) => {
    socket.emit('play_card', { cardIndex, valueChoice });
  };

  const handlePenalty = (targetId) => {
    socket.emit('assign_penalty', { targetId });
  };

  if (view === 'lobby') {
    return (
      <div className="relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-50 text-white bg-black/50 px-4 py-2 rounded hover:bg-black/70"
        >
          ← Back
        </button>
        <Lobby onHost={handleHost} onJoin={handleJoin} />
      </div>
    );
  }

  if (view === 'table') {
    return <GameTable gameState={gameState} onStartGame={handleStartGame} />;
  }

  if (view === 'hand') {
    return (
      <PlayerHand 
        gameState={gameState} 
        playerId={playerId} 
        onPlayCard={handlePlayCard} 
        onPenalty={handlePenalty}
      />
    );
  }

  return <div>Loading...</div>;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // home, 99

  if (currentScreen === 'home') {
    return <Home onSelectGame={(game) => setCurrentScreen(game)} />;
  }

  if (currentScreen === '99') {
    return <Game99 onBack={() => setCurrentScreen('home')} />;
  }

  return <div>Unknown Screen</div>;
}

export default App;

