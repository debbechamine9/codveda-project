import React, { useState, useEffect } from 'react';
import { createUser, updateUser } from '../api/api';
import './UserForm.css';

const UserForm = ({ user, onSuccess, onCancel, currentUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                age: user.age || '',
                password: ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                age: '',
                password: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = {
                name: formData.name,
                email: formData.email,
                age: parseInt(formData.age) || 18
            };

            if (formData.password && formData.password.length >= 6) {
                data.password = formData.password;
            }

            let response;
            if (user) {
                response = await updateUser(user._id, data);
            } else {
                if (!formData.password) {
                    setError('Password is required for new users');
                    setLoading(false);
                    return;
                }
                response = await createUser(data);
            }

            if (response.data.success) {
                alert(user ? 'User updated successfully!' : 'User created successfully!');
                onSuccess();
            } else {
                setError(response.data.message || 'Error during the operation');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || 'Server connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="user-form" onSubmit={handleSubmit}>
            <h3>{user ? 'Edit User' : 'Create User'}</h3>

            {error && (
                <div className="form-error">
                    <p>{error}</p>
                </div>
            )}

            <div className="form-group">
                <label>Name *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter name"
                    minLength={3}
                />
            </div>

            <div className="form-group">
                <label>Email *</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                />
            </div>

            <div className="form-group">
                <label>Age</label>
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    min="18"
                    max="120"
                />
            </div>

            <div className="form-group">
                <label>
                    {user ? 'New Password (optional)' : 'Password *'}
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={user ? 'Enter new password (min 6 chars)' : 'Enter password (min 6 chars)'}
                    minLength={6}
                    required={!user}
                />
                {user && (
                    <small style={{ color: '#6c6c8a', fontSize: '12px' }}>
                        Leave empty to keep current password
                    </small>
                )}
            </div>

            <div className="form-actions">
                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'Submitting...' : (user ? 'Update User' : 'Create User')}
                </button>
                <button type="button" onClick={onCancel} className="cancel-button">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default UserForm;