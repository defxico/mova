import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Accessibility, BatteryMedium, Gamepad2, Gauge, MapPin, MessageSquare, Move, Timer, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageIntro, StatusDot } from "@/components/mova/Hud";
import { RobotArt } from "@/components/mova/RobotArt";
import { ROBOS, type Ambiente } from "@/lib/mova-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/robos")({
  head: () => ({
    meta: [
      { title: "Central de robôs de telepresença — MOVA" },
      { name: "description", content: "Catálogo de robôs de telepresença do MOVA: localização, recursos de movimentação, comunicação e compatibilidade com tecnologias assistivas." },
      { property: "og:title", content: "Central de robôs de telepresença — MOVA" },
      { property: "og:description", content: "Conheça os robôs que levam profissionais a lojas, museus, prefeituras, estufas e fazendas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RobosPage,
});

const STATUS = {
  "disponível": { tone: "success" as const, badge: "success" as const },
  "em operação": { tone: "primary" as const, badge: "cyan" as const },
  "manutenção": { tone: "warning" as const, badge: "warning" as const },
};

function RobosPage() {
  const [amb, setAmb] = useState<Ambiente | "todos">("todos");
  const lista = ROBOS.filter((r) => amb === "todos" || r.ambiente === amb);
  return (
    <>
      <PageIntro
        eyebrow="central de robôs"
        title={<>A frota que leva <span className="text-neon">pessoas a lugares</span></>}
        aside={
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            {(["disponível", "em operação", "manutenção"] as const).map((s) => (
              <div key={s} className="glass rounded-md px-3 py-2 text-center">
                <p className="text-xl font-bold">{ROBOS.filter((r) => r.status === s).length}</p>
                <p className="uppercase tracking-wider text-muted-foreground">{s}</p>
              </div>
            ))}
          </div>
        }
      >
        Cada robô fica em um ambiente parceiro. Os recursos e a compatibilidade com tecnologias assistivas aparecem em cada ficha.
      </PageIntro>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Filtrar por ambiente">
          {(["todos", "urbano", "rural"] as const).map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={amb === a}
              onClick={() => setAmb(a)}
              className={cn("tap-target rounded-full border px-5 py-2 text-sm capitalize transition-colors", amb === a ? "border-primary bg-primary/15 text-primary" : "border-border hover:border-primary/60")}
            >
              {a}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">{lista.length} robôs exibidos</p>

        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lista.map((r) => (
            <li key={r.id}>
              <article className="glass hud-frame flex h-full flex-col rounded-lg" aria-labelledby={`robo-${r.id}`}>
                <div className="relative flex items-center justify-center border-b border-border bg-grid py-6">
                  <RobotArt ambiente={r.ambiente} className="h-28 animate-float" />
                  <Badge variant={STATUS[r.status].badge} className="absolute left-3 top-3 gap-1.5">
                    <StatusDot tone={STATUS[r.status].tone} pulse={r.status === "em operação"} /> {r.status}
                  </Badge>
                  <Badge variant={r.ambiente === "urbano" ? "cyan" : "success"} className="absolute right-3 top-3">{r.ambiente}</Badge>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="label-hud">{r.modelo}</p>
                  <h2 id={`robo-${r.id}`} className="mt-1 font-display text-xl font-bold tracking-wider">{r.nome}</h2>
                  <p className="text-sm text-primary">{r.tipo}</p>
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{r.local} — {r.cidade}</p>

                  <dl className="mt-4 grid grid-cols-3 gap-2 text-center font-mono text-xs">
                    <div className="rounded border border-border p-2"><dt className="flex justify-center"><BatteryMedium className="size-4 text-primary" aria-label="Bateria" /></dt><dd className="mt-1">{r.bateria}%</dd></div>
                    <div className="rounded border border-border p-2"><dt className="flex justify-center"><Gauge className="size-4 text-primary" aria-label="Velocidade máxima" /></dt><dd className="mt-1">{r.velocidadeMax}</dd></div>
                    <div className="rounded border border-border p-2"><dt className="flex justify-center"><Timer className="size-4 text-primary" aria-label="Autonomia" /></dt><dd className="mt-1">{r.autonomia}</dd></div>
                  </dl>

                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <h3 className="label-hud mb-1 flex items-center gap-1.5"><Move className="size-3.5" aria-hidden="true" /> Movimentação</h3>
                      <p className="text-muted-foreground">{r.movimentacao.join(" · ")}</p>
                    </div>
                    <div>
                      <h3 className="label-hud mb-1 flex items-center gap-1.5"><MessageSquare className="size-3.5" aria-hidden="true" /> Comunicação</h3>
                      <p className="text-muted-foreground">{r.comunicacao.join(" · ")}</p>
                    </div>
                    <div>
                      <h3 className="label-hud mb-1.5 flex items-center gap-1.5"><Accessibility className="size-3.5" aria-hidden="true" /> Tecnologias assistivas</h3>
                      <ul className="flex flex-wrap gap-1.5">
                        {r.compatibilidade.map((c) => <li key={c} className="rounded-full border border-secondary/50 px-2.5 py-0.5 text-xs">{c}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-auto pt-5">
                    {r.status === "manutenção" ? (
                      <Button variant="outline" className="w-full" disabled><Wrench aria-hidden="true" /> Em manutenção</Button>
                    ) : (
                      <Button asChild variant="neon" className="w-full">
                        <Link to="/controle" search={{ robo: r.id }}><Gamepad2 aria-hidden="true" /> Abrir no simulador</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
