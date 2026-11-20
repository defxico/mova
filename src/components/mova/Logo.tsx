import { Link } from "@tanstack/react-router";

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mova-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="0.6" stopColor="var(--secondary)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <path
        d="M4 34V8l16 14L36 8v26"
        fill="none"
        stroke="url(#mova-g)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="22" r="3" fill="var(--primary)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 rounded-md"
      aria-label="MOVA — página inicial"
    >
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-[0.25em] text-foreground">
          MOVA
        </span>
        <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground sm:block">
          telepresença inclusiva
        </span>
      </span>
    </Link>
  );
}
