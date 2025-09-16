import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged as onAuthStateChangedModular } from '@react-native-firebase/auth';

const useAuthState = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    const onAuthStateChanged = (userInfo) => {
        setUser(userInfo);
        if (initializing) {
            setInitializing(false);
        }
    };

    useEffect(() => {
        const authInstance = getAuth();
        const unsubscribe = onAuthStateChangedModular(authInstance, onAuthStateChanged);
        return unsubscribe;
    }, []);

    return {
        user,
        initializing,
        isLoggedIn: !!user,
    };
};

export default useAuthState;
