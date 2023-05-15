import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import TemplateBox from '../../../components/TemplateBox';
import {
    BLACK_SECONDARY,
    GREEN, IOS_BLUE, LIGHT_GREEN, PAYWALL_PRIMARY_BACKGROUND,
} from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';
import useAITools from '../../../hooks/creatorTools/useAITools';
import { HEADER_MARGIN, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import Button from '../../../components/Button';
import { RESULTS_HISTORY } from '../../../navigation/ScreenNames';

const CreatorToolsResultsScreen = ({ navigation, route }) => {
    const title = route?.params?.title;

    const subtitle = route?.params?.subTitle;

    const fromHistory = route?.params?.fromHistory;

    const {
        responseMessage,
    } = useAITools();

    const results = route?.params?.results || responseMessage;

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            Alert.alert('Copied to Clipboard',
                'You can now paste the results into any text field and access them later from your history.',
                [
                    {
                        text: 'OK',
                        onPress: () => setCopied(false),
                    },
                ]);
        }
    }, [copied]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox mt={HEADER_MARGIN} selfCenter mb={50}>
                <TemplateBox mh={WRAPPER_MARGIN} selfCenter>
                    <TemplateText
                        size={18}
                        bold
                        startCase
                        center
                    >

                        {title}
                    </TemplateText>
                    <TemplateBox height={20} />
                    <TemplateBox selfCenter>
                        <TemplateText
                            size={16}
                            center
                            semibold
                        >
                            {subtitle}
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
                <TemplateBox height={20} />

                { results && (
                    <TemplateBox
                        flex
                        selfCenter
                        width={WRAPPED_SCREEN_WIDTH}
                        style={styles.resultsContainer}
                        backgroundColor={LIGHT_GREEN}
                        pAll={16}
                        borderRadius={16}
                    >
                        <TemplateText
                            size={13}
                        >
                            {results}
                        </TemplateText>
                    </TemplateBox>
                )}

                <Button
                    title="Copy Results To Clipboard"
                    onPress={() => {
                        Clipboard.setString(results);
                        setCopied(true);
                    }}
                    style={styles.copyToClipboardButton}
                    loading={false}
                />
                {!fromHistory && (
                    <Button
                        title="View Results History"
                        onPress={() => navigation.navigate(RESULTS_HISTORY)}
                        style={styles.button}
                        loading={false}
                    />
                )}
            </TemplateBox>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,

    },
    contentContainer: {
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,
    },
    resultsContainer: {
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: GREEN,
    },
    button: {
        marginTop: 40,
        alignSelf: 'center',
        borderRadius: 16,
        backgroundColor: BLACK_SECONDARY,
        width: WRAPPED_SCREEN_WIDTH,
    },
    copyToClipboardButton: {
        marginTop: 40,
        alignSelf: 'center',
        borderRadius: 16,
        backgroundColor: IOS_BLUE,
        width: WRAPPED_SCREEN_WIDTH,
    },
});
export default CreatorToolsResultsScreen;
