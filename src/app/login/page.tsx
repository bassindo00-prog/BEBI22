"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Eye, EyeOff, Check, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
        setError(data.error || "Gagal login. Periksa email dan password.");
        setLoading(false);
        return;
      }

      if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat relative font-sans selection:bg-[#38bdf8] selection:text-white"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85')`,
      }}
    >
      {/* Ambient scenic overlay */}
      <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[2px]" />

      {/* Top Left Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/30 bg-black/20 backdrop-blur-md text-xs font-medium text-white/90 hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Frosted Glass Login Card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-[32px] border border-white/40 bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 sm:p-10 text-white animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Login
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-normal">
            Welcome back please login to your account
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-2.5 rounded-xl border border-red-400/50 bg-red-500/20 backdrop-blur-md text-red-100 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-white/60 hover:text-white text-xs ml-2"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* User Name / Email Input */}
          <div className="relative">
            <input
              type="email"
              required
              placeholder="User Name / Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 pr-12 rounded-2xl border border-white/50 bg-white/5 backdrop-blur-sm text-white placeholder-white/70 text-sm focus:outline-none focus:border-white focus:bg-white/10 transition-all"
            />
            <User className="w-5 h-5 text-white/80 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 pr-12 rounded-2xl border border-white/50 bg-white/5 backdrop-blur-sm text-white placeholder-white/70 text-sm focus:outline-none focus:border-white focus:bg-white/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1 pb-2">
            <label
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-2.5 cursor-pointer text-xs text-white/90 select-none"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  rememberMe
                    ? "bg-[#6ba0be] border-white/60 text-white"
                    : "border-white/50 bg-white/10"
                }`}
              >
                {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#6b9eb8] to-[#457b9d] hover:from-[#7bb0ce] hover:to-[#508ea8] active:scale-[0.99] transition-all shadow-lg backdrop-blur-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Signup Link */}
          <div className="text-center pt-3 text-xs text-white/85">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-white hover:underline transition-all"
            >
              Signup
            </Link>
          </div>
        </form>

        {/* Footer inside card */}
        <div className="text-center mt-8 pt-4 border-t border-white/10 text-[11px] text-white/60 font-medium">
          created by <span className="text-white font-semibold">BREAKOUT.ID</span>
        </div>
      </div>
    </div>
  );
}
