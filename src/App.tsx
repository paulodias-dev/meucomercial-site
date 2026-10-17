import React, { useState, useEffect, useRef } from "react";
import {Tv, Calendar, TrendingUp, Award, ChevronRight, PhoneCall, Sparkles, MessageSquare, Menu, X, Mail, ArrowUp} from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import SEO from "./components/SEO";
import RadioGuide from "./components/RadioGuide";
import CommercialTrust from "./components/CommercialTrust";
import RadioShowcasePage from "./components/RadioShowcasePage";
import TvDemoPage from "./components/TvDemoPage";
import AdvertisingPage from "./components/AdvertisingPage";
import {readCommercialIntent, commercialMessage} from "./lib/commercialIntent.mjs";
import HeroSimulator from './components/HeroSimulator';
import BenefitsSection from './components/BenefitsSection';
import FeaturesSection from './components/FeaturesSection';
import StrategicConsultant from './components/StrategicConsultant';
import CommercialBrief from './components/CommercialBrief';
import FinalContactCTA from './components/FinalContactCTA';
import LeadContactModal from './components/LeadContactModal';
import type {TVLayout} from './components/MarketingTypes';
import AudienceJourneys, {type CommercialAudience} from "./components/AudienceJourneys";
import ClientPortal from "./components/ClientPortal";

// --- Shared marketing domain contracts ---

