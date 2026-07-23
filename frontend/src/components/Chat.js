import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const Chat = ({ currentUser }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // ===== CONNECT TO WEBSOCKET SERVER =====
    useEffect(() => {
        if (!currentUser) return;

        const newSocket = io('http://localhost:3000', {
            withCredentials: true
        });
        setSocket(newSocket);

        // ===== SOCKET EVENTS =====
        newSocket.on('connect', () => {
            console.log('✅ Connected to WebSocket server');
            setIsConnected(true);
            
            newSocket.emit('join', {
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role
            });
        });

        newSocket.on('usersList', (usersList) => {
            setUsers(usersList);
        });

        newSocket.on('userJoined', (data) => {
            setUsers(data.users);
            setMessages(prev => [...prev, {
                type: 'notification',
                text: `👋 ${data.user} joined the chat`,
                isJoin: true,
                timestamp: new Date().toLocaleTimeString()
            }]);
        });

        newSocket.on('userLeft', (data) => {
            setUsers(data.users);
            setMessages(prev => [...prev, {
                type: 'notification',
                text: `👋 ${data.user} left the chat`,
                isJoin: false,
                timestamp: new Date().toLocaleTimeString()
            }]);
        });

        newSocket.on('receiveMessage', (data) => {
            setMessages(prev => [...prev, {
                type: 'message',
                user: data.user,
                text: data.text,
                timestamp: data.timestamp,
                isOwn: data.id === newSocket.id
            }]);
        });

        newSocket.on('userTyping', (data) => {
            if (data.isTyping) {
                setTypingUser(data.user);
            } else {
                setTypingUser(null);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from WebSocket server');
            setIsConnected(false);
        });

        // ===== CLEANUP =====
        return () => {
            newSocket.disconnect();
        };
    }, [currentUser]);

    // ===== AUTO-SCROLL TO BOTTOM =====
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ===== SEND MESSAGE =====
    const sendMessage = () => {
        if (!input.trim() || !socket || !isConnected) return;

        socket.emit('sendMessage', {
            user: currentUser.name,
            text: input.trim()
        });

        setInput('');
        setTypingUser(null);
    };

    // ===== TYPING INDICATOR =====
    const handleTyping = (e) => {
        setInput(e.target.value);

        if (!socket || !isConnected) return;

        if (e.target.value.length > 0) {
            socket.emit('typing', { user: currentUser.name, isTyping: true });
            
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('typing', { user: currentUser.name, isTyping: false });
            }, 1000);
        } else {
            socket.emit('typing', { user: currentUser.name, isTyping: false });
        }
    };

    // ===== SEND ON ENTER KEY =====
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // ===== RENDER =====
    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>💬 Live Chat</h3>
                <span className="chat-users-online">
                    👥 {users.length} online
                </span>
            </div>

            <div className="chat-users-list">
                {users.map((user, index) => (
                    <span key={index} className="chat-user-badge">
                        <span className="online-dot"></span>
                        {user.name}
                        {user.role === 'admin' && ' 👑'}
                    </span>
                ))}
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => {
                    if (msg.type === 'notification') {
                        return (
                            <div key={index} className={`chat-notification ${msg.isJoin ? 'join' : 'leave'}`}>
                                {msg.text}
                            </div>
                        );
                    }
                    return (
                        <div key={index} className={`chat-message ${msg.isOwn ? 'own' : 'other'}`}>
                            {!msg.isOwn && <div className="message-user">{msg.user}</div>}
                            <div className="message-bubble">
                                {msg.text}
                                <div className="message-time">{msg.timestamp}</div>
                            </div>
                        </div>
                    );
                })}
                
                {typingUser && (
                    <div className="chat-typing">
                        {typingUser} is typing...
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                <input
                    type="text"
                    value={input}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    placeholder={isConnected ? "Type a message..." : "Connecting..."}
                    disabled={!isConnected}
                />
                <button onClick={sendMessage} disabled={!isConnected || !input.trim()}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;