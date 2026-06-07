"use client";
import React, { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Plus, RefreshCw, CheckCircle2 } from "lucide-react";
import { fmtINR } from "@/lib/account";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const MOCK_UPDATES = [
  { id: "KV3219", service: "📘 Facebook Custom Comments | 25K/Day | Global Accounts", type: "drop", oldPrice: 110, newPrice: 98, date: "Today" },
  { id: "KV2637", service: "👥 Instagram Followers [Old Accounts] | All Flag Types", type: "new", price: 49, date: "Today" },
  { id: "KV1140", service: "❤️ Instagram Likes | Cheapest Service In Market", type: "drop", oldPrice: 18, newPrice: 14, date: "Yesterday" },
  { id: "KV444", service: "⭕ YouTube 100% Real Views - Non Drop | Fast", type: "hike", oldPrice: 105, newPrice: 115, date: "2 days ago" },
  { id: "KV5124", service: "Telegram Members [INDIAN MIX Accounts] | No Refill", type: "new", price: 8, date: "3 days ago" },
  { id: "KV2115", service: "TikTok Followers | Max 100K | 30 Days Refill", type: "drop", oldPrice: 280, newPrice: 250, date: "5 days ago" },
];

export default function UpdatesPage() {
  const [filter, setFilter] = useState<"all" | "drop" | "hike" | "new">("all");
  
  const filtered = MOCK_UPDATES.filter((u) => {
    if (filter === "all") return true;
    return u.type === filter;
  });

  return (
    <DashboardShell>
      {/* PAGE HEAD */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="text-left">
          <h1 className="font-display text-2xl md:text-3xl font-black text-white">System Service Updates</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time logs of price drops, price hikes, and new service arrivals across providers.</p>
        </div>
      </div>

      {/* FILTER & CONTAINER */}
      <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-5 backdrop-blur-md text-left space-y-5">
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl border border-white/5 bg-white/[0.01] self-start text-[11px] font-bold">
          {[
            { id: "all", label: "All Logs" },
            { id: "drop", label: "Price Drops 📉" },
            { id: "hike", label: "Price Hikes 📈" },
            { id: "new", label: "New Arrivals ✨" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === tab.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LOGS TABLE */}
        <div className="overflow-x-auto">
          <table className="tbl w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-white/5 text-slate-400">
                <th className="py-2.5 px-3">Service ID</th>
                <th className="py-2.5 px-3">Service Details</th>
                <th className="py-2.5 px-3 text-center">Update Type</th>
                <th className="py-2.5 px-3 text-right">Old Price</th>
                <th className="py-2.5 px-3 text-right">New Price</th>
                <th className="py-2.5 px-3 text-center">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => {
                const isDrop = u.type === "drop";
                const isHike = u.type === "hike";
                const isNew = u.type === "new";

                return (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="py-3.5 px-3 font-bold text-white">{u.id}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-200">{u.service}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9.5px] font-black uppercase ${
                        isDrop
                          ? "bg-emerald-500/10 text-emerald-400"
                          : isHike
                          ? "bg-rose-500/10 text-rose-400"
                          : "bg-blue-500/10 text-blue-400 animate-pulse"
                      }`}>
                        {isDrop && <ArrowDownRight size={10} />}
                        {isHike && <ArrowUpRight size={10} />}
                        {isNew && <Plus size={10} />}
                        {u.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-medium text-slate-500">
                      {isNew ? "—" : fmtINR(u.oldPrice)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-white">
                      {isNew ? fmtINR(u.price) : fmtINR(u.newPrice)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-500">
                      {u.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
