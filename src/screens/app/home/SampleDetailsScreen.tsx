import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Switch,
    Image,
} from 'react-native';
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    onSnapshot,
    deleteDoc,
    updateDoc,
} from '@react-native-firebase/firestore';
import SampleWorkModal from '../../../components/modals/SampleWorkModal';
import { BLACK, BLUE, DEFAULT_GRADIENT, ERROR_RED, GREY_SECONDARY, WHITE, WHITE_BG_08, SLATE_300 } from '../../../theme/Colors';
import TemplateText from '../../../components/TemplateText';
import { hp } from '../../../Utils/getResponsiveSize';
import TemplateBox from '../../../components/TemplateBox';
import { CREATORS_PROFILES_STACK, PROFILE, WEBVIEW } from '../../../navigation/ScreenNames';
import useAuthContext from '../../../hooks/auth/useAuthContext';
import useTranslation from '../../../hooks/useTranslation';
import useTrackEvent from '../../../hooks/events/useTrackEvent';

type Sample = {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    coverUrl: string;
    socialUrl?: string;
    isFeatured: boolean;
    showcaseOptIn: boolean;
    visibility: 'public' | 'private';
    createdAt?: FirebaseFirestoreTypes.Timestamp;
    updatedAt?: FirebaseFirestoreTypes.Timestamp;
};

type UserLite = {
    displayName?: string;
    photoURL?: string;
    handle?: string;
};

// TODO: Add SAMPLE_SUCCESS (#22c55e) to theme/Colors.js
const SAMPLE_SUCCESS = '#22c55e';

const COLORS = {
    card: 'rgba(20,22,24,0.6)',
    border: WHITE_BG_08,
    text: WHITE,
    textDim: SLATE_300,
    secondary: SAMPLE_SUCCESS,
};

