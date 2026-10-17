// Only the listed intent keys may influence the existing commercial lead form.
// UTM remains on the URL until the established form forwards it to Laravel.
const roles = new Set(['establishment', 'agency', 'advertiser'])
const media = new Set(['tv', 'radio', 'mixed'])
const sources = new Set(['tv-demo', 'media-catalog', 'radio-demo', 'homepage'])
const clean = value => String(value ?? '').trim().replace(/[\u0000-\u001f<>]/g, '').slice(0, 80)

export function readCommercialIntent(search = '') {
  const qs = new URLSearchParams(search)
  const kind = roles.has(qs.get('kind')) ? qs.get('kind') : 'establishment'
  const medium = media.has(qs.get('medium')) ? qs.get('medium') : null
  const source = sources.has(qs.get('source')) ? qs.get('source') : 'homepage'
  const city = clean(qs.get('city') || '').slice(0, 60)
  const planId = /^[1-9][0-9]{0,8}$/.test(qs.get('plan_id')||'') ? Number(qs.get('plan_id')) : null
  const offerId = /^[1-9][0-9]{0,8}$/.test(qs.get('offer_id')||'') ? Number(qs.get('offer_id')) : null
  return {kind, medium, source, city, planId, offerId, action: qs.get('action') === 'contact' ? 'contact' : null}
}
export function commercialContactUrl({kind='establishment', medium='tv', source='homepage', city='', planId=null, offerId=null } = {}, search = '') {
  const qs = new URLSearchParams(search)
  for (const key of ['kind', 'medium', 'source', 'city', 'plan_id', 'offer_id', 'action']) qs.delete(key)
  qs.set('action', 'contact')
  qs.set('kind', roles.has(kind) ? kind : 'establishment')
  qs.set('medium', media.has(medium) ? medium : 'tv')
  qs.set('source', sources.has(source) ? source : 'homepage')
  if (clean(city)) qs.set('city', clean(city).slice(0, 60))
  if(Number.isSafeInteger(planId)&&planId>0)qs.set('plan_id',String(planId))
  if(Number.isSafeInteger(offerId)&&offerId>0&&offerId<=999999999)qs.set('offer_id',String(offerId))
  return '/?' + qs.toString() + '#planos'
}
export function commercialMessage({medium,city,planId,offerId}) {
  const parts = []
  if (medium === 'tv') parts.push('Interesse em TV Indoor')
  if (medium === 'radio') parts.push('Interesse em Rádio Indoor')
  if (medium === 'mixed') parts.push('Interesse em TV e Rádio Indoor')
  if (city) parts.push('Cidade de interesse: ' + clean(city))
  if (Number.isSafeInteger(planId) && planId > 0)parts.push('Plano publicado de interesse: #'+planId)
  if (Number.isSafeInteger(offerId) && offerId > 0)parts.push('Oferta pública de interesse: #'+offerId)
  return parts.join('. ').slice(0, 200)
}
