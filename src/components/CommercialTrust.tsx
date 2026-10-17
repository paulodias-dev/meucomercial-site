import {ClipboardCheck, Headphones, MonitorCheck} from 'lucide-react'

const checks = [
  {title: 'Compatibilidade do equipamento', description: 'Confirme modelo da TV ou aparelho de áudio, navegador, rede e codecs antes da implantação.', Icon: MonitorCheck},
  {title: 'Direitos sobre as mídias', description: 'O uso comercial de músicas, fotos, vídeos e campanhas depende das respectivas autorizações e licenças.', Icon: Headphones},
  {title: 'Proposta e condições', description: 'Preços, prazos, período de teste e suporte somente após confirmação formal na proposta contratual.', Icon: ClipboardCheck},
]

/** Product facts, not fictitious customers or unapproved contract terms. */
export default function CommercialTrust() {
  return <section className='border-y border-black/5 bg-slate-100/70 py-12 px-4 sm:px-6 lg:px-8' aria-labelledby='contract-checks'>
    <div className='max-w-7xl mx-auto'>
      <h2 id='contract-checks' className='text-xl sm:text-2xl font-bold font-display text-center text-slate-900'>O que conferir antes de contratar</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-7'>
        {checks.map(({title,description,Icon})=><article key={title} className='rounded-2xl bg-white p-5 border border-black/5 flex items-start gap-3'>
          <Icon size={22} aria-hidden className='text-blue-700 shrink-0' />
          <div><h3 className='font-semibold text-sm'>{title}</h3><p className='text-xs leading-5 mt-1 text-slate-600'>{description}</p></div>
        </article>)}
      </div>
    </div>
  </section>
}
