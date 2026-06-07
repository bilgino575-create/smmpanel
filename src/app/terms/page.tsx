"use client";
import React from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FileText, Shield, Sparkles } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <>
      <SiteNav />
      <main className="bg-slate-50 min-h-screen py-16">
        <div className="container-x max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
              <Shield size={12} />
              Legal Agreements
            </div>
            <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Last updated: June 1, 2026 • Please read these terms carefully before placing an order.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-8 md:p-10 shadow-sm text-left text-slate-700 space-y-8 leading-relaxed">
            <div className="pb-6 border-b border-slate-100">
              <p className="text-slate-600 text-[15px]">
                By placing an order with our SMM panel, you automatically accept all the below-listed terms of service whether you read them or not. We reserve the right to change these Terms of Service without notice. You are expected to read all terms of service before placing every order to ensure you are up to date with any changes or any future changes.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">1</span>
                General Usage Agreement
              </h2>
              <p className="text-[14.5px] text-slate-600 pl-8">
                You will only use the Kriyava SMM website in a manner which follows all agreements made with all the social media websites on their individual Terms of Service pages. We are not responsible for any account suspension, shadowbans, or deletions that may occur from your use of social media services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">2</span>
                Service Rates and Modifications
              </h2>
              <p className="text-[14.5px] text-slate-600 pl-8">
                Our rates are subject to change at any time without notice. The terms stay in effect in the case of rate changes. We reserve the right to change a service type or provider if we believe it necessary to successfully complete an order.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">3</span>
                Delivery Estimations & Processing
              </h2>
              <p className="text-[14.5px] text-slate-600 pl-8">
                We do not guarantee a delivery time for any services. We offer our best estimation for when the order will be delivered. This is only an estimation and we will not refund orders that are processing if you feel they are taking too long.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">4</span>
                Liabilities and Warranties
              </h2>
              <p className="text-[14.5px] text-slate-600 pl-8">
                Kriyava SMM is in no way liable for any account damage or loss. We do not guarantee that your new followers will interact with you, we simply guarantee you to get the followers you pay for. We strive to provide the highest quality engagement in the market.
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
