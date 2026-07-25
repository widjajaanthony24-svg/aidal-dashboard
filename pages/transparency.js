import { useState, useEffect } from "react";

const API = "https://aidal-production.up.railway.app";
const ANCHORS_REPO = "widjajaanthony24-svg/aidal-anchors";

// ── Palette — cream & black, same as the rest of the public pages ──────────
const pageBg   = "#FAF3EB";
const ink      = "#0A0A0A";
const creamDim = "#6B6560";
const panelBg  = "#F0E6D6";
const bgBorder = "#D8CFC4";
const textMuted = "#6B6560";
const accentColor = "#C8A96E";
const green = "#4CAF82";
const red   = "#E05252";

// Curated, static disclosure of AIDAL's own platform incidents — deliberately
// NOT pulled from the customer incident-reporting API, which stores private
// per-company AI incident reports. These are incidents about AIDAL's own
// infrastructure, the kind that belong on a page like this.
const PLATFORM_INCIDENTS = [
  {
    date: "2026-07-24",
    title: "GPG signing key rotated",
    severity: "resolved",
    body: "The original anchor-signing key existed only as a GitHub Actions secret, with no backup kept outside it. Secrets are write-only by design — once that was the only copy, it was unrecoverable, confirmed by direct search rather than assumed. A new key was generated, backed up in two independent locations, and rotated in. Anchors dated 2026-07-24 and earlier still verify against the archived old key; anchors from 2026-07-25 onward verify against the current one.",
  },
  {
    date: "2026-05-01 to 2026-05-03",
    title: "3 early anchor signatures don't verify",
    severity: "disclosed",
    body: "Found during testing, not by an external report. The signatures published for these 3 dates don't match their currently-published file contents. Every anchor from 2026-05-04 onward verifies correctly. 2026-04-30, the very first anchor, predates signing being implemented and has no signature at all.",
  },
  {
    date: "early operation",
    title: "Daily anchor job went silent for 11 days",
    severity: "resolved",
    body: "The anchor job originally ran as an in-process background thread inside the API server. It stopped running for 11 days without anyone noticing — an in-process thread dying is invisible from outside the process. It now runs on an external GitHub Actions cron instead, specifically because a failed scheduled run emails the repo owner automatically; a silently-dying thread does not.",
  },
];

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background: panelBg, border: `0.5px solid ${bgBorder}`, borderRadius: 8, padding: "1.5rem", flex: 1, minWidth: 180 }}>
      <div style={{ fontSize: "28px", fontWeight: 700, color: ink, letterSpacing: "-0.01em", fontFamily: "'Playfair Display', Georgia, serif" }}>
        {value}
      </div>
      <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginTop: "4px", fontWeight: 500 }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: "12px", color: creamDim, marginTop: "6px", lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

