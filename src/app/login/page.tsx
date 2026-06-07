"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Lock, Sparkles, AlertCircle, Eye, EyeOff, RefreshCw } from "lucide-react";
import { createAccountCache, saveAccount } from "@/lib/account";
import { api, setToken, ApiError } from "@/lib/api";
import { isFirebaseConfigured, signInWithGoogle } from "@/lib/firebase";

const LAST_GOOGLE_KEY = "kriyava_last_google";

interface LastGoogleUser { name: string; email: string; photoURL?: string }

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastGoogle, setLastGoogle] = useState<LastGoogleUser | null>(null);

  // Load last-signed-in Google account on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_GOOGLE_KEY);
      if (raw) setLastGoogle(JSON.parse(raw) as LastGoogleUser);
    } catch { /* ignore */ }
  }, []);

  const refCode = searchParams.get("ref") || "";

  // Handle preset signup mode (?mode=up or ?ref=CODE)
  useEffect(() => {
    if (searchParams.get("mode") === "up" || searchParams.get("ref")) {
      setMode("up");
    }
  }, [searchParams]);

  const hydrateFromApi = (
    u: { name: string; email: string; balance: number; spent: number; apiKey?: string },
    avatarUrl?: string,
  ) => {
    saveAccount(
      createAccountCache({
        name: u.name || "İçerik Üretici",
        email: u.email,
        avatarUrl,
        balance: u.balance,
        spent: u.spent,
        apiKey: u.apiKey,
      }),
    );
  };

  const googleAuth = async () => {
    setError("");
    if (!isFirebaseConfigured()) {
      setError("Google girişi kurulum aşamasında. Lütfen şimdilik e-posta kullanın.");
      return;
    }
    setLoading(true);
    try {
      const g = await signInWithGoogle(); // opens Google popup
      const res = await api.social(g.idToken, refCode || undefined); // backend verifies idToken
      setToken(res.token, true); // Google auth always persists
      hydrateFromApi(res.user, g.photoURL);
      localStorage.setItem(LAST_GOOGLE_KEY, JSON.stringify({ name: g.name, email: g.email, photoURL: g.photoURL }));
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Giriş iptal edildi";
      if (!/popup|cancel|closed/i.test(msg)) setError("Google girişi başarısız oldu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Lütfen e-posta adresinizi girin.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (mode === "up" && name.trim().length < 2) {
      setError("Lütfen adınızı girin.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res =
        mode === "up"
          ? await api.register(email.trim(), name.trim(), password, refCode || undefined)
          : await api.login(email.trim(), password);
      setToken(res.token, remember);
      hydrateFromApi(res.user);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setError("Sunucuya ulaşılamadı. Lütfen biraz sonra tekrar deneyin.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex">
      {/* SOL PANEL: MARKA GÖSTERİMİ (MASAÜSTÜ) */}
      <aside className="hidden lg:flex w-[48%] relative overflow-hidden p-12 flex-col justify-between bg-gradient-to-br from-indigo-950 via-blue-950 to-cyan-950">
        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(circle at 0% 0%,#000 30%,transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at 0% 0%,#000 30%,transparent 70%)",
          }}
        />

        {/* glow highlights */}
        <span className="absolute -top-20 -right-20 h-[380px] w-[380px] rounded-full opacity-30 blur-[90px] bg-purple-600" />
        <span className="absolute -bottom-20 -left-20 h-[320px] w-[320px] rounded-full opacity-20 blur-[80px] bg-cyan-500" />

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <span className="h-9 w-9 overflow-hidden rounded-[10px] bg-white/10 p-1.5 flex items-center justify-center">
            <Image src="/assets/logo-128.png" alt="" width={28} height={28} />
          </span>
          <div className="flex flex-col text-left">
            <span className="font-display font-black text-[18px] tracking-tight leading-none">Kriyava</span>
            <span className="text-[8.5px] font-extrabold text-blue-400 uppercase tracking-[0.18em] mt-0.5">SMM Panel</span>
          </div>
        </Link>

        {/* BODY INTRO */}
        <div className="relative z-10 max-w-lg my-auto text-left">
          <h2 className="font-display text-[44px] font-extrabold leading-[1.08] tracking-tight">
            Daha hızlı büyüyün.<br />Daha az ödeyin.<br />Daha akıllı ölçeklenin.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-slate-300 max-w-[42ch]">
            Kriyava'nın otomatik çoklu sağlayıcı yönlendirme motorunu kullanarak her platformda ölçeklenen 50.000'den fazla içerik üreticisi, pazarlamacı ve bayiye katılın.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "%300 bayi marjı ile toptan fiyatlar",
              "Siparişlerinizi sizin için halleden yapay zeka sohbet asistanı",
              "LuvSMM + EasySMM yedekleme koruması — sıfır kesinti",
            ].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-200 font-bold text-sm">
                <span className="grid h-[26px] w-[26px] place-items-center rounded-lg bg-white/10 shrink-0 text-emerald-400">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FOOTER STATS */}
        <div className="relative z-10 flex gap-10">
          {[
            ["50B+", "Müşteri"],
            ["1M+", "Verilen Sipariş"],
            ["%99,9", "Başarı Oranı"],
          ].map(([val, label]) => (
            <div key={label} className="text-left">
              <b className="font-display text-2xl font-black block leading-none">{val}</b>
              <span className="text-[11.5px] text-slate-400 font-bold tracking-wide uppercase mt-1 block">{label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* SAĞ PANEL: ETKİLEŞİMLİ FORM */}
      <main className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 xl:px-32 max-w-2xl mx-auto w-full relative">
        <div className="absolute top-8 left-6 md:left-12 lg:left-16 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white font-bold text-xs">
            <ArrowLeft size={14} /> Ana sayfaya dön
          </Link>
        </div>

        <div className="w-full">
          {/* Logo on mobile/tablet */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <span className="h-9 w-9 overflow-hidden rounded-[10px] bg-blue-600/20 p-1.5 flex items-center justify-center">
                <Image src="/assets/logo-128.png" alt="" width={28} height={28} />
              </span>
              <div className="flex flex-col text-left">
                <span className="font-display font-black text-[18px] tracking-tight leading-none">Kriyava</span>
                <span className="text-[8.5px] font-extrabold text-blue-400 uppercase tracking-[0.18em] mt-0.5">SMM Panel</span>
              </div>
            </Link>
          </div>

          {/* KAYAN FORM SEKMELERİ */}
          <div className="flex rounded-xl border border-white/5 bg-white/[0.02] p-1.5 mb-8">
            <button
              onClick={() => setMode("in")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-extrabold transition-all ${
                mode === "in" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => setMode("up")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-extrabold transition-all ${
                mode === "up" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Hesap Oluştur
            </button>
          </div>

          {/* BAŞLIKLAR */}
          <div className="text-left mb-6">
            <h1 className="text-2xl md:text-3xl font-black">
              {mode === "in" ? "Tekrar hoş geldiniz" : "Ücretsiz hesabınızı oluşturun"}
            </h1>
            <p className="text-sm text-slate-400 mt-1.5">
              {mode === "in"
                ? "Siparişlerinizi, kataloğunuzu ve cüzdan bakiyenizi yönetmek için giriş yapın."
                : "30 saniyeden kısa sürede markanızı ölçeklendirmeye başlayın — kredi kartı gerekmez."}
            </p>
          </div>

          {/* TEK TIKLA: son Google hesabı */}
          {lastGoogle && mode === "in" && (
            <div className="mb-4">
              <button onClick={googleAuth} disabled={loading}
                className="w-full flex items-center justify-between gap-3 border border-blue-500/30 bg-blue-500/8 hover:bg-blue-500/15 py-3 px-4 rounded-xl transition-all active:scale-[0.99] disabled:opacity-50">
                <div className="flex items-center gap-3 min-w-0">
                  {lastGoogle.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={lastGoogle.photoURL} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-blue-600 grid place-items-center text-white font-black text-sm shrink-0">
                      {lastGoogle.name[0]}
                    </div>
                  )}
                  <div className="text-left min-w-0">
                    <div className="text-sm font-bold text-white truncate">{lastGoogle.name} olarak giriş yap</div>
                    <div className="text-[11px] text-slate-400 truncate">{lastGoogle.email}</div>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
                  <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.8 3.2-7.9Z"/>
                  <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"/>
                  <path fill="#FBBC05" d="M6 14.4a6.6 6.6 0 0 1 0-4.2V7.4H2.3a11 11 0 0 0 0 9.8L6 14.4Z"/>
                  <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.4L6 10.2c.9-2.6 3.2-4.8 6-4.8Z"/>
                </svg>
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Siz değil misiniz? <button onClick={() => { localStorage.removeItem(LAST_GOOGLE_KEY); setLastGoogle(null); }} className="text-blue-400 hover:underline">Farklı bir hesap kullan</button>
              </p>
            </div>
          )}

          {/* SOSYAL HESAP BUTONU */}
          <div className="mb-6">
            <button
              onClick={googleAuth}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2.5 border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] py-3.5 px-4 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${lastGoogle && mode === "in" ? "hidden" : ""}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.8 3.2-7.9Z" />
                <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z" />
                <path fill="#FBBC05" d="M6 14.4a6.6 6.6 0 0 1 0-4.2V7.4H2.3a11 11 0 0 0 0 9.8L6 14.4Z" />
                <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.4L6 10.2c.9-2.6 3.2-4.8 6-4.8Z" />
              </svg>
              Google ile devam et
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="absolute inset-x-0 h-px bg-white/5" />
            <span className="relative bg-[#090D16] px-3.5">veya e-posta ile devam et</span>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-400 font-medium">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {mode === "up" && (
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-400 mb-1.5" htmlFor="name">Ad Soyad</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Adınız"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 text-sm placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white/[0.02]"
                />
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 mb-1.5" htmlFor="email">E-posta adresi</label>
              <input
                id="email"
                type="email"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 text-sm placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white/[0.02]"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 mb-1.5" htmlFor="password">Şifre</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 text-sm placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white/[0.02]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  aria-label="Şifre görünürlüğünü değiştir"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "in" && (
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-white/5 bg-white/[0.01]"
                  />
                  Beni hatırla
                </label>
                <a href="#" className="text-blue-500 hover:underline">Şifremi unuttum</a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-cta btn-block btn-lg mt-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Çalışma alanı hazırlanıyor...</span>
                </>
              ) : (
                <span>{mode === "in" ? "Panele giriş yap" : "Ücretsiz hesap oluştur"}</span>
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-500 mt-6 leading-relaxed">
            Devam ederek Kriyava'nın <Link href="/terms" className="text-blue-500 hover:underline">Kullanım Koşulları</Link>'nı ve <Link href="/privacy-policy" className="text-blue-500 hover:underline">Gizlilik Politikası</Link>'nı kabul etmiş olursunuz.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 mt-6">
            <Lock size={12} strokeWidth={2.5} />
            <span>256-bit şifreleme ile güvende</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#090D16] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-blue-500" size={32} />
          <span className="text-xs font-bold text-slate-400">Kriyava Ağ Geçidi yükleniyor...</span>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
