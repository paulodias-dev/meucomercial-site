const obj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v)
const text=(v,max=450)=>typeof v==='string'&&v.length>0&&v.length<=max
const id=v=>Number.isSafeInteger(v)&&v>0
const amount=v=>typeof v==='string'&&/^(0|[1-9][0-9]{0,10})\.[0-9]{2}$/.test(v)
export function verifyIndoorCatalog(v){
 return obj(v)&&v.evidence==='curated_authorized_offer_not_realtime_capacity'&&
 Array.isArray(v.data)&&v.data.length<=24&&v.data.every(o=>obj(o)&&id(o.offer_id)&&
 text(o.title,100)&&text(o.region,80)&&text(o.description,450)&&
 ['tv','radio'].includes(o.medium)&&o.availability==='consultation_required')
}
export function verifyIndoorPlans(v){
 return obj(v)&&v.evidence==='approved_active_plan_not_purchase'&&
 Array.isArray(v.data)&&v.data.length<=30&&v.data.every(p=>obj(p)&&id(p.plan_id)&&
 text(p.name,150)&&(p.description===null||typeof p.description==='string'&&p.description.length<=5000)&&
 amount(p.price)&&p.currency==='BRL'&&['monthly','yearly'].includes(p.interval)&&
 (p.max_devices===null||Number.isInteger(p.max_devices)&&p.max_devices>=0)&&
 (p.storage_mb===null||Number.isInteger(p.storage_mb)&&p.storage_mb>=0)&&
 Number.isInteger(p.trial_days)&&p.trial_days>=0&&
 p.checkout_available===false)
}
export const moneyExact=v=>{
 if(!amount(v))return 'Preço sob consulta'
 const [integer,cents]=v.split('.')
 return 'R$ '+integer.replace(/\B(?=(\d{3})+(?!\d))/g,'.')+','+cents
}
