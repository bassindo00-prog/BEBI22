import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar, silakan login" },
        { status: 400 }
      );
    }

    const role = normalizedEmail === "avelinfx@gmail.com" ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        totalStreams: 3457000,
        royaltyBalance: 12450,
        royaltyPending: 90,
        totalWithdrawn: 5200,
        pendingWithdraw: 300,
      },
    });

    // Seed initial sample releases for new user so dashboard is immediately rich
    await prisma.release.createMany({
      data: [
        {
          title: "Midnight Echoes",
          artist: user.name,
          genre: "Pop • Electronic",
          releaseDate: "22-05-2024",
          duration: "3:02",
          streams: "1.200K",
          streamsNum: 1200000,
          platform: "Spotify",
          platforms: "Spotify,Apple Music,TikTok,YouTube",
          status: "Approved",
          coverUrl:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
          userId: user.id,
        },
        {
          title: "Neon Nightfall",
          artist: user.name,
          genre: "Synthwave • Dance",
          releaseDate: "16-04-2024",
          duration: "4:00",
          streams: "1.500K",
          streamsNum: 1500000,
          platform: "Apple Music",
          platforms: "Spotify,Apple Music,YouTube",
          status: "Approved",
          coverUrl:
            "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&auto=format&fit=crop&q=80",
          userId: user.id,
        },
        {
          title: "Velvet Horizon",
          artist: user.name,
          genre: "Chill • R&B",
          releaseDate: "10-03-2024",
          duration: "3:45",
          streams: "450K",
          streamsNum: 450000,
          platform: "TikTok",
          platforms: "Spotify,TikTok,YouTube",
          status: "Pending",
          coverUrl:
            "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=300&auto=format&fit=crop&q=80",
          userId: user.id,
        },
      ],
    });

    await prisma.withdrawal.createMany({
      data: [
        {
          date: "22-05-2024",
          amount: 1200,
          method: "Bank • BCA",
          accountNumber: "1234 5678 9012 3456",
          status: "Approved",
          userId: user.id,
        },
        {
          date: "16-04-2024",
          amount: 900,
          method: "E-Wallet • OVO",
          accountNumber: "0812 3456 7890",
          status: "Approved",
          userId: user.id,
        },
        {
          date: "10-03-2024",
          amount: 300,
          method: "Bank • Mandiri",
          accountNumber: "1370 0098 7654 3",
          status: "Pending",
          userId: user.id,
        },
      ],
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set("hermes_user_id", user.id, {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

