"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, TrendingUp } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Reveal } from "../Reveal";
import { CountUp } from "../CountUp";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-[clamp(32px,5vw,64px)] pb-16 lg:pb-20 bg-white">
      {/* bg */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #eef4ff 0%, #f5faff 30%, #ffffff 55%, #ecfdf7 100%)"
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 55% at 80% 8%, rgba(37,99,235,0.22), transparent 70%), radial-gradient(45% 55% at 10% 20%, rgba(6,182,212,0.18), transparent 70%), radial-gradient(55% 60% at 55% 100%, rgba(16,185,129,0.16), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(51,65,85,0.32) 1px,transparent 1px),linear-gradient(90deg,rgba(51,65,85,0.32) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 76% 12%, rgba(37,99,235,0.16) 0 18px, transparent 19px), radial-gradient(circle at 85% 22%, rgba(6,182,212,0.16) 0 14px, transparent 15px), radial-gradient(circle at 68% 6%, rgba(16,185,129,0.14) 0 12px, transparent 13px)",
            backgroundSize: "38px 38px, 38px 38px, 38px 38px",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[50%] origin-bottom"
          style={{
            transform: "perspective(520px) rotateX(60deg)",
            backgroundImage:
              "linear-gradient(rgba(37,99,235,0.35) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.35) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to top, #000 10%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to top, #000 10%, transparent 90%)",
          }}
        />
        <span
          className="absolute -top-40 -right-28 h-[520px] w-[520px] rounded-full opacity-50 blur-[80px]"
          style={{ background: "radial-gradient(circle,#bfdbfe,transparent 70%)" }}
        />
        <span
          className="absolute top-28 -left-40 h-[460px] w-[460px] rounded-full opacity-45 blur-[80px]"
          style={{ background: "radial-gradient(circle,#a5f3fc,transparent 70%)" }}
        />
      </div>

      <div className="container-x grid items-center gap-10 lg:gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <div className="flex justify-center lg:justify-start">
              <span className="badge inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-[#334155] shadow-sm backdrop-blur-md">
                <span className="h-[6px] w-[6px] rounded-full bg-[color:var(--color-success)] shadow-[0_0_0_3px_rgba(34,197,94,.18)] animate-pulse" />
                🚀 1.000'den fazla içerik üreticisi tarafından tercih ediliyor
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 text-[clamp(28px,4.2vw,50px)] font-black leading-[1.1] text-[color:var(--color-ink)] tracking-tight text-center lg:text-left">
              Sosyal medya hesaplarınızı{" "}
              <span className="grad-text">her zamankinden daha hızlı büyütün</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-[52ch] text-[clamp(14px,1.6vw,18px)] text-[color:var(--color-muted)] font-medium text-center lg:text-left mx-auto lg:mx-0">
              Yüksek kaliteli takipçi, beğeni, izlenme ve etkileşim — Kriyava'nın gerçek zamanlı sağlayıcı yedeklemeli gelişmiş otomasyon platformuyla güvenle teslim edilir.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-6 flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start w-full max-w-[340px] sm:max-w-none mx-auto lg:mx-0">
              <Link href="/login" className="btn btn-cta w-full sm:w-auto !px-5 !py-2.5 !text-[13px] rounded-xl shadow-[0_8px_20px_rgba(245,158,11,0.25)] hover:-translate-y-0.5">
                Hemen Büyümeye Başla <ArrowRight size={15} />
              </Link>
              <Link href="/login?redirect=/services" className="btn w-full sm:w-auto !px-5 !py-2.5 !text-[13px] rounded-xl bg-white border border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface)] hover:border-slate-300 transition-all hover:-translate-y-0.5">
                Hizmetleri İncele
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-row flex-nowrap items-center justify-center lg:justify-start gap-3 sm:gap-6">
              <div className="flex flex-col gap-0.5 text-center lg:text-left items-center lg:items-start">
                <span className="text-[12px] sm:text-[13px] tracking-[2px] text-[color:var(--color-cta)]">★★★★★</span>
                <b className="font-display text-[14px] sm:text-[15px] font-extrabold text-[color:var(--color-ink)] whitespace-nowrap">4.9/5 <span className="text-[10px] sm:text-[11px] font-semibold text-[color:var(--color-muted)]">Değerlendirme</span></b>
              </div>
              <div className="h-[30px] w-px bg-[color:var(--color-line)] shrink-0" />
              <div className="flex flex-col gap-0.5 text-center lg:text-left items-center lg:items-start">
                <b className="font-display text-[14px] sm:text-[15px] font-extrabold text-[color:var(--color-ink)]"><CountUp to={5000} suffix="K+" divide={1000} /></b>
                <span className="text-[9.5px] sm:text-[11px] font-bold text-[color:var(--color-muted)] uppercase tracking-wide whitespace-nowrap">Müşteri</span>
              </div>
              <div className="h-[30px] w-px bg-[color:var(--color-line)] shrink-0" />
              <div className="flex flex-col gap-0.5 text-center lg:text-left items-center lg:items-start">
                <b className="font-display text-[14px] sm:text-[15px] font-extrabold text-[color:var(--color-ink)]"><CountUp to={10000} suffix="K+" divide={1000} /></b>
                <span className="text-[9.5px] sm:text-[11px] font-bold text-[color:var(--color-muted)] uppercase tracking-wide whitespace-nowrap">Sipariş</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <DashboardMock />
        </Reveal>
      </div>
    </section>
  );
}

