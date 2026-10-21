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
          background: "#0E1114",
          color: "#E6EBF0",
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
              background: "#A9C7E8",
              color: "#0E1114",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            WA
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#8B96A2" }}>
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
          <span style={{ color: "#A9C7E8" }}>scalable&nbsp;</span>
          <span style={{ color: "#A9C7E8" }}>systems&nbsp;</span>
          <span>and&nbsp;</span>
          <span style={{ color: "#CFD8E2" }}>AI-first&nbsp;</span>
          <span style={{ color: "#CFD8E2" }}>products.</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
