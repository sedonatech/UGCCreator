import React from 'react';
import { StyleSheet } from 'react-native';

import TemplateBox from '../../../components/TemplateBox';
import BrandsCard from '../home/components /BrandsCard';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';

const BrandsTab = (data: { data: any[]; }) => (
    <TemplateBox>
        {!!data?.data?.length && data?.data?.map((brand: any, index) => (
            <BrandsCard
                key={brand?.id}
                image={brand?.image}
                title={brand?.name}
                shortDescription={brand?.shortDescription}
                style={styles.card}
                cardWidth={SCREEN_WIDTH / 1.12}
                aspectRatio={1.8}
                slideInDelay={(index + 1) * 100}
            />
        ))}
    </TemplateBox>
);

const styles = StyleSheet.create({
    card: {
        marginBottom: WRAPPER_MARGIN,
        alignSelf: 'center',
    }
});

export default BrandsTab;
