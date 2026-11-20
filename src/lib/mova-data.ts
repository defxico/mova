// Simulated data for the MOVA prototype. No real robots or companies are connected.

export type Ambiente = "urbano" | "rural";

export type AreaAtuacao =
  | "Atendimento"
  | "Recepção"
  | "Vendas"
  | "Eventos"
  | "Monitoramento agrícola"
  | "Inspeção"
  | "Comunicação de equipes";

export const AREAS: AreaAtuacao[] = [
  "Atendimento",
  "Recepção",
  "Vendas",
  "Eventos",
  "Monitoramento agrícola",
  "Inspeção",
  "Comunicação de equipes",
];

export const HABILIDADES = [
  "Comunicação",
  "Atendimento ao cliente",
  "Libras",
  "Inglês",
  "Espanhol",
  "Vendas",
  "Organização",
  "Observação atenta",
  "Registro de relatórios",
  "Conhecimento agrícola",
  "Informática básica",
  "Resolução de problemas",
] as const;

export type Habilidade = (typeof HABILIDADES)[number];

export const RECURSOS_ACESSIBILIDADE = [
  "Controle por teclado",
  "Modo varredura (acionador único)",
  "Joystick adaptado",
  "Comando de voz",
  "Rastreamento ocular",
  "Leitor de tela",
  "Pausas programadas",
  "Jornada flexível",
] as const;

export type RecursoAcessibilidade = (typeof RECURSOS_ACESSIBILIDADE)[number];

export type Modalidade = "CLT" | "PJ" | "Estágio" | "Temporário";
export type Jornada = "4h/dia" | "6h/dia" | "8h/dia" | "Flexível";

export interface Robo {
  id: string;
  nome: string;
  modelo: string;
  tipo: string;
  ambiente: Ambiente;
  local: string;
  cidade: string;
  status: "disponível" | "em operação" | "manutenção";
  bateria: number;
  movimentacao: string[];
  comunicacao: string[];
  compatibilidade: RecursoAcessibilidade[];
  velocidadeMax: string;
  autonomia: string;
}

export const ROBOS: Robo[] = [
  {
    id: "aurora-01",
    nome: "AURORA-01",
    modelo: "Torre de telepresença T2",
    tipo: "Atendimento e recepção",
    ambiente: "urbano",
    local: "Loja Conceito Vértice — Av. Paulista",
    cidade: "São Paulo, SP",
    status: "disponível",
    bateria: 92,
    movimentacao: ["Base omnidirecional", "Giro 360°", "Inclinação de câmera"],
    comunicacao: ["Tela de vídeo 15\"", "Alto-falante direcional", "Microfone com redução de ruído"],
    compatibilidade: ["Controle por teclado", "Modo varredura (acionador único)", "Joystick adaptado", "Leitor de tela"],
    velocidadeMax: "0,8 m/s",
    autonomia: "9 h",
  },
  {
    id: "lumen-03",
    nome: "LUMEN-03",
    modelo: "Assistente de eventos E1",
    tipo: "Orientação de visitantes",
    ambiente: "urbano",
    local: "Museu do Amanhã — hall principal",
    cidade: "Rio de Janeiro, RJ",
    status: "em operação",
    bateria: 64,
    movimentacao: ["Base diferencial", "Giro 360°"],
    comunicacao: ["Tela de vídeo 21\"", "Projeção de rotas no piso", "Legendas automáticas"],
    compatibilidade: ["Controle por teclado", "Comando de voz", "Rastreamento ocular", "Leitor de tela"],
    velocidadeMax: "0,6 m/s",
    autonomia: "7 h",
  },
  {
    id: "orion-07",
    nome: "ORION-07",
    modelo: "Recepcionista corporativo R3",
    tipo: "Recepção corporativa",
    ambiente: "urbano",
    local: "Centro Administrativo Municipal",
    cidade: "Recife, PE",
    status: "disponível",
    bateria: 81,
    movimentacao: ["Base omnidirecional", "Ajuste de altura"],
    comunicacao: ["Tela de vídeo 15\"", "Impressora de crachás", "Leitor de QR code"],
    compatibilidade: ["Controle por teclado", "Joystick adaptado", "Pausas programadas"],
    velocidadeMax: "0,7 m/s",
    autonomia: "10 h",
  },
  {
    id: "terra-02",
    nome: "TERRA-02",
    modelo: "Rover agrícola de inspeção A4",
    tipo: "Monitoramento de estufas",
    ambiente: "rural",
    local: "Cooperativa Verde Vale — estufa 3",
    cidade: "Holambra, SP",
    status: "disponível",
    bateria: 77,
    movimentacao: ["Tração 4x4 leve", "Câmera em braço telescópico", "Velocidade reduzida"],
    comunicacao: ["Rádio para equipe de campo", "Alertas sonoros", "Envio de fotos ao supervisor"],
    compatibilidade: ["Controle por teclado", "Modo varredura (acionador único)", "Comando de voz", "Jornada flexível"],
    velocidadeMax: "0,5 m/s",
    autonomia: "12 h",
  },
  {
    id: "campo-05",
    nome: "CAMPO-05",
    modelo: "Inspetor de equipamentos I2",
    tipo: "Inspeção visual de maquinário",
    ambiente: "rural",
    local: "Fazenda Boa Esperança — galpão de máquinas",
    cidade: "Sinop, MT",
    status: "manutenção",
    bateria: 35,
    movimentacao: ["Tração por esteiras", "Câmera térmica"],
    comunicacao: ["Intercomunicador", "Relatório fotográfico"],
    compatibilidade: ["Controle por teclado", "Joystick adaptado", "Rastreamento ocular"],
    velocidadeMax: "0,4 m/s",
    autonomia: "8 h",
  },
];

