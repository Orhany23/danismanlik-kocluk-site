"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function LegalModals() {
  const { dict } = useLocale();
  const t = dict.legal;

  const closeModal = (id: string) => {
    document.getElementById(id)?.classList.remove("show");
  };

  const handleOverlayClick = (e: React.MouseEvent, id: string) => {
    if (e.target === e.currentTarget) closeModal(id);
  };

  const modals = [
    { id: "modal-privacy", title: t.privacyTitle, content: t.privacyContent },
    { id: "modal-terms", title: t.termsTitle, content: t.termsContent },
    { id: "modal-cookies", title: t.cookieTitle, content: t.cookieContent },
  ];

  return (
    <>
      {modals.map(({ id, title, content }) => (
        <div
          key={id}
          id={id}
          className="modal-overlay"
          onClick={(e) => handleOverlayClick(e, id)}
        >
          <div className="modal-box" role="dialog" aria-modal="true" aria-label={title}>
            <button className="modal-close" onClick={() => closeModal(id)} aria-label="Kapat">
              ✕
            </button>
            <h3 className="modal-title">{title}</h3>
            <div className="modal-content" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      ))}
    </>
  );
}
