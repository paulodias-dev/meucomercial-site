import test from 'node:test';
import assert from 'node:assert/strict';
import {publicPagePayload,renderPublicAgencyPage,publicSitemapPayload,renderAgencySitemapIndex,renderAgencySitemapPage} from '../src/lib/agency-landing-public.mjs';
import {landingContactResult,registerAgencyLandingContact} from '../src/lib/agency-landing-contact.mjs';

const sample={
 data:{
  published:true,agency_slug:'agencia-aracaju',slug:'campanha-de-natal',
  public_path:'/p/agencia-aracaju/campanha-de-natal',
  agency_name:'Agência Norte',title:'Campanha de Natal',
  headline:'Um novo presente para você',
  subtitle:'Encontre informações desta campanha e fale com a agência.',
  cta_label:'Consultar condições',cta_url:'https://example.com/contato?via=site',
  primary_color:'#2655aa',secondary_color:'#142c48',
  sections:[
   {type:'benefit',title:'Comunicação',body:'Uma apresentação comercial acessível.'},
   {type:'faq',title:'Como contratar?',body:'Entre em contato com a equipe.'},
  ],
 },
};
test('LP pública SSR contém SEO indexável e CTA seguro sem hidratação',()=>{
 const value=publicPagePayload(sample,'agencia-aracaju','campanha-de-natal');
 const html=renderPublicAgencyPage(value);
 assert.match(html,/<html lang="pt-BR">/);
 assert.match(html,/<link rel="canonical" href="https:\/\/meucomercial.com.br\/p\/agencia-aracaju\/campanha-de-natal"/);
 assert.match(html,/<meta property="og:title" content="Campanha de Natal \| Agência Norte"/);
 assert.match(html,/<meta name="robots" content="index,follow/);
 assert.match(html,/<h1>Um novo presente para você<\/h1>/);
 assert.match(html,/rel="noopener noreferrer"/);
 assert.match(html,/<h3 id="feature-1">Como contratar\?<\/h3>/);
});
test('texto da agência é escapado e jamais executado como HTML ou JS',()=>{
 const raw={data:{...sample.data,
  headline:'<script>alert("x")</script>',
  agency_name:'A&B "Agência"',
  sections:[{type:'benefit',title:'<svg onload=alert(1)>',body:'<iframe src=evil></iframe>'}],
 }};
 const html=renderPublicAgencyPage(publicPagePayload(raw,'agencia-aracaju','campanha-de-natal'));
 assert.doesNotMatch(html,/<script>/);
 assert.doesNotMatch(html,/<svg onload=/);
 assert.doesNotMatch(html,/<iframe src=/);
 assert.match(html,/&lt;script&gt;/);
 assert.match(html,/A&amp;B &quot;Agência&quot;/);
});
test('LP bloqueia payload privado, slug cruzado, CTA perigoso e paleta malformada',()=>{
 assert.throws(()=>publicPagePayload({data:{...sample.data,published:false}},
  'agencia-aracaju','campanha-de-natal'),/indisponível/);
 assert.throws(()=>publicPagePayload(sample,'agencia-distinta','campanha-de-natal'),/indisponível/);
 assert.throws(()=>publicPagePayload({data:{...sample.data,slug:'outra-campanha'}},
  'agencia-aracaju','campanha-de-natal'),/indisponível/);
 assert.throws(()=>publicPagePayload({data:{...sample.data,cta_url:'javascript:alert(1)'}},
  'agencia-aracaju','campanha-de-natal'),/CTA público/);
 assert.throws(()=>publicPagePayload({data:{...sample.data,cta_url:'https://user:pass@example.com'}},
  'agencia-aracaju','campanha-de-natal'),/CTA público/);
 assert.throws(()=>publicPagePayload({data:{...sample.data,primary_color:'red;display:none'}},
  'agencia-aracaju','campanha-de-natal'),/Cor pública/);
 assert.throws(()=>publicPagePayload({data:{...sample.data,sections:Array(11).fill(sample.data.sections[0])}},
  'agencia-aracaju','campanha-de-natal'),/Seções públicas/);
});
test('URL pública só permite slug estrito e nunca aceita path traversal',()=>{
 for(const slug of ['../admin','%2e%2e','a/b','<script>']){
  assert.throws(()=>publicPagePayload(sample,'agencia-aracaju',slug),/Identificador/);
 }
});

test('sitemap de agências indexa só URLs publicadas fornecidas pela API',()=>{
 const rows=publicSitemapPayload({data:[
  {path:'/p/agencia-aracaju/campanha-de-natal',lastmod:'2026-11-17 15:32:00'},
 ],pagination:{page:1,last_page:2,total:150,per_page:100}},1);
 assert.equal(rows.lastPage,2);
 assert.equal(rows.entries.length,1);
 assert.match(renderAgencySitemapIndex(rows.lastPage),/sitemap-agency-pages-2.xml/);
 assert.match(renderAgencySitemapPage(rows.entries),/<loc>https:\/\/meucomercial.com.br\/p\/agencia-aracaju\/campanha-de-natal<\/loc>/);
 assert.match(renderAgencySitemapPage(rows.entries),/<lastmod>2026-11-17<\/lastmod>/);
});
test('sitemap rejeita URLs injetadas, paginas inválidas e contagens inconsistentes',()=>{
 const envelope={data:[{path:'/admin/private',lastmod:'2026-11-17'}],
  pagination:{page:1,last_page:1,total:1,per_page:100}};
 assert.throws(()=>publicSitemapPayload(envelope,1),/Entrada/);
 assert.throws(()=>publicSitemapPayload({...envelope,data:[]},0),/Sitemap page/);
 assert.throws(()=>renderAgencySitemapIndex(10001),/divisão/);
 assert.throws(()=>publicSitemapPayload({
  data:[],pagination:{page:2,last_page:2,total:150,per_page:100},
 },1),/incompatível/);
});

test('M11: formulário LP é estritamente opt-in e SSR sem JavaScript',()=>{
 const hidden=renderPublicAgencyPage(publicPagePayload(sample,'agencia-aracaju','campanha-de-natal'));
 assert.doesNotMatch(hidden,/name="idempotency_key"/);
 const payload=publicPagePayload({data:{...sample.data,capture_enabled:true}},'agencia-aracaju','campanha-de-natal');
 const html=renderPublicAgencyPage(payload,{
  requestId:'e2c9e705-64d7-412a-8c61-ad47e85eae0d',
  utm:{source:'<script>alert(1)</script>',medium:'organic',campaign:'oferta'},
 });
 assert.match(html,/method="post"/);
 assert.ok(html.includes('action="/p/agencia-aracaju/campanha-de-natal/leads"'));
 assert.match(html,/name="consent" value="1" required/);
 assert.match(html,/name="website"/);
 assert.match(html,/name="idempotency_key"/);
 assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
 assert.doesNotMatch(html,/<script>/);
 assert.doesNotMatch(html,/type="password"/);
 assert.doesNotMatch(landingContactResult('agencia-aracaju','campanha-de-natal',true,
  'Recebido'),/idempotency_key|name="email"/);
});

test('M11: handler público só confirma lead quando API realmente recebeu',async()=>{
 let route,handler,call;
 const app={post:(path,_parser,action)=>{route=path;handler=action;}};
 registerAgencyLandingContact(app,{urlencoded:()=>null});
 assert.equal(route,'/p/:agency/:slug/leads');
 const original=globalThis.fetch,configured=process.env.MEUCOMERCIAL_API_URL;
 const data={idempotency_key:'e2c9e705-64d7-412a-8c61-ad47e85eae0d',
  name:'Contato público',email:'contato@example.com',consent:'1'};
 const invoke=async(body=data)=>{
  const result={statusCode:0,html:'',headers:{}};
  const res={
   status(code){result.statusCode=code;return this;},
   set(a,b){if(typeof a==='string')result.headers[a]=b;return this;},
   type(){return this;},
   send(html){result.html=html;return this;},
  };
  await handler({params:{agency:'agencia-aracaju',slug:'campanha-de-natal'},body},res);
  return result;
 };
 try{
  process.env.MEUCOMERCIAL_API_URL='https://api.example.com/api/';
  globalThis.fetch=async(url,options)=>{
   call={url:String(url),options};
   return {status:201,json:async()=>({received:true})};
  };
  const ok=await invoke();
  assert.equal(ok.statusCode,200);
  assert.match(ok.html,/Solicitação recebida/);
  assert.doesNotMatch(ok.html,/contato@example.com|Contato público/);
  assert.equal(call.url,'https://api.example.com/api/site/agency-pages/agencia-aracaju/campanha-de-natal/leads');
  assert.equal(call.options.headers.Authorization,undefined);
  assert.equal(call.options.headers.Cookie,undefined);
  const request=JSON.parse(call.options.body);
  assert.equal(request.name,'Contato público');
  assert.equal(request.tenant_id,undefined);
  globalThis.fetch=async()=>({status:201,json:async()=>({received:false})});
  const rejected=await invoke();
  assert.equal(rejected.statusCode,422);
  globalThis.fetch=async()=>({status:429});
  assert.equal((await invoke()).statusCode,429);
  assert.equal((await invoke({...data,consent:'0'})).statusCode,422);
 }finally{
  globalThis.fetch=original;
  if(configured===undefined)delete process.env.MEUCOMERCIAL_API_URL;
  else process.env.MEUCOMERCIAL_API_URL=configured;
 }
});
