# Kriyava SMM Panel 🇹🇷

Sosyal medya hesaplarınızı büyütmek için tamamen Türkçe, modern SMM paneli. Next.js 16 + TypeScript + Tailwind CSS ile geliştirilmiştir.

## 🚀 Başlangıç

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📦 Build

```bash
npm run build
npm start
```

## 🌍 Deploy

Vercel, Netlify veya herhangi bir Node.js hosting'te çalıştırabilirsiniz:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router sayfaları
│   ├── dashboard/          # Panel ana sayfası
│   ├── new-order/          # Yeni sipariş
│   ├── mass-order/         # Toplu sipariş
│   ├── orders/             # Siparişler
│   ├── add-funds/          # Bakiye yükleme
│   ├── services/           # Hizmet kataloğu
│   ├── tickets/            # Destek talepleri
│   ├── settings/           # Ayarlar
│   ├── affiliate/          # Ortaklık programı
│   ├── child-panel/        # Alt paneller
│   ├── admin/              # Admin CRM
│   ├── api-docs/           # API dökümanı
│   ├── updates/            # Güncellemeler
│   ├── blog/               # Blog
│   ├── contact/            # İletişim
│   ├── privacy-policy/     # Gizlilik politikası
│   ├── refund-policy/      # İade politikası
│   ├── terms/              # Kullanım koşulları
│   └── login/              # Giriş / Kayıt
├── components/             # Yeniden kullanılabilir bileşenler
│   ├── landing/            # Landing sayfası bileşenleri
│   └── dashboard/          # Dashboard bileşenleri
└── lib/                    # Veri katmanı (API, types, hooks)
```

## 🛠 Teknolojiler

- **Next.js 16** — React framework
- **TypeScript** — Tip güvenliği
- **Tailwind CSS 4** — Stil
- **Framer Motion** — Animasyonlar
- **Lucide React** — İkonlar
- **Razorpay** — Ödeme entegrasyonu
- **Firebase** — Google ile giriş

## ✅ Özellikler

- Çoklu sağlayıcı yönlendirme (EasySMM + LuvSMM + FineSMM)
- Razorpay ile güvenli ödeme
- Cüzdan tabanlı bakiye sistemi
- Toplu sipariş desteği
- Ortaklık programı
- Beyaz etiket alt panel
- Admin CRM paneli
- REST API
- Mobil uyumlu tasarım

## 📝 Lisans

MIT
