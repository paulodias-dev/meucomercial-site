import {readFileSync} from 'node:fs'
import assert from 'node:assert/strict'
const entries=[['home','/'],['demonstracao-tv','/demonstracao-tv'],['anunciar','/anunciar']]
const fmt=value=>Number.isFinite(value)?value.toFixed(0):'n/d'
for(const [name,route] of entries){
 const p='artifacts/lighthouse/'+name+'.json'
 const result=JSON.parse(readFileSync(p,'utf8'))
 assert.equal(result.finalDisplayedUrl?.endsWith(route)||result.finalUrl?.endsWith(route),true,'URL incorreta: '+name)
 const audits=result.audits??{}
 const values={
  FCP:audits['first-contentful-paint']?.numericValue,
  LCP:audits['largest-contentful-paint']?.numericValue,
  CLS:audits['cumulative-layout-shift']?.numericValue,
  TBT:audits['total-blocking-time']?.numericValue,
 }
 for(const [metric,value] of Object.entries(values)){
  assert.equal(Number.isFinite(value),true,name+' '+metric+' ausente')
 }
 assert.ok(result.categories?.performance?.score!==null,'Sem performance: '+name)
 assert.ok(result.categories?.accessibility?.score!==null,'Sem accessibility: '+name)
 assert.ok(result.categories?.seo?.score!==null,'Sem SEO: '+name)
 console.log(JSON.stringify({
  route,score_performance:fmt(result.categories.performance.score*100),
  score_accessibility:fmt(result.categories.accessibility.score*100),
  score_seo:fmt(result.categories.seo.score*100),
  FCP_ms:fmt(values.FCP),LCP_ms:fmt(values.LCP),
  CLS:values.CLS.toFixed(3),TBT_ms:fmt(values.TBT),
  evidence:'lighthouse_mobile_lab_not_field_inp',
 }))
}
console.log('Auditoria de laboratório concluída; valores são baseline e não representam INP em campo.')
