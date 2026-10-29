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


## Contratação administrativamente ativa, porém sem autorização de mídia

O acompanhamento recebe `operation.media_authorized` da API Laravel.
Ele NÃO deduz autorização de `provision.status=active`, pois assinatura
ativa pode ter mensalidade vencida, plano alterado ou inconsistência do
recibo PIX. A interface apresenta orientação genérica e suspende os sinais
de conclusão quando `media_authorized=false`, sem afirmar chargeback
inexistente. A API mantém exclusivamente a decisão financeira e não
retorna o motivo contábil ao código privado do solicitante.

O BFF verifica tipo booleano e coerência com `service_activated`.
Publicar **API primeiro**, em seguida Site; Admin é independente da
jornada privada. O teste Node de contrato é versionado; browser real,
TypeScript/Vite, backend/MySQL8 e Player físico continuam para QA final.
