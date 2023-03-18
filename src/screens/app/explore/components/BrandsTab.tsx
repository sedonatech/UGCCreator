import React from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import TemplateBox from '../../../../components/TemplateBox';
import BrandsCard from '../../home/components /BrandsCard';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../../theme/Layout';
import { BRAND_DETAILS } from '../../../../navigation/ScreenNames';

const BrandsTab = (data: { data: any[]; }) => {
    const navigation = useNavigation();

    return (
        <TemplateBox>
            {!!data?.data?.length && data?.data?.map((brand: any, index) => (
                <BrandsCard
                    key={brand?.id}
                    image={{ uri: brand?.image }}
                    title={brand?.name}
                    shortDescription={brand?.shortDescription}
                    style={styles.card}
                    cardWidth={SCREEN_WIDTH / 1.12}
                    aspectRatio={1.8}
                    slideInDelay={(index + 1) * 100}
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
    }
});

export default BrandsTab;
