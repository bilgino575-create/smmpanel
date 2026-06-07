"use client";
import React, { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Mail, MessageSquare, Clock, Globe, Send, CheckCircle2 } from "lucide-react";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setSent(false);
    }, 4000);
  };

  return (
    <>
      <SiteNav />
      <main className="bg-slate-50 min-h-screen py-16">
        <div className="container-x max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
              <MessageSquare size={12} />
              Help & Support
            </div>
            <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
              Contact Support
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
              Have questions or need help with a transaction? Get in touch with our specialist support team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_2fr] gap-8 items-stretch">
            {/* Contact Information */}
            <div className="bg-[#090D16] text-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
              {/* Background glows */}
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

              <div className="space-y-8 z-10 text-left">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Support Information</h3>
                  <p className="text-slate-400 text-xs mt-1">Our support agents are active 18 hours a day, 7 days a week.</p>
                </div>

                <div className="space-y-5 text-xs font-bold text-slate-300">
                  <div className="flex items-start gap-3.5">
                    <span className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                      <Mail size={15} />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase text-slate-500 font-extrabold tracking-wider">Email Inquiry</p>
                      <p className="text-white mt-0.5 text-xs">support@kriyava.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <span className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400">
                      <Clock size={15} />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase text-slate-500 font-extrabold tracking-wider">Active Hours</p>
                      <p className="text-white mt-0.5 text-xs">08:00 AM – 02:00 AM (IST)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <span className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400">
                      <Globe size={15} />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase text-slate-500 font-extrabold tracking-wider">Headquarters</p>
                      <p className="text-white mt-0.5 text-xs">Kriyava SMM Inc. • Mumbai, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-slate-500 text-[10px] font-semibold uppercase tracking-widest border-t border-white/5 pt-6 z-10 text-left">
                FineSMMPanel Group Corp.
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 md:p-10 shadow-sm text-left">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1.5">Department / Inquiry Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 transition-all font-bold cursor-pointer"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="deposit">Deposit & Payment Issue</option>
                    <option value="order">Order Delayed / Speed Issue</option>
                    <option value="api">Reseller API Partnerships</option>
                    <option value="other">Other / Custom Requests</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1.5">Your Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide details about your query..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 transition-all font-medium resize-none"
                  />
                </div>

                {sent ? (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold animate-slideup">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Inquiry sent successfully! Our team will respond shortly.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary btn-block !py-3.5 !text-xs flex items-center justify-center gap-2"
                  >
                    <Send size={13} />
                    Submit Ticket Inquiry
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
