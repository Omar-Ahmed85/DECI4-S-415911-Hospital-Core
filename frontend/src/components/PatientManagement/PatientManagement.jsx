import { useState } from 'react';
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient, useSearchPatients, usePatientHistory } from '../../hooks/useApi';

export default function PatientManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [showHistory, setShowHistory] = useState(null);
    const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', contact: '', address: '' });

    const { data: allPatients = [], isLoading } = usePatients();
    const { data: searchResults = [] } = useSearchPatients(searchQuery);
    const { data: history = [] } = usePatientHistory(showHistory);
    const createMutation = useCreatePatient();
    const updateMutation = useUpdatePatient();
    const deleteMutation = useDeletePatient();

    const patients = searchQuery ? searchResults : allPatients;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate({ id: editingId, data: formData }, {
                onSuccess: () => {
                    setEditingId(null);
                    setFormData({ name: '', age: '', gender: 'Male', contact: '', address: '' });
                }
            });
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    setShowAdd(false);
                    setFormData({ name: '', age: '', gender: 'Male', contact: '', address: '' });
                }
            });
        }
    };

    const handleEdit = (patient) => {
        setEditingId(patient._id);
        setFormData({
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            contact: patient.contact || '',
            address: patient.address || ''
        });
        setShowAdd(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this patient?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleCancel = () => {
        setShowAdd(false);
        setEditingId(null);
        setFormData({ name: '', age: '', gender: 'Male', contact: '', address: '' });
    };

    if (isLoading) return <div>Loading patients...</div>;

    return (
        <div>
            <h1>Patient Management</h1>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Search patients by name or contact..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1, padding: '8px', fontSize: '1em' }}
                />
                <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '8px 16px' }}>
                    {showAdd ? 'Cancel' : 'Add Patient'}
                </button>
            </div>

            {showAdd && (
                <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h3>{editingId ? 'Edit Patient' : 'Add New Patient'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Name: </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Age: </label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                required
                                min="0"
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Gender: </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                style={{ width: '100%', padding: '8px' }}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Contact: </label>
                            <input
                                type="text"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Address: </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ padding: '8px 16px' }}>
                                {editingId ? 'Update' : 'Create'}
                            </button>
                            <button type="button" onClick={handleCancel} style={{ padding: '8px 16px' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {patients.length === 0 ? (
                <p>No patients found.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #333' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Age</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Gender</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Contact</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(p => (
                            <tr key={p._id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{p.name}</td>
                                <td style={{ padding: '10px' }}>{p.age}</td>
                                <td style={{ padding: '10px' }}>{p.gender}</td>
                                <td style={{ padding: '10px' }}>{p.contact}</td>
                                <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                                    <button onClick={() => handleEdit(p)} style={{ padding: '4px 8px' }}>Edit</button>
                                    <button onClick={() => handleDelete(p._id)} style={{ padding: '4px 8px' }}>Delete</button>
                                    <button onClick={() => setShowHistory(p._id)} style={{ padding: '4px 8px' }}>History</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showHistory && (
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3>Medical History</h3>
                        <button onClick={() => setShowHistory(null)} style={{ padding: '4px 8px' }}>Close</button>
                    </div>
                    {history.length === 0 ? (
                        <p>No medical history found.</p>
                    ) : (
                        <ul>
                            {history.map(h => (
                                <li key={h._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <strong>{new Date(h.date).toLocaleDateString()}</strong> - {h.diagnosis}
                                    <br />
                                    <em>Treatment:</em> {h.treatment || 'N/A'}
                                    <br />
                                    <em>Notes:</em> {h.notes || 'N/A'}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
