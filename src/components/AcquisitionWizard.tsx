import {useEffect,useRef,useState} from 'react'
import type {FormEvent} from 'react'
import {ArrowLeft,ArrowRight,ShieldCheck} from 'lucide-react'
import IndoorContractProgress from './IndoorContractProgress'
import {verifyIndoorCatalog,verifyIndoorPlans,moneyExact} from '../lib/indoorCatalog.mjs'
import {readAcquisitionIntent,buildAcquisitionPayload,acquisitionError} from '../lib/acquisitionRequest.mjs'

type Kind='establishment'|'agency'|'advertiser'
type Medium='tv'|'radio'|'mixed'
type Plan={plan_id:number;name:string;description:string|null;price:string;interval:'monthly'|'yearly';max_devices:number|null}
type Offer={offer_id:number;title:string;region:string;medium:'tv'|'radio';description:string}
type Form={name:string;company:string;email:string;whatsapp:string;city:string;details:string;screensCount:string}
const names:Record<Kind,string>={establishment:'Estabelecimento',agency:'Agência',advertiser:'Anunciante'}
const inputStyle='w-full mt-2 min-h-11 p-3 rounded-xl border border-slate-300 bg-white text-sm focus-visible:outline-2 focus-visible:outline-blue-700'
const formEmpty:Form={name:'',company:'',email:'',whatsapp:'',city:'',details:'',screensCount:'1'}

