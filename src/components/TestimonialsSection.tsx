"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { Star } from "lucide-react";

type Item = {
  name: string;
  gradeLevel: string | null;
  rating: number;
  text: string;
  date: string;
};

// Addan avatar baş harfi/harfleri üretir ("Elif Kaya" -> "EK", "E. K." -> "EK").
function avatarInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toLocaleUpperCase("tr-TR");
}

export default function TestimonialsSection() {
  const { dict } = useLocale();
  const t = dict.testimonials;
  const [items, setItems] = useState<Item[]>([]);

  const load = useCallback(async () => {
    const data: { items?: Item[] } = await fetch("/api/testimonials")
      .then((r) => r.json())
      .catch(() => ({ items: [] }));
    setItems(Array.isArray(data.items) ? data.items : []);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load async; state güncellemesi fetch sonrası
  useEffect(() => { void load(); }, [load]);

  // Onaylı yorum yokken bölüm tamamen gizli — sitede hiçbir iz bırakmaz.
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="section" aria-labelledby="testimonials-title">
      <div className="container">
        <div className="mb-12">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="testimonials-title" style={{ maxWidth: 720 }} dangerouslySetInnerHTML={{ __html: t.title }} />
          <p className="section-sub" style={{ maxWidth: 560 }}>{t.subtitle}</p>
        </div>

        <div className="testimonial-grid">
          {items.map((item, i) => (
            <article key={i} className="testimonial-card">
              <div className="testimonial-stars" aria-label={`${item.rating} / 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    strokeWidth={1.6}
                    className={n <= item.rating ? "is-on" : ""}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="testimonial-text">{item.text}</p>
              <div className="testimonial-who">
                <span className="testimonial-avatar" aria-hidden="true">{avatarInitials(item.name)}</span>
                <span className="testimonial-who-meta">
                  <strong>{item.name}</strong>
                  {item.gradeLevel && <span>{item.gradeLevel}</span>}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
