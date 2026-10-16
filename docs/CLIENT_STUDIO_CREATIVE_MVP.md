# Estúdio visual do assinante — imagens, vídeos e modelos de TV

O Meu Comercial passa a conectar **upload privado → biblioteca licenciada → playlist rascunho → composição TV → ativação → publicação** usando os serviços da plataforma, sem armazenamento público de arquivos ou novo Player.

No Site, `ClientStudio.tsx` recebe JPG/PNG até 12 MiB e MP4 até 24 MiB com título amigável e `POST /api/portal/studio-upload`. O proxy Express exige o JWT de cliente, limita a leitura binária a 24 MiB, repassa somente para uma rota fixa HTTPS da API e nunca recebe `client_id`, nome de disco nem URL arbitrária. MIME/codec/quota são novamente verificados no Laravel.

O novo `ClientStoryEditor.tsx` oferece três modelos (Oferta especial, Aviso, Boas-vindas), chamada, descrição e cor de faixa. O preview da cena usa a mídia já autorizada e uma representação CSS aproximada; o salvamento envia o schema tipado `story_layout.version=1` com coordenadas verificadas pela API. Alteração em sessão antiga recebe 409 e exige atualização. A ativação grava snapshot para Player; publicar e confirmar recepção continua sendo etapa separada.

**Limitações declaradas:** não há upload de áudio pelo assinante, mixagem, vídeos transcodificados, fontes customizadas, drag-and-drop de layers, integração de QR, prova de audiência nem confirmação de publicação por teste físico nesta etapa. Reprodução exata no Player deve ser homologada. A inclusão de templates não é publicação automática.

**Ação para QA:** instalar/autorizar ffprobe no backend, executar suites de Laravel/MySQL 8 + Node/TS/Vite e testar origem TLS, upload concorrente/cota e execução do layout em TV real. Não usar `migrate:fresh` de produção.
