# Site Meu Comercial — proposta comercial e manifestação de interesse

## Jornada
Quando o Master associa uma proposta CRM apresentada e vigente a uma
solicitação Indoor aprovada, o solicitante poderá consultá-la usando
a referência UUID e o código de acesso privado de 256 bits já gerado.

A página /acompanhar e a etapa pós-lead /contratar exibem o mesmo componente:
título, escopo, itens, valor BRL textual, validade e estado da proposta.
O cliente pode confirmar ciência/interesse (checkbox + confirmação) ou
recusar. Uma confirmação não assina contrato e não gera recebível, PIX,
assinatura ativa nem reserva de Player. Proposta retirada, alterada ou
vencida bloqueia manifestação positiva; backend decide sobre elegibilidade.

## Segurança
BFF Express disponibiliza somente POST allowlisted
/api/indoor-contract-requests/:reference/proposal-response, via HTTPS,
validando UUID, decisão, versões e confirmação. Segredo transmitido no
Authorization Bearer da solicitação e jamais em URL, localStorage, cookie
ou analytics. Idempotência de retry por fingerprint do corpo + UUID.

## QA versionado, não executado nesta sessão
npm ci
npm run test:contracts
npm run test:proposal-response
npm run lint
npm run build
npm run test:acquisition:browser

Testar 375px/390px/768px/desktop, teclado, proposta modificada, 409,
429, senha incorreta, troca de versão, duplo clique e retry. Nenhuma
homologação externa deve impedir desenvolvimento do MVP.
