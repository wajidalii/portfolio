import { ImageResponse } from "next/og";
import { PERSON } from "@/lib/site-config";

export const alt = `${PERSON.name} — Senior Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0B1020",
          color: "#F4F7FB",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 8,
              background: "#7C9BFF",
              color: "#0B1020",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            WA
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#A7B4CC" }}>
            wajidali.dev
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: 980,
          }}
        >
          <span>Thoughtful software.</span>
          <span style={{ color: "#7C9BFF" }}>
            Built for real business needs.
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
