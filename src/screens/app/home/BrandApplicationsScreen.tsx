import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import {
    BrandApplication,
    ApplicationStatus,
    getMyBrandApplications,
    updateBrandApplication,
    deleteBrandApplication,
    snoozeFollowUp,
} from '../../../lib/brandApplications';
import {
    BLACK_20,
    BLUE_500,
    DARK_METAL,
    GREEN,
    GREY,
    METAL,
    RED_500,
    WHITE,
    TRANSPARENT,
    FUCSHIA_500,
} from '../../../theme/Colors';
import { HEADER_MARGIN, IS_ANDROID, WRAPPED_SCREEN_WIDTH } from '../../../theme/Layout';
import { wp } from '../../../Utils/getResponsiveSize';
import { WEBVIEW } from '../../../navigation/ScreenNames';
import DynamicIcon from '../../../components/icons/DynamicIcon';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string }> = {
    applied: { label: 'Applied', color: BLUE_500 },
    heard_back: { label: 'Heard Back', color: '#F59E0B' },
    accepted: { label: 'Accepted', color: GREEN },
    rejected: { label: 'Rejected', color: RED_500 },
};

const STATUS_ORDER: ApplicationStatus[] = ['applied', 'heard_back', 'accepted', 'rejected'];

const BrandApplicationsScreen = ({ navigation }: any) => {
    const { auth } = useAuthContext();
    const uid = auth?.profile?.id;
    const [applications, setApplications] = useState<BrandApplication[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        if (!uid) return;
        setLoading(true);
        try {
            const data = await getMyBrandApplications(uid);
            setApplications(data);
        } catch (e) {
            console.log('Error fetching brand applications:', e);
        } finally {
            setLoading(false);
        }
    }, [uid]);

    useFocusEffect(
        useCallback(() => {
            void refresh();
        }, [refresh]),
    );

    const handleStatusChange = async (app: BrandApplication) => {
        const currentIndex = STATUS_ORDER.indexOf(app.status);
        const nextStatus = STATUS_ORDER[(currentIndex + 1) % STATUS_ORDER.length];

        Alert.alert(
            'Update Status',
            `Change status to "${STATUS_CONFIG[nextStatus].label}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Update',
                    onPress: async () => {
                        if (!app.id) return;
                        await updateBrandApplication(app.id, { status: nextStatus });
                        refresh();
                    },
                },
            ],
        );
    };

    const isFollowUpDue = (app: BrandApplication) => {
        if (!app.nextFollowUp?.toDate) return false;
        return app.nextFollowUp.toDate().getTime() <= Date.now();
    };

    const handleSnooze = (app: BrandApplication) => {
        Alert.alert(
            'Snooze Reminder',
            `Remind you to follow up on "${app.brandName}" again in:`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: '3 Days',
                    onPress: async () => {
                        if (!app.id) return;
                        await snoozeFollowUp(app.id, 3);
                        refresh();
                    },
                },
                {
                    text: '7 Days',
                    onPress: async () => {
                        if (!app.id) return;
                        await snoozeFollowUp(app.id, 7);
                        refresh();
                    },
                },
            ],
        );
    };

    const handleDelete = (app: BrandApplication) => {
        Alert.alert(
            'Delete Application',
            `Remove "${app.brandName}" from your tracker?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        if (!app.id) return;
                        await deleteBrandApplication(app.id);
                        refresh();
                    },
                },
            ],
        );
    };

    const renderItem = ({ item }: { item: BrandApplication }) => {
        const statusConf = STATUS_CONFIG[item.status];

        return (
            <TemplateBox
                borderRadius={wp(16)}
                pAll={wp(16)}
                style={styles.card}
                width={WRAPPED_SCREEN_WIDTH}
                borderWidth={1}
                borderColor={BLACK_20}
                selfCenter
                mb={20}
            >
                {/* Header: brand name + status pill */}
                <TemplateBox row alignItems="center" justifyContent="space-between" mb={8}>
                    <TemplateBox flex={1} mr={10}>
                        <TemplateText size={16} semiBold numberOfLines={1} color={DARK_METAL}>
                            {item.brandName}
                        </TemplateText>
                    </TemplateBox>
                    <TemplateBox
                        pv={4}
                        ph={12}
                        borderRadius={10}
                        backgroundColor={`${statusConf.color}20`}
                        onPress={() => handleStatusChange(item)}
                    >
                        <TemplateText size={12} medium color={statusConf.color}>
                            {statusConf.label}
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>

                {/* Link */}
                <TemplateBox
                    row
                    alignItems="center"
                    mb={8}
                    onPress={() => navigation.navigate(WEBVIEW, { url: item.link })}
                >
                    <TemplateText size={12} numberOfLines={1} color={BLUE_500} mr={4}>
                        {item.link}
                    </TemplateText>
                    <DynamicIcon name="Link" color={BLUE_500} />
                </TemplateBox>

                {/* Follow-up reminder */}
                {isFollowUpDue(item) && (
                    <TemplateBox
                        row
                        alignItems="center"
                        justifyContent="space-between"
                        pv={6}
                        ph={10}
                        borderRadius={8}
                        backgroundColor={`${FUCSHIA_500}15`}
                        mb={8}
                    >
                        <TemplateText size={12} medium color={FUCSHIA_500}>
                            Time to follow up!
                        </TemplateText>
                        <TemplateBox
                            pv={4}
                            ph={10}
                            borderRadius={6}
                            backgroundColor={`${FUCSHIA_500}20`}
                            onPress={() => handleSnooze(item)}
                        >
                            <TemplateText size={11} medium color={FUCSHIA_500}>
                                Snooze
                            </TemplateText>
                        </TemplateBox>
                    </TemplateBox>
                )}

                {/* Notes */}
                {item.notes ? (
                    <TemplateText size={13} color={METAL} numberOfLines={2} mb={8}>
                        {item.notes}
                    </TemplateText>
                ) : null}

                {/* Footer: date + delete */}
                <TemplateBox row alignItems="center" justifyContent="space-between">
                    <TemplateText size={11} color={GREY}>
                        {item.appliedAt?.toDate?.()
                            ? item.appliedAt.toDate().toLocaleDateString()
                            : ''}
                    </TemplateText>
                    <TemplateBox onPress={() => handleDelete(item)} pAll={4}>
                        <TemplateText size={12} color={RED_500}>
                            Remove
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>
        );
    };

    return (
        <TemplateBox flex backgroundColor={WHITE}>
            <FlatList
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                data={applications}
                renderItem={renderItem}
                keyExtractor={(item) => item.id || item.brandName}
                onRefresh={refresh}
                refreshing={loading}
                ListHeaderComponent={
                    <TemplateBox center mb={16}>
                        <TemplateText size={18} bold center>
                            Application Tracker
                        </TemplateText>
                        <TemplateText size={13} color={METAL} center mt={4}>
                            Track your brand deal & affiliate applications
                        </TemplateText>
                    </TemplateBox>
                }
                ListEmptyComponent={
                    !loading ? (
                        <TemplateBox center mt={60}>
                            <TemplateText size={14} color={GREY} center>
                                No applications tracked yet.{'\n'}
                                Apply to a brand and tap "Track Application" to get started.
                            </TemplateText>
                        </TemplateBox>
                    ) : null
                }
            />
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
        marginTop: HEADER_MARGIN,
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: WHITE,
    },
});

export default BrandApplicationsScreen;
