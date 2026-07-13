const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid']
    },
    age: {
        type: Number,
        min: [18, 'Age must be at least 18 years old'],
        max: [120, 'Age must be at most 120 years old']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const user = mongoose.model('User', userSchema);
module.exports = user;