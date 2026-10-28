# Site — conclusão da jornada financeira Indoor

Após o aceite, o cliente gera PIX e acompanha até paid_verified.
Somente o Master, no Admin, pode vincular Client e provisionar uma
Subscription ativa após GET autenticado ao Mercado Pago. A rota privada
/acompanhar passa a exibir checkout.provisioning.status=active e
subscription_created=true, service_activated=true, sem expor ID de
Client, receivable, subscription, credenciais ou dados documentais.

Status disputed informa suspensão da assinatura; a aplicação não oferece
reativação, estorno contábil ou novo PIX automaticamente.
Pareamento de Players e preparação de mídia são ações separadas.

Sem GitHub Actions. QA futuro:
npm run test:indoor-provision-status
npm run test:indoor-checkout
npm run lint
npm run build
npm run test:acquisition:browser

NÃO afirmar que Playwright/compilação/homologação foram executados aqui.
