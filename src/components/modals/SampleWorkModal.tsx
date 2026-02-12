import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Switch,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { createSample, updateSample, uploadCover, pickCoverImage, SampleWork } from '../../lib/sampleWorks';
import useAuthContext from '../../hooks/auth/useAuthContext';
import { BLACK, BLACK_80, BLUE, DARK_GREY, GREY, GREY_SECONDARY, PRIMARY, WHITE } from '../../theme/Colors';
import TemplateText from '../TemplateText';
import { hp } from '../../Utils/getResponsiveSize';
import TemplateBox from '../TemplateBox';
import { SCREEN_WIDTH } from '../../theme/Layout';
import useTranslation from '../../hooks/useTranslation';

type Props = {
    open: boolean;
    onClose: () => void;
    initial?: Partial<SampleWork>;
};

export default function SampleWorkModal({ open, onClose, initial }: Props) {
    const { auth } = useAuthContext();
    const { t } = useTranslation() as { t: (key: string) => string };
    const isEdit = !!initial?.id;
    const [title, setTitle] = useState(initial?.title || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [socialUrl, setSocialUrl] = useState(initial?.socialUrl || '');
    const [visibility, setVisibility] = useState<'public' | 'private'>(initial?.visibility || 'public');
    const [isFeatured, setIsFeatured] = useState<boolean>(!!initial?.isFeatured || true);
    const [showcaseOptIn, setShowcaseOptIn] = useState<boolean>(!!initial?.showcaseOptIn || true);
    const [localCover, setLocalCover] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handlePick() {
        const uri = await pickCoverImage();
        if (uri) setLocalCover(uri);
    }

    function isValidUrl(url: string) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    async function handleSave() {
        try {
            if (!auth?.profile || !title?.trim() || !(localCover || initial?.coverUrl))
                return Alert.alert(t('modals.sampleWork.alerts.requiredFields'));
            if (!!socialUrl && !isValidUrl(socialUrl)) return Alert.alert(t('modals.sampleWork.alerts.invalidUrl'));
            setLoading(true);
            try {
                let coverUrl = (initial?.coverUrl as string) || '';
                if (localCover) {
                    coverUrl = await uploadCover(localCover, auth?.profile?.id, initial?.id as string | undefined);
                }
                if (isEdit) {
                    await updateSample(initial!.id!, {
                        title,
                        description,
                        socialUrl,
                        isFeatured,
                        showcaseOptIn,
                        visibility,
                        coverUrl,
                    });
                } else {
                    await createSample({
                        ownerId: auth?.profile?.id,
                        title,
                        description,
                        socialUrl,
                        isFeatured,
                        showcaseOptIn,
                        visibility,
                        coverUrl,
                        rand: Math.random(),
                    });
                }
                onClose();
            } finally {
                setLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Modal visible={open} animationType="slide" transparent>
            <View
                style={{
                    flex: 1,
                    backgroundColor: BLACK_80,
                    justifyContent: 'flex-end',
                }}
            >
                <TemplateBox flex width={SCREEN_WIDTH} onPress={onClose} />
                <View
                    style={{
                        backgroundColor: WHITE,
                        padding: 16,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        maxHeight: '88%',
                    }}
                >
                    <ScrollView>
                        <Text style={{ fontSize: 18, fontWeight: '700' }}>
                            {isEdit ? t('modals.sampleWork.editTitle') : t('modals.sampleWork.addTitle')}
                        </Text>

                        <TouchableOpacity
                            onPress={handlePick}
                            style={{
                                marginTop: 16,
                                padding: 12,
                                borderWidth: 1,
                                borderColor: GREY_SECONDARY,
                                borderRadius: 12,
                            }}
                        >
                            <Text>
                                {localCover ? t('modals.sampleWork.changeCover') : t('modals.sampleWork.pickCover')}
                            </Text>
                            {(localCover || initial?.coverUrl) && (
                                <Text style={{ color: DARK_GREY, marginTop: 8 }} numberOfLines={1}>
                                    {localCover || initial?.coverUrl}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder={t('modals.sampleWork.titlePlaceholder')}
                            placeholderTextColor={GREY}
                            style={{
                                borderWidth: 1,
                                borderColor: GREY_SECONDARY,
                                borderRadius: 12,
                                padding: 12,
                                marginTop: 12,
                            }}
                        />

                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder={t('modals.sampleWork.descriptionPlaceholder')}
                            placeholderTextColor={GREY}
                            multiline
                            style={{
                                borderWidth: 1,
                                borderColor: GREY_SECONDARY,
                                borderRadius: 12,
                                padding: 12,
                                marginTop: 12,
                                minHeight: 90,
                            }}
                        />

                        <TextInput
                            value={socialUrl}
                            onChangeText={setSocialUrl}
                            placeholder={t('modals.sampleWork.socialLinkPlaceholder')}
                            placeholderTextColor={GREY}
                            style={{
                                borderWidth: 1,
                                borderColor: GREY_SECONDARY,
                                borderRadius: 12,
                                padding: 12,
                                marginTop: 12,
                            }}
                        />

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 16,
                            }}
                        >
                            <Text>{t('modals.sampleWork.featuredLabel')}</Text>
                            <Switch value={isFeatured} onValueChange={setIsFeatured} />
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 12,
                            }}
                        >
                            <Text>{t('modals.sampleWork.showcaseLabel')}</Text>
                            <Switch value={showcaseOptIn} onValueChange={setShowcaseOptIn} />
                        </View>

                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={loading}
                            style={{
                                backgroundColor: BLUE,
                                padding: 14,
                                borderRadius: 12,
                                alignItems: 'center',
                                marginTop: 20,
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color={PRIMARY} />
                            ) : (
                                <Text style={{ color: '#fff', fontWeight: '700' }}>
                                    {isEdit ? t('modals.sampleWork.saveButton') : t('modals.sampleWork.addButton')}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} style={{ padding: 14, alignItems: 'center', marginTop: 8 }}>
                            <TemplateText color={BLACK} medium size={hp(14)}>
                                {t('modals.sampleWork.closeButton')}
                            </TemplateText>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
