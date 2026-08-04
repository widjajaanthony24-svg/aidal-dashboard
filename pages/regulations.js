import { useState, useEffect } from "react";

const API = "https://aidal-production.up.railway.app";

// ── Design tokens — identical to /verify and /transparency. ──────────────────
const surface       = "#FFFFFF";
const surfaceAlt    = "#FAFAFA";
const surfaceSunken = "#F4F4F5";
const ink           = "#09090B";
const inkMuted      = "#71717A";
const inkSubtle     = "#A1A1AA";
const line          = "rgba(0,0,0,0.08)";
const lineSolid     = "#E4E4E7";
const greenInk      = "#047857";
const accentColor   = "#5E6AD2";

const radius   = 8;
const radiusLg = 12;
const shadowXs = "0 1px 2px 0 rgba(0,0,0,0.05)";

const fontSans = "'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const fontMono = "'JetBrains Mono', SFMono-Regular, Consolas, monospace";

function SectionLabel({ children, style }) {
  return (
    <div style={{
      fontFamily: fontMono, fontSize: "10px", fontWeight: 500,
      letterSpacing: "0.14em", textTransform: "uppercase", color: inkSubtle, ...style,
    }}>
      {children}
    </div>
  );
}

function BindingChip({ isBinding }) {
  return (
    <span style={{
      fontFamily: fontMono, fontSize: "10px", fontWeight: 500, letterSpacing: "0.06em",
      textTransform: "uppercase", padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap",
      color: isBinding ? greenInk : "#B45309",
      background: isBinding ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.10)",
      border: `1px solid ${isBinding ? "rgba(16,185,129,0.22)" : "rgba(245,158,11,0.25)"}`,
    }}>
      {isBinding ? "Binding" : "Guidance"}
    </span>
  );
}

function fmtDate(d) {
  if (!d) return null;
  return d.slice(0, 10);
}

