import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { RADIUS_SMALL, SCREEN_WIDTH } from '../../../../theme/Layout';
import {
    BLACK, WHITE, BLACK_30,
} from '../../../../theme/Colors';
import BackgroundImage from '../../../../components/BackgroundImage';
import TemplateText from '../../../../components/TemplateText';
import TemplateTouchable from '../../../../components/TemplateTouchable';
import TemplateBox from '../../../../components/TemplateBox';

interface Props {
    image?: string | number;
    title?: string;
    shortDescription?: string;
    style?: any;
}

const BrandsCard: FC<Props> = ({
    image, style, shortDescription, title,
}) => (
    <TemplateBox
        fullGradient
        alignItems="center"
        justifyContent="center"
        gradientColors={[BLACK_30, BLACK_30]}
        borderRadius={RADIUS_SMALL}
        width={SCREEN_WIDTH / 1.6}
        aspectRatio={1.5}
        style={style}
    >
        <BackgroundImage source={image} style={styles.image} width={SCREEN_WIDTH / 1.6} />
        <TemplateBox pAll={20}>
            {/* @ts-ignore */}
            <TemplateText color={WHITE} bold size={18} style={styles.text}>
                {title}
            </TemplateText>
            {/* @ts-ignore */}
            <TemplateText color={WHITE} size={14} style={styles.text}>
                {shortDescription}
            </TemplateText>
            {/* @ts-ignore */}
            <TemplateTouchable style={styles.viewOffersButton}>
                <TemplateText color={WHITE} bold size={14}>
                    View Offers
                </TemplateText>
            </TemplateTouchable>
        </TemplateBox>
    </TemplateBox>
);

const styles = StyleSheet.create({
    image: {
        borderRadius: 10,
        zIndex: -1,
    },
    viewOffersButton: {
        backgroundColor: BLACK,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginTop: 10,
    },
    text: {
        marginBottom: 5,
    },
});

export default BrandsCard;
