"use client";

import { useEffect } from "react";
import Link from "next/link";

// Beklenmedik bir hata sayfayı boş bırakmasın: ne olduğunu açıkça söyleyip
// tekrar denemek ve ana sayfaya dönmek için gerçek bir yol bırakıyoruz.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Sayfa hatası:", error);
  }, [error]);

  return (
    <div className="notfound-wrap">
      <div className="notfound-inner">
        <span className="notfound-code">Hata</span>
        <h1 className="notfound-title">Bu sayfa yüklenemedi</h1>
        <p className="notfound-lead">
          Geçici bir sorun oldu. Tekrar denediğinde büyük ihtimalle açılacaktır.
        </p>

        <div className="notfound-actions">
          <button onClick={reset} className="btn btn-primary">
            Tekrar dene
          </button>
          <Link href="/" className="btn btn-ghost">
            Ana sayfaya dön
          </Link>
        </div>

        {error.digest && (
          <p className="notfound-foot">
            Sorun sürerse bu kodu iletebilirsin: <code>{error.digest}</code>
          </p>
        )}
      </div>
    </div>
  );
}
