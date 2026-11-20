# MOVA — Plano de implementação da entrega

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Levar o protótipo MOVA do Lovable para o repo `defxico/mova`, limpo, com build passando, páginas `/painel` e `/impacto`, testes das regras, deploy na Vercel e documentação.

**Architecture:** App TanStack Start (React 19, SSR via Nitro) com rotas por arquivo em `src/routes`. Estado do protótipo no `localStorage` (`src/lib/mova-store.ts`). Lógica pura em `src/lib/*.ts`, testada com Vitest. Deploy na Vercel, com o Nitro detectando o preset `vercel` no build.

**Tech Stack:** TanStack Start 1.168, React 19, TypeScript 5.8, Tailwind 4, shadcn/ui (Radix), Vite 8, Nitro 3 beta, Vitest 4, npm.

## Global Constraints

- Idioma de toda interface e documentação: português do Brasil.
- Acessibilidade: WCAG 2.2 AA — teclado completo, link para pular ao conteúdo, texto alternativo, estados também em texto (não só cor), alvos de toque grandes.
- Todos os dados são fictícios. Nenhum robô real é conectado. O MOVA é opção a mais, nunca substituto de ambientes acessíveis.
- Cor de tema `#090B12`. Rótulos de console no estilo `// eyebrow`, `SYS.01`, `NAV.MAP`.
- Identidade git: só config local do repo (já feita). Não mexer em config global nem na conta ativa do `gh`.
- Push com o token do defxico: `GH_TOKEN=$(gh auth token --user defxico)` e credential helper inline (ver Task 5).
- Commits terminam com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Fonte extraída do Lovable: `SRC=/c/Users/Xico/AppData/Local/Temp/claude/5db85541ed2b1797/22e3f85a-564e-4ff1-981b-bf0225576c4c/scratchpad/lovable` (somente leitura).
- Spec do produto: `/c/Users/Xico/Downloads/MOVA-Especificacao-do-Produto.docx`.

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `package.json` | criar | deps só do que é usado; scripts |
| `vite.config.ts` | criar | plugins explícitos (sem config do Lovable) |
| `vitest.config.ts` | criar | testes de `src/lib` |
| `src/**` (do Lovable) | copiar | app |
| `src/routes/__root.tsx` | modificar | remover report de erro do Lovable |
| `src/lib/mova-data.ts` | modificar | `podeSimular`, `filtrarRobos` |
| `src/routes/robos.tsx`, `src/routes/controle.tsx` | modificar | usar os helpers |
| `src/lib/painel.ts` | criar | `resumoJornadas` |
| `src/routes/painel.tsx` | criar | RF-33 |
| `src/routes/impacto.tsx` | criar | RF-34 |
| `src/lib/*.test.ts` | criar | testes |
| `docs/especificacao.md` | criar | spec convertida |
| `README.md` | criar | documentação para avaliação |

Não copiar: `.lovable/`, `AGENTS.md`, `bunfig.toml`, `README.md`, `favicon.ico` da raiz, `src/server.ts`, `src/start.ts`, `src/lib/error-capture.ts`, `src/lib/error-page.ts`, `src/lib/lovable-error-reporting.ts`, `src/test/`.

---

### Task 1: Importar o protótipo limpo e fazer o build passar

**Files:**
- Copy: `$SRC/src/**` (exceto a lista "Não copiar"), `$SRC/public/**`, `$SRC/.gitignore`, `$SRC/.prettierrc`, `$SRC/components.json`, `$SRC/eslint.config.js`, `$SRC/tsconfig.json`
- Create: `package.json`, `vite.config.ts`, `.prettierignore`
- Modify: `src/routes/__root.tsx`, `.gitignore`

**Interfaces:**
- Produces: app rodando com `npm run dev` e `npm run build`. `routeTree.gen.ts` é gerado pelo plugin do TanStack, não editar à mão.

- [ ] **Step 1: Copiar arquivos**

```bash
SRC=/c/Users/Xico/AppData/Local/Temp/claude/5db85541ed2b1797/22e3f85a-564e-4ff1-981b-bf0225576c4c/scratchpad/lovable
cd /c/dev/MOVA
cp -r "$SRC/src" "$SRC/public" .
cp "$SRC/.gitignore" "$SRC/.prettierrc" "$SRC/components.json" "$SRC/eslint.config.js" "$SRC/tsconfig.json" .
rm -rf src/server.ts src/start.ts src/lib/error-capture.ts src/lib/error-page.ts src/lib/lovable-error-reporting.ts src/test
```

