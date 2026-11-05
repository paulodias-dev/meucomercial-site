import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const server=read('server.ts')
const portal=read('src/components/ClientPortal.tsx')

test('public agency directory is allowlisted and selected from database API',()=>{
  assert.ok(server.includes("'agencies': {method: 'GET', backend: 'client/agencies', auth: false}"))
  assert.ok(portal.includes("portalRequest<{data:Agency[]}>('agencies',null)"))
  assert.ok(portal.includes('agencyOptions.map(agency=>'))
  assert.ok(portal.includes('<select id=\'portal-agency\' required value={agencySlug}'))
  assert.ok(!portal.includes('agency_id:'))
  assert.ok(!portal.includes('X-Agency-Tenant'))
})

test('signup, login, Google and reset all forward agency_slug only through allowlisted BFF',()=>{
  for(const action of ['login','register','google-login','forgot-password','reset-password']){
    assert.ok(server.includes("'"+action+"': {method: 'POST'"),action)
  }
  assert.ok(server.includes("agency_slug: req.body?.agency_slug"))
  for(const method of ["'login'","'register'","'google-login'","'forgot-password'","'reset-password'"]){
    assert.ok(portal.includes(method+',null'),method)
  }
  assert.ok(portal.includes('agency_slug:agencySlug'))
  assert.ok(portal.includes("if(!agencySlug){setError('Selecione"))
  assert.ok(portal.includes("Escolha a agência responsável pelo cadastro."))
  assert.ok(!server.includes("req.query.agency_tenant_id"))
})

test('public pending never claims contracted services or consumes quota in browser',()=>{
  assert.ok(portal.includes("session.client.registration_status==='pending'"))
  assert.ok(portal.includes('sem contratação automática'))
  assert.ok(portal.includes('Aguardando análise'))
  assert.ok(portal.includes("session.client.registration_status==='rejected'"))
  assert.ok(server.includes("'resend-verification': {method: 'POST', backend: 'client/resend-verification', auth: true}"))
})

test('email verification is an allowlisted POST and secrets are fragment-derived',()=>{
  assert.ok(portal.includes("authLinkParam('verify_token')"))
  assert.ok(portal.includes("authLinkParam('agency_slug')"))
  assert.ok(portal.includes("window.location.hash.replace(/^#/,'')"))
  assert.ok(portal.includes("portalRequest('verify-email',null"))
  assert.ok(server.includes("'verify-email': {method: 'POST', backend: 'client/verify-email', auth: false}"))
  assert.ok(portal.includes("window.history.replaceState(window.history.state,'',window.location.pathname)"))
  assert.ok(!portal.includes('localStorage.setItem'))
  assert.ok(!portal.includes('sessionStorage.setItem'))
})

test('new agency selector and approval queue do not rewrite media/player URL paths',()=>{
  for(const name of ['devices','campaigns','services','locations','media','studio-list','publication-create']){
    assert.ok(server.includes("'"+name+"': {method:"),name)
  }
  assert.ok(portal.includes("ClientPublications"))
  assert.ok(portal.includes("ClientStudio"))
})
