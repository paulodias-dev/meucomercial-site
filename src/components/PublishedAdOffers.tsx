import {useEffect,useState} from 'react'
import {ArrowRight, RefreshCcw} from 'lucide-react'
import {commercialContactUrl} from '../lib/commercialIntent.mjs'
import {verifyIndoorCatalog} from '../lib/indoorCatalog.mjs'
type Offer={offer_id:number;title:string;region:string;description:string;medium:'tv'|'radio';availability:'consultation_required'}
export default function PublishedAdOffers({medium}:{medium:'tv'|'radio'|'mixed'}){
 const [items,setItems]=useState<Offer[]>([])
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const [reload,setReload]=useState(0)
 useEffect(()=>{
  const abort=new AbortController()
  setLoading(true);setError('')
  const url='/api/indoor-catalog'+(medium==='mixed'?'':'?medium='+medium)
  fetch(url,{signal:abort.signal,headers:{Accept:'application/json'},credentials:'omit',cache:'no-store'})
   .then(async response=>{if(!response.ok)throw Error('Catálogo indisponível');return response.json()})
   .then(json=>{if(!verifyIndoorCatalog(json))throw Error('Contrato de catálogo inválido');if(!abort.signal.aborted)setItems(json.data)})
   .catch(()=>{if(!abort.signal.aborted){setItems([]);setError('Consulta de oportunidades não disponível no momento.')}})
   .finally(()=>{if(!abort.signal.aborted)setLoading(false)})
  return ()=>abort.abort()
 },[medium,reload])
 return <section className='mt-10 rounded-2xl border border-blue-100 bg-blue-50/40 p-5 sm:p-7' aria-label='Oportunidades curadas'>
   <div className='flex flex-wrap justify-between items-center gap-3'>
    <div><h3 className='text-lg font-bold'>Oportunidades autorizadas para consulta</h3>
    <p className='text-xs text-slate-600 mt-1'>Apenas ofertas revisadas vinculadas a inventário ativo. A reserva, a capacidade e o preço devem ser confirmados por proposta.</p></div>
    <button type='button' className='min-h-11 px-4 border rounded-lg bg-white text-sm flex items-center gap-2'
      onClick={()=>setReload(x=>x+1)}><RefreshCcw size={16} aria-hidden/> Atualizar</button>
   </div>
   {loading&&<p className='text-sm mt-4' role='status'>Consultando oportunidades…</p>}
   {error&&<p className='text-sm text-amber-900 mt-4' role='alert'>{error}</p>}
   {!loading&&!error&&!items.length&&<p className='text-sm mt-4'>Nenhuma oportunidade foi aprovada para divulgação neste formato. Você ainda pode solicitar uma análise comercial sem compromisso.</p>}
   <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5'>
    {items.map(x=><article key={x.offer_id} className='rounded-xl bg-white border border-black/10 p-5 flex flex-col gap-3'>
      <strong className='text-base'>{x.title}</strong>
      <span className='text-xs text-slate-700'>{x.region} · {x.medium==='tv'?'TV Indoor':'Rádio Indoor'}</span>
      <p className='text-sm leading-6 text-slate-600'>{x.description}</p>
      <p className='text-xs text-amber-900'>Disponibilidade, veiculação e preço sujeitos à confirmação.</p>
      <a href={commercialContactUrl({kind:'advertiser',medium:x.medium,source:'media-catalog'},window.location.search)}
         className='mt-auto min-h-11 bg-blue-700 text-white rounded-lg px-4 py-3 text-sm font-semibold inline-flex justify-center items-center gap-2'>Solicitar análise <ArrowRight size={16} aria-hidden/></a>
    </article>)}
   </div>
 </section>
}