export default function Transparency() {
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(false);
  const [anchorDates, setAnchorDates] = useState(null);
  const [anchorError, setAnchorError] = useState(false);

  useEffect(() => {
    fetch(`${API}/public/transparency`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setStats)
      .catch(() => setStatsError(true));

    fetch(`https://api.github.com/repos/${ANCHORS_REPO}/contents/anchors`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(list => {
        const dates = list
          .map(f => f.name)
          .filter(n => n.endsWith(".json"))
          .map(n => n.replace(".json", ""))
          .sort();
        setAnchorDates(dates);
      })
      .catch(() => setAnchorError(true));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: pageBg, color: ink, fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.6, WebkitFontSmoothing: "antialiased" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #FAF3EB; }
        ::-webkit-scrollbar-thumb { background: #D8CFC4; border-radius: 3px; }
        .nav-link:hover { color: ${ink} !important; }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────────── */}
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
          <a href="/verify" className="nav-link" style={{ fontSize: "12px", color: ink, textDecoration: "none", letterSpacing: "0.06em" }}>
            Verify →
          </a>
          <a href="https://aidal-dashboard.vercel.app" className="nav-link" style={{ fontSize: "12px", color: ink, textDecoration: "none", letterSpacing: "0.06em" }}>
            Dashboard →
          </a>
          <a
            href="https://tryaidal.github.io/landing_page_aidal#get-key"
            className="nav-link"
            style={{ fontSize: "12px", color: "#FAF3EB", textDecoration: "none", background: "#0A0A0A", border: "none", padding: "5px 14px", borderRadius: 6, letterSpacing: "0.06em" }}
          >
            Get API Key
          </a>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "5rem 2rem 6rem" }}>

        <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: "1.25rem", fontWeight: 500 }}>
          Public Transparency
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(32px, 5.5vw, 48px)",
          fontWeight: 700,
          lineHeight: 1.15,
          color: ink,
          marginBottom: "1rem",
          letterSpacing: "-0.01em",
        }}>
          What AIDAL actually looks like<br />
          <span style={{ color: creamDim, fontWeight: 400 }}>from the outside.</span>
        </h1>

        <p style={{ fontSize: "15px", color: creamDim, lineHeight: 1.75, marginBottom: "3rem", maxWidth: 560 }}>
          Real, unpadded numbers — how much runs through the platform, whether the anchor system has actually held up, and every time it hasn't.
        </p>

        {/* ── Aggregate stats ──────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <StatCard
            label="Decisions logged"
            value={statsError ? "—" : stats ? stats.total_decisions.toLocaleString() : "…"}
            sub={statsError ? "Couldn't reach AIDAL's servers just now." : "Total across every account on the platform, including internal ones — see the note below."}
          />
          <StatCard
            label="Accounts"
            value={statsError ? "—" : stats ? stats.total_companies.toLocaleString() : "…"}
            sub="Aggregate count only — no per-account breakdown unless an account opts in to being named."
          />
        </div>

        <div style={{
          marginBottom: "3.5rem",
          padding: "1rem 1.25rem",
          background: "rgba(200,169,110,0.08)",
          border: `0.5px solid ${accentColor}`,
          borderRadius: 8,
          fontSize: "13px",
          color: creamDim,
          lineHeight: 1.75,
        }}>
          <strong style={{ color: ink }}>0 external customers as of 2026-07-25.</strong> Every account above —
          all {statsError ? "" : stats ? stats.total_companies : ""} of them, and all of the decision volume with
          them — is the founder's own test and development usage. No company outside AIDAL has signed up yet.
          Said plainly here instead of letting the raw numbers imply otherwise.
        </div>

        {/* ── Anchor history ───────────────────────────────────────────── */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: "1rem", fontWeight: 500 }}>
            Anchor system history
          </div>
          <div style={{ background: panelBg, border: `0.5px solid ${bgBorder}`, borderRadius: 8, padding: "1.5rem" }}>
            {anchorError ? (
              <div style={{ fontSize: "13px", color: creamDim }}>Couldn't reach the public anchor repository just now — check it directly at{" "}
                <a href={`https://github.com/${ANCHORS_REPO}`} target="_blank" rel="noreferrer" style={{ color: accentColor }}>github.com/{ANCHORS_REPO}</a>.
              </div>
            ) : !anchorDates ? (
              <div style={{ fontSize: "13px", color: creamDim }}>Loading…</div>
            ) : (
              <>
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: ink }}>{anchorDates.length}</div>
                    <div style={{ fontSize: "11px", color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Days anchored</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: ink }}>{anchorDates[0]} → {anchorDates[anchorDates.length - 1]}</div>
                    <div style={{ fontSize: "11px", color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Coverage — one file per calendar day, no gaps</div>
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: creamDim, lineHeight: 1.75, borderTop: `0.5px solid ${bgBorder}`, paddingTop: "1rem" }}>
                  <strong style={{ color: green }}>Verified clean:</strong> every anchor from <code>2026-05-04</code> onward — independently re-checked against the raw published files as part of the 2026-07-24 key rotation, not just assumed still valid.<br/>
                  <strong style={{ color: red }}>Known bad signatures:</strong> <code>2026-05-01</code>, <code>2026-05-02</code>, <code>2026-05-03</code> — see the incident log below.<br/>
                  <code>2026-04-30</code> predates signing entirely and has no signature to check.
                </div>
                <div style={{ fontSize: "12px", color: textMuted, marginTop: "1rem" }}>
                  Don't take our word for any of this —{" "}
                  <a href={`https://github.com/${ANCHORS_REPO}`} target="_blank" rel="noreferrer" style={{ color: accentColor }}>
                    clone the repo and check it yourself
                  </a>, offline, with <code>verify_offline.py</code>.
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Incident log ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: "1rem", fontWeight: 500 }}>
            Platform incident log
          </div>
          <p style={{ fontSize: "12px", color: textMuted, marginBottom: "1rem", lineHeight: 1.6 }}>
            Incidents about AIDAL's own infrastructure — not customers' private AI-incident reports, which stay confidential to the company that filed them.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: bgBorder, borderRadius: 8, overflow: "hidden" }}>
            {PLATFORM_INCIDENTS.map((inc) => (
              <div key={inc.title} style={{ background: panelBg, padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: ink }}>{inc.title}</span>
                  <span style={{ fontSize: "11px", color: textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{inc.date}</span>
                </div>
                <div style={{ fontSize: "13px", color: creamDim, lineHeight: 1.75 }}>{inc.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer note ──────────────────────────────────────────────── */}
        <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: `0.5px solid ${bgBorder}`, fontSize: "12px", color: textMuted, lineHeight: 1.75 }}>
          This page shows aggregate, platform-wide numbers only. It does not reveal any single company's volume, decisions, or incidents unless that company has separately and explicitly opted in to being named — nothing does that yet.
        </div>

        {/* ── Try to break this ────────────────────────────────────────── */}
        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: `0.5px solid ${bgBorder}`, fontSize: "12px", color: textMuted, lineHeight: 1.75 }}>
          Found a flaw in any of this?{" "}
          <a href="mailto:anthony@tryaidal.com?subject=Found%20a%20flaw%20in%20AIDAL" style={{ color: accentColor, textDecoration: "underline" }}>
            anthony@tryaidal.com
          </a>. We'll publish what you find.
        </div>
      </div>
    </div>
  );
}
