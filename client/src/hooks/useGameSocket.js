import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '/');

export const useGameSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [error, setError] = useState(null);
  const [view, setView] = useState('lobby'); // lobby, table, hand

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      reconnectionAttempts: 5,
      timeout: 10000,
      autoConnect: true
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      setIsConnected(true);
      setPlayerId(socket.id);
      setError(null);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setError('Disconnected from server');
    };

    const onGameState = (state) => {
      setGameState(state);
    };

    const onGameCreated = ({ roomCode, gameState }) => {
      setRoomCode(roomCode);
      setGameState(gameState);
      setView('table');
      setError(null);
    };

    const onGameJoined = ({ roomCode, gameState }) => {
      setRoomCode(roomCode);
      setGameState(gameState);
      setView('hand');
      setError(null);
    };

    const onError = (msg) => {
      setError(msg);
      // Auto-clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game_state_update', onGameState);
    socket.on('game_created', onGameCreated);
    socket.on('game_joined', onGameJoined);
    socket.on('error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game_state_update', onGameState);
      socket.off('game_created', onGameCreated);
      socket.off('game_joined', onGameJoined);
      socket.off('error', onError);
    };
  }, [socket]);

  // Actions
  const createGame = useCallback(() => {
    if (socket) socket.emit('create_game', 'Host');
  }, [socket]);

  const joinGame = useCallback((name, code) => {
    if (socket) socket.emit('join_game', { roomCode: code, playerName: name });
  }, [socket]);

  const startGame = useCallback(() => {
    if (socket && roomCode) socket.emit('start_game', roomCode);
  }, [socket, roomCode]);

  const playCard = useCallback((cardIndex, valueChoice, declaredCount) => {
    if (socket && roomCode) {
      socket.emit('play_card', { roomCode, cardIndex, valueChoice, declaredCount });
    }
  }, [socket, roomCode]);

  const assignPenalty = useCallback((targetId) => {
    if (socket && roomCode) {
      socket.emit('assign_penalty', { roomCode, targetId });
    }
  }, [socket, roomCode]);

  const resetView = useCallback(() => {
    setView('lobby');
    setGameState(null);
    setRoomCode('');
  }, []);

  return {
    socket,
    isConnected,
    gameState,
    roomCode,
    playerId,
    error,
    view,
    actions: {
      createGame,
      joinGame,
      startGame,
      playCard,
      assignPenalty,
      resetView
    }
  };
};
