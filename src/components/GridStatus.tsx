import { useState, useEffect, useCallback } from "react";

interface ProviderStatus {
  provider: string;
  status: "operational" | "degraded" | "down" | "unknown";
  latency?: number;
  lastCheck?: string;
}

type GridState = "LOADING" | "ONLINE" | "DEGRADED" | "OFFLINE";

const STATUS_CONFIG = {
  ONLINE: {
    text: "GRID OPTIMAL",
    color: "var(--color-accent-500)",
    animation: "statusPulse 2s infinite",
    glowAnimation: "indicatorGlow 2s infinite",
  },
  DEGRADED: {
    text: "PARTIAL SIGNAL",
    color: "var(--color-base-400)",
    animation: "statusPulse 2s infinite",
    glowAnimation: "indicatorGlow 2s infinite",
  },
  OFFLINE: {
    text: "CONNECTION SEVERED",
    color: "var(--color-spot-red)",
    animation: "none",
    glowAnimation: "none",
  },
  LOADING: {
    text: "INITIALIZING...",
    color: "var(--color-base-600)",
    animation: "statusPulse 1.5s infinite",
    glowAnimation: "none",
  },
} as const;

const PROVIDER_STATUS_COLORS: Record<string, string> = {
  operational: "var(--color-accent-500)",
  degraded: "var(--color-base-400)",
  down: "var(--color-spot-red)",
  unknown: "var(--color-base-600)",
};

const rivetPositions = [
  { top: 10, left: 10 },
  { top: 10, right: 10 },
  { bottom: 10, left: 10 },
  { bottom: 10, right: 10 },
];

function Rivet({ style }: { style: React.CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 14,
        height: 14,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 40% 35%, #666 0%, #3a3a3a 50%, #2a2a2a 100%)",
        boxShadow:
          "inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.08)",
        ...style,
      }}
    />
  );
}

function CalibrationLine() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        justifyContent: "center",
      }}
    >
      {Array.from({ length: 11 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i % 5 === 0 ? 2 : 1,
            height: i % 5 === 0 ? 12 : 6,
            background: i % 5 === 0 ? "#555" : "#333",
          }}
        />
      ))}
    </div>
  );
}

