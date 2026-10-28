import {CheckCircle2,Clock3,Monitor,Radio,ShieldCheck} from 'lucide-react'

export type IndoorOperationProgressData={
 units_registered:number;players_registered:number;players_paired:number;
 next_step:'configure_unit'|'register_players'|'pair_players'|
 'configure_authorized_playlist_and_schedule'|'resolve_financial_dispute';
 playback_verified:false
}
const next:Record<IndoorOperationProgressData['next_step'],string>={
 configure_unit:'O administrador precisa cadastrar sua primeira unidade.',
 register_players:'Sua unidade está cadastrada. Próxima etapa: adicionar Players de TV/Rádio.',
 pair_players:'Players cadastrados. O administrador deve concluir o pareamento seguro dos aparelhos.',
 configure_authorized_playlist_and_schedule:'Players pareados. O administrador prepara as mídias autorizadas e os horários.',
 resolve_financial_dispute:'A preparação está suspensa enquanto o financeiro resolve a contestação.',
}
export default function IndoorOperationProgress({progress,status}:{
 progress:IndoorOperationProgressData;status:'active'|'disputed'
}){
 const blocked=status==='disputed'
 const items=[
  {name:'Unidade física',done:progress.units_registered>0,note:String(progress.units_registered)+' cadastrada(s)'},
  {name:'Player de TV/Rádio',done:progress.players_registered>0,note:String(progress.players_registered)+' cadastrado(s)'},
  {name:'Pareamento dos aparelhos',done:progress.players_registered>0&&
   progress.players_paired===progress.players_registered,
   note:String(progress.players_paired)+' de '+String(progress.players_registered)+' pareado(s)'},
  {name:'Conteúdo e programação',done:false,note:'Administrados separadamente; sem confirmação de reprodução'},
 ]
 return <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 mt-4"
  aria-label="Etapas da preparação operacional do Indoor">
  <h4 className="font-semibold flex items-center gap-2 text-slate-900">
   <Monitor size={18} aria-hidden/>Preparação da sua TV e Rádio Indoor</h4>
  <p className="text-sm mt-2 text-slate-700">
   {blocked?'A configuração está pausada por uma pendência financeira.':
    'A assinatura está ativa. Veja como está a instalação dos aparelhos e a preparação da programação.'}
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
    {next[blocked?'resolve_financial_dispute':progress.next_step]}
   </p>
   <p className="flex items-start gap-2 mt-3 text-xs text-slate-600">
    <ShieldCheck size={17} className="shrink-0" aria-hidden/>
    O cadastro, o pareamento e a sincronização não são comprovantes de reprodução nem de audiência.
   </p>
  </div>
 </section>
}
