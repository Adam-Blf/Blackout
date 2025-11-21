# Le 99 / The 99 - Drinking Game

## 🇬🇧 English

### Description

A digital version of the famous card game "99" adapted as a drinking game. Players take turns playing cards to add to a central count. The goal is to avoid making the count go over 99.

### Rules

- **Objective**: Do not be the player who makes the count exceed 99.
- **Setup**: Each player starts with 3 cards.
- **Gameplay**:
  - Play a card, add its value to the count.
  - Draw a new card.
  - If you cannot play without exceeding 99, you lose (and drink!).

### Special Cards

- **Ace (A)**: +1 or +11 (Player's choice).
- **9**: +0 (Pass turn).
- **10**: -10 to the count.
- **Jack (J)**: Set count to 99 instantly.
- **Queen (Q)**: +10.
- **King (K)**: Set count to 70.
- **Joker**: Choose a value between 1 and 9.

### Drinking Rules

- **Social**: If a player plays a card that brings the count to a multiple of 11 (11, 22, 33...), everyone drinks 1 sip.
- **Reverse**: If a Queen is played, the direction of play reverses.
- **Loss**: The player who busts 99 finishes their drink.

### Roadmap

- [x] Basic Game Logic (Server)
- [x] Real-time Multiplayer (Socket.io)
- [x] Mobile Controller Interface
- [x] Desktop Host Interface
- [ ] Custom Rules Configuration
- [ ] Player Avatars
- [ ] Sound Effects
- [ ] Drinking Statistics Dashboard

---

## 🇫🇷 Français

### Description (FR)

Une version numérique du célèbre jeu de cartes "99" adapté en jeu à boire. Les joueurs jouent des cartes tour à tour pour augmenter un compteur central. Le but est d'éviter de faire dépasser 99 au compteur.

### Règles

- **Objectif**: Ne pas être le joueur qui fait dépasser 99 au compteur.
- **Mise en place**: Chaque joueur commence avec 3 cartes.
- **Déroulement**:
  - Jouez une carte, ajoutez sa valeur au total.
  - Piochez une nouvelle carte.
  - Si vous ne pouvez pas jouer sans dépasser 99, vous perdez (et buvez !).

### Cartes Spéciales (FR)

- **As (A)**: +1 ou +11 (au choix du joueur).
- **9**: +0 (Passe le tour).
- **10**: -10 au compteur.
- **Valet (J)**: Met le compteur à 99 instantanément.
- **Dame (Q)**: +10.
- **Roi (K)**: Met le compteur à 70.
- **Joker**: Choisissez une valeur entre 1 et 9.

### Règles de Boisson (FR)

- **Social**: Si un joueur joue une carte qui amène le compteur à un multiple de 11 (11, 22, 33...), tout le monde boit une gorgée.
- **Inverse**: Si une Dame est jouée, le sens du jeu s'inverse.
- **Défaite**: Le joueur qui dépasse 99 finit son verre.

### Roadmap (Feuille de route)

- [x] Logique de base du jeu (Serveur)
- [x] Multijoueur temps réel (Socket.io)
- [x] Interface Contrôleur Mobile
- [x] Interface Hôte Bureau
- [ ] Configuration des règles personnalisées
- [ ] Avatars des joueurs
- [ ] Effets sonores
- [ ] Tableau de bord des statistiques de boisson
