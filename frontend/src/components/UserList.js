import React, {useState, useEffect} from 'react';
import {getUsers, deleteUser} from '../api/api';
import UserCard from './UserCard';
import LoadingSpinner from './LoadingSpinner';
import './UserList.css';

const UserList = ({onEdit, refresh }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const loadUsers = async () => { 
        try {
            setLoading(true);
            setError(null);
            const response = await getUsers();
            setUsers(response.data.data || [] );
        } catch (error) {
            setError('Failed to fetch users. Please try again later.');
        }  finally {
            setLoading(false);
        }   
    };

    useEffect (() => {
        loadUsers();
    }, [refresh]);

    const handleDelete = async (id) => {
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
    if (error) return (
    <div className="error-message">
        <p>{error}</p>
        <button onClick={loadUsers} className="retry-button">Retry</button>
    </div>
    );


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
                <h2>User List ({users.length})</h2>
                </div>
                {users.map((user) => (
                    <UserCard
                        key={user._id}
                        user={user}
                        onEdit={onEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
    
    );  
};
export default UserList;