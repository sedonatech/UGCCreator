import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {METAL, OFF_WHITE, ONBOARDING_BLUE, WHITE,
} from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import {
    HEADER_MARGIN, SCREEN_HEIGHT, SCREEN_WIDTH,
} from '../../theme/Layout';

import BrandLogo from '../../../assets/svgs/BrandLogo';
import TemplateBox from '../../components/TemplateBox';
import useFeatureFlags from '../../hooks/featureFlags/useFeatureFlags';
import OnboardingCarousel from '../../components/carousels/OnboardingCarousel';
import { ONBOARDING } from '../../navigation/ScreenNames';
import TemplateIcon from '../../components/TemplateIcon';
import { hp, wp } from '../../Utils/getResponsiveSize';

const OnboardingEducationScreen = ({ navigation }) => {
    const { onboardingEducation } = useFeatureFlags();

    const onboardingContent = onboardingEducation?.content || [];

    const [activeIndex, setActiveIndex] = useState(0);

    const carouselRef = React.useRef(null);
    const handleNext = () => {
        if (activeIndex === onboardingContent?.length - 1) {
            navigation.navigate(ONBOARDING);
        } else {
            setActiveIndex(activeIndex + 1);
            carouselRef?.current?.scrollToIndex({
                index: activeIndex + 1,
                animated: true,
                useNativeDriver: true,
            });
        }
    };

    return (
        <View style={styles.container}>
            <TemplateBox height={HEADER_MARGIN / 2} />
            <BrandLogo height={45} width={SCREEN_WIDTH / 1.4} />
            <TemplateBox
                height={SCREEN_HEIGHT * 0.6}
                width={SCREEN_WIDTH}
                borderRadius={30}
                top={(150)}
                absolute
            >
                <OnboardingCarousel
                    showPagination
                    dots
                    data={onboardingContent}
                    renderItem={({ item, index }) => (
                        <TemplateBox justifyContent='center' alignItems='center' width={SCREEN_WIDTH}>
                            <TemplateBox height={hp(475)} width={SCREEN_WIDTH} mb={-180} alignItems='center'  >
                                <Image source={{uri: item?.image}} style={{width: '100%', height: '100%', alignSelf: 'center', resizeMode: 'contain'}} />
                            </TemplateBox>
                        <TemplateBox
                            width={SCREEN_WIDTH}
                            ph={wp(35)}
                            alignItems="center"
                            height={200}
                            // pt={40}
                            backgroundColor={WHITE}
                            style={styles.shadow}
                        >
                            <TemplateText
                                size={21}
                                semiBold
                                center
                                mb={8}
                            >
                                {item?.title}
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={15}
                                center
                                light
                                color={METAL}
                            >
                                {item?.message}
                            </TemplateText>
                        </TemplateBox>
                        </TemplateBox>
                    )}
                    paginationSize={onboardingContent?.length}
                    snapToInterval={SCREEN_WIDTH}
                    flex={1}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    ref={carouselRef}
                />
            </TemplateBox> 
            <TemplateBox absolute top={SCREEN_HEIGHT - 110} ph={35} width={SCREEN_WIDTH} row justifyContent='space-between'>
                <TemplateBox backgroundColor={OFF_WHITE} ph={25} pv={18} borderRadius={13} onPress={() =>  navigation.navigate(ONBOARDING)}>
                    <TemplateText size={16} semiBold caps>
                        Skip
                    </TemplateText>
                </TemplateBox>


                <TemplateBox backgroundColor={ONBOARDING_BLUE} ph={34} pv={18} borderRadius={13} row center onPress={handleNext}>
                    <TemplateText color={WHITE} size={16} semiBold caps mr={19}>
                        Next
                    </TemplateText>
                    <TemplateIcon name="arrow-forward" color={WHITE} size={20} />
                </TemplateBox>
            </TemplateBox>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
        alignItems: 'center',
    },
    linearGradient: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: 240,
        borderRadius: 16,
        bottom: 0
    },
    shadow:{
        shadowColor: "#ffffff40", // Black shadow
shadowOffset: {
  width: 20,
  height: 10, // Positive height for shadow at the bottom
},
shadowOpacity: 1, // Light opacity for a soft shadow
shadowRadius: 16, // Higher radius for a soft, diffused shadow
elevation: 10,
    }
});
export default OnboardingEducationScreen;
