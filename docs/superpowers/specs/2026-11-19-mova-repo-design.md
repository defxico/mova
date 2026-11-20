# MOVA — design do repositório e da entrega

Data: 2026-11-19
Fonte do produto: `MOVA-Especificacao-do-Produto.docx` (v1.0), a ser convertido em `docs/especificacao.md`.
Fonte do design e do código: projeto Lovable "Neon Mova Command" (workspace da Amanda Ueno, somente leitura, sem créditos).

## Contexto

O protótipo foi gerado no Lovable em TanStack Start + React + TypeScript + Tailwind + shadcn/ui.
Estado no Lovable: build quebrado, porque o menu, o rodapé, a home, o cadastro e a central de controle linkam `/painel` e `/impacto`, que não existem. Também há erro de tipos de rota. Não há testes, README nem histórico salvo.

Já pronto no Lovable: home, cadastro em 3 etapas (com aba empresa e validação de CNPJ), oportunidades (filtros, compatibilidade, vagas salvas, candidatura simulada), central de robôs, central de controle (simulador, Esc para parada de emergência, toque/segurar/varredura), menu de acessibilidade (tamanho do texto, alto contraste, fonte legível, menos animação, botões maiores) e 3 imagens geradas.

## Decisões

| Tema | Decisão |
|---|---|
| Stack | Manter a do Lovable (TanStack Start, React, TS, Tailwind, shadcn/ui) |
| Extração | Ler os arquivos pelo editor/API do Lovable no navegador e recriar localmente; imagens baixadas uma a uma. Nada é alterado na conta da Amanda |
| Importação | Abordagem B: importar já limpo. Primeiro commit sem componentes shadcn não usados, sem arquivos de config específicos do Lovable que não servem fora dele |
| Repositório | `C:\dev\MOVA`, remote `https://github.com/defxico/mova`, branch `main`. Identidade git local ao repo (conta defxico, e-mail noreply). Config global e conta ativa do `gh` não mudam |
| Deploy | Vercel ligado ao repo, com deploy a cada push em `main`. A conta Vercel é criada/ligada pelo usuário; o repo traz a config pronta |
| Testes | Vitest, só lógica pura |
| Integrantes | Seção no README, nomes informados depois pelo usuário |

## Escopo desta entrega

1. Importar o código limpo e fazer o build passar.
2. Criar `/painel` (RF-33): perfil, candidaturas, jornadas registradas e horas totais, lendo o que cadastro, oportunidades e simulador já gravam no `localStorage`.
3. Criar `/impacto` (RF-34): problema em números (IBGE PNAD 2022), ODS 8, 9 e 10, perfil de quem o MOVA atende, jornada do usuário e o aviso de que o MOVA não substitui ambientes acessíveis.
4. Extrair para `src/lib/` a lógica que hoje estiver dentro de componentes (compatibilidade, validação do cadastro, filtros, regra de robô em manutenção, parada de emergência) e testar com Vitest.
5. Deploy na Vercel.
6. Documentação: `README.md` e `docs/especificacao.md`.

Fora do escopo: roteiro do vídeo-pitch, fluxo da empresa (publicar vaga, vincular robô), login e dados em servidor, robôs reais.

## Estrutura

```
src/
  routes/        rotas por arquivo: index, cadastro, oportunidades, robos, controle, painel, impacto
  components/
    mova/        componentes do produto (Hud, cards, stepper, controles)
    ui/          shadcn/ui, só os usados
  lib/           mova-data.ts (dados fictícios), lógica pura e seus testes
  assets/        hero-robot.jpg, cam-urban.jpg, cam-rural.jpg
docs/
  especificacao.md
  superpowers/specs/
README.md
```

Cada função em `src/lib/` recebe dados e devolve dados, sem React nem `localStorage`, para ser testada sozinha. Os componentes cuidam de estado e persistência.

## Testes (critérios de aceite do spec, §12)

- Sem perfil, ordenar por compatibilidade sinaliza que a dica "Criar perfil" deve aparecer.
- Robô em manutenção não pode ser aberto no simulador.
- Com o simulador conectado, a parada de emergência zera a velocidade e gera um evento no log.
- Voltar da etapa 2 para a 1 do cadastro mantém os dados (estado do formulário preservado entre etapas).
- Filtro "rural" devolve só vagas e robôs rurais, e o total bate com a lista.
- Compatibilidade: perfil que cobre todas as habilidades e tecnologias assistivas pontua mais que um que cobre parte.

Verificação manual no navegador: fluxo principal do §11 (home, cadastro, oportunidades, candidatura, simulador, painel), navegação só por teclado, e layout em celular, tablet e desktop.

## README (critérios de avaliação)

Seções: problema e números com fonte; quem é beneficiado e a jornada; funcionalidades por tela; como o JavaScript melhora a experiência (filtros ao vivo, compatibilidade, simulador, menu de acessibilidade); acessibilidade e responsividade aplicadas; stack e organização do código; como rodar e testar; link do deploy; prints; integrantes; aviso de que os dados são fictícios.

## Riscos

- A extração pelo navegador pode falhar em algum arquivo. Nesse caso, uso o botão Download daquele arquivo.
- O preset da Vercel para TanStack Start pode pedir ajuste no `vite.config`. Se não funcionar, a alternativa é gerar build SPA estático.
