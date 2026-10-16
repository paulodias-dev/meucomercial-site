import {useEffect, useMemo, useRef, useState} from 'react'
import {CalendarDays, CheckCircle2, Monitor, RefreshCcw, Send, ShieldCheck} from 'lucide-react'

type Medium='tv'|'radio'
type Page<T>={data:T[];pagination:{page:number;per_page:number;last_page:number;total:number}}
type Agency={id:number;name:string}
type Playlist={id:number;name:string;kind:Medium;orientation:string;items_count:number}
type Destination={id:number;name:string;location:string|null;available:boolean;reason:string|null;needs_sync:boolean}
type History={id:number;status:string;playlist_name:string|null;device_count:number;published_at:string|null;withdrawn_at:string|null}
type Draft={agency_tenant_id:number;playlist_id:number;medium:Medium;device_ids:number[];starts_on:string;ends_on:string;timezone:string;idempotency_key:string}
type Preview={ready:boolean;playlist:{id:number;name:string;kind:Medium;items_count:number};devices_count:number;starts_on:string;ends_on:string;timezone:string}
type Action='publication-options'|'publication-destinations'|'publication-preview'|'publication-create'|'publication-history'|'publication-withdraw'

const isoToday=()=>{
  const now=new Date()
  return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-')
}
const prettyDate=(value:string|null)=>{
  if(!value)return 'Sem data'
  const d=new Date(value)
  return Number.isFinite(d.getTime())?new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(d):'Data indisponível'
}
const button='min-h-11 px-4 py-2.5 rounded-xl text-sm font-semibold border disabled:opacity-50 disabled:cursor-not-allowed'
async function publicationRequest<T>(action:Action,token:string,opts:{
  method?:'POST';page?:number;medium?:Medium;body?:Record<string,unknown>;signal?:AbortSignal
}={}):Promise<T>{
  const url=new URL('/api/portal/'+action,window.location.origin)
  if(opts.page)url.searchParams.set('page',String(opts.page))
  if(opts.medium)url.searchParams.set('medium',opts.medium)
  const res=await fetch(url,{
    method:opts.method??'GET',headers:{'Content-Type':'application/json',Accept:'application/json',
      Authorization:'Bearer '+token},credentials:'omit',cache:'no-store',
    body:opts.method==='POST'?JSON.stringify(opts.body??{}):undefined,
    signal:opts.signal,
  })
  const data=await res.json().catch(()=>({}))
  if(!res.ok){
    if(res.status===401||res.status===403)throw new Error('Sua sessão expirou ou não possui autorização. Entre novamente.')
    if(res.status===409)throw new Error(data.message||'A programação foi alterada. Atualize a lista e tente novamente.')
    if(res.status===422)throw new Error(data.message||'Revise os campos, datas e destinos escolhidos.')
    throw new Error(data.message||'Não foi possível concluir a operação.')
  }
  return data as T
}

