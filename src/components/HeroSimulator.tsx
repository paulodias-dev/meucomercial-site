import {Calendar, Play, TrendingUp, Clock, CloudSun, ArrowRight, Zap, Monitor, QrCode, ShieldCheck} from 'lucide-react'
import {motion, AnimatePresence} from 'motion/react'
import type {TVLayout} from './MarketingTypes'

export default function HeroSimulator({activeLayout, setActiveLayout, layouts, customTickerText, setCustomTickerText, simulatedClockTime, openLeadModal}: {activeLayout:string; setActiveLayout:(v:string)=>void; layouts:TVLayout[]; customTickerText:string; setCustomTickerText:(v:string)=>void; simulatedClockTime:string; openLeadModal:(s:string)=>void}) {
  return (
    <>
{/* --- HERO SECTION --- */}
      <section id="simulador" className="relative pt-24 pb-16 sm:pt-28 md:pt-32 md:pb-24 lg:pt-36 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold self-center lg:self-start shadow-sm">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              <span>Software em nuvem com hardware opcional</span>
            </div>

            <h1 className="font-display font-extrabold text-[2.35rem] sm:text-5xl lg:text-6xl text-[#1D1D1F] leading-[1.08] tracking-tight">
              Transforme suas <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TVs em um canal</span> que informa equipes e vende mais no ponto de venda
            </h1>

            <p className="text-black/60 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Gerencie telas remotamente, atualize campanhas em segundos e leve mais impacto para comunicados internos, promoções, ofertas e avisos importantes. Use as TVs que você já tem ou receba a solução completa pronta para ligar.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mt-2">
              <button 
                onClick={() => openLeadModal("Hero CTA Principal")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Quero Ver Minha TV em Ação
                <ArrowRight className="w-4 h-4" />
              </button>
              <a 
                href="#simulador"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-sm bg-white hover:bg-black/5 text-[#1D1D1F] border border-black/10 hover:border-black/20 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <Play className="w-4 h-4 text-blue-600" />
                Ver como funciona
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-black/5 max-w-md mx-auto lg:mx-0 mt-4">
              <div className="text-center lg:text-left">
                <span className="block text-2xl font-bold text-[#1D1D1F] font-display">10s</span>
                <span className="text-xs text-black/40">Para atualizar a tela</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-2xl font-bold text-[#1D1D1F] font-display">100%</span>
                <span className="text-xs text-black/40">Gestão na nuvem</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-2xl font-bold text-[#1D1D1F] font-display">+80%</span>
                <span className="text-xs text-black/40">De engajamento</span>
              </div>
            </div>

          </div>

          {/* Hero Right: Interactive TV Simulator Mockup */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            <div className="w-full max-w-lg lg:max-w-xl">
              {/* Virtual TV Header Label */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 px-1">
                <span className="text-xs text-black/50 font-mono flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  Simulador de TV On-line
                </span>
                <span className="text-xs text-blue-600 font-semibold">Tente mudar o Layout abaixo!</span>
              </div>

              {/* TV FRAME */}
              <div className="relative aspect-video w-full rounded-2xl bg-black border-4 border-[#1D1D1F] shadow-2xl overflow-hidden flex flex-col">
                
                {/* Simulated Content inside TV */}
                <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col bg-[#050508] select-none">
                  
                  <AnimatePresence mode="wait">
                    {/* --- LAYOUT 1: MULTIZONA --- */}
                    {activeLayout === "multizona" && (
                      <motion.div 
                        key="multizona"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full flex flex-col text-white"
                      >
                        {/* Upper Content Areas */}
                        <div className="flex-1 grid grid-cols-12 gap-1.5 p-1.5 min-h-0">
                          
                          {/* Main News Zone */}
                          <div className="col-span-8 bg-[#090a12]/90 rounded-lg p-3 border border-white/5 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-[9px] bg-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Boletim Interno</span>
                                <span className="text-[8px] text-gray-400">Canal Principal</span>
                              </div>
                              <h4 className="text-sm font-semibold text-white tracking-tight leading-tight">
                                Grande Convenção Anual de Colaboradores: Inscrições Abertas!
                              </h4>
                              <p className="text-[10px] text-gray-400 mt-1.5 line-clamp-2">
                                Participe do nosso maior encontro de inovação. Acesse o portal corporativo e garanta sua vaga para os workshops estratégicos de 2026.
                              </p>
                            </div>
                            
                            {/* Graphic mockup bar */}
                            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                              <span className="text-[8px] text-gray-500 font-mono">Postado por Comunicação Interna</span>
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                              </div>
                            </div>
                          </div>

                          {/* Sidebar Widgets (Weather + Time + QR) */}
                          <div className="col-span-4 flex flex-col gap-1.5">
                            
                            {/* Time & Weather */}
                            <div className="bg-[#0c0d16] rounded-lg p-2 border border-white/5 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-gray-400 block font-mono">São Paulo</span>
                                <span className="text-base font-bold font-mono tracking-tight text-white leading-none">
                                  {simulatedClockTime || "12:00"}
                                </span>
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <CloudSun className="w-5 h-5 text-amber-400 animate-pulse" />
                                <span className="text-[9px] font-mono font-medium text-gray-300">22°C</span>
                              </div>
                            </div>

                            {/* Live QR Code Widget */}
                            <div className="flex-1 bg-[#0b0c14] rounded-lg p-2.5 border border-white/5 flex flex-col items-center justify-center text-center gap-1">
                              <QrCode className="w-10 h-10 text-white" />
                              <span className="text-[7px] text-gray-400 leading-tight">
                                Acesse os benefícios pelo celular
                              </span>
                              <span className="text-[8px] font-bold text-blue-400 uppercase font-mono">Escaneie Aqui</span>
                            </div>

                          </div>
                        </div>

                        {/* Scrolling Ticker Line (Bottom Bar) */}
                        <div className="h-6 bg-[#0066cc] flex items-center overflow-hidden whitespace-nowrap px-3 text-[10px] font-medium text-white select-none border-t border-white/10 relative contain-layout">
                          <div className="absolute left-0 top-0 bottom-0 bg-[#0055b3] px-2 flex items-center font-bold text-[8px] uppercase tracking-wider z-10 shadow-md">
                            Avisos URGENTES
                          </div>
                          <div className="ticker-marquee">
                            <span>{customTickerText}</span>
                            <span className="text-blue-400">•</span>
                            <span>{customTickerText}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* --- LAYOUT 2: METAS --- */}
                    {activeLayout === "metas" && (
                      <motion.div 
                        key="metas"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full p-3 bg-gradient-to-b from-[#090a16] to-[#040409] flex flex-col justify-between text-white"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold uppercase tracking-wider">Painel Comercial de Vendas</span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-400">Atualizado: Agora</span>
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-2 gap-3 my-2 flex-1">
                          
                          {/* Metas Card */}
                          <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 flex flex-col justify-between">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wide">Meta Mensal de Junho</span>
                            <div>
                              <span className="text-xl font-extrabold text-emerald-400">92,4%</span>
                              <div className="w-full bg-white/10 rounded-full h-1.5 mt-1 overflow-hidden">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "92%" }}></div>
                              </div>
                            </div>
                            <span className="text-[8px] text-gray-500">Faltam R$ 15.200 para bater 100%!</span>
                          </div>

                          {/* Highlight Employee */}
                          <div className="bg-gradient-to-tr from-blue-500/20 to-transparent rounded-lg p-2.5 border border-blue-500/20 flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-500/40 flex items-center justify-center font-bold text-white shadow-inner">
                              LR
                            </div>
                            <div className="flex-1">
                              <span className="text-[8px] text-blue-400 uppercase font-bold tracking-wider block">Destaque do Mês</span>
                              <span className="text-xs font-bold block text-white">Lucas Rocha</span>
                              <span className="text-[9px] text-gray-400">114% da meta atingida</span>
                            </div>
                          </div>

                        </div>

                        {/* Bottom line */}
                        <div className="bg-white/5 rounded px-2 py-1 text-center text-[9px] text-gray-400 font-mono">
                          🏆 Juntos somos mais fortes! Parabéns à equipe comercial pelo engajamento extraordinário.
                        </div>
                      </motion.div>
                    )}

                    {/* --- LAYOUT 3: BOAS-VINDAS --- */}
                    {activeLayout === "boasvindas" && (
                      <motion.div 
                        key="boasvindas"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full p-4 bg-[#0a0614] flex flex-col justify-between text-white relative overflow-hidden"
                      >
                        {/* Abstract background blobs inside TV */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />

                        {/* Header logo marker */}
                        <div className="flex justify-between items-center z-10">
                          <span className="text-[9px] font-mono tracking-widest text-blue-400 uppercase font-semibold">Meu Comercial Lounge</span>
                          <span className="text-[8px] text-gray-500 font-mono">IP: 192.168.1.104</span>
                        </div>

                        {/* Body Message */}
                        <div className="my-auto text-center z-10 px-4">
                          <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Seja Bem-vindo(a)</span>
                          <h3 className="text-lg md:text-xl font-extrabold text-white leading-tight">
                            Diretoria de Operações e Clientes Estratégicos
                          </h3>
                          <p className="text-[10px] text-gray-400 mt-2">
                            É uma honra recebê-los em nossa sede corporativa hoje.
                          </p>
                        </div>

                        {/* Footer info card */}
                        <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-between z-10">
                          <div className="flex items-center gap-2">
                            <QrCode className="w-6 h-6 text-blue-400" />
                            <div className="text-left">
                              <span className="text-[8px] text-gray-400 block">Wi-Fi Visitantes</span>
                              <span className="text-[9px] font-mono font-bold text-white">Rede: INOVA_VISITANTES</span>
                            </div>
                          </div>
                          <span className="text-[8px] bg-blue-500/30 text-white px-2 py-1 rounded font-mono font-bold">Senha: #Inova2026</span>
                        </div>
                      </motion.div>
                    )}

                    {/* --- LAYOUT 4: AVISOS --- */}
                    {activeLayout === "avisos" && (
                      <motion.div 
                        key="avisos"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full p-3 bg-[#0a0a0e] flex flex-col text-white"
                      >
                        <div className="text-center border-b border-white/5 pb-1.5 mb-2">
                          <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">Avisos Importantes da Semana</span>
                        </div>

                        {/* Avisos list */}
                        <div className="flex-1 flex flex-col gap-1.5 justify-center">
                          <div className="bg-white/5 rounded p-2 border-l-2 border-blue-500 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span className="text-[11px] font-medium">Reunião de Alinhamento Geral</span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono">Sexta, 16:00</span>
                          </div>

                          <div className="bg-white/5 rounded p-2 border-l-2 border-indigo-400 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-indigo-400" />
                              <span className="text-[11px] font-medium">Treinamento de Cibersegurança Obrigatório</span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono">Prazo: Até 15/Jul</span>
                          </div>

                          <div className="bg-white/5 rounded p-2 border-l-2 border-amber-500 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber-500" />
                              <span className="text-[11px] font-medium">Preenchimento da Escala de Férias</span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono">RH Corporativo</span>
                          </div>
                        </div>

                        <div className="text-[8px] text-center text-gray-500 mt-2 font-mono">
                          Se tiver dúvidas, entre em contato pelo ramal 4022.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* TV Brand Plate */}
                <div className="h-6 bg-[#16161c] flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono border-t border-[#1D1D1F]">
                  <span className="flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-gray-400" />
                    Meu Comercial TV Player
                  </span>
                  <span className="font-bold tracking-widest text-gray-400">MEU COMERCIAL</span>
                  <span className="text-emerald-500 font-bold">● ONLINE</span>
                </div>

              </div>

              {/* TV CONTROL PANEL (REMOTE) */}
              <div className="mt-4 p-4 rounded-2xl bg-white border border-black/5 shadow-sm">
                <p className="text-xs text-black/50 font-medium mb-3 text-center sm:text-left">
                  🎮 Controle as Telas: Clique para alternar o que está passando na TV
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {layouts.map((layout) => (
                    <button
                      key={layout.id}
                      type="button" aria-pressed={activeLayout === layout.id}
                      onClick={() => setActiveLayout(layout.id)}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 justify-center transition-all duration-300 ${
                        activeLayout === layout.id
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10 scale-[1.03]"
                          : "bg-[#F5F5F7] hover:bg-black/5 text-[#1D1D1F] border border-black/5"
                      }`}
                    >
                      {layout.icon}
                      {layout.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Edit Ticker form (only visible on Multizona) */}
                {activeLayout === "multizona" && (
                  <div className="mt-3.5 pt-3.5 border-t border-black/5">
                    <label className="text-[11px] text-black/50 block mb-1">
                      Edite o Ticker de Notícias (Passando na base da TV):
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={customTickerText}
                        onChange={(e) => setCustomTickerText(e.target.value)}
                        className="flex-1 min-w-0 bg-[#F5F5F7] border border-black/10 rounded-xl px-3 py-1.5 text-xs text-black focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/15"
                        placeholder="Escreva uma mensagem para rodar na TV..."
                      />
                      <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-600 px-2 py-1 rounded-lg font-mono flex items-center justify-center">
                        Editado ao Vivo
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>


    </>
  )
}
