"use client";
import Link from "next/link";
import { Code, Lock, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function ApiDocsPage() {
  return (
    <DashboardShell>
      <div className="text-left mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-black text-white">Developer API</h1>
        <p className="text-sm text-slate-400 mt-1">
          API access is currently disabled while production provider fulfillment is being connected.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6 items-start">
        <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-6 backdrop-blur-md text-left space-y-5">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
              <Lock size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Not enabled yet</h3>
              <p className="text-xs text-slate-400 mt-1">No public API keys are issued from the dashboard right now.</p>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-400">
            To avoid fake credentials or sandbox responses, this page will stay locked until the backend exposes real API key generation, rate limits, order webhooks, and provider-backed fulfillment.
          </p>

          <Link href="/new-order" className="btn btn-primary btn-block !py-2.5 !text-xs">
            Place orders from dashboard
          </Link>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-6 backdrop-blur-md text-left space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-4">
            <Code size={16} className="text-blue-400" />
            Production checklist
          </h3>
          {[
            "Real API key issue/revoke endpoint",
            "Signed order creation endpoint",
            "Webhook status updates",
            "Provider fulfillment integration",
            "Rate limits and audit logs",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-xs font-bold text-slate-300 border-b border-white/5 pb-3 last:border-0">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
