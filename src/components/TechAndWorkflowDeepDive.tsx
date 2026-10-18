import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  Receipt, 
  Camera, 
  MapPin, 
  TrendingUp, 
  Calculator, 
  MessageSquare, 
  Cpu, 
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Code2
} from 'lucide-react';

interface TechAndWorkflowDeepDiveProps {
  onSelectModule: (tab: ActiveTab) => void;
}

interface NavFeatureExplainer {
  id: ActiveTab;
  navTitle: string;
  tagline: string;
  badge: string;
  icon: any;
  color: string;
  howPeopleWork: {
    persona: string;
    scenario: string;
    dailySteps: string[];
    benefit: string;
  };
  howTechnologyWorks: {
    coreTech: string;
    architecture: string;
    flow: string[];
    privacyGuarantee: string;
  };
}

export const NAV_FEATURES: NavFeatureExplainer[] = [
  {
    id: 'dashboard',
    navTitle: 'Dashboard',
    tagline: 'Real-time 3D telemetry & business command cockpit',
    badge: '3D WebGL Engine',
    icon: LayoutDashboard,
    color: '#d97346',
    howPeopleWork: {
      persona: 'Solo founders, makers, and multi-hustle creators',
      scenario: 'Starting each workday with an instant bird’s-eye view of all modules without getting overwhelmed by complex ERP software.',
      dailySteps: [
        'Open the interactive 3D Bitcoin medallion cockpit to check active receipts and workspaces.',
        'Rotate and inspect modules to jump directly into today’s highest-priority task.',
        'Monitor local ledger storage status and verify zero external network data leaks.'
      ],
      benefit: 'Eliminates fragmented tools; provides a unified, distraction-free headquarters for the entire business.'
    },
    howTechnologyWorks: {
      coreTech: 'Three.js WebGL • Procedural Canvas Shader Textures • Vector Parallax',
      architecture: 'Hardware-accelerated 3D scene rendering realistic metallic PBR materials (metalness: 0.94, roughness: 0.26) with custom bump maps and milled edge ridges.',
      flow: [
        'Dynamically generates 1024x1024 diffuse and bump-map canvas textures containing minted "SIDE HUSTLE" geometry.',
        'Maps textures onto a thick multi-material cylinder with reeded edge UV coordinates.',
        'Binds scroll wheel, touch swipe, and pointer drags to rotational angular velocity with dampening physics.'
      ],
      privacyGuarantee: '100% Client-Side. No 3D model assets are downloaded over the network; rendered entirely in browser memory.'
    }
  },
  {
    id: 'receipts',
    navTitle: 'Receipts',
    tagline: 'On-device private ledger & Schedule C tax write-off sorter',
    badge: 'Local-First Vault',
    icon: Receipt,
    color: '#15803d',
    howPeopleWork: {
      persona: 'Freelance designers, devs, makers, and pop-up food vendors',
      scenario: 'Logging bank statements, receipts, and contractor invoices while strictly abiding by client NDAs and protecting trade secrets.',
      dailySteps: [
        'Paste raw email invoices, cash register POS receipts, or bank lines directly into the box.',
        'The parser instantly extracts vendor, date, amount, and maps it to official IRS Schedule C categories (Materials, Advertising, Contract Labor).',
        'Export clean CSV files directly to QuickBooks, TurboTax, or accountant spreadsheets.'
      ],
      benefit: 'Unlocks thousands in legitimate tax deductions with zero risk of client rates or supplier invoices leaking to cloud providers.'
    },
    howTechnologyWorks: {
      coreTech: 'On-Device Heuristic Token Engine • Local Regex Grammar • Web Storage API',
      architecture: 'Zero-cloud execution. Processes text entirely inside browser V8 JavaScript runtime without making any HTTP request.',
      flow: [
        'Raw invoice text is evaluated through local tokenizers matching currency symbols, dates, and vendor keywords.',
        'Matches against IRS Schedule C expense categories and tags tax-deductible percentages.',
        'Encodes data into local browser IndexedDB / localStorage and renders CSV and JSON backup payloads.'
      ],
      privacyGuarantee: '0 Bytes network transfer. Air-gapped safe. Works seamlessly with WiFi disabled.'
    }
  },
  {
    id: 'listings',
    navTitle: 'Listings',
    tagline: 'High-conversion marketplace copywriter & AI product photo studio',
    badge: 'Vision & Diffusion',
    icon: Camera,
    color: '#d97346',
    howPeopleWork: {
      persona: 'Etsy artisans, eBay resellers, and Shopify shop owners',
      scenario: 'Turning raw handmade items (leathercraft, candles, cutting boards, ceramics) into polished, search-ranking store listings.',
      dailySteps: [
        'Enter product materials, dimensions, and audience or upload a phone snapshot of the craft.',
        'Generate SEO-optimized product titles, algorithm search tags, and buyer psychology story copy.',
        'Render commercial-grade 1K studio lifestyle photos and flat-lays without booking expensive photographers.'
      ],
      benefit: 'Transforms an unfinished physical prototype into a live, high-converting product listing in under 2 minutes.'
    },
    howTechnologyWorks: {
      coreTech: 'Multimodal Vision Models • Diffusion Product Photo Pipeline (1K Resolution)',
      architecture: 'Dual-pipeline architecture: Language model analyzes image features to produce calibrated sales copy; Diffusion engine generates calibrated studio lighting.',
      flow: [
        'Product concept and visual snapshot analyzed for materials, texture, and aesthetic appeal.',
        'E-commerce copywriting guidelines structure titles, bullet points, story arcs, and exact search tags.',
        'Image studio generates photorealistic lifestyle staging at selected aspect ratios (1:1, 4:3, 16:9).'
      ],
      privacyGuarantee: 'Images processed directly for user review; generated assets download directly to local machine.'
    }
  },
  {
    id: 'maps-radar',
    navTitle: 'Venues',
    tagline: 'Local pop-up market, craft fair & commissary kitchen radar',
    badge: 'Maps Grounding',
    icon: MapPin,
    color: '#0284c7',
    howPeopleWork: {
      persona: 'Artisans, bakers, food makers, and weekend market pop-up sellers',
      scenario: 'Finding physical locations where high-intent foot traffic gathers to sell products face-to-face and generate immediate cash flow.',
      dailySteps: [
        'Enter a city, neighborhood, or click "Use My GPS" to scan the immediate geographic area.',
        'Filter for weekend craft bazaars, outdoor flea markets, or shared commercial kitchens.',
        'Click directly into verified Google Maps places to check vendor reviews, operating hours, and turn-by-turn navigation.'
      ],
      benefit: 'Eliminates endless manual googling; grounds your side hustle in real physical foot traffic.'
    },
    howTechnologyWorks: {
      coreTech: 'Google Maps Platform Grounding API • Geolocation API • Places Integration',
      architecture: 'Server-side proxy calls Gemini 3.8 Flash configured with the official googleMaps grounding tool and spatial coordinates.',
      flow: [
        'Client forwards city or GPS coordinates (latitude/longitude) to server proxy.',
        'Gemini model executes geographic lookup via Google Maps place index.',
        'Grounding metadata extracts verified Maps URIs, titles, and real community review snippets.'
      ],
      privacyGuarantee: 'User GPS coordinates are used exclusively for spatial radius queries and never stored permanently.'
    }
  },
  {
    id: 'search-trends',
    navTitle: 'Trends',
    tagline: 'Real-time market niche, buyer demand & platform fee scanner',
    badge: 'Search Grounding',
    icon: TrendingUp,
    color: '#059669',
    howPeopleWork: {
      persona: 'Side hustlers seeking high-margin niches before investing time & capital',
      scenario: 'Validating whether a product idea is trending, saturated, or penalized by recent marketplace fee revisions.',
      dailySteps: [
        'Search specific queries like "Etsy fee updates" or "Trending high-margin home decor".',
        'Review current market consensus, pricing benchmarks, and buyer search velocity.',
        'Inspect verified web source citations from official seller policies and active merchant discussions.'
      ],
      benefit: 'Protects against launching products in dying categories or getting blindsided by fee hikes.'
    },
    howTechnologyWorks: {
      coreTech: 'Google Search Grounding API • Live Web Retrieval • Source Verification',
      architecture: 'Gemini 3.8 Flash integrated with googleSearch tool to ground responses in fresh, current web index documents.',
      flow: [
        'Query sent to server-side search grounding endpoint.',
        'Gemini queries Google Search engine for current 2026 web pages, fee schedules, and seller forum threads.',
        'Returns structured synthesis accompanied by grounded citation URLs and page titles.'
      ],
      privacyGuarantee: 'Queries executed server-side with zero telemetry or personalized ad tracking.'
    }
  },
  {
    id: 'economics',
    navTitle: 'Economics',
    tagline: 'Unit margin, contribution pricing & break-even stress-tester',
    badge: 'Deep Reasoning',
    icon: Calculator,
    color: '#7c3aed',
    howPeopleWork: {
      persona: 'Makers pricing custom orders, client retainers, and product lines',
      scenario: 'Calculating exact profitability to avoid the #1 cause of side hustle failure: selling at an unintentional loss.',
      dailySteps: [
        'Adjust interactive sliders for Unit Cost of Goods (COGS), Retail Price, Monthly Volume, and Fixed Overhead.',
        'Instantly view real-time Contribution Margin, Break-Even Units, and Net Monthly Profit.',
        'Run deep sensitivity analysis to model fee erosion, packaging inflation, and bulk scale thresholds.'
      ],
      benefit: 'Guarantees every item sold leaves cash in your pocket after all hidden platform and booth costs.'
    },
    howTechnologyWorks: {
      coreTech: 'Multi-Variable Economic Model • Client-Side Math Engine • Deep Reasoning',
      architecture: 'Hybrid architecture combining instantaneous zero-latency client calculation with deep multi-variable reasoning for edge-case audits.',
      flow: [
        'Client-side math computes contribution margins, break-even thresholds, and tax write-off projections in real time.',
        'User triggers deep reasoning stress-test with variable elasticity, margin decay, and scale thresholds.',
        'Flash Lite micro-copy generator instantly drafts complementary viral marketing hooks in < 300ms.'
      ],
      privacyGuarantee: 'All unit figures remain in browser memory; only anonymized parameters sent for reasoning audit.'
    }
  },
  {
    id: 'chatbot',
    navTitle: 'Advisor',
    tagline: 'Multi-turn tactical growth copilot with custom persona memory',
    badge: 'Multi-Turn Copilot',
    icon: MessageSquare,
    color: '#b45309',
    howPeopleWork: {
      persona: 'Solo founders without a co-founder, business partner, or mentor',
      scenario: 'Getting ruthless, tactical advice on pricing negotiation, customer objections, and pop-up market booth layouts.',
      dailySteps: [
        'Select an advisor role: E-Commerce Growth Hacker, Pop-Up Market Vet, Rate Negotiator, or Open-Source AI Strategist.',
        'Ask real questions: "How do I quote a $3,000 freelance retainer?" or "How do I double my pop-up market sales?"',
        'Engage in multi-turn follow-ups with contextual memory of previous answers.'
      ],
      benefit: 'Gives solo entrepreneurs an experienced mentor available 24/7 with zero equity or consulting fees.'
    },
    howTechnologyWorks: {
      coreTech: 'Multi-Turn Chat Threading • System Instruction Persona Steering • Context Buffer',
      architecture: 'Express backend maintains conversation history payloads and injects specialized behavioral system instructions.',
      flow: [
        'Chat thread state maintained in React component with complete multi-turn message history.',
        'Payload transmits conversation turns alongside chosen role persona prompt.',
        'Streaming/buffered response rendered in crisp markdown with instant clipboard copy.'
      ],
      privacyGuarantee: 'Chat threads can be wiped with one click; zero conversation data is persisted on external servers.'
    }
  },
  {
    id: 'open-manifesto',
    navTitle: 'Manifesto',
    tagline: 'The open-weight AI edge: zero cloud fees, total privacy & offline autonomy',
    badge: 'Open Weights Core',
    icon: Cpu,
    color: '#059669',
    howPeopleWork: {
      persona: 'Pragmatic solopreneurs who care about margins and data sovereignty',
      scenario: 'Eliminating recurring $20–$50/month SaaS subscription bills and keeping operations running in outdoor markets without internet.',
      dailySteps: [
        'Use the ROI simulator to see exact annual dollars saved running local open models vs closed cloud APIs.',
        'Review the 4 pillars of open innovation: Data Sovereignty, Zero Marginal Cost, Offline Autonomy, and Custom Fine-Tuning.',
        'Export fine-tuning JSONL pairs to adapt open models (Gemma/Llama) to your unique craft terminology.'
      ],
      benefit: 'Guarantees the software remains permanently functional and free forever, even if cloud platforms go offline or raise prices.'
    },
    howTechnologyWorks: {
      coreTech: 'Open-Weight Inference Architecture • Fine-Tuning JSONL Export • Air-Gapped Heuristics',
      architecture: 'Decoupled architecture utilizing local open weights for private tasks and grounded APIs strictly when live internet data is required.',
      flow: [
        'Local execution engine runs directly on laptop CPU/GPU hardware with $0.00 token cost.',
        'Standardized JSONL dataset export formats user prompts and completions for LoRA fine-tuning.',
        'Comparative cost algorithm simulates API billing curves against fixed local hardware amortization.'
      ],
      privacyGuarantee: 'Absolute data sovereignty: you own the model weights, you own the code, you own your customer data.'
    }
  }
];

