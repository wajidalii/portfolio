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
          background: "#121110",
          color: "#EEE8DC",
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
              background: "#FF5A1F",
              color: "#121110",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            WA
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#A39B8C" }}>
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
          <span style={{ color: "#FF6A33" }}>scalable&nbsp;</span>
          <span style={{ color: "#FF6A33" }}>systems&nbsp;</span>
          <span>and&nbsp;</span>
          <span style={{ color: "#F4B63F" }}>AI-first&nbsp;</span>
          <span style={{ color: "#F4B63F" }}>products.</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
