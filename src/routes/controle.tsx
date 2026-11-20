import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BatteryMedium,
  Camera,
  ChevronDown,
  ChevronUp,
  Hand,
  Keyboard,
  Mic,
  MicOff,
  Octagon,
  Play,
  Power,
  PowerOff,
  ScanLine,
  Send,
  Timer,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HudPanel, StatusDot } from "@/components/mova/Hud";
import { CameraView } from "@/components/controle/CameraView";
import { MiniMap } from "@/components/controle/MiniMap";
import { ROBOS, getRobo, podeSimular, type Robo } from "@/lib/mova-data";
import { ESTADO_INICIAL, reduzirRobo, type Direcao } from "@/lib/robot-sim";
import { acoes, useMova } from "@/lib/mova-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/controle")({
  validateSearch: (s: Record<string, unknown>): { robo?: string } =>
    typeof s["robo"] === "string" && getRobo(s["robo"]) ? { robo: s["robo"] } : {},
  head: () => ({
    meta: [
      { title: "Central de controle do robô (simulação) — MOVA" },
      {
        name: "description",
        content:
          "Simulador acessível de controle remoto de robôs de telepresença: câmera, direcionais, comunicação, status de conexão e parada de emergência.",
      },
      { property: "og:title", content: "Central de controle do robô — MOVA" },
      {
        property: "og:description",
        content:
          "Experimente controlar um robô de telepresença em uma loja ou em uma estufa — por teclado, toque ou varredura.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ControlePage,
});

type Log = {
  id: number;
  hora: string;
  tipo: "sistema" | "voce" | "ambiente" | "alerta";
  texto: string;
};

const FRASES = {
  urbano: [
    "Olá! Seja bem-vinda(o) à loja.",
    "Posso ajudar a encontrar algo?",
    "Vou chamar um consultor para você.",
  ],
  rural: [
    "Equipe, iniciando ronda na estufa 3.",
    "Atenção: fileira B com solo seco.",
    "Ronda concluída, tudo em ordem.",
  ],
};
const RESPOSTAS = {
  urbano: [
    "Visitante: “Obrigada! Estou procurando a coleção nova.”",
    "Visitante: “Que legal falar com você por aqui!”",
    "Visitante: “Pode me mostrar onde ficam os provadores?”",
  ],
  rural: [
    "Equipe (rádio): “Recebido, seguimos para lá.”",
    "Equipe (rádio): “Entendido, vou ligar a irrigação.”",
    "Equipe (rádio): “Valeu! Bom trabalho.”",
  ],
};

const ROTULO_DIR: Record<Direcao, string> = {
  frente: "Avançar",
  tras: "Recuar",
  esquerda: "Girar à esquerda",
  direita: "Girar à direita",
};

const horaAgora = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
const fmtDur = (ms: number) => {
  const t = Math.floor(ms / 1000);
  return `${String(Math.floor(t / 3600)).padStart(2, "0")}:${String(Math.floor((t % 3600) / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

function ControlePage() {
  const { robo: roboId } = Route.useSearch();
  const robo = (getRobo(roboId) ?? ROBOS[0]) as Robo;
  // Remount the console when the robot changes so state starts fresh.
  return <Console key={robo.id} robo={robo} />;
}

function Console({ robo }: { robo: Robo }) {
  const navigate = useNavigate();
  const a11y = useMova((s) => s.a11y);
  const [s, dispatch] = useReducer(reduzirRobo, { ...ESTADO_INICIAL, bateria: robo.bateria });
  const [latencia, setLatencia] = useState(48);
  const [log, setLog] = useState<Log[]>([
    {
      id: 0,
      hora: "--:--:--",
      tipo: "sistema",
      texto: `Console pronto. Robô selecionado: ${robo.nome} (${robo.local}).`,
    },
  ]);
  const [mic, setMic] = useState(false);
  const [msg, setMsg] = useState("");
  const [inicio, setInicio] = useState<number | null>(null);
  const [agora, setAgora] = useState(() => Date.now());
  const [movendo, setMovendo] = useState(false);
  const [anuncio, setAnuncio] = useState("");
  const [interacoes, setInteracoes] = useState(0);
  const [resumo, setResumo] = useState<null | { dur: string; acoes: number; robo: string }>(null);
  const painelRef = useRef<HTMLDivElement>(null);
  const logId = useRef(1);
  const stateRef = useRef(s);
  stateRef.current = s;

  const conectado = s.conexao === "conectado";
  const emergencia = s.modo === "emergencia";
  const disponivel = podeSimular(robo);

  const addLog = useCallback((tipo: Log["tipo"], texto: string) => {
    setLog((l) => [{ id: logId.current++, hora: horaAgora(), tipo, texto }, ...l].slice(0, 40));
  }, []);

  // Clock + telemetry
  useEffect(() => {
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!conectado) return;
    const t = setInterval(() => {
      setLatencia(Math.round(32 + Math.random() * 40));
      dispatch({ tipo: "tick" });
    }, 1500);
    return () => clearInterval(t);
  }, [conectado]);

  const conectar = () => {
    if (!disponivel) return;
    dispatch({ tipo: "conectar" });
    addLog("sistema", "Autenticando operador…");
    setAnuncio("Conectando ao robô.");
    setTimeout(() => addLog("sistema", "Canal de vídeo e áudio criptografado aberto."), 700);
    setTimeout(() => {
      dispatch({ tipo: "conectado" });
      setInicio(Date.now());
      addLog("sistema", `Conectado a ${robo.nome}. Operação iniciada.`);
      setAnuncio(`Conectado a ${robo.nome}. Você já pode mover o robô.`);
      toast.success(`Conectado a ${robo.nome}`, { description: "Lembrete: esta é uma simulação." });
    }, 1600);
  };

  const mover = useCallback(
    (d: Direcao, silencioso = false) => {
      const antes = stateRef.current;
      const depois = reduzirRobo(antes, { tipo: "mover", direcao: d });
      dispatch({ tipo: "mover", direcao: d });
      if (depois.ultimoBloqueio) {
        if (!silencioso) setAnuncio(depois.ultimoBloqueio);
        if (depois.ultimoBloqueio !== antes.ultimoBloqueio) addLog("alerta", depois.ultimoBloqueio);
        return;
      }
      setMovendo(true);
      setTimeout(() => setMovendo(false), 280);
      if (!silencioso)
        setAnuncio(
          `${ROTULO_DIR[d]}. Posição ${depois.x.toFixed(1)}, ${depois.y.toFixed(1)}. Rumo ${Math.round(depois.heading)} graus.`,
        );
    },
    [addLog],
  );

  const emergenciaAcionar = useCallback(() => {
    dispatch({ tipo: "emergencia" });
    addLog("alerta", "PARADA DE EMERGÊNCIA acionada pelo operador. Motores travados.");
    setAnuncio("Parada de emergência acionada. Motores travados.");
    toast.error("Parada de emergência acionada", { description: "O robô parou imediatamente." });
  }, [addLog]);

  const retomar = () => {
    dispatch({ tipo: "retomar" });
    addLog("sistema", "Operação retomada após verificação de segurança.");
    setAnuncio("Operação retomada.");
  };

  const falar = (texto: string) => {
    if (!conectado || emergencia) return;
    addLog("voce", texto);
    setInteracoes((n) => n + 1);
    setAnuncio(`Mensagem enviada pelo robô: ${texto}`);
    const r = RESPOSTAS[robo.ambiente];
    setTimeout(() => addLog("ambiente", r[Math.floor(Math.random() * r.length)] ?? ""), 1400);
  };

  const encerrar = () => {
    const dur = inicio ? Date.now() - inicio : 0;
    const totalAcoes = s.passos + interacoes;
    if (inicio) {
      acoes.registrarOperacao({
        id: `op-${Date.now()}`,
        data: new Date().toISOString(),
        roboId: robo.id,
        local: robo.local,
        duracaoMin: Math.max(1, Math.round(dur / 60000)),
        acoes: totalAcoes,
        resumo: `Sessão no simulador: ${s.passos} movimentos e ${interacoes} interações.`,
      });
    }
    dispatch({ tipo: "desconectar" });
    addLog("sistema", "Operação encerrada. Robô retornando à base.");
    setAnuncio("Operação encerrada.");
    setResumo({ dur: fmtDur(dur), acoes: totalAcoes, robo: robo.nome });
    setInicio(null);
    setInteracoes(0);
    dispatch({ tipo: "reset", bateria: s.bateria });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const digitando = el.closest("input, textarea, select, [role=radio], [role=dialog]");
      if (
        e.key === "Escape" &&
        stateRef.current.conexao === "conectado" &&
        stateRef.current.modo !== "emergencia" &&
        !el.closest("[role=dialog]")
      ) {
        emergenciaAcionar();
        return;
      }
      if (digitando || !a11y.atalhosTeclado || a11y.modoControle === "varredura") return;
      const mapa: Record<string, Direcao> = {
        ArrowUp: "frente",
        w: "frente",
        W: "frente",
        ArrowDown: "tras",
        s: "tras",
        S: "tras",
        ArrowLeft: "esquerda",
        a: "esquerda",
        A: "esquerda",
        ArrowRight: "direita",
        d: "direita",
        D: "direita",
      };
      const dir = mapa[e.key];
      if (dir && stateRef.current.conexao === "conectado") {
        e.preventDefault();
        mover(dir, e.repeat);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [a11y.atalhosTeclado, a11y.modoControle, mover, emergenciaAcionar]);

  // Scanning (single-switch) mode
  const [scanIdx, setScanIdx] = useState(0);
  const scanAtivo = a11y.modoControle === "varredura" && conectado;
  useEffect(() => {
    const root = painelRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-scan]")).filter(
      (el) => !(el as HTMLButtonElement).disabled,
    );
    root
      .querySelectorAll("[data-scan-active]")
      .forEach((el) => el.removeAttribute("data-scan-active"));
    if (!scanAtivo || els.length === 0) return;
    const atual = els[scanIdx % els.length];
    if (!atual) return;
    atual.setAttribute("data-scan-active", "true");
    const t = setTimeout(() => setScanIdx((i) => (i + 1) % els.length), a11y.intervaloVarredura);
    return () => clearTimeout(t);
  }, [scanAtivo, scanIdx, a11y.intervaloVarredura, s.modo]);

  const acionarSelecao = useCallback(() => {
    const el = painelRef.current?.querySelector<HTMLElement>("[data-scan-active=true]");
    if (el) {
      el.click();
      setAnuncio(`Acionado: ${el.getAttribute("aria-label") ?? el.textContent ?? ""}`);
    }
  }, []);
  useEffect(() => {
    if (!scanAtivo) return;
    const h = (e: KeyboardEvent) => {
      if (
        (e.key === " " || e.key === "Enter") &&
        !(e.target as HTMLElement).closest("input, textarea, select, [role=dialog]")
      ) {
        e.preventDefault();
        acionarSelecao();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [scanAtivo, acionarSelecao]);

  const sinal = latencia < 50 ? 4 : latencia < 65 ? 3 : 2;
  const bloqueado = !conectado || emergencia;

  return (
    <div className="bg-grid">
      <h1 className="sr-only">Central de controle do robô {robo.nome} — simulação</h1>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {anuncio}
      </p>

      {/* Top command bar */}
      <div className="border-b border-border bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 max-w-full items-center gap-3">
            <span className="label-hud !text-primary">// tela 04</span>
            <Label htmlFor="sel-robo" className="sr-only">
              Escolher robô
            </Label>
            <select
              id="sel-robo"
              value={robo.id}
              onChange={(e) => navigate({ to: "/controle", search: { robo: e.target.value } })}
              className="tap-target h-10 min-w-0 max-w-full rounded-md border border-input bg-surface px-3 font-display text-sm tracking-wider"
            >
              {ROBOS.map((r) => (
                <option key={r.id} value={r.id} disabled={!podeSimular(r)}>
                  {r.nome} · {r.ambiente} {!podeSimular(r) ? "(manutenção)" : ""}
                </option>
              ))}
            </select>
            <span className="hidden text-sm text-muted-foreground md:inline">{robo.local}</span>
          </div>
          <Badge variant="warning" className="gap-1.5">
            Simulação
          </Badge>

          <dl className="ml-auto flex flex-wrap items-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Conexão</dt>
              <StatusDot
                tone={conectado ? "success" : s.conexao === "conectando" ? "warning" : "muted"}
                pulse={conectado}
              />
              <dd className="uppercase tracking-wider">{s.conexao}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt>
                <Wifi className="size-4 text-primary" aria-label="Sinal e latência" />
              </dt>
              <dd className="flex items-center gap-1.5">
                <span className="flex items-end gap-0.5" aria-hidden="true">
                  {[1, 2, 3, 4].map((b) => (
                    <span
                      key={b}
                      className={cn(
                        "w-1 rounded-sm",
                        b <= (conectado ? sinal : 0) ? "bg-primary" : "bg-muted",
                      )}
                      style={{ height: 4 + b * 3 }}
                    />
                  ))}
                </span>
                {conectado ? `${latencia} ms` : "— ms"}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <dt>
                <BatteryMedium className="size-4 text-primary" aria-label="Bateria" />
              </dt>
              <dd>{s.bateria.toFixed(0)}%</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt>
                <Timer className="size-4 text-primary" aria-label="Tempo de operação" />
              </dt>
              <dd>{inicio ? fmtDur(agora - inicio) : "00:00:00"}</dd>
            </div>
          </dl>
          {conectado ? (
            <Button variant="outline" size="sm" onClick={encerrar} data-scan>
              <PowerOff aria-hidden="true" /> Encerrar operação
            </Button>
          ) : (
            <Button
              variant="neon"
              size="sm"
              onClick={conectar}
              disabled={s.conexao === "conectando" || !disponivel}
            >
              <Power aria-hidden="true" />{" "}
              {s.conexao === "conectando" ? "Conectando…" : "Conectar ao robô"}
            </Button>
          )}
        </div>
      </div>

      <div
        ref={painelRef}
        className="mx-auto grid max-w-[1600px] gap-4 px-4 py-4 sm:px-6 xl:grid-cols-[300px_1fr_360px]"
      >
        {/* Camera — first on mobile */}
        <div className="space-y-4 xl:order-2">
          <CameraView
            robo={robo}
            s={s}
            movendo={movendo}
            relogio={new Date(agora).toLocaleTimeString("pt-BR")}
          />

          {/* Emergency row */}
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            {emergencia ? (
              <Button variant="neon" size="xl" className="h-16 text-sm" onClick={retomar} data-scan>
                <Play aria-hidden="true" /> Retomar operação
              </Button>
            ) : (
              <Button
                variant="emergency"
                size="xl"
                className="h-16 text-base"
                onClick={emergenciaAcionar}
                disabled={!conectado}
                aria-keyshortcuts="Escape"
                data-scan
              >
                <Octagon className="!size-6" aria-hidden="true" /> Parada de emergência
                <span className="hidden font-mono text-xs font-normal opacity-80 sm:inline">
                  [Esc]
                </span>
              </Button>
            )}
            {scanAtivo && (
              <Button variant="violet" size="xl" className="h-16" onClick={acionarSelecao}>
                <ScanLine aria-hidden="true" /> Acionar seleção
              </Button>
            )}
          </div>

          {/* Robot screen preview + comms log */}
          <HudPanel title="Registro de comunicação" code="COM.LOG" bodyClassName="p-0">
            <ol
              className="max-h-56 space-y-0 overflow-y-auto font-mono text-xs"
              aria-label="Histórico de mensagens e eventos"
            >
              {log.map((l) => (
                <li
                  key={l.id}
                  className="flex gap-3 border-b border-border/60 px-4 py-2 last:border-0"
                >
                  <span className="shrink-0 text-muted-foreground">{l.hora}</span>
                  <span
                    className={cn(
                      "shrink-0 uppercase",
                      l.tipo === "sistema" && "text-primary",
                      l.tipo === "voce" && "text-secondary",
                      l.tipo === "ambiente" && "text-success",
                      l.tipo === "alerta" && "text-accent",
                    )}
                  >
                    {l.tipo === "voce" ? "você" : l.tipo}
                  </span>
                  <span className="text-foreground">{l.texto}</span>
                </li>
              ))}
            </ol>
          </HudPanel>
        </div>

        {/* Left: status + map */}
        <div className="space-y-4 xl:order-1">
          <HudPanel title="Status operacional" code="SYS.01">
            <dl className="grid grid-cols-2 gap-3 font-mono text-xs">
              {[
                ["Modo", emergencia ? "EMERGÊNCIA" : conectado ? "OPERANDO" : "EM ESPERA"],
                ["Tipo", robo.tipo],
                ["Posição", `${s.x.toFixed(1)} , ${s.y.toFixed(1)} m`],
                ["Rumo", `${Math.round(s.heading)}°`],
                ["Velocidade", `Nível ${s.velocidade}`],
                ["Movimentos", String(s.passos)],
              ].map(([k, v]) => (
                <div key={k} className="rounded border border-border bg-background/40 p-2">
                  <dt className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    {k}
                  </dt>
                  <dd
                    className={cn(
                      "mt-0.5 truncate text-sm",
                      k === "Modo" && emergencia && "text-accent",
                      k === "Modo" && conectado && !emergencia && "text-success",
                    )}
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-muted-foreground">BATERIA</span>
                <span>{s.bateria.toFixed(1)}%</span>
              </div>
              <div
                className="mt-1 h-2 overflow-hidden rounded-full bg-muted"
                role="meter"
                aria-label="Bateria do robô"
                aria-valuenow={Math.round(s.bateria)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    s.bateria > 30 ? "bg-primary" : "bg-warning",
                  )}
                  style={{ width: `${s.bateria}%` }}
                />
              </div>
            </div>
          </HudPanel>
          <HudPanel title="Mapa da área" code="NAV.MAP">
            <MiniMap robo={robo} s={s} />
            <p className="mt-2 text-xs text-muted-foreground">
              Linha tracejada: limite da área segura. Pontos magenta: locais de interesse.
            </p>
          </HudPanel>
        </div>

        {/* Right: controls */}
        <div className="space-y-4 xl:order-3">
          <HudPanel
            title="Movimentação"
            code="DRV.CTL"
            actions={
              <Badge variant="cyan" className="gap-1">
                {a11y.modoControle === "clique" ? (
                  <Keyboard className="size-3" aria-hidden="true" />
                ) : a11y.modoControle === "segurar" ? (
                  <Hand className="size-3" aria-hidden="true" />
                ) : (
                  <ScanLine className="size-3" aria-hidden="true" />
                )}
                {a11y.modoControle === "clique" ? "toque" : a11y.modoControle}
              </Badge>
            }
          >
            <div className="mx-auto grid w-fit grid-cols-3 gap-2">
              <span />
              <DirButton
                dir="frente"
                icon={ArrowUp}
                onMove={mover}
                disabled={bloqueado}
                hold={a11y.modoControle === "segurar"}
              />
              <span />
              <DirButton
                dir="esquerda"
                icon={ArrowLeft}
                onMove={mover}
                disabled={bloqueado}
                hold={a11y.modoControle === "segurar"}
              />
              <div
                className="flex size-16 items-center justify-center rounded-full border border-primary/40 font-mono text-[0.6rem] text-muted-foreground sm:size-20"
                aria-hidden="true"
              >
                {String(Math.round(s.heading)).padStart(3, "0")}°
              </div>
              <DirButton
                dir="direita"
                icon={ArrowRight}
                onMove={mover}
                disabled={bloqueado}
                hold={a11y.modoControle === "segurar"}
              />
              <span />
              <DirButton
                dir="tras"
                icon={ArrowDown}
                onMove={mover}
                disabled={bloqueado}
                hold={a11y.modoControle === "segurar"}
              />
              <span />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {a11y.modoControle === "varredura"
                ? "Modo varredura: aperte Espaço, Enter ou “Acionar seleção” quando o controle desejado estiver destacado."
                : a11y.modoControle === "segurar"
                  ? "Pressione e segure para o robô andar continuamente."
                  : "Teclado: setas ou W A S D. Esc para emergência."}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <fieldset>
                <legend className="label-hud mb-1.5">Câmera</legend>
                <div className="flex gap-2">
                  <Button
                    variant="hud"
                    size="icon"
                    className="size-11"
                    aria-label="Inclinar câmera para cima"
                    onClick={() => dispatch({ tipo: "inclinar", delta: 10 })}
                    disabled={bloqueado}
                    data-scan
                  >
                    <ChevronUp aria-hidden="true" />
                  </Button>
                  <Button
                    variant="hud"
                    size="icon"
                    className="size-11"
                    aria-label="Inclinar câmera para baixo"
                    onClick={() => dispatch({ tipo: "inclinar", delta: -10 })}
                    disabled={bloqueado}
                    data-scan
                  >
                    <ChevronDown aria-hidden="true" />
                  </Button>
                </div>
              </fieldset>
              <fieldset>
                <legend className="label-hud mb-1.5">Velocidade</legend>
                <div className="flex gap-1" role="radiogroup" aria-label="Velocidade">
                  {([1, 2, 3] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={s.velocidade === v}
                      aria-label={`Velocidade ${v}`}
                      onClick={() => dispatch({ tipo: "velocidade", valor: v })}
                      className={cn(
                        "tap-target size-11 rounded-md border font-mono text-sm",
                        s.velocidade === v
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-border",
                      )}
                      data-scan
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </HudPanel>

          <HudPanel title="Interação" code="VOX.IO">
            <div className="flex gap-2">
              <Button
                variant={mic ? "neon" : "hud"}
                className="flex-1"
                aria-pressed={mic}
                disabled={bloqueado}
                onClick={() => {
                  setMic((m) => !m);
                  addLog(
                    "sistema",
                    mic ? "Microfone fechado." : "Microfone aberto: o ambiente ouve você.",
                  );
                }}
                data-scan
              >
                {mic ? <Mic aria-hidden="true" /> : <MicOff aria-hidden="true" />}{" "}
                {mic ? "Microfone aberto" : "Abrir microfone"}
              </Button>
              <Button
                variant="hud"
                disabled={bloqueado}
                onClick={() => {
                  setInteracoes((n) => n + 1);
                  addLog(
                    "voce",
                    robo.ambiente === "urbano"
                      ? "📸 Foto da vitrine registrada."
                      : "📸 Foto enviada ao supervisor agrícola.",
                  );
                  toast("Foto registrada pelo robô.");
                }}
                data-scan
                aria-label="Registrar foto"
              >
                <Camera aria-hidden="true" /> Foto
              </Button>
            </div>
            {mic && conectado && (
              <div className="mt-3 flex h-6 items-end gap-1" aria-hidden="true">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 animate-pulse rounded-sm bg-primary"
                    style={{
                      height: `${20 + ((i * 37 + agora / 100) % 80)}%`,
                      animationDelay: `${i * 60}ms`,
                    }}
                  />
                ))}
              </div>
            )}
            <p className="label-hud mb-2 mt-4">Frases rápidas</p>
            <div className="space-y-2">
              {FRASES[robo.ambiente].map((f) => (
                <Button
                  key={f}
                  variant="outline"
                  className="h-auto w-full justify-start whitespace-normal py-2.5 text-left font-normal"
                  disabled={bloqueado}
                  onClick={() => falar(f)}
                  data-scan
                >
                  <Send className="text-primary" aria-hidden="true" /> {f}
                </Button>
              ))}
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!msg.trim()) return;
                falar(msg.trim());
                setMsg("");
              }}
            >
              <Label htmlFor="msg-robo" className="sr-only">
                Mensagem para exibir e falar pelo robô
              </Label>
              <Input
                id="msg-robo"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Escreva para o robô falar…"
                disabled={bloqueado}
                className="tap-target h-11 bg-surface/70"
              />
              <Button
                type="submit"
                variant="neon"
                size="icon"
                className="size-11"
                disabled={bloqueado || !msg.trim()}
                aria-label="Enviar mensagem"
              >
                <Send aria-hidden="true" />
              </Button>
            </form>
          </HudPanel>

          <p className="text-xs text-muted-foreground">
            Prefere outro jeito de controlar? Ajuste em <strong>Acessibilidade</strong>, no topo da
            página: toque único, pressionar e segurar, ou varredura com acionador único.
          </p>
        </div>
      </div>

      <Dialog open={!!resumo} onOpenChange={(o) => !o && setResumo(null)}>
        <DialogContent className="border-border bg-popover">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider">Operação encerrada</DialogTitle>
            <DialogDescription>
              A sessão foi registrada no histórico do seu painel.
            </DialogDescription>
          </DialogHeader>
          {resumo && (
            <dl className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="rounded border border-border p-3">
                <dt className="text-[0.65rem] uppercase text-muted-foreground">Robô</dt>
                <dd className="mt-1 text-sm">{resumo.robo}</dd>
              </div>
              <div className="rounded border border-border p-3">
                <dt className="text-[0.65rem] uppercase text-muted-foreground">Duração</dt>
                <dd className="mt-1 text-sm">{resumo.dur}</dd>
              </div>
              <div className="rounded border border-border p-3">
                <dt className="text-[0.65rem] uppercase text-muted-foreground">Ações</dt>
                <dd className="mt-1 text-sm">{resumo.acoes}</dd>
              </div>
            </dl>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="hud" onClick={() => setResumo(null)}>
              Continuar aqui
            </Button>
            <Button asChild variant="neon">
              <Link to="/painel">Ver meu painel</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DirButton({
  dir,
  icon: Icon,
  onMove,
  disabled,
  hold,
}: {
  dir: Direcao;
  icon: typeof ArrowUp;
  onMove: (d: Direcao, silencioso?: boolean) => void;
  disabled: boolean;
  hold: boolean;
}) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const parar = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
      onMove(dir); // final announced step
    }
  };
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  return (
    <button
      type="button"
      aria-label={ROTULO_DIR[dir]}
      disabled={disabled}
      data-scan
      onClick={(e) => {
        // In hold mode pointer handlers move; keyboard "click" (detail 0) still steps once.
        if (!hold || e.detail === 0) onMove(dir);
      }}
      onPointerDown={(e) => {
        if (!hold || disabled) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        onMove(dir, true);
        timer.current = setInterval(() => onMove(dir, true), 220);
      }}
      onPointerUp={parar}
      onPointerCancel={parar}
      className={cn(
        "tap-target flex size-16 flex-col items-center justify-center gap-0.5 rounded-lg border border-primary/50 bg-surface/80 text-primary transition-all sm:size-20",
        "hover:bg-primary/15 hover:shadow-[var(--glow-primary)] active:scale-95 active:bg-primary active:text-primary-foreground",
        "disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:opacity-50",
      )}
    >
      <Icon className="size-7" aria-hidden="true" />
      <span className="font-mono text-[0.55rem] uppercase tracking-wider">
        {dir === "tras" ? "trás" : dir}
      </span>
    </button>
  );
}
