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
  MessageSquare,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import type { ArtistItem, TestimonialItem, LandingPageData } from "@/app/page";

const ROYALTY_CARD =
  "bg-[#8a88b5]/70 border border-white/20 rounded-[28px] p-6 text-white shadow-lg";

export function normalizeImageUrl(url?: string | null): string {
  if (!url) return "";
  return url.replace(/https?:\/\/storage\.vpsmurah\.co\.id/g, "/api/storage");
}

interface AdminLandingCMSProps {
  showNotice: (msg: string) => void;
}

export default function AdminLandingCMS({ showNotice }: AdminLandingCMSProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    "hero" | "cards" | "artists" | "testimonials"
  >("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Form State
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroTitle1, setHeroTitle1] = useState("");
  const [heroTitle2, setHeroTitle2] = useState("");
  const [storesCount, setStoresCount] = useState(150);
  const [heroBgImage, setHeroBgImage] = useState("");
  const [navBgImage, setNavBgImage] = useState("");

  // Cards State
  const [card1Text, setCard1Text] = useState("");
  const [card1Image, setCard1Image] = useState("");
  const [card2Title, setCard2Title] = useState("");
  const [card2Desc, setCard2Desc] = useState("");
  const [card2Image, setCard2Image] = useState("");
  const [card3Title, setCard3Title] = useState("");
  const [card3Desc, setCard3Desc] = useState("");
  const [card3Image, setCard3Image] = useState("");

  // Artists & Testimonials State
  const [artists, setArtists] = useState<ArtistItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  // Artist Modal
  const [artistModalOpen, setArtistModalOpen] = useState(false);
  const [editingArtistId, setEditingArtistId] = useState<string | null>(null);
  const [artistForm, setArtistForm] = useState<ArtistItem>({
    id: "",
    name: "",
    genre: "",
    photo: "",
    bio: "",
    monthlyListeners: "",
    topTrack: "",
    spotifyUrl: "",
  });

  // Testimonial Modal
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialItem>({
    id: "",
    name: "",
    artistName: "",
    role: "",
    quote: "",
    avatar: "",
    streams: "",
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
        setHeroSubtitle(d.heroSubtitle || "");
        setHeroTitle1(d.heroTitle1 || "");
        setHeroTitle2(d.heroTitle2 || "");
        setStoresCount(d.storesCount || 150);
        setHeroBgImage(normalizeImageUrl(d.heroBgImage) || "");
        setNavBgImage(normalizeImageUrl(d.navBgImage) || "");

        setCard1Text(d.card1Text || "");
        setCard1Image(normalizeImageUrl(d.card1Image) || "");
        setCard2Title(d.card2Title || "");
        setCard2Desc(d.card2Desc || "");
        setCard2Image(normalizeImageUrl(d.card2Image) || "");
        setCard3Title(d.card3Title || "");
        setCard3Desc(d.card3Desc || "");
        setCard3Image(normalizeImageUrl(d.card3Image) || "");

        setArtists(
          (d.artists || []).map((a) => ({
            ...a,
            photo: normalizeImageUrl(a.photo),
          }))
        );
        setTestimonials(
          (d.testimonials || []).map((t) => ({
            ...t,
            avatar: normalizeImageUrl(t.avatar),
          }))
        );
      }
    } catch (err) {
      console.error("Fetch CMS error:", err);
      showNotice("Gagal mengambil data CMS Landing Page.");
    } finally {
      setLoading(false);
    }
  };

  // Upload Image Handler with Dual Pipeline (R2 Server Upload + Instant Client DataURL Fallback)
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

    // Read client-side first so preview & fallback is 100% guaranteed
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
        e.target.value = ""; // Reset file input so re-selecting same file works
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
        heroSubtitle: heroSubtitle || "Global Reach By BREAKOUT.ID",
        heroTitle1: heroTitle1 || "BREAKOUT",
        heroTitle2: heroTitle2 || "ID",
        storesCount: Number(storesCount) || 150,
        heroBgImage: heroBgImage || "/6293920186406475229_121.jpg",
        navBgImage: navBgImage || "/header-bg.jpg",
        card1Text,
        card1Image,
        card2Title,
        card2Desc,
        card2Image,
        card3Title,
        card3Desc,
        card3Image,
        artists,
        testimonials,
      };

      const res = await fetch("/api/cms/landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        showNotice("✅ Seluruh perubahan teks & gambar berhasil disimpan ke database!");
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
      genre: "Phonk / Bass Nusantara",
      photo: "/6293920186406475218_120.jpg",
      bio: "",
      monthlyListeners: "1.0M",
      topTrack: "Track Rilisan Terbaru",
      spotifyUrl: "https://open.spotify.com",
    });
    setArtistModalOpen(true);
  };

  const openEditArtist = (artist: ArtistItem) => {
    setEditingArtistId(artist.id);
    setArtistForm({ ...artist });
    setArtistModalOpen(true);
  };

  const saveArtistForm = () => {
    if (!artistForm.name) {
      showNotice("Nama artis wajib diisi!");
      return;
    }

    if (editingArtistId) {
      setArtists((prev) =>
        prev.map((a) => (a.id === editingArtistId ? { ...artistForm } : a))
      );
      showNotice(`Profil artis "${artistForm.name}" diperbarui.`);
    } else {
      setArtists((prev) => [...prev, { ...artistForm, id: `art-${Date.now()}` }]);
      showNotice(`Artis baru "${artistForm.name}" ditambahkan.`);
    }
    setArtistModalOpen(false);
  };

  const deleteArtist = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus profil artis "${name}" dari landing page?`)) {
      setArtists((prev) => prev.filter((a) => a.id !== id));
      showNotice(`Artis "${name}" dihapus.`);
    }
  };

  // Testimonials CRUD
  const openAddTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({
      id: `testi-${Date.now()}`,
      name: "",
      artistName: "",
      role: "Music Producer",
      quote: "",
      avatar: "/6293920186406475218_120.jpg",
      streams: "5.0M Streams",
    });
    setTestimonialModalOpen(true);
  };

  const openEditTestimonial = (testi: TestimonialItem) => {
    setEditingTestimonialId(testi.id);
    setTestimonialForm({ ...testi });
    setTestimonialModalOpen(true);
  };

  const saveTestimonialForm = () => {
    if (!testimonialForm.name || !testimonialForm.quote) {
      showNotice("Nama musisi dan teks kutipan wajib diisi!");
      return;
    }

    if (editingTestimonialId) {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === editingTestimonialId ? { ...testimonialForm } : t))
      );
      showNotice(`Testimoni dari "${testimonialForm.name}" diperbarui.`);
    } else {
      setTestimonials((prev) => [
        ...prev,
        { ...testimonialForm, id: `testi-${Date.now()}` },
      ]);
      showNotice(`Testimoni baru dari "${testimonialForm.name}" ditambahkan.`);
    }
    setTestimonialModalOpen(false);
  };

  const deleteTestimonial = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus testimoni dari "${name}"?`)) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      showNotice(`Testimoni "${name}" dihapus.`);
    }
  };

  if (loading) {
    return (
      <div className={`${ROYALTY_CARD} text-center py-16`}>
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#c8f560] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-white/70">Memuat data Web CMS Landing Page...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-card-enter">
      {/* Top Header & Action Bar */}
      <div className={`${ROYALTY_CARD} flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#c8f560]/20 border border-[#c8f560]/40 flex items-center justify-center text-[#c8f560]">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Web CMS Landing Page Manager
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c8f560] text-[#312042] font-black uppercase">
                Live Editor
              </span>
            </h2>
            <p className="text-xs text-white/70">
              Ubah teks, ganti gambar hero/navbar, kelola roster artis, dan perbarui testimoni musisi secara mandiri.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-all border border-white/15"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Landing Page</span>
          </a>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#c8f560] hover:bg-[#d8ff75] text-[#312042] font-black text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan ke DB..." : "Simpan Semua Perubahan"}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "hero", label: "1. Hero & Navbar Background", icon: Sparkles },
          { id: "cards", label: "2. 3 Glass Feature Cards", icon: Layers },
          { id: "artists", label: `3. Roster & Profil Artis (${artists.length})`, icon: Users },
          { id: "testimonials", label: `4. Testimoni Musisi (${testimonials.length})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#312042] text-[#c8f560] shadow-md ring-2 ring-[#c8f560]/40 scale-105"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: HERO & NAVBAR BACKGROUND */}
      {activeSubTab === "hero" && (
        <div className={`${ROYALTY_CARD} space-y-6`}>
          <div className="border-b border-white/15 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c8f560]" />
              Pengaturan Teks & Gambar Hero Section
            </h3>
            <p className="text-xs text-white/65">
              Edit judul animasi typewriter, subtitle, jumlah platform store, serta background gambar anime/studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Hero Subtitle (Animasi Pertama)
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Global Reach By BREAKOUT.ID"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
              />
            </div>

            {/* Stores Count */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Jumlah DSP Stores (Counter Marquee)
              </label>
              <input
                type="number"
                value={storesCount}
                onChange={(e) => setStoresCount(Number(e.target.value) || 0)}
                placeholder="150"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
              />
            </div>

            {/* Hero Title 1 */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Hero Title 1 (Sebelum Titik Hijau)
              </label>
              <input
                type="text"
                value={heroTitle1}
                onChange={(e) => setHeroTitle1(e.target.value)}
                placeholder="BREAKOUT"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono uppercase focus:outline-none focus:border-[#c8f560]"
              />
            </div>

            {/* Hero Title 2 */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Hero Title 2 (Setelah Titik Hijau)
              </label>
              <input
                type="text"
                value={heroTitle2}
                onChange={(e) => setHeroTitle2(e.target.value)}
                placeholder="ID"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono uppercase focus:outline-none focus:border-[#c8f560]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/15">
            {/* Navbar Background Image */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#c8f560]">
                  Background Bar Atas (Navbar)
                </span>
                {navBgImage && (
                  <span className="text-[10px] text-white/60">Aktif Digunakan</span>
                )}
              </div>

              {/* Preview */}
              <div className="w-full h-24 rounded-xl overflow-hidden border border-white/20 relative bg-black/40">
                {navBgImage ? (
                  <img
                    src={normalizeImageUrl(navBgImage)}
                    alt="Navbar BG"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      // Fallback to placeholder if image fails
                      (e.currentTarget as HTMLImageElement).src = "/header-bg.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                    Belum ada gambar navbar
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={navBgImage}
                  onChange={(e) => setNavBgImage(e.target.value)}
                  placeholder="/header-bg.jpg atau URL online"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
                />
                <label className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadingField === "navBg" ? "Uploading..." : "Upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, "navBg", (url) => setNavBgImage(url))
                    }
                  />
                </label>
              </div>
            </div>

            {/* Hero Main Background Image */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#c8f560]">
                  Background Utama Hero Section
                </span>
                {heroBgImage && (
                  <span className="text-[10px] text-white/60">Aktif Digunakan</span>
                )}
              </div>

              {/* Preview */}
              <div className="w-full h-24 rounded-xl overflow-hidden border border-white/20 relative bg-black/40">
                {heroBgImage ? (
                  <img
                    src={normalizeImageUrl(heroBgImage)}
                    alt="Hero BG"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/6293920186406475229_121.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                    Belum ada gambar hero
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={heroBgImage}
                  onChange={(e) => setHeroBgImage(e.target.value)}
                  placeholder="/6293920186406475229_121.jpg atau URL online"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
                />
                <label className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadingField === "heroBg" ? "Uploading..." : "Upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, "heroBg", (url) => setHeroBgImage(url))
                    }
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: 3 GLASS FEATURE CARDS */}
      {activeSubTab === "cards" && (
        <div className={`${ROYALTY_CARD} space-y-6`}>
          <div className="border-b border-white/15 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c8f560]" />
              Pengaturan 3 Kartu Kaca Transparan (Feature Cards)
            </h3>
            <p className="text-xs text-white/65">
              Edit teks, judul, dan gambar bundar artis di ketiga kartu transparan bawah hero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 (Green Glow) */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8fff00]" />
                <span className="text-xs font-bold text-white">Kartu 1 (Glow Green)</span>
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">
                  Teks Animasi Card 1
                </label>
                <textarea
                  rows={3}
                  value={card1Text}
                  onChange={(e) => setCard1Text(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
                />
              </div>

              {/* Image Preview & Upload */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#8fff00] shrink-0 bg-black">
                  <img
                    src={normalizeImageUrl(card1Image) || "/6293920186406475218_120.jpg"}
                    alt="Card 1"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/6293920186406475218_120.jpg";
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={card1Image}
                    onChange={(e) => setCard1Image(e.target.value)}
                    placeholder="URL Gambar..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-[11px]"
                  />
                  <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, "c1", (url) => setCard1Image(url))
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Card 2 (Orange Glow) */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5722]" />
                <span className="text-xs font-bold text-white">Kartu 2 (Glow Orange)</span>
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">
                  Judul Tebal Card 2
                </label>
                <input
                  type="text"
                  value={card2Title}
                  onChange={(e) => setCard2Title(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-[#c8f560]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">
                  Deskripsi Card 2
                </label>
                <textarea
                  rows={2}
                  value={card2Desc}
                  onChange={(e) => setCard2Desc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
                />
              </div>

              {/* Image Preview & Upload */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ff5722] shrink-0 bg-black">
                  <img
                    src={normalizeImageUrl(card2Image) || "/6293920186406475218_120.jpg"}
                    alt="Card 2"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/6293920186406475218_120.jpg";
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={card2Image}
                    onChange={(e) => setCard2Image(e.target.value)}
                    placeholder="URL Gambar..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-[11px]"
                  />
                  <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, "c2", (url) => setCard2Image(url))
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Card 3 (Blue Glow) */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2196f3]" />
                <span className="text-xs font-bold text-white">Kartu 3 (Glow Blue)</span>
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">
                  Judul Tebal Card 3
                </label>
                <input
                  type="text"
                  value={card3Title}
                  onChange={(e) => setCard3Title(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-[#c8f560]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">
                  Deskripsi Card 3
                </label>
                <textarea
                  rows={2}
                  value={card3Desc}
                  onChange={(e) => setCard3Desc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
                />
              </div>

              {/* Image Preview & Upload */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#2196f3] shrink-0 bg-black">
                  <img
                    src={normalizeImageUrl(card3Image) || "/6293920186406475218_120.jpg"}
                    alt="Card 3"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/6293920186406475218_120.jpg";
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={card3Image}
                    onChange={(e) => setCard3Image(e.target.value)}
                    placeholder="URL Gambar..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-[11px]"
                  />
                  <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, "c3", (url) => setCard3Image(url))
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ROSTER & PROFIL ARTIS */}
      {activeSubTab === "artists" && (
        <div className={`${ROYALTY_CARD} space-y-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#c8f560]" />
                Manajemen Roster & Profil Artis di Landing Page
              </h3>
              <p className="text-xs text-white/65">
                Tambahkan musisi unggulan, ubah bio, atur monthly listeners, link profil DSP, dan unggah foto profil.
              </p>
            </div>

            <button
              onClick={openAddArtist}
              className="px-4 py-2.5 rounded-xl bg-[#c8f560] hover:bg-[#d8ff75] text-[#312042] font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Profil Artis Baru</span>
            </button>
          </div>

          {/* Grid Artis Saat Ini */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/15 flex flex-col justify-between group hover:border-[#c8f560]/50 transition-all"
              >
                <div>
                  <div className="w-full h-36 rounded-xl overflow-hidden mb-3 relative bg-black/40">
                    <img
                      src={normalizeImageUrl(artist.photo) || "/6293920186406475218_120.jpg"}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/6293920186406475218_120.jpg";
                      }}
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-[#c8f560] font-semibold border border-white/20">
                      {artist.genre}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm mb-1">{artist.name}</h4>
                  <p className="text-[11px] text-white/60 line-clamp-2 mb-3">
                    {artist.bio}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-white/80 py-1.5 border-t border-white/10">
                    <span>Listeners: <strong>{artist.monthlyListeners}</strong></span>
                    <span className="text-[#c8f560]">{artist.topTrack}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-3">
                  <button
                    onClick={() => openEditArtist(artist)}
                    className="flex-1 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Ubah Profil</span>
                  </button>
                  <button
                    onClick={() => deleteArtist(artist.id, artist.name)}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                    title="Hapus Artis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {artists.length === 0 && (
            <div className="text-center py-12 border border-dashed border-white/20 rounded-2xl">
              <p className="text-sm text-white/60 mb-3">Belum ada artis terdaftar di roster.</p>
              <button
                onClick={openAddArtist}
                className="px-4 py-2 rounded-xl bg-[#c8f560] text-[#312042] font-bold text-xs"
              >
                + Tambah Artis Pertama
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: TESTIMONI MUSISI */}
      {activeSubTab === "testimonials" && (
        <div className={`${ROYALTY_CARD} space-y-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#c8f560]" />
                Manajemen Testimoni & Kata Musisi
              </h3>
              <p className="text-xs text-white/65">
                Tambahkan review musisi, rating bintang, kutipan autentik royalti, dan foto avatar.
              </p>
            </div>

            <button
              onClick={openAddTestimonial}
              className="px-4 py-2.5 rounded-xl bg-[#c8f560] hover:bg-[#d8ff75] text-[#312042] font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Testimoni Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((testi) => (
              <div
                key={testi.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/15 flex flex-col justify-between group hover:border-[#c8f560]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c8f560]/20 text-[#c8f560] border border-[#c8f560]/40 font-mono font-bold">
                      {testi.streams}
                    </span>
                    <span className="text-xs text-[#c8f560]">★★★★★</span>
                  </div>

                  <p className="text-xs text-white/80 italic leading-relaxed mb-4">
                    "{testi.quote}"
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c8f560]/60 shrink-0 bg-black">
                      <img
                        src={normalizeImageUrl(testi.avatar) || "/6293920186406475218_120.jpg"}
                        alt={testi.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/6293920186406475218_120.jpg";
                        }}
                      />
                    </div>
                    <div className="leading-tight">
                      <p className="font-bold text-white text-xs">{testi.name}</p>
                      <p className="text-[11px] text-[#c8f560]">{testi.artistName}</p>
                      <p className="text-[10px] text-white/50">{testi.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditTestimonial(testi)}
                      className="flex-1 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Ubah</span>
                    </button>
                    <button
                      onClick={() => deleteTestimonial(testi.id, testi.name)}
                      className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                      title="Hapus Testimoni"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {testimonials.length === 0 && (
            <div className="text-center py-12 border border-dashed border-white/20 rounded-2xl">
              <p className="text-sm text-white/60 mb-3">Belum ada testimoni musisi.</p>
              <button
                onClick={openAddTestimonial}
                className="px-4 py-2 rounded-xl bg-[#c8f560] text-[#312042] font-bold text-xs"
              >
                + Tambah Testimoni Pertama
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL ARTIS (ADD / EDIT) */}
      {artistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#312042] border border-white/20 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#c8f560]" />
                {editingArtistId ? "Ubah Profil Artis" : "Tambah Artis Baru ke Roster"}
              </h4>
              <button
                onClick={() => setArtistModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Nama Musisi / Band *</label>
                  <input
                    type="text"
                    value={artistForm.name}
                    onChange={(e) =>
                      setArtistForm({ ...artistForm, name: e.target.value })
                    }
                    placeholder="Contoh: Basstrack Indo"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c8f560]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Genre / Tag Musik</label>
                  <input
                    type="text"
                    value={artistForm.genre}
                    onChange={(e) =>
                      setArtistForm({ ...artistForm, genre: e.target.value })
                    }
                    placeholder="Contoh: Phonk / Electronic"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c8f560]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Monthly Listeners</label>
                  <input
                    type="text"
                    value={artistForm.monthlyListeners}
                    onChange={(e) =>
                      setArtistForm({
                        ...artistForm,
                        monthlyListeners: e.target.value,
                      })
                    }
                    placeholder="1.8M"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c8f560]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Top Track Hit</label>
                  <input
                    type="text"
                    value={artistForm.topTrack}
                    onChange={(e) =>
                      setArtistForm({ ...artistForm, topTrack: e.target.value })
                    }
                    placeholder="Midnight Drift Vol. 2"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c8f560]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Link Spotify / DSP Profile</label>
                <input
                  type="text"
                  value={artistForm.spotifyUrl}
                  onChange={(e) =>
                    setArtistForm({ ...artistForm, spotifyUrl: e.target.value })
                  }
                  placeholder="https://open.spotify.com/artist/..."
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c8f560]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Bio Singkat</label>
                <textarea
                  rows={2}
                  value={artistForm.bio}
                  onChange={(e) =>
                    setArtistForm({ ...artistForm, bio: e.target.value })
                  }
                  placeholder="Ceritakan profil singkat artis..."
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c8f560]"
                />
              </div>

              {/* Photo & Upload */}
              <div>
                <label className="block text-white/70 mb-1">Foto Artis / Cover</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 bg-black shrink-0">
                    <img
                      src={normalizeImageUrl(artistForm.photo) || "/6293920186406475218_120.jpg"}
                      alt="Artist Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/6293920186406475218_120.jpg";
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    value={artistForm.photo}
                    onChange={(e) =>
                      setArtistForm({ ...artistForm, photo: e.target.value })
                    }
                    placeholder="URL gambar..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, "artistPhoto", (url) =>
                          setArtistForm((prev) => ({ ...prev, photo: url }))
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/15">
              <button
                type="button"
                onClick={() => setArtistModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveArtistForm}
                className="px-5 py-2 rounded-xl bg-[#c8f560] hover:bg-[#d8ff75] text-[#312042] font-bold text-xs shadow-md"
              >
                Simpan Profil Artis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TESTIMONI (ADD / EDIT) */}
      {testimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#312042] border border-white/20 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#c8f560]" />
                {editingTestimonialId ? "Ubah Testimoni" : "Tambah Testimoni Musisi Baru"}
              </h4>
              <button
                onClick={() => setTestimonialModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Nama Musisi *</label>
                  <input
                    type="text"
                    value={testimonialForm.name}
                    onChange={(e) =>
                      setTestimonialForm({ ...testimonialForm, name: e.target.value })
                    }
                    placeholder="Contoh: Rian Ardiansyah"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c8f560]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Nama Project / Alias</label>
                  <input
                    type="text"
                    value={testimonialForm.artistName}
                    onChange={(e) =>
                      setTestimonialForm({
                        ...testimonialForm,
                        artistName: e.target.value,
                      })
                    }
                    placeholder="Contoh: Basstrack Indo"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c8f560]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Peran / Profesi</label>
                  <input
                    type="text"
                    value={testimonialForm.role}
                    onChange={(e) =>
                      setTestimonialForm({ ...testimonialForm, role: e.target.value })
                    }
                    placeholder="Electronic Producer"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c8f560]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Badge Streams</label>
                  <input
                    type="text"
                    value={testimonialForm.streams}
                    onChange={(e) =>
                      setTestimonialForm({
                        ...testimonialForm,
                        streams: e.target.value,
                      })
                    }
                    placeholder="15.4M Streams"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c8f560]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Teks Kutipan / Review *</label>
                <textarea
                  rows={3}
                  value={testimonialForm.quote}
                  onChange={(e) =>
                    setTestimonialForm({ ...testimonialForm, quote: e.target.value })
                  }
                  placeholder="Tuliskan pengalaman rilis atau pencairan royalti..."
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c8f560]"
                />
              </div>

              {/* Avatar & Upload */}
              <div>
                <label className="block text-white/70 mb-1">Foto Avatar Musisi</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-black shrink-0">
                    <img
                      src={normalizeImageUrl(testimonialForm.avatar) || "/6293920186406475218_120.jpg"}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/6293920186406475218_120.jpg";
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    value={testimonialForm.avatar}
                    onChange={(e) =>
                      setTestimonialForm({
                        ...testimonialForm,
                        avatar: e.target.value,
                      })
                    }
                    placeholder="URL gambar..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#c8f560]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, "testiAvatar", (url) =>
                          setTestimonialForm((prev) => ({ ...prev, avatar: url }))
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/15">
              <button
                type="button"
                onClick={() => setTestimonialModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveTestimonialForm}
                className="px-5 py-2 rounded-xl bg-[#c8f560] hover:bg-[#d8ff75] text-[#312042] font-bold text-xs shadow-md"
              >
                Simpan Testimoni
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

