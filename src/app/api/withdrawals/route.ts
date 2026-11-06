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

    const amount = Number(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Jumlah penarikan harus lebih dari Rp 0" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, royaltyBalance: true, pendingWithdraw: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Akun user tidak ditemukan" }, { status: 404 });
    }

    const currentBalance = Math.max(0, Number(user.royaltyBalance) || 0);
    const pendingBalance = Math.max(0, Number(user.pendingWithdraw) || 0);
    const availableBalance = Math.max(0, currentBalance - pendingBalance);

    if (availableBalance <= 0) {
      return NextResponse.json(
        {
          error: "Saldo royalti Anda saat ini Rp 0 atau sedang dalam antrean penarikan. Tidak ada saldo yang dapat ditarik.",
        },
        { status: 400 }
      );
    }

    if (amount > availableBalance) {
      return NextResponse.json(
        {
          error: `Gagal! Jumlah penarikan (Rp ${amount.toLocaleString("id-ID")}) melebihi saldo yang tersedia untuk ditarik (Rp ${availableBalance.toLocaleString("id-ID")}).`,
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;

    // Execute withdrawal creation and increment user pending withdraw
    const [withdrawal] = await prisma.$transaction([
      prisma.withdrawal.create({
        data: {
          date: formattedDate,
          amount,
          method: body.method || "Bank • BCA",
          accountNumber: body.accountNumber || "1234 5678 9012 3456",
          accountHolder: body.accountHolder ? String(body.accountHolder).trim() : (user.name || ""),
          status: "Pending",
          userId,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          pendingWithdraw: { increment: amount },
        },
      }),
    ]);

    return NextResponse.json({ ok: true, withdrawal });
  } catch (error) {
    console.error("POST withdrawal error:", error);
    return NextResponse.json({ error: "Failed to create withdrawal" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ids, allPending, status } = body;

    // Bulk approve all pending or by list of IDs
    if (allPending || (Array.isArray(ids) && ids.length > 0)) {
      const targetStatus = status || "Approved";
      let targets: any[] = [];
      if (allPending) {
        targets = await prisma.withdrawal.findMany({
          where: { status: "Pending" },
        });
      } else {
        targets = await prisma.withdrawal.findMany({
          where: { id: { in: ids } },
        });
      }

      let count = 0;
      for (const w of targets) {
        if (w.status === targetStatus) continue;

        await prisma.withdrawal.update({
          where: { id: w.id },
          data: { status: targetStatus },
        });

        const targetUser = await prisma.user.findUnique({
          where: { id: w.userId },
          select: { royaltyBalance: true, pendingWithdraw: true, totalWithdrawn: true },
        });

        if (targetUser) {
          if (w.status === "Pending" && targetStatus === "Approved") {
            // Deduct royaltyBalance (saldo endap berkurang saat di-ACC)
            // Deduct pendingWithdraw (antrean berkurang)
            // Increment totalWithdrawn (masuk ke payout dan grafik bulanan)
            await prisma.user.update({
              where: { id: w.userId },
              data: {
                royaltyBalance: Math.max(0, (targetUser.royaltyBalance || 0) - w.amount),
                pendingWithdraw: Math.max(0, (targetUser.pendingWithdraw || 0) - w.amount),
                totalWithdrawn: (targetUser.totalWithdrawn || 0) + w.amount,
              },
            });
          } else if (w.status === "Pending" && targetStatus === "Rejected") {
            await prisma.user.update({
              where: { id: w.userId },
              data: {
                pendingWithdraw: Math.max(0, (targetUser.pendingWithdraw || 0) - w.amount),
              },
            });
          } else if (w.status === "Approved" && targetStatus === "Rejected") {
            // Rollback if previously approved
            await prisma.user.update({
              where: { id: w.userId },
              data: {
                royaltyBalance: (targetUser.royaltyBalance || 0) + w.amount,
                totalWithdrawn: Math.max(0, (targetUser.totalWithdrawn || 0) - w.amount),
              },
            });
          }
        }
        count++;
      }

      return NextResponse.json({ ok: true, count });
    }

    // Single item update
    const existing = await prisma.withdrawal.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.withdrawal.update({
      where: { id },
      data: { status },
    });

    const targetUser = await prisma.user.findUnique({
      where: { id: existing.userId },
      select: { royaltyBalance: true, pendingWithdraw: true, totalWithdrawn: true },
    });

    if (targetUser) {
      if (existing.status === "Pending" && status === "Approved") {
        await prisma.user.update({
          where: { id: existing.userId },
          data: {
            royaltyBalance: Math.max(0, (targetUser.royaltyBalance || 0) - existing.amount),
            pendingWithdraw: Math.max(0, (targetUser.pendingWithdraw || 0) - existing.amount),
            totalWithdrawn: (targetUser.totalWithdrawn || 0) + existing.amount,
          },
        });
      } else if (existing.status === "Pending" && status === "Rejected") {
        await prisma.user.update({
          where: { id: existing.userId },
          data: {
            pendingWithdraw: Math.max(0, (targetUser.pendingWithdraw || 0) - existing.amount),
          },
        });
      } else if (existing.status === "Approved" && status === "Rejected") {
        await prisma.user.update({
          where: { id: existing.userId },
          data: {
            royaltyBalance: (targetUser.royaltyBalance || 0) + existing.amount,
            totalWithdrawn: Math.max(0, (targetUser.totalWithdrawn || 0) - existing.amount),
          },
        });
      }
    }

    return NextResponse.json({ withdrawal: updated });
  } catch (error) {
    console.error("PATCH withdrawal error:", error);
    return NextResponse.json({ error: "Failed to update withdrawal" }, { status: 500 });
  }
}

