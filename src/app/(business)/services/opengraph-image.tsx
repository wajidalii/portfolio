import { ImageResponse } from "next/og";

export const alt = "Wajid Ali — high-performance websites, custom SaaS and intelligent automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function ServicesOpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0B1020", color: "#F4F7FB", padding: "66px 74px", fontFamily: "sans-serif", border: "18px solid #151E32" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 23, color: "#7C9BFF", letterSpacing: 4 }}><span>WAJID ALI / ENGINEERING</span><span>01 — SERVICES</span></div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 72, fontWeight: 700, lineHeight: 1.06, letterSpacing: -3 }}><span>High-performance websites.</span><span>Custom SaaS.</span><span style={{ color: "#7C9BFF" }}>Intelligent automation.</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#A7B4CC", fontSize: 24 }}><span>Direct collaboration. Considered solutions.</span><span>wajidali.dev/services</span></div>
    </div>,
    size,
  );
}
