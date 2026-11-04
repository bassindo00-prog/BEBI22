"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Activity,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Sun,
  Bell,
  Plus,
  Check,
  Clock,
  Music,
  FolderOpen,
  Globe,
  Trash2,
  Volume2,
  Building2,
  Smartphone,
  ChevronDown,
  ArrowRight,
  Shield,
  UploadCloud,
  User,
  Lock,
  Sliders,
  CheckCircle2,
  Inbox,
  Mail,
  Send,
  Sparkles,
  Wand2,
  Palette,
  ListMusic,
  Youtube,
  HardDrive,
  Search,
  Copy,
  ExternalLink,
  Menu,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import GlobalStreamsMap3D from "@/components/GlobalStreamsMap3D";
import VisaMetricCard from "@/components/VisaMetricCard";
import AICoverArtGenerator from "@/components/AICoverArtGenerator";

type ReleaseItem = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  releaseDate: string;
  duration: string;
  streams: string;
  streamsNum: number;
  platform: string;
  platforms: string;
  status: string;
  coverUrl: string;
  audioFile?: string;
  upc?: string;
  isrc?: string;
  country?: string;
  royaltyGrowth?: string;
};

type WithdrawalItem = {
  id: string;
  date: string;
  amount: number;
  method: string;
  accountNumber: string;
  status: string;
};

type CatalogItem = {
  id: string;
  songId: string;
  title: string;
  artist: string;
  publisher: string;
  status: string;
  youtubeLink?: string | null;
  driveLink?: string | null;
  createdAt?: string;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  totalStreams: number;
  royaltyBalance: number;
  royaltyPending: number;
  totalWithdrawn: number;
  pendingWithdraw: number;
  releases: ReleaseItem[];
  withdrawals: WithdrawalItem[];
};

const OVERVIEW_CHART_POINTS = [
  { day: "Mon", x: 18, y: 55, val: 32 },
  { day: "Tue", x: 68, y: 62, val: 28 },
  { day: "Wed", x: 115, y: 66, val: 24 },
  { day: "Thu", x: 160, y: 42, val: 41 },
  { day: "Fri", x: 205, y: 21, val: 56 },
  { day: "Sat", x: 260, y: 58, val: 35 },
  { day: "Sun", x: 306, y: 34, val: 48 },
];

const ANALYTICS_CHART_POINTS = [
  { month: "Jan", x: 12, y: 52, val: 54 },
  { month: "Feb", x: 52, y: 56, val: 48 },
  { month: "Apr", x: 88, y: 68, val: 39 },
  { month: "May", x: 125, y: 39, val: 68 },
  { month: "Jun", x: 161, y: 21, val: 90 },
  { month: "Jul", x: 208, y: 54, val: 62 },
  { month: "now", x: 250, y: 30, val: 84 },
];

// Shared card class matching the "Royalty Growth" translucent lavender card
const ROYALTY_CARD =
  "bg-[#8a88b5]/70 border border-white/20 rounded-[28px] p-6 text-white shadow-lg";

