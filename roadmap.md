## MACROENTREGA SITE — PROPOSTA INDOOR E MANIFESTAÇÃO DO SOLICITANTE (28/10/2026)

- [x] Apresentar proposta CRM vinculada pela API nos dois contextos: pedido recém-criado e /acompanhar.
- [x] Mostrar valor, prazo, escopo e itens de proposta, sem dados internos do Master.
- [x] Exigir opt-in e confirmação humana sobre ciência/interesse não vinculante.
- [x] Oferecer recusa explícita, sem cobrança ou assinatura.
- [x] Respeitar bloqueio de proposta retirada/expirada/modificada.
- [x] Enviar UUID idempotente, expected_version, proposal_version e token privado via BFF fixo.
- [x] Revalidar resposta canônica da API e atualizar status sem inventar pagamento.
- [x] Reutilizar código de acompanhamento do pedido, sem segredo em URL/storage.
- [x] Estender estados e testes Node no build; atualizar runbook.
- [ ] Checkout financeiro PIX e instrumentos contratuais dependem de próxima macro.

Dependência de merge: API de ponte CRM → Indoor antes deste Site.
Homologação e testes de execução separados do trabalho do MVP.
Documento: docs/SITE_INDOOR_PROPOSAL_ACKNOWLEDGEMENT_20261028.md

---

## MACROENTREGA SITE — PRÉ-CONTRATAÇÃO INDOOR E ACOMPANHAMENTO PRIVADO (28/10/2026)

- [x] Após lead confirmado e plano real selecionado, permitir uma segunda etapa pré-contratual opcional.
- [x] Gerar código secreto de 256 bits em memória do navegador, não armazenar em URL/cookies/storage.
- [x] BFF Express allowlisted com HTTPS, validação de método, UUID e segredo, sem redirects ou cookies.
- [x] Criar solicitação com UUID idempotente, lead_reference e novo aceite expresso de análise.
- [x] Exibir somente estado comprovado pela API; consultar status privado e cancelar pendente com CAS.
- [x] Copiar dados privados de acompanhamento somente por ação explícita; alertar sobre perda após recarga.
- [x] Preservar fluxo agência/anunciante sem simular contrato SaaS ou compra de mídia.
- [x] Testes Node de contrato incluídos no build e runbook separado.
- [ ] Checkout financeiro Indoor e ativação real de assinatura dependem de contrato e gateway específicos.

**Dependência:** mesclar API #193 antes de integrar esta branch. Baseline
documental de MVP: 79,1%, sem homologação; avaliação de avanço conjunto
deve ser feita após Site e Admin. Testes Node/TS/Vite/Chromium não executados.
Guia: docs/SITE_INDOOR_CONTRACT_REQUESTS_MVP_20261028.md

---

## MACROENTREGA SITE — JORNADA DE AQUISIÇÃO GUIADA (28/10/2026)

- [x] Criar /contratar para estabelecimento, agência e anunciante com etapas mobile-first.
- [x] Consultar preços e limites apenas do catálogo oficial de Serviço; nunca assumir checkout_available.
- [x] Selecionar ofertas públicas revisadas com filtros server-side e paginação real.
- [x] Invalidar seleção quando audiência, formato, região ou publicação mudar.
- [x] Enviar interesse por BFF same-origin ao cadastro canônico de leads com kind, plan_id/offer_id e consentimento.
- [x] Utilizar UUID idempotente por corpo e confirmação estrita received:true, exibindo erros 409/422/429/503.
- [x] Manter UTM e bloquear PII, JWT, IDs internos e preços inventados na URL.
- [x] Integrar CTAs dos planos e ofertas, navegação, SEO por rota e sitemap.
- [x] Versionar teste Node e guia de QA sem disparar GitHub Actions.
- [ ] Pendência de negócio: checkout público Indoor/assinatura após contratos e gateway autorizados na API.
- [ ] Executar QA e testes integrados quando houver ambiente; não bloquear novas macroentregas.

**Progresso global após esta entrega: estimativa documental ~79,1%, sem homologação**,
partindo de 79,0% em Admin PR #75. Indicador sujeito à reconciliação de
roadmaps com tarefas heterogêneas e duplicadas. Testes não executados nesta
sessão. Guia: docs/SITE_GUIDED_ACQUISITION_MVP_20261028.md.

---

## REGRA OPERACIONAL PERMANENTE — SEM GITHUB ACTIONS AUTOMÁTICO (17/10/2026)

**Restrição declarada pelo responsável do projeto:** não há cota/pacote disponível de GitHub Actions. É proibido desperdiçar tempo com reexecução, tentativa de desbloqueio ou disparo de workflows na plataforma sem autorização expressa posterior.

- Todos os seis workflows existentes nos três repositórios devem ficar sem eventos `push` e `pull_request`; manter apenas `workflow_dispatch` para eventual acionamento futuro **somente quando o responsável autorizar e houver cota**. Não disparar execuções manuais agora.
- **Plano de teste sem Actions:** executar localmente, sempre que o ambiente estiver disponível: API Laravel/PHPUnit, sintaxe PHP, Swagger L5 e MySQL 8 isolado; Site npm/TypeScript/Vite/testes Node/Chromium; Admin Metronic TypeScript/Vite/testes Node e Player Web. Preferir testes seletivos de regressão ligados ao bloco antes da suíte integral. Para QA integrado, levantar serviços localmente e exercitar jornadas de ponta a ponta.
- **Evidência em PR:** registrar comandos, ambiente, resultados, falhas e limitações. Se não houver acesso aos runtimes, dependências, MySQL 8, navegador ou hardware, marcar o gate como **PENDENTE** e oferecer comandos reproduzíveis; jamais chamar verificações estáticas de homologação.
- **Progresso:** ausência de Actions não impede escrever código e abrir PRs, mas também não autoriza afirmar que os testes passaram. Prosseguir com grandes blocos funcionais, sem inflar os 77/150 = 51,3% até aceite real.
- **Reativação futura:** somente por nova decisão explícita do responsável, em PR revisado; não reintroduzir gatilhos automáticos silenciosamente.

---

## POLÍTICA PERMANENTE DE ENTREGA — SPRINTS MACRO E AVANÇO REAL (17/10/2026)

**Decisão do produto (válida nos três repositórios):** priorizar **blocos grandes e integrados**, capazes de alterar o progresso real do MVP. Não usar uma sequência de PRs cosméticos ou subtarefas isoladas como substituto de uma entrega considerável.

- **Meta de planejamento por entrega macro:** **pelo menos +5 pontos percentuais** no progresso GLOBAL do MVP, contados somente após aceite verificável. A meta mede pontos percentuais, não crescimento relativo de 5% nem número de commits, arquivos ou PRs.
- **Critério de nomenclatura:** chamar de **marco gerencial** somente um resultado funcional de negócio com peso de **ao menos 1 ponto percentual** na medição global; os 150 itens históricos são **unidades de referência/aceite**, cada qual correspondendo a 1/150 = 0,6667 ponto percentual. Agrupar pelo menos duas unidades históricas relacionadas ao declarar um marco gerencial, sem mudar arbitrariamente o denominador.
- **Contabilidade da meta:** ponto de partida auditável **77/150 = 51,3%** (API 29/59, Admin/Player 25/57, Site 23/34). Entrega mínima de +5 p.p. exige ao menos **8 unidades antigas adicionais aceitas**: 85/150 = **56,7%** (+5,3 p.p.). **Próxima meta prioritária: 90/150 = 60,0%** (+13 unidades antigas, +8,7 p.p.), com demonstração das jornadas e aceites — não inflar porcentagem pela simples publicação dos PRs.
- **Formato da sprint:** escolher um fluxo vertical de valor (Site → API Laravel/MySQL → Admin/Player, conforme o domínio), decompor em histórias funcionais, implementar contratos/testes/migrations/UX/documentação necessários e entregar PRs coordenados, não draft, com dependências e ordem de merge. Corrigir bloqueios de teste/integração antes de multiplicar alterações pequenas.
- **Portas de aceite:** testes realmente executados e registrados (incluindo PHPUnit + MySQL 8 + Swagger para API alterada; build/TypeScript/QA nas interfaces; RBAC, multi-tenant e fluxos reais pertinentes); validar deploy/hardware apenas se de fato testados. Nunca classificar testes pendentes como aprovados ou confundir branch, merge, PR aberto e funcionalidade homologada.
- **Exceções justificáveis:** correções urgentes de segurança, dados ou quebra de produção podem ser pequenas e independentes, mas **não substituem** a meta da entrega macro. Se o avanço de +5 p.p. não for possível por impedimento real, explicar quais aceites faltam, evidências e trabalho necessário, sem inventar porcentagem.
- **Relatório de cada entrega:** antes/depois (numerador e denominador globais e por repo), variação **em pontos percentuais**, funcionalidades utilizáveis, testes com provas, pendências, risco/rollback, links dos PRs definitivos e plano do próximo bloco.
- **Prioridade imediata:** eliminar pendências de validação da API/Admin e homologar os contratos dos PRs já mesclados. Só após os aceites confirmar a evolução até **90/150 (60%)**; não contar novamente trabalho anterior.

Esta política prevalece, para **dimensionamento de sprint e apuração do avanço**, sobre referências históricas a entregas pequenas e a “13 macromarcos”; os 13 são **unidades históricas de aceite**, não 13 entregas independentes. O conteúdo técnico e as regras de segurança de cada repositório permanecem inalterados.

