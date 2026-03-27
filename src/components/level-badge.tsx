interface LevelBadgeProps {
  level: string;
  /** CSS class for the badge background (e.g. "bg-red-500/80 text-white") */
  badgeClass: string;
}

export function LevelBadge({ level, badgeClass }: LevelBadgeProps) {
  return (
    <div
      className={`hex-badge flex h-10 w-10 items-center justify-center ${badgeClass}`}
      data-testid="level-badge"
    >
      <div className="flex flex-col items-center leading-none">
        <span className="text-[8px] font-bold uppercase tracking-wider">Lv</span>
        <span className="text-xs font-bold">{level}</span>
      </div>
    </div>
  );
}
