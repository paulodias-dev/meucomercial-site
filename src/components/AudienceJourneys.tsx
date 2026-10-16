import {useState} from 'react'
import {ArrowRight, Building2, Megaphone, Network, ShieldCheck, MonitorPlay, CheckCircle2} from 'lucide-react'

export type CommercialAudience = 'establishment' | 'agency' | 'advertiser'

type Journey = {
  id:CommercialAudience
  label:string
  subtitle:string
  headline:string
  body:string
  stages:Array<{title:string;description:string}>
  boundaries:string[]
  cta:string
}
export const journeys: Journey[]=[
  {id:'establishment',label:'Estabelecimentos',subtitle:'TV e Rádio no próprio ponto',
    headline:'Sua comunicação em TVs e Rádio, com gestão por unidade',
    body:'Organize o conteúdo do estabelecimento, pareie os aparelhos e acompanhe a programação. O orçamento considera software, infraestrutura e eventual licenciamento de mídia separadamente.',
    stages:[
      {title:'Converse sobre a operação',description:'Informe unidades, aparelhos, público e objetivos.'},
      {title:'Valide o equipamento e contrato',description:'Compatibilidade, licença, plano e autorização de uso.'},
      {title:'Configure e publique',description:'Pareamento, playlist, agendamento e aprovação dos locais.'},
      {title:'Acompanhe',description:'Indicadores de conexão e sincronização no painel operacional.'},
    ],
    boundaries:['A assinatura é do estabelecimento, não do anunciante.',
      'Licenças musicais, equipamentos e instalação podem ter custos próprios.',
      'Publicação e heartbeat não comprovam audiência.'],
    cta:'Solicitar demonstração para meu estabelecimento',
  },
  {id:'agency',label:'Agências',subtitle:'Operação de várias carteiras',
    headline:'Centralize clientes, programação e espaços publicitários',
    body:'Administre estabelecimentos vinculados à agência, operadores e inventário. A venda de anúncios exige autorização do ponto de veiculação e contratos comerciais próprios.',
    stages:[
      {title:'Avalie sua carteira',description:'Número de clientes, redes e dispositivos sob gestão.'},
      {title:'Defina escopo e permissões',description:'Cada agência acessa somente os clientes e operações autorizados.'},
      {title:'Planeje conteúdo e publicidade',description:'Agendas e ordens comerciais seguem fluxos diferentes.'},
      {title:'Monitore a operação',description:'Atenção a aparelhos, licenças, aprovações e comprovantes informados.'},
    ],
    boundaries:['Sem acesso automático aos clientes ou ativos de outra agência.',
      'Propriedade do estabelecimento não muda com concessão publicitária.',
      'Planos, limites e preço são informados em proposta.'],
    cta:'Conhecer operação para agências',
  },
  {id:'advertiser',label:'Anunciantes',subtitle:'Campanhas em espaços autorizados',
    headline:'Peça uma proposta de anúncio em pontos elegíveis',
    body:'Descreva o público e os locais desejados. A proposta depende de inventário vendável, vigência, mídia, aprovação de criativo, autorização do estabelecimento e capacidade real.',
    stages:[
      {title:'Descreva sua campanha',description:'Objetivo, cidade, período e formato TV/Rádio.'},
      {title:'Confira disponibilidade',description:'A agência valida pontos, valores, condições e limites.'},
      {title:'Envie o criativo autorizado',description:'Direitos da mídia e aprovação antes da programação.'},
      {title:'Consulte o relatório',description:'Compare inserções contratadas com eventos informados pelo Player.'},
    ],
    boundaries:['Solicitar uma proposta não garante inventário reservado.',
      'O sistema não identifica ouvintes nem comprova atenção individual.',
      'Compra de anúncios não cria assinatura do estabelecimento.'],
    cta:'Solicitar proposta de publicidade',
  },
]

const icons={
  establishment:Building2,
  agency:Network,
  advertiser:Megaphone,
} as const

