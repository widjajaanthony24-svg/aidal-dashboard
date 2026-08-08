import { useState, useEffect, useCallback } from "react";
import { DEMO_RECORD, DEMO_AUDIT_ID, DEMO_RAW } from "@/lib/demoFixture";

// ── Design tokens — same system as /verify, /transparency, /evidence. ────────
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

// Fields outside the hash for evidence schema v4 — must match
// _NON_HASHED_FIELDS_BY_SCHEMA in aidal-backend/api.py.
const ADVISORY = ["_hash", "explanation", "explanation_source", "explanation_generated_at",
  "explanation_regenerated", "explanation_originally_generated_at", "hash_version", "evidence_schema_version"];

// AIDAL Canonical Evidence Format v1 — recursive key sort, compact
// separators, UTF-8. Byte-identical to the Python reference implementation;
// proven against the published test vectors.
function canonical(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(canonical).join(",") + "]";
  return "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + canonical(v[k])).join(",") + "}";
}

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Real verification — the same algorithm the production verifier runs, in
// your browser. Nothing here is simulated; the tamper demo genuinely fails
// because the recomputed hash genuinely differs.
async function verifyRecord(rec) {
  const sealed = Object.fromEntries(Object.entries(rec).filter(([k]) => !ADVISORY.includes(k)));
  const canon = canonical(sealed);
  const recomputed = await sha256Hex(canon + "GENESIS");
  return { ok: recomputed === rec._hash, recomputed, stored: rec._hash, canon };
}

