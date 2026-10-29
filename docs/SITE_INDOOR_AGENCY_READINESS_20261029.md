# Continuação do MVP — Acompanhamento privado do vínculo de agência

A API informa somente operation.agency_ready (booleano). Não devolve
agência, tenant_id, quotas, dados de clientes ou plano do parceiro ao
código de acompanhamento privado.

Quando os Players estão pareados, mas a agência responsável não possui
vínculo/entitlement válido, o estado passa a assign_agency_for_publication.
O cliente vê orientação de preparação pelo administrador, sem tentativa
de criar vínculo no Site, sem pagamento adicional e sem prometer exibição.

O BFF exige booleano agency_ready nas respostas com operação; a UI mostra
uma etapa específica no progresso da implantação. Os mocks de navegador
cobrem o fluxo antes e depois da agência estar apta.

Ordem de publicação: API primeiro, Admin e Site coordenados depois.
Testes Node, TypeScript/Vite, Chromium e integração real ainda não
executados nesta sessão. Sem GitHub Actions nem deploy.
