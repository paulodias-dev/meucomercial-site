import {Check, X} from 'lucide-react'
import {motion, AnimatePresence} from 'motion/react'
import type React from 'react'
import type {CommercialAudience} from './AudienceJourneys'
import type {LeadFormData} from './MarketingTypes'

export default function LeadContactModal({isModalOpen, setIsModalOpen, leadKind, formSubmitted, formSubmitting, formError, formData, setFormData, privacyConsent, setPrivacyConsent, companyWebsite, setCompanyWebsite, handleLeadSubmit}: {isModalOpen:boolean; setIsModalOpen:(v:boolean)=>void; leadKind:CommercialAudience; formSubmitted:boolean; formSubmitting:boolean; formError:string; formData:LeadFormData; setFormData:React.Dispatch<React.SetStateAction<LeadFormData>>; privacyConsent:boolean; setPrivacyConsent:(v:boolean)=>void; companyWebsite:string; setCompanyWebsite:(v:string)=>void; handleLeadSubmit:(e:React.FormEvent)=>Promise<void>}) {
  return (
    <>
{/* --- LEAD BOOKING MODAL (DEMONSTRATION AND SPECIALIST) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4">
            
            {/* Dark glass backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative my-4 w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white border border-black/15 rounded-3xl p-5 sm:p-8 shadow-2xl z-10"
            >
              
              {/* Corner accent glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-blue-600 block mb-1 font-bold">
                    Demonstração • Meu Comercial
                  </span>
                  <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">
                    {leadKind === 'advertiser' ? 'Solicitar proposta de publicidade' :
                      leadKind === 'agency' ? 'Conhecer planos para agência' :
                      'Agendar conversa sobre TV e Rádio'}
                  </h3>
                  <p className="text-xs text-black/60 mt-1">
                    Conte sobre sua empresa. Nossa equipe analisará a solicitação e entrará em contato.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-black/40 hover:text-[#1D1D1F] hover:bg-black/5 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center flex flex-col items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-[#1D1D1F]">Solicitação Recebida!</h4>
                  <p className="text-sm text-black/60 max-w-xs mx-auto">
                    Obrigado, <strong>{formData.nome || "parceiro"}</strong>! Seu pedido foi registrado. A equipe comercial entrará em contato pelos dados informados.
                  </p>
                  <button type="button" className="text-xs text-blue-700 underline" onClick={() => setIsModalOpen(false)}>Fechar</button>
                </motion.div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="lead-kind" className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">Como deseja usar o Meu Comercial?</label>
                    <select id="lead-kind" value={leadKind} onChange={e => setLeadKind(e.target.value as typeof leadKind)} className="w-full rounded-xl border border-black/10 bg-white p-2.5 text-xs">
                      <option value="establishment">Operar TV ou Rádio no meu estabelecimento</option>
                      <option value="agency">Gerenciar clientes como agência</option>
                      <option value="advertiser">Comprar espaços de publicidade em TV/Rádio</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">Seu Nome *</label>
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        placeholder="Nome completo"
                        className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 shadow-sm placeholder:text-black/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">Empresa *</label>
                      <input
                        type="text"
                        required
                        value={formData.empresa}
                        onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                        placeholder="Nome da sua empresa"
                        className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 shadow-sm placeholder:text-black/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">E-mail Corporativo *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="nome@empresa.com.br"
                        className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 shadow-sm placeholder:text-black/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">WhatsApp / Telefone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 shadow-sm placeholder:text-black/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {leadKind === 'establishment' && <div>
                      <label htmlFor="establishment-tvs" className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">Quantidade de TVs (estimativa)</label>
                      <select id="establishment-tvs"
                        value={formData.telas}
                        onChange={(e) => setFormData({...formData, telas: e.target.value})}
                        className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 shadow-sm"
                      >
                        <option value="1">1 Ponto de TV</option>
                        <option value="2">2 Pontos de TV</option>
                        <option value="3">3 a 5 Pontos de TV</option>
                        <option value="6">6 a 15 Pontos de TV</option>
                        <option value="16">Mais de 15 TVs</option>
                      </select>
                    </div>}
                    {leadKind === 'establishment' && <div>
                      <label htmlFor="establishment-segment" className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">Segmento do estabelecimento</label>
                      <select id="establishment-segment"
                        value={formData.segmento}
                        onChange={(e) => setFormData({...formData, segmento: e.target.value})}
                        className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 shadow-sm"
                      >
                        <option value="escritorio">🏢 Escritório Corporativo</option>
                        <option value="varejo">🛍️ Varejo / Supermercados</option>
                        <option value="academia">🏋️ Academia / Fitness</option>
                        <option value="clinica">🏥 Clínicas / Saúde</option>
                        <option value="geral">📺 Outro Segmento</option>
                      </select>
                    </div>}
                  </div>

                  <div>
                    <label htmlFor="lead-details" className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">
                      {leadKind === 'advertiser' ? 'Locais, período e mídia desejados' : 'Detalhes de sua operação (opcional)'}
                    </label>
                    <textarea id="lead-details"
                      value={formData.mensagem}
                      onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                      placeholder={leadKind === 'advertiser'
                        ? 'Informe cidades, período, formato TV/Rádio e público desejado.'
                        : leadKind === 'agency'
                        ? 'Informe tamanho da carteira, pontos de mídia e estrutura atual.'
                        : 'Quais aparelhos você tem e quais conteúdos quer programar?'}
                      rows={2}
                      className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 shadow-sm placeholder:text-black/30"
                    />
                  </div>

                  <input aria-hidden="true" tabIndex={-1} autoComplete="off"
                    style={{position: "absolute", left: "-10000px"}}
                    value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)}
                    name="website" />
                  <label className="flex gap-2.5 items-start text-xs text-black/70 leading-relaxed">
                    <input type="checkbox" checked={privacyConsent}
                      onChange={e => setPrivacyConsent(e.target.checked)}
                      required className="mt-0.5 accent-blue-600" />
                    <span>Autorizo o contato comercial do Meu Comercial por e-mail ou WhatsApp sobre esta solicitação. Meus dados serão utilizados para este atendimento.</span>
                  </label>
                  {formError && <div role="alert" aria-live="polite" className="rounded-lg border border-red-200 bg-red-50 text-red-800 p-3 text-xs">{formError}</div>}
                  {/* Submission buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 rounded-xl bg-black/5 hover:bg-black/10 text-black border border-black/5 text-xs font-semibold text-center cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={formSubmitting || !privacyConsent}
                      className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold text-center shadow-sm transition-all cursor-pointer"
                    >
                      {formSubmitting ? "Registrando..." : "Enviar solicitação"}
                    </button>
                  </div>

                  <span className="block text-[9px] text-center text-black/40 font-mono mt-2 font-semibold">
                    Seus dados são usados para atender ao pedido. Não realizamos contratação ou cobrança a partir deste formulário.
                  </span>

                </form>
              )}

            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </>
  )
}
