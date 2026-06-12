"use client";

import { useLocale } from "@/components/LocaleProvider";
import { GraduationCap, School, Landmark, Globe2, CalendarDays, Lightbulb, ListChecks } from "lucide-react";

const examIcons = [
  <GraduationCap key="0" strokeWidth={1.6} />,
  <School key="1" strokeWidth={1.6} />,
  <Landmark key="2" strokeWidth={1.6} />,
  <Globe2 key="3" strokeWidth={1.6} />,
  <CalendarDays key="4" strokeWidth={1.6} />,
  <Lightbulb key="5" strokeWidth={1.6} />,
  <ListChecks key="6" strokeWidth={1.6} />,
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
