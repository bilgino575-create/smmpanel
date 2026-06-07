"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AuthGuard } from "./AuthGuard";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Layers,
  FileText,
  Search,
  Wallet,
  Code,
  Globe,
  Share2,
  Bell,
  Ticket,
  Settings,
  Menu,
  X,
  LogOut,
  RefreshCw,
  UserRound,
  Shield,
} from "lucide-react";
import { useAccount } from "@/lib/useAccount";
import { fmtINR } from "@/lib/account";
import { clearToken } from "@/lib/api";
import { KriyavaAiAgent } from "@/components/landing/KriyavaAiAgent";

const MENU_ITEMS = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/new-order", label: "Yeni Sipariş", icon: PlusCircle },
  { href: "/mass-order", label: "Toplu Sipariş", icon: Layers },
  { href: "/orders", label: "Siparişler", icon: FileText },
  { href: "/services", label: "Hizmetler", icon: Search },
  { href: "/add-funds", label: "Bakiye Yükle", icon: Wallet },
  { href: "/api-docs", label: "API Döküman", icon: Code },
  { href: "/child-panel", label: "Alt Paneller", icon: Globe },
  { href: "/affiliate", label: "Ortaklık", icon: Share2 },
  { href: "/updates", label: "Güncellemeler", icon: RefreshCw },
  { href: "/tickets", label: "Destek", icon: Ticket },
  { href: "/settings", label: "Ayarlar", icon: Settings },
];

const ADMIN_EMAIL = "getkriyava@gmail.com";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { account } = useAccount();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);

  const activeLink = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("kriyava_account_v1");
    router.push("/login");
  };

  const firstName = (account.name || "Kullanıcı").trim().split(/\s+/)[0] || "Kullanıcı";
  const initials = firstName.slice(0, 2).toUpperCase();
  const avatar = (size = "h-9 w-9") => (
    <div className={`${size} overflow-hidden rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md uppercase shrink-0`}>
      {account.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={account.avatarUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <UserRound size={18} />
      )}
    </div>
  );

  return (
    <AuthGuard>
    <div className="dashboard-shell h-screen bg-[#090D16] text-white flex flex-col md:flex-row overflow-hidden">

      {/* MOBİL ÜST BAR */}
      <div className="md:hidden flex h-16 items-center justify-between px-4 border-b border-white/5 bg-[#0D1321]/90 backdrop-blur-md sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="h-8 w-8 overflow-hidden rounded-lg bg-blue-600/20 p-1 flex items-center justify-center">
            <Image src="/assets/logo-128.png" alt="" width={24} height={24} />
          </span>
          <span className="font-display font-extrabold text-[17px] tracking-tight">Kriyava</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="text-right mr-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Cüzdan</div>
            <div className="text-xs font-black text-emerald-400 mt-0.5">{fmtINR(account.balance)}</div>
          </div>
          {avatar("h-9 w-9")}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5"
            aria-label="Kenar çubuğunu aç"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[45] bg-black/55 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Kenar çubuğu kaplamasını kapat"
        />
      )}

      {/* KENAR ÇUBUĞU */}
      <aside
        className={`fixed inset-y-0 left-0 w-[min(18rem,86vw)] bg-[#0D1321] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 md:w-64 md:translate-x-0 md:static md:h-screen md:shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="h-9 w-9 overflow-hidden rounded-[10px] bg-blue-600/10 p-1.5 flex items-center justify-center">
              <Image src="/assets/logo-128.png" alt="" width={28} height={28} />
            </span>
            <div className="flex flex-col">
              <span className="font-display font-black text-[18px] tracking-tight leading-none">Kriyava</span>
              <span className="text-[8.5px] font-extrabold text-blue-400 uppercase tracking-[0.18em] mt-0.5">SMM Panel</span>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* NAVİGASYON LİNKLERİ */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-5 space-y-1.5 scrollbar-thin">
          {MENU_ITEMS.map((item) => {
            const active = activeLink(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13.5px] font-bold transition-all ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_4px_15px_rgba(37,99,235,0.25)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <item.icon size={17} className={active ? "text-white" : "text-slate-400"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {/* Admin bağlantısı — sadece admin e-postası */}
          {account.email === ADMIN_EMAIL && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13.5px] font-bold transition-all mt-2 border border-amber-500/20 ${
                pathname.startsWith("/admin")
                  ? "bg-amber-600/20 text-amber-400"
                  : "text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/10"
              }`}
            >
              <Shield size={17} />
              <span>Admin CRM</span>
            </Link>
          )}
        </nav>

        <div className="shrink-0 border-t border-white/5 bg-white/[0.01] p-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              {avatar("h-9 w-9")}
              <div className="min-w-0">
                <div className="truncate text-xs font-bold text-white">{firstName}</div>
                <div className="text-[10px] font-medium text-slate-400">tekrar hoş geldiniz</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/5 bg-white/[0.02] text-slate-300 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
              title="Çıkış Yap"
              aria-label="Çıkış Yap"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ANA İÇERİK ALANI */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* ÜST BAR */}
        <header className="hidden md:flex h-16 shrink-0 items-center justify-between px-8 border-b border-white/5 bg-[#090D16]/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-400">
              {pathname === "/dashboard"
                ? "Genel Bakış"
                : MENU_ITEMS.find((m) => pathname.startsWith(m.href))?.label || "Uygulama"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Cüzdan özeti */}
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <Wallet size={14} />
                </span>
                <div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Bakiye</div>
                  <div className="text-[13px] font-black text-emerald-400 mt-0.5">{fmtINR(account.balance)}</div>
                </div>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <Link href="/add-funds" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                + Yükle
              </Link>
            </div>

            {/* Bildirim Merkezi */}
            <div className="relative">
              <button
                onClick={() => setNotifsOpen((v) => !v)}
                className="relative h-9 w-9 grid place-items-center rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] text-slate-300 hover:text-white"
                aria-label="Bildirimleri aç"
              >
                <Bell size={16} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </button>
              {notifsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-white/10 bg-[#0D1321] p-3.5 shadow-2xl z-50">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                    <b className="text-xs">Bildirimler</b>
                    <span className="text-[10px] text-blue-400 font-bold cursor-pointer" onClick={() => setNotifsOpen(false)}>Kapat</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="text-xs">
                      <div className="font-semibold text-white">Cüzdan ödemeleri etkin</div>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">Razorpay yüklemeleri yalnızca arka uç doğrulamasından sonra cüzdanınıza yansır.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Kullanıcı Profili */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold leading-none">{firstName}</div>
                <div className="text-[10px] text-blue-400 font-bold mt-1">İçerik Üretici</div>
              </div>
              {avatar()}
            </div>
          </div>
        </header>

        {/* KAYDIRILABİLİR ANA İÇERİK */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 scrollbar-thin">
          {children}
        </main>
      </div>

      <KriyavaAiAgent />
    </div>
    </AuthGuard>
  );
}
