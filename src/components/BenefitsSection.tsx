import {Users, Clock, Zap, Monitor} from 'lucide-react'

export default function BenefitsSection() {
  return (
    <>
{/* --- PROBLEMA VS. SOLUÇÃO --- */}
      <section id="beneficios" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">Como Funciona</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1D1D1F] tracking-tight">
              Comece com as TVs que você já tem. Ou receba tudo pronto para ligar.
            </h2>
            <p className="text-black/60 text-sm sm:text-base leading-relaxed">
              Assine apenas o software para gerenciar suas telas atuais ou escolha a solução completa com equipamento homologado. Em ambos os casos, a instalação é plug-and-play: conectou, entrou na internet e começou a publicar, sem depender de conhecimento técnico.
            </p>
          </div>

          {/* Grid Cards (Apple style Bento) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-black/10 shadow-sm transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-100 transition-colors">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-2 font-display">Mais controle, menos operação manual</h3>
                <p className="text-black/50 text-sm leading-relaxed">
                  Atualize uma ou várias unidades a partir de um único painel e elimine pendrives, deslocamentos e improvisos na rotina.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-black/10 shadow-sm transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-100 transition-colors">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-2 font-display">Campanhas no ar no momento certo</h3>
                <p className="text-black/50 text-sm leading-relaxed">
                  Troque ofertas, recados e avisos em segundos para aproveitar picos de venda, ações sazonais e comunicados urgentes.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-black/10 shadow-sm transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-100 transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-2 font-display">Implantação sem complicação</h3>
                <p className="text-black/50 text-sm leading-relaxed">
                  Use suas TVs atuais com a assinatura do sistema ou peça software + hardware pronto para uso. Ligou, conectou e começou.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-black/10 shadow-sm transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-100 transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-2 font-display">Mais atenção, mais resultado</h3>
                <p className="text-black/50 text-sm leading-relaxed">
                  Transforme recepções, lojas, clínicas, academias e áreas internas em canais que engajam pessoas e ajudam a vender mais.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      
    </>
  )
}
