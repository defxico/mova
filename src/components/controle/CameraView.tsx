import { AlertTriangle, Octagon, WifiOff } from "lucide-react";
import type { Robo } from "@/lib/mova-data";
import type { EstadoRobo } from "@/lib/robot-sim";
import { cn } from "@/lib/utils";
import camUrbana from "@/assets/cam-urban.jpg";
import camRural from "@/assets/cam-rural.jpg";

const CARDEAIS = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];

export function CameraView({ robo, s, movendo, relogio }: { robo: Robo; s: EstadoRobo; movendo: boolean; relogio: string }) {
  const offset = ((s.heading + 180) % 360) - 180; // -180..180
  const panX = Math.max(-14, Math.min(14, (-offset / 90) * 14));
  const zoom = 1.32 + Math.max(-0.2, Math.min(0.5, (s.y - 4) / 30));
  const tiltY = (s.cameraTilt / 30) * 8;
  const urbano = robo.ambiente === "urbano";
  const conectado = s.conexao === "conectado";

  return (
    <figure
      className="scanlines relative aspect-video w-full overflow-hidden rounded-lg border border-primary/40 bg-background glow-primary"
      aria-label={`Câmera simulada do robô ${robo.nome}`}
    >
      {/* Feed */}
      <div
        className={cn("absolute inset-0 transition-transform duration-500 ease-out", movendo && "blur-[1px]")}
        style={{ transform: `translate(${panX}%, ${tiltY}%) scale(${zoom})` }}
      >
        <img
          src={urbano ? camUrbana : camRural}
          alt={urbano ? "Recepção de uma loja vista pela câmera do robô, com uma cliente se aproximando." : "Corredor de uma estufa de alfaces vista pela câmera do robô, com um trabalhador ao fundo."}
          className={cn("h-full w-full object-cover transition-[filter] duration-700", !conectado && "grayscale brightness-[0.25]")}
        />
        {conectado && (
          <div
            className="absolute border-2 border-primary"
            style={urbano ? { left: "28%", top: "24%", width: "11%", height: "36%" } : { left: "41%", top: "27%", width: "7%", height: "10%" }}
            aria-hidden="true"
          >
            <span className="absolute -top-5 left-0 whitespace-nowrap bg-primary px-1 font-mono text-[0.55rem] font-semibold text-primary-foreground">
              {urbano ? "VISITANTE · 4,2 m" : "EQUIPE · 18 m"}
            </span>
          </div>
        )}
      </div>

      {/* HUD overlay */}
      {conectado && (
        <div className="pointer-events-none absolute inset-0 font-mono text-[0.65rem] text-primary sm:text-xs" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-primary/10 to-transparent animate-scan" />
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded bg-background/70 px-2 py-1">
            <span className="size-2 rounded-full bg-accent animate-pulse" /> CAM-01 · {robo.nome}
          </div>
          <div className="absolute right-3 top-3 rounded bg-background/70 px-2 py-1">{relogio}</div>
          {/* crosshair */}
          <div className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute left-1/2 top-0 h-4 w-px bg-primary" />
            <div className="absolute bottom-0 left-1/2 h-4 w-px bg-primary" />
            <div className="absolute left-0 top-1/2 h-px w-4 bg-primary" />
            <div className="absolute right-0 top-1/2 h-px w-4 bg-primary" />
            <div className="absolute inset-5 rounded-full border border-primary/60" />
          </div>
          {/* tilt gauge */}
          <div className="absolute right-3 top-1/2 h-28 w-1 -translate-y-1/2 rounded bg-primary/20">
            <div className="absolute left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-primary transition-all" style={{ top: `${50 - (s.cameraTilt / 30) * 50}%`, transform: "translate(-50%, -50%)" }} />
          </div>
          {/* compass strip */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            <div className="flex items-center gap-3 rounded bg-background/75 px-3 py-1">
              <span>RUMO {String(Math.round(s.heading)).padStart(3, "0")}°</span>
              <span className="text-foreground">{CARDEAIS[Math.round(s.heading / 45) % 8]}</span>
              <span className="text-muted-foreground">X {s.x.toFixed(1)} · Y {s.y.toFixed(1)}</span>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 hidden rounded bg-background/70 px-2 py-1 sm:block">VEL {s.velocidade} · {robo.velocidadeMax}</div>
          <div className="absolute bottom-3 right-3 hidden rounded bg-background/70 px-2 py-1 sm:block">INCL {s.cameraTilt > 0 ? "+" : ""}{s.cameraTilt}°</div>
        </div>
      )}

      {/* Simulation watermark */}
      <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded border border-warning/60 bg-background/80 px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-widest text-warning sm:text-[0.7rem]">
        Simulação · nenhum robô físico conectado
      </div>

      {/* States */}
      {s.conexao !== "conectado" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
          <WifiOff className={cn("size-12 text-muted-foreground", s.conexao === "conectando" && "animate-pulse text-primary")} aria-hidden="true" />
          <p className="font-display text-lg font-bold tracking-widest sm:text-2xl">
            {s.conexao === "conectando" ? "ESTABELECENDO LINK…" : "SEM SINAL DE VÍDEO"}
          </p>
          <p className="max-w-xs text-sm text-muted-foreground">
            {s.conexao === "conectando" ? "Autenticando operador e abrindo canal de vídeo." : "Conecte-se ao robô para iniciar a operação."}
          </p>
        </div>
      )}
      {s.modo === "emergencia" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-accent/25 text-center backdrop-blur-[2px]" role="status">
          <Octagon className="size-14 text-accent-foreground" aria-hidden="true" />
          <p className="font-display text-xl font-black tracking-widest sm:text-3xl">PARADA DE EMERGÊNCIA</p>
          <p className="text-sm">Motores travados. Use “Retomar operação” quando for seguro.</p>
        </div>
      )}
      {s.ultimoBloqueio && s.modo !== "emergencia" && conectado && (
        <div className="absolute inset-x-4 top-12 flex items-center gap-2 rounded border border-warning/70 bg-background/85 px-3 py-2 text-sm text-warning">
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" /> {s.ultimoBloqueio}
        </div>
      )}
    </figure>
  );
}
