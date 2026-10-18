import React from 'react';
import { ActiveTab } from '../types';
import { Code2 } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  receiptCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  receiptCount,
}) => {
  const tabs: { id: ActiveTab; label: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'receipts', label: 'Receipts', badge: receiptCount > 0 ? String(receiptCount) : undefined },
    { id: 'listings', label: 'Listings' },
    { id: 'maps-radar', label: 'Venues' },
    { id: 'search-trends', label: 'Trends' },
    { id: 'economics', label: 'Economics' },
    { id: 'chatbot', label: 'Advisor' },
    { id: 'open-manifesto', label: 'Manifesto' },
  ];

  const handleOpenHowItWorks = () => {
    setActiveTab('dashboard');
    setTimeout(() => {
      document.getElementById('tech-workflow-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <header className="sticky top-4 z-50 flex items-center justify-center px-4 pointer-events-none">
      {/* Floating Pill Nav */}
      <nav className="pointer-events-auto bg-white/85 backdrop-blur-md border border-stone-200/90 shadow-[0_8px_30px_rgba(60,40,30,0.06)] rounded-full p-1.5 flex items-center gap-1 sm:gap-1.5 transition-all">
        {/* Brand Label: Elegant Side Hustle */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-stone-900 font-serif tracking-normal font-medium text-sm transition hover:text-stone-700 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#d97346]" />
          <span>Side Hustle</span>
        </button>

        <div className="h-4 w-[1px] bg-stone-200 mx-0.5" />

        {/* Navigation Tabs */}
        <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto max-w-[85vw] sm:max-w-none no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-stone-700 text-stone-100' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-[1px] bg-stone-200 mx-0.5 hidden md:block" />

        {/* How It Works Quick Access */}
        <button
          onClick={handleOpenHowItWorks}
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition cursor-pointer"
          title="See How People Work & How Technology Works"
        >
          <Code2 className="w-3 h-3 text-[#d97346]" />
          <span>How It Works</span>
        </button>
      </nav>
    </header>
  );
};
