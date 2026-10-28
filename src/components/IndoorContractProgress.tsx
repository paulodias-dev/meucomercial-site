import {useRef,useState} from 'react'
import {CheckCircle2,RefreshCcw,ShieldCheck,XCircle} from 'lucide-react'

type Status='pending'|'approved_for_proposal'|'declined'|'cancelled'
type Contract={reference:string;status:Status;version:number;plan:{
 name:string;display_price_brl:string;interval:'monthly'|'yearly';
 price_is_contractually_binding:false
};payment_created:false;subscription_created:false;contract_signed:false}
type Credentials={requestId:string;accessKey:string;cancelId:string}
const states:Record<Status,string>={
 pending:'Aguardando análise comercial do Master',
 approved_for_proposal:'Aprovado para elaboração de proposta contratual',
 declined:'Solicitação não aprovada; fale com a equipe comercial',
 cancelled:'Solicitação cancelada sem cobrança',
}
const newAccessKey=()=>{
 const data=crypto.getRandomValues(new Uint8Array(32))
 return Array.from(data,v=>v.toString(16).padStart(2,'0')).join('')
}
const requestError=(status:number)=>status===409?'O plano ou a solicitação mudou; solicite nova análise.':
 status===422?'O plano não está mais elegível ou o contato não corresponde ao lead.':
 status===429?'Limite de tentativas. Tente novamente mais tarde.':
 'A API não confirmou esta operação. É seguro repetir sem mudar os dados.'
