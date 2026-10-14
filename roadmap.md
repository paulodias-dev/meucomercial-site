# Roadmap de Desenvolvimento — Plataforma SaaS Mídia Indoor

> **Projeto:** Site institucional / aquisição de leads · **Repositório:** `paulodias-dev/meucomercial-site`  
> **Atualização de referência:** 14/10/2026 · **Branch de produção:** `main` · **Estado:** desenvolvimento/homologação em andamento

**Visão do produto.** Plataforma SaaS de TV e Rádio Indoor para agências e clientes: gestão de displays e players, campanhas, mídia, playlists e grade horária, contratação recorrente, pagamento e restrições de acesso por plano. Conecta API Laravel/MySQL, painel React/Metronic e site comercial. A aplicação executada nas TVs/radios é um componente próprio que ainda precisa ser inventariado e homologado.

**Responsabilidade deste repositório:** Landing page, comunicação do produto, SEO, precificação e conversão comercial.

## Painel geral da plataforma (evidência de código, não homologação)

| Repositório | Marcos com evidência | Total monitorado | Cobertura verificada |
|---|---:|---:|---:|
| [meucomercial-api](https://github.com/paulodias-dev/meucomercial-api/blob/main/roadmap.md) | 17 | 34 | 50,0% |
| [meucomercial-admin](https://github.com/paulodias-dev/meucomercial-admin/blob/main/roadmap.md) | 16 | 31 | 51,6% |
| [meucomercial-site](https://github.com/paulodias-dev/meucomercial-site/blob/main/roadmap.md) | 8 | 28 | 28,6% |
| **Plataforma completa** | **41** | **93** | **44,1%** |

**Cálculo:** marcos `[x]` com evidência de implementação na `main` ou em PR definitivo referenciado ÷ total de marcos deste roadmap × 100. **Inclui PRs abertos, ainda não disponíveis em produção.** Cada marco tem peso igual. **Não é percentual de homologação ou de prontidão para produção.** Marcos `[ ]` abrangem trabalho ainda não encontrado, implementação parcial ou aceite ainda não comprovado. Alterar um marco de `[ ]` para `[x]` somente após apontar PR/commit e evidência verificável.

**Escopo:** este roadmap acompanha a **plataforma inteira** (API, painel, site e Player/TV externo ainda sem repositório específico identificado). O roadmap histórico de remoção/modernização continua em `docs/roadmap-simplificacao-agencia-indoor.md`, mas seus **87,5% não são reutilizados** para medir o SaaS inteiro.

**Legenda:** `[x]` = há artefato de implementação identificado; `[ ]` = aceite pendente ou funcionalidade ausente. Um `[x]` não significa testes verdes ou implantação comprovada.

## Progresso deste repositório

**8/28 marcos com evidência de código = 28,6% de cobertura de implementação identificada.** Pendências de CI, staging, homologação e deploy permanecem abertas independentemente deste índice.

## Fase 1: Descoberta e Estruturação (Auditoria)

**Objetivo:** Inventariar os repositórios, documentar arquitetura/DER, definir padrões para IA e remover legados com rastreabilidade.  
**Situação neste repositório:** Parcial · 2/4 marcos identificados.

- [x] Arquitetura inicial e orientações de execução documentadas no `README.md`.
- [x] Código atual usa React, TypeScript, Vite e servidor Express (ver `package.json` e `server.ts`).
- [ ] Criar `AGENTS.md` para componentes, SEO, acessibilidade, responsividade, conteúdo e integrações sem dados fictícios.
- [ ] Auditar performance/SEO e a concentração de lógica em `src/App.tsx`; definir mapa de componentes e journeys de conversão.

## Fase 2: Infraestrutura e Back-end Core (API Laravel)

**Objetivo:** Garantir autenticação, dados MySQL, mídias Cloud, filas e interfaces de integração com segurança.  
**Situação neste repositório:** Parcial · 1/4 marcos identificados.

- [x] Servidor Express oferece endpoint `/api/consult` para consultoria comercial por segmento.
- [ ] Persistir leads de demonstração em endpoint comercial da API Laravel/CRM com validação, consentimento e antispam.
- [ ] Persistir inscrição de newsletter em provedor real com confirmação e descadastro; atualmente há apenas feedback visual.
- [ ] Criar monitoramento/alertas de falhas de formulários e políticas de proteção de dados/LGPD.

## Fase 3: Estrutura do Front-end (ReactJS)

**Objetivo:** Entregar painel Super Admin e área do cliente com componentes reutilizáveis, acessibilidade e controle de acesso.  
**Situação neste repositório:** Parcial · 3/5 marcos identificados.

- [x] Site React responsivo com seções comerciais, menus móveis e componentes visuais implementados.
- [x] Simulador visual de TV e calculadora interativa de planos presentes no código.
- [x] Seções de SEO e apresentação do produto presentes; não equivalem à validação de SEO real.
- [ ] Refatorar `src/App.tsx` em componentes de jornada, pricing, formulário e simulador com testes.
- [ ] Integrar CTAs com demonstração/agendamento e onboarding do cliente, mantendo rastreamento de atribuição.

## Fase 4: Módulo de Rádio Indoor

**Objetivo:** Desenvolver playlists musicais, grade de áudio e inserção automática de anúncios comerciais.  
**Situação neste repositório:** Não evidenciado no código · 0/3 marcos identificados.

- [ ] Publicar página de demonstração real de Rádio Indoor com exemplo de playlists e locução comercial.
- [ ] Conectar exemplos de grade/intervalo de spots à API Rádio (somente quando a engine estiver pronta).
- [ ] Produzir conteúdo de documentação e FAQs do Rádio sobre licença, curadoria e programação.

## Fase 5: Módulo de TV Indoor e Story Builder

**Objetivo:** Controlar telas e campanhas, editar layouts dinâmicos e reproduzir conteúdo conforme programação.  
**Situação neste repositório:** Parcial · 1/3 marcos identificados.

- [x] Simulador ilustrativo de TV corporativa disponível na landing page; **não é um Story Builder funcional**.
- [ ] Integrar prévia de campanhas reais/templates do Story Builder com dados públicos seguros ou demonstração isolada.
- [ ] Conectar CTA de teste da TV a fluxo real de teste/onboarding; validar acessibilidade do simulador.

## Fase 6: Automação Financeira e Integração de Pagamentos

**Objetivo:** Administrar pacotes, cobrar de forma recorrente e bloquear/liberar recursos segundo o estado financeiro.  
**Situação neste repositório:** Parcial · 1/4 marcos identificados.

- [x] Calculadora comercial apresenta cenários de quantidade de telas e ciclo de cobrança.
- [ ] Sincronizar preços, limites e disponibilidade com o catálogo de planos da API para evitar divergências comerciais.
- [ ] Integrar checkout Mercado Pago/onboarding recorrente de forma segura (sem processar credenciais no browser).
- [ ] Integrar leads e assinaturas com atribuição UTM/funil e métricas de conversão.

## Fase 7: Homologação, Refatoração e Deploy

**Objetivo:** Demonstrar qualidade ponta a ponta, estabilidade, performance e operação em produção.  
**Situação neste repositório:** Não evidenciado no código · 0/5 marcos identificados.

- [ ] Configurar CI com `npm ci`, `npm run lint` (`tsc --noEmit`) e `npm run build`, obtendo check verde.
- [ ] Criar testes E2E de formulários, links, consultor estratégico, simulação e falhas de rede.
- [ ] Auditar Core Web Vitals, Lighthouse mobile, acessibilidade, SEO social/Open Graph e carregamento inicial.
- [ ] Revisar depoimentos, cálculos comerciais, LGPD/cookies e ausência de alegações não verificadas.
- [ ] Homologar domínio, SSL, analytics, monitoramento, backup, deploy e rollback.

## Entrega de Rádio Indoor — 14/10/2026 (PRs #19/#10/#2 integrados à main; não homologados)

- **API:** [PR #19](https://github.com/paulodias-dev/meucomercial-api/pull/19) — áudio com licença, playlists tipadas, montagem horária determinística, inserção de spots e prévia autenticada; testes de autorização, isolamento, licença e sequência adicionados.
- **Admin:** [PR #10](https://github.com/paulodias-dev/meucomercial-admin/pull/10) — biblioteca de áudio, editor de playlist Rádio, ordem, intervalo de spots, publicação e prévia, com permissões do menu preservadas.
- **Site:** sem alteração funcional nesta entrega. Atualização deste indicador global mantida sincronizada.
- **Qualidade:** workflows GitHub Actions da API e do Admin registraram falha nesta execução (não há evidência de suite verde); validação local integral, Player físico, feriados, regras por minuto, campanhas avançadas e direitos musicais em produção **continuam pendentes**.
- **Indicador:** API 16/34 + Admin 15/31 + Site 8/28 = **39/93 = 41,9%** de implementação com evidência (não é homologação). Base anterior: **36/93 = 38,7%**. Alteração: +3 marcos, posteriormente integrados à main (PRs #19/#10/#2).

## Entrega de programação por calendário — 14/10/2026 (PRs não draft, homologação pendente)

- **API:** [PR #20](https://github.com/paulodias-dev/meucomercial-api/pull/20) — resolvedor de grades por fuso/horário noturno/feriados/prioridade, sincronização de dispositivos desligados da grade, manifesto de áudio filtrado, cabeçalho sem cache, execução horária/posição musical, transições declarativas e testes.
- **Admin:** [PR #11](https://github.com/paulodias-dev/meucomercial-admin/pull/11) — editor de grades de Rádio, exceções, prioridade, dispositivos, preview por fuso, pausa/reativação e escolha de transição.
- **Site:** apenas sincronização documental do indicador global, sem alteração de comportamento comercial.
- **Indicador:** API **17/34** + Admin **16/31** + Site **8/28** = **41/93 = 44,1%** de cobertura identificada, contra **39/93 = 41,9%** anteriormente. Novos marcos em PRs abertos, ainda não integrados à `main`.
- **Validação:** código e testes versionados, porém CI/Swagger/Player físico ainda não homologados; workflow verde é pré-requisito obrigatório para deploy. A instrução `fade` no manifesto não demonstra implementação de crossfade no Player.

## Ordem de execução e dependências

1. P0 — integrar formulário de demonstração/contato com persistência real e validação LGPD/antispam.
2. P0 — implementar newsletter real ou retirar promessa de inscrição até haver provedor.
3. P1 — alinhar precificação e onboarding ao catálogo de planos/checkout da API.
4. P1 — componentizar a landing page e integrar demonstrações reais de Rádio/Story Builder quando disponíveis.
5. P0 para release — E2E, SEO e performance mobile, acessibilidade, segurança e observabilidade.

## Critérios obrigatórios para atualizar este roadmap

1. **Não presumir pronto por existir rota/tela:** marcar `[x]` apenas após verificar implementação no código e anexar referência de commit/PR. Para aceitar uma fase como **homologada**, exigir testes e evidência de execução.
2. **Progresso global:** recalcular a tabela nas três cópias de `roadmap.md` ao finalizar entregas; não confundir o indicador da simplificação de legado com a execução deste produto.
3. **Uma entrega por fase substancial:** planejar PRs não draft, sem microfatiamento artificial. Registrar responsável, branch, impacto em banco/API/front e próximos critérios de aceite.
4. **Integração por contrato:** mudanças de API exigem validação do Metronic, do site e do Player quando afetados; segredos nunca devem entrar no Git.
5. **Testes/segurança:** migrations reversíveis, isolamento entre clientes, RBAC, filas e idempotência, auditoria de acesso, LGPD e Swagger L5 para rotas Laravel; QA mobile-first e acessibilidade no React.
6. **Deploy:** somente após CI verde, QA por perfil, rollback ensaiado, backups, armazenamento S3, cron/workers, webhook e monitoramento comprovados.

## Checklist de release da plataforma

- [ ] API: PHPUnit, migrations e Swagger executados com sucesso, incluindo casos de falha, assinatura e múltiplos clientes.
- [ ] Painel: TypeScript/Vite, navegação/permissões e fluxos operacionais aprovados em mobile e desktop.
- [ ] Rádio: engine musical, inserção de anúncios e Player real demonstrados em testes de ponta a ponta.
- [ ] TV: Story Builder, manifesto, sincronização e Player real demonstrados em testes de ponta a ponta.
- [ ] Financeiro: sandbox/produção Mercado Pago, recorrência, webhook assinado, bloqueio/liberação e idempotência homologados.
- [ ] Site: formulário de lead/newsletter com persistência, privacidade e métricas de conversão validados.
- [ ] Infra: S3, workers, SSL, domínio, backup/restore, monitoramento e incident response aprovados.
- [ ] Publicação: responsável aprovou o aceite da release e o plano de reversão.

## Referências do ecossistema

- [API Laravel](https://github.com/paulodias-dev/meucomercial-api) · [Painel Metronic](https://github.com/paulodias-dev/meucomercial-admin) · [Site público](https://github.com/paulodias-dev/meucomercial-site)
- Roadmap da simplificação legada (histórico): `docs/roadmap-simplificacao-agencia-indoor.md` nos repositórios em que está presente.
- Documento de regras para agentes/IA: `AGENTS.md` (**planejado**, ainda não identificado na auditoria do código-base).
