import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";

// Basit in-memory rate limit (diğer öğrenci uçlarıyla aynı desen)
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 30;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count++;
  return rec.count > MAX_HITS;
}

const TYPES = ["NOTE", "LINK", "FILE", "PHOTO"] as const;
// Vercel serverless istek gövdesi limitinin (≈4.5 MB) altında kalmak için 4 MB.
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

function studentIdFrom(session: { user?: { role?: string; id?: string } } | null): string | null {
  const role = session?.user?.role;
  const id = session?.user?.id;
  return session?.user && role === "STUDENT" && id ? id : null;
}

// Öğrencinin kendi gönderdiği çalışmaları listeler
export async function GET() {
  const session = await auth();
  const studentId = studentIdFrom(session as { user?: { role?: string; id?: string } } | null);
  if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureStudentWorkTable();
    const rows = await prisma.studentWork.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true, type: true, title: true, note: true, url: true, fileName: true,
        seen: true, feedback: true, feedbackAt: true, createdAt: true,
      },
    });
    // Dosyalar private; ham Blob URL'i istemciye verilmez. LINK dışında url gizlenir,
    // dosya varsa hasFile ile işaretlenir (istemci /api/student/work/[id]/file kullanır).
    const works = rows.map((w) => ({
      ...w,
      url: w.type === "LINK" ? w.url : null,
      hasFile: w.type === "FILE" || w.type === "PHOTO",
    }));
    return NextResponse.json({ works }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Student work GET error:", err);
    return NextResponse.json({ error: "Çalışmalar getirilemedi." }, { status: 500 });
  }
}

// Öğrenci yeni çalışma gönderir (not / bağlantı / PDF / fotoğraf)
export async function POST(req: NextRequest) {
  const session = await auth();
  const studentId = studentIdFrom(session as { user?: { role?: string; id?: string } } | null);
  if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Çok fazla gönderim. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  try {
    const form = await req.formData();
    const type = String(form.get("type") ?? "");
    const title = String(form.get("title") ?? "").trim().slice(0, 160) || null;
    const note = String(form.get("note") ?? "").trim().slice(0, 4000) || null;

    if (!TYPES.includes(type as (typeof TYPES)[number])) {
      return NextResponse.json({ error: "Geçersiz tür." }, { status: 400 });
    }

    let url: string | null = null;
    let fileName: string | null = null;
    let fileSize: number | null = null;

    if (type === "NOTE") {
      if (!note) return NextResponse.json({ error: "Lütfen bir not yaz." }, { status: 400 });
    } else if (type === "LINK") {
      const raw = String(form.get("url") ?? "").trim();
      let parsed: URL;
      try {
        parsed = new URL(raw);
      } catch {
        return NextResponse.json({ error: "Geçerli bir bağlantı gir (https:// ile başlamalı)." }, { status: 400 });
      }
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return NextResponse.json({ error: "Bağlantı http/https olmalı." }, { status: 400 });
      }
      url = parsed.toString().slice(0, 2000);
    } else {
      // FILE (PDF) veya PHOTO (görsel)
      const file = form.get("file");
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ error: "Lütfen bir dosya seç." }, { status: 400 });
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "Dosya 4 MB'dan küçük olmalı." }, { status: 400 });
      }
      if (type === "FILE" && file.type !== "application/pdf") {
        return NextResponse.json({ error: "Yalnızca PDF yükleyebilirsin." }, { status: 400 });
      }
      if (type === "PHOTO" && !IMAGE_MIME.includes(file.type)) {
        return NextResponse.json({ error: "Yalnızca görsel (JPG/PNG/WebP) yükleyebilirsin." }, { status: 400 });
      }

      const safeName = (file.name || (type === "FILE" ? "belge.pdf" : "foto.jpg"))
        .replace(/[^\w.\-]+/g, "_")
        .slice(-80);
      try {
        const blob = await put(`student-work/${studentId}/${Date.now()}-${safeName}`, file, {
          access: "private",
          addRandomSuffix: true,
          contentType: file.type,
        });
        url = blob.url;
      } catch (e) {
        console.error("Blob upload failed:", e);
        return NextResponse.json(
          { error: "Dosya yükleme şu an kullanılamıyor. Lütfen daha sonra tekrar dene." },
          { status: 503 },
        );
      }
      fileName = safeName;
      fileSize = file.size;
    }

    await ensureStudentWorkTable();
    await prisma.studentWork.create({
      data: { studentId, type, title, note, url, fileName, fileSize },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Student work POST error:", err);
    return NextResponse.json({ error: "Gönderim sırasında bir hata oluştu." }, { status: 500 });
  }
}
