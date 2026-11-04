const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Upsert Admin User: avelinfx@gmail.com / 1234
  const admin = await prisma.user.upsert({
    where: { email: "avelinfx@gmail.com" },
    update: {
      password: "1234",
      role: "ADMIN",
      name: "Avelin FX",
    },
    create: {
      email: "avelinfx@gmail.com",
      name: "Avelin FX",
      password: "1234",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      totalStreams: 3457000,
      royaltyBalance: 12450,
      royaltyPending: 90,
      totalWithdrawn: 5200,
      pendingWithdraw: 300,
    },
  });

  // Upsert Artist User: abdul@hermes.music / 1234
  const abdul = await prisma.user.upsert({
    where: { email: "abdul@hermes.music" },
    update: {
      password: "1234",
      role: "USER",
      name: "Abdul",
    },
    create: {
      email: "abdul@hermes.music",
      name: "Abdul",
      password: "1234",
      role: "USER",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      totalStreams: 3457000,
      royaltyBalance: 12450,
      royaltyPending: 90,
      totalWithdrawn: 5200,
      pendingWithdraw: 300,
    },
  });

  // Clear existing releases & withdrawals & messages & catalog to keep seed idempotent
  await prisma.release.deleteMany({});
  await prisma.withdrawal.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.catalog.deleteMany({});

  // Create Releases matching the reference screenshots for both Abdul & Admin
  const sampleReleases = [
    {
      title: "Midnight Echoes",
      artist: "HERMES",
      genre: "Pop • Electronic",
      releaseDate: "22-05-2024",
      duration: "3:02",
      streams: "0",
      streamsNum: 0,
      platform: "Spotify",
      platforms: "Spotify,Apple Music,TikTok,YouTube",
      status: "Approved",
      coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
      country: "United States",
      royaltyGrowth: "+12.4%",
      upc: "899214578101",
      isrc: "ID-HRM-24-00101",
      userId: abdul.id,
    },
    {
      title: "Neon Nightfall",
      artist: "HERMES",
      genre: "Synthwave • Dance",
      releaseDate: "16-04-2024",
      duration: "4:00",
      streams: "0",
      streamsNum: 0,
      platform: "Apple Music",
      platforms: "Spotify,Apple Music,YouTube",
      status: "Approved",
      coverUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&auto=format&fit=crop&q=80",
      country: "United Kingdom",
      royaltyGrowth: "+8.1%",
      upc: "899214578102",
      isrc: "ID-HRM-24-00102",
      userId: abdul.id,
    },
    {
      title: "Velvet Horizon",
      artist: "HERMES",
      genre: "Chill • R&B",
      releaseDate: "10-03-2024",
      duration: "3:45",
      streams: "0",
      streamsNum: 0,
      platform: "TikTok",
      platforms: "Spotify,TikTok,YouTube",
      status: "Pending",
      coverUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=300&auto=format&fit=crop&q=80",
      country: "Germany",
      royaltyGrowth: "+5.6%",
      upc: "899214578103",
      isrc: "ID-HRM-24-00103",
      userId: abdul.id,
    },
    {
      title: "Midnight Lights",
      artist: "Avelin FX",
      genre: "Pop • HERMES",
      releaseDate: "28-06-2024",
      duration: "3:18",
      streams: "0",
      streamsNum: 0,
      platform: "Spotify",
      platforms: "Spotify,Apple Music,TikTok,YouTube",
      status: "Approved",
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80",
      country: "United States",
      royaltyGrowth: "+12.4%",
      upc: "899214578104",
      isrc: "ID-HRM-24-00104",
      userId: admin.id,
    },
    {
      title: "Neon Dawn",
      artist: "Avelin FX",
      genre: "Electronic • HERMES",
      releaseDate: "19-06-2024",
      duration: "3:52",
      streams: "0",
      streamsNum: 0,
      platform: "Apple Music",
      platforms: "Spotify,Apple Music,YouTube",
      status: "Pending",
      coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
      country: "United Kingdom",
      royaltyGrowth: "+8.1%",
      upc: "899214578105",
      isrc: "ID-HRM-24-00105",
      userId: admin.id,
    },
  ];

  for (const r of sampleReleases) {
    await prisma.release.create({ data: r });
  }

  // Create Withdrawals matching Image 5
  const sampleWithdrawals = [
    {
      date: "22-05-2024",
      amount: 1200,
      method: "Bank • BCA",
      accountNumber: "1234 5678 9012 3456",
      status: "Approved",
      userId: abdul.id,
    },
    {
      date: "16-04-2024",
      amount: 900,
      method: "E-Wallet • OVO",
      accountNumber: "0812 3456 7890",
      status: "Approved",
      userId: abdul.id,
    },
    {
      date: "10-03-2024",
      amount: 300,
      method: "Bank • Mandiri",
      accountNumber: "1370 0098 7654 3",
      status: "Pending",
      userId: abdul.id,
    },
    {
      date: "25-05-2024",
      amount: 1500,
      method: "Bank • BCA",
      accountNumber: "8890 1122 3344",
      status: "Pending",
      userId: admin.id,
    },
  ];

  for (const w of sampleWithdrawals) {
    await prisma.withdrawal.create({ data: w });
  }

  // Seed sample messages (broadcast and private)
  await prisma.message.create({
    data: {
      title: "Selamat Datang di HERMES Music Distribution!",
      content: "Akun Anda telah aktif. Anda sekarang dapat mengunggah rilis musik Anda dan memantau performa streaming global serta pendapatan royalti.",
      sender: "Avelin FX (Admin)",
      userId: null, // Broadcast to all
    },
  });

  await prisma.message.create({
    data: {
      title: "Laporan Distribusi Q2 2024 Telah Tersedia",
      content: "Royalti untuk kuartal ini telah masuk ke saldo Anda. Silakan periksa menu Royalti & Penarikan untuk melakukan penarikan dana.",
      sender: "Finance Team HERMES",
      userId: abdul.id, // Direct message to Abdul
    },
  });

  // Seed sample Catalog items
  const sampleCatalogs = [
    {
      songId: "HRM-ID-0101",
      title: "Midnight Echoes",
      artist: "Abdul feat. Luna Eclipse",
      publisher: "HERMES Publishing / Sony Music",
      status: "Aktif",
      youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      driveLink: "https://drive.google.com/drive/folders/hermes_midnight_echoes_master",
    },
    {
      songId: "HRM-ID-0102",
      title: "Neon Nightfall",
      artist: "HERMES Sound Lab",
      publisher: "Luxoa Universal Songs",
      status: "Aktif",
      youtubeLink: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      driveLink: "https://drive.google.com/drive/folders/hermes_neon_nightfall_lossless",
    },
    {
      songId: "HRM-ID-0103",
      title: "Velvet Horizon",
      artist: "Avelin FX",
      publisher: "Warner Chappell Indonesia",
      status: "Aktif",
      youtubeLink: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
      driveLink: "https://drive.google.com/drive/folders/avelin_velvet_horizon_wav",
    },
    {
      songId: "HRM-ID-0104",
      title: "City Pulse & Neon Rain",
      artist: "Abdul (Acoustic)",
      publisher: "BMG Rights Management",
      status: "Review",
      youtubeLink: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
      driveLink: "https://drive.google.com/drive/folders/city_pulse_acoustic_master",
    },
    {
      songId: "HRM-ID-0105",
      title: "Cyber Serenade 2026",
      artist: "Luxoa Synthetics",
      publisher: "HERMES Publishing Group",
      status: "Aktif",
      youtubeLink: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
      driveLink: "https://drive.google.com/drive/folders/cyber_serenade_stems_drive",
    },
  ];

  for (const c of sampleCatalogs) {
    await prisma.catalog.create({ data: c });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

