// Shared design for Orion's Open Graph / Twitter share images (1200×630).
// Rendered with next/og's ImageResponse (Satori): flexbox + plain styles only,
// and pure geometry (rings, dots) instead of subject symbol glyphs, which the
// bundled font cannot draw reliably.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Matches the .accent-* custom properties in app/styles/base.css.
export const accentHex: Record<string, string> = {
  violet: "#a99bff",
  blue: "#83b8ff",
  teal: "#78dfd0",
  amber: "#e9c27c",
  rose: "#ff9ba9",
};

export function OgCard({
  eyebrow,
  title,
  summary,
  accent = "violet",
}: {
  eyebrow: string;
  title: string;
  summary: string;
  accent?: string;
}) {
  const color = accentHex[accent] ?? accentHex.violet;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#080b16",
        backgroundImage: `radial-gradient(ellipse 700px 340px at 85% -10%, ${color}26, transparent)`,
        padding: "64px 72px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -130,
          top: -40,
          width: 430,
          height: 190,
          border: `2px solid ${color}55`,
          borderRadius: "50%",
          transform: "rotate(-24deg)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -60,
          top: 30,
          width: 26,
          height: 26,
          borderRadius: "50%",
          backgroundColor: color,
          display: "flex",
        }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: 30, color: color, letterSpacing: 2 }}>✳</span>
        <span style={{ fontSize: 26, color: "#eef1fa", marginLeft: 14, letterSpacing: 1 }}>
          orion<span style={{ color: color }}>.</span>
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: 21,
            color: color,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 22,
          }}
        >
          {eyebrow}
        </span>
        <span style={{ fontSize: 84, color: "#f3f5fc", fontWeight: 600, lineHeight: 1.05 }}>
          {title}
          <span style={{ color: color }}>.</span>
        </span>
        <span style={{ fontSize: 29, color: "#9ca8c0", lineHeight: 1.5, marginTop: 26, maxWidth: 950 }}>
          {summary}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 19, color: "#7d89a3", letterSpacing: 3 }}>
          A GROWING ATLAS OF EVERYTHING WE DISCOVER
        </span>
        <span style={{ fontSize: 19, color: color, letterSpacing: 2 }}>ORION FIELD GUIDE</span>
      </div>
    </div>
  );
}