function DashboardMock() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const outerNodes = [
    { component: SpotifyIcon, angle: 0 },
    { component: TikTokIcon, angle: 60 },
    { component: FacebookIcon, angle: 120 },
    { component: DiscordIcon, angle: 180 },
    { component: LoveIcon, angle: 240 },
    { component: LikeIcon, angle: 300 }
  ];

  const innerNodes = [
    { component: InstagramIcon, angle: 0 },
    { component: TelegramIcon, angle: 72 },
    { component: YouTubeIcon, angle: 144 },
    { component: ViewIcon, angle: 216 },
    { component: ShareIcon, angle: 288 }
  ];

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center min-h-[350px] sm:min-h-[460px] w-full max-w-[500px] mx-auto scale-[0.72] xs:scale-[0.82] sm:scale-100 origin-center transition-all duration-300 ease-out cursor-pointer select-none"
    >
      <div className="absolute inset-0 flex items-center justify-center -z-10" style={{ transform: "translateZ(-40px)" }}>
        <span className="absolute h-[320px] w-[320px] rounded-full opacity-40 blur-[40px] bg-blue-400/20 pointer-events-none" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="absolute w-[360px] h-[360px] rounded-full border border-slate-200/40 border-dashed flex items-center justify-center"
        >
          {outerNodes.map((node, i) => {
            const Icon = node.component;
            return (
              <div
                key={i}
                className="absolute"
                style={{ transform: `rotate(${node.angle}deg) translate(180px)` }}
              >
                <motion.div
                  initial={{ rotate: -node.angle }}
                  animate={{ rotate: -node.angle - 360 }}
                  transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                  className="p-1 rounded-xl bg-white shadow-md border border-slate-100/80 transition-transform duration-300 hover:scale-115"
                >
                  <Icon />
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute w-[240px] h-[240px] rounded-full border border-slate-200/50 border-dashed flex items-center justify-center"
        >
          {innerNodes.map((node, i) => {
            const Icon = node.component;
            return (
              <div
                key={i}
                className="absolute"
                style={{ transform: `rotate(${node.angle}deg) translate(120px)` }}
              >
                <motion.div
                  initial={{ rotate: -node.angle }}
                  animate={{ rotate: -node.angle + 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  className="p-1 rounded-xl bg-white shadow-md border border-slate-100/80 transition-transform duration-300 hover:scale-115"
                >
                  <Icon />
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-28 h-28 rounded-full border border-slate-200/80 bg-white/90 p-4 shadow-[var(--shadow-lg-soft)] flex items-center justify-center backdrop-blur-md"
        style={{ transform: "translateZ(30px)" }}
      >
        <Image
          src="/assets/logo-c-orbit.png"
          alt="Kriyava SMM Logo"
          width={80}
          height={80}
          className="object-contain pointer-events-none"
          priority
        />
        <span className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping opacity-60 pointer-events-none" />
      </motion.div>

      <motion.div
        style={{ translateZ: 80 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-[12%] hidden sm:flex items-center gap-2.5 rounded-[12px] border border-[color:var(--color-line)] bg-white/90 px-3.5 py-3 text-[11.5px] font-bold shadow-[var(--shadow-md-soft)] backdrop-blur-md text-left"
      >
        <span className="grid h-[30px] w-[30px] place-items-center rounded-[8px] icontint-green text-white shadow-sm"><Check size={15} /></span>
        <div>
          <span className="text-[color:var(--color-ink)]">Sipariş Tamamlandı</span>
          <small className="block text-[9.5px] font-medium text-[color:var(--color-muted)] mt-0.5">+10.000 izlenme • 2 sn önce</small>
        </div>
      </motion.div>

      <motion.div
        style={{ translateZ: 100 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute left-0 bottom-[14%] hidden sm:flex items-center gap-2.5 rounded-[12px] border border-[color:var(--color-line)] bg-white/90 px-3.5 py-3 text-[11.5px] font-bold shadow-[var(--shadow-md-soft)] backdrop-blur-md text-left"
      >
        <span className="grid h-[30px] w-[30px] place-items-center rounded-[8px] icontint-violet text-white shadow-sm"><TrendingUp size={15} /></span>
        <div>
          <span className="text-[color:var(--color-ink)]">+1.250 Takipçi</span>
          <small className="block text-[9.5px] font-medium text-[color:var(--color-muted)] mt-0.5">Instagram • şu an aktif</small>
        </div>
      </motion.div>

      <motion.div
        style={{ translateZ: 60 }}
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute left-[8%] top-[10%] hidden sm:flex flex-col rounded-xl border border-[color:var(--color-line)] bg-white/90 p-3 shadow-[var(--shadow-sm-soft)] backdrop-blur-md text-left"
      >
        <div className="text-[9.5px] font-bold text-[color:var(--color-muted)] uppercase tracking-wider">Canlı Siparişler</div>
        <div className="mt-1 font-display text-[16px] font-black text-[color:var(--color-ink)]">12.480</div>
        <div className="mt-0.5 text-[9px] font-extrabold text-[color:var(--color-success)] flex items-center gap-0.5">▲ 18.2%</div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Social & Engagement Icons ---------------- */

function InstagramIcon() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}>
      <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    </div>
  );
}

function YouTubeIcon() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FF0000] shadow-sm">
      <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.522 3.536 12 3.536 12 3.536s-7.522 0-9.388.52a3.003 3.003 0 0 0-2.11 2.107C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.866.52 9.388.52 9.388.52s7.522 0 9.388-.52a3.003 3.003 0 0 0 2.11-2.107C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    </div>
  );
}

function FacebookIcon() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1877F2] shadow-sm">
      <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    </div>
  );
}

function TikTokIcon() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#010101] shadow-sm">
      <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.03 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.17 1.12 1.22 2.69 1.95 4.32 2.11v3.96c-1.78-.17-3.52-.89-4.88-2.08-.12.09-.16.27-.16.42v7.1c-.04 2.13-.88 4.22-2.48 5.61-1.8 1.56-4.37 2.15-6.69 1.51-2.44-.68-4.52-2.61-5.18-5.06-.82-3.06.63-6.49 3.49-7.79 1.38-.63 2.94-.79 4.42-.48V13.8c-.89-.22-1.86-.15-2.68.28-.96.51-1.63 1.52-1.77 2.61-.2 1.62.77 3.23 2.3 3.65 1.25.34 2.67-.13 3.32-1.2.33-.55.43-1.2.42-1.84V.02z" />
      </svg>
    </div>
  );
}

function TelegramIcon() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2EA6DA] shadow-sm">
      <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.885 8.877c-.142.634-.518.791-1.05.492l-2.875-2.119-1.387 1.334c-.153.153-.282.282-.577.282l.206-2.923 5.321-4.808c.231-.206-.05-.32-.36-.114L8.718 12.38 5.885 11.5c-.616-.192-.628-.616.129-.912l11.085-4.272c.513-.192.96.114.763.945z" />
      </svg>
    </div>
  );
}

