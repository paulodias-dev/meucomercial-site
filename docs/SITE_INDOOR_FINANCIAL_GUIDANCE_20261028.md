# Site — orientação financeira após estorno ou chargeback

O backend é responsável por reconhecer o evento do Mercado Pago por
GET autenticado. A página privada de acompanhamento exibe apenas:

- \`awaiting_financial_reconciliation\` — conciliação pendente;
- \`under_financial_review\` — contrapartida registrada e caso em análise;
- \`manual_financial_review_required\` — valores e lançamentos exigem revisão.

O checkout não oferece botão para gerar novo PIX durante contestação.
Nenhum valor líquido, recibo, provider payment ID ou identificador
financeiro é exposto ao contratante. A assinatura não é restaurada
automaticamente por webhooks, solicitações do navegador ou reconhecimento
de contrapartida contábil.

QA versionado, não executado:
npm run test:indoor-financial-guidance
npm run test:acquisition:browser
npm run build
