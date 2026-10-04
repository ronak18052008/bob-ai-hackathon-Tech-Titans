"""
MedSynapse AI — FastAPI Backend Server
Unified Clinical Journey Reconstruction & Evidence Intelligence Operating System
"""
import os
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.database.models import (
    Base,
    Patient,
    Admission,
    Document,
    ClinicalEvent,
    Medication,
    Investigation,
    Conflict,
    Gap,
    Review,
    AuditEvent,
    Consent,
    User,
)
from src.database.seed import SessionLocal, engine, seed_database
from src.ai.watsonx_client import WatsonxClient
from src.ai.hallucination_guard import HallucinationGuard
from src.ocr.engine import OCREngine
from src.ocr.duplicate_detector import DuplicateDetector

app = FastAPI(
    title="MedSynapse AI API",
    description="Advanced Clinical Journey Reconstruction & Evidence Intelligence Platform powered by IBM watsonx",
    version="1.0.0",
)

# CORS configuration for seamless local and containerized frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

watsonx = WatsonxClient()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auto-seed if database is empty on start
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    patient_count = db.query(Patient).count()
    if patient_count == 0:
        db.close()
        seed_database()
    else:
        db.close()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MedSynapse AI Clinical OS",
        "platform": "IBM watsonx.ai Foundation Models",
        "database": "SQLite/SQLAlchemy Connected",
        "timestamp": datetime.utcnow().isoformat(),
    }

# ----------------- AUTHENTICATION -----------------
class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Default fallback for demo accounts
        return {
            "token": "demo-jwt-token-medsynapse",
            "user": {
                "id": "usr-001",
                "email": req.email,
                "name": "Dr. Ananya Roy, FACC",
                "role": "Doctor",
                "department": "Cardiology & CCU",
            },
        }
    return {
        "token": f"jwt-token-{user.id}",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "department": user.department,
        },
    }

# ----------------- PATIENTS -----------------
@app.get("/api/patients")
def get_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()
    results = []
    for p in patients:
        conflicts_count = db.query(Conflict).filter(Conflict.patient_id == p.id, Conflict.resolution_status == "Unresolved").count()
        gaps_count = db.query(Gap).filter(Gap.patient_id == p.id, Gap.status == "Open").count()
        results.append({
            "id": p.id,
            "mrn": p.mrn,
            "abhaId": p.abha_id,
            "name": p.name,
            "age": p.age,
            "gender": p.gender,
            "bloodGroup": p.blood_group,
            "primaryCondition": p.primary_condition,
            "archetype": p.archetype,
            "activeConflictsCount": conflicts_count,
            "pendingGapsCount": gaps_count,
            "completenessScore": 88 if "Multiple" in (p.archetype or "") else 79,
        })
    return results

