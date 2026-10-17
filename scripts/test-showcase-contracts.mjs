import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {readCommercialIntent, commercialContactUrl, commercialMessage} from '../src/lib/commercialIntent.mjs'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const app=read('src/App.tsx'),server=read('server.ts')
const tv=read('src/components/TvTemplateShowcase.tsx')
const ad=read('src/components/AdvertisingCatalogue.tsx')

test('TV preview uses only four local illustrative layouts and accessible controls',()=>{
 assert.equal((tv.match(/\{id:'(?:boas-vindas|promocoes|avisos|institucional)'/g)||[]).length,4)
 assert.ok(tv.includes("role='img'"))
 assert.ok(tv.includes("aria-pressed={chosen===item.id}"))
 assert.ok(tv.includes("maxLength={80}"))
 assert.ok(tv.includes("aspectRatio:orientation"))
 assert.ok(tv.toLowerCase().includes('não consulta playlists privadas'))
 assert.ok(!tv.includes("fetch("))
 assert.ok(!tv.includes("Authorization:"))
})
test('advertising catalog is permission-conservative and does not invent rates/inventory',()=>{
 assert.equal((ad.split('export const adFormats:AdFormat[]=[')[1].split('export default function')[0].match(/\{id:'(?:tv|radio|mixed)'/g)||[]).length,3)
 assert.ok(ad.includes('nenhuma cidade, aparelho, audiência, valor ou vaga está garantida'))
 assert.ok(ad.includes('não contrata, não cobra e não reserva espaços'))
 assert.ok(ad.includes('aria-pressed={format===item.id}'))
 assert.ok(ad.includes("role='alert'"))
 assert.ok(!ad.includes('fetch('))
 assert.ok(!ad.includes('checkout'))
})
test('commercial intent is validated, bounded and preserves UTM on outbound links',()=>{
 const url=commercialContactUrl({kind:'advertiser',medium:'radio',source:'media-catalog',city:'Aracaju'},'?utm_source=instagram&utm_campaign=test')
 const params=new URL(url,'https://meucomercial.com.br').searchParams
 assert.equal(params.get('action'),'contact')
 assert.equal(params.get('kind'),'advertiser')
 assert.equal(params.get('medium'),'radio')
 assert.equal(params.get('city'),'Aracaju')
 assert.equal(params.get('utm_source'),'instagram')
 assert.equal(params.get('utm_campaign'),'test')
 assert.equal(readCommercialIntent('?kind=superadmin&medium=unknown&source=hacker&city=%3Cscript%3E&action=grant').kind,'establishment')
 assert.equal(readCommercialIntent('?kind=superadmin&medium=unknown&source=hacker&action=grant').action,null)
 assert.equal(commercialMessage({medium:'tv',city:'Aracaju'}),'Interesse em TV Indoor. Cidade de interesse: Aracaju')
 assert.ok(!commercialMessage({medium:null,city:''}).includes('audiencia'))
})
test('all public routes server-render SEO while private client portal remains private',()=>{
 for(const page of ['demonstracao-tv','anunciar']) {
  assert.ok(server.includes("'"+page+"'"),page)
  assert.ok(app.includes("window.location.pathname === '/"+page+"'"),page)
 }
 assert.ok(server.includes("X-Robots-Tag', 'noindex"))
 assert.ok(app.includes('readCommercialIntent(window.location.search)'))
 assert.ok(app.includes('setLeadKind(intent.kind as CommercialAudience)'))
 assert.ok(app.includes('setModalSource'))
 assert.ok(app.includes('commercialMessage(intent)'))
 assert.ok(app.includes('window.history.replaceState'))
 assert.ok(app.includes('utm_campaign: params.get("utm_campaign")'))
 assert.ok(!app.includes('localStorage.setItem'))
})
