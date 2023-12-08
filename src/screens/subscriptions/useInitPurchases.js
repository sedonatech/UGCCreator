import { useEffect, useState } from 'react';

import Purchases from 'react-native-purchases';
import useAuthState from '../../hooks/auth/useAuthState';
import useAuthContext from '../../hooks/auth/useAuthContext';
import { useConfig } from '../../context/core';

export default () => {
    const { revenueCat } = useConfig();

    const { auth } = useAuthContext();

    const { isLoggedIn } = useAuthState();

    const [ready, setReady] = useState(false);

    const [userEmail, setUserEmail] = useState(null);

    const init = async (passedUsername, email) => {
        let retries = 3;
        const username = passedUsername;
        do {
            try {
                console.log('[@UGCCreatorApp useInitPurchases] - username: ', username);
                if (!username) {
                    throw Error(`No user name present - username:${username}`);
                }
                Purchases.configure({
                    apiKey: revenueCat,
                    appUserID: username,
                });
                setUserEmail(email);
                console.log('[subscriptions] Purchase setup complete');
                setReady(true);
                break;
            } catch (error) {
                console.log('[useInitPurchases] - error', error);
                retries -= 1;
                setReady(false);
            }
        } while (retries > 0);
    };

    useEffect(() => {
        if (isLoggedIn && auth?.user?.email && auth?.user?.uid) {
            (async () => {
                const userNameInterval = setInterval(async () => {
                    if (auth?.user?.email) {
                        clearInterval(userNameInterval);
                        init(auth?.user?.uid, auth?.user?.email);
                    }
                }, 500);
            })();
        }
    }, [isLoggedIn, auth?.user?.uid, auth?.user?.email]);

    return [ready, userEmail];
};
