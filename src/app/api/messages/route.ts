import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET messages for current user (personal + broadcast to ALL)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      const messages = await prisma.message.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ messages });
    }

    const cookieStore = cookies();
    let userId = cookieStore.get("hermes_user_id")?.value;

    if (!userId) {
      const fallback = await prisma.user.findFirst({
        where: { email: "abdul@hermes.music" },
      });
      userId = fallback?.id;
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ userId: null }, { userId: userId || undefined }],
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST new message (from Admin to ALL or specific user)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, userId, sender } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        title,
        content,
        sender: sender || "Admin HERMES",
        userId: userId && userId !== "ALL" ? userId : null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("POST message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// DELETE message
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE message error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}

