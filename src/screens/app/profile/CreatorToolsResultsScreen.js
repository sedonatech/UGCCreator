import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import { GREEN, LIGHT_GREEN, PAYWALL_PRIMARY_BACKGROUND } from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';
import useAITools from '../../../hooks/creatorTools/useAITools';
import { HEADER_MARGIN, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';

const CreatorToolsResultsScreen = ({ navigation, route }) => {
    const title = route?.params?.title;
    const subtitle = route?.params?.subTitle;

    const {
        responseMessage,
    } = useAITools();

    const results = route?.params?.results || responseMessage;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox mt={HEADER_MARGIN} selfCenter mb={50} ph={WRAPPER_MARGIN}>
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
});
export default CreatorToolsResultsScreen;
