/* eslint-disable react-native/no-color-literals */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import TemplateText from './TemplateText';
import TemplateBox from './TemplateBox';
import { BLACK, BLACK_10, BLACK_20, BRAND_BLUE, GREY_30, WHITE } from '../theme/Colors';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../theme/Layout';
import { supportedLanguages } from '../i18n';
import useTranslation from '../hooks/useTranslation';
import Button from './Button';
import { useAuthContext } from '../context/AuthProvider';

const LanguageSelector = ({ visible, onClose }) => {
    const { language, changeLanguage, t } = useTranslation();
    const { profile, updateProfile, update } = useAuthContext();
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [changing, setChanging] = useState(false);

    // Update selectedLanguage when modal opens or language changes
    useEffect(() => {
        if (visible) {
            setSelectedLanguage(language);
        }
    }, [visible, language]);

    const handleLanguageChange = async () => {
        if (selectedLanguage === language) {
            onClose();
            return;
        }

        setChanging(true);
        try {
            await changeLanguage(selectedLanguage);

            // Update user profile with appLanguage
            if (profile?.id) {
                await updateProfile({ appLanguage: selectedLanguage }, profile.id);

                // Update local profile state to reflect the change
                update('appLanguage', selectedLanguage);
            }

            onClose();
        } catch (error) {
            console.error('Failed to change language:', error);
        } finally {
            setChanging(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} style={styles.container} onPress={e => e.stopPropagation()}>
                    <TemplateBox backgroundColor={WHITE} borderRadius={28} pAll={24}>
                        <TemplateBox mb={20} alignItems="center">
                            <TemplateText size={20} bold>
                                {t('settings.rows.language.title')}
                            </TemplateText>
                        </TemplateBox>

                        <ScrollView
                            style={styles.listContainer}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {supportedLanguages.map(lang => {
                                const isSelected = selectedLanguage === lang.code;
                                return (
                                    <TouchableOpacity
                                        key={lang.code}
                                        style={[styles.languageItem, isSelected && styles.selectedItem]}
                                        onPress={() => setSelectedLanguage(lang.code)}
                                    >
                                        <TemplateBox row alignItems="center" flex={1}>
                                            <TemplateText size={24} mr={12}>
                                                {lang.flag}
                                            </TemplateText>
                                            <TemplateBox flex={1}>
                                                <TemplateText size={16} medium color={BLACK}>
                                                    {lang.nativeName}
                                                </TemplateText>
                                                <TemplateText size={13} color={GREY_30} mt={2}>
                                                    {lang.name}
                                                </TemplateText>
                                            </TemplateBox>
                                        </TemplateBox>
                                        {isSelected && (
                                            <View style={styles.checkmark}>
                                                <TemplateText size={18} color={BRAND_BLUE} bold>
                                                    ✓
                                                </TemplateText>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <TemplateBox mt={20} row>
                            <Button
                                title={t('common.actions.cancel')}
                                onPress={onClose}
                                style={[styles.button, styles.cancelButton]}
                                height={48}
                                color={BLACK_20}
                                textColor={BLACK}
                            />
                            <View style={styles.buttonSpacer} />
                            <Button
                                title={t('common.actions.save')}
                                onPress={handleLanguageChange}
                                style={styles.button}
                                height={48}
                                disabled={changing}
                            />
                        </TemplateBox>
                    </TemplateBox>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: SCREEN_WIDTH * 0.9,
        maxWidth: 450,
    },
    listContainer: {
        maxHeight: SCREEN_HEIGHT * 0.4,
    },
    listContent: {
        paddingBottom: 10,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 20,
        marginBottom: 10,
        backgroundColor: BLACK_10,
        borderWidth: 2,
        borderColor: 'transparent',
        alignSelf: 'center',
    },
    selectedItem: {
        backgroundColor: `${BRAND_BLUE}15`,
        borderColor: BRAND_BLUE,
    },
    checkmark: {
        marginLeft: 12,
    },
    button: {
        flex: 1,
        borderRadius: 26,
    },
    cancelButton: {
        marginRight: 0,
    },
    buttonSpacer: {
        width: 12,
    },
});

LanguageSelector.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default LanguageSelector;
