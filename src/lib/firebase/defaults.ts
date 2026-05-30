import {
  dashboardStats,
  socialLinks,
  topVideos,
  videoComments,
} from "@/data/content";
import {
  instagramBrandSeeds,
  instagramHandleToFile,
  instagramProfileUrl,
} from "@/data/instagram-brands";
import type {
  AnalyticsData,
  BrandItem,
  CommentItem,
  SiteConfigDoc,
  SiteContent,
  VideoItem,
} from "./types";

export const SITE_ID = "ai-segment";

export const defaultConfig: SiteConfigDoc = {
  hero: {
    badge: "AI SEGMENT",
    titleLine1: "AI CONTENT CREATOR",
    titleLine2: "& VIDEO EDITOR",
    subtitle:
      "AI yordamida kreativ video, reklama va viral kontent yarataman — Apple-grade tiniqlik va cyberpunk energiyasi bir joyda.",
    primaryButton: { label: "Portfolio ko‘rish", href: "#videos" },
    secondaryButton: { label: "Men haqimda", href: "#about" },
    portraitUrl: "/hero-portrait.png",
    hudCards: [
      { label: "Signal", value: "Generativ + real", accent: "cyan" },
      { label: "Motion", value: "HUD / neon UI", accent: "fuchsia" },
      { label: "Grade", value: "Cinematic finish", accent: "violet" },
    ],
    effects: {
      particles: true,
      scene3d: true,
      scanLine: true,
      floatingPortrait: true,
    },
    neonColors: {
      primary: "#22d3ee",
      secondary: "#c084fc",
      accent: "#e879f9",
    },
    animationsEnabled: true,
  },
  stats: dashboardStats.map((s) => ({
    key: s.key,
    label: s.label,
    value: s.value,
    suffix: s.suffix,
    prefix: s.prefix,
  })),
  social: {
    telegram: socialLinks.telegram,
    telegramPartner: socialLinks.telegramPartner,
    instagram: socialLinks.instagram,
    youtube: socialLinks.youtube,
    tiktok: "",
    email: "hello@ai-segment.uz",
    website: "https://ai-segment.uz",
  },
  about: {
    sectionLabel: "06 — Bio",
    heading: "Men haqimda",
    bioParagraphs: [
      "Men AI SEGMENT orqali generativ vizual, sinematograf montaj va motion-first storytellingni bir zanjirga ulayman. Maqsad — investor va mijoz ekranida bir zumda “premium startup” hissini uyg‘otish.",
      "Har bir loyiha uchun texnik stack, brend xavfsizligi va platforma algoritmlariga mos struktura tanlanadi — g‘alati effektlar emas, natija va retention ustuvor.",
    ],
    skills: [
      "AI tools",
      "Video editing",
      "Motion design",
      "Branding",
      "Content strategy",
      "Color science",
      "Sound design",
      "Viral packaging",
    ],
    experience: [
      {
        title: "Lead AI Video Creator",
        period: "2023 — hozir",
        description: "Generativ pipeline, viral Shorts seriyalari, brend kampaniyalar.",
      },
      {
        title: "Motion & Post",
        period: "2020 — 2023",
        description: "Cinematic grade, HUD UI, investor pitch vizuallar.",
      },
    ],
    aiTools: ["Runway", "Midjourney", "ElevenLabs", "After Effects", "DaVinci", "Topaz"],
    services: ["AI reklama", "Viral Shorts", "Brand story", "UGC kampaniya", "Pitch trailer"],
    focus: "AI + kino montaj",
    vibe: "Apple × Cyberpunk",
  },
  theme: {
    neonPrimary: "#22d3ee",
    neonSecondary: "#c084fc",
    backgroundColor: "#030308",
    gradientOverlay:
      "radial-gradient(ellipse 90% 55% at 50% -15%, rgba(168, 85, 247, 0.28), transparent 55%), radial-gradient(ellipse 55% 45% at 85% 35%, rgba(34, 211, 238, 0.16), transparent 50%), radial-gradient(ellipse 50% 40% at 10% 70%, rgba(192, 132, 252, 0.12), transparent 55%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(34, 211, 238, 0.08), transparent 60%)",
    animationsEnabled: true,
    particlesEnabled: true,
    mouseGlowEnabled: true,
    glassBlur: 24,
    darkMode: true,
    fontFamily: "var(--font-syne)",
  },
  settings: {
    siteName: "AI SEGMENT",
    logoUrl: "",
    faviconUrl: "/favicon.ico",
    seoTitle: "AI SEGMENT — AI Content Creator & Video Editor",
    seoDescription:
      "AI yordamida kreativ video, reklama va viral kontent. Futuristik portfolio — motion, montaj va strategiya.",
    seoKeywords: ["AI video", "video editor", "AI SEGMENT", "Uzbekistan", "motion design", "viral content"],
  },
  updatedAt: new Date().toISOString(),
};

export const defaultVideos: VideoItem[] = topVideos.map((v, i) => ({
  id: v.id,
  title: v.title,
  description: v.description,
  views: v.views,
  likes: v.likes,
  uploadedAt: v.uploadedAt,
  thumbUrl: "",
  thumbSeed: v.thumbSeed,
  videoUrl: v.videoUrl ?? "",
  category: "Featured",
  featured: i < 3,
  pinned: i === 0,
  order: i,
}));

export const defaultBrands: BrandItem[] = instagramBrandSeeds.map((b, i) => ({
  id: `brand-${instagramHandleToFile(b.handle)}`,
  name: `@${b.handle}`,
  tone: b.tone,
  logoUrl: `/brands/${instagramHandleToFile(b.handle)}.png`,
  instagramUrl: instagramProfileUrl(b.handle),
  order: i,
}));

export const defaultComments: CommentItem[] = videoComments.flatMap((block) =>
  block.comments.map((c) => ({
    id: c.id,
    videoId: block.videoId,
    videoTitle: block.videoTitle,
    user: c.user,
    avatarUrl: "",
    avatarSeed: c.avatarSeed,
    text: c.text,
    likes: c.likes,
    time: c.time,
    pinned: false,
    spam: false,
  })),
);

export const defaultAnalytics: AnalyticsData = {
  visitors: 48200,
  visitorsChange: 12.4,
  pageViews: 128400,
  avgSessionSeconds: 186,
  engagementRate: 68.5,
  topVideos: topVideos.slice(0, 5).map((v) => ({
    videoId: v.id,
    title: v.title,
    views: v.views,
  })),
  trafficByDay: [
    { day: "Mon", visits: 4200 },
    { day: "Tue", visits: 5100 },
    { day: "Wed", visits: 4800 },
    { day: "Thu", visits: 6200 },
    { day: "Fri", visits: 7400 },
    { day: "Sat", visits: 8900 },
    { day: "Sun", visits: 7600 },
  ],
  devices: { desktop: 42, mobile: 51, tablet: 7 },
};

export const defaultSiteContent: SiteContent = {
  config: defaultConfig,
  videos: defaultVideos,
  brands: defaultBrands,
  comments: defaultComments,
  analytics: defaultAnalytics,
};
