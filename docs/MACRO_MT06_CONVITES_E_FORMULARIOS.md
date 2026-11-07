# MT-06 — Agência obrigatória no contato legado e ativação de convites

- `LeadContactModal` agora carrega agências de `GET /api/portal/agencies`, sem arrays de tenants nem .env de dados de negócio. Para estabelecimento ou anunciante, exige selecionar agência ativa; nova agência segue fluxo global Master.
- `App.tsx` envia `agency_slug` com os leads correspondentes, jamais IDs de tenant ou valores fornecidos pela URL. Nova seleção invalida o UUID idempotente anterior; erro de rede sem mudança reutiliza a chave.
- `/convite` permite a quem recebeu código por e-mail escolher agência, definir nova senha e confirmar aceite. O token nunca vai à URL, a cookies nem a storage; é digitado e transmitido no corpo do POST pelo BFF allowlisted same-origin.
- O BFF encaminha unicamente `token`, `agency_slug`, `password`, `password_confirmation` e `terms_accepted`. A autorização e consistência de identidade são todas verificadas pela API.
- `/portal` apresenta link para ativação, sem fingir que convite concede cota, assinatura ou publicação.

**Dependência:** API MT-06 e migration implantadas antes do Site; Admin Metronic oferece envio do convite.

**QA pendente:** `npm ci && npm run build`, browser mobile 320/360/430, troca de agência após erro, leads para Ação Total Aracaju e Anápolis, candidatura de nova agência, expirado/replay/inválido, entrega SMTP, segurança de referrer, ausência de dados na URL e logs. Sem ações, deploy ou homologação executados nesta sessão.
