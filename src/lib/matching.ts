import type { Ambiente, AreaAtuacao, Habilidade, Jornada, Vaga } from "./mova-data";

export interface FiltrosVagas {
  busca: string;
  ambiente: Ambiente | "todos";
  area: AreaAtuacao | "todas";
  jornada: Jornada | "todas";
}

export const FILTROS_PADRAO: FiltrosVagas = {
  busca: "",
  ambiente: "todos",
  area: "todas",
  jornada: "todas",
};

const normalizar = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function filtrarVagas(vagas: Vaga[], f: FiltrosVagas): Vaga[] {
  const termo = normalizar(f.busca.trim());
  return vagas.filter((v) => {
    if (f.ambiente !== "todos" && v.ambiente !== f.ambiente) return false;
    if (f.area !== "todas" && v.area !== f.area) return false;
    if (f.jornada !== "todas" && v.jornada !== f.jornada) return false;
    if (termo) {
      const alvo = normalizar(
        [v.titulo, v.empresa, v.area, v.localRobo, ...v.atividades, ...v.habilidades].join(" "),
      );
      if (!alvo.includes(termo)) return false;
    }
    return true;
  });
}

/**
 * Compatibility (0–100) between a professional and a job.
 * 70% weight: share of required skills the person has.
 * 30% weight: the job's area is one of the person's areas of interest.
 */
export function compatibilidade(
  vaga: Vaga,
  perfil: { habilidades: Habilidade[]; areas: AreaAtuacao[] } | null,
): number {
  if (!perfil) return 0;
  const exigidas = vaga.habilidades;
  const atendidas = exigidas.filter((h) => perfil.habilidades.includes(h)).length;
  const scoreHab = exigidas.length ? atendidas / exigidas.length : 1;
  const scoreArea = perfil.areas.includes(vaga.area) ? 1 : 0;
  return Math.round((scoreHab * 0.7 + scoreArea * 0.3) * 100);
}

export function rotuloCompatibilidade(score: number): "alta" | "média" | "baixa" {
  if (score >= 70) return "alta";
  if (score >= 40) return "média";
  return "baixa";
}
