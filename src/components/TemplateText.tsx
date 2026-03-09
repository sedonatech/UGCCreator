/* eslint-disable max-len */
/* eslint-disable react-native/no-inline-styles */
/* @ts-ignore */
import React, { FC } from 'react';
import { Platform, Text, StyleSheet } from 'react-native';

import { BLACK, PRIMARY, WHITE } from '../theme/Colors';
import { IS_SHORT_DEVICE } from '../theme/Layout';

const isAndroid = Platform.OS === 'android';

const androidFontMap: Record<string, string> = {
    '400': 'Montserrat-Regular',
    '500': 'Montserrat-Medium',
    '600': 'Montserrat-SemiBold',
    '700': 'Montserrat-Bold',
};

interface Props {
    light?: boolean;
    medium?: boolean;
    bold?: boolean;
    black?: boolean;
    white?: boolean;
    title?: boolean;
    caps?: boolean;
    subTitle?: boolean;
    underLine?: boolean;
    small?: boolean;
    green?: boolean;
    semiBold?: boolean;
    center?: boolean;
    left?: boolean;
    right?: boolean;
    color?: string | null;
    size?: number | null;
    lineThrough?: boolean;
    numberOfLines?: number | null;
    startCase?: boolean;
    italic?: boolean;
    children?: string | React.ReactNode | null | (string | React.ReactNode | null)[];
    lineHeight?: number | null;
    style?: any;
    adjustsFontSizeToFit?: boolean;
    allowFontScaling?: boolean;
    ml?: number;
    mr?: number;
    mt?: number;
    mb?: number;
    mv?: number;
    mh?: number;
}
const TemplateText: FC<Props> = ({
    light,
    medium,
    bold,
    black,
    white,
    title,
    caps,
    subTitle,
    underLine,
    small,
    green,
    semiBold,
    center,
    left,
    right,
    color,
    size,
    lineThrough,
    children,
    numberOfLines,
    startCase,
    italic,
    lineHeight,
    adjustsFontSizeToFit,
    allowFontScaling,
    ml,
    mr,
    mt,
    mb,
    mv,
    mh,
    ...restProps
}) => {
    const textStyle = {} as any;

    if (light) {
        if (isAndroid) {
            textStyle.fontFamily = androidFontMap['400'];
        } else {
            textStyle.fontWeight = '400';
        }
    }

    if (medium) {
        if (isAndroid) {
            textStyle.fontFamily = androidFontMap['500'];
        } else {
            textStyle.fontWeight = '500';
        }
    }

    if (bold) {
        if (isAndroid) {
            textStyle.fontFamily = androidFontMap['700'];
        } else {
            textStyle.fontWeight = '700';
        }
    }
    if (semiBold) {
        if (isAndroid) {
            textStyle.fontFamily = androidFontMap['600'];
        } else {
            textStyle.fontWeight = '600';
        }
    }

    if (black) {
        textStyle.color = BLACK;
    }

    if (white) {
        textStyle.color = WHITE;
    }

    if (title) {
        textStyle.fontSize = 29;
    }

    if (caps) {
        textStyle.textTransform = 'uppercase';
    }
    if (subTitle) {
        textStyle.fontSize = 20;
    }
    if (underLine) {
        textStyle.textDecorationLine = 'underline';
    }

    if (small) {
        textStyle.fontSize = 14;
    }

    if (green) {
        textStyle.color = PRIMARY;
    }

    if (left) {
        textStyle.textAlign = 'left';
    }
    if (right) {
        textStyle.textAlign = 'right';
    }

    if (center) {
        textStyle.textAlign = 'center';
    }

    if (color) {
        textStyle.color = color;
    }

    if (italic) {
        textStyle.fontStyle = 'italic';
    }

    if (size) {
        textStyle.fontSize = size;
    }

    if (lineThrough) {
        textStyle.textDecorationLine = 'line-through';
        textStyle.textDecorationStyle = 'solid';
    }
    if (lineHeight) {
        textStyle.lineHeight = lineHeight;
    }

    if (ml) textStyle.marginLeft = ml;
    if (mr) textStyle.marginRight = mr;
    if (mt) textStyle.marginTop = mt;
    if (mb) textStyle.marginBottom = mb;
    if (mv) {
        textStyle.marginVertical = mv;
    }
    if (mh) {
        textStyle.marginHorizontal = mh;
    }

    let content = children;

    if (startCase && typeof children === 'string') {
        content = children
            .replace(/-/g, ' ')
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return (
        <Text
            {...restProps}
            // @ts-ignore
            style={[styles.default, restProps.style && restProps.style, textStyle]}
            // @ts-ignore
            numberOfLines={numberOfLines}
            allowFontScaling={
                // @ts-ignore
                numberOfLines === 1 ? true : restProps?.allowFontScaling
            }
            adjustsFontSizeToFit={
                // @ts-ignore
                numberOfLines === 1 ? true : restProps?.adjustsFontSizeToFit
            }
        >
            {content}
        </Text>
    );
};

const styles = StyleSheet.create({
    default: {
        fontFamily: isAndroid ? 'Montserrat-Regular' : 'ShreddyRegular',
        fontSize: IS_SHORT_DEVICE ? 15 : 18,
        color: BLACK,
    },
});

export default TemplateText;
