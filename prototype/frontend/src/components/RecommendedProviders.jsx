import React from 'react';
import { UserCheck, Star, MapPin, ArrowRight } from 'lucide-react';

const MOCK_RECOMMENDATIONS = [
    { name: "Dr. Priya Sharma", reg: "NMC-88321", address: "Apollo White Dental, Indiranagar", rating: 4.9, dept: "Dentistry" },
    { name: "Dr. Rahul Verma", reg: "NMC-99102", address: "Manipal Hospital, Old Airport Road", rating: 4.8, dept: "Dentistry" },
    { name: "Dr. Anjali Gupta", reg: "NMC-77210", address: "Fortis Hospital, Bannerghatta Road", rating: 4.9, dept: "Cardiology" },
    { name: "Dr. Vikram Singh", reg: "NMC-66543", address: "Narayana Health City", rating: 4.7, dept: "Cardiology" },
    { name: "Dr. Sneha Reddy", reg: "NMC-55987", address: "Aster CMI Hospital, Hebbal", rating: 4.8, dept: "Pediatrics" },
    { name: "Dr. Arjun Mehta", reg: "NMC-44321", address: "Cloudnine Hospital, Jayanagar", rating: 4.9, dept: "Pediatrics" }
];

function RecommendedProviders({ department }) {
    // Strict Filter: Only show matches. If no department, show nothing.
    const filtered = department
        ? MOCK_RECOMMENDATIONS.filter(r => r.dept.toLowerCase().includes(department.toLowerCase()) || department.toLowerCase().includes(r.dept.toLowerCase()))
        : [];

    // Only show if we have matches
    const displayList = filtered;

    if (displayList.length === 0) return null; // Hide if no relevant results

    return (
        <div className="card" style={{ marginTop: '2rem', borderTop: '4px solid var(--ey-yellow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, border: 'none', padding: 0, fontSize: '1.3rem' }}>Recommended Providers</h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1rem' }}>
                Top rated verified specialists in <strong>{department || "your area"}</strong>:
            </p>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {displayList.slice(0, 2).map((doc, index) => (
                    <div key={index} style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid transparent',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ey-yellow)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                    >
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ey-black)' }}>{doc.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{doc.dept}</span>
                                <span style={{ width: '4px', height: '4px', background: 'var(--ey-silver)', borderRadius: '50%' }}></span>
                                <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', background: 'white', padding: '0 4px', borderRadius: '4px', border: '1px solid #ddd' }}>{doc.reg}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                <MapPin size={12} /> {doc.address}
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end', fontWeight: 800, fontSize: '1.2rem', color: 'var(--ey-black)' }}>
                                {doc.rating} <Star size={14} fill="var(--ey-black)" />
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.8rem',
                                color: 'var(--ey-teal)',
                                fontWeight: 700,
                                marginTop: '0.25rem',
                                cursor: 'pointer'
                            }}>
                                VIEW <ArrowRight size={12} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecommendedProviders;
