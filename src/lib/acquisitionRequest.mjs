const kinds=new Set(['establishment','agency','advertiser']);
const media=new Set(['tv','radio','mixed']);
const id=v=>Number.isSafeInteger(v)&&v>0&&v<=999999999;
const clean=(v,n)=>String(v??'').trim().slice(0,n);
export function readAcquisitionIntent(search=''){
 const q=new URLSearchParams(search),kind=kinds.has(q.get('kind'))?q.get('kind'):'establishment';
 const parse=v=>/^[1-9][0-9]{0,8}$/.test(v||'')?Number(v):null;
 return {kind,planId:kind==='establishment'?parse(q.get('plan_id')):null,
   offerId:kind==='advertiser'?parse(q.get('offer_id')):null};
}
export function acquisitionUrl({kind='establishment',planId=null,offerId=null}={},search=''){
 const q=new URLSearchParams(),from=new URLSearchParams(search);
 q.set('kind',kinds.has(kind)?kind:'establishment');
 if(kind==='establishment'&&id(planId))q.set('plan_id',String(planId));
 if(kind==='advertiser'&&id(offerId))q.set('offer_id',String(offerId));
 for(const key of ['utm_source','utm_medium','utm_campaign']){
  const value=clean(from.get(key),100);if(value)q.set(key,value);
 }
 return '/contratar?'+q.toString();
}
export function buildAcquisitionPayload(form,key,search=''){
 if(!kinds.has(form.kind))throw Error('Escolha um perfil válido.');
 if(!form.consent)throw Error('Autorize o contato.');
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key))throw Error('Identificador inválido.');
 const name=clean(form.name,120),company=clean(form.company,160),
  email=clean(form.email,190),whatsapp=clean(form.whatsapp,24),
  city=clean(form.city,60),details=clean(form.details,1800);
 if(name.length<2||company.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||
   !/^[+()0-9\s-]{10,24}$/.test(whatsapp))throw Error('Revise nome, empresa, e-mail e telefone.');
 if(city&&!/^[\p{L}\s.'-]{2,60}$/u.test(city))throw Error('Informe apenas o nome da cidade.');
 const screens=form.kind==='establishment'?Number(form.screensCount):null;
 if(form.kind==='establishment'&&(!Number.isInteger(screens)||screens<1||screens>10000))
  throw Error('Quantidade de dispositivos inválida.');
 const medium=media.has(form.medium)?form.medium:'mixed';
 const message=[
  'Solicitação comercial guiada (sem checkout)',
  'Perfil: '+form.kind,'Mídia: '+medium,
  city?'Cidade: '+city:'',details?'Necessidade: '+details:''
 ].filter(Boolean).join('. ').slice(0,3000);
 const utm=new URLSearchParams(search);
 return {idempotency_key:key,kind:form.kind,name,company,email,whatsapp,
  source:'site-acquisition-guided',screens_count:screens,segment:null,
  plan_id:form.kind==='establishment'&&id(form.planId)?form.planId:null,
  offer_id:form.kind==='advertiser'&&id(form.offerId)?form.offerId:null,
  message,consent:true,website:'',
  utm_source:clean(utm.get('utm_source'),100)||null,
  utm_medium:clean(utm.get('utm_medium'),100)||null,
  utm_campaign:clean(utm.get('utm_campaign'),100)||null};
}
export function acquisitionError(status){
 if(status===422)return 'Dados inválidos ou item despublicado. Revise os campos e consulte o catálogo.';
 if(status===409)return 'O pedido foi alterado durante o envio. Revise e tente novamente.';
 if(status===429)return 'Limite de solicitações atingido. Tente novamente mais tarde.';
 return 'A API não confirmou o pedido. Tente novamente.';
}
