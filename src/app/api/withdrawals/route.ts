import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = cookies();
    let userId = cookieStore.get("hermes_user_id")?.value;

    if (!userId) {
      const fallback = await prisma.user.findFirst({
        where: { email: "abdul@hermes.music" },
      });
      userId = fallback?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const amount = Number(body.amount) || 300;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;

    const withdrawal = await prisma.withdrawal.create({
      data: {
        date: formattedDate,
        amount,
        method: body.method || "Bank • BCA",
        accountNumber: body.accountNumber || "1234 5678 9012 3456",
        status: "Pending",
        userId,
      },
    });

    // Update user's pendingWithdraw & royaltyBalance
    await prisma.user.update({
      where: { id: userId },
      data: {
        royaltyBalance: { decrement: amount },
        pendingWithdraw: { increment: amount },
      },
    });

    return NextResponse.json({ withdrawal });
  } catch (error) {
    console.error("POST withdrawal error:", error);
    return NextResponse.json({ error: "Failed to create withdrawal" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const existing = await prisma.withdrawal.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.withdrawal.update({
      where: { id },
      data: { status },
    });

    if (existing.status === "Pending" && status === "Approved") {
      await prisma.user.update({
        where: { id: existing.userId },
        data: {
          pendingWithdraw: { decrement: existing.amount },
          totalWithdrawn: { increment: existing.amount },
        },
      });
    } else if (existing.status === "Pending" && status === "Rejected") {
      await prisma.user.update({
        where: { id: existing.userId },
        data: {
          pendingWithdraw: { decrement: existing.amount },
          royaltyBalance: { increment: existing.amount },
        },
      });
    }

    return NextResponse.json({ withdrawal: updated });
  } catch (error) {
    console.error("PATCH withdrawal error:", error);
    return NextResponse.json({ error: "Failed to update withdrawal" }, { status: 500 });
  }
}

