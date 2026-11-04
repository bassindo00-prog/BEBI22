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
  Mail,
  Send,
  Download,
  Eye,
  X,
  TrendingUp,
  DollarSign,
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
} from "lucide-react";
import VisaWithdrawalCardModal from "@/components/VisaWithdrawalCardModal";

const ROYALTY_CARD =
  "bg-[#8a88b5]/70 border border-white/20 rounded-[28px] p-6 text-white shadow-lg";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "releases" | "catalog" | "withdrawals" | "users" | "inbox" | "royalty-input" | "settings"
  >("overview");
  const [period, setPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [themeMode, setThemeMode] = useState<"Light" | "Dark">("Light");
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
  const [catPublisher, setCatPublisher] = useState("HERMES Publishing / Sony Music");
  const [catStatus, setCatStatus] = useState("Aktif");
  const [catYoutube, setCatYoutube] = useState("");
  const [catDrive, setCatDrive] = useState("");
  const [uploadingCatalog, setUploadingCatalog] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState("");
  const [catSearch, setCatSearch] = useState("");

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
      if (data.users) {
        setUsers(data.users);
        if (!selectedUserForRoyalty && data.users.length > 0) {
          const firstUser = data.users.find((u: any) => u.role !== "ADMIN") || data.users[0];
          setSelectedUserForRoyalty(firstUser.id);
          setInputRoyaltyBalance(firstUser.royaltyBalance || 0);
          setInputRoyaltyPending(firstUser.royaltyPending || 0);
          setInputTotalStreams(firstUser.totalStreams || 0);
        }
      }
      if (data.releases) setReleases(data.releases);
      if (data.withdrawals) setWithdrawals(data.withdrawals);
      if (data.catalogs) setCatalogs(data.catalogs);

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
          sender: "Admin HERMES Distribution",
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
          artist: catArtist || "HERMES Artist",
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
            artist: parts[2] || "HERMES Artist",
            publisher: parts[3] || "HERMES Publishing",
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

  // Trigger file download helper (for audio MP3/WAV and Cover Art)
  const downloadAsset = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotice(`Mengunduh file: ${filename}`);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    router.push("/login");
  };

  const pendingReleases = releases.filter((r) => r.status === "Pending");
  const approvedReleases = releases.filter((r) => r.status === "Approved");
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "Pending");
  const totalPayoutAmount = withdrawals
    .filter((w) => w.status === "Approved")
    .reduce((acc, w) => acc + Number(w.amount || 0), 0);

  const adminBatteryPct = Math.round(
    (releases.length > 0
      ? Math.max(76, Math.round((approvedReleases.length / releases.length) * 100))
      : 82) * animProgress
  );

  return (
    <div
      className={`h-screen w-full overflow-hidden flex transition-colors duration-300 ${
        themeMode === "Dark"
          ? "bg-gradient-to-br from-[#54527a] via-[#676592] to-[#46446b]"
          : "bg-gradient-to-br from-[#9493be] via-[#acabcf] to-[#8f8eb9]"
      }`}
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
                          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                          `${selectedRelease.title}-master.mp3`
                        )
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-[#312042] hover:bg-[#422c58] text-[#c8f560] border border-[#c8f560]/50 text-xs font-semibold flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Master Audio (MP3/WAV)</span>
                    </button>
                  </div>
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
                    {selectedRelease.composer || "Abdul • HERMES"}
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

              {/* Action Buttons: Approve / Hold / Close */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70">Status Sekarang:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedRelease.status === "Approved"
                        ? "bg-[#c8f560] text-[#312042]"
                        : "bg-[#fde08d] text-[#312042]"
                    }`}
                  >
                    {selectedRelease.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleReleaseStatus(selectedRelease.id, "Approved");
                      setSelectedRelease({ ...selectedRelease, status: "Approved" });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#c8f560] text-[#312042] text-xs font-bold hover:opacity-90"
                  >
                    Setujui (Approve)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleReleaseStatus(selectedRelease.id, "Pending");
                      setSelectedRelease({ ...selectedRelease, status: "Pending" });
                    }}
                    className="px-4 py-2 rounded-xl bg-white/20 text-white text-xs font-medium hover:bg-white/30"
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
        {/* MOBILE SLIDE-OUT MENU DRAWER — Muncul saat hamburger menu diklik pada layar HP */}
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
                      <span className="font-bold text-sm tracking-tight text-white block">HERMES ADMIN</span>
                      <span className="text-[10px] text-[#c8f560] font-semibold tracking-wider uppercase">Command Center</span>
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
                    { id: "overview", label: "Admin Overview", icon: Home },
                    { id: "releases", label: `Moderate Releases (${releases.length})`, icon: Disc3 },
                    { id: "catalog", label: `Kelola Katalog (${catalogs.length})`, icon: ListMusic },
                    { id: "royalty-input", label: "Input Royalty & Streams", icon: DollarSign },
                    { id: "withdrawals", label: `Payouts & VISA ACC (${withdrawals.length})`, icon: Wallet },
                    { id: "inbox", label: "Inbox & Broadcast", icon: Mail },
                    { id: "users", label: `Daftar Artis (${users.length})`, icon: Users },
                    { id: "settings", label: "Pengaturan Sistem", icon: Settings },
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

              <div className="pt-4 border-t border-white/15 space-y-2.5">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 text-[#c8f560] text-xs font-semibold hover:bg-white/25 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Lihat User View</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/30 text-white text-xs font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Keluar Akun Admin</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* LEFT SIDEBAR (DESKTOP) — Pinned & Frozen, Hidden on mobile */}
        <aside className="hidden md:flex w-[74px] sm:w-[86px] h-full shrink-0 border-r border-white/20 flex-col items-center py-6 justify-between select-none z-40 bg-[#74729f]/30 backdrop-blur-md">
          <div className="flex flex-col items-center gap-10">
            <Link
              href="/"
              title="Back to Landing Page"
              className="w-11 h-11 rounded-full border-2 border-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              <div className="w-4 h-7 rounded-full border-2 border-white" />
            </Link>

            <nav className="flex flex-col items-center gap-3.5 mt-2">
              <button
                onClick={() => setActiveTab("overview")}
                title="Admin Command Overview"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "overview"
                    ? "bg-[#312042] text-white shadow-md scale-110"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Home className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab("releases")}
                title="Moderate Releases & Unduh Track"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "releases"
                    ? "bg-[#312042] text-white shadow-md scale-110"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Disc3 className="w-4 h-4" />
              </button>

              {/* Dedicated Catalog Menu Button */}
              <button
                onClick={() => setActiveTab("catalog")}
                title="Kelola & Upload Katalog Musik"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "catalog"
                    ? "bg-[#312042] text-[#c8f560] shadow-md scale-110 ring-2 ring-[#c8f560]/40"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <ListMusic className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab("royalty-input")}
                title="Input Royalty & Streams ke User"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "royalty-input"
                    ? "bg-[#312042] text-[#c8f560] shadow-md scale-110 ring-2 ring-[#c8f560]/40"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <DollarSign className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab("withdrawals")}
                title="Approve Royalty Withdrawals"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "withdrawals"
                    ? "bg-[#312042] text-white shadow-md scale-110"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Wallet className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab("inbox")}
                title="Inbox & Kirim Pesan ke User"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                  activeTab === "inbox"
                    ? "bg-[#312042] text-[#c8f560] shadow-md scale-110 ring-2 ring-[#c8f560]/40"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Mail className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab("users")}
                title="Manage Artists & Accounts"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === "users"
                    ? "bg-[#312042] text-white shadow-md scale-110"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Users className="w-4 h-4" />
              </button>

              <div className="h-2 w-6 border-b border-white/20" />

              {/* Gear Icon -> Admin Settings */}
              <button
                onClick={() => setActiveTab("settings")}
                title="Pengaturan Sistem Admin"
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

          <div className="flex flex-col items-center gap-3">
            <Link
              href="/dashboard"
              title="Switch to User Dashboard"
              className="w-10 h-10 rounded-full bg-white/20 text-[#c8f560] hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
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
                    title="Buka Menu Admin"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <span className="text-lg sm:text-xl font-bold tracking-wide text-white flex items-center gap-2">
                    HERMES
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c8f560] text-[#312042] uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      ADMIN
                    </span>
                  </span>
                </div>

                {/* Mobile Right Quick Actions */}
                <div className="flex sm:hidden items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setThemeMode(themeMode === "Dark" ? "Light" : "Dark")}
                    className="p-1.5 rounded-full bg-[#312042] text-[#c8f560] border border-white/20"
                    title="Ganti Tema"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={fetchAdminData}
                    className="p-1.5 rounded-full bg-white/15 text-white"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                  <Link
                    href="/dashboard"
                    className="px-2.5 py-1 rounded-full bg-white/15 text-[#c8f560] text-[10px] font-bold"
                  >
                    User ↗
                  </Link>
                </div>

                {/* Quick View Switcher Bar (Desktop XL) */}
                <div className="hidden xl:flex items-center gap-1 ml-3 bg-[#8a88b5]/60 border border-white/20 p-1 rounded-full text-[11px]">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "releases", label: `Releases (${releases.length})` },
                    { id: "catalog", label: `Katalog (${catalogs.length})` },
                    { id: "royalty-input", label: "$ Input Royalty" },
                    { id: "inbox", label: "✉ Inbox" },
                    { id: "withdrawals", label: `Payouts (${withdrawals.length})` },
                    { id: "users", label: `Artists (${users.length})` },
                    { id: "settings", label: "⚙ Pengaturan" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`px-3 py-1 rounded-full transition-all ${
                        activeTab === t.id
                          ? "bg-[#312042] text-white font-medium"
                          : "text-white/85 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
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
                  onClick={fetchAdminData}
                  title="Refresh Prisma Data"
                  className="w-10 h-10 rounded-full bg-[#8a88b5]/70 border border-white/20 flex items-center justify-center text-white hover:bg-white/25"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>

                <Link
                  href="/dashboard"
                  className="px-3.5 py-2 rounded-full bg-[#8a88b5]/70 border border-white/20 hover:bg-white/25 text-white text-xs font-medium flex items-center gap-1"
                >
                  <span>User View</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#c8f560]" />
                </Link>
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
                  {Math.round(6914 * animProgress).toLocaleString()}K
                </p>
              </div>

              <div className="h-9 w-[1px] bg-white/25 hidden sm:block" />

              <div>
                <p className="text-xs text-white/80">Cleared payouts</p>
                <p className="text-2xl sm:text-3xl font-semibold text-white mt-0.5 tabular-nums">
                  ${Math.round(totalPayoutAmount * animProgress).toLocaleString()}
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
                  {users.length} Artists
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
                  +18.4% Growth
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
                    ${Math.round(12450 * animProgress).toLocaleString()}
                    <div className="w-2 h-2 bg-[#312042] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                  </div>

                  <svg viewBox="0 0 320 110" className="w-full h-28 overflow-visible">
                    <defs>
                      <linearGradient id="adminGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c8f560" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#c8f560" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
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
                  </svg>

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

              <div className="flex items-end justify-between h-32 pt-4 gap-2">
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
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="flex items-end gap-1.5 h-24">
                        <div
                          style={{
                            height: barsReady ? `${bar.h1 + wave}%` : "0%",
                            transitionDelay: `${i * 110}ms`,
                          }}
                          className={`w-2.5 rounded-full ${bar.c1} transition-all duration-1000 ease-out`}
                        />
                        <div
                          style={{
                            height: barsReady ? `${bar.h2 - wave}%` : "0%",
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
                  <h3 className="text-sm font-medium text-white">
                    Artist Release Submissions (Klik untuk Detail & Unduh)
                  </h3>
                  <button
                    onClick={() => setActiveTab("releases")}
                    className="text-xs text-[#c8f560] underline"
                  >
                    Manage All
                  </button>
                </div>

                <div className="pt-3 flex-1 overflow-x-auto">
                  <div className="min-w-[520px]">
                    <div className="grid grid-cols-12 text-xs text-white/65 pb-3 border-b border-white/15 px-2">
                      <div className="col-span-5 font-semibold">Track & Artist</div>
                      <div className="col-span-2 text-center font-semibold">Streams</div>
                      <div className="col-span-2 text-center font-semibold">Status</div>
                      <div className="col-span-3 text-right font-semibold">Aksi & Unduh</div>
                    </div>

                    <div className="divide-y divide-white/15">
                      {releases.map((item) => (
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
                            {item.status === "Approved" ? (
                              <span className="px-3 py-1 rounded-full bg-[#c8f560] text-[#312042] font-semibold text-[11px] flex items-center gap-1 whitespace-nowrap">
                                <Check className="w-3 h-3" /> Approved
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-[#fde08d] text-[#312042] font-semibold text-[11px] flex items-center gap-1 whitespace-nowrap">
                                <Clock className="w-3 h-3" /> {item.status}
                              </span>
                            )}
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
                              onClick={() => handleReleaseStatus(item.id, "Approved")}
                              title="Approve Release"
                              className="px-2.5 py-1 rounded-lg bg-[#312042] text-[#c8f560] text-[11px] font-medium hover:bg-[#422c58]"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Withdrawal Requests Approval */}
              <div
                className={`lg:col-span-5 ${ROYALTY_CARD} flex flex-col justify-between animate-card-enter`}
                style={{ animationDelay: "310ms" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white">Withdrawal Payout Queue</h3>
                    <button
                      onClick={() => setActiveTab("withdrawals")}
                      className="text-xs text-[#c8f560] underline font-medium"
                    >
                      All Payouts
                    </button>
                  </div>

                  <div className="space-y-3">
                    {withdrawals.map((w) => (
                      <div
                        key={w.id}
                        className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#c8f560]">
                              ${w.amount.toLocaleString()}
                            </span>
                            <span className="text-white/90 font-medium">• {w.method}</span>
                          </div>
                          <p className="text-[11px] text-white/70 mt-0.5">
                            {w.user?.name || "Artist"} • Acc: {w.accountNumber}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {w.status === "Pending" ? (
                            <>
                              <button
                                onClick={() => handleWithdrawalStatus(w.id, "Approved")}
                                className="px-3 py-1.5 rounded-xl bg-[#c8f560] text-[#312042] font-semibold text-[11px] hover:opacity-90"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleWithdrawalStatus(w.id, "Rejected")}
                                className="px-2.5 py-1.5 rounded-xl bg-red-500/30 border border-red-300/40 text-white font-medium text-[11px] hover:bg-red-500/45"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-[#c8f560] text-[#312042] font-semibold text-[11px]">
                              {w.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 p-4 rounded-2xl bg-white/15 border border-white/20 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Admin Session Active</p>
                    <p className="text-[11px] text-white/75">avelinfx@gmail.com • Pass: 1234</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="px-3.5 py-1.5 rounded-full bg-[#312042] text-[#c8f560] text-[11px] font-medium"
                  >
                    Open User Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              ADMIN VIEW 2: FULL RELEASES MANAGEMENT (DENGAN KLIK DETAIL & UNDUH)
             ========================================================= */}
          {activeTab === "releases" && (
            <div className={`${ROYALTY_CARD} animate-card-enter`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/15">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    All Submitted Releases — Catalog Moderation
                  </h3>
                  <p className="text-xs text-white/75">
                    Klik nama rilisan untuk melihat detail form submit user dan mengunduh MP3 / Artwork
                  </p>
                </div>
              </div>

              {/* Clean, Aligned Releases Moderation Table */}
              <div className="overflow-x-auto pt-2">
                <div className="min-w-[760px]">
                  {/* Table Headers */}
                  <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-wider text-white/70 pb-3 border-b border-white/20 px-3">
                    <div className="col-span-5">Track & Artis</div>
                    <div className="col-span-2 text-center">UPC Barcode</div>
                    <div className="col-span-2 text-center">ISRC Code</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-2 text-right">Aksi & Unduh</div>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-white/15">
                    {releases.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRelease(r)}
                        className="grid grid-cols-12 items-center py-3.5 px-3 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer group"
                      >
                        {/* Col 1: Track & Artis (Tanpa Email, Tanpa Platform) */}
                        <div className="col-span-5 flex items-center gap-3.5 min-w-0 pr-3">
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
                          {r.isrc || "ID-HRM-24-00101"}
                        </div>

                        {/* Col 4: Status */}
                        <div className="col-span-1 flex justify-center">
                          {r.status === "Approved" ? (
                            <span className="px-2.5 py-1 rounded-full bg-[#c8f560] text-[#312042] font-bold text-[10px] whitespace-nowrap">
                              ✓ Approved
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-[#fde08d] text-[#312042] font-bold text-[10px] whitespace-nowrap">
                              ⏳ {r.status}
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
                            className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center gap-1 text-[11px] font-medium transition-colors"
                            title="Buka Detail Rilis Lengkap & Unduh MP3/Art"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#c8f560]" />
                            <span>Detail</span>
                          </button>

                          {r.status !== "Approved" && (
                            <button
                              type="button"
                              onClick={() => handleReleaseStatus(r.id, "Approved")}
                              className="px-2.5 py-1.5 rounded-xl bg-[#c8f560] text-[#312042] font-bold text-[11px] hover:opacity-90 shadow"
                              title="Setujui Rilis Ini"
                            >
                              ACC
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
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    <span>Upload & Manajemen Katalog Musik</span>
                  </h2>
                  <p className="text-xs text-white/75 mt-1">
                    Upload lagu baru lengkap dengan SONG ID, Vokal/Artis, Publisher, Status, serta Tautan YouTube & Google Drive (Otomatis tampil di akun User)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkMode(!bulkMode)}
                    className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#c8f560]" />
                    <span>{bulkMode ? "Mode Form Satuan" : "Mode Upload Massal (CSV)"}</span>
                  </button>
                  <span className="px-3.5 py-2 rounded-xl bg-[#c8f560]/20 border border-[#c8f560]/40 text-[#c8f560] text-xs font-bold">
                    {catalogs.length} Lagu Terdaftar
                  </span>
                </div>
              </div>

              {/* Upload Form (Single or Bulk) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {bulkMode ? (
                  /* Bulk Upload Mode */
                  <div className={`lg:col-span-12 ${ROYALTY_CARD} space-y-4`}>
                    <div className="pb-3 border-b border-white/15 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-[#c8f560]" />
                        <span>Upload Massal Katalog Musik (Format CSV / Tab-Separated)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setBulkCsvText(
                            `HRM-ID-0201,Golden Sunrise,Abdul,HERMES Publishing,Aktif,https://youtube.com/watch?v=sample1,https://drive.google.com/sample1\nHRM-ID-0202,Echoes of Tomorrow,Sarah Lynn,Sony Music / HERMES,Aktif,https://youtube.com/watch?v=sample2,https://drive.google.com/sample2\nHRM-ID-0203,Neon Cyberpunk,Luxoa Studio,Warner Chappell,Review,https://youtube.com/watch?v=sample3,https://drive.google.com/sample3`
                          )
                        }
                        className="text-xs text-[#c8f560] underline font-medium hover:text-white"
                      >
                        Isi Contoh Format
                      </button>
                    </div>

                    <p className="text-xs text-white/70">
                      Format baris: <code className="bg-black/30 px-2 py-0.5 rounded text-[#c8f560]">SONG_ID, JUDUL_LAGU, VOKAL_ARTIS, PUBLISHER, STATUS, LINK_YT, LINK_DRIVE</code> (1 baris per lagu).
                    </p>

                    <textarea
                      rows={6}
                      value={bulkCsvText}
                      onChange={(e) => setBulkCsvText(e.target.value)}
                      placeholder="Paste baris data katalog di sini..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/15 border border-white/25 text-white font-mono text-xs placeholder:text-white/40 focus:outline-none focus:border-[#c8f560]"
                    />

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setBulkMode(false)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        disabled={uploadingCatalog}
                        onClick={handleBulkUploadCatalog}
                        className="px-6 py-2.5 rounded-xl bg-[#c8f560] hover:opacity-90 text-[#312042] font-bold text-xs flex items-center gap-2 shadow"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{uploadingCatalog ? "Mengupload..." : "Upload Semua Lagu Massal"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Single Item Form */
                  <form
                    onSubmit={handleSaveCatalog}
                    className={`lg:col-span-12 ${ROYALTY_CARD} space-y-4`}
                  >
                    <div className="pb-3 border-b border-white/15 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-[#c8f560]" />
                        <span>Form Tambah Lagu Baru ke Katalog User</span>
                      </span>
                      <span className="text-[10px] text-[#c8f560] font-semibold">
                        DIRECT USER SYNC
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                      {/* SONG ID */}
                      <div className="sm:col-span-3">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-white/75">SONG ID:</label>
                          <button
                            type="button"
                            onClick={() =>
                              setCatSongId(`HRM-ID-${Math.floor(1000 + Math.random() * 9000)}`)
                            }
                            className="text-[10px] text-[#c8f560] hover:underline"
                          >
                            Acak ID
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={catSongId}
                          onChange={(e) => setCatSongId(e.target.value)}
                          placeholder="Contoh: HRM-ID-0106"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#c8f560]"
                        />
                      </div>

                      {/* JUDUL LAGU */}
                      <div className="sm:col-span-5">
                        <label className="block text-white/75 mb-1">JUDUL LAGU:</label>
                        <input
                          type="text"
                          required
                          value={catTitle}
                          onChange={(e) => setCatTitle(e.target.value)}
                          placeholder="Masukkan judul lagu..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white font-semibold text-xs focus:outline-none focus:border-[#c8f560]"
                        />
                      </div>

                      {/* VOKAL / ARTIS */}
                      <div className="sm:col-span-4">
                        <label className="block text-white/75 mb-1">VOKAL / ARTIS:</label>
                        <input
                          type="text"
                          required
                          value={catArtist}
                          onChange={(e) => setCatArtist(e.target.value)}
                          placeholder="Nama artis / vokalis..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white font-medium text-xs focus:outline-none focus:border-[#c8f560]"
                        />
                      </div>

                      {/* PUBLISHER */}
                      <div className="sm:col-span-4">
                        <label className="block text-white/75 mb-1">PUBLISHER:</label>
                        <select
                          value={catPublisher}
                          onChange={(e) => setCatPublisher(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs font-medium focus:outline-none focus:border-[#c8f560]"
                        >
                          <option value="HERMES Publishing / Sony Music" className="bg-[#312042]">
                            HERMES Publishing / Sony Music
                          </option>
                          <option value="Luxoa Universal Songs" className="bg-[#312042]">
                            Luxoa Universal Songs
                          </option>
                          <option value="Warner Chappell Indonesia" className="bg-[#312042]">
                            Warner Chappell Indonesia
                          </option>
                          <option value="BMG Rights Management" className="bg-[#312042]">
                            BMG Rights Management
                          </option>
                          <option value="Independent / Self-Published" className="bg-[#312042]">
                            Independent / Self-Published
                          </option>
                        </select>
                      </div>

                      {/* STATUS / AKTIF */}
                      <div className="sm:col-span-2">
                        <label className="block text-white/75 mb-1">STATUS / AKTIF:</label>
                        <select
                          value={catStatus}
                          onChange={(e) => setCatStatus(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs font-semibold focus:outline-none focus:border-[#c8f560]"
                        >
                          <option value="Aktif" className="bg-[#312042]">
                            Aktif
                          </option>
                          <option value="Review" className="bg-[#312042]">
                            Review
                          </option>
                          <option value="Nonaktif" className="bg-[#312042]">
                            Nonaktif
                          </option>
                        </select>
                      </div>

                      {/* LINK YOUTUBE */}
                      <div className="sm:col-span-3">
                        <label className="block text-white/75 mb-1 flex items-center gap-1">
                          <Youtube className="w-3.5 h-3.5 text-red-400" />
                          <span>LINK YOUTUBE:</span>
                        </label>
                        <input
                          type="url"
                          value={catYoutube}
                          onChange={(e) => setCatYoutube(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs placeholder:text-white/35 focus:outline-none focus:border-[#c8f560]"
                        />
                      </div>

                      {/* LINK DRIVE */}
                      <div className="sm:col-span-3">
                        <label className="block text-white/75 mb-1 flex items-center gap-1">
                          <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                          <span>LINK GOOGLE DRIVE:</span>
                        </label>
                        <input
                          type="url"
                          value={catDrive}
                          onChange={(e) => setCatDrive(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs placeholder:text-white/35 focus:outline-none focus:border-[#c8f560]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={uploadingCatalog}
                        className="px-6 py-3 rounded-xl bg-[#c8f560] hover:opacity-90 text-[#312042] font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{uploadingCatalog ? "Mengupload..." : "+ Upload ke Katalog User"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Table of Catalog Items in Admin */}
              <div className={`${ROYALTY_CARD} overflow-hidden p-0 border border-white/20`}>
                <div className="p-4 border-b border-white/15 flex flex-wrap items-center justify-between gap-3 bg-[#312042]/30">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={catSearch}
                      onChange={(e) => setCatSearch(e.target.value)}
                      placeholder="Cari lagu di katalog (Song ID, Judul, Artis, Publisher)..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#c8f560]"
                    />
                  </div>
                  <span className="text-xs text-white/70">
                    Menampilkan{" "}
                    <strong className="text-white">
                      {
                        catalogs.filter(
                          (c) =>
                            !catSearch ||
                            c.songId?.toLowerCase().includes(catSearch.toLowerCase()) ||
                            c.title?.toLowerCase().includes(catSearch.toLowerCase()) ||
                            c.artist?.toLowerCase().includes(catSearch.toLowerCase()) ||
                            c.publisher?.toLowerCase().includes(catSearch.toLowerCase())
                        ).length
                      }
                    </strong>{" "}
                    lagu
                  </span>
                </div>

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
                      {catalogs
                        .filter(
                          (c) =>
                            !catSearch ||
                            c.songId?.toLowerCase().includes(catSearch.toLowerCase()) ||
                            c.title?.toLowerCase().includes(catSearch.toLowerCase()) ||
                            c.artist?.toLowerCase().includes(catSearch.toLowerCase()) ||
                            c.publisher?.toLowerCase().includes(catSearch.toLowerCase())
                        )
                        .map((c) => (
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
              </div>
            </div>
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
                      <DollarSign className="w-4 h-4 text-[#c8f560]" />
                      <span>Form Update Royalty & Streaming User</span>
                    </span>
                    <span className="text-[10px] text-[#c8f560] font-semibold">
                      DIRECT PRISMA SYNC
                    </span>
                  </div>

                  {/* Pilih User Tujuan */}
                  <div>
                    <label className="block text-white/75 text-xs mb-1">
                      Pilih Akun Artis / User:
                    </label>
                    <select
                      value={selectedUserForRoyalty}
                      onChange={(e) => handleSelectUserChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs font-semibold focus:outline-none focus:border-[#c8f560]"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id} className="bg-[#312042]">
                          {u.name} — {u.email} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-white/75 mb-1">
                        Royalty Balance ($)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={inputRoyaltyBalance}
                        onChange={(e) => setInputRoyaltyBalance(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white font-bold text-sm focus:outline-none focus:border-[#c8f560]"
                      />
                      <span className="text-[10px] text-white/60">Saldo siap ditarik</span>
                    </div>

                    <div>
                      <label className="block text-white/75 mb-1">
                        Royalty Pending ($)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={inputRoyaltyPending}
                        onChange={(e) => setInputRoyaltyPending(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white font-bold text-sm focus:outline-none focus:border-[#c8f560]"
                      />
                      <span className="text-[10px] text-white/60">Royalti berjalan</span>
                    </div>

                    <div>
                      <label className="block text-white/75 mb-1">
                        Total Streams (Angka)
                      </label>
                      <input
                        type="number"
                        value={inputTotalStreams}
                        onChange={(e) => setInputTotalStreams(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white font-bold text-sm focus:outline-none focus:border-[#c8f560]"
                      />
                      <span className="text-[10px] text-[#c8f560]">
                        Format: {(inputTotalStreams / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>

                  {/* Tombol Shortcut Tambah Royalti Cepat */}
                  <div className="pt-1">
                    <span className="text-[11px] text-white/70 block mb-1.5">
                      Shortcut Tambah Saldo:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[100, 250, 500, 1000].map((bonus) => (
                        <button
                          key={bonus}
                          type="button"
                          onClick={() => setInputRoyaltyBalance((prev) => prev + bonus)}
                          className="px-3 py-1 rounded-lg bg-white/15 hover:bg-[#c8f560] hover:text-[#312042] text-xs font-semibold text-white transition-colors"
                        >
                          +${bonus}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setInputTotalStreams((prev) => prev + 100000)}
                        className="px-3 py-1 rounded-lg bg-white/15 hover:bg-[#c8f560] hover:text-[#312042] text-xs font-semibold text-white transition-colors"
                      >
                        +100K Streams
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingRoyalty}
                      className="px-6 py-2.5 rounded-xl bg-[#c8f560] hover:opacity-90 text-[#312042] font-bold text-xs flex items-center gap-2 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{savingRoyalty ? "Menyimpan..." : "Simpan ke User Ini"}</span>
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
                      if (!curr) return <p className="text-xs text-white/70">Pilih artis</p>;
                      return (
                        <div className="space-y-3 text-xs">
                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10">
                            <img
                              src={
                                curr.avatar ||
                                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                              }
                              alt={curr.name}
                              className="w-12 h-12 rounded-full object-cover border border-white/20"
                            />
                            <div>
                              <p className="font-bold text-white text-sm">{curr.name}</p>
                              <p className="text-white/70 text-[11px]">{curr.email}</p>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-[#312042] text-[#c8f560] text-[10px] font-bold">
                                {curr.role}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="p-3 rounded-xl bg-white/10">
                              <p className="text-white/60 text-[10px]">Saldo Royalti</p>
                              <p className="font-bold text-base text-[#c8f560]">
                                ${Number(curr.royaltyBalance).toLocaleString()}
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
          {activeTab === "withdrawals" && (
            <div className={`${ROYALTY_CARD} animate-card-enter`}>
              <h3 className="text-base font-semibold text-white mb-1">
                Artist Royalty Withdrawal Requests
              </h3>
              <p className="text-xs text-white/75 mb-4 pb-3 border-b border-white/15">
                Approve bank & e-wallet payouts (BCA, Mandiri, OVO, GoPay, DANA)
              </p>

              <div className="divide-y divide-white/15 text-xs">
                {withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="py-4 flex flex-wrap items-center justify-between gap-4 hover:bg-white/5 rounded-2xl px-3 transition-colors"
                  >
                    <div
                      onClick={() => setSelectedWithdrawalForVisaModal(w)}
                      className="cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-[#c8f560] group-hover:underline">
                          ${w.amount.toLocaleString()} — {w.method}
                        </p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white/90">
                          Klik untuk Detail Rekening
                        </span>
                      </div>
                      <p className="text-white/75 mt-0.5 font-mono">
                        No. Rek: <span className="font-bold text-white">{w.accountNumber}</span> • Requested on {w.date} by{" "}
                        <span className="font-semibold text-white">
                          {w.user?.name || "Artist"} ({w.user?.email})
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-3.5 py-1 rounded-full font-semibold ${
                          w.status === "Approved"
                            ? "bg-[#c8f560] text-[#312042]"
                            : "bg-[#fde08d] text-[#312042]"
                        }`}
                      >
                        {w.status}
                      </span>

                      {/* Prominent VISA Card ACC button */}
                      <button
                        type="button"
                        onClick={() => setSelectedWithdrawalForVisaModal(w)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#312042] via-[#483363] to-[#312042] border border-[#c8f560]/50 text-[#c8f560] font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
                      >
                        <span>💳 Buka Kartu VISA & ACC</span>
                      </button>

                      {w.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleWithdrawalStatus(w.id, "Approved")}
                            className="px-3.5 py-1.5 rounded-xl bg-[#312042] text-[#c8f560] font-medium hover:bg-[#422c58]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleWithdrawalStatus(w.id, "Rejected")}
                            className="px-3 py-1.5 rounded-xl bg-red-500/30 text-white font-medium hover:bg-red-500/45"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              ADMIN VIEW 4: USERS & ROYALTY BALANCE MANAGEMENT
             ========================================================= */}
          {activeTab === "users" && (
            <div className={`${ROYALTY_CARD} animate-card-enter`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/15">
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Registered Artists & Administrators
                  </h3>
                  <p className="text-xs text-white/75">
                    Manage accounts stored in Prisma SQLite database
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("royalty-input")}
                  className="px-3.5 py-1.5 rounded-xl bg-[#c8f560] text-[#312042] font-bold text-xs"
                >
                  + Input Royalty/Streams
                </button>
              </div>

              <div className="divide-y divide-white/15 text-xs">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="py-4 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          u.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                        }
                        alt={u.name}
                        className="w-11 h-11 rounded-full object-cover border border-white/30"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-white">{u.name}</p>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              u.role === "ADMIN"
                                ? "bg-[#312042] text-[#c8f560]"
                                : "bg-white/20 text-white"
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>
                        <p className="text-white/75">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-white/65 text-[11px]">Royalty Balance</p>
                        <p className="font-bold text-sm text-[#c8f560]">
                          ${Number(u.royaltyBalance).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/65 text-[11px]">Streams</p>
                        <p className="font-semibold text-white">
                          {(Number(u.totalStreams) / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div>
                        <p className="text-white/65 text-[11px]">Withdrawn</p>
                        <p className="font-semibold text-white">
                          ${Number(u.totalWithdrawn).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUserForRoyalty(u.id);
                          setInputRoyaltyBalance(u.royaltyBalance || 0);
                          setInputRoyaltyPending(u.royaltyPending || 0);
                          setInputTotalStreams(u.totalStreams || 0);
                          setActiveTab("royalty-input");
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-[#c8f560] hover:text-[#312042] text-white font-semibold"
                      >
                        Edit Royalty
                      </button>
                      <button
                        onClick={() => {
                          setMsgTargetUser(u.id);
                          setActiveTab("inbox");
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#312042] text-[#c8f560] font-semibold"
                      >
                        Kirim Pesan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                      Konfigurasi moderasi otomatis, batas royalti, dan keamanan label HERMES
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
