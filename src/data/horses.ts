export type HorseRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'celestial';

export type Horse = {
  id: string;
  name: string;
  image: string;
  rarity: HorseRarity;
};

const IMAGE_KEYS = [
  'red',
  'blue',
  'giant',
  'mini',
  'gold',
  'silver',
  'night',
  'dawn',
  'flame',
  'ice',
  'forest',
  'thunder',
  'cloud',
  'rock',
  'ghost',
  'robot',
  'rainbow',
  'choco',
  'mint',
  'star',
] as const;

const RARITY_COUNTS: Record<HorseRarity, number> = {
  common: 36,
  uncommon: 24,
  rare: 17,
  epic: 11,
  legendary: 7,
  mythic: 4,
  celestial: 1,
};

const RARITY_LABELS: Record<HorseRarity, string> = {
  common: '일반',
  uncommon: '고급',
  rare: '희귀',
  epic: '영웅',
  legendary: '전설',
  mythic: '신화',
  celestial: '천상',
};

const BASE_HORSES: Horse[] = [
  { id: 'red', name: '붉은말', image: 'horses/horse-red.png', rarity: 'common' },
  { id: 'blue', name: '푸른말', image: 'horses/horse-blue.png', rarity: 'common' },
  { id: 'giant', name: '거대말', image: 'horses/horse-giant.png', rarity: 'common' },
  { id: 'mini', name: '미니말', image: 'horses/horse-mini.png', rarity: 'common' },
  { id: 'gold', name: '황금말', image: 'horses/horse-gold.png', rarity: 'common' },
  { id: 'silver', name: '은빛말', image: 'horses/horse-silver.png', rarity: 'common' },
  { id: 'night', name: '밤하늘말', image: 'horses/horse-night.png', rarity: 'common' },
  { id: 'dawn', name: '새벽말', image: 'horses/horse-dawn.png', rarity: 'common' },
  { id: 'flame', name: '불꽃말', image: 'horses/horse-flame.png', rarity: 'common' },
  { id: 'ice', name: '얼음말', image: 'horses/horse-ice.png', rarity: 'common' },
  { id: 'forest', name: '숲말', image: 'horses/horse-forest.png', rarity: 'uncommon' },
  { id: 'thunder', name: '번개말', image: 'horses/horse-thunder.png', rarity: 'uncommon' },
  { id: 'cloud', name: '구름말', image: 'horses/horse-cloud.png', rarity: 'uncommon' },
  { id: 'rock', name: '바위말', image: 'horses/horse-rock.png', rarity: 'uncommon' },
  { id: 'ghost', name: '유령말', image: 'horses/horse-ghost.png', rarity: 'uncommon' },
  { id: 'robot', name: '로봇말', image: 'horses/horse-robot.png', rarity: 'rare' },
  { id: 'rainbow', name: '무지개말', image: 'horses/horse-rainbow.png', rarity: 'rare' },
  { id: 'choco', name: '초코말', image: 'horses/horse-choco.png', rarity: 'rare' },
  { id: 'mint', name: '민트말', image: 'horses/horse-mint.png', rarity: 'epic' },
  { id: 'star', name: '별말', image: 'horses/horse-star.png', rarity: 'legendary' },
];

const baseCountByRarity = BASE_HORSES.reduce<Record<HorseRarity, number>>(
  (acc, horse) => {
    acc[horse.rarity] += 1;
    return acc;
  },
  {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    mythic: 0,
    celestial: 0,
  },
);

const EXTRA_HORSES: Horse[] = (Object.entries(RARITY_COUNTS) as Array<[HorseRarity, number]>).flatMap(
  ([rarity, total]) =>
    Array.from({ length: Math.max(0, total - baseCountByRarity[rarity]) }, (_, i) => {
      const imageKey = IMAGE_KEYS[(baseCountByRarity[rarity] + i) % IMAGE_KEYS.length];
      const number = baseCountByRarity[rarity] + i + 1;
      return {
        id: `${rarity}-extra-${number}`,
        name: `${RARITY_LABELS[rarity]} 포니 #${number}`,
        image: `horses/horse-${imageKey}.png`,
        rarity,
      };
    }),
);

export const HORSES: Horse[] = [...BASE_HORSES, ...EXTRA_HORSES];
