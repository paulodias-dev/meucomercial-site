import {useRef,useState} from 'react'
import type {IndoorContractStatus} from '../lib/indoorContractTypes'

type Decision='acknowledge'|'decline'
export default function IndoorProposalResponse({record,accessKey,onUpdate}:{
 record:IndoorContractStatus;accessKey:string;onUpdate:(next:IndoorContractStatus)=>void
}){
 const [agree,setAgree]=useState(false)
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 const [success,setSuccess]=useState('')
 const request=useRef<{fingerprint:string;uuid:string}|null>(null)
 const proposal=record.proposal
 if(!proposal)return null
 const available=record.status==='proposal_presented'&&proposal.available_for_acknowledgement
 const decide=async(decision:Decision)=>{
  if(busy||record.status!=='proposal_presented'||(decision==='acknowledge'&&(!available||!agree)))return
  if(!window.confirm(decision==='acknowledge'
   ?'Registrar que conhece a proposta e deseja continuar a negociação? Não é assinatura ou pagamento.'
   :'Recusar esta proposta comercial sem cobrança?'))return
  setBusy(true);setError('');setSuccess('')
  const fingerprint=JSON.stringify([record.reference,record.version,proposal.version,decision])
  if(request.current?.fingerprint!==fingerprint)
   request.current={fingerprint,uuid:crypto.randomUUID()}
  try{
   const response=await fetch('/api/indoor-contract-requests/'+encodeURIComponent(record.reference)+'/proposal-response',{
    method:'POST',credentials:'omit',cache:'no-store',
    headers:{Accept:'application/json','Content-Type':'application/json',Authorization:'Bearer '+accessKey},
    body:JSON.stringify({
     request_id:request.current.uuid,expected_version:record.version,
     proposal_version:proposal.version,decision,
     acknowledge_nonbinding:decision==='acknowledge'&&agree
    })
   })
   const result=await response.json().catch(()=>({}))
   if(!response.ok||result.reference!==record.reference||
     result.payment_created!==false||result.subscription_created!==false||
     result.contract_signed!==false||
     !['proposal_acknowledged','proposal_declined'].includes(result.status)){
    throw Error(response.status===409?'A proposta foi alterada ou venceu. Atualize a consulta antes de responder.':
     'A API não confirmou sua manifestação. Você pode tentar novamente.')
   }
   onUpdate(result as IndoorContractStatus)
   setSuccess(decision==='acknowledge'
    ?'Seu interesse foi registrado. O contrato e eventual pagamento serão tratados em etapa posterior.'
    :'Sua recusa foi registrada. Nenhuma cobrança foi criada.')
  }catch(ex){setError(ex instanceof Error?ex.message:'Não foi possível enviar a resposta.')}
  finally{setBusy(false)}
 }
 return <section className="mt-6 border rounded-2xl bg-white p-5 sm:p-7" aria-label="Proposta comercial">
  <p className="text-xs text-blue-800 font-bold tracking-wider uppercase">Cotação comercial não vinculante</p>
  <h3 className="mt-2 text-lg font-bold">{proposal.title}</h3>
  <p className="text-sm leading-7 mt-3 text-slate-700 whitespace-pre-wrap break-words">{proposal.scope}</p>
  <p className="text-sm font-semibold mt-4">Valor apresentado: R$ {proposal.amount_brl.replace('.',',')} · válido até {proposal.valid_until}</p>
  {proposal.items.length>0&&<div className="mt-5 overflow-x-auto">
   <table className="w-full text-xs sm:text-sm border-collapse" aria-label="Itens da proposta">
    <thead><tr className="border-b text-left"><th scope="col" className="p-2">Descrição</th>
     <th scope="col" className="p-2">Qtd.</th><th scope="col" className="p-2">Valor</th></tr></thead>
    <tbody>{proposal.items.map((item,index)=><tr className="border-b" key={index}>
     <td className="p-2 break-words">{item.description}</td>
     <td className="p-2">{item.quantity} {item.unit}</td>
     <td className="p-2">R$ {item.line_total_brl.replace('.',',')}</td>
    </tr>)}</tbody>
   </table>
  </div>}
  <p className="text-xs text-slate-600 leading-6 mt-4">
   Esta proposta ainda não representa contrato assinado, obrigação de pagamento, reserva de mídia ou
   ativação de serviço. A confirmação abaixo registra apenas sua ciência e interesse comercial.
  </p>
  {record.status==='proposal_presented'&&<>
   {!proposal.available_for_acknowledgement&&<p role="alert" className="text-sm text-amber-900 border rounded-xl p-3 mt-4">
    A proposta foi retirada, alterada ou expirou. Não é possível confirmá-la; solicite uma nova versão à equipe comercial.
   </p>}
   <label className="flex items-start gap-3 mt-5 text-sm text-slate-700 leading-6">
    <input type="checkbox" checked={agree} onChange={event=>setAgree(event.target.checked)}
     className="mt-1 w-5 h-5 shrink-0 accent-blue-700"/>
    <span>Li as condições e tenho interesse em prosseguir com a negociação.
     Entendo que não estou assinando contrato nem autorizando cobrança.</span>
   </label>
   <div className="flex flex-wrap gap-3 mt-5">
    <button type="button" disabled={busy||!agree||!available} onClick={()=>decide('acknowledge')}
     className="min-h-12 px-5 rounded-xl bg-blue-700 text-white font-semibold text-sm disabled:opacity-40">
     Confirmar interesse na proposta</button>
    <button type="button" disabled={busy} onClick={()=>decide('decline')}
     className="min-h-12 px-5 rounded-xl border border-slate-300 text-slate-800 font-semibold text-sm disabled:opacity-40">
     Recusar proposta</button>
   </div>
  </>}
  {record.status==='proposal_acknowledged'&&<p className="mt-4 text-sm text-emerald-800">
   Interesse comercial registrado. A equipe verificará próximos passos e instrumentos contratuais.</p>}
  {record.status==='proposal_declined'&&<p className="mt-4 text-sm text-slate-700">Proposta recusada. Nenhum pagamento foi gerado.</p>}
  {error&&<p role="alert" className="mt-4 text-sm text-red-800">{error}</p>}
  {success&&<p role="status" className="mt-4 text-sm text-emerald-800">{success}</p>}
 </section>
}
