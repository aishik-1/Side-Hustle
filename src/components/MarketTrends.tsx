import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  ExternalLink, 
  Globe, 
  RefreshCw, 
  PieChart,
  Copy,
  Check,
  Sparkles,
  BarChart3,
  ShoppingBag,
  Newspaper,
  Compass,
  ArrowUpRight,
  ShieldAlert,
  Layers,
  ChevronRight
} from 'lucide-react';
import { GroundingSource, GoogleTrendsResponse } from '../types';

export const MarketTrends: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('Trending handmade products with high profit margins and low competition');
  const [isLoading, setIsLoading] = useState(false);
  const [reportText, setReportText] = useState<string | null>(null);
  const [webSources, setWebSources] = useState<GroundingSource[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [analyzedQuery, setAnalyzedQuery] = useState<string>('Trending handmade products');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedLinkIndex, setCopiedLinkIndex] = useState<number | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Google' | 'Marketplaces' | 'Articles'>('All');

  const fetchTrends = async (queryToSearch?: string) => {
    const q = (queryToSearch || searchQuery).trim();
    if (!q) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/gemini/search-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      const data: GoogleTrendsResponse = await res.json();
      if (data.text) {
        setReportText(data.text);
        setWebSources(data.webSources || []);
        setSearchQueries(data.searchQueries || [q, `${q} market trends 2026`, `${q} pricing benchmarks`]);
        setAnalyzedQuery(data.queryAnalyzed || q);
      } else {
        setErrorMessage((data as any).error || 'Failed to retrieve market trends.');
      }
    } catch (err: any) {
      setErrorMessage('Search grounding error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount to immediately show rich Google data
    fetchTrends(searchQuery);
  }, []);

  const handlePresetSelect = (q: string) => {
    setSearchQuery(q);
    fetchTrends(q);
  };

  const handleCopyReport = () => {
    if (!reportText) return;
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleCopyLink = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkIndex(index);
    setTimeout(() => setCopiedLinkIndex(null), 2000);
  };

  // Filter sources
  const filteredSources = webSources.filter((s) => {
    if (activeCategoryFilter === 'All') return true;
    const dom = (s.domain || '').toLowerCase();
    if (activeCategoryFilter === 'Google') return dom.includes('google');
    if (activeCategoryFilter === 'Marketplaces') return dom.includes('etsy') || dom.includes('shopify') || dom.includes('amazon') || dom.includes('ebay');
    if (activeCategoryFilter === 'Articles') return !dom.includes('google') && !dom.includes('etsy') && !dom.includes('shopify');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center shrink-0 shadow-sm">
              <TrendingUp className="w-5 h-5 text-[#f49342]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-stone-900">Google Search & Market Trends Engine</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#faeae1] text-[#9c4923] font-semibold border border-[#f3cbba] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d97346] animate-pulse" />
                  Live Google Search Grounding
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium border border-stone-200">
                  gemini-3.8-flash (googleSearch)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Ground any side hustle question with real-time Google Search results, Google Trends query momentum, competitor pricing benchmarks, and verified web citations.
              </p>
            </div>
          </div>

          {/* Quick Ecosystem Hub Links */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <a
              href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(analyzedQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-medium rounded-xl border border-stone-200 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Open Google Trends Chart in a new tab"
            >
              <BarChart3 className="w-3.5 h-3.5 text-stone-600" />
              <span>Google Trends</span>
              <ArrowUpRight className="w-3 h-3 text-stone-400" />
            </a>

            <a
              href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(analyzedQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-medium rounded-xl border border-stone-200 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Compare live product pricing on Google Shopping"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />
              <span>Google Shopping</span>
              <ArrowUpRight className="w-3 h-3 text-stone-400" />
            </a>

            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(analyzedQuery + ' market trends pricing')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Search Google Live for raw query results"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Google Live</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Google Search Queries Executed Indicator */}
        {searchQueries.length > 0 && (
          <div className="mt-4 pt-3 border-t border-stone-200/80">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
                <Globe className="w-3.5 h-3.5 text-[#d97346]" />
                Google Data Queries:
              </span>
              {searchQueries.map((q, idx) => (
                <a
                  key={idx}
                  href={`https://www.google.com/search?q=${encodeURIComponent(q)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100/90 hover:bg-stone-200 text-stone-800 border border-stone-200/90 font-mono flex items-center gap-1 transition"
                  title="View this search query directly on Google"
                >
                  <span>"{q}"</span>
                  <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Query Bar */}
      <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything: trending products, local pop-up margins, Etsy fee changes, niche demand..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 font-sans transition"
              onKeyDown={(e) => e.key === 'Enter' && fetchTrends()}
            />
          </div>

          <button
            onClick={() => fetchTrends()}
            disabled={isLoading || !searchQuery.trim()}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-50 font-semibold text-xs sm:text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Querying Google Search...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Google Trends
              </>
            )}
          </button>
        </div>

        {/* Quick Topic Chips covering any side-hustle inquiry */}
        <div className="space-y-2 pt-2 border-t border-stone-200/80">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-[11px] text-stone-600">Popular Grounded Inquiries:</span>
            <span className="text-[10px] text-stone-400">Click any prompt to run instant search</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => handlePresetSelect('What are the highest margin handmade craft products selling in 2026?')}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 shrink-0 transition cursor-pointer text-[11px] font-medium"
            >
              🪵 High-Margin Crafts
            </button>
            <button
              onClick={() => handlePresetSelect('Current Etsy fee breakdown, transaction cut, and offsite ads policies in 2026')}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 shrink-0 transition cursor-pointer text-[11px] font-medium"
            >
              🏷️ Etsy Fee Structure
            </button>
            <button
              onClick={() => handlePresetSelect('Trending food pop-ups and cottage bakery items with high markups')}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 shrink-0 transition cursor-pointer text-[11px] font-medium"
            >
              🥐 Food & Bakery Pop-ups
            </button>
            <button
              onClick={() => handlePresetSelect('Average price and cost breakdown for custom laser engraved gifts and cutting boards')}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 shrink-0 transition cursor-pointer text-[11px] font-medium"
            >
              ⚡ Laser Engraving Pricing
            </button>
            <button
              onClick={() => handlePresetSelect('Trending handmade products with high viral demand on TikTok Shop')}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 shrink-0 transition cursor-pointer text-[11px] font-medium"
            >
              📱 TikTok Shop Viral Hits
            </button>
            <button
              onClick={() => handlePresetSelect('Top micro-consulting retainers and UI audit services for solo freelancers')}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 shrink-0 transition cursor-pointer text-[11px] font-medium"
            >
              💼 Freelance Retainers
            </button>
            <button
              onClick={() => handlePresetSelect('Handmade soy and beeswax candle startup costs, pricing, and profit margins')}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 shrink-0 transition cursor-pointer text-[11px] font-medium"
            >
              🕯️ Artisan Candle Margins
            </button>
            <button
              onClick={() => handlePresetSelect('Vintage clothing flipping and curated thrift resell price benchmarks')}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 shrink-0 transition cursor-pointer text-[11px] font-medium"
            >
              👗 Vintage Resell Margins
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grounded Report Text */}
        <div className="lg:col-span-8 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 mb-4 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#d97346]" />
                <h3 className="font-semibold text-stone-900 text-sm">
                  Google Search Grounded Intelligence Report
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200">
                  Topic: "{analyzedQuery.slice(0, 32)}{analyzedQuery.length > 32 ? '...' : ''}"
                </span>
                {reportText && (
                  <button
                    onClick={handleCopyReport}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-medium rounded-lg border border-stone-200 flex items-center gap-1 transition cursor-pointer"
                    title="Copy full report to clipboard"
                  >
                    {copiedReport ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-10 h-10 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-stone-900">Synthesizing Real-Time Google Data...</p>
                  <p className="text-xs text-stone-500 max-w-sm">
                    Scanning Google Search trends, recent price benchmarks, competitor channels, and verified web citations.
                  </p>
                </div>
              </div>
            ) : reportText ? (
              <div className="text-stone-800 whitespace-pre-wrap leading-relaxed font-sans overflow-y-auto max-h-[620px] pr-2 text-xs sm:text-sm selection:bg-[#faeae1]">
                {reportText}
              </div>
            ) : (
              <div className="py-24 text-center text-stone-400 space-y-3">
                <Search className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-sm font-semibold text-stone-700">Ready to Query Google Data</p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Type any side hustle inquiry above or click a prompt chip to generate a comprehensive Google Search market report.
                </p>
              </div>
            )}
          </div>

          {/* Quick Footer Action Bar */}
          {reportText && (
            <div className="mt-6 pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-stone-500">
                Data refreshed via <strong>Google Search Grounding</strong> • Validated for solo entrepreneurs
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(analyzedQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#9c4923] hover:underline flex items-center gap-1"
                >
                  <span>Explore Google Trends chart</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Web Grounding Sources & Verified Google Citations */}
        <div className="lg:col-span-4 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-stone-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#d97346]" />
                Google Verified Citations ({webSources.length})
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Web sources retrieved via Google Search grounding
              </p>
            </div>
          </div>

          {/* Source Category Filter */}
          {webSources.length > 0 && (
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-[11px]">
              {(['All', 'Google', 'Marketplaces', 'Articles'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveCategoryFilter(filter)}
                  className={`flex-1 py-1 rounded-lg font-medium transition cursor-pointer text-center ${
                    activeCategoryFilter === filter
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}

          {webSources.length === 0 ? (
            <div className="py-16 text-center text-stone-400 text-xs space-y-2">
              <Globe className="w-8 h-8 mx-auto text-stone-300" />
              <p>Live Google web citations will populate here after query execution.</p>
            </div>
          ) : (
            <div className="space-y-2.5 overflow-y-auto max-h-[580px] pr-1">
              {filteredSources.map((src, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/80 hover:border-stone-400 transition block group text-xs shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-stone-900 group-hover:text-[#9c4923] transition line-clamp-2">
                      {src.title}
                    </span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-stone-200/60 rounded text-stone-400 hover:text-stone-900 transition shrink-0"
                      title="Open source in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-stone-200/60 text-[10px]">
                    <span className="font-mono text-stone-500 bg-stone-200/60 px-1.5 py-0.5 rounded">
                      {src.domain || 'web'}
                    </span>

                    <button
                      onClick={() => handleCopyLink(src.url, i)}
                      className="text-stone-500 hover:text-stone-900 flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedLinkIndex === i ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>Copy link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