function ProviderLight({ provider }: { provider: ProviderStatus }) {
  const color = PROVIDER_STATUS_COLORS[provider.status] || "#666";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 0",
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 4px ${color}, 0 0 8px ${color}`,
          border: "1px solid #333",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 11,
          letterSpacing: 3,
          color: "#888",
          textTransform: "uppercase",
          flex: 1,
        }}
      >
        {provider.provider}
      </span>
      {provider.latency != null && (
        <span style={{ fontSize: 10, color: "#555", letterSpacing: 1 }}>
          {provider.latency}ms
        </span>
      )}
    </div>
  );
}

function deriveGridState(providers: ProviderStatus[]): GridState {
  if (providers.length === 0) return "ONLINE";
  const down = providers.filter((p) => p.status === "down").length;
  const degraded = providers.filter((p) => p.status === "degraded").length;
  if (down === providers.length) return "OFFLINE";
  if (down > 0 || degraded > 0) return "DEGRADED";
  return "ONLINE";
}

const GridStatus: React.FC = () => {
  const [gridState, setGridState] = useState<GridState>("LOADING");
  const [providers, setProviders] = useState<ProviderStatus[]>([]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status");
      if (res.ok) {
        const data: ProviderStatus[] = await res.json();
        setProviders(data);
        setGridState(deriveGridState(data));
      } else {
        setGridState("ONLINE");
      }
    } catch {
      // API not available (local dev, no KV binding). Show nominal.
      setGridState("ONLINE");
    }
  }, []);

  useEffect(() => {
    const delay = 800 + Math.random() * 700;
    const timer = setTimeout(fetchStatus, delay);
    const interval = setInterval(fetchStatus, 30000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchStatus]);

  const config = STATUS_CONFIG[gridState];

  return (
    <div className="font-mono" style={{ maxWidth: 600, margin: "0 auto" }}>
      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes indicatorGlow {
          0%, 100% { box-shadow: 0 0 6px var(--indicator-color), 0 0 12px var(--indicator-color); }
          50% { box-shadow: 0 0 10px var(--indicator-color), 0 0 24px var(--indicator-color); }
        }
      `}</style>

      {/* Hazard stripe bar */}
      <div
        style={{
          height: 8,
          background:
            "repeating-linear-gradient(45deg, #0a0a0a 0px, #0a0a0a 10px, rgba(255,215,0,0.35) 10px, rgba(255,215,0,0.35) 20px)",
          borderRadius: "4px 4px 0 0",
        }}
      />

      {/* Main panel */}
      <div
        style={{
          position: "relative",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 40%, rgba(0,0,0,0.15) 100%), #1a1a1a",
          border: "3px solid #2a2a2a",
          borderTop: "none",
          borderRadius: "0 0 4px 4px",
          boxShadow:
            "inset 0 2px 8px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.4)",
          padding: "40px 32px 32px",
          overflow: "hidden",
        }}
      >
        {/* Scanline overlay */}
        {gridState === "ONLINE" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(transparent 50%, rgba(0,255,0,0.02) 50%)",
              backgroundSize: "100% 4px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* Rivets */}
        {rivetPositions.map((pos, i) => (
          <Rivet key={i} style={pos} />
        ))}

        {/* Panel header */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: 6,
              color: "#555",
              textTransform: "uppercase",
            }}
          >
            Grid Monitor System
          </div>
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 36,
              fontSize: 9,
              color: "#333",
              letterSpacing: 2,
            }}
          >
            SN: HF-GM-1947
          </div>
        </div>

        {/* Top calibration */}
        <div style={{ marginBottom: 20 }}>
          <CalibrationLine />
        </div>

        {/* Gauge area */}
        <div
          style={{
            textAlign: "center",
            padding: "24px 0",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Indicator light */}
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: config.color,
              margin: "0 auto 20px",
              boxShadow: `0 0 6px ${config.color}, 0 0 12px ${config.color}`,
              animation: config.glowAnimation,
              border: "2px solid #333",
              // @ts-expect-error CSS custom property
              "--indicator-color": config.color,
            }}
          />

          {/* Status text */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 8,
              color: config.color,
              animation: config.animation,
              textShadow:
                gridState !== "LOADING"
                  ? `0 0 8px ${config.color}`
                  : "none",
              textTransform: "uppercase",
            }}
          >
            {config.text}
          </div>

          {/* Status subtext */}
          <div
            style={{
              fontSize: 11,
              color: "#444",
              letterSpacing: 4,
              marginTop: 12,
              textTransform: "uppercase",
            }}
          >
            {gridState === "ONLINE" && "All Systems Nominal"}
            {gridState === "DEGRADED" && "Some Providers Impacted"}
            {gridState === "OFFLINE" && "Check Main Bus Power"}
            {gridState === "LOADING" && "Contacting Grid"}
          </div>
        </div>

        {/* Provider status lights */}
        {providers.length > 0 && (
          <div
            style={{
              marginTop: 16,
              padding: "16px 20px",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid #222",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 4,
                color: "#555",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Provider Array
            </div>
            {providers.map((p) => (
              <ProviderLight key={p.provider} provider={p} />
            ))}
          </div>
        )}

        {/* Bottom calibration */}
        <div style={{ marginTop: 20 }}>
          <CalibrationLine />
        </div>

        {/* Bottom warning */}
        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #222",
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: 4,
              color: "rgba(255,215,0,0.4)",
              textTransform: "uppercase",
            }}
          >
            Authorized Personnel Only
          </div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: 2,
              color: "#2a2a2a",
              marginTop: 4,
            }}
          >
            HOB.FARM GRID SYSTEMS DIV.
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridStatus;
