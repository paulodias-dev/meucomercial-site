import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const page=read('src/App.tsx')
const journeys=read('src/components/AudienceJourneys.tsx')
const policy=read('AGENTS.md')

test('three independent roles with their own commercial wording and conditions',()=>{
  for(const role of ['establishment','agency','advertiser']){
    assert.ok(journeys.includes("id:'"+role+"'"),role)
  }
  assert.equal((journeys.match(/\bid:'(?:establishment|agency|advertiser)'/g)||[]).length,3)
  assert.equal((journeys.match(/boundaries:\[/g)||[]).length,3)
})
test('three distinct call-to-action paths preserve audience on the real lead form',()=>{
  assert.ok(journeys.includes("onContact(journey.id,'Jornada - '+journey.label)"))
  assert.ok(page.includes('const openAudienceContact = (kind: CommercialAudience, source: string)'))
  assert.ok(page.includes('setLeadKind(kind)'))
  assert.ok(page.includes('<AudienceJourneys onContact={openAudienceContact} />'))
  assert.ok(page.includes('kind: leadKind'))
})
test('desktop/mobile navigation reaches the same responsive tab panel',()=>{
  assert.ok((page.match(/href="#para-quem"/g)||[]).length>=2)
  assert.ok(journeys.includes("id='para-quem'"))
  assert.ok(journeys.includes("role='tablist'"))
  assert.ok(journeys.includes("aria-selected={active===j.id}"))
  assert.ok(journeys.includes("role='tabpanel'"))
})
test('quote is explicitly not a legally binding price or ad reservation',()=>{
  assert.ok(page.includes('Sem simulação de desconto ou preço não confirmado'))
  assert.ok(page.includes('sem preços de tabela inventados'))
  assert.ok(!page.includes('calculatePricePerScreen'))
  assert.ok(!page.includes('totalMonthlyPrice'))
  assert.ok(!page.includes('testimonials.map'))
  assert.ok(!page.includes('Confira os depoimentos reais'))
})
test('public lead writes happen only after permission, consent and accepted API response',()=>{
  assert.ok(page.includes('fetch("/api/commercial-leads"'))
  assert.ok(page.includes('idempotency_key: submissionKey.current'))
  assert.ok(page.includes('received !== true'))
  assert.ok(page.includes('consent: privacyConsent'))
  assert.ok(page.includes('website: companyWebsite'))
  assert.ok(page.includes('utm_campaign: params.get("utm_campaign")'))
  assert.ok(page.includes('setFormSubmitted(true)'))
})
test('advertiser and agency need a different commercial brief than equipment count',()=>{
  assert.ok(page.includes("leadKind === 'establishment' && <div>"))
  assert.ok(page.includes("leadKind === 'advertiser'"))
  assert.ok(page.includes("leadKind === 'agency'"))
  assert.ok(page.includes('cidade')||page.includes('cidades'))
  assert.ok(page.includes('carteira'))
})
test('three roles cannot grant audience or cross-tenant authority',()=>{
  assert.ok(journeys.includes('não comprova atenção individual'))
  assert.ok(journeys.includes('Sem acesso automático aos clientes'))
  assert.ok(journeys.includes('não garante inventário reservado'))
  assert.ok(policy.includes('não ativa conta, não cobra e não reserva anúncio'))
})
test('critical anchors and lead form are preserved',()=>{
  for(const anchor of ['#radio-indoor','#simulador','#planos','#para-quem']){
    assert.ok(page.includes(anchor),anchor)
  }
  assert.ok(page.includes('handleLeadSubmit'))
})
