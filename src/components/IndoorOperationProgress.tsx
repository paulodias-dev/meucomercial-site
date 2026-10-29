import {CheckCircle2,Clock3,Monitor,Radio,ShieldCheck} from 'lucide-react'

export type IndoorOperationProgressData={
 units_registered:number;players_registered:number;players_paired:number;
 editorial_publications_active:number;media_authorized:boolean;
 player_completion_reports_24h:number;reporting_devices_24h:number;
 completion_evidence:'authenticated_player_self_report_not_audience';
 next_step:'configure_unit'|'register_players'|'pair_players'|
 'configure_authorized_playlist_and_schedule'|'monitor_player_sync'|
 'monitor_player_reports'|'resolve_financial_dispute'|
 'contact_support_for_financial_review';
 playback_verified:false
}
const next:Record<IndoorOperationProgressData['next_step'],string>={
 configure_unit:'O administrador precisa cadastrar sua primeira unidade.',
 register_players:'Sua unidade está cadastrada. Próxima etapa: adicionar Players de TV/Rádio.',
 pair_players:'Players cadastrados. O administrador deve concluir o pareamento seguro dos aparelhos.',
 configure_authorized_playlist_and_schedule:'Players pareados. O administrador prepara as mídias autorizadas e os horários.',
 monitor_player_sync:'Programação autorizada e agendada. Aguardando contato válido dos Players; a reprodução ainda não foi comprovada.',
 monitor_player_reports:'O Player enviou relatos autenticados de conclusão de mídia. Continue acompanhando a operação; não é medição independente de audiência.',
 resolve_financial_dispute:'A preparação está suspensa enquanto o financeiro resolve a contestação.',
 contact_support_for_financial_review:'Direito de mídia restrito. Solicite uma revisão da assinatura ao suporte. Não realize outro PIX por conta própria.',
}
export default function IndoorOperationProgress({progress,status}:{
 progress:IndoorOperationProgressData;status:'active'|'disputed'
}){
 const blocked=status==='disputed'||progress.media_authorized===false
 const items=[
  {name:'Unidade física',done:progress.units_registered>0,note:String(progress.units_registered)+' cadastrada(s)'},
  {name:'Player de TV/Rádio',done:progress.players_registered>0,note:String(progress.players_registered)+' cadastrado(s)'},
  {name:'Pareamento dos aparelhos',done:progress.players_registered>0&&
   progress.players_paired===progress.players_registered,
   note:String(progress.players_paired)+' de '+String(progress.players_registered)+' pareado(s)'},
  {name:'Conteúdo e programação',
   done:progress.editorial_publications_active>0,
   note:String(progress.editorial_publications_active)+' lote(s) editorial(is) publicado(s); reprodução não comprovada'},
  {name:'Relatos de execução dos Players (24h)',
   done:progress.player_completion_reports_24h>0,
   note:String(progress.player_completion_reports_24h)+' conclusão(ões) relatada(s) por '+
    String(progress.reporting_devices_24h)+' Player(s); sem validação independente de audiência'},
 ]
 return <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 mt-4"
  aria-label="Etapas da preparação operacional do Indoor">
  <h4 className="font-semibold flex items-center gap-2 text-slate-900">
   <Monitor size={18} aria-hidden/>Preparação da sua TV e Rádio Indoor</h4>
  <p className="text-sm mt-2 text-slate-700">
   {status==='disputed'?'A configuração está pausada por uma contestação financeira.':
    !progress.media_authorized?'A assinatura foi registrada, mas o direito de veiculação está temporariamente restrito.':
    'A assinatura e o direito de mídia estão ativos. Veja a preparação dos aparelhos e da programação.'}
  </p>
  <ol className="mt-4 space-y-3">
   {items.map((item,i)=><li key={item.name} className="flex items-start gap-3">
    <span className={'mt-0.5 '+(item.done&&!blocked?'text-emerald-700':'text-slate-500')}>
     {item.done&&!blocked?<CheckCircle2 size={20} aria-hidden/>:
      <Clock3 size={20} aria-hidden/>}</span>
    <div className="min-w-0">
     <p className="font-medium text-sm text-slate-900">{i+1}. {item.name}</p>
     <p className="text-xs text-slate-600 mt-1">{item.note}</p>
    </div>
   </li>)}
  </ol>
  <div className="border-t mt-4 pt-4 text-sm text-slate-700">
   <p className="flex items-start gap-2">
    <Radio size={18} className="shrink-0 mt-0.5" aria-hidden/>
    {next[blocked?(status==='disputed'?'resolve_financial_dispute':
    'contact_support_for_financial_review'):progress.next_step]}
   </p>
   <p className="flex items-start gap-2 mt-3 text-xs text-slate-600">
    <ShieldCheck size={17} className="shrink-0" aria-hidden/>
    O cadastro, o pareamento e a sincronização não são comprovantes de reprodução nem de audiência.
    Os relatos de conclusão são autodeclarações autenticadas do Player, não medições independentes.
   </p>
  </div>
 </section>
}
