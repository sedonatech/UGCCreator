import React, {
    useEffect, useMemo, useState,
} from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Fuse from 'fuse.js';
import useGetBrands from '../../../hooks/creators/useGetBrands';
import { HEADER_MARGIN, IS_ANDROID, WRAPPER_MARGIN } from '../../../theme/Layout';
import { BLACK, TRANSPARENT, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import TemplateTextInput from '../../../components/TemplateTextInput';
import { SHADOW } from '../../../theme/Shadow';
import BrandsTab from '../explore/components/BrandsTab';

const BrandsScreen = () => {
    const [search, setSearch] = useState('');

    const [searchResults, setSearchResults] = useState([]);

    const { brands: brandsData } = useGetBrands();

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
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
        >
            <TemplateBox mt={HEADER_MARGIN} alignItems="center" justifyContent="center">
                <TemplateText size={18} bold startCase>Explore Brands and Projects</TemplateText>
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
            <BrandsTab data={filteredBrands} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
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
});

export default BrandsScreen;
