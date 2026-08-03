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
          background: "#0B0D0F",
          color: "#E8ECEF",
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
              borderRadius: 16,
              background: "linear-gradient(150deg, #5C9CF5, #2FB58C)",
              color: "#08090A",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            WA
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#94A2AD" }}>
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
          <span>Senior&nbsp;</span>
          <span>software&nbsp;</span>
          <span>engineer&nbsp;</span>
          <span>building&nbsp;</span>
          <span style={{ color: "#5C9CF5" }}>scalable&nbsp;</span>
          <span style={{ color: "#5C9CF5" }}>systems&nbsp;</span>
          <span>and&nbsp;</span>
          <span style={{ color: "#2FB58C" }}>AI-first&nbsp;</span>
          <span style={{ color: "#2FB58C" }}>products.</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
