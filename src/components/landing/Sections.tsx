"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Zap, ShieldCheck, Headphones, Lock, IndianRupee, Code2, Check, ChevronDown,
  Sparkles, Bot, User, ArrowRight,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem, SlideIn } from "../Reveal";
import {
  IconInstagram, IconYouTube, IconFacebook, IconTikTok,
  IconTelegram, IconSpotify, IconTwitterX, IconWhatsApp,
} from "../SocialIcon";
import { CountUp } from "../CountUp";
import { useHeadlineCards } from "@/lib/useServices";
import { fmtINR } from "@/lib/account";
import { motion } from "framer-motion";

/* ---------------- Güven metrikleri ---------------- */
export function Metrics() {
  const items = [
    { node: <CountUp to={1200} suffix="+" />,    label: "Müşteri" },
    { node: <CountUp to={8500} suffix="+" />,    label: "Teslim Edilen Sipariş" },
    { node: <CountUp to={99.8} suffix="%" decimals={1} />, label: "Başarı Oranı" },
    { node: "7/24", label: "Canlı Destek" },
  ];
  return (
    <section className="section-pad py-10">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: [0.22,1,0.36,1], delay: i * 0.06 }}
              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(37,99,235,.10)" }}
              className="rounded-[16px] border border-[color:var(--color-line)] bg-gradient-to-b from-white to-[color:var(--color-surface)] p-6 text-center shadow-sm"
            >
              <div className="font-display text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-0.03em] text-[color:var(--color-primary)]">{m.node}</div>
              <div className="mt-1.5 text-[11px] font-bold text-[color:var(--color-muted)] uppercase tracking-wider">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Platformlar ---------------- */
