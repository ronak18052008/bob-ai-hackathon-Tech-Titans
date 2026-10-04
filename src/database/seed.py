"""
MedSynapse AI — Database Seeder
Populates SQLite/PostgreSQL with the 6 canonical synthetic demo patients
and clinical entities as specified in Section 73 & Section 88.
"""
import os
import hashlib
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.database.models import (
    Base,
    Organization,
    Department,
    User,
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
)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///medsynapse.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode('utf-8')).hexdigest()

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data for idempotent re-seeding
    for table in reversed(Base.metadata.sorted_tables):
        db.execute(table.delete())
    db.commit()

    print("Initializing MedSynapse AI synthetic clinical data...")

    # 1. Organization & Departments
    org = Organization(
        id="org-metro-01",
        name="Metro Heart & Multi-Specialty Institute",
        facility_code="METRO-BLR-01",
    )
    db.add(org)

    dept_cardio = Department(id="dept-cardio", name="Cardiology & CCU", code="CARD", organization_id=org.id)
    dept_pulm = Department(id="dept-pulm", name="Pulmonology & Respiratory", code="PULM", organization_id=org.id)
    dept_surg = Department(id="dept-surg", name="Gastrointestinal Surgery", code="GISURG", organization_id=org.id)
    dept_rheum = Department(id="dept-rheum", name="Rheumatology & Immunology", code="RHEUM", organization_id=org.id)
    db.add_all([dept_cardio, dept_pulm, dept_surg, dept_rheum])

    # 2. Synthetic Clinical Demo Users (Section 16)
    users = [
        User(
            id="usr-001",
            email="doctor@medsynapse.ai",
            name="Dr. Ananya Roy, FACC",
            role="Doctor",
            organization_id=org.id,
            hashed_password=hash_pw("ClinicalDemo2026!"),
            department="Cardiology & CCU",
        ),
        User(
            id="usr-002",
            email="senior.doctor@medsynapse.ai",
            name="Dr. Marcus Vance, MD",
            role="Senior Doctor / Reviewer",
            organization_id=org.id,
            hashed_password=hash_pw("ClinicalDemo2026!"),
            department="Pulmonology",
        ),
        User(
            id="usr-003",
            email="admin@medsynapse.ai",
            name="Chief Medical Admin",
            role="Department Admin",
            organization_id=org.id,
            hashed_password=hash_pw("ClinicalDemo2026!"),
            department="Clinical Administration",
        ),
        User(
            id="usr-004",
            email="records@medsynapse.ai",
            name="Health Records Registrar",
            role="Records Manager",
            organization_id=org.id,
            hashed_password=hash_pw("ClinicalDemo2026!"),
            department="Health Information Management",
        ),
    ]
    db.add_all(users)

    # 3. Patient A: Rajesh Kumar (Multiple Admissions - HFrEF / CKD)
    pat_a = Patient(
        id="pat-001",
        mrn="SYN-MRN-9021",
        abha_id="91-4402-8819-2041",
        name="Rajesh Kumar",
        age=62,
        gender="Male",
        blood_group="B+",
        primary_condition="Acute Decompensated Heart Failure (HFrEF, EF 32%) & CKD Stage 3a",
        archetype="Patient A: Multiple Admissions",
        organization_id=org.id,
    )
    db.add(pat_a)

    # Patient B: Sarah Jenkins (Medication Evolution - Severe Asthma, Dupilumab)
    pat_b = Patient(
        id="pat-002",
        mrn="SYN-MRN-8492",
        abha_id="91-1823-7491-0024",
        name="Sarah Jenkins",
        age=54,
        gender="Female",
        blood_group="A+",
        primary_condition="Severe Eosinophilic Asthma & Steroid-Induced Osteopenia",
        archetype="Patient B: Medication Evolution",
        organization_id=org.id,
    )
    db.add(pat_b)

    # Patient C: Amit Patel (Documentation Conflicts - Atorvastatin 40 vs 20mg)
    pat_c = Patient(
        id="pat-003",
        mrn="SYN-MRN-7731",
        abha_id="91-9921-3482-1109",
        name="Amit Patel",
        age=47,
        gender="Male",
        blood_group="O+",
        primary_condition="Post-NSTEMI (PCI to LAD) & Type 2 Diabetes Mellitus",
        archetype="Patient C: Documentation Conflicts",
        organization_id=org.id,
    )
    db.add(pat_c)

    # Patient D: Maria Rodriguez (Pending Investigations - Missing post-cholecystectomy CT)
    pat_d = Patient(
        id="pat-004",
        mrn="SYN-MRN-6204",
        abha_id="91-3819-2201-9844",
        name="Maria Rodriguez",
        age=68,
        gender="Female",
        blood_group="AB-",
        primary_condition="Post-Laparoscopic Cholecystectomy & Unexplained Persistent Cholestasis",
        archetype="Patient D: Pending Investigations",
        organization_id=org.id,
    )
    db.add(pat_d)

    # Patient E: Vikram Sengupta (Incomplete Documentation - Missing City Hospital records)
    pat_e = Patient(
        id="pat-005",
        mrn="SYN-MRN-5118",
        abha_id="91-8841-6502-3321",
        name="Vikram Sengupta",
        age=71,
        gender="Male",
        blood_group="B-",
        primary_condition="Severe COPD (GOLD Stage 3) & Subsegmental Pulmonary Embolism",
        archetype="Patient E: Incomplete Documentation",
        organization_id=org.id,
    )
    db.add(pat_e)

    # Patient F: Priya Sharma (Multiple Departments / Referrals - SLE, Lupus Nephritis)
    pat_f = Patient(
        id="pat-006",
        mrn="SYN-MRN-4309",
        abha_id="91-7712-4091-6650",
        name="Priya Sharma",
        age=38,
        gender="Female",
        blood_group="O-",
        primary_condition="Systemic Lupus Erythematosus (SLE) with Class IV Lupus Nephritis",
        archetype="Patient F: Multiple Departments / Referrals",
        organization_id=org.id,
    )
    db.add(pat_f)

    # Patient A Clinical Documents
    doc1 = Document(
        id="doc-001",
        patient_id=pat_a.id,
        title="Discharge Summary — Admission 1 (Acute Decompensated HF)",
        document_type="Discharge Summary",
        status="Verified",
        file_name="Discharge_Summary_Jan2026_RajeshKumar.pdf",
        file_size_bytes=2450000,
        date_documented=datetime(2026, 1, 22),
        uploaded_by="Dr. Ananya Roy",
        author_institution="Metro Heart Institute, Ward 4B",
        ocr_confidence=0.99,
        raw_content="First admission for acute biventricular decompensation. Initial Echo LVEF 42%. Discharged on oral Furosemide 40mg daily, Ramipril 2.5mg daily, Carvedilol 6.25mg BID.",
    )
    doc2 = Document(
        id="doc-002",
        patient_id=pat_a.id,
        title="Outpatient Cardiology Follow-up Consultation Note",
        document_type="Consultation",
        status="Verified",
        file_name="OPD_Cardio_Consult_May2026.pdf",
        file_size_bytes=890000,
        date_documented=datetime(2026, 5, 10),
        uploaded_by="Dr. Ananya Roy",
        author_institution="Metro Heart Institute, Outpatient Clinic",
        ocr_confidence=0.98,
        raw_content="Outpatient follow-up. Stable NYHA Class II. Ramipril titrated up to 5mg daily. Furosemide 40mg continued.",
    )
    doc3 = Document(
        id="doc-003",
        patient_id=pat_a.id,
        title="Discharge Summary — Admission 2 (CHF Exacerbation)",
        document_type="Discharge Summary",
        status="Verified",
        file_name="Discharge_Summary_Jun2026_RajeshKumar.pdf",
        file_size_bytes=2780000,
        date_documented=datetime(2026, 6, 4),
        uploaded_by="Dr. Ananya Roy",
        author_institution="Metro Heart Institute, CCU",
        ocr_confidence=0.97,
        raw_content="Re-hospitalization after taking OTC Diclofenac. LVEF worsened to 36%. Switched from Furosemide to Torsemide 20mg daily for diuretic resistance. Switched to Sacubitril/Valsartan 24/26mg BID. Added Empagliflozin 10mg and Spironolactone 25mg.",
    )
    doc4 = Document(
        id="doc-004",
        patient_id=pat_a.id,
        title="Discharge Summary — Admission 3 (Cardiorenal Syndrome)",
        document_type="Discharge Summary",
        status="Needs Review",
        file_name="Discharge_Summary_Sep2026_RajeshKumar.pdf",
        file_size_bytes=3100000,
        date_documented=datetime(2026, 9, 18),
        uploaded_by="Dr. Ananya Roy",
        author_institution="Metro Heart Institute, Stepdown Unit",
        ocr_confidence=0.95,
        raw_content="Third admission with acute cardiorenal syndrome. LVEF depressed at 32%. Creatinine 1.82 mg/dL. Torsemide split dose (20mg + 10mg) and Entresto 49/51mg BID. Echo performed in Central Lab on Sep 16 pending upload.",
    )
    db.add_all([doc1, doc2, doc3, doc4])

    # Patient A Clinical Events
    events = [
        ClinicalEvent(
            id="evt-001",
            patient_id=pat_a.id,
            event_date=datetime(2026, 1, 16),
            event_type="Admission",
            title="First Hospitalization: Acute Decompensated Heart Failure",
            description="Admitted with orthopnea and 4.5kg fluid retention.",
            department="Cardiology",
            doctor="Dr. Ananya Roy",
            evidence_state="DIRECTLY DOCUMENTED",
            verification_state="SOURCE BACKED",
            document_id=doc1.id,
            page_number=1,
            exact_source_text="Admitted on 16-Jan-2026 with progressive shortness of breath on exertion and orthopnea.",
            ai_interpretation="Index hospitalization establishing HFrEF diagnosis.",
        ),
        ClinicalEvent(
            id="evt-002",
            patient_id=pat_a.id,
            event_date=datetime(2026, 1, 18),
            event_type="Investigation",
            title="Transthoracic Echocardiogram: LVEF 42%",
            description="Calculated EF 42% with mild MR.",
            department="Non-Invasive Cardiology",
            doctor="Dr. P. Deshmukh",
            evidence_state="DIRECTLY DOCUMENTED",
            verification_state="DOCTOR VERIFIED",
            document_id=doc1.id,
            page_number=2,
            exact_source_text="Transthoracic Echocardiogram: Left ventricular ejection fraction (LVEF) calculated at 42%.",
            ai_interpretation="Baseline systolic functional metric.",
        ),
        ClinicalEvent(
            id="evt-003",
            patient_id=pat_a.id,
            event_date=datetime(2026, 6, 4),
            event_type="Medication Change",
            title="Transitioned to Quadruple GDMT & Torsemide",
            description="Furosemide replaced by Torsemide 20mg; Entresto and Empagliflozin initiated.",
            department="Cardiology",
            doctor="Dr. Ananya Roy",
            evidence_state="DIRECTLY DOCUMENTED",
            verification_state="SOURCE BACKED",
            document_id=doc3.id,
            page_number=3,
            exact_source_text="Tab Torsemide 20 mg PO once daily (Replaces Furosemide). Reason: Diuretic resistance.",
            ai_interpretation="Transition to modern guideline therapy for decompensated heart failure.",
        ),
        ClinicalEvent(
            id="evt-004",
            patient_id=pat_a.id,
            event_date=datetime(2026, 9, 18),
            event_type="Admission",
            title="Third Hospitalization: Acute Cardiorenal Syndrome & LVEF 32%",
            description="Admitted with renal impairment and orthopnea. Torsemide split dose commenced.",
            department="Cardiology",
            doctor="Dr. Ananya Roy",
            evidence_state="DIRECTLY DOCUMENTED",
            verification_state="SOURCE BACKED",
            document_id=doc4.id,
            page_number=1,
            exact_source_text="Assessment: Acute decompensated HFrEF (LVEF 32%) with Type 2 Cardiorenal syndrome; eGFR 38 mL/min.",
            ai_interpretation="Accelerating clinical trajectory toward advanced heart failure therapy.",
        ),
    ]
    db.add_all(events)

    # Gaps & Conflicts
    gap1 = Gap(
        id="gap-001",
        patient_id=pat_a.id,
        gap_type="Referenced Report Unavailable",
        title="Formal 2D-Echocardiogram Report Missing (16-Sep-2026)",
        description="Discharge Summary 3 cites a formal Echo performed in Central Lab, but report file is missing from archive.",
        referencing_document=doc4.title,
        referencing_date=datetime(2026, 9, 18),
        referencing_page=2,
        exact_reference_text="formal 2D-Echocardiogram performed on 16-Sep-2026 in Central Lab (formal report pending upload).",
        missing_item="Formal Echocardiography Diagnostic Report",
        evidence_state="NOT FOUND",
        doctor_action="Request Central Lab to attach official Echo report.",
        status="Open",
    )
    cnf1 = Conflict(
        id="cnf-001",
        patient_id=pat_a.id,
        conflict_type="Allergy Documentation Discrepancy",
        description="Admission 1 notes NKDA, while Admission 2 triage records past allergic rash to Sulfa medication.",
        source_a_document=doc1.title,
        source_a_date=datetime(2026, 1, 22),
        source_a_page=1,
        source_a_text="Allergies: NKDA (No Known Drug Allergies).",
        source_b_document=doc3.title,
        source_b_date=datetime(2026, 6, 4),
        source_b_page=1,
        source_b_text="Allergies: Documented adverse skin rash to Trimethoprim/Sulfamethoxazole in 2021.",
        resolution_status="Unresolved",
    )
    db.add_all([gap1, cnf1])

    # Initial Audit Trail
    audit = AuditEvent(
        id="aud-init-01",
        user_name="System Seeder",
        user_role="System Administrator",
        action="DATABASE_SEEDED",
        details="Loaded 6 synthetic patients, documents, timeline events, and gaps into MedSynapse repository.",
    )
    db.add(audit)

    db.commit()
    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
