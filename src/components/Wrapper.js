import React, { forwardRef } from 'react';
import {
    StyleSheet, ScrollView, View, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import TemplateTouchable from './TemplateTouchable';
import Shadow from '../theme/Shadow';
import comingSoonAlert from '../Utils/ComingSoonAlert';
import TemplateIcon from './TemplateIcon';
import {
    RADIUS_LARGE,
    SCREEN_HEIGHT,
    WRAPPER_MARGIN,
    SCREEN_WIDTH,
} from '../theme/Layout';
import { WHITE } from '../theme/Colors';

export const ScrollKeyboardContainer = forwardRef(
    (
        {
            keyboard,
            scroll,
            children,
            contentContainerStyle,
            extraHeight,
            ...restProps
        },
        ref,
    ) => {
        if (!keyboard && !scroll) {
            return children;
        }
        if (keyboard) {
            return (
                <KeyboardAwareScrollView
                    contentContainerStyle={[
                        styles.contentContainer,
                        contentContainerStyle,
                    ]}
                    enableOnAndroid
                    extraHeight={extraHeight}
                    scrollIndicatorInsets={styles.scrollIndicatorInsets}
                    ref={ref}
                    {...restProps}
                >
                    {children}
                </KeyboardAwareScrollView>
            );
        }
        return (
            <ScrollView
                contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
                scrollIndicatorInsets={styles.scrollIndicatorInsets}
                ref={ref}
                {...restProps}
            >
                {children}
            </ScrollView>
        );
    },
);

ScrollKeyboardContainer.propTypes = {
    keyboard: PropTypes.bool,
    scroll: PropTypes.bool,
    children: PropTypes.node.isRequired,
    extraHeight: PropTypes.number,
    contentContainerStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};

ScrollKeyboardContainer.defaultProps = {
    keyboard: false,
    scroll: false,
    extraHeight: 0,
    contentContainerStyle: null,
};

export const BottomWrapper = ({
    children,
    style,
    restProps,
    background,
    expandable,
    radius,
}) => (
    <View
        style={[
            styles.bottomWrapper,
            {
                borderTopLeftRadius: radius,
                borderTopRightRadius: radius,
            },
            style,
        ]}
        {...restProps}
    >
        {!!expandable && (
            <TemplateTouchable
                style={[Shadow.card, styles.toggleButton]}
                onPress={comingSoonAlert}
            >
                <TemplateIcon name="Arrow-Down" color={background} />
            </TemplateTouchable>
        )}
        {children}
    </View>
);

BottomWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    background: PropTypes.string,
    expandable: PropTypes.bool,
    extraHeight: PropTypes.number,
    radius: PropTypes.number,
};

BottomWrapper.defaultProps = {
    style: null,
    restProps: null,
    background: null,
    expandable: false,
    extraHeight: 20,
    radius: RADIUS_LARGE,
};

const Wrapper = forwardRef(
    (
        {
            children,
            style,
            outerStyle,
            background,
            keyboard,
            extraHeight,
            scroll,
            contentContainerStyle,
            loading,
            safe,
            ...restProps
        },
        ref,
    ) => {
        const content = loading ? (
            <ActivityIndicator style={styles.activityIndicator} size="large" />
        ) : (
            children
        );
        const Inner = safe ? SafeAreaView : View;
        return (
            <View style={styles.container}>
                <View style={[styles.backgroundColor, { backgroundColor: background }]} />
                <ScrollKeyboardContainer
                    keyboard={keyboard}
                    scroll={!loading && scroll}
                    ref={ref}
                    endFillColor={WHITE}
                    extraHeight={extraHeight}
                    style={[styles.container, outerStyle]}
                    contentContainerStyle={[
                        { backgroundColor: background },
                        contentContainerStyle,
                    ]}
                    {...restProps}
                >
                    <Inner style={[styles.safeArea, loading && styles.loading, style]}>
                        {content}
                    </Inner>
                </ScrollKeyboardContainer>
            </View>
        );
    },
);

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.shape({}),
    outerStyle: PropTypes.shape({}),
    contentContainerStyle: PropTypes.shape({}),
    keyboard: PropTypes.bool,
    scroll: PropTypes.bool,
    loading: PropTypes.bool,
    safe: PropTypes.bool,
    extraHeight: PropTypes.number,
    background: PropTypes.string,
};

Wrapper.defaultProps = {
    style: null,
    outerStyle: null,
    keyboard: false,
    scroll: true,
    contentContainerStyle: null,
    loading: false,
    safe: true,
    extraHeight: 20,
    background: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundColor: {
        height: SCREEN_HEIGHT * 0.3,
        position: 'absolute',
        top: 0,
        width: SCREEN_WIDTH,
    },
    scrollIndicatorInsets: {
        right: 1,
    },
    loading: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIndicator: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: 'column',
    },
    safeArea: {
        marginHorizontal: WRAPPER_MARGIN,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -24,
        left: SCREEN_WIDTH / 2 - 24,
    },
    bottomWrapper: {
        width: '100%',
        backgroundColor: WHITE,
        paddingTop: 50,
        marginTop: 34,
    },
});

export default Wrapper;
