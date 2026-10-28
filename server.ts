import express from "express";
import path from "path";
import {readFileSync} from "node:fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const requestedPort = Number(process.env.PORT ?? '3000');
const PORT = Number.isInteger(requestedPort) && requestedPort > 0 && requestedPort < 65536 ? requestedPort : 3000;

app.use(express.json());

// Strategic templates by business segment
const FALLBACKS: Record<string, string> = {
  escritorio: `### 🏢 Estratégia de TV Corporativa para Escritórios & Corporações

Sua comunicação interna precisa ser ágil e engajadora para conectar equipes remotas e presenciais. Aqui está seu plano de conteúdo personalizado:

#### 1. Canais e Divisões de Tela Recomendados
* **Zona Principal (60%):** Metas mensais, conquistas de colaboradores (Aniversariante do Mês, Boas-vindas), avisos da diretoria em vídeo.
* **Zona Lateral (30%):** Feed de Notícias RSS, Previsão do tempo local, Próximas reuniões.
* **Ticker Inferior (10%):** Frase motivacional ou avisos curtos (ex: "Favor atualizar o ponto até sexta-feira").

#### 2. Calendário de Conteúdo Sugerido
* **Segunda-feira:** Vídeo do CEO ou resumo dos objetivos da semana.
* **Quarta-feira:** Destaques de bem-estar ou "Dica do Especialista".
* **Sexta-feira:** Fotos de happy hour e aniversariantes do final de semana.

#### 3. Resultados a monitorar (sem projeção de ROI)
* Estabeleça a linha de base antes da instalação e compare indicadores da operação ao longo do tempo.
* Analise somente resultados medidos por sua empresa. Nenhum percentual de vendas, retenção ou satisfação é garantido.
* Relatórios de conexão dos Players não substituem medição de audiência nem comprovam impacto financeiro.

*Pronto para ver isso rodando em suas TVs? Fale agora mesmo com nossos especialistas para agendarmos uma demonstração real!*`,

  varejo: `### 🛍️ Estratégia de Mídia Indoor para Varejo, Lojas e Supermercados

Sua tela deve ser uma máquina de conversão e ponto de contato visual imediato com o consumidor. Aqui está seu plano de conteúdo personalizado:

#### 1. Divisão de Tela Estratégica
* **Zona Principal (70%):** Vídeos de alta qualidade dos produtos mais vendidos, ofertas-relâmpago e promoções sazonais.
* **Zona Lateral (20%):** Feed de entretenimento (curiosidades, notícias) para reter a atenção do cliente e diminuir a percepção do tempo de espera.
* **Ticker Inferior (10%):** Código QR Code com link para o Instagram da loja ou cupom de desconto exclusivo.

#### 2. Dicas de Promoção Dinâmica
* Altere ofertas de acordo com o horário (ex: café da manhã vs. almoço em supermercados).
* Use campanhas dinâmicas integradas a tabelas de preços ou atualize ofertas em menos de 10 segundos pelo celular.

#### 3. Resultados a monitorar (sem projeção de ROI)
* Estabeleça a linha de base antes da instalação e compare indicadores da operação ao longo do tempo.
* Analise somente resultados medidos por sua empresa. Nenhum percentual de vendas, retenção ou satisfação é garantido.
* Relatórios de conexão dos Players não substituem medição de audiência nem comprovam impacto financeiro.

*Quer converter mais clientes no PDV hoje? Fale agora mesmo com nosso time comercial!*`,

  academia: `### 🏋️ Estratégia de Mídia Indoor para Academias e Box de Crossfit

Mantenha seus alunos focados, motivados e informados sobre as novidades da academia. Aqui está seu plano de conteúdo personalizado:

#### 1. Divisão de Tela Recomendada
* **Zona Principal (65%):** Vídeos de treinos, demonstração de execução correta de exercícios, e avisos de novos horários ou modalidades de aulas.
* **Zona Lateral (25%):** Quadro de Destaques (Aluno em Destaque, Recordes) e fotos de eventos da academia.
* **Ticker Inferior (10%):** Alertas rápidos (ex: "Mantenha as anilhas guardadas") e horários de aulas especiais.

#### 2. Engajamento dos Alunos
* Incentive posts com a hashtag da sua academia no Instagram e mostre em tempo real na tela!
* Promova produtos adicionais como suplementos, parcerias locais e venda de planos anuais diretamente na TV.

#### 3. Resultados a monitorar (sem projeção de ROI)
* Estabeleça a linha de base antes da instalação e compare indicadores da operação ao longo do tempo.
* Analise somente resultados medidos por sua empresa. Nenhum percentual de vendas, retenção ou satisfação é garantido.
* Relatórios de conexão dos Players não substituem medição de audiência nem comprovam impacto financeiro.

*Mude a experiência da sua academia agora. Fale com um especialista da Meu Comercial!*`,

  clinica: `### 🏥 Estratégia de TV Corporativa para Clínicas, Hospitais e Consultórios

Transforme a sala de espera em um ambiente acolhedor, educativo e esteticamente profissional. Aqui está seu plano de conteúdo personalizado:

#### 1. Divisão de Tela Humanizada
* **Zona Principal (60%):** Dicas de saúde preventiva, vídeos institucionais apresentando a equipe médica e os novos procedimentos disponíveis.
* **Zona Lateral (30%):** Notícias de fontes confiáveis, previsão do tempo, horário de atendimento.
* **Ticker Inferior (10%):** Alertas gerais e orientações sanitárias importantes.

#### 2. Gestão de Espera Ativa
* Intercale dicas de saúde com curiosidades leves para acalmar pacientes ansiosos.
* Utilize a divisão de tela com integração opcional de senhas de atendimento (TV + Chamada de Senha).

#### 3. Resultados a monitorar (sem projeção de ROI)
* Estabeleça a linha de base antes da instalação e compare indicadores da operação ao longo do tempo.
* Analise somente resultados medidos por sua empresa. Nenhum percentual de vendas, retenção ou satisfação é garantido.
* Relatórios de conexão dos Players não substituem medição de audiência nem comprovam impacto financeiro.

*Torne sua clínica referência em inovação. Solicite contato de um consultor hoje!*`,

  geral: `### 📺 Estratégia de TV Corporativa e Mídia Indoor

A comunicação visual é a forma mais poderosa de se conectar com seu público. Aqui está o plano de conteúdo estratégico para o seu negócio:

#### 1. Pilares da Comunicação Eficiente
* **Clareza Visual:** Fontes grandes, textos objetivos e contraste de cores de alto padrão (exatamente como as telas da Meu Comercial oferecem).
* **Atualização Centralizada:** Nada de pen drives. Atualize suas telas remotamente a partir de qualquer computador ou smartphone.
* **Conteúdo Misto:** Alterne vídeos institucionais, avisos rápidos, notícias do dia e previsão do tempo para manter a audiência engajada.

#### 2. Como Começar Rápido
1. Escolha a quantidade de pontos de TV que seu espaço precisa.
2. Utilize nossos players compactos plug-and-play (basta conectar no HDMI e Wi-Fi).
3. Gerencie tudo pela nossa plataforma em nuvem segura e intuitiva.

*Fale com nossos consultores para desenhar o plano de implantação ideal para sua empresa!*`
};


