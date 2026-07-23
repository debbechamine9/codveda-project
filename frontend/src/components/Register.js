import React, { useState } from 'react';
import { register } from '../api/api';
import './Register.css';

const Register = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

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
        setError('');
        setSuccess('');

        try {
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                age: parseInt(formData.age) || 18
            };

            console.log('Register attempt:', dataToSend);
            const response = await register(dataToSend);
            console.log('Register response:', response.data);

            if (response.data.success) {
                setSuccess('Registration successful! Please login.');
                setFormData({ name: '', email: '', password: '', age: '' });
                setTimeout(() => {
                    onSwitchToLogin();
                }, 2000);
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Register error:', err);
            console.error('Response:', err.response?.data);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>➕Register</h2>
                <p>Create your account to get started</p>

                {error && (
                    <div className="register-error">
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="register-success">
                        <p>{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="register-group">
                        <label>Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                            minLength={3}
                        />
                    </div>

                    <div className="register-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="register-group">
                        <label>Password *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password (min 6 chars)"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="register-group">
                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter your age"
                            min="18"
                            max="120"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="register-button">
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="switch-link">
                    Already have an account?{' '}
                    <span onClick={onSwitchToLogin} className="link-text">
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;