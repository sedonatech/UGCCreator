import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import TemplateBox from '../../../../components/TemplateBox';
import { BRANDS } from '../../../../consts/content/Home';

import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import SampleWorkCard from './SampleWorkCard';
import useFeatureFlags from '../../../../hooks/auth/featureFlags/useFeatureFlags';
import TemplateText from '../../../../components/TemplateText';
import { BLACK } from '../../../../theme/Colors';

const getIconByType = (type) => {
    if (type === 'videoLessons') {
        return 'videocam-outline';
    } if (type === 'photoEditing') {
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

    return (
        <TemplateBox flex mt={WRAPPER_MARGIN * 2}>
            <TemplateBox ml={WRAPPER_MARGIN} mb={10}>
                <TemplateText bold color={BLACK} size={18}>My Work Examples</TemplateText>
            </TemplateBox>

            <TemplateCarousel
                data={filteredFeed}
                renderItem={({ item }) => (
                    <SampleWorkCard
                        image={{ uri: item?.thumbnail }}
                        title={item?.title}
                        shortDescription={item?.description}
                        style={styles.card}
                        onPress={() => ''}
                        icon={getIconByType(item?.type)}
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
