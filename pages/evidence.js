import { useState, useEffect, useCallback } from "react";

const API = "https://aidal-production.up.railway.app";

// ── Design tokens — identical to /verify, /transparency, /regulations. ───────
const surface = "#FFFFFF";
const surfaceAlt = "#FAFAFA";
const surfaceSunken = "#F4F4F5";
const ink = "#09090B";
const inkMuted = "#71717A";
const inkSubtle = "#A1A1AA";
const line = "rgba(0,0,0,0.08)";
const lineSolid = "#E4E4E7";
const greenInk = "#047857";
const redInk = "#B91C1C";
const amberInk = "#B45309";
const accentColor = "#5E6AD2";
const radius = 8;
const radiusLg = 12;
const shadowXs = "0 1px 2px 0 rgba(0,0,0,0.05)";
const fontSans = "'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const fontMono = "'JetBrains Mono', SFMono-Regular, Consolas, monospace";

// Status → colour. Deliberately NOT a binary pass/fail: "not assessed" is
// amber, never red, because an unassessed record is not a failing record —
// conflating them is the single most misleading thing a compliance UI can do.
function toneFor(v) {
  const s = String(v || "").toUpperCase();
  if (["VERIFIED", "COMPLIANT", "ACTIVE", "MATCH", "VERIFIED_MATCH", "ANCHORED"].includes(s)) return greenInk;
  if (["FAILED", "TAMPERED", "BROKEN", "MISMATCH", "NON_COMPLIANT", "REVOKED"].includes(s)) return redInk;
  return amberInk;
}

function Pill({ value, small }) {
  const tone = toneFor(value);
  return (
    <span style={{
      fontFamily: fontMono, fontSize: small ? "10px" : "11px", fontWeight: 500,
      letterSpacing: "0.04em", padding: small ? "2px 6px" : "3px 9px", borderRadius: 999,
      color: tone, background: `${tone}12`, border: `1px solid ${tone}33`, whiteSpace: "nowrap",
    }}>
      {String(value || "—").replace(/_/g, " ")}
    </span>
  );
}

function Label({ children, style }) {
  return (
    <div style={{
      fontFamily: fontMono, fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em",
      textTransform: "uppercase", color: inkSubtle, ...style,
    }}>{children}</div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: surface, border: `1px solid ${line}`, borderRadius: radiusLg,
      boxShadow: shadowXs, padding: "1.25rem 1.4rem", ...style,
    }}>{children}</div>
  );
}

