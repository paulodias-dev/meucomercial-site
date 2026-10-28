import {useRef,useState} from 'react'
import {ClipboardCheck,FileText,ShieldCheck} from 'lucide-react'

export type IndoorQuote={
 title:string;scope:string;amount_brl:string;valid_until:string;
 version:number;items:Array<{description:string;quantity:number;unit:string;unit_price_brl:string;line_total_brl:string}>;
 available_for_acknowledgement:boolean;acknowledged_at:string|null;nonbinding_quotation:true;
}
export type IndoorContractStatus={
 reference:string;status:string;version:number;proposal?:IndoorQuote|null;
 payment_created:false;subscription_created:false;contract_signed:false;
}
const statuses:Record<string,string>={
 proposal_presented:'Proposta comercial disponível para manifestação',
 proposal_acknowledged:'Interesse comercial registrado',
 proposal_declined:'Proposta comercial recusada',
}
const money=(raw:string)=>/^([0-9]{1,10})\.[0-9]{2}$/.test(raw)?
 'R$ '+raw.replace('.',','):'Valor a confirmar'
type Props={status:IndoorContractStatus;secret:string;onUpdated:(next:IndoorContractStatus)=>void}
export default function IndoorProposalResponsePanel({status,secret,onUpdated}:Props){
 const [acknowledge,setAcknowledge]=useState(false)
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('')
 const attempt=useRef<{fingerprint:string;uuid:string}|null>(null)
 const quote=status.proposal
 if(!quote || !['proposal_presented','proposal_acknowledged','proposal_declined'].includes(status.status))return null
 const canRespond=status.status==='proposal_presented'&&quote.available_for_acknowledgement
 const respond=async(decision:'acknowledge'|'decline')=>{
  if(busy||!canRespond||!secret)return
  if(decision==='acknowledge'&&!acknowledge){
   setError('Confirme a natureza não vinculante antes de registrar o interesse.');return
  }
  if(decision==='decline'&&!window.confirm('Registrar que não deseja prosseguir com esta proposta?'))return
  const fingerprint=JSON.stringify([status.reference,status.version,quote.version,decision])
  if(attempt.current?.fingerprint!==fingerprint)attempt.current={fingerprint,uuid:crypto.randomUUID()}
  setBusy(true);setError('');setNotice('')
  try{
   const response=await fetch('/api/indoor-contract-requests/'+encodeURIComponent(status.reference)+'/proposal-response',{
    method:'POST',cache:'no-store',credentials:'omit',
    headers:{Accept:'application/json','Content-Type':'application/json',Authorization:'Bearer '+secret},
    body:JSON.stringify({request_id:attempt.current.uuid,expected_version:status.version,
     proposal_version:quote.version,decision,acknowledge_nonbinding:decision==='acknowledge'}),
   })
   const body=await response.json().catch(()=>({}))
   if(!response.ok||body.reference!==status.reference||body.payment_created!==false||
    body.subscription_created!==false||body.contract_signed!==false||
    !['proposal_acknowledged','proposal_declined'].includes(body.status))
    throw Error(response.status===409?'A proposta mudou, expirou ou foi retirada. Atualize o pedido antes de responder.':
     response.status===429?'Muitas tentativas. Tente novamente mais tarde.':
     'A API não confirmou sua manifestação. É seguro repetir a mesma opção.')
   onUpdated(body as IndoorContractStatus)
   setNotice(decision==='acknowledge'?
    'Sua manifestação de interesse foi registrada. Nenhuma cobrança ou assinatura foi criada.':
    'Sua recusa foi registrada. Nenhuma cobrança foi criada.')
  }catch(e){setError(e instanceof Error?e.message:'Falha na comunicação.')}
  finally{setBusy(false)}
 }
 return <section className="mt-6 border rounded-2xl bg-white p-5 sm:p-7" aria-label="Proposta comercial Indoor">
  <div className="flex items-start gap-3">
   <FileText size={23} className="text-blue-700 shrink-0" aria-hidden/>
   <div><h3 className="text-xl font-bold">{statuses[status.status]}</h3>
    <p className="text-xs text-slate-600 mt-2">Esta é uma cotação informativa do CRM, não contrato assinado, boleto, PIX ou reserva de mídia.</p>
   </div>
  </div>
  <h4 className="font-semibold text-lg mt-5">{quote.title}</h4>
  <p className="text-sm leading-7 text-slate-700 mt-3 whitespace-pre-wrap break-words">{quote.scope}</p>
  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
   <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-600">Valor publicado</dt>
    <dd className="font-semibold mt-2">{money(quote.amount_brl)}</dd></div>
   <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-600">Validade da proposta</dt>
    <dd className="font-semibold mt-2">{quote.valid_until}</dd></div>
  </dl>
  {quote.items.length>0&&<div className="mt-5">
   <h5 className="text-sm font-semibold">Composição do orçamento</h5>
   <ul className="mt-2 space-y-2">{quote.items.map((item,i)=><li key={i}
    className="text-sm rounded-xl border p-3 flex flex-wrap gap-2 justify-between items-start">
    <span className="min-w-0 break-words">{item.description} · {item.quantity} {item.unit}</span>
    <span className="font-semibold">{money(item.line_total_brl)}</span>
   </li>)}</ul>
  </div>}
  {!quote.available_for_acknowledgement&&status.status==='proposal_presented'&&
   <p role="status" className="mt-5 text-sm text-amber-900 border border-amber-200 rounded-xl p-4">
    Esta cotação venceu, foi alterada ou retirada pelo Master. Solicite atualização; nenhuma manifestação positiva será aceita.
   </p>}
  {status.status==='proposal_acknowledged'&&<p role="status" className="mt-5 text-sm text-emerald-900 flex gap-2 items-center">
   <ClipboardCheck size={19} aria-hidden/>Manifestação registrada. Ainda não existe contrato assinado ou serviço ativo.</p>}
  {status.status==='proposal_declined'&&<p role="status" className="mt-5 text-sm text-slate-700">
   Sua decisão foi registrada. Para uma nova proposta, entre em contato com a equipe comercial.</p>}
  {canRespond&&<>
   <label className="flex items-start gap-3 text-sm leading-6 text-slate-800 mt-5">
    <input type="checkbox" className="w-5 h-5 shrink-0 mt-1 accent-blue-700"
     checked={acknowledge} onChange={e=>setAcknowledge(e.target.checked)}/>
    <span>Li a proposta e confirmo que minha manifestação representa apenas ciência e interesse
     em prosseguir. Não estou assinando contrato, autorizando pagamento ou ativando dispositivos.</span>
   </label>
   <div className="flex flex-wrap gap-3 mt-5">
    <button type="button" disabled={busy||!acknowledge}
     onClick={()=>respond('acknowledge')}
     className="min-h-12 rounded-xl bg-blue-700 text-white font-semibold text-sm px-5 disabled:opacity-40">
     {busy?'Registrando…':'Registrar interesse na proposta'}</button>
    <button type="button" disabled={busy} onClick={()=>respond('decline')}
     className="min-h-12 rounded-xl border border-slate-300 text-slate-800 font-semibold text-sm px-5 disabled:opacity-40">
     Não tenho interesse nesta proposta</button>
   </div>
  </>}
  <p className="text-xs text-slate-600 mt-5 flex gap-2"><ShieldCheck size={18} aria-hidden/>
   Nenhuma assinatura, pagamento ou publicação é gerada por esta manifestação.</p>
  {error&&<p role="alert" className="mt-4 text-sm text-red-800">{error}</p>}
  {notice&&<p role="status" className="mt-4 text-sm text-emerald-800">{notice}</p>}
 </section>
}
