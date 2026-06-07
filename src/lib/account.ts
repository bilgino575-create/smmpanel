// ============================================================
// KRIYAVA — account store (localStorage) + helpers
// Shared by every app page AND the AI agent, so state stays in sync.
// ============================================================
import type { Account } from "./types";

const KEY = "kriyava_account_v1";
const THEME_KEY = "kriyava_theme";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadAccount(): Account {
  if (!isBrowser()) return blank();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const a = JSON.parse(raw) as Account;
    if (a.balance == null) return blank();
    if (!a.orders) a.orders = [];
    return a;
  } catch {
    return blank();
  }
}

export function blank(): Account {
  return { name: "Creator", balance: 0, spent: 0, orders: [], favorites: [] };
}

export function createAccountCache(a: Partial<Account>): Account {
  return {
    ...blank(),
    ...a,
    balance: Number(a.balance || 0),
    spent: Number(a.spent || 0),
    orders: a.orders || [],
    favorites: a.favorites || [],
    txns: a.txns || [],
    tickets: a.tickets || [],
  };
}

export function saveAccount(a: Account) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(a));
  window.dispatchEvent(new CustomEvent("kriyava:account", { detail: a }));
}

/** Ensure an empty account cache exists on first run. */
export function ensureAccount(): Account {
  const a = loadAccount();
  if (!isBrowser()) return a;
  if (!localStorage.getItem(KEY)) saveAccount(a);
  return a;
}

export function fmtINR(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "₹0";
  if (v < 1) return "₹" + Math.round(v * 1000) / 1000;
  return "₹" + Number(v).toLocaleString("en-IN");
}

export function getTheme(): "dark" | "light" {
  if (!isBrowser()) return "dark";
  return (localStorage.getItem(THEME_KEY) as "dark" | "light") || "dark";
}
export function setTheme(t: "dark" | "light") {
  if (!isBrowser()) return;
  localStorage.setItem(THEME_KEY, t);
  document.documentElement.setAttribute("data-theme", t);
}
