import {useEffect, useRef, useState, type FormEvent} from 'react'
import ClientPublications from './ClientPublications'
import ClientStudio from './ClientStudio'
import ClientDeviceDiagnostics from './ClientDeviceDiagnostics'
import ClientOnboarding from './ClientOnboarding'
import ClientPlaybackOverview from './ClientPlaybackOverview'
import {ArrowLeft, ArrowRight, BadgeCheck, Building2, LogOut, Monitor, Radio, RefreshCcw, ShieldCheck} from 'lucide-react'

type Session = {token:string; client:{id:number;name?:string;email?:string}}
type PortalOverview = {
  devices:{total:number;online:number;offline:number;blocked:number;needs_sync:number;unpaired:number}
  locations:number;playlists:number;schedules_active:number
  campaigns:{total:number;awaiting_review:number}
  subscriptions_by_status:Record<string,number>
  server_time:string
  evidence:'operational_not_audience'
}
type Device = {
  id:number;name:string;device_type:string;platform:string|null
  location:{name:string;city:string|null}|null
  status:'online'|'offline'|'blocked'|'pending_pairing'
  needs_sync:boolean;last_seen_at:string|null;subscription_status:string|null
}
type Campaign = {
  id:number;title:string;status:string;creative_status:string
  submitted_at:string|null;approved_at:string|null;created_at:string|null
}
type Page<T> = {data:T[];pagination:{page:number;last_page:number;total:number;per_page:number}}
type Service = {
  id:number;status:string;expires_at:string|null
  plan:{name:string;description:string|null;interval:string|null}|null
}
type Location = {id:number;name:string;kind:string;city:string|null;state:string|null;is_active:boolean}
type Media = {id:number;name:string;type:string;status:string;duration_seconds:number|null}
type View = 'devices'|'campaigns'|'services'|'locations'|'media'|'publications'|'studio'
type PortalResponse<T>={data:T}

