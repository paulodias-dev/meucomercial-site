/**
 * Same-origin form handler for published agency pages. No browser JavaScript,
 * no cookies/JWT forwarded, no visitor data in URLs, error logs or analytics.
 */
import {agencySlugPattern} from './agency-landing-public.mjs';

export function landingContactResult(agency,slug,ok,message){
 const href='/p/'+agency+'/'+slug;
 const title=ok?'Solicitação recebida':'Não foi possível enviar';
 return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/>'+
  '<meta name="viewport" content="width=device-width,initial-scale=1"/>'+
  '<meta name="robots" content="noindex,nofollow"/><title>'+title+' | Meu Comercial</title>'+
  '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f7fc;'+
  'color:#15243a;font:16px system-ui,sans-serif}main{max-width:580px;margin:22px;padding:36px;'+
  'border-radius:18px;background:#fff;box-shadow:0 8px 30px #15243a14}h1{font-size:30px}'+
  'a{display:inline-block;margin-top:20px;color:#154aa3;font-weight:700;min-height:44px}</style>'+
  '</head><body><main role="status"><h1>'+title+'</h1><p>'+message+'</p>'+
  '<a href="'+href+'">Voltar à Landing Page</a></main></body></html>';
}

export function registerAgencyLandingContact(app,express){
 app.post('/p/:agency/:slug/leads',express.urlencoded({extended:false,limit:'12kb'}),async(req,res)=>{
  const {agency,slug}=req.params;
  if(!agencySlugPattern.test(agency)||!agencySlugPattern.test(slug))
   return res.status(404).set('Cache-Control','no-store').type('text').send('Página não encontrada.');
  const reply=(status,ok,message)=>res.status(status)
   .set('Cache-Control','private,no-store').set('X-Robots-Tag','noindex,nofollow')
   .set('Referrer-Policy','no-referrer')
   .set('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'")
   .type('html').send(landingContactResult(agency,slug,ok,message));
  const keys=['idempotency_key','name','company','email','phone','message',
   'utm_source','utm_medium','utm_campaign','consent','website'];
  const raw=req.body&&typeof req.body==='object'?req.body:{};
  const body={};
  for(const key of keys){
   const value=raw[key];
   if(value!==undefined&&typeof value!=='string')
    return reply(422,false,'Revise os campos e tente novamente.');
   body[key]=value??'';
  }
  if(!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(body.idempotency_key)||
    body.consent!=='1'||!body.name.trim()||(!body.email.trim()&&!body.phone.trim()))
   return reply(422,false,'Informe seu nome, um meio de contato e autorize o retorno.');
  try{
   const configured=process.env.MEUCOMERCIAL_API_URL?.trim();
   if(!configured)throw Error('API indisponível');
   const base=new URL(configured.endsWith('/')?configured:configured+'/');
   if(base.protocol!=='https:'&&!(process.env.NODE_ENV!=='production'&&
     ['localhost','127.0.0.1'].includes(base.hostname)))throw Error('Endpoint inseguro');
   const endpoint=new URL('site/agency-pages/'+agency+'/'+slug+'/leads',base);
   const response=await fetch(endpoint,{method:'POST',redirect:'error',
     headers:{Accept:'application/json','Content-Type':'application/json'},
     body:JSON.stringify(body),signal:AbortSignal.timeout(9000)});
   if(response.status===429)return reply(429,false,'Muitas solicitações. Tente novamente em instantes.');
   if(response.status===404)return reply(404,false,'Este formulário não está mais disponível.');
   if(response.status===409)return reply(409,false,'Esta tentativa mudou. Volte à página e envie novamente.');
   if(response.status===422)return reply(422,false,'Dados inválidos. Volte à página e revise os campos.');
   if(response.status!==200&&response.status!==201)
    return reply(503,false,'Serviço temporariamente indisponível. Tente novamente.');
   const result=await response.json();
   if(result?.received!==true)return reply(422,false,'Solicitação não recebida. Tente novamente.');
   return reply(200,true,'A agência recebeu sua solicitação e poderá retornar pelos contatos informados.');
  }catch{
   return reply(503,false,'Não foi possível confirmar o recebimento. Tente novamente.');
  }
 });
}
