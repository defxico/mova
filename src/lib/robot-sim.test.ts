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
