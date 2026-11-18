/**
 * Portal session cookies are untrusted HTTP input. A malformed percent-escape
 * MUST NOT crash the Express process or reveal a server error during onboarding.
 *
 * Values are only parsed here, never logged, persisted or included in URLs.
 */
export function readPortalCookies(header=''){
 const cookies={};
 if(typeof header!=='string'||header.length>8192)return cookies;
 for(const part of header.split(';').slice(0,80)){
  const separator=part.indexOf('=');
  if(separator<1)continue;
  const key=part.slice(0,separator).trim();
  if(!/^[A-Za-z_][A-Za-z0-9_-]{0,63}$/.test(key))continue;
  const raw=part.slice(separator+1).trim();
  if(raw.length>4096)continue;
  try{
   const decoded=decodeURIComponent(raw);
   if(/[\u0000-\u001f\u007f]/.test(decoded))continue;
   if(Object.hasOwn(cookies,key))continue;
   cookies[key]=decoded;
  }catch{
   // Broken percent-encoding is ignored; it cannot manufacture a session.
  }
 }
 return cookies;
}
