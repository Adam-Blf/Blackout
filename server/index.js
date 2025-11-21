const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

// Health Check
app.get('/', (req, res) => {
  res.send('Blackout Server is Running');
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://adam:123@99.9kaqkae.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Game Schema
const gameSchema = new mongoose.Schema({
  roomCode: String,
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  winner: String,
  players: [{
    name: String,
    errors: Number,
    sips: Number
  }]
});

const GameModel = mongoose.model('Game', gameSchema);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Game Constants
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Store multiple games
const games = {};

function createDeck() {
  const deck = [];
  for (let suit of SUITS) {
    for (let value of VALUES) {
      deck.push({ suit, value, type: 'standard' });
    }
  }
  // Add 2 Jokers
  deck.push({ suit: '★', value: 'Joker', type: 'joker', id: 'j1' });
  deck.push({ suit: '★', value: 'Joker', type: 'joker', id: 'j2' });
  return shuffle(deck);
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function getNextPlayerIndex(game) {
  let nextIndex = game.currentPlayerIndex + game.direction;
  if (nextIndex >= game.players.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = game.players.length - 1;
  return nextIndex;
}

function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_game', (playerName) => {
    const roomCode = generateRoomCode();
    games[roomCode] = {
      roomCode,
      hostId: socket.id,
      players: [],
      deck: [],
      discardPile: [],
      currentCount: 0,
      direction: 1,
      currentPlayerIndex: 0,
      gameStatus: 'waiting',
      winner: null,
      message: "Waiting for players...",
      sipsToDistribute: 0,
      distributingPlayer: null,
      lastActivity: Date.now()
    };

    socket.join(roomCode);
    
    // Host is no longer a player
    
    socket.emit('game_created', { roomCode, gameState: games[roomCode] });
    io.to(roomCode).emit('game_state_update', games[roomCode]);
  });

  socket.on('join_game', ({ roomCode, playerName }) => {
    const game = games[roomCode];
    if (!game) {
      socket.emit('error', 'Game not found');
      return;
    }

    const existingPlayer = game.players.find(p => p.id === socket.id);
    if (existingPlayer) {
        socket.emit('game_joined', { roomCode, gameState: game });
        return;
    }

    socket.join(roomCode);

    const newPlayer = {
      id: socket.id,
      name: playerName || `Player ${game.players.length + 1}`,
      hand: [],
      sips: 0,
      penalties: 0,
      isHost: false
    };

    game.players.push(newPlayer);
    
    socket.emit('game_joined', { roomCode, gameState: game });
    io.to(roomCode).emit('game_state_update', game);
  });

  socket.on('request_game_state', (roomCode) => {
    if (roomCode && games[roomCode]) {
        socket.emit('game_state_update', games[roomCode]);
    }
  });

  socket.on('start_game', (roomCode) => {
    const game = games[roomCode];
    if (!game) return;

    // Check if sender is host
    if (game.hostId !== socket.id) return;

    if (game.players.length < 2) { 
        // For strict rules: if (game.players.length < 4) return;
    }
    
    game.deck = createDeck();
    game.discardPile = [];
    game.currentCount = 0;
    game.direction = 1;
    game.currentPlayerIndex = 0;
    game.gameStatus = 'playing';
    game.winner = null;
    game.message = "Game Started! Count is 0.";
    game.sipsToDistribute = 0;

    // Deal 2 cards to each player
    game.players.forEach(p => {
      p.hand = [game.deck.pop(), game.deck.pop()];
      p.sips = 0;
      p.penalties = 0;
    });

    io.to(roomCode).emit('game_state_update', game);
  });

  socket.on('play_card', ({ roomCode, cardIndex, valueChoice, declaredCount }) => {
    const game = games[roomCode];
    if (!game) return;

    const player = game.players.find(p => p.id === socket.id);
    if (!player || game.gameStatus !== 'playing') return;
    if (game.players[game.currentPlayerIndex].id !== socket.id) return;

    const card = player.hand[cardIndex];
    let val = 0;
    let message = `${player.name} played ${card.value}`;
    
    // Calculate theoretical new count
    let newCount = game.currentCount;
    let direction = game.direction;

    // Logic
    if (card.value === 'Joker') {
        val = parseInt(valueChoice) || 0; // 1-9
        newCount += val;
        message += ` (Value: ${val})`;
    } else if (card.value === 'A') {
        val = parseInt(valueChoice) || 1; // 1 or 11
        newCount += val;
        message += ` (Value: ${val})`;
    } else if (card.value === 'K') {
        newCount = 70;
        message += ` (Count set to 70)`;
    } else if (card.value === 'Q') {
        direction *= -1;
        message += ` (Direction Reversed)`;
    } else if (card.value === 'J') {
        newCount -= 10;
        message += ` (-10)`;
    } else {
        val = parseInt(card.value);
        newCount += val;
    }

    // Check bounds
    if (newCount < 0) newCount = 0;

    // Verify Declared Count
    const parsedDeclared = parseInt(declaredCount);
    if (isNaN(parsedDeclared) || parsedDeclared !== newCount) {
        // player.sips += 1; // Don't assign sips yet
        player.penalties += 1;
        message += ` | WRONG COUNT! (Said ${parsedDeclared}, was ${newCount})`;
    }

    // Apply changes
    game.currentCount = newCount;
    game.direction = direction;

    // Remove card
    player.hand.splice(cardIndex, 1);
    game.discardPile.push(card);

    // Draw new card (Always have 2)
    if (game.deck.length === 0) {
        game.deck = shuffle([...game.discardPile]);
        game.discardPile = [];
    }
    player.hand.push(game.deck.pop());

    // Check Events
    // 1. Win Condition (99)
    if (game.currentCount === 99) {
        game.gameStatus = 'gameover';
        game.winner = player;
        
        // Distribute sips based on penalties
        game.players.forEach(p => {
            p.sips += p.penalties; // 1 sip per error
        });

        game.message = `99! ${player.name} wins! Everyone else: CUL SEC!`;
        
        // Save to MongoDB
        const gameRecord = new GameModel({
            roomCode: game.roomCode,
            endTime: new Date(),
            winner: player.name,
            players: game.players.map(p => ({
                name: p.name,
                errors: p.penalties,
                sips: p.sips
            }))
        });
        gameRecord.save().catch(err => console.error('Error saving game:', err));

        io.to(roomCode).emit('game_state_update', game);
        return;
    }

    // 2. Multiple of 10
    if (game.currentCount > 0 && game.currentCount % 10 === 0) {
        const sips = Math.floor(game.currentCount / 10);
        message += ` | MULTIPLE OF 10! Distribute ${sips} sips!`;
    }

    game.message = message;
    game.currentPlayerIndex = getNextPlayerIndex(game);
    game.lastActivity = Date.now();

    io.to(roomCode).emit('game_state_update', game);
  });

  socket.on('assign_penalty', ({ roomCode, targetId }) => {
    const game = games[roomCode];
    if (!game) return;

    const target = game.players.find(p => p.id === targetId);
    if (target) {
        target.sips += 2;
        game.message = `${target.name} penalized! +2 sips.`;
        io.to(roomCode).emit('game_state_update', game);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Find which game the user was in
    for (const roomCode in games) {
        const game = games[roomCode];
        
        if (game.hostId === socket.id) {
            // Host disconnected, end game
            delete games[roomCode];
            io.to(roomCode).emit('error', 'Host disconnected. Game ended.');
            break;
        }

        const playerIndex = game.players.findIndex(p => p.id === socket.id);
        
        if (playerIndex !== -1) {
            game.players.splice(playerIndex, 1);
            if (game.players.length === 0) {
                // Delete empty game immediately
                delete games[roomCode];
            } else {
                io.to(roomCode).emit('game_state_update', game);
            }
            break;
        }
    }
  });
});

// Cleanup inactive games every 30 minutes
setInterval(() => {
    const now = Date.now();
    for (const roomCode in games) {
        if (now - games[roomCode].lastActivity > 30 * 60 * 1000) {
            console.log(`Cleaning up inactive game: ${roomCode}`);
            delete games[roomCode];
        }
    }
}, 30 * 60 * 1000);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
