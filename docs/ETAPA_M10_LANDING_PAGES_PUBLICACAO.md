# Etapa vertical M10 — Site público de Landing Pages de Agências

## Publicação real, sem novo frontend

A rota `/p/:agency/:slug` é atendida **antes do Vite e da SPA** pelo Express existente. Ela consulta uma única URL pública e somente leitura do Laravel: `GET /api/site/agency-pages/{agency}/{slug}`. O endereço Laravel vem da configuração server-side `MEUCOMERCIAL_API_URL` já utilizada pelo site; segredo/URL interna não entram no bundle Vite.

- HTML público renderizado no servidor, responsivo, com hero de agência, título, subtítulo, seções de benefícios/referências/FAQ, CTA HTTPS e rodapé.
- Identidade visual apenas por cores validadas do banco; nenhum logo privado é lido, copiado ou liberado sem consentimento.
- SEO crawler-readable: title, description, canonical absoluto, Open Graph, Twitter e idioma pt-BR; página publicada possui HTTP 200.
- Página ausente, rascunho, retirada do ar ou tenant inativo → 404 e noindex; indisponibilidade Laravel/config → 503 noindex e no-store; não se retorna homepage duplicada.
- Escape HTML para conteúdo da agência, sem React dangerouslySetInnerHTML, sem scripts, cookies, tracking fictício, redirects abertos, token ou checkout. CSP restrita, HTTPS upstream obrigatório em produção, timeout e redirect:error.
- Cache SSR de 30 segundos: uma retirada do ar pode levar até 30 segundos para surtir efeito nos caches já preenchidos.
- Não alterar Home, portal de clientes, contratos, autenticação ou outras jornadas públicas.

## Gates

Teste `npm run test:agency-landing` integrado ao build atual. Verifica contrato, slug/tenant, CTA, XSS, SEO server-side e estrutura. Em QA real executar:
```bash
npm ci
npm run lint
npm run test:agency-landing
npm run build
```
Depois publicar página pela API+Admin, abrir a URL real no navegador em celular e desktop, verificar código 200, metadata no HTML bruto, conteúdo, link externo, renovação de cache, e retirada com 404, em dois tenants.

Esta etapa **não cria checkout de Landing Pages, não mapeia domínio customizado e não cria sitemap dinâmico**. São capacidades separadas e devem ser aprovadas antes de anunciar esse escopo. Sem execuções de npm/build, navegador ou deploy nesta sessão.
