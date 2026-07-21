import React from 'react';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import './UserCard.css';

const UserCard = ({ user, onEdit, onDelete, isAdmin, currentUserId }) => {
    const isOwner = currentUserId === user._id;
    const canEdit = isAdmin || isOwner;
    const canDelete = isAdmin;

    return (
        <div className="user-card">
            <div className="user-avatar">
                <FaUser />
            </div>
            <div className="user-info">
                <h3>{user.name}</h3>
                <p className="user-email">{user.email}</p>
                <p className="user-age">Age: {user.age} years</p>
                <p className="user-role">
                    Role: <span className={user.role === 'admin' ? 'role-admin' : 'role-user'}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                </p>
                <p className="user-date">
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                </p>
            </div>
            <div className="user-actions">
                {canEdit && (
                    <button onClick={() => onEdit(user)} className="edit-button">
                        <FaEdit /> Edit
                    </button>
                )}
                {canDelete && (
                    <button onClick={() => onDelete(user._id)} className="delete-button">
                        <FaTrash /> Delete
                    </button>
                )}
                {!canEdit && !canDelete && (
                    <span className="read-only-badge">Read Only</span>
                )}
            </div>
        </div>
    );
};

export default UserCard;