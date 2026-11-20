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
