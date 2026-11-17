import type {Express,Request,Response} from 'express';
import {
 agencyLandingPath,agencyLandingPublic,
 type AgencyLandingPublic,
} from '../src/lib/agencyLandingPublic';

const badInput=/[^a-z0-9-]/;
const validSlug=(v:string)=>v.length>=2&&v.length<=100&&
 /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
const errorMessage=(status:number)=>status===404
 ?'Página não encontrada ou não publicada.'
 : status===429?'Limite de consultas excedido.':'Serviço temporariamente indisponível.';

function publicBackendUrl(agency:string,slug:string,leads=false):URL{
 if(!validSlug(agency)||!validSlug(slug)||badInput.test(agency+slug))
  throw Error('Rota de página pública inválida.');
 const configured=process.env.MEUCOMERCIAL_API_URL?.trim();
 if(!configured)throw Error('API do site não configurada.');
 const root=new URL(configured.endsWith('/')?configured:configured+'/');
 const local=process.env.NODE_ENV!=='production'&&
  ['localhost','127.0.0.1'].includes(root.hostname);
 if(root.protocol!=='https:'&&!(local&&root.protocol==='http:'))
  throw Error('API do site precisa usar HTTPS.');
 if(root.username||root.password||root.search||root.hash)
  throw Error('URL de backend deve estar livre de credenciais.');
 return new URL('site/agency-pages/'+agency+'/'+slug+(leads?'/leads':''),root);
}

async function backendLanding(agency:string,slug:string){
 const upstream=await fetch(publicBackendUrl(agency,slug),{
  headers:{Accept:'application/json'},redirect:'error',cache:'no-store',
  signal:AbortSignal.timeout(12000),
 });
 if(upstream.status===404)return {status:404 as const,page:null,body:null};
 if(!upstream.ok)throw Error('Consulta indisponível.');
 const body=await upstream.json();
 const page=agencyLandingPublic(body,agency,slug);
 return {status:200 as const,page,body};
}

export function registerAgencyLandingApiRoutes(app:Express){
 app.get('/api/agency-pages/:agency/:slug',async(req:Request,res:Response)=>{
  try{
   const {agency,slug}=req.params;
   const result=await backendLanding(agency,slug);
   res.set('Cache-Control','no-store');
   if(result.status===404)return res.status(404).json({message:errorMessage(404)});
   return res.status(200).json(result.body);
  }catch{
   return res.status(503).set('Cache-Control','no-store')
    .json({message:'Página temporariamente indisponível.'});
  }
 });
 app.post('/api/agency-pages/:agency/:slug/leads',async(req:Request,res:Response)=>{
  try{
   const {agency,slug}=req.params;
   const endpoint=publicBackendUrl(agency,slug,true);
   const upstream=await fetch(endpoint,{
    method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify(req.body),redirect:'error',cache:'no-store',
    signal:AbortSignal.timeout(12000),
   });
   const body=await upstream.json().catch(()=>({}));
   res.set('Cache-Control','private, no-store');
   if(upstream.status===201||upstream.status===200){
    if(body.received!==true||body.lead_saved_to_agency_crm!==true)
     return res.status(502).json({message:'A API não confirmou a captura do contato.'});
    return res.status(upstream.status).json({
     received:true,lead_saved_to_agency_crm:true,
     reference:body.reference,
    });
   }
   if([404,409,422,429].includes(upstream.status))
    return res.status(upstream.status).json({message:
     upstream.status===422?'Revise os campos e seu consentimento.':
     upstream.status===409?'Já existe outra solicitação com este identificador.':
     errorMessage(upstream.status)});
   return res.status(503).json({message:errorMessage(503)});
  }catch{
   return res.status(503).set('Cache-Control','no-store')
    .json({message:'Não foi possível registrar seu contato neste momento.'});
  }
 });
}

const escapeHtml=(v:string)=>v.replace(/&/g,'&amp;').replace(/</g,'&lt;')
 .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
