import React, { useState, useEffect, useRef } from "react";
import { 
  Tv, 
  Settings, 
  Calendar, 
  Volume2, 
  Play, 
  TrendingUp, 
  Users, 
  Award, 
  Clock, 
  CloudSun, 
  Newspaper, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  PhoneCall, 
  ArrowRight, 
  Zap, 
  Monitor, 
  QrCode, 
  Check, 
  DollarSign, 
  Sparkles, 
  MessageSquare,
  ChevronDown,
  Menu,
  X,
  FileText,
  Mail,
  ShieldCheck,
  Loader2,
  ArrowUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SEO from "./components/SEO";
import RadioGuide from "./components/RadioGuide";
import CommercialTrust from "./components/CommercialTrust";
import RadioShowcasePage from "./components/RadioShowcasePage";
import AudienceJourneys, {type CommercialAudience} from "./components/AudienceJourneys";
import ClientPortal from "./components/ClientPortal";

// --- Types ---
interface TVLayout {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

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
            <a href="#simulador" className="text-sm text-black/60 hover:text-blue-600 transition-colors duration-200 font-medium">Demonstração</a>
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
                <a 
                  href="#simulador" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-black/60 hover:text-black py-2 border-b border-black/5"
                >
                  Demonstração
                </a>
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

      {/* --- HERO SECTION --- */}
      <section id="simulador" className="relative pt-24 pb-16 sm:pt-28 md:pt-32 md:pb-24 lg:pt-36 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold self-center lg:self-start shadow-sm">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              <span>Software em nuvem com hardware opcional</span>
            </div>

            <h1 className="font-display font-extrabold text-[2.35rem] sm:text-5xl lg:text-6xl text-[#1D1D1F] leading-[1.08] tracking-tight">
              Transforme suas <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TVs em um canal</span> que informa equipes e vende mais no ponto de venda
            </h1>

            <p className="text-black/60 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Gerencie telas remotamente, atualize campanhas em segundos e leve mais impacto para comunicados internos, promoções, ofertas e avisos importantes. Use as TVs que você já tem ou receba a solução completa pronta para ligar.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mt-2">
              <button 
                onClick={() => openLeadModal("Hero CTA Principal")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Quero Ver Minha TV em Ação
                <ArrowRight className="w-4 h-4" />
              </button>
              <a 
                href="#simulador"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-sm bg-white hover:bg-black/5 text-[#1D1D1F] border border-black/10 hover:border-black/20 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <Play className="w-4 h-4 text-blue-600" />
                Ver como funciona
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-black/5 max-w-md mx-auto lg:mx-0 mt-4">
              <div className="text-center lg:text-left">
                <span className="block text-2xl font-bold text-[#1D1D1F] font-display">10s</span>
                <span className="text-xs text-black/40">Para atualizar a tela</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-2xl font-bold text-[#1D1D1F] font-display">100%</span>
                <span className="text-xs text-black/40">Gestão na nuvem</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-2xl font-bold text-[#1D1D1F] font-display">+80%</span>
                <span className="text-xs text-black/40">De engajamento</span>
              </div>
            </div>

          </div>

          {/* Hero Right: Interactive TV Simulator Mockup */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            <div className="w-full max-w-lg lg:max-w-xl">
              {/* Virtual TV Header Label */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 px-1">
                <span className="text-xs text-black/50 font-mono flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  Simulador de TV On-line
                </span>
                <span className="text-xs text-blue-600 font-semibold">Tente mudar o Layout abaixo!</span>
              </div>

              {/* TV FRAME */}
              <div className="relative aspect-video w-full rounded-2xl bg-black border-4 border-[#1D1D1F] shadow-2xl overflow-hidden flex flex-col">
                
                {/* Simulated Content inside TV */}
                <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col bg-[#050508] select-none">
                  
                  <AnimatePresence mode="wait">
                    {/* --- LAYOUT 1: MULTIZONA --- */}
                    {activeLayout === "multizona" && (
                      <motion.div 
                        key="multizona"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full flex flex-col text-white"
                      >
                        {/* Upper Content Areas */}
                        <div className="flex-1 grid grid-cols-12 gap-1.5 p-1.5 min-h-0">
                          
                          {/* Main News Zone */}
                          <div className="col-span-8 bg-[#090a12]/90 rounded-lg p-3 border border-white/5 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-[9px] bg-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Boletim Interno</span>
                                <span className="text-[8px] text-gray-400">Canal Principal</span>
                              </div>
                              <h4 className="text-sm font-semibold text-white tracking-tight leading-tight">
                                Grande Convenção Anual de Colaboradores: Inscrições Abertas!
                              </h4>
                              <p className="text-[10px] text-gray-400 mt-1.5 line-clamp-2">
                                Participe do nosso maior encontro de inovação. Acesse o portal corporativo e garanta sua vaga para os workshops estratégicos de 2026.
                              </p>
                            </div>
                            
                            {/* Graphic mockup bar */}
                            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                              <span className="text-[8px] text-gray-500 font-mono">Postado por Comunicação Interna</span>
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                              </div>
                            </div>
                          </div>

                          {/* Sidebar Widgets (Weather + Time + QR) */}
                          <div className="col-span-4 flex flex-col gap-1.5">
                            
                            {/* Time & Weather */}
                            <div className="bg-[#0c0d16] rounded-lg p-2 border border-white/5 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-gray-400 block font-mono">São Paulo</span>
                                <span className="text-base font-bold font-mono tracking-tight text-white leading-none">
                                  {simulatedClockTime || "12:00"}
                                </span>
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <CloudSun className="w-5 h-5 text-amber-400 animate-pulse" />
                                <span className="text-[9px] font-mono font-medium text-gray-300">22°C</span>
                              </div>
                            </div>

                            {/* Live QR Code Widget */}
                            <div className="flex-1 bg-[#0b0c14] rounded-lg p-2.5 border border-white/5 flex flex-col items-center justify-center text-center gap-1">
                              <QrCode className="w-10 h-10 text-white" />
                              <span className="text-[7px] text-gray-400 leading-tight">
                                Acesse os benefícios pelo celular
                              </span>
                              <span className="text-[8px] font-bold text-blue-400 uppercase font-mono">Escaneie Aqui</span>
                            </div>

                          </div>
                        </div>

                        {/* Scrolling Ticker Line (Bottom Bar) */}
                        <div className="h-6 bg-[#0066cc] flex items-center overflow-hidden whitespace-nowrap px-3 text-[10px] font-medium text-white select-none border-t border-white/10 relative contain-layout">
                          <div className="absolute left-0 top-0 bottom-0 bg-[#0055b3] px-2 flex items-center font-bold text-[8px] uppercase tracking-wider z-10 shadow-md">
                            Avisos URGENTES
                          </div>
                          <div className="ticker-marquee">
                            <span>{customTickerText}</span>
                            <span className="text-blue-400">•</span>
                            <span>{customTickerText}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* --- LAYOUT 2: METAS --- */}
                    {activeLayout === "metas" && (
                      <motion.div 
                        key="metas"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full p-3 bg-gradient-to-b from-[#090a16] to-[#040409] flex flex-col justify-between text-white"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold uppercase tracking-wider">Painel Comercial de Vendas</span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-400">Atualizado: Agora</span>
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-2 gap-3 my-2 flex-1">
                          
                          {/* Metas Card */}
                          <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 flex flex-col justify-between">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wide">Meta Mensal de Junho</span>
                            <div>
                              <span className="text-xl font-extrabold text-emerald-400">92,4%</span>
                              <div className="w-full bg-white/10 rounded-full h-1.5 mt-1 overflow-hidden">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "92%" }}></div>
                              </div>
                            </div>
                            <span className="text-[8px] text-gray-500">Faltam R$ 15.200 para bater 100%!</span>
                          </div>

                          {/* Highlight Employee */}
                          <div className="bg-gradient-to-tr from-blue-500/20 to-transparent rounded-lg p-2.5 border border-blue-500/20 flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-500/40 flex items-center justify-center font-bold text-white shadow-inner">
                              LR
                            </div>
                            <div className="flex-1">
                              <span className="text-[8px] text-blue-400 uppercase font-bold tracking-wider block">Destaque do Mês</span>
                              <span className="text-xs font-bold block text-white">Lucas Rocha</span>
                              <span className="text-[9px] text-gray-400">114% da meta atingida</span>
                            </div>
                          </div>

                        </div>

                        {/* Bottom line */}
                        <div className="bg-white/5 rounded px-2 py-1 text-center text-[9px] text-gray-400 font-mono">
                          🏆 Juntos somos mais fortes! Parabéns à equipe comercial pelo engajamento extraordinário.
                        </div>
                      </motion.div>
                    )}

                    {/* --- LAYOUT 3: BOAS-VINDAS --- */}
                    {activeLayout === "boasvindas" && (
                      <motion.div 
                        key="boasvindas"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full p-4 bg-[#0a0614] flex flex-col justify-between text-white relative overflow-hidden"
                      >
                        {/* Abstract background blobs inside TV */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />

                        {/* Header logo marker */}
                        <div className="flex justify-between items-center z-10">
                          <span className="text-[9px] font-mono tracking-widest text-blue-400 uppercase font-semibold">Meu Comercial Lounge</span>
                          <span className="text-[8px] text-gray-500 font-mono">IP: 192.168.1.104</span>
                        </div>

                        {/* Body Message */}
                        <div className="my-auto text-center z-10 px-4">
                          <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Seja Bem-vindo(a)</span>
                          <h3 className="text-lg md:text-xl font-extrabold text-white leading-tight">
                            Diretoria de Operações e Clientes Estratégicos
                          </h3>
                          <p className="text-[10px] text-gray-400 mt-2">
                            É uma honra recebê-los em nossa sede corporativa hoje.
                          </p>
                        </div>

                        {/* Footer info card */}
                        <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-between z-10">
                          <div className="flex items-center gap-2">
                            <QrCode className="w-6 h-6 text-blue-400" />
                            <div className="text-left">
                              <span className="text-[8px] text-gray-400 block">Wi-Fi Visitantes</span>
                              <span className="text-[9px] font-mono font-bold text-white">Rede: INOVA_VISITANTES</span>
                            </div>
                          </div>
                          <span className="text-[8px] bg-blue-500/30 text-white px-2 py-1 rounded font-mono font-bold">Senha: #Inova2026</span>
                        </div>
                      </motion.div>
                    )}

                    {/* --- LAYOUT 4: AVISOS --- */}
                    {activeLayout === "avisos" && (
                      <motion.div 
                        key="avisos"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full p-3 bg-[#0a0a0e] flex flex-col text-white"
                      >
                        <div className="text-center border-b border-white/5 pb-1.5 mb-2">
                          <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">Avisos Importantes da Semana</span>
                        </div>

                        {/* Avisos list */}
                        <div className="flex-1 flex flex-col gap-1.5 justify-center">
                          <div className="bg-white/5 rounded p-2 border-l-2 border-blue-500 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span className="text-[11px] font-medium">Reunião de Alinhamento Geral</span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono">Sexta, 16:00</span>
                          </div>

                          <div className="bg-white/5 rounded p-2 border-l-2 border-indigo-400 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-indigo-400" />
                              <span className="text-[11px] font-medium">Treinamento de Cibersegurança Obrigatório</span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono">Prazo: Até 15/Jul</span>
                          </div>

                          <div className="bg-white/5 rounded p-2 border-l-2 border-amber-500 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber-500" />
                              <span className="text-[11px] font-medium">Preenchimento da Escala de Férias</span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono">RH Corporativo</span>
                          </div>
                        </div>

                        <div className="text-[8px] text-center text-gray-500 mt-2 font-mono">
                          Se tiver dúvidas, entre em contato pelo ramal 4022.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* TV Brand Plate */}
                <div className="h-6 bg-[#16161c] flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono border-t border-[#1D1D1F]">
                  <span className="flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-gray-400" />
                    Meu Comercial TV Player
                  </span>
                  <span className="font-bold tracking-widest text-gray-400">MEU COMERCIAL</span>
                  <span className="text-emerald-500 font-bold">● ONLINE</span>
                </div>

              </div>

              {/* TV CONTROL PANEL (REMOTE) */}
              <div className="mt-4 p-4 rounded-2xl bg-white border border-black/5 shadow-sm">
                <p className="text-xs text-black/50 font-medium mb-3 text-center sm:text-left">
                  🎮 Controle as Telas: Clique para alternar o que está passando na TV
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {layouts.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => setActiveLayout(layout.id)}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 justify-center transition-all duration-300 ${
                        activeLayout === layout.id
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10 scale-[1.03]"
                          : "bg-[#F5F5F7] hover:bg-black/5 text-[#1D1D1F] border border-black/5"
                      }`}
                    >
                      {layout.icon}
                      {layout.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Edit Ticker form (only visible on Multizona) */}
                {activeLayout === "multizona" && (
                  <div className="mt-3.5 pt-3.5 border-t border-black/5">
                    <label className="text-[11px] text-black/50 block mb-1">
                      Edite o Ticker de Notícias (Passando na base da TV):
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={customTickerText}
                        onChange={(e) => setCustomTickerText(e.target.value)}
                        className="flex-1 min-w-0 bg-[#F5F5F7] border border-black/10 rounded-xl px-3 py-1.5 text-xs text-black focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/15"
                        placeholder="Escreva uma mensagem para rodar na TV..."
                      />
                      <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-600 px-2 py-1 rounded-lg font-mono flex items-center justify-center">
                        Editado ao Vivo
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      <CommercialTrust />

      {/* --- PROBLEMA VS. SOLUÇÃO --- */}
      <section id="beneficios" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">Como Funciona</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1D1D1F] tracking-tight">
              Comece com as TVs que você já tem. Ou receba tudo pronto para ligar.
            </h2>
            <p className="text-black/60 text-sm sm:text-base leading-relaxed">
              Assine apenas o software para gerenciar suas telas atuais ou escolha a solução completa com equipamento homologado. Em ambos os casos, a instalação é plug-and-play: conectou, entrou na internet e começou a publicar, sem depender de conhecimento técnico.
            </p>
          </div>

          {/* Grid Cards (Apple style Bento) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-black/10 shadow-sm transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-100 transition-colors">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-2 font-display">Mais controle, menos operação manual</h3>
                <p className="text-black/50 text-sm leading-relaxed">
                  Atualize uma ou várias unidades a partir de um único painel e elimine pendrives, deslocamentos e improvisos na rotina.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-black/10 shadow-sm transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-100 transition-colors">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-2 font-display">Campanhas no ar no momento certo</h3>
                <p className="text-black/50 text-sm leading-relaxed">
                  Troque ofertas, recados e avisos em segundos para aproveitar picos de venda, ações sazonais e comunicados urgentes.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-black/10 shadow-sm transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-100 transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-2 font-display">Implantação sem complicação</h3>
                <p className="text-black/50 text-sm leading-relaxed">
                  Use suas TVs atuais com a assinatura do sistema ou peça software + hardware pronto para uso. Ligou, conectou e começou.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-black/10 shadow-sm transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-100 transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-2 font-display">Mais atenção, mais resultado</h3>
                <p className="text-black/50 text-sm leading-relaxed">
                  Transforme recepções, lojas, clínicas, academias e áreas internas em canais que engajam pessoas e ajudam a vender mais.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- RECURSOS / ZIG-ZAG FEATURES --- */}
      <section id="recursos" className="py-20 bg-white relative border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">Tecnologia que Gera Resultado</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1D1D1F] tracking-tight">
              Recursos pensados para aumentar impacto, padronização e velocidade
            </h2>
            <p className="text-black/60 text-sm sm:text-base leading-relaxed">
              Cada função foi desenhada para reduzir operação manual e transformar cada tela em um canal de comunicação e conversão.
            </p>
          </div>

          {/* Feature 1 (Zig-zag) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase font-mono tracking-wider">
                <Calendar className="w-4 h-4" />
                Agendamento Inteligente
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1D1D1F] leading-tight">
                Coloque ofertas e comunicados no ar exatamente quando eles geram mais resultado
              </h3>
              <p className="text-black/60 text-sm sm:text-base leading-relaxed">
                Agende campanhas por horário, dia, unidade ou período e mantenha promoções, metas e avisos sempre atualizados. Isso evita conteúdo vencido, acelera ações comerciais e dá mais previsibilidade à comunicação interna.
              </p>
              <ul className="flex flex-col gap-2.5 mt-2">
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Ative promoções sazonais sem depender da equipe da loja
                </li>
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Programe validade automática e evite ofertas desatualizadas
                </li>
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Publique em lote para várias TVs ou filiais ao mesmo tempo
                </li>
              </ul>
            </div>
            
            {/* Visual Panel Mockup 1 */}
            <div className="lg:col-span-6 bg-[#F5F5F7] border border-black/5 rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-black/40 font-mono">Agendamento de Campanhas</span>
              </div>
              {/* Virtual Timeline UI */}
              <div className="flex flex-col gap-3 font-mono">
                <div className="p-3 rounded-xl bg-white border border-black/5 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] text-blue-600 font-bold block uppercase">Campanha Ativa</span>
                    <span className="text-xs font-bold text-black block">Meta de Vendas de Junho</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">Ativo Diariamente</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-black/5 flex items-center justify-between opacity-85 shadow-sm">
                  <div>
                    <span className="text-[10px] text-amber-500 font-semibold block uppercase">Agendado</span>
                    <span className="text-xs font-bold text-black block">Boas-vindas Visita Diretores</span>
                  </div>
                  <span className="text-[10px] bg-black/5 text-black/60 px-2 py-0.5 rounded-full font-bold">08/Jul • 08:00 - 18:00</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-black/5 flex items-center justify-between opacity-50 shadow-sm">
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Expirado</span>
                    <span className="text-xs font-bold text-black block">Promoções de Festa Junina</span>
                  </div>
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-bold">Expirou 30/Jun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 (Zig-zag inverted) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            
            {/* Visual Panel Mockup 2 (Interactive Split screen) */}
            <div className="order-2 lg:order-1 lg:col-span-6 bg-[#F5F5F7] border border-black/5 rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-[#1D1D1F] font-medium">Layout de Tela Compartilhada</span>
                </div>
                <span className="text-xs text-black/40 font-mono">Multi-zone Digital</span>
              </div>
              
              {/* Split Screen interactive selector for Multi-zone visual */}
              <div className="grid grid-cols-12 gap-2 aspect-video bg-black/90 p-2 rounded-xl">
                <div className="col-span-8 bg-blue-600/10 border border-blue-500/40 rounded-lg p-2.5 flex flex-col justify-between text-center">
                  <span className="text-[9px] font-bold text-blue-400 uppercase">Área 1: Principal</span>
                  <div className="my-auto">
                    <span className="text-xs font-semibold block text-white">Vídeos ou Imagens</span>
                    <span className="text-[8px] text-gray-400 block mt-1">Sua Campanha em Foco (60%)</span>
                  </div>
                </div>
                <div className="col-span-4 flex flex-col gap-2">
                  <div className="flex-1 bg-amber-500/10 border border-amber-500/40 rounded-lg p-1.5 flex flex-col justify-center text-center">
                    <span className="text-[8px] font-bold text-amber-400 uppercase">Área 2: Clima</span>
                    <CloudSun className="w-4 h-4 mx-auto text-amber-400 mt-0.5" />
                  </div>
                  <div className="flex-1 bg-purple-500/10 border border-purple-500/40 rounded-lg p-1.5 flex flex-col justify-center text-center">
                    <span className="text-[8px] font-bold text-purple-400 uppercase">Área 3: QR Code</span>
                    <QrCode className="w-4 h-4 mx-auto text-purple-400 mt-0.5" />
                  </div>
                </div>
                <div className="col-span-12 bg-emerald-500/10 border border-emerald-500/40 rounded-lg p-1 flex items-center justify-between px-3 text-[8px]">
                  <span className="font-bold text-emerald-400 uppercase">Área 4: Ticker de Notícias</span>
                  <span className="text-white font-mono truncate max-w-[200px]">Previsão de inflação recua e mercado financeiro projeta crescimento...</span>
                </div>
              </div>
              <p className="text-xs text-black/50 mt-4 text-center font-medium">
                🖥️ Divida a tela como quiser para maximizar as informações sem sobrecarregar a audiência.
              </p>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col gap-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase font-mono tracking-wider">
                <Monitor className="w-4 h-4" />
                Layouts que Vendem e Informam
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1D1D1F] leading-tight">
                Mostre mais conteúdo útil na mesma tela sem perder clareza
              </h3>
              <p className="text-black/60 text-sm sm:text-base leading-relaxed">
                Use múltiplos layouts para destacar o que importa em cada ambiente: oferta principal na vitrine, QR Code na recepção, metas no escritório e avisos em áreas internas. Assim, cada tela trabalha a favor da experiência e do faturamento.
              </p>
              <ul className="flex flex-col gap-2.5 mt-2">
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Destaque produtos, campanhas e CTAs com mais visibilidade
                </li>
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Adapte a comunicação para recepção, loja, clínica ou escritório
                </li>
                <li className="flex items-center gap-2 text-sm text-black/70 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Mantenha a marca padronizada em todas as unidades
                </li>
              </ul>
            </div>

          </div>

          {/* Feature 3 (Zig-zag) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase font-mono tracking-wider">
                <FileText className="w-4 h-4" />
                Conteúdo sem Barreiras
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1D1D1F] leading-tight">
                Publique vídeos, imagens e widgets sem travar sua operação
              </h3>
              <p className="text-black/60 text-sm sm:text-base leading-relaxed">
                Suba os formatos que sua equipe já usa e mantenha a programação viva com notícias, clima, dashboards e conteúdos institucionais. Menos dependência técnica, mais velocidade para comunicar e vender.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="p-3 bg-[#F5F5F7] rounded-xl border border-black/5 shadow-sm">
                  <span className="font-bold text-[#1D1D1F] text-xs block mb-1">Mídias que valorizam campanhas</span>
                  <span className="text-xs text-black/50">Vídeos, ofertas e peças visuais sem conversões complexas.</span>
                </div>
                <div className="p-3 bg-[#F5F5F7] rounded-xl border border-black/5 shadow-sm">
                  <span className="font-bold text-[#1D1D1F] text-xs block mb-1">Widgets que mantêm a tela relevante</span>
                  <span className="text-xs text-black/50">Clima, notícias e painéis dinâmicos para aumentar atenção e permanência.</span>
                </div>
              </div>
            </div>
            
            {/* Mockup 3 */}
            <div className="lg:col-span-6 bg-[#F5F5F7] border border-black/5 rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              <span className="text-xs text-black/40 font-mono block mb-3">Formatos de Mídia Homologados</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded font-bold">MP4</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Vídeos 1080p / 4K</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded font-bold">PNG / JPG</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Folders & Encartes</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded font-bold">RSS</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Notícias do Dia</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded font-bold">HTML5</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Painéis e Dashboards</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded font-bold">URL</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Links Integrados</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-center flex flex-col items-center gap-1.5 shadow-sm">
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded font-bold">WIDGET</span>
                  <span className="text-xs text-black/70 font-semibold font-mono">Clima & Finanças</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
                    <AudienceJourneys onContact={openAudienceContact} />
      <RadioGuide onContact={openLeadModal} />
      {/* --- STRATEGIC CONSULTANT --- */}
      <section id="consultor-estrategico" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#F5F5F7]">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center mb-12 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold self-center">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Exclusivo: Diagnóstico Estratégico Integrado</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1D1D1F] tracking-tight">
              Gere um Plano de Conteúdo Customizado Instantaneamente
            </h2>
            <p className="text-black/60 text-sm sm:text-base leading-relaxed">
              Dúvidas sobre o que exibir em suas TVs? Selecione o seu segmento de negócio, adicione alguma particularidade e receba uma estratégia corporativa completa em segundos.
            </p>
          </div>

          {/* Form and Strategic Display Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-black/5 shadow-md">
            
            <form onSubmit={handleStrategyConsult} className="flex flex-col gap-6">
              
              {/* Step 1: Segment Selector */}
              <div>
                <label className="text-xs text-black/50 uppercase font-mono tracking-wider font-semibold block mb-3">
                  Passo 1: Selecione seu segmento de negócio
                </label>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: "escritorio", name: "Escritório", label: "🏢 Escritório" },
                    { id: "varejo", name: "Varejo/Lojas", label: "🛍️ Varejo/Ofertas" },
                    { id: "academia", name: "Academia", label: "🏋️ Academia" },
                    { id: "clinica", name: "Clínicas/Espera", label: "🏥 Clínica/Espera" },
                    { id: "geral", name: "Outro Negócio", label: "📺 Outro Segmento" }
                  ].map((seg) => (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setSelectedSegment(seg.id)}
                      className={`p-3 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                        selectedSegment === seg.id
                          ? "bg-blue-600 text-white border-transparent shadow-sm scale-[1.03]"
                          : "bg-[#F5F5F7] text-black/70 hover:text-black border-black/5 hover:border-black/10 hover:bg-black/5"
                      }`}
                    >
                      {seg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Details */}
              <div>
                <label className="text-xs text-black/50 uppercase font-mono tracking-wider font-semibold block mb-2">
                  Passo 2: Adicione alguma observação ou dor da sua equipe (Opcional)
                </label>
                <textarea
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Exemplo: 'Temos dificuldade em divulgar as datas de aniversários e as metas diárias da fábrica, as pessoas ignoram os cartazes impressos...'"
                  rows={3}
                  className="w-full bg-[#F5F5F7] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 placeholder:text-black/40 transition-all duration-200"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isConsulting}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isConsulting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    Formatando Plano de Conteúdo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    Gerar Plano Estratégico Sob Medida Grátis
                  </>
                )}
              </button>

            </form>

            {/* ERROR DISPLAY */}
            {consultError && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-sm text-red-600">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{consultError}</span>
              </div>
            )}

            {/* RESULTS VIEW */}
            <AnimatePresence>
              {consultResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 pt-8 border-t border-black/10"
                >
                  <div className="p-5 sm:p-7 rounded-2xl bg-[#F5F5F7] border border-black/5 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                      <span className="text-xs bg-blue-50 border border-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        Plano Estratégico Gerado
                      </span>
                      <span className="text-[10px] text-black/40 font-mono">Gerado em: 2026</span>
                    </div>

                    {/* Markdown strategy content container */}
                    <div className="text-left text-black/80 space-y-4 max-h-[380px] overflow-y-auto pr-2 no-scrollbar">
                      {parseMarkdownToJSX(consultResponse)}
                    </div>

                    {/* Strategic CTA */}
                    <div className="mt-6 pt-5 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-xs text-black/50 text-center sm:text-left font-medium">
                        💡 Gostou do plano? Nosso hardware de TV já vem com todos esses templates configurados!
                      </p>
                      <button
                        onClick={() => openLeadModal(`Consultor Estratégico - ${selectedSegment}`)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer sm:whitespace-nowrap"
                      >
                        Quero Implementar Esse Plano
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* --- QUALIFIED COMMERCIAL BRIEF — NOT A PRICE QUOTE --- */}
      <section id="planos" className="py-20 sm:py-24 bg-white border-t border-black/5 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <span className="text-xs text-blue-700 font-bold tracking-widest uppercase">Proposta por operação</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 tracking-tight">
              Entenda o investimento sem preços de tabela inventados
            </h2>
            <p className="text-sm text-black/65 leading-7 mt-5">
              O valor final depende do perfil, contrato, quantidade de aparelhos,
              licença das mídias, instalação e serviços contratados. A venda de
              publicidade é independente da assinatura do estabelecimento.
            </p>
            <ul className="space-y-3 text-sm text-black/65 mt-7">
              {[
                'Software e dispositivos: escopo definido em proposta.',
                'Equipamento e instalação: verificamos compatibilidade e necessidade.',
                'Músicas e criativos: direitos de uso podem exigir contratos adicionais.',
                'Publicidade: local, período, cota e valor sujeitos a inventário autorizado.',
              ].map(item=><li key={item} className="flex gap-2 items-start">
                <ShieldCheck size={18} className="text-blue-700 shrink-0 mt-0.5" aria-hidden />{item}
              </li>)}
            </ul>
          </div>
          <div className="lg:col-span-7 p-5 sm:p-8 rounded-3xl bg-[#F5F7FA] border border-black/10">
            <h3 className="font-bold text-xl">Prepare seu pedido comercial</h3>
            <p className="text-sm text-black/60 mt-2">
              Escolha sua atuação para direcionarmos a solicitação à equipe correta.
              O formulário não gera cobrança, reserva nem ativação automática.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {([
                ['establishment','Estabelecimento'],
                ['agency','Agência'],
                ['advertiser','Anunciante'],
              ] as const).map(([kind,label])=><button type="button" key={kind}
                onClick={()=>setLeadKind(kind)} aria-pressed={leadKind===kind}
                className={`rounded-xl p-4 border text-sm font-semibold text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${leadKind===kind?'border-blue-700 bg-blue-50':'border-black/10 bg-white'}`}>
                {label}
              </button>)}
            </div>
            {leadKind==='establishment' && <div className="mt-6">
              <label htmlFor="quote-screens" className="flex gap-3 justify-between items-center text-sm font-semibold">
                Quantidade estimada de pontos de TV
                <strong className="text-blue-700">{screensCount}</strong>
              </label>
              <input id="quote-screens" type="range" min={1} max={50} value={screensCount}
                onChange={event=>setScreensCount(Number(event.target.value))}
                className="w-full mt-3 accent-blue-700" />
            </div>}
            {leadKind==='agency' && <p className="text-xs text-black/65 mt-6">
              Na proposta, informe sua carteira, número de locais, tipos de Player e permissões necessárias.
            </p>}
            {leadKind==='advertiser' && <p className="text-xs text-black/65 mt-6">
              Para avaliar inventário, precisamos de cidades, período, formato TV/Rádio, criativos e objetivo da campanha.
            </p>}
            <button type="button"
              onClick={()=>openAudienceContact(leadKind,'Proposta segmentada - '+leadKind)}
              className="mt-7 rounded-full bg-blue-700 text-white min-h-11 px-6 py-3 font-bold text-sm w-full inline-flex items-center justify-center gap-2 hover:bg-blue-800">
              Solicitar proposta personalizada <ArrowRight size={18} aria-hidden/>
            </button>
            <p className="text-xs text-black/50 mt-3">
              Sem simulação de desconto ou preço não confirmado no catálogo.
            </p>
          </div>
        </div>
      </section>

      {/* --- FINAL CALL TO ACTION (BOTTOM CTA) --- */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-5xl mx-auto relative">
          
          {/* Card Body */}
          <div className="rounded-3xl bg-[#F5F5F7] border border-black/5 p-8 sm:p-14 text-center relative overflow-hidden shadow-sm">
            {/* Background blur decorative circles inside */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-550/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-550/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mx-auto flex flex-col gap-6 relative z-10">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">Seja Digital Hoje Mesmo</span>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#1D1D1F] tracking-tight leading-tight">
                Planeje sua operação de TV, Rádio ou publicidade com mais clareza
              </h2>
              <p className="text-black/60 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
                Escolha o público e descreva seus pontos de mídia, necessidades e objetivos. Nossa equipe poderá avaliar escopo, licenças, condições e investimento, sem prometer um retorno financeiro que ainda não foi medido.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-4">
                <button
                  onClick={() => openLeadModal("CTA Final")}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <PhoneCall className="w-4 h-4 text-white" />
                  Solicitar proposta personalizada
                </button>
                <a
                  href="#recursos"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-white hover:bg-black/5 text-[#1D1D1F] border border-black/10 hover:border-black/20 transition-all duration-200 flex items-center justify-center shadow-sm"
                >
                  Conhecer Mais Recursos
                </a>
              </div>

              {/* Guarantees list */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-black/50 font-mono font-semibold">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Condições contratuais sob consulta
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Suporte conforme o plano contratado
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Teste gratuito sujeito à disponibilidade e proposta
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

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
                  Atendimento 100% remoto em todo o Brasil
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


      {/* --- LEAD BOOKING MODAL (DEMONSTRATION AND SPECIALIST) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4">
            
            {/* Dark glass backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative my-4 w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white border border-black/15 rounded-3xl p-5 sm:p-8 shadow-2xl z-10"
            >
              
              {/* Corner accent glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-blue-600 block mb-1 font-bold">
                    Demonstração • Meu Comercial
                  </span>
                  <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">
                    {leadKind === 'advertiser' ? 'Solicitar proposta de publicidade' :
                      leadKind === 'agency' ? 'Conhecer planos para agência' :
                      'Agendar conversa sobre TV e Rádio'}
                  </h3>
                  <p className="text-xs text-black/60 mt-1">
                    Conte sobre sua empresa. Nossa equipe analisará a solicitação e entrará em contato.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-black/40 hover:text-[#1D1D1F] hover:bg-black/5 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center flex flex-col items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-[#1D1D1F]">Solicitação Recebida!</h4>
                  <p className="text-sm text-black/60 max-w-xs mx-auto">
                    Obrigado, <strong>{formData.nome || "parceiro"}</strong>! Seu pedido foi registrado. A equipe comercial entrará em contato pelos dados informados.
                  </p>
                  <button type="button" className="text-xs text-blue-700 underline" onClick={() => setIsModalOpen(false)}>Fechar</button>
                </motion.div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="lead-kind" className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">Como deseja usar o Meu Comercial?</label>
                    <select id="lead-kind" value={leadKind} onChange={e => setLeadKind(e.target.value as typeof leadKind)} className="w-full rounded-xl border border-black/10 bg-white p-2.5 text-xs">
                      <option value="establishment">Operar TV ou Rádio no meu estabelecimento</option>
                      <option value="agency">Gerenciar clientes como agência</option>
                      <option value="advertiser">Comprar espaços de publicidade em TV/Rádio</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">Seu Nome *</label>
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        placeholder="Nome completo"
                        className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 shadow-sm placeholder:text-black/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">Empresa *</label>
                      <input
                        type="text"
                        required
                        value={formData.empresa}
                        onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                        placeholder="Nome da sua empresa"
                        className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 shadow-sm placeholder:text-black/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">E-mail Corporativo *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="nome@empresa.com.br"
                        className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 shadow-sm placeholder:text-black/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">WhatsApp / Telefone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 shadow-sm placeholder:text-black/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {leadKind === 'establishment' && <div>
                      <label htmlFor="establishment-tvs" className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">Quantidade de TVs (estimativa)</label>
                      <select id="establishment-tvs"
                        value={formData.telas}
                        onChange={(e) => setFormData({...formData, telas: e.target.value})}
                        className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 shadow-sm"
                      >
                        <option value="1">1 Ponto de TV</option>
                        <option value="2">2 Pontos de TV</option>
                        <option value="3">3 a 5 Pontos de TV</option>
                        <option value="6">6 a 15 Pontos de TV</option>
                        <option value="16">Mais de 15 TVs</option>
                      </select>
                    </div>}
                    {leadKind === 'establishment' && <div>
                      <label htmlFor="establishment-segment" className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">Segmento do estabelecimento</label>
                      <select id="establishment-segment"
                        value={formData.segmento}
                        onChange={(e) => setFormData({...formData, segmento: e.target.value})}
                        className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 shadow-sm"
                      >
                        <option value="escritorio">🏢 Escritório Corporativo</option>
                        <option value="varejo">🛍️ Varejo / Supermercados</option>
                        <option value="academia">🏋️ Academia / Fitness</option>
                        <option value="clinica">🏥 Clínicas / Saúde</option>
                        <option value="geral">📺 Outro Segmento</option>
                      </select>
                    </div>}
                  </div>

                  <div>
                    <label htmlFor="lead-details" className="text-[10px] text-black/50 uppercase font-mono block mb-1 font-bold">
                      {leadKind === 'advertiser' ? 'Locais, período e mídia desejados' : 'Detalhes de sua operação (opcional)'}
                    </label>
                    <textarea id="lead-details"
                      value={formData.mensagem}
                      onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                      placeholder={leadKind === 'advertiser'
                        ? 'Informe cidades, período, formato TV/Rádio e público desejado.'
                        : leadKind === 'agency'
                        ? 'Informe tamanho da carteira, pontos de mídia e estrutura atual.'
                        : 'Quais aparelhos você tem e quais conteúdos quer programar?'}
                      rows={2}
                      className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 shadow-sm placeholder:text-black/30"
                    />
                  </div>

                  <input aria-hidden="true" tabIndex={-1} autoComplete="off"
                    style={{position: "absolute", left: "-10000px"}}
                    value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)}
                    name="website" />
                  <label className="flex gap-2.5 items-start text-xs text-black/70 leading-relaxed">
                    <input type="checkbox" checked={privacyConsent}
                      onChange={e => setPrivacyConsent(e.target.checked)}
                      required className="mt-0.5 accent-blue-600" />
                    <span>Autorizo o contato comercial do Meu Comercial por e-mail ou WhatsApp sobre esta solicitação. Meus dados serão utilizados para este atendimento.</span>
                  </label>
                  {formError && <div role="alert" aria-live="polite" className="rounded-lg border border-red-200 bg-red-50 text-red-800 p-3 text-xs">{formError}</div>}
                  {/* Submission buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 rounded-xl bg-black/5 hover:bg-black/10 text-black border border-black/5 text-xs font-semibold text-center cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={formSubmitting || !privacyConsent}
                      className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold text-center shadow-sm transition-all cursor-pointer"
                    >
                      {formSubmitting ? "Registrando..." : "Enviar solicitação"}
                    </button>
                  </div>

                  <span className="block text-[9px] text-center text-black/40 font-mono mt-2 font-semibold">
                    Seus dados são usados para atender ao pedido. Não realizamos contratação ou cobrança a partir deste formulário.
                  </span>

                </form>
              )}

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
