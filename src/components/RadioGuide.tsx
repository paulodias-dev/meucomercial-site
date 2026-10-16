import {useState} from 'react'
import {ArrowRight,ChevronDown,Headphones,Radio,ShieldCheck,SlidersHorizontal,Volume2} from 'lucide-react'

export type RadioFaq = {id:string;question:string;answer:string}
export const radioFaqs: RadioFaq[] = [
  {id:'licencas',question:'Preciso de autorização para usar músicas no estabelecimento?',
    answer:'A operação comercial exige atenção aos direitos autorais e às licenças aplicáveis à execução pública, conforme repertório, tipo de estabelecimento e contrato. A assinatura do software não concede automaticamente direitos sobre todas as músicas. Oriente-se com os responsáveis pelos direitos e mantenha comprovantes de autorização.'},
  {id:'repertorio',question:'Posso escolher músicas e criar programação para várias unidades?',
    answer:'É possível organizar playlists de Rádio e vincular uma programação aos locais e Players autorizados. Os arquivos e o repertório devem estar disponíveis e devidamente licenciados. Cada unidade usa o contexto de cliente, assinatura e permissões correspondente.'},
  {id:'insercoes',question:'Como entram avisos, jingles e anúncios na programação?',
    answer:'O Player de Rádio intercala spots aprovados entre faixas, de acordo com a reserva comercial, a vigência, a licença, a localização e a cota de inserções por dia. A contratação do anunciante é independente da assinatura mensal do estabelecimento.'},
  {id:'auditoria',question:'Como sei se um spot foi reproduzido?',
    answer:'O Player pode enviar um registro autenticado ao finalizar a inserção, inclusive após reconexão. O painel compara eventos informados e quantidades contratadas. Isso é um relato técnico do Player, e não uma medição independente de audiência ou atenção das pessoas.'},
  {id:'sem-internet',question:'A Rádio funciona normalmente sem internet?',
    answer:'O Player Web usa autorização de curta duração e interrompe conteúdo quando essa autorização vence. Ele pode guardar comprovantes pendentes e reenviá-los após reconexão, mas não promete reprodução permanente de músicas ou publicidade enquanto estiver offline.'},
  {id:'instalacao',question:'Preciso comprar um computador específico?',
    answer:'O uso depende de um dispositivo compatível com a saída de áudio e o navegador/Player homologado. Antes de contratar, confira a infraestrutura de som, os codecs, a conexão e a forma de execução. O Player Web pode exigir um primeiro toque para permitir áudio.'},
  {id:'preco',question:'O preço do software inclui repertório musical e campanhas publicitárias?',
    answer:'Não necessariamente. Software, instalação, licenciamento musical, equipamento e espaços publicitários podem ter contratos e condições diferentes. Peça uma proposta com o escopo discriminado; não interprete os valores da simulação de TV como cotação de Rádio.'},
  {id:'privacidade',question:'O sistema identifica quem ouviu o anúncio?',
    answer:'Não. Os dados técnicos descrevem sincronização e eventos informados pelo dispositivo. Não identificam ouvintes individuais, não medem conversões de vendas e não representam uma garantia de alcance.'},
]

const sampleProgramming=[
  {time:'Abertura',title:'Vinheta de boas-vindas',kind:'identidade',note:'Mensagem institucional aprovada'},
  {time:'Faixa 1',title:'Música do repertório autorizado',kind:'musica',note:'Origem e licença verificadas'},
  {time:'Intervalo',title:'Spot comercial aprovado',kind:'spot',note:'Somente se houver reserva válida e cota disponível'},
  {time:'Faixa 2',title:'Próxima música autorizada',kind:'musica',note:'Retomada da sequência da grade'},
]