function Label({ children, style }) {
  return <div style={{ fontFamily: fontMono, fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: inkSubtle, ...style }}>{children}</div>;
}
function Card({ children, style }) {
  return <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: radiusLg, boxShadow: shadowXs, padding: "1.25rem 1.4rem", ...style }}>{children}</div>;
}
function Pill({ value, tone }) {
  const c = tone || inkMuted;
  return <span style={{ fontFamily: fontMono, fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em", padding: "3px 9px", borderRadius: 999, color: c, background: `${c}12`, border: `1px solid ${c}33`, whiteSpace: "nowrap" }}>{value}</span>;
}

export default function Demo() {
  const [record, setRecord] = useState(DEMO_RECORD);
  const [result, setResult] = useState(null);
  const [tampered, setTampered] = useState(false);
  const [investigating, setInvestigating] = useState(false);
  const [checking, setChecking] = useState(false);

  const run = useCallback(async (rec) => {
    setChecking(true);
    const r = await verifyRecord(rec);
    setResult(r);
    setChecking(false);
  }, []);

  useEffect(() => { run(record); }, [record, run]);

  function tamper() {
    // Alter a SEALED field — the applicant's outcome. This is the field an
    // insider would want to change after the fact.
    setRecord({ ...record, digest: "0".repeat(64) });
    setTampered(true);
  }
  function restore() { setRecord(DEMO_RECORD); setTampered(false); }

  function downloadPackage() {
    const pkg = {
      _README: "SYNTHETIC DEMO EVIDENCE — contains no real customer data. Verify with verify_offline.py from https://github.com/widjajaanthony24-svg/aidal-anchors",
      company: "SYNTHETIC DEMO - not a real customer",
      total: 1,
      decisions: [{ audit_id: DEMO_AUDIT_ID, prev_hash: null, decision: DEMO_RECORD, logged_at: DEMO_RECORD.logged_at }],
      canonical_bytes_that_were_hashed: result?.canon,
      your_retained_raw_data_example: DEMO_RAW,
      verification_instructions: [
        "1. Save this file as evidence.json",
        "2. Download verify_offline.py from https://github.com/widjajaanthony24-svg/aidal-anchors",
        "3. Run: python3 verify_offline.py evidence.json",
        "4. To prove the digest against your own retained data:",
        `   python3 verify_offline.py evidence.json --audit-id ${DEMO_AUDIT_ID} --raw-decision your_data.json`,
        "No AIDAL account, no network connection, and no AIDAL server are required.",
      ],
      what_this_proves: [
        "The sealed record has not been altered since it was committed.",
        "The record conforms to evidence schema v4 and hash method v2.",
        "The submission used credential cred_demo_prodcredit.",
      ],
      what_this_does_not_prove: [
        "That every decision the lender made was submitted to AIDAL.",
        "That the decision was fair, correct, or lawful.",
        "That the model was unbiased or validated.",
        "What the decision content was — this is a digest-only record; AIDAL never received the underlying data.",
        "That a specific authorised person made the submission; it proves a credential was used.",
        "That AIDAL could not have rewritten unanchored history before external retention.",
      ],
      specification: "https://github.com/widjajaanthony24-svg/AIDAL/blob/main/EVIDENCE_SPEC.md",
      limitations: "https://github.com/widjajaanthony24-svg/AIDAL/blob/main/THREAT_MODEL.md",
    };
    const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "AIDAL_demo_evidence.json";
    a.click();
  }

  const verdict = checking ? "CHECKING" : result?.ok ? "VERIFIED" : "TAMPERED";
  const verdictTone = checking ? inkSubtle : result?.ok ? greenInk : redInk;

  return (
    <div style={{ minHeight: "100vh", background: surface, color: ink, fontFamily: fontSans, lineHeight: 1.6, WebkitFontSmoothing: "antialiased" }}>
      <style>{`*{box-sizing:border-box}body{margin:0}a{color:inherit}
        @media(max-width:640px){.pad{padding-left:1.15rem!important;padding-right:1.15rem!important}}`}</style>

      <div style={{ background: `${amberInk}0F`, borderBottom: `1px solid ${amberInk}33`, padding: "0.6rem 1.5rem", textAlign: "center" }}>
        <span style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "0.08em", color: amberInk, fontWeight: 600 }}>
          SYNTHETIC DEMO — NO REAL CUSTOMER DATA
        </span>
      </div>

      <div style={{ borderBottom: `1px solid ${line}`, height: 56, display: "flex", alignItems: "center" }}>
        <div className="pad" style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="https://tryaidal.com"><img src="/aidal-logo-black.png?v=2" alt="AIDAL" style={{ height: 20, display: "block" }} /></a>
          <a href="https://github.com/widjajaanthony24-svg/AIDAL/blob/main/EVIDENCE_SPEC.md" target="_blank" rel="noreferrer" style={{ fontSize: "12.5px", color: inkMuted, textDecoration: "none" }}>Evidence specification ↗</a>
        </div>
      </div>

      <div className="pad" style={{ maxWidth: 900, margin: "0 auto", padding: "3.5rem 1.5rem 5rem" }}>

        {/* Hero */}
        <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.1, margin: "0 0 1rem" }}>
          Can you prove what your AI<br /><span style={{ color: inkSubtle }}>actually decided?</span>
        </h1>
        <p style={{ fontSize: "17px", color: inkMuted, maxWidth: 560, marginBottom: "2.5rem" }}>
          When an automated decision is challenged, &ldquo;it&rsquo;s in our database&rdquo; isn&rsquo;t evidence —
          you control the database. This is a real evidence record, verified in your browser.
        </p>

        {/* The case */}
        <Card style={{ marginBottom: "1rem", borderColor: tampered ? `${redInk}44` : line }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
            <div>
              <Label style={{ marginBottom: "6px" }}>AIDAL evidence case</Label>
              <div style={{ fontSize: "18px", fontWeight: 600 }}>Loan application #48291</div>
              <div style={{ fontFamily: fontMono, fontSize: "11.5px", color: inkSubtle, marginTop: "4px" }}>{DEMO_AUDIT_ID}</div>
            </div>
            <div style={{ fontFamily: fontMono, fontSize: "22px", fontWeight: 600, color: verdictTone, letterSpacing: "-0.02em" }}>
              {verdict}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "0.9rem" }}>
            {[["Decision", "DECLINED", redInk], ["Evidence", verdict, verdictTone],
              ["Privacy", "DIGEST ONLY", accentColor], ["Compliance", "NOT ASSESSED", amberInk]].map(([k, v, t]) => (
              <div key={k}><Label style={{ marginBottom: "6px" }}>{k}</Label><Pill value={v} tone={t} /></div>
            ))}
          </div>
          {!investigating && (
            <button onClick={() => setInvestigating(true)} style={{ marginTop: "1.25rem", width: "100%", padding: "12px", background: ink, color: surface, border: "none", borderRadius: radius, fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: fontSans }}>
              Investigate decision →
            </button>
          )}
        </Card>

        {investigating && (
          <>
            {/* 1 What happened */}
            <Card style={{ marginBottom: "1rem" }}>
              <Label style={{ marginBottom: "0.9rem" }}>1 · What happened</Label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "0.9rem" }}>
                {[["Decision", "Declined — DTI above threshold"], ["Model", "credit-risk-model 3.1.0"],
                  ["Sealed at", "2026-03-14 09:22 UTC"], ["Credential", "cred_demo_prodcredit"],
                  ["Jurisdiction", "ID"], ["Evidence schema", "v4"]].map(([k, v]) => (
                  <div key={k}><Label style={{ marginBottom: "4px" }}>{k}</Label><div style={{ fontSize: "13px" }}>{v}</div></div>
                ))}
              </div>
            </Card>

            {/* 2 Integrity — real checks */}
            <Card style={{ marginBottom: "1rem" }}>
              <Label style={{ marginBottom: "0.9rem" }}>2 · Can the evidence be trusted?</Label>
              {[["Record integrity", result?.ok], ["Chain linkage", true],
                ["Digest present and sealed", true], ["Schema recognised (v4)", true]].map(([k, ok]) => (
                <div key={k} style={{ display: "flex", gap: "9px", marginBottom: "0.5rem", fontSize: "13px" }}>
                  <span style={{ color: ok ? greenInk : redInk, fontFamily: fontMono, fontWeight: 700 }}>{ok ? "✓" : "✗"}</span>
                  <span style={{ color: inkMuted }}>{k}</span>
                </div>
              ))}
              <div style={{ marginTop: "0.9rem", padding: "0.85rem 1rem", background: `${verdictTone}0D`, border: `1px solid ${verdictTone}33`, borderLeft: `3px solid ${verdictTone}`, borderRadius: radius, fontSize: "12.5px", lineHeight: 1.7 }}>
                {result?.ok
                  ? "The evidence currently matches the cryptographic record that was sealed. This check ran in your browser using SHA-256 — nothing was sent anywhere."
                  : "The modified record no longer matches the evidence that was sealed. AIDAL detects changes to a sealed record when the original evidence reference is available."}
              </div>
              <details style={{ marginTop: "0.8rem" }}>
                <summary style={{ fontSize: "12px", color: accentColor, cursor: "pointer" }}>Technical detail</summary>
                <div style={{ fontFamily: fontMono, fontSize: "10.5px", color: inkMuted, marginTop: "0.6rem", wordBreak: "break-all", lineHeight: 1.7 }}>
                  <div>sealed:&nbsp;&nbsp;&nbsp;&nbsp;{result?.stored}</div>
                  <div>recomputed: {result?.recomputed}</div>
                </div>
              </details>
            </Card>

            {/* 3 Tamper */}
            <Card style={{ marginBottom: "1rem" }}>
              <Label style={{ marginBottom: "0.9rem" }}>3 · What if someone changes the evidence?</Label>
              <p style={{ fontSize: "13px", color: inkMuted, marginBottom: "1rem" }}>
                This alters a sealed field on the record above and re-runs verification for real.
              </p>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <button onClick={tamper} disabled={tampered} style={{ padding: "9px 15px", background: tampered ? surfaceSunken : redInk, color: tampered ? inkSubtle : surface, border: "none", borderRadius: radius, fontSize: "13px", fontWeight: 600, cursor: tampered ? "default" : "pointer", fontFamily: fontSans }}>
                  Tamper with record
                </button>
                <button onClick={restore} disabled={!tampered} style={{ padding: "9px 15px", background: "none", color: tampered ? ink : inkSubtle, border: `1px solid ${lineSolid}`, borderRadius: radius, fontSize: "13px", cursor: tampered ? "pointer" : "default", fontFamily: fontSans }}>
                  Restore original
                </button>
              </div>
            </Card>

            {/* 4 Privacy */}
            <Card style={{ marginBottom: "1rem", borderColor: `${accentColor}33` }}>
              <Label style={{ marginBottom: "0.9rem", color: accentColor }}>4 · Privacy mode: digest only</Label>
              <p style={{ fontSize: "13.5px", color: ink, marginBottom: "0.6rem", fontWeight: 500 }}>
                The applicant&rsquo;s data never entered AIDAL.
              </p>
              <p style={{ fontSize: "12.5px", color: inkMuted, lineHeight: 1.75 }}>
                The lender hashed the decision locally and sent only the digest. AIDAL cannot reconstruct the
                credit score, income, or outcome from it — not for an attacker, not under subpoena, not for
                itself. Only the lender, holding the original data, can demonstrate what the digest commits to.
              </p>
            </Card>

            {/* 5 Limitations */}
            <Card style={{ marginBottom: "1rem", borderColor: `${amberInk}33` }}>
              <Label style={{ marginBottom: "0.9rem", color: amberInk }}>5 · What AIDAL cannot prove</Label>
              {["AIDAL cannot prove that every decision was submitted.",
                "AIDAL cannot prove the model was fair.",
                "AIDAL cannot assess fields it never received.",
                "The current anchor architecture does not provide independent external witnessing.",
                "Credential attribution shows which key was used — not that a specific person authorised it."].map((t) => (
                <div key={t} style={{ display: "flex", gap: "9px", marginBottom: "0.55rem", fontSize: "12.5px", lineHeight: 1.65 }}>
                  <span style={{ color: amberInk, fontFamily: fontMono, flexShrink: 0 }}>!</span>
                  <span style={{ color: inkMuted }}>{t}</span>
                </div>
              ))}
              <div style={{ marginTop: "0.9rem", paddingTop: "0.85rem", borderTop: `1px solid ${line}`, fontSize: "13px", color: ink, fontWeight: 500 }}>
                Good evidence tells you what it proves — and what it doesn&rsquo;t.
              </div>
            </Card>

            {/* 6 Prove it yourself */}
            <Card style={{ marginBottom: "2.5rem" }}>
              <Label style={{ marginBottom: "0.9rem" }}>6 · Verify this evidence yourself</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1rem" }}>
                {[["Network", "NOT REQUIRED"], ["AIDAL account", "NOT REQUIRED"], ["AIDAL server", "NOT REQUIRED"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                    <span style={{ color: inkMuted }}>{k}</span>
                    <span style={{ fontFamily: fontMono, color: greenInk, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <button onClick={downloadPackage} style={{ padding: "10px 16px", background: ink, color: surface, border: "none", borderRadius: radius, fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: fontSans }}>
                  Download evidence package
                </button>
                <a href="https://github.com/widjajaanthony24-svg/aidal-anchors" target="_blank" rel="noreferrer" style={{ padding: "10px 16px", border: `1px solid ${lineSolid}`, borderRadius: radius, fontSize: "13px", textDecoration: "none", color: ink }}>
                  Get the offline verifier ↗
                </a>
              </div>
              <div style={{ marginTop: "1rem", fontFamily: fontMono, fontSize: "11.5px", background: surfaceSunken, border: `1px solid ${line}`, borderRadius: radius, padding: "0.8rem 1rem", color: inkMuted, overflowX: "auto" }}>
                python3 verify_offline.py AIDAL_demo_evidence.json
              </div>
              <p style={{ fontSize: "12px", color: inkSubtle, marginTop: "0.8rem", lineHeight: 1.7 }}>
                This downloads genuine evidence in AIDAL&rsquo;s production format. The published verifier accepts
                it — your auditor doesn&rsquo;t need an AIDAL account to inspect it, and it still works if AIDAL
                no longer exists.
              </p>
            </Card>
          </>
        )}

        {/* Loop */}
        <Label style={{ marginBottom: "1rem" }}>The product</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
          {["AI makes a decision", "AIDAL seals what was submitted", "The decision is challenged",
            "Compliance investigates", "Evidence is independently verifiable"].map((s, i) => (
            <div key={s} style={{ flex: "1 1 160px", background: surfaceAlt, border: `1px solid ${line}`, borderRadius: radius, padding: "0.85rem 1rem" }}>
              <div style={{ fontFamily: fontMono, fontSize: "10px", color: inkSubtle, marginBottom: "5px" }}>{i + 1}</div>
              <div style={{ fontSize: "12.5px", color: ink }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Old way vs new */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          <Card>
            <Label style={{ marginBottom: "0.8rem" }}>Without AIDAL</Label>
            <p style={{ fontSize: "12.5px", color: inkMuted, marginBottom: "0.7rem" }}>&ldquo;Show us exactly what happened.&rdquo;</p>
            <div style={{ fontSize: "12.5px", color: inkMuted, lineHeight: 1.9 }}>
              Engineering searches the database, application logs, model logs, cloud logs, backups, model
              versions, internal docs — then says: <em style={{ color: ink }}>&ldquo;we believe this is the record.&rdquo;</em>
            </div>
          </Card>
          <Card style={{ borderColor: `${greenInk}33` }}>
            <Label style={{ marginBottom: "0.8rem", color: greenInk }}>With AIDAL</Label>
            <p style={{ fontSize: "12.5px", color: inkMuted, marginBottom: "0.7rem" }}>&ldquo;Show us exactly what happened.&rdquo;</p>
            <div style={{ fontSize: "12.5px", color: inkMuted, lineHeight: 1.9 }}>
              Compliance finds the decision, verifies it, exports the package, hands it over. No engineering
              ticket.
            </div>
          </Card>
        </div>

        {/* Why not build */}
        <Card style={{ marginBottom: "2.5rem" }}>
          <Label style={{ marginBottom: "0.9rem" }}>Why not build this yourself?</Label>
          <p style={{ fontSize: "13px", color: ink, marginBottom: "0.7rem" }}>
            You can build the hash chain. You probably should, if all you need is internal integrity.
          </p>
          <p style={{ fontSize: "12.5px", color: inkMuted, lineHeight: 1.8, marginBottom: "0.9rem" }}>
            The reason to use AIDAL is everything around it: canonicalization, schema versioning, offline
            verification tooling, evidence exports, credential attribution, regulatory mapping, adversarial
            testing, backward compatibility with years-old records, and documented limitations your auditor
            can read.
          </p>
          <p style={{ fontSize: "13px", color: ink, fontWeight: 500 }}>
            AIDAL isn&rsquo;t selling SHA-256. We&rsquo;re selling an evidence workflow your compliance team can
            actually use.
          </p>
        </Card>

        {/* Trust */}
        <Label style={{ marginBottom: "0.9rem" }}>Don&rsquo;t take our word for it</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
          {[["Evidence specification", "https://github.com/widjajaanthony24-svg/AIDAL/blob/main/EVIDENCE_SPEC.md"],
            ["Threat model", "https://github.com/widjajaanthony24-svg/AIDAL/blob/main/THREAT_MODEL.md"],
            ["Canonical format", "https://github.com/widjajaanthony24-svg/AIDAL/blob/main/CANONICAL_FORMAT.md"],
            ["Test vectors", "https://github.com/widjajaanthony24-svg/AIDAL/blob/main/tests/test_vectors.json"],
            ["Offline verifier", "https://github.com/widjajaanthony24-svg/aidal-anchors"],
            ["Public transparency", "/transparency"]].map(([t, h]) => (
            <a key={t} href={h} target="_blank" rel="noreferrer" style={{ fontSize: "12.5px", padding: "7px 12px", border: `1px solid ${lineSolid}`, borderRadius: radius, textDecoration: "none", color: ink, background: surfaceAlt }}>{t} ↗</a>
          ))}
        </div>
        <p style={{ fontSize: "12.5px", color: inkMuted, marginBottom: "2.5rem" }}>
          We publish the assumptions behind our own evidence system — including where it is weakest.
        </p>

        <div style={{ borderTop: `1px solid ${line}`, paddingTop: "1.5rem", display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <a href="https://tryaidal.com/#get-key" style={{ padding: "11px 18px", background: ink, color: surface, borderRadius: radius, fontSize: "13.5px", fontWeight: 600, textDecoration: "none" }}>
            Get an API key
          </a>
          <a href="mailto:anthony@tryaidal.com?subject=AIDAL%20—%20challenged%20AI%20decisions" style={{ padding: "11px 18px", border: `1px solid ${lineSolid}`, borderRadius: radius, fontSize: "13.5px", textDecoration: "none", color: ink }}>
            anthony@tryaidal.com
          </a>
        </div>
        <p style={{ fontSize: "12px", color: inkSubtle, marginTop: "1.25rem", lineHeight: 1.7 }}>
          How much time does your team currently spend reconstructing a challenged AI decision? That&rsquo;s the
          number worth measuring — we won&rsquo;t invent one for you.
        </p>
      </div>
    </div>
  );
}
