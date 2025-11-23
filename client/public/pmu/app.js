/**
 * PMU Game - Jeu d'alcool avec cartes
 * Author: Adam Beloucif
 */

// ============================================
// GAME STATE
// ============================================
const gameState = {
    settings: {
        playerCount: 4,
        sipsPerPlayer: 5,
        raceLength: 7,
        bonusEnabled: false
    },
    players: [],
    horses: {
        spade: { name: '♠️ Pique', position: 0, color: 'black' },
        heart: { name: '♥️ Cœur', position: 0, color: 'red' },
        diamond: { name: '♦️ Carreau', position: 0, color: 'red' },
        club: { name: '♣️ Trèfle', position: 0, color: 'black' }
    },
    deck: [],
    cardCount: 0,
    raceActive: false,
    currentPlayer: 0,
    bonusAsked: false,
    winner: null,
    stats: {
        racesPlayed: 0,
        spadeWins: 0,
        heartWins: 0,
        diamondWins: 0,
        clubWins: 0
    }
};

// ============================================
// THEME MANAGEMENT
// ============================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Check local storage
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        localStorage.setItem('theme', 'dark');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// ============================================
// SETTINGS FUNCTIONS
// ============================================
function changePlayerCount(delta) {
    const input = document.getElementById('playerCount');
    let value = parseInt(input.value) + delta;
    value = Math.max(2, Math.min(8, value));
    input.value = value;
    gameState.settings.playerCount = value;
}

function changeSips(delta) {
    const input = document.getElementById('sipsPerPlayer');
    let value = parseInt(input.value) + delta;
    value = Math.max(5, Math.min(50, value));
    input.value = value;
    gameState.settings.sipsPerPlayer = value;
}

function changeRaceLength(delta) {
    const input = document.getElementById('raceLength');
    let value = parseInt(input.value) + delta;
    value = Math.max(5, Math.min(12, value));
    input.value = value;
    gameState.settings.raceLength = value;
}

// ============================================
// GAME INITIALIZATION
// ============================================
function startGame() {
    // Get settings
    gameState.settings.bonusEnabled = document.getElementById('bonusEnabled').checked;
    
    // Initialize players
    gameState.players = [];
    for (let i = 0; i < gameState.settings.playerCount; i++) {
        gameState.players.push({
            name: `Joueur ${i + 1}`,
            sipsRemaining: gameState.settings.sipsPerPlayer,
            bets: { spade: 0, heart: 0, diamond: 0, club: 0 },
            bonusBet: null
        });
    }
    
    // Initialize deck
    initializeDeck();
    
    // Reset horses
    Object.keys(gameState.horses).forEach(horse => {
        gameState.horses[horse].position = 0;
    });
    
    gameState.cardCount = 0;
    gameState.bonusAsked = false;
    gameState.winner = null;
    gameState.raceActive = true;
    gameState.currentPlayer = 0;
    
    // Show game board
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'grid';
    
    // Render game
    renderRaceTrack();
    renderPlayerTabs();
    renderBettingPanel();
    updateDeckCount();
}

function initializeDeck() {
    const suits = ['spade', 'heart', 'diamond', 'club'];
    gameState.deck = [];
    
    // Create deck (13 cards × 4 suits = 52 cards)
    for (let i = 0; i < 13; i++) {
        for (let suit of suits) {
            gameState.deck.push(suit);
        }
    }
    
    // Shuffle
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
}

// ============================================
// RACE TRACK RENDERING
// ============================================
function renderRaceTrack() {
    const track = document.getElementById('raceTrack');
    track.innerHTML = '';
    
    const horses = ['spade', 'heart', 'diamond', 'club'];
    
    horses.forEach(horseKey => {
        const lane = document.createElement('div');
        lane.className = 'horse-lane';
        
        // Horse icon
        const icon = document.createElement('div');
        icon.className = 'horse-icon';
        icon.innerHTML = gameState.horses[horseKey].name.split(' ')[0];
        icon.style.color = gameState.horses[horseKey].color;
        lane.appendChild(icon);
        
        // Slots
        for (let i = 0; i < gameState.settings.raceLength; i++) {
            const slot = document.createElement('div');
            slot.className = 'slot';
            
            if (i === gameState.settings.raceLength - 1) {
                slot.classList.add('finish-line');
                slot.innerHTML = '🏁';
            }
            
            // Check if horse is in this slot
            if (gameState.horses[horseKey].position === i + 1) {
                slot.classList.add('active');
                slot.innerHTML = gameState.horses[horseKey].name.split(' ')[0];
                slot.style.color = gameState.horses[horseKey].color;
            }
            
            lane.appendChild(slot);
        }
        
        track.appendChild(lane);
    });
}

