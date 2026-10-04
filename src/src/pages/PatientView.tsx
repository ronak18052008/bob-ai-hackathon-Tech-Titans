import { Routes, Route, Navigate } from 'react-router-dom';
import Timeline from './patient/Timeline';
import WhatChanged from './patient/WhatChanged';
import MedicationRadar from './patient/MedicationRadar';
import Investigations from './patient/Investigations';
import CareGaps from './patient/CareGaps';
import Contradictions from './patient/Contradictions';
import AIAssistant from './patient/AIAssistant';
import GenerateBrief from './patient/GenerateBrief';

export default function PatientView() {
  return (
    <div className="min-h-full">
      <Routes>
        <Route path="/" element={<Navigate to="what-changed" replace />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="what-changed" element={<WhatChanged />} />
        <Route path="medications" element={<MedicationRadar />} />
        <Route path="investigations" element={<Investigations />} />
        <Route path="care-gaps" element={<CareGaps />} />
        <Route path="contradictions" element={<Contradictions />} />
        <Route path="assistant" element={<AIAssistant />} />
        <Route path="briefs" element={<GenerateBrief />} />
        <Route path="audit" element={<div className="surface p-8">Audit logs coming soon.</div>} />
      </Routes>
    </div>
  );
}
