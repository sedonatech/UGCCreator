import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import TemplateBox from '../../../components/TemplateBox';
import {
    BLACK,
    BLACK_10, BLACK_50, IOS_BLUE, PAYWALL_PRIMARY_BACKGROUND,
} from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';
import {
    HEADER_MARGIN,
    SCREEN_WIDTH,
    WRAPPED_SCREEN_WIDTH,
    WRAPPER_MARGIN,
} from '../../../theme/Layout';
import TemplateTextInput from '../../../components/TemplateTextInput';
import { projectFilters } from '../../../consts/AppFilters/ProjectFilters';
import FilterCategory from '../explore/components/FilterCategory';
import useAITools from '../../../hooks/creatorTools/useAITools';
import Button from '../../../components/Button';
import { CREATOR_TOOLS_RESULTS } from '../../../navigation/ScreenNames';
import useTrackEvent from '../../../hooks/events/useTrackEvent';

const AnalyticsCopilotScreen = ({ navigation, route }) => {
    const title = route.params?.title;

    const toolType = route.params?.type;

    const {
        brandName,
        setBrandName,
        productName,
        setProductName,
        productDescription,
        setProductDescription,
        valueProposition,
        setValueProposition,
        loading,
        persona,
        setPersona,
        selectedCategories,
        onCategoriesPress,
        handleSaveAndSubmit,
        responseMessage,
    } = useAITools(toolType);

    const { trackEvent } = useTrackEvent();

    useEffect(() => {
        if (responseMessage) {
            Alert.alert(
                `Successfully created ${toolType} 🎉`,
                `You can now copy the ${toolType} to your clipboard!`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate(CREATOR_TOOLS_RESULTS, {
                                title: `${toolType[0]?.toUpperCase() + toolType?.slice(1)} Results Successfully Created 🎉🎊`,
                                subTitle: `You can now copy the ${toolType} to your clipboard!`,
                                results: responseMessage,
                            });
                            trackEvent('creator_tool_results_viewed', {
                                tool_type: toolType,
                            });
                        },
                    },
                ],
                { cancelable: false },
            );
        }
    }, [responseMessage]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox mt={HEADER_MARGIN} mb={50} alignItems="center">
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
                    >
                        Benchmark your IG & TikTok and surface growth gaps.
                    </TemplateText>
                </TemplateBox>
                <TemplateBox height={20} />

                <Button
                    title="Connect to Instagram"
                    onPress={handleSaveAndSubmit}
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
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,

    },
    contentContainer: {
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,
        alignItems: 'center',
    },
    input: {
        height: 60,
        width: SCREEN_WIDTH - 32,
        borderWidth: 0.4,
        borderColor: BLACK_10,
        borderRadius: 8,
        paddingLeft: 16,
        marginTop: 10,
        marginBottom: WRAPPER_MARGIN,
        alignSelf: 'center',
    },
    button: {
        marginTop: 40,
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: BLACK,
        width: WRAPPED_SCREEN_WIDTH,
        height: 50,
    },
    placeholderStyle: {
        fontSize: 13,
    },
});
export default AnalyticsCopilotScreen;
