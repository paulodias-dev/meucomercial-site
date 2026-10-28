import test from 'node:test'
import assert from 'node:assert/strict'
import {chromium} from 'playwright'
import {spawn,execFileSync} from 'node:child_process'
import {createServer as httpsServer} from 'node:https'
import {createServer as tcpServer} from 'node:net'
import {mkdtempSync,readFileSync,rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {once} from 'node:events'
import {setTimeout as delay} from 'node:timers/promises'
const root=fileURLToPath(new URL('../',import.meta.url))
async function portFor(server){
 server.listen(0,'127.0.0.1');await once(server,'listening');return server.address().port
}
test('jornada pública de aquisição end-to-end: três públicos, catálogo, consentimento e erros',{timeout:120000},async t=>{
 const dir=mkdtempSync(join(tmpdir(),'mc-acquisition-'))
 const keyfile=join(dir,'ca.key'),certfile=join(dir,'ca.crt')
 execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-keyout',keyfile,
  '-out',certfile,'-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost'],{stdio:'ignore'})
 const options={key:readFileSync(keyfile),cert:readFileSync(certfile)}
 const receipts=[]
 const api=httpsServer(options,async(req,res)=>{
  if(req.method==='GET'&&req.url?.startsWith('/api/site/indoor/plans')){
   res.writeHead(200,{'Content-Type':'application/json'})
   res.end(JSON.stringify({evidence:'approved_active_plan_not_purchase',
    data:[{plan_id:21,name:'Plano A',description:'Condição publicada',price:'249.90',
      currency:'BRL',interval:'monthly',max_devices:5,storage_mb:1024,trial_days:0,checkout_available:false}]}))
   return
  }
  if(req.method==='GET'&&req.url?.startsWith('/api/site/indoor/catalog')){
   res.writeHead(200,{'Content-Type':'application/json'})
   res.end(JSON.stringify({evidence:'curated_authorized_offer_not_realtime_capacity',
    pagination:{page:1,per_page:12,total:1,last_page:1},
    data:[{offer_id:31,title:'Oferta Rádio',region:'Aracaju - SE',description:'Consulta necessária',
      medium:'radio',availability:'consultation_required'}]}))
   return
  }
  if(req.method==='POST'&&req.url==='/api/site/commercial-leads'){
   let raw='';for await(const chunk of req)raw+=chunk.toString()
   const body=JSON.parse(raw);receipts.push(body)
   const status=body.name==='Rate Limited'?429:201
   res.writeHead(status,{'Content-Type':'application/json'})
   res.end(JSON.stringify(status===201?{received:true}:{message:'Limite de solicitações'}))
   return
  }
  res.writeHead(404).end()
 })
 const apiPort=await portFor(api)
 const reservation=tcpServer(),sitePort=await portFor(reservation)
 await new Promise(resolve=>reservation.close(resolve))
 const site=spawn(process.execPath,['dist/server.cjs'],{
  cwd:root,
  env:{...process.env,NODE_ENV:'production',PORT:String(sitePort),
   MEUCOMERCIAL_API_URL:'https://localhost:'+apiPort+'/api',NODE_EXTRA_CA_CERTS:certfile},
  stdio:['ignore','pipe','pipe']
 })
 let stderr='';site.stderr.on('data',b=>stderr+=b.toString())
 let browser
 const origin='http://127.0.0.1:'+sitePort
 async function newPage(url,viewport={width:375,height:812}){
  const page=await browser.newPage({viewport});await page.goto(origin+url,{waitUntil:'domcontentloaded'})
  return page
 }
 async function complete(page,name='Ana Teste'){
  await page.getByRole('button',{name:'Continuar'}).click()
  if(page.url().includes('kind=establishment'))await page.getByRole('button',{name:/Plano A/}).waitFor()
  if(page.url().includes('kind=advertiser'))await page.getByRole('button',{name:/Oferta Rádio/}).waitFor()
  await page.getByRole('button',{name:'Continuar'}).click()
  await page.getByLabel('Nome completo').fill(name)
  await page.getByLabel('Empresa').fill('Empresa Teste')
  await page.getByLabel('E-mail').fill('teste@example.org')
  await page.getByLabel('WhatsApp / telefone').fill('79999999999')
  await page.locator('input[type="checkbox"]').check()
 }
 try{
  let live=false
  for(let i=0;i<90;i++){
   if(site.exitCode!==null)throw Error('Servidor não iniciou: '+stderr)
   try{if((await fetch(origin+'/')).ok){live=true;break}}catch{}
   await delay(100)
  }
  assert.equal(live,true,'O servidor compilado não respondeu: '+stderr)
  browser=await chromium.launch({headless:true,args:['--no-sandbox']})
  await t.test('estabelecimento: plano real, consentimento, UTM e confirmação da API',async()=>{
   const page=await newPage('/contratar?kind=establishment&plan_id=21&utm_source=campanha')
   try{
    assert.ok((await page.title()).includes('Solicitar planos'))
    await complete(page)
    await page.getByRole('button',{name:'Enviar pedido para análise'}).click()
    await page.getByRole('heading',{name:'Solicitação recebida pela API!'}).waitFor()
    const lead=receipts.at(-1)
    assert.equal(lead.plan_id,21)
    assert.equal(lead.offer_id,null)
    assert.equal(lead.kind,'establishment')
    assert.equal(lead.consent,true)
    assert.equal(lead.utm_source,'campanha')
    const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth)
    assert.ok(scrollWidth<=377,'Overflow horizontal em 375px: '+scrollWidth)
   }finally{await page.close()}
  })
  await t.test('anunciante: seleciona apenas oferta verificada, sem assinatura',async()=>{
   const page=await newPage('/contratar?kind=advertiser&offer_id=31')
   try{
    await complete(page,'Patricia Modelo')
    await page.getByRole('button',{name:'Enviar pedido para análise'}).click()
    await page.getByRole('heading',{name:'Solicitação recebida pela API!'}).waitFor()
    const lead=receipts.at(-1)
    assert.equal(lead.offer_id,31)
    assert.equal(lead.plan_id,null)
    assert.equal(lead.screens_count,null)
   }finally{await page.close()}
  })
  await t.test('agência: não recebe preço, plano nem oferta de outro público',async()=>{
   const page=await newPage('/contratar?kind=agency&offer_id=31&plan_id=21')
   try{
    await complete(page,'Agencia Modelo')
    await page.getByRole('button',{name:'Enviar pedido para análise'}).click()
    await page.getByRole('heading',{name:'Solicitação recebida pela API!'}).waitFor()
    const lead=receipts.at(-1)
    assert.equal(lead.kind,'agency');assert.equal(lead.plan_id,null);assert.equal(lead.offer_id,null)
   }finally{await page.close()}
  })
  await t.test('429 não produz recibo, retry preserva UUID e edição gera nova intenção',async()=>{
   const page=await newPage('/contratar?kind=establishment')
   try{
    await complete(page,'Rate Limited')
    await page.getByRole('button',{name:'Enviar pedido para análise'}).click()
    await page.getByRole('alert').waitFor()
    const a=receipts.at(-1)
    assert.equal(await page.getByRole('heading',{name:'Solicitação recebida pela API!'}).count(),0)
    await page.getByRole('button',{name:'Enviar pedido para análise'}).click()
    await page.getByRole('alert').waitFor()
    const b=receipts.at(-1)
    assert.equal(a.idempotency_key,b.idempotency_key)
    await page.getByLabel('Nome completo').fill('Valid Test')
    await page.getByRole('button',{name:'Enviar pedido para análise'}).click()
    await page.getByRole('heading',{name:'Solicitação recebida pela API!'}).waitFor()
    assert.notEqual(receipts.at(-1).idempotency_key,a.idempotency_key)
   }finally{await page.close()}
  })
 }finally{
  if(browser)await browser.close()
  site.kill('SIGTERM')
  await new Promise(resolve=>api.close(resolve))
  rmSync(dir,{recursive:true,force:true})
 }
})
