export const computeDifficulty = (
  oven: boolean,
  equipment: boolean,
  exotic: boolean
): string => {
  if (oven && equipment && exotic) return "Difficile";
  if (oven || equipment || exotic) return "Moyenne";
  return "Facile";
};