# Site Meu Comercial — solicitação pré-contratual Indoor

## Jornada integrada
A página /contratar já recebe três perfis. Somente estabelecimento
que selecionou plano oficial e recebeu confirmação do POST de lead pode
abrir uma solicitação pré-contratual opcional.
Agência e anunciante continuam no funil comercial já existente, sem preço
nem contratação de mídia fictícios.

A nova etapa aceita expressamente condições de análise não vinculantes.
O frontend gera UUID de intenção e segredo aleatório de 256 bits,
transmitidos ao BFF same-origin. O serviço Laravel PR #193 valida lead,
plano e preço. Sucesso exige referência, payment_created=false,
subscription_created=false e contract_signed=false retornados da API.
Estado pode ser atualizado, e pedido pendente cancelado com token e CAS.

## Privacidade
Não armazenar código privado em cookies, localStorage, sessionStorage
ou URL. Cópia para clipboard apenas quando solicitada explicitamente.
Após refresh, o código deixa a memória; cliente pode buscar assistência
com protocolo da primeira solicitação. A página não expõe JWT de Master.
BFF só aceita endpoints fixos, IDs UUID e um único bearer específico;
sempre HTTPS salvo localhost no desenvolvimento. Nunca encaminha cookies.

## Testes versionados, não executados nesta sessão
npm ci
npm run test:contracts
npm run test:acquisition
npm run lint
npm run build
npm run test:acquisition:browser

QA: mobile 320–1440px, status sem token, segredo errado, 422, 409, 429,
reenvio por timeout com mesmo UUID e segredo, cancellation CAS, refresh,
contexto trocado, plano despublicado, sem efeitos financeiros.
