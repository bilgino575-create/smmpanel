"use client";
import React from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FileText, Eye, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteNav />
      <main className="bg-slate-50 min-h-screen py-16">
        <div className="container-x max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
              <Eye size={12} />
              Privacy Center
            </div>
            <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Last updated: June 1, 2026 • Your trust and privacy are our top priorities.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-8 md:p-10 shadow-sm text-left text-slate-700 space-y-8 leading-relaxed">
            <div className="pb-6 border-b border-slate-100">
              <p className="text-slate-600 text-[15px] font-medium">
                Our company highly values your privacy. We follow a policy of confidentiality to tell you how we collect and use information about you and what we do to keep this information confidential. In <span className="font-bold text-slate-900">Kriyava.com</span> we do not share confidential information that you have provided to us.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">1</span>
                Confidentiality & Information Use
              </h2>
              <p className="text-[14.5px] text-slate-600 pl-8">
                We never share your personal information with third parties, including details about your orders. We do not communicate with the owners of the services, and we never disclose information about your resale activities—all information remains strictly with us. <span className="font-semibold text-slate-900">Kriyava.com</span> will protect your data for safety and the prevention of fraud, theft, or loss.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">2</span>
                Data Integrity and Protection
              </h2>
              <p className="text-[14.5px] text-slate-600 pl-8">
                We guarantee the safety of your data from unauthorized copying, access, or modification by third parties. We enforce strict physical, technical, and administrative safeguards to keep all transactional records completely secure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">3</span>
                Legal Partners & Standards
              </h2>
              <p className="text-[14.5px] text-slate-600 pl-8">
                <span className="font-semibold text-slate-900">Kriyava.com</span> works exclusively with legal representatives who value the protection of personal information. That’s why we confirm that your information will be continuously and rigorously protected at all times.
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
