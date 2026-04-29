import { useState, useEffect, useCallback } from "react";

const API = "https://aidal-production.up.railway.app";

const navy = "#2d3a5c";
const cream = "#f0ebe0";
const creamDim = "#c8c2b0";
const navyDark = "#1e2840";
const navyLight = "#3d4f7a";
const green = "#1d9e75";
const red = "#a32d2d";
const amber = "#ba7517";

const styles = {
  app: {
    minHeight: "100vh",
    background: navy,
    color: cream,
    fontFamily: "'EB Garamond', Georgia, serif",
    fontSize: "16px",
  },

  loginWrap: {
    minHeight: "100vh",
    background: navyDark,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  loginBox: {
    width: "100%",
    maxWidth: 480,
    border: "1px solid rgba(240,235,224,0.15)",
    padding: "3rem",
    background: navy,
  },
  loginLogo: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "36px",
    fontWeight: 900,
    letterSpacing: "4px",
    color: cream,
    marginBottom: "0.25rem",
  },
  loginTagline: {
    fontSize: "13px",
    color: creamDim,
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "2.5rem",
  },
  loginLabel: {
    fontSize: "11px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: creamDim,
    display: "block",
    marginBottom: "8px",
  },
  loginInput: {
    width: "100%",
    background: navyDark,
    border: "1px solid rgba(240,235,224,0.2)",
    color: cream,
    padding: "14px 16px",
    fontFamily: "'EB Garamond', serif",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: "1px",
    marginBottom: "1.25rem",
  },
  loginBtn: {
    width: "100%",
    background: cream,
    border: "none",
    color: navy,
    padding: "14px",
    fontFamily: "'Playfair Display', serif",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "2px",
    cursor: "pointer",
    textTransform: "uppercase",
  },
  loginError: {
    background: "rgba(163,45,45,0.15)",
    border: `1px solid ${red}`,
    color: "#e08080",
    padding: "10px 14px",
    fontSize: "14px",
    marginBottom: "1rem",
  },
  loginHint: {
    marginTop: "1.5rem",
    fontSize: "13px",
    color: creamDim,
    borderTop: "1px solid rgba(240,235,224,0.1)",
    paddingTop: "1.5rem",
    lineHeight: 1.8,
  },

  header: {
    borderBottom: `1px solid rgba(240,235,224,0.1)`,
    padding: "1.25rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: navyDark,
  },
  logo: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: cream,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  companyBadge: {
    fontSize: "13px",
    color: creamDim,
    letterSpacing: "1px",
    background: "rgba(240,235,224,0.07)",
    padding: "4px 12px",
    border: "1px solid rgba(240,235,224,0.15)",
  },
  statusDot: (ok) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: ok ? green : red,
    display: "inline-block",
    marginRight: 6,
  }),
  statusText: {
    fontSize: "13px",
    color: creamDim,
    letterSpacing: "1px",
  },
  main: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "2rem",
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "36px",
    fontWeight: 900,
    color: cream,
    marginBottom: "0.25rem",
  },
  pageSubtitle: {
    fontSize: "15px",
    color: creamDim,
    marginBottom: "2.5rem",
    letterSpacing: "0.5px",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1px",
    background: "rgba(240,235,224,0.1)",
    border: "1px solid rgba(240,235,224,0.1)",
    marginBottom: "2rem",
  },
  statCard: {
    background: navyDark,
    padding: "1.5rem",
  },
  statLabel: {
    fontSize: "11px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: creamDim,
    marginBottom: "8px",
    display: "block",
  },
  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "42px",
    fontWeight: 700,
    color: cream,
    lineHeight: 1,
    display: "block",
  },
  statSub: {
    fontSize: "12px",
    color: creamDim,
    marginTop: "4px",
  },
  verifyBanner: (valid) => ({
    background: valid ? "rgba(29,158,117,0.15)" : "rgba(163,45,45,0.15)",
    border: `1px solid ${valid ? green : red}`,
    padding: "1rem 1.5rem",
    marginBottom: "2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  verifyText: (valid) => ({
    fontSize: "15px",
    color: valid ? "#7ec8a0" : "#e08080",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }),
  btn: {
    background: "transparent",
    border: `1px solid ${creamDim}`,
    color: cream,
    padding: "8px 20px",
    fontFamily: "'EB Garamond', serif",
    fontSize: "14px",
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  btnPrimary: {
    background: cream,
    border: `1px solid ${cream}`,
    color: navy,
    padding: "8px 20px",
    fontFamily: "'EB Garamond', serif",
    fontSize: "14px",
    letterSpacing: "1px",
    cursor: "pointer",
  },
  btnDanger: {
    background: "transparent",
    border: `1px solid ${red}`,
    color: "#e08080",
    padding: "8px 20px",
    fontFamily: "'EB Garamond', serif",
    fontSize: "13px",
    letterSpacing: "1px",
    cursor: "pointer",
  },
  toolbar: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
    alignItems: "center",
  },
  select: {
    background: navyDark,
    border: "1px solid rgba(240,235,224,0.2)",
    color: cream,
    padding: "8px 14px",
    fontFamily: "'EB Garamond', serif",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
  },
  input: {
    background: navyDark,
    border: "1px solid rgba(240,235,224,0.2)",
    color: cream,
    padding: "8px 14px",
    fontFamily: "'EB Garamond', serif",
    fontSize: "14px",
    outline: "none",
    width: "280px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: navyDark,
    border: "1px solid rgba(240,235,224,0.1)",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: creamDim,
    borderBottom: "1px solid rgba(240,235,224,0.1)",
    background: navy,
    fontWeight: 400,
  },
  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: creamDim,
    borderBottom: "1px solid rgba(240,235,224,0.06)",
    verticalAlign: "top",
  },
  tdPrimary: {
    padding: "14px 16px",
    fontSize: "14px",
    color: cream,
    borderBottom: "1px solid rgba(240,235,224,0.06)",
    fontFamily: "'Playfair Display', serif",
  },
  outcomeBadge: (outcome) => {
    const o = (outcome || "").toLowerCase();
    const isGood = o.includes("approv") || o.includes("pass") || o.includes("clear") || o === "true";
    const isBad = o.includes("den") || o.includes("flag") || o.includes("reject") || o.includes("block") || o === "false";
    return {
      display: "inline-block",
      padding: "3px 10px",
      fontSize: "12px",
      letterSpacing: "1px",
      border: `1px solid ${isGood ? green : isBad ? red : amber}`,
      color: isGood ? "#7ec8a0" : isBad ? "#e08080" : "#e8c070",
      background: isGood ? "rgba(29,158,117,0.1)" : isBad ? "rgba(163,45,45,0.1)" : "rgba(186,117,23,0.1)",
    };
  },
  hashText: {
    fontFamily: "monospace",
    fontSize: "11px",
    color: creamDim,
    letterSpacing: "0.5px",
  },
  modal: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(14,20,36,0.92)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "2rem",
  },
  modalBox: {
    background: navyDark,
    border: "1px solid rgba(240,235,224,0.15)",
    maxWidth: 700,
    width: "100%",
    maxHeight: "80vh",
    overflowY: "auto",
    padding: "2.5rem",
  },
  modalTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "24px",
    fontWeight: 700,
    color: cream,
    marginBottom: "1.5rem",
  },
  modalRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
    borderBottom: "1px solid rgba(240,235,224,0.06)",
    paddingBottom: "1rem",
  },
  modalKey: {
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: creamDim,
    minWidth: "140px",
    paddingTop: "2px",
  },
  modalVal: {
    fontSize: "15px",
    color: cream,
    lineHeight: 1.6,
    flex: 1,
  },
  explanationBox: {
    background: "rgba(29,158,117,0.1)",
    border: `1px solid ${green}`,
    padding: "1rem 1.25rem",
    marginTop: "1rem",
    fontSize: "15px",
    color: "#b0e8cc",
    lineHeight: 1.8,
    fontStyle: "italic",
  },
  empty: {
    textAlign: "center",
    padding: "4rem",
    color: creamDim,
    fontSize: "15px",
  },
  loading: {
    textAlign: "center",
    padding: "4rem",
    color: creamDim,
    fontSize: "15px",
    fontStyle: "italic",
  },
  pager: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 0",
    fontSize: "14px",
    color: creamDim,
  },
  countdown: {
    background: cream,
    color: navy,
    padding: "10px 2rem",
    textAlign: "center",
    fontSize: "14px",
    fontFamily: "'EB Garamond', serif",
    letterSpacing: "0.5px",
  },
  certBox: {
    background: "rgba(29,158,117,0.08)",
    border: `1px solid ${green}`,
    padding: "1rem 1.5rem",
    marginTop: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  certText: {
    fontFamily: "monospace",
    fontSize: "13px",
    color: "#7ec8a0",
    letterSpacing: "1px",
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
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=EB+Garamond:wght@400;500&display=swap" rel="stylesheet" />
      <div style={styles.loginBox}>
        <div style={styles.loginLogo}>AIDAL.</div>
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
                    <div style={{ fontSize: "12px", color: "#e08080", marginTop: "4px" }}>
                      Missing required: {compliance.missing_required.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}
            {(d.explanation || record.explanation) && (
              <div>
                <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: creamDim, marginBottom: "8px" }}>
                  AI explanation — Article 13 compliant
                </div>
                <div style={styles.explanationBox}>{d.explanation || record.explanation}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

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
    background: "rgba(240,235,224,0.06)",
    border: "1px solid rgba(240,235,224,0.2)",
    color: cream,
    padding: "10px 14px",
    fontFamily: "'EB Garamond', serif",
    fontSize: "15px",
    outline: "none",
    width: "100%",
  };

  const selectStyle = { ...inputStyle, background: "#1e2840", cursor: "pointer" };
  const labelStyle = { fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: creamDim, display: "block", marginBottom: "6px" };
  const fieldStyle = { marginBottom: "1rem" };

  return (
    <div style={{ marginTop: "2.5rem", border: "1px solid rgba(240,235,224,0.12)", background: navyDark }}>
      <div
        style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: open ? "1px solid rgba(240,235,224,0.1)" : "none" }}
        onClick={() => { setOpen(o => !o); setResult(null); setError(""); }}
      >
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: cream, fontWeight: 700 }}>
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
            <div style={{ background: "rgba(163,45,45,0.15)", border: "1px solid #a32d2d", color: "#e08080", padding: "10px 14px", fontSize: "14px", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          {result && (
            <div style={{ background: "rgba(29,158,117,0.1)", border: "1px solid #1d9e75", padding: "1.25rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#7ec8a0", marginBottom: "10px" }}>✓ Decision logged successfully</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px", color: creamDim }}>
                <div><span style={{ color: cream }}>Audit ID:</span> <span style={{ fontFamily: "monospace" }}>{result.audit_id}</span></div>
                <div><span style={{ color: cream }}>Compliance:</span> <span style={{ color: result.compliance?.compliant ? "#7ec8a0" : "#e08080" }}>{result.compliance?.status || "—"}</span></div>
              </div>
              {result.explanation && (
                <div style={{ marginTop: "10px", fontSize: "14px", color: "#b0e8cc", fontStyle: "italic", lineHeight: 1.7, borderTop: "1px solid rgba(29,158,117,0.2)", paddingTop: "10px" }}>
                  {result.explanation}
                </div>
              )}
              {result.compliance?.missing_recommended?.length > 0 && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#e8c070" }}>
                  Tip: Add {result.compliance.missing_recommended.slice(0,2).join(", ")} to improve compliance score.
                </div>
              )}
            </div>
          )}

          <button
            style={{ background: cream, border: "none", color: navy, padding: "12px 32px", fontFamily: "'EB Garamond', serif", fontSize: "15px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", opacity: sending ? 0.6 : 1 }}
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? "Sending..." : "Log this decision →"}
          </button>

          {result && (
            <button
              style={{ marginLeft: "12px", background: "transparent", border: "1px solid rgba(240,235,224,0.2)", color: creamDim, padding: "12px 24px", fontFamily: "'EB Garamond', serif", fontSize: "14px", cursor: "pointer" }}
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

  // ── FIXED: inline headers + Number(r.total) ──────────────────────────────
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

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=EB+Garamond:wght@400;500&display=swap" rel="stylesheet" />

      <div style={styles.countdown}>
        <strong>EU AI Act deadline:</strong> &nbsp;
        <strong style={{ color: red }}>{countdown}</strong>
        &nbsp;— Non-compliance fines up to €30M
      </div>

      <div style={styles.header}>
        <div style={styles.logo}>AIDAL.</div>
        <div style={styles.headerRight}>
          <span style={styles.companyBadge}>{companyName}</span>
          <span style={styles.statusText}>
            <span style={styles.statusDot(apiOk)} />
            {apiOk ? "API online" : "API offline"}
          </span>
          <button style={styles.btn} onClick={fetchAll}>↻ Refresh</button>
          <a href="https://aidal-dashboard.vercel.app/verify" target="_blank" rel="noreferrer"
            style={{ ...styles.btn, textDecoration: "none", fontSize: "13px", color: "#7ec8a0", borderColor: "rgba(29,158,117,0.4)" }}>
            ✓ Public verify ↗
          </a>
          <a href="https://github.com/widjajaanthony24-svg/aidal-anchors" target="_blank" rel="noreferrer"
            style={{ ...styles.btn, textDecoration: "none", fontSize: "13px" }}>
            Anchor log ↗
          </a>
          <a href="https://aidal-production.up.railway.app/docs" target="_blank" rel="noreferrer"
            style={{ ...styles.btn, textDecoration: "none", fontSize: "13px" }}>
            API docs ↗
          </a>
          <button style={styles.btnDanger} onClick={onLogout}>Sign out</button>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.pageTitle}>Compliance Dashboard</div>
        <div style={styles.pageSubtitle}>
          {companyName} · AI decisions logged, explained, and cryptographically verified ·{" "}
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>

        <div style={styles.statGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total decisions</span>
            <span style={styles.statValue}>{loading ? "—" : (summary?.total_decisions ?? 0)}</span>
            <div style={styles.statSub}>All time</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Chain status</span>
            <span style={{ ...styles.statValue, fontSize: "28px", color: chainOk ? "#7ec8a0" : "#e08080" }}>
              {loading ? "—" : chainOk ? "✓ Clean" : verify?.status === "no_records" ? "No data" : "⚠ Check"}
            </span>
            <div style={styles.statSub}>{verify?.records_verified ?? 0} records verified</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Jurisdictions</span>
            <span style={styles.statValue}>{loading ? "—" : (jurisdictions.length || 0)}</span>
            <div style={styles.statSub}>{jurisdictions.join(", ") || "—"}</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Decision types</span>
            <span style={styles.statValue}>{loading ? "—" : (types.length || 0)}</span>
            <div style={styles.statSub}>{types.slice(0, 2).join(", ") || "—"}</div>
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
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: creamDim, marginBottom: "4px" }}>
                Compliance certificate
              </div>
              <div style={styles.certText}>{verify.certificate}</div>
            </div>
            <div style={{ fontSize: "12px", color: creamDim }}>
              Verified {formatDate(verify.verified_at)}
            </div>
          </div>
        )}

        <div style={{ ...styles.toolbar, marginTop: "2rem" }}>
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
                      <td style={styles.td}>{r.jurisdiction || "—"}</td>
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
                            style={{ ...styles.btn, padding: "4px 12px", fontSize: "11px", textDecoration: "none", color: "#7ec8a0", borderColor: "rgba(29,158,117,0.4)", letterSpacing: "0.5px" }}>
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

        <TestPanel apiKey={apiKey} onSuccess={() => { fetchAll(); fetchDecisions(); }} />

        {summary?.by_type?.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: creamDim, marginBottom: "1rem" }}>
              Breakdown by type
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1px", background: "rgba(240,235,224,0.1)", border: "1px solid rgba(240,235,224,0.1)" }}>
              {summary.by_type.map((b, i) => (
                <div key={i} style={{ background: navyDark, padding: "1rem" }}>
                  <div style={{ fontSize: "12px", color: creamDim, marginBottom: "4px" }}>{b.type}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", color: cream }}>{b.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid rgba(240,235,224,0.1)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", fontSize: "13px", color: creamDim, marginTop: "2rem" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: cream }}>AIDAL.</span>
        <span>AI Decision Accountability Layer · {API}</span>
        <span>© 2026 AIDAL</span>
      </div>

      {selected && <DecisionModal record={selected} onClose={() => setSelected(null)} apiKey={apiKey} />}
    </div>
  );
}

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
