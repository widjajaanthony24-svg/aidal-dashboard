export const DEMO_RECORD = {
  "company_id": 0,
  "decision_type": "loan_application",
  "model_used": "credit-risk-model",
  "model_version": "3.1.0",
  "digest": "66b829832c660011bed94c350f49ff1f430adc6efa9294cd436cd14e9096e0e3",
  "canonical_schema_version": "v1",
  "digest_verification": "client_asserted_unverifiable",
  "submitted_by_credential": "cred_demo_prodcredit",
  "jurisdiction": "ID",
  "metadata": {
    "application_ref": "48291",
    "subject_id": "SYNTHETIC-APPLICANT"
  },
  "compliance": {
    "checked": false,
    "jurisdiction": "ID",
    "message": "Not assessed - digest-only submission withheld the fields an assessment requires."
  },
  "logged_at": "2026-03-14T09:22:41+00:00",
  "_hash": "59465349a3512931dd1850e870e2b85bd952b131139e123132d952568eeffd0a",
  "hash_version": "v2",
  "evidence_schema_version": "v4",
  "explanation": "Application 48291 was declined. The debt-to-income ratio of 44% exceeded the configured threshold for this product. [AI-generated. Verify against source decision data before regulatory submission.]",
  "explanation_source": "llm",
  "explanation_generated_at": "2026-03-14T09:22:41+00:00",
  "explanation_regenerated": false
};
export const DEMO_AUDIT_ID = "aud_59465349a3512931dd1850e8";
export const DEMO_RAW = {
  "input_features": {
    "credit_score": 612,
    "income_annual": 38000,
    "dti_ratio_pct": 44
  },
  "output": {
    "approved": false,
    "reason_code": "DTI_ABOVE_THRESHOLD"
  }
};