- [ ] **Step 2: Criar `package.json`**

```json
{
  "name": "mova",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "MOVA — vagas por robôs de telepresença para pessoas com deficiência ou mobilidade reduzida (protótipo CitizenTech, Global Solution 2026).",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest run"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@tailwindcss/vite": "^4.2.1",
    "@tanstack/react-query": "^5.101.1",
    "@tanstack/react-router": "1.170.41",
    "@tanstack/react-start": "1.168.60",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.575.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.1",
    "tw-animate-css": "^1.3.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@types/node": "^22.16.5",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.2.0",
    "eslint": "^9.32.0",
    "eslint-config-prettier": "^10.1.1",
    "eslint-plugin-prettier": "^5.2.6",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "nitro": "3.0.260603-beta",
    "prettier": "^3.7.3",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.56.1",
    "vite": "8.1.5",
    "vite-tsconfig-paths": "^6.0.2",
    "vitest": "^4.1.10"
  }
}
```

- [ ] **Step 3: Criar `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Nitro picks the "vercel" preset automatically when building on Vercel.
export default defineConfig({
  plugins: [tsConfigPaths(), tanstackStart(), nitro(), viteReact(), tailwindcss()],
});
```

- [ ] **Step 4: Ajustar `src/routes/__root.tsx`**

Remover a linha `import { reportLovableError } from "../lib/lovable-error-reporting";` e, em `ErrorComponent`, remover o bloco:

```tsx
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
```

Trocar `import { useEffect, type ReactNode } from "react";` por `import type { ReactNode } from "react";`. O `console.error(error);` no topo de `ErrorComponent` fica.

- [ ] **Step 5: `.gitignore` e `.prettierignore`**

Acrescentar ao fim de `.gitignore`:

```
.vercel
```

Criar `.prettierignore`:

```
src/routeTree.gen.ts
.output
dist
```

- [ ] **Step 6: Instalar e buildar**

Run: `npm install && npm run build`
Expected: build termina sem erro. `src/routeTree.gen.ts` é regenerado. Se `nitro/vite` não exportar `nitro`, rodar `node -e "import('nitro/vite').then(m=>console.log(Object.keys(m)))"` e usar o nome exportado.

- [ ] **Step 7: Conferir no navegador**

Run: `npm run dev` e abrir `http://localhost:3000` (ou a porta que o Vite mostrar). Expected: home com hero neon, menu funciona, `/robos`, `/oportunidades`, `/cadastro`, `/controle` abrem. `/painel` e `/impacto` mostram a 404 "sinal perdido" — esperado até as Tasks 3 e 4.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: importa protótipo do Lovable sem arquivos da plataforma

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Testes das regras e helpers de robô

**Files:**
- Create: `vitest.config.ts`, `src/lib/matching.test.ts`, `src/lib/validation.test.ts`, `src/lib/robot-sim.test.ts`, `src/lib/mova-data.test.ts`
- Modify: `src/lib/mova-data.ts` (fim do arquivo), `src/routes/robos.tsx:33` e `:111`, `src/routes/controle.tsx:102` e `:276-277`

**Interfaces:**
- Consumes: `filtrarVagas(vagas, f)`, `FILTROS_PADRAO`, `compatibilidade(vaga, perfil)` de `matching.ts`; `validarCadastro(d, campos?)`, `ETAPAS_CAMPOS`, `validarCnpj(cnpj)` de `validation.ts`; `reduzirRobo(s, a)`, `podeMover(s)`, `ESTADO_INICIAL` de `robot-sim.ts`.
- Produces: em `mova-data.ts`, `podeSimular(r: Robo): boolean` e `filtrarRobos(robos: Robo[], ambiente: Ambiente | "todos"): Robo[]`.

- [ ] **Step 1: Criar `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
```

Em `tsconfig.json`, trocar `"types": ["vite/client", "vitest/globals"]` por `"types": ["vite/client"]` (testes importam de `vitest` explicitamente).

- [ ] **Step 2: Escrever testes que falham (helpers novos)**

