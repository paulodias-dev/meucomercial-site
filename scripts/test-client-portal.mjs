import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const server=read('server.ts')
const portal=read('src/components/ClientPortal.tsx')
const app=read('src/App.tsx')

test('same-origin portal proxies only eight allowlisted endpoints',()=>{
  assert.ok(server.includes("app.all('/api/portal/:action'"))
  for(const name of ['login','logout','overview','devices','campaigns','services','locations','media']){
    assert.ok(server.includes("'"+name+"': {method:"),name)
  }
  assert.ok(server.includes('req.method !== route.method'))
  assert.ok(server.includes('new URL(route.backend, base)'))
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
