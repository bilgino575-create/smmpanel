"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Info, Search, ChevronDown, Download, RefreshCw, X } from "lucide-react";
import { useAccount } from "@/lib/useAccount";
import { fmtINR } from "@/lib/account";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const STATUSES = [
  { key: "Tümü", label: "Tümü" },
  { key: "Completed", label: "Tamamlanan" },
  { key: "Processing", label: "İşleniyor" },
  { key: "Pending", label: "Bekleyen" },
  { key: "Partial", label: "Kısmen" },
  { key: "Canceled", label: "İptal" },
];

export default function OrdersPage() {
  const { account } = useAccount();
  const [status, setStatus] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"at" | "charge" | "qty">("at");

  const filtered = useMemo(() => {
    let o = [...account.orders];
    if (status !== "Tümü") o = o.filter((x) => x.status === status);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      o = o.filter(
        (x) =>
          x.id.toLowerCase().includes(q) ||
          x.service.toLowerCase().includes(q) ||
          x.link?.toLowerCase().includes(q),
      );
    }
    o.sort((a, b) => b[sortKey] - a[sortKey]);
    return o;
  }, [account.orders, status, search, sortKey]);

  const totalCharge = filtered.reduce((s, o) => s + o.charge, 0);

  const exportCSV = () => {
    const headers = "Sipariş No,Hizmet,Bağlantı,Adet,Ücret,Durum,Tarih";
    const rows = filtered.map((o) =>
      [o.id, o.service, o.link || "", o.qty, o.charge, o.status, new Date(o.at).toISOString()].join(","),
    );
    const blob = new Blob([headers + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "kriyava_siparisler.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardShell>
      <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-black text-white">Siparişler</h1>
          <p className="text-sm text-slate-400 mt-1">{account.orders.length} toplam sipariş · {filtered.length} gösteriliyor</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/new-order" className="btn btn-primary !px-4 !py-2.5 !text-xs">+ Yeni Sipariş</Link>
          <button onClick={exportCSV} className="btn btn-ghost !px-4 !py-2.5 !text-xs flex items-center gap-1.5">
            <Download size={13} /> CSV Dışa Aktar
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 space-y-5">
        {/* Araç Çubuğu */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sipariş No, Hizmet veya Bağlantı Ara…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Durum düğmeleri */}
            {STATUSES.map((s) => (
              <button
                key={s.key}
                onClick={() => setStatus(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  status === s.key
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
            {/* Sıralama */}
            <div className="relative">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
                className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-white appearance-none cursor-pointer pr-7"
              >
                <option value="at" className="bg-[#090D16]">En Yeni</option>
                <option value="charge" className="bg-[#090D16]">En Yüksek Ücret</option>
                <option value="qty" className="bg-[#090D16]">En Yüksek Adet</option>
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Toplam */}
        {filtered.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs font-bold">
            <Info size={13} className="text-blue-400" />
            <span className="text-slate-300">
              Gösterilen <b className="text-white">{filtered.length}</b> sipariş —
              Toplam harcama <b className="text-emerald-400">{fmtINR(totalCharge)}</b>
            </span>
          </div>
        )}

        {/* Tablo */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-400">
            <thead>
              <tr className="uppercase tracking-wider text-[10px] border-b border-white/5">
                <th className="py-2 px-3">Sipariş No</th>
                <th className="py-2 px-3">Hizmet</th>
                <th className="py-2 px-3">Bağlantı</th>
                <th className="py-2 px-3 text-right">Adet</th>
                <th className="py-2 px-3 text-right">Ücret</th>
                <th className="py-2 px-3">Durum</th>
                <th className="py-2 px-3 text-right">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="text-slate-500">
                      {account.orders.length === 0 ? (
                        <>
                          <p className="text-lg mb-2">📭</p>
                          <p className="font-bold text-sm">Henüz sipariş yok.</p>
                          <p className="text-[11px] mt-1">İlk siparişi verdiğinizde burada listelenecek.</p>
                          <Link href="/new-order" className="btn btn-primary !px-4 !py-2 !text-xs mt-4 inline-flex">İlk Siparişi Ver</Link>
                        </>
                      ) : (
                        <p className="font-bold text-sm">Filtrelere uyan sonuç yok.</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-white font-bold">{o.id}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-300 max-w-[160px] truncate">{o.service}</td>
                    <td className="py-2.5 px-3 max-w-[140px] truncate font-medium text-slate-500">
                      {o.link ? (
                        <a href={o.link} target="_blank" rel="noreferrer" className="hover:text-blue-400 hover:underline">
                          {o.link.replace(/^https?:\/\//i, "").slice(0, 30) + "…"}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">{o.qty.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-emerald-400">{fmtINR(o.charge)}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-2.5 px-3 text-right text-[11px] font-bold text-slate-500">
                      {new Date(o.at).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-2 border-t border-white/5">
          <span>{filtered.length} / {account.orders.length} sipariş gösteriliyor</span>
          <button onClick={() => window.location.reload()} className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
            <RefreshCw size={12} /> Yenile
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "Completed"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : status === "Canceled"
      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
      : "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-extrabold ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
