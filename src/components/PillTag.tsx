/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, TextProps } from 'react-native';
import React, { PropsWithChildren } from 'react';
import TemplateBox from './TemplateBox';
import { hp, wp } from '../Utils/getResponsiveSize';
import {
    BORDER_XSMALL, IS_ANDROID, RADIUS_LARGE, SPACE_MEDIUM, SPACE_XSMALL
} from '../theme/Layout';
import {
    ACCENT, BLACK, GREY, PRIMARY, PRIMARY_GRADIENT, SECONDARY_GRADIENT, WHITE
} from '../theme/Colors';
import TemplateText from './TemplateText';
import TemplateIcon from './TemplateIcon';

interface Props extends PropsWithChildren<TextProps> {
    primary?: boolean,
    secondary?: boolean,
    accent?: boolean,
    grey?: boolean,
    whiteTransparent?: boolean,
    primaryTransparent?: boolean,
    showClose?: boolean,
    noMargin?: boolean,
    onPress?: ()=>void,
    children: string
}

// @ts-ignore
const PillTag:React.FC<Props> = ({
    primary,
    secondary,
    accent,
    grey,
    whiteTransparent,
    primaryTransparent,
    showClose,
    noMargin,
    onPress,
    children,
}) => (
    <TemplateBox
        row
        center
        ph={wp(SPACE_MEDIUM)}
        mh={!noMargin && wp(SPACE_XSMALL)}
        pr={showClose && wp(SPACE_XSMALL)}
        pt={IS_ANDROID && hp(1)}
        minWidth={wp(30)}
        onPress={onPress}
        height={grey ? hp(22) : hp(26)}
        borderRadius={hp(RADIUS_LARGE)}
        borderWidth={(primaryTransparent || whiteTransparent) && BORDER_XSMALL}
        backgroundColor={(accent && ACCENT)
      || (grey && GREY)
      || (secondary && SECONDARY_GRADIENT) as any}
        borderColor={(primaryTransparent && PRIMARY) || (whiteTransparent && WHITE)}
        vGradient={primary || secondary}
        gradientColors={primary ? PRIMARY_GRADIENT : SECONDARY_GRADIENT}
        style={styles.container}
    >
        <TemplateText
            color={(primaryTransparent && BLACK) || (grey && PRIMARY) || WHITE}
            semiBold
            size={hp(12)}
        >
            {children}
        </TemplateText>
        {!!showClose && <TemplateIcon name="close" size={hp(18)} family="Ionicons" />}
    </TemplateBox>
);

export default PillTag;

PillTag.defaultProps = {
    primary: false,
    secondary: false,
    accent: false,
    grey: false,
    whiteTransparent: false,
    primaryTransparent: false,
    showClose: false,
    noMargin: false,
    onPress: () => {}
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'baseline'
    }
});
