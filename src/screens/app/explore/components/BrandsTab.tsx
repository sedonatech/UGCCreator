import React from 'react';
import { StyleSheet } from 'react-native';

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
}

const BrandsTab = ({ data }: { data: Array<Props> }) => {
    const navigation = useNavigation();

    return (
        <TemplateBox ph={WRAPPER_MARGIN}>
            {!!data?.length && data?.sort((a,b) => a?.name.localeCompare(b?.name))?.map((brand: any, index) => (
                <BrandsCard
                    key={brand?.id}
                    image={{ uri: brand?.image || DEFAULT_CREATOR_WORK_SAMPLE_IMAGE }}
                    title={brand?.name}
                    shortDescription={brand?.shortDescription}
                    style={styles.card}
                    cardWidth={SCREEN_WIDTH - 2 * WRAPPER_MARGIN}
                    aspectRatio={1.8}
                    titleSize={16}
                    descriptionLines={2}
                    descriptionSize={12}
                    // @ts-ignore
                    onPress={() => navigation.navigate(BRAND_DETAILS, { brandId: brand?.id })}
                />
            ))}

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
