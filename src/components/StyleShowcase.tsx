import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { transformImageUrl, transformVideoUrl, videoPosterUrl } from "../lib/media-transforms";
import { STYLE_CARDS } from "../data/style-cards";

// ── CDN Config ──
const CDN = "https://cdn.hob.farm/pages/home/style-card";

type StyleVariant = {
  intent: string;
  archetype: string;
  mood: string;
  colors: string[];
  setting: string;
  lighting: string;
  render: string;
  textures: string[];
};

type StyleCardData = {
  id: number;
  slug: string;
  label: string;
  isBaseline?: boolean;
  variants?: StyleVariant[];
};

const styleCards = STYLE_CARDS as StyleCardData[];

// ── URL builders ──
const url = {
  video: (slug: string) => transformVideoUrl(`${CDN}/${slug}-vid.mp4`, { width: 640 }),
  image: (slug: string, n: number) => transformImageUrl(`${CDN}/${slug}${n}.jpg`, { width: 640, quality: 85, fit: "cover" }),
  poster: (slug: string) => videoPosterUrl(`${CDN}/${slug}-vid.mp4`, 640),
};

// ── Swatch ──
function Swatch({ hex }: { hex: string }) {
  return (
    <div
      style={{
        width: 18, height: 18, borderRadius: 3,
        backgroundColor: hex, border: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}
      title={hex}
    />
  );
}

// ── Pill ──
function Pill({ children }: { children: ReactNode }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", fontSize: 10,
      fontFamily: "'IBM Plex Mono', monospace", color: "#707070",
      border: "1px solid #1e1e1e", borderRadius: 3,
      marginRight: 5, marginBottom: 4, whiteSpace: "nowrap",
      maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis",
    }}>
      {children}
    </span>
  );
}

const labelStyle: CSSProperties = {
  fontSize: 10, fontFamily: "'IBM Plex Mono', monospace",
  textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5, color: "#444",
};

// ── Variant Metadata ──
function VariantPanel({ v }: { v?: StyleVariant }) {
  if (!v) return null;
  return (
    <div style={{ padding: "14px 0 4px", fontSize: 12, color: "#909090", lineHeight: 1.6 }}>
      <div style={{ color: "#e0e0e0", fontSize: 13, marginBottom: 2 }}>{v.intent}</div>
      <div style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>{v.archetype}</div>

      <div style={{ marginBottom: 14 }}>
        <div style={labelStyle}>Mood</div>
        <div style={{ color: "#a0a0a0", marginBottom: 8 }}>{v.mood}</div>
        <div style={{ display: "flex", gap: 5 }}>
          {v.colors.map((c: string, i: number) => <Swatch key={i} hex={c} />)}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={labelStyle}>Setting</div>
        <div style={{ color: "#a0a0a0" }}>{v.setting}</div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={labelStyle}>Technical</div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {[v.lighting, v.render].flatMap((s: string) => s.split(",").map((t: string) => t.trim())).map((t: string, i: number) => <Pill key={i}>{t}</Pill>)}
        </div>
      </div>

      <div>
        <div style={labelStyle}>Textures</div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {v.textures.map((t: string, i: number) => <Pill key={i}>{t}</Pill>)}
        </div>
      </div>
    </div>
  );
}

