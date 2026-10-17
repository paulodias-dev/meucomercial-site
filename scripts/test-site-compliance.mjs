import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const files={
 app:read('src/App.tsx'),
 lead:read('src/components/LeadContactModal.tsx'),
 advertiser:read('src/components/AdvertisingCatalogue.tsx'),
 demo:read('src/components/TvTemplateShowcase.tsx'),
 server:read('server.ts'),
 audience:read('src/components/AudienceJourneys.tsx'),
 trust:read('src/components/CommercialTrust.tsx'),
 html:read('index.html'),
}

test('lead consent is explicit, optional until form submit and never treated as payment',()=>{
 assert.ok(files.lead.includes('Autorizo o uso de nome, empresa, e-mail e WhatsApp'))
 assert.ok(files.lead.includes('O envio não cria contrato, cobrança ou veiculação'))
 assert.ok(files.lead.includes('checked={privacyConsent}'))
 assert.ok(files.lead.includes('disabled={formSubmitting || !privacyConsent}'))
 assert.ok(files.app.includes('consent: privacyConsent'))
 assert.ok(files.app.includes('received !== true'))
 assert.ok(files.app.includes('idempotency_key: submissionKey.current'))
 assert.ok(files.app.includes('utm_source: params.get("utm_source")'))
})
test('no fake audience, location availability, commercial rate or client endorsement',()=>{
 assert.ok(files.advertiser.includes('não é um inventário ao vivo'))
 assert.ok(files.advertiser.includes('nenhuma cidade, aparelho, audiência, valor ou vaga está garantida'))
 assert.ok(files.demo.includes('Prévia local — não publicada'))
 assert.ok(files.audience.includes('não garante inventário reservado'))
 assert.ok(files.trust.includes('Preços, prazos'))
 for(const fake of ['INOVA TECH','SUL ALIMENTOS','REDE SMART','LOGI GROUP','CLÍNICA VIDA','Testes grátis por 7 dias','Sem fidelidade contratual','+80%']){
   assert.ok(!files.app.includes(fake),fake)
 }
})
test('current public code does not pretend cookies tracking or a legally approved policy',()=>{
 assert.ok(!files.app.includes('document.cookie'))
 assert.ok(!files.app.includes('localStorage.setItem'))
 assert.ok(!files.app.includes('gtag('))
 assert.ok(!files.app.includes('fbq('))
 assert.ok(!files.server.includes('express-session'))
 assert.ok(files.app.includes('Solicitar política de privacidade'))
 assert.ok(!files.app.includes('href="/politica-de-privacidade"'))
 assert.ok(files.html.includes('fonts.googleapis.com'))
 assert.ok(files.html.includes('referrer" content="strict-origin-when-cross-origin"'))
 assert.ok(files.server.includes('X-Robots-Tag'))
})
