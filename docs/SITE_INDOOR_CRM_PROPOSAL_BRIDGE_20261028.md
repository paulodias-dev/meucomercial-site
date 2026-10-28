# Meu Comercial — Site: propostas Indoor e manifestação de interesse

## Fluxo
A etapa privada de solicitação pré-contratual já existente agora expõe
as propostas CRM apresentadas pelo Master após aprovação. O cliente lê
escopo, itens e valores, pode registrar interesse/ciência ou recusar.

No ambiente público, o código Bearer de 256 bits permanece em memória.
Para acompanhamento após fechar a aba, a rota /acompanhar permite inserir
UUID e código privado copiados manualmente; sem armazenamento local,
cookie ou código na URL. A rota é noindex no HTML servido e no React.

POST /api/indoor-contract-requests/:reference/proposal-response proxy para
Laravel /api/site/indoor/contract-requests/{reference}/proposal-response.
Solicita UUID de operação, expected_version, proposal_version e decisão.
Em caso de 409 ou validade alterada, o usuário atualiza os dados.
A confirmação só ocorre com a resposta real: proposal_acknowledged ou
proposal_declined; nenhum pagamento ou assinatura é realizado.

## QA reproduzível (versionado, não executado)
npm ci
npm run test:contracts
npm run test:indoor-proposal-response
npm run lint
npm run build
npm run test:acquisition:browser

Testar 320, 375, 768 e 1440px; teclado, impressão de propostas, tentativa
concorrente, token inválido, preço alterado, proposta retirada, expired,
status após recarregar a página, opção decline e tentativa repetida após timeout.

## Dependência
Mesclar API e aplicar migration incremental de proposal_id antes do Site.
Admin CRM pode compartilhar proposta já apresentada. Não há checkout
financeiro, assinatura, recebível ou ativação de dispositivo nesta entrega.
