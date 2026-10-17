import {PhoneCall, Check} from 'lucide-react'

export default function FinalContactCTA({openLeadModal}: {openLeadModal:(s:string)=>void}) {
  return (
    <>
{/* --- FINAL CALL TO ACTION (BOTTOM CTA) --- */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-5xl mx-auto relative">
          
          {/* Card Body */}
          <div className="rounded-3xl bg-[#F5F5F7] border border-black/5 p-8 sm:p-14 text-center relative overflow-hidden shadow-sm">
            {/* Background blur decorative circles inside */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-550/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-550/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mx-auto flex flex-col gap-6 relative z-10">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">Seja Digital Hoje Mesmo</span>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#1D1D1F] tracking-tight leading-tight">
                Planeje sua operação de TV, Rádio ou publicidade com mais clareza
              </h2>
              <p className="text-black/60 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
                Escolha o público e descreva seus pontos de mídia, necessidades e objetivos. Nossa equipe poderá avaliar escopo, licenças, condições e investimento, sem prometer um retorno financeiro que ainda não foi medido.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-4">
                <button
                  onClick={() => openLeadModal("CTA Final")}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <PhoneCall className="w-4 h-4 text-white" />
                  Solicitar proposta personalizada
                </button>
                <a
                  href="#recursos"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-white hover:bg-black/5 text-[#1D1D1F] border border-black/10 hover:border-black/20 transition-all duration-200 flex items-center justify-center shadow-sm"
                >
                  Conhecer Mais Recursos
                </a>
              </div>

              {/* Guarantees list */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-black/50 font-mono font-semibold">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Condições contratuais sob consulta
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Suporte conforme o plano contratado
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Demonstração disponível mediante avaliação comercial
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      
    </>
  )
}
