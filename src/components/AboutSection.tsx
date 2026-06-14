"use client";

import { useLocale } from "@/components/LocaleProvider";
import { Target, BookOpen, MessagesSquare, Laptop, Puzzle, Brain, GraduationCap } from "lucide-react";

export default function AboutSection() {
  const { dict } = useLocale();
  const t = dict.about;
  const featureIcons = [
    <Target key="0" size={18} strokeWidth={1.8} />,
    <BookOpen key="1" size={18} strokeWidth={1.8} />,
    <MessagesSquare key="2" size={18} strokeWidth={1.8} />,
    <Laptop key="3" size={18} strokeWidth={1.8} />,
    <Puzzle key="4" size={18} strokeWidth={1.8} />,
    <Brain key="5" size={18} strokeWidth={1.8} />,
  ];

  return (
    <section id="about" className="section" aria-labelledby="about-title" style={{ background: "var(--clr-bg2)" }}>
      <div className="container">
        <div className="about-split">
          <div className="about-portrait">
            <div className="about-portrait-frame">
              <img
                src="/orhan-about.jpg"
                alt="Orhan Yaşlı"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          </div>

          <div className="about-content">
            <span className="section-label">{t.label}</span>
            <h2 className="section-title" id="about-title" dangerouslySetInnerHTML={{ __html: t.title }} />

            <div className="about-accent">
              <div className="about-accent-icon">
                <GraduationCap size={20} color="#fff" strokeWidth={1.8} />
              </div>
              <div className="about-accent-text">
                <strong>{t.university}</strong>
                <span>{t.degree}</span>
              </div>
            </div>

            <p className="section-sub about-quote">{t.para1}</p>
            <p className="section-sub" style={{ marginTop: 16 }}>{t.para2}</p>

            <div className="about-features">
              {t.features.map((f, i) => (
                <div key={i} className="about-feature">
                  <div className="about-feature-icon">{featureIcons[i]}</div>
                  {f}
                </div>
              ))}
            </div>

            <div className="about-cta" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 34 }}>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="btn btn-primary">
                {t.cta}
              </button>
              <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })} className="btn btn-outline">
                {t.cta2}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
