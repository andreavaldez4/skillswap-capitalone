'use client';

import Link from 'next/link';
import { Crown, Sparkles, Trophy, CircleCheckBig } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SkillChip } from '@/components/shared/SkillChip';
import { XPBadge } from '@/components/shared/XPBadge';
import { cn } from '@/lib/utils';
import {
  getNextLevelTitle,
  getProgressToNextLevel,
  getXPLevel,
  getXPToNextLevel,
} from '@/lib/xpSystem';
import { getProfileBadges, getUnlockedBadgeCount, type ProfileBadgeProgress } from '@/lib/profile';
import type { User } from '@/lib/mockData';

type ProfileSummaryProps = {
  user: User;
  actionHref?: string;
  actionLabel?: string;
};

const BADGE_ICON_MAP: Record<ProfileBadgeProgress['id'], typeof Trophy> = {
  'first-match': CircleCheckBig,
  'first-lesson': Sparkles,
  'top-mentor': Crown,
};

export function ProfileSummary({ user, actionHref, actionLabel }: ProfileSummaryProps) {
  const level = getXPLevel(user.xp);
  const progress = getProgressToNextLevel(user.xp);
  const nextLevel = getNextLevelTitle(user.xp);
  const xpToNext = getXPToNextLevel(user.xp);
  const badgeProgress = getProfileBadges(user.xp);
  const unlockedBadges = getUnlockedBadgeCount(user.xp);

  return (
    <div className="space-y-6">
      <Card className="border-orange-100 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-200 via-amber-100 to-orange-300 text-3xl font-semibold text-orange-800 shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
                  <XPBadge xp={user.xp} showXP={false} />
                </div>
                <p className="text-sm text-gray-600">
                  {user.location} · {user.isRemote ? 'Modalidad remota' : 'Modalidad presencial'}
                </p>
                <p className="max-w-2xl text-sm leading-6 text-gray-700">{user.bio}</p>
              </div>
            </div>

            {actionHref && actionLabel && (
              <Button
                asChild
                variant="outline"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="XP total" value={String(user.xp)} detail="Experiencia acumulada" />
            <MetricCard
              label="Nivel"
              value={level.title}
              detail={`${progress}% hacia ${nextLevel || 'máximo nivel'}`}
            />
            <MetricCard
              label="Badges"
              value={`${unlockedBadges}/${badgeProgress.length}`}
              detail="Desbloqueados"
            />
          </div>

          <div className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Progreso hacia {nextLevel || 'máximo nivel'}
                </p>
                <p className="text-xs text-gray-600">
                  {nextLevel ? `${xpToNext} XP restantes` : 'Ya alcanzaste el nivel máximo'}
                </p>
              </div>
              <Badge variant="secondary" className="bg-white text-gray-700 shadow-sm">
                {progress}%
              </Badge>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-orange-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-amber-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ProfileSkillsBlock
              title="Enseña"
              skills={user.skillsToTeach}
              emptyLabel="Aún no agregaste habilidades para enseñar"
            />
            <ProfileSkillsBlock
              title="Quiere aprender"
              skills={user.skillsToLearn}
              emptyLabel="Aún no agregaste habilidades para aprender"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-100 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Badges y progreso</h2>
              <p className="text-sm text-gray-600">
                {unlockedBadges} de {badgeProgress.length} badges desbloqueados
              </p>
            </div>
            <Badge variant="outline" className="w-fit border-orange-200 text-orange-700">
              Sistema de logros
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {badgeProgress.map((badge) => {
              const Icon = BADGE_ICON_MAP[badge.id];

              return (
                <div
                  key={badge.id}
                  className={cn(
                    'rounded-3xl border p-4 shadow-sm transition-all',
                    badge.unlocked
                      ? 'border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50'
                      : 'border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-2xl',
                          badge.unlocked
                            ? 'bg-gradient-to-br from-orange-500 to-amber-400 text-white'
                            : 'bg-white text-slate-400 ring-1 ring-slate-200'
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{badge.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-gray-600">{badge.description}</p>
                      </div>
                    </div>

                    <Badge
                      variant={badge.unlocked ? 'default' : 'secondary'}
                      className={cn(
                        'shrink-0',
                        badge.unlocked
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {badge.unlocked ? 'Desbloqueado' : `${badge.progress}%`}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {badge.unlocked ? 'Completado' : `${badge.xpRemaining} XP para desbloquear`}
                      </span>
                      <span>{badge.requirementXP} XP</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/80 ring-1 ring-inset ring-black/5">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          badge.unlocked
                            ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                            : 'bg-gradient-to-r from-slate-300 to-slate-400'
                        )}
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-600">{detail}</p>
    </div>
  );
}

function ProfileSkillsBlock({
  title,
  skills,
  emptyLabel,
}: {
  title: string;
  skills: User['skillsToTeach'];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
      {skills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <SkillChip key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-600">{emptyLabel}</p>
      )}
    </div>
  );
}