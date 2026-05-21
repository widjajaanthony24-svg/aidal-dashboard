import { useState, useEffect, useCallback } from "react";

const API = "https://aidal-production.up.railway.app";

const navy     = "#0A0A09";
const cream    = "#F5F0E8";
const creamDim = "#9C9690";
const navyDark = "#111110";
const navyLight= "#1A1A18";
const green    = "#4CAF82";
const red      = "#E05252";
const amber    = "#D4873A";
const bgBorder = "#242422";
const textMuted= "#5C5850";
const accentColor = "#C8A96E";

const jurColors = {
  SG:  { bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)",  color: "#60A5FA" },
  EU:  { bg: "rgba(200,169,110,0.1)", border: "rgba(200,169,110,0.3)", color: "#C8A96E" },
  ID:  { bg: "rgba(76,175,130,0.1)",  border: "rgba(76,175,130,0.3)",  color: "#4CAF82" },
  UAE: { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)", color: "#A78BFA" },
};
const typeTagPalette = [
  { bg: "rgba(76,175,130,0.1)",  color: "#4CAF82" },
  { bg: "rgba(59,130,246,0.1)",  color: "#60A5FA" },
  { bg: "rgba(200,169,110,0.1)", color: "#C8A96E" },
  { bg: "rgba(167,139,250,0.1)", color: "#A78BFA" },
  { bg: "rgba(212,135,58,0.1)",  color: "#D4873A" },
  { bg: "rgba(236,72,153,0.1)",  color: "#EC4899" },
];

const styles = {
  app: {
    minHeight: "100vh",
    background: navy,
    color: cream,
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    lineHeight: 1.6,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },

  loginWrap: {
    minHeight: "100vh",
    background: navy,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  loginBox: {
    width: "100%",
    maxWidth: 420,
    border: `0.5px solid ${bgBorder}`,
    padding: "2.5rem",
    background: navyDark,
    borderRadius: 12,
  },
  loginLogo: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "20px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: cream,
    marginBottom: "0.25rem",
  },
  loginTagline: {
    fontSize: "12px",
    color: creamDim,
    letterSpacing: "0.08em",
    marginBottom: "2rem",
  },
  loginLabel: {
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: textMuted,
    display: "block",
    marginBottom: "6px",
  },
  loginInput: {
    width: "100%",
    background: navyLight,
    border: `0.5px solid ${bgBorder}`,
    color: cream,
    padding: "10px 14px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "1rem",
    borderRadius: 6,
    transition: "border-color 0.15s ease",
  },
  loginBtn: {
    width: "100%",
    background: accentColor,
    border: "none",
    color: "#0A0A09",
    padding: "11px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    borderRadius: 6,
    transition: "opacity 0.15s ease",
  },
  loginError: {
    background: "rgba(224,82,82,0.1)",
    border: `0.5px solid ${red}`,
    color: red,
    padding: "10px 14px",
    fontSize: "13px",
    marginBottom: "1rem",
    borderRadius: 6,
  },
  loginHint: {
    marginTop: "1.5rem",
    fontSize: "12px",
    color: creamDim,
    borderTop: `0.5px solid ${bgBorder}`,
    paddingTop: "1.5rem",
    lineHeight: 1.8,
  },

  header: {
    borderBottom: `0.5px solid ${bgBorder}`,
    padding: "0 2rem",
    height: "52px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: navy,
  },
  logo: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "16px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: cream,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
  },
  companyBadge: {
    fontSize: "12px",
    color: creamDim,
    background: navyLight,
    padding: "4px 10px",
    border: `0.5px solid ${bgBorder}`,
    borderRadius: 6,
  },
  statusDot: (ok) => ({
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: ok ? green : red,
    display: "inline-block",
    marginRight: 5,
    animation: ok ? "pulse-dot 2s ease-in-out infinite" : "none",
  }),
  statusText: {
    fontSize: "12px",
    color: creamDim,
    display: "flex",
    alignItems: "center",
  },
  main: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "1.5rem 2rem 2rem",
  },
  pageTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "20px",
    fontWeight: 600,
    color: cream,
    marginBottom: "0.25rem",
    letterSpacing: "-0.02em",
  },
  pageSubtitle: {
    fontSize: "12px",
    color: creamDim,
    marginBottom: "1.75rem",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "0",
    background: bgBorder,
    border: `0.5px solid ${bgBorder}`,
    marginBottom: "1.5rem",
    borderRadius: 8,
    overflow: "hidden",
  },
  statCard: {
    background: navyDark,
    padding: "1.25rem 1.5rem",
    borderRight: `0.5px solid ${bgBorder}`,
  },
  statLabel: {
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: textMuted,
    marginBottom: "8px",
    display: "block",
    fontWeight: 500,
  },
  statValue: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "36px",
    fontWeight: 700,
    color: cream,
    lineHeight: 1,
    display: "block",
    letterSpacing: "-0.025em",
  },
  statSub: {
    fontSize: "11px",
    color: creamDim,
    marginTop: "6px",
    lineHeight: 1.4,
  },
  verifyBanner: (valid) => ({
    background: valid ? "rgba(76,175,130,0.1)" : "rgba(224,82,82,0.1)",
    border: `0.5px solid ${valid ? "rgba(76,175,130,0.3)" : "rgba(224,82,82,0.3)"}`,
    padding: "0.875rem 1.25rem",
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
  }),
  verifyText: (valid) => ({
    fontSize: "13px",
    color: valid ? green : red,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }),
  btn: {
    background: "transparent",
    border: `0.5px solid ${bgBorder}`,
    color: creamDim,
    padding: "6px 14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    borderRadius: 6,
  },
  btnPrimary: {
    background: accentColor,
    border: "none",
    color: "#0A0A09",
    padding: "6px 14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    borderRadius: 6,
    transition: "all 0.15s ease",
  },
  btnDanger: {
    background: "transparent",
    border: "none",
    color: red,
    padding: "6px 14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  btnGreen: {
    background: "rgba(76,175,130,0.1)",
    border: `0.5px solid ${green}`,
    color: green,
    padding: "6px 14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    cursor: "pointer",
    borderRadius: 6,
    transition: "all 0.15s ease",
  },
  btnAmber: {
    background: "rgba(212,135,58,0.12)",
    border: `0.5px solid ${amber}`,
    color: amber,
    padding: "6px 14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    cursor: "pointer",
    borderRadius: 6,
    transition: "all 0.15s ease",
  },
  toolbar: {
    display: "flex",
    gap: "0.625rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
    alignItems: "center",
  },
  select: {
    background: navyDark,
    border: `0.5px solid ${bgBorder}`,
    color: cream,
    padding: "6px 12px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
    borderRadius: 6,
  },
  input: {
    background: navyDark,
    border: `0.5px solid ${bgBorder}`,
    color: cream,
    padding: "6px 12px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    outline: "none",
    width: "260px",
    borderRadius: 6,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: navy,
    border: `0.5px solid ${bgBorder}`,
  },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: textMuted,
    borderBottom: `0.5px solid ${bgBorder}`,
    background: navyLight,
    fontWeight: 500,
  },
  td: {
    padding: "11px 14px",
    fontSize: "13px",
    color: creamDim,
    borderBottom: `0.5px solid ${bgBorder}`,
    verticalAlign: "top",
    transition: "background 0.1s ease",
  },
  tdPrimary: {
    padding: "11px 14px",
    fontSize: "13px",
    color: cream,
    borderBottom: `0.5px solid ${bgBorder}`,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
  },
  outcomeBadge: (outcome) => {
    const o = (outcome || "").toLowerCase();
    const isGood = o.includes("approv") || o.includes("pass") || o.includes("clear") || o === "true";
    const isBad = o.includes("den") || o.includes("flag") || o.includes("reject") || o.includes("block") || o === "false";
    return {
      display: "inline-block",
      padding: "3px 10px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.03em",
      border: `1px solid ${isGood ? "rgba(76,175,130,0.35)" : isBad ? "rgba(224,82,82,0.35)" : bgBorder}`,
      color: isGood ? green : isBad ? red : creamDim,
      background: isGood ? "rgba(76,175,130,0.1)" : isBad ? "rgba(224,82,82,0.1)" : navyLight,
      borderRadius: 100,
    };
  },
  jurBadge: (jur) => {
    const c = jurColors[jur] || { bg: "rgba(240,235,224,0.06)", border: "rgba(240,235,224,0.15)", color: creamDim };
    return {
      display: "inline-block",
      padding: "2px 8px",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.06em",
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.color,
      borderRadius: 100,
      fontFamily: "'JetBrains Mono', monospace",
    };
  },
  hashText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    color: textMuted,
    letterSpacing: "0.03em",
  },
  modal: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "2rem",
  },
  modalBox: {
    background: navyLight,
    border: `0.5px solid ${bgBorder}`,
    maxWidth: 720,
    width: "100%",
    maxHeight: "85vh",
    overflowY: "auto",
    padding: "2rem",
    borderRadius: 8,
  },
  modalTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "17px",
    fontWeight: 600,
    color: cream,
    marginBottom: "1.5rem",
    letterSpacing: "-0.01em",
  },
  modalRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
    borderBottom: `0.5px solid ${bgBorder}`,
    paddingBottom: "1rem",
  },
  modalKey: {
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: textMuted,
    minWidth: "140px",
    paddingTop: "2px",
  },
  modalVal: {
    fontSize: "13px",
    color: cream,
    lineHeight: 1.6,
    flex: 1,
  },
  explanationBox: {
    background: "rgba(76,175,130,0.08)",
    border: `0.5px solid rgba(76,175,130,0.25)`,
    padding: "1rem 1.25rem",
    marginTop: "1rem",
    fontSize: "13px",
    color: green,
    lineHeight: 1.8,
    borderRadius: 8,
  },
  empty: {
    textAlign: "center",
    padding: "4rem",
    color: creamDim,
    fontSize: "13px",
  },
  loading: {
    textAlign: "center",
    padding: "4rem",
    color: creamDim,
    fontSize: "13px",
  },
  pager: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.875rem 0",
    fontSize: "13px",
    color: textMuted,
  },
  countdown: {
    background: navyDark,
    borderBottom: `0.5px solid ${bgBorder}`,
    color: cream,
    padding: "0 2rem",
    textAlign: "center",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    fontVariantNumeric: "tabular-nums",
  },
  certBox: {
    background: "rgba(76,175,130,0.08)",
    border: `0.5px solid rgba(76,175,130,0.25)`,
    padding: "0.875rem 1.25rem",
    marginTop: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: "1.5rem",
  },
  certText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    color: green,
    letterSpacing: "0.03em",
  },
  sidebar: {
    width: "220px",
    flexShrink: 0,
    background: navyDark,
    borderRight: `0.5px solid ${bgBorder}`,
    paddingTop: "1.25rem",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: "88px",
    height: "calc(100vh - 88px)",
    overflowY: "auto",
  },
  sidebarSection: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: textMuted,
    padding: "16px 20px 6px",
    fontWeight: 600,
    display: "block",
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 20px",
    fontSize: "13px",
    color: creamDim,
    textDecoration: "none",
    cursor: "pointer",
    borderLeft: "2px solid transparent",
    background: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left",
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1,
  },
  sidebarDivider: {
    height: "0.5px",
    background: bgBorder,
    margin: "10px 16px",
  },
};