// Proxy same-origin to Laravel. API base is server-only, never exposed in Vite.
// Configure MEUCOMERCIAL_API_URL ending in /api; example: https://api.example.com/api.
app.post("/api/commercial-leads", async (req, res) => {
  const configured = process.env.MEUCOMERCIAL_API_URL?.trim();
  if (!configured) {
    return res.status(503).json({message: "Canal de solicitações temporariamente indisponível."});
  }

  try {
    const base = new URL(configured.endsWith("/") ? configured : configured + "/");
    if (base.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && base.hostname === "localhost")) {
      return res.status(503).json({message: "Configuração de canal comercial indisponível."});
    }
    const endpoint = new URL("site/commercial-leads", base);
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      body: JSON.stringify(req.body),
      redirect: "error", // Never forward lead PII to a redirected upstream host.
      signal: AbortSignal.timeout(12000),
    });
    const payload = await upstream.json().catch(() => ({}));
    if (upstream.ok && payload.received !== true) {
      return res.status(502).json({message: "A API não confirmou a persistência da solicitação."});
    }
    res.setHeader("Cache-Control", "no-store");
    return res.status(upstream.status).json(payload);
  } catch {
    return res.status(503).json({message: "Serviço de contato indisponível. Tente novamente."});
  }
});

// Fixed public pre-contract BFF. A request key is a client-generated 256-bit
// capability, never an operator/Client JWT. No credentials in URL or cookies.
const contractReference=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const contractSecret=/^[0-9a-f]{64}$/i
const proxyIndoorContract=async(req:express.Request,res:express.Response)=>{
  res.setHeader('Cache-Control','private, no-store')
  res.setHeader('Referrer-Policy','no-referrer')
  const create=req.path==='/api/indoor-contract-requests'
  const cancel=req.path.endsWith('/cancel')
  const respond=req.path.endsWith('/proposal-response')
  const reference=req.params.reference
  if(!create&&(!reference||!contractReference.test(reference)))
    return res.status(422).json({message:'Referência inválida.'})
  const bearer=req.get('authorization')??''
  if(!create&&(!bearer.startsWith('Bearer ')||!contractSecret.test(bearer.slice(7))))
    return res.status(401).json({message:'Código de acompanhamento obrigatório.'})
  if(create&&(!contractReference.test(String(req.body?.request_id??''))||
    !contractReference.test(String(req.body?.lead_reference??''))||
    !Number.isSafeInteger(req.body?.plan_id)||req.body?.plan_id<=0||
    !contractSecret.test(String(req.body?.access_key??''))||
    req.body?.terms_accepted!==true))
    return res.status(422).json({message:'Revise a referência e os dados da solicitação.'})
  if(cancel&&(!contractReference.test(String(req.body?.request_id??''))||
    !Number.isSafeInteger(req.body?.expected_version)||req.body.expected_version<1))
    return res.status(422).json({message:'Dados do cancelamento inválidos.'})
  if(respond&&(!contractReference.test(String(req.body?.request_id??''))||
    !Number.isSafeInteger(req.body?.expected_version)||req.body.expected_version<1||
    !Number.isSafeInteger(req.body?.proposal_version)||req.body.proposal_version<1||
    !['acknowledge','decline'].includes(req.body?.decision)||
    (req.body.decision==='acknowledge'&&req.body.acknowledge_nonbinding!==true)))
    return res.status(422).json({message:'Manifestação ou versão inválida.'})
  const configured=process.env.MEUCOMERCIAL_API_URL?.trim()
  if(!configured)return res.status(503).json({message:'Análise comercial temporariamente indisponível.'})
  try{
    const base=new URL(configured.endsWith('/')?configured:configured+'/')
    if(base.protocol!=='https:' &&
      !(process.env.NODE_ENV!=='production'&&['localhost','127.0.0.1'].includes(base.hostname)))
      throw Error('unsafe')
    const target='site/indoor/contract-requests'+(create?'':'/'+reference+(cancel?'/cancel':respond?'/proposal-response':''))
    const endpoint=new URL(target,base)
    const payload=create?{
      request_id:req.body.request_id,lead_reference:req.body.lead_reference,
      plan_id:req.body.plan_id,email:req.body.email,
      access_key:req.body.access_key,terms_accepted:req.body.terms_accepted,
    }:cancel?{
      request_id:req.body.request_id,expected_version:req.body.expected_version,
    }:respond?{
      request_id:req.body.request_id,expected_version:req.body.expected_version,
      proposal_version:req.body.proposal_version,decision:req.body.decision,
      acknowledge_nonbinding:req.body.acknowledge_nonbinding===true,
    }:undefined
    const upstream=await fetch(endpoint,{
      method:req.method,redirect:'error',credentials:'omit',
      headers:{Accept:'application/json',
        ...(req.method==='POST'?{'Content-Type':'application/json'}:{}),
        ...(!create?{Authorization:bearer}:{}),
      },
      ...(req.method==='POST'?{body:JSON.stringify(payload)}:{}),
      signal:AbortSignal.timeout(12000)
    })
    const body=await upstream.json().catch(()=>({}))
    if(upstream.status>=500)return res.status(503).json({message:'Serviço indisponível.'})
    if(!upstream.ok)return res.status(upstream.status).json({
      message:typeof body.message==='string'&&body.message.length<=250?
        body.message:'Não foi possível registrar a análise.',
    })
    if(typeof body.reference!=='string'||!contractReference.test(body.reference)||
      body.payment_created!==false||body.subscription_created!==false||
      body.contract_signed!==false||typeof body.status!=='string')
      return res.status(502).json({message:'Resposta de análise inválida.'})
    return res.status(upstream.status).json(body)
  }catch{return res.status(503).json({message:'Análise comercial indisponível.'})}
}
app.post('/api/indoor-contract-requests',proxyIndoorContract)
app.get('/api/indoor-contract-requests/:reference',proxyIndoorContract)
app.post('/api/indoor-contract-requests/:reference/cancel',proxyIndoorContract)
app.post('/api/indoor-contract-requests/:reference/proposal-response',proxyIndoorContract)

