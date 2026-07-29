import { useState, useEffect } from "react";

const API = "https://aidal-production.up.railway.app";

// ── Design tokens — Linear light. Same values as the dashboard so the public
//    page and the product read as one product. ────────────────────────────────
const surface       = "#FFFFFF";
const surfaceAlt    = "#FAFAFA";
const surfaceSunken = "#F4F4F5";
const ink           = "#09090B";
const inkMuted      = "#71717A";
const inkSubtle     = "#A1A1AA";
const line          = "rgba(0,0,0,0.08)";
const lineSolid     = "#E4E4E7";
const green         = "#10B981";
const greenInk      = "#047857";
const red           = "#EF4444";
const redInk        = "#B91C1C";
const accentColor   = "#5E6AD2";

const radius   = 8;
const radiusLg = 12;
const shadowXs = "0 1px 2px 0 rgba(0,0,0,0.05)";
const shadowSm = "0 1px 2px 0 rgba(0,0,0,0.05), 0 2px 8px -2px rgba(0,0,0,0.06)";
const shadowLg = "0 1px 2px 0 rgba(0,0,0,0.04), 0 16px 48px -12px rgba(0,0,0,0.12)";

const fontSans = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const fontMono = "'JetBrains Mono', SFMono-Regular, Consolas, monospace";

// ── Helpers ─────────────────────────────────────────────────────────────────
function hashString(str) {
  return str.length > 20 ? str.slice(0, 8) + "..." + str.slice(-8) : str;
}

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

// Uppercase mono eyebrow used to open each block.
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

