import React from 'react';

import { ScrollView, StyleSheet } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import {

    SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    IOS_BLUE,
    PAYWALL_PRIMARY_BACKGROUND,
    WHITE,
} from '../../../theme/Colors';
import ScriptsSvg from '../../../../assets/svgs/ScriptsSvg';
import SuggestorSvg from '../../../../assets/svgs/SuggestorSvg';
import HooksSvg from '../../../../assets/svgs/HooksSvg';
import {
    CONTENT_SUGGESTOR,
    HOOKS_GENERATOR, RESULTS_HISTORY,
    SCRIPTS_GENERATOR,
} from '../../../navigation/ScreenNames';
import Button from '../../../components/Button';
import useTrackEvent from '../../../hooks/events/useTrackEvent';

const UGCAiScreen = ({ navigation }) => {
    const creatorTools = [
        {
            title: 'Scripts Generator',
            description: 'This tool helps you generate scripts for your videos based on your project requirements.',
            screen: SCRIPTS_GENERATOR,
            icon: 'scripts',
            type: 'scripts',
            screenTitle: 'Create Engaging Scripts With AI in minutes',
        },
        {
            title: 'Content Suggester',
            description: 'This tool  suggests content for you to create based on your project requirements.',
            screen: CONTENT_SUGGESTOR,
            icon: 'suggestor',
            type: 'content suggestion',
            screenTitle: 'Create Engaging Content With AI in minutes',
        },
        {
            title: 'Hooks Generator',
            description: 'This tool helps you generate hooks for your project.',
            screen: HOOKS_GENERATOR,
            icon: 'hooks',
            type: 'hooks',
            screenTitle: 'Create Engaging Hooks With AI in minutes',
        },
    ];

    const iconMap = {
        scripts: ScriptsSvg(),
        suggestor: SuggestorSvg(),
        hooks: HooksSvg(),
    };
    const { trackEvent } = useTrackEvent();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox
                mh={WRAPPER_MARGIN}
                alignItems="center"
                justifyContent="center"
            >
                <TemplateText
                    size={18}
                    bold
                    startCase
                    center
                >
                    Explore our Creator Tools
                </TemplateText>
                <TemplateBox mh={WRAPPER_MARGIN}>
                    {
                        creatorTools.map((item, index) => (
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
                                    navigation.navigate(SCRIPTS_GENERATOR, {
                                        type: item.type,
                                        title: item.screenTitle,
                                    });
                                    trackEvent('creator_tool_viewed', {
                                        creator_tool_name: item.title,
                                    });
                                }}
                            >
                                {iconMap[item.icon]}
                                <TemplateBox width={16} />
                                <TemplateBox
                                    width={SCREEN_WIDTH / 1.6}
                                    onPress={() => {
                                        navigation.navigate(SCRIPTS_GENERATOR, {
                                            type: item.type,
                                            title: item.screenTitle,
                                        });
                                        trackEvent('creator_tool_viewed', {
                                            creator_tool_name: item.title,
                                        });
                                    }}
                                >
                                    <TemplateText bold size={16}>{item.title}</TemplateText>
                                    <TemplateBox height={10} />
                                    <TemplateText size={13}>{item.description}</TemplateText>
                                </TemplateBox>
                            </TemplateBox>

                        ))
                    }

                </TemplateBox>
                <Button
                    title="View Results History"
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
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,

    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PAYWALL_PRIMARY_BACKGROUND,
    },

    button: {
        marginVertical: 40,
        alignSelf: 'center',
        borderRadius: 16,
        backgroundColor: IOS_BLUE,
        width: WRAPPED_SCREEN_WIDTH,
    },
});
export default UGCAiScreen;