async function portalRequest<T>(action:'login'|'logout'|'overview'|'devices'|'campaigns'|'services'|'locations'|'media'|'pair-device'|'sync-device'|'claim-device',
  token:string|null,options:{page?:number;method?:'POST';body?:Record<string,string>;signal?:AbortSignal}={}):Promise<T>{
  const url=new URL('/api/portal/'+action,window.location.origin)
  if(options.page)url.searchParams.set('page',String(options.page))
  const res=await fetch(url,{
    method:options.method??'GET',
    headers:{'Content-Type':'application/json',Accept:'application/json',
      ...(token?{Authorization:'Bearer '+token}:{})},
    body:options.body?JSON.stringify(options.body):undefined,
    signal:options.signal,
    cache:'no-store',
    credentials:'omit',
  })
  const parsed=await res.json().catch(()=>({}))
  if(!res.ok){
    if(res.status===401||res.status===403)throw new Error('Acesso não autorizado. Entre novamente ou verifique seu cadastro.')
    if(res.status===422)throw new Error('Revise os campos informados.')
    throw new Error(parsed?.message||'O serviço está indisponível. Tente novamente.')
  }
  return parsed as T
}
const date=(value:string|null|undefined)=>{
  if(!value)return 'Sem registro'
  const d=new Date(value)
  return Number.isFinite(d.getTime())
    ? new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(d)
    :'Data indisponível'
}
const labels:Record<string,string>={
  online:'Online',offline:'Offline',blocked:'Bloqueado',pending_pairing:'Aguardando pareamento',
  draft:'Rascunho',submitted:'Aguardando análise',approved:'Aprovado',
  rejected:'Rejeitado',cancelled:'Cancelado',pending:'Pendente',
}
export default function ClientPortal(){
  // No persistent localStorage, sessionStorage, URL or cookie token.
  // A refresh requires a new login; the server validates every call.
  const [session,setSession]=useState<Session|null>(null)
  const activeToken=useRef<string|null>(null)
  const [deviceActionBusy,setDeviceActionBusy]=useState<number|null>(null)
  const [deviceActionMessage,setDeviceActionMessage]=useState('')
  const [pairingPin,setPairingPin]=useState<{deviceId:number;pin:string;expiresAt:string}|null>(null)
  const [playerPinByDevice,setPlayerPinByDevice]=useState<Record<number,string>>({})
  const [scannedPin,setScannedPin]=useState<string|null>(null)
  const [diagnosticsId,setDiagnosticsId]=useState<number|null>(null)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [view,setView]=useState<View>('devices')
  const [publishFromStudio,setPublishFromStudio]=useState<{id:number;kind:'tv'|'radio'}|null>(null)
  const [page,setPage]=useState(1)
  const [refresh,setRefresh]=useState(0)
  const [overview,setOverview]=useState<PortalOverview|null>(null)
  const [devices,setDevices]=useState<Page<Device>|null>(null)
  const [campaigns,setCampaigns]=useState<Page<Campaign>|null>(null)
  const [services,setServices]=useState<Page<Service>|null>(null)
  const [locations,setLocations]=useState<Page<Location>|null>(null)
  const [media,setMedia]=useState<Page<Media>|null>(null)
  const [loading,setLoading]=useState(false)
  useEffect(()=>{
    // The QR PIN is carried only in the fragment: never sent to Express/API,
    // analytics, Referer or localStorage. Clear browser history immediately.
    const match=/^#pair=([0-9]{6})$/.exec(window.location.hash)
    if(!match)return
    window.history.replaceState(window.history.state,'',window.location.pathname+window.location.search)
    setScannedPin(match[1]);setView('devices')
  },[])
  const clearSession=()=>{
    activeToken.current=null
    setPairingPin(null);setPlayerPinByDevice({});setDiagnosticsId(null);setDeviceActionBusy(null);setDeviceActionMessage('')
    setPublishFromStudio(null)
    setSession(null);setOverview(null);setDevices(null);setCampaigns(null);setServices(null);setLocations(null);setMedia(null)
    setPassword('');setPage(1);setError('')
  }
  const signOut=()=>{
    const token=session?.token
    clearSession()
    if(token)void portalRequest('logout',token,{method:'POST'}).catch(()=>{})
  }
  const login=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault()
    if(busy)return
    setBusy(true);setError('')
    try{
      const data=await portalRequest<{
        access_token:string;client:{id:number;name?:string;email?:string}
      }>('login',null,{method:'POST',body:{email:email.trim(),password}})
      if(!data.access_token||!data.client?.id)throw new Error('Resposta de autenticação inválida.')
      activeToken.current=data.access_token
      setSession({token:data.access_token,client:data.client})
      setPassword('');setPage(1);setRefresh(x=>x+1)
    }catch(e){setError(e instanceof Error?e.message:'Falha de autenticação.')}
    finally{setBusy(false)}
  }
  useEffect(()=>{
    if(!session||view==='publications'||view==='studio')return
    const abort=new AbortController()
    setLoading(true);setError('')
    // Responses from an old page/role must not appear while switching scope.
    setDevices(null);setCampaigns(null);setServices(null);setLocations(null);setMedia(null)
    Promise.all([
      portalRequest<PortalResponse<PortalOverview>>('overview',session.token,{signal:abort.signal}),
      view==='devices'
        ? portalRequest<Page<Device>>('devices',session.token,{page,signal:abort.signal})
        : view==='campaigns'
          ? portalRequest<Page<Campaign>>('campaigns',session.token,{page,signal:abort.signal})
          : view==='services'
            ? portalRequest<Page<Service>>('services',session.token,{page,signal:abort.signal})
            : view==='locations'
              ? portalRequest<Page<Location>>('locations',session.token,{page,signal:abort.signal})
              : portalRequest<Page<Media>>('media',session.token,{page,signal:abort.signal}),
    ]).then(([summary,list])=>{
      if(abort.signal.aborted)return
      setOverview(summary.data)
      if(view==='devices')setDevices(list as Page<Device>)
      else if(view==='campaigns')setCampaigns(list as Page<Campaign>)
      else if(view==='services')setServices(list as Page<Service>)
      else if(view==='locations')setLocations(list as Page<Location>)
      else setMedia(list as Page<Media>)
    }).catch(err=>{
      if(abort.signal.aborted)return
      if(err instanceof Error&&err.message.startsWith('Acesso não autorizado')){
        clearSession();setError('Sessão encerrada. Entre novamente.')
      }else setError(err instanceof Error?err.message:'Falha ao consultar serviços.')
    }).finally(()=>{if(!abort.signal.aborted)setLoading(false)})
    return ()=>abort.abort()
  },[session,view,page,refresh])

  const doDeviceAction=async(action:'pair-device'|'sync-device',device:Device)=>{
    if(!session||deviceActionBusy!==null)return
    const token=session.token
    setDeviceActionBusy(device.id);setDeviceActionMessage('')
    if(action==='pair-device')setPairingPin(null)
    try{
      const response=await portalRequest<{data:{
        device_id:number;pin?:string;expires_at?:string;already_pending?:boolean
      }}>(action,token,{method:'POST',body:{device_id:String(device.id)}})
      if(activeToken.current!==token)return
      if(response.data.device_id!==device.id)throw new Error('Resposta do dispositivo inválida.')
      if(action==='pair-device'){
        if(!response.data.pin||!/^\d{6}$/.test(response.data.pin)||!response.data.expires_at)
          throw new Error('PIN temporário inválido. Tente novamente.')
        setPairingPin({deviceId:device.id,pin:response.data.pin,expiresAt:response.data.expires_at})
        setDeviceActionMessage('PIN gerado. Informe o código somente no Player correspondente.')
      }else{
        setDeviceActionMessage(response.data.already_pending
          ? 'Já existe um comando de sincronização pendente para este Player.'
          : 'Sincronização solicitada. A execução depende da próxima comunicação do Player.')
        setRefresh(n=>n+1)
      }
    }catch(e){
      if(activeToken.current!==token)return
      if(e instanceof Error&&e.message.startsWith('Acesso não autorizado')){
        clearSession();setError('Sessão encerrada. Entre novamente.')
      }else setDeviceActionMessage(e instanceof Error?e.message:'Não foi possível solicitar a operação.')
    }finally{if(activeToken.current===token)setDeviceActionBusy(null)}
  }
  const claimFromPlayer=async(device:Device)=>{
    if(!session||deviceActionBusy!==null)return
    const pin=(playerPinByDevice[device.id]??'').trim()
    if(!/^\d{6}$/.test(pin)){
      setDeviceActionMessage('Informe os seis números exibidos na tela do Player.');return
    }
    const token=session.token
    setDeviceActionBusy(device.id);setDeviceActionMessage('')
    try{
      const result=await portalRequest<{data:{device_id:number;paired:boolean;status:string}}>(
        'claim-device',token,{method:'POST',body:{device_id:String(device.id),pin}})
      if(activeToken.current!==token)return
      if(result.data.device_id!==device.id||!result.data.paired)
        throw new Error('Não foi possível autorizar este aparelho.')
      setPlayerPinByDevice(old=>({...old,[device.id]:''}))
      setPairingPin(null)
      setDeviceActionMessage('Pareamento autorizado. O Player irá resgatar a credencial com segurança e iniciar a comunicação.')
      setRefresh(n=>n+1)
    }catch(error){
      if(activeToken.current===token)setDeviceActionMessage(error instanceof Error?error.message:'Falha ao autorizar o Player.')
    }finally{if(activeToken.current===token)setDeviceActionBusy(null)}
  }

  const changeView=(next:View)=>{
    setPublishFromStudio(null)
    setView(next);setPage(1);setPairingPin(null);setPlayerPinByDevice({});setDiagnosticsId(null);setDeviceActionMessage('')
  }
  const list=view==='publications'||view==='studio'?null:view==='devices'?devices:view==='campaigns'?campaigns:
    view==='services'?services:view==='locations'?locations:media
  const cards=[
    ['Total de Players',overview?.devices.total??0,Monitor],
    ['Online',overview?.devices.online??0,BadgeCheck],
    ['Offline',overview?.devices.offline??0,Radio],
    ['Sincronização pendente',overview?.devices.needs_sync??0,RefreshCcw],
  ] as const

  return <main className='min-h-screen bg-[#F5F7FA] text-[#1D1D1F]'>
    <header className='bg-white border-b border-black/10'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 min-h-20 flex flex-wrap items-center justify-between gap-4 py-4'>
        <a href='/' className='inline-flex gap-2 items-center text-sm text-black/75 font-semibold'>
          <ArrowLeft size={17} aria-hidden/>Voltar ao Meu Comercial
        </a>
        <span className='text-xs sm:text-sm font-bold text-blue-800 inline-flex items-center gap-2'>
          <Building2 size={20} aria-hidden/>Portal do Estabelecimento
        </span>
        {session&&<button type='button' onClick={signOut}
          className='text-xs font-bold px-4 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 inline-flex items-center gap-2'>
          <LogOut size={16} aria-hidden/>Sair
        </button>}
      </div>
    </header>

    {!session?<div className='max-w-lg mx-auto py-12 sm:py-20 px-4'>
      <div className='bg-white rounded-3xl shadow-sm border border-black/10 p-6 sm:p-10'>
        <div className='inline-flex items-center gap-2 text-blue-800 text-xs font-bold'>
          <ShieldCheck size={20} aria-hidden/>Acesso exclusivo ao seu cadastro
        </div>
        <h1 className='text-2xl sm:text-3xl font-bold mt-4 font-display'>Seus serviços de TV e Rádio em um só lugar</h1>
        <p className='text-sm text-black/65 leading-7 mt-3'>
          Consulte dispositivos, situação da programação e pedidos de anúncios vinculados ao seu cadastro.
          Utilize o e-mail e a senha do cliente já cadastrado.
        </p>
        <form onSubmit={login} className='space-y-5 mt-7'>
          <div><label htmlFor='portal-email' className='block font-semibold text-xs mb-2'>E-mail</label>
            <input id='portal-email' type='email' value={email} autoComplete='username'
              onChange={e=>setEmail(e.target.value)} required maxLength={100}
              className='w-full min-h-11 border border-black/15 rounded-xl px-4 text-sm focus:outline-2 focus:outline-blue-700'
              placeholder='seuemail@empresa.com.br'/></div>
          <div><label htmlFor='portal-password' className='block font-semibold text-xs mb-2'>Senha</label>
            <input id='portal-password' type='password' value={password}
              autoComplete='current-password' onChange={e=>setPassword(e.target.value)} required
              className='w-full min-h-11 border border-black/15 rounded-xl px-4 text-sm focus:outline-2 focus:outline-blue-700'/></div>
          {error&&<p role='alert' className='text-sm bg-red-50 text-red-800 p-3 rounded-xl'>{error}</p>}
          <button type='submit' disabled={busy}
            className='w-full min-h-12 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm disabled:opacity-60'>
            {busy?'Validando acesso…':'Acessar meus serviços'}
          </button>
        </form>
        <p className='text-xs text-black/50 leading-5 mt-5'>
          Por segurança, sua sessão não é gravada neste navegador. Atualizar a página exige novo acesso.
          Em caso de senha esquecida, solicite recuperação ao suporte.
        </p>
      </div>
    </div>:<div className='max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12'>
      <div className='flex flex-wrap justify-between gap-4 mb-7'>
        <div>
          <p className='text-xs font-bold uppercase tracking-wide text-blue-700'>Área do cliente</p>
          <h1 className='font-display font-bold text-2xl sm:text-3xl mt-2'>Olá, {session.client.name||'cliente'}</h1>
          <p className='text-black/60 text-sm mt-2'>Informações operacionais do seu cadastro — sem acesso aos dados de outras empresas.</p>
        </div>
        <button type='button' disabled={loading} onClick={()=>setRefresh(x=>x+1)}
          className='self-start rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 disabled:opacity-50'>
          Atualizar dados
        </button>
      </div>
      {error&&<div role='alert' className='bg-red-50 text-red-900 border border-red-200 p-4 rounded-xl mb-6'>{error}</div>}
      {loading&&<p role='status' className='text-sm text-blue-800 py-3'>Consultando informações atualizadas…</p>}
      {overview&&<div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6'>
        {cards.map(([label,value,Icon])=><div key={label}
          className='bg-white rounded-2xl p-4 sm:p-5 border border-black/10'>
          <div className='flex gap-2 items-center text-xs text-black/60'>
            <Icon size={17} aria-hidden/>{label}
          </div>
          <strong className='block text-2xl sm:text-3xl mt-3'>{value.toLocaleString('pt-BR')}</strong>
        </div>)}
      </div>}
      {overview&&<div className='bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-900 mb-8'>
        {overview.locations} locais · {overview.playlists} playlists · {overview.schedules_active} grades ativas
        {' · '}{overview.campaigns.total} pedidos comerciais
        {' · '}Sincronização e conexão não comprovam reprodução ou audiência.
      </div>}
        <div className='flex flex-wrap gap-2 p-3 sm:p-4 mb-4 rounded-2xl bg-white border border-black/10' role='group' aria-label='Consulta do portal'>
          <button type='button' aria-pressed={view==='devices'} onClick={()=>changeView('devices')}
            className={'px-4 py-3 rounded-xl text-sm font-bold '+
              (view==='devices'?'bg-blue-700 text-white':'bg-[#F5F7FA] text-black/70')}>
            Meus dispositivos
          </button>
          <button type='button' aria-pressed={view==='services'} onClick={()=>changeView('services')}
            className={'px-4 py-3 rounded-xl text-sm font-bold '+
              (view==='services'?'bg-blue-700 text-white':'bg-[#F5F7FA] text-black/70')}>
            Meus serviços
          </button>
          <button type='button' aria-pressed={view==='locations'} onClick={()=>changeView('locations')}
            className={'px-4 py-3 rounded-xl text-sm font-bold '+
              (view==='locations'?'bg-blue-700 text-white':'bg-[#F5F7FA] text-black/70')}>
            Locais
          </button>
          <button type='button' aria-pressed={view==='media'} onClick={()=>changeView('media')}
            className={'px-4 py-3 rounded-xl text-sm font-bold '+
              (view==='media'?'bg-blue-700 text-white':'bg-[#F5F7FA] text-black/70')}>
            Biblioteca de mídia
          </button>
          <button type='button' aria-pressed={view==='studio'} onClick={()=>changeView('studio')}
            className={'px-4 py-3 rounded-xl text-sm font-bold '+
              (view==='studio'?'bg-blue-700 text-white':'bg-[#F5F7FA] text-black/70')}>
            Estúdio Simples
          </button>
          <button type='button' aria-pressed={view==='publications'} onClick={()=>changeView('publications')}
            className={'px-4 py-3 rounded-xl text-sm font-bold '+
              (view==='publications'?'bg-blue-700 text-white':'bg-[#F5F7FA] text-black/70')}>
            Publicar conteúdo
          </button>
          <button type='button' aria-pressed={view==='campaigns'} onClick={()=>changeView('campaigns')}
            className={'px-4 py-3 rounded-xl text-sm font-bold '+
              (view==='campaigns'?'bg-blue-700 text-white':'bg-[#F5F7FA] text-black/70')}>
            Anúncios contratados
          </button>
        </div>
      <ClientOnboarding token={session.token} onNavigate={changeView}/>
      {view==='devices'&&<ClientPlaybackOverview key={session.client.id} token={session.token}/>}
      {view==='studio'
        ? <ClientStudio key={session.client.id} token={session.token} onPublish={selection=>{
            setPublishFromStudio(selection);setView('publications')
          }}/>
        : view==='publications'
          ? <ClientPublications key={session.client.id+'-'+(publishFromStudio?.id??0)}
              token={session.token} initialSelection={publishFromStudio}/>
          : <div className='bg-white border border-black/10 rounded-2xl overflow-hidden'>
        <div className='p-4 sm:p-6'>
          <h2 className='font-bold text-lg'>{view==='devices'?'Situação dos Players':
            view==='campaigns'?'Pedidos como anunciante':view==='services'?'Assinaturas e planos':
            view==='locations'?'Unidades e locais cadastrados':'Minha biblioteca'}</h2>
          <p className='text-xs text-black/60 mt-1 mb-6'>
            {view==='devices'
              ? 'Gere um PIN para Players ainda não pareados ou solicite sincronização dos dispositivos ativos. Publicação e substituição de aparelhos pareados continuam restritas à gestão.'
              : view==='campaigns'
                ? 'A aprovação de uma ordem não garante automaticamente inserções concluídas ou audiência.'
                : view==='services' ? 'Consulte o plano, a vigência e o estado do serviço. Cobranças e pagamentos permanecem no financeiro do contrato.'
                  : view==='locations' ? 'Somente unidades e locais vinculados ao seu cadastro.'
                    : 'Metadados da sua biblioteca sem expor links privados dos arquivos.'}
          </p>
          {view==='devices'&&deviceActionMessage&&<p role='status' aria-live='polite'
            className='text-sm bg-blue-50 text-blue-900 p-3 rounded-xl mb-4'>{deviceActionMessage}</p>}
          {!loading&&list?.data.length===0&&<p className='text-sm text-black/60 bg-[#F5F7FA] rounded-xl p-6'>
            Nenhum registro encontrado nesta categoria.
          </p>}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {view==='devices'?(devices?.data??[]).map(d=><article key={d.id}
              className='rounded-xl border border-black/10 p-4 sm:p-5'>
              <div className='flex justify-between gap-3 items-start'>
                <div><h3 className='font-bold text-sm'>{d.name}</h3>
                  <p className='text-xs text-black/60 mt-1'>
                    {d.location?.name||'Sem local cadastrado'} · {d.device_type==='radio_app'?'Rádio':'TV'}
                  </p></div>
                <span className='text-xs font-semibold rounded-full bg-blue-50 text-blue-900 px-3 py-1'>
                  {labels[d.status]??d.status}
                </span>
              </div>
              <p className='mt-4 text-xs text-black/60'>Última comunicação: {date(d.last_seen_at)}</p>
              <p className='mt-2 text-xs text-black/60'>
                {d.needs_sync?'Aguardando sincronização de programação.':'Nenhuma sincronização pendente sinalizada.'}
              </p>
              {d.subscription_status&&<p className='mt-2 text-xs text-black/60'>Assinatura: {labels[d.subscription_status]??d.subscription_status}</p>}
              {(['active','trialing'].includes(d.subscription_status??''))&&d.status!=='blocked'&&
                <div className='mt-4 pt-4 border-t border-black/10'>
                  {d.status==='pending_pairing'
                    ? <div className='space-y-3'>
                        <p className='text-xs text-black/60'>Abra o aplicativo Meu Comercial nesta TV ou Rádio, toque em “Gerar código” e informe aqui os 6 dígitos exibidos no aparelho.</p>
                        {scannedPin&&<button type='button' className='text-xs font-semibold text-blue-800 underline'
                          onClick={()=>{setPlayerPinByDevice(old=>({...old,[d.id]:scannedPin}));setScannedPin(null)}}>
                          Usar PIN lido no QR nesta tela: {d.name}
                        </button>}
                        <div className='flex flex-col sm:flex-row gap-2'>
                          <label htmlFor={'player-pin-'+d.id} className='sr-only'>Código mostrado no Player {d.name}</label>
                          <input id={'player-pin-'+d.id} type='text' inputMode='numeric' autoComplete='one-time-code'
                            pattern='[0-9]{6}' maxLength={6} placeholder='PIN do Player'
                            value={playerPinByDevice[d.id]??''}
                            onChange={e=>setPlayerPinByDevice(old=>({...old,[d.id]:e.target.value.replace(/[^0-9]/g,'').slice(0,6)}))}
                            className='min-h-11 rounded-xl border border-black/20 px-4 text-sm tracking-widest w-full sm:w-44'/>
                          <button type='button' disabled={deviceActionBusy!==null||loading||(playerPinByDevice[d.id]??'').length!==6}
                            onClick={()=>void claimFromPlayer(d)}
                            className='min-h-11 px-4 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-50'>
                            {deviceActionBusy===d.id?'Autorizando…':'Conectar este Player'}
                          </button>
                        </div>
                        <button type='button' disabled={deviceActionBusy!==null||loading}
                          onClick={()=>void doDeviceAction('pair-device',d)}
                          className='text-xs text-blue-700 underline'>
                          Pareamento legado: gerar PIN para Player antigo
                        </button>
                      </div>
                    : <button type='button' disabled={deviceActionBusy!==null||loading}
                        onClick={()=>void doDeviceAction('sync-device',d)}
                        className='min-h-11 px-4 py-2.5 border border-blue-700 text-blue-800 rounded-xl text-xs font-bold disabled:opacity-50'>
                        {deviceActionBusy===d.id?'Solicitando…':'Solicitar sincronização'}</button>}
                </div>}
              <button type='button'
                onClick={()=>setDiagnosticsId(current=>current===d.id?null:d.id)}
                className='mt-4 min-h-11 border border-blue-100 text-blue-700 rounded-xl px-4 text-xs font-semibold'>
                {diagnosticsId===d.id?'Fechar diagnóstico':'Ver histórico e diagnóstico'}
              </button>
              {diagnosticsId===d.id&&session&&
                <ClientDeviceDiagnostics key={d.id} token={session.token} deviceId={d.id}/>}
              {pairingPin?.deviceId===d.id&&<div className='mt-4 rounded-xl bg-blue-50 border border-blue-200 p-4' role='status'>
                <p className='text-xs font-semibold text-blue-900'>Código temporário — informe somente no seu Player</p>
                <code className='block mt-2 text-2xl font-bold tracking-widest text-blue-950 select-all'>{pairingPin.pin}</code>
                <p className='text-xs text-blue-800 mt-2'>Válido até {date(pairingPin.expiresAt)}. Não compartilhe fora da instalação.</p>
              </div>}
            </article>):view==='campaigns'?(campaigns?.data??[]).map(c=><article key={c.id}
              className='rounded-xl border border-black/10 p-4 sm:p-5'>
              <h3 className='font-bold text-sm'>{c.title}</h3>
              <p className='text-xs mt-3'>Status: {labels[c.status]??c.status}</p>
              <p className='text-xs text-black/60 mt-2'>
                Criativo: {labels[c.creative_status]??c.creative_status}
              </p>
              <p className='text-xs text-black/60 mt-2'>Solicitado em: {date(c.submitted_at||c.created_at)}</p>
            </article>):view==='services'?(services?.data??[]).map(service=><article key={service.id}
              className='rounded-xl border border-black/10 p-4 sm:p-5'>
              <h3 className='font-bold text-sm'>{service.plan?.name||'Serviço #'+service.id}</h3>
              <p className='text-xs mt-3'>Situação: {labels[service.status]??service.status}</p>
              <p className='text-xs text-black/60 mt-2'>Vigência até: {date(service.expires_at)}</p>
              <p className='text-xs text-black/60 mt-2'>{service.plan?.description||'Consulte o contrato para conhecer os recursos do plano.'}</p>
            </article>):view==='locations'?(locations?.data??[]).map(loc=><article key={loc.id}
              className='rounded-xl border border-black/10 p-4 sm:p-5'>
              <h3 className='font-bold text-sm'>{loc.name}</h3>
              <p className='text-xs text-black/60 mt-3'>{[loc.city,loc.state].filter(Boolean).join(' / ')||'Local sem endereço resumido'}</p>
              <p className='text-xs text-black/60 mt-2'>{loc.is_active?'Ativo':'Inativo'}</p>
            </article>):(media?.data??[]).map(item=><article key={item.id}
              className='rounded-xl border border-black/10 p-4 sm:p-5'>
              <h3 className='font-bold text-sm'>{item.name}</h3>
              <p className='text-xs text-black/60 mt-3'>Formato: {item.type}</p>
              <p className='text-xs text-black/60 mt-2'>Processamento: {labels[item.status]??item.status}</p>
              {item.duration_seconds!==null&&<p className='text-xs text-black/60 mt-2'>Duração: {item.duration_seconds}s</p>}
            </article>)}
          </div>
          {list&&<div className='flex flex-wrap justify-between items-center gap-4 mt-6 border-t border-black/10 pt-5 text-xs'>
            <span> {list.pagination.total.toLocaleString('pt-BR')} registros · Página {list.pagination.page} de {Math.max(1,list.pagination.last_page)}</span>
            <div className='flex gap-2'>
              <button type='button' disabled={page<=1||loading} onClick={()=>setPage(n=>Math.max(1,n-1))}
                className='px-3 py-2.5 border border-black/10 rounded-lg disabled:opacity-40'>Anterior</button>
              <button type='button' disabled={page>=list.pagination.last_page||loading} onClick={()=>setPage(n=>n+1)}
                className='px-3 py-2.5 border border-black/10 rounded-lg disabled:opacity-40 inline-flex items-center gap-2'>
                Próxima <ArrowRight size={14} aria-hidden/>
              </button>
            </div>
          </div>}
        </div>
      </div>}
    </div>}
  </main>
}
