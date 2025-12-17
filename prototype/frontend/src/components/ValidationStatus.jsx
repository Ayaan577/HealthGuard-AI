import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Circle, Clock, Check } from 'lucide-react';
import MapComponent from './MapComponent';
import { generatePDF } from '../utils/pdfGenerator';

const STEPS = [
    { id: 'registry', label: 'NMC Registry' },
    { id: 'geo', label: 'Geocoding' },
    { id: 'score', label: 'Scoring' }
];

const CONTEXT_MAP = {
    "NMC Registry": "Official Government Database Check",
    "Geolocation": "Satellite Address Verification",
    "AI Risk Assessment": "Critical Safety Logic"
};

function ValidationStatus({ loading, result, onReset }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (loading) {
            setCurrentStepIndex(0);
            intervalRef.current = setInterval(() => {
                setCurrentStepIndex(prev => {
                    if (prev < STEPS.length - 1) return prev + 1;
                    return prev;
                });
            }, 1500);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (result) setCurrentStepIndex(STEPS.length);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [loading, result]);

    if (!loading && !result) return (
        <div className="card result-placeholder">
            <div style={{ textAlign: 'center', opacity: 0.5 }}>
                <Clock size={48} style={{ marginBottom: '1rem', color: 'var(--ey-black)' }} />
                <p>Ready to Analyze</p>
            </div>
        </div>
    );

    return (
        <div className="card">
            <h2>Validation Protocol</h2>

            {/* Horizontal Stepper */}
            <div className="horizontal-stepper">
                {STEPS.map((step, index) => {
                    let status = 'pending';
                    if (index < currentStepIndex) status = 'completed';
                    if (index === currentStepIndex && loading) status = 'active';
                    if (!loading && result) status = 'completed';

                    return (
                        <div key={step.id} className={`stepper-item ${status}`}>
                            <div className="step-icon-wrapper">
                                {status === 'completed' ? (
                                    <div className="icon-box completed" style={{
                                        background: 'var(--ey-yellow)',
                                        borderColor: 'var(--ey-black)',
                                        color: 'var(--ey-black)'
                                    }}><Check size={16} strokeWidth={3} /></div>
                                ) : status === 'active' ? (
                                    <div className="icon-box active" style={{
                                        borderColor: 'var(--ey-yellow)',
                                        color: 'var(--ey-black)'
                                    }}><Loader2 size={16} className="animate-spin" /></div>
                                ) : (
                                    <div className="icon-box pending" style={{
                                        borderColor: 'var(--ey-silver)'
                                    }}><Circle size={16} color="var(--ey-silver)" /></div>
                                )}
                            </div>
                            <span className="step-label" style={{ color: 'var(--ey-black)' }}>{step.label}</span>
                            {index < STEPS.length - 1 && <div className={`step-line`} style={{
                                background: status === 'completed' ? 'var(--ey-yellow)' : 'var(--ey-silver)',
                                height: '2px'
                            }} />}
                        </div>
                    )
                })}
            </div>

            {result && !loading && (
                <div className="final-result-container">
                    <div className="score-section" style={{ background: 'var(--bg-secondary)', border: 'none' }}>
                        <div className="score-value" style={{
                            color: 'var(--ey-black)' // Always black per EY guidelines
                        }}>
                            {Math.round(result.final_trust_score)}
                        </div>
                        <div className="score-label">TRUST SCORE</div>
                        <div style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '2px',
                            background: result.final_trust_score >= 90 ? 'var(--ey-teal)' :
                                result.final_trust_score >= 70 ? 'var(--warning)' : 'var(--danger)',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            display: 'inline-block'
                        }}>
                            {result.final_trust_score >= 90 ? "HIGH TRUST / VERIFIED" :
                                result.final_trust_score >= 70 ? "MODERATE / PROCEED WITH CAUTION" :
                                    "HIGH RISK / DO NOT TRUST"}
                        </div>
                        {onReset && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                                <button
                                    onClick={onReset}
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        fontSize: '0.8rem',
                                        background: 'white',
                                        border: '1px solid var(--ey-black)',
                                        borderRadius: '2px',
                                        color: 'var(--ey-black)',
                                        fontWeight: 600
                                    }}
                                >
                                    NEW VALIDATION
                                </button>
                                <button
                                    onClick={() => generatePDF(result)}
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        fontSize: '0.8rem',
                                        background: 'var(--ey-black)',
                                        border: '1px solid var(--ey-black)',
                                        borderRadius: '2px',
                                        color: 'white',
                                        fontWeight: 600
                                    }}
                                >
                                    DOWNLOAD REPORT
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="details-grid">
                        <h3 style={{ gridColumn: '1 / -1', fontSize: '1rem', marginBottom: '0.5rem', borderBottom: '2px solid var(--ey-yellow)', display: 'inline-block', paddingBottom: '4px' }}>ANALYSIS EVIDENCE</h3>
                        {result.validation_results
                            .filter(log => !(log.source === "AI Risk Assessment" && log.message.includes("NMC Registry Check Failed")))
                            .map((log, index) => (
                                <div key={index} className="detail-card" style={{
                                    borderLeft: `4px solid ${log.status === 'VERIFIED' ? 'var(--ey-teal)' : log.status === 'CRITICAL' ? 'var(--danger)' : 'var(--ey-silver)'}`,
                                    flexDirection: log.source === "Geolocation" ? 'column' : 'row',
                                    alignItems: log.source === "Geolocation" ? 'stretch' : 'center',
                                    gap: log.source === "Geolocation" ? '0.5rem' : '0'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <div style={{ minWidth: '140px' }}>
                                            <span className="detail-source" style={{ color: 'var(--ey-black)', fontWeight: 700 }}>{log.source}</span>
                                            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>
                                                {CONTEXT_MAP[log.source] || "Automated process"}
                                            </div>
                                        </div>
                                        <p className="detail-message" style={{ flex: 1, textAlign: 'right', fontWeight: 500 }}>{log.message}</p>
                                    </div>
                                    {log.source === "Geolocation" && log.coordinates && (
                                        <MapComponent
                                            lat={log.coordinates.lat}
                                            lng={log.coordinates.lng}
                                            popupText={log.formatted_address}
                                        />
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
export default ValidationStatus;
