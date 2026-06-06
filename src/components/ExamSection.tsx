"use client";

import { useLocale } from "@/components/LocaleProvider";

const examIcons = [
  <svg key="0" viewBox="0 0 32 32" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/><path d="M8 7l8 4"/>
  </svg>,
  <svg key="1" viewBox="0 0 32 32" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v28M24 2v28M2 8h28M2 16h28M2 24h28"/><path d="M14 2l-2 7M18 2l2 7"/>
  </svg>,
  <svg key="2" viewBox="0 0 32 32" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h24v18H4z"/><path d="M16 4l6 4H10l6-4z"/><path d="M10 14l4 4 8-8"/>
  </svg>,
  <svg key="3" viewBox="0 0 32 32" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="6" width="24" height="20" rx="2"/><path d="M16 14v4M16 22h0"/><path d="M11 6V4M21 6V4"/>
  </svg>,
  <svg key="4" viewBox="0 0 32 32" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="16" r="13"/><path d="M16 9v7l4 4"/>
  </svg>,
];

export default function ExamSection() {
  const { dict } = useLocale();
  const t = dict.exams;

  return (
    <section id="exams" className="section" aria-labelledby="exams-title">
      <div className="container">
        <div className="text-center mb-14">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="exams-title" dangerouslySetInnerHTML={{ __html: t.title }} />
          <p className="section-sub mx-auto">{t.subtitle}</p>
        </div>
        <div className="exams-grid">
          {t.cards.map((card, i) => (
            <div key={i} className="service-card">
              <div className="service-icon">{examIcons[i]}</div>
              <h3 className="service-title">{card.title}</h3>
              <div className="exam-content" dangerouslySetInnerHTML={{ __html: card.content }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
