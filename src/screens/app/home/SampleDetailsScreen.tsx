import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    ImageBackground,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Share,
    Switch,
} from "react-native";
import { getFirestore, collection, doc, getDoc, onSnapshot, deleteDoc, updateDoc } from "@react-native-firebase/firestore";
import SampleWorkModal from "../../../components/modals/SampleWorkModal";
import { BLACK, BLUE, DEFAULT_GRADIENT, ERROR_RED, GREY_SECONDARY, PRIMARY, WHITE } from "../../../theme/Colors";
import TemplateText from "../../../components/TemplateText";
import { hp } from "../../../Utils/getResponsiveSize";
import TemplateBox from "../../../components/TemplateBox";
import { CREATORS_PROFILES_STACK, PROFILE, WEBVIEW } from "../../../navigation/ScreenNames";
import useAuthContext from "../../../hooks/auth/useAuthContext";

type Sample = {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    coverUrl: string;
    socialUrl?: string;
    isFeatured: boolean;
    showcaseOptIn: boolean;
    visibility: "public" | "private";
    createdAt?: FirebaseFirestoreTypes.Timestamp;
    updatedAt?: FirebaseFirestoreTypes.Timestamp;
};

type UserLite = {
    displayName?: string;
    photoURL?: string;
    handle?: string;
};

const COLORS = {
    card: "rgba(20,22,24,0.6)",
    border: "#ffffff18",
    text: "#ffffff",
    textDim: "#cbd5e1",
    secondary: "#22c55e",
};

