import type { Ambiente } from "@/lib/mova-data";

/** Decorative robot illustration: tower for urban robots, rover for rural ones. */
export function RobotArt({
  ambiente,
  className = "h-32",
}: {
  ambiente: Ambiente;
  className?: string;
}) {
  if (ambiente === "rural") {
    return (
      <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
        <ellipse cx="80" cy="108" rx="58" ry="6" fill="var(--primary)" opacity="0.15" />
        <rect
          x="30"
          y="62"
          width="100"
          height="30"
          rx="8"
          fill="var(--surface-raised)"
          stroke="var(--primary)"
          strokeWidth="1.5"
        />
        <rect x="44" y="70" width="18" height="4" rx="2" fill="var(--primary)" />
        <rect x="98" y="70" width="18" height="4" rx="2" fill="var(--primary)" />
        <line x1="80" y1="62" x2="80" y2="30" stroke="var(--muted-foreground)" strokeWidth="3" />
        <rect
          x="66"
          y="18"
          width="28"
          height="16"
          rx="4"
          fill="var(--surface-raised)"
          stroke="var(--secondary)"
          strokeWidth="1.5"
        />
        <circle cx="80" cy="26" r="4" fill="var(--primary)" />
        <circle
          cx="45"
          cy="98"
          r="12"
          fill="var(--background)"
          stroke="var(--primary)"
          strokeWidth="2"
        />
        <circle
          cx="115"
          cy="98"
          r="12"
          fill="var(--background)"
          stroke="var(--primary)"
          strokeWidth="2"
        />
        <circle cx="45" cy="98" r="4" fill="var(--secondary)" />
        <circle cx="115" cy="98" r="4" fill="var(--secondary)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <ellipse cx="80" cy="112" rx="34" ry="5" fill="var(--primary)" opacity="0.15" />
      <circle
        cx="80"
        cy="26"
        r="20"
        fill="var(--surface-raised)"
        stroke="var(--primary)"
        strokeWidth="2"
      />
      <circle cx="80" cy="26" r="14" fill="var(--background)" />
      <circle cx="74" cy="24" r="2" fill="var(--primary)" />
      <circle cx="86" cy="24" r="2" fill="var(--primary)" />
      <path
        d="M73 31 q7 5 14 0"
        stroke="var(--primary)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="76" y="46" width="8" height="10" fill="var(--muted-foreground)" />
      <path
        d="M64 56 h32 l6 44 h-44 z"
        fill="var(--surface-raised)"
        stroke="var(--secondary)"
        strokeWidth="1.5"
      />
      <line x1="80" y1="64" x2="80" y2="90" stroke="var(--primary)" strokeWidth="2" />
      <rect
        x="54"
        y="100"
        width="52"
        height="10"
        rx="5"
        fill="var(--background)"
        stroke="var(--primary)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
