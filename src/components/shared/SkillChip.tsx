import { Skill } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type SkillChipProps = {
  skill: Skill;
  onRemove?: () => void;
  selected?: boolean;
  onClick?: () => void;
};

export function SkillChip({
  skill,
  onRemove,
  selected = false,
  onClick,
}: SkillChipProps) {
  return (
    <Badge
      variant={selected ? 'default' : 'outline'}
      className={`
        cursor-pointer transition-colors
        ${selected ? 'bg-orange-500 text-white hover:bg-orange-600' : 'hover:bg-orange-50'}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      {skill.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-orange-600 rounded-full p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
