import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TemplateBox from "../../../../components/TemplateBox";
import { SCREEN_WIDTH, WRAPPER_MARGIN } from "../../../../theme/Layout";
import TemplateText from "../../../../components/TemplateText";
import TemplateCarousel from "../../../../components/carousels/TemplateCarousel";
import ProjectCard from "./ProjectCard";
import { BLACK } from "../../../../theme/Colors";
import { SAMPLE_DETAILS_SCREEN } from "../../../../navigation/ScreenNames";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useFeatureFlags from "../../../../hooks/featureFlags/useFeatureFlags";

type Item = {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    socialUrl?: string;
};

const MAX_ITEMS = 6;
const TODAY_KEY = new Date().toISOString().slice(0, 10);
const SHOWCASE_KEY = "showcase_today";

export default function FeaturedShowcaseCarousel({ style }) {
    const [items, setItems] = useState<Item[]>([]);
    const navigation = useNavigation();

    const { features } = useFeatureFlags();
    const showCreatorShowcase = features?.showAffiliateProgramsCarousel;

    useFocusEffect(
        React.useCallback(() => {
        let mounted = true;
        (async () => {
            try {
                const cached = await AsyncStorage.getItem(SHOWCASE_KEY);
                if (cached) {
                    const { dateKey, sampleIds } = JSON.parse(cached) as {
                        dateKey: string;
                        sampleIds: string[];
                    };
                    if (dateKey === TODAY_KEY && sampleIds?.length) {
                        const snap = await firestore()
                            .collection("sampleWorks")
                            .where(firestore.FieldPath.documentId(), "in", sampleIds.slice(0, MAX_ITEMS))
                            .where("showcaseOptIn", "==", true)
                            .get();

                        const map = new Map<string, any>();
                        snap.forEach(d => map.set(d.id, d.data()));
                        const ordered = sampleIds
                            .slice(0, MAX_ITEMS)
                            .map(id => (map.has(id) ? { id, ...(map.get(id) as any) } : null))
                            .filter(Boolean) as any[];

                        if (mounted) setItems(ordered);
                        return;
                    }
                }

                // 2) No cache → get 6 random via rand pivot
                const pivot = Math.random();
                const base = firestore()
                    .collection("sampleWorks")
                    .where("visibility", "==", "public")
                    .where("showcaseOptIn", "==", true)
                    .orderBy("rand", "asc"); // needs composite index with (visibility, isFeatured, rand)

                const aSnap = await base.where("rand", ">=", pivot).limit(MAX_ITEMS).get();
                let docs = aSnap.docs;

                if (docs.length < MAX_ITEMS) {
                    const bSnap = await base.where("rand", "<", pivot).limit(MAX_ITEMS - docs.length).get();
                    docs = docs.concat(bSnap.docs);
                }

                // Fallback if no docs (e.g., early data) → newest 6
                if (docs.length === 0) {
                    const fb = await firestore()
                        .collection("sampleWorks")
                        .where("visibility", "==", "public")
                        .where("isFeatured", "==", true)
                        .orderBy("createdAt", "desc")
                        .limit(MAX_ITEMS)
                        .get();
                    docs = fb.docs;
                }

                const picked = docs.slice(0, MAX_ITEMS).map((d) => ({ id: d.id, ...(d.data() as any) })) as Item[];
                const ids = picked.map((p) => p.id);

                if (docs?.length >= MAX_ITEMS) {
                    await AsyncStorage.setItem(
                        SHOWCASE_KEY,
                        JSON.stringify({ dateKey: TODAY_KEY, sampleIds: ids })
                    );
                }
                if (mounted) setItems(picked);
            } catch (e: any) {
                console.warn("Showcase load error:", e?.message ?? e);
                if (mounted) setItems([]);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [TODAY_KEY])
    );

    if (!items.length || !showCreatorShowcase) return null;

    return (
        <TemplateBox style={style} flex>
            <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={12}>
                <TemplateText size={18} bold>Featured Creator Showcase</TemplateText>
                <TemplateBox flex />
            </TemplateBox>
            <TemplateText size={13} color={BLACK} style={styles.subtitle}>
                {`Discover what creators are making now.\nupdate your sample work in portfolio to be featured`}
            </TemplateText>

            <TemplateCarousel
                data={items}
                renderItem={({ item }) => (
                    <ProjectCard
                        key={item?.id}
                        image={!!item?.coverUrl && { uri: item?.coverUrl }}
                        title={item?.title}
                        shortDescription={item?.description}
                        onPress={() => navigation.navigate(SAMPLE_DETAILS_SCREEN, {
                            id: item?.id,
                        })}
                        style={styles.card}
                        isShowcase
                    />
                )}
                contentContainerStyle={styles.cardCarousel}
                snapToInterval={(SCREEN_WIDTH / 2) - 28}
            />
        </TemplateBox>
    )
}

const styles = StyleSheet.create({
    card: {
        marginRight: 15,
    },
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    subtitle: {
        marginLeft: WRAPPER_MARGIN,
        marginBottom: 10,
    },
})
