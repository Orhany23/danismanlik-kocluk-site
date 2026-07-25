import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

// Sunum sırasında izin verilen içerik türleri. Yükleme zaten bunlarla sınırlı;
// bu ikinci kapı, depoda beklenmedik bir tür olsa bile güvenli davranır.
const SERVE_ALLOWLIST = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

// Private Blob dosyasını güvenli başlıklarla stream eder.
// - İçerik türü allowlist dışıysa application/octet-stream'e zorlanır.
// - X-Content-Type-Options: nosniff → tarayıcı içeriği HTML sanıp çalıştıramaz.
// - Content-Security-Policy: sandbox → içerik bir şekilde HTML olsa bile script/form çalışmaz.
// - Görsel değilse indirme (attachment); görselse inline önizleme.
export async function serveWorkFile(url: string | null, fileName: string | null): Promise<Response> {
  if (!url) return new NextResponse("Bulunamadı", { status: 404 });

  const res = await get(url, { access: "private" });
  if (!res || res.statusCode !== 200) return new NextResponse("Bulunamadı", { status: 404 });

  const raw = res.blob.contentType || "";
  const safeType = SERVE_ALLOWLIST.has(raw) ? raw : "application/octet-stream";
  const isImage = safeType.startsWith("image/");
  const name = encodeURIComponent(fileName || "dosya");

  return new Response(res.stream, {
    headers: {
      "Content-Type": safeType,
      "Content-Disposition": `${isImage ? "inline" : "attachment"}; filename="${name}"`,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "sandbox",
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}
