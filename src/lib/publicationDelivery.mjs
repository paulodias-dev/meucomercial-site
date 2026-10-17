// Defensive runtime contract: release order API before Site.
// A positive ACK proves only a device-reported protocol-v2 sync, not content or audience.
const obj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v)
const count=v=>Number.isSafeInteger(v)&&v>=0
export const deliveryFilters=['all','acknowledged','awaiting_ack','offline','sync_pending','playback_reported','awaiting_playback_report']
export function isPublicationDeliveryResponse(v,filter='all'){
  if(!obj(v)||!Array.isArray(v.data)||!obj(v.summary)||!obj(v.pagination))return false
  const s=v.summary,p=v.pagination
  if(!deliveryFilters.includes(filter)||s.delivery!==filter ||
    !count(s.targets)||!count(s.sync_acknowledged_total)||
    !count(s.awaiting_player_ack)||!count(s.sync_pending_flagged)||
    !count(s.own_playback_reported_devices)||!count(s.awaiting_own_playback_report)||
    !count(s.recently_connected)||!count(s.unavailable)||
    s.sync_acknowledged_total+s.awaiting_player_ack!==s.targets ||
    s.own_playback_reported_devices+s.awaiting_own_playback_report!==s.targets ||
    [s.sync_pending_flagged,s.recently_connected,s.unavailable].some(n=>n>s.targets) ||
    s.playback_confirmed!==false ||
    !['published','withdrawn'].includes(s.publication_status))return false
  if(!count(p.total)||!count(p.last_page)||!count(p.page)||p.page<1 ||
    !count(p.per_page)||p.per_page<1||p.per_page>50 ||
    v.data.length>p.per_page||p.total>s.targets ||
    v.evidence!=='device_reported_sync_v2_not_independent_playback')return false
  return v.data.every(row=>obj(row)&&count(row.device_id)&&row.device_id>0&&
    typeof row.name==='string'&&typeof row.connected_recently==='boolean'&&
    typeof row.needs_sync==='boolean'&&typeof row.sync_acknowledged==='boolean'&&
    (row.sync_acknowledged_at===null||typeof row.sync_acknowledged_at==='string')&&
    typeof row.sync_evidence==='string'&&
    ['player_reported_protocol_v2','not_reported'].includes(row.sync_evidence)&&
    row.sync_acknowledged===(row.sync_evidence==='player_reported_protocol_v2')&&
    typeof row.own_playback_reported==='boolean' &&
    (row.first_own_playback_reported_at===null||typeof row.first_own_playback_reported_at==='string') &&
    ['authenticated_player_report_not_independent_audience','not_reported'].includes(row.own_playback_evidence)&&
    row.own_playback_reported===(row.own_playback_evidence==='authenticated_player_report_not_independent_audience') &&
    (row.own_playback_reported ? row.first_own_playback_reported_at!==null : row.first_own_playback_reported_at===null)&&
    row.playback_confirmed===false&&count(row.requested_manifest_version)&&
    count(row.current_manifest_version)&&
    ['sync_pending','device_unavailable','no_pending_sync_reported'].includes(row.operational_state))
}
