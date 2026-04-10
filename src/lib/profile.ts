import { CURRENT_USER, MOCK_USERS, User } from '@/lib/mockData';

export type ProfileBadgeDefinition = {
  id: 'first-match' | 'first-lesson' | 'top-mentor';
  title: string;
  description: string;
  requirementXP: number;
};

export type ProfileBadgeProgress = ProfileBadgeDefinition & {
  unlocked: boolean;
  progress: number;
  xpRemaining: number;
};

export const PROFILE_BADGES: ProfileBadgeDefinition[] = [
  {
    id: 'first-match',
    title: 'First Match',
    description: 'Consigue tu primera conexión en la plataforma.',
    requirementXP: 100,
  },
  {
    id: 'first-lesson',
    title: 'First Lesson',
    description: 'Completa tu primera sesión de intercambio.',
    requirementXP: 300,
  },
  {
    id: 'top-mentor',
    title: 'Top Mentor',
    description: 'Llega a un nivel de mentoría destacado.',
    requirementXP: 1000,
  },
];

const ALL_USERS: User[] = [CURRENT_USER, ...MOCK_USERS];

export function getUserById(userId: string) {
  return ALL_USERS.find((user) => user.id === userId);
}

export function getAllProfileUsers() {
  return ALL_USERS;
}

export function getProfileBadges(xp: number): ProfileBadgeProgress[] {
  return PROFILE_BADGES.map((badge) => {
    const progress = Math.min(100, Math.round((xp / badge.requirementXP) * 100));
    const unlocked = xp >= badge.requirementXP;

    return {
      ...badge,
      unlocked,
      progress: unlocked ? 100 : progress,
      xpRemaining: unlocked ? 0 : badge.requirementXP - xp,
    };
  });
}

export function getUnlockedBadgeCount(xp: number) {
  return getProfileBadges(xp).filter((badge) => badge.unlocked).length;
}