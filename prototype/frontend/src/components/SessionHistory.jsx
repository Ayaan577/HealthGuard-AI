import React from 'react';
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

function SessionHistory({ history, onSelect }) {
    if (!history || history.length === 0) return null;

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Clock size={20} className="text-secondary" />
                <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Checks</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                {history.map((item, index) => {
                    const isVerified = item.status === 'VERIFIED';
                    const isFlagged = item.status === 'FLAGGED';
                    const color = isVerified ? 'var(--success)' : isFlagged ? 'var(--warning)' : 'var(--danger)';
                    const Icon = isVerified ? CheckCircle : isFlagged ? AlertTriangle : XCircle;

                    return (
                        <div
                            key={index}
                            className="history-item"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                borderLeft: `4px solid ${color}`,
                                cursor: onSelect ? 'pointer' : 'default'
                            }}
                            onClick={() => onSelect && onSelect(item)}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.provider_name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {new Date(item.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 700, color: color }}>{Math.round(item.final_trust_score)}</span>
                                <Icon size={16} color={color} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SessionHistory;
