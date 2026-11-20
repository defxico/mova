import type { Robo } from "@/lib/mova-data";
import { LIMITE, type EstadoRobo } from "@/lib/robot-sim";

const PONTOS = {
  urbano: [
    { x: 4, y: 16, nome: "Vitrine" },
    { x: 16, y: 14, nome: "Recepção" },
    { x: 10, y: 1.5, nome: "Entrada" },
  ],
  rural: [
    { x: 5, y: 12, nome: "Fileira A" },
    { x: 15, y: 12, nome: "Fileira B" },
    { x: 10, y: 18, nome: "Sensor" },
  ],
};

export function MiniMap({ robo, s }: { robo: Robo; s: EstadoRobo }) {
  const sc = 10; // 1 m = 10 units
  const px = s.x * sc;
  const py = (LIMITE - s.y) * sc;
  return (
    <svg
      viewBox={`-6 -6 ${LIMITE * sc + 12} ${LIMITE * sc + 12}`}
      className="w-full"
      role="img"
      aria-label={`Mapa da área: robô na posição ${s.x.toFixed(1)}, ${s.y.toFixed(1)} metros, rumo ${Math.round(s.heading)} graus.`}
    >
      <defs>
        <pattern id="mm-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--primary)" strokeOpacity="0.12" />
        </pattern>
      </defs>
      <rect
        x="0"
        y="0"
        width={LIMITE * sc}
        height={LIMITE * sc}
        fill="url(#mm-grid)"
        stroke="var(--primary)"
        strokeOpacity="0.5"
        strokeDasharray="4 3"
      />
      {robo.ambiente === "rural" ? (
        [40, 80, 120, 160].map((x) => (
          <rect
            key={x}
            x={x - 6}
            y="30"
            width="12"
            height="130"
            fill="var(--success)"
            opacity="0.18"
          />
        ))
      ) : (
        <rect x="130" y="40" width="60" height="22" rx="3" fill="var(--secondary)" opacity="0.25" />
      )}
      {PONTOS[robo.ambiente].map((p) => (
        <g key={p.nome}>
          <circle cx={p.x * sc} cy={(LIMITE - p.y) * sc} r="3.5" fill="var(--accent)" />
          <text
            x={p.x * sc + 6}
            y={(LIMITE - p.y) * sc + 3}
            fontSize="9"
            fill="var(--muted-foreground)"
            fontFamily="var(--font-mono)"
          >
            {p.nome}
          </text>
        </g>
      ))}
      <g
        transform={`translate(${px} ${py}) rotate(${s.heading})`}
        style={{ transition: "transform 0.4s ease-out" }}
      >
        <path d="M0 -40 L-22 -8 A40 40 0 0 1 22 -8 Z" fill="var(--primary)" opacity="0.12" />
        <circle r="7" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />
        <path d="M0 -11 L4 -4 L-4 -4 Z" fill="var(--primary)" />
      </g>
    </svg>
  );
}
