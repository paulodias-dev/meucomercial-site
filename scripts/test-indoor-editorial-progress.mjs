import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
test('contador editorial depende de publicação real do backend',()=>{
 const s=read('src/components/IndoorOperationProgress.tsx')
 const bff=read('server.ts')
 assert.ok(s.includes('editorial_publications_active>0'))
 assert.ok(s.includes('monitor_player_sync'))
 assert.ok(s.includes('reprodução não comprovada'))
 assert.ok(bff.includes('operation.editorial_publications_active'))
})
test('o site continua negando publicidade, PIN e prova de reprodução inventada',()=>{
 const s=read('src/components/IndoorOperationProgress.tsx')
 assert.ok(s.includes('playback_verified:false'))
 assert.ok(!s.includes('device_token')&&!s.includes('pairing_pin'))
 assert.ok(s.includes('não são comprovantes de reprodução'))
})
