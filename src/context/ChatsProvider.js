import React, {
    createContext, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import useAuthContext from '../hooks/auth/useAuthContext';

const ChatsContext = createContext();
const { Provider, Consumer: ChatsConsumer } = ChatsContext;

const ChatsProvider = ({ children }) => {
    const { auth } = useAuthContext();

    const { profile } = auth;

    const chatUser = useMemo(() => {
        if (profile) {
            return {
                id: profile?.id,
                name: profile?.userName,
                image: profile?.image,
            };
        }
        return null;
    }, [profile]);

    const [currentUser, setCurrentUser] = useState(chatUser);

    const [connecting, setConnecting] = useState(false);

    const [activeChannel, setActiveChannel] = useState(null);

    const [activeChannelId, setActiveChannelId] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);

    const [error, setError] = useState(null);

    const [directChannel, setDirectChannel] = useState(null);

    const [unreadMessages, setUnreadMessages] = useState(0);

    const [unreadThreads, setUnreadThreads] = useState(0);

    const value = {

        currentUser,
        setCurrentUser,
        activeChannel,
        setActiveChannel,
        activeChannelId,
        setActiveChannelId,
        selectedUser,
        setSelectedUser,
        error,
        setError,
        directChannel,
        setDirectChannel,
        unreadMessages,
        setUnreadMessages,
        unreadThreads,
        setUnreadThreads,
        connecting,
        setConnecting,
    };

    return (
        <Provider value={value}>
            {children}
        </Provider>
    );
};

ChatsProvider.propTypes = {
    children: PropTypes.node,
};

ChatsProvider.defaultProps = {
    children: null,
};
export {
    ChatsContext,
    ChatsConsumer,
    ChatsProvider,
};
