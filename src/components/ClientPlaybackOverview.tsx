import {useEffect, useState} from 'react'
import {Download,RefreshCcw} from 'lucide-react'
import ClientDeviceDiagnostics from './ClientDeviceDiagnostics'
import {buildPlaybackOverviewCsv,isPlaybackOverviewResponse} from '../lib/playbackOverview.mjs'

// Read-only operational evidence from the authenticated establishment.
// Player-reported completion is not independent audience or billing proof.
type Day = 1|7|30
type Kind = 'all'|'tv'|'radio'
type Attention = 'all'|'blocked'|'unpaired'|'offline'|'sync_pending'|'no_reports'
type Row = {
  device_id:number;name:string;device_type:string;reports_total:number
  last_reported_at:string|null;last_seen_at:string|null
  operational_status:'blocked'|'unpaired'|'offline'|'sync_pending'|'online'
  by_type:{image:number;video:number;audio:number}
}
type Response = {
  data:Row[]
  summary:{
    days:Day;kind:Kind;attention:Attention;bucket_timezone:'UTC';devices_total:number
    attention_counts:{blocked:number;unpaired:number;offline:number;sync_pending:number;no_reports:number}
    devices_with_reports:number;reports_total:number
    by_type:{image:number;video:number;audio:number}
    by_day:Array<{date:string;total:number}>
    evidence:'authenticated_player_report_not_independent_audience'
  }
  pagination:{page:number;last_page:number;per_page:number;total:number}
}

const readableDate=(value:string|null)=>{
  if(!value)return 'Sem relato no período'
  const date=new Date(value)
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(date)
    : 'Data indisponível'
}

