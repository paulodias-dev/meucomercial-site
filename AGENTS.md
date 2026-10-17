# AGENTS.md — Meu Comercial Site | Instruções de implementação

Escopo: todo o repositório `meucomercial-site`. Site público de aquisição de leads para SaaS de TV e Rádio Indoor com dois fluxos financeiros distintos.

## Engenharia e interface

- Stack existente: React 19, TypeScript 5, Vite 6, Tailwind CSS 4 e Express para API proxy; respeitar `src/App.tsx`, `src/components`, `server.ts` e `vite.config.ts`.
- **Mobile-first:** testar 320, 375, 390, 768, 1024 e 1440px. Não causar overflow horizontal, usar cabeçalhos curtos, CTAs táteis de 44px, contraste alto e estados carregando/erro/vazio reais.
- Preservar SEO, hierarquia H1/H2/H3, navegação por âncoras acessível, FAQ sem JavaScript obrigatório para compreender as condições e idioma pt-BR. Não adicionar componentes de UI incongruentes com Tailwind e estilos do projeto.
- Se criar novo componente, centralizar seus tipos em módulo específico quando útil; props explícitas, sem `any`, sem HTML injetado, sem links inseguros e sem bibliotecas novas sem justificativa.
- Criar testes de regressão que validem funcionalidades e contratos, e não só presença de strings. **Não afirmar CI/build green sem executar npm e verificar os steps.**

## Contratos de produto por público

| Público | Valor | Vínculo comercial | Evento que não pode ser inventado |
|---|---|---|---|
| Estabelecimento | TV/Rádio Indoor, conteúdos, locais e aparelhos | Assinatura/serviço próprio, licenças de música e hardware potencialmente separados | Não afirmar dispositivos homologados sem validação |
| Agência | Operação de carteira, programação, equipe e inventário autorizado | Membros e clientes permitidos em tenant; cliente não muda de dono ao vender anúncio | Não afirmar alcance global autorizado |
| Anunciante | Compra de espaço em pontos elegíveis TV/Rádio | Reserva/ordem publicitária, direitos de criativo, cotas e aprovação | Não garantir inserções antes da reserva |
  
- **Não misturar mensalidade SaaS do estabelecimento com compra de mídia por anunciante.**
- Jamais inventar preço de assinatura, desconto anual, ROI, audiência, número de clientes, depoimentos ou resultados. Sem catálogo de preços aprovado e consultado por API, **solicitar orçamento**, não simular tarifa fixa. Se exibir conteúdo de demonstração com números, rotular como **ilustrativo**.
- Bibliotecas musicais e spots não conferem licença universal. Dizer que direitos, arquivo, hardware e instalação podem exigir contratos próprios.
- `player_reported` é a conclusão informada por Player autenticado, não audiência auditada; nunca anunciar impressões garantidas, lucro garantido, listeners identificados ou execução a partir de heartbeat.

## Captação e privacidade

- Todo CTA de demonstração ou proposta abre o formulário integrado a `POST /api/commercial-leads`, mantendo o `kind` correto: `establishment`, `agency` ou `advertiser`. O site **não ativa conta, não cobra e não reserva anúncio**.
- Solicitação deve carregar `idempotency_key` (UUID reutilizado em tentativas da mesma submissão), `source`, `kind`, `name`, `company`, `email`, `whatsapp`, `consent` e os opcionais `segment/message/screens_count`. Analisar `utm_source/medium/campaign` sem ampliar a coleta sem consentimento.
- O campo invisível `website` é honeypot do backend. Nunca removê-lo da validação nem afirmar sucesso antes de `received: true` com 200/201 real. Após erro de rede ou 429/409/422, mostrar retorno específico e permitir retentativa idempotente.
- O backend controla acesso aos leads; `GET/PATCH /api/v1/site/commercial-leads` são exclusivamente Super Admin, nunca chamados no navegador público com credenciais administrativas.
- As mensagens do usuário são dados pessoais e não devem ser expostas em URL, logs, códigos QR, analytics de terceiros, texto alternativo ou clipboard silencioso.
- Não propagar e-mail/número em parâmetros de URL compartilhável; o WhatsApp só recebe dados após ação explícita e sem campos privados se não houver consentimento.

## Integração com API e Admin

