import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { sampleSize, sortBy } from 'lodash';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { CREATORS_PROFILES, PROFILE } from '../../../../navigation/ScreenNames';
import { BLACK, BLUE } from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import useGetCreators from '../../../../hooks/brands/useGetCreators';
import CreatorCard from '../../creators/CreatorCard';
import TemplateBox from '../../../../components/TemplateBox';
import { DEFAULT_CREATOR_SHORT_DESCRIPTION } from '../../../../consts/content/Portfolio';

const FeaturedCreatorsCarousel = ({ style }) => {
    const navigation = useNavigation();

    const { filteredCreators } = useGetCreators();

    const creatorsData = useMemo(() => {
        if (!filteredCreators?.length) return [];

        return filteredCreators?.map((creator) => ({
            ...creator,
            isActive: !!creator?.image,
        }));
    }, [filteredCreators]);

    return (
        <View style={style}>
            <View style={styles.titleContainer}>
                <TemplateBox row justifyContent="space-between">
                    <TemplateText bold size={18} color={BLACK}>
                        Featured Creators
                    </TemplateText>
                    <TemplateBox />
                    <TemplateTouchable
                        onPress={() => navigation.navigate(CREATORS_PROFILES)}
                    >
                        <TemplateText startCase size={14} underLine color={BLUE}>
                            See All
                        </TemplateText>
                    </TemplateTouchable>

                </TemplateBox>

                <TemplateBox height={10} />
                <TemplateText size={14} color={BLACK}>
                    Based on your recent searches
                </TemplateText>
            </View>

            <TemplateCarousel
                data={sampleSize(sortBy(creatorsData, 'isActive').reverse(), 6)}
                renderItem={({ item }) => (
                    <CreatorCard
                        name={item?.userName}
                        imageUrl={item?.image}
                        shortDescription={item?.shortDescription
                          || DEFAULT_CREATOR_SHORT_DESCRIPTION}
                        style={styles.card}
                        width={SCREEN_WIDTH - (WRAPPER_MARGIN * 4.6)}
                        imageStyle={styles.image}
                        subtitleContainerWidth={94}
                        buttonOffset={50}
                        textContainerWidth="68%"
                        location={item?.location?.city || item?.location?.country}
                        onPress={() => navigation.navigate(PROFILE, {
                            creatorId: item?.id,
                        })}
                        active={item?.isActive}
                    />
                )}
                snapToInterval={SCREEN_WIDTH - (WRAPPER_MARGIN * 4.6)}
                showPagination
                paginationSize={sampleSize(sortBy(creatorsData, 'isActive').reverse(), 6)?.length}
                contentContainerStyle={styles.cardCarousel}
            />
        </View>
    );
};

FeaturedCreatorsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

FeaturedCreatorsCarousel.defaultProps = {
    style: {},
};

const styles = StyleSheet.create({
    titleContainer: {
        paddingHorizontal: WRAPPER_MARGIN,
        marginTop: WRAPPER_MARGIN / 2,
    },
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    card: {
        marginRight: WRAPPER_MARGIN,
        marginBottom: 10,
    },
    image: {
        height: 60,
        width: 60,
        borderRadius: 10,
    },
});
export default FeaturedCreatorsCarousel;
