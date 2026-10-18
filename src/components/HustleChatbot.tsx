import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Trash2,
  Globe,
  ExternalLink,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Flame,
  Calculator,
  Compass,
  Store,
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';
import { ChatMessage, GroundingSource } from '../types';

// Lightweight Markdown Formatter for pristine chat presentation
const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-2 space-y-1.5 list-disc pl-5 text-stone-800">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {formatInlineText(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`ol-${elements.length}`} className="my-2 space-y-1.5 list-decimal pl-5 text-stone-800">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {formatInlineText(item)}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  const formatInlineText = (line: string): React.ReactNode => {
    // Process bold, inline code, and links
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Inline code `...`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        parts.push(
          <code key={`code-${keyIdx++}`} className="px-1.5 py-0.5 mx-0.5 rounded bg-stone-100 text-stone-900 border border-stone-200 font-mono text-[11px]">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Bold **...**
      const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
      if (boldMatch) {
        parts.push(
          <strong key={`bold-${keyIdx++}`} className="font-semibold text-stone-900">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic *...*
      const italicMatch = remaining.match(/^\*([^*]+)\*/);
      if (italicMatch) {
        parts.push(
          <em key={`italic-${keyIdx++}`} className="italic text-stone-800">
            {italicMatch[1]}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Standard character chunk until next token
      const nextTokenIndex = remaining.search(/[`*]/);
      if (nextTokenIndex === -1) {
        parts.push(remaining);
        break;
      } else if (nextTokenIndex === 0) {
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        parts.push(remaining.slice(0, nextTokenIndex));
        remaining = remaining.slice(nextTokenIndex);
      }
    }

    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Code block fences
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushList();
        elements.push(
          <div key={`codeblock-${elements.length}`} className="my-3 bg-stone-900 text-stone-100 rounded-xl p-3 text-xs font-mono overflow-x-auto border border-stone-800 shadow-inner">
            <pre className="whitespace-pre">{codeBuffer.join('\n')}</pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Headers
    if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(
        <h5 key={`h4-${elements.length}`} className="font-semibold text-stone-900 text-xs sm:text-sm mt-3 mb-1 tracking-tight">
          {formatInlineText(trimmed.slice(5))}
        </h5>
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h3-${elements.length}`} className="font-bold text-stone-950 text-sm sm:text-base mt-3.5 mb-1.5 flex items-center gap-1.5 text-[#a84d24]">
          {formatInlineText(trimmed.slice(4))}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h3 key={`h2-${elements.length}`} className="font-bold text-stone-950 text-base sm:text-lg mt-4 mb-2">
          {formatInlineText(trimmed.replace(/^#+\s*/, ''))}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`quote-${elements.length}`} className="my-2 pl-3 border-l-2 border-[#d97346] italic text-stone-700 bg-[#faeae1]/40 py-1 rounded-r-lg text-xs sm:text-sm">
          {formatInlineText(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Bullet points
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const itemContent = trimmed.slice(2).trim();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      continue;
    }

    // Numbered lists
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      const itemContent = numMatch[2].trim();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      continue;
    }

    // Standard paragraph or empty line
    flushList();
    if (trimmed.length === 0) {
      elements.push(<div key={`space-${elements.length}`} className="h-2" />);
    } else {
      elements.push(
        <p key={`p-${elements.length}`} className="my-1 leading-relaxed text-stone-800 text-xs sm:text-sm">
          {formatInlineText(rawLine)}
        </p>
      );
    }
  }

  flushList();

  return <div className="space-y-1">{elements}</div>;
};

export const HustleChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      role: 'model',
      text: `### 👋 Welcome to Gemini AI Advisor

Ask me **anything** about your side hustle, products, or financial growth. I am powered directly by **Google Gemini 3.8 Flash** with live Google Search Grounding to provide real-time web intelligence.

**What you can ask:**
- 📈 **Market Trends & Pricing:** *"What are high-margin craft products trending on Google right now?"*
- 💰 **Profit Margins:** *"How do I price a custom order to guarantee a 70% gross margin?"*
- 🎪 **Pop-Up & Local Sales:** *"What are the best weekend markets and booth display tips?"*
- 💼 **Taxes & Deductions:** *"What IRS Schedule C expenses can I legally claim?"*
- ✍️ **Marketing Copy:** *"Write a high-converting 3-part Instagram Reel script for my shop."*
- 🔍 **General Questions:** Ask literally anything — data, calculations, step-by-step strategies, or coding!`,
      timestamp: Date.now(),
      modelUsed: 'Gemini 3.8 Flash',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('Pragmatic Side-Hustle Strategist');
  const [enableSearchGrounding, setEnableSearchGrounding] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsTyping(true);

    try {
      const messagesPayload = newHistory.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          persona: selectedPersona,
          enableSearch: enableSearchGrounding,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'm-' + Date.now(),
        role: 'model',
        text: data.reply || 'Here is your strategic analysis from Gemini AI.',
        timestamp: Date.now(),
        modelUsed: data.model || 'Gemini 3.8 Flash',
        sources: data.webSources || [],
        searchQueries: data.searchQueries || [],
        isFallback: data.isFallback || false,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'model',
        text: `### 💡 Quick Strategic Note
I encountered a temporary connection glitch. You can retry your question right now, or ask about another facet of your business (pricing formula, product margin, or pop-up pitch)!`,
        timestamp: Date.now(),
        modelUsed: 'Advisor Fallback',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'm-init-new',
        role: 'model',
        text: `### ✨ Conversation Reset
What question or topic shall we explore next? Ask anything!`,
        timestamp: Date.now(),
        modelUsed: 'Gemini 3.8 Flash',
      },
    ]);
  };

  const quickPrompts = [
    {
      label: 'Pricing & Margins Formula',
      query: 'How do I price a custom order to guarantee a 70% gross profit margin? Provide the mathematical formula and an example.',
      icon: Calculator,
    },
    {
      label: 'Trending Crafts on Google',
      query: 'What are the highest demand handmade and artisan craft products on Google Search right now?',
      icon: Flame,
    },
    {
      label: 'Weekend Pop-Up Playbook',
      query: 'Give me 5 actionable tactics to double my sales at a weekend artisan market booth.',
      icon: Store,
    },
    {
      label: 'Schedule C Tax Write-Offs',
      query: 'What business expenses can I legally deduct on IRS Schedule C as a solo side hustler?',
      icon: FileSpreadsheet,
    },
    {
      label: 'Wholesale Boutiques Pitch',
      query: 'How should I pitch local retail boutique owners to carry my handcrafted goods on consignment or wholesale?',
      icon: DollarSign,
    },
    {
      label: '30-Day Launch Roadmap',
      query: 'Create a realistic 30-day week-by-week roadmap to take a side hustle from $0 to $1,500/month.',
      icon: Compass,
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[760px]">
      {/* Top Header */}
      <div className="p-4 border-b border-stone-200/80 bg-[#fdfbf9] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-stone-50 flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-[#d97346]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-stone-900 text-sm sm:text-base">Gemini AI Advisor</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#faeae1] text-[#9c4923] border border-[#f3cbba] flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Ask anything • Instant strategic answers with real-time Google data
            </p>
          </div>
        </div>

        {/* Advisor Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Google Search Grounding Toggle */}
          <button
            onClick={() => setEnableSearchGrounding(!enableSearchGrounding)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
              enableSearchGrounding
                ? 'bg-[#faeae1] text-[#8e3c18] border-[#f1bfa9]'
                : 'bg-stone-100 text-stone-500 border-stone-200 hover:text-stone-700'
            }`}
            title="Toggle live Google Search Grounding for current web facts"
          >
            <Globe className="w-3.5 h-3.5 text-[#d97346]" />
            <span>Google Grounding</span>
            <span className={`w-2 h-2 rounded-full ${enableSearchGrounding ? 'bg-emerald-500' : 'bg-stone-300'}`} />
          </button>

          {/* Persona Select */}
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="text-stone-400 text-[11px]">Persona:</span>
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="bg-transparent text-stone-900 font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="Pragmatic Side-Hustle Strategist">Pragmatic Strategist</option>
              <option value="Ruthless E-Commerce & Growth Hacker">E-Commerce Growth Hacker</option>
              <option value="Local Pop-Up & Artisan Market Vet">Local Pop-Up & Market Vet</option>
              <option value="CFO & Financial Formula Auditor">Financial & Margin Auditor</option>
              <option value="Top 1% Viral Social Copywriter">Viral Copywriter</option>
              <option value="Tech & Automation Architect">Tech & Automation Architect</option>
            </select>
          </div>

          {/* Reset / Clear */}
          <button
            onClick={clearChat}
            className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition cursor-pointer border border-stone-200/80 bg-white"
            title="Reset Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#faf8f5]/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-stone-900 text-stone-50 shadow-sm'
                    : 'bg-white text-stone-800 border border-stone-200 shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-[#d97346]" />}
              </div>

              {/* Chat Bubble */}
              <div
                className={`group relative rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed transition shadow-sm ${
                  isUser
                    ? 'bg-[#faeae1] text-stone-950 rounded-tr-none border border-[#f3cbba] max-w-xl'
                    : 'bg-white border border-stone-200/90 text-stone-900 rounded-tl-none w-full'
                }`}
              >
                {/* Model badge info */}
                {!isUser && (
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
                        {msg.modelUsed || 'Gemini 3.8 Flash'}
                      </span>
                      {msg.isFallback && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Offline Knowledge Shield
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1 rounded-md bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-400 hover:text-stone-900 transition cursor-pointer flex items-center gap-1 text-[11px]"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Formatted Message Body */}
                <FormattedMessage text={msg.text} />

                {/* Grounding Search Queries (if Google Search used) */}
                {msg.searchQueries && msg.searchQueries.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-mono mb-1.5">
                      <Search className="w-3 h-3 text-[#d97346]" />
                      <span>Google Queries Dispatched:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.searchQueries.map((q, idx) => (
                        <a
                          key={idx}
                          href={`https://www.google.com/search?q=${encodeURIComponent(q)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-[10px] transition"
                        >
                          <span>"{q}"</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grounding Web Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-mono mb-1.5">
                      <Globe className="w-3 h-3 text-blue-600" />
                      <span>Grounded Google Sources:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {msg.sources.slice(0, 4).map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-[11px] group/src transition"
                        >
                          <span className="truncate font-medium">{source.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 ml-1.5 text-stone-400 group-hover/src:text-stone-900" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-xl mr-auto animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#d97346] shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#d97346] animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-[#d97346] animate-pulse delay-150" />
              <div className="w-2 h-2 rounded-full bg-[#d97346] animate-pulse delay-300" />
              <span className="text-xs font-mono text-stone-500">Gemini 3.8 Flash is analyzing data & formulating reply...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Starter Prompts Strip */}
      <div className="px-3 sm:px-4 py-2 border-t border-stone-200/80 bg-white flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
        <span className="text-stone-400 font-mono text-[10px] shrink-0 uppercase tracking-wider">
          Suggested:
        </span>
        {quickPrompts.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query)}
              disabled={isTyping}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fdfbf9] hover:bg-[#faeae1] border border-stone-200 hover:border-[#f3cbba] text-stone-700 hover:text-stone-950 whitespace-nowrap transition cursor-pointer text-xs shrink-0"
            >
              <Icon className="w-3 h-3 text-[#d97346]" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 border-t border-stone-200/80 bg-white flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything from Gemini AI: pricing formulas, marketing scripts, pop-up ideas, code..."
            className="w-full bg-[#fdfbf9] border border-stone-300/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isTyping || !inputMessage.trim()}
          className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-50 font-medium text-xs sm:text-sm rounded-xl transition shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          {isTyping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">Ask Gemini</span>
        </button>
      </form>
    </div>
  );
};
