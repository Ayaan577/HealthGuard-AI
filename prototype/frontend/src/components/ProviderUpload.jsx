import React, { useState } from 'react';

function ProviderUpload({ onValidate, loading }) {
    const [formData, setFormData] = useState({
        name: '',
        reg_no: '',
        address: '',
        department: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onValidate(formData);
    };

    return (
        <div className="card">
            <h2>ENTER PROVIDER DETAILS</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Dr. Rajesh Koothrappali"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Registration Number</label>
                    <input
                        type="text"
                        name="reg_no"
                        value={formData.reg_no}
                        onChange={handleChange}
                        placeholder="e.g., NMC-12345 (Use 'EXP-...' for expired test)"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Department</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="e.g. Cardiology, Pediatrics"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Claimed Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Full Clinic/Hospital Address"
                        required
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Validating..." : "Validate Provider"}
                </button>
            </form>
        </div>
    );
}

export default ProviderUpload;
