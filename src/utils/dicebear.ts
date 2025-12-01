import { ADVENTURER_SEEDS } from "../constants/adventurerSeeds";

export const getRandomAdventurerAvatar = (): string => {
  const index = Math.floor(Math.random() * ADVENTURER_SEEDS.length);
  const selectedSeed = ADVENTURER_SEEDS[index];

  return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${selectedSeed}`;
};
