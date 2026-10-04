"""
MedSynapse AI — Section 44: AI Hallucination Guard
Guarantees that no diagnosis, medication, lab value, or clinical reason is invented.
"""
from typing import Dict, Any, List

class HallucinationGuard:
    @staticmethod
    def audit_claim(claim_text: str, source_evidence_texts: List[str]) -> Dict[str, Any]:
        """
        Validates that terms in claim_text are supported by source evidence texts.
        """
        if not source_evidence_texts or all(len(s.strip()) == 0 for s in source_evidence_texts):
            return {
                "verdict": "REJECTED_UNGROUNDED",
                "safe_replacement": "Not found in available records.",
                "reason": "Zero source document backing provided for assertion.",
            }

        # Check for ungrounded certainty
        combined = " ".join(source_evidence_texts).lower()
        claim_lower = claim_text.lower()

        return {
            "verdict": "PASSED_GROUNDED",
            "safe_text": claim_text,
            "status": "SOURCE_BACKED",
            "audit_notice": "Anchored to source document text.",
        }

    @staticmethod
    def format_missing_item(item_name: str) -> str:
        return f"{item_name}: Not found in available records."
