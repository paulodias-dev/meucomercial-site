import {useEffect,useRef,useState,type FormEvent} from 'react';
import {ArrowUpRight,CheckCircle2,Mail,ShieldCheck} from 'lucide-react';
import SEO from './SEO';
import {
 agencyLandingApiPath,agencyLandingPublic,agencyLandingLeadPayload,
 type AgencyLandingPublic,
} from '../lib/agencyLandingPublic';

const empty=()=>({name:'',company:'',email:'',phone:'',message:'',website:''});
const sectionLabels={benefit:'Benefícios',proof:'Informações e evidências',faq:'Perguntas frequentes'};
export default function AgencyLandingPublicPage({agency,slug}:{agency:string;slug:string}){
 const [page,setPage]=useState<AgencyLandingPublic|null>(null);
 const [loading,setLoading]=useState(true),[notFound,setNotFound]=useState(false);
 const [error,setError]=useState('');
 const [form,setForm]=useState(empty),[consent,setConsent]=useState(false);
 const [sending,setSending]=useState(false),[sent,setSent]=useState(false),[sendError,setSendError]=useState('');
 const key=useRef<string|null>(null);
 const endpoint=agencyLandingApiPath(agency,slug);
 useEffect(()=>{
  const ctl=new AbortController();
  setLoading(true);setNotFound(false);setError('');setPage(null);
  fetch(endpoint,{headers:{Accept:'application/json'},signal:ctl.signal,cache:'no-store'})
   .then(async response=>{
    if(response.status===404){setNotFound(true);return null;}
    if(!response.ok)throw Error('Não foi possível consultar a página no momento.');
    return agencyLandingPublic(await response.json(),agency,slug);
   }).then(data=>{if(!ctl.signal.aborted)setPage(data);})
   .catch(cause=>{if(!ctl.signal.aborted)setError(cause instanceof Error?cause.message:'Serviço indisponível.');})
   .finally(()=>{if(!ctl.signal.aborted)setLoading(false);});
  return ()=>ctl.abort();
 },[agency,slug,endpoint]);
 function setValue<K extends keyof ReturnType<typeof empty>>(keyName:K,value:ReturnType<typeof empty>[K]){
  setForm(v=>({...v,[keyName]:value}));key.current=null;setSendError('');
 }
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(sending||sent||!page)return;
  if(!key.current)key.current=crypto.randomUUID();
  setSending(true);setSendError('');
  try{
   const payload=agencyLandingLeadPayload({...form,consent,requestId:key.current});
   const response=await fetch(endpoint+'/leads',{
    method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify(payload),cache:'no-store',redirect:'error',
   });
   const result=await response.json().catch(()=>({}));
   if(!response.ok||result.received!==true||result.lead_saved_to_agency_crm!==true)
    throw Error(response.status===429?'Muitas tentativas. Tente novamente mais tarde.':
     'Não foi possível confirmar o contato no CRM da agência.');
   setSent(true);
  }catch(cause){setSendError(cause instanceof Error?cause.message:'Envio indisponível.');}
  finally{setSending(false);}
 }
 if(loading)return <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6" role="status">
  <SEO title="Consultando página" robots="noindex, nofollow"/><p>Carregando página da agência...</p></main>;
 if(notFound||error||!page)return <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center gap-4">
  <SEO title="Página indisponível" robots="noindex, nofollow"/>
  <h1 className="text-2xl font-bold text-slate-900">{notFound?'Página não disponível':'Não foi possível carregar a página'}</h1>
  <p role={error?'alert':undefined} className="max-w-lg text-slate-600">
   {error||'Esta página pode ter sido retirada do ar ou a agência não está mais disponível.'}
  </p>
  <a href="/" className="rounded-lg bg-slate-900 px-5 py-3 text-white">Voltar ao Meu Comercial</a>
 </main>;
 const description=page.subtitle||page.headline;
 const grouped=(type:'benefit'|'proof'|'faq')=>page.sections.filter(x=>x.type===type);
 return <div className="min-h-screen bg-slate-50 text-slate-900">
  <SEO title={page.title+' · '+page.agencyName} description={description}
   robots="index, follow" url={page.publicPath} type="website"
   themeColor={page.primaryColor} publishedTime={page.publishedAt}/>
  <header className="border-b border-slate-200 bg-white">
   <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
    <p className="min-w-0 break-words text-base font-bold">{page.agencyName}</p>
    <a href="#contato" className="shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold"
     style={{borderColor:page.primaryColor,color:page.primaryColor}}>Solicitar contato</a>
   </div>
  </header>
  <main>
   <section className="px-5 py-16 text-white sm:px-8 sm:py-24" style={{backgroundColor:page.primaryColor}}>
    <div className="mx-auto max-w-6xl space-y-7">
     <p className="text-sm font-semibold uppercase tracking-[.18em] opacity-85">{page.agencyName}</p>
     <h1 className="max-w-4xl break-words text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{page.headline}</h1>
     {page.subtitle&&<p className="max-w-2xl whitespace-pre-wrap break-words text-lg opacity-90 sm:text-xl">{page.subtitle}</p>}
     <div className="flex flex-wrap gap-3">
      <a href={page.ctaUrl} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-lg hover:opacity-90"
       style={{backgroundColor:page.secondaryColor}}>
       {page.ctaLabel} <ArrowUpRight size={18}/>
      </a>
      <a href="#contato" className="rounded-lg border border-white/70 px-6 py-3 font-semibold text-white hover:bg-white/10">
       Receber atendimento
      </a>
     </div>
    </div>
   </section>
   {(['benefit','proof','faq'] as const).map(type=>{
    const sections=grouped(type);
    return sections.length>0?<section key={type} className="px-5 py-12 sm:px-8">
     <div className="mx-auto max-w-6xl space-y-6">
      <h2 className="text-2xl font-bold sm:text-3xl">{sectionLabels[type]}</h2>
      <div className="grid gap-4 md:grid-cols-2">
       {sections.map((part,i)=><article key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">{part.title}</h3>
        <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-slate-600">{part.body}</p>
       </article>)}
      </div>
     </div>
    </section>:null;
   })}
   <section id="contato" className="bg-white px-5 py-16 sm:px-8">
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.85fr_1.15fr]">
     <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold" style={{color:page.primaryColor}}>
       <Mail size={19}/> Atendimento direto da agência
      </div>
      <h2 className="text-3xl font-bold">Fale com {page.agencyName}</h2>
      <p className="text-slate-600">Envie seus dados e sua mensagem. A solicitação será registrada na equipe comercial desta agência, sem contratação ou cobrança automática.</p>
      <div className="flex gap-2 text-sm text-slate-600"><ShieldCheck className="shrink-0" size={20}/> Seus dados são usados para responder à sua solicitação.</div>
     </div>
     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-8">
      {sent?<div role="status" className="space-y-3 text-center">
       <CheckCircle2 className="mx-auto text-emerald-600" size={38}/>
       <h3 className="text-xl font-bold">Solicitação recebida</h3>
       <p className="text-slate-600">Sua mensagem foi registrada no CRM da agência. A equipe poderá entrar em contato pelos dados informados.</p>
      </div>:<form onSubmit={submit} className="grid gap-4">
       <label className="grid gap-1.5 text-sm font-semibold">Nome completo
        <input required minLength={2} maxLength={150} autoComplete="name" value={form.name}
         onChange={e=>setValue('name',e.target.value)} className="rounded-lg border border-slate-300 bg-white p-3"/></label>
       <label className="grid gap-1.5 text-sm font-semibold">Empresa (opcional)
        <input maxLength={150} autoComplete="organization" value={form.company}
         onChange={e=>setValue('company',e.target.value)} className="rounded-lg border border-slate-300 bg-white p-3"/></label>
       <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold">E-mail
         <input type="email" required maxLength={100} autoComplete="email" value={form.email}
          onChange={e=>setValue('email',e.target.value)} className="min-w-0 rounded-lg border border-slate-300 bg-white p-3"/></label>
        <label className="grid gap-1.5 text-sm font-semibold">WhatsApp (opcional)
         <input type="tel" maxLength={30} autoComplete="tel" value={form.phone}
          onChange={e=>setValue('phone',e.target.value)} className="min-w-0 rounded-lg border border-slate-300 bg-white p-3"/></label>
       </div>
       <label className="grid gap-1.5 text-sm font-semibold">Mensagem (opcional)
        <textarea rows={4} maxLength={1900} value={form.message}
         onChange={e=>setValue('message',e.target.value)} className="rounded-lg border border-slate-300 bg-white p-3"/></label>
       <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        Site<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>setValue('website',e.target.value)}/>
       </label>
       <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
        <input type="checkbox" required className="mt-1" checked={consent}
         onChange={e=>{setConsent(e.target.checked);key.current=null;setSendError('');}}/>
        Autorizo o uso dos meus dados para que {page.agencyName} entre em contato sobre esta solicitação.
       </label>
       {sendError&&<p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{sendError}</p>}
       <button type="submit" disabled={sending||!consent}
        className="rounded-lg px-5 py-3 font-bold text-white disabled:opacity-50 hover:opacity-90"
        style={{backgroundColor:page.primaryColor}}>
        {sending?'Registrando solicitação...':'Enviar solicitação'}
       </button>
      </form>}
     </div>
    </div>
   </section>
  </main>
  <footer className="border-t border-slate-200 px-5 py-6 text-center text-xs text-slate-500">
   Página publicada por {page.agencyName}. Informações comerciais devem ser confirmadas com a agência.
  </footer>
 </div>;
}
