import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

const RECENT_LOGS = [
    { name: 'Dr. Sarah Smith', id: 'NMC-88219', status: 'VERIFIED', time: '2 mins ago' },
    { name: 'Apex Heart Centre', id: 'REG-4402', status: 'FLAGGED', time: '5 mins ago' },
    { name: 'Dr. R. Obaid', id: 'EXP-1029', status: 'REJECTED', time: '12 mins ago' },
    { name: 'City Care Clinic', id: 'NMC-99100', status: 'VERIFIED', time: '15 mins ago' },
    { name: 'Dr. V. K. Singh', id: 'NMC-22019', status: 'VERIFIED', time: '22 mins ago' }
];

function RecentActivity() {
    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Network Activity</h2>
                <span className="live-badge">
                    <span className="live-dot"></span> LIVE
                </span>
            </div>

            <div className="activity-list">
                {RECENT_LOGS.map((log, index) => (
                    <div key={index} className="activity-item">
                        <div className="activity-icon">
                            {log.status === 'VERIFIED' && <CheckCircle size={18} color="var(--success)" />}
                            {log.status === 'FLAGGED' && <AlertTriangle size={18} color="var(--warning)" />}
                            {log.status === 'REJECTED' && <XCircle size={18} color="var(--danger)" />}
                        </div>
                        <div className="activity-details">
                            <div className="activity-name">{log.name}</div>
                            <div className="activity-meta">
                                <span>{log.id}</span>
                                <span className="separator">•</span>
                                <span>{log.time}</span>
                            </div>
                        </div>
                        <div className={`status-tag ${log.status.toLowerCase()}`}>
                            {log.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentActivity;
