interface IconProps {
  className?: string;
}

export function IconPlay({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7 4l13 8-13 8z" />
    </svg>
  );
}

export function IconPause({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6 4h4.2v16H6zM13.8 4H18v16h-4.2z" />
    </svg>
  );
}

export function IconRestart({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" />
      <path d="M3.5 4v5h5" />
    </svg>
  );
}

export function IconSoundOn({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5z" fill="currentColor" stroke="none" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.6 5.6a9.3 9.3 0 0 1 0 12.8" />
    </svg>
  );
}

export function IconSoundOff({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5z" fill="currentColor" stroke="none" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    </svg>
  );
}

export function IconTrophy({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v6a5 5 0 0 1-10 0V4z" />
      <path d="M17 5h3a1 1 0 0 1 1 1c0 2.5-2 4-4 4" />
      <path d="M7 5H4a1 1 0 0 0-1 1c0 2.5 2 4 4 4" />
    </svg>
  );
}

export function IconApple({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="14" r="7.5" />
      <path d="M12 7c0-2 1-3.5 2.8-4.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="15.6" cy="4.6" rx="2.4" ry="1.1" transform="rotate(-28 15.6 4.6)" opacity="0.75" />
    </svg>
  );
}

export function Chevron({
  className,
  dir,
}: {
  className?: string;
  dir: "up" | "down" | "left" | "right";
}) {
  const rot = { up: 0, right: 90, down: 180, left: 270 }[dir];
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ transform: `rotate(${rot}deg)` }}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 4l8 9h-5v7H9v-7H4z" />
    </svg>
  );
}

export function SnakeLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="6" y="20" width="2" height="2" fill="#2eb88a" />
      <rect x="8" y="20" width="2" height="2" fill="#56c878" />
      <rect x="10" y="20" width="2" height="2" fill="#7ed957" />
      <rect x="10" y="18" width="2" height="2" fill="#a3e635" />
      <rect x="10" y="16" width="2" height="2" fill="#b8ef4f" />
      <rect x="12" y="16" width="2" height="2" fill="#c9f76f" />
      <rect x="13.1" y="16.4" width="0.9" height="0.9" fill="#0b1d14" />
      <circle cx="18" cy="17" r="2.1" fill="#ff6b6b" />
      <rect x="17.7" y="13.6" width="0.9" height="1.7" fill="#8b5a2b" />
      <rect x="18.8" y="13.4" width="1.8" height="0.9" fill="#4ade80" />
    </svg>
  );
}
