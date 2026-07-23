import React, { useState } from 'react';
import { login } from '../api/api';
import './Login.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log(' Login attempt:', email);
            const response = await login({ email, password });
            console.log(' Login response:', response.data);
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                onLogin(response.data.user);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2> 🔐Login</h2>
                <p>Enter your credentials to access the dashboard</p>

                {error && (
                    <div className="login-error">
                        <p> {error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="login-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="login-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? ' Loading...' : ' Login'}
                    </button>
                </form>

                <p className="switch-link">
                    Don't have an account?{' '}
                    <span onClick={onSwitchToRegister} className="link-text">
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;