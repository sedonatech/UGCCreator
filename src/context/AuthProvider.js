import React, {
    useState, useEffect, createContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';

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

    const getProfileCompleteStatus = useCallback(() => {
        const profileCheckParamsObject = {
            name: profile?.name || profile?.userName,
            profileImage: profile?.image,
            socials: profile?.socialMedia?.instagram
               || profile?.socialMedia?.facebook
               || profile?.socialMedia?.twitter || profile?.socialMedia?.youtube,
        };

        const profileValues = Object.values(profileCheckParamsObject);
        const offset = profileValues?.length;
        const completeCount = profileValues?.filter((value) => !!value)?.length;
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
    }, [profile]);

    const {
        createCreatorProfile,
        createBrandProfile,
        updateProfile,
        getProfile,
        loading,
        updateProfileLoading,
    } = useProfile();

    const update = (key, data) => {
        console.log('[Profile] Auth Provider: Update called, updating profile: ', key, data);
        setProfile((prevState) => ({
            ...prevState,
            [key]: data,
        }));
    };

    useEffect(() => {
        console.log('[Profile] Auth Provider: Profile changed: ', profile);
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
        updateProfileLoading,
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
