import React, { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import firestore from '@react-native-firebase/firestore';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { CREATORS_PROFILES, CREATORS_PROFILES_STACK, PROFILE } from '../../../../navigation/ScreenNames';
import { BLACK, BLUE, IOS_BLUE } from '../../../../theme/Colors';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import CreatorCard from '../../creators/CreatorCard';
import TemplateBox from '../../../../components/TemplateBox';
import { DEFAULT_CREATOR_SHORT_DESCRIPTION } from '../../../../consts/content/Portfolio';
import { wp } from '../../../../Utils/getResponsiveSize';
import calculateLastLoginTime from '../../../../Utils/calculateLastLoginTime';

const SAMPLE_SIZE = 5;
const USERS_COLLECTION = 'users';
const FeaturedCreatorsCarousel = ({ style, creator }) => {
    const navigation = useNavigation();
    const [creatorsData, setCreators] = useState([]);
    const creatorsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'creator')
        .where('portfolioLink', '!=', '')
        .limit(20);

    useEffect(() => {
        getCreators();
    }, []);

    const getCreators = async () => {
        const querySnapshot = await creatorsRef.get();
        const data = querySnapshot?.docs
            ?.map((doc) => ({
                id: doc?.id,
                ...doc?.data(),
                lastLoginTime: doc?.lastLoginTime ? calculateLastLoginTime(doc?.lastLoginTime) : 'days ago',
            }));
        setCreators(data);
    };

    const creatorsDataSample = useMemo(()=> creatorsData?.sort(() => 0.5 - Math.random()).slice(0, SAMPLE_SIZE) ,[creatorsData, SAMPLE_SIZE])

    return creatorsDataSample?.length ? (
        <View style={style}>
            <View style={styles.titleContainer}>
                <TemplateBox row justifyContent="space-between">
                    <TemplateText bold size={18} color={BLACK}>
                        Featured Creators
                    </TemplateText>
                    <TemplateBox />
                    <TemplateTouchable
                        onPress={() => navigation.navigate(creator ? CREATORS_PROFILES_STACK : CREATORS_PROFILES)}
                    >
                        <TemplateText startCase size={14} underLine color={BLUE}>
                            See All
                        </TemplateText>
                    </TemplateTouchable>

                </TemplateBox>

                <TemplateBox height={10} />
                <TemplateText size={14} color={BLACK}>
                    {creator ? `Collaborate with other creators` : `Based on your recent searches`}
                </TemplateText>
            </View>

            <TemplateCarousel
                data={creatorsDataSample}
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
                        onPress={() => {
                            if(creator) return navigation.navigate(CREATORS_PROFILES_STACK, {
                                screen: PROFILE,
                                params:{
                                    creatorId: item?.id,
                                }
                            })
                            return navigation.navigate(PROFILE, {
                                creatorId: item?.id,
                            })
                        }}
                        lastLoginTime={item?.lastLoginTime}
                        mt={12}
                    />
                )}
                snapToInterval={SCREEN_WIDTH - (WRAPPER_MARGIN * 4.6) + 20}
                showPagination
                paginationSize={creatorsDataSample?.length}
                contentContainerStyle={styles.cardCarousel}
            />
        </View>
    ) : (
        <ActivityIndicator color={IOS_BLUE} size="large" />
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
        width: wp(80),
        height: wp(80),
        borderRadius: wp(16),
        marginRight: wp(14),
    },
});
export default FeaturedCreatorsCarousel;
