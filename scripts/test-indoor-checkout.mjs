import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
test('checkout só aparece após cotação com opt-in de condições e recorrência',()=>{
 const ui=read('src/components/IndoorCheckoutPanel.tsx')
 assert.ok(ui.includes('accept_contract_terms:true'))
 assert.ok(ui.includes('accept_recurring_billing:true'))
 assert.ok(ui.includes("checkout.status==='offered'"))
 assert.ok(ui.includes("checkout.status==='paid_verified'"))
 assert.ok(ui.includes('expected_version:checkout.version'))
 assert.ok(ui.includes('terms_sha256:checkout.terms_sha256'))
 assert.ok(ui.includes('data:image/png;base64,'))
})
test('o PIX usa UUID reutilizável e nunca confirma pagamento por si',()=>{
 const ui=read('src/components/IndoorCheckoutPanel.tsx')
 assert.ok(ui.includes('attempt.current=crypto.randomUUID()'))
 assert.ok(ui.includes('remote_get_verified!==true'))
 assert.ok(ui.includes('Não envie novo pagamento'))
 assert.ok(!ui.includes('localStorage')&&!ui.includes('sessionStorage'))
})
test('consulta pública aceita payment_created true somente com checkout e não inventa assinatura',()=>{
 const bff=read('server.ts')
 const tracking=read('src/components/ContractTrackingPage.tsx')
 const progress=read('src/components/IndoorContractProgress.tsx')
 assert.ok(bff.includes("app.post('/api/indoor-contract-requests/:reference/checkout-accept'"))
 assert.ok(bff.includes("app.post('/api/indoor-contract-requests/:reference/pix'"))
 assert.ok(bff.includes("app.get('/api/indoor-contract-requests/:reference/pix'"))
 assert.ok(bff.includes("app.post('/api/indoor-contract-requests/:reference/pix/retry'"))
 assert.ok(tracking.includes('<IndoorCheckoutPanel'))
 assert.ok(progress.includes('<IndoorCheckoutPanel'))
 assert.ok(bff.includes("body.payment_created===true&&"))
 assert.ok(bff.includes("redirect:'error'"))
})
