import React, { useEffect, useState, createContext, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../utils/firebase'; 
import { useNavigate } from 'react-router-dom';

// 建立 Context
const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

// 登入期限（例如 7 天）
const LOGIN_EXPIRE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 天 (毫秒)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            const loginTimestamp = localStorage.getItem("to-do-list-loginTimestamp");
            const now = Date.now();

            if (firebaseUser) {
                // ✅ 檢查登入是否過期
                if (loginTimestamp && now - parseInt(loginTimestamp) > LOGIN_EXPIRE_DURATION) {
                    console.log("登入已過期，自動登出");
                    await signOut(auth);
                    localStorage.removeItem("to-do-list-loginTimestamp");
                    setUser(null);
                    navigate('/');
                } else {
                    setUser(firebaseUser);
                }
            } else {
                setUser(null);
                navigate('/');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [navigate]);

    if (loading) {
        return <div>載入中...</div>;
    }

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
}
