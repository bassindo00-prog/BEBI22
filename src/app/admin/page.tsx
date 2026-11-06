"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Disc3,
  Wallet,
  Users,
  Settings,
  LogOut,
  Sun,
  Check,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Trash2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  XCircle,
  Mail,
  Send,
  Download,
  Eye,
  X,
  TrendingUp,
  Banknote,
  Music,
  ExternalLink,
  ListMusic,
  Youtube,
  HardDrive,
  Search,
  PlusCircle,
  FileSpreadsheet,
  Copy,
  Menu,
  Volume2,
  Globe,
  Sparkles,
} from "lucide-react";
import VisaWithdrawalCardModal from "@/components/VisaWithdrawalCardModal";
import AdminLandingCMS from "@/components/AdminLandingCMS";
import Pagination from "@/components/Pagination";
import { THEMES, type ThemeId } from "@/lib/theme";

const ROYALTY_CARD =
  "bg-[#8a88b5]/70 border border-white/20 rounded-[28px] p-6 text-white shadow-lg";

const formatNumberWithDots = (val: string | number) => {
  if (val === undefined || val === null || val === "") return "";
  const clean = String(val).replace(/[^0-9]/g, "");
  return clean ? Number(clean).toLocaleString("id-ID") : "";
};

const parseFormattedNumber = (val: string | number) => {
  const clean = String(val).replace(/[^0-9]/g, "");
  return clean ? Number(clean) : 0;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "releases"
    | "my-releases"
    | "my-reject"
    | "catalog"
    | "cms"
    | "withdrawals"
    | "users"
    | "inbox"
    | "royalty-input"
    | "settings"
  >("overview");
  const [period, setPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [theme, setTheme] = useState<ThemeId>("purple");

  useEffect(() => {
    const saved = localStorage.getItem("breakout_theme");
    if (saved && ["dark", "white", "blue", "purple", "yellow"].includes(saved)) {
      setTheme(saved as ThemeId);
    }
  }, []);

  const changeTheme = (newTheme: ThemeId) => {
    setTheme(newTheme);
    localStorage.setItem("breakout_theme", newTheme);
  };

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[3];
  const [users, setUsers] = useState<any[]>([]);
  const [releases, setReleases] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Catalog Form & Management State
  const [catSongId, setCatSongId] = useState("HRM-ID-0106");
  const [catTitle, setCatTitle] = useState("");
  const [catArtist, setCatArtist] = useState("");
  const [catPublisher, setCatPublisher] = useState("BREAKOUT Publishing / Sony Music");
  const [catStatus, setCatStatus] = useState("Aktif");
  const [catYoutube, setCatYoutube] = useState("");
  const [catDrive, setCatDrive] = useState("");
  const [uploadingCatalog, setUploadingCatalog] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState("");
  const [catSearch, setCatSearch] = useState("");

  // Pagination State (5 items per page)
  const [pageReleases, setPageReleases] = useState(1);
  const [pageMyReleases, setPageMyReleases] = useState(1);
  const [pageMyReject, setPageMyReject] = useState(1);
  const [pageCatalog, setPageCatalog] = useState(1);
  const [pageWithdrawals, setPageWithdrawals] = useState(1);
  const [pageUsers, setPageUsers] = useState(1);
  const [withdrawalTab, setWithdrawalTab] = useState<"Pending" | "Approved" | "Rejected" | "All">("Pending");

  // Track Detail Modal State
  const [selectedRelease, setSelectedRelease] = useState<any | null>(null);

  // Visa Withdrawal Card Modal State
  const [selectedWithdrawalForVisaModal, setSelectedWithdrawalForVisaModal] = useState<any | null>(null);

  // Send Message State
  const [msgTargetUser, setMsgTargetUser] = useState<string>("ALL");
  const [msgTitle, setMsgTitle] = useState("");
  const [msgContent, setMsgContent] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Royalty & Streaming Input Form State (to specific User, not song)
  const [selectedUserForRoyalty, setSelectedUserForRoyalty] = useState<string>("");
  const [inputRoyaltyBalance, setInputRoyaltyBalance] = useState<number>(0);
  const [inputRoyaltyPending, setInputRoyaltyPending] = useState<number>(0);
  const [inputTotalStreams, setInputTotalStreams] = useState<number>(0);
  const [savingRoyalty, setSavingRoyalty] = useState(false);
  const [grossRoyaltyInput, setGrossRoyaltyInput] = useState<number>(100000);
  const [cutPercentage, setCutPercentage] = useState<number>(30);

  // Admin Settings State
  const [autoApproveVerified, setAutoApproveVerified] = useState(false);
  const [instantBankPayout, setInstantBankPayout] = useState(true);
  const [strictCopyrightCheck, setStrictCopyrightCheck] = useState(true);

  const [animProgress, setAnimProgress] = useState(0);
  const [barsReady, setBarsReady] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [liveTick, setLiveTick] = useState(0);

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  useEffect(() => {
    setAnimProgress(0);
    setBarsReady(false);
    setAnimKey((prev) => prev + 1);
    const tTimer = setTimeout(() => setBarsReady(true), 80);

    let frameId: number;
    const startTime = performance.now();
    const duration = 1200;

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
      clearTimeout(tTimer);
      cancelAnimationFrame(frameId);
    };
  }, [activeTab, period]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTick((prev) => (prev + 1) % 100);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview");
      const data = await res.json();
      if (data.users) setUsers(data.users);
      if (data.releases) setReleases(data.releases);
      if (data.withdrawals) setWithdrawals(data.withdrawals);
      if (data.catalogs) setCatalogs(data.catalogs);

      if (data.users && data.releases) {
        const appRels = (data.releases || []).filter((r: any) => r.status === "Approved");
        const appArt = (data.users || []).filter(
          (u: any) => u.role !== "ADMIN" && appRels.some((r: any) => r.userId === u.id)
        );
        const target =
          appArt.find((u: any) => u.id === selectedUserForRoyalty) ||
          appArt[0] ||
          data.users.find((u: any) => u.role !== "ADMIN") ||
          data.users[0];
        if (target && !selectedUserForRoyalty) {
          setSelectedUserForRoyalty(target.id);
          setInputRoyaltyBalance(target.royaltyBalance || 0);
          setInputRoyaltyPending(target.royaltyPending || 0);
          setInputTotalStreams(target.totalStreams || 0);
        }
      }

      const msgRes = await fetch("/api/messages?admin=true");
      const msgData = await msgRes.json();
      if (msgData.messages) setMessages(msgData.messages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Calculate Royalty with percentage deduction
  const updateRoyaltyCalc = (newGross: number, newCutPercent: number) => {
    const gross = Math.max(0, newGross);
    const cutPct = Math.min(100, Math.max(0, newCutPercent));
    setGrossRoyaltyInput(gross);
    setCutPercentage(cutPct);
    const calculatedCut = Math.round(gross * (cutPct / 100));
    const net = Math.max(0, gross - calculatedCut);
    setInputRoyaltyBalance(net);
  };

  // When selected user changes for royalty input
  const handleSelectUserChange = (uId: string) => {
    setSelectedUserForRoyalty(uId);
    const u = users.find((x) => x.id === uId);
    if (u) {
      setInputRoyaltyBalance(u.royaltyBalance || 0);
      setInputRoyaltyPending(u.royaltyPending || 0);
      setInputTotalStreams(u.totalStreams || 0);
    }
  };

  // Save Royalty & Streaming directly to User
  const handleSaveUserRoyalty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForRoyalty) return;
    setSavingRoyalty(true);
    try {
      const res = await fetch("/api/admin/overview", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserForRoyalty,
          royaltyBalance: inputRoyaltyBalance,
          royaltyPending: inputRoyaltyPending,
          totalStreams: inputTotalStreams,
        }),
      });
      if (res.ok) {
        await fetchAdminData();
        showNotice("Data Royalty & Streaming berhasil diupdate untuk User!");
      }
    } finally {
      setSavingRoyalty(false);
    }
  };

  // Send Message (Single User or All Users)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgTitle || !msgContent) {
      showNotice("Judul dan pesan wajib diisi");
      return;
    }
    setSendingMsg(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: msgTitle,
          content: msgContent,
          userId: msgTargetUser === "ALL" ? null : msgTargetUser,
          sender: "Admin BREAKOUT Distribution",
        }),
      });
      if (res.ok) {
        setMsgTitle("");
        setMsgContent("");
        await fetchAdminData();
        showNotice(
          msgTargetUser === "ALL"
            ? "Pesan berhasil di-broadcast ke SEMUA artis!"
            : "Pesan berhasil dikirim ke artis tujuan!"
        );
      }
    } finally {
      setSendingMsg(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchAdminData();
      showNotice("Pesan berhasil dihapus");
    }
  };

  const handleReleaseStatus = async (id: string, status: string) => {
    const res = await fetch("/api/releases", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      await fetchAdminData();
      showNotice(`Status rilis diperbarui menjadi ${status}`);
    }
  };

  const handleBoostStreams = async (id: string, currentNum: number) => {
    const nextNum = (currentNum || 500000) + 250000;
    const formatted =
      nextNum >= 1000000
        ? `${(nextNum / 1000000).toFixed(3)}M`
        : `${Math.round(nextNum / 1000)}K`;
    const res = await fetch("/api/releases", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, streams: formatted, streamsNum: nextNum }),
    });
    if (res.ok) {
      await fetchAdminData();
      showNotice(`Streams updated to ${formatted} in Prisma DB`);
    }
  };

  const handleDeleteRelease = async (id: string) => {
    const res = await fetch(`/api/releases?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchAdminData();
      showNotice("Release removed from catalog");
    }
  };

  const handleWithdrawalStatus = async (id: string, status: string) => {
    const res = await fetch("/api/withdrawals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      await fetchAdminData();
      showNotice(`Withdrawal request marked as ${status}`);
    }
  };

  // Catalog Handlers
  const handleSaveCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catSongId || !catTitle) {
      showNotice("Song ID dan Judul Lagu wajib diisi!");
      return;
    }
    setUploadingCatalog(true);
    try {
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          songId: catSongId,
          title: catTitle,
          artist: catArtist || "BREAKOUT Artist",
          publisher: catPublisher,
          status: catStatus,
          youtubeLink: catYoutube,
          driveLink: catDrive,
        }),
      });
      if (res.ok) {
        setCatTitle("");
        setCatArtist("");
        setCatYoutube("");
        setCatDrive("");
        setCatSongId(`HRM-ID-${Math.floor(1000 + Math.random() * 9000)}`);
        await fetchAdminData();
        showNotice("Lagu berhasil diupload ke katalog & langsung muncul ke akun user!");
      }
    } finally {
      setUploadingCatalog(false);
    }
  };

  const handleBulkUploadCatalog = async () => {
    if (!bulkCsvText.trim()) {
      showNotice("Silakan masukkan teks data CSV atau baris katalog");
      return;
    }
    setUploadingCatalog(true);
    try {
      const lines = bulkCsvText.trim().split("\n");
      const items = [];
      for (const line of lines) {
        const parts = line.split(/[,\t]/).map((p) => p.trim());
        if (parts.length >= 2) {
          items.push({
            songId: parts[0],
            title: parts[1],
            artist: parts[2] || "BREAKOUT Artist",
            publisher: parts[3] || "BREAKOUT Publishing",
            status: parts[4] || "Aktif",
            youtubeLink: parts[5] || "",
            driveLink: parts[6] || "",
          });
        }
      }
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const d = await res.json();
      if (d.ok) {
        setBulkCsvText("");
        setBulkMode(false);
        await fetchAdminData();
        showNotice(`${d.count} lagu berhasil diupload massal ke katalog!`);
      }
    } finally {
      setUploadingCatalog(false);
    }
  };

  const handleDeleteCatalog = async (id: string) => {
    const res = await fetch(`/api/catalog?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchAdminData();
      showNotice("Lagu berhasil dihapus dari katalog");
    }
  };

  const handleToggleCatalogStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Aktif" ? "Nonaktif" : "Aktif";
    const res = await fetch("/api/catalog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    if (res.ok) {
      await fetchAdminData();
      showNotice(`Status lagu diubah menjadi ${nextStatus}`);
    }
  };

  // Trigger file download directly without leaving page or opening new window
  const downloadAsset = async (url: string, filename: string) => {
    showNotice(`Sedang mengunduh file: ${filename}...`);
    try {
      const sep = url.includes("?") ? "&" : "?";
      const downloadUrl = `${url}${sep}download=1&filename=${encodeURIComponent(filename)}`;

      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 300);

      showNotice(`✓ File ${filename} berhasil diunduh dan tersimpan di komputer.`);
    } catch (err: any) {
      console.warn("Blob fetch download failed, fallback to direct download URL:", err);
      // Fallback: direct download link without target="_blank"
      const sep = url.includes("?") ? "&" : "?";
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = `${url}${sep}download=1&filename=${encodeURIComponent(filename)}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 300);
      showNotice(`Mengunduh: ${filename}`);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    router.push("/login");
  };

  const pendingReleases = releases.filter(
    (r) => r.status !== "Approved" && r.status !== "Rejected"
  );
  const approvedReleases = releases.filter((r) => r.status === "Approved");
  const rejectedReleases = releases.filter((r) => r.status === "Rejected");
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "Pending");
  const totalPayoutAmount = withdrawals
    .filter((w) => w.status === "Approved")
    .reduce((acc, w) => acc + Number(w.amount || 0), 0);

  // Helper to extract artist display name (prefer registered Artist profile over generic account name)
  const getArtistDisplayName = (u: any) => {
    if (!u) return "Artis";
    if (u.artists && u.artists.length > 0 && u.artists[0]?.name) {
      return u.artists[0].name;
    }
    return u.name || "Artis";
  };

  // Filter artis yang sudah creat new artis & sudah punya rilisan lagu ACC (Approved)
  const approvedArtists = users.filter(
    (u) =>
      u.role !== "ADMIN" &&
      approvedReleases.some((r) => r.userId === u.id)
  );
  const releasedArtists = approvedArtists;

  const totalGlobalStreams = users.reduce((acc, u) => acc + (u.totalStreams || 0), 0);
  const totalGlobalRoyalty = users.reduce((acc, u) => acc + (u.royaltyBalance || 0), 0);
  const hasGlobalData = totalGlobalStreams > 0 || totalGlobalRoyalty > 0;

  const adminBatteryPct = Math.round(
    (releases.length > 0
      ? Math.round((approvedReleases.length / releases.length) * 100)
      : 0) * animProgress
  );

  return (
    <div
      className={`h-screen w-full overflow-hidden flex transition-all duration-300 ${currentTheme.className}`}
      style={{ background: currentTheme.background }}
    >
      {/* Toast Notice */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#312042] text-white text-xs font-medium shadow-xl border border-[#c8f560]/50 flex items-center gap-2.5 animate-card-enter">
          <span className="w-2 h-2 rounded-full bg-[#c8f560] animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* MODAL: DETAIL RILISAN USER & DOWNLOAD MP3 / ARTWORK */}
      {selectedRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-card-enter">
          <div className="relative w-full max-w-2xl bg-[#52446f] border border-white/25 rounded-3xl p-6 sm:p-7 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/15">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-[#c8f560] text-[#312042] text-xs font-bold">
                  Detail Rilisan User
                </span>
                <span className="text-xs text-white/70">ID: {selectedRelease.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRelease(null)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="my-5 space-y-5">
              {/* Artwork + Basic Info + Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-36 h-36 rounded-2xl overflow-hidden border border-white/25 shrink-0 bg-black/20 shadow-lg relative group">
                  <img
                    src={selectedRelease.coverUrl}
                    alt={selectedRelease.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      downloadAsset(
                        selectedRelease.coverUrl,
                        `${selectedRelease.title}-cover.jpg`
                      )
                    }
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-white"
                  >
                    <Download className="w-5 h-5 text-[#c8f560]" />
                    <span>Unduh Cover</span>
                  </button>
                </div>

                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-bold text-white">{selectedRelease.title}</h2>
                  <p className="text-xs text-[#c8f560] font-medium">
                    Artis: {selectedRelease.artist}
                  </p>
                  <p className="text-xs text-white/75">
                    Artis Submitter:{" "}
                    <span className="font-semibold text-white">
                      {selectedRelease.artist || selectedRelease.user?.name || "Abdul"}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        downloadAsset(
                          selectedRelease.coverUrl,
                          `${selectedRelease.title}-artwork.jpg`
                        )
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-medium flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#c8f560]" />
                      <span>Unduh Art Cover (JPG/PNG)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        downloadAsset(
                          selectedRelease.audioFile || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                          `${selectedRelease.title}-master.mp3`
                        )
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-[#312042] hover:bg-[#422c58] text-[#c8f560] border border-[#c8f560]/50 text-xs font-semibold flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Master Audio (MP3/WAV)</span>
                    </button>
                  </div>

                  {/* Inline Audio Player for Admin Listening */}
                  {selectedRelease.audioFile && (
                    <div className="pt-2">
                      <p className="text-[11px] text-white/70 mb-1 flex items-center gap-1 font-medium">
                        <Volume2 className="w-3.5 h-3.5 text-[#c8f560]" />
                        <span>Putar Preview Audio Rilis:</span>
                      </p>
                      <audio
                        controls
                        src={selectedRelease.audioFile}
                        className="w-full h-8 rounded-lg bg-black/40 border border-white/15"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Grid Detail Metadata yang disubmit User */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/10 border border-white/15 text-xs">
                <div>
                  <span className="text-white/60 block text-[11px]">Featuring Artist:</span>
                  <span className="font-semibold text-white">
                    {selectedRelease.featuring || "Tidak ada (Solo)"}
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block text-[11px]">Genre:</span>
                  <span className="font-semibold text-white">{selectedRelease.genre}</span>
                </div>
                <div>
                  <span className="text-white/60 block text-[11px]">Composer (Pencipta):</span>
                  <span className="font-semibold text-white">
                    {selectedRelease.composer || "Abdul • BREAKOUT"}
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block text-[11px]">Producer (Produser):</span>
                  <span className="font-semibold text-white">
                    {selectedRelease.producer || "Luxoa Studio"}
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block text-[11px]">Potongan TikTok & Reels:</span>
                  <span className="font-semibold text-[#c8f560]">
                    {selectedRelease.tiktokClip || "00:45 - 01:15 (30s)"}
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block text-[11px]">Tanggal Rilis:</span>
                  <span className="font-semibold text-white">
                    {selectedRelease.releaseDate}
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block text-[11px]">Durasi Track:</span>
                  <span className="font-semibold text-white">
                    {selectedRelease.duration || "3:42"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-white/60 block text-[11px] mb-1.5">Target Distribusi Platform (Daftar Lengkap):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedRelease.platforms || "Spotify, Apple Music, TikTok, YouTube")
                      .split(",")
                      .map((p: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-[#312042] border border-[#c8f560]/40 text-[#c8f560] text-xs font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-[#c8f560]" />
                          <span>{p.trim()}</span>
                        </span>
                      ))}
                  </div>
                </div>

                {/* UPC & ISRC Codes */}
                <div className="p-3 rounded-xl bg-black/30 border border-white/20 flex items-center justify-between">
                  <div>
                    <span className="text-[#c8f560] block text-[10px] font-bold uppercase tracking-wider">UPC Barcode</span>
                    <span className="font-mono font-bold text-sm text-white">
                      {selectedRelease.upc || "899214578101"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(selectedRelease.upc || "899214578101");
                      showNotice("UPC Barcode berhasil disalin!");
                    }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#c8f560]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-white/20 flex items-center justify-between">
                  <div>
                    <span className="text-[#c8f560] block text-[10px] font-bold uppercase tracking-wider">ISRC Code</span>
                    <span className="font-mono font-bold text-sm text-[#c8f560]">
                      {selectedRelease.isrc || "ID-HRM-24-00101"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(selectedRelease.isrc || "ID-HRM-24-00101");
                      showNotice("ISRC Code berhasil disalin!");
                    }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#c8f560]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons: Approve / Reject / Hold */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70">Status Sekarang:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedRelease.status === "Approved"
                        ? "bg-[#c8f560] text-[#312042]"
                        : selectedRelease.status === "Rejected"
                        ? "bg-red-500/25 border border-red-500/40 text-red-200"
                        : "bg-[#fde08d] text-[#312042]"
                    }`}
                  >
                    {selectedRelease.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleReleaseStatus(selectedRelease.id, "Approved");
                      setSelectedRelease(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#c8f560] text-[#312042] text-xs font-bold hover:opacity-90 shadow"
                  >
                    Setujui (Approve)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleReleaseStatus(selectedRelease.id, "Rejected");
                      setSelectedRelease(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/25 border border-red-500/40 text-red-200 text-xs font-bold hover:bg-red-500/40 shadow transition-colors"
                  >
                    Tolak (Reject)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleReleaseStatus(selectedRelease.id, "Pending");
                      setSelectedRelease(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/15 text-white text-xs font-medium hover:bg-white/25"
                  >
                    Tahan (Hold)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Luxury VISA Withdrawal Verification & ACC Modal */}
      <VisaWithdrawalCardModal
        isOpen={!!selectedWithdrawalForVisaModal}
        withdrawal={selectedWithdrawalForVisaModal}
        onClose={() => setSelectedWithdrawalForVisaModal(null)}
        onApprove={async (id) => {
          await handleWithdrawalStatus(id, "Approved");
          // Keep updated status in modal or close after confirmation
          if (selectedWithdrawalForVisaModal) {
            setSelectedWithdrawalForVisaModal({
              ...selectedWithdrawalForVisaModal,
              status: "Approved",
            });
          }
        }}
        onReject={async (id) => {
          await handleWithdrawalStatus(id, "Rejected");
          if (selectedWithdrawalForVisaModal) {
            setSelectedWithdrawalForVisaModal({
              ...selectedWithdrawalForVisaModal,
              status: "Rejected",
            });
          }
        }}
      />

      {/* Full Screen Layout: Viewport Locked, Zero Window Scroll */}
      <div className="w-full h-full flex overflow-hidden">
        {/* SLIDE-OUT MENU DRAWER — Tersedia untuk Desktop & Mobile */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex animate-fade-in">
            <div
              className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside className="relative w-80 max-w-[85vw] h-full bg-[#271f37]/95 backdrop-blur-2xl border-r border-white/20 z-50 flex flex-col justify-between p-6 text-white shadow-2xl overflow-y-auto animate-slide-right">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("overview");
                        setMobileMenuOpen(false);
                      }}
                      className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer bg-white/10"
                    >
                      <div className="w-4 h-7 rounded-full border-2 border-white" />
                    </button>
                    <div>
                      <span className="font-bold text-base tracking-tight text-white block">BREAKOUT ADMIN</span>
                      <span className="text-[10px] text-[#c8f560] font-semibold tracking-wider uppercase">Executive Console</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                    title="Tutup Menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="mt-5 space-y-1.5">
                  {[
                    { id: "overview", label: "Admin Overview", icon: Home, badge: null, color: null },
                    { id: "releases", label: "Review Submissions", icon: Clock, badge: pendingReleases.length ? `${pendingReleases.length} Baru` : null, color: "bg-[#fde08d] text-[#312042]" },
                    { id: "my-releases", label: "My Releases — ACC", icon: CheckCircle2, badge: approvedReleases.length ? `${approvedReleases.length} ACC` : null, color: "bg-[#c8f560] text-[#312042]" },
                    { id: "my-reject", label: "My Reject (Revisi)", icon: XCircle, badge: rejectedReleases.length ? `${rejectedReleases.length}` : null, color: "bg-red-400 text-white" },
                    { id: "catalog", label: "Daftar Katalog Musik", icon: ListMusic, badge: catalogs.length ? `${catalogs.length}` : null, color: "bg-white/20 text-white" },
                    { id: "cms", label: "Web CMS Landing Page", icon: Globe, badge: "LIVE", color: "bg-[#ff7fab]/25 text-[#ff7fab]" },
                    { id: "royalty-input", label: "Input Royalty & Streams", icon: Banknote, badge: "IDR", color: "bg-[#c8f560]/20 text-[#c8f560]" },
                    { id: "withdrawals", label: "Payouts & VISA ACC", icon: Wallet, badge: withdrawals.length ? `${withdrawals.length} Req` : null, color: "bg-[#c8f560] text-[#312042]" },
                    { id: "inbox", label: "Inbox & Broadcast", icon: Mail, badge: null, color: null },
                    { id: "users", label: "Daftar Artis & Akun", icon: Users, badge: releasedArtists.length ? `${releasedArtists.length} Artis` : null, color: "bg-white/20 text-white" },
                    { id: "settings", label: "Pengaturan Sistem", icon: Settings, badge: null, color: null },
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
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#352a4a] text-[#c8f560] shadow-md border border-[#c8f560]/35 scale-[1.01]"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`p-2 rounded-xl shrink-0 ${isActive ? "bg-[#c8f560]/20 text-[#c8f560]" : "bg-white/10 text-white"}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.color || "bg-white/15 text-white"}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 mt-6 border-t border-white/15">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/30 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Keluar Akun Admin</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* RIGHT COLUMN: Pinned Top Bar + Scrollable Main Content */}
        <div className="flex-1 h-full flex flex-col overflow-hidden min-w-0">
          {/* FROZEN TOP BAR — Permanently Pinned at the top, NEVER moves during scroll */}
          <header className="w-full shrink-0 z-30 px-4 sm:px-7 md:px-8 py-3 sm:py-3.5 border-b border-white/15 bg-[#8a88b5]/60 backdrop-blur-md shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              {/* Brand + Hamburger Menu Button */}
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                    title="Buka Slide Bar Menu Admin"
                  >
                    <Menu className="w-5 h-5 text-white" />
                    <span className="text-xs font-bold uppercase tracking-wider">Menu</span>
                  </button>
                  <span className="text-lg sm:text-xl font-bold tracking-wide text-white flex items-center gap-2">
                    BREAKOUT
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c8f560] text-[#312042] uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      ADMIN
                    </span>
                  </span>
                </div>

                {/* Mobile Right Quick Actions */}
                <div className="flex sm:hidden items-center gap-1.5">
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/20 backdrop-blur-md border border-white/15">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => changeTheme(t.id)}
                        className={`w-4 h-4 rounded-full transition-transform ${t.dotBg} ${
                          theme === t.id
                            ? "ring-2 ring-white scale-110 shadow"
                            : "opacity-60 hover:opacity-100"
                        }`}
                        title={t.name}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={fetchAdminData}
                    className="p-1.5 rounded-full bg-white/15 text-white"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Period Pills — Responsive 3-Pills */}
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
                {/* 5-Theme Switcher Palette */}
                <div className="bg-[#8a88b5]/70 border border-white/20 p-1 rounded-full flex items-center gap-1 backdrop-blur-md text-xs">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => changeTheme(t.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all ${
                        theme === t.id
                          ? "bg-[#312042] text-white font-semibold shadow-sm"
                          : "text-white/80 hover:text-white"
                      }`}
                      title={t.name}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${t.dotBg} border ${t.dotBorder}`} />
                      <span className="hidden xl:inline">{t.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={fetchAdminData}
                  title="Refresh Prisma Data"
                  className="w-10 h-10 rounded-full bg-[#8a88b5]/70 border border-white/20 flex items-center justify-center text-white hover:bg-white/25"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </header>

          {/* MAIN SCROLLABLE BODY — Hanya bagian konten ini yang bergulir */}
          <main className="flex-1 w-full overflow-y-auto overflow-x-hidden p-5 sm:p-7 md:p-8">

          {/* HEADER BANNER */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 animate-card-enter">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                Welcome Back, Admin Avelin!
              </h1>
              <p className="text-xs text-white/80 mt-1">
                Executive label distribution & royalty settlement control center
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-xs text-white/80">Global network streams</p>
                <p className="text-2xl sm:text-3xl font-semibold text-white mt-0.5 tabular-nums">
                  {totalGlobalStreams > 0 ? `${Math.round(totalGlobalStreams * animProgress).toLocaleString()}K` : "0"}
                </p>
              </div>

              <div className="h-9 w-[1px] bg-white/25 hidden sm:block" />

              <div>
                <p className="text-xs text-white/80">Cleared payouts</p>
                <p className="text-2xl sm:text-3xl font-semibold text-white mt-0.5 tabular-nums">
                  Rp {Math.round(totalPayoutAmount * animProgress).toLocaleString("id-ID")}
                </p>
              </div>

              <button
                onClick={() => setActiveTab("releases")}
                className="px-5 py-3 rounded-full bg-[#312042] hover:bg-[#422c58] text-white text-xs font-medium flex items-center gap-2 shadow-md"
              >
                <span>Review Queue ({pendingReleases.length})</span>
              </button>
            </div>
          </div>

          {/* LIVE ANIMATED CHARTS ROW FOR ADMIN */}
          <div
            key={`admin-charts-${animKey}`}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6"
          >
            {/* Card 1: Animated Battery Chart (Catalog Approval Rate) */}
            <div
              className={`lg:col-span-4 ${ROYALTY_CARD} flex flex-col justify-between animate-card-enter`}
              style={{ animationDelay: "60ms" }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Catalog Approval Rate</h3>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c8f560] animate-ping" />
                  <span>LIVE QC</span>
                </div>
              </div>

              <div className="my-5 relative h-24 rounded-[26px] flex items-center justify-center select-none">
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
                    strokeDashoffset={720 - 350 * animProgress}
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
                    strokeDasharray={`${230 * animProgress} 720`}
                    strokeDashoffset={-240}
                  />
                </svg>

                <div className="w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-[20px] bg-white/10 overflow-hidden relative flex items-center justify-center">
                  <div
                    style={{ width: `${adminBatteryPct}%` }}
                    className="absolute left-0 top-0 bottom-0 progress-stripes transition-all duration-300 ease-out overflow-hidden border-r-2 border-[#c8f560]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#312042]/35 via-[#c8f560]/25 to-[#c8f560]/45" />
                    <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-battery-shimmer" />
                  </div>
                  <span className="relative z-10 text-3xl font-semibold text-white tabular-nums">
                    {adminBatteryPct}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/85">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c8f560]" />
                  {approvedReleases.length} Approved
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fde08d]" />
                  {pendingReleases.length} Pending
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c4c3f0]" />
                  {releasedArtists.length} Artists Aktif
                </span>
              </div>
            </div>

            {/* Card 2: Live Label Revenue Curve */}
            <div
              className={`lg:col-span-5 ${ROYALTY_CARD} flex flex-col justify-between relative overflow-hidden animate-card-enter`}
              style={{ animationDelay: "130ms" }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">
                  Global Label Royalty Velocity
                </h3>
                <span className="px-3 py-1 rounded-full bg-white/15 text-xs text-[#c8f560]">
                  {hasGlobalData ? "+18.4% Growth" : "0% Activity"}
                </span>
              </div>

              <div className="relative h-36 mt-2 flex items-end">
                <div className="flex flex-col justify-between h-full text-[11px] text-white/70 pr-3 pb-5">
                  <span>90K</span>
                  <span>60K</span>
                  <span>30K</span>
                  <span>10K</span>
                </div>

                <div className="flex-1 relative h-full">
                  <div className="absolute left-[64%] -top-1 -translate-x-1/2 bg-[#312042] border border-[#c8f560]/60 text-[#c8f560] px-3 py-1 rounded-xl text-xs font-bold shadow-md animate-tooltip-float tabular-nums">
                    Rp {Math.round(totalGlobalRoyalty * animProgress).toLocaleString("id-ID")}
                    <div className="w-2 h-2 bg-[#312042] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                  </div>

                  <svg viewBox="0 0 320 110" className="w-full h-28 overflow-visible">
                    <defs>
                      <linearGradient id="adminGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c8f560" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#c8f560" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {hasGlobalData ? (
                      <>
                        <rect
                          x="194"
                          y="20"
                          width="22"
                          height="85"
                          rx="11"
                          fill="url(#adminGlow)"
                          className="animate-pillar-rise"
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
                          cx="205"
                          cy="21"
                          r="10"
                          fill="#c8f560"
                          opacity="0.35"
                          className="animate-ping"
                        />
                        <circle
                          cx="205"
                          cy="21"
                          r="6"
                          fill="#8a88b5"
                          stroke="#c8f560"
                          strokeWidth="3.5"
                        />
                      </>
                    ) : (
                      <>
                        <line
                          x1="10"
                          y1="95"
                          x2="310"
                          y2="95"
                          stroke="#c8f560"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          opacity="0.4"
                        />
                        <circle
                          cx="205"
                          cy="95"
                          r="5"
                          fill="#312042"
                          stroke="#c8f560"
                          strokeWidth="2"
                        />
                      </>
                    )}
                  </svg>

                  {!hasGlobalData && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-6">
                      <span className="text-[10px] text-white/50 bg-[#312042]/50 px-2.5 py-0.5 rounded-full border border-white/10">
                        Belum ada data royalti jaringan
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-white/75 pt-1">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Live Platform Load Bars */}
            <div
              className={`lg:col-span-3 ${ROYALTY_CARD} flex flex-col justify-between animate-card-enter`}
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">DSP Traffic</h3>
                <span className="flex items-center gap-1.5 text-xs text-[#c8f560] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c8f560] animate-pulse" />
                  live
                </span>
              </div>

              <div className="flex items-end justify-between h-32 pt-4 gap-2 relative">
                <div className="flex flex-col justify-between h-full text-[11px] text-white/70 pb-5">
                  <span>600</span>
                  <span>400</span>
                  <span>200</span>
                </div>

                {[
                  { label: "Spotify", h1: 78, h2: 46, c1: "bg-[#c8f560]" },
                  { label: "Apple Music", h1: 94, h2: 52, c1: "bg-[#c4c3f0]" },
                  { label: "TikTok", h1: 72, h2: 40, c1: "bg-[#c8f560]" },
                  { label: "YouTube", h1: 86, h2: 60, c1: "bg-[#c4c3f0]" },
                ].map((bar, i) => {
                  const wave = liveTick % 2 === i % 2 ? 3 : -2;
                  const height1 = barsReady ? (hasGlobalData ? `${bar.h1 + wave}%` : "5%") : "0%";
                  const height2 = barsReady ? (hasGlobalData ? `${bar.h2 - wave}%` : "5%") : "0%";
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="flex items-end gap-1.5 h-24">
                        <div
                          style={{
                            height: height1,
                            transitionDelay: `${i * 110}ms`,
                          }}
                          className={`w-2.5 rounded-full ${bar.c1} transition-all duration-1000 ease-out`}
                        />
                        <div
                          style={{
                            height: height2,
                            transitionDelay: `${i * 110 + 60}ms`,
                          }}
                          className="w-2.5 rounded-full bg-white/25 transition-all duration-1000 ease-out"
                        />
                      </div>
                      <span className="text-[10px] text-white/80 whitespace-nowrap">
                        {bar.label}
                      </span>
                    </div>
                  );
                })}

                {!hasGlobalData && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-6">
                    <span className="text-[10px] text-white/50 bg-[#312042]/50 px-2.5 py-0.5 rounded-full border border-white/10">
                      0 live traffic
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================
              ADMIN VIEW 1: OVERVIEW (Releases Moderation + Payout Queue)
             ========================================================= */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: Release Moderation Table */}
              <div
                className={`lg:col-span-7 ${ROYALTY_CARD} flex flex-col animate-card-enter`}
                style={{ animationDelay: "250ms" }}
              >
                <div className="pb-3 flex items-center justify-between border-b border-white/15">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Active Catalog Releases (Live & ACC)
                    </h3>
                    <p className="text-[11px] text-white/70">
                      Rilisan terbaru (5 Lagu Terakhir)
                    </p>
                  </div>
                  {pendingReleases.length > 0 && (
                    <button
                      onClick={() => setActiveTab("releases")}
                      className="px-2.5 py-1 rounded-lg bg-[#fde08d] text-[#312042] text-xs font-bold hover:bg-[#fff2a8] transition-colors flex items-center gap-1 shadow"
                    >
                      <Clock className="w-3 h-3" />
                      <span>{pendingReleases.length} Perlu Review</span>
                    </button>
                  )}
                </div>

                {/* Overview Mobile Releases List (< md) — Menampilkan 5 Rilisan Terbaru */}
                <div className="md:hidden space-y-3 pt-3">
                  {approvedReleases.length === 0 ? (
                    <div className="py-8 text-center text-white/70 space-y-1">
                      <Disc3 className="w-8 h-8 mx-auto text-white/25 mb-1" />
                      <p className="font-semibold text-xs text-white">Belum Ada Rilisan yang Di-ACC</p>
                      <p className="text-[11px] text-white/60">
                        {pendingReleases.length > 0
                          ? `Ada ${pendingReleases.length} lagu yang menunggu moderasi di menu Review Submissions.`
                          : "Lagu yang disetujui akan tampil di sini."}
                      </p>
                      {pendingReleases.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab("releases")}
                          className="mt-2 px-3 py-1 bg-[#c8f560] text-[#312042] rounded-lg text-xs font-bold"
                        >
                          Buka Review ({pendingReleases.length})
                        </button>
                      )}
                    </div>
                  ) : (
                    approvedReleases.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedRelease(item)}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer space-y-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.coverUrl}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="font-semibold text-xs text-white truncate">{item.title}</h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 bg-[#c8f560] text-[#312042]">
                                ✓ Approved
                              </span>
                            </div>
                            <p className="text-[11px] text-white/70 truncate mt-0.5">
                              {item.artist} • {item.genre}
                            </p>
                          </div>
                        </div>

                        <div
                          className="flex items-center justify-end gap-2 pt-2 border-t border-white/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedRelease(item)}
                            className="flex-1 py-1 px-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium flex items-center justify-center gap-1"
                          >
                            <Download className="w-3 h-3 text-[#c8f560]" />
                            <span>Detail & MP3</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReleaseStatus(item.id, "Rejected")}
                            className="py-1 px-2.5 rounded-lg bg-red-500/25 border border-red-500/40 text-red-200 text-[11px] font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Overview Desktop Table (md:block) — Menampilkan 5 Rilisan Terbaru */}
                <div className="hidden md:block pt-3 flex-1 overflow-x-auto">
                  <div className="min-w-[540px]">
                    <div className="grid grid-cols-12 text-xs text-white/65 pb-3 border-b border-white/15 px-2">
                      <div className="col-span-5 font-semibold">Track & Artist</div>
                      <div className="col-span-2 text-center font-semibold">Streams</div>
                      <div className="col-span-2 text-center font-semibold">Status</div>
                      <div className="col-span-3 text-right font-semibold">Aksi & Unduh</div>
                    </div>

                    <div className="divide-y divide-white/15">
                      {approvedReleases.length === 0 ? (
                        <div className="py-10 text-center text-white/70 space-y-1">
                          <Disc3 className="w-9 h-9 mx-auto text-white/25 mb-2" />
                          <p className="font-semibold text-xs text-white">Belum Ada Rilisan yang Di-ACC</p>
                          <p className="text-[11px] text-white/55 mt-0.5">
                            {pendingReleases.length > 0
                              ? `Ada ${pendingReleases.length} lagu yang sedang dalam proses review.`
                              : "Rilisan yang disetujui (ACC) akan tampil di sini."}
                          </p>
                          {pendingReleases.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setActiveTab("releases")}
                              className="mt-2 px-3.5 py-1.5 bg-[#c8f560] text-[#312042] rounded-xl text-xs font-bold shadow"
                            >
                              Buka Review Submissions ({pendingReleases.length})
                            </button>
                          )}
                        </div>
                      ) : (
                        approvedReleases.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-12 items-center py-3.5 text-xs gap-2 hover:bg-white/5 rounded-xl px-2 transition-colors cursor-pointer"
                            onClick={() => setSelectedRelease(item)}
                          >
                            <div className="col-span-5 flex items-center gap-3 min-w-0 pr-2">
                              <img
                                src={item.coverUrl}
                                alt={item.title}
                                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/25"
                              />
                              <div className="min-w-0 truncate">
                                <p className="font-semibold text-white truncate flex items-center gap-1.5">
                                  <span>{item.title}</span>
                                  <Eye className="w-3 h-3 text-[#c8f560]" />
                                </p>
                                <p className="text-[11px] text-white/70 truncate">
                                  {item.artist} • {item.genre}
                                </p>
                              </div>
                            </div>

                            <div className="col-span-2 text-center font-semibold text-[#c8f560] whitespace-nowrap">
                              {item.streams}
                            </div>

                            <div className="col-span-2 flex justify-center">
                              <span className="px-3 py-1 rounded-full bg-[#c8f560] text-[#312042] font-semibold text-[11px] flex items-center gap-1 whitespace-nowrap">
                                <Check className="w-3 h-3" /> Approved
                              </span>
                            </div>

                            <div
                              className="col-span-3 flex items-center justify-end gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => setSelectedRelease(item)}
                                title="Buka Detail Rilis & Unduh MP3/Art"
                                className="p-1.5 rounded-lg bg-white/15 text-white hover:bg-white/25"
                              >
                                <Download className="w-3.5 h-3.5 text-[#c8f560]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReleaseStatus(item.id, "Rejected")}
                                title="Reject Release"
                                className="px-2.5 py-1 rounded-lg bg-red-500/25 border border-red-500/40 text-red-200 text-[11px] font-medium hover:bg-red-500/40"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Withdrawal Requests Approval — Menampilkan 5 Terbaru */}
              <div
                className={`lg:col-span-5 ${ROYALTY_CARD} flex flex-col justify-between animate-card-enter`}
                style={{ animationDelay: "310ms" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Withdrawal Payout Queue</h3>
                      <p className="text-[11px] text-white/70">5 antrean payout terbaru</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {withdrawals.length === 0 ? (
                      <div className="py-10 text-center text-white/70">
                        <Wallet className="w-9 h-9 mx-auto text-white/25 mb-2" />
                        <p className="font-semibold text-xs text-white">Tidak Ada Antrean Payout</p>
                        <p className="text-[11px] text-white/55 mt-0.5">Semua permintaan pencairan telah diproses.</p>
                      </div>
                    ) : (
                      withdrawals.slice(0, 5).map((w) => (
                        <div
                          key={w.id}
                          onClick={() => setSelectedWithdrawalForVisaModal(w)}
                          className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-[#312042] border border-[#c8f560]/40 flex items-center justify-center font-bold text-xs text-[#c8f560] shrink-0 overflow-hidden">
                              {w.user?.avatar ? (
                                <img
                                  src={w.user.avatar}
                                  alt={w.user.name || "Artist"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span>{(w.user?.name || "A").slice(0, 2).toUpperCase()}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate text-xs">
                                {w.accountHolder || w.user?.name || "Artist Account"}
                              </p>
                              <p className="text-[10px] text-white/70 truncate">
                                Artis: {w.user?.name || "-"}
                              </p>
                              <p className="text-[11px] text-[#c8f560] font-semibold">
                                Rp {w.amount.toLocaleString("id-ID")} • {w.method}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                w.status === "Approved"
                                  ? "bg-[#c8f560] text-[#312042]"
                                  : w.status === "Rejected"
                                  ? "bg-red-500/30 text-red-200"
                                  : "bg-[#fde08d] text-[#312042]"
                              }`}
                            >
                              {w.status}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWithdrawalForVisaModal(w);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-[#c8f560] hover:text-[#312042] text-white font-semibold text-[10px] transition-colors"
                            >
                              Detail
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-5 p-4 rounded-2xl bg-white/15 border border-white/20 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Admin Session Active</p>
                    <p className="text-[11px] text-[#c8f560] font-medium">Verified Master Administrator</p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#312042] text-[#c8f560] text-[11px] font-medium border border-[#c8f560]/30">
                    Console Secure
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              ADMIN VIEWS: RELEASES MODERATION (REVIEW, MY RELEASES, MY REJECT)
             ========================================================= */}
          {(() => {
            const renderReleaseSection = (
              items: any[],
              type: "review" | "my-releases" | "my-reject",
              title: string,
              subtitle: string,
              emptyMessage: string,
              currentPage: number,
              onPageChange: (p: number) => void
            ) => {
              const paginatedItems = items.slice((currentPage - 1) * 5, currentPage * 5);
              return (
              <div className={`${ROYALTY_CARD} animate-card-enter`}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/15">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      {type === "review" ? (
                        <span className="p-1.5 rounded-lg bg-[#fde08d]/20 text-[#fde08d]">
                          <Clock className="w-4 h-4" />
                        </span>
                      ) : type === "my-releases" ? (
                        <span className="p-1.5 rounded-lg bg-[#c8f560]/20 text-[#c8f560]">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-lg bg-red-500/20 text-red-300">
                          <XCircle className="w-4 h-4" />
                        </span>
                      )}
                      <span>{title}</span>
                    </h3>
                    <p className="text-xs text-white/75 mt-0.5">{subtitle}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white">
                    Total: <strong className={type === "my-releases" ? "text-[#c8f560]" : type === "my-reject" ? "text-red-300" : "text-[#fde08d]"}>{items.length} Track</strong>
                  </span>
                </div>

                {/* MOBILE VIEW (< md): Clean Card List, No Horizontal Table Clutter, Zero Overlap */}
                <div className="md:hidden space-y-3.5 pt-2">
                  {items.length === 0 ? (
                    <div className="py-12 text-center text-white/70">
                      <Disc3 className="w-10 h-10 mx-auto text-white/25 mb-2" />
                      <p className="font-semibold text-sm text-white">{emptyMessage}</p>
                    </div>
                  ) : (
                    paginatedItems.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRelease(r)}
                        className="p-4 rounded-2xl bg-white/5 border border-white/15 hover:bg-white/10 transition-all cursor-pointer space-y-3"
                      >
                        {/* Top Row: Cover + Info + Status */}
                        <div className="flex items-start gap-3">
                          <img
                            src={r.coverUrl}
                            alt={r.title}
                            className="w-14 h-14 rounded-xl object-cover border border-white/25 shrink-0 shadow"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                                <span>{r.title}</span>
                                <Eye className="w-3.5 h-3.5 text-[#c8f560] shrink-0" />
                              </h4>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                  r.status === "Approved"
                                    ? "bg-[#c8f560] text-[#312042]"
                                    : r.status === "Rejected"
                                    ? "bg-red-500/25 border border-red-500/40 text-red-200"
                                    : "bg-[#fde08d] text-[#312042]"
                                }`}
                              >
                                {r.status === "Approved" ? "✓ Approved" : r.status === "Rejected" ? "✕ Rejected" : "⏳ Review"}
                              </span>
                            </div>
                            <p className="text-white/80 text-xs truncate mt-0.5">
                              {r.artist} • <span className="text-white/60">{r.genre}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-white/60 mt-1 font-mono">
                              <span>ISRC: <strong className="text-[#c8f560]">{r.isrc || "D-HRM-24-00109"}</strong></span>
                              <span>UPC: <strong className="text-white/90">{r.upc || "899214578101"}</strong></span>
                              <span>Rilis: <strong className="text-white/80">{r.releaseDate}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: Actions */}
                        <div
                          className="flex items-center gap-2 pt-2.5 border-t border-white/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedRelease(r)}
                            className="flex-1 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#c8f560]" />
                            <span>Detail & Unduh</span>
                          </button>

                          {r.status !== "Approved" && (
                            <button
                              type="button"
                              onClick={() => handleReleaseStatus(r.id, "Approved")}
                              className="py-2 px-3.5 rounded-xl bg-[#c8f560] text-[#312042] font-bold text-xs hover:bg-[#d8ff75] transition-colors shadow"
                            >
                              ACC
                            </button>
                          )}

                          {r.status !== "Rejected" && (
                            <button
                              type="button"
                              onClick={() => handleReleaseStatus(r.id, "Rejected")}
                              className="py-2 px-3.5 rounded-xl bg-red-500/25 hover:bg-red-500/40 border border-red-500/40 text-red-200 font-semibold text-xs transition-colors"
                            >
                              Reject
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteRelease(r.id)}
                            className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                            title="Hapus Rilisan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* DESKTOP VIEW (md:block): Spacious Table with Proper Column Widths */}
                <div className="hidden md:block overflow-x-auto pt-2">
                  <div className="min-w-[840px]">
                    {/* Table Headers */}
                    <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-wider text-white/70 pb-3 border-b border-white/20 px-3">
                      <div className="col-span-4">Track & Artis</div>
                      <div className="col-span-2 text-center">UPC Barcode</div>
                      <div className="col-span-2 text-center">ISRC Code</div>
                      <div className="col-span-2 text-center">Status</div>
                      <div className="col-span-2 text-right">Aksi & Unduh</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-white/15">
                      {items.length === 0 ? (
                        <div className="py-14 text-center text-white/70">
                          <Disc3 className="w-12 h-12 mx-auto text-white/25 mb-2" />
                          <p className="font-semibold text-base text-white">{emptyMessage}</p>
                        </div>
                      ) : (
                        paginatedItems.map((r) => (
                          <div
                            key={r.id}
                            onClick={() => setSelectedRelease(r)}
                            className="grid grid-cols-12 items-center py-3.5 px-3 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer group"
                          >
                            {/* Col 1: Track & Artis */}
                            <div className="col-span-4 flex items-center gap-3.5 min-w-0 pr-3">
                              <img
                                src={r.coverUrl}
                                alt={r.title}
                                className="w-12 h-12 rounded-xl object-cover border border-white/25 shrink-0 group-hover:scale-105 transition-transform shadow"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-white group-hover:text-[#c8f560] transition-colors truncate flex items-center gap-1.5">
                                  <span>{r.title}</span>
                                  <Eye className="w-3.5 h-3.5 text-[#c8f560] opacity-80" />
                                </p>
                                <p className="text-white/80 text-xs truncate">
                                  {r.artist} • <span className="text-white/60">{r.genre}</span>
                                </p>
                                <span className="inline-block mt-0.5 text-[10px] text-[#c8f560] font-mono font-medium">
                                  Rilis: {r.releaseDate}
                                </span>
                              </div>
                            </div>

                            {/* Col 2: UPC Barcode */}
                            <div className="col-span-2 text-center font-mono font-semibold text-white/95 text-xs whitespace-nowrap">
                              {r.upc || "899214578101"}
                            </div>

                            {/* Col 3: ISRC Code */}
                            <div className="col-span-2 text-center font-mono font-bold text-[#c8f560] text-xs whitespace-nowrap">
                              {r.isrc || "D-HRM-24-00109"}
                            </div>

                            {/* Col 4: Status */}
                            <div className="col-span-2 flex justify-center">
                              {r.status === "Approved" ? (
                                <span className="px-3 py-1 rounded-full bg-[#c8f560] text-[#312042] font-bold text-xs whitespace-nowrap shadow-sm">
                                  ✓ Approved
                                </span>
                              ) : r.status === "Rejected" ? (
                                <span className="px-3 py-1 rounded-full bg-red-500/25 border border-red-500/40 text-red-200 font-bold text-xs whitespace-nowrap shadow-sm">
                                  ✕ Rejected
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full bg-[#fde08d] text-[#312042] font-bold text-xs whitespace-nowrap shadow-sm">
                                  ⏳ Review
                                </span>
                              )}
                            </div>

                            {/* Col 5: Aksi */}
                            <div
                              className="col-span-2 flex items-center justify-end gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => setSelectedRelease(r)}
                                className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center gap-1 text-[11px] font-semibold transition-colors"
                                title="Buka Detail Rilis Lengkap & Unduh MP3/Art"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#c8f560]" />
                                <span>Detail</span>
                              </button>

                              {r.status !== "Approved" && (
                                <button
                                  type="button"
                                  onClick={() => handleReleaseStatus(r.id, "Approved")}
                                  className="px-2.5 py-1.5 rounded-xl bg-[#c8f560] text-[#312042] font-bold text-[11px] hover:bg-[#d8ff75] transition-colors shadow"
                                  title="Setujui Rilis Ini (ACC)"
                                >
                                  ACC
                                </button>
                              )}

                              {r.status !== "Rejected" && (
                                <button
                                  type="button"
                                  onClick={() => handleReleaseStatus(r.id, "Rejected")}
                                  className="px-2.5 py-1.5 rounded-xl bg-red-500/25 border border-red-500/40 text-red-200 font-bold text-[11px] hover:bg-red-500/40 shadow transition-colors"
                                  title="Tolak Rilis Ini (Reject)"
                                >
                                  Reject
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDeleteRelease(r.id)}
                                className="p-1.5 rounded-xl bg-red-500/25 hover:bg-red-500/40 text-white transition-colors"
                                title="Hapus Rilisan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Pagination Controls (5 item per halaman) */}
                <Pagination
                  currentPage={currentPage}
                  totalItems={items.length}
                  pageSize={5}
                  onPageChange={onPageChange}
                />
              </div>
            );
          };

            if (activeTab === "releases") {
              return renderReleaseSection(
                pendingReleases,
                "review",
                "Review Submissions — Antrean Lagu Menunggu Moderasi",
                "Daftar lagu yang baru disubmit user dan menunggu verifikasi / ACC sebelum dirilis ke DSP.",
                "Tidak ada lagu yang sedang menunggu review. Semua sudah di-ACC atau ditolak.",
                pageReleases,
                setPageReleases
              );
            }

            if (activeTab === "my-releases") {
              return renderReleaseSection(
                approvedReleases,
                "my-releases",
                "My Releases — Lagu Terverifikasi & Live DSP",
                "Daftar seluruh rilisan musik yang sudah disetujui (ACC) dan aktif terdistribusi ke Spotify, Apple Music, TikTok, dsb.",
                "Belum ada rilisan yang di-ACC. Silakan tinjau lagu baru di menu Review Submissions.",
                pageMyReleases,
                setPageMyReleases
              );
            }

            if (activeTab === "my-reject") {
              return renderReleaseSection(
                rejectedReleases,
                "my-reject",
                "My Reject — Rilisan Ditolak / Perlu Revisi",
                "Daftar lagu yang ditolak karena masalah hak cipta, metadata, atau audio. Anda dapat meng-ACC ulang jika user telah merevisi.",
                "Tidak ada rilisan yang ditolak.",
                pageMyReject,
                setPageMyReject
              );
            }

            return null;
          })()}

          {/* =========================================================
              ADMIN VIEW: UPLOAD & KELOLA KATALOG MUSIK (MUNCUL KE USER)
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
                    <span>Daftar Katalog Musik</span>
                  </h2>
                  <p className="text-xs text-white/75 mt-1">
                    Daftar seluruh lagu musisi yang terdaftar dalam katalog distribusi BREAKOUT.ID. (Form unggah lagu hanya tersedia di akun Artis / User)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-2 rounded-xl bg-[#c8f560]/20 border border-[#c8f560]/40 text-[#c8f560] text-xs font-bold">
                    {catalogs.length} Lagu Terdaftar
                  </span>
                </div>
              </div>

              {/* Table of Catalog Items in Admin */}
              <div className={`${ROYALTY_CARD} overflow-hidden p-0 border border-white/20`}>
                <div className="p-4 border-b border-white/15 flex flex-wrap items-center justify-between gap-3 bg-[#312042]/30">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={catSearch}
                      onChange={(e) => {
                        setCatSearch(e.target.value);
                        setPageCatalog(1);
                      }}
                      placeholder="Cari lagu di katalog (Song ID, Judul, Artis, Publisher)..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#c8f560]"
                    />
                  </div>
                  {(() => {
                    const filteredCatalogs = catalogs.filter(
                      (c) =>
                        !catSearch ||
                        c.songId?.toLowerCase().includes(catSearch.toLowerCase()) ||
                        c.title?.toLowerCase().includes(catSearch.toLowerCase()) ||
                        c.artist?.toLowerCase().includes(catSearch.toLowerCase()) ||
                        c.publisher?.toLowerCase().includes(catSearch.toLowerCase())
                    );
                    return (
                      <span className="text-xs text-white/70">
                        Menampilkan{" "}
                        <strong className="text-white">
                          {filteredCatalogs.length}
                        </strong>{" "}
                        lagu
                      </span>
                    );
                  })()}
                </div>

                {(() => {
                  const filteredCatalogs = catalogs.filter(
                    (c) =>
                      !catSearch ||
                      c.songId?.toLowerCase().includes(catSearch.toLowerCase()) ||
                      c.title?.toLowerCase().includes(catSearch.toLowerCase()) ||
                      c.artist?.toLowerCase().includes(catSearch.toLowerCase()) ||
                      c.publisher?.toLowerCase().includes(catSearch.toLowerCase())
                  );
                  const paginatedCatalogs = filteredCatalogs.slice((pageCatalog - 1) * 5, pageCatalog * 5);

                  return (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-white">
                          <thead className="bg-[#312042]/60 border-b border-white/15 text-[11px] uppercase tracking-wider text-white/75">
                            <tr>
                              <th className="py-3 px-4 font-semibold">SONG ID</th>
                              <th className="py-3 px-4 font-semibold">JUDUL LAGU</th>
                              <th className="py-3 px-4 font-semibold">VOKAL / ARTIS</th>
                              <th className="py-3 px-4 font-semibold">PUBLISHER</th>
                              <th className="py-3 px-4 font-semibold">STATUS / AKTIF</th>
                              <th className="py-3 px-4 font-semibold text-center">LINK YT / DRIVE</th>
                              <th className="py-3 px-4 font-semibold text-right">AKSI</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {paginatedCatalogs.map((c) => (
                              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-3 px-4 font-mono font-bold text-[#c8f560] whitespace-nowrap">
                                  {c.songId}
                                </td>
                                <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                                  {c.title}
                                </td>
                                <td className="py-3 px-4 text-white/90 whitespace-nowrap">
                                  {c.artist}
                                </td>
                                <td className="py-3 px-4 text-white/80 whitespace-nowrap">
                                  {c.publisher}
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCatalogStatus(c.id, c.status)}
                                    title="Klik untuk mengubah status"
                                    className={`px-3 py-0.5 rounded-full font-bold text-[10px] transition-all ${
                                      c.status === "Aktif"
                                        ? "bg-[#c8f560] text-[#312042] hover:bg-[#b0dc4c]"
                                        : c.status === "Review"
                                        ? "bg-[#fde08d] text-[#312042]"
                                        : "bg-white/20 text-white"
                                    }`}
                                  >
                                    {c.status}
                                  </button>
                                </td>
                                <td className="py-3 px-4 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {c.youtubeLink ? (
                                      <a
                                        href={c.youtubeLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-2 py-0.5 rounded bg-red-600/80 hover:bg-red-600 text-white font-bold text-[10px] flex items-center gap-1"
                                      >
                                        <Youtube className="w-3 h-3" />
                                        <span>YT</span>
                                      </a>
                                    ) : (
                                      <span className="text-[10px] text-white/40">-</span>
                                    )}
                                    {c.driveLink ? (
                                      <a
                                        href={c.driveLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-2 py-0.5 rounded bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1"
                                      >
                                        <HardDrive className="w-3 h-3" />
                                        <span>Drive</span>
                                      </a>
                                    ) : (
                                      <span className="text-[10px] text-white/40">-</span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCatalog(c.id)}
                                    title="Hapus lagu dari katalog"
                                    className="p-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-4">
                        <Pagination
                          currentPage={pageCatalog}
                          totalItems={filteredCatalogs.length}
                          pageSize={5}
                          onPageChange={setPageCatalog}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* =========================================================
              ADMIN VIEW CMS: WEB CMS LANDING PAGE MANAGER
             ========================================================= */}
          {activeTab === "cms" && (
            <AdminLandingCMS showNotice={showNotice} />
          )}

          {activeTab === "royalty-input" && (
            <div className="space-y-6 animate-card-enter">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Input Data Royalty & Streaming ke Akun User
                  </h2>
                  <p className="text-xs text-white/75 mt-0.5">
                    Update saldo royalty balance, royalty pending, dan total streams langsung ke profil artis
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Form Input */}
                <form
                  onSubmit={handleSaveUserRoyalty}
                  className={`lg:col-span-7 ${ROYALTY_CARD} space-y-4`}
                >
                  <div className="pb-3 border-b border-white/15 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#c8f560]" />
                      <span>Form Update Royalty & Streaming User</span>
                    </span>
                    <span className="text-[10px] text-[#c8f560] font-semibold">
                      DIRECT PRISMA SYNC
                    </span>
                  </div>

                  {/* Pilih User / Artis Tujuan (Hanya yang sudah ACC & Tanpa Email) */}
                  <div>
                    <label className="block text-white/80 text-xs font-semibold mb-1">
                      Pilih Akun Artis (Hanya yang Memiliki Rilisan Lagu ACC):
                    </label>
                    <select
                      value={selectedUserForRoyalty}
                      onChange={(e) => handleSelectUserChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs font-bold focus:outline-none focus:border-[#c8f560]"
                    >
                      {approvedArtists.length === 0 ? (
                        <option value="" disabled className="bg-[#312042]">
                          Belum ada artis dengan lagu yang berstatus ACC
                        </option>
                      ) : (
                        approvedArtists.map((u) => (
                          <option key={u.id} value={u.id} className="bg-[#312042]">
                            {getArtistDisplayName(u)}
                          </option>
                        ))
                      )}
                    </select>
                    <p className="text-[10px] text-white/60 mt-1">
                      *Menampilkan hanya nama panggung / profil artis yang rilisannya telah disetujui (ACC).
                    </p>
                  </div>

                  {/* Kalkulator Potongan Royalti Otomatis (%) */}
                  <div className="p-4 rounded-2xl bg-black/25 border border-white/15 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-bold text-[#c8f560] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Kalkulator Potongan Royalti (%)
                      </span>
                      <span className="text-[10px] text-white/60">
                        Otomatis Memotong Saldo Bersih
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* 1. Nominal Royalti Kotor */}
                      <div>
                        <label className="block text-white/80 font-medium mb-1">
                          Nominal Royalti Kotor (Gross Rp)
                        </label>
                        <div className="flex items-center px-3.5 py-2 rounded-xl bg-white/15 border border-white/25 focus-within:border-[#c8f560]">
                          <span className="text-[#c8f560] font-bold text-xs mr-2">Rp</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="100.000"
                            value={formatNumberWithDots(grossRoyaltyInput)}
                            onChange={(e) => {
                              const val = parseFormattedNumber(e.target.value);
                              updateRoyaltyCalc(val, cutPercentage);
                            }}
                            className="w-full bg-transparent text-white font-bold text-sm focus:outline-none placeholder-white/40"
                          />
                        </div>
                      </div>

                      {/* 2. Potongan Persen */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-white/80 font-medium">
                            Potongan Royalti Label (%)
                          </label>
                          <span className="text-[10px] text-[#c8f560] font-semibold">
                            {cutPercentage}% Terpotong
                          </span>
                        </div>
                        <div className="flex items-center px-3.5 py-2 rounded-xl bg-white/15 border border-white/25 focus-within:border-[#c8f560]">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="30"
                            value={cutPercentage === 0 ? "" : cutPercentage}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              updateRoyaltyCalc(grossRoyaltyInput, val);
                            }}
                            className="w-full bg-transparent text-white font-bold text-sm focus:outline-none placeholder-white/40"
                          />
                          <span className="text-white/70 font-bold text-xs ml-1">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Preset Tombol Cepat Gross & Persen */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-white/60 text-[10px]">Pilih %:</span>
                        {[0, 10, 20, 30, 50, 70].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => updateRoyaltyCalc(grossRoyaltyInput, pct)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
                              cutPercentage === pct
                                ? "bg-[#c8f560] text-[#312042]"
                                : "bg-white/15 hover:bg-white/25 text-white"
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-white/60 text-[10px]">Nominal:</span>
                        {[100000, 500000, 1000000, 5000000].map((bonus) => (
                          <button
                            key={bonus}
                            type="button"
                            onClick={() => updateRoyaltyCalc(bonus, cutPercentage)}
                            className="px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-[10px] font-medium text-white transition-colors"
                          >
                            Rp {(bonus / 1000).toLocaleString("id-ID")}K
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rincian Potongan Live Card */}
                    <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-white/60 block">Nominal Kotor:</span>
                        <span className="font-semibold text-white">
                          Rp {grossRoyaltyInput.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-red-300 block">
                          Potongan ({cutPercentage}%):
                        </span>
                        <span className="font-semibold text-red-300">
                          - Rp {Math.round(grossRoyaltyInput * (cutPercentage / 100)).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#c8f560] font-bold block">
                          Saldo Bersih Artis (Net):
                        </span>
                        <span className="font-extrabold text-sm text-[#c8f560]">
                          Rp {Math.max(0, grossRoyaltyInput - Math.round(grossRoyaltyInput * (cutPercentage / 100))).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-white/75 mb-1">
                        Royalty Balance Bersih (Rp)
                      </label>
                      <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 focus-within:border-[#c8f560]">
                        <span className="text-[#c8f560] font-bold text-xs mr-2">Rp</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={formatNumberWithDots(inputRoyaltyBalance)}
                          onChange={(e) => setInputRoyaltyBalance(parseFormattedNumber(e.target.value))}
                          className="w-full bg-transparent text-white font-bold text-sm focus:outline-none placeholder-white/40"
                        />
                      </div>
                      <span className="text-[10px] text-[#c8f560]">Saldo bersih siap ditarik</span>
                    </div>

                    <div>
                      <label className="block text-white/75 mb-1">
                        Royalty Pending (Rp)
                      </label>
                      <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 focus-within:border-[#c8f560]">
                        <span className="text-[#c8f560] font-bold text-xs mr-2">Rp</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={formatNumberWithDots(inputRoyaltyPending)}
                          onChange={(e) => setInputRoyaltyPending(parseFormattedNumber(e.target.value))}
                          className="w-full bg-transparent text-white font-bold text-sm focus:outline-none placeholder-white/40"
                        />
                      </div>
                      <span className="text-[10px] text-white/60">Royalti berjalan</span>
                    </div>

                    <div>
                      <label className="block text-white/75 mb-1">
                        Total Streams (Angka)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={formatNumberWithDots(inputTotalStreams)}
                        onChange={(e) => setInputTotalStreams(parseFormattedNumber(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white font-bold text-sm focus:outline-none focus:border-[#c8f560] placeholder-white/40"
                      />
                      <span className="text-[10px] text-[#c8f560]">
                        Format: {inputTotalStreams >= 1000 ? `${(inputTotalStreams / 1000).toFixed(0)}K` : inputTotalStreams}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const net = Math.max(0, grossRoyaltyInput - Math.round(grossRoyaltyInput * (cutPercentage / 100)));
                        const curr = users.find((u) => u.id === selectedUserForRoyalty);
                        const curBal = Number(curr?.royaltyBalance || 0);
                        setInputRoyaltyBalance(curBal + net);
                        showNotice(`+Rp ${net.toLocaleString("id-ID")} ditambahkan ke saldo berjalan artis!`);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>+ Tambah ke Saldo Berjalan</span>
                    </button>

                    <button
                      type="submit"
                      disabled={savingRoyalty || !selectedUserForRoyalty}
                      className="px-6 py-2.5 rounded-xl bg-[#c8f560] hover:opacity-90 text-[#312042] font-bold text-xs flex items-center gap-2 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {savingRoyalty
                          ? "Menyimpan..."
                          : `Input Saldo Rp ${inputRoyaltyBalance.toLocaleString("id-ID")}`}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Right Column: Ringkasan Artis Saat Ini */}
                <div className={`lg:col-span-5 ${ROYALTY_CARD} flex flex-col justify-between`}>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3">
                      Data Artis Terpilih Saat Ini
                    </h3>
                    {(() => {
                      const curr = users.find((u) => u.id === selectedUserForRoyalty);
                      if (!curr) return <p className="text-xs text-white/70">Pilih artis dengan rilisan ACC</p>;
                      const accSongsCount = approvedReleases.filter((r) => r.userId === curr.id).length;
                      return (
                        <div className="space-y-3 text-xs">
                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10">
                            <img
                              src={
                                curr.avatar ||
                                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                              }
                              alt={getArtistDisplayName(curr)}
                              className="w-12 h-12 rounded-full object-cover border border-white/20"
                            />
                            <div>
                              <p className="font-bold text-white text-base">{getArtistDisplayName(curr)}</p>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-[#312042] text-[#c8f560] text-[10px] font-bold">
                                {accSongsCount} Lagu Rilis ACC • Terverifikasi
                              </span>
                            </div>
                          </div>

                          {/* Live Calculation Preview Card */}
                          <div className="p-3 rounded-xl bg-black/20 border border-white/10 space-y-1.5 text-xs">
                            <div className="flex justify-between text-white/70">
                              <span>Nominal Kotor:</span>
                              <span className="font-semibold text-white">Rp {grossRoyaltyInput.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between text-red-300">
                              <span>Potongan ({cutPercentage}%):</span>
                              <span className="font-semibold">- Rp {Math.round(grossRoyaltyInput * (cutPercentage / 100)).toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between text-[#c8f560] font-bold pt-1 border-t border-white/10">
                              <span>Saldo Bersih yang Masuk:</span>
                              <span>Rp {inputRoyaltyBalance.toLocaleString("id-ID")}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="p-3 rounded-xl bg-white/10">
                              <p className="text-white/60 text-[10px]">Saldo di Akun Saat Ini</p>
                              <p className="font-bold text-base text-[#c8f560]">
                                Rp {Number(curr.royaltyBalance || 0).toLocaleString("id-ID")}
                              </p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/10">
                              <p className="text-white/60 text-[10px]">Total Streams</p>
                              <p className="font-bold text-base text-white">
                                {(Number(curr.totalStreams) / 1000).toFixed(0)}K
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/15 text-[11px] text-white/75">
                    💡 Perubahan saldo dan streams langsung otomatis tampil di halaman User Dashboard saat artis login.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              ADMIN VIEW: INBOX & KIRIM PESAN KE USER / ALL USERS
             ========================================================= */}
          {activeTab === "inbox" && (
            <div className="space-y-6 animate-card-enter">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Pusat Pesan & Broadcast Inbox
                  </h2>
                  <p className="text-xs text-white/75 mt-0.5">
                    Kirim pesan/pengumuman ke semua artis sekaligus atau ke salah satu artis tertentu
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Form Kirim Pesan */}
                <form
                  onSubmit={handleSendMessage}
                  className={`lg:col-span-5 ${ROYALTY_CARD} space-y-4`}
                >
                  <div className="pb-3 border-b border-white/15 flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#c8f560]" />
                    <h3 className="text-sm font-semibold text-white">Kirim Pesan Baru</h3>
                  </div>

                  <div>
                    <label className="block text-white/75 text-xs mb-1">
                      Penerima Pesan:
                    </label>
                    <select
                      value={msgTargetUser}
                      onChange={(e) => setMsgTargetUser(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs font-semibold focus:outline-none focus:border-[#c8f560]"
                    >
                      <option value="ALL" className="bg-[#312042] font-bold text-[#c8f560]">
                        📢 Broadcast ke SEMUA User (All Artists)
                      </option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id} className="bg-[#312042]">
                          👤 {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/75 text-xs mb-1">
                      Judul / Subjek Pesan:
                    </label>
                    <input
                      type="text"
                      required
                      value={msgTitle}
                      onChange={(e) => setMsgTitle(e.target.value)}
                      placeholder="Contoh: Rilisan Anda telah disetujui & live di Spotify!"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#c8f560]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/75 text-xs mb-1">
                      Isi Pesan:
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={msgContent}
                      onChange={(e) => setMsgContent(e.target.value)}
                      placeholder="Tulis pesan lengkap di sini..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#c8f560]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingMsg}
                    className="w-full py-3 rounded-xl bg-[#c8f560] hover:opacity-90 text-[#312042] font-bold text-xs flex items-center justify-center gap-2 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingMsg ? "Mengirim..." : "Kirim Pesan Sekarang"}</span>
                  </button>
                </form>

                {/* Riwayat Pesan Terkirim */}
                <div className={`lg:col-span-7 ${ROYALTY_CARD} flex flex-col`}>
                  <div className="pb-3 border-b border-white/15 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      Riwayat Pesan Terkirim ({messages.length})
                    </h3>
                  </div>

                  <div className="pt-3 divide-y divide-white/15 overflow-y-auto max-h-[460px] text-xs">
                    {messages.length === 0 ? (
                      <p className="text-white/60 py-8 text-center">
                        Belum ada pesan yang terkirim.
                      </p>
                    ) : (
                      messages.map((m) => (
                        <div key={m.id} className="py-3.5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white text-sm">
                              {m.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/60">
                                {new Date(m.createdAt).toLocaleDateString("id-ID")}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(m.id)}
                                className="p-1 rounded text-red-300 hover:text-red-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-white/80 whitespace-pre-wrap">{m.content}</p>

                          <div className="pt-1 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] text-[#c8f560] font-medium">
                              Tujuan: {m.user ? `${m.user.name} (${m.user.email})` : "Semua Artis (Broadcast)"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              ADMIN VIEW 3: WITHDRAWALS MANAGEMENT
             ========================================================= */}
          {activeTab === "withdrawals" && (() => {
            const pendingWithdrawals = withdrawals.filter((w) => w.status === "Pending");
            const approvedWithdrawals = withdrawals.filter((w) => w.status === "Approved");
            const rejectedWithdrawals = withdrawals.filter((w) => w.status === "Rejected");

            const currentWithdrawals =
              withdrawalTab === "Pending"
                ? pendingWithdrawals
                : withdrawalTab === "Approved"
                ? approvedWithdrawals
                : withdrawalTab === "Rejected"
                ? rejectedWithdrawals
                : withdrawals;

            const paginatedWithdrawals = currentWithdrawals.slice(
              (pageWithdrawals - 1) * 5,
              pageWithdrawals * 5
            );

            return (
              <div className={`${ROYALTY_CARD} animate-card-enter space-y-4`}>
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/15">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#c8f560]/20 text-[#c8f560]">
                        <Wallet className="w-5 h-5" />
                      </span>
                      <span>Artist Royalty Withdrawal Requests</span>
                    </h3>
                    <p className="text-xs text-white/75 mt-0.5">
                      Kelola dan verifikasi pembayaran transfer royalti artis (BCA, Mandiri, BRI, BNI, OVO, GoPay, DANA)
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white">
                    Total Permintaan: <strong className="text-[#c8f560]">{withdrawals.length}</strong>
                  </span>
                </div>

                {/* Sub-tabs: Pending, Approved, Rejected, All */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                  {/* TAB 1: PENDING (MENUNGGU ACC) */}
                  <button
                    type="button"
                    onClick={() => {
                      setWithdrawalTab("Pending");
                      setPageWithdrawals(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                      withdrawalTab === "Pending"
                        ? "bg-[#fde08d] text-[#312042] shadow-md ring-2 ring-[#fde08d]/50 font-extrabold scale-102"
                        : "bg-white/10 hover:bg-white/15 text-white/90 border border-white/15"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Menunggu ACC (Pending)</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        withdrawalTab === "Pending"
                          ? "bg-[#312042] text-[#fde08d]"
                          : "bg-[#fde08d]/25 text-[#fde08d]"
                      }`}
                    >
                      {pendingWithdrawals.length}
                    </span>
                  </button>

                  {/* TAB 2: APPROVED (SUDAH DI-ACC) */}
                  <button
                    type="button"
                    onClick={() => {
                      setWithdrawalTab("Approved");
                      setPageWithdrawals(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                      withdrawalTab === "Approved"
                        ? "bg-[#c8f560] text-[#312042] shadow-md ring-2 ring-[#c8f560]/50 font-extrabold scale-102"
                        : "bg-white/10 hover:bg-white/15 text-white/90 border border-white/15"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Disetujui (Approved)</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        withdrawalTab === "Approved"
                          ? "bg-[#312042] text-[#c8f560]"
                          : "bg-[#c8f560]/25 text-[#c8f560]"
                      }`}
                    >
                      {approvedWithdrawals.length}
                    </span>
                  </button>

                  {/* TAB 3: REJECTED (DITOLAK) */}
                  <button
                    type="button"
                    onClick={() => {
                      setWithdrawalTab("Rejected");
                      setPageWithdrawals(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                      withdrawalTab === "Rejected"
                        ? "bg-red-500 text-white shadow-md ring-2 ring-red-400/50 font-extrabold scale-102"
                        : "bg-white/10 hover:bg-white/15 text-white/90 border border-white/15"
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Ditolak (Rejected)</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        withdrawalTab === "Rejected"
                          ? "bg-[#312042] text-red-200"
                          : "bg-red-500/25 text-red-200"
                      }`}
                    >
                      {rejectedWithdrawals.length}
                    </span>
                  </button>

                  {/* TAB 4: SEMUA (ALL) */}
                  <button
                    type="button"
                    onClick={() => {
                      setWithdrawalTab("All");
                      setPageWithdrawals(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                      withdrawalTab === "All"
                        ? "bg-white text-[#312042] shadow-md ring-2 ring-white/50 font-extrabold scale-102"
                        : "bg-white/10 hover:bg-white/15 text-white/90 border border-white/15"
                    }`}
                  >
                    <span>Semua Payout</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        withdrawalTab === "All"
                          ? "bg-[#312042] text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {withdrawals.length}
                    </span>
                  </button>
                </div>

                {/* List Container */}
                <div className="divide-y divide-white/15 text-xs pt-1">
                  {currentWithdrawals.length === 0 ? (
                    <div className="py-14 text-center text-white/70">
                      {withdrawalTab === "Pending" ? (
                        <>
                          <CheckCircle2 className="w-12 h-12 mx-auto text-[#c8f560] mb-2" />
                          <p className="font-semibold text-base text-white">Semua Payout Sudah Diproses!</p>
                          <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto">
                            Tidak ada antrean payout pending. Semua permintaan withdraw musisi sudah di-ACC atau ditolak.
                          </p>
                        </>
                      ) : withdrawalTab === "Approved" ? (
                        <>
                          <Wallet className="w-12 h-12 mx-auto text-[#c8f560]/40 mb-2" />
                          <p className="font-semibold text-base text-white">Belum Ada Payout yang Disetujui</p>
                          <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto">
                            Permintaan penarikan yang telah Anda transfer & ACC akan tercatat di sini.
                          </p>
                        </>
                      ) : withdrawalTab === "Rejected" ? (
                        <>
                          <XCircle className="w-12 h-12 mx-auto text-red-300/40 mb-2" />
                          <p className="font-semibold text-base text-white">Tidak Ada Payout yang Ditolak</p>
                          <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto">
                            Semua pencairan dana berjalan lancar tanpa ada permintaan yang ditolak.
                          </p>
                        </>
                      ) : (
                        <>
                          <Wallet className="w-12 h-12 mx-auto text-white/25 mb-2" />
                          <p className="font-semibold text-base text-white">Belum Ada Permintaan Payout</p>
                          <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto">
                            Permintaan pencairan royalti dari artis akan muncul di sini.
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    paginatedWithdrawals.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => setSelectedWithdrawalForVisaModal(w)}
                        className="py-3.5 px-4 my-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/10 bg-white/5 border border-white/10 rounded-2xl transition-all cursor-pointer group"
                      >
                        {/* Left: User Profile Avatar Logo + Name + Amount */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#312042] to-[#483363] border border-[#c8f560]/40 flex items-center justify-center font-bold text-sm text-[#c8f560] shadow-sm shrink-0 overflow-hidden">
                            {w.user?.avatar ? (
                              <img
                                src={w.user.avatar}
                                alt={w.user.name || "Artist"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{(w.user?.name || "A").slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white group-hover:text-[#c8f560] transition-colors truncate">
                                {w.accountHolder || w.user?.name || "Artist Account"}
                              </h4>
                              <span className="text-[10px] text-white/50">{w.date}</span>
                            </div>
                            <p className="text-[11px] text-white/70 truncate">
                              Artis: {w.user?.name || "-"} • No. Rek: <span className="font-mono text-white/90">{w.accountNumber}</span>
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-bold text-sm text-[#c8f560]">
                                Rp {w.amount.toLocaleString("id-ID")}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/15 text-white/90 font-medium">
                                {w.method}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Status Badge & Detail Button */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              w.status === "Approved"
                                ? "bg-[#c8f560] text-[#312042]"
                                : w.status === "Rejected"
                                ? "bg-red-500/30 text-red-200 border border-red-500/40"
                                : "bg-[#fde08d] text-[#312042]"
                            }`}
                          >
                            {w.status === "Approved"
                              ? "✓ Approved"
                              : w.status === "Rejected"
                              ? "✕ Rejected"
                              : "⏳ Pending ACC"}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWithdrawalForVisaModal(w);
                            }}
                            className={`px-3.5 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 shadow-md transition-all ${
                              w.status === "Pending"
                                ? "bg-[#c8f560] text-[#312042] border-[#c8f560] hover:bg-[#d8ff75] animate-pulse"
                                : "bg-gradient-to-r from-[#312042] via-[#483363] to-[#312042] border-[#c8f560]/50 text-[#c8f560] hover:text-white hover:border-[#c8f560]"
                            }`}
                          >
                            <span>💳 {w.status === "Pending" ? "Periksa & ACC" : "Detail Payout"}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Payouts (5 per halaman) */}
                <Pagination
                  currentPage={pageWithdrawals}
                  totalItems={currentWithdrawals.length}
                  pageSize={5}
                  onPageChange={setPageWithdrawals}
                />
              </div>
            );
          })()}

          {/* =========================================================
              ADMIN VIEW 4: DAFTAR ARTIS DENGAN RILISAN AKTIF
             ========================================================= */}
          {activeTab === "users" && (
            <div className={`${ROYALTY_CARD} animate-card-enter`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/15">
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Daftar Artis Rilis Aktif ({releasedArtists.length})
                  </h3>
                  <p className="text-xs text-white/75">
                    Menampilkan hanya kreator dan musisi yang telah memiliki rilisan lagu resmi
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("royalty-input")}
                  className="px-3.5 py-1.5 rounded-xl bg-[#c8f560] text-[#312042] font-bold text-xs hover:bg-[#b5e050] transition-colors"
                >
                  + Input Royalty/Streams
                </button>
              </div>

              <div className="divide-y divide-white/15 text-xs">
                {releasedArtists.length === 0 ? (
                  <div className="py-12 text-center text-white/70 space-y-2">
                    <Users className="w-10 h-10 mx-auto text-white/30" />
                    <p className="font-semibold text-sm text-white">Belum Ada Artis yang Merilis Lagu</p>
                    <p className="text-xs text-white/60">
                      Hanya akun artis yang telah mengajukan/merilis lagu yang akan ditampilkan pada daftar ini.
                    </p>
                  </div>
                ) : (
                  releasedArtists.slice((pageUsers - 1) * 5, pageUsers * 5).map((u) => (
                    <div
                      key={u.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={
                            u.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                          }
                          alt={getArtistDisplayName(u)}
                          className="w-11 h-11 rounded-full object-cover border border-white/30 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-white truncate">{getArtistDisplayName(u)}</p>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#312042] text-[#c8f560] shrink-0">
                              {approvedReleases.filter(r => r.userId === u.id).length} Rilisan ACC
                            </span>
                          </div>
                          <p className="text-[#c8f560] truncate text-[11px] font-medium">Artis Terverifikasi</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 w-full sm:w-auto sm:flex sm:items-center sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        <div>
                          <p className="text-white/65 text-[10px] sm:text-[11px]">Royalty Balance</p>
                          <p className="font-bold text-xs sm:text-sm text-[#c8f560]">
                            Rp {Number(u.royaltyBalance || 0).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/65 text-[10px] sm:text-[11px]">Streams</p>
                          <p className="font-semibold text-white text-xs sm:text-sm">
                            {(Number(u.totalStreams || 0) / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-white/65 text-[10px] sm:text-[11px]">Withdrawn</p>
                          <p className="font-semibold text-white text-xs sm:text-sm">
                            Rp {Number(u.totalWithdrawn || 0).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUserForRoyalty(u.id);
                            setInputRoyaltyBalance(u.royaltyBalance || 0);
                            setInputRoyaltyPending(u.royaltyPending || 0);
                            setInputTotalStreams(u.totalStreams || 0);
                            setActiveTab("royalty-input");
                          }}
                          className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-[#c8f560] hover:text-[#312042] text-white font-semibold text-xs transition-colors"
                        >
                          Edit Royalty
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMsgTargetUser(u.id);
                            setActiveTab("inbox");
                          }}
                          className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-[#312042] text-[#c8f560] font-semibold text-xs hover:bg-[#422c58] transition-colors"
                        >
                          Kirim Pesan
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Artis */}
              <Pagination
                currentPage={pageUsers}
                totalItems={releasedArtists.length}
                pageSize={5}
                onPageChange={setPageUsers}
              />
            </div>
          )}

          {/* =========================================================
              ADMIN VIEW 5: PENGATURAN SISTEM ADMIN (Gear Icon)
             ========================================================= */}
          {activeTab === "settings" && (
            <div className={`${ROYALTY_CARD} space-y-5 animate-card-enter`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-[#c8f560]">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Pengaturan Sistem & Kebijakan Distribusi Admin
                    </h3>
                    <p className="text-xs text-white/75">
                      Konfigurasi moderasi otomatis, batas royalti, dan keamanan label BREAKOUT
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#312042] text-[#c8f560] text-xs font-semibold">
                  avelinfx@gmail.com
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {[
                  {
                    title: "Auto-Approve Verified Artists",
                    desc: "Setujui otomatis lagu baru dari artis yang sudah terverifikasi",
                    val: autoApproveVerified,
                    toggle: () => setAutoApproveVerified(!autoApproveVerified),
                  },
                  {
                    title: "Instant Bank & E-Wallet Settlement",
                    desc: "Aktifkan kliring cepat BCA, Mandiri, OVO, GoPay & DANA",
                    val: instantBankPayout,
                    toggle: () => setInstantBankPayout(!instantBankPayout),
                  },
                  {
                    title: "Strict Audio Fingerprint QC",
                    desc: "Periksa duplikasi hak cipta sebelum dikirim ke Spotify & Apple Music",
                    val: strictCopyrightCheck,
                    toggle: () => setStrictCopyrightCheck(!strictCopyrightCheck),
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={item.toggle}
                    className="p-4 rounded-2xl bg-white/10 border border-white/15 flex flex-col justify-between gap-4 cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-sm text-white">{item.title}</p>
                      <p className="text-white/70 text-[11px] mt-1">{item.desc}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-[11px] text-[#c8f560] font-medium">
                        {item.val ? "Status: Aktif" : "Status: Nonaktif"}
                      </span>
                      <div
                        className={`w-11 h-6 rounded-full p-1 transition-colors ${
                          item.val ? "bg-[#312042]" : "bg-white/25"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full transition-transform ${
                            item.val
                              ? "translate-x-5 bg-[#c8f560]"
                              : "translate-x-0 bg-white"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => showNotice("Konfigurasi sistem Admin berhasil disimpan!")}
                  className="px-6 py-3 rounded-full bg-[#312042] hover:bg-[#422c58] text-white font-semibold text-xs flex items-center gap-2 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#c8f560]" />
                  <span>Simpan Konfigurasi Admin</span>
                </button>
              </div>
            </div>
          )}
          </main>
        </div>
      </div>
    </div>
  );
}
