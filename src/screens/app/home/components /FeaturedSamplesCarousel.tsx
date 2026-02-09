import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
    getFirestore,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    documentId,
} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TemplateBox from '../../../../components/TemplateBox';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import ProjectCard from './ProjectCard';
import { BLACK } from '../../../../theme/Colors';
import { SAMPLE_DETAILS_SCREEN } from '../../../../navigation/ScreenNames';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useFeatureFlags from '../../../../hooks/featureFlags/useFeatureFlags';
import useTranslation from '../../../../hooks/useTranslation';

type Item = {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    socialUrl?: string;
};

const MAX_ITEMS = 6;
const TODAY_KEY = new Date().toISOString().slice(0, 10);
const SHOWCASE_KEY = 'showcase_today';

import { ViewStyle } from 'react-native';

type FeaturedShowcaseCarouselProps = {
    style?: ViewStyle;
};

export default function FeaturedShowcaseCarousel({ style }: FeaturedShowcaseCarouselProps) {
    const [items, setItems] = useState<Item[]>([]);
    const { t } = useTranslation();

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
                            const db = getFirestore();
                            const sampleWorksRef = collection(db, 'sampleWorks');
                            const snapQuery = query(
                                sampleWorksRef,
                                where(documentId(), 'in', sampleIds.slice(0, MAX_ITEMS)),
                                where('showcaseOptIn', '==', true),
                            );
                            const snap = await getDocs(snapQuery);
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
                    const db = getFirestore();
                    const sampleWorksRef = collection(db, 'sampleWorks');
                    const baseQuery = query(
                        sampleWorksRef,
                        where('visibility', '==', 'public'),
                        where('showcaseOptIn', '==', true),
                        orderBy('rand', 'asc'),
                    );
                    const aQuery = query(
                        sampleWorksRef,
                        where('visibility', '==', 'public'),
                        where('showcaseOptIn', '==', true),
                        orderBy('rand', 'asc'),
                        where('rand', '>=', pivot),
                        limit(MAX_ITEMS),
                    );
                    const aSnap = await getDocs(aQuery);
                    let docs = aSnap.docs;
                    if (docs.length < MAX_ITEMS) {
                        const bQuery = query(
                            sampleWorksRef,
                            where('visibility', '==', 'public'),
                            where('showcaseOptIn', '==', true),
                            orderBy('rand', 'asc'),
                            where('rand', '<', pivot),
                            limit(MAX_ITEMS - docs.length),
                        );
                        const bSnap = await getDocs(bQuery);
                        docs = docs.concat(bSnap.docs);
                    }
                    // Fallback if no docs (e.g., early data) → newest 6
                    if (docs.length === 0) {
                        const fbQuery = query(
                            sampleWorksRef,
                            where('visibility', '==', 'public'),
                            where('isFeatured', '==', true),
                            orderBy('createdAt', 'desc'),
                            limit(MAX_ITEMS),
                        );
                        const fb = await getDocs(fbQuery);
                        docs = fb.docs;
                    }

                    interface SampleWorkDoc {
                        id: string;
                        title: string;
                        description: string;
                        coverUrl: string;
                        socialUrl?: string;
                        [key: string]: any;
                    }

                    const picked: Item[] = docs.slice(0, MAX_ITEMS).map((d: any): SampleWorkDoc => {
                        const { id: _id, ...data } = d.data() as SampleWorkDoc;
                        return { id: d.id, ...data };
                    });
                    const ids = picked.map(p => p.id);

                    if (docs?.length >= MAX_ITEMS) {
                        await AsyncStorage.setItem(
                            SHOWCASE_KEY,
                            JSON.stringify({ dateKey: TODAY_KEY, sampleIds: ids }),
                        );
                    }
                    if (mounted) setItems(picked);
                } catch (e: any) {
                    console.warn('Showcase load error:', e?.message ?? e);
                    if (mounted) setItems([]);
                }
            })();

            return () => {
                mounted = false;
            };
        }, [TODAY_KEY]),
    );

    if (!items.length || !showCreatorShowcase) return null;

    return (
        <TemplateBox style={style} flex>
            <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={12}>
                <TemplateText size={18} bold>
                    {t('home.showcase.title')}
                </TemplateText>
                <TemplateBox flex />
            </TemplateBox>

            <TemplateBox mh={WRAPPER_MARGIN} mb={16}>
                <TemplateText size={13} color={BLACK}>
                    {t('home.showcase.description')}
                </TemplateText>
            </TemplateBox>

            <TemplateCarousel
                data={items}
                renderItem={({ item }) => (
                    <ProjectCard
                        key={item?.id}
                        image={!!item?.coverUrl && { uri: item?.coverUrl }}
                        title={item?.title}
                        shortDescription={item?.description}
                        onPress={() =>
                            navigation.navigate(SAMPLE_DETAILS_SCREEN, {
                                id: item?.id,
                            })
                        }
                        style={styles.card}
                        isShowcase
                    />
                )}
                contentContainerStyle={styles.cardCarousel}
                snapToInterval={SCREEN_WIDTH / 2 - 28}
            />
        </TemplateBox>
    );
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
});
