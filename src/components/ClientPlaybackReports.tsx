import {useEffect,useState} from 'react'
import {Download,RefreshCcw} from 'lucide-react'

type Kind='all'|'tv'|'radio'
type Days=1|7|30
type Item={
  event_uuid:string;content_type:'image'|'video'|'audio';
  schedule_id:number;playlist_id:number;playlist_item_id:number;
  manifest_version:number;story_publication_version:number;
  duration_seconds:number;occurred_at:string|null;
  radio_hour_start:string|null;radio_slot_index:number|null;
  evidence:'authenticated_player_report_not_independent_audience'
}
type Daily={date:string;image:number;video:number;audio:number;total:number}
type Response={
  data:Item[];
  summary:{device_id:number;days:number;kind:Kind;total:number;
    by_type:{image:number;video:number;audio:number};
    by_day:Daily[];bucket_timezone:'UTC';evidence:string};
  pagination:{page:number;last_page:number;per_page:number;total:number}
}
const when=(value:string|null)=>value?new Date(value).toLocaleString('pt-BR'):'Sem data'
const label=(type:string)=>type==='audio'?'Spot institucional de Rádio'
  :type==='video'?'Vídeo TV':'Imagem TV'
const csvValue=(value:unknown)=>{
  const raw=String(value??'')
  // Avoid spreadsheet formulas in files later opened in Excel/Sheets.
  const safe=/^[\s]*[=+\-@\t\r]/.test(raw)?"'"+raw:raw
  return '"'+safe.replaceAll('"','""')+'"'
}