// ── Card ──
function StyleCard({ card, isActive, onClick }: { card: StyleCardData; isActive: boolean; onClick: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [vIdx, setVIdx] = useState(0);
  const vidRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Autoplay when card is visible in viewport
  useEffect(() => {
    const el = cardRef.current;
    const video = vidRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={{
        width: "100%", minHeight: 0, display: "flex", flexDirection: "column",
        background: isActive ? "#121212" : "#0b0b0b",
        border: `1px solid ${isActive ? "#39FF14" : "#1a1a1a"}`,
        borderRadius: 6, overflow: "hidden", cursor: "pointer",
        transition: "border-color 0.3s, background 0.3s",
        boxShadow: isActive ? "0 0 20px rgba(57,255,20,0.05)" : "none",
      }}
    >
      {/* 2:3 media */}
      <div style={{
        position: "relative", boxSizing: "content-box", width: "100%", height: 0, paddingBottom: "150%",
        background: "#080808", overflow: "hidden", flexShrink: 0,
      }}>
        <video
          ref={vidRef} poster={url.poster(card.slug)}
          loop muted playsInline preload="metadata"
          onContextMenu={(e) => e.preventDefault()}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src={url.video(card.slug)} type="video/mp4" />
        </video>
        {isActive && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            width: 7, height: 7, borderRadius: "50%",
            background: "#39FF14", boxShadow: "0 0 6px #39FF14",
            animation: "pulse 2s infinite",
          }} />
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
          color: isActive ? "#f5f5f5" : "#808080", transition: "color 0.3s",
        }}>
          {card.label}
        </div>

        {/* Mood preview when collapsed */}
        {card.variants && (
          <div style={{
            fontSize: 11, color: "#333", fontFamily: "'IBM Plex Sans', sans-serif",
            marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {card.variants[0].mood}
          </div>
        )}

        {/* Details toggle */}
        {card.variants && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            style={{
              background: "none", border: "none", color: "#39FF14",
              fontSize: 10, fontFamily: "'IBM Plex Mono', monospace",
              cursor: "pointer", padding: "6px 0 0", marginTop: 6, opacity: 0.4,
              transition: "opacity 0.2s", textTransform: "uppercase", letterSpacing: 1.5,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
          >
            {expanded ? "Collapse \u25B4" : "Details \u25BE"}
          </button>
        )}

        {/* Expanded */}
        {expanded && card.variants && (
          <div style={{ borderTop: "1px solid #1a1a1a", marginTop: 10 }}>
            {card.variants.length > 1 && (
              <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a" }}>
                {card.variants.map((_, i: number) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setVIdx(i); }}
                    style={{
                      background: "none", border: "none",
                      borderBottom: vIdx === i ? "2px solid #39FF14" : "2px solid transparent",
                      color: vIdx === i ? "#e0e0e0" : "#333",
                      fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
                      padding: "8px 14px", cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    Output {i + 1}
                  </button>
                ))}
              </div>
            )}
            <VariantPanel v={card.variants[vIdx]} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Showcase Section ──
export default function StyleShowcase() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="style-showcase" style={{
      minHeight: "100vh", background: "#0a0a0a",
      padding: "64px 20px", fontFamily: "'IBM Plex Sans', sans-serif",
    }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .style-showcase *{box-sizing:border-box;margin:0}
        .style-showcase img,.style-showcase video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .style-showcase .style-grid{display:grid;grid-template-columns:repeat(4,1fr);align-items:start;gap:14px;max-width:1240px;margin:0 auto}
        @media(max-width:1024px){.style-showcase .style-grid{grid-template-columns:repeat(2,1fr);max-width:540px}}
        @media(max-width:768px){.style-showcase .style-grid{grid-template-columns:1fr;max-width:360px}}
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          fontSize: 10, fontFamily: "'IBM Plex Mono', monospace",
          color: "#39FF14", textTransform: "uppercase",
          letterSpacing: 4, marginBottom: 14, opacity: 0.4,
        }}>
          StyleFusion
        </div>
        <h2 style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 26, fontWeight: 300, color: "#f5f5f5", letterSpacing: 0.5,
        }}>
          One character. Four styles. Zero drift.
        </h2>
        <p style={{
          fontSize: 13, color: "#484848", marginTop: 10,
          maxWidth: 440, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7,
        }}>
          Same identity DNA, different style references. The subject persists
          while everything around her transforms.
        </p>
      </div>

      {/* 4-column grid */}
      <div className="style-grid">
        {styleCards.map((card, i: number) => (
          <div key={card.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both`, display: "flex", minWidth: 0 }}>
            <StyleCard
              card={card}
              isActive={active === i}
              onClick={() => setActive(active === i ? null : i)}
            />
          </div>
        ))}
      </div>

      {/* Gallery link */}
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <a
          href="/gallery"
          style={{
            color: "#39FF14", fontSize: 13,
            fontFamily: "'IBM Plex Sans', sans-serif",
            textDecoration: "none", opacity: 0.4, transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
        >
          View the full gallery &rarr;
        </a>
      </div>
    </div>
  );
}
