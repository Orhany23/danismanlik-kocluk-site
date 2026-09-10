import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { buildChatSystemPrompt } from "@/lib/chatbotContext";

// Gemini'nin ücretsiz katmanı zaten dakika/gün başına sınırlı, ama tek bir
// ziyaretçinin bu sınırı tek başına tüketmesini (ya da botu spam'lemesini)
// önlemek için ayrıca IP başına hafif bir sınır koyuyoruz.
const MAX_MESSAGES_PER_WINDOW = 15;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_MESSAGE_CHARS = 800;
const MAX_HISTORY_TURNS = 8; // token/maliyet kontrolü — sadece son birkaç tur gönderilir

type ChatTurn = { role: "user" | "model"; text: string };

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY tanımlı değil.");
      return NextResponse.json(
        { error: "Sohbet asistanı şu an ayarlanmadı. Lütfen WhatsApp'tan yazın." },
        { status: 503 }
      );
    }

    const ip = clientIp(req);
    if (rateLimited("chat", ip, MAX_MESSAGES_PER_WINDOW, WINDOW_MS)) {
      return NextResponse.json(
        { error: "Çok fazla mesaj gönderildi. Birkaç dakika sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const message = String(body.message ?? "").trim();
    if (!message) {
      return NextResponse.json({ error: "Mesaj boş olamaz." }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json(
        { error: `Mesaj çok uzun (en fazla ${MAX_MESSAGE_CHARS} karakter).` },
        { status: 400 }
      );
    }

    const rawHistory: unknown[] = Array.isArray(body.history) ? body.history : [];
    const history: ChatTurn[] = rawHistory
      .filter((h): h is ChatTurn => {
        if (!h || typeof h !== "object") return false;
        const r = (h as Record<string, unknown>).role;
        const text = (h as Record<string, unknown>).text;
        return (r === "user" || r === "model") && typeof text === "string";
      })
      .slice(-MAX_HISTORY_TURNS * 2)
      .map((h) => ({ role: h.role, text: h.text.slice(0, MAX_MESSAGE_CHARS) }));

    const contents = [
      ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: "user", parts: [{ text: message }] },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: buildChatSystemPrompt() }] },
          // gemini-3.6-flash "düşünme" (thinking) modelidir ve thinkingBudget
          // sıfırlanamıyor (API 400 döndürüyor) — bütçe verilmezse model
          // maxOutputTokens'ın neredeyse tamamını düşünmeye harcayıp asıl
          // cevabı MAX_TOKENS ile yarıda kesiyordu. Düşünmeyi sabit, ücretsiz
          // katmana uygun küçük bir bütçeyle sınırlıyoruz; cevaba yetecek
          // pay maxOutputTokens'ta ayrıca ayrılıyor.
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
            thinkingConfig: { thinkingBudget: 512 },
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      }
    );

    if (res.status === 429) {
      return NextResponse.json(
        { error: "Şu an yoğunluk var. Birkaç dakika sonra tekrar dener misin? WhatsApp'tan da yazabilirsin." },
        { status: 429 }
      );
    }
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Gemini API hatası:", res.status, errText);
      return NextResponse.json(
        { error: "Şu an cevap veremiyorum, lütfen WhatsApp'tan yazın." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const blocked = data?.candidates?.[0]?.finishReason === "SAFETY" || data?.promptFeedback?.blockReason;

    if (blocked || !reply) {
      return NextResponse.json({
        reply: "Bu konuda yardımcı olamıyorum. Randevu ve bilgi için WhatsApp'tan yazabilirsin.",
      });
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Bir hata oluştu, lütfen tekrar deneyin." }, { status: 500 });
  }
}
