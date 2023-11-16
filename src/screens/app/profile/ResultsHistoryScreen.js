import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import {
    HEADER_MARGIN,

    SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    PAYWALL_PRIMARY_BACKGROUND,
    WHITE,
} from '../../../theme/Colors';
import ScriptsSvg from '../../../../assets/svgs/ScriptsSvg';
import SuggestorSvg from '../../../../assets/svgs/SuggestorSvg';
import HooksSvg from '../../../../assets/svgs/HooksSvg';
import {
    CREATOR_TOOLS_RESULTS,
} from '../../../navigation/ScreenNames';
import useAITools from '../../../hooks/creatorTools/useAITools';
import LoadingOverlay from '../../../components/LoadingOverlay';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';

const ResultsHistoryScreen = ({ navigation }) => {
    const {
        contentGenerationResultsHistory,
        fetchContentGenerationResultsHistory,
        loadingHistory,
    } = useAITools();

    const iconMap = {
        scripts: ScriptsSvg(),
        'content suggestion': SuggestorSvg(),
        hooks: HooksSvg(),
    };

    useEffect(() => {
        (async () => fetchContentGenerationResultsHistory())();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox
                mh={WRAPPER_MARGIN}
                alignItems="center"
                justifyContent="center"
                mt={HEADER_MARGIN}
            >
                <TemplateText
                    size={18}
                    bold
                    startCase
                    center
                >
                    Results History
                </TemplateText>
                <TemplateBox mh={WRAPPER_MARGIN}>
                    {
                        !contentGenerationResultsHistory?.length ? (
                            <ProfileStatusCard
                                title="No Current History"
                                description="You have no current history. Please generate some content to see your history."
                                showProgress={false}
                                style={styles.statusCard}
                                slideInDelay={200}
                            />

                        )
                            : contentGenerationResultsHistory?.map((item, index) => (
                                <TemplateBox
                                    row
                                    alignItems="center"
                                    backgroundColor={WHITE}
                                    borderRadius={16}
                                    pAll={20}
                                    width={WRAPPED_SCREEN_WIDTH}
                                    mt={WRAPPER_MARGIN}
                                    key={`${item.title}-${index}`}
                                    onPress={() => {
                                        navigation.navigate(CREATOR_TOOLS_RESULTS, {
                                            title: `${item?.type[0]?.toUpperCase() + item?.type?.slice(1)} Results Successfully Fetched 🎉🎊`,
                                            subTitle: `You can now copy the ${item?.type} to your clipboard!`,
                                            results: item?.result,
                                            fromHistory: true,
                                        });
                                    }}
                                >
                                    {iconMap[item?.type]}
                                    <TemplateBox width={16} />
                                    <TemplateBox
                                        width={SCREEN_WIDTH / 1.6}
                                        onPress={() => {
                                            navigation.navigate(CREATOR_TOOLS_RESULTS, {
                                                title: `${item?.type[0]?.toUpperCase() + item?.type?.slice(1)} Results Successfully Fetched 🎉🎊`,
                                                subTitle: `You can now copy the ${item?.type} to your clipboard!`,
                                                results: item?.result,
                                                fromHistory: true,
                                            });
                                        }}
                                    >
                                        <TemplateText bold size={16}>{item?.type}</TemplateText>
                                        <TemplateBox height={10} />
                                        <TemplateText
                                            size={13}
                                            numberOfLines={2}
                                        >
                                            {item?.result}
                                        </TemplateText>
                                    </TemplateBox>
                                </TemplateBox>

                            ))
                    }

                </TemplateBox>
            </TemplateBox>
            {loadingHistory && (
                <LoadingOverlay message="Fetching your history...." />
            )}
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
