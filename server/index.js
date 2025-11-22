const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// --- Keep Alive ---
app.get('/keep-alive', (req, res) => {
    res.send('Server is alive');
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for local mobile testing
        methods: ["GET", "POST"]
    }
});

// --- Game State (In-Memory) ---
const games = {};

// --- Deck Logic ---
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck() {
    let deck = [];
    for (let s of SUITS) {
        for (let v of VALUES) {
            deck.push({ suit: s, value: v });
        }
    }
    return shuffle(deck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Helper Functions ---
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getNextPlayer(game) {
    let idx = game.currentPlayerIndex + game.direction;
    if (idx >= game.players.length) idx = 0;
    if (idx < 0) idx = game.players.length - 1;
    return idx;
}

// --- Socket Logic ---
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // 1. Create Game (Host)
    socket.on('create_game', () => {
        const roomCode = generateRoomCode();
        games[roomCode] = {
            roomCode,
            hostId: socket.id,
            players: [], // { id, name, hand, avatar }
            deck: [],
            discardPile: [],
            currentCount: 0,
            direction: 1, // 1 or -1
            currentPlayerIndex: 0,
            status: 'waiting', // waiting, playing, gameover
            winner: null,
            message: 'Waiting for players...'
        };
        socket.join(roomCode);
        socket.emit('game_created', games[roomCode]);
        console.log(`Game created: ${roomCode}`);
    });

    // 2. Join Game (Player)
    socket.on('join_game', ({ roomCode, name }) => {
        const room = roomCode?.toUpperCase();
        const game = games[room];

        if (!game) {
            socket.emit('error', 'Room not found');
            return;
        }
        if (game.status !== 'waiting') {
            socket.emit('error', 'Game already started');
            return;
        }
        if (game.players.find(p => p.name === name)) {
            socket.emit('error', 'Name taken');
            return;
        }

        const newPlayer = {
            id: socket.id,
            name: name || `Player ${game.players.length + 1}`,
            hand: [],
            lives: 3
        };

        game.players.push(newPlayer);
        socket.join(room);

        // Notify everyone
        io.to(room).emit('game_updated', game);
        socket.emit('joined_success', { playerId: socket.id, roomCode: room });
        console.log(`${name} joined ${room}`);
    });

    // 3. Start Game
    socket.on('start_game', (roomCode) => {
        const game = games[roomCode];
        if (!game) return;
        if (game.hostId !== socket.id) return; // Only host can start

        game.deck = createDeck();
        game.status = 'playing';
        game.currentCount = 0;
        game.direction = 1;
        game.currentPlayerIndex = 0;
        game.message = "Game Started! Count is 0.";

        // Deal 3 cards to each player
        game.players.forEach(p => {
            p.hand = [game.deck.pop(), game.deck.pop(), game.deck.pop()];
        });

        io.to(roomCode).emit('game_updated', game);
    });

    // 4. Play Card
    socket.on('play_card', ({ roomCode, card, valueChoice }) => {
        const game = games[roomCode];
        if (!game) return;
        
        const player = game.players.find(p => p.id === socket.id);
        if (!player) return;

        // Check turn
        if (game.players[game.currentPlayerIndex].id !== socket.id) return;

        // Game Logic
        let val = 0;
        let msg = `${player.name} played ${card.value}`;

        // MGMF & 99 Rules
        if (card.value === '4') {
            // Prisonnier (Skip/Reverse)
            val = 0;
            game.direction *= -1;
            msg += " (Reverse)";
        } else if (card.value === '9') {
            // Pass
            val = 0;
            msg += " (Pass)";
        } else if (card.value === '10') {
            // Héro (Save/Minus)
            val = -10;
            msg += " (-10)";
        } else if (card.value === 'K') {
            // Dieu (God) - Set to 99
            game.currentCount = 99;
            val = 0; 
            msg += " (Dieu: Set to 99)";
        } else if (card.value === 'A') {
            val = valueChoice === 1 ? 1 : 11;
            msg += ` (+${val})`;
        } else if (card.value === '5') {
            // Aubergiste (+/- 5)
            val = valueChoice === -5 ? -5 : 5;
            msg += ` (Aubergiste: ${val > 0 ? '+' : ''}${val})`;
        } else if (card.value === 'J') {
            // Oracle (Peek)
            val = 0;
            msg += " (Oracle: Peeking)";
            // Send top 3 cards to player
            const top3 = game.deck.slice(-3).map(c => `${c.value}${c.suit}`);
            io.to(socket.id).emit('oracle_vision', top3);
        } else if (card.value === 'Q') {
            // Princesse (Swap Hands)
            val = 0;
            msg += " (Princesse: Swapped Hands)";
            // Swap with next player
            const nextIdx = getNextPlayer(game);
            const nextPlayer = game.players[nextIdx];
            const myHand = [...player.hand];
            // Remove the played card first (it will be removed later in code, but we need to swap the REST)
            // Actually, the played card is removed at the end of this function.
            // So we should swap NOW, but keep the played card in "my" hand logic so it can be removed?
            // No, better to swap everything EXCEPT the played card.
            // Or simpler: Swap hands, then remove the played card from the new hand? No, that's wrong.
            // Correct logic: Remove played card from current hand FIRST, then swap.
            
            // Let's do the remove logic here manually for Queen to avoid issues
            const handIdx = player.hand.findIndex(c => c.suit === card.suit && c.value === card.value);
            if (handIdx > -1) {
                player.hand.splice(handIdx, 1);
                game.discardPile.push(card);
            }
            
            // Now swap
            const tempHand = [...player.hand];
            player.hand = [...nextPlayer.hand];
            nextPlayer.hand = tempHand;
            
            // Skip the standard remove/draw logic for Queen since we handled it?
            // We still need to draw a card for the current player to replace the played one?
            // Usually in 99 you draw after playing.
            // So: Remove card -> Swap -> Draw.
            // If I swap, I get next player's hand (which has 3 cards).
            // My hand (now next player's) has 2 cards.
            // I draw 1 card. My hand (was next player's) becomes 4? No.
            // Let's say:
            // Me: [Q, A, 2]. Next: [5, 6, 7].
            // Play Q. Me: [A, 2].
            // Swap. Me: [5, 6, 7]. Next: [A, 2].
            // Draw. Me: [5, 6, 7, New]. (4 cards).
            // Next player has 2 cards.
            // This messes up hand sizes.
            // Maybe Princesse swaps the *entire* hand including the played card? No, played card is played.
            // Let's assume: Swap hands. Then I draw.
            // So I end up with NextPlayerHand + 1 card. NextPlayer ends up with MyOldHand (minus Q).
            // This is fine, it's a chaotic card.
            
            // To avoid double removal, I'll set a flag or return early?
            // I'll just let the standard logic run, but I need to be careful.
            // Standard logic: finds card in `player.hand`.
            // If I swap now, `player.hand` is different. The card `Q` is NOT in `player.hand` anymore (it's in next player's hand if I didn't remove it).
            // So I MUST remove it first.
            
            // ALREADY REMOVED ABOVE.
            // Now I need to prevent the standard logic from trying to remove it again.
            // I will set a flag `cardProcessed = true`.
        } else {
            val = parseInt(card.value);
        }

        // Update Count (if not King/Oracle/Princesse/Special 0s)
        if (card.value !== 'K') {
            game.currentCount += val;
        }
        
        // Ensure count doesn't go below 0
        if (game.currentCount < 0) game.currentCount = 0;

        // Check Loss (MGMF: End at 100+)
        if (game.currentCount >= 100) {
            msg = `${player.name} reached ${game.currentCount}! GAME OVER.`;
            player.lives = 0; // Eliminate immediately
            
            // End the game immediately as requested ("fin a la partie")
            game.status = 'gameover';
            // Who won? Everyone else? Or just "Game Over"?
            // Usually last man standing.
            // If I eliminate this player, are there others?
            const survivors = game.players.filter(p => p.lives > 0);
            if (survivors.length === 1) {
                game.winner = survivors[0].name;
            } else {
                // If multiple survivors, maybe just end it?
                // User said "mette fin a la partie".
                // I'll declare the previous player (who didn't bust) as winner?
                // Or just "No Winner"?
                // Let's stick to standard: Eliminate player. If only 1 left, they win.
                // If multiple left, reset round.
                // BUT user said "mette fin a la partie".
                // I will force Game Over.
                game.winner = "Nobody (Busted)"; 
                // Or maybe the last person who played safely?
                // Let's just set status to gameover.
            }
        } else {
            // Next player
            game.currentPlayerIndex = getNextPlayer(game);
            
            // Standard Remove/Draw Logic (Skip if Queen handled it)
            if (card.value !== 'Q') {
                const handIdx = player.hand.findIndex(c => c.suit === card.suit && c.value === card.value);
                if (handIdx > -1) {
                    player.hand.splice(handIdx, 1);
                    game.discardPile.push(card);
                }
            }

            // Draw card
            if (game.deck.length === 0) {
                game.deck = shuffle([...game.discardPile]);
                game.discardPile = [];
            }
            player.hand.push(game.deck.pop());
        }

        game.message = msg;
        io.to(roomCode).emit('game_updated', game);
    });

    socket.on('disconnect', () => {
        // Handle disconnects (optional for now)
        console.log('User disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);

    // Ping itself every 14 minutes
    const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000;
    setInterval(() => {
        http.get(`http://localhost:${PORT}/keep-alive`, (res) => {
            // console.log(`Keep-alive ping status: ${res.statusCode}`);
        }).on('error', (e) => {
            console.error(`Keep-alive ping error: ${e.message}`);
        });
    }, KEEP_ALIVE_INTERVAL);
});