- A API Laravel valida os tipos e persiste os três públicos na mesma tabela `site_commercial_leads`, diferenciando `kind`, `source` e UTM. O Admin Metronic exibe e qualifica o funil sob RBAC Master.
- Quando o contrato mudar, atualizar tipos, teste de API e Admin, rotas Express proxy, documentação e formulário juntos. Não duplicar lançamento financeiro nem criar cliente/tenant automaticamente ao receber um lead.
- O Admin possui autenticação JWT independente da landing page. Nada de token de Master embutido no JS do site.
- A home segmentada (`#para-quem`) deve preservar a navegação existente `#radio-indoor`, `#simulador` e `#planos` e evitar links quebrados.

## Portal de cliente /portal — MVP (não é o Admin)

- O portal React reside em `src/components/ClientPortal.tsx` e usa o login `auth:client`, **nunca JWT de `auth:api` ou token do Player**.
- JWT fica exclusivamente em memória. Não usar `localStorage`, `sessionStorage`, URL ou cookie de frontend para guardar token; cada refresh exige novo login até arquitetura de sessão BFF ser homologada.
- O proxy `/api/portal/:action` no `server.ts` deve ter **allowlist explícita de método e caminho**, backend HTTPS de ambiente, sem encaminhar `client_id` ou `X-Agency-Tenant` arbitrários e sem logar senha, corpo livre ou token.
- A API Laravel é a autoridade do escopo: `auth:client` + cliente ativo + `where('client_id', auth('client')->id())`; anúncios somente onde `advertiser_client_id` é do cliente. Portal não tem poder de administrar agências ou contratar publicidade.
- Visualização de locais, mídia e Players nunca recebe token, PIN, arquivo privado, URL S3 ou metadados sensíveis. Dados da biblioteca são somente metadados, sem downloads implícitos.
- As cinco abas do MVP são **serviços, Players, locais, biblioteca e pedidos como anunciante**, com loading/erro/vazio e paginação real; a versão não implementa checkout ou publicações.
- Testar `npm run test:portal`, backend `ClientIndoorOverviewTest`, rate limit e segregação multi-cliente, mais QA navegador HTTPS. Não declarar CI verde se jobs não executaram.

## Testes mínimos e entrega

1. `npm ci`, `npm run lint`, `npm run test:radio`, `npm run test:journeys`, `npm run build`. Marcar comandos como pendentes se o runner não executou.
2. Testar CTA de cada perfil: contexto correto, lead gravado via API, UUID idempotente, resposta real, consentimento, UTM, honeypot e erro de rede. Conferir no Admin: público correto e progresso de qualificação.
3. QA Chrome/Safari/Firefox e mobile, navegação por teclado, foco dos botões/tab, modal acessível, zoom a 200%, scroll/restauração, SEO, Core Web Vitals.
4. Alterações na `main` de produção somente por **PR definitivo (não draft)**. Atualizar `roadmap.md` por marcos totalmente concluídos e calcular proporção `concluídos / total` nos três projetos, sem inflar porcentagem por quantidade de commits.
5. Antes de marcar produção concluída, validar deploy, SSL, proxy da API, emails/config e plano de rollback. A entrega de código **não equivale** a site publicado e homologado.

**Prioridade:** credibilidade comercial, aquisição real de leads, segurança dos dados e experiência mobile limpa.

## Política permanente de sprints macro (decisão do produto — 17/10/2026)

**Instrução obrigatória em toda retomada do Meu Comercial:** ler primeiro `roadmap.md`, esta seção e os PRs ativos dos três repositórios. O usuário rejeitou entregas pequenas em sequência; preferir **blocos verticais completos e consideráveis**, integrando API, Site, Admin e Player quando fizer sentido. Objetivo de **pelo menos +5 pontos percentuais globais por sprint macro aceita**; não prometer esse ganho antes de executar os testes e aceitar os critérios.

**Medição:** baseline registrado 77/150 = 51,3%; cada unidade histórica é 0,6667 p.p. e NÃO é, isoladamente, um marco gerencial >=1 p.p.; ao menos 8 novas unidades antigas aceitas levam a 85/150 = 56,7%. Próxima meta conjunta **90/150 = 60,0%** (+13 unidades antigas); são unidades de aceite, não PRs nem 13 entregas. “5%” nesta política significa **5 pontos percentuais**, e não 5% relativo.

Criar PRs **não draft** coerentes por repositório, preservar `main`, registrar vínculos, rollback, evidências de PHPUnit/MySQL/Swagger e builds/QA onde aplicável. Não pontuar código apenas implementado, mocks isolados, CI sem steps, merge ou deploy como se fosse homologação. Uma correção crítica menor é admitida sem anular a meta macro. Ao reportar, explicitar valor entregue, progresso antes/depois, bloqueios objetivos e próximo pacote substancial. As regras de domínio, autorização e segurança acima continuam mandatórias.
