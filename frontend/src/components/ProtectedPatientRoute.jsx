import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProtectedPatientRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
    const location = useLocation();

    useEffect(() => {
        const checkSession = async () => {
            try {
                // We assume the backend is on the same origin or proxy is set up in vite.config.js 
                // If not, we might need the full URL, but typically relative works with proxy.
                // verified backend endpoint: router.get("/test-session", ...)
                const response = await axios.get('/api/patient/test-session', {
                    withCredentials: true // Important for sending cookies
                });

                if (response.status === 200 && response.data.session?.isPatientLoggedIn) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Session check failed:", error);
                setIsAuthenticated(false);
            }
        };

        checkSession();
    }, []);

    if (isAuthenticated === null) {
        // Loading state - minimalistic spinner
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login, optionally passing the current location so we can redirect back after login
        // The user requirement said: "just navigate to the patient login form"
        return <Navigate to="/api/patient/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedPatientRoute;
