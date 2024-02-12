import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
    HEADER_MARGIN, IS_ANDROID, SCREEN_WIDTH, WRAPPED_SCREEN_WIDTH,
} from '../../../theme/Layout';
import { LIGHT_PURPLE, TRANSPARENT, WHITE } from '../../../theme/Colors';
import TemplateBox from '../../../components/TemplateBox';
import TemplateText from '../../../components/TemplateText';
import useFeatureFlags from '../../../hooks/featureFlags/useFeatureFlags';
import { wp } from '../../../Utils/getResponsiveSize';
import { WEBVIEW } from '../../../navigation/ScreenNames';

const AffiliateBrandsScreen = ({ navigation }) => {
    const { affiliate } = useFeatureFlags();

    const affiliateBrands = affiliate?.brands;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
        >
            <TemplateBox
                mt={HEADER_MARGIN}
                alignItems="center"
                justifyContent="center"
            >
                <TemplateText
                    size={18}
                    startCase
                    bold
                    center
                >
                    Brand ambassador, influencer and affiliate programs
                </TemplateText>
                <TemplateBox>
                    {affiliateBrands?.map(({ name, link }) => (
                        <TemplateBox
                            borderRadius={wp(16)}
                            backgroundColor={LIGHT_PURPLE}
                            pAll={wp(16)}
                            onPress={() => navigation.navigate(WEBVIEW, { url: link })}
                            style={styles.card}
                            width={WRAPPED_SCREEN_WIDTH}
                            height={wp(110)}
                            center
                            mt={wp(8)}
                        >
                            <TemplateText
                                startCase
                                size={wp(16)}
                                semiBold
                            >
                                {name}
                            </TemplateText>
                            <TemplateBox height={wp(8)} />
                            <TemplateText
                                size={wp(12)}

                            >
                                Dive into descriptions, insights with just a tap.
                            </TemplateText>
                        </TemplateBox>
                    ))}
                </TemplateBox>
            </TemplateBox>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: IS_ANDROID ? TRANSPARENT : WHITE,
    },
    contentContainer: {
        flexGrow: 1,
    },
});
export default AffiliateBrandsScreen;
