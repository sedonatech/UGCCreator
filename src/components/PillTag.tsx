/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, TextProps } from 'react-native';
import React, { PropsWithChildren } from 'react';
import TemplateBox from './TemplateBox';
import { hp, wp } from '../Utils/getResponsiveSize';
import {
    BORDER_XSMALL, BORDER_XXSMALL, IS_ANDROID, RADIUS_LARGE, RADIUS_SMALL, SPACE_MEDIUM, SPACE_SMALL, SPACE_XSMALL
} from '../theme/Layout';
import {
    ACCENT, BLACK, BLACK_SECONDARY, BRAND_BLUE, GREY, PRIMARY, PRIMARY_GRADIENT, SECONDARY_GRADIENT, TRANSPARENT, WHITE
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

    fadeInDelay?: number
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
    fadeInDelay
}) => (
    <TemplateBox
        row
        center
        ph={wp(SPACE_MEDIUM)}
        mh={!noMargin && wp(SPACE_SMALL)}
        pr={showClose && wp(SPACE_XSMALL)}
        pt={IS_ANDROID && hp(1)}
        minWidth={wp(30)}
        onPress={onPress}
        height={grey ? hp(22) : hp(26)}
        borderRadius={hp(RADIUS_SMALL)}
        borderWidth={(primaryTransparent || whiteTransparent) && BORDER_XXSMALL}
        backgroundColor={((primaryTransparent || whiteTransparent) ? TRANSPARENT : BLACK_SECONDARY)
      || (grey && GREY)
      || (secondary && SECONDARY_GRADIENT) as any}
        borderColor={(primaryTransparent && BRAND_BLUE) || (whiteTransparent && WHITE)}
        style={styles.container}
        fadeIn={fadeInDelay !== undefined}
        fadeInDelay={fadeInDelay}
    >
        <TemplateText
            color={(primaryTransparent && BLACK) || (grey && PRIMARY) || WHITE}
            semiBold
            size={hp(12)}
        >
            {children}
        </TemplateText>
        {!!showClose && (
            <TemplateIcon
                name="close"
                size={hp(12)}
                family="Ionicons"
                color={primaryTransparent ? BLACK : WHITE}
                style={styles.closeIcon}
            />
        )}
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
        alignSelf: 'baseline',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(SPACE_SMALL),
    },
    closeIcon: {
        marginLeft: wp(SPACE_XSMALL),
    }
});
