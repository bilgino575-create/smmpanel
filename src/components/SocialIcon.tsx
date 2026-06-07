// Real SVG social media brand icons with correct brand colors
import React from "react";

interface Props { size?: number; className?: string }

export function IconInstagram({ size = 20, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <radialGradient id="ig-g1" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="5%" stopColor="#fdf497"/>
          <stop offset="45%" stopColor="#fd5949"/>
          <stop offset="60%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-g1)"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" fill="none"/>
      <circle cx="17" cy="7" r="1" fill="white"/>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

export function IconYouTube({ size = 20, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="5" fill="#FF0000"/>
      <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="white"/>
    </svg>
  );
}

export function IconFacebook({ size = 20, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="5" fill="#1877F2"/>
      <path d="M16 8h-2a1 1 0 00-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 014-4h2v3z" fill="white"/>
    </svg>
  );
}

export function IconTikTok({ size = 20, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="5" fill="#010101"/>
      <path d="M14 4h2.5A4.5 4.5 0 0020 7.5V10a6.5 6.5 0 01-4-1.4V16a5 5 0 11-5-5h1v2.5a2.5 2.5 0 102.5 2.5V4H14z" fill="white"/>
      <path d="M14 4h2.5A4.5 4.5 0 0020 7.5" stroke="#69C9D0" strokeWidth="0.8" fill="none"/>
    </svg>
  );
}

export function IconTelegram({ size = 20, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="12" fill="#2AABEE"/>
      <path d="M5 12l2.5 1.5L16 7l-7.5 8L10 19l1.5-4L17 8" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M5 12l14-5-2.5 12L10 15 5 12z" fill="white" opacity="0.9"/>
      <path d="M10 15l1.5 4 1.5-4.5" stroke="#2AABEE" strokeWidth="1" fill="none"/>
    </svg>
  );
}

export function IconWhatsApp({ size = 20, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="12" fill="#25D366"/>
      <path d="M12 4.5a7.5 7.5 0 00-6.4 11.4L4.5 19.5l3.8-1C9.5 19 10.7 19.5 12 19.5a7.5 7.5 0 000-15z" fill="white"/>
      <path d="M9 10c.2.7.8 1.4 1.5 2s1.3 1.2 2 1.5l.8-1c.1-.2.4-.3.6-.2l2 .7c.2.1.3.3.2.5-.3 1.2-1.5 2-2.7 1.7A9 9 0 018.3 11c-.3-1.2.5-2.4 1.7-2.7.2-.1.4 0 .5.2l.7 2c.1.2 0 .4-.2.5h0z" fill="#25D366"/>
    </svg>
  );
}

export function IconSpotify({ size = 20, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="12" fill="#1DB954"/>
      <path d="M17 10.5c-3-1.8-7.9-2-10.7-1.1" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M16.3 13c-2.5-1.5-6.8-1.7-9.2-.9" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M15.6 15.4c-2.1-1.2-5.5-1.4-7.8-.7" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

export function IconTwitterX({ size = 20, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="5" fill="#000000"/>
      <path d="M6 5h3.5l3.5 5L17 5h2l-5 6.5L19 19h-3.5L12 14l-4 5H6l5.2-6.7L6 5z" fill="white"/>
    </svg>
  );
}

export function IconLinkedIn({ size = 20, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="5" fill="#0A66C2"/>
      <rect x="5" y="9" width="3" height="10" fill="white"/>
      <circle cx="6.5" cy="6.5" r="1.5" fill="white"/>
      <path d="M12 9v10h3v-5.5c0-1.5 1-2.5 2.5-2.5s2 1 2 2.5V19h3v-6c0-2.5-1.5-4.5-4.5-4.5A4 4 0 0015 10V9h-3z" fill="white"/>
    </svg>
  );
}

export function IconWebsite({ size = 20, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="5" fill="#6366f1"/>
      <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.3" fill="none"/>
      <ellipse cx="12" cy="12" rx="3" ry="6" stroke="white" strokeWidth="1.3" fill="none"/>
      <path d="M6 12h12M6.5 9h11M6.5 15h11" stroke="white" strokeWidth="1.1"/>
    </svg>
  );
}

const ICON_MAP: Record<string, React.FC<Props>> = {
  Instagram: IconInstagram,
  YouTube: IconYouTube,
  Facebook: IconFacebook,
  TikTok: IconTikTok,
  Telegram: IconTelegram,
  WhatsApp: IconWhatsApp,
  Spotify: IconSpotify,
  X: IconTwitterX,
  LinkedIn: IconLinkedIn,
  Website: IconWebsite,
};

export function SocialIcon({ platform, size = 20, className = "" }: { platform: string; size?: number; className?: string }) {
  const Icon = ICON_MAP[platform];
  if (Icon) return <Icon size={size} className={className} />;
  // Fallback: colored circle with first letter
  return (
    <span style={{ width: size, height: size, fontSize: size * 0.55 }}
      className={`inline-flex items-center justify-center rounded-full bg-slate-600 text-white font-black shrink-0 ${className}`}>
      {platform[0]}
    </span>
  );
}

export function platformIconFor(text: string): React.ReactNode {
  const t = text.toLowerCase();
  if (t.includes("instagram")) return <IconInstagram size={14} />;
  if (t.includes("youtube")) return <IconYouTube size={14} />;
  if (t.includes("tiktok") || t.includes("tik tok")) return <IconTikTok size={14} />;
  if (t.includes("telegram")) return <IconTelegram size={14} />;
  if (t.includes("facebook")) return <IconFacebook size={14} />;
  if (t.includes("whatsapp")) return <IconWhatsApp size={14} />;
  if (t.includes("spotify")) return <IconSpotify size={14} />;
  if (t.includes("twitter") || t.includes(" x ") || t.startsWith("x ") || t.includes("| x")) return <IconTwitterX size={14} />;
  if (t.includes("linkedin")) return <IconLinkedIn size={14} />;
  if (t.includes("website") || t.includes("traffic")) return <IconWebsite size={14} />;
  return <span className="text-[12px]">⚡</span>;
}