---

## Sprint integrada — proposta atribuída a anúncio revisado (17/10/2026)

**Jornada:** vitrine /anunciar → escolha de oferta pública #ID → formulário com consentimento → campo estruturado `offer_id` → validação Laravel → contexto histórico no Master. Não há checkout, reserva ou previsão de audiência.

- [x] Formulário mantém `plan_id` exclusivo do estabelecimento e transmite `offer_id` somente para anunciante, sem credenciais ou dados privados.
- [x] Jornada respeita UTM, consentimento, campo honeypot e UUID estável para retentativas.
- [x] Regressões Node garantem o contrato; cenário Chromium preenche pedido de oferta e verifica ID estruturado exato recebido pela API mock.
- [ ] Validar `npm ci`, TypeScript, build Vite/Express, Node e Chromium desta branch; integrar contra Laravel/MySQL 8 reais e homologar mobile. Testes de browser com mocks isolados não certificam API de produção.

**Progresso conservador:** API 29/59 + Admin 25/57 + Site 23/34 = **77/150 (51,3%)**; a meta de 60,0% permanece 90/150. Atribuição de interesse não implica campanha contratada e não pontua marco ainda não homologado. API/migration antes de Site e Admin; sem deploy/merge automático.

---
## Revisão de marcos Site — catálogo curado e planos aprovados (17/10/2026)

