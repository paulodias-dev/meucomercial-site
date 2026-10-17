import test from 'node:test'
import assert from 'node:assert/strict'
import {spawn, execFileSync} from 'node:child_process'
import {createServer as createHttpsServer} from 'node:https'
import {createServer as createTcpServer} from 'node:net'
import {readFileSync, mkdtempSync, rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {once} from 'node:events'
import {setTimeout as delay} from 'node:timers/promises'

const root = fileURLToPath(new URL('../', import.meta.url))
const listen = async server => {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  return server.address().port
}
const freePort = async () => {
  const s = createTcpServer()
  const port = await listen(s)
  await new Promise(resolve => s.close(resolve))
  return port
}
const post = (url, body) => fetch(url, {
  method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
  body:JSON.stringify(body),
})

test('compiled Express site: SEO, private portal and real lead/error contracts over HTTP', {timeout:30000}, async t => {
  const dir=mkdtempSync(join(tmpdir(),'meucomercial-http-'))
  const key=join(dir,'test.key')
  const cert=join(dir,'test.crt')
  execFileSync('openssl',[
    'req','-x509','-newkey','rsa:2048','-nodes','-days','1',
    '-keyout',key,'-out',cert,'-subj','/CN=localhost',
    '-addext','subjectAltName=DNS:localhost',
  ],{stdio:'ignore'})

  let forwarded = []
  const mock=createHttpsServer({key:readFileSync(key),cert:readFileSync(cert)},async(req,res)=>{
    if(req.url!=='/api/site/commercial-leads' || req.method!=='POST'){
      res.writeHead(404).end();return
    }
    let raw=''
    for await(const chunk of req) raw+=chunk.toString()
    const data=JSON.parse(raw)
    forwarded.push({data,headers:req.headers})
    const invalid=data.name==='Invalid'
    const unconfirmed=data.name==='Unconfirmed'
    res.writeHead(invalid?422:unconfirmed?200:201,{'Content-Type':'application/json'})
    res.end(JSON.stringify(invalid?{message:'Dados inválidos'}:unconfirmed?{received:false}:{received:true,lead_id:7}))
  })
  const mockPort=await listen(mock)
  const port=await freePort()
  const child=spawn(process.execPath,['dist/server.cjs'],{
    cwd:root,
    env:{...process.env,NODE_ENV:'production',PORT:String(port),
      MEUCOMERCIAL_API_URL:'https://localhost:'+mockPort+'/api',
      NODE_EXTRA_CA_CERTS:cert},
    stdio:['ignore','pipe','pipe'],
  })
  let stderr=''
  child.stderr.on('data',chunk=>{stderr+=chunk.toString()})
  const origin='http://127.0.0.1:'+port
  try {
    let ready=false
    for(let i=0;i<90;i++){
      if(child.exitCode!==null)throw Error('Server exited: '+stderr)
      try { const r=await fetch(origin+'/'); if(r.status===200){ready=true;break} }catch{}
      await delay(100)
    }
    assert.equal(ready,true,'server startup: '+stderr)

    await t.test('homepage, dedicated public radio SEO and unknown routes',async()=>{
      let response=await fetch(origin+'/')
      assert.equal(response.status,200)
      let html=await response.text()
      assert.match(html,/<meta name="robots" content="index, follow/)
      response=await fetch(origin+'/radio-indoor')
      assert.equal(response.status,200)
      html=await response.text()
      assert.match(html,/<title>Demonstração de Rádio Indoor \| Meu Comercial<\/title>/)
      assert.match(html,/rel="canonical" href="https:\/\/meucomercial.com.br\/radio-indoor"/)
      assert.match(html,/property="og:url" content="https:\/\/meucomercial.com.br\/radio-indoor"/)
      response=await fetch(origin+'/nao-existe')
      assert.equal(response.status,404)
      assert.match(response.headers.get('x-robots-tag')??'',/noindex/)
    })

    await t.test('private portal is not indexed, cached or canonicalized as the public site',async()=>{
      const response=await fetch(origin+'/portal')
      assert.equal(response.status,200)
      assert.match(response.headers.get('x-robots-tag')??'',/noindex/)
      assert.match(response.headers.get('cache-control')??'',/no-store/)
      const html=await response.text()
      assert.match(html,/name="robots" content="noindex, nofollow/)
      assert.doesNotMatch(html,/rel="canonical"/)
      assert.doesNotMatch(html,/property="og:url"/)
    })

    await t.test('real upstream accepted lead, invalid response and false confirmation',async()=>{
      const base={name:'Real',company:'Empresa de teste',email:'teste@example.org',
        whatsapp:'79999999999',kind:'establishment',consent:true,
        idempotency_key:'00112233-4455-4677-8899-aabbccddeeff'}
      let response=await post(origin+'/api/commercial-leads',base)
      assert.equal(response.status,201)
      assert.equal((await response.json()).received,true)
      assert.match(response.headers.get('cache-control')??'',/no-store/)
      response=await post(origin+'/api/commercial-leads',{...base,name:'Invalid'})
      assert.equal(response.status,422)
      response=await post(origin+'/api/commercial-leads',{...base,name:'Unconfirmed'})
      assert.equal(response.status,502)
      assert.equal(forwarded.length,3)
      assert.equal(forwarded[0].data.idempotency_key,base.idempotency_key)
      assert.equal(forwarded[0].data.consent,true)
      assert.ok(!forwarded[0].headers.authorization)
      assert.ok(!forwarded[0].headers.cookie)
    })

    await t.test('consultant returns bounded template content and validation error',async()=>{
      let response=await post(origin+'/api/consult',{})
      assert.equal(response.status,400)
      response=await post(origin+'/api/consult',{segment:'varejo',additionalInfo:'teste'})
      assert.equal(response.status,200)
      const data=await response.json()
      assert.equal(data.success,true)
      assert.match(data.answer,/Varejo/)
      assert.match(data.answer,/sem projeção de ROI/)
    })
  }finally{
    child.kill('SIGTERM')
    await delay(150)
    await new Promise(resolve=>mock.close(resolve))
    rmSync(dir,{recursive:true,force:true})
  }
})