// --- Main App ---
export default function App() {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Active TV layout simulator state
  const [activeLayout, setActiveLayout] = useState<string>("multizona");
  
  // Interactive Simulator parameters
  const [customTickerText, setCustomTickerText] = useState("Lançamento da Campanha Trimestral Meu Comercial - Confira o painel de metas!");
  const [isTickerEditing, setIsTickerEditing] = useState(false);
  const [simulatedClockTime, setSimulatedClockTime] = useState("");

  // Plan/Price Calculator state
  const [screensCount, setScreensCount] = useState<number>(5);


  // Strategic consultant state
  const [selectedSegment, setSelectedSegment] = useState<string>("escritorio");
  const [additionalDetails, setAdditionalDetails] = useState<string>("");
  const [consultResponse, setConsultResponse] = useState<string>("");
  const [isConsulting, setIsConsulting] = useState<boolean>(false);
  const [consultError, setConsultError] = useState<string>("");

  // Lead / Specialist form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState("Geral");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [leadKind, setLeadKind] = useState<"establishment" | "agency" | "advertiser">("establishment");
  const [companyWebsite, setCompanyWebsite] = useState(""); // Bot honeypot
  const submissionKey = useRef<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    empresa: "",
    telas: "5",
    segmento: "escritorio",
    mensagem: ""
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        document.scrollingElement?.scrollTop ||
        0;

      setShowScrollTop(scrollTop > 520);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    const interval = window.setInterval(handleScroll, 300);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      window.clearInterval(interval);
    };
  }, []);

  // Update clock in simulated TV in real-time
  useEffect(() => {
    const updateSimulatedClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setSimulatedClockTime(`${hours}:${minutes}`);
    };
    updateSimulatedClock();
    const interval = setInterval(updateSimulatedClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // TV template layouts available in simulator
  const layouts: TVLayout[] = [
    {
      id: "multizona",
      name: "Multizona Corporativa",
      icon: <Tv className="w-4 h-4" />,
      description: "Layout dividido em 3 zonas: Boletim principal, widgets laterais e notícias RSS na base."
    },
    {
      id: "metas",
      name: "Mural de Metas & KPIs",
      icon: <TrendingUp className="w-4 h-4" />,
      description: "Destaque para dados comerciais, progresso de vendas e parabéns ao destaque do mês."
    },
    {
      id: "boasvindas",
      name: "Boas-vindas VIP",
      icon: <Award className="w-4 h-4" />,
      description: "Layout de impacto com recepção personalizada e QR Code dinâmico para visitantes."
    },
    {
      id: "avisos",
      name: "Grade de Avisos",
      icon: <Calendar className="w-4 h-4" />,
      description: "Ideal para comunicados internos rápidos, escala de plantões e lembretes de segurança."
    }
  ];

  // Strategic consulting request
  const handleStrategyConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsulting(true);
    setConsultError("");
    setConsultResponse("");

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segment: selectedSegment,
          additionalInfo: additionalDetails
        })
      });

      const data = await res.json();
      if (data.success) {
        setConsultResponse(data.answer);
      } else {
        throw new Error(data.error || "Ocorreu um erro ao gerar a estratégia.");
      }
    } catch (err: any) {
      console.error(err);
      setConsultError("Erro ao conectar com o consultor estratégico. Por favor, tente novamente.");
    } finally {
      setIsConsulting(false);
    }
  };

  const openAudienceContact = (kind: CommercialAudience, source: string) => {
    setLeadKind(kind);
    setFormData(prev => ({...prev, mensagem: ''}));
    openLeadModal(source);
  };

  // Open lead modal with source context
  const openLeadModal = (source: string) => {
    setModalSource(source);
    setFormData(prev => ({
      ...prev,
      telas: String(screensCount),
      segmento: selectedSegment
    }));
    setIsModalOpen(true);
    setFormError("");
    setFormSubmitted(false);
    setPrivacyConsent(false);
    setCompanyWebsite("");
    submissionKey.current = null;
  };

  // Accept a single, enumerated public journey request. No query-supplied
  // credentials, pricing, scopes, device identifiers or inventory are trusted.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const intent = readCommercialIntent(window.location.search)
    if (intent.action !== 'contact') return
    params.delete('action')
    window.history.replaceState(window.history.state, '', window.location.pathname +
      (params.toString() ? '?' + params.toString() : '') + window.location.hash)
    setLeadKind(intent.kind as CommercialAudience)
    setModalSource('Jornada - ' + intent.source)
    setFormSubmitted(false);setFormError('');setPrivacyConsent(false)
    setFormData(v => ({...v, mensagem: commercialMessage(intent)}))
    setIsModalOpen(true)
  }, [])

  // Commercial inquiries are only marked successful after API persistence.
  // Keep the same UUID across retries to make network timeouts safe.
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formSubmitting || !privacyConsent) return;
    if (!submissionKey.current) submissionKey.current = crypto.randomUUID();
    setFormSubmitting(true);
    setFormError("");
    const params = new URLSearchParams(window.location.search);

    try {
      const response = await fetch("/api/commercial-leads", {
        method: "POST",
        headers: {"Content-Type": "application/json", "Accept": "application/json"},
        body: JSON.stringify({
          idempotency_key: submissionKey.current,
          kind: leadKind,
          name: formData.nome.trim(),
          company: formData.empresa.trim(),
          email: formData.email.trim(),
          whatsapp: formData.whatsapp.trim(),
          screens_count: leadKind === "establishment" ? Number(formData.telas) : null,
          segment: leadKind === 'establishment' ? formData.segmento : null,
          message: formData.mensagem.trim() || null,
          source: modalSource,
          utm_source: params.get("utm_source")?.slice(0, 100) || null,
          utm_medium: params.get("utm_medium")?.slice(0, 100) || null,
          utm_campaign: params.get("utm_campaign")?.slice(0, 100) || null,
          consent: privacyConsent,
          website: companyWebsite,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.received !== true) {
        throw new Error(response.status === 429
          ? "Muitas solicitações em sequência. Tente novamente em alguns minutos."
          : response.status === 422
          ? "Revise os campos e confirme a autorização de contato."
          : response.status === 409
          ? "Ocorreu um conflito no envio. Atualize a página e tente novamente."
          : typeof data.message === "string" && response.status < 500
          ? data.message : "Não foi possível registrar sua solicitação. Tente novamente.");
      }
      setFormSubmitted(true);
      submissionKey.current = null;
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Falha de conexão. Tente novamente.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Helper markdown bold + syntax visualizer
  const renderBoldText = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-semibold text-brand-accent">{part}</strong>;
      }
      return part;
    });
  };

  const parseMarkdownToJSX = (md: string) => {
    if (!md) return null;
    return md.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;
      
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg md:text-xl font-bold text-[#1D1D1F] mt-6 mb-3 font-display flex items-center gap-2 border-b border-black/10 pb-2">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-sm md:text-base font-semibold text-blue-600 mt-4 mb-2 flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4 text-blue-600" />
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }
      
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2);
        return (
          <li key={idx} className="text-sm text-black/70 ml-5 list-disc mb-2 leading-relaxed">
            {renderBoldText(content)}
          </li>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const content = trimmed.replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="text-sm text-black/70 ml-5 list-decimal mb-2 leading-relaxed">
            {renderBoldText(content)}
          </li>
        );
      }
      
      return (
        <p key={idx} className="text-sm text-black/70 mb-3 leading-relaxed">
          {renderBoldText(trimmed)}
        </p>
      );
    });
  };

  // Dedicated client JWT area, not the agency Admin or the lead flow.
  if (window.location.pathname === '/portal' || window.location.pathname === '/portal/') {
    return <ClientPortal />;
  }
  if (window.location.pathname === '/radio-indoor' || window.location.pathname === '/radio-indoor/') {
    return <RadioShowcasePage />;
  }
  if (window.location.pathname === '/demonstracao-tv' || window.location.pathname === '/demonstracao-tv/') {
    return <TvDemoPage />;
  }
  if (window.location.pathname === '/anunciar' || window.location.pathname === '/anunciar/') {
    return <AdvertisingPage />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <SEO />
      
      {/* --- HEADER --- */}
      <header className="site-header glass-nav shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 p-0.5 shadow-md shadow-blue-600/10 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Tv className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-none text-[#1D1D1F] tracking-wide">
                Meu <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Comercial</span>
              </span>
              <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">TV Corporativa</span>
            </div>
          </a>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#recursos" className="text-sm text-black/60 hover:text-blue-600 transition-colors duration-200 font-medium">Recursos</a>
            <a href="#beneficios" className="text-sm text-black/60 hover:text-blue-600 transition-colors duration-200 font-medium">Por que nós</a>
            <a href="/portal" className="text-sm text-black/60 hover:text-blue-600 transition-colors duration-200 font-medium">Área do cliente</a>
            <a href="#para-quem" className="text-sm text-black/60 hover:text-blue-600 transition-colors duration-200 font-medium">Para quem é</a>
            <a href="#radio-indoor" className="text-sm text-black/60 hover:text-blue-600 transition-colors duration-200 font-medium">Rádio Indoor</a>
            <a href="/demonstracao-tv" className="text-sm text-black/60 hover:text-blue-600 transition-colors duration-200 font-medium">Prévia TV</a>
            <a href="/anunciar" className="text-sm text-black/60 hover:text-blue-600 transition-colors duration-200 font-medium">Anunciar</a>
            <a href="#consultor-estrategico" className="text-sm text-black/60 hover:text-blue-600 flex items-center gap-1 transition-colors duration-200 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Consultor Estratégico
            </a>
            <a href="#planos" className="text-sm text-black/60 hover:text-blue-600 transition-colors duration-200 font-medium">Planos</a>
          </nav>

          {/* CTA Button (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => openLeadModal("Header")}
              className="px-5 h-10 rounded-full text-xs font-semibold text-white bg-black hover:bg-black/80 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Fale com um Especialista
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            type="button"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-trigger"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="lg:hidden absolute top-full left-0 right-0 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-black/5 bg-white shadow-lg"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                <a 
                  href="#recursos" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-black/60 hover:text-black py-2 border-b border-black/5"
                >
                  Recursos
                </a>
                <a 
                  href="#beneficios" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-black/60 hover:text-black py-2 border-b border-black/5"
                >
                  Por que nós
                </a>
                <a href="/portal" onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-black/60 hover:text-black py-2 border-b border-black/5">
                  Área do cliente
                </a>
                <a href="#para-quem" onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-black/60 hover:text-black py-2 border-b border-black/5">
                  Para quem é
                </a>
                <a href="#radio-indoor" onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-black/60 hover:text-black py-2 border-b border-black/5">
                  Rádio Indoor
                </a>
                <a href="/demonstracao-tv" onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-black/60 hover:text-black py-2 border-b border-black/5">Prévia TV</a>
                <a href="/anunciar" onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-black/60 hover:text-black py-2 border-b border-black/5">Anunciar</a>
                <a 
                  href="#consultor-estrategico" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-black/60 hover:text-black py-2 border-b border-black/5 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Consultor Estratégico
                </a>
                <a 
                  href="#planos" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-black/60 hover:text-black py-2 border-b border-black/5"
                >
                  Planos & Orçamento
                </a>
                
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLeadModal("Mobile Menu");
                  }}
                  className="w-full mt-2 py-3 rounded-full text-sm font-semibold text-white bg-black hover:bg-black/80 text-center flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  Fale com um Especialista
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="sr-only">A demonstração abaixo é ilustrativa e não corresponde à reprodução em dispositivos reais.</div>
      <HeroSimulator activeLayout={activeLayout} setActiveLayout={setActiveLayout} layouts={layouts} customTickerText={customTickerText} setCustomTickerText={setCustomTickerText} simulatedClockTime={simulatedClockTime} openLeadModal={openLeadModal} />
      <CommercialTrust />

      <BenefitsSection /><FeaturesSection layouts={layouts} /><AudienceJourneys onContact={openAudienceContact} />
      <RadioGuide onContact={openLeadModal} />
      <StrategicConsultant selectedSegment={selectedSegment} setSelectedSegment={setSelectedSegment} additionalDetails={additionalDetails} setAdditionalDetails={setAdditionalDetails} consultResponse={consultResponse} consultError={consultError} isConsulting={isConsulting} handleStrategyConsult={handleStrategyConsult} parseMarkdownToJSX={parseMarkdownToJSX} openLeadModal={openLeadModal} /><CommercialBrief screensCount={screensCount} setScreensCount={setScreensCount} leadKind={leadKind} setLeadKind={setLeadKind} openAudienceContact={openAudienceContact} /><FinalContactCTA  openLeadModal={openLeadModal} />
      {/* --- FOOTER --- */}
      <footer className="bg-[#F5F5F7] border-t border-black/5 pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            
            {/* Logo / Brand block */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                  <Tv className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-base leading-none text-[#1D1D1F] tracking-wide">
                    Meu <span className="text-blue-600">Comercial</span>
                  </span>
                  <span className="text-[8px] text-black/40 font-mono tracking-widest uppercase font-bold">Mídia Indoor e TV</span>
                </div>
              </div>
              <p className="text-xs text-black/60 leading-relaxed max-w-sm">
                A plataforma de TV Corporativa e Sinalização Digital em nuvem que conecta líderes e liderados com velocidade, modernidade e extrema clareza visual.
              </p>
              <div className="flex items-center gap-3 mt-2">
                {/* Canal comercial oficial, sem perfis sociais fictícios. */}
                <a href="mailto:comercial@meucomercial.com.br" className="text-xs font-semibold text-blue-700 hover:underline">Fale com o comercial por e-mail</a>
              </div>
            </div>

            {/* Quick Links Nav */}
            <div className="md:col-span-2">
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#1D1D1F] font-bold mb-4">Nossa Plataforma</h4>
              <ul className="flex flex-col gap-2 text-xs text-black/60">
                <li><a href="#recursos" className="hover:text-blue-600 transition-colors">Recursos Gerais</a></li>
                <li><a href="#simulador" className="hover:text-blue-600 transition-colors">TV Simuladora</a></li>
                <li><a href="#consultor-estrategico" className="hover:text-blue-600 transition-colors">Consultor Estratégico</a></li>
                <li><a href="#planos" className="hover:text-blue-600 transition-colors">Solicitar Proposta</a></li>
                <li><a href="#beneficios" className="hover:text-blue-600 transition-colors">Como Funciona</a></li>
              </ul>
            </div>

            {/* Support / Contact details */}
            <div className="md:col-span-3">
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#1D1D1F] font-bold mb-4">Contato & Comercial</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-black/60">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>comercial@meucomercial.com.br</span>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>(62) 9 9196-2033 (Comercial)</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>(62) 9 9196-2033 (WhatsApp)</span>
                </li>
                <li className="text-[10px] text-black/40 mt-1 leading-relaxed font-semibold">
                  Consulte disponibilidade de atendimento remoto
                </li>
              </ul>
            </div>

            {/* Newsletter form */}
            <div className="md:col-span-3">
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#1D1D1F] font-bold mb-4">Dicas de Mídia Indoor</h4>
              <p className="text-xs text-black/60 leading-relaxed mb-3">
                Estamos preparando conteúdos práticos sobre TV e Rádio Indoor para negócios locais.
              </p>
              
              <p className="text-xs text-black/50 mb-3">A inscrição automática por e-mail ainda não está disponível. Para falar com nossa equipe:</p>
              <button type="button" onClick={() => openLeadModal("Rodapé - Atendimento")}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">
                Solicitar atendimento
              </button>
            </div>

          </div>

          {/* Legal / Copyright line */}
          <div className="pt-8 mt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-black/40 font-mono font-semibold">
            <span>© Meu Comercial 2026 • Condições comerciais sujeitas a confirmação formal.</span>
            <div className="flex gap-4">
              <a href="mailto:comercial@meucomercial.com.br?subject=Solicitacao%20de%20politica%20de%20privacidade" className="hover:text-[#1D1D1F] underline">Solicitar política de privacidade</a>
              <span>•</span>
              <a href="mailto:comercial@meucomercial.com.br?subject=Solicitacao%20dos%20termos%20de%20uso" className="hover:text-[#1D1D1F] underline">Solicitar termos de uso</a>
            </div>
          </div>

        </div>
      </footer>

      <button
        type="button"
        aria-label="Voltar ao topo"
        title="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`scroll-top-button ${showScrollTop ? "is-visible" : ""}`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>


      <LeadContactModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} leadKind={leadKind} setLeadKind={setLeadKind} formSubmitted={formSubmitted} formSubmitting={formSubmitting} formError={formError} formData={formData} setFormData={setFormData} privacyConsent={privacyConsent} setPrivacyConsent={setPrivacyConsent} companyWebsite={companyWebsite} setCompanyWebsite={setCompanyWebsite} handleLeadSubmit={handleLeadSubmit} />

    </div>
  );
}