export default function SampleDetailsScreen({ route, navigation }) {
    const { auth } = useAuthContext();
    const isCreator = auth?.profile?.type && auth?.profile?.type === 'creator';

    const id = route?.params?.id;

    const [sample, setSample] = useState<Sample | null>(null);
    const [owner, setOwner] = useState<UserLite | null>(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);

    const uid = auth?.profile?.id || null;
    const isOwner = useMemo(() => !!uid && sample?.ownerId === uid, [uid, sample?.ownerId]);

    useEffect(() => {
        if (!id) return;
        const db = getFirestore();
        const ref = doc(collection(db, "sampleWorks"), id);
        const unsub = onSnapshot(ref, async (snap) => {
            if (!snap.exists()) {
                setSample(null);
                setLoading(false);
                return;
            }
            const data = { id: snap.id, ...(snap.data() as any) } as Sample;
            setSample(data);
            setLoading(false);

            if (data.ownerId) {
                const userRef = doc(collection(db, "users"), data.ownerId);
                const u = await getDoc(userRef);
                setOwner((u.exists() ? (u.data() as any) : null) as UserLite | null);
            }
        });
        return () => unsub();
    }, [id]);

    function onDelete() {
        if (!sample) return;
        Alert.alert("Delete sample", "This action cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    const db = getFirestore();
                    const sampleRef = doc(collection(db, "sampleWorks"), sample.id);
                    await deleteDoc(sampleRef);
                    navigation.goBack();
                },
            },
        ]);
    }

    async function toggleFeatured(v: boolean) {
        if (!sample) return;
    const db = getFirestore();
    const sampleRef = doc(collection(db, "sampleWorks"), sample.id);
    await updateDoc(sampleRef, { isFeatured: v });
    }

    async function toggleShowcase(v: boolean) {
        if (!sample) return;
    const db = getFirestore();
    const sampleRef = doc(collection(db, "sampleWorks"), sample.id);
    await updateDoc(sampleRef, { showcaseOptIn: v });
    }

    if (loading) {
        return (
            <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
                <ActivityIndicator color={COLORS.text} />
            </View>
        );
    }

    if (!sample) {
        return (
            <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
                <Text style={{ color: COLORS.textDim }}>Sample not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TemplateBox
                style={{ borderBottomWidth: 1, borderColor: COLORS.border }}
                fullGradient
                gradientColors={DEFAULT_GRADIENT}
            >
                <ImageBackground
                    source={{ uri: sample.coverUrl }}
                    style={{ width: "100%", height: 300, backgroundColor: COLORS.card }}
                    resizeMode="cover"
                >
                    <TemplateBox style={styles.topBar}>
                         <TemplateBox backgroundColor={BLUE} ph={12} pv={8} borderRadius={8} alignSelf='flex-start'
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
                            <TemplateText color={WHITE} size={hp(14)} medium>View Creator</TemplateText>
                        </TemplateBox>
                    </TemplateBox>

                    <View style={styles.overlayBottom}>
                        <Text style={styles.title} numberOfLines={2}>
                            {sample.title}
                        </Text>
                    </View>
                </ImageBackground>
            </TemplateBox>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {sample.isFeatured && <Chip label="Featured" tone="good" />}
                    {sample.showcaseOptIn && <Chip label="Showcase" tone="good" />}
                </View>

                <Text style={styles.sectionTitle}>About this work</Text>
                <Text style={styles.description}>{sample.description}</Text>

                <TemplateBox row hCenter>
                    {sample.socialUrl ? (
                        <TemplateBox backgroundColor={PRIMARY} ph={12} pv={8} borderRadius={8} alignSelf='flex-start' mt={hp(20)}
                            onPress={() => navigation.navigate(WEBVIEW, { url: sample.socialUrl })}
                            mr={12}
                        >
                            <TemplateText color={WHITE} size={hp(14)} medium>Open Link</TemplateText>
                        </TemplateBox>
                    ) : null}
                       
                </TemplateBox>

                {/* Owner-only controls */}
                {isOwner ? (
                    <View style={styles.ownerPanel}>
                        <Text style={styles.sectionTitle}>Manage</Text>

                        <View style={styles.toggleRow}>
                            <Text style={styles.toggleLabel}>Featured on profile</Text>
                            <Switch
                                value={!!sample.isFeatured}
                                onValueChange={toggleFeatured}
                                thumbColor={"#fff"}
                            />
                        </View>

                        <View style={styles.toggleRow}>
                            <Text style={styles.toggleLabel}>Opt-in to Showcase</Text>
                            <Switch
                                value={!!sample.showcaseOptIn}
                                onValueChange={toggleShowcase}
                                thumbColor={"#fff"}
                            />
                        </View>

                        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
                            <TouchableOpacity onPress={() => setEditOpen(true)} style={styles.ctaPrimary}>
                                <Text style={styles.ctaPrimaryText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onDelete} style={styles.ctaDanger}>
                                <Text style={styles.ctaDangerText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}
            </ScrollView>

            {/* Inline edit modal (optional) */}
            {isOwner && (
                <SampleWorkModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    initial={sample as any}
                />
            )}
        </View>
    );
}

function Chip({ label, tone = "default" }: { label: string; tone?: "default" | "good" | "muted" }) {
    return (
        <View style={{ borderColor: GREY_SECONDARY, borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "600" }}>{label}</Text>
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        zIndex: 9999
    },
    iconBtn: {
        backgroundColor: BLUE,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
    },
    iconTxt: { color: WHITE, fontSize: 16, fontWeight: "500" },
    overlayBottom: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 16,
        paddingBottom: 14,
    },
    title: { color: COLORS.text, fontSize: 22, fontWeight: "800" },
    ownerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 14 },
    ownerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.card },
    ownerName: { color: COLORS.text, fontWeight: "700" },
    ownerHandle: { color: COLORS.textDim, marginTop: 2 },
    sectionTitle: { fontWeight: "800", fontSize: 16, marginTop: 18, marginBottom: 6 },
    description: { lineHeight: 20 },
    ownerPanel: {
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: GREY_SECONDARY,
        marginTop: 16,
    },
    toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
    toggleLabel: {},
    ctaPrimary: { backgroundColor: BLACK, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
    ctaPrimaryText: { color: "#fff", fontWeight: "700" },
    ctaDanger: { backgroundColor: ERROR_RED, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
    ctaDangerText: { color: WHITE, fontWeight: "700" },
    ctaSecondary: { borderWidth: 1, borderColor: COLORS.border, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
    ctaSecondaryText: { color: COLORS.secondary, fontWeight: "700" },
    moreCard: {
        width: 140,
        backgroundColor: COLORS.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: "hidden",
    },
    moreImage: { width: "100%", height: 90 },
    moreTitle: { color: COLORS.text, padding: 8, fontWeight: "700" },
});