const PLATFORMS: Array<{ name: string; icon: React.ReactNode }> = [
  { name: "Instagram", icon: <IconInstagram size={32} /> },
  { name: "Facebook",  icon: <IconFacebook size={32} /> },
  { name: "YouTube",   icon: <IconYouTube size={32} /> },
  { name: "Telegram",  icon: <IconTelegram size={32} /> },
  { name: "TikTok",    icon: <IconTikTok size={32} /> },
  { name: "Twitter/X", icon: <IconTwitterX size={32} /> },
  { name: "Spotify",   icon: <IconSpotify size={32} /> },
  { name: "WhatsApp",  icon: <IconWhatsApp size={32} /> },
];
export function Platforms() {
  return (
    <section id="platforms" className="section-pad pt-0">
      <div className="container-x">
        <Reveal>
          <div className="mx-auto mb-12 max-w-[720px] text-center">
            <span className="eyebrow">Desteklenen Platformlar</span>
            <h2 className="h-sec mt-3 text-[color:var(--color-ink)]">Her kanal için tek panel</h2>
            <p className="lead mx-auto mt-3.5 text-[color:var(--color-muted)]">Kitlenizin gerçekten kullandığı platformlarda gerçek etkileşim — güvenli ve kademeli teslimatla.</p>
          </div>
        </Reveal>
        <Stagger className="grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-8" stagger={0.045}>
          {PLATFORMS.map((p) => (
            <StaggerItem key={p.name}>
              <motion.div
                whileHover={{ y: -5, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 340, damping: 18 }}
                className="flex flex-col items-center gap-2 rounded-[14px] border border-[color:var(--color-line)] bg-white px-2 py-4 shadow-sm cursor-default select-none"
              >
                <motion.span
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.05 }}
                >{p.icon}</motion.span>
                <span className="text-[11px] font-bold text-[color:var(--color-ink)] text-center leading-tight">{p.name}</span>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------------- Neden Kriyava ---------------- */
export function WhyUs() {
  const feats = [
    { icon: Zap, tint: "icontint-blue", t: "Şimşek hızında teslimat", d: "Siparişler saniyeler içinde başlar. Kademeli ve anlık modlar, büyümeniz ölçeklenirken doğal görünmesini sağlar." },
    { icon: ShieldCheck, tint: "icontint-green", t: "Yüksek kalıcılıklı hizmetler", d: "Düşük düşüş oranlı gerçek görünümlü profiller ve ömür boyu yeniden dolum seçenekleri — gerçekten kalıcı etkileşim." },
    { icon: Headphones, tint: "icontint-cyan", t: "7/24 insan desteği", d: "Canlı sohbet ve WhatsApp'ta gerçek insanlar, ayrıca otomatik sipariş güncellemeleri — asla tahminde bulunmazsınız." },
    { icon: Lock, tint: "icontint-violet", t: "Güvenli ödemeler", d: "Razorpay korumalı ödeme ve doğrulanmış cüzdan yüklemeleri. Sıfır kart verisi depolama." },
    { icon: IndianRupee, tint: "icontint-amber", t: "Gerçekten uygun fiyatlı", d: "Toptan sağlayıcı fiyatlandırması size yansıtılır. 1K başına şeffaf oranlar — asla gizli ücret yok." },
    { icon: Code2, tint: "icontint-rose", t: "Güçlü API + yedekleme", d: "Tek REST API, arkasında birden çok sağlayıcı. Biri yavaşlarsa Kriyava otomatik olarak diğerine yönlendirir. Kesintisiz çalışma." },
  ];
  return (
    <section className="section-pad bg-[color:var(--color-surface)] border-y border-[color:var(--color-line)]">
      <div className="container-x">
        <Reveal>
          <div className="mx-auto mb-12 max-w-[720px] text-center">
            <span className="eyebrow">Neden Kriyava</span>
            <h2 className="h-sec mt-3 text-[color:var(--color-ink)]">Diğer tüm panellerden farklı</h2>
            <p className="lead mx-auto mt-3.5 text-[color:var(--color-muted)]">Çoğu SMM paneli tek bir kaynak üzerinde çalışır. Kriyava her siparişi birden fazla onaylı sağlayıcıya yönlendirir — böylece onların yakalayamayacağı hız, kalıcılık ve çalışma süresi elde edersiniz.</p>
          </div>
        </Reveal>
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {feats.map((f, i) => (
            <StaggerItem key={f.t} slideFrom={i % 2 === 0 ? "left" : "right"}>
              <motion.article
                whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(15,23,42,.12)" }}
                transition={{ duration: 0.22 }}
                className="h-full rounded-[16px] border border-[color:var(--color-line)] bg-white p-7 text-left cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className={`mb-4 grid h-[48px] w-[48px] place-items-center rounded-[14px] text-white ${f.tint}`}
                ><f.icon size={22} /></motion.div>
                <h3 className="text-[18px] font-bold text-[color:var(--color-ink)]">{f.t}</h3>
                <p className="mt-2 text-[14px] text-[color:var(--color-muted)] font-medium">{f.d}</p>
              </motion.article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------------- Hizmet önizlemesi (gerçek veri) ---------------- */
export function ServicesPreview() {
  const cards = useHeadlineCards();
  return (
    <section id="services" className="section-pad">
      <div className="container-x">
        <Reveal>
          <div className="mx-auto mb-12 max-w-[720px] text-center">
            <span className="eyebrow">Hizmetler</span>
            <h2 className="h-sec mt-3 text-[color:var(--color-ink)]">Popüler hizmetler, canlı fiyatlar</h2>
            <p className="lead mx-auto mt-3.5 text-[color:var(--color-muted)]">1.000 başına gerçek başlangıç oranları — sağlayıcı ağımızdan her 30 dakikada bir güncellenir.</p>
          </div>
        </Reveal>
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {cards.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[300px] animate-pulse rounded-[16px] border border-[color:var(--color-line)] bg-slate-50/50" />
              ))
            : cards.slice(0, 6).map((c) => (
                <StaggerItem key={c.label}>
                  <article className="flex flex-col h-full rounded-[16px] border border-[color:var(--color-line)] bg-white p-6 transition-all hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-2xl text-left">
                    <div className="mb-4 flex items-center gap-3 border-b border-[color:var(--color-line-soft)] pb-4">
                      <span className="shrink-0">{platIconNode(c.label, 40)}</span>
                      <b className="font-display text-[15px] font-extrabold text-[color:var(--color-ink)] leading-tight">{c.label}</b>
                    </div>
                    <div className="mb-1 flex items-baseline gap-1.5">
                      <span className="text-[12px] font-bold text-[color:var(--color-muted)]">başlangıç</span>
                      <span className="font-display text-[28px] font-extrabold text-[color:var(--color-primary)]">{fmtINR(c.retail_inr)}</span>
                      <span className="text-[13px] font-bold text-[color:var(--color-muted)]">/ 1K</span>
                    </div>
                    <div className="my-4 flex flex-col gap-2 border-y border-[color:var(--color-line-soft)] py-4 text-[13px]">
                      <Row label="Hız" value={<b className="font-bold text-[color:var(--color-ink)]">{c.speed}</b>} />
                      <Row label="Kalıcılık" value={<Dots q={c.quality} />} />
                      <Row label="Yeniden Dolum" value={<b className="font-bold" style={{ color: /lifetime|days|365/i.test(c.refill) ? "var(--color-success)" : "var(--color-ink)" }}>{c.refill}</b>} />
                    </div>
                    <Link href="/login" className="btn btn-primary btn-block mt-auto !py-2.5 !text-xs rounded-xl">Hemen Sipariş Ver</Link>
                  </article>
                </StaggerItem>
              ))}
        </Stagger>
        <div className="mt-10 text-center">
          <Link href="/login?redirect=/services" className="btn !px-6 !py-3 !text-sm rounded-xl bg-white border border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface)] hover:border-slate-300 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2">
            Tüm hizmetleri incele <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-semibold text-[color:var(--color-muted)]">{label}</span>
      {value}
    </div>
  );
}
function Dots({ q }: { q: number }) {
  return (
    <span className="inline-flex gap-[3px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} className="h-[7px] w-[7px] rounded-full" style={{ background: i < q ? "var(--color-success)" : "rgba(15,23,42,0.1)" }} />
      ))}
    </span>
  );
}
function platIconNode(label: string, size = 40) {
  const l = label.toLowerCase();
  if (l.includes("instagram")) return <IconInstagram size={size} />;
  if (l.includes("youtube"))   return <IconYouTube size={size} />;
  if (l.includes("telegram"))  return <IconTelegram size={size} />;
  if (l.includes("tiktok"))    return <IconTikTok size={size} />;
  if (l.includes("facebook"))  return <IconFacebook size={size} />;
  if (l.includes("whatsapp"))  return <IconWhatsApp size={size} />;
  if (l.includes("spotify"))   return <IconSpotify size={size} />;
  if (l.includes("twitter") || l.includes(" x")) return <IconTwitterX size={size} />;
  return <span className="text-2xl">⚡</span>;
}

/* ---------------- Nasıl Çalışır ---------------- */
export function HowItWorks() {
  const steps = [
    { n: "01", img: "step-1-account", t: "Hesap oluştur",  d: "30 saniyede ücretsiz kaydolun — kart gerekmez.", color: "from-blue-600 to-cyan-500" },
    { n: "02", img: "step-2-wallet",  t: "Bakiye yükleyin",        d: "UPI, kartlar veya netbanking ile yükleme yapın. Anında cüzdan kredisi.", color: "from-violet-600 to-blue-500" },
    { n: "03", img: "step-3-service", t: "Hizmet seçin",   d: "Bir platform seçin, linkinizi yapıştırın, miktarı belirleyin — ya da AI'ın sizin için yapmasına izin verin.", color: "from-pink-600 to-rose-500" },
    { n: "04", img: "step-4-growth",  t: "Büyümeyi izleyin",     d: "Panelinizden teslimatı canlı takip edin ve durum güncellemeleri alın.", color: "from-emerald-500 to-teal-400" },
  ];
  return (
    <section id="how" className="section-pad bg-[color:var(--color-surface)] border-y border-[color:var(--color-line)]">
      <div className="container-x">
        <Reveal>
          <div className="mx-auto mb-12 max-w-[720px] text-center">
            <span className="eyebrow">Nasıl Çalışır</span>
            <h2 className="h-sec mt-3 text-[color:var(--color-ink)]">Kayıttan büyümeye dakikalar içinde</h2>
            <p className="lead mx-auto mt-3.5 text-[color:var(--color-muted)]">Sözleşme yok, öğrenme eğrisi yok. Dört adım ve rakamlarınız hareketlenmeye başlar.</p>
          </div>
        </Reveal>

        {/* ── MOBİL: dikey zaman çizelgesi (< sm) ── */}
        <div className="relative sm:hidden">
          <div className="absolute left-[19px] top-10 bottom-8 w-[2px] bg-gradient-to-b from-blue-200 via-violet-200 to-emerald-200" />
          <div className="flex flex-col gap-8">
            {steps.map((s, idx) => (
              <SlideIn key={s.n} direction="left" delay={0} className="relative pl-12">
                <span className={`absolute left-0 top-3 z-10 grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-gradient-to-br ${s.color} font-display text-[14px] font-extrabold text-white shadow-md`}>{s.n}</span>
                <div className="rounded-[16px] border border-[color:var(--color-line)] bg-white overflow-hidden shadow-sm">
                  <div className="relative h-[140px] overflow-hidden"
                    style={{ background: "linear-gradient(150deg,#eaf2ff 0%,#f5f9ff 45%,#ecfdf7 100%)" }}>
                    <Image src={`/assets/${s.img}.png`} alt={s.t} fill className="object-contain p-4 pointer-events-none" sizes="100vw" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-[17px] font-bold text-[color:var(--color-ink)]">{s.t}</h3>
                    <p className="mt-1 text-[13px] text-[color:var(--color-muted)] font-medium leading-relaxed">{s.d}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="absolute -bottom-4 left-[18px] h-2 w-2 rounded-full bg-slate-300" />
                )}
              </SlideIn>
            ))}
          </div>
        </div>

        {/* ── MASAÜSTÜ: 4 sütunlu grid (sm+) ── */}
        <Stagger className="hidden sm:grid grid-cols-2 gap-5 lg:grid-cols-4" stagger={0.07}>
          {steps.map((s) => (
            <StaggerItem key={s.n}>
              <article className="group relative overflow-hidden rounded-[16px] border border-[color:var(--color-line)] bg-white p-5 text-center transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-slate-300 h-full">
                <span className={`absolute left-4 top-3.5 z-2 grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-gradient-to-br ${s.color} font-display text-[13px] font-extrabold text-white shadow-md`}>{s.n}</span>
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-[14px] border border-[color:var(--color-line)]"
                  style={{ background: "linear-gradient(150deg,#eaf2ff 0%,#f5f9ff 45%,#ecfdf7 100%)" }}>
                  <Image src={`/assets/${s.img}.png`} alt={s.t} fill className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.06] pointer-events-none" sizes="25vw" />
                </div>
                <h3 className="text-[17px] font-bold text-[color:var(--color-ink)]">{s.t}</h3>
                <p className="mt-2 text-[13px] text-[color:var(--color-muted)] font-medium">{s.d}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ── Daktilo efekti ── */
const CODE_SNIPPET = `// EasySMM → LuvSMM → FineSMM otomatik yönlendirme
const res = await fetch(
  "https://kriyava-api-82kg9.ondigitalocean.app/api",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer API_ANAHTARINIZ"
    },
    body: JSON.stringify({
      action: "add",
      service: "easy:641",
      link: "https://instagram.com/markaniz",
      quantity: 1000
    })
  }
);
// → { "order": "...", "provider": "EasySMM" }`;

function TypewriterCode() {
  const [text, setText] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setText(CODE_SNIPPET); return; }
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && !started) setStarted(true); },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timeout = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setText(CODE_SNIPPET.slice(0, i));
        if (i >= CODE_SNIPPET.length) clearInterval(id);
      }, 14);
      return () => clearInterval(id);
    }, 300);
    return () => clearTimeout(timeout);
  }, [started]);

  const done = text.length >= CODE_SNIPPET.length;
  return (
    <pre ref={ref} className="overflow-auto p-5 font-mono text-[12px] leading-[1.8] text-[#e2e8f0] min-h-[220px]">
      {text}
      {!done && <span className="inline-block w-[2px] h-[14px] bg-[#7dd3fc] ml-[1px] animate-pulse align-middle" />}
    </pre>
  );
}