export default function RadioGuide({onContact}:{onContact:(source:string)=>void}) {
  const [expanded,setExpanded]=useState<string|null>('licencas')
  const [showTechnical,setShowTechnical]=useState(false)
  return <section id="radio-indoor" className="py-20 sm:py-24 bg-[#F5F7FA] border-y border-black/5"
    aria-labelledby="radio-guide-title">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-5">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-blue-700">
            <Radio size={16} aria-hidden/> Rádio Indoor
          </span>
          <h2 id="radio-guide-title" className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-3">
            Sua programação sonora, organizada em cada unidade
          </h2>
          <p className="text-sm sm:text-base leading-7 text-black/65 mt-5">
            Planeje música licenciada, avisos e espaços publicitários em uma programação própria.
            Controle dispositivos e acompanhe o que foi informado pelo Player, sem misturar contratos
            de anúncios com a assinatura do estabelecimento.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 mt-8">
            <div className="rounded-2xl bg-white border border-black/5 p-4 flex gap-3">
              <SlidersHorizontal className="text-blue-700 shrink-0" size={21} aria-hidden/>
              <div><strong className="text-sm block">Grades por local</strong>
                <p className="text-xs text-black/60 mt-1">Programe o conteúdo conforme os dispositivos autorizados.</p></div>
            </div>
            <div className="rounded-2xl bg-white border border-black/5 p-4 flex gap-3">
              <ShieldCheck className="text-blue-700 shrink-0" size={21} aria-hidden/>
              <div><strong className="text-sm block">Direitos e vigência</strong>
                <p className="text-xs text-black/60 mt-1">Identifique licença, aprovação e período antes da veiculação.</p></div>
            </div>
            <div className="rounded-2xl bg-white border border-black/5 p-4 flex gap-3">
              <Headphones className="text-blue-700 shrink-0" size={21} aria-hidden/>
              <div><strong className="text-sm block">Eventos operacionais</strong>
                <p className="text-xs text-black/60 mt-1">Veja inserções informadas, sem prometer audiência verificada.</p></div>
            </div>
          </div>
          <button type="button" onClick={()=>onContact('Rádio Indoor - orientações e proposta')}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full min-h-11 px-6 py-3 bg-blue-700 text-white text-sm font-bold hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
            Conversar sobre Rádio Indoor <ArrowRight size={17} aria-hidden/>
          </button>
        </div>
        <div className="lg:col-span-7">
          <div className="bg-[#0C1B2D] text-white rounded-[28px] overflow-hidden shadow-xl shadow-blue-950/10">
            <div className="p-5 sm:p-7 border-b border-white/10 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold">
                  <Volume2 size={17} aria-hidden/> Exemplo de uma sequência
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold mt-1">Como a grade organiza o áudio</h3>
              </div>
              <span className="shrink-0 bg-blue-900/60 border border-blue-400/20 text-blue-200 text-[10px] px-3 py-1.5 rounded-full">Ilustrativo</span>
            </div>
            <ol className="px-5 sm:px-7 py-5 space-y-3">
              {sampleProgramming.map((item,index)=><li key={item.time}
                className="flex gap-3 sm:gap-4 items-start rounded-xl p-3 bg-white/5 border border-white/10">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-200 text-xs shrink-0 font-bold">
                  {index+1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm">{item.title}</strong>
                    <span className="text-[10px] uppercase tracking-wide text-blue-200">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{item.note}</p>
                </div>
              </li>)}
            </ol>
            <div className="px-5 sm:px-7 pb-6">
              <button type="button" aria-expanded={showTechnical} aria-controls="radio-technical"
                onClick={()=>setShowTechnical(open=>!open)}
                className="w-full flex justify-between items-center gap-3 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 px-4 py-3 text-left text-xs font-semibold">
                Entenda as regras de publicação
                <ChevronDown className={showTechnical?'rotate-180 transition-transform':'transition-transform'} size={16} aria-hidden/>
              </button>
              {showTechnical && <div id="radio-technical" className="rounded-b-xl px-4 py-4 text-xs text-slate-200 bg-white/5 leading-relaxed">
                A inserção comercial depende de campanha aprovada, destino autorizado, direitos válidos,
                período contratado e saldo disponível. Ao terminar a execução, o Player pode informar
                um evento técnico autenticado; download do áudio não é contabilizado como reprodução.
              </div>}
              <p className="text-[11px] text-slate-300 leading-5 mt-4">
                Esta é uma simulação textual de programação; não reproduz músicas,
                não representa transmissão ativa nem usa gravações sem autorização.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 max-w-4xl">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-bold tracking-widest text-blue-700">Orientações e dúvidas</span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold mt-2">Perguntas frequentes sobre Rádio Indoor</h3>
          <p className="text-black/60 text-sm leading-6 mt-3">
            Licenciamento, programação, inserções, conectividade e a diferença entre relatório técnico e audiência.
          </p>
        </div>
        <div className="mt-7 space-y-3">
          {radioFaqs.map(faq=><article key={faq.id} className="rounded-2xl bg-white border border-black/10 overflow-hidden">
            <h4>
              <button type="button" aria-expanded={expanded===faq.id} aria-controls={'radio-faq-'+faq.id}
                onClick={()=>setExpanded(expanded===faq.id?null:faq.id)}
                className="w-full min-h-14 text-left px-4 sm:px-6 py-4 flex justify-between items-center gap-5 text-sm sm:text-base font-semibold text-[#1D1D1F] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600">
                {faq.question}
                <ChevronDown size={18} aria-hidden className={'shrink-0 transition-transform '+(expanded===faq.id?'rotate-180':'')}/>
              </button>
            </h4>
            {expanded===faq.id && <p id={'radio-faq-'+faq.id} className="px-4 sm:px-6 pb-5 text-sm leading-7 text-black/65">
              {faq.answer}
            </p>}
          </article>)}
        </div>
        <p className="text-xs text-black/50 mt-6">
          Orientações comerciais gerais; requisitos de direitos autorais e disponibilidade dependem da sua operação,
          contratos e ambiente de homologação.
        </p>
      </div>
    </div>
  </section>
}
