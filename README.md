# Licence : This project was created as part of the Codveda Full-Stack Internship program.



# Codveda Full-Stack Application


## Description
Full-stack application with JWT authentication, role-based access "Admin/User", and real-time chat with WebSockets.


## Technologies
- **Backend**: Node.js, Express, MongoDB, JWT, bcrypt, Socket.io
- **Frontend**: React, Axios, React Icons, Socket.io-client
- **Database**: MongoDB Atlas
- **Real-Time**: WebSockets "Sockets.io


## Features
- User Registration / Login
- JWT Authentication
- Role-based access (Admin / User)
- Complete CRUD operations
- Protected routes
- Real-time chat (WebSocket)
- Join/Leave notifications
- Typing indicator
- Password hashing with bcrypt
- Responsive UI design

##  Project Structure
codveda-project/
├── backend/
│ ├── index.js # Main server with WebSocket
│ ├── models/
│ │ └── User.js # User model with bcrypt
│ ├── middleware/
│ │ └── auth.js # JWT authentication
│ ├── .env # Environment variables
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ │ └── api.js # Axios configuration
│ │ ├── components/
│ │ │ ├── Login.js
│ │ │ ├── Register.js
│ │ │ ├── Chat.js # WebSocket chat
│ │ │ ├── UserList.js
│ │ │ ├── UserCard.js
│ │ │ └── UserForm.js
│ │ ├── App.js
│ │ └── App.css
│ ├── package.json
│ └── README.md
│
└── README.md

## Installation

### Prerequisites
- Node.js 
- MongoDB Atlas account 
- Git

### Backend Setup
bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with your variables
# PORT=3000
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
# JWT_EXPIRE=7d

# Start the server
npx nodemon index.js

### Frontend Setup 
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start the application
npm start

#### Default Accounts
Admin >> Email: admine@codveda.com  |  Mdp: admin123
User  >> Email: ahmed@codveda.com   |  Mdp: ahmed123
User  >> Email: test1@codveda.com   |  Mdp: test123


# Authentication
POST >>  /api/auth/register : Register new user
POST >>  /api/auth/login :    Login user
GET  >>  /api/auth/me   :  Get current user

## WebSocket Events
join : User joins the chat
sendMessage : Send a new message
typing  : User is typing
userJoined  : New user joined notification
userLeft  : User left notification
receiveMessage  : Receive new message
usersList  :  List of online users

### User Features
> Register with name, email, password, age
> Login with email and password
> View and edit own profile
> Change password
> Real-time chat with other users

#### Admin Features
>View all users
>Create new users
>Edit any user
>Delete users (except self)
>Real-time chat with all users