export default function AudienceJourneys({onContact}:{
  onContact:(audience:CommercialAudience,source:string)=>void
}) {
  const [active,setActive]=useState<CommercialAudience>('establishment')
  const journey=journeys.find(x=>x.id===active)!
  const Icon=icons[active]
  return <section id='para-quem' aria-labelledby='journeys-title'
    className='bg-white border-y border-black/5 py-20 sm:py-24 scroll-mt-20'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl'>
        <p className='text-blue-700 text-xs font-bold tracking-widest uppercase'>Para quem é o Meu Comercial</p>
        <h2 id='journeys-title' className='font-display text-3xl sm:text-4xl font-bold tracking-tight mt-3'>
          Uma plataforma. Três formas diferentes de participar.
        </h2>
        <p className='text-black/60 text-sm sm:text-base leading-7 mt-4'>
          O estabelecimento assina a gestão das telas, a agência administra operações autorizadas
          e o anunciante contrata espaço de divulgação. Cada papel tem permissões e contratos diferentes.
        </p>
      </div>
      <div role='tablist' aria-label='Escolha seu perfil comercial'
        className='grid grid-cols-1 sm:grid-cols-3 gap-3 mt-9'>
        {journeys.map(j=>{
          const JIcon=icons[j.id]
          return <button key={j.id} type='button' role='tab'
            id={'audience-tab-'+j.id} aria-controls='audience-panel'
            aria-selected={active===j.id}
            onClick={()=>setActive(j.id)}
            className={'text-left p-5 border-2 rounded-2xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 '+
              (active===j.id?'bg-blue-50 border-blue-600':'bg-white border-black/10 hover:border-blue-200')}>
            <JIcon size={22} className='text-blue-700' aria-hidden/>
            <strong className='block mt-3 text-sm sm:text-base'>{j.label}</strong>
            <span className='block mt-1 text-xs text-black/60'>{j.subtitle}</span>
          </button>
        })}
      </div>
      <div id='audience-panel' role='tabpanel' aria-labelledby={'audience-tab-'+active}
        className='rounded-3xl bg-[#F5F7FA] border border-black/5 mt-4 p-5 sm:p-8 lg:p-10'>
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
          <div className='lg:w-5/12'>
            <div className='inline-flex gap-2 items-center bg-white rounded-full px-3 py-2 text-xs text-blue-800 border border-blue-100'>
              <Icon size={16} aria-hidden/>{journey.label}
            </div>
            <h3 className='text-2xl sm:text-3xl font-bold font-display leading-tight mt-4'>{journey.headline}</h3>
            <p className='text-sm text-black/65 leading-7 mt-4'>{journey.body}</p>
            <button type='button' onClick={()=>onContact(journey.id,'Jornada - '+journey.label)}
              className='mt-7 min-h-11 w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full px-6 py-3 bg-blue-700 text-white text-sm font-bold hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700'>
              {journey.cta}<ArrowRight size={17} aria-hidden/>
            </button>
            <p className='text-xs text-black/50 mt-3'>
              Solicitação de contato, sem contratação ou publicação automática.
            </p>
          </div>
          <div className='lg:w-7/12'>
            <div className='flex items-center gap-2 text-xs font-bold text-blue-800 mb-4'>
              <MonitorPlay size={18} aria-hidden/> Como funciona sua jornada
            </div>
            <ol className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {journey.stages.map((stage,i)=><li key={stage.title}
                className='rounded-2xl p-4 sm:p-5 bg-white border border-black/5'>
                <span className='inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white bg-blue-700'>
                  {i+1}
                </span>
                <strong className='block mt-3 text-sm'>{stage.title}</strong>
                <p className='mt-2 text-xs leading-6 text-black/60'>{stage.description}</p>
              </li>)}
            </ol>
            <div className='mt-5 rounded-xl border border-black/10 p-4 sm:p-5'>
              <div className='flex gap-2 items-center text-xs font-bold uppercase tracking-wide text-black/70'>
                <ShieldCheck size={17} className='text-blue-700' aria-hidden/>
                Condições importantes
              </div>
              <ul className='mt-3 space-y-2'>
                {journey.boundaries.map(x=><li key={x} className='flex gap-2 items-start text-xs leading-6 text-black/60'>
                  <CheckCircle2 size={16} className='text-blue-700 shrink-0 mt-1' aria-hidden/>{x}
                </li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
}
