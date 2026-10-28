# Site — etapa operacional da contratação Indoor

Na página privada /acompanhar, após o Master ativar a assinatura, o
cliente vê o andamento de instalação de TV e Rádio Indoor:
- unidades cadastradas (contagem);
- Players cadastrados e quantos foram efetivamente pareados;
- próxima ação: unidade, Player, pareamento ou programação editorial.

Os números são obtidos no checkout privado pela API, não por claims do
navegador. Não retornamos dados de unidades, dispositivos, PIN, token,
Client ID ou Subscription ID. A tela **não** interpreta sincronização
como reprodução confirmada; playlists e grades são editadas nos
módulos existentes do Admin e Player, não no checkout.

Um estorno ou contestação financeira mantém o serviço suspenso e
indica a revisão com o atendimento.

QA versionado e não executado neste PR:
npm run test:indoor-operation-progress
npm run test:indoor-provision-status
npm run lint
npm run build
npm run test:acquisition:browser

Sem GitHub Actions e sem antecipar homologação.
