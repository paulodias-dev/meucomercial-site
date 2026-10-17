import {Calendar, CloudSun, CheckCircle2, Monitor, QrCode, FileText} from 'lucide-react'
import type {TVLayout} from './MarketingTypes'

export default function FeaturesSection({layouts}: {layouts:TVLayout[]}) {
  return (
    <>
{/* --- RECURSOS / ZIG-ZAG FEATURES --- */}
      <section id="recursos" className="py-20 bg-white relative border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">Tecnologia que Gera Resultado</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1D1D1F] tracking-tight">
              Recursos pensados para aumentar impacto, padronização e velocidade
            </h2>
            <p className="text-black/60 text-sm sm:text-base leading-relaxed">
              Cada função foi desenhada para reduzir operação manual e transformar cada tela em um canal de comunicação e conversão.
            </p>
          </div>

          {/* Feature 1 (Zig-zag) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase font-mono tracking-wider">
                <Calendar className="w-4 h-4" />
                Agendamento Inteligente
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1D1D1F] leading-tight">
                Coloque ofertas e comunicados no ar exatamente quando eles geram mais resultado
              </h3>
              <p className="text-black/60 text-sm sm:text-base leading-relaxed">
                Agende campanhas por horário, dia, unidade ou período e mantenha promoções, metas e avisos sempre atualizados. Isso evita conteúdo vencido, acelera ações comerciais e dá mais previsibilidade à comunicação interna.
              </p>
              <ul className="flex flex-col gap-2.5 mt-2">
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Ative promoções sazonais sem depender da equipe da loja
                </li>
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Programe validade automática e evite ofertas desatualizadas
                </li>
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Publique em lote para várias TVs ou filiais ao mesmo tempo
                </li>
              </ul>
            </div>
            
            {/* Visual Panel Mockup 1 */}
            <div className="lg:col-span-6 bg-[#F5F5F7] border border-black/5 rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-black/40 font-mono">Agendamento de Campanhas</span>
              </div>
              {/* Virtual Timeline UI */}
              <div className="flex flex-col gap-3 font-mono">
                <div className="p-3 rounded-xl bg-white border border-black/5 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] text-blue-600 font-bold block uppercase">Campanha Ativa</span>
                    <span className="text-xs font-bold text-black block">Meta de Vendas de Junho</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">Ativo Diariamente</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-black/5 flex items-center justify-between opacity-85 shadow-sm">
                  <div>
                    <span className="text-[10px] text-amber-500 font-semibold block uppercase">Agendado</span>
                    <span className="text-xs font-bold text-black block">Boas-vindas Visita Diretores</span>
                  </div>
                  <span className="text-[10px] bg-black/5 text-black/60 px-2 py-0.5 rounded-full font-bold">08/Jul • 08:00 - 18:00</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-black/5 flex items-center justify-between opacity-50 shadow-sm">
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Expirado</span>
                    <span className="text-xs font-bold text-black block">Promoções de Festa Junina</span>
                  </div>
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-bold">Expirou 30/Jun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 (Zig-zag inverted) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            
            {/* Visual Panel Mockup 2 (Interactive Split screen) */}
            <div className="order-2 lg:order-1 lg:col-span-6 bg-[#F5F5F7] border border-black/5 rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-[#1D1D1F] font-medium">Layout de Tela Compartilhada</span>
                </div>
                <span className="text-xs text-black/40 font-mono">Multi-zone Digital</span>
              </div>
              
              {/* Split Screen interactive selector for Multi-zone visual */}
              <div className="grid grid-cols-12 gap-2 aspect-video bg-black/90 p-2 rounded-xl">
                <div className="col-span-8 bg-blue-600/10 border border-blue-500/40 rounded-lg p-2.5 flex flex-col justify-between text-center">
                  <span className="text-[9px] font-bold text-blue-400 uppercase">Área 1: Principal</span>
                  <div className="my-auto">
                    <span className="text-xs font-semibold block text-white">Vídeos ou Imagens</span>
                    <span className="text-[8px] text-gray-400 block mt-1">Sua Campanha em Foco (60%)</span>
                  </div>
                </div>
                <div className="col-span-4 flex flex-col gap-2">
                  <div className="flex-1 bg-amber-500/10 border border-amber-500/40 rounded-lg p-1.5 flex flex-col justify-center text-center">
                    <span className="text-[8px] font-bold text-amber-400 uppercase">Área 2: Clima</span>
                    <CloudSun className="w-4 h-4 mx-auto text-amber-400 mt-0.5" />
                  </div>
                  <div className="flex-1 bg-purple-500/10 border border-purple-500/40 rounded-lg p-1.5 flex flex-col justify-center text-center">
                    <span className="text-[8px] font-bold text-purple-400 uppercase">Área 3: QR Code</span>
                    <QrCode className="w-4 h-4 mx-auto text-purple-400 mt-0.5" />
                  </div>
                </div>
                <div className="col-span-12 bg-emerald-500/10 border border-emerald-500/40 rounded-lg p-1 flex items-center justify-between px-3 text-[8px]">
                  <span className="font-bold text-emerald-400 uppercase">Área 4: Ticker de Notícias</span>
                  <span className="text-white font-mono truncate max-w-[200px]">Previsão de inflação recua e mercado financeiro projeta crescimento...</span>
                </div>
              </div>
              <p className="text-xs text-black/50 mt-4 text-center font-medium">
                🖥️ Divida a tela como quiser para maximizar as informações sem sobrecarregar a audiência.
              </p>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col gap-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase font-mono tracking-wider">
                <Monitor className="w-4 h-4" />
                Layouts que Vendem e Informam
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1D1D1F] leading-tight">
                Mostre mais conteúdo útil na mesma tela sem perder clareza
              </h3>
              <p className="text-black/60 text-sm sm:text-base leading-relaxed">
                Use múltiplos layouts para destacar o que importa em cada ambiente: oferta principal na vitrine, QR Code na recepção, metas no escritório e avisos em áreas internas. Assim, cada tela trabalha a favor da experiência e do faturamento.
              </p>
              <ul className="flex flex-col gap-2.5 mt-2">
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Destaque produtos, campanhas e CTAs com mais visibilidade
                </li>
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Adapte a comunicação para recepção, loja, clínica ou escritório
                </li>
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Mantenha a marca padronizada em todas as unidades
                </li>
              </ul>
            </div>

          </div>

          {/* Feature 3 (Zig-zag) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase font-mono tracking-wider">
                <FileText className="w-4 h-4" />
                Conteúdo sem Barreiras
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1D1D1F] leading-tight">
                Publique vídeos, imagens e widgets sem travar sua operação
              </h3>
              <p className="text-black/60 text-sm sm:text-base leading-relaxed">
                Suba os formatos que sua equipe já usa e mantenha a programação viva com notícias, clima, dashboards e conteúdos institucionais. Menos dependência técnica, mais velocidade para comunicar e vender.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="p-3 bg-[#F5F5F7] rounded-xl border border-black/5 shadow-sm">
                  <span className="font-bold text-[#1D1D1F] text-xs block mb-1">Mídias que valorizam campanhas</span>
                  <span className="text-xs text-black/50">Vídeos, ofertas e peças visuais sem conversões complexas.</span>
                </div>
                <div className="p-3 bg-[#F5F5F7] rounded-xl border border-black/5 shadow-sm">
                  <span className="font-bold text-[#1D1D1F] text-xs block mb-1">Widgets que mantêm a tela relevante</span>
                  <span className="text-xs text-black/50">Clima, notícias e painéis dinâmicos para aumentar atenção e permanência.</span>
                </div>
              </div>
            </div>
            
            {/* Mockup 3 */}
            <div className="lg:col-span-6 bg-[#F5F5F7] border border-black/5 rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              <span className="text-xs text-black/40 font-mono block mb-3">Formatos de Mídia Homologados</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded font-bold">MP4</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Vídeos 1080p / 4K</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded font-bold">PNG / JPG</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Folders & Encartes</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded font-bold">RSS</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Notícias do Dia</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded font-bold">HTML5</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Painéis e Dashboards</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded font-bold">URL</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Links Integrados</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded font-bold">WIDGET</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Clima & Finanças</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
                    
    </>
  )
}
