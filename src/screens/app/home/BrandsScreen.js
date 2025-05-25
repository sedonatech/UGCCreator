import React, {
    useEffect, useMemo, useState,
} from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Fuse from 'fuse.js';
import firestore from '@react-native-firebase/firestore';
import {
    HEADER_MARGIN, IS_ANDROID, SCREEN_WIDTH, WRAPPER_MARGIN,
} from '../../../theme/Layout';
import { BLACK, TRANSPARENT, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateTextInput from '../../../components/TemplateTextInput';
import { SHADOW } from '../../../theme/Shadow';
import BrandsCard from './components /BrandsCard';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../../consts/content/Portfolio';
import { BRAND_DETAILS } from '../../../navigation/ScreenNames';

const USERS_COLLECTION = 'users';

const BrandsScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');

    const [searchResults, setSearchResults] = useState([]);

    const [brandsData, setBrandsData] = useState([]);

    const [limit, setLimit] = useState(40);

    const brandsRef = firestore().collection(USERS_COLLECTION)
        .where('type', '==', 'brand')
        .limit(limit);
    const fetchBrands = async () => {
        try {
            const fetchedBrands = await brandsRef
                .get()
                .then((querySnapshot) => querySnapshot?.docs
                    ?.map((doc) => doc?.data()));
            const filtered = (fetchedBrands || [])?.filter((brand) => !brand?.isBlocked);
            if (filtered?.length < 1) setLimit(limit + 20);
            setBrandsData(filtered);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchBrands();
    },
    [limit]);

    const options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            'name',
            'title',
            'shortDescription',
        ],
    };

    useEffect(() => {
        if (!!search && brandsData?.length) {
            const fuse = new Fuse(brandsData, options);
            const results = fuse.search(search).map(({ item }) => item);
            setSearchResults(results);
        }
    }, [search, brandsData]);

    const filteredBrands = useMemo(() => {
        if (!brandsData) return [];

        return search?.length ? searchResults : brandsData;
    }, [search, brandsData]);

    return (

        <FlatList
            data={filteredBrands}
            keyExtractor={(item, index) => (`${item?.id}-${index}`)}
            renderItem={({ item }) => (
                <BrandsCard
                    image={{ uri: item?.image || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE }}
                    title={item?.name}
                    shortDescription={item?.shortDescription}
                    style={styles.card}
                    cardWidth={SCREEN_WIDTH - 2 * WRAPPER_MARGIN}
                    aspectRatio={1.8}
                    titleSize={16}
                    descriptionLines={2}
                    descriptionSize={12}
                    // @ts-ignore
                    onPress={() => navigation.navigate(BRAND_DETAILS, { brandId: item?.id })}
                    // lastLoginTime={item?.lastLoginTime}
                />
            )}
            ListHeaderComponent={() => (
                <TemplateBox>
                    <TemplateBox
                        ml={WRAPPER_MARGIN}
                        mt={HEADER_MARGIN}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <TemplateText size={18} bold startCase center>Explore Brands and Projects</TemplateText>
                    </TemplateBox>

                    <TemplateBox row alignItems="center" mh={WRAPPER_MARGIN} mv={WRAPPER_MARGIN}>
                        <TemplateTextInput
                            placeholder="Search"
                            style={[styles.input, SHADOW('default', WHITE)]}
                            value={search}
                            onChangeText={(text) => setSearch(text)}
                            autoCapitalize="none"
                        />
                    </TemplateBox>
                </TemplateBox>
            )}
            showsVerticalScrollIndicator={false}
            style={styles.container}
            alwaysBounceVertical={false}
            contentContainerStyle={styles.contentContainer}
            initialNumToRender={10}
            onEndReachedThreshold={0.5}
            onEndReached={() => { setLimit((prevLimit) => prevLimit + 10); }}
            removeClippedSubviews
        />

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    contentContainer: {
        alignItems: 'center',

    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingRight: 30,
        paddingLeft: 10,
        fontSize: 16,
        color: BLACK,
    },
    card: {
        marginBottom: WRAPPER_MARGIN,
        alignSelf: 'center',
    },
});

export default BrandsScreen;
