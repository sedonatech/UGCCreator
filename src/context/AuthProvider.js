import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, values } from 'lodash';

import useAuthState from '../hooks/auth/useAuthState';
import useProfile from '../hooks/user/useProfile';
import config from '../../config';

const AuthContext = createContext();

const { Provider, Consumer: AuthConsumer } = AuthContext;

const AuthProvider = ({ children }) => {
    const { user, initializing } = useAuthState();

    const [profile, setProfile] = useState(null);

    const [brandProfileComplete, setBrandProfileComplete] = useState(false);

    const [creatorProfileComplete, setCreatorProfileComplete] = useState(false);

    const [completeProfileModalVisible, setCompleteModalVisible] = useState(true);

    const [profileCompleteRatio, setProfileCompleteRatio] = useState(0);

    const overrideProfileUpdateModal = config?.overrideProfileUpdateModal;

    const getProfileCompleteStatus = () => {
        const profileValues = values(profile);
        const offset = profileValues?.length;
        const completeCount = profileValues?.filter((value) => !isEmpty(value))?.length;
        const completeRatio = completeCount / offset;
        const roundedCompleteRatio = Math.round(completeRatio * 10) / 10;

        setProfileCompleteRatio(roundedCompleteRatio);

        if (profile?.type === 'brand') {
            setBrandProfileComplete(completeCount === offset);
            setCompleteModalVisible(!overrideProfileUpdateModal ? completeCount !== offset : false);
        } else if (profile?.type === 'creator') {
            setCreatorProfileComplete(completeCount === offset);
            setCompleteModalVisible(!overrideProfileUpdateModal ? completeCount !== offset : false);
        }
    };

    const {
        createCreatorProfile,
        createBrandProfile,
        updateProfile,
        getProfile,
        loading,
    } = useProfile();

    const update = (key, data) => {
        console.log('[Profile] Auth Provider: Update called, updating profile: ', key, data);
        setProfile((prevState) => ({
            ...prevState,
            [key]: data,
        }));
    };

    useEffect(() => {
        (async () => {
            try {
                if (user) {
                    const profileData = await getProfile(user?.uid);
                    if (profileData) {
                        setProfile(profileData);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }, [user]);

    const value = {
        user,
        initializing,
        profile,
        update,
        createCreatorProfile,
        createBrandProfile,
        updateProfile,
        loading,
        brandProfileComplete,
        creatorProfileComplete,
        completeProfileModalVisible,
        closeCompleteProfileModal: () => setCompleteModalVisible(false),
        getProfileCompleteStatus,
        profileCompleteRatio,
    };

    return (
        <Provider value={value}>
            {children}
        </Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node,
};

AuthProvider.defaultProps = {
    children: null,
};

export {
    AuthContext,
    AuthProvider,
    AuthConsumer,
};
