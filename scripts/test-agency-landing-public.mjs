import test from 'node:test';
import assert from 'node:assert/strict';
import {publicPagePayload,renderPublicAgencyPage} from '../src/lib/agency-landing-public.mjs';

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