export const TechAndWorkflowDeepDive: React.FC<TechAndWorkflowDeepDiveProps> = ({
  onSelectModule,
}) => {
  const [activeFeatureId, setActiveFeatureId] = useState<ActiveTab>('receipts');

  const selectedFeature = NAV_FEATURES.find((f) => f.id === activeFeatureId) || NAV_FEATURES[1];
  const Icon = selectedFeature.icon;

  return (
    <section id="tech-workflow-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faeae1] text-[#9c4923] text-xs font-medium border border-[#f3cbba] mb-3">
          <Code2 className="w-3.5 h-3.5 text-[#d97346]" />
          <span>Full Architecture & Workflow Breakdown</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          How People Work & How the Technology Works
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
          Side Hustle combines local-first open innovation for 100% private financial data with grounded intelligence for real-world foot traffic and trends. Explore every navigation module below.
        </p>
      </div>

      {/* Feature Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 no-scrollbar justify-start md:justify-center">
        {NAV_FEATURES.map((feat) => {
          const FeatIcon = feat.icon;
          const isActive = feat.id === activeFeatureId;
          return (
            <button
              key={feat.id}
              onClick={() => setActiveFeatureId(feat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-stone-50 shadow-sm'
                  : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-white border border-stone-200/80'
              }`}
            >
              <FeatIcon className="w-3.5 h-3.5" style={{ color: isActive ? '#fef3c7' : feat.color }} />
              <span>{feat.navTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Main Deep-Dive Card */}
      <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: `${selectedFeature.color}15`, color: selectedFeature.color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-bold text-stone-900">{selectedFeature.navTitle}</h3>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                  {selectedFeature.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {selectedFeature.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectModule(selectedFeature.id)}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 font-semibold text-xs sm:text-sm rounded-xl transition shadow-sm flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Launch {selectedFeature.navTitle} Workspace</span>
            <ArrowRight className="w-4 h-4 text-[#d97346]" />
          </button>
        </div>

        {/* 2-Column Deep Dive: How People Work vs How Technology Works */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
          {/* Column 1: How People Work */}
          <div className="space-y-5 bg-[#fbf9f5] rounded-2xl p-6 border border-stone-200/80">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-200/80">
              <div className="w-7 h-7 rounded-lg bg-[#faeae1] flex items-center justify-center text-[#9c4923]">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-stone-900 text-sm">How People Work (User Workflow)</h4>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-stone-500 font-semibold tracking-wider block mb-1">
                Primary User Persona
              </span>
              <p className="text-xs sm:text-sm text-stone-800 font-medium">
                {selectedFeature.howPeopleWork.persona}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-stone-500 font-semibold tracking-wider block mb-1">
                Real-World Problem & Scenario
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                {selectedFeature.howPeopleWork.scenario}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-stone-500 font-semibold tracking-wider block mb-2">
                Everyday Steps
              </span>
              <ul className="space-y-2">
                {selectedFeature.howPeopleWork.dailySteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-stone-200/80">
              <span className="text-[11px] font-mono uppercase text-[#9c4923] font-semibold tracking-wider block mb-1">
                Tangible Business Payoff
              </span>
              <p className="text-xs font-medium text-stone-900 bg-white p-2.5 rounded-xl border border-stone-200">
                {selectedFeature.howPeopleWork.benefit}
              </p>
            </div>
          </div>

          {/* Column 2: How Technology Works */}
          <div className="space-y-5 bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-200/80">
              <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center text-stone-100">
                <Cpu className="w-4 h-4 text-[#d97346]" />
              </div>
              <h4 className="font-semibold text-stone-900 text-sm">How the Technology Works (Engineering)</h4>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-stone-500 font-semibold tracking-wider block mb-1">
                Core Technologies & Models
              </span>
              <p className="text-xs sm:text-sm font-mono font-bold text-stone-900">
                {selectedFeature.howTechnologyWorks.coreTech}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-stone-500 font-semibold tracking-wider block mb-1">
                System Architecture
              </span>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                {selectedFeature.howTechnologyWorks.architecture}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-stone-500 font-semibold tracking-wider block mb-2">
                Execution Pipeline Flow
              </span>
              <ol className="space-y-2">
                {selectedFeature.howTechnologyWorks.flow.map((flowStep, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                    <span className="w-4 h-4 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{flowStep}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-3 border-t border-stone-200/80">
              <span className="text-[11px] font-mono uppercase text-emerald-800 font-semibold tracking-wider block mb-1">
                Privacy & Data Sovereignty
              </span>
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{selectedFeature.howTechnologyWorks.privacyGuarantee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
