import { ImageResponse } from "next/og";
import PixelIcon from "./components/icons/PixelIcon";
import { SITE } from "./config/site";

export const alt = `${SITE.name} — Application Developer, Zurich`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card: a Platinum window on the default desktop colour.
export default function OpenGraphImage() {
    const ridges = Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ display: "flex", height: 2, borderTop: "2px solid #ffffff", borderBottom: "2px solid #8a8a8a", marginTop: i ? 2 : 0 }} />
    ));

    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#6c72b9" }}>
                <div style={{ display: "flex", flexDirection: "column", width: 940, background: "#dddddd", border: "3px solid #000", boxShadow: "8px 8px 0 rgba(0,0,0,0.35)" }}>
                    {/* title bar */}
                    <div style={{ display: "flex", alignItems: "center", height: 60, padding: "0 18px" }}>
                        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{ridges}</div>
                        <div style={{ display: "flex", padding: "0 24px", fontSize: 30, color: "#000" }}>About Lasse</div>
                        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{ridges}</div>
                    </div>
                    {/* content */}
                    <div style={{ display: "flex", alignItems: "center", gap: 40, margin: "0 18px 18px", padding: "56px 48px", background: "#ffffff", border: "3px solid #000" }}>
                        <div style={{ display: "flex", padding: 20, background: "#dddddd", border: "3px solid #000" }}>
                            <PixelIcon name="person" size={160} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ fontSize: 76, fontWeight: 700, color: "#000", lineHeight: 1.05 }}>{SITE.name}</div>
                            <div style={{ fontSize: 34, color: "#141414", marginTop: 16 }}>Application Developer in Training</div>
                            <div style={{ fontSize: 32, color: "#4e4e4e", marginTop: 10 }}>Zurich, Switzerland</div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        size,
    );
}
