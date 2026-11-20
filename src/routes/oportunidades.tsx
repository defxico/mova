import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Bookmark, BookmarkCheck, Bot, Briefcase, CheckCircle2, Clock, Gamepad2, MapPin, Search, Sprout, Store, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageIntro } from "@/components/mova/Hud";
import { CompatMeter } from "@/components/mova/Compat";
import { AREAS, VAGAS, getRobo, type Habilidade, type AreaAtuacao, type Vaga } from "@/lib/mova-data";
import { compatibilidade, filtrarVagas, FILTROS_PADRAO, type FiltrosVagas } from "@/lib/matching";
import { acoes, useMova } from "@/lib/mova-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/oportunidades")({
  head: () => ({
    meta: [
      { title: "Oportunidades de trabalho por telepresença — MOVA" },
      { name: "description", content: "Vagas urbanas e rurais realizadas por robôs de telepresença, com filtros por área, ambiente e jornada." },
      { property: "og:title", content: "Oportunidades de trabalho por telepresença — MOVA" },
      { property: "og:description", content: "Recepção, vendas, eventos, monitoramento agrícola e inspeção — trabalhe a distância controlando um robô." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OportunidadesPage,
});

const selectCls =
  "tap-target h-11 w-full rounded-md border border-input bg-surface/70 px-3 text-base text-foreground focus-visible:outline-[3px] focus-visible:outline-primary";

function OportunidadesPage() {
  const perfil = useMova((s) => s.perfil);
  const salvas = useMova((s) => s.salvas);
  const candidaturas = useMova((s) => s.candidaturas);
  const [f, setF] = useState<FiltrosVagas>(FILTROS_PADRAO);
  const [ordenar, setOrdenar] = useState<"recentes" | "compat">("recentes");
  const [aberta, setAberta] = useState<Vaga | null>(null);

  const perfilMatch = useMemo(
    () => (perfil ? { habilidades: perfil.habilidades as Habilidade[], areas: perfil.areas as AreaAtuacao[] } : null),
    [perfil],
  );

  const lista = useMemo(() => {
    const r = filtrarVagas(VAGAS, f).map((v) => ({ v, score: compatibilidade(v, perfilMatch) }));
    if (ordenar === "compat") r.sort((a, b) => b.score - a.score);
    return r;
  }, [f, ordenar, perfilMatch]);

  const filtrosAtivos = JSON.stringify(f) !== JSON.stringify(FILTROS_PADRAO);

  return (
    <>
      <PageIntro eyebrow="tela 03 · vitrine de oportunidades" title={<>Vagas que vão <span className="text-neon">até você</span></>}>
        Cada vaga acontece em um ambiente físico real, por meio de um robô. Você trabalha de onde estiver.
      </PageIntro>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr]">
        {/* Filtros */}
        <aside aria-labelledby="filtros-titulo" className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass hud-frame space-y-5 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <h2 id="filtros-titulo" className="font-display text-sm font-bold uppercase tracking-widest text-primary">Filtros</h2>
              {filtrosAtivos && (
                <Button variant="ghost" size="sm" onClick={() => setF(FILTROS_PADRAO)}>
                  <X aria-hidden="true" /> Limpar
                </Button>
              )}
            </div>
            <div>
              <Label htmlFor="busca">Buscar</Label>
              <div className="relative mt-1.5">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input id="busca" type="search" value={f.busca} onChange={(e) => setF({ ...f, busca: e.target.value })} placeholder="Cargo, empresa, cidade…" className="tap-target h-11 bg-surface/70 pl-9 text-base" />
              </div>
            </div>
            <fieldset>
              <legend className="text-sm font-medium">Ambiente</legend>
              <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-md border border-border p-1" role="radiogroup" aria-label="Ambiente">
                {(["todos", "urbano", "rural"] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    role="radio"
                    aria-checked={f.ambiente === a}
                    onClick={() => setF({ ...f, ambiente: a })}
                    className={cn("tap-target rounded px-2 py-2 text-sm capitalize transition-colors", f.ambiente === a ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </fieldset>
            <div>
              <Label htmlFor="area">Área de atuação</Label>
              <select id="area" className={cn(selectCls, "mt-1.5")} value={f.area} onChange={(e) => setF({ ...f, area: e.target.value as FiltrosVagas["area"] })}>
                <option value="todas">Todas as áreas</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="jornada">Jornada</Label>
              <select id="jornada" className={cn(selectCls, "mt-1.5")} value={f.jornada} onChange={(e) => setF({ ...f, jornada: e.target.value as FiltrosVagas["jornada"] })}>
                <option value="todas">Qualquer jornada</option>
                {["4h/dia", "6h/dia", "8h/dia", "Flexível"].map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="ordenar">Ordenar por</Label>
              <select id="ordenar" className={cn(selectCls, "mt-1.5")} value={ordenar} onChange={(e) => setOrdenar(e.target.value as typeof ordenar)} disabled={!perfil}>
                <option value="recentes">Mais recentes</option>
                <option value="compat">Maior compatibilidade</option>
              </select>
              {!perfil && <p className="mt-1 text-xs text-muted-foreground">Crie seu perfil para ordenar por compatibilidade.</p>}
            </div>
          </div>
        </aside>

        <section aria-labelledby="resultado-titulo">
          {!perfil && (
            <div className="glass mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border-secondary/50 p-4">
              <p className="text-sm"><strong>Dica:</strong> com seu perfil, mostramos o quanto cada vaga combina com você.</p>
              <Button asChild variant="violet" size="sm"><Link to="/cadastro"><UserPlus aria-hidden="true" /> Criar perfil</Link></Button>
            </div>
          )}
          <h2 id="resultado-titulo" className="label-hud mb-4" aria-live="polite">
            {lista.length} {lista.length === 1 ? "vaga encontrada" : "vagas encontradas"}
          </h2>
          {lista.length === 0 ? (
            <div className="glass rounded-lg p-10 text-center">
              <p className="font-semibold">Nenhuma vaga com esses filtros.</p>
              <Button variant="hud" className="mt-4" onClick={() => setF(FILTROS_PADRAO)}>Limpar filtros</Button>
            </div>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2">
              {lista.map(({ v, score }) => {
                const salva = salvas.includes(v.id);
                const candidatou = candidaturas.some((c) => c.vagaId === v.id);
                return (
                  <li key={v.id}>
                    <article className="glass group flex h-full flex-col rounded-lg p-5 transition-all hover:border-primary/60 hover:shadow-[var(--glow-primary)]" aria-labelledby={`vaga-${v.id}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={v.ambiente === "urbano" ? "cyan" : "success"} className="gap-1.5">
                            {v.ambiente === "urbano" ? <Store className="size-3.5" aria-hidden="true" /> : <Sprout className="size-3.5" aria-hidden="true" />}
                            {v.ambiente}
                          </Badge>
                          <Badge variant="violet">{v.area}</Badge>
                          {candidatou && <Badge variant="magenta"><CheckCircle2 className="mr-1 size-3.5" aria-hidden="true" />Candidatado</Badge>}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-pressed={salva}
                          aria-label={salva ? `Remover ${v.titulo} das vagas salvas` : `Salvar vaga ${v.titulo}`}
                          onClick={() => {
                            const agora = acoes.alternarSalva(v.id);
                            toast(agora ? "Vaga salva no seu painel." : "Vaga removida das salvas.");
                          }}
                        >
                          {salva ? <BookmarkCheck className="text-primary" aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
                        </Button>
                      </div>
                      <h3 id={`vaga-${v.id}`} className="mt-3 font-display text-lg font-bold leading-snug">{v.titulo}</h3>
                      <p className="text-sm font-medium text-primary">{v.empresa}</p>
                      <dl className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                        <div className="flex gap-2"><dt><MapPin className="size-4" aria-label="Local do robô" /></dt><dd>{v.localRobo}</dd></div>
                        <div className="flex gap-2"><dt><Bot className="size-4" aria-label="Robô" /></dt><dd>{getRobo(v.roboId)?.nome} · {getRobo(v.roboId)?.tipo}</dd></div>
                        <div className="flex gap-2"><dt><Clock className="size-4" aria-label="Modalidade e jornada" /></dt><dd>{v.modalidade} · {v.jornada} · {v.remuneracao}</dd></div>
                      </dl>
                      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Habilidades necessárias">
                        {v.habilidades.map((h) => {
                          const tem = perfil?.habilidades.includes(h);
                          return (
                            <li key={h} className={cn("rounded-full border px-2.5 py-0.5 text-xs", tem ? "border-success/50 text-success" : "border-border text-muted-foreground")}>
                              {tem && <span className="sr-only">Você tem: </span>}{h}
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-auto space-y-4 pt-5">
                        <CompatMeter score={score} ativo={!!perfil} />
                        <Button variant="hud" className="w-full" onClick={() => setAberta(v)}>
                          <Briefcase aria-hidden="true" /> Ver detalhes e candidatar-se
                        </Button>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <VagaDialog vaga={aberta} onClose={() => setAberta(null)} score={aberta ? compatibilidade(aberta, perfilMatch) : 0} temPerfil={!!perfil} />
    </>
  );
}

function VagaDialog({ vaga, onClose, score, temPerfil }: { vaga: Vaga | null; onClose: () => void; score: number; temPerfil: boolean }) {
  const candidaturas = useMova((s) => s.candidaturas);
  if (!vaga) return null;
  const robo = getRobo(vaga.roboId);
  const candidatou = candidaturas.some((c) => c.vagaId === vaga.id);
  return (
    <Dialog open={!!vaga} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-popover sm:max-w-2xl">
        <DialogHeader>
          <p className="label-hud text-primary">{vaga.empresa} · {vaga.publicadaHa}</p>
          <DialogTitle className="font-display text-2xl leading-tight">{vaga.titulo}</DialogTitle>
          <DialogDescription>{vaga.area} · {vaga.modalidade} · {vaga.jornada} · {vaga.remuneracao}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 text-sm">
          <CompatMeter score={score} ativo={temPerfil} />
          <section>
            <h3 className="label-hud mb-2">Ambiente do robô</h3>
            <p>{vaga.descricaoAmbiente}</p>
            <p className="mt-1 text-muted-foreground"><MapPin className="mr-1 inline size-4" aria-hidden="true" />{vaga.localRobo}</p>
          </section>
          <section>
            <h3 className="label-hud mb-2">Atividades</h3>
            <ul className="space-y-1">{vaga.atividades.map((a) => <li key={a} className="flex gap-2"><span className="text-primary" aria-hidden="true">▸</span>{a}</li>)}</ul>
          </section>
          <div className="grid gap-5 sm:grid-cols-2">
            <section>
              <h3 className="label-hud mb-2">Habilidades</h3>
              <ul className="space-y-1">{vaga.habilidades.map((h) => <li key={h}>• {h}</li>)}</ul>
            </section>
            <section>
              <h3 className="label-hud mb-2">Requisitos técnicos</h3>
              <ul className="space-y-1">{vaga.requisitosTecnicos.map((h) => <li key={h}>• {h}</li>)}</ul>
            </section>
          </div>
          {robo && (
            <section className="rounded-md border border-border bg-surface/60 p-4">
              <h3 className="label-hud mb-2">Robô: {robo.nome} — {robo.modelo}</h3>
              <p className="text-muted-foreground">Compatível com: {robo.compatibilidade.join(", ")}.</p>
            </section>
          )}
        </div>
        <div className="mt-2 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button asChild variant="hud">
            <Link to="/controle" search={{ robo: vaga.roboId }}><Gamepad2 aria-hidden="true" /> Treinar no simulador</Link>
          </Button>
          {candidatou ? (
            <Button
              variant="outline"
              onClick={() => {
                acoes.cancelarCandidatura(vaga.id);
                toast("Candidatura cancelada.");
              }}
            >
              Cancelar candidatura
            </Button>
          ) : (
            <Button
              variant="neon"
              onClick={() => {
                if (acoes.candidatar(vaga.id)) {
                  toast.success("Candidatura enviada!", { description: `${vaga.empresa} vai analisar seu perfil. Acompanhe no seu painel.` });
                }
              }}
            >
              <CheckCircle2 aria-hidden="true" /> Candidatar-me
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
