// Pure client-side display contract; server alone determines operational facts.
const codes={
  withdrawn:'neutral',blocked:'critical',inactive:'critical',pairing:'critical',
  scheduled:'neutral',offline:'critical',ack_overdue:'warning',
  sync_pending:'info',awaiting_ack:'info',awaiting_report:'info',reported:'neutral',
}
const isObj=o=>!!o&&typeof o==='object'&&!Array.isArray(o)
export const needsAttentionCodes=['blocked','inactive','pairing','offline','ack_overdue']

export function isPublicationAttention(value) {
  if(!isObj(value)||!Object.hasOwn(codes,value.code)||
    value.level!==codes[value.code]||typeof value.title!=='string'||
    value.title.length===0||value.title.length>160||
    typeof value.guidance!=='string'||value.guidance.length===0||
    value.guidance.length>450||typeof value.needs_attention!=='boolean'||
    value.evidence!=='operational_triage_not_verified_playback')return false
  return value.needs_attention===needsAttentionCodes.includes(value.code)
}

// A manual, intentionally limited support brief. Never serialize auth headers,
// payloads, opaque metadata, full JSON, IP addresses or device secrets.
const singleLine=value=>String(value??'').replace(/[\r\n\t\u0000-\u001f]/g,' ').slice(0,100)
export function publicationSupportBrief(publicationId,device) {
  if(!Number.isSafeInteger(publicationId)||publicationId<=0||
    !isObj(device)||!Number.isSafeInteger(device.device_id)||
    !isPublicationAttention(device.attention))throw Error('Dados de suporte inválidos.')
  return [
    'Meu Comercial — triagem operacional (relato não certifica reprodução ou audiência)',
    'Publicação: #'+publicationId,
    'Dispositivo: #'+device.device_id+' — '+singleLine(device.name),
    'Estado: '+singleLine(device.attention.title),
    'Ação recomendada: '+singleLine(device.attention.guidance),
    'Versão solicitada: '+device.requested_manifest_version,
    'Conexão recente: '+(device.connected_recently?'sim':'não'),
    'ACK v2: '+(device.sync_acknowledged?'reportado':'não reportado'),
    'Execução própria: '+(device.own_playback_reported?'relatada':'sem relato'),
    'Evidência: operational_triage_not_verified_playback',
  ].join('\n')
}