export function renderAgencyLandingHtml(template:string,page:AgencyLandingPublic):string{
 const canonicalRoot=(()=>{
  try{
   const v=new URL(process.env.APP_URL||'https://meucomercial.com.br');
   return v.protocol==='https:'&&!v.username&&!v.password&&!v.search&&!v.hash
    ?v.origin:'https://meucomercial.com.br';
  }catch{return 'https://meucomercial.com.br';}
 })();
 const canonical=canonicalRoot+agencyLandingPath(page.agencySlug,page.slug);
 const title=page.title+' | '+page.agencyName;
 const description=(page.subtitle||page.headline).slice(0,180);
 const ld={'@context':'https://schema.org','@type':'WebPage',
  name:page.title,description,url:canonical,inLanguage:'pt-BR',
  datePublished:page.publishedAt,publisher:{'@type':'Organization',name:page.agencyName}};
 const jsonLd=JSON.stringify(ld).replace(/</g,'\\u003c');
 const dynamic=[
  '<title>'+escapeHtml(title)+'</title>',
  '<meta name="description" content="'+escapeHtml(description)+'" />',
  '<meta name="robots" content="index, follow" />',
  '<meta name="googlebot" content="index, follow" />',
  '<meta name="theme-color" content="'+escapeHtml(page.primaryColor)+'" />',
  '<link rel="canonical" href="'+escapeHtml(canonical)+'" />',
  '<meta property="og:title" content="'+escapeHtml(title)+'" />',
  '<meta property="og:description" content="'+escapeHtml(description)+'" />',
  '<meta property="og:url" content="'+escapeHtml(canonical)+'" />',
  '<meta property="og:type" content="website" />',
  '<meta name="twitter:card" content="summary" />',
  '<meta name="twitter:title" content="'+escapeHtml(title)+'" />',
  '<meta name="twitter:description" content="'+escapeHtml(description)+'" />',
  '<meta name="twitter:url" content="'+escapeHtml(canonical)+'" />',
  '<script id="seo-jsonld" type="application/ld+json">'+jsonLd+'</script>',
 ].join('\n');
 // Remove homepage identity and SEO before appending scoped agency metadata.
 let html=template.replace(/<title>[^<]*<\/title>/gi,'');
 html=html.replace(/<meta\s+(?:name|property)="(?:description|keywords|robots|googlebot|theme-color|og:[^"]+|twitter:[^"]+)"[^>]*\/?\s*>/gi,'');
 html=html.replace(/<link\s+rel="(?:canonical|alternate)"[^>]*\/?\s*>/gi,'');
 html=html.replace(/<script\s+id="seo-jsonld"[^>]*>[\s\S]*?<\/script>/gi,'');
 // Render real, escaped editorial content for no-JS crawlers as well. React
 // createRoot replaces this initial markup with the interactive landing form.
 // Never render untrusted editor HTML or JavaScript.
 const sections=page.sections.map(part=>
  '<section><h2>'+escapeHtml(part.title)+'</h2><p>'+escapeHtml(part.body)+'</p></section>'
 ).join('');
 const article='<main lang="pt-BR" data-server-landing="true">'+
  '<header><p>'+escapeHtml(page.agencyName)+'</p></header>'+
  '<h1>'+escapeHtml(page.headline)+'</h1>'+
  '<p>'+escapeHtml(page.subtitle)+'</p>'+
  '<p><a href="'+escapeHtml(page.ctaUrl)+'" rel="noopener noreferrer">'+
   escapeHtml(page.ctaLabel)+'</a></p>'+sections+
  '<p>Solicite atendimento à agência pelo formulário nesta página.</p>'+
  '</main>';
 html=html.replace('<div id="root"></div>',
  '<div id="root">'+article+'</div>');
 return html.replace('</head>',dynamic+'\n</head>');
}

export function registerAgencyLandingHtmlRoute(
 app:Express,loadTemplate:(requestPath:string)=>Promise<string>,
){
 app.get('/p/:agency/:slug',async(req:Request,res:Response)=>{
  const {agency,slug}=req.params;
  if(!validSlug(agency)||!validSlug(slug))
   return res.status(404).set('X-Robots-Tag','noindex').send('Página não encontrada.');
  try{
   const result=await backendLanding(agency,slug);
   if(result.status===404||!result.page)
    return res.status(404).set('Cache-Control','no-store')
     .set('X-Robots-Tag','noindex, nofollow').type('text/plain')
     .send('Página não encontrada ou não publicada.');
   const html=renderAgencyLandingHtml(await loadTemplate(req.originalUrl),result.page);
   return res.status(200).set('Cache-Control','no-store')
    .set('Referrer-Policy','strict-origin-when-cross-origin')
    .set('X-Content-Type-Options','nosniff')
    .type('html').send(html);
  }catch{
   return res.status(503).set('Cache-Control','no-store')
    .set('X-Robots-Tag','noindex, nofollow')
    .type('text/plain').send('Página temporariamente indisponível.');
  }
 });
}
