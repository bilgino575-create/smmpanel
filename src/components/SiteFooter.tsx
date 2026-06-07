import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--color-line)] bg-[color:var(--color-surface)] pt-16 pb-8">
      <div className="container-x">
        <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-[11px]">
              <span className="h-9 w-9 overflow-hidden rounded-[10px]" style={{ boxShadow: "var(--shadow-glow)" }}>
                <Image src="/assets/logo-128.png" alt="" width={36} height={36} />
              </span>
              <span className="font-display text-[20px] font-extrabold tracking-tight">Kriyava</span>
            </Link>
            <p className="mt-4 max-w-[34ch] text-sm text-[color:var(--color-muted)]">
               Premium sosyal medya büyüme platformu. Yüksek kaliteli etkileşim, toptan fiyatlandırma, çoklu sağlayıcı güvenilirliği.
            </p>
          </div>
          <FooterCol title="Hizmetler" links={[["Instagram", "/services"], ["YouTube", "/services"], ["TikTok", "/services"], ["Telegram", "/services"]]} />
          <FooterCol title="Ürün" links={[["API", "/login?redirect=/api-docs"], ["Fiyatlar", "/#pricing"], ["Panel", "/dashboard"], ["Alt Paneller", "/login?redirect=/child-panel"], ["Ortaklık", "/login?redirect=/affiliate"]]} />
          <FooterCol title="Şirket" links={[["Blog", "/blog"], ["Koşullar", "/terms"], ["Gizlilik Politikası", "/privacy-policy"], ["İade Politikası", "/refund-policy"], ["İletişim", "/contact"]]} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-line)] pt-6">
          <p className="text-[13.5px] text-[color:var(--color-muted)]">© 2026 Kriyava SMM. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-2">
            {["UPI", "VISA", "MC", "Razorpay"].map((p) => (
              <span key={p} className="grid h-[26px] place-items-center rounded-md border border-[color:var(--color-line)] bg-white px-2.5 text-[11px] font-extrabold text-[#475569]">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-muted)]">{title}</h4>
      {links.map(([label, href]) => (
        <Link key={label} href={href} className="block py-[7px] text-[14.5px] font-medium text-[#475569] transition-colors hover:text-[color:var(--color-ink)]">
          {label}
        </Link>
      ))}
    </div>
  );
}
