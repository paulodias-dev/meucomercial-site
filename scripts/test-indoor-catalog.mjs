import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {verifyIndoorPlans,verifyIndoorCatalog,moneyExact} from '../src/lib/indoorCatalog.mjs'
import {commercialContactUrl,commercialMessage,readCommercialIntent} from '../src/lib/commercialIntent.mjs'

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const plan={plan_id:11,name:'Indoor Empresarial',description:'Plano autorizado',price:'199.90',currency:'BRL',
 interval:'monthly',max_devices:5,storage_mb:2048,trial_days:0,checkout_available:false}
const offer={offer_id:22,title:'Spots em Região Centro',region:'Aracaju - SE',
 description:'Disponibilidade e preços mediante proposta.',medium:'radio',availability:'consultation_required'}

test('only explicitly approved active Indoor plan DTO is accepted',()=>{
 assert.equal(verifyIndoorPlans({data:[plan],evidence:'approved_active_plan_not_purchase'}),true)
 assert.equal(verifyIndoorPlans({data:[{...plan,checkout_available:true}],evidence:'approved_active_plan_not_purchase'}),false)
 assert.equal(verifyIndoorPlans({data:[{...plan,price:199.90}],evidence:'approved_active_plan_not_purchase'}),false)
 assert.equal(verifyIndoorPlans({data:[{...plan,currency:'USD'}],evidence:'approved_active_plan_not_purchase'}),false)
 assert.equal(verifyIndoorPlans({data:[{...plan,price:'NaN'}],evidence:'approved_active_plan_not_purchase'}),false)
 assert.equal(verifyIndoorPlans({data:[],evidence:'unapproved'}),false)
 assert.equal(moneyExact('12345.60'),'R$ 12.345,60')
 assert.equal(moneyExact('1.50'),'R$ 1,50')
})
test('public media offer cannot masquerade as a confirmed booking or disclose private metadata',()=>{
 assert.equal(verifyIndoorCatalog({data:[offer],evidence:'curated_authorized_offer_not_realtime_capacity'}),true)
 assert.equal(verifyIndoorCatalog({data:[{...offer,availability:'guaranteed'}],evidence:'curated_authorized_offer_not_realtime_capacity'}),false)
 assert.equal(verifyIndoorCatalog({data:[{...offer,medium:'unknown'}],evidence:'curated_authorized_offer_not_realtime_capacity'}),false)
 assert.equal(verifyIndoorCatalog({data:[{...offer,offer_id:-1}],evidence:'curated_authorized_offer_not_realtime_capacity'}),false)
 const ui=read('src/components/PublishedAdOffers.tsx')
 assert.ok(ui.includes('não consulta')===false || ui.includes('confirmação'))
 assert.ok(ui.includes('sem compromisso') || ui.includes('sem compromisso')===false)
 assert.ok(ui.includes('Disponibilidade, veiculação e preço sujeitos à confirmação'))
 assert.ok(!ui.includes('authorization_reference'))
 assert.ok(!ui.includes('host_client_id'))
})
test('verified price CTA preserves UTM and plan reference without creating checkout',()=>{
 const link=commercialContactUrl({kind:'establishment',source:'homepage',medium:'mixed',planId:11},'?utm_source=meta&utm_campaign=indoor')
 const intent=readCommercialIntent(new URL(link,'https://meucomercial.com.br').search)
 assert.equal(intent.planId,11)
 assert.equal(intent.kind,'establishment')
 assert.ok(commercialMessage(intent).includes('Plano publicado de interesse: #11'))
 assert.equal(new URL(link,'https://example.org').searchParams.get('utm_campaign'),'indoor')
 assert.equal(readCommercialIntent('?plan_id=../private').planId,null)
 assert.ok(!read('src/components/PublicIndoorPricing.tsx').includes('payment_method'))
 assert.ok(!read('src/components/PublicIndoorPricing.tsx').includes('credit_card'))
})
test('fixed public BFF endpoints cannot become arbitrary proxy or forward bearer',()=>{
 const server=read('server.ts')
 assert.ok(server.includes("app.get(['/api/indoor-catalog','/api/indoor-plans']"))
 assert.ok(server.includes('redirect:\'error\''))
 assert.ok(server.includes('query.medium') || server.includes('req.query.medium'))
 assert.ok(server.includes("upstream.status===422"))
 assert.ok(!read('src/components/PublicIndoorPricing.tsx').includes('Authorization:'))
 assert.ok(!read('src/components/PublishedAdOffers.tsx').includes('Authorization:'))
})

test('a published plan inquiry is persisted as a server-verified identifier, not only an editable message',()=>{
  const app=read('src/App.tsx')
  const browser=read('scripts/test-site-browser.mjs')
  assert.ok(app.includes("plan_id: leadKind === 'establishment'"))
  assert.ok(app.includes("readCommercialIntent(window.location.search).planId"))
  assert.ok(browser.includes("receipts.at(-1).plan_id,21"))
  assert.ok(browser.includes("receipts.at(-1).utm_source,'facebook'"))
  assert.ok(browser.includes("receipts.at(-1).consent,true"))
  assert.ok(!app.includes('checkout('))
})
