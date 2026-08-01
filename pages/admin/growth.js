import { useState, useEffect, useCallback } from "react";

const API = "https://aidal-production.up.railway.app";

// ══════════════════════════════════════════════════════════════════════════════
// Same design tokens as pages/index.js — Linear light, General Sans, indigo
// accent. Kept as a local copy rather than a shared import so this page has
// zero coupling to the customer-facing app's state/auth.
// ══════════════════════════════════════════════════════════════════════════════
const surface       = "#FFFFFF";
const surfaceAlt    = "#FAFAFA";
const surfaceSunken = "#F4F4F5";
const ink           = "#09090B";
const inkMuted      = "#71717A";
const inkSubtle     = "#A1A1AA";
const line          = "rgba(0,0,0,0.08)";
const lineSolid     = "#E4E4E7";
const greenVivid    = "#10B981";
const redVivid      = "#EF4444";
const green         = "#047857";
const red           = "#B91C1C";
const accentColor   = "#5E6AD2";
const accentSoft    = "#EEF0FB";
const radius   = 8;
const radiusLg = 12;
const shadowXs = "0 1px 2px 0 rgba(0,0,0,0.05)";
const shadowLg = "0 1px 2px 0 rgba(0,0,0,0.04), 0 16px 48px -12px rgba(0,0,0,0.12)";
const fontSans = "'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const fontMono = "'JetBrains Mono', SFMono-Regular, Consolas, monospace";

const STATUS_LABELS = {
  not_contacted: "Not contacted",
  contacted: "Contacted",
  replied: "Replied",
  call_booked: "Call booked",
  closed_won: "Closed — won",
  closed_lost: "Closed — lost",
};
const STATUS_ORDER = Object.keys(STATUS_LABELS);
const CONTENT_TYPE_LABELS = {
  regulation_mythbust: "Regulation myth-bust",
  honesty_post: "Honesty post",
  audit_teardown: "Audit-trail teardown",
  retro: "Retro",
};
const CONTENT_STATUS_LABELS = { idea: "Idea", drafted: "Drafted", published: "Published" };
const CATEGORY_LABELS = { create: "Create", publish: "Publish", measure: "Measure", decide: "Decide" };

function apiFetch(path, secret, opts = {}) {
  return fetch(`${API}${path}`, {
    ...opts,
    headers: { "X-Admin-Secret": secret, "Content-Type": "application/json", ...(opts.headers || {}) },
  }).then(async (r) => {
    if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      throw new Error(body.detail || `Request failed (${r.status})`);
    }
    return r.json();
  });
}

// ── Secret gate — completely separate from the customer API-key login flow.
function SecretGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    setChecking(true);
    setError("");
    try {
      await apiFetch("/admin/growth-summary", trimmed);
      sessionStorage.setItem("aidal_admin_secret", trimmed);
      onUnlock(trimmed);
    } catch (e) {
      setError("Not authorized. Check the secret and try again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: surface, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans }}>
      <div style={{ width: "100%", maxWidth: 360, padding: "2rem", border: `1px solid ${line}`, borderRadius: radiusLg, boxShadow: shadowLg }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: inkSubtle, fontFamily: fontMono, marginBottom: "0.75rem" }}>
          Founder-only
        </div>
        <h1 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "1.25rem", color: ink }}>Growth dashboard</h1>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Admin secret"
          autoFocus
          style={{
            width: "100%", padding: "10px 12px", fontFamily: fontMono, fontSize: "13px",
            border: `1px solid ${lineSolid}`, borderRadius: radius, outline: "none", marginBottom: "0.75rem", boxSizing: "border-box",
          }}
        />
        {error && <div style={{ fontSize: "12.5px", color: red, marginBottom: "0.75rem" }}>{error}</div>}
        <button
          onClick={submit}
          disabled={checking}
          style={{
            width: "100%", padding: "10px", background: ink, color: surface, border: "none",
            borderRadius: radius, fontFamily: fontSans, fontSize: "13.5px", fontWeight: 600,
            cursor: checking ? "default" : "pointer", opacity: checking ? 0.6 : 1,
          }}
        >
          {checking ? "Checking..." : "Unlock"}
        </button>
      </div>
    </div>
  );
}

