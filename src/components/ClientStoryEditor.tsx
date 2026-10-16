import {useEffect,useState} from 'react'
import {Layers,Save,Type} from 'lucide-react'

type Element={id:string;type:'text'|'band';text:string;x:number;y:number;width:number;height:number;
  font_size:number;color:string;background:string|null;align:'left'|'center'|'right'}
type Layout={version:1;elements:Element[]}
type Template='oferta'|'aviso'|'boas-vindas'
const templates:{key:Template;label:string;headline:string;subtitle:string;background:string}[]=[
  {key:'oferta',label:'Oferta em destaque',headline:'OFERTA ESPECIAL',subtitle:'Confira as novidades da loja',background:'#173B70'},
  {key:'aviso',label:'Comunicado',headline:'AVISO IMPORTANTE',subtitle:'Uma informação para você',background:'#183D45'},
  {key:'boas-vindas',label:'Boas-vindas',headline:'SEJA BEM-VINDO!',subtitle:'É um prazer receber você',background:'#30435C'},
]
const makeLayout=(headline:string,subtitle:string,accent:string):Layout=>({
  version:1,elements:[
    {id:'studio-band',type:'band',text:'',x:50,y:650,width:900,height:300,font_size:16,
      color:'#FFFFFF',background:accent,align:'center'},
    {id:'studio-headline',type:'text',text:headline,x:90,y:685,width:820,height:115,
      font_size:70,color:'#FFFFFF',background:null,align:'center'},
    {id:'studio-subtitle',type:'text',text:subtitle,x:100,y:805,width:800,height:100,
      font_size:34,color:'#FFFFFF',background:null,align:'center'},
  ],
})
const button='border rounded-xl min-h-11 px-3 text-xs font-semibold disabled:opacity-50'

