export const gamesList = [
  {
    id: '99',
    title: 'Le 99',
    category: 'card',
    description: 'Atteignez 99 sans dépasser. Un jeu de calcul et de stratégie.',
    isPlayable: true,
    icon: 'Spade'
  },
  {
    id: 'bus',
    title: 'Le Bus',
    category: 'card',
    description: 'Probabilité & Hasard pur. Maximise la distribution d\'alcool.',
    isPlayable: false,
    icon: 'Bus',
    rules: [
      {
        title: 'Phase 1 : Distribution',
        content: [
          'Rouge ou Noir ? Erreur = gorgée.',
          'Plus ou Moins ? (Par rapport à la 1ère). Erreur = gorgée.',
          'Intérieur ou Extérieur ? (Entre les 2 premières). Erreur = gorgée.',
          'Pique, Cœur, Carreau ou Trèfle ? Erreur = gorgée.'
        ]
      },
      {
        title: 'Phase 2 : La Pyramide',
        content: [
          'Pyramide face cachée (base de 5, sommet de 1).',
          'On retourne une carte par rangée.',
          'Si un joueur a la même carte, il la pose et distribue des gorgées (selon l\'étage).'
        ]
      },
      {
        title: 'Phase 3 : Le Bus',
        content: [
          'Le joueur avec le plus de cartes "prend le bus".',
          '5 cartes alignées face cachée.',
          'Deviner Rouge/Noir pour chaque carte.',
          'Réussite : carte suivante.',
          'Échec : Il boit, on remplace, retour au début.'
        ]
      }
    ]
  },
  {
    id: 'pyramide',
    title: 'La Pyramide / Le Menteur',
    category: 'card',
    description: 'Mémoire & Bluff. Asymétrie d\'information.',
    isPlayable: false,
    icon: 'Triangle',
    rules: [
      {
        title: 'Mise en place',
        content: [
          'Pyramide de cartes face cachée.',
          '4 cartes par joueur (regardées une fois puis cachées devant soi).'
        ]
      },
      {
        title: 'Le Jeu',
        content: [
          'On retourne une carte de la pyramide.',
          'Si tu as la carte (ou prétends l\'avoir), tu distribues une gorgée.',
          'La victime peut te croire (et boire) ou dire "Tu mens".'
        ]
      },
      {
        title: 'Résolution',
        content: [
          'Si tu mentais : Tu bois double.',
          'Si tu disais vrai : Tu montres, la victime boit double, tu changes ta carte.'
        ]
      }
    ]
  },
  {
    id: 'president',
    title: 'Le Président',
    category: 'card',
    description: 'Hiérarchie sociale. Débarrassez-vous de vos cartes.',
    isPlayable: false,
    icon: 'Crown',
    rules: [
      {
        title: 'Règles de base',
        content: [
          'Ordre : 3 (bas) à 2 (haut). Le 2 coupe tout.',
          'Poser une carte égale ou supérieure.',
          'Paires, brelans, carrés (coupe le tour).'
        ]
      },
      {
        title: 'Rôles',
        content: [
          'Premier fini : Président.',
          'Dernier fini : Trou du Cul.'
        ]
      },
      {
        title: 'Contraintes',
        content: [
          'Le Trou du Cul donne ses 2 meilleures cartes au Président.',
          'Le Président donne ses 2 pires.',
          'Le Trou du Cul sert à boire et ne parle pas.'
        ]
      }
    ]
  },
  {
    id: 'circle',
    title: 'Le Cercle',
    category: 'card',
    description: 'Règles arbitraires. Chaque carte a un effet.',
    isPlayable: false,
    icon: 'Circle',
    rules: [
      {
        title: 'Effets des cartes',
        content: [
          '2-6 Rouge : Tu bois.',
          '2-6 Noir : Tu distribues.',
          '7 : J\'ai déjà (dernier boit).',
          '8 : Thème.',
          '9 : Rime.',
          '10 : Dans ma valise.',
          'Valet : Les hommes boivent.',
          'Dame : Les femmes boivent.',
          'Roi : Invente une règle.',
          'As : Tout le monde boit.'
        ]
      }
    ]
  },
  {
    id: '21',
    title: 'Le 21',
    category: 'no-material',
    description: 'Arithmétique & Attention. Compter sans se tromper.',
    isPlayable: false,
    icon: 'Hash',
    rules: [
      {
        title: 'Déroulement',
        content: [
          'Compter de 1 à 21 en cercle.',
          '1 chiffre : joueur suivant.',
          '2 chiffres : sens inverse.',
          '3 chiffres : saute un joueur.'
        ]
      },
      {
        title: 'Sanction',
        content: [
          'Celui qui dit "21" boit et invente une règle sur un chiffre (ex: dire "Banane" au lieu de 5).',
          'Erreur = gorgée.'
        ]
      }
    ]
  },
  {
    id: 'never',
    title: 'Je n\'ai jamais',
    category: 'no-material',
    description: 'Vérité binaire. Découvrez les secrets.',
    isPlayable: false,
    icon: 'MessageSquare',
    rules: [
      {
        title: 'Règle unique',
        content: [
          'Un joueur dit : "Je n\'ai jamais [action]".',
          'Tous ceux qui l\'ont fait boivent.'
        ]
      }
    ]
  },
  {
    id: 'buffalo',
    title: 'Buffalo',
    category: 'no-material',
    description: 'Contrainte permanente (Méta-jeu).',
    isPlayable: false,
    icon: 'Hand',
    rules: [
      {
        title: 'La Règle',
        content: [
          'Interdiction de boire avec sa main dominante.',
          'Si surpris : N\'importe qui crie "Buffalo !".',
          'Sanction : Cul sec immédiat.'
        ]
      }
    ]
  },
  {
    id: 'medusa',
    title: 'Méduse',
    category: 'no-material',
    description: 'Coordination visuelle. Ne croisez pas le regard.',
    isPlayable: false,
    icon: 'Eye',
    rules: [
      {
        title: 'Déroulement',
        content: [
          'Tout le monde regarde ses pieds.',
          'Au compte de 3, tout le monde regarde un autre joueur.',
          'Si contact visuel mutuel : Crier "Méduse !" et boire.'
        ]
      }
    ]
  },
  {
    id: 'contact',
    title: 'Le Contact',
    category: 'no-material',
    description: 'Déduction lexicale. Trouvez le mot secret.',
    isPlayable: false,
    icon: 'Zap',
    rules: [
      {
        title: 'Règles',
        content: [
          'MDJ choisit un mot et donne la 1ère lettre.',
          'Les joueurs cherchent des mots et donnent des définitions.',
          'Si un autre joueur comprend : "Contact" et décompte.',
          'Même mot ? MDJ donne une lettre.',
          'MDJ trouve avant ? Joueurs boivent.'
        ]
      }
    ]
  }
];
