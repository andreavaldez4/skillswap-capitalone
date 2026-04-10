// Sistema de XP y niveles para Skill Swap

export type XPLevel = {
  title: string;
  minXP: number;
  maxXP: number;
  color: string; // Clase de Tailwind para el color
};

export const XP_LEVELS: XPLevel[] = [
  {
    title: 'Semilla',
    minXP: 0,
    maxXP: 99,
    color: 'bg-orange-300',
  },
  {
    title: 'Chispa',
    minXP: 100,
    maxXP: 299,
    color: 'bg-orange-400',
  },
  {
    title: 'Llama',
    minXP: 300,
    maxXP: 599,
    color: 'bg-orange-500',
  },
  {
    title: 'Corriente',
    minXP: 600,
    maxXP: 999,
    color: 'bg-orange-600',
  },
  {
    title: 'Luminar',
    minXP: 1000,
    maxXP: 1999,
    color: 'bg-orange-700',
  },
  {
    title: 'Maestro',
    minXP: 2000,
    maxXP: Infinity,
    color: 'bg-orange-800',
  },
];

/**
 * Obtiene el nivel correspondiente a una cantidad de XP
 */
export function getXPLevel(xp: number): XPLevel {
  const level = XP_LEVELS.find((level) => xp >= level.minXP && xp <= level.maxXP);
  return level || XP_LEVELS[0];
}

/**
 * Calcula el progreso hacia el siguiente nivel (0-100)
 */
export function getProgressToNextLevel(xp: number): number {
  const currentLevel = getXPLevel(xp);
  const currentIndex = XP_LEVELS.indexOf(currentLevel);

  // Si está en el último nivel, retorna 100
  if (currentIndex === XP_LEVELS.length - 1) {
    return 100;
  }

  const nextLevel = XP_LEVELS[currentIndex + 1];
  const progressInLevel = xp - currentLevel.minXP;
  const levelRange = nextLevel.minXP - currentLevel.minXP;

  return Math.round((progressInLevel / levelRange) * 100);
}

/**
 * Obtiene el XP necesario para alcanzar el siguiente nivel
 */
export function getXPToNextLevel(xp: number): number {
  const currentLevel = getXPLevel(xp);
  const currentIndex = XP_LEVELS.indexOf(currentLevel);

  // Si está en el último nivel, retorna 0
  if (currentIndex === XP_LEVELS.length - 1) {
    return 0;
  }

  const nextLevel = XP_LEVELS[currentIndex + 1];
  return nextLevel.minXP - xp;
}

/**
 * Obtiene el título del siguiente nivel
 */
export function getNextLevelTitle(xp: number): string | null {
  const currentLevel = getXPLevel(xp);
  const currentIndex = XP_LEVELS.indexOf(currentLevel);

  if (currentIndex === XP_LEVELS.length - 1) {
    return null;
  }

  return XP_LEVELS[currentIndex + 1].title;
}
