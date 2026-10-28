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
 const contractRequests=new Map()
 const api=httpsServer(options,async(req,res)=>{
  if(req.url?.startsWith('/api/site/indoor/contract-requests')){
   const ref=req.url.split('/')[5]
   const key=(req.headers.authorization||'').replace(/^Bearer /,'')
   const prior=ref?contractRequests.get(ref):null
   if(req.method==='POST'&&req.url==='/api/site/indoor/contract-requests'){
    let raw='';for await(const chunk of req)raw+=chunk.toString()
    const body=JSON.parse(raw)
    if(body.plan_id!==21||body.email!=='teste@example.org'||
      body.terms_accepted!==true||!/^[a-f0-9]{64}$/.test(body.access_key)){
     res.writeHead(422,{'Content-Type':'application/json'}).end(JSON.stringify({message:'Dados inválidos'}))
     return
    }
    const record={
     reference:body.request_id,status:'pending',version:1,
     plan:{name:'Plano A',display_price_brl:'249.90',interval:'monthly',
      price_is_contractually_binding:false},
     payment_created:false,subscription_created:false,contract_signed:false
    }
    contractRequests.set(body.request_id,{record,key:body.access_key})
    res.writeHead(201,{'Content-Type':'application/json'}).end(JSON.stringify(record))
    return
   }
   if(!prior||key!==prior.key){
    res.writeHead(404,{'Content-Type':'application/json'}).end(JSON.stringify({message:'Não encontrado'}))
    return
   }
   if(req.method==='POST'&&req.url.endsWith('/proposal-response')){
    let raw='';for await(const chunk of req)raw+=chunk.toString()
    const body=JSON.parse(raw)
    if(prior.record.status!=='proposal_presented'||body.expected_version!==prior.record.version||
      body.proposal_version!==prior.record.proposal.version||
      (body.decision==='acknowledge'&&body.acknowledge_nonbinding!==true)){
     res.writeHead(409,{'Content-Type':'application/json'}).end(JSON.stringify({message:'Conflito'}))
     return
    }
    prior.record={...prior.record,
      status:body.decision==='acknowledge'?'proposal_acknowledged':'proposal_declined',
      version:prior.record.version+1}
    res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(prior.record))
    return
   }
   if(req.method==='POST'&&req.url.endsWith('/cancel')){
    prior.record={...prior.record,status:'cancelled',version:2}
   }
   res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(prior.record))
   return
  }
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
    // Lead persistido não é pré-contratação. Segundo opt-in explícito.
    await page.getByLabel(/Confirmo que desejo submeter/).check()
    await page.getByRole('button',{name:'Solicitar análise pré-contratual'}).click()
    await page.getByRole('heading',{name:'Aguardando análise comercial do Master'}).waitFor()
    await page.getByRole('button',{name:'Atualizar situação'}).click()
    await page.getByRole('heading',{name:'Aguardando análise comercial do Master'}).waitFor()
    page.once('dialog',dialog=>dialog.accept())
    await page.getByRole('button',{name:'Cancelar pedido'}).click()
    await page.getByRole('heading',{name:'Solicitação cancelada sem cobrança'}).waitFor()
    assert.equal(contractRequests.size,1)
    const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth)
    assert.ok(scrollWidth<=377,'Overflow horizontal em 375px: '+scrollWidth)
   }finally{await page.close()}
  })
  await t.test('consulta privada /acompanhar e manifestação de interesse sobre proposta CRM',async()=>{
   const uuid='e527a8e9-9fb7-4d0e-8dcb-b075fc97cf85'
   const access='a'.repeat(64)
   contractRequests.set(uuid,{key:access,record:{
    reference:uuid,status:'proposal_presented',version:3,
    plan:{name:'Plano A',display_price_brl:'249.90',interval:'monthly',
     price_is_contractually_binding:false},
    proposal:{title:'Proposta TV Indoor',scope:'Publicidade e serviços internos',
     amount_brl:'249.90',valid_until:'2027-10-30',version:2,
     items:[{description:'Pacote',quantity:1,unit:'un',unit_price_brl:'249.90',
      line_total_brl:'249.90'}],available_for_acknowledgement:true,
     acknowledged_at:null,nonbinding_quotation:true},
    payment_created:false,subscription_created:false,contract_signed:false
   }})
   const page=await newPage('/acompanhar')
   try{
    assert.equal((await page.title()).includes('Acompanhar'),true)
    await page.getByLabel('Referência UUID').fill(uuid)
    await page.getByLabel('Código privado de acompanhamento').fill(access)
    await page.getByRole('button',{name:'Consultar situação'}).click()
    await page.getByRole('heading',{name:'Proposta TV Indoor'}).waitFor()
    await page.getByLabel(/Li a proposta e confirmo/).check()
    await page.getByRole('button',{name:'Registrar interesse na proposta'}).click()
    await page.getByRole('heading',{name:'Interesse comercial registrado'}).waitFor()
    assert.equal(contractRequests.get(uuid).record.status,'proposal_acknowledged')
    assert.equal(contractRequests.get(uuid).record.payment_created,false)
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