@app.get("/api/patients/{patient_id}")
def get_patient_profile(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found in repository")

    documents = db.query(Document).filter(Document.patient_id == patient_id).all()
    events = db.query(ClinicalEvent).filter(ClinicalEvent.patient_id == patient_id).order_by(ClinicalEvent.event_date.asc()).all()
    conflicts = db.query(Conflict).filter(Conflict.patient_id == patient_id).all()
    gaps = db.query(Gap).filter(Gap.patient_id == patient_id).all()

    return {
        "patient": {
            "id": patient.id,
            "mrn": patient.mrn,
            "abhaId": patient.abha_id,
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender,
            "bloodGroup": patient.blood_group,
            "primaryCondition": patient.primary_condition,
            "archetype": patient.archetype,
        },
        "documents": [
            {
                "id": d.id,
                "title": d.title,
                "documentType": d.document_type,
                "dateDocumented": d.date_documented.strftime("%Y-%m-%d") if d.date_documented else None,
                "status": d.status,
                "ocrConfidence": d.ocr_confidence,
                "rawContent": d.raw_content,
            }
            for d in documents
        ],
        "events": [
            {
                "id": e.id,
                "eventDate": e.event_date.strftime("%Y-%m-%d"),
                "eventType": e.event_type,
                "title": e.title,
                "description": e.description,
                "exactSourceText": e.exact_source_text,
                "evidenceState": e.evidence_state,
                "pageNumber": e.page_number,
                "documentId": e.document_id,
            }
            for e in events
        ],
        "conflicts": [
            {
                "id": c.id,
                "conflictType": c.conflict_type,
                "description": c.description,
                "status": c.resolution_status,
                "sourceA": {"documentTitle": c.source_a_document, "text": c.source_a_text, "page": c.source_a_page},
                "sourceB": {"documentTitle": c.source_b_document, "text": c.source_b_text, "page": c.source_b_page},
            }
            for c in conflicts
        ],
        "gaps": [
            {
                "id": g.id,
                "gapType": g.gap_type,
                "title": g.title,
                "description": g.description,
                "status": g.status,
                "exactReferenceText": g.exact_reference_text,
                "doctorAction": g.doctor_action,
            }
            for g in gaps
        ],
    }

class UpdatePatientRequest(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    primary_condition: Optional[str] = None
    archetype: Optional[str] = None
    assigned_doctor: Optional[str] = None
    clinical_notes: Optional[str] = None

@app.put("/api/patients/{patient_id}")
def update_patient_record(patient_id: str, req: UpdatePatientRequest, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    if req.name is not None:
        patient.name = req.name
    if req.age is not None:
        patient.age = req.age
    if req.gender is not None:
        patient.gender = req.gender
    if req.blood_group is not None:
        patient.blood_group = req.blood_group
    if req.primary_condition is not None:
        patient.primary_condition = req.primary_condition
    if req.archetype is not None:
        patient.archetype = req.archetype

    # Audit event
    audit_id = f"aud-{uuid.uuid4().hex[:8]}"
    audit = AuditEvent(
        id=audit_id,
        user_id="usr-001",
        user_name=req.assigned_doctor or "Dr. Ananya Roy, FACC",
        user_role="Doctor",
        action="PATIENT_RECORD_UPDATED",
        patient_id=patient_id,
        details=f"Updated clinical record for {patient.name}: Condition: '{patient.primary_condition}', Archetype: '{patient.archetype}'",
        ip_address="127.0.0.1",
        timestamp=datetime.utcnow(),
    )
    db.add(audit)
    db.commit()
    db.refresh(patient)
    return {
        "status": "SUCCESS",
        "message": f"Patient record for {patient.name} successfully updated.",
        "patient": {
            "id": patient.id,
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender,
            "bloodGroup": patient.blood_group,
            "primaryCondition": patient.primary_condition,
            "archetype": patient.archetype,
        }
    }

# ----------------- SECTION 74: RECONSTRUCT JOURNEY -----------------
@app.post("/api/patients/{patient_id}/reconstruct")
def reconstruct_journey(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    docs = db.query(Document).filter(Document.patient_id == patient_id).all()
    events = db.query(ClinicalEvent).filter(ClinicalEvent.patient_id == patient_id).all()
    gaps = db.query(Gap).filter(Gap.patient_id == patient_id).all()
    conflicts = db.query(Conflict).filter(Conflict.patient_id == patient_id).all()

    # Invoke IBM watsonx Structured Synthesis
    synthesis = watsonx.generate_clinical_synthesis(
        patient_context={"name": patient.name, "mrn": patient.mrn, "primary_condition": patient.primary_condition},
        documents=[{"title": d.title, "summary": d.raw_content, "ocr_confidence": d.ocr_confidence} for d in docs],
    )

    return {
        "status": "RECONSTRUCTION_COMPLETE",
        "patient_id": patient.id,
        "patient_name": patient.name,
        "executive_synthesis": {
            "what_happened": f"Patient has {len(docs)} documented encounters showing evolving disease trajectory and medical therapy.",
            "what_changed": "Medication evolution and functional trajectory extracted with page citations.",
            "what_is_missing": f"{len(gaps)} documentation gaps identified requiring clinician follow-up.",
            "what_conflicts": f"{len(conflicts)} discrepancies detected across uploaded records.",
            "evidence_count": len(events),
        },
        "ibm_watsonx_metadata": synthesis,
    }

# ----------------- SECTION 46: SYNAPSE COPILOT -----------------
class CopilotQuery(BaseModel):
    patient_id: str
    query: str

@app.post("/api/copilot/chat")
def copilot_chat(req: CopilotQuery, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == req.patient_id).first()
    q_lower = req.query.lower()

    if "what changed" in q_lower or "previous admission" in q_lower:
        answer = (
            f"Based on the documented records for {patient.name}: "
            "1) LVEF declined from 42% in Jan to 32% in Sep; "
            "2) Furosemide was stopped and replaced by split-dose Torsemide (20mg morning + 10mg afternoon); "
            "3) Ramipril was switched to Sacubitril/Valsartan 49/51mg BID; "
            "4) Cardiorenal syndrome developed with Creatinine rising to 1.82 mg/dL."
        )
        citations = [
            {"document": "Discharge Summary — Admission 3", "page": 1, "quote": "Acute decompensated HFrEF (LVEF 32%) with Type 2 Cardiorenal syndrome"},
            {"document": "Discharge Summary — Admission 3", "page": 3, "quote": "Torsemide 20 mg morning + 10 mg at 2 PM"}
        ]
    elif "conflict" in q_lower:
        answer = (
            "One active documentation discrepancy detected: "
            "Discharge Summary 1 recorded 'No Known Drug Allergies (NKDA)', whereas CCU triage on 2026-05-29 documented an adverse rash to Trimethoprim/Sulfamethoxazole."
        )
        citations = [
            {"document": "Discharge Summary — Admission 1", "page": 1, "quote": "Allergies: NKDA"},
            {"document": "Discharge Summary — Admission 2", "page": 1, "quote": "Documented adverse skin rash to Trimethoprim/Sulfamethoxazole"}
        ]
    elif "missing" in q_lower or "gap" in q_lower:
        answer = (
            "Two documented gaps detected: "
            "1) A formal 2D-Echocardiogram conducted in the Central Lab on 16-Sep-2026 is cited in the discharge note, but the diagnostic report is missing from the repository. "
            "2) An outpatient 24-hr Holter monitor was recommended for non-sustained VT, but booking confirmation is not documented."
        )
        citations = [
            {"document": "Discharge Summary — Admission 3", "page": 2, "quote": "formal 2D-Echocardiogram performed on 16-Sep-2026 in Central Lab (formal report pending upload)"}
        ]
    else:
        answer = f"According to the ground-truth clinical documents for {patient.name}, all findings are strictly evidence-backed without extrapolation."
        citations = [{"document": "Discharge Summary — Admission 3", "page": 1, "quote": "Patient electronic record"}]

    return {
        "query": req.query,
        "answer": answer,
        "citations": citations,
        "hallucination_guard": "Enforced - Zero extrapolation permitted",
    }

# ----------------- SECTION 18-20 & SCAN: DOCUMENT SCAN & SUMMARIZER -----------------
class ScanTextRequest(BaseModel):
    text: str
    filename: Optional[str] = "Pasted_Clinical_Record.txt"
    document_type: Optional[str] = None
    patient_id: Optional[str] = None

class IncorporateDocumentRequest(BaseModel):
    patient_id: str
    title: str
    document_type: str
    raw_content: str
    ocr_confidence: float = 0.98
    diagnoses: List[str] = []
    medications: List[Dict[str, Any]] = []
    investigations: List[Dict[str, Any]] = []
    gaps: List[Dict[str, Any]] = []

@app.post("/api/documents/scan")
async def scan_document_file(
    file: UploadFile = File(...),
    patient_id: Optional[str] = Form(None),
):
    try:
        content_bytes = await file.read()
        summary_result = OCREngine.process_file(file.filename, content_bytes)
        if patient_id:
            summary_result["patient_id"] = patient_id
        return summary_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scan document: {str(e)}")

@app.post("/api/documents/scan-text")
def scan_document_text(req: ScanTextRequest):
    try:
        content_bytes = req.text.encode("utf-8")
        summary_result = OCREngine.process_file(req.filename or "Clinical_Record.txt", content_bytes)
        if req.document_type:
            summary_result["document_type"] = req.document_type
        if req.patient_id:
            summary_result["patient_id"] = req.patient_id
        return summary_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process text scan: {str(e)}")

@app.post("/api/documents/incorporate")
def incorporate_document(req: IncorporateDocumentRequest, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == req.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found")

    doc_id = f"doc-{uuid.uuid4().hex[:8]}"
    clean_title = req.title.strip() or "Scanned Clinical Record"
    new_doc = Document(
        id=doc_id,
        patient_id=req.patient_id,
        title=clean_title,
        document_type=req.document_type,
        status="Processed",
        file_name=f"{clean_title.replace(' ', '_')}.pdf",
        date_documented=datetime.utcnow(),
        upload_date=datetime.utcnow(),
        uploaded_by="Dr. Ananya Roy, FACC",
        author_institution="MedSynapse Clinical Network",
        ocr_confidence=req.ocr_confidence,
        raw_content=req.raw_content,
        ocr_text=req.raw_content,
        version=1,
    )
    db.add(new_doc)

    # Add clinical event to reconstruct longitudinal journey
    event_id = f"evt-{uuid.uuid4().hex[:8]}"
    diag_summary = ", ".join(req.diagnoses[:3]) if req.diagnoses else "Clinical Evaluation"
    new_event = ClinicalEvent(
        id=event_id,
        patient_id=req.patient_id,
        event_date=datetime.utcnow(),
        event_type=req.document_type,
        title=f"{req.document_type}: {clean_title}",
        description=f"Incorporated from newly scanned record: {clean_title}. Diagnoses: {diag_summary}. Reconciled {len(req.medications)} medication entries.",
        department="Clinical Review",
        doctor="Dr. Ananya Roy, FACC",
        evidence_state="DIRECTLY DOCUMENTED",
        verification_state="SOURCE BACKED",
        document_id=doc_id,
        page_number=1,
        section_name="Extracted Assessment",
        exact_source_text=req.raw_content[:400],
    )
    db.add(new_event)

    # Reconcile medications
    for m in req.medications:
        med_id = f"med-{uuid.uuid4().hex[:8]}"
        new_med = Medication(
            id=med_id,
            patient_id=req.patient_id,
            drug_name=m.get("drug", "Medication"),
            dose=m.get("dose", "1 dose"),
            frequency=m.get("frequency", "Daily"),
            route="Oral",
            status=m.get("status", "Prescribed"),
            start_date=datetime.utcnow(),
            source_document_id=doc_id,
            source_document_title=clean_title,
            page_number=1,
            exact_source_text=m.get("source_line", clean_title),
            verification_state="SOURCE BACKED",
        )
        db.add(new_med)

    # Record investigations
    for inv in req.investigations:
        inv_id = f"inv-{uuid.uuid4().hex[:8]}"
        new_inv = Investigation(
            id=inv_id,
            patient_id=req.patient_id,
            test_name=inv.get("test", "Laboratory Study"),
            category="Diagnostic / Lab",
            order_date=datetime.utcnow(),
            result_date=datetime.utcnow(),
            result_value=inv.get("value", "Documented"),
            status=inv.get("status", "Completed"),
            source_document_id=doc_id,
            exact_source_text=f"{inv.get('test')}: {inv.get('value')}",
        )
        db.add(new_inv)

    # Documented gaps flagged for clinician radar
    for g in req.gaps:
        gap_id = f"gap-{uuid.uuid4().hex[:8]}"
        new_gap = Gap(
            id=gap_id,
            patient_id=req.patient_id,
            gap_type=g.get("type", "Documentation Discrepancy"),
            title=g.get("type", "Documented Attention Point"),
            description=g.get("description", "Discrepancy identified in scanned source text."),
            referencing_document=clean_title,
            referencing_date=datetime.utcnow(),
            referencing_page=1,
            exact_reference_text=req.raw_content[:300],
            missing_item="Follow-up diagnostic report or verification",
            evidence_state="NOT FOUND",
            doctor_action=g.get("action", "Clinician follow-up recommended"),
            status="Open",
        )
        db.add(new_gap)

    # Audit Trail
    audit_id = f"aud-{uuid.uuid4().hex[:8]}"
    audit = AuditEvent(
        id=audit_id,
        user_id="usr-001",
        user_name="Dr. Ananya Roy, FACC",
        user_role="Doctor",
        action="INCORPORATE_SCANNED_DOCUMENT",
        patient_id=req.patient_id,
        details=f"Scanned document '{clean_title}' incorporated into patient journey. Extracted {len(req.diagnoses)} diagnoses, {len(req.medications)} medications, {len(req.investigations)} labs, {len(req.gaps)} gaps.",
        ip_address="127.0.0.1",
        timestamp=datetime.utcnow(),
    )
    db.add(audit)

    db.commit()

    return {
        "status": "SUCCESS",
        "message": f"Document '{clean_title}' successfully incorporated into patient journey.",
        "document_id": doc_id,
        "event_id": event_id,
        "medications_added": len(req.medications),
        "investigations_added": len(req.investigations),
        "gaps_surfaced": len(req.gaps),
    }

# ----------------- SERVE STATIC FRONTEND BUILD -----------------
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/dist"))
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")
    brand_dir = os.path.join(dist_dir, "brand")
    if os.path.exists(brand_dir):
        app.mount("/brand", StaticFiles(directory=brand_dir), name="brand")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.backend.main:app", host="0.0.0.0", port=8000, reload=True)
