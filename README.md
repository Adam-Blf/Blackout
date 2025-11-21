# BlackOut 🍻

## 🇬🇧 English

### About BlackOut

**BlackOut** is the ultimate digital hub for drinking games. It brings together rules and playable interfaces for your favorite party games in one place. No more arguing over rules or looking for a deck of cards!

Currently, **Le 99** is the first fully implemented game. More classics like King's Cup and Pyramid are planned for future updates.

---

### Available Games

#### 1. Le 99 (The 99)

A digital version of the famous card game "99" adapted as a drinking game. Players take turns playing cards to add to a central count. The goal is to avoid making the count go over 99.

##### Rules

- **Objective**: Do not be the player who makes the count exceed 99.
- **Setup**: Each player starts with 3 cards.
- **Gameplay**:
  - Play a card, add its value to the count.
  - Draw a new card.
  - If you cannot play without exceeding 99, you lose (and drink!).

##### Special Cards

- **Ace (A)**: +1 or +11 (Player's choice).
- **9**: +0 (Pass turn).
- **10**: -10 to the count.
- **Jack (J)**: Set count to 99 instantly.
- **Queen (Q)**: +10.
- **King (K)**: Set count to 70.
- **Joker**: Choose a value between 1 and 9.

##### Drinking Rules

- **Social**: If a player plays a card that brings the count to a multiple of 11 (11, 22, 33...), everyone drinks 1 sip.
- **Reverse**: If a Queen is played, the direction of play reverses.
- **Loss**: The player who busts 99 finishes their drink.

---

### Roadmap

- [x] **BlackOut Platform Foundation**
- [x] **Game: Le 99**
  - [x] Basic Game Logic (Server)
  - [x] Real-time Multiplayer (Socket.io)
  - [x] Mobile Controller Interface
  - [x] Desktop Host Interface
- [ ] **Game: King's Cup** (Coming Soon)
- [ ] **Game: Pyramid** (Coming Soon)
- [ ] Custom Rules Configuration
- [ ] Player Avatars & Profiles
- [ ] Drinking Statistics Dashboard

---
---

## 🇫🇷 Français

### À propos de BlackOut

**BlackOut** est le hub numérique ultime pour les jeux à boire. Il rassemble les règles et les interfaces de jeu pour vos jeux de soirée préférés en un seul endroit. Plus besoin de se disputer sur les règles ou de chercher un jeu de cartes !

Actuellement, **Le 99** est le premier jeu entièrement implémenté. D'autres classiques comme le King's Cup et la Pyramide sont prévus pour les futures mises à jour.

---

### Jeux Disponibles

#### 1. Le 99

Une version numérique du célèbre jeu de cartes "99" adapté en jeu à boire. Les joueurs jouent des cartes tour à tour pour augmenter un compteur central. Le but est d'éviter de faire dépasser 99 au compteur.

##### Règles

- **Objectif**: Ne pas être le joueur qui fait dépasser 99 au compteur.
- **Mise en place**: Chaque joueur commence avec 3 cartes.
- **Déroulement**:
  - Jouez une carte, ajoutez sa valeur au total.
  - Piochez une nouvelle carte.
  - Si vous ne pouvez pas jouer sans dépasser 99, vous perdez (et buvez !).

##### Cartes Spéciales

- **As (A)**: +1 ou +11 (au choix du joueur).
- **9**: +0 (Passe le tour).
- **10**: -10 au compteur.
- **Valet (J)**: Met le compteur à 99 instantanément.
- **Dame (Q)**: +10.
- **Roi (K)**: Met le compteur à 70.
- **Joker**: Choisissez une valeur entre 1 et 9.

##### Règles de Boisson

- **Social**: Si un joueur joue une carte qui amène le compteur à un multiple de 11 (11, 22, 33...), tout le monde boit une gorgée.
- **Inverse**: Si une Dame est jouée, le sens du jeu s'inverse.
- **Défaite**: Le joueur qui dépasse 99 finit son verre.

---

### Roadmap (Feuille de route)

- [x] **Fondation de la plateforme BlackOut**
- [x] **Jeu : Le 99**
  - [x] Logique de base du jeu (Serveur)
  - [x] Multijoueur temps réel (Socket.io)
  - [x] Interface Contrôleur Mobile
  - [x] Interface Hôte Bureau
- [ ] **Jeu : King's Cup** (Bientôt)
- [ ] **Jeu : Pyramide** (Bientôt)
- [ ] Configuration des règles personnalisées
- [ ] Avatars et Profils des joueurs
- [ ] Tableau de bord des statistiques de boisson