export default function ClientPublications({token}:{token:string}){
  const [agencies,setAgencies]=useState<Agency[]>([])
  const [agencyId,setAgencyId]=useState('')
  const [playlists,setPlaylists]=useState<Page<Playlist>|null>(null)
  const [playlistPage,setPlaylistPage]=useState(1)
  const [playlistId,setPlaylistId]=useState('')
  const [medium,setMedium]=useState<Medium>('tv')
  const [destinations,setDestinations]=useState<Page<Destination>|null>(null)
  const [destPage,setDestPage]=useState(1)
  const [selected,setSelected]=useState<number[]>([])
  const [startsOn,setStartsOn]=useState(isoToday)
  const [endsOn,setEndsOn]=useState(isoToday)
  const [timezone,setTimezone]=useState(()=>{
    const tz=Intl.DateTimeFormat().resolvedOptions().timeZone
    return tz&&tz.length<=80?tz:'America/Sao_Paulo'
  })
  const [history,setHistory]=useState<Page<History>|null>(null)
  const [historyPage,setHistoryPage]=useState(1)
  const [reload,setReload]=useState(0)
  const [loading,setLoading]=useState(true)
  const [loadingDest,setLoadingDest]=useState(true)
  const [submitting,setSubmitting]=useState(false)
  const [withdrawing,setWithdrawing]=useState<number|null>(null)
  const [error,setError]=useState('')
  const [message,setMessage]=useState('')
  const [preview,setPreview]=useState<{signature:string;data:Preview}|null>(null)
  // Retry of the same intent uses the same UUID, including on network timeout.
  const pendingRequest=useRef<{signature:string;key:string}|null>(null)
  const identity=useRef(token)
  identity.current=token

  useEffect(()=>{
    const abort=new AbortController()
    setLoading(true)
    Promise.all([
      publicationRequest<Page<Playlist>&{agencies:Agency[]}>('publication-options',token,{page:playlistPage,signal:abort.signal}),
      publicationRequest<Page<History>>('publication-history',token,{page:historyPage,signal:abort.signal}),
    ]).then(([choices,entries])=>{
      if(abort.signal.aborted||identity.current!==token)return
      setAgencies(choices.agencies);setPlaylists(choices);setHistory(entries)
      setAgencyId(current=>choices.agencies.some(a=>String(a.id)===current)
        ?current:choices.agencies.length===1?String(choices.agencies[0].id):'')
    }).catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Falha na consulta.')})
      .finally(()=>{if(!abort.signal.aborted)setLoading(false)})
    return ()=>abort.abort()
  },[token,playlistPage,historyPage,reload])

  useEffect(()=>{
    const abort=new AbortController()
    setLoadingDest(true);setDestinations(null)
    publicationRequest<Page<Destination>>('publication-destinations',token,{
      medium,page:destPage,signal:abort.signal,
    }).then(data=>{if(!abort.signal.aborted&&identity.current===token)setDestinations(data)})
      .catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Falha ao listar telas.')})
      .finally(()=>{if(!abort.signal.aborted)setLoadingDest(false)})
    return ()=>abort.abort()
  },[token,medium,destPage,reload])

  const chosenPlaylist=playlists?.data.find(p=>p.id===Number(playlistId))
  const sortedIds=useMemo(()=>[...selected].sort((a,b)=>a-b),[selected])
  const fields={
    agency_tenant_id:Number(agencyId),
    playlist_id:Number(playlistId),
    medium,device_ids:sortedIds,starts_on:startsOn,ends_on:endsOn,timezone,
  }
  const signature=JSON.stringify(fields)
  const validDates=startsOn>=isoToday()&&endsOn>=startsOn&&
    Number.isFinite(new Date(startsOn+'T12:00:00').getTime())&&
    Number.isFinite(new Date(endsOn+'T12:00:00').getTime())&&
    (new Date(endsOn+'T12:00:00').getTime()-new Date(startsOn+'T12:00:00').getTime())/86400000<=30
  const formValid=Number(agencyId)>0&&Number(playlistId)>0&&
    chosenPlaylist?.kind===medium&&sortedIds.length>0&&sortedIds.length<=100&&validDates&&timezone.length>0
  const requestBody=():Draft=>{
    if(pendingRequest.current?.signature!==signature)
      pendingRequest.current={signature,key:crypto.randomUUID()}
    return {...fields,idempotency_key:pendingRequest.current.key}
  }
  const toggle=(device:Destination)=>{
    if(!device.available||submitting)return
    setSelected(previous=>previous.includes(device.id)
      ?previous.filter(id=>id!==device.id)
      :previous.length<100?[...previous,device.id]:previous)
    setPreview(null);setMessage('')
  }
  const selectMedium=(next:Medium)=>{
    setMedium(next);setPlaylistId('');setSelected([]);setDestPage(1)
    setPreview(null);setMessage('');pendingRequest.current=null
  }
  const validate=async()=>{
    if(!formValid||submitting)return
    setSubmitting(true);setError('');setMessage('')
    try{
      const body=requestBody()
      const result=await publicationRequest<{data:Preview}>('publication-preview',token,{method:'POST',body})
      if(identity.current!==token)return
      setPreview({signature,data:result.data})
      setMessage('Validação concluída. Confira a programação e confirme a publicação.')
    }catch(e){if(identity.current===token)setError(e instanceof Error?e.message:'Prévia indisponível.')}
    finally{if(identity.current===token)setSubmitting(false)}
  }
  const publish=async()=>{
    if(!formValid||preview?.signature!==signature||submitting)return
    setSubmitting(true);setError('')
    try{
      const result=await publicationRequest<{data:History;replay:boolean}>(
        'publication-create',token,{method:'POST',body:requestBody()})
      if(identity.current!==token)return
      setMessage(result.replay?'Solicitação existente confirmada.':'Publicação registrada. Os Players ainda precisam sincronizar.')
      setPreview(null);setSelected([]);setPlaylistId('');setHistoryPage(1)
      pendingRequest.current=null;setReload(v=>v+1)
    }catch(e){if(identity.current===token)setError(e instanceof Error?e.message:'Publicação indisponível.')}
    finally{if(identity.current===token)setSubmitting(false)}
  }
  const withdraw=async(item:History)=>{
    if(item.status!=='published'||withdrawing!==null)return
    if(!window.confirm('Retirar esta programação dos seus Players? A interrupção ocorrerá após sincronização.'))return
    setWithdrawing(item.id);setError('');setMessage('')
    try{
      await publicationRequest('publication-withdraw',token,{method:'POST',body:{publication_id:item.id}})
      if(identity.current===token){setMessage('Retirada registrada. Aguarde sincronização dos Players.');setReload(v=>v+1)}
    }catch(e){if(identity.current===token)setError(e instanceof Error?e.message:'Falha ao retirar publicação.')}
    finally{if(identity.current===token)setWithdrawing(null)}
  }

  return <section className='bg-white border border-black/10 rounded-2xl p-4 sm:p-6 space-y-7' aria-labelledby='publication-heading'>
    <div className='flex flex-wrap justify-between items-start gap-3'>
      <div>
        <h2 id='publication-heading' className='font-bold text-xl sm:text-2xl'>Publicar nas minhas telas</h2>
        <p className='mt-2 text-sm text-black/60 max-w-2xl'>Escolha conteúdo já aprovado da sua biblioteca, selecione Players próprios e programe a exibição. Nenhum anúncio de terceiros será contratado por esta operação.</p>
      </div>
      <button type='button' onClick={()=>setReload(n=>n+1)} className={button+' border-black/15 flex items-center gap-2'}>
        <RefreshCcw size={16} aria-hidden/>Atualizar
      </button>
    </div>
    {loading&&<p role='status' className='text-sm text-blue-800'>Carregando suas opções de publicação…</p>}
    {error&&<p role='alert' className='rounded-xl bg-red-50 p-4 text-sm text-red-900'>{error}</p>}
    {message&&<p role='status' className='rounded-xl bg-blue-50 p-4 text-sm text-blue-900'>{message}</p>}

    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div>
        <label htmlFor='publication-agency' className='block font-bold text-xs mb-2'>Agência responsável</label>
        <select id='publication-agency' value={agencyId} onChange={e=>{setAgencyId(e.target.value);setPreview(null)}}
          className='w-full min-h-11 rounded-xl border border-black/15 px-3 text-sm'>
          <option value=''>Selecione uma agência autorizada</option>
          {agencies.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        {agencies.length===0&&!loading&&<p className='mt-2 text-xs text-red-700'>Nenhuma agência ativa está vinculada ao seu cadastro.</p>}
      </div>
      <div>
        <label htmlFor='publication-medium' className='block font-bold text-xs mb-2'>Formato da programação</label>
        <select id='publication-medium' value={medium} onChange={e=>selectMedium(e.target.value as Medium)}
          className='w-full min-h-11 rounded-xl border border-black/15 px-3 text-sm'>
          <option value='tv'>TV Indoor</option><option value='radio'>Rádio Indoor</option>
        </select>
      </div>
    </div>

    <div>
      <h3 className='font-bold text-base'>1. Selecione a playlist</h3>
      <p className='text-xs text-black/60 mt-1'>Só aparecem playlists ativas do seu cadastro. A API verifica novamente cada mídia e os direitos antes de publicar.</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3'>
        {(playlists?.data??[]).filter(p=>p.kind===medium).map(p=><label key={p.id}
          className={'rounded-xl border p-4 flex items-start gap-3 cursor-pointer '+(playlistId===String(p.id)?'border-blue-700 bg-blue-50':'border-black/10')}>
          <input type='radio' name='publication-playlist' checked={playlistId===String(p.id)}
            onChange={()=>{setPlaylistId(String(p.id));setPreview(null);setMessage('')}} className='mt-1'/>
          <span className='min-w-0'><strong className='text-sm block break-words'>{p.name}</strong>
            <span className='text-xs text-black/60'>{p.items_count} itens · {p.orientation==='portrait'?'Vertical':'Horizontal'}</span>
          </span>
        </label>)}
      </div>
      {!loading&&!(playlists?.data??[]).some(p=>p.kind===medium)&&
        <p className='mt-3 text-sm text-black/60'>Não há playlists desse formato nesta página. Ative uma playlist na gestão e retorne.</p>}
      <div className='mt-3 flex items-center gap-2 text-xs'>
        <button type='button' className={button+' border-black/15'} disabled={playlistPage<=1}
          onClick={()=>setPlaylistPage(p=>p-1)}>Anterior</button>
        <span>Página {playlistPage} de {playlists?.pagination.last_page??1}</span>
        <button type='button' className={button+' border-black/15'}
          disabled={!playlists||playlistPage>=playlists.pagination.last_page}
          onClick={()=>setPlaylistPage(p=>p+1)}>Próxima</button>
      </div>
    </div>

    <div>
      <h3 className='font-bold text-base'>2. Selecione os Players</h3>
      <p className='text-xs text-black/60 mt-1'>Apenas dispositivos do seu cadastro com local, assinatura e pareamento válidos podem receber conteúdo. Até 100 por publicação.</p>
      {loadingDest&&<p role='status' className='mt-3 text-sm'>Consultando dispositivos…</p>}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3'>
        {(destinations?.data??[]).map(d=><label key={d.id}
          className={'rounded-xl border p-4 flex gap-3 '+(d.available?'cursor-pointer':'opacity-60')+
            (selected.includes(d.id)?' border-blue-700 bg-blue-50':' border-black/10')}>
          <input type='checkbox' checked={selected.includes(d.id)} disabled={!d.available||submitting}
            onChange={()=>toggle(d)} className='mt-1'/>
          <span className='min-w-0'>
            <span className='block flex items-center gap-2 text-sm font-semibold'><Monitor size={16} aria-hidden/>{d.name}</span>
            <span className='text-xs text-black/60 block mt-1'>{d.location??'Sem local'} · {d.available?'Elegível':d.reason}</span>
          </span>
        </label>)}
      </div>
      <div className='flex flex-wrap justify-between items-center gap-2 mt-3 text-xs'>
        <strong>{selected.length} selecionados</strong>
        <div className='flex gap-2 items-center'>
          <button type='button' className={button+' border-black/15'} disabled={destPage<=1}
            onClick={()=>setDestPage(p=>p-1)}>Anterior</button>
          <span>Página {destPage} de {destinations?.pagination.last_page??1}</span>
          <button type='button' className={button+' border-black/15'}
            disabled={!destinations||destPage>=destinations.pagination.last_page}
            onClick={()=>setDestPage(p=>p+1)}>Próxima</button>
        </div>
      </div>
    </div>

    <div>
      <h3 className='font-bold text-base flex items-center gap-2'><CalendarDays size={18} aria-hidden/>3. Defina o período</h3>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3'>
        <div><label htmlFor='publication-start' className='text-xs font-semibold block mb-2'>Início</label>
          <input id='publication-start' type='date' min={isoToday()} value={startsOn}
            onChange={e=>{setStartsOn(e.target.value);setPreview(null)}} className='w-full min-h-11 px-3 border rounded-xl text-sm'/></div>
        <div><label htmlFor='publication-end' className='text-xs font-semibold block mb-2'>Término</label>
          <input id='publication-end' type='date' min={startsOn} value={endsOn}
            onChange={e=>{setEndsOn(e.target.value);setPreview(null)}} className='w-full min-h-11 px-3 border rounded-xl text-sm'/></div>
        <div><label htmlFor='publication-timezone' className='text-xs font-semibold block mb-2'>Fuso horário</label>
          <input id='publication-timezone' type='text' maxLength={80} value={timezone}
            onChange={e=>{setTimezone(e.target.value);setPreview(null)}}
            className='w-full min-h-11 px-3 border rounded-xl text-sm' placeholder='America/Sao_Paulo'/></div>
      </div>
      <p className='mt-2 text-xs text-black/60'>Período máximo: 31 dias, dentro dos próximos 12 meses. Grades existentes não serão substituídas automaticamente.</p>
    </div>

    <div className='border-t border-black/10 pt-5'>
      <h3 className='font-bold text-base'>4. Revisar e publicar</h3>
      <div className='flex flex-wrap gap-3 items-center mt-3'>
        <button type='button' disabled={!formValid||submitting||loading||loadingDest}
          onClick={()=>void validate()} className={button+' bg-blue-700 text-white border-blue-700 flex items-center gap-2'}>
          <ShieldCheck size={17} aria-hidden/>{submitting?'Validando…':'Validar publicação'}
        </button>
        {preview?.signature===signature&&preview.data.ready&&
          <button type='button' disabled={submitting} onClick={()=>void publish()}
            className={button+' border-blue-700 text-blue-800 flex items-center gap-2'}>
            <Send size={16} aria-hidden/>Confirmar publicação
          </button>}
      </div>
      {preview?.signature===signature&&<div className='mt-4 rounded-xl p-4 bg-blue-50 text-blue-950' role='status'>
        <p className='font-bold text-sm flex gap-2 items-center'><CheckCircle2 size={17} aria-hidden/>Prévia aprovada pela API</p>
        <p className='mt-2 text-sm'>{preview.data.playlist.name} · {preview.data.devices_count} Players · {preview.data.starts_on} a {preview.data.ends_on}</p>
        <p className='mt-2 text-xs'>Ainda não é publicação. A confirmação revalida todos os direitos e destinos sob transação.</p>
      </div>}
    </div>

    <div className='border-t border-black/10 pt-5'>
      <h3 className='font-bold text-base'>Minhas publicações</h3>
      <p className='mt-1 text-xs text-black/60'>Histórico de publicações feitas pelo seu portal. Conexão do Player não equivale a audiência comprovada.</p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-4'>
        {(history?.data??[]).map(h=><article key={h.id} className='border border-black/10 rounded-xl p-4'>
          <h4 className='text-sm font-bold'>{h.playlist_name||'Playlist não disponível'}</h4>
          <p className='text-xs text-black/60 mt-2'>{h.device_count} Players · {h.status==='published'?'Publicada':'Retirada'}</p>
          <p className='text-xs text-black/60 mt-1'>Criada em: {prettyDate(h.published_at)}</p>
          {h.status==='published'&&<button type='button' disabled={withdrawing!==null}
            onClick={()=>void withdraw(h)} className={button+' border-red-300 text-red-800 mt-3'}>
            {withdrawing===h.id?'Retirando…':'Retirar publicação'}
          </button>}
        </article>)}
        {!loading&&history?.data.length===0&&<p className='text-sm text-black/60 p-4'>Você ainda não publicou conteúdo pelo portal.</p>}
      </div>
      <div className='flex gap-2 items-center mt-3 text-xs'>
        <button type='button' disabled={historyPage<=1} onClick={()=>setHistoryPage(p=>p-1)}
          className={button+' border-black/15'}>Anterior</button>
        <span>Página {historyPage} de {history?.pagination.last_page??1}</span>
        <button type='button' disabled={!history||historyPage>=history.pagination.last_page}
          onClick={()=>setHistoryPage(p=>p+1)} className={button+' border-black/15'}>Próxima</button>
      </div>
    </div>
  </section>
}
