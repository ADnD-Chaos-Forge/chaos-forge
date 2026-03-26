interface AvatarDisplayProps {
  name: string;
  avatarUrl: string | null;
  size?: number;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AvatarDisplay({ name, avatarUrl, size = 80, className = "" }: AvatarDisplayProps) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`Avatar von ${name}`}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
        data-testid="avatar-image"
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary/20 font-heading text-primary ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      data-testid="avatar-initials"
    >
      {getInitials(name || "?")}
    </div>
  );
}
