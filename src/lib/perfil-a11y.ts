import type { PreferenciasA11y } from "./mova-store";

/** Traduz os recursos de acessibilidade do perfil em preferências do simulador (RF-37). */
export function preferenciasDoPerfil(recursos: readonly string[]): Partial<PreferenciasA11y> {
  const prefs: Partial<PreferenciasA11y> = {};
  if (recursos.includes("Modo varredura (acionador único)")) prefs.modoControle = "varredura";
  if (recursos.includes("Controle por teclado")) prefs.atalhosTeclado = true;
  return prefs;
}
