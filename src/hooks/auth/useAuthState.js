import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

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
        const subscribe = auth().onAuthStateChanged(onAuthStateChanged);
        return subscribe;
    }, []);

    return {
        user,
        initializing,
        isLoggedIn: !!user,
    };
};

export default useAuthState;
