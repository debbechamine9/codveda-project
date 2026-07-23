import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, getMe } from '../api/api';
import UserCard from './UserCard';
import LoadingSpinner from './LoadingSpinner';
import './UserList.css';

const UserList = ({ onEdit, refresh, currentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAdmin = currentUser?.role === 'admin';

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            if (isAdmin) {
                // Admin: get all users
                const response = await getUsers();
                setUsers(response.data.data || []);
            } else {
                // Regular user: get only own profile
                const response = await getMe();
                setUsers([response.data.data]);
            }
        } catch (err) {
            console.error('Load users error:', err);
            setError('Failed to fetch users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [refresh]);

    const handleDelete = async (id) => {
        if (!isAdmin) {
            alert('Only admins can delete users.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                setUsers(users.filter((user) => user._id !== id));
            } catch (error) {
                alert('Failed to delete user. Please try again later.');
                console.error(error);
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
                <button onClick={loadUsers} className="retry-button">Retry</button>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="empty-state">
                <p>No users found.</p>
                <p>Click the "Add User" button to create a new user.</p>
            </div>
        );
    }

    return (
        <div className="user-list">
            <div className="user-list-header">
                <h2>{isAdmin ? 'User List' : 'My Profile'} ({users.length})</h2>
                {isAdmin && <span className="admin-badge">👑 Admin</span>}
            </div>
            {users.map((user) => (
                <UserCard
                    key={user._id}
                    user={user}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                    isAdmin={isAdmin}
                    currentUserId={currentUser?.id}
                />
            ))}
        </div>
    );
};

export default UserList;