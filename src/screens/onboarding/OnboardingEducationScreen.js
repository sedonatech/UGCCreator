import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    ACCENT, BLACK,

    BRAND_BLUE, WHITE,
} from '../../theme/Colors';
import TemplateText from '../../components/TemplateText';
import {
    HEADER_MARGIN, SCREEN_HEIGHT, SCREEN_WIDTH,
} from '../../theme/Layout';

import BrandLogo from '../../../assets/svgs/BrandLogo';
import TemplateBox from '../../components/TemplateBox';
import { SHADOW } from '../../theme/Shadow';
import useFeatureFlags from '../../hooks/featureFlags/useFeatureFlags';
import OnboardingCarousel from '../../components/carousels/OnboardingCarousel';
import { ONBOARDING } from '../../navigation/ScreenNames';

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
            });
        }
    };

    return (
        <View style={styles.container}>
            <TemplateBox height={HEADER_MARGIN} />
            <BrandLogo height={140} width={SCREEN_WIDTH / 1.4} />

            <TemplateBox
                height={300}
                width={SCREEN_WIDTH - 40}
                borderRadius={30}
                top={(SCREEN_HEIGHT / 1.8)}
                left={20}
                style={SHADOW('card', ACCENT)}
                pv={40}
                absolute
            >
                <OnboardingCarousel
                    showPagination
                    data={onboardingContent}
                    renderItem={({ item }) => (
                        <TemplateBox
                            width={SCREEN_WIDTH / 1.4}
                            mh={40}
                            alignItems="center"
                            justifyContent="center"
                            mv={20}

                        >
                            <TemplateText
                                size={17}
                                bold
                                center
                            >
                                {item?.title}
                            </TemplateText>
                            <TemplateBox height={10} />
                            <TemplateText
                                size={15}
                                center
                            >
                                {item?.message}
                            </TemplateText>
                        </TemplateBox>
                    )}
                    paginationSize={onboardingContent?.length}
                    snapToInterval={SCREEN_WIDTH - 40}
                    flex={1}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    ref={carouselRef}
                />
                <TemplateBox
                    height={40}
                    width={120}
                    borderRadius={30}
                    backgroundColor={BLACK}
                    selfCenter
                    mt={20}
                    alignItems="center"
                    justifyContent="center"
                    onPress={handleNext}
                >

                    <TemplateText
                        size={16}
                        center
                        bold
                        color={WHITE}
                    >
                        Next
                    </TemplateText>
                </TemplateBox>
            </TemplateBox>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BRAND_BLUE,
        alignItems: 'center',
    },
});
export default OnboardingEducationScreen;
