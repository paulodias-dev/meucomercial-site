export type AgencyLandingSectionType='benefit'|'proof'|'faq';
export interface AgencyLandingSection{type:AgencyLandingSectionType;title:string;body:string}
export interface AgencyLandingPublic{
 agencySlug:string;slug:string;agencyName:string;title:string;
 headline:string;subtitle:string;ctaLabel:string;ctaUrl:string;
 primaryColor:string;secondaryColor:string;sections:AgencyLandingSection[];
 publishedAt:string;version:number;publicPath:string;leadCaptureEnabled:true;
}
const slugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const hex=/^#[0-9a-fA-F]{6}$/;
const asObject=(v:unknown):Record<string,unknown>=>{
 if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Resposta de página pública inválida.');
 return v as Record<string,unknown>;
};
const required=(v:unknown,label:string,max:number)=>{
 if(typeof v!=='string'||!v.trim()||v.length>max)
  throw Error('Conteúdo público inválido: '+label);
 return v;
};
export function agencyLandingPublic(raw:unknown,agency:string,slug:string):AgencyLandingPublic{
 const d=asObject(asObject(raw).data);
 if(!slugPattern.test(agency)||!slugPattern.test(slug)||
  d.agency_slug!==agency||d.slug!==slug)
  throw Error('Página não pertence ao endereço solicitado.');
 const sections=d.sections;
 if(!Array.isArray(sections)||sections.length>10)
  throw Error('Seções públicas ausentes ou inválidas.');
 const result:AgencyLandingPublic={
  agencySlug:agency,slug,
  agencyName:required(d.agency_name,'agência',150),
  title:required(d.title,'título',150),
  headline:required(d.headline,'chamada',180),
  subtitle:typeof d.subtitle==='string'?d.subtitle:'',
  ctaLabel:required(d.cta_label,'chamada para ação',60),
  ctaUrl:required(d.cta_url,'destino',500),
  primaryColor:required(d.primary_color,'cor principal',7),
  secondaryColor:required(d.secondary_color,'cor secundária',7),
  sections:sections.map(x=>{
   const r=asObject(x);
   if(!['benefit','proof','faq'].includes(String(r.type)))
    throw Error('Tipo de seção não autorizado.');
   return {type:r.type as AgencyLandingSectionType,
    title:required(r.title,'seção',120),body:required(r.body,'texto',1000)};
  }),
  publishedAt:required(d.published_at,'data de publicação',50),
  version:Number(d.version),publicPath:'/p/'+agency+'/'+slug,
  leadCaptureEnabled:true,
 };
 if(!hex.test(result.primaryColor)||!hex.test(result.secondaryColor)||
  !Number.isSafeInteger(result.version)||result.version<1||
  Number.isNaN(Date.parse(result.publishedAt))||
  d.public_path!==result.publicPath||
  d.lead_capture_enabled!==true)
  throw Error('Publicação não confirmada pelo servidor.');
 try{
  const target=new URL(result.ctaUrl);
  if(target.protocol!=='https:'||target.username||target.password||
   !target.hostname||/^(localhost|.*\.local|.*\.internal)$/i.test(target.hostname))
   throw Error('Destino de CTA privado.');
 }catch{throw Error('Destino de CTA público inválido.');}
 return result;
}
export const agencyLandingPath=(agency:string,slug:string)=>{
 if(!slugPattern.test(agency)||!slugPattern.test(slug))
  throw Error('Endereço público inválido.');
 return '/p/'+agency+'/'+slug;
};
export const agencyLandingApiPath=(agency:string,slug:string)=>{
 agencyLandingPath(agency,slug);
 return '/api/agency-pages/'+agency+'/'+slug;
};
export function agencyLandingLeadPayload(input:{
 name:string;company:string;email:string;phone:string;message:string;
 consent:boolean;website:string;requestId:string;
}){
 if(!input.consent)throw Error('É obrigatório consentir com o contato.');
 if(!input.name.trim()||input.name.trim().length<2||input.name.length>150)
  throw Error('Informe seu nome para a agência.');
 if(!/^\S+@\S+\.\S+$/.test(input.email.trim()))
  throw Error('Informe um e-mail válido.');
 if(input.message.length>1900||input.company.length>150||input.phone.length>30)
  throw Error('Revise os campos antes de enviar.');
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.requestId))
  throw Error('Código de envio inválido.');
 return {
  request_id:input.requestId,name:input.name.trim(),
  company:input.company.trim()||null,email:input.email.trim().toLowerCase(),
  phone:input.phone.trim()||null,message:input.message.trim()||null,
  privacy_consent:true,website:input.website.trim(),
 };
}

/** Choose AA-friendly text against a saved brand color (light/dark). */
export function readableLandingText(hexColor:string):'#0F172A'|'#FFFFFF'{
 if(!hex.test(hexColor))throw Error('Paleta inválida.');
 const rgb=[1,3,5].map(i=>parseInt(hexColor.slice(i,i+2),16)/255);
 const channels=rgb.map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
 const luminance=channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722;
 const blackContrast=(luminance+0.05)/0.05;
 const whiteContrast=1.05/(luminance+0.05);
 return blackContrast>=whiteContrast?'#0F172A':'#FFFFFF';
}
