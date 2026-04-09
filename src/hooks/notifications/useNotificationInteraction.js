// useNotificationInteraction.js
import { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import {
    APP_TABS,
    CHAT_ROOM,
    CHATS_STACK,
    CHATS,
    CHALLENGES_STACK,
    HOME,
    HOME_STACK,
    CURRENT_PROJECT_DETAILS,
    BRANDS_SCREEN,
    PROJECTS_SCREEN,
    BRAND_APPLICATIONS,
} from '../../navigation/ScreenNames';

/**
 * Navigates to the correct screen based on notification data.
 *
 * Navigation hierarchy (creator):
 *   MainNavigator → APP → AppStack → APP_TABS → (HOME_STACK | CHALLENGES_STACK | CHATS_STACK | ...)
 *
 * For nested navigation we reset to APP_TABS and use nested screen params
 * so that the correct tab is focused and the inner screen receives its params.
 */
const navigateFromNotification = (navigation, data) => {
    if (!data?.type) {
        // No type — fall back to home
        navigation.reset({
            index: 0,
            routes: [{ name: APP_TABS }],
        });
        return;
    }

    switch (data.type) {
        case 'chats': {
            // Navigate to the specific chat room if chatRoomId is present,
            // otherwise navigate to the chat rooms list.
            if (data.chatRoomId) {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: APP_TABS,
                            state: {
                                routes: [
                                    {
                                        name: CHATS_STACK,
                                        state: {
                                            routes: [
                                                { name: CHAT_ROOM },
                                                {
                                                    name: CHATS,
                                                    params: {
                                                        chatRoomId: data.chatRoomId,
                                                        name: data.chatRoomName || '',
                                                        receiverFcmToken: data.senderFcmToken || '',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                });
            } else {
                // No specific chat room — just open the chats tab
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: APP_TABS,
                            state: {
                                routes: [{ name: CHATS_STACK }],
                            },
                        },
                    ],
                });
            }
            break;
        }

        case 'project_status': {
            // Navigate to the project details screen within HOME_STACK
            if (data.projectID) {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: APP_TABS,
                            state: {
                                routes: [
                                    {
                                        name: HOME_STACK,
                                        state: {
                                            routes: [
                                                { name: HOME },
                                                {
                                                    name: CURRENT_PROJECT_DETAILS,
                                                    params: {
                                                        projectId: data.projectID,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                });
            } else {
                // No projectID — just go home
                navigation.reset({
                    index: 0,
                    routes: [{ name: APP_TABS }],
                });
            }
            break;
        }

        case 'brands_catalogue': {
            // Navigate to the Brands screen within HOME_STACK
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: APP_TABS,
                        state: {
                            routes: [
                                {
                                    name: HOME_STACK,
                                    state: {
                                        routes: [{ name: HOME }, { name: BRANDS_SCREEN }],
                                    },
                                },
                            ],
                        },
                    },
                ],
            });
            break;
        }

        case 'brands_hiring': {
            // Navigate to the Explore screen with the Projects tab selected
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: APP_TABS,
                        state: {
                            routes: [
                                {
                                    name: HOME_STACK,
                                    state: {
                                        routes: [{ name: HOME }, { name: PROJECTS_SCREEN }],
                                    },
                                },
                            ],
                        },
                    },
                ],
            });
            break;
        }

        case 'challenge': {
            // Navigate to the Challenges tab
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: APP_TABS,
                        state: {
                            routes: [{ name: CHALLENGES_STACK }],
                        },
                    },
                ],
            });
            break;
        }

        case 'brand_application_follow_up': {
            // Navigate to brand applications screen
            if (data.applicationId) {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: APP_TABS,
                            state: {
                                routes: [
                                    {
                                        name: HOME_STACK,
                                        state: {
                                            routes: [{ name: HOME }, { name: BRAND_APPLICATIONS }],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: APP_TABS }],
                });
            }
            break;
        }

        default: {
            // Unknown type — fall back to home
            navigation.reset({
                index: 0,
                routes: [{ name: APP_TABS }],
            });
            break;
        }
    }
};

const useNotificationInteraction = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleNotificationNavigation = useCallback(
        data => {
            navigateFromNotification(navigation, data);
        },
        [navigation],
    );

    // Display notifications when app is in foreground
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('[useNotificationInteraction] Foreground message:', remoteMessage?.notification);

            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default',
                importance: AndroidImportance.HIGH,
            });

            await notifee.displayNotification({
                title: remoteMessage.notification?.title,
                body: remoteMessage.notification?.body,
                data: remoteMessage.data,
                android: {
                    channelId,
                    pressAction: { id: 'default' },
                    importance: AndroidImportance.HIGH,
                },
                ios: {
                    sound: 'default',
                },
            });
        });

        return unsubscribe;
    }, []);

    // Handle Notifee foreground notification taps (covers both FCM-originated
    // local notifications displayed in foreground AND local-only notifications
    // like brand application follow-up reminders)
    useEffect(() => {
        return notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS) {
                const data = detail.notification?.data;
                console.log('[useNotificationInteraction] Notifee foreground press:', data);

                // Map brand follow-up notifications to our routing type
                if (data?.applicationId && !data?.type) {
                    handleNotificationNavigation({
                        ...data,
                        type: 'brand_application_follow_up',
                    });
                } else {
                    handleNotificationNavigation(data);
                }
            }
        });
    }, [handleNotificationNavigation]);

    // App opened from background via FCM notification
    useEffect(() => {
        setLoading(true);

        const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                '[useNotificationInteraction] Opened from background:',
                remoteMessage?.notification,
                'data:',
                remoteMessage?.data,
            );
            setLoading(false);

            handleNotificationNavigation(remoteMessage?.data);
        });

        return unsubscribe;
    }, [navigation, handleNotificationNavigation]);

    // App opened from quit state via FCM notification or Notifee local notification
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                // Check FCM initial notification (background FCM push that launched the app)
                const remoteMessage = await messaging().getInitialNotification();
                if (remoteMessage) {
                    console.log(
                        '[useNotificationInteraction] Opened from quit state (FCM):',
                        remoteMessage,
                        'data:',
                        remoteMessage?.data,
                    );

                    handleNotificationNavigation(remoteMessage?.data);
                    return;
                }

                // Check Notifee initial notification (local notification tap that launched the app)
                const initialNotification = await notifee.getInitialNotification();
                if (initialNotification) {
                    const data = initialNotification.notification?.data;
                    console.log('[useNotificationInteraction] Opened from quit state (Notifee):', data);

                    // Map brand follow-up notifications to our routing type
                    if (data?.applicationId && !data?.type) {
                        handleNotificationNavigation({
                            ...data,
                            type: 'brand_application_follow_up',
                        });
                    } else {
                        handleNotificationNavigation(data);
                    }
                }
            } catch (e) {
                console.log('[useNotificationInteraction] getInitialNotification error', e);
            } finally {
                setLoading(false);
            }
        })();
    }, [navigation, handleNotificationNavigation]);

    return {
        loading,
    };
};

export default useNotificationInteraction;