export default function AcquisitionWizard(){
 const intent=readAcquisitionIntent(window.location.search)
 const [kind,setKind]=useState<Kind>(intent.kind as Kind)
 const [step,setStep]=useState(0),[medium,setMedium]=useState<Medium>('mixed')
 const [plans,setPlans]=useState<Plan[]>([]),[offers,setOffers]=useState<Offer[]>([])
 const [selected,setSelected]=useState<number|null>(intent.planId??intent.offerId)
 const [loading,setLoading]=useState(false),[error,setError]=useState('')
 const [reload,setReload]=useState(0),[page,setPage]=useState(1),[lastPage,setLastPage]=useState(1)
 const [region,setRegion]=useState(''),[regionInput,setRegionInput]=useState(''),[filterError,setFilterError]=useState('')
 const [form,setForm]=useState<Form>(formEmpty),[consent,setConsent]=useState(false)
 const [submitting,setSubmitting]=useState(false),[submitError,setSubmitError]=useState('')
 const [receipt,setReceipt]=useState<string|null>(null)
 const request=useRef<{fingerprint:string;key:string}|null>(null)
 const changeKind=(value:Kind)=>{
  setKind(value);setSelected(null);setPage(1);setRegion('');setRegionInput('')
  setError('');setSubmitError('');setConsent(false)
 }
 const change=(field:keyof Form,value:string)=>{setForm(current=>({...current,[field]:value}));setSubmitError('')}
 useEffect(()=>{
  const abort=new AbortController()
  if(kind==='agency'){setPlans([]);setOffers([]);setLoading(false);setError('');return()=>abort.abort()}
  setLoading(true);setError('')
  const q=new URLSearchParams({page:String(page),per_page:'12'})
  if(kind==='advertiser'&&medium!=='mixed')q.set('medium',medium)
  if(kind==='advertiser'&&region)q.set('region',region)
  fetch(kind==='establishment'?'/api/indoor-plans':'/api/indoor-catalog?'+q,{
   signal:abort.signal,credentials:'omit',cache:'no-store',headers:{Accept:'application/json'}
  }).then(async response=>{
   if(!response.ok)throw Error('Catálogo indisponível.')
   return response.json()
  }).then(data=>{
   if(abort.signal.aborted)return
   if(kind==='establishment'){
    if(!verifyIndoorPlans(data))throw Error('Contrato dos planos inválido.')
    setPlans(data.data);setOffers([])
    setSelected(id=>id!==null&&data.data.some((p:Plan)=>p.plan_id===id)?id:null)
   }else{
    if(!verifyIndoorCatalog(data))throw Error('Contrato das oportunidades inválido.')
    setOffers(data.data);setPlans([]);setLastPage(data.pagination.last_page)
    setSelected(id=>id!==null&&data.data.some((o:Offer)=>o.offer_id===id)?id:null)
   }
  }).catch(reason=>{
   if(!abort.signal.aborted){setError(reason instanceof Error?reason.message:'Consulta indisponível.');setPlans([]);setOffers([]);setSelected(null)}
  }).finally(()=>{if(!abort.signal.aborted)setLoading(false)})
  return()=>abort.abort()
 },[kind,medium,region,page,reload])
 const applyRegion=()=>{
  const value=regionInput.trim()
  if(value&&!/^[\p{L}\p{N}\s.'-]{2,80}$/u.test(value)){setFilterError('Digite uma região válida.');return}
  setFilterError('');setSelected(null);setPage(1);setRegion(value)
 }
 const submit=async(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();if(submitting||receipt)return
  setSubmitting(true);setSubmitError('')
  try{
   const planId=kind==='establishment'&&plans.some(p=>p.plan_id===selected)?selected:null
   const offerId=kind==='advertiser'&&offers.some(o=>o.offer_id===selected)?selected:null
   const draft=buildAcquisitionPayload({...form,kind,medium,consent,planId,offerId},
    '00000000-0000-4000-8000-000000000000',window.location.search)
   const {idempotency_key:ignored,...stable}=draft;void ignored
   const fingerprint=JSON.stringify(stable)
   if(!request.current||request.current.fingerprint!==fingerprint)
    request.current={fingerprint,key:crypto.randomUUID()}
   const response=await fetch('/api/commercial-leads',{
    method:'POST',credentials:'omit',cache:'no-store',
    headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify({...stable,idempotency_key:request.current.key})
   })
   const data=await response.json().catch(()=>({}))
   if(!response.ok||data.received!==true)throw Error(acquisitionError(response.status))
   setReceipt(request.current.key)
  }catch(reason){setSubmitError(reason instanceof Error?reason.message:'Falha de comunicação.')}
  finally{setSubmitting(false)}
 }
 const activePlan=plans.find(p=>p.plan_id===selected),activeOffer=offers.find(o=>o.offer_id===selected)
 return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
  <p className="text-xs uppercase font-bold tracking-widest text-blue-700">Aquisição comercial</p>
  <h1 className="font-display text-3xl sm:text-4xl font-bold mt-3">Prepare sua solicitação</h1>
  <p className="text-sm sm:text-base text-slate-600 mt-3 leading-7 max-w-3xl">
   Escolha seu perfil, consulte opções reais publicadas e envie seu interesse à equipe.
   O envio não cria contrato, pagamento, assinatura ou reserva de mídia.
  </p>
  {receipt?<section className="bg-white border rounded-2xl mt-8 p-6 sm:p-10" aria-live="polite">
   <h2 className="text-2xl font-bold text-emerald-800">Solicitação recebida pela API!</h2>
   <p className="text-sm mt-4 leading-7 text-slate-700">O pedido de {names[kind].toLowerCase()} foi registrado.
    A equipe comercial poderá verificar condições, direitos e disponibilidade.
    Nenhum pagamento ou reserva foi realizado.</p>
   <p className="text-xs text-slate-600 mt-3">Protocolo: <span className="break-all font-mono">{receipt}</span></p>
   {kind==='establishment'&&activePlan&&<IndoorContractProgress leadReference={receipt} planId={activePlan.plan_id} email={form.email}/>}
   <a href="/" className="inline-flex mt-6 min-h-11 items-center text-blue-800 font-semibold">Voltar ao início</a>
  </section>:<>
   <ol className="mt-8 grid grid-cols-3 max-w-2xl gap-2" aria-label="Etapas da jornada">
    {['Perfil','Catálogo','Contato'].map((label,index)=><li key={label}
     aria-current={index===step?'step':undefined}
     className={'rounded-xl p-3 text-xs sm:text-sm font-semibold text-center '+(step===index?'bg-blue-700 text-white':'bg-white border text-slate-600')}>
     {index+1}. {label}</li>)}
   </ol>
   {step===0&&<section className="mt-5 p-5 sm:p-8 bg-white rounded-2xl border">
    <h2 className="font-bold text-xl">Como deseja participar?</h2>
    <fieldset className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
     <legend className="sr-only">Selecione seu perfil</legend>
     {(['establishment','agency','advertiser'] as Kind[]).map(role=><label key={role}
      className={'border-2 rounded-xl cursor-pointer p-5 flex flex-col gap-3 '+(role===kind?'bg-blue-50 border-blue-700':'border-slate-200')}>
      <input type="radio" name="role" checked={kind===role} onChange={()=>changeKind(role)} className="w-5 h-5 accent-blue-700"/>
      <strong>{names[role]}</strong><span className="text-sm text-slate-600">
      {role==='establishment'?'Quero TV ou Rádio no meu negócio.':role==='agency'?'Quero gerir minha carteira de clientes.':'Quero anunciar em pontos autorizados.'}
      </span></label>)}
    </fieldset>
   </section>}
   {step===1&&<section className="mt-5 p-5 sm:p-8 bg-white rounded-2xl border">
    <div className="flex flex-wrap justify-between gap-3 items-center">
     <div><h2 className="font-bold text-xl">Condições de {names[kind].toLowerCase()}</h2>
      <p className="text-xs text-slate-600 mt-2">Seleção opcional e não vinculante, revalidada pela API.</p></div>
     {kind!=='agency'&&<button className="rounded-xl border min-h-11 px-4 text-sm" onClick={()=>setReload(x=>x+1)}>Atualizar</button>}
    </div>
    {kind==='agency'&&<p className="text-sm leading-7 text-slate-700 mt-5">
     Para agências, a equipe avalia número de clientes, permissões, módulos e plano escalável.
     Não existe preço de agência público confirmado nesta jornada.</p>}
    {kind==='advertiser'&&<div className="mt-5 flex flex-wrap gap-3 items-end">
     <label className="text-sm flex-1 min-w-36">Mídia
      <select className={inputStyle} value={medium} onChange={e=>{setMedium(e.target.value as Medium);setPage(1);setSelected(null)}}>
       <option value="mixed">TV e Rádio</option><option value="tv">TV</option><option value="radio">Rádio</option>
      </select></label>
     <label className="text-sm flex-[2] min-w-44">Região
      <input className={inputStyle} value={regionInput} maxLength={80} onChange={e=>setRegionInput(e.target.value)}/>
     </label>
     <button className="rounded-xl bg-slate-900 text-white min-h-11 px-5 text-sm" onClick={applyRegion}>Pesquisar</button>
    </div>}
    {filterError&&<p role="alert" className="text-red-800 text-sm mt-2">{filterError}</p>}
    {loading&&<p role="status" className="text-sm mt-5">Carregando catálogo…</p>}
    {error&&<p role="alert" className="text-sm text-amber-900 mt-5">{error} É possível pedir análise sem selecionar item.</p>}
    {!loading&&!error&&kind!=='agency'&&(kind==='establishment'?plans.length===0:offers.length===0)&&
     <p className="text-sm mt-5">Nenhum item autorizado encontrado. Você ainda pode solicitar uma proposta.</p>}
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
     {kind==='establishment'&&plans.map(p=><button key={p.plan_id} type="button" aria-pressed={p.plan_id===selected}
      onClick={()=>setSelected(p.plan_id)} className={'border-2 text-left rounded-xl p-5 '+(p.plan_id===selected?'border-blue-700 bg-blue-50':'border-slate-200')}>
      <strong className="block">{p.name}</strong>
      <span className="text-blue-800 font-semibold block mt-2">{moneyExact(p.price)} / {p.interval==='monthly'?'mês':'ano'}</span>
      <span className="block text-xs text-slate-600 mt-2">{p.max_devices===null?'Limite de dispositivos sob consulta':'Até '+p.max_devices+' dispositivos no plano'}</span>
      <span className="block text-sm text-slate-600 mt-3">{p.description??'Mais detalhes mediante proposta.'}</span>
     </button>)}
     {kind==='advertiser'&&offers.map(o=><button key={o.offer_id} type="button" aria-pressed={o.offer_id===selected}
      onClick={()=>setSelected(o.offer_id)} className={'border-2 text-left rounded-xl p-5 '+(o.offer_id===selected?'border-blue-700 bg-blue-50':'border-slate-200')}>
      <strong className="block">{o.title}</strong><span className="block text-xs text-blue-800 mt-2">{o.region} · {o.medium==='tv'?'TV':'Rádio'}</span>
      <span className="block text-sm text-slate-600 mt-3">{o.description}</span>
      <span className="block text-xs text-amber-900 mt-3">Preço e capacidade sob consulta.</span>
     </button>)}
    </div>
    {kind==='advertiser'&&!loading&&!error&&lastPage>1&&<nav aria-label="Paginação de ofertas" className="flex gap-3 items-center mt-5">
     <button disabled={page<=1} className="border rounded-lg min-h-11 px-4 disabled:opacity-40" onClick={()=>{setPage(p=>p-1);setSelected(null)}}>Anterior</button>
     <span className="text-xs">{page}/{lastPage}</span>
     <button disabled={page>=lastPage} className="border rounded-lg min-h-11 px-4 disabled:opacity-40" onClick={()=>{setPage(p=>p+1);setSelected(null)}}>Próxima</button>
    </nav>}
    {selected!==null&&<button type="button" onClick={()=>setSelected(null)} className="mt-5 min-h-11 text-blue-800 underline text-sm">Continuar sem seleção específica</button>}
   </section>}
   {step===2&&<section className="mt-5 p-5 sm:p-8 bg-white rounded-2xl border">
    <h2 className="text-xl font-bold">Dados para análise comercial</h2>
    <p className="text-sm mt-2 text-slate-600">
     {names[kind]} · {activePlan?'Plano '+activePlan.name:activeOffer?'Oferta '+activeOffer.title:'Sem opção específica'}
    </p>
    <form className="mt-5 space-y-4" onSubmit={submit}>
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {([['name','Nome completo','text',120],['company','Empresa','text',160],
         ['email','E-mail','email',190],['whatsapp','WhatsApp / telefone','tel',24]] as const).map(([field,label,type,max])=>
       <label key={field} className="text-sm font-semibold">{label} *
        <input required type={type} maxLength={max} className={inputStyle} value={form[field]} onChange={e=>change(field,e.target.value)}/>
       </label>)}
     </div>
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <label className="text-sm font-semibold">Cidade (opcional)
       <input value={form.city} maxLength={60} className={inputStyle} onChange={e=>change('city',e.target.value)}/>
      </label>
      {kind==='establishment'?<label className="text-sm font-semibold">Quantidade de aparelhos
       <input type="number" min={1} max={10000} required className={inputStyle}
        value={form.screensCount} onChange={e=>change('screensCount',e.target.value)}/>
      </label>:<label className="text-sm font-semibold">Meio de interesse
       <select className={inputStyle} value={medium} onChange={e=>{setMedium(e.target.value as Medium);setSelected(null)}}>
        <option value="mixed">TV e Rádio</option><option value="tv">TV</option><option value="radio">Rádio</option>
       </select></label>}
     </div>
     <label className="block text-sm font-semibold">Detalhes da necessidade (opcional)
      <textarea className={inputStyle} rows={4} maxLength={1800} value={form.details}
       onChange={e=>change('details',e.target.value)} placeholder="Descreva quantidade, região, período e objetivos"/>
     </label>
     <label className="flex gap-3 text-sm text-slate-700 leading-6">
      <input type="checkbox" required checked={consent} className="w-5 h-5 shrink-0 mt-1 accent-blue-700" onChange={e=>setConsent(e.target.checked)}/>
      <span>Autorizo o uso de meus dados para responder a esta solicitação. Sei que não ocorre contrato, cobrança, assinatura ou reserva automática.</span>
     </label>
     <p className="flex gap-2 text-xs text-slate-700 leading-6 border rounded-xl bg-slate-50 p-4">
      <ShieldCheck size={20} className="text-blue-700 shrink-0" aria-hidden/>
      Equipamentos, licenças, preços e direitos de veiculação exigem validação posterior. Não forneça dados confidenciais.</p>
     {submitError&&<p role="alert" className="rounded-lg border border-red-200 p-3 text-sm text-red-800">{submitError}</p>}
     <button disabled={!consent||submitting} className="w-full min-h-12 rounded-xl bg-blue-700 text-white font-semibold disabled:opacity-40">
      {submitting?'Enviando…':'Enviar pedido para análise'}
     </button>
    </form>
   </section>}
   <div className="flex flex-wrap justify-between gap-3 mt-6 max-w-4xl">
    <button disabled={step===0||submitting} onClick={()=>{setStep(s=>s-1);setSubmitError('')}}
     className="min-h-11 border bg-white rounded-xl px-5 inline-flex items-center gap-2 disabled:opacity-40">
     <ArrowLeft size={17} aria-hidden/>Voltar</button>
    {step<2&&<button className="min-h-11 px-5 bg-blue-700 text-white rounded-xl inline-flex items-center gap-2"
     onClick={()=>setStep(s=>s+1)}>Continuar <ArrowRight size={17} aria-hidden/></button>}
   </div>
  </>}
 </div>
}
