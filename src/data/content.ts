export const socialLinks = {
  /** AI SEGMENT | PROYEKTLAR — asosiy kanal */
  telegram: "https://t.me/segment_ai",
  instagram: "https://www.instagram.com/ai_segment",
  youtube: "https://www.youtube.com/@ai_segment/shorts",
  /** Hamkorlik — @segment_admin */
  telegramPartner: "https://t.me/segment_admin",
} as const;

export const brands = [
  { name: "NEXORA", tone: "from-cyan-500/30 to-violet-600/40" },
  { name: "VELTRIX", tone: "from-fuchsia-500/30 to-cyan-500/30" },
  { name: "ORBITLY", tone: "from-emerald-400/25 to-cyan-500/35" },
  { name: "LUMINA", tone: "from-violet-500/35 to-fuchsia-500/25" },
  { name: "SYNapse", tone: "from-sky-400/30 to-indigo-600/35" },
  { name: "PRISM", tone: "from-rose-500/25 to-cyan-400/30" },
  { name: "NOVALABS", tone: "from-cyan-400/30 to-purple-600/35" },
  { name: "FLUX", tone: "from-amber-400/20 to-cyan-500/35" },
];

export const topVideos = [
  {
    id: "v1",
    title: "AI reklama — viral Reels",
    description: "Instagram Reels — generativ vizual va sinematograf montaj.",
    views: 4_000_000,
    likes: 0,
    uploadedAt: "2026-03-02",
    thumbSeed: "ai-segment-1",
    videoUrl: "https://www.instagram.com/reel/DVYtt5cjCu4/",
  },
  {
    id: "v2",
    title: "Viral Shorts seriyasi",
    description: "Hook → AI B-roll → motion titrlar. Retention 78%.",
    views: 3_000_000,
    likes: 0,
    uploadedAt: "2026-02-18",
    thumbSeed: "ai-segment-2",
    videoUrl: "https://www.instagram.com/reel/DXBxpUUjKjA/",
  },
  {
    id: "v3",
    title: "Cyber-launch trailer",
    description: "Neon HUD, 3D partikullar, premium typography.",
    views: 4_000_000,
    likes: 0,
    uploadedAt: "2026-01-09",
    thumbSeed: "ai-segment-3",
    videoUrl: "https://www.instagram.com/reel/DX1kGpHIh-k/",
  },
  {
    id: "v4",
    title: "AI avatar + ovoz — UGC",
    description: "AI presenter va brend xavfsizligi.",
    views: 1_200_000,
    likes: 0,
    uploadedAt: "2025-12-21",
    thumbSeed: "ai-segment-4",
    videoUrl: "https://www.instagram.com/reel/DWtf8B_jN-X/",
  },
  {
    id: "v5",
    title: "Brend hikoya — dokumenter uslub",
    description: "Cinematic grade va orchestral mix.",
    views: 2_300_000,
    likes: 0,
    uploadedAt: "2025-11-04",
    thumbSeed: "ai-segment-5",
    videoUrl: "https://www.instagram.com/reel/DW86IqWoydV/",
  },
  {
    id: "v6",
    title: "Motion-first product reveal",
    description: "Macro shots + procedural particles + beat design.",
    views: 1_700_000,
    likes: 0,
    uploadedAt: "2025-10-12",
    thumbSeed: "ai-segment-6",
    videoUrl: "https://www.instagram.com/reel/DYPZbMLsndR/",
  },
];

export const clientWorks = [
  {
    id: "c1",
    client: "Viral zakaz — Reels",
    videoUrl: "https://www.instagram.com/reel/DYCcqC9CPL0/",
    caption: "Instagram Reels — AI montaj, viral format va premium vizual.",
  },
];

export const dashboardStats = [
  { key: "views", label: "Jami ko‘rishlar soni", value: 50, suffix: "M+", prefix: "" },
  { key: "projects", label: "Ishlangan loyihalar", value: 200, suffix: "+", prefix: "" },
  { key: "revenue", label: "Jamg‘arilgan mablag‘", value: 30, suffix: " MLN+", prefix: "" },
  { key: "aiSpend", label: "AI uchun sarflangan", value: 3, suffix: " MLN+", prefix: "" },
  { key: "editSpend", label: "Montaj uchun sarflangan", value: 2, suffix: " MLN+", prefix: "" },
  { key: "tools", label: "AI toollar soni", value: 7, suffix: "+", prefix: "" },
] as const;

export const videoComments = [
  {
    videoId: "v1",
    videoTitle: "AI reklama — 24 soatda 10M ko‘rish",
    comments: [
      {
        id: "cm1",
        user: "sarvar.media",
        avatarSeed: "cm-1",
        text: "Grade va pacing juda toza. Qaysi AI stack ishlatilgan?",
        likes: 3421,
        time: "2 soat oldin",
      },
      {
        id: "cm2",
        user: "dilshod.cuts",
        avatarSeed: "cm-2",
        text: "Brend ovozi bilan vizual sinxron — bu premium daraja.",
        likes: 1204,
        time: "5 soat oldin",
      },
      {
        id: "cm3",
        user: "investor.uz",
        avatarSeed: "cm-3",
        text: "Pitch deck emas, to‘g‘ridan-to‘g‘ri WOW. Hamkorlik uchun yozaman.",
        likes: 892,
        time: "1 kun oldin",
      },
    ],
  },
  {
    videoId: "v2",
    videoTitle: "Viral Shorts seriyasi — 8 qism",
    comments: [
      {
        id: "cm4",
        user: "shorts_lab",
        avatarSeed: "cm-4",
        text: "Hook 0.4s — to‘g‘ri. Keyingi qism qachon?",
        likes: 2102,
        time: "3 soat oldin",
      },
      {
        id: "cm5",
        user: "maya.motion",
        avatarSeed: "cm-5",
        text: "Motion titrlar juda silliq, qora fonda neon ideal ketgan.",
        likes: 876,
        time: "8 soat oldin",
      },
    ],
  },
];