/* ---------------- API bölümü ---------------- */
export function ApiSection() {
  const feats = ["REST API", "Toplu siparişler", "Sipariş takibi", "Beyaz etiket", "Çoklu sağlayıcı yedekleme", "Webhook (yakında)"];
  return (
    <section id="api" className="section-pad">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] p-[clamp(32px,5vw,64px)] text-white" style={{ background: "radial-gradient(120% 120% at 0% 0%,#0b1220 0%,#0f172a 45%,#111c3a 100%)" }}>
            <div className="relative z-1 grid items-center gap-12 lg:grid-cols-2">
              <SlideIn direction="left">
                <span className="eyebrow" style={{ color: "#7dd3fc" }}>Bayiler için API</span>
                <h2 className="mt-3.5 text-[clamp(26px,3.6vw,38px)] font-extrabold text-white">Kendi SMM imparatorluğunuzu bizim altyapımızda kurun</h2>
                <p className="lead mt-3.5" style={{ color: "#94a3b8" }}>Tek temiz REST API, arkasında birden çok sağlayıcı. Siparişleri otomatikleştirin, durumu senkronize edin ve her şeyi kendi markanız altında beyaz etiketleyin.</p>
                <div className="my-6 grid grid-cols-2 gap-3">
                  {feats.map((f, i) => (
                    <motion.div key={f}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.38 }}
                      className="flex items-center gap-2.5 text-[13.5px] font-semibold text-[#cbd5e1]">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[rgba(16,185,129,.16)]"><Check size={12} color="#34d399" /></span>{f}
                    </motion.div>
                  ))}
                </div>
                <Link href="/login?redirect=/api-docs" className="btn btn-cta !px-6 !py-3 !text-sm">API Dökümanını Gör →</Link>
              </SlideIn>
              <SlideIn direction="right">
                <div className="overflow-hidden rounded-[16px] border border-[rgba(148,163,184,.18)] bg-[#0a0f1f] shadow-[0_24px_60px_rgba(0,0,0,.5)]">
                  <div className="flex items-center gap-[7px] border-b border-[rgba(148,163,184,.15)] px-4 py-3">
                    <i className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
                    <i className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
                    <i className="h-[10px] w-[10px] rounded-full bg-[#28c840]" />
                    <span className="ml-2 font-mono text-[11px] text-[#64748b]">POST /api — sipariş ver</span>
                  </div>
                  <TypewriterCode />
                </div>
              </SlideIn>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Fiyatlandırma ---------------- */
