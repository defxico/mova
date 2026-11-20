# MOVA — Especificação do produto

ESPECIFICAÇÃO DO PRODUTO

MOVA

Sua presença não tem fronteira.

| Projeto                                            | Versão | Status             | Origem                                                                                    |
| -------------------------------------------------- | ------ | ------------------ | ----------------------------------------------------------------------------------------- |
| MOVA, protótipo CitizenTech (Global Solution 2026) | 1.0    | Protótipo entregue | Protótipo iniciado no Lovable e finalizado no repositório https://github.com/defxico/mova |

## 1. Visão geral

O MOVA é uma plataforma web que liga pessoas com deficiência ou mobilidade reduzida a vagas de trabalho feitas por robôs de telepresença. A pessoa fica em casa e controla, à distância, um robô que está em uma loja, um museu, uma prefeitura, uma estufa ou uma fazenda.

O nome vem de Mobilidade, Oportunidade, Voz e Autonomia. A ideia é levar a presença profissional até onde a vaga está, sem depender de transporte nem da acessibilidade física do local.

O projeto se inspira no Dawn Avatar Robot Café, em Tóquio, onde pessoas que não conseguem sair de casa trabalham controlando robôs.

Nesta versão, robôs, empresas e vagas são simulados. Nenhum robô real é conectado.

## 2. Problema

Falta de rampa, transporte inacessível e a distância dos grandes centros deixam muita gente fora do mercado de trabalho. Os números usados no produto:

| Indicador                                           | Valor                                            | Fonte                             |
| --------------------------------------------------- | ------------------------------------------------ | --------------------------------- |
| Pessoas com deficiência no Brasil                   | 18,6 milhões                                     | IBGE, PNAD Contínua 2022          |
| Participação na força de trabalho                   | 29,2% (contra 66,4% das pessoas sem deficiência) | IBGE, PNAD Contínua 2022          |
| Vivem longe de vagas que exigem deslocamento diário | 2 em 3                                           | Estimativa ilustrativa do projeto |

## 3. Objetivos e métricas

- Ajudar o profissional a achar vagas que combinem com suas habilidades e com os recursos de acessibilidade que ele usa.

- Deixar que ele treine e opere o robô do jeito que preferir.

- Oferecer às empresas mais uma forma de contratar, com operação monitorada e segura.

Para acompanhar o produto:

- Perfis criados e quantos terminam o cadastro (a meta é cerca de 3 minutos)

- Candidaturas por vaga e compatibilidade média

- Sessões no simulador por profissional

- Latência média da conexão (hoje o site mostra 48 ms)

- Empresas, vagas e robôs ativos (hoje: 4 robôs e 7 vagas abertas)

- Horas de jornada registradas no painel

## 4. Quem usa

| Perfil                                              | O que quer                                                       | O que precisa                                                                                                                                                         |
| --------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Profissional com deficiência ou mobilidade reduzida | Escolher a vaga, o ambiente e a jornada                          | Controle adaptado (teclado, toque, pressionar e segurar, varredura, voz, rastreamento ocular, joystick, leitor de tela) e pausas programadas                          |
| Empresa ou organização parceira                     | Contratar além do raio de deslocamento e ter times mais diversos | Robôs prontos para operar, status de conexão, histórico de operações e parada de emergência. O MOVA é uma opção a mais, nunca um substituto para ambientes acessíveis |

## 5. Escopo

| Entra no protótipo                             | Fica de fora                                  |
| ---------------------------------------------- | --------------------------------------------- |
| Site institucional com benefícios e aplicações | Conexão com robôs reais                       |
| Cadastro de profissional e de empresa          | Tarefas perigosas ou que exijam força física  |
| Vitrine de vagas com filtros                   | Contratação, pagamento e contratos de verdade |
| Catálogo de robôs com ficha técnica            |                                               |
| Simulador de controle remoto                   |                                               |
| Painel profissional e página de impacto e ODS  |                                               |
| Menu de acessibilidade                         |                                               |

Todos os dados são fictícios, e as tarefas respeitam o que os robôs realmente conseguem fazer.

## 6. Mapa do site

