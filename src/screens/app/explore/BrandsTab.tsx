import React from 'react';
import { StyleSheet } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import { BRANDS } from '../../../consts/content/Home';
import BrandsCard from '../home/components /BrandsCard';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../../theme/Layout';

const BrandsTab = () => (
    <TemplateBox>
        {BRANDS.map((brand) => (
            <BrandsCard
                image={brand?.image}
                title={brand?.name}
                shortDescription={brand?.shortDescription}
                style={styles.card}
                cardWidth={SCREEN_WIDTH / 1.16}
                aspectRatio={1.8}
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
