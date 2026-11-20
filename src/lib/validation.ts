export interface CadastroProfissional {
  nome: string;
  email: string;
  cidade: string;
  estado: string;
  areas: string[];
  habilidades: string[];
  preferenciaAmbiente: "urbano" | "rural" | "ambos";
  jornada: string;
  recursos: string[];
  observacoes: string;
}

export type ErrosCadastro = Partial<Record<keyof CadastroProfissional, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const ETAPAS_CAMPOS: (keyof CadastroProfissional)[][] = [
  ["nome", "email", "cidade", "estado"],
  ["areas", "habilidades"],
  ["preferenciaAmbiente", "jornada"],
];

export function validarCadastro(
  d: CadastroProfissional,
  campos: (keyof CadastroProfissional)[] = ETAPAS_CAMPOS.flat(),
): ErrosCadastro {
  const e: ErrosCadastro = {};
  const quer = (k: keyof CadastroProfissional) => campos.includes(k);

  if (quer("nome")) {
    const nome = d.nome.trim();
    if (!nome) e.nome = "Informe seu nome.";
    else if (nome.length < 3) e.nome = "O nome precisa ter pelo menos 3 letras.";
  }
  if (quer("email")) {
    if (!d.email.trim()) e.email = "Informe seu e-mail.";
    else if (!EMAIL_RE.test(d.email.trim()))
      e.email = "Digite um e-mail válido, como nome@exemplo.com.";
  }
  if (quer("cidade") && !d.cidade.trim()) e.cidade = "Informe sua cidade.";
  if (quer("estado") && !/^[A-Za-z]{2}$/.test(d.estado.trim()))
    e.estado = "Use a sigla do estado com 2 letras, como SP.";
  if (quer("areas") && d.areas.length === 0) e.areas = "Escolha pelo menos uma área de interesse.";
  if (quer("habilidades") && d.habilidades.length < 2)
    e.habilidades = "Escolha pelo menos duas habilidades.";
  if (quer("jornada") && !d.jornada) e.jornada = "Escolha a jornada que prefere.";
  return e;
}

export interface CadastroEmpresa {
  razao: string;
  cnpj: string;
  responsavel: string;
  email: string;
  ambiente: "urbano" | "rural" | "ambos";
}

export type ErrosEmpresa = Partial<Record<keyof CadastroEmpresa, string>>;

export function validarCnpj(cnpj: string): boolean {
  const n = cnpj.replace(/\D/g, "");
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false;
  const calc = (base: string, pesos: number[]) => {
    const soma = base.split("").reduce((acc, d, i) => acc + Number(d) * (pesos[i] ?? 0), 0);
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = calc(n.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calc(n.slice(0, 12) + d1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return n.endsWith(`${d1}${d2}`);
}

export function validarEmpresa(d: CadastroEmpresa): ErrosEmpresa {
  const e: ErrosEmpresa = {};
  if (d.razao.trim().length < 2) e.razao = "Informe o nome da organização.";
  if (!validarCnpj(d.cnpj)) e.cnpj = "CNPJ inválido. Confira os 14 números.";
  if (d.responsavel.trim().length < 3) e.responsavel = "Informe o nome da pessoa responsável.";
  if (!EMAIL_RE.test(d.email.trim())) e.email = "Digite um e-mail válido.";
  return e;
}
