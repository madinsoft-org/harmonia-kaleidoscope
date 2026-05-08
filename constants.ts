import { Track } from './types';

// 5 minutes in seconds
export const TRACK_DURATION = 300; 

export const TRACKS: Track[] = [
  // Row 1: Nature / Frequencies (Images Picsum haute résolution)
  {
    id: 'nat-1',
    category: 'nature',
    title: 'Fréquence Miracle',
    description: 'Ton pur 429.62Hz + Harmoniques',
    imageUrl: 'https://picsum.photos/id/10/800/800',
    frequency: 429.62
  },
  {
    id: 'nat-2',
    category: 'nature',
    title: 'Forêt Vivante',
    description: 'Vent dans les arbres & Oiseaux',
    imageUrl: 'https://picsum.photos/id/11/800/800',
    frequency: 100 // Unused for synth logic
  },
  {
    id: 'nat-3',
    category: 'nature',
    title: 'Pluie & Harmonie',
    description: 'Averse dense & Nappe musicale',
    imageUrl: 'https://picsum.photos/id/12/800/800',
    frequency: 200
  },
  {
    id: 'nat-4',
    category: 'nature',
    title: 'Océan Profond',
    description: 'Vagues réalistes (Bruit Brun)',
    imageUrl: 'https://picsum.photos/id/16/800/800',
    frequency: 50
  },

  // Row 2: Activation (Marc Henry inspired - Images Aliments / Médical)
  {
    id: 'vit-1',
    category: 'vitamin',
    title: 'Activation Vitamine C',
    description: 'Tonique et énergisant',
    imageUrl: 'https://loremflickr.com/800/800/orange,fruit,citrus/all?lock=1',
    frequency: 261.63 // C4
  },
  {
    id: 'vit-2',
    category: 'vitamin',
    title: 'Oligo-élément Zinc',
    description: 'Résonance cellulaire',
    imageUrl: 'https://loremflickr.com/800/800/healthy,seeds,nuts/all?lock=2',
    frequency: 329.63 // E4
  },
  {
    id: 'vit-3',
    category: 'vitamin',
    title: 'Magnésium Marin',
    description: 'Relaxation musculaire',
    imageUrl: 'https://loremflickr.com/800/800/sea,salt,mineral/all?lock=3',
    frequency: 392.00 // G4
  },
  {
    id: 'vit-4',
    category: 'vitamin',
    title: 'Harmonie Cellulaire',
    description: 'Accord complet',
    imageUrl: 'https://loremflickr.com/800/800/dna,cell,medical/all?lock=4',
    frequency: 523.25 // C5
  },

  // Row 3: Laughter (Images de gens qui rient)
  {
    id: 'laugh-1',
    category: 'laughter',
    title: 'Rire de Bébé',
    description: 'Innocence pure',
    imageUrl: 'https://loremflickr.com/800/800/baby,laughing/all?lock=5',
    prompt: "Génère un rire de bébé très joyeux et contagieux qui dure longtemps.",
    voice: 'Puck'
  },
  {
    id: 'laugh-2',
    category: 'laughter',
    title: 'Rires Antillais',
    description: 'Chaleur et partage',
    imageUrl: 'https://loremflickr.com/800/800/happy,laughing,people/all?lock=6',
    prompt: "Fais un rire chaleureux, profond et joyeux, style antillais.",
    voice: 'Kore'
  },
  {
    id: 'laugh-3',
    category: 'laughter',
    title: 'Rires Italiens',
    description: 'Expressif et fort',
    imageUrl: 'https://loremflickr.com/800/800/family,party,laughing/all?lock=7',
    prompt: "Fais un rire très expressif, fort et jovial, comme lors d'un repas de famille italien.",
    voice: 'Fenrir'
  },
  {
    id: 'laugh-4',
    category: 'laughter',
    title: 'Rire Zen Asiatique',
    description: 'Douceur et sagesse',
    imageUrl: 'https://loremflickr.com/800/800/asian,girl,laughing/all?lock=8',
    prompt: "Fais un rire doux, poli mais sincère et relaxant.",
    voice: 'Charon'
  },

  // Row 4: Relaxation Music (Images Zen: Buddha, Lotus, Bamboo)
  {
    id: 'rel-1',
    category: 'relaxation',
    title: 'Nappe Éthérée',
    description: 'Atmosphère planante',
    imageUrl: 'https://loremflickr.com/800/800/lotus,flower,zen/all?lock=9',
    frequency: 1
  },
  {
    id: 'rel-2',
    category: 'relaxation',
    title: 'Sommeil Profond',
    description: 'Ondes Delta',
    imageUrl: 'https://loremflickr.com/800/800/bamboo,forest,green/all?lock=10',
    frequency: 2
  },
  {
    id: 'rel-3',
    category: 'relaxation',
    title: 'Méditation Matinale',
    description: 'Clarté mentale',
    imageUrl: 'https://loremflickr.com/800/800/buddha,statue,gold/all?lock=11',
    frequency: 3
  },
  {
    id: 'rel-4',
    category: 'relaxation',
    title: 'Voyage Intérieur',
    description: 'Immersion totale',
    imageUrl: 'https://loremflickr.com/800/800/stones,zen,sand/all?lock=12',
    frequency: 4
  }
];