| Rota           | Tela                | Para que serve                                                          |
| -------------- | ------------------- | ----------------------------------------------------------------------- |
| /              | Home                | Apresenta o produto, os números, como funciona, benefícios e aplicações |
| /cadastro      | Cadastro            | Perfil de profissional ou de empresa (?perfil=empresa)                  |
| /oportunidades | Oportunidades       | Lista de vagas com filtros                                              |
| /robos         | Central de robôs    | Catálogo da frota                                                       |
| /controle      | Central de controle | Simulador (?robo=aurora-01)                                             |
| /painel        | Meu painel          | Jornadas e candidaturas do profissional                                 |
| /impacto       | Impacto             | Impacto social e ODS                                                    |

O cabeçalho tem os links das telas, o botão Acessibilidade e o botão Cadastrar. No topo há um link para pular direto ao conteúdo, e o rodapé repete os links da plataforma e do projeto.

## 7. Requisitos funcionais

### 7.1 Home

- RF-01 O hero traz título, descrição, imagem do robô e três chamadas: criar perfil, testar a central de controle e oferecer uma vaga (empresas).

- RF-02 Quatro indicadores: robôs ativos, vagas abertas, ambientes (cidade e campo) e latência média.

- RF-03 Seção sobre o problema, com três números e a fonte de cada um.

- RF-04 Passo a passo em quatro etapas: criar o perfil, encontrar a vaga, treinar no simulador e trabalhar pelo robô.

- RF-05 Benefícios separados para profissionais (botão Quero trabalhar) e para empresas (botão Cadastrar empresa).

- RF-06 Exemplos de uso na cidade e no campo, com o aviso de que não há tarefas perigosas nem de força física.

- RF-07 Trecho sobre a inspiração em Tóquio e uma citação institucional.

### 7.2 Cadastro

- RF-08 O usuário escolhe entre “Sou profissional” e “Sou empresa ou organização”.

- RF-09 O cadastro tem 3 etapas, com indicador de progresso: seus dados, perfil profissional, preferências e acessibilidade.

- RF-10 A etapa 1 pede nome completo, e-mail (usado para avisar sobre candidaturas), cidade e estado.

- RF-11 Há botões Voltar e Continuar, e um Preencher exemplo para demonstração. Dá para voltar e mudar qualquer resposta depois.

- RF-12 As etapas 2 e 3 coletam habilidades, preferências de trabalho e os recursos de acessibilidade que a pessoa usa.

- RF-13 O perfil alimenta a compatibilidade mostrada em cada vaga.

### 7.3 Oportunidades

- RF-14 A lista mostra quantas vagas foram encontradas (ex.: “7 vagas encontradas”).

- RF-15 Filtros por texto, ambiente (todos, urbano, rural), área de atuação e jornada (4h, 6h, 8h ou flexível).

- RF-16 Ordenação por mais recentes ou por maior compatibilidade. Quem ainda não tem perfil vê uma dica com o botão Criar perfil.

- RF-17 Cada vaga mostra ambiente, área, título, empresa, local, robô e função, contrato, jornada, remuneração e habilidades pedidas.

- RF-18 Cada vaga tem o botão Ver detalhes e candidatar-se.

Vagas usadas no protótipo:

| Vaga                                      | Empresa                     | Robô      | Contrato e jornada |
| ----------------------------------------- | --------------------------- | --------- | ------------------ |
| Recepcionista via telepresença            | Vértice Design Store (SP)   | AURORA-01 | CLT, 6h            |
| Orientador(a) de visitantes               | Museu do Amanhã (RJ)        | LUMEN-03  | PJ, 4h             |
| Atendente de recepção pública             | Prefeitura do Recife (PE)   | ORION-07  | Temporário, 6h     |
| Consultor(a) de produtos                  | Vértice Design Store (SP)   | AURORA-01 | CLT, 8h            |
| Monitor(a) remoto de estufas              | Cooperativa Verde Vale (SP) | TERRA-02  | CLT, flexível      |
| Inspetor(a) visual de equipamentos        | Fazenda Boa Esperança (MT)  | CAMPO-05  | PJ, 4h             |
| Ponte de comunicação com equipes de campo | Cooperativa Verde Vale (SP) | TERRA-02  | Estágio, 4h        |

### 7.4 Central de robôs