export default function Regulations() {
  const [regs, setRegs] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/regulation-watch`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setRegs(d.regulations))
      .catch(() => setError(true));
  }, []);

  const navLinkStyle = {
    fontSize: "13px", fontWeight: 500, color: inkMuted, textDecoration: "none",
    padding: "6px 10px", borderRadius: radius, transition: "background 0.15s ease, color 0.15s ease",
  };

  const byJurisdiction = {};
  (regs || []).forEach((r) => {
    (byJurisdiction[r.jurisdiction] = byJurisdiction[r.jurisdiction] || []).push(r);
  });
  const mostRecentVerified = (regs || []).reduce((max, r) => {
    if (!r.verified_date) return max;
    return !max || r.verified_date > max ? r.verified_date : max;
  }, null);

  return (
    <div style={{ minHeight: "100vh", background: surface, color: ink, fontFamily: fontSans, fontSize: "13px", lineHeight: 1.6, letterSpacing: "-0.011em", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; }
        body { font-feature-settings: "cv02", "cv03", "cv04", "cv11"; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${lineSolid}; border-radius: 999px; border: 3px solid ${surface}; }
        .nav-link:hover { background: ${surfaceSunken}; color: ${ink} !important; }
        .nav-cta:hover { background: #27272A !important; }
        a { color: inherit; }
        @media (max-width: 560px) {
          .page-header { padding: 0 1rem !important; }
          .page-header-links { gap: 0.25rem !important; }
          .page-content { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
        }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="page-header" style={{
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "0 1.5rem",
        height: "56px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px) saturate(180%)",
        WebkitBackdropFilter: "blur(12px) saturate(180%)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <a href="https://tryaidal.com" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src="/aidal-logo-black.png?v=2" alt="AIDAL." style={{ height: "22px", width: "auto", display: "block" }} />
        </a>
        <div className="page-header-links" style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          <a href="/transparency" className="nav-link" style={navLinkStyle}>Transparency</a>
          <a href="/verify" className="nav-link" style={navLinkStyle}>Verify</a>
          <a href="/regulations" className="nav-link" style={{ ...navLinkStyle, color: ink, background: surfaceSunken }}>Regulations</a>
          <a href="https://aidal-dashboard.vercel.app" className="nav-link" style={navLinkStyle}>Dashboard</a>
          <a
            href="https://tryaidal.com/#get-key"
            className="nav-cta"
            style={{
              fontSize: "13px", fontWeight: 500, color: surface, textDecoration: "none",
              background: ink, border: "1px solid rgba(255,255,255,0.08)", padding: "7px 14px",
              borderRadius: radius, boxShadow: shadowXs, marginLeft: "0.5rem",
              transition: "background 0.15s ease",
            }}
          >
            Get API key
          </a>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="page-content" style={{ maxWidth: 780, margin: "0 auto", padding: "4.5rem 2rem 5rem" }}>

        <SectionLabel style={{ marginBottom: "1.25rem" }}>Regulation tracker</SectionLabel>

        <h1 style={{
          fontFamily: fontSans,
          fontSize: "clamp(30px, 5vw, 46px)",
          fontWeight: 600,
          lineHeight: 1.1,
          color: ink,
          margin: "0 0 1rem",
          letterSpacing: "-0.035em",
        }}>
          The regulations behind<br />
          <span style={{ color: inkSubtle }}>every AIDAL decision.</span>
        </h1>

        <p style={{ fontSize: "16px", color: inkMuted, lineHeight: 1.65, marginBottom: "1.5rem", maxWidth: 560 }}>
          AI-decision regulation for the jurisdictions AIDAL covers, read from the actual regulator text — not a vendor's paraphrase of it. Every entry links to its primary source.
        </p>

        {/* The disclosure that matters most on this page. */}
        <div style={{
          marginBottom: "2.5rem",
          padding: "1rem 1.25rem",
          background: "rgba(94,106,210,0.05)",
          border: `1px solid rgba(94,106,210,0.20)`,
          borderLeft: `3px solid ${accentColor}`,
          borderRadius: radius,
          fontSize: "13px",
          color: inkMuted,
          lineHeight: 1.7,
        }}>
          <strong style={{ color: ink, fontWeight: 600 }}>Not legal advice.</strong> Regulator pages are checked automatically every day; an entry only appears below once a human has read the actual source and confirmed it{mostRecentVerified ? ` — most recently on ${mostRecentVerified}` : ""}. Always confirm against the primary source linked on each entry before relying on it.
        </div>

        {error ? (
          <div style={{ fontSize: "13px", color: inkMuted, padding: "2rem 0" }}>
            Couldn&apos;t reach AIDAL&apos;s servers just now — try again shortly.
          </div>
        ) : !regs ? (
          <div style={{ fontSize: "13px", color: inkSubtle, fontFamily: fontMono, padding: "2rem 0" }}>Loading…</div>
        ) : (
          <>
            {/* Scan-first summary: jump straight to a jurisdiction instead of
                scrolling past ones you don't need. */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "2.5rem" }}>
              {Object.keys(byJurisdiction).sort().map((jurisdiction) => {
                const entries = byJurisdiction[jurisdiction];
                const bindingCount = entries.filter((r) => r.is_binding).length;
                return (
                  <a
                    key={jurisdiction}
                    href={`#${jurisdiction}`}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px", textDecoration: "none",
                      padding: "8px 12px", background: surfaceAlt, border: `1px solid ${line}`,
                      borderRadius: radius, fontSize: "12.5px", color: ink, fontWeight: 500,
                    }}
                  >
                    {jurisdiction}
                    <span style={{ fontSize: "11px", color: inkSubtle, fontFamily: fontMono, fontWeight: 400 }}>
                      {entries.length} · {bindingCount} binding
                    </span>
                  </a>
                );
              })}
            </div>

            {Object.keys(byJurisdiction).sort().map((jurisdiction) => (
            <div key={jurisdiction} id={jurisdiction} style={{ marginBottom: "2.25rem", scrollMarginTop: "72px" }}>
              <SectionLabel style={{ marginBottom: "0.875rem" }}>{jurisdiction}</SectionLabel>
              <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: radiusLg, boxShadow: shadowXs, overflow: "hidden" }}>
                {byJurisdiction[jurisdiction].map((r, i) => (
                  <div
                    key={r.id}
                    style={{
                      padding: "1.125rem 1.5rem",
                      borderBottom: i !== byJurisdiction[jurisdiction].length - 1 ? `1px solid ${line}` : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: ink, letterSpacing: "-0.015em" }}>{r.regulation_name}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <BindingChip isBinding={r.is_binding} />
                        {fmtDate(r.effective_date) && <span style={{ fontSize: "11px", color: inkSubtle, fontFamily: fontMono }}>eff. {fmtDate(r.effective_date)}</span>}
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", color: inkMuted, lineHeight: 1.7, marginBottom: "10px" }}>{r.summary}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                      {r.source_url ? (
                        <a href={r.source_url} target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: accentColor, textDecoration: "underline" }}>
                          Primary source ↗
                        </a>
                      ) : <span />}
                      {fmtDate(r.verified_date) && <span style={{ fontSize: "11px", color: inkSubtle, fontFamily: fontMono }}>verified {fmtDate(r.verified_date)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            ))}
          </>
        )}

        {/* ── Footer notes ─────────────────────────────────────────────── */}
        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: `1px solid ${line}`, fontSize: "12px", color: inkSubtle, lineHeight: 1.7 }}>
          Found something out of date or wrong here?{" "}
          <a href="mailto:anthony@tryaidal.com?subject=Regulation%20tracker%20correction" style={{ color: accentColor, textDecoration: "underline" }}>
            anthony@tryaidal.com
          </a>. We&apos;ll fix it and say so.
        </div>
      </div>
    </div>
  );
}
