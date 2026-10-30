import {useEffect,useRef,useState} from 'react'

type Ratio='16:9'|'9:16'|'1:1'
const sizes:Record<Ratio,[number,number]>={
 '16:9':[1920,1080],'9:16':[1080,1920],'1:1':[1080,1080],
}

/** In-browser pixel crop; Laravel still validates the resulting JPEG bytes. */
export function StudioImageCrop({source,onSave,onCancel}:{
 source:File;onSave:(file:File)=>void;onCancel:()=>void
}){
 const [url,setUrl]=useState('')
 const [ratio,setRatio]=useState<Ratio>('16:9')
 const [zoom,setZoom]=useState(1)
 const [offsetX,setOffsetX]=useState(0)
 const [offsetY,setOffsetY]=useState(0)
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 const image=useRef<HTMLImageElement|null>(null)
 useEffect(()=>{
  const next=URL.createObjectURL(source)
  setUrl(next);setError('')
  image.current=null
  return()=>URL.revokeObjectURL(next)
 },[source])
 const generate=async()=>{
  if(busy)return
  setBusy(true);setError('')
  try{
   const photo=image.current
   if(!photo?.complete||!photo.naturalWidth||!photo.naturalHeight)
    throw Error('A imagem ainda não carregou.')
   const [width,height]=sizes[ratio]
   const canvas=document.createElement('canvas')
   canvas.width=width;canvas.height=height
   const ctx=canvas.getContext('2d')
   if(!ctx)throw Error('Este navegador não permite recortar imagens.')
   const factor=Math.max(width/photo.naturalWidth,height/photo.naturalHeight)*zoom
   const w=photo.naturalWidth*factor,h=photo.naturalHeight*factor
   const dx=(width-w)/2+offsetX/100*Math.max(0,(w-width)/2)
   const dy=(height-h)/2+offsetY/100*Math.max(0,(h-height)/2)
   ctx.drawImage(photo,dx,dy,w,h)
   const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(
    result=>result?resolve(result):reject(Error('Não foi possível gerar o recorte.')),
    'image/jpeg',0.88))
   if(blob.size>12*1024*1024)throw Error('Recorte acima de 12 MB.')
   const name=(source.name.replace(/\.[^.]+$/,'')||'imagem').slice(0,120)
   onSave(new File([blob],name+'-recorte.jpg',{type:'image/jpeg'}))
  }catch(e){setError(e instanceof Error?e.message:'Falha ao recortar imagem.')}
  finally{setBusy(false)}
 }
 return <section aria-label="Ajustar enquadramento da imagem"
  className="mt-3 rounded-xl border border-blue-200 bg-white p-3 space-y-3">
  <h4 className="font-semibold text-sm">Enquadrar imagem</h4>
  <p className="text-xs text-slate-600">Escolha a proporção e ajuste o zoom antes do envio.</p>
  <div className="flex gap-2 flex-wrap" role="group" aria-label="Formato da imagem">
   {(Object.keys(sizes) as Ratio[]).map(key=><button key={key} type="button"
    aria-pressed={ratio===key} onClick={()=>{
     setRatio(key);setZoom(1);setOffsetX(0);setOffsetY(0)
    }} className={'rounded-lg border px-3 py-2 text-sm '+(ratio===key?
     'bg-blue-700 text-white':'bg-white text-blue-700')}>{key}</button>)}
  </div>
  <div className="flex justify-center rounded-xl bg-slate-900 p-3">
   <div className="relative overflow-hidden w-full max-w-[430px] bg-black"
    style={{aspectRatio:ratio.replace(':',' / ')}}>
    {url&&<img src={url} ref={image} alt="Prévia do enquadramento"
     className="absolute inset-0 w-full h-full object-cover"
     style={{transform:'scale('+zoom+') translate('+offsetX/4+'%,'+offsetY/4+'%)'}}
     onError={()=>setError('Não foi possível abrir a imagem.')}/>}
   </div>
  </div>
  <div className="grid gap-2 sm:grid-cols-3">
   {([
    ['Zoom',zoom,1,3,0.05,setZoom],
    ['Horizontal',offsetX,-100,100,5,setOffsetX],
    ['Vertical',offsetY,-100,100,5,setOffsetY],
   ] as const).map(([label,value,min,max,step,update])=><label key={label}
    className="text-xs font-medium">{label} · {value}
    <input type="range" className="block w-full mt-2" min={min} max={max}
     step={step} value={value} onChange={e=>update(Number(e.target.value))}/>
   </label>)}
  </div>
  {error&&<p role="alert" className="text-red-700 text-xs">{error}</p>}
  <div className="flex flex-wrap gap-2">
   <button type="button" onClick={()=>void generate()} disabled={busy}
    className="rounded-lg bg-blue-700 px-3 py-2 text-sm text-white">
    {busy?'Processando…':'Aplicar crop'}
   </button>
   <button type="button" onClick={()=>onSave(source)} disabled={busy}
    className="rounded-lg border px-3 py-2 text-sm">Manter original</button>
   <button type="button" onClick={onCancel} disabled={busy}
    className="rounded-lg border px-3 py-2 text-sm">Cancelar</button>
  </div>
 </section>
}
