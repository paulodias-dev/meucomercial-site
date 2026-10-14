# Roadmap de Desenvolvimento — Plataforma SaaS Mídia Indoor

> **Projeto:** Site institucional / aquisição de leads · **Repositório:** `paulodias-dev/meucomercial-site`  
> **Atualização de referência:** 14/10/2026 · **Branch de produção:** `main` · **Estado:** desenvolvimento/homologação em andamento

**Visão do produto.** Plataforma SaaS de TV e Rádio Indoor com operação comercial bilateral: assinaturas recorrentes de estabelecimentos e venda de espaços publicitários a anunciantes terceiros, além de Cliente/Contrato 360º, rede de locais, inventário, campanhas, veiculações e comprovação de execução. Conecta API Laravel/MySQL, painel React/Metronic e site comercial. A aplicação executada nas TVs/radios é um componente próprio que ainda precisa ser inventariado e homologado.

**Responsabilidade deste repositório:** Landing page, comunicação do produto, SEO, precificação e conversão comercial.

## Painel geral da plataforma (evidência de código, não homologação)

| Repositório | Marcos com evidência | Total monitorado | Cobertura verificada |
|---|---:|---:|---:|
| [meucomercial-api](https://github.com/paulodias-dev/meucomercial-api/blob/main/roadmap.md) | 17 | 40 | 42,5% |
| [meucomercial-admin](https://github.com/paulodias-dev/meucomercial-admin/blob/main/roadmap.md) | 16 | 37 | 43,2% |
| [meucomercial-site](https://github.com/paulodias-dev/meucomercial-site/blob/main/roadmap.md) | 8 | 31 | 25,8% |
| **Plataforma completa** | **41** | **108** | **38,0%** |

**Cálculo:** marcos `[x]` com evidência de implementação na `main` ou em PR definitivo referenciado ÷ total de marcos deste roadmap × 100. **Escopo ampliado em 15 marcos ainda pendentes (+6 API, +6 Admin, +3 Site); a queda de 44,1% para 38,0% resulta do aumento do denominador, não de regressão técnica.** **Inclui PRs abertos, ainda não disponíveis em produção.** Cada marco tem peso igual. **Não é percentual de homologação ou de prontidão para produção.** Marcos `[ ]` abrangem trabalho ainda não encontrado, implementação parcial ou aceite ainda não comprovado. Alterar um marco de `[ ]` para `[x]` somente após apontar PR/commit e evidência verificável.

**Escopo:** este roadmap acompanha a **plataforma inteira** (API, painel, site e Player/TV externo ainda sem repositório específico identificado). O roadmap histórico de remoção/modernização continua em `docs/roadmap-simplificacao-agencia-indoor.md`, mas seus **87,5% não são reutilizados** para medir o SaaS inteiro.

**Legenda:** `[x]` = há artefato de implementação identificado; `[ ]` = aceite pendente ou funcionalidade ausente. Um `[x]` não significa testes verdes ou implantação comprovada.

## Decisão de produto — operação em duas frentes e experiência 360º (aprovada em 14/10/2026)

**Escopo definitivo:** Meu Comercial vende (A) assinaturas de Rádio e TV Indoor a estabelecimentos e (B) espaços publicitários desses ambientes a anunciantes terceiros. A empresa anunciante também pode ser estabelecimento assinante. Agência/operador administra a rede, sob permissões. Não se trata de duas bases de clientes independentes nem de um simples cadastro de mídia.

**Entidades e responsabilidade comercial:**
- **Cliente/organização:** identidade jurídica única com papéis contextuais estabelecimento, anunciante ou ambos; operadores/agências administram as permissões. ID é chave interna, jamais campo de digitação exigido na interface.
- **Estabelecimento/local/rede:** proprietário ou parceiro da área de veiculação, unidades, telas, rádios, pontos físicos, planos de capacidade e janelas de anúncio.
- **Assinatura/serviço Indoor:** relação recorrente entre a plataforma e o estabelecimento, preservando fonte de verdade de planos, assinaturas e recebíveis.
- **Contrato/ordem de inserção publicitária:** venda ao anunciante com regras próprias de orçamento, preços, vigência, reserva de espaços, criativos, frequência, aprovação e faturamento. Não é uma segunda assinatura fictícia do estabelecimento.
- **Campanha e mídia:** briefing, assets, licenças, segmentação, datas, spots de áudio/TV, prioridade, inventário reservado e controle de publicação.
- **Prova de veiculação:** execução confirmada pelo Player e reconciliada contra o contratado, separada de mera previsão de grade. Métricas estimadas de audiência jamais serão apresentadas como público efetivamente comprovado.

**Jornadas macro:** (1) Estabelecimento: lead → Cliente 360º → serviço/contrato/assinatura → provisionamento do local/player → mídia/programação → cobrança/renovação/atendimento. (2) Anunciante: lead → Cliente 360º → proposta → disponibilidade e reserva por rede/local/período → ordem de inserção/contrato → aprovação e criativos → veiculação → comprovação/relatório → faturamento/conciliação. (3) Operador: dashboard de serviços e publicidade, monitoramento, carteira, capacidade, inadimplência e fila de atenção.

**Diretriz de UX premium:** duas experiências complementares: **Cliente 360º** (relacionamento e todos os serviços) e **Central de Operações Indoor** (campanhas, biblioteca, grades, contratos publicitários, inventário, locais e players em escala). **Contrato/Serviço 360º** contextualiza cada contratação. Padrão React/Metronic, português brasileiro, mobile-first, temas dark/light, informações objetivas, ações rápidas, cabeçalho contextual, busca assíncrona e filtros operacionais. Evitar cadastros com ID numérico manual, telas isoladas e grandes áreas vazias.

**Premissas arquiteturais e de escala:** reutilizar cadastro de clientes, vendas, assinaturas, recebíveis e dispositivos; não criar módulos financeiros paralelos nem misturar receita de assinatura com publicidade. Modelar vínculo contratual/operacional somente após análise do banco e das políticas existentes. Todo acesso e filtro deverá respeitar tenant, cliente, papel e contrato; nenhuma agência ou anunciante vê dados do estabelecimento fora do compartilhamento autorizado. Consultas e indicadores paginam/agregam no servidor (10 mil+ mídias/cliente/campanhas), com índices e limites, e nunca baseiam totalizadores na primeira página de até 100 resultados. LGPD, licenças, aprovação, auditoria e segurança do Player são requisitos de aceite.

**Sequência de dependências:** primeiro CI e contrato de dados/escopo; depois Cliente 360º + lookup contextual, Contrato/Serviço 360º e fluxo de ativação; em paralelo inventário de mídia por local; depois venda/reserva de espaços, campanhas, execução Rádio/TV e prova de veiculação; finalmente relatórios comerciais/operacionais e E2E. Nenhum desses itens está marcado como entregue apenas por esta decisão de planejamento.

## Progresso deste repositório

**8/31 marcos com evidência de código = 25,8% de cobertura de implementação identificada.** Pendências de CI, staging, homologação e deploy permanecem abertas independentemente deste índice.

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

## Fase 7: Produto 360º e Mercado Publicitário Indoor (nova frente estratégica)

**Objetivo:** Fazer do site comercial uma aquisição de duas pontas: estabelecimentos que contratam a solução Indoor e anunciantes que compram espaços de publicidade. **Situação:** Planejada · 0/3 marcos implementados.

- [ ] **Proposta de valor e navegação por público.** Criar jornadas distintas e claras para Estabelecimentos (Rádio/TV, instalação, contrato recorrente, dispositivos) e Anunciantes (rede de pontos, segmentação, mídia disponível, campanhas, prova de exibição e proposta de veiculação). Manter página principal e identidade, com SEO/FAQ/CTAs próprios e sem prometer audiência ou cobertura não comprovadas.
- [ ] **Captação e conversão bilateral integrada ao CRM/API.** Formulários/contexto de demonstração e contratação de estabelecimento distintos de solicitação de mídia por anunciante, com consentimento LGPD, antispam, UTM/origem, validações, deduplicação e encaminhamento comercial ao fluxo correto; exibir estados de envio e fallback, nunca simular lead salvo quando não estiver.
- [ ] **Catálogo seguro de mídia/solicitação de proposta.** Página comercial de formatos, regiões e oportunidades de anúncio alimentada por dados autorizados/curados do inventário e política de preços, com filtro/briefing e pedido de orçamento; não revelar taxas confidenciais, ocupação em tempo real ou dados identificáveis de estabelecimentos sem autorização. Evoluir para reserva/checkout apenas depois do backend de booking e das aprovações.

**Aceite da frente:** caminhos comerciais separados, rastreamento válido, leads registrados no CRM/API com finalidade/papel, LGPD revisada, dados reais e segurança do inventário; testes de conversão/SEO/mobile.
## Fase 8: Homologação, Refatoração e Deploy

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

## Entrega de programação por calendário — 14/10/2026 (PRs #20/#11/#3 integrados à main; homologação pendente)

- **API:** [PR #20](https://github.com/paulodias-dev/meucomercial-api/pull/20) — resolvedor de grades por fuso/horário noturno/feriados/prioridade, sincronização de dispositivos desligados da grade, manifesto de áudio filtrado, cabeçalho sem cache, execução horária/posição musical, transições declarativas e testes.
- **Admin:** [PR #11](https://github.com/paulodias-dev/meucomercial-admin/pull/11) — editor de grades de Rádio, exceções, prioridade, dispositivos, preview por fuso, pausa/reativação e escolha de transição.
- **Site:** apenas sincronização documental do indicador global, sem alteração de comportamento comercial.
- **Indicador:** API **17/34** + Admin **16/31** + Site **8/28** = **41/93 = 44,1%** de cobertura identificada, contra **39/93 = 41,9%** anteriormente. Os novos marcos foram posteriormente integrados à `main` pelos PRs #20/#11/#3.
- **Validação:** código e testes versionados, porém CI/Swagger/Player físico ainda não homologados; workflow verde é pré-requisito obrigatório para deploy. A instrução `fade` no manifesto não demonstra implementação de crossfade no Player.

## Entrega de inventário publicitário e reservas B2B — 14/10/2026

**Decisão de produto preservada:** o Meu Comercial mantém Cliente único, com papel de **estabelecimento titular** na oferta de Rádio/TV Indoor e **anunciante** na compra de inserções; ainda não existe contrato jurídico publicitário ou portal do anunciante. A operação de inventário nesta entrega é **privada e administrativa**.

- **API:** [PR #26](https://github.com/paulodias-dev/meucomercial-api/pull/26) — migration de espaços (`indoor_ad_slots`) e reservas (`indoor_ad_reservations`), ligação ao `IndoorLocation` e `Client`, preço `DECIMAL`, autorização comercial do estabelecimento registrada, capacidade de inserções por dia, elegibilidade de Player/assinatura, bloqueio de pools unitários/ambientes sobrepostos, cálculo diário de saldo, bloqueio de 30 minutos, confirmação/cancelamento, idempotência por UUID, transações com `FOR UPDATE`, snapshots monetários e novos RBAC `indoor_inventory.*`/`indoor_bookings.*`. OpenAPI e testes de overbooking/expiração, isolamento, preço e integridade, documentados em `docs/indoor-advertising-inventory.md`.
- **Admin:** [PR #17](https://github.com/paulodias-dev/meucomercial-admin/pull/17) — painel Metronic `/apps/indoor/ad-inventory` com seleção textual de estabelecimento/local/anunciante, cadastro de preços/limites, consulta de disponibilidade por data, reserva e decisões de confirmação/cancelamento, filtros paginados por papel comercial, indicadores e atalhos no Cliente/Serviço 360º. Menu protegido por permissão.
- **Site:** [PR #5 do Site — catálogo público ainda pendente](https://github.com/paulodias-dev/meucomercial-site/pull/5) — público **não recebe** endpoints privados, preços internos, ocupação ou dados de parceiros nesta entrega. Futuro catálogo comercial deve consumir somente um DTO/endpoint público com escopo explícito e consentimento, após validação de contratos, segurança e moderação.
- **Sem funcionalidades inventadas:** reserva comercial **não** gera receivables, pedidos jurídicos de inserção, emissão fiscal, campanhas, publicação em Rádio/TV, audiência ou comprovante. Ainda faltam grade por horário, metas por campanha, segmentação, contrato publicitário, conciliação financeira, execução do Player e testes de concorrência com duas conexões MySQL.
- **Critérios de aceite:** o marco global de inventário/campanhas da Fase 7 permanece **parcial** (0/6 integralmente aceitos na API e no Admin); não marcar `[x]` artificialmente. Progresso global matemático permanece API **17/40**, Admin **16/37**, Site **8/31**, total **41/108 = 38,0%** até homologação completa dos marcos.
- **Validação:** testes e contrato de API foram escritos mas **não executados**; checkout via container não tem DNS para GitHub. GitHub Actions **não** consultado, conforme instrução do usuário.
- **Próximo passo:** formalizar ordem de inserção/contrato do anunciante e aprovação dos criativos; depois conectar reservas confirmadas ao motor Rádio/TV e logs de veiculação, sem criar faturamento paralelo ao Receivable.

## Entrega de Ordens de Inserção 360º e revisão de criativos — 14/10/2026

**API:** [PR #27](https://github.com/paulodias-dev/meucomercial-api/pull/27) — nova ordem única por reserva confirmada (indoor_ad_orders), anunciante herdado da reserva, referências de contrato e direitos, seleção da biblioteca de mídias existente, estados draft/submitted/approved/rejected/cancelled, revisão com justificativa e snapshot de criativo aprovado. Validação de mídia do anunciante: Rádio exige áudio spot licenciado até o fim do período, TV usa imagem/vídeo pronto. RBAC indoor_orders.view/manage/review; filtros/paginação e OpenAPI; testes de não duplicação, direitos, rejeição/revisão, segurança e nenhuma cobrança/publicação. Contrato em docs/indoor-insertion-orders.md.

**Admin:** [PR #18](https://github.com/paulodias-dev/meucomercial-admin/pull/18) — novo módulo Metronic de Ordens de inserção no menu Indoor, busca/paginação por anunciante/estabelecimento/situação, criativos por nome e formato, envio, aprovação/rejeição com parecer, cancelamento explícito. A reserva confirmada abre uma ordem sem informar ID manual. Links e contadores no Cliente/Serviço 360º.

**Site:** [PR #6](https://github.com/paulodias-dev/meucomercial-site/pull/6), roadmap sincronizado, sem expor base de mídia, contratos, preços, permissões ou reservas da API privada ao público. Landing pages de anunciantes e propostas públicas continuam dependentes de endpoint curado, consentimento, LGPD e contratos.

**Regras:** cancelar a reserva exige cancelar a ordem antes; cancelar a ordem não devolve capacidade automaticamente. Referência declarada de contrato/licença não é contrato juridicamente validado. Ordem aprovada NÃO gera Receivable, não dispara Player/manifesto, não cria campanhas ativas e não é prova de veiculação.

**Aceite parcial:** falta contrato eletrônico, inserção em grades com janelas/frequência, faturamento de publicidade idempotente e prova de exibição, além de segurança por tenant/rede e homologação real. Fase 7 continua 0/6 marcos integralmente aceitos; sem elevar conclusão por PR aberto.

**Progresso matemático:** API **17/40 (42,5%)** + Admin **16/37 (43,2%)** + Site **8/31 (25,8%)** = **41/108 = 38,0%**. Testes escritos porém não executados; GitHub Actions não consultado, conforme instrução.

**Próximo passo:** Ordem de Inserção aprovada → campanha e grade de Rádio/TV com moderação/versão de mídia → comprovante Player idempotente; faturamento publicitário apenas com gatilho comercial e chave única, separado das assinaturas.

## Refatoração de Ativos de Áudio — Bibliotecas Global e Privada (14/10/2026)

**Objetivo solicitado:** separar a fonte musical centralizada do domínio de jingles/locuções/ofertas particulares de cada supermercado, sob controle das agências. Áudio é reutilizável em Rádio Indoor e como camadas de Story Builder de TV, sem duplicar armazenamento global nem vazar mídias privadas.

- **API:** [PR #28](https://github.com/paulodias-dev/meucomercial-api/pull/28) — tabelas `musics` (metadados musicais, S3, licença, SHA-256 global) e `commercial_spots` (tenant_id+client_id, tipo, vigência, S3, SHA-256 restrito ao cliente); associações `indoor_audio_agency_users`/`indoor_audio_agency_clients`; acesso **fail closed** se flag tenancy, agência ativa ou pertencimento não estiverem validados. Músicas globais pesquisáveis por usuários e portal cliente JWT; spots privados apenas para usuário da agência proprietária e cliente do próprio JWT. Upload S3 privado com dedup por hash; URLs temporárias nos manifestos; APIs de upload/listagem/revogação. `indoor_playlist_items` suporta fonte tipada, mantendo o legado; `indoor_video_audio_layers` representa música de fundo + locução por item visual. Rádio determinístico atualizado; TV envia overlays no manifesto. Testes de isolamento cross-agency/cross-client, persistência, licenças, deduplicação e regressão. Contrato: `docs/audio-asset-tenancy-architecture.md`.
- **Admin:** [PR #19](https://github.com/paulodias-dev/meucomercial-admin/pull/19) — novas telas Metronic `/apps/indoor/audio-library` e `/apps/indoor/tv-audio`; cadastro por upload e seleção por nome, artista, gênero, agência e cliente; status, validade, pesquisa/paginação. Editor Rádio passa a mesclar músicas globais, spots privados e mídias legadas. UI de camadas de TV salva por item sem recriar playlist. Menu condicionado a permissões.
- **Site:** documentação sincronizada neste `roadmap.md`; não expor S3, músicas licenciadas, spots privados nem dados de agências na área pública. A divulgação comercial de recursos e o portal cliente devem usar apenas endpoints autenticados apropriados.
- **Limite / segurança:** a aplicação legada mantém `TENANCY_ENABLED=false` por padrão; a migration prepara o registry, **mas esta entrega não liga automaticamente tenancy nem vincula clientes existentes a agências**. Spots privados permanecem bloqueados até o provisionamento, revisão de direitos e migração segura. `indoor_media_assets` continua legada até importação validada; execução de mixagem real no Player de TV e ingestão multipart S3 ainda pendentes.
- **Aceite:** implementação de estrutura e APIs não equivale a homologação global. PHPUnit, MySQL migrations, TS/Vite, testes de concorrência e QA de Player **não foram executados**. GitHub Actions não foi utilizado a pedido do usuário. Progresso matemático mantém API **17/40 (42,5%)**, Admin **16/37 (43,2%)**, Site **8/31 (25,8%)**, total **41/108 = 38,0%** até aceite integral dos marcos.
- **Próxima etapa obrigatória:** consolidar toda a base multi-tenant (agências × clientes × papéis), bootstrapping/migração de clientes e acervo legado, ingestão em lote S3 e Player TV capaz de executar overlays; depois testes ponta a ponta e observabilidade.

## Ordem de execução e dependências (revisada para operação bilateral)

1. **P0 — Capturar leads de estabelecimentos e anunciantes em jornadas distintas, com LGPD/antispam, persistência e atribuição.**
2. **P0 — Ajustar mensagem/CTAs públicos para os dois papéis, sem alegações de audiência ou disponibilidade não comprovadas.**
3. **P1 — Construir catálogo seguro de publicidade com briefing e orçamento condicionado ao inventário aprovado na API.**
4. **P1 — Integrar preços e planos de assinatura, demonstrações reais do Rádio/TV e onboarding guiado aos serviços existentes.**
5. **P0 para release — Refatorar componentes, remover newsletter fictícia, CI/E2E, SEO, acessibilidade e performance mobile.**

## Critérios obrigatórios para atualizar este roadmap

1. **Não presumir pronto por existir rota/tela:** marcar `[x]` apenas após verificar implementação no código e anexar referência de commit/PR. Para aceitar uma fase como **homologada**, exigir testes e evidência de execução.
2. **Progresso global:** recalcular a tabela nas três cópias de `roadmap.md` ao finalizar entregas; não confundir o indicador da simplificação de legado com a execução deste produto.
3. **Uma entrega por fase substancial:** planejar PRs não draft, sem microfatiamento artificial. Registrar responsável, branch, impacto em banco/API/front e próximos critérios de aceite.
4. **Integração por contrato:** mudanças de API exigem validação do Metronic, do site e do Player quando afetados; segredos nunca devem entrar no Git.
5. **Testes/segurança:** migrations reversíveis, isolamento entre clientes, RBAC, filas e idempotência, auditoria de acesso, LGPD e Swagger L5 para rotas Laravel; QA mobile-first e acessibilidade no React.
6. **Deploy:** somente após CI verde, QA por perfil, rollback ensaiado, backups, armazenamento S3, cron/workers, webhook e monitoramento comprovados.

## Critério específico de go/no-go para o novo mercado publicitário

- Estabelecimento, anunciante e agência com isolamento de acesso; a mesma pessoa jurídica pode ocupar ambos os papéis.
- Fluxo de venda de publicidade vinculado a orçamento/ordem de inserção sem confundir cobrança do anunciante com assinatura do estabelecimento.
- Inventário não pode ser vendido acima da capacidade por grade/horário/local; reservas concorrentes exigem teste de colisão.
- Campanha com aprovação, licenças, limites e janela válida não publica mídia de cliente errado ou após vencimento.
- Relatórios usam eventos verificáveis de exibição e rotulam estimativas como estimativas; métricas financeiras conciliam contra registros reais.
- Telas do Admin suportam pesquisa contextual e alto volume sem entrada manual de IDs; versões desktop e mobile homologadas.
- Site separa origem/consentimento de lead do anunciante e do estabelecimento, sem expor inventário confidencial.

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
