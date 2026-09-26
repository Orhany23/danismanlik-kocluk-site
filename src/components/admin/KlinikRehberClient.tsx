"use client";

import { useMemo, useState } from "react";
import {
  BrainCircuit,
  Search,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ShieldAlert,
  GraduationCap,
  Layers,
  Quote,
  Activity,
  HeartHandshake,
  CheckCircle2,
  X,
  FileText,
  BookmarkCheck,
} from "lucide-react";
import {
  CLINICAL_TECHNIQUES,
  CATEGORIES,
  SCHOOLS,
  ClinicalCategory,
  TherapySchool,
  ClinicalTechnique,
} from "@/lib/clinicalTechniques";

export default function KlinikRehberClient() {
  const [selectedCategory, setSelectedCategory] = useState<ClinicalCategory | "all">("all");
  const [selectedSchool, setSelectedSchool] = useState<TherapySchool | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([CLINICAL_TECHNIQUES[0].id]));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Kategoriye göre sayıları hesapla
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CLINICAL_TECHNIQUES.length };
    for (const c of CATEGORIES) {
      counts[c.id] = CLINICAL_TECHNIQUES.filter((t) => t.category === c.id).length;
    }
    return counts;
  }, []);

  // Filtreleme
  const filteredTechniques = useMemo(() => {
    return CLINICAL_TECHNIQUES.filter((tech) => {
      if (selectedCategory !== "all" && tech.category !== selectedCategory) {
        return false;
      }
      if (selectedSchool !== "all" && tech.school !== selectedSchool) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = tech.title.toLowerCase().includes(q);
        const matchSummary = tech.summary.toLowerCase().includes(q);
        const matchMechanism = tech.mechanism.toLowerCase().includes(q);
        const matchPioneers = tech.pioneers.some((p) => p.toLowerCase().includes(q));
        const matchSymptoms = tech.targetSymptoms.some((s) => s.toLowerCase().includes(q));
        const matchSchool = tech.school.toLowerCase().includes(q);
        const matchScript = tech.counselorScript.toLowerCase().includes(q);
        return (
          matchTitle ||
          matchSummary ||
          matchMechanism ||
          matchPioneers ||
          matchSymptoms ||
          matchSchool ||
          matchScript
        );
      }
      return true;
    });
  }, [selectedCategory, selectedSchool, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredTechniques.map((t) => t.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const handleCopyScript = (tech: ClinicalTechnique) => {
    navigator.clipboard.writeText(tech.counselorScript);
    setCopiedId(tech.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedSchool("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Üst Karşılama Kartı */}
      <section
        style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "28px 32px",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
          <div style={{ maxWidth: 760 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 12px",
                borderRadius: 20,
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                color: "#a5b4fc",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              <BrainCircuit size={15} />
              DANIŞMAN EL KİTABI · SEANS PROTOKOLLERİ
            </div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                margin: "0 0 10px 0",
                fontFamily: "var(--font-display, inherit)",
              }}
            >
              Klinik Müdahale & Terapi Teknikleri Kılavuzu
            </h1>
            <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.7)", fontSize: "0.95rem", lineHeight: 1.65 }}>
              Panik atak, yaygın anksiyete, sınav kaygısı, depresyon, fobi ve travma süreçlerinde dünya genelinde kabul görmüş
              kanıta dayalı klinik teknikler (BDT, ACT, Şema, Varoluşçu, Adlerian). Seans içi uygulama adımları, danışana
              verilecek tam sözlü yönergeler ve bilimsel kaynakçalar.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              alignSelf: "center",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#38bdf8" }}>{CLINICAL_TECHNIQUES.length}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase" }}>Teknik</div>
            </div>
            <div
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#818cf8" }}>{CATEGORIES.length}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase" }}>Kategori</div>
            </div>
            <div
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#34d399" }}>{SCHOOLS.length}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase" }}>Ekol</div>
            </div>
          </div>
        </div>
      </section>

      {/* Arama ve Filtreleme Kontrolleri */}
      <section
        style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          borderRadius: 16,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Arama Çubuğu & Ekol Seçici */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 320px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255, 255, 255, 0.4)",
              }}
            />
            <input
              type="text"
              placeholder="Teknik adı, belirti (çarpıntı, sınav), öncü yazar (Beck, Barlow, Yalom) veya anahtar kelime ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 16px 11px 42px",
                borderRadius: 12,
                background: "rgba(30, 41, 59, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                fontSize: "0.92rem",
                outline: "none",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  padding: 4,
                }}
                title="Aramayı temizle"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value as TherapySchool | "all")}
              style={{
                padding: "11px 16px",
                borderRadius: 12,
                background: "rgba(30, 41, 59, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                fontSize: "0.9rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">Tüm Terapi Ekolleri ({SCHOOLS.length})</option>
              {SCHOOLS.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={expandAll}
                style={{
                  padding: "9px 14px",
                  borderRadius: 10,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Hepsini Aç
              </button>
              <button
                onClick={collapseAll}
                style={{
                  padding: "9px 14px",
                  borderRadius: 10,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>

        {/* Kategori Hapları (Pills) */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => setSelectedCategory("all")}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: "0.83rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: selectedCategory === "all" ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.08)",
              background: selectedCategory === "all" ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)",
              color: selectedCategory === "all" ? "#38bdf8" : "rgba(255, 255, 255, 0.65)",
            }}
          >
            Tüm Kategoriler ({categoryCounts.all})
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: "0.83rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: isSelected ? "1px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.08)",
                  background: isSelected ? "rgba(129, 140, 248, 0.18)" : "rgba(255, 255, 255, 0.03)",
                  color: isSelected ? "#c7d2fe" : "rgba(255, 255, 255, 0.65)",
                }}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Sonuç Sayısı ve Aktif Filtre Bilgisi */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
        <div style={{ fontSize: "0.88rem", color: "rgba(255, 255, 255, 0.6)" }}>
          Toplam <strong>{filteredTechniques.length}</strong> klinik teknik listeleniyor
          {selectedCategory !== "all" && (
            <span> · Kategori: {CATEGORIES.find((c) => c.id === selectedCategory)?.label}</span>
          )}
          {selectedSchool !== "all" && <span> · Ekol: {selectedSchool}</span>}
          {searchQuery && <span> · Arama: “{searchQuery}”</span>}
        </div>

        {(selectedCategory !== "all" || selectedSchool !== "all" || searchQuery) && (
          <button
            onClick={clearFilters}
            style={{
              background: "none",
              border: "none",
              color: "#38bdf8",
              fontSize: "0.82rem",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Boş Durum (Hiç Sonuç Bulunamadıysa) */}
      {filteredTechniques.length === 0 && (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            background: "rgba(15, 23, 42, 0.4)",
            borderRadius: 16,
            border: "1px dashed rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ color: "rgba(255, 255, 255, 0.3)", marginBottom: 12 }}>
            <Search size={36} style={{ margin: "0 auto" }} />
          </div>
          <h3 style={{ color: "#ffffff", fontSize: "1.1rem", marginBottom: 6 }}>Aradığınız kriterlere uygun teknik bulunamadı.</h3>
          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.9rem", maxWidth: 480, margin: "0 auto 16px auto" }}>
            Farklı bir arama terimi deneyebilir veya kategori filtrelerini sıfırlayabilirsiniz.
          </p>
          <button
            onClick={clearFilters}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              background: "#6366f1",
              border: "none",
              color: "#ffffff",
              fontSize: "0.88rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Filtreleri Temizle
          </button>
        </div>
      )}

      {/* Teknik Kartları Listesi */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {filteredTechniques.map((tech) => {
          const isExpanded = expandedIds.has(tech.id);
          const isCopied = copiedId === tech.id;

          return (
            <article
              key={tech.id}
              id={tech.id}
              style={{
                background: "linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 18,
                padding: "24px 28px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                transition: "border-color 0.2s ease",
              }}
            >
              {/* Kart Başlık Alanı */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  cursor: "pointer",
                }}
                onClick={() => toggleExpand(tech.id)}
              >
                <div style={{ flex: 1 }}>
                  {/* Rozetler */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 8,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: "rgba(56, 189, 248, 0.15)",
                        color: "#38bdf8",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                      }}
                    >
                      {tech.categoryLabel}
                    </span>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 8,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: "rgba(129, 140, 248, 0.15)",
                        color: "#a5b4fc",
                        border: "1px solid rgba(129, 140, 248, 0.3)",
                      }}
                    >
                      {tech.school}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      Öncüler: <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>{tech.pioneers.join(", ")}</strong>
                    </span>
                  </div>

                  {/* Teknik Başlığı */}
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "-0.01em",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {tech.title}
                  </h2>

                  {/* Kısa Özet */}
                  <p style={{ margin: "0 0 12px 0", color: "rgba(255, 255, 255, 0.75)", fontSize: "0.93rem", lineHeight: 1.6 }}>
                    {tech.summary}
                  </p>

                  {/* Hedef Belirtiler */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: "0.76rem", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase" }}>
                      Endikasyonlar:
                    </span>
                    {tech.targetSymptoms.map((sym, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: "0.76rem",
                          background: "rgba(255, 255, 255, 0.05)",
                          color: "rgba(255, 255, 255, 0.7)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Aç/Kapa Butonu */}
                <button
                  type="button"
                  aria-label={isExpanded ? "Detayı kapat" : "Detayı aç"}
                  style={{
                    padding: 8,
                    borderRadius: 10,
                    background: isExpanded ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: isExpanded ? "#818cf8" : "rgba(255, 255, 255, 0.6)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {/* Genişleyen Detay Bölümü */}
              {isExpanded && (
                <div
                  style={{
                    marginTop: 24,
                    paddingTop: 24,
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 22,
                  }}
                >
                  {/* 1. Nörobiyolojik ve Bilişsel Mekanizma */}
                  <div
                    style={{
                      padding: "16px 20px",
                      borderRadius: 12,
                      background: "rgba(15, 23, 42, 0.5)",
                      border: "1px solid rgba(56, 189, 248, 0.2)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#38bdf8" }}>
                      <Activity size={17} />
                      <strong style={{ fontSize: "0.88rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        Nörobiyolojik ve Bilişsel Mekanizma (Nasıl ve Neden Çalışır?)
                      </strong>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.65 }}>
                      {tech.mechanism}
                    </p>
                  </div>

                  {/* 2. Adım Adım Seans İçi Protokol */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: "#818cf8" }}>
                      <Layers size={18} />
                      <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#ffffff" }}>
                        Adım Adım Seans İçi Uygulama Protokolü
                      </h3>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {tech.stepByStep.map((step) => (
                        <div
                          key={step.stepNumber}
                          style={{
                            display: "flex",
                            gap: 14,
                            alignItems: "flex-start",
                            padding: "12px 16px",
                            borderRadius: 12,
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                          }}
                        >
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: "rgba(99, 102, 241, 0.25)",
                              border: "1px solid rgba(99, 102, 241, 0.4)",
                              color: "#c7d2fe",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {step.stepNumber}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: "#ffffff", fontSize: "0.92rem", marginBottom: 3 }}>
                              {step.title}
                            </div>
                            <div style={{ color: "rgba(255, 255, 255, 0.72)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                              {step.counselorAction}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Danışana Söylenecek Seans İçi Yönerge & Metafor (Klinik Script) */}
                  <div
                    style={{
                      padding: "20px 22px",
                      borderRadius: 14,
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)",
                      border: "1px solid rgba(129, 140, 248, 0.3)",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#a5b4fc" }}>
                        <Quote size={18} />
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          Danışana Seans İçi Yönerge & Metafor Kalıbı
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyScript(tech)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "6px 12px",
                          borderRadius: 8,
                          background: isCopied ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.08)",
                          border: isCopied ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.15)",
                          color: isCopied ? "#34d399" : "#ffffff",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        title="Seans yönergesini kopyala"
                      >
                        {isCopied ? (
                          <>
                            <Check size={14} />
                            Kopyalandı!
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Yönergeyi Kopyala
                          </>
                        )}
                      </button>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.94rem",
                        color: "#f1f5f9",
                        lineHeight: 1.75,
                        fontStyle: "italic",
                      }}
                    >
                      {tech.counselorScript}
                    </p>
                  </div>

                  {/* 4. Ev Ödevi & Seans Dışı Takip */}
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 12,
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <BookmarkCheck size={18} style={{ color: "#34d399", flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong style={{ display: "block", fontSize: "0.85rem", color: "#34d399", textTransform: "uppercase", marginBottom: 3 }}>
                        Ev Ödevi & Seans Dışı Pekiştirme
                      </strong>
                      <p style={{ margin: 0, fontSize: "0.88rem", color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.6 }}>
                        {tech.homeworkAndPractice}
                      </p>
                    </div>
                  </div>

                  {/* 5. Dikkat Edilmesi Gerekenler & Kontrendikasyonlar */}
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 12,
                      background: "rgba(239, 68, 68, 0.07)",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <ShieldAlert size={18} style={{ color: "#f87171", flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", fontSize: "0.85rem", color: "#f87171", textTransform: "uppercase", marginBottom: 4 }}>
                        Klinik Dikkat Noktaları & Kontrendikasyonlar
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.86rem", color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.6 }}>
                        {tech.cautionsAndContraindications.map((caution, i) => (
                          <li key={i}>{caution}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 6. Bilimsel Literatür & Kaynakça */}
                  <div
                    style={{
                      paddingTop: 8,
                      borderTop: "1px dashed rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <span style={{ display: "block", fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", marginBottom: 6 }}>
                      Bilimsel Literatür Referansları:
                    </span>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.5)", lineHeight: 1.6 }}>
                      {tech.evidenceAndReferences.map((ref, i) => (
                        <li key={i}>{ref}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
