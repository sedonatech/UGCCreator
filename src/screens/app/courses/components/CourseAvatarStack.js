import React from 'react';
import { StyleSheet } from 'react-native';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import { WHITE, INDIGO_200, INDIGO_300, INDIGO_400 } from '../../../../theme/Colors';

const CourseAvatarStack = () => {
    return (
        <TemplateBox row>
            <TemplateBox style={[styles.avatar, styles.avatarOne]} />
            <TemplateBox style={[styles.avatar, styles.avatarTwo]} />
            <TemplateBox style={[styles.avatar, styles.avatarThree]} center>
                <TemplateText size={10} color={WHITE} semiBold>
                    +2k
                </TemplateText>
            </TemplateBox>
        </TemplateBox>
    );
};

export default CourseAvatarStack;

const styles = StyleSheet.create({
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: WHITE,
    },
    avatarOne: {
        backgroundColor: INDIGO_200,
    },
    avatarTwo: {
        backgroundColor: INDIGO_300,
        marginLeft: -8,
    },
    avatarThree: {
        backgroundColor: INDIGO_400,
        marginLeft: -8,
    },
});
