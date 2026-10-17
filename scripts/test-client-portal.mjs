import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {csvCell,buildPlaybackOverviewCsv,isPlaybackOverviewResponse} from '../src/lib/playbackOverview.mjs'
import {isPublicationDeliveryResponse,deliveryFilters} from '../src/lib/publicationDelivery.mjs'
import {isPublicationAttention,publicationSupportBrief} from '../src/lib/publicationAttention.mjs'
const publicationDeliveryModule={isPublicationDeliveryResponse,deliveryFilters}
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const server=read('server.ts')
const portal=read('src/components/ClientPortal.tsx')
const publishing=read('src/components/ClientPublications.tsx')
const studio=read('src/components/ClientStudio.tsx')
const story=read('src/components/ClientStoryEditor.tsx')
const onboarding=read('src/components/ClientOnboarding.tsx')
const targets=read('src/components/ClientPublicationTargets.tsx')
const deviceDiagnostics=read('src/components/ClientDeviceDiagnostics.tsx')
const playbackReports=read('src/components/ClientPlaybackReports.tsx')
const playbackOverview=read('src/components/ClientPlaybackOverview.tsx')
const app=read('src/App.tsx')

test('same-origin portal proxies only twenty-nine allowlisted endpoints',()=>{
  assert.ok(server.includes("app.all('/api/portal/:action'"))
  for(const name of ['login','logout','overview','devices','campaigns','services','locations','media','pair-device','sync-device','claim-device','device-diagnostics','device-reports',
    'publication-options','publication-destinations','publication-history',
    'publication-preview','publication-create','publication-withdraw',
    'studio-catalog','studio-list','studio-create','studio-get','studio-update',
    'studio-activate','studio-duplicate','onboarding','publication-targets','playback-overview']){
    assert.ok(server.includes("'"+name+"': {method:"),name)
  }
  assert.ok(server.includes('req.method !== route.method'))
  assert.ok(server.includes('const endpoint = new URL(deviceAction'))
  assert.ok(server.includes(': route.backend, base)'))
  assert.ok(!server.includes('new URL(req.params.action, base)'))
})
test('portal gateway never forwards arbitrary client_id or cross-tenant filters',()=>{
  assert.ok(server.includes("endpoint.searchParams.set('per_page'"))
  assert.ok(server.includes("endpoint.searchParams.set('page'"))
  assert.ok(!server.includes('req.query.client_id'))
  assert.ok(!server.includes("X-Agency-Tenant"))
})
test('only configured HTTPS backend can receive credentials in production',()=>{
  assert.ok(server.includes("base.protocol !== 'https:'"))
  assert.ok(server.includes("process.env.NODE_ENV !== 'production'"))
  assert.ok(server.includes("redirect: 'error'"))
  assert.ok(server.includes("signal: AbortSignal.timeout(12000)"))
})
test('portal does not persist client JWT and never uses admin JWT',()=>{
  assert.ok(portal.includes('useState<Session|null>(null)'))
  assert.ok(portal.includes("Authorization:'Bearer '+token"))
  assert.ok(portal.includes("credentials:'omit'"))
  assert.ok(!portal.includes('localStorage.setItem'))
  assert.ok(!portal.includes('sessionStorage.setItem'))
  assert.ok(!portal.includes("X-Agency-Tenant"))
})
test('client login success depends on real API JWT and identity',()=>{
  assert.ok(portal.includes("portalRequest<{"))
  assert.ok(portal.includes('data.access_token'))
  assert.ok(portal.includes('data.client?.id'))
  assert.ok(portal.includes('setSession({token:data.access_token,client:data.client})'))
})
test('session is cleared on expired JWT and logout calls backend',()=>{
  assert.ok(portal.includes("portalRequest('logout',token,{method:'POST'})"))
  assert.ok(portal.includes("clearSession();setError('Sessão encerrada. Entre novamente.')"))
  assert.ok(portal.includes('setPassword(\'\')'))
})
test('portal keeps subscription, devices and campaigns separately',()=>{
  for(const name of ['services','devices','campaigns','locations','media']){
    assert.ok(portal.includes("changeView('"+name+"')"))
  }
  assert.ok(portal.includes("portalRequest<Page<Service>>('services'"))
  assert.ok(portal.includes("portalRequest<Page<Device>>('devices'"))
  assert.ok(portal.includes("portalRequest<Page<Campaign>>('campaigns'"))
  assert.ok(portal.includes("portalRequest<Page<Location>>('locations'"))
  assert.ok(portal.includes("portalRequest<Page<Media>>('media'"))
})
test('server counts not derived from first page',()=>{
  assert.ok(portal.includes('overview?.devices.total'))
  assert.ok(portal.includes('list.pagination.total'))
  assert.ok(!portal.includes('devices?.data.length || 0'))
})
test('no real audience claim from Player heartbeats',()=>{
  assert.ok(portal.includes('não comprovam reprodução ou audiência'))
  assert.ok(portal.includes('não garante automaticamente inserções concluídas'))
})
test('route and navigation are available in desktop and mobile',()=>{
  assert.ok(app.includes("window.location.pathname === '/portal'"))
  assert.ok((app.match(/href="\/portal"/g)||[]).length>=2)
  assert.ok(app.includes('<ClientPortal />'))
})
test('responsive layout has pagination, empty and error states',()=>{
  assert.ok(portal.includes('grid-cols-1 md:grid-cols-2'))
  assert.ok(portal.includes('grid-cols-2 lg:grid-cols-4'))
  assert.ok(portal.includes("role='alert'"))
  assert.ok(portal.includes("role='status'"))
  assert.ok(portal.includes('list?.data.length===0'))
  assert.ok(portal.includes('setPage(n=>n+1)'))
})
test('no ROI percentages or free-text logs remain in strategic consultant',()=>{
  assert.equal((server.match(/#### 3\. ROI Estimado/g)||[]).length,0)
  assert.ok(!server.includes('console.log(`Recebida consulta'))
  assert.ok(server.includes('Nenhum percentual de vendas'))
})

test('device action proxy limits both methods and numeric ID, without trusting tenant inputs',()=>{
  assert.ok(server.includes("'pair-device': {method: 'POST'"))
  assert.ok(server.includes("'sync-device': {method: 'POST'"))
  assert.ok(server.includes('Number.isSafeInteger(normalizedDeviceId)'))
  assert.ok(server.includes("action === 'pair-device' ? '/pairing-pin' : action === 'claim-device' ? '/claim-pairing' : action === 'device-diagnostics' ? '/diagnostics' : action === 'device-reports' ? '/playback-reports' : '/sync'"))
  assert.ok(!server.includes('req.body?.client_id'))
  assert.ok(!server.includes('req.body?.agency_id'))
  assert.ok(portal.includes("body:{device_id:String(device.id)}"))
})
test('temporary PIN never persists and async responses respect the active session',()=>{
  assert.ok(portal.includes('activeToken.current!==token'))
  assert.ok(portal.includes('setPairingPin(null)'))
  assert.ok(portal.includes('setPairingPin({deviceId:device.id'))
  assert.ok(portal.includes('response.data.pin'))
  assert.ok(!portal.includes('localStorage.setItem'))
  assert.ok(!portal.includes('sessionStorage.setItem'))
  assert.ok(portal.includes("doDeviceAction('pair-device',d)"))
})
test('client controls require a valid service and do not falsely claim completed playback',()=>{
  assert.ok(portal.includes("['active','trialing'].includes(d.subscription_status??'')"))
  assert.ok(portal.includes("doDeviceAction('sync-device',d)"))
  assert.ok(portal.includes('A execução depende da próxima comunicação do Player'))
  assert.ok(portal.includes("d.status==='pending_pairing'"))
  assert.ok(portal.includes("role='status' aria-live='polite'"))
})

test('publishing BFF proxies only fixed backend routes and never trusts tenant identifiers from query',()=>{
  for(const action of ['publication-options','publication-destinations','publication-history',
    'publication-preview','publication-create','publication-withdraw']){
    assert.ok(server.includes("'"+action+"': {method:"),action)
  }
  assert.ok(server.includes('Number.isSafeInteger(publicationId)'))
  assert.ok(server.includes("req.query.medium"))
  assert.ok(server.includes("action === 'publication-destinations'"))
  assert.ok(server.includes("agency_tenant_id: req.body?.agency_tenant_id"))
  assert.ok(!server.includes('endpoint.searchParams.set(\'client_id\''))
  assert.ok(!server.includes('req.body?.client_id'))
  assert.ok(!server.includes("new URL(req.body"))
})
test('publishing is an authenticated area not an admin/agency panel',()=>{
  assert.ok(portal.includes("import ClientPublications from './ClientPublications'"))
  assert.ok(portal.includes("? <ClientPublications key="))
  assert.ok(portal.includes("changeView('publications')"))
  assert.ok(publishing.includes('Authorization:\'Bearer \'+token'))
  assert.ok(publishing.includes("credentials:'omit'"))
  assert.ok(publishing.includes("cache:'no-store'"))
  assert.ok(!publishing.includes('localStorage.setItem'))
  assert.ok(!publishing.includes('sessionStorage.setItem'))
})
test('publication validates first; an unchanged UUID survives network retry',()=>{
  assert.ok(publishing.includes("action:Action"))
  assert.ok(publishing.includes("publication-preview',token,{method:'POST'"))
  assert.ok(publishing.includes("publication-create',token,{method:'POST'"))
  assert.ok(publishing.includes('preview?.signature!==signature'))
  assert.ok(publishing.includes('pendingRequest.current?.signature!==signature'))
  assert.ok(publishing.includes('crypto.randomUUID()'))
  assert.ok(publishing.includes("setPreview(null)"))
})
test('selection is bounded, account/format constrained and readable on mobile',()=>{
  assert.ok(publishing.includes("previous.length<100"))
  assert.ok(publishing.includes("chosenPlaylist?.kind===medium"))
  assert.ok(publishing.includes("!device.available"))
  assert.ok(publishing.includes("grid grid-cols-1 sm:grid-cols-2"))
  assert.ok(publishing.includes('role=\'alert\''))
  assert.ok(publishing.includes("publication-withdraw',token,{method:'POST'"))
  assert.ok(publishing.includes("A interrupção ocorrerá após sincronização"))
})

test('all Simple Studio BFF operations are fixed and neither JWT nor paths can be overridden',()=>{
  for(const name of ['studio-catalog','studio-list','studio-create','studio-get',
    'studio-update','studio-activate','studio-duplicate','onboarding','publication-targets']){
    assert.ok(server.includes("'"+name+"': {method:"),name)
  }
  assert.ok(server.includes('Number.isSafeInteger(studioPlaylistId)'))
  assert.ok(server.includes('Number.isSafeInteger(targetId)'))
  assert.ok(server.includes("expected_revision: req.body?.expected_revision"))
  assert.ok(!server.includes('req.query.client_id'))
  assert.ok(!server.includes('req.body?.client_id'))
  assert.ok(server.includes("['tv','radio'].includes(String(req.query.kind))"))
})
test('device actions normalize numeric text IDs from the existing portal UI',()=>{
  assert.ok(portal.includes('body:{device_id:String(device.id)}'))
  assert.ok(server.includes("typeof rawId === 'string'"))
  assert.ok(server.includes('Number.isSafeInteger(normalizedDeviceId)'))
  assert.ok(server.includes("'client/indoor/devices/' + normalizedDeviceId"))
})
test('the portal navigation persists across Studio and Publications views',()=>{
  assert.ok(portal.includes("import ClientStudio from './ClientStudio'"))
  assert.ok(portal.includes("import ClientOnboarding from './ClientOnboarding'"))
  assert.ok(portal.includes("view==='studio'"))
  assert.ok(portal.includes("onNavigate={changeView}"))
  assert.ok(portal.includes("onPublish={selection=>"))
  assert.ok(portal.includes("initialSelection={publishFromStudio}"))
  const positionNav=portal.indexOf("aria-label='Consulta do portal'")
  const positionView=portal.indexOf("view==='studio'\n")
  assert.ok(positionNav>=0&&positionNav<positionView)
})
test('Studio saves drafts before activation and never reuses the Admin JWT',()=>{
  assert.ok(studio.includes('expected_revision:revision'))
  assert.ok(studio.includes("status!=='draft'"))
  assert.ok(studio.includes("studio-activate',token"))
  assert.ok(studio.includes("studio-duplicate',token"))
  assert.ok(studio.includes("studio-create',token"))
  assert.ok(studio.includes("editing?'studio-update':'studio-create'"))
  assert.ok(studio.includes('previous.length')===false)
  assert.ok(studio.includes('items.length>=30'))
  assert.ok(!studio.includes('localStorage.setItem'))
  assert.ok(!studio.includes('X-Agency-Tenant'))
  assert.ok(studio.includes('credentials:\'omit\''))
})
test('Radio Studio segregates licensed songs from own spots and pages the catalog',()=>{
  assert.ok(studio.includes("'commercial_spot'"))
  assert.ok(studio.includes("setRadioSource('music')"))
  assert.ok(studio.includes("source:kind==='radio'?radioSource:undefined"))
  assert.ok(studio.includes("Músicas licenciadas"))
  assert.ok(studio.includes("Spots próprios"))
  assert.ok(studio.includes('setCatalogPage'))
})
test('onboarding and publication monitoring never equate operational state to playback',()=>{
  assert.ok(onboarding.includes("configuration")===false)
  assert.ok(onboarding.includes('onNavigate(step.view)'))
  assert.ok(onboarding.includes("role='progressbar'"))
  assert.ok(targets.includes('playback_confirmed:false'))
  assert.ok(targets.includes('não equivale a recebimento, exibição ou audiência comprovada'))
  assert.ok(publishing.includes('ClientPublicationTargets'))
  assert.ok(!targets.includes('device_token'))
})

test('upload binary gateway is fixed and bounded',()=>{
  assert.ok(server.includes("app.post('/api/portal/studio-upload'"))
  assert.ok(server.includes("express.raw({type: ['image/jpeg','image/png','video/mp4'], limit: '24mb'})"))
  assert.ok(server.includes('Buffer.isBuffer(req.body)'))
  assert.ok(server.includes("new URL('client/indoor/studio/media/upload',base)"))
  assert.ok(server.includes('Authorization:bearer'))
  assert.ok(server.includes("req.get('x-studio-name')"))
})
test('upload UI transmits only MIME bytes and display name',()=>{
  assert.ok(studio.includes("fetch('/api/portal/studio-upload'"))
  assert.ok(studio.includes('body:file'))
  assert.ok(studio.includes("'X-Studio-Name':encodeURIComponent(title)"))
  assert.ok(studio.includes('file.size>24*1024*1024'))
  assert.ok(!studio.includes('localStorage.setItem'))
})
test('visual Story API validates numeric IDs and explicit fields',()=>{
  assert.ok(server.includes("'studio-story-get': {method: 'GET'"))
  assert.ok(server.includes("'studio-story-update': {method: 'PUT'"))
  assert.ok(server.includes('numericId(storyRawPlaylist)'))
  assert.ok(server.includes('numericId(storyRawItem)'))
  assert.ok(server.includes('layout:req.body?.layout'))
})
test('visual builder is a bounded Player layout and no arbitrary HTML',()=>{
  assert.ok(story.includes("type Element={id:string;type:'text'|'band'"))
  assert.ok(story.includes('version:1,elements:'))
  assert.ok(story.includes('studio-headline'))
  assert.ok(story.includes('studio-band'))
  assert.ok(story.includes("fetch('/api/portal/studio-story-update'"))
  assert.ok(story.includes('expected_revision:revision'))
  assert.ok(!story.includes('dangerouslySetInnerHTML'))
  assert.ok(!story.includes('localStorage'))
})
test('scene editor is shown only for persisted own TV draft items',()=>{
  assert.ok(studio.includes("import ClientStoryEditor from './ClientStoryEditor'"))
  assert.ok(studio.includes("kind==='tv'&&item.id&&selectedId&&status==='draft'"))
  assert.ok(studio.includes('itemId={item.id}'))
})

test('Player-initiated pairing uses fixed owner-scoped gateway and temporary PIN',()=>{
  assert.ok(server.includes("'claim-device': {method: 'POST'"))
  assert.ok(server.includes("action === 'claim-device'"))
  assert.ok(server.includes("? {pin: req.body?.pin}"))
  assert.ok(server.includes("'/claim-pairing'"))
  assert.ok(server.includes('Number.isSafeInteger(normalizedDeviceId)'))
  assert.ok(portal.includes("portalRequest<{data:{device_id:number;paired:boolean;status:string}}>("))
  assert.ok(portal.includes("'claim-device',token,{method:'POST'"))
  assert.ok(portal.includes("pattern='[0-9]{6}'"))
  assert.ok(portal.includes("replace(/[^0-9]/g,'')"))
  assert.ok(portal.includes('Conectar este Player'))
  assert.ok(!portal.includes('setItem(\'device_token\''))
})
test('per-device operations present authenticated sync evidence but not audience proof',()=>{
  assert.ok(targets.includes('sync_acknowledged:boolean'))
  assert.ok(targets.includes('sync_acknowledged_at:string|null'))
  assert.ok(targets.includes('Manifesto confirmado pelo Player (protocolo v2)'))
  assert.ok(targets.includes('não equivale a recebimento, exibição ou audiência comprovada'))
  assert.ok(targets.includes('playback_confirmed:false'))
})

test('owner-only diagnostic view uses a numeric device identifier and never forwards secrets',()=>{
  assert.ok(server.includes("'device-diagnostics': {method: 'GET'"))
  assert.ok(server.includes("(action === 'device-diagnostics' || action === 'device-reports') ? req.query.device_id"))
  assert.ok(server.includes("'/diagnostics'"))
  assert.ok(server.includes('Number.isSafeInteger(normalizedDeviceId)'))
  assert.ok(portal.includes("import ClientDeviceDiagnostics from './ClientDeviceDiagnostics'"))
  assert.ok(portal.includes("diagnosticsId===d.id&&session"))
  assert.ok(deviceDiagnostics.includes("fetch(url,{"))
  assert.ok(deviceDiagnostics.includes("Authorization:'Bearer '+token"))
  assert.ok(!deviceDiagnostics.includes('device_token'))
  assert.ok(!deviceDiagnostics.includes('localStorage'))
  assert.ok(!deviceDiagnostics.includes('ip_address'))
})
test('support view displays historical command and sync ACK separately from audience',()=>{
  assert.ok(deviceDiagnostics.includes('sync_logs:Log[];commands:Command[]'))
  assert.ok(deviceDiagnostics.includes('manifest_version'))
  assert.ok(deviceDiagnostics.includes('não') || deviceDiagnostics.includes('Não'))
  assert.ok(deviceDiagnostics.includes('Não são auditoria independente de reprodução ou audiência'))
  assert.ok(deviceDiagnostics.includes("role='alert'"))
})

test('own-TV completion telemetry is client-scoped and not mislabeled as certified audience',()=>{
  assert.ok(deviceDiagnostics.includes('own_playback_reported_24h:number'))
  assert.ok(deviceDiagnostics.includes('own_playback_events:OwnEvent[]'))
  assert.ok(deviceDiagnostics.includes('playlist_item_id'))
  assert.ok(deviceDiagnostics.includes('event_uuid'))
  assert.ok(deviceDiagnostics.includes('relatos autenticados do próprio Player'))
  assert.ok(deviceDiagnostics.includes('não uma certificação independente'))
  assert.ok(!deviceDiagnostics.includes('device_token'))
  assert.ok(!deviceDiagnostics.includes('ip_address'))
})

test('QR pairing fragment is consumed once, wiped from address, and never auto-claims a device',()=>{
  assert.ok(portal.includes("const match=/^#pair=([0-9]{6})$/"))
  assert.ok(portal.includes("window.history.replaceState(window.history.state"))
  assert.ok(portal.includes("setScannedPin(match[1])"))
  assert.ok(portal.includes("Usar PIN lido no QR nesta tela"))
  assert.ok(portal.includes("setScannedPin(null)"))
  assert.ok(portal.includes("'claim-device',token"))
  assert.ok(!portal.includes("fetch('https://api.qrserver.com"))
})
test('radio audit identifies owned institutional spots without claiming independent audience',()=>{
  assert.ok(deviceDiagnostics.includes('Spot institucional de Rádio'))
  assert.ok(deviceDiagnostics.includes('relatos autenticados do próprio Player'))
  assert.ok(!deviceDiagnostics.includes('playback_confirmed:true'))
})

test('owner-only playback reports use fixed BFF path and bounded filters',()=>{
  assert.ok(server.includes("'device-reports': {method: 'GET'"))
  assert.ok(server.includes("action === 'device-reports' ? '/playback-reports'"))
  assert.ok(server.includes("['1','7','30'].includes"))
  assert.ok(server.includes("['all','tv','radio'].includes"))
  assert.ok(server.includes("endpoint.searchParams.set('days'"))
  assert.ok(server.includes("endpoint.searchParams.set('kind'"))
  assert.ok(server.includes('Number.isSafeInteger(normalizedDeviceId)'))
  assert.ok(!server.includes('req.query.client_id'))
})
test('responsive client ledger pages reports and refuses to certify device claims as audience',()=>{
  assert.ok(deviceDiagnostics.includes("import ClientPlaybackReports from './ClientPlaybackReports'"))
  assert.ok(deviceDiagnostics.includes('reportsOpen&&<ClientPlaybackReports'))
  assert.ok(playbackReports.includes("fetch(url,{method:'GET'"))
  assert.ok(playbackReports.includes("Authorization:'Bearer '+token"))
  assert.ok(playbackReports.includes("url.searchParams.set('device_id'"))
  assert.ok(playbackReports.includes('setDays(Number(e.target.value) as Days);setPage(1)'))
  assert.ok(playbackReports.includes('setKind(e.target.value as Kind);setPage(1)'))
  assert.ok(playbackReports.includes("onClick={()=>setPage(n=>n+1)}"))
  assert.ok(playbackReports.includes('CSV desta página'))
  assert.ok(playbackReports.includes("const safe=/^[\\s]*[=+\\-@\\t\\r]/"))
  assert.ok(playbackReports.includes('não') || playbackReports.includes('Não'))
  assert.ok(!playbackReports.includes('localStorage'))
  assert.ok(!playbackReports.includes('device_token'))
})

test('daily UTC playback trend is client-scoped, mobile scrollable and independent of current CSV page',()=>{
  assert.ok(playbackReports.includes("by_day:Daily[];bucket_timezone:'UTC'"))
  assert.ok(playbackReports.includes("result.summary.by_day.map(day=>"))
  assert.ok(playbackReports.includes("max-h-72 overflow-y-auto"))
  assert.ok(playbackReports.includes("maxDaily = Math.max(1"))
  assert.ok(playbackReports.includes("não apenas a página atual"))
  assert.ok(playbackReports.includes("não confirma equipamento desligado"))
  assert.ok(!playbackReports.includes("localStorage.setItem"))
  assert.ok(!playbackReports.includes("req.query.client_id"))
})

test('onboarding prioritizes the next verified action, not a simulated completion',()=>{
  assert.ok(onboarding.includes('next_action?:Pick<Step'))
  assert.ok(onboarding.includes('onNavigate(nextAction.view)'))
  assert.ok(onboarding.includes('nextAction.guidance'))
  assert.ok(onboarding.includes("role='status' aria-live='polite'"))
  assert.ok(onboarding.includes('recent_player_reports_7d'))
  assert.ok(onboarding.includes('last_player_reported_at'))
  assert.ok(onboarding.includes('não auditoria independente de audiência'))
  assert.ok(onboarding.includes('refreshKey'))
  assert.ok(portal.includes("refreshKey={view+'-'+refresh}"))
  assert.ok(!onboarding.includes('localStorage'))
  assert.ok(!onboarding.includes('sessionStorage'))
})

test('network-level playback reports use fixed owner-only proxy with constrained filters',()=>{
  assert.ok(server.includes("'playback-overview': {method: 'GET', backend: 'client/indoor/playback-summary', auth: true}"))
  assert.ok(server.includes("action === 'playback-overview'"))
  assert.ok(server.includes("action === 'device-reports' || action === 'playback-overview'"))
  assert.ok(server.includes("['1','7','30'].includes"))
  assert.ok(server.includes("['all','tv','radio'].includes"))
  assert.ok(!server.includes("req.query.client_id"))
  assert.ok(!server.includes('req.body?.client_id'))
})
test('owner-wide playback component uses server aggregates and explicit daily evidence',()=>{
  assert.ok(portal.includes("import ClientPlaybackOverview from './ClientPlaybackOverview'"))
  assert.ok(portal.includes("view==='devices'&&<ClientPlaybackOverview"))
  assert.ok(playbackOverview.includes("fetch(url,{method:'GET'"))
  assert.ok(playbackOverview.includes("Authorization:'Bearer '+token"))
  assert.ok(playbackOverview.includes("credentials:'omit',cache:'no-store'"))
  assert.ok(playbackOverview.includes('summary?.devices_total'))
  assert.ok(playbackOverview.includes('summary?.devices_with_reports'))
  assert.ok(playbackOverview.includes('summary.by_day.map'))
  assert.ok(playbackOverview.includes('data.pagination.last_page'))
  assert.ok(playbackOverview.includes('não comprovam audiência independente'))
  assert.ok(!playbackOverview.includes('device_token'))
  assert.ok(!playbackOverview.includes('localStorage'))
  assert.ok(!playbackOverview.includes('sessionStorage'))
})


test('player summary runtime guard rejects malformed or confidential contract shapes',()=>{
  const row={device_id:11,name:'Tela loja',device_type:'tv_app',reports_total:2,
    operational_status:'online',last_seen_at:'2026-10-16T19:00:00Z',
    last_reported_at:'2026-10-16T19:00:00Z',by_type:{image:1,video:1,audio:0}}
  const fixture={
    data:[row],summary:{days:7,kind:'all',attention:'all',bucket_timezone:'UTC',
      attention_counts:{blocked:0,unpaired:0,offline:0,sync_pending:0,no_reports:19},
      devices_total:20,devices_with_reports:1,reports_total:2,
      by_type:{image:1,video:1,audio:0},
      by_day:[{date:'2026-10-16',total:2}],
      evidence:'authenticated_player_report_not_independent_audience'},
    pagination:{page:1,last_page:2,per_page:12,total:20}
  }
  assert.equal(isPlaybackOverviewResponse(fixture),true)
  assert.equal(isPlaybackOverviewResponse({...fixture,data:[{...row,device_id:'11'}]}),false)
  assert.equal(isPlaybackOverviewResponse({...fixture,summary:{...fixture.summary,evidence:'independent_audience_verified'}}),false)
  assert.equal(isPlaybackOverviewResponse({...fixture,summary:{...fixture.summary,by_day:null}}),false)
  assert.equal(isPlaybackOverviewResponse({...fixture,pagination:{...fixture.pagination,page:0}}),false)
  assert.equal(isPlaybackOverviewResponse({...fixture,data:Array(13).fill(row)}),false)
  assert.equal(isPlaybackOverviewResponse({...fixture,data:[{...row,by_type:{image:-1,video:1,audio:0}}]}),false)
})

test('CSV export includes only visible fields and neutralizes hostile names',()=>{
  const row={device_id:11,name:' =HYPERLINK("https://test.invalid";"click")',
    device_type:'tv_app',operational_status:'online',last_seen_at:null,reports_total:3,
    by_type:{image:2,video:1,audio:0},last_reported_at:null,
    device_token:'NEVER_IN_CSV',client_id:555,storage_path:'private/secret'}
  const csv=buildPlaybackOverviewCsv([row])
  assert.ok(csv.startsWith('\uFEFF"Dispositivo";'))
  assert.ok(csv.includes("\"' =HYPERLINK(\"\"https://test.invalid\"\";\"\"click\"\")\""))
  assert.ok(csv.includes('"tv_app";"online";"3";"2";"1";"0";"";""'))
  assert.equal(csv.trim().split('\r\n').length,2)
  for (const secret of ['NEVER_IN_CSV','private/secret','client_id','device_token']) {
    assert.ok(!csv.includes(secret),secret)
  }
  assert.equal(csvCell('@cmd'),"\"'@cmd\"")
  assert.equal(csvCell('  +SUM(1;2)'),"\"'  +SUM(1;2)\"")
  assert.equal(csvCell('Tela\nfalsa'),'"Tela falsa"')
})

test('network overview exposes authenticated drilldown only on explicit request',()=>{
  assert.ok(playbackOverview.includes("import ClientDeviceDiagnostics from './ClientDeviceDiagnostics'"))
  assert.ok(playbackOverview.includes('isPlaybackOverviewResponse(payload)'))
  assert.ok(playbackOverview.includes("selectedDeviceId!==null&&data.data.some"))
  assert.ok(playbackOverview.includes('<ClientDeviceDiagnostics key={selectedDeviceId}'))
  assert.ok(playbackOverview.includes('buildPlaybackOverviewCsv(data.data)'))
  assert.ok(playbackOverview.includes('CSV desta página'))
  assert.ok(playbackOverview.includes('setSelectedDeviceId(null)'))
  assert.ok(!playbackOverview.includes('localStorage.setItem'))
})


test('authenticated network attention contract is scoped, filtered and reset on navigation',()=>{
  assert.ok(server.includes("['all','blocked','unpaired','offline','sync_pending','no_reports'].includes"))
  assert.ok(server.includes("endpoint.searchParams.set('attention', String(req.query.attention ?? 'all'))"))
  assert.ok(!server.includes("req.query.client_id"))
  assert.ok(playbackOverview.includes("url.searchParams.set('attention',attention)"))
  assert.ok(playbackOverview.includes("id='playback-attention'"))
  assert.ok(playbackOverview.includes('summary.attention_counts[key]'))
  assert.ok(playbackOverview.includes('device.operational_status'))
  assert.ok(playbackOverview.includes('setSelectedDeviceId(null)'))
  assert.ok(playbackOverview.includes('setPage(1)'))
  assert.ok(playbackOverview.includes('Indicadores de toda a rede autorizada'))
})

test('attention validator rejects unsupported statuses, counterfeit counts and cross-contract fields',()=>{
  const row={device_id:1,name:'TV',device_type:'tv_app',reports_total:0,
    operational_status:'unpaired',last_seen_at:null,last_reported_at:null,
    by_type:{image:0,video:0,audio:0}}
  const summary={days:7,kind:'all',attention:'unpaired',bucket_timezone:'UTC',
    devices_total:1,devices_with_reports:0,reports_total:0,
    by_type:{image:0,video:0,audio:0},
    attention_counts:{blocked:0,unpaired:1,offline:0,sync_pending:0,no_reports:1},
    by_day:[{date:'2026-10-16',total:0}],
    evidence:'authenticated_player_report_not_independent_audience'}
  const valid={data:[row],summary,pagination:{page:1,last_page:1,per_page:12,total:1}}
  assert.equal(isPlaybackOverviewResponse(valid),true)
  assert.equal(isPlaybackOverviewResponse({...valid,data:[{...row,operational_status:'approved_audience'}]}),false)
  assert.equal(isPlaybackOverviewResponse({...valid,summary:{...summary,attention:'all_networks'}}),false)
  assert.equal(isPlaybackOverviewResponse({...valid,summary:{...summary,attention_counts:{...summary.attention_counts,offline:-4}}}),false)
  assert.equal(isPlaybackOverviewResponse({...valid,data:[{...row,last_seen_at:[]}]}),false)
})


test('assisted recovery is tied to authenticated, explicitly confirmed idempotent sync',()=>{
  assert.ok(deviceDiagnostics.includes("recovery.code==='sync_required'"))
  assert.ok(deviceDiagnostics.includes('recovery.can_request_sync'))
  assert.ok(deviceDiagnostics.includes('!confirmSync'))
  assert.ok(deviceDiagnostics.includes("onClick={()=>void requestSync()}"))
  assert.ok(deviceDiagnostics.includes("onClick={()=>setConfirmSync(false)}"))
  assert.ok(deviceDiagnostics.includes("method:'POST'"))
  assert.ok(deviceDiagnostics.includes("Authorization:'Bearer '+token"))
  assert.ok(deviceDiagnostics.includes("credentials:'omit',cache:'no-store'"))
  assert.ok(deviceDiagnostics.includes("body:JSON.stringify({device_id:String(deviceId)})"))
  assert.ok(deviceDiagnostics.includes("response.status!==202"))
  assert.ok(deviceDiagnostics.includes("payload?.data?.device_id!==deviceId"))
  assert.ok(deviceDiagnostics.includes("command_queued_not_player_ack"))
  assert.ok(deviceDiagnostics.includes("payload.data.already_pending"))
  assert.ok(deviceDiagnostics.includes('não garante recebimento imediato ou reprodução'))
  assert.ok(deviceDiagnostics.includes('Aguarde a confirmação real do Player'))
  assert.ok(!deviceDiagnostics.includes('localStorage'))
  assert.ok(!deviceDiagnostics.includes('sessionStorage'))
  assert.ok(!deviceDiagnostics.includes('device_token'))
})

test('recovery UI is shared by fleet and device lists, refreshing both after an action',()=>{
  assert.ok(playbackOverview.includes('setRecoveryNotice('))
  assert.ok(playbackOverview.includes('onUpdated={()=>{setRecoveryNotice('))
  assert.ok(portal.includes("setDeviceActionMessage('Sincronização solicitada."))
  assert.ok(deviceDiagnostics.includes('onUpdated?.()'))
  assert.ok(deviceDiagnostics.includes('setReload(n=>n+1)'))
  assert.ok(deviceDiagnostics.includes("recovery.pending_sync_command"))
  assert.ok(deviceDiagnostics.includes("recovery.can_request_pairing_pin"))
  assert.ok(deviceDiagnostics.includes("role='alert'"))
  assert.ok(server.includes("'sync-device': {method: 'POST', backend: 'client/indoor/devices/', auth: true}"))
  assert.ok(!server.includes('req.query.client_id'))
})

test('publication delivery counts are validated across the full fleet, not only the filtered page',()=>{
  const row={device_id:3,name:'TV recepção',connected_recently:true,needs_sync:false,
    last_seen_at:'2026-10-16T12:00:00Z',last_sync_at:null,requested_manifest_version:7,
    current_manifest_version:7,operational_state:'no_pending_sync_reported',playback_confirmed:false,
    sync_acknowledged:true,sync_acknowledged_at:'2026-10-16T12:05:00Z',sync_evidence:'player_reported_protocol_v2',
    own_playback_reported:true,first_own_playback_reported_at:'2026-10-16T12:06:00Z',
    own_playback_evidence:'authenticated_player_report_not_independent_audience',
    attention:{code:'reported',level:'neutral',title:'Relato recebido',guidance:'Monitorar.',
      needs_attention:false,evidence:'operational_triage_not_verified_playback'}}
  const response={data:[row],
    summary:{targets:21,sync_acknowledged_total:4,awaiting_player_ack:17,
      own_playback_reported_devices:3,awaiting_own_playback_report:18,
      recently_connected:5,unavailable:3,sync_pending_flagged:9,
      needs_attention:2,attention_grace_minutes:10,attention_evidence:'operational_triage_not_verified_playback',
      delivery:'acknowledged',publication_status:'published',playback_confirmed:false},
    pagination:{page:1,per_page:20,last_page:1,total:4},
    evidence:'device_reported_sync_v2_not_independent_playback'}
  assert.equal(isPublicationDeliveryResponse(response,'acknowledged'),true)
  assert.equal(isPublicationDeliveryResponse({...response,summary:{...response.summary,awaiting_player_ack:16}},'acknowledged'),false)
  assert.equal(isPublicationDeliveryResponse({...response,summary:{...response.summary,delivery:'offline'}},'acknowledged'),false)
  assert.equal(isPublicationDeliveryResponse({...response,summary:{...response.summary,sync_pending_flagged:22}},'acknowledged'),false)
  assert.equal(isPublicationDeliveryResponse({...response,summary:{...response.summary,playback_confirmed:true}},'acknowledged'),false)
  assert.equal(isPublicationDeliveryResponse({...response,data:[{...row,sync_acknowledged:true,sync_evidence:'not_reported'}]},'acknowledged'),false)
  assert.equal(isPublicationDeliveryResponse({...response,data:[{...row,playback_confirmed:true}]},'acknowledged'),false)
  assert.deepEqual(deliveryFilters,['all','acknowledged','awaiting_ack','offline','sync_pending','playback_reported','awaiting_playback_report','needs_attention'])
})
test('delivery UI sends an allowlisted filter via authenticated BFF and does not infer playback from ACK',()=>{
  assert.ok(server.includes("'publication-targets': {method: 'GET'"))
  assert.ok(server.includes("['all','acknowledged','awaiting_ack','offline','sync_pending','playback_reported','awaiting_playback_report','needs_attention'].includes"))
  assert.ok(server.includes("endpoint.searchParams.set('delivery', String(req.query.delivery ?? 'all'))"))
  assert.ok(!server.includes('req.query.client_id'))
  assert.ok(targets.includes("url.searchParams.set('delivery',delivery)"))
  assert.ok(targets.includes('isPublicationDeliveryResponse(payload,delivery)'))
  assert.ok(targets.includes('sync_acknowledged_total'))
  assert.ok(targets.includes('own_playback_reported_devices'))
  assert.ok(targets.includes('first_own_playback_reported_at'))
  assert.ok(targets.includes('awaiting_player_ack'))
  assert.ok(targets.includes('recently_connected'))
  assert.ok(targets.includes('data.pagination.total'))
  assert.ok(targets.includes('setDelivery(event.target.value as Delivery);setPage(1)'))
  assert.ok(targets.includes('ACK v2 confirma somente a sincronização'))
  assert.ok(!targets.includes('device_token'))
  assert.ok(!targets.includes('localStorage'))
})

test('own playback first-report contract is separate from manifest ACK and counterfeit audience',()=>{
  const {isPublicationDeliveryResponse:isValid}=publicationDeliveryModule
  const row={device_id:4,name:'TV caixa',connected_recently:true,needs_sync:false,
    sync_acknowledged:false,sync_acknowledged_at:null,sync_evidence:'not_reported',
    requested_manifest_version:5,current_manifest_version:5,
    own_playback_reported:true,first_own_playback_reported_at:'2026-10-16T12:00:00Z',
    own_playback_evidence:'authenticated_player_report_not_independent_audience',
    operational_state:'no_pending_sync_reported',playback_confirmed:false,
    attention:{code:'reported',level:'neutral',title:'Relato recebido',guidance:'Monitorar.',
      needs_attention:false,evidence:'operational_triage_not_verified_playback'}}
  const sample={data:[row],summary:{targets:5,sync_acknowledged_total:0,awaiting_player_ack:5,
    own_playback_reported_devices:1,awaiting_own_playback_report:4,
    sync_pending_flagged:0,recently_connected:1,unavailable:0,
    needs_attention:0,attention_grace_minutes:10,attention_evidence:'operational_triage_not_verified_playback',
    delivery:'playback_reported',publication_status:'published',playback_confirmed:false},
    pagination:{page:1,per_page:20,last_page:1,total:1},
    evidence:'device_reported_sync_v2_not_independent_playback'}
  assert.equal(isValid(sample,'playback_reported'),true)
  assert.equal(isValid({...sample,summary:{...sample.summary,own_playback_reported_devices:6}},'playback_reported'),false)
  assert.equal(isValid({...sample,summary:{...sample.summary,awaiting_own_playback_report:2}},'playback_reported'),false)
  assert.equal(isValid({...sample,data:[{...row,first_own_playback_reported_at:null}]},'playback_reported'),false)
  assert.equal(isValid({...sample,data:[{...row,own_playback_evidence:'verified_real_audience'}]},'playback_reported'),false)
  assert.equal(isValid({...sample,data:[{...row,playback_confirmed:true}]},'playback_reported'),false)
  assert.equal(isValid({...sample,summary:{...sample.summary,delivery:'awaiting_playback_report'}},'playback_reported'),false)
  assert.ok(server.includes("'playback_reported','awaiting_playback_report'"))
  assert.ok(targets.includes('Relato autenticado de conclusão de conteúdo próprio'))
})

test('publication first-play monitor refreshes in foreground without misleading delivery guarantees',()=>{
  assert.ok(targets.includes("data.summary.publication_status!=='published'"))
  assert.ok(targets.includes('data.summary.awaiting_own_playback_report===0'))
  assert.ok(targets.includes('window.setInterval('))
  assert.ok(targets.includes("document.visibilityState==='visible'"))
  assert.ok(targets.includes('},45000)'))
  assert.ok(targets.includes('window.clearInterval(timer)'))
  assert.ok(targets.includes('Relato de execução recebido'))
  assert.ok(targets.includes('Sem relato desta publicação'))
  assert.ok(targets.includes('Ainda sem relato de conclusão desta publicação'))
  assert.ok(targets.includes('não comprova audiência ou visualização independente'))
  assert.ok(!targets.includes('localStorage'))
  assert.ok(server.includes("'playback_reported','awaiting_playback_report'"))
})

test('fleet triage priority uses a signed-down client read contract and avoids fake audience',()=>{
  const attention={code:'offline',level:'critical',title:'Sem conexão recente',
    guidance:'Verifique energia, rede e execução do Player.',needs_attention:true,
    evidence:'operational_triage_not_verified_playback'}
  assert.equal(isPublicationAttention(attention),true)
  assert.equal(isPublicationAttention({...attention,needs_attention:false}),false)
  assert.equal(isPublicationAttention({...attention,level:'neutral'}),false)
  assert.equal(isPublicationAttention({...attention,code:'all_good_audience'}),false)
  assert.equal(isPublicationAttention({...attention,evidence:'certified_audience'}),false)
  const note=publicationSupportBrief(82,{device_id:17,name:'TV Recepção\nAuthorization: fake',
    requested_manifest_version:4,connected_recently:false,sync_acknowledged:false,
    own_playback_reported:false,attention})
  assert.ok(note.includes('Publicação: #82'))
  assert.ok(note.includes('Dispositivo: #17'))
  assert.ok(!note.includes('\nAuthorization:'))
  assert.ok(!note.includes('Bearer '))
  assert.ok(note.includes('operational_triage_not_verified_playback'))
  assert.throws(()=>publicationSupportBrief(0,{device_id:17,attention}))
  assert.ok(server.includes("'awaiting_playback_report','needs_attention'].includes"))
  assert.ok(targets.includes("value='needs_attention'"))
  assert.ok(targets.includes("data.summary.needs_attention"))
  assert.ok(targets.includes('Copiar resumo de suporte'))
  assert.ok(targets.includes('<ClientDeviceDiagnostics'))
  assert.ok(targets.includes('onUpdated={()=>'))
  assert.ok(!targets.includes('device_token'))
  assert.ok(!targets.includes('localStorage'))
})
