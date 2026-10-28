# Site — relatos de execução dos Players

Na tela privada de acompanhamento o contratante vê, além de unidades,
pareamento e publicações:
- quantos Players enviaram ao menos um relato de conclusão TV/Rádio
  nas últimas 24h;
- quantas conclusões o servidor aceitou na mesma janela;
- texto explícito de evidência: relato autenticado do aparelho, **não**
  auditoria independente de audiência, download, disponibilidade ou ROI.

A API só conta eventos reais em \`indoor_own_playback_events\` associados
ao mesmo Client, agenda, lote editorial e alvo publicado.
Não se considera comando enfileirado, heartbeat ou sync como execução.
Em ausência de relato pode haver outbox offline; não afirmar falta de
entrega. Em disputa financeira, o progresso operacional é suspenso.

Nunca mostrar IP, PIN, bearer, ID de aparelho, mídia, localização,
event_uuid ou dados do cliente da agência.

QA versionado e não executado nesta sessão:
npm run test:indoor-player-reports
npm run test:indoor-editorial-progress
npm run build
npm run test:acquisition:browser
