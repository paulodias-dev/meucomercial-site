import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const server=read('server.ts')
const portal=read('src/components/ClientPortal.tsx')
const publishing=read('src/components/ClientPublications.tsx')
const studio=read('src/components/ClientStudio.tsx')
const onboarding=read('src/components/ClientOnboarding.tsx')
const targets=read('src/components/ClientPublicationTargets.tsx')
const app=read('src/App.tsx')

test('same-origin portal proxies only twenty-five allowlisted endpoints',()=>{
  assert.ok(server.includes("app.all('/api/portal/:action'"))
  for(const name of ['login','logout','overview','devices','campaigns','services','locations','media','pair-device','sync-device',
    'publication-options','publication-destinations','publication-history',
    'publication-preview','publication-create','publication-withdraw',
    'studio-catalog','studio-list','studio-create','studio-get','studio-update',
    'studio-activate','studio-duplicate','onboarding','publication-targets']){
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
  assert.ok(server.includes("action === 'pair-device' ? '/pairing-pin' : '/sync'"))
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
  assert.ok(studio.includes("studio-update',token"))
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
