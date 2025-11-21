import React, { useState, useEffect } from 'react';
import Lobby from './components/Lobby';
import GameTable from './components/GameTable';
import PlayerHand from './components/PlayerHand';
import Home from './components/Home';
import Toast from './components/ui/Toast';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useDeviceDetect } from './hooks/useDeviceDetect';
import { useGameSocket } from './hooks/useGameSocket';

function Game99({ onBack }) {
  const { 
    isConnected, 
    gameState, 
    roomCode, 
    playerId, 
    error, 
    view, 
    actions 
  } = useGameSocket();
  
  const { isMobile } = useDeviceDetect();
  const { t } = useLanguage();
  const [localError, setLocalError] = useState(null);

  // Sync socket error to local toast
  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  // Check for room in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    // Note: We could auto-fill the lobby input here if we exposed a setter, 
    // but for now we just let the user type it or we could pass it to Lobby.
  }, []);

  const handleBack = () => {
    actions.resetView();
    onBack();
  };

  if (view === 'lobby') {
    return (
      <div className="relative">
        <Toast message={localError} onClose={() => setLocalError(null)} />
        <button 
          onClick={handleBack}
          className="absolute top-4 left-4 z-50 text-white bg-black/50 px-4 py-2 rounded hover:bg-black/70 backdrop-blur-sm border border-white/10 transition-colors"
        >
          ← {t('lobby.back')}
        </button>
        <Lobby 
            onHost={actions.createGame} 
            onJoin={actions.joinGame} 
            isMobile={isMobile} 
            initialRoomCode={roomCode}
            isConnected={isConnected}
        />
      </div>
    );
  }

  if (view === 'table') {
    return (
      <>
        <Toast message={localError} onClose={() => setLocalError(null)} />
        <GameTable 
          gameState={gameState} 
          roomCode={roomCode}
          onStartGame={actions.startGame} 
          isConnected={isConnected}
          onBack={actions.resetView}
        />
      </>
    );
  }

  if (view === 'hand') {
    return (
      <>
        <Toast message={localError} onClose={() => setLocalError(null)} />
        <PlayerHand 
          gameState={gameState} 
          playerId={playerId} 
          roomCode={roomCode}
          onPlayCard={actions.playCard} 
          onPenalty={actions.assignPenalty}
        />
      </>
    );
  }

  return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
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


