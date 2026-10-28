import {useRef,useState} from 'react'
import type {FormEvent} from 'react'
import {ArrowLeft,RefreshCcw,ShieldCheck} from 'lucide-react'
import SEO from './SEO'
import IndoorProposalResponsePanel, {type IndoorContractStatus,type IndoorQuote} from './IndoorProposalResponsePanel'
import IndoorCheckoutPanel, {type CheckoutView,type CheckoutStatusShape} from './IndoorCheckoutPanel'

type State='pending'|'approved_for_proposal'|'proposal_presented'|'proposal_acknowledged'|'proposal_declined'|'declined'|'cancelled'
type Status={reference:string;status:State;version:number;plan:{
 name:string;display_price_brl:string;interval:'monthly'|'yearly';
 price_is_contractually_binding:false};
 payment_created:boolean;subscription_created:boolean;contract_signed:false;proposal?:IndoorQuote|null;checkout?:CheckoutView|null}
const validRef=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const validKey=/^[a-f0-9]{64}$/i
const labels:Record<State,string>={
 pending:'Em análise pelo Master',
 approved_for_proposal:'Aprovado para proposta manual',
 proposal_presented:'Proposta disponível para manifestação',
 proposal_acknowledged:'Interesse registrado na proposta',
 proposal_declined:'Proposta recusada',
 declined:'Pedido recusado',
 cancelled:'Pedido cancelado',
}
export default function ContractTrackingPage(){
 const [reference,setReference]=useState('')
 const [code,setCode]=useState('')
 const [status,setStatus]=useState<Status|null>(null)
 const [busy,setBusy]=useState(false)
 const cancelOperation=useRef<string|null>(null)
 const [error,setError]=useState(''),[notice,setNotice]=useState('')
 const refresh=async(event?:FormEvent)=>{
  event?.preventDefault()
  if(busy)return
  setError('');setNotice('')
  if(!validRef.test(reference.trim())||!validKey.test(code.trim())){
   setError('Informe o UUID da solicitação e o código privado de 64 caracteres.');return
  }
  setBusy(true);cancelOperation.current=null
  try{
   const response=await fetch('/api/indoor-contract-requests/'+encodeURIComponent(reference.trim()),{
    credentials:'omit',cache:'no-store',
    headers:{Accept:'application/json',Authorization:'Bearer '+code.trim()},
   })
   const body=await response.json().catch(()=>({}))
   if(!response.ok||body.reference!==reference.trim()||
      typeof body.payment_created!=='boolean'||typeof body.subscription_created!=='boolean'||
      body.contract_signed!==false||typeof body.version!=='number'||
      typeof body.plan?.name!=='string'||
      !['pending','approved_for_proposal','proposal_presented','proposal_acknowledged','proposal_declined','declined','cancelled'].includes(body.status))
    throw Error(response.status===401||response.status===404?
     'Referência ou código não localizado. Confira os dados.':
     'Não foi possível confirmar o estado do pedido.')
   setStatus(body as Status)
  }catch(cause){setError(cause instanceof Error?cause.message:'Falha de consulta.')}
  finally{setBusy(false)}
 }
 const cancel=async()=>{
  if(busy||status?.status!=='pending')return
  if(!window.confirm('Cancelar esta análise pendente? Não houve pagamento.'))return
  setBusy(true);setError('');setNotice('')
  if(!cancelOperation.current)cancelOperation.current=crypto.randomUUID()
  try{
   const response=await fetch('/api/indoor-contract-requests/'+encodeURIComponent(status.reference)+'/cancel',{
    method:'POST',credentials:'omit',cache:'no-store',
    headers:{Authorization:'Bearer '+code.trim(),
     Accept:'application/json','Content-Type':'application/json'},
    body:JSON.stringify({request_id:cancelOperation.current,expected_version:status.version}),
   })
   const body=await response.json().catch(()=>({}))
   if(!response.ok||body.status!=='cancelled'||body.payment_created!==false)
    throw Error('A API não confirmou o cancelamento. Atualize o pedido antes de tentar novamente.')
   setStatus(body as Status);setNotice('Cancelamento confirmado. Nenhuma cobrança foi realizada.')
  }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível cancelar.')}
  finally{setBusy(false)}
 }
 return <main className="min-h-screen bg-[#F5F7FA] text-slate-900">
  <SEO title="Acompanhar solicitação Indoor" url="/acompanhar" robots="noindex, nofollow, noarchive"
   description="Consulta privada de solicitações pré-contratuais Meu Comercial."/>
  <header className="bg-white border-b">
   <div className="max-w-3xl mx-auto py-4 px-4 sm:px-6">
    <a href="/contratar" className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-blue-800">
     <ArrowLeft size={18} aria-hidden/>Voltar à contratação</a>
   </div>
  </header>
  <div className="max-w-3xl mx-auto p-4 sm:p-6 py-10 sm:py-14">
   <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Área de consulta privada</p>
   <h1 className="text-3xl font-bold mt-3">Acompanhe seu pedido</h1>
   <p className="text-sm text-slate-700 leading-7 mt-3">
    Informe a referência e o código privado que você copiou ao solicitar a análise
    do plano Indoor. Nenhum acesso ao Admin ou ao Portal do cliente é necessário.
   </p>
   <form className="border rounded-2xl bg-white p-5 sm:p-8 mt-7 space-y-4" onSubmit={refresh}>
    <label className="block text-sm font-semibold">Referência UUID
     <input className="w-full mt-2 border rounded-xl p-3 min-h-11 font-mono text-sm"
      value={reference} maxLength={36} autoComplete="off" spellCheck={false}
      placeholder="xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx"
      onChange={e=>{setReference(e.target.value);setStatus(null);setError('')}} required/>
    </label>
    <label className="block text-sm font-semibold">Código privado de acompanhamento
     <input type="password" className="w-full mt-2 border rounded-xl p-3 min-h-11 font-mono text-sm"
      value={code} maxLength={64} autoComplete="off" spellCheck={false}
      onChange={e=>{setCode(e.target.value);setStatus(null);setError('')}}
      placeholder="64 caracteres hexadecimais" required/>
    </label>
    <button type="submit" disabled={busy}
     className="min-h-12 bg-blue-700 text-white font-semibold rounded-xl px-6 w-full inline-flex items-center justify-center gap-2 disabled:opacity-40">
     <RefreshCcw size={18} aria-hidden/>{busy?'Consultando…':'Consultar situação'}
    </button>
    <p className="text-xs text-slate-600">Os dados permanecem somente em memória nesta página.
     Não usamos URLs com segredos, cookies ou armazenamento local.</p>
   </form>
   {error&&<p role="alert" className="mt-5 border border-red-200 p-4 rounded-lg text-red-800 text-sm">{error}</p>}
   {notice&&<p role="status" className="mt-5 border p-4 rounded-lg text-emerald-800 text-sm">{notice}</p>}
   {status&&<section className="mt-6 border bg-white rounded-2xl p-5 sm:p-8" aria-live="polite">
    <ShieldCheck className="text-blue-700" size={26} aria-hidden/>
    <h2 className="text-xl font-bold mt-3">{labels[status.status]}</h2>
    <p className="text-sm text-slate-700 mt-4">{status.plan.name} · R$ {status.plan.display_price_brl.replace('.',',')}
     /{status.plan.interval==='monthly'?'mês':'ano'} (condição comercial não vinculante).</p>
    <p className="text-xs text-slate-600 mt-2">A análise comercial não ativa assinatura nem dispositivos. {status.payment_created?"Existe PIX associado ao checkout; confira o status financeiro abaixo.":"Nenhuma cobrança PIX foi gerada neste momento."}</p>
    {status.status==='pending'&&<button type="button" disabled={busy} onClick={cancel}
     className="mt-5 border border-red-200 text-red-800 rounded-xl min-h-11 px-5 text-sm font-semibold">
     Cancelar pedido pendente</button>}
   </section>}
   {status&&<IndoorProposalResponsePanel status={status as IndoorContractStatus} secret={code.trim()}
     onUpdated={updated=>setStatus(updated as Status)}/>}
   {status?.checkout&&<IndoorCheckoutPanel data={status as CheckoutStatusShape} secret={code.trim()} onChanged={refresh}/>}
  </div>
 </main>
}
