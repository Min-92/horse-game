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

export const HORSES: Horse[] = (Object.entries(RARITY_COUNTS) as Array<[HorseRarity, number]>).flatMap(
  ([rarity, count], rarityIndex) =>
    Array.from({ length: count }, (_, i) => {
      const index = rarityIndex * 100 + i;
      const imageKey = IMAGE_KEYS[index % IMAGE_KEYS.length];
      return {
        id: `${rarity}-${i + 1}`,
        name: `${RARITY_LABELS[rarity]} 포니 #${i + 1}`,
        image: `horses/horse-${imageKey}.png`,
        rarity,
      };
    }),
);
