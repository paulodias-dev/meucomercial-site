import {useCallback,useEffect,useRef,useState} from 'react'
import {ArrowDown,ArrowUp,CheckCircle2,Copy,Film,Headphones,Plus,Save,ShieldCheck,Trash2,Upload,Layers} from 'lucide-react'
import ClientStoryEditor from './ClientStoryEditor'

type Kind='tv'|'radio'
type SourceType='media'|'music'|'commercial_spot'
type Item={id?:number;source_type:SourceType;source_id:number;duration_seconds:number;preview_url?:string|null;story_layout?:unknown;media_type?:string|null}
type Source=Item&{name:string;kind:string;artist?:string|null;preview_url?:string|null}
type Summary={id:number;name:string;kind:Kind;orientation:string;status:string;items_count:number}
type Draft=Summary&{items:(Item&{position:number;preview_url?:string|null})[];revision:string}
type Page<T>={data:T[];pagination:{page:number;last_page:number;total:number;per_page:number}}
type StudioAction='studio-catalog'|'studio-list'|'studio-get'|'studio-create'|'studio-update'|'studio-activate'|'studio-duplicate'
const control='rounded-xl border border-black/15 px-3 min-h-11 text-sm'
const btn='rounded-xl px-4 min-h-11 text-sm font-semibold border disabled:opacity-40 disabled:cursor-not-allowed'

async function request<T>(action:StudioAction,token:string,options:{
  page?:number;kind?:Kind;source?:'music'|'commercial_spot';playlistId?:number;method?:'POST'|'PUT';body?:Record<string,unknown>;
  signal?:AbortSignal
}={}):Promise<T>{
  const url=new URL('/api/portal/'+action,window.location.origin)
  if(options.page)url.searchParams.set('page',String(options.page))
  if(options.kind)url.searchParams.set('kind',options.kind)
  if(options.source)url.searchParams.set('source',options.source)
  if(options.playlistId&&options.method!=='POST'&&options.method!=='PUT')
    url.searchParams.set('playlist_id',String(options.playlistId))
  const body=options.playlistId&&options.method
    ?{...options.body,playlist_id:options.playlistId}:options.body
  const response=await fetch(url,{
    method:options.method??'GET',headers:{Accept:'application/json','Content-Type':'application/json',
      Authorization:'Bearer '+token},
    credentials:'omit',cache:'no-store',signal:options.signal,
    body:options.method?JSON.stringify(body??{}):undefined,
  })
  const payload=await response.json().catch(()=>({}))
  if(!response.ok){
    if(response.status===401||response.status===403)
      throw new Error('Acesso indisponível. Confirme sua assinatura e autorização da agência.')
    if(response.status===409)throw new Error(payload.message||'Rascunho desatualizado. Reabra a playlist antes de editar.')
    if(response.status===422){
      const issues=Object.values(payload.errors??{}).flat().filter(x=>typeof x==='string')
      throw new Error(issues.length?issues.slice(0,2).join(' '):(payload.message||'Conteúdo inválido.'))
    }
    throw new Error(payload.message||'O serviço está indisponível.')
  }
  return payload as T
}

