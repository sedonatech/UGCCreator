import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import TemplateBox from '../../../../components/TemplateBox';
import BrandsCard from '../../home/components /BrandsCard';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import { BRAND_DETAILS } from '../../../../navigation/ScreenNames';
import { DEFAULT_CREATOR_WORK_SAMPLE_IMAGE } from '../../../../consts/content/Portfolio';

interface Props {
    id?: string;
    name?: string
    image?: string;
    shortDescription?: string;
    lastLoginTime?: string;
}

const BrandsTab = ({ data }: { data: Array<Props> }) => {
    const navigation = useNavigation();

    return (
        <TemplateBox ph={WRAPPER_MARGIN}>
            <FlatList
                data={data}
                keyExtractor={(item) => item?.id}
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
                        lastLoginTime={item?.lastLoginTime}
                    />
                )}
            />
        </TemplateBox>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: WRAPPER_MARGIN,
        alignSelf: 'center',
    },
});

export default BrandsTab;
