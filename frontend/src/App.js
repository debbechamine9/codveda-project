import React, { useState, useEffect } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';          // <-- ADDED
import { FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setIsAuthenticated(true);
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setCurrentUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingUser(null);
        setRefreshKey(prev => prev + 1);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingUser(null);
    };

    if (!isAuthenticated) {
        if (showRegister) {
            return <Register onSwitchToLogin={() => setShowRegister(false)} />;
        }
        return <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />;
    }

    const isAdmin = currentUser?.role === 'admin';

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-left">
                    <h1>👥 User Management</h1>
                    <span className="user-badge">
                        {currentUser?.role === 'admin' ? '' : '👤'} {currentUser?.name}
                    </span>
                    {isAdmin && <span className="admin-badge">👑 Admin</span>}
                </div>
                <div className="header-right">
                    {isAdmin && (
                        <button
                            className="add-user-button"
                            onClick={() => {
                                setEditingUser(null);
                                setShowForm(true);
                            }}
                        >
                            <FaUserPlus /> Add User
                        </button>
                    )}
                    <button onClick={handleLogout} className="logout-button">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </header>

            <main className="app-main">
                {showForm && (
                    <UserForm
                        user={editingUser}
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                        currentUser={currentUser}
                    />
                )}

                <UserList
                    onEdit={handleEdit}
                    refresh={refreshKey}
                    currentUser={currentUser}
                />

                {/* ===== ADD CHAT COMPONENT ===== */}
                <Chat currentUser={currentUser} />
            </main>
        </div>
    );
}

export default App;