// ── Small shared bits ─────────────────────────────────────────────────────────
function MetricCard({ label, value, sub }) {
  return (
    <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: radiusLg, padding: "1.1rem 1.25rem", boxShadow: shadowXs, flex: 1, minWidth: 150 }}>
      <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: inkSubtle, fontFamily: fontMono, marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: "26px", fontWeight: 600, color: ink, fontFamily: fontMono, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: "12px", color: inkMuted, marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px", fontFamily: fontSans, fontSize: "13.5px", fontWeight: 500,
        background: active ? ink : "transparent", color: active ? surface : inkMuted,
        border: `1px solid ${active ? ink : lineSolid}`, borderRadius: 999, cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function StatusPill({ status, map = STATUS_LABELS }) {
  const tone = status === "closed_won" ? greenVivid : status === "closed_lost" ? redVivid : accentColor;
  return (
    <span style={{
      fontFamily: fontMono, fontSize: "11px", padding: "3px 8px", borderRadius: 999,
      background: `${tone}18`, color: tone, whiteSpace: "nowrap",
    }}>
      {map[status] || status}
    </span>
  );
}

// ── Goals tab ──────────────────────────────────────────────────────────────────
function GoalsTab({ secret }) {
  const [goals, setGoals] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    apiFetch("/admin/goals", secret).then((d) => setGoals(d.goals)).catch((e) => setError(e.message));
  }, [secret]);
  useEffect(load, [load]);

  async function toggle(goal) {
    const next = goals.map((g) => (g.id === goal.id ? { ...g, done: !g.done } : g));
    setGoals(next);
    try {
      await apiFetch(`/admin/goals/${goal.id}?done=${!goal.done}`, secret, { method: "PATCH" });
    } catch (e) {
      setError(e.message);
      load();
    }
  }

  if (error) return <div style={{ color: red, fontSize: "13px" }}>{error}</div>;
  if (!goals) return <div style={{ color: inkMuted, fontSize: "13px" }}>Loading…</div>;

  const byWeek = {};
  goals.forEach((g) => { (byWeek[g.week] = byWeek[g.week] || []).push(g); });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {Object.keys(byWeek).sort().map((week) => {
        const items = byWeek[week];
        const done = items.filter((g) => g.done).length;
        return (
          <div key={week} style={{ background: surface, border: `1px solid ${line}`, borderRadius: radiusLg, overflow: "hidden", boxShadow: shadowXs }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 1.1rem", background: surfaceAlt, borderBottom: `1px solid ${line}` }}>
              <span style={{ fontWeight: 600, fontSize: "13.5px", color: ink }}>Week {week}</span>
              <span style={{ fontFamily: fontMono, fontSize: "12px", color: inkMuted }}>{done}/{items.length}</span>
            </div>
            <div>
              {items.map((g) => (
                <label key={g.id} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "0.7rem 1.1rem", borderBottom: `1px solid ${line}`, cursor: "pointer" }}>
                  <input type="checkbox" checked={g.done} onChange={() => toggle(g)} style={{ marginTop: "3px", accentColor }} />
                  <div>
                    <span style={{ fontFamily: fontMono, fontSize: "10px", color: inkSubtle, textTransform: "uppercase", marginRight: "8px" }}>{CATEGORY_LABELS[g.category] || g.category}</span>
                    <span style={{ fontSize: "13.5px", color: g.done ? inkMuted : ink, textDecoration: g.done ? "line-through" : "none" }}>{g.task}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Prospects tab ──────────────────────────────────────────────────────────────
function ProspectsTab({ secret }) {
  const [prospects, setProspects] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", title: "", company: "", email: "", linkedin_url: "", jurisdiction: "", research_notes: "" });
  const [lookupBusy, setLookupBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    apiFetch("/admin/prospects", secret).then((d) => setProspects(d.prospects)).catch((e) => setError(e.message));
  }, [secret]);
  useEffect(load, [load]);

  async function updateStatus(p, status) {
    setProspects(prospects.map((x) => (x.id === p.id ? { ...x, status } : x)));
    try {
      await apiFetch(`/admin/prospects/${p.id}`, secret, { method: "PATCH", body: JSON.stringify({ status }) });
    } catch (e) {
      setError(e.message);
      load();
    }
  }

  async function remove(p) {
    if (!confirm(`Remove ${p.name}?`)) return;
    try {
      await apiFetch(`/admin/prospects/${p.id}`, secret, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function lookupEmail() {
    if (!form.company || !form.name) return;
    const domain = form.company.toLowerCase().replace(/[^a-z0-9.]/g, "") + ".com";
    const [first, ...rest] = form.name.trim().split(" ");
    setLookupBusy(true);
    try {
      const result = await apiFetch(
        `/admin/prospects/lookup-email?domain=${encodeURIComponent(domain)}&first_name=${encodeURIComponent(first)}&last_name=${encodeURIComponent(rest.join(" "))}`,
        secret
      );
      if (result.email) setForm((f) => ({ ...f, email: result.email }));
      else setError(`No email found for domain "${domain}" — check the company's actual domain and enter it manually.`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLookupBusy(false);
    }
  }

  async function submit() {
    if (!form.name || !form.company) return;
    setSaving(true);
    try {
      await apiFetch("/admin/prospects", secret, { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", title: "", company: "", email: "", linkedin_url: "", jurisdiction: "", research_notes: "" });
      setShowForm(false);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = { width: "100%", padding: "7px 10px", fontFamily: fontSans, fontSize: "13px", border: `1px solid ${lineSolid}`, borderRadius: radius, outline: "none", boxSizing: "border-box" };

  if (error) return <div style={{ color: red, fontSize: "13px", marginBottom: "1rem" }}>{error}</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontSize: "13px", color: inkMuted }}>{prospects ? `${prospects.length} prospect${prospects.length === 1 ? "" : "s"}` : "Loading…"}</span>
        <button onClick={() => setShowForm((s) => !s)} style={{ padding: "6px 12px", background: showForm ? surfaceSunken : ink, color: showForm ? ink : surface, border: "none", borderRadius: radius, fontFamily: fontSans, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          {showForm ? "Cancel" : "+ Add prospect"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: surfaceAlt, border: `1px solid ${line}`, borderRadius: radiusLg, padding: "1rem", marginBottom: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          <input style={inputStyle} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input style={inputStyle} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input style={inputStyle} placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <input style={inputStyle} placeholder="Jurisdiction (e.g. Indonesia — OJK)" value={form.jurisdiction} onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })} />
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <input style={inputStyle} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <button onClick={lookupEmail} disabled={lookupBusy} type="button" style={{ padding: "0 10px", background: accentSoft, color: accentColor, border: "none", borderRadius: radius, fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              {lookupBusy ? "…" : "Find via Hunter"}
            </button>
          </div>
          <input style={inputStyle} placeholder="LinkedIn URL" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
          <textarea style={{ ...inputStyle, gridColumn: "1 / -1", minHeight: 60, fontFamily: fontSans }} placeholder="Research notes — what you actually found about them" value={form.research_notes} onChange={(e) => setForm({ ...form, research_notes: e.target.value })} />
          <button onClick={submit} disabled={saving} style={{ gridColumn: "1 / -1", padding: "9px", background: ink, color: surface, border: "none", borderRadius: radius, fontFamily: fontSans, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            {saving ? "Saving…" : "Save prospect"}
          </button>
        </div>
      )}

      {prospects && prospects.map((p) => (
        <div key={p.id} style={{ background: surface, border: `1px solid ${line}`, borderRadius: radiusLg, padding: "1rem 1.1rem", marginBottom: "0.6rem", boxShadow: shadowXs }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: ink }}>{p.name} <span style={{ fontWeight: 400, color: inkMuted }}>— {p.title || "—"}</span></div>
              <div style={{ fontSize: "12.5px", color: inkMuted, marginTop: "2px" }}>{p.company}{p.jurisdiction ? ` · ${p.jurisdiction}` : ""}</div>
              {p.email && <div style={{ fontFamily: fontMono, fontSize: "11.5px", color: inkSubtle, marginTop: "3px" }}>{p.email}</div>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <select value={p.status} onChange={(e) => updateStatus(p, e.target.value)} style={{ fontFamily: fontSans, fontSize: "12px", padding: "5px 8px", borderRadius: radius, border: `1px solid ${lineSolid}` }}>
                {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <button onClick={() => remove(p)} title="Remove" style={{ background: "none", border: "none", color: inkSubtle, cursor: "pointer", fontSize: "16px", padding: "0 4px" }}>×</button>
            </div>
          </div>
          {p.research_notes && <div style={{ fontSize: "12.5px", color: inkMuted, marginTop: "8px", lineHeight: 1.6, borderTop: `1px solid ${line}`, paddingTop: "8px" }}>{p.research_notes}</div>}
        </div>
      ))}
    </div>
  );
}

// ── Content tab ────────────────────────────────────────────────────────────────
function ContentTab({ secret }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content_type: "regulation_mythbust", planned_week: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    apiFetch("/admin/content", secret).then((d) => setItems(d.content_items)).catch((e) => setError(e.message));
  }, [secret]);
  useEffect(load, [load]);

  async function updateStatus(item, status) {
    setItems(items.map((x) => (x.id === item.id ? { ...x, status } : x)));
    try {
      await apiFetch(`/admin/content/${item.id}`, secret, { method: "PATCH", body: JSON.stringify({ status }) });
    } catch (e) {
      setError(e.message);
      load();
    }
  }

  async function remove(item) {
    if (!confirm(`Remove "${item.title}"?`)) return;
    try {
      await apiFetch(`/admin/content/${item.id}`, secret, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function submit() {
    if (!form.title) return;
    setSaving(true);
    try {
      await apiFetch("/admin/content", secret, {
        method: "POST",
        body: JSON.stringify({ ...form, planned_week: form.planned_week ? Number(form.planned_week) : null }),
      });
      setForm({ title: "", content_type: "regulation_mythbust", planned_week: "" });
      setShowForm(false);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = { padding: "7px 10px", fontFamily: fontSans, fontSize: "13px", border: `1px solid ${lineSolid}`, borderRadius: radius, outline: "none" };

  if (error) return <div style={{ color: red, fontSize: "13px" }}>{error}</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontSize: "13px", color: inkMuted }}>{items ? `${items.length} post${items.length === 1 ? "" : "s"}` : "Loading…"}</span>
        <button onClick={() => setShowForm((s) => !s)} style={{ padding: "6px 12px", background: showForm ? surfaceSunken : ink, color: showForm ? ink : surface, border: "none", borderRadius: radius, fontFamily: fontSans, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          {showForm ? "Cancel" : "+ Add post idea"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: surfaceAlt, border: `1px solid ${line}`, borderRadius: radiusLg, padding: "1rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <input style={inputStyle} placeholder="Post title / idea" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <select style={{ ...inputStyle, flex: 1 }} value={form.content_type} onChange={(e) => setForm({ ...form, content_type: e.target.value })}>
              {Object.entries(CONTENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input style={{ ...inputStyle, width: 100 }} placeholder="Week" type="number" min="1" max="4" value={form.planned_week} onChange={(e) => setForm({ ...form, planned_week: e.target.value })} />
          </div>
          <button onClick={submit} disabled={saving} style={{ padding: "9px", background: ink, color: surface, border: "none", borderRadius: radius, fontFamily: fontSans, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}

      {items && items.map((item) => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: surface, border: `1px solid ${line}`, borderRadius: radiusLg, padding: "0.8rem 1.1rem", marginBottom: "0.5rem", boxShadow: shadowXs, gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "13.5px", fontWeight: 500, color: ink }}>{item.title}</div>
            <div style={{ fontSize: "11.5px", color: inkMuted, marginTop: "2px" }}>
              {CONTENT_TYPE_LABELS[item.content_type] || item.content_type}{item.planned_week ? ` · Week ${item.planned_week}` : ""}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <select value={item.status} onChange={(e) => updateStatus(item, e.target.value)} style={{ fontFamily: fontSans, fontSize: "12px", padding: "5px 8px", borderRadius: radius, border: `1px solid ${lineSolid}` }}>
              {Object.entries(CONTENT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <button onClick={() => remove(item)} title="Remove" style={{ background: "none", border: "none", color: inkSubtle, cursor: "pointer", fontSize: "16px", padding: "0 4px" }}>×</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function GrowthDashboard() {
  const [secret, setSecret] = useState(null);
  const [tab, setTab] = useState("goals");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" && sessionStorage.getItem("aidal_admin_secret");
    if (stored) setSecret(stored);
  }, []);

  const loadSummary = useCallback(() => {
    if (!secret) return;
    apiFetch("/admin/growth-summary", secret).then(setSummary).catch(() => {});
  }, [secret]);
  useEffect(loadSummary, [loadSummary, tab]);

  if (!secret) return <SecretGate onUnlock={setSecret} />;

  return (
    <div style={{ minHeight: "100vh", background: surfaceAlt, fontFamily: fontSans, color: ink }}>
      <style>{`* { box-sizing: border-box; } body { margin: 0; }`}</style>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: inkSubtle, fontFamily: fontMono }}>Founder-only</div>
            <h1 style={{ fontSize: "22px", fontWeight: 600, margin: "2px 0 0" }}>Growth dashboard</h1>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem("aidal_admin_secret"); setSecret(null); }}
            style={{ fontSize: "12.5px", color: red, background: "none", border: "none", cursor: "pointer" }}
          >
            Lock
          </button>
        </div>

        {summary && (
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <MetricCard label="Prospects contacted" value={summary.prospects.contacted} sub={`of ${summary.prospects.total} total`} />
            <MetricCard label="Reply rate" value={summary.prospects.reply_rate_pct != null ? `${summary.prospects.reply_rate_pct}%` : "—"} sub={`${summary.prospects.replied} replied`} />
            <MetricCard label="Content published" value={summary.content.published} sub={`of ${summary.content.total} planned`} />
            <MetricCard
              label="This week's goals"
              value={summary.goals_by_week["1"] ? `${summary.goals_by_week["1"].done}/${summary.goals_by_week["1"].total}` : "—"}
              sub="Week 1"
            />
          </div>
        )}

        {summary && Object.keys(summary.by_jurisdiction).length > 0 && (
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: radiusLg, padding: "1rem 1.1rem", marginBottom: "1.5rem", boxShadow: shadowXs }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: inkSubtle, fontFamily: fontMono, marginBottom: "8px" }}>Response rate by jurisdiction</div>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {Object.entries(summary.by_jurisdiction).map(([j, v]) => (
                <div key={j} style={{ fontSize: "13px" }}>
                  <span style={{ color: ink, fontWeight: 500 }}>{j}</span>{" "}
                  <span style={{ color: inkMuted, fontFamily: fontMono, fontSize: "12px" }}>{v.replied}/{v.contacted} replied</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <TabButton active={tab === "goals"} onClick={() => setTab("goals")}>30-day plan</TabButton>
          <TabButton active={tab === "prospects"} onClick={() => setTab("prospects")}>Prospects</TabButton>
          <TabButton active={tab === "content"} onClick={() => setTab("content")}>Content</TabButton>
        </div>

        {tab === "goals" && <GoalsTab secret={secret} />}
        {tab === "prospects" && <ProspectsTab secret={secret} />}
        {tab === "content" && <ContentTab secret={secret} />}
      </div>
    </div>
  );
}
