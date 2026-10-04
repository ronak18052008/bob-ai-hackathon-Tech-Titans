"""
MedSynapse AI — Comprehensive Automated Test Suite
Covers Unit & Integration tests specified in Section 86.
"""
import pytest
from fastapi.testclient import TestClient
from src.backend.main import app
from src.ocr.engine import OCREngine
from src.ocr.duplicate_detector import DuplicateDetector
from src.ai.hallucination_guard import HallucinationGuard
from src.ai.rag_pipeline import RAGPipeline

@pytest.fixture
def client():
    return TestClient(app)

# ==================== UNIT TESTS ====================

def test_ocr_classification():
    summary_text = "METRO HEART INSTITUTE\nDISCHARGE SUMMARY\nPatient: Rajesh Kumar\nLVEF: 42%"
    assert OCREngine.classify_document_type(summary_text) == "Discharge Summary"

    rx_text = "PRESCRIPTION\nRx: Tab Torsemide 20mg PO Sig: Once daily morning"
    assert OCREngine.classify_document_type(rx_text) == "Prescription"

    echo_text = "ECHOCARDIOGRAM REPORT\nLeft Ventricular Ejection Fraction 32%"
    assert OCREngine.classify_document_type(echo_text) == "Radiology"

def test_ocr_confidence_calculation():
    clean_text = "Normal clinical notes without artifacts."
    conf = OCREngine.calculate_confidence(clean_text)
    assert conf >= 0.95

def test_duplicate_detector():
    content = b"Patient Rajesh Kumar Discharge Summary Jan 2026"
    file_hash = DuplicateDetector.compute_hash(content)
    existing = [{"id": "doc-01", "file_hash": file_hash, "title": "Existing Doc", "raw_content": content.decode()}]

    res = DuplicateDetector.check_duplicate(file_hash, content.decode(), existing)
    assert res["is_duplicate"] is True
    assert res["duplicate_type"] == "EXACT_HASH_MATCH"

def test_hallucination_guard():
    # Sourced claim
    res_pass = HallucinationGuard.audit_claim(
        claim_text="LVEF 42%",
        source_evidence_texts=["Echocardiogram: LVEF calculated at 42%"]
    )
    assert res_pass["verdict"] == "PASSED_GROUNDED"

    # Unsourced claim
    res_fail = HallucinationGuard.audit_claim(
        claim_text="Severe aortic stenosis",
        source_evidence_texts=[]
    )
    assert res_fail["verdict"] == "REJECTED_UNGROUNDED"
    assert "Not found in available records" in res_fail["safe_replacement"]

def test_rag_pipeline_indexing_and_search():
    rag = RAGPipeline()
    rag.index_document("doc-1", "Discharge 1", "Patient diagnosed with HFrEF and initiated on Torsemide.")
    results = rag.search_evidence("Torsemide")
    assert len(results) > 0
    assert results[0]["document_id"] == "doc-1"
    assert "Torsemide" in results[0]["text"]

# ==================== INTEGRATION TESTS ====================

