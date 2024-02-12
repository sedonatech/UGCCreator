import React from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import TemplateBox from '../../components/TemplateBox';
import { wp } from '../../Utils/getResponsiveSize';
import { SPACE_MEDIUM } from '../../theme/Layout';
import { ERROR_RED, GREY, WHITE } from '../../theme/Colors';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../consts/content/Portfolio';
import TemplateText from '../../components/TemplateText';
import useChatMessages from '../../hooks/chats/useChatMessages';

const ChatRoomCard = ({
    id,
    name,
    imageUrl,
    onPress,
    lastLoginTime,
}) => {
    const { unreadMessagesCount } = useChatMessages(id);

    return (
        <>

            <TemplateBox
                width={wp(354)}
                borderRadius={wp(20)}
                pAll={wp(16)}
                selfCenter
                mt={wp(SPACE_MEDIUM)}
                backgroundColor={WHITE}
                onPress={onPress}
                row
                alignItems="center"
            >

                <FastImage
                    source={{ uri: imageUrl || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE }}
                    style={styles.image}
                />

                <TemplateBox>
                    <TemplateText bold size={wp(16)}>
                        {name}
                    </TemplateText>
                    <TemplateBox height={wp(5)} />
                    {lastLoginTime && (
                        <TemplateText size={wp(10)} color={GREY}>
                            {`Last active ${lastLoginTime}`}
                        </TemplateText>
                    )}
                </TemplateBox>
                {!!unreadMessagesCount && (
                    <TemplateBox
                        height={wp(24)}
                        width={wp(24)}
                        borderRadius={wp(12)}
                        backgroundColor={ERROR_RED}
                        absolute
                        top={wp(10)}
                        left={wp(10)}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <TemplateText size={wp(12)} color={WHITE} bold>
                            {unreadMessagesCount}
                        </TemplateText>
                    </TemplateBox>
                )}
            </TemplateBox>
        </>
    );
};

ChatRoomCard.propTypes = {
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    lastLoginTime: PropTypes.string,
    id: PropTypes.string.isRequired,
};
ChatRoomCard.defaultProps = {
    lastLoginTime: null,
};

const styles = StyleSheet.create({
    image: {
        width: wp(50),
        height: wp(50),
        borderRadius: wp(10),
        marginRight: wp(20),
    },
});

export default ChatRoomCard;
