import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kriyava.com"),
  title: "Kriyava SMM — Sosyal Medya Hesaplarınızı Her Zamankinden Daha Hızlı Büyütün",
  description:
    "Kriyava SMM'nin çoklu sağlayıcı yedeklemeli gelişmiş otomasyon platformuyla yüksek kaliteli takipçi, beğeni, izlenme ve etkileşim güvenle teslim edilir. 50.000'den fazla pazarlamacı tarafından tercih ediliyor.",
  icons: {
    icon: [
      { url: "/assets/favicon.ico" },
      { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    title: "Kriyava SMM — Premium Sosyal Medya Büyüme",
    description: "Yüksek kaliteli etkileşim, toptan fiyatlandırma, çoklu sağlayıcı güvenilirliği.",
    images: ["/assets/og-hero.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.setAttribute('data-theme',localStorage.getItem('kriyava_theme')||'dark')}catch(e){}",
          }}
        />
      </head>
      <body className={`${inter.variable} ${interTight.variable}`}>{children}</body>
    </html>
  );
}
