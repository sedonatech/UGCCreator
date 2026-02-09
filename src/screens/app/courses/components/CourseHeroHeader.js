import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';
import { INDIGO_PURPLE_PINK_GRADIENT, WHITE, WHITE_20, WHITE_BG_08, SLATE_950 } from '../../../../theme/Colors';
import useTranslation from '../../../../hooks/useTranslation';

const CourseHeroHeader = ({ course, totalDays, onReset }) => {
    const { t } = useTranslation();
    return (
        <TemplateBox style={styles.hero}>
            <LinearGradient colors={course?.gradient || INDIGO_PURPLE_PINK_GRADIENT} style={styles.heroGradient} />
            <TemplateBox style={styles.heroOverlay} />
            <TemplateBox style={styles.resetButton} onPress={onReset} center>
                <TemplateIcon name="refresh" size={14} color={WHITE} />
                <TemplateText size={12} color={WHITE} ml={6} medium>
                    {t('courses.details.reset')}
                </TemplateText>
            </TemplateBox>
            <TemplateBox style={styles.heroPill}>
                <TemplateText size={12} medium color={WHITE}>
                    {t('courses.details.dayProgram', { count: totalDays || 30 })}
                </TemplateText>
            </TemplateBox>
        </TemplateBox>
    );
};

CourseHeroHeader.propTypes = {
    course: PropTypes.shape({
        gradient: PropTypes.array,
    }),
    totalDays: PropTypes.number,
    onReset: PropTypes.func.isRequired,
};

export default CourseHeroHeader;

const styles = StyleSheet.create({
    hero: {
        height: 160,
        position: 'relative',
    },
    heroGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    heroOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: WHITE_BG_08,
    },
    heroPill: {
        position: 'absolute',
        left: 24,
        bottom: 32,
        backgroundColor: WHITE_20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    resetButton: {
        position: 'absolute',
        right: 20,
        top: 65,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: SLATE_950,
    },
});
