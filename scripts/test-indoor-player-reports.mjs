import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
test('progresso utiliza apenas os relatos próprios autenticados pela API',()=>{
 const s=read('src/components/IndoorOperationProgress.tsx')
 assert.ok(s.includes('player_completion_reports_24h>0'))
 assert.ok(s.includes('reporting_devices_24h'))
 assert.ok(s.includes('monitor_player_reports'))
 assert.ok(s.includes('authenticated_player_self_report_not_audience'))
 assert.ok(!s.includes('device_token')&&!s.includes('event_uuid'))
})
test('BFF exige contadores inteiros, não negativos e evidência explícita',()=>{
 const s=read('server.ts')
 assert.ok(s.includes('Number.isSafeInteger(body.checkout.provisioning.operation.player_completion_reports_24h)'))
 assert.ok(s.includes('operation.completion_evidence'))
 assert.ok(s.includes('operation.playback_verified!==false'))
})
