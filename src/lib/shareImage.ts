/**
 * Bir alıntı/motivasyon sözünü, üstte site adresiyle, kart görünümünde
 * bir PNG görsele dönüştürür. Paylaşım butonuna basınca telefonun
 * "fotoğraf paylaş" panelinin açılması için bu görsel navigator.share'e
 * dosya (File) olarak veriliyor.
 */

const WIDTH = 1080;
const HEIGHT = 1350;

const INK = "#241A1C";
const INK2 = "#1A1414";
const CREAM = "#F2EADC";
const CREAM_DIM = "rgba(242,234,220,0.62)";
const SAGE = "#D9B26B";

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function loadFonts() {
  try {
    await Promise.all([
      document.fonts.load("600 40px Petrona"),
      document.fonts.load("italic 400 54px Petrona"),
      document.fonts.load("600 30px Figtree"),
    ]);
  } catch {
    // yüklenemezse tarayıcı varsayılan fontla devam eder
  }
}

export async function generateQuoteImage(opts: {
  kicker: string; // örn. "GÜNÜN MOTİVASYONU"
  quote: string; // ana söz / metin
  attribution?: string; // örn. isim, sınıf vb.
  siteUrl?: string; // adres, üstte gösterilir
  siteName?: string;
}): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  await loadFonts();

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const siteUrl = opts.siteUrl ?? "psdorhanyasli.com.tr";
  const siteName = opts.siteName ?? "Orhan Yaşlı";

  // Arka plan: koyu zemin üstünde hafif dikey degrade
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, INK);
  bg.addColorStop(1, INK2);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Dev, çok soluk Ψ arka plan motifi
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = CREAM;
  ctx.font = "700 780px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Ψ", WIDTH / 2, HEIGHT / 2 + 40);
  ctx.restore();

  const padX = 96;

  // Üst şerit: site adı + adres
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = CREAM;
  ctx.font = "600 44px Petrona, Georgia, serif";
  ctx.fillText(siteName, padX, 128);

  ctx.fillStyle = SAGE;
  ctx.font = "600 26px Figtree, system-ui, sans-serif";
  ctx.fillText(siteUrl.replace(/^https?:\/\//, ""), padX, 168);

  // Ayırıcı çizgi
  ctx.strokeStyle = "rgba(242,234,220,0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padX, 208);
  ctx.lineTo(WIDTH - padX, 208);
  ctx.stroke();

  // Kicker rozet (ör. GÜNÜN MOTİVASYONU)
  ctx.fillStyle = SAGE;
  ctx.font = "600 26px Figtree, system-ui, sans-serif";
  ctx.textAlign = "center";
  const kickerY = 292;
  ctx.fillText(opts.kicker.toUpperCase(), WIDTH / 2, kickerY);

  // Alıntı için sabit dikey alan: kicker'ın altından başlar, alt bilgi/adres
  // şeridinin üstünde biter — metin ne kadar uzun olursa olsun bu alanın
  // dışına taşmaz (üstteki etiketle asla çakışmaz).
  const contentTop = kickerY + 56;
  const bottomStripTop = HEIGHT - 170;
  const attributionReserve = opts.attribution ? 70 : 0;
  const contentBottom = bottomStripTop - attributionReserve - 20;
  const availableHeight = contentBottom - contentTop;

  const maxTextWidth = WIDTH - padX * 2;
  const quoteText = `"${opts.quote}"`;

  // Metin uzunsa fontu kademeli küçültüp alana sığdır.
  let fontSize = 62;
  let lineHeight = 82;
  let lines: string[] = [];
  ctx.textAlign = "center";
  while (fontSize >= 30) {
    ctx.font = `italic 500 ${fontSize}px Petrona, Georgia, serif`;
    lines = wrapText(ctx, quoteText, maxTextWidth);
    lineHeight = Math.round(fontSize * 1.32);
    if (lines.length * lineHeight <= availableHeight) break;
    fontSize -= 4;
  }
  fontSize = Math.max(fontSize, 30);
  ctx.font = `italic 500 ${fontSize}px Petrona, Georgia, serif`;

  // Minimum fontta bile sığmıyorsa (aşırı uzun metin): fazla satırları kes.
  const maxLines = Math.max(1, Math.floor(availableHeight / lineHeight));
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    const last = kept[kept.length - 1].replace(/["\s]+$/, "");
    kept[kept.length - 1] = `${last}…"`;
    lines = kept;
  }

  // Ana söz — ayrılan alanın içinde dikeyde ortalanmış
  ctx.fillStyle = CREAM;
  const blockHeight = Math.min(lines.length * lineHeight, availableHeight);
  let y = contentTop + Math.max(0, (availableHeight - blockHeight) / 2) + lineHeight / 2 + fontSize * 0.16;
  for (const line of lines) {
    ctx.fillText(line, WIDTH / 2, y);
    y += lineHeight;
  }

  // Alt bilgi / atıf
  if (opts.attribution) {
    ctx.fillStyle = CREAM_DIM;
    ctx.font = "600 28px Figtree, system-ui, sans-serif";
    ctx.fillText(opts.attribution, WIDTH / 2, Math.max(y + 12, bottomStripTop - 44));
  }

  // Alt şerit: adres tekrar (görsel tek başına dolaşırsa da adres kalsın)
  ctx.strokeStyle = "rgba(242,234,220,0.16)";
  ctx.beginPath();
  ctx.moveTo(padX, HEIGHT - 120);
  ctx.lineTo(WIDTH - padX, HEIGHT - 120);
  ctx.stroke();

  ctx.fillStyle = CREAM_DIM;
  ctx.font = "600 26px Figtree, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(siteUrl.replace(/^https?:\/\//, ""), WIDTH / 2, HEIGHT - 76);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
  });
}