export default function ClientPlaybackOverview({token}:{token:string}){
  const [days,setDays]=useState<Day>(7)
  const [kind,setKind]=useState<Kind>('all')
  const [attention,setAttention]=useState<Attention>('all')
  const [page,setPage]=useState(1)
  const [refresh,setRefresh]=useState(0)
  const [recoveryNotice,setRecoveryNotice]=useState('')
  const [selectedDeviceId,setSelectedDeviceId]=useState<number|null>(null)
  const [data,setData]=useState<Response|null>(null)
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const controller=new AbortController()
    setLoading(true);setError('');setData(null)
    const url=new URL('/api/portal/playback-overview',window.location.origin)
    url.searchParams.set('days',String(days))
    url.searchParams.set('kind',kind)
    url.searchParams.set('attention',attention)
    url.searchParams.set('page',String(page))
    fetch(url,{method:'GET',headers:{Authorization:'Bearer '+token,Accept:'application/json'},
      credentials:'omit',cache:'no-store',signal:controller.signal})
      .then(async res=>{
        const payload=await res.json().catch(()=>({message:'Resposta inválida.'}))
        if(!res.ok)throw new Error(res.status===401||res.status===403
          ? 'Sua sessão não está autorizada para consultar estes relatórios.'
          : payload.message||'Não foi possível carregar os relatos.')
        if(!isPlaybackOverviewResponse(payload))throw new Error('Resposta de relatório incompatível. Atualize ou tente novamente.')
        return payload as Response
      })
      .then(result=>{if(!controller.signal.aborted)setData(result)})
      .catch(reason=>{if(!controller.signal.aborted)setError(reason instanceof Error?reason.message:'Consulta indisponível.')})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false)})
    return ()=>controller.abort()
  },[token,days,kind,attention,page,refresh])

  const summary=data?.summary
  const maxDaily=Math.max(1,...(summary?.by_day.map(day=>day.total)??[0]))
  const summaryCards=[
    ['Players cadastrados',summary?.devices_total??0],
    ['Com relatos no período',summary?.devices_with_reports??0],
    ['Relatos de reprodução',summary?.reports_total??0],
    ['Imagens / Vídeos / Áudios',summary
      ? summary.by_type.image+' / '+summary.by_type.video+' / '+summary.by_type.audio : '—'],
  ] as const

  const exportPage=()=>{
    if(!data?.data.length)return
    const csv=buildPlaybackOverviewCsv(data.data)
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}))
    try{
      const link=document.createElement('a')
      link.href=url
      link.download='meucomercial-resumo-players-'+kind+'-'+attention+'-'+days+'dias-p'+page+'.csv'
      document.body.appendChild(link)
      link.click()
      link.remove()
    }finally{window.setTimeout(()=>URL.revokeObjectURL(url),1000)}
  }

  return <section className='bg-white border border-black/10 rounded-2xl p-4 sm:p-6 mb-6'
    aria-label='Relatos de reprodução do estabelecimento'>
    <div className='flex flex-wrap justify-between items-start gap-3 mb-4'>
      <div><h2 className='font-bold text-lg'>Relatos de TV e Rádio</h2>
        <p className='text-xs text-black/60 mt-1'>Visão consolidada dos seus Players, sem misturar relatórios de publicidade.</p>
      </div>
      <button type='button' onClick={()=>setRefresh(n=>n+1)} disabled={loading}
        className='min-h-11 flex gap-2 items-center rounded-xl border border-black/10 px-4 text-xs font-bold disabled:opacity-50'>
        <RefreshCcw size={15} aria-hidden/>Atualizar
      </button>
    </div>
    {recoveryNotice&&<p role='status' className='text-xs bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-blue-900'>{recoveryNotice}</p>}
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5'>
      <label className='block text-xs font-semibold' htmlFor='playback-days'>Período
        <select id='playback-days' value={days} onChange={event=>{setDays(Number(event.target.value) as Day);setPage(1);setSelectedDeviceId(null)}}
          className='mt-1 w-full min-h-11 border border-black/20 rounded-xl px-3 bg-white text-sm'>
          <option value={1}>Últimas 24 horas</option><option value={7}>Últimos 7 dias</option><option value={30}>Últimos 30 dias</option>
        </select>
      </label>
      <label className='block text-xs font-semibold' htmlFor='playback-kind'>Conteúdo
        <select id='playback-kind' value={kind} onChange={event=>{setKind(event.target.value as Kind);setPage(1);setSelectedDeviceId(null)}}
          className='mt-1 w-full min-h-11 border border-black/20 rounded-xl px-3 bg-white text-sm'>
          <option value='all'>TV e Rádio</option><option value='tv'>TV (imagens e vídeos)</option><option value='radio'>Rádio (spots próprios)</option>
        </select>
      </label>
      <label className='block text-xs font-semibold' htmlFor='playback-attention'>Situação operacional
        <select id='playback-attention' value={attention}
          onChange={event=>{setAttention(event.target.value as Attention);setPage(1);setSelectedDeviceId(null)}}
          className='mt-1 w-full min-h-11 border border-black/20 rounded-xl px-3 bg-white text-sm'>
          <option value='all'>Todos os Players</option>
          <option value='blocked'>Bloqueados</option>
          <option value='unpaired'>Aguardando pareamento</option>
          <option value='offline'>Sem conexão recente</option>
          <option value='sync_pending'>Sincronização pendente</option>
          <option value='no_reports'>Sem relatos neste filtro</option>
        </select>
      </label>
    </div>
    {loading&&<p role='status' className='text-sm text-blue-800 py-3'>Consultando dados operacionais…</p>}
    {error&&<div className='text-sm bg-red-50 text-red-800 rounded-xl p-4 mb-4' role='alert'>{error}
      <button type='button' className='underline ml-2' onClick={()=>setRefresh(n=>n+1)}>Tentar novamente</button>
    </div>}
    {data&&summary&&<>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 mb-5'>
        {summaryCards.map(([label,value])=><div key={label} className='rounded-xl bg-gray-50 p-3 border border-black/5'>
          <span className='block text-xs text-black/65'>{label}</span>
          <strong className='block text-lg sm:text-xl mt-2'>{typeof value==='number'?value.toLocaleString('pt-BR'):value}</strong>
        </div>)}
      </div>
      <div className='mb-5'>
        <h3 className='font-semibold text-sm mb-2'>Prioridades operacionais na rede</h3>
        <div className='grid grid-cols-2 lg:grid-cols-5 gap-2'>
          {([
            ['blocked','Bloqueados'],['unpaired','Sem pareamento'],['offline','Offline'],
            ['sync_pending','Aguardando sync'],['no_reports','Sem relatos'],
          ] as const).map(([key,label])=><button key={key} type='button'
            onClick={()=>{setAttention(key);setPage(1);setSelectedDeviceId(null)}}
            aria-pressed={attention===key}
            className={'text-left rounded-xl border p-3 min-h-16 '+(attention===key
              ?'border-blue-700 bg-blue-50':'border-black/10 bg-slate-50')}>
              <span className='block text-[11px] text-black/65'>{label}</span>
              <strong className='text-xl tabular-nums'>{summary.attention_counts[key].toLocaleString('pt-BR')}</strong>
            </button>)}
        </div>
        <p className='text-xs text-black/60 mt-2'>Indicadores de toda a rede autorizada, não apenas desta página. Um Player sem relato não está necessariamente desligado.</p>
      </div>
      <div className='mb-5'>
        <h3 className='font-semibold text-sm mb-2'>Evolução diária (UTC)</h3>
        <div className='overflow-x-auto pb-2'>
          <div className='flex items-end gap-1.5 min-w-max h-28' role='img'
            aria-label='Relatos declarados pelos Players, por dia em UTC'>
            {summary.by_day.map(day=><div key={day.date} className='w-9 flex flex-col items-center justify-end h-full'>
              <span className='text-xs text-black/70'>{day.total}</span>
              <div className='bg-blue-600 rounded-t w-6 min-h-0' style={{height:(day.total/maxDaily*68)+'px'}}/>
              <time dateTime={day.date} className='text-[10px] mt-1 text-black/60'>{day.date.slice(5)}</time>
            </div>)}
          </div>
        </div>
        {summary.reports_total===0&&<p className='text-xs text-black/60 mt-2'>Nenhum relato no período. Isso não significa necessariamente que o aparelho esteve desligado.</p>}
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-[780px] w-full text-left text-xs'>
          <caption className='sr-only'>Players do próprio estabelecimento e quantidades de relatos no período</caption>
          <thead><tr className='border-b border-black/10'>
            <th scope='col' className='p-2'>Dispositivo</th><th scope='col' className='p-2'>Situação</th><th scope='col' className='p-2'>Relatos</th>
            <th scope='col' className='p-2'>Imagem / Vídeo / Áudio</th><th scope='col' className='p-2'>Último relato</th><th scope='col' className='p-2'>Ações</th>
          </tr></thead>
          <tbody>{data.data.map(device=><tr key={device.device_id} className='border-b border-black/5'>
            <td className='p-2 font-semibold'>{device.name}</td>
            <td className='p-2'><span className='block font-semibold'>{({blocked:'Bloqueado',unpaired:'Sem parear',offline:'Offline',sync_pending:'Sincronização pendente',online:'Conectado'} as const)[device.operational_status]}</span>
              <span className='text-[11px] text-black/50'>Último contato: {readableDate(device.last_seen_at)}</span>
            </td>
            <td className='p-2'>{device.reports_total.toLocaleString('pt-BR')}</td>
            <td className='p-2'>{device.by_type.image} / {device.by_type.video} / {device.by_type.audio}</td>
            <td className='p-2'>{readableDate(device.last_reported_at)}</td>
            <td className='p-2'><button type='button' className='min-h-11 px-3 border border-blue-200 rounded-lg text-blue-800 font-semibold'
              aria-expanded={selectedDeviceId===device.device_id} aria-controls='playback-selected-diagnostics'
              onClick={()=>setSelectedDeviceId(current=>current===device.device_id?null:device.device_id)}>
              {selectedDeviceId===device.device_id?'Fechar diagnóstico':'Ver diagnóstico'}
            </button></td>
          </tr>)}</tbody>
        </table>
      </div>
      {selectedDeviceId!==null&&data.data.some(device=>device.device_id===selectedDeviceId)&&<div id='playback-selected-diagnostics' className='mt-4'>
        <ClientDeviceDiagnostics key={selectedDeviceId} token={token} deviceId={selectedDeviceId}
          onUpdated={()=>{setRecoveryNotice('Comando solicitado ao servidor. Aguarde a confirmação do Player no diagnóstico.');setRefresh(n=>n+1)}}/>
      </div>}
      {data.data.length===0&&<p className='text-xs text-black/60 py-4'>Nenhum Player encontrado para a situação selecionada.</p>}
      <div className='flex justify-between items-center gap-3 mt-4 text-xs'>
        <span>Página {data.pagination.page} de {data.pagination.last_page} · {data.pagination.total} Players</span>
        <div className='flex flex-wrap gap-2 justify-end'>
          <button type='button' disabled={loading||!data.data.length} onClick={exportPage}
            className='min-h-11 px-3 border border-blue-200 rounded-lg flex items-center gap-1 disabled:opacity-40'>
            <Download size={14} aria-hidden/>CSV desta página
          </button>
          <button type='button' disabled={page<=1||loading} onClick={()=>{setSelectedDeviceId(null);setPage(n=>Math.max(1,n-1))}}
            className='min-h-11 px-3 border rounded-lg disabled:opacity-40'>Anterior</button>
          <button type='button' disabled={page>=data.pagination.last_page||loading}
            onClick={()=>{setSelectedDeviceId(null);setPage(n=>n+1)}} className='min-h-11 px-3 border rounded-lg disabled:opacity-40'>Próxima</button>
        </div>
      </div>
      <p className='text-xs text-black/60 mt-3'>O CSV é gerado localmente, com somente os Players desta página, sem credenciais ou exportação de outras páginas.</p>
      <p className='text-xs text-black/60 mt-4'>Estes são relatos autenticados do próprio Player e não comprovam audiência independente, disponibilidade contínua ou faturamento de anúncios.</p>
    </>}
  </section>
}
