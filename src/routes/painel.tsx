import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Briefcase, Clock, Gamepad2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HudPanel, PageIntro, StatusDot } from "@/components/mova/Hud";
import { HORAS_SEMANA, OPERACOES_DEMO, getRobo, getVaga } from "@/lib/mova-data";
import { useMova } from "@/lib/mova-store";
import { resumoJornadas } from "@/lib/painel";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Meu painel — MOVA" },
      {
        name: "description",
        content:
          "Jornadas feitas pelo robô, candidaturas e dados do seu perfil profissional no MOVA.",
      },
    ],
  }),
  component: PainelPage,
});

const dataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "America/Sao_Paulo",
  });

function PainelPage() {
  const perfil = useMova((s) => s.perfil);
  const primeiroNome = perfil?.nome.trim().split(/\s+/)[0] ?? "";
  const candidaturas = useMova((s) => s.candidaturas);
  const operacoes = useMova((s) => s.operacoes);
  const exemplo = operacoes.length === 0;
  const jornadas = exemplo ? OPERACOES_DEMO : operacoes;
  const resumo = resumoJornadas(jornadas);
  const maxHoras = Math.max(...HORAS_SEMANA.map((d) => d.horas), 1);

  return (
    <>
      <PageIntro
        eyebrow="meu painel"
        title={
          primeiroNome ? (
            <>
              Olá, <span className="text-neon">{primeiroNome}</span>
            </>
          ) : (
            "Meu painel"
          )
        }
        aside={
          <Button asChild variant="neon" size="xl">
            <Link to="/controle">
              <Gamepad2 aria-hidden="true" /> Abrir central de controle
            </Link>
          </Button>
        }
      >
        Suas jornadas pelo robô, candidaturas e dados do perfil. Tudo fica salvo só neste navegador.
      </PageIntro>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <section aria-labelledby="resumo-titulo" className="lg:col-span-3">
          <h2 id="resumo-titulo" className="sr-only">
            Resumo das jornadas
          </h2>
          <dl className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Bot, rotulo: "Sessões no robô", valor: String(resumo.sessoes) },
              {
                icon: Clock,
                rotulo: "Horas de jornada",
                valor: `${resumo.horas.toLocaleString("pt-BR")} h`,
              },
              { icon: Briefcase, rotulo: "Candidaturas", valor: String(candidaturas.length) },
            ].map(({ icon: Icon, rotulo, valor }) => (
              <div key={rotulo} className="glass hud-frame rounded-lg p-4">
                <dt className="label-hud flex items-center gap-2">
                  <Icon className="size-4" aria-hidden="true" /> {rotulo}
                </dt>
                <dd className="mt-2 font-display text-3xl font-bold">{valor}</dd>
              </div>
            ))}
          </dl>
          {exemplo && (
            <p className="mt-3 text-sm text-muted-foreground">
              Você ainda não operou um robô. Os números acima são um exemplo. Conecte-se na central
              de controle para registrar sua primeira jornada.
            </p>
          )}
        </section>

        <HudPanel title="Horas na semana" code="SYS.HRS" className="lg:col-span-2">
          <figure>
            <div className="flex h-48 items-end gap-3" aria-hidden="true">
              {HORAS_SEMANA.map((d) => (
                <div
                  key={d.dia}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className="w-full rounded-t bg-primary/80"
                    style={{ height: `${(d.horas / maxHoras) * 100}%` }}
                  />
                  <span className="label-hud">{d.dia}</span>
                </div>
              ))}
            </div>
            <figcaption className="sr-only">
              {HORAS_SEMANA.map((d) => `${d.dia}: ${d.horas} horas`).join("; ")}
            </figcaption>
          </figure>
        </HudPanel>

        <HudPanel title="Perfil" code="USR.01">
          {perfil ? (
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="label-hud">Nome</dt>
                <dd>{perfil.nome}</dd>
              </div>
              <div>
                <dt className="label-hud">Local</dt>
                <dd>
                  {perfil.cidade} · {perfil.estado.toUpperCase()}
                </dd>
              </div>
              <div>
                <dt className="label-hud">Áreas</dt>
                <dd>{perfil.areas.join(", ")}</dd>
              </div>
              <div>
                <dt className="label-hud">Habilidades</dt>
                <dd>{perfil.habilidades.join(", ")}</dd>
              </div>
              <div>
                <dt className="label-hud">Recursos de acessibilidade</dt>
                <dd>{perfil.recursos.length ? perfil.recursos.join(", ") : "Nenhum informado"}</dd>
              </div>
            </dl>
          ) : (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Crie seu perfil para ver a compatibilidade com as vagas.
              </p>
              <Button asChild variant="hud">
                <Link to="/cadastro">
                  <UserPlus aria-hidden="true" /> Criar perfil
                </Link>
              </Button>
            </div>
          )}
        </HudPanel>

        <HudPanel title="Candidaturas" code="JOB.LST" className="lg:col-span-1">
          {candidaturas.length === 0 ? (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">Nenhuma candidatura ainda.</p>
              <Button asChild variant="hud">
                <Link to="/oportunidades">Ver oportunidades</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {candidaturas.map((c) => {
                const v = getVaga(c.vagaId);
                return (
                  <li key={c.vagaId} className="rounded-md border border-border p-3 text-sm">
                    <p className="font-semibold">{v?.titulo ?? "Vaga indisponível"}</p>
                    <p className="text-muted-foreground">
                      {v ? `${v.empresa} · ` : ""}enviada em {dataCurta(c.data)}
                    </p>
                    <Badge variant="cyan" className="mt-2">
                      {c.status}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </HudPanel>

        <HudPanel title="Jornadas registradas" code="OPS.LOG" className="lg:col-span-2">
          <ul className="divide-y divide-border">
            {jornadas.map((o) => (
              <li
                key={o.id}
                className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <StatusDot tone="success" /> {getRobo(o.roboId)?.nome ?? o.roboId}
                </span>
                <span className="text-muted-foreground">
                  {o.local} · {dataCurta(o.data)} · {Math.round(o.duracaoMin / 6) / 10} h ·{" "}
                  {o.acoes} ações
                </span>
                <span className="sm:ml-auto">{o.resumo}</span>
              </li>
            ))}
          </ul>
        </HudPanel>
      </div>
    </>
  );
}
