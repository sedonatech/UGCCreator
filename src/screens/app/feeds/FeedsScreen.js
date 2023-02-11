import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TemplateText from '../../../components/TemplateText';
import {
    IS_ANDROID, SCREEN_HEIGHT, SCREEN_WIDTH, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import {
    LAVENDER, TRANSPARENT, WHITE,
} from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import Blob from '../../../../assets/svgs/Blob';
import { FEED_CATEGORIES } from '../../../consts/content/Home';
import useFeatureFlags from '../../../hooks/auth/featureFlags/useFeatureFlags';
import ToggleCarousel from '../../../components/ToggleCarousel';
import FeedCard from './components/FeedCard';
import VideoOverlay from '../../../components/VideoOverlay';

const FeedsScreen = () => {
    const [selectedStatus, setSelectedStatus] = useState(FEED_CATEGORIES[0]);

    const { feed } = useFeatureFlags();
    console.log('-> feed', JSON.stringify(feed, null, 2));

    const [selectedVideoUrl, setSelectedVideoUrl] = useState();

    const filteredFeed = useMemo(() => {
        if (!feed) return [];

        return feed?.feeds?.filter((item) => {
            if (selectedStatus?.value === 'all') return true;
            return item?.type === selectedStatus?.value;
        });
    }, [feed, selectedStatus]);

    return (
        <ScrollView style={styles.container}>
            <TemplateBox>
                <Blob top color={LAVENDER} />
                <Blob right color={LAVENDER} />
                <Blob color={LAVENDER} bottom />
                <Blob center />
            </TemplateBox>
            <TemplateBox
                mt={SCREEN_HEIGHT * 0.15}
                alignItems="center"
                justifyContent="center"
            >
                <TemplateText
                    size={18}
                    startCase
                    bold
                >
                    Check the status of your offers
                </TemplateText>
            </TemplateBox>

            <ToggleCarousel
                data={FEED_CATEGORIES}
                selectedTab={selectedStatus}
                onChange={setSelectedStatus}
            />

            {
                filteredFeed && filteredFeed?.map((item, index) => (
                    <FeedCard
                        key={`feed-${index}`}
                        image={{ uri: item?.thumbnail }}
                        title={item?.title}
                        subtitle={item?.subtitle}
                        shortDescription={item?.description}
                        style={styles.card}
                        cardWidth={SCREEN_WIDTH / 1.12}
                        aspectRatio={1.8}
                        slideInDelay={(index + 1) * 100}
                        showVideoButton={item?.type === 'videoLessons'}
                        onPress={() => {
                            console.log('item', item?.videoUrl);
                            if (item?.type === 'videoLessons') {
                                setSelectedVideoUrl(item?.videoUrl);
                            }
                        }}
                    />
                ))
            }
            <VideoOverlay
                url={selectedVideoUrl}
                muted={false}
                upscale
                landscape
                onShow={() => ''}
                onClose={() => setSelectedVideoUrl(null)}
                name="video"
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    card: {
        marginBottom: WRAPPER_MARGIN,
        alignSelf: 'center',
    },
});
export default FeedsScreen;