export interface Vaga {
  id: string;
  titulo: string;
  empresa: string;
  area: AreaAtuacao;
  ambiente: Ambiente;
  roboId: string;
  localRobo: string;
  descricaoAmbiente: string;
  atividades: string[];
  habilidades: Habilidade[];
  requisitosTecnicos: string[];
  modalidade: Modalidade;
  jornada: Jornada;
  remuneracao: string;
  publicadaHa: string;
}

export const VAGAS: Vaga[] = [
  {
    id: "v-recepcao-vertice",
    titulo: "Recepcionista via telepresença",
    empresa: "Vértice Design Store",
    area: "Recepção",
    ambiente: "urbano",
    roboId: "aurora-01",
    localRobo: "São Paulo, SP — Av. Paulista",
    descricaoAmbiente: "Loja conceito com piso plano, rampas e corredores largos. Fluxo médio de 120 visitantes por dia.",
    atividades: ["Receber e cumprimentar clientes", "Apresentar coleções em destaque", "Encaminhar clientes para consultores"],
    habilidades: ["Comunicação", "Atendimento ao cliente", "Organização"],
    requisitosTecnicos: ["Internet de 10 Mbps", "Computador ou tablet com câmera", "Fone com microfone"],
    modalidade: "CLT",
    jornada: "6h/dia",
    remuneracao: "R$ 2.400 + benefícios",
    publicadaHa: "há 2 dias",
  },
  {
    id: "v-museu-guia",
    titulo: "Orientador(a) de visitantes",
    empresa: "Museu do Amanhã",
    area: "Eventos",
    ambiente: "urbano",
    roboId: "lumen-03",
    localRobo: "Rio de Janeiro, RJ — hall principal",
    descricaoAmbiente: "Hall amplo e acessível, com sinalização tátil e iluminação controlada.",
    atividades: ["Orientar visitantes sobre exposições", "Indicar rotas acessíveis", "Atender grupos escolares"],
    habilidades: ["Comunicação", "Inglês", "Libras"],
    requisitosTecnicos: ["Internet de 15 Mbps", "Computador com câmera"],
    modalidade: "PJ",
    jornada: "4h/dia",
    remuneracao: "R$ 2.100 / mês",
    publicadaHa: "há 5 dias",
  },
  {
    id: "v-prefeitura-recepcao",
    titulo: "Atendente de recepção pública",
    empresa: "Prefeitura do Recife",
    area: "Atendimento",
    ambiente: "urbano",
    roboId: "orion-07",
    localRobo: "Recife, PE — Centro Administrativo",
    descricaoAmbiente: "Recepção com balcão rebaixado e fila organizada por senhas.",
    atividades: ["Triagem de atendimentos", "Emissão de crachás de visitante", "Informações sobre serviços municipais"],
    habilidades: ["Atendimento ao cliente", "Informática básica", "Organização"],
    requisitosTecnicos: ["Internet de 10 Mbps", "Computador com câmera"],
    modalidade: "Temporário",
    jornada: "6h/dia",
    remuneracao: "R$ 2.250 / mês",
    publicadaHa: "hoje",
  },
  {
    id: "v-vendas-vertice",
    titulo: "Consultor(a) de produtos",
    empresa: "Vértice Design Store",
    area: "Vendas",
    ambiente: "urbano",
    roboId: "aurora-01",
    localRobo: "São Paulo, SP — Av. Paulista",
    descricaoAmbiente: "Área de exposição com produtos identificados por QR code.",
    atividades: ["Apresentar características de produtos", "Tirar dúvidas de clientes", "Registrar interesse de compra"],
    habilidades: ["Vendas", "Comunicação", "Resolução de problemas"],
    requisitosTecnicos: ["Internet de 10 Mbps", "Fone com microfone"],
    modalidade: "CLT",
    jornada: "8h/dia",
    remuneracao: "R$ 2.600 + comissão",
    publicadaHa: "há 1 semana",
  },
  {
    id: "v-estufa-monitor",
    titulo: "Monitor(a) remoto de estufas",
    empresa: "Cooperativa Verde Vale",
    area: "Monitoramento agrícola",
    ambiente: "rural",
    roboId: "terra-02",
    localRobo: "Holambra, SP — estufa 3",
    descricaoAmbiente: "Estufa de hortaliças com corredores de terra compactada e sensores de umidade.",
    atividades: ["Rondas visuais nas fileiras de cultivo", "Registrar sinais de pragas ou falta de água", "Avisar a equipe de campo por rádio"],
    habilidades: ["Observação atenta", "Registro de relatórios", "Conhecimento agrícola"],
    requisitosTecnicos: ["Internet de 5 Mbps (modo leve disponível)", "Computador ou tablet"],
    modalidade: "CLT",
    jornada: "Flexível",
    remuneracao: "R$ 2.300 + benefícios",
    publicadaHa: "há 3 dias",
  },
  {
    id: "v-fazenda-inspecao",
    titulo: "Inspetor(a) visual de equipamentos",
    empresa: "Fazenda Boa Esperança",
    area: "Inspeção",
    ambiente: "rural",
    roboId: "campo-05",
    localRobo: "Sinop, MT — galpão de máquinas",
    descricaoAmbiente: "Galpão coberto com piso de concreto. O robô não opera máquinas, apenas observa.",
    atividades: ["Inspeção visual de tratores parados", "Fotografar desgastes", "Enviar relatório ao técnico responsável"],
    habilidades: ["Observação atenta", "Registro de relatórios", "Informática básica"],
    requisitosTecnicos: ["Internet de 5 Mbps", "Computador com tela de 13\" ou mais"],
    modalidade: "PJ",
    jornada: "4h/dia",
    remuneracao: "R$ 1.900 / mês",
    publicadaHa: "há 4 dias",
  },
  {
    id: "v-coop-comunicacao",
    titulo: "Ponte de comunicação com equipes de campo",
    empresa: "Cooperativa Verde Vale",
    area: "Comunicação de equipes",
    ambiente: "rural",
    roboId: "terra-02",
    localRobo: "Holambra, SP — sede e estufas",
    descricaoAmbiente: "Área de cooperativa com sede administrativa e quatro estufas interligadas.",
    atividades: ["Repassar orientações do agrônomo", "Confirmar tarefas concluídas", "Registrar ocorrências do dia"],
    habilidades: ["Comunicação", "Espanhol", "Organização"],
    requisitosTecnicos: ["Internet de 5 Mbps", "Fone com microfone"],
    modalidade: "Estágio",
    jornada: "4h/dia",
    remuneracao: "Bolsa R$ 1.400",
    publicadaHa: "há 6 dias",
  },
];

