import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Building2,
  Clock,
  Gamepad2,
  Globe2,
  HeartHandshake,
  MapPin,
  Radio,
  Search,
  ShieldCheck,
  Sprout,
  Store,
  UserPlus,
  Users,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HudPanel, StatusDot } from "@/components/mova/Hud";
import { ROBOS, VAGAS } from "@/lib/mova-data";
import heroImg from "@/assets/hero-robot.jpg";
import camUrbana from "@/assets/cam-urban.jpg";
import camRural from "@/assets/cam-rural.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MOVA — Sua presença não tem fronteira" },
      {
        name: "description",
        content:
          "Plataforma que conecta pessoas com deficiência e mobilidade reduzida a vagas realizadas por robôs de telepresença, na cidade e no campo.",
      },
      { property: "og:title", content: "MOVA — Sua presença não tem fronteira" },
      {
        property: "og:description",
        content: "Encontre uma vaga, treine no simulador e trabalhe a distância controlando um robô de telepresença.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PASSOS = [
  { n: "01", icon: UserPlus, titulo: "Crie seu perfil", texto: "Informe habilidades, preferências e os recursos de acessibilidade que você usa." },
  { n: "02", icon: Search, titulo: "Encontre a vaga", texto: "Filtre oportunidades urbanas e rurais e veja sua compatibilidade com cada uma." },
  { n: "03", icon: Gamepad2, titulo: "Treine no simulador", texto: "Pratique os controles do robô no seu ritmo, com o modo de controle que preferir." },
  { n: "04", icon: Bot, titulo: "Trabalhe pelo robô", texto: "Atenda, oriente e monitore a distância. Sua jornada fica registrada no painel." },
];

