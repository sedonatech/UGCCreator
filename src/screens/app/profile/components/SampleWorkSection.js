import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import TemplateBox from '../../../../components/TemplateBox';

import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import SampleWorkCard from './SampleWorkCard';
import useFeatureFlags from '../../../../hooks/featureFlags/useFeatureFlags';
import TemplateText from '../../../../components/TemplateText';
import { BLACK } from '../../../../theme/Colors';
import useAuthContext from '../../../../hooks/auth/useAuthContext';
import openUrl from '../../../../Utils/openUrl';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../../../consts/content/Portfolio';

const getIconByType = (type) => {
    if (type === 'videos') {
        return 'videocam-outline';
    } if (type === 'photos') {
        return 'camera-outline';
    }
    return 'article';
};

const SampleWorkSection = () => {
    const { feed } = useFeatureFlags();

    const filteredFeed = useMemo(() => {
        if (!feed?.feeds?.length) return [];

        return feed?.feeds?.filter((item) => item?.type === 'videoLessons' || item?.type === 'photoEditing');
    }, [feed]);

    const { auth } = useAuthContext();

    const profile = auth?.profile;
    const sampleVideos = profile?.sampleVideos;
    const samplePhotos = profile?.samplePhotos;

    const mergedWork = useMemo(() => {
        if (!sampleVideos?.length && !samplePhotos?.length) return [];

        const videos = sampleVideos?.map((item) => ({
            ...item,
            type: 'videos',
        }));

        const photos = samplePhotos?.map((item) => ({
            ...item,
            type: 'photos',
        }));

        return [...videos, ...photos];
    }, [sampleVideos, samplePhotos]);

    return !!mergedWork?.length && (
        <TemplateBox flex mt={WRAPPER_MARGIN * 2}>
            <TemplateBox ml={WRAPPER_MARGIN} mb={10}>
                <TemplateText bold color={BLACK} size={18}>My Work Examples</TemplateText>
            </TemplateBox>

            <TemplateCarousel
                data={mergedWork}
                renderItem={({ item }) => (
                    <LinkPreview
                        text={item?.link}
                        enableAnimation
                        renderLinkPreview={({
                            previewData,
                        }) => (
                            <SampleWorkCard
                                image={{
                                    uri:
                                        previewData?.image?.url
                                        || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE,
                                }}
                                title={previewData?.title || item?.title}
                                shortDescription={previewData?.description || item?.description}
                                style={styles.card}
                                onPress={() => openUrl(item?.link)}
                                icon={getIconByType(item?.type)}
                                titleSize={13}
                                descriptionSize={12}
                                titleLines={2}
                            />
                        )}
                    />
                )}
                contentContainerStyle={styles.cardCarousel}
                snapToInterval={SCREEN_WIDTH / 1.6}
                showPagination
                paginationSize={filteredFeed?.length}
                flex
            />
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    cardCarousel: {
        flexGrow: 1,
        paddingHorizontal: WRAPPER_MARGIN,
    },
    card: {
        width: SCREEN_WIDTH / 1.6,
        marginRight: 16,
        marginBottom: 0,
    },
});
export default SampleWorkSection;
