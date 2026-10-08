import { ImageResponse } from "next/og"
export const alt = "GAMEBOX.WIKI — Discover. Remember. Play."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", padding: 80, background: "#09090b", color: "white" }}><div style={{ fontSize: 30, color: "#6ee7b7", letterSpacing: 6 }}>GAMEBOX.WIKI</div><div style={{ fontSize: 76, fontWeight: 700, marginTop: 45 }}>DISCOVER. REMEMBER. PLAY.</div><div style={{ fontSize: 30, color: "#a1a1aa", marginTop: 35 }}>100 curated games. Explained discovery.</div></div>, size)
}
