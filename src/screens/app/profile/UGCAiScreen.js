import React, { useState } from 'react';
import functions from '@react-native-firebase/functions';

import { Alert, ScrollView, StyleSheet } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import {
    HEADER_MARGIN,
    IS_ANDROID, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import ProfileStatusCard from '../../../components/cards/ProfileStatusCard';

const UGCAiScreen = () => {
    const creatorTools = [
        {
            title: 'Content Suggester',
            description: 'This tool will suggest content for you to create based on your project requirements.',
            onPress: () => Alert.alert('Coming Soon'),
            icon: 'analytics-outline',
        },
        {
            title: 'Hook Generator',
            description: 'This tool will help you generate hooks for your project.',
            onPress: () => '',
            icon: 'color-wand-outline',
        },
        {
            title: 'Email Generator',
            description: 'This tool will help you generate catchy emails to reach out to potential brands in a powerful way based on their needs.',
            onPress: () => '',
            icon: 'mail-unread-outline',
        },
        {
            title: 'Scripts Generator',
            description: 'This tool will help you generate scripts for your videos based on your project requirements.',
            onPress: () => '',
            icon: 'receipt-outline',
        },
    ];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <TemplateBox
                mt={HEADER_MARGIN}
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
                            <ProfileStatusCard
                                key={`creator-tool-${index}`}
                                title={item.title}
                                description={item.description}
                                showProgress={false}
                                style={styles.statusCard}
                                slideInDelay={(index + 1) * 100}
                                descriptionLines={3}
                                icon={item.icon}
                                onPress={() => {
                                    Alert.alert('Coming Soon');
                                }}
                            />
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
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,

    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusCard: {
        marginVertical: 20,
    },
});
export default UGCAiScreen;
