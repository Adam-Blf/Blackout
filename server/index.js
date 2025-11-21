const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

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
// We need Jokers too. Let's add 2 Jokers to the deck.

let gameState = {
  players: [],
  deck: [],
  discardPile: [],
  currentCount: 0,
  direction: 1, // 1 or -1
  currentPlayerIndex: 0,
  gameStatus: 'waiting', // waiting, playing, gameover
  winner: null,
  message: "Waiting for players...",
  sipsToDistribute: 0,
  distributingPlayer: null
};

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

function getNextPlayerIndex() {
  let nextIndex = gameState.currentPlayerIndex + gameState.direction;
  if (nextIndex >= gameState.players.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = gameState.players.length - 1;
  return nextIndex;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send initial state
  socket.emit('game_state_update', gameState);

  socket.on('join_game', (playerName) => {
    const existingPlayer = gameState.players.find(p => p.id === socket.id);
    if (existingPlayer) return;

    const newPlayer = {
      id: socket.id,
      name: playerName || `Player ${gameState.players.length + 1}`,
      hand: [],
      sips: 0,
      isHost: gameState.players.length === 0
    };

    gameState.players.push(newPlayer);
    io.emit('game_state_update', gameState);
  });

  socket.on('start_game', () => {
    if (gameState.players.length < 2) { // Rules say 4+, but for dev allow 2
        // For strict rules: if (gameState.players.length < 4) return;
    }
    
    gameState.deck = createDeck();
    gameState.discardPile = [];
    gameState.currentCount = 0;
    gameState.direction = 1;
    gameState.currentPlayerIndex = 0;
    gameState.gameStatus = 'playing';
    gameState.winner = null;
    gameState.message = "Game Started! Count is 0.";
    gameState.sipsToDistribute = 0;

    // Deal 2 cards to each player
    gameState.players.forEach(player => {
      player.hand = [gameState.deck.pop(), gameState.deck.pop()];
      player.sips = 0;
    });

    io.emit('game_state_update', gameState);
  });

  socket.on('play_card', ({ cardIndex, valueChoice }) => {
    const player = gameState.players.find(p => p.id === socket.id);
    if (!player || gameState.gameStatus !== 'playing') return;
    if (gameState.players[gameState.currentPlayerIndex].id !== socket.id) return;

    const card = player.hand[cardIndex];
    let val = 0;
    let message = `${player.name} played ${card.value}`;

    // Logic
    if (card.value === 'Joker') {
        val = parseInt(valueChoice) || 0; // 1-9
        gameState.currentCount += val;
        message += ` (Value: ${val})`;
    } else if (card.value === 'A') {
        val = parseInt(valueChoice) || 1; // 1 or 11
        gameState.currentCount += val;
        message += ` (Value: ${val})`;
    } else if (card.value === 'K') {
        gameState.currentCount = 70;
        message += ` (Count set to 70)`;
    } else if (card.value === 'Q') {
        gameState.direction *= -1;
        message += ` (Direction Reversed)`;
    } else if (card.value === 'J') {
        gameState.currentCount -= 10;
        message += ` (-10)`;
    } else {
        val = parseInt(card.value);
        gameState.currentCount += val;
    }

    // Check bounds (optional, but usually count >= 0)
    if (gameState.currentCount < 0) gameState.currentCount = 0;

    // Remove card
    player.hand.splice(cardIndex, 1);
    gameState.discardPile.push(card);

    // Draw new card (Always have 2)
    if (gameState.deck.length === 0) {
        gameState.deck = shuffle([...gameState.discardPile]);
        gameState.discardPile = [];
    }
    player.hand.push(gameState.deck.pop());

    // Check Events
    // 1. Win Condition (99)
    if (gameState.currentCount === 99) {
        gameState.gameStatus = 'gameover';
        gameState.winner = player;
        gameState.message = `99! ${player.name} wins! Everyone else: CUL SEC!`;
        io.emit('game_state_update', gameState);
        return;
    }

    // 2. Multiple of 10
    if (gameState.currentCount > 0 && gameState.currentCount % 10 === 0) {
        const sips = Math.floor(gameState.currentCount / 10);
        message += ` | MULTIPLE OF 10! Distribute ${sips} sips!`;
        // We could add a state for distributing, but let's just notify for now
    }

    gameState.message = message;
    gameState.currentPlayerIndex = getNextPlayerIndex();

    io.emit('game_state_update', gameState);
  });

  socket.on('assign_penalty', ({ targetId }) => {
    const target = gameState.players.find(p => p.id === targetId);
    if (target) {
        target.sips += 2;
        gameState.message = `${target.name} penalized! +2 sips.`;
        io.emit('game_state_update', gameState);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    gameState.players = gameState.players.filter(p => p.id !== socket.id);
    if (gameState.players.length === 0) {
        gameState.gameStatus = 'waiting';
    }
    io.emit('game_state_update', gameState);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
