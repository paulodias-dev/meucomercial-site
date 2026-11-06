# MT-05 — Agência escolhida na aquisição comercial pública

Complementa a MT-04 do Portal. A jornada `/contratar` agora busca as agências realmente ativas no mesmo proxy público `GET /api/portal/agencies` e exige escolha para `kind=establishment` e `kind=advertiser`.

- O frontend envia apenas `agency_slug`, nunca `tenant_id`, permissão de agência, chave de cobrança, acesso a Player ou ID de cliente.
- `buildAcquisitionPayload` valida que o slug está no formato esperado; Laravel revalida contra o banco, recusa agências inativas e grava preferência de atendimento no lead.
- A candidatura de uma **nova agência** (`kind=agency`) não pede uma agência concorrente: segue para o Master, sem plano de agência inventado.
- Reenvio idêntico preserva UUID e destino; trocar a agência gera conteúdo diferente e exige nova intenção de envio.
- Valor de plano, disponibilidade, contrato e pagamento continuam separados da escolha comercial. Não há encaminhamento automático para gateway de agência.

Testes alterados: `scripts/test-acquisition-journey.mjs` e `scripts/test-acquisition-browser.mjs` (catálogo remoto mockado, seleção no formulário e verificação do payload de três públicos).

**Ainda pendentes:** convergência de `LeadContactModal` e outros canais antigos com fluxo Master central, convidar/verificar clientes históricos, validação real de checkout e certificar testes MySQL/Playwright.

Comandos para execução manual após merge da API:
```bash
npm ci
node --test scripts/test-acquisition-journey.mjs
npm run build
node --test scripts/test-acquisition-browser.mjs
```

Nenhum comando foi executado nesta sessão; não declarar homologação ou alteração no banco. Sem dados rígidos no `.env`, projetos duplicados ou merge automático.
