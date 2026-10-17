import {AlertCircle, ChevronRight, Sparkles, Loader2} from 'lucide-react'
import {motion, AnimatePresence} from 'motion/react'
import type React from 'react'

export default function StrategicConsultant({selectedSegment, setSelectedSegment, additionalDetails, setAdditionalDetails, consultResponse, consultError, isConsulting, handleStrategyConsult, parseMarkdownToJSX, openLeadModal}: {selectedSegment:string; setSelectedSegment:(v:string)=>void; additionalDetails:string; setAdditionalDetails:(v:string)=>void; consultResponse:string; consultError:string; isConsulting:boolean; handleStrategyConsult:(e:React.FormEvent)=>Promise<void>; parseMarkdownToJSX:(md:string)=>React.ReactNode; openLeadModal:(s:string)=>void}) {
  return (
    <>
{/* --- STRATEGIC CONSULTANT --- */}
      <section id="consultor-estrategico" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#F5F5F7]">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center mb-12 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold self-center">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Exclusivo: Diagnóstico Estratégico Integrado</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1D1D1F] tracking-tight">
              Gere um Plano de Conteúdo Customizado Instantaneamente
            </h2>
            <p className="text-black/60 text-sm sm:text-base leading-relaxed">
              Dúvidas sobre o que exibir em suas TVs? Selecione o seu segmento de negócio, adicione alguma particularidade e receba orientações ilustrativas por segmento, não um diagnóstico individual automatizado.
            </p>
          </div>

          {/* Form and Strategic Display Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-black/5 shadow-md">
            
            <form onSubmit={handleStrategyConsult} className="flex flex-col gap-6">
              
              {/* Step 1: Segment Selector */}
              <div>
                <label className="text-xs text-black/50 uppercase font-mono tracking-wider font-semibold block mb-3">
                  Passo 1: Selecione seu segmento de negócio
                </label>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: "escritorio", name: "Escritório", label: "🏢 Escritório" },
                    { id: "varejo", name: "Varejo/Lojas", label: "🛍️ Varejo/Ofertas" },
                    { id: "academia", name: "Academia", label: "🏋️ Academia" },
                    { id: "clinica", name: "Clínicas/Espera", label: "🏥 Clínica/Espera" },
                    { id: "geral", name: "Outro Negócio", label: "📺 Outro Segmento" }
                  ].map((seg) => (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setSelectedSegment(seg.id)}
                      className={`p-3 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                        selectedSegment === seg.id
                          ? "bg-blue-600 text-white border-transparent shadow-sm scale-[1.03]"
                          : "bg-[#F5F5F7] text-black/70 hover:text-black border-black/5 hover:border-black/10 hover:bg-black/5"
                      }`}
                    >
                      {seg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Details */}
              <div>
                <label className="text-xs text-black/50 uppercase font-mono tracking-wider font-semibold block mb-2">
                  Passo 2: Adicione alguma observação ou dor da sua equipe (Opcional)
                </label>
                <textarea
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Exemplo: 'Temos dificuldade em divulgar as datas de aniversários e as metas diárias da fábrica, as pessoas ignoram os cartazes impressos...'"
                  rows={3}
                  className="w-full bg-[#F5F5F7] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 placeholder:text-black/40 transition-all duration-200"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isConsulting}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isConsulting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    Formatando Plano de Conteúdo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    Ver sugestões por segmento
                  </>
                )}
              </button>

            </form>

            {/* ERROR DISPLAY */}
            {consultError && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-sm text-red-600">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{consultError}</span>
              </div>
            )}

            {/* RESULTS VIEW */}
            <AnimatePresence>
              {consultResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 pt-8 border-t border-black/10"
                >
                  <div className="p-5 sm:p-7 rounded-2xl bg-[#F5F5F7] border border-black/5 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                      <span className="text-xs bg-blue-50 border border-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        Sugestões de conteúdo disponíveis
                      </span>
                      <span className="text-[10px] text-black/40 font-mono">Gerado em: 2026</span>
                    </div>

                    {/* Markdown strategy content container */}
                    <div className="text-left text-black/80 space-y-4 max-h-[380px] overflow-y-auto pr-2 no-scrollbar">
                      {parseMarkdownToJSX(consultResponse)}
                    </div>

                    {/* Strategic CTA */}
                    <div className="mt-6 pt-5 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-xs text-black/50 text-center sm:text-left font-medium">
                        💡 Gostou do plano? A configuração de equipamentos e modelos depende do escopo contratado.
                      </p>
                      <button
                        onClick={() => openLeadModal(`Consultor Estratégico - ${selectedSegment}`)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer sm:whitespace-nowrap"
                      >
                        Quero Implementar Esse Plano
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>

      
    </>
  )
}
