# Jornada de criação e primeira publicação — Estúdio Simples

Portal do estabelecimento, disponível apenas depois do login `auth:client`:

1. **Primeiros passos** calcula sete etapas com informações da API (plano, concessão, Player, pareamento, biblioteca, playlist e publicação), exibindo progresso e navegação contextual sem inventar dados.
2. **Estúdio Simples** permite selecionar Rádio ou TV, consultar catálogo licenciado/privado paginado, montar até 30 itens, mudar duração, ordenar, salvar rascunhos, reabrir, ativar após checagem e duplicar playlists ativas para edição sem interromper grade existente.
3. **Prévia visual** usa URLs assinadas de curta duração para imagens/vídeos TV armazenados localmente, renderizando MP4 como vídeo real. Mídias externas e áudio privado não recebem URLs permanentes nem simulações falsas; a prévia de áudio é sequencial/metadata.
4. **Publicar conteúdo** recebe a playlist ativa vinda do Estúdio e conduz seleção de agência, destinos, datas, prévia técnica e confirmação idempotente.
5. **Ver Players** mostra conexão, sinalização de sync pendente e versão do manifesto por destino; nunca rotula heartbeat/sync como reprodução comprovada.
6. Navegação fixa do portal corrige desaparecimento das abas ao abrir Publicações; proxy normaliza o `device_id` decimal textual enviado pelo formulário, sem relaxar validação.

**Novas rotas no gateway allowlist:** 7 do Estúdio, 1 onboarding, 1 histórico de destinos, todos validados por verbo e ID numérico; JWT em memória, HTTPS a montante, sem caminho fornecido por usuário. Frontend mobile-first com feedback de erro, botões desabilitados no carregamento, controles acessíveis e paginação. Permissão da agência/entitlement sempre revalidada no servidor.

**Ainda pendente:** upload e gravação pelo assinante, presets/overlays Canva-like, QR de pareamento verificado, preview audiovisual de rádio, recepção de ACK real, suite e2e e homologação em dispositivos físicos. Não confundir biblioteca pronta com prova de exibição.
