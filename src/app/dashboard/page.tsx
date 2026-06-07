"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Wallet,
  Zap,
  Activity,
} from "lucide-react";
import { useAccount } from "@/lib/useAccount";
import { useMarket } from "@/lib/useServices";
import { fmtINR } from "@/lib/account";
import { api } from "@/lib/api";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

// Static categories configuration
const POPULAR_CATEGORIES = [
  { platform: "Instagram", icon: "📸", color: "from-pink-600 to-rose-500" },
  { platform: "YouTube", icon: "🎥", color: "from-red-600 to-rose-600" },
  { platform: "TikTok", icon: "🎵", color: "from-purple-600 to-indigo-500" },
  { platform: "Telegram", icon: "✈️", color: "from-cyan-500 to-blue-500" },
  { platform: "Spotify", icon: "🎧", color: "from-emerald-500 to-teal-500" },
  { platform: "Web Site", icon: "🌐", color: "from-amber-500 to-orange-500" },
];

export default function DashboardPage() {
  const { account, sync } = useAccount();
  const { services, loading: marketLoading } = useMarket();
  const [chartDays, setChartDays] = useState<14 | 30 | 90>(14);
  const [toastMsg, setToastMsg] = useState("");

  // Quick Order State
  const [qoServiceId, setQoServiceId] = useState("");
  const [qoLink, setQoLink] = useState("");
  const [qoQty, setQoQty] = useState(1000);
  const [qoCharge, setQoCharge] = useState(0);

  const quickPicks = services
    .slice()
    .sort((a, b) => b.quality - a.quality || a.price - b.price)
    .slice(0, 20);

  useEffect(() => {
    if (quickPicks.length > 0 && !qoServiceId) {
      setQoServiceId(quickPicks[0].id);
    }
  }, [services, quickPicks, qoServiceId]);

  useEffect(() => {
    const svc = services.find((s) => s.id === qoServiceId);
    if (svc) {
      const charge = +((svc.price * qoQty) / 1000).toFixed(2);
      setQoCharge(charge);
    }
  }, [qoServiceId, qoQty, services]);

  const handleQuickOrder = async () => {
    const svc = services.find((s) => s.id === qoServiceId);
    if (!svc) return;
    if (!qoLink.trim()) {
      showToast("Hedef bağlantınızı yapıştırın.");
      return;
    }

    if (account.balance < qoCharge) {
      showToast("❌ Yetersiz bakiye — bakiye yükleyin!");
      return;
    }

    const qty = Math.max(svc.min || 10, qoQty);
    try {
      await api.createOrder(svc.id, qty, qoLink);
      await sync();
      showToast(`✅ Sipariş verildi: ${fmtINR(qoCharge)}`);
      setQoLink("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Sipariş başarısız oldu.");
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const getPlatformCounts = () => {
    const counts: Record<string, number> = { Instagram: 0, YouTube: 0, Telegram: 0, TikTok: 0, Diğer: 0 };
    if (account.orders.length > 0) {
      account.orders.forEach((o) => {
        const title = o.service.toLowerCase();
        if (title.includes("instagram")) counts.Instagram++;
        else if (title.includes("youtube")) counts.YouTube++;
        else if (title.includes("telegram")) counts.Telegram++;
        else if (title.includes("tiktok")) counts.TikTok++;
        else counts.Diğer++;
      });
    }
    return counts;
  };

  const platformCounts = getPlatformCounts();
  const totalChartOrders = Object.values(platformCounts).reduce((s, c) => s + c, 0);

  const getDonutSegments = () => {
    const colors: Record<string, string> = {
      Instagram: "#f43f5e",
      YouTube: "#ef4444",
      Telegram: "#06B6D4",
      TikTok: "#7C3AED",
      Diğer: "#64748B",
    };

    let accumPct = 0;
    return Object.keys(platformCounts).map((key) => {
      const count = platformCounts[key];
      const pct = totalChartOrders > 0 ? (count / totalChartOrders) * 100 : 0;
      const strokeOffset = 100 - accumPct + 25;
      accumPct += pct;
      return {
        key,
        count,
        pct: Math.round(pct),
        color: colors[key],
        offset: strokeOffset,
        dash: `${pct} ${100 - pct}`,
      };
    });
  };

  const donutSegments = getDonutSegments();

  const getSVGChartPaths = () => {
    const dataPoints = chartDays === 14 ? 14 : chartDays === 30 ? 20 : 25;
    const spendPoints = Array.from({ length: dataPoints }, () => 0);
    const orderPoints = Array.from({ length: dataPoints }, () => 0);
    const dayMs = 24 * 60 * 60 * 1000;
    const start = Date.now() - (dataPoints - 1) * dayMs;

    account.orders.forEach((order) => {
      const idx = Math.floor((order.at - start) / dayMs);
      if (idx >= 0 && idx < dataPoints && order.status !== "Canceled") {
        spendPoints[idx] += order.charge;
        orderPoints[idx] += 1;
      }
    });

    const W = 600;
    const H = 180;
    const pad = 15;

    const maxSpend = Math.max(...spendPoints, 1) * 1.1;
    const maxOrder = Math.max(...orderPoints, 1) * 1.2;

    const getPathString = (arr: number[], max: number) => {
      return arr
        .map((v, i) => {
          const x = pad + (i * (W - 2 * pad)) / (arr.length - 1);
          const y = H - pad - (v / max) * (H - 2 * pad);
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
    };

    const spendLine = getPathString(spendPoints, maxSpend);
    const orderLine = getPathString(orderPoints, maxOrder);
    const areaPath = `${spendLine} L${W - pad},${H - pad} L${pad},${H - pad} Z`;

    return { spendLine, orderLine, areaPath };
  };

  const { spendLine, orderLine, areaPath } = getSVGChartPaths();

  const completedCount = account.orders.filter((o) => o.status === "Completed").length;
  const pendingCount = account.orders.filter((o) => o.status !== "Completed").length;

  return (
    <DashboardShell>
      {/* DÜŞÜK BAKİYE UYARISI */}
      {account.balance < 50 && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs font-bold text-amber-400">
          <Activity size={14} className="shrink-0" />
          <span>Cüzdan bakiyesi düşük — {fmtINR(account.balance)}. <Link href="/add-funds" className="underline underline-offset-2 hover:text-amber-300">Hemen yükle →</Link></span>
        </div>
      )}

      {/* KARŞILAMA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="text-left">
          <h1 className="font-display text-2xl md:text-3xl font-black text-white">
            Tekrar hoş geldin, {account.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">Bugünkü büyüme durumun burada.</p>
        </div>
        <Link
          href="/new-order"
          className="btn btn-primary !px-5 !py-3 !text-sm flex items-center gap-2"
        >
          <Zap size={15} />
          <span>Yeni Sipariş</span>
        </Link>
      </div>

      {/* İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            label: "Toplam Sipariş",
            value: account.orders.length,
            icon: LayoutDashboard,
            color: "text-blue-400 bg-blue-500/10",
            pct: "Canlı",
            pctSub: "hesabınızdan",
          },
          {
            label: "Tamamlanan",
            value: completedCount,
            icon: CheckCircle2,
            color: "text-emerald-400 bg-emerald-500/10",
            pct: String(completedCount),
            pctSub: "teslim edildi",
          },
          {
            label: "Bekleyen",
            value: pendingCount,
            icon: Clock,
            color: "text-amber-400 bg-amber-500/10",
            pct: String(pendingCount),
            pctSub: "işleniyor",
          },
          {
            label: "Cüzdan Bakiyesi",
            value: fmtINR(account.balance),
            icon: Wallet,
            color: "text-purple-400 bg-purple-500/10",
            pct: "Doğrulandı",
            pctSub: "Razorpay yüklemeleri",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 relative overflow-hidden backdrop-blur-md"
            style={{
              backgroundImage: "linear-gradient(160deg, rgba(37,99,235,0.03) 0%, transparent 60%)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">{stat.label}</span>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${stat.color}`}>
                <stat.icon size={18} />
              </span>
            </div>
            <div className="font-display text-2xl font-black text-white">{stat.value}</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-2.5">
              <span>{stat.pct}</span>
              <span className="text-slate-400 font-medium">{stat.pctSub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* GRAFİK SATIRI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Harcama SVG grafiği */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 backdrop-blur-md flex flex-col text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Harcama & Siparişler</h3>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider mt-0.5 block">TREND ANALİZİ</span>
            </div>
            <div className="flex rounded-lg border border-white/5 bg-white/[0.02] p-1 text-[11px] font-bold">
              {([14, 30, 90] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setChartDays(d)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    chartDays === d ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {d}G
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-[180px] w-full">
            <svg viewBox="0 0 600 180" width="100%" height="100%" preserveAspectRatio="none" className="overflow-visible">
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#spendGrad)" />
              <path d={spendLine} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d={orderLine} fill="none" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-center gap-5 mt-4 pt-3 border-t border-white/5 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-2">
              <span className="h-2 w-4 rounded bg-blue-600 inline-block" />
              Harcama (₹)
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-4 border-t-2 border-dashed border-cyan-400 inline-block" />
              Sipariş sayısı
            </span>
          </div>
        </div>

        {/* Donut Analitiği */}
        <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 backdrop-blur-md flex flex-col text-left">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Sipariş Analitiği</h3>
          <div className="flex items-center justify-between gap-6 my-auto">
            <div className="relative h-32 w-32 shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 42 42" className="transform -rotate-90">
                {donutSegments.map((seg, idx) => (
                  <circle
                    key={idx}
                    cx="21"
                    cy="21"
                    r="15.91549"
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth="5.5"
                    strokeDasharray={seg.dash}
                    strokeDashoffset={seg.offset}
                  />
                ))}
                <circle cx="21" cy="21" r="11.5" fill="#0D1321" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[20px] font-black text-white leading-none">
                  {account.orders.length}
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sipariş</span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5">
              {donutSegments.map((seg) => (
                <div key={seg.key} className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: seg.color }} />
                    {seg.key}
                  </span>
                  <span className="text-white">{seg.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ETKİLEŞİMLİ SATIRLAR */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Son siparişler */}
        <div className="xl:col-span-2 rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 backdrop-blur-md text-left flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Son Siparişler</h3>
            <Link href="/orders" className="text-xs font-bold text-blue-400 hover:text-blue-300">
              Tümünü gör &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="tbl w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="py-2.5 px-3">Sipariş No</th>
                  <th className="py-2.5 px-3">Hizmet</th>
                  <th className="py-2.5 px-3 text-right">Adet</th>
                  <th className="py-2.5 px-3 text-right">Ücret</th>
                  <th className="py-2.5 px-3 text-center">Durum</th>
                </tr>
              </thead>
              <tbody>
                {account.orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 font-semibold">
                      Henüz sipariş yok. İlk siparişini ver &rarr;
                    </td>
                  </tr>
                ) : (
                  account.orders.slice(0, 5).map((o) => {
                    const isDone = o.status === "Completed";
                    const isCanceled = o.status === "Canceled";
                    return (
                      <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                        <td className="py-3 px-3 font-bold text-white">{o.id}</td>
                        <td className="py-3 px-3 max-w-[200px] truncate font-medium">{o.service}</td>
                        <td className="py-3 px-3 text-right font-semibold">{o.qty.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-black text-emerald-400">{fmtINR(o.charge)}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              isDone
                                ? "bg-emerald-500/10 text-emerald-400"
                                : isCanceled
                                ? "bg-rose-500/10 text-rose-400"
                                : "bg-amber-500/10 text-amber-400 animate-pulse"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-currentColor" />
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hesap Hareketleri */}
        <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 backdrop-blur-md text-left flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Hesap Hareketleri</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verileriniz</span>
          </div>

          <div className="feed overflow-y-auto space-y-3 pr-1 max-h-[220px]">
            {[...(account.txns || []), ...account.orders]
              .sort((a, b) => b.at - a.at)
              .slice(0, 8)
              .map((evt) => {
                const isTxn = "type" in evt;
                return (
                  <div key={`${isTxn ? "txn" : "ord"}-${evt.id}`} className="flex items-center gap-3 py-2 border-b border-white/5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white shrink-0">
                      <Activity size={14} className={isTxn ? "text-emerald-400" : "text-blue-400"} />
                    </span>
                    <div className="flex-1 text-[12.5px] text-slate-300">
                      {isTxn ? (
                        <span>
                          Cüzdan {evt.type === "credit" ? "para ekleme" : "para çekme"} ({evt.method} yoluyla): <b className="text-white">{fmtINR(evt.amount)}</b>
                        </span>
                      ) : (
                        <span>
                          Sipariş <b className="text-white">{evt.id}</b> verildi: {evt.service}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold shrink-0">
                      {new Date(evt.at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            {(!account.txns || account.txns.length === 0) && account.orders.length === 0 && (
              <div className="py-8 text-center text-slate-500 text-xs font-semibold">
                Henüz hesap hareketi yok.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HIZLI SİPARİŞ + SİSTEM DURUMU */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Hızlı Sipariş Formu */}
        <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 backdrop-blur-md text-left flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <Zap size={15} className="text-amber-400 fill-amber-400" />
            Hızlı Sipariş
          </h3>

          <div className="space-y-3.5 flex-1">
            <div className="flex flex-col">
              <label className="text-[10.5px] font-extrabold uppercase tracking-wide text-slate-400 mb-1.5">Hizmet Seçimi</label>
              <select
                value={qoServiceId}
                onChange={(e) => setQoServiceId(e.target.value)}
                className="rounded-xl border border-white/5 bg-white/[0.01] px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500 focus:bg-white/[0.03]"
              >
                {marketLoading ? (
                  <option>Hizmet kataloğu yükleniyor...</option>
                ) : (
                  quickPicks.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#090D16] text-white">
                      {s.name.length > 36 ? s.name.slice(0, 36) + "…" : s.name} — {fmtINR(s.price)}/1K
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10.5px] font-extrabold uppercase tracking-wide text-slate-400 mb-1.5">Hedef URL Bağlantısı</label>
              <input
                type="text"
                placeholder="https://instagram.com/gonderim"
                value={qoLink}
                onChange={(e) => setQoLink(e.target.value)}
                className="rounded-xl border border-white/5 bg-white/[0.01] px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:bg-white/[0.03]"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10.5px] font-extrabold uppercase tracking-wide text-slate-400 mb-1.5">Miktar</label>
              <input
                type="number"
                min={100}
                value={qoQty}
                onChange={(e) => setQoQty(Math.max(1, parseInt(e.target.value, 10) || 0))}
                className="rounded-xl border border-white/5 bg-white/[0.01] px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500 focus:bg-white/[0.03]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 border border-white/5 bg-white/[0.01] rounded-xl mb-4 text-xs font-bold">
              <span className="text-slate-400">Hesaplanan Ücret:</span>
              <b className="text-lg text-emerald-400 font-extrabold">{fmtINR(qoCharge)}</b>
            </div>

            <button
              onClick={() => void handleQuickOrder()}
              disabled={marketLoading || !qoServiceId}
              className="btn btn-cta btn-block !py-3 !text-sm flex items-center justify-center gap-2"
            >
              <Zap size={14} />
              <span>Şimdi sipariş ver</span>
            </button>
          </div>
        </div>

        {/* En iyi hizmetler */}
        <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 backdrop-blur-md text-left flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">En İyi Hizmetler</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EN İYİ TEKLİFLER</span>
          </div>

          <div className="space-y-3.5 pr-1 flex-1 overflow-y-auto max-h-[300px]">
            {marketLoading ? (
              <div className="py-8 text-center text-slate-500 text-xs font-semibold">En iyi hizmetler yükleniyor...</div>
            ) : (
              services
                .slice()
                .sort((a, b) => b.margin_pct - a.margin_pct)
                .slice(0, 5)
                .map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3.5 py-2 border-b border-white/5">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600/10 text-blue-400 text-xs font-black">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <b className="text-xs text-white truncate block font-bold">{s.name}</b>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">
                        {s.platform} • {s.category}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <b className="text-xs text-white block">{fmtINR(s.price)}</b>
                      <span className="text-[10px] font-black text-emerald-400 mt-0.5 block">
                        +%{s.margin_pct} Marj
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Üretim durumu */}
        <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 backdrop-blur-md text-left flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Üretim Durumu</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Yapılandırıldı</span>
          </div>

          <div className="space-y-4 my-auto">
            {[
              { name: "Razorpay Ödeme", role: "Doğrulanmış cüzdan yüklemeleri", status: "Etkin", color: "bg-emerald-400" },
              { name: "Hesap API'si", role: "Kimlik doğrulama, cüzdan, siparişler", status: "Canlı", color: "bg-emerald-400" },
              { name: "Hizmet Kataloğu", role: "Müşteriye dönük hizmetler", status: `${services.length} hizmet`, color: "bg-emerald-400" },
              { name: "Sağlayıcı Entegrasyonu", role: "Sunucu tarafı entegrasyon", status: "Bekliyor", color: "bg-amber-400" },
            ].map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-bold border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <span className="h-6 w-6 rounded-lg bg-white/5 font-extrabold flex items-center justify-center text-[10px] text-blue-400 shrink-0">
                    {p.name[0]}
                  </span>
                  <div>
                    <div className="text-white font-bold">{p.name}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">{p.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className={`h-1.5 w-1.5 rounded-full ${p.color}`} />
                    <span className={p.color === "bg-emerald-400" ? "text-emerald-400" : "text-amber-400"}>
                      {p.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POPÜLER KATEGORİLER */}
      <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 backdrop-blur-md text-left">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Popüler Kategoriler</h3>
          <Link href="/services" className="text-xs font-bold text-blue-400 hover:text-blue-300">
            Tümünü incele &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_CATEGORIES.map((c) => (
            <Link
              key={c.platform}
              href={`/services?platform=${c.platform}`}
              className="flex flex-col items-center gap-3.5 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:-translate-y-1 hover:border-blue-500/25 transition-all text-center group cursor-pointer"
            >
              <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr ${c.color} text-white font-extrabold`}>
                <span className="text-lg">{c.icon}</span>
              </span>
              <div>
                <div className="text-xs font-black text-white group-hover:text-blue-400 transition-colors">
                  {c.platform}
                </div>
                <span className="text-[10px] text-slate-500 font-bold block mt-0.5 uppercase tracking-wide">
                  Hizmetleri keşfet
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* BİLDİRİM PANELİ */}
      {toastMsg && (
        <div className="fixed bottom-24 left-6 z-55 rounded-xl border border-white/10 bg-[#0D1321]/95 px-5 py-3 shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-black border-l-4 border-l-emerald-500 animate-slideup">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </DashboardShell>
  );
}