- RF-19 Resumo da frota: 3 disponíveis, 1 em operação e 1 em manutenção.

- RF-20 Filtro por ambiente (todos, urbano, rural).

- RF-21 A ficha traz código, modelo, função, local, status, bateria, velocidade, autonomia, movimentação, comunicação e tecnologias assistivas compatíveis.

- RF-22 Robôs disponíveis ou em operação têm o botão Abrir no simulador. O que está em manutenção só mostra o status.

Frota usada no protótipo:

| Código    | Modelo                       | Ambiente    | Status      | Tecnologias assistivas                            |
| --------- | ---------------------------- | ----------- | ----------- | ------------------------------------------------- |
| AURORA-01 | Torre de telepresença T2     | Urbano (SP) | Disponível  | Teclado, varredura, joystick, leitor de tela      |
| LUMEN-03  | Assistente de eventos E1     | Urbano (RJ) | Em operação | Teclado, voz, rastreamento ocular, leitor de tela |
| ORION-07  | Recepcionista corporativo R3 | Urbano (PE) | Disponível  | Teclado, joystick, pausas programadas             |
| TERRA-02  | Rover agrícola A4            | Rural (SP)  | Disponível  | Teclado, varredura, voz, jornada flexível         |
| CAMPO-05  | Inspetor de equipamentos I2  | Rural (MT)  | Manutenção  | Teclado, joystick, rastreamento ocular            |

### 7.5 Central de controle (simulador)

- RF-23 O usuário escolhe o robô em uma lista. O link ?robo= já abre com ele selecionado, e o CAMPO-05 aparece marcado como em manutenção.

- RF-24 A tela avisa que é uma simulação e que nenhum robô real está conectado.

- RF-25 O botão Conectar ao robô inicia a sessão. Antes dele, o status é “desconectado”, a latência aparece como “— ms” e o vídeo mostra “SEM SINAL DE VÍDEO”. Depois, aparecem a câmera, a latência e o cronômetro da sessão.

- RF-26 A parada de emergência fica sempre visível e responde à tecla Esc.

- RF-27 A movimentação funciona por toque, setas ou W A S D. A tela mostra o rumo em graus e tem controle de câmera e três níveis de velocidade.

- RF-28 Para falar com as pessoas no local há microfone, foto, frases rápidas e um campo de mensagem que o robô exibe e fala.

- RF-29 O registro de comunicação lista cada evento com horário, origem e mensagem.

- RF-30 O status operacional mostra modo, tipo de atividade, posição (x, y em metros), rumo, velocidade, número de movimentos e bateria.

- RF-31 O mapa da área mostra o limite seguro (linha tracejada) e os pontos de interesse, como vitrine, recepção e entrada.

- RF-32 Ao trocar de robô, mudam a imagem, o mapa, as frases rápidas, o tipo de atividade e a bateria.

### 7.6 Meu painel e Impacto

- RF-33 O painel reúne as jornadas já feitas pelo profissional, as candidaturas e os dados do perfil.

- RF-34 A página de impacto explica o efeito social do projeto e os Objetivos de Desenvolvimento Sustentável (ODS) que ele atende.

### 7.7 Acessibilidade

- RF-35 O botão Acessibilidade fica no topo de todas as páginas.

- RF-36 O usuário escolhe como controla o robô: toque único, pressionar e segurar, varredura com acionador único ou teclado.

- RF-37 A preferência de acessibilidade do perfil vale no simulador e entra no cálculo de compatibilidade com vagas e robôs.

## 8. Requisitos não funcionais

| Área           | Requisito                                                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Acessibilidade | Seguir a WCAG 2.2 AA: uso completo pelo teclado, link para pular ao conteúdo, texto alternativo nas imagens, boa leitura em leitores de tela e áreas de toque grandes o bastante |
| Segurança      | Parada de emergência sempre à mão, velocidade limitada, área segura marcada e robôs em manutenção bloqueados                                                                     |
| Desempenho     | Latência perto de 48 ms e resposta imediata aos comandos                                                                                                                         |
| Telas          | Funcionar em desktop, tablet e celular, com controles por toque                                                                                                                  |
| Privacidade    | Dados de acessibilidade são sensíveis (LGPD): pedir consentimento claro e coletar só o necessário                                                                                |
| Conexão        | Mostrar o estado (desconectado, conectando, conectado, falha) também em texto, não só por cor ou ícone                                                                           |
| Idioma         | Português do Brasil                                                                                                                                                              |