`src/lib/mova-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ROBOS, filtrarRobos, podeSimular } from "./mova-data";

describe("robôs", () => {
  it("frota tem 3 disponíveis, 1 em operação e 1 em manutenção", () => {
    const n = (s: string) => ROBOS.filter((r) => r.status === s).length;
    expect([n("disponível"), n("em operação"), n("manutenção")]).toEqual([3, 1, 1]);
  });

  it("robô em manutenção não abre no simulador", () => {
    for (const r of ROBOS) expect(podeSimular(r)).toBe(r.status !== "manutenção");
    expect(podeSimular(ROBOS.find((r) => r.id === "campo-05")!)).toBe(false);
  });

  it("filtro rural devolve só robôs rurais", () => {
    const rurais = filtrarRobos(ROBOS, "rural");
    expect(rurais.length).toBeGreaterThan(0);
    expect(rurais.every((r) => r.ambiente === "rural")).toBe(true);
    expect(filtrarRobos(ROBOS, "todos")).toHaveLength(ROBOS.length);
  });
});
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npx vitest run src/lib/mova-data.test.ts`
Expected: FAIL — `filtrarRobos`/`podeSimular` não exportados.

- [ ] **Step 4: Implementar no fim de `src/lib/mova-data.ts`**

```ts
export function podeSimular(r: Robo): boolean {
  return r.status !== "manutenção";
}

export function filtrarRobos(robos: Robo[], ambiente: Ambiente | "todos"): Robo[] {
  return ambiente === "todos" ? robos : robos.filter((r) => r.ambiente === ambiente);
}
```

Se o id do CAMPO-05 em `ROBOS` não for `"campo-05"`, ajustar o teste ao id real (`grep -n 'id: "' src/lib/mova-data.ts`).

- [ ] **Step 5: Usar os helpers nas telas**

`src/routes/robos.tsx`: import passa a ser `import { ROBOS, filtrarRobos, podeSimular, type Ambiente } from "@/lib/mova-data";`. Linha 33: `const lista = filtrarRobos(ROBOS, amb);`. Linha 111: `{!podeSimular(r) ? (`.

`src/routes/controle.tsx`: acrescentar `podeSimular` ao import de `@/lib/mova-data`. Linha 102: `const disponivel = podeSimular(robo);`. Linhas 276-277: `disabled={!podeSimular(r)}` e `{!podeSimular(r) ? "(manutenção)" : ""}`.

- [ ] **Step 6: Testes das regras existentes**

`src/lib/matching.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { VAGAS } from "./mova-data";
import { FILTROS_PADRAO, compatibilidade, filtrarVagas } from "./matching";

describe("vagas", () => {
  it("sem filtro mostra as 7 vagas", () => {
    expect(filtrarVagas(VAGAS, FILTROS_PADRAO)).toHaveLength(7);
  });

  it("filtro rural devolve só vagas rurais", () => {
    const r = filtrarVagas(VAGAS, { ...FILTROS_PADRAO, ambiente: "rural" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((v) => v.ambiente === "rural")).toBe(true);
  });

  it("busca ignora acento e caixa", () => {
    const r = filtrarVagas(VAGAS, { ...FILTROS_PADRAO, busca: "ESTUFA" });
    expect(r.some((v) => v.titulo.toLowerCase().includes("estufa"))).toBe(true);
  });
});

describe("compatibilidade", () => {
  const vaga = VAGAS[0]!;

  it("sem perfil é 0", () => {
    expect(compatibilidade(vaga, null)).toBe(0);
  });

  it("perfil completo vale 100 e supera perfil parcial", () => {
    const completo = compatibilidade(vaga, { habilidades: vaga.habilidades, areas: [vaga.area] });
    const parcial = compatibilidade(vaga, { habilidades: vaga.habilidades.slice(0, 1), areas: [] });
    expect(completo).toBe(100);
    expect(parcial).toBeLessThan(completo);
  });
});
```

`src/lib/validation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ETAPAS_CAMPOS, validarCadastro, validarCnpj, type CadastroProfissional } from "./validation";

const base: CadastroProfissional = {
  nome: "Ana Souza",
  email: "ana@exemplo.com",
  cidade: "Recife",
  estado: "PE",
  areas: ["Atendimento"],
  habilidades: ["Comunicação", "Organização"],
  preferenciaAmbiente: "ambos",
  jornada: "6h/dia",
  recursos: [],
  observacoes: "",
};

describe("cadastro", () => {
  it("dados válidos não têm erro", () => {
    expect(validarCadastro(base)).toEqual({});
  });

  it("etapa 1 só valida os campos da etapa 1", () => {
    const e = validarCadastro({ ...base, email: "x", habilidades: [] }, ETAPAS_CAMPOS[0]);
    expect(Object.keys(e)).toEqual(["email"]);
  });

  it("estado precisa de sigla com 2 letras", () => {
    expect(validarCadastro({ ...base, estado: "Pernambuco" }).estado).toBeDefined();
  });

  it("exige ao menos duas habilidades", () => {
    expect(validarCadastro({ ...base, habilidades: ["Comunicação"] }).habilidades).toBeDefined();
  });
});

describe("CNPJ", () => {
  it("aceita CNPJ válido com ou sem máscara", () => {
    expect(validarCnpj("11.222.333/0001-81")).toBe(true);
    expect(validarCnpj("11222333000181")).toBe(true);
  });

  it("recusa dígito errado e números repetidos", () => {
    expect(validarCnpj("11.222.333/0001-82")).toBe(false);
    expect(validarCnpj("11111111111111")).toBe(false);
  });
});
```

