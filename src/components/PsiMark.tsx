// Logodaki Ψ işaretinin filigran olarak yeniden kullanımı (dekoratif).
export default function PsiMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
        <path d="M24 10v28" />
        <path d="M12 12v7c0 7 5 11 12 11s12-4 12-11v-7" />
      </g>
    </svg>
  );
}
