import {useEffect,useState} from 'react'
import {RefreshCcw} from 'lucide-react'

type Log={id:number;status:string;playlist_id:number|null;manifest_version:number;protocol:number;finished_at:string|null;evidence:string}
type Command={id:number;type:string;status:string;created_at:string|null;sent_at:string|null;acknowledged_at:string|null}
type OwnEvent={event_uuid:string;playlist_id:number;playlist_item_id:number;manifest_version:number;occurred_at:string|null;content_type:string;evidence:string}
type Diagnostics={device_id:number;name:string;status:string;needs_sync:boolean;
  current_manifest_version:number;paired:boolean;last_seen_at:string|null;last_sync_at:string|null;
  heartbeat:{status:string;reported_at:string|null;app_version:string|null;storage_free_mb:number|null}|null;
  sync_logs:Log[];commands:Command[];own_playback_reported_24h:number;own_playback_events:OwnEvent[];playback_confirmed:false;evidence:string}
const when=(value:string|null)=>value?new Date(value).toLocaleString('pt-BR'):'Sem registro'
export default function ClientDeviceDiagnostics({token,deviceId}:{token:string;deviceId:number}){
  const [data,setData]=useState<Diagnostics|null>(null)
  const [busy,setBusy]=useState(true)
  const [error,setError]=useState('')
  const [reload,setReload]=useState(0)
  useEffect(()=>{
    const abort=new AbortController()
    const url=new URL('/api/portal/device-diagnostics',window.location.origin)
    url.searchParams.set('device_id',String(deviceId))
    setBusy(true);setError('')
    fetch(url,{headers:{Authorization:'Bearer '+token,Accept:'application/json'},
      credentials:'omit',cache:'no-store',signal:abort.signal,
    }).then(async response=>{
      const body=await response.json().catch(()=>({}))
      if(!response.ok)throw new Error(body.message||'Não foi possível consultar este dispositivo.')
      return body as {data:Diagnostics}
    }).then(body=>{if(!abort.signal.aborted)setData(body.data)})
      .catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Falha no diagnóstico.')})
      .finally(()=>{if(!abort.signal.aborted)setBusy(false)})
    return ()=>abort.abort()
  },[token,deviceId,reload])
  return <section className='rounded-xl border border-blue-100 mt-4 p-4 bg-blue-50/40' aria-label='Diagnóstico do Player'>
    <div className='flex flex-wrap justify-between items-start gap-2'>
      <div>
        <h4 className='font-bold text-sm'>Diagnóstico operacional</h4>
        <p className='text-xs text-black/60 mt-1'>Versão solicitada: v{data?.current_manifest_version??'—'}</p>
      </div>
      <button type='button' disabled={busy} onClick={()=>setReload(x=>x+1)}
        className='min-h-11 rounded-xl border border-blue-200 px-3 text-xs font-semibold flex items-center gap-2 disabled:opacity-50'>
        <RefreshCcw size={15}/>Atualizar
      </button>
    </div>
    {busy&&<p role='status' className='text-sm mt-3'>Consultando registros do Player…</p>}
    {error&&<p role='alert' className='mt-3 text-sm text-red-800'>{error}</p>}
    {data&&<>
      <p className='mt-3 text-xs text-black/70'>Última comunicação: {when(data.last_seen_at)}</p>
      <p className='mt-1 text-xs text-black/70'>Último sync declarado: {when(data.last_sync_at)}</p>
      <p className='mt-1 text-xs text-black/70'>Aplicativo: {data.heartbeat?.app_version??'Não informado'}</p>
      <p className='mt-1 text-xs text-black/70'>{data.needs_sync
        ?'Aguardando sincronização sinalizada no servidor.':'Sem pendência sinalizada no servidor.'}</p>
      <h5 className='font-semibold text-xs mt-4 mb-2'>Últimas sincronizações</h5>
      {data.sync_logs.length===0?<p className='text-xs text-black/60'>Nenhuma confirmação de sincronização registrada.</p>
        :<div className='space-y-2'>
          {data.sync_logs.map(l=><div key={l.id} className='rounded-xl border border-black/10 bg-white p-3 text-xs'>
            <strong>{l.status==='success'?'Concluída pelo Player':l.status==='failed'?'Falhou no Player':'Resultado '+l.status}</strong>
            {' · '}v{l.manifest_version||'—'} · {when(l.finished_at)}
            <p className='text-black/60 mt-1'>{l.protocol===2?'Confirmação autenticada v2':'Protocolo legado'}</p>
          </div>)}
        </div>}
      <h5 className='font-semibold text-xs mt-4 mb-2'>Relatos de exibição TV e spots próprios de Rádio (24h): {data.own_playback_reported_24h??0}</h5>
      {!data.own_playback_events?.length?<p className='text-xs text-black/60'>Sem relatos do Player.</p>
        :<div className='space-y-2'>
          {data.own_playback_events.map(e=><p key={e.event_uuid} className='text-xs rounded-xl bg-white border border-black/10 p-3'>
            {e.content_type==='audio'?'Spot institucional de Rádio':e.content_type==='video'?'Vídeo TV':'Imagem TV'} · item #{e.playlist_item_id} · manifesto v{e.manifest_version} · {when(e.occurred_at)}
          </p>)}
        </div>}
      <p className='text-xs text-black/60 mt-2'>Esses registros são relatos autenticados do próprio Player, não uma certificação independente de reprodução ou audiência.</p>
      <h5 className='font-semibold text-xs mt-4 mb-2'>Últimos comandos</h5>
      {data.commands.length===0?<p className='text-xs text-black/60'>Nenhum comando registrado.</p>
        :<div className='space-y-2'>
          {data.commands.map(c=><p key={c.id} className='text-xs rounded-xl bg-white border border-black/10 p-3'>
            {c.type} · {c.status} · {when(c.created_at)}
          </p>)}
        </div>}
      <p className='text-xs text-black/60 mt-4'>
        Conexão, heartbeat, comando e ACK representam telemetria informada pelo aparelho.
        Não são auditoria independente de reprodução ou audiência.
      </p>
    </>}
  </section>
}
