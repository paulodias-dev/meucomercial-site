import {useState} from 'react'
import {ArrowRight, LayoutTemplate, MonitorPlay, RotateCcw} from 'lucide-react'
import {commercialContactUrl} from '../lib/commercialIntent.mjs'

type Template={id:string;name:string;summary:string;heading:string;note:string;accent:string}
export const tvExamples: Template[]=[
  {id:'boas-vindas',name:'Recepção e boas-vindas',summary:'Mensagem para visitantes e equipes',heading:'Bem-vindos à nossa unidade',note:'Informações gerais e horário de atendimento',accent:'#2563eb'},
  {id:'promocoes',name:'Ofertas ilustrativas',summary:'Destaque para campanhas aprovadas',heading:'Suas novidades em destaque',note:'Preços e ofertas dependem de aprovação',accent:'#0f766e'},
  {id:'avisos',name:'Avisos e comunicados',summary:'Orientações e lembretes de operação',heading:'Comunicados da equipe',note:'Confira as informações do dia',accent:'#7c3aed'},
  {id:'institucional',name:'Institucional e serviços',summary:'Apresente sua empresa e seus diferenciais',heading:'Conheça nossos serviços',note:'Inclua imagens e textos com direitos de uso',accent:'#b45309'},
]
const safeText=(x:string)=>x.trim().slice(0,80)

export default function TvTemplateShowcase(){
  const [chosen,setChosen]=useState(tvExamples[0].id)
  const [orientation,setOrientation]=useState<'horizontal'|'vertical'>('horizontal')
  const [headline,setHeadline]=useState('')
  const selected=tvExamples.find(x=>x.id===chosen)??tvExamples[0]
  const contact=commercialContactUrl({kind:'establishment',medium:'tv',source:'tv-demo'},window.location.search)
  return <section aria-labelledby='tv-demo-head' className='py-10 sm:py-14'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='max-w-2xl'>
        <p className='text-xs uppercase tracking-widest text-blue-700 font-bold flex gap-2 items-center'><LayoutTemplate size={17} aria-hidden/> Modelos visuais</p>
        <h2 id='tv-demo-head' className='font-display text-2xl sm:text-3xl font-bold mt-2'>Escolha um modelo e veja a composição</h2>
        <p className='text-sm leading-6 text-slate-600 mt-3'>Personalize um exemplo local sem publicar conteúdo. Os modelos representam ideias de layout, não um arquivo final do Story Builder ou uma transmissão ao vivo.</p>
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8 items-start'>
        <div className='xl:col-span-4'>
          <div role='group' aria-label='Escolha um exemplo de TV' className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2'>
            {tvExamples.map(item=><button key={item.id} type='button' aria-pressed={chosen===item.id}
              onClick={()=>{setChosen(item.id);setHeadline('')}}
              className={'text-left rounded-xl border p-4 min-h-16 focus-visible:outline-2 focus-visible:outline-blue-700 '+
                (chosen===item.id?'border-blue-700 bg-blue-50':'border-slate-200 bg-white hover:border-blue-300')}>
              <strong className='block text-sm'>{item.name}</strong><span className='text-xs text-slate-600 block mt-1'>{item.summary}</span>
            </button>)}
          </div>
          <fieldset className='mt-5'>
            <legend className='text-sm font-semibold'>Orientação da prévia</legend>
            <div className='flex gap-2 mt-2'>
              {(['horizontal','vertical'] as const).map(value=><button key={value} type='button'
                aria-pressed={orientation===value} onClick={()=>setOrientation(value)}
                className={'border rounded-lg min-h-11 px-4 text-sm font-medium '+(orientation===value?'bg-blue-700 text-white':'bg-white text-slate-700')}>
                {value==='horizontal'?'Horizontal (16:9)':'Vertical (9:16)'}
              </button>)}
            </div>
          </fieldset>
          <label htmlFor='tv-demo-headline' className='block text-sm font-semibold mt-5'>Mensagem de exemplo</label>
          <input id='tv-demo-headline' maxLength={80} value={headline} onChange={e=>setHeadline(safeText(e.target.value))}
            placeholder='Escreva um título para a tela'
            className='mt-2 w-full rounded-xl border border-slate-300 p-3 min-h-11 text-sm bg-white' />
          <button type='button' className='mt-2 text-xs underline underline-offset-2 flex items-center gap-1 min-h-11'
            onClick={()=>setHeadline('')}><RotateCcw size={15} aria-hidden/> Restaurar mensagem padrão</button>
        </div>
        <div className='xl:col-span-8 bg-slate-900 rounded-3xl p-4 sm:p-8 text-white'>
          <div className='flex items-center justify-between gap-3 flex-wrap mb-5'>
            <span className='text-xs font-semibold inline-flex gap-2 items-center'><MonitorPlay size={18} aria-hidden/> Prévia local — não publicada</span>
            <span className='text-xs text-blue-200'>Simulação {orientation==='horizontal'?'16:9':'9:16'}</span>
          </div>
          <div className='flex justify-center'>
            <div data-testid='tv-preview' aria-label={'Prévia '+selected.name} role='img'
              className={'relative w-full max-w-2xl border-[6px] border-slate-600 rounded-xl shadow-2xl overflow-hidden flex flex-col justify-between transition-[max-width] '+(orientation==='vertical'?'max-w-[310px]':'')}
              style={{aspectRatio:orientation==='horizontal'?'16 / 9':'9 / 16',background:'linear-gradient(125deg,'+selected.accent+',#0c172b)'}}>
              <div className='p-5 sm:p-8 relative z-10'>
                <div className='text-xs tracking-widest uppercase text-white/80'>Exemplo de comunicação</div>
                <strong className='block text-xl sm:text-3xl font-bold leading-tight mt-5 break-words'>{headline||selected.heading}</strong>
                <p className='text-xs sm:text-sm mt-4 text-white/85'>{selected.note}</p>
              </div>
              <div className='px-5 py-3 bg-black/30 text-xs text-white/75'>Meu Comercial · demonstração ilustrativa</div>
            </div>
          </div>
          <p className='mt-5 text-xs leading-5 text-slate-300'>Esta prévia usa somente texto e cores locais. Não consulta playlists privadas, não grava rascunhos e não comprova a reprodução em equipamentos.</p>
          <a href={contact} className='mt-5 inline-flex items-center justify-center gap-2 bg-white text-blue-900 rounded-xl px-5 min-h-11 text-sm font-bold hover:bg-blue-50'>
            Conversar sobre implantação de TV <ArrowRight size={17} aria-hidden/>
          </a>
        </div>
      </div>
    </div>
  </section>
}
