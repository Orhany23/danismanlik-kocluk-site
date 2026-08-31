"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { GraduationCap, School, Landmark, Globe2, CalendarDays, Lightbulb, ListChecks, Info, Minus, Plus } from "lucide-react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="exams" className="section" aria-labelledby="exams-title">
      <div className="container">
        <div className="mb-12 reveal">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="exams-title" style={{ maxWidth: 720 }} dangerouslySetInnerHTML={{ __html: t.title }} />
          <p className="section-sub" style={{ maxWidth: 560 }}>{t.subtitle}</p>
          <p className="exam-disclaimer">
            <Info strokeWidth={1.8} aria-hidden="true" />
            <span>{t.disclaimer}</span>
          </p>
        </div>
        <div className="exam-list reveal">
          {t.cards.map((card, i) => {
            const open = openIndex === i;
            return (
              <div key={i} className={`exam-item ${open ? "open" : ""}`}>
                <button
                  className="exam-trigger"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`exam-panel-${i}`}
                >
                  <span className="exam-trigger-icon" aria-hidden="true">{examIcons[i]}</span>
                  <span className="exam-trigger-title">{card.title}</span>
                  <span className="exam-trigger-plus" aria-hidden="true">
                    {open ? <Minus strokeWidth={2.2} /> : <Plus strokeWidth={2.2} />}
                  </span>
                </button>
                <div
                  id={`exam-panel-${i}`}
                  className={`exam-panel ${open ? "open" : ""}`}
                >
                  <div className="exam-panel-inner exam-content" dangerouslySetInnerHTML={{ __html: card.content }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