function SpotifyIcon() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1ED760] shadow-sm">
      <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.503 17.31c-.223.367-.702.487-1.07.264-3.007-1.838-6.793-2.254-11.25-1.233-.418.095-.83-.17-.927-.588-.096-.418.172-.83.59-.927 4.886-1.116 9.06-.64 12.443 1.427.37.224.488.703.264 1.072zm1.47-3.26c-.28.455-.88.602-1.332.32-3.44-2.115-8.69-2.73-12.75-1.498-.512.155-1.054-.137-1.21-.65-.155-.512.138-1.053.65-1.21 4.636-1.407 10.424-.72 14.32 1.674.455.28.602.88.32 1.333zm.126-3.41C15.222 8.243 8.8 8.032 5.093 9.157c-.596.18-1.226-.164-1.407-.76-.18-.596.164-1.227.76-1.407 4.253-1.29 11.338-1.05 16.03 1.737.535.318.71 1.01.393 1.54-.316.533-1.008.708-1.54.39z" />
      </svg>
    </div>
  );
}

function DiscordIcon() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#5865F2] shadow-sm">
      <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
      </svg>
    </div>
  );
}

function LoveIcon() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-red-500 to-rose-600 shadow-sm shadow-red-500/30 animate-pulse">
      <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
}

function LikeIcon() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm shadow-blue-500/30">
      <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M2 21h3V8H2v13zm20-11.83C22 8.08 21.1 7.2 20 7.2h-5.69l.86-4.14.03-.3c0-.38-.16-.74-.41-1L13.8 1 7.41 7.4C7.05 7.76 6.8 8.26 6.8 8.8v10.2c0 1.1.9 2 2 2h8.38c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.02-.01z" />
      </svg>
    </div>
  );
}

function ViewIcon() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-rose-500 to-red-600 shadow-sm shadow-rose-500/30">
      <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
    </div>
  );
}

function ShareIcon() {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-400 to-teal-500 shadow-sm shadow-cyan-500/30">
      <svg className="w-4.5 h-4.5 text-white fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
    </div>
  );
}
