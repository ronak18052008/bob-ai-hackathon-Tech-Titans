"""
MedSynapse AI — Section 23: Document Duplicate Detection Engine
Calculates SHA-256 file hashes and text similarity to detect duplicate uploads.
"""
import hashlib
from typing import Dict, Any, List

class DuplicateDetector:
    @staticmethod
    def compute_hash(content_bytes: bytes) -> str:
        return hashlib.sha256(content_bytes).hexdigest()

    @staticmethod
    def calculate_text_similarity(text1: str, text2: str) -> float:
        set1 = set(text1.lower().split())
        set2 = set(text2.lower().split())
        if not set1 or not set2:
            return 0.0
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        return intersection / union

    @classmethod
    def check_duplicate(
        cls,
        new_hash: str,
        new_text: str,
        existing_docs: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        for doc in existing_docs:
            if doc.get("file_hash") == new_hash:
                return {
                    "is_duplicate": True,
                    "duplicate_type": "EXACT_HASH_MATCH",
                    "existing_document_id": doc.get("id"),
                    "existing_document_title": doc.get("title"),
                    "confidence": 1.0,
                    "recommended_action": "Merge metadata or mark distinct",
                }
            # Semantic text overlap
            sim = cls.calculate_text_similarity(new_text, doc.get("raw_content", ""))
            if sim > 0.88:
                return {
                    "is_duplicate": True,
                    "duplicate_type": "NEAR_IDENTICAL_CONTENT",
                    "existing_document_id": doc.get("id"),
                    "existing_document_title": doc.get("title"),
                    "confidence": round(sim, 2),
                    "recommended_action": "Review prior version before ingesting",
                }

        return {
            "is_duplicate": False,
            "confidence": 0.0,
            "recommended_action": "Proceed with ingestion",
        }