// ============================================
// PLAYER TABS & BETTING
// ============================================
function renderPlayerTabs() {
    const tabs = document.getElementById('playerTabs');
    tabs.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const tab = document.createElement('div');
        tab.className = 'player-tab' + (index === gameState.currentPlayer ? ' active' : '');
        tab.textContent = player.name;
        tab.onclick = () => switchPlayer(index);
        tabs.appendChild(tab);
    });
}

function switchPlayer(index) {
    gameState.currentPlayer = index;
    renderPlayerTabs();
    renderBettingPanel();
}

function renderBettingPanel() {
    const content = document.getElementById('bettingContent');
    const player = gameState.players[gameState.currentPlayer];
    
    content.innerHTML = '';
    
    const horses = [
        { key: 'spade', name: '♠️ Pique', color: 'black' },
        { key: 'heart', name: '♥️ Cœur', color: 'red' },
        { key: 'diamond', name: '♦️ Carreau', color: 'red' },
        { key: 'club', name: '♣️ Trèfle', color: 'black' }
    ];
    
    horses.forEach(horse => {
        const row = document.createElement('div');
        row.className = 'bet-row';
        
        const label = document.createElement('div');
        label.className = 'bet-label';
        label.innerHTML = `<span style="color: ${horse.color}">${horse.name}</span>`;
        
        const controls = document.createElement('div');
        controls.className = 'bet-controls';
        
        const btnMinus = document.createElement('button');
        btnMinus.className = 'btn btn-sm btn-secondary';
        btnMinus.textContent = '-';
        btnMinus.onclick = () => changeBet(horse.key, -1);
        
        const value = document.createElement('div');
        value.className = 'bet-value';
        value.textContent = player.bets[horse.key];
        value.id = `bet-${horse.key}`;
        
        const btnPlus = document.createElement('button');
        btnPlus.className = 'btn btn-sm btn-primary';
        btnPlus.textContent = '+';
        btnPlus.onclick = () => changeBet(horse.key, 1);
        
        controls.appendChild(btnMinus);
        controls.appendChild(value);
        controls.appendChild(btnPlus);
        
        row.appendChild(label);
        row.appendChild(controls);
        content.appendChild(row);
    });
    
    // Sips remaining
    const sipsDiv = document.createElement('div');
    sipsDiv.className = 'sips-remaining';
    sipsDiv.id = 'sipsRemaining';
    sipsDiv.innerHTML = `Points restants: <strong>${player.sipsRemaining}</strong>`;
    content.appendChild(sipsDiv);
}

function changeBet(horseKey, delta) {
    const player = gameState.players[gameState.currentPlayer];
    const newValue = player.bets[horseKey] + delta;
    
    // Calculate total bets
    const totalBets = Object.values(player.bets).reduce((sum, val) => sum + val, 0) - player.bets[horseKey] + newValue;
    
    // Check constraints
    if (newValue < 0 || totalBets > gameState.settings.sipsPerPlayer) {
        return;
    }
    
    player.bets[horseKey] = newValue;
    player.sipsRemaining = gameState.settings.sipsPerPlayer - totalBets;
    
    // Update display
    document.getElementById(`bet-${horseKey}`).textContent = newValue;
    document.getElementById('sipsRemaining').innerHTML = `Points restants: <strong>${player.sipsRemaining}</strong>`;
}

// ============================================
// GAME LOGIC
// ============================================
function drawCard() {
    if (!gameState.raceActive || gameState.deck.length === 0) {
        return;
    }
    
    // Draw card
    const suit = gameState.deck.pop();
    gameState.cardCount++;
    
    // Move horse
    gameState.horses[suit].position++;
    
    // Update display
    renderRaceTrack();
    updateCardCount();
    updateDeckCount();
    
    // Check for bonus moment
    if (gameState.settings.bonusEnabled && gameState.cardCount === 5 && !gameState.bonusAsked) {
        gameState.bonusAsked = true;
        document.getElementById('bonusSection').style.display = 'block';
        document.getElementById('drawBtn').disabled = true;
        return;
    }
    
    // Check for winner
    checkWinner();
}

function updateCardCount() {
    document.getElementById('cardCount').textContent = gameState.cardCount;
}

function updateDeckCount() {
    document.getElementById('deckCount').textContent = gameState.deck.length;
}

