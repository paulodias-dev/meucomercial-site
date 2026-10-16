import {useEffect,useState} from 'react'
import {RefreshCcw,X} from 'lucide-react'

type Target={device_id:number;name:string;connected_recently:boolean;needs_sync:boolean;
  last_seen_at:string|null;last_sync_at:string|null;requested_manifest_version:number;
  current_manifest_version:number;operational_state:string;playback_confirmed:false;
  sync_acknowledged:boolean;sync_acknowledged_at:string|null;sync_evidence:string}
type Response={data:Target[];summary:{targets:number;sync_pending_flagged:number;
  publication_status:string;playback_confirmed:false};pagination:{page:number;last_page:number;total:number};
  evidence:string}
const when=(value:string|null)=>value
  ?new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(value))
  :'Sem registro'

export default function ClientPublicationTargets({
  token,batchId,onClose,
}:{token:string;batchId:number;onClose:()=>void}){
  const [page,setPage]=useState(1)
  const [reload,setReload]=useState(0)
  const [data,setData]=useState<Response|null>(null)
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    const abort=new AbortController()
    const url=new URL('/api/portal/publication-targets',window.location.origin)
    url.searchParams.set('publication_id',String(batchId))
    url.searchParams.set('page',String(page))
    setLoading(true);setError('');setData(null)
    fetch(url,{
      headers:{Accept:'application/json',Authorization:'Bearer '+token},
      credentials:'omit',cache:'no-store',signal:abort.signal,
    }).then(async response=>{
      const payload=await response.json().catch(()=>({}))
      if(!response.ok)throw new Error(payload.message||'Falha ao consultar destinos.')
      return payload as Response
    }).then(result=>{if(!abort.signal.aborted)setData(result)})
      .catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Falha de consulta.')})
      .finally(()=>{if(!abort.signal.aborted)setLoading(false)})
    return ()=>abort.abort()
  },[token,batchId,page,reload])
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
    {loading&&<p role='status' className='text-sm p-4'>Consultando estados registrados…</p>}
    {error&&<p role='alert' className='text-red-800 p-4 text-sm'>{error}</p>}
    {data&&<>
      <div className='p-4 text-xs bg-blue-50 text-blue-900'>
        {data.summary.targets} destinos · {data.summary.sync_pending_flagged} com sincronização pendente sinalizada.
        A ausência de pendência não equivale a recebimento, exibição ou audiência comprovada.
      </div>
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
