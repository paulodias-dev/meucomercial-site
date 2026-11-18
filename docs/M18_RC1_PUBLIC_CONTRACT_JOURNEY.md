# M18 — Site público e contratação Indoor para RC 1.0

18/11/2026. Fluxo existente comprovado por leitura de componentes: planos publicados autorizados por API → seleção de agência → solicitação/lead idempotente → referência privada → proposta comercial apresentada → aceite de termos de contratação e recorrência → PIX emitido por API/GET autenticado do provedor → assinatura provisionada quando aprovada → Portal do cliente. O **catálogo público não é um checkout direto**; não inventar compra sem proposta/aceite e não usar o gateway comercial de uma agência para cobranças SaaS do Master.

## Gate implementado

`scripts/check-rc1-public-journeys.mjs` valida a presença e ligação real em fonte de `server.ts` BFF, `AcquisitionWizard`, escolha `/api/portal/agencies`, consulta `/api/indoor-plans`, lead `/api/commercial-leads`, `ContractTrackingPage`, consentimento em `IndoorCheckoutPanel`, PIX confirmado somente pelo servidor, `ClientOnboarding`, lead SSR e rotas públicas. Falha com exit code 1 caso a jornada esteja estruturalmente incompleta. Não contém mock de preço, faz request durante o gate ou inventa aceite bancário.

`npm run audit:rc1` executa a inspeção; `npm run check:rc1` executa regressões de aquisição, contratos, resposta a proposta, checkout e provisionamento mais a inspeção. O `npm run build` passa a exigir `audit:rc1` e mantém as suítes já integradas ao pipeline do Vite/SSR sem rodá-las duas vezes.

## Verificações obrigatórias antes do proprietário testar

```bash
npm ci
npm run check:rc1
npm run lint
npm run build
```

Ainda falta executar as rotas SSR em domínio HTTPS, 2 agências, plano da API real, POST idempotente, consentimento LGPD, telefone/e-mail, proposta/PIX sandbox, cadastro de cliente e navegação em mobile. Esses são gates de integração/homologação, não motivo para criar um segundo Site ou Checkout.

Newsletter de conteúdo, DMs antigos, marketplace externo, custom domains e pagamento automático a partir do card não são requisitos do RC1. A página atual informa a indisponibilidade da newsletter de forma transparente.

**Status:** fonte integrada e gate RC1 versionados; teste/build não executados neste atendimento. Não declarar 100% ou deploy aprovado. Admin oficial permanece exclusivamente Metronic React 9.5.0.
