import React from 'react';
import { User, FileText, MapPin, Shield } from 'lucide-react';

function ProviderDetails({ result }) {
    if (!result) {
        return (
            <div className="card" style={{ justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', textAlign: 'center', minHeight: '300px' }}>
                <User size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>Provider details will appear here<br />after validation begins.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Provider Profile</h2>

            <div className="detail-row" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 700 }}>
                    <User size={14} />
                    <span>FULL NAME</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{result.provider_name}</div>
            </div>

            <div className="detail-row" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <FileText size={14} />
                    <span>REGISTRATION NUMBER</span>
                </div>
                <div style={{ fontSize: '1rem', fontFamily: 'monospace', background: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '12px', display: 'inline-block', border: '1px solid var(--border-color)' }}>
                    {result.reg_no}
                </div>
            </div>

            <div className="detail-row" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <MapPin size={14} />
                    <span>CLAIMED ADDRESS</span>
                </div>
                <div style={{ fontSize: '1rem', lineHeight: '1.5' }}>{result.address}</div>
            </div>

            {/* Enhanced Footer Section */}
            <div className="detail-row" style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>

                {/* Dynamic Credential Info (Replaces Redundant Status) */}
                {(() => {
                    // Try to find registry data
                    const registryInfo = result.validation_results ? result.validation_results.find(r => r.source === 'NMC Registry') : null;

                    if (registryInfo && (registryInfo.council || registryInfo.qualifications)) {
                        return (
                            <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                        <FileText size={14} />
                                        <span>QUALIFICATION</span>
                                    </div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                                        {registryInfo.qualifications ? registryInfo.qualifications.join(", ") : "N/A"}
                                    </div>
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                        <Shield size={14} />
                                        <span>COUNCIL</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={registryInfo.council}>
                                        {registryInfo.council}
                                    </div>
                                </div>
                                {registryInfo.college && (
                                    <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                            <FileText size={14} />
                                            <span>UNIVERSITY / COLLEGE</span>
                                        </div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                                            {registryInfo.college}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    } else {
                        // Fallback if no registry info found (e.g. not verified)
                        return (
                            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 600 }}>
                                <Shield size={16} />
                                <span>Registry Details Not Verified</span>
                            </div>
                        );
                    }
                })()}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.2rem' }}>TRUST SCORE</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {Math.round(result.final_trust_score)}<span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/100</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.2rem' }}>VERIFIED ON</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                            {result.timestamp ? new Date(result.timestamp).toLocaleDateString() : 'Just now'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {result.timestamp ? new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderDetails;
