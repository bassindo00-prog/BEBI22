import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("hermes_user_id")?.value;

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          releases: { orderBy: { createdAt: "desc" } },
          withdrawals: { orderBy: { createdAt: "desc" } },
        },
      });
    }

    if (!user) {
      // Fallback to Abdul user if not logged in yet for preview convenience, or return null
      user = await prisma.user.findFirst({
        where: { email: "abdul@hermes.music" },
        include: {
          releases: { orderBy: { createdAt: "desc" } },
          withdrawals: { orderBy: { createdAt: "desc" } },
        },
      });
    }

    return NextResponse.json({ user, authenticated: Boolean(userId) });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null, authenticated: false }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
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

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.email ? { email: body.email } : {}),
        ...(body.avatar ? { avatar: body.avatar } : {}),
        ...(body.password ? { password: body.password } : {}),
      },
      include: {
        releases: { orderBy: { createdAt: "desc" } },
        withdrawals: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("PATCH me error:", error);
    return NextResponse.json({ error: "Gagal menyimpan pengaturan" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("hermes_user_id");
  return response;
}

