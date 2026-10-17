import {ArrowLeft, MonitorPlay} from 'lucide-react'
import SEO from './SEO'
import TvTemplateShowcase from './TvTemplateShowcase'

export default function TvDemoPage(){
 return <main className='min-h-screen bg-[#F5F7FA] text-slate-900'>
   <SEO title='Prévia interativa de TV Indoor' url='/demonstracao-tv'
     description='Simule composições de TV Indoor por segmento e orientação, sem publicar ou transmitir conteúdo.' />
   <header className='bg-white border-b border-slate-200'>
     <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-4 flex-wrap justify-between items-center'>
       <a href='/' className='inline-flex gap-2 font-bold items-center text-lg'><MonitorPlay className='text-blue-700' size={22} aria-hidden/> Meu Comercial</a>
       <a href='/' className='inline-flex gap-2 text-sm text-blue-700 font-semibold min-h-11 items-center'><ArrowLeft size={16} aria-hidden/> Voltar ao site</a>
     </div>
   </header>
   <TvTemplateShowcase/>
 </main>
}
