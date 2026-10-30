# Macroentrega — Mídia do assinante com crop e vídeo compatível

## Fluxo do cliente
O Studio do portal aceita imagens JPG/PNG (máximo 12 MiB), vídeos MP4/MOV/
WebM (até 64 MiB, 10 min) e oferece crop local de imagem em 16:9, 9:16,
1:1, ajuste de zoom e posição. O arquivo JPEG novo é realmente gerado
no navegador e reenviado somente após a confirmação.

## BFF
Rota fixa same-origin /api/portal/studio-upload, token Client JWT,
MIME allowlist, limite Express raw 64 MiB, limite por tipo (12/64),
nome estritamente validado e backend HTTPS fixo, sem SSRF e sem cookies
terceirizados. Timeout sobe para 150 segundos por conversão FFmpeg no Laravel.
O Laravel continua sendo a autoridade final para inspeção, armazenamento
privado, plano, quota e direitos.

## QA
Testes estruturais no npm build cobrindo alinhamento de MIME/tamanhos
cliente-BFF, geração real de pixels no Canvas e destino de API fixo.
Não foram executados neste turno; validar upload em browser real e
FFmpeg junto do MVP. Não usar homologação como bloqueio de código.
