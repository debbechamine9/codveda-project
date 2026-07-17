import React, {useState} from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import {FaUserPlus} from 'react-icons/fa';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [refreshList, setRefreshKey] = useState(0);

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>User Management</h1>
        <button 
        className="add-user-button"
        onClick={() => {
          setEditingUser(null);
          setShowForm(true);
        }}
      >
        <FaUserPlus /> Add User
      </button>
    </header>
      <main className="app-main">
        {showForm && (
          <UserForm
            user={editingUser}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      <UserList
      onEdit={handleEdit}
      refresh={refreshList}
      />
      </main>
      </div>
  );
}

export default App;
