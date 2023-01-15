import React, {useState, useEffect, createContext} from 'react';
import PropTypes from 'prop-types';

import useAuthState from '../hooks/auth/useAuthState';
import useProfile from '../hooks/user/useProfile';

const AuthContext = createContext();

const {Provider, Consumer: AuthConsumer} = AuthContext;

const AuthProvider = ({children}) => {
  const {user, initializing} = useAuthState();

  const [profile, setProfile] = useState(null);

  const {getProfile} = useProfile();

  const update = (key, data) => {
    setProfile(prevState => ({
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
  };

  return <Provider value={value}>{children}</Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

AuthProvider.defaultProps = {
  children: null,
};
export {AuthContext, AuthProvider, AuthConsumer};