function Index() {
  const disponiveis = ROBOS.filter((r) => r.status !== "manutenção").length;
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-border" aria-labelledby="hero-titulo">
        <img
          src={heroImg}
          alt="Robô de telepresença em uma rua futurista iluminada por neon, com a tela mostrando o rosto sorridente da profissional que o controla."
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]"
          width={1536}
          height={1024}
        />
        <div className="absolute inset-0 -z-10 bg-fade-left" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-fade-bottom" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-60" aria-hidden="true" />

        <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <Badge variant="cyan" className="mb-6 gap-2 py-1">
              <StatusDot tone="primary" pulse /> Global Solution 2026 · CitizenTech
            </Badge>
            <h1 id="hero-titulo" className="font-display text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
              Sua presença <span className="text-neon">não tem fronteira.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
              O <strong className="text-foreground">MOVA</strong> conecta pessoas com deficiência e mobilidade reduzida a
              vagas de trabalho realizadas por robôs de telepresença — de casa para uma loja na Paulista ou para uma estufa no interior.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="neon" size="xl">
                <Link to="/cadastro">
                  <UserPlus aria-hidden="true" /> Criar meu perfil
                </Link>
              </Button>
              <Button asChild variant="hud" size="xl">
                <Link to="/controle">
                  <Gamepad2 aria-hidden="true" /> Testar a central de controle
                </Link>
              </Button>
            </div>
            <Link to="/oportunidades" className="mt-5 inline-flex items-center gap-2 text-sm text-primary hover:underline">
              Sou empresa e quero oferecer uma vaga <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { k: "Robôs ativos", v: String(disponiveis), icon: Bot },
              { k: "Vagas abertas", v: String(VAGAS.length), icon: Search },
              { k: "Ambientes", v: "Cidade + campo", icon: Globe2 },
              { k: "Latência média", v: "48 ms", icon: Wifi },
            ].map((s) => (
              <div key={s.k} className="glass rounded-md px-4 py-3">
                <dt className="label-hud flex items-center gap-1.5"><s.icon className="size-3.5 text-primary" aria-hidden="true" />{s.k}</dt>
                <dd className="mt-1 font-display text-lg font-bold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="problema-titulo">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="label-hud mb-3 text-accent">// o problema</p>
            <h2 id="problema-titulo" className="font-display text-3xl font-bold sm:text-4xl">
              Talento não falta. Faltam caminhos até o trabalho.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Calçadas sem rampa, transporte inacessível e a distância dos grandes centros afastam milhões de pessoas do mercado.
              O MOVA leva a presença profissional até onde a vaga está.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { v: "18,6 mi", t: "pessoas com deficiência no Brasil", f: "IBGE, PNAD Contínua 2022" },
              { v: "29,2%", t: "participam da força de trabalho (contra 66,4% sem deficiência)", f: "IBGE, PNAD Contínua 2022" },
              { v: "2 em 3", t: "vivem longe das oportunidades que exigem deslocamento diário", f: "Estimativa ilustrativa do projeto" },
            ].map((d) => (
              <div key={d.v} className="glass hud-frame rounded-lg p-5">
                <p className="font-display text-3xl font-black text-primary">{d.v}</p>
                <p className="mt-2 text-sm">{d.t}</p>
                <p className="label-hud mt-3 !text-[0.6rem]">{d.f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-y border-border bg-grid" aria-labelledby="como-titulo">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <p className="label-hud mb-3 text-primary">// como funciona</p>
          <h2 id="como-titulo" className="font-display text-3xl font-bold sm:text-4xl">Do cadastro à primeira jornada</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {PASSOS.map((p, i) => (
              <li key={p.n} className="glass relative rounded-lg p-6">
                <span className="font-mono text-xs text-secondary">PASSO {p.n}</span>
                <p.icon className="mt-4 size-8 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-display text-base font-bold tracking-wide">{p.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.texto}</p>
                {i < PASSOS.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden size-5 -translate-y-1/2 text-primary md:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="beneficios-titulo">
        <h2 id="beneficios-titulo" className="sr-only">Benefícios</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <HudPanel title="Para profissionais" code="PRO.01" bodyClassName="p-6">
            <ul className="space-y-4">
              {[
                { icon: HeartHandshake, t: "Trabalho com protagonismo", d: "Você escolhe a vaga, o ambiente e a jornada. O robô é a sua presença, não o seu substituto." },
                { icon: ShieldCheck, t: "Controle do seu jeito", d: "Teclado, toque, pressionar e segurar ou varredura com acionador único." },
                { icon: Clock, t: "Jornadas compatíveis", d: "Vagas de 4h, 6h, 8h ou flexíveis, com pausas programadas." },
                { icon: MapPin, t: "Sem depender de deslocamento", d: "Trabalhe em outra cidade ou no campo sem sair de casa." },
              ].map((b) => (
                <li key={b.t} className="flex gap-4">
                  <b.icon className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
                  <div><p className="font-semibold">{b.t}</p><p className="text-sm text-muted-foreground">{b.d}</p></div>
                </li>
              ))}
            </ul>
            <Button asChild variant="neon" className="mt-6"><Link to="/cadastro">Quero trabalhar <ArrowRight aria-hidden="true" /></Link></Button>
          </HudPanel>
          <HudPanel title="Para empresas" code="EMP.01" bodyClassName="p-6">
            <ul className="space-y-4">
              {[
                { icon: Users, t: "Times mais diversos", d: "Acesse profissionais qualificados que hoje estão fora do seu raio de contratação." },
                { icon: Bot, t: "Robôs prontos para operar", d: "Catálogo de robôs para recepção, vendas, eventos e monitoramento rural." },
                { icon: Building2, t: "Inclusão de verdade", d: "Uma alternativa adicional à contratação tradicional — nunca um substituto para ambientes acessíveis." },
                { icon: Radio, t: "Operação monitorada", d: "Status de conexão, histórico de operações e parada de emergência sempre disponíveis." },
              ].map((b) => (
                <li key={b.t} className="flex gap-4">
                  <b.icon className="mt-0.5 size-6 shrink-0 text-secondary" aria-hidden="true" />
                  <div><p className="font-semibold">{b.t}</p><p className="text-sm text-muted-foreground">{b.d}</p></div>
                </li>
              ))}
            </ul>
            <Button asChild variant="violet" className="mt-6"><Link to="/cadastro" search={{ perfil: "empresa" }}>Cadastrar empresa <ArrowRight aria-hidden="true" /></Link></Button>
          </HudPanel>
        </div>
      </section>

      {/* URBANO / RURAL */}
      <section className="border-y border-border bg-surface/30" aria-labelledby="aplicacoes-titulo">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <p className="label-hud mb-3 text-primary">// aplicações</p>
          <h2 id="aplicacoes-titulo" className="font-display text-3xl font-bold sm:text-4xl">Na cidade e no campo</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { img: camUrbana, icon: Store, tag: "Urbano", badge: "cyan" as const, titulo: "Recepção, vendas e eventos", alt: "Visão da câmera de um robô na recepção de uma loja iluminada, com uma cliente chegando.", itens: ["Receber e orientar visitantes", "Apresentar produtos em lojas", "Atender em eventos e exposições"] },
              { img: camRural, icon: Sprout, tag: "Rural", badge: "success" as const, titulo: "Monitoramento e inspeção", alt: "Visão da câmera de um robô entre fileiras de alface em uma estufa ao entardecer.", itens: ["Rondas visuais em estufas", "Inspeção visual de equipamentos", "Comunicação com equipes de campo"] },
            ].map((c) => (
              <article key={c.tag} className="glass hud-frame overflow-hidden rounded-lg">
                <div className="scanlines relative aspect-[16/9]">
                  <img src={c.img} alt={c.alt} className="h-full w-full object-cover" loading="lazy" />
                  <Badge variant={c.badge} className="absolute left-3 top-3 gap-1.5 bg-background/80">
                    <c.icon className="size-3.5" aria-hidden="true" /> {c.tag}
                  </Badge>
                  <span className="label-hud absolute bottom-3 right-3 rounded bg-background/80 px-2 py-1 !text-primary">REC ● CAM-01</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold">{c.titulo}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {c.itens.map((i) => <li key={i} className="flex gap-2"><span className="text-primary" aria-hidden="true">▸</span>{i}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
            Todas as atividades respeitam as capacidades reais dos robôs: nada de operações perigosas ou que exijam força física.
          </p>
        </div>
      </section>

      {/* INSPIRAÇÃO + CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="inspiracao-titulo">
        <div className="glass hud-frame grid gap-8 rounded-lg p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:p-12">
          <div>
            <p className="label-hud mb-3 text-secondary">// inspiração · Tóquio</p>
            <h2 id="inspiracao-titulo" className="font-display text-2xl font-bold sm:text-3xl">
              Do Dawn Avatar Robot Café para o Brasil
            </h2>
            <p className="mt-4 text-muted-foreground">
              No café da Ory Laboratory, pessoas que não podem sair de casa trabalham controlando robôs à distância.
              O MOVA traz essa ideia para a realidade brasileira: acessível, escalável e conectando cidade e campo.
            </p>
            <blockquote className="mt-6 border-l-2 border-accent pl-4 text-lg font-semibold">
              “A tecnologia não deve adaptar as pessoas ao mercado de trabalho. Deve transformar o mercado para que mais pessoas participem.”
            </blockquote>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild variant="neon" size="xl"><Link to="/oportunidades">Ver oportunidades <ArrowRight aria-hidden="true" /></Link></Button>
            <Button asChild variant="hud" size="xl"><Link to="/impacto">Impacto social e ODS</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
