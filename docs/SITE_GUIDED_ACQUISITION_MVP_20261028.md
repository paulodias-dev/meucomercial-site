# Macroentrega Meu Comercial — aquisição guiada Site/Portal (28/10/2026)

## Jornada funcional
1. Página pública mobile-first /contratar, seletor de perfil: estabelecimento, agência e anunciante.
2. Estabelecimento escolhe opcionalmente um plano publicado da API /api/indoor-plans; vê preço BRL oficial, período e limites cadastrados.
3. Anunciante pesquisa ofertas curadas em /api/indoor-catalog com região, meio e paginação real; não há reserva.
4. Agência envia pedido de condições específicas, sem preços inventados.
5. Formulário encaminha POST /api/commercial-leads com consentimento, idempotency_key, kind, source, UTM, dados e plan_id ou offer_id quando verificados.
6. Confirmação somente com received:true de resposta HTTP 200/201; conflitos, indisponibilidade, throttling e validações não viram sucesso.
7. CTAs no catálogo de planos, oportunidades, navegação e página de publicidade. Canonical e metadados em Express e React.

## Regras de segurança e consistência
- Não misturar receita SaaS do estabelecimento e pedidos publicitários.
- Somente IDs atualmente retornados no catálogo são transmitidos; Laravel revalida o estado ao gravar o interesse.
- URL aceita apenas os parâmetros de perfil, ID público e UTM; nunca nome, e-mail, WhatsApp, token ou corpo da solicitação.
- JWT de Master/agência/cliente e credenciais do Player não entram no Site público.
- Cada payload idêntico reutiliza UUID de envio; alterações do payload exigem novo UUID.
- Não persistir formulário ou JWT em localStorage, sessionStorage, cookies ou analytics.
- Não alterar a política de GitHub Actions.

## Limite técnico de checkout
A API pública oficial informa checkout_available:false para planos e
consultation_required para ofertas. Existe checkout de hospedagem e Landing
Pages, mas não há endpoint público de pagamento/contratação Indoor. Portanto
esta entrega implementa a aquisição comercial até o lead persistido.
A cobrança e assinatura efetivas dependem de contrato e integração financeira
específica, sem usar endpoints de outros produtos ou inventar pagamentos.

## QA reproduzível (não executado nesta sessão)
    npm ci
    npm run test:acquisition
    npm run test:indoor-catalog
    npm run lint
    npm run build
    npm run test:browser

Casos manuais: 320/375/390/768/1024/1440px, teclado e foco, carregamento,
vazio e falha do catálogo, troca de perfil e limpeza de ID, seleção despublicada,
envio repetido, timeout e 409/422/429/503. Testes de execução e homologação
permanecem pendentes e não bloqueiam nova macroentrega.

## Próximo bloco
Checkout Indoor real após aprovação de política contratual e financeira:
API de intenção de compra vinculada ao snapshot, consentimento de termos,
Mercado Pago verificado, idempotência e webhooks; depois UI correspondente.
