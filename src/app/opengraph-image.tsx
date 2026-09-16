import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Orhan Yaşlı – Sınav Koçluğu ve Psikolojik Danışmanlık";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#241A1C";
const INK2 = "#1A1414";
const CREAM = "#F2EADC";
const SAGE = "#D9B26B";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(180deg, ${INK} 0%, ${INK2} 100%)`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            fontSize: 620,
            color: CREAM,
            opacity: 0.05,
            display: "flex",
          }}
        >
          Ψ
        </div>
        <div
          style={{
            fontSize: 72,
            color: SAGE,
            marginBottom: 8,
            display: "flex",
          }}
        >
          Ψ
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: CREAM,
            letterSpacing: -1,
            display: "flex",
          }}
        >
          Orhan Yaşlı
        </div>
        <div
          style={{
            fontSize: 32,
            color: SAGE,
            marginTop: 18,
            display: "flex",
          }}
        >
          Sınav Koçluğu ve Psikolojik Danışmanlık
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(242,234,220,0.6)",
            marginTop: 34,
            display: "flex",
          }}
        >
          psdorhanyasli.com.tr
        </div>
      </div>
    ),
    { ...size }
  );
}
