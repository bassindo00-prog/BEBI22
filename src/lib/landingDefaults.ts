export function normalizeImageUrl(url?: string | null): string {
  if (!url) return "";
  return url.replace(/https?:\/\/storage\.vpsmurah\.co\.id/g, "/api/storage");
}

export interface LandingArtist {
  id: string | number;
  name: string;
  genre: string;
  imageUrl: string;
  listeners: string;
  quote: string;
  isVerified?: boolean;
}

export interface LandingPageData {
  id: string;
  heroSubtitle?: string;
  heroTitle1?: string;
  heroTitle2?: string;
  heroBgImage?: string;
  artists?: LandingArtist[];
  testimonials?: any[];
  [key: string]: any;
}

export const DEFAULT_PRISMA_TESTIMONIALS: LandingArtist[] = [
  {
    id: 1,
    genre: "HIP-HOP / URBAN",
    name: "Shinta Dewi",
    listeners: "3.4M+",
    quote:
      "Distribusi ke TikTok & Instagram Music sangat instan. Lagu baruku langsung viral dipakai jutaan video reels dalam waktu seminggu!",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440502-6c2e8e986ef6?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 2,
    genre: "INDIE POP",
    name: "Nadya Zahira",
    listeners: "780K+",
    quote:
      "Tidak ada biaya tersembunyi atau potongan royalti aneh-aneh. Semua laporan keuangan sangat transparan bisa diunduh kapanpun.",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f928?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 3,
    genre: "DREAM POP",
    name: "Tara Anindya",
    listeners: "1.1M+",
    quote:
      "BREAKOUT ID benar-benar mempermudah musisi independen untuk berdiri sejajar dengan musisi label major di kancah global.",
    imageUrl:
      "https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 4,
    genre: "R&B / SOUL",
    name: "Siska Rania",
    listeners: "920K+",
    quote:
      "Support timnya juara. Aku berasa kayak difasilitasi oleh label rekaman besar milik sendiri tanpa banyak prosedur ribet.",
    imageUrl:
      "https://images.unsplash.com/photo-1605722243979-fc0e515d9472?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 5,
    genre: "ACOUSTIC POP",
    name: "Dinda Melati",
    listeners: "2.1M+",
    quote:
      "Gak ada lagi potongan tersembunyi. 100% hak milik adalah game-changer untuk musisi independen sepertiku.",
    imageUrl:
      "https://images.unsplash.com/photo-1483032469466-b937c425697b?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 6,
    genre: "ELECTRONIC",
    name: "Rara K.",
    listeners: "1.8M+",
    quote:
      "Platform paling stabil. Aku bisa ngecek statistik streams setiap habis manggung dengan presisi hitungan detik.",
    imageUrl:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 7,
    genre: "ROCK / ALTERNATIVE",
    name: "Chika Amalia",
    listeners: "560K+",
    quote:
      "Dari TikTok sampai Apple Music, distribusinya bener-bener tercover luas tanpa celah sedikitpun.",
    imageUrl:
      "https://images.unsplash.com/photo-1453090927415-5f45085b65c0?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 8,
    genre: "INDIE FOLK",
    name: "Vina Letisha",
    listeners: "430K+",
    quote:
      "Data audiensnya detail, ngebantu banget untuk nentuin kota target tour musikku selanjutnya bareng band.",
    imageUrl:
      "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 9,
    genre: "JAZZ / BLUES",
    name: "Kania Salim",
    listeners: "890K+",
    quote:
      "Sistem dashboard terbaik yang pernah kulihat. Sangat estetik, intuitif dan responsif dibuka dari HP!",
    imageUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 10,
    genre: "INDIE ROCK",
    name: "Bella Grace",
    listeners: "1.5M+",
    quote:
      "Akhirnya ada platform dari musisi, untuk musisi. Wajib banget buat skena independen lokal yang mau go international.",
    imageUrl:
      "https://images.unsplash.com/photo-1499557659556-9e900c313437?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 11,
    genre: "POP PUNK",
    name: "Karin Nabila",
    listeners: "850K+",
    quote:
      "Royalti masuk tepat waktu tiap bulan. Nggak pernah ada drama payment telat. Tim supportnya bener-bener the best!",
    imageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 12,
    genre: "LO-FI / CHILL",
    name: "Risa Larasati",
    listeners: "1.2M+",
    quote:
      "Algoritma platform ini ngebantu track lo-fi aku masuk ke berbagai playlist editorial tanpa harus repot cari promotor.",
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 13,
    genre: "SYNTHWAVE",
    name: "Nadin Amira",
    listeners: "670K+",
    quote:
      "Sangat mudah digunakan buat musisi yang ngerjain semuanya sendiri dari kamar. BREAKOUT ID ngerubah segalanya buatku.",
    imageUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
];

