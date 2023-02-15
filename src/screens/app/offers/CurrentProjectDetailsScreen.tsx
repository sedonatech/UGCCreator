import React, { FC, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import { GREY_SECONDARY, WHITE, WHITE_40 } from '../../../theme/Colors';
import HeaderIconButton from '../../../components/header/HeaderButton';
import { WRAPPER_MARGIN } from '../../../theme/Layout';

interface Props {
    route: any;
    navigation: any;
}
const CurrentProjectDetailsScreen: FC<Props> = ({ route, navigation }) => {
    const projectId = route?.params?.projectId;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderIconButton
                    name="arrow-back-outline"
                    onPress={() => navigation.goBack()}
                    backDropColor={GREY_SECONDARY}
                    ml={WRAPPER_MARGIN}
                />
            )
        });
    }, [navigation]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <TemplateBox>
                <TemplateText>Offer</TemplateText>
            </TemplateBox>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE
    },
    contentContainer: {
        flexGrow: 1,
    }
});
export default CurrentProjectDetailsScreen;
