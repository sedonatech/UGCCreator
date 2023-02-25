import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Alert, StyleSheet } from 'react-native';
import TemplateBox from '../../../../components/TemplateBox';
import AddCustomImageButton from '../../../../components/AddCustomImageButton';
import TemplateText from '../../../../components/TemplateText';
import {
    BLACK_40, BLACK_SECONDARY, GREY_SECONDARY, WHITE,
} from '../../../../theme/Colors';
import TemplateTextInput from '../../../../components/TemplateTextInput';
import { WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateIcon from '../../../../components/TemplateIcon';
import useAuthContext from '../../../../hooks/auth/useAuthContext';

const AddSampleWorkItem = ({
    image,
    index,
    onSelectImage,
    handleClearImage,
    onClose,
}) => {
    const [info, setInfo] = useState({
        title: '',
        description: '',
    });

    const { auth } = useAuthContext();

    const { profile: profileData, update } = auth;
    const handleUpdate = () => {
        if (!image || !info.title || !info.description) {
            Alert.alert('Please fill all fields');
            return;
        }
        if (profileData?.samplePhotos?.length >= 4) {
            Alert.alert('You can only add 4 sample works');
            return;
        }
        update('samplePhotos', [
            ...profileData?.samplePhotos,
            {
                image,
                title: info.title,
                description: info.description,
            },
        ]);
        onClose();
    };
    return (
        <TemplateBox mb={30}>
            <TemplateBox row alignItems="center">
                <AddCustomImageButton
                    image={image}
                    index={index}
                    onPress={onSelectImage}
                    handleClearImage={handleClearImage}
                />
                <TemplateBox mt={10}>
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
                    <TemplateBox>
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
                ml={104}
                mt={WRAPPER_MARGIN}
                onPress={handleUpdate}
                ph={WRAPPER_MARGIN}
                pv={5}
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
        width: 250,
        borderWidth: 1,
        borderColor: GREY_SECONDARY,
        borderRadius: 10,
        paddingLeft: 16,
        marginTop: 5,
        color: BLACK_40,
    },
});
AddSampleWorkItem.propTypes = {
    image: PropTypes.string,
    index: PropTypes.number,
    onSelectImage: PropTypes.func,
    handleClearImage: PropTypes.func,
    onClose: PropTypes.func,
};

AddSampleWorkItem.defaultProps = {
    image: '',
    index: 0,
    onSelectImage: () => {},
    handleClearImage: () => {},
    onClose: () => {},
};

export default AddSampleWorkItem;
