export type ThemeId = "dark" | "white" | "blue" | "purple" | "yellow";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  dotBg: string;
  dotBorder: string;
  bgGradient: string;
  sidebarBg: string;
  cardClass: string;
  badgeAccent: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: "dark",
    name: "Hitam (Dark)",
    dotBg: "bg-[#09090c]",
    dotBorder: "border-white/40",
    bgGradient: "bg-gradient-to-br from-[#060608] via-[#0d0d12] to-[#08080a]",
    sidebarBg: "bg-[#0f0f14]/80 border-white/10",
    cardClass: "bg-[#14141a]/85 border-white/10 text-white shadow-2xl",
    badgeAccent: "bg-[#c8f560] text-[#09090c]",
  },
  {
    id: "white",
    name: "White (Putih)",
    dotBg: "bg-[#f8fafc]",
    dotBorder: "border-slate-400",
    bgGradient: "bg-gradient-to-br from-[#edf2f7] via-[#f8fafc] to-[#e2e8f0]",
    sidebarBg: "bg-white/85 border-slate-200/80",
    cardClass: "bg-white/90 border-slate-200/80 text-slate-800 shadow-xl",
    badgeAccent: "bg-[#16a34a] text-white",
  },
  {
    id: "blue",
    name: "Blue (Ocean)",
    dotBg: "bg-[#0284c7]",
    dotBorder: "border-sky-300",
    bgGradient: "bg-gradient-to-br from-[#091426] via-[#0f213d] to-[#070e1c]",
    sidebarBg: "bg-[#0d1d36]/80 border-sky-400/20",
    cardClass: "bg-[#132849]/80 border-sky-400/20 text-white shadow-2xl",
    badgeAccent: "bg-[#38bdf8] text-[#070e1c]",
  },
  {
    id: "purple",
    name: "Ungu (Lavender)",
    dotBg: "bg-[#8a88b5]",
    dotBorder: "border-white/40",
    bgGradient: "bg-gradient-to-br from-[#5d5b86] via-[#6e6c99] to-[#4f4d75]",
    sidebarBg: "bg-[#74729f]/30 border-white/20",
    cardClass: "bg-[#8a88b5]/70 border-white/20 text-white shadow-lg",
    badgeAccent: "bg-[#c8f560] text-[#312042]",
  },
  {
    id: "yellow",
    name: "Kuning (Gold)",
    dotBg: "bg-[#eab308]",
    dotBorder: "border-yellow-200",
    bgGradient: "bg-gradient-to-br from-[#181507] via-[#231e09] to-[#121004]",
    sidebarBg: "bg-[#1f1a07]/80 border-yellow-500/20",
    cardClass: "bg-[#282208]/80 border-yellow-500/25 text-white shadow-2xl",
    badgeAccent: "bg-[#facc15] text-[#181507]",
  },
];

