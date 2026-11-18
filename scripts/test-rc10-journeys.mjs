import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readPortalCookies} from '../src/lib/portal-cookie.mjs';
import {acquisitionUrl,readAcquisitionIntent,buildAcquisitionPayload} from '../src/lib/acquisitionRequest.mjs';

const key='d0cf04ab-667a-48e8-a563-3d967b0e421c';
test('M18: catálogo real → contratação guiada conserva perfil/plano/UTM sem checkout falso',()=>{
 const url=acquisitionUrl({kind:'establishment',planId:9},
  '?utm_source=ig&utm_medium=cpc&utm_campaign=demo');
 assert.match(url,/^\/contratar\?/);
 const intent=readAcquisitionIntent(url.slice(url.indexOf('?')));
 assert.deepEqual(intent,{kind:'establishment',planId:9,offerId:null});
 const body=buildAcquisitionPayload({
  kind:'establishment',name:'Pessoa de teste',company:'Loja de teste',
  email:'tester@example.test',whatsapp:'(79) 99999-9999',city:'Aracaju',
  details:'Plano TV Indoor',screensCount:2,
  medium:'tv',agencySlug:'agencia-autorizada',consent:true,planId:9,
 },key,url.slice(url.indexOf('?')));
 assert.equal(body.plan_id,9);
 assert.equal(body.agency_slug,'agencia-autorizada');
 assert.equal(body.source,'site-acquisition-guided');
 assert.equal(body.utm_campaign,'demo');
 assert.equal(body.idempotency_key,key);
 assert.ok(!Object.hasOwn(body,'gateway_token'));
 assert.ok(!Object.hasOwn(body,'payment_status'));
 assert.ok(!Object.hasOwn(body,'subscription_id'));
});
test('M18: agência obrigatória no lead de estabelecimento, sem credencial ou plano falsificado',()=>{
 const form={kind:'establishment',name:'Teste Usuário',company:'Empresa',
  email:'tester@example.test',whatsapp:'(79) 99999-9999',
  screensCount:1,medium:'mixed',planId:9,consent:true,agencySlug:''};
 assert.throws(()=>buildAcquisitionPayload(form,key),/agência/);
 assert.throws(()=>buildAcquisitionPayload({...form,agencySlug:'agencia-a',consent:false},key),
  /Autorize/);
 assert.equal(readAcquisitionIntent('?kind=establishment&plan_id=99e9').planId,null);
});
test('M18: cookies codificados malformados são descartados sem quebrar autenticação válida',()=>{
 const result=readPortalCookies('broken=%E0%A4%A; mc_portal_session=jwt.mock.valid; other=value');
 assert.equal(result.mc_portal_session,'jwt.mock.valid');
 assert.equal(Object.hasOwn(result,'broken'),false);
 assert.equal(readPortalCookies('mc_portal_session=broken%ZZ').mc_portal_session,undefined);
 assert.equal(readPortalCookies('mc_portal_session=first; mc_portal_session=second').mc_portal_session,'first');
 assert.deepEqual(readPortalCookies('a'.repeat(9000)),{});
 assert.equal(readPortalCookies('x=hello%0Aworld').x,undefined);
});
