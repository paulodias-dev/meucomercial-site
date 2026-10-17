import {ArrowRight, ShieldCheck} from 'lucide-react'
import type {CommercialAudience} from './AudienceJourneys'

export default function CommercialBrief({screensCount, setScreensCount, leadKind, setLeadKind, openAudienceContact}: {screensCount:number; setScreensCount:(n:number)=>void; leadKind:CommercialAudience; setLeadKind:(v:CommercialAudience)=>void; openAudienceContact:(kind:CommercialAudience,source:string)=>void}) {
  return (
    <>
{/* --- QUALIFIED COMMERCIAL BRIEF — NOT A PRICE QUOTE --- */}
      <section id="planos" className="py-20 sm:py-24 bg-white border-t border-black/5 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <span className="text-xs text-blue-700 font-bold tracking-widest uppercase">Proposta por operação</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 tracking-tight">
              Entenda o investimento sem preços de tabela inventados
            </h2>
            <p className="text-sm text-black/65 leading-7 mt-5">
              O valor final depende do perfil, contrato, quantidade de aparelhos,
              licença das mídias, instalação e serviços contratados. A venda de
              publicidade é independente da assinatura do estabelecimento.
            </p>
            <ul className="space-y-3 text-sm text-black/65 mt-7">
              {[
                'Software e dispositivos: escopo definido em proposta.',
                'Equipamento e instalação: verificamos compatibilidade e necessidade.',
                'Músicas e criativos: direitos de uso podem exigir contratos adicionais.',
                'Publicidade: local, período, cota e valor sujeitos a inventário autorizado.',
              ].map(item=><li key={item} className="flex gap-2 items-start">
                <ShieldCheck size={18} className="text-blue-700 shrink-0 mt-0.5" aria-hidden />{item}
              </li>)}
            </ul>
          </div>
          <div className="lg:col-span-7 p-5 sm:p-8 rounded-3xl bg-[#F5F7FA] border border-black/10">
            <h3 className="font-bold text-xl">Prepare seu pedido comercial</h3>
            <p className="text-sm text-black/60 mt-2">
              Escolha sua atuação para direcionarmos a solicitação à equipe correta.
              O formulário não gera cobrança, reserva nem ativação automática.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {([
                ['establishment','Estabelecimento'],
                ['agency','Agência'],
                ['advertiser','Anunciante'],
              ] as const).map(([kind,label])=><button type="button" key={kind}
                onClick={()=>setLeadKind(kind)} aria-pressed={leadKind===kind}
                className={`rounded-xl p-4 border text-sm font-semibold text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${leadKind===kind?'border-blue-700 bg-blue-50':'border-black/10 bg-white'}`}>
                {label}
              </button>)}
            </div>
            {leadKind==='establishment' && <div className="mt-6">
              <label htmlFor="quote-screens" className="flex gap-3 justify-between items-center text-sm font-semibold">
                Quantidade estimada de pontos de TV
                <strong className="text-blue-700">{screensCount}</strong>
              </label>
              <input id="quote-screens" type="range" min={1} max={50} value={screensCount}
                onChange={event=>setScreensCount(Number(event.target.value))}
                className="w-full mt-3 accent-blue-700" />
            </div>}
            {leadKind==='agency' && <p className="text-xs text-black/65 mt-6">
              Na proposta, informe sua carteira, número de locais, tipos de Player e permissões necessárias.
            </p>}
            {leadKind==='advertiser' && <p className="text-xs text-black/65 mt-6">
              Para avaliar inventário, precisamos de cidades, período, formato TV/Rádio, criativos e objetivo da campanha.
            </p>}
            <button type="button"
              onClick={()=>openAudienceContact(leadKind,'Proposta segmentada - '+leadKind)}
              className="mt-7 rounded-full bg-blue-700 text-white min-h-11 px-6 py-3 font-bold text-sm w-full inline-flex items-center justify-center gap-2 hover:bg-blue-800">
              Solicitar proposta personalizada <ArrowRight size={18} aria-hidden/>
            </button>
            <p className="text-xs text-black/50 mt-3">
              Sem simulação de desconto ou preço não confirmado no catálogo.
            </p>
          </div>
        </div>
      </section>

      
    </>
  )
}
