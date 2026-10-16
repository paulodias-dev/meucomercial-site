# Roadmap de Desenvolvimento — Plataforma SaaS Mídia Indoor

> **Projeto:** Site institucional / aquisição de leads · **Repositório:** `paulodias-dev/meucomercial-site`  
> **Atualização de referência:** 15/10/2026 · **Branch de produção:** `main` · **Estado:** desenvolvimento/homologação em andamento

**Visão do produto.** Plataforma SaaS de TV e Rádio Indoor com operação comercial bilateral: assinaturas recorrentes de estabelecimentos e venda de espaços publicitários a anunciantes terceiros, além de Cliente/Contrato 360º, rede de locais, inventário, campanhas, veiculações e comprovação de execução. Conecta API Laravel/MySQL, painel React/Metronic e site comercial. A aplicação executada nas TVs/radios é um componente próprio que ainda precisa ser inventariado e homologado.

**Responsabilidade deste repositório:** Landing page, comunicação do produto, SEO, precificação e conversão comercial.

## Sprint MVP — Portal de autoatendimento Indoor do estabelecimento (16/10/2026)

**PRs definitivos da sprint:** [API #75](https://github.com/paulodias-dev/meucomercial-api/pull/75) e [Site #23](https://github.com/paulodias-dev/meucomercial-site/pull/23). Dependência recíproca do contrato (API + gateway/site), ambos não draft, base `main`, sem merge automático.


**Entrega full-stack coordenada:** novo portal responsivo `/portal` no site, API exclusiva `auth:client`, gateway Express same-origin, login/logout, **cinco áreas** (serviços existentes, dispositivos, locais, biblioteca de mídia, anúncios do próprio anunciante) e indicadores operacionais agregados de toda a base. Nenhuma alteração na interface do Admin, no Player nativo nem na cobrança.

**Escopo de implementação — 16/18 critérios escritos em código (88,9%); aceites operacionais seguem pendentes:**
- [x] Login JWT do cliente ativo com autenticação diferente de agência/`auth:api`; throttling 8/min no login.
- [x] Gateway same-origin com allowlist de 8 rotas, método estrito, upstream HTTPS em produção, timeout 12s e redirects bloqueados.
- [x] Sessão JWT apenas em memória; nenhum localStorage, cookie de agência, token em query string ou log; logout remoto.
- [x] Consulta agregada de dispositivos com totais SQL de online/offline/bloqueio/sincronização/sem pareamento, sem sumarizar só 20/100 itens.
- [x] Lista paginada de Players filtrada exclusivamente por `client_id` do JWT, sem token, PIN, serial, metadata nem arquivos privados.
- [x] Lista paginada de locais pertencentes ao cadastro de cliente, com dados resumidos.
- [x] Lista paginada de metadados de mídia próprios, sem URL privada, caminho de arquivo, metadados de licença ou S3.
- [x] Pedidos de campanha filtrados pelo cliente **anunciante**, sem mostrar o anunciante de outra empresa nem detalhes confidenciais de anfitrião/reserva.
- [x] Reuso do endpoint `/api/client/services` existente para planos/assinaturas; **não cria** assinaturas ou recebíveis.
- [x] Site desktop/mobile com link `/portal`, login acessível e cinco abas paginadas; loading, erro, vazio, retry e logout.
- [x] Proteção de cliente inativo no `EnsureActiveClient`; `X-Agency-Tenant`/client_id arbitrários não ampliam escopo.
- [x] Cache-Control `private, no-store` na API e proxy; nenhuma credencial em query string.
- [x] API com atributos L5 Swagger para cinco endpoints novos e documentação de autorização/privacidade.
- [x] PHPUnit: sete cenários de JWT, cliente estrangeiro, 103 Players, local/mídia privados, campanhas isoladas e filtros, adicionados ao repositório.
- [x] Site: 12 testes Node do portal/proxy executados no contexto da sessão e integrados ao `npm run build`; verificação estática do controlador/rotas PHP sem divergência de chaves estruturais.
- [x] Corrigir consultor do Site removendo quatro grupos de alegações de ROI sem evidência e evitando logar os textos livres do visitante.
- [ ] CI completo executado com PHPUnit, MySQL8, Swagger, TS/Vite, testes de proxy HTTP, e logs de runner — GitHub Actions segue falhando antes de qualquer step.
- [ ] Homologação em domínio HTTPS, navegador mobile/desktop e contas reais de clientes diferentes; ainda não foi feita.

**Marco técnico da API que recebe implementação nesta sprint:** `Projetar e validar contrato de API específico para cliente assinante: somente seus locais, campanhas, dispositivos e mídia; testes de autorização entre clientes.` Todas as superfícies de leitura e testes foram escritas; o **aceite de validação real** continua bloqueado por CI. Registrar no roadmap como concluído **em código** e com pendência de QA, não como homologado em produção.

**Contagem prevista após integrar os PRs:** API **29/59 = 49,2%** (antes 28/59); Admin **25/57 = 43,9%** (sem alteração); Site **13/34 = 38,2%** (sem marcar uma página como conclusão de um marco comercial maior). **Total 67/150 = 44,7%** (antes 66/150=44,0%). A contagem representa apenas marcos de engenharia implementados e não significa que o MVP esteja 44,7% homologado.

**Riscos e limites:** JWT em memória exige login após refresh, escolha deliberada até BFF robusto. O portal é leitura/consulta, não permite publicar, pagar ou parear; sessões de agência e Player permanecem isoladas. Todos os claims `online` são conexão, **não prova de audiência ou veiculação**. Seguir `docs/CLIENT_INDOOR_PORTAL_MVP.md`.

**Próxima sprint:** CI/MySQL8/Composer desbloqueado e testes E2E de sessão/proxy; operação real de pareamento e publicação do cliente com RBAC/auditoria; QA do Player Rádio/TV, S3 e relatórios de inserção.

## Sprint MVP — Jornada comercial, funil qualificado e confiança (16/10/2026)

**PRs definitivos coordenados:** [Site #22](https://github.com/paulodias-dev/meucomercial-site/pull/22), [API #74](https://github.com/paulodias-dev/meucomercial-api/pull/74) e [Admin #44](https://github.com/paulodias-dev/meucomercial-admin/pull/44), base `main`, não draft, sem merge automático. Todos os três devem ser integrados na mesma release.


**Objetivo do bloco:** ligar públicos distintos a leads reais e à qualificação na API/Admin, eliminar depoimentos/preços sem evidência e preservar contratos da plataforma. Repositórios integrados Site + API + Admin; `main` é produção e permanece intacta até revisão/merge dos PRs.

**Critérios da sprint — 17/19 (89,5%) implementados em código; 2 gates de QA ainda pendentes:**
- [x] Jornada de estabelecimento com TV/Rádio, licenciamento, instalação, programação, etapas e CTA específico.
- [x] Jornada de agência com carteira autorizada, escopo, clientes/Players, contratos e CTA próprio.
- [x] Jornada de anunciante com inventário, reserva, vigência, criativo, evidência e proposta de mídia separada da assinatura.
- [x] Navegação `#para-quem` desktop/mobile e tablist acessível, teclas Arrow/Home/End e foco.
- [x] CTA de cada público preenche o `kind` correto no formulário e preserva `source` de atribuição.
- [x] Formulário segmentado: só estabelecimento envia estimativa de TVs e segmento; anúncio pede local/período/TV-Rádio; agência pede estrutura e carteira.
- [x] Integração com endpoint existente `POST /api/commercial-leads` e confirmação apenas após `received: true` (regras existentes preservadas).
- [x] Antispam/privacidade: consentimento LGPD, honeypot, throttle, UUID idempotente, validações de email/telefone, UTM; backend existente permanece fonte.
- [x] Eliminar preços de planos/percentual de desconto/ROI simulados sem catálogo autorizado; substituir por pedido de proposta e briefing.
- [x] Retirar cartões de depoimentos e métricas comerciais não fundamentados, mantendo comunicação de produto sem fabricar case real.
- [x] API Super Admin adiciona `summary.total/statuses/kinds` via agregação SQL de toda a base, independente de filtros de página.
- [x] Admin Metronic mostra funil total, etapas e três públicos, mantendo filtros, detalhes, PATCH de qualificação e acesso Master apenas.
- [x] Admin limpa os resultados da pesquisa anterior ao alterar filtros e aborta requisições obsoletas.
- [x] Contato rápido manual por ligação/WhatsApp na fila do Master; links formados apenas com telefone validado, sem mensagem ou dados do lead pré-enviados.
- [x] Site: oito testes Node de contratos/jornadas/segurança comercial adicionados à cadeia `npm run build`, com **8 cenários de regras executados e aprovados nesta sessão**.
- [x] API: dois testes PHPUnit novos (públicos/etapas, paginação e Master RBAC) no conjunto já existente; **definidos, não executados** por CI.
- [x] Admin: 19 verificações estáticas executadas e aprovadas, integradas ao build; novo `AGENTS.md` do Site e guia `docs/MVP_COMMERCIAL_FUNNEL.md`.
- [ ] CI verde de site (`npm ci/lint/build`), Admin (`tsc/Vite`), API (`composer/phpunit/MySQL8/Swagger`), com logs dos jobs, bloqueado por GitHub Actions **0 steps**.
- [ ] Homologar fluxo em domínio HTTPS com proxy de API, navegação 320–1440px, formulários com acesso, CRM Admin, LGPD e perfis reais.

**Marcos existentes encerrados somente no Site:** `AGENTS.md` normativo; `Proposta de valor e navegação por público`; `Captação e conversão bilateral integrada ao CRM/API`. A API e o Admin ganharam código, mas seus marcos maiores de produto **não** foram marcados concluídos sem atendimento integral.

**Progresso após merge:** API **28/59 = 47,5%** (inalterado); Admin **25/57 = 43,9%** (inalterado); Site **13/34 = 38,2%** (antes 10/34). Total **66/150 = 44,0%** (antes 63/150 = 42,0%). Contagem rigorosa por tarefas do roadmap, não volume de código.

**Próximo bloco para MVP:** homologação dos fluxos site→API→CRM e destravar CI; catálogo de planos e contratação reais sem duplicar recebíveis; operação de publicidade/reserva; instalação com Player Rádio/TV e S3 em dispositivos reais, com testes de prova de reprodução.

## Sprint 40% — Conteúdo Rádio Indoor, orientação de licenças e arquitetura (15/10/2026)

**PRs definitivos da sprint:** [Site #21](https://github.com/paulodias-dev/meucomercial-site/pull/21) e [API #71](https://github.com/paulodias-dev/meucomercial-api/pull/71), ambos sobre `main`, sem draft ou merge automático.


**Entrega de produto:** seção **Rádio Indoor** integrada ao site e à navegação mobile/desktop, com oito respostas acessíveis, sequência didática de programação (sem reprodução fictícia), explicação de licença e prestação de contas, CTA de captação com consentimento já existente, [guia comercial/operacional](docs/RADIO_INDOOR_GUIA.md) e oito testes de regressão obrigatórios no build `npm run test:radio`. Sem inventar áudio licenciado, transmissão ativa ou audiência comprovada.

**Marco encerrado nesta sprint:** “Produzir conteúdo de documentação e FAQs do Rádio sobre licença, curadoria e programação”. A **demonstração sonora real** e a integração de horários de spots com API permanecem **pendentes** e não são marcadas como entregues.

**Progresso matemático coordenado:** Site **10/34 = 29,4%**, API **27/59 = 45,8%** (DER versionado e AGENTS normativo), Admin **24/57 = 42,1%**. **Total 61/150 = 40,7%**, acima da meta de 40%; progresso baseado em marcos completos, sem reclassificar CI ou homologação sem execução.

**Próxima entrega:** garantir CI verde/execução de testes, portal de demonstração Rádio com áudio legalmente autorizado e uso do Player real, avanços de conversão bilateral e onboarding.

## Entrega integrada — Captação comercial real (15/10/2026)

**Estado:** implementação em PR definitivo, não homologada nem implantada. **Evidência funcional:** [API #64](https://github.com/paulodias-dev/meucomercial-api/pull/64) (`00c6440`), [Admin #35](https://github.com/paulodias-dev/meucomercial-admin/pull/35) (`02f776f`), [Site #20](https://github.com/paulodias-dev/meucomercial-site/pull/20) (`b917949`).

- API: formulário público validado com consentimento, limitação de taxa, campo honeypot, UUID idempotente e persistência em `site_commercial_leads`; inbox privada somente Super-Admin, atualização de situação, OpenAPI e testes Feature incluídos. Não cria Cliente, assinatura, faturamento ou campanha automaticamente.
- Site: fluxo de Estabelecimento/Agência/Anunciante via proxy HTTPS configurável, atribuição UTM, feedback de erro e sucesso condicionado à persistência; removida a confirmação fictícia de cadastro da newsletter.
- Admin: fila Metronic responsiva, busca, filtros, paginação no servidor e estágio de atendimento; backend impede visualização e mutação por outro perfil, mesmo com rota conhecida.
- **Marco aceito para cobertura de código:** Site, persistência real do formulário de demonstração com validação, consentimento e antispam. Outros marcos de CRM/automação, conversão completa, newsletter confirmada, LGPD operacional e produção permanecem pendentes.
- **Validação pendente:** PHPUnit/MySQL 8, Swagger gerado, lint/build TS e QA manual. Não há evidência de CI verde ou lead real enviado neste momento. Configurar `MEUCOMERCIAL_API_URL` no servidor Site e executar migrations API antes da ativação comercial.

**Painel global consistente nesta entrega:** API **25/59 (42,4%)**, Admin **24/57 (42,1%)**, Site **9/34 (26,5%)**, Plataforma **58/150 (38,7%)**. Inclui código em PRs abertos, não homologação de produção. Próxima prioridade: restabelecer CI verde e instalação limpa MySQL isolada; seguir com escopo/permissões SaaS e distribuição Rádio/TV.

## Painel geral da plataforma (evidência de código, não homologação)

| Repositório | Marcos com evidência | Total monitorado | Cobertura verificada |
|---|---:|---:|---:|
| [meucomercial-api](https://github.com/paulodias-dev/meucomercial-api/blob/main/roadmap.md) | 25 | 59 | 42,4% |
| [meucomercial-admin](https://github.com/paulodias-dev/meucomercial-admin/blob/main/roadmap.md) | 24 | 57 | 42,1% |
| [meucomercial-site](https://github.com/paulodias-dev/meucomercial-site/blob/main/roadmap.md) | 9 | 34 | 26,5% |
| **Plataforma completa** | **58** | **150** | **38,7%** |

**Cálculo:** marcos `[x]` com evidência de implementação na `main` ou em PR definitivo referenciado ÷ total de marcos deste roadmap × 100. **Escopo ampliado em 15 marcos ainda pendentes (+6 API, +6 Admin, +3 Site); a queda de 44,1% para 38,0% resulta do aumento do denominador, não de regressão técnica.** **Desde a linha de base de 41/108, dezesseis marcos granulares efetivamente implementados (oito na API e oito no Admin) foram acrescentados ao escopo e concluídos em código; resultando em 57/124 antes do desdobramento da Fase 9.** **Inclui PRs abertos, ainda não disponíveis em produção.** Cada marco tem peso igual. **Não é percentual de homologação ou de prontidão para produção.** Marcos `[ ]` abrangem trabalho ainda não encontrado, implementação parcial ou aceite ainda não comprovado. Alterar um marco de `[ ]` para `[x]` somente após apontar PR/commit e evidência verificável.

**Replanejamento aprovado em 15/10/2026:** foram detalhados **16 novos marcos pendentes** na Fase 9 (+6 API, +8 Admin, +2 Site), vinculados à governança de planos, bibliotecas, Estúdio de Publicação, segmentação, distribuição e resultados. O total passou de **57/124 (46,0%)** para **57/140 (40,7%)**; **nenhum marco foi marcado concluído** nesta entrega documental. A redução matemática decorre exclusivamente de escopo adicional. Os 57 concluídos incluem código de PRs definitivos ainda abertos (#40 API, #31 Admin, #17 Site), não CI aprovado ou deploy.

**Replanejamento técnico de 15/10/2026:** +2 marcos P0 pendentes na API para consolidação de migrations MySQL 8 e seeders/testes/Swagger; mantidos os 57 marcos anteriormente concluídos. **API 25/56 (44,6%), Admin 24/53 (45,3%), Site 8/33 (24,2%); plataforma 57/142 = 40,1%**. Critérios transversais detalhados abaixo; nenhuma refatoração de banco, execução destrutiva ou homologação ocorreu nesta atualização documental.

**Replanejamento comercial e de execução de 15/10/2026:** +4 marcos pendentes de precificação híbrida de agências (2 API, 1 Admin, 1 Site), agora organizados em sprints integradas sem duplicar a contagem. **API 25/58 (43,1%), Admin 24/54 (44,4%), Site 8/34 (23,5%); plataforma 57/146 = 39,0%**. Comparação: 57/142 = 40,1% antes deste novo escopo. Não houve implementação da cobrança nem aceites de sprints nesta entrega documental.

**Replanejamento UX/UI de 15/10/2026:** +4 marcos pendentes (1 API, 3 Admin, 0 Site), com design system Metronic, perfis, navegação, dashboard de atenção e metas de usabilidade interligados às sprints. **API 25/59 (42,4%), Admin 24/57 (42,1%), Site 8/34 (23,5%); plataforma 57/150 = 38,0%**. Referência anterior: 57/146 (39,0%). Trata-se apenas de requisitos planejados; não equivale a telas entregues, testes verdes ou homologação.

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

**8/33 marcos com evidência de código = 24,2% de cobertura de implementação identificada.** Pendências de CI, staging, homologação e deploy permanecem abertas independentemente deste índice.

## Fase 1: Descoberta e Estruturação (Auditoria)

**Objetivo:** Inventariar os repositórios, documentar arquitetura/DER, definir padrões para IA e remover legados com rastreabilidade.  
**Situação neste repositório:** Parcial · 2/4 marcos identificados.

- [x] Arquitetura inicial e orientações de execução documentadas no `README.md`.
- [x] Código atual usa React, TypeScript, Vite e servidor Express (ver `package.json` e `server.ts`).
- [x] Criar `AGENTS.md` para componentes, SEO, acessibilidade, responsividade, conteúdo e integrações sem dados fictícios.
- [ ] Auditar performance/SEO e a concentração de lógica em `src/App.tsx`; definir mapa de componentes e journeys de conversão.

## Fase 2: Infraestrutura e Back-end Core (API Laravel)

**Objetivo:** Garantir autenticação, dados MySQL, mídias Cloud, filas e interfaces de integração com segurança.  
**Situação neste repositório:** Parcial · 1/4 marcos identificados.

- [x] Servidor Express oferece endpoint `/api/consult` para consultoria comercial por segmento.
- [x] Persistir leads de demonstração em endpoint comercial da API Laravel/CRM com validação, consentimento e antispam ([API #64](https://github.com/paulodias-dev/meucomercial-api/pull/64), [Admin #35](https://github.com/paulodias-dev/meucomercial-admin/pull/35), [Site #20](https://github.com/paulodias-dev/meucomercial-site/pull/20)).
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
- [x] Produzir conteúdo de documentação e FAQs do Rádio sobre licença, curadoria e programação.

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

- [x] **Proposta de valor e navegação por público.** Criar jornadas distintas e claras para Estabelecimentos (Rádio/TV, instalação, contrato recorrente, dispositivos) e Anunciantes (rede de pontos, segmentação, mídia disponível, campanhas, prova de exibição e proposta de veiculação). Manter página principal e identidade, com SEO/FAQ/CTAs próprios e sem prometer audiência ou cobertura não comprovadas.
- [x] **Captação e conversão bilateral integrada ao CRM/API.** Formulários/contexto de demonstração e contratação de estabelecimento distintos de solicitação de mídia por anunciante, com consentimento LGPD, antispam, UTM/origem, validações, deduplicação e encaminhamento comercial ao fluxo correto; exibir estados de envio e fallback, nunca simular lead salvo quando não estiver.
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

## Gate P0 de integração — cadastro, planos e contratos verificáveis (planejado em 15/10/2026)

**Dependência obrigatória da API:** os dois novos marcos pendentes de consolidação MySQL 8/migrations, seeders modulares, PHPUnit para endpoints/serviços e L5 Swagger são contabilizados **somente no roadmap da API**. A API deve respeitar identificadores MySQL <=64 caracteres, `utf8mb4`, tipagem e índices coerentes, além de validar migrations no MySQL real.

**Critérios de aceite do Site:** consumo de endpoints documentados/validados em OpenAPI; exibir somente planos e cotas reais, não presumir elegibilidade sem plano ativo; provar com fixtures e testes de integração as jornadas de agência, estabelecimento e anunciante (free, pago, sem plano, suspenso), erros/validações, isolamento de dados, SEO, acessibilidade e QA mobile-first. Exigir build/testes e CI verde. Dados demonstrativos e `migrate:fresh --seed` são restritos a ambientes descartáveis de desenvolvimento/teste, nunca produção. Esta seção não acrescenta marco próprio ao Site.

## Planejamento de execução por sprints — proposta operacional de 15/10/2026

**Decisão:** adotar sprints como unidade de planejamento, priorização, revisão e aceite da plataforma inteira (API + Admin/Player + Site), no lugar de entregas isoladas organizadas somente por fases. **Cadência sugerida:** Sprint 0 de preparação com 1 semana; Sprints 1–8 com timebox de 2 semanas, sujeito à capacidade real da equipe e replanejamento ao final de cada ciclo. Este planejamento **não cria novos marcos nem altera o significado de [x]/[ ]**: tarefas de produto continuam contadas uma única vez nas fases por repositório. Sprints representam agrupamentos dessas tarefas e dependências, não promessa de conclusão automática nem calendário contratual.

| Sprint | Foco / objetivo demonstrável | Entregáveis e critérios mínimos | Repositório(s) |
|---|---|---|---|
| **0 — Preparação** (1 semana) | Inventário técnico, CI e segurança da refatoração | Conferir PRs pendentes/base real, ambientes MySQL, migrations/FKs, dependências, backups, isolamento de ambientes e pipelines; organizar backlog de risco e estratégia de rollback. **Não executar destruição de dados**. | API, Admin, Site |
| **1 — Fundamentos** (2 semanas) | Banco de desenvolvimento reconstruível e testes executáveis | Consolidar migrations por domínios em PRs revisáveis, seeders por módulo com Master/agência/clientes/plano/mídias, rodar `migrate:fresh --seed` **somente em banco descartável**, executar PHPUnit/MySQL, L5 Swagger e builds/CI. Se exceder capacidade, priorizar núcleo Master/planos/Indoor e replaniﬁcar restante sem falsos aceites. | API; Admin/Site testam contratos |
| **2 — Identidade e planos** (2 semanas) | Master → agência → cliente com autorização e entitlement ativos | Matriz RBAC sem escalada, vínculo entre organização/agência/estabelecimento, plano ativo paid/free/freemium, quotas e testes contra vazamento; permissões refletidas nas telas. | API + Admin |
| **3 — Faturamento híbrido** (2 semanas) | Agência contrata pacote ou paga conforme clientes ativos | Catálogo versionado, ativação/desativação e medição auditável, pacote 10/50/100 ou avulso sem mínimo, cálculo/prévia de valores e proporcionalidade, migração segura entre modalidades, proteção contra duplicidade, UX Master/Agência e vitrine de oferta. Valores R$ 500/10 e R$ 55–60/cliente são **exemplos, não preços aprovados**. | API + Admin + Site |
| **4 — Acervo e licenças** (2 semanas) | Música global e publicidade privada | Música global liberada somente após validação de direitos, spots e vídeos privados por cliente; autorização de reprodução, migração controlada de mídia pública legada, compatibilidade do Player; segurança e QA. | API + Admin/Player |
| **5 — Distribuição** (2 semanas) | Publicação direcionada sem playlist manual por destino | Motor de segmentação por cliente, agência, categoria, unidades e toda a rede (somente Master), simulação de elegibilidade, contratos e reserva, fan-out por referência com idempotência, programações e retirada auditável. | API + Admin/Player |
| **6 — Estúdio simples** (2 semanas) | Criar e publicar anúncio de Rádio ou TV com poucos passos | Criativo por imagem/vídeo/áudio, modelos/texto/música licenciada, prévia fiel às capacidades reais do Player, autosave, fluxo criar → destinos → programação → revisão, QA mobile. Alvo UX: publicação simples em até 2 min após selecionar mídia. | Admin + API + Player |
| **7 — Players e comprovação** (2 semanas) | Reprodução e prova de veiculação verificáveis | Homologação TV/Rádio em dispositivos reais, sync/offline/retomada, confirmação idempotente de exibição, distinção entre publicação/recebimento/exibição, segurança de links e métricas confiáveis. | API + Admin/Player |
| **8 — Comercial e estabilização** (2 semanas) | SaaS demonstrável para agência e estabelecimento | Onboarding do site, planos com dados reais, relatórios por agência/cliente, pareamento assistido, documentação operacional, testes E2E de venda → player → faturamento → comprovação, acessibilidade/mobile e fechamento de defeitos. | Todos |

**Cerimônias e regras:** no planejamento de cada sprint registrar objetivo, tickets/marcos envolvidos, responsável, dependências, estimativa por esforço, critério de aceite e riscos; checkpoint curto durante a execução; ao final apresentar demonstração do fluxo real, PRs **não draft**, testes reproduzíveis, revisão de bloqueios e retro curta. Não misturar PR de produto incompleto com afirmação de homologação. Preferir PRs pequenos e revisáveis (até cinco arquivos por PR quando viável), sem sacrificar integridade transacional e migrations relacionadas.

**Definição de pronto (DoD):** código integrado ou PR definitivo claramente identificado; controle de escopo/tenant/plano; PHPUnit (unitário + Feature/controller) e casos negativos; migração/seed validado no MySQL real quando houver mudança de BD; documentação L5 Swagger/contrato atualizada; lint/build React, UX mobile, regressão, segurança e CI verde; Player físico validado quando afetado. **Código escrito e PR aberto ≠ sprint homologada**; indicar separadamente implementação, testes/CI, homologação e deploy.

**Relatório ao fechar cada sprint:** objetivo, marcos concluídos com evidência, PR/commit, falhas abertas, percentual matemático de marcos `[x]` sobre total do roadmap e escopo planejado para a sprint seguinte. Impedimentos de ambiente/CI são registrados antes de iniciar novas frentes críticas.

**Decisão de segurança:** `php artisan migrate:fresh --seed` apaga dados; utilizar apenas base descartável de desenvolvimento ou homologação isolada e confirmada, com backup quando aplicável; jamais aplicar automaticamente em produção. Refatoração de migrations existentes exige revisão de compatibilidade e plano de restauração dos ambientes com dados.

### Decisão de produto — planos de agência em pacote ou sob demanda (aprovada em 15/10/2026)

**Modelo de precificação único, configurável pelo Master, sem dois motores financeiros:**
- **Pacote fixo:** limite de clientes ativos contratados (exemplos configuráveis: 10, 50, 100); mensalidade combinada e tratamento contratual para vagas não usadas. Exemplo ilustrativo: 10 clientes / R$ 500/mês.
- **Sob demanda (pay-per-active-client):** agência habilita gradualmente clientes, sem pacote inicial obrigatório; mensalidade proporcional ao número de clientes ativos faturáveis, por preço unitário vigente (exemplo **não aprovado**: R$ 55 a R$ 60 por cliente/mês). Quantidade não limitada por um pacote, mas sujeita a governança/antifraude e limites técnicos previamente definidos.
- **Métrica de cobrança:** cliente ativo faturável é uma organização da carteira da agência com **serviço/assinatura Indoor ativo e habilitado** no ciclo; lead/cadastro sem ativação não gera cobrança. Contar a mesma organização apenas uma vez por agência e ciclo mesmo quando houver várias TVs/rádios, salvo adicionais previstos em contrato. Situações de suspensão/inadimplência, período de tolerância e desativação devem ter regras explícitas, sem exclusão de dados.
- **Fatura auditável e previsível:** armazenar política/preço/versionamento vigentes, ciclos e eventos de ativação/desativação, snapshots do consumo, prévia antes da contratação, pró-rata quando ativação ou troca ocorrerem no meio do ciclo, política de arredondamento DECIMAL e impostos/termos conforme contrato. Garantir idempotência em reprocessamentos e webhooks, sem cobrar duas vezes; usar domínio financeiro já existente, sem duplicar recebíveis.
- **Troca de modalidade:** pacote ↔ sob demanda, mantendo clientes, mídia, dispositivos e campanhas; mostrar impacto na próxima fatura antes de confirmar; decidir corte/pró-rata e tratar clientes acima da capacidade na passagem para pacote sem desativação silenciosa.
- **Experiência:** painel Master administra ambos os modelos, preços, vigência, regras, campanhas/descontos e auditoria; agência vê ativos faturáveis, uso, previsão da fatura, histórico, opção de alterar e recomendação de economia (sem trocar automaticamente); Site só divulga preços realmente publicados pela API.

**Aceite transversal:** autorização Master/Agência e plano ativo; testes de 0, 1, 10, 11 e 50 clientes, múltiplos serviços para a mesma organização, alteração de preços futura, ativação no meio do ciclo, reversão, concorrência, duplicidade de eventos, acesso cruzado entre agências, cancelamento e inadimplência. Documentar os endpoints no L5 Swagger, executar PHPUnit contra MySQL 8 e homologar com faturas simuladas antes de conectar a cobrança real. **Não considerar implementado apenas por constar no roadmap.**

### Marco novo de responsabilidade do Site — cobrança híbrida (pendente)

- [ ] **P1 · Oferta de agência com pacote ou sob demanda.** Exibir preços e franquias autorizados pelo catálogo da API, simular custo conforme clientes ativos sem prometer valores ilustrativos, explicar métrica/pró-rata/adesão e enviar ao fluxo de contratação com QA mobile/acessibilidade.

**Contagem nova nesta seção: +1 tarefa [ ] Site.**

## Diretriz transversal de UX/UI — espaço de trabalho orientado a tarefas (planejado em 15/10/2026)

**Objetivo:** preservar a identidade visual Metronic/React, sem copiar o visual do Instagram, e aproximar a **simplicidade de interação** de publicações sociais. Substituir excesso de caminhos técnicos por ações de negócio sem esconder recursos avançados: criação, prévia, escolha dos destinos, programação, publicação e acompanhamento. Aplicar a todos os perfis sob controle real de papel, tenant, plano ativo e concessões; não usar apenas a ocultação de menus como autorização.

**Arquitetura de experiência por perfil (mesma aplicação, contexto diferente):**
- **Master:** central executiva com agências, clientes diretos e vinculados, assinaturas/faturamento, campanhas, dispositivos de toda a rede e pendências com ação auditável; seleção explícita de agência/cliente/destino, prevenção de ações globais acidentais.
- **Agência:** espaço de operação com troca rápida de cliente autorizado (sem logout e sem mistura de dados), campanhas/publicações, playlists e dispositivos do cliente ativo, avisos do plano e faturamento; ação primária `Criar publicação`.
- **Estabelecimento:** início enxuto: `Criar anúncio` (quando plano permitir), `Minhas TVs/Rádios`, `Minha programação`, `Resultados`. Recursos técnicos avançados recolhidos em contexto, com estado vazio explicativo e ajuda no primeiro uso.

**Padrão de interação e componentes:** design system reutilizável sobre os componentes existentes do Metronic, com tokens para tipografia, cores, espaçamento, densidade compacta, botões/campos, estados focus/hover/disabled/loading/success/error, skeleton de carregamento, empty state, erro com recuperação, confirmação de ação destrutiva, toasts discretos, busca/filtros persistentes, breadcrumb contextual, atalhos por ação, upload com progresso e autosave com indicação visível. Tabelas para análises detalhadas; cards/miniaturas para campanhas e mídias; calendário visual para agendamentos; status atualizado e prévia fiel do Player para TVs horizontal/vertical e Rádio. Nunca simular exibição confirmada quando há apenas programação ou sincronização.

**Navegação:** menu lateral adaptativo, sem telas redundantes, agrupamento por fluxo de trabalho (`Publicar`, `Campanhas`, `Programação`, `Dispositivos`, `Clientes`, `Resultados`, `Financeiro`, conforme permissões), botão primário de publicação; preservar acesso às funções especializadas Rádio/TV no contexto correto. Seletor de cliente/agência persistente e claramente identificado em cada tela; alternar contexto invalida/atualiza consultas, formulário e rascunhos com isolamento de dados.

**Acessibilidade, responsividade e desempenho:** mobile-first e refinamento de desktop, breakpoints verificados em 320/360/375/768/1024/1440 px, sem overflow horizontal inadvertido; navegação por teclado e leitor de tela, contraste, foco visível, alvos de toque adequados, design claro/escuro reais, pt-BR e UTF-8. Evitar telas brancas/pretas sem feedback; não bloquear interface durante buscas nem travar em erro de rede; implementar feedback otimista **somente quando reversível e autorizado**.

**Metas verificáveis de UX (a validar com testes de usuários reais):**
1. Uma pessoa iniciante publica anúncio simples em até **2 minutos após selecionar a mídia**, tendo plano e destinos habilitados; fluxo de criação unificado `Criar → Destinos → Programar → Revisar/Publicar` com pré-visualização e salvamento de rascunho.
2. Agência troca para um cliente autorizado em até **2 interações principais**, com indicação inequívoca do contexto atual, sem recarregar toda a aplicação nem mostrar mídias de outros clientes.
3. Tarefas comuns (`Criar publicação`, consultar dispositivos e programação) acessíveis diretamente no dashboard adequado, sem exigir navegar por bibliotecas técnicas.
4. Alertas acionáveis de TV/Rádio offline, campanha a vencer e publicação pendente, com contagens e vínculos **obtidos por API sob permissão**; mostrar status `programado`, `recebido pelo Player`, `exibido` separadamente.
5. Testes automatizados de menu/RBAC/contexto, smoke test responsivo e acessibilidade, QA humano Master/agência/estabelecimento e telemetria de conclusão/erros sem dados sensíveis. Sem homologação, não marcar [x].

**Distribuição por sprints:** Sprint 0 inventaria fluxos, telas redundantes e jornada com usuário; Sprint 1 estabelece tokens/componentes e padrão de estados; Sprint 2 entrega navegação e espaços por papel com seleção de cliente/tenant; Sprint 5 valida destinos/publicação e contexto de agência; Sprint 6 entrega Estúdio intuitivo; Sprint 7 conecta estados reais do Player; Sprint 8 executa testes de usabilidade/acessibilidade, performance e ajustes de conversão. Em caso de capacidade insuficiente, repartir marcos na revisão da sprint, sem declarar conclusões fictícias.

### Critérios de aceite do Site — identidade visual e conversão (sem marco adicional)

**Aplicar aos marcos já previstos de oferta e onboarding:** identidade visual consistente com a experiência Metronic sem replicar um painel administrativo; proposta de valor por perfil, demonstração real de fluxo `Criar publicação`, planos/tarifas/quotas vindos da API, CTAs claros e formulários enxutos. QA 320–1440 px, acessibilidade, performance, estados de erro/carregamento, segurança de consentimento e métricas de conversão. Não prometer Estúdio, Player ou funcionalidades ainda não homologadas. **Contagem adicional: zero;** os marcos comerciais existentes cobrem a entrega.

## Fase 9: Experiência de publicação intuitiva, governança SaaS e distribuição inteligente (escopo aprovado em 15/10/2026)

**Objetivo do produto:** transformar o Meu Comercial em uma plataforma SaaS fechada de criação, distribuição e monetização de Rádio/TV Indoor, com a facilidade de publicação de Instagram/Facebook e recursos visuais do Canva, **sem** transformá-la em rede social pública. Esta fase desdobra requisitos específicos ainda não integralmente atendidos pelas Fases 4, 5, 6 e 7; não substitui nem dá aceite automático aos marcos anteriores. **Estado: planejada; nenhum dos marcos abaixo está concluído.**

**Papéis e hierarquia de escopo:**
- **Fundador / Super Admin:** controle integral de agências, clientes próprios ou de agências, tenants, planos, permissões, mídia, campanhas e todos os dispositivos. Pode selecionar toda a rede (inclusive clientes subordinados a agências), segmentos comerciais ou destinos individuais; ações globais exigem prévia de impacto, confirmação e auditoria. A autoridade administrativa não elimina direitos autorais, contratos e exigências legais.
- **Agência (ex.: MS Produções):** possui seu próprio âmbito de gestão e migração de carteira; pode operar somente os estabelecimentos autorizados, delegar **apenas permissões que possui** e publicar simultaneamente para um, vários ou todos os seus clientes. Planos podem limitar a 10, 50, 100 ou outros números configuráveis de estabelecimentos, além de mídia/dispositivos.
- **Estabelecimento / cliente final:** acessa apenas suas unidades, rádios/TVs e mídias autorizadas; anúncios próprios, edições, publicação e gestão dependem de plano ativo e concessões explícitas. Pode contratar Rádio, TV ou ambos, com limites independentes de locais e dispositivos.
- **Anunciante terceiro:** papel contextual de Cliente 360º, eventualmente o mesmo CNPJ do estabelecimento; compra inserção contratada na rede permitida. Titularidade do criativo, autorização de uso, execução e faturamento não devem ser confundidos com assinatura do estabelecimento.
- **Três controles cumulativos para cada ação:** escopo/hierarquia (tenant, agência, cliente e destinos) + concessões RBAC sem escalada + direitos do **plano/assinatura ativa** (inclusive free/freemium). Cadastro sem plano ativo não habilita operação; plano gratuito ativo também vale, sujeito a cotas. Definir política explícita para inadimplência, tolerância, suspensão e preservação dos dados. Não utilizar somente botões ocultos como controle de acesso.

**Política de conteúdos:**
- **Música:** catálogo lógico global único, compartilhado por master, agências e estabelecimentos, inclusive quando o upload é feito por uma agência ou cliente **que tenha permissão**. Não duplicar arquivos por tenant; validar licença, metadados, segurança e estado de disponibilidade antes de liberar a todos.
- **Spot/jingle comercial, vídeo publicitário e peça de campanha:** conteúdo privado do proprietário (cliente/agência autorizada), invisível a outros tenants sem concessão. Distribuir para vários destinos **não transfere titularidade nem abre a biblioteca**; o Player recebe apenas os ativos estritamente autorizados, com expiração e revogação.
- **Acordos comerciais:** estabelecer quem pode vender ou publicar publicidade em cada local/dispositivo, conforme contrato; separar receita de assinatura do estabelecimento de receita de publicidade do anunciante, sem duplicar recebíveis.

**Experiência-alvo de publicação (mesma jornada para Rádio e TV, adaptada ao formato):** 
1. **Criar:** escolher foto, vídeo ou áudio, gravar/enviar, recortar, selecionar modelo, inserir texto, figurinhas, música licenciada, narração/spot, efeitos e transições suportados; pré-visualização fiel em horizontal/vertical e versionamento do rascunho.
2. **Público e destinos:** selecionar um, vários, todos os clientes da agência, categoria de negócio (padarias, supermercados, academias), locais/unidades ou, **somente master**, toda a rede inclusive agências. Mostrar contagem obtida por API, restrições contratuais, permissões e dispositivos elegíveis, sem exigir IDs manuais; oferecer simulação antes de distribuir.
3. **Quando e quanto:** publicar já ou agendar datas, horário, frequência, campanha, orçamento/inventário reservado e duração; validar cotas e conflitos, sem inserir anúncio automaticamente em grade incompatível.
4. **Revisar e publicar:** mostrar criativo, destinos reais autorizados, cobrança/termos se aplicável e programação; confirmar, criar versão única do criativo e referências por destino com idempotência e auditoria; permitir retirar, acompanhar sincronização e distinguir **publicado**, **recebido pelo Player** e **realmente exibido**.

**Princípios de UX e arquitetura:** fluxo progressivo sem estética de formulário/Wizard rígido; modo **Simples** com poucas decisões e modo **Avançado** para agências, autosave, modelos, arrastar/soltar quando aplicável, ações reversíveis, mensagens claras, pt-BR, mobile-first, dark/light, acessibilidade, performance e ausência de formulários com IDs técnicos. Referência de UX: teste com usuários novos para concluir a publicação simples em até 2 minutos após escolher a mídia, **sem sacrificar validações legais/comerciais**. Reutilizar API Laravel/MySQL, React/Metronic, Cliente/Contrato 360º, planos, assinaturas, recebíveis, biblioteca e Player existentes; não criar módulos duplicados. Processar segmentação/contagem, regras e operações em lote no servidor; evitar duplicação de blobs ao distribuir para milhares de dispositivos.

**Ordem de entrega e critérios de aceite inter-repositórios:** (P0) contratos de escopo, plano, RBAC e biblioteca; (P0) engine de segmentação/reserva/distribuição e validação dos Players; (P1) Estúdio Simples Rádio/TV e publicação guiada; (P1) modo Avançado, self-service e pareamento; (P1) comprovação de exibição, relatórios e otimização de conversão. Exigir Swagger/OpenAPI, isolamento por tenant, testes automatizados de elevação de permissão, cotas e concorrência, QA UX mobile/desktop, CI verde e homologação física. Publicação global só após revisão do impacto e política contratual. **Planejamento não equivale a implementação ou produção homologada.**

### Marcos adicionais de responsabilidade deste repositório (SITE)

- [ ] **P1 · Oferta SaaS por público e catálogo de planos real.** Explicar jornadas Estabelecimento, Agência e Anunciante; exibir funcionalidades e cotas aprovadas de free/freemium/pagos consultadas de fonte autorizada, CTAs coerentes e demonstração honesta do Estúdio/Publicação Simples, sem inventar alcance ou preços.
- [ ] **P1 · Onboarding comercial e conversão segura.** Orientar cadastro de agência/estabelecimento/anunciante para plano e contrato ativo antes de operação, com convite de agência e importação assistida de carteira; consentimento LGPD, antispam, UTM, telemetria de conversão, SEO/acessibilidade e QA mobile-first.

**Critério de contagem:** 2 novos marcos **[ ]** desta responsabilidade; dependências dos demais repositórios são descritas acima, mas contabilizadas uma única vez no roadmap correspondente. Nenhum recurso desta seção foi aceito apenas por estar planejado.

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

## Refatoração de bibliotecas de áudio globais e exclusivas — 14/10/2026

**Status:** implementação incremental em PRs definitivos, **não homologada**. Auditoria identificou que o domínio global/privado já existia na `main`: tabelas `musics` (title, artist, album, genre, duration_seconds, bpm, s3_key_path, is_active, direitos/licença), `commercial_spots` (tenant_id agência, client_id supermercado, tipo, validade, S3), fonte de áudio tipada em playlists Rádio e camadas `background/voiceover` de TV. **Não** criar segunda biblioteca, nem migrar/promover conteúdo legado automaticamente.

- **API:** [PR #30](https://github.com/paulodias-dev/meucomercial-api/pull/30) — refatoração `AudioAssetAccess::agencyForBrowsing` com tenant ativo e membership JWT, filtros SQL por agência nas playlists (inclusive aquelas só com Music global), programações de Rádio/TV e acervo histórico client-scoped; portal cliente só lista spots próprios vigentes. Migração MySQL incremental com FK composta `commercial_spots(tenant_id,client_id)` → vínculo agency-client, CHECK exclusivo entre media_asset_id vs source type/id e CHECK de papel de áudio TV. Pré-validação de históricos inconsistentes e testes de acesso cruzado na `AudioAssetIsolationTest`. Documento `docs/audio-asset-tenancy-architecture.md` atualizado.
- **Admin:** [PR #21](https://github.com/paulodias-dev/meucomercial-admin/pull/21) — seleção de agência por nome e propagação segura de `X-Agency-Tenant` para listagens, upload legado, playlists, Rádio, TV/Story Builder e agendamentos; serviços de API deixam de misturar filtro de agência com query string. Nenhum usuário digita tenant_id ou client_id em formulário.
- **Site:** [PR #8](https://github.com/paulodias-dev/meucomercial-site/pull/8) com revisão documental sem endpoints públicos novos: música global e spot privado continuam disponíveis **somente** por JWT/backoffice/Player autorizados; não tornar S3 público nem servir spots por URLs permanentes.

**Política de segurança:** Music é catálogo global apenas de leitura para usuários autenticados; Playlist, Schedule, MediaAsset legado e CommercialSpot **não são globais**. Spot pertence estritamente ao par agência/cliente; as decisões de autorização são tomadas pela API, não pelo header. O JWT de Player resolve o cliente independente do header do navegador. Spot promocional inválido/expirado não aparece no portal cliente.

**Bloqueadores:** `TENANCY_ENABLED=false` é o default do sistema legado; a refatoração não autoriza ativá-la em produção sem migrar/instrumentar tenants, memberships e outros módulos do SaaS. A dependência S3 foi referenciada no Composer, porém o `composer.lock` permanece sem regeneração verificada, o que **impede deploy confiável de uploads/URLs assinadas**. Não houve execução PHPUnit, MySQL migration, build Vite ou testes físicos do Player; GitHub Actions não consultado a pedido.

**Aceite pendente:** executar preflight sobre dados reais; ensaiar migration e constraints MySQL 8; regerar `composer.lock` em ambiente com Composer e realizar testes de URL temporária, MIME, licença, revogação, expiração e composição real de áudio na TV. Validar multi-tenant pleno antes de distribuir a agências. Os marcos abrangentes continuam parcialmente aceitos; **nenhum `[x]` adicional** atribuído sem QA.

**Progresso global preservado:** API **17/40 = 42,5%**, Admin **16/37 = 43,2%**, Site **8/31 = 25,8%**; plataforma **41/108 = 38,0%**.

**Próxima entrega:** migração assistida de mídias legadas com inventário de licenças/deduplicação SHA-256 sem conceder acesso cruzado, seguida de homologação MySQL/S3 e sincronização das camadas sonoras com o Player de TV.

## Entrega de refatoração UI/UX — TV Indoor e Áudio Indoor (14/10/2026)

**Escopo implementado nas branches de PR**, ainda pendente de homologação e merge. A alteração estrutura a plataforma por contexto operacional, sem remover dados, dispositivos ou funcionalidades comerciais existentes.

**API:** [PR #31](https://github.com/paulodias-dev/meucomercial-api/pull/31)
- KPIs completos via agregação SQL (total, online, offline, TV, áudio, locados, disponíveis) com filtros antes da paginação; não usar apenas primeira página.
- Tipos físicos **compatíveis** com os Players: `tv_app` / `radio_app`; orientação TV horizontal/vertical persistida em `metadata.orientation`. Impede troca de tipo após pareamento.
- Migração `indoor_devices.rental_status` com `available|rented|null`, independente de `hardware_type` e do faturamento; registros legados não são classificados artificialmente.
- Cadastro, edição e PIN com código/MAC, local ativo do cliente, assinatura, orientação e metadados preservados. Segurança, RBAC e scoping agência/cliente no controller quando `TENANCY_ENABLED=true`; Swagger e testes `IndoorDevicesWorkspaceTest` adicionados.
- Contrato técnico e limitações em `docs/indoor-device-tv-radio-ux.md`.

**Admin:** [PR #22](https://github.com/paulodias-dev/meucomercial-admin/pull/22)
- Sidebar substitui o grupo genérico poluído por **TV Indoor** (Dashboard, Dispositivos, Story Builder/Anúncios, Grades e Agendamentos) e **Áudio Indoor** (Dashboard Rádio, Bibliotecas, Playlists, Grades e Players de Som).
- Dispositivos são exibidos em listagem limpa: KPI real, filtro de tipo/conexão/cliente/local/comercial, busca por MAC/código, paginação, RBAC e ações editar/sincronizar/bloquear/excluir. Cadastro e pareamento por PIN disponíveis somente por modal.
- Formulário registra TV horizontal/vertical, som, nome, código/MAC, cliente, local, assinatura, observações, propriedade e situação comercial. Toast, React Query invalidation e auto-refresh de conectividade a cada 30 segundos.
- Unidades/ambientes, equipamentos patrimoniais, inventário publicitário e ordens deixam de poluir a Sidebar: acesso contextual dentro da gestão de dispositivos; rotas anteriores continuam válidas.
- Novo editor de sequência Story Builder organiza imagens/vídeos e orientação, prévia visual do arquivo, e abre editor já existente de trilha/locução. **Canvas drag-and-drop com templates, layout versionado e preview fiel no Player TV continuam pendentes**.

**Site:** somente alinhamento documental; não expor métricas, Players ou acervos privados à landing pública.

**QA e aceite:** a entrega não equivale a publicação final. Validar manualmente mobile/tablet/desktop, paginação com milhares de registros, renovação heartbeat, permissões restritas, contrato e vínculo patrimonial, URL do Player TV/Rádio, build TS/Vite, migração e PHPUnit em homologação. Não foram executados GitHub Actions por solicitação. A tenancy global continua parcialmente pendente, independentemente do guard específico dos dispositivos.

**Progresso geral preservado até homologação:** API 17/40 (42,5%) + Admin 16/37 (43,2%) + Site 8/31 (25,8%) = **41/108 (38,0%)**; não marcar os marcos de Story Builder completo / Player real como prontos.

**Próxima entrega:** Canvas real do Story Builder (templates, drag-and-drop, múltiplas camadas, prévia executável e versionamento), com testes de manifesto/sincronização; depois aprimorar filtros e multi-tenant canônico dos módulos de patrimônio e locais.

## Entrega incremental concluída em código — Canvas Visual TV (14/10/2026)

**API:** [PR #33](https://github.com/paulodias-dev/meucomercial-api/pull/33). Salva layout visual de item de TV no JSON existente `IndoorPlaylistItem.metadata.story_layout`, com texto/faixas, no máximo 12 camadas, coordenadas normalizadas, validação estrita, RBAC `indoor_playlists.update`, escopo de agência/cliente e controle de concorrência por `expected_revision` (409). O item mantém identidade mesmo com reordenação: atualização transacional de posições sem violar unique, camadas de áudio preservadas a partir dos dados enviados e descarte de cena somente por consentimento explícito. Cobertura de testes escrita em `IndoorTvStoryLayoutTest`; não executada aqui.

**Admin:** [PR #24](https://github.com/paulodias-dev/meucomercial-admin/pull/24). Componente `TvStoryCanvas` responsivo com textos/faixas arrastáveis via Pointer Events, suporte teclado, edição de posição/tamanho/cores/alinhamento, orientação TV horizontal/vertical, preview editorial de imagem/vídeo e salvamento independente versionado. Edição habilitada após salvar a sequência; exclusão de composição exige confirmação. Não duplica mídia e mantém links de trilha/locução existentes.

**Site:** apenas documentação de dependência. Não apresentar canvas, contratos, arquivos ou playlist privada como dados públicos; eventual demonstração pública exige DTO sem mídia privada e revisão de direitos.

**Limite explícito:** a composição salva é **rascunho administrativo**, não um layout publicado. Permanecem pendentes renderização pelo Player, templates reutilizáveis, animação, versionamento de publicação, compatibilidade offline, aprovação, programação e prova de exibição. Não houve compilação Vite, PHPUnit/MySQL ou validação do Player; GitHub Actions não foi utilizado, conforme solicitação.

**Novo marco granular desta entrega:** 1 no API e 1 no Admin, adicionados e marcados `[x]` na Fase 5. Os marcos abrangentes do Story Builder continuam `[ ]`. Base anterior 41/108, acrescida de 2 tarefas novas implementadas: **43/110 = 39,1%** (marcos com evidência de código, não homologação), API **18/41 = 43,9%**, Admin **17/38 = 44,7%**, Site **8/31 = 25,8%**.

**Próximo passo:** composição de templates com blocos reutilizáveis e renderização fiel pelo Player de TV usando um manifesto versionado, com validação de licenças/tenancy e homologação real antes de publicar campanhas.

## Entrega de templates editoriais reutilizáveis de TV — 14/10/2026

- **API:** [PR #34](https://github.com/paulodias-dev/meucomercial-api/pull/34) — `indoor_tv_story_templates`, versão editorial imutável como snapshot de item já validado, lista paginada por cliente, exclusão preservando playlists, permissões JWT e guard agência/cliente no modo tenancy. Não duplica arquivo e não publica no Player.
- **Admin:** [PR #25](https://github.com/paulodias-dev/meucomercial-admin/pull/25) — salvar composição como template privado do cliente, listar/excluir e aplicar layout compatível com orientação ao canvas; reaproveita revisão otimista de salvamento da composição.
- **Site:** catálogo privado **não** disponível ao público, sem exposição de layouts, assets ou dados de clientes.
- **Aceite granular:** 1 novo marco concluído na API e 1 no Admin (ambos `[x]`), sem concluir o Story Builder completo, preview fiel do Player, publicação, transcodificação nem homologação. API **19/42 (45,2%)**, Admin **18/39 (46,2%)**, Site **8/31 (25,8%)**, plataforma **45/112 (40,2%)**.
- **Limites:** alterações em branches/PRs, não deploy. Migrations, PHPUnit, tsc/Vite e QA físico pendentes. GitHub Actions não consultado, conforme solicitado.
- **Próximo passo:** adicionar catálogo visual de templates com miniaturas, revisão de versão e uso controlado em novas peças; em seguida avançar no canvas de composição e execução real dos layouts pelo Player de TV.


## Entrega — Biblioteca visual versionada do Story Builder (14/10/2026)

**Escopo implementado em código, em PRs definitivos ainda sujeitos a revisão:**
- **API:** [PR #35](https://github.com/paulodias-dev/meucomercial-api/pull/35), branch `feat/tv-story-template-library-20261014` — PATCH de template por cliente com lock transacional e `expected_revision` (409 em conflito); alteração de nome ou sincronização a partir de cena TV salva, preservando orientação, autorização, mídia e playlists; migration reversível de revisão, Swagger e testes de regressão.
- **Admin:** [PR #26](https://github.com/paulodias-dev/meucomercial-admin/pull/26), branch `feat/tv-story-template-library-20261014` — catálogo de templates com miniaturas das camadas, pesquisa e paginação no servidor, revisão visível, renomear, atualizar a partir da cena e aplicar no canvas sem duplicar imagens/vídeos; responsivo e pt-BR.
- **Site:** [PR #12](https://github.com/paulodias-dev/meucomercial-site/pull/12), branch `docs/tv-story-template-library-20261014`, atualização apenas documental do indicador geral; biblioteca permanece privada, sem endpoints públicos, URLs de S3, anúncios de campanhas publicadas ou conteúdo do cliente em landing page.

**Commits de referência (implementação):** API controller `13d4b8169`, testes `5d99797a9`; Admin galeria `a09fa473c`, fluxo do editor `90827e945`; Site sincronização documental `e49265dda`. As branches continuam em PR para revisão, sem alteração direta da produção.

**Aceite dos marcos desta entrega:** um marco granular novo concluído em código na API e um no Admin, adicionados à Fase 5, **sem concluir os marcos amplos do Story Builder/Player**. API **20/43 (46,5%)**, Admin **19/40 (47,5%)**, Site **8/31 (25,8%)**; plataforma **47/114 = 41,2%**. A referência anterior era **45/112 = 40,2%**. O novo denominador inclui os dois novos marcos entregues, não houve encerramento artificial de fases.

**Validação:** testes de API foram acrescentados, mas PHPUnit, migração MySQL, Swagger gerado, TypeScript/Vite, teste de integração entre repositórios e homologação do Player **não foram executados** no ambiente desta entrega. Não autorizar deploy por este registro. Alteração do catálogo nunca publica layout em dispositivo, e miniatura editorial não equivale à renderização real no Player.

**Próximo passo:** completar publicação versionada e manifesto do Story Builder no Player de TV, com autorização de cliente, compatibilidade de dispositivo e testes de sincronização/expiração; resolver CI e homologar a execução antes de declarar o módulo concluído.


## Entrega concluída em código — publicação versionada Story Builder TV (14/10/2026)

**Implementação funcional nos PRs definitivos ainda sujeitos a revisão de CI:**
- **API [PR #36](https://github.com/paulodias-dev/meucomercial-api/pull/36):** publicar/retirar layouts de TV via API autenticada, snapshot imutável em relação a edições posteriores do rascunho, revisão otimista por playlist e item (409), transação e validação de mídia pronta e pertencente ao cliente, agência/RBAC, playlist ativa; migration reversível, OpenAPI, testes de Player/concorrência/escopo, atualização do manifesto e sinalização de sincronização somente dos dispositivos TV vinculados. Ao publicar, as revisões salvas são congeladas sem alterar a mídia original. Bloqueio de mudanças estruturais na sequência enquanto existir publicação — exige retirada explícita antes.
- **Admin [PR #27](https://github.com/paulodias-dev/meucomercial-admin/pull/27):** controles Metronic de publicar e retirar, confirmação, status da versão, detecção de alterações em rascunho, consulta da versão editada e retorno de número de telas solicitadas para sincronização. Não permite publicar enquanto a sequência tiver mudanças não salvas ou alterar ordem/orientação sem retirar versão ativa.
- **Site:** sincronização documental. O site público não recebe JWT, mídia privada, URLs permanentes, layout editorial nem APIs de publicação.

**Novo marco granular:** um concluído em código na API e um no Admin (Fase 5); nenhum marco amplo de execução/homologação do Player foi encerrado. API **21/44 = 47,7%**; Admin **20/41 = 48,8%**; Site **8/31 = 25,8%**; plataforma **49/116 = 42,2%** (matemática: 49 ÷ 116 × 100 = 42,24137931…%). Referência anterior **47/114 = 41,2%**. Inclui PRs definitivos ainda não integrados, não é percentual de produção.

**Limites e critérios de aceite:** o manifesto fornece contrato aditivo `story_layout`, revisão e versão da publicação apenas para TV com orientação compatível; não existe nesta entrega prova de renderização real das camadas na aplicação Player, cache offline, execução de animações/áudio mixado nem evidência de instalação física. Falhas de CI anteriores são conhecidas; PHPUnit, migração real MySQL, build TypeScript/Vite e Player físico ainda requerem verificação. Não declarar a fase TV homologada sem testes e execução.

**Próximo passo:** implementar ou adaptar o aplicativo Player TV para renderizar as camadas publicadas e reconciliar confirmação de sincronização por versão, com comportamento offline seguro. Em paralelo, resolver CI API/Admin e testar bloqueios/escopo em MySQL 8 e aparelhos de diferentes orientações.

## Entrega de código — Player TV web e protocolo de sincronização v2 (15/10/2026)

**Implementações verificáveis nos PRs definitivos:**
- **API [PR #37](https://github.com/paulodias-dev/meucomercial-api/pull/37):** `POST /api/v1/player/sync-result-v2`, autenticado por token de dispositivo, validação transacional de `manifest_version`, playlist da grade atual, `story_publication_version`, estado financeiro/dispositivo e resultado de sincronização; registros de sucesso/falha e reconciliação sem aceitar confirmações antigas. Preserva endpoint legado, inclui OpenAPI e testes de regressão.
- **Admin [PR #28](https://github.com/paulodias-dev/meucomercial-admin/pull/28):** novo Player TV estático para navegadores (`public/indoor-player/`), implantação preferencial em origem exclusiva; pareamento por PIN, manifesto TV, imagem/vídeo em sequência, layouts publicados de texto/faixa em 16:9/9:16, expiração/bloqueio com suspensão, heartbeat, sincronização v2, tela cheia, desvinculação e validação estrita de mídia/esquema. Testes `node:test`, workflow e manual `docs/player-tv-browser.md`.
- **Site [PR #14](https://github.com/paulodias-dev/meucomercial-site/pull/14):** apenas atualização documental do progresso; sem exposição de conteúdo privado ou token de Player para visitantes.

**Commits de implementação:** API `93c5a89` (sync v2) e `76ff440` (testes); Admin `f58aaed` (Player, orientação e carregamento), `a722cdd` / `d6a5691` (contrato de manifesto), `357c019` (testes Node), `ff44527` (manual). Site `3b2e697` (roadmap). Commits de documentação complementares nas branches não são evidência de homologação.

**Marcos desta entrega:** 1 novo marco de implementação na API + 1 no Admin (Fase 5). API **22/45 = 48,9%**, Admin **21/42 = 50,0%**, Site **8/31 = 25,8%**. **Plataforma 51/118 = 43,2%**, contra 49/116 = 42,2% na base anterior. O denominador cresceu apenas com os dois marcos efetivamente implementados; não concluir integralmente o Story Builder, Player nativo nem homologação de produção.

**Segurança/limitações:** o Player web é online e reproduz vídeo mudo para permitir autoplay; ainda não executa trilha/locução sincronizadas, provas de exibição, cache offline, DRM/licenças, cobrança nem Player Android nativo. Token local requer hospedagem em origem exclusiva e revogação administrativa. O `sync-result-v2` indica aplicação da cena inicial, não prova de veiculação ou download completo. **Não** elevar o progresso por workflows falhos.

**Validação:** sintaxe JavaScript dos módulos confirmada por compilação na sessão e 6 verificações diretas de validação de camadas passaram (não equivalem ao teste completo de navegador). O GitHub Actions registrou falha nas execuções Laravel, Metronic e no novo workflow Node, sem logs/etapas consultáveis nesta sessão. PHPUnit, MySQL, build Vite/TS e testes Node em runner/browsers físicos continuam **sem evidência verde**. Revisão de PR não equivale a homologação.

**Próximo passo:** testar fim a fim em TV real com ambiente TLS/CORS e URLs acessíveis; fortalecer segurança do token do Player e implantar cache offline com expiração fail-closed e execução de áudio/mixagem em hardware suportado. Corrigir os bloqueios do CI (incluindo lockfile Composer/S3) antes do deploy.

## Entrega de código — resiliência de Player TV e cache volátil com lease (15/10/2026)

- **API [PR #38](https://github.com/paulodias-dev/meucomercial-api/pull/38):** `IndoorManifestService` emite `server_time`, `refresh_after` e `playback_lease_seconds=45` para manifesto ativo, sem grade e bloqueado. O Player pode calcular validade sem depender do relógio incorreto do aparelho. Regressão Laravel para os três estados. Revogação e alteração de agenda não são garantidas em tempo real: a reprodução é interrompida no máximo ao final do lease anterior.
- **Admin/Player [PR #29](https://github.com/paulodias-dev/meucomercial-admin/pull/29):** pré-carregamento e cache **somente em RAM** de imagens TV com teto global de 20 MiB, 6 MiB por imagem e cinco imagens; download em streaming sujeito a aborto/timeout, rotação por versão, expiração e revogação imediata do object URL; guarda temporal adicional monotônica, relógio de servidor, atualização de URLs assinadas sem interromper vídeos, CSP ajustada para camadas editoriais tipadas e blobs locais; testes Node e manual atualizados.
- **Site [PR #15](https://github.com/paulodias-dev/meucomercial-site/pull/15):** sincronização dos roadmaps, sem distribuir qualquer token, mídia privada ou Player no site público.

**Marcos implementados nesta entrega:** +1 API, +1 Admin/Player (Fase 5). API **23/46 = 50,0%**, Admin **22/43 = 51,2%**, Site **8/31 = 25,8%**; **plataforma 53/120 = 44,2%**. O percentual mede marcos com código entregue em PR, não testes aprovados nem porcentagem de prontidão para produção.

**Aceite pendente:** CI do Laravel e Metronic, teste Node do Player em runner GitHub e homologação presencial de TVs. Não existe cache persistente: dados se perdem ao reiniciar e não se exibe conteúdo após o lease. Vídeo offline, mixagem de áudio, direitos de mídia, prova de exibição, proteção de token por origem dedicada e validação CORS/TLS ficam pendentes. Não considerar produção liberada.

**Próxima implementação:** corrigir falhas de CI e conectar URLs de mídia TV protegidas/assinadas com acessibilidade em navegadores e streaming HTTP Range; em seguida executar cenários completos de pareamento, interrupção de rede, assinatura expirada e troca de orientação em TVs reais.

## Entrega de código — links assinados e streaming HTTP Range para Player TV (15/10/2026)

- **API [PR #39](https://github.com/paulodias-dev/meucomercial-api/pull/39):** novos uploads TV (imagem/MP4) são salvos em disco privado; manifesto do Player oferece URL temporária assinada por `asset`, `device` e `manifest_version` por 70 segundos, sem token do dispositivo na URL. Endpoint binário revalida, por requisição inclusive `Range`, a assinatura, dispositivo e assinatura ativos, cliente, playlist agendada e versão atual. `BinaryFileResponse` suporta range/206; prévia de dois minutos é emitida somente em endpoints administrativos com permissão/agência. Testes de upload, expiração, adulteração de URL, bloqueio, mudança de grade, cliente cruzado e compatibilidade do legado. Swagger/OpenAPI de novas rotas.
- **Admin/Player [PR #30](https://github.com/paulodias-dev/meucomercial-admin/pull/30):** cache RAM por identidade do ativo para reutilizar a mesma imagem após renovação de URL assinada, com invalidação por manifesto/versão; erro de streaming de vídeo após carregamento ativa standby e reconsulta; regressão Node e manual TLS/CORS e rotas temporárias.
- **Site [PR #16](https://github.com/paulodias-dev/meucomercial-site/pull/16):** sincronização do indicador geral. Não expõe mídia, token do dispositivo ou serviços privados na landing page.

**Marcos desta entrega (código, não homologação):** um implementado na API e um no Admin/Player (Fase 5). API **24/47 = 51,1%**; Admin **23/44 = 52,3%**; Site **8/31 = 25,8%**. Global **55/122 = 45,1%** (55 ÷ 122 × 100 = 45,08196721…%). Referência anterior: 53/120 = 44,2%. CI verde e deploy não são premissas desses índices.

**Riscos de produção:** arquivos anteriores no disco `public` seguem acessíveis por seus links históricos; migração explicitamente planejada antes de alegar isolamento completo do acervo. `APP_URL` HTTPS, proxies TLS, CORS e URLs temporárias do Player precisam de validação em ambiente real. Prévia é capacidade temporária compartilhável até sua expiração. Não habilitar produção sem PHPUnit, build Metronic, teste Node, vídeo Range de MP4 e dispositivos homologados.

**Próxima etapa:** tratar os workflows GitHub Actions com falha e executar integração TV real; em seguida migrar mídias antigas do disco público com estratégia de rollback, proteção por link temporário e teste de não regressão em mídia, prévia e playlists.

## Entrega concluída em código — migração operacional TV legada e transparência no painel (15/10/2026)

**Implementação em PRs definitivos:**
- **API [PR #40](https://github.com/paulodias-dev/meucomercial-api/pull/40):** comando CLI `indoor:secure-tv-media` com inventário sem alteração por padrão, migração `--apply` por cópia verificada SHA-256 e tamanho para disco privado, `--inspect-private` para auditoria, retirada pública opt-in `--prune --confirm-public-links` e `--rollback` autenticado pela marca de migração. Bloqueia diretórios inválidos, symlinks/path traversal, arquivos compartilhados e dados divergentes. Processamento isolável por cliente/ID/limite, sincronização das TVs por cliente uma única vez no lote, testes de regressão e runbook.
- **Admin [PR #31](https://github.com/paulodias-dev/meucomercial-admin/pull/31):** biblioteca Metronic identifica status de armazenamento TV privado, público legado ou ausente, exibindo alerta de risco de links antigos em resultados. A API emite apenas `storage_visibility` no payload já protegido por RBAC/agência; hashes e metadados internos não aparecem no painel.
- **Site [PR #17](https://github.com/paulodias-dev/meucomercial-site/pull/17):** sincronização do roadmap sem mudanças funcionais públicas.

**Progresso matemático em código:** API **25/48 = 52,1%**, Admin **24/45 = 53,3%**, Site **8/31 = 25,8%**; total **57/124 = 45,96774193…% ≈ 46,0%**. Base anterior 55/122 = 45,1%; +1 marco API, +1 marco Admin. Estes índices incluem código em PR aberto sujeito a testes, não representam aceite de produção.

**Segurança e aceite:** a migração não foi executada em dados reais; os arquivos legados continuam públicos até `--prune`, feito apenas por operador com backup/snapshot e confirmação. Rollback reabre o URL público. Arquivos compartilhados/corrompidos exigem intervenção manual. GitHub Actions das últimas entregas falha em poucos segundos sem steps registrados e devolve log BlobNotFound; não é possível atribuir causalidade ao código nem afirmar CI verde. Exigir testes PHPUnit, build TypeScript e homologação em servidor/TV antes de realizar `--apply` ou `--prune`.

**Próximo passo:** obter diagnósticos do ambiente GitHub Actions (runners/permissões/quota/políticas) e restabelecer CI verificável; após homologação, executar piloto de migração por cliente, testar vídeo Range e imagem em TVs físicas e somente então retirar originais públicos com backup.
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
