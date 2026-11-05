"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  RotateCcw,
  ExternalLink,
  Image as ImageIcon,
  Users,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import {
  DEFAULT_PRISMA_TESTIMONIALS,
  normalizeImageUrl,
  type LandingArtist,
  type LandingPageData,
} from "@/components/LandingClient";

const ROYALTY_CARD =
  "bg-[#8a88b5]/70 border border-white/20 rounded-[28px] p-6 text-white shadow-lg";

interface AdminLandingCMSProps {
  showNotice: (msg: string) => void;
}

export default function AdminLandingCMS({ showNotice }: AdminLandingCMSProps) {
  const [activeSubTab, setActiveSubTab] = useState<"artists" | "hero">("artists");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Form State
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Masa depan distribusi musik independen. Rilis karya Anda ke seluruh dunia tanpa batas."
  );
  const [heroTitle1, setHeroTitle1] = useState("Breakout");
  const [heroTitle2, setHeroTitle2] = useState("ID");
  const [heroBgImage, setHeroBgImage] = useState("/6293920186406475512_121.jpg");

  // Artists State
  const [artists, setArtists] = useState<LandingArtist[]>(DEFAULT_PRISMA_TESTIMONIALS);

  // Artist Modal
  const [artistModalOpen, setArtistModalOpen] = useState(false);
  const [editingArtistId, setEditingArtistId] = useState<string | number | null>(null);
  const [artistForm, setArtistForm] = useState<LandingArtist>({
    id: "",
    name: "",
    genre: "INDIE POP",
    imageUrl: "https://images.unsplash.com/photo-1516280440502-6c2e8e986ef6?q=80&w=600&auto=format&fit=crop",
    listeners: "1.2M+",
    quote: "Distribusi sangat cepat dan royalti 100% transparan langsung ke rekening.",
    isVerified: true,
  });

  // Fetch CMS Data
  useEffect(() => {
    fetchCmsData();
  }, []);

  const fetchCmsData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/landing");
      const json = await res.json();
      if (json?.data) {
        const d: LandingPageData = json.data;
        if (d.heroSubtitle) setHeroSubtitle(d.heroSubtitle);
        if (d.heroTitle1) setHeroTitle1(d.heroTitle1);
        if (d.heroTitle2) setHeroTitle2(d.heroTitle2);
        if (d.heroBgImage) setHeroBgImage(normalizeImageUrl(d.heroBgImage));

        if (Array.isArray(d.artists) && d.artists.length > 0) {
          setArtists(
            d.artists.map((a: any, idx: number) => ({
              id: a.id || idx + 1,
              name: a.name || "Artis",
              genre: a.genre || "Pop",
              imageUrl:
                normalizeImageUrl(a.imageUrl || a.photo) ||
                DEFAULT_PRISMA_TESTIMONIALS[idx % DEFAULT_PRISMA_TESTIMONIALS.length].imageUrl,
              listeners: a.listeners || a.monthlyListeners || "1M+",
              quote: a.quote || a.bio || "Platform terbaik untuk musisi independen.",
              isVerified: a.isVerified !== undefined ? Boolean(a.isVerified) : true,
            }))
          );
        } else {
          setArtists(DEFAULT_PRISMA_TESTIMONIALS);
        }
      }
    } catch (err) {
      console.error("Fetch CMS error:", err);
      showNotice("Gagal mengambil data CMS Landing Page.");
    } finally {
      setLoading(false);
    }
  };

  // Upload Image Handler
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showNotice("Ukuran file maksimal 10MB!");
      return;
    }

    setUploadingField(fieldKey);

    const reader = new FileReader();
    reader.onload = async (readEvt) => {
      const clientDataUrl = readEvt.target?.result as string;

      try {
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch("/api/cms/upload", {
          method: "POST",
          body: fd,
        });

        const json = await res.json().catch(() => null);
        if (res.ok && json?.url) {
          const finalUrl = normalizeImageUrl(json.url);
          callback(finalUrl);
          showNotice(`✅ Foto berhasil diunggah: ${file.name}`);
        } else if (clientDataUrl) {
          callback(clientDataUrl);
          showNotice(`✅ Foto berhasil dimuat: ${file.name}`);
        } else {
          showNotice(json?.error || "Gagal mengunggah gambar.");
        }
      } catch (err) {
        console.warn("Upload network error, using client Data URL fallback:", err);
        if (clientDataUrl) {
          callback(clientDataUrl);
          showNotice(`✅ Foto berhasil dimuat: ${file.name}`);
        } else {
          showNotice("Terjadi kesalahan saat memproses gambar.");
        }
      } finally {
        setUploadingField(null);
        e.target.value = "";
      }
    };

    reader.onerror = () => {
      showNotice("Gagal membaca file dari komputer/HP.");
      setUploadingField(null);
    };

    reader.readAsDataURL(file);
  };

  // Save All Changes to PostgreSQL
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const payload: Partial<LandingPageData> = {
        heroSubtitle,
        heroTitle1,
        heroTitle2,
        heroBgImage: heroBgImage || "/6293920186406475512_121.jpg",
        artists,
      };

      const res = await fetch("/api/cms/landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        showNotice("✅ Seluruh perubahan foto & teks artis berhasil disimpan ke landing page!");
      } else {
        showNotice(json?.error || "Gagal menyimpan perubahan ke database.");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      showNotice(err?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  // Artists CRUD
  const openAddArtist = () => {
    setEditingArtistId(null);
    setArtistForm({
      id: `art-${Date.now()}`,
      name: "",
      genre: "INDIE POP",
      imageUrl: "https://images.unsplash.com/photo-1516280440502-6c2e8e986ef6?q=80&w=600&auto=format&fit=crop",
      listeners: "500K+",
      quote: "Lagu baruku langsung terdistribusi ke Spotify & Apple Music tanpa ribet!",
      isVerified: true,
    });
    setArtistModalOpen(true);
  };

  const openEditArtist = (artist: LandingArtist) => {
    setEditingArtistId(artist.id);
    setArtistForm({
      id: artist.id,
      name: artist.name,
      genre: artist.genre,
      imageUrl: artist.imageUrl,
      listeners: artist.listeners,
      quote: artist.quote,
      isVerified: artist.isVerified !== undefined ? artist.isVerified : true,
    });
    setArtistModalOpen(true);
  };

  const handleSaveArtistModal = () => {
    if (!artistForm.name.trim()) {
      showNotice("Nama artis wajib diisi!");
      return;
    }

    if (editingArtistId) {
      setArtists(
        artists.map((a) => (a.id === editingArtistId ? { ...artistForm } : a))
      );
      showNotice(`✅ Data artis "${artistForm.name}" berhasil diperbarui.`);
    } else {
      setArtists([...artists, { ...artistForm, id: `art-${Date.now()}` }]);
      showNotice(`✅ Artis "${artistForm.name}" berhasil ditambahkan ke landing page.`);
    }

    setArtistModalOpen(false);
  };

  const deleteArtist = (id: string | number, name: string) => {
    if (confirm(`Hapus artis "${name}" dari tampilan landing page?`)) {
      setArtists(artists.filter((a) => a.id !== id));
      showNotice(`🗑️ Artis "${name}" berhasil dihapus.`);
    }
  };

  const resetToDefaultArtists = () => {
    if (confirm("Kembalikan daftar ke 13 artis bawaan lengkap?")) {
      setArtists(DEFAULT_PRISMA_TESTIMONIALS);
      showNotice("Daftar direset ke 13 artis bawaan. Klik Simpan untuk memperbarui database.");
    }
  };

  if (loading) {
    return (
      <div className={`${ROYALTY_CARD} flex flex-col items-center justify-center py-20 text-center animate-card-enter`}>
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#c8f560] animate-spin mb-4" />
        <p className="text-sm font-semibold text-white">Memuat Sistem Web CMS Landing Page...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-card-enter">
      {/* Top Banner & Quick Actions */}
      <div className={`${ROYALTY_CARD} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c8f560] animate-ping" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#c8f560]">
              LIVE LANDING PAGE CMS
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Editor Foto & Teks Artis Landing Page
          </h2>
          <p className="text-xs text-white/70 mt-1 max-w-2xl">
            Sinkronisasi otomatis antara Admin dan tampilan depan Landing Page. Ubah foto artis, nama, genre musik, jumlah monthly listeners, dan kutipan testimoni secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 border border-white/20 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Lihat Landing Page</span>
          </a>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#c8f560] hover:bg-[#d8ff75] text-[#312042] font-black text-xs flex items-center gap-2 shadow-lg transition-all scale-100 hover:scale-105 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-[#312042] border-t-transparent animate-spin" />
                <span>Menyimpan ke DB...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SIMPAN PERUBAHAN KE DATABASE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/15 pb-2 overflow-x-auto">
        {[
          { id: "artists", label: `Artis & Testimoni (${artists.length})`, icon: Users },
          { id: "hero", label: "Hero & Teks Banner Utama", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${isActive
                  ? "bg-[#312042] text-[#c8f560] shadow-md border border-[#c8f560]/40"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: MANAJEMEN ARTIS LANDING PAGE */}
      {activeSubTab === "artists" && (
        <div className={`${ROYALTY_CARD} space-y-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#c8f560]" />
                Daftar Artis & Testimoni di Frame 7 Landing Page
              </h3>
              <p className="text-xs text-white/65 mt-0.5">
                Setiap perubahan foto, nama, genre, dan testimoni di sini akan langsung tampil pada slider testimoni landing page.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetToDefaultArtists}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Pulihkan 13 artis bawaan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset 13 Artis Default</span>
              </button>

              <button
                onClick={openAddArtist}
                className="px-4 py-2.5 rounded-xl bg-[#c8f560] hover:bg-[#d8ff75] text-[#312042] font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Artis Baru</span>
              </button>
            </div>
          </div>

          {/* Grid Artis Saat Ini */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {artists.map((artist, idx) => (
              <div
                key={artist.id}
                className="p-5 rounded-3xl bg-[#0a0a0a]/90 border border-gray-800 flex flex-col justify-between group hover:border-[#ff0055]/50 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700 shrink-0 bg-black shadow-[0_0_12px_rgba(255,0,85,0.2)]">
                      <img
                        src={artist.imageUrl || "/6293920186406475218_120.jpg"}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1516280440502-6c2e8e986ef6?q=80&w=600&auto=format&fit=crop";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-[#ff0055] font-black uppercase tracking-wider block w-max mb-1">
                        {artist.genre}
                      </span>
                      <h4 className="font-black text-white text-base truncate flex items-center gap-1.5">
                        {artist.name}
                        {artist.isVerified !== false && (
                          <span className="text-[#ff0055] text-xs" title="Verified Artist">
                            ●
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-semibold">
                        {artist.listeners} Listeners
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-4 min-h-[64px] flex items-center">
                    <p className="text-xs text-gray-300 italic leading-relaxed line-clamp-3">
                      "{artist.quote}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                  <button
                    onClick={() => openEditArtist(artist)}
                    className="flex-1 py-2 rounded-xl bg-white/15 hover:bg-[#ff0055] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Ubah Foto & Teks</span>
                  </button>
                  <button
                    onClick={() => deleteArtist(artist.id, artist.name)}
                    className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                    title="Hapus Artis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {artists.length === 0 && (
            <div className="text-center py-16 border border-dashed border-white/20 rounded-3xl bg-black/20">
              <p className="text-sm text-white/60 mb-3">Belum ada artis terdaftar di landing page.</p>
              <button
                onClick={resetToDefaultArtists}
                className="px-5 py-2.5 rounded-xl bg-[#c8f560] text-[#312042] font-black text-xs"
              >
                Muat 13 Artis Default
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: HERO BANNER SETTINGS */}
      {activeSubTab === "hero" && (
        <div className={`${ROYALTY_CARD} space-y-6`}>
          <div className="border-b border-white/15 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#c8f560]" />
              Pengaturan Frame 1 (Hero Banner & Samurai Image)
            </h3>
            <p className="text-xs text-white/65">
              Ubah teks judul utama, teks animasi mesin ketik (typewriter), dan foto karakter background hero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Judul 1 (Putih)
                  </label>
                  <input
                    type="text"
                    value={heroTitle1}
                    onChange={(e) => setHeroTitle1(e.target.value)}
                    placeholder="Breakout"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Judul 2 (Merah/Pink Accent)
                  </label>
                  <input
                    type="text"
                    value={heroTitle2}
                    onChange={(e) => setHeroTitle2(e.target.value)}
                    placeholder="ID"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Teks Animasi Mesin Ketik (Typewriter Text)
                </label>
                <textarea
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Masa depan distribusi musik independen. Rilis karya Anda ke seluruh dunia tanpa batas."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  URL Foto Hero Background
                </label>
                <input
                  type="text"
                  value={heroBgImage}
                  onChange={(e) => setHeroBgImage(e.target.value)}
                  placeholder="/6293920186406475512_121.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Unggah Gambar Karakter Hero Baru
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/30 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-xs text-white">
                  <Upload className="w-4 h-4 text-[#c8f560]" />
                  <span>
                    {uploadingField === "heroBgImage"
                      ? "Mengunggah..."
                      : "Pilih File Foto Hero dari Komputer / HP"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingField === "heroBgImage"}
                    onChange={(e) =>
                      handleFileUpload(e, "heroBgImage", (url) => setHeroBgImage(url))
                    }
                  />
                </label>
              </div>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col">
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Live Preview Hero Frame 1
              </label>
              <div className="relative w-full flex-1 min-h-[260px] rounded-2xl overflow-hidden border border-white/20 bg-black flex items-center justify-center text-center p-6 shadow-2xl">
                <img
                  src={heroBgImage || "/6293920186406475512_121.jpg"}
                  alt="Hero Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/6293920186406475229_121.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
                <div className="relative z-10 max-w-sm">
                  <h3 className="text-3xl font-black uppercase text-white tracking-tight mb-2">
                    {heroTitle1} <span className="text-[#ff0055]">{heroTitle2}</span>
                  </h3>
                  <p className="text-xs text-gray-200 mb-4 line-clamp-3">
                    {heroSubtitle}
                  </p>
                  <span className="inline-block px-5 py-2 rounded-full bg-[#ff0055] text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                    Mulai Rilis Sekarang
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FORM TAMBAH / UBAH ARTIS */}
      {artistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#141419] border border-gray-700 rounded-3xl p-6 text-white space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ff0055]" />
                {editingArtistId ? "Ubah Foto & Data Artis" : "Tambah Artis Baru ke Landing Page"}
              </h4>
              <button
                onClick={() => setArtistModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Photo Preview & Upload */}
              <div>
                <label className="block text-white/70 mb-1.5 font-semibold">
                  Foto Artis (Muncul Bulat di Testimoni)
                </label>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-black/40 border border-gray-800">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ff0055] shrink-0 bg-black shadow-lg">
                    <img
                      src={artistForm.imageUrl || "/6293920186406475218_120.jpg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1516280440502-6c2e8e986ef6?q=80&w=600&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#ff0055] hover:bg-[#ff1a66] text-white font-bold cursor-pointer transition-all shadow-md">
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {uploadingField === "artistPhoto" ? "Mengunggah..." : "Unggah Foto dari HP / PC"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingField === "artistPhoto"}
                        onChange={(e) =>
                          handleFileUpload(e, "artistPhoto", (url) =>
                            setArtistForm({ ...artistForm, imageUrl: url })
                          )
                        }
                      />
                    </label>
                    <input
                      type="text"
                      value={artistForm.imageUrl}
                      onChange={(e) =>
                        setArtistForm({ ...artistForm, imageUrl: e.target.value })
                      }
                      placeholder="Atau tempel link URL foto..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-gray-700 text-white text-[11px] focus:outline-none focus:border-[#ff0055]"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Genre */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-semibold">Nama Artis *</label>
                  <input
                    type="text"
                    value={artistForm.name}
                    onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })}
                    placeholder="Contoh: Shinta Dewi"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-gray-700 text-white focus:outline-none focus:border-[#ff0055]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1 font-semibold">Genre Musik *</label>
                  <input
                    type="text"
                    value={artistForm.genre}
                    onChange={(e) =>
                      setArtistForm({ ...artistForm, genre: e.target.value.toUpperCase() })
                    }
                    placeholder="Contoh: HIP-HOP / URBAN"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-gray-700 text-white focus:outline-none focus:border-[#ff0055]"
                  />
                </div>
              </div>

              {/* Listeners & Verified */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-semibold">
                    Monthly Listeners *
                  </label>
                  <input
                    type="text"
                    value={artistForm.listeners}
                    onChange={(e) =>
                      setArtistForm({ ...artistForm, listeners: e.target.value })
                    }
                    placeholder="Contoh: 3.4M+"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-gray-700 text-white focus:outline-none focus:border-[#ff0055]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1 font-semibold">Status Badge</label>
                  <button
                    type="button"
                    onClick={() =>
                      setArtistForm({ ...artistForm, isVerified: !artistForm.isVerified })
                    }
                    className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all ${artistForm.isVerified
                        ? "bg-[#ff0055]/20 border-[#ff0055] text-white"
                        : "bg-white/5 border-gray-700 text-gray-400"
                      }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#ff0055]" />
                    <span>{artistForm.isVerified ? "Verified Artist" : "Biasa (No Badge)"}</span>
                  </button>
                </div>
              </div>

              {/* Quote / Testimoni */}
              <div>
                <label className="block text-white/70 mb-1 font-semibold">
                  Kutipan Testimoni Musisi *
                </label>
                <textarea
                  rows={3}
                  value={artistForm.quote}
                  onChange={(e) => setArtistForm({ ...artistForm, quote: e.target.value })}
                  placeholder="Kutipan pengalaman distribusi, pembayaran royalti, atau rilis musik..."
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-gray-700 text-white focus:outline-none focus:border-[#ff0055]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setArtistModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveArtistModal}
                className="flex-1 py-2.5 rounded-xl bg-[#c8f560] hover:bg-[#d8ff75] text-[#312042] text-xs font-black shadow-lg transition-all"
              >
                Terapkan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
