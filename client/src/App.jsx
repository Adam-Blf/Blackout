import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Lobby from './components/Lobby';
import GameTable from './components/GameTable';
import PlayerHand from './components/PlayerHand';
import Home from './components/Home';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useDeviceDetect } from './hooks/useDeviceDetect';

// Connect to server (assume localhost:3001 for dev, or relative for prod)
const SERVER_URL = import.meta.env.VITE_SERVER_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '/');
const socket = io(SERVER_URL, {
  reconnectionAttempts: 5,
  timeout: 10000,
  autoConnect: true
});

function Game99({ onBack }) {
  const [view, setView] = useState('lobby'); // lobby, table, hand
  const [gameState, setGameState] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { isMobile } = useDeviceDetect();
  const { t } = useLanguage();

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setPlayerId(socket.id);
    };
    const onDisconnect = () => setIsConnected(false);
    const onGameState = (state) => setGameState(state);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game_state_update', onGameState);

    // If already connected
    if (socket.connected) {
      setIsConnected(true);
      setPlayerId(socket.id);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game_state_update', onGameState);
    };
  }, []);

  // Auto-redirect based on device if in lobby
  useEffect(() => {
    if (view === 'lobby' && isMobile) {
      // Optional: Auto-select 'join' mode or just show lobby with mobile optimization
      // For now, we keep the lobby but maybe highlight the join button
    }
  }, [isMobile, view]);

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
          ← {t('lobby.back')}
        </button>
        <Lobby onHost={handleHost} onJoin={handleJoin} isMobile={isMobile} />
      </div>
    );
  }

  if (view === 'table') {
    return (
      <GameTable 
        gameState={gameState} 
        onStartGame={handleStartGame} 
        isConnected={isConnected}
        onBack={() => setView('lobby')}
      />
    );
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

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('home'); // home, 99

  if (currentScreen === 'home') {
    return <Home onSelectGame={(game) => setCurrentScreen(game)} />;
  }

  if (currentScreen === '99') {
    return <Game99 onBack={() => setCurrentScreen('home')} />;
  }

  return <div>Unknown Screen</div>;
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;