export interface Operacao {
  id: string;
  data: string; // ISO date
  roboId: string;
  local: string;
  duracaoMin: number;
  acoes: number;
  resumo: string;
}

// Seed history for the demo dashboard.
export const OPERACOES_DEMO: Operacao[] = [
  { id: "op-101", data: "2026-11-16T13:00:00Z", roboId: "aurora-01", local: "Vértice Design Store", duracaoMin: 360, acoes: 84, resumo: "Recepção de 62 clientes, 3 encaminhamentos a consultores." },
  { id: "op-100", data: "2026-11-14T13:00:00Z", roboId: "aurora-01", local: "Vértice Design Store", duracaoMin: 330, acoes: 71, resumo: "Apresentação da nova coleção a 40 visitantes." },
  { id: "op-099", data: "2026-11-12T11:00:00Z", roboId: "terra-02", local: "Cooperativa Verde Vale", duracaoMin: 180, acoes: 26, resumo: "Ronda na estufa 3, 2 alertas de irrigação enviados." },
  { id: "op-098", data: "2026-11-10T13:00:00Z", roboId: "aurora-01", local: "Vértice Design Store", duracaoMin: 345, acoes: 77, resumo: "Recepção e orientação em dia de evento." },
];

export const HORAS_SEMANA = [
  { dia: "Seg", horas: 6 },
  { dia: "Ter", horas: 5.5 },
  { dia: "Qua", horas: 3 },
  { dia: "Qui", horas: 6 },
  { dia: "Sex", horas: 5 },
  { dia: "Sáb", horas: 0 },
  { dia: "Dom", horas: 0 },
];

export function getRobo(id: string | undefined): Robo | undefined {
  return ROBOS.find((r) => r.id === id);
}

export function getVaga(id: string): Vaga | undefined {
  return VAGAS.find((v) => v.id === id);
}