`validation.ts` tipa `areas`/`habilidades` como `string[]`, então os valores acima não precisam bater com as listas de `mova-data.ts`.

`src/lib/robot-sim.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ESTADO_INICIAL, LIMITE, podeMover, reduzirRobo, type AcaoRobo, type EstadoRobo } from "./robot-sim";

const run = (s: EstadoRobo, ...acoes: AcaoRobo[]) => acoes.reduce(reduzirRobo, s);
const conectado = run(ESTADO_INICIAL, { tipo: "conectar" }, { tipo: "conectado" });

describe("simulador", () => {
  it("desconectado não move", () => {
    const s = run(ESTADO_INICIAL, { tipo: "mover", direcao: "frente" });
    expect(s.passos).toBe(0);
    expect(s.ultimoBloqueio).toMatch(/Conecte-se/);
  });

  it("conectado anda para frente", () => {
    const s = run(conectado, { tipo: "mover", direcao: "frente" });
    expect(s.passos).toBe(1);
    expect(s.y).toBeGreaterThan(conectado.y);
  });

  it("parada de emergência bloqueia movimento até retomar", () => {
    const parado = run(conectado, { tipo: "emergencia" });
    expect(parado.modo).toBe("emergencia");
    expect(podeMover(parado)).toMatch(/emergência/);
    const tentou = run(parado, { tipo: "mover", direcao: "frente" });
    expect(tentou.passos).toBe(0);
    const voltou = run(parado, { tipo: "retomar" }, { tipo: "mover", direcao: "frente" });
    expect(voltou.passos).toBe(1);
  });

  it("não sai da área segura", () => {
    const naBorda: EstadoRobo = { ...conectado, y: LIMITE };
    const s = run(naBorda, { tipo: "mover", direcao: "frente" });
    expect(s.y).toBe(LIMITE);
    expect(s.ultimoBloqueio).toMatch(/área segura/);
  });
});
```

- [ ] **Step 7: Rodar tudo**

Run: `npm test`
Expected: todos PASS. Se algum valor de dado diferir (ex.: busca "ESTUFA"), ler `mova-data.ts` e ajustar o teste ao dado real, nunca o dado ao teste.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "test: regras de vagas, cadastro, CNPJ, simulador e frota

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Página Meu painel (`/painel`, RF-33)

**Files:**
- Create: `src/lib/painel.ts`, `src/lib/painel.test.ts`, `src/routes/painel.tsx`

**Interfaces:**
- Consumes: `useMova(selector)` e `MovaState` (`perfil`, `candidaturas`, `operacoes`) de `mova-store.ts`; `OPERACOES_DEMO`, `HORAS_SEMANA`, `getRobo`, `getVaga`, `type Operacao` de `mova-data.ts`; `PageIntro`, `HudPanel`, `StatusDot` de `components/mova/Hud`; `Button` (variants `neon`, `hud`; size `xl`), `Badge` (variants `cyan`, `violet`, `success`, `warning`).
- Produces: `resumoJornadas(ops: Operacao[]): { sessoes: number; horas: number; acoes: number }`.

- [ ] **Step 1: Teste que falha** — `src/lib/painel.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { resumoJornadas } from "./painel";
import { OPERACOES_DEMO } from "./mova-data";

describe("resumoJornadas", () => {
  it("lista vazia zera tudo", () => {
    expect(resumoJornadas([])).toEqual({ sessoes: 0, horas: 0, acoes: 0 });
  });

  it("soma sessões, horas (1 casa) e ações", () => {
    const r = resumoJornadas(OPERACOES_DEMO);
    expect(r.sessoes).toBe(4);
    expect(r.horas).toBe(20.3); // (360+330+180+345)/60 = 20.25 → 20.3
    expect(r.acoes).toBe(258);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/painel.test.ts`
Expected: FAIL — módulo `./painel` não existe.

