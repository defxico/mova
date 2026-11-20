// Pure state machine for the simulated robot. No physical robot is connected.

export type Direcao = "frente" | "tras" | "esquerda" | "direita";
export type Conexao = "desconectado" | "conectando" | "conectado";
export type Modo = "operando" | "parado" | "emergencia";

export interface EstadoRobo {
  x: number; // metres, 0..LIMITE
  y: number;
  heading: number; // degrees, 0 = north
  cameraTilt: number; // -30..30
  velocidade: 1 | 2 | 3;
  bateria: number;
  conexao: Conexao;
  modo: Modo;
  passos: number;
  ultimoBloqueio: string | null;
}

export const LIMITE = 20;

export const ESTADO_INICIAL: EstadoRobo = {
  x: 10,
  y: 4,
  heading: 0,
  cameraTilt: 0,
  velocidade: 1,
  bateria: 92,
  conexao: "desconectado",
  modo: "parado",
  passos: 0,
  ultimoBloqueio: null,
};

export type AcaoRobo =
  | { tipo: "conectar" }
  | { tipo: "conectado" }
  | { tipo: "desconectar" }
  | { tipo: "mover"; direcao: Direcao }
  | { tipo: "inclinar"; delta: number }
  | { tipo: "velocidade"; valor: 1 | 2 | 3 }
  | { tipo: "emergencia" }
  | { tipo: "retomar" }
  | { tipo: "tick" }
  | { tipo: "reset"; bateria?: number };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const round = (v: number) => Math.round(v * 100) / 100;

export function podeMover(s: EstadoRobo): string | null {
  if (s.conexao !== "conectado") return "Conecte-se ao robô antes de mover.";
  if (s.modo === "emergencia") return "Parada de emergência ativa. Retome a operação para mover.";
  if (s.bateria <= 5) return "Bateria crítica. O robô voltou para a base de recarga.";
  return null;
}

export function reduzirRobo(s: EstadoRobo, a: AcaoRobo): EstadoRobo {
  switch (a.tipo) {
    case "conectar":
      return s.conexao === "desconectado" ? { ...s, conexao: "conectando" } : s;
    case "conectado":
      return { ...s, conexao: "conectado", modo: "operando", ultimoBloqueio: null };
    case "desconectar":
      return { ...s, conexao: "desconectado", modo: "parado" };
    case "velocidade":
      return { ...s, velocidade: a.valor };
    case "inclinar":
      if (s.conexao !== "conectado") return s;
      return { ...s, cameraTilt: clamp(s.cameraTilt + a.delta, -30, 30) };
    case "emergencia":
      return { ...s, modo: "emergencia", ultimoBloqueio: null };
    case "retomar":
      return s.modo === "emergencia" && s.conexao === "conectado" ? { ...s, modo: "operando" } : s;
    case "tick":
      if (s.conexao !== "conectado") return s;
      return { ...s, bateria: round(clamp(s.bateria - 0.05, 0, 100)) };
    case "reset":
      return { ...ESTADO_INICIAL, bateria: a.bateria ?? ESTADO_INICIAL.bateria };
    case "mover": {
      const bloqueio = podeMover(s);
      if (bloqueio) return { ...s, ultimoBloqueio: bloqueio };
      if (a.direcao === "esquerda" || a.direcao === "direita") {
        const giro = a.direcao === "esquerda" ? -15 : 15;
        return {
          ...s,
          heading: (s.heading + giro + 360) % 360,
          passos: s.passos + 1,
          ultimoBloqueio: null,
        };
      }
      const passo = 0.5 * s.velocidade * (a.direcao === "frente" ? 1 : -1);
      const rad = (s.heading * Math.PI) / 180;
      const nx = round(s.x + Math.sin(rad) * passo);
      const ny = round(s.y + Math.cos(rad) * passo);
      if (nx < 0 || nx > LIMITE || ny < 0 || ny > LIMITE) {
        return {
          ...s,
          ultimoBloqueio: "Obstáculo detectado: limite da área segura. O robô não avançou.",
        };
      }
      return {
        ...s,
        x: nx,
        y: ny,
        passos: s.passos + 1,
        bateria: round(clamp(s.bateria - 0.1 * s.velocidade, 0, 100)),
        ultimoBloqueio: null,
      };
    }
  }
}
