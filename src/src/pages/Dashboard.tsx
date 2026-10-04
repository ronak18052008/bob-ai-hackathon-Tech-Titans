import { Link } from 'react-router-dom';
import { Users, FileText, CheckSquare, Clock, FileUp, AlertCircle, ArrowRight, Activity } from 'lucide-react';

export default function Dashboard() {
  const recentPatients = [
    { id: 'RM-8492', name: 'Rahul Mehta', age: 58, lastUpdate: 'Today, 09:42 AM', records: 14, status: 'Review Needed' },
    { id: 'SP-9231', name: 'Sunita Patel', age: 72, lastUpdate: 'Yesterday, 14:30 PM', records: 8, status: 'Up to date' },
  ];

  return (
    <div className="flex flex-col gap-8 min-h-full">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>Good morning, Dr. Sharma</h1>
          <p className="text-secondary text-lg m-0">Review patient records faster with evidence-grounded clinical summaries.</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          <FileUp className="w-4 h-4" /> Upload New Records
        </Link>
      </header>

      {/* Stats row */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: '1,248', icon: Users, color: 'text-teal', bg: 'var(--primary-light)' },
          { label: 'Active Reviews', value: '4', icon: Clock, color: 'text-warning', bg: 'var(--warning-bg)' },
          { label: 'Documents Processed', value: '3,842', icon: FileText, color: 'text-blue', bg: 'var(--accent-light)' },
          { label: 'Pending Review Items', value: '12', icon: CheckSquare, color: 'text-danger', bg: 'var(--danger-bg)' },
        ].map((stat, idx) => (
          <div key={idx} className="surface p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: stat.bg }}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold m-0 text-primary">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold m-0">Recent Patients</h2>
            <Link to="/patients" className="text-sm font-medium text-teal flex items-center gap-1 hover:underline" style={{ textDecoration: 'none' }}>
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="surface overflow-hidden">
            <div className="flex flex-col">
              {recentPatients.map((patient, idx) => (
                <Link 
                  to={`/patient/${patient.id}/timeline`}
                  key={idx} 
                  className="flex items-center justify-between p-5 transition-colors"
                  style={{ 
                    borderBottom: idx !== recentPatients.length - 1 ? '1px solid var(--border)' : 'none',
                    textDecoration: 'none',
                    backgroundColor: 'var(--bg-surface)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-main)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                >
                  <div>
                    <h3 className="text-base font-bold m-0 text-primary">{patient.name}</h3>
                    <p className="text-sm text-secondary m-0 mt-1">
                      ID: {patient.id} &middot; {patient.age}yo &middot; {patient.records} records
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted">{patient.lastUpdate}</span>
                    <span className={`badge ${patient.status === 'Review Needed' ? 'badge-warning' : 'badge-neutral'}`}>
                      {patient.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Changes & Alerts */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold m-0">Recent Changes Alerts</h2>
          <div className="surface p-5 flex flex-col gap-4 h-full">
            <div className="p-3 rounded-md flex gap-3 items-start" style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <Activity className="w-5 h-5 text-warning flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold m-0" style={{ color: '#92400E' }}>Rahul Mehta</p>
                <p className="text-sm m-0 mt-1" style={{ color: '#92400E' }}>3 medication changes detected in latest admission notes.</p>
              </div>
            </div>
            
            <div className="p-3 rounded-md flex gap-3 items-start" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid #BFDBFE' }}>
              <FileText className="w-5 h-5 text-blue flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold m-0" style={{ color: '#1E3A8A' }}>Devendra Kulkarni</p>
                <p className="text-sm m-0 mt-1" style={{ color: '#1E3A8A' }}>2 new investigations added. Results available.</p>
              </div>
            </div>

            <div className="p-3 rounded-md flex gap-3 items-start" style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold m-0" style={{ color: '#991B1B' }}>Rahul Mehta</p>
                <p className="text-sm m-0 mt-1" style={{ color: '#991B1B' }}>1 potential contradiction regarding ongoing dosage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
