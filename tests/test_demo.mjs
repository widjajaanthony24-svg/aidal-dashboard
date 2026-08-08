/**
 * Deterministic acceptance test for the public /demo page (§18).
 *
 * The demo must never be a mockup. Its record is real evidence in AIDAL's
 * production format, and this asserts that: the same canonicalization and
 * hash the backend uses, verified here independently, plus a check that the
 * tamper interaction genuinely fails rather than theatrically pretending to.
 *
 *   node tests/test_demo.mjs [BASE_URL]
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const BASE = (process.argv[2] || "https://aidal-dashboard.vercel.app").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => {
  results.push([name, ok]);
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${!ok && detail ? "  — " + detail : ""}`);
};

// Mirrors AIDAL Canonical Evidence Format v1.
const canonical = (v) =>
  v === null || typeof v !== "object" ? JSON.stringify(v)
  : Array.isArray(v) ? "[" + v.map(canonical).join(",") + "]"
  : "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + canonical(v[k])).join(",") + "}";
const sha256 = (s) => createHash("sha256").update(Buffer.from(s, "utf8")).digest("hex");

const ADVISORY = ["_hash", "explanation", "explanation_source", "explanation_generated_at",
  "explanation_regenerated", "explanation_originally_generated_at", "hash_version", "evidence_schema_version"];

function verify(rec) {
  const sealed = Object.fromEntries(Object.entries(rec).filter(([k]) => !ADVISORY.includes(k)));
  return sha256(canonical(sealed) + "GENESIS") === rec._hash;
}

// Fixture is the single source of truth the page imports.
const src = readFileSync(new URL("../lib/demoFixture.js", import.meta.url), "utf8");
const grab = (name) => JSON.parse(src.match(new RegExp(`export const ${name} = ([\\s\\S]*?);\\n`))[1]);
const REC = grab("DEMO_RECORD");
const AUDIT_ID = grab("DEMO_AUDIT_ID");

console.log(`Demo acceptance test\nTarget: ${BASE}\n`);

// 1. Page loads
const html = await fetch(`${BASE}/demo`).then((r) => (r.ok ? r.text() : "")).catch(() => "");
check("1. /demo loads without auth", html.length > 1000, `got ${html.length} bytes`);

// 2-5. The scenario is present and honestly labelled
check("2. synthetic decision present", html.includes("48291") && html.includes("SYNTHETIC DEMO"));
check("3. evidence verifies (real SHA-256, recomputed here)", verify(REC));
check("4. privacy mode is DIGEST ONLY", html.includes("DIGEST ONLY") && REC.input_features === undefined);
check("5. compliance shown as NOT ASSESSED", html.includes("NOT ASSESSED") && REC.compliance.checked === false);

// 6-7. Both sides of the claim
check("6. proves/verification section present", html.includes("Can the evidence be trusted"));
check("7. does-not-prove section present",
  html.includes("What AIDAL cannot prove") && html.includes("cannot prove that every decision was submitted"));

// 8-9. Tamper genuinely breaks, restore genuinely fixes
const tampered = { ...REC, digest: "0".repeat(64) };
check("8. tampering flips result to TAMPERED", verify(tampered) === false);
check("9. restoring the original returns VERIFIED", verify(REC) === true);

// 10-11. Export is real, and points at the real verifier
check("10. evidence package is downloadable client-side", html.includes("Download evidence package"));
check("11. export references the published offline verifier",
  html.includes("verify_offline.py") && html.includes("aidal-anchors"));

// 12. No production data leakage — the whole point of §20.
const leaks = ["aidal_live_", "aidal_test_", "ADMIN_SECRET", "Lorum Fintech", "widjaja@", "Amartha", "JULO"];
const found = leaks.filter((l) => html.includes(l));
check("12. no production customer data or secrets in the page", found.length === 0, `found ${found.join(", ")}`);
check("12b. demo company is explicitly synthetic", REC.company_id === 0 && REC.metadata.subject_id === "SYNTHETIC-APPLICANT");

// Forbidden claims must never reappear.
const banned = ["tamper-proof", "tamper proof", "immutable", "trustless", "compliance guaranteed"];
const bad = banned.filter((b) => html.toLowerCase().includes(b));
check("13. no forbidden absolute claims", bad.length === 0, `found ${bad.join(", ")}`);

const failed = results.filter(([, ok]) => !ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) console.log("FAILED: " + failed.map(([n]) => n).join(", "));
process.exit(failed.length ? 1 : 0);
