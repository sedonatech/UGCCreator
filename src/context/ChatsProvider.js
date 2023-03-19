import React, {
    createContext, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { StreamChat } from 'stream-chat';
import { Alert } from 'react-native';
import useAuthContext from '../hooks/auth/useAuthContext';

const ChatsContext = createContext();
const { Provider, Consumer: ChatsConsumer } = ChatsContext;

const apiKey = '3jymrhfzg4ah';
const streamClient = StreamChat.getInstance(apiKey);
const ChatsProvider = ({ children }) => {
    const { auth } = useAuthContext();

    const { idTokenResult, profile } = auth;

    const [streamToken, setStreamToken] = useState(null);
    const chatUser = useMemo(() => {
        if (idTokenResult && profile && streamToken) {
            return {
                id: profile?.id,
                name: profile?.userName,
                image: profile?.image,
                email: idTokenResult?.claims?.email,
                firebaseToken: idTokenResult?.token,
                token: streamToken,
            };
        }
        return null;
    }, [idTokenResult, profile, streamToken]);

    console.log('----> chatUser', JSON.stringify(chatUser, null, 2));

    const [clientReady, setClientReady] = useState(false);

    const [client, setClient] = useState(null);

    const [currentUser, setCurrentUser] = useState(chatUser);

    const [connecting, setConnecting] = useState(false);

    const [activeChannel, setActiveChannel] = useState(null);

    const [activeChannelId, setActiveChannelId] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);

    const [error, setError] = useState(null);

    const [directChannel, setDirectChannel] = useState(null);

    const [unreadMessages, setUnreadMessages] = useState(0);

    const [unreadThreads, setUnreadThreads] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                setClient(streamClient);
            } catch (e) {
                console.log('[CHATS_PROVIDER: setting client error]-> e', e);
                setError(e?.message);
                setClientReady(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                if (!client) {
                    return null;
                }
                const token = client.createToken(chatUser?.id, Math.floor(Date.now() / 1000) + (60 * 60));
                setStreamToken(token);
                return token;
            } catch (e) {
                console.log('[CHATS_PROVIDER: setting user stream token]-> e', e);
                setError(e?.message);
                setClientReady(false);
            }
        })();
    }, [client]);

    useEffect(() => {
        setConnecting(true);
        (async () => {
            try {
                if (!chatUser && !client) {
                    return;
                }

                await client.connectUser(
                    chatUser,
                    chatUser?.token,
                );
                setCurrentUser(chatUser);
                setClientReady(true);
            } catch (e) {
                console.log('[CHATS_PROVIDER: connecting user and setting client ready]-> e', e);
                setError(e?.message);
                setClientReady(false);
            }
            setConnecting(false);
        })();

        return () => {
            client?.disconnectUser();
        };
    }, [chatUser, client]);

    const value = {
        client,
        clientReady,
        setClientReady,
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
