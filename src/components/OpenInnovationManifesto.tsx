import React, { useState } from 'react';
import { 
  Cpu, 
  DollarSign, 
  WifiOff, 
  FileCode, 
  CheckCircle, 
  Copy, 
  Sparkles, 
  Lock 
} from 'lucide-react';

export const OpenInnovationManifesto: React.FC = () => {
  const [tasksPerMonth, setTasksPerMonth] = useState(1500);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Cost comparison math:
  const closedMonthlyCost = tasksPerMonth * 0.025;
  const closedAnnualCost = closedMonthlyCost * 12;
  const annualSavings = closedAnnualCost;

  const showcasePostContent = `### Why Open Innovation Matters for Side Hustle OS

1. Data Sovereignty & NDA Protection ($0 Client Leaks):
Freelancers and solo makers deal with sensitive customer invoices, bank transaction histories, and proprietary client NDAs. In Side Hustle OS, expense parsing runs 100% on the user's laptop. Zero bytes of confidential financial data ever touch an external cloud server.

2. Zero Marginal Cost = 95%+ Gross Margins:
Proprietary cloud APIs charge per-token, penalizing solo entrepreneurs as they scale. At 1,500 tasks/month, closed APIs cost ~$450/year. With open-weight models, the recurring inference cost is literally $0.00.

3. Offline-First at Rural Pop-Up Markets:
Artisan vendors sell in outdoor tents, rural farmers markets, and flea markets with zero cellular reception. Open-source local inference continues parsing receipts, categorizing inventory, and calculating margins completely offline.

4. Fine-Tuning on Niche Catalogs:
Unlike closed black-box models, open-weight models can be adapted on custom datasets. Side Hustle OS exports clean JSONL pairs so makers can fine-tune Gemma or Llama on their unique craft and trade terminology.`;

  const copyPitch = () => {
    navigator.clipboard.writeText(showcasePostContent);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-stone-50 flex items-center justify-center shrink-0 shadow-sm">
              <Cpu className="w-6 h-6 text-[#d97346]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-stone-900 tracking-tight">
                  The Open-Source Advantage for Independent Makers
                </h2>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#faeae1] text-[#9c4923] font-medium border border-[#f3cbba]">
                  Open Weights Core
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Why build on open-source AI? Because it delivers three essential guarantees: <strong>uncompromising privacy</strong>, <strong>zero recurring cloud token fees</strong>, and <strong>100% offline autonomy</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={copyPitch}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium text-xs rounded-xl transition shadow-sm flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer"
          >
            {copiedPitch ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedPitch ? 'Copied Post Summary!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Cost Calculator */}
      <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/80">
          <div>
            <h3 className="font-semibold text-stone-900 text-base flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#d97346]" />
              ROI & Operating Cost Calculator
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Simulate monthly savings of on-device open models vs per-token API subscriptions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Monthly Operations:</span>
            <span className="text-sm font-mono font-semibold text-stone-900 px-2.5 py-0.5 bg-stone-100 rounded-lg border border-stone-200">
              {tasksPerMonth.toLocaleString()} tasks
            </span>
          </div>
        </div>

        <div className="py-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs text-stone-500 mb-2">
              <span>Low Volume (100 receipts & listings)</span>
              <span>High Volume (10,000 tasks/mo)</span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={tasksPerMonth}
              onChange={(e) => setTasksPerMonth(Number(e.target.value))}
              className="w-full accent-[#d97346] cursor-pointer"
            />
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <span className="text-xs font-medium text-stone-600">Closed Cloud API Model</span>
              <div className="text-2xl font-bold font-mono text-stone-800 mt-1">
                ${closedMonthlyCost.toFixed(2)} / mo
              </div>
              <span className="text-[11px] text-stone-500 block mt-1">
                ${closedAnnualCost.toFixed(0)} billed every year in token API costs
              </span>
              <p className="text-[10px] text-rose-700 mt-2">
                ⚠️ Client receipts & contracts transmitted to third-party servers.
              </p>
            </div>

            <div className="bg-white border-2 border-[#d97346]/40 rounded-xl p-4 relative overflow-hidden shadow-sm">
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#faeae1] text-[#9c4923] text-[9px] font-mono font-bold">
                LOCAL-FIRST
              </div>
              <span className="text-xs font-medium text-[#9c4923]">Open-Weight Architecture</span>
              <div className="text-2xl font-bold font-mono text-stone-900 mt-1">
                $0.00 / mo
              </div>
              <span className="text-[11px] text-stone-500 block mt-1">
                Zero marginal cost • Free unlimited runs on your hardware
              </span>
              <p className="text-[10px] text-emerald-700 mt-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Air-gapped on laptop. Zero network tracking.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <span className="text-xs font-medium text-stone-700">Annual Cash Kept in Pocket</span>
              <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
                +${annualSavings.toFixed(0)} / yr
              </div>
              <span className="text-[11px] text-stone-500 block mt-1">
                Direct gross margin expansion for solo entrepreneurs
              </span>
              <p className="text-[10px] text-stone-500 mt-2">
                💡 Reinvest into tools, booth fees, or higher quality raw materials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Open Innovation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#faeae1] border border-[#f3cbba] flex items-center justify-center text-[#9c4923]">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">1. Uncompromising Data Privacy</h4>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Freelance developers and designers sign binding NDAs. Bookkeepers handle client bank transactions. By executing expense extraction locally with open-weight models, customer financial files <strong>never leave the laptop</strong>. There is zero risk of data exposure or AI model re-training on private documents.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#faeae1] border border-[#f3cbba] flex items-center justify-center text-[#9c4923]">
              <WifiOff className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">2. 100% Offline at Pop-Up Markets</h4>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Artisans sell at weekend farmers markets, holiday bazaars, and craft fairs where mobile cellular data is overloaded or non-existent. A closed AI app fails immediately without an active internet connection. Open models run directly on hardware, ensuring your catalog, price calculator, and inventory sorter work seamlessly off-grid.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#faeae1] border border-[#f3cbba] flex items-center justify-center text-[#9c4923]">
              <FileCode className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">3. Local Fine-Tuning & Custom Vocabularies</h4>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Generic models fail on niche domains: specialized woodworking joints, bespoke leather tannery grades, or regional restaurant menus. Open innovation lets you export training datasets (JSONL) and fine-tune open weights so the model speaks your exact craft terminology better than any generic tool.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#faeae1] border border-[#f3cbba] flex items-center justify-center text-[#9c4923]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">4. Thoughtful Hybrid Architecture</h4>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Side Hustle OS pairs an on-device open-weight vault for private financial data with grounded intelligence when external real-world information like live marketplace trends or venue addresses are needed.
          </p>
        </div>
      </div>

      {/* Showcase Summary Text Preview Box */}
      <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d97346]" />
            <h4 className="font-semibold text-stone-900 text-xs sm:text-sm">
              Open Innovation Overview
            </h4>
          </div>
          <button
            onClick={copyPitch}
            className="text-xs text-[#9c4923] hover:text-[#783617] flex items-center gap-1 font-medium cursor-pointer"
          >
            {copiedPitch ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPitch ? 'Copied' : 'Copy All Text'}</span>
          </button>
        </div>

        <pre className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
          {showcasePostContent}
        </pre>
      </div>
    </div>
  );
};