export default function ClientStoryEditor({
  token,playlistId,itemId,previewUrl,mediaIsVideo,orientation,onSaved,
}:{token:string;playlistId:number;itemId:number;previewUrl?:string|null;mediaIsVideo?:boolean;
  orientation:string;onSaved:()=>void}){
  const [revision,setRevision]=useState(0)
  const [template,setTemplate]=useState<Template>('oferta')
  const [headline,setHeadline]=useState(templates[0].headline)
  const [subtitle,setSubtitle]=useState(templates[0].subtitle)
  const [accent,setAccent]=useState(templates[0].background)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [message,setMessage]=useState('')
  const [loaded,setLoaded]=useState(false)
  useEffect(()=>{
    const abort=new AbortController()
    setLoaded(false);setError('')
    const url=new URL('/api/portal/studio-story-get',window.location.origin)
    url.searchParams.set('playlist_id',String(playlistId))
    url.searchParams.set('item_id',String(itemId))
    fetch(url,{headers:{Authorization:'Bearer '+token,Accept:'application/json'},
      credentials:'omit',cache:'no-store',signal:abort.signal,
    }).then(async response=>{
      const json=await response.json().catch(()=>({}))
      if(!response.ok)throw new Error(json.message||'Cena indisponível.')
      return json as {data:{revision:number;layout:Layout}}
    }).then(({data})=>{
      if(abort.signal.aborted)return
      setRevision(data.revision)
      const current=data.layout.elements
      const a=current.find(x=>x.id==='studio-headline')
      const b=current.find(x=>x.id==='studio-subtitle')
      const c=current.find(x=>x.id==='studio-band')
      if(a)setHeadline(a.text)
      if(b)setSubtitle(b.text)
      if(c?.background)setAccent(c.background)
      setLoaded(true)
    }).catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Erro de consulta.')})
    return ()=>abort.abort()
  },[token,playlistId,itemId])
  const choose=(next:Template)=>{
    const preset=templates.find(x=>x.key===next)!
    setTemplate(next);setHeadline(preset.headline)
    setSubtitle(preset.subtitle);setAccent(preset.background);setMessage('')
  }
  const save=async()=>{
    if(!loaded||busy||headline.trim().length===0||headline.length>180||subtitle.length>180)return
    setBusy(true);setError('');setMessage('')
    try{
      const response=await fetch('/api/portal/studio-story-update',{
        method:'PUT',headers:{'Content-Type':'application/json',Accept:'application/json',
          Authorization:'Bearer '+token},credentials:'omit',cache:'no-store',
        body:JSON.stringify({
          playlist_id:playlistId,item_id:itemId,expected_revision:revision,
          layout:makeLayout(headline.trim(),subtitle.trim(),accent),
        }),
      })
      const json=await response.json().catch(()=>({}))
      if(!response.ok)throw new Error(json.message||'Não foi possível salvar a composição.')
      setRevision(json.data.revision);setMessage('Composição salva no rascunho. Ative a playlist para enviá-la na programação.')
      onSaved()
    }catch(e){setError(e instanceof Error?e.message:'Falha ao salvar cena.')}
    finally{setBusy(false)}
  }
  return <section className='rounded-2xl border border-blue-200 bg-blue-50/30 p-4 mt-4' aria-label='Editor visual da cena'>
    <div className='flex gap-2 items-center'><Layers size={19} className='text-blue-800'/>
      <h4 className='font-bold text-base'>Compor cena para TV</h4></div>
    <p className='mt-2 text-xs text-black/60'>Escolha um estilo e personalize o texto. As camadas usam o mesmo formato suportado pelo Player TV. Salvar não ativa nem publica a programação.</p>
    {error&&<p role='alert' className='p-3 mt-3 rounded-xl text-red-800 bg-red-50 text-sm'>{error}</p>}
    {message&&<p role='status' className='p-3 mt-3 rounded-xl text-blue-800 bg-blue-50 text-sm'>{message}</p>}
    {!loaded&&<p role='status' className='text-sm mt-3'>Carregando cena…</p>}
    {loaded&&<div className='grid gap-3 mt-4'>
      <fieldset><legend className='text-xs font-bold mb-2'>Modelos</legend>
        <div className='flex flex-wrap gap-2'>
          {templates.map(t=><button type='button' key={t.key}
            onClick={()=>choose(t.key)} aria-pressed={template===t.key}
            className={button+(template===t.key?' bg-blue-700 text-white':' bg-white')}>{t.label}</button>)}
        </div>
      </fieldset>
      <label className='text-xs font-bold'>Chamada principal
        <input type='text' value={headline} maxLength={180} onChange={e=>setHeadline(e.target.value)}
          className='w-full mt-1 min-h-11 px-3 rounded-xl border bg-white text-sm' placeholder='Sua mensagem'/>
      </label>
      <label className='text-xs font-bold'>Descrição
        <input type='text' value={subtitle} maxLength={180} onChange={e=>setSubtitle(e.target.value)}
          className='w-full mt-1 min-h-11 px-3 rounded-xl border bg-white text-sm' placeholder='Informação complementar'/>
      </label>
      <label className='text-xs font-bold flex items-center gap-2'>Cor da faixa
        <input type='color' value={accent} onChange={e=>setAccent(e.target.value)}
          aria-label='Cor da faixa' className='w-12 h-11 rounded-lg border'/>
      </label>
      <div className='rounded-2xl border border-black/10 bg-gray-900 overflow-hidden p-2'>
        <div className={'mx-auto relative overflow-hidden bg-slate-700 '+
          (orientation==='portrait'?'aspect-[9/16] max-w-48':'aspect-video max-w-xl')}>
          {previewUrl&&(mediaIsVideo
            ?<video muted playsInline controls preload='metadata' src={previewUrl}
              className='absolute inset-0 h-full w-full object-cover'/>
            :<img src={previewUrl} alt='Plano de fundo da cena' className='absolute inset-0 w-full h-full object-cover'/>)}
          <div className='absolute bottom-[5%] left-[5%] w-[90%] h-[30%] px-2'
            style={{backgroundColor:accent}}>
            <div className='h-full flex flex-col items-center justify-center text-center overflow-hidden'>
              <strong className='text-white font-extrabold leading-tight text-xs sm:text-base line-clamp-2 break-words'>{headline}</strong>
              <span className='text-white text-[10px] sm:text-xs mt-1 line-clamp-2 break-words'>{subtitle}</span>
            </div>
          </div>
        </div>
      </div>
      <p className='text-xs text-black/60 flex gap-2 items-start'><Type size={15} className='shrink-0'/>
        Visualização aproximada no navegador; a renderização efetiva depende da orientação e do Player instalado.
      </p>
      <button type='button' onClick={()=>void save()} disabled={busy||!headline.trim()}
        className={button+' bg-blue-700 text-white border-blue-700 flex gap-2 items-center justify-center'}>
        <Save size={16}/>{busy?'Salvando…':'Salvar composição'}
      </button>
    </div>}
  </section>
}
