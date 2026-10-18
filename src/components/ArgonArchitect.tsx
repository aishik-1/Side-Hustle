import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Zap, 
  Sliders, 
  CheckCircle,
  Copy
} from 'lucide-react';

export const ArgonArchitect: React.FC = () => {
  // Financial inputs
  const [productName, setProductName] = useState('Handcrafted Walnut Cutting Board');
  const [unitCost, setUnitCost] = useState(24);
  const [retailPrice, setRetailPrice] = useState(88);
  const [monthlyVolume, setMonthlyVolume] = useState(45);
  const [fixedOverhead, setFixedOverhead] = useState(220); // tools, booth, software
  const [platform, setPlatform] = useState('Etsy & Local Pop-Up Markets');

  // Stress Test State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Micro-copy State
  const [flashTaskType, setFlashTaskType] = useState('Viral TikTok Hooks');
  const [flashInput, setFlashInput] = useState('Hand-carved walnut cutting board that lasts 50 years');
  const [isFlashLoading, setIsFlashLoading] = useState(false);
  const [flashResult, setFlashResult] = useState<string | null>(null);
  const [flashCopied, setFlashCopied] = useState(false);

  // Local instant unit calculations
  const unitContribution = Math.max(0, retailPrice - unitCost);
  const grossMarginPercent = retailPrice > 0 ? (unitContribution / retailPrice) * 100 : 0;
  const grossMonthlyRevenue = retailPrice * monthlyVolume;
  const totalVariableCost = unitCost * monthlyVolume;
  const netMonthlyProfit = grossMonthlyRevenue - totalVariableCost - fixedOverhead;
  const breakEvenUnits = unitContribution > 0 ? Math.ceil(fixedOverhead / unitContribution) : 0;

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/gemini/complex-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: productName,
          unitCost,
          retailPrice,
          monthlyVolume,
          fixedCosts: fixedOverhead,
          platform,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        setAnalysisError(data.error || 'Failed to complete financial analysis.');
      }
    } catch (err: any) {
      setAnalysisError('Error: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runFlashTask = async () => {
    setIsFlashLoading(true);
    setFlashResult(null);
    try {
      const res = await fetch('/api/gemini/fast-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: flashTaskType,
          input: flashInput,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setFlashResult(data.result);
      } else {
        setFlashResult(data.error || 'Micro-task failed.');
      }
    } catch (err: any) {
      setFlashResult('Error: ' + err.message);
    } finally {
      setIsFlashLoading(false);
    }
  };

  const copyFlash = () => {
    if (!flashResult) return;
    navigator.clipboard.writeText(flashResult);
    setFlashCopied(true);
    setTimeout(() => setFlashCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center shrink-0 shadow-sm">
              <Calculator className="w-5 h-5 text-[#d97346]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-stone-900">Unit Economics & Margin Stress-Test</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#faeae1] text-[#9c4923] font-medium border border-[#f3cbba]">
                  Financial Model
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Protect your profit margins against platform fees, packaging costs, and variable overhead. Simulate scale scenarios before committing cash.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Financial Dashboard Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-stone-500 block">Unit Gross Margin</span>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
            ${unitContribution.toFixed(2)}
          </div>
          <span className="text-[10px] text-stone-400">{grossMarginPercent.toFixed(1)}% margin</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-stone-500 block">Break-Even Point</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            {breakEvenUnits} units/mo
          </div>
          <span className="text-[10px] text-stone-400">${(breakEvenUnits * retailPrice).toFixed(0)} to cover overhead</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-stone-500 block">Est. Monthly Revenue</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            ${grossMonthlyRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-400">at {monthlyVolume} units</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-stone-500 block">Net Monthly Take-Home</span>
          <div className={`text-xl font-bold font-mono mt-1 ${netMonthlyProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            ${netMonthlyProfit.toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-400">before income taxes</span>
        </div>
      </div>

      {/* Main Grid: Calculator & Stress-Test */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#d97346]" />
              Side Hustle Parameter Inputs
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Tune your production numbers to simulate profitability scenarios.
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="text-stone-700 font-medium block mb-1">Product or Service Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-700 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-700 font-medium block mb-1">Unit COGS ($)</label>
                <input
                  type="number"
                  value={unitCost}
                  onChange={(e) => setUnitCost(Number(e.target.value) || 0)}
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-700 transition"
                  title="Raw materials + packaging + direct labor per unit"
                />
              </div>

              <div>
                <label className="text-stone-700 font-medium block mb-1">Target Retail Price ($)</label>
                <input
                  type="number"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(Number(e.target.value) || 0)}
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-700 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-700 font-medium block mb-1">Estimated Monthly Units</label>
                <input
                  type="number"
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(Number(e.target.value) || 0)}
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-700 transition"
                />
              </div>

              <div>
                <label className="text-stone-700 font-medium block mb-1">Monthly Fixed Overhead ($)</label>
                <input
                  type="number"
                  value={fixedOverhead}
                  onChange={(e) => setFixedOverhead(Number(e.target.value) || 0)}
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-700 transition"
                  title="Software, booth rental, tool subscriptions"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-700 font-medium block mb-1">Sales Channels</label>
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-700 transition"
                placeholder="e.g. Etsy, local weekend pop-ups, Shopify"
              />
            </div>
          </div>

          <button
            onClick={runAnalysis}
            disabled={isAnalyzing || !productName.trim()}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-50 font-semibold text-xs sm:text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-[#d97346]" />
                Auditing Financial Model...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#d97346]" />
                Run Financial Stress-Test
              </>
            )}
          </button>

          {/* Micro-tasks Section */}
          <div className="pt-4 border-t border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-900 text-xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#d97346]" />
                Instant Marketing Copy Hooks
              </span>
              <span className="text-[10px] text-stone-500 font-mono">Fast</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Viral TikTok Hooks', 'SEO High-Traffic Tags', 'Email Cart Recovery', 'Wholesale Pitch Hook'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFlashTaskType(t)}
                  className={`p-1.5 rounded-lg border text-left truncate transition cursor-pointer ${
                    flashTaskType === t
                      ? 'bg-stone-900 border-stone-900 text-white font-medium'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={flashInput}
                onChange={(e) => setFlashInput(e.target.value)}
                placeholder="Product or concept hook..."
                className="flex-1 bg-stone-50/70 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-stone-700"
              />
              <button
                onClick={runFlashTask}
                disabled={isFlashLoading || !flashInput.trim()}
                className="px-3 py-1.5 bg-[#d97346] hover:bg-[#c26538] text-white font-semibold text-xs rounded-xl transition shrink-0 cursor-pointer"
              >
                {isFlashLoading ? 'Generating...' : 'Run Fast'}
              </button>
            </div>

            {flashResult && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 relative group">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-stone-200">
                  <span className="text-[10px] text-stone-500 font-medium">{flashTaskType}</span>
                  <button
                    onClick={copyFlash}
                    className="text-[10px] text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                  >
                    {flashCopied ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{flashCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="whitespace-pre-wrap font-sans text-xs">{flashResult}</div>
              </div>
            )}
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 mb-4">
              <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#d97346]" />
                Strategic Audit & 90-Day Roadmap
              </h3>
              <span className="text-xs text-stone-400">Deep Reasoning</span>
            </div>

            {analysisError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {analysisError}
              </div>
            )}

            {isAnalyzing ? (
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-stone-800">Running multi-variable economic model...</p>
                <p className="text-xs text-stone-500 max-w-sm">
                  Simulating margin erosion, platform transaction cuts, and volume break-even points.
                </p>
              </div>
            ) : analysisResult ? (
              <div className="text-stone-800 whitespace-pre-wrap leading-relaxed font-sans overflow-y-auto max-h-[550px] pr-2 text-xs sm:text-sm">
                {analysisResult}
              </div>
            ) : (
              <div className="py-24 text-center text-stone-400 space-y-2">
                <Calculator className="w-9 h-9 mx-auto text-stone-300" />
                <p className="text-sm font-medium text-stone-600">Financial Stress-Test Ready</p>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Adjust unit costs and volume on the left, then click to rigorously audit your numbers.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/80 text-xs text-stone-400 flex items-center justify-between">
            <span>Dynamic Sensitivity Simulation</span>
            <span>Local Economics Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
