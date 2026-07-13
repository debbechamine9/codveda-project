require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
 mongoose.connect(process.env.MONGODB_URI)
 .then(() => console.log('Connected to MongoDB'))
 .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });
   app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
            });
        }
    });
    app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with ID ${req.params.id} not found`
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
    app.post('/users', async (req, res) => {
        try {
            const { name, email, age } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }
            const newUser = new User({ name, email, age });
            const savedUser = await newUser.save();
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: savedUser
            });
        } catch (err) {
            if (err.name === 'ValidationError') {
                const errors = Object.values(err.errors).map(e => e.message);
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors
                });
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });
    app.put('/users/:id', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email, age }, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: `User with ID ${req.params.id} not found`
            });
        }
        // ✅ Ajout de la réponse manquante
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
    app.delete('/users/:id', async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({
                    success: false,
                    message: `User with ID ${req.params.id} not found`
                });
            }
            res.status(200).json({
                success: true,
                message: 'User deleted successfully',
                data: deletedUser
            });
        } catch (err) {
            if (err.kind === 'ObjectId') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID format'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        console.log(`Routes disponibles:`);
        console.log(`GET /users - Get all users`);
        console.log(`GET /users/:id - Get user by ID`);
        console.log(`POST /users - Create a new user`);
        console.log(`PUT /users/:id - Update user by ID`);
        console.log(`DELETE /users/:id - Delete user by ID`);
    });

    