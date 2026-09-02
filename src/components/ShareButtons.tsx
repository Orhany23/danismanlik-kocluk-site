"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.2.29-.75.94-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.58-.9-2.17-.24-.57-.48-.5-.66-.51h-.56c-.2 0-.51.07-.78.37s-1.02 1-1.02 2.43 1.05 2.82 1.19 3.02c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.62.7.22 1.34.19 1.84.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.35z" />
      <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.86.5 3.6 1.38 5.1L2 22l5.06-1.33A9.96 9.96 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2zm0 18.1c-1.68 0-3.24-.5-4.55-1.36l-.33-.2-3.01.79.8-2.93-.21-.3A8.1 8.1 0 0 1 3.9 12c0-4.48 3.65-8.1 8.12-8.1 4.48 0 8.12 3.62 8.12 8.1 0 4.48-3.64 8.1-8.12 8.1z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.5 8.6L23.3 22h-7l-5.5-6.7L4.5 22H1.4l8-9.2L1 2h7.2l5 6.2L18.9 2zm-1.2 18h1.7L7.4 4h-1.8l12.1 16z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8.5h2.85l.43-3.3h-3.28V8.1c0-.96.27-1.61 1.64-1.61h1.75V3.55C16.6 3.46 15.53 3.36 14.3 3.36c-2.58 0-4.35 1.57-4.35 4.46v2.38H7.1v3.3h2.85V22h3.55z" />
    </svg>
  );
}

export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: <WhatsAppIcon />,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <XIcon />,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FacebookIcon />,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // sessiz geç — pano API'si desteklenmiyor olabilir
    }
  };

  return (
    <div className="share-buttons" aria-label="Paylaş">
      <span className="share-label">Paylaş</span>
      <div className="share-icons">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${l.label}'ta paylaş`}
            className="share-icon-btn"
          >
            {l.icon}
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Bağlantıyı kopyala"
          className="share-icon-btn"
        >
          {copied ? (
            <Check strokeWidth={2} />
          ) : (
            <Link2 strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}
