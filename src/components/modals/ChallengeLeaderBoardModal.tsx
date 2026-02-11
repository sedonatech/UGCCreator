import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import ModalBase from './ModalBase';
import { BLACK_10, BLACK_30, BLACK_SECONDARY, GREY_30, METAL, WHITE } from '../../theme/Colors';
import TemplateBox from '../TemplateBox';
import { WRAPPER_MARGIN } from '../../theme/Layout';
import TemplateText from '../TemplateText';
import TemplateIcon from '../TemplateIcon';
import { isIOS } from '../../Utils/Platform';
import { useChallengeSubmission } from '../../hooks/useChallengeSubmission';
import LeaderBoardCard from '../cards/LeaderBoardCard';
import useTranslation from '../../hooks/useTranslation';

interface ChallengeLeaderBoardModalProps {
    visible: boolean;
    closeOnPress: () => void;
    leaderBoardEntries?: ReturnType<typeof useChallengeSubmission>['leaderBoardEntries'];
    topEntry?: ReturnType<typeof useChallengeSubmission>['topEntry'];
    loading?: boolean;
}

const ChallengeLeaderBoardModal: React.FC<ChallengeLeaderBoardModalProps> = ({
    visible,
    closeOnPress,
    leaderBoardEntries,
    topEntry,
    loading,
}) => {
    const { t } = useTranslation();
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
                                {t('challenges.modals.leaderboard.title')}
                            </TemplateText>
                            <TemplateBox onPress={closeOnPress}>
                                <TemplateIcon name="close" color={BLACK_SECONDARY} size={26} />
                            </TemplateBox>
                        </TemplateBox>
                        <TemplateText size={14} color={METAL} mb={16}>
                            {t('challenges.modals.leaderboard.description')}
                        </TemplateText>
                        {/* Leaderboard entries would be rendered here */}

                        {leaderBoardEntries?.slice(0, 10).map((entry, index) => (
                            <LeaderBoardCard key={entry.id} entry={entry} />
                        ))}
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

export default ChallengeLeaderBoardModal;
