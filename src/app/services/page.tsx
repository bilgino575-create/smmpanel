"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Star, RefreshCw, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useAccount } from "@/lib/useAccount";
import { useMarket } from "@/lib/useServices";
import { fmtINR, saveAccount } from "@/lib/account";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { account, refresh } = useAccount();
  const { services, loading } = useMarket();

  const [platform, setPlatform] = useState("Tümü");
  const [category, setCategory] = useState("Tümü");
  const [country, setCountry] = useState("Tümü");
  const [maxPrice, setMaxPrice] = useState(500);
  const [minQuality, setMinQuality] = useState(1);
  const [refillOnly, setRefillOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [platformsList, setPlatformsList] = useState<string[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [countriesList, setCountriesList] = useState<string[]>([]);

  const isLoggedIn = !!account?.email;

  useEffect(() => {
    if (services.length > 0) {
      setPlatformsList(Array.from(new Set(services.map((s) => s.platform))).sort());
      setCategoriesList(Array.from(new Set(services.map((s) => s.category))).sort());
      setCountriesList(Array.from(new Set(services.map((s) => s.country))).sort());
    }
  }, [services]);

  useEffect(() => {
    const p = searchParams.get("platform");
    if (p) setPlatform(p);
  }, [searchParams]);

  const handleFavoriteToggle = (id: string) => {
    const a = { ...account };
    a.favorites = a.favorites || [];
    if (!a.favorites.includes(id)) {
      a.favorites.push(id);
      showToast("⭐ Favorilere eklendi");
    } else {
      a.favorites = a.favorites.filter((x) => x !== id);
      showToast("⭐ Favorilerden kaldırıldı");
    }
    saveAccount(a);
    refresh();
  };

  const handleReset = () => {
    setPlatform("Tümü");
    setCategory("Tümü");
    setCountry("Tümü");
    setMaxPrice(500);
    setMinQuality(1);
    setRefillOnly(false);
    setSearch("");
    setFavoritesOnly(false);
    setSortBy("price-asc");
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const filtered = services.filter((s) => {
    if (platform !== "Tümü" && s.platform !== platform) return false;
    if (category !== "Tümü" && s.category !== category) return false;
    if (country !== "Tümü" && s.country !== country) return false;
    if (s.price > maxPrice) return false;
    if (s.quality < minQuality) return false;
    if (refillOnly && s.refill.toLowerCase() === "no refill") return false;
    if (favoritesOnly && !account.favorites?.includes(s.id)) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.platform.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = filtered.sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "quality-desc") return b.quality - a.quality || a.price - b.price;
    if (sortBy === "margin-desc") return b.margin_pct - a.margin_pct;
    return 0;
  });

  const FilterBtn = ({ value, current, label, onClick }: { value: string; current: string; label?: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
        current === value
          ? "bg-blue-600 border-blue-600 text-white"
          : isLoggedIn
            ? "bg-white/[0.01] border-white/5 text-slate-400 hover:text-white"
            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {label || value}
    </button>
  );

  const coreContent = (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="text-left">
          <h1 className={`font-display text-2xl md:text-3xl font-black ${isLoggedIn ? "text-white" : "text-slate-900"}`}>
            Hizmet Kataloğu
          </h1>
          <p className={`text-sm mt-1 ${isLoggedIn ? "text-slate-400" : "text-slate-500"}`}>
            Kriyava'nın toptan kataloğunu keşfedin. Gerçek pingler, doğrudan marjlar ve kalite onaylı paketler.
          </p>
        </div>
        <div className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border shrink-0 ${
          isLoggedIn
            ? "text-blue-400 bg-blue-500/10 border-white/5"
            : "text-blue-600 bg-blue-50 border-blue-100"
        }`}>
          <RefreshCw size={12} className={loading ? "animate-spin text-blue-500" : "text-blue-500"} />
          <span>{services.length.toLocaleString("tr-TR")} Hizmet Canlı</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
        <aside className={`rounded-2xl border p-5 backdrop-blur-md text-left space-y-6 shrink-0 ${
          isLoggedIn ? "border-white/5 bg-[#0D1321]/50 text-white" : "border-slate-200/60 bg-white text-slate-800 shadow-sm"
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isLoggedIn ? "border-white/5" : "border-slate-100"}`}>
            <h3 className={`text-xs font-black uppercase tracking-wider ${isLoggedIn ? "text-slate-400" : "text-slate-500"}`}>Filtreler</h3>
            <button onClick={handleReset} className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer">
              Sıfırla
            </button>
          </div>

          <button
            onClick={() => setFavoritesOnly((v) => !v)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              favoritesOnly
                ? "border-amber-500/25 bg-amber-500/10 text-amber-500"
                : isLoggedIn
                  ? "border-white/5 bg-white/[0.01] text-slate-400 hover:text-white"
                  : "border-slate-200 bg-slate-50/50 text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Star size={13} className={favoritesOnly ? "fill-amber-400 text-amber-500" : ""} />
              Sadece Favoriler
            </span>
            <span>{account.favorites?.length || 0}</span>
          </button>

          <div className="flex flex-col">
            <label className={`text-[10px] font-extrabold uppercase tracking-wide mb-2 ${isLoggedIn ? "text-slate-500" : "text-slate-400"}`}>Platform</label>
            <div className="flex flex-wrap gap-1.5">
              <FilterBtn value="Tümü" current={platform} label="Tümü" onClick={() => setPlatform("Tümü")} />
              {platformsList.map((p) => (
                <FilterBtn key={p} value={p} current={platform} onClick={() => setPlatform(p)} />
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label className={`text-[10px] font-extrabold uppercase tracking-wide mb-2 ${isLoggedIn ? "text-slate-500" : "text-slate-400"}`}>Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full rounded-xl border p-2.5 text-xs outline-none focus:border-blue-500 cursor-pointer font-bold ${
                isLoggedIn ? "border-white/5 bg-white/[0.01] text-white" : "border-slate-200 bg-slate-50/50 text-slate-800"
              }`}
            >
              <option value="Tümü" className={isLoggedIn ? "bg-[#090D16]" : "bg-white text-slate-800"}>Tüm Kategoriler</option>
              {categoriesList.map((c) => (
                <option key={c} value={c} className={isLoggedIn ? "bg-[#090D16]" : "bg-white text-slate-800"}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className={`text-[10px] font-extrabold uppercase tracking-wide mb-2 ${isLoggedIn ? "text-slate-500" : "text-slate-400"}`}>Hedef Bölge</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={`w-full rounded-xl border p-2.5 text-xs outline-none focus:border-blue-500 cursor-pointer font-bold ${
                isLoggedIn ? "border-white/5 bg-white/[0.01] text-white" : "border-slate-200 bg-slate-50/50 text-slate-800"
              }`}
            >
              <option value="Tümü" className={isLoggedIn ? "bg-[#090D16]" : "bg-white text-slate-800"}>Tüm Bölgeler</option>
              {countriesList.map((c) => (
                <option key={c} value={c} className={isLoggedIn ? "bg-[#090D16]" : "bg-white text-slate-800"}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-2">
              <span>Maks. Fiyat</span>
              <span className={`font-bold ${isLoggedIn ? "text-white" : "text-slate-900"}`}>
                {maxPrice >= 500 ? "Her Fiyat" : `≤ ${fmtINR(maxPrice)}`}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-200 dark:bg-white/5 rounded-lg"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-2">
              <span>Min. Kalite Düzeyi</span>
              <span className={`font-bold ${isLoggedIn ? "text-white" : "text-slate-900"}`}>{minQuality}+ Yıldız</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={minQuality}
              onChange={(e) => setMinQuality(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-200 dark:bg-white/5 rounded-lg"
            />
          </div>

          <button
            onClick={() => setRefillOnly((r) => !r)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              refillOnly
                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-500"
                : isLoggedIn
                  ? "border-white/5 bg-white/[0.01] text-slate-400 hover:text-white"
                  : "border-slate-200 bg-slate-50/50 text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Sadece Yeniden Dolum Garantili</span>
            <span className={`h-2.5 w-2.5 rounded-full ${refillOnly ? "bg-emerald-500" : "bg-slate-200 dark:bg-white/10"}`} />
          </button>
        </aside>

        <div className="space-y-5 text-left">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Hizmet kataloğunda ara (örn. takipçi, beğeni, yüksek kalıcılık)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 pl-10 text-xs placeholder-slate-400 outline-none focus:border-blue-500 transition-all font-bold ${
                  isLoggedIn
                    ? "border-white/5 bg-white/[0.01] text-white"
                    : "border-slate-200 bg-white text-slate-800 shadow-sm"
                }`}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`rounded-xl border px-4 py-3 text-xs font-bold outline-none focus:border-blue-500 cursor-pointer ${
                isLoggedIn
                  ? "border-white/5 bg-[#090D16] text-slate-400"
                  : "border-slate-200 bg-white text-slate-700 shadow-sm"
              }`}
            >
              <option value="price-asc">Sırala: Fiyat Düşük → Yüksek</option>
              <option value="price-desc">Sırala: Fiyat Yüksek → Düşük</option>
              <option value="quality-desc">Sırala: En İyi Puanlı</option>
              <option value="margin-desc">Sırala: En Yüksek Kâr Marjı</option>
            </select>
          </div>

          <div className={`text-xs font-bold ${isLoggedIn ? "text-slate-400" : "text-slate-500"}`}>
            {sorted.length} hizmet bulundu
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`h-64 rounded-2xl border animate-pulse ${
                  isLoggedIn ? "border-white/5 bg-white/[0.01]" : "border-slate-200 bg-slate-100"
                }`} />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className={`py-12 border rounded-2xl text-center text-xs font-semibold ${
              isLoggedIn ? "border-white/5 bg-white/[0.01] text-slate-500" : "border-slate-200 bg-white text-slate-500 shadow-sm"
            }`}>
              Filtrelerinize uyan SMM hizmeti bulunamadı. Filtreleri sıfırlamayı deneyin.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.map((s, index) => {
                const hasRefill = s.refill.toLowerCase() !== "no refill";
                const isFavorite = account?.favorites?.includes(s.id);
                return (
                  <article
                    key={`${s.id}-${index}`}
                    className={`rounded-2xl border p-5 text-left flex flex-col hover:border-blue-500/25 transition-all relative overflow-hidden group ${
                      isLoggedIn
                        ? "border-white/5 bg-[#0D1321]/50 text-white backdrop-blur-md"
                        : "border-slate-200 bg-white text-slate-900 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      <span className="text-[9.5px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase border border-blue-100">{s.platform}</span>
                      <span className="text-[9.5px] font-black text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded uppercase border border-cyan-100">{s.category}</span>
                      {s.country !== "Global" && (
                        <span className="text-[9.5px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase border border-purple-100">📍 {s.country}</span>
                      )}
                      <button onClick={() => handleFavoriteToggle(s.id)} className="ml-auto text-slate-400 hover:text-amber-500 transition-colors cursor-pointer" aria-label={isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"}>
                        <Star size={14} className={isFavorite ? "fill-amber-400 text-amber-500 border-amber-500" : ""} />
                      </button>
                    </div>

                    <h3 className={`text-xs font-bold leading-snug group-hover:text-blue-600 transition-colors line-clamp-3 min-h-[50px] mb-3.5 ${isLoggedIn ? "text-white group-hover:text-blue-400" : "text-slate-900"}`}>{s.name}</h3>

                    <div className={`flex items-baseline justify-between mb-4 border-t pt-3 ${isLoggedIn ? "border-white/5" : "border-slate-100"}`}>
                      <div>
                        <span className={`text-2xl font-black ${isLoggedIn ? "text-blue-400" : "text-blue-600"}`}>{fmtINR(s.price)}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider ml-1">/ 1K</span>
                      </div>
                      <span className="text-[9.5px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">+{s.margin_pct}% marj</span>
                    </div>

                    <div className={`space-y-1.5 text-[11px] border-t pt-3.5 mb-4 font-bold ${isLoggedIn ? "border-white/5 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                      <div className="flex justify-between"><span>Hız:</span><span className={isLoggedIn ? "text-white" : "text-slate-800"}>{s.speed}</span></div>
                      <div className="flex justify-between"><span>Yeniden Dolum:</span><span className={hasRefill ? "text-emerald-500 font-bold" : isLoggedIn ? "text-white" : "text-slate-800"}>{s.refill}</span></div>
                      <div className="flex justify-between"><span>Kalite Düzeyi:</span><span className="text-amber-500 font-black">{Array.from({ length: 5 }).map((_, i) => (<span key={i}>{i < s.quality ? "★" : "☆"}</span>))}</span></div>
                      <div className="flex justify-between"><span>Min / Maks limit:</span><span className={isLoggedIn ? "text-white" : "text-slate-800"}>{(s.min || 10).toLocaleString()} / {s.max ? s.max.toLocaleString() : "∞"}</span></div>
                    </div>

                    {isLoggedIn ? (
                      <Link href={`/new-order?platform=${s.platform}`} className="btn btn-primary btn-block !py-2.5 !text-xs mt-auto flex items-center justify-center gap-1.5">
                        <ShoppingCart size={13} />
                        <span>Hemen Sipariş Ver</span>
                      </Link>
                    ) : (
                      <Link href={`/login?redirect=/new-order?platform=${s.platform}`} className="btn btn-cta btn-block !py-2.5 !text-xs mt-auto flex items-center justify-center gap-1.5 shadow-sm">
                        <ShoppingCart size={13} />
                        <span>Sipariş için Giriş Yap</span>
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isLoggedIn) {
    return <DashboardShell>{coreContent}</DashboardShell>;
  }

  return (
    <>
      <SiteNav />
      <main className="bg-slate-50 min-h-screen py-12 text-slate-800">
        <div className="container-x">{coreContent}</div>
      </main>
      <SiteFooter />
    </>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-3 min-h-screen bg-slate-50">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
        <span className="text-xs font-bold text-slate-400">Katalog yükleniyor...</span>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}
