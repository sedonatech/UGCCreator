import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import { BLACK, IOS_BLUE } from '../../../../theme/Colors';
import BrandsCard from './BrandsCard';
import TemplateCarousel from '../../../../components/carousels/TemplateCarousel';
import TemplateBox from '../../../../components/TemplateBox';
import {
    BRAND_DETAILS, BRANDS_SCREEN,
} from '../../../../navigation/ScreenNames';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../../../consts/content/Portfolio';

const USERS_COLLECTION = 'users';
const BrandsCarousel = ({ style }) => {
    const navigation = useNavigation();

    const [brands, setBrands] = useState([]);

    const brandsRef = firestore().collection(USERS_COLLECTION)
        .where('image', '>', '')
        .where('type', '==', 'brand')
        .limit(20);
    const fetchBrands = async () => {
        try {
            const fetchedBrands = await brandsRef
                .get()
                .then((querySnapshot) => querySnapshot?.docs
                    ?.map((doc) => doc?.data()));

            const filteredBrands = orderBy(fetchedBrands?.filter((brand) => !!brand?.lastLoginTime), 'lastLoginTime', 'desc');
            const filteredBrands2 = fetchedBrands?.filter((brand) => !brand?.lastLoginTime);
            const mergedBrands = [...filteredBrands, ...filteredBrands2]?.slice(0, 7);
            setBrands(mergedBrands);
        } catch (e) {
            console.log(e);
        }
    };

    const brandsData = useMemo(() => {
        if (!brands?.length) {
            return [];
        }
        return brands?.map((brand) => ({
            id: brand?.id,
            name: brand?.name,
            image: brand?.image,
            shortDescription: brand?.shortDescription,
            lastLoginTime: brand?.lastLoginTime,
        }));
    }, [brands]);

    useEffect(() => {
        fetchBrands();
    },
    []);

    return (
        <TemplateBox style={style}>
            <TemplateBox row alignItems="center" ph={WRAPPER_MARGIN} mb={16}>
                <TemplateText size={18} bold>Brands on our Platform</TemplateText>
                <TemplateBox flex />
                <TemplateTouchable
                    onPress={() => navigation.navigate(BRANDS_SCREEN)}
                >
                    <TemplateText startCase size={14} underLine color={IOS_BLUE}>
                        See All
                    </TemplateText>
                </TemplateTouchable>
            </TemplateBox>

            <TemplateText size={13} color={BLACK} style={styles.subtitle}>
                Check out the brands currently on our platform
            </TemplateText>
            <TemplateCarousel
                data={brandsData?.sort((a, b) => {
                    const imageA = a?.image ?? '';
                    const imageB = b?.image ?? '';
                    return imageB.localeCompare(imageA);
                })}
                renderItem={({ item }) => (
                    <BrandsCard
                        image={{ uri: item?.image || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE }}
                        title={item?.name}
                        shortDescription={item?.shortDescription}
                        style={styles.card}
                        onPress={() => navigation.navigate(BRAND_DETAILS, { brandId: item?.id })}
                        lastLoginTime={item?.lastLoginTime}
                    />
                )}
                contentContainerStyle={styles.cardCarousel}
                snapToInterval={(SCREEN_WIDTH / 1.6) + 20}
            />
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    cardCarousel: {
        paddingHorizontal: WRAPPER_MARGIN,
    },
    card: {
        marginRight: WRAPPER_MARGIN,
        marginBottom: 10,
    },
    subtitle: {
        marginLeft: WRAPPER_MARGIN,
        marginBottom: 10,
    },
});

BrandsCarousel.propTypes = {
    style: PropTypes.shape({}),
};

BrandsCarousel.defaultProps = {
    style: {},
};
export default BrandsCarousel;
