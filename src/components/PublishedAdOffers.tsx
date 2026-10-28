import {useEffect,useState} from 'react'
import {ArrowRight, RefreshCcw} from 'lucide-react'
import {commercialContactUrl} from '../lib/commercialIntent.mjs'
import {acquisitionUrl} from '../lib/acquisitionRequest.mjs'
import {verifyIndoorCatalog} from '../lib/indoorCatalog.mjs'
type Offer={offer_id:number;title:string;region:string;description:string;medium:'tv'|'radio';availability:'consultation_required'}
export default function PublishedAdOffers({medium}:{medium:'tv'|'radio'|'mixed'}){
 const [items,setItems]=useState<Offer[]>([])
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const [reload,setReload]=useState(0)
 const [region,setRegion]=useState('')
 const [regionInput,setRegionInput]=useState('')
 const [page,setPage]=useState(1)
 const [pagination,setPagination]=useState({page:1,per_page:12,total:0,last_page:1})
 const [filterError,setFilterError]=useState('')
 useEffect(()=>{
  const abort=new AbortController()
  setLoading(true);setError('')
  const params=new URLSearchParams({per_page:'12',page:String(page)})
  if(medium!=='mixed')params.set('medium',medium)
  if(region)params.set('region',region)
  const url='/api/indoor-catalog?'+params.toString()
  fetch(url,{signal:abort.signal,headers:{Accept:'application/json'},credentials:'omit',cache:'no-store'})
   .then(async response=>{if(!response.ok)throw Error('Catálogo indisponível');return response.json()})
   .then(json=>{if(!verifyIndoorCatalog(json))throw Error('Contrato de catálogo inválido');if(!abort.signal.aborted){setItems(json.data);setPagination(json.pagination)}})
   .catch(()=>{if(!abort.signal.aborted){setItems([]);setError('Consulta de oportunidades não disponível no momento.')}})
   .finally(()=>{if(!abort.signal.aborted)setLoading(false)})
  return ()=>abort.abort()
 },[medium,reload,region,page])
 const search=()=>{
  const requested=regionInput.trim()
  if(requested&&!/^[\p{L}\p{N}\s.'-]{2,80}$/u.test(requested)){
    setFilterError('Digite uma região válida, sem links ou informações pessoais.');return
  }
  setFilterError('');setPage(1);setRegion(requested)
 }
 useEffect(()=>{setPage(1)},[medium])
 return <section className='mt-10 rounded-2xl border border-blue-100 bg-blue-50/40 p-5 sm:p-7' aria-label='Oportunidades curadas'>
   <div className='flex flex-wrap justify-between items-center gap-3'>
    <div><h3 className='text-lg font-bold'>Oportunidades autorizadas para consulta</h3>
    <p className='text-xs text-slate-600 mt-1'>Apenas ofertas revisadas vinculadas a inventário ativo. A reserva, a capacidade e o preço devem ser confirmados por proposta.</p></div>
    <button type='button' className='min-h-11 px-4 border rounded-lg bg-white text-sm flex items-center gap-2'
      onClick={()=>setReload(x=>x+1)}><RefreshCcw size={16} aria-hidden/> Atualizar</button>
   </div>
   <div className='flex flex-wrap gap-2 mt-5 items-end'>
     <div className='flex-1 min-w-[180px]'><label htmlFor='offers-region' className='block text-xs font-semibold mb-1'>Pesquisar região publicada</label>
       <input id='offers-region' type='search' value={regionInput} maxLength={80}
         onChange={event=>{setRegionInput(event.target.value);setFilterError('')}}
         onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();search()}}}
         placeholder='Cidade ou região'
         className='w-full bg-white border border-slate-300 rounded-xl px-3 min-h-11 text-sm'/></div>
     <button type='button' onClick={search} className='px-4 min-h-11 rounded-xl bg-blue-700 text-white text-sm'>Pesquisar</button>
     {region&&<button type='button' onClick={()=>{setRegion('');setRegionInput('');setPage(1)}}
       className='px-4 min-h-11 rounded-xl border bg-white text-sm'>Limpar filtro</button>}
   </div>
   {filterError&&<p role='alert' className='text-red-800 text-xs mt-2'>{filterError}</p>}
   {loading&&<p className='text-sm mt-4' role='status'>Consultando oportunidades…</p>}
   {error&&<p className='text-sm text-amber-900 mt-4' role='alert'>{error}</p>}
   {!loading&&!error&&!items.length&&<p className='text-sm mt-4'>Nenhuma oportunidade foi aprovada para divulgação neste formato. Você ainda pode solicitar uma análise comercial sem compromisso.</p>}
   <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5'>
    {items.map(x=><article key={x.offer_id} className='rounded-xl bg-white border border-black/10 p-5 flex flex-col gap-3'>
      <strong className='text-base'>{x.title}</strong>
      <span className='text-xs text-slate-700'>{x.region} · {x.medium==='tv'?'TV Indoor':'Rádio Indoor'}</span>
      <p className='text-sm leading-6 text-slate-600'>{x.description}</p>
      <p className='text-xs text-amber-900'>Disponibilidade, veiculação e preço sujeitos à confirmação.</p>
      <a href={acquisitionUrl({kind:'advertiser',offerId:x.offer_id},window.location.search)}
         className='mt-auto min-h-11 bg-slate-900 text-white rounded-lg px-4 py-3 text-sm font-semibold inline-flex justify-center items-center gap-2'>Preparar proposta guiada <ArrowRight size={16} aria-hidden/></a>
      <a href={commercialContactUrl({kind:'advertiser',medium:x.medium,source:'media-catalog',offerId:x.offer_id},window.location.search)}
         className='mt-auto min-h-11 bg-blue-700 text-white rounded-lg px-4 py-3 text-sm font-semibold inline-flex justify-center items-center gap-2'>Solicitar análise <ArrowRight size={16} aria-hidden/></a>
    </article>)}
   </div>
   {!loading&&!error&&pagination.total>0&&<nav aria-label='Paginação das ofertas' className='mt-5 flex flex-wrap gap-3 items-center justify-end'>
      <small className='text-slate-600'>{pagination.total} oferta(s) revisada(s) · Página {pagination.page} de {pagination.last_page}</small>
      <button type='button' disabled={page<=1} onClick={()=>setPage(v=>Math.max(1,v-1))}
        className='min-h-11 px-4 rounded-lg bg-white border disabled:opacity-50 text-sm'>Anterior</button>
      <button type='button' disabled={page>=pagination.last_page} onClick={()=>setPage(v=>v+1)}
        className='min-h-11 px-4 rounded-lg bg-white border disabled:opacity-50 text-sm'>Próxima</button>
   </nav>}
 </section>
}
