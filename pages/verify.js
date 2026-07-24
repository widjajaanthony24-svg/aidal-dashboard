import { useState, useEffect } from "react";

const API = "https://aidal-production.up.railway.app";

// ── Palette — cream & black ─────────────────────────────────────────────────
const pageBg   = "#FAF3EB";   // page bg
const ink      = "#0A0A0A";   // primary text
const creamDim = "#6B6560";   // muted text
const panelBg  = "#F0E6D6";   // card / panel bg
const inputBg  = "#FFFFFF";   // input bg
const green     = "#4CAF82";
const red       = "#E05252";
const bgBorder  = "#D8CFC4";
const textMuted = "#6B6560";
const accentColor = "#C8A96E";

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

  // ── Shared input / label styles ────────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    background: inputBg,
    border: `0.5px solid ${bgBorder}`,
    color: ink,
    padding: "10px 14px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: "0.04em",
    borderRadius: 6,
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  };

  const labelStyle = {
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: textMuted,
    display: "block",
    marginBottom: "6px",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{ minHeight: "100vh", background: pageBg, color: ink, fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.6, WebkitFontSmoothing: "antialiased" }}>

      {/* Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      {/* Global styles */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.85); }
        }
        input::placeholder { color: #6B6560; font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #FAF3EB; }
        ::-webkit-scrollbar-thumb { background: #D8CFC4; border-radius: 3px; }
        .verify-input:focus { border-color: ${accentColor} !important; box-shadow: 0 0 0 3px rgba(200,169,110,0.10) !important; }
        .verify-btn:hover:not(:disabled) { opacity: 0.88; }
        .nav-link:hover { color: ${ink} !important; }
        .how-card:hover { background: ${inputBg} !important; }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: `0.5px solid ${bgBorder}`,
        padding: "0 2rem",
        height: "52px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: pageBg,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <a href="https://tryaidal.github.io/landing_page_aidal" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src="/aidal-logo-black.png" alt="AIDAL." style={{ height: "26px", width: "auto", display: "block" }} />
        </a>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="https://aidal-dashboard.vercel.app" className="nav-link" style={{ fontSize: "12px", color: ink, textDecoration: "none", letterSpacing: "0.06em", transition: "color 0.15s ease" }}>
            Dashboard →
          </a>
          <a
            href="https://tryaidal.github.io/landing_page_aidal#get-key"
            className="nav-link"
            style={{
              fontSize: "12px",
              color: "#FAF3EB",
              textDecoration: "none",
              background: "#0A0A0A",
              border: "none",
              padding: "5px 14px",
              borderRadius: 6,
              letterSpacing: "0.06em",
              transition: "all 0.15s ease",
            }}
          >
            Get API Key
          </a>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "5rem 2rem 6rem" }}>

        {/* Label */}
        <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: "1.25rem", fontWeight: 500 }}>
          Public Verification
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(32px, 5.5vw, 52px)",
          fontWeight: 700,
          lineHeight: 1.1,
          color: ink,
          marginBottom: "1rem",
          letterSpacing: "-0.01em",
        }}>
          Verify any<br />
          <span style={{ color: creamDim, fontWeight: 400 }}>AI decision record.</span>
        </h1>

        <p style={{ fontSize: "15px", color: creamDim, lineHeight: 1.75, marginBottom: "3rem", maxWidth: 520 }}>
          Paste an audit ID below. AIDAL will recompute the cryptographic hash and confirm whether the record is untampered — without revealing any sensitive data.
        </p>

        {/* ── Input ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "12px" }}>
          <label style={labelStyle}>Audit ID</label>
          <input
            className="verify-input"
            style={inputStyle}
            placeholder="aud_a7f3c9b2d1e8..."
            value={auditId}
            onChange={e => { setAuditId(e.target.value); setResult(null); setStatus(null); setSteps([]); }}
            onKeyDown={e => e.key === "Enter" && runVerification()}
          />
        </div>

        {/* ── Button ─────────────────────────────────────────────────────── */}
        <button
          className="verify-btn"
          onClick={runVerification}
          disabled={isLoading || !auditId.trim()}
          style={{
            background: isLoading ? "transparent" : accentColor,
            border: `0.5px solid ${isLoading ? bgBorder : accentColor}`,
            color: isLoading ? textMuted : "#0A0A09",
            padding: "10px 28px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            borderRadius: 6,
            marginBottom: "2.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isLoading ? (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: textMuted, display: "inline-block", animation: "pulse-dot 1.2s ease-in-out infinite" }} />
              Verifying...
            </>
          ) : (
            "Verify Record →"
          )}
        </button>

        {/* ── Verification log ───────────────────────────────────────────── */}
        {steps.length > 0 && (
          <div style={{
            background: panelBg,
            border: `0.5px solid ${bgBorder}`,
            borderRadius: 8,
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            animation: "fadeIn 0.25s ease",
          }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: "1rem", fontWeight: 500 }}>
              Verification log
            </div>
            {steps.map((s, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: s.startsWith("✗") ? red : creamDim,
                  marginBottom: "5px",
                  lineHeight: 1.6,
                  animation: "fadeIn 0.3s ease",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <span style={{ color: bgBorder, minWidth: "18px", fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</span>
                <span>{s}</span>
              </div>
            ))}
            {isLoading && (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: textMuted, marginTop: "5px", display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ color: bgBorder, minWidth: "18px" }}>··</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: textMuted, display: "inline-block", animation: "pulse-dot 1.2s ease-in-out infinite" }} />
                  Running...
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Result: VERIFIED ───────────────────────────────────────────── */}
        {isVerified && result && (
          <div style={{
            background: "rgba(76,175,130,0.07)",
            border: `0.5px solid rgba(76,175,130,0.35)`,
            borderRadius: 8,
            padding: "1.75rem",
            animation: "fadeIn 0.3s ease",
          }}>
            {/* Badge row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(76,175,130,0.15)",
                border: `0.5px solid rgba(76,175,130,0.4)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", color: green,
              }}>✓</div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: green, letterSpacing: "-0.01em" }}>Record Verified — Untampered</div>
                <div style={{ fontSize: "12px", color: textMuted, marginTop: "2px" }}>This record has not been altered since it was first logged.</div>
              </div>
            </div>

            {/* Data rows */}
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
              <div key={k} style={{
                display: "flex",
                gap: "1rem",
                padding: "9px 0",
                borderBottom: `0.5px solid rgba(76,175,130,0.12)`,
                alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: textMuted, minWidth: "140px", paddingTop: "1px", fontWeight: 500 }}>{k}</span>
                <span style={{
                  fontSize: "13px",
                  color: ink,
                  fontFamily: mono ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
                  letterSpacing: mono ? "0.02em" : "normal",
                  wordBreak: "break-all",
                }}>{v}</span>
              </div>
            ))}

            {/* How it was verified */}
            <div style={{
              marginTop: "1.25rem",
              padding: "1rem 1.25rem",
              background: "rgba(76,175,130,0.06)",
              border: `0.5px solid rgba(76,175,130,0.18)`,
              borderRadius: 6,
            }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: green, marginBottom: "6px", fontWeight: 500 }}>How this was verified</div>
              <div style={{ fontSize: "13px", color: creamDim, lineHeight: 1.75 }}>
                AIDAL retrieved the stored decision data, recomputed the SHA-256 hash from scratch, and confirmed it matches the hash stored at log time. The previous record's hash was also verified, confirming chain integrity.
              </div>
            </div>
          </div>
        )}

        {/* ── Result: TAMPERED ───────────────────────────────────────────── */}
        {isTampered && (
          <div style={{
            background: "rgba(224,82,82,0.07)",
            border: `0.5px solid rgba(224,82,82,0.35)`,
            borderRadius: 8,
            padding: "1.75rem",
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(224,82,82,0.15)",
                border: `0.5px solid rgba(224,82,82,0.4)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", color: red,
              }}>⚠</div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: red, letterSpacing: "-0.01em" }}>Tampering Detected</div>
                <div style={{ fontSize: "12px", color: textMuted, marginTop: "2px" }}>The computed hash does not match the stored hash. This record may have been altered.</div>
              </div>
            </div>
            <div style={{ fontSize: "13px", color: creamDim, lineHeight: 1.75 }}>
              This is a serious integrity violation. If you believe this is an error, contact the company that provided this audit ID and email{" "}
              <span style={{ color: ink, fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>try.aidal@gmail.com</span> immediately.
            </div>
          </div>
        )}

        {/* ── Result: NOT FOUND ──────────────────────────────────────────── */}
        {isNotFound && (
          <div style={{
            background: panelBg,
            border: `0.5px solid ${bgBorder}`,
            borderRadius: 8,
            padding: "1.75rem",
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{ fontSize: "14px", fontWeight: 500, color: ink, marginBottom: "0.5rem" }}>Audit ID not found</div>
            <div style={{ fontSize: "13px", color: creamDim, lineHeight: 1.75 }}>
              This audit ID does not exist in AIDAL's ledger. Check the ID is correct and try again. If you believe this is an error, contact the company that issued it.
            </div>
          </div>
        )}

        {/* ── Result: ERROR (this page or AIDAL's API is unreachable) ─────── */}
        {isError && (
          <div style={{
            background: panelBg,
            border: `0.5px solid ${bgBorder}`,
            borderRadius: 8,
            padding: "1.75rem",
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{ fontSize: "14px", fontWeight: 500, color: ink, marginBottom: "0.5rem" }}>
              Couldn't reach AIDAL's verification service
            </div>
            <div style={{ fontSize: "13px", color: creamDim, lineHeight: 1.75, marginBottom: "1.25rem" }}>
              This doesn't mean anything is wrong with the record itself — this page just couldn't reach our servers right now. The whole point of the hash chain is that you don't have to rely on our servers being up to verify a record.
            </div>
            <div style={{
              background: "rgba(200,169,110,0.06)",
              border: `0.5px solid rgba(200,169,110,0.25)`,
              borderRadius: 6,
              padding: "1.25rem",
            }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, marginBottom: "8px", fontWeight: 500 }}>
                Verify without us
              </div>
              <div style={{ fontSize: "13px", color: creamDim, lineHeight: 1.75, marginBottom: "10px" }}>
                Download <span style={{ fontFamily: "'JetBrains Mono', monospace", color: ink }}>verify_offline.py</span> from our public anchor repository and check your exported decisions locally — no AIDAL account, no network call, nothing to trust but your own Python interpreter.
              </div>
              <a
                href="https://github.com/widjajaanthony24-svg/aidal-anchors"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: "13px", color: accentColor, textDecoration: "underline" }}
              >
                github.com/widjajaanthony24-svg/aidal-anchors →
              </a>
            </div>
          </div>
        )}

        {/* ── How it works (only shown before first attempt) ─────────────── */}
        {!status && (
          <div style={{ marginTop: "4rem", borderTop: `0.5px solid ${bgBorder}`, paddingTop: "3rem" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: "1.75rem", fontWeight: 500 }}>
              How verification works
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: bgBorder, borderRadius: 8, overflow: "hidden" }}>
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
                    background: panelBg,
                    padding: "1.5rem",
                    transition: "background 0.15s ease",
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600, color: ink, marginBottom: "6px", letterSpacing: "-0.01em" }}>{title}</div>
                  <div style={{ fontSize: "12px", color: creamDim, lineHeight: 1.75 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer note ────────────────────────────────────────────────── */}
        <div style={{
          marginTop: "4rem",
          paddingTop: "2rem",
          borderTop: `0.5px solid ${bgBorder}`,
          fontSize: "12px",
          color: textMuted,
          lineHeight: 1.75,
        }}>
          AIDAL public verification does not require authentication. Audit IDs are provided by the company that logged the decision — AIDAL does not expose audit IDs publicly. This page reveals only the decision category, jurisdiction, and compliance status needed to make sense of the integrity check — never the underlying inputs, applicant data, or model output.
        </div>
      </div>
    </div>
  );
}
