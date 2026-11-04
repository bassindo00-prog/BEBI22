"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ============================================================================
// SIMULASI PRISMA & BACKEND (Next.js Server-Side Mock)
// Di proyek Next.js asli, ini akan berada di file terpisah (misal: lib/prisma.ts)
// ============================================================================
interface LandingPageContent {
  id: number;
  heroSubtitle: string;
  heroTitle1: string;
  heroTitle2: string;
  storesCount: number;
  card1Text: string;
  card2Title: string;
  card2Desc: string;
  card3Title: string;
  card3Desc: string;
}

const mockPrismaDb = {
  landingPageContent: {
    findFirst: async (): Promise<LandingPageContent> => {
      // Mensimulasikan jeda jaringan (network latency)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 1,
            heroSubtitle: "Global Reach By BREAKOUT.ID",
            heroTitle1: "BREAKOUT",
            heroTitle2: "ID",
            storesCount: 150,
            card1Text: "We reshape the future of music distribution and artist services as a platform (MaaS).",
            card2Title: "Driven By A Passion.",
            card2Desc: "Pushing the boundaries of what's possible in the global audio realm.",
            card3Title: "Distribution Solutions.",
            card3Desc: "Tailored to your unique sound crafting new sonic landscapes."
          });
        }, 300); // 300ms simulasi load dari database
      });
    }
  }
};

// ============================================================================
// KOMPONEN PEMBANTU: Animasi Mengetik (Typewriter) ala React
// ============================================================================
interface TypewriterProps {
  text?: string;
  speed?: number;
  start?: boolean;
  onComplete?: () => void;
  className?: string;
}

const TypewriterText: React.FC<TypewriterProps> = ({
  text = "",
  speed = 80,
  start = false,
  onComplete,
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!start || !text) return;
    
    setIsTyping(true);
    let i = 0;
    
    const typeChar = () => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        setTimeout(typeChar, speed);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };
    
    // Mulai mengetik
    const timer = setTimeout(typeChar, speed);
    return () => clearTimeout(timer);
  }, [start, text, speed]);

  return (
    <span className={`${className} ${isTyping ? "typing-cursor" : ""}`}>
      {displayedText}
    </span>
  );
};

