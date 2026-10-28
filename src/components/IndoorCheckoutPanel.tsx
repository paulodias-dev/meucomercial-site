import {useRef,useState} from 'react'
import {CheckCircle2,Copy,FileText,RefreshCcw,ShieldCheck,Wallet} from 'lucide-react'

export type CheckoutView={
 status:'offered'|'accepted'|'pix_pending'|'paid_verified'|'payment_disputed'
 version:number;terms_version:string;terms_sha256:string;terms_text:string
 amount_brl:string;interval:'monthly'|'yearly';expires_at:string
 accepted_at:string|null;paid_verified_at:string|null;pix_status:string|null
 payment_verified_by_gateway_read:boolean;subscription_created:boolean;service_activated:boolean;next_step:string;
 provisioning:null|{status:'active'|'disputed';activated_at:string|null;
 disputed_at:string|null;subscription_created:true;service_activated:boolean;
 automatic_device_pairing:false}
}
export type CheckoutStatusShape={
 reference:string;checkout?:CheckoutView|null;payment_created:boolean;
 subscription_created:boolean;contract_signed:false
}
type PixResult={
 data:{request_id:string;payment_status:string;payment_id:string|null;
 remote_get_verified:boolean;amount_brl:string;payment_method:'pix'}
 pix:{copy_paste:string|null;qr_base64:string|null;
 gateway_status:string;gateway_status_is_payment_confirmation:false}
}
const amount=(value:string)=>/^([0-9]{1,13})\.[0-9]{2}$/.test(value)?
 'R$ '+value.replace('.',','):'Valor indisponível'
const message=(status:number)=>status===409?
 'Condições mudaram, expiraram ou há um PIX em conciliação. Atualize a solicitação.':
 status===422?'Confira os dados e os consentimentos obrigatórios.':
 status===429?'Muitas tentativas. Aguarde antes de tentar novamente.':
 'Não foi possível confirmar o resultado na API. Repita sem alterar os dados.'