def test_health_endpoint(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "IBM watsonx" in data["platform"]

def test_get_all_demo_patients(client):
    res = client.get("/api/patients")
    assert res.status_code == 200
    patients = res.json()
    assert len(patients) == 6
    names = [p["name"] for p in patients]
    assert "Rajesh Kumar" in names
    assert "Amit Patel" in names

def test_get_patient_details(client):
    res = client.get("/api/patients/pat-001")
    assert res.status_code == 200
    data = res.json()
    assert data["patient"]["mrn"] == "SYN-MRN-9021"
    assert len(data["documents"]) >= 4
    assert len(data["events"]) >= 4
    assert len(data["gaps"]) >= 1
    assert len(data["conflicts"]) >= 1

def test_reconstruct_journey_pipeline(client):
    res = client.post("/api/patients/pat-001/reconstruct")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "RECONSTRUCTION_COMPLETE"
    assert "executive_synthesis" in data
    assert data["executive_synthesis"]["evidence_count"] >= 4

def test_copilot_chat_citations(client):
    res = client.post("/api/copilot/chat", json={
        "patient_id": "pat-001",
        "query": "What is missing from this story?"
    })
    assert res.status_code == 200
    data = res.json()
    assert "Echocardiogram" in data["answer"] or "Holter" in data["answer"]
    assert len(data["citations"]) > 0

def test_scan_document_text(client):
    sample_text = (
        "METRO CARDIAC INSTITUTE\\n"
        "DISCHARGE SUMMARY\\n"
        "Patient: Rajesh Kumar | MRN: SYN-MRN-9021\\n"
        "PRIMARY DIAGNOSIS: Acute Decompensated Heart Failure (HFrEF) and Cardiorenal Syndrome\\n"
        "INVESTIGATIONS:\\n"
        "LVEF: 32%\\n"
        "Serum Creatinine: 1.82 mg/dL\\n"
        "MEDICATIONS:\\n"
        "1. Tab Torsemide 20 mg PO morning\\n"
        "2. Tab Sacubitril/Valsartan 49/51 mg PO BID\\n"
        "ATTENTION: formal 2D Echo report pending upload from central lab"
    )
    res = client.post("/api/documents/scan-text", json={
        "text": sample_text,
        "filename": "Metro_Cardiac_Discharge.txt",
        "patient_id": "pat-001"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["document_type"] == "Discharge Summary"
    assert "Heart Failure" in str(data["diagnoses"]) or "HFrEF" in str(data["diagnoses"])
    assert any("Torsemide" in m["drug"] for m in data["medications"])
    assert any("Creatinine" in i["test"] for i in data["investigations"])
    assert len(data["gaps"]) >= 1
    assert "executive_summary" in data

def test_incorporate_document(client):
    payload = {
        "patient_id": "pat-001",
        "title": "Emergency CCU Consultation Note",
        "document_type": "Consultation",
        "raw_content": "Emergency evaluation for fluid overload. Prescribed Torsemide 20mg PO.",
        "ocr_confidence": 0.99,
        "diagnoses": ["Acute Decompensated Heart Failure"],
        "medications": [{"drug": "Torsemide", "dose": "20 mg", "frequency": "Daily", "status": "Prescribed"}],
        "investigations": [{"test": "Serum Creatinine", "value": "1.82 mg/dL", "status": "Abnormal"}],
        "gaps": [{"type": "Pending Echo Report", "description": "Echo report pending upload", "action": "Follow up"}]
    }
    res = client.post("/api/documents/incorporate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SUCCESS"
    assert data["document_id"].startswith("doc-")
    assert data["medications_added"] == 1
    assert data["investigations_added"] == 1
    assert data["gaps_surfaced"] == 1

def test_update_patient_record(client):
    payload = {
        "primary_condition": "Acute Decompensated Heart Failure with Cardiorenal Syndrome (Updated)",
        "archetype": "Patient A: Complex Multi-Admissions"
    }
    res = client.put("/api/patients/pat-001", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SUCCESS"
    assert "Cardiorenal" in data["patient"]["primaryCondition"]
    assert data["patient"]["archetype"] == "Patient A: Complex Multi-Admissions"

def test_hackathon_submission_compliance():
    import os
    required_files = [
        'README.md',
        'submission.yaml',
        'docs/problem-statement.md',
        'docs/solution-overview.md',
        'docs/architecture.md',
        'docs/setup-guide.md',
        'demo/demo-video-link.txt'
    ]
    for rf in required_files:
        assert os.path.isfile(rf), f"Missing required file: {rf}"

    with open('submission.yaml', 'r', encoding='utf-8') as sf:
        sub_text = sf.read()
    assert 'Tech Titans' in sub_text
    assert 'AI' in sub_text
    assert 'Ronak' in sub_text
    assert 'MedSynapse AI' in sub_text

    with open('demo/demo-video-link.txt', 'r', encoding='utf-8') as vf:
        first_line = vf.readline().strip()
    assert 'your-demo-video-link-here' not in first_line

    with open('README.md', 'r', encoding='utf-8') as rf:
        readme = rf.read()
    assert '[Your Project Title Here]' not in readme
    assert '[Your Team Name]' not in readme


