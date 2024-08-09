/* eslint-disable max-len */
/* eslint-disable react-native/no-inline-styles */
import React, { FC, memo, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PRIMARY, PRIMARY_GRADIENT } from '../theme/Colors';
import { SHADOW } from '../theme/Shadow';
import { isAndroid } from '../Utils/Platform';
import TemplateTouchable from './TemplateTouchable';
import { wp } from '../Utils/getResponsiveSize';

export interface Props {
    animated?:boolean,
    shadow?:boolean,
    lightShadow?:boolean,
    darkShadow?:boolean,
    children?:React.ReactNode,
    center?:boolean,
    vCenter?:boolean,
    hCenter?:boolean,
    selfCenter?:boolean,
    spaceBetween?:boolean,
    flex?:boolean | number,
    flexGrow?:boolean | number,
    flexWrap?: string,
    row?:boolean,
    mAll?:number | null,
    mt?:number | false,
    mb?:number | false,
    mh?:number | false,
    mv?:number | false,
    ml?:number | false,
    mr?:number | false,
    pAll?:number | false,
    pv?:number | false,
    ph?:number | false,
    pl?:number | false,
    pt?:number | false,
    pr?:number | false,
    pb?:number | false,
    width?:number | string | false,
    minWidth?:number | string | false,
    height?:number | string | false,
    minHeight?:number | string | false,
    borderRadius?:number,
    borderBottomLeftRadius?:number,
    borderBottomRightRadius?:number,
    borderTopLeftRadius?:number | false,
    borderTopRightRadius?:number | false,
    justifyContent?:string | false,
    alignItems?:string | false,
    backgroundColor?:string | false,
    aspectRatio?:number,
    borderWidth?:number | false,
    borderColor?:string | false,
    absolute?:boolean,
    top?:number | string,
    bottom?:number | string,
    left?:number | string,
    right?:number | string,
    opacity?:number,
    zIndex?:number,
    style?:object,
    onPress?:(() => void) | null,
    activeOpacity?:number,
    hGradient?:boolean,
    fullGradient?:boolean,
    vGradient?:boolean,
    gradientColors?:string[],
    gradientStartBalance?:number,
    gradientEndBalance?:number,
    disabled?:boolean,
    overflow?:string,
    position?:string
    fadeIn?: boolean,
    fadeInTime?: number,
    fadeInDelay?: number
    slideIn?: boolean
    slideInTime?: number,
    slideInDelay?: number
    slideInDirection?: 'left' | 'right' | 'top' | 'bottom'
    animationType?: 'spring' | 'timing',
    slideInX?: number
}
const TemplateBox: FC<Props> = ({
    animated,
    shadow,
    lightShadow,
    darkShadow,
    children,
    center,
    vCenter,
    hCenter,
    selfCenter,
    spaceBetween,
    flex,
    flexGrow,
    flexWrap,
    row,
    mAll,
    mt,
    mb,
    mh,
    mv,
    ml,
    mr,
    pAll,
    pv,
    ph,
    pl,
    pt,
    pr,
    pb,
    width,
    minWidth,
    height,
    minHeight,
    borderRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    justifyContent,
    alignItems,
    backgroundColor,
    aspectRatio,
    borderWidth,
    borderColor,
    absolute,
    top,
    bottom,
    left,
    right,
    opacity,
    zIndex,
    style,
    onPress,
    activeOpacity,
    hGradient,
    vGradient,
    fullGradient,
    gradientColors,
    gradientStartBalance,
    gradientEndBalance,
    disabled,
    overflow,
    fadeIn,
    fadeInTime,
    fadeInDelay,
    slideIn,
    slideInTime,
    slideInDelay,
    slideInDirection = 'right',
    animationType = 'timing',
    slideInX = 0,
    ...restProps
}) => {
    // eslint-disable-next-line no-nested-ternary
    // const Component: any = onPress ? TemplateTouchable : View;

    const Component = onPress
        ? (animated || fadeIn ? (Animated.createAnimatedComponent(TouchableOpacity)) : TouchableOpacity)
        : (animated || fadeIn ? Animated.View : View) as React.ElementType;

    const fadeOpacity = useRef(new Animated.Value(0)).current;
    const slideValue = useRef(new Animated.ValueXY({ x: slideIn ? wp(slideInX) : 0, y: 0 })).current;

    useEffect(() => {
        if (fadeIn) {
            setTimeout(() => {
                Animated.timing(fadeOpacity, {
                    toValue: (opacity || opacity === 0) ? opacity : 1,
                    duration: ((fadeInTime || fadeInTime === 0) && fadeInTime) || 750,
                    useNativeDriver: true
                }).start();
            }, fadeInDelay || 0);
        }
    }, [opacity]);

    useEffect(() => {
        if (slideIn && !!slideInX) {
            setTimeout(() => {
                Animated.timing(slideValue, {
                    toValue: { x: 0, y: 0 },
                    duration: ((slideInTime || slideInTime === 0) && slideInTime) || 500,
                    useNativeDriver: true
                }).start();
            }, slideInDelay || 0);
        }
    }, []);

    return (
        <Component
            style={[
                !!flex && { flex: flex === true ? 1 : flex },
                !!flexGrow && { flexGrow: flexGrow === true ? 1 : flexGrow },
                !!slideIn && { transform: [{ translateX: slideValue.x }, { translateY: slideValue.y }] },
                !!flexWrap && { flexWrap },
                center && styles.center,
                hCenter && styles.hCenter,
                vCenter && styles.vCenter,
                selfCenter && styles.selfCenter,
                spaceBetween && styles.spaceBetween,
                row && styles.row,
                !!mAll && { margin: mAll },
                !!mt && { marginTop: mt },
                !!mb && { marginBottom: mb },
                !!ml && { marginLeft: ml },
                !!mr && { marginRight: mr },
                !!mh && { marginHorizontal: mh },
                !!mv && { marginVertical: mv },
                !!width && { width },
                !!minWidth && { minWidth },
                !!height && { height },
                !!minHeight && { minHeight },
                !!pAll && { padding: pAll },
                !!ph && { paddingHorizontal: ph },
                !!pv && { paddingVertical: pv },
                !!pl && { paddingLeft: pl },
                !!pt && { paddingTop: pt },
                !!pr && { paddingRight: pr },
                !!pb && { paddingBottom: pb },
                !!justifyContent && { justifyContent },
                !!alignItems && { alignItems },
                !!backgroundColor && { backgroundColor },
                !!aspectRatio && { aspectRatio },
                !!overflow && { overflow },
                !!borderWidth && { borderWidth },
                !!borderColor && { borderColor },
                !!borderRadius && { borderRadius },
                !!borderBottomLeftRadius && { borderBottomLeftRadius },
                !!borderBottomRightRadius && { borderBottomRightRadius },
                !!borderTopLeftRadius && { borderTopLeftRadius },
                !!borderTopRightRadius && { borderTopRightRadius },
                !fadeIn && (!!opacity || opacity === 0) && { opacity },
                (!!fadeIn && { opacity: fadeOpacity }),
                (!!zIndex || zIndex === 0) && { zIndex },
                !!absolute && { position: 'absolute' },
                (!!top || top === 0) && { top },
                (!!bottom || bottom === 0) && { bottom },
                (!!left || left === 0) && { left },
                (!!right || right === 0) && { right },
                !!disabled && { opacity: 0.5 },
                isAndroid
        && (shadow || lightShadow)
        && !animated
        && SHADOW('default', backgroundColor, {}),
                style,
            ]}
            onPress={onPress}
            activeOpacity={activeOpacity || 1}
            disabled={disabled}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...restProps}
        >
            {!isAndroid && shadow && (
                <View
                    style={[
                        styles.overlay,
                        SHADOW('default', backgroundColor, {}),
                        !!borderRadius && { borderRadius },
                        !!borderBottomLeftRadius && { borderBottomLeftRadius },
                        !!borderBottomRightRadius && { borderBottomRightRadius },
                        !!borderTopLeftRadius && { borderTopLeftRadius },
                        !!borderTopRightRadius && { borderTopRightRadius },
                    ]}
                />
            )}
            {!isAndroid && shadow && (
                <View
                    style={[
                        styles.overlay,
                        SHADOW('default', backgroundColor, {}),
                        !!borderRadius && { borderRadius },
                        !!borderBottomLeftRadius && { borderBottomLeftRadius },
                        !!borderBottomRightRadius && { borderBottomRightRadius },
                        !!borderTopLeftRadius && { borderTopLeftRadius },
                        !!borderTopRightRadius && { borderTopRightRadius },
                    ]}
                />
            )}
            {(hGradient || vGradient) && (
                <LinearGradient
                    start={{ x: gradientStartBalance || 0, y: gradientStartBalance || 0 }}
                    end={
                        hGradient
                            ? { x: gradientEndBalance || 1, y: 0 }
                            : { x: 0, y: gradientEndBalance || 1 }
                    }
                    style={[
                        styles.overlay,
                        !!borderRadius && { borderRadius },
                        !!borderBottomLeftRadius && { borderBottomLeftRadius },
                        !!borderBottomRightRadius && { borderBottomRightRadius },
                        !!borderTopLeftRadius && { borderTopLeftRadius },
                        !!borderTopRightRadius && { borderTopRightRadius },
                    ]}
                    colors={gradientColors || PRIMARY_GRADIENT}
                />
            )}

            {fullGradient && (
                <LinearGradient
                    style={[
                        styles.overlay,
                        !!borderRadius && { borderRadius },
                        !!borderBottomLeftRadius && { borderBottomLeftRadius },
                        !!borderBottomRightRadius && { borderBottomRightRadius },
                        !!borderTopLeftRadius && { borderTopLeftRadius },
                        !!borderTopRightRadius && { borderTopRightRadius },
                    ]}
                    colors={gradientColors || PRIMARY_GRADIENT}
                />
            )}
            {children}
        </Component>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    center: { justifyContent: 'center', alignItems: 'center' },
    hCenter: { justifyContent: 'center' },
    vCenter: { alignItems: 'center' },
    selfCenter: { alignSelf: 'center' },
    spaceBetween: { justifyContent: 'space-between' },
    row: { flexDirection: 'row' },
});

TemplateBox.defaultProps = {
    children: null,
    style: {},
    flex: false,
    flexGrow: false,
    flexWrap: 'nowrap',
    center: false,
    hCenter: false,
    vCenter: false,
    selfCenter: false,
    spaceBetween: false,
    row: false,
    mAll: 0,
    mt: 0,
    mb: 0,
    ml: 0,
    mr: 0,
    mh: 0,
    mv: 0,
    width: 0,
    minWidth: 0,
    height: 0,
    minHeight: 0,
    pAll: 0,
    ph: 0,
    pv: 0,
    pl: 0,
    pt: 0,
    pr: 0,
    pb: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    aspectRatio: 0,
    overflow: 'visible',
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadow: false,
    lightShadow: false,
    hGradient: false,
    vGradient: false,
    gradientColors: PRIMARY_GRADIENT,
    gradientStartBalance: 0,
    gradientEndBalance: 1,
    animated: false,
    onPress: () => {},
    activeOpacity: 1,
    disabled: false,
    zIndex: 0,
    absolute: false,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    fadeIn: false,
    fadeInTime: 500,
    fadeInDelay: 0,
    slideIn: false,
    slideInTime: 500,
    slideInDelay: 0,
    opacity: 1,
};
export default memo(TemplateBox);
