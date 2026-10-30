# Portal do estabelecimento — Guia de implantação e QA

Este repositório disponibiliza a nova rota pública **`/portal`**, que mostra somente dados autorizados após login do cliente já cadastrado. O backend é o repositório `paulodias-dev/meucomercial-api`, documentado em `docs/CLIENT_INDOOR_PORTAL_MVP.md` **na API**.

## Fluxo implementado

1. O cliente entra em `/portal` por um link do menu do Site. Pode entrar com e-mail/senha, criar cadastro com aceite obrigatório dos termos ou usar Google Identity Services quando `VITE_GOOGLE_CLIENT_ID` estiver configurado. O proxy encaminha para `POST /api/client/login`, `POST /api/client/register` e `POST /api/client/google`.
2. O portal usa uma sessão same-origin protegida por cookie `HttpOnly`; o JWT não é gravado em `localStorage`, `sessionStorage` ou URL. Sem "Continuar conectado", o cookie é de sessão; com a opção marcada, ele permanece por até 30 dias. Logout limpa o cookie e solicita revogação à API.
3. Abas: serviços/assinaturas, Players, unidades/locais, metadados da biblioteca e anúncios que o cliente **comprou como anunciante**. A API filtra os itens por JWT e pagina, não há `client_id` controlado pelo visitante.
4. Totais operacionalmente corretos são `COUNT` SQL no backend: conexão recente de dispositivo e sincronização pendente **não significam** prova de música ou propaganda exibida.
5. Erros de permissão levam a uma nova autenticação. Respostas paginadas não ficam em cache entre abas ou clientes; navegação inclui estados vazio/carregamento/erro.

## Configuração

- Definir `MEUCOMERCIAL_API_URL` **somente no servidor Express**, terminando em `/api` (por exemplo, `https://api.exemplo.com/api`). Não usar `VITE_` nessa variável.
- O backend precisa de Laravel + JWT `client`, tabelas Indoor e migrações válidas, HTTPS, autenticação `EnsureActiveClient`, S3 conforme recurso real. A visão do portal não devolve S3 keys ou tokens de Player.
- Habilitar a rota Express `/api/portal/:action` com allowlist exata e preservar fallback SPA para `/portal`; nunca fazer proxy genérico de `/api/client/*` com parâmetros arbitrários.
- O endpoint de login tem limite de oito tentativas por minuto no Laravel. A recuperação usa `/api/client/forgot-password`, resposta genérica contra enumeração e link configurado por `CLIENT_PASSWORD_RESET_URL`.
- O cadastro grava versão, data, IP e user-agent do aceite em `clients`; login Google valida a credencial no backend e só cria uma nova conta após aceite. Configurar `GOOGLE_CLIENT_ID` na API e o mesmo Client ID público em `VITE_GOOGLE_CLIENT_ID` no Site.
- Não enviar JWT, senha, observações do visitante ou PII para logs ou serviços analíticos.

## Testes

```bash
npm ci
npm run lint
npm run test:portal
npm run test:journeys
npm run test:radio
npm run build
```

No backend: `php artisan test --filter=ClientIndoorOverviewTest` e `php artisan l5-swagger:generate`.

QA manual em 320, 375, 390, 768, 1024 e 1440px; Chrome, Safari e Firefox; sessão errada/inativa; dois clientes com locais e mídia distintos; página 11 de 103 Players; login/logout/expiração; erro de rede; rate limit; validação dos headers HTTP; página recarregada sem token persistente.

**Os testes PHP, o build real do site e o deploy HTTPS precisam de execução em ambiente apropriado.** Validação estática de arquivos não é homologação, e jobs do GitHub Actions que não executaram passos não fornecem aprovação do MVP.

## Próxima evolução

O fluxo de autenticação já usa BFF same-origin com cookie HttpOnly, SameSite e recuperação de senha. A próxima camada de evolução é a renovação segura sem expor o JWT ao React; pareamento guiado pelo cliente com autorização forte, atribuição de locais e publicação de playlist com confirmações. Integração de pagamentos e visualização de prova de veiculação exige contratos e RBAC distintos.


## Operações de dispositivo do assinante — continuação MVP (16/10/2026)

- `POST /api/client/indoor/devices/{device}/pairing-pin`: `auth:client`, cliente ativo, assinatura `active`/`trialing`, Player não bloqueado, ativo, sem `paired_at` e sem token existente. Retorna PIN de seis dígitos e expiração (10 minutos) em resposta `private, no-store`. Repetição antes da expiração reutiliza o mesmo código; não repareia equipamentos já autenticados. Throttle: 5/minuto.
- `POST /api/client/indoor/devices/{device}/sync`: mesmo escopo, mas exige Player pareado. Transação com lock na linha do Player, reaproveita `sync_now` pendente e incrementa a versão somente ao gerar novo comando. Corpo do comando marca a origem `client_portal`, mas `created_by` de operador fica nulo. Throttle: 10/minuto. Retorna **202 queued**, nunca ACK/reprodução.
- O Site expõe somente ações allowlisted em `/api/portal/:action` pelo proxy HTTPS de mesma origem; o cookie de sessão é HttpOnly e limitado ao caminho `/api/portal`. Aceita `device_id` inteiro seguro no corpo, não aceita IDs de agência/cliente nem URL livre. A UI mantém o token operacional apenas em memória, limpa token e PIN no logout e invalida respostas assíncronas de sessão anterior.
- Falhas: 401 sem sessão de cliente, 403 cliente inativo, 404 Player de terceiro, 409 sem direito de operar (dispositivo bloqueado, pareado no fluxo de PIN, sem assinatura ou sem pareamento na sync), 422 ID inválido no gateway, 429 throttle. A API nunca retorna device_token, PIN alheio, URLs privadas, serial ou metadados de outros clientes.
- Testes de contrato/API escritos nesta branch, mas `php artisan test`, `l5-swagger:generate`, MySQL 8, `npm ci && npm run build` e E2E HTTP/Player **não executados neste ambiente**. A documentação não autoriza ativação em produção sem homologar instalação, cobrança e reprodução.

