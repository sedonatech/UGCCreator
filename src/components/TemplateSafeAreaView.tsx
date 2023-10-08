/* eslint-disable react/jsx-props-no-spreading */
import { View, StyleSheet, ViewStyle } from 'react-native';
import React, { PropsWithChildren, ReactElement } from 'react';
import { SafeAreaView, NativeSafeAreaViewProps } from 'react-native-safe-area-context';
import { isAndroid } from '../Utils/Platform';

interface Props extends PropsWithChildren<NativeSafeAreaViewProps> {
    ios?: boolean,
    style?:ViewStyle | ViewStyle[] | null,
    children?: ReactElement | null
    edges?: ('bottom' | 'top' | 'left' | 'right')[]
}

const TemplateSafeAreaView:React.FC<Props> = ({
    ios, style, edges, children, ...restProps
}) => {
    const SafeView = (isAndroid || ios) ? SafeAreaView : View;

    return (
        <SafeView
            edges={edges || ['bottom']}
            style={[styles.container, style]}
            {...restProps}
        >
            {children}
        </SafeView>
    );
};

export default TemplateSafeAreaView;

TemplateSafeAreaView.defaultProps = {
    ios: false,
    style: null,
    children: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
