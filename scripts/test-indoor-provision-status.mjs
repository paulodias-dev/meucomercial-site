import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
test('site permite subscription_created depois do checkout, sem autenticar Cliente por token de pedido',()=>{
 const server=read('server.ts')
 const progress=read('src/components/IndoorContractProgress.tsx')
 const tracking=read('src/components/ContractTrackingPage.tsx')
 assert.ok(server.includes("body.subscription_created===true&&"))
 assert.ok(server.includes("body.checkout.provisioning?.status"))
 assert.ok(progress.includes("typeof body.subscription_created!=='boolean'"))
 assert.ok(tracking.includes("typeof body.subscription_created!=='boolean'"))
 assert.ok(!server.includes('client_password_from_contract'))
})
test('UI distingue pagamento, assinatura ativa e disputa sem inventar pareamento de Player',()=>{
 const s=read('src/components/IndoorCheckoutPanel.tsx')
 assert.ok(s.includes("checkout.provisioning?.status==='active'"))
 assert.ok(s.includes("checkout.provisioning?.status==='disputed'"))
 assert.ok(s.includes('O primeiro período já está quitado'))
 assert.ok(s.includes('Players e mídias é realizado separadamente'))
 assert.ok(s.includes('automatic_device_pairing:false'))
})
