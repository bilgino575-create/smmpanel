"use client";
// React hook that subscribes to the shared account store and re-renders on change.
import { useEffect, useState, useCallback } from "react";
import type { Account } from "./types";
import { loadAccount, ensureAccount } from "./account";
import { api, ApiError, clearToken, getToken } from "./api";

function toMillis(at: string) {
  const t = new Date(at).getTime();
  return Number.isFinite(t) ? t : Date.now();
}

export function useAccount() {
  const [account, setAccount] = useState<Account>(() => loadAccount());

  const refresh = useCallback(() => setAccount(loadAccount()), []);

  const sync = useCallback(async () => {
    if (!getToken()) return;
    try {
      const [me, orders, txns] = await Promise.all([api.me(), api.orders(), api.transactions()]);
      const cached = loadAccount();
      const next: Account = {
        ...cached,
        name: me.name,
        email: me.email,
        phone: me.phone || cached.phone,
        balance: me.balance,
        spent: me.spent,
        apiKey: me.apiKey,
        referralCode: me.referralCode || cached.referralCode,
        orders: orders.map((o) => ({
          id: o.id,
          service: o.service,
          qty: o.qty,
          link: o.link,
          charge: o.charge,
          status: o.status as Account["orders"][number]["status"],
          at: toMillis(o.at),
          provider: o.provider,
        })),
        txns: txns.map((t) => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          at: toMillis(t.at),
          method: t.method,
        })),
        favorites: cached.favorites || [],
      };
      localStorage.setItem("kriyava_account_v1", JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("kriyava:account", { detail: next }));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Expired or revoked token — clear it so AuthGuard redirects to login on next navigation.
        clearToken();
        localStorage.removeItem("kriyava_account_v1");
      }
      // Other errors (network, server): keep last known state visible; don't redirect.
    }
  }, []);

  useEffect(() => {
    ensureAccount();
    refresh();
    sync();
    const onChange = () => refresh();
    const onFocus = () => sync();
    window.addEventListener("kriyava:account", onChange);
    window.addEventListener("storage", onChange);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("kriyava:account", onChange);
      window.removeEventListener("storage", onChange);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh, sync]);

  return { account, refresh, sync };
}
