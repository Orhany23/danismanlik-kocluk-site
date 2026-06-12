"use client";

import { useLocale } from "@/components/LocaleProvider";
import { GraduationCap, Layers, Hourglass, Sparkles, Users } from "lucide-react";

const profileIcons = [
  <GraduationCap key="0" strokeWidth={1.6} />,
  <Layers key="1" strokeWidth={1.6} />,
  <Hourglass key="2" strokeWidth={1.6} />,
  <Sparkles key="3" strokeWidth={1.6} />,
  <Users key="4" strokeWidth={1.6} />,
];

export default function WhoForSection() {
  const { dict } = useLocale();
  const t = dict.whoFor;

  return (
    <section id="who-for" className="section" aria-labelledby="whofor-title" style={{ background: "var(--clr-bg2)" }}>
      <div className="container">
        <div className="text-center mb-14">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="whofor-title" dangerouslySetInnerHTML={{ __html: t.title }} />
          <p className="section-sub mx-auto">{t.subtitle}</p>
        </div>
        <div className="services-grid">
          {t.profiles.map((profile, i) => (
            <div key={i} className="service-card">
              <div className="service-icon">{profileIcons[i]}</div>
              <h3 className="service-title">{profile.title}</h3>
              <p className="service-desc">{profile.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
