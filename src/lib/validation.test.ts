import { describe, expect, it } from "vitest";
import { ETAPAS_CAMPOS, validarCadastro, validarCnpj, type CadastroProfissional } from "./validation";

const base: CadastroProfissional = {
  nome: "Ana Souza",
  email: "ana@exemplo.com",
  cidade: "Recife",
  estado: "PE",
  areas: ["Atendimento"],
  habilidades: ["Comunicação", "Organização"],
  preferenciaAmbiente: "ambos",
  jornada: "6h/dia",
  recursos: [],
  observacoes: "",
};

describe("cadastro", () => {
  it("dados válidos não têm erro", () => {
    expect(validarCadastro(base)).toEqual({});
  });

  it("etapa 1 só valida os campos da etapa 1", () => {
    const e = validarCadastro({ ...base, email: "x", habilidades: [] }, ETAPAS_CAMPOS[0]);
    expect(Object.keys(e)).toEqual(["email"]);
  });

  it("estado precisa de sigla com 2 letras", () => {
    expect(validarCadastro({ ...base, estado: "Pernambuco" }).estado).toBeDefined();
  });

  it("exige ao menos duas habilidades", () => {
    expect(validarCadastro({ ...base, habilidades: ["Comunicação"] }).habilidades).toBeDefined();
  });
});

describe("CNPJ", () => {
  it("aceita CNPJ válido com ou sem máscara", () => {
    expect(validarCnpj("11.222.333/0001-81")).toBe(true);
    expect(validarCnpj("11222333000181")).toBe(true);
  });

  it("recusa dígito errado e números repetidos", () => {
    expect(validarCnpj("11.222.333/0001-82")).toBe(false);
    expect(validarCnpj("11111111111111")).toBe(false);
  });
});