## 9. Design e interface

- Estilo: tema escuro com toques de neon e visual futurista. A cor de tema é #090B12. Os rótulos imitam um console (// o problema, COM.LOG, SYS.01, NAV.MAP, DRV.CTL, VOX.IO).

- Imagens: um robô em rua futurista e duas visões de câmera, uma urbana e uma rural.

- Componentes: cabeçalho, cards de vaga e de robô, filtros, stepper do cadastro, direcionais de controle, registro de comunicação, mapa da área e indicadores de status.

- Tokens: cores, tipografia, espaçamento, raios e estados ainda precisam ser documentados a partir do Figma ou do código.

## 10. Dados

| Entidade           | Campos principais                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Profissional       | nome, e-mail, cidade, estado, habilidades, preferências, recursos de acessibilidade, modo de controle                    |
| Empresa            | nome, contato, local, vagas, robôs vinculados                                                                            |
| Vaga               | título, área, ambiente, empresa, local, robô, contrato, jornada, remuneração, habilidades                                |
| Robô               | código, modelo, função, local, status, bateria, velocidade, autonomia, movimentação, comunicação, tecnologias assistivas |
| Candidatura        | profissional, vaga, status, compatibilidade                                                                              |
| Sessão de operação | profissional, robô, início, duração, latência, movimentos, registro de comunicação                                       |

A compatibilidade cruza as habilidades do perfil com as da vaga e os recursos de acessibilidade da pessoa com os do robô.

## 11. Fluxo principal

- A pessoa entra na home e escolhe Criar meu perfil.

- Faz o cadastro em 3 etapas.

- Vai em Oportunidades, filtra e ordena por compatibilidade.

- Abre uma vaga e se candidata.

- Treina no simulador com o robô da vaga e o modo de controle que prefere.

- Trabalha pelo robô, e a jornada fica registrada no painel.

A empresa segue um caminho parecido: cadastra a organização, publica vagas, vincula robôs e acompanha a operação.

## 12. Critérios de aceite

- Sem perfil criado, ao ordenar por compatibilidade, o usuário vê a dica para criar um.

- Na ficha de um robô em manutenção, não existe o botão de abrir no simulador.

- Com o simulador conectado, apertar Esc para o robô na hora e registra o evento no log.

- No cadastro, voltar da etapa 2 para a 1 mantém os dados já preenchidos.

- Com o filtro “rural”, só aparecem vagas e robôs rurais, e o contador se atualiza.

## 13. Pontos em aberto

- Detalhar as etapas 2 e 3 do cadastro e a tela de detalhes da vaga, com o fluxo de candidatura.

- Decidir como a compatibilidade é calculada e onde os dados ficam guardados, já que hoje tudo é simulado.

- Desenhar o fluxo da empresa: publicar vaga e vincular robô.

- Cuidar da comunicação para o produto não parecer substituto de ambientes acessíveis.

- Testar os modos de controle e a linguagem com pessoas com deficiência.

Resolvido nesta entrega:

- As páginas Meu painel (`/painel`) e Impacto (`/impacto`) foram criadas.
- A compatibilidade é calculada em `src/lib/matching.ts`: 70% habilidades e 30% área de atuação.
- Os dados (perfil, candidaturas, jornadas e preferências) são salvos no navegador, em `localStorage`.
- RF-37 coberto: ao salvar o perfil, os recursos de acessibilidade escolhidos são aplicados ao modo de controle do simulador (varredura e atalhos de teclado), em `src/lib/perfil-a11y.ts`. A pontuação de compatibilidade por recursos de acessibilidade e por robô fica para a fase 2.

## 14. Próximas fases

| Fase      | Entrega                                                         |
| --------- | --------------------------------------------------------------- |
| 1 (atual) | Protótipo navegável com dados simulados                         |
| 2         | Login, dados salvos, candidatura e painel completo              |
| 3         | Painel da empresa e gestão de vagas e robôs                     |
| 4         | Integração com robôs reais e métricas de operação em tempo real |
