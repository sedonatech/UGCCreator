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
                _id: profile?.id,
                name: profile?.userName,
                avatar: profile?.image,
            };
        }
        return null;
    }, [profile]);

    const [error, setError] = useState(null);

    const [directChannel, setDirectChannel] = useState(null);

    const [unreadMessages, setUnreadMessages] = useState(0);

    const [unreadThreads, setUnreadThreads] = useState(0);

    const [messages, setMessages] = useState([]);

    const value = {
        error,
        setError,
        directChannel,
        setDirectChannel,
        unreadMessages,
        setUnreadMessages,
        unreadThreads,
        setUnreadThreads,
        chatUser,
        messages,
        setMessages,
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
