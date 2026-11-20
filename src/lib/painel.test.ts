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
