import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import React from 'react';
import useAuthContext from '../../hooks/auth/useAuthContext';
import TemplateBox from '../../components/TemplateBox';
import { WHITE } from '../../theme/Colors';
import ProfileStatusCard from '../../components/cards/ProfileStatusCard';
import { HEADER_MARGIN, WRAPPER_MARGIN } from '../../theme/Layout';
import TemplateText from '../../components/TemplateText';
import { CHATS } from '../../navigation/ScreenNames';
import useChatsContext from '../../hooks/chats/useChatsContext';
import { wp } from '../../Utils/getResponsiveSize';

const ChatRoomsScreen = ({ navigation }) => {
    const { auth } = useAuthContext();

    const isCreator = auth?.profile?.type === 'creator';

    const {
        chatRooms,
        fetchChatRooms,
        fetchingChatRooms,
    } = useChatsContext();

    return (
        <FlatList
            data={chatRooms}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item?.id}
            ListHeaderComponent={() => (
                <TemplateBox
                    mt={HEADER_MARGIN * 1.6}
                    alignItems="center"
                    justifyContent="center"
                    mh={WRAPPER_MARGIN}
                >

                    <TemplateText
                        size={wp(18)}
                        startCase
                        bold
                        center
                    >
                        {`Continue your conversations with your ${isCreator ? 'brands' : 'creators'}`}
                    </TemplateText>
                    <TemplateBox height={WRAPPER_MARGIN} />
                </TemplateBox>
            )}
            renderItem={({ item, index }) => (
                <ProfileStatusCard
                    key={item?.id}
                    title={item?.name}
                    titleSize={wp(14)}
                    keyExtractor={(item) => item?.id}
                    description={`Continue your  conversation with ${item?.name}`}
                    showProgress={false}
                    style={styles.statusCard}
                    slideInDelay={(index + 1) * 100}
                    showIcon={false}
                    onPress={() => {
                        navigation.navigate(CHATS, {
                            chatRoomId: item?.id,
                        });
                    }}
                />
            )}
            ListEmptyComponent={() => (
                <TemplateBox
                    mt={HEADER_MARGIN}
                    alignItems="center"
                    justifyContent="center"
                    mh={WRAPPER_MARGIN}
                >
                    <TemplateText
                        size={wp(16)}
                        center
                    >
                        There are no conversations yet
                    </TemplateText>
                    <TemplateBox height={WRAPPER_MARGIN} />
                </TemplateBox>
            )}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={fetchingChatRooms} onRefresh={fetchChatRooms} />
            }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    contentContainer: {
        flexGrow: 1,
    },
    statusCard: {
        marginBottom: WRAPPER_MARGIN * 2,
    },
});
export default ChatRoomsScreen;
