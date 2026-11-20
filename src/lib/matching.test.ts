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
