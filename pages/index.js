import { useState, useEffect, useCallback } from "react";

const API = "https://aidal-production.up.railway.app";

// Item 3 (verification pass): the explanation-generation fix (correct dates,
// no raw internal IDs) deployed at this exact commit timestamp. Any decision
// logged before this genuinely used the old, buggy generator and is
// preserved unmodified per the append-only design — the banner below
// discloses this automatically rather than silently showing old bugs.
const EXPLANATION_FIX_CUTOFF = new Date("2026-07-16T00:34:33+00:00");
const EXPLANATION_FIX_DATE_LABEL = "16 July 2026";

const navy     = "#0F1117";
const cream    = "#F0F2F5";
const creamDim = "#8B92A5";
const navyDark = "#1A1D27";
const navyLight= "#1A1D27";
const green    = "#10B981";
const red      = "#EF4444";
const amber    = "#F59E0B";
const bgBorder = "rgba(255,255,255,0.08)";
const textMuted= "#8B92A5";
const accentColor = "#C8A96E";

// ══════════════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS — replaces native alert() popups everywhere in the app.
// Module-level pub/sub so any component (deeply nested modals included) can
// call showToast(...) without prop-drilling. <ToastHost/> is mounted once.
// ══════════════════════════════════════════════════════════════════════════════
let _toastListeners = [];
function showToast(message, tone) {
  const toast = { id: Date.now() + Math.random(), message, tone: tone || "error" };
  _toastListeners.forEach(fn => fn(toast));
}
function ToastHost() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const listener = (t) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 4500);
    };
    _toastListeners.push(listener);
    return () => { _toastListeners = _toastListeners.filter(l => l !== listener); };
  }, []);
  const toneStyle = {
    error:   { border: "rgba(239,68,68,0.35)",  bg: "rgba(239,68,68,0.08)",  color: "#F0F2F5", icon: "⚠" },
    success: { border: "rgba(16,185,129,0.35)", bg: "rgba(16,185,129,0.08)", color: "#F0F2F5", icon: "✓" },
    info:    { border: "rgba(200,169,110,0.35)",bg: "rgba(200,169,110,0.08)",color: "#F0F2F5", icon: "ⓘ" },
  };
  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999, display: "flex", flexDirection: "column-reverse", gap: "8px", maxWidth: "360px" }}>
      {toasts.map(t => {
        const s = toneStyle[t.tone] || toneStyle.error;
        return (
          <div key={t.id} className="toast-item" style={{
            background: "#1A1D27", border: `1px solid ${s.border}`, borderLeft: `3px solid ${s.border.replace("0.35","0.9")}`,
            color: s.color, padding: "12px 14px", fontSize: "13px", fontFamily: "'IBM Plex Sans', sans-serif",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)", display: "flex", alignItems: "flex-start", gap: "10px",
          }}>
            <span style={{ flexShrink: 0 }}>{s.icon}</span>
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}

const jurColors = {
  SG:  { bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)",  color: "#10B981" },
  EU:  { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)",  color: "#F59E0B" },
  ID:  { bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.25)",  color: "#60A5FA" },
  UAE: { bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)", color: "#A78BFA" },
  UK:  { bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.25)",  color: "#6366F1" },
  US:  { bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)",   color: "#EF4444" },
  AU:  { bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.25)",  color: "#FB923C" },
};
const typeTagPalette = [
  { bg: "rgba(45,107,228,0.10)",  color: "#2D6BE4" },
  { bg: "rgba(96,165,250,0.08)",  color: "#60A5FA" },
  { bg: "rgba(16,185,129,0.08)",  color: "#10B981" },
  { bg: "rgba(167,139,250,0.08)", color: "#A78BFA" },
  { bg: "rgba(239,68,68,0.08)",   color: "#EF4444" },
  { bg: "rgba(236,72,153,0.08)",  color: "#EC4899" },
];

const styles = {
  app: {
    minHeight: "100vh",
    background: navy,
    color: cream,
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    fontSize: "13px",
    lineHeight: 1.6,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },

  loginWrap: {
    minHeight: "100vh",
    background: "#FAF3EB",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  loginBox: {
    width: "100%",
    maxWidth: 420,
    border: "1px solid #D8CFC4",
    padding: "2.5rem",
    background: "#F0E6D6",
    borderRadius: 0,
  },
  loginLogo: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "20px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    color: "#0A0A0A",
    marginBottom: "0.25rem",
  },
  loginTagline: {
    fontSize: "11px",
    color: "#6B6560",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: "2rem",
  },
  loginLabel: {
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#6B6560",
    display: "block",
    marginBottom: "6px",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  loginInput: {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #D8CFC4",
    color: "#0A0A0A",
    padding: "10px 14px",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "1rem",
    borderRadius: 0,
    transition: "border-color 0.15s ease",
  },
  loginBtn: {
    width: "100%",
    background: "#0A0A0A",
    border: "none",
    color: "#FAF3EB",
    padding: "11px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    borderRadius: 0,
    transition: "opacity 0.15s ease",
  },
  loginError: {
    background: "rgba(239,68,68,0.08)",
    border: `1px solid ${red}`,
    color: red,
    padding: "10px 14px",
    fontSize: "13px",
    marginBottom: "1rem",
    borderRadius: 0,
  },
  loginHint: {
    marginTop: "1.5rem",
    fontSize: "12px",
    color: "#6B6560",
    borderTop: "1px solid #D8CFC4",
    paddingTop: "1.5rem",
    lineHeight: 1.8,
  },

  header: {
    borderBottom: `1px solid ${bgBorder}`,
    padding: "0 2rem",
    height: "52px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: navy,
  },
  logo: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "16px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    color: cream,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
  },
  companyBadge: {
    fontSize: "11px",
    color: creamDim,
    background: navyLight,
    padding: "4px 10px",
    border: `1px solid ${bgBorder}`,
    borderRadius: 0,
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: "0.04em",
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
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "18px",
    fontWeight: 700,
    color: "#F0F4F8",
    marginBottom: "0.25rem",
    letterSpacing: "-0.02em",
  },
  pageSubtitle: {
    fontSize: "12px",
    color: "#6B7A8D",
    marginBottom: "1.75rem",
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: "0.04em",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "0",
    background: bgBorder,
    border: `1px solid ${bgBorder}`,
    marginBottom: "1.5rem",
    borderRadius: 0,
    overflow: "hidden",
  },
  statCard: {
    background: navyDark,
    padding: "1.25rem 1.5rem",
    borderRight: `1px solid ${bgBorder}`,
    borderTop: `2px solid ${bgBorder}`,
  },
  statLabel: {
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: textMuted,
    marginBottom: "8px",
    display: "block",
    fontWeight: 500,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  statValue: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "28px",
    fontWeight: 500,
    color: cream,
    lineHeight: 1,
    display: "block",
    letterSpacing: "-0.02em",
  },
  statSub: {
    fontSize: "13px",
    color: creamDim,
    marginTop: "6px",
    lineHeight: 1.4,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  verifyBanner: (valid) => ({
    background: valid ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)",
    border: `1px solid ${valid ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
    padding: "0.875rem 1.25rem",
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 0,
  }),
  verifyText: (valid) => ({
    fontSize: "12px",
    color: valid ? green : red,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: "0.04em",
  }),
  btn: {
    background: "transparent",
    border: `1px solid ${bgBorder}`,
    color: creamDim,
    padding: "6px 14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    borderRadius: 0,
  },
  btnPrimary: {
    background: "#C8A96E",
    border: "none",
    color: "#0A0A0A",
    padding: "6px 14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    borderRadius: 0,
    transition: "all 0.15s ease",
  },
  btnDanger: {
    background: "transparent",
    border: "none",
    color: red,
    padding: "6px 14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  btnGreen: {
    background: "rgba(16,185,129,0.08)",
    border: `1px solid rgba(16,185,129,0.3)`,
    color: green,
    padding: "6px 14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "12px",
    cursor: "pointer",
    borderRadius: 0,
    transition: "all 0.15s ease",
  },
  btnAmber: {
    background: "rgba(245,158,11,0.08)",
    border: `1px solid rgba(245,158,11,0.3)`,
    color: amber,
    padding: "6px 14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "12px",
    cursor: "pointer",
    borderRadius: 0,
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
    border: `1px solid ${bgBorder}`,
    color: cream,
    padding: "6px 12px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "12px",
    cursor: "pointer",
    outline: "none",
    borderRadius: 0,
  },
  input: {
    background: navyDark,
    border: `1px solid ${bgBorder}`,
    color: cream,
    padding: "6px 12px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "12px",
    outline: "none",
    width: "260px",
    borderRadius: 0,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: navy,
    border: `1px solid ${bgBorder}`,
  },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: textMuted,
    borderBottom: `1px solid ${bgBorder}`,
    background: navyDark,
    fontWeight: 500,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  td: {
    padding: "11px 14px",
    fontSize: "12px",
    color: creamDim,
    borderBottom: `1px solid ${bgBorder}`,
    verticalAlign: "top",
    transition: "background 0.1s ease",
  },
  tdPrimary: {
    padding: "11px 14px",
    fontSize: "11px",
    color: cream,
    borderBottom: `1px solid ${bgBorder}`,
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  outcomeBadge: (outcome) => {
    const o = (outcome || "").toLowerCase();
    const isGood = o.includes("approv") || o.includes("pass") || o.includes("clear") || o === "true";
    const isBad = o.includes("den") || o.includes("flag") || o.includes("reject") || o.includes("block") || o === "false";
    const isPending = o.includes("pending") || o === "—";
    return {
      display: "inline-block",
      padding: "3px 10px",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      border: `1px solid ${isGood ? "rgba(16,185,129,0.35)" : isBad ? "rgba(239,68,68,0.35)" : "rgba(245,158,11,0.3)"}`,
      color: isGood ? green : isBad ? red : amber,
      background: isGood ? "rgba(16,185,129,0.08)" : isBad ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.07)",
      borderRadius: "2px",
      fontFamily: "'IBM Plex Mono', monospace",
    };
  },
  jurBadge: (jur) => {
    const c = jurColors[jur] || { bg: "rgba(240,244,248,0.05)", border: "rgba(240,244,248,0.12)", color: creamDim };
    return {
      display: "inline-block",
      padding: "2px 8px",
      fontSize: "10px",
      fontWeight: 500,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.color,
      borderRadius: 0,
      fontFamily: "'IBM Plex Mono', monospace",
    };
  },
  hashText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "11px",
    color: textMuted,
    letterSpacing: "0.04em",
  },
  modal: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.78)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "2rem",
  },
  modalBox: {
    background: navyDark,
    border: `1px solid ${bgBorder}`,
    maxWidth: 720,
    width: "100%",
    maxHeight: "85vh",
    overflowY: "auto",
    padding: "2rem",
    borderRadius: 0,
  },
  modalTitle: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "16px",
    fontWeight: 600,
    color: cream,
    marginBottom: "1.5rem",
    letterSpacing: "0",
  },
  modalRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
    borderBottom: `1px solid ${bgBorder}`,
    paddingBottom: "1rem",
  },
  modalKey: {
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: textMuted,
    minWidth: "140px",
    paddingTop: "2px",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  modalVal: {
    fontSize: "13px",
    color: cream,
    lineHeight: 1.6,
    flex: 1,
  },
  explanationBox: {
    background: "rgba(16,185,129,0.05)",
    border: `1px solid rgba(16,185,129,0.2)`,
    padding: "1rem 1.25rem",
    marginTop: "1rem",
    fontSize: "13px",
    color: cream,
    lineHeight: 1.8,
    borderRadius: 0,
  },
  empty: {
    textAlign: "center",
    padding: "4rem",
    color: creamDim,
    fontSize: "12px",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  loading: {
    textAlign: "center",
    padding: "4rem",
    color: creamDim,
    fontSize: "12px",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  pager: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.875rem 0",
    fontSize: "12px",
    color: textMuted,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  certBox: {
    background: "rgba(16,185,129,0.04)",
    border: `1px solid rgba(16,185,129,0.3)`,
    padding: "1.5rem",
    marginTop: "1rem",
    borderRadius: 0,
    marginBottom: "1.5rem",
    position: "relative",
  },
  certText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "18px",
    color: green,
    letterSpacing: "0.04em",
    fontWeight: 500,
    lineHeight: 1.4,
    display: "block",
    marginTop: "6px",
    marginBottom: "1rem",
  },
  sidebar: {
    width: "240px",
    flexShrink: 0,
    background: navyDark,
    borderRight: `1px solid ${bgBorder}`,
    paddingTop: "1.25rem",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100%",
    overflowY: "auto",
  },
  sidebarSection: {
    fontSize: "9px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: textMuted,
    padding: "12px 20px 4px",
    fontWeight: 600,
    display: "block",
    fontFamily: "'IBM Plex Mono', monospace",
    borderTop: `1px solid ${bgBorder}`,
    marginTop: "4px",
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 20px",
    fontSize: "12px",
    color: creamDim,
    textDecoration: "none",
    cursor: "pointer",
    borderLeft: "2px solid transparent",
    background: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left",
    fontFamily: "'IBM Plex Sans', sans-serif",
    lineHeight: 1,
  },
  sidebarDivider: {
    height: "1px",
    background: bgBorder,
    margin: "16px 16px 8px",
  },
  sidebarSubItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 20px 7px 36px",
    fontSize: "11px",
    color: creamDim,
    textDecoration: "none",
    cursor: "pointer",
    borderLeft: "2px solid transparent",
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: "0.02em",
  },
};

// Animates a number counting up from 0 to `target` (ease-out) once `active` is true.
// Used for stat-grid numbers so real figures feel alive instead of static.
function useCountUp(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || target == null || isNaN(target)) { setVal(target ?? 0); return; }
    let raf, start;
    const duration = 700;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => raf && cancelAnimationFrame(raf);
  }, [target, active]);
  return val;
}

// Small shimmer placeholder — width/height in px, used wherever real data hasn't loaded yet.
function Skel({ w, h }) {
  return <span className="skeleton" style={{ width: w || 60, height: h || 14 }} />;
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
    background: navyLight,
    border: `1px solid ${bgBorder}`,
    color: cream,
    padding: "10px 14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "13px",
    outline: "none",
    width: "100%",
    marginBottom: "10px",
    borderRadius: 0,
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };
  const labelStyle = { fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, display: "block", marginBottom: "6px", fontFamily: "'IBM Plex Mono', monospace" };

  const satisfied = reviews.length > 0 || submitResult;

  return (
    <div style={{ marginTop: "1.5rem", borderTop: `1px solid ${bgBorder}`, paddingTop: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: creamDim, marginBottom: "4px", fontFamily: "'IBM Plex Mono', monospace" }}>
            Human Oversight — EU AI Act Article 14
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "3px 10px", fontSize: "11px", letterSpacing: "0.08em",
            border: `1px solid ${satisfied ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
            color: satisfied ? green : amber,
            background: satisfied ? "rgba(16,185,129,0.07)" : "rgba(245,158,11,0.07)",
            fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase",
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
        <div style={{ background: "rgba(16,185,129,0.07)", border: `1px solid rgba(16,185,129,0.25)`, padding: "10px 14px", fontSize: "12px", color: green, marginBottom: "1rem", fontFamily: "'IBM Plex Mono', monospace" }}>
          ✓ Review logged — Article 14 satisfied. Hash: <span style={{ fontSize: "11px" }}>{submitResult.review_hash?.slice(0, 20)}...</span>
        </div>
      )}

      {showForm && (
        <div style={{ background: navyLight, border: `1px solid ${bgBorder}`, padding: "1.25rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "12px", color: creamDim, marginBottom: "1rem" }}>
            This review will be cryptographically tied to the original decision hash.
          </div>
          {submitError && (
            <div style={{ background: "rgba(239,68,68,0.07)", border: `1px solid rgba(239,68,68,0.3)`, color: red, padding: "8px 12px", fontSize: "12px", marginBottom: "10px" }}>
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
            <div key={i} style={{ background: navyLight, border: `1px solid ${bgBorder}`, padding: "12px 14px" }}>
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
              <div style={{ fontSize: "11px", color: textMuted, marginTop: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>
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
    <div style={{ marginTop: "2rem", border: `1px solid ${bgBorder}`, background: navyDark }}>
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
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "14px", color: cream, fontWeight: 600, letterSpacing: "0" }}>
            Fairness Detection
          </div>
          <div style={{ fontSize: "13px", color: creamDim, marginTop: "2px" }}>
            EU AI Act Article 10 + MAS FEAT — bias monitoring across credit score bands
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {report && (
            <span style={{
              fontSize: "11px",
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.06em",
              border: `1px solid ${statusOk ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
              color: statusOk ? green : amber,
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
            <div style={{ background: "rgba(239,68,68,0.07)", border: `1px solid rgba(239,68,68,0.3)`, color: red, padding: "10px 14px", fontSize: "12px", marginBottom: "1rem" }}>
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
                background: statusOk ? "rgba(16,185,129,0.07)" : "rgba(245,158,11,0.07)",
                border: `1px solid ${statusOk ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)"}`,
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
                  <div style={{ fontSize: "14px", fontFamily: "'IBM Plex Mono', sans-serif", color: statusOk ? green : amber, fontWeight: 500, letterSpacing: "0.04em" }}>
                    {statusOk ? "✓ PASS — No significant bias detected" : `⚠ REVIEW REQUIRED — ${flags.length} potential bias flag${flags.length !== 1 ? "s" : ""} detected`}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: creamDim, marginBottom: "4px" }}>Overall approval rate</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "28px", color: cream }}>
                    {report.overall?.approval_rate_pct ?? "—"}%
                  </div>
                  <div style={{ fontSize: "12px", color: creamDim }}>
                    {report.overall?.approved ?? 0} approved / {report.overall?.denied ?? 0} denied
                  </div>
                </div>
              </div>

              {/* Fairness disclaimer */}
              <div style={{ fontSize: "11px", color: textMuted, background: navyDark, border: `1px solid ${bgBorder}`, padding: "10px 14px", marginBottom: "1rem", lineHeight: 1.6, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.02em" }}>
                ⓘ Statistical flags for internal review only. These do not constitute a legal determination of discrimination or compliance. Consult a licensed compliance lawyer before regulatory submission.
              </div>

              {/* Regulation references */}
              {report.regulation && (
                <div style={{ marginBottom: "1.5rem", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {Object.entries(report.regulation).map(([key, val]) => (
                    <span key={key} style={{ fontSize: "11px", color: creamDim, border: `1px solid ${bgBorder}`, padding: "3px 10px", fontFamily: "'IBM Plex Mono', monospace" }}>
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
                          background: navyDark,
                          border: `1px solid ${isFlagged ? amber : bgBorder}`,
                          borderTop: `2px solid ${isFlagged ? amber : bgBorder}`,
                          padding: "1rem",
                          borderRadius: 0,
                        }}>
                          <div style={{ fontSize: "11px", color: isFlagged ? amber : creamDim, marginBottom: "6px", display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono', monospace" }}>
                            <span>{band}</span>
                            {isFlagged && <span style={{ fontSize: "11px" }}>⚠ FLAG</span>}
                          </div>
                          {/* Bar */}
                          <div style={{ background: bgBorder, height: "4px", marginBottom: "6px", position: "relative" }}>
                            <div style={{
                              background: isFlagged ? amber : green,
                              height: "100%",
                              width: `${Math.min(rate, 100)}%`,
                              transition: "width 0.5s",
                            }} />
                          </div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "24px", color: isFlagged ? amber : cream }}>
                            {rate}%
                          </div>
                          <div style={{ fontSize: "11px", color: creamDim, marginTop: "2px" }}>
                            {stats.approved ?? 0} approved · {stats.denied ?? 0} denied
                          </div>
                          <div style={{ fontSize: "11px", color: deviation > 0 ? green : red, marginTop: "2px", fontFamily: "'IBM Plex Mono', monospace" }}>
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
                        background: "rgba(245,158,11,0.06)",
                        border: `1px solid rgba(245,158,11,0.25)`,
                        borderLeft: `3px solid ${amber}`,
                        padding: "1rem 1.25rem",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                          <div style={{ fontSize: "13px", color: amber, fontWeight: 500, fontFamily: "'IBM Plex Mono', monospace" }}>
                            {f.group} — {f.approval_rate_pct}% approval rate
                          </div>
                          <span className={f.flag === "SIGNIFICANT_DISPARITY" ? "bias-flag-badge" : ""} style={{ fontSize: "10px", color: amber, border: "1px solid rgba(245,158,11,0.35)", padding: "2px 10px", borderRadius: 0, fontWeight: 600, letterSpacing: "0.08em", fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>
                            {f.flag}
                          </span>
                        </div>
                        <div style={{ fontSize: "13px", color: creamDim, lineHeight: 1.6 }}>
                          {f.message}
                        </div>
                        <div style={{ fontSize: "11px", color: textMuted, marginTop: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>
                          Deviation: {f.deviation_pct > 0 ? "+" : ""}{f.deviation_pct}% vs overall {f.overall_rate_pct}%
                          · Threshold: ±{report.bias_threshold_used_pct}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {statusOk && flags.length === 0 && (
                <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", padding: "1rem 1.25rem", fontSize: "13px", color: green }}>
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
      if (r.ok) { fetchIncidents(); } else { showToast("Couldn't update the incident. Try again.", "error"); }
    } catch (e) { showToast("Couldn't update the incident. Check your connection.", "error"); }
    setPatchingId(null);
  };

  const severityColor = (s) => {
    if (s === "critical") return { color: red, border: `1px solid rgba(239,68,68,0.35)`, background: "rgba(239,68,68,0.08)", fontFamily: "'IBM Plex Mono', monospace" };
    if (s === "high") return { color: amber, border: "1px solid rgba(245,158,11,0.35)", background: "rgba(245,158,11,0.08)", fontFamily: "'IBM Plex Mono', monospace" };
    if (s === "medium") return { color: amber, border: "1px solid rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.05)", fontFamily: "'IBM Plex Mono', monospace" };
    return { color: creamDim, border: `1px solid ${bgBorder}`, background: "transparent", fontFamily: "'IBM Plex Mono', monospace" };
  };

  const statusColor = (s) => {
    if (s === "resolved") return { color: green, border: `1px solid rgba(16,185,129,0.3)`, fontFamily: "'IBM Plex Mono', monospace" };
    if (s === "investigating") return { color: amber, border: "1px solid rgba(245,158,11,0.3)", fontFamily: "'IBM Plex Mono', monospace" };
    return { color: creamDim, border: `1px solid ${bgBorder}`, fontFamily: "'IBM Plex Mono', monospace" };
  };

  const inputStyle = {
    background: navyLight, border: `1px solid ${bgBorder}`,
    color: cream, padding: "10px 14px", fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "13px", outline: "none", width: "100%", borderRadius: 0,
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };
  const labelStyle = { fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, display: "block", marginBottom: "6px", fontFamily: "'IBM Plex Mono', monospace" };
  const fieldStyle = { marginBottom: "1rem" };

  return (
    <div style={{
      marginTop: "2rem",
      border: openIncidents.length > 0 ? `1px solid rgba(245,158,11,0.35)` : `1px solid ${bgBorder}`,
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
          background: openIncidents.length > 0 ? "rgba(245,158,11,0.04)" : "transparent",
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "14px", color: cream, fontWeight: 600, letterSpacing: "0" }}>
            Incident Reporting
            {openIncidents.length > 0 && (
              <span style={{ marginLeft: "12px", fontSize: "10px", color: amber, border: "1px solid rgba(245,158,11,0.35)", padding: "2px 10px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {openIncidents.length} open
              </span>
            )}
          </div>
          <div style={{ fontSize: "13px", color: creamDim, marginTop: "2px" }}>
            EU AI Act Article 72 — report AI incidents to regulators within 15 days
          </div>
        </div>
        <div style={{ fontSize: "20px", color: openIncidents.length > 0 ? amber : creamDim, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</div>
      </div>

      {open && (
        <div style={{ padding: "1.5rem" }}>
          {/* Success */}
          {result && (
            <div style={{ background: "rgba(16,185,129,0.06)", border: `1px solid rgba(16,185,129,0.2)`, padding: "1rem 1.25rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: green, marginBottom: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>✓ Incident logged</div>
              <div style={{ fontSize: "13px", color: creamDim }}>
                Incident ID: <span style={{ fontFamily: "monospace", color: cream }}>{result.incident_id}</span>
              </div>
              {result.regulator_deadline && (
                <div style={{ fontSize: "12px", color: amber, marginTop: "4px", fontFamily: "'IBM Plex Mono', monospace" }}>
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
            <div style={{ background: "rgba(245,158,11,0.05)", border: `1px solid rgba(245,158,11,0.2)`, borderLeft: `3px solid ${amber}`, padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "15px", color: cream, marginBottom: "4px", fontWeight: 600 }}>Report AI incident</div>
              <div style={{ fontSize: "12px", color: amber, marginBottom: "1rem", fontFamily: "'IBM Plex Mono', monospace" }}>
                High/critical severity incidents must be reported to the regulator within 15 days (EU AI Act Article 72).
              </div>
              {error && (
                <div style={{ background: "rgba(239,68,68,0.07)", border: `1px solid rgba(239,68,68,0.3)`, color: red, padding: "8px 12px", fontSize: "12px", marginBottom: "1rem" }}>
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
                    <option value="UK">🇬🇧 UK (FCA)</option>
                    <option value="US">🇺🇸 US (CFPB)</option>
                    <option value="AU">🇦🇺 Australia (APRA)</option>
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
                    background: navyDark,
                    border: inc.status !== "resolved" ? `1px solid rgba(245,158,11,0.2)` : `1px solid ${bgBorder}`,
                    borderLeft: inc.status !== "resolved" ? `3px solid ${amber}` : `3px solid ${bgBorder}`,
                    padding: "1rem 1.25rem",
                  }}>
                    {/* Top row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", color: cream, fontFamily: "'IBM Plex Sans', sans-serif", marginBottom: "4px" }}>
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
                            <span style={{ fontSize: "10px", color: creamDim, border: `1px solid ${bgBorder}`, padding: "2px 8px", fontFamily: "'IBM Plex Mono', monospace" }}>
                              {inc.jurisdiction}
                            </span>
                          )}
                          {inc.reported_to_regulator && (
                            <span style={{ fontSize: "10px", color: green, border: `1px solid rgba(16,185,129,0.25)`, padding: "2px 8px", fontFamily: "'IBM Plex Mono', monospace" }}>
                              ✓ Reported to regulator
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ fontSize: "12px", color: creamDim, textAlign: "right", minWidth: "140px" }}>
                        <div>{formatDate(inc.occurred_at || inc.reported_at)}</div>
                        {inc.regulator_deadline && inc.status !== "resolved" && (
                          <div style={{ color: amber, marginTop: "4px", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace" }}>
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
                            style={{ ...styles.btn, fontSize: "11px", padding: "4px 12px", color: green, borderColor: "rgba(16,185,129,0.3)", opacity: isPatching ? 0.6 : 1 }}
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

                    <div style={{ fontSize: "10px", color: textMuted, marginTop: "8px", fontFamily: "'IBM Plex Mono', monospace" }}>
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

  // Key recovery flow
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState(null);
  const [recoveryError, setRecoveryError] = useState("");

  const handleRecovery = async () => {
    if (!recoveryEmail.trim() || !recoveryEmail.includes("@")) {
      setRecoveryError("Please enter a valid email address.");
      return;
    }
    setRecoveryLoading(true);
    setRecoveryError("");
    setRecoveryResult(null);
    try {
      const r = await fetch(`${API}/recover-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail.trim().toLowerCase() }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.detail || "Recovery failed.");
      setRecoveryResult(data);
    } catch (e) {
      setRecoveryError(e.message || "Recovery failed. Email anthony@tryaidal.com.");
    }
    setRecoveryLoading(false);
  };

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
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div style={styles.loginBox}>
        <div style={{ marginBottom: "0.25rem" }}>
          <div style={{ overflow:"hidden", width:"300px", height:"112px", position:"relative", margin:"0 auto" }}>
            <img src="https://tryaidal.com/Copy_of_AIDAL.png" alt="AIDAL." style={{ position:"absolute", width:"330px", height:"330px", mixBlendMode:"multiply", filter:"invert(1)", top:"-110px", left:"-10px" }} onError={e => { e.target.parentNode.innerHTML = '<span style="font-family:IBM Plex Sans,sans-serif;font-size:32px;font-weight:600;color:#0A0A0A;letter-spacing:2px">AIDAL.</span>'; }} />
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
          Don't have an API key? Sign up at{" "}
          <a href="https://tryaidal.com" target="_blank" rel="noreferrer" style={{ color: "#C8A96E", textDecoration: "none" }}>tryaidal.com</a>
          {" "}— takes 30 seconds.
          <div style={{ marginTop: "0.75rem", fontSize: "11px", color: "#6B6560", background: "#FFFFFF", border: "1px solid #D8CFC4", padding: "8px 12px", fontFamily: "'IBM Plex Mono', monospace" }}>
            Your key is never stored server-side. Session only.
          </div>

          {/* ── KEY RECOVERY ── */}
          <button
            onClick={() => { setShowRecovery(!showRecovery); setRecoveryResult(null); setRecoveryError(""); }}
            style={{ marginTop: "1rem", background: "none", border: "none", color: "#2d3a5c", fontSize: "12px", cursor: "pointer", padding: 0, textDecoration: "underline", fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            {showRecovery ? "← Back to login" : "Lost your API key? Recover it →"}
          </button>

          {showRecovery && !recoveryResult && (
            <div style={{ marginTop: "0.875rem" }}>
              <div style={{ fontSize: "11px", color: "#6B6560", marginBottom: "0.5rem" }}>
                Enter your registered email. A new key will be issued and your old one invalidated.
              </div>
              {recoveryError && (
                <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", color: "#b91c1c", padding: "8px 12px", fontSize: "12px", marginBottom: "0.5rem", borderRadius: 0 }}>
                  {recoveryError}
                </div>
              )}
              <input
                style={{ ...styles.loginInput, marginBottom: "0.5rem" }}
                type="email"
                placeholder="your@company.com"
                value={recoveryEmail}
                onChange={e => setRecoveryEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleRecovery()}
              />
              <button
                style={{ ...styles.loginBtn, opacity: recoveryLoading ? 0.6 : 1 }}
                onClick={handleRecovery}
                disabled={recoveryLoading}
              >
                {recoveryLoading ? "Issuing new key..." : "Issue New API Key"}
              </button>
            </div>
          )}

          {recoveryResult && recoveryResult.new_api_key && (
            <div style={{ marginTop: "0.875rem", background: "#F0F8F4", border: "1px solid rgba(16,185,129,0.3)", padding: "1rem", borderRadius: 0 }}>
              <div style={{ fontSize: "11px", color: "#0A6E4F", fontWeight: 600, marginBottom: "0.5rem" }}>
                ✓ New key issued for {recoveryResult.company_name}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#0A0A0A", wordBreak: "break-all", background: "#FFFFFF", border: "1px solid #D8CFC4", padding: "8px 12px", marginBottom: "0.5rem" }}>
                {recoveryResult.new_api_key}
              </div>
              <div style={{ fontSize: "11px", color: "#b91c1c", marginBottom: "0.75rem" }}>
                ⚠ Save this now — it will not be shown again. Your old key is invalid.
              </div>
              <button
                style={{ ...styles.loginBtn }}
                onClick={() => { setKey(recoveryResult.new_api_key); setShowRecovery(false); setRecoveryResult(null); }}
              >
                Log in with new key →
              </button>
            </div>
          )}

          {recoveryResult && !recoveryResult.new_api_key && (
            <div style={{ marginTop: "0.875rem", fontSize: "12px", color: "#6B6560", background: "#FFFFFF", border: "1px solid #D8CFC4", padding: "10px 12px" }}>
              {recoveryResult.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DECISION MODAL
// ══════════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════════
// VERIFY EVIDENCE — live, public, independent proof check (used inside the case modal)
// ══════════════════════════════════════════════════════════════════════════════
function VerifyEvidenceInline({ auditId }) {
  const [state, setState] = useState("idle"); // idle | checking | verified | tampered | error

  const run = async () => {
    setState("checking");
    try {
      const r = await fetch(`${API}/verify/public/${auditId}`);
      if (!r.ok) { setState("error"); return; }
      const json = await r.json();
      setState(json.verified ? "verified" : "tampered");
    } catch (e) {
      setState("error");
    }
  };

  if (state === "idle") {
    return (
      <button
        style={{
          background: "rgba(200,169,110,0.10)", border: "1px solid rgba(200,169,110,0.4)",
          color: accentColor, padding: "7px 16px", fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          cursor: "pointer", borderRadius: 0,
        }}
        onClick={run}
      >
        Verify Evidence
      </button>
    );
  }
  if (state === "checking") {
    return (
      <div style={{ fontSize: "12px", color: textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
        Recomputing SHA-256 hash and comparing against the ledger...
      </div>
    );
  }
  if (state === "verified") {
    return (
      <span
        title="SHA-256 hash matches. No tampering detected. Verified independently of AIDAL's servers."
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px", cursor: "help",
          background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.35)",
          color: green, padding: "7px 14px", fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
        }}
      >
        ✓ Cryptographically Verified
      </span>
    );
  }
  if (state === "tampered") {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.35)",
        color: red, padding: "7px 14px", fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        ⚠ Hash mismatch — record may have been altered
      </span>
    );
  }
  return (
    <div style={{ fontSize: "12px", color: red }}>
      Couldn't reach the verification service.{" "}
      <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={run}>Try again</span>
    </div>
  );
}

// Section header used to break the case modal into a progressive-disclosure narrative
function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
      color: accentColor, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600,
      marginTop: "1.75rem", paddingTop: "1.75rem", marginBottom: "0.75rem",
      borderTop: `1px solid ${bgBorder}`,
    }}>
      {children}
    </div>
  );
}

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
  const jur = d.jurisdiction || record.jurisdiction;

  const formatCurrency = (val, currency) => {
    if (!val) return null;
    const symbols = { USD: "$", IDR: "Rp", SGD: "S$", EUR: "€", AED: "AED " };
    return (symbols[currency] || "") + Number(val).toLocaleString();
  };

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0" }}>
          <div>
            <div style={{ ...styles.modalTitle, marginBottom: "4px" }}>
              Case · {record.audit_id ? record.audit_id.slice(0, 18) + "..." : "—"}
            </div>
            <div style={{ fontSize: "12px", color: textMuted, marginBottom: "1.5rem" }}>
              Filed {formatDate(record.logged_at)}
            </div>
          </div>
          <button onClick={onClose} style={{ ...styles.btn, padding: "4px 12px", fontSize: "12px" }}>✕ Close</button>
        </div>

        {loadingDetail ? (
          <div style={{ color: creamDim, fontStyle: "italic", padding: "2rem 0" }}>Loading full record...</div>
        ) : (
          <>
            {/* ── SUMMARY ── */}
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Decision type</span>
              <span style={styles.modalVal}>{d.decision_type || record.decision_type || "—"}</span>
            </div>
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Outcome</span>
              <span style={styles.modalVal}><span style={styles.outcomeBadge(outcome)}>{outcome}</span></span>
            </div>
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Jurisdiction</span>
              <span style={styles.modalVal}>{jur || "—"}</span>
            </div>

            {/* ── EXPLANATION ── */}
            {(d.explanation || record.explanation) && (
              <>
                <SectionLabel>AI Explanation — Article 13 compliant</SectionLabel>
                <div style={styles.explanationBox}>{d.explanation || record.explanation}</div>
                <div style={{ fontSize: "11px", color: textMuted, marginTop: "6px", lineHeight: 1.6, fontFamily: "'IBM Plex Mono', monospace" }}>
                  ⓘ AI-generated explanation. Verify against source decision data before regulatory submission.
                </div>
              </>
            )}

            {/* ── EVIDENCE ── */}
            <SectionLabel>Cryptographic Evidence</SectionLabel>
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Audit ID</span>
              <span style={{ ...styles.modalVal, ...styles.hashText }}>{record.audit_id}</span>
            </div>
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Previous hash</span>
              <span style={{ ...styles.modalVal, ...styles.hashText }}>{detail?.prev_hash || "GENESIS"}</span>
            </div>
            <div style={{ fontSize: "12px", color: creamDim, marginBottom: "0.75rem", lineHeight: 1.6 }}>
              This decision is chained to the one before it. Changing a single character anywhere in the chain breaks every hash after it — detectable by anyone, without trusting AIDAL.
            </div>
            {record.audit_id && <VerifyEvidenceInline auditId={record.audit_id} />}

            {/* ── MODEL & CONFIDENCE ── */}
            <SectionLabel>Model &amp; Confidence</SectionLabel>
            <div style={styles.modalRow}>
              <span style={styles.modalKey}>Model used</span>
              <span style={styles.modalVal}>{d.model_used || "—"}</span>
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

            {/* ── COMPLIANCE MAPPING ── */}
            {compliance.checked && (
              <>
                <SectionLabel>Compliance Mapping</SectionLabel>
                <div style={styles.modalRow}>
                  <span style={styles.modalKey}>Status</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ ...styles.outcomeBadge(compliance.compliant ? "approved" : "denied"), marginBottom: "6px", display: "inline-block" }}>
                      {compliance.status}
                    </span>
                    <div style={{ fontSize: "13px", color: creamDim, marginTop: "6px" }}>{compliance.regulator}</div>
                    <div style={{ fontSize: "12px", color: creamDim }}>Retention required: {compliance.retention_required_years} years</div>
                    {compliance.missing_required?.length > 0 && (
                      <div style={{ fontSize: "11px", color: red, marginTop: "4px", fontFamily: "'IBM Plex Mono', monospace" }}>
                        Missing required: {compliance.missing_required.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── HUMAN OVERSIGHT ── */}
            {record.audit_id && (
              <>
                <SectionLabel>Human Oversight — Article 14</SectionLabel>
                <HumanReviewPanel auditId={record.audit_id} apiKey={apiKey} />
              </>
            )}

            {/* ── DOWNLOAD REPORT ── */}
            <SectionLabel>Regulator-Ready Report</SectionLabel>
            <button
              style={{
                background: "rgba(200,169,110,0.10)", border: "1px solid rgba(200,169,110,0.35)",
                color: accentColor, padding: "7px 16px", fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: "12px", fontWeight: 500, cursor: "pointer", borderRadius: 0,
                display: "inline-flex", alignItems: "center", gap: "6px",
              }}
              onClick={() => {
                const url = jur ? `${API}/compliance/report/pdf?jurisdiction=${jur}` : `${API}/compliance/report/pdf`;
                fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } })
                  .then(r => { if (!r.ok) throw new Error("Failed"); return r.blob(); })
                  .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = blobUrl;
                    a.download = `AIDAL_${jur || "ALL"}_${new Date().toISOString().slice(0,10)}.pdf`;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a);
                    showToast("Report downloaded.", "success");
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                  })
                  .catch(() => showToast("Download failed. Check your connection and try again.", "error"));
              }}
            >
              ↓ Download PDF
            </button>
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
    background: navyLight, border: `1px solid ${bgBorder}`,
    color: cream, padding: "10px 14px", fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "13px", outline: "none", width: "100%", borderRadius: 0,
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };
  const labelStyle = { fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, display: "block", marginBottom: "6px", fontFamily: "'IBM Plex Mono', monospace" };
  const fieldStyle = { marginBottom: "1rem" };

  return (
    <div style={{ marginTop: "2rem", border: `1px solid ${bgBorder}`, background: navyDark }}>
      <div
        style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: open ? `1px solid ${bgBorder}` : "none" }}
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "14px", color: cream, fontWeight: 600, letterSpacing: "0" }}>
            Model Registry
          </div>
          <div style={{ fontSize: "12px", color: creamDim, marginTop: "2px" }}>
            EU AI Act Article 9 — register AI models before deployment
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {models.length > 0 && (
            <span style={{ fontSize: "10px", color: green, border: "1px solid rgba(16,185,129,0.25)", padding: "2px 10px", fontFamily: "'IBM Plex Mono', monospace" }}>
              {models.length} model{models.length !== 1 ? "s" : ""} registered
            </span>
          )}
          <div style={{ fontSize: "20px", color: creamDim, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</div>
        </div>
      </div>

      {open && (
        <div style={{ padding: "1.5rem" }}>
          {result && (
            <div style={{ background: "rgba(16,185,129,0.07)", border: `1px solid rgba(16,185,129,0.2)`, padding: "1rem 1.25rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: green, marginBottom: "8px", fontFamily: "'IBM Plex Mono', monospace" }}>
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
            <div style={{ background: navyDark, border: `1px solid ${bgBorder}`, padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "15px", color: cream, marginBottom: "1rem", fontWeight: 600 }}>
                Register AI model
              </div>
              {error && (
                <div style={{ background: "rgba(239,68,68,0.07)", border: `1px solid rgba(239,68,68,0.3)`, color: red, padding: "8px 12px", fontSize: "12px", marginBottom: "1rem" }}>
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
                    <option value="UK">🇬🇧 UK (FCA)</option>
                    <option value="US">🇺🇸 US (CFPB)</option>
                    <option value="AU">🇦🇺 Australia (APRA)</option>
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
                  <div key={i} style={{ background: navyLight, border: `1px solid ${bgBorder}`, padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "15px", color: cream, fontWeight: 600 }}>
                          {m.model_name}
                        </span>
                        <span style={{ fontSize: "11px", color: creamDim, border: `1px solid ${bgBorder}`, padding: "2px 8px", fontFamily: "'IBM Plex Mono', monospace" }}>
                          {m.model_version}
                        </span>
                        <span style={{ fontSize: "11px", color: creamDim, border: `1px solid ${bgBorder}`, padding: "2px 8px", fontFamily: "'IBM Plex Mono', monospace" }}>
                          {m.model_type}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {m.jurisdiction && (
                          <span style={{ fontSize: "11px", color: creamDim, border: `1px solid ${bgBorder}`, padding: "2px 8px" }}>
                            {m.jurisdiction}
                          </span>
                        )}
                        <span style={{
                          fontSize: "10px", letterSpacing: "0.08em", padding: "2px 10px",
                          border: `1px solid ${article9Ok ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
                          color: article9Ok ? green : amber,
                          background: article9Ok ? "rgba(16,185,129,0.07)" : "rgba(245,158,11,0.07)",
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}>
                          {article9Ok ? "✓ Art. 9 SATISFIED" : "⚠ Art. 9 INCOMPLETE"}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", fontSize: "12px", color: creamDim }}>
                      {m.accuracy_metric && <div>Accuracy: <span style={{ color: cream }}>{(m.accuracy_metric * 100).toFixed(1)}%</span></div>}
                      {m.bias_test_result && <div>Bias test: <span style={{ color: m.bias_test_result === "passed" ? green : red }}>{m.bias_test_result}</span></div>}
                      {m.validation_date && <div>Validated: <span style={{ color: cream }}>{m.validation_date}</span></div>}
                      {m.training_data_source && <div>Data: <span style={{ color: cream }}>{m.training_data_source}</span></div>}
                    </div>
                    {m.notes && <div style={{ fontSize: "12px", color: creamDim, fontStyle: "italic", marginTop: "6px" }}>{m.notes}</div>}
                    <div style={{ fontSize: "11px", color: textMuted, marginTop: "6px", fontFamily: "monospace" }}>
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
// Bug 5 fix: jurisdiction and currency were two independent fields with no
// sync between them, which is exactly how a "25,000 IDR loan for a US
// applicant" got into the demo data. Picking a jurisdiction now defaults the
// currency to match, and amount placeholders scale to something plausible
// for that currency instead of a flat "e.g. 25000" regardless of scale.
const JUR_CURRENCY = { ID: "IDR", SG: "SGD", EU: "EUR", UAE: "AED", UK: "GBP", US: "USD", AU: "AUD" };
const CURRENCY_PLACEHOLDERS = {
  IDR: { income: "80000000", loan_amount: "350000000" },
  SGD: { income: "80000",    loan_amount: "45000" },
  EUR: { income: "65000",    loan_amount: "32000" },
  AED: { income: "220000",   loan_amount: "90000" },
  GBP: { income: "55000",    loan_amount: "28000" },
  USD: { income: "80000",    loan_amount: "25000" },
  AUD: { income: "95000",    loan_amount: "40000" },
};

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
    background: navyLight,
    border: `1px solid ${bgBorder}`,
    color: cream,
    padding: "10px 14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "13px",
    outline: "none",
    width: "100%",
    borderRadius: 0,
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };
  const labelStyle = { fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, display: "block", marginBottom: "6px", fontFamily: "'IBM Plex Mono', monospace" };
  const fieldStyle = { marginBottom: "1rem" };

  return (
    <div style={{ marginTop: "2.5rem", border: `1px solid ${bgBorder}`, background: navyDark }}>
      <div
        style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: open ? `1px solid ${bgBorder}` : "none" }}
        onClick={() => { setOpen(o => !o); setResult(null); setError(""); }}
      >
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "14px", color: cream, fontWeight: 600, letterSpacing: "0" }}>
            + Log a test decision
          </div>
          <div style={{ fontSize: "12px", color: creamDim, marginTop: "2px" }}>
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
              <select style={selectStyle} value={form.jurisdiction} onChange={e => {
                const j = e.target.value;
                setForm(f => ({ ...f, jurisdiction: j, currency: JUR_CURRENCY[j] || f.currency }));
              }}>
                <option value="ID">🇮🇩 Indonesia (OJK)</option>
                <option value="SG">🇸🇬 Singapore (MAS FEAT)</option>
                <option value="EU">🇪🇺 European Union (EU AI Act)</option>
                <option value="UAE">🇦🇪 UAE (VARA)</option>
                <option value="UK">🇬🇧 United Kingdom (FCA)</option>
                <option value="US">🇺🇸 United States (CFPB)</option>
                <option value="AU">🇦🇺 Australia (APRA)</option>
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
              <input style={inputStyle} type="number" placeholder={`e.g. ${CURRENCY_PLACEHOLDERS[form.currency]?.income || "80000"}`} value={form.income} onChange={e => set("income", e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Loan amount (optional)</label>
              <input style={inputStyle} type="number" placeholder={`e.g. ${CURRENCY_PLACEHOLDERS[form.currency]?.loan_amount || "25000"}`} value={form.loan_amount} onChange={e => set("loan_amount", e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Currency</label>
              <select style={selectStyle} value={form.currency} onChange={e => set("currency", e.target.value)}>
                <option value="IDR">IDR — Indonesian Rupiah</option>
                <option value="SGD">SGD — Singapore Dollar</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="AED">AED — UAE Dirham</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="AUD">AUD — Australian Dollar</option>
              </select>
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.07)", border: `1px solid rgba(239,68,68,0.3)`, color: red, padding: "10px 14px", fontSize: "12px", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          {result && (
            <div style={{ background: "rgba(76,175,130,0.1)", border: `0.5px solid rgba(76,175,130,0.35)`, padding: "1.25rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: green, marginBottom: "10px" }}>✓ Decision logged successfully</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px", color: creamDim }}>
                <div><span style={{ color: cream }}>Audit ID:</span> <span style={{ fontFamily: "monospace" }}>{result.audit_id}</span></div>
                <div><span style={{ color: cream }}>Compliance:</span> <span style={{ color: result.compliance?.compliant ? green : red }}>{result.compliance?.status || "—"}</span></div>
              </div>
              {result.explanation && (
                <div style={{ marginTop: "10px", borderTop: "1px solid rgba(16,185,129,0.15)", paddingTop: "10px" }}>
                  <div style={{ fontSize: "14px", color: cream, lineHeight: 1.7 }}>
                    {result.explanation}
                  </div>
                  <div style={{ fontSize: "12px", color: textMuted, marginTop: "6px" }}>
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
            style={{ background: "#F59E0B", border: "none", color: "#0F1117", padding: "10px 24px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "12px", fontWeight: 600, cursor: "pointer", opacity: sending ? 0.6 : 1, borderRadius: 0, transition: "all 0.15s ease", letterSpacing: "2px", textTransform: "uppercase" }}
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? "Sending..." : "Log this decision →"}
          </button>

          {result && (
            <button
              style={{ marginLeft: "10px", background: "transparent", border: `1px solid ${bgBorder}`, color: creamDim, padding: "10px 20px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "13px", cursor: "pointer", borderRadius: 0, transition: "all 0.15s ease" }}
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
  const [section, setSection] = useState("dashboard");
  const limit = 10;

  const [hasLegacyDecisions, setHasLegacyDecisions] = useState(false);

  // A2 — specific decisions still needing human review, and the inline
  // control for a company's own oversight target (null until they opt in).
  const [needingReview, setNeedingReview] = useState({ total_needing_review: 0, decisions: [] });
  const [targetInput, setTargetInput] = useState("");
  const [savingTarget, setSavingTarget] = useState(false);

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
      const target = s?.human_oversight?.oversight_target_pct;
      const belowTarget = s?.human_oversight?.below_target;
      if (target != null) setTargetInput(String(target));
      if (belowTarget) {
        try {
          const nr = await fetch(`${API}/decisions/needing-review?limit=25`, { headers: { Authorization: `Bearer ${apiKey}` } }).then(r => r.json());
          setNeedingReview(nr);
        } catch (e) { /* non-critical — banner still works without the specific list */ }
      } else {
        setNeedingReview({ total_needing_review: 0, decisions: [] });
      }
    } catch (e) {
      setHealth({ status: "error" });
    }
    setLoading(false);
  }, [apiKey]);

  const saveOversightTarget = useCallback(async () => {
    const parsed = targetInput.trim() === "" ? null : Number(targetInput);
    if (parsed !== null && (Number.isNaN(parsed) || parsed < 0 || parsed > 100)) return;
    setSavingTarget(true);
    try {
      await fetch(`${API}/company/settings`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ oversight_target_pct: parsed }),
      });
      await fetchAll();
    } catch (e) { /* keep whatever was showing before the failed save */ }
    setSavingTarget(false);
  }, [apiKey, targetInput, fetchAll]);

  // Checks specifically the OLDEST decision (via the export endpoint's
  // oldest-first ordering, limit=1) rather than the paginated table view
  // (newest-first, limit 10) — the table view would silently miss legacy
  // pre-fix decisions on any account with more than 10 total decisions,
  // which would defeat the entire point of this disclosure banner.
  const checkLegacyDecisions = useCallback(async () => {
    try {
      const r = await fetch(`${API}/decisions/export?limit=1&offset=0`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      }).then(r => r.json());
      const oldest = r.decisions?.[0];
      if (oldest?.logged_at) {
        setHasLegacyDecisions(new Date(oldest.logged_at) < EXPLANATION_FIX_CUTOFF);
      }
    } catch (e) {
      // fails closed (no banner) rather than blocking the dashboard — this
      // is a disclosure nicety, not a correctness-critical path
    }
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
  useEffect(() => { checkLegacyDecisions(); }, [checkLegacyDecisions]);
  useEffect(() => { fetchDecisions(); }, [fetchDecisions]);

  const openDecisionById = async (auditId) => {
    try {
      const r = await fetch(`${API}/decision/${auditId}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      if (r.ok) {
        setSelected(await r.json());
      } else {
        showToast("No decision found for that audit ID.", "error");
      }
    } catch (e) {
      showToast("Search failed. Check your connection and try again.", "error");
    }
  };

  const handleSearch = () => searchId.trim() && openDecisionById(searchId.trim());

  const verifySteps = [
    "Walking the hash chain...",
    "Recomputing SHA-256 for each record...",
    "Cross-checking against the GitHub anchor...",
  ];
  const [verifying, setVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);

  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);

  const handleExport = async () => {
    setExporting(true);
    setExportProgress({ fetched: 0, total: null });
    try {
      let allDecisions = [];
      let offset = 0;
      const limit = 500;
      let total = null;
      // Loop until every page is retrieved — do NOT fetch once and silently
      // truncate. The endpoint caps at 500/page regardless of what's requested.
      while (true) {
        const r = await fetch(`${API}/decisions/export?limit=${limit}&offset=${offset}`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        if (!r.ok) throw new Error("export request failed");
        const data = await r.json();
        allDecisions = allDecisions.concat(data.decisions);
        total = data.total;
        setExportProgress({ fetched: allDecisions.length, total });
        if (offset + limit >= total) break;
        offset += limit;
      }
      const payload = {
        company: companyName,
        exported_at: new Date().toISOString(),
        total: allDecisions.length,
        decisions: allDecisions,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeCompany = (companyName || "company").replace(/[^a-z0-9]+/gi, "_");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.download = `aidal_export_${safeCompany}_${dateStr}.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(`Exported ${allDecisions.length} decisions.`, "success");
    } catch (e) {
      showToast("Export failed. Check your connection and try again.", "error");
    }
    setExporting(false);
    setExportProgress(null);
  };

  const runVerify = async () => {
    setVerifying(true);
    setVerifyStep(0);
    const resultPromise = fetch(`${API}/verify`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    }).then(r => r.json());
    for (let i = 0; i < verifySteps.length; i++) {
      setVerifyStep(i);
      await new Promise(res => setTimeout(res, i === 0 ? 350 : 480));
    }
    const v = await resultPromise;
    setVerify(v);
    setVerifying(false);
  };

  const apiOk = health?.status === "ok";
  const types = summary?.by_type?.map(b => b.type).filter(Boolean) || [];
  const jurisdictions = summary?.by_jurisdiction?.map(b => b.jurisdiction).filter(Boolean) || [];
  const chainOk = verify?.verified === true;
  const oversight = summary?.human_oversight;
  const oversightPct = oversight?.oversight_rate_pct ?? 0;
  const totalDecisionsAnimated = useCountUp(summary?.total_decisions ?? 0, !loading);

  // Section visibility: display:none + fade-in animation on the active section
  const secStyle = (name) => ({
    display: section === name ? "block" : "none",
    animation: section === name ? "sectionIn 0.28s ease both" : "none",
  });
  // Sidebar active item style helper
  const sidebarBtn = (names) => ({
    ...styles.sidebarItem,
    color: names.includes(section) ? cream : undefined,
    background: names.includes(section) ? "rgba(200,169,110,0.10)" : "transparent",
    borderLeft: names.includes(section) ? `2px solid ${accentColor}` : "2px solid transparent",
    cursor: "pointer",
    border: "none",
    WebkitAppearance: "none",
  });

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.85); }
        }
        @keyframes bias-pulse {
          0%, 100% { opacity: 1; box-shadow: none; }
          50% { opacity: 0.7; box-shadow: 0 0 12px rgba(245,158,11,0.4); }
        }
        @keyframes sectionIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes statCardIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rowIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        tr:hover td, tr:hover td * { background: inherit; }
        table tr:hover > td { background: rgba(200,169,110,0.05) !important; }
        table tbody tr:nth-child(even) > td { background: rgba(26,29,39,0.6) !important; }
        table tbody tr:nth-child(even):hover > td { background: rgba(200,169,110,0.05) !important; }
        select option { background: #1A1D27; color: #F0F2F5; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0F1117; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 0; }
        input::placeholder, textarea::placeholder { color: #8B92A5; }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(200,169,110,0.55) !important;
          box-shadow: 0 0 0 2px rgba(200,169,110,0.08) !important;
          outline: none;
        }
        .sidebar-item { transition: background 0.12s ease, color 0.12s ease; }
        .sidebar-item:hover { background: rgba(200,169,110,0.06) !important; color: #F0F2F5 !important; }
        .bias-flag-badge { animation: bias-pulse 2.2s ease-in-out infinite; }
        .verify-pulse-dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#C8A96E; animation: pulse-dot 1s ease-in-out infinite; flex-shrink:0; }
        .stat-card { transition: background 0.15s ease; }
        .stat-card:hover { background: #22263A !important; }
        .panel-card { transition: background 0.15s ease; border-radius: 0 !important; }
        .panel-card:hover { background: #22263A !important; }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .toast-item { animation: toastIn 0.22s ease both; }
        @keyframes skeletonShimmer {
          0% { background-position: -300px 0; }
          100% { background-position: 300px 0; }
        }
        .skeleton {
          display: inline-block;
          background: linear-gradient(90deg, rgba(255,255,255,0.045) 25%, rgba(255,255,255,0.10) 37%, rgba(255,255,255,0.045) 63%);
          background-size: 600px 100%;
          animation: skeletonShimmer 1.4s ease-in-out infinite;
          border-radius: 2px;
          vertical-align: middle;
        }
      `}</style>

      <div style={{ ...styles.header, position: "sticky", top: "0", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ overflow:"hidden", width:"120px", height:"44px", position:"relative", flexShrink:0 }}>
            <img src="https://tryaidal.com/Copy_of_AIDAL.png" alt="AIDAL." style={{ position:"absolute", width:"132px", height:"132px", mixBlendMode:"screen", top:"-44px", left:"-4px" }} onError={e => { e.target.parentNode.innerHTML = '<span style="font-family:IBM Plex Sans,sans-serif;font-size:16px;font-weight:600;color:#F0F4F8;letter-spacing:1px">AIDAL.</span>'; }} />
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

      <div style={{ display: "flex", height: "calc(100vh - 52px)", overflow: "hidden" }}>
        {/* ── SIDEBAR ── */}
        <aside style={styles.sidebar}>
          <span style={styles.sidebarSection}>Overview</span>
          <button className="sidebar-item" style={sidebarBtn(["dashboard"])} onClick={() => setSection("dashboard")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Overview
          </button>
          <button className="sidebar-item" style={sidebarBtn(["dashboard"])} onClick={() => setSection("dashboard")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
            Decision Records
          </button>
          <div style={styles.sidebarDivider} />
          <span style={styles.sidebarSection}>Tools</span>
          <button className="sidebar-item" style={sidebarBtn(["log-decision"])} onClick={() => setSection("log-decision")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Submit Decision
          </button>
          <button className="sidebar-item" style={sidebarBtn(["model-registry"])} onClick={() => setSection("model-registry")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            AI Model Inventory
          </button>
          <button className="sidebar-item" style={sidebarBtn(["fairness"])} onClick={() => setSection("fairness")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Bias &amp; Fairness Review
          </button>
          <button className="sidebar-item" style={sidebarBtn(["incidents"])} onClick={() => setSection("incidents")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Incidents &amp; Alerts
          </button>
          <div style={styles.sidebarDivider} />
          <span style={styles.sidebarSection}>Compliance Reports</span>
          <button className="sidebar-item" style={{ ...styles.sidebarSubItem }} onClick={() => {
            const url = `${API}/compliance/report/pdf?jurisdiction=SG`;
            fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } }).then(r => { if (!r.ok) throw new Error("download failed"); return r.blob(); }).then(blob => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `AIDAL_MAS_FEAT_${new Date().toISOString().slice(0,10)}.pdf`; a.click(); showToast("Report downloaded.", "success"); }).catch(() => showToast("Download failed. Check your connection and try again.", "error"));
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            MAS FEAT
          </button>
          <button className="sidebar-item" style={{ ...styles.sidebarSubItem }} onClick={() => {
            const url = `${API}/compliance/report/pdf?jurisdiction=ID`;
            fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } }).then(r => { if (!r.ok) throw new Error("download failed"); return r.blob(); }).then(blob => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `AIDAL_OJK_${new Date().toISOString().slice(0,10)}.pdf`; a.click(); showToast("Report downloaded.", "success"); }).catch(() => showToast("Download failed. Check your connection and try again.", "error"));
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            OJK Indonesia
          </button>
          <button className="sidebar-item" style={{ ...styles.sidebarSubItem }} onClick={() => {
            const url = `${API}/compliance/report/pdf?jurisdiction=EU`;
            fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } }).then(r => { if (!r.ok) throw new Error("download failed"); return r.blob(); }).then(blob => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `AIDAL_EU_AI_Act_${new Date().toISOString().slice(0,10)}.pdf`; a.click(); showToast("Report downloaded.", "success"); }).catch(() => showToast("Download failed. Check your connection and try again.", "error"));
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            EU AI Act
          </button>
          <button className="sidebar-item" style={{ ...styles.sidebarSubItem }} onClick={() => {
            const url = `${API}/compliance/report/pdf?jurisdiction=UAE`;
            fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } }).then(r => { if (!r.ok) throw new Error("download failed"); return r.blob(); }).then(blob => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `AIDAL_VARA_${new Date().toISOString().slice(0,10)}.pdf`; a.click(); showToast("Report downloaded.", "success"); }).catch(() => showToast("Download failed. Check your connection and try again.", "error"));
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            VARA UAE
          </button>
          <button className="sidebar-item" style={{ ...styles.sidebarSubItem }} onClick={() => {
            const url = `${API}/compliance/report/pdf?jurisdiction=UK`;
            fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } }).then(r => { if (!r.ok) throw new Error("download failed"); return r.blob(); }).then(blob => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `AIDAL_FCA_UK_${new Date().toISOString().slice(0,10)}.pdf`; a.click(); showToast("Report downloaded.", "success"); }).catch(() => showToast("Download failed. Check your connection and try again.", "error"));
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            UK FCA
          </button>
          <button className="sidebar-item" style={{ ...styles.sidebarSubItem }} onClick={() => {
            const url = `${API}/compliance/report/pdf?jurisdiction=US`;
            fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } }).then(r => { if (!r.ok) throw new Error("download failed"); return r.blob(); }).then(blob => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `AIDAL_CFPB_US_${new Date().toISOString().slice(0,10)}.pdf`; a.click(); showToast("Report downloaded.", "success"); }).catch(() => showToast("Download failed. Check your connection and try again.", "error"));
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            US CFPB
          </button>
          <button className="sidebar-item" style={{ ...styles.sidebarSubItem }} onClick={() => {
            const url = `${API}/compliance/report/pdf?jurisdiction=AU`;
            fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } }).then(r => { if (!r.ok) throw new Error("download failed"); return r.blob(); }).then(blob => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `AIDAL_APRA_AU_${new Date().toISOString().slice(0,10)}.pdf`; a.click(); showToast("Report downloaded.", "success"); }).catch(() => showToast("Download failed. Check your connection and try again.", "error"));
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            AU APRA
          </button>
          <div style={styles.sidebarDivider} />
          <span style={styles.sidebarSection}>Resources</span>
          <a href="https://aidal-dashboard.vercel.app/verify" target="_blank" rel="noreferrer" className="sidebar-item" style={{ ...styles.sidebarItem, color: green }}>
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
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflowY: "auto", height: "100%" }}>
        <div style={styles.main}>
        {/* ══ SECTION: DASHBOARD ══ */}
        <div key={section === "dashboard" ? "dash-active" : "dash"} style={secStyle("dashboard")}>
        <div style={styles.pageTitle}>Compliance Dashboard</div>
        <div style={styles.pageSubtitle}>
          {companyName} · AI decisions logged, explained, and cryptographically verified ·{" "}
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>

        {hasLegacyDecisions && (
          <div style={{
            background: "rgba(200,169,110,0.06)", border: `1px solid rgba(200,169,110,0.25)`,
            borderLeft: `3px solid ${accentColor}`, padding: "12px 16px", marginBottom: "1.5rem",
            fontSize: "12.5px", color: creamDim, lineHeight: 1.6,
          }}>
            <strong style={{ color: cream }}>Some decisions in this account predate {EXPLANATION_FIX_DATE_LABEL}.</strong>{" "}
            Those records used an earlier version of the explanation generator and are preserved exactly as
            originally sealed — consistent with AIDAL's append-only design, decisions are never edited or
            re-hashed after the fact, even to fix a display issue. Decisions logged after {EXPLANATION_FIX_DATE_LABEL} use the current generator.
          </div>
        )}

        {/* ── STAT GRID — 5 cards ── */}
        <div style={styles.statGrid}>
          <div className="stat-card" style={{ ...styles.statCard, borderTop: "2px solid #C8A96E", animation: "statCardIn 0.3s ease both", animationDelay: "0ms" }}>
            <span style={styles.statLabel}>Total decisions</span>
            <span style={styles.statValue}>{loading ? <Skel w={48} h={30} /> : totalDecisionsAnimated}</span>
            <div style={styles.statSub}>All time</div>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, borderTop: "2px solid #C8A96E", animation: "statCardIn 0.3s ease both", animationDelay: "80ms" }}>
            <span style={styles.statLabel}>Chain status</span>
            {verifying ? (
              <div style={{ marginTop: "6px", marginBottom: "8px" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  color: accentColor, fontSize: "11px", fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.02em",
                }}>
                  <span className="verify-pulse-dot" />
                  {verifySteps[verifyStep]}
                </span>
              </div>
            ) : loading ? (
              <span style={{ ...styles.statValue, fontSize: "18px" }}>—</span>
            ) : chainOk ? (
              <div style={{ marginTop: "4px", marginBottom: "8px" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  background: "rgba(200,169,110,0.10)",
                  border: "1px solid rgba(200,169,110,0.4)",
                  color: accentColor,
                  fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                  fontFamily: "'IBM Plex Mono', monospace",
                  padding: "4px 10px", borderRadius: "2px",
                  textTransform: "uppercase",
                  cursor: "help",
                }} title="SHA-256 hash matches. No tampering detected. Verified independently of AIDAL's servers.">✓ VERIFIED</span>
              </div>
            ) : (
              <div style={{ marginTop: "4px", marginBottom: "8px" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  background: "rgba(239,68,68,0.10)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: red,
                  fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                  fontFamily: "'IBM Plex Mono', monospace",
                  padding: "4px 10px", borderRadius: "2px",
                  textTransform: "uppercase",
                }}>{verify?.status === "no_records" ? "NO DATA" : "⚠ CHECK"}</span>
              </div>
            )}
            <div style={styles.statSub}>{verify?.records_verified ?? 0} records verified</div>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, borderTop: "2px solid #C8A96E", animation: "statCardIn 0.3s ease both", animationDelay: "160ms" }}>
            <span style={styles.statLabel}>Jurisdictions</span>
            <span style={styles.statValue}>{loading ? <Skel w={30} h={30} /> : (jurisdictions.length || 0)}</span>
            <div style={styles.statSub}>{jurisdictions.join(", ") || "—"}</div>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, borderTop: "2px solid #C8A96E", animation: "statCardIn 0.3s ease both", animationDelay: "240ms" }}>
            <span style={styles.statLabel}>Human review coverage</span>
            <span style={{ ...styles.statValue, color: oversightPct > 0 ? green : amber }}>
              {loading ? <Skel w={56} h={30} /> : `${oversightPct}%`}
            </span>
            <div style={styles.statSub}>
              {loading ? "" : oversightPct > 0
                ? `${oversight?.decisions_reviewed} decision${oversight?.decisions_reviewed !== 1 ? "s" : ""} reviewed`
                : "No human reviews yet"}
            </div>
            {!loading && (
              <>
                <div style={{ marginTop: "10px", background: bgBorder, height: "3px", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ background: amber, height: "100%", width: `${Math.min(oversightPct, 100)}%`, transition: "width 0.6s ease" }} />
                </div>
                <div style={{ marginTop: "5px", fontSize: "10px", color: textMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.04em" }}>
                  {oversight?.oversight_target_pct != null
                    ? `Your team's target: ${oversight.oversight_target_pct}%`
                    : "No target set — see Human Oversight section"}
                </div>
              </>
            )}
          </div>
          <div className="stat-card" style={{ ...styles.statCard, borderTop: "2px solid #C8A96E", animation: "statCardIn 0.3s ease both", animationDelay: "280ms" }}>
            <span style={styles.statLabel}>Override rate</span>
            <span style={{ ...styles.statValue, color: cream }}>
              {loading ? <Skel w={56} h={30} /> : (oversight?.override_rate_pct != null ? `${oversight.override_rate_pct}%` : "—")}
            </span>
            <div style={styles.statSub}>
              {loading ? "" : oversight?.completed_reviews
                ? `of ${oversight.completed_reviews} completed review${oversight.completed_reviews !== 1 ? "s" : ""} changed the outcome`
                : "No completed reviews yet"}
            </div>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, borderTop: "2px solid #C8A96E", animation: "statCardIn 0.3s ease both", animationDelay: "320ms" }}>
            <span style={styles.statLabel}>Open incidents</span>
            <span style={{ ...styles.statValue, color: openIncidentCount > 0 ? amber : cream }}>
              {openIncidentCount}
            </span>
            <div style={{ ...styles.statSub, color: openIncidentCount > 0 ? amber : creamDim }}>
              {openIncidentCount > 0 ? "Requires attention" : "All clear"}
            </div>
          </div>
          <div className="stat-card" style={{ ...styles.statCard, borderRight: "none", borderTop: "2px solid #C8A96E", animation: "statCardIn 0.3s ease both", animationDelay: "400ms" }}>
            <span style={styles.statLabel}>Last audit submitted</span>
            <span style={{ ...styles.statValue, fontSize: "15px", letterSpacing: "0", marginTop: "6px" }}>
              {loading ? <Skel w={90} h={18} /> : decisions.length > 0 ? formatDate(decisions[0]?.logged_at).split(",")[0] : "—"}
            </span>
            <div style={styles.statSub}>
              {loading ? "" : decisions.length > 0 ? formatDate(decisions[0]?.logged_at).split(",")[1]?.trim() ?? "" : "No records yet"}
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
            <button
              style={{ background: "transparent", border: `1px solid ${accentColor}`, color: accentColor, padding: "6px 16px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: verifying ? "default" : "pointer", borderRadius: 0, fontFamily: "'IBM Plex Mono', monospace", opacity: verifying ? 0.6 : 1 }}
              onClick={runVerify}
              disabled={verifying}
            >
              {verifying ? "Verifying..." : "Verify Audit Trail"}
            </button>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", marginBottom: chainOk && verify?.certificate ? "0" : "10px" }}>
          <button
            style={{
              background: "transparent", border: `1px solid ${bgBorder}`, color: textMuted,
              padding: "6px 14px", fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em",
              cursor: exporting ? "default" : "pointer", borderRadius: 0,
              fontFamily: "'IBM Plex Sans', sans-serif", opacity: exporting ? 0.7 : 1,
              display: "inline-flex", alignItems: "center", gap: "6px",
            }}
            onClick={handleExport}
            disabled={exporting}
            title="Download a complete copy of every decision — hash, explanation, compliance check, input/output data. Your own continuity backup, independent of AIDAL staying online."
          >
            ↓ {exporting
              ? (exportProgress?.total ? `Exporting ${exportProgress.fetched}/${exportProgress.total}...` : "Exporting...")
              : "Export All Decisions"}
          </button>
        </div>

        {chainOk && verify?.certificate && (
          <div style={styles.certBox}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
                Compliance certificate
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                background: "rgba(200,169,110,0.10)",
                border: "1px solid rgba(200,169,110,0.4)",
                color: accentColor,
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                fontFamily: "'IBM Plex Mono', monospace",
                padding: "3px 10px", borderRadius: "2px",
                textTransform: "uppercase",
                cursor: "help",
              }} title="SHA-256 hash matches. No tampering detected. Verified independently of AIDAL's servers.">✓ VERIFIED</span>
            </div>
            <div style={styles.certText}>{verify.certificate}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid rgba(16,185,129,0.15)`, paddingTop: "0.875rem" }}>
              <button
                style={{
                  background: "transparent",
                  border: `1px solid rgba(16,185,129,0.3)`,
                  color: green,
                  padding: "6px 16px",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  borderRadius: 0,
                  letterSpacing: "0.02em",
                }}
                onClick={() => {
                  const url = `${API}/compliance/report/pdf`;
                  fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } })
                    .then(r => { if (!r.ok) throw new Error("download failed"); return r.blob(); })
                    .then(blob => {
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = `AIDAL_Certificate_${new Date().toISOString().slice(0,10)}.pdf`;
                      a.click();
                      showToast("Certificate downloaded.", "success");
                    })
                    .catch(() => showToast("Download failed. Check your connection and try again.", "error"));
                }}
              >
                ↓ Download PDF
              </button>
              <div style={{ fontSize: "12px", color: textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
                Verified {formatDate(verify.verified_at)}
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION DIVIDER ── */}
        <div style={{ height: "1px", background: bgBorder, margin: "0 0 1.5rem 0" }} />

        {/* ── PDF DOWNLOAD CARDS ── */}
        {!loading && summary && summary.total_decisions > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: "0.75rem", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>
              Compliance Reports — On demand
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "8px" }}>
              {[
                { jur: "SG",  label: "MAS FEAT",         ref: "MAS Notice on FEAT",          flag: "🇸🇬" },
                { jur: "ID",  label: "OJK Indonesia",    ref: "POJK No. 11/2022",            flag: "🇮🇩" },
                { jur: "EU",  label: "EU AI Act",        ref: "Regulation (EU) 2024/1689",   flag: "🇪🇺" },
                { jur: "UAE", label: "VARA UAE",         ref: "VARA AI Governance 2024",     flag: "🇦🇪" },
                { jur: "UK",  label: "UK FCA",           ref: "SYSC 3 / SM&CR / PS 22/3",    flag: "🇬🇧" },
                { jur: "US",  label: "US CFPB",          ref: "ECOA Reg B / Circular 2023-03", flag: "🇺🇸" },
                { jur: "AU",  label: "AU APRA",          ref: "CPS 234 / CPS 230",           flag: "🇦🇺" },
                { jur: null,  label: "All jurisdictions",ref: "Combined audit report",        flag: "🌐" },
              ].map(({ jur, label, ref, flag }) => (
                <div
                  key={jur || "ALL"}
                  style={{
                    background: navyDark,
                    border: `1px solid ${bgBorder}`,
                    padding: "1rem 1.125rem",
                    borderRadius: 0,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <div>
                      <div style={{ fontSize: "13px", color: cream, fontWeight: 500, marginBottom: "2px" }}>
                        <span style={{ marginRight: "6px" }}>{flag}</span>{label}
                      </div>
                      <div style={{ fontSize: "11px", color: textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>{ref}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: creamDim, marginBottom: "0.875rem" }}>On demand · generated now</div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      style={{
                        background: "rgba(200,169,110,0.10)",
                        border: "1px solid rgba(200,169,110,0.35)",
                        color: "#C8A96E",
                        padding: "5px 12px",
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontSize: "11px",
                        fontWeight: 500,
                        cursor: "pointer",
                        borderRadius: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      onClick={() => {
                        const url = jur ? `${API}/compliance/report/pdf?jurisdiction=${jur}` : `${API}/compliance/report/pdf`;
                        fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } })
                          .then(r => { if (!r.ok) throw new Error("Failed"); return r.blob(); })
                          .then(blob => {
                            const blobUrl = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = blobUrl;
                            a.download = `AIDAL_${jur || "ALL"}_${new Date().toISOString().slice(0,10)}.pdf`;
                            document.body.appendChild(a); a.click(); document.body.removeChild(a);
                            showToast("Report downloaded.", "success");
                            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                          })
                          .catch(() => showToast("Download failed. Check your connection and try again.", "error"));
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Download PDF
                    </button>
                    <span style={{ fontSize: "10px", color: textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>Schedule auto-report</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HUMAN OVERSIGHT BANNER (EU AI Act Article 14 topic — target below is this team's own, not a legal number) ── */}
        {!loading && summary && (() => {
          const targetSet = oversight?.oversight_target_pct != null;
          const belowTarget = !!oversight?.below_target;
          const barColor = oversightPct === 0 ? amber : (belowTarget ? amber : green);
          return (
            <div style={{
              background: belowTarget || oversightPct === 0 ? "rgba(212,135,58,0.08)" : "rgba(76,175,130,0.08)",
              border: `1px solid ${belowTarget || oversightPct === 0 ? "rgba(212,135,58,0.3)" : "rgba(76,175,130,0.25)"}`,
              padding: "0.875rem 1.25rem",
              marginBottom: "1.5rem",
              borderRadius: 0,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: "4px" }}>
                    Human Oversight — EU AI Act Article 14
                  </div>
                  <div style={{ fontSize: "13px", color: barColor }}>
                    {oversightPct > 0
                      ? `${oversight?.decisions_reviewed} of ${oversight?.total_decisions} decisions have human review (${oversightPct}% coverage)`
                      : "No human reviews logged yet — click any decision → Log review"}
                    {oversight?.override_rate_pct != null && (
                      <span style={{ color: textMuted }}> · {oversight.override_rate_pct}% of completed reviews changed the outcome</span>
                    )}
                  </div>
                </div>

                {/* Inline target control — always editable, framed honestly as this team's own choice */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "11px", color: textMuted, whiteSpace: "nowrap" }}>Your team's target:</span>
                  <input
                    type="number" min="0" max="100"
                    value={targetInput}
                    onChange={e => setTargetInput(e.target.value)}
                    placeholder="none"
                    style={{ width: "56px", fontSize: "12px", padding: "3px 6px", border: `1px solid ${bgBorder}`, borderRadius: 4, background: navyLight, color: cream, fontFamily: "'IBM Plex Mono', monospace" }}
                  />
                  <span style={{ fontSize: "11px", color: textMuted }}>%</span>
                  <button
                    onClick={saveOversightTarget}
                    disabled={savingTarget}
                    style={{ fontSize: "11px", padding: "4px 10px", border: `1px solid ${bgBorder}`, borderRadius: 4, background: "transparent", color: cream, cursor: savingTarget ? "not-allowed" : "pointer" }}
                  >
                    {savingTarget ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "6px", fontSize: "10px", color: textMuted, lineHeight: 1.6 }}>
                {targetSet
                  ? "This is a target your team configured for itself — EU AI Act Article 14 does not specify a numeric coverage threshold."
                  : "No target set. This is optional and entirely up to your team — Article 14 itself doesn't specify a numeric coverage requirement."}
              </div>

              {/* Specific list of decisions still needing review — the whole point of A2 */}
              {belowTarget && needingReview.total_needing_review > 0 && (
                <div style={{ marginTop: "0.875rem", paddingTop: "0.875rem", borderTop: `1px solid ${bgBorder}` }}>
                  <div style={{ fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: textMuted, marginBottom: "6px" }}>
                    {needingReview.total_needing_review} decision{needingReview.total_needing_review !== 1 ? "s" : ""} still need review (oldest first)
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", maxHeight: "180px", overflowY: "auto" }}>
                    {needingReview.decisions.map(d => (
                      <button
                        key={d.audit_id}
                        onClick={() => openDecisionById(d.audit_id)}
                        style={{
                          display: "flex", justifyContent: "space-between", gap: "1rem",
                          fontSize: "12px", padding: "5px 8px", background: "transparent",
                          border: "none", borderRadius: 4, cursor: "pointer", textAlign: "left",
                          fontFamily: "'IBM Plex Mono', monospace", color: cream,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = navyLight}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span>{d.audit_id}</span>
                        <span style={{ color: textMuted }}>{d.decision_type || "—"} · {d.jurisdiction || "—"}</span>
                      </button>
                    ))}
                  </div>
                  {needingReview.total_needing_review > needingReview.decisions.length && (
                    <div style={{ fontSize: "11px", color: textMuted, marginTop: "6px" }}>
                      …and {needingReview.total_needing_review - needingReview.decisions.length} more.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── SECTION DIVIDER ── */}
        <div style={{ height: "1px", background: bgBorder, margin: "1.5rem 0" }} />

        <div style={{ ...styles.toolbar, marginTop: "0" }}>
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
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td style={styles.tdPrimary}><Skel w={95} h={12} /></td>
                  <td style={styles.td}><Skel w={64} h={18} /></td>
                  <td style={styles.td}><Skel w={38} h={18} /></td>
                  <td style={{ ...styles.td, maxWidth: "300px" }}><Skel w={220} h={12} /></td>
                  <td style={styles.td}><Skel w={110} h={12} /></td>
                  <td style={styles.td}><Skel w={120} h={12} /></td>
                  <td style={styles.td}><Skel w={80} h={22} /></td>
                </tr>
              ))}
            </tbody>
          </table>
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
                    <tr key={r.audit_id || i} style={{ cursor: "pointer", animation: "rowIn 0.25s ease both", animationDelay: `${Math.min(i, 10) * 25}ms` }} onClick={() => setSelected(r)}>
                      <td style={styles.tdPrimary}>{r.decision_type || "—"}</td>
                      <td style={styles.td}>
                        <span style={outcome === "—"
                          ? { display: "inline-block", padding: "2px 9px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid rgba(245,158,11,0.3)", color: amber, background: "rgba(245,158,11,0.07)", borderRadius: 0, fontFamily: "'IBM Plex Mono', monospace" }
                          : styles.outcomeBadge(outcome)}>
                          {outcome === "—" ? "—" : outcome}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {r.jurisdiction ? <span style={styles.jurBadge(r.jurisdiction)}>{r.jurisdiction}</span> : "—"}
                      </td>
                      <td style={{ ...styles.td, maxWidth: "300px" }}>
                        <span style={{ fontSize: "13px", color: creamDim }}>
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
                            Open Case
                          </button>
                          <a
                            href={`https://aidal-dashboard.vercel.app/verify?id=${r.audit_id}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: "4px",
                              padding: "4px 12px", fontSize: "11px", textDecoration: "none",
                              color: accentColor, border: `1px solid rgba(200,169,110,0.45)`,
                              background: "rgba(200,169,110,0.08)",
                              fontFamily: "'IBM Plex Mono', monospace",
                              letterSpacing: "0.04em", fontWeight: 600,
                              borderRadius: 0, cursor: "pointer",
                            }}>
                            ✓ Verify Evidence
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
                    <div key={i} className="panel-card" style={{ background: navyDark, border: `1px solid ${bgBorder}`, borderRadius: 0, padding: "1.125rem 1.25rem", borderTop: "2px solid #C8A96E" }}>
                      <div style={{ marginBottom: "10px" }}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: tag.color, textTransform: "uppercase", letterSpacing: "0.08em", background: tag.bg, padding: "2px 8px", borderRadius: 0, display: "inline-block" }}>{b.type}</div>
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "28px", fontWeight: 500, color: cream, lineHeight: 1, marginBottom: "14px", letterSpacing: "-0.02em" }}>{b.count}</div>
                      <div style={{ position: "relative", background: bgBorder, height: "6px" }}>
                        <div style={{ background: "#C8A96E", height: "100%", width: `${pct}%`, transition: "width 0.5s ease" }} />
                        <span style={{ position: "absolute", right: 0, bottom: "8px", fontSize: "10px", color: creamDim, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>{b.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        </div>{/* end dashboard section */}

        {/* ══ SECTION: SUBMIT DECISION ══ */}
        <div key={section === "log-decision" ? "ld-active" : "ld"} style={secStyle("log-decision")}>
          <div style={{ ...styles.pageTitle, marginBottom: "0.25rem" }}>Submit Decision</div>
          <div style={{ ...styles.pageSubtitle, marginBottom: "1.5rem" }}>Send a real AI decision to your account — no code required</div>
          <TestPanel apiKey={apiKey} onSuccess={() => { fetchAll(); fetchDecisions(); }} />
        </div>

        {/* ══ SECTION: AI MODEL INVENTORY ══ */}
        <div key={section === "model-registry" ? "mr-active" : "mr"} style={secStyle("model-registry")}>
          <div style={{ ...styles.pageTitle, marginBottom: "0.25rem" }}>AI Model Inventory</div>
          <div style={{ ...styles.pageSubtitle, marginBottom: "1.5rem" }}>EU AI Act Article 9 — register AI models before deployment</div>
          <ModelRegistryPanel apiKey={apiKey} onSuccess={fetchAll} />
        </div>

        {/* ══ SECTION: BIAS & FAIRNESS REVIEW ══ */}
        <div key={section === "fairness" ? "fd-active" : "fd"} style={secStyle("fairness")}>
          <div style={{ ...styles.pageTitle, marginBottom: "0.25rem" }}>Bias &amp; Fairness Review</div>
          <div style={{ ...styles.pageSubtitle, marginBottom: "1.5rem" }}>EU AI Act Article 10 + MAS FEAT — bias monitoring across credit score bands</div>
          <FairnessPanel apiKey={apiKey} />
        </div>

        {/* ══ SECTION: INCIDENTS & ALERTS ══ */}
        <div key={section === "incidents" ? "ir-active" : "ir"} style={secStyle("incidents")}>
          <div style={{ ...styles.pageTitle, marginBottom: "0.25rem" }}>Incidents &amp; Alerts</div>
          <div style={{ ...styles.pageSubtitle, marginBottom: "1.5rem" }}>EU AI Act Article 72 — report AI incidents to regulators within 15 days</div>
          <IncidentPanel
            apiKey={apiKey}
            onStatsUpdate={(incidents) => {
              const open = incidents.filter(i => i.status !== "resolved").length;
              setOpenIncidentCount(open);
            }}
          />
        </div>

        </div>{/* end styles.main */}

        <div style={{ borderTop: `0.5px solid ${bgBorder}`, padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: textMuted }}>
          <span style={{ display: "inline-block", overflow: "hidden", width: "120px", height: "45px", position: "relative", flexShrink: 0 }}>
            <img src="https://tryaidal.com/Copy_of_AIDAL.png" alt="AIDAL." style={{ position: "absolute", width: "132px", height: "132px", mixBlendMode: "screen", top: "-44px", left: "-4px", display: "block" }} onError={e => { e.target.parentNode.innerHTML = '<span style="font-family:Inter,sans-serif;font-size:15px;font-weight:600;color:#9C9690;letter-spacing:0.06em">AIDAL.</span>'; }} />
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
  if (!apiKey) return (<><LoginScreen onLogin={handleLogin} /><ToastHost /></>);
  return (<><Dashboard apiKey={apiKey} companyName={companyName} onLogout={handleLogout} /><ToastHost /></>);
}
