import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Alert, StyleSheet } from 'react-native';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import {
    BLACK,
    BLACK_40, BLACK_SECONDARY, GREY_SECONDARY, WHITE,
} from '../../../../theme/Colors';
import TemplateTextInput from '../../../../components/TemplateTextInput';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateIcon from '../../../../components/TemplateIcon';
import useAuthContext from '../../../../hooks/auth/useAuthContext';

const AddSampleWorkItem = ({
    onClose,
}) => {
    const [info, setInfo] = useState({
        title: '',
        description: '',
    });

    const { auth } = useAuthContext();

    const { profile: profileData, update } = auth;
    const handleUpdatePhotos = () => {
        if (!info.title || !info.description || !info.link) {
            Alert.alert('Please fill all fields');
            return;
        }
        update('samplePhotos', [
            ...profileData?.samplePhotos,
            {
                link: info.link,
                title: info.title,
                description: info.description,
            },
        ]);
        onClose();
    };
    return (
        <TemplateBox mb={30} alignItems="center" justifyContent="center">
            <TemplateBox>
                <TemplateBox mt={10}>
                    <TemplateBox mv={10}>
                        <TemplateText size={12} bold>Link</TemplateText>
                        <TemplateTextInput
                            placeholder="Link"
                            placeholderTextColor={BLACK_40}
                            style={styles.shortInput}
                            value={info.link}
                            onChangeText={(text) => {
                                setInfo({
                                    ...info,
                                    link: text,
                                });
                            }}
                            autoCapitalize="none"
                        />
                    </TemplateBox>
                    <TemplateBox mv={10}>
                        <TemplateText size={12} bold>Title</TemplateText>
                        <TemplateTextInput
                            placeholder="Title"
                            placeholderTextColor={BLACK_40}
                            style={styles.shortInput}
                            value={info.title}
                            onChangeText={(text) => {
                                setInfo({
                                    ...info,
                                    title: text,
                                });
                            }}
                            autoCapitalize="none"
                        />
                    </TemplateBox>
                    <TemplateBox mv={10}>
                        <TemplateText size={12} bold>Description</TemplateText>
                        <TemplateTextInput
                            placeholder="Description"
                            placeholderTextColor={BLACK_40}
                            style={styles.shortInput}
                            value={info.description}
                            onChangeText={(text) => {
                                setInfo({
                                    ...info,
                                    description: text,
                                });
                            }}
                            autoCapitalize="none"
                            maxLength={100}
                            multiline
                        />
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>
            <TemplateBox
                row
                alignItems="center"
                backgroundColor={BLACK_SECONDARY}
                borderRadius={10}
                mt={WRAPPER_MARGIN}
                onPress={handleUpdatePhotos}
                ph={WRAPPER_MARGIN * 2}
                pv={5}
                selfCenter
            >
                <TemplateIcon name="add-outline" color={WHITE} size={16} />
                <TemplateBox width={5} />
                <TemplateText color={WHITE} bold size={12}>Add</TemplateText>
            </TemplateBox>
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    shortInput: {
        height: 40,
        width: SCREEN_WIDTH - (WRAPPER_MARGIN * 2),
        borderWidth: 1,
        borderColor: GREY_SECONDARY,
        borderRadius: 10,
        paddingLeft: 16,
        marginTop: 5,
        color: BLACK,
    },
});
AddSampleWorkItem.propTypes = {
    onClose: PropTypes.func,
    type: PropTypes.string.isRequired,
};

AddSampleWorkItem.defaultProps = {
    onClose: () => {},
};

export default AddSampleWorkItem;
