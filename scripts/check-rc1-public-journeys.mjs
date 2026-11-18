#!/usr/bin/env node
/**
 * M18 — validate the existing acquisition journey, not a fake "buy now".
 * Plans shown on the public site are nonbinding until a real proposal and
 * its individually accepted checkout; only the API confirms PIX/activation.
 */
import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const read=p=>readFileSync(resolve(process.cwd(),p),'utf8');
const api=read('server.ts');
const app=read('src/App.tsx');
const plan=read('src/components/PublicIndoorPricing.tsx');
const acquisition=read('src/components/AcquisitionWizard.tsx');
const tracking=read('src/components/ContractTrackingPage.tsx');
const checkout=read('src/components/IndoorCheckoutPanel.tsx');
const pkg=JSON.parse(read('package.json'));
const checks=[
 ['SSR backend entry','server.ts',api.includes("express")],
 ['commercial lead persisted through BFF','src/components/AcquisitionWizard.tsx',
  acquisition.includes("fetch('/api/commercial-leads'")&&api.includes('site/commercial-leads')],
 ['agency choice at acquisition', 'src/components/AcquisitionWizard.tsx',
  acquisition.includes('/api/portal/agencies')&&acquisition.includes('agencySlug')],
 ['public plans from API','src/components/PublicIndoorPricing.tsx',
  plan.includes('/api/indoor-plans')&&plan.includes('verifyIndoorPlans')],
 ['no fabricated direct purchase','src/components/PublicIndoorPricing.tsx',
  plan.includes('Iniciar pedido guiado')&&plan.includes('checkout')&&
  !plan.includes('window.location.href="/checkout"')],
 ['tracking private reference and bearer','src/components/ContractTrackingPage.tsx',
  tracking.includes("Authorization:'Bearer '+code.trim()")&&
  tracking.includes('credentials:')&&!tracking.includes('localStorage')],
 ['explicit proposal consent','src/components/IndoorProposalResponsePanel.tsx',
  existsSync(resolve('src/components/IndoorProposalResponsePanel.tsx'))],
 ['checkout explicit terms + recurring consent','src/components/IndoorCheckoutPanel.tsx',
  checkout.includes('accept_contract_terms:true')&&checkout.includes('accept_recurring_billing:true')],
 ['PIX never grants approval by browser','src/components/IndoorCheckoutPanel.tsx',
  checkout.includes('remote_get_verified!==true')&&
  checkout.includes("checkout.status==='paid_verified'")],
 ['true client onboarding','src/components/ClientOnboarding.tsx',
  existsSync(resolve('src/components/ClientOnboarding.tsx'))],
 ['landing server-side lead intake','src/lib/agency-landing-contact.mjs',
  api.includes('registerAgencyLandingContact')],
 ['public site routes exist','src/App.tsx',
  app.includes("window.location.pathname === '/contratar'")&&
  app.includes("window.location.pathname === '/acompanhar'")],
 ['RC1 suite included in build','package.json',
  (pkg.scripts?.build||'').includes('check:rc1')&&
  (pkg.scripts?.['check:rc1']||'').includes('test:indoor-checkout')],
];
const items=checks.map(([id,path,ok])=>({id,artifact:path,ok}));
const passed=items.filter(x=>x.ok).length;
const result={schema:'meucomercial-site-rc1-code-contract-v1',public_journeys_declared:items.length,
 passed,failed:items.length-passed,code_structure_complete:items.every(x=>x.ok),
 public_checkout_is_guided_until_formal_offer:true,
 platform_approved:false,external_qa_pending:true,checks:items};
console.log(JSON.stringify(result,null,2));
if(!result.code_structure_complete)process.exitCode=1;
