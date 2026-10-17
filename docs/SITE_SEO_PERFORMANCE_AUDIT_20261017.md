# Auditoria objetiva do Site e contrato de qualidade — 17/10/2026

## Inventário e jornada real

- **Estabelecimento**: site `/` → jornada no componente `AudienceJourneys` → `POST /api/commercial-leads` com `kind=establishment`, consentimento e UTM → atendimento humano; portal `/portal` só após uma conta de cliente ativa. Um lead não é assinatura, contrato ou habilitação de Player.
- **Agência**: `AudienceJourneys` → lead `agency` → análise e eventual configuração de tenant/membership pelo operador autorizado; não cria carteira nem libera Players automaticamente.
- **Anunciante**: `AudienceJourneys` → lead `advertiser` → proposta condicionada à disponibilidade de inventário, direito do estabelecimento e contrato; não gera reserva, inserção ou recebível.
- **Rádio demonstração**: `/radio-indoor` → amostras por `SpeechSynthesisUtterance` geradas localmente por ação do visitante. Não acessa `/api/v1/player`, não carrega música licenciada e não informa execução ao backend.
- **TV ilustrativa**: `/#simulador` apresenta layouts fictícios; não confundir com renderização final do Player.
- **Portal**: `/portal` é SPA client JWT distinta da landing e da agência; o Express deve entregar `noindex/no-store` já no HTML bruto.

## Diagnóstico fundamentado no código

1. **Concentração**: `src/App.tsx` era um componente monolítico com cerca de 1.748 linhas antes desta sprint. Mistura estado da simulação, consultoria, seleção de proposta e captação. Extrair progressivamente `HeroSimulator`, `StrategicConsultant`, `CommercialBrief` e `LeadContactModal` preservando testes, estados de formulário e idempotência. Componentes atuais: `AudienceJourneys`, `RadioGuide`, `ClientPortal`, `SEO` e `CommercialTrust`. Esta auditoria não declara a refatoração completa.
2. **SEO HTML inicial**: o `index.html` já tem `<title>`, description, canonical, Open Graph e JSON-LD estáticos. A versão anterior servia esse mesmo documento indexável no `/portal` e retornava `200` para qualquer caminho desconhecido. A resposta do Express agora separa `/portal` (noindex), `/radio-indoor` (metadados específicos) e URLs inválidas (404). Bots sem JavaScript recebem a classificação correta.
3. **Provas comerciais**: a landing exibia uma faixa com nomes ilustrativos de empresas como se fossem clientes; não havia evidência de autorização. Removida. Eliminadas alegações de fidelidade e teste por sete dias sem oferta validada, links sociais fictícios, CNPJ não conferido e chamadas de ROI sem indicador medido. Este pacote não substitui validação jurídica, contratos nem política LGPD publicada.
4. **Fontes e performance**: `index.html` carrega fontes externas Google Fonts e o pacote principal reúne a home com partes do portal. Prioridade futura: medir LCP/INP/CLS/TTFB por dispositivo/rede, comparar antes/depois, reduzir fonte bloqueante, extrair componentes e separar chunks por rota. **Não há relatório Lighthouse real nesta entrega; o marco de Core Web Vitals continua aberto.**
5. **Privacidade e formulários**: JWT do portal fica na memória React, gateway restrito e respostas no-store; lead passa pelo endpoint público da API que exige consentimento e atribuição. Os documentos de privacidade/termos ainda precisam ser fornecidos e revisados por responsável jurídico; não apresentar texto inventado como política vigente. Os links do rodapé são solicitações por e-mail, não políticas publicadas.
6. **Qualidade anterior**: workflow Node/Vite do Site tem execuções verdes verificadas. API e Admin têm runs `failure` sem steps — estes resultados não provam falha nem sucesso de PHPUnit ou Metronic.

## Testes da sprint

- `npm run lint` — TypeScript.
- `npm run build` — contratos de Rádio, jornadas e portal; Vite + Express.
- `npm run test:http` **após build** — processo Express real, HTML bruto e canonical, proteção de `/portal`, 404, `/api/commercial-leads` com API HTTPS local fictícia, aceite verdadeiro versus falso, erros HTTP e consultor de templates.
- Nenhum certificado ou chave de teste é versionado. O teste gera certificado descartável em diretório temporário, usa `NODE_EXTRA_CA_CERTS` apenas no processo de teste e remove os arquivos.
- Não executar mocks HTTP contra ambiente real. O `openssl` e Node 22 são pré-requisitos do teste local.

## Pendências que impedem o aceite integral de release

- Lighthouse mobile, acessibilidade por teclado e leitor de tela, revisão de contrastes em 320/360/768/1440 px e métricas de conversão em campo.
- Política LGPD/cookies e termos jurídicos aprovados e **publicados** com base em controlador/retentor identificados.
- E2E de navegador para simulação, modal de lead, foco e navegação; o teste HTTP não prova interações React.
- Contratação/autopublicação só após aprovação de plano, escopo, direitos e Player. Sem preços inventados, falsas métricas de audiência ou promessa de teste gratuito.
