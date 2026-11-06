import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function checkPasswordMatch(inputPassword: string, storedPassword: string): boolean {
  if (!inputPassword || !storedPassword) return false;

  // 1. Direct plaintext check
  if (storedPassword === inputPassword) return true;

  // 2. Bcrypt hash check (starts with $2a$, $2b$, or $2y$)
  if (storedPassword.startsWith("$2")) {
    try {
      if (bcrypt.compareSync(inputPassword, storedPassword)) {
        return true;
      }
    } catch {
      // ignore
    }
  }

  // 3. SHA-256 hash check (64 hex characters)
  if (storedPassword.length === 64) {
    const sha256 = crypto.createHash("sha256").update(inputPassword).digest("hex");
    if (sha256.toLowerCase() === storedPassword.toLowerCase()) {
      return true;
    }
  }

  // 4. MD5 hash check (32 hex characters)
  if (storedPassword.length === 32) {
    const md5 = crypto.createHash("md5").update(inputPassword).digest("hex");
    if (md5.toLowerCase() === storedPassword.toLowerCase()) {
      return true;
    }
  }

  return false;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const inputIdentifier = String(email).trim().toLowerCase();

    // Support finding by email or name (case-insensitive)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: inputIdentifier, mode: "insensitive" } },
          { name: { equals: String(email).trim(), mode: "insensitive" } },
        ],
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    const isValid = checkPasswordMatch(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Auto-upgrade plain text passwords to bcrypt for future security
    if (!user.password.startsWith("$2")) {
      try {
        const newHash = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: newHash },
        });
      } catch (e) {
        // Non-critical, ignore
      }
    }

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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

