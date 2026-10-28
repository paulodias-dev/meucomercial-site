import SEO from './SEO'
import AcquisitionWizard from './AcquisitionWizard'
import {ArrowLeft, Megaphone} from 'lucide-react'
export default function AcquisitionPage(){
 return <main className="min-h-screen bg-[#F5F7FA] text-slate-900">
  <SEO title="Solicitar planos e propostas Indoor" url="/contratar"
   description="Consulte planos e oportunidades oficiais de TV/Rádio Indoor e solicite condições com consentimento, sem cobrança automática."/>
  <header className="bg-white border-b">
   <nav aria-label="Navegação" className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
    <a href="/" className="flex gap-2 items-center font-bold text-lg"><Megaphone size={22} className="text-blue-700" aria-hidden/>Meu Comercial</a>
    <div className="flex flex-wrap gap-4"><a href="/acompanhar" className="min-h-11 inline-flex items-center text-sm font-semibold text-blue-800">Acompanhar pedido</a><a href="/" className="flex gap-2 items-center min-h-11 text-sm font-semibold text-blue-800"><ArrowLeft size={18} aria-hidden/>Voltar ao site</a></div>
   </nav>
  </header>
  <AcquisitionWizard/>
 </main>
}
