"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

export default function ContactSection() {
  const { dict, locale } = useLocale();
  const t = dict.contact;
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch {
      // Silent fail
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "name", type: "text", ph: t.form.placeholders.name, col: "span" },
    { name: "email", type: "email", ph: t.form.placeholders.email, col: "half" },
    { name: "phone", type: "tel", ph: t.form.placeholders.phone, col: "half" },
    { name: "subject", type: "text", ph: t.form.placeholders.subject, col: "span" },
  ] as const;

  return (
    <section id="contact" className="section" aria-labelledby="contact-title" style={{ background: "var(--clr-bg2)" }}>
      <div className="container">
        <div className="text-center mb-14">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title" id="contact-title">{t.title}</h2>
          <p className="section-sub mx-auto">{t.subtitle}</p>
        </div>
        <div className="contact-grid max-w-[1000px] mx-auto">
          <div className="contact-info">
            <div className="contact-info-item">
              <div className="contact-info-icon">✉</div>
              <div>
                <div className="contact-info-label">E-posta</div>
                <div className="contact-info-value">
                  <a href={`mailto:${t.email}`} className="hover:text-[var(--clr-primary)]">{t.email}</a>
                </div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">💬</div>
              <div>
                <div className="contact-info-label">WhatsApp</div>
                <div className="contact-info-value">
                  <a href="https://wa.me/905432500417?text=Merhaba,%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" className="hover:text-[var(--clr-primary)]">
                    {locale === "tr" ? "Mesaj gönderin" : "Send a message"}
                  </a>
                </div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">✈</div>
              <div>
                <div className="contact-info-label">Telegram</div>
                <div className="contact-info-value">
                  <a href="https://t.me/YasliOrhan" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--clr-primary)]">@YasliOrhan</a>
                </div>
              </div>
            </div>
            <div className="contact-social">
              {[
                { icon: "📧", href: `mailto:${t.email}` },
                { icon: "💬", href: "https://wa.me/905432500417" },
                { icon: "✈", href: "https://t.me/YasliOrhan" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="social-btn">{s.icon}</a>
              ))}
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
              style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
              aria-hidden="true"
            />
            <div className="form-row">
              {fields.map((f) => (
                <div key={f.name} className={f.col === "half" ? "form-group" : "form-group col-span-2"}>
                  <label htmlFor={f.name}>
                    {(f.name === "name" ? t.form.name : f.name === "email" ? t.form.email : f.name === "phone" ? t.form.phone : t.form.subject)} <span>*</span>
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    value={formData[f.name]}
                    onChange={handleChange}
                    placeholder={f.ph}
                    required
                    className="form-control"
                  />
                </div>
              ))}
            </div>
            <div className="form-group">
              <label htmlFor="message">{t.form.message} <span>*</span></label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t.form.placeholders.message}
                required
                className="form-control"
              />
            </div>
            <div className="form-submit flex items-center gap-3 flex-wrap">
              <button type="submit" disabled={submitting} className="btn-submit">
                {submitting ? (locale === "tr" ? "Gönderiliyor..." : "Sending...") : t.form.submit}
              </button>
            </div>
            <div className={`form-success ${success ? "show" : ""}`}>{t.form.success}</div>
          </form>
        </div>
      </div>
    </section>
  );
}
