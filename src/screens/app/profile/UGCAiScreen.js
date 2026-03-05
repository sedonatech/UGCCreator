import React from 'react';

import { ScrollView, StyleSheet } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import { HEADER_MARGIN, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';
import { BLACK_20, IOS_BLUE, PAYWALL_PRIMARY_BACKGROUND, WHITE } from '../../../theme/Colors';
import ScriptsSvg from '../../../../assets/svgs/ScriptsSvg';
import SuggestorSvg from '../../../../assets/svgs/SuggestorSvg';
import HooksSvg from '../../../../assets/svgs/HooksSvg';
import {
    CONTENT_SUGGESTOR,
    HOOKS_GENERATOR,
    RESULTS_HISTORY,
    SCRIPTS_GENERATOR,
} from '../../../navigation/ScreenNames';
import Button from '../../../components/Button';
import useTrackEvent from '../../../hooks/events/useTrackEvent';
import { hp } from '../../../Utils/getResponsiveSize';
import useTranslation from '../../../hooks/useTranslation';

const UGCAiScreen = ({ navigation }) => {
    const { t } = useTranslation();

    const creatorTools = [
        {
            analyticsName: 'Scripts Generator',
            title: t('creatorTools.ugcAiScreen.tools.scripts.title'),
            description: t('creatorTools.ugcAiScreen.tools.scripts.description'),
            screen: SCRIPTS_GENERATOR,
            icon: 'scripts',
            type: 'scripts',
            screenTitle: t('creatorTools.ugcAiScreen.tools.scripts.screenTitle'),
        },
        {
            analyticsName: 'Content Suggester',
            title: t('creatorTools.ugcAiScreen.tools.contentSuggestion.title'),
            description: t('creatorTools.ugcAiScreen.tools.contentSuggestion.description'),
            screen: CONTENT_SUGGESTOR,
            icon: 'suggestor',
            type: 'content suggestion',
            screenTitle: t('creatorTools.ugcAiScreen.tools.contentSuggestion.screenTitle'),
        },
        {
            analyticsName: 'Hooks Generator',
            title: t('creatorTools.ugcAiScreen.tools.hooks.title'),
            description: t('creatorTools.ugcAiScreen.tools.hooks.description'),
            screen: HOOKS_GENERATOR,
            icon: 'hooks',
            type: 'hooks',
            screenTitle: t('creatorTools.ugcAiScreen.tools.hooks.screenTitle'),
        },
    ];

    const iconMap = {
        scripts: ScriptsSvg(),
        suggestor: SuggestorSvg(),
        hooks: HooksSvg(),
    };
    const { trackEvent } = useTrackEvent();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <TemplateBox mt={HEADER_MARGIN} mh={WRAPPER_MARGIN} alignItems="center" justifyContent="center">
                <TemplateText size={18} bold startCase center>
                    {t('creatorTools.ugcAiScreen.title')}
                </TemplateText>
                <TemplateBox mh={WRAPPER_MARGIN}>
                    {creatorTools.map((item, index) => (
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
                                navigation.navigate(item.screen, {
                                    type: item.type,
                                    title: item.screenTitle,
                                });
                                trackEvent('creator_tool_viewed', {
                                    creator_tool_name: item.analyticsName,
                                });
                            }}
                            borderWidth={1}
                            borderColor={BLACK_20}
                        >
                            {iconMap[item.icon]}
                            <TemplateBox width={16} />
                            <TemplateBox
                                width={SCREEN_WIDTH / 1.6}
                                onPress={() => {
                                    navigation.navigate(item.screen, {
                                        type: item.type,
                                        title: item.screenTitle,
                                    });
                                    trackEvent('creator_tool_viewed', {
                                        creator_tool_name: item.analyticsName,
                                    });
                                }}
                            >
                                <TemplateText bold size={16}>
                                    {item.title}
                                </TemplateText>
                                <TemplateBox height={10} />
                                <TemplateText size={13}>{item.description}</TemplateText>
                            </TemplateBox>
                        </TemplateBox>
                    ))}
                </TemplateBox>
                <Button
                    title={t('creatorTools.ugcAiScreen.viewResultsHistory')}
                    onPress={() => navigation.navigate(RESULTS_HISTORY)}
                    style={styles.button}
                    loading={false}
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
        flexGrow: 1,
        backgroundColor: WHITE,
    },

    button: {
        marginVertical: 40,
        alignSelf: 'center',
        borderRadius: 16,
        backgroundColor: IOS_BLUE,
        width: WRAPPED_SCREEN_WIDTH,
        height: hp(45),
    },
});
export default UGCAiScreen;
