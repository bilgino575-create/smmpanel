"use client";
import React from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FileText, RotateCcw, AlertTriangle } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <>
      <SiteNav />
      <main className="bg-slate-50 min-h-screen py-16">
        <div className="container-x max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-100">
              <RotateCcw size={12} />
              Billing Agreements
            </div>
            <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
              Refund Policy
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Last updated: June 1, 2026 • Please read our refund terms before making a deposit.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-8 md:p-10 shadow-sm text-left text-slate-700 space-y-8 leading-relaxed">
            <div className="pb-6 border-b border-slate-100">
              <p className="text-slate-600 text-[15px] font-semibold text-amber-800 bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                ⚠️ <span className="font-bold text-slate-900">Kriyava.com</span> offers non-tangible, irrevocable digital services. We do not refund to your payment gateway account (PayPal, UPI, credit card, etc.). We can only issue refunds to your Kriyava.com account balance for use in future orders.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">1</span>
                General Refund Terms
              </h2>
              <p className="text-[14.5px] text-slate-600 pl-8">
                Once a payment is successfully completed, it cannot be reversed. You must use your balance on orders from <span className="font-semibold text-slate-900">Kriyava.com</span>. Any kinds of payment gateway refund requests will be denied. As a customer, you are responsible for understanding this upon purchasing any item at our site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">2</span>
                Disputes & Chargebacks
              </h2>
              <p className="text-[14.5px] text-slate-600 pl-8">
                You agree that once you complete a payment, you will not file a dispute or a chargeback against us for any reason. If you file a dispute or chargeback against us after a deposit, we reserve the right to terminate all future orders, ban you from our site, and take away any followers or likes we delivered to you or your clients&apos; accounts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">3</span>
                Order Corrections & Placement
              </h2>
              <p className="text-[14.5px] text-slate-600 pl-8">
                Orders placed in <span className="font-semibold text-slate-900">Kriyava.com</span> will not be refunded or canceled after they are placed. You will receive a refund credit to your account balance only if the order is non-deliverable. Misplaced, duplicate, or private account orders do not qualify for a refund. Be sure to double-check each order before placing it.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">4</span>
                Server Usage Restrictions
              </h2>
              <p className="text-[14.5px] text-slate-600 pl-8">
                Please do not use more than one server at the same time for the same page/link. We cannot provide correct follower/like counts in that case, and these duplicate orders will not qualify for refunds. Most services start instantly, but some take 24-48 hours. If your order is delayed, please contact our support team. We are online 18 hours per day to assist you.
              </p>
            </section>

            <div className="pt-6 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-400 font-medium">
              <FileText size={14} />
              <span>Kriyava SMM Panel © 2026 • All Rights Reserved.</span>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
