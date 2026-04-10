import { getXPLevel } from '@/lib/xpSystem';
import { Badge } from '@/components/ui/badge';

type XPBadgeProps = {
  xp: number;
  showXP?: boolean;
  className?: string;
};

export function XPBadge({ xp, showXP = true, className = '' }: XPBadgeProps) {
  const level = getXPLevel(xp);

  return (
    <Badge
      className={`${level.color} text-white font-medium ${className}`}
      variant="secondary"
    >
      {level.title}
      {showXP && ` · ${xp} XP`}
    </Badge>
  );
}
