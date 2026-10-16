# Portal — Linha do tempo de TV própria no diagnóstico do Player

O componente `ClientDeviceDiagnostics.tsx` agora apresenta `own_playback_reported_24h` e lista até doze relatos recentes do Player (UUID, tipo, item, versão e hora). São dados exclusivos do estabelecimento conectado, obtidos via API já protegida por `auth:client`. Não há envio de token de Player, endereço IP, caminho físico ou evento publicitário bruto ao navegador.

O texto distingue explicitamente **relato autenticado do aparelho** de **certificação independente de audiência**. O layout mantém cartões mobile-first e não acrescenta chamadas de rede desnecessárias: amplia o contrato já existente de diagnóstico.

**Dependências:** API #80 (pareamento/diagnóstico) e o novo PR API com ledger/migration devem estar implantados antes do Site. A experiência ainda necessita QA real de responsividade e navegador. Guardas estáticas do portal exercitadas, mas não `npm ci && npm run build`.
