# Auditoria Lighthouse mobile — consolidação do MVP

## Escopo
O fluxo GitHub Actions do Site compila Express/Vite, roda testes TypeScript/Node/Chromium e executa Lighthouse mobile sobre três rotas reais do **servidor Express compilado**: `/`, `/demonstracao-tv` e `/anunciar`. Grava os relatórios JSON como artefatos da execução `Site / Portal quality`.

Verificações: FCP, LCP, CLS, TBT, pontuações de Performance, Acessibilidade e SEO, e URLs canônicas válidas por rota. Usa Chromium e emulação mobile padrão do Lighthouse, sem depender de uma conta de analytics.

**Limites:** Lighthouse mede condições sintéticas de laboratório. Não informa **INP real de usuários**, conversões, auditoria de dispositivos de produção ou velocidade de banda dos estabelecimentos. Pontuação baixa é uma oportunidade de melhoria, **não é escondida por este teste**. O CI falha se os JSONs não contêm métricas válidas, mas não cria uma garantia de meta de Performance antes de haver baseline e budget aprovado.

## Critérios de aceite
- `npm ci`, `npm run lint`, `npm run build` e contratos de Portal, Rádio e catálogo sem erros.
- E2E Chromium com viewports 375 e 390: composições de TV acessíveis, filtro de formatos, seleção de cidade válida/inválida, CTA atribuído por `kind` e UTM, envio com JWT ausente (lead público), confirmação somente após HTTP 201 real do mock HTTPS, retorno 503 sem falso sucesso e tentativa manual recuperável.
- Crawlers recebem `200` e Open Graph/canonical independentes nas três rotas. `/portal` continua `noindex`; URLs inválidas retornam 404.
- Relatórios Lighthouse de três rotas acessíveis no próprio workflow; números de LCP/FCP/CLS/TBT são impressos no log.
- Revisão com Lighthouse real em Chrome mobile e monitoramento de **INP em campo** posteriores à publicação. Não afirmar auditoria em hardware real nem certificar Core Web Vitals de usuários.

## Segurança comercial
O catálogo **não** consulta inventário privado, não apresenta disponibilidade por cidade, não reserva mídia, não expõe receita nem fornece preços não autorizados. `/demonstracao-tv` usa apenas layouts e textos locais, sem publicação real. O formulário existente mantém consentimento, idempotência, antispam e persistência na API Laravel — testes usam backend HTTPS descartável, não alteram CRM de produção.

## Execução local
```sh
npm ci
npm run lint
npm run build
npm install --no-save --no-package-lock playwright@1.57.0 lighthouse@12
npx playwright install --with-deps chromium
npm run test:http
npm run test:browser
# Para Lighthouse, reproduza a etapa "Lighthouse mobile audit" em .github/workflows/site-quality.yml
```
