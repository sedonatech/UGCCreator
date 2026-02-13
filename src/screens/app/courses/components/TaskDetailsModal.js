/* eslint-disable react-native/no-color-literals */
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import ModalBase from '../../../../components/modals/ModalBase';
import TemplateBox from '../../../../components/TemplateBox';
import TemplateText from '../../../../components/TemplateText';
import TemplateIcon from '../../../../components/TemplateIcon';
import Button from '../../../../components/Button';
import useTranslation from '../../../../hooks/useTranslation';
import {
    BLACK_30,
    WHITE,
    ZINC_900,
    ZINC_700,
    ZINC_500,
    SLATE_100,
    INDIGO_50,
    INDIGO_100,
    INDIGO_600,
    GRAY_200,
} from '../../../../theme/Colors';

const TaskDetailsModal = ({ visible, task, onClose, onToggleComplete, isComplete }) => {
    const { t } = useTranslation();
    const details = task?.details || {};
    const steps = Array.isArray(details.steps) ? details.steps : [];
    const resources = Array.isArray(details.resources) ? details.resources : [];

    return (
        <ModalBase visible={visible} closeOnPress={onClose} style={styles.modal}>
            <TemplateBox style={styles.sheet}>
                <TemplateBox row justifyContent="space-between" alignItems="center" mb={12}>
                    <TemplateBox style={styles.tagPill}>
                        <TemplateText size={10} medium color={INDIGO_600}>
                            {task?.tag || t('courses.task.label')}
                        </TemplateText>
                    </TemplateBox>
                    <TemplateBox onPress={onClose}>
                        <TemplateIcon name="close" size={24} color={ZINC_500} />
                    </TemplateBox>
                </TemplateBox>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <TemplateText size={19} semiBold color={ZINC_900}>
                        {task?.title}
                    </TemplateText>

                    <TemplateText size={13} color={ZINC_700} lineHeight={20} mt={8}>
                        {task?.description}
                    </TemplateText>

                    {!!details.overview && (
                        <TemplateBox style={styles.infoSection}>
                            <TemplateText size={12} semiBold color={styles.sectionTitle.color} mb={6}>
                                {t('courses.taskDetails.overview')}
                            </TemplateText>
                            <TemplateText size={12} color={ZINC_700} lineHeight={18}>
                                {details.overview}
                            </TemplateText>
                        </TemplateBox>
                    )}

                    {!!details.whyItMatters && (
                        <TemplateBox style={styles.infoSection}>
                            <TemplateText size={12} semiBold color={styles.sectionTitle.color} mb={6}>
                                {t('courses.taskDetails.whyItMatters')}
                            </TemplateText>
                            <TemplateText size={12} color={ZINC_700} lineHeight={18}>
                                {details.whyItMatters}
                            </TemplateText>
                        </TemplateBox>
                    )}

                    {!!steps.length && (
                        <TemplateBox style={styles.infoSection}>
                            <TemplateText size={12} semiBold color={styles.sectionTitle.color} mb={8}>
                                {t('courses.taskDetails.steps')}
                            </TemplateText>
                            {steps.map((step, index) => (
                                <TemplateBox key={`${task?.title}-step-${index}`} row alignItems="flex-start" mb={6}>
                                    <TemplateBox style={styles.stepDot}>
                                        <TemplateText size={10} color={WHITE} semiBold>
                                            {index + 1}
                                        </TemplateText>
                                    </TemplateBox>
                                    <TemplateText size={12} color={ZINC_700} lineHeight={18} style={styles.stepText}>
                                        {step}
                                    </TemplateText>
                                </TemplateBox>
                            ))}
                        </TemplateBox>
                    )}

                    {!!details.deliverable && (
                        <TemplateBox style={styles.infoSection}>
                            <TemplateText size={12} semiBold color={styles.sectionTitle.color} mb={6}>
                                {t('courses.taskDetails.deliverable')}
                            </TemplateText>
                            <TemplateText size={12} color={ZINC_700} lineHeight={18}>
                                {details.deliverable}
                            </TemplateText>
                        </TemplateBox>
                    )}

                    {!!resources.length && (
                        <TemplateBox style={styles.infoSection}>
                            <TemplateText size={12} semiBold color={styles.sectionTitle.color} mb={8}>
                                {t('courses.taskDetails.suggestedSources')}
                            </TemplateText>
                            {resources.map((resource, index) => (
                                <TemplateText
                                    key={`${task?.title}-resource-${index}`}
                                    size={12}
                                    color={ZINC_700}
                                    lineHeight={18}
                                    mb={4}
                                >
                                    {`\u2022 ${resource}`}
                                </TemplateText>
                            ))}
                        </TemplateBox>
                    )}

                    {!!details.doneWhen && (
                        <TemplateBox style={styles.doneWhenSection}>
                            <TemplateText size={11} semiBold color={INDIGO_600} mb={4}>
                                {t('courses.taskDetails.doneWhen')}
                            </TemplateText>
                            <TemplateText size={12} color={ZINC_700} lineHeight={18}>
                                {details.doneWhen}
                            </TemplateText>
                        </TemplateBox>
                    )}

                    <TemplateBox mt={20} mb={24}>
                        <Button
                            title={
                                isComplete
                                    ? t('courses.taskDetails.markIncomplete')
                                    : t('courses.taskDetails.markComplete')
                            }
                            onPress={onToggleComplete}
                            height={48}
                        />
                    </TemplateBox>
                </ScrollView>
            </TemplateBox>
        </ModalBase>
    );
};

TaskDetailsModal.propTypes = {
    visible: PropTypes.bool,
    task: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        tag: PropTypes.string,
        details: PropTypes.shape({
            overview: PropTypes.string,
            whyItMatters: PropTypes.string,
            steps: PropTypes.arrayOf(PropTypes.string),
            deliverable: PropTypes.string,
            resources: PropTypes.arrayOf(PropTypes.string),
            doneWhen: PropTypes.string,
        }),
    }),
    onClose: PropTypes.func.isRequired,
    onToggleComplete: PropTypes.func.isRequired,
    isComplete: PropTypes.bool,
};

TaskDetailsModal.defaultProps = {
    visible: false,
    task: null,
    isComplete: false,
};

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 0,
        backgroundColor: BLACK_30,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: WHITE,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 16,
        maxHeight: '86%',
    },
    infoSection: {
        marginTop: 14,
        borderWidth: 1,
        borderColor: GRAY_200,
        borderRadius: 12,
        padding: 12,
        backgroundColor: SLATE_100,
    },
    doneWhenSection: {
        marginTop: 14,
        borderWidth: 1,
        borderColor: INDIGO_100,
        borderRadius: 12,
        padding: 12,
        backgroundColor: INDIGO_50,
    },
    tagPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: INDIGO_50,
        borderWidth: 1,
        borderColor: INDIGO_100,
    },
    sectionTitle: {
        color: ZINC_900,
    },
    stepDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: INDIGO_600,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },
    stepText: {
        flex: 1,
        marginLeft: 8,
    },
});

export default TaskDetailsModal;
