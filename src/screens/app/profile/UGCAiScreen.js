import React from 'react';

import { Alert, ScrollView, StyleSheet } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import {
    HEADER_MARGIN,
    IS_ANDROID, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    PAYWALL_PRIMARY_BACKGROUND,
    TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';
import ScriptsSvg from '../../../../assets/svgs/ScriptsSvg';
import SuggestorSvg from '../../../../assets/svgs/SuggestorSvg';
import HooksSvg from '../../../../assets/svgs/HooksSvg';
import TemplateTouchable from '../../../components/TemplateTouchable';
import {
    CONTENT_SUGGESTOR,
    HOOKS_GENERATOR,
    SCRIPTS_GENERATOR,
} from '../../../navigation/ScreenNames';

const UGCAiScreen = ({ navigation }) => {
    const creatorTools = [
        {
            title: 'Scripts Generator',
            description: 'This tool helps you generate scripts for your videos based on your project requirements.',
            screen: SCRIPTS_GENERATOR,
            icon: 'scripts',
        },
        {
            title: 'Content Suggester',
            description: 'This tool  suggests content for you to create based on your project requirements.',
            screen: CONTENT_SUGGESTOR,
            icon: 'suggestor',
        },
        {
            title: 'Hook Generator',
            description: 'This tool helps you generate hooks for your project.',
            screen: HOOKS_GENERATOR,
            icon: 'hooks',
        },
    ];

    const iconMap = {
        scripts: ScriptsSvg(),
        suggestor: SuggestorSvg(),
        hooks: HooksSvg(),
    };

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
                                onPress={() => navigation.navigate(item.screen)}
                            >
                                {iconMap[item.icon]}
                                <TemplateBox width={16} />
                                <TemplateBox
                                    width={SCREEN_WIDTH / 1.6}
                                    onPress={() => navigation.navigate(item.screen)}
                                >
                                    <TemplateText bold size={16}>{item.title}</TemplateText>
                                    <TemplateBox height={10} />
                                    <TemplateText size={13}>{item.description}</TemplateText>
                                </TemplateBox>
                            </TemplateBox>

                        ))
                    }

                </TemplateBox>
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
});
export default UGCAiScreen;
