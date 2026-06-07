"use client";
import React, { useState, useEffect } from "react";
import { Gift, Copy, Share2, CheckCircle2, Users, Wallet, TrendingUp, RefreshCw } from "lucide-react";
import { useAccount } from "@/lib/useAccount";
import { fmtINR } from "@/lib/account";
import { api } from "@/lib/api";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

interface ReferralData {
  code: string | null;
  link: string | null;
  earned: number;
  referredCount: number;
  commissionPct: number;
  recentEarnings: Array<{ amount: number; note: string | null; time: string }>;
}

export default function AffiliatePage() {
  const { account } = useAccount();
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    api.myReferrals()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => showToast(`✅ ${label} kopyalandı!`));
  };

  const refCode = data?.code || account.referralCode || "";
  const refLink = data?.link || (refCode ? `https://smm.kriyava.com/login?ref=${refCode}` : "");

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-black text-white">Ortaklık Programı</h1>
        <p className="text-sm text-slate-400 mt-1">Referans bağlantınızı paylaşın. Davet ettiğiniz kullanıcıların her bakiye yüklemesinden %5 nakit kazanın.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-slate-500 text-sm">
          <RefreshCw size={16} className="animate-spin" /> Ortaklık verileri yükleniyor…
        </div>
      ) : (
        <div className="space-y-5">
          {/* İstatistikler */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-emerald-500/10 text-emerald-400"><Wallet size={16} /></span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Toplam Kazanç</span>
              </div>
              <div className="font-display text-2xl font-black text-emerald-400">{fmtINR(data?.earned ?? 0)}</div>
              <p className="text-[10px] text-slate-500 mt-1">cüzdanınıza eklendi</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-blue-500/10 text-blue-400"><Users size={16} /></span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Davet Edilenler</span>
              </div>
              <div className="font-display text-2xl font-black text-white">{data?.referredCount ?? 0}</div>
              <p className="text-[10px] text-slate-500 mt-1">bağlantınızla kaydoldu</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 p-5 col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-purple-500/10 text-purple-400"><TrendingUp size={16} /></span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Komisyon Oranı</span>
              </div>
              <div className="font-display text-2xl font-black text-purple-400">{data?.commissionPct ?? 5}%</div>
              <p className="text-[10px] text-slate-500 mt-1">her bakiye yüklemesinde</p>
            </div>
          </div>

          {/* Referans bağlantısı */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Gift size={16} className="text-emerald-400" />
              <h3 className="text-sm font-black text-white">Referans Bağlantınız</h3>
            </div>

            {refCode ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1.5">Referans Kodu</label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-emerald-400 text-base bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 flex-1">
                      {refCode}
                    </span>
                    <button onClick={() => copyText(refCode, "Kod")}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all">
                      <Copy size={15} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1.5">Paylaşılabilir Bağlantı</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-400 font-mono bg-blue-500/5 border border-blue-500/10 rounded-xl px-4 py-2.5 flex-1 truncate">
                      {refLink}
                    </span>
                    <button onClick={() => copyText(refLink, "Bağlantı")}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-all shrink-0">
                      <Copy size={15} />
                    </button>
                  </div>
                </div>

                {/* Paylaş butonları */}
                <div className="flex gap-2 pt-1">
                  <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Kriyava SMM'ye katıl — istediğin sosyal medya hesabını büyüt! 🚀 Referans kodum: ${refLink}`)}`, "_blank")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] text-xs font-bold hover:bg-[#25D366]/20 transition-all">
                    <Share2 size={13} /> WhatsApp
                  </button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent("Kriyava SMM'ye katıl 🚀")}`, "_blank")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#0088cc]/30 bg-[#0088cc]/10 text-[#0088cc] text-xs font-bold hover:bg-[#0088cc]/20 transition-all">
                    <Share2 size={13} /> Telegram
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Referans kodu yükleniyor… sayfayı biraz sonra yenileyin.</p>
            )}
          </div>

          {/* Nasıl Çalışır */}
          <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Nasıl Çalışır</h3>
            <div className="space-y-2.5">
              {[
                { step: "1", text: "Benzersiz referans bağlantınızı içerik üreticileri, ajanslar ve arkadaşlarınızla paylaşın" },
                { step: "2", text: "Onlar bağlantınızla kaydolur ve Kriyava cüzdanlarına bakiye yükler" },
                { step: "3", text: `Her bakiye yüklemesinde anında %${data?.commissionPct ?? 5} nakit kazanırsınız — doğrudan cüzdanınıza eklenir` },
                { step: "4", text: "Limit yok — davet ettiğiniz kişilerin yaptığı her yüklemeden kazanın" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3 text-xs">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-black grid place-items-center">{s.step}</span>
                  <span className="text-slate-300">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Son kazançlar */}
          {(data?.recentEarnings?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">Son Ortaklık Kazançları</span>
              </div>
              {data!.recentEarnings.map((e, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-white/[0.03] text-xs">
                  <div>
                    <div className="text-emerald-400 font-black">{fmtINR(e.amount)}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{e.note}</div>
                  </div>
                  <div className="text-slate-500 text-[10px]">{e.time}</div>
                </div>
              ))}
            </div>
          )}

          {(data?.recentEarnings?.length ?? 0) === 0 && (
            <div className="rounded-2xl border border-white/5 bg-[#0D1321]/60 py-10 flex flex-col items-center gap-3 text-center">
              <Gift size={28} className="text-slate-600" />
              <p className="text-slate-400 text-sm font-semibold">Henüz ortaklık kazancı yok</p>
              <p className="text-slate-500 text-xs max-w-xs">Referans bağlantınızı paylaşın ve arkadaşlarınız bakiye yüklediğinde %{data?.commissionPct ?? 5} kazanmaya başlayın.</p>
            </div>
          )}
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:w-80 z-55 rounded-xl border border-white/10 bg-[#0D1321]/95 px-4 py-3 shadow-2xl flex items-center gap-2.5 text-xs font-black border-l-4 border-l-emerald-500">
          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </DashboardShell>
  );
}
