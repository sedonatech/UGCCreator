import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import TemplateBox from '../../../components/TemplateBox';
import { BLACK_10, BLACK_20, BLACK_80, IOS_BLUE, PAYWALL_PRIMARY_BACKGROUND, WHITE } from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';
import { HEADER_MARGIN, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import TemplateTextInput from '../../../components/TemplateTextInput';
import { projectFilters } from '../../../consts/AppFilters/ProjectFilters';
import FilterCategory from '../explore/components/FilterCategory';
import useAITools from '../../../hooks/creatorTools/useAITools';
import Button from '../../../components/Button';
import { CREATOR_TOOLS_RESULTS } from '../../../navigation/ScreenNames';
import useTrackEvent from '../../../hooks/events/useTrackEvent';
import { hp } from '../../../Utils/getResponsiveSize';
import { FONT_BODY_SM } from '../../../theme/Typography';

const ScriptsGeneratorScreen = ({ navigation, route }) => {
    const { t } = useTranslation();
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
                t('creatorTools.alerts.successTitle', { type: toolType }),
                t('creatorTools.alerts.successMessage', { type: toolType }),
                [
                    {
                        text: t('common.buttons.ok'),
                        onPress: () => {
                            navigation.navigate(CREATOR_TOOLS_RESULTS, {
                                title: t('creatorTools.scriptsGeneratorScreen.resultsTitle', { type: toolType }),
                                subTitle: t('creatorTools.scriptsGeneratorScreen.resultsSubtitle', { type: toolType }),
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
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <TemplateBox mt={HEADER_MARGIN} mb={50}>
                <TemplateText size={18} bold startCase center mh={20}>
                    {title}
                </TemplateText>
                <TemplateBox height={20} />
                <TemplateBox selfCenter>
                    <TemplateText size={16} center>
                        {t('creatorTools.scriptsGeneratorScreen.subtitle')}
                    </TemplateText>
                </TemplateBox>
                <TemplateBox height={20} />
                <TemplateTextInput
                    placeholder={t('creatorTools.scriptsGeneratorScreen.brandNamePlaceholder')}
                    style={styles.input}
                    value={brandName}
                    onChangeText={text => setBrandName(text)}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholderStyle={styles.placeholderStyle}
                    placeholderTextColor={BLACK_80}
                />
                <TemplateTextInput
                    placeholder={t('creatorTools.scriptsGeneratorScreen.productNamePlaceholder')}
                    style={styles.input}
                    value={productName}
                    onChangeText={text => setProductName(text)}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholderStyle={styles.placeholderStyle}
                    placeholderTextColor={BLACK_80}
                />
                <TemplateTextInput
                    placeholder={t('creatorTools.scriptsGeneratorScreen.productDescriptionPlaceholder')}
                    style={styles.input}
                    value={productDescription}
                    onChangeText={text => setProductDescription(text)}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholderStyle={styles.placeholderStyle}
                    placeholderTextColor={BLACK_80}
                />
                <TemplateTextInput
                    placeholder={t('creatorTools.scriptsGeneratorScreen.valuePropositionPlaceholder')}
                    style={styles.input}
                    value={valueProposition}
                    onChangeText={text => setValueProposition(text)}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholderStyle={styles.placeholderStyle}
                    placeholderTextColor={BLACK_80}
                />
                <TemplateTextInput
                    placeholder={t('creatorTools.scriptsGeneratorScreen.personaPlaceholder')}
                    style={styles.input}
                    value={persona}
                    onChangeText={text => setPersona(text)}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholderStyle={styles.placeholderStyle}
                    placeholderTextColor={BLACK_80}
                />
                <TemplateBox width={WRAPPED_SCREEN_WIDTH} selfCenter>
                    <FilterCategory
                        title={t('creatorTools.scriptsGeneratorScreen.categoryTitle')}
                        filters={projectFilters}
                        onFilterPress={onCategoriesPress}
                        selectedFilters={selectedCategories}
                        translationPrefix="filterCategories"
                    />
                </TemplateBox>

                <Button
                    title={t('creatorTools.scriptsGeneratorScreen.saveAndContinue')}
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
        backgroundColor: WHITE,
    },
    contentContainer: {
        backgroundColor: WHITE,
        alignItems: 'center',
    },
    input: {
        height: 60,
        width: SCREEN_WIDTH - 32,
        borderWidth: 0.8,
        borderColor: BLACK_20,
        borderRadius: 8,
        paddingLeft: 16,
        marginTop: 10,
        marginBottom: WRAPPER_MARGIN,
        alignSelf: 'center',
    },
    button: {
        marginTop: 40,
        alignSelf: 'center',
        borderRadius: 16,
        backgroundColor: IOS_BLUE,
        width: WRAPPED_SCREEN_WIDTH,
        height: hp(45)
    },
    placeholderStyle: {
        fontSize: FONT_BODY_SM,
    },
});
export default ScriptsGeneratorScreen;
