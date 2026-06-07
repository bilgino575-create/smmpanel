"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart2, Users, ShoppingBag, Wallet, TrendingUp, RefreshCw,
  AlertTriangle, XCircle, Zap, Database, Shield, PlusCircle, CheckCircle2,
  Lightbulb, Star, Gift,
} from "lucide-react";
import { useAccount } from "@/lib/useAccount";
import { api, type AdminSummaryResponse, type AdminOrderRow, type AdminUserRow, type AdminReferralResponse } from "@/lib/api";
import { fmtINR } from "@/lib/account";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const ADMIN_EMAIL = "getkriyava@gmail.com";

function StatCard({ label, value, sub, color, icon: Icon }: { label: string; value: string | number; sub?: string; color: string; icon: React.ElementType }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 p-5 flex items-start gap-4">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${color}`}><Icon size={20} /></span>
      <div className="min-w-0">
        <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="font-display text-2xl font-black text-white mt-0.5">{value}</div>
        {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === "completed") return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20">Tamamlandı</span>;
  if (s === "failed") return <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-black border border-rose-500/20">Başarısız</span>;
  if (s === "canceled") return <span className="px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 text-[10px] font-black border border-slate-500/20">İptal</span>;
  return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-black border border-amber-500/20">İşleniyor</span>;
}

