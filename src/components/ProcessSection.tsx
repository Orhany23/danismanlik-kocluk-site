"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function ProcessSection() {
  const { dict } = useLocale();
  const t = dict.process;

  return (
    <section id="process" className="section" aria-labelledby="process-title">
      <div className="container">
        <div className="text-center mb-14 reveal">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="process-title" dangerouslySetInnerHTML={{ __html: t.title }} />
          <p className="section-sub mx-auto">{t.subtitle}</p>
        </div>
        <div className="process-track">
          <div className="process-line reveal-scale" aria-hidden="true" />
          <div className="process-grid">
            {t.steps.map((step, i) => (
              <div key={i} className={`process-step reveal delay-${(i % 4) + 1}`}>
                <div className="process-dot" aria-hidden="true" />
                <div className="process-num">{i + 1}</div>
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