**Progresso validado de implementação:** 77/150 = 51,3% (API 29/59, Admin 25/57, Site 23/34). [CI Site/Portal #39072933020](https://github.com/paulodias-dev/meucomercial-site/actions/runs/39072933020) passou por TypeScript, Node, Vite/Express, HTTP/TLS, Chromium e Lighthouse.

- [x] Planos oficiais: PublicIndoorPricing consulta ofertas opt-in, ativação real do plano, valores DECIMAL e limites; nenhuma assinatura/checkout é iniciada.
- [x] Catálogo de mídia: pesquisa/paginação de inventário curado e oferta referenciada no lead com consentimento e atribuição UTM.
- [ ] Integração física e jurídica: API #94 ainda requer PHPUnit/MySQL8; Admin #59 requer build Metronic. CI Site utiliza mock HTTPS e não certifica estoque publicitário, contratos ou hardware. Ordem de integração: API antes de Site.

**Meta de 60% = 90/150. Ainda faltam 13 macromarcos aceitos**. Subtarefas ou PRs novos não substituem testes e homologação.

---
## Sprint integrada — Catálogo público escalável e curadoria de espaços (17/10/2026)

**Produto:** oferta aprovada pelo Master → vitrine paginada e regional no Site → lead consentido com referência/UTM. **Nunca** consulta disponibilidade real, reserva ou recebe pagamentos.

- [x] Oportunidades reais aprovadas com pesquisa de região, meio e navegação em páginas.
- [x] Oferta selecionada acompanha o lead consentido e UTMs, sem reservar ou cobrar.
- [x] BFF allowlist para paginação/região, contrato fail-closed e testes Node/Chromium/HTTP ampliados.
- [ ] API integrada e CI Site atualizado devem ser comprovados antes de aceitar marco.

**Percentual conservador até QA:** 75/150 = 50,0% (API 29/59, Admin 25/57, Site 21/34); 60% requer 90/150. Os testes da API e do Admin continuam pendentes até runners funcionais; não antecipar macromarcos sem validação. Merge API primeiro, depois Site e Admin, com rollback e QA. Não executar deploy/migração automaticamente.

---

## Sprint integrada — proposta de plano público vinculada ao lead (17/10/2026)

- [x] Capturar o identificador de plano público selecionado como campo estruturado `plan_id` no formulário oficial, apenas para estabelecimento, preservando UTM, consentimento e idempotência.
- [x] Testar via Chromium o clique no plano publicado, preenchimento/aceite e confirmação HTTPS da solicitação contendo `plan_id` exato; rejeitar atribuição de compra automática.
- [x] Acrescentar guarda Node contra regressão na serialização estruturada do plano e na retenção da atribuição.
- [ ] Homologar integração com API Laravel/MySQL8 **após migrations e PR API do funil**, conferindo plano despublicado, preço alterado e isolamento.
- [x] CI do Site validado: [run #39069962183](https://github.com/paulodias-dev/meucomercial-site/actions/runs/39069962183), com TypeScript, contratos Node, build Vite/Express, HTTP/TLS, Chromium e Lighthouse mobile.
- [ ] Validar em ambiente integrado API privada/MySQL8, plano despublicado e estados de concorrência; o browser E2E usa HTTPS mock e não substitui esta homologação.

**Roadmap global de referência:** **75/150 = 50,0%** (API 29/59, Admin 25/57, Site 21/34); meta 60%=90/150. Não contabilizar os quinze macromarcos necessários sem aceite documentado. **Rollout:** API → Site → Admin. Nenhuma alteração de cobrança, contrato, reserva ou Player acontece a partir do lead.

## Sprint ampliada — preços e inventário revisados (17/10/2026)

- [x] Opt-in comercial consultado pela BFF sem expor URL da API ou JWT
- [x] Planos oficiais com preços DECIMAL, limites, período e CTA atribuído por UTM/planId
- [x] Oportunidades publicadas e revisadas apresentadas sem prometer disponibilidade nem booking
- [x] Testes contratos Node, E2E Chromium, HTTPS mock e estados vazios de catálogo
- [ ] CI Site e integração com API/MySQL real ainda pendentes.

**Meta 60%:** 90/150 macromarcos, partindo de 75/150 (50,0%). Este código sozinho não comprova quinze marcos adicionais. Sem inflar métricas enquanto os pipelines API/Admin não executarem; sem merge/deploy/migrations de produção.

## Painel global atual — sprint ampliada de 17/10/2026

**Status validado em código + CI:** **75/150 macromarcos = 50,0% do MVP** (API **29/59 = 49,2%** · Admin/Player **25/57 = 43,9%** · Site/Portal **21/34 = 61,8%**). Os quatro marcos novos são do **Site**, não implicam homologação de API, Admin ou hardware TV/Rádio.

### Marcos concluídos nesta sprint (4)

- [x] **TV publicamente demonstrável:** quatro composições locais responsivas, orientação 16:9/9:16, texto editável e opção de proposta com UTM/consentimento. Nenhuma transmissão ou publicação real é alegada.
- [x] **E2E de jornadas reais:** Chrome/Playwright cobre simulador, proposta de anunciante, informações de localização inválidas, consultor, Rádio, portal privado, HTTP 422/503 e retry com idempotência.
- [x] **Auditoria Lighthouse mobile + SEO:** relatórios JSON de três rotas compiladas, FCP/LCP/CLS/TBT e scores de Performance/Acessibilidade/SEO, URLs/canonicals distintos, com separação clara de métricas de laboratório e INP de campo.
- [x] **Revisão editorial/comercial e privacidade técnica:** remoção de promessas sem evidência, consentimento explícito e testes de retenção de contexto, cookies próprios e publicidade sem inventário ou faturamento. Revisão jurídica formal e política publicada permanecem pendentes.

**CI de implementação:** [workflow de Site / Portal #39058106394](https://github.com/paulodias-dev/meucomercial-site/actions/runs/39058106394) validou TypeScript, Node, Vite/Express, HTTP/TLS, Chromium e Lighthouse. Atualizações apenas documentais subsequentes não alteram o código testado.

**Marcos que CONTINUAM abertos:** catálogo público com inventário/regiões/preços **autorizados** da API; cadastro/teste/assinatura automatizados e pagamento; conformidade jurídica e cookies de terceiros; INP medido em produção; homologação do Player físico; CI GitHub de API/Admin com jobs sem etapas/logs. A página `/anunciar` é uma vitrine **sem inventário vivo** e não encerra o marco de inventário real. Nenhum merge/deploy ou migration foi executado por esta sprint.

**Próximo passo:** integração de planos e funil com API autorizada, homologação física do Player e recuperação dos runners API/Admin para avançar os marcos de backend e operações.

---

## Sprint de consolidação do MVP — Site/Portal e Rádio (17/10/2026)

**Entrega de código em PR definitivo, não draft:** versão pública `/radio-indoor` com amostras de locução por síntese nativa local e ação explícita; duas categorias de programação fictícia permanecem **apenas explicativas**, nunca música sem licença, campanha vendida ou reprodução confirmada. Deep link, meta Open Graph/canonical servido em HTML para bots e fallback 404.

- [x] Demonstração sonora com três locuções próprias sintetizadas no navegador, seletor acessível, controles de iniciar/parar, status e tratamento de navegador sem TTS.
- [x] Demonstrar com clareza grade editorial simulada versus áudio local; sem coleta de dados, anúncios ficticiamente contabilizados, JWT de Player ou streaming não autorizado.
- [x] Remover supostos logotipos de clientes, links sociais simulados, CNPJ não verificado e compromissos comerciais sem contrato autorizado.
- [x] Entregar auditoria técnica de SEO/performance, mapa de jornadas, responsabilidades por componente, pontos de privacidade e plano de correção documentado.
- [x] Adicionar prova HTTP do servidor Express compilado, gateway com upstream HTTPS local e aceite real de lead (códigos 201/422/502), robots privados, canonical de Rádio e 404.
- [ ] Confirmar CI do PR com `npm ci`, TypeScript, contratos React/Node, Vite e testes HTTP (workflow novo em execução).
- [ ] Revisão jurídica, LGPD publicada, Lighthouse/Core Web Vitals, E2E navegador, conversão real e revisão mobile.
- [ ] Integrar no Portal/Player real e homologar TV/Rádio com hardware; não presumir conclusão.

**Marcos do roadmap encerrados em implementação verificável:** (1) auditoria inicial de SEO/performance e mapa de jornadas; (2) página de demonstração de Rádio com exemplos e locução local; (3) refatoração da home em componentes de simulador, briefing, consultoria e formulário mantendo submissão idempotente. O macro de Lighthouse, E2E de navegador, refatoração total do `App`, checkout, consentimento jurídico final e Player físico permanece aberto. **Indicador proposto após validação dos testes:** API 29/59 + Admin 25/57 + Site 17/34 = **71/150 (47,3%)**. Meta global 50% = 75/150; **faltam quatro outros macromarcos independentes**, não antecipar contagem de QA não realizado.

**Próximo passo:** concentrar a próxima revisão em componentes grandes do Site e no fechamento dos gates operacionais do Admin/API, e não em mais incrementos de diagnósticos já implementados.

# Roadmap de Desenvolvimento — Plataforma SaaS Mídia Indoor
## Sprint integrada — triagem operacional da rede e Player resiliente (17/10/2026)

**Objetivo:** transformar estados de publicação/ACK/relatos em suporte operacional seguro, sem falsos alarmes, mantendo reprodução sob lease; integração Laravel → Portal React/Metronic → Player Web.

- [x] Adicionar filtro e contador de Players que precisam de atenção na tela de publicações (API, BFF e UI).
- [x] Renderizar recomendação contextual por aparelho e diferenciar incidentes de estados informativos.
- [x] Abrir diagnóstico real com JWT do cliente, ação de sync já protegida por confirmação explícita, sem comandos automáticos.
- [x] Exportar somente por interação manual resumo de suporte sanitizado e sem credenciais.
- [x] Validar tipo, nível, código, semântica da triagem e totais do conjunto em runtime e testes Node.
- [x] CI TypeScript, contratos Node e build Vite/Express executados com sucesso: [Site/Portal quality #39031804783](https://github.com/paulodias-dev/meucomercial-site/actions/runs/39031804783).
- [ ] Validar navegador mobile, integração com API real e Player TV/Rádio físico.

**Progresso baseado em macromarcos aceitos (gates de CI/hardware ainda pendentes):** API 29/59 + Admin 25/57 + Site 14/34 = **68/150 (45,3%)**. Não contar subtarefas escritas como conclusões de macromarcos não homologados. Prioridade API → Portal; Admin/Player independente. Sem merge/deploy automático ou alterações destrutivas.


## Sprint integrada — primeiro relato de execução por publicação (16–17/10/2026)

**Objetivo:** completar a rastreabilidade de cada publicação do agendamento até o relato autenticado do Player, mantendo ACK, relato de mídia própria e audiência em domínios distintos.

- [x] Dashboard por publicação distingue ACK do manifesto de primeiro relato autenticado de mídia própria.
- [x] Novos filtros da rede com contadores globais e indicação por dispositivo do horário do primeiro relato.
- [x] BFF autoriza apenas filtros enumerados e Portal valida evidências e invariantes de contagem em runtime.
- [x] Atualização de baixo impacto a cada 45 segundos, apenas enquanto publicação ativa, com pendências e aba visível.
- [x] Testes Node ampliados para relatos falsos, audiência fictícia e consulta sob controle.
- [x] CI TypeScript, testes Node (incluindo falsificação de evidência e polling) e Vite/Express: [execução aprovada #38993429572](https://github.com/paulodias-dev/meucomercial-site/actions/runs/38993429572).
- [ ] Testes de navegador mobile, integração JWT/API com autenticação real e Player TV/Rádio físico: pendentes.

**Macromarcos aceitos:** API 29/59 + Admin/Player 25/57 + Site 14/34 = **68/150 (45,3%)** até testes completos/homologação física, sem inflar o progresso por código não validado. **Merge recomendado:** API → Site; Player/Admin independente, após QA. Nenhum deploy, merge ou migração em produção sem aceite.


## Sprint integrada — publicação, confirmação e isolamento do Player (16/10/2026)

**Objetivo:** percorrer a publicação até a evidência de sincronização autenticada e proteger o aparelho contra efeitos tardios de sessões anteriores. **ACK de manifesto não é reprodução certificada ou audiência.**

- [x] Gateway Express só permite filtro enumerado de distribuição e paginação positiva, sem aceitar `client_id`/agência informados pelo cliente.
- [x] Detalhe de uma publicação agora exibe contadores de todos os destinos: ACK validado, aguardando ACK, online e sync pendente.
- [x] Filtragem por situação processada na API e lista paginada; layouts responsivos e estados sem resultados.
- [x] Contrato JS de runtime recusa evidências falsas, contagens inconsistentes e payloads incompatíveis; testes Node ampliados.
- [x] CI do Portal com 52 testes Node, TypeScript e compilação Vite/Express verde: [run #38991600290](https://github.com/paulodias-dev/meucomercial-site/actions/runs/38991600290). A primeira execução detectou duas mensagens de ressalva removidas e a interface foi corrigida antes do resultado verde.
- [ ] QA integrado com API/JWT reais, navegadores mobile e Players físicos: pendente.

**Progresso conservador até os gates de aceite:** API 29/59, Admin 25/57, Site 14/34; total **68/150 = 45,3%**. Subtarefas de uma sprint não contam como macromarcos encerrados antes dos testes e homologação. Integração pela ordem API → Site, Player/Admin conforme QA independente. Não mesclar nem implantar automaticamente. Sem migração destrutiva.


## Sprint — Recuperação assistida de Players (16/10/2026)

**Entrega integrada:** API, Portal do cliente e Admin Metronic; nenhuma mutação automática sem confirmação, sem deduzir audiência independente.

- [x] Plano de recuperação server-driven no diagnóstico de cada Player, sem permitir ações nas prioridades bloqueadas.
- [x] Ressincronização intencional com confirmação em duas etapas e envio somente por BFF JWT com ID de dispositivo restrito.
- [x] Verificação rígida de HTTP 202, device_id e `command_queued_not_player_ack`; diferenciar enfileiramento de confirmação do Player.
- [x] Estado de erro/autorização claro, cancelamento, fila pendente e atualização após comando no Portal e no resumo de Players.
- [x] Testes de contrato de ação manual, ausência de credenciais persistidas, permissões e textos sem falsas confirmações.
- [x] CI completo do Portal com instalação, TypeScript, testes Node e build Vite/Express: [GitHub Actions #38987716642](https://github.com/paulodias-dev/meucomercial-site/actions/runs/38987716642) concluído com sucesso após correção da mensagem persistente de comando enfileirado.
- [ ] E2E cliente–API, sessão expirando e Player físico ainda pendentes.
- [ ] QA responsivo mobile-first/teclado e dispositivo real.

**Macromarcos aceitos de referência:** API 29/59 + Admin 25/57 + Site 14/34 = **68/150 (45,3%)**. Os subcritérios da sprint não encerram automaticamente macromarcos dependentes de homologação física e CI. **Ordem de merge:** API → Portal; Admin independente. Sem reset/deploy e sem merge automático desta sprint.


## Sprint integrada — Triagem operacional da rede TV/Rádio (16/10/2026)

**Objetivo:** experiência responsiva de suporte operacional para estabelecimentos, com indicadores da rede completa e filtro seguro por situação dos Players.

- [x] Gateway JWT encaminha somente filtros operacionais enumerados e parâmetros válidos ao resumo protegido.
- [x] Portal apresenta bloqueados, sem pareamento, offline, sincronização pendente e ausência de relatos sem confundir categorias.
- [x] Seleção de prioridade reseta paginação e diagnóstico expandido; exportação CSV e filtros de mídia/período preservados.
- [x] Validação JS dos estados, contadores e linhas recebidos da API, além de novos testes funcionais Node e contrato de segurança.
- [x] CI [Site #38985065323](https://github.com/paulodias-dev/meucomercial-site/actions/runs/38985065323) verde em npm ci, TypeScript, testes Node e build Vite/Express.
- [ ] Compatibilidade API/Site em ambiente integrado e E2E mobile, autenticação e Player físico.

**Progresso de referência:** API 29/59, Admin 25/57, Site 14/34; total 68/150 = **45,3%**, sem encerrar marcos incompletos. **Ordem:** API antes de Site. Sem merge/deploy automático. Próximo bloco: recuperação assistida e homologação física.


## Sprint — Triagem e qualidade do Portal de Players (16/10/2026)

**Objetivo demonstrável:** encerrar o conflito do PR Site #34 sem regressão do checklist #33 e transformar o resumo de TV/Rádio em uma porta de entrada para diagnóstico de cada Player, exportação local segura e validação automatizada de qualidade.

- [x] Integrar os PRs Site [#33](https://github.com/paulodias-dev/meucomercial-site/pull/33) e [#34](https://github.com/paulodias-dev/meucomercial-site/pull/34) sem apagar funcionalidades concorrentes; #34 confirmado como mesclado na main após merge explícito da main na branch.
- [x] Validar em tempo de execução contrato recebido da API (escopo, evidência, filtros, paginação, formatos, dias UTC), exibindo erro recuperável em caso de incompatibilidade.
- [x] Abrir diagnóstico por dispositivo via endpoint autenticado existente, sob demanda, com possibilidade de fechar e sem disparar uma consulta por linha (sem N+1 de browser).
- [x] Exportar CSV local e limitado à página visível, com cabeçalho UTF-8, coluna de data UTC, neutralização de fórmulas e campos autorizados sem token, client_id ou armazenamento.
- [x] Criar testes Node funcionais para contrato, payload inválido, CSV injection e superfície de triagem; manter os testes de contrato anteriores no build.
- [x] Adicionar workflow de GitHub Actions do Site com npm ci, typecheck, testes Node de rádio/jornadas/Portal e compilação Vite/Express, sem segredos ou acesso de escrita.
- [x] **CI executado e verde:** [GitHub Actions #38983541605](https://github.com/paulodias-dev/meucomercial-site/actions/runs/38983541605) passou em `npm ci`, `npm run lint`, testes Node de rádio/jornadas/Portal e `npm run build` (Vite/Express).
- [ ] Homologar interação 320–1440 px, acessibilidade por teclado, JWT e integração com MySQL/API/Player reais, incluindo cenários de falha de rede e expiração de sessão.

**Status de aceite:** sete subcritérios concluídos, um gate de QA manual pendente. O marco específico de CI do Site foi concluído com check verde real; homologação de dispositivos e deploy continuam pendentes. **Indicador global atualizado:** API 29/59 + Admin 25/57 + Site 14/34 = **68/150 = 45,3%** de macromarcos; não equivale a produção pronta.

**Próxima sprint:** executar e corrigir os pipelines em runners disponíveis, estabilizar a cadeia JWT/API e validar um fluxo completo em TV/Rádio físico; em paralelo, avançar do histórico de mídia própria à reconciliação de campanhas comerciais sem tratar relatos de Player como audiência independente.


## Sprint integrada — Ativação orientada e recuperação operacional (16/10/2026)

**Meta do bloco:** tornar utilizável e mensurável a jornada já implementada de ativação, pareamento, Estúdio, publicação própria e diagnóstico. Alterações coordenadas na API, Portal e Admin, em PRs definitivos contra main, sem deploy/merge automático.

- [x] API: checklist autenticado recebe oitava etapa para relatos recentes do Player, quantificação dos últimos sete dias, próxima ação orientada e escopo estrito por cliente.
- [x] API: testes Feature acrescentados para janela, isolamento de clientes e resposta sem segredos; adequação de expectativa legada de evidência de sincronização.
- [x] Portal: chamada à ação contextual, orientação por etapa, atividades relatadas por Player e atualização ao navegar entre Estúdio/Dispositivos/Publicação.
- [x] Portal: teste de contrato para ação prioritária e distinção entre reprodução relatada e audiência independente.
- [x] Admin: fila de prioridades dos Players por aparelhos bloqueados, não pareados, offline e sincronização pendente, com consulta restrita à agência e cliente autorizados.
- [x] Admin: invariantes estáticas da fila incorporadas à suíte de verificação existente.
- [ ] Executar PHP lint, PHPUnit/MySQL 8, Swagger, npm ci, TypeScript/Vite e testes E2E completos em ambiente com dependências.
- [ ] Homologar em hardware TV/Rádio real o ciclo cadastro → PIN → mídia → publicação → manifesto → reprodução relatada.

**Progresso global de referência:** 67/150 macromarcos aceitos (44,7%); código da sprint não constitui homologação do Player físico. **Próximo bloco:** observabilidade por aparelho/estabelecimento com consulta agregada sem carregar toda paginação; diagnóstico e recuperação guiados e testes de contrato em todas as camadas.


> **Projeto:** Site institucional / aquisição de leads · **Repositório:** `paulodias-dev/meucomercial-site`  
> **Atualização de referência:** 15/10/2026 · **Branch de produção:** `main` · **Estado:** desenvolvimento/homologação em andamento

**Visão do produto.** Plataforma SaaS de TV e Rádio Indoor com operação comercial bilateral: assinaturas recorrentes de estabelecimentos e venda de espaços publicitários a anunciantes terceiros, além de Cliente/Contrato 360º, rede de locais, inventário, campanhas, veiculações e comprovação de execução. Conecta API Laravel/MySQL, painel React/Metronic e site comercial. A aplicação executada nas TVs/radios é um componente próprio que ainda precisa ser inventariado e homologado.

**Responsabilidade deste repositório:** Landing page, comunicação do produto, SEO, precificação e conversão comercial.

## Sprint — Operação assistida e tendências auditáveis de TV/Rádio (16/10/2026)

**Integração requerida:** API #84 fornece summary.by_day e bucket_timezone em UTC. Portal renderiza séries por dia para filtros 1/7/30 e TV/Rádio, sem consultar toda a paginação; Player/Metronic executa a recuperação de filas em PR próprio.

- [x] Tipos TypeScript do contrato diário da API associados ao dispositivo autenticado.
- [x] Gráfico compacto responsivo com imagens/vídeos/áudio e escala por máximo do período.
- [x] Legendas acessíveis e datas UTC legíveis, separação explícita entre gráfico completo e CSV da página.
- [x] Visibilidade de zero relatos sem inferir ausência de reprodução ou desligamento.
- [x] Guardas de contrato e responsividade adicionadas à suíte Node local.
- [ ] Build TypeScript/Vite, E2E com JWT e análise mobile em navegadores físicos.
- [ ] Homologação fim a fim com API #84 e Player real.

**Macromarcos globais conservadores:** 67/150 (44,7%). Sem CI/Actions, resets ou merge automático.

## Sprint — Reconciliação offline e histórico TV/Rádio por estabelecimento (16/10/2026)

**Integração:** PRs definitivos [API #83](https://github.com/paulodias-dev/meucomercial-api/pull/83), [Site #31](https://github.com/paulodias-dev/meucomercial-site/pull/31) e [Admin #49](https://github.com/paulodias-dev/meucomercial-admin/pull/49) **abertos, não draft, mescláveis, contra `main`**. Os anteriores API #82, Admin #48 e Site #30 estão mesclados na `main`. Integrar **API #83 → Site #31**, e Admin/Player #49 após QA. Workflows [API #83](https://github.com/paulodias-dev/meucomercial-api/actions/runs/38969498152) e [Admin #49](https://github.com/paulodias-dev/meucomercial-admin/actions/runs/38969515777) terminaram em **failure, com zero etapas disponibilizadas nos jobs consultados**: PHPUnit/MySQL e TS/Vite **não comprovadamente executados**. Site #31 sem workflow PR visível. **Nenhum reset, merge ou deploy automático.**

**Critérios da sprint: 16/19 implementados em código (84,2%); 3 gates de QA/homologação pendentes.**
- [x] Confirmar integração real dos PRs anteriores (API #82, Admin #48 e Site #30) na main.
- [x] API read-only `auth:client` para histórico de reprodução declarado pelo Player de **um único dispositivo próprio**.
- [x] Restringir cliente por JWT/guard, dispositivo por `client_id` e negar acessos cross-client com 404.
- [x] Validar enum de períodos 1/7/30 dias, filtro TV/Rádio/todos e número de página limitado.
- [x] Paginação em 20 registros, ordenação determinística e sumarização por imagem/vídeo/áudio somente no mesmo escopo.
- [x] Resposta sem token do aparelho, JWT, IP, S3, URLs privadas ou payload bruto; explicitar nível de evidência como relato do dispositivo.
- [x] Documentar rota Laravel com L5 Swagger/OpenAPI, sem migrations nem permissões globais novas.
- [x] Escrever testes PHPUnit Feature de owner/foreign/inativo, filtros, totais, paginação e exclusão de credenciais.
- [x] Gateway Express allowlist de `device-reports` GET com ID decimal seguro e filtros estritamente permitidos.
- [x] Tela React mobile-first de relatórios, aberta sob demanda no diagnóstico, com período e mídia filtráveis.
- [x] Exportação CSV somente da página visível, codificação UTF-8 e tratamento de CSV formula injection, sem segredos.
- [x] Classificação de evidência local vencida (>47h) na outbox IndexedDB do Player, sem perda de registros ou reenvio inválido.
- [x] Contadores separados para filas comerciais e conteúdo próprio, status pendente, retry, rejeitado e expirado.
- [x] Botão no Player Web para exportar localmente JSON sanitizado de auditoria, apenas após clique e sem apagar o original.
- [x] Corrigir compatibilidade TV/Rádio no lote: campos opcionais ausentes omitidos do payload TV.
- [x] Testes e guardas novos: **39/39 estáticos Site**, **15/15 estáticos Admin** e **5/5 funcionais isolados da outbox**, runbooks atualizados nos três repos.
- [ ] Executar PHP lint, PHPUnit/MySQL 8, Swagger final e testes de integridade/performance dos relatórios.
- [ ] Executar todas as suites Node Player, build TypeScript/Vite Site/Admin, testes de navegador, CI verde e revisão responsiva.
- [ ] Homologar Player de TV/Rádio em equipamento físico, reconexão offline, limites de armazenamento, expiração/rejeição e cadeia de evidências.

**Progresso global por macromarcos integralmente aceitos:** API **29/59**, Admin **25/57**, Site **13/34** = **67/150 (44,7%)**, conservador até QA; o progresso da sprint em código não equivale a disponibilização do MVP em produção.

**Próxima sprint:** destravar runners do GitHub Actions para evidência executada de testes; operação assistida de filas saturadas com política explícita de retenção, testes no Player real e reforço de histórico/reconciliação sem ampliar a janela de aceitação do servidor.

## Sprint ampliada — Recuperação API #81 + relatos Rádio + QR offline (16/10/2026)

**Estado:** PRs definitivos [API #82](https://github.com/paulodias-dev/meucomercial-api/pull/82), [Admin #48](https://github.com/paulodias-dev/meucomercial-admin/pull/48) e [Site #30](https://github.com/paulodias-dev/meucomercial-site/pull/30) **mesclados em `main`**, sem comprovação de CI/Player físico. Ordem de implantação: **API e migrations → Admin/Player Web → Site**. Workflows [API #82](https://github.com/paulodias-dev/meucomercial-api/actions/runs/38954488233) e [Admin #48](https://github.com/paulodias-dev/meucomercial-admin/actions/runs/38954494410) falharam com **zero etapas visíveis nos jobs consultados**, portanto sem comprovação de PHPUnit/MySQL, Node ou build Vite; Site sem workflow PR visível. Auditoria constatou que **API #81 foi mesclado apenas na branch intermediária do #80, e não na main**: modelo, rota, serviço e migration de TV não estavam na main, apesar do estado "merged". Este PR recoloca esses arquivos corretamente antes de estender a Rádio. **API #80, Site #29 e Admin #47 já constam como integrados na main.**

**Critérios implementados: 15/18 = 83,3%; 3 gates de QA abertos.**
- [x] Auditar e documentar a divergência entre PR API #81 merged e o conteúdo real da main.
- [x] Reincorporar o módulo de eventos TV (modelo, API, serviço, migration, rotas, diagnósticos, testes).
- [x] Adicionar migration segura e retrocompatível para hora/slot de Rádio, com chave única por dispositivo/hora/posição.
- [x] Aceitar relatórios de áudio somente como spots institucionais próprios, não música licenciada nem publicidade paga.
- [x] Revalidar Player, assinatura, cliente, manifesto, grade, direitos e cronograma de Rádio reconstruído no servidor.
- [x] Verificar duração integral, hora/slot e horário de conclusão antes de registrar relato.
- [x] Garantir idempotência de UUID e rejeitar segundo UUID do mesmo slot com 409.
- [x] Instrumentar motor de Rádio somente após slot finalizado sem seek/interrupção.
- [x] Reaproveitar fila offline própria sem alterar ledger/outbox de anúncios e faturamento.
- [x] Incorporar gerador SVG de QR offline em arquivo MIT com licença preservada.
- [x] Configurar URL HTTPS oficial /portal e usar PIN temporário no fragmento do QR, sem segredo do Player.
- [x] Consumir fragmento uma vez no Portal, limpando URL e guardando PIN apenas na memória.
- [x] Exigir seleção explícita de equipamento cadastrado para autorizar pareamento.
- [x] Exibir relatos de Rádio separados dos relatórios de TV e de audiência independente.
- [x] Adicionar testes PHP e Node; verificações estáticas Site 37/37 e Admin/Player 17/17; gerador QR SVG e filtros de áudio executados isoladamente; runbooks atualizados.
- [ ] Executar PHP lint, PHPUnit/MySQL8, migrations incrementais, Swagger e testes de concorrência reais.
- [ ] Executar Node Player, TS/Vite, QA HTTP/TLS/mobile QR e obter CI verde.
- [ ] Homologar em Player TV/Rádio real, mídia S3, proteção de licença, mudança de grade, offline e ACK.

**Progresso global de macromarcos aceitos:** API 29/59 + Admin 25/57 + Site 13/34 = **67/150 = 44,7%**. Não contabilizar essa sprint como Player físico homologado. **Próxima sprint:** CI executável e QA integrado, rotação/revogações e recuperação da fila offline; nunca usar `migrate:fresh` em produção.

## Sprint — Relatos idempotentes de TV própria e outbox offline (16/10/2026)

**Estado de integração:** PRs definitivos [API #81](https://github.com/paulodias-dev/meucomercial-api/pull/81), [Admin #47](https://github.com/paulodias-dev/meucomercial-admin/pull/47) e [Site #29](https://github.com/paulodias-dev/meucomercial-site/pull/29) **abertos, não draft, mescláveis**. A **API #81 é empilhada sobre API #80 ainda aberta**, enquanto Site/Admin partem da `main`. **Site #28 e Admin #46 estão mesclados na main**, API #80 não. Implantar na ordem **API #80 → API #81 + migration → Admin/Player Web e Site**. Workflows [API #81](https://github.com/paulodias-dev/meucomercial-api/actions/runs/38942821811) e [Admin #47](https://github.com/paulodias-dev/meucomercial-admin/actions/runs/38942829870) registram **failure sem etapas nos jobs consultados**, e não comprovam PHPUnit/Node executados; Site não expõe workflow PR. Sem alterações diretas à main ou banco de produção.

**Critérios de sprint: 17/20 implementados em código (85%), três gates de aceitação pendentes.**
- [x] Migration aditiva `indoor_own_playback_events`: UUID único, cliente, dispositivo, grade, playlist, item, versão e data, índices por escopo.
- [x] Modelo dedicado independente dos eventos comerciais e das metas de publicidade.
- [x] Novo endpoint autenticado por bearer de Player `/api/v1/player/own-playback/batch` (até 100, throttle).
- [x] Escopo `client_id/device_id` derivado do dispositivo autenticado, jamais do corpo; tokens revalidados após lock.
- [x] Idempotência por UUID com comparação de campos: mesma execução `replayed`, UUID reaproveitado para conteúdo/duração/Player diferente rejeitado.
- [x] Aceitação parcial HTTP 207 e rejeições individuais, sem perder os demais eventos válidos.
- [x] Janela de 48 horas para reconciliação offline e validação de duração do item.
- [x] Validação da assinatura/plano, cliente, bloqueio e pareamento no momento do aceite.
- [x] Validação de grade do próprio dispositivo no instante declarado, playlist TV, item/mídia `ready` e vínculo correto.
- [x] Rejeição se manifesto, versão Story ou fingerprint de publicação não forem a revisão válida atual.
- [x] `PlayerEngine` gera relato somente após mídia TV imagem/vídeo concluída com lease válido, nunca no fetch/erro/interrupção.
- [x] Rechecagem da geração do Player após persistência assíncrona para impedir ACK obsoleto.
- [x] `PlaybackOutbox` reutilizada com fila isolada própria, preservando chave IndexedDB comercial legada; até 1.200 eventos, UUID estável.
- [x] Envio em lote e retentativas offline: `accepted/replayed` removidos, `rejected` retidos para auditoria.
- [x] Diagnóstico `auth:client` mostra contagem 24h e até 12 relatos do próprio aparelho, sem IP/token/payload confidencial.
- [x] Portal React adiciona histórico responsivo distinguindo relato autenticado de certificação independente de audiência.
- [x] Testes Laravel e Node escritos; guardas estáticas Site **35/35**, Admin **14/14** e testes funcionais isolados da outbox/normalização executados e aprovados; runbooks nos três repos.
- [ ] Executar testes PHPUnit/MySQL8 com schema migrado, API docs/OpenAPI e validação E2E completa.
- [ ] Executar suite Node Player, builds TypeScript/Vite do Admin e Site e suites navegador HTTPS, com CI verde.
- [ ] Homologar TV real, reconexões, mudanças de grade/assinatura, Player/kiosk e resultados de auditoria; expandir para conteúdo Rádio em outra sprint.

**Progresso macro não inflado:** API **29/59**, Admin **25/57**, Site **13/34**, total **67/150 = 44,7%** dos macromarcos integralmente aceitos. O trabalho avança dentro de Player/telemetria, mas **não encerra** o marco de homologação/produção. Estes eventos representam relatos enviados pelo próprio Player, não audiência independente nem faturamento publicitário.

**Próximo bloco:** destravar CI, executar QA real e reconciliar histórico offline em mudanças de manifesto; ampliar instrumentação própria de Rádio e suporte a QR no provisionamento, mantendo compatibilidade e direitos autorais.

## Sprint ampliada — Player V2 seguro, instalação guiada e ACK operacional (16/10/2026)

**Estado:** PRs definitivos [API #80](https://github.com/paulodias-dev/meucomercial-api/pull/80), [Site #28](https://github.com/paulodias-dev/meucomercial-site/pull/28), [Admin #46](https://github.com/paulodias-dev/meucomercial-admin/pull/46) **API #80 ainda aberta e bloqueando a integração; Site #28 e Admin #46 já mesclados na main**; sem alteração direta da main ou deploy. Sprint anterior [API #79](https://github.com/paulodias-dev/meucomercial-api/pull/79) e [Site #27](https://github.com/paulodias-dev/meucomercial-site/pull/27) mesclada na main. Workflows dispararam, mas [API](https://github.com/paulodias-dev/meucomercial-api/actions/runs/38940189392) e [Admin](https://github.com/paulodias-dev/meucomercial-admin/actions/runs/38940205369) concluíram em **failure com zero etapas expostas nos jobs consultados**; PHP/Node completos NÃO foram comprovadamente executados. Site sem workflow PR visível.

**Critérios desta sprint: 17/20 implementados em código = 85,0%; 3 gates de QA/homologação abertos:**
- [x] Protocolo **Player Pairing V2** com sessão temporária e PIN numérico, segredo separado gerado por `random_bytes(32)` e somente hash SHA-256 armazenado.
- [x] Consulta v2 autenticada por capability no cabeçalho; PIN sozinho não resgata credencial e a URL não contém token.
- [x] Consumo atômico da credencial **uma única vez** (status `claimed`) com lock, expiração e checagem da sessão vinculada ao dispositivo.
- [x] Isolamento entre o pareamento legado e sessões v2 em ambos o polling antigo e o serviço antigo de criação de dispositivos.
- [x] Serviço único `IndoorDeviceService::claimV2Session` para autorizar sessão sobre dispositivo **existente** (não duplica dispositivos), lock transacional e ausência de rotação involuntária de token.
- [x] Controles de cliente/assinatura/plano, status, bloqueio e tentativa de reutilização; acesso cross-client negado e respostas sem token para operadores/assinantes.
- [x] Endpoint `auth:client` de autorização pelo estabelecimento com PIN temporário e throttle.
- [x] Endpoint administrativo de autorização condicionado a `indoor_devices.pair`, vínculo `AudioAssetAccess::agency` e contexto explícito `X-Agency-Tenant`.
- [x] Player Web atualizado para iniciar e consultar pareamento v2 com capability somente em memória, preservando fluxo offline de Player pós-pareamento.
- [x] Portal React: autorização do PIN mostrado no aparelho pelo assinante, feedback de erro, validação numérica e separação do fluxo legado.
- [x] Admin Metronic: vincular PIN v2 à tela já cadastrada, modal de confirmação e distinção visual de ação legada; sem alterar indevidamente assinatura.
- [x] Gateway Express allowlist para `claim-device` e `device-diagnostics`, com ID decimal seguro, corpo mínimo, bearer cliente em memória e TLS.
- [x] API de diagnóstico do Player estritamente vinculada ao cliente: heartbeat mais recente, manifesto, comandos e logs sem IP/token/payload bruto.
- [x] Comparação SQL paginada do manifesto solicitado com ACK autenticado de protocolo 2 e playlist correspondente, sem confundir ACK com reprodução.
- [x] Portal mostra por publicação/Player a confirmação v2 quando existente, explicitando ausência de prova independente de audiência.
- [x] Testes Feature PHPUnit escritos: sessão, segurança, expiração, cross-tenant, RBAC, operação Admin, diagnósticos e correlação ACK; novos testes Node Player Web sobre capability.
- [x] Guardas estáticas da interface **Site 34/34** e **Admin 14/14** verificadas; runbooks nos três repos e critérios de implantação documentados.
- [ ] Executar PHPUnit/MySQL 8, geração do Swagger, migrações e testes de concorrência com logs verificáveis.
- [ ] Executar Node Player completo, Admin TypeScript/Vite, Site Vite/Express e E2E HTTPS + mobile, com aprovação no CI.
- [ ] Homologar instalação real em TV/Rádio, sessão expirada, conexão/revogações, manifestos, codecs e evidência real de reprodução; confirmar política de descontinuação do legado.

**Macromarcos globais ainda não homologados:** API **29/59**, Admin **25/57**, Site **13/34**, total **67/150 = 44,7%**. Esta sprint avança múltiplos critérios dentro dos marcos maiores de Player/Operação, mas não declara o Player físico ou a prova de audiência terminados antes dos gates. O percentual mede **macromarcos aceitos**, não volume de linhas.

**Próxima sprint:** QA end-to-end e desbloqueio do GitHub Actions; QR offline para instalação móvel e autenticação do vínculo, política de remoção da sessão legada e evidência idempotente de mídia própria reproduzida com outbox/Player; validar escalabilidade e migração segura antes da produção.

## Sprint MVP — Upload privado + Modelos visuais do Estúdio TV (16/10/2026)

**Estado:** PRs definitivos [API #79](https://github.com/paulodias-dev/meucomercial-api/pull/79) e [Site #27](https://github.com/paulodias-dev/meucomercial-site/pull/27) **mesclados na main**; falta evidência de homologação física/CI. A base já contém [API #78](https://github.com/paulodias-dev/meucomercial-api/pull/78) e [Site #26](https://github.com/paulodias-dev/meucomercial-site/pull/26) mesclados na main. Workflow Laravel da API #79 ([execução](https://github.com/paulodias-dev/meucomercial-api/actions/runs/38929304217)) terminou em **failure**, mas ambos os jobs consultados exibiram **zero etapas**: não é evidência de PHPUnit executado. Nenhum merge novo, deploy ou operação destrutiva de banco realizada.

**Critérios — 15/18 implementados em código (83,3%), 3 gates pendentes:**
- [x] Upload exclusivo `auth:client`, cliente obtido pelo guard, concessão explícita de agência e assinatura/plano vigente revalidados pelo serviço comum.
- [x] Gateway Express binário com caminho fixo, TLS, método, JWT, cabeçalho de nome codificado e limite de memória por chamada.
- [x] Restringir arquivo a JPG/PNG <=12 MiB ou MP4 <=24 MiB, tipo real via finfo, sem aceitar MIME forjado ou caminhos arbitrários.
- [x] Validar imagens por estrutura e dimensões, impedindo arquivos inválidos e resoluções excessivas.
- [x] Validar MP4 via contêiner `ftyp` + ffprobe obrigatório, H.264/AAC, duração máxima 10 minutos e dimensão até 4K; sem ffprobe, recusar.
- [x] Reutilizar disco privado Laravel `local`, caminho isolado por cliente+UUID, sem URL pública nem acesso à chave de armazenamento no payload de resposta.
- [x] Aplicar cota `max_indoor_storage_mb` do plano, limite de segurança padrão, lock do cliente, rollback e remoção de blob em exceção.
- [x] Atualizar catálogo do Estúdio por API existente com ativos novos `ready`, thumbnails/vídeos TV somente por preview assinado de curta duração.
- [x] Expor API própria e client-scoped para consultar/salvar camadas TV com revisão inteira otimista e proibição de edição pós-publicação.
- [x] Reutilizar `story_layout.version=1`, até 12 camadas tipadas `text`/`band`, restrições de coordenadas, fonte, cor e texto; sem HTML/CSS/JS fornecidos pelo cliente.
- [x] Integrar 3 modelos personalizáveis (Oferta, Aviso, Boas-vindas) ao editor responsivo, com prévia aproximada e edição por cena salva.
- [x] Publicar snapshot `story_published` na ativação da playlist sob transação, compatível com manifesto TV existente e separado da publicação de destino/grade.
- [x] Impedir sobrescrita de cenas avançadas da agência, edição de playlists ativas e exposição de mídias de outro cliente.
- [x] Criar testes Laravel Feature de upload, cotas, planos, acesso cruzado, preview/revisão, fail-closed e ativação; **testes escritos, não executados**.
- [x] Ampliar guardas Site: **30/30 verificações estáticas executadas e aprovadas**; documentação técnica e operação de deploy atualizadas.
- [ ] Executar PHP lint, PHPUnit/MySQL8, validação da API, OpenAPI e teste de vídeo com ffprobe no ambiente alvo.
- [ ] Executar `npm ci`, `npm run lint`, `npm run build`, BFF HTTP/TLS e QA real mobile/desktop.
- [ ] Homologar Player real em TV horizontal/vertical, mídia privada/MP4, sincronização/ACK, layout e segurança da veiculação.

**Roadmap global:** API **29/59**, Admin **25/57**, Site **13/34**, total **67/150 = 44,7%** dos macromarcos integralmente aceitos. Apesar do volume funcional, o macro de Estúdio ainda abrange edição avançada, áudio, hardware e aceites operacionais; não inflar o percentual sem conclusão. O trabalho avança nos critérios internos desse marco.

**Próximo bloco:** edição visual mais rica com controle de layers e presets, transcodificação assíncrona segura para vídeos pesados, envio/mixagem de rádio sob direitos e QR/ACK de reprodução real; priorizar desbloqueio de CI e homologação.

## Sprint MVP ampliada — Estúdio Simples + ativação assistida + diagnóstico de Players (16/10/2026)

**Estado:** PRs definitivos [API #78](https://github.com/paulodias-dev/meucomercial-api/pull/78) e [Site #26](https://github.com/paulodias-dev/meucomercial-site/pull/26) mesclados na main; CI e homologação de dispositivos ainda não comprovados. **API #77, Site #25 e Admin #45 já foram mesclados na main**. O workflow Laravel da API disparado no PR #78 ([execução](https://github.com/paulodias-dev/meucomercial-api/actions/runs/38924801603)) concluiu como **failure em jobs sem etapas exibidas**; motivo ainda não confirmado, CI não é verde.

**Critérios de sprint, 15/18 implementados em código (83,3%); três homologações pendentes:**
- [x] Consultar catálogo TV pronto exclusivamente do cliente com paginação SQL, sem revelar armazenamento e com prévia local assinada curta.
- [x] Consultar músicas globais licenciadas e spots de Rádio privados com filtros por origem, paginação SQL e sem entregar S3 permanente.
- [x] Listar e abrir somente playlists do próprio cliente, devolvendo revisão SHA-256 e itens seguros, sem acesso lateral entre tenants.
- [x] Criar rascunho TV/Rádio de até 30 itens, formatos tipados, duração validada e propriedade/licença obrigatórias.
- [x] Editar rascunho sob lock e revisão otimista obrigatória; rejeitar sobrescrita concorrente e edição de playlist já ativa.
- [x] Ativar somente após `IndoorPublicationSafety` validar todo o conteúdo; transação desfaz ativação quando houver erro.
- [x] Duplicar playlist própria em rascunho isolado sem sobrescrever mídia aprovada nem transferir direitos de terceiros.
- [x] Revalidar vínculo da agência `can_self_publish` e plano ativo para leitura e escrita no Estúdio; não aceitar `client_id` do navegador.
- [x] Gateway Express com sete novas ações de Estúdio tipadas, IDs verificados e payload filtrado; corrigir `device_id` recebido como texto decimal.
- [x] Editor React responsivo: Rádio/TV, catálogo, adicionar/remover, ordenar, ajustar duração, rascunho, abrir, duplicar e ativar.
- [x] Prévia visual para JPG/PNG/MP4 locais por URL assinada, sem simular rádio ou fornecer objeto S3 privado; sem promessa de edição Canva completa.
- [x] Restaurar navegação persistente em todas as abas do portal e entregar playlist ativada diretamente à publicação já existente.
- [x] Checklist de primeiros passos por estado real de plano, grant, Player, pareamento, mídia, playlist e publicação.
- [x] Detalhamento paginado de destinos e sinais de sincronização por lote do cliente, sempre marcado como evidência operacional, não reprodução confirmada.
- [x] Testes PHPUnit de regressão escritos para posse, plano, licença, revisão, ativação, diagnóstico e isolamento; **25/25 verificações estáticas de contrato do Site passaram**. Documentos de arquitetura/QA adicionados.
- [ ] Executar PHPUnit com MySQL 8, gerar/verificar Swagger e validar testes de migração e permissões reais.
- [ ] Executar `npm ci`, lint, `npm run build` (Vite/TypeScript/BFF), testar HTTPS/E2E e responsividade em navegador real.
- [ ] Homologar Player físico Rádio/TV, codecs, links de mídia, sincronização, lease, ACK e trilha legítima de reprodução/audiência.

**Cobertura global por macromarcos ainda não encerrados:** API **29/59**, Admin **25/57**, Site **13/34**, total **67/150 = 44,7%**. Este marco ampliou consideravelmente a implementação de composição editorial e operação, mas a fase completa do Estúdio do plano macro inclui upload, Story Builder editável, cotas avançadas, QR confiável e Player real; não é honesto contabilizá-la como concluída antes disso.

**Próxima sprint:** upload seguro de imagens/vídeos, catálogo de templates e Story Builder simplificado para assinante; pareamento QR verificável e formalização de ACK de reprodução com relatórios, priorizando execução de CI e homologação. **Não usar `migrate:fresh` em produção.**

## Sprint MVP integrada — Autopublicação controlada do estabelecimento (16/10/2026)

**PRs definitivos da sprint:** [API #77](https://github.com/paulodias-dev/meucomercial-api/pull/77), [Site #25](https://github.com/paulodias-dev/meucomercial-site/pull/25) e [Admin #45](https://github.com/paulodias-dev/meucomercial-admin/pull/45). Mesclados na main; homologação de Player físico/CI ainda pendente. Testes físicos e deploy não realizados.

**Critérios técnicos — 11/14 implementados em código (78,6%); três gates continuam pendentes:**
- [x] Consultar exclusivamente playlists ativas do cliente, com paginação e mídia sem links privados.
- [x] Enumerar Players próprios elegíveis para TV/Rádio, informando impedimentos de localização, assinatura e conflito de grade.
- [x] Pré-validação técnica sem gravação, verificando mídia/licença, plano, agência, formato, direitos, período e destino.
- [x] Publicação de conteúdo **próprio** com lock por estabelecimento, chave UUID idempotente, referência de playlist, grade e versões de manifesto; sem duplicar mídia.
- [x] Histórico paginado e retirada idempotente somente de publicações do próprio assinante, preservando publicação administrativa separada.
- [x] Modelo de autoria segregado: `initiated_by_client_id` e `withdrawn_by_client_id` distintos das FKs de usuário operador; migration aditiva e rollback.
- [x] Concessão explícita `can_self_publish` por agência, desativada por padrão, validação Laravel fail-closed e revogação sem elevação de privilégios.
- [x] API do operador com RBAC `indoor_schedules.view/update`, pertença verificada e auditoria de quem concedeu/revogou.
- [x] Metronic mobile-first: controle contextual de permissão no workspace de Dispositivos, sem aproveitar estado de outra agência.
- [x] Portal responsivo: playlist → destinos → período → validação → confirmação, histórico/retirada; gateway HTTPS por seis rotas allowlist; JWT e UUID apenas em memória.
- [x] Testes de regressão PHPUnit escritos e guardas estáticas executadas: Site **19/19**, Admin **12/12**; documentação operacional e critérios de implantação.
- [ ] Execução verde de PHPUnit/MySQL 8 e validação real de migration/Swagger com logs.
- [ ] Execução verde de `npm ci`, TypeScript/Vite, teste HTTP real do proxy e QA responsivo por navegador.
- [ ] Homologação do Player TV/Rádio, streaming S3 privado, sincronização/ACK, concorrência em banco real e instalação física.

**Roadmap macro sem inflação:** API **29/59**, Admin **25/57**, Site **13/34**; **67/150 = 44,7%**. Esta entrega resolve subcritérios concretos do marco amplo de publicação/autoatendimento, mas não encerra sua totalidade: continuam criação de conteúdo, QR, revisão visual fiel, autorizações globais de rede, quotas e homologação de exibição. Este indicador representa cobertura de marcos, não prontidão de produção.

**Próximo bloco:** estender o Estúdio Simples de TV/Rádio ao portal com criação segura de conteúdo, preview audiovisual quando tecnicamente viável, QR para o primeiro Player e status de publicação recebido/exibido separados; resolver CI e homologação física antes de liberar produção.

## Sprint MVP — Comandos próprios do assinante, PIN e sincronização (16/10/2026)

**Estado:** PRs definitivos [API #76](https://github.com/paulodias-dev/meucomercial-api/pull/76) e [Site #24](https://github.com/paulodias-dev/meucomercial-site/pull/24) **mesclados na main**; sem evidência de deploy, CI verde, migração executada ou homologação física. Continuação direta do portal de leitura da sprint anterior. API + Site dependem um do outro.

**Critérios da entrega — 9/12 implementados em código:**
- [x] Gerar PIN temporário de 6 dígitos somente para dispositivo próprio, ainda não pareado e com assinatura ativa/trialing.
- [x] Reutilizar PIN ainda válido, expiração existente de 10 minutos e limitação de taxa por rota.
- [x] Proibir rotação de token de Player já pareado pelo assinante; manutenção/reconexão especial fica na agência.
- [x] Solicitar sincronização de Player próprio pareado, ativo e com assinatura elegível, sem liberar programação não autorizada.
- [x] Serializar por lock transacional e reutilizar comando pendente, sem duplicar fila nem inflar versão em cliques repetidos.
- [x] Registrar a origem `client_portal` e `client_id` no comando, sem forjar identidade de usuário operador.
- [x] Restringir gateway a duas ações de POST com IDs numéricos; rejeitar rotas, caminhos, IDs de agência/cliente arbitrários.
- [x] Exibir ações condicionadas ao estado real do dispositivo e da assinatura em UI responsiva, mensagens acessíveis, PIN apenas em memória e proteção contra resposta de sessão antiga.
- [x] Adicionar sete testes Feature PHPUnit de autenticação, acesso cruzado, PIN, bloqueio, assinatura e idempotência; ampliar guardas Node no Site.
- [ ] Executar PHPUnit/MySQL 8, Swagger e build Vite/TypeScript + testes HTTP reais em ambiente apropriado.
- [ ] Validar uso em dispositivos Rádio/TV reais (rede/lease/pareamento) e navegadores mobile; comandos pendentes **não** comprovam ACK de reprodução.
- [ ] Completar jornada de publicação própria guiada (prévia/destinos/grade) e QR/primeira programação; restrito à agência até sua autorização integral.

**Cobertura de macromarcos:** API **29/59**, Admin **25/57**, Site **13/34** = **67/150 (44,7%)**. Esta sprint encerra subcritérios operacionais, mas **não** encerra o macromarco de autoatendimento/publicação/Player (QR, programação e homologação pendentes). Sem inflação artificial da porcentagem. A referência abaixo foi sincronizada com os PRs #75/#23 já mesclados na main.

**Próxima sprint:** publicação própria guiada pelo cliente, usando regras existentes de catálogo, programação, inventário, autorização e revisão; conectar confirmação de comando/pareamento em Player real e executar QA integrado sem operações destrutivas.

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
| [meucomercial-api](https://github.com/paulodias-dev/meucomercial-api/blob/main/roadmap.md) | 29 | 59 | 49,2% |
| [meucomercial-admin](https://github.com/paulodias-dev/meucomercial-admin/blob/main/roadmap.md) | 25 | 57 | 43,9% |
| [meucomercial-site](https://github.com/paulodias-dev/meucomercial-site/blob/main/roadmap.md) | 23 | 34 | 67,6% |
| **Plataforma completa** | **77** | **150** | **51,3%** |

> **Atualização do painel:** 16/10/2026. Baseline mesclado 67/150 e marco de CI do Site concluído no PR definitivo #35, com workflow verde, totalizando **68/150**; até o merge, o incremento permanece na branch do PR. Séries históricas abaixo são mantidas para rastreabilidade.

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

**17/34 marcos com evidência de implementação (50,0%) neste repositório.** GitHub Actions #38983541605 verde no PR #35; QA manual, staging, homologação de Player físico e deploy permanecem abertos. As descrições de situação abaixo registram um inventário histórico parcial e não substituem a contagem atual.

## Fase 1: Descoberta e Estruturação (Auditoria)

**Objetivo:** Inventariar os repositórios, documentar arquitetura/DER, definir padrões para IA e remover legados com rastreabilidade.  
**Situação neste repositório:** Parcial · 2/4 marcos identificados.

- [x] Arquitetura inicial e orientações de execução documentadas no `README.md`.
- [x] Código atual usa React, TypeScript, Vite e servidor Express (ver `package.json` e `server.ts`).
- [x] Criar `AGENTS.md` para componentes, SEO, acessibilidade, responsividade, conteúdo e integrações sem dados fictícios.
- [x] Auditar performance/SEO e a concentração de lógica em `src/App.tsx`; definir mapa de componentes e journeys de conversão. Ver `docs/SITE_SEO_PERFORMANCE_AUDIT_20261017.md`; Lighthouse mobile é outro marco ainda pendente.

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
- [x] Refatorar `src/App.tsx` em componentes de jornada, pricing, formulário e simulador com testes. Extraídos `HeroSimulator`, `CommercialBrief`, `LeadContactModal`, `StrategicConsultant`, `BenefitsSection`, `FeaturesSection`, `FinalContactCTA`; contratos tipados e regressão Node.
- [ ] Integrar CTAs com demonstração/agendamento e onboarding do cliente, mantendo rastreamento de atribuição.

## Fase 4: Módulo de Rádio Indoor

**Objetivo:** Desenvolver playlists musicais, grade de áudio e inserção automática de anúncios comerciais.  
**Situação neste repositório:** Não evidenciado no código · 0/3 marcos identificados.

- [x] Publicar página de demonstração real de Rádio Indoor com exemplo de playlists e locução comercial. Página `/radio-indoor` com locução sintetizada local, agenda ilustrativa e licença esclarecida; não constitui streaming de música nem Player real.
- [ ] Conectar exemplos de grade/intervalo de spots à API Rádio (somente quando a engine estiver pronta).
- [x] Produzir conteúdo de documentação e FAQs do Rádio sobre licença, curadoria e programação.

## Fase 5: Módulo de TV Indoor e Story Builder

**Objetivo:** Controlar telas e campanhas, editar layouts dinâmicos e reproduzir conteúdo conforme programação.  
**Situação neste repositório:** Parcial · 1/3 marcos identificados.

- [x] Simulador ilustrativo de TV corporativa disponível na landing page; **não é um Story Builder funcional**.
- [x] Integrar prévia de campanhas reais/templates do Story Builder com dados públicos seguros ou demonstração isolada. Rota `/demonstracao-tv`: quatro modelos locais, 16:9/9:16, texto editável, labels e testes Chromium. Não é Player real nem publicação.
- [ ] Conectar CTA de teste da TV a fluxo real de teste/onboarding; validar acessibilidade do simulador.

## Fase 6: Automação Financeira e Integração de Pagamentos

**Objetivo:** Administrar pacotes, cobrar de forma recorrente e bloquear/liberar recursos segundo o estado financeiro.  
**Situação neste repositório:** Parcial · 1/4 marcos identificados.

- [x] Calculadora comercial apresenta cenários de quantidade de telas e ciclo de cobrança.
- [x] Sincronizar preços, limites e disponibilidade com o catálogo de planos da API para evitar divergências comerciais. `PublicIndoorPricing` já apresenta somente planos ativos com divulgação explicitamente autorizada via API, preço DECIMAL, limites e CTA sem checkout. Testes em `scripts/test-indoor-catalog.mjs` e CI Site.
- [ ] Integrar checkout Mercado Pago/onboarding recorrente de forma segura (sem processar credenciais no browser).
- [ ] Integrar leads e assinaturas com atribuição UTM/funil e métricas de conversão.

## Fase 7: Produto 360º e Mercado Publicitário Indoor (nova frente estratégica)

**Objetivo:** Fazer do site comercial uma aquisição de duas pontas: estabelecimentos que contratam a solução Indoor e anunciantes que compram espaços de publicidade. **Situação:** Planejada · 0/3 marcos implementados.

- [x] **Proposta de valor e navegação por público.** Criar jornadas distintas e claras para Estabelecimentos (Rádio/TV, instalação, contrato recorrente, dispositivos) e Anunciantes (rede de pontos, segmentação, mídia disponível, campanhas, prova de exibição e proposta de veiculação). Manter página principal e identidade, com SEO/FAQ/CTAs próprios e sem prometer audiência ou cobertura não comprovadas.
- [x] **Captação e conversão bilateral integrada ao CRM/API.** Formulários/contexto de demonstração e contratação de estabelecimento distintos de solicitação de mídia por anunciante, com consentimento LGPD, antispam, UTM/origem, validações, deduplicação e encaminhamento comercial ao fluxo correto; exibir estados de envio e fallback, nunca simular lead salvo quando não estiver.
- [x] **Catálogo seguro de mídia/solicitação de proposta.** `/anunciar` mostra ofertas públicas curadas e autorizadas, filtro regional/meio, paginação SQL e CTA consentido com referência `offer_id`/UTM. Não revela preços privados, lotação nem dados de estabelecimentos. Sem reserva/checkout. API #94 deve ser mesclada antes do Site #45.

**Aceite da frente:** caminhos comerciais separados, rastreamento válido, leads registrados no CRM/API com finalidade/papel, LGPD revisada, dados reais e segurança do inventário; testes de conversão/SEO/mobile.
## Fase 8: Homologação, Refatoração e Deploy

**Objetivo:** Demonstrar qualidade ponta a ponta, estabilidade, performance e operação em produção.  
**Situação neste repositório:** CI aprovado · 1/5 marcos concluídos; 4 gates de QA/release pendentes.

- [x] Configurar CI com `npm ci`, `npm run lint` (`tsc --noEmit`) e `npm run build`, obtendo [check verde no PR #35](https://github.com/paulodias-dev/meucomercial-site/actions/runs/38983541605).
- [x] Criar testes E2E de formulários, links, consultor estratégico, simulação e falhas de rede. Suite Playwright/Chromium em GitHub CI cobre lead persistido por API HTTPS mock, 422/503, retry com idempotência, TV, Rádio, catálogo publicitário, atribuição UTM e roteamento privado.
- [x] Auditar Core Web Vitals, Lighthouse mobile, acessibilidade, SEO social/Open Graph e carregamento inicial. O CI executa Lighthouse mobile em `/`, `/demonstracao-tv` e `/anunciar`, publica JSON/score/FCP/LCP/CLS/TBT e confere canonical/OG em HTTP; **INP em campo e metas de otimização continuam pendentes**, pois laboratório não equivale a dados de usuários.
- [x] Revisar depoimentos, cálculos comerciais, LGPD/cookies e ausência de alegações não verificadas. Revisão **técnica/editorial** em `docs/SITE_COMPLIANCE_REVIEW_20261017.md` + testes de consentimento, finalidades, ausência de publicidade/preços inventados, cookies próprios e documentação de terceiros; **política jurídica aprovada ainda não publicada**, sem declaração de conformidade legal final.
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

## Sprint seguinte — Visão consolidada dos relatos de todos os Players (16/10/2026)

**Escopo:** API + Portal. Consolidação SQL read-only de TV/Rádio por estabelecimento autenticado, com segmentação temporal e por tipo e sem derivar audiência, receita ou veiculações comerciais de relatos próprios.

- [x] API: contrato `GET /api/client/indoor/playback-summary` com filtros 1/7/30, TV/Rádio/todos e paginação limitada.
- [x] API: totais reais por cliente, dispositivos com relatos, totais por formato e série diária UTC incluindo dias sem registro.
- [x] API: agrupamento SQL por dispositivo com left join, exibindo inclusive aparelhos sem relato sem multiplicar consultas (sem N+1).
- [x] API: testes Feature escritos para concorrência lógica de escopos, cliente externo, filtragem, 15 Players/12 por página e proteção de segredos.
- [x] Portal: gateway Express com allowlist fixa e validação de período, tipo e página; sem ID de cliente informado pelo navegador.
- [x] Portal: painel responsivo na área dos Players com filtros, série diária, totalizadores, paginação e estados de carga/erro/vazio.
- [x] Portal: guardas de contrato contra vazamento e confusão de relatos com audiência independente.
- [ ] Executar PHPUnit/MySQL8, TypeScript/Vite/Node e E2E com JWT no ambiente provisionado; revisar consultas com EXPLAIN e índices existentes.
- [ ] Homologar TV/Rádio real, discrepâncias de fuso, armazenamento offline e telemetria em aparelhos físicos.

**Macromarcos aceitos de referência:** API 29/59, Admin 25/57, Site 13/34 = **67/150 (44,7%)**. A entrega adiciona código, não altera automaticamente o percentual de homologação. **Ordem de merge:** API → Site. Não executar merge automático, limpeza de banco nem deploy.
