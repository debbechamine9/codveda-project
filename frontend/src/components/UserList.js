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

    console.log('currentUser:', currentUser);
    console.log('isAdmin:', isAdmin);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (isAdmin) {
                console.log('Fetching all users (admin)');
                const response = await getUsers();
                console.log('Response:', response.data);
                setUsers(response.data.data || []);
            } else {
                console.log('Fetching own profile (user)');
                const response = await getMe();
                console.log('Response:', response.data);
                setUsers([response.data.data]);
            }
        } catch (error) {
            console.error('Load users error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            if (error.response?.status === 403) {
                setError('You do not have permission to view all users. Showing your profile only.');
                try {
                    const meResponse = await getMe();
                    setUsers([meResponse.data.data]);
                    setError(null);
                } catch (meError) {
                    setError('Failed to load your profile.');
                }
            } else {
                setError(error.response?.data?.message || 'Failed to load users. Please try again.');
            }
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
                alert('User deleted successfully!');
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete user.');
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
            </div>
        );
    }

    return (
        <div className="user-list">
            <div className="user-list-header">
                <h2>👥 {isAdmin ? 'All Users' : 'My Profile'}</h2>
                {isAdmin && <span className="admin-badge">Admin</span>}
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