import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const component=read('src/components/RadioGuide.tsx')
const app=read('src/App.tsx')
const audio=read('src/components/RadioDemoPlayer.tsx')
const guide=read('docs/RADIO_INDOOR_GUIA.md')
const faqs=Array.from(component.matchAll(/\{id:'([^']+)',question:/g),match=>match[1])
test('FAQ has 8 distinct topics of licensing, online status and technical reporting',()=>{
  assert.equal(faqs.length,8)
  assert.equal(new Set(faqs).size,8)
  for(const topic of ['licencas','repertorio','insercoes','auditoria','sem-internet','instalacao','preco','privacidade']){
    assert.ok(faqs.includes(topic),topic)
  }
})
test('radio guides explicitly distinguish software from music rights',()=>{
  assert.ok(component.includes('não concede automaticamente direitos'))
  assert.ok(component.includes('não uma medição independente de audiência'))
  assert.ok(guide.includes('não** equivale à aquisição automática de direitos autorais'))
})
test('illustrative schedule is not presented as playable audio',()=>{
  assert.ok(component.includes('Esta é uma simulação textual'))
  assert.ok(component.includes('não reproduz músicas'))
  assert.ok(component.includes('<RadioDemoPlayer />'))
  assert.ok(component.includes('Ilustrativo'))
  assert.ok(!component.includes('<audio'))
  assert.ok(!component.includes('new Audio('))
})
test('radio section appears once and the desktop and mobile menus both open it',()=>{
  assert.equal((app.match(/<RadioGuide onContact=\{openLeadModal\}/g)||[]).length,1)
  assert.ok((app.match(/href="#radio-indoor"/g)||[]).length>=2)
  assert.ok(app.includes('import RadioGuide from "./components/RadioGuide"'))
})
test('radio contact uses existing lead dialog, not a false success UI',()=>{
  assert.ok(component.includes("onContact('Rádio Indoor - orientações e proposta')"))
  assert.ok(app.includes('<RadioGuide onContact={openLeadModal}'))
  assert.ok(app.includes('privacyConsent'))
  assert.ok(guide.includes('formulário de lead existente'))
})
test('accordion has unique stable ids and accessible disclosure controls',()=>{
  assert.ok(component.includes('aria-expanded={expanded===faq.id}'))
  assert.ok(component.includes("aria-controls={'radio-faq-'+faq.id}"))
  assert.ok(component.includes("hidden={expanded!==faq.id}"))
  assert.ok(component.includes('aria-labelledby="radio-guide-title"'))
})
test('contractual reporting does not claim verified audience',()=>{
  assert.ok(component.toLowerCase().includes('não identificam ouvintes individuais'))
  assert.ok(component.includes('não representam uma garantia de alcance'))
  assert.ok(guide.includes('não comprova ouvintes'))
  assert.ok(guide.includes('downloads e heartbeats'))
})
test('no fabricated checkout, recurring price or live music download is advertised',()=>{
  assert.ok(component.includes('não promete reprodução permanente'))
  assert.ok(component.toLowerCase().includes('não necessariamente'))
  assert.ok(!component.includes('https://cdn'))
  assert.ok(!component.includes('checkout'))
})

test('spoken radio samples are local, accessible, opt-in and never billed or sent as real playback',()=>{
  assert.ok(audio.includes('new SpeechSynthesisUtterance(item.copy)'))
  assert.ok(audio.includes('window.speechSynthesis.speak(message)'))
  assert.ok(audio.includes('window.speechSynthesis.cancel()'))
  assert.ok(audio.includes("message.lang = 'pt-BR'"))
  assert.ok(audio.includes("aria-live='polite'"))
  assert.ok(audio.includes("aria-pressed={active === item.id}"))
  assert.ok(audio.includes('não contabilizamos veiculações'))
  assert.ok(!audio.includes('fetch('))
  assert.ok(!audio.includes('localStorage'))
  assert.ok(!audio.includes('<audio'))
})