// ============================================================================
// KOMPONEN UTAMA (Next.js Page)
// ============================================================================
export default function App() {
  // State untuk menyimpan data dari "Prisma"
  const [dbData, setDbData] = useState<LandingPageContent | null>(null);
  
  // State urutan animasi Header
  const [animStep, setAnimStep] = useState(0); 
  // 0 = loading, 1 = subtitle, 2 = BREAKOUT, 3 = dot show, 4 = ID, 5 = cards
  
  // State untuk Counter 150+
  const [storeCount, setStoreCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);

  // 1. Fetch data dari simulasi Prisma saat komponen dimuat (Mount)
  useEffect(() => {
    const fetchData = async () => {
      const data = await mockPrismaDb.landingPageContent.findFirst();
      setDbData(data);
      // Mulai animasi setelah data berhasil diambil
      setTimeout(() => setAnimStep(1), 300);
    };
    fetchData();
  }, []);

  // 2. Inject CSS Font Awesome & Google Fonts secara dinamis
  useEffect(() => {
    const linkFA = document.createElement("link");
    linkFA.rel = "stylesheet";
    linkFA.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(linkFA);

    const linkFonts = document.createElement("link");
    linkFonts.rel = "stylesheet";
    linkFonts.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syncopate:wght@400;700&display=swap";
    document.head.appendChild(linkFonts);

    return () => {
      try {
        if (document.head.contains(linkFA)) document.head.removeChild(linkFA);
        if (document.head.contains(linkFonts)) document.head.removeChild(linkFonts);
      } catch (e) {
        // Safe unmount
      }
    };
  }, []);

  // 3. Logic untuk Animasi Counter (Intersection Observer)
  useEffect(() => {
    if (!dbData) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let startTimestamp: number | null = null;
        const duration = 2000;
        const target = dbData.storesCount;

        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const easeOutProgress = 1 - Math.pow(1 - progress, 3);
          
          setStoreCount(Math.floor(easeOutProgress * target));
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setStoreCount(target);
          }
        };
        window.requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [dbData]);

  // Jika data Prisma belum diload, tampilkan layar hitam dengan indikator
  if (!dbData) {
    return (
      <div className="min-h-screen bg-[#0f111a] flex items-center justify-center text-brand-green font-syncopate tracking-widest">
        LOADING DB...
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-white bg-[#0f111a] overflow-x-hidden">
      {/* INJECT CUSTOM CSS: TRANSPARAN TANPA BLUR */}
      <style>{`
        body { font-family: 'Inter', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }
        .glass-card {
            background: rgba(255, 255, 255, 0.04);
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .glass-nav {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
        }
        .pagination-dot {
            width: 8px; height: 8px; border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.5);
            margin: 12px 0; transition: all 0.3s ease; cursor: pointer;
        }
        .pagination-dot.active {
            background-color: white; border-color: white; transform: scale(1.2);
        }
        .glow-green { box-shadow: 0 0 30px rgba(143, 255, 0, 0.5); border: 2px solid #8fff00; }
        .glow-orange { box-shadow: 0 0 30px rgba(255, 87, 34, 0.5); border: 2px solid #ff5722; }
        .glow-blue { box-shadow: 0 0 30px rgba(33, 150, 243, 0.5); border: 2px solid #2196f3; }
        .text-brand-green { color: #8fff00; }
        .bg-brand-green { background-color: #8fff00; }
        .filter-orange { filter: hue-rotate(-60deg) saturate(1.5); }
        .filter-blue { filter: hue-rotate(120deg) saturate(1.5); }
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-scroll { animation: scroll 25s linear infinite; }
        .animate-scroll:hover { animation-play-state: paused; }
        .typing-cursor::after {
            content: '|'; margin-left: 4px; font-weight: 300;
            animation: blink 1s step-end infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
      `}</style>

      {/* HERO SECTION */}
      <header className="relative w-full h-screen min-h-[800px] flex flex-col overflow-hidden">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/6293920186406475229_121.jpg"
            alt="Background"
            className="w-full h-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f111a]/80 via-transparent to-[#0f111a]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent"></div>
        </div>

        {/* Navigation - Fixed, Transparan Tanpa Blur, Background Bar Atas Gambar Upload */}
        <nav
          className="fixed top-0 left-0 w-full z-50 px-6 md:px-16 py-4 md:py-5 flex justify-between items-center glass-nav transition-all duration-300 border-b border-white/10"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(15, 17, 26, 0.72) 0%, rgba(15, 17, 26, 0.45) 50%, rgba(15, 17, 26, 0.72) 100%), url('/header-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 25%",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
          }}
        >
          <Link href="/" className="flex items-center space-x-1 group">
            <span className="text-3xl font-syncopate font-bold tracking-tighter text-white group-hover:text-brand-green transition-colors">1</span>
            <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center -ml-1"></div>
          </Link>

          <div className="hidden md:flex space-x-10 text-xs font-semibold tracking-widest uppercase">
            <a href="#" className="hover:text-brand-green transition-colors">Home</a>
            <a href="#stores" className="hover:text-brand-green transition-colors">About</a>
            <a href="#features" className="hover:text-brand-green transition-colors">Services</a>
            <a href="#cta" className="hover:text-brand-green transition-colors">Contact</a>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border border-white/30 hover:bg-white/15 hover:text-brand-green transition-all"
            >
              Log Masuk
            </Link>
            <Link
              href="/register"
              className="text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full bg-brand-green text-black hover:bg-[#a6ff2e] transition-all shadow-[0_0_15px_rgba(143,255,0,0.4)]"
            >
              Upload Master →
            </Link>
          </div>
        </nav>

        {/* Main Hero Content */}
        <main className="relative z-10 flex-grow flex flex-col justify-center px-8 md:px-16 w-full max-w-7xl mx-auto pt-16">
          <div className="max-w-2xl mt-[-10vh]">
            
            {/* Subtitle */}
            <p className="text-xs md:text-sm font-semibold tracking-widest uppercase mb-4 text-gray-300 h-5">
              <TypewriterText 
                text={dbData.heroSubtitle} 
                start={animStep >= 1} 
                speed={100} 
                onComplete={() => setAnimStep(2)} 
              />
            </p>

            {/* Big Title */}
            <div className="flex items-center text-3xl sm:text-4xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold uppercase tracking-widest text-white font-syncopate leading-none mb-8 min-h-[3rem] md:min-h-[5rem]">
              <TypewriterText 
                text={dbData.heroTitle1} 
                start={animStep >= 2} 
                speed={180} 
                onComplete={() => {
                  setAnimStep(3);
                  setTimeout(() => setAnimStep(4), 300); // delay before typing "ID"
                }} 
              />
              
              {/* Dot - Animates in at Step 3 */}
              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-brand-green flex items-center justify-center mx-2 md:mx-4 text-black text-2xl md:text-5xl font-bold shadow-[0_0_30px_rgba(143,255,0,0.4)] pb-2 md:pb-5 transition-all duration-500 ease-out ${animStep >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                .
              </div>
              
              <TypewriterText 
                text={dbData.heroTitle2} 
                start={animStep >= 4} 
                speed={180} 
                onComplete={() => setAnimStep(5)} // Move to cards
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/register"
                className="flex items-center space-x-4 border border-white/40 rounded-full px-2 py-2 hover:bg-white/10 transition-colors group"
              >
                <span className="pl-4 text-sm font-semibold tracking-wider">Discover</span>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black group-hover:bg-brand-green transition-colors">
                  <i className="fas fa-arrow-right text-sm"></i>
                </div>
              </Link>
              <Link
                href="/login"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-black shadow-[0_0_15px_rgba(143,255,0,0.5)]">
                  <span className="text-xs font-bold font-syncopate">10</span>
                </div>
                <span className="text-sm font-semibold tracking-wider">Connect</span>
              </Link>
            </div>
          </div>
        </main>

        {/* Right Side Pagination Dots */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 hidden md:flex flex-col items-center">
          <div className="pagination-dot active"></div>
          <div className="pagination-dot"></div>
          <div className="pagination-dot"></div>
          <div className="pagination-dot"></div>
          <div className="pagination-dot"></div>
        </div>

        {/* Bottom Glass Cards (3 Columns) — Pure Transparan Tanpa Blur */}
        <div className="absolute bottom-8 left-0 w-full z-20 px-4 md:px-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            
            {/* Card 1 (Green) */}
            <div className="glass-card rounded-3xl p-5 flex items-center justify-between relative group hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-1/2 pr-4">
                <p className="text-[10px] md:text-xs text-gray-300 leading-relaxed font-medium min-h-[4rem]">
                  <TypewriterText text={dbData.card1Text} start={animStep >= 5} speed={85} />
                </p>
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden glow-green flex-shrink-0">
                <img
                  src="/6293920186406475218_120.jpg"
                  alt="Artist 1"
                  className="w-full h-full object-cover object-top transform scale-150"
                />
              </div>
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                <i className="fas fa-arrow-up-right-from-square text-[10px]"></i>
              </div>
            </div>

            {/* Card 2 (Orange) */}
            <div className="glass-card rounded-3xl p-5 flex items-center justify-between relative group hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-1/2 pr-4 flex flex-col justify-start">
                <div className="text-[10px] md:text-xs text-gray-300 leading-relaxed font-medium min-h-[4rem]">
                  <strong className="text-white font-semibold">
                    <TypewriterText text={dbData.card2Title} start={animStep >= 5} speed={85} onComplete={() => setAnimStep(prev => prev < 6 ? 6 : prev)} />
                  </strong><br/>
                  <TypewriterText text={dbData.card2Desc} start={animStep >= 6} speed={85} />
                </div>
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden glow-orange flex-shrink-0">
                <img
                  src="/6293920186406475218_120.jpg"
                  alt="Artist 2"
                  className="w-full h-full object-cover object-top transform scale-150 filter-orange"
                />
              </div>
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                <i className="fas fa-arrow-up-right-from-square text-[10px]"></i>
              </div>
            </div>

            {/* Card 3 (Blue) */}
            <div className="glass-card rounded-3xl p-5 flex items-center justify-between relative group hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-1/2 pr-4 flex flex-col justify-start">
                <div className="text-[10px] md:text-xs text-gray-300 leading-relaxed font-medium min-h-[4rem]">
                  <strong className="text-white font-semibold">
                    <TypewriterText text={dbData.card3Title} start={animStep >= 5} speed={85} onComplete={() => setAnimStep(prev => prev < 7 ? 7 : prev)} />
                  </strong><br/>
                  <TypewriterText text={dbData.card3Desc} start={animStep >= 7} speed={85} />
                </div>
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden glow-blue flex-shrink-0">
                <img
                  src="/6293920186406475218_120.jpg"
                  alt="Artist 3"
                  className="w-full h-full object-cover object-top transform scale-150 filter-blue"
                />
              </div>
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                <i className="fas fa-arrow-up-right-from-square text-[10px]"></i>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* SCROLLABLE CONTENT */}
      
      {/* Logos / Platforms Section */}
      <section id="stores" className="py-16 border-t border-white/10 bg-[#0b0c10] overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-16" ref={counterRef}>
          <p className="text-center text-gray-400 text-sm font-semibold tracking-widest uppercase mb-10">
            Distribute your tracks to <span className="text-brand-green text-xl font-syncopate font-bold mx-1">{storeCount}</span>+ stores worldwide
          </p>
        </div>
        
        {/* Infinite Scroll Container */}
        <div className="relative w-full flex overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#0b0c10] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#0b0c10] to-transparent z-10 pointer-events-none"></div>

          <div className="flex w-max animate-scroll">
            {/* Group 1 */}
            <div className="flex items-center space-x-12 md:space-x-20 px-6 md:px-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <i className="fab fa-spotify text-5xl hover:text-[#1DB954] transition-colors cursor-pointer"></i>
              <i className="fab fa-apple text-5xl hover:text-white transition-colors cursor-pointer"></i>
              <i className="fab fa-soundcloud text-5xl hover:text-[#ff5500] transition-colors cursor-pointer"></i>
              <i className="fab fa-youtube text-5xl hover:text-[#FF0000] transition-colors cursor-pointer"></i>
              <i className="fab fa-tiktok text-5xl hover:text-[#00f2fe] transition-colors cursor-pointer"></i>
              <i className="fab fa-amazon text-5xl hover:text-[#FF9900] transition-colors cursor-pointer"></i>
              <i className="fab fa-napster text-5xl hover:text-white transition-colors cursor-pointer"></i>
              <i className="fab fa-deezer text-5xl hover:text-[#00C7F2] transition-colors cursor-pointer"></i>
            </div>
            {/* Group 2 (Duplicate) */}
            <div className="flex items-center space-x-12 md:space-x-20 px-6 md:px-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <i className="fab fa-spotify text-5xl hover:text-[#1DB954] transition-colors cursor-pointer"></i>
              <i className="fab fa-apple text-5xl hover:text-white transition-colors cursor-pointer"></i>
              <i className="fab fa-soundcloud text-5xl hover:text-[#ff5500] transition-colors cursor-pointer"></i>
              <i className="fab fa-youtube text-5xl hover:text-[#FF0000] transition-colors cursor-pointer"></i>
              <i className="fab fa-tiktok text-5xl hover:text-[#00f2fe] transition-colors cursor-pointer"></i>
              <i className="fab fa-amazon text-5xl hover:text-[#FF9900] transition-colors cursor-pointer"></i>
              <i className="fab fa-napster text-5xl hover:text-white transition-colors cursor-pointer"></i>
              <i className="fab fa-deezer text-5xl hover:text-[#00C7F2] transition-colors cursor-pointer"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 md:px-16 bg-[#0f111a] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-green/5 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-syncopate font-bold mb-6">AMPLIFY YOUR <span className="text-brand-green">SOUND</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Keep 100% of your rights and royalties. We provide the infrastructure, analytics, and global reach for independent artists and labels to thrive in the modern music industry.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl hover:border-brand-green/50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-brand-green/20 flex items-center justify-center mb-6">
                <i className="fas fa-bolt text-brand-green text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 font-syncopate text-white">Fast Delivery</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Get your music on Spotify, Apple Music, and TikTok in record time. Our automated pipeline ensures your releases hit the stores exactly when you want them to.</p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl hover:border-brand-green/50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-brand-green/20 flex items-center justify-center mb-6">
                <i className="fas fa-chart-pie text-brand-green text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 font-syncopate text-white">Deep Analytics</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Track your streams, listeners, and revenue in real-time. Understand your audience demographics and optimize your promotional strategies effectively.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:border-brand-green/50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-brand-green/20 flex items-center justify-center mb-6">
                <i className="fas fa-wallet text-brand-green text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 font-syncopate text-white">100% Royalties</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Your music, your money. We don't take a cut of your earnings. Enjoy automated split payments to collaborators straight from your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="py-24 px-8 md:px-16 bg-[#0b0c10]">
        <div className="max-w-4xl mx-auto text-center glass-card p-12 md:p-20 rounded-[3rem] border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 to-transparent pointer-events-none"></div>
          <h2 className="text-3xl md:text-5xl font-syncopate font-bold mb-6 relative z-10">READY TO <span className="text-white">DROP?</span></h2>
          <p className="text-gray-400 mb-10 relative z-10 max-w-xl mx-auto">Join thousands of independent artists who trust BREAKOUT.ID to distribute their music to the world.</p>
          <Link
            href="/register"
            className="inline-block relative z-10 bg-brand-green text-black font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(143,255,0,0.3)]"
          >
            Start Distributing Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 border-t border-white/5 bg-[#0f111a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-syncopate font-bold tracking-tighter text-gray-500">BREAKOUT</span>
            <div className="w-3 h-3 bg-brand-green rounded-full mx-1 shadow-[0_0_10px_rgba(143,255,0,0.4)]"></div>
            <span className="text-2xl font-syncopate font-bold tracking-tighter text-gray-500">ID</span>
          </div>
          
          <div className="flex space-x-8 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Artists</a>
          </div>

          <div className="flex space-x-4 text-gray-500">
            <a href="#" className="hover:text-brand-green transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-brand-green transition-colors"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-brand-green transition-colors"><i className="fab fa-discord"></i></a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-700 mt-8">
          &copy; 2026 BREAKOUT.ID Music Distribution. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