- [ ] **Step 3: Implementar `src/lib/painel.ts`**

```ts
import type { Operacao } from "./mova-data";

export function resumoJornadas(ops: Operacao[]) {
  const minutos = ops.reduce((t, o) => t + o.duracaoMin, 0);
  return {
    sessoes: ops.length,
    horas: Math.round((minutos / 60) * 10) / 10,
    acoes: ops.reduce((t, o) => t + o.acoes, 0),
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/painel.test.ts`
Expected: PASS.

- [ ] **Step 5: Criar `src/routes/painel.tsx`**

```tsx
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
      { name: "description", content: "Jornadas feitas pelo robô, candidaturas e dados do seu perfil profissional no MOVA." },
    ],
  }),
  component: PainelPage,
});

const dataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

function PainelPage() {
  const perfil = useMova((s) => s.perfil);
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
        title={perfil ? <>Olá, <span className="text-neon">{perfil.nome.split(" ")[0]}</span></> : "Meu painel"}
        aside={
          <Button asChild variant="neon" size="xl">
            <Link to="/controle"><Gamepad2 aria-hidden="true" /> Abrir central de controle</Link>
          </Button>
        }
      >
        Suas jornadas pelo robô, candidaturas e dados do perfil. Tudo fica salvo só neste navegador.
      </PageIntro>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <section aria-labelledby="resumo-titulo" className="lg:col-span-3">
          <h2 id="resumo-titulo" className="sr-only">Resumo das jornadas</h2>
          <dl className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Bot, rotulo: "Sessões no robô", valor: String(resumo.sessoes) },
              { icon: Clock, rotulo: "Horas de jornada", valor: `${resumo.horas.toLocaleString("pt-BR")} h` },
              { icon: Briefcase, rotulo: "Candidaturas", valor: String(candidaturas.length) },
            ].map(({ icon: Icon, rotulo, valor }) => (
              <div key={rotulo} className="glass hud-frame rounded-lg p-4">
                <dt className="label-hud flex items-center gap-2"><Icon className="size-4" aria-hidden="true" /> {rotulo}</dt>
                <dd className="mt-2 font-display text-3xl font-bold">{valor}</dd>
              </div>
            ))}
          </dl>
          {exemplo && (
            <p className="mt-3 text-sm text-muted-foreground">
              Você ainda não operou um robô. Os números acima são um exemplo. Conecte-se na central de controle para registrar sua primeira jornada.
            </p>
          )}
        </section>

        <HudPanel title="Horas na semana" code="SYS.HRS" className="lg:col-span-2">
          <figure>
            <div className="flex h-48 items-end gap-3" aria-hidden="true">
              {HORAS_SEMANA.map((d) => (
                <div key={d.dia} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t bg-primary/80" style={{ height: `${(d.horas / maxHoras) * 100}%` }} />
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
              <div><dt className="label-hud">Nome</dt><dd>{perfil.nome}</dd></div>
              <div><dt className="label-hud">Local</dt><dd>{perfil.cidade} · {perfil.estado.toUpperCase()}</dd></div>
              <div><dt className="label-hud">Áreas</dt><dd>{perfil.areas.join(", ")}</dd></div>
              <div><dt className="label-hud">Habilidades</dt><dd>{perfil.habilidades.join(", ")}</dd></div>
              <div><dt className="label-hud">Recursos de acessibilidade</dt><dd>{perfil.recursos.length ? perfil.recursos.join(", ") : "Nenhum informado"}</dd></div>
            </dl>
          ) : (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">Crie seu perfil para ver a compatibilidade com as vagas.</p>
              <Button asChild variant="hud"><Link to="/cadastro"><UserPlus aria-hidden="true" /> Criar perfil</Link></Button>
            </div>
          )}
        </HudPanel>

        <HudPanel title="Candidaturas" code="JOB.LST" className="lg:col-span-1">
          {candidaturas.length === 0 ? (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">Nenhuma candidatura ainda.</p>
              <Button asChild variant="hud"><Link to="/oportunidades">Ver oportunidades</Link></Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {candidaturas.map((c) => {
                const v = getVaga(c.vagaId);
                return (
                  <li key={c.vagaId} className="rounded-md border border-border p-3 text-sm">
                    <p className="font-semibold">{v?.titulo ?? c.vagaId}</p>
                    <p className="text-muted-foreground">{v?.empresa} · enviada em {dataCurta(c.data)}</p>
                    <Badge variant="cyan" className="mt-2">{c.status}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </HudPanel>

        <HudPanel title="Jornadas registradas" code="OPS.LOG" className="lg:col-span-2">
          <ul className="divide-y divide-border">
            {jornadas.map((o) => (
              <li key={o.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:gap-4">
                <span className="flex items-center gap-2 font-semibold">
                  <StatusDot tone="success" /> {getRobo(o.roboId)?.nome ?? o.roboId}
                </span>
                <span className="text-muted-foreground">{o.local} · {dataCurta(o.data)} · {Math.round(o.duracaoMin / 6) / 10} h · {o.acoes} ações</span>
                <span className="sm:ml-auto">{o.resumo}</span>
              </li>
            ))}
          </ul>
        </HudPanel>
      </div>
    </>
  );
}
```

