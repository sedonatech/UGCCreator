/* eslint-disable max-len */
/* eslint-disable react-native/no-inline-styles */
/* @ts-ignore */
import React, { FC } from 'react';
import { Text, StyleSheet } from 'react-native';

import { BLACK, PRIMARY, WHITE } from '../theme/Colors';
import { IS_SHORT_DEVICE } from '../theme/Layout';

interface Props {
    light?: boolean,
    medium?: boolean,
    bold?: boolean,
    black?: boolean,
    white?: boolean,
    title?: boolean,
    caps?: boolean,
    subTitle?: boolean,
    underLine?: boolean,
    small?: boolean,
    green?: boolean,
    semiBold?: boolean,
    center?: boolean,
    left?: boolean,
    right?: boolean,
    color?: string | null,
    size?: number | null,
    lineThrough?: boolean,
    numberOfLines?: number | null,
    startCase?: boolean,
    italic?: boolean,
    children?: string | React.ReactNode | null | (string | React.ReactNode | null)[]
    lineHeight?: number | null,
    style?: any,
    adjustsFontSizeToFit?: boolean,
    allowFontScaling?: boolean,
    ml?: number,
    mr?: number,
    mt?: number,
    mb?: number,
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
    ...restProps
}) => {
    const textStyle = {} as any;

    if (light) {
        textStyle.fontWeight = '400';
    }

    if (medium) {
        textStyle.fontWeight = '500';
    }

    if (bold) {
        textStyle.fontWeight = '700';
    }
    if (semiBold) {
        textStyle.fontWeight = '600';
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

    if(ml)textStyle.marginLeft = ml;
    if(mr)textStyle.marginRight = mr;
    if(mt)textStyle.marginTop = mt;
    if(mb)textStyle.marginBottom = mb;
    

    let content = children;

    if (startCase) {
        // @ts-ignore
        content = children?.replace(/-/g, ' ')?.toLowerCase()?.split(' ')?.map((word) => word?.charAt(0).toUpperCase() + word?.slice(1))?.join(' ');
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
        fontFamily: 'Montserrat',
        fontSize: IS_SHORT_DEVICE ? 15 : 18,
        color: BLACK,
    },
});

TemplateText.defaultProps = {
    light: true,
    medium: false,
    bold: false,
    black: false,
    white: false,
    title: false,
    caps: false,
    subTitle: false,
    underLine: false,
    small: false,
    green: false,
    semiBold: false,
    center: false,
    left: false,
    right: false,
    color: null,
    size: null,
    lineThrough: false,
    children: null,
    numberOfLines: 0,
    startCase: false,
    italic: false,
};

export default TemplateText;
