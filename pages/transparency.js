import { useState, useEffect } from "react";

const API = "https://aidal-production.up.railway.app";
const ANCHORS_REPO = "widjajaanthony24-svg/aidal-anchors";

// ── Design tokens — Linear light, identical to /verify and the dashboard. ────
const surface       = "#FFFFFF";
const surfaceAlt    = "#FAFAFA";
const surfaceSunken = "#F4F4F5";
const ink           = "#09090B";
const inkMuted      = "#71717A";
const inkSubtle     = "#A1A1AA";
const line          = "rgba(0,0,0,0.08)";
const lineSolid     = "#E4E4E7";
const greenInk      = "#047857";
const redInk        = "#B91C1C";
const accentColor   = "#5E6AD2";

const radius   = 8;
const radiusLg = 12;
const shadowXs = "0 1px 2px 0 rgba(0,0,0,0.05)";

const fontSans = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const fontMono = "'JetBrains Mono', SFMono-Regular, Consolas, monospace";

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

// Uppercase mono eyebrow, same component as /verify.
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

// Severity chip: resolved reads green, disclosed-but-live reads amber.
function SeverityChip({ severity }) {
  const resolved = severity === "resolved";
  return (
    <span style={{
      fontFamily: fontMono,
      fontSize: "10px",
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      padding: "2px 8px",
      borderRadius: 999,
      color: resolved ? greenInk : "#B45309",
      background: resolved ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.10)",
      border: `1px solid ${resolved ? "rgba(16,185,129,0.22)" : "rgba(245,158,11,0.25)"}`,
      whiteSpace: "nowrap",
    }}>
      {severity}
    </span>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: surface, border: `1px solid ${line}`, borderRadius: radiusLg,
      padding: "1.25rem 1.375rem", flex: 1, minWidth: 200, boxShadow: shadowXs,
    }}>
      <div style={{
        fontSize: "28px", fontWeight: 500, color: ink, letterSpacing: "-0.03em",
        fontFamily: fontMono, fontVariantNumeric: "tabular-nums", lineHeight: 1.1,
      }}>
        {value}
      </div>
      <SectionLabel style={{ marginTop: "8px" }}>{label}</SectionLabel>
      {sub && <div style={{ fontSize: "12.5px", color: inkMuted, marginTop: "8px", lineHeight: 1.6 }}>{sub}</div>}
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

  const navLinkStyle = {
    fontSize: "13px", fontWeight: 500, color: inkMuted, textDecoration: "none",
    padding: "6px 10px", borderRadius: radius, transition: "background 0.15s ease, color 0.15s ease",
  };

  const codeStyle = {
    fontFamily: fontMono, fontSize: "11.5px", background: surfaceSunken,
    border: `1px solid ${line}`, borderRadius: 4, padding: "1px 5px", color: ink,
  };

  return (
    <div style={{ minHeight: "100vh", background: surface, color: ink, fontFamily: fontSans, fontSize: "13px", lineHeight: 1.6, letterSpacing: "-0.011em", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; }
        body { font-feature-settings: "cv02", "cv03", "cv04", "cv11"; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${lineSolid}; border-radius: 999px; border: 3px solid ${surface}; }
        .nav-link:hover { background: ${surfaceSunken}; color: ${ink} !important; }
        .nav-cta:hover { background: #27272A !important; }
        a { color: inherit; }
        @media (max-width: 560px) {
          .page-header { padding: 0 1rem !important; }
          .page-header-links { gap: 0.25rem !important; }
          .page-content { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
        }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────────── */}
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
          <a href="/verify" className="nav-link" style={navLinkStyle}>Verify</a>
          <a href="https://aidal-dashboard.vercel.app" className="nav-link" style={navLinkStyle}>Dashboard</a>
          <a
            href="https://tryaidal.com/#get-key"
            className="nav-cta"
            style={{
              fontSize: "13px", fontWeight: 500, color: surface, textDecoration: "none",
              background: ink, border: "1px solid rgba(255,255,255,0.08)", padding: "7px 14px",
              borderRadius: radius, boxShadow: shadowXs, marginLeft: "0.5rem",
              transition: "background 0.15s ease",
            }}
          >
            Get API key
          </a>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="page-content" style={{ maxWidth: 780, margin: "0 auto", padding: "4.5rem 2rem 5rem" }}>

        <SectionLabel style={{ marginBottom: "1.25rem" }}>Public transparency</SectionLabel>

        <h1 style={{
          fontFamily: fontSans,
          fontSize: "clamp(30px, 5vw, 46px)",
          fontWeight: 600,
          lineHeight: 1.1,
          color: ink,
          margin: "0 0 1rem",
          letterSpacing: "-0.035em",
        }}>
          What AIDAL actually looks like<br />
          <span style={{ color: inkSubtle }}>from the outside.</span>
        </h1>

        <p style={{ fontSize: "16px", color: inkMuted, lineHeight: 1.65, marginBottom: "2.5rem", maxWidth: 560 }}>
          Real, unpadded numbers — how much runs through the platform, whether the anchor system has actually held up, and every time it hasn&apos;t.
        </p>

        {/* ── Aggregate stats ──────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
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

        {/* The disclosure that matters most on this page — indigo rail so it
            reads as a deliberate statement rather than a warning. */}
        <div style={{
          marginBottom: "3rem",
          padding: "1rem 1.25rem",
          background: "rgba(94,106,210,0.05)",
          border: `1px solid rgba(94,106,210,0.20)`,
          borderLeft: `3px solid ${accentColor}`,
          borderRadius: radius,
          fontSize: "13px",
          color: inkMuted,
          lineHeight: 1.7,
        }}>
          <strong style={{ color: ink, fontWeight: 600 }}>0 external customers as of 2026-07-25.</strong> Every account above —
          all {statsError ? "" : stats ? stats.total_companies : ""} of them, and all of the decision volume with
          them — is the founder&apos;s own test and development usage. No company outside AIDAL has signed up yet.
          Said plainly here instead of letting the raw numbers imply otherwise.
        </div>

        {/* ── Anchor history ───────────────────────────────────────────── */}
        <div style={{ marginBottom: "3rem" }}>
          <SectionLabel style={{ marginBottom: "1rem" }}>Anchor system history</SectionLabel>
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: radiusLg, boxShadow: shadowXs, overflow: "hidden" }}>
            {anchorError ? (
              <div style={{ fontSize: "13px", color: inkMuted, padding: "1.25rem 1.5rem" }}>Couldn&apos;t reach the public anchor repository just now — check it directly at{" "}
                <a href={`https://github.com/${ANCHORS_REPO}`} target="_blank" rel="noreferrer" style={{ color: accentColor, fontFamily: fontMono, fontSize: "12px" }}>github.com/{ANCHORS_REPO}</a>.
              </div>
            ) : !anchorDates ? (
              <div style={{ fontSize: "13px", color: inkSubtle, fontFamily: fontMono, padding: "1.25rem 1.5rem" }}>Loading…</div>
            ) : (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", background: surfaceAlt, borderBottom: `1px solid ${line}` }}>
                  <div style={{ padding: "1rem 1.5rem", borderRight: `1px solid ${line}`, minWidth: 140 }}>
                    <div style={{ fontSize: "22px", fontWeight: 500, color: ink, fontFamily: fontMono, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{anchorDates.length}</div>
                    <SectionLabel style={{ marginTop: "6px" }}>Days anchored</SectionLabel>
                  </div>
                  <div style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: ink, fontFamily: fontMono, letterSpacing: "-0.01em" }}>{anchorDates[0]} → {anchorDates[anchorDates.length - 1]}</div>
                    <SectionLabel style={{ marginTop: "6px" }}>Coverage — one file per day, no gaps</SectionLabel>
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: inkMuted, lineHeight: 1.8, padding: "1.25rem 1.5rem" }}>
                  <strong style={{ color: greenInk, fontWeight: 600 }}>Verified clean:</strong> every anchor from <code style={codeStyle}>2026-05-04</code> onward — independently re-checked against the raw published files as part of the 2026-07-24 key rotation, not just assumed still valid.<br/>
                  <strong style={{ color: redInk, fontWeight: 600 }}>Known bad signatures:</strong> <code style={codeStyle}>2026-05-01</code>, <code style={codeStyle}>2026-05-02</code>, <code style={codeStyle}>2026-05-03</code> — see the incident log below.<br/>
                  <code style={codeStyle}>2026-04-30</code> predates signing entirely and has no signature to check.
                </div>
                <div style={{ fontSize: "12.5px", color: inkSubtle, padding: "0.875rem 1.5rem", borderTop: `1px solid ${line}`, background: surfaceAlt }}>
                  Don&apos;t take our word for any of this —{" "}
                  <a href={`https://github.com/${ANCHORS_REPO}`} target="_blank" rel="noreferrer" style={{ color: accentColor, textDecoration: "underline" }}>
                    clone the repo and check it yourself
                  </a>, offline, with <code style={codeStyle}>verify_offline.py</code>.
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Incident log ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: "3rem" }}>
          <SectionLabel style={{ marginBottom: "0.875rem" }}>Platform incident log</SectionLabel>
          <p style={{ fontSize: "12.5px", color: inkMuted, marginBottom: "1rem", lineHeight: 1.6 }}>
            Incidents about AIDAL&apos;s own infrastructure — not customers&apos; private AI-incident reports, which stay confidential to the company that filed them.
          </p>
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: radiusLg, boxShadow: shadowXs, overflow: "hidden" }}>
            {PLATFORM_INCIDENTS.map((inc, i) => (
              <div
                key={inc.title}
                style={{
                  padding: "1.125rem 1.5rem",
                  borderBottom: i !== PLATFORM_INCIDENTS.length - 1 ? `1px solid ${line}` : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: ink, letterSpacing: "-0.015em" }}>{inc.title}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <SeverityChip severity={inc.severity} />
                    <span style={{ fontSize: "11px", color: inkSubtle, fontFamily: fontMono }}>{inc.date}</span>
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: inkMuted, lineHeight: 1.7 }}>{inc.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer notes ─────────────────────────────────────────────── */}
        <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: `1px solid ${line}`, fontSize: "12px", color: inkSubtle, lineHeight: 1.7 }}>
          This page shows aggregate, platform-wide numbers only. It does not reveal any single company&apos;s volume, decisions, or incidents unless that company has separately and explicitly opted in to being named — nothing does that yet.
        </div>

        <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: `1px solid ${line}`, fontSize: "12px", color: inkSubtle, lineHeight: 1.7 }}>
          Found a flaw in any of this?{" "}
          <a href="mailto:anthony@tryaidal.com?subject=Found%20a%20flaw%20in%20AIDAL" style={{ color: accentColor, textDecoration: "underline" }}>
            anthony@tryaidal.com
          </a>. We&apos;ll publish what you find.
        </div>
      </div>
    </div>
  );
}
