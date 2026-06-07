// ============================================================
// KRIYAVA — shared TypeScript types
// ============================================================

export interface MarketService {
  id: string;
  name: string;
  platform: string;
  category: string;
  country: string;
  price: number; // retail INR per 1000
  margin_pct: number;
  speed: string;
  refill: string;
  quality: number; // 1-5
  min: number | null;
  max: number | null;
  provider: string;
  description?: string;
  providerServiceId?: string;
  providerCostInr?: number;
  providerRate?: number;
  providerCurrency?: string;
  backupProviders?: Array<{
    key: string;
    name: string;
    serviceId: string;
    rate: number;
    currency: string;
    costInr: number;
  }>;
}

export interface HeadlineCard {
  label: string;
  icon: string;
  cost_inr: number;
  retail_inr: number;
  margin_pct: number;
  from_provider: string;
  speed: string;
  quality: number;
  refill: string;
  min: number | null;
  max: number | null;
}

export interface Order {
  id: string;
  service: string;
  qty: number;
  link: string;
  charge: number;
  status: "Processing" | "In progress" | "Partial" | "Completed" | "Canceled" | "Pending";
  at: number;
  provider?: string;
}

export interface Txn {
  id: string;
  type: string;
  amount: number;
  at: number;
  method: string;
}

export interface Ticket {
  id: string;
  subject: string;
  cat: string;
  msg: string;
  status: "Open" | "Answered" | "Closed";
  at: number;
}

export interface Account {
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  balance: number;
  spent: number;
  orders: Order[];
  favorites: string[];
  txns?: Txn[];
  tickets?: Ticket[];
  apiKey?: string;
  referralCode?: string | null;
  prefs?: Record<string, any>;
}
