require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');              // <-- ADDED for WebSocket
const socketIo = require('socket.io');     // <-- ADDED for WebSocket
const User = require('./models/User');
const { protect, admin, isOwnerOrAdmin } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB Error:', err.message);
        process.exit(1);
    });

// ===== AUTH ROUTES =====
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, age } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        
        const user = new User({ name, email, password, age: age || 18 });
        await user.hashPassword();
        await user.save();
        
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

app.get('/api/auth/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.get('/users/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// ===== USER ROUTES =====
app.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.get('/users/:id', protect, isOwnerOrAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
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

app.post('/users', protect, admin, async (req, res) => {
    try {
        const { name, email, age, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
        const newUser = new User({
            name,
            email,
            password: password || 'default123',
            age: age || 18
        });
        
        await newUser.hashPassword();
        await newUser.save();
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                age: newUser.age,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

app.put('/users/:id', protect, isOwnerOrAdmin, async (req, res) => {
    try {
        const { name, email, age, password } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        if (name) user.name = name;
        
        if (email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: req.params.id } 
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use by another user'
                });
            }
            user.email = email;
        }
        
        if (age) user.age = age;
        
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters'
                });
            }
            user.password = password;
            await user.hashPassword();
        }
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});

app.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }
        
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
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

// ===== ROOT ROUTE =====
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Codveda API with Authentication & Roles & WebSocket',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                me: 'GET /api/auth/me (protected)'
            },
            users: {
                all: 'GET /users (admin only)',
                one: 'GET /users/:id (admin or owner)',
                create: 'POST /users (admin only)',
                update: 'PUT /users/:id (admin or owner)',
                delete: 'DELETE /users/:id (admin only)',
                profile: 'GET /users/me (protected)'
            }
        }
    });
});

// ============================================
// 🟢 WEBSOCKET SERVER (Socket.io)
// ============================================

// Create HTTP server
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Store connected users
const connectedUsers = {};

io.on('connection', (socket) => {
    console.log(`🔌 New user connected: ${socket.id}`);

    // ===== USER JOINS =====
    socket.on('join', (userData) => {
        console.log(`📝 User joined: ${userData.name}`);
        
        connectedUsers[socket.id] = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role
        };

        // Notify all users
        io.emit('userJoined', {
            user: userData.name,
            users: Object.values(connectedUsers)
        });

        // Send current users list to the new user
        socket.emit('usersList', Object.values(connectedUsers));
    });

    // ===== SEND MESSAGE =====
    socket.on('sendMessage', (data) => {
        const message = {
            ...data,
            timestamp: new Date().toLocaleTimeString(),
            id: socket.id
        };
        io.emit('receiveMessage', message);
    });

    // ===== TYPING INDICATOR =====
    socket.on('typing', (data) => {
        socket.broadcast.emit('userTyping', {
            user: data.user,
            isTyping: data.isTyping
        });
    });

    // ===== USER DISCONNECTS =====
    socket.on('disconnect', () => {
        const user = connectedUsers[socket.id];
        if (user) {
            delete connectedUsers[socket.id];
            io.emit('userLeft', {
                user: user.name,
                users: Object.values(connectedUsers)
            });
        }
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

// ============================================
// 🚀 START SERVER
// ============================================
server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`✅ WebSocket server ready`);
});