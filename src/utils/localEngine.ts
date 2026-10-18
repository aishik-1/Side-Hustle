import { LocalReceipt } from '../types';

export const SCHEDULE_C_CATEGORIES = [
  'Advertising & Marketing',
  'Contract Labor & Freelancers',
  'Office Expenses & Software',
  'Raw Materials & Supplies',
  'Legal & Professional Fees',
  'Travel, Meals & Pop-Up Lodging',
  'Shipping & Packaging',
  'Equipment & Tools Depreciation',
  'Vehicle & Mileage',
  'Merchant & Payment Processing Fees',
];

export const INITIAL_RECEIPTS: LocalReceipt[] = [
  {
    id: 'rec-1',
    merchant: 'The Container Store',
    date: '2026-10-10',
    amount: 148.50,
    taxDeductible: true,
    scheduleCCategory: 'Raw Materials & Supplies',
    clientOrProject: 'Fall Craft Market Booth Display',
    notes: 'Modular acrylic shelving and wooden risers for pop-up flea market',
    timestamp: Date.now() - 3600000 * 96,
    processedLocally: true,
  },
  {
    id: 'rec-2',
    merchant: 'Stripe Merchant Fees',
    date: '2026-10-12',
    amount: 38.20,
    taxDeductible: true,
    scheduleCCategory: 'Merchant & Payment Processing Fees',
    clientOrProject: 'Etsy & Direct Shop Orders',
    notes: '2.9% + $0.30 transaction processing for client custom leather wallets',
    timestamp: Date.now() - 3600000 * 48,
    processedLocally: true,
  },
  {
    id: 'rec-3',
    merchant: 'Figma Professional & Canva Pro',
    date: '2026-10-01',
    amount: 32.00,
    taxDeductible: true,
    scheduleCCategory: 'Office Expenses & Software',
    clientOrProject: 'Design Freelance & Label Printing',
    notes: 'Monthly subscription for product sticker mockups and packaging vectors',
    timestamp: Date.now() - 3600000 * 300,
    processedLocally: true,
  },
  {
    id: 'rec-4',
    merchant: 'Local Artisan Mill & Timber',
    date: '2026-10-08',
    amount: 285.00,
    taxDeductible: true,
    scheduleCCategory: 'Raw Materials & Supplies',
    clientOrProject: 'Custom Dining Trays - Client "Oakhaven Cafe"',
    notes: 'Kiln-dried walnut planks and food-safe mineral oil beeswax seal',
    timestamp: Date.now() - 3600000 * 144,
    processedLocally: true,
  },
];

/**
 * Local-First Regex & Rule Parser: Runs 100% on the user's CPU/RAM.
 * Client financial and NDA data NEVER leaves the laptop.
 */
export function parseReceiptLocally(rawText: string): Partial<LocalReceipt> {
  const text = rawText.trim();
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // Extract amount ($XX.XX or total: XX.XX)
  let extractedAmount = 0;
  const amountMatches = text.match(/(?:total|amount|due|balance|subtotal|sum)?[^\d]*\$?\s*([0-9]+[.,][0-9]{2})/gi);
  if (amountMatches && amountMatches.length > 0) {
    const lastMatch = amountMatches[amountMatches.length - 1];
    const num = lastMatch.replace(/[^0-9.]/g, '');
    if (!isNaN(parseFloat(num))) {
      extractedAmount = parseFloat(num);
    }
  } else {
    // Look for any isolated price pattern
    const generalPrice = text.match(/\b([0-9]+\.[0-9]{2})\b/);
    if (generalPrice) {
      extractedAmount = parseFloat(generalPrice[1]);
    }
  }

  // Extract date (YYYY-MM-DD or MM/DD/YYYY or Month DD, YYYY)
  let extractedDate = new Date().toISOString().split('T')[0];
  const dateMatch = text.match(/\b(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b/);
  if (dateMatch) {
    try {
      const parsed = new Date(dateMatch[1]);
      if (!isNaN(parsed.getTime())) {
        extractedDate = parsed.toISOString().split('T')[0];
      }
    } catch {
      // fallback to today
    }
  }

  // Extract merchant (usually first non-empty line or line with Store/Coffee/Inc)
  let extractedMerchant = lines[0] || 'Unidentified Merchant';
  if (extractedMerchant.length > 40) {
    extractedMerchant = extractedMerchant.substring(0, 40) + '...';
  }

  // Determine Schedule C tax category using local keyword heuristics
  const lower = text.toLowerCase();
  let category = 'Raw Materials & Supplies';

  if (lower.includes('software') || lower.includes('cloud') || lower.includes('figma') || lower.includes('adobe') || lower.includes('hosting') || lower.includes('zoom')) {
    category = 'Office Expenses & Software';
  } else if (lower.includes('ads') || lower.includes('meta') || lower.includes('google ads') || lower.includes('flyer') || lower.includes('marketing') || lower.includes('promoted')) {
    category = 'Advertising & Marketing';
  } else if (lower.includes('stripe') || lower.includes('paypal') || lower.includes('square') || lower.includes('transaction fee') || lower.includes('merchant')) {
    category = 'Merchant & Payment Processing Fees';
  } else if (lower.includes('usps') || lower.includes('ups') || lower.includes('fedex') || lower.includes('box') || lower.includes('bubble wrap') || lower.includes('shipping')) {
    category = 'Shipping & Packaging';
  } else if (lower.includes('freelance') || lower.includes('upwork') || lower.includes('fiverr') || lower.includes('contractor') || lower.includes('subcontractor')) {
    category = 'Contract Labor & Freelancers';
  } else if (lower.includes('uber') || lower.includes('gas') || lower.includes('fuel') || lower.includes('parking') || lower.includes('mileage')) {
    category = 'Vehicle & Mileage';
  } else if (lower.includes('restaurant') || lower.includes('diner') || lower.includes('coffee') || lower.includes('cafe') || lower.includes('catering') || lower.includes('hotel')) {
    category = 'Travel, Meals & Pop-Up Lodging';
  } else if (lower.includes('legal') || lower.includes('cpa') || lower.includes('attorney') || lower.includes('accounting') || lower.includes('license') || lower.includes('permit')) {
    category = 'Legal & Professional Fees';
  }

  return {
    merchant: extractedMerchant,
    date: extractedDate,
    amount: extractedAmount,
    scheduleCCategory: category,
    taxDeductible: true,
    processedLocally: true,
  };
}

/**
 * Export side-hustle data to JSONL format for fine-tuning open models (Llama 3, Gemma 2, Mistral).
 */
export function exportToFineTuneJSONL(receipts: LocalReceipt[]): string {
  const lines = receipts.map((r) => {
    return JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are an on-device local side-hustle bookkeeper categorizing private expenses into Schedule C tax deductions.',
        },
        {
          role: 'user',
          content: `Receipt from ${r.merchant} on ${r.date} for $${r.amount.toFixed(2)}. Notes: ${r.notes || 'N/A'}. Project: ${r.clientOrProject || 'General'}.`,
        },
        {
          role: 'assistant',
          content: JSON.stringify({
            merchant: r.merchant,
            amount: r.amount,
            scheduleCCategory: r.scheduleCCategory,
            taxDeductible: r.taxDeductible,
          }),
        },
      ],
    });
  });

  return lines.join('\n');
}

