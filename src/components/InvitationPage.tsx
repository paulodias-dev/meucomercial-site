import {useEffect,useState,type FormEvent} from 'react'

type Agency={slug:string;name:string}

export default function InvitationPage(){
 const [agencies,setAgencies]=useState<Agency[]>([])
 const [agency,setAgency]=useState('')
 const [code,setCode]=useState('')
 const [password,setPassword]=useState('')
 const [confirmation,setConfirmation]=useState('')
 const [terms,setTerms]=useState(false)
 const [busy,setBusy]=useState(false)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const [done,setDone]=useState(false)
 useEffect(()=>{
  const controller=new AbortController()
  fetch('/api/portal/agencies',{credentials:'omit',cache:'no-store',signal:controller.signal})
   .then(async r=>{if(!r.ok)throw Error('Não foi possível consultar as agências.');return r.json()})
   .then(payload=>{
    if(!Array.isArray(payload?.data))throw Error('Catálogo inválido.')
    setAgencies(payload.data.filter((v:unknown):v is Agency=>typeof v==='object'&&v!==null&&typeof (v as Agency).slug==='string'&&typeof (v as Agency).name==='string'))
   })
   .catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'Consulta indisponível.')})
   .finally(()=>{if(!controller.signal.aborted)setLoading(false)})
  return()=>controller.abort()
 },[])
 async function submit(event:FormEvent){
  event.preventDefault()
  if(busy||!agency||!agencies.some(a=>a.slug===agency)||!terms)return
  setBusy(true);setError('')
  try{
   const response=await fetch('/api/portal/accept-invitation',{method:'POST',credentials:'omit',cache:'no-store',
    headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({
     agency_slug:agency,token:code.trim(),password,password_confirmation:confirmation,terms_accepted:terms
    })})
   const result=await response.json().catch(()=>({}))
   if(!response.ok||result.activated!==true)throw Error(response.status===422
    ? 'Confira código, validade, agência e senha.' : typeof result.message==='string'?result.message:'Não foi possível ativar o convite.')
   setCode('');setPassword('');setConfirmation('');setDone(true)
  }catch(e){setError(e instanceof Error?e.message:'Erro de comunicação.')}
  finally{setBusy(false)}
 }
 return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
  <section className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
   <a href="/portal" className="text-sm text-blue-700 hover:underline">Voltar ao Portal</a>
   <h1 className="mt-4 text-2xl font-bold text-slate-900">Ativar convite de acesso</h1>
   <p className="text-sm text-slate-600 mt-2 mb-5">Use o código recebido no e-mail da sua empresa. A agência precisa corresponder ao convite.</p>
   {done?<div role="status" className="space-y-4">
    <p className="text-emerald-800">Acesso ativado. Entre com seu e-mail e a nova senha.</p>
    <a href="/portal" className="inline-block rounded-lg bg-blue-700 text-white px-5 py-3 text-sm">Entrar no Portal</a>
   </div>:<form onSubmit={submit} className="space-y-4">
    <label className="block text-sm font-medium">Agência
     <select className="mt-1 w-full border rounded-lg p-3 bg-white" value={agency} required disabled={loading} onChange={e=>setAgency(e.target.value)}>
      <option value="">{loading?'Carregando...':'Escolha sua agência'}</option>
      {agencies.map(a=><option value={a.slug} key={a.slug}>{a.name}</option>)}
     </select>
    </label>
    <label className="block text-sm font-medium">Código enviado por e-mail
     <input className="mt-1 w-full border rounded-lg p-3" value={code} onChange={e=>setCode(e.target.value)}
      required autoComplete="off" pattern="[a-f0-9]{64}" maxLength={64} minLength={64} spellCheck={false}/>
    </label>
    <label className="block text-sm font-medium">Nova senha
     <input className="mt-1 w-full border rounded-lg p-3" type="password" autoComplete="new-password"
      required minLength={8} value={password} onChange={e=>setPassword(e.target.value)}/>
    </label>
    <label className="block text-sm font-medium">Confirme a senha
     <input className="mt-1 w-full border rounded-lg p-3" type="password" autoComplete="new-password"
      required minLength={8} value={confirmation} onChange={e=>setConfirmation(e.target.value)}/>
    </label>
    <label className="flex items-start gap-2 text-sm text-slate-700">
     <input className="mt-1" type="checkbox" required checked={terms} onChange={e=>setTerms(e.target.checked)}/>
     <span>Aceito os termos de uso e a política de privacidade do Portal.</span>
    </label>
    {error&&<p role="alert" className="text-red-700 text-sm">{error}</p>}
    <button type="submit" disabled={busy||loading||!agency||!terms||!agencies.some(a=>a.slug===agency)}
     className="w-full rounded-lg bg-blue-700 text-white p-3 disabled:opacity-50">{busy?'Validando...':'Ativar acesso'}</button>
   </form>}
  </section>
 </main>
}
