# Sprint — Relatórios detalhados de execução TV/Rádio no Portal

No cartão **Meus dispositivos → Ver histórico e diagnóstico → Consultar histórico de até 30 dias**, o cliente autenticado vê o novo `ClientPlaybackReports.tsx`.

- Períodos: últimas 24 horas, 7 dias ou 30 dias. Mídia: todos, TV ou Rádio; a seleção reinicia a paginação em 1.
- A API devolve 20 itens por página, contagem por tipo, data, playlist, item, manifesto, duração e, no Rádio, hora e posição na grade.
- O botão **CSV desta página** exporta apenas os resultados visíveis da página, com BOM UTF-8 para pt-BR, separador `;` e escape de aspas/caracteres potencialmente interpretados como fórmulas; sem token, IP, segredo de dispositivo ou URLs privadas.
- A tela abre a lista detalhada apenas por clique do assinante. AbortController cancela consultas antigas e evita renderizar retorno de seleção anterior. Sem `localStorage/sessionStorage`.
- Gateway Express `device-reports` aceita apenas método GET, caminho fixo, ID numérico positivo, enum de dias/mídia e página pequena validada. Não aceita tenant do navegador nem URL arbitrária.
- Os relatórios refletem a autodeclaração do Player, **não auditoria independente de audiência**. Comandos/ACK de manifesto permanecem exibidos separadamente.

**Verificações de contrato Site:** 39/39 passaram no harness de inspeção; faltam `npm ci`, `npm run build`, mobile 320px, HTTPS e E2E com JWT. Implantar API antes do Site. Sem reset de banco, merge automático ou alteração direta na `main`.
