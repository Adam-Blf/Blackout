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
    id: 'pmu',
    title: 'Le PMU',
    category: 'card',
    description: 'Pariez sur vos chevaux (les couleurs) et faites avancer la course !',
    isPlayable: false,
    icon: 'Trophy',
    rules: [
      {
        title: 'Mise en place',
        content: [
          'Extraire les 4 As (les Chevaux) et les aligner au départ.',
          'Aligner 6 cartes face cachée sur le côté (le parcours).',
          'Les joueurs parient des gorgées sur un As (Couleur).'
        ]
      },
      {
        title: 'La Course',
        content: [
          'Le maître du jeu retourne les cartes du paquet une par une.',
          'La couleur de la carte fait avancer le cheval correspondant d\'une case.',
          'Quand tous les chevaux ont dépassé une carte du parcours, on la retourne.',
          'Si la carte parcours est de la couleur d\'un cheval, ce cheval recule !'
        ]
      },
      {
        title: 'Fin de partie',
        content: [
          'Le premier cheval qui dépasse la 6ème carte gagne.',
          'Les perdants boivent la différence de cases x leur mise.',
          'Les gagnants distribuent leurs gains.'
        ]
      }
    ]
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
    title: 'La Pyramide / Menteur',
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
    title: 'Le Cercle / Kings Cup',
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
    id: 'barbu',
    title: 'Le Barbu',
    category: 'card',
    description: 'Un jeu de plis où il faut éviter certaines cartes.',
    isPlayable: false,
    icon: 'Ghost',
    rules: [
      {
        title: 'Les Contrats (à éviter)',
        content: [
          'Le Barbu : Le Roi de Cœur (Grosse pénalité).',
          'Les Dames : Chaque dame ramassée fait boire.',
          'Les Cœurs : Chaque cœur ramassé fait boire.',
          'Le Pli : Chaque pli ramassé fait boire.',
          'La Salade : Tout compte à la fois !'
        ]
      },
      {
        title: 'La Réussite',
        content: [
          'Celui qui se débarrasse de toutes ses cartes en premier distribue des gorgées.'
        ]
      }
    ]
  },
  {
    id: 'tod',
    title: 'Action ou Vérité',
    category: 'no-material',
    description: 'Révélez vos secrets ou relevez des défis.',
    isPlayable: false,
    icon: 'MessageCircle',
    rules: [
      {
        title: 'Règles',
        content: [
          'Tournez une bouteille ou choisissez un joueur.',
          'Il doit choisir : Action ou Vérité ?',
          'Vérité : Doit répondre honnêtement à une question intime.',
          'Action : Doit réaliser un gage physique ou social.',
          'Refus = Cul sec.'
        ]
      }
    ]
  },
  {
    id: 'purple',
    title: 'Le Violet',
    category: 'no-material',
    description: 'Jeu d\'interdits verbaux.',
    isPlayable: false,
    icon: 'Ban',
    rules: [
      {
        title: 'Interdictions',
        content: [
          'Interdit de dire "Oui".',
          'Interdit de dire "Non".',
          'Interdit de dire "Violet".',
          'Interdit de dire "Blanc".'
        ]
      },
      {
        title: 'Le Piège',
        content: [
          'Les joueurs se posent des questions rapides pour piéger les autres.',
          'Celui qui prononce un mot interdit boit.'
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
  },
  {
    id: 'bizkit',
    title: 'Le Bizkit',
    category: 'dice',
    description: 'Jeu de dés simple et efficace.',
    isPlayable: false,
    icon: 'Dices',
    rules: [
      {
        title: 'Lancers (2 dés)',
        content: [
          'Total 7 : Le joueur précédent boit.',
          'Total 9 : Le joueur suivant boit.',
          'Double : Tu distribues le montant en gorgées.',
          '1 + 1 : "Bizkit" ! Tu deviens le Bizkit (tu bois quand un 3 sort).',
          '3 : Le Bizkit boit (s\'il y en a un), sinon rien.'
        ]
      }
    ]
  },
  {
    id: 'beerpong',
    title: 'Beer Pong',
    category: 'skill',
    description: 'Adresse. Visez les gobelets adverses.',
    isPlayable: false,
    icon: 'Target',
    rules: [
      {
        title: 'Setup',
        content: [
          '10 gobelets en triangle de chaque côté de la table.',
          'Remplis de bière (ou eau).',
          '2 équipes de 2.'
        ]
      },
      {
        title: 'Jeu',
        content: [
          'Lancer la balle de ping-pong dans les verres adverses.',
          'Réussite : L\'adversaire boit le verre et l\'enlève.',
          'Rebond : Compte double (2 verres), mais peut être intercepté.',
          'Premier sans verres a perdu.'
        ]
      }
    ]
  },
  {
    id: 'flipcup',
    title: 'Flip Cup',
    category: 'skill',
    description: 'Vitesse et technique. Retournez le gobelet.',
    isPlayable: false,
    icon: 'Rotate3d',
    rules: [
      {
        title: 'Duel',
        content: [
          'Deux équipes face à face le long d\'une table.',
          'Chacun un gobelet avec un fond de boisson.',
          'Au signal, le 1er joueur boit, pose le verre au bord de la table, et doit le retourner d\'une pichenette pour qu\'il atterrisse à l\'envers.',
          'Dès qu\'il réussit, le suivant peut commencer.',
          'Première équipe qui finit gagne.'
        ]
      }
    ]
  },
  {
    id: 'caps',
    title: 'Caps',
    category: 'skill',
    description: 'Précision. Dégommez la capsule adverse.',
    isPlayable: false,
    icon: 'Disc',
    rules: [
      {
        title: 'Règles',
        content: [
          'Chacun sa bière posée devant soi, avec une capsule retournée dessus.',
          'À tour de rôle, lancer une capsule pour faire tomber celle de l\'adversaire.',
          'Touche : L\'adversaire boit une gorgée.',
          'Dégomme (la capsule tombe) : L\'adversaire finit son verre (ou grosse gorgée).'
        ]
      }
    ]
  }
];
