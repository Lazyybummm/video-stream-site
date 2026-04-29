// FILE: src/components/Register.jsx
import React, { useState } from 'react';
import api from '../api/axiosInstance'; // <-- ADDED THIS IMPORT

const Register = ({ setactive }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return; 
        }
        
        try {
            // 1. MAKE THE API CALL TO CREATE THE USER IN POSTGRES
            await api.post("/signup", { username, email, password });
            
            // 2. If successful, send them to the login screen
            setactive('login');
        } catch (err) {
            console.error("Register Error:", err);
            setError('Registration failed. Email or username might be taken.');
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

            <h2>Create an Account</h2>
            {error && <p style={{ color: '#ff4c4c', fontWeight: 'bold' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white' }}
                />
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
                    placeholder="Password (min 8 chars)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white' }}
                />
                <button type="submit" style={{ padding: '12px', background: '#E50914', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Sign Up
                </button>
            </form>
            
            <p style={{ marginTop: '20px', fontSize: '14px', color: '#aaa' }}>
                Already have an account?{' '}
                <button 
                    onClick={() => setactive('login')} 
                    style={{ background: 'none', border: 'none', color: '#fff', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                >
                    Log in here.
                </button>
            </p>
        </div>
    );
};

export default Register;