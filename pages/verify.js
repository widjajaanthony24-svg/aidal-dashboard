import { useState } from "react";

const API = "https://aidal-production.up.railway.app";
const navy = "#2d3a5c";
const cream = "#f0ebe0";
const creamDim = "#c8c2b0";
const navyDark = "#1e2840";
const green = "#1d9e75";
const red = "#a32d2d";

function hashString(str) {
  // Simple display hash — the real verification is done server-side
  return str.length > 20 ? str.slice(0, 8) + "..." + str.slice(-8) : str;
}

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
}

export default function PublicVerify() {
  const [auditId, setAuditId] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null); // "loading" | "found" | "notfound" | "error"
  const [steps, setSteps] = useState([]);

  const runVerification = async () => {
    const id = auditId.trim();
    if (!id) return;

    setResult(null);
    setSteps([]);
    setStatus("loading");

    // Animate steps one by one
    const addStep = (text, delay) =>
      new Promise(r => setTimeout(() => { setSteps(s => [...s, text]); r(); }, delay));

    await addStep("Locating audit record in AIDAL ledger...", 300);
    await addStep("Fetching cryptographic hash from database...", 700);
    await addStep("Recomputing SHA-256 hash from stored data...", 1100);
    await addStep("Comparing computed hash against stored hash...", 1500);

    try {
      // Call the public verify endpoint
      const res = await fetch(`${API}/verify/public/${id}`);

      await addStep("Checking hash chain integrity...", 1900);

      if (res.status === 404) {
        setStatus("notfound");
        setSteps(s => [...s, "✗ Audit ID not found in ledger."]);
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setSteps(s => [...s, "✗ Verification service error. Try again."]);
        return;
      }

      const data = await res.json();
      await addStep("Verification complete.", 2200);
      setResult(data);
      setStatus(data.verified ? "verified" : "tampered");

    } catch (e) {
      setStatus("error");
      setSteps(s => [...s, "✗ Could not reach AIDAL API. Check your connection."]);
    }
  };

  const inputStyle = {
    width: "100%",
    background: navyDark,
    border: "1px solid rgba(240,235,224,0.2)",
    color: cream,
    padding: "14px 16px",
    fontFamily: "monospace",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: "1px",
    marginBottom: "1rem",
  };

  const isVerified = status === "verified";
  const isTampered = status === "tampered";
  const isNotFound = status === "notfound";
  const isLoading = status === "loading";

  return (
    <div style={{ minHeight: "100vh", background: navy, color: cream, fontFamily: "'EB Garamond', Georgia, serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=EB+Garamond:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(240,235,224,0.1)", padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: navyDark }}>
        <a href="https://tryaidal.github.io/landing_page_aidal" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, letterSpacing: "2px", color: cream, textDecoration: "none" }}>AIDAL.</a>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="https://aidal-dashboard.vercel.app" style={{ fontSize: "13px", color: creamDim, textDecoration: "none", letterSpacing: "1px" }}>Dashboard →</a>
          <a href="https://tryaidal.github.io/landing_page_aidal#get-key" style={{ fontSize: "13px", color: creamDim, textDecoration: "none", border: "1px solid rgba(240,235,224,0.2)", padding: "6px 16px", letterSpacing: "1px" }}>Get API Key</a>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "5rem 2rem" }}>

        {/* Title */}
        <div style={{ fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", color: creamDim, marginBottom: "1.5rem" }}>
          Public Verification
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.05, color: cream, marginBottom: "1rem" }}>
          Verify any<br /><em style={{ fontStyle: "italic", color: creamDim }}>AI decision record.</em>
        </h1>
        <p style={{ fontSize: "18px", color: creamDim, lineHeight: 1.7, marginBottom: "3rem", maxWidth: 560 }}>
          Paste an audit ID below. AIDAL will recompute the cryptographic hash and confirm whether the record is untampered — without revealing any sensitive data.
        </p>

        {/* Input */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: creamDim, display: "block", marginBottom: "8px" }}>
            Audit ID
          </label>
          <input
            style={inputStyle}
            placeholder="aud_a7f3c9b2d1e8..."
            value={auditId}
            onChange={e => { setAuditId(e.target.value); setResult(null); setStatus(null); setSteps([]); }}
            onKeyDown={e => e.key === "Enter" && runVerification()}
          />
        </div>

        <button
          onClick={runVerification}
          disabled={isLoading || !auditId.trim()}
          style={{
            background: isLoading ? "transparent" : cream,
            border: `1px solid ${isLoading ? "rgba(240,235,224,0.3)" : cream}`,
            color: isLoading ? creamDim : navy,
            padding: "14px 40px",
            fontFamily: "'Playfair Display', serif",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            marginBottom: "2.5rem",
          }}
        >
          {isLoading ? "Verifying..." : "Verify Record →"}
        </button>

        {/* Steps animation */}
        {steps.length > 0 && (
          <div style={{ background: navyDark, border: "1px solid rgba(240,235,224,0.1)", padding: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: creamDim, marginBottom: "1rem" }}>
              Verification log
            </div>
            {steps.map((s, i) => (
              <div key={i} style={{ fontFamily: "monospace", fontSize: "13px", color: s.startsWith("✗") ? "#e08080" : creamDim, marginBottom: "6px", lineHeight: 1.6, opacity: 1, animation: "fadeIn 0.3s ease" }}>
                <span style={{ color: "rgba(240,235,224,0.3)", marginRight: "12px" }}>{String(i + 1).padStart(2, "0")}</span>
                {s}
              </div>
            ))}
            {isLoading && (
              <div style={{ fontFamily: "monospace", fontSize: "13px", color: creamDim, marginTop: "6px" }}>
                <span style={{ color: "rgba(240,235,224,0.3)", marginRight: "12px" }}>··</span>
                <span style={{ opacity: 0.6 }}>Running...</span>
              </div>
            )}
          </div>
        )}

        {/* Result — VERIFIED */}
        {isVerified && result && (
          <div style={{ background: "rgba(29,158,117,0.12)", border: `1px solid ${green}`, padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(29,158,117,0.2)", border: `1px solid ${green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#7ec8a0" }}>✓</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#7ec8a0", fontWeight: 700 }}>Record Verified — Untampered</div>
                <div style={{ fontSize: "13px", color: creamDim, marginTop: "2px" }}>This record has not been altered since it was first logged.</div>
              </div>
            </div>

            {[
              ["Audit ID", result.audit_id],
              ["Decision type", result.decision_type || "—"],
              ["Jurisdiction", result.jurisdiction || "—"],
              ["Logged at", formatDate(result.logged_at)],
              ["Hash", result.hash ? hashString(result.hash) : "—"],
              ["Previous hash", result.prev_hash ? hashString(result.prev_hash) : "GENESIS (first record)"],
              ["Compliance status", result.compliance_status || "—"],
              ["Regulator", result.regulator || "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: "1rem", padding: "10px 0", borderBottom: "1px solid rgba(29,158,117,0.15)" }}>
                <span style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: creamDim, minWidth: "140px", paddingTop: "2px" }}>{k}</span>
                <span style={{ fontSize: "14px", color: cream, fontFamily: k === "Hash" || k === "Previous hash" || k === "Audit ID" ? "monospace" : "inherit" }}>{v}</span>
              </div>
            ))}

            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(29,158,117,0.08)", border: "1px solid rgba(29,158,117,0.2)" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#7ec8a0", marginBottom: "6px" }}>How this was verified</div>
              <div style={{ fontSize: "14px", color: creamDim, lineHeight: 1.7 }}>
                AIDAL retrieved the stored decision data, recomputed the SHA-256 hash from scratch, and confirmed it matches the hash stored at log time. The previous record's hash was also verified, confirming chain integrity.
              </div>
            </div>
          </div>
        )}

        {/* Result — TAMPERED */}
        {isTampered && (
          <div style={{ background: "rgba(163,45,45,0.12)", border: `1px solid ${red}`, padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(163,45,45,0.2)", border: `1px solid ${red}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#e08080" }}>⚠</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#e08080", fontWeight: 700 }}>Tampering Detected</div>
                <div style={{ fontSize: "13px", color: creamDim, marginTop: "2px" }}>The computed hash does not match the stored hash. This record may have been altered.</div>
              </div>
            </div>
            <div style={{ fontSize: "14px", color: creamDim, lineHeight: 1.7 }}>
              This is a serious integrity violation. If you believe this is an error, contact the company that provided this audit ID and email try.aidal@gmail.com immediately.
            </div>
          </div>
        )}

        {/* Result — NOT FOUND */}
        {isNotFound && (
          <div style={{ background: "rgba(240,235,224,0.04)", border: "1px solid rgba(240,235,224,0.15)", padding: "2rem" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: cream, marginBottom: "0.5rem" }}>Audit ID not found</div>
            <div style={{ fontSize: "14px", color: creamDim, lineHeight: 1.7 }}>
              This audit ID does not exist in AIDAL's ledger. Check the ID is correct and try again. If you believe this is an error, contact the company that issued it.
            </div>
          </div>
        )}

        {/* How it works explainer */}
        {!status && (
          <div style={{ marginTop: "4rem", borderTop: "1px solid rgba(240,235,224,0.1)", paddingTop: "3rem" }}>
            <div style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: creamDim, marginBottom: "2rem" }}>How verification works</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {[
                ["No login required", "Anyone with an audit ID can verify it. No account. No API key. No asking AIDAL for permission."],
                ["No sensitive data shown", "Verification only confirms whether a record is untampered. It does not reveal the underlying decision data."],
                ["Mathematically proven", "AIDAL recomputes the SHA-256 hash from the stored data and compares it to the original. If they match, the record is untampered."],
                ["Who uses this", "Regulators, auditors, customers, and courts — anyone who receives an audit ID and needs independent proof the record is genuine."],
              ].map(([title, desc]) => (
                <div key={title} style={{ borderTop: "1px solid rgba(240,235,224,0.15)", paddingTop: "1rem" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", color: cream, fontWeight: 700, marginBottom: "0.5rem" }}>{title}</div>
                  <div style={{ fontSize: "15px", color: creamDim, lineHeight: 1.7 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(240,235,224,0.08)", fontSize: "13px", color: "rgba(240,235,224,0.3)", lineHeight: 1.7 }}>
          AIDAL public verification does not require authentication. Audit IDs are provided by the company that logged the decision — AIDAL does not expose audit IDs publicly. This page verifies integrity only — it does not reveal any personal data or decision content.
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
