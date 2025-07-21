import React, { useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Button,
    ActivityIndicator,
    Switch,
} from 'react-native';
import useAITools from '../../../hooks/creatorTools/useAITools';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import { IS_ANDROID, SCREEN_HEIGHT } from '../../../theme/Layout';
import { BLACK, TRANSPARENT, WHITE } from '../../../theme/Colors';
import AIIcon from '../../../../assets/svgs/AIIcon';
import useAuthContext from '../../../hooks/auth/useAuthContext';

const PitchPalScreen = () => {
    const {
        emailTokens: generatedEmailTokens,
        authenticateEmail,
        leads,
        scanning,
        drafts,
        sending,
        replies,
        tracking,
        scanLeads,
    } = useAITools();
    console.log('🚀 ~ PitchPalScreen ~ leads:', JSON.stringify(leads, null, 2));

    const { auth } = useAuthContext();
    const userProfile = auth?.profile || {};

    const userAuthTokens = userProfile?.gmailAuth;

    const emailTokens = generatedEmailTokens || userAuthTokens;

    // check if the user from firebase has email tokens

    // Automatically kick off agent steps once authenticated
    // useEffect(() => {
    //     if (emailTokens) {
    //         scanLeads();
    //     }
    // }, [emailTokens]);

    const stats = {
        leads: leads.length,
        drafts: drafts.length,
        sent: leads.length, // assume one email per lead
        replies: replies.length,
        pending: leads.length - replies.length,
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <TemplateBox ph={16} pv={24} style={styles.headerBox}>
                <AIIcon size={64} color={BLACK} />
                <TemplateText variant="h2">PitchPal Pro</TemplateText>
                <TemplateText variant="subtitle">Your Pitch Partner</TemplateText>
            </TemplateBox>

            {/* Connect Email */}
            {!emailTokens && (
                <TemplateBox ph={16} pv={20} style={styles.actionBox}>
                    <TemplateText variant="h3">Connect Your Email</TemplateText>
                    <Button title="Connect Gmail" onPress={authenticateEmail} />
                </TemplateBox>
            )}

            {/* Agent Status */}
            {emailTokens && (
                <TemplateBox ph={16} pv={20} style={styles.statusBox}>
                    <TemplateText variant="h3">AI Agent Status</TemplateText>

                    <View style={styles.statusRow}>
                        <TemplateText>Scanning leads:</TemplateText>
                        {scanning ? <ActivityIndicator /> : <TemplateText>{stats.leads}</TemplateText>}
                    </View>

                    <View style={styles.statusRow}>
                        <TemplateText>Drafts ready:</TemplateText>
                        {scanning ? <ActivityIndicator /> : <TemplateText>{stats.drafts}</TemplateText>}
                    </View>

                    <View style={styles.statusRow}>
                        <TemplateText>Messages sent:</TemplateText>
                        {sending ? <ActivityIndicator /> : <TemplateText>{stats.sent}</TemplateText>}
                    </View>

                    <View style={styles.statusRow}>
                        <TemplateText>Replies:</TemplateText>
                        {tracking ? <ActivityIndicator /> : <TemplateText>{stats.replies}</TemplateText>}
                    </View>
                </TemplateBox>
            )}

            {/* Daily Notifications toggle only after sending is done */}
            {emailTokens && !sending && stats.sent > 0 && (
                <TemplateBox ph={16} pv={12} style={styles.notificationBox}>
                    <View style={[styles.statusRow, { justifyContent: 'space-between' }]}>
                        <TemplateText>Send me daily PitchPal updates</TemplateText>
                        <Switch
                            value={false /* wire up to your dailyNotify state */}
                            onValueChange={() => {} /* toggle daily notifications */}
                        />
                    </View>
                </TemplateBox>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    contentContainer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    headerBox: {
        marginTop: SCREEN_HEIGHT * 0.1,
        alignItems: 'center',
        backgroundColor: TRANSPARENT,
    },
    actionBox: {
        marginTop: 24,
        width: '90%',
        borderRadius: 8,
        backgroundColor: '#eef2f5',
        alignItems: 'center',
    },
    statusBox: {
        marginTop: 24,
        width: '90%',
        borderRadius: 8,
        backgroundColor: '#f7f9fa',
    },
    notificationBox: {
        marginTop: 16,
        width: '90%',
        borderRadius: 8,
        backgroundColor: '#fefefe',
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
});

export default PitchPalScreen;
