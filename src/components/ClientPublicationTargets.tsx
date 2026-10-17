import {useEffect,useState} from 'react'
import {RefreshCcw,X} from 'lucide-react'
import {isPublicationDeliveryResponse} from '../lib/publicationDelivery.mjs'

type Delivery='all'|'acknowledged'|'awaiting_ack'|'offline'|'sync_pending'
type Target={device_id:number;name:string;connected_recently:boolean;needs_sync:boolean;
  last_seen_at:string|null;last_sync_at:string|null;requested_manifest_version:number;
  current_manifest_version:number;operational_state:string;playback_confirmed:false;
  sync_acknowledged:boolean;sync_acknowledged_at:string|null;sync_evidence:string}
type Response={data:Target[];summary:{targets:number;sync_pending_flagged:number;
  sync_acknowledged_total:number;awaiting_player_ack:number;recently_connected:number;unavailable:number;
  delivery:Delivery;publication_status:string;playback_confirmed:false};pagination:{page:number;last_page:number;per_page:number;total:number};
  evidence:string}
const when=(value:string|null)=>value
  ?new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(value))
  :'Sem registro'

export default function ClientPublicationTargets({
  token,batchId,onClose,
}:{token:string;batchId:number;onClose:()=>void}){
  const [page,setPage]=useState(1)
  const [delivery,setDelivery]=useState<Delivery>('all')
  const [reload,setReload]=useState(0)
  const [data,setData]=useState<Response|null>(null)
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    const abort=new AbortController()
    const url=new URL('/api/portal/publication-targets',window.location.origin)
    url.searchParams.set('publication_id',String(batchId))
    url.searchParams.set('page',String(page))
    url.searchParams.set('delivery',delivery)
    setLoading(true);setError('');setData(null)
    fetch(url,{
      headers:{Accept:'application/json',Authorization:'Bearer '+token},
      credentials:'omit',cache:'no-store',signal:abort.signal,
    }).then(async response=>{
      const payload=await response.json().catch(()=>({}))
      if(!response.ok)throw new Error(payload.message||'Falha ao consultar destinos.')
      if(!isPublicationDeliveryResponse(payload,delivery))
        throw new Error('Resposta de distribuição incompatível. Atualize e tente novamente.')
      return payload as Response
    }).then(result=>{if(!abort.signal.aborted)setData(result)})
      .catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Falha de consulta.')})
      .finally(()=>{if(!abort.signal.aborted)setLoading(false)})
    return ()=>abort.abort()
  },[token,batchId,page,delivery,reload])
  return <div className='mt-5 border border-blue-100 rounded-2xl bg-white overflow-hidden' aria-label='Situação dos Players'>
    <div className='p-4 flex flex-wrap justify-between items-center gap-2 border-b border-black/10'>
      <div>
        <h3 className='font-bold text-base'>Situação dos Players</h3>
        <p className='text-xs text-black/60 mt-1'>Publicação #{batchId} · Monitoramento operacional, não audiência.</p>
      </div>
      <div className='flex gap-2'>
        <button type='button' disabled={loading} onClick={()=>setReload(v=>v+1)}
          className='px-3 min-h-11 rounded-xl border text-xs flex items-center gap-2'>
          <RefreshCcw size={15}/>Atualizar
        </button>
        <button type='button' onClick={onClose} aria-label='Fechar situação dos Players'
          className='min-w-11 min-h-11 rounded-xl border'><X size={17} className='mx-auto'/></button>
      </div>
    </div>
    <div className='p-4 grid grid-cols-1 sm:grid-cols-2 gap-2'>
      <label htmlFor='delivery-status' className='text-xs font-semibold'>Situação da distribuição
        <select id='delivery-status' value={delivery} onChange={event=>{setDelivery(event.target.value as Delivery);setPage(1)}}
          className='mt-1 w-full min-h-11 rounded-xl border border-black/20 bg-white px-3 text-sm'>
          <option value='all'>Todos os destinos</option><option value='acknowledged'>Manifesto confirmado</option>
          <option value='awaiting_ack'>Aguardando confirmação</option><option value='offline'>Sem conexão recente</option>
          <option value='sync_pending'>Sincronização pendente</option>
        </select>
      </label>
      <p className='text-xs text-black/60 self-end'>Os filtros são processados no servidor, com totais de toda a publicação.</p>
    </div>
    {loading&&<p role='status' className='text-sm p-4'>Consultando estados registrados…</p>}
    {error&&<p role='alert' className='text-red-800 p-4 text-sm'>{error}</p>}
    {data&&<>
      <div className='grid grid-cols-2 lg:grid-cols-5 gap-2 p-3 border-b border-black/10'>
        {([
          ['Total de destinos',data.summary.targets],
          ['Confirmaram manifesto',data.summary.sync_acknowledged_total],
          ['Aguardando ACK',data.summary.awaiting_player_ack],
          ['Conectados recentemente',data.summary.recently_connected],
          ['Sync pendente',data.summary.sync_pending_flagged],
        ] as const).map(([label,value])=><div key={label} className='rounded-xl bg-blue-50 p-3'>
          <span className='text-[11px] text-blue-900 block'>{label}</span>
          <strong className='text-xl tabular-nums text-blue-950'>{value.toLocaleString('pt-BR')}</strong>
        </div>)}
      </div>
      <p className='px-4 pt-3 text-xs text-black/60'>Informações de {data.summary.targets} destinos próprios;
        {data.summary.unavailable} desativado(s)/bloqueado(s). ACK v2 confirma somente a sincronização reportada
        pelo Player, não certifica exibição nem audiência. Categorias operacionais podem se sobrepor.</p>
      <p className='px-4 pt-2 text-xs text-black/70'>
        {data.pagination.total} destino(s) encontrado(s) com o filtro selecionado.
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 p-3'>
        {data.data.map(item=><article key={item.device_id} className='rounded-xl border border-black/10 p-4'>
          <h4 className='font-bold text-sm break-words'>{item.name}</h4>
          <p className='text-xs mt-2'>{item.operational_state==='sync_pending'
            ?'Sincronização pendente':item.operational_state==='device_unavailable'
              ?'Dispositivo indisponível':'Sem pendência de sincronização sinalizada'}</p>
          <p className='text-xs text-black/60 mt-1'>{item.connected_recently?'Conectado recentemente':'Sem conexão recente'}</p>
          <p className={'mt-2 text-xs font-semibold '+(item.sync_acknowledged?'text-blue-800':'text-black/60')}>
            {item.sync_acknowledged
              ? 'Manifesto confirmado pelo Player (protocolo v2)'
              : 'Sem confirmação v2 desta versão de manifesto'}
          </p>
          {item.sync_acknowledged_at&&<p className='text-xs text-black/60 mt-1'>
            ACK registrado: {when(item.sync_acknowledged_at)}
          </p>}
          <p className='text-xs text-black/60 mt-1'>Última comunicação: {when(item.last_seen_at)}</p>
          <p className='text-xs text-black/60 mt-1'>Última sincronização: {when(item.last_sync_at)}</p>
          <p className='text-xs text-black/60 mt-1'>Manifesto solicitado: v{item.requested_manifest_version}</p>
        </article>)}
        {data.data.length===0&&<p className='text-xs text-black/60 p-4' role='status'>Nenhum destino corresponde ao filtro selecionado.</p>}
      </div>
      <div className='px-4 pb-4 flex gap-2 items-center text-xs'>
        <button type='button' className='px-3 min-h-11 rounded-xl border disabled:opacity-40'
          disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Anterior</button>
        <span>{page} / {Math.max(1,data.pagination.last_page)}</span>
        <button type='button' className='px-3 min-h-11 rounded-xl border disabled:opacity-40'
          disabled={page>=data.pagination.last_page} onClick={()=>setPage(p=>p+1)}>Próxima</button>
      </div>
    </>}
  </div>
}
