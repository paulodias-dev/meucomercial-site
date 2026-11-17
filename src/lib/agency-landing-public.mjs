/**
 * SSR of publicly approved agency pages. Untrusted agency text is ALWAYS
 * escaped and never rendered as HTML, inline JS, CSS selectors or a script.
 * Only stable fields from the explicit public Laravel read contract are used.
 */
export const agencySlugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function publicPagePayload(raw,agency,slug){
 if(!agencySlugPattern.test(agency)||!agencySlugPattern.test(slug))
  throw Error('Identificador de publicação inválido.');
 const row=raw?.data;
 if(!row||typeof row!=='object'||Array.isArray(row)||
    row.published!==true||row.agency_slug!==agency||row.slug!==slug||
    row.public_path!==`/p/${agency}/${slug}`)
  throw Error('Página pública indisponível.');
 const string=(key,max,required=false)=>{
  const value=row[key];
  if(value===null&&!required)return '';
  if(typeof value!=='string'||value.length>max||(required&&!value.trim()))
   throw Error('Conteúdo publicado inválido: '+key);
  return value;
 };
 const color=key=>{
  const value=string(key,7,true);
  if(!/^#[a-f0-9]{6}$/i.test(value))throw Error('Cor pública inválida.');
  return value;
 };
 const cta=string('cta_url',500,true);
 let url;
 try{url=new URL(cta);}catch{throw Error('CTA público inválido.');}
 if(url.protocol!=='https:'||url.username||url.password||
    !url.hostname||!url.hostname.includes('.'))
  throw Error('CTA público inválido.');
 if(!Array.isArray(row.sections)||row.sections.length>10)
  throw Error('Seções públicas inválidas.');
 const sections=row.sections.map(section=>{
  if(!section||typeof section!=='object'||Array.isArray(section)||
     !['benefit','proof','faq'].includes(section.type)||
     typeof section.title!=='string'||section.title.length>120||
     typeof section.body!=='string'||section.body.length>1000)
   throw Error('Seção pública inválida.');
  return {type:section.type,title:section.title,body:section.body};
 });
 return {
  agencyName:string('agency_name',160,true),
  title:string('title',150,true),
  headline:string('headline',180,true),
  subtitle:string('subtitle',500),
  ctaLabel:string('cta_label',60,true),
  ctaUrl:cta,primaryColor:color('primary_color'),
  secondaryColor:color('secondary_color'),sections,
  agency,slug,
 };
}
export const escapePublicHtml=value=>String(value)
 .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
 .replaceAll('"','&quot;').replaceAll("'",'&#39;');

export function renderPublicAgencyPage(page){
 const e=escapePublicHtml;
 const origin='https://meucomercial.com.br';
 const canonical=`${origin}/p/${page.agency}/${page.slug}`;
 const description=(page.subtitle||page.headline).slice(0,280);
 const pageTitle=`${page.title} | ${page.agencyName}`;
 const sections=page.sections.map((section,index)=>
  `<article class="feature" aria-labelledby="feature-${index}">
   <span class="eyebrow">${e(section.type==='faq'?'Pergunta frequente':section.type==='proof'?'Referência':'Benefício')}</span>
   <h3 id="feature-${index}">${e(section.title)}</h3>
   <p>${e(section.body)}</p>
  </article>`).join('');
 return `<!doctype html><html lang="pt-BR"><head>
 <meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
 <title>${e(pageTitle)}</title>
 <meta name="description" content="${e(description)}"/>
 <meta name="robots" content="index,follow,max-image-preview:large"/>
 <meta property="og:type" content="website"/>
 <meta property="og:locale" content="pt_BR"/>
 <meta property="og:title" content="${e(pageTitle)}"/>
 <meta property="og:description" content="${e(description)}"/>
 <meta property="og:url" content="${e(canonical)}"/>
 <meta name="twitter:card" content="summary"/>
 <meta name="twitter:title" content="${e(pageTitle)}"/>
 <meta name="twitter:description" content="${e(description)}"/>
 <link rel="canonical" href="${e(canonical)}"/>
 <meta name="theme-color" content="${page.primaryColor}"/>
 <style>
 :root{--primary:${page.primaryColor};--secondary:${page.secondaryColor};color-scheme:light}
 *{box-sizing:border-box}html{scroll-behavior:smooth}
 body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:#172033;background:#fbfcff}
 a{color:inherit}.shell{max-width:1150px;margin:auto;padding:0 24px}
 header{border-bottom:1px solid #e9edf3;background:white}
 header .shell{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}
 .brand{font-size:19px;font-weight:800;letter-spacing:-.6px;overflow-wrap:anywhere}
 .nav{font-size:13px;color:#536179}
 .hero{background:linear-gradient(130deg,var(--primary),var(--secondary));color:white;overflow:hidden;position:relative}
 .hero:before{content:"";position:absolute;width:430px;height:430px;border-radius:50%;right:-150px;top:-230px;background:rgba(255,255,255,.09)}
 .hero .shell{position:relative;padding:clamp(76px,12vw,145px) 24px;display:grid;gap:30px}
 .eyebrow{text-transform:uppercase;letter-spacing:2px;font-size:11px;font-weight:750}
 h1{font-size:clamp(36px,6.2vw,78px);letter-spacing:-2.5px;line-height:1.08;max-width:820px;margin:12px 0 0;overflow-wrap:anywhere}
 .lead{font-size:clamp(16px,2vw,21px);line-height:1.6;max-width:700px;opacity:.92;white-space:pre-wrap}
 .cta{display:inline-flex;align-items:center;justify-content:center;min-height:54px;width:max-content;max-width:100%;padding:14px 25px;text-align:center;border-radius:12px;background:#fff;color:#1b2641;font-weight:750;text-decoration:none;box-shadow:0 14px 45px #07152c33;overflow-wrap:anywhere}
 .cta:focus-visible,a:focus-visible{outline:3px solid #f6c947;outline-offset:4px}
 main{min-height:60vh}.section{padding:clamp(52px,8vw,98px) 0}
 .section-heading{font-size:clamp(26px,4vw,42px);letter-spacing:-1.1px;margin:0 0 30px}
 .features{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:18px}
 .feature{background:white;padding:clamp(22px,4vw,34px);border:1px solid #e5eaf3;border-radius:20px;box-shadow:0 4px 24px #253c5a08}
 .feature .eyebrow{color:var(--primary)}.feature h3{font-size:21px;letter-spacing:-.4px;overflow-wrap:anywhere}
 .feature p{font-size:15px;color:#55637b;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere}
 .end{background:#f0f4fa;text-align:center}.end .shell{display:grid;justify-items:center;gap:18px}
 .end h2{font-size:clamp(26px,4vw,42px);margin:0;letter-spacing:-1px}
 .end .cta{background:var(--primary);color:white}
 footer{padding:30px 0;font-size:12px;color:#65728b;border-top:1px solid #e8edf4}
 footer .shell{display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px}
 @media(max-width:500px){header .shell{min-height:68px}.nav{display:none}h1{letter-spacing:-1.1px}.cta{width:100%}}
 </style></head><body>
 <header><div class="shell"><div class="brand">${e(page.agencyName)}</div>
 <span class="nav">Apresentação comercial</span></div></header>
 <main><section class="hero"><div class="shell">
 <div><span class="eyebrow">${e(page.agencyName)}</span>
 <h1>${e(page.headline)}</h1></div>
 ${page.subtitle?`<p class="lead">${e(page.subtitle)}</p>`:''}
 <a class="cta" href="${e(page.ctaUrl)}" rel="noopener noreferrer"> ${e(page.ctaLabel)} </a>
 </div></section>
 ${sections?`<section class="section" aria-label="Benefícios e informações"><div class="shell">
 <h2 class="section-heading">Conheça nossa proposta</h2>
 <div class="features">${sections}</div></div></section>`:''}
 <section class="section end"><div class="shell">
 <h2>${e(page.headline)}</h2>
 <a class="cta" href="${e(page.ctaUrl)}" rel="noopener noreferrer">${e(page.ctaLabel)}</a>
 </div></section></main>
 <footer><div class="shell"><span>${e(page.agencyName)}</span>
 <span>Informações e condições devem ser confirmadas diretamente com a empresa.</span></div></footer>
 </body></html>`;
}
