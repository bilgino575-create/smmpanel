"use client";
import React, { useState, useEffect } from "react";
import { User, Shield, AlertTriangle, CheckCircle2, Moon, Sun, Bell, Phone, Gift, Copy } from "lucide-react";
import { useAccount } from "@/lib/useAccount";
import { saveAccount, getTheme, setTheme } from "@/lib/account";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function SettingsPage() {
  const { account, refresh } = useAccount();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");

  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    notifOrders: true,
    notifWa: true,
    notifPrice: false,
    notifMarketing: false,
  });

  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (account) {
      setName(account.name || "");
      setEmail(account.email || "");
      setPhone(account.phone || "");
      setThemeMode(getTheme());
      if (account.prefs) {
        setPrefs({
          notifOrders: !!account.prefs.notifOrders,
          notifWa: !!account.prefs.notifWa,
          notifPrice: !!account.prefs.notifPrice,
          notifMarketing: !!account.prefs.notifMarketing,
        });
      }
    }
  }, [account]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const a = { ...account };
    a.name = name.trim() || a.name;
    a.email = email.trim();
    a.phone = phone.trim();
    a.prefs = { ...a.prefs, ...prefs };

    saveAccount(a);
    refresh();
    showToast("✅ Profil bilgileri başarıyla güncellendi!");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw1.length < 6) {
      showToast("❌ Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (pw1 !== pw2) {
      showToast("❌ Şifreler eşleşmiyor.");
      return;
    }

    setPw1("");
    setPw2("");
    showToast("✅ Güvenlik şifresi başarıyla güncellendi!");
  };

  const handleTogglePref = (k: string) => {
    const next = { ...prefs, [k]: !prefs[k] };
    setPrefs(next);

    const a = { ...account };
    a.prefs = { ...a.prefs, ...next };
    saveAccount(a);
    refresh();
  };

  const handleThemeChange = (mode: "dark" | "light") => {
    setThemeMode(mode);
    setTheme(mode);
    showToast(`🎨 Tema ${mode === "dark" ? "karanlık" : "aydınlık"} moda geçti!`);
  };

  const handleResetAccount = () => {
    if (window.confirm("Bu cihazdaki yerel tarayıcı önbelleğini temizle? Canlı hesabınız, cüzdanınız ve siparişleriniz sunucuda kalır.")) {
      localStorage.removeItem("kriyava_account_v1");
      showToast("Yerel önbellek temizlendi. Yeniden yükleniyor...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  return (
    <DashboardShell>
      <div className="text-left mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-black text-white">Ayarlar</h1>
        <p className="text-sm text-slate-400 mt-1">Profilinizi, güvenlik ayarlarınızı, WhatsApp bildirim bağlantılarınızı ve panel görünümünü yönetin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6 text-left">
          <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-6 backdrop-blur-md space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Profil Yapılandırması
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-extrabold flex items-center justify-center text-xl shadow-md uppercase">
                {name.slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{name || "İçerik Üretici"}</div>
                <div className="text-xs text-slate-400 mt-0.5">{email || "E-posta ayarlanmadı"}</div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-bold">
              <div className="flex flex-col">
                <label className="text-slate-400 mb-1.5 uppercase text-[9.5px] tracking-wide">Ad Soyad</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border border-white/5 bg-white/[0.01] px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-400 mb-1.5 uppercase text-[9.5px] tracking-wide">E-posta Adresi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-white/5 bg-white/[0.01] px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-400 mb-1.5 uppercase text-[9.5px] tracking-wide">WhatsApp Numarası</label>
                <input
                  type="tel"
                  placeholder="+90..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl border border-white/5 bg-white/[0.01] px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block !py-2.5 !text-xs mt-4"
              >
                Profil Değişikliklerini Kaydet
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Şifre Güncelle
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs font-bold">
              <div className="flex flex-col">
                <label className="text-slate-400 mb-1.5 uppercase text-[9.5px] tracking-wide">Yeni Şifre</label>
                <input
                  type="password"
                  value={pw1}
                  onChange={(e) => setPw1(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl border border-white/5 bg-white/[0.01] px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-400 mb-1.5 uppercase text-[9.5px] tracking-wide">Şifreyi Onayla</label>
                <input
                  type="password"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl border border-white/5 bg-white/[0.01] px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="btn btn-ghost btn-block !py-2.5 !text-xs mt-2"
              >
                Şifreyi güncelle
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6 text-left">
          <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Tema Görünümü
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
                  themeMode === "dark"
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-white/5 bg-white/[0.01] text-slate-400 hover:text-white"
                }`}
              >
                <Moon size={20} className={themeMode === "dark" ? "text-blue-400" : "text-slate-500"} />
                <span className="text-xs font-bold mt-2">Karanlık mod</span>
              </button>

              <button
                onClick={() => handleThemeChange("light")}
                className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
                  themeMode === "light"
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-white/5 bg-white/[0.01] text-slate-400 hover:text-white"
                }`}
              >
                <Sun size={20} className={themeMode === "light" ? "text-blue-400" : "text-slate-500"} />
                <span className="text-xs font-bold mt-2">Aydınlık mod</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0D1321]/50 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Bildirim Bağlantıları
            </h3>

            <div className="space-y-3.5">
              {[
                { k: "notifOrders", title: "Sipariş Kampanya Güncellemeleri", desc: "Siparişler tamamlandığında anında bildirim alın" },
                { k: "notifWa", title: "WhatsApp Doğrudan Uyarılar", desc: "Sipariş durumu doğrudan telefonunuza gönderilir" },
                { k: "notifPrice", title: "Piyasa Fiyat Artış/Azalışları", desc: "Favori listenizdeki hizmetlerin fiyatı değiştiğinde uyarı alın" },
                { k: "notifMarketing", title: "Promosyon E-postaları", desc: "Bayi marjları hakkında bülten güncellemeleri" },
              ].map((pref) => (
                <div
                  key={pref.k}
                  onClick={() => handleTogglePref(pref.k)}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 pb-3 last:pb-0 cursor-pointer"
                >
                  <div className="pr-4">
                    <div className="text-xs font-bold text-white">{pref.title}</div>
                    <span className="text-[10px] text-slate-500 block font-bold mt-0.5">
                      {pref.desc}
                    </span>
                  </div>

                  <button
                    className={`h-5 w-9 rounded-full shrink-0 relative transition-colors ${
                      prefs[pref.k] ? "bg-emerald-500" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full transition-transform ${
                        prefs[pref.k] ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-500/10 pb-3 flex items-center gap-2">
              <Gift size={15} className="text-emerald-400" /> Ortaklık Programı
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">Referans bağlantınızı paylaşın. Arkadaşlarınız Kriyava cüzdanlarına bakiye yüklediğinde <span className="text-emerald-400 font-bold">%5 nakit iade</span> kazanın.</p>
            {account.referralCode ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1">Referans Kodunuz</label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 flex-1">{account.referralCode}</span>
                    <button onClick={() => { navigator.clipboard.writeText(account.referralCode!); showToast("Kod kopyalandı!"); }}
                      className="p-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1">Referans Bağlantısı</label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-blue-400 font-mono bg-blue-500/5 border border-blue-500/10 rounded-lg px-3 py-2 flex-1 truncate">
                      https://smm.kriyava.com/login?ref={account.referralCode}
                    </span>
                    <button onClick={() => { navigator.clipboard.writeText(`https://smm.kriyava.com/login?ref=${account.referralCode}`); showToast("Bağlantı kopyalandı!"); }}
                      className="p-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white shrink-0">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">Nakit iade, davet ettiğiniz arkadaşınız bakiye yüklediğinde anında hesabınıza yansır.</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Referans kodu henüz oluşturulmadı — bir sonraki sayfa yenilemesinde görünecek.</p>
            )}
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.02] p-6 backdrop-blur-md text-left space-y-4">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider border-b border-rose-500/10 pb-3 flex items-center gap-2">
              <AlertTriangle size={16} /> Tehlike bölgesi
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Bu cihazdaki önbelleğe alınmış panel kopyasını temizleyin. Canlı hesabınız, cüzdanınız ve sipariş kayıtlarınız sunucuda saklı kalır.
            </p>
            <button
              onClick={handleResetAccount}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
            >
              Yerel önbelleği temizle
            </button>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-24 left-6 z-55 rounded-xl border border-white/10 bg-[#0D1321]/95 px-5 py-3 shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-black border-l-4 border-l-emerald-500 animate-slideup">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </DashboardShell>
  );
}
