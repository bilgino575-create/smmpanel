"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Shield, Wallet, CheckCircle2, CreditCard, Smartphone, DollarSign, Calendar } from "lucide-react";
import { useAccount } from "@/lib/useAccount";
import { fmtINR, saveAccount } from "@/lib/account";
import { api, loadRazorpay, ApiError } from "@/lib/api";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function AddFundsPage() {
  const { account, sync } = useAccount();
  const [amountStr, setAmountStr] = useState("100");
  const amount = Math.max(0, parseInt(amountStr.replace(/[^\d]/g, ""), 10) || 0);
  const [method, setMethod] = useState<"razorpay" | "upi" | "bank">("razorpay");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const PRESET_AMOUNTS = [50, 100, 200, 500, 1000];

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 10) {
      showToast("❌ Minimum yatırma tutarı ₹10'dur.");
      return;
    }
    setCheckoutOpen(true);
  };

  // Gerçek Razorpay ödemesi → backend imzayı doğrular → cüzdan kredisi.
  const handlePayment = async () => {
    setPaying(true);
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Ödeme ağ geçidi yüklenemedi");

      const order = await api.createPaymentOrder(amount); // backend Razorpay siparişi oluşturur

      await new Promise<void>((resolve, reject) => {
        // @ts-expect-error Razorpay is injected by the checkout script
        const rzp = new window.Razorpay({
          key: order.keyId,
          amount: Math.round(order.amount * 100),
          currency: order.currency,
          name: "Kriyava SMM",
          description: "Cüzdan yükleme",
          order_id: order.orderId,
          prefill: { name: account.name || "", email: account.email || "" },
          theme: { color: "#2563EB" },
          handler: async (resp: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const res = await api.verifyPayment(resp); // backend doğrular + kredi ekler
              const a = { ...account, balance: res.balance };
              a.txns = a.txns || [];
              a.txns.unshift({
                id: resp.razorpay_payment_id,
                type: "Para Yatırma",
                amount: res.added,
                at: Date.now(),
                method: "Razorpay",
              });
              saveAccount(a);
              await sync();
              setCheckoutOpen(false);
              showToast(`✅ Cüzdanınıza ${fmtINR(res.added)} eklendi!`);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: { ondismiss: () => reject(new Error("Ödeme iptal edildi")) },
        });
        rzp.open();
      });
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 503
          ? "Ödemeler kurulum aşamasında. Lütfen biraz sonra tekrar deneyin."
          : err instanceof Error
            ? err.message
            : "Ödeme başarısız oldu";
      if (!/cancel/i.test(msg)) showToast("❌ " + msg);
    } finally {
      setPaying(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  return (
    <DashboardShell>
      {/* SAYFA BAŞLIĞI */}
      <div className="text-left mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-black text-white">Bakiye Yükle</h1>
        <p className="text-sm text-slate-400 mt-1">Kriyava cüzdanınızı anında doldurun. Kartlar, netbanking, UPI veya toptan havale transferleri arasından seçim yapın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        {/* PARA YATIRMA KARTI */}
        <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-6 backdrop-blur-md text-left space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cüzdan Yükle</h3>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Shield size={11} /> Razorpay Güvencesinde
            </span>
          </div>

          <form onSubmit={handleDepositSubmit} className="space-y-5">
            {/* Tutar girişi */}
            <div className="flex flex-col">
              <label className="text-[10.5px] font-extrabold uppercase tracking-wide text-slate-400 mb-2">Yatırma Tutarı (INR)</label>
              {/* Ön tanımlı hızlı seçim */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {PRESET_AMOUNTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmountStr(String(p))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all border ${
                      amount === p
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    ₹{p}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-lg font-black text-slate-500">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value.replace(/[^\d]/g, ""))}
                  onFocus={(e) => e.target.select()}
                  placeholder="Tutar girin"
                  required
                  className="w-full rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3.5 pl-8 font-display text-lg font-black text-white placeholder-slate-600 outline-none focus:border-blue-500"
                />
              </div>
              <span className="text-[10px] text-slate-500 font-bold mt-1.5 block">
                Minimum yatırma: ₹10. UPI, kartlar veya netbanking ile güvenle ödeyin.
              </span>
            </div>

            {/* Yöntem seçenekleri */}
            <div className="flex flex-col">
              <label className="text-[10.5px] font-extrabold uppercase tracking-wide text-slate-400 mb-2">Ödeme Yöntemi</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "razorpay", label: "Razorpay Ödeme", desc: "Kartlar, Netbanking", icon: CreditCard },
                  { id: "upi", label: "UPI Anında", desc: "Google Pay, PhonePe", icon: Smartphone },
                  { id: "bank", label: "Net Bankacılık", desc: "Tüm büyük bankalar", icon: DollarSign },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id as any)}
                      className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                        method === m.id
                          ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_4px_12px_rgba(37,99,235,0.15)]"
                          : "border-white/5 bg-white/[0.01] text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon size={20} className={method === m.id ? "text-blue-400" : "text-slate-500"} />
                      <span className="text-xs font-bold mt-2">{m.label}</span>
                      <span className="text-[9.5px] text-slate-500 font-bold mt-0.5">{m.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-cta btn-block btn-lg mt-3"
            >
              Güvenli ödemeye geç
            </button>
          </form>

          {/* Güvenlik notu */}
          <div className="flex gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-[11px] leading-relaxed text-slate-400">
            <Shield size={18} className="text-blue-400 shrink-0 mt-0.5" />
            <p>
              Tüm ödemeler Razorpay aracılığıyla 256-bit şifreleme ile güvenli şekilde işlenir. Başarılı bir ödemeden sonra fonlar anında cüzdanınıza eklenir.
            </p>
          </div>
        </div>

        {/* YAN BAKİYE & İŞLEM GEÇMİŞİ */}
        <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-6 backdrop-blur-md text-left sticky top-24 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cüzdan Bakiyesi</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-bold">Mevcut Bakiye:</span>
              <b className="text-2xl font-display font-black text-emerald-400">{fmtINR(account.balance)}</b>
            </div>

            {/* İşlemler */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-3.5">
                Son Cüzdan Yüklemeleri
              </h4>
              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                {!account.txns || account.txns.length === 0 ? (
                  <div className="text-slate-500 text-xs py-4 text-center font-semibold">Henüz para yatırma işlemi yok.</div>
                ) : (
                  account.txns.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between text-xs font-bold py-2 border-b border-white/5 last:border-0">
                      <div>
                        <div className="text-white font-bold">{txn.type} ({txn.method})</div>
                        <span className="text-[9.5px] text-slate-500 block font-bold mt-0.5">
                          ID: {txn.id} • {new Date(txn.at).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-extrabold">{fmtINR(txn.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ÖDEME MODAL KAPLAMASI */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadein">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0D1321] p-6 shadow-2xl relative text-left">
            <h3 className="font-display text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <Shield size={18} className="text-blue-400" />
              Yatırmayı onayla
            </h3>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Platform:</span>
                <span className="text-white font-semibold">Kriyava SMM</span>
              </div>
              <div className="flex justify-between">
                <span>Ödeme yöntemi:</span>
                <span className="text-white font-bold">Razorpay (UPI / Kartlar / Netbanking)</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-3">
                <span>Tutar:</span>
                <b className="text-white text-base">{fmtINR(amount)}</b>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setCheckoutOpen(false)}
                className="btn btn-ghost flex-1 !py-2.5 !text-xs font-bold"
                disabled={paying}
              >
                İptal
              </button>
              <button
                onClick={handlePayment}
                className="btn btn-cta flex-1 !py-2.5 !text-xs font-bold"
                disabled={paying}
              >
                {paying ? "Açılıyor…" : `${fmtINR(amount)} Öde`}
              </button>
            </div>
          </div>
        </div>
      )}

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