- [ ] **Step 6: Typecheck e conferir**

Run: `npm run typecheck` (pode ainda acusar `/impacto` — resolvido na Task 4) e `npm run dev`; abrir `/painel` sem perfil (dica "Criar perfil" e números de exemplo), depois preencher `/cadastro` com "Preencher exemplo" e voltar (nome aparece). Navegar só com Tab: todos os botões alcançáveis.

- [ ] **Step 7: Commit**

```bash
git add src/lib/painel.ts src/lib/painel.test.ts src/routes/painel.tsx src/routeTree.gen.ts
git commit -m "feat: página Meu painel com jornadas, candidaturas e perfil

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Página Impacto (`/impacto`, RF-34)

**Files:**
- Create: `src/routes/impacto.tsx`

**Interfaces:**
- Consumes: `PageIntro`, `HudPanel` de `components/mova/Hud`; `Button`, `Badge`.

- [ ] **Step 1: Criar `src/routes/impacto.tsx`**

```tsx
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
          <h2 id="problema-titulo" className="label-hud mb-4 text-accent">// o problema</h2>
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
          <h2 id="ods-titulo" className="label-hud mb-4 text-accent">// objetivos de desenvolvimento sustentável</h2>
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

        <aside className="flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm" aria-label="Aviso">
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
```

Se a classe `bg-warning/10` ou `border-warning/40` não existir no tema, conferir em `src/styles.css` o token (`--color-warning`); Tailwind 4 gera as variantes de opacidade a partir dele.

- [ ] **Step 2: Typecheck, testes e build**

Run: `npm run typecheck && npm test && npm run build`
Expected: os três sem erro. A partir daqui, todos os links do menu e rodapé têm destino.

- [ ] **Step 3: Conferir no navegador**

`npm run dev`, abrir `/impacto` em largura de celular (375 px) e desktop: sem rolagem horizontal, cartões empilham no celular.

- [ ] **Step 4: Commit**

```bash
git add src/routes/impacto.tsx src/routeTree.gen.ts
git commit -m "feat: página Impacto com números, ODS 8, 9 e 10 e jornada

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Push e deploy na Vercel

**Files:** nenhum arquivo novo (o Nitro detecta a Vercel sozinho).

- [ ] **Step 1: Push para `defxico/mova`**

```bash
cd /c/dev/MOVA
GH_TOKEN=$(gh auth token --user defxico) git -c credential.helper= -c 'credential.helper=!f() { echo username=defxico; echo "password=$GH_TOKEN"; }; f' push -u origin main
```

Expected: `main -> main`. Conferir em `https://github.com/defxico/mova`.

- [ ] **Step 2: Descrição e tópicos do repo**

```bash
GH_TOKEN=$(gh auth token --user defxico) gh repo edit defxico/mova \
  --description "MOVA — vagas por robôs de telepresença para pessoas com deficiência. Protótipo CitizenTech, Global Solution 2026." \
  --add-topic acessibilidade --add-topic tanstack-start --add-topic react --add-topic inclusao --add-topic telepresenca
```

- [ ] **Step 3: Vercel (passo do usuário)**

O usuário entra em vercel.com com a conta GitHub `defxico`, clica em "Add New → Project", importa `defxico/mova` e confirma sem mudar nada (framework detectado: TanStack Start; build `npm run build`). Esperar o deploy e copiar a URL `https://….vercel.app`.

- [ ] **Step 4: Verificar o deploy**

Abrir a URL de produção e conferir: home, `/oportunidades?` com filtro rural, `/robos`, `/controle?robo=aurora-01` (conectar, mover com setas, Esc para), `/painel`, `/impacto`, e recarregar direto numa rota interna (não pode dar 404). Se o build da Vercel falhar por preset, acrescentar em `vite.config.ts` `nitro({ preset: "vercel" })` no lugar de `nitro()`, commitar e repetir o push.

