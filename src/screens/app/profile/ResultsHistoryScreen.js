import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import { HEADER_MARGIN, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import { PAYWALL_PRIMARY_BACKGROUND, WHITE } from '../../../theme/Colors';
import ScriptsSvg from '../../../../assets/svgs/ScriptsSvg';
import SuggestorSvg from '../../../../assets/svgs/SuggestorSvg';
import HooksSvg from '../../../../assets/svgs/HooksSvg';
import { CREATOR_TOOLS_RESULTS } from '../../../navigation/ScreenNames';
import useAITools from '../../../hooks/creatorTools/useAITools';
import LoadingOverlay from '../../../components/LoadingOverlay';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import useTranslation from '../../../hooks/useTranslation';

const ResultsHistoryScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { contentGenerationResultsHistory, fetchContentGenerationResultsHistory, loadingHistory } = useAITools();

    const iconMap = {
        scripts: ScriptsSvg(),
        'content suggestion': SuggestorSvg(),
        hooks: HooksSvg(),
    };

    const toolTypeLabelMap = {
        scripts: t('creatorTools.toolTypes.scripts'),
        'content suggestion': t('creatorTools.toolTypes.contentSuggestion'),
        hooks: t('creatorTools.toolTypes.hooks'),
    };

    const openHistoryResult = item => {
        const localizedType = toolTypeLabelMap[item?.type] || item?.type;

        navigation.navigate(CREATOR_TOOLS_RESULTS, {
            title: t('creatorTools.resultsHistoryScreen.fetchedTitle', {
                type: localizedType,
            }),
            subTitle: t('creatorTools.resultsHistoryScreen.fetchedSubtitle', {
                type: localizedType,
            }),
            results: item?.result,
            fromHistory: true,
        });
    };

    useEffect(() => {
        (async () => fetchContentGenerationResultsHistory())();
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <TemplateBox mh={WRAPPER_MARGIN} alignItems="center" justifyContent="center" mt={HEADER_MARGIN}>
                <TemplateText size={18} bold startCase center>
                    {t('creatorTools.resultsHistoryScreen.title')}
                </TemplateText>
                <TemplateBox mh={WRAPPER_MARGIN}>
                    {!contentGenerationResultsHistory?.length ? (
                        <ProfileStatusCard
                            title={t('creatorTools.resultsHistoryScreen.emptyTitle')}
                            description={t('creatorTools.resultsHistoryScreen.emptyDescription')}
                            showProgress={false}
                            style={styles.statusCard}
                            slideInDelay={200}
                        />
                    ) : (
                        contentGenerationResultsHistory?.map((item, index) => (
                            <TemplateBox
                                row
                                alignItems="center"
                                backgroundColor={WHITE}
                                borderRadius={16}
                                pAll={20}
                                width={WRAPPED_SCREEN_WIDTH}
                                mt={WRAPPER_MARGIN}
                                key={`${item?.type}-${index}`}
                                onPress={() => openHistoryResult(item)}
                            >
                                {iconMap[item?.type]}
                                <TemplateBox width={16} />
                                <TemplateBox width={SCREEN_WIDTH / 1.6} onPress={() => openHistoryResult(item)}>
                                    <TemplateText bold size={16}>
                                        {toolTypeLabelMap[item?.type] || item?.type}
                                    </TemplateText>
                                    <TemplateBox height={10} />
                                    <TemplateText size={13} numberOfLines={2}>
                                        {item?.result}
                                    </TemplateText>
                                </TemplateBox>
                            </TemplateBox>
                        ))
                    )}
                </TemplateBox>
            </TemplateBox>
            {loadingHistory && <LoadingOverlay message={t('creatorTools.resultsHistoryScreen.loadingMessage')} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,
    },
    contentContainer: {
        flexGrow: 1,
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,
    },
    statusCard: {
        marginVertical: WRAPPER_MARGIN * 3,
        alignSelf: 'center',
    },
});
export default ResultsHistoryScreen;
