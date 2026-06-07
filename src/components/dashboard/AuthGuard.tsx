"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, clearToken, getToken } from "@/lib/api";
import { createAccountCache, loadAccount, saveAccount } from "@/lib/account";
import { RefreshCw } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Always validate the token with the server before rendering protected content.
  // This prevents stale/expired tokens from briefly showing the dashboard.
  const [status, setStatus] = useState<"loading" | "ok" | "redirect">("loading");

  useEffect(() => {
    if (!getToken()) {
      setStatus("redirect");
      router.replace("/login");
      return;
    }
    api.me()
      .then((me) => {
        const cached = loadAccount();
        saveAccount(
          createAccountCache({
            ...cached,
            name: me.name,
            email: me.email,
            phone: me.phone || cached.phone,
            avatarUrl: cached.email === me.email ? cached.avatarUrl : undefined,
            balance: me.balance,
            spent: me.spent,
            apiKey: me.apiKey,
          }),
        );
        setStatus("ok");
      })
      .catch(() => {
        clearToken();
        localStorage.removeItem("kriyava_account_v1");
        setStatus("redirect");
        router.replace("/login");
      });
  }, [router]);

  if (status === "redirect") return null;
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#090D16] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-blue-500" size={28} />
          <span className="text-xs font-bold text-slate-400">Yükleniyor…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