export default function PublicVerify() {
  const [auditId, setAuditId] = useState("");
  const [result, setResult]   = useState(null);
  const [status, setStatus]   = useState(null);
  const [steps, setSteps]     = useState([]);

  // Pre-fill from URL query param ?id=aud_xxxx
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id) setAuditId(id);
    }
  }, []);

  // Every line below corresponds to something that actually just happened —
  // no scripted delays standing in for work the server already finished
  // before the response arrived.
  const runVerification = async () => {
    const id = auditId.trim();
    if (!id) return;

    setResult(null);
    setSteps(["Request sent to AIDAL ledger..."]);
    setStatus("loading");

    try {
      const res = await fetch(`${API}/verify/public/${id}`);

      if (res.status === 404) {
        setStatus("notfound");
        setSteps(s => [...s, "✗ Audit ID not found in ledger."]);
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setSteps(s => [...s, "✗ Verification service error."]);
        return;
      }

      const data = await res.json();
      setSteps(s => [
        ...s,
        "Response received — server recomputed the SHA-256 hash and compared it against the stored value.",
        data.verified ? "✓ Hashes match — record is untampered." : "✗ Hash mismatch detected.",
      ]);
      setResult(data);
      setStatus(data.verified ? "verified" : "tampered");
    } catch (e) {
      setStatus("error");
      setSteps(s => [...s, "✗ Could not reach AIDAL's servers."]);
    }
  };

  const isVerified  = status === "verified";
  const isTampered  = status === "tampered";
  const isNotFound  = status === "notfound";
  const isError     = status === "error";
  const isLoading   = status === "loading";

  const inputStyle = {
    width: "100%",
    background: surface,
    border: `1px solid ${lineSolid}`,
    color: ink,
    padding: "10px 14px",
    fontFamily: fontMono,
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: "0",
    borderRadius: radius,
    boxShadow: shadowXs,
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  };

  const labelStyle = {
    fontFamily: fontMono,
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: inkSubtle,
    display: "block",
    marginBottom: "7px",
  };

  const navLinkStyle = {
    fontSize: "13px", fontWeight: 500, color: inkMuted, textDecoration: "none",
    padding: "6px 10px", borderRadius: radius, transition: "background 0.15s ease, color 0.15s ease",
  };

  // Neutral state card (not found / unreachable service).
  const neutralCard = {
    background: surface,
    border: `1px solid ${line}`,
    borderRadius: radiusLg,
    padding: "1.5rem",
    boxShadow: shadowXs,
    animation: "fadeIn 0.3s ease",
  };

  return (
    <div style={{ minHeight: "100vh", background: surface, color: ink, fontFamily: fontSans, fontSize: "13px", lineHeight: 1.6, letterSpacing: "-0.011em", WebkitFontSmoothing: "antialiased" }}>

      {/* Global styles */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; }
        body { font-feature-settings: "cv02", "cv03", "cv04", "cv11"; }
        @media (max-width: 560px) {
          .page-header { padding: 0 1rem !important; }
          .page-header-links { gap: 0.25rem !important; }
          .page-content { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          .how-it-works-grid { grid-template-columns: 1fr !important; }
          .data-row { flex-direction: column !important; gap: 2px !important; }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.85); }
        }
        input::placeholder { color: ${inkSubtle}; font-family: ${fontMono}; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${lineSolid}; border-radius: 999px; border: 3px solid ${surface}; }
        .verify-input:focus { border-color: rgba(94,106,210,0.6) !important; box-shadow: 0 0 0 3px rgba(94,106,210,0.12) !important; }
        .verify-btn:hover:not(:disabled) { background: #27272A; }
        .verify-btn:active:not(:disabled) { transform: translateY(1px); }
        .nav-link:hover { background: ${surfaceSunken}; color: ${ink} !important; }
        .nav-cta:hover { background: #27272A !important; }
        .how-card:hover { box-shadow: ${shadowSm}; }
        /* Dot-grid canvas, masked so it never reaches the fold. */
        .dot-canvas {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, rgba(9,9,11,0.09) 1px, transparent 0);
          background-size: 24px 24px;
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 25%, transparent 75%);
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 25%, transparent 75%);
        }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
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
          <img src="/aidal-logo-black.png" alt="AIDAL." style={{ height: "22px", width: "auto", display: "block" }} />
        </a>
        <div className="page-header-links" style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          <a href="/transparency" className="nav-link" style={navLinkStyle}>Transparency</a>
          <a href="https://aidal-dashboard.vercel.app" className="nav-link" style={navLinkStyle}>Dashboard</a>
          <a
            href="https://tryaidal.com/#get-key"
            className="nav-cta"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: surface,
              textDecoration: "none",
              background: ink,
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "7px 14px",
              borderRadius: radius,
              boxShadow: shadowXs,
              marginLeft: "0.5rem",
              transition: "background 0.15s ease",
            }}
          >
            Get API key
          </a>
        </div>
      </div>

      {/* ── Hero + verification console ────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div className="dot-canvas" aria-hidden="true" />
        <div className="page-content" style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: "4.5rem 2rem 5rem" }}>

          <SectionLabel style={{ marginBottom: "1.25rem" }}>Public verification</SectionLabel>

          <h1 style={{
            fontFamily: fontSans,
            fontSize: "clamp(32px, 5.5vw, 52px)",
            fontWeight: 600,
            lineHeight: 1.08,
            color: ink,
            margin: "0 0 1rem",
            letterSpacing: "-0.035em",
          }}>
            Verify any<br />
            <span style={{ color: inkSubtle }}>AI decision record.</span>
          </h1>

          <p style={{ fontSize: "16px", color: inkMuted, lineHeight: 1.65, marginBottom: "2.5rem", maxWidth: 540 }}>
            Paste an audit ID below. AIDAL will recompute the cryptographic hash and confirm whether the record is untampered — without revealing any sensitive data.
          </p>

          {/* ── Input card ─────────────────────────────────────────────────── */}
          <div style={{
            background: surface,
            border: `1px solid ${line}`,
            borderRadius: radiusLg,
            padding: "1.25rem",
            boxShadow: shadowLg,
            marginBottom: "2rem",
          }}>
            <label style={labelStyle}>Audit ID</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                className="verify-input"
                style={{ ...inputStyle, flex: "1 1 260px", width: "auto" }}
                placeholder="aud_a7f3c9b2d1e8..."
                value={auditId}
                onChange={e => { setAuditId(e.target.value); setResult(null); setStatus(null); setSteps([]); }}
                onKeyDown={e => e.key === "Enter" && runVerification()}
              />
              <button
                className="verify-btn"
                onClick={runVerification}
                disabled={isLoading || !auditId.trim()}
                style={{
                  background: ink,
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: surface,
                  padding: "0 20px",
                  height: "40px",
                  fontFamily: fontSans,
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: isLoading || !auditId.trim() ? "not-allowed" : "pointer",
                  opacity: isLoading || !auditId.trim() ? 0.5 : 1,
                  transition: "background 0.15s ease, opacity 0.15s ease",
                  borderRadius: radius,
                  boxShadow: shadowXs,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  whiteSpace: "nowrap",
                }}
              >
                {isLoading ? (
                  <>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: surface, display: "inline-block", animation: "pulse-dot 1.2s ease-in-out infinite" }} />
                    Verifying…
                  </>
                ) : (
                  <>Verify record →</>
                )}
              </button>
            </div>
            <div style={{ marginTop: "10px", fontSize: "12px", color: inkSubtle }}>
              No account, no API key — anyone holding an audit ID can run this check.
            </div>
          </div>

          {/* ── Verification log ───────────────────────────────────────────── */}
          {steps.length > 0 && (
            <div style={{
              background: surfaceAlt,
              border: `1px solid ${line}`,
              borderRadius: radiusLg,
              overflow: "hidden",
              marginBottom: "1.5rem",
              animation: "fadeIn 0.25s ease",
            }}>
              <div style={{ padding: "10px 16px", borderBottom: `1px solid ${line}`, background: surface }}>
                <SectionLabel>Verification log</SectionLabel>
              </div>
              <div style={{ padding: "12px 0" }}>
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className="data-row"
                    style={{
                      fontFamily: fontMono,
                      fontSize: "12px",
                      color: s.startsWith("✗") ? redInk : s.startsWith("✓") ? greenInk : inkMuted,
                      padding: "3px 16px",
                      lineHeight: 1.7,
                      animation: "fadeIn 0.3s ease",
                      display: "flex",
                      gap: "14px",
                    }}
                  >
                    <span style={{ color: inkSubtle, minWidth: "18px", fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span>{s}</span>
                  </div>
                ))}
                {isLoading && (
                  <div style={{ fontFamily: fontMono, fontSize: "12px", color: inkSubtle, padding: "3px 16px", display: "flex", gap: "14px", alignItems: "center" }}>
                    <span style={{ minWidth: "18px" }}>··</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: inkSubtle, display: "inline-block", animation: "pulse-dot 1.2s ease-in-out infinite" }} />
                      Running…
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Result: VERIFIED ───────────────────────────────────────────── */}
          {isVerified && result && (
            <div style={{
              background: surface,
              border: `1px solid ${line}`,
              borderRadius: radiusLg,
              overflow: "hidden",
              boxShadow: shadowLg,
              animation: "fadeIn 0.3s ease",
            }}>
              {/* Trust header — the one place colour carries the whole verdict. */}
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "1.25rem 1.5rem",
                background: "rgba(16,185,129,0.06)",
                borderBottom: `1px solid rgba(16,185,129,0.20)`,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(16,185,129,0.12)",
                  border: `1px solid rgba(16,185,129,0.30)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", color: greenInk, flexShrink: 0,
                }}>✓</div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: greenInk, letterSpacing: "-0.02em" }}>Record verified — untampered</div>
                  <div style={{ fontSize: "12.5px", color: inkMuted, marginTop: "1px" }}>This record has not been altered since it was first logged.</div>
                </div>
              </div>

              {/* Data rows */}
              <div style={{ padding: "0.5rem 1.5rem 1.25rem" }}>
                {[
                  ["Audit ID",          result.audit_id,                                            true],
                  ["Decision type",     result.decision_type || "—",                                false],
                  ["Jurisdiction",      result.jurisdiction || "—",                                 false],
                  ["Logged at",         formatDate(result.logged_at),                               false],
                  ["Hash",              result.hash ? hashString(result.hash) : "—",                true],
                  ["Previous hash",     result.prev_hash ? hashString(result.prev_hash) : "GENESIS (first record)", true],
                  ["Compliance status", result.compliance_status || "—",                            false],
                  ["Regulator",         result.regulator || "—",                                    false],
                ].map(([k, v, mono]) => (
                  <div key={k} className="data-row" style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "10px 0",
                    borderBottom: `1px solid ${line}`,
                    alignItems: "flex-start",
                  }}>
                    <span style={{ fontFamily: fontMono, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: inkSubtle, minWidth: "150px", paddingTop: "2px" }}>{k}</span>
                    <span style={{
                      fontSize: "13px",
                      color: ink,
                      fontFamily: mono ? fontMono : fontSans,
                      wordBreak: "break-all",
                    }}>{v}</span>
                  </div>
                ))}

                {/* How it was verified */}
                <div style={{
                  marginTop: "1.25rem",
                  padding: "1rem 1.125rem",
                  background: surfaceAlt,
                  border: `1px solid ${line}`,
                  borderRadius: radius,
                }}>
                  <SectionLabel style={{ marginBottom: "7px" }}>How this was verified</SectionLabel>
                  <div style={{ fontSize: "13px", color: inkMuted, lineHeight: 1.7 }}>
                    AIDAL retrieved the stored decision data, recomputed the SHA-256 hash from scratch, and confirmed it matches the hash stored at log time. The previous record&apos;s hash was also verified, confirming chain integrity.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Result: TAMPERED ───────────────────────────────────────────── */}
          {isTampered && (
            <div style={{
              background: surface,
              border: `1px solid ${line}`,
              borderRadius: radiusLg,
              overflow: "hidden",
              boxShadow: shadowLg,
              animation: "fadeIn 0.3s ease",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "1.25rem 1.5rem",
                background: "rgba(239,68,68,0.06)",
                borderBottom: `1px solid rgba(239,68,68,0.20)`,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(239,68,68,0.12)",
                  border: `1px solid rgba(239,68,68,0.30)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", color: redInk, flexShrink: 0,
                }}>⚠</div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: redInk, letterSpacing: "-0.02em" }}>Tampering detected</div>
                  <div style={{ fontSize: "12.5px", color: inkMuted, marginTop: "1px" }}>The computed hash does not match the stored hash. This record may have been altered.</div>
                </div>
              </div>
              <div style={{ padding: "1.25rem 1.5rem", fontSize: "13px", color: inkMuted, lineHeight: 1.7 }}>
                This is a serious integrity violation. If you believe this is an error, contact the company that provided this audit ID and email{" "}
                <span style={{ color: ink, fontFamily: fontMono, fontSize: "12px" }}>try.aidal@gmail.com</span> immediately.
              </div>
            </div>
          )}

          {/* ── Result: NOT FOUND ──────────────────────────────────────────── */}
          {isNotFound && (
            <div style={neutralCard}>
              <div style={{ fontSize: "14px", fontWeight: 500, color: ink, marginBottom: "0.375rem" }}>Audit ID not found</div>
              <div style={{ fontSize: "13px", color: inkMuted, lineHeight: 1.7 }}>
                This audit ID does not exist in AIDAL&apos;s ledger. Check the ID is correct and try again. If you believe this is an error, contact the company that issued it.
              </div>
            </div>
          )}

          {/* ── Result: ERROR (this page or AIDAL's API is unreachable) ─────── */}
          {isError && (
            <div style={neutralCard}>
              <div style={{ fontSize: "14px", fontWeight: 500, color: ink, marginBottom: "0.375rem" }}>
                Couldn&apos;t reach AIDAL&apos;s verification service
              </div>
              <div style={{ fontSize: "13px", color: inkMuted, lineHeight: 1.7, marginBottom: "1.25rem" }}>
                This doesn&apos;t mean anything is wrong with the record itself — this page just couldn&apos;t reach our servers right now. The whole point of the hash chain is that you don&apos;t have to rely on our servers being up to verify a record.
              </div>
              <div style={{
                background: "rgba(94,106,210,0.05)",
                border: `1px solid rgba(94,106,210,0.20)`,
                borderRadius: radius,
                padding: "1.125rem",
              }}>
                <SectionLabel style={{ color: accentColor, marginBottom: "8px" }}>Verify without us</SectionLabel>
                <div style={{ fontSize: "13px", color: inkMuted, lineHeight: 1.7, marginBottom: "10px" }}>
                  Download <span style={{ fontFamily: fontMono, color: ink }}>verify_offline.py</span> from our public anchor repository and check your exported decisions locally — no AIDAL account, no network call, nothing to trust but your own Python interpreter.
                </div>
                <a
                  href="https://github.com/widjajaanthony24-svg/aidal-anchors"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: "13px", fontFamily: fontMono, color: accentColor, textDecoration: "underline" }}
                >
                  github.com/widjajaanthony24-svg/aidal-anchors →
                </a>
              </div>
            </div>
          )}

          {/* ── How it works (only shown before first attempt) ─────────────── */}
          {!status && (
            <div style={{ marginTop: "3.5rem", borderTop: `1px solid ${line}`, paddingTop: "2.5rem" }}>
              <SectionLabel style={{ marginBottom: "1.25rem" }}>How verification works</SectionLabel>
              <div className="how-it-works-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  ["No login required",     "Anyone with an audit ID can verify it. No account. No API key. No asking AIDAL for permission."],
                  ["No sensitive data",     "Verification only confirms whether a record is untampered. It does not reveal the underlying decision data."],
                  ["Mathematically proven", "AIDAL recomputes the SHA-256 hash from the stored data and compares it to the original. If they match, the record is untampered."],
                  ["Who uses this",         "Regulators, auditors, customers, and courts — anyone who receives an audit ID and needs independent proof the record is genuine."],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="how-card"
                    style={{
                      background: surface,
                      border: `1px solid ${line}`,
                      borderRadius: radiusLg,
                      padding: "1.25rem",
                      boxShadow: shadowXs,
                      transition: "box-shadow 0.15s ease",
                    }}
                  >
                    <div style={{ fontSize: "13.5px", fontWeight: 500, color: ink, marginBottom: "5px", letterSpacing: "-0.015em" }}>{title}</div>
                    <div style={{ fontSize: "12.5px", color: inkMuted, lineHeight: 1.7 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Footer notes ───────────────────────────────────────────────── */}
          <div style={{
            marginTop: "3.5rem",
            paddingTop: "1.75rem",
            borderTop: `1px solid ${line}`,
            fontSize: "12px",
            color: inkSubtle,
            lineHeight: 1.7,
          }}>
            AIDAL public verification does not require authentication. Audit IDs are provided by the company that logged the decision — AIDAL does not expose audit IDs publicly. This page reveals only the decision category, jurisdiction, and compliance status needed to make sense of the integrity check — never the underlying inputs, applicant data, or model output.
          </div>

          <div style={{
            marginTop: "1.25rem",
            paddingTop: "1.25rem",
            borderTop: `1px solid ${line}`,
            fontSize: "12px",
            color: inkSubtle,
            lineHeight: 1.7,
          }}>
            Found a flaw in this system?{" "}
            <a href="mailto:anthony@tryaidal.com?subject=Found%20a%20flaw%20in%20AIDAL" style={{ color: accentColor, textDecoration: "underline" }}>
              anthony@tryaidal.com
            </a>. We&apos;ll publish what you find.
          </div>
        </div>
      </div>
    </div>
  );
}