export default function UserDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "catalog" | "releases" | "wallet" | "upload" | "inbox" | "settings" | "generator"
  >("overview");
  const [period, setPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [themeMode, setThemeMode] = useState<"Light" | "Dark">("Light");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [catalogs, setCatalogs] = useState<CatalogItem[]>([]);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [copiedSongId, setCopiedSongId] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cover Art Generator State & Link to Submit Track
  const [uploadCoverUrl, setUploadCoverUrl] = useState(
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
  );

  // Settings Form State
  const [settingsName, setSettingsName] = useState("Abdul");
  const [settingsEmail, setSettingsEmail] = useState("abdul@hermes.music");
  const [settingsAvatar, setSettingsAvatar] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  );
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsLabelName, setSettingsLabelName] = useState("HERMES Music Distribution");
  const [settingsIsrcPrefix, setSettingsIsrcPrefix] = useState("US-HRM-26");
  const [autoContentId, setAutoContentId] = useState(true);
  const [dolbyAtmos, setDolbyAtmos] = useState(true);
  const [autoPayout, setAutoPayout] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Animation states (0 -> 1 smooth progress on mount, tab change, or period switch)
  const [animProgress, setAnimProgress] = useState(0);
  const [barsReady, setBarsReady] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [hoveredDayIdx, setHoveredDayIdx] = useState<number>(4);
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number>(4);
  const [liveTick, setLiveTick] = useState(0);

  // Upload Track Form State
  const [trackTitle, setTrackTitle] = useState("Midnight Serenade");
  const [trackArtist, setTrackArtist] = useState("HERMES");
  const [trackFeaturing, setTrackFeaturing] = useState("Luna Eclipse");
  const [trackComposer, setTrackComposer] = useState("Abdul • Avelin FX");
  const [trackProducer, setTrackProducer] = useState("Luxoa Mastering Lab");
  const [trackGenre, setTrackGenre] = useState("Electronic • Downtempo");
  const [tiktokStartSec, setTiktokStartSec] = useState(45); // 00:45
  const [tiktokDurationSec, setTiktokDurationSec] = useState(30); // 30s clip
  const [trackDateIso, setTrackDateIso] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [trackUpc, setTrackUpc] = useState("899214578109");
  const [trackIsrc, setTrackIsrc] = useState("ID-HRM-24-00109");
  const [audioFileName, setAudioFileName] = useState("audio_preview_final.wav");
  const [audioFileKey, setAudioFileKey] = useState<string>("");
  const [audioFileUrl, setAudioFileUrl] = useState<string>("");
  const [audioFileSize, setAudioFileSize] = useState<string>("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadCoverKey, setUploadCoverKey] = useState<string>("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "Spotify",
    "Apple Music",
    "TikTok",
    "YouTube",
  ]);
  const [submittingTrack, setSubmittingTrack] = useState(false);

  // New states for deferred upload on Review & Submit
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [localAudioPreviewUrl, setLocalAudioPreviewUrl] = useState<string>("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewStatusStep, setReviewStatusStep] = useState<string>("");
  const [reviewError, setReviewError] = useState<string>("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Safe JSON response parser to prevent crashing on plain text or HTML errors
  const safeParseJson = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { ok: false, error: text || `HTTP ${res.status}: ${res.statusText}` };
    }
  };

  // Safe Selection of Audio File (Stored locally until Review & Submit)
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedAudioFile(file);
    setAudioFileName(file.name);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    setAudioFileSize(sizeMB);
    const localUrl = URL.createObjectURL(file);
    setLocalAudioPreviewUrl(localUrl);
    setAudioFileUrl(localUrl);
    showNotice(`✓ File audio "${file.name}" (${sizeMB}) dipilih. Proses upload akan berjalan saat klik Review & Submit.`);
  };

  // Safe Selection of Cover Artwork (Stored locally until Review & Submit)
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedCoverFile(file);
    const localUrl = URL.createObjectURL(file);
    setUploadCoverUrl(localUrl);
    showNotice(`✓ Cover Artwork "${file.name}" dipilih.`);
  };

  // Robust Dual-Mode Uploader to Cloudflare R2
  const uploadFileWithFallback = async (
    file: File,
    fileType: "audio" | "cover",
    onProgress?: (msg: string) => void
  ) => {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";

    // Method 1: Direct presigned PUT to Cloudflare R2
    try {
      onProgress?.(`Menyiapkan presigned upload URL (${file.name})...`);
      const presignRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || (fileType === "audio" ? "audio/mpeg" : "image/jpeg"),
          fileSize: file.size,
          fileType,
        }),
      });

      const presignData = await safeParseJson(presignRes);
      if (presignRes.ok && presignData.ok && presignData.uploadUrl) {
        onProgress?.(`Mengunggah langsung ke Cloudflare R2 (${sizeMB})...`);
        const uploadRes = await fetch(presignData.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || (fileType === "audio" ? "audio/mpeg" : "image/jpeg"),
          },
          body: file,
        });

        if (uploadRes.ok) {
          onProgress?.(`Memverifikasi objek di Cloudflare R2...`);
          const verifyRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "verify", key: presignData.key }),
          });
          const verifyData = await safeParseJson(verifyRes);
          if (verifyRes.ok && verifyData.ok && verifyData.verified) {
            return {
              key: presignData.key,
              publicUrl: `/api/storage/${presignData.key}`,
            };
          }
        }
      }
    } catch (err: any) {
      console.warn("Direct R2 presigned PUT failed (likely CORS preflight), using server stream fallback...", err);
    }

    // Method 2: Secure Server Stream to Cloudflare R2 (Bypasses browser CORS completely)
    onProgress?.(`Mengunggah via secure backend stream ke Cloudflare R2 (${sizeMB})...`);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);

    const serverRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const serverData = await safeParseJson(serverRes);
    if (!serverRes.ok || !serverData.ok || !serverData.key) {
      const errMsg = serverData.error || `Server upload error (HTTP ${serverRes.status}): ${serverRes.statusText}`;
      throw new Error(
        `Upload gagal (${fileType === "audio" ? "Master Audio" : "Cover Artwork"}): ${errMsg}`
      );
    }

    return {
      key: serverData.key,
      publicUrl: `/api/storage/${serverData.key}`,
    };
  };

  // Open Review & Submit Modal
  const handleOpenReviewModal = () => {
    if (!trackTitle.trim()) {
      showNotice("Silakan isi Judul Track (Title) terlebih dahulu!");
      return;
    }
    if (!selectedAudioFile && !audioFileKey) {
      showNotice("Silakan pilih file Audio (.wav, .mp3, .flac) terlebih dahulu!");
      return;
    }
    setReviewError("");
    setReviewSuccess(false);
    setReviewStatusStep("");
    setReviewSubmitting(false);
    setShowReviewModal(true);
  };

  // Execute Upload and Submit Release inside Review Modal
  const executeUploadAndSubmitRelease = async () => {
    setReviewSubmitting(true);
    setReviewError("");
    setReviewSuccess(false);

    try {
      let finalAudioKey = audioFileKey;
      let finalAudioUrl = audioFileUrl;
      let finalCoverKey = uploadCoverKey;
      let finalCoverUrl = uploadCoverUrl;

      // 1. Upload Master Audio if selected
      if (selectedAudioFile) {
        setReviewStatusStep(`Mengunggah Master Audio: ${selectedAudioFile.name} (${audioFileSize})...`);
        const audioUploadResult = await uploadFileWithFallback(selectedAudioFile, "audio", (msg) => {
          setReviewStatusStep(msg);
        });
        finalAudioKey = audioUploadResult.key;
        finalAudioUrl = audioUploadResult.publicUrl;
        setAudioFileKey(finalAudioKey);
        setAudioFileUrl(finalAudioUrl);
      } else if (!finalAudioKey) {
        throw new Error("File master audio belum dipilih atau diunggah.");
      }

      // 2. Upload Cover Artwork if selected
      if (selectedCoverFile) {
        setReviewStatusStep(`Mengunggah Cover Artwork: ${selectedCoverFile.name}...`);
        const coverUploadResult = await uploadFileWithFallback(selectedCoverFile, "cover", (msg) => {
          setReviewStatusStep(msg);
        });
        finalCoverKey = coverUploadResult.key;
        finalCoverUrl = coverUploadResult.publicUrl;
        setUploadCoverKey(finalCoverKey);
        setUploadCoverUrl(finalCoverUrl);
      }

      // 3. Submit Release Metadata to Database
      setReviewStatusStep("Mendaftarkan rilisan ke database...");
      const res = await fetch("/api/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trackTitle,
          artist: trackFeaturedArtistLabel(),
          featuring: trackFeaturing,
          composer: trackComposer,
          producer: trackProducer,
          tiktokClip: formattedTiktokClip,
          genre: trackGenre,
          releaseDate: formattedReleaseDate,
          upc: trackUpc,
          isrc: trackIsrc,
          coverUrl: finalCoverUrl,
          coverKey: finalCoverKey,
          audioFile: finalAudioUrl || audioFileName,
          audioKey: finalAudioKey,
          platforms: selectedPlatforms.join(","),
          status: "Pending",
        }),
      });

      const data = await safeParseJson(res);
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Gagal mendaftarkan rilis ke sistem.");
      }

      // 4. Success! Refresh user data
      await fetchUserData();
      setReviewSuccess(true);
      setReviewStatusStep("✓ Rilisan berhasil dikirim!");
      showNotice("Selamat! Rilisan Anda berhasil dikirim.");
    } catch (err: any) {
      console.error("Submit release error:", err);
      setReviewError(err.message || "Terjadi kesalahan saat memproses upload audio/cover.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Format seconds to MM:SS for TikTok Clip
  const formatSec = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const formattedTiktokClip = `${formatSec(tiktokStartSec)} - ${formatSec(
    tiktokStartSec + tiktokDurationSec
  )} (${tiktokDurationSec}s)`;

  // Format YYYY-MM-DD to DD-MM-YYYY automatically
  const formattedReleaseDate = (() => {
    const parts = trackDateIso.split("-");
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return trackDateIso;
  })();

  // Set automatic release date by offset days without typing
  const applyQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setTrackDateIso(d.toISOString().split("T")[0]);
  };

  // Withdrawal Form State
  const [withdrawMethod, setWithdrawMethod] = useState("Bank • BCA");
  const [accountNumber, setAccountNumber] = useState("1234 5678 9012 3456");
  const [withdrawAmount, setWithdrawAmount] = useState("300");
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handleCopySongId = (songId: string) => {
    navigator.clipboard?.writeText(songId);
    setCopiedSongId(songId);
    showNotice(`Song ID ${songId} berhasil disalin!`);
    setTimeout(() => setCopiedSongId(""), 2000);
  };

  useEffect(() => {
    setAnimProgress(0);
    setBarsReady(false);
    setAnimKey((prev) => prev + 1);

    const barTimer = setTimeout(() => setBarsReady(true), 80);

    let frameId: number;
    const startTime = performance.now();
    const duration = 1250;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimProgress(eased);
      if (t < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      clearTimeout(barTimer);
      cancelAnimationFrame(frameId);
    };
  }, [activeTab, period]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTick((prev) => (prev + 1) % 100);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setSettingsName(data.user.name || "Abdul");
        setSettingsEmail(data.user.email || "abdul@hermes.music");
        if (data.user.avatar) setSettingsAvatar(data.user.avatar);
      }
      // Also fetch messages for inbox
      const msgRes = await fetch("/api/messages");
      const msgData = await msgRes.json();
      if (msgData.messages) {
        setMessages(msgData.messages);
      }

      // Fetch Music Catalog
      const catRes = await fetch("/api/catalog");
      const catData = await catRes.json();
      if (catData.items) {
        setCatalogs(catData.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: settingsName,
          email: settingsEmail,
          avatar: settingsAvatar,
          ...(settingsPassword ? { password: settingsPassword } : {}),
        }),
      });
      if (res.ok) {
        await fetchUserData();
        setSettingsPassword("");
        showNotice("Pengaturan akun & distribusi berhasil disimpan ke Prisma DB!");
      }
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleTogglePlatform = (plat: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(plat) ? prev.filter((p) => p !== plat) : [...prev, plat]
    );
  };

  const handleCreateRelease = async (statusType: "Pending" | "Draft") => {
    setSubmittingTrack(true);
    try {
      const res = await fetch("/api/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trackTitle,
          artist: trackFeaturedArtistLabel(),
          featuring: trackFeaturing,
          composer: trackComposer,
          producer: trackProducer,
          tiktokClip: formattedTiktokClip,
          genre: trackGenre,
          releaseDate: formattedReleaseDate,
          upc: trackUpc,
          isrc: trackIsrc,
          coverUrl: uploadCoverUrl,
          coverKey: uploadCoverKey,
          audioFile: audioFileUrl || audioFileName,
          audioKey: audioFileKey,
          platforms: selectedPlatforms.join(","),
          status: "Pending",
        }),
      });

      const data = await safeParseJson(res);
      if (res.ok && data.ok !== false) {
        await fetchUserData();
        showNotice(
          statusType === "Draft"
            ? "Track saved as draft in Prisma DB!"
            : `Track submitted! TikTok Clip (${formattedTiktokClip}) & Release Date (${formattedReleaseDate}) saved.`
        );
        setActiveTab("releases");
      } else {
        throw new Error(data.error || "Gagal membuat rilis");
      }
    } catch (err: any) {
      console.error("Submit release error:", err);
      showNotice(`Gagal submit track: ${err.message}`);
    } finally {
      setSubmittingTrack(false);
    }
  };

  const trackFeaturedArtistLabel = () => {
    return trackFeaturing.trim()
      ? `${trackArtist} feat. ${trackFeaturing.trim()}`
      : trackArtist;
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingWithdraw(true);
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: withdrawMethod,
          accountNumber,
          amount: Number(withdrawAmount) || 300,
        }),
      });
      if (res.ok) {
        await fetchUserData();
        showNotice(`Withdrawal of $${withdrawAmount} via ${withdrawMethod} submitted!`);
      }
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    router.push("/login");
  };

  const releases = user?.releases || [];
  const withdrawals = user?.withdrawals || [];
  const approvedCount = releases.filter((r) => r.status === "Approved").length;
  const pendingCount = releases.filter((r) => r.status === "Pending").length;
  const totalReleasesCount = releases.length;

  const userStreams = user?.totalStreams || 0;
  const userRoyalty = user?.royaltyBalance || 0;
  const userPendingRoyalty = user?.royaltyPending || 0;

  const batteryTarget = releases.length > 0 ? Math.round((approvedCount / releases.length) * 100) : 0;
  const animatedBatteryPct = Math.round(batteryTarget * animProgress);
  const animatedStreamsToday = Math.round(userStreams * animProgress);
  const animatedRoyaltyPending = Math.round(userPendingRoyalty * animProgress);
  const animatedRoyaltyBalance = Math.round(userRoyalty * animProgress);

  const hasStreamData = userStreams > 0 || userRoyalty > 0;
  const animatedDonutPct = hasStreamData ? Math.round(71 * animProgress) : 0;

  const overviewChartPoints = useMemo(() => {
    if (!hasStreamData) {
      return [
        { day: "Mon", x: 18, y: 92, val: 0 },
        { day: "Tue", x: 68, y: 92, val: 0 },
        { day: "Wed", x: 115, y: 92, val: 0 },
        { day: "Thu", x: 160, y: 92, val: 0 },
        { day: "Fri", x: 205, y: 92, val: 0 },
        { day: "Sat", x: 260, y: 92, val: 0 },
        { day: "Sun", x: 306, y: 92, val: 0 },
      ];
    }
    const base = Math.max(1, Math.round(userStreams / 7));
    return [
      { day: "Mon", x: 18, y: 55, val: Math.round(base * 0.8) },
      { day: "Tue", x: 68, y: 62, val: Math.round(base * 0.7) },
      { day: "Wed", x: 115, y: 66, val: Math.round(base * 0.6) },
      { day: "Thu", x: 160, y: 42, val: Math.round(base * 1.1) },
      { day: "Fri", x: 205, y: 21, val: Math.round(base * 1.5) },
      { day: "Sat", x: 260, y: 58, val: Math.round(base * 0.9) },
      { day: "Sun", x: 306, y: 34, val: Math.round(base * 1.2) },
    ];
  }, [hasStreamData, userStreams]);

  const analyticsChartPoints = useMemo(() => {
    if (!hasStreamData) {
      return [
        { month: "Jan", x: 12, y: 88, val: 0 },
        { month: "Feb", x: 52, y: 88, val: 0 },
        { month: "Apr", x: 88, y: 88, val: 0 },
        { month: "May", x: 125, y: 88, val: 0 },
        { month: "Jun", x: 161, y: 88, val: 0 },
        { month: "Jul", x: 208, y: 88, val: 0 },
        { month: "now", x: 250, y: 88, val: 0 },
      ];
    }
    const base = Math.max(1, Math.round(userRoyalty / 6));
    return [
      { month: "Jan", x: 12, y: 52, val: Math.round(base * 0.7) },
      { month: "Feb", x: 52, y: 56, val: Math.round(base * 0.6) },
      { month: "Apr", x: 88, y: 68, val: Math.round(base * 0.5) },
      { month: "May", x: 125, y: 39, val: Math.round(base * 0.9) },
      { month: "Jun", x: 161, y: 21, val: Math.round(base * 1.2) },
      { month: "Jul", x: 208, y: 54, val: Math.round(base * 0.8) },
      { month: "now", x: 250, y: 30, val: Math.round(base * 1.1) },
    ];
  }, [hasStreamData, userRoyalty]);

  const activeOverviewPoint = overviewChartPoints[hoveredDayIdx] || overviewChartPoints[4];
  const activeAnalyticsPoint = analyticsChartPoints[hoveredMonthIdx] || analyticsChartPoints[4];

  return (
    <div
      className={`h-screen w-full overflow-hidden flex transition-colors duration-300 ${
        themeMode === "Dark"
          ? "bg-gradient-to-br from-[#5d5b86] via-[#6e6c99] to-[#4f4d75]"
          : "bg-gradient-to-br from-[#9493be] via-[#acabcf] to-[#8f8eb9]"
      }`}
    >
      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#312042] text-white text-xs font-medium shadow-xl border border-[#c8f560]/50 flex items-center gap-2.5 animate-card-enter">
          <span className="w-2 h-2 rounded-full bg-[#c8f560] animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* Full Screen Layout: Viewport Locked, Zero Window Scroll */}
      <div className="w-full h-full flex overflow-hidden">
        {/* MOBILE SLIDE-OUT MENU DRAWER — Muncul saat tombol menu HP diklik */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside className="relative w-72 max-w-[82vw] h-full bg-[#46385f] border-r border-white/20 z-50 flex flex-col justify-between p-5 text-white shadow-2xl overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-3.5 h-6 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <span className="font-bold text-sm tracking-tight text-white block">HERMES</span>
                      <span className="text-[10px] text-[#c8f560] font-semibold tracking-wider uppercase">Artist Studio</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="mt-5 space-y-1.5">
                  {[
                    { id: "overview", label: "Dashboard Overview", icon: Home },
                    { id: "analytics", label: "Analytics & Streams", icon: Activity },
                    { id: "catalog", label: "Katalog Musik (Song ID)", icon: ListMusic },
                    { id: "generator", label: "Studio AI Cover Art", icon: Sparkles },
                    { id: "upload", label: "Submit Track Rilis Baru", icon: UploadCloud },
                    { id: "releases", label: "My Releases & UPC/ISRC", icon: FolderOpen },
                    { id: "wallet", label: "Royalty & Withdraw", icon: Building2 },
                    { id: "inbox", label: `Inbox Pesan (${messages.length})`, icon: Inbox },
                    { id: "settings", label: "Pengaturan Akun", icon: Settings },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                          isActive
                            ? "bg-[#312042] text-[#c8f560] font-bold shadow-md border border-[#c8f560]/30"
                            : "text-white/85 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className={`p-2 rounded-xl ${isActive ? "bg-[#c8f560]/20 text-[#c8f560]" : "bg-white/10 text-white"}`}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-white/15 space-y-3">
                <div className="flex items-center gap-3 px-1">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full object-cover border border-white/40"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{user?.name || "Abdul"}</p>
                    <p className="text-[10px] text-white/70 truncate">{user?.email || "abdul@hermes.music"}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/30 text-white text-xs font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* LEFT SIDEBAR (DESKTOP) — Pinned & Frozen, Hidden on mobile */}
        <aside className="hidden md:flex w-[74px] sm:w-[86px] h-full shrink-0 border-r border-white/20 flex-col items-center py-6 justify-between select-none z-40 bg-[#74729f]/30 backdrop-blur-md">
          {/* Top Logo Circle */}
          <div className="flex flex-col items-center gap-10">
            <Link
              href="/"
              title="Back to Landing Page"
              className="w-11 h-11 rounded-full border-2 border-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              <div className="w-4 h-7 rounded-full border-2 border-white" />
            </Link>

            {/* Navigation Pill Icons */}
            <nav className="flex flex-col items-center gap-3.5 mt-2">
              <button
                onClick={() => setActiveTab("overview")}
                title="Dashboard Overview"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "overview"
                    ? "bg-[#312042] text-white shadow-md scale-110"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Home className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                title="Analytics & Streaming"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "analytics"
                    ? "bg-[#312042] text-white shadow-md scale-110"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Activity className="w-4 h-4" />
              </button>

              {/* Dedicated Menu Button for Music Catalog */}
              <button
                onClick={() => setActiveTab("catalog")}
                title="Katalog Musik (Song ID, Publisher & Link)"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "catalog"
                    ? "bg-[#312042] text-[#c8f560] shadow-md scale-110 ring-2 ring-[#c8f560]/40"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <ListMusic className="w-4 h-4" />
              </button>

              {/* Dedicated Menu Button for AI Cover Art Generator */}
              <button
                onClick={() => setActiveTab("generator")}
                title="Studio AI Cover Art Generator"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "generator"
                    ? "bg-[#312042] text-[#c8f560] shadow-md scale-110 ring-2 ring-[#c8f560]/40"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </button>

              {/* Dedicated Menu Button for Submit Track */}
              <button
                onClick={() => setActiveTab("upload")}
                title="New Release — Submit Track"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "upload"
                    ? "bg-[#312042] text-[#c8f560] shadow-md scale-110 ring-2 ring-[#c8f560]/40"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <UploadCloud className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab("releases")}
                title="My Releases & Calendar"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "releases"
                    ? "bg-[#312042] text-white shadow-md scale-110"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Calendar className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab("wallet")}
                title="Royalty & Withdrawals"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "wallet"
                    ? "bg-[#312042] text-white shadow-md scale-110"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              {/* Inbox Menu Button */}
              <button
                onClick={() => setActiveTab("inbox")}
                title="Pesan Masuk / Inbox"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                  activeTab === "inbox"
                    ? "bg-[#312042] text-[#c8f560] shadow-md scale-110 ring-2 ring-[#c8f560]/40"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Inbox className="w-4 h-4" />
                {messages.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#c8f560]" />
                )}
              </button>

              <div className="h-2 w-6 border-b border-white/20" />

              {/* Gear Icon -> Settings / Pengaturan */}
              <button
                onClick={() => setActiveTab("settings")}
                title="Pengaturan / Account Settings"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "settings"
                    ? "bg-[#312042] text-white shadow-md scale-110"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Settings
                  className={`w-4 h-4 transition-transform duration-500 ${
                    activeTab === "settings" ? "rotate-90 text-[#c8f560]" : ""
                  }`}
                />
              </button>
            </nav>
          </div>

          {/* Bottom Logout Icon */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-11 h-11 rounded-full bg-white/20 text-white hover:bg-white/35 flex items-center justify-center transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* RIGHT COLUMN: Pinned Top Bar + Scrollable Main Content */}
        <div className="flex-1 h-full flex flex-col overflow-hidden min-w-0">
          {/* FROZEN TOP BAR — Permanently Pinned at the top, NEVER moves during scroll */}
          <header className="w-full shrink-0 z-30 px-4 sm:px-7 md:px-8 py-3 sm:py-3.5 border-b border-white/15 bg-[#8a88b5]/85 backdrop-blur-md shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              {/* Brand + Mobile Hamburger Toggle */}
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="md:hidden p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
                    title="Buka Menu Navigasi"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <span className="text-lg sm:text-xl font-bold tracking-wide text-white flex items-center gap-2">
                    {activeTab === "analytics" || activeTab === "upload" || activeTab === "releases"
                      ? "Luxoa"
                      : "HERMES"}
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c8f560] text-[#312042] uppercase tracking-wider">
                      Artist
                    </span>
                  </span>
                </div>

                {/* Mobile Right Controls */}
                <div className="flex sm:hidden items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setThemeMode(themeMode === "Dark" ? "Light" : "Dark")}
                    className="p-1.5 rounded-full bg-[#312042] text-[#c8f560] border border-white/20"
                    title="Ganti Tema"
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => showNotice("All DSP nodes operational • Live telemetry active")}
                    className="p-1.5 rounded-full bg-white/15 text-white relative"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c8f560] absolute top-1.5 right-1.5" />
                  </button>
                  <img
                    src={
                      user?.avatar ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                    }
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-white/60"
                  />
                </div>

                {/* Quick View Switcher Bar (Desktop XL) */}
                <div className="hidden xl:flex items-center gap-1 ml-4 bg-[#8a88b5]/60 border border-white/20 p-1 rounded-full text-[11px]">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "analytics", label: "Analytics" },
                    { id: "catalog", label: "Katalog" },
                    { id: "generator", label: "AI Art" },
                    { id: "upload", label: "+ Submit Track" },
                    { id: "releases", label: "My Releases" },
                    { id: "wallet", label: "Royalty & Withdraw" },
                    { id: "inbox", label: `Inbox (${messages.length})` },
                    { id: "settings", label: "⚙ Pengaturan" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1 rounded-full transition-all ${
                        activeTab === tab.id
                          ? "bg-[#312042] text-white font-medium"
                          : "text-white/85 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Center Period Switcher — Responsive 3-Pills (Daily / Weekly / Monthly) */}
              <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
                {(["Daily", "Weekly", "Monthly"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`flex-1 sm:flex-initial text-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all ${
                      period === p
                        ? "bg-[#312042] text-white shadow-sm scale-105"
                        : "bg-[#8a88b5]/70 border border-white/20 text-white/90 hover:bg-white/25"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Desktop Right Controls (hidden on mobile) */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="bg-[#8a88b5]/70 border border-white/20 p-1 rounded-full flex items-center text-xs">
                  <button
                    onClick={() => setThemeMode("Dark")}
                    className={`px-3.5 py-1.5 rounded-full transition-all ${
                      themeMode === "Dark"
                        ? "bg-[#312042] text-white font-medium"
                        : "text-white/85"
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setThemeMode("Light")}
                    className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                      themeMode === "Light"
                        ? "bg-[#312042] text-[#c8f560] font-semibold shadow-sm"
                        : "text-white/85"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                </div>

                <button
                  onClick={() => showNotice("All DSP nodes operational • Live telemetry active")}
                  className="w-10 h-10 rounded-full bg-[#8a88b5]/70 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-[#c8f560] absolute top-2.5 right-2.5 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-[#c8f560] absolute top-2.5 right-2.5" />
                </button>

                <img
                  src={
                    user?.avatar ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  }
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/60"
                />
              </div>
            </div>
          </header>

          {/* MAIN SCROLLABLE BODY — Hanya bagian konten ini yang bergulir */}
          <main className="flex-1 w-full overflow-y-auto overflow-x-hidden p-5 sm:p-7 md:p-8">

          {/* =========================================================
              VIEW 1: DASHBOARD OVERVIEW — ALL CARDS MATCH ROYALTY GROWTH
             ========================================================= */}
          {activeTab === "overview" && (
            <div key={`overview-${animKey}`} className="space-y-6">
              {/* Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 animate-card-enter">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                    Welcome Back, {user?.name || "Abdul"}!
                  </h1>
                  <p className="text-xs text-white/80 mt-1">
                    information designed to accurate insights
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-xs text-white/80">Total streams today</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-white mt-0.5 tabular-nums">
                      {animatedStreamsToday > 0 ? `${animatedStreamsToday.toLocaleString()}K` : "0"}
                    </p>
                  </div>

                  <div className="h-9 w-[1px] bg-white/25 hidden sm:block" />

                  <div>
                    <p className="text-xs text-white/80">Royalty pending</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-white mt-0.5 tabular-nums">
                      ${animatedRoyaltyPending.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("upload")}
                    className="px-5 py-3 rounded-full bg-[#312042] hover:bg-[#422c58] text-white text-xs font-medium flex items-center gap-2 shadow-md transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Track</span>
                  </button>
                </div>
              </div>

              {/* Row 1: Release Completion, Royalty Growth, Streams by Platform */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Card 1: Release Completion — Translucent Lavender Card */}
                <div
                  className={`lg:col-span-4 ${ROYALTY_CARD} flex flex-col justify-between animate-card-enter`}
                  style={{ animationDelay: "60ms" }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">Release Completion</h3>
                    <div className="flex items-center gap-1.5 text-xs text-white/80">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c8f560] animate-pulse" />
                      <span>12:00</span>
                    </div>
                  </div>

                  {/* Animated 76% Battery Pill with Live Filling Bar */}
                  <div className="my-5 relative h-24 rounded-[26px] flex items-center justify-center select-none group">
                    <svg
                      viewBox="0 0 300 96"
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                      <rect
                        x="4"
                        y="4"
                        width="292"
                        height="88"
                        rx="24"
                        fill="none"
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="8"
                      />
                      <rect
                        x="4"
                        y="4"
                        width="292"
                        height="88"
                        rx="24"
                        fill="none"
                        stroke="#b8b7e8"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="720"
                        strokeDashoffset={720 - 340 * animProgress}
                        className="transition-all duration-300"
                      />
                      <rect
                        x="4"
                        y="4"
                        width="292"
                        height="88"
                        rx="24"
                        fill="none"
                        stroke="#c8f560"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${210 * animProgress} 720`}
                        strokeDashoffset={-240}
                        className="transition-all duration-300"
                      />
                    </svg>

                    <div className="w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-[20px] bg-white/10 overflow-hidden relative flex items-center justify-center">
                      <div
                        style={{
                          width: `${animatedBatteryPct}%`,
                        }}
                        className="absolute left-0 top-0 bottom-0 progress-stripes transition-all duration-300 ease-out overflow-hidden border-r-2 border-[#c8f560]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#312042]/35 via-[#c8f560]/25 to-[#c8f560]/45" />
                        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-battery-shimmer" />
                      </div>

                      <div className="relative z-10 flex items-center gap-1.5">
                        <span className="text-3xl font-semibold text-white tabular-nums tracking-tight drop-shadow">
                          {animatedBatteryPct}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/85 pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#b8b7e8]" />
                      Spotify
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c8f560]" />
                      Apple Music
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
                      TikTok
                    </span>
                  </div>
                </div>

                {/* Card 2: Royalty Growth */}
                <div
                  className={`lg:col-span-5 ${ROYALTY_CARD} flex flex-col justify-between relative overflow-hidden animate-card-enter`}
                  style={{ animationDelay: "130ms" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">Royalty Growth</h3>
                      <span className="w-2 h-2 rounded-full bg-[#c8f560] animate-ping" />
                    </div>
                    <button
                      onClick={() => setActiveTab("analytics")}
                      className="px-3.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-xs text-white/90 transition-colors"
                    >
                      Report
                    </button>
                  </div>

                  <div className="relative h-36 mt-2 flex items-end">
                    <div className="flex flex-col justify-between h-full text-[11px] text-white/70 pr-3 pb-5">
                      <span>60</span>
                      <span>40</span>
                      <span>20</span>
                      <span>10</span>
                    </div>

                    <div className="flex-1 relative h-full">
                      <div
                        style={{
                          left: `${(activeOverviewPoint.x / 320) * 100}%`,
                        }}
                        className="absolute -top-1 bg-[#312042] border border-[#c8f560]/60 text-[#c8f560] px-3 py-1 rounded-xl text-xs font-bold shadow-lg transition-all duration-300 animate-tooltip-float z-20 tabular-nums"
                      >
                        {Math.round(activeOverviewPoint.val * animProgress)} {hasStreamData ? "K" : "Streams"}
                        <div className="w-2 h-2 bg-[#312042] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                      </div>

                      <svg viewBox="0 0 320 110" className="w-full h-28 overflow-visible">
                        <defs>
                          <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#c8f560" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#c8f560" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {hasStreamData ? (
                          <>
                            <rect
                              x={activeOverviewPoint.x - 11}
                              y={activeOverviewPoint.y}
                              width="22"
                              height={105 - activeOverviewPoint.y}
                              rx="11"
                              fill="url(#barGlow)"
                              className="animate-pillar-rise transition-all duration-300"
                            />

                            <path
                              d="M 10 85 C 45 85, 65 85, 95 62 C 125 42, 150 78, 185 68 C 215 58, 240 42, 265 65 C 285 80, 300 75, 312 62"
                              fill="none"
                              stroke="rgba(255,255,255,0.35)"
                              strokeWidth="2.5"
                              className="animate-svg-line"
                            />

                            <path
                              d="M 10 55 C 45 55, 65 55, 85 68 C 110 82, 130 50, 160 42 C 185 35, 198 18, 212 22 C 235 28, 265 62, 285 58 C 300 54, 308 38, 312 32"
                              fill="none"
                              stroke="#c8f560"
                              strokeWidth="3"
                              className="animate-svg-line"
                            />

                            <circle
                              cx={activeOverviewPoint.x}
                              cy={activeOverviewPoint.y}
                              r="11"
                              fill="#c8f560"
                              opacity="0.3"
                              className="animate-ping transition-all duration-300"
                            />

                            <circle
                              cx={activeOverviewPoint.x}
                              cy={activeOverviewPoint.y}
                              r="6"
                              fill="#8a88b5"
                              stroke="#c8f560"
                              strokeWidth="3.5"
                              className="transition-all duration-300"
                            />
                          </>
                        ) : (
                          <>
                            <line
                              x1="10"
                              y1="92"
                              x2="310"
                              y2="92"
                              stroke="#c8f560"
                              strokeWidth="2"
                              strokeDasharray="4 4"
                              opacity="0.45"
                            />
                            <circle
                              cx={activeOverviewPoint.x}
                              cy={92}
                              r="5"
                              fill="#312042"
                              stroke="#c8f560"
                              strokeWidth="2.5"
                            />
                          </>
                        )}

                        {overviewChartPoints.map((pt, idx) => (
                          <rect
                            key={pt.day}
                            x={pt.x - 20}
                            y="0"
                            width="40"
                            height="110"
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredDayIdx(idx)}
                          />
                        ))}
                      </svg>

                      {!hasStreamData && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-6">
                          <span className="text-[10px] text-white/50 bg-[#312042]/50 px-2.5 py-0.5 rounded-full border border-white/10">
                            Belum ada statistik streaming
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-white/75 pt-1">
                        {overviewChartPoints.map((pt, idx) => (
                          <button
                            key={pt.day}
                            type="button"
                            onMouseEnter={() => setHoveredDayIdx(idx)}
                            onClick={() => setHoveredDayIdx(idx)}
                            className={`transition-colors ${
                              hoveredDayIdx === idx
                                ? "text-[#c8f560] font-semibold"
                                : "hover:text-white"
                            }`}
                          >
                            {pt.day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Streams by Platform — Translucent Lavender Card */}
                <div
                  className={`lg:col-span-3 ${ROYALTY_CARD} flex flex-col justify-between animate-card-enter`}
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">Streams by Platform</h3>
                    <span className="flex items-center gap-1.5 text-xs text-[#c8f560] font-medium shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c8f560] animate-pulse" />
                      streams
                    </span>
                  </div>

                  <div className="flex items-end justify-between h-32 pt-4 gap-2 relative">
                    <div className="flex flex-col justify-between h-full text-[10px] text-white/70 pb-5 shrink-0">
                      <span>600</span>
                      <span>400</span>
                      <span>200</span>
                    </div>

                    <div className="flex-1 grid grid-cols-4 gap-1 sm:gap-2">
                      {[
                        { label: "Spotify", h1: 68, h2: 42, c1: "bg-[#c8f560]" },
                        { label: "Apple Music", h1: 96, h2: 50, c1: "bg-[#c4c3f0]" },
                        { label: "TikTok", h1: 68, h2: 36, c1: "bg-[#c8f560]" },
                        { label: "YouTube", h1: 82, h2: 56, c1: "bg-[#c4c3f0]" },
                      ].map((bar, i) => {
                        const liveOffset = liveTick % 2 === i % 2 ? 3 : -2;
                        const height1 = barsReady ? (hasStreamData ? Math.max(12, bar.h1 + liveOffset) : 6) : 0;
                        const height2 = barsReady ? (hasStreamData ? Math.max(10, bar.h2 - liveOffset) : 6) : 0;
                        return (
                          <div key={i} className="flex flex-col items-center gap-2 group min-w-0">
                            <div className="flex items-end justify-center gap-1 h-24 w-full">
                              <div
                                style={{
                                  height: `${height1}%`,
                                  transitionDelay: `${i * 110}ms`,
                                }}
                                className={`w-2 sm:w-2.5 rounded-full ${bar.c1} transition-all duration-1000 ease-out`}
                              />
                              <div
                                style={{
                                  height: `${height2}%`,
                                  transitionDelay: `${i * 110 + 60}ms`,
                                }}
                                className="w-2 sm:w-2.5 rounded-full bg-white/25 transition-all duration-1000 ease-out"
                              />
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-white/80 truncate w-full text-center group-hover:text-[#c8f560] transition-all">
                              {bar.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Recent Releases Table + Upcoming Releases Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Recent Releases — Translucent Lavender Card with Horizontal Scroll Protection */}
                <div
                  className={`lg:col-span-8 ${ROYALTY_CARD} flex flex-col justify-between animate-card-enter`}
                  style={{ animationDelay: "260ms" }}
                >
                  <div className="pb-4 flex items-center justify-between border-b border-white/15">
                    <h3 className="text-sm font-medium text-white">Recent Releases</h3>
                    <button
                      onClick={() => setActiveTab("releases")}
                      className="text-xs text-[#c8f560] underline hover:text-white"
                    >
                      See All Releases
                    </button>
                  </div>

                  <div className="pt-3 flex-1 overflow-x-auto">
                    <div className="min-w-[480px]">
                      <div className="grid grid-cols-12 text-xs text-white/65 pb-3 border-b border-white/15 px-2">
                        <div className="col-span-5 font-semibold">Release Title</div>
                        <div className="col-span-2 text-center font-semibold">Date</div>
                        <div className="col-span-2 text-center font-semibold">UPC Barcode</div>
                        <div className="col-span-3 text-right font-semibold">ISRC Code</div>
                      </div>

                      {releases.length === 0 ? (
                        <div className="py-10 text-center text-white/70">
                          <Music className="w-10 h-10 mx-auto text-white/25 mb-2" />
                          <p className="font-semibold text-xs text-white">Belum Ada Rilisan Musik</p>
                          <p className="text-[11px] text-white/60 mt-1 max-w-sm mx-auto">
                            Lagu yang Anda submit akan muncul di sini lengkap dengan status verifikasi, barcode UPC & ISRC.
                          </p>
                          <button
                            onClick={() => setActiveTab("upload")}
                            className="mt-3 px-4 py-1.5 rounded-full bg-[#312042] text-[11px] text-[#c8f560] font-semibold hover:bg-[#422c58] transition-colors"
                          >
                            + Submit Lagu Baru
                          </button>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/15">
                          {releases.slice(0, 3).map((item) => (
                            <div
                              key={item.id}
                              className="grid grid-cols-12 items-center py-3.5 text-xs hover:bg-white/10 rounded-xl px-2 transition-colors"
                            >
                              <div className="col-span-5 flex items-center gap-3 min-w-0 pr-2">
                                <img
                                  src={item.coverUrl}
                                  alt={item.title}
                                  className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/25"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-white truncate">{item.title}</p>
                                  <p className="text-[11px] text-white/70 truncate">{item.genre}</p>
                                </div>
                              </div>
                              <div className="col-span-2 text-center font-medium text-white/90 whitespace-nowrap">
                                {item.releaseDate}
                              </div>
                              <div className="col-span-2 text-center font-mono font-semibold text-white/90 text-[11px] whitespace-nowrap">
                                {item.upc || "899214578101"}
                              </div>
                              <div className="col-span-3 text-right font-mono font-bold text-[#c8f560] text-[11px] whitespace-nowrap">
                                {item.isrc || "ID-HRM-24-00101"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upcoming Releases Schedule — Translucent Lavender Card */}
                <div
                  className={`lg:col-span-4 ${ROYALTY_CARD} flex flex-col justify-between animate-card-enter`}
                  style={{ animationDelay: "320ms" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white">Upcoming Releases</h3>
                    <span className="text-xs text-white/75 flex items-center gap-1">
                      Schedule <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {releases.length === 0 ? (
                    <div className="py-10 text-center text-white/70">
                      <Calendar className="w-10 h-10 mx-auto text-white/25 mb-2" />
                      <p className="font-medium text-xs text-white">Belum Ada Jadwal Rilis</p>
                      <p className="text-[11px] text-white/60 mt-1">
                        Jadwal tanggal rilis DSP Anda akan muncul di sini.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-12 items-center gap-2 pb-3 border-b border-white/15">
                        <div className="col-span-3 text-white/75">
                          <p className="text-[11px] text-white/70 mb-1">DSP</p>
                          <p className="font-semibold text-white">Live</p>
                          <p className="text-[11px]">Active</p>
                        </div>
                        <div className="col-span-9">
                          <p className="text-[11px] text-white/70 mb-1.5">Scheduled Releases</p>
                          <div className="px-4 py-2.5 rounded-2xl bg-white/15 text-white font-medium">
                            {releases.length} Track Terjadwal
                          </div>
                        </div>
                      </div>

                      {releases.slice(0, 3).map((slot, idx) => (
                        <div key={slot.id} className="grid grid-cols-12 items-center gap-2">
                          <div className="col-span-3">
                            <p className="font-semibold text-white text-[11px]">{slot.releaseDate.split("-")[0] || "01"}</p>
                            <p className="text-[10px] text-white/70">DSP</p>
                          </div>
                          <div className="col-span-9">
                            <div
                              style={{
                                width: barsReady ? "100%" : "0%",
                                transitionDelay: `${idx * 140 + 200}ms`,
                              }}
                              className={`px-3.5 py-2.5 rounded-2xl ${
                                idx === 0
                                  ? "bg-[#c8f560] text-[#312042]"
                                  : idx === 1
                                  ? "bg-[#312042] text-white"
                                  : "bg-white/20 text-white"
                              } flex items-center justify-between text-[11px] font-medium overflow-hidden whitespace-nowrap transition-all duration-700 ease-out`}
                            >
                              <span className="truncate">{slot.title}</span>
                              <span className="text-[10px] opacity-80 shrink-0 ml-1">{slot.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 2: ANALYTICS & STREAMING — ALL CARDS MATCH ROYALTY GROWTH
             ========================================================= */}
          {activeTab === "analytics" && (
            <div key={`analytics-${animKey}`} className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 animate-card-enter">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                    Analytics & Streaming
                  </h1>
                  <p className="text-xs text-white/80 mt-1">
                    Real-time performance for HERMES
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-xs text-white/80">Total Streams</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-white mt-0.5 tabular-nums">
                      {animatedStreamsToday > 0 ? `${animatedStreamsToday.toLocaleString()}K` : "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/80">Royalty</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-white mt-0.5 tabular-nums">
                      ${animatedRoyaltyPending.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/80">Top Platform</p>
                    <p className="text-xl sm:text-2xl font-semibold text-white mt-0.5">
                      {hasStreamData ? "Spotify" : "-"}
                    </p>
                  </div>
                  <button
                    onClick={() => showNotice("Campaign Boost activated for Spotify & TikTok!")}
                    className="px-5 py-3 rounded-full bg-[#312042] hover:bg-[#422c58] text-white text-xs font-medium flex items-center gap-2 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Campaign</span>
                  </button>
                </div>
              </div>

              {/* Row 1: Royalty Growth, Streams by Platform, Platform Breakdown Donut */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Royalty Growth Card */}
                <div
                  className={`lg:col-span-4 ${ROYALTY_CARD} animate-card-enter`}
                  style={{ animationDelay: "60ms" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white">Royalty Growth</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-medium text-white/90">
                        Last 30 Days
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-medium text-white/90">
                        Report
                      </span>
                    </div>
                  </div>

                  <div className="relative h-36 flex items-end">
                    <div className="flex flex-col justify-between h-full text-[10px] text-white/70 pr-2 pb-5">
                      <span>100</span>
                      <span>60</span>
                      <span>40</span>
                      <span>20</span>
                    </div>
                    <div className="flex-1 relative h-full">
                      <div
                        style={{
                          left: `${(activeAnalyticsPoint.x / 260) * 100}%`,
                        }}
                        className="absolute -top-1 bg-[#312042] border border-[#c8f560]/60 text-[#c8f560] px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm transition-all duration-300 animate-tooltip-float z-20 tabular-nums"
                      >
                        {Math.round(activeAnalyticsPoint.val * animProgress)}$
                      </div>
                      <svg viewBox="0 0 260 100" className="w-full h-28 overflow-visible">
                        {hasStreamData ? (
                          <>
                            <rect
                              x={activeAnalyticsPoint.x - 9}
                              y={activeAnalyticsPoint.y}
                              width="18"
                              height={95 - activeAnalyticsPoint.y}
                              rx="9"
                              fill="rgba(200,245,96,0.38)"
                              className="animate-pillar-rise transition-all duration-300"
                            />
                            <path
                              d="M 5 75 C 35 75, 50 75, 70 50 C 90 30, 115 70, 140 55 C 165 40, 185 55, 210 68 C 230 78, 245 72, 255 60"
                              fill="none"
                              stroke="rgba(255,255,255,0.4)"
                              strokeWidth="2.2"
                              className="animate-svg-line"
                            />
                            <path
                              d="M 5 52 C 35 52, 50 52, 68 64 C 88 76, 105 42, 130 38 C 150 35, 156 18, 168 22 C 185 28, 210 56, 230 52 C 245 48, 250 35, 255 28"
                              fill="none"
                              stroke="#c8f560"
                              strokeWidth="2.8"
                              className="animate-svg-line"
                            />
                            <circle
                              cx={activeAnalyticsPoint.x}
                              cy={activeAnalyticsPoint.y}
                              r="9"
                              fill="#c8f560"
                              opacity="0.35"
                              className="animate-ping transition-all duration-300"
                            />
                            <circle
                              cx={activeAnalyticsPoint.x}
                              cy={activeAnalyticsPoint.y}
                              r="5.5"
                              fill="#8a88b5"
                              stroke="#c8f560"
                              strokeWidth="3.5"
                              className="transition-all duration-300"
                            />
                          </>
                        ) : (
                          <>
                            <line
                              x1="5"
                              y1="88"
                              x2="255"
                              y2="88"
                              stroke="#c8f560"
                              strokeWidth="2"
                              strokeDasharray="4 4"
                              opacity="0.4"
                            />
                            <circle
                              cx={activeAnalyticsPoint.x}
                              cy={88}
                              r="4.5"
                              fill="#312042"
                              stroke="#c8f560"
                              strokeWidth="2"
                            />
                          </>
                        )}
                        {analyticsChartPoints.map((pt, idx) => (
                          <rect
                            key={pt.month}
                            x={pt.x - 16}
                            y="0"
                            width="32"
                            height="100"
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredMonthIdx(idx)}
                          />
                        ))}
                      </svg>
                      <div className="flex items-center justify-between text-[10px] text-white/75">
                        {analyticsChartPoints.map((pt, idx) => (
                          <button
                            key={pt.month}
                            type="button"
                            onMouseEnter={() => setHoveredMonthIdx(idx)}
                            onClick={() => setHoveredMonthIdx(idx)}
                            className={`transition-colors ${
                              hoveredMonthIdx === idx
                                ? "text-[#c8f560] font-bold"
                                : "hover:text-white"
                            }`}
                          >
                            {pt.month}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Streams by Platform Large Animated Bars */}
                <div
                  className={`lg:col-span-4 ${ROYALTY_CARD} flex flex-col justify-between animate-card-enter`}
                  style={{ animationDelay: "130ms" }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">Streams by Platform</h3>
                    <span className="px-3 py-1 rounded-full bg-[#c8f560] text-[#312042] text-[11px] font-semibold">
                      streams
                    </span>
                  </div>

                  <div className="flex items-end justify-between h-36 pt-4 gap-3 relative">
                    <div className="flex flex-col justify-between h-full text-[10px] text-white/70 pb-5">
                      <span>1200</span>
                      <span>800</span>
                      <span>600</span>
                      <span>0</span>
                    </div>
                    {[
                      { name: "Spotify", pct: 95, bg: "bg-[#c8f560]" },
                      { name: "Apple Music", pct: 68, bg: "bg-[#c4c3f0]" },
                      { name: "TikTok", pct: 56, bg: "bg-[#c8f560]" },
                      { name: "YouTube", pct: 58, bg: "bg-[#c4c3f0]" },
                    ].map((b, i) => {
                      const jitter = liveTick % 2 === i % 2 ? 3 : -2;
                      const heightPct = barsReady ? (hasStreamData ? b.pct + jitter : 5) : 0;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex justify-center items-end h-28">
                            <div
                              style={{
                                height: `${heightPct}%`,
                                transitionDelay: `${i * 120}ms`,
                              }}
                              className={`w-10 rounded-t-lg ${b.bg} transition-all duration-1000 ease-out`}
                            />
                          </div>
                          <span className="text-[10px] text-white/80 whitespace-nowrap">
                            {b.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Platform Breakdown 71% Animated Donut */}
                <div
                  className={`lg:col-span-4 ${ROYALTY_CARD} flex flex-col items-center justify-between animate-card-enter`}
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="w-full flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">Platform Breakdown</h3>
                  </div>

                  <div className="relative w-32 h-32 my-2 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="5.5"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#c8f560"
                        strokeWidth="5.5"
                        strokeDasharray={`${(hasStreamData ? 30 : 0) * animProgress} 100`}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <span className="absolute text-xl font-bold text-white tabular-nums">
                      {hasStreamData ? `${animatedDonutPct}%` : "0%"}
                    </span>
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-medium text-white/90 mb-1">Spotify Share</p>
                    <div className="flex items-center gap-4 text-[11px] text-white/75">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#c8f560]" />
                        Spotify {hasStreamData ? `${animatedDonutPct}%` : "0%"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
                        Other {hasStreamData ? `${100 - animatedDonutPct}%` : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Top Tracks — Streams by Country + Global Streams Heatmap */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div
                  className={`lg:col-span-7 ${ROYALTY_CARD} flex flex-col animate-card-enter`}
                  style={{ animationDelay: "260ms" }}
                >
                  <div className="pb-3 border-b border-white/15">
                    <h3 className="text-sm font-medium text-white">
                      Top Tracks — Streams by Country
                    </h3>
                  </div>
                  <div className="pt-3 flex-1">
                    <div className="grid grid-cols-12 text-xs text-white/65 pb-3 border-b border-white/15">
                      <div className="col-span-5">Track</div>
                      <div className="col-span-3 text-center">Country</div>
                      <div className="col-span-2 text-center">Streams</div>
                      <div className="col-span-2 text-right">Royalty</div>
                    </div>
                    <div className="divide-y divide-white/15">
                      {[
                        {
                          title: "Midnight Lights",
                          sub: "Pop • HERMES",
                          country: "🇺🇸 United States",
                          streams: "1.2M",
                          royalty: "+12.4%",
                          avatar:
                            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80",
                        },
                        {
                          title: "Neon Dawn",
                          sub: "Electronic • HERMES",
                          country: "🇬🇧 United Kingdom",
                          streams: "980K",
                          royalty: "+8.1%",
                          avatar:
                            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&auto=format&fit=crop&q=80",
                        },
                        {
                          title: "City Pulse",
                          sub: "Chill • HERMES",
                          country: "🇩🇪 Germany",
                          streams: "754K",
                          royalty: "+5.6%",
                          avatar:
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
                        },
                      ].map((t, idx) => (
                        <div key={idx} className="grid grid-cols-12 items-center py-3.5 text-xs">
                          <div className="col-span-5 flex items-center gap-3">
                            <img
                              src={t.avatar}
                              alt={t.title}
                              className="w-10 h-10 rounded-full object-cover border border-white/30"
                            />
                            <div>
                              <p className="font-semibold text-white">{t.title}</p>
                              <p className="text-[11px] text-white/70">{t.sub}</p>
                            </div>
                          </div>
                          <div className="col-span-3 text-center font-medium text-white/90">
                            {t.country}
                          </div>
                          <div className="col-span-2 text-center font-semibold text-white">
                            {t.streams}
                          </div>
                          <div className="col-span-2 text-right font-semibold text-[#c8f560]">
                            {t.royalty}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Global Streams Heatmap Card with Real Interactive 3D Map & 3D Globe */}
                <div
                  className={`lg:col-span-5 ${ROYALTY_CARD} flex flex-col justify-between animate-card-enter`}
                  style={{ animationDelay: "320ms" }}
                >
                  <GlobalStreamsMap3D />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 3: NEW RELEASE — SUBMIT TRACK — ALL CARDS MATCH ROYALTY GROWTH
             ========================================================= */}
          {activeTab === "upload" && (
            <div key={`upload-${animKey}`} className="space-y-5">
              <div className="animate-card-enter">
                <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                  New Release — Submit Track
                </h1>
                <p className="text-xs text-white/80 mt-1">
                  HERMES Music Distribution • upload and distribute to all platforms
                </p>
              </div>

              {/* 4-Step Progress Pill Bar — Translucent Lavender */}
              <div
                className="bg-[#8a88b5]/70 border border-white/20 rounded-full px-5 py-3 flex flex-wrap items-center justify-between gap-4 text-xs text-white shadow-md animate-card-enter"
                style={{ animationDelay: "60ms" }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#312042] text-[#c8f560] flex items-center justify-center font-semibold">
                    1
                  </span>
                  <span className="px-4 py-1 rounded-full bg-[#312042] text-white font-medium">
                    Upload Track
                  </span>
                  <div className="w-16 h-0.5 bg-[#c8f560]/60 hidden sm:block" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border border-white/35 text-white/90 flex items-center justify-center font-medium">
                    2
                  </span>
                  <span className="font-medium text-white/90">Details</span>
                  <div className="w-16 h-0.5 bg-white/20 hidden sm:block" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border border-white/35 text-white/90 flex items-center justify-center font-medium">
                    3
                  </span>
                  <span className="font-medium text-white/90">Platforms</span>
                  <div className="w-16 h-0.5 bg-white/20 hidden sm:block" />
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border border-white/35 text-white/90 flex items-center justify-center font-medium">
                    4
                  </span>
                  <span className="font-medium text-white/90">Review & Submit</span>
                  <span className="text-white/65 text-[11px] ml-2">Step 1 of 4</span>
                </div>
              </div>

              {/* Main 2-Column Upload Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Column: Upload Track + Track Details */}
                <div
                  className={`lg:col-span-7 ${ROYALTY_CARD} space-y-5 animate-card-enter`}
                  style={{ animationDelay: "120ms" }}
                >
                  <div className="flex items-center gap-2 font-semibold text-sm text-white">
                    <Music className="w-4 h-4 text-[#c8f560]" />
                    <span>Upload Track</span>
                  </div>

                  {/* Dashed Dropzone with Live Animated Equalizer Waveform */}
                  <div className="border-2 border-dashed border-white/30 rounded-2xl p-6 text-center bg-white/10">
                    <p className="text-sm font-semibold text-white">
                      Drag & drop your audio file here
                    </p>
                    <p className="text-xs text-white/75 mt-0.5">
                      or click to browse .wav, .mp3, .flac • Max 500MB
                    </p>

                    <div className="my-5 flex items-center justify-center gap-1 h-12">
                      {[
                        3, 6, 4, 8, 5, 9, 11, 7, 12, 8, 5, 10, 12, 9, 6, 11, 8, 12, 7, 9, 5, 8,
                        10, 6, 4, 7, 9, 5, 3,
                      ].map((h, i) => (
                        <span
                          key={i}
                          style={{
                            height: `${h * 3.5}px`,
                            animationDelay: `${(i % 7) * 140}ms`,
                          }}
                          className={`w-1 rounded-full animate-eq-bar ${
                            i % 2 === 0 ? "bg-[#c8f560]" : "bg-white/65"
                          }`}
                        />
                      ))}
                    </div>

                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#312042] hover:bg-[#422c58] text-white text-xs font-medium cursor-pointer transition-colors shadow">
                      <Plus className="w-3.5 h-3.5 text-[#c8f560]" />
                      <span>{selectedAudioFile ? "Ganti File Audio" : "Select Audio File (.wav, .mp3, .flac)"}</span>
                      <input
                        type="file"
                        accept="audio/*,.wav,.mp3,.flac,.m4a,.aac,.ogg"
                        className="hidden"
                        onChange={handleAudioUpload}
                      />
                    </label>
                  </div>

                  {/* Uploaded File Status Bar with S3 / Cloudflare R2 Player */}
                  <div className="px-4 py-3 rounded-xl bg-white/15 border border-white/20 flex flex-col gap-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium text-white min-w-0 pr-2">
                        <Volume2 className="w-4 h-4 text-[#c8f560] shrink-0" />
                        <span className="truncate">
                          {audioFileName} {audioFileSize ? `• ${audioFileSize}` : ""}
                        </span>
                      </div>
                      {selectedAudioFile ? (
                        <span className="text-[#c8f560] font-medium flex items-center gap-1 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                          File siap (upload saat Review & Submit)
                        </span>
                      ) : audioFileUrl ? (
                        <span className="text-[#c8f560] font-medium flex items-center gap-1 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                          Tersimpan di Cloudflare R2
                        </span>
                      ) : (
                        <span className="text-white/60 font-medium shrink-0">
                          Pilih file audio
                        </span>
                      )}
                    </div>

                    {/* Live Audio Preview Player */}
                    {(localAudioPreviewUrl || audioFileUrl) && (
                      <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
                        <span className="text-[11px] text-[#c8f560] font-medium flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          <span>Preview Master Audio:</span>
                        </span>
                        <audio
                          controls
                          src={localAudioPreviewUrl || audioFileUrl}
                          className="w-full h-8 rounded-lg bg-black/30 border border-white/10"
                        />
                      </div>
                    )}
                  </div>

                  {/* Track Details Form */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">
                      Track Details & Credits
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                      <div>
                        <label className="block text-white/75 mb-1">Title (Judul Lagu)</label>
                        <input
                          type="text"
                          value={trackTitle}
                          onChange={(e) => setTrackTitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white focus:outline-none focus:border-[#c8f560]"
                        />
                      </div>

                      <div>
                        <label className="block text-white/75 mb-1">
                          Primary Artist (Artis Utama)
                        </label>
                        <input
                          type="text"
                          value={trackArtist}
                          onChange={(e) => setTrackArtist(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white focus:outline-none focus:border-[#c8f560]"
                        />
                      </div>

                      {/* Kolom Featuring */}
                      <div>
                        <label className="block text-white/75 mb-1">
                          Featuring Artist (Feat. / Opsional)
                        </label>
                        <input
                          type="text"
                          value={trackFeaturing}
                          onChange={(e) => setTrackFeaturing(e.target.value)}
                          placeholder="Contoh: Luna Eclipse"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white placeholder:text-white/40 focus:outline-none focus:border-[#c8f560]"
                        />
                      </div>

                      {/* Kolom Genre */}
                      <div>
                        <label className="block text-white/75 mb-1">Genre</label>
                        <select
                          value={trackGenre}
                          onChange={(e) => setTrackGenre(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white focus:outline-none focus:border-[#c8f560]"
                        >
                          <option value="Electronic • Downtempo" className="bg-[#312042]">
                            Electronic • Downtempo
                          </option>
                          <option value="Pop • Electronic" className="bg-[#312042]">
                            Pop • Electronic
                          </option>
                          <option value="Synthwave • Dance" className="bg-[#312042]">
                            Synthwave • Dance
                          </option>
                          <option value="Chill • R&B" className="bg-[#312042]">
                            Chill • R&B
                          </option>
                          <option value="Hip-Hop • Trap" className="bg-[#312042]">
                            Hip-Hop • Trap
                          </option>
                        </select>
                      </div>

                      {/* Kolom Composer */}
                      <div>
                        <label className="block text-white/75 mb-1">
                          Composer (Pencipta Lagu)
                        </label>
                        <input
                          type="text"
                          value={trackComposer}
                          onChange={(e) => setTrackComposer(e.target.value)}
                          placeholder="Nama Lengkap Composer"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white placeholder:text-white/40 focus:outline-none focus:border-[#c8f560]"
                        />
                      </div>

                      {/* Kolom Producer */}
                      <div>
                        <label className="block text-white/75 mb-1">
                          Producer (Produser Musik)
                        </label>
                        <input
                          type="text"
                          value={trackProducer}
                          onChange={(e) => setTrackProducer(e.target.value)}
                          placeholder="Nama Produser / Studio"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white placeholder:text-white/40 focus:outline-none focus:border-[#c8f560]"
                        />
                      </div>

                      {/* Kolom Clip Potongan TikTok (Interaktif Tanpa Ngetik) */}
                      <div className="sm:col-span-2 p-3.5 rounded-2xl bg-white/10 border border-white/20 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-white font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#c8f560] animate-pulse" />
                            <span>Clip Potongan TikTok & Reels (Viral Hook)</span>
                          </label>
                          <span className="px-3 py-0.5 rounded-full bg-[#312042] text-[#c8f560] font-mono font-bold text-[11px]">
                            {formattedTiktokClip}
                          </span>
                        </div>

                        {/* Slider Geser Detik Mulai + Pilihan Durasi 15s / 30s / 60s */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <div className="flex-1 w-full">
                            <input
                              type="range"
                              min={0}
                              max={160}
                              step={5}
                              value={tiktokStartSec}
                              onChange={(e) => setTiktokStartSec(Number(e.target.value))}
                              className="w-full accent-[#c8f560] cursor-pointer h-1.5 rounded-lg"
                            />
                            <div className="flex justify-between text-[10px] text-white/60 mt-0.5">
                              <span>00:00 (Intro)</span>
                              <span>00:45 (Chorus 1)</span>
                              <span>01:30 (Drop)</span>
                              <span>02:40 (Outro)</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-white/15 p-1 rounded-xl shrink-0">
                            {[15, 30, 60].map((dur) => (
                              <button
                                key={dur}
                                type="button"
                                onClick={() => setTiktokDurationSec(dur)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                                  tiktokDurationSec === dur
                                    ? "bg-[#312042] text-[#c8f560]"
                                    : "text-white/80 hover:text-white"
                                }`}
                              >
                                {dur}s
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Tombol Preset Potongan Cepat */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] text-white/65 mr-1">Pilih Cepat:</span>
                          {[
                            { label: "00:15 (Intro)", start: 15 },
                            { label: "00:45 (Reff/Chorus)", start: 45 },
                            { label: "01:15 (Beat Drop)", start: 75 },
                            { label: "01:50 (Climax)", start: 110 },
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setTiktokStartSec(preset.start)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                                tiktokStartSec === preset.start
                                  ? "bg-[#c8f560] text-[#312042] font-semibold"
                                  : "bg-white/15 text-white/85 hover:bg-white/25"
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Kolom Release Date Otomatis Tanpa Ngetik */}
                      <div className="sm:col-span-2 p-3.5 rounded-2xl bg-white/10 border border-white/20 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-white font-semibold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#c8f560]" />
                            <span>Release Date (Pilih Otomatis / Kalender)</span>
                          </label>
                          <span className="px-3 py-0.5 rounded-full bg-[#312042] text-[#c8f560] font-semibold text-[11px]">
                            Terjadwal: {formattedReleaseDate}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                          {/* Tombol Kalender Otomatis (Klik langsung buka datepicker tanpa ngetik) */}
                          <div className="sm:col-span-5">
                            <input
                              type="date"
                              value={trackDateIso}
                              onClick={(e) => {
                                try {
                                  (e.currentTarget as any).showPicker?.();
                                } catch {}
                              }}
                              onChange={(e) => setTrackDateIso(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-[#312042] border border-[#c8f560]/50 font-semibold text-white cursor-pointer focus:outline-none"
                            />
                          </div>

                          {/* Tombol Pilih Tanggal Otomatis 1-Klik */}
                          <div className="sm:col-span-7 flex flex-wrap items-center gap-1.5">
                            {[
                              { label: "Hari Ini", days: 0 },
                              { label: "+3 Hari", days: 3 },
                              { label: "+7 Hari (Rilis Global)", days: 7 },
                              { label: "+14 Hari", days: 14 },
                            ].map((dBtn) => (
                              <button
                                key={dBtn.label}
                                type="button"
                                onClick={() => applyQuickDate(dBtn.days)}
                                className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-[#c8f560] hover:text-[#312042] text-white text-[10px] font-medium transition-all"
                              >
                                {dBtn.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Kolom Barcode Digital UPC & ISRC Code */}
                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/20">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-white/80 font-semibold flex items-center gap-1.5 text-xs">
                              <span className="w-2 h-2 rounded-full bg-[#c8f560]" />
                              <span>UPC (Universal Product Code)</span>
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setTrackUpc(
                                  `899${Math.floor(100000000 + Math.random() * 900000000)}`
                                )
                              }
                              className="text-[10px] text-[#c8f560] hover:underline"
                            >
                              🎲 Auto UPC
                            </button>
                          </div>
                          <input
                            type="text"
                            value={trackUpc}
                            onChange={(e) => setTrackUpc(e.target.value)}
                            placeholder="Contoh: 899214578109 (12 Digit)"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-mono font-bold text-white text-xs focus:outline-none focus:border-[#c8f560]"
                          />
                          <span className="text-[10px] text-white/55 mt-0.5 block">
                            Barcode digital album / single
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-white/80 font-semibold flex items-center gap-1.5 text-xs">
                              <span className="w-2 h-2 rounded-full bg-[#c8f560]" />
                              <span>ISRC Code</span>
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setTrackIsrc(
                                  `ID-HRM-24-${Math.floor(10000 + Math.random() * 90000)}`
                                )
                              }
                              className="text-[10px] text-[#c8f560] hover:underline"
                            >
                              🎲 Auto ISRC
                            </button>
                          </div>
                          <input
                            type="text"
                            value={trackIsrc}
                            onChange={(e) => setTrackIsrc(e.target.value)}
                            placeholder="Contoh: ID-HRM-24-00109"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-mono font-bold text-[#c8f560] text-xs focus:outline-none focus:border-[#c8f560]"
                          />
                          <span className="text-[10px] text-white/55 mt-0.5 block">
                            Kode identifikasi master rekaman audio
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Cover Art Upload + Platform Selection */}
                <div
                  className="lg:col-span-5 flex flex-col gap-5 animate-card-enter"
                  style={{ animationDelay: "190ms" }}
                >
                  <div className={`${ROYALTY_CARD} text-center`}>
                    <div className="flex items-center gap-2 font-semibold text-sm text-left text-white mb-4">
                      <FolderOpen className="w-4 h-4 text-[#c8f560]" />
                      <span>Cover Art Upload</span>
                    </div>

                    <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden shadow-md mb-3 border border-white/30 flex items-center justify-center">
                      <img
                        src={uploadCoverUrl}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="text-xs font-medium text-white/90">
                      {selectedCoverFile
                        ? `✓ File: ${selectedCoverFile.name} (siap diunggah saat Review)`
                        : "3000 × 3000 px • JPG / PNG / WEBP"}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab("generator")}
                        className="px-3.5 py-1.5 rounded-full bg-[#c8f560] text-[#312042] text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Cover (AI)</span>
                      </button>

                      <label className="px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-xs font-medium text-white hover:bg-white/25 cursor-pointer flex items-center gap-1.5 transition-colors">
                        <FolderOpen className="w-3.5 h-3.5 text-[#c8f560]" />
                        <span>{selectedCoverFile ? "Ganti Cover" : "+ Upload Manual"}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handleCoverUpload}
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-white/65 mt-2">
                      Recommended: 3000×3000px, JPG/PNG, under 20MB
                    </p>
                  </div>

                  {/* Platform Selection */}
                  <div className={`${ROYALTY_CARD} flex-1`}>
                    <div className="flex items-center gap-2 font-semibold text-sm text-white mb-1">
                      <Globe className="w-4 h-4 text-[#c8f560]" />
                      <span>Platform Selection</span>
                    </div>
                    <p className="text-xs text-white/75 mb-4">
                      Select platforms to distribute your release
                    </p>

                    <div className="space-y-3 text-xs">
                      {[
                        {
                          name: "Spotify",
                          sub: "Music & Podcasts",
                          color: "bg-[#22c55e]",
                        },
                        {
                          name: "Apple Music",
                          sub: "Music & Apple Store",
                          color: "bg-[#ec4899]",
                        },
                        {
                          name: "TikTok",
                          sub: "Sounds & Clips",
                          color: "bg-[#111827]",
                        },
                        {
                          name: "YouTube",
                          sub: "YouTube Music",
                          color: "bg-[#ef4444]",
                        },
                      ].map((plat) => {
                        const checked = selectedPlatforms.includes(plat.name);
                        return (
                          <div
                            key={plat.name}
                            onClick={() => handleTogglePlatform(plat.name)}
                            className="flex items-center gap-3 cursor-pointer select-none"
                          >
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                checked
                                  ? "border-[#c8f560] bg-[#312042] text-[#c8f560]"
                                  : "border-white/35 bg-white/10"
                              }`}
                            >
                              {checked && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div
                              className={`w-7 h-7 rounded-full ${plat.color} text-white flex items-center justify-center font-bold text-[11px]`}
                            >
                              {plat.name[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{plat.name}</p>
                              <p className="text-[11px] text-white/70">{plat.sub}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
                <button
                  type="button"
                  disabled={submittingTrack}
                  onClick={() => handleCreateRelease("Draft")}
                  className="sm:col-span-4 py-3.5 rounded-full bg-[#8a88b5]/70 hover:bg-[#8a88b5]/90 border border-white/25 text-white font-semibold text-xs transition-all"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={submittingTrack}
                  onClick={handleOpenReviewModal}
                  className="sm:col-span-8 py-3.5 rounded-full bg-[#312042] hover:bg-[#422c58] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>Review & Submit</span>
                  <ArrowRight className="w-4 h-4 text-[#c8f560]" />
                </button>
              </div>

              {/* REVIEW & SUBMIT MODAL */}
              {showReviewModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-[#1a1429] border border-white/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative my-8 animate-card-enter">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-[#c8f560] text-[#312042]">
                          <Shield className="w-5 h-5" />
                        </span>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold">
                            {reviewSuccess ? "Rilisan Berhasil Terkirim" : "Review & Submit Rilisan"}
                          </h3>
                          <p className="text-xs text-white/65">
                            {reviewSuccess
                              ? "Langkah terakhir selesai"
                              : "Periksa kembali detail lagu sebelum dikirim ke peninjauan"}
                          </p>
                        </div>
                      </div>
                      {!reviewSubmitting && (
                        <button
                          type="button"
                          onClick={() => setShowReviewModal(false)}
                          className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Content: SUCCESS STATE */}
                    {reviewSuccess ? (
                      <div className="text-center py-6 space-y-5">
                        <div className="w-20 h-20 rounded-full bg-[#c8f560]/20 text-[#c8f560] border-2 border-[#c8f560]/50 mx-auto flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-12 h-12 text-[#c8f560]" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-white">
                            Selamat! Rilisan Anda Telah Terkirim
                          </h4>
                          <p className="text-sm text-white/80 mt-2 max-w-md mx-auto leading-relaxed">
                            Rilisan Anda telah berhasil dikirim dan akan ditinjau dalam{" "}
                            <span className="text-[#c8f560] font-semibold">10 - 15 hari</span>.
                          </p>
                        </div>

                        {/* Release Info Card */}
                        <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-left max-w-md mx-auto space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white/60">Judul Lagu:</span>
                            <span className="text-white font-semibold truncate max-w-[200px]">{trackTitle}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/60">Artis:</span>
                            <span className="text-white font-semibold">{trackFeaturedArtistLabel()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/60">Status Rilisan:</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/30">
                              Pending Review (10-15 Hari)
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/60">Target Platform:</span>
                            <span className="text-white/90 font-medium">{selectedPlatforms.join(", ")}</span>
                          </div>
                        </div>

                        {/* Action Buttons: Lihat Rilisan & Klik Dashboard */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setShowReviewModal(false);
                              setActiveTab("releases");
                            }}
                            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#c8f560] hover:bg-[#b5e050] text-[#312042] font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all"
                          >
                            <ListMusic className="w-4 h-4" />
                            <span>Lihat Rilisan</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowReviewModal(false);
                              setActiveTab("overview");
                            }}
                            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                          >
                            <Home className="w-4 h-4 text-[#c8f560]" />
                            <span>Klik Dashboard</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Content: REVIEW & SUBMISSION FORM */
                      <div className="py-5 space-y-5">
                        {/* Summary Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                          {/* Cover Thumbnail */}
                          <div className="sm:col-span-4 flex flex-col items-center justify-center">
                            <div className="w-28 h-28 rounded-xl overflow-hidden shadow-lg border border-white/20">
                              <img src={uploadCoverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[11px] text-white/60 mt-1.5 truncate max-w-[120px]">
                              {selectedCoverFile ? selectedCoverFile.name : "Cover Artwork"}
                            </span>
                          </div>

                          {/* Track Metadata */}
                          <div className="sm:col-span-8 space-y-2 flex flex-col justify-center">
                            <div>
                              <span className="text-[11px] text-[#c8f560] font-bold uppercase tracking-wider">
                                {trackGenre || "Pop"}
                              </span>
                              <h4 className="text-base sm:text-lg font-bold text-white truncate">
                                {trackTitle}
                              </h4>
                              <p className="text-white/80 font-medium">
                                {trackFeaturedArtistLabel()}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[11px]">
                              <div>
                                <span className="text-white/50 block">Rencana Rilis:</span>
                                <span className="text-white/90 font-medium">{formattedReleaseDate}</span>
                              </div>
                              <div>
                                <span className="text-white/50 block">TikTok Clip:</span>
                                <span className="text-white/90 font-medium">{formattedTiktokClip}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Audio Details & Player */}
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white font-medium truncate">
                              <Music className="w-4 h-4 text-[#c8f560] shrink-0" />
                              <span className="truncate">{audioFileName}</span>
                              {audioFileSize && <span className="text-white/60">• {audioFileSize}</span>}
                            </div>
                            <span className="text-[11px] text-[#c8f560] shrink-0 font-medium">
                              {selectedAudioFile ? "Siap Diunggah" : "Tersimpan"}
                            </span>
                          </div>
                          {(localAudioPreviewUrl || audioFileUrl) && (
                            <audio
                              controls
                              src={localAudioPreviewUrl || audioFileUrl}
                              className="w-full h-8 rounded-lg outline-none"
                            />
                          )}
                        </div>

                        {/* Selected Platforms */}
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs flex flex-wrap items-center gap-2">
                          <span className="text-white/60 mr-1 flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-[#c8f560]" />
                            <span>Distribusi:</span>
                          </span>
                          {selectedPlatforms.map((plat) => (
                            <span
                              key={plat}
                              className="px-2.5 py-1 rounded-full bg-white/10 text-white font-medium border border-white/15"
                            >
                              {plat}
                            </span>
                          ))}
                        </div>

                        {/* Real-time Progress Bar & Status */}
                        {reviewSubmitting && (
                          <div className="p-4 rounded-2xl bg-[#312042]/90 border border-[#c8f560]/40 text-xs space-y-2">
                            <div className="flex items-center gap-2 text-[#c8f560] font-semibold">
                              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                              <span>{reviewStatusStep || "Sedang memproses upload dan validasi..."}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-[#c8f560] h-full w-full animate-pulse" />
                            </div>
                            <p className="text-[11px] text-white/65">
                              Jangan tutup browser saat proses pengunggahan master audio sedang berjalan.
                            </p>
                          </div>
                        )}

                        {/* Error Alert Box */}
                        {reviewError && (
                          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-xs space-y-2 text-red-200">
                            <div className="flex items-center gap-2 font-bold text-red-400">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span>Proses Upload Mengalami Kendala</span>
                            </div>
                            <p className="text-[11px] text-red-300 leading-relaxed font-mono">
                              {reviewError}
                            </p>
                            <p className="text-[11px] text-white/70">
                              Tips: Pastikan file audio berformat WAV / MP3 / FLAC dan koneksi internet stabil. Anda dapat langsung mengklik tombol "Coba Lagi".
                            </p>
                          </div>
                        )}

                        {/* Modal Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-white/10">
                          <button
                            type="button"
                            disabled={reviewSubmitting}
                            onClick={() => setShowReviewModal(false)}
                            className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all disabled:opacity-50"
                          >
                            Batal / Periksa Kembali
                          </button>
                          <button
                            type="button"
                            disabled={reviewSubmitting}
                            onClick={executeUploadAndSubmitRelease}
                            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#c8f560] hover:bg-[#b5e050] text-[#312042] text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-60"
                          >
                            {reviewSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Mengunggah...</span>
                              </>
                            ) : reviewError ? (
                              <>
                                <RefreshCw className="w-4 h-4" />
                                <span>Coba Lagi Upload & Submit</span>
                              </>
                            ) : (
                              <>
                                <span>Kirim Rilisan Sekarang</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              VIEW 4: MY RELEASES — ALL CARDS MATCH ROYALTY GROWTH
             ========================================================= */}
          {activeTab === "releases" && (
            <div key={`releases-${animKey}`} className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 animate-card-enter">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                    Welcome Back, {user?.name || "Abdul"}!
                  </h1>
                  <p className="text-xs text-white/80 mt-1">
                    information designed to accurate insights
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-xs text-white/80">Total streams</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-white mt-0.5 tabular-nums">
                      {animatedStreamsToday > 0 ? `${animatedStreamsToday.toLocaleString()}K` : "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/80">Royalty pending</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-white mt-0.5 tabular-nums">
                      ${animatedRoyaltyPending.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="px-5 py-3 rounded-full bg-[#312042] hover:bg-[#422c58] text-white text-xs font-medium flex items-center gap-2 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Release</span>
                  </button>
                </div>
              </div>

              {/* 3 Big Stat Cards — Styled as Luxury VISA Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <VisaMetricCard
                  title="Total Releases"
                  value={Math.round(totalReleasesCount * animProgress)}
                  subtitle="All releases"
                  dotColor="bg-[#c4c3f0]"
                  valueColor="text-white"
                  cardNumber="4532 •••• •••• 1024"
                  holderName={`${user?.name || "ARTIST"} • CATALOG`}
                  expiry="08/29"
                  tier="PLATINUM"
                  variant="lavender"
                  delayMs={60}
                />

                <VisaMetricCard
                  title="Approved"
                  value={Math.round(approvedCount * animProgress)}
                  subtitle="Published to platforms"
                  dotColor="bg-[#c8f560]"
                  valueColor="text-[#c8f560]"
                  cardNumber="4532 •••• •••• 7718"
                  holderName={`${user?.name || "ARTIST"} • VERIFIED`}
                  expiry="12/29"
                  tier="SIGNATURE"
                  variant="lime-tint"
                  delayMs={130}
                />

                <VisaMetricCard
                  title="Pending"
                  value={Math.round(pendingCount * animProgress)}
                  subtitle="Awaiting review"
                  dotColor="bg-[#fbbf24]"
                  valueColor="text-[#fde08d]"
                  cardNumber="4532 •••• •••• 3304"
                  holderName={`${user?.name || "ARTIST"} • QUEUE`}
                  expiry="05/28"
                  tier="INFINITE"
                  variant="plum"
                  delayMs={200}
                />
              </div>

              {/* Bottom Row: My Releases Table + Release Calendar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div
                  className={`lg:col-span-8 ${ROYALTY_CARD} flex flex-col animate-card-enter`}
                  style={{ animationDelay: "260ms" }}
                >
                  <div className="pb-3 flex items-center justify-between border-b border-white/15">
                    <h3 className="text-sm font-medium text-white">My Releases</h3>
                    <span className="text-xs text-[#c8f560] underline cursor-pointer">
                      Total: {releases.length} Track
                    </span>
                  </div>

                  <div className="pt-3 flex-1 overflow-x-auto">
                    <div className="min-w-[580px]">
                      <div className="grid grid-cols-12 text-xs text-white/65 pb-3 border-b border-white/15 px-2">
                        <div className="col-span-4 font-semibold">Title</div>
                        <div className="col-span-2 text-center font-semibold">Release Date</div>
                        <div className="col-span-2 text-center font-semibold">UPC Barcode</div>
                        <div className="col-span-2 text-center font-semibold">ISRC Code</div>
                        <div className="col-span-2 text-right font-semibold">Status</div>
                      </div>

                      {releases.length === 0 ? (
                        <div className="py-12 text-center text-white/70">
                          <FolderOpen className="w-12 h-12 mx-auto text-white/25 mb-2" />
                          <p className="font-semibold text-base text-white">Belum Ada Rilisan Lagu</p>
                          <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto">
                            Anda belum memiliki lagu yang dirilis. Klik tombol Submit Track untuk mengajukan lagu baru ke DSP.
                          </p>
                          <button
                            onClick={() => setActiveTab("upload")}
                            className="mt-4 px-5 py-2 rounded-full bg-[#312042] text-xs text-[#c8f560] font-semibold hover:scale-105 transition-all shadow-md"
                          >
                            + Submit Lagu Baru
                          </button>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/15">
                          {releases.map((item) => (
                            <div
                              key={item.id}
                              className="grid grid-cols-12 items-center py-3.5 text-xs hover:bg-white/5 rounded-xl px-2 transition-colors"
                            >
                              <div className="col-span-4 flex items-center gap-3 min-w-0 pr-2">
                                <img
                                  src={item.coverUrl}
                                  alt={item.title}
                                  className="w-11 h-11 rounded-xl object-cover border border-white/25 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-white truncate">{item.title}</p>
                                  <p className="text-[11px] text-white/70 truncate">{item.genre}</p>
                                </div>
                              </div>
                              <div className="col-span-2 text-center font-medium text-white/90 whitespace-nowrap">
                                {item.releaseDate}
                              </div>
                              <div className="col-span-2 text-center font-mono font-semibold text-white/95 text-[11px] whitespace-nowrap">
                                {item.upc || "899214578101"}
                              </div>
                              <div className="col-span-2 text-center font-mono font-bold text-[#c8f560] text-[11px] whitespace-nowrap">
                                {item.isrc || "ID-HRM-24-00101"}
                              </div>
                              <div className="col-span-2 flex justify-end">
                                {item.status === "Approved" ? (
                                  <span className="px-3 py-1 rounded-full bg-[#c8f560] text-[#312042] font-semibold flex items-center gap-1 text-[11px] whitespace-nowrap">
                                    <Check className="w-3 h-3" /> Approved
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full bg-[#fde08d] text-[#312042] font-semibold flex items-center gap-1 text-[11px] whitespace-nowrap">
                                    <Clock className="w-3 h-3" /> {item.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Release Calendar — Translucent Lavender */}
                <div
                  className={`lg:col-span-4 ${ROYALTY_CARD} flex flex-col justify-between animate-card-enter`}
                  style={{ animationDelay: "320ms" }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-white">Release Calendar</h3>
                      <span className="text-xs text-white/75">Schedule ▾</span>
                    </div>
                    <p className="text-xs font-semibold text-white/85 mb-3">Quick Stats</p>

                    {releases.length === 0 ? (
                      <div className="py-8 text-center text-white/70">
                        <Calendar className="w-8 h-8 mx-auto text-white/25 mb-2" />
                        <p className="font-medium text-xs text-white">Tidak ada jadwal rilis aktif</p>
                        <p className="text-[11px] text-white/55 mt-1">Ajukan rilisan untuk melihat kalender distribusi.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 text-xs">
                        {releases.slice(0, 3).map((item, idx) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-8 shrink-0">
                              <p className="font-bold text-white text-xs">{item.releaseDate.split("-")[0] || "01"}</p>
                              <p className="text-[10px] text-white/70">DSP</p>
                            </div>
                            <div className={`flex-1 px-3.5 py-2 rounded-full ${idx === 0 ? "bg-[#c8f560] text-[#312042]" : "bg-[#312042] text-white"} font-semibold text-[11px] truncate`}>
                              {item.title} • {item.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 p-3.5 rounded-2xl bg-white/15 border border-white/15 text-xs">
                    <p className="font-semibold text-white">Status Distribusi</p>
                    <p className="text-white/75 text-[11px] mt-0.5">
                      {releases.length > 0 ? `${releases.length} rilis terdata dalam sistem` : "Belum ada rilisan aktif"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 5: ROYALTY & WITHDRAWALS — ALL CARDS MATCH ROYALTY GROWTH
             ========================================================= */}
          {activeTab === "wallet" && (
            <div key={`wallet-${animKey}`} className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 animate-card-enter">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                    Welcome Back, {user?.name || "Abdul"}!
                  </h1>
                  <p className="text-xs text-white/80 mt-1">
                    information designed to accurate insights
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-xs text-white/80">Total Royalti</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-white mt-0.5 tabular-nums">
                      ${animatedRoyaltyBalance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/80">Royalti Pending</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-white mt-0.5 tabular-nums">
                      ${animatedRoyaltyPending.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="px-5 py-3 rounded-full bg-[#312042] hover:bg-[#422c58] text-white text-xs font-medium flex items-center gap-2 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Release</span>
                  </button>
                </div>
              </div>

              {/* 3 Big Balance Cards — Styled as Luxury VISA Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <VisaMetricCard
                  title="Royalty Balance"
                  value={`$${Math.round((user?.royaltyBalance || 0) * animProgress).toLocaleString()}`}
                  subtitle="Available for withdrawal"
                  dotColor="bg-[#c8f560]"
                  valueColor="text-[#c8f560]"
                  cardNumber="4532 •••• •••• 8891"
                  holderName={`${user?.name || "ARTIST"} • HERMES PAY`}
                  expiry="09/29"
                  tier="INFINITE"
                  variant="lime-tint"
                  delayMs={60}
                />

                <VisaMetricCard
                  title="Total Withdrawn"
                  value={`$${Math.round((user?.totalWithdrawn || 0) * animProgress).toLocaleString()}`}
                  subtitle="Completed payouts"
                  dotColor="bg-[#c4c3f0]"
                  valueColor="text-white"
                  cardNumber="4532 •••• •••• 5204"
                  holderName={`${user?.name || "ARTIST"} • SETTLED`}
                  expiry="11/28"
                  tier="SIGNATURE"
                  variant="lavender"
                  delayMs={130}
                />

                <VisaMetricCard
                  title="Pending Withdrawal"
                  value={`$${Math.round((user?.pendingWithdraw || 0) * animProgress).toLocaleString()}`}
                  subtitle="Processing"
                  dotColor="bg-[#f59e0b]"
                  valueColor="text-[#fde08d]"
                  cardNumber="4532 •••• •••• 0309"
                  holderName={`${user?.name || "ARTIST"} • ESCROW`}
                  expiry="04/29"
                  tier="PLATINUM"
                  variant="plum"
                  delayMs={200}
                />
              </div>

              {/* Bottom Row: Withdrawal History + Withdraw Form */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div
                  className={`lg:col-span-7 ${ROYALTY_CARD} flex flex-col animate-card-enter`}
                  style={{ animationDelay: "260ms" }}
                >
                  <div className="pb-3 flex items-center justify-between border-b border-white/15">
                    <h3 className="text-sm font-medium text-white">Withdrawal History</h3>
                    <span className="text-xs text-[#c8f560] underline cursor-pointer">
                      Total: {withdrawals.length} Transaksi
                    </span>
                  </div>

                  <div className="pt-3 flex-1">
                    <div className="grid grid-cols-12 text-xs text-white/65 pb-3 border-b border-white/15">
                      <div className="col-span-3">Date</div>
                      <div className="col-span-3 text-center">Amount</div>
                      <div className="col-span-3 text-center">Method</div>
                      <div className="col-span-3 text-right">Status</div>
                    </div>

                    {withdrawals.length === 0 ? (
                      <div className="py-10 text-center text-white/70">
                        <Building2 className="w-10 h-10 mx-auto text-white/25 mb-2" />
                        <p className="font-semibold text-sm text-white">Belum Ada Riwayat Penarikan</p>
                        <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto">
                          Anda belum mengajukan pencairan saldo royalti. Ajukan penarikan melalui formulir di samping.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/15">
                        {withdrawals.map((w) => (
                          <div
                            key={w.id}
                            className="grid grid-cols-12 items-center py-4 text-xs"
                          >
                            <div className="col-span-3 font-medium text-white/90">{w.date}</div>
                            <div className="col-span-3 text-center font-bold text-[#c8f560]">
                              ${w.amount.toLocaleString()}
                            </div>
                            <div className="col-span-3 flex items-center justify-center gap-1.5 font-medium text-white">
                              {w.method.includes("E-Wallet") ? (
                                <Smartphone className="w-3.5 h-3.5 text-[#c8f560]" />
                              ) : (
                                <Building2 className="w-3.5 h-3.5 text-[#c8f560]" />
                              )}
                              <span>{w.method}</span>
                            </div>
                            <div className="col-span-3 flex justify-end">
                              {w.status === "Approved" ? (
                                <span className="px-3.5 py-1 rounded-full bg-[#c8f560] text-[#312042] font-semibold flex items-center gap-1 text-[11px]">
                                  <Check className="w-3 h-3" /> Approved
                                </span>
                              ) : (
                                <span className="px-3.5 py-1 rounded-full bg-[#fde08d] text-[#312042] font-semibold flex items-center gap-1 text-[11px]">
                                  <Clock className="w-3 h-3" /> {w.status}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Withdraw Form Card — Translucent Lavender */}
                <div
                  className={`lg:col-span-5 ${ROYALTY_CARD} animate-card-enter`}
                  style={{ animationDelay: "320ms" }}
                >
                  <h3 className="text-sm font-medium text-white mb-4">Withdraw Form</h3>

                  <form onSubmit={handleWithdrawSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-white/75 mb-1">Withdrawal Method</label>
                      <select
                        value={withdrawMethod}
                        onChange={(e) => setWithdrawMethod(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white focus:outline-none focus:border-[#c8f560]"
                      >
                        <option value="Bank • BCA" className="bg-[#312042]">Bank • BCA</option>
                        <option value="Bank • Mandiri" className="bg-[#312042]">Bank • Mandiri</option>
                        <option value="Bank • BNI" className="bg-[#312042]">Bank • BNI</option>
                        <option value="Bank • BRI" className="bg-[#312042]">Bank • BRI</option>
                        <option value="Bank • Seabank" className="bg-[#312042]">Bank • Seabank</option>
                        <option value="E-Wallet • OVO" className="bg-[#312042]">E-Wallet • OVO</option>
                        <option value="E-Wallet • GoPay" className="bg-[#312042]">E-Wallet • GoPay</option>
                        <option value="E-Wallet • DANA" className="bg-[#312042]">E-Wallet • DANA</option>
                        <option value="E-Wallet • ShopeePay" className="bg-[#312042]">E-Wallet • ShopeePay</option>
                      </select>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {[
                          { label: "Mandiri", val: "Bank • Mandiri", bg: "bg-white/20 text-white" },
                          { label: "BNI", val: "Bank • BNI", bg: "bg-white/20 text-white" },
                          { label: "BRI", val: "Bank • BRI", bg: "bg-white/20 text-white" },
                          { label: "Seabank", val: "Bank • Seabank", bg: "bg-white/20 text-white" },
                          { label: "OVO", val: "E-Wallet • OVO", bg: "bg-[#c8f560] text-[#312042]" },
                          { label: "GoPay", val: "E-Wallet • GoPay", bg: "bg-[#c8f560] text-[#312042]" },
                          { label: "DANA", val: "E-Wallet • DANA", bg: "bg-white/15 text-white" },
                          { label: "ShopeePay", val: "E-Wallet • ShopeePay", bg: "bg-white/15 text-white" },
                        ].map((m) => (
                          <button
                            key={m.label}
                            type="button"
                            onClick={() => setWithdrawMethod(m.val)}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${m.bg} hover:opacity-85`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/75 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white focus:outline-none focus:border-[#c8f560]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/75 mb-1">Amount</label>
                      <div className="px-3.5 py-2 rounded-xl bg-white/15 border border-white/25">
                        <div className="flex items-center font-semibold text-white">
                          <span className="text-[#c8f560] mr-1">$</span>
                          <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="w-full bg-transparent text-white focus:outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-white/65">
                          ${(user?.royaltyBalance ?? 12450).toLocaleString()} available
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingWithdraw}
                      className="w-full py-3 rounded-xl bg-[#312042] hover:bg-[#422c58] text-white font-semibold text-xs transition-all"
                    >
                      {submittingWithdraw ? "Processing..." : "+ Withdraw"}
                    </button>

                    <p className="text-center text-[10px] text-white/65">
                      Funds arrive within 1–3 business days
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW: INBOX (PESAN MASUK DARI ADMIN)
             ========================================================= */}
          {activeTab === "inbox" && (
            <div key={`inbox-${animKey}`} className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 animate-card-enter">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                    Pesan Masuk (Inbox)
                  </h1>
                  <p className="text-xs text-white/80 mt-1">
                    Pemberitahuan resmi dan pesan dari Label Admin HERMES
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-medium text-[#c8f560]">
                    {messages.length} Pesan Diterima
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className={`${ROYALTY_CARD} text-center py-16 animate-card-enter`}>
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 text-white/60">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Belum Ada Pesan Masuk</h3>
                    <p className="text-xs text-white/70 mt-1">
                      Pesan atau pengumuman dari label admin akan tampil di sini
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={msg.id}
                      className={`${ROYALTY_CARD} animate-card-enter flex flex-col gap-2.5 transition-all hover:bg-[#8a88b5]/85`}
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#312042] text-[#c8f560] flex items-center justify-center font-bold text-xs">
                            H
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-[#c8f560]">
                              {msg.sender || "Admin HERMES"}
                            </span>
                            <span className="text-[10px] text-white/60 ml-2">
                              {new Date(msg.createdAt).toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-medium text-white/90">
                          {msg.userId ? "Pesan Khusus" : "Broadcast Semua Artis"}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-white mt-1">{msg.title}</h3>
                      <p className="text-xs text-white/85 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW: OFFICIAL MUSIC CATALOG & MASTER LINKS
             ========================================================= */}
          {activeTab === "catalog" && (
            <div className="space-y-6 animate-card-enter">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-[#c8f560] text-[#312042] shadow-md">
                      <ListMusic className="w-5 h-5" />
                    </span>
                    <span>Official Music Catalog & Publishing</span>
                  </h2>
                  <p className="text-xs text-white/75 mt-1">
                    Daftar resmi SONG ID, Judul Lagu, Vokal/Artis, Publisher Hak Cipta, Status Aktif, dan Tautan Master YouTube / Google Drive
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white">
                    Total: <strong className="text-[#c8f560]">{catalogs.length} Lagu Terdaftar</strong>
                  </span>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Cari berdasarkan Song ID, Judul Lagu, Vokal / Artis, atau Publisher..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/15 border border-white/25 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#c8f560]"
                  />
                </div>
                {catalogSearch && (
                  <button
                    type="button"
                    onClick={() => setCatalogSearch("")}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {/* Catalog Table */}
              <div className={`${ROYALTY_CARD} overflow-hidden p-0 border border-white/20`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-white">
                    <thead className="bg-[#312042]/60 border-b border-white/15 text-[11px] uppercase tracking-wider text-white/75">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">SONG ID</th>
                        <th className="py-3.5 px-4 font-semibold">JUDUL LAGU</th>
                        <th className="py-3.5 px-4 font-semibold">VOKAL / ARTIS</th>
                        <th className="py-3.5 px-4 font-semibold">PUBLISHER</th>
                        <th className="py-3.5 px-4 font-semibold">STATUS / AKTIF</th>
                        <th className="py-3.5 px-4 font-semibold text-center">LINK (YT & DRIVE)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {catalogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-14 text-center text-white/60 text-xs">
                            <ListMusic className="w-10 h-10 mx-auto text-white/20 mb-2" />
                            <p className="font-semibold text-sm text-white/80">Katalog Musik Masih Kosong</p>
                            <p className="text-white/50 text-[11px] mt-1">Lagu resmi yang diupload oleh label/admin akan tercantum di sini.</p>
                          </td>
                        </tr>
                      ) : catalogs.filter(
                        (item) =>
                          !catalogSearch ||
                          item.songId?.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                          item.title?.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                          item.artist?.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                          item.publisher?.toLowerCase().includes(catalogSearch.toLowerCase())
                      ).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-white/60 text-xs">
                            Tidak ada lagu di katalog yang sesuai dengan pencarian Anda.
                          </td>
                        </tr>
                      ) : (
                        catalogs
                          .filter(
                            (item) =>
                              !catalogSearch ||
                              item.songId?.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                              item.title?.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                              item.artist?.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                              item.publisher?.toLowerCase().includes(catalogSearch.toLowerCase())
                          )
                          .map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                              {/* SONG ID */}
                              <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 border border-white/15">
                                  <span className="text-[#c8f560]">{item.songId}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopySongId(item.songId)}
                                    title="Salin Song ID"
                                    className="text-white/60 hover:text-white"
                                  >
                                    {copiedSongId === item.songId ? (
                                      <Check className="w-3 h-3 text-[#c8f560]" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </td>

                              {/* JUDUL LAGU */}
                              <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-[#c8f560] shrink-0">
                                    <Music className="w-3.5 h-3.5" />
                                  </div>
                                  <span>{item.title}</span>
                                </div>
                              </td>

                              {/* VOKAL / ARTIS */}
                              <td className="py-3.5 px-4 text-white/90 whitespace-nowrap">
                                {item.artist}
                              </td>

                              {/* PUBLISHER */}
                              <td className="py-3.5 px-4 text-white/80 whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/10 font-medium">
                                  {item.publisher}
                                </span>
                              </td>

                              {/* STATUS / AKTIF */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                {item.status.toLowerCase() === "aktif" ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c8f560] text-[#312042] font-bold text-[10px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#312042] animate-pulse" />
                                    Aktif
                                  </span>
                                ) : item.status.toLowerCase() === "review" ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fde08d] text-[#312042] font-bold text-[10px]">
                                    Review
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white font-medium text-[10px]">
                                    Nonaktif
                                  </span>
                                )}
                              </td>

                              {/* LINK YT / DRIVE */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  {item.youtubeLink ? (
                                    <a
                                      href={item.youtubeLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      title="Buka Link YouTube"
                                      className="px-2.5 py-1 rounded-lg bg-red-600/85 hover:bg-red-600 text-white font-bold text-[10px] flex items-center gap-1 shadow transition-all hover:scale-105"
                                    >
                                      <Youtube className="w-3.5 h-3.5" />
                                      <span>YouTube</span>
                                    </a>
                                  ) : (
                                    <span className="text-[10px] text-white/40">-</span>
                                  )}

                                  {item.driveLink ? (
                                    <a
                                      href={item.driveLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      title="Buka Master di Google Drive"
                                      className="px-2.5 py-1 rounded-lg bg-blue-600/85 hover:bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1 shadow transition-all hover:scale-105"
                                    >
                                      <HardDrive className="w-3.5 h-3.5" />
                                      <span>Drive</span>
                                    </a>
                                  ) : (
                                    <span className="text-[10px] text-white/40">-</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW: STUDIO AI COVER ART GENERATOR (3000x3000px)
             ========================================================= */}
          {activeTab === "generator" && (
            <AICoverArtGenerator
              onSelectForSubmit={(url) => {
                setUploadCoverUrl(url);
                setActiveTab("upload");
                showNotice("Artwork berhasil diterapkan ke form Submit Track!");
              }}
              onNotice={showNotice}
            />
          )}

          {/* =========================================================
              VIEW 6: PENGATURAN / SETTINGS — ALL CARDS MATCH ROYALTY GROWTH
             ========================================================= */}
          {activeTab === "settings" && (
            <div key={`settings-${animKey}`} className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 animate-card-enter">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                    Pengaturan Akun & Distribusi
                  </h1>
                  <p className="text-xs text-white/80 mt-1">
                    Kelola profil artis, keamanan akun, preferensi DSP, dan rekening royalti default
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className="px-5 py-3 rounded-full bg-[#312042] hover:bg-[#422c58] text-white text-xs font-medium flex items-center gap-2 shadow-md transition-all"
                  >
                    <UploadCloud className="w-4 h-4 text-[#c8f560]" />
                    <span>+ Submit Track Baru</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Column: Artist Profile & Security Form */}
                <form
                  onSubmit={handleSaveSettings}
                  className={`lg:col-span-7 ${ROYALTY_CARD} space-y-5 animate-card-enter`}
                  style={{ animationDelay: "60ms" }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-[#c8f560]">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Profil Artis & Keamanan
                        </h3>
                        <p className="text-[11px] text-white/70">
                          Tersinkronisasi langsung dengan database Prisma
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#c8f560] text-[#312042] text-[10px] font-semibold">
                      Verified Artist
                    </span>
                  </div>

                  {/* Avatar Preview + URL */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/15">
                    <img
                      src={settingsAvatar}
                      alt="Profile Avatar"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#c8f560]"
                    />
                    <div className="flex-1 w-full text-xs">
                      <label className="block text-white/75 mb-1 font-medium">
                        Avatar Photo URL
                      </label>
                      <input
                        type="text"
                        value={settingsAvatar}
                        onChange={(e) => setSettingsAvatar(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/15 border border-white/25 text-white focus:outline-none focus:border-[#c8f560]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-white/75 mb-1">Nama Artis / Panggung</label>
                      <input
                        type="text"
                        value={settingsName}
                        onChange={(e) => setSettingsName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white focus:outline-none focus:border-[#c8f560]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/75 mb-1">Alamat Email</label>
                      <input
                        type="email"
                        value={settingsEmail}
                        onChange={(e) => setSettingsEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white focus:outline-none focus:border-[#c8f560]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/75 mb-1">Nama Label Rekaman</label>
                      <input
                        type="text"
                        value={settingsLabelName}
                        onChange={(e) => setSettingsLabelName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white focus:outline-none focus:border-[#c8f560]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/75 mb-1">Kode ISRC Prefix</label>
                      <input
                        type="text"
                        value={settingsIsrcPrefix}
                        onChange={(e) => setSettingsIsrcPrefix(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white focus:outline-none focus:border-[#c8f560]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-white/75 mb-1">
                        Password Baru (Kosongkan jika tidak ingin mengubah)
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-white/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={settingsPassword}
                          onChange={(e) => setSettingsPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 font-medium text-white placeholder:text-white/40 focus:outline-none focus:border-[#c8f560]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="px-6 py-3 rounded-full bg-[#312042] hover:bg-[#422c58] text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#c8f560]" />
                      <span>
                        {savingSettings ? "Menyimpan..." : "Simpan Pengaturan Profil"}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Right Column: Distribution & Royalty Automation Preferences */}
                <div
                  className="lg:col-span-5 flex flex-col gap-5 animate-card-enter"
                  style={{ animationDelay: "140ms" }}
                >
                  <div className={`${ROYALTY_CARD} space-y-4`}>
                    <div className="flex items-center gap-2.5 pb-2 border-b border-white/15">
                      <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-[#c8f560]">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Preferensi Distribusi & Audio
                        </h3>
                        <p className="text-[11px] text-white/70">
                          Pengaturan otomatis saat mengunggah lagu baru
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      {[
                        {
                          title: "YouTube Content ID & TikTok Monetization",
                          desc: "Klaim royalti otomatis saat lagu dipakai di video Shorts/Reels",
                          val: autoContentId,
                          toggle: () => setAutoContentId(!autoContentId),
                        },
                        {
                          title: "Dolby Atmos & 24-bit Lossless Mastering",
                          desc: "Kirim kualitas audio Hi-Res ke Apple Music & Tidal",
                          val: dolbyAtmos,
                          toggle: () => setDolbyAtmos(!dolbyAtmos),
                        },
                        {
                          title: "Auto-Withdraw Royalti Bulanan",
                          desc: "Tarik otomatis ke rekening utama saat saldo di atas $500",
                          val: autoPayout,
                          toggle: () => setAutoPayout(!autoPayout),
                        },
                        {
                          title: "Notifikasi Laporan Stream & Pembayaran",
                          desc: "Terima laporan harian ketika rilis telah disetujui Admin",
                          val: emailAlerts,
                          toggle: () => setEmailAlerts(!emailAlerts),
                        },
                      ].map((pref, i) => (
                        <div
                          key={i}
                          onClick={pref.toggle}
                          className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/20 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-white">{pref.title}</p>
                            <p className="text-[11px] text-white/70 mt-0.5">{pref.desc}</p>
                          </div>
                          <div
                            className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${
                              pref.val ? "bg-[#312042]" : "bg-white/25"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full transition-transform ${
                                pref.val
                                  ? "translate-x-5 bg-[#c8f560]"
                                  : "translate-x-0 bg-white"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Default Payout Account Summary */}
                  <div className={`${ROYALTY_CARD} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">
                        Rekening Pencairan Default
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab("wallet")}
                        className="text-xs text-[#c8f560] underline font-medium"
                      >
                        Ubah di Menu Wallet
                      </button>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#312042] text-[#c8f560] flex items-center justify-center font-bold">
                          $
                        </div>
                        <div>
                          <p className="font-bold text-white">{withdrawMethod}</p>
                          <p className="text-[11px] text-white/75">No. Rek: {accountNumber}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#c8f560] text-[#312042] font-semibold text-[10px]">
                        100% Share
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </main>
        </div>
      </div>
    </div>
  );
}
