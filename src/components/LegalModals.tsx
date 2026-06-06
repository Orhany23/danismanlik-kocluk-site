"use client";

export default function LegalModals() {
  const closeModal = (id: string) => {
    document.getElementById(id)?.classList.remove("show");
  };

  const handleOverlayClick = (e: React.MouseEvent, id: string) => {
    if (e.target === e.currentTarget) closeModal(id);
  };

  const modals = [
    { id: "modal-privacy" },
    { id: "modal-terms" },
    { id: "modal-cookies" },
  ];

  return (
    <>
      {modals.map(({ id }) => (
        <div
          key={id}
          id={id}
          className="modal-overlay"
          onClick={(e) => handleOverlayClick(e, id)}
        >
          <div className="modal-box">
            <button
              className="modal-close"
              onClick={() => closeModal(id)}
            >
              ✕
            </button>
            <div id={`${id}-content`}></div>
          </div>
        </div>
      ))}
    </>
  );
}