export default function ClientPlaybackReports({
  token,deviceId,
}:{token:string;deviceId:number}){
  const [days,setDays]=useState<Days>(7)
  const [kind,setKind]=useState<Kind>('all')
  const [page,setPage]=useState(1)
  const [refresh,setRefresh]=useState(0)
  const [result,setResult]=useState<Response|null>(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  useEffect(()=>{
    const abort=new AbortController()
    const url=new URL('/api/portal/device-reports',window.location.origin)
    url.searchParams.set('device_id',String(deviceId))
    url.searchParams.set('days',String(days))
    url.searchParams.set('kind',kind)
    url.searchParams.set('page',String(page))
    setLoading(true);setError('');setResult(null)
    fetch(url,{method:'GET',headers:{Authorization:'Bearer '+token,Accept:'application/json'},
      credentials:'omit',cache:'no-store',signal:abort.signal,
    }).then(async res=>{
      const payload=await res.json().catch(()=>({}))
      if(!res.ok)throw new Error(payload.message||'Não foi possível consultar os relatos.')
      return payload as Response
    }).then(payload=>{if(!abort.signal.aborted)setResult(payload)})
      .catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Falha ao consultar histórico.')})
      .finally(()=>{if(!abort.signal.aborted)setLoading(false)})
    return ()=>abort.abort()
  },[token,deviceId,days,kind,page,refresh])

  const maxDaily = Math.max(1,...(result?.summary.by_day??[]).map(day=>day.total))

  const exportPage=()=>{
    if(!result?.data?.length)return
    const headers=['UUID','Data','Tipo','Playlist','Item','Manifesto','Duracao segundos','Hora Radio','Slot Radio']
    const lines=result.data.map(x=>[
      x.event_uuid,x.occurred_at,x.content_type,x.playlist_id,x.playlist_item_id,
      x.manifest_version,x.duration_seconds,x.radio_hour_start,x.radio_slot_index,
    ].map(csvValue).join(';'))
    const csv='\uFEFF'+headers.map(csvValue).join(';')+'\r\n'+lines.join('\r\n')
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}))
    try{
      const link=document.createElement('a')
      link.href=url;link.download='meucomercial-player-'+deviceId+'-'+kind+'-'+days+'dias-p'+page+'.csv'
      document.body.appendChild(link);link.click();link.remove()
    }finally{setTimeout(()=>URL.revokeObjectURL(url),1000)}
  }

  return <section className='mt-4 rounded-xl border border-black/10 bg-white p-3 sm:p-4' aria-label='Relatórios de exibição do Player'>
    <div className='flex flex-wrap gap-2 items-center justify-between'>
      <h5 className='text-sm font-bold'>Relatos de exibição — histórico detalhado</h5>
      <button type='button' className='min-h-11 px-3 rounded-lg border border-blue-200 text-xs flex items-center gap-2'
        disabled={loading} onClick={()=>setRefresh(n=>n+1)}>
        <RefreshCcw size={14}/>Atualizar
      </button>
    </div>
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3'>
      <label className='text-xs text-black/70 font-semibold'>Período
        <select className='mt-1 w-full min-h-11 p-2 border border-black/20 rounded-lg bg-white'
          value={days} onChange={e=>{setDays(Number(e.target.value) as Days);setPage(1)}}>
          <option value={1}>Últimas 24 horas</option>
          <option value={7}>Últimos 7 dias</option>
          <option value={30}>Últimos 30 dias</option>
        </select>
      </label>
      <label className='text-xs text-black/70 font-semibold'>Mídia
        <select className='mt-1 w-full min-h-11 p-2 border border-black/20 rounded-lg bg-white'
          value={kind} onChange={e=>{setKind(e.target.value as Kind);setPage(1)}}>
          <option value='all'>TV e Rádio</option>
          <option value='tv'>Somente TV</option>
          <option value='radio'>Somente Rádio</option>
        </select>
      </label>
    </div>
    {loading&&<p role='status' className='mt-3 text-sm'>Consultando relatos...</p>}
    {error&&<p role='alert' className='mt-3 text-sm text-red-700'>{error}</p>}
    {result&&<>
      <p className='text-xs mt-3 text-black/70'>Total no período: <strong>{result.summary.total}</strong>
        {' · '}Imagens: {result.summary.by_type.image}
        {' · '}Vídeos: {result.summary.by_type.video}
        {' · '}Rádio: {result.summary.by_type.audio}
      </p>
      {result.summary.by_day?.length>0&&<section className='mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3'
        aria-label='Tendência diária de relatos do dispositivo'>
        <h6 className='font-semibold text-xs mb-2'>Relatos por dia · UTC</h6>
        <div className='flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-black/70 mb-3'>
          <span><span className='inline-block w-2 h-2 rounded-sm bg-sky-600 mr-1'/>Imagens</span>
          <span><span className='inline-block w-2 h-2 rounded-sm bg-indigo-500 mr-1'/>Vídeos</span>
          <span><span className='inline-block w-2 h-2 rounded-sm bg-emerald-600 mr-1'/>Spots Rádio</span>
        </div>
        <div className='space-y-2 max-h-72 overflow-y-auto pr-1' role='list'>
          {result.summary.by_day.map(day=><div key={day.date} role='listitem'
            aria-label={day.date+': '+day.total+' relatos, '+day.image+' imagens, '+day.video+' vídeos, '+day.audio+' spots de rádio'}
            className='flex gap-2 items-center text-xs'>
            <span className='w-12 shrink-0 tabular-nums text-black/60'>
              {day.date.slice(8,10)}/{day.date.slice(5,7)}
            </span>
            <div className='flex-1 h-3 rounded bg-slate-200 overflow-hidden flex' aria-hidden='true'>
              <span className='bg-sky-600' style={{width:(day.image/maxDaily*100)+'%'}}/>
              <span className='bg-indigo-500' style={{width:(day.video/maxDaily*100)+'%'}}/>
              <span className='bg-emerald-600' style={{width:(day.audio/maxDaily*100)+'%'}}/>
            </div>
            <strong className='w-8 text-right tabular-nums'>{day.total}</strong>
          </div>)}
        </div>
        <p className='mt-3 text-[11px] text-black/60'>
          O gráfico considera todo o período filtrado, não apenas a página atual.
          Datas UTC nas extremidades podem ser parciais. Zero indica ausência de relato recebido,
          não confirma equipamento desligado.
        </p>
      </section>}
      {result.data.length===0?<p className='text-xs mt-3 text-black/60'>Nenhum relato registrado neste período.</p>
        :<div className='mt-3 space-y-2'>
          {result.data.map(e=><div key={e.event_uuid} className='rounded-lg border border-black/10 p-3 text-xs'>
            <div className='font-semibold'>{label(e.content_type)} · {when(e.occurred_at)}</div>
            <p className='text-black/60 mt-1'>Playlist #{e.playlist_id} · item #{e.playlist_item_id} ·
              manifesto v{e.manifest_version} · {e.duration_seconds}s</p>
            {e.content_type==='audio'&&<p className='text-black/60 mt-1'>
              Hora da grade: {when(e.radio_hour_start)} · posição {e.radio_slot_index===null?'—':e.radio_slot_index+1}
            </p>}
          </div>)}
        </div>}
      <div className='flex flex-wrap gap-2 justify-between items-center mt-4'>
        <span className='text-xs text-black/60'>Página {result.pagination.page} de {result.pagination.last_page}</span>
        <div className='flex gap-2'>
          <button type='button' className='min-h-11 px-3 border border-black/20 rounded-lg text-xs'
            disabled={page<=1} onClick={()=>setPage(n=>Math.max(1,n-1))}>Anterior</button>
          <button type='button' className='min-h-11 px-3 border border-black/20 rounded-lg text-xs'
            disabled={page>=result.pagination.last_page}
            onClick={()=>setPage(n=>n+1)}>Próxima</button>
          <button type='button' className='min-h-11 px-3 border border-blue-200 rounded-lg text-xs flex items-center gap-1'
            disabled={!result.data.length} onClick={exportPage}>
            <Download size={14}/>CSV desta página
          </button>
        </div>
      </div>
    </>}
    <p className='text-xs text-black/60 mt-4'>
      Esses registros são autodeclarações autenticadas pelo Player. Não constituem
      certificação independente de reprodução, audiência ou faturamento.
    </p>
  </section>
}