- [ ] **Step 5: Link no repo**

```bash
GH_TOKEN=$(gh auth token --user defxico) gh repo edit defxico/mova --homepage "<URL da Vercel copiada no Step 3>"
```

---

### Task 6: Documentação

**Files:**
- Create: `docs/especificacao.md`, `README.md`, `docs/img/` (prints)

- [ ] **Step 1: Converter a spec**

Script fora do repo (scratchpad), lendo o .docx e escrevendo Markdown com tabelas:

```python
# scratchpad/docx2md.py — uso: python -I docx2md.py <in.docx> <out.md>
import sys, zipfile, re, html
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
import xml.etree.ElementTree as ET
root = ET.fromstring(zipfile.ZipFile(sys.argv[1]).read("word/document.xml"))
txt = lambda el: html.unescape("".join(t.text or "" for t in el.iter(W + "t"))).strip()
out = []
for el in root.find(W + "body"):
    if el.tag == W + "p":
        t = txt(el)
        if not t:
            continue
        style = el.find(f"{W}pPr/{W}pStyle")
        s = style.get(W + "val") if style is not None else ""
        if s.startswith("Heading1") or s == "Title": out.append(f"## {t}")
        elif s.startswith("Heading"): out.append(f"### {t}")
        elif el.find(f"{W}pPr/{W}numPr") is not None: out.append(f"- {t}")
        else: out.append(t)
    elif el.tag == W + "tbl":
        rows = [[txt(c) for c in r.iter(W + "tc")] for r in el.iter(W + "tr")]
        out.append("| " + " | ".join(rows[0]) + " |")
        out.append("|" + "---|" * len(rows[0]))
        out += ["| " + " | ".join(r) + " |" for r in rows[1:]]
    out.append("")
open(sys.argv[2], "w", encoding="utf-8").write("# MOVA — Especificação do produto\n\n" + "\n".join(out))
```

Run: `python -I <scratchpad>/docx2md.py "/c/Users/Xico/Downloads/MOVA-Especificacao-do-Produto.docx" docs/especificacao.md`
Depois ler o resultado e corrigir à mão títulos que saírem como parágrafo (seções "1. Visão geral" a "14. Próximas fases" devem ser `##`). Atualizar a seção "13. Pontos em aberto" marcando o que esta entrega resolveu (painel, impacto) e a "Origem" para o repo GitHub.

- [ ] **Step 2: Prints**

Com `npm run dev`, capturar em `docs/img/`: `home.png` (desktop), `oportunidades.png`, `controle.png` (conectado), `painel.png`, `mobile-home.png` (375 px). Usar o navegador embutido ou o Chrome; cada imagem < 500 KB.

- [ ] **Step 3: Escrever `README.md`**

````markdown
# MOVA — Sua presença não tem fronteira

**Mobilidade, Oportunidade, Voz e Autonomia.** Plataforma web que liga pessoas com deficiência ou mobilidade reduzida a vagas de trabalho feitas por robôs de telepresença. A pessoa fica em casa e controla, à distância, um robô numa loja, museu, prefeitura, estufa ou fazenda.

Protótipo do desafio **CitizenTech — Global Solution 2026**. Robôs, empresas e vagas são simulados.

**Site:** <URL da Vercel> · **Especificação:** [docs/especificacao.md](docs/especificacao.md)

![Home do MOVA](docs/img/home.png)

## O problema

| Indicador | Valor | Fonte |
|---|---|---|
| Pessoas com deficiência no Brasil | 18,6 milhões | IBGE, PNAD Contínua 2022 |
| Participação na força de trabalho | 29,2% (contra 66,4% sem deficiência) | IBGE, PNAD Contínua 2022 |
| Vivem longe de vagas com deslocamento diário | 2 em 3 | Estimativa ilustrativa do projeto |

Falta de rampa, transporte inacessível e distância dos centros deixam muita gente fora do mercado. O MOVA leva a presença profissional até a vaga. Inspiração: Dawn Avatar Robot Café, em Tóquio. O MOVA é uma opção a mais, nunca substituto de ambientes acessíveis.

## Quem usa e a jornada

- **Profissional com deficiência ou mobilidade reduzida:** escolhe vaga, ambiente e jornada; usa controle adaptado (teclado, toque, pressionar e segurar, varredura) e pausas.
- **Empresa parceira:** contrata além do raio de deslocamento, com operação monitorada e parada de emergência.

