/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LocalReceiptSorter } from './components/LocalReceiptSorter';
import { ListingStudio } from './components/ListingStudio';
import { PopUpRadar } from './components/PopUpRadar';
import { MarketTrends } from './components/MarketTrends';
import { ArgonArchitect } from './components/ArgonArchitect';
import { HustleChatbot } from './components/HustleChatbot';
import { OpenInnovationManifesto } from './components/OpenInnovationManifesto';
import { SuperlocalHero3D } from './components/SuperlocalHero3D';
import { ActiveTab, LocalReceipt } from './types';
import { INITIAL_RECEIPTS } from './utils/localEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Load persisted receipts from local storage or fallback to realistic initial receipts
  const [receipts, setReceipts] = useState<LocalReceipt[]>(() => {
    try {
      const saved = localStorage.getItem('sidehustle_local_receipts_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read localStorage:', e);
    }
    return INITIAL_RECEIPTS;
  });

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sidehustle_local_receipts_v1', JSON.stringify(receipts));
    } catch (e) {
      console.warn('Could not write to localStorage:', e);
    }
  }, [receipts]);

  return (
    <div className="min-h-screen text-stone-900 flex flex-col font-sans selection:bg-[#faeae1] selection:text-[#9c4923]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        receiptCount={receipts.length}
      />

      {/* Main App Container */}
      <main className="flex-1 w-full">
        {activeTab === 'dashboard' ? (
          <SuperlocalHero3D 
            onSelectModule={(tab) => setActiveTab(tab)} 
            receiptCount={receipts.length} 
          />
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
            {activeTab === 'receipts' && (
              <LocalReceiptSorter receipts={receipts} setReceipts={setReceipts} />
            )}

            {activeTab === 'listings' && (
              <ListingStudio />
            )}

            {activeTab === 'maps-radar' && (
              <PopUpRadar />
            )}

            {activeTab === 'search-trends' && (
              <MarketTrends />
            )}

            {activeTab === 'economics' && (
              <ArgonArchitect />
            )}

            {activeTab === 'chatbot' && (
              <HustleChatbot />
            )}

            {activeTab === 'open-manifesto' && (
              <OpenInnovationManifesto />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