// Two fixed, public read-only contracts; never expose MEUCOMERCIAL_API_URL,
// forward cookies/JWT or allow a query parameter to become an upstream path.
app.get(['/api/indoor-catalog','/api/indoor-plans'],async(req,res)=>{
  const config=process.env.MEUCOMERCIAL_API_URL?.trim()
  res.setHeader('Cache-Control','no-store')
  if(!config)return res.status(503).json({message:'Catálogo temporariamente indisponível.'})
  try{
    const base=new URL(config.endsWith('/')?config:config+'/')
    if(base.protocol!=='https:' && !(process.env.NODE_ENV!=='production' && base.hostname==='localhost'))
      return res.status(503).json({message:'Canal comercial indisponível.'})
    const endpoint=new URL(req.path==='/api/indoor-catalog'?'site/indoor/catalog':'site/indoor/plans',base)
    if(req.path==='/api/indoor-catalog'){
      const medium=req.query.medium
      if(medium!==undefined){
        if(typeof medium!=='string'||!['tv','radio'].includes(medium))
          return res.status(422).json({message:'Meio inválido.'})
        endpoint.searchParams.set('medium',medium)
      }
      for(const key of ['page','per_page'] as const){
        const value=req.query[key]
        if(value!==undefined){
          if(typeof value!=='string'||!/^[1-9][0-9]{0,3}$/.test(value)||
            Number(value)>(key==='per_page'?24:10000))
            return res.status(422).json({message:'Paginação inválida.'})
          endpoint.searchParams.set(key,value)
        }
      }
      const region=req.query.region
      if(region!==undefined){
        if(typeof region!=='string'||region.length>80||
           !/^[\p{L}\p{N}\s.'-]{2,80}$/u.test(region.trim()))
           return res.status(422).json({message:'Região inválida.'})
        endpoint.searchParams.set('region',region.trim())
      }
    }
    const upstream=await fetch(endpoint,{headers:{Accept:'application/json'},
      redirect:'error',signal:AbortSignal.timeout(8000)})
    if(!upstream.ok)return res.status(upstream.status===422?422:503)
      .json({message:'Consulta comercial indisponível.'})
    const payload=await upstream.json()
    if(!payload||!Array.isArray(payload.data)||payload.data.length>30||
      !['curated_authorized_offer_not_realtime_capacity','approved_active_plan_not_purchase'].includes(payload.evidence))
      return res.status(502).json({message:'Contrato comercial inválido.'})
    res.setHeader('Cache-Control','public, max-age=60')
    return res.status(200).json(payload)
  }catch{
    return res.status(503).json({message:'Catálogo temporariamente indisponível.'})
  }
})

// Allowlisted, same-origin proxy for CLIENT credentials only. It never
// forwards arbitrary paths, operator JWTs, cookies or query-controlled URLs.
// All JWTs remain in memory in the React portal; this gateway does not log them.
// Fixed binary BFF endpoint: no client IDs, arbitrary upstream paths or
// permanent public storage. Express bounds the in-memory stream at 24 MiB.
app.post('/api/portal/studio-upload',
  express.raw({type: ['image/jpeg','image/png','video/mp4'], limit: '24mb'}),
  async (req, res) => {
    const bearer = req.get('authorization') ?? '';
    if (!/^Bearer [A-Za-z0-9._~-]+$/.test(bearer))
      return res.status(401).set('Cache-Control','no-store').json({message:'Sessão inválida.'});
    const type = req.get('content-type')?.toLowerCase() ?? '';
    const name = req.get('x-studio-name') ?? '';
    if (!['image/jpeg','image/png','video/mp4'].includes(type)
      || !Buffer.isBuffer(req.body) || req.body.length===0 || req.body.length>24*1024*1024
      || !/^[a-zA-Z0-9%._~-]{1,450}$/.test(name))
      return res.status(422).set('Cache-Control','no-store')
        .json({message:'Selecione JPG, PNG ou MP4 e informe nome válido.'});
    try {
      const baseValue = process.env.MEUCOMERCIAL_API_URL?.trim();
      if(!baseValue)throw new Error('backend-missing');
      const base = new URL(baseValue.endsWith('/') ? baseValue : baseValue+'/');
      if(base.protocol!=='https:' &&
        !(process.env.NODE_ENV!=='production' && ['localhost','127.0.0.1'].includes(base.hostname)))
        throw new Error('upstream-unsafe');
      const upstream = await fetch(new URL('client/indoor/studio/media/upload',base),{
        method:'POST',headers:{
          Authorization:bearer,'Content-Type':type,'X-Studio-Name':name,
          Accept:'application/json',
        },
        body:req.body,signal:AbortSignal.timeout(30000),redirect:'error',
      });
      const body=await upstream.json().catch(()=>({message:'Resposta inválida.'}));
      return res.status(upstream.status).set('Cache-Control','private, no-store')
        .set('Referrer-Policy','no-referrer').json(body);
    }catch{
      return res.status(503).set('Cache-Control','no-store')
        .json({message:'Upload indisponível. Tente novamente.'});
    }
  });

const portalRoutes = {
  'login': {method: 'POST', backend: 'client/login', auth: false},
  'logout': {method: 'POST', backend: 'client/logout', auth: true},
  'overview': {method: 'GET', backend: 'client/indoor/overview', auth: true},
  'devices': {method: 'GET', backend: 'client/indoor/devices', auth: true},
  'campaigns': {method: 'GET', backend: 'client/indoor/campaigns', auth: true},
  'services': {method: 'GET', backend: 'client/services', auth: true},
  'locations': {method: 'GET', backend: 'client/indoor/locations', auth: true},
  'media': {method: 'GET', backend: 'client/indoor/media', auth: true},
  'pair-device': {method: 'POST', backend: 'client/indoor/devices/', auth: true},
  'sync-device': {method: 'POST', backend: 'client/indoor/devices/', auth: true},
  'claim-device': {method: 'POST', backend: 'client/indoor/devices/', auth: true},
  'device-diagnostics': {method: 'GET', backend: 'client/indoor/devices/', auth: true},
  'device-reports': {method: 'GET', backend: 'client/indoor/devices/', auth: true},
  'publication-options': {method: 'GET', backend: 'client/indoor/publications/options', auth: true},
  'publication-destinations': {method: 'GET', backend: 'client/indoor/publications/destinations', auth: true},
  'publication-history': {method: 'GET', backend: 'client/indoor/publications', auth: true},
  'publication-preview': {method: 'POST', backend: 'client/indoor/publications/preview', auth: true},
  'publication-create': {method: 'POST', backend: 'client/indoor/publications', auth: true},
  'publication-withdraw': {method: 'POST', backend: 'client/indoor/publications/', auth: true},
  'studio-catalog': {method: 'GET', backend: 'client/indoor/studio/catalog', auth: true},
  'studio-list': {method: 'GET', backend: 'client/indoor/studio/playlists', auth: true},
  'studio-create': {method: 'POST', backend: 'client/indoor/studio/playlists', auth: true},
  'studio-get': {method: 'GET', backend: 'client/indoor/studio/playlists/', auth: true},
  'studio-update': {method: 'PUT', backend: 'client/indoor/studio/playlists/', auth: true},
  'studio-activate': {method: 'POST', backend: 'client/indoor/studio/playlists/', auth: true},
  'studio-duplicate': {method: 'POST', backend: 'client/indoor/studio/playlists/', auth: true},
  'studio-story-get': {method: 'GET', backend: 'client/indoor/studio/playlists/', auth: true},
  'studio-story-update': {method: 'PUT', backend: 'client/indoor/studio/playlists/', auth: true},
  'onboarding': {method: 'GET', backend: 'client/indoor/onboarding', auth: true},
  'playback-overview': {method: 'GET', backend: 'client/indoor/playback-summary', auth: true},
  'publication-targets': {method: 'GET', backend: 'client/indoor/publications/', auth: true},
} as const;

app.all('/api/portal/:action', async (req, res) => {
  const action = req.params.action as keyof typeof portalRoutes;
  const route = portalRoutes[action];
  if (!route || req.method !== route.method) {
    return res.status(404).set('Cache-Control','no-store').json({message:'Recurso indisponível.'});
  }
  const configured = process.env.MEUCOMERCIAL_API_URL?.trim();
  if (!configured) return res.status(503).set('Cache-Control','no-store')
    .json({message:'Portal temporariamente indisponível.'});

  try {
    const base = new URL(configured.endsWith('/') ? configured : configured + '/');
    if (base.protocol !== 'https:' &&
      !(process.env.NODE_ENV !== 'production' && ['localhost','127.0.0.1'].includes(base.hostname))) {
      throw new Error('invalid-upstream');
    }
    const bearer = req.get('authorization') ?? '';
    if (route.auth && !/^Bearer [A-Za-z0-9._~-]+$/.test(bearer)) {
      return res.status(401).set('Cache-Control','no-store').json({message:'Entre novamente no portal.'});
    }
    // Only a numeric device ID may extend either allowlisted route.
    // Caller-controlled URLs, client IDs and agency contexts never reach the API.
    const deviceAction = action === 'pair-device' || action === 'sync-device' || action === 'claim-device' || action === 'device-diagnostics' || action === 'device-reports';
    const rawId = (action === 'device-diagnostics' || action === 'device-reports') ? req.query.device_id : req.body?.device_id;
    const normalizedDeviceId = typeof rawId === 'string' && /^[1-9][0-9]*$/.test(rawId)
      ? Number(rawId) : rawId;
    if (deviceAction && (!Number.isSafeInteger(normalizedDeviceId) || normalizedDeviceId <= 0)) {
      return res.status(422).set('Cache-Control','no-store')
        .json({message:'Dispositivo inválido.'});
    }
    if (action === 'device-reports' && (
      !['1','7','30'].includes(String(req.query.days ?? '7')) ||
      !['all','tv','radio'].includes(String(req.query.kind ?? 'all')) ||
      (req.query.page !== undefined && !/^[1-9][0-9]{0,3}$/.test(String(req.query.page))))) {
      return res.status(422).set('Cache-Control','no-store')
        .json({message:'Filtro de relatório inválido.'});
    }
    if (action === 'playback-overview' && (
      !['1','7','30'].includes(String(req.query.days ?? '7')) ||
      !['all','tv','radio'].includes(String(req.query.kind ?? 'all')) ||
      !['all','blocked','unpaired','offline','sync_pending','no_reports'].includes(String(req.query.attention ?? 'all')) ||
      (req.query.page !== undefined && !/^[1-9][0-9]{0,3}$/.test(String(req.query.page))))) {
      return res.status(422).set('Cache-Control','no-store')
        .json({message:'Filtro de relatório inválido.'});
    }
    const studioEntity = ['studio-get','studio-update','studio-activate','studio-duplicate'].includes(action);
    const studioRawId = req.method === 'GET' ? req.query.playlist_id : req.body?.playlist_id;
    const studioPlaylistId = typeof studioRawId === 'string' && /^[1-9][0-9]*$/.test(studioRawId)
      ? Number(studioRawId) : studioRawId;
    if (studioEntity && (!Number.isSafeInteger(studioPlaylistId) || studioPlaylistId <= 0)) {
      return res.status(422).set('Cache-Control','no-store')
        .json({message:'Playlist inválida.'});
    }
    const studioStory = action === 'studio-story-get' || action === 'studio-story-update';
    const storyRawPlaylist = req.method === 'GET' ? req.query.playlist_id : req.body?.playlist_id;
    const storyRawItem = req.method === 'GET' ? req.query.item_id : req.body?.item_id;
    const numericId = (value:unknown) => {
      const normalized = typeof value==='string'&&/^[1-9][0-9]*$/.test(value) ? Number(value) : value;
      return Number.isSafeInteger(normalized) && Number(normalized)>0 ? Number(normalized) : null;
    };
    const storyPlaylist = numericId(storyRawPlaylist);
    const storyItem = numericId(storyRawItem);
    if(studioStory && (!storyPlaylist || !storyItem))
      return res.status(422).set('Cache-Control','no-store')
        .json({message:'Cena inválida.'});
    if (action === 'publication-targets' &&
      (!['all','acknowledged','awaiting_ack','offline','sync_pending','playback_reported','awaiting_playback_report','needs_attention'].includes(String(req.query.delivery ?? 'all')) ||
        (req.query.page !== undefined && !/^[1-9][0-9]{0,3}$/.test(String(req.query.page)))))
      return res.status(422).set('Cache-Control','no-store')
        .json({message:'Filtro de distribuição inválido.'});
    const publicationTargets = action === 'publication-targets';
    const targetRawId = req.query.publication_id;
    const targetId = typeof targetRawId === 'string' && /^[1-9][0-9]*$/.test(targetRawId)
      ? Number(targetRawId) : null;
    if (publicationTargets && (!Number.isSafeInteger(targetId) || targetId <= 0)) {
      return res.status(422).set('Cache-Control','no-store')
        .json({message:'Publicação inválida.'});
    }
    const publicationWithdraw = action === 'publication-withdraw';
    const publicationId = req.body?.publication_id;
    if (publicationWithdraw && (!Number.isSafeInteger(publicationId) || publicationId <= 0)) {
      return res.status(422).set('Cache-Control','no-store')
        .json({message:'Publicação inválida.'});
    }
    const endpoint = new URL(deviceAction
      ? 'client/indoor/devices/' + normalizedDeviceId + (action === 'pair-device' ? '/pairing-pin' : action === 'claim-device' ? '/claim-pairing' : action === 'device-diagnostics' ? '/diagnostics' : action === 'device-reports' ? '/playback-reports' : '/sync')
      : publicationWithdraw
        ? 'client/indoor/publications/' + publicationId + '/withdraw'
        : publicationTargets
          ? 'client/indoor/publications/' + targetId + '/targets'
        : studioStory
          ? 'client/indoor/studio/playlists/' + storyPlaylist + '/items/' + storyItem + '/layout'
        : studioEntity
          ? 'client/indoor/studio/playlists/' + studioPlaylistId
            + (action === 'studio-activate' ? '/activate' : action === 'studio-duplicate' ? '/duplicate' : '')
          : route.backend, base);
    if (req.method === 'GET') {
      const page = req.query.page;
      const perPage = req.query.per_page;
      if (typeof page === 'string') endpoint.searchParams.set('page', page.slice(0,5));
      if (typeof perPage === 'string') endpoint.searchParams.set('per_page', perPage.slice(0,3));
      // The only additional query option on this gateway is a medium enum.
      if ((action === 'studio-catalog' || action === 'studio-list') &&
        ['tv','radio'].includes(String(req.query.kind))) {
        endpoint.searchParams.set('kind', String(req.query.kind));
      }
      if (action === 'device-reports' || action === 'playback-overview') {
        endpoint.searchParams.set('days', String(req.query.days ?? '7'));
        endpoint.searchParams.set('kind', String(req.query.kind ?? 'all'));
        if (action === 'playback-overview')
          endpoint.searchParams.set('attention', String(req.query.attention ?? 'all'));
      }
      if (publicationTargets)
        endpoint.searchParams.set('delivery', String(req.query.delivery ?? 'all'));
      if (action === 'publication-destinations' &&
        ['tv','radio'].includes(String(req.query.medium))) {
        endpoint.searchParams.set('medium', String(req.query.medium));
      }
    }
    const studioBody = ['studio-create','studio-update'].includes(action)
      ? {name: req.body?.name, kind: req.body?.kind,
          orientation: req.body?.orientation, items: req.body?.items,
          expected_revision: req.body?.expected_revision}
      : action === 'studio-activate'
        ? {expected_revision: req.body?.expected_revision}
        : action === 'studio-story-update'
          ? {expected_revision: req.body?.expected_revision,layout:req.body?.layout} : {};
    const upstream = await fetch(endpoint, {
      method: route.method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(route.auth ? {Authorization: bearer} : {}),
      },
      body: (req.method === 'POST' || req.method === 'PUT') ? JSON.stringify(action === 'login'
        ? {email: req.body?.email, password: req.body?.password}
        : action === 'claim-device'
          ? {pin: req.body?.pin}
        : action === 'publication-create' || action === 'publication-preview'
          ? {
              agency_tenant_id: req.body?.agency_tenant_id,
              playlist_id: req.body?.playlist_id,
              medium: req.body?.medium,
              device_ids: req.body?.device_ids,
              starts_on: req.body?.starts_on,
              ends_on: req.body?.ends_on,
              timezone: req.body?.timezone,
              idempotency_key: req.body?.idempotency_key,
            } : studioBody) : undefined,
      signal: AbortSignal.timeout(12000),
      redirect: 'error',
    });
    const payload = await upstream.json().catch(()=>({message:'Resposta inválida do serviço.'}));
    return res.status(upstream.status).set('Cache-Control','private, no-store')
      .set('Referrer-Policy','no-referrer').json(payload);
  } catch {
    return res.status(503).set('Cache-Control','no-store')
      .json({message:'Não foi possível consultar o portal. Tente novamente.'});
  }
});

// API: Strategic consultation
app.post("/api/consult", async (req, res) => {
  const { segment, additionalInfo } = req.body;
  
  if (!segment) {
    return res.status(400).json({ error: "O segmento é obrigatório." });
  }

  const normalizedSegment = String(segment).toLowerCase().trim();
  const infoText = additionalInfo ? String(additionalInfo).trim() : "";

  // Do not log free-text consultation details: they may contain personal data.

  const answer = FALLBACKS[normalizedSegment] || FALLBACKS.geral;
  await new Promise((resolve) => setTimeout(resolve, 800));
  return res.json({ 
    success: true, 
    answer: answer + `\n\n*(Nota: Esta estratégia foi preparada com base no segmento selecionado. Para soluções personalizadas e integradas, fale com nosso time!)*`
  });
});

// Setup Vite Dev Server / Static files handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Iniciando servidor em modo DESENVOLVIMENTO com Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Iniciando servidor em modo PRODUÇÃO...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {index: false}));
    // The authenticated client portal must never inherit the indexable public
    // homepage metadata, even for bots that never execute JavaScript.
    app.get(['/portal', '/portal/'], (_req, res) => {
      const html = readFileSync(path.join(distPath, 'index.html'), 'utf8')
        .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, nofollow, noarchive" />')
        .replace(/<meta name="googlebot"[^>]*>/, '<meta name="googlebot" content="noindex, nofollow, noarchive" />')
        .replace(/<link rel="canonical"[^>]*>/, '')
        .replace(/<link rel="alternate"[^>]*>/g, '')
        .replace(/<meta property="og:url"[^>]*>/, '')
        .replace(/<meta name="twitter:url"[^>]*>/, '');
      return res.status(200)
        .set('X-Robots-Tag', 'noindex, nofollow, noarchive')
        .set('Cache-Control', 'private, no-store')
        .set('Referrer-Policy', 'no-referrer')
        .type('html').send(html);
    });
    // The private tracking form must not be indexed or expose canonical URLs.
    app.get(['/acompanhar', '/acompanhar/'], (_req, res) => {
      const html = readFileSync(path.join(distPath, 'index.html'), 'utf8')
        .replace(/<title>[^<]*<\/title>/,
          '<title>Acompanhar pedido | Meu Comercial</title>')
        .replace(/<meta name="robots"[^>]*>/,
          '<meta name="robots" content="noindex, nofollow, noarchive" />')
        .replace(/<link rel="canonical"[^>]*>/, '');
      return res.status(200).set('Cache-Control','private, no-store')
        .set('X-Robots-Tag','noindex, nofollow, noarchive')
        .set('Referrer-Policy','no-referrer').type('html').send(html);
    });
    app.get(['/radio-indoor', '/radio-indoor/'], (_req, res) => {
      // Public social previews cannot rely on React hydration.
      const canonical = 'https://meucomercial.com.br/radio-indoor';
      const title = 'Demonstração de Rádio Indoor | Meu Comercial';
      const description = 'Ouça locuções geradas no navegador e conheça programação, licenças e contratação de Rádio Indoor.';
      const escapedTitle = title.replace(/&/g, '&amp;');
      const html = readFileSync(path.join(distPath, 'index.html'), 'utf8')
        .replace(/<title>[^<]*<\/title>/, '<title>' + escapedTitle + '</title>')
        .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="' + description + '" />')
        .replace(/<meta property="og:title"[^>]*>/, '<meta property="og:title" content="' + escapedTitle + '" />')
        .replace(/<meta property="og:description"[^>]*>/, '<meta property="og:description" content="' + description + '" />')
        .replace(/<meta property="og:url"[^>]*>/, '<meta property="og:url" content="' + canonical + '" />')
        .replace(/<meta name="twitter:title"[^>]*>/, '<meta name="twitter:title" content="' + escapedTitle + '" />')
        .replace(/<meta name="twitter:description"[^>]*>/, '<meta name="twitter:description" content="' + description + '" />')
        .replace(/<meta name="twitter:url"[^>]*>/, '<meta name="twitter:url" content="' + canonical + '" />')
        .replace(/<link rel="canonical"[^>]*>/, '<link rel="canonical" href="' + canonical + '" />')
        .replace(/<link rel="alternate"[^>]*>/g, '');
      return res.set('Cache-Control', 'public, max-age=300').type('html').send(html);
    });
    // Public pages get crawler-readable route-specific titles/canonicals.
    // These are editorial examples, not dynamic private media or live inventory.
    const showcasePages = [
      {route: ['/demonstracao-tv', '/demonstracao-tv/'], slug: 'demonstracao-tv',
       title: 'Prévia interativa de TV Indoor | Meu Comercial',
       description: 'Experimente modelos visuais ilustrativos de TV Indoor, sem publicar nem transmitir conteúdo.'},
      {route: ['/contratar', '/contratar/'], slug: 'contratar',
        title: 'Solicitar proposta de TV e Rádio Indoor | Meu Comercial',
        description: 'Consulte planos e oportunidades oficiais Indoor e envie solicitação comercial com segurança, sem checkout ou reserva automática.'},
      {route: ['/anunciar', '/anunciar/'], slug: 'anunciar',
       title: 'Publicidade em Rádio e TV Indoor | Meu Comercial',
       description: 'Conheça formatos de publicidade Indoor e solicite análise de disponibilidade com autorização e contrato.'},
    ];
    for (const page of showcasePages) {
      app.get(page.route, (_req, res) => {
        const canonical = 'https://meucomercial.com.br/' + page.slug;
        const html = readFileSync(path.join(distPath, 'index.html'), 'utf8')
          .replace(/<title>[^<]*<\/title>/, '<title>' + page.title + '</title>')
          .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="' + page.description + '" />')
          .replace(/<meta property="og:title"[^>]*>/, '<meta property="og:title" content="' + page.title + '" />')
          .replace(/<meta property="og:description"[^>]*>/, '<meta property="og:description" content="' + page.description + '" />')
          .replace(/<meta property="og:url"[^>]*>/, '<meta property="og:url" content="' + canonical + '" />')
          .replace(/<meta name="twitter:title"[^>]*>/, '<meta name="twitter:title" content="' + page.title + '" />')
          .replace(/<meta name="twitter:description"[^>]*>/, '<meta name="twitter:description" content="' + page.description + '" />')
          .replace(/<meta name="twitter:url"[^>]*>/, '<meta name="twitter:url" content="' + canonical + '" />')
          .replace(/<link rel="canonical"[^>]*>/, '<link rel="canonical" href="' + canonical + '" />')
          .replace(/<link rel="alternate"[^>]*>/g, '');
        return res.set('Cache-Control', 'public, max-age=300').type('html').send(html);
      });
    }
    app.get('/', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
    // Unknown URLs and missing assets must not be indexed as duplicate homepages.
    app.get('*', (_req, res) => res.status(404).set('X-Robots-Tag', 'noindex')
      .type('text/plain').send('Página não encontrada.'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Meu Comercial Server está rodando na porta ${PORT}`);
  });
}

startServer();
