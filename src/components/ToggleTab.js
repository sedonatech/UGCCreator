import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { WRAPPED_SCREEN_WIDTH } from '../theme/Layout';
import TemplateTouchable from './TemplateTouchable';
import TemplateText from './TemplateText';
import { BLACK_10, BLACK_80, WHITE, WHITE_50 } from '../theme/Colors';

const ToggleTab = ({
    tabs,
    activeTab,
    onPress,
    backgroundColor = BLACK_10,
    activeBackgroundColor = WHITE_50,
    style,
    titleStyle,
    disabledTabs,
    activeTextColor,
}) => {
    const [translateValue] = useState(new Animated.Value(0));
    const tabWidth = (WRAPPED_SCREEN_WIDTH - 10) / tabs.length;
    const activeIndex = tabs?.indexOf(activeTab);

    const animateSlider = index => {
        Animated.spring(translateValue, {
            toValue: index * tabWidth,
            velocity: 10,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        animateSlider(activeIndex);
    }, [activeIndex, tabs]);

    return (
        <View style={[styles.container, { backgroundColor }, style]}>
            <Animated.View
                style={[
                    styles.slider,
                    {
                        transform: [{ translateX: translateValue }],
                        width: tabWidth,
                        backgroundColor: activeBackgroundColor,
                    },
                ]}
            />
            {!!tabs?.length &&
                tabs.map((tab, id) => (
                    <TemplateTouchable
                        key={id.toString()}
                        style={[
                            styles.tab,
                            disabledTabs && disabledTabs?.includes(tab) && { opacity: 0.5 },
                            { width: tabWidth },
                        ]}
                        onPress={() => onPress(tab)}
                        disabled={disabledTabs && disabledTabs?.includes(tab)}
                    >
                        <TemplateText
                            color={activeTab === tab ? activeTextColor : BLACK_80}
                            semiBold
                            bold={activeTab === tab}
                            numberOfLines={1}
                            style={[styles.title, titleStyle]}
                        >
                            {tab}
                        </TemplateText>
                    </TemplateTouchable>
                ))}
        </View>
    );
};

export default ToggleTab;

ToggleTab.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeTab: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    backgroundColor: PropTypes.string,
    activeBackgroundColor: PropTypes.string,
    titleStyle: PropTypes.shape({}),
    disabledTabs: PropTypes.arrayOf(PropTypes.string),
    activeTextColor: PropTypes.string,
    style: PropTypes.shape({}),
};

ToggleTab.defaultProps = {
    onPress: null,
    backgroundColor: BLACK_10,
    activeBackgroundColor: WHITE_50,
    titleStyle: null,
    disabledTabs: [],
    activeTextColor: WHITE,
    style: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: WRAPPED_SCREEN_WIDTH,
        alignSelf: 'center',
        alignItems: 'center',
        height: 46,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    slider: {
        position: 'absolute',
        height: '80%',
        top: 5,
        left: 5,
        borderRadius: 18,
    },
    title: {
        fontSize: 14,
    },
});