function useCountdown() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const deadline = new Date("2026-08-01T00:00:00");
    const tick = () => {
      const diff = deadline - new Date();
      if (diff <= 0) { setTime("DEADLINE PASSED"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function getOutcomeLabel(decision) {
  if (!decision) return "—";
  const out = decision.output;
  if (!out) return "—";
  if (out.approved !== undefined) return out.approved ? "Approved" : "Denied";
  if (out.flagged !== undefined) return out.flagged ? "Flagged" : "Clear";
  if (out.result) return out.result;
  return JSON.stringify(out).slice(0, 40);
}

// ══════════════════════════════════════════════════════════════════════════════
// HUMAN REVIEW PANEL — shown inside decision modal
// ══════════════════════════════════════════════════════════════════════════════
function HumanReviewPanel({ auditId, apiKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({ reviewer_id: "", outcome: "approved", notes: "" });

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/decision/${auditId}/human-reviews`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      if (r.ok) {
        const data = await r.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {}
    setLoading(false);
  }, [auditId, apiKey]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSubmit = async () => {
    if (!form.reviewer_id.trim()) { setSubmitError("Reviewer ID is required."); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      const r = await fetch(`${API}/decision/${auditId}/human-review`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (r.ok) {
        setSubmitResult(data);
        setShowForm(false);
        setForm({ reviewer_id: "", outcome: "approved", notes: "" });
        fetchReviews();
      } else {
        setSubmitError(data.detail || "Something went wrong.");
      }
    } catch (e) {
      setSubmitError("Network error.");
    }
    setSubmitting(false);
  };

  const inputStyle = {
    background: "#1A1A18",
    border: "0.5px solid #242422",
    color: cream,
    padding: "10px 14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    outline: "none",
    width: "100%",
    marginBottom: "10px",
    borderRadius: 6,
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };
  const labelStyle = { fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, display: "block", marginBottom: "6px" };

  const satisfied = reviews.length > 0 || submitResult;

  return (
    <div style={{ marginTop: "1.5rem", borderTop: "0.5px solid #242422", paddingTop: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: creamDim, marginBottom: "4px" }}>
            Human Oversight — EU AI Act Article 14
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "3px 10px", fontSize: "12px", letterSpacing: "1px",
            border: `1px solid ${satisfied ? green : amber}`,
            color: satisfied ? "#4CAF82" : "#D4873A",
            background: satisfied ? "rgba(76,175,130,0.1)" : "rgba(212,135,58,0.1)",
          }}>
            {satisfied ? "✓ SATISFIED" : "⚠ PENDING"}
          </div>
        </div>
        {!showForm && (
          <button style={styles.btnGreen} onClick={() => setShowForm(true)}>
            + Log review
          </button>
        )}
      </div>

      {submitResult && (
        <div style={{ background: "rgba(76,175,130,0.1)", border: `1px solid ${green}`, padding: "10px 14px", fontSize: "13px", color: "#4CAF82", marginBottom: "1rem" }}>
          ✓ Review logged — Article 14 satisfied. Hash: <span style={{ fontFamily: "monospace", fontSize: "11px" }}>{submitResult.review_hash?.slice(0, 20)}...</span>
        </div>
      )}

      {showForm && (
        <div style={{ background: "#1A1A18", border: "0.5px solid #242422", padding: "1.25rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "13px", color: creamDim, marginBottom: "1rem" }}>
            This review will be cryptographically tied to the original decision hash.
          </div>
          {submitError && (
            <div style={{ background: "rgba(224,82,82,0.1)", border: `1px solid ${red}`, color: "#E05252", padding: "8px 12px", fontSize: "13px", marginBottom: "10px" }}>
              {submitError}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Reviewer ID *</label>
              <input style={inputStyle} placeholder="e.g. john.doe@bank.com" value={form.reviewer_id} onChange={e => setForm(f => ({ ...f, reviewer_id: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Outcome</label>
              <select style={selectStyle} value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))}>
                <option value="approved">Approved — confirmed correct</option>
                <option value="overridden">Overridden — decision changed</option>
                <option value="escalated">Escalated — sent for further review</option>
                <option value="confirmed">Confirmed — spot check passed</option>
              </select>
            </div>
          </div>
          <label style={labelStyle}>Notes (optional)</label>
          <textarea
            style={{ ...inputStyle, height: "80px", resize: "vertical" }}
            placeholder="Reviewer notes for the audit record..."
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button style={{ ...styles.btnGreen, opacity: submitting ? 0.6 : 1 }} onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Logging..." : "Lock review into chain →"}
            </button>
            <button style={styles.btn} onClick={() => { setShowForm(false); setSubmitError(""); }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ fontSize: "13px", color: creamDim, fontStyle: "italic" }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={{ fontSize: "13px", color: creamDim }}>No human reviews logged yet for this decision.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {reviews.map((rev, i) => (
            <div key={i} style={{ background: "#1A1A18", border: "0.5px solid #242422", padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ ...styles.outcomeBadge(rev.outcome === "approved" || rev.outcome === "confirmed" ? "approved" : rev.outcome === "overridden" ? "denied" : "escalated"), fontSize: "11px" }}>
                    {rev.outcome?.toUpperCase()}
                  </span>
                  <span style={{ fontSize: "13px", color: cream }}>{rev.reviewer_id}</span>
                </div>
                <span style={{ fontSize: "12px", color: creamDim }}>{formatDate(rev.reviewed_at)}</span>
              </div>
              {rev.notes && <div style={{ fontSize: "13px", color: creamDim, fontStyle: "italic", marginTop: "4px" }}>{rev.notes}</div>}
              <div style={{ fontSize: "11px", color: "#5C5850", marginTop: "6px", fontFamily: "monospace" }}>
                review_hash: {rev.review_hash?.slice(0, 24)}...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FAIRNESS DETECTION PANEL
// ══════════════════════════════════════════════════════════════════════════════
function FairnessPanel({ apiKey }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const r = await fetch(`${API}/fairness/report`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      const data = await r.json();
      if (r.ok) {
        setReport(data);
      } else {
        setError(data.detail || "Could not retrieve fairness report.");
      }
    } catch (e) {
      setError("Network error. Check your connection.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && !report && !loading) runAnalysis();
  }, [open]);

  const statusOk = report?.fairness_status === "PASS";
  const flags = report?.bias_flags || [];

  return (
    <div style={{ marginTop: "2rem", border: "0.5px solid #242422", background: navyDark }}>
      {/* Header */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          borderBottom: open ? "1px solid rgba(240,235,224,0.1)" : "none",
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: cream, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Fairness Detection
          </div>
          <div style={{ fontSize: "13px", color: creamDim, marginTop: "2px" }}>
            EU AI Act Article 10 + MAS FEAT — bias monitoring across credit score bands
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {report && (
            <span style={{
              fontSize: "13px",
              border: `1px solid ${statusOk ? "rgba(76,175,130,0.35)" : "rgba(212,135,58,0.35)"}`,
              color: statusOk ? "#4CAF82" : "#D4873A",
              padding: "2px 10px",
            }}>
              {statusOk ? "✓ PASS" : `⚠ ${flags.length} flag${flags.length !== 1 ? "s" : ""}`}
            </span>
          )}
          <div style={{ fontSize: "20px", color: creamDim, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</div>
        </div>
      </div>

      {open && (
        <div style={{ padding: "1.5rem" }}>
          {/* Refresh button */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem", alignItems: "center" }}>
            <button
              style={{ ...styles.btnGreen, opacity: loading ? 0.6 : 1 }}
              onClick={runAnalysis}
              disabled={loading}
            >
              {loading ? "Analysing..." : "↻ Re-run analysis"}
            </button>
            {report && (
              <span style={{ fontSize: "13px", color: creamDim }}>
                Analysed {report.analysis_scope?.total_decisions_analyzed || 0} decisions
                · {report.analysis_scope?.decisions_with_clear_outcome || 0} with clear outcome
                · {formatDate(report.analyzed_at)}
              </span>
            )}
          </div>

          {error && (
            <div style={{ background: "rgba(224,82,82,0.1)", border: `1px solid ${red}`, color: "#E05252", padding: "10px 14px", fontSize: "14px", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ fontSize: "14px", color: creamDim, fontStyle: "italic", padding: "2rem 0" }}>
              Running fairness analysis...
            </div>
          )}

          {report && !loading && (
            <>
              {/* Overall status banner */}
              <div style={{
                background: statusOk ? "rgba(76,175,130,0.1)" : "rgba(212,135,58,0.1)",
                border: `1px solid ${statusOk ? "rgba(76,175,130,0.35)" : "rgba(212,135,58,0.35)"}`,
                padding: "1rem 1.25rem",
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: creamDim, marginBottom: "4px" }}>
                    Fairness status
                  </div>
                  <div style={{ fontSize: "18px", fontFamily: "'Inter', sans-serif", color: statusOk ? "#4CAF82" : "#D4873A", fontWeight: 700 }}>
                    {statusOk ? "✓ PASS — No significant bias detected" : `⚠ REVIEW REQUIRED — ${flags.length} potential bias flag${flags.length !== 1 ? "s" : ""} detected`}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: creamDim, marginBottom: "4px" }}>Overall approval rate</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "28px", color: cream }}>
                    {report.overall?.approval_rate_pct ?? "—"}%
                  </div>
                  <div style={{ fontSize: "12px", color: creamDim }}>
                    {report.overall?.approved ?? 0} approved / {report.overall?.denied ?? 0} denied
                  </div>
                </div>
              </div>

              {/* Fairness disclaimer */}
              <div style={{ fontSize: "13px", color: "#5C5850", background: "#111110", border: "0.5px solid #242422", padding: "10px 14px", marginBottom: "1rem", lineHeight: 1.6 }}>
                ⓘ Statistical flags for internal review only. These do not constitute a legal determination of discrimination or compliance. Consult a licensed compliance lawyer before regulatory submission.
              </div>

              {/* Regulation references */}
              {report.regulation && (
                <div style={{ marginBottom: "1.5rem", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {Object.entries(report.regulation).map(([key, val]) => (
                    <span key={key} style={{ fontSize: "12px", color: creamDim, border: "0.5px solid #242422", padding: "3px 10px" }}>
                      {val}
                    </span>
                  ))}
                </div>
              )}

              {/* Credit score band breakdown */}
              {report.by_credit_score_band && Object.keys(report.by_credit_score_band).length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: creamDim, marginBottom: "1rem" }}>
                    Approval rate by credit score band
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px" }}>
                    {Object.entries(report.by_credit_score_band).map(([band, stats]) => {
                      const isFlagged = flags.some(f => f.group === band);
                      const rate = stats.approval_rate_pct ?? 0;
                      const deviation = stats.deviation_from_overall_pct ?? 0;
                      return (
                        <div key={band} style={{
                          background: isFlagged ? "rgba(212,135,58,0.08)" : "rgba(240,235,224,0.04)",
                          border: `1px solid ${isFlagged ? "rgba(212,135,58,0.35)" : "rgba(240,235,224,0.1)"}`,
                          padding: "1rem",
                          borderRadius: 8,
                          borderTop: `3px solid ${isFlagged ? amber : green}`,
                        }}>
                          <div style={{ fontSize: "12px", color: isFlagged ? "#D4873A" : creamDim, marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
                            <span>{band}</span>
                            {isFlagged && <span style={{ fontSize: "11px" }}>⚠ FLAG</span>}
                          </div>
                          {/* Bar */}
                          <div style={{ background: "#1A1A18", height: "6px", marginBottom: "6px", position: "relative" }}>
                            <div style={{
                              background: isFlagged ? amber : green,
                              height: "100%",
                              width: `${Math.min(rate, 100)}%`,
                              transition: "width 0.5s",
                            }} />
                          </div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "24px", color: isFlagged ? "#D4873A" : cream }}>
                            {rate}%
                          </div>
                          <div style={{ fontSize: "11px", color: creamDim, marginTop: "2px" }}>
                            {stats.approved ?? 0} approved · {stats.denied ?? 0} denied
                          </div>
                          <div style={{ fontSize: "11px", color: deviation > 0 ? "#4CAF82" : "#E05252", marginTop: "2px" }}>
                            {deviation > 0 ? "+" : ""}{deviation}% vs overall
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bias flags detail */}
              {flags.length > 0 && (
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: creamDim, marginBottom: "1rem" }}>
                    Bias flags requiring review
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {flags.map((f, i) => (
                      <div key={i} style={{
                        background: "rgba(212,135,58,0.08)",
                        border: "1px solid rgba(186,117,23,0.35)",
                        padding: "1rem 1.25rem",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                          <div style={{ fontSize: "14px", color: "#D4873A", fontWeight: 600 }}>
                            {f.group} — {f.approval_rate_pct}% approval rate
                          </div>
                          <span className={f.flag === "SIGNIFICANT_DISPARITY" ? "bias-flag-badge" : ""} style={{ fontSize: "11px", color: "#D4873A", border: "1px solid rgba(186,117,23,0.4)", padding: "2px 10px", borderRadius: 100, fontWeight: 700, letterSpacing: "0.04em" }}>
                            {f.flag}
                          </span>
                        </div>
                        <div style={{ fontSize: "13px", color: creamDim, lineHeight: 1.6 }}>
                          {f.message}
                        </div>
                        <div style={{ fontSize: "12px", color: "#5C5850", marginTop: "6px" }}>
                          Deviation: {f.deviation_pct > 0 ? "+" : ""}{f.deviation_pct}% vs overall {f.overall_rate_pct}%
                          · Threshold: ±{report.bias_threshold_used_pct}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {statusOk && flags.length === 0 && (
                <div style={{ background: "rgba(76,175,130,0.08)", border: "1px solid rgba(29,158,117,0.3)", padding: "1rem 1.25rem", fontSize: "14px", color: "#4CAF82" }}>
                  ✓ No significant disparities detected across credit score bands. Approval rates are within the ±{report.bias_threshold_used_pct}% threshold.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INCIDENT REPORTING PANEL
// ══════════════════════════════════════════════════════════════════════════════
function IncidentPanel({ apiKey, onStatsUpdate }) {
  const [open, setOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [loadingIncidents, setLoadingIncidents] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [patchingId, setPatchingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    severity: "medium",
    description: "",
    affected_audit_ids: "",
    root_cause: "",
    corrective_action: "",
    jurisdiction: "SG",
  });

  const openIncidents = incidents.filter(i => i.status !== "resolved");

  const fetchIncidents = useCallback(async () => {
    setLoadingIncidents(true);
    try {
      const r = await fetch(`${API}/incidents`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      if (r.ok) {
        const data = await r.json();
        setIncidents(data.incidents || []);
        if (onStatsUpdate) onStatsUpdate(data.incidents || []);
      }
    } catch (e) {}
    setLoadingIncidents(false);
  }, [apiKey]);

  useEffect(() => { if (open) fetchIncidents(); }, [open, fetchIncidents]);

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.description.trim()) { setError("Description is required."); return; }
    setSubmitting(true); setError(""); setResult(null);
    try {
      const affected = form.affected_audit_ids
        ? form.affected_audit_ids.split(",").map(s => s.trim()).filter(Boolean)
        : [];
      const payload = {
        title: form.title,
        severity: form.severity,
        description: form.description,
        affected_audit_ids: affected,
        root_cause: form.root_cause || undefined,
        corrective_action: form.corrective_action || undefined,
        jurisdiction: form.jurisdiction || undefined,
      };
      const r = await fetch(`${API}/incident`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (r.ok) {
        setResult(data);
        setShowForm(false);
        setForm({ title: "", severity: "medium", description: "", affected_audit_ids: "", root_cause: "", corrective_action: "", jurisdiction: "SG" });
        fetchIncidents();
      } else {
        setError(data.detail || "Something went wrong.");
      }
    } catch (e) { setError("Network error."); }
    setSubmitting(false);
  };

  const handlePatch = async (incidentId, update) => {
    setPatchingId(incidentId);
    try {
      const r = await fetch(`${API}/incident/${incidentId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      if (r.ok) fetchIncidents();
    } catch (e) {}
    setPatchingId(null);
  };

  const severityColor = (s) => {
    if (s === "critical") return { color: "#E05252", border: `1px solid ${red}`, background: "rgba(224,82,82,0.1)" };
    if (s === "high") return { color: "#D4873A", border: "1px solid rgba(186,117,23,0.6)", background: "rgba(212,135,58,0.1)" };
    if (s === "medium") return { color: "#D4873A", border: "1px solid rgba(186,117,23,0.3)", background: "rgba(212,135,58,0.07)" };
    return { color: creamDim, border: "0.5px solid #242422", background: "transparent" };
  };

  const statusColor = (s) => {
    if (s === "resolved") return { color: "#4CAF82", border: `1px solid ${green}` };
    if (s === "investigating") return { color: "#D4873A", border: "1px solid rgba(186,117,23,0.4)" };
    return { color: creamDim, border: "0.5px solid #242422" };
  };

  const inputStyle = {
    background: "#1A1A18", border: "0.5px solid #242422",
    color: cream, padding: "10px 14px", fontFamily: "'Inter', sans-serif",
    fontSize: "13px", outline: "none", width: "100%", borderRadius: 6,
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };
  const labelStyle = { fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, display: "block", marginBottom: "6px" };
  const fieldStyle = { marginBottom: "1rem" };

  return (
    <div style={{
      marginTop: "2rem",
      border: openIncidents.length > 0 ? `1px solid rgba(186,117,23,0.5)` : "1px solid rgba(240,235,224,0.12)",
      background: navyDark,
    }}>
      {/* Header */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          borderBottom: open ? "1px solid rgba(240,235,224,0.1)" : "none",
          background: openIncidents.length > 0 ? "rgba(186,117,23,0.06)" : "transparent",
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: cream, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Incident Reporting
            {openIncidents.length > 0 && (
              <span style={{ marginLeft: "12px", fontSize: "13px", color: "#D4873A", border: "1px solid rgba(186,117,23,0.5)", padding: "2px 10px", fontFamily: "'Inter', sans-serif", letterSpacing: "1px" }}>
                {openIncidents.length} open
              </span>
            )}
          </div>
          <div style={{ fontSize: "13px", color: creamDim, marginTop: "2px" }}>
            EU AI Act Article 72 — report AI incidents to regulators within 15 days
          </div>
        </div>
        <div style={{ fontSize: "20px", color: openIncidents.length > 0 ? "#D4873A" : creamDim, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</div>
      </div>

      {open && (
        <div style={{ padding: "1.5rem" }}>
          {/* Success */}
          {result && (
            <div style={{ background: "rgba(76,175,130,0.1)", border: `1px solid ${green}`, padding: "1rem 1.25rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#4CAF82", marginBottom: "6px" }}>✓ Incident logged</div>
              <div style={{ fontSize: "13px", color: creamDim }}>
                Incident ID: <span style={{ fontFamily: "monospace", color: cream }}>{result.incident_id}</span>
              </div>
              {result.regulator_deadline && (
                <div style={{ fontSize: "13px", color: "#D4873A", marginTop: "4px" }}>
                  ⚠ Regulator notification deadline: <strong>{result.regulator_deadline.slice(0, 10)}</strong>
                </div>
              )}
            </div>
          )}

          {/* Report button */}
          {!showForm ? (
            <button style={{ ...styles.btnAmber, marginBottom: incidents.length > 0 ? "1.5rem" : "0" }} onClick={() => setShowForm(true)}>
              + Report new incident
            </button>
          ) : (
            <div style={{ background: "rgba(212,135,58,0.06)", border: "1px solid rgba(186,117,23,0.25)", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: cream, marginBottom: "4px", fontWeight: 700 }}>Report AI incident</div>
              <div style={{ fontSize: "13px", color: "#D4873A", marginBottom: "1rem" }}>
                High/critical severity incidents must be reported to the regulator within 15 days (EU AI Act Article 72).
              </div>
              {error && (
                <div style={{ background: "rgba(224,82,82,0.1)", border: `1px solid ${red}`, color: "#E05252", padding: "8px 12px", fontSize: "13px", marginBottom: "1rem" }}>
                  {error}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Incident title *</label>
                  <input style={inputStyle} placeholder="e.g. Loan model incorrectly denied 12 applications" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Severity</label>
                  <select style={selectStyle} value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
                    <option value="low">Low — minor issue, no regulatory impact</option>
                    <option value="medium">Medium — notable issue, monitor</option>
                    <option value="high">High — significant harm, report within 15 days</option>
                    <option value="critical">Critical — immediate regulatory action required</option>
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Jurisdiction</label>
                  <select style={selectStyle} value={form.jurisdiction} onChange={e => setForm(f => ({ ...f, jurisdiction: e.target.value }))}>
                    <option value="SG">🇸🇬 Singapore (MAS)</option>
                    <option value="ID">🇮🇩 Indonesia (OJK)</option>
                    <option value="EU">🇪🇺 EU (EU AI Act)</option>
                    <option value="UAE">🇦🇪 UAE (VARA)</option>
                  </select>
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, height: "80px", resize: "vertical" }} placeholder="Describe what happened, when, and what AI system was involved..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Affected audit IDs (comma-separated, optional)</label>
                <input style={inputStyle} placeholder="e.g. abc123, def456" value={form.affected_audit_ids} onChange={e => setForm(f => ({ ...f, affected_audit_ids: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Root cause (optional)</label>
                  <input style={inputStyle} placeholder="e.g. Training data bias" value={form.root_cause} onChange={e => setForm(f => ({ ...f, root_cause: e.target.value }))} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Corrective action (optional)</label>
                  <input style={inputStyle} placeholder="e.g. Retrained model, manual review" value={form.corrective_action} onChange={e => setForm(f => ({ ...f, corrective_action: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{ ...styles.btnAmber, opacity: submitting ? 0.6 : 1 }} onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Filing..." : "File incident →"}
                </button>
                <button style={styles.btn} onClick={() => { setShowForm(false); setError(""); }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Incidents list */}
          {loadingIncidents ? (
            <div style={{ fontSize: "13px", color: creamDim, fontStyle: "italic" }}>Loading incidents...</div>
          ) : incidents.length === 0 ? (
            <div style={{ fontSize: "13px", color: creamDim }}>No incidents reported yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {incidents.map((inc, i) => {
                const sev = severityColor(inc.severity);
                const sta = statusColor(inc.status);
                const isPatching = patchingId === inc.incident_id;
                return (
                  <div key={i} style={{
                    background: "#111110",
                    border: inc.status !== "resolved" ? `1px solid rgba(186,117,23,0.25)` : "1px solid rgba(240,235,224,0.08)",
                    padding: "1rem 1.25rem",
                  }}>
                    {/* Top row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "15px", color: cream, fontFamily: "'Inter', sans-serif", marginBottom: "4px" }}>
                          {inc.title}
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "11px", letterSpacing: "1px", padding: "2px 8px", ...sev }}>
                            {inc.severity?.toUpperCase()}
                          </span>
                          <span style={{ fontSize: "11px", letterSpacing: "1px", padding: "2px 8px", ...sta }}>
                            {inc.status?.toUpperCase().replace("_", " ")}
                          </span>
                          {inc.jurisdiction && (
                            <span style={{ fontSize: "11px", color: creamDim, border: "0.5px solid #242422", padding: "2px 8px" }}>
                              {inc.jurisdiction}
                            </span>
                          )}
                          {inc.reported_to_regulator && (
                            <span style={{ fontSize: "11px", color: "#4CAF82", border: `1px solid ${green}`, padding: "2px 8px" }}>
                              ✓ Reported to regulator
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ fontSize: "12px", color: creamDim, textAlign: "right", minWidth: "140px" }}>
                        <div>{formatDate(inc.occurred_at || inc.reported_at)}</div>
                        {inc.regulator_deadline && inc.status !== "resolved" && (
                          <div style={{ color: "#D4873A", marginTop: "4px" }}>
                            Deadline: {inc.regulator_deadline.slice(0, 10)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {inc.description && (
                      <div style={{ fontSize: "13px", color: creamDim, lineHeight: 1.6, marginBottom: "8px" }}>
                        {inc.description}
                      </div>
                    )}

                    {/* Meta */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "6px", marginBottom: "8px" }}>
                      {inc.root_cause && (
                        <div style={{ fontSize: "12px", color: creamDim }}>
                          Root cause: <span style={{ color: cream }}>{inc.root_cause}</span>
                        </div>
                      )}
                      {inc.corrective_action && (
                        <div style={{ fontSize: "12px", color: creamDim }}>
                          Corrective: <span style={{ color: cream }}>{inc.corrective_action}</span>
                        </div>
                      )}
                      {inc.affected_audit_ids?.length > 0 && (
                        <div style={{ fontSize: "12px", color: creamDim }}>
                          Affected: <span style={{ color: cream, fontFamily: "monospace", fontSize: "11px" }}>{inc.affected_audit_ids.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {inc.status !== "resolved" && (
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(240,235,224,0.06)" }}>
                        {inc.status === "open" && (
                          <button
                            style={{ ...styles.btnAmber, fontSize: "12px", padding: "4px 12px", opacity: isPatching ? 0.6 : 1 }}
                            onClick={() => handlePatch(inc.incident_id, { status: "investigating" })}
                            disabled={isPatching}
                          >
                            Mark investigating
                          </button>
                        )}
                        {!inc.reported_to_regulator && (inc.severity === "high" || inc.severity === "critical") && (
                          <button
                            style={{ ...styles.btn, fontSize: "12px", padding: "4px 12px", color: "#4CAF82", borderColor: "rgba(76,175,130,0.35)", opacity: isPatching ? 0.6 : 1 }}
                            onClick={() => handlePatch(inc.incident_id, { reported_to_regulator: true })}
                            disabled={isPatching}
                          >
                            ✓ Mark reported to regulator
                          </button>
                        )}
                        <button
                          style={{ ...styles.btnGreen, fontSize: "12px", padding: "4px 12px", opacity: isPatching ? 0.6 : 1 }}
                          onClick={() => handlePatch(inc.incident_id, { status: "resolved" })}
                          disabled={isPatching}
                        >
                          Mark resolved
                        </button>
                      </div>
                    )}

                    <div style={{ fontSize: "11px", color: "#5C5850", marginTop: "8px", fontFamily: "monospace" }}>
                      {inc.incident_id}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmed = key.trim();
    if (!trimmed) { setError("Please enter your API key."); return; }
    if (!trimmed.startsWith("aidal_live_")) {
      setError("Invalid key format. Keys start with aidal_live_");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${API}/summary`, {
        headers: { Authorization: `Bearer ${trimmed}` }
      });
      if (r.status === 401) {
        setError("API key not recognised. Check the key and try again.");
        setLoading(false);
        return;
      }
      if (!r.ok) {
        setError("Something went wrong. Try again.");
        setLoading(false);
        return;
      }
      const data = await r.json();
      sessionStorage.setItem("aidal_key", trimmed);
      sessionStorage.setItem("aidal_company", data.company || "");
      onLogin(trimmed, data.company || "");
    } catch (e) {
      setError("Could not reach AIDAL API. Check your connection.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.loginWrap}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
      <div style={styles.loginBox}>
        <div style={{ marginBottom: "0.25rem" }}>
          <div style={{ overflow:"hidden", width:"300px", height:"112px", position:"relative", margin:"0 auto" }}>
            <img src="https://raw.githubusercontent.com/tryaidal/landing_page_aidal/main/Copy_of_AIDAL.png" alt="AIDAL." style={{ position:"absolute", width:"330px", height:"330px", mixBlendMode:"screen", top:"-110px", left:"-10px" }} onError={e => { e.target.parentNode.innerHTML = '<span style="font-family:Playfair Display,serif;font-size:36px;font-weight:900;color:#f0ebe0;letter-spacing:4px">AIDAL.</span>'; }} />
          </div>
        </div>
        <div style={styles.loginTagline}>AI Decision Accountability Layer</div>
        {error && <div style={styles.loginError}>{error}</div>}
        <label style={styles.loginLabel}>Your API key</label>
        <input
          style={styles.loginInput}
          type="password"
          placeholder="aidal_live_xxxx..."
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          autoFocus
        />
        <button
          style={{ ...styles.loginBtn, opacity: loading ? 0.6 : 1 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Access Dashboard"}
        </button>
        <div style={styles.loginHint}>
          Don't have an API key?<br />
          POST to <span style={{ fontFamily: "monospace", color: cream }}>{API}/signup</span> with your name and email to get one.<br /><br />
          <span style={{ fontSize: "12px" }}>Your key is never stored — it lives in your browser session only.</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DECISION MODAL
// ══════════════════════════════════════════════════════════════════════════════
function DecisionModal({ record, onClose, apiKey }) {
  if (!record) return null;
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);

  useEffect(() => {
    const auditId = record.audit_id;
    if (!auditId) { setLoadingDetail(false); return; }
    fetch(`${API}/decision/${auditId}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    })
    .then(r => r.ok ? r.json() : null)
    .then(data => { if (data) setDetail(data); setLoadingDetail(false); })
    .catch(() => setLoadingDetail(false));
  }, [record.audit_id]);

  const d = detail?.decision || {};
  const outcome = getOutcomeLabel(d);
  const compliance = d.compliance || {};

  const formatCurrency = (val, currency) => {
    if (!val) return null;
    const symbols = { USD: "$", IDR: "Rp", SGD: "S$", EUR: "€", AED: "AED " };
    return (symbols[currency] || "") + Number(val).toLocaleString();
  };

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div style={styles.modalTitle}>Decision record</div>
          <button onClick={onClose} style={{ ...styles.btn, padding: "4px 12px", fontSize: "12px" }}>✕ Close</button>
        </div>

        {loadingDetail ? (
          <div style={{ color: creamDim, fontStyle: "italic", padding: "2rem 0" }}>Loading full record...</div>
        ) : (
          <>
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Decision type</span>
              <span style={styles.modalVal}>{d.decision_type || record.decision_type || "—"}</span>
            </div>
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Outcome</span>
              <span style={styles.modalVal}><span style={styles.outcomeBadge(outcome)}>{outcome}</span></span>
            </div>
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Model used</span>
              <span style={styles.modalVal}>{d.model_used || "—"}</span>
            </div>
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Jurisdiction</span>
              <span style={styles.modalVal}>{d.jurisdiction || record.jurisdiction || "—"}</span>
            </div>
            {d.input_features && (
              <div style={styles.modalRow}>
                <span style={styles.modalKey}>Input data</span>
                <div style={{ flex: 1 }}>
                  {d.input_features.credit_score && (
                    <div style={{ fontSize: "14px", color: cream, marginBottom: "4px" }}>
                      Credit score: <strong>{d.input_features.credit_score}</strong>
                    </div>
                  )}
                  {d.input_features.income && (
                    <div style={{ fontSize: "14px", color: cream, marginBottom: "4px" }}>
                      Income: <strong>{formatCurrency(d.input_features.income, d.metadata?.currency) || d.input_features.income}</strong>
                    </div>
                  )}
                  {d.input_features.loan_amount && (
                    <div style={{ fontSize: "14px", color: cream, marginBottom: "4px" }}>
                      Loan amount: <strong>{formatCurrency(d.input_features.loan_amount, d.metadata?.currency) || d.input_features.loan_amount}</strong>
                    </div>
                  )}
                  {d.metadata?.currency && (
                    <div style={{ fontSize: "13px", color: creamDim }}>Currency: {d.metadata.currency}</div>
                  )}
                </div>
              </div>
            )}
            {d.output && (
              <div style={styles.modalRow}>
                <span style={styles.modalKey}>Model output</span>
                <div style={{ flex: 1 }}>
                  {d.output.approved !== undefined && (
                    <div style={{ fontSize: "14px", color: cream, marginBottom: "4px" }}>
                      Decision: <strong>{d.output.approved ? "Approved" : "Denied"}</strong>
                    </div>
                  )}
                  {d.output.flagged !== undefined && (
                    <div style={{ fontSize: "14px", color: cream, marginBottom: "4px" }}>
                      Flagged: <strong>{d.output.flagged ? "Yes" : "No"}</strong>
                    </div>
                  )}
                  {d.output.score !== undefined && (
                    <div style={{ fontSize: "14px", color: cream, marginBottom: "4px" }}>
                      Score: <strong>{d.output.score}</strong> {d.output.tier && `(Tier ${d.output.tier})`}
                    </div>
                  )}
                  {d.output.confidence && (
                    <div style={{ fontSize: "14px", color: cream, marginBottom: "4px" }}>
                      Confidence: <strong>{(d.output.confidence * 100).toFixed(0)}%</strong>
                    </div>
                  )}
                  {d.output.action && (
                    <div style={{ fontSize: "14px", color: cream, marginBottom: "4px" }}>
                      Action: <strong>{d.output.action}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Logged at</span>
              <span style={styles.modalVal}>{formatDate(record.logged_at)}</span>
            </div>
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Audit ID</span>
              <span style={{ ...styles.modalVal, ...styles.hashText }}>{record.audit_id}</span>
            </div>
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Previous hash</span>
              <span style={{ ...styles.modalVal, ...styles.hashText }}>{detail?.prev_hash || "GENESIS"}</span>
            </div>
            {compliance.checked && (
              <div style={styles.modalRow}>
                <span style={styles.modalKey}>Compliance</span>
                <div style={{ flex: 1 }}>
                  <span style={{ ...styles.outcomeBadge(compliance.compliant ? "approved" : "denied"), marginBottom: "6px", display: "inline-block" }}>
                    {compliance.status}
                  </span>
                  <div style={{ fontSize: "13px", color: creamDim, marginTop: "6px" }}>{compliance.regulator}</div>
                  <div style={{ fontSize: "12px", color: creamDim }}>Retention required: {compliance.retention_required_years} years</div>
                  {compliance.missing_required?.length > 0 && (
                    <div style={{ fontSize: "12px", color: "#E05252", marginTop: "4px" }}>
                      Missing required: {compliance.missing_required.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}
            {(d.explanation || record.explanation) && (
              <div>
                <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: creamDim, marginBottom: "8px" }}>
                  AI explanation — Article 13 compliant
                </div>
                <div style={styles.explanationBox}>{d.explanation || record.explanation}</div>
                <div style={{ fontSize: "12px", color: "#5C5850", marginTop: "6px", lineHeight: 1.6 }}>
                  ⓘ AI-generated explanation. Verify against source decision data before regulatory submission.
                </div>
              </div>
            )}

            {record.audit_id && (
              <HumanReviewPanel auditId={record.audit_id} apiKey={apiKey} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODEL REGISTRY PANEL
// ══════════════════════════════════════════════════════════════════════════════
function ModelRegistryPanel({ apiKey, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    model_name: "", model_version: "", model_type: "xgboost",
    accuracy_metric: "", bias_test_result: "passed",
    training_data_source: "", validation_date: "", jurisdiction: "SG", notes: "",
  });

  const fetchModels = useCallback(async () => {
    setLoadingModels(true);
    try {
      const r = await fetch(`${API}/models`, { headers: { Authorization: `Bearer ${apiKey}` } });
      if (r.ok) { const d = await r.json(); setModels(d.models || []); }
    } catch (e) {}
    setLoadingModels(false);
  }, [apiKey]);

  useEffect(() => { if (open) fetchModels(); }, [open, fetchModels]);

  const handleSubmit = async () => {
    if (!form.model_name.trim()) { setError("Model name is required."); return; }
    if (!form.model_version.trim()) { setError("Model version is required."); return; }
    setSubmitting(true); setError(""); setResult(null);
    try {
      const payload = {
        model_name: form.model_name,
        model_version: form.model_version,
        model_type: form.model_type,
        ...(form.accuracy_metric ? { accuracy_metric: Number(form.accuracy_metric) } : {}),
        bias_test_result: form.bias_test_result,
        training_data_source: form.training_data_source || undefined,
        validation_date: form.validation_date || undefined,
        jurisdiction: form.jurisdiction || undefined,
        notes: form.notes || undefined,
      };
      const r = await fetch(`${API}/model/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (r.ok) {
        setResult(data);
        setShowForm(false);
        setForm({ model_name: "", model_version: "", model_type: "xgboost", accuracy_metric: "", bias_test_result: "passed", training_data_source: "", validation_date: "", jurisdiction: "SG", notes: "" });
        fetchModels();
        if (onSuccess) onSuccess();
      } else {
        setError(data.detail || "Something went wrong.");
      }
    } catch (e) { setError("Network error."); }
    setSubmitting(false);
  };

  const inputStyle = {
    background: "#1A1A18", border: "0.5px solid #242422",
    color: cream, padding: "10px 14px", fontFamily: "'Inter', sans-serif",
    fontSize: "13px", outline: "none", width: "100%", borderRadius: 6,
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };
  const labelStyle = { fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, display: "block", marginBottom: "6px" };
  const fieldStyle = { marginBottom: "1rem" };

  return (
    <div style={{ marginTop: "2rem", border: "0.5px solid #242422", background: navyDark }}>
      <div
        style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: open ? "1px solid rgba(240,235,224,0.1)" : "none" }}
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: cream, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Model Registry
          </div>
          <div style={{ fontSize: "13px", color: creamDim, marginTop: "2px" }}>
            EU AI Act Article 9 — register AI models before deployment
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {models.length > 0 && (
            <span style={{ fontSize: "13px", color: "#4CAF82", border: "1px solid rgba(29,158,117,0.3)", padding: "2px 10px" }}>
              {models.length} model{models.length !== 1 ? "s" : ""} registered
            </span>
          )}
          <div style={{ fontSize: "20px", color: creamDim, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</div>
        </div>
      </div>

      {open && (
        <div style={{ padding: "1.5rem" }}>
          {result && (
            <div style={{ background: "rgba(76,175,130,0.1)", border: `1px solid ${green}`, padding: "1rem 1.25rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#4CAF82", marginBottom: "8px" }}>
                ✓ Model registered — Article 9 {result.article_9_satisfied ? "satisfied" : "partially satisfied"}
              </div>
              <div style={{ fontSize: "13px", color: creamDim }}>
                Model ID: <span style={{ fontFamily: "monospace", color: cream }}>{result.model_id}</span>
              </div>
              <div style={{ fontSize: "13px", color: creamDim, marginTop: "4px" }}>
                Hash: <span style={{ fontFamily: "monospace", fontSize: "11px" }}>{result.registration_hash?.slice(0, 32)}...</span>
              </div>
              {result.article_9_missing?.length > 0 && (
                <div style={{ fontSize: "12px", color: "#D4873A", marginTop: "6px" }}>
                  To fully satisfy Article 9, add: {result.article_9_missing.join(", ")}
                </div>
              )}
            </div>
          )}

          {!showForm ? (
            <button style={{ ...styles.btnGreen, marginBottom: models.length > 0 ? "1.5rem" : "0" }} onClick={() => setShowForm(true)}>
              + Register new model
            </button>
          ) : (
            <div style={{ background: "#111110", border: "0.5px solid #242422", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: cream, marginBottom: "1rem", fontWeight: 700 }}>
                Register AI model
              </div>
              {error && (
                <div style={{ background: "rgba(224,82,82,0.1)", border: `1px solid ${red}`, color: "#E05252", padding: "8px 12px", fontSize: "13px", marginBottom: "1rem" }}>
                  {error}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Model name *</label>
                  <input style={inputStyle} placeholder="e.g. xgboost-loan" value={form.model_name} onChange={e => setForm(f => ({ ...f, model_name: e.target.value }))} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Version *</label>
                  <input style={inputStyle} placeholder="e.g. v2.1" value={form.model_version} onChange={e => setForm(f => ({ ...f, model_version: e.target.value }))} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Model type</label>
                  <select style={selectStyle} value={form.model_type} onChange={e => setForm(f => ({ ...f, model_type: e.target.value }))}>
                    <option value="xgboost">XGBoost</option>
                    <option value="neural_network">Neural Network</option>
                    <option value="random_forest">Random Forest</option>
                    <option value="logistic_regression">Logistic Regression</option>
                    <option value="llm">LLM</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Jurisdiction</label>
                  <select style={selectStyle} value={form.jurisdiction} onChange={e => setForm(f => ({ ...f, jurisdiction: e.target.value }))}>
                    <option value="SG">🇸🇬 Singapore (MAS FEAT)</option>
                    <option value="ID">🇮🇩 Indonesia (OJK)</option>
                    <option value="EU">🇪🇺 EU (EU AI Act)</option>
                    <option value="UAE">🇦🇪 UAE (VARA)</option>
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Accuracy metric (0–1)</label>
                  <input style={inputStyle} type="number" step="0.01" min="0" max="1" placeholder="e.g. 0.94" value={form.accuracy_metric} onChange={e => setForm(f => ({ ...f, accuracy_metric: e.target.value }))} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Bias test result</label>
                  <select style={selectStyle} value={form.bias_test_result} onChange={e => setForm(f => ({ ...f, bias_test_result: e.target.value }))}>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                    <option value="not_tested">Not tested</option>
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Training data source</label>
                  <input style={inputStyle} placeholder="e.g. internal_loan_data_2024" value={form.training_data_source} onChange={e => setForm(f => ({ ...f, training_data_source: e.target.value }))} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Validation date</label>
                  <input style={inputStyle} type="date" value={form.validation_date} onChange={e => setForm(f => ({ ...f, validation_date: e.target.value }))} />
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Notes (optional)</label>
                <input style={inputStyle} placeholder="e.g. Validated by risk team before production deployment" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{ ...styles.btnGreen, opacity: submitting ? 0.6 : 1 }} onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Registering..." : "Register model →"}
                </button>
                <button style={styles.btn} onClick={() => { setShowForm(false); setError(""); }}>Cancel</button>
              </div>
            </div>
          )}

          {loadingModels ? (
            <div style={{ fontSize: "13px", color: creamDim, fontStyle: "italic" }}>Loading models...</div>
          ) : models.length === 0 ? (
            <div style={{ fontSize: "13px", color: creamDim }}>No models registered yet. Register your first model above.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {models.map((m, i) => {
                const article9Ok = m.accuracy_metric && m.bias_test_result && m.training_data_source && m.validation_date;
                return (
                  <div key={i} style={{ background: "#1A1A18", border: "0.5px solid #242422", padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: cream, fontWeight: 700 }}>
                          {m.model_name}
                        </span>
                        <span style={{ fontSize: "12px", color: creamDim, border: "0.5px solid #242422", padding: "2px 8px" }}>
                          {m.model_version}
                        </span>
                        <span style={{ fontSize: "12px", color: creamDim, border: "0.5px solid #242422", padding: "2px 8px" }}>
                          {m.model_type}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {m.jurisdiction && (
                          <span style={{ fontSize: "11px", color: creamDim, border: "0.5px solid #242422", padding: "2px 8px" }}>
                            {m.jurisdiction}
                          </span>
                        )}
                        <span style={{
                          fontSize: "11px", letterSpacing: "1px", padding: "2px 10px",
                          border: `1px solid ${article9Ok ? "rgba(76,175,130,0.35)" : "rgba(212,135,58,0.35)"}`,
                          color: article9Ok ? "#4CAF82" : "#D4873A",
                          background: article9Ok ? "rgba(76,175,130,0.08)" : "rgba(212,135,58,0.08)",
                        }}>
                          {article9Ok ? "✓ Art. 9 SATISFIED" : "⚠ Art. 9 INCOMPLETE"}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", fontSize: "12px", color: creamDim }}>
                      {m.accuracy_metric && <div>Accuracy: <span style={{ color: cream }}>{(m.accuracy_metric * 100).toFixed(1)}%</span></div>}
                      {m.bias_test_result && <div>Bias test: <span style={{ color: m.bias_test_result === "passed" ? "#4CAF82" : "#E05252" }}>{m.bias_test_result}</span></div>}
                      {m.validation_date && <div>Validated: <span style={{ color: cream }}>{m.validation_date}</span></div>}
                      {m.training_data_source && <div>Data: <span style={{ color: cream }}>{m.training_data_source}</span></div>}
                    </div>
                    {m.notes && <div style={{ fontSize: "12px", color: creamDim, fontStyle: "italic", marginTop: "6px" }}>{m.notes}</div>}
                    <div style={{ fontSize: "11px", color: "#5C5850", marginTop: "6px", fontFamily: "monospace" }}>
                      {m.model_id} · registered {formatDate(m.registered_at)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEST PANEL
// ══════════════════════════════════════════════════════════════════════════════
function TestPanel({ apiKey, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    decision_type: "loan_approval",
    model_used: "",
    credit_score: "",
    income: "",
    loan_amount: "",
    currency: "IDR",
    approved: "true",
    confidence: "",
    jurisdiction: "ID",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSend = async () => {
    if (!form.model_used) { setError("Please enter the AI model name."); return; }
    if (!form.credit_score) { setError("Please enter a credit score."); return; }
    setSending(true);
    setError("");
    setResult(null);

    const payload = {
      decision_type: form.decision_type,
      model_used: form.model_used,
      input_features: {
        credit_score: Number(form.credit_score),
        ...(form.income ? { income: Number(form.income) } : {}),
        ...(form.loan_amount ? { loan_amount: Number(form.loan_amount) } : {}),
      },
      output: {
        approved: form.approved === "true",
        ...(form.confidence ? { confidence: Number(form.confidence) } : {}),
      },
      jurisdiction: form.jurisdiction,
      metadata: { currency: form.currency },
    };

    try {
      const r = await fetch(`${API}/decision`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (r.ok) {
        setResult(data);
        onSuccess();
      } else {
        setError(data.detail || "Something went wrong.");
      }
    } catch (e) {
      setError("Network error. Check your connection.");
    }
    setSending(false);
  };

  const inputStyle = {
    background: "#1A1A18",
    border: "0.5px solid #242422",
    color: cream,
    padding: "10px 14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    outline: "none",
    width: "100%",
    borderRadius: 6,
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };
  const labelStyle = { fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, display: "block", marginBottom: "6px" };
  const fieldStyle = { marginBottom: "1rem" };

  return (
    <div style={{ marginTop: "2.5rem", border: "0.5px solid #242422", background: navyDark }}>
      <div
        style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: open ? "1px solid rgba(240,235,224,0.1)" : "none" }}
        onClick={() => { setOpen(o => !o); setResult(null); setError(""); }}
      >
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: cream, fontWeight: 600, letterSpacing: "-0.01em" }}>
            + Log a test decision
          </div>
          <div style={{ fontSize: "13px", color: creamDim, marginTop: "2px" }}>
            Send a real AI decision to your account — no code needed
          </div>
        </div>
        <div style={{ fontSize: "20px", color: creamDim, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</div>
      </div>

      {open && (
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Decision type</label>
              <select style={selectStyle} value={form.decision_type} onChange={e => set("decision_type", e.target.value)}>
                <option value="loan_approval">Loan Approval</option>
                <option value="fraud_check">Fraud Check</option>
                <option value="credit_scoring">Credit Scoring</option>
                <option value="insurance_claim">Insurance Claim</option>
                <option value="kyc_verification">KYC Verification</option>
                <option value="hiring_screening">Hiring Screening</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Jurisdiction / Regulator</label>
              <select style={selectStyle} value={form.jurisdiction} onChange={e => set("jurisdiction", e.target.value)}>
                <option value="ID">🇮🇩 Indonesia (OJK)</option>
                <option value="SG">🇸🇬 Singapore (MAS FEAT)</option>
                <option value="EU">🇪🇺 European Union (EU AI Act)</option>
                <option value="UAE">🇦🇪 UAE (VARA)</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>AI model name *</label>
              <input style={inputStyle} placeholder="e.g. xgboost-v2, gpt-4o" value={form.model_used} onChange={e => set("model_used", e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Decision outcome</label>
              <select style={selectStyle} value={form.approved} onChange={e => set("approved", e.target.value)}>
                <option value="true">Approved / Passed / Clear</option>
                <option value="false">Denied / Flagged / Rejected</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Credit score *</label>
              <input style={inputStyle} type="number" placeholder="e.g. 720" value={form.credit_score} onChange={e => set("credit_score", e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Model confidence (0–1)</label>
              <input style={inputStyle} type="number" placeholder="e.g. 0.91" step="0.01" min="0" max="1" value={form.confidence} onChange={e => set("confidence", e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Applicant income (optional)</label>
              <input style={inputStyle} type="number" placeholder="e.g. 80000" value={form.income} onChange={e => set("income", e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Loan amount (optional)</label>
              <input style={inputStyle} type="number" placeholder="e.g. 25000" value={form.loan_amount} onChange={e => set("loan_amount", e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Currency</label>
              <select style={selectStyle} value={form.currency} onChange={e => set("currency", e.target.value)}>
                <option value="IDR">IDR — Indonesian Rupiah</option>
                <option value="SGD">SGD — Singapore Dollar</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="AED">AED — UAE Dirham</option>
              </select>
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(224,82,82,0.1)", border: "0.5px solid #E05252", color: "#E05252", padding: "10px 14px", fontSize: "13px", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          {result && (
            <div style={{ background: "rgba(76,175,130,0.1)", border: `0.5px solid rgba(76,175,130,0.35)`, padding: "1.25rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#4CAF82", marginBottom: "10px" }}>✓ Decision logged successfully</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px", color: creamDim }}>
                <div><span style={{ color: cream }}>Audit ID:</span> <span style={{ fontFamily: "monospace" }}>{result.audit_id}</span></div>
                <div><span style={{ color: cream }}>Compliance:</span> <span style={{ color: result.compliance?.compliant ? "#4CAF82" : "#E05252" }}>{result.compliance?.status || "—"}</span></div>
              </div>
              {result.explanation && (
                <div style={{ marginTop: "10px", borderTop: "1px solid rgba(29,158,117,0.2)", paddingTop: "10px" }}>
                  <div style={{ fontSize: "14px", color: "#4CAF82", fontStyle: "italic", lineHeight: 1.7 }}>
                    {result.explanation}
                  </div>
                  <div style={{ fontSize: "12px", color: "#5C5850", marginTop: "6px" }}>
                    ⓘ AI-generated explanation. Verify against source decision data before regulatory submission.
                  </div>
                </div>
              )}
              {result.compliance?.missing_recommended?.length > 0 && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#D4873A" }}>
                  Tip: Add {result.compliance.missing_recommended.slice(0,2).join(", ")} to improve compliance score.
                </div>
              )}
            </div>
          )}

          <button
            style={{ background: accentColor, border: "none", color: "#0A0A09", padding: "10px 24px", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", opacity: sending ? 0.6 : 1, borderRadius: 6, transition: "all 0.15s ease" }}
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? "Sending..." : "Log this decision →"}
          </button>

          {result && (
            <button
              style={{ marginLeft: "10px", background: "transparent", border: `0.5px solid ${bgBorder}`, color: creamDim, padding: "10px 20px", fontFamily: "'Inter', sans-serif", fontSize: "13px", cursor: "pointer", borderRadius: 6, transition: "all 0.15s ease" }}
              onClick={() => { setResult(null); setForm({ decision_type: "loan_approval", model_used: "", credit_score: "", income: "", loan_amount: "", currency: "IDR", approved: "true", confidence: "", jurisdiction: "ID" }); }}
            >
              Log another
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({ apiKey, companyName, onLogout }) {
  const countdown = useCountdown();
  const [health, setHealth] = useState(null);
  const [summary, setSummary] = useState(null);
  const [verify, setVerify] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [loadingDecisions, setLoadingDecisions] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterJurisdiction, setFilterJurisdiction] = useState("");
  const [searchId, setSearchId] = useState("");
  const [selected, setSelected] = useState(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [openIncidentCount, setOpenIncidentCount] = useState(0);
  const limit = 10;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [h, s, v] = await Promise.all([
        fetch(`${API}/health`).then(r => r.json()),
        fetch(`${API}/summary`, { headers: { Authorization: `Bearer ${apiKey}` } }).then(r => r.json()),
        fetch(`${API}/verify`, { headers: { Authorization: `Bearer ${apiKey}` } }).then(r => r.json()),
      ]);
      setHealth(h);
      setSummary(s);
      setVerify(v);
    } catch (e) {
      setHealth({ status: "error" });
    }
    setLoading(false);
  }, [apiKey]);

  const fetchDecisions = useCallback(async () => {
    setLoadingDecisions(true);
    const params = new URLSearchParams({ limit, offset });
    if (filterType) params.set("decision_type", filterType);
    if (filterJurisdiction) params.set("jurisdiction", filterJurisdiction);
    try {
      const r = await fetch(`${API}/decisions?${params}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      }).then(r => r.json());
      setDecisions(r.decisions || []);
      setTotal(Number(r.total) || 0);
    } catch (e) {
      setDecisions([]);
    }
    setLoadingDecisions(false);
  }, [apiKey, filterType, filterJurisdiction, offset]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { fetchDecisions(); }, [fetchDecisions]);

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    try {
      const r = await fetch(`${API}/decision/${searchId.trim()}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      if (r.ok) {
        const data = await r.json();
        setSelected(data);
      } else {
        alert("Decision not found.");
      }
    } catch (e) {
      alert("Search failed.");
    }
  };

  const runVerify = async () => {
    const v = await fetch(`${API}/verify`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    }).then(r => r.json());
    setVerify(v);
  };

  const apiOk = health?.status === "ok";
  const types = summary?.by_type?.map(b => b.type).filter(Boolean) || [];
  const jurisdictions = summary?.by_jurisdiction?.map(b => b.jurisdiction).filter(Boolean) || [];
  const chainOk = verify?.verified === true;
  const oversight = summary?.human_oversight;
  const oversightPct = oversight?.oversight_rate_pct ?? 0;

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.85); }
        }
        @keyframes bias-pulse {
          0%, 100% { opacity: 1; box-shadow: none; }
          50% { opacity: 0.7; box-shadow: 0 0 10px rgba(212,135,58,0.45); }
        }
        tr:hover td, tr:hover td * { background: inherit; }
        table tr:hover > td { background: #1A1A18 !important; }
        table tbody tr:nth-child(even) > td { background: rgba(26,26,24,0.55) !important; }
        table tbody tr:nth-child(even):hover > td { background: #1A1A18 !important; }
        select option { background: #111110; color: #F5F0E8; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0A0A09; }
        ::-webkit-scrollbar-thumb { background: #242422; border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: #5C5850; }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(76,175,130,0.5) !important;
          box-shadow: 0 0 0 2.5px rgba(76,175,130,0.1) !important;
          outline: none;
        }
        .sidebar-item { transition: background 0.12s ease, color 0.12s ease; }
        .sidebar-item:hover { background: rgba(240,235,224,0.05) !important; color: #F5F0E8 !important; }
        .bias-flag-badge { animation: bias-pulse 2.2s ease-in-out infinite; }
        .stat-card { transition: background 0.15s ease; }
        .stat-card:hover { background: #181816 !important; }
        .panel-card { transition: background 0.15s ease; border-radius: 8px; }
        .panel-card:hover { background: #181816 !important; }
      `}</style>

      <div style={styles.countdown}>
        <span style={{ color: textMuted }}>EU AI Act deadline</span>
        <span style={{ color: bgBorder, margin: "0 8px" }}>·</span>
        <span style={{ color: accentColor, fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: "tabular-nums" }}>{countdown}</span>
        <span style={{ color: bgBorder, margin: "0 8px" }}>·</span>
        <span style={{ color: textMuted }}>Non-compliance fines up to €30M</span>
      </div>

      <div style={{ ...styles.header, position: "sticky", top: "36px", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ overflow:"hidden", width:"120px", height:"44px", position:"relative", flexShrink:0 }}>
            <img src="https://raw.githubusercontent.com/tryaidal/landing_page_aidal/main/Copy_of_AIDAL.png" alt="AIDAL." style={{ position:"absolute", width:"132px", height:"132px", mixBlendMode:"screen", top:"-44px", left:"-4px" }} onError={e => { e.target.parentNode.innerHTML = '<span style="font-family:Playfair Display,serif;font-size:18px;font-weight:700;color:#f0ebe0;letter-spacing:2px">AIDAL.</span>'; }} />
          </div>
          <span style={{ fontSize: "12px", color: bgBorder, marginLeft: "4px" }}>|</span>
          <span style={{ fontSize: "12px", color: creamDim, letterSpacing: "0.02em" }}>{companyName}</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.statusText}>
            <span style={styles.statusDot(apiOk)} />
            {apiOk ? "API online" : "API offline"}
          </span>
          <button style={styles.btn} onClick={fetchAll}>↻ Refresh</button>
          <button style={styles.btnDanger} onClick={onLogout}>Sign out</button>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* ── SIDEBAR ── */}
        <aside style={styles.sidebar}>
          <span style={styles.sidebarSection}>Overview</span>
          <a href="#top" className="sidebar-item" style={styles.sidebarItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a href="#audit-log" className="sidebar-item" style={styles.sidebarItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
            Audit Log
          </a>
          <div style={styles.sidebarDivider} />
          <span style={styles.sidebarSection}>Tools</span>
          <a href="#log-decision" className="sidebar-item" style={styles.sidebarItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Log a Decision
          </a>
          <a href="#model-registry" className="sidebar-item" style={styles.sidebarItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            Model Registry
          </a>
          <a href="#fairness" className="sidebar-item" style={styles.sidebarItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Fairness Detection
          </a>
          <a href="#incidents" className="sidebar-item" style={styles.sidebarItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Incident Reporting
          </a>
          <div style={styles.sidebarDivider} />
          <span style={styles.sidebarSection}>Resources</span>
          <a href="https://aidal-dashboard.vercel.app/verify" target="_blank" rel="noreferrer" className="sidebar-item" style={{ ...styles.sidebarItem, color: "#4CAF82" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Public Verify ↗
          </a>
          <a href="https://github.com/widjajaanthony24-svg/aidal-anchors" target="_blank" rel="noreferrer" className="sidebar-item" style={styles.sidebarItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            Anchor Log ↗
          </a>
          <a href="https://aidal-production.up.railway.app/docs" target="_blank" rel="noreferrer" className="sidebar-item" style={styles.sidebarItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            API Docs ↗
          </a>
        </aside>

        {/* ── MAIN + FOOTER ── */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div id="top" style={styles.main}>
        <div style={styles.pageTitle}>Compliance Dashboard</div>
        <div style={styles.pageSubtitle}>
          {companyName} · AI decisions logged, explained, and cryptographically verified ·{" "}
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>

        {/* ── STAT GRID — 5 cards ── */}
        <div style={styles.statGrid}>
          <div className="stat-card" style={{ ...styles.statCard, borderTop: `3px solid ${accentColor}` }}>
            <span style={styles.statLabel}>Total decisions</span>
            <span style={styles.statValue}>{loading ? "—" : (summary?.total_decisions ?? 0)}</span>
            <div style={styles.statSub}>All time</div>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, borderTop: `3px solid ${chainOk ? green : red}` }}>
            <span style={styles.statLabel}>Chain status</span>
            {loading ? (
              <span style={styles.statValue}>—</span>
            ) : chainOk ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span style={{ ...styles.statValue, color: green, fontSize: "22px" }}>✓ Clean</span>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", background: "rgba(76,175,130,0.12)", border: "1px solid rgba(76,175,130,0.3)", color: green, padding: "3px 10px", borderRadius: 100 }}>VERIFIED</span>
              </div>
            ) : (
              <span style={{ ...styles.statValue, color: red, fontSize: "22px" }}>
                {verify?.status === "no_records" ? "No data" : "⚠ Check"}
              </span>
            )}
            <div style={styles.statSub}>{verify?.records_verified ?? 0} records verified</div>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, borderTop: `3px solid rgba(200,169,110,0.5)` }}>
            <span style={styles.statLabel}>Jurisdictions</span>
            <span style={styles.statValue}>{loading ? "—" : (jurisdictions.length || 0)}</span>
            <div style={styles.statSub}>{jurisdictions.join(", ") || "—"}</div>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, borderTop: `3px solid ${oversightPct > 0 ? green : amber}` }}>
            <span style={styles.statLabel}>Article 14 coverage</span>
            <span style={{ ...styles.statValue, color: oversightPct > 0 ? green : amber }}>
              {loading ? "—" : `${oversightPct}%`}
            </span>
            <div style={styles.statSub}>
              {loading ? "" : oversightPct > 0
                ? `${oversight?.decisions_reviewed} decision${oversight?.decisions_reviewed !== 1 ? "s" : ""} reviewed`
                : "No human reviews yet"}
            </div>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, borderRight: "none", borderTop: `3px solid ${openIncidentCount > 0 ? amber : "rgba(240,235,224,0.1)"}` }}>
            <span style={styles.statLabel}>Open incidents</span>
            <span style={{ ...styles.statValue, color: openIncidentCount > 0 ? amber : cream }}>
              {openIncidentCount}
            </span>
            <div style={{ ...styles.statSub, color: openIncidentCount > 0 ? amber : creamDim }}>
              {openIncidentCount > 0 ? "Requires attention" : "All clear"}
            </div>
          </div>
        </div>

        {verify && verify.status !== "no_records" && (
          <div style={styles.verifyBanner(chainOk)}>
            <div style={styles.verifyText(chainOk)}>
              <span style={{ fontSize: "20px" }}>{chainOk ? "✓" : "⚠"}</span>
              <span>
                {chainOk
                  ? `Ledger integrity confirmed — ${verify.records_verified} records verified`
                  : `Tampered record detected at ${verify.first_tampered_audit_id}`}
              </span>
            </div>
            <button style={styles.btn} onClick={runVerify}>Run verification</button>
          </div>
        )}

        {chainOk && verify?.certificate && (
          <div style={styles.certBox}>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: creamDim, marginBottom: "4px" }}>
                Compliance certificate
              </div>
              <div style={styles.certText}>{verify.certificate}</div>
            </div>
            <div style={{ fontSize: "12px", color: creamDim }}>
              Verified {formatDate(verify.verified_at)}
            </div>
          </div>
        )}

        {/* ── PDF DOWNLOAD BUTTONS ── */}
        {!loading && summary && summary.total_decisions > 0 && (
          <div style={{ marginBottom: "1.5rem", border: `0.5px solid ${bgBorder}`, background: navyDark, padding: "1rem 1.25rem", borderRadius: 8 }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: "0.75rem" }}>
              Download compliance report
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { jur: "SG", label: "MAS FEAT" },
                { jur: "ID", label: "OJK" },
                { jur: "EU", label: "EU AI Act" },
                { jur: "UAE", label: "VARA" },
                { jur: null, label: "All jurisdictions" },
              ].map(({ jur, label }) => (
                <button
                  key={jur || "ALL"}
                  style={{
                    background: navyLight,
                    border: `0.5px solid ${bgBorder}`,
                    color: creamDim,
                    padding: "7px 14px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    borderRadius: 6,
                    transition: "all 0.15s ease",
                  }}
                  onClick={() => {
                    const url = jur
                      ? `${API}/compliance/report/pdf?jurisdiction=${jur}`
                      : `${API}/compliance/report/pdf`;
                    fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } })
                      .then(r => {
                        if (!r.ok) throw new Error("Failed");
                        return r.blob();
                      })
                      .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = blobUrl;
                        a.download = `AIDAL_Report_${jur || "ALL"}_${new Date().toISOString().slice(0,10)}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                      })
                      .catch(() => alert("Download failed. Check your connection."));
                  }}
                >
                  <span style={{ color: accentColor }}>↓</span> {label} PDF
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ARTICLE 14 BANNER ── */}
        {!loading && summary && (
          <div style={{
            background: oversightPct > 0 ? "rgba(76,175,130,0.08)" : "rgba(212,135,58,0.08)",
            border: `0.5px solid ${oversightPct > 0 ? "rgba(76,175,130,0.25)" : "rgba(212,135,58,0.3)"}`,
            padding: "0.875rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 8,
          }}>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: "4px" }}>
                EU AI Act Article 14 — Human Oversight
              </div>
              <div style={{ fontSize: "13px", color: oversightPct > 0 ? green : amber }}>
                {oversightPct > 0
                  ? `✓ ${oversight?.decisions_reviewed} of ${oversight?.total_decisions} decisions have human review (${oversightPct}% coverage)`
                  : "⚠ No human reviews logged yet — click any decision → Log review to satisfy Article 14"}
              </div>
            </div>
            {oversightPct === 0 && (
              <div style={{ fontSize: "12px", color: creamDim, textAlign: "right", maxWidth: "240px" }}>
                Click any decision → "Log review" to satisfy Article 14.
              </div>
            )}
          </div>
        )}

        <div id="audit-log" style={{ ...styles.toolbar, marginTop: "2rem" }}>
          <select style={styles.select} value={filterType} onChange={e => { setFilterType(e.target.value); setOffset(0); }}>
            <option value="">All decision types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select style={styles.select} value={filterJurisdiction} onChange={e => { setFilterJurisdiction(e.target.value); setOffset(0); }}>
            <option value="">All jurisdictions</option>
            {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
          <input
            style={styles.input}
            placeholder="Search by audit ID..."
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button style={styles.btnPrimary} onClick={handleSearch}>Search</button>
          {(filterType || filterJurisdiction) && (
            <button style={styles.btn} onClick={() => { setFilterType(""); setFilterJurisdiction(""); setOffset(0); }}>
              Clear filters
            </button>
          )}
        </div>

        {loadingDecisions ? (
          <div style={styles.loading}>Loading decisions...</div>
        ) : decisions.length === 0 ? (
          <div style={styles.empty}>
            {total === 0
              ? "No decisions logged yet. Integrate the AIDAL API to start recording."
              : "No decisions match the current filters."}
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Outcome</th>
                  <th style={styles.th}>Jurisdiction</th>
                  <th style={styles.th}>Explanation</th>
                  <th style={styles.th}>Logged at</th>
                  <th style={styles.th}>Audit ID</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {decisions.map((r, i) => {
                  const outcome = getOutcomeLabel(r);
                  return (
                    <tr key={r.audit_id || i} style={{ cursor: "pointer" }} onClick={() => setSelected(r)}>
                      <td style={styles.tdPrimary}>{r.decision_type || "—"}</td>
                      <td style={styles.td}>
                        <span style={styles.outcomeBadge(outcome)}>{outcome}</span>
                      </td>
                      <td style={styles.td}>
                        {r.jurisdiction ? <span style={styles.jurBadge(r.jurisdiction)}>{r.jurisdiction}</span> : "—"}
                      </td>
                      <td style={{ ...styles.td, maxWidth: "300px" }}>
                        <span style={{ fontSize: "13px", fontStyle: "italic", color: creamDim }}>
                          {r.explanation ? r.explanation.slice(0, 80) + "..." : "—"}
                        </span>
                      </td>
                      <td style={styles.td}>{formatDate(r.logged_at)}</td>
                      <td style={{ ...styles.td, ...styles.hashText }}>
                        {r.audit_id?.slice(0, 14)}...
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button style={{ ...styles.btn, padding: "4px 12px", fontSize: "12px" }}
                            onClick={e => { e.stopPropagation(); setSelected(r); }}>
                            View
                          </button>
                          <a
                            href={`https://aidal-dashboard.vercel.app/verify?id=${r.audit_id}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ ...styles.btn, padding: "4px 12px", fontSize: "11px", textDecoration: "none", color: "#4CAF82", borderColor: "rgba(76,175,130,0.35)", letterSpacing: "0.5px" }}>
                            ✓ Verify
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={styles.pager}>
              <span>Showing {offset + 1}–{Math.min(offset + limit, offset + decisions.length)} of {total} total</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={styles.btn} disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - limit))}>← Previous</button>
                <button style={styles.btn} disabled={decisions.length < limit}
                  onClick={() => setOffset(offset + limit)}>Next →</button>
              </div>
            </div>
          </>
        )}

        {/* ── BOTTOM PANELS ── */}
        <div id="log-decision"><TestPanel apiKey={apiKey} onSuccess={() => { fetchAll(); fetchDecisions(); }} /></div>
        <div id="model-registry"><ModelRegistryPanel apiKey={apiKey} onSuccess={fetchAll} /></div>
        <div id="fairness"><FairnessPanel apiKey={apiKey} /></div>
        <div id="incidents"><IncidentPanel
          apiKey={apiKey}
          onStatsUpdate={(incidents) => {
            const open = incidents.filter(i => i.status !== "resolved").length;
            setOpenIncidentCount(open);
          }}
        /></div>

        {summary?.by_type?.length > 0 && (() => {
          const total = summary.by_type.reduce((s, b) => s + (b.count || 0), 0);
          return (
            <div style={{ marginTop: "2.5rem" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: "1rem", fontWeight: 600 }}>
                Breakdown by type
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                {summary.by_type.map((b, i) => {
                  const tag = typeTagPalette[i % typeTagPalette.length];
                  const pct = total > 0 ? Math.round((b.count / total) * 100) : 0;
                  return (
                    <div key={i} className="panel-card" style={{ background: navyDark, border: `0.5px solid ${bgBorder}`, borderRadius: 8, padding: "1.125rem 1.25rem", borderTop: `2px solid ${tag.color}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: tag.color, textTransform: "uppercase", letterSpacing: "0.08em", background: tag.bg, padding: "2px 8px", borderRadius: 100 }}>{b.type}</div>
                        <div style={{ fontSize: "11px", color: creamDim }}>{pct}%</div>
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "28px", fontWeight: 700, color: cream, lineHeight: 1, marginBottom: "10px", letterSpacing: "-0.02em" }}>{b.count}</div>
                      <div style={{ background: "#1A1A18", height: "4px", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ background: tag.color, height: "100%", width: `${pct}%`, borderRadius: 2, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        </div>{/* end styles.main */}

        <div style={{ borderTop: `0.5px solid ${bgBorder}`, padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: textMuted }}>
          <span style={{ display: "inline-block", overflow: "hidden", width: "120px", height: "45px", position: "relative", flexShrink: 0 }}>
            <img src="https://raw.githubusercontent.com/tryaidal/landing_page_aidal/main/Copy_of_AIDAL.png" alt="AIDAL." style={{ position: "absolute", width: "132px", height: "132px", mixBlendMode: "screen", top: "-44px", left: "-4px", display: "block" }} onError={e => { e.target.parentNode.innerHTML = '<span style="font-family:Inter,sans-serif;font-size:15px;font-weight:600;color:#9C9690;letter-spacing:0.06em">AIDAL.</span>'; }} />
          </span>
          <span>AI Decision Accountability Layer</span>
          <span>© 2026 AIDAL</span>
        </div>
        </div>{/* end flex:1 content wrapper */}
      </div>{/* end sidebar+main flex row */}

      {selected && <DecisionModal record={selected} onClose={() => setSelected(null)} apiKey={apiKey} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = sessionStorage.getItem("aidal_key") || "";
    const company = sessionStorage.getItem("aidal_company") || "";
    if (key) { setApiKey(key); setCompanyName(company); }
    setReady(true);
  }, []);

  const handleLogin = (key, company) => {
    sessionStorage.setItem("aidal_key", key);
    sessionStorage.setItem("aidal_company", company);
    setApiKey(key);
    setCompanyName(company);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("aidal_key");
    sessionStorage.removeItem("aidal_company");
    setApiKey("");
    setCompanyName("");
  };

  if (!ready) return null;
  if (!apiKey) return <LoginScreen onLogin={handleLogin} />;
  return <Dashboard apiKey={apiKey} companyName={companyName} onLogout={handleLogout} />;
}
