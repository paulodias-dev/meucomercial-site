import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {agencyLandingApiPath,agencyLandingLeadPayload,agencyLandingPublic,readableLandingText} from '../src/lib/agencyLandingPublic';
import {renderAgencyLandingHtml} from '../server/agencyLandingRoutes';

const landing={
 agency_slug:'acao-total',slug:'campanha-regional',
 agency_name:'Ação Total',title:'Campanha Pública',
 headline:'Sua empresa em destaque',subtitle:'Apresentação comercial.',
 cta_label:'Solicitar proposta',cta_url:'https://example.org/contato',
 primary_color:'#2563EB',secondary_color:'#0F172A',
 sections:[{type:'benefit',title:'Atendimento',body:'Contato personalizado.'}],
 published_at:'2026-11-17T13:30:00Z',version:3,
 public_path:'/p/acao-total/campanha-regional',lead_capture_enabled:true,
};
test('página pública exige exatamente agência e slug do conteúdo já publicado',()=>{
 const page=agencyLandingPublic({data:landing},'acao-total','campanha-regional');
 assert.equal(page.agencyName,'Ação Total');
 assert.equal(page.sections.length,1);
 assert.equal(agencyLandingApiPath('acao-total','campanha-regional'),
  '/api/agency-pages/acao-total/campanha-regional');
 assert.throws(()=>agencyLandingPublic({data:landing},'outra-agencia','campanha-regional'),/pertence/);
 assert.throws(()=>agencyLandingPublic({data:{...landing,agency_slug:'outra-agencia'}},'acao-total','campanha-regional'),/pertence/);
 assert.throws(()=>agencyLandingPublic({data:{...landing,lead_capture_enabled:false}},'acao-total','campanha-regional'),/confirmada/);
 assert.throws(()=>agencyLandingPublic({data:{...landing,cta_url:'javascript:alert(1)'}},'acao-total','campanha-regional'),/CTA/);
});
test('HTML SEO servido sem hydration descreve agência correta e não reaproveita URL da homepage',()=>{
 const raw=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const page=agencyLandingPublic({data:landing},'acao-total','campanha-regional');
 const html=renderAgencyLandingHtml(raw,page);
 assert.match(html,/<title>Campanha Pública \| Ação Total<\/title>/);
 assert.match(html,/<link rel="canonical" href="https:\/\/[^"]+\/p\/acao-total\/campanha-regional"/);
 assert.doesNotMatch(html,/<link rel="canonical" href="https:\/\/meucomercial\.com\.br\/" \/>/);
 assert.match(html,/<meta property="og:title" content="Campanha Pública \| Ação Total"/);
 assert.match(html,/<meta name="robots" content="index, follow"/);
 assert.match(html,/<script id="seo-jsonld" type="application\/ld\+json">/);
 assert.equal((html.match(/<link rel="canonical"/g)||[]).length,1);
 assert.match(html,/<main lang="pt-BR" data-server-landing="true">/);
 assert.match(html,/<h1>Sua empresa em destaque<\/h1>/);
 assert.match(html,/<h2>Atendimento<\/h2>/);
});
test('SEO escapa conteúdo editorial malicioso, sem injetar HTML ou JSON-LD executável',()=>{
 const malicious={...landing,title:'<script>alert("x")</script>',
  agency_name:'ACME & Filhos',headline:'Confira <noscript> conteúdo',
  subtitle:'Oferta & serviço',sections:[]};
 const page=agencyLandingPublic({data:malicious},'acao-total','campanha-regional');
 const html=renderAgencyLandingHtml(readFileSync(new URL('../index.html',import.meta.url),'utf8'),page);
 assert.match(html,/<title>&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt; \| ACME &amp; Filhos<\/title>/);
 assert.doesNotMatch(html,/<title><script>/);
 assert.doesNotMatch(html,/<script>alert\("x"\)<\/script>/);
 assert.match(html,/\\u003cscript/);
});
test('formulário público exige consentimento e UUID estável para reenvio',()=>{
 const valid={name:'Comprador da região',company:'Mercado local',
  email:'contato@example.test',phone:'79999998888',message:'Tenho interesse',
  consent:true,website:'',requestId:'b17cab0e-6da2-4d15-9b9c-45136b8d6eba'};
 const payload=agencyLandingLeadPayload(valid);
 assert.equal(payload.privacy_consent,true);
 assert.equal(payload.request_id,valid.requestId);
 assert.equal((payload as Record<string,unknown>).tenant_id,undefined);
 assert.equal((payload as Record<string,unknown>).client_id,undefined);
 assert.throws(()=>agencyLandingLeadPayload({...valid,consent:false}),/consentir/);
 assert.throws(()=>agencyLandingLeadPayload({...valid,requestId:'abc'}),/inválido/);
});

test('contraste do texto adapta paletas claras e escuras da agência',()=>{
 assert.equal(readableLandingText('#FFFFFF'),'#0F172A');
 assert.equal(readableLandingText('#000000'),'#FFFFFF');
 assert.throws(()=>readableLandingText('white'),/Paleta/);
});