const tokenHeaders=(key:string)=>({Accept:'application/json',Authorization:'Bearer '+key})
export default function IndoorContractProgress({leadReference,planId,email}:{
 leadReference:string;planId:number;email:string
}){
 const [terms,setTerms]=useState(false)
 const [working,setWorking]=useState(false)
 const [error,setError]=useState('')
 const [notice,setNotice]=useState('')
 const [record,setRecord]=useState<Contract|null>(null)
 // Credenciais em memória apenas; nunca em URL, cookie, storage ou logs.
 const creds=useRef<Credentials|null>(null)
 const start=async()=>{
  if(working||!terms)return
  if(!creds.current)creds.current={
   requestId:crypto.randomUUID(),accessKey:newAccessKey(),cancelId:crypto.randomUUID(),
  }
  const current=creds.current
  setWorking(true);setError('');setNotice('')
  try{
   const response=await fetch('/api/indoor-contract-requests',{
    method:'POST',credentials:'omit',cache:'no-store',
    headers:{Accept:'application/json','Content-Type':'application/json'},
    body:JSON.stringify({
     request_id:current.requestId,lead_reference:leadReference,
     plan_id:planId,email,access_key:current.accessKey,terms_accepted:true
    }),
   })
   const body=await response.json().catch(()=>({}))
   if(!response.ok||body.reference!==current.requestId||body.payment_created!==false
     ||body.subscription_created!==false||body.contract_signed!==false)
    throw Error(requestError(response.status))
   setRecord(body as Contract)
  }catch(ex){setError(ex instanceof Error?ex.message:'Falha na operação.')}
  finally{setWorking(false)}
 }
 const refresh=async()=>{
  const current=creds.current
  if(working||!current||!record)return
  setWorking(true);setError('')
  try{
   const response=await fetch('/api/indoor-contract-requests/'+encodeURIComponent(current.requestId),{
    credentials:'omit',cache:'no-store',headers:tokenHeaders(current.accessKey)
   })
   const body=await response.json().catch(()=>({}))
   if(!response.ok||body.reference!==current.requestId||body.payment_created!==false)
    throw Error(requestError(response.status))
   setRecord(body as Contract)
  }catch(ex){setError(ex instanceof Error?ex.message:'Não foi possível consultar o status.')}
  finally{setWorking(false)}
 }
 const cancel=async()=>{
  const current=creds.current
  if(working||!current||record?.status!=='pending')return
  if(!window.confirm('Cancelar esta solicitação ainda pendente? A ação não cria estorno porque nenhum pagamento foi feito.'))return
  setWorking(true);setError('')
  try{
   const response=await fetch('/api/indoor-contract-requests/'+encodeURIComponent(current.requestId)+'/cancel',{
    method:'POST',credentials:'omit',cache:'no-store',
    headers:{...tokenHeaders(current.accessKey),'Content-Type':'application/json'},
    body:JSON.stringify({request_id:current.cancelId,expected_version:record.version}),
   })
   const body=await response.json().catch(()=>({}))
   if(!response.ok||body.status!=='cancelled')throw Error(requestError(response.status))
   setRecord(body as Contract)
  }catch(ex){setError(ex instanceof Error?ex.message:'Não foi possível cancelar.')}
  finally{setWorking(false)}
 }
 const copy=async()=>{
  const current=creds.current
  if(!current||!record)return
  setNotice('')
  try{
   await navigator.clipboard.writeText('Meu Comercial — solicitação privada\nReferência: '+
    current.requestId+'\nCódigo de acesso: '+current.accessKey+
    '\nNão compartilhe publicamente este código.')
   setNotice('Referência e código privado copiados a seu pedido. Armazene em local seguro.')
  }catch{setNotice('Não foi possível copiar. Você pode acompanhar enquanto esta página permanecer aberta.')}
 }
 return <section aria-label="Acompanhamento pré-contratual" className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6">
  <div className="flex gap-3 items-start">
   <ShieldCheck size={22} className="text-blue-800 shrink-0" aria-hidden/>
   <div>
    <h3 className="font-bold text-lg">Próximo passo: análise pré-contratual</h3>
    <p className="mt-2 text-sm leading-6 text-slate-700">
     Seu interesse foi registrado. Solicite uma análise formal do plano escolhido,
     com protocolo e acompanhamento privado. Esta etapa não gera PIX, assinatura nem ativação de aparelhos.
    </p>
   </div>
  </div>
  {!record?<div className="mt-5">
   <label className="flex gap-3 text-sm leading-6 text-slate-700 items-start">
    <input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)}
     className="mt-1 accent-blue-700 w-5 h-5 shrink-0"/>
    <span>Confirmo que desejo submeter o plano à análise comercial. Entendo que preço e condições
     ainda dependem de proposta e contrato específicos, sem cobrança imediata.</span>
   </label>
   <button type="button" onClick={start} disabled={!terms||working}
    className="mt-5 min-h-12 rounded-xl px-5 bg-blue-700 text-white text-sm font-semibold disabled:opacity-40">
    {working?'Registrando análise…':'Solicitar análise pré-contratual'}
   </button>
  </div>:<div className="mt-5 rounded-xl bg-white border p-5">
   {record.status==='pending'?<RefreshCcw size={22} className="text-blue-700" aria-hidden/>:
    record.status==='approved_for_proposal'?<CheckCircle2 size={22} className="text-emerald-700" aria-hidden/>:
    <XCircle size={22} className="text-slate-600" aria-hidden/>}
   <h4 className="font-semibold mt-3">{states[record.status]||'Análise em andamento'}</h4>
   <p className="text-sm text-slate-600 mt-2">Plano: {record.plan.name} · Valor cadastrado:
    R$ {record.plan.display_price_brl.replace('.',',')}/{record.plan.interval==='monthly'?'mês':'ano'}.
    Não é preço contratualmente vinculante.</p>
   <p className="font-mono break-all text-xs mt-3">Referência: {record.reference}</p>
   <div className="flex flex-wrap mt-5 gap-3">
    <button type="button" onClick={refresh} disabled={working}
     className="min-h-11 rounded-lg px-4 border text-sm font-semibold">Atualizar situação</button>
    <button type="button" onClick={copy} disabled={working}
     className="min-h-11 rounded-lg px-4 border text-sm font-semibold">Copiar acesso privado</button>
    {record.status==='pending'&&<button type="button" onClick={cancel} disabled={working}
     className="min-h-11 rounded-lg px-4 border border-red-200 text-red-800 text-sm font-semibold">Cancelar pedido</button>}
   </div>
   <a href="/acompanhar" className="inline-flex items-center min-h-11 mt-3 text-sm font-semibold text-blue-800 underline">Acompanhar em outra visita</a>
   <p className="text-xs text-slate-600 mt-4">O código só fica em memória neste navegador.
    Guarde-o em local seguro se desejar consultar após fechar a página.
    Nunca divulgue o código publicamente.</p>
  </div>}
  {notice&&<p role="status" className="text-sm text-blue-800 mt-4">{notice}</p>}
  {error&&<p role="alert" className="text-sm text-red-800 mt-4">{error}</p>}
 </section>
}
