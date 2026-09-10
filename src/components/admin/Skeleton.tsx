// Panelde bekleme durumu. Daha önce her sayfa ortada tek satır "Yükleniyor..."
// yazıyordu: ekran boş kalıyor, veri gelince yerleşim zıplıyordu. İskelet
// bloklar gelecek içeriğin biçimini tutar, geçiş sakin olur.

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}

// Sayfa başlığı + açıklama satırı
export function HeaderSkeleton() {
  return (
    <div className="space-y-2.5">
      <Skeleton className="h-7 w-52" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>
  );
}

// Kart/liste görünümleri için (mesajlar, çalışmalar, danışan kartları).
// header={false}: sayfa başlığını kendisi zaten basan ekranlarda.
export function CardListSkeleton({ rows = 4, header = true }: { rows?: number; header?: boolean }) {
  return (
    <div role="status" aria-label="Yükleniyor" className="space-y-6">
      {header && <HeaderSkeleton />}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            {/* Satır uzunlukları kasıtlı olarak eşit değil: gerçek metin gibi dursun */}
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className={i % 2 === 0 ? "h-3.5 w-3/5" : "h-3.5 w-4/5"} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Tablo görünümleri için (öğrenciler, randevular, seanslar)
export function TableSkeleton({ rows = 5, cols = 5, header = true }: { rows?: number; cols?: number; header?: boolean }) {
  return (
    <div role="status" aria-label="Yükleniyor" className="space-y-6">
      {header && <HeaderSkeleton />}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="border-t border-gray-50 px-5 py-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className={`h-3.5 flex-1 ${c === 0 ? "max-w-[9rem]" : ""}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Form görünümleri için (ayarlar, kaynak düzenleme)
export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div role="status" aria-label="Yükleniyor" className="space-y-6">
      <HeaderSkeleton />
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
    </div>
  );
}
