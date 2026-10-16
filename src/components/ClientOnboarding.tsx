import {useEffect,useState} from 'react'
import {Check,ChevronDown,ChevronUp,CircleAlert,RefreshCcw} from 'lucide-react'

type Step={key:string;title:string;done:boolean;view:'services'|'devices'|'media'|'studio'|'publications';guidance?:string}
type Checklist={steps:Step[];evidence:string;devices_registered:number;devices_paired:number;active_playlists:number;active_self_publications:number;recent_player_reports_7d?:number;last_player_reported_at?:string|null;next_action?:Pick<Step,'key'|'title'|'view'|'guidance'>|null}
export default function ClientOnboarding({
  token,onNavigate,refreshKey,
}:{
  token:string;onNavigate:(view:Step['view'])=>void;refreshKey?:string|number
}){
  const [data,setData]=useState<Checklist|null>(null)
  const [error,setError]=useState('')
  const [busy,setBusy]=useState(false)
  const [reload,setReload]=useState(0)
  const [expanded,setExpanded]=useState(true)
  useEffect(()=>{
    const abort=new AbortController()
    setBusy(true);setError('')
    fetch('/api/portal/onboarding',{
      headers:{Accept:'application/json',Authorization:'Bearer '+token},
      credentials:'omit',cache:'no-store',signal:abort.signal,
    }).then(async response=>{
      const payload=await response.json()
      if(!response.ok)throw new Error(payload.message||'Não foi possível consultar os primeiros passos.')
      return payload as {data:Checklist}
    }).then(payload=>{if(!abort.signal.aborted)setData(payload.data)})
      .catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Consulta indisponível.')})
      .finally(()=>{if(!abort.signal.aborted)setBusy(false)})
    return ()=>abort.abort()
  },[token,reload,refreshKey])
  const done=data?.steps.filter(s=>s.done).length??0
  const total=data?.steps.length??8
  const nextAction=data?.next_action
  const reports=data?.recent_player_reports_7d??0
  const rawDate=data?.last_player_reported_at
  const parsedDate=rawDate?new Date(rawDate):null
  const lastReport=parsedDate&&Number.isFinite(parsedDate.getTime())?new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(parsedDate):null
  if(!busy&&!data&&error)return <div className='rounded-xl bg-white border border-black/10 p-4 mb-5 text-sm'>
    <span role='alert'>{error}</span>
    <button type='button' onClick={()=>setReload(n=>n+1)} className='underline text-blue-800 ml-2'>Tentar novamente</button>
  </div>
  return <section className='bg-white border border-black/10 rounded-2xl mb-6 overflow-hidden' aria-label='Primeiros passos'>
    <div className='p-4 sm:p-5 flex flex-wrap justify-between items-center gap-3'>
      <div>
        <p className='text-xs uppercase tracking-wide font-bold text-blue-700'>Ativação da sua TV e Rádio</p>
        <h2 className='text-lg font-bold mt-1'>Primeiros passos</h2>
        <p className='text-xs text-black/60 mt-1'>{busy?'Atualizando…':done+' de '+total+' etapas identificadas pela API'}</p>
      </div>
      <div className='flex gap-2'>
        <button type='button' aria-label='Atualizar etapas' disabled={busy} onClick={()=>setReload(x=>x+1)}
          className='min-w-11 min-h-11 border border-black/10 rounded-xl disabled:opacity-50'>
          <RefreshCcw size={17} className='mx-auto'/>
        </button>
        <button type='button' onClick={()=>setExpanded(x=>!x)} aria-expanded={expanded}
          className='min-h-11 rounded-xl border border-black/10 px-3 text-xs font-semibold flex items-center gap-2'>
          {expanded?<ChevronUp size={16}/>:<ChevronDown size={16}/>}
          {expanded?'Recolher':'Ver etapas'}
        </button>
      </div>
    </div>
    <div className='h-1 bg-gray-100' role='progressbar' aria-valuenow={done} aria-valuemin={0} aria-valuemax={total} aria-label='Etapas de ativação'>
      <div className='h-full bg-blue-700 transition-all' style={{width:(done/total*100)+'%'}}/>
    </div>
    {expanded&&data&&<div className='mx-4 sm:mx-5 rounded-xl border border-blue-200 bg-blue-50 p-4' role='status' aria-live='polite'>
      {nextAction?<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
        <div>
          <strong className='block text-sm'>Próximo passo: {nextAction.title}</strong>
          <p className='text-xs mt-1'>{nextAction.guidance??'Consulte a etapa para continuar.'}</p>
        </div>
        <button type='button' onClick={()=>onNavigate(nextAction.view)}
          className='min-h-11 px-4 rounded-xl bg-blue-800 text-white text-xs font-bold'>Continuar</button>
      </div>:<p className='text-sm font-semibold'>Todas as etapas verificáveis estão atendidas. A operação precisa continuar sendo monitorada.</p>}
    </div>}
    {expanded&&data&&<p className='mx-4 sm:mx-5 mt-3 text-xs text-black/70'>
      <strong>{reports.toLocaleString('pt-BR')} relatos do Player nos últimos 7 dias.</strong>
      {lastReport&&<span> Último relato: {lastReport}.</span>}
      <span className='block mt-1'>Relatos autenticados do dispositivo, não auditoria independente de audiência.</span>
    </p>}
    {expanded&&<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4 sm:p-5'>
      {(data?.steps??[]).map(step=><button type='button' onClick={()=>onNavigate(step.view)}
        key={step.key} className='text-left flex items-center gap-3 rounded-xl p-3 border border-black/10 hover:border-blue-500 min-h-14'>
        <span aria-hidden className={'w-8 h-8 shrink-0 rounded-full flex items-center justify-center '+(step.done?'bg-blue-50 text-blue-800':'bg-gray-100 text-gray-500')}>
          {step.done?<Check size={17}/>:<CircleAlert size={16}/>}
        </span>
        <span className='min-w-0'>
          <strong className='block text-xs'>{step.title}</strong>
          <span className='text-xs text-black/55'>{step.done?'Etapa atendida':step.guidance??'Ver como concluir'}</span>
        </span>
      </button>)}
    </div>}
    {expanded&&<p className='px-4 sm:px-5 pb-4 text-xs text-black/50'>
      A conclusão depende de contratos, permissões e registros reais. Etapas concluídas não comprovam reprodução nos aparelhos.
    </p>}
  </section>
}
