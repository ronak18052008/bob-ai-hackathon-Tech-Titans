import { Link } from 'react-router-dom';
import { Search, Filter, Plus, ChevronRight, Clock } from 'lucide-react';

export default function PatientList() {
  const patients = [
    { id: 'RM-8492', name: 'Rahul Mehta', age: 58, records: 14, admissions: 3, lastUpdated: 'Today, 09:42 AM', status: 'Review Needed', highlight: true },
    { id: 'SP-9231', name: 'Sunita Patel', age: 72, records: 8, admissions: 1, lastUpdated: 'Yesterday, 14:30 PM', status: 'Up to date' },
    { id: 'DK-1049', name: 'Devendra Kulkarni', age: 45, records: 3, admissions: 0, lastUpdated: '12 Sep 2026', status: 'Up to date' }
  ];

  return (
    <div className="flex flex-col gap-6 min-h-full">
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl mb-1">Patients</h1>
          <p className="text-secondary text-base m-0">Select a patient to review their clinical continuity records.</p>
        </div>
        <Link to="/patients/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <Plus className="w-4 h-4" /> Create Patient
        </Link>
      </header>

      <div className="surface p-4 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            placeholder="Search by patient name or ID..." 
            className="w-full pl-10 pr-4 py-2 rounded-md border text-sm"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
          />
        </div>
        <button className="btn btn-secondary !py-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="surface overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Patient</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Age</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Records / Admissions</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Last Updated</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr 
                key={patient.id} 
                className="transition-colors group"
                style={{ 
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: patient.highlight ? 'var(--primary-light)' : 'transparent'
                }}
              >
                <td className="p-4">
                  <div className="font-semibold text-primary">{patient.name}</div>
                  <div className="text-xs text-muted mt-1">{patient.id}</div>
                </td>
                <td className="p-4 text-sm">{patient.age}</td>
                <td className="p-4 text-sm text-secondary">
                  <span className="font-medium text-primary">{patient.records}</span> records &middot; {patient.admissions} admissions
                </td>
                <td className="p-4 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted" />
                  {patient.lastUpdated}
                </td>
                <td className="p-4">
                  <span className={`badge ${patient.status === 'Review Needed' ? 'badge-warning' : 'badge-neutral'}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link 
                    to={`/patient/${patient.id}/timeline`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-teal opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ textDecoration: 'none' }}
                  >
                    Open Record <ChevronRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
