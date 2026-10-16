# Portal do estabelecimento — Guia de implantação e QA

Este repositório disponibiliza a nova rota pública **`/portal`**, que mostra somente dados autorizados após login do cliente já cadastrado. O backend é o repositório `paulodias-dev/meucomercial-api`, documentado em `docs/CLIENT_INDOOR_PORTAL_MVP.md` **na API**.

## Fluxo implementado

1. O cliente entra em `/portal` por um link do menu do Site. Informa seu e-mail e senha cadastrados e recebe JWT de `auth:client` por `POST /api/portal/login` (proxy same-origin para `POST /api/client/login`).
2. O token permanece **somente na memória da aplicação React**. Nenhum token fica em URL, cookie compartilhado, `localStorage` ou `sessionStorage`. Refresh implica novo login; logout solicita revogação à API.
3. Abas: serviços/assinaturas, Players, unidades/locais, metadados da biblioteca e anúncios que o cliente **comprou como anunciante**. A API filtra os itens por JWT e pagina, não há `client_id` controlado pelo visitante.
4. Totais operacionalmente corretos são `COUNT` SQL no backend: conexão recente de dispositivo e sincronização pendente **não significam** prova de música ou propaganda exibida.
5. Erros de permissão levam a uma nova autenticação. Respostas paginadas não ficam em cache entre abas ou clientes; navegação inclui estados vazio/carregamento/erro.

## Configuração

- Definir `MEUCOMERCIAL_API_URL` **somente no servidor Express**, terminando em `/api` (por exemplo, `https://api.exemplo.com/api`). Não usar `VITE_` nessa variável.
- O backend precisa de Laravel + JWT `client`, tabelas Indoor e migrações válidas, HTTPS, autenticação `EnsureActiveClient`, S3 conforme recurso real. A visão do portal não devolve S3 keys ou tokens de Player.
- Habilitar a rota Express `/api/portal/:action` com allowlist exata e preservar fallback SPA para `/portal`; nunca fazer proxy genérico de `/api/client/*` com parâmetros arbitrários.
- O endpoint de login tem limite de oito tentativas por minuto no Laravel. Não oferecer recuperação de senha simulada: o fluxo real de `/api/client/forgot-password` requer interface e teste transacional separados.
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

Autenticação BFF HttpOnly + SameSite + CSRF com renovação segura; recuperação de senha; pareamento guiado pelo cliente com autorização forte, atribuição de locais e publicação de playlist com confirmações. Integração de pagamentos e visualização de prova de veiculação exige contratos e RBAC distintos.
