// FILE: src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance'; // <-- ADDED THIS IMPORT

const Login = ({ setactive }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Tune into context
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        
        try {
            // 1. MAKE THE API CALL TO YOUR BACKEND
            const response = await api.post("/login", { email, password });
            
            // 2. If backend says OK, pass the user data into React Memory
            login(response.data.user);
            
            // 3. Go to landing page
            setactive('landing');
        } catch (err) {
            console.error("Login Error:", err);
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div style={{ padding: '100px', color: 'white' }}>
            <button 
                onClick={() => setactive('landing')} 
                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
                ← Back to Browse
            </button>

            <h2>Login to MovieFlix</h2>
            {error && <p style={{ color: '#ff4c4c', fontWeight: 'bold' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white' }}
                />
                <button type="submit" style={{ padding: '12px', background: '#E50914', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Login
                </button>
            </form>

            <p style={{ marginTop: '20px', fontSize: '14px', color: '#aaa' }}>
                Don't have an account?{' '}
                <button 
                    onClick={() => setactive('register')} 
                    style={{ background: 'none', border: 'none', color: '#fff', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                >
                    Sign up here.
                </button>
            </p>
        </div>
    );
};

export default Login;