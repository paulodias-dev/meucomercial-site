import {ArrowLeft, Radio} from 'lucide-react'
import SEO from './SEO'
import RadioGuide from './RadioGuide'

/** Public, standalone and demonstrative: no client data and no authenticated Player. */
export default function RadioShowcasePage() {
  const contact = () => {
    window.location.assign('/?interesse=radio#planos')
  }
  return <div className='min-h-screen bg-[#F5F7FA] text-slate-900'>
    <SEO title='Demonstração de Rádio Indoor' url='/radio-indoor'
      description='Ouça locuções demonstrativas locais e conheça a grade, direitos de músicas e os processos de publicação da Rádio Indoor.' />
    <header className='bg-white border-b border-black/10'>
      <nav aria-label='Navegação da demonstração' className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-4 items-center justify-between'>
        <a href='/' className='flex items-center gap-2 font-display font-bold text-lg'><Radio className='text-blue-700' size={22} aria-hidden /> Meu Comercial</a>
        <a href='/' className='flex gap-2 items-center text-sm font-semibold text-blue-700 min-h-11'><ArrowLeft size={17} aria-hidden /> Voltar ao site</a>
      </nav>
    </header>
    <main>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-9'>
        <p className='text-xs uppercase tracking-widest text-blue-700 font-bold'>Exemplo de áudio gerado no navegador</p>
        <h1 className='text-3xl sm:text-4xl font-display font-bold mt-2'>Demonstração de Rádio Indoor</h1>
        <p className='text-sm leading-7 mt-3 max-w-2xl text-slate-600'>Esta página mostra uma grade editorial ilustrativa e locuções produzidas pelo sintetizador do navegador. Ela não transmite músicas, não executa um Player contratado e não comprova veiculação ou audiência.</p>
      </div>
      <RadioGuide onContact={contact} />
    </main>
    <footer className='bg-white border-t border-black/10 px-4 py-8 text-center text-xs text-slate-600'>
      A programação real e o licenciamento dependem de contrato e homologação. <a className='text-blue-700 underline' href='/#planos'>Solicitar proposta</a>.
    </footer>
  </div>
}
