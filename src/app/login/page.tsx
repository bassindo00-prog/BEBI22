"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Lock, Mail, ShieldCheck, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("avelinfx@gmail.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal login");
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
          href="/register"
          className="px-3.5 py-1.5 rounded-full border border-white/35 bg-transparent text-[11px] uppercase tracking-wider hover:border-[#c8f560] hover:text-[#c8f560] transition-colors"
        >
          Create Account
        </Link>
      </div>

      {/* Main Form Container — 100% Transparent, NO backdrop-blur */}
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
              AUTH PORTAL
            </span>
          </div>

          <h1 className="text-xl font-light tracking-tight text-white mb-1">
            Sign in to your workspace
          </h1>
          <p className="text-[11px] text-white/75 mb-6">
            Enter your credentials to access the Artist Dashboard or Admin Control Center.
          </p>

          {error && (
            <div className="mb-4 px-3.5 py-2.5 rounded-xl border border-red-300/60 bg-transparent text-white text-[11px]">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="avelinfx@gmail.com"
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
                  placeholder="••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-white/35 bg-transparent text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-[#c8f560] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full border border-[#312042] bg-[#312042] hover:bg-[#412b57] text-white text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? "Authenticating..." : "Sign In Now"}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#c8f560]" />
            </button>
          </form>

          {/* Quick Test Credentials Box — Full Transparent, No Blur */}
          <div className="mt-6 pt-5 border-t border-white/20">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/70 mb-2.5">
              Quick One-Click Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEmail("avelinfx@gmail.com");
                  setPassword("1234");
                }}
                className="p-2.5 rounded-xl border border-white/30 bg-transparent hover:border-[#c8f560] text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-[#c8f560] uppercase">
                    Admin Account
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c8f560]" />
                </div>
                <p className="text-[10px] text-white/90 truncate mt-1">avelinfx@gmail.com</p>
                <p className="text-[9px] text-white/60">Pass: 1234</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("abdul@hermes.music");
                  setPassword("1234");
                }}
                className="p-2.5 rounded-xl border border-white/30 bg-transparent hover:border-white text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-white uppercase">
                    Artist (Abdul)
                  </span>
                  <UserCheck className="w-3.5 h-3.5 text-white/80" />
                </div>
                <p className="text-[10px] text-white/90 truncate mt-1">abdul@hermes.music</p>
                <p className="text-[9px] text-white/60">Pass: 1234</p>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-[11px] text-white/75">
              Don&apos;t have an artist account?{" "}
              <Link href="/register" className="text-[#c8f560] hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Micro Footer */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/60">
        <span>ZERO-BLUR TRANSPARENT INTERFACE</span>
        <span>PRISMA ORM • NEXT.JS</span>
      </div>
    </div>
  );
}

