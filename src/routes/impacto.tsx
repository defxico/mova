import { createFileRoute, Link } from "@tanstack/react-router";
import { Info, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HudPanel, PageIntro } from "@/components/mova/Hud";

export const Route = createFileRoute("/impacto")({
  head: () => ({
    meta: [
      { title: "Impacto social e ODS — MOVA" },
      { name: "description", content: "Como o MOVA amplia o acesso ao trabalho para pessoas com deficiência e quais Objetivos de Desenvolvimento Sustentável ele atende." },
    ],
  }),
  component: ImpactoPage,
});

const NUMEROS = [
  { valor: "18,6 mi", texto: "pessoas com deficiência no Brasil", fonte: "IBGE, PNAD Contínua 2022" },
  { valor: "29,2%", texto: "participam da força de trabalho, contra 66,4% das pessoas sem deficiência", fonte: "IBGE, PNAD Contínua 2022" },
  { valor: "2 em 3", texto: "vivem longe de vagas que exigem deslocamento diário", fonte: "Estimativa ilustrativa do projeto" },
];

const ODS = [
  { n: 8, nome: "Trabalho decente e crescimento econômico", como: "Abre vagas formais (CLT, PJ, estágio) para quem não consegue se deslocar todo dia." },
  { n: 9, nome: "Indústria, inovação e infraestrutura", como: "Usa robôs de telepresença para levar a presença profissional até onde a vaga está." },
  { n: 10, nome: "Redução das desigualdades", como: "Inclui pessoas com deficiência e moradores do interior em times de cidade e de campo." },
];

const JORNADA = [
  { passo: "Cria o perfil", texto: "Informa habilidades e os recursos de acessibilidade que usa, em cerca de 3 minutos." },
  { passo: "Encontra a vaga", texto: "Filtra por ambiente, área e jornada e vê a compatibilidade com cada vaga." },
  { passo: "Treina no simulador", texto: "Pratica os controles com toque, pressionar e segurar, varredura ou teclado." },
  { passo: "Trabalha pelo robô", texto: "Atende, orienta e monitora a distância. A jornada fica registrada no painel." },
];

function ImpactoPage() {
  return (
    <>
      <PageIntro eyebrow="impacto" title={<>Trabalho que <span className="text-neon">chega até você</span></>}>
        Falta de rampa, transporte inacessível e distância dos grandes centros deixam muita gente fora do mercado. O MOVA leva a presença profissional até onde a vaga está.
      </PageIntro>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
        <section aria-labelledby="problema-titulo">
          <h2 id="problema-titulo" className="label-hud mb-4 text-accent"><span aria-hidden="true">// </span>o problema</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {NUMEROS.map((n) => (
              <li key={n.valor} className="glass hud-frame rounded-lg p-5">
                <p className="font-display text-4xl font-bold text-neon">{n.valor}</p>
                <p className="mt-2">{n.texto}</p>
                <p className="mt-3 text-xs text-muted-foreground">Fonte: {n.fonte}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ods-titulo">
          <h2 id="ods-titulo" className="label-hud mb-4 text-accent"><span aria-hidden="true">// </span>objetivos de desenvolvimento sustentável</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {ODS.map((o) => (
              <li key={o.n} className="glass hud-frame rounded-lg p-5">
                <Badge variant="violet">ODS {o.n}</Badge>
                <h3 className="mt-3 font-display text-lg font-semibold">{o.nome}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{o.como}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <HudPanel title="Quem o MOVA atende" code="USR.PRF">
            <p className="text-sm">
              Pessoas com deficiência ou mobilidade reduzida que querem escolher a vaga, o ambiente e a jornada. Elas usam controle adaptado
              (teclado, toque, pressionar e segurar, varredura, voz, rastreamento ocular, joystick, leitor de tela) e pausas programadas.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Do outro lado, empresas e organizações que querem contratar além do raio de deslocamento, com operação monitorada e parada de emergência.
            </p>
          </HudPanel>

          <HudPanel title="Jornada do profissional" code="NAV.FLW">
            <ol className="space-y-3">
              {JORNADA.map((j, i) => (
                <li key={j.passo} className="flex gap-3 text-sm">
                  <span className="font-display font-bold text-primary" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span><strong>{j.passo}.</strong> {j.texto}</span>
                </li>
              ))}
            </ol>
          </HudPanel>
        </div>

        <aside className="flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm" aria-label="Aviso importante sobre acessibilidade">
          <Info className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
          <p>
            O MOVA é uma opção a mais, nunca um substituto para ambientes acessíveis. Rampas, transporte adaptado e locais de trabalho
            inclusivos continuam necessários. Neste protótipo, robôs, empresas e vagas são simulados.
          </p>
        </aside>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="neon" size="xl"><Link to="/cadastro"><UserPlus aria-hidden="true" /> Criar meu perfil</Link></Button>
          <Button asChild variant="hud" size="xl"><Link to="/oportunidades">Ver oportunidades</Link></Button>
        </div>
      </div>
    </>
  );
}
