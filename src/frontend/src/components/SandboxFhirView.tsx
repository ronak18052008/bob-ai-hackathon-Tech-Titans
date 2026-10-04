import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Code,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const SandboxFhirView: React.FC = () => {
  const { selectedPatient } = useApp();
  const [activeResource, setActiveResource] = useState<'Patient' | 'Encounter' | 'MedicationRequest' | 'Observation'>('Patient');
  const [copied, setCopied] = useState(false);

  // Synthetic FHIR Resources
  const fhirPayloads = {
    Patient: {
      resourceType: 'Patient',
      id: selectedPatient.id,
      identifier: [
        { system: 'https://healthid.ndhm.gov.in', value: selectedPatient.abhaId },
        { system: 'urn:hospital:mrn', value: selectedPatient.mrn },
      ],
      name: [{ family: selectedPatient.name.split(' ')[1] || '', given: [selectedPatient.name.split(' ')[0]] }],
      gender: selectedPatient.gender.toLowerCase(),
      birthDate: '1964-04-12',
      managingOrganization: { display: 'Metro Heart Institute' },
    },
    Encounter: {
      resourceType: 'Encounter',
      id: 'enc-2026-09',
      status: 'finished',
      class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'IMP', display: 'inpatient encounter' },
      subject: { reference: `Patient/${selectedPatient.id}` },
      period: { start: '2026-09-11T08:30:00Z', end: '2026-09-18T14:00:00Z' },
      reasonCode: [{ text: 'Acute decompensated HFrEF & Cardiorenal Syndrome' }],
    },
    MedicationRequest: {
      resourceType: 'MedicationRequest',
      id: 'medreq-002',
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: {
        coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '1657687', display: 'Sacubitril / Valsartan 49/51 mg' }],
      },
      subject: { reference: `Patient/${selectedPatient.id}` },
      dosageInstruction: [{ text: 'Take 1 tablet by mouth twice daily' }],
    },
    Observation: {
      resourceType: 'Observation',
      id: 'obs-ef-sep2026',
      status: 'preliminary',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'imaging' }] }],
      code: { coding: [{ system: 'http://loinc.org', code: '88062-5', display: 'Left ventricular Ejection fraction by 2D echo' }] },
      subject: { reference: `Patient/${selectedPatient.id}` },
      valueQuantity: { value: 32, unit: '%', system: 'http://unitsofmeasure.org', code: '%' },
      note: [{ text: 'Formal written report from Central Lab pending attachment.' }],
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirPayloads[activeResource], null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Interoperability &amp; Standards
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            ABDM &amp; FHIR R4 Health Data Sandbox
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Test synthetic FHIR resource transformations and authorized ABDM/ABHA data integration layers.
          </p>
        </div>

        <span className="text-xs bg-surface-secondary border border-border px-3 py-1.5 rounded-xl font-mono text-text-secondary">
          ABHA: {selectedPatient.abhaId}
        </span>
      </div>

      {/* Disclaimers & Architecture Notice (Section 63 & 64) */}
      <div className="p-4 rounded-xl border border-primary/30 bg-primary-soft/20 text-xs text-text-secondary space-y-1">
        <div className="font-bold text-primary flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>FHIR-Compatible Architecture &amp; ABDM Connector Spec</span>
        </div>
        <p>
          Architecture designed for FHIR R4 mapping and Ayushman Bharat Digital Mission (ABDM) Milestone 1–3 consent gateways using synthetic sandbox connectors. Not an interoperability certification claim.
        </p>
      </div>

      {/* Interactive FHIR Resource Explorer */}
      <div className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
        {/* Resource Selector Tabs */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex space-x-2 text-xs font-semibold">
            {(['Patient', 'Encounter', 'MedicationRequest', 'Observation'] as const).map((res) => (
              <button
                key={res}
                onClick={() => setActiveResource(res)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeResource === res
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-muted hover:bg-surface-secondary hover:text-text-primary'
                }`}
              >
                {res}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-xs text-primary hover:underline font-semibold"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
          </button>
        </div>

        {/* JSON Preview */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed max-h-96">
          <pre>{JSON.stringify(fhirPayloads[activeResource], null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
export default SandboxFhirView;
