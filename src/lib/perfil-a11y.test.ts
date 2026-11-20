import { describe, expect, it } from "vitest";
import { preferenciasDoPerfil } from "./perfil-a11y";

describe("preferenciasDoPerfil", () => {
  it("sem recursos não define nada", () => {
    expect(preferenciasDoPerfil([])).toEqual({});
  });

  it("varredura (acionador único) define o modo varredura", () => {
    expect(preferenciasDoPerfil(["Modo varredura (acionador único)"])).toEqual({
      modoControle: "varredura",
    });
  });

  it("controle por teclado ativa os atalhos", () => {
    expect(preferenciasDoPerfil(["Controle por teclado"])).toEqual({ atalhosTeclado: true });
  });

  it("combina recursos e ignora os que não afetam o simulador", () => {
    expect(
      preferenciasDoPerfil([
        "Leitor de tela",
        "Controle por teclado",
        "Modo varredura (acionador único)",
      ]),
    ).toEqual({ modoControle: "varredura", atalhosTeclado: true });
    expect(preferenciasDoPerfil(["Leitor de tela", "Pausas programadas"])).toEqual({});
  });
});
