"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AlertTriangle, Info } from "lucide-react";

type DialogKind = "confirm" | "alert";

type DialogRequest = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
};

type PendingDialog = DialogRequest & { kind: DialogKind; resolve: (value: boolean) => void };

type DialogApi = {
  /** Onay ister; kullanıcı onaylarsa true döner. */
  confirm: (req: DialogRequest) => Promise<boolean>;
  /** Yalnızca bilgilendirir; kapatılınca çözülür. */
  alert: (req: DialogRequest) => Promise<boolean>;
};

const DialogContext = createContext<DialogApi | null>(null);

/**
 * Tarayıcının confirm()/alert() kutuları yerine panel içi diyalog.
 * Yerel kutular sekmeyi kilitler, markadan kopuktur, metni biçimlendirilemez
 * ve mobilde konumu şaşırtıcıdır (NN/g). Buradaki diyalog role="alertdialog",
 * Escape ile kapanır ve odağı tetikleyen öğeye geri verir (WCAG 2.2).
 */
export function AdminDialogProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingDialog | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = useCallback((kind: DialogKind, req: DialogRequest) => {
    if (typeof document !== "undefined") {
      lastFocused.current = document.activeElement as HTMLElement | null;
    }
    return new Promise<boolean>((resolve) => setPending({ ...req, kind, resolve }));
  }, []);

  const close = useCallback((result: boolean) => {
    setPending((current) => {
      current?.resolve(result);
      return null;
    });
    lastFocused.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!pending) return;
    confirmButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [pending, close]);

  const confirm = useCallback((req: DialogRequest) => open("confirm", req), [open]);
  const alert = useCallback((req: DialogRequest) => open("alert", req), [open]);

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}
      {pending && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Kapat"
            className="absolute inset-0 bg-black/45"
            onClick={() => close(false)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-dialog-title"
            aria-describedby={pending.description ? "admin-dialog-desc" : undefined}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
          >
            <div className="flex items-start gap-3">
              <span
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  pending.tone === "danger" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                }`}
                aria-hidden="true"
              >
                {pending.tone === "danger" ? <AlertTriangle size={20} /> : <Info size={20} />}
              </span>
              <div className="min-w-0">
                <h2 id="admin-dialog-title" className="text-base font-semibold text-gray-800">
                  {pending.title}
                </h2>
                {pending.description && (
                  <p id="admin-dialog-desc" className="text-sm text-gray-500 mt-1 whitespace-pre-line">
                    {pending.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              {pending.kind === "confirm" && (
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {pending.cancelLabel ?? "Vazgeç"}
                </button>
              )}
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => close(true)}
                style={pending.tone === "danger" ? undefined : { backgroundColor: "#1e3a8a" }}
                className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 ${
                  pending.tone === "danger" ? "bg-red-600" : ""
                }`}
              >
                {pending.confirmLabel ?? (pending.kind === "confirm" ? "Onayla" : "Tamam")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useAdminDialog(): DialogApi {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useAdminDialog must be used within AdminDialogProvider");
  return ctx;
}
