import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
test('etapas da proposta usam mesmo componente em solicitação e acompanhamento privado',()=>{
 const wizard=read('src/components/IndoorContractProgress.tsx')
 const tracker=read('src/components/ContractTrackingPage.tsx')
 assert.ok(wizard.includes('IndoorProposalResponse'))
 assert.ok(tracker.includes('IndoorProposalResponse'))
 assert.ok(tracker.includes("'proposal_acknowledged'"))
})
test('manifestação exige opt-in não vinculante e versão, sem chave em URL/cookie',()=>{
 const ui=read('src/components/IndoorProposalResponse.tsx')
 assert.ok(ui.includes('acknowledge_nonbinding'))
 assert.ok(ui.includes('expected_version:record.version'))
 assert.ok(ui.includes('proposal_version:proposal.version'))
 assert.ok(ui.includes("Authorization:'Bearer '+accessKey"))
 assert.ok(ui.includes('window.confirm('))
 assert.ok(!ui.includes('localStorage')&&!ui.includes('sessionStorage'))
 assert.ok(!ui.includes('payment_method_id'))
})
test('proxy público isola rota fixa e não cria login ou checkout fictício',()=>{
 const server=read('server.ts')
 assert.ok(server.includes("app.post('/api/indoor-contract-requests/:reference/proposal-response'"))
 assert.ok(server.includes("respond=req.path.endsWith('/proposal-response')"))
 assert.ok(server.includes("redirect:'error'"))
 assert.ok(server.includes("credentials:'omit'"))
})
