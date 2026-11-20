import { useSyncExternalStore } from "react";
import type { Operacao } from "./mova-data";
import type { CadastroEmpresa, CadastroProfissional } from "./validation";

// Browser-only persisted state for the prototype (localStorage). The server
// snapshot is always the defaults, so SSR and hydration stay consistent.

export type ModoControle = "clique" | "segurar" | "varredura";

export interface PreferenciasA11y {
  escalaFonte: 1 | 1.15 | 1.3 | 1.5;
  altoContraste: boolean;
  fonteLegivel: boolean;
  reduzirMovimento: boolean;
  alvosGrandes: boolean;
  modoControle: ModoControle;
  intervaloVarredura: number; // ms
  atalhosTeclado: boolean;
}

export type StatusCandidatura = "Enviada" | "Em análise" | "Entrevista agendada" | "Treinamento no robô";

export interface Candidatura {
  vagaId: string;
  data: string;
  status: StatusCandidatura;
}

export interface MovaState {
  perfil: CadastroProfissional | null;
  empresa: CadastroEmpresa | null;
  candidaturas: Candidatura[];
  salvas: string[];
  operacoes: Operacao[];
  a11y: PreferenciasA11y;
}

export const A11Y_PADRAO: PreferenciasA11y = {
  escalaFonte: 1,
  altoContraste: false,
  fonteLegivel: false,
  reduzirMovimento: false,
  alvosGrandes: false,
  modoControle: "clique",
  intervaloVarredura: 1200,
  atalhosTeclado: true,
};

export const ESTADO_PADRAO: MovaState = {
  perfil: null,
  empresa: null,
  candidaturas: [],
  salvas: [],
  operacoes: [],
  a11y: A11Y_PADRAO,
};

const KEY = "mova:v1";
let state: MovaState = ESTADO_PADRAO;
let carregado = false;
const listeners = new Set<() => void>();

function carregar() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<MovaState>;
      state = { ...ESTADO_PADRAO, ...parsed, a11y: { ...A11Y_PADRAO, ...parsed.a11y } };
    }
  } catch {
    state = ESTADO_PADRAO;
  }
}

function salvar() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: keep in memory */
  }
}

export function getState(): MovaState {
  carregar();
  return state;
}

export function setState(updater: (s: MovaState) => MovaState) {
  carregar();
  state = updater(state);
  salvar();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useMova<T>(selector: (s: MovaState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(ESTADO_PADRAO),
  );
}

// ---- Actions ----
export const acoes = {
  salvarPerfil(perfil: CadastroProfissional) {
    setState((s) => ({ ...s, perfil }));
  },
  salvarEmpresa(empresa: CadastroEmpresa) {
    setState((s) => ({ ...s, empresa }));
  },
  candidatar(vagaId: string): boolean {
    if (getState().candidaturas.some((c) => c.vagaId === vagaId)) return false;
    setState((s) => ({
      ...s,
      candidaturas: [{ vagaId, data: new Date().toISOString(), status: "Enviada" }, ...s.candidaturas],
    }));
    return true;
  },
  cancelarCandidatura(vagaId: string) {
    setState((s) => ({ ...s, candidaturas: s.candidaturas.filter((c) => c.vagaId !== vagaId) }));
  },
  alternarSalva(vagaId: string): boolean {
    const jaSalva = getState().salvas.includes(vagaId);
    setState((s) => ({
      ...s,
      salvas: jaSalva ? s.salvas.filter((id) => id !== vagaId) : [...s.salvas, vagaId],
    }));
    return !jaSalva;
  },
  registrarOperacao(op: Operacao) {
    setState((s) => ({ ...s, operacoes: [op, ...s.operacoes].slice(0, 30) }));
  },
  atualizarA11y(p: Partial<PreferenciasA11y>) {
    setState((s) => ({ ...s, a11y: { ...s.a11y, ...p } }));
  },
  resetarA11y() {
    setState((s) => ({ ...s, a11y: A11Y_PADRAO }));
  },
};
