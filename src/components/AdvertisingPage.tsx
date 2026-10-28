import {ArrowLeft, Megaphone} from 'lucide-react'
import SEO from './SEO'
import AdvertisingCatalogue from './AdvertisingCatalogue'

export default function AdvertisingPage(){
 return <main className='min-h-screen bg-[#F5F7FA] text-slate-900'>
   <SEO title='Publicidade em Rádio e TV Indoor' url='/anunciar'
     description='Conheça formatos ilustrativos de publicidade Indoor e envie pedido de orçamento com consentimento, sem reserva automática.' />
   <header className='bg-white border-b border-slate-200'>
     <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-4 flex-wrap justify-between items-center'>
       <a href='/' className='inline-flex gap-2 font-bold items-center text-lg'><Megaphone className='text-blue-700' size={22} aria-hidden/> Meu Comercial</a>
       <a href='/' className='inline-flex gap-2 text-sm text-blue-700 font-semibold min-h-11 items-center'><ArrowLeft size={16} aria-hidden/> Voltar ao site</a>
     </div>
   </header>
   <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7'><a href='/contratar?kind=advertiser' className='inline-flex items-center justify-center min-h-11 rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-semibold'>Montar pedido comercial guiado</a></div>
   <AdvertisingCatalogue/>
 </main>
}