function apiGet(path, key) {
  return fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${key}` } })
    .then(async (r) => {
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail || `Request failed (${r.status})`);
      return r.json();
    });
}

// ── Key gate ────────────────────────────────────────────────────────────────
function KeyGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    const k = value.trim();
    if (!k) return;
    setBusy(true); setError("");
    try {
      await apiGet("/summary", k);
      sessionStorage.setItem("aidal_key", k);
      onUnlock(k);
    } catch { setError("That key wasn't accepted. Check it and try again."); }
    finally { setBusy(false); }
  }

  return (
    <div style={{ minHeight: "100vh", background: surface, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <Label style={{ marginBottom: "0.75rem" }}>AI Decision Evidence</Label>
        <h1 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 0.5rem", color: ink, letterSpacing: "-0.02em" }}>
          Open your evidence
        </h1>
        <p style={{ fontSize: "13.5px", color: inkMuted, lineHeight: 1.65, marginBottom: "1.5rem" }}>
          Paste your API key. It stays in this browser tab and is never written to disk.
        </p>
        <input
          type="password" value={value} autoFocus placeholder="aidal_live_..."
          onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
          style={{ width: "100%", padding: "10px 12px", fontFamily: fontMono, fontSize: "13px", border: `1px solid ${lineSolid}`, borderRadius: radius, outline: "none", marginBottom: "0.75rem", boxSizing: "border-box" }}
        />
        {error && <div style={{ fontSize: "12.5px", color: redInk, marginBottom: "0.75rem" }}>{error}</div>}
        <button onClick={submit} disabled={busy} style={{ width: "100%", padding: "10px", background: ink, color: surface, border: "none", borderRadius: radius, fontFamily: fontSans, fontSize: "13.5px", fontWeight: 600, cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1 }}>
          {busy ? "Checking…" : "Open evidence"}
        </button>
        <p style={{ fontSize: "12px", color: inkSubtle, marginTop: "1.25rem", lineHeight: 1.7 }}>
          No account? Anyone can verify a record without one at{" "}
          <a href="/verify" style={{ color: accentColor }}>/verify</a>.
        </p>
      </div>
    </div>
  );
}

// ── Auditor readiness — deliberately shows what is NOT in place ─────────────
function AuditorReadiness({ chain }) {
  const items = [
    { ok: true, text: "Evidence specification published", href: "https://github.com/widjajaanthony24-svg/AIDAL/blob/main/EVIDENCE_SPEC.md" },
    { ok: true, text: "Offline verifier published", href: "https://github.com/widjajaanthony24-svg/aidal-anchors" },
    { ok: true, text: "Cross-language test vectors published", href: "https://github.com/widjajaanthony24-svg/AIDAL/blob/main/tests/test_vectors.json" },
    { ok: true, text: "Threat model and limitations published", href: "https://github.com/widjajaanthony24-svg/AIDAL/blob/main/THREAT_MODEL.md" },
    { ok: chain && chain.status === "VERIFIED", text: chain ? `Chain integrity: ${chain.status}` : "Chain integrity: checking…" },
    { ok: true, text: "Evidence export available (works without AIDAL)" },
    { ok: true, text: "Privacy-preserving ingestion available" },
    { ok: false, text: "External witness for anchors — NOT configured. AIDAL currently controls its own anchor publishing credentials and signing key." },
    { ok: false, text: "Independent security attestation (SOC 2 / penetration test) — NOT available." },
    { ok: false, text: "Completeness of submission — NOT provable. AIDAL attests only to what it received." },
  ];
  return (
    <Card>
      <Label style={{ marginBottom: "0.9rem" }}>Auditor readiness</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {items.map((i) => (
          <div key={i.text} style={{ display: "flex", gap: "9px", alignItems: "flex-start", fontSize: "12.5px", lineHeight: 1.6 }}>
            <span style={{ color: i.ok ? greenInk : amberInk, fontWeight: 700, flexShrink: 0, fontFamily: fontMono }}>{i.ok ? "✓" : "!"}</span>
            <span style={{ color: i.ok ? inkMuted : ink }}>
              {i.href ? <a href={i.href} target="_blank" rel="noreferrer" style={{ color: accentColor }}>{i.text}</a> : i.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1rem", paddingTop: "0.9rem", borderTop: `1px solid ${line}`, fontSize: "12px", color: inkSubtle, lineHeight: 1.7 }}>
        AIDAL shows what your evidence can prove — and where it cannot. Items marked{" "}
        <strong style={{ color: amberInk }}>!</strong> are real gaps, not warnings to dismiss.
      </div>
    </Card>
  );
}

// ── Evidence case ───────────────────────────────────────────────────────────
function EvidenceCase({ auditId, apiKey, onBack }) {
  const [c, setCase] = useState(null);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    apiGet(`/evidence-case/${auditId}`, apiKey).then(setCase).catch((e) => setError(e.message));
  }, [auditId, apiKey]);

  async function exportPackage() {
    setExporting(true);
    try {
      const r = await fetch(`${API}/evidence-case/${auditId}/export`, { headers: { Authorization: `Bearer ${apiKey}` } });
      if (!r.ok) throw new Error("Export failed");
      const blob = await r.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `AIDAL_Evidence_Case_${auditId}.zip`;
      a.click();
    } catch (e) { setError(e.message); }
    finally { setExporting(false); }
  }

  if (error) return <div style={{ color: redInk, fontSize: "13px" }}>{error}</div>;
  if (!c) return <div style={{ color: inkSubtle, fontFamily: fontMono, fontSize: "13px" }}>Loading evidence case…</div>;

  const w = c.what_happened;
  const regenerated = c.explanation.provenance === "REGENERATED_AFTER_SEALING";

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: accentColor, fontSize: "13px", cursor: "pointer", padding: 0, marginBottom: "1.25rem" }}>
        ← All decisions
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <div>
          <Label style={{ marginBottom: "0.5rem" }}>Decision evidence case</Label>
          <div style={{ fontFamily: fontMono, fontSize: "15px", color: ink, marginBottom: "0.5rem" }}>{c.audit_id}</div>
          <Pill value={c.status.evidence_integrity === "VERIFIED" ? "EVIDENCE VERIFIED" : "EVIDENCE FAILED"} />
        </div>
        <button onClick={exportPackage} disabled={exporting} style={{ padding: "10px 16px", background: ink, color: surface, border: "none", borderRadius: radius, fontFamily: fontSans, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          {exporting ? "Preparing…" : "Export evidence package"}
        </button>
      </div>

      {/* 1. What happened */}
      <Card style={{ marginBottom: "1rem" }}>
        <Label style={{ marginBottom: "0.9rem" }}>1 · What happened</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.9rem" }}>
          {[
            ["Decision type", w.decision_type],
            ["Outcome", w.outcome ? JSON.stringify(w.outcome) : "Not disclosed to AIDAL (digest-only)"],
            ["Model", `${w.model_used || "—"} ${w.model_version || ""}`],
            ["Jurisdiction", w.jurisdiction || "not specified"],
            ["Sealed at", w.sealed_at],
            ["Evidence schema", w.evidence_schema_version],
          ].map(([k, v]) => (
            <div key={k}>
              <Label style={{ marginBottom: "4px" }}>{k}</Label>
              <div style={{ fontSize: "13px", color: ink, wordBreak: "break-word" }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Status — independent dimensions, never collapsed */}
      <Card style={{ marginBottom: "1rem" }}>
        <Label style={{ marginBottom: "0.9rem" }}>2 · Evidence status</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.9rem" }}>
          {Object.entries(c.status).filter(([k]) => k !== "anchor").map(([k, v]) => (
            <div key={k}>
              <Label style={{ marginBottom: "5px" }}>{k.replace(/_/g, " ")}</Label>
              <Pill value={v} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1rem", paddingTop: "0.9rem", borderTop: `1px solid ${line}`, fontSize: "12px", color: inkSubtle, lineHeight: 1.7 }}>
          These are independent dimensions, shown separately on purpose. A record can be integrity-verified while
          its compliance is unassessed — that is not a contradiction, and collapsing it into one status would be
          misleading in whichever direction it resolved.
        </div>
      </Card>

      {/* 3. Explanation provenance */}
      <Card style={{ marginBottom: "1rem", borderColor: regenerated ? `${amberInk}55` : line }}>
        <Label style={{ marginBottom: "0.9rem" }}>3 · Explanation provenance</Label>
        {regenerated && (
          <div style={{ background: `${amberInk}10`, border: `1px solid ${amberInk}33`, borderLeft: `3px solid ${amberInk}`, borderRadius: radius, padding: "0.85rem 1rem", marginBottom: "0.9rem", fontSize: "12.5px", color: ink, lineHeight: 1.7 }}>
            <strong>This explanation was generated after the decision was sealed.</strong> It is advisory and is not
            part of the sealed evidence. Sealed at {w.sealed_at} · explanation generated {c.explanation.generated_at}.
          </div>
        )}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.9rem", flexWrap: "wrap" }}>
          <Pill value={c.explanation.provenance} />
          <Pill value={c.explanation.source || "none"} />
        </div>
        <div style={{ fontSize: "13px", color: inkMuted, lineHeight: 1.75 }}>
          {c.explanation.text || <em>No explanation recorded for this decision.</em>}
        </div>
        <div style={{ marginTop: "0.9rem", paddingTop: "0.8rem", borderTop: `1px solid ${line}`, fontSize: "12px", color: inkSubtle, lineHeight: 1.7 }}>
          {c.explanation.note}
        </div>
      </Card>

      {/* 4. Compliance */}
      <Card style={{ marginBottom: "1rem" }}>
        <Label style={{ marginBottom: "0.9rem" }}>4 · Compliance assessment</Label>
        <div style={{ marginBottom: "0.9rem" }}><Pill value={c.compliance.status} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.9rem", marginBottom: "0.9rem" }}>
          <div><Label style={{ marginBottom: "4px" }}>Framework</Label><div style={{ fontSize: "12.5px", color: ink }}>{c.compliance.framework || "—"}</div></div>
          <div><Label style={{ marginBottom: "4px" }}>Regulator</Label><div style={{ fontSize: "12.5px", color: ink }}>{c.compliance.regulator || "—"}</div></div>
          <div><Label style={{ marginBottom: "4px" }}>Sealed evidence?</Label><div style={{ fontSize: "12.5px", color: ink }}>{c.compliance.is_sealed_evidence ? "Yes — inside the hash" : "No — advisory only"}</div></div>
        </div>
        {c.compliance.missing_required?.length > 0 && (
          <div style={{ fontSize: "12.5px", color: inkMuted, marginBottom: "0.75rem" }}>
            Fields unavailable to the assessment: <span style={{ fontFamily: fontMono }}>{c.compliance.missing_required.join(", ")}</span>
          </div>
        )}
        <div style={{ fontSize: "12px", color: inkSubtle, lineHeight: 1.7, paddingTop: "0.8rem", borderTop: `1px solid ${line}` }}>
          {c.compliance.note} Not assessed does not mean non-compliant — a digest-only record withholds the fields
          an assessment would need, by design.
        </div>
      </Card>

      {/* 5. Proves / does not prove */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
        <Card style={{ borderColor: `${greenInk}33` }}>
          <Label style={{ marginBottom: "0.9rem", color: greenInk }}>What this evidence proves</Label>
          {c.proves.map((p) => (
            <div key={p} style={{ display: "flex", gap: "9px", marginBottom: "0.6rem", fontSize: "12.5px", lineHeight: 1.65 }}>
              <span style={{ color: greenInk, fontFamily: fontMono, flexShrink: 0 }}>✓</span>
              <span style={{ color: inkMuted }}>{p}</span>
            </div>
          ))}
        </Card>
        <Card style={{ borderColor: `${amberInk}33` }}>
          <Label style={{ marginBottom: "0.9rem", color: amberInk }}>What this evidence does NOT prove</Label>
          {c.does_not_prove.map((p) => (
            <div key={p} style={{ display: "flex", gap: "9px", marginBottom: "0.6rem", fontSize: "12.5px", lineHeight: 1.65 }}>
              <span style={{ color: amberInk, fontFamily: fontMono, flexShrink: 0 }}>!</span>
              <span style={{ color: inkMuted }}>{p}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* 6. Anchor + offline verification */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
        <Card>
          <Label style={{ marginBottom: "0.9rem" }}>Anchor</Label>
          <div style={{ fontFamily: fontMono, fontSize: "12px", color: ink, marginBottom: "0.6rem" }}>{c.anchor.anchor_file}</div>
          {c.anchor.anchor_repository && (
            <a href={c.anchor.anchor_repository} target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: accentColor }}>
              Public anchor repository ↗
            </a>
          )}
          <div style={{ fontSize: "12px", color: inkSubtle, lineHeight: 1.7, marginTop: "0.8rem" }}>{c.anchor.note}</div>
        </Card>
        <Card>
          <Label style={{ marginBottom: "0.9rem" }}>Verify without AIDAL</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.9rem" }}>
            {[["Network required", "NO"], ["AIDAL account required", "NO"], ["AIDAL servers required", "NO"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                <span style={{ color: inkMuted }}>{k}</span>
                <span style={{ fontFamily: fontMono, color: greenInk, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "12px", color: inkSubtle, lineHeight: 1.7 }}>
            The exported package bundles the verifier itself. Run{" "}
            <code style={{ fontFamily: fontMono, background: surfaceSunken, padding: "1px 5px", borderRadius: 4 }}>python3 verify_offline.py evidence.json</code>{" "}
            — it works if AIDAL no longer exists.
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Overview + decision list ────────────────────────────────────────────────
export default function EvidenceDashboard() {
  const [apiKey, setApiKey] = useState(null);
  const [summary, setSummary] = useState(null);
  const [chain, setChain] = useState(null);
  const [decisions, setDecisions] = useState(null);
  const [openCase, setOpenCase] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const k = typeof window !== "undefined" && sessionStorage.getItem("aidal_key");
    if (k) setApiKey(k);
  }, []);

  const load = useCallback(() => {
    if (!apiKey) return;
    apiGet("/summary", apiKey).then(setSummary).catch((e) => setError(e.message));
    apiGet("/verify", apiKey).then(setChain).catch(() => {});
    apiGet("/decisions?limit=50", apiKey).then((d) => setDecisions(d.decisions)).catch(() => {});
  }, [apiKey]);
  useEffect(load, [load]);

  if (!apiKey) return <KeyGate onUnlock={setApiKey} />;

  return (
    <div style={{ minHeight: "100vh", background: surfaceAlt, fontFamily: fontSans, color: ink }}>
      <style>{`*{box-sizing:border-box}body{margin:0}a{color:inherit}`}</style>

      <div style={{ borderBottom: `1px solid ${line}`, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 1.5rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
            <a href="https://tryaidal.com"><img src="/aidal-logo-black.png?v=2" alt="AIDAL" style={{ height: 20, display: "block" }} /></a>
            <span style={{ fontSize: "13px", color: inkMuted }}>AI Decision Evidence</span>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <a href="/verify" style={{ fontSize: "12.5px", color: inkMuted, textDecoration: "none" }}>Public verify</a>
            <a href="https://github.com/widjajaanthony24-svg/AIDAL/blob/main/THREAT_MODEL.md" target="_blank" rel="noreferrer" style={{ fontSize: "12.5px", color: inkMuted, textDecoration: "none" }}>Trust center</a>
            <button onClick={() => { sessionStorage.removeItem("aidal_key"); setApiKey(null); }} style={{ fontSize: "12.5px", color: redInk, background: "none", border: "none", cursor: "pointer" }}>Lock</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {error && <div style={{ color: redInk, fontSize: "13px", marginBottom: "1rem" }}>{error}</div>}

        {openCase ? (
          <EvidenceCase auditId={openCase} apiKey={apiKey} onBack={() => setOpenCase(null)} />
        ) : (
          <>
            <h1 style={{ fontSize: "24px", fontWeight: 600, margin: "0 0 0.4rem", letterSpacing: "-0.02em" }}>
              If an auditor called right now, how prepared are you?
            </h1>
            <p style={{ fontSize: "14px", color: inkMuted, marginBottom: "1.75rem" }}>
              {summary ? `${summary.total_decisions ?? summary.total ?? "—"} decisions sealed` : "Loading…"}
              {chain && ` · chain ${chain.status}`}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <Card>
                <Label style={{ marginBottom: "8px" }}>Evidence integrity</Label>
                <div style={{ fontSize: "26px", fontFamily: fontMono, fontWeight: 600, color: chain ? toneFor(chain.status) : inkSubtle, letterSpacing: "-0.02em" }}>
                  {chain ? chain.status : "…"}
                </div>
                <div style={{ fontSize: "12px", color: inkMuted, marginTop: "6px" }}>
                  {chain ? `${chain.records_verified ?? 0} records walked` : "Verifying chain…"}
                </div>
              </Card>
              <Card>
                <Label style={{ marginBottom: "8px" }}>Decisions sealed</Label>
                <div style={{ fontSize: "26px", fontFamily: fontMono, fontWeight: 600, color: ink, letterSpacing: "-0.02em" }}>
                  {summary ? (summary.total_decisions ?? summary.total ?? "—") : "…"}
                </div>
                <div style={{ fontSize: "12px", color: inkMuted, marginTop: "6px" }}>Only what was submitted to AIDAL.</div>
              </Card>
              <Card>
                <Label style={{ marginBottom: "8px" }}>Independent verification</Label>
                <div style={{ fontSize: "26px", fontFamily: fontMono, fontWeight: 600, color: greenInk, letterSpacing: "-0.02em" }}>OFFLINE</div>
                <div style={{ fontSize: "12px", color: inkMuted, marginTop: "6px" }}>No account, no network, no AIDAL.</div>
              </Card>
            </div>

            <div style={{ marginBottom: "1.75rem" }}><AuditorReadiness chain={chain} /></div>

            <Label style={{ marginBottom: "0.875rem" }}>Decision evidence</Label>
            <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: radiusLg, boxShadow: shadowXs, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: 640 }}>
                  <thead>
                    <tr style={{ background: surfaceAlt }}>
                      {["Audit ID", "Sealed", "Type", "Jurisdiction", ""].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "0.7rem 1rem", fontFamily: fontMono, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: inkSubtle, fontWeight: 500, borderBottom: `1px solid ${line}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {!decisions && <tr><td colSpan={5} style={{ padding: "1.25rem 1rem", color: inkSubtle, fontFamily: fontMono }}>Loading…</td></tr>}
                    {decisions?.length === 0 && <tr><td colSpan={5} style={{ padding: "1.25rem 1rem", color: inkMuted }}>No decisions sealed yet.</td></tr>}
                    {decisions?.map((d) => (
                      <tr key={d.audit_id} style={{ borderBottom: `1px solid ${line}` }}>
                        <td style={{ padding: "0.7rem 1rem", fontFamily: fontMono, fontSize: "11.5px", color: ink }}>{d.audit_id}</td>
                        <td style={{ padding: "0.7rem 1rem", color: inkMuted, whiteSpace: "nowrap" }}>{String(d.logged_at).slice(0, 16)}</td>
                        <td style={{ padding: "0.7rem 1rem", color: ink }}>{d.decision_type}</td>
                        <td style={{ padding: "0.7rem 1rem", color: inkMuted }}>{d.jurisdiction || "—"}</td>
                        <td style={{ padding: "0.7rem 1rem", textAlign: "right" }}>
                          <button onClick={() => setOpenCase(d.audit_id)} style={{ padding: "5px 11px", background: ink, color: surface, border: "none", borderRadius: radius, fontFamily: fontSans, fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                            Investigate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
