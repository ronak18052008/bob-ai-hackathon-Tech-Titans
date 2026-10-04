# MedSynapse AI — HL7 FHIR R4 Mapping Specification

MedSynapse AI implements an internal data transformation layer mapped to HL7 FHIR Release 4 resource structures.

*Notice: FHIR-compatible architecture; not an interoperability certification claim.*

---

## 1. Resource Mappings

### 1. `Patient`
- `Patient.id` ⟵ `patients.id`
- `Patient.identifier[0]` (System: `https://healthid.ndhm.gov.in`) ⟵ `patients.abha_id`
- `Patient.identifier[1]` (System: `urn:hospital:mrn`) ⟵ `patients.mrn`
- `Patient.name.family` / `Patient.name.given` ⟵ `patients.name`
- `Patient.gender` ⟵ `patients.gender`

### 2. `Encounter`
- `Encounter.id` ⟵ `admissions.id`
- `Encounter.status` ⟵ `finished`
- `Encounter.class` ⟵ `IMP` (Inpatient)
- `Encounter.period.start` ⟵ `admissions.admission_date`
- `Encounter.period.end` ⟵ `admissions.discharge_date`
- `Encounter.reasonCode` ⟵ `admissions.primary_diagnosis`

### 3. `MedicationRequest`
- `MedicationRequest.id` ⟵ `medications.id`
- `MedicationRequest.status` ⟵ `active` / `stopped`
- `MedicationRequest.medicationCodeableConcept` ⟵ `medications.drug_name`
- `MedicationRequest.dosageInstruction[0].text` ⟵ `medications.dose` + `medications.frequency`

### 4. `Observation`
- `Observation.id` ⟵ `investigations.id`
- `Observation.status` ⟵ `final` / `preliminary`
- `Observation.code` ⟵ LOINC mapping for test name
- `Observation.valueQuantity` ⟵ `investigations.result_value`