export default function SampleDetailsScreen({ route, navigation }) {
    const { t } = useTranslation();
    const { trackEvent } = useTrackEvent();
    const { auth } = useAuthContext();
    const isCreator = auth?.profile?.type && auth?.profile?.type === 'creator';

    const id = route?.params?.id;

    const [sample, setSample] = useState<Sample | null>(null);
    const [owner, setOwner] = useState<UserLite | null>(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);

    const uid = auth?.profile?.id || null;
    const isOwner = useMemo(() => !!uid && sample?.ownerId === uid, [uid, sample?.ownerId]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TemplateBox
                    backgroundColor={BLUE}
                    ph={12}
                    pv={8}
                    mr={8}
                    borderRadius={8}
                    row
                    center
                    onPress={() => {
                        if (isCreator) {
                            return navigation.navigate(CREATORS_PROFILES_STACK, {
                                screen: PROFILE,
                                params: {
                                    creatorId: owner?.id,
                                },
                            });
                        }
                        return navigation.navigate(PROFILE, {
                            creatorId: owner?.id,
                        });
                    }}
                >
                    <TemplateText color={WHITE} size={hp(14)} medium>
                        {t('home.sampleDetails.viewCreator')}
                    </TemplateText>
                </TemplateBox>
            ),
        });
    }, [navigation, isCreator, owner, t]);

    useEffect(() => {
        trackEvent('screen_viewed', { screen: 'sample_details' });
    }, []);

    useEffect(() => {
        if (!id) return;
        const db = getFirestore();
        const ref = doc(collection(db, 'sampleWorks'), id);
        const unsub = onSnapshot(ref, async snap => {
            if (!snap.exists()) {
                setSample(null);
                setLoading(false);
                return;
            }
            const data = { id: snap.id, ...(snap.data() as any) } as Sample;
            setSample(data);
            setLoading(false);

            if (data.ownerId) {
                const userRef = doc(collection(db, 'users'), data.ownerId);
                const u = await getDoc(userRef);
                setOwner((u.exists() ? (u.data() as any) : null) as UserLite | null);
            }
        });
        return () => unsub();
    }, [id]);

    function onDelete() {
        if (!sample) return;
        Alert.alert(t('home.sampleDetails.deleteAlert.title'), t('home.sampleDetails.deleteAlert.message'), [
            { text: t('home.sampleDetails.deleteAlert.cancel'), style: 'cancel' },
            {
                text: t('home.sampleDetails.deleteAlert.confirm'),
                style: 'destructive',
                onPress: async () => {
                    trackEvent('sample_deleted');
                    const db = getFirestore();
                    const sampleRef = doc(collection(db, 'sampleWorks'), sample.id);
                    await deleteDoc(sampleRef);
                    navigation.goBack();
                },
            },
        ]);
    }

    async function toggleFeatured(v: boolean) {
        if (!sample) return;
        const db = getFirestore();
        const sampleRef = doc(collection(db, 'sampleWorks'), sample.id);
        await updateDoc(sampleRef, { isFeatured: v });
        trackEvent('sample_featured_toggled', { featured: v });
    }

    async function toggleShowcase(v: boolean) {
        if (!sample) return;
        const db = getFirestore();
        const sampleRef = doc(collection(db, 'sampleWorks'), sample.id);
        await updateDoc(sampleRef, { showcaseOptIn: v });
        trackEvent('sample_showcase_toggled', { showcase: v });
    }

    if (loading) {
        return (
            <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                <ActivityIndicator color={COLORS.text} />
            </View>
        );
    }

    if (!sample) {
        return (
            <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                <TemplateText color={COLORS.textDim}>{t('home.sampleDetails.notFound')}</TemplateText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TemplateBox
                style={{ borderBottomWidth: 1, borderColor: COLORS.border }}
                fullGradient
                gradientColors={DEFAULT_GRADIENT}
                borderBottomLeftRadius={20}
                borderBottomRightRadius={20}
                overflow="hidden"
            >
                <Image
                    source={{ uri: sample.coverUrl }}
                    style={{ width: '100%', height: 440, backgroundColor: COLORS.card }}
                    resizeMode="cover"
                />
            </TemplateBox>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <TemplateText size={22} bold style={{ color: BLACK, marginBottom: 16 }} numberOfLines={2}>
                    {sample.title}
                </TemplateText>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                    {sample.isFeatured && <Chip label={t('home.sampleDetails.chips.featured')} tone="good" />}
                    {sample.showcaseOptIn && <Chip label={t('home.sampleDetails.chips.showcase')} tone="good" />}
                </View>

                <TemplateText size={18} bold style={{ marginTop: 18, marginBottom: 6 }}>{t('home.sampleDetails.aboutThisWork')}</TemplateText>
                <TemplateText size={16} style={{ lineHeight: 20, color: BLACK }}>{sample.description}</TemplateText>

                <TemplateBox row hCenter>
                    {sample.socialUrl ? (
                        <TemplateBox
                            backgroundColor={BLACK}
                            ph={12}
                            pv={8}
                            borderRadius={26}
                            height={48}
                            width={200}
                            justifyContent="center"
                            alignItems="center"
                            alignSelf="flex-start"
                            mt={hp(20)}
                            onPress={() => {
                                trackEvent('sample_link_opened');
                                navigation.navigate(WEBVIEW, { url: sample.socialUrl });
                            }}
                            mr={12}
                        >
                            <TemplateText color={WHITE} size={hp(16)} medium>
                                {t('home.sampleDetails.openLink')}
                            </TemplateText>
                        </TemplateBox>
                    ) : null}
                </TemplateBox>

                {/* Owner-only controls */}
                {isOwner ? (
                    <View style={styles.ownerPanel}>
                        <TemplateText size={18} bold style={{ marginTop: 18, marginBottom: 6 }}>{t('home.sampleDetails.manage')}</TemplateText>

                        <View style={styles.toggleRow}>
                            <TemplateText>{t('home.sampleDetails.featuredOnProfile')}</TemplateText>
                            <Switch value={!!sample.isFeatured} onValueChange={toggleFeatured} thumbColor={WHITE} />
                        </View>

                        <View style={styles.toggleRow}>
                            <TemplateText>{t('home.sampleDetails.optInToShowcase')}</TemplateText>
                            <Switch value={!!sample.showcaseOptIn} onValueChange={toggleShowcase} thumbColor={WHITE} />
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                            <TouchableOpacity onPress={() => {
                                trackEvent('sample_edit_opened');
                                setEditOpen(true);
                            }} style={styles.ctaPrimary}>
                                <TemplateText color={WHITE} bold>{t('home.sampleDetails.edit')}</TemplateText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onDelete} style={styles.ctaDanger}>
                                <TemplateText color={WHITE} bold>{t('home.sampleDetails.delete')}</TemplateText>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}
            </ScrollView>

            {/* Inline edit modal (optional) */}
            {isOwner && <SampleWorkModal open={editOpen} onClose={() => setEditOpen(false)} initial={sample as any} />}
        </View>
    );
}

function Chip({ label, tone = 'default' }: { label: string; tone?: 'default' | 'good' | 'muted' }) {
    return (
        <View
            style={{
                borderColor: GREY_SECONDARY,
                borderWidth: 1,
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 6,
            }}
        >
            <TemplateText size={12} semiBold>{label}</TemplateText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        paddingTop: 65,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 9999,
    },
    iconBtn: {
        backgroundColor: BLUE,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
    },
    iconTxt: { color: WHITE, fontSize: 16, fontWeight: '500' },
    overlayBottom: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: 14,
    },
    title: { color: BLACK, fontSize: 22, fontWeight: '800', marginBottom: 16 },
    ownerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
    ownerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.card },
    ownerName: { color: COLORS.text, fontWeight: '700' },
    ownerHandle: { color: COLORS.textDim, marginTop: 2 },
    sectionTitle: { fontWeight: '700', fontSize: 18, marginTop: 18, marginBottom: 6 },
    description: { lineHeight: 20, fontSize: 16, color: BLACK },
    ownerPanel: {
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: GREY_SECONDARY,
        marginTop: 16,
    },
    toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
    toggleLabel: {},
    ctaPrimary: { backgroundColor: BLACK, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
    ctaPrimaryText: { color: WHITE, fontWeight: '700' },
    ctaDanger: { backgroundColor: ERROR_RED, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
    ctaDangerText: { color: WHITE, fontWeight: '700' },
    ctaSecondary: {
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    ctaSecondaryText: { color: COLORS.secondary, fontWeight: '700' },
    moreCard: {
        width: 140,
        backgroundColor: COLORS.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    moreImage: { width: '100%', height: 90 },
    moreTitle: { color: COLORS.text, padding: 8, fontWeight: '700' },
});
