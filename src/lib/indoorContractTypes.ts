export type IndoorContractState='pending'|'approved_for_proposal'|
 'proposal_presented'|'proposal_acknowledged'|'proposal_declined'|'declined'|'cancelled'
export type IndoorProposal={
 title:string;scope:string;amount_brl:string;valid_until:string;version:number;
 items:Array<{description:string;quantity:number;unit:string;
  unit_price_brl:string;line_total_brl:string}>;
 available_for_acknowledgement:boolean;acknowledged_at:string|null;
 nonbinding_quotation:true
}
export type IndoorContractStatus={
 reference:string;status:IndoorContractState;version:number;
 plan:{name:string;display_price_brl:string;interval:'monthly'|'yearly';price_is_contractually_binding:false};
 proposal?:IndoorProposal|null;
 payment_created:false;subscription_created:false;contract_signed:false;next_step?:string
}
export const indoorContractLabels:Record<IndoorContractState,string>={
 pending:'Em análise pelo Master',
 approved_for_proposal:'Aprovado para elaboração de proposta',
 proposal_presented:'Proposta disponível para manifestação',
 proposal_acknowledged:'Interesse registrado na proposta',
 proposal_declined:'Proposta recusada pelo solicitante',
 declined:'Solicitação não aprovada',
 cancelled:'Solicitação cancelada',
}