export function Pricing() {
  const plans = [
    { name: "Başlangıç", desc: "Kendi hesaplarını büyüten içerik üreticileri için.", price: "0", cyc: "/ süresiz", feat: false, cls: "btn-ghost", cta: "Ücretsiz hesap oluştur", benefits: ["Kullandıkça öde cüzdan", "Tüm platformlar ve hizmetler", "Standart teslimat hızı", "E-posta ve sohbet desteği"] },
    { name: "Profesyonel", desc: "Güç kullanıcıları ve ciddi içerik üreticileri için.", price: "1.999", cyc: "/ ay", feat: true, cls: "btn-primary", cta: "Profesyonel Başla", benefits: ["Başlangıç'taki her şey", "Öncelikli teslimat ve destek", "Doğrulanmış Razorpay cüzdan yüklemeleri", "Tam REST API erişimi"] },
    { name: "Ajans", desc: "Bayiler ve ekipler için beyaz etiket panel.", price: "4.999", cyc: "/ ay", feat: false, cls: "btn-cta", cta: "Panelini başlat", benefits: ["Profesyonel'deki her şey", "Beyaz etiket alt panel", "Özel alan adı ve markalama", "Ajans CRM ve en düşük oranlar"] },
  ];
  return (
    <section id="pricing" className="section-pad bg-[color:var(--color-surface)]">
      <div className="container-x">
        <Reveal>
          <div className="mx-auto mb-12 max-w-[720px] text-center">
            <span className="eyebrow">Fiyatlandırma</span>
            <h2 className="h-sec mt-3">Ücretsiz başlayın. Hazır olduğunuzda ölçeklenin.</h2>
            <p className="lead mx-auto mt-3.5">Cüzdan tabanlı — sadece sipariş verdiğiniz kadar ödersiniz. Planlar daha iyi oranlar, API limitleri ve bayi araçları sunar.</p>
          </div>
        </Reveal>
        <div className="mx-auto grid max-w-[440px] grid-cols-1 items-stretch gap-6 lg:max-w-none lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`relative flex flex-col rounded-[16px] bg-white p-8 transition-all hover:-translate-y-1.5 ${p.feat ? "shadow-[var(--shadow-lg-soft)]" : "border border-[color:var(--color-line)] hover:shadow-[var(--shadow-md-soft)]"}`} style={p.feat ? { border: "1.5px solid transparent", background: "linear-gradient(#fff,#fff) padding-box,linear-gradient(140deg,var(--color-primary),var(--color-secondary)) border-box" } : undefined}>
              {p.feat && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-secondary)] px-3.5 py-1.5 text-[11.5px] font-extrabold tracking-[0.04em] text-white shadow-[var(--shadow-glow)]">En Popüler</span>}
              <h3 className="text-[18px] font-bold">{p.name}</h3>
              <p className="mt-1 min-h-[38px] text-[13.5px] text-[color:var(--color-muted)]">{p.desc}</p>
              <div className="my-4 flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold">₹</span>
                <span className="font-display text-[42px] font-extrabold tracking-[-0.03em]">{p.price}</span>
                <span className="text-[14px] font-semibold text-[color:var(--color-muted)]">{p.cyc}</span>
              </div>
              <ul className="mb-6 mt-2 flex flex-col gap-3">
                {p.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[14px] text-[#334155]">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[rgba(16,185,129,.12)]"><Check size={13} color="#10B981" /></span>{b}
                  </li>
                ))}
              </ul>
              <Link href="/login" className={`btn ${p.cls} btn-block mt-auto`}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SSS ---------------- */
export function Faq() {
  const qa = [
    ["Kriyava kullanmak hesabım için güvenli mi?", "Evet. Asla şifrenizi istemeyiz — sadece herkese açık profil veya gönderi linkinizi. Teslimat doğal görünmesi için kademeli yapılır ve hesabınızı sağlıklı tutmak için yüksek kalıcılıklı, düşük düşüşlü hizmetler sunarız."],
    ["Siparişim ne kadar hızlı başlar?", "Çoğu hizmet saniyeler ila birkaç dakika içinde başlar. Her hizmet kartı, sipariş vermeden önce tam ortalama başlangıç süresini ve günlük hızını gösterir."],
    ["Sağlayıcı yedekleme nedir?", "Kriyava birden fazla onaylı sağlayıcıya bağlıdır (ana LuvSMM, yedek EasySMM). Bir kaynak yavaşsa veya stokta yoksa, siparişinizi otomatik olarak bir sonraki sağlıklı sağlayıcıya yönlendiririz."],
    ["Takipçiler düşerse yeniden dolum sunuyor musunuz?", "Birçok hizmet 30 gün, 365 gün veya ömür boyu yeniden dolum içerir. Yeniden dolum penceresi her hizmette açıkça belirtilir ve panelinizden tek tıkla talep edilebilir."],
    ["Hangi ödeme yöntemlerini kabul ediyorsunuz?", "Razorpay aracılığıyla UPI, kredi/banka kartları, netbanking ve cüzdanlar — tamamen güvenli. Ödeme doğrulandıktan sonra fonlar Kriyava cüzdanınıza eklenir."],
    ["Kendi markamla satış yapabilir miyim?", "Kesinlikle. Ajans planı size kendi alan adınız, logonuz, markalamanız ve fiyatlandırmanızla beyaz etiket bir alt panel sunar — API'miz ve otomatik sipariş yönlendirmemiz tarafından desteklenir."],
    ["AI asistan gerçekten sipariş verebiliyor mu?", "Evet. Kriyava AI etkendir — ne istediğinizi söyleyin, en iyi hizmeti bulur, bakiyenizi kontrol eder ve sizin için siparişi verir. Köşedeki sohbet düğmesini deneyin."],
    ["Minimum yatırma tutarı nedir?", "₹10 gibi düşük bir tutarla başlayabilirsiniz. Başlangıç planında aylık minimum tutar yoktur — sadece verdiğiniz siparişler için ödeme yaparsınız."],
  ];
  return (
    <section id="faq" className="section-pad">
      <div className="container-x">
        <Reveal>
          <div className="mx-auto mb-12 max-w-[720px] text-center">
            <span className="eyebrow">SSS</span>
            <h2 className="h-sec mt-3">Sorularınız, yanıtlandı</h2>
          </div>
        </Reveal>
        <div className="mx-auto max-w-[780px]">
          {qa.map(([q, a], i) => (
            <details key={i} className="group mb-3 overflow-hidden rounded-[14px] border border-[color:var(--color-line)] bg-white open:border-[#dbe3ec] open:shadow-[var(--shadow-sm-soft)]" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-[22px] py-[18px] font-display text-[15.5px] font-bold [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown size={20} className="shrink-0 text-[color:var(--color-muted)] transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-[22px] pb-5 text-[14.5px] leading-[1.7] text-[color:var(--color-muted)]">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Son CTA ---------------- */
export function FinalCta() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] p-[clamp(32px,5vw,64px)] text-white" style={{ background: "radial-gradient(120% 140% at 50% 0%,#1d4ed8 0%,#2563EB 40%,#0ea5b7 100%)" }}>
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.08) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
                maskImage: "radial-gradient(ellipse 70% 80% at 50% 0%,#000,transparent 70%)",
                WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 0%,#000,transparent 70%)",
              }}
            />
            <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2 text-left">
              <div>
                <h2 className="text-[clamp(26px,3.8vw,44px)] font-black text-white leading-[1.1] tracking-tight">
                  Sosyal medyanızı <br />ölçeklendirmeye hazır mısınız?
                </h2>
                <p className="mt-4 max-w-[46ch] text-[16px] text-white/90 leading-relaxed font-medium">
                  Kriyava'nın gelişmiş otomasyon platformuyla daha hızlı büyüyen 50.000'den fazla içerik üreticisi, ajans ve bayiye katılın.
                </p>
                <div className="mt-8 flex flex-wrap gap-3.5">
                  <Link href="/login" className="btn btn-cta btn-lg shadow-xl hover:-translate-y-0.5">
                    Ücretsiz Hesap Oluştur
                  </Link>
                  <Link href="/login?redirect=/services" className="btn btn-lg transition-all hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "1px solid rgba(255,255,255,.3)" }}>
                    Hizmetleri İncele
                  </Link>
                </div>
                <p className="mt-4.5 text-[12px] text-white/70 font-semibold">
                  Kredi kartı gerekmez · ₹10'dan başlayın · İstediğiniz zaman iptal edin
                </p>
              </div>

              <div className="relative flex items-center justify-center min-h-[300px]">
                <span className="absolute h-[260px] w-[260px] rounded-full opacity-30 blur-[40px] bg-cyan-300/30 animate-pulse pointer-events-none" />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full max-w-[340px] flex justify-center"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full aspect-square rounded-[24px] overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md shadow-2xl group"
                  >
                    <Image
                      src="/assets/final_cta_growth.png"
                      alt="Sosyal Medya Büyüme İllüstrasyonu"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                      sizes="(max-width:768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
