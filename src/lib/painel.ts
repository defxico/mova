import type { Operacao } from "./mova-data";

export function resumoJornadas(ops: Operacao[]) {
  const minutos = ops.reduce((t, o) => t + o.duracaoMin, 0);
  return {
    sessoes: ops.length,
    horas: Math.round((minutos / 60) * 10) / 10,
    acoes: ops.reduce((t, o) => t + o.acoes, 0),
  };
}
