import React, { useState } from 'react';
import functions from '@react-native-firebase/functions';

import { ScrollView, StyleSheet } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import {
    IS_ANDROID, SCREEN_WIDTH, SPACE_XXLARGE, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    BLACK, BLACK_40, GREY_SECONDARY, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import TemplateTextInput from '../../../components/TemplateTextInput';
import Button from '../../../components/Button';

const UGCAiScreen = () => {
    const [categoryInput, setCategoryInput] = useState('');
    const [result, setResult] = useState();
    const [loading, setLoading] = useState(false);
    console.log('-> open AI result', result);

    const onSubmit = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://us-central1-ugccreatorappopenaiapi.cloudfunctions.net/generateBrands?category=${categoryInput}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('-> response', response);

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setResult(data.result);
            setCategoryInput('');
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
        setLoading(false);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox>
                <TemplateBox ph={WRAPPER_MARGIN} mb={SPACE_XXLARGE}>
                    <TemplateText size={16}>Enter Category</TemplateText>
                    <TemplateTextInput
                        placeholder="Category"
                        placeholderTextColor={BLACK_40}
                        style={styles.input}
                        value={categoryInput}
                        onChangeText={(text) => setCategoryInput(text)}
                        autoCapitalize="none"
                    />
                </TemplateBox>
                <TemplateBox height={100} />
                <Button
                    title="Submit"
                    onPress={onSubmit}
                    style={styles.button}
                    loading={loading}
                />
            </TemplateBox>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 60,
        borderWidth: 1,
        width: SCREEN_WIDTH - WRAPPER_MARGIN * 2,
        borderColor: GREY_SECONDARY,
        borderRadius: 10,
        paddingLeft: 16,
        marginTop: 10,
        color: BLACK,
    },
    button: {
        marginTop: 24,
        marginBottom: 16,
        alignSelf: 'center',
    },
});
export default UGCAiScreen;
