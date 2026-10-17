import {useEffect,useState} from 'react'
import {RefreshCcw} from 'lucide-react'
import ClientPlaybackReports from './ClientPlaybackReports'

type Log={id:number;status:string;playlist_id:number|null;manifest_version:number;protocol:number;finished_at:string|null;evidence:string}
type Command={id:number;type:string;status:string;created_at:string|null;sent_at:string|null;acknowledged_at:string|null}
type OwnEvent={event_uuid:string;playlist_id:number;playlist_item_id:number;manifest_version:number;occurred_at:string|null;content_type:string;evidence:string}
type Recovery={code:'blocked'|'inactive'|'subscription'|'pairing'|'pairing_support'|'connection'|'sync_queued'|'sync_required'|'monitoring';
  title:string;guidance:string;can_request_sync:boolean;can_request_pairing_pin:boolean;
  pending_sync_command:boolean;latest_sync_status:string|null;
  evidence:'guidance_from_operational_state_not_player_ack'}
type Diagnostics={device_id:number;name:string;status:string;needs_sync:boolean;
  recovery:Recovery;
  current_manifest_version:number;paired:boolean;last_seen_at:string|null;last_sync_at:string|null;
  heartbeat:{status:string;reported_at:string|null;app_version:string|null;storage_free_mb:number|null}|null;
  sync_logs:Log[];commands:Command[];own_playback_reported_24h:number;own_playback_events:OwnEvent[];playback_confirmed:false;evidence:string}
const when=(value:string|null)=>value?new Date(value).toLocaleString('pt-BR'):'Sem registro'
export default function ClientDeviceDiagnostics({token,deviceId,onUpdated}:{token:string;deviceId:number;onUpdated?:()=>void}){
  const [data,setData]=useState<Diagnostics|null>(null)
  const [busy,setBusy]=useState(true)
  const [error,setError]=useState('')
  const [reload,setReload]=useState(0)
  const [reportsOpen,setReportsOpen]=useState(false)
  const [confirmSync,setConfirmSync]=useState(false)
  const [syncBusy,setSyncBusy]=useState(false)
  const [actionResult,setActionResult]=useState('')
  const [actionError,setActionError]=useState('')
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
  const requestSync=async()=>{
    if(syncBusy||!confirmSync||!data?.recovery.can_request_sync||data.recovery.code!=='sync_required')return
    setSyncBusy(true);setActionResult('');setActionError('')
    try{
      const response=await fetch('/api/portal/sync-device',{
        method:'POST',headers:{Authorization:'Bearer '+token,Accept:'application/json','Content-Type':'application/json'},
        credentials:'omit',cache:'no-store',body:JSON.stringify({device_id:String(deviceId)}),
      })
      const payload=await response.json().catch(()=>({}))
      if(!response.ok)throw new Error(response.status===401||response.status===403
        ? 'A sessão não autoriza esta ação. Entre novamente no Portal.'
        :payload.message||'Não foi possível solicitar a sincronização.')
      if(response.status!==202||payload?.data?.device_id!==deviceId||
        payload?.data?.evidence!=='command_queued_not_player_ack')
        throw new Error('Resposta de confirmação do comando inválida.')
      setActionResult(payload.data.already_pending
        ?'Uma solicitação já estava pendente. Aguarde o Player confirmar no diagnóstico.'
        :'Comando registrado no servidor. Aguarde a confirmação real do Player antes de considerar a sincronização concluída.')
      setConfirmSync(false)
      setReload(n=>n+1)
      onUpdated?.()
    }catch(reason){
      setActionError(reason instanceof Error?reason.message:'Falha ao solicitar ressincronização.')
    }finally{setSyncBusy(false)}
  }
  const recovery=data?.recovery
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
      {recovery&&<section className='mt-4 bg-white rounded-xl border border-blue-200 p-4'
        aria-label='Plano de recuperação assistida'>
        <h5 className='font-bold text-sm'>Próxima ação recomendada</h5>
        <strong className='block mt-2 text-blue-900'>{recovery.title}</strong>
        <p className='text-xs text-black/70 mt-2'>{recovery.guidance}</p>
        {recovery.latest_sync_status&&<p className='text-xs mt-2 text-black/60'>
          Último resultado de sincronização: {recovery.latest_sync_status==='success'?'Concluído pelo Player':
            recovery.latest_sync_status==='failed'?'Falha relatada pelo Player':'Status '+recovery.latest_sync_status}.
        </p>}
        {recovery.pending_sync_command&&<p className='text-xs mt-2 text-amber-800' role='status'>
          Já existe comando pendente. Não reenvie até confirmar o resultado.
        </p>}
        {recovery.can_request_pairing_pin&&<p className='text-xs mt-2'>
          O PIN temporário pode ser solicitado em Meus dispositivos. Nunca compartilhe o código fora da instalação.
        </p>}
        {recovery.code==='sync_required'&&recovery.can_request_sync&&<>
          {!confirmSync?<button type='button' onClick={()=>{setConfirmSync(true);setActionError('')}}
            className='mt-3 min-h-11 rounded-lg px-4 border border-blue-600 text-blue-800 text-xs font-semibold'>
            Preparar ressincronização
          </button>:<div className='mt-3 p-3 border rounded-lg'>
            <p className='text-xs font-semibold'>Confirmar o envio de um comando ao Player {data.name}?</p>
            <p className='text-xs text-black/60 mt-1'>A solicitação pode atualizar o manifesto, mas não garante recebimento imediato ou reprodução.</p>
            <div className='flex flex-wrap gap-2 mt-3'>
              <button type='button' disabled={syncBusy} onClick={()=>void requestSync()}
                className='min-h-11 rounded-lg px-3 bg-blue-800 text-white text-xs disabled:opacity-50'>
                {syncBusy?'Enviando…':'Confirmar solicitação'}
              </button>
              <button type='button' disabled={syncBusy} onClick={()=>setConfirmSync(false)}
                className='min-h-11 rounded-lg px-3 border text-xs disabled:opacity-50'>Cancelar</button>
            </div>
          </div>}
        </>}
      </section>}
      {actionResult&&<p role='status' className='mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-900'>{actionResult}</p>}
      {actionError&&<p role='alert' className='mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-900'>{actionError}</p>}
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
      <button type='button' className='mt-3 min-h-11 w-full sm:w-auto px-4 rounded-xl border border-blue-200 bg-white text-xs font-semibold text-blue-800'
        onClick={()=>setReportsOpen(open=>!open)}>
        {reportsOpen?'Fechar histórico detalhado':'Consultar histórico de até 30 dias'}
      </button>
      {reportsOpen&&<ClientPlaybackReports token={token} deviceId={deviceId}/>}
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
