import React, {
    createContext, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';

import useAuthContext from '../hooks/auth/useAuthContext';
import useChatRooms from '../hooks/chats/useChatRooms';
import { DEFAULT_AVATAR } from '../consts/content/Portfolio';

const ChatsContext = createContext();
const { Provider, Consumer: ChatsConsumer } = ChatsContext;

const ChatsProvider = ({ children }) => {
    const { auth } = useAuthContext();

    const [messages, setMessages] = useState([]);

    const [createdChatRoom, setCreatedChatRoom] = useState();

    const {
        chatRooms,
        loading,
        createChatRoom,
        chatRoomCreated,
    } = useChatRooms();

    const { profile } = auth;

    const chatUser = useMemo(() => {
        if (profile) {
            return {
                _id: profile?.id,
                name: profile?.userName || profile?.name || 'Brand',
                avatar: profile?.image || profile?.avatar || DEFAULT_AVATAR,
            };
        }
        return null;
    }, [profile]);

    const [error, setError] = useState(null);

    const value = {
        error,
        setError,
        chatUser,
        chatRooms,
        loading,
        createChatRoom,
        messages,
        setMessages,
        chatRoomCreated,
        createdChatRoom,
        setCreatedChatRoom,
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
