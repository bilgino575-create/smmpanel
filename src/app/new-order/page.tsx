"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronDown, Star, Search, X } from "lucide-react";
import { useAccount } from "@/lib/useAccount";
import { useMarket } from "@/lib/useServices";
import { fmtINR, saveAccount } from "@/lib/account";
import { api } from "@/lib/api";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SocialIcon, platformIconFor } from "@/components/SocialIcon";
import type { MarketService } from "@/lib/types";

// Short numeric ID from "easy:641" → "641"
function shortId(id: string) { return id.split(":").pop() || id; }
// Badge color by provider
function badgeColor(id: string) {
  if (id.startsWith("easy:")) return "bg-blue-600 text-white";
  if (id.startsWith("luv:"))  return "bg-rose-600 text-white";
  if (id.startsWith("fine:")) return "bg-emerald-600 text-white";
  return "bg-slate-600 text-white";
}

export default function NewOrderPage() {
  const { account, refresh, sync } = useAccount();
  const { services, loading } = useMarket();

  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [qtyStr, setQtyStr] = useState("1000");
  const qty = Math.max(1, parseInt(qtyStr.replace(/\D/g, ""), 10) || 1);
  const [link, setLink] = useState("");
  const [routeMsg, setRouteMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [placing, setPlacing] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // ── Derived ─────────────────────────────────────────────────────────────
  const platforms = useMemo(() => Array.from(new Set(services.map((s) => s.platform))).sort(), [services]);

  const platformServices = useMemo(
    () => services.filter((s) => s.platform === selectedPlatform).sort((a, b) => a.price - b.price),
    [services, selectedPlatform],
  );

  const categories = useMemo(
    () => Array.from(new Set(platformServices.map((s) => s.category))).sort(),
    [platformServices],
  );

  // Global search results (cross-platform, by name or service code)
  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return null;
    return services.filter((s) =>
      s.name.toLowerCase().includes(q) || shortId(s.id).includes(q)
    ).slice(0, 30);
  }, [services, globalSearch]);

  // Category services (used when no global search)
  const categoryServices = useMemo(() => {
    if (globalSearch.trim()) return [];
    return (selectedCategory ? platformServices.filter((s) => s.category === selectedCategory) : platformServices);
  }, [platformServices, selectedCategory, globalSearch]);

  const displayServices = searchResults ?? categoryServices;

  const activeService = useMemo(
    () => services.find((s) => s.id === selectedServiceId),
    [services, selectedServiceId],
  );

  const charge = useMemo(
    () => (activeService ? +((activeService.price * qty) / 1000).toFixed(2) : 0),
    [activeService, qty],
  );

  // Resets
  useEffect(() => { setSelectedCategory(""); setSelectedServiceId(""); }, [selectedPlatform]);
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) setSelectedCategory(categories[0]);
  }, [categories, selectedCategory]);
  useEffect(() => {
    if (categoryServices.length > 0 && !globalSearch) setSelectedServiceId(categoryServices[0].id);
  }, [selectedCategory]);

  // Auto-select first search result
  useEffect(() => {
    if (searchResults && searchResults.length > 0) setSelectedServiceId(searchResults[0].id);
  }, [globalSearch]);

  // Scroll selected into view
  useEffect(() => {
    if (!selectedServiceId || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-id="${CSS.escape(selectedServiceId)}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedServiceId]);

  const handlePlaceOrder = async () => {
    if (!activeService || !link.trim()) { showToast("❌ Hedef bağlantınızı yapıştırın!"); return; }
    if (qty < (activeService.min || 10)) { showToast(`❌ Minimum ${(activeService.min || 10).toLocaleString()}`); return; }
    if (account.balance < charge) { showToast(`❌ ${fmtINR(charge)} gerekiyor — bakiye yükleyin`); return; }
    setPlacing(true);
    try {
      const order = await api.createOrder(activeService.id, qty, link);
      setRouteMsg(`✅ ${order.provider} üzerinden yönlendirildi — #${order.id.slice(-8)}`);
      await sync();
      showToast(`✅ Sipariş verildi! ${fmtINR(charge)} düşüldü.`);
      setLink("");
    } catch (err) { showToast(err instanceof Error ? err.message : "Sipariş başarısız oldu."); }
    finally { setPlacing(false); }
  };

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  return (
    <DashboardShell>
      {account.balance < 50 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs font-bold text-amber-400">
          <AlertTriangle size={13} className="shrink-0" />
          Bakiye düşük ({fmtINR(account.balance)}). <Link href="/add-funds" className="underline ml-1">Bakiye yükle →</Link>
        </div>
      )}

      <div className="mb-5">
        <h1 className="font-display text-2xl md:text-3xl font-black text-white">Yeni Sipariş</h1>
        <p className="text-sm text-slate-400 mt-1">Hizmet ara veya keşfet, bağlantını yapıştır ve büyümeye başla.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        {/* ── SOL ────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 space-y-5">

          {/* ── ARAMA (üstte — isme veya hizmet koduna göre) ── */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">
              İsme veya hizmet koduna göre ara
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="örn. Instagram takipçi, 641, izlenme…"
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 pl-9 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500" />
              {globalSearch && (
                <button onClick={() => setGlobalSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>
            {globalSearch && (
              <p className="text-[10px] text-slate-500 mt-1 font-bold">
                Tüm platformlarda {searchResults?.length ?? 0} sonuç
              </p>
            )}
          </div>

          {/* Show platform/category only when not searching */}
          {!globalSearch && (
            <>
              {/* ── ADIM 1 — Platform ── */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">1 · Platform</label>
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                  {platforms.map((p) => (
                    <button key={p} onClick={() => setSelectedPlatform(p)}
                      className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedPlatform === p
                          ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,.3)]"
                          : "bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white"
                      }`}>
                      <SocialIcon platform={p} size={16} />
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── ADIM 2 — Kategori ── */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">2 · Kategori</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    {platformIconFor(selectedCategory + " " + selectedPlatform)}
                  </div>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#090D16] px-4 py-3 pl-9 text-sm text-white outline-none focus:border-blue-500 appearance-none cursor-pointer">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#090D16]">{cat}</option>
                    ))}
                    {categories.length === 0 && <option>Kategori yok — bir platform seçin</option>}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </>
          )}

          {/* ── ADIM 3 (veya arama sonuçları) — Hizmet listesi ── */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">
              {globalSearch ? "Arama Sonuçları" : "3 · Hizmet"} ({displayServices.length})
            </label>
            <div ref={listRef} className="rounded-xl border border-white/10 bg-[#090D16] overflow-y-auto" style={{ maxHeight: 280 }}>
              {loading && <div className="py-6 text-center text-slate-500 text-xs">Hizmetler yükleniyor…</div>}
              {!loading && displayServices.length === 0 && (
                <div className="py-6 text-center text-slate-500 text-xs">
                  {globalSearch ? "Aramanızla eşleşen hizmet yok" : "Bu kategoride hizmet yok"}
                </div>
              )}
              {displayServices.map((s: MarketService) => {
                const active = s.id === selectedServiceId;
                return (
                  <button key={s.id} data-id={s.id} type="button"
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`w-full flex items-start gap-2.5 px-3.5 py-2.5 text-left transition-colors border-b border-white/[0.04] last:border-0 ${
                      active ? "bg-blue-600/15 border-l-2 border-l-blue-500" : "hover:bg-white/[0.03]"
                    }`}>
                    <span className={`shrink-0 mt-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-black font-mono ${badgeColor(s.id)}`}>
                      {shortId(s.id)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[11px] font-bold leading-snug ${active ? "text-white" : "text-slate-200"}`}>{s.name}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                        {globalSearch && <span className="text-slate-600">{s.platform} ·</span>}
                        <span className="text-emerald-400 font-black">{fmtINR(s.price)}/1K</span>
                        <span>· {s.speed}</span>
                        {s.refill === "Refill available" && <span className="text-blue-400">· ♻</span>}
                      </div>
                    </div>
                    <span className="shrink-0 text-[9px] font-black text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded mt-0.5">
                      +{s.margin_pct}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aktif hizmet detayı */}
          {activeService && (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Hizmet Bilgisi</span>
                <div className="flex">{Array.from({length:5}).map((_,i)=><Star key={i} size={10} className={i<activeService.quality?"text-amber-400 fill-amber-400":"text-slate-700"}/>)}</div>
              </div>
              {activeService.description && (
                <p className="text-[11px] text-slate-300 leading-relaxed bg-blue-500/5 border border-blue-500/10 rounded-lg px-3 py-2">
                  {activeService.description}
                </p>
              )}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                {[["Hız",activeService.speed],["Yeniden Dolum",activeService.refill],["Min",`${(activeService.min||1).toLocaleString()}`],["Maks",activeService.max?activeService.max.toLocaleString():"∞"],["Oran/1K",fmtINR(activeService.price)],["Marj",`${activeService.margin_pct}%`]].map(([l,v])=>(
                  <div key={l} className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-500 font-bold">{l}</span>
                    <span className="text-white font-bold">{v}</span>
                  </div>
                ))}
              </div>
              {routeMsg && <p className="text-[10px] font-mono text-blue-400 bg-blue-500/5 rounded-lg px-3 py-1.5">{routeMsg}</p>}
            </div>
          )}

          {/* Bağlantı */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">Hedef Bağlantı / Kullanıcı Adı</label>
            <input type="text" value={link} onChange={(e) => setLink(e.target.value)}
              placeholder="https://instagram.com/profiliniz"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500" />
          </div>

          {/* Miktar */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">
              Miktar
              {activeService && <span className="text-slate-600 ml-1 normal-case font-medium">(min {(activeService.min||1).toLocaleString()} · maks {activeService.max?activeService.max.toLocaleString():"∞"})</span>}
            </label>
            <input type="text" inputMode="numeric" value={qtyStr}
              onChange={(e) => setQtyStr(e.target.value.replace(/\D/g, ""))}
              onFocus={(e) => e.target.select()}
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm text-white outline-none focus:border-blue-500" />
          </div>

          <button onClick={() => {
            if(!activeService)return;
            const a={...account};a.favorites=a.favorites||[];
            if(!a.favorites.includes(activeService.id)){a.favorites.push(activeService.id);saveAccount(a);refresh();showToast("⭐ Favorilere eklendi");}
            else showToast("Zaten favorilerde");
          }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-400 transition-colors">
            <Star size={11}/> Favorilere kaydet
          </button>

          <div className="flex gap-2.5 rounded-xl border border-amber-500/10 bg-amber-500/5 p-3.5 text-[11px] text-amber-400/80">
            <AlertTriangle size={13} className="shrink-0 mt-0.5"/>
            İlk sipariş işlenirken aynı bağlantıya tekrar sipariş vermeyin.
          </div>
        </div>

        {/* ── SAĞ: ÖZET ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 sticky top-6 space-y-4">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-white/5 pb-4">Sipariş Özeti</h3>

          {activeService ? (
            <>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1.5">
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Seçilen Hizmet</p>
                <div className="flex items-start gap-2">
                  <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-black font-mono ${badgeColor(activeService.id)}`}>
                    {shortId(activeService.id)}
                  </span>
                  <p className="text-white font-bold text-[11px] leading-snug">{activeService.name}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  {l:"Platform",v:<span className="flex items-center gap-1"><SocialIcon platform={activeService.platform} size={13}/>{activeService.platform}</span>},
                  {l:"Oran / 1K",v:<span className="text-emerald-400 font-black">{fmtINR(activeService.price)}</span>},
                  {l:"Miktar",v:qty.toLocaleString()},
                  {l:"Marjınız",v:`${activeService.margin_pct}%`},
                ].map((r)=>(
                  <div key={r.l} className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400 font-bold">{r.l}</span>
                    <span className="text-white font-bold">{r.v}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-slate-500 text-xs py-4">Hizmet arayın veya seçin.</p>
          )}

          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <span className="text-slate-400 text-sm font-bold">Toplam Ücret</span>
            <span className="text-2xl font-black text-blue-400">{fmtINR(charge)}</span>
          </div>

          <button onClick={() => void handlePlaceOrder()}
            disabled={loading || !activeService || placing || !link.trim()}
            className="btn btn-cta btn-block btn-lg disabled:opacity-50">
            {placing ? "Veriliyor…" : "Sipariş Ver"}
          </button>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Cüzdan Bakiyesi</span>
            <span className={account.balance < charge ? "text-rose-400 font-black" : "text-emerald-400 font-black"}>
              {fmtINR(account.balance)}
            </span>
          </div>
          <Link href="/add-funds" className="btn btn-ghost btn-block !text-xs !py-2.5">+ Cüzdan Yükle</Link>
        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:w-80 z-55 rounded-xl border border-white/10 bg-[#0D1321]/95 px-4 py-3 shadow-2xl flex items-center gap-2.5 text-xs font-black border-l-4 border-l-emerald-500">
          <CheckCircle2 size={14} className="text-emerald-400 shrink-0"/>
          <span>{toastMsg}</span>
        </div>
      )}
    </DashboardShell>
  );
}
