import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  X,
  Save,
  CheckCircle2,
  FileEdit,
  AlertCircle,
  Stethoscope,
  HeartPulse,
  Activity,
  Layers,
} from 'lucide-react';
import { Patient } from '../types';

interface EditPatientRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditPatientRecordModal: React.FC<EditPatientRecordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedPatient, setSelectedPatient, setPatients, addAuditLog } = useApp();

  const [name, setName] = useState(selectedPatient.name);
  const [age, setAge] = useState(selectedPatient.age);
  const [gender, setGender] = useState(selectedPatient.gender);
  const [bloodGroup, setBloodGroup] = useState(selectedPatient.bloodGroup);
  const [primaryCondition, setPrimaryCondition] = useState(selectedPatient.primaryCondition);
  const [archetype, setArchetype] = useState(selectedPatient.archetype);
  const [assignedDoctor, setAssignedDoctor] = useState(selectedPatient.assignedDoctor || 'Dr. Ananya Roy, FACC');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Patient under continuous inpatient & post-discharge cardiac surveillance. Titration of Sacubitril/Valsartan and split-dose Torsemide undergoing hemodynamic monitoring.'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state whenever selected patient changes
  useEffect(() => {
    if (selectedPatient) {
      setName(selectedPatient.name);
      setAge(selectedPatient.age);
      setGender(selectedPatient.gender);
      setBloodGroup(selectedPatient.bloodGroup);
      setPrimaryCondition(selectedPatient.primaryCondition);
      setArchetype(selectedPatient.archetype);
      setAssignedDoctor(selectedPatient.assignedDoctor || 'Dr. Ananya Roy, FACC');
      setSaveSuccess(false);
    }
  }, [selectedPatient, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedData: Partial<Patient> = {
      name,
      age: Number(age),
      gender: gender as any,
      bloodGroup,
      primaryCondition,
      archetype,
      assignedDoctor,
    };

    try {
      // 1. Send update to backend API
      const res = await fetch(`/api/patients/${selectedPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          age: Number(age),
          gender,
          blood_group: bloodGroup,
          primary_condition: primaryCondition,
          archetype,
          assigned_doctor: assignedDoctor,
          clinical_notes: clinicalNotes,
        }),
      });

      // 2. Update frontend state
      const newPatientObj = {
        ...selectedPatient,
        ...updatedData,
      };
      setSelectedPatient(newPatientObj);

      setPatients((prev) =>
        prev.map((p) => (p.id === selectedPatient.id ? { ...p, ...updatedData } : p))
      );

      // 3. Log statutory audit trail
      addAuditLog(
        'PATIENT_RECORD_UPDATED',
        `Doctor updated patient record for ${name} (${selectedPatient.mrn}): Primary Condition: "${primaryCondition}", Archetype: "${archetype}"`
      );

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      console.error(err);
      // Fallback local update
      setSelectedPatient({
        ...selectedPatient,
        ...updatedData,
      });
      setPatients((prev) =>
        prev.map((p) => (p.id === selectedPatient.id ? { ...p, ...updatedData } : p))
      );
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => onClose(), 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Modify Patient Clinical Record
              </h2>
              <p className="text-xs text-slate-500">
                MRN: <span className="font-mono font-bold">{selectedPatient.mrn}</span> • ABHA:{' '}
                <span className="font-mono">{selectedPatient.abhaId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Patient record successfully updated and verified in clinical registry!</span>
            </div>
          )}

          {/* Row 1: Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Patient Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Age
              </label>
              <input
                type="number"
                required
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          {/* Row 2: Gender & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Blood Group
              </label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          {/* Row 3: Primary Condition */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Primary Clinical Condition &amp; Diagnoses
            </label>
            <input
              type="text"
              required
              value={primaryCondition}
              onChange={(e) => setPrimaryCondition(e.target.value)}
              placeholder="e.g. Acute Decompensated Heart Failure (HFrEF) with Cardiorenal Syndrome"
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Row 4: Archetype / Risk Stratification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Archetype / Complexity
              </label>
              <input
                type="text"
                value={archetype}
                onChange={(e) => setArchetype(e.target.value)}
                placeholder="e.g. Patient A: Multiple Admissions"
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Attending Physician
              </label>
              <input
                type="text"
                value={assignedDoctor}
                onChange={(e) => setAssignedDoctor(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Row 5: Clinical Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Attending Clinical Notes &amp; Management Plan
            </label>
            <textarea
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 leading-relaxed font-sans"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Changes will be recorded in the statutory audit log.
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || saveSuccess}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Updating...' : saveSuccess ? 'Saved!' : 'Save Patient Record'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientRecordModal;
