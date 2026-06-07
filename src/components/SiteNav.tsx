"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/services", label: "Hizmetler" },
  { href: "/#pricing", label: "Fiyatlar" },
  { href: "/login?redirect=/api-docs", label: "API" },
  { href: "/blog", label: "Blog" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="sticky top-0 z-60 px-3 sm:px-4 pt-3">
      <div className="container-x !px-0">
        <nav
          aria-label="Primary"
          className="flex h-[60px] items-center justify-between rounded-2xl px-3 sm:px-4 transition-all duration-300"
          style={{
            background: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)",
            backdropFilter: "saturate(180%) blur(20px)",
            WebkitBackdropFilter: "saturate(180%) blur(20px)",
            border: "1px solid rgba(226,232,240,0.9)",
            boxShadow: scrolled
              ? "0 8px 30px rgba(15,23,42,0.10), 0 1px 0 rgba(255,255,255,0.6) inset"
              : "0 2px 14px rgba(15,23,42,0.05), 0 1px 0 rgba(255,255,255,0.6) inset",
          }}
        >
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Kriyava SMM home">
            <span className="h-9 w-9 overflow-hidden rounded-[11px] shrink-0 transition-transform group-hover:scale-105" style={{ boxShadow: "var(--shadow-glow)" }}>
              <Image src="/assets/logo-128.png" alt="" width={36} height={36} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-[18px] font-extrabold tracking-tight leading-none text-[color:var(--color-ink)]">
                Kriyava
              </span>
              <small className="text-[8.5px] font-bold tracking-[0.16em] text-slate-400 uppercase mt-[1px]">
                SMM Panel
              </small>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[14px] font-semibold text-[#475569] px-3.5 py-2 rounded-lg transition-all hover:text-[color:var(--color-ink)] hover:bg-slate-100/70 whitespace-nowrap"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl bg-[color:var(--color-cta)] px-5 py-2.5 text-[13.5px] font-bold text-[#3b2200] shadow-[0_6px_18px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--color-cta-600)] hover:shadow-[0_10px_24px_rgba(245,158,11,0.38)]"
            >
              Giriş Yap
            </Link>
            <button
              className="grid h-[40px] w-[40px] place-items-center rounded-xl border border-[color:var(--color-line)] bg-white/80 text-[color:var(--color-ink)] lg:hidden cursor-pointer hover:bg-slate-100 transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`absolute inset-x-0 z-55 border-b border-[color:var(--color-line)] bg-white/95 backdrop-blur-md shadow-2xl lg:hidden transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-6 space-y-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-[10px] px-3 py-3.5 font-semibold text-slate-700 hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-ink)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3">
            <Link href="/login" onClick={() => setOpen(false)} className="btn btn-cta btn-block">
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
