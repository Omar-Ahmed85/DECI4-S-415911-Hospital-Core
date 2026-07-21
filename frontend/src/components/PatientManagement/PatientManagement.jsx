import { useState } from 'react';
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient, useSearchPatients, usePatientHistory, useCreateMedicalHistory } from '../../hooks/useApi';

export default function PatientManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [showHistory, setShowHistory] = useState(null);
    const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', contact: '', address: '', medicalHistory: { diagnosis: '', treatment: '', notes: '' } });

    const { data: allPatients = [], isLoading } = usePatients();
    const { data: searchResults = [] } = useSearchPatients(searchQuery);
    const { data: history = [] } = usePatientHistory(showHistory || editingId);
    const createMutation = useCreatePatient();
    const updateMutation = useUpdatePatient();
    const deleteMutation = useDeletePatient();
    const createMedicalHistoryMutation = useCreateMedicalHistory();

    const patients = searchQuery ? searchResults : allPatients;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate({ id: editingId, data: formData }, {
                onSuccess: () => {
                    setEditingId(null);
                    setShowAdd(false);
                    setFormData({ name: '', age: '', gender: 'Male', contact: '', address: '', medicalHistory: { diagnosis: '', treatment: '', notes: '' } });
                }
            });
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    setShowAdd(false);
                    setFormData({ name: '', age: '', gender: 'Male', contact: '', address: '', medicalHistory: { diagnosis: '', treatment: '', notes: '' } });
                }
            });
        }
    };

    const handleEdit = (patient) => {
        setEditingId(patient._id);
        setFormData({ name: patient.name, age: patient.age, gender: patient.gender, contact: patient.contact || '', address: patient.address || '', medicalHistory: { diagnosis: '', treatment: '', notes: '' } });
        setShowAdd(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Remove this patient from the registry?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleCancel = () => {
        setShowAdd(false);
        setEditingId(null);
        setFormData({ name: '', age: '', gender: 'Male', contact: '', address: '', medicalHistory: { diagnosis: '', treatment: '', notes: '' } });
    };

    const handleAddHistoryEntry = (e) => {
        e.preventDefault();
        if (!formData.medicalHistory.diagnosis) return;
        const patientId = editingId;
        createMedicalHistoryMutation.mutate(
            { patientId, data: formData.medicalHistory },
            {
                onSuccess: () => {
                    setFormData({ ...formData, medicalHistory: { diagnosis: '', treatment: '', notes: '' } });
                }
            }
        );
    };

    if (isLoading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-charcoal-soft)' }}>Loading patient registry...</div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <span className="eyebrow">Clinical registry</span>
                    <h1>Patient directory</h1>
                    <p>Manage enrolled individuals, medical histories, and contact records.</p>
                </div>
                <button onClick={() => (showAdd ? handleCancel() : setShowAdd(true))}>
                    {showAdd ? 'Cancel' : '+ New patient'}
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name or contact..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && <button className="secondary sm" onClick={() => setSearchQuery('')}>Clear</button>}
            </div>

            {showAdd && (
                <div className="card keylime" style={{ marginBottom: '24px' }}>
                    <h3>{editingId ? 'Update patient record' : 'Register new patient'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="field-grid">
                            <div className="field">
                                <label>Full name</label>
                                <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="field">
                                <label>Age</label>
                                <input type="number" placeholder="35" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} required min="0" />
                            </div>
                            <div className="field">
                                <label>Gender</label>
                                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="field">
                                <label>Contact</label>
                                <input type="text" placeholder="555-0101" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                            </div>
                        </div>
                        <div className="field" style={{ marginBottom: '18px' }}>
                            <label>Address</label>
                            <input type="text" placeholder="123 Main St, New York" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                        <div style={{ borderTop: '1px solid var(--color-border-mist)', paddingTop: '18px', marginTop: '4px' }}>
                            <span className="eyebrow">Medical history</span>
                            {editingId && history.length > 0 && (
                                <ul className="history-list" style={{ marginBottom: '18px' }}>
                                    {history.map((h) => (
                                        <li key={h._id} className="history-item">
                                            <div className="row">
                                                <span className="diagnosis">{h.diagnosis}</span>
                                                <span className="badge keylime">{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <p className="meta"><strong>Treatment:</strong> {h.treatment || 'N/A'}</p>
                                            <p className="meta"><strong>Notes:</strong> {h.notes || 'N/A'}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div>
                                <div className="field-grid">
                                    <div className="field">
                                        <label>New diagnosis</label>
                                        <input type="text" placeholder="Hypertension" value={formData.medicalHistory.diagnosis} onChange={(e) => setFormData({ ...formData, medicalHistory: { ...formData.medicalHistory, diagnosis: e.target.value } })} />
                                    </div>
                                    <div className="field">
                                        <label>Treatment</label>
                                        <input type="text" placeholder="ACE inhibitor" value={formData.medicalHistory.treatment} onChange={(e) => setFormData({ ...formData, medicalHistory: { ...formData.medicalHistory, treatment: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="field" style={{ marginBottom: '14px' }}>
                                    <label>Notes</label>
                                    <input type="text" placeholder="Stable blood pressure" value={formData.medicalHistory.notes} onChange={(e) => setFormData({ ...formData, medicalHistory: { ...formData.medicalHistory, notes: e.target.value } })} />
                                </div>
                                {editingId && formData.medicalHistory.diagnosis && (
                                    <button type="button" className="ghost" onClick={handleAddHistoryEntry} style={{ marginBottom: '14px' }}>Add history entry</button>
                                )}
                            </div>
                        </div>
                        <div className="btn-row">
                            <button type="submit">{editingId ? 'Save changes' : 'Add to registry'}</button>
                            <button type="button" className="ghost" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card table-card">
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border-mist)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ marginBottom: '4px' }}>Enrolled patients</h2>
                        <p style={{ fontSize: '14px', color: 'var(--color-charcoal-soft)' }}>Active care registry with contact and demographic records</p>
                    </div>
                    <span className="section-tag">{patients.length} {patients.length === 1 ? 'record' : 'records'}</span>
                </div>
                {patients.length === 0 ? (
                    <div className="empty-row">No patients found</div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Contact</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map(p => (
                                    <tr key={p._id}>
                                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                                        <td>{p.age}</td>
                                        <td><span className={`badge ${p.gender === 'Female' ? 'slate' : p.gender === 'Male' ? 'sage' : 'warning'}`}>{p.gender}</span></td>
                                        <td>{p.contact}</td>
                                        <td className="actions">
                                            <button className="ghost sm" onClick={() => handleEdit(p)}>Edit</button>
                                            <button className="danger sm" onClick={() => handleDelete(p._id)}>Delete</button>
                                            <button className="secondary sm" onClick={() => setShowHistory(p._id)}>History</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showHistory && (
                <div className="modal-overlay" onClick={() => setShowHistory(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <span className="eyebrow">Clinical record</span>
                                <h3>Medical history · {patients.find(p => p._id === showHistory)?.name || 'Patient'}</h3>
                            </div>
                            <button className="modal-close" onClick={() => setShowHistory(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            {history.length === 0 ? (
                                <p className="empty">No medical history on file</p>
                            ) : (
                                <ul className="history-list">
                                    {history.map(h => (
                                        <li key={h._id} className="history-item">
                                            <div className="row">
                                                <span className="diagnosis">{h.diagnosis}</span>
                                                <span className="badge keylime">{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <p className="meta"><strong>Treatment:</strong> {h.treatment || 'N/A'}</p>
                                            <p className="meta"><strong>Notes:</strong> {h.notes || 'N/A'}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
