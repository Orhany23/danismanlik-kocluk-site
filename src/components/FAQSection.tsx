"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

export default function FAQSection() {
  const { dict } = useLocale();
  const t = dict.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="container">
        <div className="text-center mb-14 reveal">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="faq-title">{t.title}</h2>
          <p className="section-sub mx-auto">{t.subtitle}</p>
        </div>
        <div className="max-w-[820px] mx-auto">
          <div className="faq-list reveal">
            {t.items.map((item, i) => (
              <div key={i} className={`faq-item ${openIndex === i ? "open" : ""}`}>
                <button
                  id={`faq-q-${i}`}
                  className="faq-question w-full text-left"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={`faq-panel ${openIndex === i ? "open" : ""}`}
                >
                  <div className="faq-answer-inner">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
