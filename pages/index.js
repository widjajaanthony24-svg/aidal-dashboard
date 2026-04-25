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
    const o = outcome?.toLowerCase() || "";
    const isGood = o.includes("approv") || o.includes("pass") || o.includes("clear");
    const isBad = o.includes("den") || o.includes("flag") || o.includes("reject") || o.includes("block");
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

function DecisionModal({ record, onClose }) {
  if (!record) return null;
  const d = record.decision || {};
  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div style={styles.modalTitle}>Decision #{record.id}</div>
          <button onClick={onClose} style={{ ...styles.btn, padding: "4px 12px", fontSize: "12px" }}>✕ Close</button>
        </div>

        <div style={styles.modalRow}>
          <span style={styles.modalKey}>Decision type</span>
          <span style={styles.modalVal}>{d.type || "—"}</span>
        </div>
        <div style={styles.modalRow}>
          <span style={styles.modalKey}>Outcome</span>
          <span style={styles.modalVal}><span style={styles.outcomeBadge(d.outcome)}>{d.outcome || "—"}</span></span>
        </div>
        <div style={styles.modalRow}>
          <span style={styles.modalKey}>AI model</span>
          <span style={styles.modalVal}>{d.model || "—"}</span>
        </div>
        <div style={styles.modalRow}>
          <span style={styles.modalKey}>Confidence</span>
          <span style={styles.modalVal}>{d.confidence ? `${(d.confidence * 100).toFixed(0)}%` : "—"}</span>
        </div>
        <div style={styles.modalRow}>
          <span style={styles.modalKey}>Jurisdiction</span>
          <span style={styles.modalVal}>{d.jurisdiction || "—"}</span>
        </div>
        <div style={styles.modalRow}>
          <span style={styles.modalKey}>Subject ID</span>
          <span style={styles.modalVal}>{d.subject_id || "—"}</span>
        </div>
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
          <span style={{ ...styles.modalVal, ...styles.hashText }}>{record.prev_hash}</span>
        </div>

        {d.explanation && (
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: creamDim, marginBottom: "8px" }}>
              AI-generated explanation (Article 13 compliant)
            </div>
            <div style={styles.explanationBox}>{d.explanation}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIDalDashboard() {
  const countdown = useCountdown();
  const [health, setHealth] = useState(null);
  const [summary, setSummary] = useState(null);
  const [verify, setVerify] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
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
        fetch(`${API}/summary`).then(r => r.json()),
        fetch(`${API}/verify`).then(r => r.json()),
      ]);
      setHealth(h);
      setSummary(s);
      setVerify(v);
    } catch(e) {
      setHealth({ status: "error" });
    }
    setLoading(false);
  }, []);

  const fetchDecisions = useCallback(async () => {
    const params = new URLSearchParams({ limit, offset });
    if (filterType) params.set("type", filterType);
    const r = await fetch(`${API}/decisions?${params}`).then(r => r.json());
    setDecisions(r.records || []);
    setTotal(r.count || 0);
  }, [filterType, offset]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { fetchDecisions(); }, [fetchDecisions]);

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    const r = await fetch(`${API}/decision/${searchId.trim()}`).then(r => r.json());
    if (r.id) setSelected(r);
    else alert("Decision not found.");
  };

  const apiOk = health?.status === "ok";
  const types = summary?.breakdown?.map(b => b.type).filter((v, i, a) => a.indexOf(v) === i) || [];

  return (
    <div style={styles.app}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=EB+Garamond:wght@400;500&display=swap" rel="stylesheet" />

      {/* Countdown */}
      <div style={styles.countdown}>
        <strong>EU AI Act deadline:</strong> &nbsp;
        <strong style={{ color: red }}>{countdown}</strong>
        &nbsp; — Non-compliance fines up to €30M
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>AIDAL.</div>
        <div style={styles.headerRight}>
          <span style={styles.statusText}>
            <span style={styles.statusDot(apiOk)} />
            {apiOk ? "API online" : "API offline"}
          </span>
          <button style={styles.btn} onClick={fetchAll}>↻ Refresh</button>
          <a href="https://aidal-production.up.railway.app/docs" target="_blank" rel="noreferrer"
            style={{ ...styles.btn, textDecoration: "none", fontSize: "13px" }}>
            API docs ↗
          </a>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.pageTitle}>Compliance Dashboard</div>
        <div style={styles.pageSubtitle}>
          All AI decisions — logged, explained, and verified · {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>

        {/* Stats */}
        <div style={styles.statGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total decisions</span>
            <span style={styles.statValue}>{summary?.total_decisions ?? "—"}</span>
            <div style={styles.statSub}>All time</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Chain status</span>
            <span style={{ ...styles.statValue, fontSize: "28px", color: verify?.valid ? "#7ec8a0" : "#e08080" }}>
              {verify?.valid ? "✓ Clean" : "⚠ Tampered"}
            </span>
            <div style={styles.statSub}>{verify?.records_checked ?? 0} records verified</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Jurisdictions</span>
            <span style={styles.statValue}>{summary?.by_jurisdiction?.length ?? "—"}</span>
            <div style={styles.statSub}>
              {summary?.by_jurisdiction?.map(j => j.jurisdiction).join(", ") || "—"}
            </div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Decision types</span>
            <span style={styles.statValue}>{types.length || "—"}</span>
            <div style={styles.statSub}>{types.slice(0, 2).join(", ") || "—"}</div>
          </div>
        </div>

        {/* Verify banner */}
        {verify && (
          <div style={styles.verifyBanner(verify.valid)}>
            <div style={styles.verifyText(verify.valid)}>
              <span style={{ fontSize: "20px" }}>{verify.valid ? "✓" : "⚠"}</span>
              <span>{verify.message}</span>
            </div>
            <button style={styles.btn} onClick={async () => {
              const v = await fetch(`${API}/verify`).then(r => r.json());
              setVerify(v);
            }}>Run verification</button>
          </div>
        )}

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <select style={styles.select} value={filterType} onChange={e => { setFilterType(e.target.value); setOffset(0); }}>
            <option value="">All decision types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <input
            style={styles.input}
            placeholder="Search by audit ID..."
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button style={styles.btnPrimary} onClick={handleSearch}>Search</button>

          {filterType && (
            <button style={styles.btn} onClick={() => { setFilterType(""); setOffset(0); }}>
              Clear filter
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div style={styles.loading}>Loading decisions...</div>
        ) : decisions.length === 0 ? (
          <div style={styles.empty}>No decisions logged yet. Integrate the API to start recording.</div>
        ) : (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Outcome</th>
                  <th style={styles.th}>Jurisdiction</th>
                  <th style={styles.th}>Confidence</th>
                  <th style={styles.th}>Logged at</th>
                  <th style={styles.th}>Audit ID</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {decisions.map(r => (
                  <tr key={r.id} style={{ cursor: "pointer" }} onClick={() => setSelected(r)}>
                    <td style={styles.tdPrimary}>{r.id}</td>
                    <td style={styles.td}>{r.decision?.type || "—"}</td>
                    <td style={styles.td}>
                      <span style={styles.outcomeBadge(r.decision?.outcome)}>
                        {r.decision?.outcome || "—"}
                      </span>
                    </td>
                    <td style={styles.td}>{r.decision?.jurisdiction || "—"}</td>
                    <td style={styles.td}>
                      {r.decision?.confidence ? `${(r.decision.confidence * 100).toFixed(0)}%` : "—"}
                    </td>
                    <td style={styles.td}>{formatDate(r.logged_at)}</td>
                    <td style={{ ...styles.td, ...styles.hashText }}>
                      {r.audit_id?.slice(0, 12)}...
                    </td>
                    <td style={styles.td}>
                      <button style={{ ...styles.btn, padding: "4px 12px", fontSize: "12px" }}
                        onClick={e => { e.stopPropagation(); setSelected(r); }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.pager}>
              <span>Showing {offset + 1}–{Math.min(offset + limit, offset + decisions.length)} of {summary?.total_decisions || "?"} total</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={styles.btn} disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - limit))}>← Previous</button>
                <button style={styles.btn} disabled={decisions.length < limit}
                  onClick={() => setOffset(offset + limit)}>Next →</button>
              </div>
            </div>
          </>
        )}

        {/* Breakdown */}
        {summary?.breakdown?.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: creamDim, marginBottom: "1rem" }}>
              Breakdown by type & outcome
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1px", background: "rgba(240,235,224,0.1)", border: "1px solid rgba(240,235,224,0.1)" }}>
              {summary.breakdown.map((b, i) => (
                <div key={i} style={{ background: navyDark, padding: "1rem" }}>
                  <div style={{ fontSize: "12px", color: creamDim, marginBottom: "4px" }}>{b.type}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={styles.outcomeBadge(b.outcome)}>{b.outcome}</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: cream }}>{b.count}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: creamDim, marginTop: "4px" }}>{b.jurisdiction}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(240,235,224,0.1)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", fontSize: "13px", color: creamDim, marginTop: "2rem" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: cream }}>AIDAL.</span>
        <span>AI Decision Accountability Layer · {API}</span>
        <span>© 2026 AIDAL</span>
      </div>

      {/* Modal */}
      {selected && <DecisionModal record={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
