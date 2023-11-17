import { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import auth from '@react-native-firebase/auth';
import useProfile from '../hooks/user/useProfile';

export default function useAppState(settings) {
    const { onChange, onForeground, onBackground } = settings || {};
    const [appState, setAppState] = useState(AppState.currentState);
    const { updateProfile, getProfile } = useProfile();

    // settings validation
    function isValidFunction(func) {
        return func && typeof func === 'function';
    }

    useEffect(() => {
        function handleAppStateChange(nextAppState) {

            if (nextAppState === 'active') {
                if (isValidFunction(onForeground)) {
                    onForeground();
                }
            } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
                (async () => {
                    const profile = await getProfile(auth().currentUser.uid);
                    await updateProfile({lastLoginTime: new Date().toISOString()}, profile?.id)    
                })().catch(err => {
                    console.error(err);
                });
                if (isValidFunction(onBackground)) {
                    onBackground();
                }
            }
            setAppState(nextAppState);
            if (isValidFunction(onChange)) {
                onChange(nextAppState);
            }
        }
        AppState.addEventListener('change', handleAppStateChange);

        return () => AppState.removeEventListener('change', handleAppStateChange);
    }, [onChange, onForeground, onBackground, appState]);

    return { appState };
}
