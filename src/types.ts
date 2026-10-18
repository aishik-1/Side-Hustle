export type ActiveTab = 
  | 'dashboard'
  | 'receipts' 
  | 'listings' 
  | 'maps-radar' 
  | 'search-trends' 
  | 'economics' 
  | 'chatbot' 
  | 'open-manifesto';

export interface LocalReceipt {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  taxDeductible: boolean;
  scheduleCCategory: string;
  clientOrProject: string;
  notes: string;
  timestamp: number;
  rawText?: string;
  processedLocally: boolean;
}

export interface GroundingSource {
  title: string;
  url: string;
  domain?: string;
  snippet?: string;
}

export interface GoogleTrendsResponse {
  text: string;
  webSources: GroundingSource[];
  searchQueries?: string[];
  searchEntryPointHtml?: string;
  queryAnalyzed?: string;
  isFallback?: boolean;
}

export interface MapsVenue {
  title: string;
  uri: string;
  snippets?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  modelUsed?: string;
  sources?: GroundingSource[];
  searchQueries?: string[];
  isFallback?: boolean;
}

export type LocalModelChoice = 'gemma-2-2b' | 'smollm-2' | 'llama-3.2-3b' | 'gemini-hybrid';
