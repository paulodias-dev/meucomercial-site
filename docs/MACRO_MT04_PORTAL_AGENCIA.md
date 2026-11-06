# MT-04 — Seletor de agência no Portal público

**Depende da API MT-04** (não integrar primeiro). O site público usa o React existente em `src/components/ClientPortal.tsx` e o BFF Express já em `server.ts`; não instala novo aplicativo ou layout.

## Fluxo real

- `GET /api/portal/agencies` → proxy allowlist de `GET /api/client/agencies`, lista obtida exclusivamente de tenants ativos no MySQL.
- Seleção **obrigatória** da agência no login, cadastro, Google e recuperação de senha. Quando o link de recuperação chega com `?token=...&email=...&agency=...`, a mesma agência é pré-selecionada, validada contra o catálogo e enviada no POST de reset.
- `agency_slug` via JSON é encaminhado explicitamente pelo BFF Express para a API Laravel. Não aceitar IDs, cookies ou cabeçalhos informados por usuários como autorização. Nenhuma conta é encontrada pelo e-mail global.
- Portal pode exibir **aprovação pendente** sem anunciar pagamento, serviço ativo, slots, contrato assinado ou players prontos. A agência selecionada não é alterada depois da autenticação; uma nova sessão exige outro login.
- Login Google permanece condicionado à credencial validada pela API e aos termos na criação de identidade. O Google não pode ser utilizado para tomar a conta de uma empresa preexistente por e-mail comercial.
- A identidade da marca e o layout mobile existentes foram preservados.

## Ponto deliberadamente não modificado nesta etapa

O *wizard de aquisição comercial* (`AcquisitionWizard`), leads de anunciantes, propostas e pré-contratos usam o fluxo Master existente. **A escolha de agência e a propagação da preferência para leads/contratações precisam de schema, rastreamento e decisão comercial aprovados; não seria seguro passar `agency_tenant_id` do browser diretamente ao gateway financeiro.** Isso deve ser tratado em MT-05 sem alterar estados de contratação quitada automaticamente. Candidatura de uma nova agência deve seguir Master, não selecionar uma agência concorrente.

## Verificações

```bash
npm ci
npm run build
npm test
```

Verificar o script de testes suportado no `package.json` antes de executar. Testar portal mobile 360/430 px, catálogo sem agências, agência inativa, mesma pessoa nas duas agências, email conflitante dentro do mesmo tenant, Google, recuperação com link e token de agência diferente, sessão persistida e logout.

**Não executados:** npm, lint, build, browser ou testes reais Google. Sem mudança de credenciais no `.env`; o servidor mantém apenas URL/segredos de infraestrutura. Sem merge automático.
