import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
test('client Studio supports crop with bounded real output pixels',()=>{
 const upload=read('src/components/ClientStudio.tsx')
 const crop=read('src/components/StudioImageCrop.tsx')
 assert.ok(upload.includes('<StudioImageCrop source={cropSource}'))
 assert.ok(upload.includes('setUploadFile(file);setCropSource(null)'))
 for(const term of ["'16:9'","'9:16'","'1:1'","document.createElement('canvas')",
  'canvas.toBlob(', 'new File([blob]']){
  assert.ok(crop.includes(term),term)
 }
 assert.ok(crop.includes("onSave(source)"))
})
test('browser and BFF agree on accepted MP4/MOV/WebM types and bounded size',()=>{
 const upload=read('src/components/ClientStudio.tsx')
 const server=read('server.ts')
 for(const mime of ['video/mp4','video/quicktime','video/webm','video/x-m4v']){
  assert.ok(upload.includes(mime),'form '+mime)
  assert.ok(server.includes(mime),'BFF '+mime)
 }
 assert.ok(upload.includes("limit=file.type.startsWith('image/')?12:64"))
 assert.ok(server.includes("type.startsWith('image/')?12:64"))
 assert.ok(server.includes("limit: '64mb'"))
 assert.ok(server.includes("AbortSignal.timeout(150000)"))
 assert.ok(server.includes("new URL('client/indoor/studio/media/upload',base)"))
 assert.ok(!server.includes("fetch(req.body"))
})