export default function IndoorCheckoutPanel({data,secret,onChanged}:{
 data:CheckoutStatusShape;secret:string;onChanged:()=>Promise<void>|void
}){
 const checkout=data.checkout
 const [acceptTerms,setAcceptTerms]=useState(false)
 const [acceptRecurring,setAcceptRecurring]=useState(false)
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState(''),[notice,setNotice]=useState('')
 const [pix,setPix]=useState<PixResult|null>(null)
 const acceptance=useRef<{fingerprint:string;uuid:string}|null>(null)
 const attempt=useRef<string|null>(null)
 if(!checkout)return null
 const validUntil=Date.parse(checkout.expires_at.replace(' ','T')+'Z')
 const expired=Number.isFinite(validUntil)&&validUntil<Date.now()
 const api='/api/indoor-contract-requests/'+encodeURIComponent(data.reference)
 const auth={Authorization:'Bearer '+secret,Accept:'application/json'}
 const accept=async()=>{
  if(busy||checkout.status!=='offered'||expired||!acceptTerms||!acceptRecurring)return
  setBusy(true);setError('');setNotice('')
  try{
   const fingerprint=JSON.stringify([data.reference,checkout.version,checkout.terms_sha256])
   if(acceptance.current?.fingerprint!==fingerprint)
    acceptance.current={fingerprint,uuid:crypto.randomUUID()}
   const response=await fetch(api+'/checkout-accept',{
    method:'POST',cache:'no-store',credentials:'omit',
    headers:{...auth,'Content-Type':'application/json'},
    body:JSON.stringify({
     request_id:acceptance.current.uuid,expected_version:checkout.version,
     terms_sha256:checkout.terms_sha256,accept_contract_terms:true,accept_recurring_billing:true
    })
   })
   const body=await response.json().catch(()=>({}))
   if(!response.ok||body.status!=='accepted'||body.terms_sha256!==checkout.terms_sha256||
    body.subscription_created!==false||body.service_activated!==false)
    throw Error(message(response.status))
   setNotice('Condições registradas. O próximo passo é gerar o PIX; nenhum pagamento foi realizado ainda.')
   await onChanged()
  }catch(e){setError(e instanceof Error?e.message:'Falha no aceite.')}
  finally{setBusy(false)}
 }
 const issuePix=async()=>{
  if(busy||!['accepted','pix_pending'].includes(checkout.status)||expired)return
  if(!attempt.current)attempt.current=crypto.randomUUID()
  setBusy(true);setError('');setNotice('')
  try{
   const response=await fetch(api+'/pix',{
    method:'POST',credentials:'omit',cache:'no-store',
    headers:{...auth,'Content-Type':'application/json'},
    body:JSON.stringify({request_id:attempt.current})
   })
   const body=await response.json().catch(()=>({}))
   if(!response.ok||body.data?.payment_method!=='pix'||body.data?.remote_get_verified!==true||
    typeof body.data?.payment_id!=='string'||!body.pix)
    throw Error(message(response.status))
   setPix(body as PixResult)
   setNotice('PIX gerado. A geração do código não confirma o pagamento; aguarde a conciliação.')
   await onChanged()
  }catch(e){setError(e instanceof Error?e.message:'Falha ao gerar PIX.')}
  finally{setBusy(false)}
 }
 const retryUncertain=async()=>{
  if(busy||checkout.pix_status!=='creating')return
  setBusy(true);setError('');setNotice('')
  try{
   const response=await fetch(api+'/pix/retry',{
    method:'POST',credentials:'omit',cache:'no-store',
    headers:{...auth,'Content-Type':'application/json'},body:'{}',
   })
   const body=await response.json().catch(()=>({}))
   if(!response.ok||body.data?.payment_method!=='pix'||body.data?.remote_get_verified!==true||
    !body.pix)throw Error(message(response.status))
   setPix(body as PixResult)
   setNotice('Tentativa anterior recuperada com a mesma chave; não foi solicitado um segundo PIX.')
   await onChanged()
  }catch(e){setError(e instanceof Error?e.message:'Falha ao recuperar pagamento anterior.')}
  finally{setBusy(false)}
 }
 const recoverPix=async()=>{
  if(busy)return
  setBusy(true);setError('');setNotice('')
  try{
   const response=await fetch(api+'/pix',{
    credentials:'omit',cache:'no-store',headers:auth
   })
   const body=await response.json().catch(()=>({}))
   if(!response.ok||body.data?.payment_method!=='pix'||!body.pix)
    throw Error(message(response.status))
   setPix(body as PixResult)
   setNotice('Código recuperado pelo provedor. O status remoto isolado não comprova liquidação.')
  }catch(e){setError(e instanceof Error?e.message:'Falha ao recuperar o código.')}
  finally{setBusy(false)}
 }
 const copy=async()=>{
  const code=pix?.pix.copy_paste
  if(!code)return
  try{
   await navigator.clipboard.writeText(code)
   setNotice('Código Pix copiado somente após sua solicitação.')
  }catch{setError('Não foi possível copiar o código PIX.')}
 }
 return <section className="mt-6 p-5 sm:p-7 rounded-2xl border border-blue-100 bg-white" aria-label="Checkout Indoor">
  <div className="flex gap-3 items-start">
   <FileText className="text-blue-700 shrink-0" aria-hidden size={24}/>
   <div><h3 className="text-xl font-bold">Condições finais da contratação Indoor</h3>
    <p className="text-sm text-slate-700 mt-2">Leia as condições emitidas pela empresa antes de gerar qualquer pagamento.</p></div>
  </div>
  <div className="mt-5 rounded-xl bg-slate-50 p-4">
   <p className="font-bold text-lg">{amount(checkout.amount_brl)} /
    {checkout.interval==='monthly'?'mês':'ano'}</p>
   <p className="text-xs mt-2 text-slate-600">Versão {checkout.terms_version} · válida até {checkout.expires_at} UTC</p>
   <p className="font-mono text-xs break-all mt-2 text-slate-500">SHA-256: {checkout.terms_sha256}</p>
  </div>
  <div className="mt-4 p-4 rounded-xl border max-h-80 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-7"
   role="region" aria-label="Texto integral das condições financeiras">{checkout.terms_text}</div>
  {checkout.status==='offered'&&<div className="mt-5">
   {expired&&<p role="status" className="text-sm text-amber-800">Condições expiradas. Solicite novas condições ao comercial.</p>}
   <label className="flex gap-3 items-start text-sm mt-3">
    <input type="checkbox" checked={acceptTerms} onChange={e=>setAcceptTerms(e.target.checked)}
     className="w-5 h-5 shrink-0 mt-1 accent-blue-700"/>
    <span>Li as condições integrais, compreendo valores e prazo e confirmo meu aceite expresso.</span>
   </label>
   <label className="flex gap-3 items-start text-sm mt-3">
    <input type="checkbox" checked={acceptRecurring} onChange={e=>setAcceptRecurring(e.target.checked)}
     className="w-5 h-5 shrink-0 mt-1 accent-blue-700"/>
    <span>Estou ciente das condições de recorrência e renovação descritas acima.</span>
   </label>
   <button type="button" onClick={accept} disabled={busy||expired||!acceptTerms||!acceptRecurring}
    className="mt-5 min-h-12 bg-blue-700 rounded-xl px-5 text-white font-semibold text-sm disabled:opacity-40">
    {busy?'Registrando aceite…':'Aceitar as condições financeiras'}</button>
  </div>}
  {['accepted','pix_pending'].includes(checkout.status)&&<div className="mt-5">
   <div className="flex gap-2 items-center"><Wallet className="text-blue-700" size={20} aria-hidden/>
    <h4 className="font-semibold">Pagamento PIX</h4></div>
   <p className="text-sm text-slate-700 mt-2">O QR Code só é emitido após o aceite.
    A assinatura e os dispositivos não serão liberados até a confirmação financeira.</p>
   <div className="flex flex-wrap gap-3 mt-4">
    {checkout.pix_status===null&&<button type="button" disabled={busy||expired}
     onClick={issuePix} className="min-h-12 bg-blue-700 text-white rounded-xl px-5 font-semibold text-sm disabled:opacity-40">
     {busy?'Gerando…':'Gerar PIX de contratação'}</button>}
    {checkout.pix_status==='creating'&&<button type="button" disabled={busy}
     onClick={retryUncertain} className="min-h-12 rounded-xl border px-5 font-semibold text-sm">
     Retomar a tentativa anterior com segurança</button>}
    {checkout.pix_status!==null&&checkout.pix_status!=='creating'&&<button type="button" disabled={busy}
     onClick={recoverPix} className="min-h-12 rounded-xl border px-5 font-semibold text-sm">
     Recuperar QR Code no gateway</button>}
    <button type="button" disabled={busy} onClick={()=>onChanged()}
     className="min-h-12 rounded-xl border px-5 text-sm inline-flex items-center gap-2">
     <RefreshCcw size={17} aria-hidden/>Consultar status</button>
   </div>
  </div>}
  {pix?.pix.copy_paste&&<div className="border rounded-xl mt-5 p-4">
   <h4 className="font-semibold">PIX copia e cola</h4>
   <p className="mt-3 break-all text-xs font-mono bg-slate-50 p-3 rounded-xl">{pix.pix.copy_paste}</p>
   <button type="button" onClick={copy} className="mt-4 min-h-11 rounded-lg border px-4 inline-flex items-center gap-2 text-sm font-semibold">
    <Copy size={17} aria-hidden/>Copiar código</button>
   {pix.pix.qr_base64&&<img className="mt-4 max-w-60 w-full" alt="QR Code PIX fornecido pelo Mercado Pago"
    src={'data:image/png;base64,'+pix.pix.qr_base64}/>}
  </div>}
  {checkout.pix_status==='creating'&&<p role="status" className="mt-5 text-sm text-amber-900">
   Houve uma tentativa cujo resultado remoto é incerto. Recupere-a com a mesma chave,
   sem iniciar um pagamento novo.</p>}
  {checkout.status==='pix_pending'&&<p className="mt-5 text-sm text-amber-900">
   PIX emitido, aguardando confirmação pelo Mercado Pago. Não envie novo pagamento antes de verificar o anterior.</p>}
  {checkout.status==='paid_verified'&&checkout.provisioning===null&&<p role="status" className="mt-5 flex gap-2 text-sm text-emerald-800">
   <CheckCircle2 size={21} aria-hidden/>Pagamento verificado no gateway. A assinatura ainda depende do vínculo ao estabelecimento pelo Master.</p>}
  {checkout.provisioning?.status==='active'&&<div role="status"
   className="mt-5 border border-emerald-200 bg-emerald-50 rounded-xl p-4 text-emerald-900">
   <p className="flex gap-2 font-semibold"><CheckCircle2 size={22} aria-hidden/>
    Assinatura Indoor ativada!</p>
   <p className="text-sm mt-2">O primeiro período já está quitado com seu PIX.
    O próximo ciclo segue a recorrência prevista nas condições contratuais.
    O cadastro de telas, Players e mídias é realizado separadamente pelo administrador.</p>
  </div>}
  {checkout.provisioning?.status==='disputed'&&<p role="alert" className="mt-5 text-red-800 text-sm">
   A assinatura foi suspensa após contestação ou estorno financeiro. Entre em contato com o suporte.</p>}
  {checkout.status==='payment_disputed'&&<p role="alert" className="mt-5 text-red-800 text-sm">
   Pagamento contestado ou estornado; ativação bloqueada. Procure o suporte.</p>}
  <p className="mt-5 flex gap-2 text-xs text-slate-600"><ShieldCheck size={18} aria-hidden/>
   Nenhum código PIX prova pagamento por si só. Somente a API valida a liquidação no provedor.</p>
  {error&&<p role="alert" className="mt-4 text-sm text-red-800">{error}</p>}
  {notice&&<p role="status" className="mt-4 text-sm text-blue-800">{notice}</p>}
 </section>
}
