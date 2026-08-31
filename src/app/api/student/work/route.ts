import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireStudent } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { parseHttpUrl } from "@/lib/httpUrl";
import { looksLikeImage, looksLikePdf } from "@/lib/fileSniff";

const TYPES = ["NOTE", "LINK", "FILE", "PHOTO"] as const;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function GET() {
  const student = await requireStudent();
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureStudentWorkTable();
    const rows = await prisma.studentWork.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true, type: true, title: true, note: true, url: true, fileName: true,
        seen: true, feedback: true, feedbackAt: true, createdAt: true,
      },
    });
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

export async function POST(req: NextRequest) {
  const student = await requireStudent();
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (rateLimited("work", clientIp(req), 30, 10 * 60 * 1000)) {
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
      const parsed = parseHttpUrl(form.get("url"));
      if (!parsed) {
        return NextResponse.json({ error: "Geçerli bir bağlantı gir (https:// ile başlamalı)." }, { status: 400 });
      }
      url = parsed;
    } else {
      const file = form.get("file");
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ error: "Lütfen bir dosya seç." }, { status: 400 });
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "Dosya 4 MB'dan küçük olmalı." }, { status: 400 });
      }
      if (type === "FILE") {
        if (file.type !== "application/pdf" || !(await looksLikePdf(file))) {
          return NextResponse.json({ error: "Yalnızca PDF yükleyebilirsin." }, { status: 400 });
        }
      }
      if (type === "PHOTO") {
        if (!IMAGE_MIME.includes(file.type) || !(await looksLikeImage(file))) {
          return NextResponse.json({ error: "Yalnızca görsel (JPG/PNG/WebP) yükleyebilirsin." }, { status: 400 });
        }
      }

      const safeName = (file.name || (type === "FILE" ? "belge.pdf" : "foto.jpg"))
        .replace(/[^\w.\-]+/g, "_")
        .slice(-80);
      try {
        const blob = await put(`student-work/${student.id}/${Date.now()}-${safeName}`, file, {
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
      data: { studentId: student.id, type, title, note, url, fileName, fileSize },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Student work POST error:", err);
    return NextResponse.json({ error: "Gönderim sırasında bir hata oluştu." }, { status: 500 });
  }
}
