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
