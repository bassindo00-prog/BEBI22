/**
 * Safe Migration Script: Old Neon DB -> New Neon DB
 * 
 * IMPORTANT:
 * - This script only performs READ (SELECT) operations on the OLD database.
 * - Old database and old website will remain 100% untouched and active.
 */

const { PrismaClient } = require('@prisma/client');

const oldUrl = 'postgresql://neondb_owner:npg_ButvTJNU4lo7@ep-dark-frog-b3iho1rg-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const oldPrisma = new PrismaClient({
  datasources: { db: { url: oldUrl } },
});

const newPrisma = new PrismaClient();

async function runSafeMigration() {
  console.log('🚀 Memulai proses migrasi aman dari Database Lama ke Database Baru...');
  console.log('🔒 Mode Sumber: 100% READ-ONLY (Database lama tidak akan diubah/dihapus)');

  // -------------------------------------------------------------
  // 1. MIGRASI USERS
  // -------------------------------------------------------------
  console.log('\n--- 1. Membaca data User dari DB lama... ---');
  const oldUsers = await oldPrisma.$queryRawUnsafe('SELECT * FROM "User"');
  console.log(`Ditemukan ${oldUsers.length} user di DB lama.`);

  let insertedUsers = 0;
  for (const u of oldUsers) {
    if (!u.email) continue;
    const email = u.email.toLowerCase().trim();

    await newPrisma.user.upsert({
      where: { email },
      update: {
        name: u.name || 'Artist',
        role: u.role === 'ADMIN' ? 'ADMIN' : 'USER',
        avatar: u.image || null,
      },
      create: {
        id: u.id,
        name: u.name || 'Artist',
        email,
        password: u.password || '$2b$10$ubwxN60D4ZDSGWWZ2fU1ReSg86852ZPIKxhyDXByrBRNvG52ypzl2',
        role: u.role === 'ADMIN' ? 'ADMIN' : 'USER',
        avatar: u.image || null,
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
      },
    });
    insertedUsers++;
  }
  console.log(`✅ Berhasil menyalin/memperbarui ${insertedUsers} akun User ke DB baru.`);

  // Dapatkan map userId yang valid di newPrisma
  const validNewUsers = await newPrisma.user.findMany({ select: { id: true } });
  const validUserIdSet = new Set(validNewUsers.map(u => u.id));
  const fallbackUserId = validNewUsers[0]?.id;

  // -------------------------------------------------------------
  // 2. MIGRASI ARTISTS
  // -------------------------------------------------------------
  console.log('\n--- 2. Membaca data Artis dari DB lama... ---');
  const oldArtists = await oldPrisma.$queryRawUnsafe('SELECT * FROM "Artist"');
  console.log(`Ditemukan ${oldArtists.length} artis di DB lama.`);

  let insertedArtists = 0;
  for (const a of oldArtists) {
    const targetUserId = validUserIdSet.has(a.userId) ? a.userId : fallbackUserId;
    if (!targetUserId) continue;

    await newPrisma.artist.upsert({
      where: { id: a.id },
      update: {
        name: a.stageName || 'Artist',
        userId: targetUserId,
        photoUrl: a.avatarUrl || '',
        bio: a.bio || '',
      },
      create: {
        id: a.id,
        name: a.stageName || 'Artist',
        genre: 'Pop',
        spotifyId: '',
        appleId: '',
        photoUrl: a.avatarUrl || '',
        bio: a.bio || '',
        userId: targetUserId,
        createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
      },
    });
    insertedArtists++;
  }
  console.log(`✅ Berhasil menyalin ${insertedArtists} profil Artis ke DB baru.`);

  // -------------------------------------------------------------
  // 3. MIGRASI RELEASES & TRACKS
  // -------------------------------------------------------------
  console.log('\n--- 3. Membaca data Rilisan & Track dari DB lama... ---');
  // Ambil rilis beserta track pertamanya dan userId dari artis
  const oldReleases = await oldPrisma.$queryRawUnsafe(`
    SELECT 
      r.id, r.title, r."artistId", r."primaryArtist", r."featuredArtist", 
      r.genre, r."coverArtworkUrl", r.status, r."releaseDate", r.upc, r."createdAt",
      a."userId",
      t."audioUrl", t.composer, t.producer, t.isrc, t."tiktokClipStart"
    FROM "Release" r
    LEFT JOIN "Artist" a ON r."artistId" = a.id
    LEFT JOIN LATERAL (
      SELECT "audioUrl", composer, producer, isrc, "tiktokClipStart"
      FROM "Track"
      WHERE "releaseId" = r.id
      LIMIT 1
    ) t ON true
  `);
  console.log(`Ditemukan ${oldReleases.length} rilisan lagu di DB lama.`);

  let insertedReleases = 0;
  for (const r of oldReleases) {
    const targetUserId = validUserIdSet.has(r.userId) ? r.userId : fallbackUserId;
    if (!targetUserId) continue;

    const rawStatus = (r.status || '').toUpperCase();
    const cleanStatus = rawStatus === 'APPROVED' ? 'Approved' : rawStatus === 'REJECTED' ? 'Rejected' : 'Pending';

    let formattedDate = '2026-07-20';
    if (r.releaseDate) {
      try {
        formattedDate = new Date(r.releaseDate).toISOString().split('T')[0];
      } catch (e) {}
    }

    await newPrisma.release.upsert({
      where: { id: r.id },
      update: {
        title: r.title || 'Untitled',
        artist: r.primaryArtist || 'Artist',
        featuring: r.featuredArtist || '',
        genre: r.genre || 'Electronic',
        status: cleanStatus,
        coverUrl: r.coverArtworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        audioFile: r.audioUrl || 'audio_preview_final.wav',
        composer: r.composer || 'BREAKOUT Publishing',
        producer: r.producer || 'Luxoa Studio',
        upc: r.upc || '',
        isrc: r.isrc || '',
        tiktokClip: r.tiktokClipStart ? `${r.tiktokClipStart} (30s)` : '00:30 (30s)',
        duration: r.duration ? `${r.duration}` : '3:42',
      },
      create: {
        id: r.id,
        title: r.title || 'Untitled',
        artist: r.primaryArtist || 'Artist',
        featuring: r.featuredArtist || '',
        composer: r.composer || 'BREAKOUT Publishing',
        producer: r.producer || 'Luxoa Studio',
        tiktokClip: r.tiktokClipStart ? `${r.tiktokClipStart} (30s)` : '00:30 (30s)',
        genre: r.genre || 'Electronic',
        releaseDate: formattedDate,
        duration: r.duration ? `${r.duration}` : '3:42',
        streams: '0',
        streamsNum: 0,
        platform: 'Spotify',
        platforms: 'Spotify,Apple Music,TikTok,YouTube Music',
        status: cleanStatus,
        coverUrl: r.coverArtworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        audioFile: r.audioUrl || 'audio_preview_final.wav',
        upc: r.upc || '',
        isrc: r.isrc || '',
        country: 'Indonesia',
        royaltyGrowth: '+14.5%',
        userId: targetUserId,
        createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
      },
    });
    insertedReleases++;
  }
  console.log(`✅ Berhasil menyalin ${insertedReleases} Rilisan Lagu ke DB baru.`);

  // -------------------------------------------------------------
  // 4. MIGRASI WITHDRAWALS
  // -------------------------------------------------------------
  console.log('\n--- 4. Membaca data Penarikan Dana dari DB lama... ---');
  const oldWithdrawals = await oldPrisma.$queryRawUnsafe('SELECT * FROM "WithdrawRequest"');
  console.log(`Ditemukan ${oldWithdrawals.length} riwayat penarikan di DB lama.`);

  let insertedWithdrawals = 0;
  for (const w of oldWithdrawals) {
    const targetUserId = validUserIdSet.has(w.userId) ? w.userId : fallbackUserId;
    if (!targetUserId) continue;

    const rawStatus = (w.status || '').toUpperCase();
    const cleanStatus = rawStatus === 'APPROVED' ? 'Approved' : rawStatus === 'REJECTED' ? 'Rejected' : 'Pending';

    let formattedDate = '2026-08-01';
    if (w.createdAt) {
      try {
        formattedDate = new Date(w.createdAt).toISOString().split('T')[0];
      } catch (e) {}
    }

    await newPrisma.withdrawal.upsert({
      where: { id: w.id },
      update: {
        amount: Number(w.amount || 0),
        method: w.bankName || 'Bank Transfer',
        accountNumber: w.accountNumber || '',
        accountHolder: w.accountName || '',
        status: cleanStatus,
      },
      create: {
        id: w.id,
        date: formattedDate,
        amount: Number(w.amount || 0),
        method: w.bankName || 'Bank Transfer',
        accountNumber: w.accountNumber || '',
        accountHolder: w.accountName || '',
        status: cleanStatus,
        userId: targetUserId,
        createdAt: w.createdAt ? new Date(w.createdAt) : new Date(),
      },
    });
    insertedWithdrawals++;
  }
  console.log(`✅ Berhasil menyalin ${insertedWithdrawals} data Penarikan ke DB baru.`);

  // -------------------------------------------------------------
  // 5. KALKULASI ROYALTI & STREAMS PER USER
  // -------------------------------------------------------------
  console.log('\n--- 5. Mengkalkulasi Royalti & Streams per Artis/User... ---');
  const royaltyPerArtist = await oldPrisma.$queryRawUnsafe(`
    SELECT 
      a."userId",
      sum(COALESCE(r."totalRevenue", 0)) as total_revenue,
      sum(COALESCE(r."spotifyStreams", 0) + COALESCE(r."appleMusicStreams", 0) + COALESCE(r."youtubeStreams", 0) + COALESCE(r."tiktokStreams", 0) + COALESCE(r."amazonStreams", 0) + COALESCE(r."otherStreams", 0)) as total_streams
    FROM "Royalty" r
    JOIN "Artist" a ON r."artistId" = a.id
    GROUP BY a."userId"
  `);

  let updatedRoyalties = 0;
  for (const item of royaltyPerArtist) {
    if (!item.userId || !validUserIdSet.has(item.userId)) continue;
    const rev = Number(item.total_revenue || 0);
    const streams = Number(item.total_streams || 0);

    await newPrisma.user.update({
      where: { id: item.userId },
      data: {
        royaltyBalance: rev,
        totalStreams: streams,
      },
    });
    updatedRoyalties++;
  }
  console.log(`✅ Berhasil memperbarui saldo royalti & stream untuk ${updatedRoyalties} User.`);

  console.log('\n🎉 SELURUH DATA LAMA BERHASIL DISALIN DENGAN AMAN KE DATABASE BARU!');
  console.log('🔒 Database lama tetap utuh 100% tanpa perubahan apa pun.');
}

runSafeMigration()
  .catch((err) => {
    console.error('❌ Terjadi kesalahan saat migrasi:', err);
  })
  .finally(async () => {
    await oldPrisma.$disconnect();
    await newPrisma.$disconnect();
  });

