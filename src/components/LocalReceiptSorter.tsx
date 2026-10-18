import React, { useState, useRef } from 'react';
import { 
  Receipt, 
  ShieldCheck, 
  Plus, 
  Download, 
  FileText, 
  Trash2, 
  DollarSign, 
  Tag, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  FileSpreadsheet,
  FileCode,
  Upload,
  Copy,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { LocalReceipt } from '../types';
import { 
  SCHEDULE_C_CATEGORIES, 
  parseReceiptLocally, 
  exportToCSV, 
  exportToAccountingJSON,
  importFromAccountingJSON,
  exportToFineTuneJSONL 
} from '../utils/localEngine';

interface LocalReceiptSorterProps {
  receipts: LocalReceipt[];
  setReceipts: React.Dispatch<React.SetStateAction<LocalReceipt[]>>;
}

export const LocalReceiptSorter: React.FC<LocalReceiptSorterProps> = ({
  receipts,
  setReceipts,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [modalFormat, setModalFormat] = useState<'csv' | 'json' | 'jsonl'>('csv');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual form state
  const [manualMerchant, setManualMerchant] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualCategory, setManualCategory] = useState(SCHEDULE_C_CATEGORIES[0]);
  const [manualClient, setManualClient] = useState('');
  const [manualNotes, setManualNotes] = useState('');

  const triggerNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Process raw text locally
  const handleProcessLocalText = () => {
    if (!inputText.trim()) return;

    const parsed = parseReceiptLocally(inputText);
    const newReceipt: LocalReceipt = {
      id: 'rec-' + Date.now(),
      merchant: parsed.merchant || 'Unknown Vendor',
      date: parsed.date || new Date().toISOString().split('T')[0],
      amount: parsed.amount || 0,
      taxDeductible: true,
      scheduleCCategory: parsed.scheduleCCategory || 'Raw Materials & Supplies',
      clientOrProject: 'Local Side Hustle',
      notes: inputText.slice(0, 150),
      rawText: inputText,
      timestamp: Date.now(),
      processedLocally: true,
    };

    setReceipts((prev) => [newReceipt, ...prev]);
    setInputText('');
    triggerNotify('✓ Receipt parsed 100% locally on your device! 0 KB sent to cloud.');
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMerchant || !manualAmount) return;

    const newReceipt: LocalReceipt = {
      id: 'rec-' + Date.now(),
      merchant: manualMerchant,
      date: manualDate,
      amount: parseFloat(manualAmount) || 0,
      taxDeductible: true,
      scheduleCCategory: manualCategory,
      clientOrProject: manualClient || 'General',
      notes: manualNotes,
      timestamp: Date.now(),
      processedLocally: true,
    };

    setReceipts((prev) => [newReceipt, ...prev]);
    setManualMerchant('');
    setManualAmount('');
    setManualNotes('');
    setShowManualAdd(false);
    triggerNotify('✓ Expense logged in local encrypted browser storage.');
  };

  const handleDelete = (id: string) => {
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDownloadCSV = () => {
    const csv = exportToCSV(receipts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sidehustle_accounting_schedule_c_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotify('✓ Exported QuickBooks & Schedule C CSV accounting ledger!');
  };

  const handleDownloadJSON = () => {
    const json = exportToAccountingJSON(receipts);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sidehustle_accounting_ledger_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotify('✓ Exported complete structured JSON accounting backup!');
  };

  const handleDownloadJSONL = () => {
    const jsonl = exportToFineTuneJSONL(receipts);
    const blob = new Blob([jsonl], { type: 'application/jsonl;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gemma_open_finetune_dataset_${new Date().toISOString().slice(0, 10)}.jsonl`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotify('Exported Gemma 2 / Llama 3 fine-tuning JSONL dataset!');
  };

  const handleCopyContent = (format: 'csv' | 'json' | 'jsonl') => {
    let content = '';
    if (format === 'csv') content = exportToCSV(receipts);
    else if (format === 'json') content = exportToAccountingJSON(receipts);
    else content = exportToFineTuneJSONL(receipts);

    navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
    triggerNotify(`Copied ${format.toUpperCase()} to clipboard!`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = importFromAccountingJSON(text);
        if (imported.length > 0) {
          setReceipts((prev) => [...imported, ...prev]);
          triggerNotify(`✓ Successfully restored ${imported.length} expenses from JSON backup!`);
        } else {
          triggerNotify('No valid receipt entries found in imported file.');
        }
      } catch (err: any) {
        triggerNotify('Failed to import JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load quick test templates
  const loadQuickSample = (type: 'freelance' | 'etsy' | 'food') => {
    if (type === 'freelance') {
      setInputText(`INVOICE & RECEIPT #8841
Vendor: Upwork Escrow & Contractor Payout
Date: 2026-10-14
Subcontractor: Senior UI Framer Developer
Client NDA Project: "Project Apex Fintech Redesign"
Total Amount Due: $650.00
Payment Method: Business Checking
Tax Memo: Contract Labor 1099 deductible`);
    } else if (type === 'etsy') {
      setInputText(`ORDER CONFIRMATION #ETSY-SUPPLY-44
Merchant: EcoKraft Packaging & Bubble Mailers Inc
Date: 2026-10-13
Items:
- 200x Recyclable Honeycomb Padded Mailers: $54.00
- 100x Custom Thermal Shipping Labels: $18.50
- 2x Rolls Heavy Duty Packing Tape: $9.20
SUBTOTAL: $81.70
TAX: $5.30
TOTAL BILLED: $87.00
Purpose: Holiday Etsy Candle Gift Box Shipments`);
    } else {
      setInputText(`COMMERCIAL KITCHEN RENTAL INVOICE
Commissary: Eastside Shared Commercial Kitchen LLC
Date: 2026-10-11
Description: 12 Hours Prep Time + Walk-in Cold Storage
Event: Downtown Saturday Farmers Market & Artisanal Hot Sauce Batch #4
Total Paid: $240.00
Status: Paid in Full`);
    }
  };

  // Calculations
  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);
  const totalDeductible = receipts
    .filter((r) => r.taxDeductible)
    .reduce((sum, r) => sum + r.amount, 0);
  const estimatedTaxSavings = totalDeductible * 0.25; // approximate 25% self-employment + federal bracket

  const filteredReceipts = activeCategoryFilter === 'All'
    ? receipts
    : receipts.filter((r) => r.scheduleCCategory === activeCategoryFilter);

  const filteredTotal = filteredReceipts.reduce((sum, r) => sum + r.amount, 0);
  const avgExpense = receipts.length > 0 ? totalAmount / receipts.length : 0;

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Header Card */}
      <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#d97346]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-stone-900">Local-First Receipt & Accounting Vault</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#faeae1] text-[#9c4923] font-medium border border-[#f3cbba]">
                  On-Device Storage
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Client NDAs, contractor rates, and bank receipts are parsed and stored <strong>entirely on your local machine</strong>.
                No third-party cloud servers ever see your financial data. Runs offline without internet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            {/* Hidden file input for JSON import */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleImportFile}
              className="hidden"
            />

            <button
              onClick={handleDownloadCSV}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-medium rounded-xl border border-stone-200 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Download CSV for QuickBooks, TurboTax or Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-stone-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-medium rounded-xl border border-stone-200 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Download structured JSON accounting ledger"
            >
              <FileCode className="w-3.5 h-3.5 text-stone-600" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-medium rounded-xl border border-stone-200 flex items-center gap-1.5 transition cursor-pointer"
              title="Import and restore an existing JSON accounting backup"
            >
              <Upload className="w-3.5 h-3.5 text-stone-500" />
              <span>Import JSON</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Open full Accounting Export & Backup Hub"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Accounting Hub</span>
            </button>
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="mt-5 pt-3.5 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-stone-500 block text-[11px]">Network Storage:</span>
            <span className="text-stone-900 font-mono font-bold">0 Bytes (100% On-Device)</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">Storage Engine:</span>
            <span className="text-stone-800 font-medium">Local IndexedDB / Storage</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">Inference Cost:</span>
            <span className="text-stone-900 font-mono font-bold">$0.00 / Free Forever</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">Local Token Engine:</span>
            <span className="text-stone-900 font-mono font-semibold">Gemma-2B Heuristics</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-sm hover:border-[#f3cbba] transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Logged Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-[#faeae1] text-[#9c4923] flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-stone-900">
            ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5 pt-1.5 border-t border-stone-100">
            <span>{receipts.length} total recorded line items</span>
            <span className="font-mono text-stone-700 font-medium">
              ${avgExpense.toFixed(2)} avg/item
            </span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-sm hover:border-emerald-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wider">Schedule C Deductions</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-emerald-700">
            ${totalDeductible.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5 pt-1.5 border-t border-stone-100">
            <span>Business tax write-off</span>
            <span className="font-mono text-emerald-700 font-medium">
              {(receipts.length ? (totalDeductible / totalAmount) * 100 : 0).toFixed(0)}% qualified
            </span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-5 shadow-sm hover:border-amber-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-600 uppercase tracking-wider">Est. Tax Cash Savings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-stone-900">
            ${estimatedTaxSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5 pt-1.5 border-t border-stone-100">
            <span>Cash saved at tax filing</span>
            <span className="font-mono text-stone-700 font-medium">~25% bracket</span>
          </div>
        </div>
      </div>

      {/* Parser Input Box */}
      <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-700" />
              On-Device Raw Text & OCR Sorter
            </h3>
            <p className="text-xs text-stone-600">
              Paste email invoices, POS receipts, or contractor messages. Parsed in milliseconds with zero network requests.
            </p>
          </div>

          {/* Quick Samples */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-stone-500">Quick Test:</span>
            <button
              onClick={() => loadQuickSample('freelance')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200 transition cursor-pointer"
            >
              Freelance Contractor
            </button>
            <button
              onClick={() => loadQuickSample('etsy')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200 transition cursor-pointer"
            >
              Etsy Packaging
            </button>
            <button
              onClick={() => loadQuickSample('food')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200 transition cursor-pointer"
            >
              Pop-Up Kitchen
            </button>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste receipt text, invoice email, or bank transaction details here... Example:&#10;Home Depot #4410&#10;Date: 2026-10-12&#10;Total: $124.50&#10;Items: Sanding discs, mineral oil, packaging tape for custom cutting boards."
          rows={4}
          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 font-mono transition"
        />

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero cloud API cost • Air-gapped capable</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManualAdd(!showManualAdd)}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition cursor-pointer"
            >
              {showManualAdd ? 'Cancel Manual Add' : '+ Manual Entry'}
            </button>
            <button
              onClick={handleProcessLocalText}
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-50 font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              Parse On-Device
            </button>
          </div>
        </div>

        {/* Manual Add Collapsible Form */}
        {showManualAdd && (
          <form onSubmit={handleManualAdd} className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">Merchant / Vendor</label>
              <input
                type="text"
                required
                value={manualMerchant}
                onChange={(e) => setManualMerchant(e.target.value)}
                placeholder="e.g. Acme Hardware"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                placeholder="45.00"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">Date</label>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">Schedule C Category</label>
              <select
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900"
              >
                {SCHEDULE_C_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">Client or Project Name</label>
              <input
                type="text"
                value={manualClient}
                onChange={(e) => setManualClient(e.target.value)}
                placeholder="e.g. Fall Flea Market Booth"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium text-xs rounded-lg transition cursor-pointer"
              >
                Save Local Expense
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Small Summary Card - Total Receipt Expenses */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-stone-50 rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-xs">
              <DollarSign className="w-5 h-5 text-[#f49342]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-300">
                  Total Expenses Summary Card
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-700/80 text-stone-200 font-mono">
                  {receipts.length} {receipts.length === 1 ? 'receipt' : 'receipts'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-stone-400">
                  total calculated sum
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs border-t sm:border-t-0 sm:border-l border-stone-700/80 pt-2 sm:pt-0 sm:pl-5 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-stone-400 block text-[11px]">Deductible Subtotal:</span>
              <span className="font-mono font-semibold text-emerald-400">
                ${totalDeductible.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Average / Item:</span>
              <span className="font-mono font-semibold text-stone-200">
                ${avgExpense.toFixed(2)}
              </span>
            </div>
            {activeCategoryFilter !== 'All' && (
              <div className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <span className="text-stone-300 block text-[10px]">{activeCategoryFilter}:</span>
                <span className="font-mono font-bold text-[#f49342]">
                  ${filteredTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl overflow-hidden shadow-sm">
        {/* Table Filters & Header */}
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-stone-700" />
            <h3 className="font-semibold text-stone-900 text-sm">
              Local Expense Ledger ({filteredReceipts.length})
            </h3>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            <button
              onClick={() => setActiveCategoryFilter('All')}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition ${
                activeCategoryFilter === 'All'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70'
              }`}
            >
              All Categories
            </button>
            {SCHEDULE_C_CATEGORIES.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                  activeCategoryFilter === cat
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70'
                }`}
              >
                {cat.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {filteredReceipts.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-xs">
            No expenses found in this filter. Paste an invoice above to test the on-device parser.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 overflow-x-auto">
            {filteredReceipts.map((r) => (
              <div key={r.id} className="p-4 hover:bg-[#fbf9f5] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900 text-sm">{r.merchant}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {r.scheduleCCategory}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                      On-Device
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-600">
                    <span>{r.date}</span>
                    {r.clientOrProject && (
                      <>
                        <span>•</span>
                        <span className="text-stone-800">{r.clientOrProject}</span>
                      </>
                    )}
                    {r.notes && (
                      <>
                        <span>•</span>
                        <span className="text-stone-500 italic max-w-sm truncate">{r.notes}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-base font-bold font-mono text-emerald-700">
                      ${r.amount.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-stone-500">
                      {r.taxDeductible ? 'Schedule C Deductible' : 'Non-deductible'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Ledger Footer Summary */}
            <div className="p-4 bg-[#fbf9f5] border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-stone-600 flex items-center gap-2">
                <span>Showing <strong>{filteredReceipts.length}</strong> of <strong>{receipts.length}</strong> receipts</span>
                {activeCategoryFilter !== 'All' && (
                  <span className="text-stone-500 font-mono font-medium">({activeCategoryFilter}: ${filteredTotal.toFixed(2)})</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-stone-600 text-xs font-medium">Total Receipt Expenses Sum:</span>
                <span className="text-sm sm:text-base font-bold font-mono text-stone-900 bg-white px-3 py-1 rounded-xl border border-stone-200 shadow-xs">
                  ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accounting Export & Backup Hub Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">Accounting Export & External Sync Hub</h3>
                  <p className="text-xs text-neutral-600">
                    Export your business expenses for QuickBooks, TurboTax, accountants, or custom backup scripts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-neutral-500 hover:text-black p-1 rounded-lg hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Format Tabs */}
            <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl border border-neutral-200 text-xs">
              <button
                onClick={() => setModalFormat('csv')}
                className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                  modalFormat === 'csv'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-neutral-700" />
                <span>CSV (Excel & QuickBooks)</span>
              </button>

              <button
                onClick={() => setModalFormat('json')}
                className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                  modalFormat === 'json'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-neutral-700" />
                <span>JSON (Full Ledger Backup)</span>
              </button>

              <button
                onClick={() => setModalFormat('jsonl')}
                className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                  modalFormat === 'jsonl'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-neutral-700" />
                <span>JSONL (Gemma / Llama Dataset)</span>
              </button>
            </div>

            {/* Description & Metrics for selected format */}
            <div className="text-xs text-neutral-800 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-900 block">
                  {modalFormat === 'csv' && 'Schedule C CSV Format'}
                  {modalFormat === 'json' && 'Structured JSON Ledger'}
                  {modalFormat === 'jsonl' && 'Fine-Tuning JSONL Format'}
                </span>
                <span className="text-neutral-600 text-[11px]">
                  {modalFormat === 'csv' && 'Includes Receipt ID, Dates, Merchant, Amount, Schedule C Tax Category, and Deductible tags.'}
                  {modalFormat === 'json' && 'Includes full metadata, category aggregations, tax write-off projections, and raw line items.'}
                  {modalFormat === 'jsonl' && 'Formatted with system, user, and assistant turns ready for LoRA fine-tuning.'}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-emerald-700 font-bold text-sm block">
                  {receipts.length} entries
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  ${totalAmount.toFixed(2)} total
                </span>
              </div>
            </div>

            {/* Live Data Preview */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-[180px]">
              <span className="text-[11px] font-medium text-neutral-600 mb-1 flex items-center justify-between">
                <span>Data Preview:</span>
                <span className="font-mono text-[10px] text-neutral-500">Read-Only</span>
              </span>
              <pre className="flex-1 overflow-auto p-3 bg-neutral-50 rounded-xl border border-neutral-300 text-[11px] font-mono text-neutral-800 max-h-[220px]">
                {modalFormat === 'csv' && exportToCSV(receipts.slice(0, 4)) + (receipts.length > 4 ? `\n... (+ ${receipts.length - 4} more entries)` : '')}
                {modalFormat === 'json' && exportToAccountingJSON(receipts.slice(0, 3))}
                {modalFormat === 'jsonl' && exportToFineTuneJSONL(receipts.slice(0, 2))}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-3">
              <button
                onClick={() => handleCopyContent(modalFormat)}
                className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl border border-neutral-300 flex items-center gap-1.5 transition"
              >
                {copiedFormat === modalFormat ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                {modalFormat === 'csv' && (
                  <button
                    onClick={handleDownloadCSV}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .CSV File</span>
                  </button>
                )}
                {modalFormat === 'json' && (
                  <button
                    onClick={handleDownloadJSON}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .JSON Ledger</span>
                  </button>
                )}
                {modalFormat === 'jsonl' && (
                  <button
                    onClick={handleDownloadJSONL}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 font-semibold text-xs rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .JSONL Dataset</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

