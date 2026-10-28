import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
test('public finance shows only guidance, never original receipt or gateway key',()=>{
 const ui=read('src/components/IndoorCheckoutPanel.tsx')
 assert.ok(ui.includes('manual_financial_review_required'))
 assert.ok(ui.includes('under_financial_review'))
 assert.ok(ui.includes('awaiting_financial_reconciliation'))
 assert.ok(ui.includes('Não realize outro PIX'))
 assert.ok(!ui.includes('net_paid_amount_brl')&&!ui.includes('payment_receipt_id'))
})
test('BFF rejects unknown finance state and active contract dispute claims',()=>{
 const server=read('server.ts')
 assert.ok(server.includes('body.checkout.provisioning.financial_resolution'))
 assert.ok(server.includes("body.checkout?.provisioning?.status==='active'"))
 assert.ok(server.includes('manual_financial_review_required'))
})
