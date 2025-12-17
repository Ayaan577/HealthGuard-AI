import React from 'react';
import { Server, Zap, Shield, Activity } from 'lucide-react';

function SystemMetrics() {
    return (
        <div className="card" style={{ marginTop: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>System Guard Status</h2>
                <div className="status-indicator">
                    <span className="indicator-dot"></span> All Systems Operational
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
                <div className="metric-box">
                    <div className="metric-header">
                        <Zap size={16} color="var(--warning)" />
                        <span>Avg Latency</span>
                    </div>
                    <div className="metric-value">124ms</div>
                    <div className="metric-sub">Global CDN</div>
                </div>

                <div className="metric-box">
                    <div className="metric-header">
                        <Server size={16} color="var(--text-primary)" />
                        <span>Registry Uptime</span>
                    </div>
                    <div className="metric-value">99.99%</div>
                    <div className="metric-sub">NMC / ABDM</div>
                </div>

                <div className="metric-box">
                    <div className="metric-header">
                        <Shield size={16} color="var(--success)" />
                        <span>Threats Blocked</span>
                    </div>
                    <div className="metric-value">42</div>
                    <div className="metric-sub">Last 24h</div>
                </div>

                <div className="metric-box">
                    <div className="metric-header">
                        <Activity size={16} color="#3b82f6" />
                        <span>Validations</span>
                    </div>
                    <div className="metric-value">12.5k</div>
                    <div className="metric-sub">Today</div>
                </div>
            </div>

            {/* Simulated Throughput Graph */}
            <div className="throughput-section" style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Real-time Throughput (1h)</h3>
                <div className="graph-bars">
                    {[40, 65, 30, 80, 55, 90, 45, 60, 75, 50, 85, 95, 60, 40, 70].map((h, i) => (
                        <div key={i} className="bar" style={{ height: `${h}%` }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SystemMetrics;
