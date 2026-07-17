import React from 'react';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import './UserCard.css';
const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
        <div className="user-avatar">
            <FaUser />
        </div>
        <div className="user-info">
            <h3>{user.name}</h3>
            <p className="user-email">{user.email}</p>
            <p className="user-age">Age: {user.age} Age</p>
            <p className="user-date"> created at: {new Date(user.createdAt).toLocaleDateString()}</p>       
</div>
<div className="user-actions">
    <button onClick={() => onEdit(user)} className="edit-button">
        <FaEdit /> Edit
    </button>
    <button onClick={() => onDelete(user._id)} className="delete-button">
        <FaTrash /> Delete
    </button>
    </div>
</div>
  );
};
export default UserCard;