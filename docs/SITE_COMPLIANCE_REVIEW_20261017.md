# Revisão comercial, privacidade e cookies — 17/10/2026

## Escopo da revisão técnica
Examinados: site público, formulário `LeadContactModal`, `App`, `AudienceJourneys`, `CommercialTrust`, demonstrações TV/Rádio, rotas Express, metadados da home e guia de proposta publicitária. Este documento **não** é política de privacidade, parecer jurídico ou relatório externo de conformidade LGPD.

## Achados e ações

1. **Referências e depoimentos** — A versão antiga exibiu nomes de empresas ilustrativas como se fossem clientes, sem autorização/documentação verificada. O PR #41 retirou esses nomes, redes sociais simuladas e a referência legal/CNPJ sem validação. Não há depoimentos de clientes com autorização neste pacote.
2. **Promessas de retorno, preços e planos** — O PR #41 removeu estimativas de engajamento de 80%, prazo de atualização de 10 segundos, condições de fidelidade e teste grátis por sete dias sem aceite comercial. O preço final depende de proposta, direitos autorais, capacidade e contrato. O catálogo de anúncios do PR #42 é **editorial**, sem dados privados de inventário, ocupação ou preços; a disponibilização de espaços ainda aguarda um contrato público de curadoria autorizado pela API. **Esse macromarco permanece pendente.**
3. **Finalidade e consentimento** — O formulário exige opt-in explícito para responder a uma solicitação, diferencia estabelecimento/agência/anunciante, envia os identificadores de campanha UTM e chave de idempotência; não declara agendamento, assinatura ou venda antes de confirmação pela API. Foi esclarecido o uso de nome, empresa, e-mail e WhatsApp, com canal de solicitação de informações. Falhas de rede não produzem falso sucesso e não trocam a chave durante retry.
4. **Cookies e armazenamento** — O formulário público não precisa de cookie próprio, `localStorage` ou tag de pixel para atribuição: a origem vem de parâmetros UTM na URL e acompanha a solicitação. O Portal usa cookie de sessão HttpOnly same-origin, opcionalmente persistente por até 30 dias quando o cliente escolhe continuar conectado; não grava JWT em `localStorage` ou `sessionStorage`. Não afirmar que terceiros não armazenam dados: o site **usa Google Fonts externo**, o que permite requisições à infraestrutura do provedor e exige avaliação de privacidade/transferências pelo controlador.
5. **Textos jurídicos** — O rodapé oferece e-mail para **solicitar** a política e termos; isso **não equivale a publicá-los**. A criação, revisão jurídica, publicação e eventuais banners/consentimento de cookies quando serviços de tracking forem introduzidos continuam pendentes e devem ter responsável e versão assinada.
6. **SEO e dados privados** — `/portal` recebe `noindex/no-store` no HTML bruto do Express; páginas públicas específicas recebem canonical/OG; navegação privada e JWT não integram payload de rastreamento.

## Verificações automatizadas
`node --test scripts/test-site-compliance.mjs` valida escopo de consentimento, declaração de não contratação, ausência de garantias inventadas, decisão de não usar cookies públicos para a jornada, e a representação honesta da política ainda não publicada. Tests HTTP/Chromium verificam resposta a falha de rede, retries, UTM e separação da área privada.

**Aceite limitado:** revisão de código/conteúdo e testes técnicos concluídos; **compliance jurídico final, política pública aprovada, retenção, DPA, inventário de terceiros e solicitações de titulares NÃO foram homologados**. Não confundir este marco editorial de revisão com a prontidão LGPD para produção.
