# M11 · Formulário público da Landing Page integrado ao CRM da agência

Macroentrega única com API Laravel e Metronic 9.5.0 oficial. **Não** cria outro frontend nem pipeline financeiro.

## Jornada

1. O Laravel publica `capture_enabled` exclusivamente quando a página é `published` e o tenant está ativo.
2. O SSR Express `GET /p/:agency/:slug` desenha um formulário somente quando `capture_enabled === true`, com nome, empresa opcional, e-mail ou telefone, mensagem, consentimento LGPD e `website` honeypot. Campos UTM (source/medium/campaign) são escapados, opcionais e limitados. UUID por renderização, sem JavaScript.
3. `POST /p/:agency/:slug/leads` recebe `application/x-www-form-urlencoded`, usa allowlist dos campos, URL upstream configurada server-side em `MEUCOMERCIAL_API_URL`, HTTPS em produção, limite 12 KB, timeout 9s, redirects proibidos, sem cookies/JWT. A própria API decide agência, autorização de publicação e idempotência.
4. Só mostra “Solicitação recebida” se API respondeu 200/201 e `received === true`; erros 404/409/422/429/503 são exibidos claramente sem expor conteúdo pessoal, stacktrace ou IDs internos.
5. Resposta de sucesso/erro: noindex, no-store, sem PII, volta para LP. Página com formulário tem `Cache-Control: private,no-store` para não compartilhar o UUID entre visitantes; página sem formulário mantém cache público de 30s. CSP autoriza somente `form-action 'self'`, sem scripts.
6. CTA externo HTTPS e SEO SSR existentes continuam funcionais. O formulário é opção de captura, não substitui o CTA original.

## QA (pendente de execução real)

```bash
npm ci
npm run test:agency-landing
npm run lint
npm run build
```
Em dois tenants e navegadores reais: 320/375/390/768/1024/1440px, teclado e leitores de tela; sem JS; consentimento; email/telefone; honeypot; retentativas, indisponibilidade/upstream timeout, concorrência, retirada da LP/tenant e conteúdo injetável. Confirmar no CRM da agência que o registro foi gravado realmente antes de considerar “recebido”.

## Implantação e rollback

API/migração M11 primeiro → Site → Admin. Reverter Site por commit sem destruir dados; em falhas, desabilitar captura ou retirar página do ar. O SSR não tem cookies próprios. Sem analytics de visitas ou vendas fictícias. Testes Node/npm/browser e deploy não executados via conector GitHub; não declarar produção homologada.