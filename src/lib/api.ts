// ============================================================
// KRIYAVA — API client (talks to the NestJS backend)
// Base URL from NEXT_PUBLIC_API_URL; falls back to localhost in dev.
// Token stored in localStorage; auto-attached to requests.
// ============================================================
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

const TOKEN_KEY = "kriyava_token";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string, remember = true) {
  if (!isBrowser()) return;
  if (remember) {
    localStorage.setItem(TOKEN_KEY, t);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, t);
    localStorage.removeItem(TOKEN_KEY);
  }
}
export function clearToken() {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiError(`Request failed (${res.status})`, res.status);
    }
  }
  if (!res.ok) {
    const d = data as Record<string, unknown> | null;
    const msg = d?.message || d?.error || `Request failed (${res.status})`;
    throw new ApiError(Array.isArray(msg) ? msg.join(", ") : String(msg), res.status);
  }
  return data as T;
}

// ---- typed API surface ----
export interface ApiUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  balance: number;
  spent: number;
  apiKey: string;
  referralCode?: string | null;
}
export interface ApiAiMessage {
  role: "user" | "model";
  text: string;
}
export interface ApiOrder {
  id: string;
  serviceId: string;
  service: string;
  platform?: string | null;
  link: string;
  qty: number;
  charge: number;
  status: string;
  provider: string;
  at: string;
}
export interface ApiTxn {
  id: string;
  type: string;
  amount: number;
  method: string;
  note?: string | null;
  at: string;
}
export interface ApiTicket {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  at: string;
}
export interface ApiServicesResponse {
  count: number;
  source?: { live: boolean; services: number; providers: Record<string, number> };
  services: import("./types").MarketService[];
}

export const api = {
  base: API_BASE,
  health: () => request<{ status: string; services: number }>("/health", { auth: false }),

  register: (email: string, name: string, password: string, referralCode?: string) =>
    request<{ token: string; user: ApiUser }>("/auth/register", {
      method: "POST",
      body: { email, name, password, referralCode },
      auth: false,
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: ApiUser }>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),
  social: (idToken: string, referralCode?: string) =>
    request<{ token: string; user: ApiUser }>("/auth/social", {
      method: "POST",
      body: { idToken, referralCode },
      auth: false,
    }),
  me: () => request<ApiUser>("/auth/me"),

  balance: () => request<{ balance: number; spent: number }>("/wallet/balance"),
  addFunds: (amount: number) =>
    request<{ added: number; balance: number }>("/wallet/add-funds", {
      method: "POST",
      body: { amount },
    }),
  transactions: () => request<ApiTxn[]>("/wallet/transactions"),

  services: () => request<ApiServicesResponse>("/services", { auth: false }),
  providerStatus: () =>
    request<{ live: boolean; services: number; providers: Record<string, number> }>("/services/provider-status", { auth: false }),

  orders: () => request<ApiOrder[]>("/orders"),
  createOrder: (serviceId: string, quantity: number, link: string) =>
    request<ApiOrder>("/orders", { method: "POST", body: { serviceId, quantity, link } }),
  refillOrder: (id: string) => request<{ ok: boolean }>(`/orders/${id}/refill`, { method: "POST" }),
  cancelOrder: (id: string) =>
    request<{ ok: boolean; refunded: number }>(`/orders/${id}/cancel`, { method: "POST" }),

  tickets: () => request<ApiTicket[]>("/tickets"),
  createTicket: (subject: string, category: string, message: string) =>
    request<{ id: string; status: string; at: string }>("/tickets", { method: "POST", body: { subject, category, message } }),

  // payments (Razorpay)
  paymentConfig: () =>
    request<{ provider: string; enabled: boolean }>("/payments/config", { auth: false }),
  createPaymentOrder: (amount: number) =>
    request<{ orderId: string; amount: number; currency: string; keyId: string }>(
      "/payments/create-order",
      { method: "POST", body: { amount } },
    ),
  verifyPayment: (p: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    request<{ added: number; balance: number }>("/payments/verify", { method: "POST", body: p }),

  aiChat: (p: { prompt: string; surface: "dashboard" | "landing"; messages?: ApiAiMessage[]; context?: Record<string, unknown> }) =>
    request<{ reply: string; provider: string }>("/ai/chat", { method: "POST", body: p, auth: false }),

  myReferrals: () => request<{ code: string|null; link: string|null; earned: number; referredCount: number; commissionPct: number; recentEarnings: Array<{amount:number;note:string|null;time:string}> }>("/referrals/me"),

  adminSummary: () => request<AdminSummaryResponse>("/admin/summary"),
  adminAddFunds: (email: string, amount: number, note?: string) =>
    request<{ ok: boolean; added: number; newBalance: number }>("/admin/add-funds", {
      method: "POST", body: { email, amount, note },
    }),
  adminReferrals: () => request<AdminReferralResponse>("/admin/referrals"),
};

export interface AdminOrderRow {
  id: string; service: string; platform: string | null;
  qty: number; charge: number; providerCost: number; profit: number;
  provider: string; status: string; time: string;
}
export interface AdminUserRow {
  id: string; name: string; email: string;
  balance: number; spent: number; role: string; joined: string;
}
export interface AdminDepositRow { amount: number; method: string; note?: string | null; time: string; }
export interface AdminReferralResponse {
  summary: { totalReferrers: number; totalReferred: number; totalPaidOut: number };
  topReferrers: Array<{ name: string; email: string; referralCode: string | null; earned: number; referredCount: number }>;
  recentActivity: Array<{ amount: number; note: string | null; time: string }>;
}

export interface AdminSummaryResponse {
  asOf: string; totalUsers: number;
  providerStatus: { live: boolean; services: number; providers: Record<string,number>; balances: Record<string,string> };
  today: { count: number; activeCount: number; failedCount: number; revenue: number; providerCost: number; profit: number; orders: AdminOrderRow[] };
  allTime: { count: number; activeCount: number; failedCount: number; revenue: number; providerCost: number; profit: number };
  recentOrders: AdminOrderRow[];
  users: AdminUserRow[];
  deposits: AdminDepositRow[];
  todayDeposits: number;
}

// Loads the Razorpay checkout script once.
export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    // @ts-expect-error injected global
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}
