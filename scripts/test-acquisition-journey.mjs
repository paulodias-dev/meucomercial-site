import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {readAcquisitionIntent,acquisitionUrl,buildAcquisitionPayload,acquisitionError} from '../src/lib/acquisitionRequest.mjs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const key='a5be6cde-66de-4ca9-8f21-69b0bb938eb2'
const basic={kind:'establishment',name:'Ana Silva',company:'Mercado Modelo',email:'ana@example.org',
 whatsapp:'(79) 99999-9000',city:'Aracaju',details:'TV na recepção',screensCount:'3',medium:'tv',
 consent:true,planId:4,offerId:8}
test('URLs possuem apenas IDs públicos de interesse e UTM, nunca PII',()=>{
 const u=acquisitionUrl({kind:'establishment',planId:4,offerId:8},'?utm_source=meta&token=secreto&email=ana@example.org')
 assert.ok(u.startsWith('/contratar?'));assert.ok(!u.includes('secreto')&&!u.includes('example.org'))
 const intent=readAcquisitionIntent(new URL(u,'https://meucomercial.com.br').search)
 assert.equal(intent.planId,4);assert.equal(intent.offerId,null)
 assert.equal(readAcquisitionIntent('?kind=advertiser&offer_id=9&plan_id=4').planId,null)
 assert.equal(readAcquisitionIntent('?plan_id=../admin').planId,null)
})
test('pedido estabelecimento usa contrato exato de lead público, sem checkout',()=>{
 const p=buildAcquisitionPayload(basic,key,'?utm_medium=cpc')
 assert.equal(p.plan_id,4);assert.equal(p.offer_id,null);assert.equal(p.screens_count,3)
 assert.equal(p.source,'site-acquisition-guided');assert.equal(p.consent,true)
 assert.equal(p.website,'');assert.equal(p.utm_medium,'cpc')
 assert.equal(p.idempotency_key,key)
})
test('contratos e identidades de anunciante e agência são isolados',()=>{
 const a=buildAcquisitionPayload({...basic,kind:'advertiser'},key)
 assert.equal(a.plan_id,null);assert.equal(a.offer_id,8);assert.equal(a.screens_count,null)
 const b=buildAcquisitionPayload({...basic,kind:'agency'},key)
 assert.equal(b.plan_id,null);assert.equal(b.offer_id,null);assert.equal(b.screens_count,null)
})
test('recusa consentimento, campos inválidos, cidade com URL, IDs e quantidades inválidas',()=>{
 for(const patch of [{consent:false},{name:'A'},{email:'invalido'},{whatsapp:'123'},
   {company:''},{screensCount:'0'},{screensCount:'10001'},{city:'https://teste.org'}]){
  assert.throws(()=>buildAcquisitionPayload({...basic,...patch},key))
 }
 assert.throws(()=>buildAcquisitionPayload(basic,'id-invalido'))
})
test('agência escolhida integra o fingerprint idempotente e nunca uma candidatura Master',()=>{
 const a=buildAcquisitionPayload({...basic,agencySlug:'acao-total-aracaju-se'},key)
 const b=buildAcquisitionPayload({...basic,agencySlug:'acao-total-anapolis-go'},key)
 assert.equal(a.agency_slug,'acao-total-aracaju-se')
 assert.equal(b.agency_slug,'acao-total-anapolis-go')
 assert.notEqual(JSON.stringify(a),JSON.stringify(b))
 const master=buildAcquisitionPayload({...basic,kind:'agency',agencySlug:'acao-total-aracaju-se'},key)
 assert.equal(Object.hasOwn(master,'agency_slug'),false)
 assert.throws(()=>buildAcquisitionPayload({...basic,agencySlug:'../painel'},key))
})
test('as duas entradas públicas exibem seleção de agência da API, nunca constante .env',()=>{
 const wizard=read('src/components/AcquisitionWizard.tsx')
 const modal=read('src/components/LeadContactModal.tsx')
 const app=read('src/App.tsx')
 assert.match(wizard,/\/api\/portal\/agencies/)
 assert.match(modal,/agencyOptions/)
 assert.match(app,/\/api\/portal\/agencies/)
 assert.match(app,/submissionFingerprint/)
})

test('status de gateway não é sinal de contratação concluída',()=>{
 assert.match(acquisitionError(422),/despublicado/)
 assert.match(acquisitionError(409),/alterado/)
 assert.match(acquisitionError(429),/Limite/)
 const ui=read('src/components/AcquisitionWizard.tsx')
 assert.ok(ui.includes('data.received!==true'))
 assert.ok(ui.includes('fingerprint'))
 assert.ok(ui.includes('crypto.randomUUID()'))
 assert.ok(ui.includes("credentials:'omit'"))
 assert.ok(!ui.includes('localStorage')&&!ui.includes('payment_method_id'))
})
test('jornada usa BFF público e rota SEO específica',()=>{
 const ui=read('src/components/AcquisitionWizard.tsx')
 assert.ok(ui.includes('/api/indoor-plans'))
 assert.ok(ui.includes('/api/indoor-catalog'))
 assert.ok(ui.includes('/api/commercial-leads'))
 assert.ok(read('src/App.tsx').includes("window.location.pathname === '/contratar'"))
 assert.ok(read('server.ts').includes("slug: 'contratar'"))
 assert.ok(read('src/components/AcquisitionPage.tsx').includes('url="/contratar"'))
})
