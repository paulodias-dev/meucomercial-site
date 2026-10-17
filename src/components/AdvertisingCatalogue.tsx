import {useMemo,useState} from 'react'
import {ArrowRight, MapPin, Radio, Tv, ShieldCheck} from 'lucide-react'
import {commercialContactUrl} from '../lib/commercialIntent.mjs'

export type AdFormat={id:'tv'|'radio'|'mixed';label:string;description:string;requirements:string}
export const adFormats:AdFormat[]=[
 {id:'tv',label:'Anúncio em TV Indoor',description:'Criativos visuais aprovados exibidos em pontos autorizados, conforme a programação contratada.',requirements:'Vídeo ou imagem com direitos de uso, período, local e autorização do ponto.'},
 {id:'radio',label:'Spot em Rádio Indoor',description:'Mensagens sonoras e jingles aprovados intercalados conforme grade, licença e capacidade contratada.',requirements:'Áudio autorizado, duração, licenças, disponibilidade e metas de inserções.'},
 {id:'mixed',label:'Campanha TV + Rádio',description:'Planejamento de formatos complementares mediante validação comercial de cada meio.',requirements:'Propostas e direitos de cada formato são avaliados separadamente.'},
]
export default function AdvertisingCatalogue(){
 const [format,setFormat]=useState<'tv'|'radio'|'mixed'>('tv')
 const [city,setCity]=useState('')
 const [error,setError]=useState('')
 const selected=useMemo(()=>adFormats.find(x=>x.id===format)??adFormats[0],[format])
 const contact=()=>{
   const cleaned=city.trim()
   if(cleaned&&!/^[\p{L}\s.'-]{2,60}$/u.test(cleaned)){
     setError('Informe apenas o nome de uma cidade, sem telefones, URLs ou dados pessoais.')
     return
   }
   const href=commercialContactUrl({kind:'advertiser',medium:format,source:'media-catalog',city:cleaned},window.location.search)
   window.location.assign(href)
 }
 return <section aria-labelledby='ad-formats-title' className='py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
   <p className='font-bold tracking-widest text-blue-700 text-xs uppercase'>Formatos de publicidade</p>
   <h2 id='ad-formats-title' className='font-display text-3xl sm:text-4xl font-bold mt-2'>Planeje sua campanha sem compromissos automáticos</h2>
   <p className='text-slate-600 text-sm leading-7 max-w-3xl mt-4'>Explore formatos disponíveis para solicitação de proposta. Esta página não é um inventário ao vivo: nenhuma cidade, aparelho, audiência, valor ou vaga está garantida até análise de disponibilidade e autorização.</p>
   <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8' role='group' aria-label='Escolher formato da campanha'>
     {adFormats.map(item=><button key={item.id} type='button' aria-pressed={format===item.id}
       onClick={()=>{setFormat(item.id);setError('')}}
       className={'text-left rounded-2xl p-5 border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 '+(format===item.id?'bg-blue-50 border-blue-700':'bg-white border-slate-200 hover:border-blue-400')}>
       <div className='flex gap-2 items-center text-blue-700'>{item.id==='radio'?<Radio size={21} aria-hidden/>:<Tv size={21} aria-hidden/>}<strong className='text-base'>{item.label}</strong></div>
       <p className='text-sm text-slate-600 mt-3 leading-6'>{item.description}</p>
     </button>)}
   </div>
   <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 mt-8'>
     <div className='lg:col-span-7 rounded-2xl bg-slate-900 text-white p-6 sm:p-8'>
       <strong className='text-lg block'>{selected.label}</strong>
       <p className='text-sm leading-6 text-slate-200 mt-2'>{selected.requirements}</p>
       <div className='mt-6 flex gap-3 items-start text-xs text-slate-200'><ShieldCheck size={20} className='shrink-0 text-blue-200' aria-hidden/>
         <span>A autorização do estabelecimento, as licenças, o contrato e as regras de frequência são verificados antes de qualquer veiculação. O relato do Player não equivale à medição independente de audiência.</span></div>
     </div>
     <div className='lg:col-span-5 rounded-2xl bg-white border border-black/10 p-6'>
       <label htmlFor='ad-city' className='text-sm font-bold flex gap-2 items-center'><MapPin size={18} aria-hidden/> Cidade de interesse (opcional)</label>
       <input id='ad-city' type='text' autoComplete='address-level2' maxLength={60} value={city}
         onChange={e=>{setCity(e.target.value);setError('')}}
         placeholder='Ex.: Aracaju'
         className='mt-2 w-full rounded-xl border border-slate-300 p-3 min-h-11 text-sm' />
       <p className='text-xs text-slate-600 leading-5 mt-2'>Informar a cidade não afirma que haja telas, rádios ou espaços disponíveis no local.</p>
       {error&&<p role='alert' className='text-xs text-red-800 mt-2'>{error}</p>}
       <button type='button' onClick={contact} className='w-full mt-5 min-h-12 px-4 rounded-xl bg-blue-700 text-white text-sm font-bold inline-flex justify-center items-center gap-2 hover:bg-blue-800'>
         Preparar pedido de proposta <ArrowRight size={17} aria-hidden/>
       </button>
       <p className='mt-3 text-xs text-slate-600'>O formulário seguinte exige consentimento e confirmação real de recebimento; não contrata, não cobra e não reserva espaços.</p>
     </div>
   </div>
 </section>
}
