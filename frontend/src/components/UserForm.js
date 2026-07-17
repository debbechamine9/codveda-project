import React, {useState, useEffect} from 'react';
import {createUser, updateUser} from '../api/api';
import './UserForm.css';


const UserForm = ({ user, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: ''
        
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {   
         console.log('📝 User received in the form:', user);
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                age: user.age || ''
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
             console.log(' Form data:', formData);
              console.log('User to edit:', user);
            const data = {
                name: formData.name,
                email: formData.email,
                age: parseInt(formData.age)

            };
            let response;
            if (user) {
                console.log(`Updating user with ID: ${user._id}`);
                response = await updateUser(user._id, data);
            } else {
                response = await createUser(data);
            }
            if (response.data.success){
                onSuccess();
            } else {
                setError(response.data.message || 'Error during the operation');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const errorData = err.response.data;
            if (errorData.errors) {
                setError(errorData.errors.join(', '));
            } else {
                setError(errorData.message || 'Error during the operation');
            }
            } else {
                setError('Server connection error');
            } 
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
                <label>Name*</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required    
                    placeholder="Enter name"
                    minlength={3}
                    />
            </div>
            <div className="form-group">
                <label>Email*</label>
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
                    required
                    placeholder="Enter age"
                    min="18"
                    max="120"
                />
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
          