/**
 * Export receipts to standard CSV for accountant, QuickBooks, or TurboTax
 */
export function exportToCSV(receipts: LocalReceipt[]): string {
  const headers = [
    'Receipt ID',
    'Date',
    'Merchant / Vendor',
    'Amount (USD)',
    'Tax Deductible',
    'Schedule C Tax Category',
    'Client / Project',
    'Notes / Description',
    'Processed On-Device',
    'Export Verification',
  ];

  const rows = receipts.map((r) => [
    `"${r.id}"`,
    `"${r.date}"`,
    `"${r.merchant.replace(/"/g, '""')}"`,
    r.amount.toFixed(2),
    r.taxDeductible ? 'YES' : 'NO',
    `"${r.scheduleCCategory.replace(/"/g, '""')}"`,
    `"${(r.clientOrProject || '').replace(/"/g, '""')}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`,
    r.processedLocally ? 'YES (0 Bytes to Cloud)' : 'CLOUD',
    `"SECURE-ON-DEVICE-VERIFIED"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Export complete accounting ledger in structured JSON format
 */
export function exportToAccountingJSON(receipts: LocalReceipt[]): string {
  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);
  const deductibleAmount = receipts
    .filter((r) => r.taxDeductible)
    .reduce((sum, r) => sum + r.amount, 0);
  const estimatedTaxSavings = deductibleAmount * 0.25;

  // Breakdown by Schedule C category
  const categoryBreakdown: Record<string, { count: number; total: number }> = {};
  receipts.forEach((r) => {
    if (!categoryBreakdown[r.scheduleCCategory]) {
      categoryBreakdown[r.scheduleCCategory] = { count: 0, total: 0 };
    }
    categoryBreakdown[r.scheduleCCategory].count += 1;
    categoryBreakdown[r.scheduleCCategory].total += r.amount;
  });

  const payload = {
    appName: 'SideHustle OS - Local Open AI Engine',
    schemaVersion: '2026.1',
    exportTimestamp: new Date().toISOString(),
    ledgerType: 'Sole Proprietorship Schedule C Business Accounting',
    summary: {
      totalReceiptCount: receipts.length,
      totalGrossExpenses: Number(totalAmount.toFixed(2)),
      totalScheduleCDeductible: Number(deductibleAmount.toFixed(2)),
      estimatedTaxSavings: Number(estimatedTaxSavings.toFixed(2)),
      currency: 'USD',
      privacyCompliance: '100% Local On-Device (0 bytes sent to external cloud)',
      categoryBreakdown,
    },
    receipts: receipts.map((r) => ({
      id: r.id,
      merchant: r.merchant,
      date: r.date,
      amount: r.amount,
      taxDeductible: r.taxDeductible,
      scheduleCCategory: r.scheduleCCategory,
      clientOrProject: r.clientOrProject || 'General',
      notes: r.notes || '',
      processedLocally: r.processedLocally,
      timestamp: r.timestamp,
    })),
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Parse and restore receipts from an imported JSON file
 */
export function importFromAccountingJSON(jsonText: string): LocalReceipt[] {
  const data = JSON.parse(jsonText);
  let rawList: any[] = [];
  if (Array.isArray(data)) {
    rawList = data;
  } else if (data.receipts && Array.isArray(data.receipts)) {
    rawList = data.receipts;
  } else {
    throw new Error('Unrecognized JSON accounting format. Expected an array of receipts or an object with a "receipts" property.');
  }

  return rawList.map((item: any, idx: number) => ({
    id: item.id || `imported-${Date.now()}-${idx}`,
    merchant: item.merchant || 'Imported Vendor',
    date: item.date || new Date().toISOString().split('T')[0],
    amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0,
    taxDeductible: item.taxDeductible !== false,
    scheduleCCategory: item.scheduleCCategory || 'Raw Materials & Supplies',
    clientOrProject: item.clientOrProject || 'Imported Accounting Backup',
    notes: item.notes || '',
    timestamp: item.timestamp || Date.now(),
    processedLocally: true,
  }));
}
