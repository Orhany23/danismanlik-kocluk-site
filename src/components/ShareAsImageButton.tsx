"use client";

import { useState } from "react";
import { Share2, Loader2 } from "lucide-react";
import { generateQuoteImage } from "@/lib/shareImage";

/**
 * Tıklanınca söz/metni görsele (PNG) dönüştürüp telefonun native paylaşım
 * panelini açar — tıpkı galeriden fotoğraf paylaşır gibi, resim doğrudan
 * WhatsApp/Instagram/mesajlara ekli olarak gider. Dosya paylaşımını
 * desteklemeyen tarayıcılarda (çoğunlukla masaüstü) görseli indirir.
 */
export default function ShareAsImageButton({
  kicker,
  quote,
  attribution,
  siteUrl,
  fileName = "paylasim.png",
}: {
  kicker: string;
  quote: string;
  attribution?: string;
  siteUrl: string;
  fileName?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleShare = async () => {
    setStatus("loading");
    try {
      const blob = await generateQuoteImage({ kicker, quote, attribution, siteUrl });
      if (!blob) return;

      const file = new File([blob], fileName, { type: "image/png" });

      if (
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({ files: [file] });
        return;
      }

      // Dosya paylaşımı desteklenmiyor: görseli indir, kullanıcı elle paylaşsın.
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      // kullanıcı paylaşım panelini iptal etti — sessiz geç
    } finally {
      setStatus("idle");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={status === "loading"}
      className="quick-share-btn"
      aria-label="Görsel olarak paylaş"
    >
      {status === "loading" ? (
        <Loader2 strokeWidth={2} className="spin" aria-hidden="true" />
      ) : (
        <Share2 strokeWidth={2} aria-hidden="true" />
      )}
      <span>{status === "loading" ? "Hazırlanıyor…" : "Görsel olarak paylaş"}</span>
    </button>
  );
}
