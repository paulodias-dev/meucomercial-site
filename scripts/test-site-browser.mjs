import test from 'node:test'
import assert from 'node:assert/strict'
import {chromium} from 'playwright'
import {spawn, execFileSync} from 'node:child_process'
import {createServer as createHttpsServer} from 'node:https'
import {createServer as createTcpServer} from 'node:net'
import {readFileSync, mkdtempSync, rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {once} from 'node:events'
import {setTimeout as delay} from 'node:timers/promises'

const root=fileURLToPath(new URL('../',import.meta.url))
async function listen(server){
  server.listen(0,'127.0.0.1')
  await once(server,'listening')
  return server.address().port
}
async function freePort(){
  const server=createTcpServer()
  const port=await listen(server)
  await new Promise(resolve=>server.close(resolve))
  return port
}

test('real Chromium E2E: TV preview, lead, radio page, templates and failure recovery', {timeout:120000}, async t=>{
  const dir=mkdtempSync(join(tmpdir(),'meucomercial-browser-'))
  const cert=join(dir,'ca.crt'),key=join(dir,'ca.key')
  execFileSync('openssl',[
    'req','-x509','-newkey','rsa:2048','-nodes','-days','1','-keyout',key,
    '-out',cert,'-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost'
  ],{stdio:'ignore'})
  const receipts=[]
  const upstream=createHttpsServer({key:readFileSync(key),cert:readFileSync(cert)},async(req,res)=>{
    if(req.url!=='/api/site/commercial-leads'){res.writeHead(404).end();return}
    let raw=''
    for await(const chunk of req)raw+=chunk.toString()
    const data=JSON.parse(raw)
    receipts.push(data)
    const rejected=data.name==='Invalid'
    res.writeHead(rejected?422:201,{'Content-Type':'application/json'})
    res.end(JSON.stringify(rejected?{message:'Revisar cadastro'}:{received:true,lead_id:7001}))
  })
  const upstreamPort=await listen(upstream)
  const port=await freePort()
  const site=spawn(process.execPath,['dist/server.cjs'],{
    cwd:root,
    env:{...process.env,NODE_ENV:'production',PORT:String(port),
      MEUCOMERCIAL_API_URL:'https://localhost:'+upstreamPort+'/api',
      NODE_EXTRA_CA_CERTS:cert},
    stdio:['ignore','pipe','pipe'],
  })
  let errors=''
  site.stderr.on('data',b=>{errors+=b.toString()})
  let browser
  const origin='http://127.0.0.1:'+port
  try{
    let ready=false
    for(let n=0;n<90;n++){
      if(site.exitCode!==null)throw Error('Server exited: '+errors)
      try{if((await fetch(origin+'/')).status===200){ready=true;break}}catch{}
      await delay(100)
    }
    assert.equal(ready,true,'Compiled server did not start: '+errors)
    browser=await chromium.launch({headless:true,args:['--no-sandbox']})

    await t.test('mobile TV preview and accessible layout selection',async()=>{
      const page=await browser.newPage({viewport:{width:375,height:812}})
      try{
        await page.goto(origin+'/',{waitUntil:'domcontentloaded'})
        const chosen=page.getByRole('button',{name:'Mural',exact:false}).first()
        await chosen.click()
        assert.equal(await chosen.getAttribute('aria-pressed'),'true')
        const width=await page.evaluate(()=>document.documentElement.scrollWidth)
        assert.ok(width<=377,'375px viewport overflow: '+width)
        assert.equal(await page.locator('#simulador').count(),1)
      }finally{await page.close()}
    })

    await t.test('lead failure preserves intent, consent and retries with same idempotency key',async()=>{
      const page=await browser.newPage({viewport:{width:390,height:844}})
      try{
        await page.goto(origin+'/?utm_source=integracao&utm_campaign=e2e',{waitUntil:'domcontentloaded'})
        await page.getByRole('button',{name:'Solicitar proposta personalizada'}).first().click()
        const dialog=page.getByRole('dialog')
        await dialog.waitFor()
        await page.locator('#lead-name').fill('Invalid')
        await page.locator('#lead-company').fill('Empresa E2E')
        await page.locator('#lead-email').fill('teste@example.org')
        await page.locator('#lead-whatsapp').fill('79999999999')
        await dialog.locator('input[type="checkbox"]').check()
        await dialog.getByRole('button',{name:'Enviar solicitação'}).click()
        await dialog.getByRole('alert').waitFor()
        assert.equal(await page.getByText('Solicitação Recebida!').count(),0)
        await page.locator('#lead-name').fill('Valid')
        await dialog.getByRole('button',{name:'Enviar solicitação'}).click()
        await page.getByText('Solicitação Recebida!').waitFor()
        assert.equal(receipts.length,2)
        assert.equal(receipts[0].idempotency_key,receipts[1].idempotency_key)
        assert.equal(receipts[0].utm_source,'integracao')
        assert.equal(receipts[1].utm_campaign,'e2e')
        assert.equal(receipts[1].consent,true)
      }finally{await page.close()}
    })

    await t.test('consultant is transparent template response, without fabricated KPI',async()=>{
      const page=await browser.newPage({viewport:{width:768,height:900}})
      try{
        await page.goto(origin+'/',{waitUntil:'domcontentloaded'})
        await page.getByRole('button',{name:'Gerar Plano Estratégico Sob Medida Grátis'}).click()
        await page.getByText('Plano Estratégico Gerado').waitFor({timeout:8000})
        assert.equal(await page.locator('#consultor-estrategico').count(),1)
      }finally{await page.close()}
    })

    await t.test('radio demonstration route has playable controls without real Player access',async()=>{
      const page=await browser.newPage({viewport:{width:375,height:812}})
      try{
        await page.goto(origin+'/radio-indoor',{waitUntil:'domcontentloaded'})
        await page.getByRole('heading',{name:'Demonstração de Rádio Indoor',exact:true}).first().waitFor()
        assert.equal(await page.getByRole('button',{name:'Vinheta institucional'}).count(),1)
        assert.equal(await page.getByRole('button',{name:'Exemplo de oferta'}).count(),1)
        assert.equal(await page.getByRole('button',{name:'Comunicado da unidade'}).count(),1)
        assert.ok((await page.locator('body').innerText()).includes('não comprova veiculação ou audiência'))
        assert.ok((await page.title()).includes('Demonstração de Rádio Indoor'))
      }finally{await page.close()}
    })

    await t.test('portal is private at HTTP and client route loads separate from public site',async()=>{
      const page=await browser.newPage({viewport:{width:390,height:844}})
      try{
        const response=await page.goto(origin+'/portal',{waitUntil:'domcontentloaded'})
        assert.equal(response?.status(),200)
        assert.match(response?.headers()['x-robots-tag']??'',/noindex/)
        assert.ok(!(await page.content()).includes('rel="canonical"'))
      }finally{await page.close()}
    })
  }finally{
    if(browser)await browser.close()
    site.kill('SIGTERM')
    await delay(150)
    await new Promise(resolve=>upstream.close(resolve))
    rmSync(dir,{recursive:true,force:true})
  }
})
