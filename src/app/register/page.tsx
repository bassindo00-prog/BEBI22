"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal membuat akun");
        setLoading(false);
        return;
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between p-6 relative">
      {/* Top Bar — Full Transparent, No Blur */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to HERMES</span>
        </Link>

        <Link
          href="/login"
          className="px-3.5 py-1.5 rounded-full border border-white/35 bg-transparent text-[11px] uppercase tracking-wider hover:border-[#c8f560] hover:text-[#c8f560] transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Main Register Form — 100% Transparent, NO backdrop-blur */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="rounded-3xl border border-white/35 bg-transparent p-7 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full border border-white/70 flex items-center justify-center bg-transparent">
                <div className="w-3 h-5 rounded-full border border-white" />
              </div>
              <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                HERMES / LUXOA
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#c8f560]">
              ARTIST ONBOARDING
            </span>
          </div>

          <h1 className="text-xl font-light tracking-tight text-white mb-1">
            Create your distribution account
          </h1>
          <p className="text-[11px] text-white/75 mb-6">
            Distribute unlimited tracks globally and collect 100% of your streaming royalties.
          </p>

          {error && (
            <div className="mb-4 px-3.5 py-2.5 rounded-xl border border-red-300/60 bg-transparent text-white text-[11px]">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-white/80 mb-1.5">
                Artist / Stage Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-white/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Abdul / HERMES"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-white/35 bg-transparent text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-[#c8f560] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-white/80 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-white/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artist@hermes.music"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-white/35 bg-transparent text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-[#c8f560] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-white/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-white/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-white/35 bg-transparent text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-[#c8f560] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full border border-[#312042] bg-[#312042] hover:bg-[#412b57] text-white text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? "Creating Workspace..." : "Register Artist Account"}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#c8f560]" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/20 text-center">
            <p className="text-[11px] text-white/75">
              Already registered?{" "}
              <Link href="/login" className="text-[#c8f560] hover:underline">
                Sign in with existing account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Micro Footer */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/60">
        <span>ZERO-BLUR TRANSPARENT INTERFACE</span>
        <span>100% ROYALTY RETENTION</span>
      </div>
    </div>
  );
}

