import { createContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance'; // Ensure this path is correct based on your folder structure

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state

    // THE MAGIC: This runs immediately when you refresh the page
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                // Ask the backend if our secure cookie is still valid
                const response = await api.get('/me');
                // If it succeeds, put the user back into React Memory!
                setUser(response.data.user);
            } catch (err) {
                // If it fails (no cookie, or expired), stay logged out
                setUser(null);
            } finally {
                // Tell the app we are done checking
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post('/logout'); // Tell backend to clear the cookie
            setUser(null);             // Clear React memory
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {/* Don't render the app until we know if they are logged in or not */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};