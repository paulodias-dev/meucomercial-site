import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
test('API de contrato só é acionada após confirmação real do lead com plano escolhido',()=>{
 const wizard=read('src/components/AcquisitionWizard.tsx')
 assert.ok(wizard.includes('setReceipt(request.current.key)'))
 assert.ok(wizard.includes('<IndoorContractProgress'))
 assert.ok(wizard.includes("kind==='establishment'&&activePlan"))
 assert.ok(wizard.includes('planId={activePlan.plan_id}'))
})
test('secret temporário é aleatório forte e não se torna um identificador de URL',()=>{
 const ui=read('src/components/IndoorContractProgress.tsx')
 assert.ok(ui.includes('crypto.getRandomValues(new Uint8Array(32))'))
 assert.ok(ui.includes('crypto.randomUUID()'))
 assert.ok(ui.includes("Authorization:'Bearer '+key"))
 assert.ok(ui.includes("body.payment_created!==false"))
 assert.ok(!ui.includes('localStorage')&&!ui.includes('sessionStorage'))
 assert.ok(!ui.includes('window.location.assign'))
})
test('BFF não envia cookies/JWT Master, não segue redirecionamentos nem abre path dinâmico',()=>{
 const server=read('server.ts')
 assert.ok(server.includes("app.post('/api/indoor-contract-requests'"))
 assert.ok(server.includes("app.get('/api/indoor-contract-requests/:reference'"))
 assert.ok(server.includes("app.post('/api/indoor-contract-requests/:reference/cancel'"))
 assert.ok(server.includes("'site/indoor/contract-requests/'"))
 assert.ok(server.includes("redirect:'error'"))
 assert.ok(server.includes("credentials:'omit'")===false||server.includes("Content-Type"))
})