function RevenueChart({ orders }: { orders: AdminOrderRow[] }) {
  const days = 14;
  const now = Date.now();
  const MS = 24 * 3600 * 1000;
  const buckets = Array.from({ length: days }, (_, i) => {
    const dayStart = new Date(now - (days - 1 - i) * MS);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart.getTime() + MS);
    const dayOrders = orders.filter((o) => {
      const t = new Date(o.time).getTime();
      return t >= dayStart.getTime() && t < dayEnd.getTime() && o.status !== "Failed" && o.status !== "Canceled";
    });
    return {
      label: dayStart.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
      revenue: +dayOrders.reduce((s, o) => s + o.charge, 0).toFixed(2),
      cost: +dayOrders.reduce((s, o) => s + o.providerCost, 0).toFixed(2),
      profit: +dayOrders.reduce((s, o) => s + o.profit, 0).toFixed(2),
    };
  });
  const maxR = Math.max(...buckets.map((b) => b.revenue), 1);
  const W = 560; const H = 140; const pad = 10; const barW = (W - pad * 2) / days;
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Gelir / Maliyet — Son 14 Gün</h3>
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <span className="flex items-center gap-1"><span className="h-2 w-3 rounded bg-blue-500 inline-block" />Gelir</span>
          <span className="flex items-center gap-1"><span className="h-2 w-3 rounded bg-rose-500 inline-block" />Maliyet</span>
          <span className="flex items-center gap-1"><span className="h-2 w-3 rounded bg-purple-500 inline-block" />Kâr</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%" style={{ minWidth: 300 }}>
          {buckets.map((b, i) => {
            const x = pad + i * barW;
            const rH = (b.revenue / maxR) * H;
            const cH = (b.cost / maxR) * H;
            const pH = (b.profit / maxR) * H;
            const gap = barW * 0.08;
            const bw = (barW - gap * 4) / 3;
            return (
              <g key={i}>
                <rect x={x + gap} y={H - rH} width={bw} height={rH} rx="2" fill="#3b82f6" opacity="0.8" />
                <rect x={x + gap + bw + gap} y={H - cH} width={bw} height={cH} rx="2" fill="#f43f5e" opacity="0.7" />
                <rect x={x + gap + bw * 2 + gap * 2} y={H - pH} width={bw} height={pH} rx="2" fill="#a855f7" opacity="0.8" />
                {i % 3 === 0 && <text x={x + barW / 2} y={H + 15} textAnchor="middle" fontSize="7" fill="#64748b">{b.label}</text>}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

type Tab = "overview" | "orders" | "users" | "providers" | "deposits" | "referrals" | "roadmap";

const ROADMAP = [
  { status: "live", label: "Çoklu sağlayıcı yönlendirme (EasySMM + LuvSMM + FineSMM)", desc: "En ucuz öncelikli, bakiye farkındalı yedekleme" },
  { status: "live", label: "HMAC doğrulamalı Razorpay ödemeleri", desc: "Sunucu taraflı imza kontrolü, anında cüzdan kredisi" },
  { status: "live", label: "Tüm hizmetlerde otomatik %15 kâr marjı", desc: "Canlı sağlayıcı kataloğundan her 30 dakikada bir güncellenir" },
  { status: "live", label: "Manuel cüzdan kredili Admin CRM", desc: "Tam sipariş/kullanıcı/sağlayıcı analitiği" },
  { status: "next", label: "Tüm kullanıcılara genel duyuru mesajı", desc: "Tüm panolarda duyuru/bildirim göster" },
  { status: "next", label: "Kupon / promosyon kodu sistemi", desc: "Admin kod oluşturur, kullanıcılar ödemede uygular" },
  { status: "next", label: "Sağlayıcı bakiye otomatik uyarı e-postası", desc: "Herhangi bir sağlayıcı ₹100 altına düşerse getkriyava@gmail.com'a e-posta" },
  { status: "next", label: "Kategori başına kâr marjı ayarları", desc: "Takipçiler için %15, Beğeniler için %20, vb." },
  { status: "next", label: "Sağlayıcıdan sipariş durumu otomatik senkronizasyon", desc: "Sağlayıcı /status sorgula ve DB'yi 5 dk'da bir güncelle" },
  { status: "next", label: "Alt panel / bayi hesapları", desc: "Alt bayilere özel fiyatlandırmalı kendi panellerini ver" },
  { status: "next", label: "Yeni siparişler için Telegram bot uyarıları", desc: "Her yeni siparişte admin botuna bildir" },
  { status: "future", label: "Ortaklık / referans sistemi", desc: "Kullanıcılar yönlendirdikleri siparişlerden % kazanır" },
  { status: "future", label: "Abonelik / otomatik tekrar sipariş paketleri", desc: "1000 takipçi/ay tekrarlayan plan satın al" },
  { status: "future", label: "Kullanıcılar için AI hizmet önerici", desc: "Hedef + bütçeye göre en iyi hizmeti öner" },
  { status: "future", label: "Beyaz etiket alt panel oluşturucu", desc: "Bayiler kendi alan adı + markalamasını alır" },
];

export default function AdminPage() {
  const { account } = useAccount();
  const router = useRouter();
  const [data, setData] = useState<AdminSummaryResponse | null>(null);
  const [refData, setRefData] = useState<AdminReferralResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [orderFilter, setOrderFilter] = useState("Tümü");
  const [refreshing, setRefreshing] = useState(false);

  const [fundEmail, setFundEmail] = useState("");
  const [fundAmount, setFundAmountStr] = useState("100");
  const [fundNote, setFundNote] = useState("");
  const [fundLoading, setFundLoading] = useState(false);
  const [fundMsg, setFundMsg] = useState("");

  useEffect(() => {
    if (!account.email) return;
    // Admin kontrolü geçici olarak devre dışı - herkes erişebilir
    // if (account.email !== ADMIN_EMAIL) { router.replace("/dashboard"); return; }
    void fetchData();
  }, [account.email]);

  const fetchData = async () => {
    setLoading(true); setError("");
    try {
      const [summary, referrals] = await Promise.all([api.adminSummary(), api.adminReferrals()]);
      setData(summary);
      setRefData(referrals);
    } catch (e) { setError(e instanceof Error ? e.message : "Yükleme başarısız"); }
    finally { setLoading(false); }
  };

  const handleRefresh = async () => { setRefreshing(true); await fetchData(); setRefreshing(false); };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(fundAmount, 10);
    if (!fundEmail || !amt || amt <= 0) { setFundMsg("❌ E-posta ve geçerli tutar girin"); return; }
    setFundLoading(true); setFundMsg("");
    try {
      const res = await api.adminAddFunds(fundEmail, amt, fundNote || undefined);
      setFundMsg(`✅ ${fundEmail} adresine ${fmtINR(res.added)} eklendi. Yeni bakiye: ${fmtINR(res.newBalance)}`);
      setFundEmail(""); setFundAmountStr("100"); setFundNote("");
      await fetchData();
    } catch (e) { setFundMsg("❌ " + (e instanceof Error ? e.message : "Başarısız")); }
    finally { setFundLoading(false); }
  };

  if (!account.email || account.email !== ADMIN_EMAIL) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
          <Shield size={40} className="text-rose-400" />
          <h2 className="text-xl font-black text-white">Sadece Admin Erişimi</h2>
          <p className="text-slate-400 text-sm">Bu sayfayı yalnızca getkriyava@gmail.com görüntüleyebilir.</p>
          <Link href="/dashboard" className="btn btn-primary">← Panele Dön</Link>
        </div>
      </DashboardShell>
    );
  }

  const filteredOrders = (data?.recentOrders || []).filter((o) =>
    orderFilter === "Tümü" ? true : o.status.toLowerCase() === orderFilter.toLowerCase()
  );

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Genel Bakış", icon: BarChart2 },
    { key: "orders", label: "Siparişler", icon: ShoppingBag },
    { key: "users", label: "Kullanıcılar", icon: Users },
    { key: "providers", label: "Sağlayıcılar", icon: Database },
    { key: "deposits", label: "Para Yatırma", icon: Wallet },
    { key: "referrals", label: "Referanslar", icon: Gift },
    { key: "roadmap", label: "Yol Haritası", icon: Lightbulb },
  ];

  const statusOptions = ["Tümü","Processing","Completed","Failed","Canceled"];

  return (
    <DashboardShell>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-5 w-5 grid place-items-center rounded bg-amber-500/20 text-amber-400"><Shield size={11} /></span>
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">Admin CRM</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-black text-white">Kriyava Kontrol Paneli</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">{data?.asOf ? `Güncelleme: ${data.asOf}` : "Yükleniyor…"}</p>
        </div>
        <button onClick={() => void handleRefresh()} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs font-bold text-slate-300 hover:text-white">
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Yenile</span>
        </button>
      </div>

      {error && <div className="mb-5 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-bold flex items-center gap-2"><AlertTriangle size={13} />{error}</div>}

      <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1 mb-6 border-b border-white/5">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all rounded-t-lg -mb-px border-b-2 ${
              tab === t.key ? "border-blue-500 text-white bg-blue-600/5" : "border-transparent text-slate-400 hover:text-white"
            }`}>
            <t.icon size={13} />{t.label}
          </button>
        ))}
      </div>

      {loading && <div className="flex items-center justify-center py-20 text-slate-500 text-sm font-bold gap-2"><RefreshCw size={16} className="animate-spin" />Yükleniyor…</div>}

      {!loading && data && (
        <>
          {tab === "overview" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Toplam Kullanıcı" value={data.totalUsers} sub="kayıtlı" color="text-blue-400 bg-blue-500/10" icon={Users} />
                <StatCard label="Bugünkü Gelir" value={fmtINR(data.today.revenue)} sub={`${data.today.activeCount} sipariş`} color="text-emerald-400 bg-emerald-500/10" icon={TrendingUp} />
                <StatCard label="Bugünkü Kâr" value={fmtINR(data.today.profit)} sub={data.today.revenue > 0 ? `${((data.today.profit/data.today.revenue)*100).toFixed(1)}% marj` : "—"} color="text-purple-400 bg-purple-500/10" icon={Zap} />
                <StatCard label="Bugünkü Yatırma" value={fmtINR(data.todayDeposits)} sub="Razorpay ile" color="text-amber-400 bg-amber-500/10" icon={Wallet} />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Toplam Gelir" value={fmtINR(data.allTime.revenue)} sub={`${data.allTime.activeCount} sipariş`} color="text-cyan-400 bg-cyan-500/10" icon={BarChart2} />
                <StatCard label="Toplam Kâr" value={fmtINR(data.allTime.profit)} color="text-violet-400 bg-violet-500/10" icon={TrendingUp} />
                <StatCard label="Sağlayıcı Maliyeti" value={fmtINR(data.allTime.providerCost)} color="text-rose-400 bg-rose-500/10" icon={Database} />
                <StatCard label="Başarısız Siparişler" value={data.allTime.failedCount} sub="cüzdan iade edildi" color="text-slate-400 bg-slate-500/10" icon={XCircle} />
              </div>

              <RevenueChart orders={data.recentOrders} />

              <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 p-5">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Sağlayıcı Bakiyeleri</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(data.providerStatus.balances).map(([name, bal]) => {
                    const [amt, cur] = bal.split(" ");
                    const parsed = parseFloat(amt);
                    const low = Number.isNaN(parsed) || parsed < 5;
                    return (
                      <div key={name} className={`rounded-xl border p-4 ${low ? "border-rose-500/30 bg-rose-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-white">{name}</span>
                          <span className={`text-[10px] font-black ${low ? "text-rose-400" : "text-emerald-400"}`}>{low ? "⚠ DÜŞÜK" : "✓ AKTİF"}</span>
                        </div>
                        <div className={`text-xl font-black ${low ? "text-rose-400" : "text-emerald-400"}`}>{amt} <span className="text-xs font-bold text-slate-400">{cur}</span></div>
                        <div className="text-[10px] text-slate-500 mt-1">{(data.providerStatus.providers[name] || 0).toLocaleString()} hizmet</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 p-5">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Bugünün Siparişleri</h3>
                {data.today.orders.length === 0 && <p className="text-slate-500 text-xs">Henüz bugün sipariş yok.</p>}
                {data.today.orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-white/[0.04] last:border-0 text-xs">
                    <div className="min-w-0 flex-1"><div className="text-white font-bold truncate">{o.service}</div><div className="text-slate-500 text-[10px]">{o.time.split(",")[0]} · {o.provider} · adet {o.qty}</div></div>
                    <div className="text-right shrink-0"><div className="font-black text-emerald-400">{fmtINR(o.charge)}</div><div className="text-[10px] text-purple-400">+{fmtINR(o.profit)}</div></div>
                    <StatusBadge status={o.status} />
                  </div>
                ))}
                {data.today.orders.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-3 text-center text-xs">
                    <div><div className="text-slate-500">Tahsil Edilen</div><div className="font-black text-white">{fmtINR(data.today.revenue)}</div></div>
                    <div><div className="text-slate-500">Sağlayıcı</div><div className="font-black text-rose-400">{fmtINR(data.today.providerCost)}</div></div>
                    <div><div className="text-slate-500">Kâr</div><div className="font-black text-purple-400">{fmtINR(data.today.profit)}</div></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-sm font-black text-white">Tüm Siparişler ({data.recentOrders.length})</h3>
                <div className="flex gap-1 flex-wrap">
                  {statusOptions.map((s) => (
                    <button key={s} onClick={() => setOrderFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${orderFilter===s?"bg-blue-600 text-white":"text-slate-400 bg-white/[0.02] border border-white/5"}`}>{s === "Processing" ? "İşleniyor" : s === "Completed" ? "Tamamlandı" : s === "Failed" ? "Başarısız" : s === "Canceled" ? "İptal" : s}</button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 overflow-x-auto">
                <table className="w-full text-xs text-slate-300">
                  <thead><tr className="border-b border-white/5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 text-left">Tarih</th><th className="py-3 px-4 text-left">Hizmet</th>
                    <th className="py-3 px-4 text-right">Adet</th><th className="py-3 px-4 text-right">Tahsilat</th>
                    <th className="py-3 px-4 text-right">Maliyet</th><th className="py-3 px-4 text-right text-purple-400">Kâr</th>
                    <th className="py-3 px-4 text-center">Durum</th><th className="py-3 px-4">Sağlayıcı</th>
                  </tr></thead>
                  <tbody>
                    {filteredOrders.map((o: AdminOrderRow) => (
                      <tr key={o.id} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{o.time.split(",")[0]}</td>
                        <td className="py-3 px-4 max-w-[160px]"><div className="truncate font-medium">{o.service}</div><div className="text-[10px] text-slate-600">{o.platform}</div></td>
                        <td className="py-3 px-4 text-right">{o.qty.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-black text-white">{fmtINR(o.charge)}</td>
                        <td className="py-3 px-4 text-right text-rose-400">{fmtINR(o.providerCost)}</td>
                        <td className="py-3 px-4 text-right font-black text-purple-400">{fmtINR(o.profit)}</td>
                        <td className="py-3 px-4 text-center"><StatusBadge status={o.status} /></td>
                        <td className="py-3 px-4 text-slate-400">{o.provider}</td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-slate-500 text-xs">Sipariş bulunamadı</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2"><PlusCircle size={13} /> Manuel Bakiye Ekleme</h3>
                <form onSubmit={(e) => void handleAddFunds(e)} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide block mb-1">Kullanıcı E-postası</label>
                      <input type="email" value={fundEmail} onChange={(e) => setFundEmail(e.target.value)} placeholder="kullanici@mail.com" required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide block mb-1">Tutar (₹)</label>
                      <input type="text" inputMode="numeric" value={fundAmount} onChange={(e) => setFundAmountStr(e.target.value.replace(/\D/g,""))} placeholder="100" required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide block mb-1">Not (isteğe bağlı)</label>
                      <input type="text" value={fundNote} onChange={(e) => setFundNote(e.target.value)} placeholder="örn. bonus kredi"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500" />
                    </div>
                  </div>
                  <button type="submit" disabled={fundLoading}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs hover:bg-amber-400 transition-all disabled:opacity-50">
                    {fundLoading ? "Ekleniyor…" : "Kullanıcıya Bakiye Ekle"}
                  </button>
                  {fundMsg && <p className={`text-xs font-bold mt-2 ${fundMsg.startsWith("✅") ? "text-emerald-400" : "text-rose-400"}`}>{fundMsg}</p>}
                </form>
              </div>

              <h3 className="text-sm font-black text-white">Tüm Kullanıcılar ({data.users.length})</h3>
              <div className="sm:hidden space-y-3">
                {data.users.map((u: AdminUserRow) => (
                  <div key={u.id} className="rounded-xl border border-white/5 bg-[#0D1321]/60 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div><div className="text-xs font-black text-white">{u.name}</div><div className="text-[10px] text-slate-400">{u.email}</div></div>
                      {u.role === "admin" && <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">ADMIN</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-[9px] text-slate-500">Bakiye</div><div className="text-xs font-black text-emerald-400">{fmtINR(u.balance)}</div></div>
                      <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-[9px] text-slate-500">Harcama</div><div className="text-xs font-black text-white">{fmtINR(u.spent)}</div></div>
                    </div>
                    <button onClick={() => setFundEmail(u.email)} className="w-full py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-400 text-[10px] font-bold">+ Bakiye Ekle</button>
                  </div>
                ))}
              </div>
              <div className="hidden sm:block rounded-2xl border border-white/5 bg-[#0D1321]/60 overflow-x-auto">
                <table className="w-full text-xs text-slate-300">
                  <thead><tr className="border-b border-white/5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 text-left">Kullanıcı</th><th className="py-3 px-4 text-right">Bakiye</th>
                    <th className="py-3 px-4 text-right">Harcama</th><th className="py-3 px-4 text-center">Rol</th>
                    <th className="py-3 px-4 text-left">Kayıt</th><th className="py-3 px-4 text-center">İşlem</th>
                  </tr></thead>
                  <tbody>
                    {data.users.map((u: AdminUserRow) => (
                      <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                        <td className="py-3 px-4"><div className="font-bold text-white">{u.name}</div><div className="text-[10px] text-slate-500">{u.email}</div></td>
                        <td className="py-3 px-4 text-right font-black text-emerald-400">{fmtINR(u.balance)}</td>
                        <td className="py-3 px-4 text-right">{fmtINR(u.spent)}</td>
                        <td className="py-3 px-4 text-center">{u.role==="admin"?<span className="text-[9px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">ADMIN</span>:<span className="text-[9px] text-slate-500">kullanıcı</span>}</td>
                        <td className="py-3 px-4 text-slate-500">{u.joined.split(",")[0]}</td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => { setFundEmail(u.email); setTab("users"); }} className="px-2.5 py-1 rounded border border-amber-500/20 bg-amber-500/5 text-amber-400 text-[10px] font-bold hover:bg-amber-500/10">+ Bakiye</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "providers" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white">Sağlayıcı Yönetimi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(data.providerStatus.balances).map(([name, bal]) => {
                  const [amt, cur] = bal.split(" ");
                  const low = parseFloat(amt) < 5;
                  return (
                    <div key={name} className={`rounded-2xl border p-5 space-y-3 ${low?"border-rose-500/30 bg-rose-500/5":"border-white/5 bg-[#0D1321]/60"}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white">{name}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${low?"text-rose-400 bg-rose-500/10 border-rose-500/20":"text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>{low?"⚠ DÜŞÜK":"✓ AKTİF"}</span>
                      </div>
                      <div className={`text-2xl font-black ${low?"text-rose-400":"text-emerald-400"}`}>{amt} <span className="text-xs font-bold text-slate-400">{cur}</span></div>
                      <div className="text-[11px] text-slate-400"><span className="font-bold text-white">{(data.providerStatus.providers[name]||0).toLocaleString()}</span> hizmet</div>
                      {low && <div className="text-[11px] text-rose-400 bg-rose-500/10 rounded-lg p-2 font-bold">⚡ En ucuz yönlendirmeyi sürdürmek için bakiye ekleyin</div>}
                    </div>
                  );
                })}
              </div>
              <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 p-5">
                <div className="text-sm font-bold text-white">{data.providerStatus.services.toLocaleString()} toplam hizmet</div>
                <div className="text-[11px] text-slate-400 mt-1">Katalog her 30 dk'da bir yenilenir. Her hizmet için en ucuz sağlayıcı otomatik seçilir.</div>
              </div>
            </div>
          )}

          {tab === "deposits" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white">Tüm Yatırmalar ({data.deposits.length})</h3>
                <div className="text-xs font-bold text-emerald-400">Toplam: {fmtINR(data.deposits.reduce((s,d)=>s+d.amount,0))}</div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 overflow-hidden">
                {data.deposits.map((d, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.03] hover:bg-white/[0.01] text-xs">
                    <div><div className="font-bold text-white">{fmtINR(d.amount)}</div><div className="text-[10px] text-slate-500 mt-0.5">{d.time}</div></div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${d.method==="Manual"?"text-amber-400 bg-amber-500/10 border-amber-500/20":"text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>{d.method === "Manual" ? "Manuel" : "Razorpay"}</span>
                      {d.note && <div className="text-[10px] text-slate-500 mt-0.5 max-w-[120px] truncate">{d.note}</div>}
                    </div>
                  </div>
                ))}
                {data.deposits.length === 0 && <div className="py-10 text-center text-slate-500 text-xs">Henüz yatırma işlemi yok</div>}
              </div>
            </div>
          )}

          {tab === "referrals" && refData && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Aktif Referans Veren", value: refData.summary.totalReferrers, color: "text-emerald-400 bg-emerald-500/10" },
                  { label: "Referansla Gelen", value: refData.summary.totalReferred, color: "text-blue-400 bg-blue-500/10" },
                  { label: "Toplam Ödenen", value: fmtINR(refData.summary.totalPaidOut), color: "text-purple-400 bg-purple-500/10" },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl border border-white/5 bg-[#0D1321]/60 p-4 text-center">
                    <div className={`text-xl font-black ${s.color.split(" ")[0]}`}>{s.value}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 overflow-hidden">
                <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
                  <Gift size={13} className="text-emerald-400" />
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider">En Çok Referans Verenler</span>
                </div>
                {refData.topReferrers.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">Henüz referans etkinliği yok</div>
                ) : (
                  refData.topReferrers.map((r, i) => (
                    <div key={r.email} className="flex items-center justify-between px-5 py-3 border-b border-white/[0.03] hover:bg-white/[0.01] text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">#{i+1}</span>
                        <div>
                          <div className="font-bold text-white">{r.name || r.email}</div>
                          <div className="text-[10px] text-slate-500">{r.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-emerald-400">{fmtINR(r.earned)}</div>
                        <div className="text-[10px] text-slate-500">{r.referredCount} davet edilen</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === "roadmap" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white">Ürün Yol Haritası</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["live","next","future"].map((status) => (
                  <div key={status} className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${status==="live"?"bg-emerald-500":status==="next"?"bg-amber-500":"bg-slate-500"}`} />
                      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        {status==="live"?"Canlı 🎉":status==="next"?"Sıradaki ⚙️":"Gelecek 💡"}
                      </span>
                    </div>
                    {ROADMAP.filter((r) => r.status === status).map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-white/5 bg-[#0D1321]/60 p-3.5">
                        <div className="text-[11px] font-bold text-white">{item.label}</div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </DashboardShell>
  );
}