function checkWinner() {
    const horses = Object.keys(gameState.horses);
    
    for (let horseKey of horses) {
        if (gameState.horses[horseKey].position >= gameState.settings.raceLength) {
            gameState.winner = horseKey;
            gameState.raceActive = false;
            showWinner();
            break;
        }
    }
}

// ============================================
// BONUS SYSTEM
// ============================================
function placeBonus(horseKey) {
    const player = gameState.players[gameState.currentPlayer];
    
    if (player.bonusBet) {
        alert('Vous avez déjà placé votre bonus!');
        return;
    }
    
    player.bonusBet = horseKey;
    alert(`Bonus de 3 points placé sur ${gameState.horses[horseKey].name}!`);
    
    // Check if all players who want to bet have done so
    // For simplicity, we ask each player one by one
    gameState.currentPlayer++;
    
    if (gameState.currentPlayer < gameState.players.length) {
        renderPlayerTabs();
        renderBettingPanel();
    } else {
        // All players have had their turn
        document.getElementById('bonusSection').style.display = 'none';
        document.getElementById('drawBtn').disabled = false;
        gameState.currentPlayer = 0;
        renderPlayerTabs();
        renderBettingPanel();
    }
}

// ============================================
// WINNER MODAL
// ============================================
function showWinner() {
    const modal = document.getElementById('winnerModal');
    const horseDiv = document.getElementById('winnerHorse');
    const detailsDiv = document.getElementById('winnerDetails');
    
    const winnerHorse = gameState.horses[gameState.winner];
    
    horseDiv.innerHTML = `${winnerHorse.name}`;
    horseDiv.style.color = winnerHorse.color;
    
    // Calculate distributions
    let details = '<h3>Résultats des points:</h3>';
    
    gameState.players.forEach(player => {
        const bet = player.bets[gameState.winner];
        const bonusWin = player.bonusBet === gameState.winner;
        const bonusLoss = player.bonusBet && player.bonusBet !== gameState.winner;
        
        if (bet > 0 || bonusWin) {
            let sips = bet;
            if (bonusWin) sips += 3;
            details += `<p><strong>${player.name}</strong> gagne <strong>${sips}</strong> points!</p>`;
        }
        
        if (bonusLoss) {
            details += `<p><strong>${player.name}</strong> perd <strong>6</strong> points (bonus perdu)!</p>`;
        }
    });
    
    detailsDiv.innerHTML = details;
    
    // Update stats
    gameState.stats.racesPlayed++;
    gameState.stats[`${gameState.winner}Wins`]++;
    updateStatistics();
    
    modal.classList.add('show');
}

function closeWinnerModal() {
    document.getElementById('winnerModal').classList.remove('show');
}

function updateStatistics() {
    document.getElementById('racesPlayed').textContent = gameState.stats.racesPlayed;
    document.getElementById('spadeWins').textContent = gameState.stats.spadeWins;
    document.getElementById('heartWins').textContent = gameState.stats.heartWins;
    document.getElementById('diamondWins').textContent = gameState.stats.diamondWins;
    document.getElementById('clubWins').textContent = gameState.stats.clubWins;
}

// ============================================
// GAME CONTROLS
// ============================================
function newRace() {
    if (gameState.raceActive) {
        if (!confirm('La course est en cours. Voulez-vous vraiment recommencer?')) {
            return;
        }
    }
    
    // Reset for new race
    initializeDeck();
    
    Object.keys(gameState.horses).forEach(horse => {
        gameState.horses[horse].position = 0;
    });
    
    gameState.players.forEach(player => {
        player.sipsRemaining = gameState.settings.sipsPerPlayer;
        player.bets = { spade: 0, heart: 0, diamond: 0, club: 0 };
        player.bonusBet = null;
    });
    
    gameState.cardCount = 0;
    gameState.bonusAsked = false;
    gameState.winner = null;
    gameState.raceActive = true;
    gameState.currentPlayer = 0;
    
    document.getElementById('bonusSection').style.display = 'none';
    document.getElementById('drawBtn').disabled = false;
    
    renderRaceTrack();
    renderPlayerTabs();
    renderBettingPanel();
    updateCardCount();
    updateDeckCount();
    
    closeWinnerModal();
}

function backToSettings() {
    if (gameState.raceActive) {
        if (!confirm('La course est en cours. Voulez-vous vraiment retourner aux réglages?')) {
            return;
        }
    }
    
    document.getElementById('gameBoard').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'block';
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    if (gameState.raceActive && e.key === ' ') {
        e.preventDefault();
        drawCard();
    }
});

// ============================================
// INITIALIZE ON LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏇 PMU Game initialized!');
});