Jornada: **Home → Cadastro (3 etapas) → Oportunidades (filtrar e ordenar por compatibilidade) → Candidatura → Treino no simulador → Jornada registrada no painel.**

## Telas

| Rota | Tela | O que faz |
|---|---|---|
| `/` | Home | Produto, números, como funciona, benefícios, cidade e campo |
| `/cadastro` | Cadastro | Profissional em 3 etapas ou empresa (`?perfil=empresa`, valida CNPJ) |
| `/oportunidades` | Oportunidades | 7 vagas, filtros, compatibilidade, candidatura |
| `/robos` | Central de robôs | Frota de 5 robôs com ficha técnica |
| `/controle` | Central de controle | Simulador (`?robo=aurora-01`) com câmera, mapa, log e parada de emergência |
| `/painel` | Meu painel | Jornadas, horas, candidaturas e perfil |
| `/impacto` | Impacto | Números, ODS 8, 9 e 10, jornada do usuário |

| Oportunidades | Central de controle | Painel |
|---|---|---|
| ![Oportunidades](docs/img/oportunidades.png) | ![Controle](docs/img/controle.png) | ![Painel](docs/img/painel.png) |

## Como o JavaScript melhora a experiência

- Filtros e busca de vagas atualizam a lista e o contador na hora, ignorando acentos.
- Compatibilidade de 0 a 100 entre perfil e vaga, com ordenação.
- Cadastro em etapas com validação por campo e mensagens claras; dá para voltar sem perder dados.
- Simulador: máquina de estados do robô (conectar, mover, limite da área segura, bateria), teclado (setas, WASD, Esc), varredura com acionador único e registro de comunicação.
- Perfil, candidaturas, jornadas e preferências de acessibilidade salvos no navegador (`localStorage`).

## Acessibilidade e responsividade

- Menu **Acessibilidade** em todas as telas: tamanho do texto, alto contraste, fonte de alta legibilidade (Atkinson Hyperlegible), menos animação, alvos maiores e modo de controle do robô.
- Link "pular para o conteúdo", navegação completa por teclado e foco visível.
- Estado de conexão e alertas também em texto, não só por cor.
- Texto alternativo nas imagens e gráficos com descrição para leitor de tela.
- Layout para celular, tablet e desktop, com controles por toque.

![MOVA no celular](docs/img/mobile-home.png)

## Tecnologia e organização

TanStack Start (React 19, SSR), TypeScript, Tailwind CSS 4, shadcn/ui (Radix), Vitest. Deploy na Vercel.

```
src/
  routes/       uma rota por arquivo
  components/   mova/ (produto), controle/ (simulador), ui/ (base)
  lib/          dados fictícios, regras puras e testes
  assets/       imagens
docs/           especificação, design e plano
```

## Como rodar

Requer Node.js 20 ou mais novo.

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # regras de vagas, cadastro, simulador e painel
npm run build
```

## Integrantes

| Nome | RM |
|---|---|
| (preencher) | |

## Origem

Protótipo iniciado no Lovable e finalizado neste repositório. Todos os dados são fictícios.
````

Trocar `<URL da Vercel>` pela URL da Task 5. A tabela de integrantes fica com "(preencher)" até o usuário mandar os nomes — decisão dele.

- [ ] **Step 4: Commit e push**

```bash
git add README.md docs
git commit -m "docs: README, especificação e prints

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
GH_TOKEN=$(gh auth token --user defxico) git -c credential.helper= -c 'credential.helper=!f() { echo username=defxico; echo "password=$GH_TOKEN"; }; f' push
```

---

### Task 7: Verificação final (critérios de aceite, spec §12)

- [ ] **Step 1:** `npm run typecheck && npm test && npm run build` — tudo verde.
- [ ] **Step 2:** No site publicado, conferir à mão:
  - Sem perfil, ordenar por compatibilidade mostra a dica "Criar perfil".
  - Ficha do CAMPO-05 não tem "Abrir no simulador".
  - Simulador conectado: Esc para o robô na hora e aparece evento no log.
  - Cadastro: voltar da etapa 2 para a 1 mantém os dados.
  - Filtro "rural" em vagas e em robôs mostra só rurais e o contador muda.
  - Fluxo inteiro só com teclado; layout em 375 px sem rolagem horizontal.
- [ ] **Step 3:** Rodar `/fairmind-design:a11y-audit` ou `design:accessibility-review` na URL publicada se o usuário quiser um relatório de acessibilidade para a apresentação.
