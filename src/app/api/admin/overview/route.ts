import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [users, releases, withdrawals, catalogs] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { releases: true, withdrawals: true },
          },
        },
      }),
      prisma.release.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      }),
      prisma.withdrawal.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      }),
      prisma.catalog.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ users, releases, withdrawals, catalogs });
  } catch (error) {
    console.error("Admin overview error:", error);
    return NextResponse.json({ error: "Failed to load admin data" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, royaltyBalance, totalStreams, royaltyPending, role } = body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(royaltyBalance !== undefined ? { royaltyBalance: Number(royaltyBalance) } : {}),
        ...(royaltyPending !== undefined ? { royaltyPending: Number(royaltyPending) } : {}),
        ...(totalStreams !== undefined ? { totalStreams: Number(totalStreams) } : {}),
        ...(role !== undefined ? { role } : {}),
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Admin PATCH user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