export default function ClientStudio({token,onPublish}:{token:string;onPublish:(item:{id:number;kind:Kind})=>void}){
  const [kind,setKind]=useState<Kind>('tv')
  const [orientation,setOrientation]=useState<'landscape'|'portrait'>('landscape')
  const [radioSource,setRadioSource]=useState<'music'|'commercial_spot'>('music')
  const [studioScene,setStudioScene]=useState<number|null>(null)
  const [uploadFile,setUploadFile]=useState<File|null>(null)
  const [uploadTitle,setUploadTitle]=useState('')
  const [uploadBusy,setUploadBusy]=useState(false)
  const [name,setName]=useState('')
  const [selectedId,setSelectedId]=useState<number|null>(null)
  const [revision,setRevision]=useState<string|null>(null)
  const [status,setStatus]=useState('draft')
  const [items,setItems]=useState<Item[]>([])
  const [catalog,setCatalog]=useState<Page<Source>|null>(null)
  const [catalogPage,setCatalogPage]=useState(1)
  const [playlists,setPlaylists]=useState<Page<Summary>|null>(null)
  const [listPage,setListPage]=useState(1)
  const [reload,setReload]=useState(0)
  const [busy,setBusy]=useState(false)
  const [loading,setLoading]=useState(true)
  const [message,setMessage]=useState('')
  const [error,setError]=useState('')
  const active=useRef(token)
  active.current=token

  const reloadAll=useCallback(()=>setReload(x=>x+1),[])
  useEffect(()=>{
    const abort=new AbortController()
    setLoading(true)
    Promise.all([
      request<Page<Source>>('studio-catalog',token,{page:catalogPage,kind,source:kind==='radio'?radioSource:undefined,signal:abort.signal}),
      request<Page<Summary>>('studio-list',token,{page:listPage,kind,signal:abort.signal}),
    ]).then(([sources,list])=>{
      if(abort.signal.aborted||active.current!==token)return
      setCatalog(sources);setPlaylists(list)
    }).catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Falha ao consultar catálogo.')})
      .finally(()=>{if(!abort.signal.aborted)setLoading(false)})
    return ()=>abort.abort()
  },[token,kind,radioSource,catalogPage,listPage,reload])

  const reset=(nextKind:Kind=kind)=>{
    setSelectedId(null);setRevision(null);setStatus('draft');setName('')
    setOrientation('landscape');setItems([]);setStudioScene(null);setError('');setMessage('')
    setKind(nextKind)
  }
  const switchKind=(next:Kind)=>{
    reset(next);setListPage(1);setCatalogPage(1);setRadioSource('music')
  }
  const open=async(id:number)=>{
    if(busy)return
    setBusy(true);setError('');setMessage('')
    try{
      const result=await request<{data:Draft}>('studio-get',token,{playlistId:id})
      if(active.current!==token)return
      const draft=result.data
      setKind(draft.kind);setSelectedId(draft.id);setRevision(draft.revision)
      setName(draft.name);setOrientation(draft.orientation==='portrait'?'portrait':'landscape')
      setStatus(draft.status)
      setItems(draft.items.map(x=>({...x})))
      setStudioScene(null)
    }catch(e){if(active.current===token)setError(e instanceof Error?e.message:'Não foi possível abrir a playlist.')}
    finally{if(active.current===token)setBusy(false)}
  }
  const add=(source:Source)=>{
    if(busy||status!=='draft'||items.length>=30)return
    setItems(old=>[...old,{source_type:source.source_type,source_id:source.source_id,
      duration_seconds:Math.max(1,Math.min(1800,source.duration_seconds||15))}])
    setMessage('');setError('')
  }
  const move=(index:number,offset:number)=>{
    const next=index+offset
    if(next<0||next>=items.length)return
    setItems(old=>{const result=[...old];[result[index],result[next]]=[result[next],result[index]];return result})
  }
  const changeDuration=(index:number,value:string)=>{
    setItems(old=>old.map((x,i)=>i===index?{...x,duration_seconds:Number(value)}:x))
  }
  const eligible=name.trim().length>=2&&name.trim().length<=180&&items.length>0&&
    items.length<=30&&items.every(i=>Number.isInteger(i.duration_seconds)&&i.duration_seconds>0&&i.duration_seconds<=1800)
  const save=async()=>{
    if(!eligible||busy||status!=='draft')return
    setBusy(true);setError('');setMessage('')
    try{
      const editing=selectedId!==null
      const result=await request<{data:Draft}>(editing?'studio-update':'studio-create',token,{
        method:editing?'PUT':'POST',
        playlistId:editing?selectedId:undefined,
        body:{name:name.trim(),kind,orientation,items,
          ...(editing?{expected_revision:revision}:{} )},
      })
      if(active.current!==token)return
      setSelectedId(result.data.id);setRevision(result.data.revision)
      setStatus(result.data.status)
      setItems(result.data.items.map(x=>({...x})));setStudioScene(null)
      setMessage(editing?'Rascunho atualizado.':'Rascunho criado. Você pode continuar editando.')
      reloadAll()
    }catch(e){if(active.current===token)setError(e instanceof Error?e.message:'Não foi possível salvar.')}
    finally{if(active.current===token)setBusy(false)}
  }
  const activate=async()=>{
    if(!selectedId||!revision||busy||status!=='draft')return
    if(!window.confirm('Ativar esta playlist? Para editar depois será necessário duplicá-la.'))return
    setBusy(true);setError('');setMessage('')
    try{
      const result=await request<{data:Draft}>('studio-activate',token,{
        method:'POST',playlistId:selectedId,body:{expected_revision:revision},
      })
      if(active.current!==token)return
      setStatus(result.data.status);setRevision(result.data.revision)
      setMessage('Playlist ativada. Escolha os seus Players e datas em Publicar conteúdo.')
      reloadAll()
    }catch(e){if(active.current===token)setError(e instanceof Error?e.message:'Ativação recusada.')}
    finally{if(active.current===token)setBusy(false)}
  }
  const duplicate=async()=>{
    if(!selectedId||busy)return
    setBusy(true);setError('');setMessage('')
    try{
      const result=await request<{data:Draft}>('studio-duplicate',token,{
        method:'POST',playlistId:selectedId,
      })
      if(active.current!==token)return
      setSelectedId(result.data.id);setRevision(result.data.revision)
      setName(result.data.name);setStatus('draft')
      setItems(result.data.items.map(x=>({...x})));setStudioScene(null)
      setMessage('Cópia criada como rascunho. A playlist original permanece intacta.')
      reloadAll()
    }catch(e){if(active.current===token)setError(e instanceof Error?e.message:'Duplicação recusada.')}
    finally{if(active.current===token)setBusy(false)}
  }
  const upload=async()=>{
    const file=uploadFile
    if(!file||uploadBusy)return
    if(!['image/jpeg','image/png','video/mp4'].includes(file.type)||file.size===0||file.size>24*1024*1024){
      setError('Selecione JPG, PNG ou MP4 com até 24 MB (imagens até 12 MB).');return
    }
    const title=uploadTitle.trim()
    if(!title||title.length>150){setError('Informe um título de até 150 caracteres.');return}
    setUploadBusy(true);setError('');setMessage('')
    try{
      const response=await fetch('/api/portal/studio-upload',{
        method:'POST',headers:{
          Authorization:'Bearer '+token,Accept:'application/json',
          'Content-Type':file.type,'X-Studio-Name':encodeURIComponent(title),
        },
        body:file,credentials:'omit',cache:'no-store',
      })
      const data=await response.json().catch(()=>({}))
      if(!response.ok)throw new Error(data.message||'Não foi possível enviar a mídia.')
      if(active.current!==token)return
      setUploadFile(null);setUploadTitle('');setCatalogPage(1)
      setMessage('Arquivo verificado e salvo na biblioteca privada. Você já pode adicioná-lo à sequência.')
      reloadAll()
    }catch(e){setError(e instanceof Error?e.message:'Falha no upload.')}
    finally{setUploadBusy(false)}
  }
  const totalSeconds=items.reduce((sum,x)=>sum+x.duration_seconds,0)
  const labelFor=(item:Item)=>{
    const source=catalog?.data.find(c=>c.source_type===item.source_type&&c.source_id===item.source_id)
    return source?.name||({media:'Imagem/vídeo',music:'Música',commercial_spot:'Spot'}[item.source_type]+' #'+item.source_id)
  }
  const previewFor=(item:Item)=>item.preview_url??catalog?.data.find(c=>c.source_type===item.source_type&&c.source_id===item.source_id)?.preview_url
  const isVideo=(item:Item)=>item.media_type==='video'||catalog?.data.find(c=>c.source_type===item.source_type&&c.source_id===item.source_id)?.kind==='video'

  return <section aria-label='Estúdio Simples' className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-4'>
    <div className='bg-white rounded-2xl border border-black/10 p-4 sm:p-6 min-w-0'>
      <div className='flex items-center gap-2'>
        {kind==='tv'?<Film size={21} className='text-blue-700' aria-hidden/>:<Headphones size={21} className='text-blue-700' aria-hidden/>}
        <h2 className='font-bold text-xl'>Estúdio Simples</h2>
      </div>
      <p className='text-sm text-black/60 mt-2'>Organize imagens, vídeos ou áudios já autorizados. Você pode salvar rascunhos sem alterar a programação em execução.</p>
      <div className='flex flex-wrap gap-2 mt-5' role='group' aria-label='Tipo de conteúdo'>
        <button type='button' aria-pressed={kind==='tv'} onClick={()=>switchKind('tv')}
          className={btn+(kind==='tv'?' bg-blue-700 text-white':' bg-gray-50')}>TV Indoor</button>
        <button type='button' aria-pressed={kind==='radio'} onClick={()=>switchKind('radio')}
          className={btn+(kind==='radio'?' bg-blue-700 text-white':' bg-gray-50')}>Rádio Indoor</button>
        <button type='button' onClick={()=>reset()} className={btn+' bg-white'}><Plus size={15} className='inline mr-1'/>Nova</button>
      </div>
      {loading&&<p role='status' className='mt-4 text-sm'>Consultando biblioteca e rascunhos…</p>}
      {error&&<p role='alert' className='mt-4 p-3 rounded-xl bg-red-50 text-red-800 text-sm'>{error}</p>}
      {message&&<p role='status' className='mt-4 p-3 rounded-xl bg-blue-50 text-blue-900 text-sm'>{message}</p>}

      <h3 className='font-bold text-sm mt-6'>Minhas playlists</h3>
      <div className='grid gap-2 mt-3'>
        {(playlists?.data??[]).map(p=><button key={p.id} type='button' disabled={busy}
          onClick={()=>void open(p.id)}
          className={'text-left min-h-12 border rounded-xl p-3 flex justify-between items-center gap-3 '+
            (selectedId===p.id?'border-blue-600 bg-blue-50':'border-black/10 hover:bg-gray-50')}>
          <span className='min-w-0'>
            <strong className='text-sm block truncate'>{p.name}</strong>
            <span className='text-xs text-black/60'>{p.items_count} itens · {p.status==='draft'?'Rascunho':p.status==='active'?'Ativa':'Arquivada'}</span>
          </span>
          <span className='text-xs text-blue-800 shrink-0'>{p.kind==='tv'?'TV':'Rádio'}</span>
        </button>)}
        {!loading&&playlists?.data.length===0&&<p className='text-sm text-black/50 p-3'>Nenhuma playlist encontrada. Comece com um novo rascunho.</p>}
      </div>
      <div className='flex items-center gap-3 mt-3 text-xs'>
        <button type='button' className={btn} disabled={listPage<=1} onClick={()=>setListPage(x=>x-1)}>Anterior</button>
        <span>{listPage} / {playlists?.pagination.last_page??1}</span>
        <button type='button' className={btn} disabled={!playlists||listPage>=playlists.pagination.last_page}
          onClick={()=>setListPage(x=>x+1)}>Próxima</button>
      </div>

      {kind==='tv'&&<div className='rounded-xl border border-blue-100 bg-blue-50/50 p-4 mt-6'>
        <h3 className='font-bold text-sm flex items-center gap-2'><Upload size={16}/>Enviar minha mídia</h3>
        <p className='text-xs text-black/60 mt-2'>JPG/PNG até 12 MB ou MP4 H.264/AAC até 24 MB e 10 minutos. O servidor valida o arquivo e a cota do plano antes de disponibilizar.</p>
        <div className='grid gap-2 mt-3'>
          <input aria-label='Arquivo de imagem ou vídeo' type='file' accept='image/png,image/jpeg,video/mp4'
            onChange={e=>{const file=e.target.files?.[0]??null;setUploadFile(file);
              setUploadTitle(file?.name.replace(/\.[^.]+$/,'').slice(0,150)??'')}}
            className='text-sm w-full' disabled={uploadBusy}/>
          <input type='text' aria-label='Nome da mídia' placeholder='Nome que aparecerá na biblioteca'
            value={uploadTitle} maxLength={150} onChange={e=>setUploadTitle(e.target.value)}
            className={control+' w-full bg-white'} disabled={uploadBusy}/>
          <button type='button' onClick={()=>void upload()} disabled={!uploadFile||!uploadTitle.trim()||uploadBusy}
            className={btn+' bg-blue-700 text-white border-blue-700 flex items-center gap-2 justify-center'}>
            <Upload size={16}/>{uploadBusy?'Enviando e verificando…':'Enviar para biblioteca'}
          </button>
        </div>
      </div>}
      <h3 className='font-bold text-sm mt-7'>Biblioteca autorizada</h3>
      <p className='text-xs text-black/60 mt-1'>{kind==='tv'?'Imagens e vídeos prontos para TV.':'Músicas com licença e spots exclusivos do estabelecimento.'} Nenhum arquivo é copiado ao criar a playlist.</p>
      {kind==='radio'&&<div className='flex flex-wrap gap-2 mt-3' role='group' aria-label='Fontes de rádio'>
        <button type='button' aria-pressed={radioSource==='music'}
          onClick={()=>{setRadioSource('music');setCatalogPage(1)}}
          className={btn+(radioSource==='music'?' bg-blue-50 border-blue-500':'')}>Músicas licenciadas</button>
        <button type='button' aria-pressed={radioSource==='commercial_spot'}
          onClick={()=>{setRadioSource('commercial_spot');setCatalogPage(1)}}
          className={btn+(radioSource==='commercial_spot'?' bg-blue-50 border-blue-500':'')}>Spots próprios</button>
      </div>}
      <div className='grid gap-2 mt-3'>
        {(catalog?.data??[]).map(source=><div key={source.source_type+'-'+source.source_id}
          className='rounded-xl border border-black/10 p-3 flex gap-3 items-center min-w-0'>
          {source.preview_url&&kind==='tv'&&source.kind==='image'
            ?<img src={source.preview_url} alt='' loading='lazy' className='w-16 h-14 object-cover rounded-lg bg-gray-100'/>
            :<div className='w-12 h-12 shrink-0 rounded-xl flex items-center justify-center bg-blue-50 text-blue-700'>
              {kind==='tv'?<Film size={21}/>:<Headphones size={21}/>}</div>}
          <span className='min-w-0 flex-1'>
            <strong className='text-sm block break-words'>{source.name}</strong>
            <span className='text-xs text-black/60'>{source.kind} · {source.duration_seconds||15}s</span>
          </span>
          <button type='button' onClick={()=>add(source)} disabled={items.length>=30||status!=='draft'||busy}
            className={btn+' text-blue-800 border-blue-100 shrink-0'} aria-label={'Adicionar '+source.name}>
            <Plus size={16} aria-hidden/>
          </button>
        </div>)}
        {!loading&&catalog?.data.length===0&&<p className='p-3 text-sm text-black/60'>Sem mídias licenciadas disponíveis. Solicite à agência que inclua material na biblioteca.</p>}
      </div>
      <div className='flex items-center gap-3 mt-3 text-xs'>
        <button type='button' className={btn} disabled={catalogPage<=1} onClick={()=>setCatalogPage(x=>x-1)}>Anterior</button>
        <span>{catalogPage} / {catalog?.pagination.last_page??1}</span>
        <button type='button' className={btn} disabled={!catalog||catalogPage>=catalog.pagination.last_page}
          onClick={()=>setCatalogPage(x=>x+1)}>Próxima</button>
      </div>
    </div>

    <div className='bg-white rounded-2xl border border-black/10 p-4 sm:p-6 min-w-0'>
      <div className='flex flex-wrap justify-between items-start gap-3'>
        <h2 className='font-bold text-xl'>Montagem e prévia</h2>
        <span className={'rounded-full px-3 py-1 text-xs font-bold '+(status==='draft'?'bg-gray-100':'bg-blue-50 text-blue-800')}>
          {status==='draft'?'Rascunho':status==='active'?'Ativa':'Arquivada'}
        </span>
      </div>
      <div className='mt-5 grid gap-3'>
        <div><label htmlFor='studio-name' className='text-xs block font-bold mb-2'>Nome da programação</label>
          <input id='studio-name' type='text' maxLength={180} value={name} disabled={status!=='draft'}
            onChange={e=>setName(e.target.value)} placeholder='Ex.: Promoções da semana'
            className={control+' w-full'}/></div>
        {kind==='tv'&&<div><label htmlFor='studio-orientation' className='text-xs block font-bold mb-2'>Orientação da TV</label>
          <select id='studio-orientation' className={control+' w-full'} disabled={status!=='draft'}
            value={orientation} onChange={e=>setOrientation(e.target.value as 'landscape'|'portrait')}>
            <option value='landscape'>Horizontal (16:9)</option>
            <option value='portrait'>Vertical (9:16)</option>
          </select>
        </div>}
      </div>
      <div className='flex items-center justify-between gap-2 mt-6'>
        <h3 className='font-bold text-sm'>Sequência de reprodução</h3>
        <span className='text-xs text-black/50'>{items.length}/30 · {Math.floor(totalSeconds/60)}min {totalSeconds%60}s</span>
      </div>
      <div className='mt-3 grid gap-2'>
        {items.map((item,index)=><div key={index} className='rounded-xl border border-black/10 p-3'>
          <div className='flex items-center gap-3 min-w-0'>
            <span className='text-xs font-bold text-blue-700 w-5 shrink-0'>{index+1}</span>
            <div className='min-w-0 flex-1'>
              <span className='text-sm font-semibold block break-words'>{labelFor(item)}</span>
              <span className='text-xs text-black/50'>{item.source_type==='media'?'Imagem/vídeo':item.source_type==='music'?'Música licenciada':'Spot próprio'}</span>
            </div>
            {status==='draft'&&<div className='flex shrink-0 gap-1'>
              <button type='button' disabled={index===0||busy} onClick={()=>move(index,-1)}
                className='min-w-9 min-h-9 rounded-lg border border-black/10 disabled:opacity-30' aria-label={'Subir item '+(index+1)}><ArrowUp size={14} className='mx-auto'/></button>
              <button type='button' disabled={index===items.length-1||busy} onClick={()=>move(index,1)}
                className='min-w-9 min-h-9 rounded-lg border border-black/10 disabled:opacity-30' aria-label={'Descer item '+(index+1)}><ArrowDown size={14} className='mx-auto'/></button>
              <button type='button' disabled={busy} onClick={()=>setItems(old=>old.filter((_,i)=>i!==index))}
                className='min-w-9 min-h-9 rounded-lg border border-red-200 text-red-700' aria-label={'Remover item '+(index+1)}><Trash2 size={14} className='mx-auto'/></button>
            </div>}
          </div>
          <div className='flex flex-wrap items-center gap-3 mt-3'>
            <label className='text-xs text-black/60' htmlFor={'studio-duration-'+index}>Duração em segundos</label>
            <input id={'studio-duration-'+index} type='number' min={1} max={1800}
              disabled={status!=='draft'} value={item.duration_seconds}
              onChange={e=>changeDuration(index,e.target.value)}
              className={control+' w-24'}/>
          </div>
          {kind==='tv'&&item.id&&selectedId&&status==='draft'&&
            <button type='button' className={btn+' border-blue-100 text-blue-800 mt-3 flex items-center gap-2'}
              onClick={()=>setStudioScene(old=>old===item.id?null:item.id!)}>
              <Layers size={15}/> {studioScene===item.id?'Fechar editor visual':'Adicionar texto e modelo visual'}
            </button>}
          {studioScene===item.id&&item.id&&selectedId&&status==='draft'&&
            <ClientStoryEditor key={item.id} token={token} playlistId={selectedId}
              itemId={item.id} previewUrl={previewFor(item)} mediaIsVideo={isVideo(item)} orientation={orientation}
              onSaved={()=>{void open(selectedId)}}/>}
          {previewFor(item)&&kind==='tv'&&
            <div className={'mt-3 rounded-xl bg-gray-100 overflow-hidden mx-auto '+(orientation==='portrait'?'max-w-32':'max-w-sm')}>
              {isVideo(item)
                ?<video controls muted playsInline preload='metadata' src={previewFor(item)}
                    className='w-full max-h-44 object-contain' aria-label={'Prévia de vídeo '+(index+1)}/>
                :<img loading='lazy' src={previewFor(item)} alt={'Prévia da mídia '+(index+1)}
                    className='w-full max-h-44 object-contain'/>}
            </div>}
        </div>)}
        {items.length===0&&<p className='p-6 text-center rounded-xl bg-gray-50 text-black/50 text-sm'>Use + na biblioteca para montar sua sequência.</p>}
      </div>
      <div className='flex flex-wrap gap-2 mt-6'>
        {status==='draft'&&<>
          <button type='button' disabled={!eligible||busy}
            onClick={()=>void save()} className={btn+' bg-blue-700 border-blue-700 text-white flex items-center gap-2'}>
            <Save size={16} aria-hidden/>{busy?'Salvando…':selectedId?'Salvar alterações':'Salvar rascunho'}
          </button>
          {selectedId&&revision&&<button type='button' disabled={busy}
            onClick={()=>void activate()} className={btn+' border-blue-200 text-blue-800 flex items-center gap-2'}>
            <ShieldCheck size={16} aria-hidden/>Ativar playlist
          </button>}
        </>}
        {selectedId&&<button type='button' disabled={busy}
          onClick={()=>void duplicate()} className={btn+' border-black/15 flex items-center gap-2'}>
          <Copy size={16} aria-hidden/>Duplicar como rascunho
        </button>}
        {selectedId&&status==='active'&&<button type='button'
          onClick={()=>onPublish({id:selectedId,kind})} className={btn+' bg-blue-700 text-white border-blue-700 flex items-center gap-2'}>
          <CheckCircle2 size={16} aria-hidden/>Programar nos Players
        </button>}
      </div>
      <p className='text-xs text-black/50 mt-5 leading-6'>
        Mídia de TV: apenas prévia visual temporária disponível; vídeos podem aparecer como arquivo sem miniatura.
        Áudio: mostra a sequência, sem links S3 privados. Ativar a playlist não a envia automaticamente
        aos Players — use a etapa de publicação para selecionar destinos e datas.
      </p>
    </div>
  </section>
}
