# Site — publicação e reprodução não são o mesmo evento

Na página privada do contratante, a API informa apenas quantos
\`indoor_paid_editorial_launches\` possuem lote published e grade active,
com data final vigente. O cliente vê a etapa de conteúdo/programação
concluída quando existe ao menos um lote ainda vigente e publicado.

O número vem do backend; navegador e BFF não calculam resultado financeiro,
não fazem associação de mídia nem expõem dados internos do Player.
"Publicado" = grade + audit ledger + solicitação de sincronização.
"Reproduzido" exigirá evidência própria da reprodução no Player.

Em caso de chargeback, a assinatura fica suspensa e o acompanhamento
orienta acionar suporte, mesmo que haja histórico de publicação.

Testes a executar após MVP:
npm run test:indoor-editorial-progress
npm run test:indoor-operation-progress
npm run build
npm run test:acquisition:browser

Nenhuma homologação ou teste real de hardware executado neste PR.
