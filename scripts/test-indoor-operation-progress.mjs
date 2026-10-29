import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
test('jornada privada mostra apenas contadores sem IDs ou segredos de Player',()=>{
 const progress=read('src/components/IndoorOperationProgress.tsx')
 const checkout=read('src/components/IndoorCheckoutPanel.tsx')
 assert.ok(progress.includes('units_registered'))
 assert.ok(progress.includes('players_registered'))
 assert.ok(progress.includes('players_paired'))
 assert.ok(progress.includes('playback_verified:false'))
 assert.ok(checkout.includes('<IndoorOperationProgress'))
 assert.ok(!progress.includes('device_token')&&!progress.includes('pairing_pin'))
})
test('preparação não é sinônimo de media delivery ou audiência auditada',()=>{
 const progress=read('src/components/IndoorOperationProgress.tsx')
 assert.ok(progress.includes('não são comprovantes de reprodução'))
 assert.ok(progress.includes('resolve_financial_dispute'))
 assert.ok(progress.includes('Conteúdo e programação'))
 assert.ok(progress.includes('editorial_publications_active>0'))
})

test('entitlement is read from API, never inferred from administrative active status',()=>{
 const progress=read('src/components/IndoorOperationProgress.tsx')
 const checkout=read('src/components/IndoorCheckoutPanel.tsx')
 const bff=read('server.ts')
 assert.ok(progress.includes('media_authorized:boolean'))
 assert.ok(progress.includes("status==='disputed'||progress.media_authorized===false"))
 assert.ok(progress.includes('contact_support_for_financial_review'))
 assert.ok(checkout.includes("checkout.provisioning.operation?.media_authorized===true"))
 assert.ok(checkout.includes("checkout.provisioning.operation?.media_authorized===false"))
 assert.ok(bff.includes("typeof body.checkout.provisioning.operation.media_authorized!=='boolean'"))
 assert.ok(bff.includes("body.checkout.provisioning.service_activated!==body.checkout.provisioning.operation.media_authorized"))
 assert.ok(!progress.includes('payment_receipt_id')&&!checkout.includes('provider_payment_id'))
})

test('agency readiness is a boolean from API, not tenant information',()=>{
 const progress=read('src/components/IndoorOperationProgress.tsx')
 const bff=read('server.ts')
 assert.ok(progress.includes('agency_ready:boolean'))
 assert.ok(progress.includes('assign_agency_for_publication'))
 assert.ok(progress.includes('Agência responsável pela programação'))
 assert.ok(bff.includes("typeof body.checkout.provisioning.operation.agency_ready!=='boolean'"))
 assert.ok(!progress.includes('tenant_id')&&!progress.includes('agency_plan_id'))
})
