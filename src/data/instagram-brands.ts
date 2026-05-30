/** Default Instagram carousel accounts — screenshots live in /public/brands/ */
export const instagramBrandSeeds = [
  { handle: "odilxon_87_87_", tone: "from-amber-400/25 to-yellow-500/30" },
  { handle: "nur_chorvasi_arashan", tone: "from-emerald-400/25 to-green-600/35" },
  { handle: "arashan_lidr", tone: "from-lime-400/25 to-emerald-500/35" },
  { handle: "itaxi9999", tone: "from-yellow-400/30 to-amber-500/35" },
  { handle: "aistudiouz", tone: "from-cyan-500/30 to-violet-600/40" },
  { handle: "murodboy_kreativ", tone: "from-fuchsia-500/30 to-cyan-500/30" },
  { handle: "alif.mebel.offical", tone: "from-amber-400/25 to-orange-500/35" },
  { handle: "interbahoservice", tone: "from-emerald-400/25 to-cyan-500/35" },
  { handle: "gettopik", tone: "from-violet-500/35 to-fuchsia-500/25" },
  { handle: "yoldosh_loyiha", tone: "from-yellow-400/20 to-amber-500/35" },
  { handle: "flavor_design", tone: "from-rose-500/25 to-amber-400/30" },
  { handle: "surayo8887", tone: "from-sky-400/30 to-indigo-600/35" },
  { handle: "nanodez_uz", tone: "from-red-500/25 to-cyan-400/30" },
  { handle: "uz.grow", tone: "from-lime-400/25 to-emerald-500/35" },
  { handle: "murodoka_n1", tone: "from-slate-400/25 to-cyan-500/30" },
  { handle: "grapage_uz", tone: "from-purple-500/30 to-violet-600/35" },
  { handle: "toshkent_yemdon", tone: "from-orange-400/25 to-yellow-500/30" },
  { handle: "ppx_xoshimjonov", tone: "from-blue-500/30 to-indigo-600/35" },
  { handle: "press.sbu", tone: "from-cyan-400/30 to-blue-600/35" },
  { handle: "inspektor.ai", tone: "from-teal-400/25 to-cyan-500/35" },
  { handle: "ravshanbek_page", tone: "from-pink-500/25 to-rose-500/30" },
  { handle: "umidjon.kh1", tone: "from-indigo-500/30 to-purple-600/35" },
  { handle: "beksay_shop", tone: "from-amber-400/20 to-rose-500/30" },
  { handle: "remix_tuning", tone: "from-zinc-400/20 to-cyan-500/35" },
] as const;

export function instagramHandleToFile(handle: string): string {
  return handle.replace(/^@/, "").replace(/\./g, "_");
}

export function instagramProfileUrl(handle: string): string {
  const clean = handle.startsWith("@") ? handle.slice(1) : handle;
  return `https://www.instagram.com/${clean}/`;
}
