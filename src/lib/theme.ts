export type ThemeId = "dark" | "white" | "blue" | "purple" | "yellow";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  dotBg: string;
  dotBorder: string;
  bgGradient: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: "dark",
    name: "Hitam (Dark)",
    dotBg: "bg-[#09090c]",
    dotBorder: "border-white/40",
    bgGradient: "bg-gradient-to-br from-[#060608] via-[#0d0d12] to-[#08080a]",
  },
  {
    id: "white",
    name: "White (Putih)",
    dotBg: "bg-[#f8fafc]",
    dotBorder: "border-slate-400",
    bgGradient: "bg-gradient-to-br from-[#dbe2ea] via-[#edf2f7] to-[#cbd5e1]",
  },
  {
    id: "blue",
    name: "Blue (Ocean)",
    dotBg: "bg-[#0284c7]",
    dotBorder: "border-sky-300",
    bgGradient: "bg-gradient-to-br from-[#0a172a] via-[#0f2444] to-[#07101e]",
  },
  {
    id: "purple",
    name: "Ungu (Lavender)",
    dotBg: "bg-[#8a88b5]",
    dotBorder: "border-white/40",
    bgGradient: "bg-gradient-to-br from-[#5d5b86] via-[#6e6c99] to-[#4f4d75]",
  },
  {
    id: "yellow",
    name: "Kuning (Gold)",
    dotBg: "bg-[#eab308]",
    dotBorder: "border-yellow-200",
    bgGradient: "bg-gradient-to-br from-[#1c1708] via-[#2c240b] to-[#120f04]",
  },
];
