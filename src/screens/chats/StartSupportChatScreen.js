import React, { useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IS_ANDROID, WRAPPER_MARGIN } from '../../theme/Layout';
import { TRANSPARENT, WHITE } from '../../theme/Colors';
import { wp } from '../../Utils/getResponsiveSize';
import BrandLogo from '../../../assets/svgs/BrandLogo';
import Button from '../../components/Button';
import { SUPPORT_CHAT } from '../../navigation/ScreenNames';
import TemplateText from '../../components/TemplateText';
import TemplateBox from '../../components/TemplateBox';
import useChatsContext from '../../hooks/chats/useChatsContext';
import useAuthContext from '../../hooks/auth/useAuthContext';

const StartSupportChatScreen = () => {
    const navigation = useNavigation();

    const { auth } = useAuthContext();

    const userProfile = auth?.profile;

    const {
        chatRooms,
    } = useChatsContext();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <TemplateBox height={wp(130)} />
            <TemplateText bold size={wp(18)}>
                Let's make user generated content creation better
            </TemplateText>
            <TemplateBox height={wp(20)} />
            <TemplateText size={wp(14)}>
                Help us to improve your experience by sharing your feedback
            </TemplateText>
            <TemplateBox height={wp(100)} />

            <BrandLogo
                width={wp(300)}
                height={wp(200)}
            />

            <TemplateBox height={wp(100)} />
            <Button
                title="Contact Our Support Team"
                onPress={() => navigation.navigate(SUPPORT_CHAT)}
                style={styles.button}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: wp(100),
        paddingHorizontal: wp(WRAPPER_MARGIN),
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: wp(50),
        height: wp(46),
    },
});
export default StartSupportChatScreen;
