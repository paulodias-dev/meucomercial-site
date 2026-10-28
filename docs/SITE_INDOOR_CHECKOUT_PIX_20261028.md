# Site Meu Comercial — checkout formal e PIX Indoor

O cliente somente vê condições de pagamento após o Master compartilhar
uma proposta CRM e o cliente manifestar interesse. O Master prepara
condições finais imutáveis com versão e hash, sem inventar mensalidades.

Na página privada /acompanhar, a pessoa insere referência UUID e segredo
privado de 256 bits; aceita separadamente o texto e a recorrência.
Após HTTP confirmado, pode criar um PIX. O backend usa X-Idempotency-Key
e consulta o Mercado Pago autenticado. O Site não marca pagamento liquidado
por QR, webhook isolado, recibo ou clique. Mostra paid_verified somente
quando o ledger backend foi conciliado por GET seguro no gateway.

Rotas Express same-origin allowlisted:
POST /api/indoor-contract-requests/:reference/checkout-accept
POST /api/indoor-contract-requests/:reference/pix
GET  /api/indoor-contract-requests/:reference/pix
GET  /api/indoor-contract-requests/:reference
Todos usam Authorization: Bearer <segredo> sem colocá-lo na URL, cookie,
localStorage, sessionStorage ou analytics.

Código PIX pode ser recuperado no provedor, mas GET é read-only e não
liquida pagamento. O Site não tem acesso a credenciais Mercado Pago Master.

QA posterior ao código, fora de GitHub Actions:
npm ci
npm run test:indoor-checkout
npm run lint
npm run build
npm run test:acquisition:browser

Testar mobile e desktop, teclado, recusa de oferta expirada, termos com
hash alterado, falhas 429/409/422, PIX pendente, pago, refund/chargeback,
mesma chave após timeout, recuperação de QR e privacidade de token.

Em caso de tentativa 'creating' sem ID remoto, o botão de recuperação
POST /pix/retry reutiliza o UUID persistido na API, não cria uma segunda
chave nem exige que o navegador tenha preservado esse UUID em storage.
