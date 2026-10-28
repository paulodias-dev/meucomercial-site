import {useEffect,useState} from 'react'
import {ArrowRight, RefreshCcw, ShieldCheck} from 'lucide-react'
import {commercialContactUrl} from '../lib/commercialIntent.mjs'
import {acquisitionUrl} from '../lib/acquisitionRequest.mjs'
import {verifyIndoorPlans,moneyExact} from '../lib/indoorCatalog.mjs'

type Plan={plan_id:number;name:string;description:string|null;price:string;currency:'BRL';interval:'monthly'|'yearly';max_devices:number|null;storage_mb:number|null;trial_days:number;checkout_available:false}

export default function PublicIndoorPricing(){
 const [plans,setPlans]=useState<Plan[]>([])
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const [reload,setReload]=useState(0)
 useEffect(()=>{
  const abort=new AbortController()
  setLoading(true);setError('')
  fetch('/api/indoor-plans',{headers:{Accept:'application/json'},signal:abort.signal,cache:'no-store',credentials:'omit'})
   .then(async response=>{if(!response.ok)throw Error('Catálogo de planos indisponível.');return response.json()})
   .then(json=>{if(!verifyIndoorPlans(json))throw Error('Resposta do catálogo de planos inválida.');if(!abort.signal.aborted)setPlans(json.data)})
   .catch(e=>{if(!abort.signal.aborted){setPlans([]);setError(e instanceof Error?e.message:'Falha na consulta dos planos.')}})
   .finally(()=>{if(!abort.signal.aborted)setLoading(false)})
  return ()=>abort.abort()
 },[reload])
 return <section className='py-12 bg-white border-y border-black/5' aria-label='Planos Indoor oficiais'>
   <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <div className='flex gap-4 justify-between items-start flex-wrap'>
      <div><span className='text-xs font-bold uppercase tracking-widest text-blue-800'>Planos com divulgação autorizada</span>
        <h2 className='font-display text-2xl sm:text-3xl font-bold mt-2'>Condições reais cadastradas na plataforma</h2>
        <p className='text-sm mt-2 text-slate-600 max-w-2xl'>Exibimos apenas planos Indoor ativos liberados para divulgação. A disponibilidade de aparelhos, implantação e contratação dependerá da proposta.</p></div>
      <button type='button' onClick={()=>setReload(v=>v+1)} aria-label='Atualizar planos' className='min-h-11 rounded-lg border border-slate-200 px-4 flex items-center gap-2 text-sm'>
        <RefreshCcw size={16} aria-hidden/> Atualizar</button>
    </div>
    {loading&&<p role='status' className='mt-6 text-sm text-slate-600'>Consultando catálogo oficial…</p>}
    {!loading&&error&&<p role='alert' className='mt-6 text-sm text-amber-900'>Não foi possível confirmar preços e limites agora. Solicite uma proposta para obter as condições vigentes.</p>}
    {!loading&&!error&&plans.length===0&&<p className='mt-6 text-sm text-slate-600'>Nenhum plano foi liberado para divulgação pública. Consulte o comercial para receber uma proposta.</p>}
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6'>
      {plans.map(plan=><article key={plan.plan_id} className='rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col gap-3'>
        <strong className='text-lg'>{plan.name}</strong>
        <p className='text-sm text-slate-600 whitespace-pre-line'>{plan.description||'Condições detalhadas mediante proposta.'}</p>
        <div className='text-2xl font-bold text-blue-900'>{moneyExact(plan.price)}
          <span className='text-xs text-slate-600 font-normal ml-1'>/{plan.interval==='yearly'?'ano':'mês'}</span>
        </div>
        <p className='text-xs text-slate-600'>
          {plan.max_devices!==null?'Até '+plan.max_devices+' dispositivos incluídos na configuração do plano.':'Quantidade de aparelhos a confirmar.'}
        </p>
        <p className='text-xs text-slate-600 flex gap-2 items-start'><ShieldCheck size={17} className='shrink-0' aria-hidden/> Informações de cadastro comercial; não constituem oferta vinculante nem checkout automático.</p>
        <a href={acquisitionUrl({kind:'establishment',planId:plan.plan_id},window.location.search)}
          className='min-h-11 bg-slate-900 text-white rounded-lg px-4 py-3 inline-flex gap-2 items-center justify-center text-sm font-bold'>
          Iniciar pedido guiado <ArrowRight size={16} aria-hidden/></a>
        <a href={commercialContactUrl({kind:'establishment',medium:'mixed',source:'homepage',planId:plan.plan_id},window.location.search)}
          className='mt-auto min-h-11 bg-blue-700 text-white rounded-lg px-4 py-3 inline-flex gap-2 items-center justify-center text-sm font-bold'>
          Solicitar proposta deste plano <ArrowRight size={16} aria-hidden/></a>
      </article>)}
    </div>
   </div>
 </section>
}
