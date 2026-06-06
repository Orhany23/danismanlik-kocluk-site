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
        <div className="text-center mb-14">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="faq-title">{t.title}</h2>
          <p className="section-sub mx-auto">{t.subtitle}</p>
        </div>
        <div className="max-w-[820px] mx-auto">
          <div className="faq-list">
            {t.items.map((item, i) => (
              <div key={i} className={`faq-item ${openIndex === i ? "open" : ""}`}>
                <button className="faq-question w-full text-left" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                  <span>{item.q}</span>
                  <span className="faq-icon">+</span>
                </button>
                <div
                  className="faq-answer"
                  style={{ maxHeight: openIndex === i ? "500px" : "0px" }}
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
