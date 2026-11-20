import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Sparkles, User, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HudPanel, PageIntro } from "@/components/mova/Hud";
import { ChipGroup } from "@/components/mova/ChipGroup";
import { AREAS, HABILIDADES, RECURSOS_ACESSIBILIDADE } from "@/lib/mova-data";
import {
  ETAPAS_CAMPOS,
  validarCadastro,
  validarEmpresa,
  type CadastroEmpresa,
  type CadastroProfissional,
  type ErrosCadastro,
  type ErrosEmpresa,
} from "@/lib/validation";
import { acoes } from "@/lib/mova-store";
import { preferenciasDoPerfil } from "@/lib/perfil-a11y";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cadastro")({
  validateSearch: (s: Record<string, unknown>): { perfil?: "empresa" } =>
    s["perfil"] === "empresa" ? { perfil: "empresa" } : {},
  head: () => ({
    meta: [
      { title: "Cadastro inclusivo — MOVA" },
      { name: "description", content: "Crie seu perfil profissional no MOVA com habilidades, preferências de trabalho e recursos de acessibilidade." },
      { property: "og:title", content: "Cadastro inclusivo — MOVA" },
      { property: "og:description", content: "Perfil profissional com configurações individuais de acessibilidade, ou cadastro de empresa parceira." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CadastroPage,
});

const ETAPAS = ["Seus dados", "Perfil profissional", "Preferências e acessibilidade"];

const VAZIO: CadastroProfissional = {
  nome: "",
  email: "",
  cidade: "",
  estado: "",
  areas: [],
  habilidades: [],
  preferenciaAmbiente: "ambos",
  jornada: "",
  recursos: [],
  observacoes: "",
};

const EXEMPLO: CadastroProfissional = {
  nome: "Lúcia Andrade",
  email: "lucia.andrade@exemplo.com",
  cidade: "Manaus",
  estado: "AM",
  areas: ["Recepção", "Atendimento", "Monitoramento agrícola"],
  habilidades: ["Comunicação", "Atendimento ao cliente", "Organização", "Observação atenta"],
  preferenciaAmbiente: "ambos",
  jornada: "6h/dia",
  recursos: ["Controle por teclado", "Modo varredura (acionador único)", "Pausas programadas"],
  observacoes: "Uso cadeira de rodas motorizada e prefiro pausas a cada 2 horas.",
};

const ROTULOS: Record<string, string> = {
  nome: "Nome",
  email: "E-mail",
  cidade: "Cidade",
  estado: "Estado",
  areas: "Áreas de interesse",
  habilidades: "Habilidades",
  jornada: "Jornada",
  razao: "Organização",
  cnpj: "CNPJ",
  responsavel: "Responsável",
};

function CadastroPage() {
  const { perfil } = Route.useSearch();
  const [tipo, setTipo] = useState<"profissional" | "empresa">(perfil === "empresa" ? "empresa" : "profissional");

  return (
    <>
      <PageIntro eyebrow="tela 02 · cadastro inclusivo" title={<>Comece pela <span className="text-neon">sua forma</span> de trabalhar</>}>
        Leva cerca de 3 minutos. Você pode voltar e mudar qualquer resposta depois.
      </PageIntro>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div role="tablist" aria-label="Tipo de cadastro" className="glass mb-8 grid grid-cols-2 gap-1 rounded-lg p-1">
          {(["profissional", "empresa"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tipo === t}
              aria-controls={`painel-${t}`}
              id={`aba-${t}`}
              onClick={() => setTipo(t)}
              className={cn(
                "tap-target flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition-colors",
                tipo === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "profissional" ? <User className="size-4" aria-hidden="true" /> : <Building2 className="size-4" aria-hidden="true" />}
              {t === "profissional" ? "Sou profissional" : "Sou empresa ou organização"}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`painel-${tipo}`} aria-labelledby={`aba-${tipo}`}>
          {tipo === "profissional" ? <FormProfissional /> : <FormEmpresa />}
        </div>
      </div>
    </>
  );
}

function ErrorSummary({ erros, refEl }: { erros: Record<string, string | undefined>; refEl: React.RefObject<HTMLDivElement | null> }) {
  const lista = Object.entries(erros).filter(([, v]) => v) as [string, string][];
  return (
    <div ref={refEl} tabIndex={-1} aria-live="assertive" className="outline-none">
      {lista.length > 0 && (
        <div className="mb-6 rounded-md border border-accent/60 bg-accent/10 p-4" role="alert">
          <p className="font-semibold">Confira {lista.length === 1 ? "1 campo" : `${lista.length} campos`} antes de continuar:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {lista.map(([k, v]) => (
              <li key={k}>
                <a href={`#campo-${k}`} className="underline hover:text-primary" onClick={(e) => { e.preventDefault(); document.getElementById(`campo-${k}`)?.focus(); }}>
                  {ROTULOS[k] ?? k}: {v}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Campo({ id, label, erro, hint, children }: { id: string; label: string; erro?: string | undefined; hint?: string | undefined; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={`campo-${id}`} className="text-sm font-semibold">{label}</Label>
      {hint && <p id={`${id}-dica`} className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {erro && <p id={`${id}-erro`} className="mt-1.5 text-sm font-medium text-accent">⚠ {erro}</p>}
    </div>
  );
}

const inputCls = "tap-target h-11 bg-surface/70 text-base aria-[invalid=true]:border-accent";

function FormProfissional() {
  const [etapa, setEtapa] = useState(0);
  const [dados, setDados] = useState<CadastroProfissional>(VAZIO);
  const [erros, setErros] = useState<ErrosCadastro>({});
  const [concluido, setConcluido] = useState(false);
  const resumoRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);

  const set = <K extends keyof CadastroProfissional>(k: K, v: CadastroProfissional[K]) => {
    setDados((d) => ({ ...d, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
  };

  const avancar = () => {
    const e = validarCadastro(dados, ETAPAS_CAMPOS[etapa]);
    setErros(e);
    if (Object.keys(e).length) {
      toast.error("Alguns campos precisam de atenção.");
      requestAnimationFrame(() => resumoRef.current?.focus());
      return;
    }
    if (etapa < ETAPAS.length - 1) {
      setEtapa(etapa + 1);
      requestAnimationFrame(() => tituloRef.current?.focus());
      return;
    }
    acoes.salvarPerfil({ ...dados, estado: dados.estado.toUpperCase() });
    const prefs = preferenciasDoPerfil(dados.recursos);
    if (Object.keys(prefs).length) acoes.atualizarA11y(prefs);
    setConcluido(true);
    toast.success(`Perfil criado! Bem-vinda(o), ${dados.nome.split(" ")[0]}.`);
  };

  if (concluido) {
    return (
      <HudPanel title="Perfil ativo" code="ID.OK" bodyClassName="p-8 text-center">
        <CheckCircle2 className="mx-auto size-14 text-success" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-bold">Tudo pronto, {dados.nome.split(" ")[0]}!</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Calculamos sua compatibilidade com cada vaga a partir das suas habilidades e áreas de interesse.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="neon" size="xl"><Link to="/oportunidades">Ver vagas compatíveis <ArrowRight aria-hidden="true" /></Link></Button>
          <Button asChild variant="hud" size="xl"><Link to="/painel">Ir para meu painel</Link></Button>
        </div>
      </HudPanel>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        avancar();
      }}
      aria-labelledby="titulo-etapa"
    >
      {/* Stepper */}
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Etapas do cadastro">
        {ETAPAS.map((t, i) => (
          <li key={t} aria-current={i === etapa ? "step" : undefined}>
            <div className={cn("h-1 rounded-full", i <= etapa ? "bg-neon" : "bg-muted")} />
            <p className={cn("mt-2 font-mono text-[0.7rem] uppercase tracking-wider", i === etapa ? "text-primary" : "text-muted-foreground")}>
              {String(i + 1).padStart(2, "0")} · <span className="hidden sm:inline">{t}</span>
            </p>
          </li>
        ))}
      </ol>

      <HudPanel bodyClassName="p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="label-hud">Etapa {etapa + 1} de {ETAPAS.length}</p>
            <h2 id="titulo-etapa" ref={tituloRef} tabIndex={-1} className="mt-1 font-display text-xl font-bold outline-none">{ETAPAS[etapa]}</h2>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => { setDados(EXEMPLO); setErros({}); toast.info("Formulário preenchido com um perfil de exemplo."); }}>
            <Wand2 aria-hidden="true" /> Preencher exemplo
          </Button>
        </div>

        <ErrorSummary erros={erros} refEl={resumoRef} />

        {etapa === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Campo id="nome" label="Nome completo" erro={erros.nome}>
                <Input id="campo-nome" autoComplete="name" value={dados.nome} onChange={(e) => set("nome", e.target.value)} aria-invalid={!!erros.nome} aria-describedby={erros.nome ? "nome-erro" : undefined} className={inputCls} />
              </Campo>
            </div>
            <div className="sm:col-span-2">
              <Campo id="email" label="E-mail" erro={erros.email} hint="Usaremos para avisar sobre candidaturas.">
                <Input id="campo-email" type="email" autoComplete="email" value={dados.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!erros.email} aria-describedby={["email-dica", erros.email ? "email-erro" : ""].join(" ").trim()} className={inputCls} />
              </Campo>
            </div>
            <Campo id="cidade" label="Cidade" erro={erros.cidade}>
              <Input id="campo-cidade" autoComplete="address-level2" value={dados.cidade} onChange={(e) => set("cidade", e.target.value)} aria-invalid={!!erros.cidade} aria-describedby={erros.cidade ? "cidade-erro" : undefined} className={inputCls} />
            </Campo>
            <Campo id="estado" label="Estado (sigla)" erro={erros.estado}>
              <Input id="campo-estado" maxLength={2} autoComplete="address-level1" value={dados.estado} onChange={(e) => set("estado", e.target.value.toUpperCase())} aria-invalid={!!erros.estado} aria-describedby={erros.estado ? "estado-erro" : undefined} className={cn(inputCls, "uppercase")} placeholder="SP" />
            </Campo>
          </div>
        )}

        {etapa === 1 && (
          <div className="space-y-8">
            <ChipGroup name="areas" legend="Áreas de interesse" hint="Escolha quantas quiser." options={AREAS} value={dados.areas} onChange={(v) => set("areas", v)} error={erros.areas} />
            <ChipGroup name="habilidades" legend="Suas habilidades" hint="Escolha pelo menos duas." options={HABILIDADES} value={dados.habilidades} onChange={(v) => set("habilidades", v)} error={erros.habilidades} />
          </div>
        )}

        {etapa === 2 && (
          <div className="space-y-8">
            <ChipGroup
              name="preferenciaAmbiente"
              type="radio"
              legend="Onde você gostaria de atuar?"
              options={["Urbano", "Rural", "Ambos"]}
              value={[dados.preferenciaAmbiente.charAt(0).toUpperCase() + dados.preferenciaAmbiente.slice(1)]}
              onChange={(v) => set("preferenciaAmbiente", (v[0] ?? "ambos").toLowerCase() as CadastroProfissional["preferenciaAmbiente"])}
            />
            <ChipGroup name="jornada" type="radio" legend="Jornada preferida" options={["4h/dia", "6h/dia", "8h/dia", "Flexível"]} value={dados.jornada ? [dados.jornada] : []} onChange={(v) => set("jornada", v[0] ?? "")} error={erros.jornada} />
            <ChipGroup name="recursos" legend="Recursos de acessibilidade que você usa" hint="Opcional. Ajuda empresas a preparar o robô e a rotina para você." options={RECURSOS_ACESSIBILIDADE} value={dados.recursos} onChange={(v) => set("recursos", v)} />
            <Campo id="observacoes" label="Algo mais que devemos saber? (opcional)" hint="Ex.: pausas, horários, tecnologia assistiva própria.">
              <Textarea id="campo-observacoes" value={dados.observacoes} onChange={(e) => set("observacoes", e.target.value)} rows={3} className="bg-surface/70 text-base" aria-describedby="observacoes-dica" />
            </Campo>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-border pt-6">
          <Button type="button" variant="hud" size="xl" onClick={() => { setErros({}); setEtapa((e) => Math.max(0, e - 1)); }} disabled={etapa === 0}>
            <ArrowLeft aria-hidden="true" /> Voltar
          </Button>
          <Button type="submit" variant="neon" size="xl">
            {etapa < ETAPAS.length - 1 ? <>Continuar <ArrowRight aria-hidden="true" /></> : <>Criar meu perfil <Sparkles aria-hidden="true" /></>}
          </Button>
        </div>
      </HudPanel>
    </form>
  );
}

function FormEmpresa() {
  const [d, setD] = useState<CadastroEmpresa>({ razao: "", cnpj: "", responsavel: "", email: "", ambiente: "urbano" });
  const [erros, setErros] = useState<ErrosEmpresa>({});
  const [ok, setOk] = useState(false);
  const resumoRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof CadastroEmpresa>(k: K, v: CadastroEmpresa[K]) => {
    setD((x) => ({ ...x, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
  };

  if (ok) {
    return (
      <HudPanel title="Parceria registrada" code="EMP.OK" bodyClassName="p-8 text-center">
        <CheckCircle2 className="mx-auto size-14 text-success" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-bold">{d.razao} agora faz parte do MOVA</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">Nossa equipe entrará em contato para avaliar o ambiente e indicar o robô mais adequado.</p>
        <Button asChild variant="violet" size="xl" className="mt-6"><Link to="/robos">Conhecer os robôs <ArrowRight aria-hidden="true" /></Link></Button>
      </HudPanel>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const er = validarEmpresa(d);
        setErros(er);
        if (Object.keys(er).length) {
          toast.error("Alguns campos precisam de atenção.");
          requestAnimationFrame(() => resumoRef.current?.focus());
          return;
        }
        acoes.salvarEmpresa(d);
        setOk(true);
        toast.success("Empresa cadastrada com sucesso.");
      }}
    >
      <HudPanel title="Empresa parceira" code="EMP.NEW" bodyClassName="p-6 sm:p-8">
        <ErrorSummary erros={erros} refEl={resumoRef} />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo id="razao" label="Nome da organização" erro={erros.razao}>
              <Input id="campo-razao" autoComplete="organization" value={d.razao} onChange={(e) => set("razao", e.target.value)} aria-invalid={!!erros.razao} className={inputCls} />
            </Campo>
          </div>
          <Campo id="cnpj" label="CNPJ" erro={erros.cnpj} hint="Somente números ou com pontuação.">
            <Input id="campo-cnpj" inputMode="numeric" value={d.cnpj} onChange={(e) => set("cnpj", e.target.value)} aria-invalid={!!erros.cnpj} className={inputCls} placeholder="00.000.000/0000-00" />
          </Campo>
          <Campo id="responsavel" label="Pessoa responsável" erro={erros.responsavel}>
            <Input id="campo-responsavel" autoComplete="name" value={d.responsavel} onChange={(e) => set("responsavel", e.target.value)} aria-invalid={!!erros.responsavel} className={inputCls} />
          </Campo>
          <div className="sm:col-span-2">
            <Campo id="email" label="E-mail corporativo" erro={erros.email}>
              <Input id="campo-email" type="email" autoComplete="email" value={d.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!erros.email} className={inputCls} />
            </Campo>
          </div>
          <div className="sm:col-span-2">
            <ChipGroup name="ambiente" type="radio" legend="Tipo de ambiente que receberá o robô" options={["Urbano", "Rural", "Ambos"]} value={[d.ambiente.charAt(0).toUpperCase() + d.ambiente.slice(1)]} onChange={(v) => set("ambiente", (v[0] ?? "urbano").toLowerCase() as CadastroEmpresa["ambiente"])} />
          </div>
        </div>
        <div className="mt-8 flex justify-end border-t border-border pt-6">
          <Button type="submit" variant="violet" size="xl">Cadastrar empresa <ArrowRight aria-hidden="true" /></Button>
        </div>
      </HudPanel>
    </form>
  );
}
