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
  const [roomCode, setRoomCode] = useState('');
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
    
    const onGameCreated = ({ roomCode, gameState }) => {
        setRoomCode(roomCode);
        setGameState(gameState);
        setView('table');
    };

    const onGameJoined = ({ roomCode, gameState }) => {
        setRoomCode(roomCode);
        setGameState(gameState);
        setView('hand');
    };

    const onError = (msg) => {
        alert(msg);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game_state_update', onGameState);
    socket.on('game_created', onGameCreated);
    socket.on('game_joined', onGameJoined);
    socket.on('error', onError);

    // If already connected
    if (socket.connected) {
      setIsConnected(true);
      setPlayerId(socket.id);
    }

    // Check for room in URL
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
        setRoomCode(roomParam);
        // If we have a room param, we might want to auto-join or pre-fill lobby
        // For now, let's just store it.
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game_state_update', onGameState);
      socket.off('game_created', onGameCreated);
      socket.off('game_joined', onGameJoined);
      socket.off('error', onError);
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
    socket.emit('create_game', 'Host');
  };

  const handleJoin = (name, code) => {
    setPlayerName(name);
    // If code is passed (manual entry), use it. Otherwise use state (from URL)
    const codeToUse = code || roomCode;
    if (!codeToUse) {
        alert("Please enter a room code");
        return;
    }
    socket.emit('join_game', { roomCode: codeToUse, playerName: name });
  };

  const handleStartGame = () => {
    socket.emit('start_game', roomCode);
  };

  const handlePlayCard = (cardIndex, valueChoice, declaredCount) => {
    socket.emit('play_card', { roomCode, cardIndex, valueChoice, declaredCount });
  };

  const handlePenalty = (targetId) => {
    socket.emit('assign_penalty', { roomCode, targetId });
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
        <Lobby 
            onHost={handleHost} 
            onJoin={handleJoin} 
            isMobile={isMobile} 
            initialRoomCode={roomCode}
        />
      </div>
    );
  }

  if (view === 'table') {
    return (
      <GameTable 
        gameState={gameState} 
        roomCode={roomCode}
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
        roomCode={roomCode}
        onPlayCard={handlePlayCard} 
        onPenalty={handlePenalty}
      />
    );
  }

  return <div>Loading...</div>;
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('home'); // home, 99

  useEffect(() => {
    // Check for URL parameters to auto-join a game
    const params = new URLSearchParams(window.location.search);
    const gameParam = params.get('game');
    
    if (gameParam === '99') {
      setCurrentScreen('99');
    }
  }, []);

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

