/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';
import useTranslation from '../../../../hooks/useTranslation';
import {
    ZINC_900,
    ZINC_500,
    WHITE,
    SLATE_50,
    GRAY_200,
    GRAY_300,
    INDIGO_100,
    INDIGO_200,
    INDIGO_600,
    INDIGO_700,
    PINK_100,
    PINK_200,
    PINK_600,
    EMERALD_100,
    EMERALD_200,
    EMERALD_600,
    AMBER_50,
    AMBER_200,
    AMBER_600,
} from '../../../../theme/Colors';

const TAG_STYLES = {
    Learn: {
        backgroundColor: INDIGO_100,
        borderWidth: 1,
        borderColor: INDIGO_200,
    },
    Action: {
        backgroundColor: PINK_100,
        borderWidth: 1,
        borderColor: PINK_200,
    },
    Build: {
        backgroundColor: EMERALD_100,
        borderWidth: 1,
        borderColor: EMERALD_200,
    },
    Review: {
        backgroundColor: AMBER_50,
        borderWidth: 1,
        borderColor: AMBER_200,
    },
};

const TAG_TEXT_COLORS = {
    Learn: INDIGO_700,
    Action: PINK_600,
    Build: EMERALD_600,
    Review: AMBER_600,
};

const TAG_TYPE_BY_KEY = {
    learn: 'Learn',
    lernen: 'Learn',
    aprende: 'Learn',
    apprendre: 'Learn',
    aprender: 'Learn',
    action: 'Action',
    accion: 'Action',
    aktion: 'Action',
    acao: 'Action',
    build: 'Build',
    construye: 'Build',
    construire: 'Build',
    construir: 'Build',
    erstellen: 'Build',
    review: 'Review',
    revisa: 'Review',
    revision: 'Review',
    revisao: 'Review',
    uberprufung: 'Review',
};

const normalizeTagKey = value =>
    (value || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

const resolveTagType = tag => TAG_TYPE_BY_KEY[normalizeTagKey(tag)] || 'Learn';

const TaskCard = ({ task, index, isComplete, onToggle, onOpenDetails, dayNumber, disabled }) => {
    const { t } = useTranslation();
    const tagType = resolveTagType(task.tag);
    const tagStyle = TAG_STYLES[tagType] || TAG_STYLES.Learn;
    const tagTextColor = TAG_TEXT_COLORS[tagType] || TAG_TEXT_COLORS.Learn;

    return (
        <TemplateBox key={`${dayNumber}-${index}`} style={styles.taskCard}>
            <TemplateBox
                style={isComplete ? styles.checkBox : styles.uncheckedBox}
                onPress={() => onToggle(index)}
                disabled={disabled}
            >
                {isComplete && <TemplateIcon name="checkmark" size={12} color={WHITE} />}
            </TemplateBox>
            <TemplateBox style={styles.taskContent} onPress={() => onOpenDetails(index)} disabled={disabled}>
                <TemplateText size={14} medium color={styles.textPrimary.color} mb={4}>
                    {task.title}
                </TemplateText>
                <TemplateText size={12} color={styles.textMuted.color} lineHeight={18}>
                    {task.description}
                </TemplateText>
                <TemplateBox row alignItems="center" mt={8} justifyContent="space-between">
                    <TemplateBox row alignItems="center">
                        <TemplateBox style={[styles.tagPill, tagStyle]}>
                            <TemplateText size={10} color={tagTextColor}>
                                {task.tag}
                            </TemplateText>
                        </TemplateBox>
                        <TemplateText size={11} color={styles.textMuted.color} ml={8}>
                            {t('courses.task.duration', { minutes: task.durationMinutes })}
                        </TemplateText>
                    </TemplateBox>
                    <TemplateBox style={[styles.tagPill, tagStyle]}>
                        <TemplateText size={10} color={tagTextColor} medium>
                            {t('courses.task.viewDetails')}
                        </TemplateText>
                    </TemplateBox>
                </TemplateBox>
            </TemplateBox>
        </TemplateBox>
    );
};

TaskCard.propTypes = {
    task: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        tag: PropTypes.string,
        durationMinutes: PropTypes.number,
    }).isRequired,
    index: PropTypes.number.isRequired,
    isComplete: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onOpenDetails: PropTypes.func.isRequired,
    dayNumber: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
};

export default TaskCard;

const styles = StyleSheet.create({
    taskCard: {
        flexDirection: 'row',
        gap: 12,
        padding: 14,
        borderRadius: 16,
        backgroundColor: SLATE_50,
        borderWidth: 1,
        borderColor: GRAY_200,
        marginBottom: 12,
    },
    checkBox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        backgroundColor: INDIGO_600,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
        borderWidth: 1,
        borderColor: INDIGO_600,
    },
    uncheckedBox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: GRAY_300,
        marginTop: 2,
    },
    taskContent: {
        flex: 1,
    },
    tagPill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
    },
    textPrimary: {
        color: ZINC_900,
    },
    textMuted: {
        color: ZINC_500,
    },
});
