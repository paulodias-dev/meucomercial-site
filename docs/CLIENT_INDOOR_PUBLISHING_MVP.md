# Portal do estabelecimento — Publicação guiada de TV e Rádio

O componente `ClientPublications.tsx` está integrado ao portal `/portal` após o login exclusivo do assinante. Disponibiliza seleção de agência expressamente autorizada, playlists ativas do próprio cliente, Players elegíveis por página, seleção de até 100 destinos, vigência de até 31 dias, fuso IANA, validação técnica, confirmação idempotente com UUID, histórico e retirada. Não cria material nem conta veiculações.

O BFF Express expõe seis ações em allowlist de nomes estáticos (options, destinations, history, preview, create, withdraw) com método estrito, caminho fixo ou ID numérico validado. O token permanece na memória do React. Uma intenção repetida reutiliza o UUID; alterações no formulário invalidam a prévia e exigem nova validação. A API ainda é a autoridade de escopo, assinatura, agência, conteúdo e grade.

A agência precisa habilitar `can_self_publish` explicitamente no painel Metronic; o cliente não ganha autorização por estar meramente vinculado a um tenant. Sem agência aprovada, o portal informa a pendência e a API recusa publicar. Retirada de publicação anterior permanece disponível ao titular.

**Gates pendentes:** build TypeScript/Vite real, HTTP E2E/TLS no proxy, QA mobile/desktop, controle de acesso cross-client, MySQL 8/PHPUnit, streaming S3 e Player físico. Verificações estáticas de contrato do Site: 19/19 executadas e aprovadas no contexto desta sprint. A prévia é técnica, não simulação audiovisual nem prova de exibição.
