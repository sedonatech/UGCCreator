import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import ModalBase from './ModalBase';
import { BLACK, BLACK_10, BLACK_30, BLACK_SECONDARY, DARK_GREY, GREY_30, WHITE } from '../../theme/Colors';
import TemplateBox from '../TemplateBox';
import { SCREEN_WIDTH, WRAPPER_MARGIN } from '../../theme/Layout';
import TemplateText from '../TemplateText';
import TemplateIcon from '../TemplateIcon';
import TemplateTextInput from '../TemplateTextInput';
import Button from '../Button';
import { MetricsForm } from '../../screens/app/home/ChallengeDetailsScreen';
import { isIOS } from '../../Utils/Platform';

type MetricFieldKey = keyof MetricsForm;

type MetricFieldConfig = {
    key: MetricFieldKey;
    label: string;
    placeholder: string;
};

const METRIC_FIELDS: MetricFieldConfig[] = [
    {
        key: 'title',
        label: 'Title',
        placeholder: 'eg.Morning Glow-Up with UGCCreator app',
    },
    {
        key: 'views',
        label: 'Views',
        placeholder: 'Enter number of views',
    },
    {
        key: 'likes',
        label: 'Likes',
        placeholder: 'Enter number of likes',
    },
    {
        key: 'comments',
        label: 'Number of comments',
        placeholder: 'Enter number of comments',
    },
    {
        key: 'shares',
        label: 'Shares',
        placeholder: 'Enter number of shares',
    },
    {
        key: 'saves',
        label: 'Saves',
        placeholder: 'Enter number of saves',
    },
];
const NUMERIC_METRIC_KEYS: MetricFieldKey[] = ['views', 'likes', 'comments', 'shares', 'saves'];

interface ChallengeSubmissionModalProps {
    visible: boolean;
    closeOnPress: () => void;
    videoUrl: string;
    setVideoUrl: (url: string) => void;
    metricsForm: MetricsForm;
    handleMetricChange: (field: keyof MetricsForm, value: string) => void;
    onSave: () => void;
    saving: boolean;
}

const ChallengeSubmissionModal: React.FC<ChallengeSubmissionModalProps> = ({
    visible,
    closeOnPress,
    videoUrl,
    setVideoUrl,
    metricsForm,
    handleMetricChange,
    onSave,
    saving,
}) => {
    const isVideoValid = videoUrl.trim().length > 0;
    const isTitleValid = metricsForm.title.trim().length > 0;

    const allRequiredNumericFilled = NUMERIC_METRIC_KEYS.every(key => metricsForm[key].trim().length > 0);
    const allRequiredNumericValid = NUMERIC_METRIC_KEYS.every(key => /^[0-9]+$/.test(metricsForm[key]));

    const isFormValid = isVideoValid && isTitleValid && allRequiredNumericFilled && allRequiredNumericValid && !saving;
    return (
        <ModalBase visible={visible} closeOnPress={closeOnPress} style={styles.modal}>
            <KeyboardAvoidingView
                behavior={isIOS ? 'padding' : undefined}
                style={styles.flexBackgroundWhite}
                enabled={visible}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.flexBackgroundWhite}
                    keyboardShouldPersistTaps="handled"
                >
                    <TemplateBox ph={WRAPPER_MARGIN} backgroundColor={WHITE} pAll={16} mt={60}>
                        <TemplateBox row justifyContent="space-between" alignItems="center" mb={20}>
                            <TemplateText size={18} semiBold color={BLACK_SECONDARY}>
                                Your Entries
                            </TemplateText>
                            <TemplateBox onPress={closeOnPress}>
                                <TemplateIcon name="close" color={BLACK_SECONDARY} size={26} />
                            </TemplateBox>
                        </TemplateBox>

                        {/* Video URL */}
                        <TemplateBox mb={16}>
                            <TemplateText size={16} color={BLACK_SECONDARY} semiBold ml={10}>
                                Video URL
                            </TemplateText>
                            <TemplateTextInput
                                placeholder="Enter video URL"
                                value={videoUrl}
                                onChangeText={setVideoUrl}
                                style={styles.input}
                                focus={false}
                                disabled={false}
                                placeholderTextColor={DARK_GREY}
                                placeholderStyle={{}}
                            />
                        </TemplateBox>

                        {/* Metrics inputs mapped from config */}
                        {METRIC_FIELDS.map(field => (
                            <TemplateBox key={field.key} mb={20}>
                                <TemplateText size={16} color={BLACK_SECONDARY} semiBold ml={10}>
                                    {field.label}
                                </TemplateText>
                                <TemplateTextInput
                                    placeholder={field.placeholder}
                                    value={metricsForm[field.key]}
                                    onChangeText={(text: string) => handleMetricChange(field.key, text)}
                                    style={styles.input}
                                    focus={false}
                                    disabled={false}
                                    placeholderTextColor={DARK_GREY}
                                    placeholderStyle={{}}
                                    keyboardType={field.key === 'title' ? 'default' : 'numeric'}
                                />
                            </TemplateBox>
                        ))}
                    </TemplateBox>
                    <TemplateBox mb={30} alignItems="center">
                        <Button
                            title={'Submit Entry'}
                            height={50}
                            width={SCREEN_WIDTH - 40}
                            color={BLACK}
                            onPress={() => {
                                if (!isFormValid) {
                                    Alert.alert(
                                        'Invalid Input',
                                        'Please fill all fields with valid data before submitting.',
                                    );
                                    return;
                                }
                                onSave();
                                setTimeout(() => {
                                    closeOnPress();
                                }, 100);
                            }}
                            disabled={
                                !videoUrl.trim() ||
                                metricsForm.views.trim() === '' ||
                                metricsForm.likes.trim() === '' ||
                                metricsForm.comments.trim() === '' ||
                                metricsForm.shares.trim() === '' ||
                                metricsForm.saves.trim() === '' ||
                                metricsForm.title.trim() === '' ||
                                saving
                            }
                            loading={saving}
                        />
                    </TemplateBox>
                </ScrollView>
            </KeyboardAvoidingView>
        </ModalBase>
    );
};

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 0,
        backgroundColor: BLACK_30,
    },
    input: {
        height: 60,
        width: '100%',
        borderRadius: 26,
        paddingLeft: 16,
        marginTop: 6,
        borderColor: BLACK_10,
        backgroundColor: GREY_30,
        alignSelf: 'center',
    },
    flexBackgroundWhite: { flex: 1, backgroundColor: WHITE },
});

export default ChallengeSubmissionModal;
