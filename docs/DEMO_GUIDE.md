# MedSynapse AI — Hackathon Demonstration Guide (3–5 Minute Script)

Follow this structured workflow for the ideal 3 to 5 minute demonstration for technical judges, clinicians, and evaluators.

---

## Step 1: Login & Morning Brief (0:00 – 0:45)
1. Launch **MedSynapse AI** (running on `http://localhost:8000` or `http://localhost:3000`).
2. Show the **Canonical Brand Identity** (the official MedSynapse AI logo with ECG pulse and neural synapse).
3. Switch between **Light Mode** and **Dark Mode** via the top navbar to highlight the clinical semantic design tokens.
4. Point out the **Doctor Morning Brief**: "What changed since your last review?" — notice the immediate flags for missing Echo reports and medication conflicts.

---

## Step 2: The Signature "WOW" Feature — Reconstruct Patient Journey (0:45 – 1:45)
1. Select **Patient A: Rajesh Kumar** (62M, Multiple Admissions for HFrEF).
2. Click the glowing top action: **"Reconstruct Journey"**.
3. Watch the animated 7-stage pipeline:
   - Ingesting clinical records → Layout & entity extraction → Temporal sequencing → Cross-document evidence mapping → Graph construction → Gap radar scanning → Synthesis.
4. Review the Executive Summary:
   - **WHAT HAPPENED:** 3 admissions across 8 months for heart failure decompensation.
   - **WHAT CHANGED:** Switched from oral Furosemide to Torsemide; Entresto up-titrated; LVEF declined from 42% to 32%.
   - **WHAT IS MISSING:** Formal 2D-Echo report dated Sep 16 missing; Holter monitor unconfirmed.
   - **WHAT CONFLICTS:** Allergy mismatch between Admission 1 (NKDA) and Admission 2 (Sulfa rash).
5. Click **"Open Synapse View Workspace"**.

---

## Step 3: Synapse View & 3-Panel Synchronization (1:45 – 2:45)
1. Notice the signature 3-panel layout:
   - **Left:** Synapse Timeline.
   - **Center:** Clinical Intelligence (Patient Story with `DIRECTLY DOCUMENTED` badges).
   - **Right:** Source Evidence Rail (Paper-rendered original document with highlighted exact quote).
2. Click an event on the timeline (e.g. *"Repeat Echocardiogram: LVEF Declined to 36%"*):
   - Notice how all 3 panels immediately synchronize to that exact page and source text!
3. Click **"Why is this here?"** to demonstrate AI transparency and OCR confidence.

---

## Step 4: Change Lens, Gap Radar & Conflict Detector (2:45 – 3:45)
1. Click **Change Lens** in the sidebar: review the side-by-side Admission 2 vs Admission 3 comparison matrix.
2. Click **Gap Radar**: show the missing 2D-Echo report; click *"Upload Missing Echo Report"* in the Document Inbox to simulate resolving the gap.
3. Click **Conflict Detector**: inspect the side-by-side excerpts of contradictory statements; click *"Confirm Source B"* to log clinician resolution.

---

## Step 5: Synapse Copilot & Second Look Audit (3:45 – 4:30)
1. Open **Synapse Copilot** from the top bar:
   - Ask: *"What changed since the previous admission?"*
   - Show the grounded answer and click an **Evidence Chip** to jump to the source record.
   - Click *"Read Out Loud"* to show the voice synthesis workflow.
2. Click **Second Look** in the navbar:
   - Show the automated 5-point evidence audit verifying 100% source backing before generating a clinical handoff or referral.

---

## Step 6: Print / Export & Wrap-up (4:30 – 5:00)
1. Click **Smart Referral**: demonstrate the generated evidence-grounded tertiary referral letter.
2. Click **Print / Export PDF**: note the clinical print-safe light styling.
3. Conclude:
   > **"MedSynapse AI: Reconstruct the patient's journey. Surface what matters."**
